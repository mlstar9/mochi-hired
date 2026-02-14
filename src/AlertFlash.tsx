import {AbsoluteFill, useCurrentFrame, interpolate, Easing} from 'remotion';

// Alert symbol flashing in center — 4:3 (1440x1080), 2s @ 24fps = 48 frames
// Transparent background

export const AlertFlash: React.FC = () => {
  const frame = useCurrentFrame();

  // Flash cycle — pulses on/off
  const cycle = frame % 12; // flash every 0.5s
  const flashOpacity = interpolate(cycle, [0, 3, 6, 12], [1, 1, 0.15, 0.15], {
    extrapolateRight: 'clamp',
  });

  // Scale pulse
  const scalePulse = interpolate(cycle, [0, 3, 6, 12], [1.05, 1, 0.95, 0.95], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Initial entrance
  const entranceScale = interpolate(frame, [0, 8], [0.5, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const entranceOpacity = interpolate(frame, [0, 4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Glow pulse
  const glowIntensity = interpolate(cycle, [0, 3, 6, 12], [40, 30, 10, 10], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{
      backgroundColor: 'transparent',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        opacity: entranceOpacity * flashOpacity,
        transform: `scale(${entranceScale * scalePulse})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
      }}>
        {/* Alert triangle */}
        <div style={{
          width: 600,
          height: 600,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          filter: `drop-shadow(0 0 ${glowIntensity}px rgba(255, 214, 10, 0.8))`,
        }}>
          <svg width="600" height="600" viewBox="0 0 200 200" fill="none">
            {/* Triangle */}
            <path
              d="M100 20 L185 170 L15 170 Z"
              fill="#FFD60A"
              stroke="#FFD60A"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Exclamation mark — sharp sans-serif */}
            <rect x="94" y="65" width="12" height="55" fill="#000000" />
            <rect x="94" y="135" width="12" height="12" fill="#000000" />
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};
