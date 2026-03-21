---
modificationDate: January 15, 2026
title: Expo Orbit
description: 원클릭 빌드 및 업데이트 실행, simulator 관리로 개발 워크플로를 가속화하세요.
---

# Expo Orbit

원클릭 빌드 및 업데이트 실행, simulator 관리로 개발 워크플로를 가속화하세요.

macOS와 Windows용 [Expo Orbit](https://expo.dev/orbit)를 사용하면 EAS, 로컬 파일, Snack 프로젝트에서 simulator와 실제 기기 위로 build나 update를 더 빠르게 설치하고 실행할 수 있습니다.

## Orbit가 필요한 이유

Orbit가 나오기 전에는 EAS에서 build나 update를 설치하거나(Android와 iOS 실제 기기 또는 emulator/simulator에서), Snack 프로젝트를 simulator에서 실행하는 일이 수작업이었습니다. 선택한 기기에 맞는 build를 설치하려면 `eas build:run` 명령을 실행해 build를 고르거나, archive를 다운로드한 뒤 simulator로 드래그 앤 드롭해야 했습니다(iOS의 경우). Snack 프로젝트의 경우에도 가상 기기에 Expo Go를 설치하고, 로그인하고, 목록에서 Snack을 선택하는 추가 단계가 필요했습니다. Orbit는 이 모든 단계를 가능한 한 매끄럽게 만들어 줍니다.

## 주요 기능

-   simulator 목록을 보고 실행할 수 있으며, 오디오 없이 Android emulator를 실행하는 것도 지원합니다.
-   EAS의 build를 simulator와 실제 기기에 원클릭으로 설치하고 실행할 수 있습니다.
-   Android Emulator 또는 iOS Simulator에서 [EAS의 update를 설치하고 열 수 있습니다](/review/with-orbit).
-   simulator에서 Snack 프로젝트를 원클릭으로 실행할 수 있습니다.
-   Finder를 사용하거나 메뉴 막대 앱에 파일을 드래그 앤 드롭해 로컬 파일에서 앱을 설치하고 실행할 수 있습니다. Orbit는 모든 Android **.apk**, iOS Simulator 호환 **.app**, 또는 ad hoc 서명된 앱을 지원합니다.
-   [EAS dashboard](https://expo.dev)에 고정한 프로젝트를 보고 최신 빌드를 빠르게 실행할 수 있습니다.

## 설치

> Orbit는 macOS와 Windows 모두에서 Android SDK에 의존하며, macOS에서는 기기 관리를 위해 `xcrun`에도 의존합니다. 따라서 [Android Studio](/workflow/android-studio-emulator)와 [Xcode](/workflow/ios-simulator)를 모두 설정해 두어야 합니다.

macOS에서는 Homebrew로 Orbit를 다운로드할 수 있고, 또는 [GitHub releases](https://github.com/expo/orbit/releases)에서 직접 다운로드할 수도 있습니다.

```sh
brew install expo-orbit
```

로그인할 때 Orbit가 자동으로 시작되게 하려면 메뉴 막대의 Orbit 아이콘을 클릭한 다음 **Settings**로 들어가 **Launch on Login** 옵션을 선택하세요.
