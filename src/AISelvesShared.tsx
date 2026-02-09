import {useCurrentFrame, interpolate} from 'remotion';

// Types
export interface Message {
  id: number;
  sender: string;
  role: string;
  text: string;
  isBot: boolean;
  appearFrame: number;
  holdFrames: number;
  hasImage?: boolean;
  imageUrl?: string;
}

// Colors
export const COLORS = {
  bg: '#1a1a1a',
  channelBg: '#111111',
  messageBg: '#222222',
  text: '#ffffff',
  textMuted: '#888888',
  textDark: '#666666',
  accent: '#C2BEFF', // pika purple
  accentYellow: '#FEFBCF',
  botBadge: '#5865F2',
  inputBg: '#222222',
  inputBorder: '#444444',
};

// Profile pics - placeholder colors
export const PROFILE_COLORS: Record<string, string> = {
  'Demi': '#FF6B6B',
  'Semi': '#4ECDC4',
  'Matan': '#45B7D1',
  'Ryan': '#F39C12',
  'Jessie_JJ': '#9B59B6',
  'Nyx': '#E91E63',
  'Anthony': '#2ECC71',
  'Leti': '#3498DB',
};

// Margin to align with typing box
export const SIDE_MARGIN = 48;

// Message component - scaled 2x
export const MessageBubble: React.FC<{
  message: Message;
  opacity: number;
}> = ({message, opacity}) => {
  return (
    <div style={{
      display: 'flex',
      gap: 24,
      padding: `16px ${SIDE_MARGIN}px`,
      opacity,
    }}>
      {/* Profile pic - 2x size */}
      <div style={{
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: PROFILE_COLORS[message.sender] || '#666',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 36,
      }}>
        {message.sender[0]}
      </div>
      
      {/* Content */}
      <div style={{flex: 1}}>
        {/* Header */}
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8}}>
          <span style={{
            color: COLORS.text,
            fontWeight: 'bold',
            fontSize: 32,
          }}>
            {message.sender}
          </span>
          {message.isBot && (
            <span style={{
              backgroundColor: COLORS.botBadge,
              color: 'white',
              padding: '4px 10px',
              borderRadius: 6,
              fontSize: 18,
              fontWeight: 'bold',
            }}>
              BOT
            </span>
          )}
          <span style={{
            color: COLORS.textMuted,
            fontSize: 24,
          }}>
            {message.role}
          </span>
        </div>
        
        {/* Message text - 2x size */}
        <div style={{
          color: COLORS.text,
          fontSize: 32,
          lineHeight: 1.4,
        }}>
          {message.text}
        </div>
      </div>
    </div>
  );
};

// Typing indicator - scaled 2x
export const TypingIndicator: React.FC<{sender: string; visible: boolean}> = ({sender, visible}) => {
  const frame = useCurrentFrame();
  if (!visible) return null;
  
  return (
    <div style={{
      display: 'flex',
      gap: 24,
      padding: `16px ${SIDE_MARGIN}px`,
      opacity: 0.7,
    }}>
      <div style={{
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: PROFILE_COLORS[sender] || '#666',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 36,
      }}>
        {sender[0]}
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              width: 16,
              height: 16,
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

// Slack typing input box - scaled 2x, aligned with messages
export const TypingInputBox: React.FC<{channelName: string}> = ({channelName}) => {
  return (
    <div style={{
      margin: `0 ${SIDE_MARGIN}px ${SIDE_MARGIN}px ${SIDE_MARGIN}px`,
      backgroundColor: COLORS.inputBg,
      border: `2px solid ${COLORS.inputBorder}`,
      borderRadius: 16,
      overflow: 'hidden',
    }}>
      {/* Formatting toolbar */}
      <div style={{
        display: 'flex',
        gap: 8,
        padding: '12px 20px',
        borderBottom: `2px solid ${COLORS.inputBorder}`,
      }}>
        {['B', 'I', 'U', 'S', '🔗', '☰', '•', '1.', '</>'].map((icon, i) => (
          <div key={i} style={{
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: COLORS.textMuted,
            fontSize: 22,
            fontWeight: icon === 'B' ? 'bold' : 'normal',
            fontStyle: icon === 'I' ? 'italic' : 'normal',
            textDecoration: icon === 'U' ? 'underline' : icon === 'S' ? 'line-through' : 'none',
          }}>
            {icon}
          </div>
        ))}
      </div>
      
      {/* Input area */}
      <div style={{
        padding: '20px 24px',
        color: COLORS.textDark,
        fontSize: 28,
      }}>
        Message #{channelName}
      </div>
      
      {/* Bottom toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 20px',
      }}>
        <div style={{display: 'flex', gap: 16}}>
          {['+', 'Aa', '😊', '@', '📎', '🎤'].map((icon, i) => (
            <div key={i} style={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: COLORS.textMuted,
              fontSize: 26,
            }}>
              {icon}
            </div>
          ))}
        </div>
        <div style={{
          width: 48,
          height: 48,
          backgroundColor: COLORS.inputBorder,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: COLORS.textMuted,
          fontSize: 24,
        }}>
          ▶
        </div>
      </div>
    </div>
  );
};

// Emoji reaction component
export const EmojiReaction: React.FC<{
  emoji: string;
  sender: string;
  delay: number;
}> = ({emoji, sender, delay}) => {
  const frame = useCurrentFrame();
  const appearProgress = interpolate(
    frame - delay,
    [0, 8],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  
  const scale = interpolate(
    frame - delay,
    [0, 6, 10],
    [0, 1.2, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      backgroundColor: '#333',
      padding: '4px 8px',
      borderRadius: 12,
      opacity: appearProgress,
      transform: `scale(${scale})`,
    }}>
      <span style={{fontSize: 24}}>{emoji}</span>
      <span style={{fontSize: 14, color: COLORS.textMuted}}>{sender}</span>
    </div>
  );
};
