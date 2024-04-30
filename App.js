import React from 'react';
import { StatusBar } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';



import { NavigationContainer } from '@react-navigation/native'
import Routes from './src/routes'

export default function App() {

  return(
    <NavigationContainer>
      <StatusBar backgroundColor="#38a69f" barStyle="light-content"/>
      <Routes/>
    </NavigationContainer>
  );
}