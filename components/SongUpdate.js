
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../configs/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../configs/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const SongUpdateScreen = ({ route, navigation }) => {
  const { songId } = route.params;

  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    const fetchSong = async () => {
      const docRef = doc(db, 'songs', songId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title);
        setArtist(data.artist);
        setImage(data.image || '');
      }
    };
    fetchSong();
  }, [songId]);

  const pickImageAndUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();
      const filename = result.assets[0].uri.substring(result.assets[0].uri.lastIndexOf('/') + 1);
      const imageRef = ref(storage, `images/${filename}`);
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);
      setImage(downloadURL);
    }
  };

  const handleUpdate = async () => {
    const songRef = doc(db, 'songs', songId);
    await updateDoc(songRef, {
      title,
      artist,
      image,
    });
    navigation.goBack(); // quay lại trang trước
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tên bài hát</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Tác giả</Text>
      <TextInput style={styles.input} value={artist} onChangeText={setArtist} />

      <TouchableOpacity onPress={pickImageAndUpload} style={styles.imagePicker}>
        {image ? <Image source={{ uri: image }} style={styles.image} /> : <Text style={styles.imageText}>Chọn ảnh</Text>}
      </TouchableOpacity>

      <Button title="Cập nhật bài hát" onPress={handleUpdate} />
    </View>
  );
};

export default SongUpdateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242424',
    padding: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
  imagePicker: {
    backgroundColor: '#444',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imageText: {
    color: '#fff',
  },
});
