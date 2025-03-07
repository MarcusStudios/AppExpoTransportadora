import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';

export default function Welcome() {
  const [fontsLoaded] = useFonts({
    'JetBrainsMono-Bold': require('../../asset/fonts/JetBrainsMono-Bold.ttf'),
  });

  // Esperar a fonte carregar antes de renderizar
  if (!fontsLoaded) {
    return <Text>Carregando fontes...</Text>;
  }
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.containerLogo}>
        <Animatable.Image
          animation="flipInY"
          source={require('../../asset/logo.png')}
          style={{ width: '100%' }}
          resizeMode="contain"
        />
      </View>

      <Animatable.View delay={600} animation="fadeInUp" style={styles.containerForm}>
        <Text style={[styles.title, { fontFamily: 'JetBrainsMono-Bold' }]}>
          {' '}
          Monitore, organize e gerencie de qualquer lugar
        </Text>

        <Text style={[styles.text, { fontFamily: 'JetBrainsMono-Bold' }]}>
          Faça o login para começar
        </Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Signin')}>
          <Text style={[styles.buttonText, { fontFamily: 'JetBrainsMono-Bold' }]}>Acessar</Text>
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
  containerLogo: {
    flex: 2,
    backgroundColor: '#38a69d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerForm: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: '5%',
    paddingEnd: '5%',
  },
  title: {
    fontSize: 24,
    marginTop: 28,
    marginBottom: 12,
  },
  text: {
    color: '#a1a1a1',
  },
  button: {
    position: 'absolute',
    backgroundColor: '#38a69d',
    borderRadius: 10,
    paddingVertical: 8,
    width: '50%',
    alignSelf: 'center',
    bottom: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
});
