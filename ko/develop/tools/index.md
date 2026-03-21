---
modificationDate: March 01, 2026
title: 개발 도구
description: 프로젝트를 만드는 과정의 여러 측면에서 도움이 되는 Expo 도구와 웹사이트를 개괄적으로 알아보세요.
---

# 개발 도구

프로젝트를 만드는 과정의 여러 측면에서 도움이 되는 Expo 도구와 웹사이트를 개괄적으로 알아보세요.

Expo로 새 프로젝트를 만들면, 아래의 핵심 도구와 웹사이트를 익혀 두는 것이 앱 개발 과정에 큰 도움이 됩니다. 이 페이지는 권장 도구 목록을 개괄적으로 소개합니다.

## Expo CLI

Expo CLI는 개발 도구이며, 새 프로젝트를 만들 때 `expo` 패키지와 함께 자동으로 설치됩니다. `npx`(Node.js package runner)를 사용해 실행할 수 있습니다.

앱 개발 단계에서 더 빠르게 작업할 수 있도록 설계되어 있습니다. 예를 들어 Expo CLI와의 첫 상호작용은 `npx expo start` 명령으로 development server를 시작하는 것입니다.

다음은 앱을 개발하는 동안 Expo CLI와 함께 자주 사용하게 되는 명령 목록입니다:

