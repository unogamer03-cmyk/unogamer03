import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {BRAND, C, FONT_BODY, FONT_DISPLAY, GOLD_GRADIENT} from '../theme';
import {clamp, GoldFlash, GoldDust} from '../components/Common';
import {Truck} from '../components/Truck';

// 11–15s: truck arrives in Texas → premium black & gold brand reveal.

const ARRIVE_END = 44;

const Arrival: React.FC<{frame: number}> = ({frame}) => {
  const {fps} = useVideoConfig();
  const x = interpolate(frame, [0, 26], [-1500, 260], {...clamp, easing: Easing.out(Easing.cubic)});
  const wheelRot = ((x + 1500) / 30) * (180 / Math.PI);
  const brake = interpolate(frame, [16, 26, 40], [0, 1, 0.6], clamp);
  const stamp = spring({frame: frame - 24, fps, config: {damping: 11, stiffness: 180}});
  const settle = frame > 24 ? Math.sin((frame - 24) * 0.9) * Math.max(0, 6 - (frame - 24) * 0.5) : 0;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg,#07070a 0%,#1e1a12 50%,#4b3612 70%,#0c0b09 71%,#050505 100%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 70%, rgba(246,226,122,0.3), transparent 50%)'}} />
      {/* distribution center */}
      <div style={{position: 'absolute', left: 1180, top: 470, width: 760, height: 300, background: 'linear-gradient(180deg,#22222a,#121216)', borderTop: `6px solid ${C.gold}`}}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{position: 'absolute', left: 40 + i * 175, top: 120, width: 140, height: 180, background: i === 1 ? 'rgba(255,214,120,0.55)' : '#0b0b0d', border: '3px solid #3a3a40'}} />
        ))}
        <div style={{position: 'absolute', right: 40, top: 30, fontFamily: FONT_DISPLAY, fontSize: 40, letterSpacing: 6, color: C.gold}}>DALLAS, TX · RECEIVING</div>
      </div>
      <div style={{position: 'absolute', left: 0, top: 766, width: 1920, height: 320, background: 'linear-gradient(180deg,#151515,#050505)'}} />
      <div style={{position: 'absolute', left: x, top: 766 - 372 * (1300 / 1520) + 60 + settle * 0.2}}>
        <Truck width={1300} wheelRotation={wheelRot} brake={brake} idPrefix="s4" />
      </div>
      {/* DELIVERED stamp */}
      <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', paddingTop: 140}}>
        <div
          style={{
            transform: `scale(${interpolate(stamp, [0, 1], [2.4, 1])}) rotate(-4deg)`,
            opacity: stamp,
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            padding: '18px 44px',
            border: `6px solid ${C.gold}`,
            borderRadius: 14,
            background: 'rgba(0,0,0,0.7)',
            boxShadow: `0 0 60px rgba(212,175,55,0.5)`,
          }}
        >
          <svg width={74} height={74} viewBox="0 0 74 74">
            <circle cx={37} cy={37} r={34} fill={C.gold} />
            <path d="M20 38 L32 50 L55 25" stroke="#000" strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 96, letterSpacing: 10, backgroundImage: GOLD_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
            DELIVERED
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Brand logo (beaver mascot badge) — public/logo-beaver.jpg, shown as supplied.
const LOGO_SIZE = 300;
const Emblem: React.FC<{p: number; frame: number}> = ({p, frame}) => {
  const shine = interpolate(frame, [12, 42], [-60, 160], clamp);
  return (
    <div
      style={{
        position: 'relative',
        width: LOGO_SIZE,
        height: LOGO_SIZE,
        borderRadius: '50%',
        overflow: 'hidden',
        transform: `rotate(${(1 - p) * -25}deg)`,
        boxShadow: `0 0 0 4px rgba(212,175,55,${0.9 * p}), 0 0 60px rgba(212,175,55,${0.45 * p}), 0 20px 60px rgba(0,0,0,0.8)`,
        background: '#000',
      }}
    >
      {/* crop to just inside the badge's own outer edge so no square corners show */}
      <Img
        src={staticFile('logo-beaver.jpg')}
        style={{position: 'absolute', left: -LOGO_SIZE * 0.012, top: -LOGO_SIZE * 0.012, width: LOGO_SIZE * 1.024, height: LOGO_SIZE * 1.024}}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(115deg, transparent ${shine - 14}%, rgba(255,255,255,0.45) ${shine}%, transparent ${shine + 14}%)`,
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
};

const Reveal: React.FC<{frame: number}> = ({frame}) => {
  const {fps} = useVideoConfig();
  const emb = spring({frame, fps, config: {damping: 18, stiffness: 90}});
  const name = spring({frame: frame - 8, fps, config: {damping: 20, stiffness: 110}});
  const line = interpolate(frame, [14, 30], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const contact = spring({frame: frame - 18, fps, config: {damping: 20, stiffness: 110}});
  const tag = spring({frame: frame - 30, fps, config: {damping: 16, stiffness: 120}});
  const sweep = interpolate(frame, [10, 40], [-30, 130], clamp);
  const push = interpolate(frame, [0, 76], [1.04, 1.0], {...clamp, easing: Easing.out(Easing.quad)});

  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 42%, #1f1a0d 0%, #0a0907 45%, #000 80%)'}}>
      <GoldDust count={50} seed="rev" opacity={0.6} />
      {/* floor reflection glow */}
      <div style={{position: 'absolute', left: 260, right: 260, bottom: 0, height: 260, background: 'radial-gradient(ellipse at 50% 100%, rgba(212,175,55,0.22), transparent 70%)'}} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', transform: `scale(${push})`}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{transform: `scale(${0.6 + emb * 0.4})`, opacity: emb, marginBottom: 22}}>
            <Emblem p={emb} frame={frame} />
          </div>

          {/* company name — exact */}
          <div
            style={{
              position: 'relative',
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: 118,
              letterSpacing: 8,
              lineHeight: 1.05,
              backgroundImage: `linear-gradient(105deg, transparent ${sweep - 10}%, rgba(255,255,255,0.95) ${sweep}%, transparent ${sweep + 10}%), ${GOLD_GRADIENT}`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 6px 24px rgba(0,0,0,0.9))',
              opacity: name,
              transform: `translateY(${(1 - name) * 40}px)`,
              whiteSpace: 'nowrap',
            }}
          >
            {BRAND.name}
          </div>

          <div style={{width: 1180 * line, height: 3, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, margin: '26px 0 30px'}} />

          {/* contact — exact, large, high contrast */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 56,
              opacity: contact,
              transform: `translateY(${(1 - contact) * 30}px)`,
              fontFamily: FONT_BODY,
              fontWeight: 800,
              fontSize: 64,
              color: C.white,
              letterSpacing: 2,
              textShadow: '0 4px 20px rgba(0,0,0,0.9)',
            }}
          >
            <span>{BRAND.web}</span>
            <span style={{width: 12, height: 12, borderRadius: 6, background: C.gold}} />
            <span style={{color: C.goldLight}}>{BRAND.phone}</span>
          </div>

          {/* tagline */}
          <div
            style={{
              marginTop: 46,
              padding: '16px 46px',
              border: `3px solid ${C.gold}`,
              borderRadius: 6,
              background: 'rgba(0,0,0,0.55)',
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: 60,
              letterSpacing: 10,
              color: C.white,
              opacity: tag,
              transform: `scale(${0.85 + tag * 0.15})`,
              boxShadow: `0 0 50px rgba(212,175,55,${0.35 * tag})`,
            }}
          >
            {BRAND.tagline}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Scene4Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.black}}>
      {frame < ARRIVE_END + 8 && <Arrival frame={frame} />}
      {frame >= ARRIVE_END && (
        <AbsoluteFill style={{opacity: interpolate(frame, [ARRIVE_END, ARRIVE_END + 6], [0, 1], clamp)}}>
          <Reveal frame={frame - ARRIVE_END} />
        </AbsoluteFill>
      )}
      <GoldFlash at={ARRIVE_END + 2} dur={18} />
    </AbsoluteFill>
  );
};
