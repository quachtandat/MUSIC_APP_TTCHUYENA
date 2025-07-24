import React, { useState } from "react";
import { View, Text, TextInput, Button,TouchableOpacity, Alert, StyleSheet,ImageBackground,Image  } from "react-native";
import { createUserWithEmailAndPassword,updateProfile } from "firebase/auth";
import {auth} from '../../configs/firebaseConfig'
import { doc, setDoc } from "firebase/firestore";
import { db } from '../../configs/firebaseConfig';
const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  // const handleRegister = async () => {
  //   try {
  //     await createUserWithEmailAndPassword(auth, email, password);
  //     Alert.alert("Registration Successful", "You can now log in.");
  //     navigation.navigate("Login");
  //   } catch (error) {
  //     Alert.alert("Error", error.message);
  //   }
  // };
  const handleRegister = async () => {
    if (!email || !password || !fullName) {
      Alert.alert("Please fill in all fields.");
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      //  Write user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName,
        email: email,
        
      });
  
      console.log("User registered and data saved to Firestore");
    } catch (error) {
      console.error("Registration error:", error.message);
      alert(error.message);
    }
   
  };
  
  
  return (
    <ImageBackground source={require("../../assets/images/m8.png")} style={styles.background}>
      <View style={styles.overlay}>
       
      <Text style={styles.title}>WELLCOME TO SOUNDIFY </Text>
      <Text style = {{
                          fontSize: 14,
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 400,
                          fontStyle : "normal",
                          textAlign:'center',
                          alignContent:'center',
                          color: '#aaaaaa',
                          marginTop:16
                      }} > Enjoy your music at Soundify.</Text>
                      <TextInput
  placeholder="Full Name"
  placeholderTextColor="#aaa"
  style={styles.input}
  value={fullName}
  onChangeText={(text) => setFullName(text)}
/>
      <TextInput 
      placeholder="Email"
      onChangeText={setEmail} value={email} 
      style={styles.input}
      placeholderTextColor="#aaaaaa"/>
      <TextInput 
      placeholder="Password"
      secureTextEntry onChangeText={setPassword} value={password} 
      style={styles.input}
      placeholderTextColor="#aaaaaa"/>
      {/* <Button title="Register" onPress={handleRegister} />
      <Button title="Go to Login" onPress={() => navigation.navigate("Login")} /> */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
     </ImageBackground>
  );
};const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: "#242424",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   paddingHorizontal: 20,
  // },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins, sans-serif",
    fontWeight: 700,
    fontStyle : "normal",
    color: "#FFFF",
    marginTop: 12
    
  },
  input: {
    width: "100%",
    backgroundColor: "#3339",
    color: "#ffff",
    fontSize: 16,
    fontFamily: "Poppins",
    padding: 12,
    borderRadius: 8,
    marginTop: 28
  },
  button: {
    backgroundColor: "#dc6353",
    padding: 12,
    borderRadius: 18,
    width: "100%",
    alignItems: "center",
    marginTop: 28,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Poppins",
    color: "#ffff",
  },
  linkText: {
    marginTop: 15,
    fontSize: 14,
    fontFamily: "Poppins",
    color: "#FFFF",
  },
});

export default RegisterScreen;
