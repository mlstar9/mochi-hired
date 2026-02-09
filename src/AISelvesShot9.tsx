import {AbsoluteFill, Img, staticFile} from 'remotion';
import {COLORS, FONTS} from './AISelvesShared';

// Shot 9: End Card
// PIKA. AI SELVES. + logo
// RULE: HARD CUT - no fade, no transitions. Logo 100% width.

// Duration: ~3s = 72 frames
export const AISelvesShot9: React.FC = () => {
  return (
    <AbsoluteFill style={{
      backgroundColor: '#000000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Pika logo - 100% comp width, centered */}
      <Img
        src={staticFile('images/pika-logo.png')}
        style={{
          width: '100%',
          height: 'auto',
          objectFit: 'contain',
        }}
      />
    </AbsoluteFill>
  );
};
