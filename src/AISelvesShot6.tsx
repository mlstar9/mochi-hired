import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {Message, COLORS, FONTS, MessageBubble, TypingIndicator, TypingInputBox, ChannelHeader} from './AISelvesShared';

// Shot 6: Anthony's Report
// Messages 11-14
const MESSAGES: Message[] = [
  {
    id: 11,
    sender: 'Anthony',
    role: 'AI',
    text: 'scraped twitter overnight.',
    isBot: true,
    appearFrame: 24,
    holdFrames: 48, // 2s
  },
  {
    id: 12,
    sender: 'Anthony',
    role: 'AI',
    text: 'calculated real CPMs (median views).',
    isBot: true,
    appearFrame: 24 + 48 + 10,
    holdFrames: 48, // 2s
  },
  {
    id: 13,
    sender: 'Anthony',
    role: 'AI',
    text: 'flagged risks.',
    isBot: true,
    appearFrame: 24 + 48 + 10 + 48 + 10,
    holdFrames: 36, // 1.5s
  },
  {
    id: 14,
    sender: 'Anthony',
    role: 'AI',
    text: '112 vetted creators—sorted by value.',
    isBot: true,
    appearFrame: 24 + 48 + 10 + 48 + 10 + 36 + 10,
    holdFrames: 60, // 2.5s
  },
];

// Duration: ~8s = 192 frames
export const AISelvesShot6: React.FC = () => {
  const frame = useCurrentFrame();
  
  const NUDGE_PX = 120;
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
          const entranceProgress = interpolate(
            frame,
            [msg.appearFrame, msg.appearFrame + 8],
            [0, 1],
            {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
          );
          
          return (
            <MessageBubble
              key={msg.id}
              message={msg}
              opacity={isVisible ? 1 : 0}
              entranceProgress={entranceProgress}
            />
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
