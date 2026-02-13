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

// Messy offset helper: returns random offset in range [-mag, +mag]
const messy = (seed: number, mag: number) => (sr(seed) - 0.5) * 2 * mag;
// Messy rotation: ±3-8°
const messyRot = (seed: number) => (sr(seed) - 0.5) * 14;

// ─── PFP Node (square, big, slightly tilted) ────────────────────────────────

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
}> = ({src, placeholder, name, subtitle, x, y, size = 220, appearFrame, seed, textColor = '#fff', isAI}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < appearFrame) return null;

  const prog = spring({frame: frame - appearFrame, fps, durationInFrames: 20, config: SPRING_CONFIG});
  const slideX = interpolate(prog, [0, 1], [35, 0]);
  const opacity = interpolate(frame - appearFrame, [0, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const scale = interpolate(prog, [0, 1], [0.92, 1]);
  const tilt = messyRot(seed + 77);

  return (
    <div style={{
      position: 'absolute',
      left: x - size / 2 + slideX + messy(seed + 10, 30),
      top: y - size / 2 + messy(seed + 11, 25),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      opacity,
      transform: `scale(${scale}) rotate(${tilt}deg)`,
    }}>
      <div style={{
        width: size,
        height: size,
        borderRadius: 0,
        overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
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
        fontSize: 34,
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
          fontSize: 20,
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

// ─── Naked Emoji (no container, just big emoji with rotation) ────────────────

const NakedEmoji: React.FC<{
  emoji: string; label: string; x: number; y: number; appearFrame: number; seed: number;
  emojiSize?: number; labelSize?: number;
}> = ({emoji, label, x, y, appearFrame, seed, emojiSize = 90, labelSize = 32}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < appearFrame) return null;

  const prog = spring({frame: frame - appearFrame, fps, durationInFrames: 18, config: SPRING_CONFIG});
  const slideX = interpolate(prog, [0, 1], [30, 0]);
  const opacity = interpolate(frame - appearFrame, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const scale = interpolate(prog, [0, 1], [0.9, 1]);
  const tilt = messyRot(seed + 33);

  return (
    <div style={{
      position: 'absolute',
      left: x - 50 + slideX + messy(seed + 5, 40),
      top: y - 50 + messy(seed + 6, 30),
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      opacity, transform: `scale(${scale}) rotate(${tilt}deg)`,
    }}>
      <span style={{fontSize: emojiSize, lineHeight: 1}}>
        {emoji}
      </span>
      <div style={{
        marginTop: 8, color: '#fff', fontSize: labelSize, fontWeight: 800,
        fontFamily: FONT, textTransform: 'uppercase' as const, letterSpacing: 1,
        textShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }}>
        {label}
      </div>
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
}> = ({text, x, y, appearFrame, seed, color = '#fff', fontSize = 36}) => {
  const frame = useCurrentFrame();
  if (frame < appearFrame) return null;

  const opacity = interpolate(frame - appearFrame, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const tilt = messyRot(seed);

  return (
    <div style={{
      position: 'absolute',
      left: x + messy(seed + 1, 30),
      top: y + messy(seed + 2, 20),
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
  const cx = interpolate(prog, [0, 1], [fromX, x + messy(seed + 1, 40)]);
  const cy = interpolate(prog, [0, 1], [fromY, y + messy(seed + 2, 30)]);
  const opacity = interpolate(frame - appearFrame, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const scale = interpolate(prog, [0, 1], [0.85, 1]);
  const tilt = messyRot(seed);

  return (
    <div style={{
      position: 'absolute',
      left: cx - 130,
      top: cy - 40,
      width: 260,
      padding: '14px 18px',
      borderRadius: 10,
      background: '#fff',
      borderLeft: `5px solid ${accent}`,
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      opacity,
      transform: `scale(${scale}) rotate(${tilt}deg)`,
    }}>
      <span style={{color: '#1e293b', fontSize: 18, fontWeight: 600, fontFamily: FONT, lineHeight: 1.3}}>
        {text}
      </span>
    </div>
  );
};

export const WorkflowAnthony: React.FC<{gawxFilter?: boolean}> = ({gawxFilter = true}) => {
  const cards = [
    {text: '@paboratories mention on TikTok', accent: '#F97316', fromX: 720, fromY: -60, x: 560, y: 280, delay: 24},
    {text: 'Pika trending on X', accent: '#EC4899', fromX: 200, fromY: 600, x: 700, y: 440, delay: 42},
    {text: 'Brand collab request — IG', accent: '#8B5CF6', fromX: 1300, fromY: 300, x: 840, y: 310, delay: 60},
    {text: 'New creator partnership DM', accent: '#0D9488', fromX: 720, fromY: 800, x: 680, y: 600, delay: 78},
  ];

  return (
    <AbsoluteFill style={{backgroundColor: '#111111'}}>
      <PFP src="user-pfp.png" name="Anthony" subtitle="Head of Partnerships"
        x={180} y={480} size={230} appearFrame={0} seed={1} />
      <PFP src="theo.png" name="Theo" subtitle="AI Self" isAI
        x={1260} y={460} size={220} appearFrame={12} seed={2} />

      {cards.map((c, i) => (
        <SocialCard key={i} text={c.text} accent={c.accent} x={c.x} y={c.y}
          fromX={c.fromX} fromY={c.fromY} appearFrame={c.delay} seed={i * 10 + 50} />
      ))}

      <DoodleArrow x1={340} y1={500} x2={1100} y2={480} startFrame={18} seed={300} />
      <DoodleText text="24/7" x={660} y={720} appearFrame={90} seed={310} fontSize={52} />
      <DoodleCircle cx={700} cy={740} r={55} appearFrame={95} seed={320} />
    </AbsoluteFill>
  );
};

// ─── 2. WorkflowStarry — Teal #0D9488 ───────────────────────────────────────

const StickyNote: React.FC<{
  text: string; x: number; y: number; color: string;
  appearFrame: number; seed: number; done?: boolean;
}> = ({text, x, y, color, appearFrame, seed, done}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < appearFrame) return null;

  const prog = spring({frame: frame - appearFrame, fps, durationInFrames: 16, config: SPRING_CONFIG});
  const opacity = interpolate(frame - appearFrame, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const scale = interpolate(prog, [0, 1], [0.85, 1]);
  const tilt = messyRot(seed);

  return (
    <div style={{
      position: 'absolute',
      left: x + messy(seed + 1, 35),
      top: y + messy(seed + 2, 25),
      width: 180, padding: '16px 14px',
      background: color,
      boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
      opacity, transform: `scale(${scale}) rotate(${tilt}deg)`,
    }}>
      <span style={{color: '#1e293b', fontSize: 17, fontWeight: 700, fontFamily: FONT, lineHeight: 1.3}}>
        {text}{done ? ' ✓' : ''}
      </span>
    </div>
  );
};

export const WorkflowStarry: React.FC<{gawxFilter?: boolean}> = ({gawxFilter = true}) => {
  return (
    <AbsoluteFill style={{backgroundColor: '#111111'}}>
      <PFP placeholder="S" name="Starry" subtitle="Product Manager"
        x={130} y={460} size={220} appearFrame={0} seed={20} />
      <PFP src="momo.jpg" name="Momo" subtitle="AI Self" isAI
        x={1310} y={500} size={210} appearFrame={12} seed={21} />

      {/* Column headers — messy */}
      <DoodleText text="TO DO" x={380} y={180} appearFrame={18} seed={200} fontSize={34} />
      <DoodleText text="IN PROGRESS" x={620} y={170} appearFrame={24} seed={201} fontSize={34} />
      <DoodleText text="DONE" x={920} y={185} appearFrame={30} seed={202} fontSize={34} />

      {/* Sticky notes scattered */}
      <StickyNote text="Design review" x={360} y={260} color="#FEF08A" appearFrame={22} seed={210} />
      <StickyNote text="API spec draft" x={380} y={420} color="#FDE68A" appearFrame={28} seed={211} />
      <StickyNote text="User interviews" x={350} y={570} color="#FCD34D" appearFrame={34} seed={212} />

      <StickyNote text="Sprint planning" x={620} y={280} color="#BAE6FD" appearFrame={36} seed={220} />
      <StickyNote text="Bug triage" x={640} y={440} color="#A5F3FC" appearFrame={42} seed={221} />

      <StickyNote text="Roadmap v2" x={890} y={290} color="#BBF7D0" appearFrame={48} seed={230} done />
      <StickyNote text="Standup notes" x={910} y={450} color="#D9F99D" appearFrame={54} seed={231} done />

      {/* Arrows: Starry → board, board → Momo */}
      <DoodleArrow x1={300} y1={480} x2={370} y2={400} startFrame={20} seed={250} />
      <DoodleArrow x1={1080} y1={400} x2={1160} y2={480} startFrame={60} seed={260} />

      <DoodleCheck x={1090} y={320} appearFrame={100} seed={270} />
      <DoodleCheck x={1090} y={480} appearFrame={108} seed={271} />
    </AbsoluteFill>
  );
};

// ─── 3. WorkflowRus — Purple #8B5CF6 ────────────────────────────────────────

export const WorkflowRus: React.FC<{gawxFilter?: boolean}> = ({gawxFilter = true}) => {
  return (
    <AbsoluteFill style={{backgroundColor: '#111111'}}>
      <PFP placeholder="R" name="Rus" subtitle="Head of Design"
        x={160} y={440} size={230} appearFrame={0} seed={40} />
      <NakedEmoji emoji="🎨" label="Design" x={520} y={380} appearFrame={24} seed={41} emojiSize={95} labelSize={34} />
      <PFP placeholder="Russ" name="Russ" subtitle="AI Self" isAI
        x={860} y={500} size={220} appearFrame={48} seed={42} />
      <NakedEmoji emoji="📝" label="Feedback" x={1180} y={420} appearFrame={72} seed={43} emojiSize={95} labelSize={34} />

      <DoodleArrow x1={320} y1={460} x2={460} y2={410} startFrame={18} seed={400} />
      <DoodleArrow x1={620} y1={420} x2={740} y2={480} startFrame={42} seed={410} />
      <DoodleArrow x1={1000} y1={500} x2={1120} y2={450} startFrame={66} seed={420} />

      <DoodleCheck x={1300} y={380} appearFrame={100} seed={430} />
      <DoodleText text="ITERATE" x={600} y={650} appearFrame={90} seed={440} fontSize={40} />
      <DoodleCircle cx={680} cy={670} r={60} appearFrame={95} seed={450} />
    </AbsoluteFill>
  );
};

// ─── 4. WorkflowMatan — Coral #F97316 ───────────────────────────────────────

export const WorkflowMatan: React.FC<{gawxFilter?: boolean}> = ({gawxFilter = true}) => {
  const research = [
    {emoji: '📄', label: 'Docs', x: 440, y: 300, delay: 30},
    {emoji: '🔬', label: 'Analysis', x: 520, y: 500, delay: 36},
    {emoji: '📊', label: 'Data', x: 400, y: 660, delay: 42},
  ];
  const creative = [
    {emoji: '🎨', label: 'Design', x: 1020, y: 280, delay: 30},
    {emoji: '🎬', label: 'Video', x: 1120, y: 480, delay: 36},
    {emoji: '✏️', label: 'Copy', x: 1000, y: 650, delay: 42},
  ];

  return (
    <AbsoluteFill style={{backgroundColor: '#111111'}}>
      <PFP src="matan-ai.png" name="Matan" subtitle="Creative Director"
        x={150} y={480} size={230} appearFrame={0} seed={30} />
      <PFP src="raccoon2.png" name="Raccoon 2.0" subtitle="AI Self (Bridge)" isAI
        x={720} y={460} size={220} appearFrame={12} seed={31} />

      <DoodleText text="RESEARCH" x={390} y={190} appearFrame={24} seed={400} fontSize={36} />
      <DoodleText text="CREATIVE" x={980} y={180} appearFrame={24} seed={410} fontSize={36} />

      {research.map((ic, i) => (
        <NakedEmoji key={`r-${i}`} emoji={ic.emoji} label={ic.label}
          x={ic.x} y={ic.y} appearFrame={ic.delay} seed={i * 10 + 300} emojiSize={85} labelSize={30} />
      ))}
      {creative.map((ic, i) => (
        <NakedEmoji key={`c-${i}`} emoji={ic.emoji} label={ic.label}
          x={ic.x} y={ic.y} appearFrame={ic.delay} seed={i * 10 + 350} emojiSize={85} labelSize={30} />
      ))}

      <DoodleArrow x1={310} y1={480} x2={600} y2={470} startFrame={16} seed={500} />
      <DoodleArrow x1={620} y1={420} x2={520} y2={380} startFrame={50} seed={510} strokeWidth={2.5} />
      <DoodleArrow x1={520} y1={540} x2={620} y2={500} startFrame={58} seed={515} strokeWidth={2.5} />
      <DoodleArrow x1={850} y1={420} x2={980} y2={360} startFrame={50} seed={520} strokeWidth={2.5} />
      <DoodleArrow x1={1000} y1={540} x2={860} y2={500} startFrame={58} seed={525} strokeWidth={2.5} />

      <DoodleCircle cx={720} cy={470} r={100} appearFrame={80} seed={530} />
    </AbsoluteFill>
  );
};

// ─── 5. WorkflowDemi — Pink #EC4899 ─────────────────────────────────────────

export const WorkflowDemi: React.FC<{gawxFilter?: boolean}> = ({gawxFilter = true}) => {
  const branches = [
    {name: 'Theo', src: 'theo.png', y: 200},
    {name: 'Momo', src: 'momo.jpg', y: 400},
    {name: 'Russ', placeholder: 'Russ', y: 600},
    {name: 'Raccoon 2.0', src: 'raccoon2.png', y: 800},
  ];

  return (
    <AbsoluteFill style={{backgroundColor: '#111111'}}>
      <PFP placeholder="D" name="Demi" subtitle="CEO"
        x={180} y={480} size={240} appearFrame={0} seed={60} />
      <PFP src="semi.webp" name="Semi" subtitle="AI Self" isAI
        x={620} y={460} size={230} appearFrame={18} seed={61} />

      {branches.map((b, i) => (
        <PFP key={b.name} src={b.src} placeholder={b.placeholder} name={b.name} isAI
          x={1150} y={b.y} size={160} appearFrame={48 + i * 10} seed={70 + i} />
      ))}

      <DoodleArrow x1={350} y1={490} x2={480} y2={470} startFrame={12} seed={600} />

      {branches.map((b, i) => (
        <DoodleArrow key={`br-${i}`} x1={780} y1={470} x2={1030} y2={b.y}
          startFrame={42 + i * 10} seed={610 + i * 10} strokeWidth={2.5} />
      ))}
    </AbsoluteFill>
  );
};
