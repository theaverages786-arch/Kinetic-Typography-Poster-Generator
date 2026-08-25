import React, { useState } from 'react';
import { X, Copy, Check, FileCode, Terminal, Rocket, Layers } from 'lucide-react';
import { PosterConfig } from '../types';

interface SvelteKitExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PosterConfig;
}

export const SvelteKitExportModal: React.FC<SvelteKitExportModalProps> = ({
  isOpen,
  onClose,
  config,
}) => {
  const [activeFile, setActiveFile] = useState<
    'page' | 'poster' | 'controls' | 'store' | 'css' | 'config' | 'deploy'
  >('page');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const files = {
    page: {
      name: 'src/routes/+page.svelte',
      lang: 'svelte',
      code: `<script lang="ts">
  import KineticPoster from '$lib/components/KineticPoster.svelte';
  import ControlDeck from '$lib/components/ControlDeck.svelte';
  import { posterConfig, freezeAnimation, randomizeConfig } from '$lib/stores/poster';

  let posterElement: HTMLElement;

  // Reactivity using Svelte reactive declaration ($:)
  $: timingFunctionCss = $posterConfig.timingFunction === 'cubic-punch' 
    ? 'cubic-bezier(0.25, 1, 0.5, 1)' 
    : $posterConfig.timingFunction === 'steps-glitch' 
    ? 'steps(8, jump-end)' 
    : $posterConfig.timingFunction || 'linear';

  $: cssStyleString = \`
    --poster-bg: \${$posterConfig.palette.background};
    --poster-fg: \${$posterConfig.palette.foreground};
    --poster-accent1: \${$posterConfig.palette.accent1};
    --poster-accent2: \${$posterConfig.palette.accent2};
    --poster-border: \${$posterConfig.palette.border};
    --marquee-speed: \${$posterConfig.marqueeSpeed}s;
    --marquee-timing-fn: \${timingFunctionCss};
    --scale-rhythm: \${$posterConfig.scaleRhythm}s;
    --scale-intensity: \${$posterConfig.scaleIntensity};
    --skew-angle: \${$posterConfig.skewAngle}deg;
    --play-state: \${$posterConfig.isFrozen ? 'paused' : 'running'};
  \`;

  async function exportPoster() {
    // Dynamic import of html2canvas for client-side export
    const html2canvas = (await import('html2canvas')).default;
    if (!posterElement) return;

    const canvas = await html2canvas(posterElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: null
    });

    const link = document.createElement('a');
    link.download = \`kinetic-poster-\${Date.now()}.png\`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
</script>

<svelte:head>
  <title>Kinetic Typography Poster Generator</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=Syne:wght@400..800&family=Unbounded:wght@300..900&family=JetBrains+Mono:wght@400..800&display=swap" rel="stylesheet">
</svelte:head>

<main class="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
  <!-- Header Bar -->
  <header class="p-4 border-b border-neutral-800 flex justify-between items-center">
    <h1 class="font-mono font-black text-sm tracking-wider uppercase">
      Kinetic Typography Poster // SvelteKit + CSS
    </h1>
    <div class="flex gap-2">
      <button 
        on:click={freezeAnimation} 
        class="px-3 py-1.5 border border-neutral-700 bg-neutral-900 font-mono text-xs font-bold"
      >
        {$posterConfig.isFrozen ? 'Resume' : 'Freeze'}
      </button>
      <button 
        on:click={exportPoster} 
        class="px-3 py-1.5 bg-emerald-400 text-neutral-950 font-mono text-xs font-black"
      >
        Download PNG
      </button>
    </div>
  </header>

  <!-- Content Workspace -->
  <div class="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 items-center">
    <div class="lg:col-span-7 flex justify-center items-center">
      <div bind:this={posterElement} style={cssStyleString} class="w-full">
        <KineticPoster config={$posterConfig} />
      </div>
    </div>
    <div class="lg:col-span-5 h-[650px]">
      <ControlDeck />
    </div>
  </div>
</main>`,
    },
    poster: {
      name: 'src/lib/components/KineticPoster.svelte',
      lang: 'svelte',
      code: `<script lang="ts">
  export let config: any;

  // Svelte reactive marquee duplication
  $: mainItems = Array(12).fill(config.mainHeadline || 'KINETIC REALITY');
  $: subItems = Array(16).fill(config.subHeadline || 'DYNAMIC RAW CSS ENGINE');
  $: tickerItems = Array(8).fill(config.tickerText || 'KINETIC POSTER GENERATOR ★ PURE CSS @KEYFRAMES ★');
</script>

<div 
  class="relative w-full aspect-[4/5] max-w-[540px] mx-auto border-4 overflow-hidden flex flex-col justify-between select-none"
  style="background-color: var(--poster-bg); color: var(--poster-fg); border-color: var(--poster-border);"
>
  <!-- CRT Scanlines -->
  {#if config.showScanlines}
    <div class="scanline-layer"></div>
  {/if}

  <!-- Header Strip -->
  <div class="px-3 py-2 border-b border-current flex justify-between text-xs font-mono font-bold uppercase">
    <span>{config.editionCode || 'KP-2026'} // {config.locationStamp || 'BERLIN'}</span>
    <span>{config.dateStamp || '2026.08.25'}</span>
  </div>

  <!-- Kinetic Center Ribbons -->
  <div class="flex-1 flex flex-col justify-around py-4 overflow-hidden">
    <!-- Row 1: Left scrolling -->
    <div class="overflow-hidden whitespace-nowrap">
      <div class="marquee-left">
        {#each mainItems as item}
          <span class="inline-block px-4 text-5xl font-black font-unbounded interactive-text">
            {item} <span class="mx-3 opacity-40">✦</span>
          </span>
        {/each}
      </div>
    </div>

    <!-- Row 2: Inverted Right scrolling -->
    <div 
      class="overflow-hidden whitespace-nowrap py-2 border-y-2 border-current"
      style="background-color: var(--poster-fg); color: var(--poster-bg);"
    >
      <div class="marquee-right">
        {#each subItems as item}
          <span class="inline-block px-3 text-3xl font-black uppercase interactive-text">
            {item} <span class="mx-2">///</span>
          </span>
        {/each}
      </div>
    </div>

    <!-- Row 3: Accent Outline with Rhythmic Scale Pulse -->
    <div class="overflow-hidden whitespace-nowrap">
      <div class="marquee-left pulse-rhythm">
        {#each mainItems as item}
          <span class="inline-block px-4 text-6xl font-black text-stroke-accent interactive-text">
            {item} <span class="mx-3">★</span>
          </span>
        {/each}
      </div>
    </div>
  </div>

  <!-- Footer Ticker -->
  <div class="border-t-2 border-current">
    <div class="overflow-hidden whitespace-nowrap py-1 bg-current text-neutral-950 font-mono font-bold text-xs">
      <div class="marquee-left">
        {#each tickerItems as item}
          <span class="inline-block px-3">{item}</span>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  /* Scoped Raw CSS Animations */
  @keyframes scrollLeft {
    0% { transform: translate3d(0, 0, 0); }
    100% { transform: translate3d(-50%, 0, 0); }
  }

  @keyframes scrollRight {
    0% { transform: translate3d(-50%, 0, 0); }
    100% { transform: translate3d(0, 0, 0); }
  }

  @keyframes pulseScale {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(var(--scale-intensity, 1.15)); }
  }

  .marquee-left {
    display: flex;
    width: max-content;
    animation: scrollLeft var(--marquee-speed, 10s) linear infinite;
    animation-play-state: var(--play-state, running);
  }

  .marquee-right {
    display: flex;
    width: max-content;
    animation: scrollRight var(--marquee-speed, 10s) linear infinite;
    animation-play-state: var(--play-state, running);
  }

  .pulse-rhythm {
    animation: pulseScale var(--scale-rhythm, 2.4s) ease-in-out infinite;
    animation-play-state: var(--play-state, running);
  }

  .interactive-text {
    transition: transform 0.2s ease, letter-spacing 0.2s ease;
  }
  .interactive-text:hover {
    transform: scale(1.08) skewX(-6deg);
    letter-spacing: 0.1em;
  }

  .text-stroke-accent {
    color: transparent;
    -webkit-text-stroke: 2px var(--poster-accent1);
  }

  .scanline-layer {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%);
    background-size: 100% 4px;
    z-index: 20;
  }
</style>`,
    },
    store: {
      name: 'src/lib/stores/poster.ts',
      lang: 'typescript',
      code: `import { writable } from 'svelte/store';

export const ANIMATION_PRESETS = [
  { id: 'slow-scroll', name: 'Slow Scroll', speed: 18, rhythm: 4.2, intensity: 1.06, skew: 0, timing: 'linear' },
  { id: 'fast-warp', name: 'Fast Warp', speed: 4.5, rhythm: 1.6, intensity: 1.32, skew: -14, timing: 'cubic-punch' },
  { id: 'rhythmic-pulse', name: 'Rhythmic Pulse', speed: 8, rhythm: 1.8, intensity: 1.28, skew: 6, timing: 'cubic-punch' },
  { id: 'strobe-glitch', name: 'Strobe Glitch', speed: 5, rhythm: 0.9, intensity: 1.22, skew: -8, timing: 'steps-glitch' },
  { id: 'hypnotic-float', name: 'Hypnotic Float', speed: 12, rhythm: 3.0, intensity: 1.18, skew: 10, timing: 'ease-in-out' },
];

export const posterConfig = writable({
  mainHeadline: 'KINETIC // REALITY',
  subHeadline: 'DYNAMIC BRUTALIST EXPERIMENT',
  tickerText: 'FREQUENCY MODULATION ★ 140 BPM ★ RAW CSS ENGINE ★',
  locationStamp: 'BERLIN / KREUZBERG',
  dateStamp: '2026.08.25',
  editionCode: 'SYS-KP-001',
  animationPreset: 'rhythmic-pulse',
  timingFunction: 'cubic-punch',
  marqueeSpeed: 8,
  scaleRhythm: 1.8,
  scaleIntensity: 1.28,
  skewAngle: 6,
  isFrozen: false,
  showScanlines: true,
  fontFamily: 'Unbounded',
  fontWeight: 900,
  palette: {
    name: 'Toxic Neon',
    background: '#0a0a0c',
    foreground: '#39ff14',
    accent1: '#ff007f',
    accent2: '#ffff00',
    border: '#39ff14',
  }
});

export function applyAnimationPreset(presetId: string) {
  const preset = ANIMATION_PRESETS.find(p => p.id === presetId);
  if (preset) {
    posterConfig.update(c => ({
      ...c,
      animationPreset: preset.id,
      marqueeSpeed: preset.speed,
      scaleRhythm: preset.rhythm,
      scaleIntensity: preset.intensity,
      skewAngle: preset.skew,
      timingFunction: preset.timing,
    }));
  }
}

export function freezeAnimation() {
  posterConfig.update(c => ({ ...c, isFrozen: !c.isFrozen }));
}

export function randomizeConfig() {
  const speeds = [4, 6, 8, 10, 14];
  const rhythms = [1.2, 1.8, 2.4, 3.2];
  posterConfig.update(c => ({
    ...c,
    marqueeSpeed: speeds[Math.floor(Math.random() * speeds.length)],
    scaleRhythm: rhythms[Math.floor(Math.random() * rhythms.length)],
  }));
}`,
    },
    config: {
      name: 'svelte.config.js & package.json',
      lang: 'javascript',
      code: `// svelte.config.js
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      runtime: 'nodejs20.x'
    })
  }
};

export default config;

// package.json dependencies:
// npm i -D @sveltejs/adapter-vercel @sveltejs/kit svelte html2canvas lucide-svelte tailwindcss`,
    },
    deploy: {
      name: 'Vercel Deployment & Env Guide',
      lang: 'markdown',
      code: `# Deploying SvelteKit Kinetic Poster to Vercel

### Step 1: Install Vercel Adapter in SvelteKit
\`\`\`bash
npm i -D @sveltejs/adapter-vercel
\`\`\`

### Step 2: Configure svelte.config.js
Ensure your \`svelte.config.js\` imports \`@sveltejs/adapter-vercel\`:
\`\`\`javascript
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ runtime: 'nodejs20.x' })
  }
};
export default config;
\`\`\`

### Step 3: Deploy via Vercel CLI or GitHub
1. Push your code to GitHub:
   \`\`\`bash
   git init && git add . && git commit -m "Initial Kinetic Typography Poster"
   git remote add origin https://github.com/your-username/kinetic-poster.git
   git push -u origin main
   \`\`\`

2. Go to https://vercel.com/new, select the repository, and click **Deploy**.
   Vercel will automatically detect the SvelteKit framework preset.

### Step 4: Environment Variables (Optional)
If connecting analytics or API secrets, configure them in the Vercel Dashboard:
- Go to Project Settings -> **Environment Variables**
- Add: \`PUBLIC_APP_URL\`, \`PUBLIC_EDITION_SECRET\`, etc.
- Prefix client-side variables with \`PUBLIC_\` in SvelteKit.`,
    },
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(files[activeFile].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="bg-neutral-900 border-2 border-neutral-700 w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-neutral-100">
        {/* Modal Header */}
        <div className="px-4 py-3 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-emerald-400" />
            <span className="font-mono font-black text-xs sm:text-sm tracking-wider uppercase">
              SvelteKit Project Architecture & Vercel Deploy Guide
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* File Tabs */}
        <div className="flex border-b border-neutral-800 bg-neutral-950 overflow-x-auto text-[11px] font-mono font-bold custom-scrollbar">
          {[
            { id: 'page', label: '+page.svelte' },
            { id: 'poster', label: 'KineticPoster.svelte' },
            { id: 'store', label: 'poster.ts (Store)' },
            { id: 'config', label: 'svelte.config.js' },
            { id: 'deploy', label: 'Vercel Deployment' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFile(tab.id as any)}
              className={`px-3.5 py-2.5 whitespace-nowrap border-r border-neutral-800 transition-colors cursor-pointer ${
                activeFile === tab.id
                  ? 'bg-neutral-900 text-emerald-400 border-b-2 border-b-emerald-400'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Code View Area */}
        <div className="flex-1 p-4 bg-neutral-950 overflow-y-auto custom-scrollbar font-mono text-xs text-neutral-300 relative">
          <div className="flex justify-between items-center pb-2 mb-2 border-b border-neutral-800">
            <span className="text-emerald-400 text-[11px] font-bold">
              {files[activeFile].name}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-mono border border-neutral-700 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="whitespace-pre-wrap select-text leading-relaxed">
            {files[activeFile].code}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-[11px] font-mono text-neutral-400">
          <span>Pure CSS @keyframes + Reactive Dynamic CSS Variables</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white font-bold cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
