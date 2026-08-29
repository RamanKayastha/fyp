export const CANVAS_WIDTH = 400
export const CANVAS_HEIGHT = 500

export const PRINT_AREA = {
  left: 112,
  top: 116,
  width: 176,
  height: 228,
}

export const FONTS = [
  'Arial',
  'Georgia',
  'Times New Roman',
  'Courier New',
  'Verdana',
  'Trebuchet MS',
  'Impact',
  'Comic Sans MS',
  'Dancing Script',
  'Great Vibes',
  'Archivo Black',
  'Zombie',
]

export const DEFAULT_TEXT_PROPS = {
  content: '',
  fontFamily: 'Arial',
  fill: '#0F172A',
  fontWeight: 'bold',
  fontStyle: 'normal',
  fontSize: 28,
}

export const FONT_OPTIONS = [
  { value: 'Arial', label: 'Helvetica / Modern' },
  { value: 'Trebuchet MS', label: 'Trebuchet / Clean' },
  { value: 'Verdana', label: 'Verdana / Sans' },
  { value: 'Georgia', label: 'Georgia / Serif' },
  { value: 'Times New Roman', label: 'Times / Classic' },
  { value: 'Courier New', label: 'Courier / Mono' },
  { value: 'Impact', label: 'Impact / Bold' },
  { value: 'Comic Sans MS', label: 'Comic / Casual' },
  { value: 'Dancing Script', label: 'Cursive' },
  { value: 'Great Vibes', label: 'Segoe Script' },
  { value: 'Archivo Black', label: 'Gill Sans Nova Ultra Bold' },
  { value: 'Zombie', label: 'Zombie' },
]

export const GUIDE_NAME = 'printGuide'

export const PRINT_AREA_PCT = {
  left: (PRINT_AREA.left / CANVAS_WIDTH) * 100,
  top: (PRINT_AREA.top / CANVAS_HEIGHT) * 100,
  width: (PRINT_AREA.width / CANVAS_WIDTH) * 100,
  height: (PRINT_AREA.height / CANVAS_HEIGHT) * 100,
}
