import {AbsoluteFill, Sequence} from 'remotion';
import {AISelvesShot1} from './AISelvesShot1';
import {AISelvesShot2} from './AISelvesShot2';
import {AISelvesShot3} from './AISelvesShot3';
import {AISelvesShot4} from './AISelvesShot4';
import {AISelvesShot5} from './AISelvesShot5';
import {AISelvesShot6} from './AISelvesShot6';
import {AISelvesShot7} from './AISelvesShot7';
import {AISelvesShot8} from './AISelvesShot8';
import {AISelvesShot9} from './AISelvesShot9';

// Complete AI Selves Marketing Video
// All 9 shots sequenced together

// Shot durations (in frames at 24fps)
const SHOTS = [
  { component: AISelvesShot1, duration: 248 },  // Shot 1: Task drops ~10s
  { component: AISelvesShot2, duration: 192 },  // Shot 2: Raccoon 2.0's pitch ~8s
  { component: AISelvesShot3, duration: 288 },  // Shot 3: Ryan + Jessie ~12s
  { component: AISelvesShot4, duration: 168 },  // Shot 4: Nyx selfie ~7s
  { component: AISelvesShot5, duration: 48 },   // Shot 5: Overnight ~2s
  { component: AISelvesShot6, duration: 240 },  // Shot 6: Anthony's report ~10s
  { component: AISelvesShot7, duration: 192 },  // Shot 7: Semi summarizes ~8s
  { component: AISelvesShot8, duration: 168 },  // Shot 8: Deadline bomb ~7s
  { component: AISelvesShot9, duration: 72 },   // Shot 9: End card ~3s
];

// Total duration: 1616 frames = ~67s
export const TOTAL_DURATION = SHOTS.reduce((sum, shot) => sum + shot.duration, 0);

export const AISelvesComplete: React.FC = () => {
  let startFrame = 0;
  
  return (
    <AbsoluteFill>
      {SHOTS.map((shot, index) => {
        const Component = shot.component;
        const from = startFrame;
        startFrame += shot.duration;
        
        return (
          <Sequence key={index} from={from} durationInFrames={shot.duration}>
            <Component />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
