export const isCustomizableProduct = (product) => {
  if (!product) return false
  const value = product.customizable ?? product.isCustomizable
  return value === true || value === 1 || value === '1' || value === 'true' || value === 'TRUE'
}
