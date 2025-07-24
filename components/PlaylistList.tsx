import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../configs/firebaseConfig';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface Song {
  id: string;
  title: string;
  artist: string;
  gener: string;
  image: string;
  url: string;
}

const PlaylistList = () => {
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchPlaylistSongs();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const fetchPlaylistSongs = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'playlist'));
      const songs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Song[];
      setPlaylistSongs(songs);
    } catch (error) {
      console.error('Error fetching playlist songs:', error);
    }
  };

  const handleRemoveFromPlaylist = async (songId: string) => {
    try {
      await deleteDoc(doc(db, 'playlist', songId));
      fetchPlaylistSongs();
    } catch (error) {
      console.error('Error removing song from playlist:', error);
    }
  };

  const playSong = async (song: Song) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: song.url },
        { shouldPlay: true }
      );
      setSound(newSound);
      setCurrentSong(song);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Error playing song:', error);
    }
  };

  const renderSongItem = ({ item }: { item: Song }) => (
    <TouchableOpacity 
      style={styles.songItem}
      onPress={() => playSong(item)}
    >
      <Image source={{ uri: item.image }} style={styles.songImage} />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.songArtist}>{item.artist}</Text>
        <Text style={styles.songGener}>Thể loại: {item.gener || 'Unknown Genre'}</Text>
      </View>
      <View style={styles.controls}>
        {currentSong?.id === item.id && (
          <Ionicons 
            name={isPlaying ? 'pause-circle' : 'play-circle'} 
            size={32} 
            color="#dc6353" 
          />
        )}
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFromPlaylist(item.id)}
        >
          <Ionicons name="trash-outline" size={24} color="#dc6353" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Playlist của bạn</Text>
        <Text style={styles.songCount}>{playlistSongs.length} bài hát</Text>
      </View>

      {playlistSongs.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="musical-notes-outline" size={64} color="#666" />
          <Text style={styles.emptyStateText}>Playlist của bạn đang trống</Text>
          <Text style={styles.emptyStateSubText}>Thêm bài hát từ trang chủ để bắt đầu</Text>
        </View>
      ) : (
        <FlatList
          data={playlistSongs}
          renderItem={renderSongItem}
          keyExtractor={item => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
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
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins, sans-serif',
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  songCount: {
    fontSize: 14,
    color: '#888',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 20,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  songImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    color: '#dc6353',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  songArtist: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 2,
  },
  songGener: {
    color: '#888',
    fontSize: 12,
    fontStyle: 'italic',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  removeButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default PlaylistList;