| Command | Description |
| --- | --- |
| `npx expo start` | development server를 시작합니다(development build를 사용하든 Expo Go를 사용하든 동일합니다). |
| `npx expo prebuild` | [Prebuild](/workflow/continuous-native-generation)를 사용해 네이티브 Android 및 iOS 디렉터리를 생성합니다. |
| `npx expo run:android` | 네이티브 Android 앱을 로컬에서 컴파일합니다. |
| `npx expo run:ios` | 네이티브 iOS 앱을 로컬에서 컴파일합니다. |
| `npx expo install package-name` | 새 라이브러리를 설치하거나, 이 명령에 `--fix` 옵션을 추가해 프로젝트의 특정 라이브러리를 검증하고 업데이트할 때 사용합니다. |
| `npx expo lint` | ESLint를 [설정하고 구성](/guides/using-eslint)합니다. 이미 ESLint가 구성되어 있다면 이 명령은 [프로젝트 파일을 lint](/guides/using-eslint#usage)합니다. |

요약하면 Expo CLI는 앱을 개발하고, 컴파일하고, 시작하는 등의 작업을 할 수 있게 해 줍니다. 더 많은 옵션과 CLI로 수행할 수 있는 작업은 [Expo CLI 레퍼런스](/more/expo-cli)를 참고하세요.

## EAS CLI

EAS CLI는 Expo account에 로그인하고 Build, Update, Submit 같은 여러 EAS 서비스를 사용해 앱을 컴파일하는 데 사용됩니다. 또한 이 도구로 다음 작업도 할 수 있습니다:

-   앱을 app store에 게시하기
-   앱의 development, preview, production build 만들기
-   over-the-air(OTA) update 만들기
-   앱 자격 증명 관리하기
-   iOS 기기용 ad hoc provisioning profile 만들기

EAS CLI를 사용하려면 다음 명령을 실행해 로컬 머신에 전역 설치해야 합니다:

```sh
npm install -g eas-cli
```

터미널에서 `eas --help`를 사용하면 사용 가능한 명령을 자세히 볼 수 있습니다. 전체 레퍼런스는 [`eas-cli` npm 페이지](https://www.npmjs.com/package/eas-cli)를 참고하세요.

## Expo Doctor

Expo Doctor는 Expo 프로젝트의 문제를 진단하는 command line 도구입니다. 사용하려면 프로젝트 루트 디렉터리에서 다음 명령을 실행하세요:

```sh
npx expo-doctor
```

이 명령은 [app config](/workflow/configuration), **package.json** 파일, 의존성 호환성, 구성 파일, 프로젝트 전반의 상태에서 발생할 수 있는 일반적인 문제를 점검하고 코드베이스를 분석합니다. 검사가 완료되면 Expo Doctor가 결과를 출력합니다.

Expo Doctor가 문제를 발견하면 문제 설명과 함께 수정 방법 또는 도움을 받을 수 있는 위치를 알려 줍니다.

기본적으로 Expo Doctor는 프로젝트의 package를 [React Native directory](https://reactnative.directory/)와 대조해 검증하고, 네이티브 디렉터리가 존재할 때 app config 속성이 제대로 동기화되는지도 확인합니다. 이 검사는 프로젝트의 **package.json** 파일에서 구성할 수 있습니다. 자세한 내용은 [`reactNativeDirectoryCheck`](/versions/latest/config/package-json#reactnativedirectorycheck)와 [`appConfigFieldsNotSyncedCheck`](/versions/latest/config/package-json#appconfigfieldsnotsynced)를 참고하세요.

사용법 정보는 `npx expo-doctor --help`로도 확인할 수 있습니다.

## Orbit

Orbit은 macOS와 Windows에서 사용할 수 있는 앱으로, 다음 기능을 제공합니다:

-   실제 기기와 emulator에서 EAS의 build를 설치하고 실행합니다.
-   Android Emulator 또는 iOS Simulator에서 EAS의 update를 설치하고 실행합니다.
-   Android Emulator 또는 iOS Simulator에서 snack 프로젝트를 실행합니다.
-   로컬 파일을 사용해 앱을 설치하고 실행합니다. Orbit은 모든 Android **.apk**, iOS Simulator와 호환되는 **.app**, ad hoc 서명된 앱을 지원합니다.
-   EAS dashboard에 고정한 프로젝트 목록을 보여 줍니다.

### 설치

macOS에서는 Homebrew로 Orbit을 설치하거나, [GitHub releases](https://github.com/expo/orbit/releases)에서 직접 다운로드할 수 있습니다.

```sh
brew install expo-orbit
```

로그인할 때 Orbit이 자동으로 시작되게 하려면 메뉴 막대의 Orbit 아이콘을 클릭한 뒤 **Settings**로 이동해 **Launch on Login** 옵션을 선택하세요.

> Orbit은 macOS와 Windows 모두에서 Android SDK를 사용하고, macOS에서는 기기 관리를 위해 `xcrun`도 사용합니다. 따라서 [Android Studio](/workflow/android-studio-emulator)와 [Xcode](/workflow/ios-simulator)를 모두 설정해야 합니다.

## VS Code용 Expo Tools

Expo Tools는 app config 파일로 작업할 때 개발 경험을 향상시키는 VS Code 확장입니다. app config, EAS config, store config, Expo Module config 파일 등에 대한 autocomplete와 intellisense 기능을 제공합니다.

[Expo Tools VS Code 확장 설치하기](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools) — 이 링크로 확장을 설치하거나 VS Code editor에서 Expo Tools를 직접 검색하세요.

이 확장을 사용하면 VS Code의 내장 debugger로 앱을 디버깅할 수도 있습니다. breakpoints를 설정하고, 변수를 검사하고, debug console을 통해 코드를 실행하는 등의 작업이 가능합니다. 디버깅에 이 확장을 사용하는 방법은 [VS Code로 디버깅하기](/debugging/tools#debugging-with-vs-code)를 참고하세요.

## Snack과 Expo Go로 프로토타입 테스트하기

### Snack

Snack은 Expo Go와 비슷하게 동작하는 브라우저 기반 개발 환경입니다. 컴퓨터에 어떤 도구도 다운로드하지 않고 React Native 코드 조각을 공유하고 실험할 수 있는 훌륭한 방법입니다.

사용하려면 [snack.expo.dev](https://snack.expo.dev/)로 이동한 뒤 **App.js**의 `<Text>` component를 편집하고, 오른쪽 패널에서 플랫폼(Android, iOS, web)을 선택해 변경 사항을 실시간으로 확인하세요.

### Expo Go

[Expo Go](https://expo.dev/go)는 학생과 입문자가 React Native를 체험해 볼 수 있는 무료 오픈소스 playground입니다. Android와 iOS에서 동작합니다.

사용 방법에 대한 자세한 정보는 다음을 참고하세요:

-   [이 링크](/get-started/set-up-your-environment?mode=expo-go)를 클릭해 Set up your environment 가이드로 이동합니다
-   **Where would you like to develop?** 아래에서 개발할 플랫폼을 선택합니다
-   **How would you like to develop?** 아래에서 Expo Go를 선택합니다
-   해당 가이드에 나온 안내를 따릅니다

> **참고:** Expo Go는 기능이 제한적이어서 production-grade 프로젝트를 만들기에는 적합하지 않습니다. 대신 [development build](/get-started/set-up-your-environment?mode=development-build)를 사용하세요.

지원되지 않는 SDK 버전의 프로젝트를 열면 어떻게 되나요?

지원되지 않는 SDK 버전용으로 만들어진 프로젝트를 Expo Go에서 실행하면 다음과 같은 오류가 표시됩니다:

```sh
"Project is incompatible with this version of Expo Go"
```

이를 해결하려면 프로젝트를 [지원되는 SDK 버전](/versions/latest#each-expo-sdk-version-depends-on-a-react-native-version)으로 업그레이드하는 것을 권장합니다. 방법을 알고 싶다면 [내 프로젝트를 어떻게 업그레이드하나요?](/develop/tools#how-do-i-upgrade-my-project-from)를 참고하세요.

지원되지 않는 SDK 버전의 프로젝트를 어떻게 업그레이드하나요?

특정 SDK 버전으로 업그레이드하는 방법은 [Expo SDK 업그레이드 가이드](/workflow/upgrading-expo-sdk-walkthrough)를 참고하세요.

## React Native directory

development build를 사용해 프로젝트를 만들면, React Native와 호환되는 어떤 라이브러리든 Expo 프로젝트에서 동작합니다.

[reactnative.directory](https://reactnative.directory/)는 React Native 라이브러리를 위한 검색 가능한 데이터베이스입니다. 찾고 있는 라이브러리가 Expo SDK에 포함되어 있지 않다면, 이 디렉터리를 사용해 프로젝트와 호환되는 라이브러리를 찾아보세요.

[라이브러리 사용하기](/workflow/using-libraries) — React Native core 라이브러리, Expo SDK 라이브러리, 서드파티 라이브러리의 차이와 서드파티 라이브러리 호환성을 판단하는 방법을 알아보세요.
