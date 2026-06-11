import React, { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { AdminCard, Field, PageHeader, inputClass } from '../../components/admin/AdminUI'

const categories = {
    Men: ['Topwear', 'Bottomwear', 'Winterwear'],
    Women: ['Topwear', 'Bottomwear', 'Winterwear'],
    Kids: ['Topwear', 'Bottomwear', 'Winterwear'],
}

const sizes = ['S', 'M', 'L', 'XL', 'XXL']

const AdminAddItems = () => {
    const [images, setImages] = useState([])
    const [form, setForm] = useState({
        name: '',
        description: '',
        category: 'Men',
        subCategory: 'Topwear',
        price: '',
        sizes: [],
        status: 'Active',
    })
    const [errors, setErrors] = useState({})

    const previews = useMemo(() => images.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
    })), [images])

    const handleFiles = (fileList) => {
        const nextFiles = Array.from(fileList).filter((file) => file.type.startsWith('image/'))
        setImages((prev) => [...prev, ...nextFiles].slice(0, 4))
    }

    const updateForm = (key, value) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
            ...(key === 'category' ? { subCategory: categories[value][0] } : {}),
        }))
        setErrors((prev) => ({ ...prev, [key]: '' }))
    }

    const toggleSize = (size) => {
        setForm((prev) => ({
            ...prev,
            sizes: prev.sizes.includes(size) ? prev.sizes.filter((item) => item !== size) : [...prev.sizes, size],
        }))
        setErrors((prev) => ({ ...prev, sizes: '' }))
    }

    const validate = () => {
        const nextErrors = {}
        if (!form.name.trim()) nextErrors.name = 'Product name is required'
        if (!form.description.trim()) nextErrors.description = 'Product description is required'
        if (!form.price || Number(form.price) <= 0) nextErrors.price = 'Enter a valid price'
        if (!form.sizes.length) nextErrors.sizes = 'Select at least one size'
        if (!images.length) nextErrors.images = 'Upload at least one image'
        setErrors(nextErrors)
        return Object.keys(nextErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!validate()) return
        toast.success('Product saved')
    }

    const handleCancel = () => {
        setImages([])
        setForm({
            name: '',
            description: '',
            category: 'Men',
            subCategory: 'Topwear',
            price: '',
            sizes: [],
            status: 'Active',
        })
        setErrors({})
    }

    return (
        <div>
            <PageHeader
                eyebrow="Catalog"
                title="Add Items"
                description="Create polished product listings with images, categories, pricing, variants, and status controls."
            />

            <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <AdminCard className="space-y-5">
                    <Field label="Product Images Upload" error={errors.images}>
                        <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault()
                                handleFiles(e.dataTransfer.files)
                            }}
                            className=" border border-dashed bg-gray-50 p-6 text-center transition hover:bg-gray-100"
                        >
                            <input
                                id="product-images"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleFiles(e.target.files)}
                                className="hidden"
                            />
                            <label htmlFor="product-images" className="block cursor-pointer">
                                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white text-2xl shadow-sm">+</span>
                                <span className="mt-4 block font-medium text-black">Drop images here or browse</span>
                                <span className="mt-1 block text-sm text-gray-500">Upload up to 4 product images</span>
                            </label>
                        </div>
                    </Field>

                    <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {[0, 1, 2, 3].map((slot) => (
                            <div key={slot} className="aspect-square overflow-hidden  border bg-gray-50">
                                {previews[slot] ? (
                                    <img src={previews[slot].url} alt={previews[slot].name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="grid h-full place-items-center text-xs text-gray-400">Image {slot + 1}</div>
                                )}
                            </div>
                        ))}
                    </div>
                    <Field label="Product Name" error={errors.name}>
                        <input value={form.name} onChange={(e) => updateForm('name', e.target.value)} className={inputClass} placeholder="Women Round Neck Cotton Top" />
                    </Field>

                    <Field label="Product Description" error={errors.description}>
                        <textarea value={form.description} onChange={(e) => updateForm('description', e.target.value)} className={`${inputClass} min-h-32 resize-none`} placeholder="Describe materials, fit, and product highlights" />
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Category">
                            <select value={form.category} onChange={(e) => updateForm('category', e.target.value)} className={inputClass}>
                                {Object.keys(categories).map((category) => <option key={category}>{category}</option>)}
                            </select>
                        </Field>

                        <Field label="Subcategory">
                            <select value={form.subCategory} onChange={(e) => updateForm('subCategory', e.target.value)} className={inputClass}>
                                {categories[form.category].map((subCategory) => <option key={subCategory}>{subCategory}</option>)}
                            </select>
                        </Field>
                    </div>

                    <Field label="Price" error={errors.price}>
                        <input value={form.price} onChange={(e) => updateForm('price', e.target.value)} type="number" min="0" className={inputClass} placeholder="1200" />
                    </Field>

                    <Field label="Sizes" error={errors.sizes}>
                        <div className="flex flex-wrap gap-2">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => toggleSize(size)}
                                    className={` border px-5 py-2 text-sm transition ${form.sizes.includes(size) ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </Field>

                    <Field label="Product Status">
                        <div className="grid grid-cols-2 gap-3">
                            {['Active', 'Draft'].map((status) => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => updateForm('status', status)}
                                    className={` border px-4 py-3 text-sm transition ${form.status === status ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </Field>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button type="submit" className=" bg-black px-6 py-3 text-sm text-white">Save Product</button>
                        <button type="button" onClick={handleCancel} className=" border px-6 py-3 text-sm">Cancel</button>
                    </div>
                </AdminCard>
            </form>
        </div>
    )
}

export default AdminAddItems
