import { useContext, useEffect, useRef, useState } from 'react'
import {
  Canvas,
  FabricImage,
  FabricObject,
  Rect,
  StaticCanvas,
  Textbox,
} from 'fabric'
import { toast } from 'react-toastify'
import { FiArrowRight, FiEye, FiEyeOff, FiTrash2 } from 'react-icons/fi'
import { ShopContext } from '../context/ShopContext'
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  DEFAULT_TEXT_PROPS,
  FONT_OPTIONS,
  GUIDE_NAME,
  PRINT_AREA,
  PRINT_AREA_PCT,
} from './constants'
import {
  bindPrintAreaConstraints,
  extractDesignMeta,
  fitObjectInPrintArea,
  getDesignJSON,
  isGuide,
  storeValidTransform,
} from './canvasUtils'
import { TshirtMockup, getMockupSrc } from './TshirtMockup'
import { PRESET_DESIGNS, svgToDataUrl } from './presets'
import { downloadDataUrl, fileToDataUrl } from './exportDesign'

FabricObject.customProperties = ['name', 'excludeFromExport', 'presetName', 'layerId']

const newLayerId = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `layer-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const assignLayerId = (object) => {
  if (!object.layerId) object.set('layerId', newLayerId())
  return object.layerId
}

const addPrintGuide = (canvas) => {
  canvas.getObjects()
    .filter((object) => object.name === GUIDE_NAME)
    .forEach((object) => canvas.remove(object))

  const guide = new Rect({
    left: PRINT_AREA.left,
    top: PRINT_AREA.top,
    width: PRINT_AREA.width,
    height: PRINT_AREA.height,
    fill: 'transparent',
    stroke: 'transparent',
    strokeDashArray: [7, 5],
    strokeWidth: 1.5,
    selectable: false,
    evented: false,
    excludeFromExport: true,
    name: GUIDE_NAME,
  })
  canvas.add(guide)
  canvas.sendObjectToBack(guide)
}

const ProductCustomizer = ({ product, size, onSizeChange }) => {
  const { addToCart, currency } = useContext(ShopContext)
  const canvasElRef = useRef(null)
  const fabricRef = useRef(null)
  const viewportRef = useRef(null)
  const sideRef = useRef('front')
  const designsRef = useRef({ front: null, back: null })
  const switchingRef = useRef(false)
  const fileRef = useRef(null)

  const [side, setSide] = useState('front')
  const [stageScale, setStageScale] = useState(1.15)
  const [designs, setDesigns] = useState({ front: null, back: null })
  const [textProps, setTextProps] = useState(DEFAULT_TEXT_PROPS)
  const [selected, setSelected] = useState(null)
  const [layers, setLayers] = useState([])
  const [toolTab, setToolTab] = useState('typography')
  const [preview, setPreview] = useState(null)
  const [busy, setBusy] = useState(false)

  const collectLayers = (canvas) =>
    canvas.getObjects()
      .filter((object) => !isGuide(object))
      .map((object) => {
        const isText = ['textbox', 'text', 'i-text'].includes(object.type)
        return {
          id: assignLayerId(object),
          label: isText
            ? `${object.text || 'Text'} (Text)`
            : `${object.presetName || 'Artwork'} (${object.name === 'preset' ? 'Art' : 'Image'})`,
          visible: object.visible !== false,
        }
      })
      .reverse()

  const syncState = (canvas) => {
    const json = getDesignJSON(canvas)
    designsRef.current[sideRef.current] = json
    setDesigns({ ...designsRef.current })
    setLayers(collectLayers(canvas))
    const active = canvas.getActiveObject()
    const selectedMeta = active && !isGuide(active)
      ? { type: active.type, name: active.name || null, text: active.text || null, layerId: active.layerId || null }
      : null
    setSelected(selectedMeta)
    if (active && ['textbox', 'text', 'i-text'].includes(active.type)) {
      setTextProps((prev) => ({
        ...prev,
        content: active.text || prev.content,
        fontFamily: active.fontFamily || prev.fontFamily,
        fill: active.fill || prev.fill,
        fontWeight: active.fontWeight || prev.fontWeight,
        fontStyle: active.fontStyle || prev.fontStyle,
        fontSize: active.fontSize || prev.fontSize,
      }))
    }
  }

  useEffect(() => {
    const canvas = new Canvas(canvasElRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      selection: true,
      preserveObjectStacking: true,
      backgroundColor: 'transparent',
    })
    fabricRef.current = canvas
    addPrintGuide(canvas)
    bindPrintAreaConstraints(canvas)

    const handleChanged = () => {
      if (switchingRef.current) return
      syncState(canvas)
    }

    canvas.on('selection:created', handleChanged)
    canvas.on('selection:updated', handleChanged)
    canvas.on('selection:cleared', handleChanged)
    canvas.on('object:added', handleChanged)
    canvas.on('object:removed', handleChanged)
    canvas.on('object:modified', handleChanged)

    return () => {
      canvas.dispose()
      fabricRef.current = null
    }
  }, [])

  useEffect(() => {
    const viewport = viewportRef.current
    const applyScale = () => {
      const canvas = fabricRef.current
      if (!viewport || !canvas) return
      const rect = viewport.getBoundingClientRect()
      const next = Math.min((rect.width - 24) / CANVAS_WIDTH, (rect.height - 24) / CANVAS_HEIGHT, 1.55)
      const scale = Math.max(0.9, next)
      setStageScale(scale)
      canvas.setDimensions(
        { width: CANVAS_WIDTH * scale, height: CANVAS_HEIGHT * scale },
        { cssOnly: true },
      )
      canvas.requestRenderAll()
    }

    applyScale()
    const observer = new ResizeObserver(applyScale)
    if (viewport) observer.observe(viewport)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    designsRef.current = { front: null, back: null }
    setDesigns({ front: null, back: null })
    setSelected(null)
    setLayers([])
    setSide('front')
    sideRef.current = 'front'
    const canvas = fabricRef.current
    if (!canvas) return
    canvas.getObjects().filter((object) => !isGuide(object)).forEach((object) => canvas.remove(object))
    addPrintGuide(canvas)
    canvas.discardActiveObject()
    canvas.requestRenderAll()
  }, [product?._id])

  const getCanvas = () => fabricRef.current

  const findLayerObject = (layerId) =>
    getCanvas()?.getObjects().find((object) => object.layerId === layerId)

  const placeInPrintArea = (object) => {
    object.set({
      left: PRINT_AREA.left + PRINT_AREA.width / 2,
      top: PRINT_AREA.top + PRINT_AREA.height / 2,
      originX: 'center',
      originY: 'center',
    })
    fitObjectInPrintArea(object)
    storeValidTransform(object)
  }

  const addText = () => {
    const canvas = getCanvas()
    if (!canvas) return
    const content = textProps.content.trim()
    if (!content) {
      toast.error('Enter some text first')
      return
    }
    const text = new Textbox(content, {
      fontFamily: textProps.fontFamily,
      fill: textProps.fill,
      fontWeight: textProps.fontWeight,
      fontStyle: textProps.fontStyle,
      fontSize: textProps.fontSize,
      width: PRINT_AREA.width - 24,
      name: 'text',
      layerId: newLayerId(),
    })
    placeInPrintArea(text)
    canvas.add(text)
    canvas.setActiveObject(text)
    canvas.requestRenderAll()
  }

  const applyTextProps = (key, value) => {
    setTextProps((prev) => ({ ...prev, [key]: value }))
    const canvas = getCanvas()
    const active = canvas?.getActiveObject()
    if (!active || !['textbox', 'text', 'i-text'].includes(active.type)) return
    if (key === 'content') active.set('text', value)
    else active.set(key, value)
    canvas.requestRenderAll()
    syncState(canvas)
  }

  const addImageFromUrl = async (url, name = 'artwork', presetName) => {
    const canvas = getCanvas()
    if (!canvas) return
    const image = await FabricImage.fromURL(url, { crossOrigin: 'anonymous' })
    image.set({ name, presetName, layerId: newLayerId() })
    image.scaleToWidth(PRINT_AREA.width * 0.62)
    placeInPrintArea(image)
    canvas.add(image)
    canvas.setActiveObject(image)
    canvas.requestRenderAll()
  }

  const handleUpload = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }
    const dataUrl = await fileToDataUrl(file)
    await addImageFromUrl(dataUrl, 'artwork')
  }

  const addPreset = async (preset) => {
    await addImageFromUrl(svgToDataUrl(preset.svg), 'preset', preset.id)
  }

  const selectLayer = (layerId) => {
    const canvas = getCanvas()
    const object = findLayerObject(layerId)
    if (!canvas || !object || object.visible === false) return
    canvas.setActiveObject(object)
    canvas.requestRenderAll()
    syncState(canvas)
  }

  const toggleLayerVisibility = (layerId) => {
    const canvas = getCanvas()
    const object = findLayerObject(layerId)
    if (!canvas || !object) return
    const nextVisible = object.visible === false
    object.set({ visible: nextVisible, selectable: nextVisible, evented: nextVisible })
    if (!nextVisible && canvas.getActiveObject() === object) canvas.discardActiveObject()
    canvas.requestRenderAll()
    syncState(canvas)
  }

  const deleteLayer = (layerId) => {
    const canvas = getCanvas()
    const object = findLayerObject(layerId)
    if (!canvas || !object) return
    canvas.remove(object)
    addPrintGuide(canvas)
    canvas.requestRenderAll()
    syncState(canvas)
  }

  const resetSide = () => {
    const canvas = getCanvas()
    if (!canvas) return
    canvas.getObjects().filter((object) => !isGuide(object)).forEach((object) => canvas.remove(object))
    addPrintGuide(canvas)
    canvas.discardActiveObject()
    canvas.requestRenderAll()
    designsRef.current[sideRef.current] = null
    setDesigns({ ...designsRef.current })
    setSelected(null)
    setLayers([])
  }

  const loadSide = async (nextSide) => {
    const canvas = getCanvas()
    if (!canvas) return
    switchingRef.current = true
    canvas.getObjects().slice().forEach((object) => canvas.remove(object))
    const json = designsRef.current[nextSide]
    if (json) {
      await canvas.loadFromJSON(json)
    }
    addPrintGuide(canvas)
    canvas.discardActiveObject()
    canvas.requestRenderAll()
    switchingRef.current = false
    syncState(canvas)
  }

  const switchSide = async (nextSide) => {
    if (nextSide === sideRef.current) return
    const canvas = getCanvas()
    if (canvas) {
      designsRef.current[sideRef.current] = getDesignJSON(canvas)
      setDesigns({ ...designsRef.current })
    }
    sideRef.current = nextSide
    setSide(nextSide)
    await loadSide(nextSide)
  }

  const renderSidePreview = async (json, nextSide) => {
    const element = document.createElement('canvas')
    const temp = new StaticCanvas(element, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: 'transparent',
    })
    if (json) await temp.loadFromJSON(json)
    const printPng = temp.toDataURL({
      format: 'png',
      left: PRINT_AREA.left,
      top: PRINT_AREA.top,
      width: PRINT_AREA.width,
      height: PRINT_AREA.height,
      multiplier: 4,
      enableRetinaScaling: false,
    })
    const overlay = temp.toDataURL({ format: 'png', multiplier: 2, enableRetinaScaling: false })
    const shirt = await new Promise((resolve, reject) => {
      const image = new Image()
      const src = getMockupSrc(product, nextSide)
      if (!String(src).startsWith('data:')) image.crossOrigin = 'anonymous'
      image.onload = () => resolve(image)
      image.onerror = reject
      image.src = src
    })
    const design = await new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = reject
      image.src = overlay
    })
    const output = document.createElement('canvas')
    output.width = CANVAS_WIDTH * 2
    output.height = CANVAS_HEIGHT * 2
    const context = output.getContext('2d')
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, output.width, output.height)
    const sourceWidth = shirt.naturalWidth || shirt.width
    const sourceHeight = shirt.naturalHeight || shirt.height
    const scale = Math.min(output.width / sourceWidth, output.height / sourceHeight)
    const drawWidth = sourceWidth * scale
    const drawHeight = sourceHeight * scale
    context.drawImage(shirt, (output.width - drawWidth) / 2, (output.height - drawHeight) / 2, drawWidth, drawHeight)
    context.drawImage(design, 0, 0, output.width, output.height)
    temp.dispose()
    return {
      garmentPreview: output.toDataURL('image/png'),
      printPng,
    }
  }

  const openPreview = async () => {
    const canvas = getCanvas()
    if (!canvas) return
    designsRef.current[sideRef.current] = getDesignJSON(canvas)
    const hasDesign = (json) => (json?.objects || []).length > 0
    if (!hasDesign(designsRef.current.front) && !hasDesign(designsRef.current.back)) {
      toast.error('Add a design on the front or back first')
      return
    }
    setBusy(true)
    try {
      const [front, back] = await Promise.all([
        renderSidePreview(designsRef.current.front, 'front'),
        renderSidePreview(designsRef.current.back, 'back'),
      ])
      setPreview({
        front,
        back,
        designs: {
          front: designsRef.current.front,
          back: designsRef.current.back,
        },
        meta: {
          front: extractDesignMeta(designsRef.current.front, null),
          back: extractDesignMeta(designsRef.current.back, null),
        },
      })
    } catch {
      toast.error('Could not generate preview')
    } finally {
      setBusy(false)
    }
  }

  const addCustomizedToCart = () => {
    if (!preview) return
    if (!size) {
      toast.error('Select a size first')
      return
    }
    addToCart(product._id, size, {
      productId: product._id,
      frontJSON: preview.designs.front,
      backJSON: preview.designs.back,
      previewFront: preview.front.garmentPreview,
      previewBack: preview.back.garmentPreview,
      meta: preview.meta,
      customized: true,
    })
    setPreview(null)
  }

  const onDrop = async (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file) await handleUpload(file)
  }

  const activeCount = layers.length
  const paddedCount = String(activeCount).padStart(2, '0')

  return (
    <div className="flex min-h-[calc(100vh-88px)] flex-col bg-[#eef3f8] lg:flex-row">
      <aside className="flex w-full shrink-0 flex-col border-b border-slate-200 bg-white lg:max-w-[340px] lg:border-b-0 lg:border-r">
        <div className="border-b border-slate-100 px-6 py-5">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">Customize {product?.name || 'Product'}</h1>
          <p className="mt-1 text-sm text-slate-400">
            Editing: {side === 'front' ? 'Front View' : 'Back View'}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-2 border-b border-slate-200">
            <button
              type="button"
              onClick={() => setToolTab('typography')}
              className={`pb-3 text-sm font-medium ${
                toolTab === 'typography'
                  ? 'border-b-2 border-slate-900 text-slate-900'
                  : 'text-slate-400'
              }`}
            >
              Typography
            </button>
            <button
              type="button"
              onClick={() => setToolTab('graphics')}
              className={`pb-3 text-sm font-medium ${
                toolTab === 'graphics'
                  ? 'border-b-2 border-slate-900 text-slate-900'
                  : 'text-slate-400'
              }`}
            >
              Graphics & Art
            </button>
          </div>

          {toolTab === 'typography' ? (
            <div className="mt-5 space-y-4">
              <input
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-slate-400"
                value={textProps.content}
                onChange={(event) => applyTextProps('content', event.target.value)}
                placeholder="Enter text"
              />
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Font Family
                </p>
                <select
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none"
                  value={textProps.fontFamily}
                  onChange={(event) => applyTextProps('fontFamily', event.target.value)}
                >
                  {FONT_OPTIONS.map((font) => (
                    <option key={font.value} value={font.value}>{font.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Text Color
                </p>
                <label className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2">
                  <input
                    type="color"
                    className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                    value={textProps.fill}
                    onChange={(event) => applyTextProps('fill', event.target.value)}
                  />
                  <span className="text-sm uppercase tracking-wide text-slate-600">{textProps.fill}</span>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                    textProps.fontWeight === 'bold'
                      ? 'border-blue-500 text-slate-900'
                      : 'border-slate-200 text-slate-500'
                  }`}
                  onClick={() => applyTextProps('fontWeight', textProps.fontWeight === 'bold' ? 'normal' : 'bold')}
                >
                  Bold
                </button>
                <button
                  type="button"
                  className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                    textProps.fontStyle === 'italic'
                      ? 'border-blue-500 text-slate-900'
                      : 'border-slate-200 text-slate-500'
                  }`}
                  onClick={() => applyTextProps('fontStyle', textProps.fontStyle === 'italic' ? 'normal' : 'italic')}
                >
                  Italic
                </button>
              </div>
              <button
                type="button"
                onClick={addText}
                className="w-full rounded-lg bg-slate-950 py-3 text-sm font-medium text-white"
              >
                + Add Text Layer
              </button>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              <button
                type="button"
                className="w-full rounded-lg border border-slate-200 py-3 text-sm font-medium text-slate-800"
                onClick={() => fileRef.current?.click()}
              >
                Upload image
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) handleUpload(file)
                  event.target.value = ''
                }}
              />
              <p className="text-xs text-slate-400">Or drag an image onto the shirt.</p>
              <div className="flex flex-wrap gap-2">
                {PRESET_DESIGNS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    title={preset.label}
                    onClick={() => addPreset(preset)}
                    className="grid h-12 w-12 place-items-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
                  >
                    <img src={svgToDataUrl(preset.svg)} alt={preset.label} className="h-7 w-7" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {paddedCount} Active
              </p>
            </div>
            {layers.length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-xs text-slate-400">
                No layers yet. Add text or artwork to the print area.
              </p>
            ) : (
              <div className="customizer-layer-scroll max-h-48 space-y-2 overflow-y-auto pr-1">
                {layers.map((layer) => (
                  <div
                    key={layer.id}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2.5 ${
                      selected?.layerId === layer.id
                        ? 'border-slate-900 bg-slate-50'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => selectLayer(layer.id)}
                      className="truncate text-left text-sm text-slate-700"
                    >
                      {layer.label}
                    </button>
                    <div className="ml-3 flex shrink-0 items-center gap-2 text-slate-400">
                      <button type="button" onClick={() => toggleLayerVisibility(layer.id)} aria-label="Toggle visibility">
                        {layer.visible ? <FiEye /> : <FiEyeOff />}
                      </button>
                      <button type="button" onClick={() => deleteLayer(layer.id)} aria-label="Delete layer">
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-100 p-3">
          <button
            type="button"
            disabled={busy}
            onClick={openPreview}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#2563EB] py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {busy ? 'Preparing preview...' : 'Review & Checkout'}
            <FiArrowRight />
          </button>
        </div>
      </aside>

      <main className="relative flex min-w-0 flex-1 flex-col">
        <div
          ref={viewportRef}
          className="flex flex-1 items-center justify-center overflow-hidden px-6 pb-24 pt-8"
          onDragOver={(event) => event.preventDefault()}
          onDrop={onDrop}
        >
          <div
            className="relative"
            style={{ width: CANVAS_WIDTH * stageScale, height: CANVAS_HEIGHT * stageScale }}
          >
            <TshirtMockup
              side={side}
              src={getMockupSrc(product, side)}
              className="pointer-events-none absolute inset-0 h-full w-full object-contain drop-shadow-xl"
            />
            <canvas ref={canvasElRef} className="relative z-10 block" />
            <div
              className="pointer-events-none absolute z-20 border-2 border-dashed border-[#2563EB]"
              style={{
                left: `${PRINT_AREA_PCT.left}%`,
                top: `${PRINT_AREA_PCT.top}%`,
                width: `${PRINT_AREA_PCT.width}%`,
                height: `${PRINT_AREA_PCT.height}%`,
              }}
            >
              <span className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded bg-[#2563EB] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white">
                Print Boundaries
              </span>
            </div>
          </div>
        </div>

        <div className="pointer-events-none relative z-10 flex flex-wrap justify-center gap-3 px-6 pb-4 lg:absolute lg:inset-x-0 lg:bottom-8 lg:pb-0">
          {['front', 'back'].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => switchSide(value)}
              className={`pointer-events-auto rounded-full px-5 py-2.5 text-sm shadow-sm ${
                side === value
                  ? 'border border-slate-900 bg-slate-900 text-white'
                  : 'border border-slate-200 bg-white text-slate-700'
              }`}
            >
              {value === 'front' ? 'Front' : 'Back'}
            </button>
          ))}
          <button
            type="button"
            onClick={resetSide}
            className="pointer-events-auto flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm text-slate-700 shadow-sm"
          >
            <FiTrash2 />
            Clear
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={openPreview}
            className="pointer-events-auto flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm text-slate-700 shadow-sm disabled:opacity-60"
          >
            <FiEye />
            Preview
          </button>
        </div>

        <div className="relative z-10 mx-6 mb-6 w-auto rounded-2xl border border-slate-100 bg-white p-5 shadow-lg lg:absolute lg:bottom-8 lg:right-8 lg:mx-0 lg:mb-0 lg:w-[220px]">
          <div className="flex items-start justify-between text-sm">
            <span className="text-slate-400">Garment</span>
            <span className="max-w-[120px] text-right font-medium text-slate-800">{product?.name || 'Classic Tee'}</span>
          </div>
          <div className="mt-3 flex items-start justify-between text-sm">
            <span className="text-slate-400">Color</span>
            <span className="font-medium text-slate-800">Classic White</span>
          </div>
          {(product?.sizes || []).length > 0 && (
            <div className="mt-3">
              <p className="mb-2 text-sm text-slate-400">Size</p>
              <div className="flex flex-wrap justify-end gap-1">
                {(product.sizes || []).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => onSizeChange?.(item)}
                    className={`rounded border px-2 py-1 text-xs ${
                      item === size ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="mt-3 flex items-start justify-between text-sm">
            <span className="text-slate-400">Active Layers</span>
            <span className="font-medium text-slate-800">{paddedCount} Active</span>
          </div>
          <div className="mt-4 border-t border-slate-100 pt-3">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Unit Price</p>
            <p className="mt-1 text-2xl font-semibold text-[#2563EB]">
              {currency}{Number(product?.price || 0).toFixed(2)}
            </p>
          </div>
        </div>
      </main>

      {preview && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6">
            <h3 className="text-xl font-semibold text-black">Review your design</h3>
            <p className="mt-2 text-sm text-gray-500">
              Check both sides before adding this customized {product?.name} to your cart.
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {['front', 'back'].map((value) => (
                <div key={value}>
                  <p className="mb-3 text-sm font-medium capitalize">{value}</p>
                  <img src={preview[value].garmentPreview} alt={`${value} preview`} className="w-full rounded-lg border bg-gray-50" />
                  <button
                    type="button"
                    className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    onClick={() => downloadDataUrl(preview[value].printPng, `${product?._id || 'design'}-${value}.png`)}
                  >
                    Download {value} PNG
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" className="rounded-lg border border-slate-200 px-4 py-2 text-sm" onClick={() => setPreview(null)}>
                Keep editing
              </button>
              <button type="button" className="rounded-lg bg-[#2563EB] px-5 py-2 text-sm text-white" onClick={addCustomizedToCart}>
                Add customized item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductCustomizer
