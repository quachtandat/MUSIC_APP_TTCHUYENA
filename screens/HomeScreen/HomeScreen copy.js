import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView,StyleSheet } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../configs/firebaseConfig";
import { Ionicons } from '@expo/vector-icons';
import { signOut } from "firebase/auth";
import { auth } from "../../configs/firebaseConfig";
import { useNavigation } from "@react-navigation/native";

import { Audio } from "expo-av";



const HomeScreen = () => {
  const [songs, setSongs] = useState([]);
  useEffect(() => {
    const fetchSongs = async () => {
      const snapshot = await getDocs(collection(db, "songs"));
      const songList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSongs(songList);
    };

    fetchSongs();
  }, []);

  const playSong = async (url) => {
    const { sound } = await Audio.Sound.createAsync({uri: url });
    await sound.playAsync();
    
  };

  useEffect(() => {
  Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    staysActiveInBackground: true,
    playsInSilentModeIOS: true, 
  });
}, []);
  const navigation = useNavigation();

  return (
    <ScrollView style={{ backgroundColor: "#242424", padding: 20 }}>
        
     <View style={styles.topBar}>
              <Text style={styles.title}>SOUNDIFY</Text>
             <TouchableOpacity onPress={() => navigation.navigate("LogoutConfirm")}>
             <Ionicons name="person-circle-outline" size={28} color="#fff" />
       </TouchableOpacity>
         </View>
         <Text style={{
            fontSize: 24,
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
            fontStyle : "normal",
              color: "#fff",
              marginBottom: 16

             }}>All Songs </Text>
      {songs.map((song) => (
        <View key={song.id} style={{ marginVertical: 10 }}>
          <Text style={{ color: "#fff" }}>{song.title} - {song.artist}</Text>
          <TouchableOpacity onPress={() => playSong(song.url,song.id)}>
            <Text style={{ color: " #dc6353" }}>Play</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
    title: {
        fontSize: 28,
        fontFamily: "Poppins, sans-serif",
        fontWeight: 700,
        fontStyle : "normal",
        color: "#ffff",
        marginTop: 12
      },
    topBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
      },
})
export default HomeScreen;
