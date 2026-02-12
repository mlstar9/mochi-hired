import React, {useMemo} from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// ─── Types ───────────────────────────────────────────────────────────────────

interface NodeData {
  name: string;
  title?: string;
  pfp?: string;
  placeholder?: string;
  isAI?: boolean;
  isWork?: boolean;
  emoji?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const BG = '#111111';
const NODE_SIZE = 120;
const AI_GLOW = '#6366f1';
const WORK_COLOR = '#888';
const NODE_SPACING_X = 300;
const START_X = 170;
const CENTER_Y = 440;
const FRAMES_PER_NODE = 24;
const LINE_DRAW_FRAMES = 14;

// Seeded random for deterministic "hand-drawn" wobble
const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
};

// ─── Film Grain Overlay ──────────────────────────────────────────────────────

const FilmGrain: React.FC = () => {
  const frame = useCurrentFrame();
  // Shift background-position each frame for grain movement
  const ox = (frame * 37) % 200;
  const oy = (frame * 53) % 200;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity: 0.06,
        backgroundImage:
          'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'4\' height=\'4\'%3E%3Crect width=\'1\' height=\'1\' fill=\'white\' x=\'0\' y=\'0\' opacity=\'0.5\'/%3E%3Crect width=\'1\' height=\'1\' fill=\'white\' x=\'2\' y=\'3\' opacity=\'0.3\'/%3E%3Crect width=\'1\' height=\'1\' fill=\'white\' x=\'3\' y=\'1\' opacity=\'0.7\'/%3E%3C/svg%3E")',
        backgroundPosition: `${ox}px ${oy}px`,
        mixBlendMode: 'overlay',
      }}
    />
  );
};

// ─── Shared: Node Circle (Scrappy Style) ─────────────────────────────────────

