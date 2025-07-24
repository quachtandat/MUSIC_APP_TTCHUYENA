import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  FlatList,
  TextInput
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";

const AddToPlaylistModal = ({ visible, onClose, onAddToPlaylist, playlists, onCreateNewPlaylist }) => {
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCreateNew, setShowCreateNew] = useState(false);

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      onCreateNewPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setShowCreateNew(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Chọn Playlist</Text>
          
          <FlatList
            data={playlists}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.playlistItem}
                onPress={() => onAddToPlaylist(item.id)}
              >
                <Text style={styles.playlistName}>{item.name}</Text>
              </TouchableOpacity>
            )}
            ListHeaderComponent={
              <TouchableOpacity 
                style={styles.createNewButton}
                onPress={() => setShowCreateNew(true)}
              >
                <Ionicons name="add-circle-outline" size={24} color="#dc6353" />
                <Text style={styles.createNewText}>Tạo playlist mới</Text>
              </TouchableOpacity>
            }
          />

          {showCreateNew && (
            <View style={styles.createNewContainer}>
              <TextInput
                style={styles.input}
                placeholder="Tên playlist mới"
                placeholderTextColor="#999"
                value={newPlaylistName}
                onChangeText={setNewPlaylistName}
              />
              <TouchableOpacity 
                style={styles.createButton}
                onPress={handleCreatePlaylist}
              >
                <Text style={styles.createButtonText}>Tạo</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  playlistItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  playlistName: {
    color: '#fff',
    fontSize: 16,
  },
  createNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  createNewText: {
    color: '#dc6353',
    fontSize: 16,
    marginLeft: 10,
  },
  createNewContainer: {
    marginTop: 10,
    padding: 10,
  },
  input: {
    backgroundColor: '#444',
    padding: 10,
    borderRadius: 5,
    color: '#fff',
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: '#dc6353',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#444',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AddToPlaylistModal;