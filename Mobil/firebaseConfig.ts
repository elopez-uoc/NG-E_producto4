import { getApps, initializeApp } from "firebase/app";
import { initializeFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyB7i_V7VbK1JQsOIt3hzn_kTByhmhHXj3w",
  authDomain: "nge-producto2.firebaseapp.com",
  projectId: "nge-producto2",
  storageBucket: "nge-producto2.firebasestorage.app",
  messagingSenderId: "937779816336",
  appId: "1:937779816336:web:0fba72d7fd3235a7d53515",
  measurementId: "G-2QLSF19JES"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Usamos initializeFirestore para forzar long-polling. 
// Esto soluciona el error "Could not reach Cloud Firestore backend" en la mayoría de dispositivos móviles.
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

// Configuración para conectar con el Emulador de Firebase
if (__DEV__) {
  // Si usas el emulador de Android, debes usar '10.0.2.2'.
  // Si usas un dispositivo físico o iOS, usa la IP local de tu PC (asegúrate de que sea correcta).
  const EMULATOR_HOST = Platform.OS === 'android' 
    ? '10.0.2.2' 
    : '192.168.0.50'; // <-- Asegúrate de que esta IP coincida con la de tu PC

  const FIRESTORE_PORT = 8080;

  try {
    // Nota: connectFirestoreEmulator debe llamarse antes de cualquier otra operación con db
    connectFirestoreEmulator(db, EMULATOR_HOST, FIRESTORE_PORT);
    console.log(`Conectado al emulador de Firestore en ${EMULATOR_HOST}:${FIRESTORE_PORT}`);
  } catch (e) {
    console.warn("Error conectando al emulador de Firestore:", e);
  }
}

// Mapa estático de imágenes disponibles (require debe ser estático en React Native)
const imageAssets: { [key: string]: any } = {
  // Mapeo de rutas de Firestore a assets estáticos
  'assets/photos/lebron-james-los-angeles-lakers_8tf0xx4nad6e1t1gpm6fdczyc.png': require('./assets/photos/lebron-james-los-angeles-lakers_8tf0xx4nad6e1t1gpm6fdczyc.png'),
  'assets/photos/kevin-durant.webp': require('./assets/photos/kevin-durant.webp'),
  'assets/photos/kawhi-leonard.webp': require('./assets/photos/kawhi-leonard.webp'),
  'assets/photos/Magic-Johnson.webp': require('./assets/photos/Magic-Johnson.webp'),
  'assets/photos/giannis-antetokounmpo.webp': require('./assets/photos/giannis-antetokounmpo.webp'),
  'assets/photos/_110655507_kb.jpg': require('./assets/photos/_110655507_kb.jpg'),
  'assets/photos/kareem-abdul-jabbar-zfvtrzdmlck91kbkypla29ass-1584662719315.webp': require('./assets/photos/kareem-abdul-jabbar-zfvtrzdmlck91kbkypla29ass-1584662719315.webp'),
  'assets/photos/jordan_michael_1.jpg': require('./assets/photos/jordan_michael_1.jpg'),
  'assets/photos/nikola-jokic.webp': require('./assets/photos/nikola-jokic.webp'),
  'assets/photos/stephen-curry.webp': require('./assets/photos/stephen-curry.webp'),
  'assets/photos/avatar_amarillo.avif': require('./assets/photos/avatar_amarillo.avif'),
};

// Función para cargar imágenes locales con require
export const requireImage = (path: string | undefined) => {
  if (!path) return null;

  try {
    // Buscar en el mapa estático de imágenes
    const imageAsset = imageAssets[path];
    if (imageAsset) {
      return imageAsset;
    }

    // Si no se encuentra, intentar con require dinámico como fallback (aunque puede fallar)
    console.warn(`Imagen no encontrada en mapa estático: ${path}`);
    return null;
  } catch (error) {
    console.warn(`No se pudo cargar la imagen: ${path}`, error);
    return null;
  }
};

export default app;
