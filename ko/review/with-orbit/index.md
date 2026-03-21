---
modificationDate: May 21, 2025
title: Expo Orbit를 사용해 update 실행하기
description: 리뷰 워크플로의 일부로 Expo Orbit로 updates를 여는 방법을 알아보세요.
---

# Expo Orbit를 사용해 update 실행하기

리뷰 워크플로의 일부로 Expo Orbit로 updates를 여는 방법을 알아보세요.

[Expo Orbit](https://expo.dev/orbit)는 EAS에서 빌드를 설치하고 실행하는 속도를 높이도록 설계된 macOS 및 Windows 앱입니다. **Open in Orbit**를 누르는 것만큼 쉽게 빌드와 updates를 실행할 수 있게 해줍니다.

updates의 자동 설치와 실행은 어떻게 동작하나요?

update를 실행하면 Orbit는 해당 update의 runtime version과 target platform에 맞는 최신 development build를 찾습니다. 호환되는 build가 발견되면, update가 대상 디바이스에 자동으로 설치되고 해당 update를 가리키는 deep link로 실행됩니다.

사용 가능한 development build가 전혀 없는 경우, 예를 들어 모두 만료되었거나 아직 만들지 않았거나, EAS Build를 사용하지 않거나, 앱을 [로컬에서 빌드](/guides/local-app-development)하고 있다면, Orbit가 다음 진행 방법을 안내하는 프롬프트를 보여줍니다. 대상 디바이스에 호환되는 development build가 이미 설치되어 있다면 프롬프트에서 **Launch with deep link**를 클릭해 update를 여세요.

## Prerequisites

-   이 가이드의 단계를 따르기 전에 **Orbit app을 설치**하세요. [GitHub releases](https://github.com/expo/orbit/releases)에서 직접 다운로드하거나, 설치를 위한 [alternative method](/build/orbit#installation)를 참고할 수 있습니다.
-   앱을 설치한 뒤 **Settings**에서 Expo 계정으로 로그인하세요.

## Expo Orbit로 update 미리보기

EAS dashboard에서 iOS Simulator로 직접 update를 실행하는 Expo Orbit.

Expo Orbit로 preview하려면 먼저 update가 게시되어 있어야 합니다. 아직 update를 게시하지 않았다면 다음 섹션의 단계를 따르기 전에 [Publish an update](/eas-update/getting-started#publish-an-update)를 참고하세요.

### update 설치 및 실행

> **참고**: Expo Orbit를 사용한 update 실행은 실제 iOS 디바이스에서는 지원되지 않습니다. Android 디바이스/에뮬레이터 또는 iOS Simulators에서는 지원됩니다.

update가 게시된 뒤, Android Emulator 또는 iOS Simulator에서 이를 열려면 다음 단계를 따르세요:

-   프로젝트의 **Updates** 탭으로 이동합니다.
-   미리 보려는 update를 선택합니다.
-   **Preview**를 클릭합니다. 그러면 **Preview** 대화상자가 열립니다.
-   **Open with Orbit** 아래에서 update를 실행할 플랫폼을 선택합니다.
-   Orbit가 선택한 Android Emulator 또는 iOS Simulator에 update를 설치하고 실행합니다.

이제 Expo Orbit를 사용해 updates를 자연스럽게 실행하고 검토할 수 있습니다.