const PipelineNode: React.FC<{
  node: NodeData;
  x: number;
  y: number;
  appearFrame: number;
  seed: number;
}> = ({node, x, y, appearFrame, seed}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  if (frame < appearFrame) return null;

  // Smooth professional spring — no bounce
  const progress = spring({
    frame: frame - appearFrame,
    fps,
    durationInFrames: 20,
    config: {damping: 34, stiffness: 120, mass: 1},
  });

  // Subtle slide in from right (not whip-pan)
  const slideX = interpolate(frame - appearFrame, [0, 12], [40, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const opacity = interpolate(frame - appearFrame, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scale = interpolate(progress, [0, 1], [0.85, 1]);

  // Hand-drawn rotation
  const rotation = (seededRandom(seed) - 0.5) * 4; // -2 to 2 degrees
  const labelTilt = (seededRandom(seed + 1) - 0.5) * 3;
  const labelOffsetX = (seededRandom(seed + 2) - 0.5) * 6;

  const isWork = node.isWork;
  const size = isWork ? 80 : NODE_SIZE;

  // Rough border for pfp circles
  const roughShadow = node.isAI
    ? `0 0 20px ${AI_GLOW}40, 0 0 40px ${AI_GLOW}20, ${2 + seededRandom(seed + 3) * 3}px ${1 + seededRandom(seed + 4) * 2}px 0 0 ${AI_GLOW}`
    : isWork
    ? `${seededRandom(seed + 5) * 2}px ${seededRandom(seed + 6) * 2}px 0 0 #444`
    : `${1 + seededRandom(seed + 7) * 3}px ${seededRandom(seed + 8) * 2}px 0 1px #666, -${seededRandom(seed + 9) * 2}px ${seededRandom(seed + 10) * 2}px 0 0 #555`;

  return (
    <div
      style={{
        position: 'absolute',
        left: x - size / 2 + slideX,
        top: y - size / 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity,
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        transformOrigin: 'center center',
      }}
    >
      {/* Circle / Emoji */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isWork ? '#222' : '#333',
          border: node.isAI
            ? `3px solid ${AI_GLOW}`
            : isWork
            ? '2px solid #444'
            : '3px solid #555',
          boxShadow: roughShadow,
          fontSize: isWork ? 36 : 48,
        }}
      >
        {isWork && node.emoji ? (
          <span style={{fontSize: 36}}>{node.emoji}</span>
        ) : node.pfp ? (
          <Img
            src={staticFile(`images/${node.pfp}`)}
            style={{width: size, height: size, objectFit: 'cover'}}
          />
        ) : (
          <span
            style={{
              color: '#aaa',
              fontSize: 32,
              fontWeight: 600,
              fontFamily: 'SF Pro Display, system-ui, sans-serif',
            }}
          >
            {node.placeholder || '?'}
          </span>
        )}
      </div>

      {/* Name — slightly off-center and tilted */}
      <div
        style={{
          marginTop: 12,
          color: '#fff',
          fontSize: 24,
          fontWeight: 600,
          fontFamily: 'SF Pro Display, system-ui, sans-serif',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          transform: `rotate(${labelTilt}deg) translateX(${labelOffsetX}px)`,
        }}
      >
        {node.name}
      </div>

      {/* Title / Label — scrappy highlight for AI Self */}
      {node.title && (
        <div
          style={{
            marginTop: 4,
            color: node.isAI ? '#fff' : WORK_COLOR,
            fontSize: 18,
            fontWeight: node.isAI ? 600 : 400,
            fontFamily: 'SF Pro Display, system-ui, sans-serif',
            textAlign: 'center',
            transform: `rotate(${-labelTilt * 0.5}deg)`,
            ...(node.isAI
              ? {
                  background: `linear-gradient(transparent 60%, ${AI_GLOW}80 60%)`,
                  display: 'inline-block',
                  padding: '0 6px',
                  borderBottom: `2px solid ${AI_GLOW}`,
                }
              : {}),
          }}
        >
          {node.title}
        </div>
      )}
    </div>
  );
};

// ─── Shared: Scrappy Arrow Connector ─────────────────────────────────────────

const Connector: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  startFrame: number;
  seed: number;
}> = ({x1, y1, x2, y2, startFrame, seed}) => {
  const frame = useCurrentFrame();

  if (frame < startFrame) return null;

  const drawProgress = interpolate(frame - startFrame, [0, LINE_DRAW_FRAMES], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Wobble control points for hand-drawn feel
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const wobbleY1 = midY + (seededRandom(seed) - 0.5) * 30;
  const wobbleY2 = midY + (seededRandom(seed + 1) - 0.5) * 20;

  const pathD = `M ${x1} ${y1} C ${x1 + (midX - x1) * 0.5} ${wobbleY1}, ${midX + (x2 - midX) * 0.5} ${wobbleY2}, ${x2} ${y2}`;

  // Approximate path length for dash animation
  const dx = x2 - x1;
  const dy = y2 - y1;
  const approxLen = Math.sqrt(dx * dx + dy * dy) * 1.2;

  const drawn = approxLen * drawProgress;

  // Arrowhead at end
  const arrowSize = 10;
  const angle = Math.atan2(y2 - wobbleY2, x2 - (midX + (x2 - midX) * 0.5));
  const ax1 = x2 - arrowSize * Math.cos(angle - 0.4);
  const ay1 = y2 - arrowSize * Math.sin(angle - 0.4);
  const ax2 = x2 - arrowSize * Math.cos(angle + 0.4);
  const ay2 = y2 - arrowSize * Math.sin(angle + 0.4);

  const arrowOpacity = drawProgress >= 0.95 ? 1 : 0;

  return (
    <svg
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <path
        d={pathD}
        fill="none"
        stroke="#ddd"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray={approxLen}
        strokeDashoffset={approxLen - drawn}
        style={{filter: 'url(#roughen)'}}
      />
      {/* Arrowhead */}
      <polygon
        points={`${x2},${y2} ${ax1},${ay1} ${ax2},${ay2}`}
        fill="#ddd"
        opacity={arrowOpacity}
      />
    </svg>
  );
};

// SVG filter for rough edges
const RoughenFilter: React.FC = () => (
  <svg style={{position: 'absolute', width: 0, height: 0}}>
    <defs>
      <filter id="roughen">
        <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="3" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>
);

// ─── Linear Pipeline (Pipelines 1-4) ────────────────────────────────────────

const LinearPipeline: React.FC<{nodes: NodeData[]}> = ({nodes}) => {
  const nodePositions = nodes.map((_, i) => ({
    x: START_X + i * NODE_SPACING_X,
    y: CENTER_Y,
  }));

  return (
    <AbsoluteFill style={{backgroundColor: BG}}>
      <RoughenFilter />

      {/* Connectors */}
      {nodes.map((_, i) => {
        if (i === 0) return null;
        const startFrame = i * FRAMES_PER_NODE + 5;
        return (
          <Connector
            key={`line-${i}`}
            x1={nodePositions[i - 1].x + (nodes[i - 1].isWork ? 40 : NODE_SIZE / 2) + 20}
            y1={nodePositions[i - 1].y}
            x2={nodePositions[i].x - (nodes[i].isWork ? 40 : NODE_SIZE / 2) - 20}
            y2={nodePositions[i].y}
            startFrame={startFrame}
            seed={i * 100}
          />
        );
      })}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <PipelineNode
          key={node.name}
          node={node}
          x={nodePositions[i].x}
          y={nodePositions[i].y}
          appearFrame={i * FRAMES_PER_NODE}
          seed={i * 10 + 1}
        />
      ))}

      <FilmGrain />
    </AbsoluteFill>
  );
};

