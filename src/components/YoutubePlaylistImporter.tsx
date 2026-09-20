import { useState } from 'react';
import { Music, AlertCircle, Loader } from 'lucide-react';
import { useAlbumTracks } from '@/hooks/useAlbumTracks';

interface YoutubePlaylistImporterProps {
  onClose?: () => void;
}

/**
 * Componente para importar canciones desde playlists de YouTube
 * Nota: Para usar con YouTube Data API, necesitas:
 * 1. Una API key de Google Cloud Console
 * 2. Habilitar YouTube Data API v3
 * 3. El ID de la playlist
 */
export function YoutubePlaylistImporter({ onClose }: YoutubePlaylistImporterProps) {
  const { addTrack, isLoading } = useAlbumTracks();
  const [apiKey, setApiKey] = useState('');
  const [playlistId, setPlaylistId] = useState('');
  const [manualUrl, setManualUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /**
   * Extrae el ID de una URL de YouTube
   */
  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  /**
   * Importa canciones desde YouTube usando Data API
   */
  const importFromPlaylist = async () => {
    if (!apiKey || !playlistId) {
      setError('Por favor completa API Key y Playlist ID');
      return;
    }

    setError('');
    setSuccess('');

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?` +
        `playlistId=${playlistId}&` +
        `key=${apiKey}&` +
        `part=snippet&` +
        `maxResults=50`
      );

      if (!response.ok) {
        throw new Error('Error al obtener la playlist. Verifica tu API Key y Playlist ID.');
      }

      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        setError('No se encontraron canciones en la playlist');
        return;
      }

      let addedCount = 0;
      data.items.forEach((item: any) => {
        const title = item.snippet.title;
        const videoId = item.snippet.resourceId.videoId;
        const thumbnail = item.snippet.thumbnails.medium?.url;

        // Crear URL de reproducción incrustada de YouTube
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;

        addTrack({
          id: videoId,
          title,
          url: embedUrl,
          albumArt: thumbnail,
          artist: item.snippet.videoOwnerChannelTitle,
        });

        addedCount++;
      });

      setSuccess(`✓ Se agregaron ${addedCount} canciones exitosamente`);
      setApiKey('');
      setPlaylistId('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al importar canciones');
    }
  };

  /**
   * Agrega una canción manualmente desde URL de YouTube
   */
  const addFromUrl = async () => {
    if (!manualUrl.trim()) {
      setError('Por favor ingresa una URL de YouTube');
      return;
    }

    const videoId = extractVideoId(manualUrl);
    if (!videoId) {
      setError('URL de YouTube no válida');
      return;
    }

    setError('');

    try {
      // Crear track desde la URL
      const title = manualUrl.includes('youtube.com') 
        ? new URL(manualUrl).searchParams.get('v') || videoId
        : videoId;

      addTrack({
        id: videoId,
        title: `Canción - ${videoId}`,
        url: `https://www.youtube.com/embed/${videoId}`,
      });

      setSuccess(`✓ Canción agregada exitosamente`);
      setManualUrl('');

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar la canción');
    }
  };

  return (
    <div className="w-full space-y-6 p-4 bg-muted/30 rounded-lg border border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <Music size={20} className="text-primary" />
        <h3 className="text-sm font-semibold">Importar Canciones de YouTube</h3>
      </div>

      {/* Opción 1: Desde Playlist (requiere API Key) */}
      <div className="space-y-3 p-3 bg-background/50 rounded-lg border border-border/30">
        <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Opción 1: Desde Playlist
        </h4>
        <p className="text-[10px] text-muted-foreground">
          Requiere Google API Key y YouTube Data API v3 habilitada
        </p>
        
        <input
          type="password"
          placeholder="Google API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full h-8 px-2 text-[10px] rounded-md border border-border bg-background outline-none focus:ring-1 focus:ring-primary"
        />
        
        <input
          type="text"
          placeholder="Playlist ID (ej: PLxxxxxxxxxxx)"
          value={playlistId}
          onChange={(e) => setPlaylistId(e.target.value)}
          className="w-full h-8 px-2 text-[10px] rounded-md border border-border bg-background outline-none focus:ring-1 focus:ring-primary"
        />

        <button
          onClick={importFromPlaylist}
          disabled={isLoading}
          className="w-full h-8 bg-primary text-primary-foreground text-[10px] rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {isLoading && <Loader size={14} className="animate-spin" />}
          {isLoading ? 'Importando...' : 'Importar Playlist'}
        </button>
      </div>

      {/* Opción 2: Desde URL Individual */}
      <div className="space-y-3 p-3 bg-background/50 rounded-lg border border-border/30">
        <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Opción 2: Agregar URL Individual
        </h4>
        
        <input
          type="url"
          placeholder="https://youtube.com/watch?v=... o ID de video"
          value={manualUrl}
          onChange={(e) => setManualUrl(e.target.value)}
          className="w-full h-8 px-2 text-[10px] rounded-md border border-border bg-background outline-none focus:ring-1 focus:ring-primary"
          onKeyPress={(e) => e.key === 'Enter' && addFromUrl()}
        />

        <button
          onClick={addFromUrl}
          className="w-full h-8 bg-primary text-primary-foreground text-[10px] rounded-md hover:bg-primary/90 transition-colors"
        >
          Agregar Canción
        </button>
      </div>

      {/* Mensajes de estado */}
      {error && (
        <div className="flex items-start gap-2 p-2 bg-destructive/10 border border-destructive/30 rounded-md">
          <AlertCircle size={14} className="text-destructive mt-0.5 shrink-0" />
          <p className="text-[10px] text-destructive">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-2 p-2 bg-green-500/10 border border-green-500/30 rounded-md">
          <span className="text-[10px] text-green-600">{success}</span>
        </div>
      )}

      {/* Instrucciones */}
      <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-md space-y-1">
        <p className="text-[9px] font-semibold text-blue-700 dark:text-blue-400">Instrucciones:</p>
        <ul className="text-[9px] text-blue-600 dark:text-blue-300 space-y-0.5">
          <li>• Para usar la Opción 1, crea una API Key en Google Cloud Console</li>
          <li>• Habilita YouTube Data API v3 en tu proyecto</li>
          <li>• La Opción 2 funciona sin API Key (URL de YouTube)</li>
          <li>• Las canciones se guardarán en localStorage automáticamente</li>
        </ul>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="w-full h-8 border border-border text-[10px] rounded-md hover:bg-muted transition-colors"
        >
          Cerrar
        </button>
      )}
    </div>
  );
}
