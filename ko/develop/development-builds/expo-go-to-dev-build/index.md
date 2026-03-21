---
modificationDate: February 17, 2026
title: Expo Go에서 development build로 전환하기
description: Expo Go 프로젝트를 development build로 전환해 사용하는 방법입니다.
---

# Expo Go에서 development build로 전환하기

Expo Go 프로젝트를 development build로 전환해 사용하는 방법입니다.

Expo Go에서 development build로 전환하려면 아래 단계를 따르면 됩니다:

## `expo-dev-client` 설치하기

Expo Dev Client 라이브러리에는 launcher UI(아래 스크린샷에 표시됨), dev menu, over-the-air update를 테스트하기 위한 확장 기능 등이 포함되어 있습니다. Expo Go 앱에는 dev menu가 기본으로 내장되어 있기 때문에, development build에서는 이 라이브러리를 별도로 설치해야 합니다.

```sh
npx expo install expo-dev-client
```

development build를 실행하면 "Microfoam" 대신 여러분의 앱 이름과 아이콘이 포함된다는 점만 제외하면 아래와 같은 모습이 됩니다. launcher UI는 왼쪽의 iOS와 오른쪽의 Android에 표시되어 있고, 가운데에는 development build 내부에서 실행 중인 앱과 열려 있는 사용자 지정 가능한 developer menu가 보입니다.

> 가장 좋은 개발 경험을 위해 `expo-dev-client` 사용을 권장하지만, 이 라이브러리를 설치하지 않고 development build를 사용하는 것도 가능합니다. dev client를 사용하지 않는다면 [3단계](/develop/development-builds/expo-go-to-dev-build#start-the-dev-client)에서 bundler를 `--dev-client`와 함께 시작하세요. 그렇지 않으면 기본적으로 Expo Go로 열립니다.

## 네이티브 앱 빌드하기

Expo Go에서는 JavaScript bundle만 빌드하면 됐지만, development build에서는 네이티브 앱도 함께 컴파일해야 합니다. Expo에서 네이티브 앱을 빌드하는 작업은 두 부분으로 나뉩니다:

1.  네이티브 **android** 및/또는 **ios** 디렉터리 생성하기(언제, 어떻게 이 작업이 필요한지에 대해서는 [자세히 읽어보세요](/develop/development-builds/expo-go-to-dev-build#prebuild))
2.  네이티브 빌드 도구를 사용해 네이티브 앱을 컴파일하기

네이티브 앱을 한 번 빌드하고 나면, 네이티브 코드가 포함된 라이브러리를 추가하거나 업데이트하거나, 앱 이름처럼 네이티브 코드나 설정을 변경하지 않는 한 다시 빌드할 필요가 없습니다.

> 새 프로젝트를 만들면 **android**와 **ios** 디렉터리는 자동으로 **.gitignore**에 추가되므로 Git에 커밋되지 않습니다. 이렇게 하면 필요할 때 언제든지 [CNG](/workflow/continuous-native-generation)를 사용해 로컬이나 CI에서 코드를 다시 생성할 수 있고, 네이티브 코드를 직접 수정할 필요도 없습니다.

### 옵션 1: 로컬 머신에서 빌드하기

로컬 머신에서 네이티브 앱을 빌드하려면 [Android](/workflow/android-studio-emulator)와 [iOS](/workflow/ios-simulator)용 환경 설정 가이드를 따르세요. 여기에는 Android용 Android Studio, iOS용 Xcode 같은 네이티브 빌드 도구를 설치하고 구성하는 과정이 포함됩니다.

모든 설정을 마쳤다면 다음 명령을 실행하세요:

```sh
npx expo run:android
```

기본적으로 이 명령은 Android Emulator 또는 iOS Simulator에 앱을 빌드하고 설치합니다. 휴대전화에서 빌드를 실행해야 한다면 기기를 컴퓨터에 연결하고(Android에서는 기기 신뢰와 USB 디버깅 허용을 선택하고, iOS에서는 [developer mode](/get-started/set-up-your-environment?mode=development-build&buildEnv=local&platform=ios&device=physical#plug-in-your-device-via-usb-and-enable-developer-mode)를 활성화한 뒤) 위 명령에 `--device` 플래그를 추가해 실행하세요.

### 옵션 2: EAS에서 빌드하기

다음과 같은 경우에는 EAS 서버에서 빌드하는 것이 유용합니다:

-   로컬 개발 환경을 설정할 수 없거나 설정하고 싶지 않을 때
-   iOS 앱을 빌드하고 싶지만 Mac이 없을 때
-   development build를 팀과 공유하고 싶을 때

[EAS에서 빌드하기](/develop/development-builds/create-a-build) — EAS에서 Development Build를 만드는 방법

## bundler 시작하기

로컬에서 빌드한 뒤에는 `npx expo run:android|ios`가 bundler를 자동으로 시작합니다. 하지만 bundler를 닫았거나 이전에 빌드한 dev client에서 작업 중이라면, 다음 명령으로 Metro bundler를 다시 시작하세요:

```sh
npx expo start
```

프로젝트에 `expo-dev-client`가 설치되어 있으면 bundler에 **Using development build**가 출력되고, 표시되는 QR 코드는 Expo Go가 아니라 여러분이 만든 development build로 연결됩니다.

## Prebuild

[**Prebuild**](/workflow/continuous-native-generation#prebuild)는 Expo 프로젝트에만 있는 개념입니다. 로컬 구성과 속성을 바탕으로 **android**와 **ios** 디렉터리를 생성하는 과정을 뜻합니다.

### 언제 prebuild를 실행해야 하나요?

`npx expo run:android|ios`로 빌드하고 있고 다음과 같은 네이티브 의존성이나 구성을 변경한다면 로컬에서 prebuild를 실행해야 합니다:

-   네이티브 코드가 포함된 라이브러리를 설치하거나 업데이트할 때
-   [app config](/workflow/configuration)(`app.json`)를 변경할 때
-   Expo SDK 버전을 업그레이드할 때

이런 경우에는 다음 명령으로 네이티브 디렉터리를 다시 빌드해야 합니다:

```sh
npx expo prebuild --clean
```

그런 다음 다음 명령으로 업데이트된 네이티브 코드를 사용해 앱을 다시 빌드하세요:

```sh
npx expo run:android
```

### prebuild를 실행할 필요가 없는 경우

모든 Expo 빌드 도구(`npx expo run:android|ios`와 `eas build`)는 기존 네이티브 폴더가 없으면 자동으로 **prebuild**를 실행합니다. 즉, `npx expo run:android|ios`를 처음 실행할 때나 `eas build`를 사용할 때는 prebuild를 수동으로 실행할 필요가 없습니다.

[Continuous Native Generation (CNG)](/workflow/continuous-native-generation) — Continuous Native Generation(CNG)과 Prebuild의 철학과 장점을 알아보세요
