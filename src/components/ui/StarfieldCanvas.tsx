"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  pz: number;
  color: string;
}

const NUM_STARS = 180;
const SPEED     = 1.8;
const COLORS    = ["255,255,255", "180,210,255", "210,190,255"];

function makeStar(w: number, h: number, z?: number): Star {
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const zVal  = z ?? Math.random() * w;
  return {
    x: (Math.random() - 0.5) * w * 2,
    y: (Math.random() - 0.5) * h * 2,
    z: zVal,
    pz: zVal,
    color,
  };
}

export default function StarfieldCanvas({ opacity = 0.55 }: { opacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    canvas.width  = w;
    canvas.height = h;

    let stars: Star[] = Array.from({ length: NUM_STARS }, () => makeStar(w, h));
    let raf: number;

    const draw = () => {
      // Soft trail — low alpha fill keeps streaks but fades old ones
      ctx.fillStyle = "rgba(10,10,10,0.18)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      for (const s of stars) {
        s.pz = s.z;
        s.z -= SPEED;

        if (s.z <= 1) {
          Object.assign(s, makeStar(w, h, w));
          continue;
        }

        const sx = (s.x / s.z) * w + cx;
        const sy = (s.y / s.z) * h + cy;
        const px = (s.x / s.pz) * w + cx;
        const py = (s.y / s.pz) * h + cy;

        // Skip stars that went off screen
        if (sx < 0 || sx > w || sy < 0 || sy > h) {
          Object.assign(s, makeStar(w, h, w));
          continue;
        }

        const progress = 1 - s.z / w;             // 0 (far) → 1 (close)
        const alpha    = Math.min(1, progress * 1.4);
        const size     = Math.max(0.3, progress * 2.2);

        ctx.strokeStyle = `rgba(${s.color},${alpha * 0.85})`;
        ctx.lineWidth   = size;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width  = w;
      canvas.height = h;
      stars = Array.from({ length: NUM_STARS }, () => makeStar(w, h));
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity }}
    />
  );
}
