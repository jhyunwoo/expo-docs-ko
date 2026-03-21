---
modificationDate: January 29, 2026
title: 개발 환경 설정하기
description: Expo로 빌드를 시작할 수 있도록 개발 환경을 설정하는 방법을 알아보세요.
---

# 개발 환경 설정하기

Expo로 빌드를 시작할 수 있도록 개발 환경을 설정하는 방법을 알아보세요.

Android와 iOS에서 프로젝트를 실행할 수 있도록 로컬 개발 환경을 설정해 봅시다.

## 어디에서 개발하시겠어요?

실제 사용자가 보게 될 화면을 그대로 확인할 수 있으므로 실제 기기에서 개발하는 것을 권장합니다.

## 어떤 방식으로 개발하시겠어요?

Expo Go는 학생과 학습자가 Expo를 빠르게 체험해 볼 수 있는 playground입니다. development build는 Expo의 개발자 도구가 포함된 여러분의 앱 빌드입니다.

## Expo Go를 사용하는 Android 기기

### Expo Go로 Android 기기 설정하기

QR 코드를 스캔해 Google Play Store에서 앱을 다운로드하거나, [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=docs)의 Expo Go 페이지를 방문하세요.

  다운로드 링크: [https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=docs](https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=docs)

---

## development build(EAS)을 사용하는 Android 기기

### development build로 Android 기기 설정하기

#### EAS CLI 설치

앱을 빌드하려면 EAS CLI를 설치해야 합니다. 터미널에서 다음 명령을 실행하세요:

```sh
npm install -g eas-cli
```

#### Expo 계정 만들기 및 로그인

앱을 빌드하려면 Expo 계정을 만들고 EAS CLI에 로그인해야 합니다.

