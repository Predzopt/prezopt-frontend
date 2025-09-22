'use client';

import { useEffect, useRef } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // --- Config ---
    const config = {
      count: 100,
      particleSize: [0.6, 2.6],
      speed: [0.02, 0.6],
      linkDistance: 140,
      accent: '#9c6bff',
      tertiary: '#c4b1ff',
      bg: '#000000',
      particleAlpha: [0.08, 0.9],
      tail: 0.2,
    };

    const canvas = canvasRef.current;
    const ctx: any = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let DPR = Math.max(1, window.devicePixelRatio || 1);
    let W: number, H: number;

    function resize() {
      DPR = Math.max(1, window.devicePixelRatio || 1);
      W = Math.floor(window.innerWidth);
      H = Math.floor(window.innerHeight);
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx?.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const dist2 = (a: any, b: any) => {
      const dx = a.x - b.x,
        dy = a.y - b.y;
      return dx * dx + dy * dy;
    };

    class Particle {
      x: number | undefined;
      y: number | undefined;
      r: number | undefined;
      vx: number | undefined;
      vy: number | undefined;
      alpha: number | undefined;
      ox: number | undefined;
      oy: number | undefined;
      os: number | undefined;
      phase: number | undefined;

      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.r = rand(config.particleSize[0], config.particleSize[1]);
        const speed = rand(config.speed[0], config.speed[1]);
        const angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed * 0.6;
        this.alpha = rand(config.particleAlpha[0], config.particleAlpha[1]);
        this.ox = this.x;
        this.oy = this.y;
        this.os = rand(8000, 26000);
        this.phase = Math.random() * Math.PI * 2;

        if (!initial && Math.random() < 0.05) {
          const edge = Math.floor(Math.random() * 4);
          if (edge === 0) {
            this.x = -10;
            this.y = Math.random() * H;
          }
          if (edge === 1) {
            this.x = W + 10;
            this.y = Math.random() * H;
          }
          if (edge === 2) {
            this.x = Math.random() * W;
            this.y = -10;
          }
          if (edge === 3) {
            this.x = Math.random() * W;
            this.y = H + 10;
          }
        }
      }

      step(dt: number) {
        (this as any).phase += dt / (this as any).os;
        (this as any).x += (this as any).vx + Math.cos((this as any).phase) * 0.02;
        (this as any).y += (this as any).vy + Math.sin((this as any).phase) * 0.02;

        if (
          (this as any).x < -40 ||
          (this as any).x > W + 40 ||
          (this as any).y < -40 ||
          (this as any).y > H + 40
        ) {
          this.reset(false);
        }
      }

      draw(ctx: CanvasRenderingContext2D | any) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = ctx.strokeStyle = Math.random() > 0.6 ? config.accent : config.tertiary;
        ctx.globalAlpha = this.alpha;
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = Math.min(32, (this.r as any) * 12);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    let particles: Particle[] = [];
    function initParticles() {
      particles = [];
      for (let i = 0; i < config.count; i++) particles.push(new Particle());
    }

    resize();
    initParticles();

    let last = performance.now();
    function frame(now: number) {
      const dt = Math.min(60, now - last);
      last = now;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = `rgba(0,0,0,${config.tail})`;
      ctx.fillRect(0, 0, W, H);

      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, 'rgba(0,0,0,0.0)');
      g.addColorStop(1, 'rgba(0,0,0,0.15)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      for (const p of particles) {
        p.step(dt);
        p.draw(ctx);
      }

      ctx.save();
      ctx.lineWidth = 0.9;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i],
            b = particles[j];
          const d2 = dist2(a, b);
          const max = config.linkDistance;
          if (d2 < max * max) {
            const d = Math.sqrt(d2);
            const alpha = (1 - d / max) * 0.12;
            const useAccent = d < max * 0.35;
            ctx.strokeStyle = useAccent ? config.accent : config.tertiary;
            ctx.globalAlpha = alpha;
            const pulse = (Math.sin((now + i * 7) / 800) + 1) * 0.5;
            ctx.globalAlpha *= 0.6 + 0.4 * pulse;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      if (Math.random() < 0.006) {
        const x = Math.random() * W,
          y = Math.random() * H;
        const r = rand(8, 26);
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.shadowColor = config.accent;
        ctx.shadowBlur = 60;
        ctx.fillStyle = config.accent;
        ctx.globalAlpha = 0.06 + Math.random() * 0.12;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    let resizeTimer: NodeJS.Timeout | null = null;
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        initParticles();
      }, 120);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} id="canvas" style={{ position: 'fixed', inset: 0, zIndex: -1 }} />;
};

export default ParticleBackground;
