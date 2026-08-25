import React, { useState, useRef, useCallback } from 'react';
import { KineticPoster } from './components/KineticPoster';
import { ControlPanel } from './components/ControlPanel';
import { HeaderBar } from './components/HeaderBar';
import { SvelteKitExportModal } from './components/SvelteKitExportModal';
import {
  PosterConfig,
  AspectRatio,
  FontFamily,
  PosterLayout,
  ColorPaletteId,
  AnimationPresetId,
} from './types';
import { POSTER_PRESETS } from './constants/presets';
import { ANIMATION_PRESETS } from './constants/animationPresets';
import { COLOR_PALETTES } from './constants/palettes';
import html2canvas from 'html2canvas';
import { Sparkles, Check, AlertCircle } from 'lucide-react';

const INITIAL_CONFIG: PosterConfig = {
  mainHeadline: 'KINETIC // REALITY',
  subHeadline: 'DYNAMIC BRUTALIST EXPERIMENT',
  tickerText: 'FREQUENCY MODULATION ★ 140 BPM ★ RAW CSS ENGINE ★ ZERO JAVASCRIPT ANIMATION OVERHEAD ★',
  locationStamp: 'BERLIN / KREUZBERG',
  dateStamp: '2026.08.25',
  editionCode: 'SYS-KP-001',
  layout: 'multi-ribbon',
  aspectRatio: '4:5',
  animationPreset: 'rhythmic-pulse',
  timingFunction: 'cubic-punch',
  marqueeSpeed: 8,
  scaleRhythm: 1.8,
  scaleIntensity: 1.28,
  skewAngle: 6,
  skewAnimation: true,
  waveDistortion: false,
  isFrozen: false,
  fontFamily: 'Unbounded',
  fontWeight: 900,
  letterSpacing: -0.04,
  lineHeight: 1.0,
  uppercase: true,
  outlineMode: false,
  strokeWidth: 2,
  paletteId: 'neon',
  customPalette: {
    background: '#0a0a0c',
    foreground: '#39ff14',
    accent1: '#ff007f',
    accent2: '#ffff00',
    border: '#39ff14',
  },
  showScanlines: true,
  showGrain: true,
  showGridLines: true,
  showCrosshairs: true,
  showBarcode: true,
  chromaticAberration: true,
  invertOnHover: true,
  customRows: [],
  bpmSync: false,
  bpm: 128,
};

const RANDOM_HEADLINES = [
  'KINETIC // REALITY',
  'SUB_AUDIO MATRIX',
  'RAW CSS ENGINE',
  'BERLIN UNDERGROUND',
  'FUTURE HARDWARE',
  'OPTICAL DISTORTION',
  'SYNTHETIC VISION',
  'SUPER_KINETIC',
];

const RANDOM_SUBHEADS = [
  'DYNAMIC BRUTALIST EXPERIMENT',
  '60 FPS HARDWARE ACCELERATED',
  'ZERO JS ANIMATION OVERHEAD',
  'PURE CSS KEYFRAMES & VARS',
  'HIGH FREQUENCY MODULATION',
  'AUTONOMOUS TYPO SYSTEM',
];

