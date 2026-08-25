export const tshirtFrontSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">
  <ellipse cx="200" cy="470" rx="92" ry="10" fill="#dbe4ee"/>
  <path d="M78 86 L146 52 L170 102 L230 102 L254 52 L322 86 L352 138 L312 164 L308 428 C308 448 292 462 272 462 L128 462 C108 462 92 448 92 428 L88 164 L48 138 Z" fill="#ffffff" stroke="#d7dee8" stroke-width="3"/>
  <path d="M146 52 C176 86 224 86 254 52" fill="#f4f7fb" stroke="#d7dee8" stroke-width="3"/>
  <path d="M170 102 C182 128 218 128 230 102" fill="none" stroke="#e5ebf2" stroke-width="3"/>
  <path d="M92 164 L88 428" fill="none" stroke="#eef2f6" stroke-width="8"/>
  <path d="M308 164 L312 428" fill="none" stroke="#eef2f6" stroke-width="8"/>
</svg>
`

export const tshirtBackSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">
  <ellipse cx="200" cy="470" rx="92" ry="10" fill="#dbe4ee"/>
  <path d="M78 86 L146 52 L170 98 L230 98 L254 52 L322 86 L352 138 L312 164 L308 428 C308 448 292 462 272 462 L128 462 C108 462 92 448 92 428 L88 164 L48 138 Z" fill="#ffffff" stroke="#d7dee8" stroke-width="3"/>
  <path d="M146 52 C176 74 224 74 254 52" fill="#f4f7fb" stroke="#d7dee8" stroke-width="3"/>
  <path d="M92 164 L88 428" fill="none" stroke="#eef2f6" stroke-width="8"/>
  <path d="M308 164 L312 428" fill="none" stroke="#eef2f6" stroke-width="8"/>
</svg>
`

export const getProductMockupSrc = (product, side = 'front') => {
  const images = product?.image?.length
    ? product.image
    : product?.images?.length
      ? product.images
      : (product?.imageUrl ? [product.imageUrl] : [])
  if (!images.length) return null
  if (side === 'back' && images[1]) return images[1]
  return images[0]
}

export const svgToImageSrc = (svg) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`

export const getMockupSrc = (product, side = 'front') =>
  getProductMockupSrc(product, side) || svgToImageSrc(side === 'back' ? tshirtBackSvg : tshirtFrontSvg)

export const TshirtMockup = ({ side = 'front', src, className = '' }) => {
  if (src) {
    return <img src={src} alt={`${side} garment`} className={className} />
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: side === 'back' ? tshirtBackSvg : tshirtFrontSvg }}
    />
  )
}
