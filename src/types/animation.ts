export type AnimationPresetId = 
  | 'slow-scroll' 
  | 'fast-warp' 
  | 'rhythmic-pulse' 
  | 'strobe-glitch' 
  | 'hypnotic-float'
  | 'custom';

export type TimingFunction = 'linear' | 'ease-in-out' | 'cubic-punch' | 'steps-glitch';

export interface AnimationPreset {
  id: AnimationPresetId;
  name: string;
  tag: string;
  description: string;
  iconName: string;
  settings: {
    marqueeSpeed: number;        // Marquee duration (seconds)
    scaleRhythm: number;         // Rhythm cycle (seconds)
    scaleIntensity: number;      // Amplitude factor (e.g. 1.05 - 1.4)
    skewAngle: number;           // Skew degrees
    skewAnimation: boolean;      // Continuous oscillation
    waveDistortion: boolean;     // SVG warp filter
    chromaticAberration: boolean;// RGB color split
    timingFunction: TimingFunction;
    bpmSync?: boolean;
    bpm?: number;
  };
}
