import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { auth, db } from '../../configs/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Ionicons } from "@expo/vector-icons";
const EditUser = ({ navigation }) => {
  const [fullName, setFullname] = useState('');
  const [email, setEmail] = useState('');
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setFullname(userSnap.data().fullName || '');
        }
      }
    };
    fetchUserData();
  }, []);

  const handleUpdateFullname = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { fullName });
      alert('Fullname updated!');
      navigation.goBack(); // Quay lại màn hình trước
    }
  };
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        setEmail(user.email); // Lấy email từ auth
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setFullname(userSnap.data().fullName || '');
        }
      }
    };
    fetchUserData();
  }, []);
  

  return (
    <View style={styles.container}>
        <View style={styles.topbar}>
         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={45} color="#fff" />
      </TouchableOpacity>
         <Text style={styles.title}>SOUNDIFY</Text>
        <TouchableOpacity >
        <Ionicons name="settings-outline" size={45} color="#fff" />
        </TouchableOpacity>
        </View>
        
     <Text style={styles.label}>Email</Text>
  <TextInput
    style={[styles.input, styles.disabledInput]}
    value={email}
    editable={false}
    placeholder="Email"
    placeholderTextColor="#aaa"
  />
      <Text style={styles.label}>FullName</Text>
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullname}
        placeholder="Enter your FullName"
        placeholderTextColor="#aaa"
      />
     
     
      <TouchableOpacity style={styles.button} onPress={handleUpdateFullname}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242424',
    justifyContent: 'center',
   
    padding: 20,
  },
  label: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
    fontFamily: 'Poppins',
  },
  topbar:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 80,
   
  },
  title: {
    fontSize: 40,
    fontFamily: "Poppins, sans-serif",
    fontWeight: 700,
    fontStyle : "normal",
    color: "#ffff",
    marginTop: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    fontFamily: 'Poppins',
  },
  button: {
    backgroundColor: '#dc6353',
    padding: 12,
    borderRadius: 10,
    
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontSize: 16,
  },
  disabledInput: {
    opacity: 0.5, // Mờ nhẹ
  },
});
