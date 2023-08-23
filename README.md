# Jabbertalky - Mobile Chat App

Jabbertalky is a mobile chat application built with React Native and Expo, providing users with a chat interface where they can share images and their location.

## Project Objective

The goal of this project is to build a chat app for mobile devices using React Native. The app will provide users with a chat interface and options to share images and their location. It is optimized for both Android and iOS devices.

## Features

- User authentication via Google Firebase.
- Users can enter a chat room with a preferred username and background color.
- Users can send and receive messages in real-time.
- Users can share images from their phone’s image library.
- Users can share their location data.
- Data storage both online and offline.

## Technical Requirements

The project uses the following technologies:

- React Native for the frontend
- Expo SDK for the development environment
- Google Firestore Database for storing chat data
- Google Firebase Authentication for user authentication
- Firebase Cloud Storage for storing images

## Prerequisites

Before getting started, ensure that you have the following:

- Node.js: You can download and install it from [nodejs.org](https://nodejs.org/).
- Firebase Account: Sign up for an account to access the Firebase console from [Firebase](https://firebase.google.com/).

## Installation and Setup

1. **Clone the Repository**: Use git to clone the repository to your local machine.
2. **Navigate to the Project Directory**: Use your terminal to navigate into the project folder.
3. **Install Dependencies**: Run `npm install` to fetch all required packages.
4. **Configure Firebase**: Create a new Firebase project via the Firebase console. Obtain the configuration object and replace the existing `firebaseConfig` in the code.
5. **Activate Firestore and Storage**: Make sure to enable the Firestore and Storage services through your Firebase console.
6. **Expo Installation**: Run the command `npm expo install`.
7. **Run the App**: Start the application with `expo start`.

## Usage Guidelines

### Initial Setup

- At the startup screen, you'll be prompted to enter your name. Choose a chat background color by tapping on one of the colored circles.
- Tap the "Start Chatting" button to enter the chat interface.

### Inside the Chat

- View and send messages in real-time within the chat room. Just type your message in the input area and tap "Send".
- Use the "+" symbol adjacent to the input area to either send images or your current location.
  - For images, you can either select one from your library or use the camera to take a new photo.
  - To send your location, opt for the "Send Location" feature.
