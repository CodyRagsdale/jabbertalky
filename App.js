import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import { disableNetwork, enableNetwork } from "firebase/firestore";
import Start from "./components/Start";
import Chat from "./components/Chat";
import { db } from "./FirebaseConfig";

const Stack = createNativeStackNavigator();

const App = () => {
  const netInfo = useNetInfo();

  useEffect(() => {
    if (netInfo.isConnected && netInfo.isInternetReachable) {
      enableNetwork(db);
    } else {
      disableNetwork(db);
    }
  }, [netInfo]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => (
            <Chat
              {...props}
              isConnected={netInfo.isConnected && netInfo.isInternetReachable}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
