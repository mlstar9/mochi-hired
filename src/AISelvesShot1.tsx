import {AbsoluteFill, useCurrentFrame, interpolate, Easing} from 'remotion';
import {Message, COLORS, FONTS, MessageBubble, TypingIndicator, TypingInputBox, ChannelHeader} from './AISelvesShared';

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
    text: 'any ideas? Raccoon 2.0?',
    isBot: true,
    appearFrame: 24 + 60 + 10 + 48 + 10, // after msg2 + nudge
    holdFrames: 72, // 3s (includes cursor beat)
  },
];

// Duration: ~10s = 248 frames
export const AISelvesShot1: React.FC = () => {
  const frame = useCurrentFrame();
  
  const NUDGE_PX = 70; // 92-140px per animation rules
  const NUDGE_FRAMES = 10;
  
  // Calculate nudge offset for each message (how far UP it should move)
  // Each message nudges up when a NEWER message appears after it
  const getNudgeOffset = (msgIndex: number): number => {
    let offset = 0;
    // For each message that appears AFTER this one
    for (let i = msgIndex + 1; i < MESSAGES.length; i++) {
      const laterMsg = MESSAGES[i];
      if (frame >= laterMsg.appearFrame) {
        const nudgeProgress = interpolate(
          frame,
          [laterMsg.appearFrame, laterMsg.appearFrame + NUDGE_FRAMES],
          [0, 1],
          {
            extrapolateLeft: 'clamp', 
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic), // smooth ease-out
          }
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
        {/* Typing indicator ABOVE input box - Slack style */}
        <TypingIndicator sender={typingSender} visible={showTyping} />
        <TypingInputBox channelName="marketing" />
      </AbsoluteFill>
      
      {/* LAYER 2: Chat bubbles - positioned above input box */}
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
          // Group consecutive messages from same sender
          const prevMsg = idx > 0 ? MESSAGES[idx - 1] : null;
          // grouping disabled per feedback
          
          return (
            <div key={msg.id} style={{transform: `translateY(-${nudgeOffset}px)`}}>
              <MessageBubble
                message={msg}
                opacity={isVisible ? 1 : 0}
                entranceProgress={entranceProgress}
                isGrouped={false}
              />
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
