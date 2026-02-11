import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Video,
  staticFile,
  Easing,
} from 'remotion';

const BG = '#111111';
const SUBTITLE_FONT = 'SF Pro Display, SF Pro, -apple-system, system-ui, sans-serif';
const AI_SELF_COLOR = '#C2BEFF';

// ── 3D Camera wrapper ───────────────────────────────────────────────────────
const Camera3D: React.FC<{
  children: React.ReactNode;
  rotateY?: number; // degrees
  rotateX?: number;
  translateZ?: number;
  scale?: number;
}> = ({ children, rotateY = 0, rotateX = 0, translateZ = 0, scale = 1 }) => {
  return (
    <div style={{ perspective: 1200, width: '100%', height: '100%' }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(${translateZ}px) scale(${scale})`,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>
    </div>
  );
};

// ── Subtitle component ──────────────────────────────────────────────────────
const Subtitle: React.FC<{
  text: string;
  startFrame: number;
  durationFrames: number;
  isAiSelf?: boolean;
}> = ({ text, startFrame, durationFrames, isAiSelf = false }) => {
  const frame = useCurrentFrame();
  if (frame < startFrame || frame >= startFrame + durationFrames) return null;

  const fadeIn = interpolate(frame, [startFrame, startFrame + 5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: isAiSelf ? 130 : 70,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: fadeIn,
        zIndex: 10,
      }}
    >
      <span
        style={{
          fontFamily: SUBTITLE_FONT,
          fontSize: isAiSelf ? 28 : 40,
          fontWeight: isAiSelf ? 400 : 500,
          color: isAiSelf ? AI_SELF_COLOR : '#FFFFFF',
          fontStyle: isAiSelf ? 'italic' : 'normal',
          textShadow: '0 2px 12px rgba(0,0,0,0.9)',
          padding: '8px 24px',
          backgroundColor: 'rgba(0,0,0,0.45)',
          borderRadius: 8,
        }}
      >
        {text}
      </span>
    </div>
  );
};

// ── Film grain overlay ──────────────────────────────────────────────────────
const FilmGrain: React.FC = () => {
  const frame = useCurrentFrame();
  // Pseudo-random grain using frame number
  const seed = frame * 127.1;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.08,
        mixBlendMode: 'overlay',
        background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='${Math.floor(seed)}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '256px 256px',
        zIndex: 20,
        pointerEvents: 'none',
      }}
    />
  );
};

// ── Vignette overlay ────────────────────────────────────────────────────────
const Vignette: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)',
      zIndex: 15,
      pointerEvents: 'none',
    }}
  />
);

// ── Main composition ────────────────────────────────────────────────────────
// Theo scene: ~11s total (Anthony intro 4s + Theo reveal 7s)
// Using the 5x sped up footage (23s) — we'll use portions of it

export const THEO_DURATION = 11 * 24; // 264 frames

export const LetiShot03Theo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Camera animation ──────────────────────────────────────────────────
  // Slow parallax drift throughout
  const driftX = interpolate(frame, [0, THEO_DURATION], [-2, 2], {
    extrapolateRight: 'clamp',
  });
  const driftY = interpolate(frame, [0, THEO_DURATION], [1, -1], {
    extrapolateRight: 'clamp',
  });

  // 3D Y rotation: subtle sway
  const rotY = interpolate(frame, [0, THEO_DURATION], [-3, 3], {
    extrapolateRight: 'clamp',
  });

  // 3D X rotation: very subtle tilt
  const rotX = interpolate(frame, [0, THEO_DURATION], [1.5, -0.5], {
    extrapolateRight: 'clamp',
  });

  // Slow zoom in
  const zoom = interpolate(frame, [0, THEO_DURATION], [1.05, 1.12], {
    extrapolateRight: 'clamp',
    easing: Easing.ease,
  });

  // ── Glitch flash on Theo reveal (at ~4s = frame 96) ───────────────────
  const glitchStart = 4 * fps; // frame 96
  const isGlitchFrame =
    frame >= glitchStart && frame < glitchStart + 3;
  const glitchOpacity = isGlitchFrame ? 0.8 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* Video layer with 3D transform */}
      <AbsoluteFill>
        <Camera3D rotateY={rotY} rotateX={rotX} scale={zoom}>
          <div
            style={{
              width: '100%',
              height: '100%',
              transform: `translate(${driftX}px, ${driftY}px)`,
            }}
          >
            <Video
              src={staticFile('assets/theo-scene-1080.mp4')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                // Warm color shift + lifted blacks
                filter: 'saturate(0.9) contrast(0.95) brightness(1.05) sepia(0.08)',
              }}
              startFrom={0}
              volume={0}
            />
          </div>
        </Camera3D>
      </AbsoluteFill>

      {/* Lifted blacks overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(17, 17, 17, 0.12)',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      />

      {/* Glitch flash on Theo reveal */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#FFFFFF',
          opacity: glitchOpacity,
          zIndex: 25,
          pointerEvents: 'none',
        }}
      />

      {/* Film grain */}
      <FilmGrain />

      {/* Vignette */}
      <Vignette />

      {/* ── Subtitles ─────────────────────────────────────────────────── */}
      {/* Anthony intro (0-4s) */}
      <Subtitle
        text="This is Anthony, our head of partnerships."
        startFrame={0}
        durationFrames={3 * fps}
      />
      <Subtitle
        text="And this is Theo."
        startFrame={3 * fps}
        durationFrames={1 * fps}
      />

      {/* Theo reveal (4-11s) */}
      <Subtitle
        text="(his AI Self)"
        startFrame={4 * fps}
        durationFrames={1.5 * fps}
        isAiSelf
      />
      <Subtitle
        text="Theo monitors our brand mentions in real time —"
        startFrame={5.5 * fps}
        durationFrames={2.5 * fps}
      />
      <Subtitle
        text="and helped Anthony evaluate partnership opportunities"
        startFrame={8 * fps}
        durationFrames={2 * fps}
      />
      <Subtitle
        text="around the clock for the launch."
        startFrame={10 * fps}
        durationFrames={1 * fps}
      />
    </AbsoluteFill>
  );
};
