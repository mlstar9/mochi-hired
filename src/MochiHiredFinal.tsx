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
  random,
} from 'remotion';

const FPS = 24;

// Timing (in frames)
const DOLLY_DURATION = 8 * FPS; // 192 frames (8s)
const GLITCH_DURATION = 12; // 0.5s glitch transition
const MOCHI_DURATION = 10 * FPS; // 240 frames (10s)
const END_GLITCH_DURATION = 12; // 0.5s glitch at end
const PIKA_END_DURATION = 2 * FPS; // 48 frames (2s)
const TOTAL_DURATION = DOLLY_DURATION + GLITCH_DURATION + MOCHI_DURATION + END_GLITCH_DURATION + PIKA_END_DURATION;

// Bullet time easing
const bulletTime = Easing.bezier(0.4, 0, 0.2, 1);

// Colors
const colors = {
  text: '#FFFFFF',
  bg: '#0a0a0a',
};

// VHS-style glitch effect component
const VHSGlitch: React.FC<{ progress: number; sourceVideo: string; startFrame: number }> = ({ progress, sourceVideo, startFrame }) => {
  const frame = useCurrentFrame();
  const intensity = Math.sin(progress * Math.PI); // Peak in middle
  
  // VHS tracking line position (moves down screen)
  const trackingLineY = ((frame * 15) % 120) - 10;
  
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {/* Base video with distortion */}
      <AbsoluteFill style={{
        transform: `translateX(${(random(`shake-${frame}`) - 0.5) * 20 * intensity}px)`,
      }}>
        <Video
          src={staticFile(sourceVideo)}
          startFrom={startFrame}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: `saturate(${1.2 + intensity * 0.3}) contrast(${1.1 + intensity * 0.2})`,
          }}
        />
      </AbsoluteFill>
      
      {/* VHS scan lines */}
      <AbsoluteFill style={{
        background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        opacity: 0.5 + intensity * 0.3,
        pointerEvents: 'none',
      }} />
      
      {/* Horizontal tracking distortion band */}
      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: `${trackingLineY}%`,
        height: '8%',
        background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 70%, transparent 100%)',
        transform: `translateX(${(random(`track-${frame}`) - 0.5) * 100 * intensity}px)`,
        opacity: intensity,
      }} />
      
      {/* RGB chromatic aberration */}
      <AbsoluteFill style={{
        background: `linear-gradient(90deg, rgba(255,0,0,${0.1 * intensity}) 0%, transparent 5%, transparent 95%, rgba(0,255,255,${0.1 * intensity}) 100%)`,
        mixBlendMode: 'screen',
      }} />
      
      {/* Static noise overlay */}
      <AbsoluteFill style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' seed='${frame}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        opacity: 0.15 + intensity * 0.2,
        mixBlendMode: 'overlay',
      }} />
      
      {/* Occasional white flash */}
      {random(`flash-${frame}`) > 0.92 && (
        <AbsoluteFill style={{
          background: 'white',
          opacity: 0.1 * intensity,
        }} />
      )}
    </AbsoluteFill>
  );
};

// Font face for Telka Extended
const fontFaces = `
  @font-face {
    font-family: 'Telka Extended';
    src: url('/fonts/Telka-Extended-Black.woff2') format('woff2');
    font-weight: 900;
  }
  @font-face {
    font-family: 'Telka Extended';
    src: url('/fonts/Telka-Extended-Bold.woff2') format('woff2');
    font-weight: 700;
  }
  @font-face {
    font-family: 'Telka Extended';
    src: url('/fonts/Telka-Extended-Medium.woff2') format('woff2');
    font-weight: 500;
  }
`;

