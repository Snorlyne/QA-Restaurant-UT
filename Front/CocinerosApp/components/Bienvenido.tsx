import React from 'react';
import { StyleSheet, ImageBackground, SafeAreaView, Text, TouchableOpacity, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../Navegation/navigationTypes';
import { StackNavigationProp } from '@react-navigation/stack';

type BienvenidoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Bienvenido'>;

const App: React.FC = () => {
  const navigation = useNavigation<BienvenidoScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('../assets/vinos.jpg')} style={styles.backgroundImage}>
        <Image source={require('../assets/LogoBien.jpg')} style={styles.logoImage} />
      </ImageBackground>
      <View style={styles.centeredContainer}>
        <Text style={styles.title}>Bienvenido Cocinero</Text>
        <Text style={styles.subtitle}>Aquí podrás visualizar los pedidos realizados.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('OrderScreen')}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF6ED',
  },
  backgroundImage: {
    height: '65%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 200,
    height: 200, 
    borderRadius: 20,
    marginTop: 80,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: -50, 
  },
  title: {
    fontSize: 24,
    marginTop: 20,
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold', // Ajuste de estilo
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
    color: '#666',
  },
  button: {
    padding: 10,
    backgroundColor: '#486F99',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default App;
