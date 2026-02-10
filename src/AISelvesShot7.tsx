import {AbsoluteFill, useCurrentFrame, interpolate, Easing} from 'remotion';
import {Message, COLORS, FONTS, MessageBubble, TypingIndicator, TypingInputBox, ChannelHeader, SIDE_MARGIN} from './AISelvesShared';

// Shot 7: Semi Summarizes
// Messages 15-17
const MESSAGES: Message[] = [
  {
    id: 15,
    sender: 'Semi',
    role: 'AI',
    text: '👍',
    isBot: true,
    appearFrame: 24,
    holdFrames: 24, // 1s
  },
  {
    id: 16,
    sender: 'Semi',
    role: 'AI',
    text: 'summarizing in Notion + sending to Demi.',
    isBot: true,
    appearFrame: 24 + 24 + 10,
    holdFrames: 48, // 2s
  },
  {
    id: 17,
    sender: 'Semi',
    role: 'AI → Demi',
    text: 'plan in Notion. creators ranked by value. check it out when you have time!',
    isBot: true,
    appearFrame: 24 + 24 + 10 + 48 + 10,
    holdFrames: 72, // 3s
  },
];

// Duration: ~7s = 168 frames
export const AISelvesShot7: React.FC = () => {
  const frame = useCurrentFrame();
  
  const NUDGE_PX = 70;
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
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}
        );
        offset += NUDGE_PX * nudgeProgress;
      }
    }
    return offset;
  };
  
  const nextMessage = MESSAGES.find(msg => frame < msg.appearFrame && frame >= msg.appearFrame - 20);
  const showTyping = nextMessage !== undefined;
  const typingSender = nextMessage?.sender || '';
  
  // Check if DM message is visible
  const dmVisible = frame >= MESSAGES[2].appearFrame;
  
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
        {/* Show DM input when DM message is sent */}
        <TypingInputBox channelName={dmVisible ? "Demi" : "marketing"} />
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
            {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}
          );
          const nudgeOffset = getNudgeOffset(idx);
          const prevMsg = idx > 0 ? MESSAGES[idx - 1] : null;
          // Don't group DM message (id 17) since it's a different context
          const isDM = msg.id === 17;
          // grouping disabled per feedback
          
          return (
            <div key={msg.id} style={{position: 'relative', transform: `translateY(-${nudgeOffset}px)`}}>
              {isDM && isVisible && (
                <div style={{
                  position: 'absolute',
                  left: SIDE_MARGIN,
                  top: -20,
                  fontSize: 18,
                  color: COLORS.accent,
                  opacity: entranceProgress,
                }}>
                  📩 Direct Message to Demi
                </div>
              )}
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
