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
  
  const NUDGE_PX = 95;
  const NUDGE_FRAMES = 10;
  
  const getNudgeOffset = (msgIndex: number): number => {
    let offset = 0;
    for (let i = msgIndex + 1; i < MESSAGES.length; i++) {
      const laterMsg = MESSAGES[i];
      if (frame >= laterMsg.appearFrame) {
        const nudgeProgress = interpolate(
          frame,
          [laterMsg.appearFrame, laterMsg.appearFrame + NUDGE_FRAMES],
          [0, 1],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
        );
        offset += NUDGE_PX * nudgeProgress;
      }
    }
    return offset;
  };
  
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
      
      {/* LAYER 1: Input box + Typing indicator (fixed at bottom) */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
        <TypingIndicator sender={typingSender} visible={showTyping} />
        <TypingInputBox channelName="marketing" />
      </AbsoluteFill>
      
      {/* LAYER 2: Chat bubbles */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBottom: 200,
      }}>
        {MESSAGES.map((msg, idx) => {
          const isVisible = frame >= msg.appearFrame;
          const entranceProgress = interpolate(
            frame,
            [msg.appearFrame, msg.appearFrame + 8],
            [0, 1],
            {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
          );
          const nudgeOffset = getNudgeOffset(idx);
          
          return (
            <div key={msg.id} style={{transform: `translateY(-${nudgeOffset}px)`}}>
              <MessageBubble
                message={msg}
                opacity={isVisible ? 1 : 0}
                entranceProgress={entranceProgress}
              />
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
