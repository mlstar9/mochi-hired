import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from 'remotion';
import React from 'react';

// Pika brand colors
const COLORS = {
  purple: '#C2BEFF',
  black: '#111111',
  yellow: '#FEFBCF',
  beige: '#FDF7EF',
  white: '#FFFFFF',
};

// Smooth easing
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

// PFP size (matches bubble height roughly)
const PFP_SIZE = 56;

// Timing
const FPS = 24;
const TITLE_DURATION = 72; // 3s
const TYPING_DURATION = 36; // 1.5s
const MESSAGE_DURATION = 36; // 1.5s per message
const IMAGE_DURATION = 48; // 2s for the image
const END_CARD_DURATION = 48; // 2s

// Message data with duration: 0.6s buffer + chars/20 reading time
const MESSAGES = [
  { text: "good morning ☀️ slept terribly but made you coffee anyway", isUser: false, duration: 79 }, // 3.3s
  // Image goes here (handled separately)
  { text: "that's so sweet, thank you 🥹", isUser: true, duration: 48 }, // 2.0s
  { text: "how are you feeling? you seemed stressed yesterday", isUser: false, duration: 74 }, // 3.1s
  { text: "rough day at work honestly", isUser: true, duration: 46 }, // 1.9s
  { text: "ugh tell me everything. also i learned that breathing thing you showed me, it actually works??", isUser: false, duration: 96 }, // 4s (capped)
  { text: "btw i made you a playlist for your commute 🎵", isUser: false, duration: 67 }, // 2.8s
  { text: "wait really?? 🥹", isUser: true, duration: 32 }, // 1.35s
];

// Calculate total chat duration
const CHAT_DURATION = TYPING_DURATION + MESSAGES[0].duration + IMAGE_DURATION + 
  MESSAGES.slice(1).reduce((sum, m) => sum + m.duration, 0);

