import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Button,
  useColorScheme,
} from 'react-native';
import { useFonts } from 'expo-font';

import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { auth } from '../../services/firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function Senha() {
  const [fontsLoaded] = useFonts({
    'JetBrainsMono-Bold': require('../../asset/fonts/JetBrainsMono-Bold.ttf'),
  });

  // Esperar a fonte carregar antes de renderizar
  if (!fontsLoaded) {
    return <Text>Carregando fontes...</Text>;
  }
  const [userMail, setUserMail] = useState('');

  const navigation = useNavigation();

  function replacePass() {
    if (userMail !== '') {
      sendPasswordResetEmail(auth, userMail)
        .then(() => {
          alert('Email enviado:' + userMail);
          navigation.navigate('Signin');
        })
        .catch((error) => {
          const errorMessage = error.message;
          alert('Ops alguma coisa nao deu certo' + errorMessage + 'Tente novamente');
          return;
        });
    } else {
      alert('Preencha todos os campos');
      return;
    }
  }

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
        <Text style={[styles.message, { fontFamily: 'JetBrainsMono-Bold' }]}>Redefinir Senha</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" style={styles.containerForm}>
        <Text style={[styles.title, { fontFamily: 'JetBrainsMono-Bold' }]}>Email</Text>

        <TextInput
          placeholder="Digite o email..."
          style={[styles.input, { fontFamily: 'JetBrainsMono-Bold' }]}
          value={userMail}
          onChangeText={setUserMail}
        />

        <TouchableOpacity style={styles.button} onPress={replacePass}>
          <Text style={[styles.buttonText, { fontFamily: 'JetBrainsMono-Bold' }]}>Enviar</Text>
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
  },
});
