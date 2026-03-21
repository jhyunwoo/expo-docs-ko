---
modificationDate: September 02, 2025
title: 기존 React Native 프로젝트에 expo-dev-client 설치하기
description: 기존 React Native 프로젝트에 expo-dev-client를 설치하고 설정하는 방법을 알아보세요.
---

# 기존 React Native 프로젝트에 expo-dev-client 설치하기

기존 React Native 프로젝트에 expo-dev-client를 설치하고 설정하는 방법을 알아보세요.

다음 가이드는 기존 React Native 프로젝트에 `expo-dev-client`를 설치하고 설정하는 방법을 설명합니다.

새 프로젝트를 만들어야 하나요?

새 프로젝트로 시작한다면 `with-dev-client` 템플릿을 사용해 생성하세요:

```sh
npx create-expo-app -e with-dev-client
```

프로젝트에서 Continuous Native Generation(CNG)을 사용하나요?

[CNG](/workflow/continuous-native-generation)를 사용하는 프로젝트에서 `expo-dev-client`를 사용하려면 [개발 빌드 만들기](/develop/development-builds/create-a-build)를 참고하세요.

## 사전 준비 사항

**`expo` 패키지가 설치되고 설정되어 있어야 합니다.** 프로젝트를 `npx @react-native-community/cli@latest init`으로 만들었고 다른 Expo 라이브러리가 하나도 설치되어 있지 않다면, 계속 진행하기 전에 [Expo modules 설치하기](/bare/installing-expo-modules)를 먼저 해야 합니다.

## expo-dev-client 설치하기

**package.json**에 `expo-dev-client` 라이브러리를 추가하세요:

```sh
npx expo install expo-dev-client
```

프로젝트에 디스크상 **ios** 디렉터리가 있다면, 다음 명령을 실행해 `expo-dev-client`의 네이티브 코드를 완전히 설치하세요:

```sh
npx pod-install
```

프로젝트에 **ios** 디렉터리가 없다면 이 단계는 건너뛰어도 됩니다.

## 딥 링크 구성하기

Expo CLI는 딥 링크를 사용해 프로젝트를 실행합니다. 또한 프로젝트에 커스텀 딥 링크 scheme을 추가했다면 [preview update 실행에 `expo-dev-client` 사용하기](/eas-update/getting-started)에도 유용합니다.

아직 딥 링크를 지원하도록 앱에 `scheme`을 설정하지 않았다면 `uri-scheme` 라이브러리를 사용해 설정할 수 있습니다.

```sh
npx uri-scheme list
npx uri-scheme add your-scheme
```

자세한 내용은 [`uri-scheme` 라이브러리](https://www.npmjs.com/package/uri-scheme)를 참고하세요.

## 앱 빌드 및 설치

원하는 도구를 사용해 앱의 디버그 빌드를 만드세요. 예를 들어 [Expo CLI로 로컬에서](/guides/local-app-development) 빌드하거나 [EAS Build로 클라우드에서](/develop/development-builds/create-a-build) 빌드할 수 있습니다.
