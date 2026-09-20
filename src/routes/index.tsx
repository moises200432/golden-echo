import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import bouquetImage from "@/assets/sunflower-bouquet.png";
import imageCopy1 from "@/assets/image.png";
import imageCopy2 from "@/assets/image copy.png";
import imageCopy3 from "@/assets/image copy 2.png";
import imageCopy4 from "@/assets/image copy 3.png";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const YOUTUBE_VIDEO_ID = "9-nICrDDtn0";

/**
 * Video propio que se reproduce dentro de la página (con sonido).
 * Coloca tu archivo en la carpeta /public con el nombre "video.mp4"
 * (formato MP4 con H.264 y audio AAC). Si el archivo no existe o no carga,
 * la página vuelve a intentar con YouTube automáticamente.
 */
const LOCAL_VIDEO_SRC: string | null = "/video.mp4";

const galleryImages = [
  { id: 1, src: imageCopy1, alt: "Galería 1" },
  { id: 2, src: imageCopy2, alt: "Galería 2" },
  { id: 3, src: imageCopy3, alt: "Galería 3" },
  { id: 4, src: imageCopy4, alt: "Galería 4" },
  { id: 5, src: bouquetImage, alt: "Ramo de girasoles" },
];

// Frases típicas del Día de las Flores Amarillas que se van alternando en el título
const titlePhrases = [
  "Feliz Día de las Flores Amarillas",
  "Girasoles para ti",
  "Con todo mi cariño",
  "Que florezca tu día",
  "Gracias por existir",
  "Amarillo de primavera",
  "Siempre en mi corazón",
  "Hoy es tu día",
  "Eres mi girasol",
  "Flores amarillas para ti",
  "Que tu día brille como el sol",
  "Contigo todo florece",
  "Te regalo mis girasoles",
  "Eres luz en mi camino",
  "Feliz primavera, mi vida",
  "Amarillo, color de alegría",
  "Un ramo de cariño para ti",
  "Que nunca te falte el sol",
  "Eres lo más bonito del jardín",
  "Con amor, para ti",
  "Sonríe, que hoy florecemos",
  "Tú eres mi primavera",
  "Mil girasoles para ti",
  "Eres alegría y color",
  "Que la vida te sonría",
  "Florece, mi amor",
  "Dorado como tus sueños",
  "Hoy el jardín es tuyo",
  "Gracias por llenar de luz mi vida",
  "Siempre girando hacia ti",
];

const PHRASE_VISIBLE_MS = 3200;
const PHRASE_EXIT_MS = 700;

type FlowerStyle = CSSProperties & Record<`--${string}`, string>;

// Girasol dibujado en SVG (se define una vez y se reutiliza con <use>)
function SunflowerDefs() {
  const outer = Array.from({ length: 14 }, (_, i) => i * (360 / 14));
  const inner = Array.from({ length: 14 }, (_, i) => i * (360 / 14) + 360 / 28);
  const seeds = [
    [50, 50], [44, 46], [56, 46], [44, 54], [56, 54], [50, 42], [50, 58],
    [38, 50], [62, 50], [42, 40], [58, 40], [42, 60], [58, 60],
  ];
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="sf-center" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#7a4a1a" />
          <stop offset="100%" stopColor="#2e1a08" />
        </radialGradient>
        <symbol id="sunflower" viewBox="0 0 100 100">
          <g fill="#F2A900">
            {outer.map((a) => (
              <ellipse key={`o${a}`} cx="50" cy="17" rx="7.5" ry="17" transform={`rotate(${a} 50 50)`} />
            ))}
          </g>
          <g fill="currentColor">
            {inner.map((a) => (
              <ellipse key={`i${a}`} cx="50" cy="20" rx="7" ry="15" transform={`rotate(${a} 50 50)`} />
            ))}
          </g>
          <circle cx="50" cy="50" r="17" fill="url(#sf-center)" />
          <g fill="#c98a3a" opacity="0.85">
            {seeds.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="1.6" />
            ))}
          </g>
        </symbol>
      </defs>
    </svg>
  );
}

