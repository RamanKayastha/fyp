import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AdminCard, Field, PageHeader, inputClass } from '../../components/admin/AdminUI'
import { assets } from '../../assets/admin_assets/assets'
import { createProduct, getProductById, updateProduct } from '../../api/products'
import { uploadImageToCloudinary } from '../../api/cloudinary'

const IMAGE_SLOTS = 4

const categories = [
  { value: 'MEN', label: 'Men' },
  { value: 'WOMEN', label: 'Women' },
]

const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL']

const emptyForm = {
  name: '',
  description: '',
  category: 'MEN',
  price: '',
  stock: '',
  images: [],
  sizes: [],
}

const AdminAddItems = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [fetchedId, setFetchedId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploadingSlots, setUploadingSlots] = useState([])
  const loading = isEdit && fetchedId !== id
  const isUploading = uploadingSlots.length > 0

  useEffect(() => {
    if (!isEdit) return undefined

    let cancelled = false

    getProductById(id)
      .then((response) => {
        if (cancelled) return
        const product = response.data
        const existingImages =
          product.images && product.images.length
            ? product.images
            : product.imageUrl
              ? [product.imageUrl]
              : []
        setForm({
          name: product.name || '',
          description: product.description || '',
          category: product.category || 'MEN',
          price: product.price ?? '',
          stock: product.stock ?? '',
          images: existingImages,
          sizes: product.sizes || [],
        })
        setFetchedId(id)
      })
      .catch(() => {
        if (cancelled) return
        toast.error('Product not found')
        navigate('/admin/items')
      })

    return () => {
      cancelled = true
    }
  }, [id, isEdit, navigate])

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  const handleImageChange = async (index, file) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    setUploadingSlots((prev) => [...prev, index])
    try {
      const url = await uploadImageToCloudinary(file)
      setForm((prev) => {
        const images = [...prev.images]
        images[index] = url
        return { ...prev, images }
      })
      setErrors((prev) => ({ ...prev, images: '' }))
    } catch (error) {
      toast.error(error.message || 'Image upload failed')
    } finally {
      setUploadingSlots((prev) => prev.filter((slot) => slot !== index))
    }
  }

  const removeImage = (index) => {
    setForm((prev) => {
      const images = [...prev.images]
      images.splice(index, 1)
      return { ...prev, images }
    })
  }

  const toggleSize = (size) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((item) => item !== size)
        : [...prev.sizes, size],
    }))
    setErrors((prev) => ({ ...prev, sizes: '' }))
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Product name is required'
    if (!form.description.trim()) nextErrors.description = 'Product description is required'
    if (!form.price || Number(form.price) <= 0) nextErrors.price = 'Enter a valid price'
    if (form.stock === '' || Number(form.stock) < 0) nextErrors.stock = 'Enter a valid stock quantity'
    if (!form.images.filter(Boolean).length) nextErrors.images = 'Add at least one image'
    if (!form.sizes.length) nextErrors.sizes = 'Select at least one size'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isUploading) {
      toast.info('Please wait for images to finish uploading')
      return
    }

    if (!validate()) return

    const images = form.images.filter(Boolean)

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      images,
      imageUrl: images[0] || '',
      category: form.category,
      sizes: form.sizes,
    }

    setSaving(true)
    try {
      if (isEdit) {
        await updateProduct(id, payload)
        toast.success('Product updated')
      } else {
        console.log(payload)
        await createProduct(payload)
        toast.success('Product saved')
      }
      navigate('/admin/items')
    } catch {
      toast.error(isEdit ? 'Failed to update product' : 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (isEdit) {
      navigate('/admin/items')
      return
    }

    setForm(emptyForm)
    setErrors({})
  }

  if (loading) {
    return (
      <div>
        <PageHeader
          eyebrow="Catalog"
          title={isEdit ? 'Edit Item' : 'Add Items'}
          description="Loading product details..."
        />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        eyebrow="Catalog"
        title={isEdit ? 'Edit Item' : 'Add Items'}
        description={
          isEdit
            ? 'Update product details, pricing, stock, and available sizes.'
            : 'Create product listings with device images, category, pricing, stock, and sizes.'
        }
      />

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminCard className="space-y-5">
          <Field label="Product Images" error={errors.images}>
            <p className="mb-2 text-xs text-gray-400">
              Upload up to {IMAGE_SLOTS} images from your device and the first one is used as the main thumbnail.
            </p>
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: IMAGE_SLOTS }).map((_, index) => {
                const image = form.images[index]
                const uploading = uploadingSlots.includes(index)
                return (
                  <div key={index} className="relative">
                    <label className="block h-24 w-24 cursor-pointer overflow-hidden border bg-gray-50">
                      <img
                        src={image || assets.upload_area}
                        alt={image ? `Product ${index + 1}` : 'Upload'}
                        className="h-full w-full object-cover"
                      />
                      {uploading && (
                        <div className="absolute inset-0 grid place-items-center bg-white/70 text-xs text-gray-600">
                          Uploading...
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        disabled={uploading}
                        onChange={(e) => {
                          handleImageChange(index, e.target.files?.[0])
                          e.target.value = ''
                        }}
                      />
                    </label>
                    {image && !uploading && (
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-black text-xs leading-none text-white"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </Field>

          <Field label="Product Name" error={errors.name}>
            <input
              value={form.name}
              onChange={(e) => updateForm('name', e.target.value)}
              className={inputClass}
              placeholder="Women Round Neck Cotton Top"
            />
          </Field>

          <Field label="Product Description" error={errors.description}>
            <textarea
              value={form.description}
              onChange={(e) => updateForm('description', e.target.value)}
              className={`${inputClass} min-h-32 resize-none`}
              placeholder="Describe materials, fit, and product highlights"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <select
                value={form.category}
                onChange={(e) => updateForm('category', e.target.value)}
                className={inputClass}
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Stock" error={errors.stock}>
              <input
                value={form.stock}
                onChange={(e) => updateForm('stock', e.target.value)}
                type="number"
                min="0"
                className={inputClass}
                placeholder="20"
              />
            </Field>
          </div>

          <Field label="Price" error={errors.price}>
            <input
              value={form.price}
              onChange={(e) => updateForm('price', e.target.value)}
              type="number"
              min="0"
              className={inputClass}
              placeholder="1200"
            />
          </Field>

          <Field label="Sizes" error={errors.sizes}>
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map((size) => (
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

          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="submit" disabled={saving || isUploading} className=" bg-black px-6 py-3 text-sm text-white disabled:opacity-60">
              {saving ? 'Saving...' : isUploading ? 'Uploading...' : isEdit ? 'Update Product' : 'Save Product'}
            </button>
            <button type="button" onClick={handleCancel} className=" border px-6 py-3 text-sm">
              Cancel
            </button>
          </div>
        </AdminCard>
      </form>
    </div>
  )
}

export default AdminAddItems
