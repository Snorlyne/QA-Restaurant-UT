import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";

const Unauthorized = ({ message = "Puedes volver a la página principal" }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require("../assets/403.png")} style={styles.image} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>No tienes acceso a este contenido</Text>
        <Text style={styles.subtitle}>{message}</Text>
      </View>
    </ScrollView>
  );
};

export default Unauthorized;


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF",
  },
  imageContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  image: {
    width: "70%",
    height: undefined,
    aspectRatio: 1,
    resizeMode: "cover",
    borderRadius: 24,
    backgroundColor: "#EEF2FF",
  },
  textContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
  },
  link: {
    color: "blue",
  },
});
