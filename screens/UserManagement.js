import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet,TouchableOpacity,Alert} from 'react-native';
import { collection, getDocs, doc,updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../configs/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
const UserManagement = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [selectedTab, setSelectedTab] = useState('users');

const fetchData = async () => {
   
  const querySnapshot = await getDocs(collection(db, 'users'));
  const usersData = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  setUsers(usersData);
};
  useEffect(() => {
    fetchData();
  }, []);
  
  // Delete user
    const handleDeleteUser = async (id) => {
      Alert.alert("Confirm", "Delete this user?", [
        { text: "Cancel" },
        { text: "Delete", onPress: async () => {
          await deleteDoc(doc(db, 'users', id));
          fetchData();
        }}
      ]);
    };
     //  Cấm người dùng
  const handleBanUser = async (UserId) => {
  Alert.alert(
    "Xác nhận",
    "Bạn có chắc cấm người dùng này?",
    [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Cấm",
        onPress: async () => {
          const userRef = doc(db, "users", UserId);
          try {
            await updateDoc(userRef, { banned: true });
            await fetchData();
            alert("Đã cấm người dùng.");
          } catch (error) {
            console.error("Lỗi khi cấm người dùng:", error);
          }
        },
        style: "destructive"
      }
    ]
  );
  };
  // Mở cấm người dùng
  const handleUnbanUser = async (UserId) => {
  Alert.alert(
    "Xác nhận",
    "Bạn có chắc muốn mở khóa người dùng này?",
    [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Mở khóa",
        onPress: async () => {
          const userRef = doc(db, "users", UserId);
          try {
            await updateDoc(userRef, { banned: false });
            await fetchData();
            alert("Đã mở khóa người dùng.");
          } catch (error) {
            console.error("Lỗi khi mở khóa người dùng:", error);
          }
        },
        style: "default"
      }
    ]
  );

  };

  return (
    <View style={styles.container}>
      <View style={styles.topbar}>
      {/* <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity> */}
     
     <Text style={styles.title}>SOUNDIFY</Text>
     </View>
     <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="musical-notes" size={20}  
          style={selectedTab === 'songs' ? styles.activeIcon : styles.menuText} />
          <Text style={styles.menuText}>Songs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('UserManagement')}
        >
          <Ionicons name="people" size={20} style={selectedTab === 'users' ? styles.activeIcon : styles.menuText}  />
          <Text style={styles.menuText}>Users</Text>
        </TouchableOpacity>
      </View>
     <Text style={styles.titleuser}>Users</Text>
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemBox}>
            <Text style={styles.itemText}>{item.fullName}-{item.email}</Text>
             <View style={styles.row}>
           
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                item.banned
                  ? handleUnbanUser(item.id)
                  : handleBanUser(item.id)
              }
            >
              <Text style={{ color: "#ff5c5c"
               }}>
                {item.banned ? "🚫" : "⭕"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteUser(item.id)}>
              <Ionicons name="trash-outline" size={18} color="#dc6353" />
            </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default UserManagement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242424',
    padding: 25,
    
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins, sans-serif",
    fontWeight: 700,
    fontStyle : "normal",
    color: "#ffff",
    marginRight: 100
  },
  titleuser: {
    fontSize: 18,
    color: "#fff",
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 140,
    fontWeight: "bold",
    
  },
  itemBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#333",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,

  },
  itemText: {
    color: "#fff"
  },
  row: {
    flexDirection: "row"
  },
  topbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
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