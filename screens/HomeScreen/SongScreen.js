import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, doc, updateDoc, increment, getDoc, setDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

const SongScreen = ({ route }) => {
  const { song } = route.params || {};
  const navigation = useNavigation();
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState(null);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  const soundRef = useRef(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const db = getFirestore(getApp());
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    loadSound();
    fetchUserRating();
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      startRotation();
    } else {
      stopRotation();
    }
  }, [isPlaying]);

  const startRotation = () => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const stopRotation = () => {
    rotateAnim.stopAnimation();
  };

  const loadSound = async () => {
    const { sound } = await Audio.Sound.createAsync({ uri: song.url }, {}, onPlaybackStatusUpdate);
    soundRef.current = sound;
    setSound(sound);
  };

  const onPlaybackStatusUpdate = (status) => {
    setPlaybackStatus(status);
    if (!isSeeking && status.isLoaded) {
      setSliderPosition(status.positionMillis);
    }
  };

  const handlePlayPause = async () => {
    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }

    setIsPlaying(!isPlaying);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const fetchUserRating = async () => {
    try {
      if (!userId) return;
      const ratingDoc = doc(db, 'ratings', userId);
      const ratingSnapshot = await getDoc(ratingDoc);
      const ratingData = ratingSnapshot.data();

      if (ratingData && ratingData[song.id]) {
        setSelectedRating(ratingData[song.id]);
      }
    } catch (error) {
      console.error('Lỗi khi tải đánh giá:', error);
    }
  };

  const handleRating = async (rating) => {
    if (selectedRating || !userId) return;

    const songRef = doc(db, 'songs', song.id);
    const ratingDocRef = doc(db, 'ratings', userId);

    const ratingField = `r${rating}`;
    try {
      await updateDoc(songRef, {
        [ratingField]: increment(1),
      });

      const ratingSnapshot = await getDoc(ratingDocRef);
      if (ratingSnapshot.exists()) {
        await updateDoc(ratingDocRef, {
          [song.id]: rating,
        });
      } else {
        await setDoc(ratingDocRef, {
          [song.id]: rating,
        });
      }

      setSelectedRating(rating);
    } catch (error) {
      console.error('Lỗi khi cập nhật đánh giá:', error);
    }
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="chevron-down" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.nowPlayingText}>ĐANG PHÁT TỪ NGHỆ SĨ</Text>
          <Text style={styles.artistName}>{song.artist}</Text>
        </View>
      </View>

      <Animated.Image
        source={{ uri: song.image }}
        style={[styles.image, { transform: [{ rotate: spin }] }]}
      />

      <View style={styles.songInfoContainer}>
        <Text style={styles.songTitle}>{song.title}</Text>
        <Text style={styles.songArtist}>{song.artist}</Text>
      </View>

      <View style={styles.progressContainer}>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0}
          maximumValue={playbackStatus?.durationMillis || 1}
          value={isSeeking ? sliderPosition : playbackStatus?.positionMillis || 0}
          minimumTrackTintColor="#dc6353"
          maximumTrackTintColor="#555"
          thumbTintColor="#fff"
          onValueChange={(value) => {
            if (!isSeeking) setIsSeeking(true);
            setSliderPosition(value);
          }}
          onSlidingComplete={async (value) => {
            if (sound) {
              try {
                await sound.setPositionAsync(value);
              } catch (err) {
                console.log('Lỗi tua:', err);
              }
            }
            setIsSeeking(false);
          }}
        />
        <View style={styles.progressTimes}>
          <Text style={styles.timeText}>
            {millisToMinutesAndSeconds(isSeeking ? sliderPosition : playbackStatus?.positionMillis || 0)}
          </Text>
          <Text style={styles.timeText}>
            {millisToMinutesAndSeconds(playbackStatus?.durationMillis || 0)}
          </Text>
        </View>
      </View>

      <View style={styles.controlsCenter}>
        <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={36} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.ratingContainer}>
        <Text style={styles.ratingLabel}>Bạn yêu thích bài hát này thế nào?</Text>
        <View style={styles.heartsRow}>
          {[1, 2, 3, 4, 5].map((rating) => (
            <TouchableOpacity
              key={rating}
              onPress={() => handleRating(rating)}
              disabled={!!selectedRating}
            >
              <Ionicons
                name={selectedRating >= rating ? 'heart' : 'heart-outline'}
                size={32}
                color={selectedRating >= rating ? '#e74c3c' : '#aaa'}
                style={styles.heartIcon}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const millisToMinutesAndSeconds = (millis) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = Math.floor((millis % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 40,
  },
  header: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 0,
    zIndex: 1,
  },
  headerTextContainer: {
    alignItems: 'center',
  },
  nowPlayingText: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 5,
  },
  artistName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  image: {
    width: width - 100,
    height: width - 100,
    borderRadius: (width - 100) / 2,
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#333',
  },
  songInfoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  songTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  songArtist: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 4,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  progressTimes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeText: {
    color: '#bbb',
    fontSize: 12,
  },
  controlsCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  playButton: {
    backgroundColor: '#fff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  ratingLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  heartsRow: {
    flexDirection: 'row',
  },
  heartIcon: {
    marginHorizontal: 5,
  },
});

export default SongScreen;
