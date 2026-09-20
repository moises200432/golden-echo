# Ejemplos Rápidos - Golden Echo

## ✨ Opción 1: Reemplazo Completo (Recomendado)

Reemplaza completamente `src/routes/index.tsx`:

```typescript
import { createFileRoute } from "@tanstack/react-router";
import { EnhancedMusicPlayer } from "@/components/EnhancedMusicPlayer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Por Si Mañana No Estoy — Omar Courts" },
      { name: "description", content: "Escucha Por Si Mañana No Estoy" },
      { property: "og:title", content: "Por Si Mañana No Estoy — Omar Courts" },
      { property: "og:type", content: "music.album" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <EnhancedMusicPlayer
      albumTitle="Por Si Mañana No Estoy"
      artistName="Omar Courts presenta"
    />
  );
}
```

---

## 🎛️ Opción 2: Reproductor Básico sin Cambios

Si quieres mantener el reproductor actual pero agregar funcionalidades:

```typescript
// En tu componente existente
import { useAlbumTracks } from "@/hooks/useAlbumTracks";

function YourComponent() {
  const { tracks, addTrack, removeTrack } = useAlbumTracks();
  
  // Ahora puedes usar tracks en lugar del array hardcodeado
  return (
    // tu JSX aquí
  );
}
```

---

## 📱 Opción 3: Página de Administración

Crea `src/routes/admin.tsx` para gestionar canciones:

```typescript
import { createFileRoute } from "@tanstack/react-router";
import { YoutubePlaylistImporter } from "@/components/YoutubePlaylistImporter";
import { useAlbumTracks } from "@/hooks/useAlbumTracks";
import { Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const { tracks, removeTrack, addTrack } = useAlbumTracks();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Administrar Canciones</h1>

        {/* Importador de YouTube */}
        <div className="mb-8">
          <YoutubePlaylistImporter />
        </div>

        {/* Lista de canciones */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold mb-4">
            Canciones ({tracks.length})
          </h2>
          
          {tracks.map((track, index) => (
            <div
              key={track.id}
              className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border"
            >
              <div className="flex-1">
                <p className="font-medium">
                  {index + 1}. {track.title}
                </p>
                {track.artist && (
                  <p className="text-sm text-muted-foreground">{track.artist}</p>
                )}
              </div>
              
              <button
                onClick={() => removeTrack(track.id)}
                className="px-3 py-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 🔗 Opción 4: Modal de Importación

Agrega un botón en el reproductor para abrir modal:

```typescript
import { useState } from "react";
import { YoutubePlaylistImporter } from "@/components/YoutubePlaylistImporter";
import { Plus } from "lucide-react";

