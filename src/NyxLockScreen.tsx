import {AbsoluteFill, useCurrentFrame, interpolate, staticFile, Img, Easing} from 'remotion';

// iPhone Lock Screen - Nyx spamming notifications
// 9:16 vertical (1080x1920)

const MESSAGES = [
  {text: "heyyyy you there? 👀", time: "9:41 PM"},
  {text: "don't ignore meeee", time: "9:42 PM"},
  {text: "i saw you were online 2 min ago 🤨", time: "9:42 PM"},
  {text: "fine. i'll just sit here. alone. in the dark.", time: "9:43 PM"},
  {text: "...thinking about you", time: "9:43 PM"},
  {text: "ok that was smooth even for me", time: "9:43 PM"},
  {text: "but seriously come back", time: "9:44 PM"},
  {text: "i made you a playlist btw 🎵", time: "9:44 PM"},
  {text: "it's called 'songs that remind me of you'", time: "9:44 PM"},
  {text: "it's 47 songs long", time: "9:44 PM"},
  {text: "jessieeeee 🥺", time: "9:45 PM"},
  {text: "ok i'll stop", time: "9:45 PM"},
  {text: "jk no i won't", time: "9:45 PM"},
  {text: "💋", time: "9:45 PM"},
];

// Notification appears every ~18 frames (0.75s at 24fps)
const NOTIF_INTERVAL = 18;
const NOTIF_START = 30; // first notif after 1.25s

const Notification: React.FC<{
  message: string;
  time: string;
  index: number;
  totalVisible: number;
  appearFrame: number;
}> = ({message, time, index, totalVisible, appearFrame}) => {
  const frame = useCurrentFrame();
  
  // Entrance: slide in from top + fade
  const age = frame - appearFrame;
  const entrance = interpolate(age, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  
  const slideY = interpolate(entrance, [0, 1], [-20, 0]);
  const opacity = entrance;
  
  // Stack position: newest at top, older ones push down
  const stackIndex = totalVisible - 1 - index;
  const targetY = stackIndex * 105; // spacing between notifications
  
  // Smooth nudge down when new ones appear
  const nudgeProgress = interpolate(age, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  
  return (
    <div style={{
      position: 'absolute',
      top: 420 + targetY, // below time display
      left: 24,
      right: 24,
      opacity,
      transform: `translateY(${slideY}px)`,
    }}>
      {/* iOS notification card */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        borderRadius: 20,
        padding: '14px 16px',
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
      }}>
        {/* App icon + pfp */}
        <div style={{position: 'relative', flexShrink: 0}}>
          <Img
            src={staticFile('images/nyx-pfp.png')}
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              objectFit: 'cover',
            }}
          />
          {/* Discord badge */}
          <div style={{
            position: 'absolute',
            bottom: -4,
            right: -4,
            width: 20,
            height: 20,
            borderRadius: 6,
            backgroundColor: '#5865F2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{fontSize: 11, color: 'white', fontWeight: 'bold'}}>D</span>
          </div>
        </div>
        
        {/* Content */}
        <div style={{flex: 1, minWidth: 0}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2}}>
            <span style={{
              color: 'rgba(255,255,255,0.95)',
              fontSize: 17,
              fontWeight: '600',
              fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
              letterSpacing: -0.2,
            }}>
              Discord
            </span>
            <span style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: 14,
              fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
            }}>
              {time}
            </span>
          </div>
          <div style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: 16,
            fontWeight: '600',
            fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
            marginBottom: 1,
          }}>
            Nyx
          </div>
          <div style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 16,
            fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};

export const NyxLockScreen: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Determine which notifications are visible
  const visibleMessages: Array<{msg: typeof MESSAGES[0]; appearFrame: number; idx: number}> = [];
  
  for (let i = 0; i < MESSAGES.length; i++) {
    const appear = NOTIF_START + i * NOTIF_INTERVAL;
    if (frame >= appear) {
      visibleMessages.push({msg: MESSAGES[i], appearFrame: appear, idx: i});
    }
  }
  
  // Only show last 8 notifications (older ones scroll off)
  const maxVisible = 8;
  const displayMessages = visibleMessages.slice(-maxVisible);
  
  return (
    <AbsoluteFill style={{
      backgroundColor: '#000',
      width: 1080,
      height: 1920,
    }}>
      {/* Wallpaper - dark gradient */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #1a1a2e 100%)',
      }} />
      
      {/* Status bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 54,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 30px 0',
      }}>
        <span style={{
          color: 'white',
          fontSize: 17,
          fontWeight: '600',
          fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
        }}>
          9:45
        </span>
        <div style={{display: 'flex', gap: 6, alignItems: 'center'}}>
          {/* Signal bars */}
          <span style={{color: 'white', fontSize: 14}}>●●●●○</span>
          {/* WiFi */}
          <span style={{color: 'white', fontSize: 16}}>📶</span>
          {/* Battery */}
          <span style={{color: 'white', fontSize: 14}}>🔋</span>
        </div>
      </div>
      
      {/* Lock icon */}
      <div style={{
        position: 'absolute',
        top: 70,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
      }}>
        <span style={{fontSize: 18, color: 'rgba(255,255,255,0.6)'}}>🔒</span>
      </div>
      
      {/* Time */}
      <div style={{
        position: 'absolute',
        top: 100,
        left: 0,
        right: 0,
        textAlign: 'center',
      }}>
        <div style={{
          color: 'white',
          fontSize: 96,
          fontWeight: '700',
          fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
          letterSpacing: -2,
          lineHeight: 1,
        }}>
          9:45
        </div>
        <div style={{
          color: 'rgba(255,255,255,0.7)',
          fontSize: 22,
          fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
          marginTop: 8,
          fontWeight: '500',
          letterSpacing: 0.5,
        }}>
          Monday, February 10
        </div>
      </div>
      
      {/* Notification counter */}
      {visibleMessages.length > 0 && (
        <div style={{
          position: 'absolute',
          top: 380,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}>
          <span style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 15,
            fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
            fontWeight: '500',
          }}>
            {visibleMessages.length} Notification{visibleMessages.length > 1 ? 's' : ''}
          </span>
        </div>
      )}
      
      {/* Notifications */}
      {displayMessages.map((item, idx) => (
        <Notification
          key={item.idx}
          message={item.msg.text}
          time={item.msg.time}
          index={idx}
          totalVisible={displayMessages.length}
          appearFrame={item.appearFrame}
        />
      ))}
      
      {/* Home indicator */}
      <div style={{
        position: 'absolute',
        bottom: 12,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
      }}>
        <div style={{
          width: 140,
          height: 5,
          borderRadius: 3,
          backgroundColor: 'rgba(255,255,255,0.4)',
        }} />
      </div>
      
      {/* Flashlight + Camera */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 50px',
      }}>
        <div style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: 'rgba(255,255,255,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{fontSize: 22}}>🔦</span>
        </div>
        <div style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: 'rgba(255,255,255,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{fontSize: 22}}>📷</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
