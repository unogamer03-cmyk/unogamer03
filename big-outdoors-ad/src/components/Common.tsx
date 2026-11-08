import React from 'react';
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {C, FONT_DISPLAY, GOLD_GRADIENT} from '../theme';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Film grain + vignette + letterbox shimmer for a consistent cinematic grade.
export const CinematicGrade: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 85%, rgba(0,0,0,0.85) 100%)',
        }}
      />
      <svg width="100%" height="100%" style={{position: 'absolute', opacity: 0.07, mixBlendMode: 'overlay'}}>
        <filter id={`grain-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed % 50} />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

// Kinetic voice-over caption: gold-edged headline that slides up word by word.
export const VOCaption: React.FC<{
  text: string;
  start?: number;
  end: number;
  highlight?: string[];
  bottom?: number;
}> = ({text, start = 4, end, highlight = [], bottom = 56}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(' ');
  const out = interpolate(frame, [end - 8, end], [1, 0], clamp);
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: bottom, opacity: out}}>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 230, background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.82))'}} />
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '0 22px',
          maxWidth: 1800,
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          fontSize: 64,
          lineHeight: 1.1,
          textTransform: 'uppercase',
          letterSpacing: 2,
        }}
      >
        {words.map((w, i) => {
          const s = spring({frame: frame - start - i * 3, fps, config: {damping: 16, stiffness: 160}});
          const clean = w.replace(/[^A-Za-z]/g, '');
          const isGold = highlight.includes(clean);
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                transform: `translateY(${(1 - s) * 50}px)`,
                opacity: s,
                color: isGold ? undefined : C.white,
                backgroundImage: isGold ? GOLD_GRADIENT : undefined,
                WebkitBackgroundClip: isGold ? 'text' : undefined,
                backgroundClip: isGold ? 'text' : undefined,
                WebkitTextFillColor: isGold ? 'transparent' : undefined,
                textShadow: isGold ? undefined : '0 4px 24px rgba(0,0,0,0.9)',
                filter: isGold ? 'drop-shadow(0 4px 18px rgba(0,0,0,0.9))' : undefined,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Gold light-sweep transition overlay centred on `at` (frame within parent).
export const GoldFlash: React.FC<{at: number; dur?: number}> = ({at, dur = 14}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at - dur / 2, at + dur / 2], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  if (p <= 0 || p >= 1) return null;
  const x = interpolate(p, [0, 1], [-60, 160]);
  const glow = Math.sin(p * Math.PI);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(105deg, transparent ${x - 30}%, rgba(246,226,122,0.0) ${x - 18}%, rgba(255,240,180,0.95) ${x}%, rgba(212,175,55,0.0) ${x + 18}%, transparent ${x + 30}%)`,
          mixBlendMode: 'screen',
        }}
      />
      <AbsoluteFill style={{background: '#fff3c4', opacity: glow * 0.35, mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};

// Floating gold dust particles for atmosphere.
export const GoldDust: React.FC<{count?: number; seed?: string; opacity?: number}> = ({
  count = 40,
  seed = 'dust',
  opacity = 0.7,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity}}>
      {Array.from({length: count}).map((_, i) => {
        const x = random(`${seed}x${i}`) * 1920;
        const y0 = random(`${seed}y${i}`) * 1080;
        const sp = 0.3 + random(`${seed}s${i}`) * 1.2;
        const r = 1 + random(`${seed}r${i}`) * 3;
        const y = (((y0 - frame * sp) % 1080) + 1080) % 1080;
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(frame / 12 + i));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + Math.sin(frame / 30 + i) * 10,
              top: y,
              width: r * 2,
              height: r * 2,
              borderRadius: '50%',
              background: C.goldLight,
              opacity: tw * 0.8,
              boxShadow: `0 0 ${r * 4}px ${C.gold}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Horizontal speed streaks.
export const SpeedLines: React.FC<{intensity: number; seed?: string; color?: string}> = ({
  intensity,
  seed = 'speed',
  color = '#fff',
}) => {
  const frame = useCurrentFrame();
  if (intensity <= 0) return null;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: intensity}}>
      {Array.from({length: 26}).map((_, i) => {
        const y = random(`${seed}y${i}`) * 1080;
        const len = 200 + random(`${seed}l${i}`) * 600;
        const sp = 70 + random(`${seed}s${i}`) * 90;
        const x = 2200 - (((frame * sp + random(`${seed}o${i}`) * 4000) % 4200));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: len,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
              opacity: 0.25 + random(`${seed}a${i}`) * 0.4,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
