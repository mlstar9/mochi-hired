import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {COLORS} from './AISelvesShared';

// Shot 5: Overnight Transition
// Visual: night → dawn, "OVERNIGHT" text, clock

// Duration: ~2s = 48 frames
export const AISelvesShot5: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Background gradient from night to dawn
  const gradientProgress = interpolate(frame, [0, 48], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  const nightColor = '#0a0a1a';
  const dawnColor = '#1a1a2e';
  
  // Text fade in
  const textOpacity = interpolate(frame, [8, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  // Clock/time animation
  const clockProgress = interpolate(frame, [0, 48], [0, 360 * 2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  // Time text
  const hour = Math.floor(interpolate(frame, [0, 48], [22, 6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }));
  const displayHour = hour < 0 ? hour + 24 : hour;
  const timeString = `${displayHour.toString().padStart(2, '0')}:00`;
  
  return (
    <AbsoluteFill style={{
      backgroundColor: nightColor,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Stars / night sky effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 1px, transparent 1px),
                     radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 1px, transparent 1px),
                     radial-gradient(circle at 50% 80%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        opacity: 1 - gradientProgress,
      }} />
      
      {/* Dawn gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, #FF6B35 0%, #F7C59F 30%, transparent 60%)',
        opacity: gradientProgress * 0.3,
      }} />
      
      {/* OVERNIGHT text */}
      <div style={{
        color: COLORS.text,
        fontSize: 120,
        fontWeight: 'bold',
        letterSpacing: 20,
        opacity: textOpacity,
        textShadow: '0 0 40px rgba(194, 190, 255, 0.5)',
      }}>
        OVERNIGHT
      </div>
      
      {/* Time display */}
      <div style={{
        color: COLORS.textMuted,
        fontSize: 48,
        marginTop: 40,
        fontFamily: 'monospace',
        opacity: textOpacity,
      }}>
        {timeString}
      </div>
      
      {/* Moon to sun icon */}
      <div style={{
        marginTop: 60,
        fontSize: 80,
        opacity: textOpacity,
      }}>
        {gradientProgress < 0.5 ? '🌙' : '☀️'}
      </div>
    </AbsoluteFill>
  );
};
