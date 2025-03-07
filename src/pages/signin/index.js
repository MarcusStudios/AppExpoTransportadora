import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Button,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { auth } from '../../services/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { app } from '../../services/firebaseConfig.js';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

export default function Signin() {
  const [userMail, setUserMail] = useState('');
  const [userPass, setUserPass] = useState('');
  const [hidePass, setHidePass] = useState(true);
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const [isLoadingRegister, setIsLoadingRegister] = useState(false);
  const [isLoadingForgotPassword, setIsLoadingForgotPassword] = useState(false);

  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    'JetBrainsMono-Bold': require('../../asset/fonts/JetBrainsMono-Bold.ttf'),
  });

  // Esperar a fonte carregar antes de renderizar
  if (!fontsLoaded) {
    return <Text>Carregando fontes...</Text>;
  }
  const userlogin = () => {
    setIsLoadingLogin(true); // Ativa o indicador de atividade para login
    signInWithEmailAndPassword(auth, userMail, userPass)
      .then((userCredential) => {
        const user = userCredential.user; // Corrigido aqui
        alert('Login efetuado com sucesso!');
        console.log(user);
        navigation.navigate('Home');
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
      })
      .finally(() => {
        setIsLoadingLogin(false); // Desativa o indicador de atividade após o término do login
      });
  };

  const handleRegister = async () => {
    setIsLoadingRegister(true);
    // Simulação de uma chamada de rede
    try {
      await new Promise((resolve) => setTimeout(resolve, 600)); // Simula um atraso de 2 segundos
      navigation.navigate('Cadastro');
    } catch (error) {
      alert('Ocorreu um erro durante o cadastro.');
    } finally {
      setIsLoadingRegister(false);
    }
  };

  const handleForgotPassword = async () => {
    setIsLoadingForgotPassword(true);
    // Simulação de uma chamada de rede
    try {
      await new Promise((resolve) => setTimeout(resolve, 600)); // Simula um atraso de 2 segundos
      navigation.navigate('Senha');
    } catch (error) {
      alert('Ocorreu um erro ao tentar recuperar a senha.');
    } finally {
      setIsLoadingForgotPassword(false);
    }
  };

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
        <Text style={[styles.message, { fontFamily: 'JetBrainsMono-Bold' }]}>Bem-vindo(a)</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" style={styles.containerForm}>
        <Text style={[styles.title, { fontFamily: 'JetBrainsMono-Bold' }]}>Email</Text>

        <TextInput
          placeholder="Digite um email..."
          style={[styles.input, { fontFamily: 'JetBrainsMono-Bold' }]}
          value={userMail}
          onChangeText={setUserMail}
        />

        <Text style={[styles.title, { fontFamily: 'JetBrainsMono-Bold' }]}>Senha</Text>
        <TextInput
          placeholder="Digite sua senha..."
          style={[styles.input, { fontFamily: 'JetBrainsMono-Bold' }]}
          value={userPass}
          onChangeText={setUserPass}
          secureTextEntry={hidePass}
        />
        <TouchableOpacity style={styles.eyeIcon} onPress={() => setHidePass(!hidePass)}>
          <Ionicons name="eye-outline" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={userlogin}>
          {isLoadingLogin ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={[styles.buttonText, { fontFamily: 'JetBrainsMono-Bold' }]}>Acessar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          {isLoadingRegister ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={[styles.buttonText, { fontFamily: 'JetBrainsMono-Bold' }]}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
          {isLoadingForgotPassword ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={[styles.buttonText, { fontFamily: 'JetBrainsMono-Bold' }]}>
              Esqueci Senha
            </Text>
          )}
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#38a69d',
  },
  containerHeader: {
    marginTop: '14%',
    marginBottom: '8%',
    paddingStart: '5%',
  },
  eyeIcon: {
    flexDirection: 'row-reverse',
    position: 'absolute',
    right: 20,
    top: 170,
    width: '15%',
    height: '5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 30,
    color: 'white',
  },
  containerForm: {
    backgroundColor: 'white',
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: '5%',
    paddingEnd: '5%',
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
    width: '100%',
  },
  button: {
    backgroundColor: '#38a69d',
    width: '100%',
    borderRadius: 4,
    paddingVertical: 8,
    marginTop: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
0;