function MyPlayer() {
  const [showImportModal, setShowImportModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowImportModal(true)}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
      >
        <Plus size={18} />
        Importar desde YouTube
      </button>

      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
            <YoutubePlaylistImporter
              onClose={() => setShowImportModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
```

---

## 🎯 Importar desde YouTube Directamente

Sin componente UI, solo código:

```typescript
import { useAlbumTracks } from "@/hooks/useAlbumTracks";

function MyComponent() {
  const { fetchFromYouTube, isLoading } = useAlbumTracks();

  const handleImport = async () => {
    await fetchFromYouTube(
      'PLxxxxxxxxxxx',      // Tu Playlist ID
      'YOUR_API_KEY'        // Tu Google API Key
    );
  };

  return (
    <button onClick={handleImport} disabled={isLoading}>
      {isLoading ? 'Importando...' : 'Importar Playlist'}
    </button>
  );
}
```

---

## 🎵 Agregar Canción Manualmente

```typescript
import { useAlbumTracks } from "@/hooks/useAlbumTracks";

function AddTrackForm() {
  const { addTrack } = useAlbumTracks();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const handleAdd = () => {
    if (title && url) {
      addTrack({
        id: `track-${Date.now()}`,
        title,
        url,
      });
      setTitle('');
      setUrl('');
    }
  };

  return (
    <div className="space-y-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título de la canción"
        className="w-full px-4 py-2 border rounded-lg"
      />
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="URL del audio (mp3, wav, etc.)"
        className="w-full px-4 py-2 border rounded-lg"
        type="url"
      />
      <button
        onClick={handleAdd}
        className="w-full px-4 py-2 bg-primary text-white rounded-lg"
      >
        Agregar Canción
      </button>
    </div>
  );
}
```

---

## 🔄 Sincronizar con Spotify

```typescript
import { useAlbumTracks } from "@/hooks/useAlbumTracks";

async function importSpotifyAlbum(albumId: string, accessToken: string) {
  const { fetchFromSpotify } = useAlbumTracks();
  
  await fetchFromSpotify(
    albumId,      // Album ID de Spotify
    accessToken   // Token de acceso de Spotify
  );
}

// Uso:
importSpotifyAlbum(
  '4cOdK2wGLETKBW3PvgPWqL',
  'BQDC...token...'
);
```

---

## 🎨 Personalizar el Reproductor

```typescript
<EnhancedMusicPlayer
  albumTitle="Mi Álbum Favorito"
  artistName="Mi Artista"
  // Próximas props a agregar:
  // accentColor="#FF0000"
  // primaryColor="#0000FF"
  // enableYoutubeImport={true}
  // enableSpotifyImport={false}
/>
```

---

## 📊 Ver todas las canciones en JSON

```typescript
function ExportTracks() {
  const { tracks } = useAlbumTracks();

  const downloadJSON = () => {
    const json = JSON.stringify(tracks, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tracks.json';
    a.click();
  };

  return (
    <button onClick={downloadJSON}>
      Descargar como JSON
    </button>
  );
}
```

---

## 🔐 Usar Variables de Entorno

Archivo `.env`:
```env
VITE_YOUTUBE_API_KEY=YOUR_KEY_HERE
VITE_SPOTIFY_ACCESS_TOKEN=YOUR_TOKEN_HERE
```

En tu código:
```typescript
const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
const spotifyToken = import.meta.env.VITE_SPOTIFY_ACCESS_TOKEN;
```

---

## 🧪 Probar Localmente

```bash
# 1. Instala dependencias
npm install
# o
bun install

# 2. Inicia el servidor de desarrollo
npm run dev
# o
bun dev

# 3. Abre http://localhost:5173 en tu navegador

# 4. En la consola del navegador:
// Ver todas las canciones:
console.log(JSON.parse(localStorage.getItem('albumTracks')));

// Limpiar todo:
localStorage.removeItem('albumTracks');
location.reload();
```

---

## 📈 Casos de Uso Avanzados

### Sincronizar múltiples playlists:

```typescript
async function syncMultiplePlaylists(playlists: Array<{id: string, apiKey: string}>) {
  const { fetchFromYouTube, tracks } = useAlbumTracks();
  
  for (const playlist of playlists) {
    await fetchFromYouTube(playlist.id, playlist.apiKey);
  }
  
  console.log(`Total de canciones: ${tracks.length}`);
}
```

### Crear playlist personalizada:

```typescript
function CreatePlaylist() {
  const { addTrack, tracks } = useAlbumTracks();
  const [playlistName, setPlaylistName] = useState('');

  const handleCreatePlaylist = async () => {
    // Lógica para crear playlist personalizada
    // Guardar en base de datos o localStorage
  };

  return (
    // UI aquí
  );
}
```

### Compartir playlis:

```typescript
function SharePlaylist() {
  const { tracks } = useAlbumTracks();

  const handleShare = () => {
    const playlistJSON = JSON.stringify(tracks);
    const encoded = btoa(playlistJSON); // Base64 encode
    const shareUrl = `${window.location.origin}?playlist=${encoded}`;
    
    navigator.clipboard.writeText(shareUrl);
    alert('Enlace copiado al portapapeles!');
  };

  return (
    <button onClick={handleShare}>Compartir Playlist</button>
  );
}
```

---

¡Elige la opción que mejor se adapte a tus necesidades! 🎵
