import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();
const db = admin.firestore();

export const enviarNotificacionCuandoSeActualiceJugador = functions.region('europe-west1')
  .firestore
  .document('jugadores/{playerId}')
  .onWrite(async (change, context) => {
    const beforeData = change.before.exists ? change.before.data() : null as any;
    const afterData = change.after.exists ? change.after.data() : null as any;

    let title = 'Actualización en jugadores';
    let body = 'Se ha producido un cambio en la colección de jugadores.';

    if (!change.before.exists && change.after.exists) {
      title = 'Nuevo jugador añadido';
      body = `Se ha añadido ${afterData.nombre ?? 'un jugador'} al ranking.`;
    } else if (beforeData && afterData) {
      title = `${afterData.nombre ?? 'Jugador'} actualizado`;
      body = `${afterData.nombre ?? 'El jugador'} ha sido actualizado.`;

      if (beforeData.pPP !== afterData.pPP) {
        body = `${afterData.nombre ?? 'El jugador'} ahora tiene ${afterData.pPP ?? '0'} PPP.`;
      }
    } else if (change.before.exists && !change.after.exists) {
      title = 'Jugador eliminado';
      body = `${beforeData.nombre ?? 'Un jugador'} fue eliminado del ranking.`;
    }

    // Importación dinámica obligatoria para módulos ESM en entornos CommonJS con Node16
    const { Expo } = await import('expo-server-sdk');
    const expo = new Expo();

    const tokensSnapshot = await db.collection('fcm_tokens').get();
    const pushTokens = Array.from(new Set(tokensSnapshot.docs
      .map((doc) => doc.data().token)
      .filter((token): token is string => typeof token === 'string' && Expo.isExpoPushToken(token))));

    if (pushTokens.length === 0) {
      functions.logger.info('No se encontró ningún token FCM. No se envía notificación.');
      return null;
    }

    // Construir mensajes para Expo
    const messages = pushTokens.map(token => ({
      to: token,
      sound: 'default',
      title,
      body,
      data: { playerId: context.params.playerId },
    }));

    // Dividir en grupos (chunks) según requiere Expo y enviar
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];
    
    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        functions.logger.error('Error enviando a Expo:', error);
      }
    }

    // Opcional: Manejar tickets fallidos (tokens antiguos)
    tickets.forEach((ticket, index) => {
      if (ticket.status === 'error' && ticket.details?.error === 'DeviceNotRegistered') {
        const invalidToken = pushTokens[index];
        functions.logger.warn('Borrando token inválido:', invalidToken);
        db.collection('fcm_tokens').doc(invalidToken).delete();
      }
    });

    return null;
  });
