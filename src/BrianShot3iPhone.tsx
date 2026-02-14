import {AbsoluteFill, useCurrentFrame, interpolate, Easing, Img, staticFile} from 'remotion';

// Brian Shot 3 — girlbrian Slack messages on iPhone with 3D tilt
// 4:3 (1440x1080), 5s @ 24fps = 120 frames
// Transparent background, first 3 msgs normal, then hyper-speed spam

const SLACK_BG = '#1a1d21';
const SIDEBAR_BG = '#19171D';

interface MsgData {
  time: string;
  text: string;
  highlight?: boolean;
  appearFrame: number;
}

// First 3 at normal pace, then hyper-speed spam starting frame 70
const MESSAGES: MsgData[] = [
  // Normal pace (first 3)
  {time: '3:42 AM', text: '🐛 PR #847: found null check bug on line 42 — pushed fix', appearFrame: 20},
  {time: '3:45 AM', text: '🚨 alert triaged — latency spike not critical, silenced for 2hrs', appearFrame: 42},
  {time: '4:01 AM', text: '💬 @chen: the auth service uses JWT refresh tokens, docs here → wiki/auth-flow', appearFrame: 64, highlight: true},
  // Hyper-speed spam
  {time: '4:02 AM', text: '✅ CI passed on main — all 847 tests green', appearFrame: 72},
  {time: '4:02 AM', text: '🔄 synced staging env with prod config', appearFrame: 75},
  {time: '4:03 AM', text: '📊 dashboard updated — p99 latency down 12%', appearFrame: 78},
  {time: '4:03 AM', text: '🐛 hotfix: race condition in queue consumer → patched', appearFrame: 81},
  {time: '4:04 AM', text: '💬 @maya: yes the webhook retries 3x with exponential backoff', appearFrame: 84},
  {time: '4:04 AM', text: '🚨 alert: disk usage 89% on worker-3 → cleared temp files', appearFrame: 86},
  {time: '4:05 AM', text: '✅ PR #849 merged — added rate limiting to /api/search', appearFrame: 88},
  {time: '4:05 AM', text: '📝 updated runbook for on-call handoff', appearFrame: 90},
  {time: '4:06 AM', text: '💬 @lee: the migration script is idempotent, safe to re-run', appearFrame: 92},
  {time: '4:06 AM', text: '🔄 rolled back feature flag for experiment-42', appearFrame: 94},
  {time: '4:07 AM', text: '🐛 caught memory leak in image processor — filed #851', appearFrame: 96},
  {time: '4:07 AM', text: '✅ deployed v2.4.1 to canary — monitoring', appearFrame: 98},
  {time: '4:08 AM', text: '📊 error rate back to baseline 0.02%', appearFrame: 100},
  {time: '4:08 AM', text: '💬 @team: all clear, going back to code review', appearFrame: 102},
  {time: '4:09 AM', text: '🚨 new alert: connection pool exhausted → scaled up', appearFrame: 104},
  {time: '4:09 AM', text: '✅ connection pool fix verified — back to normal', appearFrame: 106},
  {time: '4:10 AM', text: '📝 summarized overnight incidents in #eng-standup', appearFrame: 108},
];

