export const PRESET_DESIGNS = [
  {
    id: 'star',
    label: 'Star',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><polygon fill="#111111" points="32,6 39,24 58,24 43,36 49,54 32,43 15,54 21,36 6,24 25,24"/></svg>`,
  },
  {
    id: 'heart',
    label: 'Heart',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><path fill="#c81e1e" d="M32 54C16 42 8 32 8 22c0-7 5-12 12-12 5 0 9 3 12 8 3-5 7-8 12-8 7 0 12 5 12 12 0 10-8 20-24 32z"/></svg>`,
  },
  {
    id: 'bolt',
    label: 'Bolt',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><polygon fill="#111111" points="36,6 18,34 31,34 26,58 48,28 34,28"/></svg>`,
  },
  {
    id: 'badge',
    label: 'Badge',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="32" r="24" fill="#111111"/><text x="32" y="38" text-anchor="middle" font-size="16" font-family="Arial" fill="#ffffff">SS</text></svg>`,
  },
  {
    id: 'wave',
    label: 'Wave',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><path fill="none" stroke="#111111" stroke-width="6" stroke-linecap="round" d="M8 38 C18 22 26 22 32 38 C38 54 46 54 56 38"/></svg>`,
  },
]

export const svgToDataUrl = (svg) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
