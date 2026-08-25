export type ColorPaletteId = 'neon' | 'monochrome' | 'cyberpunk' | 'acid' | 'thermal' | 'hyperpop' | 'custom';

export interface ColorPalette {
  id: ColorPaletteId;
  name: string;
  background: string;
  foreground: string;
  accent1: string;
  accent2: string;
  border: string;
  tag: string;
}

export type FontFamily = 
  | 'Syne' 
  | 'Unbounded' 
  | 'Anton' 
  | 'Bebas Neue' 
  | 'JetBrains Mono' 
  | 'Rubik Glitch' 
  | 'Major Mono Display'
  | 'Work Sans';

export type PosterLayout = 
  | 'multi-ribbon'       // Stack of alternating horizontal marquees
  | 'diagonal-slash'     // Angled diagonal marquees at 12deg or custom angle
  | 'brutalist-block'    // Giant center kinetic word with perimeter ticker ribbons
  | 'cylinder-3d'        // 3D perspective curved cascade
  | 'matrix-ticker'      // Dense vertical & horizontal micro-ticker grid
  | 'monolith-split';    // Inverted two-tone split poster with contrasting marquees

export type AspectRatio = '1:1' | '4:5' | '9:16' | '3:4' | '16:9';

export interface MarqueeRowConfig {
  id: string;
  text: string;
  subtext?: string;
  speedMultiplier: number;
  direction: 'left' | 'right';
  outlineOnly?: boolean;
  inverted?: boolean;
  fontSizeRem: number;
  fontFamily?: FontFamily;
  fontWeight?: number;
  textTransform?: 'uppercase' | 'lowercase' | 'none';
}

export * from './types/animation';
import { AnimationPresetId, TimingFunction } from './types/animation';

export interface PosterConfig {
  // Core text
  mainHeadline: string;
  subHeadline: string;
  tickerText: string;
  locationStamp: string;
  dateStamp: string;
  editionCode: string;
  
  // Layout & Dimension
  layout: PosterLayout;
  aspectRatio: AspectRatio;
  
  // Motion & Rhythm & Animation Presets
  animationPreset: AnimationPresetId;
  timingFunction: TimingFunction;
  marqueeSpeed: number; // Duration in seconds (e.g. 10s)
  scaleRhythm: number;  // Rhythmic pulse duration (e.g. 2s)
  scaleIntensity: number; // 1.0 to 1.3
  skewAngle: number;    // -30 to 30 deg
  skewAnimation: boolean;
  waveDistortion: boolean;
  isFrozen: boolean;
  
  // Typography
  fontFamily: FontFamily;
  fontWeight: number;   // 100 - 900
  letterSpacing: number; // -0.1em to 0.5em
  lineHeight: number;
  uppercase: boolean;
  outlineMode: boolean; // Text stroke outline
  strokeWidth: number;  // px
  
  // Palette & Styling
  paletteId: ColorPaletteId;
  customPalette: {
    background: string;
    foreground: string;
    accent1: string;
    accent2: string;
    border: string;
  };
  
  // Brutalist Overlays & FX
  showScanlines: boolean;
  showGrain: boolean;
  showGridLines: boolean;
  showCrosshairs: boolean;
  showBarcode: boolean;
  chromaticAberration: boolean;
  invertOnHover: boolean;
  
  // Custom Marquee rows
  customRows: MarqueeRowConfig[];
  
  // Audio sync / BPM simulation
  bpmSync: boolean;
  bpm: number;
}

export interface PosterPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  config: Partial<PosterConfig>;
}
