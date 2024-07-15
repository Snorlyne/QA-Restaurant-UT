import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Bienvenido from './components/Bienvenido';
import OrderScreen from './components/Dashboard';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './Navegation/navigationTypes'; 
import Login from './AuthService/login'

const Stack = createStackNavigator<RootStackParamList>();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Bienvenido">
      <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Bienvenido" component={Bienvenido} />
        <Stack.Screen name="OrderScreen" component={OrderScreen}>
        </Stack.Screen>
        {/* Configura otras pantallas aquí */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;


