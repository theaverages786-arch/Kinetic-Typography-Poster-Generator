import React, { useState } from 'react';
import {
  Play,
  Pause,
  Download,
  Code2,
  Maximize2,
  Sparkles,
  Layers,
  Check,
  Share2,
  Activity,
  Zap,
} from 'lucide-react';
import { AspectRatio, AnimationPresetId } from '../types';
import { ANIMATION_PRESETS } from '../constants/animationPresets';

interface HeaderBarProps {
  isFrozen: boolean;
  onToggleFreeze: () => void;
  onExportImage: () => Promise<void>;
  isExporting: boolean;
  aspectRatio: AspectRatio;
  onSelectAspectRatio: (ratio: AspectRatio) => void;
  animationPreset: AnimationPresetId;
  onSelectAnimationPreset: (presetId: AnimationPresetId) => void;
  onOpenSvelteKitModal: () => void;
  onRandomize: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  isFrozen,
  onToggleFreeze,
  onExportImage,
  isExporting,
  aspectRatio,
  onSelectAspectRatio,
  animationPreset,
  onSelectAnimationPreset,
  onOpenSvelteKitModal,
  onRandomize,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="w-full bg-neutral-950 border-b border-neutral-800 text-neutral-100 px-3 py-2.5 sm:px-5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50">
      {/* Brand & Engine Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-emerald-400 text-neutral-950 font-black text-xs flex items-center justify-center font-mono border border-emerald-300">
            KT
          </div>
          <div>
            <div className="font-mono font-black text-sm tracking-wider uppercase text-neutral-100 flex items-center gap-2">
              <span>Kinetic Poster</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-neutral-800 text-emerald-400 font-mono font-normal border border-neutral-700">
                RAW CSS
              </span>
            </div>
          </div>
        </div>

        {/* Live Engine Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-neutral-800 text-[11px] font-mono">
          <span
            className={`w-2 h-2 rounded-full ${
              isFrozen ? 'bg-amber-500' : 'bg-emerald-400 animate-pulse'
            }`}
          />
          <span className="text-neutral-400">
            {isFrozen ? 'STATUS: FROZEN' : '60FPS HARDWARE-ACCEL'}
          </span>
        </div>
      </div>

      {/* Animation Preset Quick Selector & Ratio Selector */}
      <div className="flex items-center gap-2">
        {/* Animation Preset Selector */}
        <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-2 py-1 text-xs font-mono">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-neutral-400 text-[10px] uppercase font-bold hidden lg:inline">Motion Style:</span>
          <select
            id="header-animation-preset-select"
            value={animationPreset}
            onChange={(e) => onSelectAnimationPreset(e.target.value as AnimationPresetId)}
            className="bg-transparent text-emerald-300 font-mono text-xs font-bold focus:outline-none cursor-pointer pr-1"
          >
            {ANIMATION_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id} className="bg-neutral-900 text-neutral-200">
                {preset.name}
              </option>
            ))}
            <option value="custom" className="bg-neutral-900 text-neutral-400">
              Custom Timing
            </option>
          </select>
        </div>

        {/* Center Aspect Ratio Quick Selector */}
        <div className="hidden md:flex items-center bg-neutral-900 border border-neutral-800 p-0.5 text-xs font-mono">
          {(['4:5', '1:1', '9:16', '3:4', '16:9'] as AspectRatio[]).map((r) => (
            <button
              key={r}
              id={`header-ratio-${r.replace(':', '-')}`}
              onClick={() => onSelectAspectRatio(r)}
              className={`px-2 py-1 transition-all cursor-pointer font-bold ${
                aspectRatio === r
                  ? 'bg-neutral-800 text-emerald-400 border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Action Controls: Freeze, Export Image, SvelteKit Code */}
      <div className="flex items-center gap-2">
        {/* Freeze / Unfreeze Toggle */}
        <button
          id="btn-freeze-toggle"
          onClick={onToggleFreeze}
          className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-mono font-bold transition-all cursor-pointer ${
            isFrozen
              ? 'border-amber-500/80 bg-amber-950/40 text-amber-300 hover:bg-amber-900/40'
              : 'border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-200'
          }`}
          title={isFrozen ? 'Resume kinetic animations' : 'Freeze frame to capture exact layout'}
        >
          {isFrozen ? <Play className="w-3.5 h-3.5 fill-amber-300" /> : <Pause className="w-3.5 h-3.5" />}
          <span>{isFrozen ? 'Resume' : 'Freeze'}</span>
        </button>

        {/* Download Frame as PNG */}
        <button
          id="btn-download-image"
          onClick={onExportImage}
          disabled={isExporting}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-neutral-950 font-mono font-black text-xs transition-all border border-emerald-400 cursor-pointer disabled:opacity-50"
          title="Capture current animation frame and download high-resolution PNG poster"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{isExporting ? 'Capturing...' : 'Download PNG'}</span>
        </button>

        {/* SvelteKit Source Code & Vercel Deploy Guide */}
        <button
          id="btn-open-sveltekit-guide"
          onClick={onOpenSvelteKitModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white font-mono font-bold text-xs transition-all cursor-pointer"
          title="View full SvelteKit project files and Vercel deployment guide"
        >
          <Code2 className="w-3.5 h-3.5 text-orange-400" />
          <span className="hidden sm:inline">SvelteKit & Deploy</span>
        </button>
      </div>
    </header>
  );
};