function RotatingTitle() {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      const id = window.setInterval(() => setIndex((i) => (i + 1) % titlePhrases.length), 4000);
      return () => window.clearInterval(id);
    }

    let exitTimer: number;
    const showTimer = window.setTimeout(() => setLeaving(true), PHRASE_VISIBLE_MS);
    exitTimer = window.setTimeout(() => {
      setIndex((i) => (i + 1) % titlePhrases.length);
      setLeaving(false);
    }, PHRASE_VISIBLE_MS + PHRASE_EXIT_MS);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(exitTimer);
    };
  }, [index]);

  const phrase = titlePhrases[index] ?? titlePhrases[0] ?? "";
  const words = phrase.split(" ");

  return (
    <h1 className="rt-title title-glow font-display italic" aria-live="polite" aria-label={phrase}>
      <span className="rt-phrase" key={index} aria-hidden="true">
        {words.map((word, i) => (
          <span
            key={`${index}-${i}`}
            className={`rt-word ${leaving ? "rt-word-out" : "rt-word-in"}`}
            style={{ animationDelay: `${i * (leaving ? 60 : 130)}ms` }}
          >
            {word}
          </span>
        ))}
      </span>
    </h1>
  );
}

/* ---------- Ramo dorado animado (sección sobre la galería) ---------- */
type Pt = { x: number; y: number };

const quad = (p0: Pt, c: Pt, p1: Pt, t: number) => {
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * c.x + t * t * p1.x,
    y: u * u * p0.y + 2 * u * t * c.y + t * t * p1.y,
    angle:
      (Math.atan2(
        2 * u * (c.y - p0.y) + 2 * t * (p1.y - c.y),
        2 * u * (c.x - p0.x) + 2 * t * (p1.x - c.x),
      ) *
        180) /
      Math.PI,
  };
};

const BQ_BASE: Pt = { x: 200, y: 452 };

// Se dibujan en este orden (los últimos quedan al frente)
const BQ_FLOWERS = [
  { id: "f6", x: 200, y: 60, s: 74, c: { x: 218, y: 260 }, leaves: 1, sway: 7.5, delay: 1.4 },
  { id: "f7", x: 355, y: 195, s: 68, c: { x: 280, y: 350 }, leaves: 2, sway: 6.2, delay: 1.1 },
  { id: "f8", x: 45, y: 225, s: 68, c: { x: 120, y: 360 }, leaves: 2, sway: 6.8, delay: 1.2 },
  { id: "f2", x: 285, y: 125, s: 112, c: { x: 235, y: 320 }, leaves: 3, sway: 5.6, delay: 0.7 },
  { id: "f1", x: 115, y: 150, s: 106, c: { x: 170, y: 330 }, leaves: 3, sway: 6.0, delay: 0.4 },
  { id: "f5", x: 310, y: 300, s: 106, c: { x: 250, y: 395 }, leaves: 2, sway: 5.2, delay: 0.9 },
  { id: "f4", x: 90, y: 315, s: 102, c: { x: 150, y: 400 }, leaves: 2, sway: 5.8, delay: 0.6 },
  { id: "f3", x: 200, y: 235, s: 114, c: { x: 190, y: 350 }, leaves: 3, sway: 4.8, delay: 0.1 },
];

const BQ_STEMS = BQ_FLOWERS.map((f) => {
  const p1: Pt = { x: f.x, y: f.y };
  const leaves = [0.3, 0.5, 0.7].slice(0, f.leaves).map((t, i) => {
    const q = quad(BQ_BASE, f.c, p1, t);
    const side = i % 2 === 0 ? 1 : -1;
    return {
      key: `${f.id}-l${i}`,
      x: q.x,
      y: q.y,
      rot: q.angle + side * 52,
      k: 0.9 + ((i * 7 + f.s) % 4) * 0.12,
    };
  });
  return { ...f, d: `M${BQ_BASE.x} ${BQ_BASE.y} Q${f.c.x} ${f.c.y} ${f.x} ${f.y}`, leaves };
});

// Hojas grandes en la base del ramo
const BQ_BASE_LEAVES = [
  { a: -168, k: 1.7 },
  { a: -140, k: 1.5 },
  { a: -118, k: 1.35 },
  { a: -62, k: 1.35 },
  { a: -40, k: 1.5 },
  { a: -12, k: 1.7 },
];

