import {AbsoluteFill, Img, interpolate, useCurrentFrame, Sequence, staticFile, Easing, Video, Audio} from 'remotion';

// Pika Cyberpop Style Preset
const colors = {
  lavender: '#C4B5FD',
  lavenderDark: '#A78BFA',
  cream: '#FFFEF0',
  black: '#111111',
  white: '#FFFFFF',
  lavenderLight: '#DDD6FE',
};

const telkaBlack = staticFile('fonts/Telka-Extended-Black.woff2');
const spaceMono = staticFile('fonts/SpaceMono-Regular.ttf');

const fontFaces = `
  @font-face {
    font-family: 'Telka Extended';
    src: url('${telkaBlack}') format('woff2');
    font-weight: 900;
  }
  @font-face {
    font-family: 'Space Mono';
    src: url('${spaceMono}') format('truetype');
    font-weight: 400;
  }
`;

const bulletTime = Easing.bezier(0.4, 0, 0.2, 1);

// Scan lines
const ScanLines: React.FC = () => (
  <AbsoluteFill style={{
    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(196,181,253,0.03) 2px, rgba(196,181,253,0.03) 4px)',
    pointerEvents: 'none',
  }} />
);

// Diamond
const Diamond: React.FC<{x: number; y: number; size: number; opacity?: number}> = ({x, y, size, opacity = 0.6}) => (
  <div style={{
    position: 'absolute',
    left: x,
    top: y,
    width: size,
    height: size,
    border: `1px solid ${colors.lavender}`,
    transform: 'rotate(45deg)',
    opacity,
  }} />
);

// Typewriter text component
const TypewriterText: React.FC<{text: string; startFrame: number; color: string}> = ({text, startFrame, color}) => {
  const frame = useCurrentFrame();
  const charsToShow = Math.floor((frame - startFrame) * 1.5);
  const displayText = text.substring(0, Math.max(0, charsToShow));
  const showCursor = frame >= startFrame && (frame - startFrame) % 8 < 4;
  
  return (
    <div style={{fontFamily: "'Space Mono'", fontSize: 26, color}}>
      {'>'} {displayText}{showCursor && charsToShow < text.length ? '█' : ''}
    </div>
  );
};

// Scene 1: Terminal init with typewriter effect
const TerminalLoadScene: React.FC = () => {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill style={{backgroundColor: colors.black}}>
      <style>{fontFaces}</style>
      
      <AbsoluteFill style={{
        padding: 120,
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 24,
      }}>
        <TypewriterText text="$ pika --hire new_talent" startFrame={0} color={colors.lavender} />
        {frame >= 25 && <TypewriterText text="searching database..." startFrame={25} color={colors.lavenderLight} />}
        {frame >= 50 && <TypewriterText text="MATCH FOUND: mochi.exe ✓" startFrame={50} color={colors.cream} />}
      </AbsoluteFill>
      
      <ScanLines />
    </AbsoluteFill>
  );
};

// Scene 2: Loading bar with glow effect
const LoadingBarScene: React.FC = () => {
  const frame = useCurrentFrame();
  // Apply easing to normalized 0-1 value, then scale to 0-100
  const progressNormalized = interpolate(frame, [0, 42], [0, 1], {extrapolateRight: 'clamp'});
  const progress = bulletTime(progressNormalized) * 100;
  const showComplete = frame >= 44;
  const flash = frame >= 44 && frame < 47 ? 1 : 0;
  
  return (
    <AbsoluteFill style={{
      background: flash ? colors.lavender : `linear-gradient(180deg, ${colors.black} 0%, #1a1a2e 100%)`,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      gap: 30,
    }}>
      <style>{fontFaces}</style>
      
      <div style={{
        fontFamily: "'Telka Extended'",
        fontSize: showComplete ? 56 : 44,
        color: colors.cream,
        letterSpacing: 2,
        textShadow: showComplete ? `0 0 30px ${colors.lavender}` : 'none',
      }}>
        {showComplete ? 'MOCHI.EXE LOADED' : 'LOADING MOCHI.EXE'}
      </div>
      
      <div style={{
        width: 500,
        height: 10,
        backgroundColor: 'rgba(196,181,253,0.15)',
        borderRadius: 5,
        overflow: 'hidden',
        boxShadow: `0 0 20px ${colors.lavender}30`,
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: `linear-gradient(90deg, ${colors.lavenderDark} 0%, ${colors.lavender} 50%, ${colors.lavenderLight} 100%)`,
          borderRadius: 5,
          boxShadow: `0 0 15px ${colors.lavender}`,
        }} />
      </div>
      
      <div style={{
        fontFamily: "'Space Mono'",
        fontSize: 22,
        color: colors.lavenderLight,
        letterSpacing: 6,
      }}>
        {showComplete ? '100% COMPLETE' : `${Math.floor(progress).toString().padStart(2, '0')}%`}
      </div>
      
      <ScanLines />
    </AbsoluteFill>
  );
};

