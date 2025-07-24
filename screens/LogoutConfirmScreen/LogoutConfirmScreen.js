import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../configs/firebaseConfig";

const LogoutConfirmScreen = ({ navigation }) => {
  const handleConfirmLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("LoginScreen");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Are you sure you want to Logout?</Text>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmLogout}>
        <Text style={styles.buttonText}>Confirm Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242424",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    color: "#ffff",
    fontFamily: "Poppins, sans-serif",
    fontWeight: 500,
    fontStyle : "normal",
    textAlign: "center",
    marginBottom: 30,
  },
  confirmButton: {
    backgroundColor: "#ff5c5c",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: "100%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#555",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Poppins",
  },
});

export default LogoutConfirmScreen;
