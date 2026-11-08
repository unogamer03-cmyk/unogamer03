import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing, random} from 'remotion';
import {C, FONT_BODY, FONT_DISPLAY} from '../theme';
import {clamp, VOCaption, GoldFlash, SpeedLines, GoldDust} from '../components/Common';
import {Truck} from '../components/Truck';
import {statePaths, nationPath, routeD, routeLength, pointAt, CHICAGO, DALLAS} from '../components/usMap';

// 6–11s: 3D map, Chicago → Texas golden route, then truck speeding on the highway.

const HIGHLIGHT = new Set(['17', '48']); // Illinois, Texas (FIPS)
const ON_ROUTE = new Set(['29', '40']); // Missouri, Oklahoma

const CityPin: React.FC<{x: number; y: number; label: string; sub: string; show: number; align: 'left' | 'right'; frame: number}> = ({
  x,
  y,
  label,
  sub,
  show,
  align,
  frame,
}) => {
  const pulse = (frame % 30) / 30;
  return (
    <g opacity={show}>
      <circle cx={x} cy={y} r={10 + pulse * 40} fill="none" stroke={C.goldLight} strokeWidth={3} opacity={1 - pulse} />
      <circle cx={x} cy={y} r={11} fill={C.goldLight} stroke="#000" strokeWidth={3} />
      <circle cx={x} cy={y} r={30} fill={C.gold} opacity={0.35} style={{filter: 'blur(8px)'}} />
      <g transform={`translate(${align === 'right' ? x + 26 : x - 26} ${y - 14})`}>
        <text
          textAnchor={align === 'right' ? 'start' : 'end'}
          fontFamily={FONT_DISPLAY}
          fontWeight={700}
          fontSize={40}
          letterSpacing={3}
          fill={C.white}
          stroke="#000"
          strokeWidth={6}
          paintOrder="stroke"
        >
          {label}
        </text>
        <text
          y={30}
          textAnchor={align === 'right' ? 'start' : 'end'}
          fontFamily={FONT_BODY}
          fontWeight={700}
          fontSize={18}
          letterSpacing={4}
          fill={C.gold}
          stroke="#000"
          strokeWidth={5}
          paintOrder="stroke"
        >
          {sub}
        </text>
      </g>
    </g>
  );
};

