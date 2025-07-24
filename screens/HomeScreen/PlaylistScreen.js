import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { collection, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../configs/firebaseConfig';
import { useNavigation } from "@react-navigation/native";

const PlaylistScreen = () => {
  const [playlists, setPlaylists] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const playlistsRef = collection(db, `users/${user.uid}/playlists`);
      const unsubscribe = onSnapshot(playlistsRef, (snapshot) => {
        const playlistData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPlaylists(playlistData);
      });
      return () => unsubscribe();
    }
  }, []);

  const renderPlaylistItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.playlistItem}
      onPress={() => navigation.navigate('PlaylistDetail', { playlist: item })}
    >
      <View style={styles.playlistContent}>
        <View style={styles.playlistIcon}>
          <Ionicons name="musical-notes" size={30} color="#dc6353" />
        </View>
        <View style={styles.playlistInfo}>
          <Text style={styles.playlistName}>{item.name}</Text>
          <Text style={styles.songCount}>
            {item.songs?.length || 0} bài hát
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {playlists.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="musical-notes" size={50} color="#666" />
          <Text style={styles.emptyText}>Chưa có playlist nào</Text>
        </View>
      ) : (
        <FlatList
          data={playlists}
          renderItem={renderPlaylistItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242424',
  },
  listContainer: {
    padding: 16,
  },
  playlistItem: {
    backgroundColor: '#333',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  playlistContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  playlistIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#242424',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  songCount: {
    color: '#888',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    marginTop: 16,
  }
});

export default PlaylistScreen;