// Helechos a los lados
const BQ_FERNS = [
  { id: "fl", p0: { x: 192, y: 455 }, c: { x: 90, y: 445 }, p1: { x: 22, y: 365 } },
  { id: "fr", p0: { x: 208, y: 455 }, c: { x: 310, y: 445 }, p1: { x: 378, y: 365 } },
].map((fern) => ({
  ...fern,
  d: `M${fern.p0.x} ${fern.p0.y} Q${fern.c.x} ${fern.c.y} ${fern.p1.x} ${fern.p1.y}`,
  leaflets: Array.from({ length: 9 }, (_, i) => {
    const t = 0.18 + i * 0.09;
    const q = quad(fern.p0, fern.c, fern.p1, t);
    return {
      key: `${fern.id}-${i}`,
      x: q.x,
      y: q.y,
      rx: 15 * (1 - t * 0.55),
      a1: q.angle + 62,
      a2: q.angle - 62,
    };
  }),
}));

const BQ_SPARKLES = Array.from({ length: 46 }, (_, i) => ({
  id: i,
  x: (i * 73.3 + 17) % 400,
  y: (i * 131.7 + 9) % 460,
  r: 0.9 + (i % 4) * 0.45,
  delay: (i * 0.37) % 4,
  dur: 2 + (i % 5) * 0.6,
  star: i % 6 === 0,
}));

const BQ_RISING = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: 30 + ((i * 47.3) % 340),
  dx: -50 + ((i * 29) % 101),
  rot: 120 + ((i * 53) % 240),
  delay: -((i * 1.7) % 12),
  dur: 8 + ((i * 3) % 6),
  s: 0.8 + (i % 3) * 0.35,
}));

const BQ_OUTER = Array.from({ length: 16 }, (_, i) => i * 22.5);
const BQ_INNER = Array.from({ length: 16 }, (_, i) => i * 22.5 + 11.25);
const BQ_SPOKES = Array.from({ length: 22 }, (_, i) => i * (360 / 22));

