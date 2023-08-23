import React, { useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

//CustomActions component to handle additional messaging capabilities
const CustomActions = ({
  wrapperStyle,
  iconTextStyle,
  onSend,
  storage,
  userID,
}) => {
  //State to handle loading
  const [isLoading, setIsLoading] = useState(false);

  //Initialize action sheet from Expo
  const actionSheet = useActionSheet();

  //Convert a URI to a Blob object
  const uriToBlob = uri => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new Error('uriToBlob failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  };

  //Upload file to Firebase Storage
  const uploadFile = async (uri, filename) => {
    const blobFile = await uriToBlob(uri);
    const storageRef = ref(storage, filename);

    try {
      await uploadBytes(storageRef, blobFile);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  //Upload and send image
  const uploadAndSendImage = async imageURI => {
    setIsLoading(true);
    const uniqueRefString = generateReference(imageURI);
    const imageURL = await uploadFile(imageURI, uniqueRefString);
    if (imageURL) {
      onSend({ image: imageURL });
    } else {
      console.error('Failed to upload image to Firebase');
    }
    setIsLoading(false);
  };

  //Show Action Sheet to choose media or location
  const onActionPress = () => {
    const options = [
      'Choose From Library',
      'Take Picture',
      'Send Location',
      'Cancel',
    ];
    const cancelButtonIndex = options.length - 1;
    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async buttonIndex => {
        switch (buttonIndex) {
          case 0:
            pickImage();
            return;
          case 1:
            takePhoto();
            return;
          case 2:
            getLocation();
          default:
        }
      }
    );
  };

  //Handles picking an image from library
  const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
      else Alert.alert('Permissions have not been granted');
    }
  };

  //Handles taking a photo with device camera
  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync();
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
      else Alert.alert('Permissions have not been granted');
    }
  };

  //Handles getting and sending location
  const getLocation = async () => {
    let permissions = await Location.requestForegroundPermissionsAsync();
    if (permissions?.granted) {
      setIsLoading(true);
      const location = await Location.getCurrentPositionAsync({});
      if (location) {
        onSend({
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
        });
      } else Alert.alert('Error occurred while fetching location');
    } else Alert.alert('Permissions have not been granted');
    setIsLoading(false);
  };

  //Generate unique reference string for each image upload
  const generateReference = uri => {
    const timeStamp = new Date().getTime();
    const imageName = uri.split('/')[uri.split('/').length - 1];
    return `${userID}-${timeStamp}-${imageName}`;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onActionPress}>
      <View style={[styles.wrapper, wrapperStyle]}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#000000" />
        ) : (
          <Text style={[styles.iconText, iconTextStyle]}>+</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

export default CustomActions;
