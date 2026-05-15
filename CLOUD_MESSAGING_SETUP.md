# 📲 Firebase Cloud Messaging - Guía de Implementación

## Resumen

El proyecto ahora incluye **Cloud Functions** que envían automáticamente notificaciones FCM (Firebase Cloud Messaging) cuando se crea, actualiza o elimina un jugador en Firestore.

## 🏗️ Arquitectura

### Triggers de Cloud Functions (2ª generación)

#### 1. `notifyOnPlayerWrite`
- **Evento**: `onDocumentWritten` en `jugadores/{playerId}`
- **Se dispara**: Cuando se **crea**, **actualiza** o **elimina** un jugador
- **Mensaje personalizado** según el tipo de evento:
  - **Creación**: "Nuevo jugador añadido - Se ha añadido [nombre] al ranking"
  - **Actualización**: "Jugador actualizado - [nombre] ha sido actualizado"
  - **Eliminación**: "Jugador eliminado - [nombre] fue eliminado del ranking"

#### 2. `notifyOnPlayerUpdate`
- **Evento**: `onDocumentUpdated` en `jugadores/{playerId}`
- **Se dispara**: Solo cuando hay **cambios en un documento existente**
- **Mensajes personalizados** para cambios específicos:
  - Si cambia `pPP` (puntos por partido): "Ahora tiene X PPP (antes: Y)"
  - Si cambia `equipo`: "Cambió a [equipo]"
  - Si cambia `posición`: "Cambió a posición [posición]"

### Colección de Tokens FCM

Estructura esperada de la colección `fcm_tokens`:

```typescript
// /fcm_tokens/{documentId}
{
  token: string;           // Token FCM del dispositivo
  createdAt?: Timestamp;   // Fecha de creación (opcional)
  deviceId?: string;       // ID del dispositivo (opcional)
  userId?: string;         // ID del usuario (opcional)
}
```

## 🔧 Implementación en la App Móvil

### 1. Guardar el token FCM en Firestore

En [app/notifications.ts](app/notifications.ts), después de obtener el token, debes guardarlo:

```typescript
// En app/_layout.tsx o en un hook personalizado
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { registerForPushNotificationsAsync } from './app/notifications';

// ... en useEffect
const token = await registerForPushNotificationsAsync();
if (token) {
  const db = getFirestore();
  await addDoc(collection(db, 'fcm_tokens'), {
    token,
    createdAt: serverTimestamp(),
    deviceId: getUniqueId(), // Necesitas expo-device o similar
  });
}
```

### 2. Escuchar notificaciones en la App

```typescript
import * as Notifications from 'expo-notifications';

// En useEffect del componente raíz
Notifications.addNotificationResponseReceivedListener((response) => {
  const data = response.notification.request.content.data;
  const playerId = data.playerId;
  
  // Navegar al detalle del jugador
  if (playerId) {
    router.push({
      pathname: '/detail',
      params: { playerId }
    });
  }
});
```

## 🚀 Despliegue de Cloud Functions

### Requisitos previos

1. **Firebase CLI instalado**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Autenticación en Firebase**:
   ```bash
   firebase login
   ```

3. **Inicialización del proyecto Firebase**:
   ```bash
   firebase init functions
   ```

### Desplegar las funciones

```bash
cd functions
npm run build      # Compilar TypeScript
npm run deploy     # Desplegar a producción
```

O desplegar directamente:

```bash
firebase deploy --only functions
```

### Emular localmente (desarrollo)

```bash
cd functions
npm run serve      # Inicia el emulador local
```

Luego visita `http://localhost:4000/` para ver el Emulator Suite.

## 📝 Flujo de ejecución

```
┌─────────────────────────────────┐
│ Cambio en Firestore (jugadores) │
│ - Crear documento               │
│ - Actualizar documento          │
│ - Eliminar documento            │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│  Cloud Functions se disparan:   │
│  - notifyOnPlayerWrite          │
│  - notifyOnPlayerUpdate (si es  │
│    actualización)               │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│  Obtener tokens de fcm_tokens   │
│  en Firestore                   │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│  Enviar FCM a todos los tokens  │
│  usando Admin SDK               │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│  Dispositivos reciben           │
│  notificación push              │
└─────────────────────────────────┘
```

## 🔐 Seguridad y mejores prácticas

1. **Reglas de Firestore** - Proteger `fcm_tokens`:

```typescript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura/escritura solo de la función de Cloud
    match /fcm_tokens/{document=**} {
      allow create: if request.auth != null;
      allow read, update, delete: if false; // Solo Cloud Functions
    }
    
    // Colección de jugadores (lectura pública)
    match /jugadores/{document=**} {
      allow read: if true;
      allow write: if false; // Solo admin o backend
    }
  }
}
```

2. **Manejo de tokens inválidos** - Las funciones eliminan automáticamente tokens que fallan
3. **Logging** - Todos los eventos se registran para auditoría
4. **Idempotencia** - Las funciones son seguras ante múltiples disparos del mismo evento

## 🐛 Solución de problemas

| Problema | Solución |
|----------|----------|
| Las notificaciones no se envían | Verificar que hay tokens en `fcm_tokens` |
| Error "Permission denied" | Verificar credenciales de Firebase Admin |
| Función falla con "Cannot read property" | Validar estructura de datos del jugador |
| Emulador no inicia | `firebase emulators:start --import=./data` |

## 📚 Documentación de referencia

- [Cloud Functions for Firebase - Get Started](https://firebase.google.com/docs/functions/get-started)
- [Cloud Firestore Triggers](https://firebase.google.com/docs/functions/firestore-events)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

---

**Próximos pasos:**
1. Guardar tokens FCM en la app móvil
2. Desplegar las Cloud Functions a producción
3. Probar el flujo completo de notificaciones
