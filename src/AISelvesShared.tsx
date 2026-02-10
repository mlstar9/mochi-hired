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
  'Raccoon 2.0': '#45B7D1', // Matan's AI
  'Ryan': '#F39C12',
  'Jessie_JJ': '#9B59B6',
  'Nyx': '#E91E63',
  'Anthony': '#2ECC71',
  'Mochi': '#3498DB', // me!
};

// Profile images (use staticFile paths)
export const PROFILE_IMAGES: Record<string, string> = {
  'Mochi': 'images/mochi-pfp.png', // me!
  'Raccoon 2.0': 'images/matan-ai.png', // Matan's AI (Raccoon 2.0)
};

// Margin to align with typing box
export const SIDE_MARGIN = 48;

// Channel header component - Slack style
export const ChannelHeader: React.FC<{channelName: string; memberCount?: number}> = ({
  channelName,
  memberCount = 12,
}) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: `16px ${SIDE_MARGIN}px`,
      borderBottom: `1px solid ${COLORS.inputBorder}`,
      backgroundColor: COLORS.bg,
    }}>
      <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
        <span style={{
          color: COLORS.textBold,
          fontSize: 32,
          fontWeight: 'bold',
          fontFamily: FONTS.slack,
        }}>
          # {channelName}
        </span>
        <span style={{
          color: COLORS.textMuted,
          fontSize: 24,
          fontFamily: FONTS.slack,
        }}>
          |
        </span>
        <span style={{
          color: COLORS.textMuted,
          fontSize: 24,
          fontFamily: FONTS.slack,
        }}>
          {memberCount} members
        </span>
      </div>
      {/* Right side icons */}
      <div style={{display: 'flex', gap: 16}}>
        {['🔍', '📌', '👤'].map((icon, i) => (
          <span key={i} style={{fontSize: 24, opacity: 0.6}}>{icon}</span>
        ))}
      </div>
    </div>
  );
};

// Message component - Slack style with entrance animation
// isGrouped: when true, hides avatar/name (consecutive msgs from same sender)
export const MessageBubble: React.FC<{
  message: Message;
  opacity: number;
  entranceProgress?: number; // 0-1, controls slide-up + fade
  isGrouped?: boolean; // true = consecutive msg from same sender, hide avatar/name
}> = ({message, opacity, entranceProgress = 1, isGrouped = false}) => {
  const hasImage = PROFILE_IMAGES[message.sender];
  
  // Slack-style entrance: subtle slide up (10px) + fade
  const slideY = interpolate(entranceProgress, [0, 1], [10, 0], { extrapolateRight: 'clamp' });
  const fadeOpacity = opacity * entranceProgress;
  
  // Grouped messages: just show text, aligned with previous msg
  if (isGrouped) {
    return (
      <div style={{
        padding: `2px ${SIDE_MARGIN}px 2px ${SIDE_MARGIN + 88}px`, // indent to align with text
        opacity: fadeOpacity,
        transform: `translateY(${slideY}px)`,
      }}>
        <div style={{
          color: COLORS.text,
          fontSize: 30,
          lineHeight: 1.46,
          fontFamily: FONTS.slack,
        }}>
          {message.text}
        </div>
      </div>
    );
  }
  
  return (
    <div style={{
      display: 'flex',
      gap: 16,
      padding: `8px ${SIDE_MARGIN}px`,
      opacity: fadeOpacity,
      transform: `translateY(${slideY}px)`,
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

// Typing indicator - Slack style: "xxx is typing" text ABOVE input box
// Always renders with fixed height to prevent layout shift
export const TypingIndicator: React.FC<{sender: string; visible: boolean}> = ({sender, visible}) => {
  return (
    <div style={{
      padding: `4px ${SIDE_MARGIN}px 8px`,
      color: COLORS.textMuted,
      fontSize: 22,
      fontFamily: FONTS.slack,
      height: 34,
      opacity: visible ? 1 : 0,
    }}>
      <span style={{fontWeight: 'bold', color: COLORS.text}}>{sender}</span> is typing...
    </div>
  );
};

// Slack typing input box - matches real Slack UI
export const TypingInputBox: React.FC<{channelName: string}> = ({channelName}) => {
  return (
    <div style={{
      margin: `0 ${SIDE_MARGIN}px 16px ${SIDE_MARGIN}px`,
      backgroundColor: COLORS.inputBg,
      border: `1px solid ${COLORS.inputBorder}`,
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      {/* Formatting toolbar - matches real Slack */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        padding: '8px 12px',
        borderBottom: `1px solid ${COLORS.inputBorder}`,
      }}>
        {/* Text formatting: B I U S */}
        {['B', 'I', 'U', 'S'].map((icon, i) => (
          <div key={i} style={{
            width: 32,
            height: 32,
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
        {/* Divider */}
        <div style={{width: 1, height: 20, backgroundColor: COLORS.inputBorder, margin: '0 8px'}} />
        {/* Link, lists, code */}
        {['🔗', '1≡', '•≡', '</>', '⌘'].map((icon, i) => (
          <div key={i} style={{
            width: 32,
            height: 32,
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
      
      {/* Input area */}
      <div style={{
        padding: '14px 16px',
        color: COLORS.textDark,
        fontSize: 24,
        fontFamily: FONTS.slack,
      }}>
        Message #{channelName}
      </div>
      
      {/* Bottom toolbar - matches real Slack */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
      }}>
        <div style={{display: 'flex', alignItems: 'center', gap: 4}}>
          {/* + button */}
          <div style={{
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: COLORS.textMuted,
            fontSize: 24,
            fontWeight: 'bold',
          }}>
            +
          </div>
          {/* Divider */}
          <div style={{width: 1, height: 20, backgroundColor: COLORS.inputBorder, margin: '0 6px'}} />
          {/* Aa, emoji, @, attachments, mic */}
          {['Aa', '😊', '@', '📎', '🎤'].map((icon, i) => (
            <div key={i} style={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: COLORS.textMuted,
              fontSize: icon === 'Aa' ? 16 : 20,
              fontFamily: FONTS.slack,
            }}>
              {icon}
            </div>
          ))}
          {/* Divider */}
          <div style={{width: 1, height: 20, backgroundColor: COLORS.inputBorder, margin: '0 6px'}} />
          {/* Drive, checkbox */}
          {['📁', '☑'].map((icon, i) => (
            <div key={i} style={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: COLORS.textMuted,
              fontSize: 18,
            }}>
              {icon}
            </div>
          ))}
        </div>
        {/* Send button - green like Slack */}
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div style={{
            height: 36,
            padding: '0 12px',
            backgroundColor: '#007a5a', // Slack green
            borderRadius: '6px 0 0 6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 18,
          }}>
            ▶
          </div>
          <div style={{
            height: 36,
            width: 28,
            backgroundColor: '#007a5a',
            borderLeft: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '0 6px 6px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 12,
          }}>
            ▼
          </div>
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
