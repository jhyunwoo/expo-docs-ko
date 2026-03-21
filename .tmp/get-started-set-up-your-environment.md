---
modificationDate: January 29, 2026
title: Set up your environment
description: Learn how to set up your development environment to start building with Expo.
---

# Set up your environment

Learn how to set up your development environment to start building with Expo.

Let's set up a local development environment for running your project on Android and iOS.

## Where would you like to develop?

We recommend using a real device to develop, since you'll get to see exactly what your users will see.

## How would you like to develop?

Expo Go is a playground for students and learners to try Expo quickly. A development build is a build of your own app that includes Expo's developer tools.

## Android device with Expo Go

### Set up an Android device with Expo Go

Scan the QR code to download the app from the Google Play Store, or visit the Expo Go page on the [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=docs).

  Download link: [https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=docs](https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=docs)

---

## Android device with a development build (EAS)

### Set up an Android device with a development build

#### Install EAS CLI

To build your app, you will need to install EAS CLI. You can do this by running the following command in your terminal:

```sh
npm install -g eas-cli
```

#### Create an Expo account and login

To build your app, you will need to create an Expo account and login to the EAS CLI.

1. [Sign up](https://expo.dev/signup) for an Expo account.
2. Run the following command in your terminal to log in to the EAS CLI:
   
```sh
eas login
```

#### Configure your project

Run the following command to create an EAS config in your project:

```sh
eas build:configure
```

#### Create a build

Run the following command to create a development build:

```sh
eas build --platform android --profile development
```

#### Install the development build on your device

After the build is complete, scan the QR code in your terminal or open the link on your device. Tap **Install** to download the build on your device, then tap **Open** to install it.

---

## Android device with a development build (local)

### Set up an Android device with a development build

### Install Watchman and JDK

##### macOS

##### Prerequisites

Use a package manager such as [Homebrew](https://brew.sh/) to install the following dependency.

##### Install dependencies

[Install Watchman](https://facebook.github.io/watchman/docs/install#macos) using a tool such as Homebrew:

```sh
brew install watchman
```

Install OpenJDK distribution called Azul Zulu using Homebrew. This distribution offers JDKs for both Apple Silicon and Intel Macs.

Run the following commands in a terminal:

```sh
brew install --cask zulu@17
```

After you install the JDK, add the `JAVA_HOME` environment variable in **~/.bash_profile** (or **~/.zshrc** if you use Zsh):

```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
```

##### Windows

##### Prerequisites

Use a package manager such as [Chocolatey](https://chocolatey.org/) to install the following dependencies.

##### Install dependencies

Install [Java SE Development Kit (JDK)](https://openjdk.org/):

```sh
choco install -y microsoft-openjdk17
```

##### Linux

##### Install dependencies

Follow [instructions from the Watchman documentation](https://facebook.github.io/watchman/docs/install#linux) to compile and install it from the source.

Install [Java SE Development Kit (JDK)](https://openjdk.org/):

You can download and install [OpenJDK@17](http://openjdk.java.net/) from [AdoptOpenJDK](https://adoptopenjdk.net/) or your system packager.

### Set up Android Studio

##### macOS

Download and install [Android Studio](https://developer.android.com/studio).

Open the **Android Studio** app, you will see the **SDK Components setup** screen. Click **Next** to continue to install the Android SDK and Android SDK Platform. Click **Next** again to verify the settings and install.

By default, Android Studio will install the latest version of the Android SDK. However, Android 15 (`VanillaIceCream`) SDK is required to compile a React Native app.

Open Android Studio, go to **Settings** > **Languages & Frameworks** > **Android SDK**. From the **SDK Platforms** tab, and under **Android 15 (`VanillaIceCream`)**, select **Android SDK Platform 35** and **Sources for Android 35**.

Then, click on the **SDK Tools** tab and make sure you have at least one version of the **Android SDK Build-Tools** and **Android Emulator** installed.

Copy or remember the path listed in the box that says **Android SDK Location**.

Add the following lines to your **/.zprofile** or **~/.zshrc** (if you are using bash, then **~/.bash_profile** or **~/.bashrc**) config file:

```sh
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Reload the path environment variables in your current shell:

```sh
source $HOME/.zshrc
source $HOME/.bashrc
```

Finally, make sure that you can run `adb` from your terminal.

**Troubleshooting: Android Studio not recognizing JDK**

If Android Studio doesn't recognize your homebrew installed JDK, you can create a Gradle configuration file to explicitly set the Java path:

1.  Create a Gradle properties file in your home directory:

    
```sh
touch ~/.gradle/gradle.properties
```

2.  Add the following line to the **gradle.properties** file, replacing the path with your actual Java installation path:

    ```bash gradle.properties
    java.home=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
    ```

3.  If you have an existing `.gradle` folder in your project directory, delete it and reopen your project in Android Studio:

    
```sh
rm -rf .gradle
```

This should resolve issues with Android Studio not detecting your JDK installation.

##### Windows

Download [Android Studio](https://developer.android.com/studio).

Open **Android Studio Setup**. Under **Select components to install**, select Android Studio and Android Virtual Device. Then, click **Next**.

In the Android Studio Setup Wizard, under **Install Type**, select **Standard** and click **Next**.

The Android Studio Setup Wizard will ask you to verify the settings, such as the version of Android SDK, platform-tools, and so on. Click **Next** after you have verified.

In the next window, accept licenses for all available components.

By default, Android Studio will install the latest version of the Android SDK. However, Android 15 (`VanillaIceCream`) SDK is required to compile a React Native app.

Open Android Studio, go to **Settings** > **Languages & Frameworks** > **Android SDK**. From the **SDK Platforms** tab, and under **Android 15 (`VanillaIceCream`)**, select **Android SDK Platform 35** and **Sources for Android 35**.

Then, click on the **SDK Tools** tab and make sure you have at least one version of the **Android SDK Build-Tools** and **Android Emulator** installed.

After the tools installation is complete, configure the `ANDROID_HOME` environment variable. Go to **Windows Control Panel** > **User Accounts** > **User Accounts** (again) > **Change my environment variables** and click **New** to create a new `ANDROID_HOME` user variable. The value of this variable will point to the path to your Android SDK:

**How to find installed SDK location?**

By default, the Android SDK is installed at the following location:

```bash
%LOCALAPPDATA%\Android\Sdk
```

To find the location of the SDK in Android Studio manually, go to **Settings** > **Languages & Frameworks** > **Android SDK**. See the location next to **Android SDK Location**.

To verify that the new environment variable is loaded, open **PowerShell**, and copy and paste the following command:

```sh
Get-ChildItem -Path Env:
```

The command will output all user environment variables. In this list, see if `ANDROID_HOME` has been added.

To add platform-tools to the Path, go to **Windows Control Panel** > **User Accounts** > **User Accounts** (again) > **Change my environment variables** > **Path** > **Edit** > **New** and add the path to the platform-tools to the list as shown below:

**How to find installed platform-tools location**

By default, the platform-tools are installed at the following location:

```bash
%LOCALAPPDATA%\Android\Sdk\platform-tools
```

Finally, make sure that you can run `adb` from the PowerShell. For example, run the `adb --version` to see which version of the `adb` your system is running.

### Running your app on an Android device

#### Install expo-dev-client

Run the following command in your project's root directory:

```sh
npx expo install expo-dev-client
```

#### Enable debugging over USB

Most Android devices can only install and run apps downloaded from Google Play, by default. You will need to enable USB Debugging on your device to install your app during development.

To enable USB debugging on your device, you will first need to enable the "Developer options" menu by going to **Settings** > **About phone** > **Software information** and then tapping the `Build number` row at the bottom seven times. You can then go back to **Settings** > **Developer options** to enable "USB debugging".

#### Plug in your device via USB

Plug in your Android device via USB to your computer.

Check that your device is properly connecting to ADB, the Android Debug Bridge, by running `adb devices` in your terminal. You should see your device listed with `device` listed next to it. For example:

```sh
adb devices
List of devices attached
8AHX0T32K	device
```

#### Run your app

Run the following from your terminal:

```sh
npx expo run:android
```

> This command runs a development server after building your app. You can skip running `npx expo start` on the next page.

---

## Android Emulator with Expo Go

### Set up an Android Emulator with Expo Go

### Set up Android Studio

##### macOS

Download and install [Android Studio](https://developer.android.com/studio).

Open the **Android Studio** app, you will see the **SDK Components setup** screen. Click **Next** to continue to install the Android SDK and Android SDK Platform. Click **Next** again to verify the settings and install.

By default, Android Studio will install the latest version of the Android SDK. However, Android 15 (`VanillaIceCream`) SDK is required to compile a React Native app.

Open Android Studio, go to **Settings** > **Languages & Frameworks** > **Android SDK**. From the **SDK Platforms** tab, and under **Android 15 (`VanillaIceCream`)**, select **Android SDK Platform 35** and **Sources for Android 35**.

Then, click on the **SDK Tools** tab and make sure you have at least one version of the **Android SDK Build-Tools** and **Android Emulator** installed.

Copy or remember the path listed in the box that says **Android SDK Location**.

Add the following lines to your **/.zprofile** or **~/.zshrc** (if you are using bash, then **~/.bash_profile** or **~/.bashrc**) config file:

```sh
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Reload the path environment variables in your current shell:

```sh
source $HOME/.zshrc
source $HOME/.bashrc
```

Finally, make sure that you can run `adb` from your terminal.

**Troubleshooting: Android Studio not recognizing JDK**

If Android Studio doesn't recognize your homebrew installed JDK, you can create a Gradle configuration file to explicitly set the Java path:

1.  Create a Gradle properties file in your home directory:

    
```sh
touch ~/.gradle/gradle.properties
```

2.  Add the following line to the **gradle.properties** file, replacing the path with your actual Java installation path:

    ```bash gradle.properties
    java.home=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
    ```

3.  If you have an existing `.gradle` folder in your project directory, delete it and reopen your project in Android Studio:

    
```sh
rm -rf .gradle
```

This should resolve issues with Android Studio not detecting your JDK installation.

##### Windows

Download [Android Studio](https://developer.android.com/studio).

Open **Android Studio Setup**. Under **Select components to install**, select Android Studio and Android Virtual Device. Then, click **Next**.

In the Android Studio Setup Wizard, under **Install Type**, select **Standard** and click **Next**.

The Android Studio Setup Wizard will ask you to verify the settings, such as the version of Android SDK, platform-tools, and so on. Click **Next** after you have verified.

In the next window, accept licenses for all available components.

By default, Android Studio will install the latest version of the Android SDK. However, Android 15 (`VanillaIceCream`) SDK is required to compile a React Native app.

Open Android Studio, go to **Settings** > **Languages & Frameworks** > **Android SDK**. From the **SDK Platforms** tab, and under **Android 15 (`VanillaIceCream`)**, select **Android SDK Platform 35** and **Sources for Android 35**.

Then, click on the **SDK Tools** tab and make sure you have at least one version of the **Android SDK Build-Tools** and **Android Emulator** installed.

After the tools installation is complete, configure the `ANDROID_HOME` environment variable. Go to **Windows Control Panel** > **User Accounts** > **User Accounts** (again) > **Change my environment variables** and click **New** to create a new `ANDROID_HOME` user variable. The value of this variable will point to the path to your Android SDK:

**How to find installed SDK location?**

By default, the Android SDK is installed at the following location:

```bash
%LOCALAPPDATA%\Android\Sdk
```

To find the location of the SDK in Android Studio manually, go to **Settings** > **Languages & Frameworks** > **Android SDK**. See the location next to **Android SDK Location**.

To verify that the new environment variable is loaded, open **PowerShell**, and copy and paste the following command:

```sh
Get-ChildItem -Path Env:
```

The command will output all user environment variables. In this list, see if `ANDROID_HOME` has been added.

To add platform-tools to the Path, go to **Windows Control Panel** > **User Accounts** > **User Accounts** (again) > **Change my environment variables** > **Path** > **Edit** > **New** and add the path to the platform-tools to the list as shown below:

**How to find installed platform-tools location**

By default, the platform-tools are installed at the following location:

```bash
%LOCALAPPDATA%\Android\Sdk\platform-tools
```

Finally, make sure that you can run `adb` from the PowerShell. For example, run the `adb --version` to see which version of the `adb` your system is running.

### Set up an emulator

On the Android Studio main screen, click **More Actions**, then **Virtual Device Manager** in the dropdown.

Click the **Create device** button.

Under **Add device**, choose the type of hardware you'd like to emulate. We recommend testing against a variety of devices, but if you're unsure where to start, the newest device in the Pixel line could be a good choice.

Select an OS version to load on the emulator (probably one of the system images), and download the image (if required).

Change any other settings you'd like, and press **Finish** to create the emulator. You can now run this emulator anytime by pressing the Play button in the AVD Manager window.

### Install Expo Go

When you start a development server with `npx expo start` on the [start developing](/get-started/start-developing) page, press <kbd>a</kbd> to open the Android Emulator. Expo CLI will install Expo Go automatically.

---

## Android Emulator with a development build (EAS)

### Set up an Android Emulator with a development build

### Set up Android Studio

##### macOS

Download and install [Android Studio](https://developer.android.com/studio).

Open the **Android Studio** app, you will see the **SDK Components setup** screen. Click **Next** to continue to install the Android SDK and Android SDK Platform. Click **Next** again to verify the settings and install.

By default, Android Studio will install the latest version of the Android SDK. However, Android 15 (`VanillaIceCream`) SDK is required to compile a React Native app.

Open Android Studio, go to **Settings** > **Languages & Frameworks** > **Android SDK**. From the **SDK Platforms** tab, and under **Android 15 (`VanillaIceCream`)**, select **Android SDK Platform 35** and **Sources for Android 35**.

Then, click on the **SDK Tools** tab and make sure you have at least one version of the **Android SDK Build-Tools** and **Android Emulator** installed.

Copy or remember the path listed in the box that says **Android SDK Location**.

Add the following lines to your **/.zprofile** or **~/.zshrc** (if you are using bash, then **~/.bash_profile** or **~/.bashrc**) config file:

```sh
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Reload the path environment variables in your current shell:

```sh
source $HOME/.zshrc
source $HOME/.bashrc
```

Finally, make sure that you can run `adb` from your terminal.

**Troubleshooting: Android Studio not recognizing JDK**

If Android Studio doesn't recognize your homebrew installed JDK, you can create a Gradle configuration file to explicitly set the Java path:

1.  Create a Gradle properties file in your home directory:

    
```sh
touch ~/.gradle/gradle.properties
```

2.  Add the following line to the **gradle.properties** file, replacing the path with your actual Java installation path:

    ```bash gradle.properties
    java.home=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
    ```

3.  If you have an existing `.gradle` folder in your project directory, delete it and reopen your project in Android Studio:

    
```sh
rm -rf .gradle
```

This should resolve issues with Android Studio not detecting your JDK installation.

##### Windows

Download [Android Studio](https://developer.android.com/studio).

Open **Android Studio Setup**. Under **Select components to install**, select Android Studio and Android Virtual Device. Then, click **Next**.

In the Android Studio Setup Wizard, under **Install Type**, select **Standard** and click **Next**.

The Android Studio Setup Wizard will ask you to verify the settings, such as the version of Android SDK, platform-tools, and so on. Click **Next** after you have verified.

In the next window, accept licenses for all available components.

By default, Android Studio will install the latest version of the Android SDK. However, Android 15 (`VanillaIceCream`) SDK is required to compile a React Native app.

Open Android Studio, go to **Settings** > **Languages & Frameworks** > **Android SDK**. From the **SDK Platforms** tab, and under **Android 15 (`VanillaIceCream`)**, select **Android SDK Platform 35** and **Sources for Android 35**.

Then, click on the **SDK Tools** tab and make sure you have at least one version of the **Android SDK Build-Tools** and **Android Emulator** installed.

After the tools installation is complete, configure the `ANDROID_HOME` environment variable. Go to **Windows Control Panel** > **User Accounts** > **User Accounts** (again) > **Change my environment variables** and click **New** to create a new `ANDROID_HOME` user variable. The value of this variable will point to the path to your Android SDK:

**How to find installed SDK location?**

By default, the Android SDK is installed at the following location:

```bash
%LOCALAPPDATA%\Android\Sdk
```

To find the location of the SDK in Android Studio manually, go to **Settings** > **Languages & Frameworks** > **Android SDK**. See the location next to **Android SDK Location**.

To verify that the new environment variable is loaded, open **PowerShell**, and copy and paste the following command:

```sh
Get-ChildItem -Path Env:
```

The command will output all user environment variables. In this list, see if `ANDROID_HOME` has been added.

To add platform-tools to the Path, go to **Windows Control Panel** > **User Accounts** > **User Accounts** (again) > **Change my environment variables** > **Path** > **Edit** > **New** and add the path to the platform-tools to the list as shown below:

**How to find installed platform-tools location**

By default, the platform-tools are installed at the following location:

```bash
%LOCALAPPDATA%\Android\Sdk\platform-tools
```

Finally, make sure that you can run `adb` from the PowerShell. For example, run the `adb --version` to see which version of the `adb` your system is running.

### Set up an emulator

On the Android Studio main screen, click **More Actions**, then **Virtual Device Manager** in the dropdown.

Click the **Create device** button.

Under **Add device**, choose the type of hardware you'd like to emulate. We recommend testing against a variety of devices, but if you're unsure where to start, the newest device in the Pixel line could be a good choice.

Select an OS version to load on the emulator (probably one of the system images), and download the image (if required).

Change any other settings you'd like, and press **Finish** to create the emulator. You can now run this emulator anytime by pressing the Play button in the AVD Manager window.

### Create a development build

#### Install EAS CLI

To build your app, you will need to install EAS CLI. You can do this by running the following command in your terminal:

```sh
npm install -g eas-cli
```

#### Create an Expo account and login

To build your app, you will need to create an Expo account and login to the EAS CLI.

1. [Sign up](https://expo.dev/signup) for an Expo account.
2. Run the following command in your terminal to log in to the EAS CLI:
   
```sh
eas login
```

#### Configure your project

Run the following command to create an EAS config in your project:

```sh
eas build:configure
```

#### Create a build

Run the following command to create a development build:

```sh
eas build --platform android --profile development
```

#### Install the development build on your emulator

After the build is complete, the CLI will prompt you to automatically download and install it on the Android Emulator. When prompted, press <kbd>Y</kbd> to directly install it on the emulator.

If you miss this prompt, you can download the build from the link provided in the terminal and drag and drop it onto the Android Emulator to install it.

---

## Android Emulator with a development build (local)

### Set up an Android Emulator with a development build

### Install Watchman and JDK

##### macOS

##### Prerequisites

Use a package manager such as [Homebrew](https://brew.sh/) to install the following dependency.

##### Install dependencies

[Install Watchman](https://facebook.github.io/watchman/docs/install#macos) using a tool such as Homebrew:

```sh
brew install watchman
```

Install OpenJDK distribution called Azul Zulu using Homebrew. This distribution offers JDKs for both Apple Silicon and Intel Macs.

Run the following commands in a terminal:

```sh
brew install --cask zulu@17
```

After you install the JDK, add the `JAVA_HOME` environment variable in **~/.bash_profile** (or **~/.zshrc** if you use Zsh):

```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
```

##### Windows

##### Prerequisites

Use a package manager such as [Chocolatey](https://chocolatey.org/) to install the following dependencies.

##### Install dependencies

Install [Java SE Development Kit (JDK)](https://openjdk.org/):

```sh
choco install -y microsoft-openjdk17
```

##### Linux

##### Install dependencies

Follow [instructions from the Watchman documentation](https://facebook.github.io/watchman/docs/install#linux) to compile and install it from the source.

Install [Java SE Development Kit (JDK)](https://openjdk.org/):

You can download and install [OpenJDK@17](http://openjdk.java.net/) from [AdoptOpenJDK](https://adoptopenjdk.net/) or your system packager.

### Set up Android Studio

##### macOS

Download and install [Android Studio](https://developer.android.com/studio).

Open the **Android Studio** app, you will see the **SDK Components setup** screen. Click **Next** to continue to install the Android SDK and Android SDK Platform. Click **Next** again to verify the settings and install.

By default, Android Studio will install the latest version of the Android SDK. However, Android 15 (`VanillaIceCream`) SDK is required to compile a React Native app.

Open Android Studio, go to **Settings** > **Languages & Frameworks** > **Android SDK**. From the **SDK Platforms** tab, and under **Android 15 (`VanillaIceCream`)**, select **Android SDK Platform 35** and **Sources for Android 35**.

Then, click on the **SDK Tools** tab and make sure you have at least one version of the **Android SDK Build-Tools** and **Android Emulator** installed.

Copy or remember the path listed in the box that says **Android SDK Location**.

Add the following lines to your **/.zprofile** or **~/.zshrc** (if you are using bash, then **~/.bash_profile** or **~/.bashrc**) config file:

```sh
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Reload the path environment variables in your current shell:

```sh
source $HOME/.zshrc
source $HOME/.bashrc
```

Finally, make sure that you can run `adb` from your terminal.

**Troubleshooting: Android Studio not recognizing JDK**

If Android Studio doesn't recognize your homebrew installed JDK, you can create a Gradle configuration file to explicitly set the Java path:

1.  Create a Gradle properties file in your home directory:

    
```sh
touch ~/.gradle/gradle.properties
```

2.  Add the following line to the **gradle.properties** file, replacing the path with your actual Java installation path:

    ```bash gradle.properties
    java.home=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
    ```

3.  If you have an existing `.gradle` folder in your project directory, delete it and reopen your project in Android Studio:

    
```sh
rm -rf .gradle
```

This should resolve issues with Android Studio not detecting your JDK installation.

##### Windows

Download [Android Studio](https://developer.android.com/studio).

Open **Android Studio Setup**. Under **Select components to install**, select Android Studio and Android Virtual Device. Then, click **Next**.

In the Android Studio Setup Wizard, under **Install Type**, select **Standard** and click **Next**.

The Android Studio Setup Wizard will ask you to verify the settings, such as the version of Android SDK, platform-tools, and so on. Click **Next** after you have verified.

In the next window, accept licenses for all available components.

By default, Android Studio will install the latest version of the Android SDK. However, Android 15 (`VanillaIceCream`) SDK is required to compile a React Native app.

Open Android Studio, go to **Settings** > **Languages & Frameworks** > **Android SDK**. From the **SDK Platforms** tab, and under **Android 15 (`VanillaIceCream`)**, select **Android SDK Platform 35** and **Sources for Android 35**.

Then, click on the **SDK Tools** tab and make sure you have at least one version of the **Android SDK Build-Tools** and **Android Emulator** installed.

After the tools installation is complete, configure the `ANDROID_HOME` environment variable. Go to **Windows Control Panel** > **User Accounts** > **User Accounts** (again) > **Change my environment variables** and click **New** to create a new `ANDROID_HOME` user variable. The value of this variable will point to the path to your Android SDK:

**How to find installed SDK location?**

By default, the Android SDK is installed at the following location:

```bash
%LOCALAPPDATA%\Android\Sdk
```

To find the location of the SDK in Android Studio manually, go to **Settings** > **Languages & Frameworks** > **Android SDK**. See the location next to **Android SDK Location**.

To verify that the new environment variable is loaded, open **PowerShell**, and copy and paste the following command:

```sh
Get-ChildItem -Path Env:
```

The command will output all user environment variables. In this list, see if `ANDROID_HOME` has been added.

To add platform-tools to the Path, go to **Windows Control Panel** > **User Accounts** > **User Accounts** (again) > **Change my environment variables** > **Path** > **Edit** > **New** and add the path to the platform-tools to the list as shown below:

**How to find installed platform-tools location**

By default, the platform-tools are installed at the following location:

```bash
%LOCALAPPDATA%\Android\Sdk\platform-tools
```

Finally, make sure that you can run `adb` from the PowerShell. For example, run the `adb --version` to see which version of the `adb` your system is running.

### Set up an emulator

On the Android Studio main screen, click **More Actions**, then **Virtual Device Manager** in the dropdown.

Click the **Create device** button.

Under **Add device**, choose the type of hardware you'd like to emulate. We recommend testing against a variety of devices, but if you're unsure where to start, the newest device in the Pixel line could be a good choice.

Select an OS version to load on the emulator (probably one of the system images), and download the image (if required).

Change any other settings you'd like, and press **Finish** to create the emulator. You can now run this emulator anytime by pressing the Play button in the AVD Manager window.

### Running your app on an Android Emulator

#### Install expo-dev-client

Run the following command in your project's root directory:

```sh
npx expo install expo-dev-client
```

Run the following from your terminal:

```sh
npx expo run:android
```

> This command runs a development server after building your app. You can skip running `npx expo start` on the next page.

---

## iOS device with Expo Go

### Set up an iOS device with Expo Go

#### Enroll in the Apple Developer Program

To install Expo Go on your iOS device, you will need an active subscription to the Apple Developer Program. Sign up for the [Apple Developer Program here](https://developer.apple.com/programs/).

#### Build Expo Go for iOS

Run the following command to build Expo Go:

```sh
npx eas-cli@latest go
```

#### Install TestFlight

Download and install the [TestFlight app](https://apps.apple.com/us/app/testflight/id899247664). You can also scan the QR code below on your iOS device:

Download link: [https://apps.apple.com/us/app/testflight/id899247664](https://apps.apple.com/us/app/testflight/id899247664)

#### Add yourself as a tester

1. Go to [App Store Connect](https://appstoreconnect.apple.com).
2. Select the Expo Go app.
3. Navigate to the "TestFlight" tab.
4. Add your Apple ID email as an internal tester.

Once you do, you should receive an email invitation to join the TestFlight beta. When you accept the invitation, you can install Expo Go on your iOS device.

---

## iOS device with a development build (EAS)

### Set up an iOS device with a development build

#### Enroll in the Apple Developer Program

To install a development build on your iOS device, you will need an active subscription to the Apple Developer Program. Sign up for the [Apple Developer Program here](https://developer.apple.com/programs/).

#### Install EAS CLI

To build your app, you will need to install EAS CLI. You can do this by running the following command in your terminal:

```sh
npm install -g eas-cli
```

#### Create an Expo account and login

Next, you will need to create an Expo account and login to the EAS CLI.

1. [Sign up](https://expo.dev/signup) for an Expo account.
2. Run the following command in your terminal to log in to the EAS CLI:
   
```sh
eas login
```

#### Configure your project

Run the following command to create an EAS config in your project:

```sh
eas build:configure
```

#### Create an ad hoc provisioning profile

To install a development build on your iOS device, you will need to create an ad hoc provisioning profile. Create one by running the following command in your terminal:

```sh
eas device:create
```

#### Create a development build

Run the following command to create a development build:

```sh
eas build --platform ios --profile development
```

#### Install the development build on your device

After the build is complete, scan the QR code in your terminal and tap **Open with iTunes** when it appears inside the Camera app. Alternatively, open the link displayed in the terminal on your device.

After confirming the installation, the app will appear in your device's app library.

#### Turn on developer mode

1. Open **Settings** > **Privacy & Security**, scroll down to the **Developer Mode** list item and navigate into it.
2. Tap the switch to enable **Developer Mode**. After you do so, Settings presents an alert to warn you that Developer Mode reduces your device's security. To continue enabling **Developer Mode**, tap the alert's **Restart** button.
3. After the device restarts and you unlock it, the device shows an alert confirming that you want to enable Developer Mode. Tap **Turn On**, and enter your device passcode when prompted.

> Alternatively, if you have Xcode installed on your Mac, you can use it to [enable iOS developer mode](/guides/ios-developer-mode/#connect-an-ios-device-with-a-mac).

---

## iOS device with a development build (local)

### Set up an iOS device with a development build

### Set up Xcode and Watchman

#### Install Xcode

Open up the Mac App Store, search for [Xcode](https://apps.apple.com/us/app/xcode/id497799835), and click **Install** (or **Update** if you have it already).

#### Install Xcode Command Line Tools

Open Xcode, choose **Settings...** from the Xcode menu (or press <kbd>cmd ⌘</kbd> + <kbd>,</kbd>). Go to the **Locations** and install the tools by selecting the most recent version in the **Command Line Tools** dropdown.

#### Install an iOS Simulator in Xcode

To install an iOS Simulator, open **Xcode > Settings... > Components**, and under **Platform Support > iOS ...**, click **Get**.

#### Install Watchman

[Watchman](https://facebook.github.io/watchman/docs/install#macos) is a tool for watching changes in the filesystem. Installing it will result in better performance. You can install it with:

```sh
brew update
brew install watchman
```

### Configure your project

#### Install expo-dev-client

Run the following command in your project's root directory:

```sh
npx expo install expo-dev-client
```

#### Plug in your device via USB and enable developer mode

1. Connect your iOS device to your Mac using a USB cable. Unlock the device and tap **Trust** if prompted.

2. Open Xcode. From the menu bar, select **Window** > **Devices and Simulators**. You will see a warning in Xcode to enable developer mode.

3. On your iOS device, open **Settings** > **Privacy & Security**, scroll down to the **Developer Mode** list item and navigate into it.

4. Tap the switch to enable **Developer Mode**. After you do so, Settings presents an alert to warn you that Developer Mode reduces your device's security. To continue enabling **Developer Mode**, tap the alert's **Restart** button.

5. After the device restarts and you unlock it, the device shows an alert confirming that you want to enable Developer Mode. Tap **Turn On**, and enter your device passcode when prompted.

#### Run the project on your device

1. Add the `ios.bundleIdentifier` in the **app.json** file in the root directory to a unique value so that Xcode generates the provisioning profile for the app signing step.

2. Run the following command in your project's root directory and select your plugged in device from the list:

```sh
npx expo run:ios --device
```

> This command runs a development server after building your app. You can skip running `npx expo start` on the next page.

---

## iOS Simulator with Expo Go

### Set up an iOS Simulator with Expo Go

### Set up Xcode

#### Install Xcode

Open up the Mac App Store, search for [Xcode](https://apps.apple.com/us/app/xcode/id497799835), and click **Install** (or **Update** if you have it already).

#### Install Xcode Command Line Tools

Open Xcode, choose **Settings...** from the Xcode menu (or press <kbd>cmd ⌘</kbd> + <kbd>,</kbd>). Go to the **Locations** and install the tools by selecting the most recent version in the **Command Line Tools** dropdown.

#### Install an iOS Simulator in Xcode

To install an iOS Simulator, open **Xcode > Settings... > Components**, and under **Platform Support > iOS ...**, click **Get**.

#### Install Watchman

[Watchman](https://facebook.github.io/watchman/docs/install#macos) is a tool for watching changes in the filesystem. Installing it will result in better performance. You can install it with:

```sh
brew update
brew install watchman
```

### Install Expo Go

When you start a development server with `npx expo start` on the [start developing](/get-started/start-developing) page, press <kbd>i</kbd> to open the iOS Simulator. Expo CLI will install Expo Go automatically.

---

## iOS Simulator with a development build (EAS)

### Set up an iOS Simulator with a development build

### Set up Xcode

#### Install Xcode

Open up the Mac App Store, search for [Xcode](https://apps.apple.com/us/app/xcode/id497799835), and click **Install** (or **Update** if you have it already).

#### Install Xcode Command Line Tools

Open Xcode, choose **Settings...** from the Xcode menu (or press <kbd>cmd ⌘</kbd> + <kbd>,</kbd>). Go to the **Locations** and install the tools by selecting the most recent version in the **Command Line Tools** dropdown.

#### Install an iOS Simulator in Xcode

To install an iOS Simulator, open **Xcode > Settings... > Components**, and under **Platform Support > iOS ...**, click **Get**.

#### Install Watchman

[Watchman](https://facebook.github.io/watchman/docs/install#macos) is a tool for watching changes in the filesystem. Installing it will result in better performance. You can install it with:

```sh
brew update
brew install watchman
```

### Create a development build

#### Install EAS CLI

To build your app, you will need to install EAS CLI. You can do this by running the following command in your terminal:

```sh
npm install -g eas-cli
```

#### Create an Expo account and login

Next, you will need to create an Expo account and login to the EAS CLI.

1. [Sign up](https://expo.dev/signup) for an Expo account.
2. Run the following command in your terminal to log in to the EAS CLI:
   
```sh
eas login
```

#### Configure your project

Run the following command to create an EAS config in your project:

```sh
eas build:configure
```

#### Adjust your build profile

To create a simulator-compatible development build, you'll need to update your build profile in **eas.json** to set the `ios.simulator` property to `true`:

```json eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      /* @info */
      "ios": {
        "simulator": true
      }
      /* @end */
    }
  }
}
```

#### Create a development build

Run the following command to create a development build:

```sh
eas build --platform ios --profile development
```

#### Install the development build on your simulator

After the build is complete, the CLI will prompt you to automatically download and install it on the iOS Simulator. When prompted, press <kbd>Y</kbd> to directly install it on the simulator.

If you miss this prompt, you can download the build from the link provided in the terminal and drag and drop it onto the iOS Simulator to install it.

---

## iOS Simulator with a development build (local)

### Set up an iOS Simulator with a development build

### Set up Xcode and Watchman

#### Install Xcode

Open up the Mac App Store, search for [Xcode](https://apps.apple.com/us/app/xcode/id497799835), and click **Install** (or **Update** if you have it already).

#### Install Xcode Command Line Tools

Open Xcode, choose **Settings...** from the Xcode menu (or press <kbd>cmd ⌘</kbd> + <kbd>,</kbd>). Go to the **Locations** and install the tools by selecting the most recent version in the **Command Line Tools** dropdown.

#### Install an iOS Simulator in Xcode

To install an iOS Simulator, open **Xcode > Settings... > Components**, and under **Platform Support > iOS ...**, click **Get**.

#### Install Watchman

[Watchman](https://facebook.github.io/watchman/docs/install#macos) is a tool for watching changes in the filesystem. Installing it will result in better performance. You can install it with:

```sh
brew update
brew install watchman
```

### Running your app on an iOS Simulator

#### Install expo-dev-client

Run the following command in your project's root directory:

```sh
npx expo install expo-dev-client
```

Run the following from your terminal:

```sh
npx expo run:ios
```

> This command runs a development server after building your app. You can skip running `npx expo start` on the next page.

## Next step

You have a project and a development environment. Now it's time to start developing.
