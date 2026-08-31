const TEXT_LAYER_FEE = 350
const IMAGE_LAYER_FEE = 500
const GRAPHICS_LAYER_FEE = 200

export const LAYER_FEES = {
  text: TEXT_LAYER_FEE,
  image: IMAGE_LAYER_FEE,
  graphics: GRAPHICS_LAYER_FEE,
}

export const layerKind = (object) => {
  if (!object) return null
  if (['textbox', 'text', 'i-text'].includes(object.type) || object.name === 'text') return 'text'
  if (object.name === 'preset') return 'graphics'
  if (object.type === 'image' || object.name === 'artwork') return 'image'
  return null
}

export const countDesignLayers = (...jsons) => {
  const counts = { text: 0, image: 0, graphics: 0 }
  jsons.forEach((json) => {
    (json?.objects || []).forEach((object) => {
      const kind = layerKind(object)
      if (kind) counts[kind] += 1
    })
  })
  return counts
}

export const graphicsCount = (counts = {}) => counts.graphics || counts.logo || 0

export const customizationSurcharge = (counts = {}) =>
  (counts.text || 0) * TEXT_LAYER_FEE
  + (counts.image || 0) * IMAGE_LAYER_FEE
  + graphicsCount(counts) * GRAPHICS_LAYER_FEE

export const customizerUnitPrice = (product, counts) =>
  Number(product?.price || 0) + customizationSurcharge(counts)

export const lineUnitPrice = (product, customization) => {
  if (customization?.unitPrice != null) return Number(customization.unitPrice)
  if (customization?.layerCounts) return customizerUnitPrice(product, customization.layerCounts)
  return Number(product?.price || 0)
}

export const DELIVERY_FEE = 100
export const COD_FEE = 50

export const isCodMethod = (method) => String(method || '').toLowerCase() === 'cod'

export const checkoutFees = (method) =>
  DELIVERY_FEE + (isCodMethod(method) ? COD_FEE : 0)
