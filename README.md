This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

#### Prerequisites

Ensure you have Android SDK and Android Emulator installed. For detailed setup instructions, refer to [React Native Android Environment Setup](https://reactnative.dev/docs/environment-setup?guide=native&platform=android).

#### Starting the Android Emulator

Before running the app, you need to start an Android Emulator:

**Option 1: Using Android Studio**

1. Open Android Studio
2. Click on **AVD Manager** (or go to **Tools** > **Device Manager**)
3. Select your emulator and click the **Play** button
4. Wait for the emulator to fully load

**Option 2: Using Command Line**

```sh
# List available emulators
emulator -list-avds

# Start a specific emulator (replace 'Pixel_5_API_31' with your emulator name)
emulator -avd Pixel_5_API_31
```

#### Building and Running the App

With the emulator running and Metro dev server active:

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

The app will build, install on the emulator, and launch automatically.

#### Development

While developing, keep both the Metro dev server and emulator running. The app will hot-reload when you save changes.

To manually reload the app: Press <kbd>R</kbd> twice or use <kbd>Ctrl</kbd> + <kbd>M</kbd> to open the Dev Menu on the emulator.

#### Troubleshooting Android Issues

- **Port already in use**: If Metro port 8081 is in use, run `npm start -- --port 8082`
- **Build failures**: Try running `cd android && ./gradlew clean && cd ..` then retry
- **Emulator not detecting app**: Restart the emulator and try again

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
