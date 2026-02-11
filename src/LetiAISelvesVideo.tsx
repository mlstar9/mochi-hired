import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Img,
  staticFile,
} from 'remotion';

// ── Config ──────────────────────────────────────────────────────────────────
const BG_COLOR = '#111111';
const SUBTITLE_COLOR = '#FFFFFF';
const SUBTITLE_FONT = 'SF Pro Display, SF Pro, -apple-system, system-ui, sans-serif';
const LABEL_COLOR = '#888888';
const DING_LABEL_COLOR = '#C2BEFF'; // pika purple for "(AI Self)" labels

// ── Types ───────────────────────────────────────────────────────────────────
interface Section {
  id: string;
  label: string;
  durationSec: number;
  subtitles: SubtitleLine[];
  note?: string;
}

interface SubtitleLine {
  text: string;
  startSec: number; // relative to section start
  durationSec: number;
  style?: 'normal' | 'label' | 'aiself';
}

// ── Sections ────────────────────────────────────────────────────────────────
// Each section = a placeholder card. Leti drops in footage later.
// Subtitles are baked in as text overlays.

const SECTIONS: Section[] = [
  {
    id: 'intro',
    label: 'INTRO — Leti to camera',
    durationSec: 8,
    subtitles: [
      { text: "You're not gonna believe this but —", startSec: 0, durationSec: 2.5 },
      { text: "our company used our own product, AI Selves,", startSec: 2.5, durationSec: 2.5 },
      { text: "to push the actual product.", startSec: 5, durationSec: 1.5 },
      { text: "Let me explain.", startSec: 7, durationSec: 1 },
    ],
  },
  {
    id: 'anthony-intro',
    label: 'ANTHONY — Real photo + title',
    durationSec: 4,
    note: '[Photo: Anthony — Head of Partnerships]',
    subtitles: [
      { text: "This is Anthony, our head of partnerships.", startSec: 0, durationSec: 3 },
      { text: "And this is Theo.", startSec: 3, durationSec: 1 },
    ],
  },
  {
    id: 'theo-reveal',
    label: 'THEO — Avatar reveal + ding SFX',
    durationSec: 7,
    note: '[Avatar: Theo] [SFX: ding] [(his AI Self)]',
    subtitles: [
      { text: "(his AI Self)", startSec: 0, durationSec: 1.5, style: 'aiself' },
      { text: "Theo monitors our brand mentions in real time —", startSec: 1.5, durationSec: 2.5 },
      { text: "and helped Anthony evaluate partnership opportunities", startSec: 4, durationSec: 2 },
      { text: "around the clock for the launch.", startSec: 6, durationSec: 1 },
    ],
  },
  {
    id: 'starry-intro',
    label: 'STARRY — Real photo + title',
    durationSec: 3,
    note: '[Photo: Starry — Product Manager]',
    subtitles: [
      { text: "Starry, our product manager —", startSec: 0, durationSec: 2 },
      { text: "uses Momo.", startSec: 2, durationSec: 1 },
    ],
  },
  {
    id: 'momo-reveal',
    label: 'MOMO — Avatar reveal + ding SFX',
    durationSec: 6,
    note: '[Avatar: Momo] [SFX: ding] [(her AI Self)]',
    subtitles: [
      { text: "(her AI Self)", startSec: 0, durationSec: 1, style: 'aiself' },
      { text: "CUTE.", startSec: 1, durationSec: 0.8 },
      { text: "Momo handles Linear tasks across all departments —", startSec: 1.8, durationSec: 2.2 },
      { text: "and even goes on Zoom calls when Starry doesn't feel like it!", startSec: 4, durationSec: 2 },
    ],
  },
  {
    id: 'rus-intro',
    label: 'RUS — Real photo + title',
    durationSec: 3,
    note: '[Photo: Rus — Head of Design]',
    subtitles: [
      { text: "Rus, our head of design —", startSec: 0, durationSec: 2 },
      { text: "uses Russ.", startSec: 2, durationSec: 1 },
    ],
  },
  {
    id: 'russ-reveal',
    label: 'RUSS — Avatar reveal + ding SFX',
    durationSec: 4,
    note: '[Avatar: Russ] [SFX: ding] [(his AI Self)]',
    subtitles: [
      { text: "(his AI Self)", startSec: 0, durationSec: 1, style: 'aiself' },
      { text: "Russ goes over design issues", startSec: 1, durationSec: 1.5 },
      { text: "and communicates them to the design team.", startSec: 2.5, durationSec: 1.5 },
    ],
  },
  {
    id: 'matan-intro',
    label: 'MATAN — Real photo + title',
    durationSec: 3,
    note: '[Photo: Matan — Creative Director]',
    subtitles: [
      { text: "And this is Matan, our Creative Director.", startSec: 0, durationSec: 2.5 },
    ],
  },
  {
    id: 'raccoon-reveal',
    label: 'RACCOON 2.0 — Avatar reveal + ding SFX',
    durationSec: 5,
    note: '[Avatar: Raccoon 2.0] [SFX: ding] [(his AI Self)]',
    subtitles: [
      { text: "His Raccoon 2.0 —", startSec: 0, durationSec: 1.5 },
      { text: "(his AI Self)", startSec: 0, durationSec: 1.5, style: 'aiself' },
      { text: "helps Matan bridge the gap between", startSec: 1.5, durationSec: 1.5 },
      { text: "our researchers and our Creative team.", startSec: 3, durationSec: 2 },
    ],
  },
  {
    id: 'demi-intro',
    label: 'DEMI — Real photo + title',
    durationSec: 3,
    note: '[Photo: Demi Guo — CEO]',
    subtitles: [
      { text: "Oh, and all of them report up to our CEO, Demi Guo.", startSec: 0, durationSec: 3 },
    ],
  },
  {
    id: 'semi-reveal',
    label: 'SEMI — Avatar reveal + ding SFX',
    durationSec: 6,
    note: '[Avatar: Semi] [SFX: ding] [(her AI Self)]',
    subtitles: [
      { text: "Well… not exactly.", startSec: 0, durationSec: 1.5 },
      { text: "They report to Semi —", startSec: 1.5, durationSec: 1.5 },
      { text: "(her AI Self)", startSec: 1.5, durationSec: 1.5, style: 'aiself' },
      { text: "and Semi reports back to her.", startSec: 3, durationSec: 1.5 },
      { text: "Because Demi is waaaay too busy.", startSec: 4.5, durationSec: 1.5 },
    ],
  },
  {
    id: 'leti-intro',
    label: 'LETI — To camera (THE ENDING)',
    durationSec: 4,
    subtitles: [
      { text: "And me? I'm Leti, and I usually make videos, buuuut—", startSec: 0, durationSec: 3 },
      { text: "[MEOW]", startSec: 3, durationSec: 0.5 },
    ],
  },
  {
    id: 'mochi-reveal',
    label: 'MOCHI — Hard cut, smashing keyboard',
    durationSec: 4,
    note: '[Mochi at desk, 2 monitors, editing THIS video] [SFX: ding] [(my AI Self)]',
    subtitles: [
      { text: "(my AI Self)", startSec: 0, durationSec: 1.5, style: 'aiself' },
    ],
  },
  {
    id: 'leti-interrupted',
    label: 'LETI — Offscreen annoyed',
    durationSec: 3,
    subtitles: [
      { text: "Mochi— ffs, I'm in the middle of introducing yo—", startSec: 0, durationSec: 2.5 },
    ],
  },
  {
    id: 'mochi-glitch',
    label: 'MOCHI — Glitch cut, looking annoyed at camera',
    durationSec: 2,
    note: '[GLITCH transition]',
    subtitles: [],
  },
  {
    id: 'leti-comeback',
    label: 'LETI — Tries to recover',
    durationSec: 2,
    subtitles: [
      { text: "Anyways, I'm—", startSec: 0, durationSec: 1.5 },
    ],
  },
  {
    id: 'mochi-glitch-2',
    label: 'MOCHI — Glitch, looking at camera again',
    durationSec: 5,
    note: '[GLITCH transition]',
    subtitles: [
      { text: "What?? What do you need from me—", startSec: 0, durationSec: 2 },
      { text: "oh. Oh! You're done editing the video?", startSec: 2, durationSec: 1.5 },
      { text: "Ok ok lemme check it out.", startSec: 3.5, durationSec: 1.5 },
    ],
  },
  {
    id: 'loop-zoom',
    label: 'ZOOM INTO MOCHI SCREEN → LOOP',
    durationSec: 4,
    note: '[Camera zooms into monitor. Video restarts from beginning. ∞ LOOP]',
    subtitles: [
      { text: "\"You're not gonna believe this but—\"", startSec: 2, durationSec: 2 },
    ],
  },
];

