import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// ─── Constants ───────────────────────────────────────────────────────────────

export const WORKFLOW_DURATION = 144; // 6s at 24fps

const SPRING_CONFIG = {damping: 34, stiffness: 120, mass: 1};
const FONT = 'system-ui, sans-serif';

// Seeded random for deterministic wobble
const sr = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
};

// ─── Film Grain (4% opacity) ─────────────────────────────────────────────────

const FilmGrain: React.FC = () => {
  const frame = useCurrentFrame();
  const ox = (frame * 37) % 200;
  const oy = (frame * 53) % 200;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity: 0.04,
        backgroundImage:
          'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'4\' height=\'4\'%3E%3Crect width=\'1\' height=\'1\' fill=\'white\' x=\'0\' y=\'0\' opacity=\'0.5\'/%3E%3Crect width=\'1\' height=\'1\' fill=\'white\' x=\'2\' y=\'3\' opacity=\'0.3\'/%3E%3Crect width=\'1\' height=\'1\' fill=\'white\' x=\'3\' y=\'1\' opacity=\'0.7\'/%3E%3C/svg%3E")',
        backgroundPosition: `${ox}px ${oy}px`,
        mixBlendMode: 'overlay',
      }}
    />
  );
};

// ─── PFP Node (square, rounded corners, drop shadow) ─────────────────────────