1. [Sign up](https://expo.dev/signup)에서 Expo 계정을 만드세요.
2. 터미널에서 다음 명령을 실행해 EAS CLI에 로그인하세요:
   
```sh
eas login
```

#### 프로젝트 구성

프로젝트에 EAS config를 만들려면 다음 명령을 실행하세요:

```sh
eas build:configure
```

#### build 만들기

development build를 만들려면 다음 명령을 실행하세요:

```sh
eas build --platform android --profile development
```

#### 기기에 development build 설치

build가 완료되면 터미널의 QR 코드를 스캔하거나 기기에서 링크를 여세요. **Install**을 눌러 기기에 build를 다운로드한 뒤 **Open**을 눌러 설치하세요.

---

## development build(local)를 사용하는 Android 기기

### development build로 Android 기기 설정하기

### Watchman 및 JDK 설치

##### macOS

##### Prerequisites

[Homebrew](https://brew.sh/) 같은 package manager를 사용해 다음 dependency를 설치하세요.

##### Install dependencies

Homebrew 같은 도구를 사용해 [Watchman 설치](https://facebook.github.io/watchman/docs/install#macos)를 진행하세요:

```sh
brew install watchman
```

Homebrew를 사용해 Azul Zulu라는 OpenJDK distribution을 설치하세요. 이 distribution은 Apple Silicon Mac과 Intel Mac 모두를 위한 JDK를 제공합니다.

터미널에서 다음 명령을 실행하세요:

```sh
brew install --cask zulu@17
```

JDK를 설치한 뒤 **~/.bash_profile**에 `JAVA_HOME` environment variable을 추가하세요. Zsh를 사용한다면 **~/.zshrc**에 추가하세요:

```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
```

##### Windows

##### Prerequisites

[Chocolatey](https://chocolatey.org/) 같은 package manager를 사용해 다음 dependency를 설치하세요.

##### Install dependencies

[Java SE Development Kit (JDK)](https://openjdk.org/)를 설치하세요:

```sh
choco install -y microsoft-openjdk17
```

##### Linux

##### Install dependencies

[Watchman documentation](https://facebook.github.io/watchman/docs/install#linux)의 안내에 따라 source로부터 컴파일하고 설치하세요.

[Java SE Development Kit (JDK)](https://openjdk.org/)를 설치하세요:

[OpenJDK@17](http://openjdk.java.net/)을 [AdoptOpenJDK](https://adoptopenjdk.net/) 또는 시스템 package manager를 통해 다운로드하고 설치할 수 있습니다.

### Android Studio 설정

##### macOS

[Android Studio](https://developer.android.com/studio)를 다운로드하고 설치하세요.

**Android Studio** 앱을 열면 **SDK Components setup** 화면이 표시됩니다. **Next**를 눌러 Android SDK와 Android SDK Platform 설치를 계속하세요. 설정을 확인하고 설치하려면 다시 한 번 **Next**를 누르세요.

기본적으로 Android Studio는 최신 버전의 Android SDK를 설치합니다. 하지만 React Native 앱을 컴파일하려면 Android 15 (`VanillaIceCream`) SDK가 필요합니다.

Android Studio를 열고 **Settings** > **Languages & Frameworks** > **Android SDK**로 이동하세요. **SDK Platforms** 탭에서 **Android 15 (`VanillaIceCream`)** 아래의 **Android SDK Platform 35**와 **Sources for Android 35**를 선택하세요.

그다음 **SDK Tools** 탭을 클릭하고 **Android SDK Build-Tools**와 **Android Emulator**가 각각 최소 한 버전 이상 설치되어 있는지 확인하세요.

**Android SDK Location**이라고 표시된 상자의 경로를 복사하거나 기억해 두세요.

다음 줄을 **/.zprofile** 또는 **~/.zshrc**에 추가하세요. bash를 사용한다면 **~/.bash_profile** 또는 **~/.bashrc**에 추가하세요:

```sh
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

현재 shell에서 path environment variable을 다시 불러오세요:

```sh
source $HOME/.zshrc
source $HOME/.bashrc
```

마지막으로 터미널에서 `adb`를 실행할 수 있는지 확인하세요.

**Troubleshooting: Android Studio not recognizing JDK**

Android Studio가 homebrew로 설치한 JDK를 인식하지 못한다면, Java 경로를 명시적으로 설정하는 Gradle configuration file을 만들 수 있습니다:

1.  홈 디렉터리에 Gradle properties file을 만드세요:

    
```sh
touch ~/.gradle/gradle.properties
```

2.  **gradle.properties** 파일에 다음 줄을 추가하세요. 경로는 실제 Java 설치 경로로 바꾸세요:

    ```bash gradle.properties
    java.home=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
    ```

3.  프로젝트 디렉터리에 기존 `.gradle` 폴더가 있다면 삭제한 뒤 Android Studio에서 프로젝트를 다시 여세요:

    
```sh
rm -rf .gradle
```

이렇게 하면 Android Studio가 JDK 설치를 감지하지 못하는 문제를 해결할 수 있습니다.

##### Windows

[Android Studio](https://developer.android.com/studio)를 다운로드하세요.

**Android Studio Setup**을 여세요. **Select components to install**에서 Android Studio와 Android Virtual Device를 선택한 뒤 **Next**를 누르세요.

Android Studio Setup Wizard의 **Install Type**에서 **Standard**를 선택하고 **Next**를 누르세요.

Android Studio Setup Wizard는 Android SDK 버전, platform-tools 등 설정을 확인하라고 요청합니다. 확인을 마친 뒤 **Next**를 누르세요.

다음 창에서 사용 가능한 모든 component의 license를 수락하세요.

기본적으로 Android Studio는 최신 버전의 Android SDK를 설치합니다. 하지만 React Native 앱을 컴파일하려면 Android 15 (`VanillaIceCream`) SDK가 필요합니다.

Android Studio를 열고 **Settings** > **Languages & Frameworks** > **Android SDK**로 이동하세요. **SDK Platforms** 탭에서 **Android 15 (`VanillaIceCream`)** 아래의 **Android SDK Platform 35**와 **Sources for Android 35**를 선택하세요.

그다음 **SDK Tools** 탭을 클릭하고 **Android SDK Build-Tools**와 **Android Emulator**가 각각 최소 한 버전 이상 설치되어 있는지 확인하세요.

도구 설치가 끝나면 `ANDROID_HOME` environment variable을 설정하세요. **Windows Control Panel** > **User Accounts** > **User Accounts**(다시) > **Change my environment variables**로 이동하고, **New**를 눌러 새 `ANDROID_HOME` user variable을 만드세요. 이 변수의 값은 Android SDK 경로를 가리켜야 합니다:

**설치된 SDK 위치 찾는 방법**

기본적으로 Android SDK는 다음 위치에 설치됩니다:

```bash
%LOCALAPPDATA%\Android\Sdk
```

Android Studio에서 SDK 위치를 수동으로 찾으려면 **Settings** > **Languages & Frameworks** > **Android SDK**로 이동하세요. **Android SDK Location** 옆의 위치를 확인할 수 있습니다.

새 environment variable이 제대로 로드되었는지 확인하려면 **PowerShell**을 열고 다음 명령을 복사해 붙여 넣으세요:

```sh
Get-ChildItem -Path Env:
```

이 명령은 모든 user environment variable을 출력합니다. 이 목록에 `ANDROID_HOME`이 추가되었는지 확인하세요.

platform-tools를 Path에 추가하려면 **Windows Control Panel** > **User Accounts** > **User Accounts**(다시) > **Change my environment variables** > **Path** > **Edit** > **New**로 이동한 뒤 아래와 같이 platform-tools 경로를 목록에 추가하세요:

**설치된 platform-tools 위치 찾는 방법**

기본적으로 platform-tools는 다음 위치에 설치됩니다:

```bash
%LOCALAPPDATA%\Android\Sdk\platform-tools
```

마지막으로 PowerShell에서 `adb`를 실행할 수 있는지 확인하세요. 예를 들어 `adb --version`을 실행해 시스템에서 어떤 버전의 `adb`가 동작하는지 확인할 수 있습니다.

### Android 기기에서 앱 실행하기

#### expo-dev-client 설치

프로젝트 루트 디렉터리에서 다음 명령을 실행하세요:

```sh
npx expo install expo-dev-client
```

#### USB 디버깅 활성화

대부분의 Android 기기는 기본적으로 Google Play에서 다운로드한 앱만 설치하고 실행할 수 있습니다. 개발 중 앱을 설치하려면 기기에서 USB Debugging을 활성화해야 합니다.

기기에서 USB debugging을 활성화하려면 먼저 **Settings** > **About phone** > **Software information**으로 이동한 뒤 맨 아래의 `Build number` 행을 일곱 번 눌러 "Developer options" 메뉴를 활성화해야 합니다. 그런 다음 **Settings** > **Developer options**로 돌아가 "USB debugging"을 활성화할 수 있습니다.

#### USB로 기기 연결

Android 기기를 USB로 컴퓨터에 연결하세요.

터미널에서 `adb devices`를 실행해 Android Debug Bridge인 ADB에 기기가 제대로 연결되었는지 확인하세요. 기기 옆에 `device`가 표시된 상태로 목록에 나타나야 합니다. 예:

```sh
adb devices
List of devices attached
8AHX0T32K	device
```

#### 앱 실행

터미널에서 다음 명령을 실행하세요:

```sh
npx expo run:android
```

> 이 명령은 앱을 빌드한 뒤 development server도 함께 실행합니다. 다음 페이지에서 `npx expo start`를 따로 실행하지 않아도 됩니다.

---

## Expo Go를 사용하는 Android Emulator

### Expo Go로 Android Emulator 설정하기

### Android Studio 설정

##### macOS

[Android Studio](https://developer.android.com/studio)를 다운로드하고 설치하세요.

**Android Studio** 앱을 열면 **SDK Components setup** 화면이 표시됩니다. **Next**를 눌러 Android SDK와 Android SDK Platform 설치를 계속하세요. 설정을 확인하고 설치하려면 다시 한 번 **Next**를 누르세요.

기본적으로 Android Studio는 최신 버전의 Android SDK를 설치합니다. 하지만 React Native 앱을 컴파일하려면 Android 15 (`VanillaIceCream`) SDK가 필요합니다.

Android Studio를 열고 **Settings** > **Languages & Frameworks** > **Android SDK**로 이동하세요. **SDK Platforms** 탭에서 **Android 15 (`VanillaIceCream`)** 아래의 **Android SDK Platform 35**와 **Sources for Android 35**를 선택하세요.

그다음 **SDK Tools** 탭을 클릭하고 **Android SDK Build-Tools**와 **Android Emulator**가 각각 최소 한 버전 이상 설치되어 있는지 확인하세요.

**Android SDK Location**이라고 표시된 상자의 경로를 복사하거나 기억해 두세요.

다음 줄을 **/.zprofile** 또는 **~/.zshrc**에 추가하세요. bash를 사용한다면 **~/.bash_profile** 또는 **~/.bashrc**에 추가하세요:

```sh
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

현재 shell에서 path environment variable을 다시 불러오세요:

```sh
source $HOME/.zshrc
source $HOME/.bashrc
```

마지막으로 터미널에서 `adb`를 실행할 수 있는지 확인하세요.

**Troubleshooting: Android Studio not recognizing JDK**

Android Studio가 homebrew로 설치한 JDK를 인식하지 못한다면, Java 경로를 명시적으로 설정하는 Gradle configuration file을 만들 수 있습니다:

1.  홈 디렉터리에 Gradle properties file을 만드세요:

    
```sh
touch ~/.gradle/gradle.properties
```

2.  **gradle.properties** 파일에 다음 줄을 추가하세요. 경로는 실제 Java 설치 경로로 바꾸세요:

    ```bash gradle.properties
    java.home=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
    ```

3.  프로젝트 디렉터리에 기존 `.gradle` 폴더가 있다면 삭제한 뒤 Android Studio에서 프로젝트를 다시 여세요:

    
```sh
rm -rf .gradle
```

이렇게 하면 Android Studio가 JDK 설치를 감지하지 못하는 문제를 해결할 수 있습니다.

##### Windows

[Android Studio](https://developer.android.com/studio)를 다운로드하세요.

**Android Studio Setup**을 여세요. **Select components to install**에서 Android Studio와 Android Virtual Device를 선택한 뒤 **Next**를 누르세요.

Android Studio Setup Wizard의 **Install Type**에서 **Standard**를 선택하고 **Next**를 누르세요.

Android Studio Setup Wizard는 Android SDK 버전, platform-tools 등 설정을 확인하라고 요청합니다. 확인을 마친 뒤 **Next**를 누르세요.

다음 창에서 사용 가능한 모든 component의 license를 수락하세요.

기본적으로 Android Studio는 최신 버전의 Android SDK를 설치합니다. 하지만 React Native 앱을 컴파일하려면 Android 15 (`VanillaIceCream`) SDK가 필요합니다.

Android Studio를 열고 **Settings** > **Languages & Frameworks** > **Android SDK**로 이동하세요. **SDK Platforms** 탭에서 **Android 15 (`VanillaIceCream`)** 아래의 **Android SDK Platform 35**와 **Sources for Android 35**를 선택하세요.

그다음 **SDK Tools** 탭을 클릭하고 **Android SDK Build-Tools**와 **Android Emulator**가 각각 최소 한 버전 이상 설치되어 있는지 확인하세요.

도구 설치가 끝나면 `ANDROID_HOME` environment variable을 설정하세요. **Windows Control Panel** > **User Accounts** > **User Accounts**(다시) > **Change my environment variables**로 이동하고, **New**를 눌러 새 `ANDROID_HOME` user variable을 만드세요. 이 변수의 값은 Android SDK 경로를 가리켜야 합니다:

**설치된 SDK 위치 찾는 방법**

기본적으로 Android SDK는 다음 위치에 설치됩니다:

```bash
%LOCALAPPDATA%\Android\Sdk
```

Android Studio에서 SDK 위치를 수동으로 찾으려면 **Settings** > **Languages & Frameworks** > **Android SDK**로 이동하세요. **Android SDK Location** 옆의 위치를 확인할 수 있습니다.

새 environment variable이 제대로 로드되었는지 확인하려면 **PowerShell**을 열고 다음 명령을 복사해 붙여 넣으세요:

```sh
Get-ChildItem -Path Env:
```

이 명령은 모든 user environment variable을 출력합니다. 이 목록에 `ANDROID_HOME`이 추가되었는지 확인하세요.

platform-tools를 Path에 추가하려면 **Windows Control Panel** > **User Accounts** > **User Accounts**(다시) > **Change my environment variables** > **Path** > **Edit** > **New**로 이동한 뒤 아래와 같이 platform-tools 경로를 목록에 추가하세요:

**설치된 platform-tools 위치 찾는 방법**

기본적으로 platform-tools는 다음 위치에 설치됩니다:

```bash
%LOCALAPPDATA%\Android\Sdk\platform-tools
```

마지막으로 PowerShell에서 `adb`를 실행할 수 있는지 확인하세요. 예를 들어 `adb --version`을 실행해 시스템에서 어떤 버전의 `adb`가 동작하는지 확인할 수 있습니다.

### Emulator 설정

Android Studio 메인 화면에서 **More Actions**를 클릭한 다음 dropdown에서 **Virtual Device Manager**를 선택하세요.

**Create device** 버튼을 클릭하세요.

**Add device** 아래에서 에뮬레이션할 hardware 유형을 선택하세요. 다양한 기기에서 테스트해 보는 것을 권장하지만, 어디서 시작해야 할지 모르겠다면 Pixel 라인의 최신 기기를 선택하는 것도 좋은 방법입니다.

Emulator에 로드할 OS 버전(대개 system image 중 하나)을 선택하고, 필요하다면 image를 다운로드하세요.

원하는 다른 설정을 조정한 뒤 **Finish**를 눌러 emulator를 만드세요. 이제 AVD Manager 창의 Play 버튼을 눌러 언제든 이 emulator를 실행할 수 있습니다.

### Expo Go 설치

[start developing](/get-started/start-developing) 페이지에서 `npx expo start`로 development server를 시작한 뒤 <kbd>a</kbd>를 눌러 Android Emulator를 여세요. Expo CLI가 Expo Go를 자동으로 설치합니다.

---

## development build(EAS)을 사용하는 Android Emulator

### development build로 Android Emulator 설정하기

### Android Studio 설정

##### macOS

[Android Studio](https://developer.android.com/studio)를 다운로드하고 설치하세요.

**Android Studio** 앱을 열면 **SDK Components setup** 화면이 표시됩니다. **Next**를 눌러 Android SDK와 Android SDK Platform 설치를 계속하세요. 설정을 확인하고 설치하려면 다시 한 번 **Next**를 누르세요.

기본적으로 Android Studio는 최신 버전의 Android SDK를 설치합니다. 하지만 React Native 앱을 컴파일하려면 Android 15 (`VanillaIceCream`) SDK가 필요합니다.

Android Studio를 열고 **Settings** > **Languages & Frameworks** > **Android SDK**로 이동하세요. **SDK Platforms** 탭에서 **Android 15 (`VanillaIceCream`)** 아래의 **Android SDK Platform 35**와 **Sources for Android 35**를 선택하세요.

그다음 **SDK Tools** 탭을 클릭하고 **Android SDK Build-Tools**와 **Android Emulator**가 각각 최소 한 버전 이상 설치되어 있는지 확인하세요.

**Android SDK Location**이라고 표시된 상자의 경로를 복사하거나 기억해 두세요.

다음 줄을 **/.zprofile** 또는 **~/.zshrc**에 추가하세요. bash를 사용한다면 **~/.bash_profile** 또는 **~/.bashrc**에 추가하세요:

```sh
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

현재 shell에서 path environment variable을 다시 불러오세요:

```sh
source $HOME/.zshrc
source $HOME/.bashrc
```

마지막으로 터미널에서 `adb`를 실행할 수 있는지 확인하세요.

**Troubleshooting: Android Studio not recognizing JDK**

Android Studio가 homebrew로 설치한 JDK를 인식하지 못한다면, Java 경로를 명시적으로 설정하는 Gradle configuration file을 만들 수 있습니다:

1.  홈 디렉터리에 Gradle properties file을 만드세요:

    
```sh
touch ~/.gradle/gradle.properties
```

2.  **gradle.properties** 파일에 다음 줄을 추가하세요. 경로는 실제 Java 설치 경로로 바꾸세요:

    ```bash gradle.properties
    java.home=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
    ```

3.  프로젝트 디렉터리에 기존 `.gradle` 폴더가 있다면 삭제한 뒤 Android Studio에서 프로젝트를 다시 여세요:

    
```sh
rm -rf .gradle
```

이렇게 하면 Android Studio가 JDK 설치를 감지하지 못하는 문제를 해결할 수 있습니다.

##### Windows

[Android Studio](https://developer.android.com/studio)를 다운로드하세요.

**Android Studio Setup**을 여세요. **Select components to install**에서 Android Studio와 Android Virtual Device를 선택한 뒤 **Next**를 누르세요.

Android Studio Setup Wizard의 **Install Type**에서 **Standard**를 선택하고 **Next**를 누르세요.

Android Studio Setup Wizard는 Android SDK 버전, platform-tools 등 설정을 확인하라고 요청합니다. 확인을 마친 뒤 **Next**를 누르세요.

다음 창에서 사용 가능한 모든 component의 license를 수락하세요.

기본적으로 Android Studio는 최신 버전의 Android SDK를 설치합니다. 하지만 React Native 앱을 컴파일하려면 Android 15 (`VanillaIceCream`) SDK가 필요합니다.

Android Studio를 열고 **Settings** > **Languages & Frameworks** > **Android SDK**로 이동하세요. **SDK Platforms** 탭에서 **Android 15 (`VanillaIceCream`)** 아래의 **Android SDK Platform 35**와 **Sources for Android 35**를 선택하세요.

그다음 **SDK Tools** 탭을 클릭하고 **Android SDK Build-Tools**와 **Android Emulator**가 각각 최소 한 버전 이상 설치되어 있는지 확인하세요.

도구 설치가 끝나면 `ANDROID_HOME` environment variable을 설정하세요. **Windows Control Panel** > **User Accounts** > **User Accounts**(다시) > **Change my environment variables**로 이동하고, **New**를 눌러 새 `ANDROID_HOME` user variable을 만드세요. 이 변수의 값은 Android SDK 경로를 가리켜야 합니다:

**설치된 SDK 위치 찾는 방법**

기본적으로 Android SDK는 다음 위치에 설치됩니다:

```bash
%LOCALAPPDATA%\Android\Sdk
```

Android Studio에서 SDK 위치를 수동으로 찾으려면 **Settings** > **Languages & Frameworks** > **Android SDK**로 이동하세요. **Android SDK Location** 옆의 위치를 확인할 수 있습니다.

새 environment variable이 제대로 로드되었는지 확인하려면 **PowerShell**을 열고 다음 명령을 복사해 붙여 넣으세요:

```sh
Get-ChildItem -Path Env:
```

이 명령은 모든 user environment variable을 출력합니다. 이 목록에 `ANDROID_HOME`이 추가되었는지 확인하세요.

platform-tools를 Path에 추가하려면 **Windows Control Panel** > **User Accounts** > **User Accounts**(다시) > **Change my environment variables** > **Path** > **Edit** > **New**로 이동한 뒤 아래와 같이 platform-tools 경로를 목록에 추가하세요:

**설치된 platform-tools 위치 찾는 방법**

기본적으로 platform-tools는 다음 위치에 설치됩니다:

```bash
%LOCALAPPDATA%\Android\Sdk\platform-tools
```

마지막으로 PowerShell에서 `adb`를 실행할 수 있는지 확인하세요. 예를 들어 `adb --version`을 실행해 시스템에서 어떤 버전의 `adb`가 동작하는지 확인할 수 있습니다.

### Emulator 설정

Android Studio 메인 화면에서 **More Actions**를 클릭한 다음 dropdown에서 **Virtual Device Manager**를 선택하세요.

**Create device** 버튼을 클릭하세요.

**Add device** 아래에서 에뮬레이션할 hardware 유형을 선택하세요. 다양한 기기에서 테스트해 보는 것을 권장하지만, 어디서 시작해야 할지 모르겠다면 Pixel 라인의 최신 기기를 선택하는 것도 좋은 방법입니다.

Emulator에 로드할 OS 버전(대개 system image 중 하나)을 선택하고, 필요하다면 image를 다운로드하세요.

원하는 다른 설정을 조정한 뒤 **Finish**를 눌러 emulator를 만드세요. 이제 AVD Manager 창의 Play 버튼을 눌러 언제든 이 emulator를 실행할 수 있습니다.

### development build 만들기

#### EAS CLI 설치

앱을 빌드하려면 EAS CLI를 설치해야 합니다. 터미널에서 다음 명령을 실행하세요:

```sh
npm install -g eas-cli
```

#### Expo 계정 만들기 및 로그인

앱을 빌드하려면 Expo 계정을 만들고 EAS CLI에 로그인해야 합니다.

1. [Sign up](https://expo.dev/signup)에서 Expo 계정을 만드세요.
2. 터미널에서 다음 명령을 실행해 EAS CLI에 로그인하세요:
   
```sh
eas login
```

#### 프로젝트 구성

프로젝트에 EAS config를 만들려면 다음 명령을 실행하세요:

```sh
eas build:configure
```

#### build 만들기

development build를 만들려면 다음 명령을 실행하세요:

```sh
eas build --platform android --profile development
```

#### emulator에 development build 설치

build가 완료되면 CLI가 Android Emulator에 자동으로 다운로드하고 설치할지를 묻습니다. 메시지가 나오면 <kbd>Y</kbd>를 눌러 emulator에 바로 설치하세요.

이 프롬프트를 놓쳤다면 터미널에 제공된 링크에서 build를 다운로드한 뒤 Android Emulator 위로 drag and drop하여 설치할 수 있습니다.

---

## development build(local)를 사용하는 Android Emulator

### development build로 Android Emulator 설정하기

### Watchman 및 JDK 설치

##### macOS

##### Prerequisites

[Homebrew](https://brew.sh/) 같은 package manager를 사용해 다음 dependency를 설치하세요.

##### Install dependencies

Homebrew 같은 도구를 사용해 [Watchman 설치](https://facebook.github.io/watchman/docs/install#macos)를 진행하세요:

```sh
brew install watchman
```

Homebrew를 사용해 Azul Zulu라는 OpenJDK distribution을 설치하세요. 이 distribution은 Apple Silicon Mac과 Intel Mac 모두를 위한 JDK를 제공합니다.

터미널에서 다음 명령을 실행하세요:

```sh
brew install --cask zulu@17
```

JDK를 설치한 뒤 **~/.bash_profile**에 `JAVA_HOME` environment variable을 추가하세요. Zsh를 사용한다면 **~/.zshrc**에 추가하세요:

```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
```

##### Windows

##### Prerequisites

[Chocolatey](https://chocolatey.org/) 같은 package manager를 사용해 다음 dependency를 설치하세요.

##### Install dependencies

[Java SE Development Kit (JDK)](https://openjdk.org/)를 설치하세요:

```sh
choco install -y microsoft-openjdk17
```

##### Linux

##### Install dependencies

[Watchman documentation](https://facebook.github.io/watchman/docs/install#linux)의 안내에 따라 source로부터 컴파일하고 설치하세요.

[Java SE Development Kit (JDK)](https://openjdk.org/)를 설치하세요:

[OpenJDK@17](http://openjdk.java.net/)을 [AdoptOpenJDK](https://adoptopenjdk.net/) 또는 시스템 package manager를 통해 다운로드하고 설치할 수 있습니다.

### Android Studio 설정

##### macOS

[Android Studio](https://developer.android.com/studio)를 다운로드하고 설치하세요.

**Android Studio** 앱을 열면 **SDK Components setup** 화면이 표시됩니다. **Next**를 눌러 Android SDK와 Android SDK Platform 설치를 계속하세요. 설정을 확인하고 설치하려면 다시 한 번 **Next**를 누르세요.

기본적으로 Android Studio는 최신 버전의 Android SDK를 설치합니다. 하지만 React Native 앱을 컴파일하려면 Android 15 (`VanillaIceCream`) SDK가 필요합니다.

Android Studio를 열고 **Settings** > **Languages & Frameworks** > **Android SDK**로 이동하세요. **SDK Platforms** 탭에서 **Android 15 (`VanillaIceCream`)** 아래의 **Android SDK Platform 35**와 **Sources for Android 35**를 선택하세요.

그다음 **SDK Tools** 탭을 클릭하고 **Android SDK Build-Tools**와 **Android Emulator**가 각각 최소 한 버전 이상 설치되어 있는지 확인하세요.

**Android SDK Location**이라고 표시된 상자의 경로를 복사하거나 기억해 두세요.

다음 줄을 **/.zprofile** 또는 **~/.zshrc**에 추가하세요. bash를 사용한다면 **~/.bash_profile** 또는 **~/.bashrc**에 추가하세요:

```sh
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

현재 shell에서 path environment variable을 다시 불러오세요:

```sh
source $HOME/.zshrc
source $HOME/.bashrc
```

마지막으로 터미널에서 `adb`를 실행할 수 있는지 확인하세요.

**Troubleshooting: Android Studio not recognizing JDK**

Android Studio가 homebrew로 설치한 JDK를 인식하지 못한다면, Java 경로를 명시적으로 설정하는 Gradle configuration file을 만들 수 있습니다:

1.  홈 디렉터리에 Gradle properties file을 만드세요:

    
```sh
touch ~/.gradle/gradle.properties
```

2.  **gradle.properties** 파일에 다음 줄을 추가하세요. 경로는 실제 Java 설치 경로로 바꾸세요:

    ```bash gradle.properties
    java.home=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
    ```

3.  프로젝트 디렉터리에 기존 `.gradle` 폴더가 있다면 삭제한 뒤 Android Studio에서 프로젝트를 다시 여세요:

    
```sh
rm -rf .gradle
```

이렇게 하면 Android Studio가 JDK 설치를 감지하지 못하는 문제를 해결할 수 있습니다.

##### Windows

[Android Studio](https://developer.android.com/studio)를 다운로드하세요.

**Android Studio Setup**을 여세요. **Select components to install**에서 Android Studio와 Android Virtual Device를 선택한 뒤 **Next**를 누르세요.

Android Studio Setup Wizard의 **Install Type**에서 **Standard**를 선택하고 **Next**를 누르세요.

Android Studio Setup Wizard는 Android SDK 버전, platform-tools 등 설정을 확인하라고 요청합니다. 확인을 마친 뒤 **Next**를 누르세요.

다음 창에서 사용 가능한 모든 component의 license를 수락하세요.

기본적으로 Android Studio는 최신 버전의 Android SDK를 설치합니다. 하지만 React Native 앱을 컴파일하려면 Android 15 (`VanillaIceCream`) SDK가 필요합니다.

Android Studio를 열고 **Settings** > **Languages & Frameworks** > **Android SDK**로 이동하세요. **SDK Platforms** 탭에서 **Android 15 (`VanillaIceCream`)** 아래의 **Android SDK Platform 35**와 **Sources for Android 35**를 선택하세요.

그다음 **SDK Tools** 탭을 클릭하고 **Android SDK Build-Tools**와 **Android Emulator**가 각각 최소 한 버전 이상 설치되어 있는지 확인하세요.

도구 설치가 끝나면 `ANDROID_HOME` environment variable을 설정하세요. **Windows Control Panel** > **User Accounts** > **User Accounts**(다시) > **Change my environment variables**로 이동하고, **New**를 눌러 새 `ANDROID_HOME` user variable을 만드세요. 이 변수의 값은 Android SDK 경로를 가리켜야 합니다:

**설치된 SDK 위치 찾는 방법**

기본적으로 Android SDK는 다음 위치에 설치됩니다:

```bash
%LOCALAPPDATA%\Android\Sdk
```

Android Studio에서 SDK 위치를 수동으로 찾으려면 **Settings** > **Languages & Frameworks** > **Android SDK**로 이동하세요. **Android SDK Location** 옆의 위치를 확인할 수 있습니다.

새 environment variable이 제대로 로드되었는지 확인하려면 **PowerShell**을 열고 다음 명령을 복사해 붙여 넣으세요:

```sh
Get-ChildItem -Path Env:
```

이 명령은 모든 user environment variable을 출력합니다. 이 목록에 `ANDROID_HOME`이 추가되었는지 확인하세요.

platform-tools를 Path에 추가하려면 **Windows Control Panel** > **User Accounts** > **User Accounts**(다시) > **Change my environment variables** > **Path** > **Edit** > **New**로 이동한 뒤 아래와 같이 platform-tools 경로를 목록에 추가하세요:

**설치된 platform-tools 위치 찾는 방법**

기본적으로 platform-tools는 다음 위치에 설치됩니다:

```bash
%LOCALAPPDATA%\Android\Sdk\platform-tools
```

마지막으로 PowerShell에서 `adb`를 실행할 수 있는지 확인하세요. 예를 들어 `adb --version`을 실행해 시스템에서 어떤 버전의 `adb`가 동작하는지 확인할 수 있습니다.

### Emulator 설정

Android Studio 메인 화면에서 **More Actions**를 클릭한 다음 dropdown에서 **Virtual Device Manager**를 선택하세요.

**Create device** 버튼을 클릭하세요.

**Add device** 아래에서 에뮬레이션할 hardware 유형을 선택하세요. 다양한 기기에서 테스트해 보는 것을 권장하지만, 어디서 시작해야 할지 모르겠다면 Pixel 라인의 최신 기기를 선택하는 것도 좋은 방법입니다.

Emulator에 로드할 OS 버전(대개 system image 중 하나)을 선택하고, 필요하다면 image를 다운로드하세요.

원하는 다른 설정을 조정한 뒤 **Finish**를 눌러 emulator를 만드세요. 이제 AVD Manager 창의 Play 버튼을 눌러 언제든 이 emulator를 실행할 수 있습니다.

### Android Emulator에서 앱 실행하기

#### expo-dev-client 설치

프로젝트 루트 디렉터리에서 다음 명령을 실행하세요:

```sh
npx expo install expo-dev-client
```

터미널에서 다음 명령을 실행하세요:

```sh
npx expo run:android
```

> 이 명령은 앱을 빌드한 뒤 development server도 함께 실행합니다. 다음 페이지에서 `npx expo start`를 따로 실행하지 않아도 됩니다.

---

## Expo Go를 사용하는 iOS 기기

### Expo Go로 iOS 기기 설정하기

#### Apple Developer Program 등록

iOS 기기에 Expo Go를 설치하려면 Apple Developer Program의 활성 구독이 필요합니다. [Apple Developer Program here](https://developer.apple.com/programs/)에서 등록하세요.

#### iOS용 Expo Go 빌드

Expo Go를 빌드하려면 다음 명령을 실행하세요:

```sh
npx eas-cli@latest go
```

#### TestFlight 설치

[TestFlight app](https://apps.apple.com/us/app/testflight/id899247664)을 다운로드하고 설치하세요. iOS 기기에서 아래 QR 코드를 스캔해도 됩니다:

다운로드 링크: [https://apps.apple.com/us/app/testflight/id899247664](https://apps.apple.com/us/app/testflight/id899247664)

#### 자신을 tester로 추가하기

1. [App Store Connect](https://appstoreconnect.apple.com)로 이동하세요.
2. Expo Go 앱을 선택하세요.
3. "TestFlight" 탭으로 이동하세요.
4. Apple ID 이메일을 internal tester로 추가하세요.

이 작업을 마치면 TestFlight beta에 참여하라는 이메일 초대를 받게 됩니다. 초대를 수락하면 iOS 기기에 Expo Go를 설치할 수 있습니다.

---

## development build(EAS)을 사용하는 iOS 기기

### development build로 iOS 기기 설정하기

#### Apple Developer Program 등록

iOS 기기에 development build를 설치하려면 Apple Developer Program의 활성 구독이 필요합니다. [Apple Developer Program here](https://developer.apple.com/programs/)에서 등록하세요.

#### EAS CLI 설치

앱을 빌드하려면 EAS CLI를 설치해야 합니다. 터미널에서 다음 명령을 실행하세요:

```sh
npm install -g eas-cli
```

#### Expo 계정 만들기 및 로그인

다음으로 Expo 계정을 만들고 EAS CLI에 로그인해야 합니다.

1. [Sign up](https://expo.dev/signup)에서 Expo 계정을 만드세요.
2. 터미널에서 다음 명령을 실행해 EAS CLI에 로그인하세요:
   
```sh
eas login
```

#### 프로젝트 구성

프로젝트에 EAS config를 만들려면 다음 명령을 실행하세요:

```sh
eas build:configure
```

#### ad hoc provisioning profile 만들기

iOS 기기에 development build를 설치하려면 ad hoc provisioning profile을 만들어야 합니다. 터미널에서 다음 명령을 실행해 생성하세요:

```sh
eas device:create
```

#### development build 만들기

development build를 만들려면 다음 명령을 실행하세요:

```sh
eas build --platform ios --profile development
```

#### 기기에 development build 설치

build가 완료되면 터미널의 QR 코드를 스캔하고 Camera app 안에 **Open with iTunes**가 나타나면 탭하세요. 또는 터미널에 표시된 링크를 기기에서 여세요.

설치를 확인하면 앱이 기기의 app library에 나타납니다.

#### developer mode 켜기

1. **Settings** > **Privacy & Security**를 열고 아래로 스크롤한 뒤 **Developer Mode** 항목으로 들어가세요.
2. 스위치를 눌러 **Developer Mode**를 활성화하세요. 그러면 Settings가 Developer Mode가 기기 보안을 낮춘다는 경고 alert를 표시합니다. 계속 활성화하려면 alert의 **Restart** 버튼을 탭하세요.
3. 기기가 재시동된 뒤 잠금을 해제하면 Developer Mode를 켤지 확인하는 alert가 표시됩니다. **Turn On**을 탭하고, 요청되면 기기 passcode를 입력하세요.

> 또는 Mac에 Xcode가 설치되어 있다면 Xcode를 사용해 [iOS developer mode를 활성화](/guides/ios-developer-mode/#connect-an-ios-device-with-a-mac)할 수 있습니다.

---

## development build(local)를 사용하는 iOS 기기

### development build로 iOS 기기 설정하기

### Xcode 및 Watchman 설정

#### Xcode 설치

Mac App Store를 열고 [Xcode](https://apps.apple.com/us/app/xcode/id497799835)를 검색한 다음 **Install**을 클릭하세요. 이미 설치되어 있다면 **Update**를 클릭하세요.

#### Xcode Command Line Tools 설치

Xcode를 열고 Xcode 메뉴에서 **Settings...**를 선택하세요. 또는 <kbd>cmd ⌘</kbd> + <kbd>,</kbd>를 누르세요. **Locations**로 이동한 뒤 **Command Line Tools** dropdown에서 가장 최신 버전을 선택해 도구를 설치하세요.

#### Xcode에서 iOS Simulator 설치

iOS Simulator를 설치하려면 **Xcode > Settings... > Components**를 열고 **Platform Support > iOS ...** 아래에서 **Get**을 클릭하세요.

#### Watchman 설치

[Watchman](https://facebook.github.io/watchman/docs/install#macos)은 파일 시스템의 변경을 감시하는 도구입니다. 설치하면 성능이 더 좋아집니다. 다음 명령으로 설치할 수 있습니다:

```sh
brew update
brew install watchman
```

### 프로젝트 구성

#### expo-dev-client 설치

프로젝트 루트 디렉터리에서 다음 명령을 실행하세요:

```sh
npx expo install expo-dev-client
```

#### USB로 기기를 연결하고 developer mode 활성화

1. USB 케이블로 iOS 기기를 Mac에 연결하세요. 기기 잠금을 해제하고 메시지가 나타나면 **Trust**를 탭하세요.

2. Xcode를 여세요. 메뉴 막대에서 **Window** > **Devices and Simulators**를 선택하세요. Xcode에 developer mode를 활성화하라는 경고가 표시됩니다.

3. iOS 기기에서 **Settings** > **Privacy & Security**를 열고 아래로 스크롤한 뒤 **Developer Mode** 항목으로 들어가세요.

4. 스위치를 눌러 **Developer Mode**를 활성화하세요. 그러면 Settings가 Developer Mode가 기기 보안을 낮춘다는 경고 alert를 표시합니다. 계속 활성화하려면 alert의 **Restart** 버튼을 탭하세요.

5. 기기가 재시동된 뒤 잠금을 해제하면 Developer Mode를 켤지 확인하는 alert가 표시됩니다. **Turn On**을 탭하고, 요청되면 기기 passcode를 입력하세요.

#### 기기에서 프로젝트 실행

1. 루트 디렉터리에 있는 **app.json** 파일에 `ios.bundleIdentifier`를 고유한 값으로 추가해 Xcode가 앱 서명 단계에서 provisioning profile을 생성할 수 있도록 하세요.

2. 프로젝트 루트 디렉터리에서 다음 명령을 실행하고 목록에서 USB로 연결한 기기를 선택하세요:

```sh
npx expo run:ios --device
```

> 이 명령은 앱을 빌드한 뒤 development server도 함께 실행합니다. 다음 페이지에서 `npx expo start`를 따로 실행하지 않아도 됩니다.

---

## Expo Go를 사용하는 iOS Simulator

### Expo Go로 iOS Simulator 설정하기

### Xcode 설정

#### Xcode 설치

Mac App Store를 열고 [Xcode](https://apps.apple.com/us/app/xcode/id497799835)를 검색한 다음 **Install**을 클릭하세요. 이미 설치되어 있다면 **Update**를 클릭하세요.

#### Xcode Command Line Tools 설치

Xcode를 열고 Xcode 메뉴에서 **Settings...**를 선택하세요. 또는 <kbd>cmd ⌘</kbd> + <kbd>,</kbd>를 누르세요. **Locations**로 이동한 뒤 **Command Line Tools** dropdown에서 가장 최신 버전을 선택해 도구를 설치하세요.

#### Xcode에서 iOS Simulator 설치

iOS Simulator를 설치하려면 **Xcode > Settings... > Components**를 열고 **Platform Support > iOS ...** 아래에서 **Get**을 클릭하세요.

#### Watchman 설치

[Watchman](https://facebook.github.io/watchman/docs/install#macos)은 파일 시스템의 변경을 감시하는 도구입니다. 설치하면 성능이 더 좋아집니다. 다음 명령으로 설치할 수 있습니다:

```sh
brew update
brew install watchman
```

### Expo Go 설치

[start developing](/get-started/start-developing) 페이지에서 `npx expo start`로 development server를 시작한 뒤 <kbd>i</kbd>를 눌러 iOS Simulator를 여세요. Expo CLI가 Expo Go를 자동으로 설치합니다.

---

## development build(EAS)을 사용하는 iOS Simulator

### development build로 iOS Simulator 설정하기

### Xcode 설정

#### Xcode 설치

Mac App Store를 열고 [Xcode](https://apps.apple.com/us/app/xcode/id497799835)를 검색한 다음 **Install**을 클릭하세요. 이미 설치되어 있다면 **Update**를 클릭하세요.

#### Xcode Command Line Tools 설치

Xcode를 열고 Xcode 메뉴에서 **Settings...**를 선택하세요. 또는 <kbd>cmd ⌘</kbd> + <kbd>,</kbd>를 누르세요. **Locations**로 이동한 뒤 **Command Line Tools** dropdown에서 가장 최신 버전을 선택해 도구를 설치하세요.

#### Xcode에서 iOS Simulator 설치

iOS Simulator를 설치하려면 **Xcode > Settings... > Components**를 열고 **Platform Support > iOS ...** 아래에서 **Get**을 클릭하세요.

#### Watchman 설치

[Watchman](https://facebook.github.io/watchman/docs/install#macos)은 파일 시스템의 변경을 감시하는 도구입니다. 설치하면 성능이 더 좋아집니다. 다음 명령으로 설치할 수 있습니다:

```sh
brew update
brew install watchman
```

### development build 만들기

#### EAS CLI 설치

앱을 빌드하려면 EAS CLI를 설치해야 합니다. 터미널에서 다음 명령을 실행하세요:

```sh
npm install -g eas-cli
```

#### Expo 계정 만들기 및 로그인

다음으로 Expo 계정을 만들고 EAS CLI에 로그인해야 합니다.

1. [Sign up](https://expo.dev/signup)에서 Expo 계정을 만드세요.
2. 터미널에서 다음 명령을 실행해 EAS CLI에 로그인하세요:
   
```sh
eas login
```

#### 프로젝트 구성

프로젝트에 EAS config를 만들려면 다음 명령을 실행하세요:

```sh
eas build:configure
```

#### build profile 조정

simulator와 호환되는 development build를 만들려면 **eas.json**의 build profile을 업데이트해 `ios.simulator` property를 `true`로 설정해야 합니다:

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

#### development build 만들기

development build를 만들려면 다음 명령을 실행하세요:

```sh
eas build --platform ios --profile development
```

#### simulator에 development build 설치

build가 완료되면 CLI가 iOS Simulator에 자동으로 다운로드하고 설치할지를 묻습니다. 메시지가 나오면 <kbd>Y</kbd>를 눌러 simulator에 바로 설치하세요.

이 프롬프트를 놓쳤다면 터미널에 제공된 링크에서 build를 다운로드한 뒤 iOS Simulator 위로 drag and drop하여 설치할 수 있습니다.

---

## development build(local)를 사용하는 iOS Simulator

### development build로 iOS Simulator 설정하기

### Xcode 및 Watchman 설정

#### Xcode 설치

Mac App Store를 열고 [Xcode](https://apps.apple.com/us/app/xcode/id497799835)를 검색한 다음 **Install**을 클릭하세요. 이미 설치되어 있다면 **Update**를 클릭하세요.

#### Xcode Command Line Tools 설치

Xcode를 열고 Xcode 메뉴에서 **Settings...**를 선택하세요. 또는 <kbd>cmd ⌘</kbd> + <kbd>,</kbd>를 누르세요. **Locations**로 이동한 뒤 **Command Line Tools** dropdown에서 가장 최신 버전을 선택해 도구를 설치하세요.

#### Xcode에서 iOS Simulator 설치

iOS Simulator를 설치하려면 **Xcode > Settings... > Components**를 열고 **Platform Support > iOS ...** 아래에서 **Get**을 클릭하세요.

#### Watchman 설치

[Watchman](https://facebook.github.io/watchman/docs/install#macos)은 파일 시스템의 변경을 감시하는 도구입니다. 설치하면 성능이 더 좋아집니다. 다음 명령으로 설치할 수 있습니다:

```sh
brew update
brew install watchman
```

### iOS Simulator에서 앱 실행하기

#### expo-dev-client 설치

프로젝트 루트 디렉터리에서 다음 명령을 실행하세요:

```sh
npx expo install expo-dev-client
```

터미널에서 다음 명령을 실행하세요:

```sh
npx expo run:ios
```

> 이 명령은 앱을 빌드한 뒤 development server도 함께 실행합니다. 다음 페이지에서 `npx expo start`를 따로 실행하지 않아도 됩니다.

## Next step

이제 프로젝트와 개발 환경이 준비되었습니다. 이제 개발을 시작할 차례입니다.
