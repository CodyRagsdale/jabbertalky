// Import required modules
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NetInfo, { useNetInfo } from '@react-native-community/netinfo';
import { disableNetwork, enableNetwork } from 'firebase/firestore';

// Import local components
import Start from './components/Start';
import Chat from './components/Chat';
import { db, app, storage } from './FirebaseConfig';
import CustomActions from './components/CustomActions';

// Create a stack navigator
const Stack = createNativeStackNavigator();

const App = () => {
  // Use NetInfo to get the user's network status
  const netInfo = useNetInfo();

  // Enable or disable Firebase Firestore network depending on the connection status
  useEffect(() => {
    if (netInfo.isConnected && netInfo.isInternetReachable) {
      enableNetwork(db); // Enable network if connected to the internet
    } else {
      disableNetwork(db); // Disable network if not connected
    }
  }, [netInfo]);

  // Function to render CustomActions component
  const renderCustomActions = props => {
    return <CustomActions {...props} />;
  };

  // Render the navigation container and stack navigator
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen
          name="Start"
          component={Start}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Chat">
          {props => (
            // Pass network status, Firestore database, and storage as props to the Chat component
            <Chat
              {...props}
              isConnected={netInfo.isConnected && netInfo.isInternetReachable}
              db={db}
              storage={storage}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Export the App component
export default App;
