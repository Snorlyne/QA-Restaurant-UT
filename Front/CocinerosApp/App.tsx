import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Bienvenido from './components/Bienvenido';
import OrderScreen from './components/Dashboard';
import Login from './AuthService/login';
import { RootStackParamList } from './Navegation/navigationTypes';

const Stack = createStackNavigator<RootStackParamList>();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{ 
          headerShown: false,
          gestureEnabled: false 
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={Login}
          options={{ 
            gestureEnabled: false,
            headerLeft: () => null 
          }}
        />
        <Stack.Screen 
          name="Bienvenido" 
          component={Bienvenido}
          options={{ 
            gestureEnabled: false,
            headerLeft: () => null
          }}
        />
        <Stack.Screen 
          name="OrderScreen" 
          component={OrderScreen}
          options={{ 
            gestureEnabled: false,
            headerLeft: () => null
          }}
        />
        {/* Configura otras pantallas aquí */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;