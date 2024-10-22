# GladIs

This is a cross-platform React Native application that runs on **Mac, iOS, Android, and Windows**. This guide will walk you through the installation process and help you set up the necessary dependencies for your development devices.

## Table of Contents

- [Requirements](#requirements)
- [Installation Guide](#installation-guide)
  - [Installing Dependencies on Mac](#installing-dependencies-on-mac)
  - [Installing Dependencies for Windows](#installing-dependencies-for-windows)
- [Setting Up the App](#setting-up-the-app)
- [Running the App](#running-the-app)
  - [iOS](#ios)
  - [Android](#android)
  - [Windows](#windows)
- [Troubleshooting](#troubleshooting)

## Requirements

Before proceeding with the installation, ensure that your system meets the following requirements:

### Mac
- macOS version: 10.14 or later
- Homebrew (for macOS package management)
- Xcode (for iOS and/or development)
- Android Studio (for Android development)
- Terminal ( for Mac development )

---

## Installation Guide

### Installing Dependencies on Mac

1. **Install Homebrew (if not already installed):**

   Open your terminal and run:
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install Node.js and npm (Node Package Manager):**

   Using Homebrew:
   ```bash
   brew install node
   ```

3. **Install Yarn:**

   Yarn is an alternative to npm, recommended for React Native apps. Install it using:
   ```bash
   brew install yarn
   ```

4. **Install Watchman (for better file watching capabilities):**

   ```bash
   brew install watchman
   ```

5. **Install CocoaPods (for iOS and Mac dependencies):**

   CocoaPods is necessary to manage iOS dependencies.
   ```bash
   sudo gem install cocoapods
   ```

6. **Install Android Studio: ( for Android dependencies )**

   Download and install Android Studio from [the official website](https://developer.android.com/studio).

   - Set up the Android SDK by opening Android Studio and navigating to `Preferences > Appearance & Behavior > System Settings > Android SDK`. Ensure that the SDK, NDK, and platform tools are installed.

7. **Install Xcode (for iOS development) ( optionnal if only Mac development ):**

   Download Xcode from the App Store or [Apple Developer](https://developer.apple.com/xcode/).

   - Open Xcode and agree to the license by running:
     ```bash
     sudo xcode-select --switch /Applications/Xcode.app
     sudo xcodebuild -runFirstLaunch
     ```

### Installing Dependencies for Windows

1. **Install Node.js and npm:**

   Download and install Node.js from [the official website](https://nodejs.org/).

2. **Install Yarn:**

   Install Yarn globally:
   ```bash
   npm install -g yarn
   ```

3. **Install Android Studio:**

   Download and install Android Studio from [the official website](https://developer.android.com/studio).

   - Set up the Android SDK, NDK, and platform tools in the same way as on Mac.

4. **Install Visual Studio (for Windows development):**

   Download and install [Visual Studio](https://visualstudio.microsoft.com/downloads/) with the following workloads:
   - Universal Windows Platform development
   - Desktop development with C++

   After installation, ensure you have the Windows SDK and MSVC toolset.

---

## Setting Up the App

1. **Clone the Repository:**

   First, clone your React Native project repository:
   ```bash
   git clone https://github.com/your-repository/react-native-app.git
   cd Gladis-Client-App
   ```

2. **Install Dependencies:**

   Install the project dependencies using Yarn (recommended):
   ```bash
   yarn install
   ```

   Alternatively, if you're using npm:
   ```bash
   npm install
   ```

3. **Install iOS Pods (for macOS/iOS only):**

   For iOS development, navigate to the `ios` directory and install the CocoaPods dependencies:
   ```bash
   cd ios
   pod install
   cd ..
   ```

   or ```bash
   cd mac
   pod install
   cd ..
   ```

---

## Running the App

### iOS

To run the iOS app, make sure you're on a Mac with Xcode installed.

1. **Run the app on iOS Simulator:**

   ```bash
   npx react-native run-ios
   ```

   Alternatively, you can open the project in Xcode:
   - Open `ios/YourApp.xcworkspace` in Xcode.
   - Choose your target device (Simulator or physical device).
   - Press the `Run` button.

### Mac
To run the app on Mac: 
  ```bash
  yarn macos
  ```

  Alternatively, you can open the project in Xcode:
   - Open `macos/YourApp.xcworkspace` in Xcode.
   - Choose your target devices.
   - Press the `Run` button.

### Android

To run the app on an Android device or emulator:

1. **Start an Android emulator:**

   Open Android Studio and launch the Android Virtual Device (AVD) Manager to start an emulator.

2. **Run the app on Android:**

   ```bash
   npx react-native run-android
   ```

   Alternatively, you can connect a physical Android device via USB with debugging mode enabled and run the app.

### Windows

To run the app on a Windows machine:

1. **Run the app on a Windows device:**

   ```bash
   npx react-native run-windows
   ```

   Ensure you have Visual Studio open, with the necessary workloads installed (UWP and Desktop C++).

---

## Troubleshooting

### Common Issues:

- **Error: Command `pod` not found:**  
  Ensure CocoaPods is installed on macOS and run `sudo gem install cocoapods`.

- **Android build fails with SDK issues:**  
  Make sure your Android SDK is correctly set up in Android Studio.

- **iOS build fails with Xcode version issues:**  
  Ensure you are using the latest version of Xcode that is compatible with your iOS target version.

- **Permission issues on macOS:**  
  You might need to grant additional permissions by running:
  ```bash
  sudo xcode-select --switch /Applications/Xcode.app
  sudo xcodebuild -license accept
  ```

---

If you encounter any other issues, please refer to the official [React Native documentation](https://reactnative.dev/docs/getting-started) or open an issue on this repository.

---

That's it! Your app should be up and running on macOS, iOS, Android, and Windows devices.

---

Feel free to modify the content based on your specific project needs.