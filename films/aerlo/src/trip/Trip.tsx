// Aerlo: a 15 s story film (9:16). A man books a flight on his phone, his tickets land on screen, he arrives in
// New York. Every cut sits on a bar of the track (audio/trip.wav, the last 15 s of "Follow Me Home" so the music's
// own ending closes the film). Everything is a pure function of the frame.
import React from 'react';
import { AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { E } from '../lib/anim';
import { FontGate } from '../lib/FontGate';

export const TRIP = { fps: 30, w: 1080, h: 1920, total: 450 };

// Bar lines of the track in film frames (track.py analyze, offset 58.65 s).
const BAR = [14, 68, 121, 175, 229, 283, 336, 390];
const S = { phone: BAR[1], ticket: BAR[3], nyc: BAR[5], arrive: BAR[6], end: BAR[7] };

const P = {
  ground: '#0A1426',
  ground2: '#12213B',
  card: '#FFFFFF',
  ink: '#0A1426',
  mute: '#5E6B80',
  line: '#DCE3EE',
  accent: '#2F7CF6',
  sky: '#9CC3FF',
};
const FACE = '"Manrope Variable", system-ui, sans-serif';
const MONO = '"Geist Mono Variable", ui-monospace, monospace';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const prog = (f: number, a: number, b: number, ease: (t: number) => number = E.glideOut) => ease(interpolate(f, [a, b], [0, 1], clamp));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// A seeded 0..1 sequence (no Math.random).
const rand = (seed: number) => {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
};

/** A statement line: centred in the middle band, arriving as a blur-in in 2 chunks. */
const Line: React.FC<{ parts: string[]; at: number; out?: number; y?: number; size?: number; color?: string; accent?: number }> = ({ parts, at, out, y = 0.5, size = 128, color = '#fff', accent = -1 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', left: 60, right: 60, top: `${y * 100}%`, transform: 'translateY(-50%)', textAlign: 'center' }}>
      {parts.map((p, i) => {
        const t = prog(f, at + i * 9, at + i * 9 + 16, E.snapOut);
        const o = out === undefined ? 0 : prog(f, out, out + 8, E.buildIn);
        return (
          <div
            key={i}
            style={{
              fontFamily: FACE,
              fontWeight: 720,
              fontSize: size,
              lineHeight: 1.02,
              letterSpacing: '-0.04em',
              color: i === accent ? P.sky : color,
              opacity: t * (1 - o),
              filter: `blur(${(1 - t) * 14 + o * 12}px)`,
              transform: `translateY(${(1 - t) * 26 - o * 30}px)`,
              textShadow: '0 4px 40px rgba(5,10,20,0.55), 0 2px 8px rgba(5,10,20,0.35)',
            }}
          >
            {p}
          </div>
        );
      })}
    </div>
  );
};

/** Footage cropped to 9:16 about a focus point, with a slow push. */
const Clip: React.FC<{ src: string; from: number; dur: number; focusX?: number; z0?: number; z1?: number; dim?: number; startFrom?: number }> = ({ src, from, dur, focusX = 0.5, z0 = 1, z1 = 1.08, dim = 0.3, startFrom = 0 }) => {
  const f = useCurrentFrame();
  const z = mix(z0, z1, prog(f, from, from + dur, E.softOut));
  // The 16:9 source scaled to the frame's height is 3413 px wide; slide it so focusX sits at the centre.
  const srcW = (1920 * 16) / 9;
  const x = Math.max(Math.min(-(srcW * focusX - 540), 0), -(srcW - 1080));
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: P.ground }}>
      <div style={{ position: 'absolute', left: x, top: 0, width: srcW, height: 1920, transform: `scale(${z})`, transformOrigin: `${srcW * focusX}px 50%` }}>
        <OffthreadVideo src={staticFile(src)} startFrom={startFrom} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(10,20,38,${dim * 0.6}) 0%, rgba(10,20,38,${dim}) 50%, rgba(10,20,38,${dim * 1.3}) 100%)` }} />
    </AbsoluteFill>
  );
};

/** The ground: navy with one soft key light that drifts as the act goes on. */
const Ground: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ background: P.ground }}>
    <AbsoluteFill style={{ background: `radial-gradient(900px 900px at ${mix(30, 62, t)}% ${mix(18, 30, t)}%, rgba(47,124,246,0.38), rgba(47,124,246,0) 70%)` }} />
    <AbsoluteFill style={{ background: `radial-gradient(1200px 800px at 50% 110%, ${P.ground2}, rgba(0,0,0,0) 70%)` }} />
  </AbsoluteFill>
);

const Plane: React.FC<{ size: number; color: string; rot?: number }> = ({ size, color, rot = 90 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ transform: `rotate(${rot}deg)` }}>
    <path fill={color} d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
  </svg>
);

/* ---------------------------------------------------------------- scene 2: the booking on the phone */

const Field: React.FC<{ label: string; value: string; shown?: number; code?: string }> = ({ label, value, shown = 1, code }) => {
  const n = Math.round(value.length * shown);
  return (
    <div style={{ padding: '22px 30px', borderRadius: 26, background: '#F3F6FB', display: 'flex', alignItems: 'center', gap: 22 }}>
      {code && <div style={{ fontFamily: FACE, fontWeight: 760, fontSize: 46, color: P.ink, width: 112 }}>{code}</div>}
      <div>
        <div style={{ fontFamily: FACE, fontWeight: 600, fontSize: 26, color: P.mute }}>{label}</div>
        <div style={{ fontFamily: FACE, fontWeight: 680, fontSize: 38, color: P.ink, minHeight: 46 }}>{value.slice(0, n)}</div>
      </div>
    </div>
  );
};

const Booking: React.FC = () => {
  const f = useCurrentFrame();
  const a = S.phone;
  // The phone grows out of the zoom into the man's hand: it lands from big to its size.
  const land = prog(f, a, a + 22, E.glideOut);
  const push = prog(f, a + 22, S.ticket, E.softOut);
  const scale = mix(2.2, 1, land) * mix(1, 1.05, push);
  const blur = (1 - land) * 18;
  const toCode = prog(f, a + 12, a + 30, E.linear);
  const row = prog(f, a + 34, a + 50, E.settleOut);
  // the pointer travels to the button, presses, releases
  const ptr = prog(f, a + 50, a + 70, E.strongInOut);
  const press = prog(f, a + 72, a + 76, E.stdInOut) * (1 - prog(f, a + 76, a + 84, E.stdInOut));
  const done = prog(f, a + 78, a + 88, E.snapOut);
  // the button leaves toward the ticket: the phone lifts away and blurs into the next scene
  const exit = prog(f, S.ticket - 14, S.ticket, E.launchIn);
  const btnY = 1270;
  return (
    <AbsoluteFill>
      <Ground t={push} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `translateY(${-exit * 260}px) scale(${scale * mix(1, 0.86, exit)})`, filter: `blur(${blur + exit * 16}px)`, opacity: 1 - exit * 0.9 }}>
        <div style={{ width: 800, height: 1560, borderRadius: 96, background: '#0B0F18', padding: 18, boxShadow: '0 60px 140px rgba(0,0,0,0.55), 0 0 0 2px rgba(255,255,255,0.08)' }}>
          <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 80, background: P.card, overflow: 'hidden', padding: '90px 48px 48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Mark size={46} color={P.accent} />
              <div style={{ fontFamily: FACE, fontWeight: 760, fontSize: 40, color: P.ink, letterSpacing: '-0.03em' }}>Aerlo</div>
            </div>
            <div style={{ fontFamily: FACE, fontWeight: 760, fontSize: 70, color: P.ink, letterSpacing: '-0.04em', margin: '46px 0 34px' }}>Where to?</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Field code="RUH" label="From" value="Riyadh" />
              <Field code="JFK" label="To" value="New York" shown={toCode} />
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1 }}><Field label="Depart" value="Fri, 12 Dec" /></div>
                <div style={{ flex: 1 }}><Field label="Travellers" value="1 adult" /></div>
              </div>
            </div>
            <div style={{ marginTop: 34, padding: '28px 30px', borderRadius: 28, border: `3px solid ${P.accent}`, opacity: row, transform: `translateY(${(1 - row) * 40}px)` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FACE, fontWeight: 700, fontSize: 40, color: P.ink }}>
                <span>23:40 → 06:15</span>
                <span>SAR 3,840</span>
              </div>
              <div style={{ fontFamily: FACE, fontWeight: 600, fontSize: 28, color: P.mute, marginTop: 8 }}>AE 021 · Nonstop · 13h 35m</div>
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 16, opacity: prog(f, a + 42, a + 56, E.settleOut), transform: `translateY(${(1 - prog(f, a + 42, a + 56, E.settleOut)) * 40}px)` }}>
              <div style={{ flex: 1 }}><Field label="Seat" value="14A · Window" /></div>
              <div style={{ flex: 1 }}><Field label="Total" value="SAR 3,840" /></div>
            </div>
            <div
              style={{
                position: 'absolute', left: 48, right: 48, top: btnY, height: 132, borderRadius: 66,
                background: P.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
                transform: `scale(${1 - press * 0.05})`, boxShadow: `0 0 ${40 + done * 60}px rgba(47,124,246,${0.25 + done * 0.35})`,
              }}
            >
              {done > 0.02 && (
                <svg width={48} height={48} viewBox="0 0 24 24" style={{ opacity: done }}>
                  <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={22} strokeDashoffset={22 * (1 - done)} />
                </svg>
              )}
              <span style={{ fontFamily: FACE, fontWeight: 740, fontSize: 46, color: '#fff' }}>{done > 0.5 ? 'Booked' : 'Book now'}</span>
            </div>
            {/* the pointer: a fingertip that presses */}
            <div
              style={{
                position: 'absolute', width: 86, height: 86, borderRadius: 43,
                left: mix(600, 330, ptr), top: mix(1560, btnY + 26, ptr),
                background: 'rgba(255,255,255,0.55)', border: '3px solid rgba(10,20,38,0.35)',
                transform: `scale(${1 - press * 0.22})`, opacity: prog(f, a + 46, a + 54) * (1 - prog(f, a + 90, a + 100)),
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- scene 3: the tickets land */

const Barcode: React.FC<{ seed: number; w: number; h: number }> = ({ seed, w, h }) => {
  const r = rand(seed);
  const bars: React.ReactNode[] = [];
  let x = 0;
  while (x < w) {
    const bw = 2 + Math.floor(r() * 6);
    if (r() > 0.4) bars.push(<rect key={x} x={x} y={0} width={bw} height={h} fill={P.ink} />);
    x += bw + 2;
  }
  return <svg width={w} height={h}>{bars}</svg>;
};

const Pass: React.FC<{ from: [string, string]; to: [string, string]; date: string; board: string; seat: string; gate: string; seed: number }> = ({ from, to, date, board, seat, gate, seed }) => {
  const cell = (k: string, v: string) => (
    <div>
      <div style={{ fontFamily: FACE, fontWeight: 600, fontSize: 24, color: P.mute, letterSpacing: '0.06em' }}>{k}</div>
      <div style={{ fontFamily: FACE, fontWeight: 740, fontSize: 40, color: P.ink }}>{v}</div>
    </div>
  );
  return (
    <div style={{ width: 860, borderRadius: 44, background: P.card, overflow: 'hidden', boxShadow: '0 50px 120px rgba(0,0,0,0.5)' }}>
      <div style={{ background: P.accent, padding: '30px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Mark size={44} color="#fff" />
          <span style={{ fontFamily: FACE, fontWeight: 760, fontSize: 40, color: '#fff' }}>Aerlo</span>
        </div>
        <span style={{ fontFamily: FACE, fontWeight: 700, fontSize: 28, color: '#fff', letterSpacing: '0.1em' }}>BOARDING PASS</span>
      </div>
      <div style={{ padding: '40px 48px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: FACE, fontWeight: 780, fontSize: 112, color: P.ink, letterSpacing: '-0.04em', lineHeight: 1 }}>{from[0]}</div>
          <div style={{ fontFamily: FACE, fontWeight: 600, fontSize: 30, color: P.mute }}>{from[1]}</div>
        </div>
        <Plane size={70} color={P.accent} />
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: FACE, fontWeight: 780, fontSize: 112, color: P.ink, letterSpacing: '-0.04em', lineHeight: 1 }}>{to[0]}</div>
          <div style={{ fontFamily: FACE, fontWeight: 600, fontSize: 30, color: P.mute }}>{to[1]}</div>
        </div>
      </div>
      <div style={{ padding: '0 48px 34px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {cell('FLIGHT', seed === 1 ? 'AE 021' : 'AE 022')}
        {cell('DATE', date)}
        {cell('BOARDING', board)}
        {cell('SEAT', seat)}
      </div>
      <div style={{ padding: '0 48px 34px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {cell('PASSENGER', 'Omar K.')}
        <div />
        {cell('GATE', gate)}
        {cell('CLASS', 'Economy')}
      </div>
      <div style={{ borderTop: `3px dashed ${P.line}`, margin: '0 30px' }} />
      <div style={{ padding: '30px 48px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Barcode seed={seed * 97} w={560} h={96} />
        <span style={{ fontFamily: MONO, fontSize: 28, color: P.mute }}>{seed === 1 ? '0742 1180' : '0742 1181'}</span>
      </div>
    </div>
  );
};

const Tickets: React.FC = () => {
  const f = useCurrentFrame();
  const a = S.ticket;
  const t1 = prog(f, a, a + 22, E.glideOut);
  const t2 = prog(f, a + 22, a + 42, E.settleOut);
  const push = prog(f, a, S.nyc, E.softOut);
  const exit = prog(f, S.nyc - 16, S.nyc, E.launchIn);
  return (
    <AbsoluteFill>
      <Ground t={1 - push * 0.6} />
      <Line parts={['Your tickets,', 'ready.']} at={a + 30} out={S.nyc - 14} y={0.2} size={118} accent={1} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `translateY(170px) scale(${mix(1, 1.06, push) * mix(1, 3.2, exit)})`, filter: `blur(${exit * 22}px)`, opacity: 1 - exit * 0.4 }}>
        {/* the return pass, behind */}
        <div style={{ position: 'absolute', transform: `translateY(${mix(0, 150, t2)}px) scale(${mix(0.9, 0.94, t2)})`, opacity: t2 * 0.95, filter: `brightness(${mix(0.6, 0.82, t2)})` }}>
          <Pass from={['JFK', 'New York']} to={['RUH', 'Riyadh']} date="20 DEC" board="21:05" seat="31C" gate="T1 · 4" seed={2} />
        </div>
        {/* the outbound pass, out of the Booked button */}
        <div style={{ position: 'relative', transform: `translateY(${mix(-380, mix(0, -60, t2), t1)}px) scale(${mix(0.55, 1, t1)})`, opacity: t1, filter: `blur(${(1 - t1) * 16}px)` }}>
          <Pass from={['RUH', 'Riyadh']} to={['JFK', 'New York']} date="12 DEC" board="23:10" seat="14A" gate="B7" seed={1} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- the mark and the end card */

/** Aerlo's mark: a flight arc lifting off a ground line, ending in the destination dot. */
const Mark: React.FC<{ size: number; color: string; draw?: number }> = ({ size, color, draw = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <path d="M8 50 C 20 50, 30 14, 52 14" fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" strokeDasharray={70} strokeDashoffset={70 * (1 - draw)} />
    <circle cx={52} cy={14} r={7.5 * Math.min(1, draw * 1.4)} fill={color} />
    <path d="M8 50 H 34" fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" opacity={0.45} strokeDasharray={26} strokeDashoffset={26 * (1 - draw)} />
  </svg>
);

const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const a = S.end;
  const inn = prog(f, a, a + 14, E.softOut);
  const draw = prog(f, a + 2, a + 22, E.glideOut);
  const word = prog(f, a + 10, a + 26, E.snapOut);
  const close = prog(f, a + 20, a + 34, E.snapOut);
  const creep = mix(1, 1.045, prog(f, a, TRIP.total, E.softOut));
  return (
    <AbsoluteFill style={{ opacity: inn }}>
      <Ground t={0.5} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `scale(${creep})` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 30, transform: 'translateY(-30px)' }}>
          <Mark size={170} color={P.sky} draw={draw} />
          <div style={{ fontFamily: FACE, fontWeight: 760, fontSize: 210, color: '#fff', letterSpacing: '-0.05em', opacity: word, filter: `blur(${(1 - word) * 14}px)`, transform: `translateX(${(1 - word) * -30}px)` }}>Aerlo</div>
        </div>
        <div style={{ fontFamily: FACE, fontWeight: 600, fontSize: 52, color: 'rgba(255,255,255,0.78)', marginTop: 24, opacity: close, transform: `translateY(${(1 - close) * 20}px)` }}>Book in the Aerlo app</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- the film */

export const Trip: React.FC = () => {
  const f = useCurrentFrame();
  // seam 1: the man's shot zooms into his phone and blurs; the phone lands out of that blur
  const zoom1 = prog(f, S.phone - 16, S.phone, E.launchIn);
  // seam 4: Times Square whips up; the arrival shot comes in under the blur
  const whip = prog(f, S.arrive - 8, S.arrive, E.launchIn);
  const whipIn = 1 - prog(f, S.arrive, S.arrive + 10, E.snapOut);
  // seam 5: the arrival shot defocuses and darkens into the end card's ground
  const out5 = prog(f, S.end - 12, S.end + 6, E.softIn);
  // seam 3: the ticket blur gives way to Times Square, which comes out of the same blur
  const nycIn = 1 - prog(f, S.nyc, S.nyc + 14, E.glideOut);
  const on = (a: number, b: number) => f >= a && f < b;
  return (
    <FontGate>
      <AbsoluteFill style={{ background: P.ground }}>
        <Sequence durationInFrames={S.phone}>
          <AbsoluteFill style={{ transform: `scale(${mix(1, 2.4, zoom1)})`, transformOrigin: '50% 66%', filter: `blur(${zoom1 * 24}px)` }}>
            <Clip src="assets/book.mp4" from={0} dur={S.phone} focusX={0.5} z0={1.04} z1={1.12} dim={0.38} />
          </AbsoluteFill>
        </Sequence>
        {on(0, S.phone) && <Line parts={['Book your flight', 'in one tap.']} at={BAR[0]} out={S.phone - 16} y={0.42} accent={1} />}
        {on(S.phone, S.ticket) && <Booking />}
        {on(S.ticket, S.nyc) && <Tickets />}
        <Sequence from={S.nyc} durationInFrames={S.arrive - S.nyc}>
          <AbsoluteFill style={{ filter: `blur(${nycIn * 22 + whip * 20}px)`, transform: `translateY(${-whip * 380}px)` }}>
            <Clip src="assets/nyc.mp4" from={0} dur={S.arrive - S.nyc} focusX={0.5} z0={1.14} z1={1.04} dim={0.55} />
          </AbsoluteFill>
        </Sequence>
        {on(S.nyc, S.arrive) && <Line parts={['Hello,', 'New York.']} at={S.nyc + 8} out={S.arrive - 10} y={0.5} size={150} accent={1} />}
        <Sequence from={S.arrive} durationInFrames={S.end - S.arrive + 8}>
          <AbsoluteFill style={{ filter: `blur(${whipIn * 20 + out5 * 26}px) brightness(${1 - out5 * 0.5})`, transform: `translateY(${whipIn * 380}px)` }}>
            <Clip src="assets/arrive.mp4" from={0} dur={S.end - S.arrive} focusX={0.48} z0={1.0} z1={1.1} dim={0.2} />
          </AbsoluteFill>
        </Sequence>
        {f >= S.end && <EndCard />}
        <Audio src={staticFile('audio/trip.wav')} />
      </AbsoluteFill>
    </FontGate>
  );
};
