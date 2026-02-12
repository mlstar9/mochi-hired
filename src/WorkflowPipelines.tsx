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

  // Overshoot bounce spring
  const progress = spring({
    frame: frame - appearFrame,
    fps,
    durationInFrames: 18,
    config: {damping: 8, stiffness: 180, mass: 0.8},
  });

  // Whip-pan: slam in from right
  const slideX = interpolate(frame - appearFrame, [0, 6], [200, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const opacity = interpolate(frame - appearFrame, [0, 4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scale = interpolate(progress, [0, 1], [0.3, 1]);

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

export const WorkflowAnthony: React.FC = () => (
  <LinearPipeline
    nodes={[
      {name: 'Anthony', pfp: 'user-pfp.png', title: 'Head of Partnerships'},
      {name: 'Partnerships', emoji: '📊', isWork: true},
      {name: 'Theo', pfp: 'theo.png', title: 'AI Self', isAI: true},
      {name: 'Brand Monitoring', emoji: '🔍', isWork: true},
    ]}
  />
);

export const WorkflowStarry: React.FC = () => (
  <LinearPipeline
    nodes={[
      {name: 'Starry', placeholder: 'S', title: 'Product Manager'},
      {name: 'Product', emoji: '📋', isWork: true},
      {name: 'Momo', pfp: 'momo.jpg', title: 'AI Self', isAI: true},
      {name: 'Linear Tasks / Zoom', emoji: '✅', isWork: true},
    ]}
  />
);

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

export const WorkflowMatan: React.FC = () => (
  <LinearPipeline
    nodes={[
      {name: 'Matan', pfp: 'matan-ai.png', title: 'Creative Director'},
      {name: 'Creative', emoji: '🎬', isWork: true},
      {name: 'Raccoon 2.0', pfp: 'raccoon2.png', title: 'AI Self', isAI: true},
      {name: 'Research ↔ Creative', emoji: '🔬', isWork: true},
    ]}
  />
);

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
