import {AbsoluteFill, useCurrentFrame, interpolate, Img, staticFile} from 'remotion';
import {COLORS} from './AISelvesShared';

// Shot 9: End Card
// PIKA. AI SELVES. + logo

// Duration: ~3s = 72 frames
export const AISelvesShot9: React.FC = () => {
  const frame = useCurrentFrame();
  
  // "PIKA." fade/scale in
  const pikaOpacity = interpolate(frame, [8, 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pikaScale = interpolate(frame, [8, 24], [0.8, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  // "AI SELVES." appears after
  const selvesOpacity = interpolate(frame, [28, 44], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const selvesY = interpolate(frame, [28, 44], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  // Logo fade in
  const logoOpacity = interpolate(frame, [48, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  return (
    <AbsoluteFill style={{
      backgroundColor: '#000000',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* PIKA. */}
      <div style={{
        color: COLORS.text,
        fontSize: 140,
        fontWeight: 'bold',
        letterSpacing: 8,
        opacity: pikaOpacity,
        transform: `scale(${pikaScale})`,
      }}>
        PIKA.
      </div>
      
      {/* AI SELVES. */}
      <div style={{
        color: COLORS.accent,
        fontSize: 80,
        fontWeight: 'bold',
        letterSpacing: 12,
        marginTop: 20,
        opacity: selvesOpacity,
        transform: `translateY(${selvesY}px)`,
      }}>
        AI SELVES.
      </div>
      
      {/* Pika logo */}
      <div style={{
        marginTop: 80,
        opacity: logoOpacity,
      }}>
        <Img
          src={staticFile('images/pika-logo.png')}
          style={{
            width: 200,
            height: 'auto',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
