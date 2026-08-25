import { CANVAS_HEIGHT, CANVAS_WIDTH, GUIDE_NAME, PRINT_AREA } from './constants'
import { isGuide } from './canvasUtils'
import { getMockupSrc } from './TshirtMockup'

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    if (!String(src).startsWith('data:')) image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })

const drawContained = (context, image, width, height) => {
  const sourceWidth = image.naturalWidth || image.width
  const sourceHeight = image.naturalHeight || image.height
  const scale = Math.min(width / sourceWidth, height / sourceHeight)
  const drawWidth = sourceWidth * scale
  const drawHeight = sourceHeight * scale
  context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight)
}

export const withHiddenGuide = (canvas, task) => {
  const guide = canvas.getObjects().find((object) => object.name === GUIDE_NAME)
  if (guide) guide.set({ visible: false })
  canvas.discardActiveObject()
  canvas.requestRenderAll()
  const result = task()
  if (guide) guide.set({ visible: true })
  canvas.requestRenderAll()
  return result
}

export const exportPrintablePng = (canvas, multiplier = 4) =>
  withHiddenGuide(canvas, () =>
    canvas.toDataURL({
      format: 'png',
      left: PRINT_AREA.left,
      top: PRINT_AREA.top,
      width: PRINT_AREA.width,
      height: PRINT_AREA.height,
      multiplier,
      enableRetinaScaling: false,
    })
  )

export const exportGarmentPreview = async (canvas, side = 'front', product) => {
  const designUrl = withHiddenGuide(canvas, () =>
    canvas.toDataURL({
      format: 'png',
      multiplier: 2,
      enableRetinaScaling: false,
    })
  )

  const shirt = await loadImage(getMockupSrc(product, side))
  const design = await loadImage(designUrl)

  const output = document.createElement('canvas')
  output.width = CANVAS_WIDTH * 2
  output.height = CANVAS_HEIGHT * 2
  const context = output.getContext('2d')
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, output.width, output.height)
  drawContained(context, shirt, output.width, output.height)
  context.drawImage(design, 0, 0, output.width, output.height)
  return output.toDataURL('image/png')
}

export const downloadDataUrl = (dataUrl, filename) => {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  link.click()
}

export const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

export const collectNonGuideObjects = (canvas) =>
  canvas.getObjects().filter((object) => !isGuide(object))
