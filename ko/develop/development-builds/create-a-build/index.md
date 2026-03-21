---
modificationDate: March 06, 2026
title: EAS에서 development build 만들기
description: 프로젝트용 development build를 만드는 방법을 알아보세요.
---

# EAS에서 development build 만들기

프로젝트용 development build를 만드는 방법을 알아보세요.

`npx create-expo-app`으로 새 Expo 앱을 만들면, 로컬 머신에서 JavaScript 코드를 수정하고 Expo Go 앱에서 변경 사항을 확인하는 프로젝트로 시작하게 됩니다. **development build**는 본질적으로 **여러분만의 Expo Go 버전**으로, 어떤 네이티브 라이브러리든 자유롭게 사용하고 네이티브 설정도 마음대로 변경할 수 있습니다. 이 가이드에서는 Expo Go에서 실행되던 프로젝트를 development build로 전환하는 방법을 배웁니다. 이렇게 하면 앱의 네이티브 측면을 완전히 사용자 지정할 수 있습니다.

[development build 만드는 방법](https://www.youtube.com/watch?v=uQCE9zl3dXU) — EAS Build를 사용해 Expo 프로젝트용 development build를 구성하고 생성하는 방법을 알아보세요.

## 사전 준비

이 안내는 이미 Expo Go에서 실행되는 기존 Expo 프로젝트가 있다고 가정합니다.

네이티브 앱을 빌드하기 위한 요구 사항은 어떤 플랫폼을 사용 중인지, 어떤 플랫폼용으로 빌드하는지, 그리고 EAS에서 빌드할지 로컬 머신에서 빌드할지에 따라 달라집니다.

EAS에서 빌드하기

이 방법은 사용자의 환경에 네이티브 빌드 도구가 필요하지 않으므로 가장 쉬운 방법입니다. 빌드는 EAS 서버에서 이루어지므로, macOS가 아닌 플랫폼에서도 iOS 빌드를 트리거할 수 있습니다.

|  | Android | iOS Simulator | iPhone 기기 |
| --- | --- | --- | --- |
| **macOS** | ✓ | ✓ | ✓ (\*) |
| **Windows** | ✓ | ✓ | ✓ (\*) |
| **Linux** | ✓ | ✓ | ✓ (\*) |

(\*) iPhone 기기에서 실행되는 모든 빌드는 빌드 서명을 위해 유료 [Apple Developer](https://developer.apple.com) 계정이 필요합니다.

EAS CLI를 사용해 로컬에서 빌드하기

모든 EAS CLI 명령은 `--local` 플래그를 사용해 로컬 머신에서 빌드할 수 있습니다. 이를 위해서는 로컬 [개발 환경](https://reactnative.dev/docs/set-up-your-environment?os=macos&platform=ios)에 네이티브 빌드 도구가 설정되어 있어야 합니다. 자세한 내용은 [로컬 앱 개발](/build-reference/local-builds)을 참고하세요.

|  | Android | iOS Simulator | iPhone 기기 |
| --- | --- | --- | --- |
| **macOS** | ✓ | ✓ | ✓ (\*) |
| **Windows** | ✓ (\*\*) | ✗ | ✗ |
| **Linux** | ✓ | ✗ | ✗ |

(\*) iPhone 기기에서 실행되는 모든 빌드는 빌드 서명을 위해 유료 [Apple Developer](https://developer.apple.com) 계정이 필요합니다.

(\*\*) 1급 지원은 아니지만 [WSL](http://expo.fyi/wsl.md)로는 가능합니다.

EAS 없이 로컬에서 빌드하기

EAS 없이 로컬에서 빌드하려면 로컬 [개발 환경](https://reactnative.dev/docs/set-up-your-environment?os=macos&platform=ios)에 네이티브 빌드 도구가 설정되어 있어야 합니다. 이것은 유료 Apple Developer Account 없이 iPhone 기기에서 iOS 빌드를 테스트할 수 있는 유일한 방법입니다(macOS에서만 가능). 자세한 내용은 [로컬 앱 컴파일](/guides/local-app-development#local-app-compilation)과 [Expo Go에서 Development Build로](/develop/development-builds/expo-go-to-dev-build) 가이드를 참고하세요.

|  | Android | iOS Simulator | iPhone 기기 |
| --- | --- | --- | --- |
| **macOS** | ✓ | ✓ | ✓ |
| **Windows** | ✓ | ✗ | ✗ |
| **Linux** | ✓ | ✗ | ✗ |

## 시작하기

자세한 단계별 안내는 [EAS Tutorial](/tutorial/eas/introduction)을 참고하세요. YouTube의 [튜토리얼 시리즈](https://www.youtube.com/playlist?list=PLsXDmrmFV_AS14tZCBin6m9NIS_VCUKe2)로도 제공됩니다.

### expo-dev-client 설치하기

```sh
npx expo install expo-dev-client
```

이 라이브러리를 기존(bare) React Native 앱에서 사용하고 있나요?

[Continuous Native Generation](/workflow/continuous-native-generation)을 사용하지 않거나 `npx react-native`로 만든 앱은 이 라이브러리 설치 후 추가 구성이 필요합니다. [기존 React Native 앱에 `expo-dev-client` 설치하기](/bare/install-dev-builds-in-bare)의 1단계와 2단계를 참고하세요.

### 네이티브 앱 빌드하기 (Android)

사전 준비

3가지 요구 사항

1.

Expo account

아직 없다면 [Expo](https://expo.dev/signup) account를 만드세요.

2.

EAS CLI

[EAS CLI](/build/setup#install-the-latest-eas-cli)를 설치하고 로그인하세요.

```sh
npm install -g eas-cli && eas login
```

3.

Android Emulator(선택 사항)

emulator에서 앱을 테스트하려면 [Android Emulator](/workflow/android-studio-emulator)가 있으면 좋지만 필수는 아닙니다.

```sh
eas build --platform android --profile development
```

[EAS에서 Android 빌드](/tutorial/eas/android-development-build)에 대해 더 읽어보세요.

### 네이티브 앱 빌드하기 (iOS Simulator)

사전 준비

3가지 요구 사항

1.

Expo account

아직 없다면 [Expo](https://expo.dev/signup) account를 만드세요.

2.

EAS CLI

[EAS CLI](/build/setup#install-the-latest-eas-cli)를 설치하고 로그인하세요.

```sh
npm install -g eas-cli && eas login
```

3.

iOS Simulator가 설치된 macOS

iOS Simulator는 macOS에서만 사용할 수 있습니다. [iOS Simulator](/workflow/ios-simulator)가 설치되어 있는지 확인하세요.

**eas.json**의 `development` profile을 수정하고 [`simulator`](/eas/json#simulator) 옵션을 `true`로 설정하세요(iOS 기기용 빌드도 함께 만들고 싶다면 simulator용 별도 profile을 만들어야 합니다).

```json
{
  "build": {
    "development": {
      "ios": {
        "simulator": true
      }
    }
  }
}
```

```sh
eas build --platform ios --profile development
```

iOS Simulator 빌드는 simulator에만 설치할 수 있고 실제 기기에는 설치할 수 없습니다.

[EAS에서 iOS Simulator 빌드](/tutorial/eas/ios-development-build-for-simulators)에 대해 더 읽어보세요.

### 네이티브 앱 빌드하기 (iOS 기기)

사전 준비

3가지 요구 사항

1.

Expo account

아직 없다면 [Expo](https://expo.dev/signup) account를 만드세요.

2.

EAS CLI

[EAS CLI](/build/setup#install-the-latest-eas-cli)를 설치하고 로그인하세요.

```sh
npm install -g eas-cli && eas login
```

3.

Apple Developer account

유료 [Apple Developer](https://developer.apple.com/) account가 필요하며, 이를 통해 iOS 기기에 앱을 설치할 수 있도록 [앱 서명 자격 증명](/app-signing/managed-credentials#generating-app-signing-credentials)을 만들 수 있습니다.

```sh
eas build --platform ios --profile development
```

iOS 기기 빌드는 iPhone 기기에만 설치할 수 있고 iOS Simulator에는 설치할 수 없습니다.

[EAS에서 iOS 기기 빌드](/tutorial/eas/ios-development-build-for-devices)에 대해 더 읽어보세요.

### 앱 설치하기

기기, emulator 또는 simulator에 네이티브 앱을 설치해야 합니다.

#### EAS에서 빌드하는 경우

EAS에서 development build를 만들면 빌드가 끝난 뒤 CLI가 앱 설치를 안내합니다. 이전 빌드는 [expo.dev](https://expo.dev/) 대시보드나 [Expo Orbit](https://expo.dev/orbit)에서도 설치할 수 있습니다.

#### EAS CLI를 사용해 로컬에서 빌드하는 경우

로컬에서 빌드하면 결과물은 archive 형태로 생성됩니다. 이를 Android Emulator나 iOS Simulator에 drag and drop 해서 설치하거나, [Expo Orbit](https://expo.dev/orbit)을 사용해 로컬 머신의 빌드를 설치할 수 있습니다.

### bundler 시작하기

**2단계**에서 만든 development client는 앱의 네이티브 측면입니다(기본적으로 여러분만의 Expo Go 버전입니다). 개발을 계속하려면 JavaScript bundler도 실행해야 합니다.

앱을 어떤 방식으로 빌드했는지에 따라 이미 실행 중일 수도 있지만, 어떤 이유로든 프로세스를 닫았다면 development client를 다시 빌드할 필요는 없습니다. 다음 명령으로 JavaScript bundler만 다시 시작하면 됩니다:

```sh
npx expo start
```

이 명령은 Expo Go를 사용할 때 쓰던 것과 동일한 명령입니다. 프로젝트에 `expo-dev-client`가 설치되어 있으면 이를 감지해 Expo Go 대신 development build를 대상으로 삼습니다.

## 동영상 walkthrough

["EAS Tutorial Series"](https://www.youtube.com/playlist?list=PLsXDmrmFV_AS14tZCBin6m9NIS_VCUKe2) — YouTube 강의 시리즈로, Expo Application Services를 사용해 개발 속도를 높이는 방법을 배울 수 있습니다.

["Async Office Hours: How to make a development build with EAS Build"](https://www.youtube.com/watch?v=LUFHXsBcW6w) — Developer Success Engineer인 Keith Kurak이 진행하는 이 동영상 튜토리얼에서 EAS Build로 development build를 만드는 방법을 배워 보세요.
