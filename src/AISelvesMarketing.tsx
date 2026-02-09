import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Img, staticFile} from 'remotion';

// Types
interface Message {
  id: number;
  sender: string;
  role: string;
  text: string;
  isBot: boolean;
  appearFrame: number;
  holdFrames: number;
}

// Colors
const COLORS = {
  bg: '#1a1a1a',
  channelBg: '#111111',
  messageBg: '#222222',
  text: '#ffffff',
  textMuted: '#888888',
  textDark: '#666666',
  accent: '#C2BEFF', // pika purple
  botBadge: '#5865F2',
  inputBg: '#222222',
  inputBorder: '#444444',
};

// Slack typing input box
const TypingInputBox: React.FC<{channelName: string}> = ({channelName}) => {
  return (
    <div style={{
      margin: '0 24px 24px 24px',
      backgroundColor: COLORS.inputBg,
      border: `1px solid ${COLORS.inputBorder}`,
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      {/* Formatting toolbar */}
      <div style={{
        display: 'flex',
        gap: 4,
        padding: '8px 12px',
        borderBottom: `1px solid ${COLORS.inputBorder}`,
      }}>
        {['B', 'I', 'U', 'S', '🔗', '⋮≡', '•≡', '1≡', '</>'].map((icon, i) => (
          <div key={i} style={{
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: COLORS.textMuted,
            fontSize: 14,
            fontWeight: icon === 'B' ? 'bold' : icon === 'I' ? 'normal' : 'normal',
            fontStyle: icon === 'I' ? 'italic' : 'normal',
            textDecoration: icon === 'U' ? 'underline' : icon === 'S' ? 'line-through' : 'none',
          }}>
            {icon}
          </div>
        ))}
      </div>
      
      {/* Input area */}
      <div style={{
        padding: '12px 16px',
        color: COLORS.textDark,
        fontSize: 16,
      }}>
        Message #{channelName}
      </div>
      
      {/* Bottom toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
      }}>
        <div style={{display: 'flex', gap: 8}}>
          {['+', 'Aa', '😊', '@', '📎', '🎤'].map((icon, i) => (
            <div key={i} style={{
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: COLORS.textMuted,
              fontSize: 16,
            }}>
              {icon}
            </div>
          ))}
        </div>
        <div style={{
          width: 32,
          height: 32,
          backgroundColor: COLORS.inputBorder,
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: COLORS.textMuted,
          fontSize: 16,
        }}>
          ▶
        </div>
      </div>
    </div>
  );
};

// Profile pics - placeholder colors for now
const PROFILE_COLORS: Record<string, string> = {
  'Demi': '#FF6B6B',
  'Semi': '#4ECDC4',
  'Matan': '#45B7D1',
  'Ryan': '#F39C12',
  'Jessie_JJ': '#9B59B6',
  'Nyx': '#E91E63',
  'Anthony': '#2ECC71',
  'Leti': '#3498DB',
};

// Message component
const MessageBubble: React.FC<{
  message: Message;
  opacity: number;
}> = ({message, opacity}) => {
  return (
    <div style={{
      display: 'flex',
      gap: 16,
      padding: '12px 24px',
      opacity,
    }}>
      {/* Profile pic */}
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: PROFILE_COLORS[message.sender] || '#666',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
      }}>
        {message.sender[0]}
      </div>
      
      {/* Content */}
      <div style={{flex: 1}}>
        {/* Header */}
        <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4}}>
          <span style={{
            color: COLORS.text,
            fontWeight: 'bold',
            fontSize: 18,
          }}>
            {message.sender}
          </span>
          {message.isBot && (
            <span style={{
              backgroundColor: COLORS.botBadge,
              color: 'white',
              padding: '2px 6px',
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 'bold',
            }}>
              BOT
            </span>
          )}
          <span style={{
            color: COLORS.textMuted,
            fontSize: 14,
          }}>
            {message.role}
          </span>
        </div>
        
        {/* Message text */}
        <div style={{
          color: COLORS.text,
          fontSize: 18,
          lineHeight: 1.5,
        }}>
          {message.text}
        </div>
      </div>
    </div>
  );
};

// Typing indicator
const TypingIndicator: React.FC<{sender: string; visible: boolean}> = ({sender, visible}) => {
  const frame = useCurrentFrame();
  if (!visible) return null;
  
  return (
    <div style={{
      display: 'flex',
      gap: 16,
      padding: '12px 24px',
      opacity: 0.7,
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: PROFILE_COLORS[sender] || '#666',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
      }}>
        {sender[0]}
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: COLORS.textMuted,
              opacity: interpolate(
                (frame + i * 6) % 24,
                [0, 12, 24],
                [0.3, 1, 0.3]
              ),
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Shot 1 messages
const SHOT1_MESSAGES: Message[] = [
  {
    id: 1,
    sender: 'Demi',
    role: 'CEO',
    text: 'We need a marketing video for AI Selves. Who\'s on it?',
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

// Calculate total frames for shot 1
const SHOT1_DURATION = 24 + 60 + 10 + 48 + 10 + 72 + 24; // ~248 frames (~10s)

export const AISelvesMarketing: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  
  // Calculate which messages are visible and chat offset
  let chatOffset = 0;
  const BUBBLE_HEIGHT = 92; // exact height to reveal 1 bubble
  const NUDGE_FRAMES = 10; // 10 frames at 24fps
  
  const visibleMessages = SHOT1_MESSAGES.filter(msg => frame >= msg.appearFrame);
  
  // Calculate offset based on messages shown
  visibleMessages.forEach((msg, idx) => {
    if (idx > 0) {
      const nudgeProgress = interpolate(
        frame,
        [msg.appearFrame, msg.appearFrame + NUDGE_FRAMES],
        [0, 1],
        {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
      );
      chatOffset += BUBBLE_HEIGHT * nudgeProgress;
    }
  });
  
  // Show typing indicator before next message
  const nextMessage = SHOT1_MESSAGES.find(msg => frame < msg.appearFrame && frame >= msg.appearFrame - 20);
  const showTyping = nextMessage !== undefined;
  const typingSender = nextMessage?.sender || '';
  
  return (
    <AbsoluteFill style={{
      backgroundColor: COLORS.bg,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Messages container - scaled up for tighter crop */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBottom: 16,
        transform: `translateY(-${chatOffset}px) scale(1.15)`,
        transformOrigin: 'center bottom',
      }}>
        {SHOT1_MESSAGES.map(msg => {
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
        
        {/* Typing indicator */}
        <TypingIndicator sender={typingSender} visible={showTyping} />
      </div>
      
      {/* Slack typing input box at bottom */}
      <TypingInputBox channelName="marketing" />
    </AbsoluteFill>
  );
};