const PFP: React.FC<{
  src?: string;
  placeholder?: string;
  name: string;
  subtitle?: string;
  x: number;
  y: number;
  size?: number;
  appearFrame: number;
  seed: number;
  textColor?: string;
  isAI?: boolean;
}> = ({src, placeholder, name, subtitle, x, y, size = 120, appearFrame, seed, textColor = '#fff', isAI}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < appearFrame) return null;

  const prog = spring({frame: frame - appearFrame, fps, durationInFrames: 20, config: SPRING_CONFIG});
  const slideX = interpolate(prog, [0, 1], [35, 0]);
  const opacity = interpolate(frame - appearFrame, [0, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const scale = interpolate(prog, [0, 1], [0.92, 1]);

  return (
    <div style={{
      position: 'absolute',
      left: x - size / 2 + slideX,
      top: y - size / 2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      opacity,
      transform: `scale(${scale})`,
    }}>
      <div style={{
        width: size,
        height: size,
        borderRadius: 12,
        overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: isAI ? '3px solid rgba(255,255,255,0.6)' : 'none',
      }}>
        {src ? (
          <Img src={staticFile(`images/${src}`)} style={{width: size, height: size, objectFit: 'cover'}} />
        ) : (
          <span style={{color: '#333', fontSize: size * 0.4, fontWeight: 800, fontFamily: FONT}}>
            {placeholder || '?'}
          </span>
        )}
      </div>
      <div style={{
        marginTop: 14,
        color: textColor,
        fontSize: 22,
        fontWeight: 800,
        fontFamily: FONT,
        textTransform: 'uppercase' as const,
        letterSpacing: 1.5,
        textAlign: 'center',
        textShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }}>
        {name}
      </div>
      {subtitle && (
        <div style={{
          marginTop: 4,
          color: textColor,
          opacity: 0.75,
          fontSize: 16,
          fontWeight: 600,
          fontFamily: FONT,
          textAlign: 'center',
        }}>
          {subtitle}
        </div>
      )}
    </div>
  );
};

// ─── Doodle Arrow (wobbly cubic bezier, white stroke) ────────────────────────

const DoodleArrow: React.FC<{
  x1: number; y1: number; x2: number; y2: number;
  startFrame: number; seed: number;
  stroke?: string; strokeWidth?: number; showHead?: boolean;
}> = ({x1, y1, x2, y2, startFrame, seed, stroke = '#fff', strokeWidth = 3, showHead = true}) => {
  const frame = useCurrentFrame();
  if (frame < startFrame) return null;

  const drawProgress = interpolate(frame - startFrame, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const dx = x2 - x1;
  const dy = y2 - y1;
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const wobble1 = (sr(seed) - 0.5) * 40;
  const wobble2 = (sr(seed + 1) - 0.5) * 30;
  const cp1x = x1 + dx * 0.3 + (sr(seed + 2) - 0.5) * 20;
  const cp1y = midY + wobble1;
  const cp2x = x1 + dx * 0.7 + (sr(seed + 3) - 0.5) * 20;
  const cp2y = midY + wobble2;

  const pathD = `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
  const approxLen = Math.sqrt(dx * dx + dy * dy) * 1.4;
  const drawn = approxLen * drawProgress;

  const angle = Math.atan2(y2 - cp2y, x2 - cp2x);
  const as = 12;
  const ax1p = x2 - as * Math.cos(angle - 0.35);
  const ay1p = y2 - as * Math.sin(angle - 0.35);
  const ax2p = x2 - as * Math.cos(angle + 0.35);
  const ay2p = y2 - as * Math.sin(angle + 0.35);

  return (
    <svg style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      <path d={pathD} fill="none" stroke={stroke} strokeWidth={strokeWidth}
        strokeLinecap="round" strokeDasharray={approxLen} strokeDashoffset={approxLen - drawn}
        opacity={0.85} />
      {showHead && drawProgress >= 0.9 && (
        <polygon points={`${x2},${y2} ${ax1p},${ay1p} ${ax2p},${ay2p}`} fill={stroke} opacity={0.85} />
      )}
    </svg>
  );
};

// ─── Doodle Checkmark ────────────────────────────────────────────────────────

const DoodleCheck: React.FC<{x: number; y: number; appearFrame: number; seed: number; color?: string}> = ({
  x, y, appearFrame, seed, color = '#fff',
}) => {
  const frame = useCurrentFrame();
  if (frame < appearFrame) return null;

  const prog = interpolate(frame - appearFrame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const tilt = (sr(seed) - 0.5) * 15;

  return (
    <svg style={{position: 'absolute', left: x - 16, top: y - 16, width: 32, height: 32, pointerEvents: 'none'}}
      viewBox="0 0 32 32">
      <path d="M 6 16 L 13 24 L 26 8" fill="none" stroke={color} strokeWidth={3.5}
        strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray={40} strokeDashoffset={40 - 40 * prog}
        transform={`rotate(${tilt} 16 16)`} opacity={0.9} />
    </svg>
  );
};

// ─── Doodle Circle ───────────────────────────────────────────────────────────

const DoodleCircle: React.FC<{
  cx: number; cy: number; r: number; appearFrame: number; seed: number; color?: string;
}> = ({cx, cy, r, appearFrame, seed, color = '#fff'}) => {
  const frame = useCurrentFrame();
  if (frame < appearFrame) return null;

  const prog = interpolate(frame - appearFrame, [0, 14], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const circ = 2 * Math.PI * r;
  const w1 = (sr(seed) - 0.5) * r * 0.3;
  const w2 = (sr(seed + 1) - 0.5) * r * 0.3;

  return (
    <svg style={{position: 'absolute', left: cx - r - 20, top: cy - r - 20,
      width: r * 2 + 40, height: r * 2 + 40, pointerEvents: 'none'}}>
      <ellipse cx={r + 20 + w1} cy={r + 20 + w2} rx={r + (sr(seed + 2) - 0.5) * 6}
        ry={r + (sr(seed + 3) - 0.5) * 6}
        fill="none" stroke={color} strokeWidth={3} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ - circ * prog} opacity={0.7} />
    </svg>
  );
};

// ─── Doodle Text Annotation ──────────────────────────────────────────────────

const DoodleText: React.FC<{
  text: string; x: number; y: number; appearFrame: number; seed: number;
  color?: string; fontSize?: number;
}> = ({text, x, y, appearFrame, seed, color = '#fff', fontSize = 28}) => {
  const frame = useCurrentFrame();
  if (frame < appearFrame) return null;

  const opacity = interpolate(frame - appearFrame, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const tilt = (sr(seed) - 0.5) * 8;

  return (
    <div style={{
      position: 'absolute',
      left: x,
      top: y,
      color,
      fontSize,
      fontWeight: 800,
      fontFamily: FONT,
      transform: `rotate(${tilt}deg)`,
      opacity: opacity * 0.9,
      textShadow: '0 2px 8px rgba(0,0,0,0.2)',
    }}>
      {text}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSITIONS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── 1. WorkflowAnthony — Blue #2563EB ───────────────────────────────────────

const SocialCard: React.FC<{
  text: string; accent: string; x: number; y: number;
  fromX: number; fromY: number; appearFrame: number; seed: number;
}> = ({text, accent, x, y, fromX, fromY, appearFrame, seed}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < appearFrame) return null;

  const prog = spring({frame: frame - appearFrame, fps, durationInFrames: 20, config: SPRING_CONFIG});
  const cx = interpolate(prog, [0, 1], [fromX, x]);
  const cy = interpolate(prog, [0, 1], [fromY, y]);
  const opacity = interpolate(frame - appearFrame, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const scale = interpolate(prog, [0, 1], [0.85, 1]);
  const tilt = (sr(seed) - 0.5) * 3;

  return (
    <div style={{
      position: 'absolute',
      left: cx - 110,
      top: cy - 36,
      width: 220,
      padding: '12px 16px',
      borderRadius: 10,
      background: '#fff',
      borderLeft: `5px solid ${accent}`,
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      opacity,
      transform: `scale(${scale}) rotate(${tilt}deg)`,
    }}>
      <span style={{color: '#1e293b', fontSize: 15, fontWeight: 600, fontFamily: FONT, lineHeight: 1.3}}>
        {text}
      </span>
    </div>
  );
};

export const WorkflowAnthony: React.FC = () => {
  const cards = [
    {text: '@paboratories mention on TikTok', accent: '#F97316', fromX: 720, fromY: -60, x: 540, y: 340, delay: 24},
    {text: 'Pika trending on X', accent: '#EC4899', fromX: 200, fromY: 600, x: 660, y: 480, delay: 42},
    {text: 'Brand collab request — IG', accent: '#8B5CF6', fromX: 1300, fromY: 300, x: 800, y: 360, delay: 60},
    {text: 'New creator partnership DM', accent: '#0D9488', fromX: 720, fromY: 800, x: 700, y: 580, delay: 78},
  ];

  return (
    <AbsoluteFill style={{backgroundColor: '#2563EB'}}>
      <PFP src="user-pfp.png" name="Anthony" subtitle="Head of Partnerships"
        x={200} y={480} appearFrame={0} seed={1} />
      <PFP src="theo.png" name="Theo" subtitle="AI Self" isAI
        x={1240} y={480} appearFrame={12} seed={2} />

      {cards.map((c, i) => (
        <SocialCard key={i} text={c.text} accent={c.accent} x={c.x} y={c.y}
          fromX={c.fromX} fromY={c.fromY} appearFrame={c.delay} seed={i * 10 + 50} />
      ))}

      <DoodleArrow x1={310} y1={500} x2={1130} y2={500} startFrame={18} seed={300} />
      <DoodleText text="24/7" x={680} y={680} appearFrame={90} seed={310} fontSize={42} />
      <DoodleCircle cx={720} cy={700} r={50} appearFrame={95} seed={320} />

      <FilmGrain />
    </AbsoluteFill>
  );
};

// ─── 2. WorkflowStarry — Teal #0D9488 ───────────────────────────────────────

const KanbanColumn: React.FC<{
  title: string; x: number; y: number; cards: string[];
  appearFrame: number; seed: number; doneCol?: boolean;
}> = ({title, x, y, cards, appearFrame, seed, doneCol}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < appearFrame) return null;

  const prog = spring({frame: frame - appearFrame, fps, durationInFrames: 16, config: SPRING_CONFIG});
  const opacity = interpolate(frame - appearFrame, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const scale = interpolate(prog, [0, 1], [0.9, 1]);

  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: 200,
      opacity, transform: `scale(${scale})`, transformOrigin: 'top center',
    }}>
      <div style={{
        color: '#fff', fontSize: 18, fontWeight: 800, fontFamily: FONT, textTransform: 'uppercase' as const,
        textAlign: 'center', marginBottom: 14, letterSpacing: 2,
        borderBottom: '3px solid rgba(255,255,255,0.3)', paddingBottom: 10,
      }}>
        {title}
      </div>
      {cards.map((card, i) => {
        const cardDelay = appearFrame + 8 + i * 5;
        const cardOpacity = interpolate(frame, [cardDelay, cardDelay + 6], [0, 1], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        });
        return (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.95)', borderRadius: 8,
            padding: '10px 14px', marginBottom: 10,
            color: '#1e293b', fontSize: 14, fontWeight: 600, fontFamily: FONT,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)', opacity: cardOpacity,
          }}>
            {card}
            {doneCol && frame > cardDelay + 10 && (
              <span style={{marginLeft: 8}}>✓</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

const MovingCard: React.FC<{
  text: string; fromX: number; fromY: number; toX: number; toY: number;
  startFrame: number; seed: number;
}> = ({text, fromX, fromY, toX, toY, startFrame, seed}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < startFrame) return null;

  const prog = spring({frame: frame - startFrame, fps, durationInFrames: 24, config: SPRING_CONFIG});
  const cx = interpolate(prog, [0, 1], [fromX, toX]);
  const cy = interpolate(prog, [0, 1], [fromY, toY]);
  const tilt = (sr(seed) - 0.5) * 3;

  return (
    <div style={{
      position: 'absolute', left: cx, top: cy, width: 190, zIndex: 10,
      background: '#fff', border: '2px solid rgba(255,255,255,0.6)',
      borderRadius: 8, padding: '10px 14px',
      color: '#1e293b', fontSize: 14, fontWeight: 700, fontFamily: FONT,
      transform: `rotate(${tilt}deg)`, boxShadow: '0 6px 24px rgba(0,0,0,0.2)',
    }}>
      {text}
    </div>
  );
};

export const WorkflowStarry: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#0D9488'}}>
      <PFP placeholder="S" name="Starry" subtitle="Product Manager"
        x={130} y={480} appearFrame={0} seed={20} />
      <PFP src="momo.jpg" name="Momo" subtitle="AI Self" isAI
        x={1310} y={480} appearFrame={12} seed={21} />

      <KanbanColumn title="To Do" x={330} y={280} appearFrame={20} seed={200}
        cards={['Design review', 'API spec draft', 'User interviews']} />
      <KanbanColumn title="In Progress" x={580} y={280} appearFrame={28} seed={210}
        cards={['Sprint planning', 'Bug triage']} />
      <KanbanColumn title="Done" x={830} y={280} appearFrame={36} seed={220}
        cards={['Roadmap v2', 'Standup notes']} doneCol />

      {/* Divider lines */}
      <svg style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
        <line x1={555} y1={280} x2={558} y2={650} stroke="rgba(255,255,255,0.25)" strokeWidth={2} strokeDasharray="8 5" />
        <line x1={805} y1={280} x2={808} y2={650} stroke="rgba(255,255,255,0.25)" strokeWidth={2} strokeDasharray="8 5" />
      </svg>

      <MovingCard text="Sprint planning" fromX={370} fromY={385} toX={620} toY={385}
        startFrame={60} seed={230} />
      <MovingCard text="Bug triage" fromX={620} fromY={430} toX={870} toY={430}
        startFrame={84} seed={240} />

      {/* Doodle checkmarks on Done cards */}
      <DoodleCheck x={1040} y={330} appearFrame={100} seed={250} />
      <DoodleCheck x={1040} y={378} appearFrame={108} seed={251} />

      <FilmGrain />
    </AbsoluteFill>
  );
};

// ─── 3. WorkflowRus — Purple #8B5CF6 ────────────────────────────────────────

const WorkIcon: React.FC<{
  emoji: string; label: string; x: number; y: number; appearFrame: number; seed: number;
}> = ({emoji, label, x, y, appearFrame, seed}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < appearFrame) return null;

  const prog = spring({frame: frame - appearFrame, fps, durationInFrames: 18, config: SPRING_CONFIG});
  const slideX = interpolate(prog, [0, 1], [30, 0]);
  const opacity = interpolate(frame - appearFrame, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const scale = interpolate(prog, [0, 1], [0.9, 1]);

  return (
    <div style={{
      position: 'absolute', left: x - 50 + slideX, top: y - 50,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      opacity, transform: `scale(${scale})`,
    }}>
      <div style={{
        width: 90, height: 90, borderRadius: 12,
        background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 42, boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }}>
        {emoji}
      </div>
      <div style={{
        marginTop: 10, color: '#fff', fontSize: 16, fontWeight: 700,
        fontFamily: FONT, textTransform: 'uppercase' as const, letterSpacing: 1,
        opacity: 0.85,
      }}>
        {label}
      </div>
    </div>
  );
};

export const WorkflowRus: React.FC = () => {
  const CY = 480;
  return (
    <AbsoluteFill style={{backgroundColor: '#8B5CF6'}}>
      <PFP placeholder="R" name="Rus" subtitle="Head of Design"
        x={180} y={CY} appearFrame={0} seed={40} />
      <WorkIcon emoji="🎨" label="Design" x={500} y={CY} appearFrame={24} seed={41} />
      <PFP placeholder="Russ" name="Russ" subtitle="AI Self" isAI
        x={820} y={CY} appearFrame={48} seed={42} />
      <WorkIcon emoji="📝" label="Feedback" x={1140} y={CY} appearFrame={72} seed={43} />

      <DoodleArrow x1={280} y1={CY} x2={440} y2={CY} startFrame={18} seed={400} />
      <DoodleArrow x1={560} y1={CY} x2={710} y2={CY} startFrame={42} seed={410} />
      <DoodleArrow x1={920} y1={CY} x2={1080} y2={CY} startFrame={66} seed={420} />

      <DoodleCheck x={1210} y={CY - 60} appearFrame={100} seed={430} />

      <FilmGrain />
    </AbsoluteFill>
  );
};

// ─── 4. WorkflowMatan — Coral #F97316 ───────────────────────────────────────

const ClusterBubble: React.FC<{
  emoji: string; label: string; x: number; y: number; appearFrame: number; seed: number;
}> = ({emoji, label, x, y, appearFrame, seed}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < appearFrame) return null;

  const prog = spring({frame: frame - appearFrame, fps, durationInFrames: 16, config: SPRING_CONFIG});
  const opacity = interpolate(frame - appearFrame, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const scale = interpolate(prog, [0, 1], [0.85, 1]);
  const tilt = (sr(seed) - 0.5) * 4;

  return (
    <div style={{
      position: 'absolute', left: x - 35, top: y - 35,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      opacity, transform: `scale(${scale}) rotate(${tilt}deg)`,
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 14,
        background: 'rgba(255,255,255,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 30, boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
      }}>
        {emoji}
      </div>
      <div style={{
        marginTop: 6, color: '#fff', fontSize: 12, fontWeight: 700,
        fontFamily: FONT, textTransform: 'uppercase' as const, opacity: 0.8,
      }}>
        {label}
      </div>
    </div>
  );
};

export const WorkflowMatan: React.FC = () => {
  const CY = 480;

  const research = [
    {emoji: '📄', label: 'Docs', x: 430, y: 370, delay: 30},
    {emoji: '🔬', label: 'Analysis', x: 500, y: 490, delay: 36},
    {emoji: '📊', label: 'Data', x: 430, y: 590, delay: 42},
  ];
  const creative = [
    {emoji: '🎨', label: 'Design', x: 1010, y: 370, delay: 30},
    {emoji: '🎬', label: 'Video', x: 1080, y: 490, delay: 36},
    {emoji: '✏️', label: 'Copy', x: 1010, y: 590, delay: 42},
  ];

  return (
    <AbsoluteFill style={{backgroundColor: '#F97316'}}>
      <PFP src="matan-ai.png" name="Matan" subtitle="Creative Director"
        x={160} y={CY} appearFrame={0} seed={30} />
      <PFP src="raccoon2.png" name="Raccoon 2.0" subtitle="AI Self (Bridge)" isAI
        x={720} y={CY} appearFrame={12} seed={31} />

      {/* Cluster labels */}
      <DoodleText text="RESEARCH" x={410} y={260} appearFrame={24} seed={400} fontSize={22} />
      <DoodleText text="CREATIVE" x={990} y={260} appearFrame={24} seed={410} fontSize={22} />

      {research.map((ic, i) => (
        <ClusterBubble key={`r-${i}`} emoji={ic.emoji} label={ic.label}
          x={ic.x} y={ic.y} appearFrame={ic.delay} seed={i * 10 + 300} />
      ))}
      {creative.map((ic, i) => (
        <ClusterBubble key={`c-${i}`} emoji={ic.emoji} label={ic.label}
          x={ic.x} y={ic.y} appearFrame={ic.delay} seed={i * 10 + 350} />
      ))}

      {/* Matan → Raccoon */}
      <DoodleArrow x1={270} y1={CY} x2={610} y2={CY} startFrame={16} seed={500} />

      {/* Bidirectional: Raccoon ↔ Research */}
      <DoodleArrow x1={610} y1={CY - 12} x2={540} y2={CY - 12} startFrame={50} seed={510}
        strokeWidth={2.5} />
      <DoodleArrow x1={540} y1={CY + 12} x2={610} y2={CY + 12} startFrame={58} seed={515}
        strokeWidth={2.5} />

      {/* Bidirectional: Raccoon ↔ Creative */}
      <DoodleArrow x1={830} y1={CY - 12} x2={970} y2={CY - 12} startFrame={50} seed={520} strokeWidth={2.5} />
      <DoodleArrow x1={970} y1={CY + 12} x2={830} y2={CY + 12} startFrame={58} seed={525} strokeWidth={2.5} />

      <DoodleCircle cx={720} cy={CY} r={90} appearFrame={80} seed={530} />

      <FilmGrain />
    </AbsoluteFill>
  );
};

// ─── 5. WorkflowDemi — Pink #EC4899 ─────────────────────────────────────────

export const WorkflowDemi: React.FC = () => {
  const CY = 480;
  const branches = [
    {name: 'Theo', src: 'theo.png', y: 240},
    {name: 'Momo', src: 'momo.jpg', y: 410},
    {name: 'Russ', placeholder: 'Russ', y: 580},
    {name: 'Raccoon 2.0', src: 'raccoon2.png', y: 750},
  ];

  return (
    <AbsoluteFill style={{backgroundColor: '#EC4899'}}>
      <PFP placeholder="D" name="Demi" subtitle="CEO"
        x={200} y={CY} appearFrame={0} seed={60} />
      <PFP src="semi.webp" name="Semi" subtitle="AI Self" isAI
        x={620} y={CY} appearFrame={18} seed={61} />

      {branches.map((b, i) => (
        <PFP key={b.name} src={b.src} placeholder={b.placeholder} name={b.name} isAI
          x={1150} y={b.y} size={90} appearFrame={48 + i * 10} seed={70 + i} />
      ))}

      {/* Demi → Semi */}
      <DoodleArrow x1={310} y1={CY} x2={510} y2={CY} startFrame={12} seed={600} />

      {/* Semi → branches (fan out) */}
      {branches.map((b, i) => (
        <DoodleArrow key={`br-${i}`} x1={730} y1={CY} x2={1040} y2={b.y}
          startFrame={42 + i * 10} seed={610 + i * 10} strokeWidth={2.5} />
      ))}

      <FilmGrain />
    </AbsoluteFill>
  );
};
