# 🏀 React Native App con Firebase Firestore - Jugadores NBA

Aplicación móvil desarrollada con **React Native** y **Expo SDK 54**, que muestra una **base de datos de jugadores de baloncesto** desde **Firebase Firestore**. Incluye navegación entre 3 pantallas: Inicio (ranking de jugadores), Detalle del jugador y Estadísticas completas.

## 🎯 Características principales

- ✅ **Base de datos de jugadores NBA** desde Firestore
- ✅ **Ranking por puntos por partido** (PPP descendente)
- ✅ **4 pantallas diferenciadas**:
  - **Inicio**: Lista de jugadores con equipo, posición y estadísticas principales
  - **Detalle**: Información completa del jugador con estadísticas básicas
  - **Video**: Reproductor de YouTube individual del jugador
  - **Videos**: Galería de todos los videos de jugadores disponibles

- ✅ **Navegación global**: Header con botones "Inicio" y "Videos" en todas las pantallas
- ✅ **Campos de jugador**: nombre, equipo, posición, altura, edad, PPP, APP, RPP, porcentaje de tiros, etc.
- ✅ **Navegación fluida** entre pantallas con Expo Router
- ✅ **TypeScript** completo para type safety

## 🚀 Inicio rápido

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn
- Expo CLI (`npm install -g @expo/cli`)
- Una cuenta de Firebase

### Instalación

1. **Clona el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd NG-E_producto3
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura Firebase**
   - Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Habilita Firestore Database
   - Actualiza el archivo `firebaseConfig.ts` con tus credenciales:
     ```typescript
     const firebaseConfig = {
       apiKey: "tu-api-key",
       authDomain: "tu-project.firebaseapp.com",
       projectId: "tu-project-id",
       storageBucket: "tu-project.appspot.com",
       messagingSenderId: "123456789",
       appId: "tu-app-id"
     };
     ```

4. **Inicia la aplicación**
   ```bash
   npx expo start
   ```

## 📱 Ejecutar la aplicación

### Opciones de ejecución:

- **Expo Go** (recomendado para desarrollo rápido):
  - Escanea el código QR con la app Expo Go en tu dispositivo móvil

- **Emulador Android**:
  ```bash
  npx expo start --android
  ```

- **Simulador iOS** (solo macOS):
  ```bash
  npx expo start --ios
  ```

- **Navegador web**:
  ```bash
  npx expo start --web
  ```

### Comandos adicionales:

```bash
# Limpiar caché y reiniciar
npx expo start --clear

# Ejecutar en modo producción
npx expo start --no-dev

# Verificar tipos TypeScript
npx tsc --noEmit

# Ejecutar linter
npx eslint . --ext .ts,.tsx
```

## 🏗️ Estructura del proyecto

```
├── app/
│   ├── _layout.tsx          # Layout raíz con navegación global
│   ├── index.tsx            # Pantalla de inicio (ranking de jugadores)
│   ├── detail.tsx           # Pantalla de detalle del jugador
│   ├── video.tsx            # Pantalla de video individual del jugador
│   └── videos.tsx           # Pantalla de galería de videos
├── types/
│   └── navigation.ts        # Definiciones de tipos para BasketballPlayer
├── firebaseConfig.ts        # Configuración de Firebase
├── app.json                 # Configuración de Expo
└── package.json             # Dependencias del proyecto
```

## 🛠️ Tecnologías utilizadas

- **React Native** - Framework para desarrollo móvil
- **Expo SDK 54** - Plataforma de desarrollo
- **Firebase Firestore** - Base de datos NoSQL
- **Expo Router** - Sistema de navegación basado en archivos
- **TypeScript** - Tipado estático
- **React Hooks** - Gestión de estado y efectos

## 📊 Características

- ✅ **3 pantallas diferenciadas**:
  - **Inicio**: Lista de jugadores NBA ordenados por puntos por partido (PPP)
  - **Detalle**: Información completa del jugador (equipo, posición, altura, edad, estadísticas principales)
  - **Estadísticas**: Vista detallada con todas las métricas del jugador (PPP, APP, RPP, porcentajes de tiro, etc.)

- ✅ **Firebase Firestore**: Base de datos de jugadores de baloncesto sin autenticación
- ✅ **Navegación fluida**: Stack Navigation entre pantallas
- ✅ **TypeScript**: Tipado completo para mejor desarrollo
- ✅ **Responsive**: Diseño adaptativo para diferentes tamaños de pantalla

## 🔧 Desarrollo

### Scripts disponibles:

```bash
# Verificar tipos
npm run type-check

# Ejecutar linter
npm run lint

# Formatear código
npm run format
```

### Configuración de Firebase

La aplicación utiliza únicamente Firestore para almacenar datos de jugadores de baloncesto. Los datos se almacenan en la colección `jugadores` con la siguiente estructura:

```typescript
interface BasketballPlayer {
  id: string;
  nombre: string;
  equipo: string;
  posicion: string;
  altura: string;
  edad: number;
  pPP: number;        // Puntos por partido
  aPP: number;        // Asistencias por partido
  rPP: number;        // Rebotes por partido
  porcentajeTiros: number;  // Porcentaje de tiros de campo
  tirosLibres?: number;     // Porcentaje de tiros libres
  tiros3?: number;          // Porcentaje de triples
  img?: string;             // URL de imagen del jugador
  videoUrl?: string;        // URL de YouTube del jugador (ej: https://youtu.be/yjR6Q4FspFc)
}
```

