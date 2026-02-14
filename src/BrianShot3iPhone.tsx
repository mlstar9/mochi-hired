import {AbsoluteFill, useCurrentFrame, interpolate, Easing, Img, staticFile} from 'remotion';

// Brian Shot 3 — girlbrian Slack messages on iPhone with 3D tilt
// 16:9, 5s @ 24fps = 120 frames
// Sleek iPhone tilting towards camera in 3D space

const SLACK_BG = '#1a1d21';
const SIDEBAR_BG = '#19171D';
const ACCENT = '#C2BEFF';

const SlackMessage: React.FC<{
  avatar: string;
  name: string;
  time: string;
  text: string;
  badge?: string;
  appearFrame: number;
  highlight?: boolean;
}> = ({avatar, name, time, text, badge, appearFrame, highlight}) => {
  const frame = useCurrentFrame();
  const age = frame - appearFrame;
  
  const opacity = interpolate(age, [0, 6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  const slideY = interpolate(age, [0, 8], [12, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div style={{
      display: 'flex',
      gap: 10,
      padding: '8px 16px',
      opacity,
      transform: `translateY(${slideY}px)`,
      backgroundColor: highlight ? 'rgba(194, 190, 255, 0.05)' : 'transparent',
    }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: 6,
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        <Img src={staticFile(avatar)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </div>
      <div style={{flex: 1}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2}}>
          <span style={{
            color: '#D1D2D3',
            fontFamily: 'SF Pro Display, -apple-system, sans-serif',
            fontWeight: 700,
            fontSize: 14,
          }}>{name}</span>
          {badge && (
            <span style={{
              backgroundColor: '#4A154B',
              color: '#D1D2D3',
              fontSize: 9,
              padding: '1px 5px',
              borderRadius: 3,
              fontWeight: 600,
              fontFamily: 'SF Pro Display, -apple-system, sans-serif',
            }}>{badge}</span>
          )}
          <span style={{
            color: '#616061',
            fontSize: 11,
            fontFamily: 'SF Pro Display, -apple-system, sans-serif',
          }}>{time}</span>
        </div>
        <div style={{
          color: '#D1D2D3',
          fontSize: 13,
          fontFamily: 'SF Pro Display, -apple-system, sans-serif',
          lineHeight: 1.4,
        }}>{text}</div>
      </div>
    </div>
  );
};

const SlackScreen: React.FC = () => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: SLACK_BG,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'SF Pro Display, -apple-system, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #383838',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <span style={{color: '#D1D2D3', fontWeight: 700, fontSize: 16}}># eng-alerts</span>
      </div>

      {/* Messages */}
      <div style={{flex: 1, padding: '8px 0', display: 'flex', flexDirection: 'column', gap: 4}}>
        {/* Date divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 16px',
          gap: 12,
        }}>
          <div style={{flex: 1, height: 1, backgroundColor: '#383838'}} />
          <span style={{color: '#616061', fontSize: 11, fontWeight: 600}}>Today</span>
          <div style={{flex: 1, height: 1, backgroundColor: '#383838'}} />
        </div>

        <SlackMessage
          avatar="images/girlbrian-pfp.png"
          name="girlbrian"
          time="3:42 AM"
          text="🐛 PR #847: found null check bug on line 42 — pushed fix"
          badge="APP"
          appearFrame={20}
        />

        <SlackMessage
          avatar="images/girlbrian-pfp.png"
          name="girlbrian"
          time="3:45 AM"
          text="🚨 alert triaged — latency spike not critical, silenced for 2hrs"
          badge="APP"
          appearFrame={42}
        />

        <SlackMessage
          avatar="images/girlbrian-pfp.png"
          name="girlbrian"
          time="4:01 AM"
          text="💬 @chen: the auth service uses JWT refresh tokens, docs here → wiki/auth-flow"
          badge="APP"
          appearFrame={64}
          highlight
        />
      </div>
    </div>
  );
};

export const BrianShot3iPhone: React.FC = () => {
  const frame = useCurrentFrame();

  // iPhone dimensions — scaled to fill 100% of frame height
  const phoneH = 1080;
  const phoneW = Math.round(phoneH * 0.486); // iPhone aspect ratio ~9:19.5

  // 3D tilt animation — starts angled, smoothly tilts towards camera
  const rotateY = interpolate(frame, [0, 90], [35, -5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const rotateX = interpolate(frame, [0, 90], [8, 2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Subtle float
  const floatY = interpolate(frame, [0, 60, 120], [0, -6, 0], {
    extrapolateRight: 'clamp',
  });

  // Scale in slightly
  const scale = interpolate(frame, [0, 40], [0.92, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Opacity
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{
      backgroundColor: '#111111',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      perspective: 1200,
    }}>
      <div style={{
        width: phoneW,
        height: phoneH,
        opacity,
        transform: `translateY(${floatY}px) scale(${scale}) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
        transformStyle: 'preserve-3d',
        position: 'relative',
      }}>
        {/* iPhone frame */}
        <div style={{
          width: '100%',
          height: '100%',
          borderRadius: 44,
          border: '3px solid #333',
          overflow: 'hidden',
          backgroundColor: SLACK_BG,
          boxShadow: `
            0 0 40px rgba(194, 190, 255, 0.15),
            0 20px 60px rgba(0, 0, 0, 0.5),
            inset 0 0 0 1px rgba(255,255,255,0.05)
          `,
          position: 'relative',
        }}>
          {/* Status bar */}
          <div style={{
            height: 48,
            backgroundColor: SIDEBAR_BG,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            padding: '0 24px 6px',
          }}>
            <span style={{color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'SF Pro Display, -apple-system, sans-serif'}}>9:41</span>
            <div style={{display: 'flex', gap: 4, alignItems: 'center'}}>
              <span style={{color: '#fff', fontSize: 10}}>●●●●</span>
              <span style={{color: '#fff', fontSize: 10}}>📶</span>
              <span style={{color: '#fff', fontSize: 10}}>🔋</span>
            </div>
          </div>

          {/* Slack content */}
          <div style={{flex: 1, height: phoneH - 48}}>
            <SlackScreen />
          </div>
        </div>

        {/* Notch */}
        <div style={{
          position: 'absolute',
          top: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 120,
          height: 30,
          backgroundColor: '#000',
          borderRadius: 20,
          zIndex: 10,
        }} />
      </div>
    </AbsoluteFill>
  );
};
