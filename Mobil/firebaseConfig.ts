import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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
export const db = getFirestore(app);

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
  'assets/photos/avatar-de-jugador-baloncesto-d-en-con-camiseta-amarilla-sosteniendo-un-icono-ideal-para-juegos-deportivos-o-contenido-educativo-387993870.avif': require('./assets/photos/avatar-de-jugador-baloncesto-d-en-con-camiseta-amarilla-sosteniendo-un-icono-ideal-para-juegos-deportivos-o-contenido-educativo-387993870.avif'),
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
