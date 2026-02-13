import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// ─── Stop-motion quantization ────────────────────────────────────────────────
// Quantize frame to simulate stop-motion at targetFps within 24fps comp
const stopMotionFrame = (frame: number, targetFps: number = 8) => {
  const ratio = 24 / targetFps; // 24/8 = 3, hold each frame for 3 actual frames
  return Math.floor(frame / ratio) * ratio;
};

// ─── Constants ───────────────────────────────────────────────────────────────

export const WORKFLOW_DURATION = 144; // 6s at 24fps

const FONT = 'system-ui, sans-serif';

// Safe zone: ~1100x800 centered in 1440x1080
// X: 170–1270, Y: 140–940
const SX = 170; // safe zone left
const SY = 140; // safe zone top

// Seeded random for deterministic wobble
const sr = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
};

// Messy offset helper: returns random offset in range [-mag, +mag]
const messy = (seed: number, mag: number) => (sr(seed) - 0.5) * 2 * mag;
// Messy rotation: ±3-8°
const messyRot = (seed: number) => (sr(seed) - 0.5) * 14;

// Random stagger: adds ±range frames to a base delay
const stagger = (seed: number, range: number) =>
  Math.round((sr(seed) - 0.5) * 2 * range);

// ─── Stamp entrance helpers ──────────────────────────────────────────────────
// Opacity: 0 before appearFrame, 1 at appearFrame (binary, 1 frame)
// Scale: 1.15 → 1.0 over 4 frames with linear ease-out (slam down)
const stampOpacity = (frame: number, appearFrame: number) =>
  frame >= appearFrame ? 1 : 0;

