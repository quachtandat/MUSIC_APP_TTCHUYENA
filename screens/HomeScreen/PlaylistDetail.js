import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../configs/firebaseConfig';
import { useNavigation } from "@react-navigation/native";

const PlaylistDetail = ({ route }) => {
  const { playlist } = route.params;
  const navigation = useNavigation();

  const handleRemoveSong = async (songToRemove) => {
    Alert.alert(
      "Xóa bài hát",
      `Xóa "${songToRemove.title}" khỏi playlist?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            const user = auth.currentUser;
            if (user) {
              try {
                const playlistRef = doc(db, `users/${user.uid}/playlists/${playlist.id}`);
                const updatedSongs = playlist.songs.filter(song => song.id !== songToRemove.id);
                await updateDoc(playlistRef, { songs: updatedSongs });
              } catch (error) {
                console.error("Error removing song:", error);
                Alert.alert("Lỗi", "Không thể xóa bài hát. Vui lòng thử lại!");
              }
            }
          }
        }
      ]
    );
  };

  const handlePlaySong = (song) => {
    navigation.navigate('SongScreen', { song });
  };

  const renderSongItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.songItem}
      onPress={() => handlePlaySong(item)}
    >
      <Image source={{ uri: item.image }} style={styles.songImage} />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.songArtist}>{item.artist}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveSong(item)}
      >
        <Ionicons name="remove-circle-outline" size={24} color="#dc6353" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.playlistName}>{playlist.name}</Text>
      </View>
      {playlist.songs?.length > 0 ? (
        <FlatList
          data={playlist.songs}
          renderItem={renderSongItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="musical-notes" size={50} color="#666" />
          <Text style={styles.emptyText}>Chưa có bài hát nào</Text>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    marginRight: 16,
  },
  playlistName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  songImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  songArtist: {
    color: '#888',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    padding: 8,
    marginRight: 8,
  },
  removeButton: {
    padding: 8,
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
  },
  nowPlayingIndicator: {
    color: '#dc6353',
    fontSize: 12,
    marginTop: 4,
  }
});

export default PlaylistDetail;