const MapShot: React.FC<{frame: number}> = ({frame}) => {
  const {fps} = useVideoConfig();
  const rise = spring({frame, fps, config: {damping: 20, stiffness: 60}});
  const draw = interpolate(frame, [14, 84], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const cam = interpolate(frame, [0, 100], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});

  const mid = {x: (CHICAGO[0] + DALLAS[0]) / 2, y: (CHICAGO[1] + DALLAS[1]) / 2};
  const zoom = interpolate(cam, [0, 1], [1.0, 1.9]);
  const tx = interpolate(cam, [0, 1], [0, 960 - mid.x]);
  const ty = interpolate(cam, [0, 1], [0, 470 - mid.y]);
  const tilt = interpolate(rise, [0, 1], [70, 38]);
  const spin = interpolate(cam, [0, 1], [-8, 4]);

  const head = pointAt(draw);

  return (
    <AbsoluteFill style={{perspective: 1600, perspectiveOrigin: '50% 30%'}}>
      <AbsoluteFill
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${tilt}deg) rotateZ(${spin}deg) scale(${zoom}) translate(${tx}px, ${ty}px)`,
          transformOrigin: '50% 50%',
        }}
      >
        <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{position: 'absolute', overflow: 'visible'}}>
          <defs>
            <linearGradient id="landFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1b1c21" />
              <stop offset="1" stopColor="#0d0d10" />
            </linearGradient>
            <linearGradient id="goldState" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#6e5617" />
              <stop offset="1" stopColor="#3a2d0c" />
            </linearGradient>
            <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* extruded slab for 3D depth */}
          {Array.from({length: 10}).map((_, i) => (
            <path key={i} d={nationPath} fill={i === 9 ? '#2b2414' : '#0a0a0a'} transform={`translate(0 ${18 - i * 2})`} opacity={0.9} />
          ))}
          {/* states */}
          {statePaths.map((s) => (
            <path
              key={s.id}
              d={s.d}
              fill={HIGHLIGHT.has(s.id) ? 'url(#goldState)' : ON_ROUTE.has(s.id) ? '#24221c' : 'url(#landFill)'}
              stroke={HIGHLIGHT.has(s.id) ? C.goldLight : '#4a4532'}
              strokeWidth={HIGHLIGHT.has(s.id) ? 2.2 : 1}
              opacity={HIGHLIGHT.has(s.id) ? interpolate(frame, [10, 30], [0.4, 1], clamp) : 1}
            />
          ))}
          <path d={nationPath} fill="none" stroke={C.gold} strokeWidth={2} opacity={0.6} />

          {/* state labels for the two highlighted states */}
          {statePaths
            .filter((s) => HIGHLIGHT.has(s.id))
            .map((s) => (
              <text
                key={s.id}
                x={s.id === '17' ? s.centroid[0] + 4 : s.centroid[0]}
                y={s.id === '17' ? s.centroid[1] + 40 : s.centroid[1] + 50}
                textAnchor="middle"
                fontFamily={FONT_DISPLAY}
                fontWeight={700}
                fontSize={s.id === '48' ? 44 : 16}
                letterSpacing={s.id === '48' ? 14 : 3}
                fill={C.gold}
                opacity={0.55}
              >
                {s.name.toUpperCase()}
              </text>
            ))}

          {/* route: base + glowing animated gold line */}
          <path d={routeD} fill="none" stroke="#000" strokeWidth={12} strokeLinejoin="round" strokeLinecap="round" opacity={0.6} />
          <path
            d={routeD}
            fill="none"
            stroke={C.goldLight}
            strokeWidth={7}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={routeLength}
            strokeDashoffset={routeLength * (1 - draw)}
            filter="url(#routeGlow)"
          />
          {/* travelling energy dashes */}
          <path
            d={routeD}
            fill="none"
            stroke="#fff"
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray="6 22"
            strokeDashoffset={-frame * 3}
            opacity={draw > 0.02 ? 0.7 : 0}
            style={{clipPath: 'none'}}
            mask="url(#routeMask)"
          />
          <mask id="routeMask">
            <path d={routeD} fill="none" stroke="#fff" strokeWidth={10} strokeDasharray={routeLength} strokeDashoffset={routeLength * (1 - draw)} />
          </mask>

          {/* truck marker riding the head of the route */}
          {draw > 0.01 && (
            <g transform={`translate(${head.x} ${head.y}) rotate(${head.angle})`}>
              <circle r={26} fill={C.gold} opacity={0.35} style={{filter: 'blur(6px)'}} />
              <rect x={-20} y={-6} width={28} height={12} rx={2} fill="#111" stroke={C.goldLight} strokeWidth={2} />
              <rect x={10} y={-6} width={12} height={12} rx={3} fill={C.goldLight} />
            </g>
          )}

          <CityPin x={CHICAGO[0]} y={CHICAGO[1]} label="CHICAGO, IL" sub="ORIGIN" show={interpolate(frame, [8, 18], [0, 1], clamp)} align="right" frame={frame} />
          <CityPin x={DALLAS[0]} y={DALLAS[1]} label="DALLAS, TX" sub="DESTINATION" show={interpolate(frame, [70, 84], [0, 1], clamp)} align="left" frame={frame} />
        </svg>
      </AbsoluteFill>

      {/* interstate chips */}
      <div style={{position: 'absolute', right: 90, top: 80, display: 'flex', gap: 14, opacity: interpolate(frame, [20, 34], [0, 1], clamp)}}>
        {['I-55', 'I-44', 'I-35'].map((r, i) => (
          <div
            key={r}
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: 28,
              letterSpacing: 2,
              color: draw > [0.05, 0.3, 0.72][i] ? '#000' : C.gold,
              background: draw > [0.05, 0.3, 0.72][i] ? C.gold : 'rgba(0,0,0,0.6)',
              border: `2px solid ${C.gold}`,
              padding: '6px 16px',
              borderRadius: 6,
            }}
          >
            {r}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const InterstateShield: React.FC<{num: string; x: number; scale?: number}> = ({num, x, scale = 1}) => (
  <div style={{position: 'absolute', left: x, top: 370, transform: `scale(${scale})`, transformOrigin: 'bottom center'}}>
    <svg width={120} height={330} viewBox="0 0 120 330">
      <rect x={56} y={110} width={8} height={220} fill="#6c6f75" />
      <path d="M10 10 Q60 -4 110 10 L110 40 L10 40 Z" fill="#c8102e" stroke="#fff" strokeWidth={4} />
      <path d="M10 40 L110 40 Q112 90 60 116 Q8 90 10 40 Z" fill="#003f87" stroke="#fff" strokeWidth={4} />
      <text x={60} y={33} textAnchor="middle" fontFamily={FONT_BODY} fontWeight={800} fontSize={13} fill="#fff">
        INTERSTATE
      </text>
      <text x={60} y={88} textAnchor="middle" fontFamily={FONT_BODY} fontWeight={800} fontSize={42} fill="#fff">
        {num}
      </text>
    </svg>
  </div>
);

const HighwayShot: React.FC<{frame: number}> = ({frame}) => {
  const speed = 90; // px per frame for near layers
  const wheelRot = frame * 70;
  const bob = Math.sin(frame * 1.7) * 1.5;
  const fade = interpolate(frame, [0, 8], [0, 1], clamp);
  return (
    <AbsoluteFill style={{opacity: fade, overflow: 'hidden'}}>
      {/* Texas plains at golden hour */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg,#0b0a08 0%,#3a2a10 30%,#c08a2a 50%,#2a1e0c 52%,#0c0a07 100%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(circle at 70% 48%, rgba(255,226,140,0.85), rgba(212,175,55,0.15) 18%, transparent 35%)'}} />
      {/* distant mesas / horizon, slow parallax */}
      <svg width={3840} height={1080} style={{position: 'absolute', top: -90, left: -((frame * 4) % 1920)}}>
        {[0, 1920].map((o) => (
          <path
            key={o}
            d={`M${o} 650 L${o + 200} 620 L${o + 420} 630 L${o + 520} 590 L${o + 760} 592 L${o + 820} 625 L${o + 1100} 615 L${o + 1300} 600 L${o + 1500} 630 L${o + 1700} 612 L${o + 1920} 650 L${o + 1920} 700 L${o} 700 Z`}
            fill="#16110a"
          />
        ))}
      </svg>
      {/* road */}
      <div style={{position: 'absolute', left: 0, top: 720, width: 1920, height: 360, background: 'linear-gradient(180deg,#1a1a1a,#0c0c0c)'}} />
      <div style={{position: 'absolute', left: 0, top: 718, width: 1920, height: 6, background: '#d9d4c7', opacity: 0.7}} />
      {/* lane dashes */}
      {Array.from({length: 8}).map((_, i) => {
        const x = ((i * 320 - frame * speed * 1.2) % 2560 + 2560) % 2560 - 320;
        return <div key={i} style={{position: 'absolute', left: x, top: 860, width: 180, height: 12, background: '#f2e9c9', opacity: 0.8, filter: 'blur(2px)'}} />;
      })}
      {/* passing shields + fence posts */}
      <InterstateShield num="35" x={1980 - ((frame * speed * 0.9) % 2600)} />
      {Array.from({length: 12}).map((_, i) => {
        const x = ((i * 200 - frame * speed) % 2400 + 2400) % 2400 - 200;
        return <div key={i} style={{position: 'absolute', left: x, top: 640, width: 8, height: 80, background: '#0d0b08'}} />;
      })}
      <div style={{position: 'absolute', left: 0, top: 660, width: 1920, height: 3, background: '#2a2216'}} />

      <SpeedLines intensity={0.9} seed="hw" color={C.goldLight} />

      {/* the truck */}
      <div style={{position: 'absolute', left: 200, top: 420 + bob, filter: 'drop-shadow(0 30px 30px rgba(0,0,0,0.6))'}}>
        <Truck width={1400} wheelRotation={wheelRot} headlights={1} idPrefix="s3" />
      </div>
      {/* motion-blur ghost */}
      <div style={{position: 'absolute', left: 140, top: 420 + bob, opacity: 0.18, filter: 'blur(10px)'}}>
        <Truck width={1400} wheelRotation={wheelRot} headlights={0} idPrefix="s3g" />
      </div>
      {/* road dust kicked up */}
      {Array.from({length: 16}).map((_, i) => {
        const life = ((frame + i * 3) % 24) / 24;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 220 - life * 500,
              top: 780 - life * 40 + random(`d${i}`) * 30,
              width: 40 + life * 120,
              height: 20 + life * 40,
              borderRadius: '50%',
              background: 'rgba(200,170,110,0.25)',
              opacity: 1 - life,
              filter: 'blur(10px)',
            }}
          />
        );
      })}
      <div style={{position: 'absolute', left: 90, top: 80, display: 'flex', alignItems: 'center', gap: 18}}>
        <div style={{width: 6, height: 74, background: C.gold}} />
        <div>
          <div style={{fontFamily: FONT_DISPLAY, fontSize: 56, color: C.white, letterSpacing: 6, fontWeight: 700}}>EN ROUTE</div>
          <div style={{fontFamily: FONT_BODY, fontSize: 20, color: C.gold, letterSpacing: 6, fontWeight: 700}}>I-35 SOUTH · TEXAS</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Scene3Route: React.FC = () => {
  const frame = useCurrentFrame();
  const MAP_END = 100;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #17150f 0%, #050505 70%)'}}>
      {frame < MAP_END + 6 && (
        <AbsoluteFill style={{opacity: interpolate(frame, [MAP_END - 2, MAP_END + 6], [1, 0], clamp)}}>
          <GoldDust count={30} seed="map" opacity={0.5} />
          <MapShot frame={frame} />
        </AbsoluteFill>
      )}
      {frame >= MAP_END - 2 && <HighwayShot frame={frame - (MAP_END - 2)} />}
      <GoldFlash at={MAP_END} dur={16} />
      <VOCaption text="From Chicago to Texas, delivering in record time!" start={6} end={150} highlight={['Chicago', 'Texas']} />
    </AbsoluteFill>
  );
};
