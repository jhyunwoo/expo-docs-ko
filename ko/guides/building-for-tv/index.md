---
modificationDate: March 01, 2026
title: TV용 Expo 앱 빌드하기
description: Android TV 또는 Apple TV 대상을 위한 Expo 앱을 빌드하는 가이드입니다.
---

# TV용 Expo 앱 빌드하기

Android TV 또는 Apple TV 대상을 위한 Expo 앱을 빌드하는 가이드입니다.

> Expo의 모든 기능과 SDK 라이브러리가 TV에서 제공되는 것은 아닙니다. 자세한 내용은 [지원되는 라이브러리 확인하기](/guides/building-for-tv#see-which-libraries-are-supported)를 참고하세요.

React Native는 [React Native TV project](https://github.com/react-native-tvos/react-native-tvos)를 통해 Android TV와 Apple TV를 지원합니다. 이 기술은 TV를 넘어, Hermes와 Fabric을 포함해 phone 및 TV 대상을 모두 지원하는 포괄적인 core repo fork를 제공합니다.

Expo 프로젝트에서 React Native TV 라이브러리를 `react-native` dependency로 사용하면, mobile(Android, iOS)과 TV(Android TV, Apple TV) 기기 모두를 대상으로 할 수 있게 됩니다.

## Prerequisites

[config plugin](https://github.com/react-native-tvos/config-tv/tree/main/packages/config-tv)을 사용하면, [prebuild](/more/glossary-of-terms#prebuild)를 사용할 때 native Android 및 iOS 파일에 필요한 변경을 최소한으로 두고 자동화할 수 있습니다. 아래는 config plugin이 수행하는 변경 목록이며, 원한다면 수동으로 적용할 수도 있습니다:

### Android

-   **AndroidManifest.xml**이 수정됩니다:
    -   기본 phone portrait orientation이 제거됩니다
    -   TV 앱에 필요한 intent가 추가됩니다
-   **MainApplication.kt**가 수정되어 지원되지 않는 Flipper 호출이 제거됩니다

### iOS

-   **ios/Podfile**이 iOS 대신 tvOS를 대상으로 수정됩니다
-   Xcode 프로젝트가 iOS 대신 tvOS를 대상으로 수정됩니다
-   splash screen(**SplashScreen.storyboard**)이 tvOS에서 동작하도록 수정됩니다

## TV 개발을 위한 시스템 요구 사항

### Android TV

-   macOS 또는 Linux에서 [Node.js (LTS)](https://nodejs.org/en/).
-   Android Studio(Iguana 이상).
-   Android Studio SDK manager에서 사용 중인 Android SDK(API 버전 31 이상)의 dropdown을 선택하고, 설치 대상에 Android TV system image가 포함되어 있는지 확인하세요. Apple silicon에서는 ARM 64 image를, 그 외에는 Intel x86_64 image를 선택하세요.
-   Android TV system image를 설치한 뒤, 해당 image를 사용해 Android TV emulator를 만드세요. 과정은 Android phone emulator 생성과 같습니다.

### Apple TV

-   macOS에서 [Node.js (LTS)](https://nodejs.org/en/).
-   Xcode 16 이상.
-   tvOS SDK 17 이상. 이는 Xcode와 함께 자동 설치되지 않습니다. 나중에 `xcodebuild -downloadAllPlatforms`로 설치할 수 있습니다.

## Quick start

새 프로젝트를 가장 빠르게 생성하는 방법은 Expo examples 저장소의 [TV example](https://github.com/expo/examples/tree/master/with-tv)에 설명되어 있습니다:

```sh
npx create-expo-app MyTVProject -e with-tv
```

[TV Router example](https://github.com/expo/examples/tree/master/with-router-tv)로 시작할 수도 있습니다:

```sh
npx create-expo-app MyTVProject -e with-router-tv
```

이렇게 하면 [Expo Router](/router/introduction)를 사용한 file-based navigation을 갖는 새 프로젝트가 생성되며, [**create-expo-app** 기본 template](/get-started/create-a-project)를 모델로 합니다.

지원되는 라이브러리 확인하기

현재 시점에서 TV 애플리케이션은 아래 목록의 라이브러리와 API에서 동작합니다:

-   [AppleAuthentication](/versions/latest/sdk/apple-authentication)
-   [Application](/versions/latest/sdk/application)
-   [Audio](/versions/latest/sdk/audio)
-   [Asset](/versions/latest/sdk/asset)
-   [AsyncStorage](/versions/latest/sdk/async-storage)
-   [AV](/versions/latest/sdk/av)
-   [BackgroundTask](/versions/latest/sdk/background-task)
-   [BlurView](/versions/latest/sdk/blur-view)
-   [BuildProperties](/versions/latest/sdk/build-properties)
-   [Constants](/versions/latest/sdk/constants)
-   [Crypto](/versions/latest/sdk/crypto)
-   [DevClient](/versions/latest/sdk/dev-client)
-   [Device](/versions/latest/sdk/device)
-   [Expo UI](/versions/latest/sdk/ui)
-   [FileSystem](/versions/latest/sdk/filesystem)
-   [FlashList](/versions/latest/sdk/flash-list)
-   [Font](/versions/latest/sdk/font)
-   [GlassEffect](/versions/latest/sdk/glass-effect)
-   [Image](/versions/latest/sdk/image)
-   [ImageManipulator](/versions/latest/sdk/imagemanipulator)
-   [KeepAwake](/versions/latest/sdk/keep-awake)
-   [LinearGradient](/versions/latest/sdk/linear-gradient)
-   [Localization](/versions/latest/sdk/localization)
-   [Manifests](/versions/latest/sdk/manifests)
-   [MediaLibrary](/versions/latest/sdk/media-library)
-   [NetInfo](/versions/latest/sdk/netinfo)
-   [Network](/versions/latest/sdk/network)
-   [Reanimated](/versions/latest/sdk/reanimated)
-   [SafeAreaContext](/versions/latest/sdk/safe-area-context)
-   [SecureStore](/versions/latest/sdk/securestore)
-   [Skia](/versions/latest/sdk/skia)
-   [SplashScreen](/versions/latest/sdk/splash-screen)
-   [SQLite](/versions/latest/sdk/sqlite)
-   [Svg](/versions/latest/sdk/svg)
-   [SystemUI](/versions/latest/sdk/system-ui)
-   [TaskManager](/versions/latest/sdk/task-manager)
-   [TrackingTransparency](/versions/latest/sdk/tracking-transparency)
-   [Updates](/versions/latest/sdk/updates)
-   [Video](/versions/latest/sdk/video)
-   [VideoThumbnails](/versions/latest/sdk/video-thumbnails)

TV는 [React Navigation](https://reactnavigation.org/), [React Native Skia](https://shopify.github.io/react-native-skia/), 그리고 흔히 사용되는 많은 third-party React Native 라이브러리와도 동작합니다. 지원되는 third-party 라이브러리에 대해 더 알아보려면 [React Native directory](https://reactnative.directory/?tvos=true)를 참고하세요.

#### Limitations

-   [Expo DevClient](/versions/latest/sdk/dev-client) 라이브러리는 SDK 54 이상에서만 지원됩니다:
    -   **Android TV**: Android phone과 유사하게 모든 작업이 지원됩니다.
    -   **Apple TV**: 로컬 또는 tunneled packager를 사용하는 기본 작업만 지원됩니다. EAS 인증, EAS build 목록, update 목록 조회는 아직 지원되지 않습니다.

## 기존 Expo 프로젝트와 통합하기

다음 walkthrough는 Expo 프로젝트를 TV용으로 수정하는 데 필요한 단계를 설명합니다.

### TV용 dependency 수정

**package.json**에서 `react-native` dependency를 TV repo를 사용하도록 수정하고, 이 dependency를 [`npx expo install` 버전 검증](/more/expo-cli#configuring-dependency-validation)에서 제외하세요.

> `react-native-tvos` 버전은 사용 중인 Expo SDK와 일치해야 합니다. 예를 들어 Expo SDK 54는 React Native 0.81을 사용하므로 아래처럼 `react-native-tvos@0.81-stable`(최신 0.81 버전)을 사용해야 합니다. 이전 SDK에서 사용해야 할 올바른 버전은 [SDK 호환성 표](/versions/latest#each-expo-sdk-version-depends-on-a-react-native-version)를 참고하세요.

```json
{
  ... 
  "dependencies": {
    ... 
    "react-native": "npm:react-native-tvos@0.81-stable",
    ... 
  },
  "expo": {
    "install": {
      "exclude": [
        "react-native"
      ]
    }
  }
}
```

### TV config plugin 추가

```sh
npx expo install @react-native-tvos/config-tv -- --dev
```

설치되면 다음 중 하나일 때 plugin이 프로젝트를 TV용으로 수정합니다:

-   environment variable `EXPO_TV`가 `1`로 설정된 경우
-   plugin parameter `isTV`가 `true`로 설정된 경우

이 plugin이 **app.json**에 나타나는지 확인하세요:

```json
{
  "plugins": ["@react-native-tvos/config-tv"]
}
```

prebuild 중 plugin 동작에 대한 추가 정보를 보려면 prebuild 실행 전에 [debug environment variable](https://github.com/debug-js/debug#conventions)을 설정할 수 있습니다.([Expo CLI environment variables](/more/expo-cli#environment-variables) 문서도 참고하세요.)

```sh
export DEBUG=expo:*
export DEBUG=expo:react-native-tvos:config-tv
```

### prebuild 실행

`EXPO_TV` environment variable을 설정한 뒤 prebuild를 실행해 프로젝트에 TV 수정을 적용하세요.

```sh
export EXPO_TV=1
npx expo prebuild --clean
```

> **Note**: `--clean` 인자는 권장되며, 프로젝트에 기존 Android 및 iOS 디렉터리가 있다면 필수입니다.

### Android TV용 빌드

Android TV emulator를 시작한 다음, 다음 명령으로 emulator에서 앱을 실행하세요:

```sh
npx expo run:android
```

### Apple TV용 빌드

다음 명령을 실행해 Apple TV simulator에서 앱을 빌드하고 실행하세요:

```sh
npx expo run:ios
```

### TV 변경 사항 되돌리고 phone용으로 빌드하기

`EXPO_TV`를 해제하고 prebuild를 다시 실행하면 TV용 변경을 되돌리고 phone 개발로 돌아갈 수 있습니다:

```sh
unset EXPO_TV
npx expo prebuild --clean
```

### TV와 phone 모두를 위한 EAS Build profile 만들기

TV 빌드는 environment variable 값으로 제어할 수 있으므로, 같은 source에서 빌드하지만 phone 대신 TV를 대상으로 하는 EAS Build profile을 쉽게 설정할 수 있습니다.

다음 **eas.json** 예시는 기존 profile(`development`와 `preview`)을 확장해 TV profile(`development_tv`와 `preview_tv`)을 만드는 방법을 보여줍니다.

```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "base": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      },
      "android": {
        "buildType": "apk",
        "withoutCredentials": true
      },
      "channel": "base"
    },
    "development": {
      "extends": "base",
      "android": {
        "gradleCommand": ":app:assembleDebug"
      },
      "ios": {
        "buildConfiguration": "Debug"
      },
      "channel": "development"
    },
    "development_tv": {
      "extends": "development",
      "env": {
        "EXPO_TV": "1"
      },
      "channel": "development"
    },
    "preview": {
      "extends": "base",
      "channel": "preview"
    },
    "preview_tv": {
      "extends": "preview",
      "env": {
        "EXPO_TV": "1"
      },
      "channel": "preview"
    }
  },
  "submit": {}
}
```

## 예제 및 데모 프로젝트

[IgniteTV](https://github.com/react-native-tvos/IgniteTV) — 모바일 또는 TV용으로 빌드할 수 있는 Ignite CLI 생성 프로젝트입니다.

[SkiaMultiplatform](https://github.com/react-native-tvos/SkiaMultiplatform) — 모바일, TV, 웹에서 React Native Skia를 사용하는 예시입니다.

[NativewindMultiplatform](https://github.com/react-native-tvos/NativewindMultiplatform) — 모바일, TV, 웹에서 TailwindCSS 스타일링을 사용하는 예시입니다.
