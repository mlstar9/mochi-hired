import {useCurrentFrame, interpolate, staticFile, Img} from 'remotion';

// Font face declarations (load via CSS in remotion.config.ts or use staticFile)
// Primary: Telka-Extended (headings, bold text)
// Mono: SpaceMono (chat text, UI)

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

// Pika Brand Colors
export const COLORS = {
  bg: '#111111', // pika black
  channelBg: '#111111',
  messageBg: '#1a1a1a',
  text: '#ffffff',
  textMuted: '#888888',
  textDark: '#666666',
  accent: '#C2BEFF', // pika purple
  accentYellow: '#FEFBCF', // pika yellow
  accentBeige: '#FDF7EF', // pika beige
  botBadge: '#C2BEFF', // use pika purple for bot badge
  inputBg: '#1a1a1a',
  inputBorder: '#333333',
};

// Fonts
export const FONTS = {
  // Pika brand (for end card only)
  primary: "'Telka-Extended', sans-serif",
  mono: "'Space Mono', 'SpaceMono', monospace",
  // Slack default font (for chat UI)
  slack: "Lato, 'Helvetica Neue', Helvetica, Arial, sans-serif",
};

// Profile pics - colors and images
export const PROFILE_COLORS: Record<string, string> = {
  'Demi': '#FF6B6B',
  'Semi': '#4ECDC4',
  'Matan': '#45B7D1',
  'Ryan': '#F39C12',
  'Jessie_JJ': '#9B59B6',
  'Nyx': '#E91E63',
  'Anthony': '#2ECC71',
  'Mochi': '#3498DB', // me!
};

// Profile images (use staticFile paths)
export const PROFILE_IMAGES: Record<string, string> = {
  'Mochi': 'images/mochi-pfp.png', // me!
};

// Margin to align with typing box
export const SIDE_MARGIN = 48;

// Message component - scaled 2x, Pika brand fonts
export const MessageBubble: React.FC<{
  message: Message;
  opacity: number;
}> = ({message, opacity}) => {
  const hasImage = PROFILE_IMAGES[message.sender];
  
  return (
    <div style={{
      display: 'flex',
      gap: 24,
      padding: `16px ${SIDE_MARGIN}px`,
      opacity,
    }}>
      {/* Profile pic - 2x size */}
      {hasImage ? (
        <Img
          src={staticFile(PROFILE_IMAGES[message.sender])}
          style={{
            width: 80,
            height: 80,
            borderRadius: 12,
            objectFit: 'cover',
            flexShrink: 0,
          }}
        />
      ) : (
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
          fontFamily: FONTS.slack,
        }}>
          {message.sender[0]}
        </div>
      )}
      
      {/* Content */}
      <div style={{flex: 1}}>
        {/* Header */}
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8}}>
          <span style={{
            color: COLORS.text,
            fontWeight: 'bold',
            fontSize: 28,
            fontFamily: FONTS.slack,
          }}>
            {message.sender}
          </span>
          {message.isBot && (
            <span style={{
              backgroundColor: COLORS.botBadge,
              color: '#111111',
              padding: '4px 12px',
              borderRadius: 6,
              fontSize: 16,
              fontWeight: 'bold',
              fontFamily: FONTS.slack,
              letterSpacing: 1,
            }}>
              AI
            </span>
          )}
          <span style={{
            color: COLORS.textMuted,
            fontSize: 20,
            fontFamily: FONTS.slack,
          }}>
            {message.role}
          </span>
        </div>
        
        {/* Message text - SpaceMono for chat */}
        <div style={{
          color: COLORS.text,
          fontSize: 28,
          lineHeight: 1.5,
          fontFamily: FONTS.slack,
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
  
  const hasImage = PROFILE_IMAGES[sender];
  
  return (
    <div style={{
      display: 'flex',
      gap: 24,
      padding: `16px ${SIDE_MARGIN}px`,
      opacity: 0.7,
    }}>
      {hasImage ? (
        <Img
          src={staticFile(PROFILE_IMAGES[sender])}
          style={{
            width: 80,
            height: 80,
            borderRadius: 12,
            objectFit: 'cover',
            flexShrink: 0,
          }}
        />
      ) : (
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
      )}
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

// Slack typing input box - scaled 2x, aligned with messages, Pika fonts
export const TypingInputBox: React.FC<{channelName: string}> = ({channelName}) => {
  return (
    <div style={{
      margin: `0 ${SIDE_MARGIN}px ${SIDE_MARGIN}px ${SIDE_MARGIN}px`,
      backgroundColor: COLORS.inputBg,
      border: `1px solid ${COLORS.inputBorder}`,
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      {/* Formatting toolbar */}
      <div style={{
        display: 'flex',
        gap: 4,
        padding: '10px 16px',
        borderBottom: `1px solid ${COLORS.inputBorder}`,
      }}>
        {['B', 'I', 'U', 'S', '🔗', '☰', '•', '1.', '</>'].map((icon, i) => (
          <div key={i} style={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: COLORS.textMuted,
            fontSize: 18,
            fontFamily: FONTS.slack,
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
        padding: '16px 20px',
        color: COLORS.textDark,
        fontSize: 24,
        fontFamily: FONTS.slack,
      }}>
        Message #{channelName}
      </div>
      
      {/* Bottom toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 16px',
      }}>
        <div style={{display: 'flex', gap: 12}}>
          {['+', 'Aa', '😊', '@', '📎', '🎤'].map((icon, i) => (
            <div key={i} style={{
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: COLORS.textMuted,
              fontSize: 22,
            }}>
              {icon}
            </div>
          ))}
        </div>
        <div style={{
          width: 40,
          height: 40,
          backgroundColor: COLORS.accent,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#111111',
          fontSize: 20,
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
