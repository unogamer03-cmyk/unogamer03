import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, Easing} from 'remotion';
import {C, FONT_BODY, FONT_DISPLAY} from '../theme';
import {clamp, VOCaption, GoldDust} from '../components/Common';
import {Truck} from '../components/Truck';

// 3–6s: truck arrives at a Chicago dock, shipment loaded fast, rolls out.

const GROUND = 770;
const TRUCK_W = 1300;
const K = TRUCK_W / 1520; // svg -> px
const TRUCK_TOP = GROUND - 372 * K;
const FLOOR_Y = TRUCK_TOP + 322 * K;
const DOCK_X = 300; // trailer rear lines up here
const WHEEL_R = 36 * K;

// Stylised Chicago skyline (Willis Tower, Hancock Center, Trump Tower, Aon Center, etc.)
const ChicagoSkyline: React.FC<{frame: number}> = ({frame}) => {
  const b = (x: number, w: number, h: number, extra?: React.ReactNode, key?: string) => (
    <g key={key ?? `${x}`}>
      <rect x={x} y={760 - h} width={w} height={h} fill="url(#bldg)" />
      {Array.from({length: Math.floor(h / 26)}).map((_, r) =>
        Array.from({length: Math.floor(w / 18)}).map((__, c) =>
          random(`w${x}-${r}-${c}`) > 0.55 ? (
            <rect
              key={`${r}-${c}`}
              x={x + 5 + c * 18}
              y={760 - h + 10 + r * 26}
              width={8}
              height={12}
              fill={random(`wc${x}${r}${c}`) > 0.3 ? '#f3cf76' : '#9bb7e0'}
              opacity={0.35 + 0.4 * random(`wo${x}${r}${c}`)}
            />
          ) : null
        )
      )}
      {extra}
    </g>
  );
  const blink = Math.sin(frame / 5) > 0 ? 1 : 0.2;
  return (
    <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{position: 'absolute', top: -90}}>
      <defs>
        <linearGradient id="bldg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d1f27" />
          <stop offset="1" stopColor="#0a0b0f" />
        </linearGradient>
      </defs>
      {b(140, 90, 260)}
      {b(240, 70, 330)}
      {/* Aon Center */}
      {b(330, 110, 470)}
      {b(460, 80, 300)}
      {/* Willis Tower: stepped setbacks + twin antennas */}
      <g>
        {b(980, 170, 520, undefined, 'w1')}
        <rect x={1010} y={760 - 600} width={120} height={80} fill="url(#bldg)" />
        <rect x={1040} y={760 - 660} width={70} height={60} fill="url(#bldg)" />
        <rect x={1052} y={760 - 760} width={6} height={100} fill="#2a2c34" />
        <rect x={1092} y={760 - 740} width={6} height={80} fill="#2a2c34" />
        <circle cx={1055} cy={760 - 760} r={5} fill={C.red} opacity={blink} />
        <circle cx={1095} cy={760 - 740} r={5} fill={C.red} opacity={blink} />
      </g>
      {b(560, 120, 380)}
      {/* Trump Tower: tapered with spire */}
      <path d="M720 760 L720 360 L760 300 L800 360 L800 760 Z" fill="url(#bldg)" />
      <rect x={758} y={200} width={4} height={100} fill="#2a2c34" />
      {/* John Hancock: tapered with X-bracing + two antennas */}
      <g>
        <path d="M1260 760 L1280 290 L1380 290 L1400 760 Z" fill="url(#bldg)" />
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M${1264 + i * 2} ${760 - i * 118} L${1394 - i * 2} ${642 - i * 118} M${1394 - i * 2} ${760 - i * 118} L${1264 + i * 2} ${642 - i * 118}`}
            stroke="#2e313b"
            strokeWidth={4}
          />
        ))}
        <rect x={1298} y={180} width={5} height={110} fill="#2a2c34" />
        <rect x={1356} y={180} width={5} height={110} fill="#2a2c34" />
        <circle cx={1300} cy={180} r={5} fill={C.red} opacity={blink} />
      </g>
      {b(840, 110, 340)}
      {b(1170, 80, 280)}
      {b(1420, 130, 360)}
      {b(1570, 90, 250)}
      {b(1680, 120, 310)}
      {b(1820, 100, 220)}
    </svg>
  );
};

const Pallet: React.FC<{x: number; y: number; scale?: number}> = ({x, y, scale = 1}) => (
  <div style={{position: 'absolute', left: x, top: y - 96 * scale, width: 110 * scale, height: 96 * scale}}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        bottom: 12 * scale,
        background: 'linear-gradient(180deg,#b88a4a,#8a6331)',
        border: '2px solid #5e431f',
        borderRadius: 4,
      }}
    >
      <div style={{position: 'absolute', left: '45%', top: 0, bottom: 0, width: 10 * scale, background: C.gold, opacity: 0.9}} />
      <div style={{position: 'absolute', top: '45%', left: 0, right: 0, height: 8 * scale, background: '#1b1b1b', opacity: 0.8}} />
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 12 * scale, background: '#5e431f'}} />
  </div>
);

export const Scene2Chicago: React.FC = () => {
  const frame = useCurrentFrame();

  // truck motion: reverse into dock (0–30), hold, pull out (62–90)
  const inX = interpolate(frame, [0, 30], [1900, DOCK_X - 34 * K], {...clamp, easing: Easing.out(Easing.cubic)});
  const outDx = interpolate(frame, [62, 90], [0, 1400], {...clamp, easing: Easing.in(Easing.cubic)});
  const truckX = inX + outDx;
  const wheelRot = ((truckX - 1900) / WHEEL_R) * (180 / Math.PI);
  const brake = interpolate(frame, [20, 30, 34], [0, 1, 0], clamp);

  // loading: three pallets slide from dock into the trailer
  const pallets = [0, 1, 2].map((i) => {
    const t = interpolate(frame, [30 + i * 9, 44 + i * 9], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
    return {x: interpolate(t, [0, 1], [40 + i * 4, DOCK_X + 30]), vis: t < 1};
  });
  const doorGlow = interpolate(frame, [30, 36, 58, 62], [0, 1, 1, 0], clamp);

  const camShake = frame > 60 ? Math.sin(frame * 2.1) * interpolate(frame, [60, 90], [0, 4], clamp) : 0;
  const zoom = interpolate(frame, [0, 90], [1.05, 1.0], clamp);
  const tagIn = interpolate(frame, [4, 16], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});

  return (
    <AbsoluteFill style={{background: C.black, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${zoom}) translateY(${camShake}px)`}}>
        {/* dusk sky */}
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(180deg, #06070b 0%, #121423 34%, #3b2a14 54%, #7a5418 62%, #0a0a0a 62.2%)',
          }}
        />
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 55% 72%, rgba(246,226,122,0.35), transparent 45%)'}} />
        <ChicagoSkyline frame={frame} />
        {/* ground / lot */}
        <div style={{position: 'absolute', left: 0, top: 670, width: 1920, height: 410, background: 'linear-gradient(180deg,#141414 0%,#0b0b0b 40%,#050505 100%)'}} />
        {/* wet reflection band */}
        <div style={{position: 'absolute', left: 0, top: GROUND - 4, width: 1920, height: 220, background: 'linear-gradient(180deg, rgba(212,175,55,0.18), transparent)'}} />

        {/* dock building */}
        <div style={{position: 'absolute', left: -20, top: FLOOR_Y - 250, width: DOCK_X + 20, height: 250, background: 'linear-gradient(90deg,#1a1a1d,#26262b)', borderRight: '4px solid #333'}}>
          <div style={{position: 'absolute', left: 30, top: 24, right: 20, height: 150, background: '#0c0c0e', border: '3px solid #3a3a40'}}>
            <div style={{position: 'absolute', inset: 0, background: `rgba(255,214,120,${0.25 + doorGlow * 0.5})`}} />
          </div>
          <div style={{position: 'absolute', left: 50, top: 186, fontFamily: FONT_DISPLAY, fontSize: 30, color: C.gold, letterSpacing: 4}}>DOCK 07</div>
        </div>
        <div style={{position: 'absolute', left: -20, top: FLOOR_Y, width: DOCK_X + 20, height: GROUND - FLOOR_Y + 40, background: '#202024', borderTop: `6px solid ${C.gold}`}} />
        {/* dock light */}
        <div style={{position: 'absolute', left: 0, top: FLOOR_Y - 300, width: 700, height: 500, background: 'radial-gradient(ellipse at 20% 20%, rgba(255,228,150,0.3), transparent 60%)', opacity: 0.6 + doorGlow * 0.4}} />

        {pallets.map((p, i) => (p.vis ? <Pallet key={i} x={p.x} y={FLOOR_Y} scale={0.95} /> : null))}

        {/* truck */}
        <div style={{position: 'absolute', left: truckX, top: TRUCK_TOP}}>
          <Truck width={TRUCK_W} wheelRotation={wheelRot} brake={brake} headlights={1} idPrefix="s2" />
        </div>

        <GoldDust count={24} seed="s2" opacity={0.5} />
      </AbsoluteFill>

      {/* location tag */}
      <div
        style={{
          position: 'absolute',
          left: 90,
          top: 80,
          opacity: tagIn,
          transform: `translateX(${(1 - tagIn) * -40}px)`,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
        }}
      >
        <div style={{width: 6, height: 74, background: C.gold}} />
        <div>
          <div style={{fontFamily: FONT_DISPLAY, fontSize: 56, color: C.white, letterSpacing: 6, fontWeight: 700}}>CHICAGO, IL</div>
          <div style={{fontFamily: FONT_BODY, fontSize: 20, color: C.gold, letterSpacing: 6, fontWeight: 700}}>PICKUP · LOADING NOW</div>
        </div>
      </div>

      <VOCaption text="Big Outdoors Expedite LLC is ready to move!" start={6} end={90} highlight={['Big', 'Outdoors', 'Expedite', 'LLC']} />
    </AbsoluteFill>
  );
};