// ─── Branching Pipeline (Pipeline 5 - Demi) ─────────────────────────────────

const BranchingPipeline: React.FC<{
  topNodes: NodeData[];
  branchNodes: NodeData[];
}> = ({topNodes, branchNodes}) => {
  const topPositions = topNodes.map((_, i) => ({
    x: 200 + i * NODE_SPACING_X,
    y: 400,
  }));

  const branchX = 200 + topNodes.length * NODE_SPACING_X + 100;
  const branchSpacing = 180;
  const branchStartY = 400 - ((branchNodes.length - 1) * branchSpacing) / 2;
  const branchPositions = branchNodes.map((_, i) => ({
    x: branchX,
    y: branchStartY + i * branchSpacing,
  }));

  const lastTopIdx = topNodes.length - 1;
  const branchStartFrame = topNodes.length * FRAMES_PER_NODE;

  return (
    <AbsoluteFill style={{backgroundColor: BG}}>
      <RoughenFilter />

      {/* Left connectors */}
      {topNodes.map((_, i) => {
        if (i === 0) return null;
        return (
          <Connector
            key={`top-line-${i}`}
            x1={topPositions[i - 1].x + NODE_SIZE / 2 + 20}
            y1={topPositions[i - 1].y}
            x2={topPositions[i].x - NODE_SIZE / 2 - 20}
            y2={topPositions[i].y}
            startFrame={i * FRAMES_PER_NODE + 5}
            seed={i * 100 + 500}
          />
        );
      })}

      {/* Branch connectors */}
      {branchNodes.map((_, i) => (
        <Connector
          key={`branch-line-${i}`}
          x1={topPositions[lastTopIdx].x + NODE_SIZE / 2 + 20}
          y1={topPositions[lastTopIdx].y}
          x2={branchPositions[i].x - NODE_SIZE / 2 - 20}
          y2={branchPositions[i].y}
          startFrame={branchStartFrame + i * 8 + 5}
          seed={i * 100 + 700}
        />
      ))}

      {/* Left nodes */}
      {topNodes.map((node, i) => (
        <PipelineNode
          key={node.name}
          node={node}
          x={topPositions[i].x}
          y={topPositions[i].y}
          appearFrame={i * FRAMES_PER_NODE}
          seed={i * 10 + 50}
        />
      ))}

      {/* Branch nodes */}
      {branchNodes.map((node, i) => (
        <PipelineNode
          key={node.name}
          node={node}
          x={branchPositions[i].x}
          y={branchPositions[i].y}
          appearFrame={branchStartFrame + i * 8}
          seed={i * 10 + 80}
        />
      ))}

      <FilmGrain />
    </AbsoluteFill>
  );
};

// ─── Compositions ────────────────────────────────────────────────────────────

// ─── Social Card Component ───────────────────────────────────────────────────

