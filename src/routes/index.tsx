import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight, Flower2, Music2, Pause, Play, Volume1, Volume2 } from "lucide-react";
import { PlayerButton } from "@/components/PlayerButton";

const tracks = [
  "EL MUNDO SE VA A ACABAR (con KARBeats)",
  "FOREVER TU GANTE (con Ñengo Flow)",
  "Lakenoshi",
  "VAMOACHOCIHUSUSISIRENGA",
  "NTEL y BELLAK (con BASSYY)",
  "SI ESTÁS CON ALGUIEN",
  "Dulces Sueño Zzz (+INTERLUDIO) (con Rubí)",
  'UELTA GATITA UELTA (con Dei V, Clarent y Tito "El Bambino")',
  "WHAT U NEED? (SexPlaylist 2) (con Myke Towers)",
  "WO OH OH (con ROA)",
  "KOKO",
  "COMERNOS (con Bad Gyal)",
  "SKY",
  "MOONLIGHT (con Eladio Carrion)",
  "POR SI MAÑANA NO ESTOY",
];

type FlowerStyle = CSSProperties & Record<`--${string}`, string>;

const formatTime = (value: number) => {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  return `${minutes}:${Math.floor(value % 60).toString().padStart(2, "0")}`;
};

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

function Index() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number | null>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.72);

  const flowers = useMemo(() => Array.from({ length: 52 }, (_, index) => {
    const colors = ["#FFD700", "#FFC700", "#FFED4E", "#FFE55C"];
    const style: FlowerStyle = {
      "--left": `${(index * 37.7 + (index % 7) * 4.3) % 100}%`,
      "--size": `${25 + (index * 17) % 41}px`,
      "--duration": `${8 + (index * 13) % 11}s`,
      "--delay": `${-((index * 1.83) % 18)}s`,
      "--wind": `${-50 + (index * 29) % 101}px`,
      "--flower-color": colors[index % colors.length] ?? "#FFD700",
    };
    return { id: index, style };
  }), []);

  const syncProgress = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
    if (!audio.paused) animationRef.current = requestAnimationFrame(syncProgress);
  }, []);

  useEffect(() => () => {
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      await audio.play();
      setPlaying(true);
      animationRef.current = requestAnimationFrame(syncProgress);
    } else {
      audio.pause();
      setPlaying(false);
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    }
  };

  const selectTrack = (nextIndex: number, autoplay = playing) => {
    setTrackIndex((nextIndex + tracks.length) % tracks.length);
    setCurrentTime(0);
    setDuration(0);
    requestAnimationFrame(() => {
      const audio = audioRef.current;
      if (!audio || !autoplay) return;
      void audio.play().then(() => {
        setPlaying(true);
        animationRef.current = requestAnimationFrame(syncProgress);
      });
    });
  };

  const seek = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setCurrentTime(value);
  };

  return (
    <main className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-[linear-gradient(155deg,var(--background)_0%,var(--secondary)_150%)] px-3 py-8 sm:px-6 sm:py-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {flowers.map((flower) => <span key={flower.id} className="flower select-none" style={flower.style} />)}
      </div>

      <section className="glass-panel relative z-10 w-full max-w-[600px] overflow-hidden rounded-lg px-5 py-7 sm:px-9 sm:py-9" aria-label="Reproductor de Por Si Mañana No Estoy">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-primary" />
        <header className="text-center">
          <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
            <Flower2 size={25} strokeWidth={1.7} />
          </div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">Omar Courts</p>
          <h1 className="text-[clamp(1.65rem,5vw,2.25rem)] font-extrabold leading-[1.12] tracking-[0.02em] text-foreground">POR SI MAÑANA<br />NO ESTOY</h1>
          <p className="mt-3 text-xs text-muted-foreground sm:text-sm">Todas las canciones completas en un solo lugar</p>
        </header>

        <div className="my-7 h-px bg-border" />

        <label htmlFor="track-select" className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Selecciona una canción</label>
        <select
          id="track-select"
          value={trackIndex}
          onChange={(event) => selectTrack(Number(event.target.value), false)}
          className="h-12 w-full rounded-md border border-primary/70 bg-input px-3 text-sm text-foreground outline-none transition-shadow focus:ring-2 focus:ring-primary/30"
        >
          {tracks.map((track, index) => <option key={track} value={index}>{index + 1}. {track}</option>)}
        </select>

        <div className="mt-8 text-center" aria-live="polite">
          <div className="mb-3 flex h-7 items-end justify-center gap-1 text-primary" aria-hidden="true">
            {playing ? Array.from({ length: 5 }, (_, i) => (
              <span key={i} className="h-6 w-1 origin-bottom rounded-full bg-primary" style={{ animation: `equalizer ${0.55 + i * 0.11}s ease-in-out ${i * 0.08}s infinite` }} />
            )) : <Music2 size={25} />}
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{playing ? "Reproduciendo ahora" : "Lista para reproducir"}</p>
          <h2 className="mx-auto mt-2 min-h-11 max-w-md text-sm font-semibold leading-relaxed text-foreground sm:text-base">{tracks[trackIndex]}</h2>
        </div>

        <div className="mt-5">
          <input
            aria-label="Progreso de la canción"
            type="range"
            min="0"
            max={duration || 0}
            step="0.01"
            value={Math.min(currentTime, duration || 0)}
            onChange={(event) => seek(Number(event.target.value))}
            className="h-1.5 w-full cursor-pointer accent-primary"
          />
          <div className="mt-2 flex justify-between font-mono text-[11px] text-muted-foreground"><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
        </div>

        <div className="mt-3 flex items-center justify-center gap-6">
          <PlayerButton label="Canción anterior" onClick={() => selectTrack(trackIndex - 1)}><ChevronLeft size={21} /></PlayerButton>
          <PlayerButton label={playing ? "Pausar" : "Reproducir"} primary onClick={togglePlay}>{playing ? <Pause size={25} fill="currentColor" /> : <Play size={25} fill="currentColor" className="translate-x-px" />}</PlayerButton>
          <PlayerButton label="Siguiente canción" onClick={() => selectTrack(trackIndex + 1)}><ChevronRight size={21} /></PlayerButton>
        </div>

        <div className="mx-auto mt-7 flex max-w-[230px] items-center gap-3 text-muted-foreground">
          {volume < 0.5 ? <Volume1 size={17} /> : <Volume2 size={17} />}
          <input aria-label="Volumen" type="range" min="0" max="1" step="0.01" value={volume} onChange={(event) => setVolume(Number(event.target.value))} className="h-1.5 w-full cursor-pointer accent-primary" />
        </div>

        <audio
          ref={audioRef}
          src={`/audio/track-${String(trackIndex + 1).padStart(2, "0")}.wav`}
          preload="metadata"
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
          onEnded={() => selectTrack(trackIndex + 1, true)}
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
        />
        <p className="mt-7 text-center text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">Pistas demo originales</p>
      </section>
    </main>
  );
}