import React, { useState } from 'react';
import {
  PosterConfig,
  FontFamily,
  PosterLayout,
  AspectRatio,
  ColorPaletteId,
  AnimationPresetId,
  TimingFunction,
} from '../types';
import { COLOR_PALETTES } from '../constants/palettes';
import { POSTER_PRESETS } from '../constants/presets';
import { ANIMATION_PRESETS } from '../constants/animationPresets';
import {
  Type,
  Activity,
  Palette,
  Sliders,
  Sparkles,
  Layout,
  Music,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  Zap,
  Wind,
  Radio,
  Clock,
  Gauge,
} from 'lucide-react';

interface ControlPanelProps {
  config: PosterConfig;
  onChange: (updater: (prev: PosterConfig) => PosterConfig) => void;
  onApplyPreset: (presetId: string) => void;
  onApplyAnimationPreset: (presetId: AnimationPresetId) => void;
  onRandomize: () => void;
}

type TabType = 'typography' | 'motion' | 'palettes' | 'layout' | 'fx' | 'presets';

const FONT_FAMILIES: FontFamily[] = [
  'Unbounded',
  'Syne',
  'Anton',
  'Bebas Neue',
  'JetBrains Mono',
  'Rubik Glitch',
  'Major Mono Display',
  'Work Sans',
];

const LAYOUTS: { id: PosterLayout; name: string; desc: string }[] = [
  { id: 'multi-ribbon', name: 'Multi Ribbon', desc: 'Alternating stacked kinetic strips' },
  { id: 'diagonal-slash', name: 'Diagonal 45°', desc: 'Slanted high-speed kinetic slash' },
  { id: 'brutalist-block', name: 'Brutalist Monolith', desc: 'Massive center hero with frame tickers' },
  { id: 'cylinder-3d', name: '3D Cylinder Roll', desc: 'Rotational depth perspective roll' },
  { id: 'matrix-ticker', name: 'Matrix Micro-Grid', desc: 'Dense data matrix ticker lines' },
  { id: 'monolith-split', name: 'Dual Monolith Split', desc: 'Inverted two-tone contrasting halves' },
];

