import {Composition, registerRoot} from 'remotion';
import {AISelvesComplete, TOTAL_DURATION} from './AISelvesComplete';
import {AISelvesShot1} from './AISelvesShot1';
import {AISelvesShot2} from './AISelvesShot2';
import {AISelvesShot3} from './AISelvesShot3';
import {AISelvesShot4} from './AISelvesShot4';
import {AISelvesShot5} from './AISelvesShot5';
import {AISelvesShot6} from './AISelvesShot6';
import {AISelvesShot7} from './AISelvesShot7';
import {AISelvesShot8} from './AISelvesShot8';
import {AISelvesShot9} from './AISelvesShot9';
import {Blank} from './Blank';
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
import {NyxLockScreen} from './NyxLockScreen';
import {LetiAISelvesVideo, LETI_VIDEO_DURATION} from './LetiAISelvesVideo';
import {LetiShot03Theo, THEO_DURATION} from './LetiShot03Theo';
import {BrianShot3iPhone} from './BrianShot3iPhone';
import {
  WorkflowAnthony,
  WorkflowStarry,
  WorkflowRus,
  WorkflowMatan,
  WorkflowMatanFloat,
  WorkflowMatanPFP,
  WorkflowDemi,
  WorkflowAnthonyStrips,
  WORKFLOW_DURATION,
} from './WorkflowPipelines';

const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AISelvesComplete"
        component={AISelvesComplete}
        durationInFrames={TOTAL_DURATION} // ~67s all shots
        fps={24}
        width={1920}
        height={1080}
      />
      <Composition
        id="AISelvesShot1"
        component={AISelvesShot1}
        durationInFrames={248} // ~10s shot 1
        fps={24}
        width={1920}
        height={1080}
      />
      <Composition
        id="AISelvesShot2"
        component={AISelvesShot2}
        durationInFrames={192} // ~8s Matan's pitch
        fps={24}
        width={1920}
        height={1080}
      />
      <Composition
        id="AISelvesShot3"
        component={AISelvesShot3}
        durationInFrames={288} // ~12s Ryan roasts + Jessie
        fps={24}
        width={1920}
        height={1080}
      />
      <Composition
        id="AISelvesShot4"
        component={AISelvesShot4}
        durationInFrames={168} // ~7s Nyx selfie + reactions
        fps={24}
        width={1920}
        height={1080}
      />
      <Composition
        id="AISelvesShot5"
        component={AISelvesShot5}
        durationInFrames={48} // ~2s overnight transition
        fps={24}
        width={1920}
        height={1080}
      />
      <Composition
        id="AISelvesShot6"
        component={AISelvesShot6}
        durationInFrames={240} // ~10s Anthony's report
        fps={24}
        width={1920}
        height={1080}
      />
      <Composition
        id="AISelvesShot7"
        component={AISelvesShot7}
        durationInFrames={192} // ~8s Semi summarizes
        fps={24}
        width={1920}
        height={1080}
      />
      <Composition
        id="AISelvesShot8"
        component={AISelvesShot8}
        durationInFrames={168} // ~7s Deadline bomb
        fps={24}
        width={1920}
        height={1080}
      />
      <Composition
        id="AISelvesShot9"
        component={AISelvesShot9}
        durationInFrames={72} // ~3s End card
        fps={24}
        width={1920}
        height={1080}
      />
      <Composition
        id="Blank"
        component={Blank}
        durationInFrames={240} // 10s at 24fps
        fps={24}
        width={1920}
        height={1080}
      />
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
      <Composition
        id="NyxLockScreen"
        component={NyxLockScreen}
        durationInFrames={360} // 15s at 24fps - nyx spam
        fps={24}
        width={1320}
        height={2868}
      />
      <Composition
        id="LetiShot03-Theo"
        component={LetiShot03Theo}
        durationInFrames={THEO_DURATION}
        fps={24}
        width={1920}
        height={1080}
      />
      <Composition
        id="LetiAISelvesVideo"
        component={LetiAISelvesVideo}
        durationInFrames={LETI_VIDEO_DURATION}
        fps={24}
        width={1080}
        height={1920}
      />
      <Composition
        id="BrianShot3iPhone"
        component={BrianShot3iPhone}
        durationInFrames={120} // 5s at 24fps
        fps={24}
        width={1920}
        height={1080}
      />
      <Composition
        id="WorkflowAnthony"
        component={WorkflowAnthony}
        durationInFrames={WORKFLOW_DURATION}
        fps={24}
        width={1440}
        height={1080}
      />
      <Composition
        id="WorkflowAnthonyStrips"
        component={WorkflowAnthonyStrips}
        durationInFrames={WORKFLOW_DURATION}
        fps={24}
        width={1440}
        height={1080}
      />
      <Composition
        id="WorkflowStarry"
        component={WorkflowStarry}
        durationInFrames={WORKFLOW_DURATION}
        fps={24}
        width={1440}
        height={1080}
      />
      <Composition
        id="WorkflowRus"
        component={WorkflowRus}
        durationInFrames={WORKFLOW_DURATION}
        fps={24}
        width={1440}
        height={1080}
      />
      <Composition
        id="WorkflowRusTransparent"
        component={() => <WorkflowRus transparent />}
        durationInFrames={WORKFLOW_DURATION}
        fps={24}
        width={1440}
        height={1080}
      />
      <Composition
        id="WorkflowMatan"
        component={WorkflowMatan}
        durationInFrames={WORKFLOW_DURATION}
        fps={24}
        width={1440}
        height={1080}
      />
      <Composition
        id="WorkflowMatanFloat"
        component={WorkflowMatanFloat}
        durationInFrames={WORKFLOW_DURATION}
        fps={24}
        width={1440}
        height={1080}
      />
      <Composition
        id="WorkflowMatanPFP"
        component={WorkflowMatanPFP}
        durationInFrames={WORKFLOW_DURATION}
        fps={24}
        width={1440}
        height={1080}
      />
      <Composition
        id="WorkflowDemi"
        component={WorkflowDemi}
        durationInFrames={WORKFLOW_DURATION + 48}
        fps={24}
        width={1440}
        height={1080}
      />
      <Composition
        id="WorkflowDemiTransparent"
        component={() => <WorkflowDemi transparent />}
        durationInFrames={WORKFLOW_DURATION + 48}
        fps={24}
        width={1440}
        height={1080}
      />
    </>
  );
};

registerRoot(RemotionRoot);
