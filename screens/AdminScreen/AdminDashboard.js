
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, StyleSheet,ScrollView } from 'react-native';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../configs/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from "firebase/auth";
import { auth } from "../../configs/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import AddSongForm from '../../components/AddSongForm';
import UserManagement from '../../screens/UserManagement';

export default function AdminDashboard() {
  const [songs, setSongs] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newGener, setNewGener] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [editingId, setEditingId] = useState(null);
  const ADMIN_EMAIL = "admin@gmail.com";
  
  const [selectedTab, setSelectedTab] = useState('songs');

  
  
  // Fetch data
  const fetchData = async () => {
    const songSnapshot = await getDocs(collection(db, 'songs'));
    const userSnapshot = await getDocs(collection(db, 'users'));

    setSongs(songSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setUsers(userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add song
 
  
  // const handleAddSong = async () => {
  //   if (!newTitle || !newArtist) return;
  //   await addDoc(collection(db, 'songs'), {
  //     title: newTitle,
  //     artist: newArtist
  //   });
  //   setNewTitle('');
  //   setNewArtist('');
  //   fetchData();
    
  // };
  

  // Edit song
  
  const handleEditSong = async (id) => {
    const songRef = doc(db, 'songs', id );
    await updateDoc(songRef,
    {
      title: newTitle,
      artist: newArtist,
      gener: newGener,
      url: newUrl,
    });
    setEditingId(null);
    setNewTitle('');
    setNewArtist('');
    setNewGener('');
    setNewUrl('');
    fetchData();
  };
  

  // Delete song
  const handleDeleteSong = async (id) => {
    Alert.alert("Confirm", "Delete this song?", [
      { text: "Cancel" },
      { text: "Delete", onPress: async () => {
        await deleteDoc(doc(db, 'songs', id));
        fetchData();
      }}
    ]);
  };

  // Delete user
  // const handleDeleteUser = async (id) => {
  //   Alert.alert("Confirm", "Delete this user?", [
  //     { text: "Cancel" },
  //     { text: "Delete", onPress: async () => {
  //       await deleteDoc(doc(db, 'users', id));
  //       fetchData();
  //     }}
  //   ]);
  // };
  const navigation = useNavigation();
const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login"); 
      
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  return (
    <View style={styles.container}>
     
      {/* <Text style={styles.header}>🎵 Admin Dashboard</Text> */}
      <View style={styles.topBar}>
        <Text style={styles.title}>SOUNDIFY</Text>
        <TouchableOpacity onPress={() => navigation.navigate("LogoutConfirm")}>
        <Ionicons name="person-circle-outline" size={28} color="#fff" />
  </TouchableOpacity>
    
    </View>
    <Text style={styles.header}>AdminDashboard</Text>
    <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setSelectedTab('songs')}
        >
          <Ionicons name="musical-notes" size={20} 
          style={selectedTab === 'songs' ? styles.activeIcon : styles.menuText}    />
          <Text style={styles.menuText}>Songs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('UserManagement')}
        >
          <Ionicons name="people" size={20}   style={selectedTab === 'user' ? styles.activeIcon : styles.menuText}  />
          <Text style={styles.menuText}>Users</Text>
        </TouchableOpacity>
       
      </View>
      
      {/* Add song */}
      <AddSongForm  editingId={editingId}
  newTitle={newTitle}
  setNewTitle={setNewTitle}
  newArtist={newArtist}
  setNewArtist={setNewArtist}
  newGener={newGener}
  setNewGener={setNewGener}
  newUrl={newUrl}
  setNewUrl={setNewUrl}
  onEditDone={() => {
    setEditingId(null);
    setNewTitle('');
    setNewArtist('');
    setNewGener('');
    fetchData(); // gọi lại danh sách sau khi chỉnh
  }}/>

      {/* Song List */}
      <Text style={styles.subHeader}>Songs</Text>
      <FlatList
        data={songs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemBox}>
            <Text style={styles.itemText}>{item.title}-{item.artist}-{item.gener}</Text>
            <View style={styles.row}>
              <TouchableOpacity onPress={() => {
                setEditingId(item.id);
                setNewTitle(item.title);
                setNewArtist(item.artist);
                setNewGener(item.gener);
                setNewUrl(item.url);
                
              }}>
                <Ionicons name="create-outline" size={20} color="#ffb400" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteSong(item.id)} style={{ marginLeft: 10 }}>
                <Ionicons name="trash-outline" size={20} color="#dc6353" />
              </TouchableOpacity>
            </View>
            
          </View>
          
        )}
      />     
      {editingId && (
        <TouchableOpacity style={styles.button} onPress={() => handleEditSong(editingId)}>
          <Text style={styles.buttonText}>Save Edit</Text>
        </TouchableOpacity>
      )}
     
      {/* Users */}
      {/* <Text style={styles.subHeader}>Users</Text>
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemBox}>
            <Text style={styles.itemText}>{item.fullName} - {item.email}</Text>
            <TouchableOpacity onPress={() => handleDeleteUser(item.id)}>
              <Ionicons name="trash-outline" size={20} color="#dc6353" />
            </TouchableOpacity>
          </View>
        )}
      /> */}
       {/* <TouchableOpacity style={styles.buttonuser} onPress={() => navigation.navigate('UserManagement')}>
          <Text style={styles.buttonText}>User</Text>
        </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242424",
    padding: 16
  },
  header: {
    fontSize: 24,
    fontFamily: "Poppins",
    color: "#fff",
    marginBottom: 20,
    marginLeft: 90
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins, sans-serif",
    fontWeight: 700,
    fontStyle : "normal",
    color: "#ffff",
    marginTop: 8
  },
  subHeader: {
    fontSize: 18,
    color: "#fff",
    marginTop: 12,
    marginBottom: 8,
    fontWeight: "bold"
  },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10
  },
  button: {
    backgroundColor: "#dc6353",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10
  },
  buttonuser: {
    backgroundColor: "#dc6353",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  
  itemBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20
  },
  itemText: {
    color: "#fff"
  },
  row: {
    flexDirection: "row"
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 4,
    backgroundColor: '#333',
  },
  menuItem: {
    alignItems: 'center',
  
  },
  menuText: {
    color: '#fff',
    marginTop: 2,
    fontSize: 14,
  },
  activeMenuText: {
    color: '#dc6353',
    fontWeight: 'bold',
  },
  activeIcon: {
    color: '#dc6353',
  },
});
