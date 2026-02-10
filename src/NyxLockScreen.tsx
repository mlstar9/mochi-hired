import {AbsoluteFill, useCurrentFrame, interpolate, staticFile, Img, Easing} from 'remotion';

// iPhone 17 Pro Max Lock Screen - Nyx spamming notifications
// 9:16 vertical (1320x2868 native, we render at 1080x1920 for video)
// iOS 26 Liquid Glass aesthetic

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

const NOTIF_INTERVAL = 18;
const NOTIF_START = 30;

// iOS 26 Liquid Glass notification
const Notification: React.FC<{
  message: string;
  time: string;
  index: number;
  totalVisible: number;
  appearFrame: number;
}> = ({message, time, index, totalVisible, appearFrame}) => {
  const frame = useCurrentFrame();
  
  const age = frame - appearFrame;
  const entrance = interpolate(age, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  
  const slideY = interpolate(entrance, [0, 1], [-30, 0]);
  const opacity = entrance;
  
  const stackIndex = totalVisible - 1 - index;
  const targetY = stackIndex * 100;
  
  return (
    <div style={{
      position: 'absolute',
      top: 440 + targetY,
      left: 20,
      right: 20,
      opacity,
      transform: `translateY(${slideY}px)`,
    }}>
      {/* iOS 26 Liquid Glass notification card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.12) 100%)',
        borderRadius: 24,
        padding: '14px 16px',
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        border: '0.5px solid rgba(255,255,255,0.2)',
        boxShadow: '0 2px 16px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.15)',
      }}>
        {/* App icon + pfp */}
        <div style={{position: 'relative', flexShrink: 0}}>
          <Img
            src={staticFile('images/nyx-pfp.png')}
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              objectFit: 'cover',
            }}
          />
          {/* Discord badge - iOS 26 style with slight glass effect */}
          <div style={{
            position: 'absolute',
            bottom: -4,
            right: -4,
            width: 20,
            height: 20,
            borderRadius: 7,
            backgroundColor: '#5865F2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1.5px solid rgba(0,0,0,0.15)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}>
            <svg width="12" height="9" viewBox="0 0 24 18" fill="white">
              <path d="M20.317 1.492a19.7 19.7 0 0 0-4.885-1.492.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.7 19.7 0 0 0 3.677 1.492.07.07 0 0 0 3.645 1.52C.533 6.093-.32 10.555.099 14.961a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.8 19.8 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.02z"/>
            </svg>
          </div>
        </div>
        
        {/* Content */}
        <div style={{flex: 1, minWidth: 0}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2}}>
            <span style={{
              color: 'rgba(255,255,255,0.95)',
              fontSize: 16,
              fontWeight: '600',
              fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif",
              letterSpacing: -0.2,
            }}>
              Discord
            </span>
            <span style={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: 13,
              fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
              fontWeight: '400',
            }}>
              {time}
            </span>
          </div>
          <div style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: 15,
            fontWeight: '600',
            fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
            marginBottom: 2,
            letterSpacing: -0.1,
          }}>
            Nyx
          </div>
          <div style={{
            color: 'rgba(255,255,255,0.65)',
            fontSize: 15,
            fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontWeight: '400',
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
  
  const visibleMessages: Array<{msg: typeof MESSAGES[0]; appearFrame: number; idx: number}> = [];
  
  for (let i = 0; i < MESSAGES.length; i++) {
    const appear = NOTIF_START + i * NOTIF_INTERVAL;
    if (frame >= appear) {
      visibleMessages.push({msg: MESSAGES[i], appearFrame: appear, idx: i});
    }
  }
  
  const maxVisible = 8;
  const displayMessages = visibleMessages.slice(-maxVisible);
  
  return (
    <AbsoluteFill style={{
      backgroundColor: '#000',
      width: 1080,
      height: 1920,
    }}>
      {/* Wallpaper - dark moody gradient (iPhone 17 Pro Max deep blue vibes) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(160deg, #0a0a1a 0%, #0d1b2a 25%, #1b2838 45%, #162032 65%, #0a0f1a 100%)',
      }} />
      
      {/* Subtle light leak / bokeh effect */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '20%',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(100,140,200,0.08) 0%, transparent 70%)',
      }} />
      <div style={{
        position: 'absolute',
        top: '60%',
        right: '10%',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(80,60,140,0.06) 0%, transparent 70%)',
      }} />
      
      {/* Dynamic Island */}
      <div style={{
        position: 'absolute',
        top: 12,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 162,
        height: 37,
        borderRadius: 20,
        backgroundColor: '#000',
      }} />
      
      {/* Status bar */}
      <div style={{
        position: 'absolute',
        top: 16,
        left: 0,
        right: 0,
        height: 30,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 32px',
      }}>
        <span style={{
          color: 'white',
          fontSize: 16,
          fontWeight: '600',
          fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
          letterSpacing: 0.5,
        }}>
          9:45
        </span>
        <div style={{display: 'flex', gap: 5, alignItems: 'center'}}>
          {/* Signal */}
          <svg width="18" height="12" viewBox="0 0 18 12">
            <rect x="0" y="8" width="3" height="4" rx="0.5" fill="white"/>
            <rect x="5" y="5" width="3" height="7" rx="0.5" fill="white"/>
            <rect x="10" y="2" width="3" height="10" rx="0.5" fill="white"/>
            <rect x="15" y="0" width="3" height="12" rx="0.5" fill="white"/>
          </svg>
          {/* WiFi */}
          <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
            <path d="M8 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM3.46 7.54a6.42 6.42 0 0 1 9.08 0l.7-.7a7.42 7.42 0 0 0-10.48 0l.7.7zM.93 5.01a9.97 9.97 0 0 1 14.14 0l.7-.7A10.97 10.97 0 0 0 .23 4.31l.7.7z" fillRule="evenodd"/>
          </svg>
          {/* Battery */}
          <div style={{display: 'flex', alignItems: 'center', gap: 1}}>
            <div style={{
              width: 25,
              height: 12,
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.5)',
              padding: 1.5,
              position: 'relative',
            }}>
              <div style={{
                width: '70%',
                height: '100%',
                borderRadius: 1.5,
                backgroundColor: 'white',
              }} />
            </div>
            <div style={{
              width: 2,
              height: 5,
              borderRadius: '0 1px 1px 0',
              backgroundColor: 'rgba(255,255,255,0.5)',
            }} />
          </div>
        </div>
      </div>
      
      {/* Lock icon - iOS 26 liquid glass style */}
      <div style={{
        position: 'absolute',
        top: 72,
        left: '50%',
        transform: 'translateX(-50%)',
      }}>
        <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
          <rect x="1" y="7" width="12" height="10" rx="2.5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
          <path d="M4 7V5a3 3 0 0 1 6 0v2" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      
      {/* Time - iOS 26 Liquid Glass clock with subtle refraction */}
      <div style={{
        position: 'absolute',
        top: 110,
        left: 0,
        right: 0,
        textAlign: 'center',
      }}>
        <div style={{
          color: 'white',
          fontSize: 96,
          fontWeight: '200',
          fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
          letterSpacing: -3,
          lineHeight: 1,
          textShadow: '0 0 40px rgba(255,255,255,0.05)',
        }}>
          9:45
        </div>
        <div style={{
          color: 'rgba(255,255,255,0.6)',
          fontSize: 20,
          fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
          marginTop: 6,
          fontWeight: '400',
          letterSpacing: 0.3,
        }}>
          Monday, February 10
        </div>
      </div>
      
      {/* Notification stack label */}
      {visibleMessages.length > 0 && (
        <div style={{
          position: 'absolute',
          top: 400,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}>
          <span style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: 14,
            fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
            fontWeight: '500',
            letterSpacing: 0.3,
            textTransform: 'uppercase',
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
      
      {/* Bottom - Flashlight + Camera (iOS 26 liquid glass buttons) */}
      <div style={{
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 46px',
      }}>
        <div style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
          border: '0.5px solid rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5">
            <path d="M9 18h6M10 22h4M15 2H9L7 8l2 4h6l2-4-2-6z"/>
          </svg>
        </div>
        <div style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
          border: '0.5px solid rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </div>
      </div>
      
      {/* Home indicator */}
      <div style={{
        position: 'absolute',
        bottom: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 140,
        height: 5,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.35)',
      }} />
    </AbsoluteFill>
  );
};
