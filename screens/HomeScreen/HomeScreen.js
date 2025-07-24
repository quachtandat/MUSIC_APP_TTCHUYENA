// HomeScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CustomBottomNavigationBar from "../../components/CustomBottomNavigationBar";
import { TextInput, FlatList, } from "react-native";
import { collection, getDoc, doc, getDocs, onSnapshot, addDoc, updateDoc } from "firebase/firestore";
import { db } from "../../configs/firebaseConfig";
import { Audio } from "expo-av";
import PlaylistScreen from "./PlaylistScreen";
import { auth } from "../../configs/firebaseConfig";
import AddToPlaylistModal from '../../components/AddToPlaylistModal';

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState("Song");
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [songs, setSongs] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [userPlaylists, setUserPlaylists] = useState([]);

//check user
useEffect(() => {
  const checkIfUserIsBanned = async () => {
    const user = auth.currentUser;

    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists() && userSnap.data().banned === true) {
          showBannedAlert(); // Tách alert thành hàm riêng
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái bị cấm:", error);
      }
    }
  };

  checkIfUserIsBanned();

  const showBannedAlert = () => {
    Alert.alert(
      "Tài khoản bị cấm",
      "Bạn đã bị cấm do vi phạm nguyên tắc của chúng tôi.",
      [
        {
          text: "Help",
          onPress: () => {
            Alert.alert(
              "Thông báo",
              "Bạn đã bị khóa tài khoản 5 ngày vì vi phạm chính sách bình luận của chúng tôi.",
              [
                {
                  text: "OK",
                  onPress: () => {
                    // Sau khi đóng Alert phụ, mở lại alert chính
                    setTimeout(() => {
                      showBannedAlert();
                    }, 300); 
                  }
                }
              ]
            );
          },
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => navigation.navigate("LoginScreen"),
        },
      ]
    );
  };
  
},
 []);

