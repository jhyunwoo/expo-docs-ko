---
modificationDate: February 28, 2026
title: 첫 빌드 만들기
description: EAS Build로 앱의 빌드를 만드는 방법을 알아보세요.
---

# 첫 빌드 만들기

EAS Build로 앱의 빌드를 만드는 방법을 알아보세요.

EAS Build를 사용하면 Google Play Store 또는 Apple App Store에 제출할 준비가 된 앱 바이너리를 빌드할 수 있습니다. 이 가이드에서는 그 방법을 알아보겠습니다.

또는 앱을 Android 기기/emulator에 직접 설치하거나 iOS Simulator에 설치하고 싶다면, 그렇게 하는 방법을 설명하는 자료도 함께 안내해 드립니다.

작은 앱의 경우 Android와 iOS 플랫폼용 빌드는 몇 분 안에 시작됩니다. 진행 중 문제가 생기면 [Discord and Forums](https://chat.expo.dev/)에서 도움을 받을 수 있습니다.

## 사전 준비

EAS Build는 빠르게 발전하고 있는 서비스입니다. 프로젝트의 빌드를 만들기 전에 [제한 사항](/build-reference/limitations) 페이지와 아래의 다른 사전 준비 항목을 먼저 확인하는 것을 권장합니다.

빌드하고 싶은 React Native Android 및/또는 iOS 프로젝트

아직 프로젝트가 없나요? 괜찮습니다. 이 가이드에 사용할 수 있는 "Hello world" 앱은 빠르고 쉽게 만들 수 있습니다.

새 프로젝트를 만들려면 다음 명령을 실행하세요:

```sh
npx create-expo-app@latest my-app --template default@sdk-55
```

EAS Build는 `npx create-react-native-app`, `npx react-native`, `ignite-cli` 및 다른 프로젝트 부트스트래핑 도구로 만든 프로젝트에서도 잘 동작합니다.

Expo 사용자 계정

EAS Build는 EAS 요금제를 결제하든 Free 플랜을 사용하든, Expo 계정만 있으면 누구나 사용할 수 있습니다. [https://expo.dev/signup](https://expo.dev/signup)에서 가입할 수 있습니다.

유료 구독자는 추가 빌드 동시성, 빌드 대기열 시간을 줄이기 위한 우선 접근, 더 긴 빌드 타임아웃 제한 등 품질 향상을 누릴 수 있습니다. 다양한 플랜과 혜택에 대한 자세한 내용은 [EAS pricing](https://expo.dev/pricing)을 참고하세요.

## 최신 EAS CLI 설치하기

EAS CLI는 터미널에서 EAS 서비스와 상호작용할 때 사용하는 명령줄 앱입니다. 설치하려면 다음 명령을 실행하세요:

```sh
npm install -g eas-cli
```

위 명령을 사용하면 새 버전의 EAS CLI가 있는지도 확인할 수 있습니다. 항상 최신 버전을 유지하는 것을 권장합니다.

> 전역 패키지 설치에는 `yarn`보다 `npm` 사용을 권장합니다. 또는 `npx eas-cli@latest`를 사용할 수도 있습니다. 문서에서 `eas`를 사용하라고 할 때는 그 대신 이 명령을 사용하면 됩니다.

## Expo 계정에 로그인하기

이미 Expo CLI를 사용해 Expo 계정에 로그인되어 있다면 이 섹션의 단계는 건너뛰어도 됩니다. 그렇지 않다면 다음 명령으로 로그인하세요:

```sh
eas login
```

로그인 여부는 `eas whoami`를 실행해 확인할 수 있습니다.

## 프로젝트 구성하기

Android 또는 iOS 프로젝트를 EAS Build용으로 구성하려면 다음 명령을 실행하세요:

```sh
eas build:configure
```

내부적으로 어떤 일이 일어나는지 더 자세히 알고 싶다면 [빌드 구성 프로세스 레퍼런스](/build-reference/build-configuration)를 참고하세요.

개발용으로는 [development build](/develop/development-builds/introduction)를 만드는 것을 권장합니다. development build는 앱의 debug build이며 [`expo-dev-client`](/versions/latest/sdk/dev-client) 라이브러리를 포함합니다. 이 방식은 가능한 한 빠르게 반복 작업할 수 있게 해 주며, 더 유연하고 신뢰할 수 있고 완전한 개발 환경을 제공합니다. 라이브러리를 설치하려면 다음 명령을 실행하세요:

```sh
npx expo install expo-dev-client
```

일부 시나리오에서는 추가 구성이 필요할 수 있습니다:

-   앱 코드가 환경 변수에 의존하나요? [빌드 구성에 환경 변수를 추가하세요](/eas/environment-variables).
-   프로젝트가 monorepo 안에 있나요? [이 지침을 따르세요](/build-reference/build-with-monorepos).
-   private npm package를 사용하나요? [npm token을 추가하세요](/build-reference/private-npm-packages).
-   앱이 Node, Yarn, npm, CocoaPods, Xcode 같은 도구의 특정 버전에 의존하나요? [빌드 구성에 해당 버전을 지정하세요](/build/eas-json).

## 빌드 실행하기

### Android Emulator/기기 또는 iOS Simulator용 빌드

EAS Build를 가장 쉽게 체험하는 방법은 Android 기기/emulator 또는 iOS Simulator에서 실행할 수 있는 빌드를 만드는 것입니다. 스토어에 업로드하는 것보다 빠르고, 스토어 개발자 멤버십 계정도 필요하지 않습니다. 이 방법을 시도해 보고 싶다면 [Android용 설치 가능한 APK 만들기](/tutorial/eas/android-development-build)와 [iOS용 simulator build 만들기](/tutorial/eas/ios-development-build-for-simulators)를 읽어 보세요.

### 앱 스토어용 빌드

앱 스토어용 빌드 프로세스를 시작하기 전에 스토어 개발자 계정이 있어야 하며, 앱 서명 자격 증명을 생성하거나 제공해야 합니다.

앱 서명 자격 증명을 생성하는 데 익숙하든 아니든 EAS CLI가 대부분의 작업을 대신 처리해 줍니다. 앱 서명 자격 증명 프로세스를 EAS CLI가 처리하도록 선택할 수 있습니다. 자세한 내용은 아래의 [Android 앱 서명 자격 증명](/build/setup#android-app-signing-credentials) 또는 [iOS 앱 서명 자격 증명](/build/setup#ios-app-signing-credentials) 절차를 참고하세요.

Google Play Store에 배포하려면 Google Play Developer 멤버십이 필요합니다.

EAS Build로 앱을 빌드하고 서명할 수는 있지만, 멤버십이 없으면 Google Play Store에 업로드할 수 없습니다. 멤버십은 1회성 $25 USD 비용입니다.

Apple App Store용 빌드를 하려면 Apple Developer Program 멤버십이 필요합니다.

Apple App Store용 릴리스 빌드를 EAS Build로 만들 계획이라면, $99 USD의 [Apple Developer Program](https://developer.apple.com/programs) 멤버십이 있는 계정에 접근할 수 있어야 합니다.

Google Play Store 또는 Apple App Store 계정이 있는지 확인했고, 앱 서명 자격 증명을 EAS CLI가 처리할지 여부도 결정했다면, 각 플랫폼 스토어용 빌드를 위해 다음 명령을 실행할 수 있습니다:

```sh
eas build --platform android
```

> 빌드 명령에 `--message`를 전달해 빌드에 메시지를 첨부할 수 있습니다. 예를 들어 `eas build --platform ios --message "Some message"`처럼 사용할 수 있습니다. 메시지는 웹사이트에 표시되며, 팀에 빌드 목적을 메모로 남기고 싶을 때 유용합니다.

또는 `--platform all` 옵션을 사용해 Android와 iOS를 동시에 빌드할 수도 있습니다:

```sh
eas build --platform all
```

> 이미 앱을 스토어에 릴리스한 적이 있고 기존 [앱 서명 자격 증명](/app-signing/app-credentials)을 그대로 사용하고 싶다면, [이 지침에 따라 자격 증명을 구성하세요](/app-signing/existing-credentials).

#### Android 앱 서명 자격 증명

-   아직 앱의 keystore를 생성하지 않았다면 `Generate new keystore`를 선택해 EAS CLI가 대신 처리하게 할 수 있습니다. 그러면 준비가 끝납니다. keystore는 EAS 서버에 안전하게 저장됩니다.
-   이전에 `expo build:android`로 앱을 빌드한 적이 있다면, 같은 자격 증명을 여기에서도 사용할 수 있습니다.
-   keystore를 수동으로 생성하고 싶다면 자세한 내용은 [수동 Android 자격 증명 가이드](/app-signing/local-credentials#android-credentials)를 참고하세요.

#### iOS 앱 서명 자격 증명

-   아직 provisioning profile 및/또는 distribution certificate를 생성하지 않았다면, Apple Developer Program 계정으로 로그인하고 프롬프트를 따라 EAS CLI가 대신 처리하게 할 수 있습니다.
-   이미 `expo build:ios`로 앱을 빌드한 적이 있다면, 같은 자격 증명을 여기에서도 사용할 수 있습니다.
-   자격 증명을 직접 수동으로 생성하고 싶다면 자세한 내용은 [수동 iOS 자격 증명 가이드](/app-signing/local-credentials#ios-credentials)를 참고하세요.

## 빌드 완료까지 기다리기

기본적으로 `eas build` 명령은 빌드가 완료될 때까지 기다리지만, 기다리고 싶지 않다면 중간에 중단할 수도 있습니다. 빌드 프로세스가 시작되면 EAS CLI가 표시하는 build details 페이지 링크를 따라가 진행 상황을 모니터링하고 로그를 읽을 수 있습니다. 또는 [build dashboard](https://expo.dev/builds)에 방문하거나 다음 명령을 실행해 이 페이지를 찾을 수도 있습니다:

```sh
eas build:list
```

조직 구성원이며 빌드가 조직 계정 명의로 실행되었다면, [해당 계정의 build dashboard](https://expo.dev/accounts/%5Baccount%5D/builds)에서 build details를 찾을 수 있습니다.

> **빌드가 실패했나요?** [구성 단계](/build/setup#3-configure-the-project)에서 해당되는 지침을 모두 따랐는지 다시 확인하고, 필요하다면 [문제 해결 가이드](/build-reference/troubleshooting)를 참고하세요.

## 빌드 배포하기

여기까지 왔다면 축하합니다. 어떤 경로를 선택했는지에 따라, 이제 앱 스토어에 업로드할 준비가 된 빌드가 있거나, Android 기기/iOS Simulator에 직접 설치할 수 있는 빌드가 있게 됩니다.

### 앱을 앱 스토어에 배포하기

앱 스토어에 제출하려면 그 목적에 맞게 명시적으로 빌드한 경우에만 가능합니다. 스토어용 빌드를 만들었다면 [EAS Submit으로 앱을 앱 스토어에 제출하는 방법](/submit/introduction)을 참고하세요.

### 앱 설치 및 실행하기

앱을 Android 기기/iOS Simulator에 직접 설치할 수 있는 경우는 오직 그 목적에 맞게 명시적으로 빌드했을 때뿐입니다. 앱 스토어 배포용으로 빌드했다면 먼저 앱 스토어에 업로드한 뒤 그곳에서 설치해야 합니다(예: Apple의 TestFlight 앱).

앱을 Android 기기/iOS Simulator에 직접 설치하는 방법을 알아보려면 [build dashboard](https://expo.dev/accounts/%5Baccount%5D/builds)에서 build details 페이지로 이동한 뒤 "Install" 버튼을 클릭하세요.

## 다음 단계

이 가이드는 EAS Build로 첫 빌드를 만드는 단계를, 각 과정의 세부 내용을 지나치게 깊게 들어가지 않는 선에서 안내했습니다.

더 알아볼 준비가 되었다면, 다음 주제로 이어서 살펴보는 것을 권장합니다:

-   [eas.json으로 구성하기](/build/eas-json)
-   [Internal distribution](/build/internal-distribution)
-   [Updates](/build/updates)
-   [제출 자동화하기](/build/automate-submissions)
-   [CI에서 빌드 트리거하기](/build/building-on-ci)

또한 관심 있는 주제를 더 알아보기 위해 레퍼런스 섹션을 살펴볼 수도 있습니다. 예를 들어 다음과 같습니다:

-   [Build webhooks](/eas/webhooks)
-   [빌드 서버 인프라](/build-reference/infrastructure)
-   [Android](/build-reference/android-builds)와 [iOS](/build-reference/ios-builds) 빌드 프로세스가 어떻게 동작하는지