const SlackMessage: React.FC<{
  msg: MsgData;
}> = ({msg}) => {
  const frame = useCurrentFrame();
  const age = frame - msg.appearFrame;
  
  // Faster pop-in for spam messages (after frame 70)
  const isSpam = msg.appearFrame >= 72;
  const fadeFrames = isSpam ? 2 : 6;
  const slideFrames = isSpam ? 3 : 8;
  
  const opacity = interpolate(age, [0, fadeFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  const slideY = interpolate(age, [0, slideFrames], [isSpam ? 20 : 12, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  if (age < 0) return null;

  return (
    <div style={{
      display: 'flex',
      gap: 14,
      padding: '10px 20px',
      opacity,
      transform: `translateY(${slideY}px)`,
      backgroundColor: msg.highlight ? 'rgba(194, 190, 255, 0.05)' : 'transparent',
      flexShrink: 0,
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 10,
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        <Img src={staticFile('images/girlbrian-pfp.png')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </div>
      <div style={{flex: 1, minWidth: 0}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2}}>
          <span style={{
            color: '#D1D2D3',
            fontFamily: 'SF Pro Display, -apple-system, sans-serif',
            fontWeight: 700,
            fontSize: 18,
          }}>girlbrian</span>
          <span style={{
            backgroundColor: '#4A154B',
            color: '#D1D2D3',
            fontSize: 11,
            padding: '2px 6px',
            borderRadius: 4,
            fontWeight: 600,
            fontFamily: 'SF Pro Display, -apple-system, sans-serif',
          }}>APP</span>
          <span style={{
            color: '#616061',
            fontSize: 13,
            fontFamily: 'SF Pro Display, -apple-system, sans-serif',
          }}>{msg.time}</span>
        </div>
        <div style={{
          color: '#D1D2D3',
          fontSize: 16,
          fontFamily: 'SF Pro Display, -apple-system, sans-serif',
          lineHeight: 1.4,
        }}>{msg.text}</div>
      </div>
    </div>
  );
};

const SlackScreen: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Calculate how many messages are visible
  const visibleMsgs = MESSAGES.filter(m => frame >= m.appearFrame);
  
  // Auto-scroll: after messages overflow, scroll up to keep latest visible
  // Each message is roughly 80px tall
  const msgHeight = 80;
  const viewportHeight = 980; // phone height minus header
  const totalHeight = visibleMsgs.length * msgHeight;
  const scrollOffset = Math.max(0, totalHeight - viewportHeight);
  
  // Smooth scroll
  const smoothScroll = interpolate(frame, [0, 120], [0, scrollOffset], {
    extrapolateRight: 'clamp',
  });
  const actualScroll = Math.min(scrollOffset, smoothScroll);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: SLACK_BG,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'SF Pro Display, -apple-system, sans-serif',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #383838',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
      }}>
        <span style={{color: '#D1D2D3', fontWeight: 700, fontSize: 20}}># eng-alerts</span>
      </div>

      {/* Messages container */}
      <div style={{
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          paddingTop: 8,
          transform: `translateY(-${actualScroll}px)`,
        }}>
          {/* Date divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 16px',
            gap: 12,
            flexShrink: 0,
          }}>
            <div style={{flex: 1, height: 1, backgroundColor: '#383838'}} />
            <span style={{color: '#616061', fontSize: 13, fontWeight: 600}}>Today</span>
            <div style={{flex: 1, height: 1, backgroundColor: '#383838'}} />
          </div>

          {MESSAGES.map((msg, i) => (
            <SlackMessage key={i} msg={msg} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const BrianShot3iPhone: React.FC = () => {
  const frame = useCurrentFrame();

  // iPhone dimensions — scaled to fill 100% of frame height
  const phoneH = 1080;
  const phoneW = Math.round(phoneH * 0.486);

  // 3D tilt animation
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

  const floatY = interpolate(frame, [0, 60, 120], [0, -6, 0], {
    extrapolateRight: 'clamp',
  });

  const scale = interpolate(frame, [0, 40], [0.92, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{
      backgroundColor: 'transparent',
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
            flexShrink: 0,
          }}>
            <span style={{color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'SF Pro Display, -apple-system, sans-serif'}}>9:41</span>
            <div style={{display: 'flex', gap: 4, alignItems: 'center'}}>
              <span style={{color: '#fff', fontSize: 10}}>●●●●</span>
              <span style={{color: '#fff', fontSize: 10}}>📶</span>
              <span style={{color: '#fff', fontSize: 10}}>🔋</span>
            </div>
          </div>

          {/* Slack content */}
          <div style={{flex: 1, height: phoneH - 48, overflow: 'hidden'}}>
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
