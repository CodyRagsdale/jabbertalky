//App.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import the Auth module
import Start from "./components/Start";
import Chat from "./components/Chat";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBo2SeEc_0vOLhNW2rQ6d_QvgvcDupV0sY",
  authDomain: "jabbertalky-6b813.firebaseapp.com",
  projectId: "jabbertalky-6b813",
  storageBucket: "jabbertalky-6b813.appspot.com",
  messagingSenderId: "467278910517",
  appId: "1:467278910517:web:42e9f74d89d20586f0cd7c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore();

// Initialize Firebase Auth
export const auth = getAuth();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
