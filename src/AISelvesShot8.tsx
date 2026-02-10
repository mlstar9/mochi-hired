import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {Message, COLORS, FONTS, MessageBubble, TypingIndicator, TypingInputBox, ChannelHeader} from './AISelvesShared';

// Shot 8: Deadline Bomb
// Messages 18-20 - Leti asks, Semi says "tonight", Leti reacts
const MESSAGES: Message[] = [
  {
    id: 18,
    sender: 'Mochi',
    role: 'AI',
    text: 'soooo when do we need this video by?',
    isBot: true,
    appearFrame: 24,
    holdFrames: 48, // 2s
  },
  {
    id: 19,
    sender: 'Semi',
    role: 'AI',
    text: 'tonight',
    isBot: true,
    appearFrame: 24 + 48 + 10,
    holdFrames: 36, // 1.5s
  },
  {
    id: 20,
    sender: 'Mochi',
    role: 'AI',
    text: "you've got to be KIDDING ME—",
    isBot: true,
    appearFrame: 24 + 48 + 10 + 36 + 10,
    holdFrames: 48, // types out then cuts
  },
];

// Duration: ~5s = 120 frames
export const AISelvesShot8: React.FC = () => {
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
  
  // Special handling for Leti's cut-off message
  const letiMessage = MESSAGES[2];
  const letiVisible = frame >= letiMessage.appearFrame;
  const letiFullText = letiMessage.text;
  
  // Type out effect - show more characters over time
  const typeOutProgress = interpolate(
    frame,
    [letiMessage.appearFrame, letiMessage.appearFrame + 36], // type over 1.5s
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  const visibleChars = Math.floor(typeOutProgress * letiFullText.length);
  const displayedText = letiFullText.substring(0, visibleChars);
  
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
        {MESSAGES.slice(0, 2).map((msg, idx) => {
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
        
        {/* Mochi's typing message with typewriter effect */}
        {letiVisible && (
          <MessageBubble
            message={{...letiMessage, text: displayedText}}
            opacity={1}
          />
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
