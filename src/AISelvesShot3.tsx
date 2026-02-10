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