function GoldenBouquet() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`bq relative z-20 mb-14 flex w-full flex-col items-center ${inView ? "bq-in" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');

        .bq * { animation-play-state: paused; }
        .bq.bq-in * { animation-play-state: running; }

        .bq-neon {
          font-family: "Great Vibes", "Brush Script MT", "Segoe Script", cursive;
          font-size: clamp(3rem, 12vw, 4.6rem);
          line-height: 1.05;
          text-align: center;
          color: #ffe680;
          text-shadow: 0 0 4px #fff3b0, 0 0 12px #ffd21f, 0 0 26px #ffb800, 0 0 48px #ff9d00;
          animation: bqFlicker 5s linear infinite;
        }
        .bq-pill {
          display: inline-flex; align-items: center; gap: 0.6rem;
          margin-top: 0.9rem; padding: 0.55rem 1.3rem;
          border-radius: 999px;
          border: 1px solid rgba(255, 210, 31, 0.55);
          background: linear-gradient(90deg, rgba(255,184,0,0.18), rgba(0,0,0,0.35));
          box-shadow: 0 0 18px rgba(255, 190, 0, 0.35), inset 0 0 14px rgba(255, 190, 0, 0.12);
          color: #ffe680; font-size: 0.9rem; letter-spacing: 0.04em;
        }
        .bq-dot {
          width: 0.6rem; height: 0.6rem; border-radius: 50%;
          background: #ffc400; box-shadow: 0 0 10px #ffc400;
          animation: bqBeat 1.6s ease-in-out infinite;
        }
        .bq-svg { width: min(100%, 460px); height: auto; display: block; overflow: visible; margin-top: 0.5rem; }
        .bq-sign {
          font-family: "Great Vibes", "Brush Script MT", cursive;
          font-size: 1.5rem; color: #ffe680; opacity: 0.9;
          text-shadow: 0 0 10px rgba(255, 200, 0, 0.7);
        }

        .bq-glow { transform-box: fill-box; transform-origin: center; animation: bqPulse 4s ease-in-out infinite alternate; }
        .bq-sway { transform-origin: 200px 452px; animation: bqSway 5s ease-in-out infinite alternate; }
        .bq-stem { stroke-dasharray: 1; stroke-dashoffset: 1; animation: bqGrow 1.6s ease-out forwards; }
        .bq-leaf { transform-box: fill-box; transform-origin: 0% 50%; animation: bqLeaf 0.9s ease-out both; }
        .bq-bloom { transform-box: fill-box; transform-origin: center; animation: bqBloom 1.5s cubic-bezier(.2,1.3,.4,1) both; }
        .bq-spin { transform-box: fill-box; transform-origin: center; animation: bqSpin 40s linear infinite; }
        .bq-tw { transform-box: fill-box; transform-origin: center; animation: bqTwinkle var(--dur) ease-in-out var(--delay) infinite; }
        .bq-rise { transform-box: fill-box; transform-origin: center; animation: bqRise var(--dur) linear var(--delay) infinite; }

        @keyframes bqFlicker {
          0%, 18%, 22%, 62%, 64%, 100% { opacity: 1; }
          20%, 63% { opacity: 0.82; }
        }
        @keyframes bqBeat { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.6; } }
        @keyframes bqPulse { from { opacity: 0.55; transform: scale(0.92); } to { opacity: 1; transform: scale(1.06); } }
        @keyframes bqSway  { from { transform: rotate(-1.8deg); } to { transform: rotate(1.8deg); } }
        @keyframes bqGrow  { to { stroke-dashoffset: 0; } }
        @keyframes bqLeaf  { from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); } }
        @keyframes bqBloom { from { opacity: 0; transform: scale(0.1) rotate(-120deg); } to { opacity: 1; transform: scale(1) rotate(0deg); } }
        @keyframes bqSpin  { to { transform: rotate(360deg); } }
        @keyframes bqTwinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.6); }
          50%      { opacity: 1; transform: scale(1.3); }
        }
        @keyframes bqRise {
          0%   { opacity: 0; transform: translate(0, 0) rotate(0deg); }
          10%  { opacity: 0.95; }
          85%  { opacity: 0.8; }
          100% { opacity: 0; transform: translate(var(--dx), -430px) rotate(var(--rot)); }
        }

        @media (prefers-reduced-motion: reduce) {
          .bq *, .bq-neon { animation: none !important; }
          .bq-stem { stroke-dashoffset: 0; }
          .bq-rise { display: none; }
        }
      `}</style>

      <h2 className="bq-neon">Hoy es tu día</h2>
      <div className="bq-pill">
        <span className="bq-dot" />
        Con amor, para ti 💛
      </div>

      <svg className="bq-svg" viewBox="0 0 400 480" role="img" aria-label="Ramo de girasoles animado">
        <defs>
          <radialGradient id="bq-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffc400" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#ff9d00" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#ff9d00" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="bq-po" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#FFD21F" />
          </linearGradient>
          <linearGradient id="bq-pi" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#FFC107" />
            <stop offset="100%" stopColor="#FFF08A" />
          </linearGradient>
          <linearGradient id="bq-leafg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1f6b2c" />
            <stop offset="100%" stopColor="#57b45a" />
          </linearGradient>
          <symbol id="bq-sun" viewBox="0 0 100 100">
            <g fill="url(#bq-po)">
              {BQ_OUTER.map((a) => (
                <ellipse key={`o${a}`} cx="50" cy="18" rx="9.5" ry="16" transform={`rotate(${a} 50 50)`} />
              ))}
            </g>
            <g fill="url(#bq-pi)" stroke="rgba(255,150,0,0.35)" strokeWidth="0.6">
              {BQ_INNER.map((a) => (
                <ellipse key={`i${a}`} cx="50" cy="23" rx="8.5" ry="13" transform={`rotate(${a} 50 50)`} />
              ))}
            </g>
            <circle cx="50" cy="50" r="19" fill="#6b3d14" />
            <g stroke="#2a1608" strokeWidth="2.2" strokeLinecap="round">
              {BQ_SPOKES.map((a) => (
                <line key={`s${a}`} x1="50" y1="50" x2="50" y2="32" transform={`rotate(${a} 50 50)`} />
              ))}
            </g>
            <circle cx="50" cy="50" r="19" fill="none" stroke="#2a1608" strokeWidth="1.6" />
            <circle cx="50" cy="50" r="4" fill="#ffb84d" opacity="0.7" />
          </symbol>
        </defs>

        {/* Resplandor dorado */}
        <circle className="bq-glow" cx="200" cy="230" r="225" fill="url(#bq-glow)" />

        {/* Destellos */}
        {BQ_SPARKLES.map((sp) => {
          const st: FlowerStyle = { "--dur": `${sp.dur}s`, "--delay": `${sp.delay}s` };
          return sp.star ? (
            <g key={sp.id} transform={`translate(${sp.x} ${sp.y}) scale(${sp.r * 0.9})`}>
              <path
                className="bq-tw"
                style={st}
                d="M0 -6 L1.5 -1.5 L6 0 L1.5 1.5 L0 6 L-1.5 1.5 L-6 0 L-1.5 -1.5Z"
                fill="#fff3b0"
              />
            </g>
          ) : (
            <circle key={sp.id} className="bq-tw" style={st} cx={sp.x} cy={sp.y} r={sp.r} fill="#ffe98a" />
          );
        })}

        {/* Helechos */}
        {BQ_FERNS.map((fern) => (
          <g key={fern.id}>
            <path d={fern.d} fill="none" stroke="#1d5a26" strokeWidth="3" strokeLinecap="round" />
            {fern.leaflets.map((l) => (
              <g key={l.key}>
                <ellipse cx={l.rx} cy="0" rx={l.rx} ry="4.6" fill="#2e8b3d" transform={`translate(${l.x} ${l.y}) rotate(${l.a1})`} />
                <ellipse cx={l.rx} cy="0" rx={l.rx} ry="4.6" fill="#256f31" transform={`translate(${l.x} ${l.y}) rotate(${l.a2})`} />
              </g>
            ))}
          </g>
        ))}

        {/* Flores con tallo y hojas */}
        {BQ_STEMS.map((f, i) => (
          <g key={f.id} className="bq-sway" style={{ animationDuration: `${f.sway}s`, animationDelay: `${-i * 0.7}s` }}>
            <path
              className="bq-stem"
              d={f.d}
              pathLength={1}
              fill="none"
              stroke="#2f8a3b"
              strokeWidth="5"
              strokeLinecap="round"
              style={{ animationDelay: `${f.delay - 0.2}s` }}
            />
            {f.leaves.map((l) => (
              <g key={l.key} transform={`translate(${l.x} ${l.y}) rotate(${l.rot}) scale(${l.k})`}>
                <g className="bq-leaf" style={{ animationDelay: `${f.delay + 0.9}s` }}>
                  <path d="M0 0 C14 -11 34 -11 48 0 C34 11 14 11 0 0Z" fill="url(#bq-leafg)" />
                  <path d="M2 0 L44 0" stroke="#a8e0a0" strokeWidth="0.9" opacity="0.7" />
                </g>
              </g>
            ))}
            <g transform={`translate(${f.x} ${f.y})`}>
              <g className="bq-bloom" style={{ animationDelay: `${f.delay + 0.5}s` }}>
                <g
                  className="bq-spin"
                  style={{ animationDuration: `${38 + i * 6}s`, animationDirection: i % 2 ? "reverse" : "normal" }}
                >
                  <use href="#bq-sun" x={-f.s / 2} y={-f.s / 2} width={f.s} height={f.s} />
                </g>
              </g>
            </g>
          </g>
        ))}

        {/* Hojas grandes en la base */}
        {BQ_BASE_LEAVES.map((l, i) => (
          <g key={l.a} transform={`translate(200 450) rotate(${l.a}) scale(${l.k})`}>
            <g className="bq-leaf" style={{ animationDelay: `${1.2 + i * 0.12}s` }}>
              <path d="M0 0 C14 -11 34 -11 48 0 C34 11 14 11 0 0Z" fill="url(#bq-leafg)" />
              <path d="M2 0 L44 0" stroke="#a8e0a0" strokeWidth="0.9" opacity="0.7" />
            </g>
          </g>
        ))}

        {/* Pétalos dorados que suben */}
        {BQ_RISING.map((p) => {
          const st: FlowerStyle = {
            "--dx": `${p.dx}px`,
            "--rot": `${p.rot}deg`,
            "--dur": `${p.dur}s`,
            "--delay": `${p.delay}s`,
          };
          return <ellipse key={p.id} className="bq-rise" style={st} cx={p.x} cy="440" rx={4 * p.s} ry={6 * p.s} fill="#FFD21F" />;
        })}
      </svg>

      <p className="bq-sign">✦ Hecho con amor ✦</p>
    </div>
  );
}

