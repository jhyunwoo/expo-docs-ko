---
modificationDate: January 20, 2026
title: '로컬 빌드: 개요'
description: Expo 프로젝트에서 자신의 머신을 사용해 앱을 로컬로 빌드하는 방법에 대한 개요입니다.
---

# 로컬 빌드: 개요

Expo 프로젝트에서 자신의 머신을 사용해 앱을 로컬로 빌드하는 방법에 대한 개요입니다.

Android Studio와 Xcode를 활용해 로컬 개발 환경에서 앱을 로컬로 빌드할 수 있습니다. 이 빌드 프로세스는 디버그 빌드와 릴리스 빌드 모두에 적용할 수 있습니다. 이 페이지는 자신의 머신을 사용해 앱을 로컬로 빌드하는 여러 방법을 개괄적으로 소개하고, 이 workflow에 필요할 수 있는 다른 가이드를 함께 안내합니다.

## 앱을 로컬로 빌드해야 하는 경우

개발자 머신에서 앱을 빌드하고 싶어지는 시나리오는 여러 가지가 있습니다:

-   디버그 빌드에서 네이티브 코드 변경이나 플랫폼별 변경을 빠르게 반복 테스트하고 싶을 때
-   디버그 빌드를 테스트하기 위해 네이티브 코드를 수동으로 생성하고 싶을 때
-   네트워크 접근이 제한된 환경 안에서 빌드를 만들어야 하는 모든 경우
-   자신의 credential(예: upload key 등)을 로컬에서 직접 관리하고 싶을 때
-   자체 custom build cache provider를 테스트하거나 통합하고 싶을 때
-   Android용 prebuilt Expo Modules 사용을 끄고, 한 번은 source에서 직접 로컬 컴파일하고 싶을 때

> **참고**: 앱을 로컬에서 빌드하는 것은 EAS Build를 보완합니다. 클라우드 자동화를 위해서는 build 서비스를 계속 사용하고, 개발을 위해서는 로컬 빌드로 전환할 수 있습니다.

## 사전 요구 사항

로컬 머신에서 Android와 iOS 프로젝트를 컴파일하고 실행하려면 Android Studio와 Xcode를 설치하고 설정해야 합니다. 설정 방법은 다음 가이드를 참고하세요:

-   [Android Studio](/get-started/set-up-your-environment?platform=android&device=physical&mode=development-build&buildEnv=local#set-up-an-android-device-with-a-development-build)
-   [Xcode](/get-started/set-up-your-environment?platform=ios&device=physical&mode=development-build&buildEnv=local#set-up-an-ios-device-with-a-development-build)

## 로컬에서 디버그 빌드 만들기

디버그 빌드를 빠르게 만들고 반복 작업하려면 Expo CLI의 `npx expo run:[android|ios]` 명령을 사용할 수 있습니다. 이 명령은 로컬에 설치된 Android SDK 또는 Xcode를 사용해 프로젝트를 앱의 디버그 빌드로 컴파일합니다.

[로컬에서 디버그 빌드 만들기](/guides/local-app-development) — Expo 앱의 디버그 빌드를 로컬에서 만드는 방법을 알아보세요.

## 로컬에서 릴리스 빌드 만들기

앱의 릴리스 빌드(즉 production build)를 만들려면 Android Studio와 Xcode가 제공하는 도구를 사용해 signing credential을 생성합니다. 그런 다음 릴리스 빌드를 만들고 Google Play Store 또는 Apple App Store에 앱을 수동 제출하는 과정을 진행할 수 있습니다.

[로컬에서 릴리스 빌드 만들기](/guides/local-app-production) — 서명된 Android App Bundle을 생성하고, Xcode에서 iOS 빌드를 archive한 뒤, 앱 스토어에 수동 제출하세요.

## Provider의 이전 빌드 재사용하기

provider의 빌드를 cache하고 재사용해 로컬 개발 속도를 높일 수 있습니다. EAS를 build provider로 사용할 수도 있고, 자신만의 custom provider를 만들 수도 있습니다.

[Build cache provider 사용하기](/guides/cache-builds-remotely) — EAS build caching을 활성화하거나 custom provider를 도입해 로컬 빌드 시간을 줄이세요.

## Android용 Prebuilt Expo Modules

SDK 53 이상은 빌드마다 Gradle이 수행하는 작업을 줄이기 위해 Android용 prebuilt Expo Modules를 제공합니다. 기본값을 계속 사용할 수도 있고, 특정 module의 source code를 수정해야 할 때는 선택적으로 이를 끌 수도 있습니다.

[Android용 Prebuilt Expo Modules](/guides/prebuilt-expo-modules) — prebuilt module이 어떻게 동작하는지 이해하고, 전역 또는 package별로 opt out하는 방법을 알아보세요.
