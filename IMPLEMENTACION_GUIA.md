# Guía de Implementación - Golden Echo Mejorado

## 📋 Resumen de Cambios

He creado una versión mejorada del reproductor de música que permite:

✅ **Reproducir canciones del álbum estático** (como está ahora)
✅ **Agregar canciones manualmente** con URL
✅ **Importar desde YouTube Playlists** (con API Key)
✅ **Importar desde Spotify** (con Access Token)
✅ **Gestionar canciones** (agregar, eliminar, reordenar)
✅ **Guardar cambios** en localStorage automáticamente
✅ **Restaurar valores por defecto** en un clic

---

## 📁 Archivos Creados

### 1. **useAlbumTracks.ts** (Hook Personalizado)
**Ubicación:** `/src/hooks/useAlbumTracks.ts`

Maneja toda la lógica de gestión de canciones:
- Almacenar/recuperar canciones de localStorage
- Agregar/eliminar/actualizar canciones
- Integración con YouTube Data API
- Integración con Spotify API
- Reordenar canciones

```typescript
const { tracks, addTrack, removeTrack, updateTrack, saveTracks } = useAlbumTracks();
```

### 2. **EnhancedMusicPlayer.tsx** (Componente Principal)
**Ubicación:** `/src/components/EnhancedMusicPlayer.tsx`

Reproductor mejorado con:
- Interfaz idéntica a la actual (mantiene el estilo)
- Botones para agregar/eliminar/restaurar canciones
- Formulario integrado para agregar canciones manualmente
- Soporte para múltiples fuentes de audio

### 3. **YoutubePlaylistImporter.tsx** (Componente de Importación)
**Ubicación:** `/src/components/YoutubePlaylistImporter.tsx`

Permite importar canciones desde YouTube:
- Opción 1: Playlist completa (requiere API Key)
- Opción 2: Canción individual (sin API Key)
- Validación de URLs
- Extracción de metadatos

---

## 🚀 Instalación Paso a Paso

### Paso 1: Copiar los archivos

```bash
# Hook personalizado
cp useAlbumTracks.ts src/hooks/

# Componentes
cp EnhancedMusicPlayer.tsx src/components/
cp YoutubePlaylistImporter.tsx src/components/
```

### Paso 2: Reemplazar la ruta principal

Edita `src/routes/index.tsx`:

```typescript
// ANTES
import Index from "@/routes/index"; // Componente antiguo

// DESPUÉS
import { EnhancedMusicPlayer } from "@/components/EnhancedMusicPlayer";

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
  return (
    <EnhancedMusicPlayer
      albumTitle="Por Si Mañana No Estoy"
      artistName="Omar Courts presenta"
    />
  );
}
```

### Paso 3: Agregar el importador (opcional)

Para agregar un modal/página de importación desde YouTube:

```typescript
import { YoutubePlaylistImporter } from "@/components/YoutubePlaylistImporter";
import { useState } from "react";

export function AdminPage() {
  const [showImporter, setShowImporter] = useState(false);

  return (
    <div className="p-8">
      <button onClick={() => setShowImporter(!showImporter)}>
        Importar desde YouTube
      </button>
      
      {showImporter && (
        <YoutubePlaylistImporter onClose={() => setShowImporter(false)} />
      )}
    </div>
  );
}
```

---

## 🔑 Configurar YouTube Data API

### Obtener API Key:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto
3. Habilita "YouTube Data API v3"
4. Crea una credencial de tipo "API Key"
5. Copia la API Key

### Obtener Playlist ID:

De una URL como: `https://youtube.com/playlist?list=PLxxxxxxxxxxx`
- La parte `PLxxxxxxxxxxx` es el Playlist ID

### Obtener Video ID:

De una URL como: `https://youtube.com/watch?v=dQw4w9WgXcQ`
- La parte `dQw4w9WgXcQ` es el Video ID

---

## 🎵 Configurar Spotify API (Opcional)

### Obtener Access Token:

1. Ve a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Crea una aplicación
3. Usa OAuth 2.0 para obtener un Access Token
4. O usa Client Credentials Flow para pruebas

