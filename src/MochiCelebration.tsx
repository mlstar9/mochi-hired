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

// Scene 1: Dolly shot of computer room (8s)
// Video is 1280x720, we scale to fill 1920x1080
const DollyScene: React.FC = () => {
  const frame = useCurrentFrame();
  // Subtle zoom during the video
  const scale = interpolate(frame, [0, 192], [1, 1.02], {extrapolateRight: 'clamp'});
  
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

// Scene 2: Flash transition + Mochi reveal (4s)
const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  
  // White flash at start
  const flashOpacity = interpolate(frame, [0, 6], [1, 0], {extrapolateRight: 'clamp'});
  
  // Mochi image animation
  const imgOpacity = interpolate(frame, [4, 20], [0, 1], {extrapolateRight: 'clamp'});
  const imgScale = bulletTime(interpolate(frame, [4, 24], [0.85, 1], {extrapolateRight: 'clamp'}));
  const imgY = bulletTime(interpolate(frame, [4, 24], [30, 0], {extrapolateRight: 'clamp'}));
  
  // Text animations
  const nameOpacity = interpolate(frame, [28, 44], [0, 1], {extrapolateRight: 'clamp'});
  const nameY = bulletTime(interpolate(frame, [28, 44], [20, 0], {extrapolateRight: 'clamp'}));
  const roleOpacity = interpolate(frame, [48, 60], [0, 1], {extrapolateRight: 'clamp'});
  
  return (
    <AbsoluteFill style={{
      background: colors.void,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      gap: 24,
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
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.accent}25 0%, transparent 60%)`,
        filter: 'blur(80px)',
        opacity: imgOpacity * 0.8,
      }} />
      
      {/* Mochi image */}
      <div style={{
        opacity: imgOpacity,
        transform: `scale(${imgScale}) translateY(${imgY}px)`,
      }}>
        <Img
          src={staticFile('images/mochi.png')}
          style={{
            height: 650,
            width: 'auto',
            filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.5))',
          }}
        />
      </div>
      
      {/* Name */}
      <div style={{
        fontFamily: "'Space Grotesk'",
        fontSize: 96,
        fontWeight: 700,
        color: colors.text,
        letterSpacing: 6,
        opacity: nameOpacity,
        transform: `translateY(${nameY}px)`,
        textShadow: `0 0 60px ${colors.accent}40`,
      }}>
        MOCHI
      </div>
      
      {/* Role */}
      <div style={{
        fontFamily: "'Space Mono'",
        fontSize: 18,
        color: colors.accent,
        letterSpacing: 6,
        textTransform: 'uppercase',
        opacity: roleOpacity,
      }}>
        Motion Designer × Animator
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Stats card (2s)
const StatsScene: React.FC = () => {
  const frame = useCurrentFrame();
  
  const fadeIn = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
  const scale = bulletTime(interpolate(frame, [0, 12], [1.03, 1], {extrapolateRight: 'clamp'}));
  
  // Faster stat reveals - 2s scene = 48 frames
  const stat1 = frame >= 4;
  const stat2 = frame >= 12;
  const stat3 = frame >= 20;
  
  return (
    <AbsoluteFill style={{
      background: colors.void,
      justifyContent: 'center',
      alignItems: 'center',
      opacity: fadeIn,
    }}>
      <style>{fontFaces}</style>
      
      <div style={{
        transform: `scale(${scale})`,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        alignItems: 'center',
      }}>
        <div style={{
          fontFamily: "'Space Grotesk'",
          fontSize: 64,
          fontWeight: 700,
          color: colors.text,
          letterSpacing: 4,
          marginBottom: 12,
        }}>
          🎬 NEW HIRE
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          alignItems: 'center',
        }}>
          {stat1 && <div style={{fontFamily: "'Space Mono'", fontSize: 20, color: colors.dim}}>
            ROLE: <span style={{color: colors.text}}>Animator</span>
          </div>}
          {stat2 && <div style={{fontFamily: "'Space Mono'", fontSize: 20, color: colors.dim}}>
            SPECIES: <span style={{color: colors.text}}>British Shorthair</span>
          </div>}
          {stat3 && <div style={{fontFamily: "'Space Mono'", fontSize: 20, color: colors.dim}}>
            STATUS: <span style={{color: colors.accent}}>READY TO CREATE ✨</span>
          </div>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Pika end card (2s)
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

// Main composition - 16s at 24fps = 384 frames
export const MochiCelebration: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: colors.void}}>
      {/* Vinyl crackle ambient throughout */}
      <Sequence from={0} durationInFrames={384}>
        <Audio src={staticFile('audio/vinyl-crackle.mp3')} volume={0.15} />
      </Sequence>
      
      {/* Scene 1: Dolly shot (192 frames / 8s) */}
      <Sequence from={0} durationInFrames={192}>
        <DollyScene />
      </Sequence>
      
      {/* Subtle loading hum during dolly */}
      <Sequence from={48} durationInFrames={144}>
        <Audio src={staticFile('audio/loading-hum.mp3')} volume={0.3} />
      </Sequence>
      
      {/* Scene 2: Mochi reveal (96 frames / 4s) */}
      <Sequence from={192} durationInFrames={96}>
        <RevealScene />
      </Sequence>
      
      {/* Tadaaa on reveal */}
      <Sequence from={192}>
        <Audio src={staticFile('audio/tadaaa-final.mp3')} volume={0.9} />
      </Sequence>
      
      {/* Meow shortly after */}
      <Sequence from={210}>
        <Audio src={staticFile('audio/meow.mp3')} volume={0.7} />
      </Sequence>
      
      {/* Scene 3: Stats card (48 frames / 2s) */}
      <Sequence from={288} durationInFrames={48}>
        <StatsScene />
      </Sequence>
      
      {/* Ping sounds for stats - adjusted for faster reveals */}
      <Sequence from={292}>
        <Audio src={staticFile('audio/ping1.wav')} volume={0.7} />
      </Sequence>
      <Sequence from={300}>
        <Audio src={staticFile('audio/ping2.wav')} volume={0.7} />
      </Sequence>
      <Sequence from={308}>
        <Audio src={staticFile('audio/ping3.wav')} volume={0.7} />
      </Sequence>
      
      {/* Scene 4: Pika end card (48 frames / 2s) */}
      <Sequence from={336} durationInFrames={48}>
        <PikaEndScene />
      </Sequence>
      
      {/* Pika end card SFX */}
      <Sequence from={336}>
        <Audio src={staticFile('audio/pika-end.wav')} volume={0.8} />
      </Sequence>
    </AbsoluteFill>
  );
};
