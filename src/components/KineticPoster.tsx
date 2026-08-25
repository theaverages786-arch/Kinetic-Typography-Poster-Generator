import React, { useMemo } from 'react';
import { PosterConfig } from '../types';
import { COLOR_PALETTES } from '../constants/palettes';

interface KineticPosterProps {
  config: PosterConfig;
  posterRef: React.RefObject<HTMLDivElement | null>;
}

export const KineticPoster: React.FC<KineticPosterProps> = ({ config, posterRef }) => {
  // Resolve current active palette
  const activePalette = useMemo(() => {
    if (config.paletteId === 'custom') {
      return {
        id: 'custom',
        name: 'Custom',
        ...config.customPalette,
        tag: 'CUSTOM',
      };
    }
    return COLOR_PALETTES.find((p) => p.id === config.paletteId) || COLOR_PALETTES[0];
  }, [config.paletteId, config.customPalette]);

  // CSS variables object for instant reactivity without re-renders
  const cssVariables = useMemo(() => {
    let timingFn = 'linear';
    if (config.timingFunction === 'ease-in-out') timingFn = 'ease-in-out';
    else if (config.timingFunction === 'cubic-punch') timingFn = 'cubic-bezier(0.25, 1, 0.5, 1)';
    else if (config.timingFunction === 'steps-glitch') timingFn = 'steps(8, jump-end)';

    return {
      '--poster-bg': activePalette.background,
      '--poster-fg': activePalette.foreground,
      '--poster-accent1': activePalette.accent1,
      '--poster-accent2': activePalette.accent2,
      '--poster-border': activePalette.border,
      '--marquee-speed': `${config.marqueeSpeed}s`,
      '--marquee-speed-fast': `${Math.max(1.5, config.marqueeSpeed * 0.6)}s`,
      '--marquee-speed-slow': `${config.marqueeSpeed * 1.5}s`,
      '--marquee-timing-fn': timingFn,
      '--scale-rhythm': `${config.bpmSync ? 60 / config.bpm : config.scaleRhythm}s`,
      '--scale-intensity': config.scaleIntensity,
      '--skew-angle': `${config.skewAngle}deg`,
      '--letter-spacing': `${config.letterSpacing}em`,
      '--stroke-width': `${config.strokeWidth}px`,
      '--play-state': config.isFrozen ? 'paused' : 'running',
    } as React.CSSProperties;
  }, [activePalette, config]);

  // Aspect ratio container dimensions
  const getAspectRatioClasses = () => {
    switch (config.aspectRatio) {
      case '1:1':
        return 'aspect-square max-w-[620px]';
      case '4:5':
        return 'aspect-[4/5] max-w-[540px]';
      case '9:16':
        return 'aspect-[9/16] max-w-[420px]';
      case '3:4':
        return 'aspect-[3/4] max-w-[520px]';
      case '16:9':
        return 'aspect-[16/9] max-w-[780px]';
      default:
        return 'aspect-[4/5] max-w-[540px]';
    }
  };

  const getFontClass = (font: string) => {
    switch (font) {
      case 'Syne':
        return 'font-syne';
      case 'Unbounded':
        return 'font-unbounded';
      case 'Anton':
        return 'font-anton';
      case 'Bebas Neue':
        return 'font-bebas';
      case 'JetBrains Mono':
        return 'font-mono-jb';
      case 'Rubik Glitch':
        return 'font-rubik-glitch';
      case 'Major Mono Display':
        return 'font-major-mono';
      case 'Work Sans':
        return 'font-work-sans';
      default:
        return 'font-unbounded';
    }
  };

  // Repeated text arrays for seamless endless marquee loops
  const marqueeItems = useMemo(() => {
    const text = config.mainHeadline.trim() || 'KINETIC TYPOGRAPHY';
    return Array(12).fill(text);
  }, [config.mainHeadline]);

  const subMarqueeItems = useMemo(() => {
    const text = config.subHeadline.trim() || 'RAW CSS ANIMATION ENGINE';
    return Array(16).fill(text);
  }, [config.subHeadline]);

  const tickerItems = useMemo(() => {
    const text = config.tickerText.trim() || 'KINETIC POSTER GENERATOR ★ PURE CSS @KEYFRAMES ★';
    return Array(8).fill(text);
  }, [config.tickerText]);

  // Dynamic style for main typography
  const textStyle: React.CSSProperties = {
    fontWeight: config.fontWeight,
    letterSpacing: `${config.letterSpacing}em`,
    textTransform: config.uppercase ? 'uppercase' : 'none',
  };

  return (
    <div className="w-full flex items-center justify-center p-2 sm:p-4 md:p-6 select-none">
      {/* Poster Canvas Root Container */}
      <div
        id="kinetic-poster-canvas"
        ref={posterRef}
        style={{
          ...cssVariables,
          backgroundColor: 'var(--poster-bg)',
          color: 'var(--poster-fg)',
          borderColor: 'var(--poster-border)',
        }}
        className={`relative w-full ${getAspectRatioClasses()} mx-auto border-2 md:border-4 overflow-hidden shadow-2xl transition-all duration-300 flex flex-col justify-between ${
          config.chromaticAberration ? 'animate-rgb-glitch' : ''
        }`}
      >
        {/* SVG Filter for brutalist wave distortion (optional) */}
        {config.waveDistortion && (
          <svg className="hidden">
            <defs>
              <filter id="brutalist-warp" x="0%" y="0%" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.015 0.03" numOctaves="1" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>
          </svg>
        )}

        {/* 1. Brutalist Grid Background Guide */}
        {config.showGridLines && (
          <div
            className={`absolute inset-0 pointer-events-none z-0 ${
              activePalette.id === 'acid' ? 'brutalist-grid-pattern-dark' : 'brutalist-grid-pattern'
            }`}
          />
        )}

        {/* 2. CRT Scanline Layer */}
        {config.showScanlines && (
          <div className="absolute inset-0 scanline-overlay pointer-events-none z-20 opacity-70" />
        )}

        {/* 3. Noise Texture Layer */}
        {config.showGrain && (
          <div className="absolute inset-0 noise-texture pointer-events-none z-20" />
        )}

        {/* 4. Brutalist Perimeter Micro-Metadata (Header Strip) */}
        <div className="relative z-30 flex items-center justify-between px-3 py-2 border-b text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase border-current opacity-90 bg-opacity-20 backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: 'var(--poster-fg)' }} />
            <span>{config.editionCode || 'KP-2026'}</span>
            <span className="hidden sm:inline opacity-60">|</span>
            <span className="hidden sm:inline opacity-80">{config.locationStamp || 'SYS // CORE'}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono tracking-tighter opacity-80">{config.dateStamp || '2026.08.25'}</span>
            <div className="px-1.5 py-0.5 text-[9px] border border-current font-black">
              {config.bpmSync ? `${config.bpm} BPM` : '60 FPS CSS'}
            </div>
          </div>
        </div>

        {/* 5. Center Dynamic Layout Viewport */}
        <div className="relative z-10 flex-1 flex flex-col justify-center overflow-hidden py-2">
          {/* Layout Variant 1: Multi-Ribbon (Stacked Alternating Marquees) */}
          {config.layout === 'multi-ribbon' && (
            <div
              className={`w-full flex flex-col justify-around h-full gap-2 sm:gap-4 ${
                config.skewAnimation ? 'animate-kinetic-skew' : ''
              }`}
              style={{ transform: `skewX(${config.skewAngle}deg)` }}
            >
              {/* Row 1: Left scrolling primary text */}
              <div className="overflow-hidden whitespace-nowrap kinetic-row-hover py-1">
                <div className="animate-marquee-left flex items-center">
                  {marqueeItems.map((item, idx) => (
                    <span
                      key={`r1-${idx}`}
                      style={textStyle}
                      className={`inline-block px-3 sm:px-6 text-3xl sm:text-5xl md:text-6xl font-black ${getFontClass(
                        config.fontFamily
                      )} ${config.outlineMode ? 'text-outline-mode' : ''} kinetic-interactive-text`}
                    >
                      {item}
                      <span className="mx-2 sm:mx-4 opacity-40 font-mono">✦</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Row 2: Inverted Right scrolling secondary text with punch scale */}
              <div
                className="overflow-hidden whitespace-nowrap py-1.5 sm:py-2 border-y-2 border-current shadow-inner font-black"
                style={{ backgroundColor: 'var(--poster-fg)', color: 'var(--poster-bg)' }}
              >
                <div className="animate-marquee-right flex items-center">
                  {subMarqueeItems.map((item, idx) => (
                    <span
                      key={`r2-${idx}`}
                      style={{ ...textStyle, letterSpacing: '0.05em' }}
                      className={`inline-block px-2 sm:px-4 text-xl sm:text-3xl md:text-4xl ${getFontClass(
                        config.fontFamily
                      )} uppercase kinetic-interactive-text`}
                    >
                      {item}
                      <span className="mx-2 sm:mx-4 font-mono font-light">///</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Row 3: Accent Outline Left scrolling with Rhythmic Scale Pulse */}
              <div className="overflow-hidden whitespace-nowrap kinetic-row-hover py-1">
                <div
                  className="animate-marquee-left flex items-center animate-kinetic-scale"
                  style={{ animationDuration: 'var(--marquee-speed-slow)' }}
                >
                  {marqueeItems.map((item, idx) => (
                    <span
                      key={`r3-${idx}`}
                      style={textStyle}
                      className={`inline-block px-3 sm:px-6 text-4xl sm:text-6xl md:text-7xl font-black ${getFontClass(
                        config.fontFamily
                      )} text-outline-accent1 kinetic-interactive-text`}
                    >
                      {item}
                      <span className="mx-2 sm:mx-4 text-outline-accent2 font-mono">★</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Row 4: Right scrolling micro-ticker */}
              <div className="overflow-hidden whitespace-nowrap py-1 opacity-85">
                <div
                  className="animate-marquee-right flex items-center"
                  style={{ animationDuration: 'var(--marquee-speed-fast)' }}
                >
                  {subMarqueeItems.map((item, idx) => (
                    <span
                      key={`r4-${idx}`}
                      style={textStyle}
                      className={`inline-block px-2 sm:px-4 text-base sm:text-2xl font-bold font-mono tracking-widest ${
                        config.outlineMode ? 'text-outline-mode' : ''
                      }`}
                    >
                      {item}
                      <span className="mx-2 font-mono" style={{ color: 'var(--poster-accent2)' }}>
                        ■
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Layout Variant 2: Diagonal Slash (Angled 45deg/Skew Marquees) */}
          {config.layout === 'diagonal-slash' && (
            <div className="relative w-full h-full flex flex-col justify-center items-center scale-110 sm:scale-125">
              <div
                className={`w-[140%] flex flex-col gap-3 sm:gap-6 ${
                  config.skewAnimation ? 'animate-kinetic-skew' : ''
                }`}
                style={{ transform: `rotate(-16deg) skewX(${config.skewAngle}deg)` }}
              >
                {[0, 1, 2, 3, 4].map((rowIndex) => {
                  const isEven = rowIndex % 2 === 0;
                  const isCenter = rowIndex === 2;
                  return (
                    <div
                      key={`diag-${rowIndex}`}
                      className={`overflow-hidden whitespace-nowrap py-1 ${
                        isCenter
                          ? 'border-y-2 border-current shadow-lg py-2'
                          : ''
                      }`}
                      style={
                        isCenter
                          ? { backgroundColor: 'var(--poster-accent1)', color: 'var(--poster-bg)' }
                          : {}
                      }
                    >
                      <div
                        className={`${
                          isEven ? 'animate-marquee-left' : 'animate-marquee-right'
                        } flex items-center ${isCenter ? 'animate-kinetic-punch' : ''}`}
                        style={{
                          animationDuration: isCenter ? 'var(--marquee-speed-fast)' : 'var(--marquee-speed)',
                        }}
                      >
                        {marqueeItems.map((item, idx) => (
                          <span
                            key={`diag-item-${rowIndex}-${idx}`}
                            style={textStyle}
                            className={`inline-block px-3 sm:px-6 text-3xl sm:text-5xl font-black ${getFontClass(
                              config.fontFamily
                            )} ${
                              !isCenter && rowIndex % 3 === 0
                                ? 'text-outline-mode'
                                : !isCenter && rowIndex % 3 === 1
                                ? 'text-outline-accent2'
                                : ''
                            } kinetic-interactive-text`}
                          >
                            {item}
                            <span className="mx-2 sm:mx-4 font-mono opacity-60">
                              {isCenter ? '⚡' : '⟁'}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Layout Variant 3: Brutalist Center Block with Perimeter Marquees */}
          {config.layout === 'brutalist-block' && (
            <div className="w-full h-full flex flex-col justify-between px-2 sm:px-4 py-2">
              {/* Top micro marquee */}
              <div className="overflow-hidden whitespace-nowrap border-b border-current pb-1 text-xs font-mono font-bold tracking-widest">
                <div className="animate-marquee-left flex items-center">
                  {tickerItems.map((item, idx) => (
                    <span key={`tb-${idx}`} className="inline-block px-3">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Massive Center Block Typo with Kinetic Sine Scale */}
              <div className="flex-1 flex flex-col justify-center items-center text-center px-2 py-4 relative">
                {/* Background ghost typography */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 overflow-hidden">
                  <span
                    className={`text-8xl sm:text-9xl font-black ${getFontClass(config.fontFamily)} select-none`}
                  >
                    {config.mainHeadline.slice(0, 4)}
                  </span>
                </div>

                <div
                  className="animate-kinetic-scale w-full"
                  style={{ transform: `skewX(${config.skewAngle}deg)` }}
                >
                  <h1
                    style={textStyle}
                    className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none break-words ${getFontClass(
                      config.fontFamily
                    )} ${
                      config.outlineMode ? 'text-outline-mode' : ''
                    } kinetic-interactive-text cursor-default`}
                  >
                    {config.mainHeadline}
                  </h1>

                  <div className="my-2 sm:my-4 flex items-center justify-center gap-3">
                    <div className="h-[2px] w-8 sm:w-16 bg-current" />
                    <p
                      className={`text-xs sm:text-base font-bold font-mono tracking-widest uppercase opacity-90`}
                      style={{ color: 'var(--poster-accent1)' }}
                    >
                      {config.subHeadline}
                    </p>
                    <div className="h-[2px] w-8 sm:w-16 bg-current" />
                  </div>
                </div>
              </div>

              {/* Bottom micro marquee */}
              <div className="overflow-hidden whitespace-nowrap border-t border-current pt-1 text-xs font-mono font-bold tracking-widest">
                <div className="animate-marquee-right flex items-center">
                  {tickerItems.map((item, idx) => (
                    <span key={`bb-${idx}`} className="inline-block px-3">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Layout Variant 4: 3D Cylinder Roll */}
          {config.layout === 'cylinder-3d' && (
            <div className="w-full h-full flex items-center justify-center overflow-hidden [perspective:800px]">
              <div
                className={`w-full flex flex-col gap-2 sm:gap-4 animate-cylinder ${
                  config.skewAnimation ? 'animate-kinetic-skew' : ''
                }`}
                style={{ transform: `skewX(${config.skewAngle}deg)` }}
              >
                {[-2, -1, 0, 1, 2].map((lane) => {
                  const isMiddle = lane === 0;
                  const isLeft = lane % 2 === 0;
                  return (
                    <div
                      key={`cyl-${lane}`}
                      className="overflow-hidden whitespace-nowrap py-1"
                      style={{
                        transform: `rotateX(${lane * 14}deg) translateZ(${Math.cos(lane) * 30}px)`,
                        opacity: 1 - Math.abs(lane) * 0.2,
                      }}
                    >
                      <div
                        className={`${isLeft ? 'animate-marquee-left' : 'animate-marquee-right'} flex items-center`}
                        style={{
                          animationDuration: isMiddle ? 'var(--marquee-speed-fast)' : 'var(--marquee-speed)',
                        }}
                      >
                        {marqueeItems.map((item, idx) => (
                          <span
                            key={`cyl-i-${lane}-${idx}`}
                            style={textStyle}
                            className={`inline-block px-3 sm:px-5 text-3xl sm:text-5xl font-black ${getFontClass(
                              config.fontFamily
                            )} ${
                              isMiddle
                                ? 'text-outline-accent1 animate-kinetic-punch'
                                : lane % 2 !== 0
                                ? 'text-outline-mode'
                                : ''
                            } kinetic-interactive-text`}
                          >
                            {item}
                            <span className="mx-2 sm:mx-4 font-mono text-sm opacity-50">✦</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Layout Variant 5: Matrix Ticker (Dense Multi-Row Micro Grid) */}
          {config.layout === 'matrix-ticker' && (
            <div
              className={`w-full h-full flex flex-col justify-around py-1 gap-1 ${
                config.skewAnimation ? 'animate-kinetic-skew' : ''
              }`}
              style={{ transform: `skewX(${config.skewAngle}deg)` }}
            >
              {[0, 1, 2, 3, 4, 5, 6].map((rowIdx) => {
                const isOdd = rowIdx % 2 !== 0;
                const isHero = rowIdx === 3;
                return (
                  <div
                    key={`mat-${rowIdx}`}
                    className={`overflow-hidden whitespace-nowrap ${
                      isHero
                        ? 'py-2 border-y-2 border-current shadow-lg'
                        : 'py-0.5'
                    }`}
                    style={
                      isHero
                        ? { backgroundColor: 'var(--poster-fg)', color: 'var(--poster-bg)' }
                        : {}
                    }
                  >
                    <div
                      className={`${
                        isOdd ? 'animate-marquee-right' : 'animate-marquee-left'
                      } flex items-center`}
                      style={{
                        animationDuration: isHero
                          ? 'var(--marquee-speed-fast)'
                          : `${config.marqueeSpeed * (0.8 + rowIdx * 0.2)}s`,
                      }}
                    >
                      {(isHero ? marqueeItems : subMarqueeItems).map((textItem, idx) => (
                        <span
                          key={`mat-item-${rowIdx}-${idx}`}
                          style={textStyle}
                          className={`inline-block px-2 sm:px-4 ${
                            isHero
                              ? `text-2xl sm:text-4xl font-black ${getFontClass(config.fontFamily)}`
                              : `text-xs sm:text-sm font-mono font-bold tracking-widest ${
                                  rowIdx % 2 === 0 ? 'text-outline-mode' : ''
                                }`
                          } kinetic-interactive-text`}
                        >
                          {textItem}
                          <span className="mx-2 opacity-50 font-mono">
                            {isHero ? '◆' : '::'}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Layout Variant 6: Monolith Split (Inverted Dual Color Blocks) */}
          {config.layout === 'monolith-split' && (
            <div className="w-full h-full flex flex-col justify-center">
              {/* Top Half: Normal Palette */}
              <div className="flex-1 flex flex-col justify-center overflow-hidden border-b-2 border-current py-2">
                <div className="animate-marquee-left flex items-center">
                  {marqueeItems.map((item, idx) => (
                    <span
                      key={`top-split-${idx}`}
                      style={textStyle}
                      className={`inline-block px-4 text-4xl sm:text-6xl font-black ${getFontClass(
                        config.fontFamily
                      )} ${config.outlineMode ? 'text-outline-mode' : ''} kinetic-interactive-text`}
                    >
                      {item}
                      <span className="mx-3 opacity-40 font-mono">■</span>
                    </span>
                  ))}
                </div>
                <div className="animate-marquee-right flex items-center mt-2 opacity-80">
                  {subMarqueeItems.map((item, idx) => (
                    <span
                      key={`top-sub-${idx}`}
                      className="inline-block px-3 text-xs sm:text-sm font-mono font-bold tracking-widest uppercase"
                    >
                      {item} <span className="mx-2 font-light">/ /</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Half: Fully Inverted Block */}
              <div
                className="flex-1 flex flex-col justify-center overflow-hidden py-2"
                style={{ backgroundColor: 'var(--poster-fg)', color: 'var(--poster-bg)' }}
              >
                <div className="animate-marquee-right flex items-center">
                  {marqueeItems.map((item, idx) => (
                    <span
                      key={`bot-split-${idx}`}
                      style={textStyle}
                      className={`inline-block px-4 text-4xl sm:text-6xl font-black ${getFontClass(
                        config.fontFamily
                      )} kinetic-interactive-text`}
                    >
                      {item}
                      <span className="mx-3 opacity-40 font-mono">▲</span>
                    </span>
                  ))}
                </div>
                <div className="animate-marquee-left flex items-center mt-2 opacity-90">
                  {subMarqueeItems.map((item, idx) => (
                    <span
                      key={`bot-sub-${idx}`}
                      className="inline-block px-3 text-xs sm:text-sm font-mono font-bold tracking-widest uppercase"
                    >
                      {item} <span className="mx-2">✦</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 6. Brutalist Footer Strip & Metadata Ticker */}
        <div className="relative z-30 flex flex-col border-t-2 border-current bg-opacity-30 backdrop-blur-xs">
          {/* Continuous Running Bottom Ticker */}
          <div className="overflow-hidden whitespace-nowrap py-1 bg-current text-current bg-opacity-10 border-b border-current text-[11px] sm:text-xs font-mono font-black uppercase">
            <div className="animate-marquee-left flex items-center">
              {tickerItems.map((item, idx) => (
                <span key={`ticker-${idx}`} className="inline-block px-3">
                  {item} <span className="mx-2 opacity-50">★</span>
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Bar Details: Barcode, Coordinates, Spec Stamp */}
          <div className="flex items-center justify-between px-3 py-2 text-[9px] sm:text-[10px] font-mono uppercase tracking-widest">
            <div className="flex items-center gap-3">
              {config.showBarcode && (
                <div className="flex items-center gap-0.5 h-5 opacity-85">
                  {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2].map((w, i) => (
                    <div
                      key={`bar-${i}`}
                      className="h-full bg-current"
                      style={{ width: `${w}px` }}
                    />
                  ))}
                </div>
              )}
              <div className="hidden sm:flex flex-col">
                <span className="font-bold">GRID // CSS ENGINE</span>
                <span className="opacity-60">LAT 52.5200° N / LON 13.4050° E</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-right">
              <div className="flex flex-col">
                <span className="font-bold">KINETIC POSTER</span>
                <span className="opacity-60">{config.fontFamily} / {config.fontWeight}W</span>
              </div>
              <div className="w-5 h-5 border border-current flex items-center justify-center font-bold text-[8px]">
                KP
              </div>
            </div>
          </div>
        </div>

        {/* 7. Brutalist Crosshairs in 4 Corners */}
        {config.showCrosshairs && (
          <>
            <div className="absolute top-8 left-2 text-[10px] font-mono pointer-events-none opacity-40 font-black">
              +
            </div>
            <div className="absolute top-8 right-2 text-[10px] font-mono pointer-events-none opacity-40 font-black">
              +
            </div>
            <div className="absolute bottom-16 left-2 text-[10px] font-mono pointer-events-none opacity-40 font-black">
              +
            </div>
            <div className="absolute bottom-16 right-2 text-[10px] font-mono pointer-events-none opacity-40 font-black">
              +
            </div>
          </>
        )}
      </div>
    </div>
  );
};