const ASPECT_RATIOS: { id: AspectRatio; label: string; ratio: string }[] = [
  { id: '4:5', label: 'Poster 4:5', ratio: 'Instagram / Print' },
  { id: '1:1', label: 'Square 1:1', ratio: 'Feed / Vinyl' },
  { id: '9:16', label: 'Story 9:16', ratio: 'Mobile / Reel' },
  { id: '3:4', label: 'Classic 3:4', ratio: 'Standard Gallery' },
  { id: '16:9', label: 'Banner 16:9', ratio: 'Display / Billboard' },
];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  config,
  onChange,
  onApplyPreset,
  onApplyAnimationPreset,
  onRandomize,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('typography');
  const [tapTimestamps, setTapTimestamps] = useState<number[]>([]);

  // Tap tempo handler for BPM sync
  const handleTapBpm = () => {
    const now = Date.now();
    const recentTaps = [...tapTimestamps, now].filter((t) => now - t < 3000);
    setTapTimestamps(recentTaps);

    if (recentTaps.length > 1) {
      const intervals = [];
      for (let i = 1; i < recentTaps.length; i++) {
        intervals.push(recentTaps[i] - recentTaps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      if (calculatedBpm >= 40 && calculatedBpm <= 240) {
        onChange((prev) => ({
          ...prev,
          bpmSync: true,
          bpm: calculatedBpm,
        }));
      }
    }
  };

  const updateConfig = <K extends keyof PosterConfig>(key: K, value: PosterConfig[K]) => {
    onChange((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 flex flex-col h-full shadow-2xl rounded-none md:rounded-lg overflow-hidden">
      {/* Control Panel Header */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-neutral-950 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-xs font-black tracking-wider uppercase text-neutral-200">
            Control Engine // CSS Reactive
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            id="randomize-btn"
            onClick={onRandomize}
            className="flex items-center gap-1 px-2 py-1 bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-300 hover:text-white text-[11px] font-mono font-bold tracking-tight transition-all border border-neutral-700 cursor-pointer"
            title="Randomize typography, colors, and motion"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Randomize</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-6 border-b border-neutral-800 bg-neutral-950 text-[11px] font-mono uppercase font-bold tracking-tight">
        <button
          id="tab-typography"
          onClick={() => setActiveTab('typography')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 border-r border-neutral-800 transition-colors cursor-pointer ${
            activeTab === 'typography'
              ? 'bg-neutral-800 text-emerald-400 border-b-2 border-b-emerald-400'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Type</span>
        </button>

        <button
          id="tab-motion"
          onClick={() => setActiveTab('motion')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 border-r border-neutral-800 transition-colors cursor-pointer ${
            activeTab === 'motion'
              ? 'bg-neutral-800 text-emerald-400 border-b-2 border-b-emerald-400'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Motion</span>
        </button>

        <button
          id="tab-palettes"
          onClick={() => setActiveTab('palettes')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 border-r border-neutral-800 transition-colors cursor-pointer ${
            activeTab === 'palettes'
              ? 'bg-neutral-800 text-emerald-400 border-b-2 border-b-emerald-400'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Color</span>
        </button>

        <button
          id="tab-layout"
          onClick={() => setActiveTab('layout')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 border-r border-neutral-800 transition-colors cursor-pointer ${
            activeTab === 'layout'
              ? 'bg-neutral-800 text-emerald-400 border-b-2 border-b-emerald-400'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Layout</span>
        </button>

        <button
          id="tab-fx"
          onClick={() => setActiveTab('fx')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 border-r border-neutral-800 transition-colors cursor-pointer ${
            activeTab === 'fx'
              ? 'bg-neutral-800 text-emerald-400 border-b-2 border-b-emerald-400'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">FX</span>
        </button>

        <button
          id="tab-presets"
          onClick={() => setActiveTab('presets')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 transition-colors cursor-pointer ${
            activeTab === 'presets'
              ? 'bg-neutral-800 text-emerald-400 border-b-2 border-b-emerald-400'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Presets</span>
        </button>
      </div>

      {/* Tab Body Contents */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar text-xs">
        {/* TAB 1: TYPOGRAPHY & TEXT INPUTS */}
        {activeTab === 'typography' && (
          <div className="space-y-4">
            {/* Primary Text Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-neutral-400 mb-1">
                  Main Headline (Kinetic Ribbon)
                </label>
                <input
                  id="input-main-headline"
                  type="text"
                  value={config.mainHeadline}
                  onChange={(e) => updateConfig('mainHeadline', e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 px-3 py-2 text-white font-mono text-sm focus:border-emerald-400 focus:outline-none transition-colors"
                  placeholder="e.g. KINETIC // REALITY"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-neutral-400 mb-1">
                  Sub-Headline (Secondary Track)
                </label>
                <input
                  id="input-sub-headline"
                  type="text"
                  value={config.subHeadline}
                  onChange={(e) => updateConfig('subHeadline', e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 px-3 py-2 text-white font-mono text-sm focus:border-emerald-400 focus:outline-none transition-colors"
                  placeholder="e.g. DYNAMIC BRUTALIST EXPERIMENT"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-neutral-400 mb-1">
                  Perimeter Running Ticker Text
                </label>
                <input
                  id="input-ticker-text"
                  type="text"
                  value={config.tickerText}
                  onChange={(e) => updateConfig('tickerText', e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 px-3 py-2 text-white font-mono text-sm focus:border-emerald-400 focus:outline-none transition-colors"
                  placeholder="e.g. RAW CSS ENGINE ★ ZERO JAVASCRIPT ANIMATION OVERHEAD ★"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-mono uppercase font-bold text-neutral-400 mb-1 truncate">
                    Location Stamp
                  </label>
                  <input
                    type="text"
                    value={config.locationStamp}
                    onChange={(e) => updateConfig('locationStamp', e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 px-2 py-1.5 text-white font-mono text-xs focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase font-bold text-neutral-400 mb-1 truncate">
                    Date / Time
                  </label>
                  <input
                    type="text"
                    value={config.dateStamp}
                    onChange={(e) => updateConfig('dateStamp', e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 px-2 py-1.5 text-white font-mono text-xs focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase font-bold text-neutral-400 mb-1 truncate">
                    Edition Code
                  </label>
                  <input
                    type="text"
                    value={config.editionCode}
                    onChange={(e) => updateConfig('editionCode', e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 px-2 py-1.5 text-white font-mono text-xs focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Font Family Selection */}
            <div className="pt-2 border-t border-neutral-800">
              <label className="block text-[11px] font-mono uppercase font-bold text-neutral-400 mb-2">
                Brutalist Font Family
              </label>
              <div className="grid grid-cols-2 gap-2">
                {FONT_FAMILIES.map((font) => (
                  <button
                    key={font}
                    id={`font-btn-${font.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => updateConfig('fontFamily', font)}
                    className={`px-3 py-2 text-left border text-xs font-bold transition-all cursor-pointer ${
                      config.fontFamily === font
                        ? 'border-emerald-400 bg-emerald-950/40 text-emerald-300 shadow-sm'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                    }`}
                  >
                    <span className="truncate block">{font}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Weight & Letter Spacing Sliders */}
            <div className="space-y-3 pt-2 border-t border-neutral-800">
              <div>
                <div className="flex justify-between text-neutral-300 font-mono text-[11px] mb-1">
                  <span>Font Weight</span>
                  <span className="font-bold text-emerald-400">{config.fontWeight}</span>
                </div>
                <input
                  id="slider-font-weight"
                  type="range"
                  min="300"
                  max="900"
                  step="100"
                  value={config.fontWeight}
                  onChange={(e) => updateConfig('fontWeight', Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-300 font-mono text-[11px] mb-1">
                  <span>Letter Spacing (Tracking)</span>
                  <span className="font-bold text-emerald-400">
                    {config.letterSpacing.toFixed(2)}em
                  </span>
                </div>
                <input
                  id="slider-letter-spacing"
                  type="range"
                  min="-0.08"
                  max="0.4"
                  step="0.01"
                  value={config.letterSpacing}
                  onChange={(e) => updateConfig('letterSpacing', Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  id="toggle-outline-mode"
                  onClick={() => updateConfig('outlineMode', !config.outlineMode)}
                  className={`p-2 border text-center font-mono font-bold text-xs transition-colors cursor-pointer ${
                    config.outlineMode
                      ? 'border-emerald-400 bg-emerald-950/40 text-emerald-300'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400'
                  }`}
                >
                  Text Stroke Outline
                </button>

                <button
                  id="toggle-uppercase"
                  onClick={() => updateConfig('uppercase', !config.uppercase)}
                  className={`p-2 border text-center font-mono font-bold text-xs transition-colors cursor-pointer ${
                    config.uppercase
                      ? 'border-emerald-400 bg-emerald-950/40 text-emerald-300'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400'
                  }`}
                >
                  Force Uppercase
                </button>
              </div>

              {config.outlineMode && (
                <div>
                  <div className="flex justify-between text-neutral-300 font-mono text-[11px] mb-1">
                    <span>Stroke Width</span>
                    <span className="font-bold text-emerald-400">{config.strokeWidth}px</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="0.5"
                    value={config.strokeWidth}
                    onChange={(e) => updateConfig('strokeWidth', Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: KINETIC MOTION & RAW CSS KEYFRAME CONTROLS */}
        {activeTab === 'motion' && (
          <div className="space-y-4">
            {/* 1. Animation Presets Section */}
            <div className="p-3 bg-neutral-950 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-xs font-black uppercase text-neutral-200">
                    Animation Presets
                  </span>
                </div>
                {/* Dropdown Selector */}
                <select
                  id="motion-preset-select"
                  value={config.animationPreset}
                  onChange={(e) => onApplyAnimationPreset(e.target.value as AnimationPresetId)}
                  className="bg-neutral-900 border border-neutral-700 text-emerald-300 text-xs font-mono font-bold px-2 py-1 focus:border-emerald-400 focus:outline-none cursor-pointer"
                >
                  {ANIMATION_PRESETS.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.name}
                    </option>
                  ))}
                  <option value="custom">Custom Timing</option>
                </select>
              </div>

              {/* 5 Distinct Animation Preset Buttons */}
              <div className="grid grid-cols-1 gap-2">
                {ANIMATION_PRESETS.map((preset) => {
                  const isSelected = config.animationPreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      id={`anim-preset-${preset.id}`}
                      onClick={() => onApplyAnimationPreset(preset.id)}
                      className={`p-2.5 border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-400 bg-emerald-950/30 ring-1 ring-emerald-400 shadow-sm'
                          : 'border-neutral-800 bg-neutral-900 hover:border-neutral-700 hover:bg-neutral-850'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-emerald-400 animate-ping' : 'bg-neutral-600'}`} />
                          <span className="font-mono font-bold text-xs text-neutral-100">
                            {preset.name}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-neutral-800 text-emerald-400 border border-neutral-700">
                          {preset.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-snug font-sans pl-4">
                        {preset.description}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-500 pl-4 pt-1">
                        <span>Speed: {preset.settings.marqueeSpeed}s</span>
                        <span>•</span>
                        <span>Rhythm: {preset.settings.scaleRhythm}s</span>
                        <span>•</span>
                        <span>Timing: {preset.settings.timingFunction}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Timing Function Selector */}
            <div className="p-3 bg-neutral-950 border border-neutral-800 space-y-2">
              <label className="block text-[11px] font-mono uppercase font-bold text-neutral-400">
                CSS Animation Timing Function
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {(
                  [
                    { id: 'linear', label: 'Linear', desc: 'Constant rate' },
                    { id: 'ease-in-out', label: 'Ease In-Out', desc: 'Smooth sine' },
                    { id: 'cubic-punch', label: 'Cubic Punch', desc: 'Bouncy impact' },
                    { id: 'steps-glitch', label: 'Steps Glitch', desc: 'Stepped cycle' },
                  ] as { id: TimingFunction; label: string; desc: string }[]
                ).map((t) => (
                  <button
                    key={t.id}
                    id={`timing-${t.id}`}
                    onClick={() => {
                      updateConfig('timingFunction', t.id);
                      updateConfig('animationPreset', 'custom');
                    }}
                    className={`px-2 py-1.5 border text-center font-mono transition-all cursor-pointer ${
                      config.timingFunction === t.id
                        ? 'border-emerald-400 bg-emerald-950/40 text-emerald-300 font-bold'
                        : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <div className="text-[11px]">{t.label}</div>
                    <div className="text-[9px] text-neutral-500 truncate">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Granular Speed & Rhythm Sliders */}
            <div className="space-y-3 pt-2 border-t border-neutral-800">
              <div>
                <div className="flex justify-between text-neutral-300 font-mono text-[11px] mb-1">
                  <span>Marquee Scroll Speed (Duration)</span>
                  <span className="font-bold text-emerald-400">{config.marqueeSpeed}s</span>
                </div>
                <input
                  id="slider-marquee-speed"
                  type="range"
                  min="2"
                  max="25"
                  step="0.5"
                  value={config.marqueeSpeed}
                  onChange={(e) => {
                    updateConfig('marqueeSpeed', Number(e.target.value));
                    updateConfig('animationPreset', 'custom');
                  }}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-0.5">
                  <span>Fast (2s)</span>
                  <span>Normal (10s)</span>
                  <span>Slow (25s)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-neutral-300 font-mono text-[11px] mb-1">
                  <span>Rhythmic Scale Pulse</span>
                  <span className="font-bold text-emerald-400">{config.scaleRhythm}s</span>
                </div>
                <input
                  id="slider-scale-rhythm"
                  type="range"
                  min="0.6"
                  max="6"
                  step="0.1"
                  value={config.scaleRhythm}
                  onChange={(e) => {
                    updateConfig('scaleRhythm', Number(e.target.value));
                    updateConfig('animationPreset', 'custom');
                  }}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-300 font-mono text-[11px] mb-1">
                  <span>Scale Pulse Amplitude (Intensity)</span>
                  <span className="font-bold text-emerald-400">{config.scaleIntensity.toFixed(2)}x</span>
                </div>
                <input
                  id="slider-scale-intensity"
                  type="range"
                  min="1.0"
                  max="1.45"
                  step="0.01"
                  value={config.scaleIntensity}
                  onChange={(e) => {
                    updateConfig('scaleIntensity', Number(e.target.value));
                    updateConfig('animationPreset', 'custom');
                  }}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-300 font-mono text-[11px] mb-1">
                  <span>Kinetic Skew Distortion Angle</span>
                  <span className="font-bold text-emerald-400">{config.skewAngle}°</span>
                </div>
                <input
                  id="slider-skew-angle"
                  type="range"
                  min="-25"
                  max="25"
                  step="1"
                  value={config.skewAngle}
                  onChange={(e) => {
                    updateConfig('skewAngle', Number(e.target.value));
                    updateConfig('animationPreset', 'custom');
                  }}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Dynamic Kinetic Motion Toggles */}
            <div className="space-y-2 pt-2 border-t border-neutral-800">
              <div className="flex items-center justify-between p-2.5 bg-neutral-950 border border-neutral-800">
                <div>
                  <span className="font-mono font-bold text-neutral-200 block">
                    Continuous Skew Oscillation
                  </span>
                  <span className="text-[10px] text-neutral-500">
                    Wave distortion back and forth via @keyframes
                  </span>
                </div>
                <button
                  id="toggle-skew-anim"
                  onClick={() => updateConfig('skewAnimation', !config.skewAnimation)}
                  className={`w-10 h-6 flex items-center p-1 transition-colors cursor-pointer ${
                    config.skewAnimation ? 'bg-emerald-500 justify-end' : 'bg-neutral-800 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 bg-neutral-950" />
                </button>
              </div>

              {/* Audio BPM Rhythm Simulator */}
              <div className="p-3 bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-mono font-bold text-neutral-200">
                      BPM Rhythm Sync
                    </span>
                  </div>
                  <button
                    id="toggle-bpm-sync"
                    onClick={() => updateConfig('bpmSync', !config.bpmSync)}
                    className={`w-8 h-5 flex items-center p-0.5 transition-colors cursor-pointer ${
                      config.bpmSync ? 'bg-emerald-500 justify-end' : 'bg-neutral-800 justify-start'
                    }`}
                  >
                    <div className="w-3.5 h-3.5 bg-neutral-950" />
                  </button>
                </div>

                {config.bpmSync && (
                  <div className="pt-2 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400 font-mono text-[11px]">Tempo</span>
                      <span className="text-emerald-400 font-mono font-bold">{config.bpm} BPM</span>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="180"
                      step="1"
                      value={config.bpm}
                      onChange={(e) => updateConfig('bpm', Number(e.target.value))}
                      className="w-full accent-emerald-400 cursor-pointer"
                    />
                    <button
                      id="btn-tap-bpm"
                      onClick={handleTapBpm}
                      className="w-full py-1.5 bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 font-mono font-bold hover:bg-emerald-900/60 active:scale-98 transition-all cursor-pointer text-center"
                    >
                      Tap Tempo Beat (Click Repeatedly)
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COLOR PALETTES */}
        {activeTab === 'palettes' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {COLOR_PALETTES.map((palette) => {
                const isSelected = config.paletteId === palette.id;
                return (
                  <button
                    key={palette.id}
                    id={`palette-${palette.id}`}
                    onClick={() => updateConfig('paletteId', palette.id)}
                    className={`p-2.5 border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-400 bg-neutral-800/80 shadow-md ring-1 ring-emerald-400'
                        : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-neutral-200">
                        {palette.name}
                      </span>
                      <span className="text-[9px] font-mono px-1 border border-neutral-700 text-neutral-400">
                        {palette.tag}
                      </span>
                    </div>

                    {/* Color Swatch Bars */}
                    <div className="flex h-4 w-full border border-neutral-700 overflow-hidden">
                      <div className="flex-1" style={{ backgroundColor: palette.background }} />
                      <div className="flex-1" style={{ backgroundColor: palette.foreground }} />
                      <div className="flex-1" style={{ backgroundColor: palette.accent1 }} />
                      <div className="flex-1" style={{ backgroundColor: palette.accent2 }} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Palette Editor */}
            <div className="pt-3 border-t border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-neutral-200">
                  Custom Palette Maker
                </span>
                <button
                  id="btn-use-custom-palette"
                  onClick={() => updateConfig('paletteId', 'custom')}
                  className={`px-2 py-1 text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                    config.paletteId === 'custom'
                      ? 'border-emerald-400 bg-emerald-950/40 text-emerald-300'
                      : 'border-neutral-700 text-neutral-400 hover:text-white'
                  }`}
                >
                  {config.paletteId === 'custom' ? 'Active' : 'Activate Custom'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                  <span className="text-neutral-400 font-mono text-[10px]">Background</span>
                  <input
                    type="color"
                    value={config.customPalette.background}
                    onChange={(e) => {
                      onChange((prev) => ({
                        ...prev,
                        paletteId: 'custom',
                        customPalette: { ...prev.customPalette, background: e.target.value },
                      }));
                    }}
                    className="w-6 h-6 border-0 bg-transparent cursor-pointer"
                  />
                </div>

                <div className="p-2 bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                  <span className="text-neutral-400 font-mono text-[10px]">Foreground</span>
                  <input
                    type="color"
                    value={config.customPalette.foreground}
                    onChange={(e) => {
                      onChange((prev) => ({
                        ...prev,
                        paletteId: 'custom',
                        customPalette: { ...prev.customPalette, foreground: e.target.value },
                      }));
                    }}
                    className="w-6 h-6 border-0 bg-transparent cursor-pointer"
                  />
                </div>

                <div className="p-2 bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                  <span className="text-neutral-400 font-mono text-[10px]">Accent 1</span>
                  <input
                    type="color"
                    value={config.customPalette.accent1}
                    onChange={(e) => {
                      onChange((prev) => ({
                        ...prev,
                        paletteId: 'custom',
                        customPalette: { ...prev.customPalette, accent1: e.target.value },
                      }));
                    }}
                    className="w-6 h-6 border-0 bg-transparent cursor-pointer"
                  />
                </div>

                <div className="p-2 bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                  <span className="text-neutral-400 font-mono text-[10px]">Accent 2</span>
                  <input
                    type="color"
                    value={config.customPalette.accent2}
                    onChange={(e) => {
                      onChange((prev) => ({
                        ...prev,
                        paletteId: 'custom',
                        customPalette: { ...prev.customPalette, accent2: e.target.value },
                      }));
                    }}
                    className="w-6 h-6 border-0 bg-transparent cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LAYOUT & DIMENSIONS */}
        {activeTab === 'layout' && (
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase font-bold text-neutral-400 mb-2">
                Poster Aspect Ratio
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ASPECT_RATIOS.map((item) => (
                  <button
                    key={item.id}
                    id={`ratio-${item.id.replace(':', '-')}`}
                    onClick={() => updateConfig('aspectRatio', item.id)}
                    className={`p-2 border text-left transition-all cursor-pointer ${
                      config.aspectRatio === item.id
                        ? 'border-emerald-400 bg-emerald-950/30 text-emerald-300'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <div className="font-mono font-bold text-xs">{item.label}</div>
                    <div className="text-[9px] opacity-60 font-mono truncate">{item.ratio}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-800">
              <label className="block text-[11px] font-mono uppercase font-bold text-neutral-400 mb-2">
                Brutalist Layout Structure
              </label>
              <div className="space-y-2">
                {LAYOUTS.map((layout) => (
                  <button
                    key={layout.id}
                    id={`layout-btn-${layout.id}`}
                    onClick={() => updateConfig('layout', layout.id)}
                    className={`w-full p-2.5 border text-left flex items-center justify-between transition-all cursor-pointer ${
                      config.layout === layout.id
                        ? 'border-emerald-400 bg-neutral-800/80 shadow-md text-emerald-300 ring-1 ring-emerald-400'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                    }`}
                  >
                    <div>
                      <div className="font-mono font-bold text-xs">{layout.name}</div>
                      <div className="text-[10px] text-neutral-500">{layout.desc}</div>
                    </div>
                    {config.layout === layout.id && (
                      <span className="text-emerald-400 font-mono text-xs">● Active</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: BRUTALIST OVERLAYS & FX */}
        {activeTab === 'fx' && (
          <div className="space-y-3">
            {[
              {
                id: 'showScanlines',
                title: 'CRT Scanlines Overlay',
                desc: 'Retro cathode-ray tube horizontal raster lines',
                value: config.showScanlines,
              },
              {
                id: 'showGrain',
                title: 'Film Grain Texture',
                desc: 'Analog textured noise overlay',
                value: config.showGrain,
              },
              {
                id: 'showGridLines',
                title: 'Brutalist Alignment Grid',
                desc: 'Technical swiss typographic layout grid guide',
                value: config.showGridLines,
              },
              {
                id: 'showCrosshairs',
                title: 'Corner Alignment Crosshairs',
                desc: 'Precision print registration marks in corners',
                value: config.showCrosshairs,
              },
              {
                id: 'showBarcode',
                title: 'Barcodes & Tech Stamps',
                desc: 'Industrial edition barcode stamp',
                value: config.showBarcode,
              },
              {
                id: 'chromaticAberration',
                title: 'RGB Chromatic Glitch',
                desc: 'RGB color channel displacement effect',
                value: config.chromaticAberration,
              },
              {
                id: 'waveDistortion',
                title: 'SVG Displacement Warp Filter',
                desc: 'Dynamic fluid optical refraction warp',
                value: config.waveDistortion,
              },
            ].map((fx) => (
              <div
                key={fx.id}
                className="flex items-center justify-between p-2.5 bg-neutral-950 border border-neutral-800"
              >
                <div>
                  <span className="font-mono font-bold text-neutral-200 block text-xs">
                    {fx.title}
                  </span>
                  <span className="text-[10px] text-neutral-500 block">{fx.desc}</span>
                </div>
                <button
                  id={`toggle-fx-${fx.id}`}
                  onClick={() =>
                    updateConfig(
                      fx.id as keyof PosterConfig,
                      !config[fx.id as keyof PosterConfig]
                    )
                  }
                  className={`w-9 h-5 flex items-center p-0.5 transition-colors cursor-pointer ${
                    fx.value ? 'bg-emerald-500 justify-end' : 'bg-neutral-800 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 bg-neutral-950" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 6: CURATED PRESETS */}
        {activeTab === 'presets' && (
          <div className="space-y-3">
            <p className="text-[11px] font-mono text-neutral-400">
              Select a curated kinetic poster preset with tuned typography, speed, and raw CSS keyframe choreography:
            </p>
            <div className="space-y-2.5">
              {POSTER_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  id={`preset-btn-${preset.id}`}
                  onClick={() => onApplyPreset(preset.id)}
                  className="w-full p-3 bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 hover:border-emerald-400 text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-black text-xs text-neutral-200 group-hover:text-emerald-300">
                      {preset.name}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 bg-neutral-800 text-neutral-400 border border-neutral-700">
                      {preset.category}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-500 line-clamp-2">{preset.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
