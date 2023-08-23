import { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import {
  addDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  collection,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

//Main Chat Component
const Chat = ({ db, route, navigation, isConnected, storage }) => {
  //Destructure params from the route
  const { name, color, userId } = route.params;

  //State to manage messages and loading status
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //Function to send new messages
  const onSend = newMessages => {
    addDoc(collection(db, 'messages'), newMessages[0]);
  };

  //Customize appearance of message bubbles
  const renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#d1edf2', // Light grey for better contrast
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 15,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
          },
          left: {
            backgroundColor: '#e6e6e6', // Light blue for the other user
            borderBottomRightRadius: 15,
            borderBottomLeftRadius: 15,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 0,
          },
        }}
        textStyle={{
          right: {
            color: '#333333', // Dark text for high contrast
          },
          left: {
            color: '#333333', // Dark text for high contrast
          },
        }}
      />
    );
  };

  //Initialize and manage Firestore snapshot and message caching
  useEffect(() => {
    setIsLoading(true);
    navigation.setOptions({ title: name });
    let unsubChat;
    if (isConnected === true) {
      if (unsubChat) unsubChat();
      unsubChat = null;

      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      unsubChat = onSnapshot(q, documentsSnapshot => {
        let newMessagesList = [];
        documentsSnapshot.forEach(doc => {
          newMessagesList.push({
            _id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          });
        });
        cacheMessages(newMessagesList);
        setMessages(newMessagesList);
      });
      setIsLoading(false);
    } else loadCachedMessages();

    return () => {
      if (unsubChat) unsubChat();
    };
  }, [isConnected]);

  //Function to cache messages in AsyncStorage
  const cacheMessages = async messagesToCache => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  //Function to load cached messages
  const loadCachedMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem('messages')) || [];
    setMessages(JSON.parce(cachedMessages));
  };

  //Render the input toolbar only when connected
  const renderInputToolBar = props => {
    if (isConnected) {
      return (
        <InputToolbar
          {...props}
          containerStyle={{ marginBottom: 2, padding: 2 }}
        />
      );
    } else {
      return null;
    }
  };

  //Points to CustomActions component for use in the chat
  const renderCustomActions = props => {
    return <CustomActions storage={storage} {...props} />;
  };

  //Render custom view for location messages
  const renderCustomView = props => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  return (
    <View style={[{ backgroundColor: color }, styles.container]}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#000000" />
      ) : (
        <GiftedChat
          keyboardShouldPersistTaps={'never'}
          style={styles.textBox}
          messages={messages}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolBar}
          onSend={messages => onSend(messages)}
          renderActions={renderCustomActions}
          renderCustomView={renderCustomView}
          renderUsernameOnMessage={true}
          onTouchStart={() => Keyboard.dismiss()}
          user={{
            _id: userId,
            name,
          }}
        />
      )}
      {Platform.OS === 'android' ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 600,
  },
  textBox: {
    flex: 1,
    padding: 10,
  },
});

export default Chat;
