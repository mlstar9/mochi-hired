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

// ─── Types ───────────────────────────────────────────────────────────────────

interface NodeData {
  name: string;
  title?: string;
  pfp?: string; // path in public/images/
  placeholder?: string; // letter(s) for placeholder circle
  isAI?: boolean;
  isWork?: boolean; // emoji work-type node
  emoji?: string;
}

interface PipelineProps {
  nodes: NodeData[];
  /** For branching layout (WorkflowDemi) */
  branchAfter?: number; // index after which nodes fan out
}

// ─── Constants ───────────────────────────────────────────────────────────────

const BG = '#111111';
const NODE_SIZE = 120;
const AI_GLOW = '#6366f1';
const WORK_COLOR = '#888';
const NODE_SPACING_Y = 220;
const START_Y = 140;
const CENTER_X = 720; // 1440/2 (4:3 @ 1440x1080)
const FRAMES_PER_NODE = 24; // 1s per node appearance at 24fps
const LINE_DRAW_FRAMES = 18;
const PULSE_FRAMES = 12;

// ─── Shared: Node Circle ─────────────────────────────────────────────────────

const PipelineNode: React.FC<{
  node: NodeData;
  x: number;
  y: number;
  appearFrame: number;
}> = ({node, x, y, appearFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const progress = spring({frame: frame - appearFrame, fps, durationInFrames: 20, config: {damping: 15}});
  const opacity = interpolate(frame - appearFrame, [0, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  if (frame < appearFrame) return null;

  const scale = interpolate(progress, [0, 1], [0.5, 1]);

  const isWork = node.isWork;
  const size = isWork ? 80 : NODE_SIZE;

  return (
    <div
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity,
        transform: `scale(${scale})`,
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
          background: isWork ? '#222' : node.pfp ? '#333' : '#333',
          border: node.isAI ? `3px solid ${AI_GLOW}` : isWork ? '2px solid #444' : '3px solid #555',
          boxShadow: node.isAI ? `0 0 20px ${AI_GLOW}40, 0 0 40px ${AI_GLOW}20` : 'none',
          fontSize: isWork ? 36 : 48,
        }}
      >
        {isWork && node.emoji ? (
          <span style={{fontSize: 36}}>{node.emoji}</span>
        ) : node.pfp ? (
          <Img src={staticFile(`images/${node.pfp}`)} style={{width: size, height: size, objectFit: 'cover'}} />
        ) : (
          <span style={{color: '#aaa', fontSize: 32, fontWeight: 600, fontFamily: 'SF Pro Display, system-ui, sans-serif'}}>
            {node.placeholder || '?'}
          </span>
        )}
      </div>

      {/* Name */}
      <div
        style={{
          marginTop: 12,
          color: '#fff',
          fontSize: 24,
          fontWeight: 600,
          fontFamily: 'SF Pro Display, system-ui, sans-serif',
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        {node.name}
      </div>

      {/* Title / Label */}
      {node.title && (
        <div
          style={{
            marginTop: 4,
            color: node.isAI ? AI_GLOW : WORK_COLOR,
            fontSize: 18,
            fontWeight: 400,
            fontFamily: 'SF Pro Display, system-ui, sans-serif',
            textAlign: 'center',
          }}
        >
          {node.title}
        </div>
      )}
    </div>
  );
};

// ─── Shared: Connector Line + Pulse ──────────────────────────────────────────

const Connector: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  startFrame: number;
}> = ({x1, y1, x2, y2, startFrame}) => {
  const frame = useCurrentFrame();

  if (frame < startFrame) return null;

  const drawProgress = interpolate(frame - startFrame, [0, LINE_DRAW_FRAMES], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const pulseProgress = interpolate(
    frame - startFrame - LINE_DRAW_FRAMES,
    [0, PULSE_FRAMES],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);

  const currentX2 = x1 + dx * drawProgress;
  const currentY2 = y1 + dy * drawProgress;

  // Pulse dot position
  const showPulse = frame >= startFrame + LINE_DRAW_FRAMES && pulseProgress < 1;
  const pulseX = x1 + dx * pulseProgress;
  const pulseY = y1 + dy * pulseProgress;

  return (
    <svg
      style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none'}}
    >
      <line
        x1={x1}
        y1={y1}
        x2={currentX2}
        y2={currentY2}
        stroke="#555"
        strokeWidth={2}
      />
      {showPulse && (
        <circle cx={pulseX} cy={pulseY} r={5} fill="#fff" opacity={0.9}>
          <animate attributeName="r" values="4;7;4" dur="0.3s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  );
};

// ─── Linear Pipeline (Pipelines 1-4) ────────────────────────────────────────

const LinearPipeline: React.FC<{nodes: NodeData[]}> = ({nodes}) => {
  const nodePositions = nodes.map((_, i) => ({
    x: CENTER_X,
    y: START_Y + i * NODE_SPACING_Y,
  }));

  return (
    <AbsoluteFill style={{backgroundColor: BG}}>
      {/* Connectors */}
      {nodes.map((_, i) => {
        if (i === 0) return null;
        const startFrame = i * FRAMES_PER_NODE + 5;
        return (
          <Connector
            key={`line-${i}`}
            x1={nodePositions[i - 1].x}
            y1={nodePositions[i - 1].y + (nodes[i - 1].isWork ? 40 : NODE_SIZE / 2) + 20}
            x2={nodePositions[i].x}
            y2={nodePositions[i].y - (nodes[i].isWork ? 40 : NODE_SIZE / 2) - 20}
            startFrame={startFrame}
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
        />
      ))}
    </AbsoluteFill>
  );
};

// ─── Branching Pipeline (Pipeline 5 - Demi) ─────────────────────────────────

const BranchingPipeline: React.FC<{
  topNodes: NodeData[];
  branchNodes: NodeData[];
}> = ({topNodes, branchNodes}) => {
  // Top nodes vertical
  const topPositions = topNodes.map((_, i) => ({
    x: CENTER_X,
    y: START_Y + i * NODE_SPACING_Y,
  }));

  // Branch nodes fan out horizontally
  const branchY = START_Y + topNodes.length * NODE_SPACING_Y + 60;
  const branchSpacing = 220;
  const branchStartX = CENTER_X - ((branchNodes.length - 1) * branchSpacing) / 2;
  const branchPositions = branchNodes.map((_, i) => ({
    x: branchStartX + i * branchSpacing,
    y: branchY,
  }));

  const lastTopIdx = topNodes.length - 1;
  const branchStartFrame = topNodes.length * FRAMES_PER_NODE;

  return (
    <AbsoluteFill style={{backgroundColor: BG}}>
      {/* Top connectors */}
      {topNodes.map((_, i) => {
        if (i === 0) return null;
        return (
          <Connector
            key={`top-line-${i}`}
            x1={topPositions[i - 1].x}
            y1={topPositions[i - 1].y + NODE_SIZE / 2 + 20}
            x2={topPositions[i].x}
            y2={topPositions[i].y - NODE_SIZE / 2 - 20}
            startFrame={i * FRAMES_PER_NODE + 5}
          />
        );
      })}

      {/* Branch connectors */}
      {branchNodes.map((_, i) => (
        <Connector
          key={`branch-line-${i}`}
          x1={topPositions[lastTopIdx].x}
          y1={topPositions[lastTopIdx].y + NODE_SIZE / 2 + 20}
          x2={branchPositions[i].x}
          y2={branchPositions[i].y - NODE_SIZE / 2 - 20}
          startFrame={branchStartFrame + i * 8 + 5}
        />
      ))}

      {/* Top nodes */}
      {topNodes.map((node, i) => (
        <PipelineNode
          key={node.name}
          node={node}
          x={topPositions[i].x}
          y={topPositions[i].y}
          appearFrame={i * FRAMES_PER_NODE}
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
        />
      ))}
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
