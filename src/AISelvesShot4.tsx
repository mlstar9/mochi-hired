import {AbsoluteFill, useCurrentFrame, interpolate, Img, staticFile} from 'remotion';
import {Message, COLORS, FONTS, MessageBubble, TypingIndicator, TypingInputBox, ChannelHeader, EmojiReaction, SIDE_MARGIN} from './AISelvesShared';

// Shot 4: Nyx Selfie Drop + Reactions
// Message 10 + reactions

const NYX_MESSAGE: Message = {
  id: 10,
  sender: 'Nyx',
  role: 'AI',
  text: "my face is the only marketing y'all need. 💅",
  isBot: true,
  appearFrame: 24,
  holdFrames: 48, // 2s
  hasImage: true,
};

const SELFIE_APPEAR_FRAME = 24 + 48; // after message
const REACTIONS_START_FRAME = SELFIE_APPEAR_FRAME + 36; // 1.5s after selfie

const REACTIONS = [
  { emoji: '👍', sender: 'Semi', delay: 0 },
  { emoji: '🙄', sender: 'Ryan', delay: 4 },
  { emoji: '😂', sender: 'Jessie', delay: 8 },
  { emoji: '💀', sender: 'Raccoon 2.0', delay: 12 },
  { emoji: '🔥', sender: 'Anthony', delay: 16 },
];

// Duration: ~5s = 120 frames
export const AISelvesShot4: React.FC = () => {
  const frame = useCurrentFrame();
  
  const messageVisible = frame >= NYX_MESSAGE.appearFrame;
  const messageOpacity = interpolate(
    frame,
    [NYX_MESSAGE.appearFrame, NYX_MESSAGE.appearFrame + 8],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  
  const selfieVisible = frame >= SELFIE_APPEAR_FRAME;
  const selfieOpacity = interpolate(
    frame,
    [SELFIE_APPEAR_FRAME, SELFIE_APPEAR_FRAME + 8],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  const selfieScale = interpolate(
    frame,
    [SELFIE_APPEAR_FRAME, SELFIE_APPEAR_FRAME + 12],
    [0.8, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  
  const showTyping = frame < NYX_MESSAGE.appearFrame && frame >= NYX_MESSAGE.appearFrame - 20;
  
  return (
    <AbsoluteFill style={{
      backgroundColor: COLORS.bg,
      fontFamily: FONTS.slack,
    }}>
      {/* Channel header at top */}
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10}}>
        <ChannelHeader channelName="marketing" memberCount={8} />
      </div>
      
      {/* LAYER 1: Base UI */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
        <div style={{marginBottom: 16}}>
          <TypingIndicator sender="Nyx" visible={showTyping} />
        </div>
        <TypingInputBox channelName="marketing" />
      </AbsoluteFill>
      
      {/* LAYER 2: Chat content */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBottom: 200,
      }}>
        {/* Nyx message */}
        <MessageBubble message={NYX_MESSAGE} opacity={messageVisible ? messageOpacity : 0} />
        
        {/* Selfie image placeholder */}
        {selfieVisible && (
          <div style={{
            padding: `0 ${SIDE_MARGIN}px 16px ${SIDE_MARGIN + 104}px`,
            opacity: selfieOpacity,
            transform: `scale(${selfieScale})`,
            transformOrigin: 'top left',
          }}>
            {/* Placeholder for selfie - pink gradient */}
            <div style={{
              width: 400,
              height: 500,
              background: 'linear-gradient(135deg, #E91E63, #9C27B0)',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 48,
            }}>
              📸
            </div>
          </div>
        )}
        
        {/* Reactions */}
        {frame >= REACTIONS_START_FRAME && (
          <div style={{
            display: 'flex',
            gap: 8,
            padding: `0 ${SIDE_MARGIN}px 16px ${SIDE_MARGIN + 104}px`,
            flexWrap: 'wrap',
          }}>
            {REACTIONS.map((r, i) => (
              <EmojiReaction
                key={i}
                emoji={r.emoji}
                sender={r.sender}
                delay={REACTIONS_START_FRAME + r.delay}
              />
            ))}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