export default function App() {
  const [config, setConfig] = useState<PosterConfig>(INITIAL_CONFIG);
  const [isExporting, setIsExporting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const posterRef = useRef<HTMLDivElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleToggleFreeze = () => {
    setConfig((prev) => {
      const nextFrozen = !prev.isFrozen;
      showToast(nextFrozen ? 'Animation Frozen' : 'Animation Resumed');
      return { ...prev, isFrozen: nextFrozen };
    });
  };

  const handleSelectAspectRatio = (ratio: AspectRatio) => {
    setConfig((prev) => ({ ...prev, aspectRatio: ratio }));
  };

  const handleApplyPreset = (presetId: string) => {
    const preset = POSTER_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setConfig((prev) => ({
        ...prev,
        ...preset.config,
      }));
      showToast(`Loaded Preset: ${preset.name}`);
    }
  };

  const handleApplyAnimationPreset = (presetId: AnimationPresetId) => {
    if (presetId === 'custom') {
      setConfig((prev) => ({ ...prev, animationPreset: 'custom' }));
      return;
    }
    const preset = ANIMATION_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setConfig((prev) => ({
        ...prev,
        animationPreset: preset.id,
        marqueeSpeed: preset.settings.marqueeSpeed,
        scaleRhythm: preset.settings.scaleRhythm,
        scaleIntensity: preset.settings.scaleIntensity,
        skewAngle: preset.settings.skewAngle,
        skewAnimation: preset.settings.skewAnimation,
        waveDistortion: preset.settings.waveDistortion,
        chromaticAberration: preset.settings.chromaticAberration,
        timingFunction: preset.settings.timingFunction,
        bpmSync: preset.settings.bpmSync ?? prev.bpmSync,
        bpm: preset.settings.bpm ?? prev.bpm,
      }));
      showToast(`Applied Motion: ${preset.name}`);
    }
  };

  const handleRandomize = () => {
    const randomHead = RANDOM_HEADLINES[Math.floor(Math.random() * RANDOM_HEADLINES.length)];
    const randomSub = RANDOM_SUBHEADS[Math.floor(Math.random() * RANDOM_SUBHEADS.length)];
    const layouts: PosterLayout[] = [
      'multi-ribbon',
      'diagonal-slash',
      'brutalist-block',
      'cylinder-3d',
      'matrix-ticker',
      'monolith-split',
    ];
    const fonts: FontFamily[] = [
      'Unbounded',
      'Syne',
      'Anton',
      'Bebas Neue',
      'JetBrains Mono',
      'Rubik Glitch',
    ];
    const palettes: ColorPaletteId[] = ['neon', 'monochrome', 'cyberpunk', 'acid', 'thermal', 'hyperpop'];
    const speeds = [5, 8, 10, 12, 16];
    const rhythms = [1.6, 2.0, 2.4, 3.0];
    const skews = [-12, -6, 0, 6, 12];

    const randomLayout = layouts[Math.floor(Math.random() * layouts.length)];
    const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
    const randomPalette = palettes[Math.floor(Math.random() * palettes.length)];
    const randomSpeed = speeds[Math.floor(Math.random() * speeds.length)];
    const randomRhythm = rhythms[Math.floor(Math.random() * rhythms.length)];
    const randomSkew = skews[Math.floor(Math.random() * skews.length)];

    setConfig((prev) => ({
      ...prev,
      mainHeadline: randomHead,
      subHeadline: randomSub,
      layout: randomLayout,
      fontFamily: randomFont,
      paletteId: randomPalette,
      marqueeSpeed: randomSpeed,
      scaleRhythm: randomRhythm,
      skewAngle: randomSkew,
      skewAnimation: Math.random() > 0.5,
      chromaticAberration: Math.random() > 0.3,
      outlineMode: Math.random() > 0.6,
      editionCode: `SYS-KP-${Math.floor(100 + Math.random() * 900)}`,
    }));

    showToast('Randomized Kinetic Poster!');
  };

  const handleExportImage = async () => {
    if (!posterRef.current || isExporting) return;
    setIsExporting(true);
    showToast('Capturing High-Resolution Poster Frame...');

    try {
      // Temporarily ensure high DPI export
      const canvas = await html2canvas(posterRef.current, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().slice(0, 10);
      link.download = `kinetic-poster-${config.mainHeadline.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${timestamp}.png`;
      link.href = dataUrl;
      link.click();
      showToast('Poster PNG Downloaded Successfully!');
    } catch (err) {
      console.error('Failed to export poster frame:', err);
      showToast('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-neutral-100 selection:text-neutral-950">
      {/* 1. Header Bar */}
      <HeaderBar
        isFrozen={config.isFrozen}
        onToggleFreeze={handleToggleFreeze}
        onExportImage={handleExportImage}
        isExporting={isExporting}
        aspectRatio={config.aspectRatio}
        onSelectAspectRatio={handleSelectAspectRatio}
        animationPreset={config.animationPreset}
        onSelectAnimationPreset={handleApplyAnimationPreset}
        onOpenSvelteKitModal={() => setIsModalOpen(true)}
        onRandomize={handleRandomize}
      />

      {/* 2. Main Studio Workspace: Responsive 2-Pane Layout */}
      <main className="flex-1 w-full max-w-[1700px] mx-auto p-2 sm:p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
        {/* Left Column: Live Kinetic Poster Viewport Stage */}
        <section className="lg:col-span-7 xl:col-span-8 flex flex-col items-center justify-center bg-neutral-900/50 border border-neutral-800 p-2 sm:p-4 md:p-6 min-h-[500px] lg:min-h-[720px] rounded-lg relative overflow-hidden">
          {/* Stage watermark & guidelines info */}
          <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-neutral-800/80 text-[10px] font-mono text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span>STAGE // HARDWARE-ACCELERATED CSS CANVAS</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="opacity-75">ASPECT: {config.aspectRatio}</span>
              <span className="opacity-75">LAYOUT: {config.layout.toUpperCase()}</span>
            </div>
          </div>

          {/* Core Interactive Kinetic Poster */}
          <KineticPoster config={config} posterRef={posterRef} />

          {/* Stage Bottom Helper Tip */}
          <div className="mt-3 text-[11px] font-mono text-neutral-500 text-center flex items-center gap-2">
            <span>Tip: Hover over typography ribbons to trigger interactive kinetic distortion</span>
          </div>
        </section>

        {/* Right Column: Brutalist Control Deck */}
        <section className="lg:col-span-5 xl:col-span-4 h-full flex flex-col">
          <ControlPanel
            config={config}
            onChange={setConfig}
            onApplyPreset={handleApplyPreset}
            onApplyAnimationPreset={handleApplyAnimationPreset}
            onRandomize={handleRandomize}
          />
        </section>
      </main>

      {/* 3. Toast Notifications */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-neutral-900 border-2 border-emerald-400 text-emerald-300 px-4 py-2.5 shadow-2xl font-mono text-xs font-bold flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 4. SvelteKit Architecture & Vercel Guide Modal */}
      <SvelteKitExportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        config={config}
      />
    </div>
  );
}
