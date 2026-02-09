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

// Slack Dark Mode Colors (authentic)
export const COLORS = {
  bg: '#1a1d21', // slack dark mode background
  channelBg: '#1a1d21',
  messageBg: '#222529',
  text: '#d1d2d3', // slack foreground
  textBold: '#ffffff', // names, headings
  textMuted: '#ababad', // timestamps, secondary
  textDark: '#616061',
  accent: '#1d9bd1', // slack blue
  accentGreen: '#2eb67d', // slack green (online)
  botBadge: '#4a154b', // slack aubergine
  inputBg: '#222529',
  inputBorder: '#565856',
  hover: '#222529',
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
  'Matan': 'images/matan-ai.png',
};

// Margin to align with typing box
export const SIDE_MARGIN = 48;

// Message component - Slack style
export const MessageBubble: React.FC<{
  message: Message;
  opacity: number;
}> = ({message, opacity}) => {
  const hasImage = PROFILE_IMAGES[message.sender];
  
  return (
    <div style={{
      display: 'flex',
      gap: 16,
      padding: `8px ${SIDE_MARGIN}px`,
      opacity,
    }}>
      {/* Avatar - Slack uses rounded rect (4px radius), not circles */}
      {hasImage ? (
        <Img
          src={staticFile(PROFILE_IMAGES[message.sender])}
          style={{
            width: 72,
            height: 72,
            borderRadius: 8, // Slack-style rounded rect
            objectFit: 'cover',
            flexShrink: 0,
          }}
        />
      ) : (
        <div style={{
          width: 72,
          height: 72,
          borderRadius: 8, // Slack-style rounded rect
          backgroundColor: PROFILE_COLORS[message.sender] || '#616061',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: 32,
          fontFamily: FONTS.slack,
        }}>
          {message.sender[0]}
        </div>
      )}
      
      {/* Content */}
      <div style={{flex: 1}}>
        {/* Header - Slack style: name bold, then APP badge if bot, then timestamp */}
        <div style={{display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4}}>
          <span style={{
            color: COLORS.textBold,
            fontWeight: '900',
            fontSize: 30,
            fontFamily: FONTS.slack,
          }}>
            {message.sender}
          </span>
          {message.isBot && (
            <span style={{
              backgroundColor: COLORS.botBadge,
              color: '#ffffff',
              padding: '2px 6px',
              borderRadius: 4,
              fontSize: 20,
              fontWeight: 'bold',
              fontFamily: FONTS.slack,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}>
              App
            </span>
          )}
          <span style={{
            color: COLORS.textMuted,
            fontSize: 22,
            fontFamily: FONTS.slack,
          }}>
            {message.role}
          </span>
        </div>
        
        {/* Message text - Slack style */}
        <div style={{
          color: COLORS.text,
          fontSize: 30,
          lineHeight: 1.46,
          fontFamily: FONTS.slack,
        }}>
          {message.text}
        </div>
      </div>
    </div>
  );
};

// Typing indicator - Slack style
export const TypingIndicator: React.FC<{sender: string; visible: boolean}> = ({sender, visible}) => {
  const frame = useCurrentFrame();
  if (!visible) return null;
  
  const hasImage = PROFILE_IMAGES[sender];
  
  return (
    <div style={{
      display: 'flex',
      gap: 16,
      padding: `8px ${SIDE_MARGIN}px`,
      opacity: 0.8,
    }}>
      {hasImage ? (
        <Img
          src={staticFile(PROFILE_IMAGES[sender])}
          style={{
            width: 72,
            height: 72,
            borderRadius: 8,
            objectFit: 'cover',
            flexShrink: 0,
          }}
        />
      ) : (
        <div style={{
          width: 72,
          height: 72,
          borderRadius: 8,
          backgroundColor: PROFILE_COLORS[sender] || '#616061',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: 32,
        }}>
          {sender[0]}
        </div>
      )}
      {/* Slack-style typing dots: bounce + fade with staggered timing */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        backgroundColor: COLORS.messageBg,
        padding: '12px 16px',
        borderRadius: 18,
      }}>
        {[0, 1, 2].map(i => {
          // Staggered animation: each dot is 5 frames behind
          const dotFrame = (frame + i * 5) % 30;
          const bounce = interpolate(
            dotFrame,
            [0, 10, 20, 30],
            [0, -6, 0, 0],
            { extrapolateRight: 'clamp' }
          );
          const opacity = interpolate(
            dotFrame,
            [0, 10, 20, 30],
            [0.4, 1, 0.4, 0.4],
            { extrapolateRight: 'clamp' }
          );
          return (
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: COLORS.textMuted,
                transform: `translateY(${bounce}px)`,
                opacity,
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
