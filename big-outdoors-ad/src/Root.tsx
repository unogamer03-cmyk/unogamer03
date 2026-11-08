import {Composition} from 'remotion';
import {Commercial} from './Commercial';
import {DURATION, FPS} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="BigOutdoorsCommercial"
    component={Commercial}
    durationInFrames={DURATION}
    fps={FPS}
    width={1920}
    height={1080}
    defaultProps={{withVoiceover: false}}
  />
);
