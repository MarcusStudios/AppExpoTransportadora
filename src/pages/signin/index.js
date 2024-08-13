import React from "react";
import {View,Text, StyleSheet,TextInput,TouchableOpacity,Button,useColorScheme, ActivityIndicator} from "react-native";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { auth } from "../../services/firebaseConfig";
import {signInWithEmailAndPassword} from "firebase/auth"
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import {app} from "../../services/firebaseConfig.js";
import {Ionicons} from "@expo/vector-icons";

export default function Signin() {
  const [userMail, setUserMail] = useState("");
  const [userPass, setUserPass] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Adicionado estado de loading
  const [hidePass, setHidePass] = useState(true);
  
  const navigation = useNavigation();

  const userlogin = () => {
    setIsLoading(true); // Ativa o indicador de atividade
    signInWithEmailAndPassword(auth, userMail, userPass)
      .then((userCredential) => {
        const user = userCredential.user;
        alert("Login efetuado com sucesso!");
        console.log(user);
        navigation.navigate("Home");
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
      })
      .finally(() => {
        setIsLoading(false); // Desativa o indicador de atividade após o término do login
      });
  };

  return (
    <View style={styles.container}>
      <Animatable.View
        animation="fadeInLeft"
        delay={500}
        style={styles.containerHeader}
      >
        <Text style={styles.message}>Bem-vindo(a)</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.title}>Email</Text>

        <TextInput
          placeholder="Digite um email..."
          style={styles.input}
          value={userMail}
          onChangeText={setUserMail}
        />
        
        <Text style={styles.title}>Senha</Text>
        <TextInput
          
          placeholder="Digite sua senha..."
          style={styles.input}
          value={userPass}
          onChangeText={setUserPass}
          secureTextEntry={hidePass}
        />
        <TouchableOpacity style={styles.eyeIcon} onPress={() => setHidePass(!hidePass)}>
          <Ionicons name="eye" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={userlogin}>
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.buttonText}>Acessar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Cadastro")}
        >
          <Text style={styles.buttonText}>Cadastre-se</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Senha")}
        >
          <Text style={styles.buttonText}>Esqueci Senha</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#38a69d",
  },
  containerHeader: {
    marginTop: "14%",
    marginBottom: "8%",
    paddingStart: "5%",

  },
  eyeIcon: {
    flexDirection: "row-reverse",
    position: "absolute",
    right: 20,
    top: 170,
    width: '15%',
    height: '5%',
    justifyContent: 'center',
    alignItems: 'center',
   

  },
  message: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  containerForm: {
    backgroundColor: "white",
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: "5%",
    paddingEnd: "5%",
  },
  title: {
    fontSize: 20,
    marginTop: 28,
  },
  input: {
    borderBottomWidth: 1,
    height: 40,
    marginBottom: 12,
    fontSize: 16,
    width: "100%",


  },
  button: {
    backgroundColor: "#38a69d",
    width: "100%",
    borderRadius: 4,
    paddingVertical: 8,
    marginTop: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
0