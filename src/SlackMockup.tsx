import { AbsoluteFill, interpolate, useCurrentFrame, Sequence, Easing } from 'remotion';

// Slack dark mode colors
const colors = {
  bg: '#1a1d21',
  sidebar: '#19171d',
  sidebarHover: '#27242c',
  text: '#d1d2d3',
  textMuted: '#ababad',
  accent: '#611f69',
  purple: '#9b59b6',
  orange: '#e9a820',
  messageBg: '#222529',
  border: '#35373b',
  typing: '#b9bbbe',
};

const SlackMessage = ({ 
  name, 
  avatar, 
  avatarBg, 
  message, 
  isBot = false,
  time = '1:23 PM',
  delay = 0 
}: {
  name: string;
  avatar: string;
  avatarBg: string;
  message: string | React.ReactNode;
  isBot?: boolean;
  time?: string;
  delay?: number;
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(frame - delay, [0, 8], [20, 0], { 
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic)
  });

  if (frame < delay) return null;

  return (
    <div style={{
      display: 'flex',
      padding: '8px 20px',
      opacity,
      transform: `translateY(${translateY}px)`,
    }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: 4,
        backgroundColor: avatarBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        marginRight: 8,
        flexShrink: 0,
      }}>
        {avatar}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ 
            color: colors.text, 
            fontWeight: 700, 
            fontSize: 15 
          }}>{name}</span>
          {isBot && (
            <span style={{
              backgroundColor: colors.purple,
              color: 'white',
              fontSize: 10,
              padding: '2px 4px',
              borderRadius: 3,
              fontWeight: 600,
            }}>APP</span>
          )}
          <span style={{ 
            color: colors.textMuted, 
            fontSize: 12 
          }}>{time}</span>
        </div>
        <div style={{ 
          color: colors.text, 
          fontSize: 15, 
          marginTop: 4,
          lineHeight: 1.5,
        }}>{message}</div>
      </div>
    </div>
  );
};

const TypingIndicator = ({ delay = 0, showUntil = 999 }: { delay?: number; showUntil?: number }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
  
  if (frame < delay || frame > showUntil) return null;
  
  // Animate dots
  const dot1 = interpolate((frame - delay) % 30, [0, 10, 20, 30], [0.4, 1, 0.4, 0.4]);
  const dot2 = interpolate((frame - delay) % 30, [0, 10, 20, 30], [0.4, 0.4, 1, 0.4]);
  const dot3 = interpolate((frame - delay) % 30, [0, 10, 20, 30], [0.4, 0.4, 0.4, 1]);

  return (
    <div style={{
      padding: '12px 20px',
      opacity,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    }}>
      <div style={{ display: 'flex', gap: 4 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: colors.typing, opacity: dot1 }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: colors.typing, opacity: dot2 }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: colors.typing, opacity: dot3 }} />
      </div>
      <span style={{ color: colors.textMuted, fontSize: 13 }}>Semi is typing...</span>
    </div>
  );
};

export const SlackMockup: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ 
      backgroundColor: colors.bg,
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      {/* Window chrome - top bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 40,
        backgroundColor: colors.sidebar,
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        gap: 8,
        zIndex: 10,
      }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff5f56' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#27c93f' }} />
      </div>

      {/* Sidebar */}
      <div style={{
        position: 'absolute',
        top: 40,
        left: 0,
        bottom: 0,
        width: 220,
        backgroundColor: colors.sidebar,
        borderRight: `1px solid ${colors.border}`,
        padding: '12px 0',
      }}>
        {/* Workspace header */}
        <div style={{
          padding: '0 16px 12px',
          borderBottom: `1px solid ${colors.border}`,
          marginBottom: 12,
        }}>
          <div style={{ 
            color: colors.text, 
            fontWeight: 700, 
            fontSize: 18,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            Workspace
            <span style={{ fontSize: 12, opacity: 0.5 }}>▾</span>
          </div>
        </div>

        {/* Channels */}
        <div style={{ padding: '0 12px', marginBottom: 16 }}>
          <div style={{ color: colors.textMuted, fontSize: 13, marginBottom: 8, fontWeight: 600 }}>
            ▾ Channels
          </div>
          <div style={{ color: colors.textMuted, fontSize: 14, padding: '4px 8px' }}># general</div>
          <div style={{ color: colors.textMuted, fontSize: 14, padding: '4px 8px' }}># project-update</div>
        </div>

        {/* Direct Messages */}
        <div style={{ padding: '0 12px' }}>
          <div style={{ color: colors.textMuted, fontSize: 13, marginBottom: 8, fontWeight: 600 }}>
            ▾ Direct Messages
          </div>
          <div style={{ 
            color: colors.text, 
            fontSize: 14, 
            padding: '4px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <div style={{ width: 20, height: 20, borderRadius: 4, backgroundColor: colors.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>👤</div>
            Demi (you)
          </div>
          <div style={{ 
            color: colors.text, 
            fontSize: 14, 
            padding: '4px 8px',
            backgroundColor: colors.sidebarHover,
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <div style={{ width: 20, height: 20, borderRadius: 4, backgroundColor: colors.purple, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>🤖</div>
            Semi (AI Bot)
            <span style={{ fontSize: 8, backgroundColor: colors.purple, padding: '1px 3px', borderRadius: 2, color: 'white' }}>APP</span>
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div style={{
        position: 'absolute',
        top: 40,
        left: 221,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colors.bg,
      }}>
        {/* Chat header */}
        <div style={{
          padding: '12px 20px',
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          height: 50,
          flexShrink: 0,
        }}>
          <span style={{ color: colors.text, fontWeight: 700, fontSize: 18 }}>Semi</span>
        </div>

        {/* Messages area */}
        <div style={{ flex: 1, padding: '16px 0', overflow: 'hidden' }}>
          <SlackMessage
            name="Demi"
            avatar="👤"
            avatarBg={colors.orange}
            message="Hey Semi, can you summarize the project update?"
            time="11:56 PM"
            delay={15}
          />

          <TypingIndicator delay={40} showUntil={69} />

          <SlackMessage
            name="Semi"
            avatar="🤖"
            avatarBg={colors.purple}
            isBot
            message={
              <div>
                <div>i can see it! "Nova 2.0 Launch Plan for 2026-02-13" ✨</div>
                <div style={{ marginTop: 8 }}>it's pretty empty rn - just "Main Messaging:"</div>
                <div style={{ marginTop: 8 }}>want me to add the content we worked on earlier? the main copy, video/thread breakdown, use cases etc?</div>
              </div>
            }
            time="11:56 PM"
            delay={70}
          />

          <SlackMessage
            name="Demi"
            avatar="👤"
            avatarBg={colors.orange}
            message="do you remember our marketing plan we talked about on telegram"
            time="11:56 PM"
            delay={110}
          />

          <TypingIndicator delay={130} showUntil={149} />

          <SlackMessage
            name="Semi"
            avatar="🤖"
            avatarBg={colors.purple}
            isBot
            message="yes!"
            time="11:57 PM"
            delay={150}
          />
        </div>

        {/* Input area */}
        <div style={{
          padding: '12px 20px',
          borderTop: `1px solid ${colors.border}`,
          flexShrink: 0,
        }}>
          <div style={{
            backgroundColor: colors.messageBg,
            border: `1px solid ${colors.border}`,
            borderRadius: 8,
            padding: '12px 16px',
            color: colors.textMuted,
            fontSize: 14,
          }}>
            Message Semi
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
