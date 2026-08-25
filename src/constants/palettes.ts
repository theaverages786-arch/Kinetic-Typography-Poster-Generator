import { ColorPalette } from '../types';

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'neon',
    name: 'Toxic Neon',
    background: '#0a0a0c',
    foreground: '#39ff14', // Electric green
    accent1: '#ff007f',    // Hot pink / magenta
    accent2: '#ffff00',    // Acid yellow
    border: '#39ff14',
    tag: 'RAVE / ACID',
  },
  {
    id: 'monochrome',
    name: 'Swiss Brutalism',
    background: '#09090b',
    foreground: '#fafafa',
    accent1: '#71717a',
    accent2: '#ffffff',
    border: '#27272a',
    tag: 'MINIMAL / RAW',
  },
  {
    id: 'cyberpunk',
    name: 'Neo Cyberpunk',
    background: '#0b001a',
    foreground: '#00f0ff', // Cyan
    accent1: '#ff0055',    // Neon Red-Pink
    accent2: '#ffe600',    // Electric yellow
    border: '#00f0ff',
    tag: 'FUTURE / SCI-FI',
  },
  {
    id: 'acid',
    name: 'Bauhaus Acid',
    background: '#f4ebd0', // Warm off-white
    foreground: '#121212', // Deep ink
    accent1: '#e63946',    // Cadmium red
    accent2: '#1d3557',    // Deep cobalt
    border: '#121212',
    tag: 'EDITORIAL / ART',
  },
  {
    id: 'thermal',
    name: 'Thermal Heatmap',
    background: '#000814',
    foreground: '#ff5400', // Infrared orange
    accent1: '#ffd60a',    // Solar yellow
    accent2: '#7209b7',    // Ultraviolet
    border: '#ff5400',
    tag: 'EXPERIMENTAL',
  },
  {
    id: 'hyperpop',
    name: 'Hyperpop Chrome',
    background: '#180026',
    foreground: '#ff70a6', // Soft pink
    accent1: '#70d6ff',    // Ice blue
    accent2: '#e9ff70',    // Lime
    border: '#ff70a6',
    tag: 'Y2K / DIGITAL',
  },
];
