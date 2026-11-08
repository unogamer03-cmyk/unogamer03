import React from 'react';
import {BRAND, C, FONT_DISPLAY, FONT_BODY} from '../theme';

// Side-view American conventional semi-truck (long-hood tractor + 53' dry van),
// facing right. Drawn in a 1400x360 box; ground line at y=332.

const Wheel: React.FC<{cx: number; cy: number; rot: number; id: string}> = ({
  cx,
  cy,
  rot,
  id,
}) => (
  <g transform={`translate(${cx} ${cy})`}>
    <circle r={36} fill="#0b0b0b" />
    <circle r={36} fill={`url(#tire-${id})`} />
    <circle r={22} fill={`url(#rim-${id})`} stroke="#555" strokeWidth={1.5} />
    <g transform={`rotate(${rot})`}>
      {Array.from({length: 10}).map((_, i) => (
        <g key={i} transform={`rotate(${i * 36})`}>
          <rect x={-1.6} y={-19} width={3.2} height={9} fill="#e9e9e9" opacity={0.85} />
          <circle cx={0} cy={-13} r={2.2} fill="#cfcfcf" />
        </g>
      ))}
    </g>
    <circle r={7} fill="#222" stroke="#999" strokeWidth={1.5} />
    <ellipse cx={-8} cy={-14} rx={10} ry={4} fill="#fff" opacity={0.25} />
  </g>
);

