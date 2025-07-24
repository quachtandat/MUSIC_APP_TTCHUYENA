import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert,TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../configs/firebaseConfig";

const ADMIN_EMAIL = "admin@gmail.com"
 


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user.email === ADMIN_EMAIL) {
        navigation.navigate("AdminDashboard");
      } else {
        navigation.navigate("HomeScreen");
      }
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <ImageBackground source={require("../../assets/images/m8.png")} style={styles.background}>
       <View style={styles.overlay}>
      <Text style={styles.title}>WELLCOME BACK</Text>
      <Text style = {{
                    fontSize: 14,
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                    fontStyle : "normal",
                    textAlign:'center',
                    alignContent:'center',
                    color: '#aaaaaa',
                    marginTop:16
                }} >Please login to enjoy music. </Text>
      <TextInput 
      placeholder="Email" 
      onChangeText={setEmail} value={email}
      style={styles.input}
      placeholderTextColor="#aaaaaa"/>
      <TextInput 
      placeholder="Password"
       secureTextEntry onChangeText={setPassword} value={password}
       style={styles.input}
       placeholderTextColor="#aaaaaa" />
      {/* <Button title="Login" 
      onPress={handleLogin} />
      <Button title="Go to Register" onPress={() => navigation.navigate("Register")} /> */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
    </ImageBackground>
   
  )
};

const styles = StyleSheet.create({
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
    fontSize: 28,
    fontFamily: "Poppins, sans-serif",
    fontWeight: 700,
    fontStyle : "normal",
    color: "#ffff",
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
    // marginBottom: 16,
    marginTop: 28
  },
  button: {
    backgroundColor:"#dc6353",
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
    color: "#ffff",
  },
});
export default LoginScreen;
