import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, Volume1, Volume2, Plus, RotateCcw, Music } from "lucide-react";
import { PlayerButton } from "@/components/PlayerButton";
import bouquetImage from "@/assets/sunflower-bouquet.png";
import { useAlbumTracks, type Track } from "@/hooks/useAlbumTracks";

type FlowerStyle = CSSProperties & Record<`--${string}`, string>;

const formatTime = (value: number) => {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  return `${minutes}:${Math.floor(value % 60).toString().padStart(2, "0")}`;
};

interface EnhancedMusicPlayerProps {
  albumTitle?: string;
  artistName?: string;
  albumArt?: string;
}

export function EnhancedMusicPlayer({
  albumTitle = "Por Si Mañana No Estoy",
  artistName = "Omar Courts presenta",
}: EnhancedMusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number | null>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.72);
  const [showAddTrack, setShowAddTrack] = useState(false);
  const [newTrackTitle, setNewTrackTitle] = useState("");
  const [newTrackUrl, setNewTrackUrl] = useState("");

  const { tracks, addTrack, removeTrack, resetToDefaults } = useAlbumTracks();

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

  // Actualizar el src del audio cuando cambia el índice de track
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !tracks[trackIndex]) return;
    
    const track = tracks[trackIndex];
    audio.src = track.url || "";
    setCurrentTime(0);
    setDuration(0);
    
    if (playing) {
      void audio.play().catch(err => {
        console.error('Error playing track:', err);
        setPlaying(false);
      });
    }
  }, [trackIndex, tracks, playing]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
        setPlaying(true);
        animationRef.current = requestAnimationFrame(syncProgress);
      } catch (err) {
        console.error('Error playing audio:', err);
      }
    } else {
      audio.pause();
      setPlaying(false);
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    }
  };

  const selectTrack = (nextIndex: number, autoplay = playing) => {
    if (tracks.length === 0) return;
    setTrackIndex((nextIndex + tracks.length) % tracks.length);
  };

  const seek = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setCurrentTime(value);
  };

  const handleAddTrack = () => {
    if (newTrackTitle.trim() && newTrackUrl.trim()) {
      addTrack({
        id: `track-${Date.now()}`,
        title: newTrackTitle,
        url: newTrackUrl,
      });
      setNewTrackTitle("");
      setNewTrackUrl("");
      setShowAddTrack(false);
    }
  };

  const currentTrack = tracks[trackIndex];

  if (tracks.length === 0) {
    return (
      <main className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-background p-0 sm:px-6 sm:py-8">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          {flowers.map((flower) => <span key={flower.id} className="flower select-none" style={flower.style} />)}
        </div>
        <section className="night-postcard relative z-10 flex min-h-[100svh] w-full max-w-[460px] flex-col items-center justify-center overflow-hidden px-5 pb-3 pt-10 sm:min-h-[860px] sm:rounded-[2rem] sm:border sm:border-primary/20 sm:px-8 sm:pt-12">
          <div className="text-center">
            <Music size={48} className="mx-auto mb-4 text-primary" />
            <h2 className="text-lg font-semibold mb-4">No hay canciones</h2>
            <button
              onClick={resetToDefaults}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Cargar álbum por defecto
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-background p-0 sm:px-6 sm:py-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {flowers.map((flower) => <span key={flower.id} className="flower select-none" style={flower.style} />)}
      </div>

      <section className="night-postcard relative z-10 flex min-h-[100svh] w-full max-w-[460px] flex-col items-center overflow-hidden px-5 pb-3 pt-10 sm:min-h-[860px] sm:rounded-[2rem] sm:border sm:border-primary/20 sm:px-8 sm:pt-12" aria-label="Reproductor de música">
        <header className="relative z-20 text-center">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary/80">{artistName}</p>
          <h1 className="title-glow font-display text-[clamp(3.1rem,12vw,4.7rem)] italic leading-[0.9] tracking-[0.02em]">{albumTitle}</h1>
          <p className="mt-3 text-[11px] text-muted-foreground">{tracks.length} canciones • Una sola noche</p>
        </header>

        <div className="music-capsule relative z-30 mt-7 w-full rounded-2xl p-3.5">
          {/* Controles de reproducción */}
          <div className="flex items-center gap-3">
            <PlayerButton label={playing ? "Pausar" : "Reproducir"} primary className="h-12 w-12 shrink-0" onClick={togglePlay}>
              {playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="translate-x-px" />}
            </PlayerButton>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-foreground">{currentTrack?.title || "No hay canción"}</p>
              <input 
                aria-label="Progreso de la canción" 
                type="range" 
                min="0" 
                max={duration || 0} 
                step="0.01" 
                value={Math.min(currentTime, duration || 0)} 
                onChange={(event) => seek(Number(event.target.value))} 
                className="mt-2 h-1 w-full cursor-pointer accent-primary" 
              />
              <div className="mt-1 flex justify-between font-mono text-[9px] text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          {/* Controles de navegación */}
          <div className="mt-2.5 flex items-center gap-2 border-t border-border/60 pt-2.5">
            <PlayerButton label="Canción anterior" className="h-8 w-8 shrink-0" onClick={() => selectTrack(trackIndex - 1)}>
              <ChevronLeft size={16} />
            </PlayerButton>
            <label htmlFor="track-select" className="sr-only">Selecciona una canción</label>
            <select
              id="track-select"
              value={trackIndex}
              onChange={(event) => selectTrack(Number(event.target.value), false)}
              className="h-8 min-w-0 flex-1 rounded-md border border-border bg-input px-2 text-[10px] text-foreground outline-none focus:ring-1 focus:ring-primary"
            >
              {tracks.map((track, index) => (
                <option key={track.id} value={index}>
                  {index + 1}. {track.title}
                </option>
              ))}
            </select>
            <PlayerButton label="Siguiente canción" className="h-8 w-8 shrink-0" onClick={() => selectTrack(trackIndex + 1)}>
              <ChevronRight size={16} />
            </PlayerButton>
          </div>

          {/* Controles adicionales */}
          <div className="mt-2.5 flex items-center gap-2 border-t border-border/60 pt-2.5 text-[10px]">
            <PlayerButton label="Agregar canción" className="h-8 w-8 shrink-0" onClick={() => setShowAddTrack(!showAddTrack)}>
              <Plus size={16} />
            </PlayerButton>
            <PlayerButton label="Restaurar predeterminadas" className="h-8 px-2 shrink-0" onClick={resetToDefaults}>
              <RotateCcw size={14} className="mr-1" />
              Restaurar
            </PlayerButton>
            <button
              onClick={() => removeTrack(currentTrack.id)}
              className="h-8 px-2 text-xs rounded-md border border-border hover:bg-destructive/10 text-destructive transition-colors"
            >
              Eliminar
            </button>
          </div>

          {/* Formulario para agregar canción */}
          {showAddTrack && (
            <div className="mt-2.5 border-t border-border/60 pt-2.5 space-y-2">
              <input
                type="text"
                placeholder="Título de la canción"
                value={newTrackTitle}
                onChange={(e) => setNewTrackTitle(e.target.value)}
                className="w-full h-8 px-2 text-[10px] rounded-md border border-border bg-input outline-none focus:ring-1 focus:ring-primary"
              />
              <input
                type="url"
                placeholder="URL de la canción (mp3, wav, etc.)"
                value={newTrackUrl}
                onChange={(e) => setNewTrackUrl(e.target.value)}
                className="w-full h-8 px-2 text-[10px] rounded-md border border-border bg-input outline-none focus:ring-1 focus:ring-primary"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddTrack}
                  className="flex-1 h-8 bg-primary text-primary-foreground text-[10px] rounded-md hover:bg-primary/90 transition-colors"
                >
                  Agregar
                </button>
                <button
                  onClick={() => setShowAddTrack(false)}
                  className="flex-1 h-8 border border-border text-[10px] rounded-md hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
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
          preload="metadata"
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
          onEnded={() => selectTrack(trackIndex + 1, true)}
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
          crossOrigin="anonymous"
        />
      </section>
    </main>
  );
}
