// components/CustomBottomNavigationBar.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomBottomNavigationBar = ({ onTabChange, activeTab }) => {
  const tabs = [
    { name: 'Song', icon: 'musical-note-outline', activeIcon: 'musical-note', route: 'Song' },
    { name: 'Search', icon: 'search-outline', activeIcon: 'search', route: 'Search' },
    { name: 'Ranking', icon: 'trophy-outline', activeIcon: 'trophy', route: 'Ranking' },
    { name: 'Playlist', icon: 'list-outline', activeIcon: 'list', route: 'Playlist' },
  ];

  const handleTabPress = (tabName) => {
    onTabChange(tabName);
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={styles.button}
          onPress={() => handleTabPress(tab.route)}
        >
          <Ionicons
            name={activeTab === tab.route ? tab.activeIcon : tab.icon}
            size={24}
            color={activeTab === tab.route ? '#dc6353' : '#fff'}
          />
          <Text
            style={[
              styles.label,
              { color: activeTab === tab.route ? '#dc6353' : '#fff' },
            ]}
          >
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#333',
  },
  button: {
    alignItems: 'center',
  },
  label: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
});

export default CustomBottomNavigationBar;