const stampScale = (frame: number, appearFrame: number) => {
  if (frame < appearFrame) return 0;
  const t = frame - appearFrame;
  if (t >= 4) return 1;
  // 1.15 → 1.0 over 4 frames, ease-out (quadratic)
  const p = t / 4;
  const eased = 1 - (1 - p) * (1 - p);
  return 1.15 - 0.15 * eased;
};

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
}> = ({src, placeholder, name, subtitle, x, y, size = 350, appearFrame, seed, textColor = '#fff', isAI}) => {
  const rawFrame = useCurrentFrame();
  const frame = stopMotionFrame(rawFrame);
  if (frame < appearFrame) return null;

  const opacity = stampOpacity(frame, appearFrame);
  const scale = stampScale(frame, appearFrame);
  const tilt = messyRot(seed + 77);

  return (
    <div style={{
      position: 'absolute',
      left: x - size / 2 + messy(seed + 10, 30),
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
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
        fontSize: 44,
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
}> = ({emoji, label, x, y, appearFrame, seed, emojiSize = 130, labelSize = 42}) => {
  const rawFrame = useCurrentFrame();
  const frame = stopMotionFrame(rawFrame);
  if (frame < appearFrame) return null;

  const opacity = stampOpacity(frame, appearFrame);
  const scale = stampScale(frame, appearFrame);
  const tilt = messyRot(seed + 33);

  return (
    <div style={{
      position: 'absolute',
      left: x - 50 + messy(seed + 5, 40),
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
  const rawFrame = useCurrentFrame();
  const frame = stopMotionFrame(rawFrame);
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

  // Use clip-rect reveal instead of strokeDasharray (way more reliable)
  const minX = Math.min(x1, cp1x, cp2x, x2) - 20;
  const maxX = Math.max(x1, cp1x, cp2x, x2) + 20;
  const clipX = minX + (maxX - minX) * drawProgress;

  const angle = Math.atan2(y2 - cp2y, x2 - cp2x);
  const as = 14;
  const ax1p = x2 - as * Math.cos(angle - 0.4);
  const ay1p = y2 - as * Math.sin(angle - 0.4);
  const ax2p = x2 - as * Math.cos(angle + 0.4);
  const ay2p = y2 - as * Math.sin(angle + 0.4);

  return (
    <svg style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      <defs>
        <clipPath id={`arrow-clip-${seed}`}>
          <rect x={0} y={0} width={clipX} height={1080} />
        </clipPath>
      </defs>
      <g clipPath={`url(#arrow-clip-${seed})`}>
        <path d={pathD} fill="none" stroke={stroke} strokeWidth={strokeWidth}
          strokeLinecap="round" opacity={0.85} />
        {showHead && drawProgress >= 0.9 && (
          <polygon points={`${x2},${y2} ${ax1p},${ay1p} ${ax2p},${ay2p}`} fill={stroke} opacity={0.85} />
        )}
      </g>
    </svg>
  );
};

// ─── Doodle Checkmark ────────────────────────────────────────────────────────

const DoodleCheck: React.FC<{x: number; y: number; appearFrame: number; seed: number; color?: string}> = ({
  x, y, appearFrame, seed, color = '#fff',
}) => {
  const rawFrame = useCurrentFrame();
  const frame = stopMotionFrame(rawFrame);
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

// ─── Doodle Text Annotation ──────────────────────────────────────────────────

const DoodleText: React.FC<{
  text: string; x: number; y: number; appearFrame: number; seed: number;
  color?: string; fontSize?: number;
}> = ({text, x, y, appearFrame, seed, color = '#fff', fontSize = 36}) => {
  const rawFrame = useCurrentFrame();
  const frame = stopMotionFrame(rawFrame);
  if (frame < appearFrame) return null;

  const opacity = stampOpacity(frame, appearFrame);
  const scale = stampScale(frame, appearFrame);
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
      transform: `scale(${scale}) rotate(${tilt}deg)`,
      opacity: opacity * 0.9,
      textShadow: '0 2px 8px rgba(0,0,0,0.2)',
    }}>
      {text}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSITIONS — All repositioned to ~1100x800 safe zone centered in 1440x1080
// Safe zone: X 170–1270, Y 140–940
// ═══════════════════════════════════════════════════════════════════════════════

// ─── 1. WorkflowAnthony — Blue #2563EB ───────────────────────────────────────

const PaperStrip: React.FC<{
  text: string; x: number; y: number;
  appearFrame: number; seed: number; width?: number;
}> = ({text, x, y, appearFrame, seed, width = 260}) => {
  const rawFrame = useCurrentFrame();
  const frame = stopMotionFrame(rawFrame);
  if (frame < appearFrame) return null;

  // Pure stamp — just appears with its final messy rotation, no animation
  const rotation = messy(seed + 6, 6) + 3 * (messy(seed, 1) > 0 ? 1 : -1);

  // Pseudo-random paper texture via gradient noise
  const gradAngle = Math.abs(messy(seed + 10, 180));
  const shade1 = '#F5F0E8';
  const shade2 = '#EDE8DC';
  const shade3 = '#F2EBE0';

  return (
    <div style={{
      position: 'absolute',
      left: x + messy(seed + 1, 35),
      top: y + messy(seed + 2, 30),
      width,
      padding: '12px 16px',
      borderRadius: 0,
      background: `linear-gradient(${gradAngle}deg, ${shade1} 0%, ${shade2} 40%, ${shade3} 70%, ${shade1} 100%)`,
      border: 'none',
      boxShadow: '2px 3px 12px rgba(0,0,0,0.3)',
      transform: `rotate(${rotation}deg)`,
      zIndex: seed,
    }}>
      <span style={{color: '#2a2420', fontSize: 17, fontWeight: 600, fontFamily: FONT, lineHeight: 1.3}}>
        {text}
      </span>
    </div>
  );
};

export const WorkflowAnthony: React.FC<{gawxFilter?: boolean}> = ({gawxFilter = true}) => {
  // Cards pile center first, then spread outward in a circular pattern
  // Center point: ~660, 440. Radius grows with each ring.
  const cx = 660, cy = 440;
  const cards = [
    // Ring 1: tight center cluster (radius ~40)
    {text: '@paboratories mention on TikTok', x: cx - 30, y: cy - 30, delay: 24, width: 280},
    {text: 'Pika trending on X', x: cx + 40, y: cy + 20, delay: 28, width: 210},
    {text: 'Brand collab request — IG', x: cx - 50, y: cy + 50, delay: 33, width: 270},
    {text: 'New creator partnership DM', x: cx + 20, y: cy - 60, delay: 37, width: 290},
    // Ring 2: spreading out (radius ~160)
    {text: "YouTube review: 'Pika is insane'", x: cx - 160, y: cy - 120, delay: 41, width: 320},
    {text: 'Reddit thread: AI video tools comparison', x: cx + 140, y: cy - 140, delay: 46, width: 300},
    {text: 'Forbes: Top 10 AI startups', x: cx + 160, y: cy + 130, delay: 50, width: 260},
    {text: 'Influencer inquiry — 2.3M followers', x: cx - 170, y: cy + 150, delay: 54, width: 280},
    // Ring 3: outer ring (radius ~280)
    {text: 'Product Hunt launch day mentions', x: cx - 50, y: cy - 270, delay: 58, width: 200},
    {text: 'Twitter Spaces invite — AI creators', x: cx + 250, y: cy + 30, delay: 63, width: 280},
    {text: 'TikTok creator fund partnership', x: cx - 230, y: cy + 10, delay: 67, width: 260},
    {text: 'LinkedIn post went viral — 50K views', x: cx + 50, y: cy + 260, delay: 71, width: 300},
  ];

  return (
    <AbsoluteFill style={{backgroundColor: '#111111'}}>
      <PFP src="anthony-pfp.png" name="Anthony" subtitle="Head of Partnerships"
        x={SX + 80} y={500} size={360} appearFrame={0} seed={1} />
      <PFP src="theo.png" name="Theo" subtitle="AI Self" isAI
        x={1270 - 80} y={480} size={340} appearFrame={12 + stagger(710, 3)} seed={2} />

      {cards.map((c, i) => (
        <PaperStrip key={i} text={c.text} x={c.x} y={c.y}
          appearFrame={c.delay + stagger(700 + i, 4)} seed={i * 7 + 50} width={c.width} />
      ))}

      <DoodleArrow x1={390} y1={500} x2={1050} y2={490} startFrame={18} seed={300} />
      <DoodleText text="24/7" x={660} y={740} appearFrame={90 + stagger(720, 3)} seed={310} fontSize={52} />
    </AbsoluteFill>
  );
};

// ─── 1b. WorkflowAnthonyStrips — Paper strips only, no PFPs ─────────────────

export const WorkflowAnthonyStrips: React.FC = () => {
  const cx = 720, cy = 500;
  const cards = [
    {text: '@paboratories mention on TikTok', x: cx - 30, y: cy - 30, delay: 8, width: 280},
    {text: 'Pika trending on X', x: cx + 40, y: cy + 20, delay: 12, width: 210},
    {text: 'Brand collab request — IG', x: cx - 50, y: cy + 50, delay: 17, width: 270},
    {text: 'New creator partnership DM', x: cx + 20, y: cy - 60, delay: 21, width: 290},
    {text: "YouTube review: 'Pika is insane'", x: cx - 160, y: cy - 120, delay: 25, width: 320},
    {text: 'Reddit thread: AI video tools comparison', x: cx + 140, y: cy - 140, delay: 30, width: 300},
    {text: 'Forbes: Top 10 AI startups', x: cx + 160, y: cy + 130, delay: 34, width: 260},
    {text: 'Influencer inquiry — 2.3M followers', x: cx - 170, y: cy + 150, delay: 38, width: 280},
    {text: 'Product Hunt launch day mentions', x: cx - 50, y: cy - 270, delay: 42, width: 200},
    {text: 'Twitter Spaces invite — AI creators', x: cx + 250, y: cy + 30, delay: 47, width: 280},
    {text: 'TikTok creator fund partnership', x: cx - 230, y: cy + 10, delay: 51, width: 260},
    {text: 'LinkedIn post went viral — 50K views', x: cx + 50, y: cy + 260, delay: 55, width: 300},
  ];

  return (
    <AbsoluteFill style={{backgroundColor: 'transparent'}}>
      {cards.map((c, i) => (
        <PaperStrip key={i} text={c.text} x={c.x} y={c.y}
          appearFrame={c.delay + stagger(700 + i, 4)} seed={i * 7 + 50} width={c.width} />
      ))}
    </AbsoluteFill>
  );
};

// ─── 2. WorkflowStarry — Teal #0D9488 ───────────────────────────────────────

const StickyNote: React.FC<{
  text: string; x: number; y: number; color: string;
  appearFrame: number; seed: number; done?: boolean;
}> = ({text, x, y, color, appearFrame, seed, done}) => {
  const rawFrame = useCurrentFrame();
  const frame = stopMotionFrame(rawFrame);
  if (frame < appearFrame) return null;

  const opacity = stampOpacity(frame, appearFrame);
  const scale = stampScale(frame, appearFrame);
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
      <PFP src="starry-pfp.jpg" name="Starry" subtitle="Product Manager"
        x={SX + 70} y={490} size={340} appearFrame={0} seed={20} />
      <PFP src="momo.jpg" name="Momo" subtitle="AI Self" isAI
        x={1270 - 60} y={520} size={330} appearFrame={12 + stagger(800, 3)} seed={21} />

      {/* Column headers — messy */}
      <DoodleText text="TO DO" x={400} y={210} appearFrame={18 + stagger(801, 3)} seed={200} fontSize={34} />
      <DoodleText text="IN PROGRESS" x={640} y={200} appearFrame={24 + stagger(802, 3)} seed={201} fontSize={34} />
      <DoodleText text="DONE" x={920} y={215} appearFrame={30 + stagger(803, 3)} seed={202} fontSize={34} />

      {/* Sticky notes scattered — staggered with random variation */}
      <StickyNote text="Design review" x={390} y={290} color="#FEF08A" appearFrame={22 + stagger(810, 4)} seed={210} />
      <StickyNote text="API spec draft" x={410} y={440} color="#FDE68A" appearFrame={30 + stagger(811, 4)} seed={211} />
      <StickyNote text="User interviews" x={380} y={580} color="#FCD34D" appearFrame={38 + stagger(812, 4)} seed={212} />

      <StickyNote text="Sprint planning" x={640} y={310} color="#BAE6FD" appearFrame={44 + stagger(820, 4)} seed={220} />
      <StickyNote text="Bug triage" x={660} y={460} color="#A5F3FC" appearFrame={52 + stagger(821, 4)} seed={221} />

      <StickyNote text="Roadmap v2" x={900} y={320} color="#BBF7D0" appearFrame={58 + stagger(830, 4)} seed={230} done />
      <StickyNote text="Standup notes" x={920} y={470} color="#D9F99D" appearFrame={66 + stagger(831, 4)} seed={231} done />

      {/* Arrows: Starry → board, board → Momo */}
      <DoodleArrow x1={350} y1={500} x2={400} y2={420} startFrame={20} seed={250} />
      <DoodleArrow x1={1060} y1={420} x2={1120} y2={500} startFrame={70} seed={260} />

      <DoodleCheck x={1060} y={350} appearFrame={100 + stagger(840, 3)} seed={270} />
      <DoodleCheck x={1060} y={500} appearFrame={108 + stagger(841, 3)} seed={271} />
    </AbsoluteFill>
  );
};

// ─── 3. WorkflowRus — Purple #8B5CF6 ────────────────────────────────────────

export const WorkflowRus: React.FC<{gawxFilter?: boolean}> = ({gawxFilter = true}) => {
  // Shifted ~80px right so the 4 nodes feel centered in 1440px frame
  // Node centers: Rus(250,470), Design(620,410), Russ(900,500), Feedback(1180,440)
  const rusX = 250;
  const designX = 620;
  const russX = 900;
  const fbX = 1180;
  const rusY = 470;
  const designY = 410;
  const russY = 500;
  const fbY = 440;

  return (
    <AbsoluteFill style={{backgroundColor: '#111111'}}>
      <PFP src="rus-pfp.jpg" name="" subtitle=""
        x={rusX} y={rusY} size={360} appearFrame={0} seed={40} />
      <NakedEmoji emoji="🎨" label="" x={designX} y={designY} appearFrame={24 + stagger(900, 4)} seed={41} emojiSize={140} labelSize={44} />
      <PFP src="russ-pfp.png" name="" subtitle="" isAI
        x={russX} y={russY} size={340} appearFrame={48 + stagger(901, 4)} seed={42} />
      <NakedEmoji emoji="📝" label="" x={fbX} y={fbY} appearFrame={72 + stagger(902, 4)} seed={43} emojiSize={140} labelSize={44} />

      {/* Hand-drawn doodle arrows: Rus → Design → Russ → Feedback */}
      <DoodleArrow x1={rusX + 100} y1={rusY} x2={designX - 40} y2={designY} startFrame={14} seed={800} strokeWidth={6} />
      <DoodleArrow x1={designX + 40} y1={designY} x2={russX - 100} y2={russY} startFrame={38} seed={810} strokeWidth={6} />
      <DoodleArrow x1={russX + 100} y1={russY} x2={fbX - 40} y2={fbY} startFrame={62} seed={820} strokeWidth={6} />
    </AbsoluteFill>
  );
};

// ─── 4. WorkflowMatan — Coral #F97316 ───────────────────────────────────────
// Research cluster appears one by one, THEN creative cluster one by one
// Each element staggered 10 frames apart with ±3 random variation

export const WorkflowMatan: React.FC<{gawxFilter?: boolean}> = ({gawxFilter = true}) => {
  const researchBase = 28;
  const research = [
    {emoji: '📄', label: 'Docs', x: 420, y: 220, delay: researchBase + 0 + stagger(950, 3)},
    {emoji: '🔬', label: 'Analysis', x: 500, y: 480, delay: researchBase + 10 + stagger(951, 3)},
    {emoji: '📊', label: 'Data', x: 380, y: 740, delay: researchBase + 22 + stagger(952, 3)},
  ];
  const creativeBase = researchBase + 36; // starts after research cluster
  const creative = [
    {emoji: '🎨', label: 'Design', x: 1020, y: 220, delay: creativeBase + 0 + stagger(960, 3)},
    {emoji: '🎬', label: 'Video', x: 1120, y: 480, delay: creativeBase + 10 + stagger(961, 3)},
    {emoji: '✏️', label: 'Copy', x: 1000, y: 740, delay: creativeBase + 22 + stagger(962, 3)},
  ];

  return (
    <AbsoluteFill style={{backgroundColor: '#111111'}}>
      <PFP src="matan-ai.png" name="Matan" subtitle="Creative Director"
        x={SX + 80} y={500} size={360} appearFrame={0} seed={30} />
      <PFP src="raccoon2.png" name="Raccoon 2.0" subtitle="AI Self (Bridge)" isAI
        x={720} y={480} size={340} appearFrame={12 + stagger(970, 3)} seed={31} />

      <DoodleText text="RESEARCH" x={420} y={220} appearFrame={24 + stagger(971, 3)} seed={400} fontSize={36} />
      <DoodleText text="CREATIVE" x={930} y={210} appearFrame={creativeBase - 4 + stagger(972, 3)} seed={410} fontSize={36} />

      {research.map((ic, i) => (
        <NakedEmoji key={`r-${i}`} emoji={ic.emoji} label={ic.label}
          x={ic.x} y={ic.y} appearFrame={ic.delay} seed={i * 10 + 300} emojiSize={130} labelSize={40} />
      ))}
      {creative.map((ic, i) => (
        <NakedEmoji key={`c-${i}`} emoji={ic.emoji} label={ic.label}
          x={ic.x} y={ic.y} appearFrame={ic.delay} seed={i * 10 + 350} emojiSize={130} labelSize={40} />
      ))}

      <DoodleArrow x1={360} y1={500} x2={600} y2={490} startFrame={16} seed={500} />
      <DoodleArrow x1={620} y1={440} x2={530} y2={400} startFrame={50} seed={510} strokeWidth={2.5} />
      <DoodleArrow x1={540} y1={540} x2={620} y2={510} startFrame={58} seed={515} strokeWidth={2.5} />
      <DoodleArrow x1={840} y1={440} x2={940} y2={380} startFrame={creativeBase + 4} seed={520} strokeWidth={2.5} />
      <DoodleArrow x1={960} y1={540} x2={850} y2={510} startFrame={creativeBase + 12} seed={525} strokeWidth={2.5} />
    </AbsoluteFill>
  );
};

// ─── 5. WorkflowDemi — Pink #EC4899 ─────────────────────────────────────────

export const WorkflowDemi: React.FC<{gawxFilter?: boolean}> = ({gawxFilter = true}) => {
  const branches = [
    {name: 'Theo', src: 'theo.png', y: 240},
    {name: 'Momo', src: 'momo.jpg', y: 420},
    {name: 'Russ', placeholder: 'Russ', y: 600},
    {name: 'Raccoon 2.0', src: 'raccoon2.png', y: 780},
  ];

  return (
    <AbsoluteFill style={{backgroundColor: '#111111'}}>
      <PFP src="demi-pfp.jpg" name="Demi" subtitle="CEO"
        x={SX + 80} y={500} size={370} appearFrame={0} seed={60} />
      <PFP src="semi.webp" name="Semi" subtitle="AI Self" isAI
        x={620} y={480} size={360} appearFrame={18 + stagger(1000, 3)} seed={61} />

      {branches.map((b, i) => (
        <PFP key={b.name} src={b.src} placeholder={b.placeholder} name={b.name} isAI
          x={1100} y={b.y} size={260} appearFrame={48 + i * 12 + stagger(1010 + i, 4)} seed={70 + i} />
      ))}

      <DoodleArrow x1={400} y1={500} x2={500} y2={490} startFrame={12} seed={600} />

      {branches.map((b, i) => (
        <DoodleArrow key={`br-${i}`} x1={770} y1={490} x2={990} y2={b.y}
          startFrame={42 + i * 12 + stagger(1020 + i, 4)} seed={610 + i * 10} strokeWidth={2.5} />
      ))}
    </AbsoluteFill>
  );
};