function Index() {
  const playerRef = useRef<any>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [videoBlocked, setVideoBlocked] = useState(false);
  const [localFailed, setLocalFailed] = useState(false);
  const useLocal = Boolean(LOCAL_VIDEO_SRC) && !localFailed;
  const [lightbox, setLightbox] = useState<number | null>(null);

  // Flores más grandes y menos numerosas para que se vean bien
  const flowers = useMemo(() => Array.from({ length: 18 }, (_, index) => {
    const colors = ["#FFD21F", "#FFC700", "#FFE14D", "#FFEA70"];
    const style: FlowerStyle = {
      "--left": `${(index * 37.7 + (index % 7) * 4.3) % 100}%`,
      "--size": `${60 + (index * 17) % 71}px`,
      "--duration": `${10 + (index * 13) % 12}s`,
      "--delay": `${-((index * 1.83) % 20)}s`,
      "--wind": `${-80 + (index * 29) % 161}px`,
      "--flower-color": colors[index % colors.length] ?? "#FFD700",
    };
    return { id: index, style };
  }), []);

  // Cargar API de YouTube
  useEffect(() => {
    if (useLocal) return;

    if (window.YT && window.YT.Player) {
      setPlayerReady(true);
      return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      setPlayerReady(true);
    };

    return () => {
      delete window.onYouTubeIframeAPIReady;
    };
  }, [useLocal]);

  // Crear reproductor de YouTube
  useEffect(() => {
    if (useLocal || !playerReady || !window.YT || playerRef.current) return;

    playerRef.current = new window.YT.Player("youtube-player", {
      height: "100%",
      width: "100%",
      videoId: YOUTUBE_VIDEO_ID,
      playerVars: {
        autoplay: 0,
        controls: 1,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
      },
      events: {
        // 101 y 150: el dueño del video bloqueó la reproducción fuera de YouTube
        onError: (event: { data: number }) => {
          if (event.data === 101 || event.data === 150 || event.data === 153) {
            setVideoBlocked(true);
          }
        },
      },
    });
  }, [playerReady, useLocal]);

  // Cerrar la imagen ampliada con Escape
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const watchUrl = `https://www.youtube.com/watch?v=${YOUTUBE_VIDEO_ID}`;
  const activeImage = lightbox !== null ? galleryImages[lightbox] : undefined;

  return (
    <main className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-background p-0 sm:px-6 sm:py-8">
      <style>{`
        .rt-title {
          min-height: 2.2em;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: clamp(2rem, 7vw, 3.4rem);
          line-height: 1.05;
          letter-spacing: 0.01em;
          text-align: center;
        }
        .rt-phrase {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0 0.3em;
        }
        .rt-word {
          display: inline-block;
          opacity: 0;
          will-change: transform, opacity, filter;
        }
        .rt-word-in  { animation: rtWordIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .rt-word-out { animation: rtWordOut 0.7s cubic-bezier(0.6, 0, 0.8, 0.4) forwards; }

        @keyframes rtWordIn {
          0%   { opacity: 0; transform: translateY(0.6em) rotate(-4deg) scale(0.9); filter: blur(8px); }
          100% { opacity: 1; transform: translateY(0) rotate(0) scale(1); filter: blur(0); }
        }
        @keyframes rtWordOut {
          0%   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
          100% { opacity: 0; transform: translateY(-0.6em) rotate(3deg) scale(1.05); filter: blur(8px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .rt-word { animation: none !important; opacity: 1; }
        }

        .sf {
          display: block;
          position: absolute;
          top: 0;
          left: var(--left);
          width: var(--size);
          height: var(--size);
          margin-left: calc(var(--size) / -2);
          opacity: 0.92;
          filter: drop-shadow(0 4px 10px rgba(255, 200, 0, 0.35));
          animation: sfFall var(--duration) linear var(--delay) infinite;
          will-change: transform;
        }
        .sf-spin {
          display: block;
          width: 100%;
          height: 100%;
          color: var(--flower-color);
          animation: sfSpin calc(var(--duration) * 0.6) linear infinite, sfBloom 3.2s ease-in-out infinite;
          transform-origin: 50% 50%;
        }
        .sf-rev .sf-spin { animation-direction: reverse, normal; }
        .sf-spin svg { width: 100%; height: 100%; display: block; overflow: visible; }

        @keyframes sfFall {
          0%   { transform: translate3d(0, -220px, 0); }
          25%  { transform: translate3d(calc(var(--wind) * 0.7), calc(25vh - 100px), 0); }
          50%  { transform: translate3d(calc(var(--wind) * -0.5), calc(55vh - 60px), 0); }
          75%  { transform: translate3d(calc(var(--wind) * 0.6), calc(85vh - 20px), 0); }
          100% { transform: translate3d(var(--wind), calc(100vh + 220px), 0); }
        }
        @keyframes sfSpin  { to { transform: rotate(360deg); } }
        @keyframes sfBloom {
          0%, 100% { scale: 1; }
          50%      { scale: 1.12; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sf { display: none; }
        }

        .video-frame { position: relative; width: 100%; aspect-ratio: 16 / 9; background: #000; }
        .video-frame iframe, .video-frame video { position: absolute; inset: 0; width: 100%; height: 100%; }
      `}</style>

      <SunflowerDefs />
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {flowers.map((flower) => (
          <span key={flower.id} className={`sf select-none ${flower.id % 2 ? "sf-rev" : ""}`} style={flower.style}>
            <span className="sf-spin">
              <svg viewBox="0 0 100 100">
                <use href="#sunflower" />
              </svg>
            </span>
          </span>
        ))}
      </div>

      <section className="night-postcard relative z-10 flex min-h-[100svh] w-full max-w-3xl flex-col items-center overflow-hidden px-5 pb-8 pt-10 sm:min-h-auto sm:rounded-[2rem] sm:border sm:border-primary/20 sm:px-8 sm:py-12" aria-label="Reproductor de Por Si Mañana No Estoy">
        <header className="relative z-20 mb-8 w-full text-center">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary/80">Omar Courts presenta</p>
          <RotatingTitle />
          <p className="mt-3 text-sm text-muted-foreground">Por Si Mañana No Estoy · Todas las canciones, una sola noche</p>
        </header>

        {/* Video principal */}
        <div className="relative z-20 mb-12 w-full overflow-hidden rounded-2xl shadow-2xl">
          {useLocal ? (
            <div className="video-frame">
              <video
                src={LOCAL_VIDEO_SRC ?? undefined}
                controls
                playsInline
                preload="metadata"
                onError={() => setLocalFailed(true)}
              />
            </div>
          ) : videoBlocked ? (
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block w-full overflow-hidden"
              aria-label="Ver el video en YouTube"
            >
              <div className="video-frame">
                <img
                  src={`https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/hqdefault.jpg`}
                  alt="Portada del video"
                  className="absolute inset-0 h-full w-full object-cover opacity-70 transition-opacity duration-300 group-hover:opacity-90"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40 px-6 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl text-primary-foreground shadow-xl">▶</span>
                  <span className="text-base font-semibold text-white">Ver el video en YouTube</span>
                  <span className="max-w-sm text-xs text-white/80">El dueño de los derechos no permite verlo dentro de otras páginas.</span>
                </div>
              </div>
            </a>
          ) : (
            <div className="video-frame">
              <div id="youtube-player" />
            </div>
          )}
        </div>

        {/* Ramo dorado animado */}
        <GoldenBouquet />

        {/* Galería: cuadros grandes */}
        <div className="relative z-20 w-full">
          <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">Galería</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {galleryImages.map((image, i) => (
              <button
                type="button"
                key={image.id}
                onClick={() => setLightbox(i)}
                className={`group relative aspect-square overflow-hidden rounded-xl border border-primary/30 bg-white/5 shadow-lg transition-shadow duration-300 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                  i === galleryImages.length - 1 ? "sm:col-span-2 sm:mx-auto sm:w-1/2" : ""
                }`}
                aria-label={`Ampliar ${image.alt}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Imagen ampliada */}
      {activeImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setLightbox(null)}
        >
          <img
            src={activeImage.src}
            alt={activeImage.alt}
            className="aspect-square max-h-[90svh] w-auto max-w-[92vw] rounded-xl object-cover shadow-2xl"
          />
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-black"
          >
            Cerrar
          </button>
        </div>
      )}
    </main>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Por Si Mañana No Estoy — Omar Courts" },
      { name: "description", content: "Escucha Por Si Mañana No Estoy de Omar Courts en una experiencia musical interactiva." },
      { property: "og:title", content: "Por Si Mañana No Estoy — Omar Courts" },
      { property: "og:description", content: "Todas las canciones de Omar Courts en un solo lugar." },
      { property: "og:type", content: "music.album" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});