### Obtener Album ID:

De una URL como: `https://open.spotify.com/album/4cOdK2wGLETKBW3PvgPWqL`
- La parte `4cOdK2wGLETKBW3PvgPWqL` es el Album ID

---

## 💾 Gestión de Almacenamiento

### localStorage:

Las canciones se guardan automáticamente en:
```typescript
localStorage.getItem('albumTracks') // array JSON
```

### Para limpiar todo:

```typescript
// En la consola del navegador
localStorage.removeItem('albumTracks');
location.reload();
```

---

## 🎯 Ejemplos de Uso

### Agregar canción manualmente:

```typescript
const { addTrack } = useAlbumTracks();

addTrack({
  id: 'custom-001',
  title: 'Mi Canción',
  url: 'https://example.com/song.mp3',
  artist: 'Mi Artista',
});
```

### Importar desde playlist de YouTube:

```typescript
const { fetchFromYouTube } = useAlbumTracks();

fetchFromYouTube(
  'PLxxxxxxxxxxx', // Playlist ID
  'YOUR_API_KEY'    // Google API Key
);
```

### Importar desde Spotify:

```typescript
const { fetchFromSpotify } = useAlbumTracks();

fetchFromSpotify(
  '4cOdK2wGLETKBW3PvgPWqL', // Album ID
  'YOUR_ACCESS_TOKEN'        // Spotify Access Token
);
```

---

## 🔒 Consideraciones de Seguridad

⚠️ **IMPORTANTE:**
- **NUNCA compartas tu API Key o Access Token en código público**
- Guárdalo en variables de entorno
- En producción, obtén los tokens desde tu backend

### Usar Variables de Entorno:

```env
VITE_YOUTUBE_API_KEY=your_api_key_here
VITE_SPOTIFY_ACCESS_TOKEN=your_token_here
```

```typescript
const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
const token = import.meta.env.VITE_SPOTIFY_ACCESS_TOKEN;
```

---

## 🎨 Personalización

### Cambiar colores:

Los colores usan variables CSS definidas en `src/styles.css`:
```css
:root {
  --primary: #your-color;
  --background: #your-bg;
  /* etc */
}
```

### Cambiar fuentes:

Edita `EnhancedMusicPlayer.tsx`:
```typescript
<h1 className="title-glow font-display text-[clamp(...)]">
  Tu Título
</h1>
```

### Cambiar cantidad de flores:

En `EnhancedMusicPlayer.tsx`:
```typescript
const flowers = useMemo(() => Array.from({ length: 52 }, ...
// Cambia 52 al número que desees
```

---

## 🐛 Solución de Problemas

### Las canciones no se reproducen:
- Verifica que la URL sea válida y accesible
- Comprueba la consola del navegador para errores CORS
- Para YouTube, usa URLs incrustadas (`youtube.com/embed/...`)

### API Key no funciona:
- Verifica que YouTube Data API v3 esté habilitada
- Comprueba que el Playlist ID sea correcto
- Revisa los límites de cuota en Google Cloud Console

### Canciones no se guardan:
- Verifica que localStorage no esté deshabilitado
- Comprueba el espacio disponible (localStorage tiene ~5MB de límite)

---

## 📊 Estructura de Datos

### Track Object:
```typescript
interface Track {
  id: string;              // Identificador único
  title: string;           // Nombre de la canción
  duration?: number;       // Duración en segundos
  url?: string;            // URL del audio
  artist?: string;         // Nombre del artista
  albumArt?: string;       // URL de portada del álbum
}
```

---

## 🚀 Próximos Pasos

1. ✅ Copiar los archivos a tu proyecto
2. ✅ Configurar las APIs (YouTube/Spotify)
3. ✅ Probar el reproductor localmente
4. ✅ Personalizar los estilos según necesites
5. ✅ Desplegar a producción

---

## 📞 Soporte

Si tienes preguntas sobre la implementación:

- Revisa los comentarios en el código
- Verifica la consola del navegador para errores
- Consulta la documentación de las APIs externas

---

**¡Listo para reproducir todas tus canciones! 🎵**
