import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { auth } from '../FirebaseConfig';

//Start component to handle initial setup before entering the chat
const Start = ({ navigation }) => {
  //State variables for tracking user's name, their selected bg color, and loading
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#5680E9');
  const [isLoading, setIsLoading] = useState(false);

  // Color options for background
  const colors = ['#5680E9', '#84CEEB', '#5AB9EA', '#C1C8E4', '#8860D0'];

  // Function to handle anonymous sign-in and navigate to the chat
  const startChatting = async () => {
    setIsLoading(true);
    //Firebase Authentication
    const auth = getAuth();
    signInAnonymously(auth)
      .then(userCredential => {
        const user = userCredential.user;

        //Navigate to the chat component
        navigation.navigate('Chat', {
          name: name,
          color: selectedColor,
          userId: user.uid,
        });
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        console.error(error);
      });
  };

  return (
    <ImageBackground
      source={require('../assets/BackgroundImage.png')}
      style={styles.container}
    >
      <Text style={styles.greeting}>Welcome to Jabbertalky!</Text>
      <TextInput
        style={styles.textInput}
        value={name}
        onChangeText={setName}
        placeholder="Type your username here"
      />
      <ScrollView
        horizontal={true}
        contentContainerStyle={{
          justifyContent: 'space-between',
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
        onPress={startChatting}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          //Change font color depending on which bg color is selected
          <Text
            style={[
              styles.buttonText,
              {
                color:
                  selectedColor === '#C1C8E4' ||
                  selectedColor === '#84CEEB' ||
                  selectedColor === '#5AB9EA'
                    ? 'black'
                    : 'white',
              },
            ]}
          >
            Start Chatting
          </Text>
        )}
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  greeting: {
    fontSize: 24,
    textAlign: 'center',
    margin: 10,
    paddingTop: 150,
    fontWeight: 'bold',
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    paddingHorizontal: 10,
    margin: 10,
    backgroundColor: 'white',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    margin: 10,
    marginBottom: 50,
  },
  buttonText: {
    color: 'white',
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
});

export default Start;
