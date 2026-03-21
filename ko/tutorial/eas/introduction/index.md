---
modificationDate: January 08, 2025
title: 'EAS 튜토리얼: 소개'
description: Build, Update, Submit workflow를 다루는 Expo Application Services(EAS)를 사용한 Android 및 iOS 앱 빌드 튜토리얼 소개입니다.
---

# EAS 튜토리얼: 소개

Build, Update, Submit workflow를 다루는 Expo Application Services(EAS)를 사용한 Android 및 iOS 앱 빌드 튜토리얼 소개입니다.

## 이 튜토리얼에 대해

이 튜토리얼은 [Expo Application Services (EAS)](https://expo.dev/eas)의 핵심 서비스인 [Build](/build/introduction), [Submit](/submit/introduction), [Update](/eas-update/introduction)를 능숙하게 사용할 수 있도록 도와줍니다. 튜토리얼을 마치면 개인 프로젝트와 팀 프로젝트를 위한 전문적인 모바일 Continuous Integration(CI)/Continuous Development(CD) 파이프라인을 설정하는 방법을 알게 됩니다.

이 튜토리얼은 다음 주제를 다룹니다:

-   EAS Build를 사용해 development build를 만들고 설치한 뒤 디바이스, emulator, simulator에서 실행하기
-   Expo Go 대신 development build를 사용할 때의 이점 체험하기
-   팀 또는 외부 이해관계자와 development build를 공유하는 workflow 구현하기
-   앱 build version 자동 증가시키기
-   development와 preview 같은 서로 다른 app variant를 하나의 디바이스에 동시에 설치하기
-   개발 단계에서 EAS Update를 사용해 update를 빠르게 만들고 배포하기
-   GitHub 저장소와 통합해 build 프로세스 자동화하기

이 주제들은 EAS를 효과적으로 사용하고 필요할 때 더 고급 주제로 나아가기 위한 기초를 제공합니다.

## 사전 준비

이 튜토리얼은 직접 따라 하는 실습형이며 약 두 시간 안에 완료하도록 설계되었습니다. 따라 하려면 기존 Expo 프로젝트가 하나 필요하고, 이를 로컬 머신에 설정해 두어야 합니다. 선택지는 다음과 같습니다:

-   이전 튜토리얼의 Sticker Smash 앱을 계속 사용하기. 처음이라면 [GitHub](https://github.com/expo/examples/tree/master/stickersmash)에서 다운로드하세요.
-   [`npx create-expo-app`](/get-started/create-a-project)으로 새 프로젝트 시작하기
-   bare React Native 프로젝트 사용하기. `expo` package가 설치되어 있는지 확인하세요. 이는 [자동으로](/bare/installing-expo-modules) 또는 [수동으로](/bare/installing-expo-modules#manual-installation) 할 수 있습니다.

## 도구

macOS와 Windows에서 클릭 한 번으로 build를 관리하고 실행할 수 있는 [Expo Orbit](https://expo.dev/orbit).

로컬 머신에 build를 설치해 동시에 실행하고 싶다면 Android Emulator 또는 iOS Simulator를 사용할 수 있습니다. 설정 방법은 다음을 참고하세요:

-   [Android Emulator](/workflow/android-studio-emulator)
-   [iOS Simulator](/workflow/ios-simulator) (macOS에서만 사용 가능)

## 다음 단계

Expo 프로젝트를 로컬에 설정했다면 이제 이 여정을 시작할 준비가 되었습니다. 다음 장에서는 EAS Build로 첫 build를 만드는 방법을 알아보겠습니다.

[시작하기](/tutorial/eas/configure-development-build) — development build를 설정하는 것부터 시작해 봅시다.
