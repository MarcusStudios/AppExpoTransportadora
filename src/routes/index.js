import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Welcome from "../pages/welcome";
import Signin from "../pages/signin";
import Cadastro from "../pages/cadastro";
import Senha from "../pages/senha";
import Home from "../pages/home";
import Empregado from "../pages/empregado";
import Cliente from "../pages/cliente";
import Produto from "../pages/produto";

import { Entypo, Feather } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function Routes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signin"
        component={Signin}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Cadastro"
        component={Cadastro}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Senha"
        component={Senha}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        options={{ headerShown: false }}
      >
        {() => (
          
            <Tab.Navigator
              screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarStyle: {
                  position: "absolute",
                  backgroundColor: "transparent",
                  borderTopWidth: 0,
                  elevation: 0,
                  height: 80,
                  backgroundColor: "#38a69d",
                  borderTopColor: "transparent",
                  borderRadius: 15,
                  margin: 20,
                  right: 0,
                  left: 0,
        
                },
                tabBarActiveTintColor: "#fff",
                tabBarInactiveTintColor: "black",
                tabBarIconStyle: {
                  
                },
                tabBarLabelStyle: {
                  fontSize: 13, 
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  letterSpacing: 0.5,
                  marginBottom: 5,
                  resolution: 1.5
                }
              }}
            >
              <Tab.Screen
                name="Encomendas"
                component={Home}
                options={{
                  tabBarIcon: ({ size, color }) => (
                    <MaterialCommunityIcons
                      name="truck-delivery"
                      size={size}
                      color={color}
                    />
                  ),
                }}
                
              />
              <Tab.Screen
                name="Entregadores"
                component={Empregado}
                options={{
                  tabBarIcon: ({ size, color }) => (
                   <Feather name="users" size={24} color={color} />
                    
                  )
                }}
               
              />
              <Tab.Screen
                name="Produtos"
                component={Produto}
                options={{
                  tabBarIcon: ({ size, color }) => (
                    <Feather
                      name="box"
                      size={size}
                      color={color}
                    />
                  ),
                }}
                
              />
            </Tab.Navigator>
         
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
