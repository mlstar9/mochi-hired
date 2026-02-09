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

// Scene 1: Dolly shot - 8s with subtle vignette
const DollyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 192], [1, 1.02], {extrapolateRight: 'clamp'});
  // Vignette that intensifies as we approach
  const vignetteOpacity = interpolate(frame, [0, 192], [0.3, 0.5], {extrapolateRight: 'clamp'});
  
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
      
      {/* Vignette overlay */}
      <AbsoluteFill style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
        opacity: vignetteOpacity,
        pointerEvents: 'none',
      }} />
      
      <ScanLines />
    </AbsoluteFill>
  );
};

// Scene 2: Flash + VIDEO reveal with glow effect (4s)
const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Flash that fades to black briefly before reveal
  const flashOpacity = interpolate(frame, [0, 4, 8], [1, 0.8, 0], {extrapolateRight: 'clamp'});
  
  // Video reveal
  const vidOpacity = interpolate(frame, [6, 22], [0, 1], {extrapolateRight: 'clamp'});
  const vidScale = bulletTime(interpolate(frame, [6, 28], [0.85, 1], {extrapolateRight: 'clamp'}));
  
  // Glow pulse effect
  const glowIntensity = Math.sin(frame * 0.1) * 0.15 + 0.85;
  
  // Text animations
  const nameOpacity = interpolate(frame, [30, 46], [0, 1], {extrapolateRight: 'clamp'});
  const nameY = bulletTime(interpolate(frame, [30, 46], [20, 0], {extrapolateRight: 'clamp'}));
  const roleOpacity = interpolate(frame, [50, 62], [0, 1], {extrapolateRight: 'clamp'});
  
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
      
      {/* Animated glow behind video */}
      <div style={{
        position: 'absolute',
        width: 700,
        height: 700,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.accent}30 0%, transparent 60%)`,
        filter: 'blur(80px)',
        opacity: vidOpacity * glowIntensity,
      }} />
      
      {/* Video container with enhanced styling */}
      <div style={{
        opacity: vidOpacity,
        transform: `scale(${vidScale})`,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: `0 30px 60px rgba(0,0,0,0.5), 0 0 120px ${colors.accent}30`,
      }}>
        <Video
          src={staticFile('videos/mochi-working.mp4')}
          style={{
            height: 520,
            width: 'auto',
          }}
          muted
        />
      </div>
      
      {/* Name with enhanced glow */}
      <div style={{
        fontFamily: "'Space Grotesk'",
        fontSize: 84,
        fontWeight: 700,
        color: colors.text,
        letterSpacing: 6,
        opacity: nameOpacity,
        transform: `translateY(${nameY}px)`,
        textShadow: `0 0 60px ${colors.accent}60, 0 0 120px ${colors.accent}30`,
        marginTop: 16,
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

// Scene 3: Stats card with enhanced visuals (2s)
const StatsScene: React.FC = () => {
  const frame = useCurrentFrame();
  
  const fadeIn = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});
  const scale = bulletTime(interpolate(frame, [0, 14], [1.04, 1], {extrapolateRight: 'clamp'}));
  
  const stat1 = frame >= 6;
  const stat2 = frame >= 14;
  const stat3 = frame >= 22;
  
  // Subtle animated line
  const lineWidth = bulletTime(interpolate(frame, [0, 20], [0, 300], {extrapolateRight: 'clamp'}));
  
  return (
    <AbsoluteFill style={{
      background: colors.void,
      justifyContent: 'center',
      alignItems: 'center',
      opacity: fadeIn,
    }}>
      <style>{fontFaces}</style>
      
      {/* Subtle glow */}
      <div style={{
        position: 'absolute',
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.accent}15 0%, transparent 60%)`,
        filter: 'blur(60px)',
      }} />
      
      <div style={{
        transform: `scale(${scale})`,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        alignItems: 'center',
      }}>
        <div style={{
          fontFamily: "'Space Grotesk'",
          fontSize: 60,
          fontWeight: 700,
          color: colors.text,
          letterSpacing: 4,
        }}>
          🎬 NEW HIRE
        </div>
        
        {/* Animated underline */}
        <div style={{
          width: lineWidth,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)`,
          marginBottom: 8,
        }} />
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          alignItems: 'center',
        }}>
          {stat1 && <div style={{
            fontFamily: "'Space Mono'", 
            fontSize: 20, 
            color: colors.dim,
            opacity: interpolate(frame, [6, 12], [0, 1], {extrapolateRight: 'clamp'}),
          }}>
            ROLE: <span style={{color: colors.text}}>Animator</span>
          </div>}
          {stat2 && <div style={{
            fontFamily: "'Space Mono'", 
            fontSize: 20, 
            color: colors.dim,
            opacity: interpolate(frame, [14, 20], [0, 1], {extrapolateRight: 'clamp'}),
          }}>
            SPECIES: <span style={{color: colors.text}}>British Shorthair</span>
          </div>}
          {stat3 && <div style={{
            fontFamily: "'Space Mono'", 
            fontSize: 20, 
            color: colors.dim,
            opacity: interpolate(frame, [22, 28], [0, 1], {extrapolateRight: 'clamp'}),
          }}>
            STATUS: <span style={{color: colors.accent}}>READY TO CREATE ✨</span>
          </div>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Pika end card with centered logo (2s)
const PikaEndScene: React.FC = () => {
  const frame = useCurrentFrame();
  
  const opacity = interpolate(frame, [0, 14], [0, 1], {extrapolateRight: 'clamp'});
  const scale = bulletTime(interpolate(frame, [0, 14], [1.06, 1], {extrapolateRight: 'clamp'}));
  
  return (
    <AbsoluteFill style={{
      background: colors.void,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      {/* Glow behind logo */}
      <div style={{
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%)`,
        filter: 'blur(40px)',
        opacity: opacity * 0.6,
      }} />
      
      <div style={{
        opacity,
        transform: `scale(${scale})`,
      }}>
        <Img
          src={staticFile('images/pika-logo.png')}
          style={{width: '100%', maxWidth: 900, height: 'auto'}}
        />
      </div>
    </AbsoluteFill>
  );
};

