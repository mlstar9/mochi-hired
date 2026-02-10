import {AbsoluteFill, useCurrentFrame, interpolate, staticFile, Img, Easing} from 'remotion';

// iPhone 17 Pro Max Lock Screen — Nyx spamming notifications
// iOS 26 Liquid Glass aesthetic — matched from real screenshot reference
// Dimensions: 1290x2796 (iPhone 15 Pro Max logical, close to 17 Pro Max)

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

// Scale factor: we design at 1290 wide but render at 1080
const S = 1080 / 1290;

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
  
  // iOS-style: slide in from top with slight scale
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
      top: 520 + targetY,
      left: 16,
      right: 16,
      opacity,
      transform: `translateY(${slideY}px) scale(${scale})`,
      transformOrigin: 'top center',
    }}>
      {/* iOS 26 Liquid Glass notification — matched from reference */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.18)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        borderRadius: 26,
        padding: '14px 16px 14px 14px',
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)',
      }}>
        {/* Profile picture — circle, 44px */}
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
          {/* Discord badge — bottom-right, 22px blue circle */}
          <div style={{
            position: 'absolute',
            bottom: -3,
            right: -3,
            width: 22,
            height: 22,
            borderRadius: '50%',
            backgroundColor: '#5865F2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid rgba(30, 30, 40, 0.6)',
          }}>
            <svg width="12" height="9" viewBox="0 0 71 55" fill="white">
              <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3## 44.2785 53.4خ 44.2898 53.4#.344L53.5765 44.3461C53.9319 44.6391 54.3041 44.9293 54.6791 45.2082C54.8078 45.304 54.7994 45.5041 54.6phases45.5858C52.8907 46.6168 51.052 47.4931 49.1182 48.2228C48.9923 48.2707 48.9363 48.4172 48.9979 48.5383C50.0585 50.6034 51.2759 52.5699 52.6166 54.435C52.6726 54.5139 52.7733 54.5505 52.8657 54.5765C58.6697 52.7249 64.5523 50.0174 70.6252 45.5576C70.6783 45.5182 70.7119 45.459 70.7175 45.3942C72.1971 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978Z"/>
            </svg>
          </div>
        </div>
        
        {/* Text content */}
        <div style={{flex: 1, minWidth: 0}}>
          {/* Top row: App name + timestamp */}
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1}}>
            <span style={{
              color: 'rgba(255, 255, 255, 0.55)',
              fontSize: 14,
              fontWeight: '400',
              fontFamily: "-apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif",
              letterSpacing: -0.1,
            }}>
              Discord
            </span>
            <span style={{
              color: 'rgba(255, 255, 255, 0.35)',
              fontSize: 14,
              fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
              fontWeight: '400',
            }}>
              {time}
            </span>
          </div>
          {/* Sender name */}
          <div style={{
            color: 'rgba(255, 255, 255, 0.95)',
            fontSize: 16,
            fontWeight: '600',
            fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
            marginBottom: 2,
            letterSpacing: -0.2,
          }}>
            Nyx
          </div>
          {/* Message text */}
          <div style={{
            color: 'rgba(255, 255, 255, 0.65)',
            fontSize: 16,
            fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
            lineHeight: 1.25,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontWeight: '400',
            letterSpacing: -0.1,
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
  
  const maxVisible = 10;
  const displayMessages = visibleMessages.slice(-maxVisible);
  
  return (
    <AbsoluteFill style={{
      backgroundColor: '#000',
      width: 1080,
      height: 1920,
      overflow: 'hidden',
    }}>
      {/* Wallpaper — warm muted tones like reference (beige/taupe gradient) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(170deg, #3d3428 0%, #4a3f32 20%, #5c4f3e 40%, #4a4035 60%, #352e25 80%, #2a2420 100%)',
      }} />
      
      {/* Subtle warm light */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '30%',
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(180,160,130,0.12) 0%, transparent 70%)',
      }} />
      
      {/* Dynamic Island — centered pill, true black */}
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
      
      {/* Status bar — left time, right icons */}
      <div style={{
        position: 'absolute',
        top: 14,
        left: 0,
        right: 0,
        height: 24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 28px',
      }}>
        {/* Time in status bar */}
        <span style={{
          color: 'white',
          fontSize: 16,
          fontWeight: '600',
          fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
        }}>
          9:45
        </span>
        {/* Right icons */}
        <div style={{display: 'flex', gap: 6, alignItems: 'center'}}>
          {/* Cellular bars */}
          <div style={{display: 'flex', gap: 1.5, alignItems: 'flex-end', height: 12}}>
            {[4, 6, 8, 10].map((h, i) => (
              <div key={i} style={{width: 3, height: h, borderRadius: 1, backgroundColor: 'white'}} />
            ))}
          </div>
          {/* WiFi — simplified */}
          <div style={{width: 16, height: 12, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width="15" height="11" viewBox="0 0 15 11" fill="white">
              <path d="M7.5 9.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z" fillRule="evenodd"/>
              <path d="M4.7 7.8a3.96 3.96 0 0 1 5.6 0" stroke="white" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
              <path d="M2.1 5.2a7.43 7.43 0 0 1 10.8 0" stroke="white" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
              <path d="M0 2.6a10.6 10.6 0 0 1 15 0" stroke="white" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
          {/* Battery */}
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={{
              width: 25,
              height: 11,
              borderRadius: 3,
              border: '1.2px solid rgba(255,255,255,0.5)',
              padding: 2,
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
        top: 70,
        left: '50%',
        transform: 'translateX(-50%)',
      }}>
        <svg width="11" height="15" viewBox="0 0 11 15" fill="none">
          <rect x="0.5" y="5.5" width="10" height="9" rx="2" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
          <path d="M3 5.5V4a2.5 2.5 0 0 1 5 0v1.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeLinecap="round"/>
        </svg>
      </div>
      
      {/* Main clock — iOS 26 style: thin weight, large */}
      <div style={{
        position: 'absolute',
        top: 105,
        left: 0,
        right: 0,
        textAlign: 'center',
      }}>
        <div style={{
          color: 'white',
          fontSize: 100,
          fontWeight: '100',
          fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
          letterSpacing: -4,
          lineHeight: 1,
        }}>
          9:45
        </div>
        <div style={{
          color: 'rgba(255,255,255,0.55)',
          fontSize: 21,
          fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
          marginTop: 6,
          fontWeight: '400',
          letterSpacing: 0.2,
        }}>
          Monday, February 10
        </div>
      </div>
      
      {/* Notification count header */}
      {visibleMessages.length > 0 && (
        <div style={{
          position: 'absolute',
          top: 480,
          left: 20,
        }}>
          <span style={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: 15,
            fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
            fontWeight: '600',
            letterSpacing: 0.3,
          }}>
            DISCORD · {visibleMessages.length} notification{visibleMessages.length > 1 ? 's' : ''}
          </span>
        </div>
      )}
      
      {/* Notifications stack */}
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
      
      {/* Bottom quick actions — flashlight + camera (liquid glass circles) */}
      <div style={{
        position: 'absolute',
        bottom: 46,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 46px',
      }}>
        {[
          // Flashlight
          <svg key="flash" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>,
          // Camera
          <svg key="cam" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>,
        ].map((icon, i) => (
          <div key={i} style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            border: '0.5px solid rgba(255,255,255,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.08)',
          }}>
            {icon}
          </div>
        ))}
      </div>
      
      {/* Home indicator bar */}
      <div style={{
        position: 'absolute',
        bottom: 8,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 140,
        height: 5,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.3)',
      }} />
    </AbsoluteFill>
  );
};
