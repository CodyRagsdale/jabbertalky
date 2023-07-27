import { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";

const Chat = ({ route, navigation }) => {
  const { name, color } = route.params;

  useEffect(() => {
    navigation.setOptions({ title: `${name}'s Chat` });
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <Text style={styles.greeting}>Welcome to the chat, {name}!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  greeting: {
    fontSize: 24,
    textAlign: "center",
    margin: 10,
  },
});

export default Chat;
