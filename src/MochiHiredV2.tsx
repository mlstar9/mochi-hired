import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Sequence,
  Video,
  staticFile,
  Audio,
  Easing,
} from 'remotion';

// Clean dark palette - no lavender overload
const colors = {
  void: '#0a0a0a',
  dark: '#111111',
  text: '#f5f5f5',
  accent: '#a78bfa', // subtle lavender only for accents
  dim: '#666666',
};

// Bullet time easing
const bulletTime = (value: number) => {
  return Easing.bezier(0.4, 0, 0.2, 1)(value);
};

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

// Simple waveform animation
const Waveform: React.FC<{active: boolean}> = ({active}) => {
  const frame = useCurrentFrame();
  const bars = 12;
  
  return (
    <div style={{
      display: 'flex',
      gap: 3,
      alignItems: 'center',
      height: 40,
    }}>
      {Array.from({length: bars}).map((_, i) => {
        const phase = (frame * 0.15) + (i * 0.5);
        const height = active 
          ? 8 + Math.sin(phase) * 16 + Math.cos(phase * 0.7) * 8
          : 4;
        return (
          <div
            key={i}
            style={{
              width: 2,
              height: Math.max(2, height),
              backgroundColor: colors.accent,
              opacity: active ? 0.8 : 0.3,
              transition: 'height 0.1s ease',
            }}
          />
        );
      })}
    </div>
  );
};

// Scene 1: Signal Detected
const SignalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  const textOpacity = interpolate(frame, [30, 50], [0, 1], {extrapolateRight: 'clamp'});
  const waveformActive = frame > 24;
  
  return (
    <AbsoluteFill style={{
      background: colors.void,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      gap: 24,
    }}>
      <style>{fontFaces}</style>
      
      <div style={{opacity}}>
        <Waveform active={waveformActive} />
      </div>
      
      <div style={{
        fontFamily: "'Space Mono'",
        fontSize: 16,
        color: colors.dim,
        letterSpacing: 4,
        textTransform: 'uppercase',
        opacity: textOpacity,
      }}>
        signal detected
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Analyzing
const AnalyzingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: 'clamp'});
  const scanY = interpolate(frame, [0, 72], [0, 100], {extrapolateRight: 'clamp'});
  const dotsCount = Math.floor(frame / 12) % 4;
  const dots = '.'.repeat(dotsCount);
  
  return (
    <AbsoluteFill style={{
      background: colors.void,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <style>{fontFaces}</style>
      
      {/* Subtle scan line */}
      <div style={{
        position: 'absolute',
        top: `${scanY}%`,
        left: 0,
        right: 0,
        height: 1,
        background: `linear-gradient(90deg, transparent 0%, ${colors.accent}40 50%, transparent 100%)`,
        opacity: opacity * 0.5,
      }} />
      
      {/* Blurred preview hint */}
      <div style={{
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.accent}15 0%, transparent 70%)`,
        opacity,
        filter: 'blur(40px)',
      }} />
      
      <div style={{
        position: 'absolute',
        fontFamily: "'Space Mono'",
        fontSize: 14,
        color: colors.dim,
        letterSpacing: 3,
        textTransform: 'uppercase',
        opacity,
      }}>
        analyzing{dots}
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Video Reveal
const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = bulletTime(interpolate(frame, [0, 36], [0, 1], {extrapolateRight: 'clamp'}));
  const opacity = interpolate(frame, [0, 24], [0, 1], {extrapolateRight: 'clamp'});
  const scale = interpolate(progress, [0, 1], [0.9, 1]);
  const blur = interpolate(frame, [0, 24], [20, 0], {extrapolateRight: 'clamp'});
  
  return (
    <AbsoluteFill style={{
      background: colors.void,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <style>{fontFaces}</style>
      
      {/* Soft glow behind video */}
      <div style={{
        position: 'absolute',
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.accent}20 0%, transparent 60%)`,
        filter: 'blur(60px)',
        opacity: opacity * 0.6,
      }} />
      
      {/* Video container */}
      <div style={{
        opacity,
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
        boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
        borderRadius: 8,
        overflow: 'hidden',
      }}>
        <Video
          src={staticFile('videos/mochi-working.mp4')}
          style={{width: 480, height: 'auto', display: 'block'}}
          muted
        />
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Title Card
const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const welcomeOpacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  const nameOpacity = interpolate(frame, [24, 44], [0, 1], {extrapolateRight: 'clamp'});
  const roleOpacity = interpolate(frame, [48, 60], [0, 1], {extrapolateRight: 'clamp'});
  const nameY = bulletTime(interpolate(frame, [24, 44], [20, 0], {extrapolateRight: 'clamp'}));
  
  return (
    <AbsoluteFill style={{
      background: colors.void,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      gap: 16,
    }}>
      <style>{fontFaces}</style>
      
      {/* Pika welcomes */}
      <div style={{
        fontFamily: "'Space Grotesk'",
        fontSize: 18,
        fontWeight: 500,
        color: colors.dim,
        letterSpacing: 3,
        textTransform: 'uppercase',
        opacity: welcomeOpacity,
      }}>
        Pika welcomes
      </div>
      
      {/* MOCHI - big bold */}
      <div style={{
        fontFamily: "'Space Grotesk'",
        fontSize: 120,
        fontWeight: 700,
        color: colors.text,
        letterSpacing: 8,
        opacity: nameOpacity,
        transform: `translateY(${nameY}px)`,
      }}>
        MOCHI
      </div>
      
      {/* Role */}
      <div style={{
        fontFamily: "'Space Mono'",
        fontSize: 16,
        color: colors.accent,
        letterSpacing: 4,
        textTransform: 'uppercase',
        opacity: roleOpacity,
      }}>
        Motion Designer
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: End Card
const EndScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  const fadeOut = interpolate(frame, [36, 48], [1, 0], {extrapolateRight: 'clamp'});
  
  return (
    <AbsoluteFill style={{
      background: colors.void,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <style>{fontFaces}</style>
      
      <div style={{
        fontFamily: "'Space Grotesk'",
        fontSize: 48,
        fontWeight: 700,
        color: colors.text,
        letterSpacing: 4,
        opacity: opacity * fadeOut,
      }}>
        Pika
      </div>
    </AbsoluteFill>
  );
};

// Main composition - 15s at 24fps = 360 frames
export const MochiHiredV2: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: colors.void}}>
      {/* Scene 1: Signal (72 frames / 3s) */}
      <Sequence from={0} durationInFrames={72}>
        <SignalScene />
      </Sequence>
      
      {/* Scene 2: Analyzing (72 frames / 3s) */}
      <Sequence from={72} durationInFrames={72}>
        <AnalyzingScene />
      </Sequence>
      
      {/* Scene 3: Video Reveal (96 frames / 4s) */}
      <Sequence from={144} durationInFrames={96}>
        <RevealScene />
      </Sequence>
      
      {/* Scene 4: Title Card (72 frames / 3s) */}
      <Sequence from={240} durationInFrames={72}>
        <TitleScene />
      </Sequence>
      
      {/* Scene 5: End (48 frames / 2s) */}
      <Sequence from={312} durationInFrames={48}>
        <EndScene />
      </Sequence>
      
      {/* Audio - bass drop at reveal */}
      <Sequence from={144}>
        <Audio src={staticFile('audio/bass-drop.mp3')} volume={0.5} />
      </Sequence>
    </AbsoluteFill>
  );
};
