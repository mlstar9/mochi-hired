import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
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
  
  const NUDGE_PX = 95;
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
      
      {/* LAYER 1: Base UI */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
        <div style={{marginBottom: 16}}>
          <TypingIndicator sender={typingSender} visible={showTyping} />
        </div>
        {/* Show DM input when DM message is sent */}
        <TypingInputBox channelName={dmVisible ? "Demi" : "marketing"} />
      </AbsoluteFill>
      
      {/* LAYER 2: Chat bubbles */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBottom: 230,
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
          
          // Special styling for DM message
          const isDM = msg.id === 17;
          
          return (
            <div key={msg.id} style={{position: 'relative'}}>
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
              />
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
