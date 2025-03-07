import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Button,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { auth } from '../../services/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { app } from '../../services/firebaseConfig.js';
import { useFonts } from 'expo-font';

export default function Cadastro() {
  const [userMail, setUserMail] = useState('');
  const [userPass, setUserPass] = useState('');

  const [fontsLoaded] = useFonts({
    'JetBrainsMono-Bold': require('../../asset/fonts/JetBrainsMono-Bold.ttf'),
  });

  // Esperar a fonte carregar antes de renderizar
  if (!fontsLoaded) {
    return <Text>Carregando fontes...</Text>;
  }

  const navigation = useNavigation();

  function newUser() {
    if (userMail === '' || userPass === '') {
      alert('Preencha todos os campos');
    } else {
      createUserWithEmailAndPassword(auth, userMail, userPass)
        .then((userCredential) => {
          const user = userCredential.user;
          alert('Conta criada com sucesso');
          navigation.navigate('Home');
        })
        .catch((error) => {
          const errorMessage = error.code;
          alert(errorMessage);
          navigation.navigate('Signin');
        });
    }
  }
  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
        <Text style={[styles.message, { fontFamily: 'JetBrainsMono-Bold' }]}>Cadastre-se</Text>
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
          placeholder="Digite uma senha..."
          style={[styles.input, { fontFamily: 'JetBrainsMono-Bold' }]}
          value={userPass}
          onChangeText={setUserPass}
        />

        <TouchableOpacity style={styles.button} onPress={newUser}>
          <Text style={[styles.buttonText, { fontFamily: 'JetBrainsMono-Bold' }]}>Criar Conta</Text>
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
  buttonRegister: {
    backgroundColor: '#38a69d',
    width: '100%',
    borderRadius: 4,
    paddingVertical: 8,
    marginTop: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '400',
  },
});
