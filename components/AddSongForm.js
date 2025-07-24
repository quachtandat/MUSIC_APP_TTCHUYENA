import React, { useState,useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet,TouchableOpacity } from "react-native";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { db } from "../configs/firebaseConfig";

const AddSongForm = ({
  editingId,
  newTitle,
  setNewTitle,
  newArtist,
  setNewArtist,
  newGener,
  setNewGener,
  newUrl,
  setNewUrl,
  onEditDone
}) => {
  const handleSave = async () => {
    if (!newTitle || !newArtist || !newGener || !newUrl) return;

    if (editingId) {
      // 👉 Nếu có ID => đang chỉnh sửa
      const songRef = doc(db, 'songs', editingId);
      await updateDoc(songRef, {
        title: newTitle,
        artist: newArtist,
        gener: newGener,
        url: newUrl,

      });
    } else {
      // 👉 Nếu không có ID => thêm mới
      await addDoc(collection(db, 'songs'), {
        title: newTitle,
        artist: newArtist,
        gener: newGener,
        url: newUrl,
      });
    }

    onEditDone(); // reset form & gọi lại dữ liệu
  };

  return (
<View style={styles.container}>
<TextInput
  style={styles.input}
  placeholder="Tên bài hát"
  value={newTitle}
  onChangeText={setNewTitle}
  placeholderTextColor="#aaa"
/>

<TextInput
  style={styles.input}
  placeholder="Tác giả"
  value={newArtist}
  onChangeText={setNewArtist}
  placeholderTextColor="#aaa"
/>
<TextInput
  style={styles.input}
  placeholder="Thể Loại"
  value={newGener}
  onChangeText={setNewGener}
  placeholderTextColor="#aaa"
/>
<TextInput
  style={styles.input}
  placeholder="Thể Loại"
  value={newUrl}
  onChangeText={setNewUrl}
  placeholderTextColor="#aaa"
/>

<TouchableOpacity style={styles.button} onPress={handleSave}>
  <Text style={styles.buttonText}>{editingId ? 'Update' : 'Add Song'}</Text>
</TouchableOpacity>
</View>
);
};

const styles = StyleSheet.create({
container: {
padding: 12,
backgroundColor: '#333',
borderRadius: 12,
marginVertical: 10,
},
input: {
backgroundColor: '#444',
color: '#fff',
fontSize: 16,
padding: 10,
borderRadius: 10,
marginBottom: 10,
},
button: {
backgroundColor: '#dc6353',
padding: 12,
borderRadius: 10,
alignItems: 'center',
},
buttonText: {
color: '#fff',
fontWeight: 'bold'
}
});

export default AddSongForm;