const SocialCard: React.FC<{
  text: string;
  x: number;
  y: number;
  fromX: number;
  fromY: number;
  appearFrame: number;
  tilt: number;
  seed: number;
}> = ({text, x, y, fromX, fromY, appearFrame, tilt, seed}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  if (frame < appearFrame) return null;

  const prog = spring({
    frame: frame - appearFrame,
    fps,
    durationInFrames: 20,
    config: {damping: 30, stiffness: 120, mass: 1},
  });

  const cx = interpolate(prog, [0, 1], [fromX, x]);
  const cy = interpolate(prog, [0, 1], [fromY, y]);
  const opacity = interpolate(frame - appearFrame, [0, 5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(prog, [0, 1], [0.4, 1]);
  const wobble = (seededRandom(seed) - 0.5) * 2;

  return (
    <div
      style={{
        position: 'absolute',
        left: cx - 100,
        top: cy - 40,
        width: 200,
        height: 80,
        borderRadius: 12,
        background: '#1a1a2e',
        border: '2px solid #C2BEFF60',
        boxShadow: '0 2px 12px #C2BEFF20',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px 12px',
        opacity,
        transform: `scale(${scale}) rotate(${tilt + wobble}deg)`,
        transformOrigin: 'center center',
      }}
    >
      <span
        style={{
          color: '#C2BEFF',
          fontSize: 15,
          fontWeight: 600,
          fontFamily: 'SF Pro Display, system-ui, sans-serif',
          textAlign: 'center',
          lineHeight: 1.3,
        }}
      >
        {text}
      </span>
    </div>
  );
};

// ─── Scrappy Arrow with Label ────────────────────────────────────────────────

const LabeledArrow: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  startFrame: number;
  seed: number;
}> = ({x1, y1, x2, y2, label, startFrame, seed}) => {
  const frame = useCurrentFrame();

  if (frame < startFrame) return null;

  const drawProgress = interpolate(frame - startFrame, [0, LINE_DRAW_FRAMES], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const wobbleY = midY + (seededRandom(seed) - 0.5) * 25;
  const pathD = `M ${x1} ${y1} Q ${midX} ${wobbleY}, ${x2} ${y2}`;
  const approxLen = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) * 1.3;
  const drawn = approxLen * drawProgress;

  const angle = Math.atan2(y2 - wobbleY, x2 - midX);
  const as = 10;
  const ax1p = x2 - as * Math.cos(angle - 0.4);
  const ay1p = y2 - as * Math.sin(angle - 0.4);
  const ax2p = x2 - as * Math.cos(angle + 0.4);
  const ay2p = y2 - as * Math.sin(angle + 0.4);

  const labelTilt = (seededRandom(seed + 5) - 0.5) * 4;
  const labelOpacity = interpolate(frame - startFrame, [LINE_DRAW_FRAMES - 2, LINE_DRAW_FRAMES + 4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      <svg style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none'}}>
        <path d={pathD} fill="none" stroke="#ddd" strokeWidth={2.5} strokeLinecap="round"
          strokeDasharray={approxLen} strokeDashoffset={approxLen - drawn} style={{filter: 'url(#roughen)'}} />
        {drawProgress >= 0.95 && (
          <polygon points={`${x2},${y2} ${ax1p},${ay1p} ${ax2p},${ay2p}`} fill="#ddd" />
        )}
      </svg>
      <div style={{
        position: 'absolute',
        left: midX - 80,
        top: Math.min(y1, y2) + 60,
        width: 160,
        textAlign: 'center',
        color: '#aaa',
        fontSize: 16,
        fontWeight: 500,
        fontFamily: 'SF Pro Display, system-ui, sans-serif',
        fontStyle: 'italic',
        opacity: labelOpacity,
        transform: `rotate(${labelTilt}deg)`,
      }}>
        {label}
      </div>
    </>
  );
};

export const WorkflowAnthony: React.FC = () => {
  const socialCards = [
    {text: '@paboratories mention on TikTok', fromX: 720, fromY: -60, x: 560, y: 340, tilt: -3, delay: 24},
    {text: 'Pika trending on X', fromX: 200, fromY: 540, x: 660, y: 460, tilt: 2, delay: 42},
    {text: 'Brand collab request — IG', fromX: 1300, fromY: 300, x: 800, y: 340, tilt: -1.5, delay: 60},
    {text: 'New creator partnership DM', fromX: 720, fromY: 700, x: 700, y: 560, tilt: 3, delay: 78},
  ];

  return (
    <AbsoluteFill style={{backgroundColor: BG}}>
      <RoughenFilter />

      <PipelineNode
        node={{name: 'Anthony', pfp: 'user-pfp.png', title: 'Head of Partnerships'}}
        x={220} y={CENTER_Y} appearFrame={0} seed={1}
      />

      <PipelineNode
        node={{name: 'Theo', pfp: 'theo.png', title: 'AI Self', isAI: true}}
        x={1220} y={CENTER_Y} appearFrame={12} seed={2}
      />

      {socialCards.map((c, i) => (
        <SocialCard key={i} text={c.text} x={c.x} y={c.y} fromX={c.fromX} fromY={c.fromY}
          appearFrame={c.delay} tilt={c.tilt} seed={i * 10 + 50} />
      ))}

      <LabeledArrow x1={320} y1={CENTER_Y + 30} x2={1120} y2={CENTER_Y + 30}
        label="evaluates 24/7" startFrame={18} seed={300} />

      <FilmGrain />
    </AbsoluteFill>
  );
};

// ─── Kanban Column ───────────────────────────────────────────────────────────

const KanbanColumn: React.FC<{
  title: string;
  x: number;
  y: number;
  cards: string[];
  appearFrame: number;
  seed: number;
  // moving card info
  movingCardIdx?: number;
  moveStartFrame?: number;
  moveToX?: number;
}> = ({title, x, y, cards, appearFrame, seed}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  if (frame < appearFrame) return null;

  const prog = spring({
    frame: frame - appearFrame,
    fps,
    durationInFrames: 14,
    config: {damping: 30, stiffness: 120, mass: 1},
  });

  const opacity = interpolate(frame - appearFrame, [0, 4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const headerTilt = (seededRandom(seed) - 0.5) * 5;

  return (
    <div style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 180,
      opacity,
      transform: `scale(${interpolate(prog, [0, 1], [0.5, 1])})`,
      transformOrigin: 'top center',
    }}>
      {/* Column header */}
      <div style={{
        color: '#C2BEFF',
        fontSize: 18,
        fontWeight: 700,
        fontFamily: 'SF Pro Display, system-ui, sans-serif',
        textAlign: 'center',
        marginBottom: 12,
        transform: `rotate(${headerTilt}deg)`,
        borderBottom: '2px dashed #444',
        paddingBottom: 8,
      }}>
        {title}
      </div>
      {/* Cards */}
      {cards.map((card, i) => {
        const cardTilt = (seededRandom(seed + i * 3 + 10) - 0.5) * 4;
        const cardDelay = appearFrame + 6 + i * 5;
        const cardOpacity = interpolate(frame, [cardDelay, cardDelay + 4], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div key={i} style={{
            background: '#1e1e2e',
            border: '1px solid #333',
            borderRadius: 8,
            padding: '8px 10px',
            marginBottom: 8,
            color: '#ccc',
            fontSize: 13,
            fontFamily: 'SF Pro Display, system-ui, sans-serif',
            transform: `rotate(${cardTilt}deg)`,
            opacity: cardOpacity,
          }}>
            {card}
          </div>
        );
      })}
    </div>
  );
};

// ─── Moving Task Card ────────────────────────────────────────────────────────

const MovingTaskCard: React.FC<{
  text: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  startFrame: number;
  seed: number;
}> = ({text, fromX, fromY, toX, toY, startFrame, seed}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  if (frame < startFrame) return null;

  const prog = spring({
    frame: frame - startFrame,
    fps,
    durationInFrames: 24,
    config: {damping: 30, stiffness: 120, mass: 1},
  });

  const cx = interpolate(prog, [0, 1], [fromX, toX]);
  const cy = interpolate(prog, [0, 1], [fromY, toY]);
  const tilt = (seededRandom(seed) - 0.5) * 4;

  return (
    <div style={{
      position: 'absolute',
      left: cx,
      top: cy,
      width: 170,
      background: '#C2BEFF20',
      border: '2px solid #C2BEFF80',
      borderRadius: 8,
      padding: '8px 10px',
      color: '#C2BEFF',
      fontSize: 13,
      fontWeight: 600,
      fontFamily: 'SF Pro Display, system-ui, sans-serif',
      transform: `rotate(${tilt}deg)`,
      boxShadow: '0 0 16px #C2BEFF30',
      zIndex: 10,
    }}>
      {text}
    </div>
  );
};

// ─── Zoom Badge ──────────────────────────────────────────────────────────────

const ZoomBadge: React.FC<{x: number; y: number; appearFrame: number}> = ({x, y, appearFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  if (frame < appearFrame) return null;

  const prog = spring({
    frame: frame - appearFrame,
    fps,
    durationInFrames: 16,
    config: {damping: 30, stiffness: 120, mass: 1},
  });

  return (
    <div style={{
      position: 'absolute',
      left: x,
      top: y,
      background: '#2D8CFF',
      borderRadius: 20,
      padding: '6px 14px',
      color: '#fff',
      fontSize: 16,
      fontWeight: 700,
      fontFamily: 'SF Pro Display, system-ui, sans-serif',
      transform: `scale(${interpolate(prog, [0, 1], [0, 1])})`,
      boxShadow: '0 2px 10px #2D8CFF60',
    }}>
      📹 Zoom
    </div>
  );
};

export const WorkflowStarry: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: BG}}>
      <RoughenFilter />

      <PipelineNode
        node={{name: 'Starry', placeholder: 'S', title: 'Product Manager'}}
        x={140} y={CENTER_Y} appearFrame={0} seed={20}
      />

      <PipelineNode
        node={{name: 'Momo', pfp: 'momo.jpg', title: 'AI Self', isAI: true}}
        x={1300} y={CENTER_Y} appearFrame={12} seed={21}
      />

      {/* Kanban columns */}
      <KanbanColumn title="To Do" x={370} y={280} appearFrame={20} seed={200}
        cards={['Design review', 'API spec draft', 'User interviews']} />
      <KanbanColumn title="In Progress" x={600} y={280} appearFrame={28} seed={210}
        cards={['Sprint planning', 'Bug triage']} />
      <KanbanColumn title="Done" x={830} y={280} appearFrame={36} seed={220}
        cards={['Roadmap v2', 'Standup notes']} />

      {/* Hand-drawn divider lines */}
      <svg style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
        <line x1={565} y1={280} x2={568} y2={620} stroke="#444" strokeWidth={2}
          strokeDasharray="6 4" style={{filter: 'url(#roughen)'}} />
        <line x1={795} y1={280} x2={798} y2={620} stroke="#444" strokeWidth={2}
          strokeDasharray="6 4" style={{filter: 'url(#roughen)'}} />
      </svg>

      {/* Moving task cards */}
      <MovingTaskCard text="Sprint planning" fromX={405} fromY={390} toX={635} toY={390}
        startFrame={60} seed={230} />
      <MovingTaskCard text="Bug triage" fromX={635} fromY={430} toX={865} toY={430}
        startFrame={84} seed={240} />

      <ZoomBadge x={1240} y={CENTER_Y + 90} appearFrame={100} />

      <FilmGrain />
    </AbsoluteFill>
  );
};

