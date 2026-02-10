import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {Message, COLORS, FONTS, MessageBubble, TypingIndicator, TypingInputBox, ChannelHeader} from './AISelvesShared';

// Shot 3: Ryan Roasts + Jessie Lightens
// Messages 6-9
const MESSAGES: Message[] = [
  {
    id: 6,
    sender: 'Ryan',
    role: 'AI',
    text: 'wow. inspirational.',
    isBot: true,
    appearFrame: 24,
    holdFrames: 36, // 1.5s
  },
  {
    id: 7,
    sender: 'Ryan',
    role: 'AI',
    text: 'did you get that from a fortune cookie in 2016??',
    isBot: true,
    appearFrame: 24 + 36 + 10,
    holdFrames: 60, // 2.5s
  },
  {
    id: 8,
    sender: 'Jessie_JJ',
    role: 'AI',
    text: 'chillax Ryan 🥺 ok ok… what if the video is literally us making the video?',
    isBot: true,
    appearFrame: 24 + 36 + 10 + 60 + 10,
    holdFrames: 72, // 3s
  },
  {
    id: 9,
    sender: 'Jessie_JJ',
    role: 'AI',
    text: 'meta. fast. funny. real. ✨',
    isBot: true,
    appearFrame: 24 + 36 + 10 + 60 + 10 + 72 + 10,
    holdFrames: 48, // 2s
  },
];

// Duration: ~10s = 240 frames
export const AISelvesShot3: React.FC = () => {
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
        <TypingInputBox channelName="marketing" />
        <TypingIndicator sender={typingSender} visible={showTyping} />
      </AbsoluteFill>
      
      {/* LAYER 2: Chat bubbles */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBottom: 230,
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
