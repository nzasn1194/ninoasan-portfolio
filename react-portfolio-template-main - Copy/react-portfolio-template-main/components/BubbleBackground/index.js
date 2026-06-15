import { useEffect, useRef, useState } from "react";

const makeBubble = (id) => ({
  id,
  left: Math.random() * 95 + 2.5,
  top: Math.random() * 95 + 2.5,
  // sizes from very small to large
  size: Math.random() * 112 + 8,
  duration: Math.random() * 16 + 8,
  delay: Math.random() * -12,
  opacity: Math.random() * 0.45 + 0.35,
  popped: false,
  key: `${id}-${Math.random().toString(36).slice(2, 8)}`,
});

const createPopSound = () => {
  if (typeof window === "undefined") return null;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  return new AudioContext();
};

const BubbleBackground = () => {
  const audioRef = useRef(null);
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    setBubbles(Array.from({ length: 18 }, (_, index) => makeBubble(index)));

    const loop = setInterval(() => {
      setBubbles((current) =>
        current.map((bubble) =>
          bubble.popped
            ? bubble
            : bubble.left > 0 && bubble.left < 100
            ? bubble
            : makeBubble(bubble.id)
        )
      );
    }, 12000);

    return () => clearInterval(loop);
  }, []);

  const playPop = () => {
    // Initialize audio context on first user interaction to avoid auto-play/permission issues
    if (!audioRef.current) {
      audioRef.current = createPopSound();
    }
    const ctx = audioRef.current;
    if (!ctx) return;
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(520, ctx.currentTime);
    gain.gain.setValueAtTime(0.16, ctx.currentTime);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.14);
    oscillator.stop(ctx.currentTime + 0.14);
  };

  const popBubble = (id) => {
    playPop();
    setBubbles((current) =>
      current.map((bubble) =>
        bubble.id !== id
          ? bubble
          : {
              ...bubble,
              popped: true,
            }
      )
    );

    setTimeout(() => {
      setBubbles((current) =>
        current.map((bubble) =>
          bubble.id !== id ? bubble : makeBubble(id)
        )
      );
    }, 300);
  };

  return (
    <div className="bubble-background">
      {bubbles.map((bubble) => (
        <div
          key={bubble.key}
          className={`bubble ${bubble.popped ? "bubble-popped" : ""}`}
          style={{
            left: `${bubble.left}%`,
            top: `${bubble.top}%`,
            width: bubble.size,
            height: bubble.size,
            opacity: bubble.opacity,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
          }}
          aria-label="Pop bubble"
        />
      ))}
    </div>
  );
};

export default BubbleBackground;
