import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { CheckBox } from "react-native-elements";
import authService from "../AuthService/authservice";
import { RootStackParamList } from '../Navegation/navigationTypes';
import { StackNavigationProp } from '@react-navigation/stack';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const login = await authService.login(email, password);
      switch (login) {
        case "Chef":
          navigation.navigate("Bienvenido");
          break;
        default:
          setError("Usuario no autorizado");
          break;
      }
    } catch (err) {
      setError("Correo o contraseña incorrecta");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginContainer}>
        <View style={styles.formContainer}>
          <Image source={require('../assets/LogoBien.jpg')} style={styles.logoImage} />
          <Text style={styles.title}>QA Restaurant</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              value={email}
              onChangeText={(text) => setEmail(text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Iniciar sesión</Text>
            </TouchableOpacity>
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF6ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    width: '100%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'transparent',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    padding: 16,
    backgroundColor: 'transparent', 
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
  },
  logoImage: {
    width: 400,  // Aumentar el ancho de la imagen
    height: 200, 
    resizeMode: 'contain',
    marginBottom: 20,
    marginTop: -100,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 16,
    backgroundColor: '#FFF',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  button: {
    backgroundColor: '#486F99',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  error: {
    marginTop: 16,
    color: 'red',
    textAlign: 'center',
  },
});
