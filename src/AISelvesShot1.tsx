import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {Message, COLORS, FONTS, MessageBubble, TypingIndicator, TypingInputBox} from './AISelvesShared';

// Shot 1: Task Drops
// Messages 1-3: Demi + Semi x2
const MESSAGES: Message[] = [
  {
    id: 1,
    sender: 'Demi',
    role: 'CEO',
    text: "We need a marketing video for AI Selves. Who's on it?",
    isBot: false,
    appearFrame: 24, // 1s in
    holdFrames: 60, // 2.5s
  },
  {
    id: 2,
    sender: 'Semi',
    role: 'AI',
    text: 'uhh ok. we need to make a marketing video.',
    isBot: true,
    appearFrame: 24 + 60 + 10, // after msg1 + nudge
    holdFrames: 48, // 2s
  },
  {
    id: 3,
    sender: 'Semi',
    role: 'AI',
    text: 'any ideas? Matan?',
    isBot: true,
    appearFrame: 24 + 60 + 10 + 48 + 10, // after msg2 + nudge
    holdFrames: 72, // 3s (includes cursor beat)
  },
];

// Duration: ~10s = 248 frames
export const AISelvesShot1: React.FC = () => {
  const frame = useCurrentFrame();
  
  const NUDGE_PX = 120; // 92-140px per animation rules
  const NUDGE_FRAMES = 10;
  
  let chatOffset = 0;
  const visibleMessages = MESSAGES.filter(msg => frame >= msg.appearFrame);
  
  visibleMessages.forEach((msg, idx) => {
    if (idx > 0) {
      const nudgeProgress = interpolate(
        frame,
        [msg.appearFrame, msg.appearFrame + NUDGE_FRAMES],
        [0, 1],
        {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
      );
      chatOffset += NUDGE_PX * nudgeProgress;
    }
  });
  
  const nextMessage = MESSAGES.find(msg => frame < msg.appearFrame && frame >= msg.appearFrame - 20);
  const showTyping = nextMessage !== undefined;
  const typingSender = nextMessage?.sender || '';
  
  return (
    <AbsoluteFill style={{
      backgroundColor: COLORS.bg,
      fontFamily: FONTS.mono,
    }}>
      {/* LAYER 1: Base UI */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
        <div style={{marginBottom: 16}}>
          <TypingIndicator sender={typingSender} visible={showTyping} />
        </div>
        <TypingInputBox channelName="marketing" />
      </AbsoluteFill>
      
      {/* LAYER 2: Chat bubbles */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBottom: 280,
        transform: `translateY(-${chatOffset}px)`,
      }}>
        {MESSAGES.map(msg => {
          const isVisible = frame >= msg.appearFrame;
          const appearProgress = interpolate(
            frame,
            [msg.appearFrame, msg.appearFrame + 8],
            [0, 1],
            {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
          );
          
          return (
            <MessageBubble
              key={msg.id}
              message={msg}
              opacity={isVisible ? appearProgress : 0}
            />
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
