import React from 'react';
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {C, FONT_BODY, FONT_DISPLAY} from '../theme';
import {clamp, VOCaption} from '../components/Common';

// 0–3s: stressed businessman, shipment delayed.

const CityBokeh: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {Array.from({length: 70}).map((_, i) => {
        const x = random(`bx${i}`) * 1920;
        const y = 120 + random(`by${i}`) * 620;
        const r = 10 + random(`br${i}`) * 46;
        const warm = random(`bc${i}`) > 0.35;
        const flick = 0.55 + 0.45 * Math.sin(frame / (8 + random(`bf${i}`) * 10) + i);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x - frame * 0.6,
              top: y,
              width: r,
              height: r,
              borderRadius: '50%',
              background: warm ? 'radial-gradient(circle, #ffd27a 0%, rgba(212,175,55,0.35) 55%, transparent 72%)' : 'radial-gradient(circle, #9fc6ff 0%, rgba(80,120,200,0.3) 55%, transparent 72%)',
              opacity: 0.35 * flick,
              filter: 'blur(2px)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Businessman: React.FC<{frame: number}> = ({frame}) => {
  // subtle anxious breathing + head shake
  const breathe = Math.sin(frame / 6) * 3;
  const shake = Math.sin(frame / 2.3) * interpolate(frame, [20, 40, 60], [0, 2.5, 0], clamp);
  const glow = 0.75 + 0.25 * Math.sin(frame / 3);
  return (
    <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{position: 'absolute'}}>
      <defs>
        <radialGradient id="phoneGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#bfe0ff" stopOpacity={0.9} />
          <stop offset="1" stopColor="#4a7bd1" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="suit" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0a0a0c" />
          <stop offset="0.7" stopColor="#15161b" />
          <stop offset="1" stopColor="#2a2f3d" />
        </linearGradient>
        <linearGradient id="rim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={C.goldLight} stopOpacity={0.9} />
          <stop offset="0.08" stopColor={C.gold} stopOpacity={0} />
        </linearGradient>
        <radialGradient id="face" cx="0.7" cy="0.75" r="0.8">
          <stop offset="0" stopColor="#c8a58e" />
          <stop offset="0.45" stopColor="#7a5a48" />
          <stop offset="1" stopColor="#1b130f" />
        </radialGradient>
      </defs>

      <g transform={`translate(0 ${breathe})`}>
        {/* torso / suit jacket */}
        <path
          d="M560 1080 L590 640 Q600 540 700 515 L790 500 L880 515 Q980 540 990 640 L1020 1080 Z"
          fill="url(#suit)"
        />
        <path d="M560 1080 L590 640 Q600 540 700 515 L705 520 Q620 555 612 650 L584 1080 Z" fill="url(#rim)" opacity={0.9} />
        {/* shirt + tie */}
        <path d="M745 505 L790 640 L835 505 Z" fill="#e9e6df" />
        <path d="M780 520 L800 520 L806 560 L790 690 L774 560 Z" fill={C.goldDeep} />
        <path d="M782 520 L798 520 L796 540 L784 540 Z" fill={C.gold} />
        {/* lapels */}
        <path d="M700 515 L745 505 L790 700 L730 600 Z" fill="#050506" />
        <path d="M880 515 L835 505 L790 700 L850 600 Z" fill="#101116" />

        {/* neck */}
        <rect x={760} y={430} width={60} height={90} rx={18} fill="#4a3426" />

        {/* head (tilted down to phone) */}
        <g transform={`rotate(${12 + shake} 790 380)`}>
          <ellipse cx={790} cy={370} rx={78} ry={96} fill="url(#face)" />
          {/* hair */}
          <path d="M712 352 Q708 268 790 262 Q878 262 872 350 Q858 300 790 300 Q730 302 712 352 Z" fill="#141010" />
          {/* ear */}
          <ellipse cx={714} cy={378} rx={12} ry={22} fill="#3b2a20" />
          {/* furrowed brow + eyes in shadow */}
          <path d="M800 350 Q826 338 852 348" stroke="#1a0f0a" strokeWidth={6} fill="none" strokeLinecap="round" />
          <path d="M818 368 Q832 364 846 370" stroke="#0e0806" strokeWidth={5} fill="none" strokeLinecap="round" />
          <path d="M836 430 Q850 436 860 428" stroke="#2b1a12" strokeWidth={4} fill="none" strokeLinecap="round" />
        </g>

        {/* left arm: hand to forehead (stress) */}
        <path d="M640 600 Q600 520 640 440 Q680 380 760 330" stroke="#0f1014" strokeWidth={70} fill="none" strokeLinecap="round" />
        <ellipse cx={770} cy={322} rx={40} ry={28} fill="#5a4030" transform="rotate(-25 770 322)" />

        {/* right arm holding phone */}
        <path d="M960 640 Q1010 610 960 560" stroke="#15171d" strokeWidth={74} fill="none" strokeLinecap="round" />
        <g transform="rotate(-18 940 520)">
          <rect x={900} y={450} width={70} height={130} rx={12} fill="#0b0b0d" stroke="#333" strokeWidth={3} />
          <rect x={906} y={458} width={58} height={114} rx={8} fill="#cfe6ff" opacity={glow} />
          <rect x={912} y={500} width={46} height={14} rx={3} fill={C.red} opacity={0.5 + 0.5 * Math.round(Math.sin(frame / 3) * 0.5 + 0.5)} />
        </g>
        <ellipse cx={952} cy={560} rx={34} ry={24} fill="#4f3828" />
        {/* phone light spill on face/chest */}
        <circle cx={900} cy={470} r={260} fill="url(#phoneGlow)" opacity={0.35 * glow} style={{mixBlendMode: 'screen'}} />
      </g>
    </svg>
  );
};

const PhoneUI: React.FC<{frame: number}> = ({frame}) => {
  const {fps} = useVideoConfig();
  const pop = spring({frame: frame - 14, fps, config: {damping: 12, stiffness: 200}});
  const blink = Math.sin(frame / 2.5) > 0 ? 1 : 0.35;
  return (
    <div
      style={{
        width: 560,
        height: 1080,
        borderRadius: 64,
        background: '#0b0b0d',
        border: '6px solid #2c2c31',
        boxShadow: '0 40px 120px rgba(0,0,0,0.8), 0 0 140px rgba(120,170,255,0.25)',
        padding: 22,
        position: 'relative',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 46,
          background: 'linear-gradient(180deg,#121722 0%, #0a0d14 100%)',
          overflow: 'hidden',
          fontFamily: FONT_BODY,
          color: C.white,
          padding: '70px 40px',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        <div style={{fontSize: 22, letterSpacing: 4, color: '#8d96a8', fontWeight: 700}}>SHIPMENT TRACKING</div>
        <div style={{fontSize: 46, fontWeight: 800, marginTop: 12}}>Order #48217</div>
        <div style={{fontSize: 26, marginTop: 18, color: '#c7cbd4', fontWeight: 500}}>Customer freight · Priority</div>

        <div
          style={{
            marginTop: 50,
            padding: '26px 28px',
            borderRadius: 22,
            background: 'rgba(224,50,43,0.14)',
            border: `3px solid ${C.red}`,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
          }}
        >
          <div style={{width: 26, height: 26, borderRadius: 13, background: C.red, opacity: blink, boxShadow: `0 0 24px ${C.red}`}} />
          <div style={{fontFamily: FONT_DISPLAY, fontSize: 64, fontWeight: 700, color: C.red, letterSpacing: 4}}>DELAYED</div>
        </div>

        <div style={{marginTop: 50, fontSize: 24, color: '#8d96a8', fontWeight: 700, letterSpacing: 3}}>STATUS</div>
        <div style={{marginTop: 18, height: 16, borderRadius: 8, background: '#262b36', overflow: 'hidden'}}>
          <div style={{width: '38%', height: '100%', background: C.red}} />
        </div>
        {['Order received', 'Awaiting pickup', 'Carrier unavailable'].map((t, i) => (
          <div key={t} style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 30, fontSize: 28, fontWeight: 500, color: i === 2 ? C.red : '#c7cbd4'}}>
            <div style={{width: 16, height: 16, borderRadius: 8, background: i === 2 ? C.red : '#5a6272'}} />
            {t}
          </div>
        ))}

        {/* push notification */}
        <div
          style={{
            position: 'absolute',
            left: 24,
            right: 24,
            top: 24,
            transform: `translateY(${(1 - pop) * -160}px)`,
            opacity: pop,
            padding: '20px 24px',
            borderRadius: 24,
            background: 'rgba(40,44,54,0.96)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          <span style={{color: C.red}}>⚠ ALERT</span>&nbsp; Your shipment has been delayed.
        </div>
      </div>
    </div>
  );
};

export const Scene1Delay: React.FC = () => {
  const frame = useCurrentFrame();
  const camScale = interpolate(frame, [0, 50], [1.0, 1.12], {...clamp, easing: Easing.out(Easing.quad)});
  const toPhone = interpolate(frame, [38, 54], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const phoneScale = interpolate(frame, [38, 90], [0.7, 0.92], clamp);
  const fadeIn = interpolate(frame, [0, 10], [0, 1], clamp);
  const redPulse = 0.12 + 0.12 * Math.max(0, Math.sin(frame / 4));

  return (
    <AbsoluteFill style={{background: C.black, opacity: fadeIn}}>
      {/* wide: office at night */}
      <AbsoluteFill style={{transform: `scale(${camScale + toPhone * 0.4})`, opacity: 1 - toPhone * 0.85, filter: `blur(${toPhone * 10}px)`}}>
        <AbsoluteFill style={{background: 'linear-gradient(180deg,#05070d 0%,#0c1020 55%,#070708 100%)'}} />
        <CityBokeh />
        {/* window mullions */}
        <AbsoluteFill>
          {[480, 960, 1440].map((x) => (
            <div key={x} style={{position: 'absolute', left: x, top: 0, width: 18, height: 820, background: '#050506'}} />
          ))}
          <div style={{position: 'absolute', left: 0, top: 800, width: 1920, height: 280, background: 'linear-gradient(180deg,#0b0b0d,#020202)'}} />
          <div style={{position: 'absolute', left: 0, top: 800, width: 1920, height: 3, background: C.gold, opacity: 0.35}} />
        </AbsoluteFill>
        <Businessman frame={frame} />
      </AbsoluteFill>

      {/* close: phone screen */}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: toPhone}}>
        <div style={{transform: `scale(${phoneScale}) rotate(${interpolate(frame, [38, 90], [-6, -2], clamp)}deg)`}}>
          <PhoneUI frame={frame - 38} />
        </div>
      </AbsoluteFill>

      {/* alarm tint */}
      <AbsoluteFill style={{background: `radial-gradient(ellipse at center, transparent 40%, rgba(224,50,43,${redPulse}) 100%)`}} />

      <VOCaption text="Shipment delayed? Every second counts!" start={6} end={90} highlight={['Every', 'second', 'counts']} />
    </AbsoluteFill>
  );
};
