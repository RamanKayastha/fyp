import { createContext, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { getProducts } from "../api/products";
import { createOrder } from "../api/orders";
import { isCustomizableProduct } from "../utils/productFlags";
import { lineUnitPrice } from "../utils/pricing";

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
        customizable: isCustomizableProduct(product),
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
    const [customLines, setCustomLines] = useState([]);
    const [cartReady, setCartReady] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, userDTO } = useAuth();

    const refreshProducts = useCallback(
        () =>
            getProducts()
                .then((response) => (response.data || []).map(toShopProduct))
                .then(setProducts),
        []
    );

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
            setCustomLines([]);
            setCartReady(false);
            return;
        }

        const stored = localStorage.getItem(cartStorageKey(userDTO.id));
        if (!stored) {
            setCartItems({});
            setCustomLines([]);
            setCartReady(true);
            return;
        }

        const parsed = JSON.parse(stored);
        if (parsed.items || parsed.customLines) {
            setCartItems(parsed.items || {});
            setCustomLines(parsed.customLines || []);
        } else {
            setCartItems(parsed);
            setCustomLines([]);
        }
        setCartReady(true);
    }, [userDTO?.id]);

    useEffect(() => {
        if (!cartReady || !userDTO?.id) return;
        localStorage.setItem(cartStorageKey(userDTO.id), JSON.stringify({
            items: cartItems,
            customLines,
        }));
    }, [cartItems, customLines, cartReady, userDTO?.id]);

    const addToCart = async (itemId, size, customization = null) => {
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

        if (customization) {
            setCustomLines((prev) => [
                ...prev,
                {
                    lineId: `${itemId}-${size}-${Date.now()}`,
                    productId: String(itemId),
                    size,
                    quantity: 1,
                    customization,
                },
            ]);
            toast.success("Customized item added to cart");
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
        return totalCount + customLines.reduce((sum, line) => sum + (line.quantity || 0), 0);
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
        return items.concat(customLines.map((line) => ({
            productId: Number(line.productId),
            size: line.size,
            quantity: line.quantity,
            customized: true,
            previewFront: line.customization?.previewFront || null,
            previewBack: line.customization?.previewBack || null,
            textCount: line.customization?.layerCounts?.text || 0,
            imageCount: line.customization?.layerCounts?.image || 0,
            graphicsCount: line.customization?.layerCounts?.graphics
              || line.customization?.layerCounts?.logo
              || 0,
        })));
    };

    const updateQuantity = async (itemId, size, quantity, lineId = null) => {
        const nextQuantity = Number(quantity);
        if (lineId) {
            setCustomLines((prev) => {
                if (Number.isNaN(nextQuantity) || nextQuantity < 1) {
                    return prev.filter((line) => line.lineId !== lineId);
                }
                return prev.map((line) => line.lineId === lineId ? { ...line, quantity: nextQuantity } : line);
            });
            return;
        }

        let cartData = structuredClone(cartItems);
        if (!cartData[itemId]) return;
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
        return totalAmount + customLines.reduce((sum, line) => {
            const itemInfo = products.find((product) => product._id === String(line.productId));
            if (!itemInfo) return sum;
            return sum + line.quantity * lineUnitPrice(itemInfo, line.customization);
        }, 0);
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
        setCustomLines([]);
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
        customLines,
        setCartItems,
        addToCart,
        getCartCount,
        getCartItems,
        updateQuantity,
        getCartAmount,
        placeOrder,
        refreshProducts,
        navigate,
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
