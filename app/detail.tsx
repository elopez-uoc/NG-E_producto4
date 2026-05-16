import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useMemo, useEffect } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    Modal,
    ActivityIndicator
} from 'react-native';
import ImageZoom from 'react-native-image-zoom-viewer';
import { BasketballPlayer } from '../types/navigation';
import { db, requireImage } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function Detail() {
  const { item: itemString, playerId } = useLocalSearchParams();
  const [item, setItem] = useState<BasketballPlayer | null>(null);
  const [zoomVisible, setZoomVisible] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState<string | null>(null);
  const [loadingPlayer, setLoadingPlayer] = useState(true);

  useEffect(() => {
    if (itemString) {
      setItem(JSON.parse(itemString as string));
      setLoadingPlayer(false);
    } else if (playerId) {
      // Cargar desde Firestore si venimos de una notificación
      const fetchPlayer = async () => {
        try {
          const docRef = doc(db, 'jugadores', playerId as string);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setItem({ id: docSnap.id, ...docSnap.data() } as BasketballPlayer);
          }
        } catch (error) {
          console.error("Error al cargar jugador:", error);
        } finally {
          setLoadingPlayer(false);
        }
      };
      fetchPlayer();
    }
  }, [itemString, playerId]);

  const handlePlayPress = () => {
    if (!item) return;
    router.push({
      pathname: '/video',
      params: { item: JSON.stringify(item) }
    });
  };

  const imageSource = useMemo(() => {
    if (!item?.img) return null;
    
    // Usar el mapa estático de imágenes
    try {
      return requireImage(item.img);
    } catch (err) {
      console.error('Error cargando imagen:', err);
      return null;
    }
  }, [item?.img]);

  // Para ImageZoom, intentar crear una URL válida
  const imageData = useMemo(() => {
    if (!imageSource) return [];
    
    try {
      // Intentar usar Asset.fromModule para obtener una URI válida
      const Asset = require('expo-asset').Asset;
      const asset = Asset.fromModule(imageSource);
      return [{ url: asset.uri }];
    } catch (err) {
      // Como fallback, no mostrar zoom
      return [];
    }
  }, [imageSource]);

  if (loadingPlayer) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!item) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{item.nombre}</Text>
        <Text style={styles.subtitle}>{item.equipo} • {item.posicion}</Text>
      </View>

      {item.img && (
        <TouchableOpacity 
          onPress={() => imageData.length > 0 && setZoomVisible(true)}
          activeOpacity={0.9}
          style={styles.imageContainer}
          disabled={imageData.length === 0}
        >
          {imageSource ? (
            <>
              <Image
                source={imageSource}
                style={styles.playerImage}
                onLoadEnd={() => {
                  setImageLoading(false);
                  setImageError(null);
                }}
                onLoadStart={() => setImageLoading(true)}
                onError={(error) => {
                  console.error('Error cargando imagen:', error);
                  setImageError('Error al cargar la imagen');
                  setImageLoading(false);
                }}
              />
              {imageLoading && (
                <View style={styles.imageLoadingOverlay}>
                  <ActivityIndicator size="large" color="#3b82f6" />
                </View>
              )}
              {!imageLoading && !imageError && imageData.length > 0 && (
                <View style={styles.zoomHint}>
                  <Text style={styles.zoomHintText}>🔍 Toca para hacer zoom</Text>
                </View>
              )}
              {!imageLoading && !imageError && imageData.length === 0 && (
                <View style={styles.zoomHint}>
                  <Text style={styles.zoomHintText}>📷 Imagen cargada</Text>
                </View>
              )}
            </>
          ) : (
            <View style={[styles.playerImage, styles.imageErrorOverlay]}>
              <Text style={styles.imageErrorText}>❌ No se pudo cargar la imagen</Text>
              <Text style={styles.imageErrorDetails}>{item.img}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}

      <Modal visible={zoomVisible} transparent={true}>
        <ImageZoom
          imageUrls={imageData}
          onSwipeDown={() => setZoomVisible(false)}
          enableSwipeDown
          saveToLocalByLongPress={false}
        />
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => setZoomVisible(false)}
        >
          <Text style={styles.closeButtonText}>✕ Cerrar</Text>
        </TouchableOpacity>
      </Modal>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del Jugador</Text>
          <Text style={styles.infoText}>🏀 Equipo: {item.equipo}</Text>
          <Text style={styles.infoText}>📍 Posición: {item.posicion}</Text>
          <Text style={styles.infoText}>📏 Altura: {item.altura}</Text>
          <Text style={styles.infoText}>🎂 Edad: {item.edad} años</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas Principales</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{item.pPP}</Text>
              <Text style={styles.statLabel}>PPP</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{item.aPP}</Text>
              <Text style={styles.statLabel}>APP</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{item.rPP}</Text>
              <Text style={styles.statLabel}>RPP</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{item.porcentajeTiros}%</Text>
              <Text style={styles.statLabel}>FG%</Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={handlePlayPress}
          >
            <Text style={styles.playButtonText}>Ver Vídeo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  imageContainer: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  playerImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  imageLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  zoomHint: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  zoomHintText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  imageErrorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 16,
  },
  imageErrorText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  imageErrorDetails: {
    color: '#991b1b',
    fontSize: 10,
    marginTop: 8,
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  infoText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#9ca3af',
  },
  actions: {
    marginTop: 32,
  },
  playButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  playButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#6b7280',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
});