// Scene 3: Clean video reveal - hard cut, no fade
const GlitchRevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = frame < 2 ? 1 : 0; // Brief white flash on cut
  const scale = bulletTime(interpolate(frame, [0, 8], [1.02, 1], {extrapolateRight: 'clamp'}));
  
  return (
    <AbsoluteFill style={{
      background: flash ? colors.cream : `linear-gradient(180deg, ${colors.lavender} 0%, ${colors.cream} 100%)`,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    }}>
      <style>{fontFaces}</style>
      
      <div style={{
        transform: `scale(${scale})`,
        boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
      }}>
        <Video
          src={staticFile('videos/mochi-working.mp4')}
          style={{width: 550, height: 'auto'}}
          muted
        />
      </div>
      
    </AbsoluteFill>
  );
};

// Scene 4: Stats card - hard cuts, no fade
const StatsCardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cardScale = bulletTime(interpolate(frame, [0, 6], [1.05, 1], {extrapolateRight: 'clamp'}));
  const nameProgress = bulletTime(interpolate(frame, [3, 10], [0, 1], {extrapolateRight: 'clamp'}));
  const lineWidth = interpolate(nameProgress, [0, 1], [0, 280]);
  
  // Hard cuts for stats - they just appear
  const stat1Show = frame >= 15;
  const stat2Show = frame >= 20;
  const stat3Show = frame >= 25;
  
  const flash = frame < 2 ? 1 : 0;
  
  return (
    <AbsoluteFill style={{
      backgroundColor: flash ? colors.lavender : colors.black,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <style>{fontFaces}</style>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 28,
        transform: `scale(${cardScale})`,
      }}>
        <div style={{
          fontFamily: "'Telka Extended'",
          fontSize: 160,
          color: colors.cream,
          letterSpacing: -6,
          opacity: nameProgress,
          textShadow: `0 0 40px ${colors.lavender}50`,
        }}>
          MOCHI
        </div>
        
        <div style={{
          width: lineWidth,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${colors.lavender}, transparent)`,
        }} />
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          alignItems: 'center',
        }}>
          {stat1Show && <div style={{fontFamily: "'Space Mono'", fontSize: 22, color: colors.lavenderLight}}>
            ROLE: <span style={{color: colors.cream}}>Animator</span>
          </div>}
          {stat2Show && <div style={{fontFamily: "'Space Mono'", fontSize: 22, color: colors.lavenderLight}}>
            SPECIES: <span style={{color: colors.cream}}>British Shorthair</span>
          </div>}
          {stat3Show && <div style={{fontFamily: "'Space Mono'", fontSize: 22, color: colors.lavenderLight}}>
            STATUS: <span style={{color: colors.lavender}}>READY TO CREATE ✨</span>
          </div>}
        </div>
      </div>
      
      <ScanLines />
    </AbsoluteFill>
  );
};

// Scene 5: LET'S COOK - hard cut
const LetsCookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = frame < 2 ? 1 : 0;
  const scale = bulletTime(interpolate(frame, [0, 6], [1.02, 1], {extrapolateRight: 'clamp'}));
  
  return (
    <AbsoluteFill style={{
      backgroundColor: flash ? colors.lavender : colors.black,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      gap: 20,
    }}>
      <style>{fontFaces}</style>
      <div style={{transform: `scale(${scale})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
        <div style={{fontSize: 80}}>🎬</div>
        <div style={{
          fontFamily: "'Telka Extended'",
          fontSize: 120,
          color: colors.cream,
          letterSpacing: -4,
        }}>
          LET'S COOK
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 6: Pika End Card
const PikaEndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = frame < 2 ? 1 : 0;
  const scale = bulletTime(interpolate(frame, [0, 6], [1.02, 1], {extrapolateRight: 'clamp'}));
  
  return (
    <AbsoluteFill style={{
      backgroundColor: flash ? colors.lavender : colors.black,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{transform: `scale(${scale})`}}>
        <Img
          src={staticFile('images/pika-logo.png')}
          style={{width: '100%', height: 'auto'}}
        />
      </div>
    </AbsoluteFill>
  );
};

// Main composition - extended timing
export const MochiHired: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Terminal init - 84 frames (3.5s) */}
      <Sequence from={0} durationInFrames={84}>
        <TerminalLoadScene />
      </Sequence>
      
      {/* Typing SFX synced to each line */}
      {/* Line 1: "$ pika --hire new_talent" */}
      <Sequence from={0} durationInFrames={24}>
        <Audio src={staticFile('audio/typing-line1.mp3')} volume={0.8} />
      </Sequence>
      {/* Line 2: "searching database..." */}
      <Sequence from={25} durationInFrames={24}>
        <Audio src={staticFile('audio/typing-line2.mp3')} volume={0.8} />
      </Sequence>
      {/* Line 3: "MATCH FOUND: mochi.exe ✓" */}
      <Sequence from={50} durationInFrames={20}>
        <Audio src={staticFile('audio/typing-line3.mp3')} volume={0.8} />
      </Sequence>
      
      {/* Vinyl crackle ambience throughout */}
      <Sequence from={0} durationInFrames={432}>
        <Audio src={staticFile('audio/vinyl-crackle.mp3')} volume={0.25} />
      </Sequence>
      
      {/* Loading bar - 84 frames (3.5s) */}
      <Sequence from={84} durationInFrames={84}>
        <LoadingBarScene />
      </Sequence>
      
      {/* Loading hum during loading bar */}
      <Sequence from={84} durationInFrames={44}>
        <Audio src={staticFile('audio/riser-synth.mp3')} volume={1} />
      </Sequence>
      
      {/* Ding when "MOCHI.EXE LOADED" appears (frame 84 + 44 = 128) */}
      <Sequence from={128}>
        <Audio src={staticFile('audio/ding.mp3')} volume={0.9} />
      </Sequence>
      
      {/* Bass drop on transition to video */}
      <Sequence from={168}>
        <Audio src={staticFile('audio/bass-drop.mp3')} volume={1} />
      </Sequence>
      
      {/* Tadaaa jingle on video reveal */}
      <Sequence from={168}>
        <Audio src={staticFile('audio/tadaaa-final.mp3')} volume={1} />
      </Sequence>
      
      {/* Glitch reveal - 84 frames (3.5s) */}
      <Sequence from={168} durationInFrames={84}>
        <GlitchRevealScene />
      </Sequence>
      
      {/* Meow when video appears */}
      <Sequence from={174}>
        <Audio src={staticFile('audio/meow.mp3')} volume={0.8} />
      </Sequence>
      
      {/* Whoosh on stats card transition */}
      <Sequence from={252}>
        <Audio src={staticFile('audio/whoosh.mp3')} volume={0.8} />
      </Sequence>
      
      {/* Stats card - 84 frames (3.5s) */}
      <Sequence from={252} durationInFrames={84}>
        <StatsCardScene />
      </Sequence>
      
      {/* Ping sounds for stats (252 + 15/20/25 frames) */}
      <Sequence from={267}>
        <Audio src={staticFile('audio/ping1.wav')} volume={0.9} />
      </Sequence>
      <Sequence from={272}>
        <Audio src={staticFile('audio/ping2.wav')} volume={0.9} />
      </Sequence>
      <Sequence from={277}>
        <Audio src={staticFile('audio/ping3.wav')} volume={0.9} />
      </Sequence>
      
      {/* LET'S COOK scene - 48 frames (2s) */}
      <Sequence from={336} durationInFrames={48}>
        <LetsCookScene />
      </Sequence>
      
      {/* Pika end card SFX - ALWAYS use this for Pika end cards */}
      <Sequence from={384}>
        <Audio src={staticFile('audio/pika-end.wav')} volume={0.9} />
      </Sequence>
      
      {/* Pika End card - 48 frames (2s) */}
      <Sequence from={384} durationInFrames={48}>
        <PikaEndCard />
      </Sequence>
    </AbsoluteFill>
  );
};
