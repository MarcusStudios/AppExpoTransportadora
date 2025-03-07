import React, { useState, useEffect } from 'react';
import { StatusBar, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as Font from 'expo-font';
import Routes from './src/routes';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          'JetBrainsMono-Bold': require('./src/asset/fonts/JetBrainsMono-Bold.ttf'), // Caminho para sua fonte
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Erro ao carregar fontes:', error);
      }
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
        <ActivityIndicator size="large" color="#38a69f" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#38a69f" barStyle="light-content" />
      <Routes />
    </NavigationContainer>
  );
}
