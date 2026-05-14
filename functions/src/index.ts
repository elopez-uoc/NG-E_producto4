import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();
const db = admin.firestore();

export const enviarNotificacionCuandoSeActualiceJugador = functions.region('europe-west1').firestore
  .document('jugadores/{playerId}')
  .onWrite(async (change, context) => {
    const beforeData = change.before.exists ? change.before.data() : null;
    const afterData = change.after.exists ? change.after.data() : null;

    let title = 'Actualización en jugadores';
    let body = 'Se ha producido un cambio en la colección de jugadores.';

    if (!beforeData && afterData) {
      title = 'Nuevo jugador añadido';
      body = `Se ha añadido ${afterData.nombre ?? 'un jugador'} al ranking.`;
    } else if (beforeData && afterData) {
      title = `${afterData.nombre ?? 'Jugador'} actualizado`;
      body = `${afterData.nombre ?? 'El jugador'} ha sido actualizado.`;

      if (beforeData.pPP !== afterData.pPP) {
        body = `${afterData.nombre ?? 'El jugador'} ahora tiene ${afterData.pPP ?? '0'} PPP.`;
      }
    } else if (beforeData && !afterData) {
      title = 'Jugador eliminado';
      body = `${beforeData.nombre ?? 'Un jugador'} fue eliminado del ranking.`;
    }

    const tokensSnapshot = await db.collection('fcm_tokens').get();
    const tokens = tokensSnapshot.docs
      .map((doc) => doc.data().token)
      .filter((token): token is string => typeof token === 'string');

    if (tokens.length === 0) {
      functions.logger.info('No se encontró ningún token FCM. No se envía notificación.');
      return null;
    }

    const message: admin.messaging.MulticastMessage = {
      notification: {
        title,
        body,
      },
      tokens,
      data: {
        playerId: context.params.playerId,
      },
    };

    const response = await admin.messaging().sendMulticast(message);

    const failedTokens: string[] = [];
    response.responses.forEach((resp, index) => {
      if (!resp.success) {
        failedTokens.push(tokens[index]);
      }
    });

    if (failedTokens.length > 0) {
      functions.logger.warn('Tokens inválidos detectados, borrando de Firestore:', failedTokens);
      await Promise.all(
        failedTokens.map(async (token) => {
          const querySnapshot = await db.collection('fcm_tokens').where('token', '==', token).get();
          await Promise.all(querySnapshot.docs.map((doc) => doc.ref.delete()));
        })
      );
    }

    return null;
  });