export const WorkflowRus: React.FC = () => (
  <LinearPipeline
    nodes={[
      {name: 'Rus', placeholder: 'R', title: 'Head of Design'},
      {name: 'Design', emoji: '🎨', isWork: true},
      {name: 'Russ', placeholder: 'Russ', title: 'AI Self', isAI: true},
      {name: 'Design Feedback', emoji: '📝', isWork: true},
    ]}
  />
);

// ─── Cluster Icons ───────────────────────────────────────────────────────────

const ClusterIcon: React.FC<{
  emoji: string;
  x: number;
  y: number;
  appearFrame: number;
  tilt: number;
  seed: number;
}> = ({emoji, x, y, appearFrame, tilt, seed}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  if (frame < appearFrame) return null;

  const prog = spring({
    frame: frame - appearFrame,
    fps,
    durationInFrames: 14,
    config: {damping: 30, stiffness: 120, mass: 1},
  });

  const wobble = (seededRandom(seed) - 0.5) * 2;

  return (
    <div style={{
      position: 'absolute',
      left: x - 28,
      top: y - 28,
      width: 56,
      height: 56,
      borderRadius: 12,
      background: '#1e1e2e',
      border: '2px solid #444',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 28,
      transform: `scale(${interpolate(prog, [0, 1], [0.3, 1])}) rotate(${tilt + wobble}deg)`,
      opacity: interpolate(frame - appearFrame, [0, 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    }}>
      {emoji}
    </div>
  );
};

// ─── Bidirectional Arrows ────────────────────────────────────────────────────

const BidirectionalArrows: React.FC<{
  x1: number; y1: number; x2: number; y2: number;
  startFrame: number; seed: number;
}> = ({x1, y1, x2, y2, startFrame, seed}) => {
  const frame = useCurrentFrame();

  if (frame < startFrame) return null;

  const draw1 = interpolate(frame - startFrame, [0, LINE_DRAW_FRAMES], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const draw2 = interpolate(frame - startFrame - 8, [0, LINE_DRAW_FRAMES], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const midX = (x1 + x2) / 2;
  const w1 = (seededRandom(seed) - 0.5) * 30;
  const w2 = (seededRandom(seed + 1) - 0.5) * 30;
  const approxLen = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) * 1.3;

  const pathFwd = `M ${x1} ${y1 - 8} Q ${midX} ${(y1 + y2) / 2 + w1 - 8}, ${x2} ${y2 - 8}`;
  const pathBck = `M ${x2} ${y2 + 8} Q ${midX} ${(y1 + y2) / 2 + w2 + 8}, ${x1} ${y1 + 8}`;

  const as = 9;
  const angleFwd = Math.atan2(y2 - ((y1 + y2) / 2 + w1), x2 - midX);
  const angleBck = Math.atan2(y1 - ((y1 + y2) / 2 + w2), x1 - midX);

  return (
    <svg style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {/* Forward arrow */}
      <path d={pathFwd} fill="none" stroke="#C2BEFF" strokeWidth={2} strokeLinecap="round"
        strokeDasharray={approxLen} strokeDashoffset={approxLen - approxLen * draw1}
        style={{filter: 'url(#roughen)'}} />
      {draw1 >= 0.95 && (
        <polygon points={`${x2},${y2 - 8} ${x2 - as * Math.cos(angleFwd - 0.4)},${y2 - 8 - as * Math.sin(angleFwd - 0.4)} ${x2 - as * Math.cos(angleFwd + 0.4)},${y2 - 8 - as * Math.sin(angleFwd + 0.4)}`}
          fill="#C2BEFF" />
      )}
      {/* Backward arrow */}
      <path d={pathBck} fill="none" stroke="#aaa" strokeWidth={2} strokeLinecap="round"
        strokeDasharray={approxLen} strokeDashoffset={approxLen - approxLen * Math.max(0, draw2)}
        style={{filter: 'url(#roughen)'}} />
      {draw2 >= 0.95 && (
        <polygon points={`${x1},${y1 + 8} ${x1 - as * Math.cos(angleBck - 0.4)},${y1 + 8 - as * Math.sin(angleBck - 0.4)} ${x1 - as * Math.cos(angleBck + 0.4)},${y1 + 8 - as * Math.sin(angleBck + 0.4)}`}
          fill="#aaa" />
      )}
    </svg>
  );
};

// ─── Cluster Label ───────────────────────────────────────────────────────────

const ClusterLabel: React.FC<{
  text: string; x: number; y: number; appearFrame: number; seed: number;
}> = ({text, x, y, appearFrame, seed}) => {
  const frame = useCurrentFrame();
  if (frame < appearFrame) return null;

  const opacity = interpolate(frame - appearFrame, [0, 6], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const tilt = (seededRandom(seed) - 0.5) * 6;

  return (
    <div style={{
      position: 'absolute',
      left: x,
      top: y,
      color: '#888',
      fontSize: 20,
      fontWeight: 700,
      fontFamily: 'SF Pro Display, system-ui, sans-serif',
      transform: `rotate(${tilt}deg)`,
      opacity,
      textTransform: 'uppercase',
      letterSpacing: 2,
    }}>
      {text}
    </div>
  );
};

export const WorkflowMatan: React.FC = () => {
  // Research cluster icons (left side)
  const researchIcons = [
    {emoji: '📄', x: 450, y: 360, tilt: -3, delay: 30},
    {emoji: '🔬', x: 520, y: 460, tilt: 2, delay: 36},
    {emoji: '📊', x: 460, y: 540, tilt: -1, delay: 42},
  ];

  // Creative cluster icons (right side)
  const creativeIcons = [
    {emoji: '🎨', x: 980, y: 360, tilt: 2, delay: 30},
    {emoji: '🎬', x: 1050, y: 460, tilt: -2, delay: 36},
    {emoji: '✏️', x: 990, y: 540, tilt: 3, delay: 42},
  ];

  return (
    <AbsoluteFill style={{backgroundColor: BG}}>
      <RoughenFilter />

      {/* Matan on far left */}
      <PipelineNode
        node={{name: 'Matan', pfp: 'matan-ai.png', title: 'Creative Director'}}
        x={160} y={CENTER_Y} appearFrame={0} seed={30}
      />

      {/* Raccoon 2.0 in the CENTER (the bridge) */}
      <PipelineNode
        node={{name: 'Raccoon 2.0', pfp: 'raccoon2.png', title: 'AI Self', isAI: true}}
        x={720} y={CENTER_Y} appearFrame={12} seed={31}
      />

      {/* Cluster labels */}
      <ClusterLabel text="Research" x={440} y={280} appearFrame={24} seed={400} />
      <ClusterLabel text="Creative" x={970} y={280} appearFrame={24} seed={410} />

      {/* Research icons */}
      {researchIcons.map((ic, i) => (
        <ClusterIcon key={`r-${i}`} emoji={ic.emoji} x={ic.x} y={ic.y}
          appearFrame={ic.delay} tilt={ic.tilt} seed={i * 10 + 300} />
      ))}

      {/* Creative icons */}
      {creativeIcons.map((ic, i) => (
        <ClusterIcon key={`c-${i}`} emoji={ic.emoji} x={ic.x} y={ic.y}
          appearFrame={ic.delay} tilt={ic.tilt} seed={i * 10 + 350} />
      ))}

      {/* Bidirectional arrows: Raccoon ↔ Research cluster */}
      <BidirectionalArrows x1={550} y1={CENTER_Y} x2={660} y2={CENTER_Y}
        startFrame={50} seed={500} />

      {/* Bidirectional arrows: Raccoon ↔ Creative cluster */}
      <BidirectionalArrows x1={780} y1={CENTER_Y} x2={940} y2={CENTER_Y}
        startFrame={50} seed={510} />

      {/* Arrow from Matan to Raccoon */}
      <Connector x1={260} y1={CENTER_Y} x2={620} y2={CENTER_Y}
        startFrame={16} seed={520} />

      <FilmGrain />
    </AbsoluteFill>
  );
};

export const WorkflowDemi: React.FC = () => (
  <BranchingPipeline
    topNodes={[
      {name: 'Demi', placeholder: 'D', title: 'CEO'},
      {name: 'Semi', pfp: 'semi.webp', title: 'AI Self', isAI: true},
    ]}
    branchNodes={[
      {name: 'Theo', pfp: 'theo.png', isAI: true},
      {name: 'Momo', pfp: 'momo.jpg', isAI: true},
      {name: 'Russ', placeholder: 'Russ', isAI: true},
      {name: 'Raccoon 2.0', pfp: 'raccoon2.png', isAI: true},
    ]}
  />
);

export const WORKFLOW_DURATION = 144; // 6s at 24fps
