import { GUIDE_NAME, PRINT_AREA } from './constants'

export const isGuide = (object) => object?.name === GUIDE_NAME || object?.excludeFromExport

export const getDesignJSON = (canvas) => {
  const json = canvas.toObject(['name', 'excludeFromExport', 'evented', 'selectable', 'presetName', 'layerId', 'visible'])
  return {
    ...json,
    objects: (json.objects || []).filter((object) => object.name !== GUIDE_NAME),
  }
}

export const extractDesignMeta = (json, selected) => {
  const objects = json?.objects || []
  return {
    texts: objects
      .filter((object) => ['textbox', 'text', 'i-text'].includes(object.type))
      .map((object) => ({
        text: object.text,
        fontFamily: object.fontFamily,
        fill: object.fill,
        fontWeight: object.fontWeight,
        fontStyle: object.fontStyle,
        fontSize: object.fontSize,
      })),
    artworks: objects
      .filter((object) => object.type === 'image' || object.name === 'preset')
      .map((object) => ({
        type: object.name === 'preset' ? 'preset' : 'image',
        name: object.presetName || object.name || 'artwork',
        src: object.src || null,
      })),
    selected: selected
      ? {
          type: selected.type,
          name: selected.name || null,
          text: selected.text || null,
        }
      : null,
  }
}

export const isInsidePrintArea = (object, area = PRINT_AREA) => {
  object.setCoords()
  const bound = object.getBoundingRect()
  const padding = 0.5
  return (
    bound.left >= area.left - padding &&
    bound.top >= area.top - padding &&
    bound.left + bound.width <= area.left + area.width + padding &&
    bound.top + bound.height <= area.top + area.height + padding
  )
}

export const storeValidTransform = (object) => {
  object.set('lastValid', {
    left: object.left,
    top: object.top,
    scaleX: object.scaleX,
    scaleY: object.scaleY,
    angle: object.angle,
  })
}

export const restoreValidTransform = (object) => {
  const previous = object.lastValid
  if (!previous) return
  object.set(previous)
  object.setCoords()
}

export const fitObjectInPrintArea = (object, area = PRINT_AREA) => {
  object.setCoords()
  let bound = object.getBoundingRect()
  const maxWidth = area.width * 0.92
  const maxHeight = area.height * 0.92

  if (bound.width > maxWidth || bound.height > maxHeight) {
    const scale = Math.min(maxWidth / bound.width, maxHeight / bound.height)
    object.scaleX *= scale
    object.scaleY *= scale
    object.setCoords()
    bound = object.getBoundingRect()
  }

  let dx = 0
  let dy = 0
  if (bound.left < area.left) dx = area.left - bound.left
  if (bound.top < area.top) dy = area.top - bound.top
  if (bound.left + bound.width > area.left + area.width) {
    dx = area.left + area.width - (bound.left + bound.width)
  }
  if (bound.top + bound.height > area.top + area.height) {
    dy = area.top + area.height - (bound.top + bound.height)
  }

  object.left += dx
  object.top += dy
  object.setCoords()
  storeValidTransform(object)
}

export const bindPrintAreaConstraints = (canvas, area = PRINT_AREA) => {
  const enforce = (event) => {
    const object = event.target
    if (!object || isGuide(object)) return
    if (isInsidePrintArea(object, area)) {
      storeValidTransform(object)
      return
    }
    restoreValidTransform(object)
    if (!isInsidePrintArea(object, area)) {
      fitObjectInPrintArea(object, area)
    }
    canvas.requestRenderAll()
  }

  canvas.on('mouse:down', (event) => {
    if (event.target && !isGuide(event.target)) {
      storeValidTransform(event.target)
    }
  })
  canvas.on('object:moving', enforce)
  canvas.on('object:scaling', enforce)
  canvas.on('object:rotating', enforce)
  canvas.on('object:modified', enforce)
}

export const centerObjectHorizontally = (object, area = PRINT_AREA) => {
  object.setCoords()
  const bound = object.getBoundingRect()
  const targetCenter = area.left + area.width / 2
  const currentCenter = bound.left + bound.width / 2
  object.left += targetCenter - currentCenter
  object.setCoords()
  fitObjectInPrintArea(object, area)
}