useEffect(() => {
  const user = auth.currentUser;
  if (user) {
    const playlistsRef = collection(db, `users/${user.uid}/playlists`);
    const unsubscribe = onSnapshot(playlistsRef, (snapshot) => {
      const playlists = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUserPlaylists(playlists);
    });
    return () => unsubscribe();
  }
}, []);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        // Sử dụng onSnapshot để lắng nghe thay đổi
        const unsubscribe = onSnapshot(collection(db, "songs"), (snapshot) => {
          const songList = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              title: data.title,
              artist: data.artist,
              url: data.url,
              image: data.image,
              gener: data.gener,
              r1: data.r1 || 0,
              r2: data.r2 || 0,
              r3: data.r3 || 0,
              r4: data.r4 || 0,
              r5: data.r5 || 0,
            };
          });
          console.log("Songs data updated:", songList); // Debug log
          setSongs(songList);
        });

        // Cleanup listener khi component unmount
        return () => unsubscribe();
      } catch (error) {
        console.error("Lỗi khi tải bài hát từ Firebase:", error);
      }
    };

    fetchSongs();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    const lowerText = text.toLowerCase();
  
    const filteredResults = songs.filter((song) => {
      const title = song.title?.toLowerCase() || '';
      const artist = song.artist?.toLowerCase() || '';
      const gener = song.gener?.toLowerCase() || '';
      return (
        title.includes(lowerText) ||
        artist.includes(lowerText) ||
        gener.includes(lowerText)
      );
    });
  
    setSearchResults(filteredResults);
  };
  

  const handleAddToPlaylist = (song) => {
    setSelectedSong(song);
    setModalVisible(true);
  };

  const handleCreateNewPlaylist = async (playlistName) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const playlistsRef = collection(db, `users/${user.uid}/playlists`);
        await addDoc(playlistsRef, {
          name: playlistName,
          songs: [],
          createdAt: new Date(),
        });
      } catch (error) {
        console.error("Error creating playlist:", error);
        alert("Không thể tạo playlist. Vui lòng thử lại!");
      }
    }
  };

  const handleAddSongToPlaylist = async (playlistId) => {
    if (!selectedSong) return;

    const user = auth.currentUser;
    if (user) {
      try {
        const playlistRef = doc(db, `users/${user.uid}/playlists/${playlistId}`);
        const playlistDoc = await getDoc(playlistRef);
        
        if (playlistDoc.exists()) {
          const currentSongs = playlistDoc.data().songs || [];
          if (!currentSongs.find(s => s.id === selectedSong.id)) {
            await updateDoc(playlistRef, {
              songs: [...currentSongs, selectedSong]
            });
            
            // Thêm thông báo tự động tắt
            Alert.alert(
              "Thành công",
              `Đã thêm "${selectedSong.title}" vào playlist!`,
              [],
              { 
                cancelable: true,
                timeout: 2000 // Tự động đóng sau 2 giây
              }
            );

            // Đóng modal sau khi hiện thông báo
            setTimeout(() => {
              setModalVisible(false);
              setSelectedSong(null);
            }, 2000);

          } else {
            Alert.alert(
              "Lưu ý",
              "Bài hát đã có trong playlist!",
              [{ text: "OK" }],
              { cancelable: true }
            );
            setModalVisible(false);
            setSelectedSong(null);
          }
        }
      } catch (error) {
        console.error("Error adding song to playlist:", error);
        Alert.alert(
          "Lỗi",
          "Không thể thêm bài hát. Vui lòng thử lại!",
          [{ text: "OK" }]
        );
      }
    }
  };

  const renderSongItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.songItem}
      onPress={() => navigation.navigate('SongScreen', { song: item })}
    >
      <Image source={{ uri: item.image }} style={styles.songImage} />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.songArtist}>{item.artist}</Text>
        <Text style={styles.songGener}>Thể loại: {item.gener || 'Unknown Genre'}</Text>
      </View>
      <View style={styles.rightContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddToPlaylist(item)}
        >
          <Ionicons name="add-circle-outline" size={24} color="#dc6353" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Hàm tính rating trung bình
  const calculateAverageRating = (song) => {
    const r1 = song.r1 || 0;
    const r2 = song.r2 || 0;
    const r3 = song.r3 || 0;
    const r4 = song.r4 || 0;
    const r5 = song.r5 || 0;
    const totalRatings = r1+r2+r3+r4+r5;
    
    const weightedSum = (r1 * 1) + (r2 * 2) + (r3 * 3) + (r4 * 4) + (r5 * 5);
    return weightedSum / totalRatings;
  };

  const renderRankingItem = ({ item, index }) => {
    const rating = calculateAverageRating(item);
    const getRankColor = (index) => {
      switch(index) {
        case 0: return '#FFD700'; // Gold
        case 1: return '#C0C0C0'; // Silver
        case 2: return '#CD7F32'; // Bronze
        default: return '#dc6353';
      }
    };

    return (
      <TouchableOpacity 
        style={styles.rankingItem}
        onPress={() => navigation.navigate('SongScreen', { song: item })}
      >
        <View style={[styles.rankContainer, { backgroundColor: getRankColor(index) }]}>
          <Text style={styles.rankText}>#{index + 1}</Text>
        </View>
        <Image source={{ uri: item.image }} style={styles.rankingImage} />
        <View style={styles.rankingInfo}>
          <Text style={styles.rankingTitle}>{item.title}</Text>
          <Text style={styles.rankingArtist}>{item.artist}</Text>
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= Math.round(rating) ? 'heart' : 'heart-outline'}
                  size={16}
                  color="#e74c3c"
                  style={styles.starIcon}
                />
              ))}
            </View>
            <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Song":
        return (
          <FlatList
            data={songs}
            renderItem={renderSongItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
          />
        );
      case "Search":
        return (
          <View style={styles.searchContainer}>
            <View style={styles.searchBarContainer}>
              <TextInput
                style={styles.searchBar}
                placeholder="Tìm kiếm bài hát, nghệ sĩ..."
                placeholderTextColor="#aaa"
                value={searchText}
                onChangeText={handleSearch}
              />
              <TouchableOpacity style={styles.searchIcon}>
                <Ionicons name="search" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={searchText ? searchResults : []}
              renderItem={renderSongItem}
              keyExtractor={(item) => item.id}
              style={styles.list}
              ListEmptyComponent={() =>
                searchText ? (
                  <Text style={styles.emptySearchText}>
                    Không tìm thấy kết quả nào.
                  </Text>
                ) : null
              }
            />
          </View>
        );
      case "Ranking":
        const sortedSongs = [...songs].sort((a, b) => {
          const ratingA = calculateAverageRating(a);
          const ratingB = calculateAverageRating(b);
          return ratingB - ratingA;
        });
        return (
          <View style={styles.rankingContainer}>
            <View style={styles.rankingHeader}>
              <Ionicons name="trophy" size={24} color="#FFD700" />
              <Text style={styles.rankingHeaderText}>Bảng xếp hạng</Text>
            </View>
            <FlatList
              data={sortedSongs}
              renderItem={renderRankingItem}
              keyExtractor={(item) => item.id}
              style={styles.rankingList}
              contentContainerStyle={styles.rankingListContent}
            />
          </View>
        );
      case "Playlist":
        return <PlaylistScreen />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.topBar}>
          <Text style={styles.title}>SOUNDIFY</Text>
          <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)}>
            <Ionicons name="person-circle-outline" size={28} color="#fff" />
          </TouchableOpacity>
          {showDropdown && (
            <View style={styles.dropdownMenu}>
              <TouchableOpacity onPress={() => navigation.navigate("LogoutConfirm")}
                style={{ 
                  flexDirection:'row',
                  justifyContent:'flex-end',
                  padding: 6 }}
              >
                <Text style={styles.dropdownItem}>Logout</Text>
                <Ionicons name="log-out-outline" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Edit")} 
                style={{ 
                  flexDirection:'row',
                  justifyContent:'flex-end',
                  padding:6 }}>
                <Text style={styles.dropdownItem}>Edit</Text>
                <Ionicons name="settings-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <Text style={styles.pageTitle}>
          {activeTab === "Song"
            ? "All Songs"
            : activeTab === "Search"
            ? "Search"
            : activeTab === "Ranking"
            ? "Bảng xếp hạng"
            : "Playlist"}
        </Text>
      </View>
      <View style={styles.content}>{renderContent()}</View>
      <CustomBottomNavigationBar
        onTabChange={setActiveTab}
        activeTab={activeTab}
      />
      <AddToPlaylistModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddToPlaylist={handleAddSongToPlaylist}
        playlists={userPlaylists}
        onCreateNewPlaylist={handleCreateNewPlaylist}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242424",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 16,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins, sans-serif",
    fontWeight: "700",
    color: "#fff",
    marginTop: 12,
  },
  pageTitle: {
    fontSize: 24,
    fontFamily: "Poppins, sans-serif",
    fontWeight: "600",
    color: "#fff",
    marginBottom: 16,
  },
  content: {
    flex: 1,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  songImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  songInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  songTitle: {
    color: "#dc6353",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  songArtist: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 2,
  },
  songGener: {
    color: "#888",
    fontSize: 12,
    fontStyle: 'italic',
  },
  rightContainer: {
    alignItems: "flex-end",
  },

  addButton: {
    padding: 4,
  },
  searchContainer: {
    flex: 1,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 10,
    margin: 15,
  },
  searchBar: {
    flex: 1,
    height: 40,
    color: "#fff",
    fontSize: 16,
    paddingLeft: 10,
  },
  searchIcon: {
    padding: 10,
  },
  emptySearchText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
    zIndex: 100,
  },
  dropdownItem: {
    color: '#fff',
    fontSize:20,
    fontFamily: "Poppins, sans-serif",
    paddingHorizontal: 20,},
  rankingContainer: {
    flex: 1,
    backgroundColor: '#242424',
  },
  rankingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  rankingHeaderText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  rankingList: {
    flex: 1,
  },
  rankingListContent: {
    padding: 10,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 12,
    marginBottom: 10,
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  rankContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rankText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rankingImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  rankingInfo: {
    flex: 1,
  },
  rankingTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  rankingArtist: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  starIcon: {
    marginRight: 2,
  },
  ratingText: {
    color:'#e74c3c',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
