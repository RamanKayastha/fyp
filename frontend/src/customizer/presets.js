export const PRESET_DESIGNS = [
  {
    id: 'star',
    label: 'Star',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><polygon fill="#111111" points="32,4 40,24 62,24 44,38 52,58 32,46 12,58 20,38 2,24 24,24"/></svg>`,
  },
  {
    id: 'heart',
    label: 'Heart',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="#c81e1e" d="M32 56 L8 32 A14 14 0 0 1 32 16 A14 14 0 0 1 56 32 Z"/></svg>`,
  },
  {
    id: 'bolt',
    label: 'Bolt',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><polygon fill="#111111" points="36,4 16,36 30,36 24,60 50,28 34,28"/></svg>`,
  },
  {
    id: 'badge',
    label: 'Badge',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="#111111"/><text x="32" y="39" text-anchor="middle" font-size="18" font-family="Arial" fill="#ffffff">SS</text></svg>`,
  },
  {
    id: 'wave',
    label: 'Wave',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="none" stroke="#111111" stroke-width="6" d="M6 40 C16 20 24 20 32 40 C40 60 48 60 58 40"/></svg>`,
  },
]

export const svgToDataUrl = (svg) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
