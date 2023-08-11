import React, { useState, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  onSnapshotsInSync,
} from "firebase/firestore";
import { db } from "../FirebaseConfig";

const Chat = ({ route, navigation, isConnected }) => {
  const { name, color, userId } = route.params;
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [isFirestoreOnline, setFirestoreOnline] = useState(true);

  useEffect(() => {
    navigation.setOptions({ title: `${name}'s Chat` });
    const fetchMessages = async () => {
      if (!isConnected) {
        try {
          const cachedMessages = await AsyncStorage.getItem("messages");
          if (cachedMessages) {
            setMessages(JSON.parse(cachedMessages));
          }
        } catch (error) {
          console.error("Failed to load cached messages:", error);
        }
      } else {
        const messagesCollection = collection(db, "messages");
        const q = query(messagesCollection, orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          let newMessages = [];
          querySnapshot.forEach((doc) => {
            let data = doc.data();
            newMessages.push({
              _id: doc.id,
              text: data.text,
              createdAt: new Date(data.createdAt.seconds * 1000),
              user: data.user,
            });
          });
          setMessages(newMessages);

          // Cache the messages
          AsyncStorage.setItem("messages", JSON.stringify(newMessages));
        });
        return () => unsubscribe();
      }
    };

    fetchMessages();
  }, [isConnected]);

  useEffect(() => {
    const unsubscribeSync = onSnapshotsInSync(db, () => {
      setFirestoreOnline(true);
    });
    return () => unsubscribeSync();
  }, []);

  useEffect(() => {
    if (!isConnected || !isFirestoreOnline) {
      Keyboard.dismiss();
    }
  }, [isConnected, isFirestoreOnline]);

  const onSend = () => {
    if (messageText.length > 0) {
      const newMessage = {
        _id: Math.random().toString(),
        text: messageText,
        createdAt: new Date(),
        user: {
          _id: userId,
          name: name,
        },
      };

      const messagesCollection = collection(db, "messages");
      addDoc(messagesCollection, {
        text: newMessage.text,
        createdAt: newMessage.createdAt,
        user: newMessage.user,
      });

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, newMessage)
      );
      setMessageText("");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: color }}>
        <GiftedChat
          renderUsernameOnMessage
          messages={messages}
          user={{
            _id: userId,
            name: name,
          }}
          renderInputToolbar={() => null} // This will remove the default input bar
        />
        {isConnected && isFirestoreOnline ? (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 85 : 0}
          >
            <View
              style={{
                flexDirection: "row",
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 20,
                padding: 10,
                margin: 10,
                backgroundColor: "white",
              }}
            >
              <TextInput
                value={messageText}
                onChangeText={setMessageText}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  marginRight: 10,
                }}
              />
              <TouchableOpacity
                onPress={onSend}
                style={{
                  backgroundColor: "#0645AD",
                  padding: 10,
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: "white" }}>Send</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Chat;