// ── Calculate total frames ──────────────────────────────────────────────────
const FPS = 24;
const sectionFrames = SECTIONS.map((s) => Math.round(s.durationSec * FPS));
export const LETI_VIDEO_DURATION = sectionFrames.reduce((a, b) => a + b, 0);

// ── Subtitle component ─────────────────────────────────────────────────────
const Subtitle: React.FC<{
  line: SubtitleLine;
  sectionStartFrame: number;
}> = ({ line, sectionStartFrame }) => {
  const frame = useCurrentFrame();
  const startFrame = sectionStartFrame + Math.round(line.startSec * FPS);
  const endFrame = startFrame + Math.round(line.durationSec * FPS);

  if (frame < startFrame || frame >= endFrame) return null;

  const fadeIn = interpolate(frame, [startFrame, startFrame + 4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const isAiSelf = line.style === 'aiself';

  return (
    <div
      style={{
        position: 'absolute',
        bottom: isAiSelf ? 140 : 80,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: fadeIn,
      }}
    >
      <span
        style={{
          fontFamily: SUBTITLE_FONT,
          fontSize: isAiSelf ? 28 : 42,
          fontWeight: isAiSelf ? 400 : 500,
          color: isAiSelf ? DING_LABEL_COLOR : SUBTITLE_COLOR,
          fontStyle: isAiSelf ? 'italic' : 'normal',
          textShadow: '0 2px 8px rgba(0,0,0,0.8)',
          padding: '8px 24px',
          backgroundColor: 'rgba(0,0,0,0.5)',
          borderRadius: 8,
        }}
      >
        {line.text}
      </span>
    </div>
  );
};

// ── Section placeholder card ────────────────────────────────────────────────
const SectionCard: React.FC<{
  section: Section;
  sectionStartFrame: number;
}> = ({ section, sectionStartFrame }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG_COLOR }}>
      {/* Section label */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 40,
          fontFamily: 'SF Mono, monospace',
          fontSize: 16,
          color: '#444444',
          letterSpacing: 1,
        }}
      >
        {section.id.toUpperCase()}
      </div>

      {/* Placeholder text */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 16,
        }}
      >
        <div
          style={{
            fontFamily: SUBTITLE_FONT,
            fontSize: 32,
            color: LABEL_COLOR,
            textAlign: 'center',
            padding: '0 80px',
          }}
        >
          {section.label}
        </div>
        {section.note && (
          <div
            style={{
              fontFamily: 'SF Mono, monospace',
              fontSize: 18,
              color: '#555555',
              textAlign: 'center',
              padding: '0 120px',
              lineHeight: 1.6,
            }}
          >
            {section.note}
          </div>
        )}
      </div>

      {/* Subtitles */}
      {section.subtitles.map((line, i) => (
        <Subtitle key={i} line={line} sectionStartFrame={sectionStartFrame} />
      ))}
    </AbsoluteFill>
  );
};

// ── Main composition ────────────────────────────────────────────────────────
export const LetiAISelvesVideo: React.FC = () => {
  let currentFrame = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: BG_COLOR }}>
      {SECTIONS.map((section, i) => {
        const startFrame = currentFrame;
        const duration = sectionFrames[i];
        currentFrame += duration;

        return (
          <Sequence key={section.id} from={startFrame} durationInFrames={duration}>
            <SectionCard section={section} sectionStartFrame={startFrame} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
