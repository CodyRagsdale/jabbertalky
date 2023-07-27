import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";

const Start = ({ navigation }) => {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#090C08");

  const colors = ["#5680E9", "#84CEEB", "#5AB9EA", "#C1C8E4", "#8860D0"];

  return (
    <ImageBackground
      source={require("../assets/BackgroundImage.png")}
      style={styles.container}
    >
      <Text style={styles.greeting}>Welcome!</Text>
      <TextInput
        style={styles.textInput}
        value={name}
        onChangeText={setName}
        placeholder="Type your username here"
      />
      <ScrollView
        horizontal={true}
        contentContainerStyle={{
          justifyContent: "space-between",
          paddingVertical: 20,
        }}
      >
        {colors.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.colorButton, { backgroundColor: color }]}
            onPress={() => setSelectedColor(color)}
          />
        ))}
      </ScrollView>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: selectedColor }]}
        onPress={() =>
          navigation.navigate("Chat", { name: name, color: selectedColor })
        }
      >
        <Text
          style={[
            styles.buttonText,
            { color: selectedColor === "#C1C8E4" ? "black" : "white" },
          ]}
        >
          Start Chatting
        </Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  greeting: {
    fontSize: 24,
    textAlign: "center",
    margin: 10,
  },
  textInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "80%",
    paddingHorizontal: 10,
    margin: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    color: "white",
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
});

export default Start;
