---
modificationDate: March 10, 2026
title: 프로젝트 만들기
description: 새로운 Expo 프로젝트를 만드는 방법을 알아보세요.
---

# 프로젝트 만들기

새로운 Expo 프로젝트를 만드는 방법을 알아보세요.

Expo는 Android와 iOS 앱 개발을 더 쉽게 만들어 주는 React Native 프레임워크입니다. 이 프레임워크는 file-based routing, 표준 native module 라이브러리 등 훨씬 더 많은 기능을 제공합니다. Expo는 [GitHub](https://github.com/expo/expo)와 [Discord](https://chat.expo.dev)에 활발한 커뮤니티가 있는 오픈 소스입니다.

또한 저희는 개발 과정의 각 단계에서 Expo 프레임워크를 보완하는 서비스 모음인 [Expo Application Services (EAS)](https://expo.dev/eas)도 제공합니다.

## System requirements

-   [Node.js (LTS)](https://nodejs.org/en/).
-   macOS, Windows(Powershell 및 [WSL 2](https://expo.fyi/wsl)), Linux를 지원합니다.

`create-expo-app`이 만드는 기본 프로젝트로 시작하는 것을 권장합니다. 기본 프로젝트에는 시작에 도움이 되는 example code가 포함되어 있습니다.

새 프로젝트를 만들려면 다음 명령을 실행하세요:

```sh
npx create-expo-app@latest --template default@sdk-55
```

> **Note:** SDK 55 전환 기간 동안 `--template` 플래그 없이 `create-expo-app@latest`를 사용하면 SDK 54 프로젝트가 만들어집니다. 실제 기기에서 Expo Go를 사용할 계획이라면 SDK 54 프로젝트를 사용하세요. 그렇지 않다면 `--template default@sdk-55`를 사용해 SDK 55 프로젝트를 만드세요. [`--template` option](/more/create-expo#--template)을 추가해 다른 template를 선택할 수도 있습니다.

## Next step

이제 프로젝트가 생겼습니다. 이제 개발을 시작할 수 있도록 개발 환경을 설정할 차례입니다.
