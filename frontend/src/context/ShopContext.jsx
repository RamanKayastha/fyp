import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { getProducts } from "../api/products";
import { createOrder } from "../api/orders";

export const ShopContext = createContext();

const formatCategory = (category) => {
    if (category === "MEN") return "Men";
    if (category === "WOMEN") return "Women";
    return category || "";
};

const toShopProduct = (product) => {
    const images = product.images?.length
        ? product.images
        : (product.imageUrl ? [product.imageUrl] : []);

    return {
        ...product,
        _id: String(product.id),
        image: images,
        category: formatCategory(product.category),
        sizes: product.sizes || [],
    };
};

const cartStorageKey = (userId) => `cart_${userId}`;

const ShopContextProvider = (props) => {
    const currency = "Rs.";
    const delivery_fee = 10;
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [cartReady, setCartReady] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, userDTO } = useAuth();

    const refreshProducts = () =>
        getProducts()
            .then((response) => (response.data || []).map(toShopProduct))
            .then(setProducts);

    useEffect(() => {
        let cancelled = false;

        getProducts()
            .then((response) => {
                if (cancelled) return;
                setProducts((response.data || []).map(toShopProduct));
            })
            .catch(() => {
                if (!cancelled) toast.error("Failed to load products");
            });

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!userDTO?.id) {
            setCartItems({});
            setCartReady(false);
            return;
        }

        const stored = localStorage.getItem(cartStorageKey(userDTO.id));
        setCartItems(stored ? JSON.parse(stored) : {});
        setCartReady(true);
    }, [userDTO?.id]);

    useEffect(() => {
        if (!cartReady || !userDTO?.id) return;
        localStorage.setItem(cartStorageKey(userDTO.id), JSON.stringify(cartItems));
    }, [cartItems, cartReady, userDTO?.id]);

    const addToCart = async (itemId, size) => {
        if (!isAuthenticated) {
            toast.error("Please log in to add items to cart");
            navigate("/login");
            return;
        }

        if (!size) {
            toast.error("Please select a size");
            return;
        }

        const product = products.find((item) => item._id === String(itemId));
        if (product && (product.stock ?? 0) <= 0) {
            toast.error("This product is out of stock");
            return;
        }

        let cartData = structuredClone(cartItems);
        const nextQuantity = (cartData[itemId]?.[size] || 0) + 1;
        if (product && nextQuantity > (product.stock ?? 0)) {
            toast.error("Not enough stock for this size");
            return;
        }

        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }
        cartData[itemId][size] = nextQuantity;
        setCartItems(cartData);
        toast.success("Added to cart");
    };

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                if (cartItems[items][item] > 0) {
                    totalCount += cartItems[items][item];
                }
            }
        }
        return totalCount;
    };

    const getCartItems = () => {
        const items = [];
        for (const productId in cartItems) {
            for (const size in cartItems[productId]) {
                const quantity = cartItems[productId][size];
                if (quantity > 0) {
                    items.push({
                        productId: Number(productId),
                        size,
                        quantity,
                    });
                }
            }
        }
        return items;
    };

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        if (!cartData[itemId]) return;
        const nextQuantity = Number(quantity);
        if (Number.isNaN(nextQuantity) || nextQuantity < 1) {
            cartData[itemId][size] = 0;
        } else {
            const product = products.find((item) => item._id === String(itemId));
            const maxStock = product?.stock ?? nextQuantity;
            cartData[itemId][size] = Math.min(nextQuantity, maxStock);
        }
        setCartItems(cartData);
    };

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            const itemInfo = products.find((product) => product._id === String(items));
            if (!itemInfo) continue;
            for (const item in cartItems[items]) {
                if (cartItems[items][item] > 0) {
                    totalAmount += cartItems[items][item] * Number(itemInfo.price);
                }
            }
        }
        return totalAmount;
    };

    const placeOrder = async (delivery, paymentMethod) => {
        const items = getCartItems();
        if (!items.length) {
            throw new Error("Your cart is empty");
        }

        const response = await createOrder({
            ...delivery,
            paymentMethod: String(paymentMethod || "").toUpperCase(),
            items,
        });

        setCartItems({});
        if (userDTO?.id) {
            localStorage.removeItem(cartStorageKey(userDTO.id));
        }
        await refreshProducts().catch(() => {});
        return response.data;
    };

    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        setCartItems,
        addToCart,
        getCartCount,
        getCartItems,
        updateQuantity,
        getCartAmount,
        placeOrder,
        navigate,
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
