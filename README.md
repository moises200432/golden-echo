# Golden Echo

PROYECTO: Omar Courts - "Por Si Mañana No Estoy" - Página Interactiva

## REQUISITOS TÉCNICOS

- Construir TODO en React (Hooks: useState, useEffect, useRef)

- Usar Tailwind CSS para estilos

- CSS Keyframes para animaciones

- HTML5 Audio para reproducción

- Completamente responsive (móvil y desktop)

## ANIMACIÓN PRINCIPAL: LLUVIA DE FLORES AMARILLAS

Las flores caen continuamente desde la parte superior:

- Flores emoji 🌼 o circles amarillos con forma de flor

- Cantidad: 40-60 flores activas simultáneamente

- Cada flor:

  * Tamaño aleatorio: 25px a 65px

  * Duración caída: 8-18 segundos

  * Rotación continua (360°)

  * Movimiento lateral suave (efecto viento, ±50px)

  * Opacidad inicial: 1, final: 0 (fade out)

  * Posición horizontal: aleatoria en todo el ancho

  

- Colores amarillos usados:

  * #FFD700 (Gold)

  * #FFC700 (Golden)

  * #FFED4E (Bright Yellow)

  * #FFE55C (Lighter Yellow)

- Las flores se regeneran infinitamente

- Fondo: Gradiente negro a gris oscuro (#000000 → #1a1a1a)

## LAYOUT PRINCIPAL

Fondo con lluvia de flores + Contenedor central oscuro semitransparente (z-index alto)

### SECCIÓN 1: ENCABEZADO

- Logo/Título: "POR SI MAÑANA NO ESTOY"

- Subtítulo: "Omar Courts"

- Pequeño texto: "Todas las canciones completas en un solo lugar"

### SECCIÓN 2: SELECTOR Y REPRODUCTOR

Dropdown/Select con lista de canciones:

1. EL MUNDO SE VA A ACABAR (con KARBeats)

2. FOREVER TU GANTE (con Ñengo Flow)

3. Lakenoshi

4. VAMOACHOCIHUSUSISIRENGA

5. NTEL y BELLAK (con BASSYY)

6. SI ESTÁS CON ALGUIEN

7. Dulces Sueño Zzz (+INTERLUDIO) (con Rubí)

8. UELTA GATITA UELTA (con Dei V, Clarent y Tito "El Bambino")

9. WHAT U NEED? (SexPlaylist 2) (con Myke Towers)

10. WO OH OH (con ROA)

11. KOKO

12. COMERNOS (con Bad Gyal)

13. SKY

14. MOONLIGHT (con Eladio Carrion)

15. POR SI MAÑANA NO ESTOY

### REPRODUCTOR DE AUDIO

- Selector dropdown: "Selecciona una canción"

- Botón PLAY/PAUSE

- Icono de música animado

- Título de la canción en reproducción

- Barra de progreso (gris oscuro, progreso en amarillo)

- Tiempo actual / Duración (ej: 2:34 / 4:15)

- Volumen slider (opcional pero bonito)

- Botón "Siguiente" / "Anterior"

## DISEÑO VISUAL DETALLADO

### Colores

- Fondo: #000000 a #1a1a1a (gradiente)

- Contenedor: rgba(20, 20, 30, 0.85) o similar (oscuro con transparencia)

- Texto principal: #FFFFFF

- Texto secundario: #C0C0C0

- Acentos: #FFD700 (amarillo del tema)

- Bordes/Divisores: #333333

### Tipografía

- Font-family: 'Montserrat', 'Inter', sans-serif

- Título: 28-36px, bold, blanco

- Subtítulo: 14-16px, normal, gris claro

- Botones: 14-16px, semibold

- Nombres de canciones: 14px, normal

### Componentes UI

- Botones: 

  * Background amarillo (#FFD700)

  * Hover: más oscuro (#E6C200)

  * Padding: 10px 20px

  * Border-radius: 6px

  * Transición: 0.3s

- Dropdown/Select:

  * Fondo oscuro, texto blanco

  * Border: 1px solid #FFD700

  * Focus: glow amarillo suave

  * Font-size: 14-16px

- Barra de progreso:

  * Background track: #444444

  * Progress fill: #FFD700

  * Alto: 6px

  * Border-radius: 3px

### Layout Responsive

- Desktop: Contenedor max-width 600px, centrado

- Tablet: Ancho 90%, centrado

- Móvil: Ancho 95%, padding 20px

## FUNCIONALIDADES

✅ Reproductor funcional:

- Seleccionar canción del dropdown

- Play/Pause

- Mostrar progreso en tiempo real

- Cambiar volumen

- Mostrar título actual

✅ Animación de flores:

- Generación continua

- Rotación y caída suave

- Desaparición al final

- Sin lag ni stuttering

✅ Interactividad:

- Hover effects en botones

- Las flores siguen cayendo mientras reproduces música

- Transiciones suaves

## NOTAS IMPORTANTES

- Las flores caen DETRÁS del contenedor (z-index lower)

- El reproductor debe estar siempre visible y accesible

- La animación NO debe interferir con la reproducción de audio

- Usar requestAnimationFrame para animaciones suaves

- El código debe ser clean y bien estructurado

Construye una experiencia hermosa, fluida y funcional completamente en React.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/657fbb83-6c79-40c4-8b4a-19862fb4f8e1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