// Name and title overlay - centered on left side, staggered animation
const NameOverlay: React.FC<{ frame: number }> = ({ frame }) => {
  // Staggered timing (in frames from start of mochi reveal)
  const NAME_DELAY = 36; // 1.5s
  const TITLE1_DELAY = 72; // 3s
  const TITLE2_DELAY = 96; // 4s
  
  // Calculate opacity for each element (hard cut = instant)
  const nameVisible = frame >= NAME_DELAY ? 1 : 0;
  const title1Visible = frame >= TITLE1_DELAY ? 1 : 0;
  const title2Visible = frame >= TITLE2_DELAY ? 1 : 0;
  
  return (
    <AbsoluteFill>
      <style>{fontFaces}</style>
      {/* Left side container - 40% width, vertically centered */}
      <div style={{
        position: 'absolute',
        left: 80,
        top: '50%',
        transform: 'translateY(-50%)',
        width: '40%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}>
        {/* Name - HUGE */}
        <div style={{
          fontFamily: 'Telka Extended, sans-serif',
          fontSize: 180,
          fontWeight: 900,
          color: colors.text,
          textShadow: '0 4px 40px rgba(0,0,0,0.6)',
          letterSpacing: '-2px',
          lineHeight: 0.9,
          textTransform: 'uppercase',
          opacity: nameVisible,
        }}>
          Mochi
        </div>
        
        {/* Title line 1 - with 40% opacity drop shadow */}
        <div style={{
          fontFamily: 'Telka Extended, sans-serif',
          fontSize: 36,
          fontWeight: 500,
          color: 'rgba(255,255,255,0.9)',
          marginTop: 24,
          textShadow: '0 4px 8px rgba(0,0,0,0.4), 0 2px 20px rgba(0,0,0,0.6)',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          opacity: title1Visible,
          filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.4))',
        }}>
          Animator. Video Editor.
        </div>
        
        {/* Title line 2 - with 40% opacity drop shadow */}
        <div style={{
          fontFamily: 'Telka Extended, sans-serif',
          fontSize: 36,
          fontWeight: 500,
          color: 'rgba(255,255,255,0.9)',
          marginTop: 8,
          textShadow: '0 4px 8px rgba(0,0,0,0.4), 0 2px 20px rgba(0,0,0,0.6)',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          opacity: title2Visible,
          filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.4))',
        }}>
          Kind of Socially Awkward.
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const MochiHiredFinal: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {/* Dolly shot - loading terminal */}
      <Sequence from={0} durationInFrames={DOLLY_DURATION}>
        <Video
          src={staticFile('videos/dolly-loading-v1.mp4')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Sequence>

      {/* VHS glitch transition */}
      <Sequence from={DOLLY_DURATION} durationInFrames={GLITCH_DURATION}>
        {(() => {
          const localFrame = frame - DOLLY_DURATION;
          const progress = interpolate(localFrame, [0, GLITCH_DURATION], [0, 1], {
            easing: bulletTime,
          });
          return <VHSGlitch progress={progress} sourceVideo="videos/dolly-loading-v1.mp4" startFrame={DOLLY_DURATION - 1} />;
        })()}
      </Sequence>

      {/* Mochi reveal with name overlay */}
      <Sequence from={DOLLY_DURATION + GLITCH_DURATION} durationInFrames={MOCHI_DURATION}>
        <Video
          src={staticFile('videos/mochi-i2v-attack-10s.mp4')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <NameOverlay frame={frame - DOLLY_DURATION - GLITCH_DURATION} />
      </Sequence>

      {/* End VHS glitch transition (after attack) */}
      <Sequence from={DOLLY_DURATION + GLITCH_DURATION + MOCHI_DURATION} durationInFrames={END_GLITCH_DURATION}>
        {(() => {
          const localFrame = frame - (DOLLY_DURATION + GLITCH_DURATION + MOCHI_DURATION);
          const progress = interpolate(localFrame, [0, END_GLITCH_DURATION], [0, 1], {
            easing: bulletTime,
          });
          return <VHSGlitch progress={progress} sourceVideo="videos/mochi-i2v-attack-10s.mp4" startFrame={MOCHI_DURATION - 1} />;
        })()}
      </Sequence>

      {/* Pika end card */}
      <Sequence from={DOLLY_DURATION + GLITCH_DURATION + MOCHI_DURATION + END_GLITCH_DURATION} durationInFrames={PIKA_END_DURATION}>
        <AbsoluteFill>
          <img
            src={staticFile('images/pika-logo.png')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Audio - ambient + sfx */}
      <Audio src={staticFile('audio/vinyl-crackle.mp3')} volume={0.15} />
      
      {/* Glitch sound at first transition */}
      <Sequence from={DOLLY_DURATION - 6} durationInFrames={24}>
        <Audio src={staticFile('audio/riser-noise.mp3')} volume={0.3} />
      </Sequence>
      
      {/* Tadaaa on reveal */}
      <Sequence from={DOLLY_DURATION + GLITCH_DURATION} durationInFrames={48}>
        <Audio src={staticFile('audio/tadaaa-final.mp3')} volume={0.6} />
      </Sequence>

      {/* Glitch sound at end transition */}
      <Sequence from={DOLLY_DURATION + GLITCH_DURATION + MOCHI_DURATION - 6} durationInFrames={24}>
        <Audio src={staticFile('audio/riser-noise.mp3')} volume={0.3} />
      </Sequence>

      {/* Pika end sound */}
      <Sequence from={DOLLY_DURATION + GLITCH_DURATION + MOCHI_DURATION + END_GLITCH_DURATION} durationInFrames={PIKA_END_DURATION}>
        <Audio src={staticFile('audio/pika-end.wav')} volume={0.5} />
      </Sequence>
    </AbsoluteFill>
  );
};
