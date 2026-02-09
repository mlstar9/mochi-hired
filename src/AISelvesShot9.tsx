import {AbsoluteFill, useCurrentFrame, interpolate, Img, staticFile} from 'remotion';
import {COLORS, FONTS} from './AISelvesShared';

// Shot 9: End Card
// PIKA. AI SELVES. + logo
// RULE: Logo scaled to 80%+ comp width, NO transition animation - clean cut

// Duration: ~3s = 72 frames
export const AISelvesShot9: React.FC = () => {
  const frame = useCurrentFrame();
  
  // "PIKA." fade in (subtle, fast)
  const pikaOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  // "AI SELVES." appears after
  const selvesOpacity = interpolate(frame, [16, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  // Logo fade in
  const logoOpacity = interpolate(frame, [32, 44], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  return (
    <AbsoluteFill style={{
      backgroundColor: '#000000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* PIKA. - Telka Extended Bold */}
      <div style={{
        color: COLORS.text,
        fontSize: 160,
        fontWeight: 'bold',
        fontFamily: FONTS.primary,
        letterSpacing: 12,
        opacity: pikaOpacity,
      }}>
        PIKA.
      </div>
      
      {/* AI SELVES. - Pika purple accent */}
      <div style={{
        color: COLORS.accent,
        fontSize: 96,
        fontWeight: 'bold',
        fontFamily: FONTS.primary,
        letterSpacing: 16,
        marginTop: 24,
        opacity: selvesOpacity,
      }}>
        AI SELVES.
      </div>
      
      {/* Pika logo - scaled to 80%+ comp width */}
      <div style={{
        position: 'absolute',
        bottom: 80,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        opacity: logoOpacity,
      }}>
        <Img
          src={staticFile('images/pika-logo.png')}
          style={{
            width: '100%', // full comp width
            height: 'auto',
            objectFit: 'contain',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
