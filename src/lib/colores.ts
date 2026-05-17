// Mapeo de colorBase → clases Tailwind para pastillas
// Las clases se listan explícitamente para que Tailwind no las purgue

export const COLOR_CLASSES: Record<string, { chip: string; badge: string }> = {
  sky:    { chip: 'bg-sky-100 border-sky-300 text-sky-900 hover:bg-sky-200',       badge: 'bg-sky-200 text-sky-900' },
  blue:   { chip: 'bg-blue-100 border-blue-300 text-blue-900 hover:bg-blue-200',   badge: 'bg-blue-200 text-blue-900' },
  cyan:   { chip: 'bg-cyan-100 border-cyan-300 text-cyan-900 hover:bg-cyan-200',   badge: 'bg-cyan-200 text-cyan-900' },
  indigo: { chip: 'bg-indigo-100 border-indigo-300 text-indigo-900 hover:bg-indigo-200', badge: 'bg-indigo-200 text-indigo-900' },
  amber:  { chip: 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200', badge: 'bg-amber-200 text-amber-900' },
  orange: { chip: 'bg-orange-100 border-orange-300 text-orange-900 hover:bg-orange-200', badge: 'bg-orange-200 text-orange-900' },
  yellow: { chip: 'bg-yellow-100 border-yellow-300 text-yellow-900 hover:bg-yellow-200', badge: 'bg-yellow-200 text-yellow-900' },
  violet: { chip: 'bg-violet-100 border-violet-300 text-violet-900 hover:bg-violet-200', badge: 'bg-violet-200 text-violet-900' },
  purple: { chip: 'bg-purple-100 border-purple-300 text-purple-900 hover:bg-purple-200', badge: 'bg-purple-200 text-purple-900' },
  fuchsia:{ chip: 'bg-fuchsia-100 border-fuchsia-300 text-fuchsia-900 hover:bg-fuchsia-200', badge: 'bg-fuchsia-200 text-fuchsia-900' },
}

export function getColorChip(colorBase: string): string {
  return COLOR_CLASSES[colorBase]?.chip ?? 'bg-gray-100 border-gray-300 text-gray-900'
}

export function getColorBadge(colorBase: string): string {
  return COLOR_CLASSES[colorBase]?.badge ?? 'bg-gray-200 text-gray-900'
}
