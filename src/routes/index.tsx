import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight, Flower2, Music2, Pause, Play, Volume1, Volume2 } from "lucide-react";
import { PlayerButton } from "@/components/PlayerButton";
import bouquetImage from "@/assets/sunflower-bouquet.png";

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
    <main className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-background p-0 sm:px-6 sm:py-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {flowers.map((flower) => <span key={flower.id} className="flower select-none" style={flower.style} />)}
      </div>

      <section className="night-postcard relative z-10 flex min-h-[100svh] w-full max-w-[460px] flex-col items-center overflow-hidden px-5 pb-3 pt-10 sm:min-h-[860px] sm:rounded-[2rem] sm:border sm:border-primary/20 sm:px-8 sm:pt-12" aria-label="Reproductor de Por Si Mañana No Estoy">
        <header className="relative z-20 text-center">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary/80">Omar Courts presenta</p>
          <h1 className="title-glow font-display text-[clamp(3.1rem,12vw,4.7rem)] italic leading-[0.9] tracking-[0.02em]">Por Si Mañana<br />No Estoy</h1>
          <p className="mt-3 text-[11px] text-muted-foreground">Todas las canciones, una sola noche</p>
        </header>

        <div className="music-capsule relative z-30 mt-7 w-full rounded-2xl p-3.5">
          <div className="flex items-center gap-3">
            <PlayerButton label={playing ? "Pausar" : "Reproducir"} primary className="h-12 w-12 shrink-0" onClick={togglePlay}>{playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="translate-x-px" />}</PlayerButton>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-foreground">{tracks[trackIndex]}</p>
              <input aria-label="Progreso de la canción" type="range" min="0" max={duration || 0} step="0.01" value={Math.min(currentTime, duration || 0)} onChange={(event) => seek(Number(event.target.value))} className="mt-2 h-1 w-full cursor-pointer accent-primary" />
              <div className="mt-1 flex justify-between font-mono text-[9px] text-muted-foreground"><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
            </div>
          </div>

          <div className="mt-2.5 flex items-center gap-2 border-t border-border/60 pt-2.5">
            <PlayerButton label="Canción anterior" className="h-8 w-8 shrink-0" onClick={() => selectTrack(trackIndex - 1)}><ChevronLeft size={16} /></PlayerButton>
            <label htmlFor="track-select" className="sr-only">Selecciona una canción</label>
        <select
          id="track-select"
          value={trackIndex}
          onChange={(event) => selectTrack(Number(event.target.value), false)}
            className="h-8 min-w-0 flex-1 rounded-md border border-border bg-input px-2 text-[10px] text-foreground outline-none focus:ring-1 focus:ring-primary"
        >
          {tracks.map((track, index) => <option key={track} value={index}>{index + 1}. {track}</option>)}
        </select>
            <PlayerButton label="Siguiente canción" className="h-8 w-8 shrink-0" onClick={() => selectTrack(trackIndex + 1)}><ChevronRight size={16} /></PlayerButton>
          </div>
        </div>

        <div className="bouquet-glow relative z-10 -mt-2 flex w-[115%] flex-1 items-end justify-center sm:w-[108%]">
          <img src={bouquetImage} alt="Ramo abundante de girasoles amarillos" width={1024} height={1280} className="max-h-[500px] w-auto max-w-full object-contain object-bottom" />
        </div>

        <div className="relative z-30 -mt-4 flex w-full items-center justify-center gap-3 pb-2 text-muted-foreground">
          {volume < 0.5 ? <Volume1 size={15} /> : <Volume2 size={15} />}
          <input aria-label="Volumen" type="range" min="0" max="1" step="0.01" value={volume} onChange={(event) => setVolume(Number(event.target.value))} className="h-1 w-28 cursor-pointer accent-primary" />
          <span className="text-[9px] uppercase tracking-[0.2em]">Para ti</span>
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
      </section>
    </main>
  );
}