// Main composition - 16s at 24fps = 384 frames (polished version)
export const MochiCelebrationV5: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: colors.void}}>
      {/* Vinyl crackle ambient throughout */}
      <Sequence from={0} durationInFrames={384}>
        <Audio src={staticFile('audio/vinyl-crackle.mp3')} volume={0.12} />
      </Sequence>
      
      {/* Scene 1: Dolly shot (192 frames / 8s) */}
      <Sequence from={0} durationInFrames={192}>
        <DollyScene />
      </Sequence>
      
      {/* Subtle loading hum during dolly - ramps up */}
      <Sequence from={48} durationInFrames={144}>
        <Audio src={staticFile('audio/loading-hum.mp3')} volume={0.35} />
      </Sequence>
      
      {/* Scene 2: Mochi reveal (96 frames / 4s) */}
      <Sequence from={192} durationInFrames={96}>
        <RevealScene />
      </Sequence>
      
      {/* Tadaaa on reveal */}
      <Sequence from={192}>
        <Audio src={staticFile('audio/tadaaa-final.mp3')} volume={0.95} />
      </Sequence>
      
      {/* Meow shortly after */}
      <Sequence from={214}>
        <Audio src={staticFile('audio/meow.mp3')} volume={0.65} />
      </Sequence>
      
      {/* Scene 3: Stats card (48 frames / 2s) */}
      <Sequence from={288} durationInFrames={48}>
        <StatsScene />
      </Sequence>
      
      {/* Ping sounds for stats - slightly staggered */}
      <Sequence from={294}>
        <Audio src={staticFile('audio/ping1.wav')} volume={0.65} />
      </Sequence>
      <Sequence from={302}>
        <Audio src={staticFile('audio/ping2.wav')} volume={0.65} />
      </Sequence>
      <Sequence from={310}>
        <Audio src={staticFile('audio/ping3.wav')} volume={0.65} />
      </Sequence>
      
      {/* Scene 4: Pika end card (48 frames / 2s) */}
      <Sequence from={336} durationInFrames={48}>
        <PikaEndScene />
      </Sequence>
      
      {/* Pika end card SFX */}
      <Sequence from={336}>
        <Audio src={staticFile('audio/pika-end.wav')} volume={0.85} />
      </Sequence>
    </AbsoluteFill>
  );
};