export const Truck: React.FC<{
  wheelRotation?: number;
  headlights?: number; // 0..1 beam intensity
  brake?: number; // 0..1
  showBranding?: boolean;
  doorOpen?: number; // 0..1 rear doors swing (visual only)
  style?: React.CSSProperties;
  width?: number;
  idPrefix?: string;
}> = ({
  wheelRotation = 0,
  headlights = 1,
  brake = 0,
  showBranding = true,
  doorOpen = 0,
  style,
  width = 1400,
  idPrefix = 't',
}) => {
  const id = idPrefix;
  const wheels = [
    {x: 690, id: `${id}a`},
    {x: 768, id: `${id}b`},
    {x: 978, id: `${id}c`},
    {x: 1054, id: `${id}d`},
    {x: 1292, id: `${id}e`},
  ];
  return (
    <svg
      viewBox="-40 -40 1520 420"
      width={width}
      height={(width * 420) / 1520}
      style={{overflow: 'visible', ...style}}
    >
      <defs>
        <linearGradient id={`trailer-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b2b30" />
          <stop offset="0.08" stopColor="#141417" />
          <stop offset="0.55" stopColor="#0b0b0d" />
          <stop offset="1" stopColor="#1c1c20" />
        </linearGradient>
        <linearGradient id={`gold-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff3b0" />
          <stop offset="0.3" stopColor="#f6e27a" />
          <stop offset="0.6" stopColor={C.gold} />
          <stop offset="1" stopColor={C.goldDeep} />
        </linearGradient>
        <linearGradient id={`paint-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3a40" />
          <stop offset="0.12" stopColor="#121214" />
          <stop offset="0.6" stopColor="#060607" />
          <stop offset="1" stopColor="#202024" />
        </linearGradient>
        <linearGradient id={`chrome-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.35" stopColor="#bfc3c9" />
          <stop offset="0.5" stopColor="#6b6f75" />
          <stop offset="0.7" stopColor="#e7e9ec" />
          <stop offset="1" stopColor="#8a8e94" />
        </linearGradient>
        <linearGradient id={`chromeV-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8a8e94" />
          <stop offset="0.4" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#bfc3c9" />
          <stop offset="1" stopColor="#5d6066" />
        </linearGradient>
        <linearGradient id={`glass-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6d7a88" />
          <stop offset="0.45" stopColor="#1b2028" />
          <stop offset="1" stopColor="#0a0c10" />
        </linearGradient>
        <radialGradient id={`beam-${id}`} cx="0" cy="0.5" r="1">
          <stop offset="0" stopColor="#fff6d0" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fff6d0" stopOpacity="0" />
        </radialGradient>
        {wheels.map((w) => (
          <React.Fragment key={w.id}>
            <radialGradient id={`tire-${w.id}`}>
              <stop offset="0.6" stopColor="#1a1a1a" />
              <stop offset="0.92" stopColor="#050505" />
              <stop offset="1" stopColor="#2a2a2a" />
            </radialGradient>
            <radialGradient id={`rim-${w.id}`} cx="0.4" cy="0.35">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.5" stopColor="#b8bcc2" />
              <stop offset="1" stopColor="#55585e" />
            </radialGradient>
          </React.Fragment>
        ))}
      </defs>

      {/* ground shadow */}
      <ellipse cx={690} cy={338} rx={720} ry={14} fill="#000" opacity={0.6} />

      {/* headlight beam */}
      {headlights > 0 && (
        <path
          d="M1372 232 L1880 150 L1880 340 Z"
          fill={`url(#beam-${id})`}
          opacity={0.55 * headlights}
          style={{mixBlendMode: 'screen'}}
        />
      )}

      {/* ===== TRAILER (53' dry van) ===== */}
      <rect x={0} y={30} width={900} height={252} rx={6} fill={`url(#trailer-${id})`} />
      <rect x={0} y={30} width={900} height={252} rx={6} fill="none" stroke="#3a3a40" strokeWidth={2} />
      {/* roof rail */}
      <rect x={0} y={28} width={900} height={6} fill={`url(#chrome-${id})`} opacity={0.7} />
      {/* panel seams */}
      {Array.from({length: 17}).map((_, i) => (
        <line key={i} x1={50 * (i + 1)} y1={36} x2={50 * (i + 1)} y2={278} stroke="#000" strokeOpacity={0.35} strokeWidth={1} />
      ))}
      {/* gold pinstripes */}
      <rect x={0} y={248} width={900} height={7} fill={`url(#gold-${id})`} />
      <rect x={0} y={260} width={900} height={2} fill={C.gold} opacity={0.8} />
      {/* rear doors */}
      <g transform={`translate(0 0)`} opacity={1 - doorOpen * 0.85}>
        <rect x={0} y={30} width={14} height={252} fill="#1f1f23" />
        <rect x={4} y={50} width={3} height={210} fill={`url(#chromeV-${id})`} />
      </g>
      {/* tail lights */}
      <rect x={2} y={262} width={10} height={16} rx={2} fill={brake > 0 ? '#ff2a1a' : '#7a1410'} />
      {brake > 0 && <circle cx={6} cy={270} r={30} fill="#ff2a1a" opacity={0.35 * brake} style={{filter: 'blur(8px)'}} />}
      {/* marker lights */}
      {[120, 330, 540, 760].map((x) => (
        <circle key={x} cx={x} cy={276} r={3.5} fill="#ffb21a" />
      ))}

      {showBranding && (
        <g>
          <text
            x={450}
            y={150}
            textAnchor="middle"
            fontFamily={FONT_DISPLAY}
            fontWeight={700}
            fontSize={104}
            letterSpacing={6}
            fill={`url(#gold-${id})`}
          >
            {BRAND.short}
          </text>
          <text
            x={450}
            y={200}
            textAnchor="middle"
            fontFamily={FONT_BODY}
            fontWeight={800}
            fontSize={34}
            letterSpacing={18}
            fill={C.white}
          >
            {BRAND.sub}
          </text>
          <text
            x={450}
            y={236}
            textAnchor="middle"
            fontFamily={FONT_BODY}
            fontWeight={700}
            fontSize={22}
            letterSpacing={4}
            fill={C.gold}
          >
            {BRAND.web} · {BRAND.phone}
          </text>
          {/* reflective sweep */}
          <rect x={0} y={30} width={900} height={110} fill="#fff" opacity={0.04} />
        </g>
      )}

      {/* trailer underside: rails, landing gear, rear bogie */}
      <rect x={0} y={282} width={900} height={10} fill="#0a0a0a" />
      <rect x={560} y={282} width={8} height={36} fill="#3a3a3a" />
      <rect x={552} y={314} width={24} height={6} fill="#555" />
      <rect x={640} y={286} width={190} height={22} fill="#111" />
      {/* rear bumper (ICC bar) */}
      <rect x={6} y={296} width={60} height={8} fill="#c9a227" />
      <rect x={20} y={282} width={6} height={18} fill="#222" />
      {/* mud flaps */}
      <rect x={816} y={290} width={20} height={44} fill="#0b0b0b" />
      <rect x={816} y={326} width={20} height={4} fill={C.gold} />

      {/* ===== TRACTOR ===== */}
      {/* frame */}
      <rect x={890} y={268} width={480} height={20} fill="#0e0e0e" />
      {/* fifth wheel */}
      <rect x={900} y={262} width={120} height={10} fill="#222" />

      {/* sleeper */}
      <path
        d="M915 64 Q915 50 930 50 L1098 50 L1098 270 L915 270 Z"
        fill={`url(#paint-${id})`}
        stroke="#3a3a40"
        strokeWidth={2}
      />
      {/* sleeper gold stripe */}
      <rect x={915} y={212} width={183} height={6} fill={`url(#gold-${id})`} />
      {/* sleeper side window */}
      <rect x={1020} y={100} width={50} height={34} rx={4} fill={`url(#glass-${id})`} />

      {/* cab */}
      <path
        d="M1098 50 L1180 50 Q1196 50 1200 64 L1222 160 L1222 270 L1098 270 Z"
        fill={`url(#paint-${id})`}
        stroke="#3a3a40"
        strokeWidth={2}
      />
      {/* side window */}
      <path d="M1118 78 L1180 78 Q1188 78 1191 86 L1208 152 L1118 152 Z" fill={`url(#glass-${id})`} />
      <path d="M1124 84 L1160 84 L1132 146 L1124 146 Z" fill="#fff" opacity={0.12} />
      {/* door seam + handle */}
      <path d="M1112 70 L1112 262" stroke="#000" strokeOpacity={0.6} strokeWidth={2} />
      <rect x={1186} y={176} width={22} height={5} rx={2} fill={`url(#chrome-${id})`} />
      {/* mirror */}
      <rect x={1214} y={74} width={8} height={56} rx={3} fill="#111" stroke={`url(#chromeV-${id})`} strokeWidth={2} />
      <line x1={1206} y1={90} x2={1214} y2={90} stroke="#aaa" strokeWidth={3} />

      {/* long hood */}
      <path
        d="M1222 160 L1342 168 Q1366 172 1370 196 L1374 270 L1222 270 Z"
        fill={`url(#paint-${id})`}
        stroke="#3a3a40"
        strokeWidth={2}
      />
      <path d="M1222 162 L1342 170" stroke="#fff" strokeOpacity={0.25} strokeWidth={3} />
      {/* hood gold stripe */}
      <path d="M1222 212 L1372 212 L1372 218 L1222 218 Z" fill={`url(#gold-${id})`} />
      {/* air intake / hood vents */}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={1250 + i * 26} y={184} width={18} height={4} rx={2} fill="#000" opacity={0.7} />
      ))}
      {/* grille */}
      <rect x={1362} y={180} width={16} height={86} rx={3} fill={`url(#chromeV-${id})`} />
      {/* headlight */}
      <rect x={1352} y={226} width={24} height={14} rx={4} fill="#fff8de" />
      <circle cx={1370} cy={233} r={headlights * 26} fill="#fff4c2" opacity={0.5 * headlights} style={{filter: 'blur(6px)'}} />
      {/* bumper */}
      <rect x={1340} y={268} width={52} height={22} rx={6} fill={`url(#chrome-${id})`} />
      {/* cab marker lights */}
      {[1120, 1140, 1160].map((x) => (
        <rect key={x} x={x} y={44} width={10} height={6} rx={2} fill="#ffb21a" />
      ))}

      {/* exhaust stacks */}
      <rect x={1092} y={-20} width={12} height={250} rx={4} fill={`url(#chromeV-${id})`} />
      <rect x={1088} y={60} width={20} height={70} rx={4} fill="#222" opacity={0.85} />
      {/* air intake cleaner */}
      <rect x={1196} y={150} width={18} height={60} rx={6} fill={`url(#chromeV-${id})`} />

      {/* fuel tank */}
      <rect x={1108} y={236} width={100} height={36} rx={18} fill={`url(#chrome-${id})`} />
      {/* steps */}
      <rect x={1112} y={278} width={34} height={5} fill="#777" />

      {/* fenders */}
      <path d="M1248 300 Q1250 248 1292 248 Q1334 248 1338 300" fill="none" stroke="#111" strokeWidth={14} />
      <path d="M940 300 Q942 250 1016 250 Q1090 250 1094 300" fill="none" stroke="#111" strokeWidth={10} />
      <rect x={1080} y={290} width={16} height={42} fill="#0b0b0b" />
      <rect x={1080} y={326} width={16} height={4} fill={C.gold} />

      {wheels.map((w) => (
        <Wheel key={w.id} cx={w.x} cy={296} rot={wheelRotation} id={w.id} />
      ))}
    </svg>
  );
};
