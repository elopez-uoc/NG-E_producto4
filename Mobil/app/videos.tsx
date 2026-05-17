import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { BasketballPlayer } from '../types/navigation';

export default function Videos() {
  const [players, setPlayers] = useState<BasketballPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      const q = query(collection(db, 'jugadores'), orderBy('pPP', 'desc'));
      const querySnapshot = await getDocs(q);
      const playersData: BasketballPlayer[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        playersData.push({
          id: doc.id,
          nombre: data.nombre || '',
          equipo: data.equipo || '',
          posicion: data.posicion || '',
          altura: data.altura || '',
          edad: data.edad || 0,
          pPP: data.pPP || 0,
          aPP: data.aPP || 0,
          rPP: data.rPP || 0,
          porcentajeTiros: data.porcentajeTiros || 0,
          img: data.img,
          videoUrl: data.videoUrl,
        });
      });

      setPlayers(playersData);
    } catch (error) {
      console.error('Error loading players:', error);
      Alert.alert('Error', 'No se pudieron cargar los jugadores');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerPress = (player: BasketballPlayer) => {
    router.push({
      pathname: '/video',
      params: { item: JSON.stringify(player) }
    });
  };

  const renderItem = ({ item }: { item: BasketballPlayer }) => {
    if (!item.videoUrl) return null; // Solo mostrar jugadores con video

    return (
      <TouchableOpacity
        style={styles.playerCard}
        onPress={() => handlePlayerPress(item)}
      >
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{item.nombre}</Text>
          <Text style={styles.playerTeam}>{item.equipo} • {item.posicion}</Text>
          <Text style={styles.playerStats}>📊 {item.pPP} PPP</Text>
        </View>
        <View style={styles.videoIndicator}>
          <Text style={styles.videoIcon}>🎥</Text>
          <Text style={styles.videoText}>Ver Video</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Cargando videos...</Text>
      </View>
    );
  }

  const playersWithVideos = players.filter(player => player.videoUrl);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎥 Videos de Jugadores</Text>
        <Text style={styles.headerSubtitle}>
          {playersWithVideos.length} jugadores con video disponible
        </Text>
      </View>

      {playersWithVideos.length > 0 ? (
        <FlatList
          data={playersWithVideos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🎥</Text>
          <Text style={styles.emptyTitle}>No hay videos disponibles</Text>
          <Text style={styles.emptyText}>
            Los jugadores necesitan tener una URL de video en Firestore
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  listContainer: {
    padding: 20,
  },
  playerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  playerTeam: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  playerStats: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
  },
  videoIndicator: {
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  videoIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  videoText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});