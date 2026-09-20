import { useState, useCallback, useEffect } from 'react';

export interface Track {
  id: string;
  title: string;
  duration?: number;
  url?: string;
  artist?: string;
  albumArt?: string;
}

export const useAlbumTracks = () => {
  // Canciones del álbum "Por Si Mañana No Estoy" de Omar Courts
  const defaultTracks: Track[] = [
    {
      id: '01',
      title: 'EL MUNDO SE VA A ACABAR (con KARBeats)',
      url: '/audio/track-01.wav',
    },
    {
      id: '02',
      title: 'FOREVER TU GANTE (con Ñengo Flow)',
      url: '/audio/track-02.wav',
    },
    {
      id: '03',
      title: 'Lakenoshi',
      url: '/audio/track-03.wav',
    },
    {
      id: '04',
      title: 'VAMOACHOCIHUSUSISIRENGA',
      url: '/audio/track-04.wav',
    },
    {
      id: '05',
      title: 'NTEL y BELLAK (con BASSYY)',
      url: '/audio/track-05.wav',
    },
    {
      id: '06',
      title: 'SI ESTÁS CON ALGUIEN',
      url: '/audio/track-06.wav',
    },
    {
      id: '07',
      title: 'Dulces Sueño Zzz (+INTERLUDIO) (con Rubí)',
      url: '/audio/track-07.wav',
    },
    {
      id: '08',
      title: 'UELTA GATITA UELTA (con Dei V, Clarent y Tito "El Bambino")',
      url: '/audio/track-08.wav',
    },
    {
      id: '09',
      title: 'WHAT U NEED? (SexPlaylist 2) (con Myke Towers)',
      url: '/audio/track-09.wav',
    },
    {
      id: '10',
      title: 'WO OH OH (con ROA)',
      url: '/audio/track-10.wav',
    },
    {
      id: '11',
      title: 'KOKO',
      url: '/audio/track-11.wav',
    },
    {
      id: '12',
      title: 'COMERNOS (con Bad Gyal)',
      url: '/audio/track-12.wav',
    },
    {
      id: '13',
      title: 'SKY',
      url: '/audio/track-13.wav',
    },
    {
      id: '14',
      title: 'MOONLIGHT (con Eladio Carrion)',
      url: '/audio/track-14.wav',
    },
    {
      id: '15',
      title: 'POR SI MAÑANA NO ESTOY',
      url: '/audio/track-15.wav',
    },
  ];

  const [tracks, setTracks] = useState<Track[]>(defaultTracks);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar canciones desde localStorage si existen
  useEffect(() => {
    const savedTracks = localStorage.getItem('albumTracks');
    if (savedTracks) {
      try {
        setTracks(JSON.parse(savedTracks));
      } catch (error) {
        console.error('Error loading tracks from localStorage:', error);
      }
    }
  }, []);

  // Guardar canciones en localStorage cuando cambien
  const saveTracks = useCallback((newTracks: Track[]) => {
    setTracks(newTracks);
    localStorage.setItem('albumTracks', JSON.stringify(newTracks));
  }, []);

  // Agregar una canción manualmente
  const addTrack = useCallback((track: Track) => {
    const newTracks = [...tracks, track];
    saveTracks(newTracks);
  }, [tracks, saveTracks]);

  // Eliminar una canción
  const removeTrack = useCallback((trackId: string) => {
    const newTracks = tracks.filter(track => track.id !== trackId);
    saveTracks(newTracks);
  }, [tracks, saveTracks]);

  // Actualizar una canción
  const updateTrack = useCallback((trackId: string, updates: Partial<Track>) => {
    const newTracks = tracks.map(track =>
      track.id === trackId ? { ...track, ...updates } : track
    );
    saveTracks(newTracks);
  }, [tracks, saveTracks]);

  // Reordenar canciones
  const reorderTracks = useCallback((fromIndex: number, toIndex: number) => {
    const newTracks = [...tracks];
    const [removed] = newTracks.splice(fromIndex, 1);
    newTracks.splice(toIndex, 0, removed);
    saveTracks(newTracks);
  }, [tracks, saveTracks]);

  // Obtener canciones de YouTube Data API (requiere API key)
  const fetchFromYouTube = useCallback(async (playlistId: string, apiKey: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${playlistId}&key=${apiKey}&part=snippet&maxResults=50`
      );
      const data = await response.json();

      if (data.items) {
        const ytTracks: Track[] = data.items.map((item: any, index: number) => ({
          id: item.id,
          title: item.snippet.title,
          url: `https://www.youtube.com/embed/${item.snippet.resourceId.videoId}`,
          albumArt: item.snippet.thumbnails.medium?.url,
          artist: item.snippet.videoOwnerChannelTitle,
        }));
        saveTracks(ytTracks);
      }
    } catch (error) {
      console.error('Error fetching from YouTube:', error);
    } finally {
      setIsLoading(false);
    }
  }, [saveTracks]);

  // Obtener canciones de Spotify (requiere API key)
  const fetchFromSpotify = useCallback(async (albumId: string, accessToken: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/albums/${albumId}/tracks`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const data = await response.json();

      if (data.items) {
        const spotifyTracks: Track[] = data.items.map((item: any) => ({
          id: item.id,
          title: item.name,
          duration: Math.floor(item.duration_ms / 1000),
          artist: item.artists.map((a: any) => a.name).join(', '),
          url: item.preview_url,
        }));
        saveTracks(spotifyTracks);
      }
    } catch (error) {
      console.error('Error fetching from Spotify:', error);
    } finally {
      setIsLoading(false);
    }
  }, [saveTracks]);

  // Resetear a las canciones por defecto
  const resetToDefaults = useCallback(() => {
    saveTracks(defaultTracks);
  }, [saveTracks]);

  return {
    tracks,
    isLoading,
    addTrack,
    removeTrack,
    updateTrack,
    reorderTracks,
    saveTracks,
    fetchFromYouTube,
    fetchFromSpotify,
    resetToDefaults,
  };
};
