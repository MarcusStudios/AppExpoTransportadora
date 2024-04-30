import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Welcome from "../pages/welcome";
import Signin from "../pages/signin";
import Cadastro from "../pages/cadastro";
import Senha from "../pages/senha";
import Home from "../pages/home";
import Empregado from "../pages/empregado";
import Cliente from "../pages/cliente";
import Produto from "../pages/produto";

const Stack = createNativeStackNavigator();

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
        component={Home}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Empregado"
        component={Empregado}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Cliente"
        component={Cliente}
        options={{ headerShown: false }}
      />


        <Stack.Screen
        name="Produto"
        component={Produto}
        options={{ headerShown: false }}
      />



    </Stack.Navigator>
  );
}
