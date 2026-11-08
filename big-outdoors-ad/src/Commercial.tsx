import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, interpolate, useCurrentFrame} from 'remotion';
import {S1, S2, S3, S4, DURATION, FPS, VO_CUES} from './theme';
import {CinematicGrade, GoldFlash, clamp} from './components/Common';
import {Scene1Delay} from './scenes/Scene1Delay';
import {Scene2Chicago} from './scenes/Scene2Chicago';
import {Scene3Route} from './scenes/Scene3Route';
import {Scene4Reveal} from './scenes/Scene4Reveal';

// Music level: 1.0 normally, dipping to 0.42 while the narrator speaks.
const musicDuck = (f: number) => {
  const t = f / FPS;
  let g = 1;
  for (const c of VO_CUES) {
    const a = c.at - 0.12;
    const b = c.at + c.dur + 0.15;
    const ramp = 0.15;
    let d = 0;
    if (t >= a && t <= b) d = 1;
    else if (t > a - ramp && t < a) d = (t - (a - ramp)) / ramp;
    else if (t > b && t < b + ramp) d = 1 - (t - b) / ramp;
    g = Math.min(g, 1 - 0.58 * d);
  }
  return g;
};

export type CommercialProps = {withVoiceover: boolean};

export const Commercial: React.FC<CommercialProps> = ({withVoiceover}) => {
  const frame = useCurrentFrame();
  const fadeOut = interpolate(frame, [DURATION - 6, DURATION], [1, 0.0], clamp);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{opacity: fadeOut}}>
        <Sequence from={S1.from} durationInFrames={S1.dur + 2}>
          <Scene1Delay />
        </Sequence>
        <Sequence from={S2.from} durationInFrames={S2.dur + 2}>
          <Scene2Chicago />
        </Sequence>
        <Sequence from={S3.from} durationInFrames={S3.dur + 2}>
          <Scene3Route />
        </Sequence>
        <Sequence from={S4.from} durationInFrames={S4.dur}>
          <Scene4Reveal />
        </Sequence>
        <GoldFlash at={S2.from} />
        <GoldFlash at={S3.from} />
        <CinematicGrade />
      </AbsoluteFill>

      {/* Music + sound design (scripts/make-audio.js), ducked under the voice-over */}
      <Audio src={staticFile('soundtrack.wav')} volume={(f) => (withVoiceover ? musicDuck(f) : 1)} />
      {withVoiceover &&
        VO_CUES.map((c) => (
          <Sequence key={c.file} from={Math.round(c.at * FPS)} durationInFrames={Math.ceil((c.dur + 0.2) * FPS)}>
            <Audio src={staticFile(c.file)} volume={1} />
          </Sequence>
        ))}
    </AbsoluteFill>
  );
};
