import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Sequence,
  Video,
  Img,
  staticFile,
  Audio,
  Easing,
} from 'remotion';

// Clean minimal palette
const colors = {
  void: '#0a0a0a',
  dark: '#111111',
  text: '#f5f5f5',
  accent: '#a78bfa',
  dim: '#666666',
  cream: '#FFFEF0',
};

// Bullet time easing
const bulletTime = Easing.bezier(0.4, 0, 0.2, 1);

// Font faces
const fontFaces = `
  @font-face {
    font-family: 'Space Grotesk';
    src: url('https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj7aUXskPMBBSSJLm2E.woff2') format('woff2');
    font-weight: 500;
  }
  @font-face {
    font-family: 'Space Grotesk';
    src: url('https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj62UXskPMBBSSJLm2E.woff2') format('woff2');
    font-weight: 700;
  }
  @font-face {
    font-family: 'Space Mono';
    src: url('https://fonts.gstatic.com/s/spacemono/v13/i7dPIFZifjKcF5UAWdDRYEF8RQ.woff2') format('woff2');
    font-weight: 400;
  }
`;

// Subtle scan lines overlay
const ScanLines: React.FC = () => (
  <AbsoluteFill style={{
    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
    pointerEvents: 'none',
    opacity: 0.3,
  }} />
);

// Scene 1: Dolly shot of computer room (7s)
const DollyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 168], [1, 1.02], {extrapolateRight: 'clamp'});
  
  return (
    <AbsoluteFill style={{
      background: colors.void,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    }}>
      <Video
        src={staticFile('videos/room-front-v7.mp4')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale})`,
        }}
        muted
      />
      <ScanLines />
    </AbsoluteFill>
  );
};

// Scene 2: Clean reveal with just image, name, role (5s)
const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  
  // White flash at start
  const flashOpacity = interpolate(frame, [0, 6], [1, 0], {extrapolateRight: 'clamp'});
  
  // Image animation
  const imgOpacity = interpolate(frame, [4, 20], [0, 1], {extrapolateRight: 'clamp'});
  const imgScale = bulletTime(interpolate(frame, [4, 28], [0.85, 1], {extrapolateRight: 'clamp'}));
  const imgY = bulletTime(interpolate(frame, [4, 28], [40, 0], {extrapolateRight: 'clamp'}));
  
  // Text animations
  const nameOpacity = interpolate(frame, [32, 52], [0, 1], {extrapolateRight: 'clamp'});
  const nameY = bulletTime(interpolate(frame, [32, 52], [25, 0], {extrapolateRight: 'clamp'}));
  const roleOpacity = interpolate(frame, [56, 72], [0, 1], {extrapolateRight: 'clamp'});
  
  return (
    <AbsoluteFill style={{
      background: colors.void,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      gap: 28,
    }}>
      <style>{fontFaces}</style>
      
      {/* Flash overlay */}
      <AbsoluteFill style={{
        backgroundColor: colors.cream,
        opacity: flashOpacity,
        zIndex: 10,
      }} />
      
      {/* Soft glow */}
      <div style={{
        position: 'absolute',
        width: 700,
        height: 700,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.accent}25 0%, transparent 60%)`,
        filter: 'blur(100px)',
        opacity: imgOpacity * 0.8,
      }} />
      
      {/* Mochi image - larger */}
      <div style={{
        opacity: imgOpacity,
        transform: `scale(${imgScale}) translateY(${imgY}px)`,
      }}>
        <Img
          src={staticFile('images/mochi.png')}
          style={{
            height: 580,
            width: 'auto',
            filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.5))',
          }}
        />
      </div>
      
      {/* Name - bigger, bolder */}
      <div style={{
        fontFamily: "'Space Grotesk'",
        fontSize: 110,
        fontWeight: 700,
        color: colors.text,
        letterSpacing: 8,
        opacity: nameOpacity,
        transform: `translateY(${nameY}px)`,
        textShadow: `0 0 80px ${colors.accent}50`,
      }}>
        MOCHI
      </div>
      
      {/* Role */}
      <div style={{
        fontFamily: "'Space Mono'",
        fontSize: 20,
        color: colors.accent,
        letterSpacing: 8,
        textTransform: 'uppercase',
        opacity: roleOpacity,
      }}>
        Motion Designer × Animator
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Pika end card (2s)
const PikaEndScene: React.FC = () => {
  const frame = useCurrentFrame();
  
  const opacity = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: 'clamp'});
  const scale = bulletTime(interpolate(frame, [0, 12], [1.05, 1], {extrapolateRight: 'clamp'}));
  
  return (
    <AbsoluteFill style={{
      background: colors.void,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        opacity,
        transform: `scale(${scale})`,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Img
          src={staticFile('images/pika-logo.png')}
          style={{width: '100%', height: '100%', objectFit: 'contain'}}
        />
      </div>
    </AbsoluteFill>
  );
};

// Main composition - CLEAN 14s at 24fps = 336 frames
// 7s dolly + 5s reveal + 2s pika = 14s (no stats)
export const MochiCelebrationClean: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: colors.void}}>
      {/* Vinyl crackle ambient throughout */}
      <Sequence from={0} durationInFrames={336}>
        <Audio src={staticFile('audio/vinyl-crackle.mp3')} volume={0.15} />
      </Sequence>
      
      {/* Scene 1: Dolly shot (168 frames / 7s) */}
      <Sequence from={0} durationInFrames={168}>
        <DollyScene />
      </Sequence>
      
      {/* Loading hum during dolly */}
      <Sequence from={36} durationInFrames={132}>
        <Audio src={staticFile('audio/loading-hum.mp3')} volume={0.3} />
      </Sequence>
      
      {/* Scene 2: Mochi reveal (120 frames / 5s) */}
      <Sequence from={168} durationInFrames={120}>
        <RevealScene />
      </Sequence>
      
      {/* Tadaaa on reveal */}
      <Sequence from={168}>
        <Audio src={staticFile('audio/tadaaa-final.mp3')} volume={0.9} />
      </Sequence>
      
      {/* Meow shortly after */}
      <Sequence from={190}>
        <Audio src={staticFile('audio/meow.mp3')} volume={0.7} />
      </Sequence>
      
      {/* Scene 3: Pika end card (48 frames / 2s) */}
      <Sequence from={288} durationInFrames={48}>
        <PikaEndScene />
      </Sequence>
      
      {/* Pika end card SFX */}
      <Sequence from={288}>
        <Audio src={staticFile('audio/pika-end.wav')} volume={0.8} />
      </Sequence>
    </AbsoluteFill>
  );
};
