import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {COLORS, FONTS} from './AISelvesShared';

// Shot 5: Overnight Transition
// Visual: night → dawn, "OVERNIGHT" text, clock
// Clean, minimal, Pika brand style

// Duration: ~2s = 48 frames
export const AISelvesShot5: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Text fade in
  const textOpacity = interpolate(frame, [4, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  // Time counter animation (22:00 → 06:00)
  const hours = interpolate(frame, [0, 48], [22, 30], { // 22 → 30 (wraps to 6)
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const displayHour = Math.floor(hours) % 24;
  const timeString = `${displayHour.toString().padStart(2, '0')}:00`;
  
  // Subtle glow pulse
  const glowOpacity = interpolate(
    (frame % 24),
    [0, 12, 24],
    [0.3, 0.6, 0.3]
  );
  
  return (
    <AbsoluteFill style={{
      backgroundColor: COLORS.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Subtle gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at 50% 50%, ${COLORS.accent}15 0%, transparent 70%)`,
        opacity: glowOpacity,
      }} />
      
      {/* OVERNIGHT text - Telka Extended */}
      <div style={{
        color: COLORS.text,
        fontSize: 140,
        fontWeight: 'bold',
        fontFamily: FONTS.primary,
        letterSpacing: 24,
        opacity: textOpacity,
      }}>
        OVERNIGHT
      </div>
      
      {/* Time display - SpaceMono */}
      <div style={{
        color: COLORS.accent,
        fontSize: 64,
        marginTop: 48,
        fontFamily: FONTS.mono,
        opacity: textOpacity,
        letterSpacing: 8,
      }}>
        {timeString}
      </div>
      
      {/* Moon/Sun indicator */}
      <div style={{
        marginTop: 48,
        fontSize: 72,
        opacity: textOpacity,
      }}>
        {displayHour >= 6 && displayHour < 20 ? '☀️' : '🌙'}
      </div>
    </AbsoluteFill>
  );
};
