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
const DollyScene: React.FC = () => {
  const frame = useCurrentFrame();
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

// Scene 2: Flash transition + Mochi VIDEO reveal (4s)
// Using mochi-working.mp4 video clip for dynamic reveal
const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  
  // White flash at start
  const flashOpacity = interpolate(frame, [0, 6], [1, 0], {extrapolateRight: 'clamp'});
  
  // Video animation
  const vidOpacity = interpolate(frame, [4, 20], [0, 1], {extrapolateRight: 'clamp'});
  const vidScale = bulletTime(interpolate(frame, [4, 24], [0.85, 1], {extrapolateRight: 'clamp'}));
  const vidY = bulletTime(interpolate(frame, [4, 24], [30, 0], {extrapolateRight: 'clamp'}));
  
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
      gap: 16,
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
        opacity: vidOpacity * 0.8,
      }} />
      
      {/* Mochi VIDEO - portrait video centered */}
      <div style={{
        opacity: vidOpacity,
        transform: `scale(${vidScale}) translateY(${vidY}px)`,
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
      }}>
        <Video
          src={staticFile('videos/mochi-working.mp4')}
          style={{
            height: 550,
            width: 'auto',
          }}
          muted
        />
      </div>
      
      {/* Name - positioned below */}
      <div style={{
        fontFamily: "'Space Grotesk'",
        fontSize: 80,
        fontWeight: 700,
        color: colors.text,
        letterSpacing: 6,
        opacity: nameOpacity,
        transform: `translateY(${nameY}px)`,
        textShadow: `0 0 60px ${colors.accent}40`,
        marginTop: 20,
      }}>
        MOCHI
      </div>
      
      {/* Role */}
      <div style={{
        fontFamily: "'Space Mono'",
        fontSize: 16,
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
      }}>
        <Img
          src={staticFile('images/pika-logo.png')}
          style={{width: '100%', maxWidth: 800, height: 'auto'}}
        />
      </div>
    </AbsoluteFill>
  );
};

// Main composition - 16s at 24fps = 384 frames
export const MochiCelebrationV3: React.FC = () => {
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
      
      {/* Ping sounds for stats */}
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