// Typing indicator component (transparent bg)
const TypingIndicatorContent: React.FC = () => {
  const frame = useCurrentFrame();
  
  const opacity = easeOut(Math.min(frame / 8, 1));
  
  const dotDelay = 4;
  const dotBounce = (dotIndex: number) => {
    const cycleFrame = (frame + dotIndex * dotDelay) % 24;
    return Math.sin((cycleFrame / 24) * Math.PI * 2) * 4;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, opacity }}>
      <Img
        src={staticFile('images/kirby-pfp.png')}
        style={{
          width: PFP_SIZE,
          height: PFP_SIZE,
          borderRadius: '50%',
          objectFit: 'cover',
        }}
      />
      <div
        style={{
          padding: '20px 28px',
          borderRadius: 28,
          backgroundColor: '#1a1a1a',
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#666',
              transform: `translateY(${dotBounce(i)}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Image content (transparent bg)
const ImageContent: React.FC<{ imageSrc: string }> = ({ imageSrc }) => {
  const frame = useCurrentFrame();
  
  const slideProgress = Math.min(frame / 8, 1);
  const eased = easeOut(slideProgress);
  
  const opacity = eased;
  const translateY = interpolate(eased, [0, 1], [20, 0]);
  const translateX = interpolate(eased, [0, 1], [-15, 0]);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, opacity, transform: `translate(${translateX}px, ${translateY}px)` }}>
      <Img
        src={staticFile('images/kirby-pfp.png')}
        style={{
          width: PFP_SIZE,
          height: PFP_SIZE,
          borderRadius: '50%',
          objectFit: 'cover',
        }}
      />
      <div
        style={{
          borderRadius: 20,
          overflow: 'hidden',
          maxWidth: 400,
        }}
      >
        <Img
          src={staticFile(imageSrc)}
          style={{
            width: '100%',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
};

// Message content (transparent bg)
const MessageContent: React.FC<{
  message: string;
  isUser: boolean;
}> = ({ message, isUser }) => {
  const frame = useCurrentFrame();
  
  const slideProgress = Math.min(frame / 8, 1);
  const eased = easeOut(slideProgress);
  
  const opacity = eased;
  const translateY = interpolate(eased, [0, 1], [20, 0]);
  const translateX = interpolate(eased, [0, 1], [isUser ? 15 : -15, 0]);
  
  const bubbleStyle: React.CSSProperties = {
    padding: '24px 32px',
    borderRadius: 28,
    backgroundColor: isUser ? COLORS.purple : '#1a1a1a',
    color: isUser ? COLORS.black : COLORS.white,
    fontSize: 32,
    lineHeight: 1.5,
    fontFamily: 'SF Pro Display, -apple-system, sans-serif',
    fontWeight: 400,
    maxWidth: 600,
    textAlign: 'left' as const,
  };

  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        gap: 16, 
        opacity, 
        transform: `translate(${translateX}px, ${translateY}px)`,
        flexDirection: isUser ? 'row-reverse' : 'row',
      }}
    >
      <Img
        src={staticFile(isUser ? 'images/user-pfp.png' : 'images/kirby-pfp.png')}
        style={{
          width: PFP_SIZE,
          height: PFP_SIZE,
          borderRadius: '50%',
          objectFit: 'cover',
        }}
      />
      <div style={bubbleStyle}>
        {message}
      </div>
    </div>
  );
};

// 3D Chat Layer - contains all chat content with Y rotation
const ChatLayer: React.FC<{ chatDuration: number }> = ({ chatDuration }) => {
  const frame = useCurrentFrame();
  
  // Y-axis rotation: 20deg -> -20deg over the chat duration
  const rotateY = interpolate(
    frame,
    [0, chatDuration],
    [20, -20],
    { extrapolateRight: 'clamp' }
  );
  
  // Calculate timing within chat layer
  let currentFrame = 0;
  
  const typingStart = currentFrame;
  currentFrame += TYPING_DURATION;
  
  const message0Start = currentFrame;
  currentFrame += MESSAGES[0].duration;
  
  const imageStart = currentFrame;
  currentFrame += IMAGE_DURATION;
  
  const remainingMessages = MESSAGES.slice(1);
  const messageStarts: number[] = [];
  remainingMessages.forEach((msg) => {
    messageStarts.push(currentFrame);
    currentFrame += msg.duration;
  });

  return (
    <AbsoluteFill
      style={{
        perspective: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `rotateY(${rotateY}deg) scale(1.2)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Typing indicator */}
        <Sequence from={typingStart} durationInFrames={TYPING_DURATION}>
          <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TypingIndicatorContent />
          </AbsoluteFill>
        </Sequence>
        
        {/* First message */}
        <Sequence from={message0Start} durationInFrames={MESSAGES[0].duration}>
          <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageContent message={MESSAGES[0].text} isUser={MESSAGES[0].isUser} />
          </AbsoluteFill>
        </Sequence>
        
        {/* Kirby coffee image */}
        <Sequence from={imageStart} durationInFrames={IMAGE_DURATION}>
          <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ImageContent imageSrc="images/kirby-coffee.png" />
          </AbsoluteFill>
        </Sequence>
        
        {/* Remaining messages */}
        {remainingMessages.map((msg, i) => (
          <Sequence 
            key={i}
            from={messageStarts[i]} 
            durationInFrames={msg.duration}
          >
            <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageContent message={msg.text} isUser={msg.isUser} />
            </AbsoluteFill>
          </Sequence>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Title card
const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  
  const fadeIn = Math.min(frame / 15, 1);
  const fadeOut = frame > 48 ? interpolate(frame, [48, 72], [1, 0]) : 1;
  const opacity = easeOut(fadeIn) * fadeOut;
  const scale = interpolate(easeOut(fadeIn), [0, 1], [0.95, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.black,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
      }}
    >
      <div style={{ transform: `scale(${scale})`, textAlign: 'center' }}>
        <div
          style={{
            fontSize: 18,
            color: COLORS.purple,
            fontFamily: 'SF Pro Display, sans-serif',
            fontWeight: 500,
            letterSpacing: 3,
            textTransform: 'uppercase',
            marginBottom: 16,
          }}
        >
          Introducing
        </div>
        <div
          style={{
            fontSize: 64,
            color: COLORS.white,
            fontFamily: 'SF Pro Display, sans-serif',
            fontWeight: 600,
            letterSpacing: -1,
          }}
        >
          Your AI Self
        </div>
      </div>
    </AbsoluteFill>
  );
};

// End card
const EndCard: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.black,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Img 
        src={staticFile('images/pika-logo.png')} 
        style={{ 
          width: '80%',
        }} 
      />
    </AbsoluteFill>
  );
};

// Main composition
export const PikaAISelfDemo: React.FC = () => {
  const chatStart = TITLE_DURATION;
  const endCardStart = chatStart + CHAT_DURATION;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black }}>
      {/* Title card */}
      <Sequence from={0} durationInFrames={TITLE_DURATION}>
        <TitleCard />
      </Sequence>
      
      {/* Chat section - two layers */}
      <Sequence from={chatStart} durationInFrames={CHAT_DURATION}>
        {/* Layer 1: Beige background */}
        <AbsoluteFill style={{ backgroundColor: COLORS.beige }} />
        
        {/* Layer 2: Chat content with 3D rotation */}
        <ChatLayer chatDuration={CHAT_DURATION} />
      </Sequence>
      
      {/* End card */}
      <Sequence from={endCardStart} durationInFrames={END_CARD_DURATION}>
        <EndCard />
      </Sequence>
    </AbsoluteFill>
  );
};
