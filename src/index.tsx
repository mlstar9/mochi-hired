import {Composition, registerRoot} from 'remotion';
import {MochiHired} from './MochiHired';
import {MochiHiredV2} from './MochiHiredV2';
import {MochiCelebration} from './MochiCelebration';
import {MochiCelebrationV3} from './MochiCelebrationV3';
import {MochiCelebrationV4} from './MochiCelebrationV4';
import {MochiCelebrationV5} from './MochiCelebrationV5';
import {MochiCelebrationAlt} from './MochiCelebrationAlt';
import {MochiCelebrationClean} from './MochiCelebrationClean';
import {MochiHiredFinal} from './MochiHiredFinal';
import {SlackMockup} from './SlackMockup';
import {PikaAISelfDemo} from './PikaAISelfDemo';

const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MochiHired"
        component={MochiHired}
        durationInFrames={432} // 18s at 24fps
        fps={24}
        width={1920}
        height={1080}
      />
      <Composition
        id="MochiHiredV2"
        component={MochiHiredV2}
        durationInFrames={360} // 15s at 24fps
        fps={24}
        width={1920}
        height={1080}
      />
      <Composition
        id="MochiCelebration"
        component={MochiCelebration}
        durationInFrames={384} // 16s at 24fps
        fps={24}
        width={1920}
        height={1080}
      />
      <Composition
        id="MochiCelebrationV3"
        component={MochiCelebrationV3}
        durationInFrames={384} // 16s at 24fps
        fps={24}
        width={1920}
        height={1080}
      />
      <Composition
        id="MochiCelebrationV4"
        component={MochiCelebrationV4}
        durationInFrames={336} // 14s at 24fps (tighter edit)
        fps={24}
        width={1920}
        height={1080}
      />
      <Composition
        id="MochiCelebrationV5"
        component={MochiCelebrationV5}
        durationInFrames={384} // 16s at 24fps (polished)
        fps={24}
        width={1920}
        height={1080}
      />
      <Composition
        id="MochiCelebrationAlt"
        component={MochiCelebrationAlt}
        durationInFrames={384} // 16s at 24fps (video reveal version)
        fps={24}
        width={1920}
        height={1080}
      />
      <Composition
        id="MochiCelebrationClean"
        component={MochiCelebrationClean}
        durationInFrames={336} // 14s at 24fps (no stats, clean edit)
        fps={24}
        width={1920}
        height={1080}
      />
      <Composition
        id="MochiHiredFinal"
        component={MochiHiredFinal}
        durationInFrames={504} // 21s at 24fps (8s dolly + 0.5s glitch + 10s mochi + 0.5s glitch + 2s pika)
        fps={24}
        width={1920}
        height={1080}
      />
      <Composition
        id="SlackMockup"
        component={SlackMockup}
        durationInFrames={240} // 10s at 24fps
        fps={24}
        width={1920}
        height={1080}
      />
      <Composition
        id="PikaAISelfDemo"
        component={PikaAISelfDemo}
        durationInFrames={646} // ~27s at 24fps (0.6s buffer + reading time)
        fps={24}
        width={1920}
        height={1080}
      />
    </>
  );
};

registerRoot(RemotionRoot);
