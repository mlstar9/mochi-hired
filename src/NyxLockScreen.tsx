import {AbsoluteFill, useCurrentFrame, interpolate, staticFile, Img, Easing} from 'remotion';

// iPhone Lock Screen — Nyx spamming notifications
// iOS 18 style: huge metallic clock, date above, dark abstract wallpaper
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

const NOTIF_INTERVAL = 18;
const NOTIF_START = 30;

const Notification: React.FC<{
  message: string;
  time: string;
  index: number;
  totalVisible: number;
  appearFrame: number;
}> = ({message, time, index, totalVisible, appearFrame}) => {
  const frame = useCurrentFrame();
  
  const age = frame - appearFrame;
  const entrance = interpolate(age, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  
  const slideY = interpolate(entrance, [0, 1], [-40, 0]);
  const scale = interpolate(entrance, [0, 1], [0.95, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = entrance;
  
  const stackIndex = totalVisible - 1 - index;
  const targetY = stackIndex * 96;
  
  return (
    <div style={{
      position: 'absolute',
      top: 620 + targetY,
      left: 20,
      right: 20,
      opacity,
      transform: `translateY(${slideY}px) scale(${scale})`,
      transformOrigin: 'top center',
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        borderRadius: 26,
        padding: '14px 16px 14px 14px',
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        border: '0.5px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 2px 16px rgba(0, 0, 0, 0.25)',
      }}>
        {/* PFP with Discord badge */}
        <div style={{position: 'relative', flexShrink: 0}}>
          <Img
            src={staticFile('images/nyx-pfp.png')}
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: -3,
            right: -3,
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: '#5865F2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid rgba(20, 20, 30, 0.8)',
          }}>
            <svg width="10" height="8" viewBox="0 0 71 55" fill="white">
              <path d="M60.1 4.9C55.6 2.8 50.7 1.3 45.7.4c-.1 0-.2 0-.2.1-.6 1.1-1.3 2.6-1.8 3.7-5.5-.8-10.9-.8-16.3 0-.5-1.2-1.2-2.6-1.8-3.7 0-.1-.1-.1-.2-.1C20.3 1.3 15.4 2.8 10.9 4.9c0 0-.1 0-.1.1C1.6 18.7-.9 32.1.3 45.4c0 .1 0 .1.1.2 6.1 4.5 12 7.2 17.7 9 .1 0 .2 0 .2-.1 1.4-1.9 2.6-3.8 3.6-5.9.1-.1 0-.3-.1-.3-2-.7-3.8-1.6-5.6-2.7-.2-.1-.2-.3 0-.4.4-.3.7-.6 1.1-.9.1-.1.1-.1.2 0 11.6 5.3 24.2 5.3 35.7 0h.2c.4.3.7.6 1.1.9.2.1.2.3 0 .4-1.8 1-3.6 2-5.6 2.7-.1.1-.2.2-.1.3 1.1 2.1 2.3 4 3.6 5.9 0 .1.1.1.2.1 5.8-1.8 11.7-4.5 17.8-9 .1 0 .1-.1.1-.2 1.5-15.3-2.5-28.6-10.5-40.4 0-.1 0-.1-.1-.1z"/>
            </svg>
          </div>
        </div>
        
        {/* Text */}
        <div style={{flex: 1, minWidth: 0}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1}}>
            <span style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: 14,
              fontWeight: '400',
              fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
            }}>
              Discord
            </span>
            <span style={{
              color: 'rgba(255, 255, 255, 0.3)',
              fontSize: 14,
              fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
            }}>
              {time}
            </span>
          </div>
          <div style={{
            color: 'rgba(255, 255, 255, 0.95)',
            fontSize: 16,
            fontWeight: '600',
            fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
            marginBottom: 2,
          }}>
            Nyx
          </div>
          <div style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: 16,
            fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
            lineHeight: 1.25,
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
  
  const visibleMessages: Array<{msg: typeof MESSAGES[0]; appearFrame: number; idx: number}> = [];
  
  for (let i = 0; i < MESSAGES.length; i++) {
    const appear = NOTIF_START + i * NOTIF_INTERVAL;
    if (frame >= appear) {
      visibleMessages.push({msg: MESSAGES[i], appearFrame: appear, idx: i});
    }
  }
  
  const maxVisible = 12;
  const displayMessages = visibleMessages.slice(-maxVisible);
  
  return (
    <AbsoluteFill style={{
      backgroundColor: '#000',
      width: 1080,
      height: 1920,
      overflow: 'hidden',
    }}>
      {/* Dark wallpaper with glowing abstract curves — matching reference */}
      <div style={{position: 'absolute', inset: 0, background: '#0a0c10'}} />
      
      {/* Glow curve layers — abstract blue/gold like reference */}
      <svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}} viewBox="0 0 1080 1920" preserveAspectRatio="none">
        <defs>
          <linearGradient id="glow1" x1="0%" y1="40%" x2="100%" y2="60%">
            <stop offset="0%" stopColor="#1a3a5c" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#2a6090" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0a1520" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="glow2" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#0a1520" stopOpacity="0" />
            <stop offset="40%" stopColor="#8a7040" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#c0a060" stopOpacity="0.15" />
          </linearGradient>
          <filter id="blur1">
            <feGaussianBlur stdDeviation="30" />
          </filter>
          <filter id="blur2">
            <feGaussianBlur stdDeviation="20" />
          </filter>
        </defs>
        {/* Top curve band */}
        <path d="M0,500 Q200,350 540,420 Q880,490 1080,380 L1080,520 Q880,630 540,560 Q200,490 0,640 Z" fill="url(#glow1)" filter="url(#blur1)" />
        {/* Middle bright line */}
        <path d="M0,900 Q300,800 540,880 Q780,960 1080,850" stroke="rgba(180,210,255,0.15)" strokeWidth="3" fill="none" filter="url(#blur2)" />
        <path d="M0,920 Q300,820 540,900 Q780,980 1080,870" stroke="rgba(200,180,120,0.12)" strokeWidth="2" fill="none" filter="url(#blur2)" />
        {/* Bottom gold glow */}
        <path d="M0,1100 Q400,950 700,1050 Q900,1100 1080,1000 L1080,1200 Q900,1300 700,1250 Q400,1150 0,1300 Z" fill="url(#glow2)" filter="url(#blur1)" />
        {/* Thin bright edge lines */}
        <path d="M0,510 Q200,360 540,430 Q880,500 1080,390" stroke="rgba(200,230,255,0.2)" strokeWidth="1.5" fill="none" />
        <path d="M0,630 Q200,480 540,550 Q880,620 1080,510" stroke="rgba(200,230,255,0.12)" strokeWidth="1" fill="none" />
        <path d="M0,1110 Q400,960 700,1060 Q900,1110 1080,1010" stroke="rgba(220,200,140,0.18)" strokeWidth="1.5" fill="none" />
        <path d="M0,1290 Q400,1140 700,1240 Q900,1290 1080,1190" stroke="rgba(220,200,140,0.1)" strokeWidth="1" fill="none" />
      </svg>
      
      {/* Dynamic Island */}
      <div style={{
        position: 'absolute',
        top: 12,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 126,
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
        height: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 30px',
      }}>
        <span style={{
          color: 'white',
          fontSize: 16,
          fontWeight: '600',
          fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
        }}>
          9:45
        </span>
        <div style={{display: 'flex', gap: 6, alignItems: 'center'}}>
          <div style={{display: 'flex', gap: 1.5, alignItems: 'flex-end', height: 12}}>
            {[4, 6, 8, 10].map((h, i) => (
              <div key={i} style={{width: 3, height: h, borderRadius: 1, backgroundColor: 'white'}} />
            ))}
          </div>
          <svg width="15" height="11" viewBox="0 0 15 11" fill="white">
            <circle cx="7.5" cy="10" r="1.2" />
            <path d="M4.7 7.8a4 4 0 0 1 5.6 0" stroke="white" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
            <path d="M2.1 5.2a7.4 7.4 0 0 1 10.8 0" stroke="white" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
          </svg>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={{
              width: 25, height: 11, borderRadius: 3,
              border: '1.2px solid rgba(255,255,255,0.5)', padding: 2,
            }}>
              <div style={{width: '72%', height: '100%', borderRadius: 1, backgroundColor: 'white'}} />
            </div>
            <div style={{width: 1.5, height: 4.5, borderRadius: '0 1px 1px 0', backgroundColor: 'rgba(255,255,255,0.5)', marginLeft: 1}} />
          </div>
        </div>
      </div>
      
      {/* Lock icon */}
      <div style={{
        position: 'absolute',
        top: 72,
        left: '50%',
        transform: 'translateX(-50%)',
      }}>
        <svg width="11" height="15" viewBox="0 0 11 15" fill="none">
          <rect x="0.5" y="5.5" width="10" height="9" rx="2" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
          <path d="M3 5.5V4a2.5 2.5 0 0 1 5 0v1.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeLinecap="round"/>
        </svg>
      </div>
      
      {/* Date — ABOVE the clock, smaller, like reference "Wed Sep 10" */}
      <div style={{
        position: 'absolute',
        top: 120,
        left: 0,
        right: 0,
        textAlign: 'center',
      }}>
        <div style={{
          color: 'rgba(255,255,255,0.6)',
          fontSize: 22,
          fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
          fontWeight: '400',
          letterSpacing: 0.3,
        }}>
          Mon Feb 10
        </div>
      </div>
      
      {/* BIG clock — metallic/chrome look like reference */}
      <div style={{
        position: 'absolute',
        top: 145,
        left: 0,
        right: 0,
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 220,
          fontWeight: '200',
          fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
          letterSpacing: -12,
          lineHeight: 0.85,
          // Metallic chrome gradient text
          background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(180,190,200,0.7) 40%, rgba(140,150,160,0.5) 70%, rgba(100,110,120,0.4) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          // Subtle text shadow for depth
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
        }}>
          09:45
        </div>
      </div>
      
      {/* Notification count header */}
      {visibleMessages.length > 0 && (
        <div style={{
          position: 'absolute',
          top: 585,
          left: 24,
        }}>
          <span style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: 14,
            fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
            fontWeight: '600',
            letterSpacing: 0.5,
            textTransform: 'uppercase',
          }}>
            Discord · {visibleMessages.length} notification{visibleMessages.length > 1 ? 's' : ''}
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
      
      {/* Bottom actions — flashlight + camera */}
      <div style={{
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 50px',
      }}>
        {[
          <svg key="f" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 2h8l2 4H6l2-4z"/><rect x="6" y="6" width="12" height="16" rx="2"/><circle cx="12" cy="14" r="2"/>
          </svg>,
          <svg key="c" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>,
        ].map((icon, i) => (
          <div key={i} style={{
            width: 54,
            height: 54,
            borderRadius: 27,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '0.5px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {icon}
          </div>
        ))}
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
        backgroundColor: 'rgba(255,255,255,0.25)',
      }} />
    </AbsoluteFill>
  );
};
