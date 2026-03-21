---
modificationDate: January 29, 2026
title: development build 소개
description: development build를 왜 사용해야 하는지와 시작 방법을 알아보세요.
---

# development build 소개

development build를 왜 사용해야 하는지와 시작 방법을 알아보세요.

**Development build**는 [`expo-dev-client`](/versions/latest/sdk/dev-client) 라이브러리를 포함한 앱의 "Debug" 빌드를 가리키는 Expo의 용어입니다. 이 라이브러리는 내장된 React Native 개발 도구에 추가 기능을 더해 줍니다. 예를 들어 네트워크 요청 검사 지원이나, 서로 다른 development server(예: 여러분의 머신이나 팀원의 머신에서 실행 중인 server)와 앱의 배포본(예: EAS Update로 게시한 update) 사이를 전환할 수 있는 "launcher" UI가 여기에 포함됩니다.

Expo Go와 development build의 차이

[Expo Go](https://expo.dev/go)는 학생과 입문자가 빠르게 시작할 수 있도록 만든 playground 앱입니다. 정해진 네이티브 라이브러리 세트가 내장되어 있어 직접 네이티브 앱을 빌드하지 않아도 JavaScript 코드를 작성하고 변경 사항을 즉시 확인할 수 있습니다. 반면 development build는 production-grade Expo 앱을 작업하기 위한 완전한 개발 환경입니다.

네이티브 앱과 JavaScript bundle

**네이티브 앱**은 기기에 설치하는 앱 자체입니다. Expo Go는 미리 빌드된 네이티브 앱으로 playground처럼 동작하며, 설치 후에는 변경할 수 없습니다. 새 네이티브 라이브러리를 추가하거나 앱 이름과 아이콘 같은 항목을 바꾸려면 여러분만의 네이티브 앱, 즉 development build를 빌드해야 합니다.

**JavaScript bundle (`npx expo start`)**에는 앱의 UI 코드와 비즈니스 로직이 들어 있습니다. production 앱에서는 앱 자체와 함께 배포되는 **main.js** bundle이 하나 존재합니다. development 환경에서는 이 JS bundle이 로컬 머신에서 live reload됩니다. React Native의 주요 역할은 JavaScript 코드가 네이티브 API(Image, Camera, Notifications 등)에 접근할 수 있는 경로를 제공하는 것입니다. 하지만 **네이티브 앱**에 번들된 API와 라이브러리만 사용할 수 있습니다.

[Expo Go & Development Builds: which should you use?](https://www.youtube.com/watch?v=FdjczjkwQKE) — 이 튜토리얼 영상에서 Beto가 각각이 무엇인지, 그리고 언제 development build를 선택해야 하는지 설명합니다.

## development build를 사용해야 하는 이유(즉, Expo Go에서는 _무엇을 할 수 없고_ 왜 그런가)

Expo Go는 학생과 입문자가 React Native의 기본을 이해하기 위한 playground입니다. 기능이 제한적이고 production-grade 프로젝트를 만들기에는 적합하지 않기 때문에, 대부분의 앱은 결국 development build로 전환하게 됩니다. Expo Go에서 정확히 무엇이 _불가능한지_, 그리고 _왜 그런지_를 이해하면 언제, 왜 이 전환을 해야 하는지 더 잘 판단할 수 있습니다.

Expo Go에 없는 네이티브 코드 라이브러리 사용하기

예시로 [`react-native-webview`](/versions/latest/sdk/webview)를 생각해 보겠습니다. 이 라이브러리는 네이티브 코드를 포함하지만 [Expo Go에 포함되어 있습니다](https://github.com/expo/expo/blob/main/apps/expo-go/package.json#L23). 프로젝트에서 `npx expo install react-native-webview` 명령을 실행하면 JS 코드와 네이티브 코드를 모두 포함한 라이브러리가 **node_modules** 디렉터리에 설치됩니다. 하지만 여러분이 빌드하는 JS bundle은 _오직 JS 코드만_ 사용합니다. 그 뒤 JS bundle이 Expo Go로 업로드되고, Expo Go 앱에 이미 번들되어 있던 네이티브 코드와 상호작용하게 됩니다.

반대로 포함되지 않은 라이브러리, 예를 들어 [`react-native-firebase`](/guides/using-firebase#using-react-native-firebase)를 사용하려고 하면 JS 코드를 사용할 수 있고 새 bundle도 Expo Go에 hot reload할 수 있습니다. 하지만 JS 코드가 Expo Go 안에 존재하지 않는 React Native Firebase package의 네이티브 코드를 호출하려 하기 때문에 즉시 오류가 발생합니다. 앱 스토어에 업로드된 번들에 네이티브 코드가 이미 포함되어 있지 않다면, Expo Go 앱 안으로 그 네이티브 코드를 가져올 방법은 없습니다.

앱 아이콘, 이름, splash screen 변경 사항 테스트하기

앱을 Expo Go에서만 개발하고 있다면, 제공한 값과 이미지를 사용하는 스토어 버전을 빌드할 수는 있습니다. 다만 Expo Go 안에서 이를 테스트하는 것은 불가능합니다.

이러한 네이티브 asset은 네이티브 bundle과 함께 배포되며 앱이 설치된 뒤에는 변경할 수 없습니다. Expo Go 앱도 splash screen을 보여 주는데, 이는 단색 배경 위에 앱 아이콘을 띄우는 방식입니다. 실제 splash screen이 아마 어떻게 보일지를 확인하기 위한 개발 전용 에뮬레이션입니다. 하지만 제한이 있어서, 예를 들어 splash screen에 애니메이션을 주기 위한 `SplashScreen.setOptions`는 테스트할 수 없습니다.

원격 push notification

[인앱 알림](/versions/latest/sdk/notifications)은 Expo Go에서 사용할 수 있지만, 원격 push notification(즉, server에서 앱으로 push notification을 보내는 것)은 지원되지 않습니다. push notification 서비스는 여러분의 push notification 인증서에 연결되어야 하기 때문입니다. Expo Go에서도 작동하게 만들 수는 있지만 production build에서 혼란을 자주 일으킵니다. development build에서 원격 push notification을 테스트하는 것이 권장되며, 이를 통해 development와 production 사이의 동작 일치를 확인할 수 있습니다.

App Link/Universal Link 구현하기

[Android App Links](/linking/android-app-links)와 [iOS Universal Links](/linking/ios-universal-links)는 모두 네이티브 앱과 웹사이트 사이의 양방향 연결이 필요합니다. 특히 네이티브 앱에 연결할 웹사이트 URL이 포함되어야 합니다. 앞서 설명한 네이티브 코드의 불변성 때문에, 이는 Expo Go에서는 불가능합니다.

오래된 SDK로 만든 프로젝트 열기(iOS 기기 전용)

Expo Go는 한 번에 하나의 SDK 버전만 지원할 수 있습니다. 새 SDK 버전이 릴리스되면 Expo Go도 새 버전을 지원하도록 업데이트되고, 스토어에서 설치할 수 있는 Expo Go는 그 버전 하나뿐입니다.

Android 기기, Android Emulator, iOS Simulator에서 개발 중이라면 호환되는 Expo Go 버전을 [다운로드해 설치](https://expo.dev/go)할 수 있습니다. 이것이 불가능한 유일한 플랫폼은 iPhone 기기인데, Apple이 오래된 앱 버전의 side-loading을 지원하지 않기 때문입니다.

[Expo Go에서 development build로](/develop/development-builds/expo-go-to-dev-build) — 기존 Expo Go 프로젝트를 development build로 마이그레이션하는 방법을 알아보세요

[로컬 앱 개발](/guides/local-app-development) — 로컬 머신에서 development client를 빌드하는 방법

[EAS에서 development build 만들기](/develop/development-builds/create-a-build) — EAS에서 development client를 빌드하는 방법
