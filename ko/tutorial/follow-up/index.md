---
modificationDate: February 26, 2026
title: 학습 리소스
description: Expo와 React Native를 학습하는 데 도움이 되는 엄선된 리소스 목록을 살펴봅니다.
---

# 학습 리소스

Expo와 React Native를 학습하는 데 도움이 되는 엄선된 리소스 목록을 살펴봅니다.

이제 예제 앱이 완성되었으니, 이를 만드는 데 사용한 기술을 더 배워 봅시다.

## 프로젝트를 앱으로 만들기

새 앱을 로컬 환경에서 만들기 시작하려면 `npx create-expo-app@latest --template default@sdk-55`를 사용하고, 이어서 [개발 환경 설정](/get-started/set-up-your-environment)을 진행하면 됩니다.

> **참고:** SDK 55 전환 기간 동안 `--template` flag 없이 `create-expo-app@latest`를 실행하면 SDK 54 프로젝트가 생성됩니다. 실제 device에서 Expo Go를 사용할 계획이라면 SDK 54 프로젝트를 사용하세요. 그렇지 않다면 `--template default@sdk-55`를 사용해 SDK 55 프로젝트를 만드세요.

### 추천 리소스

새 프로젝트를 만든 뒤에는, 앱 개발 여정에 도움이 되는 여러 도구와 개념을 아래 리소스에서 더 배울 수 있습니다:

-   [Development tools](/develop/tools): 앱을 만드는 여정의 여러 단계에서 도움이 되는 Expo 도구 레퍼런스입니다.
-   [Development builds](/develop/development-builds/introduction): development build를 사용하면 앱의 build 과정을 완전히 제어하고 device 또는 simulator에서 앱을 테스트할 수 있습니다.
-   [Development overview](/workflow/overview): Expo로 앱을 개발할 때의 핵심 개념과 핵심 개발 루프의 흐름을 설명하는 높은 수준의 개요입니다.
-   [Expo Router](/router/introduction): 이 튜토리얼에서는 Expo Router의 기본 사항을 살펴보고 tab navigator를 구현했습니다. 더 알아보려면 라이브러리 문서를 확인하세요.
-   [App icon](/develop/user-interface/splash-screen-and-app-icon#app-icon) 및 [splash screen](/develop/user-interface/splash-screen-and-app-icon#splash-screen): 앱 아이콘과 splash screen을 사용자 지정하는 방법을 더 배울 수 있습니다. 또한 **app.json** 파일에서 설정할 수 있는 속성은 [app config reference](/workflow/configuration)에서도 살펴보세요.
-   [App distribution](/deploy/build-project) 및 앱 스토어 [submission](/deploy/submit-to-app-stores): 앱을 출시할 준비가 되었을 때 앱 스토어에 릴리스하고 제출하는 방법을 더 배우려면 이 리소스를 읽어 보세요.
-   [Debugging](/debugging/runtime-issues): 때로는 문제가 생기고, 그럴 때는 debugging 도구를 사용해 오류를 찾고 수정할 수 있습니다.

## 학습

### React

우리는 React 컴포넌트와 API를 사용했습니다. Expo로 앱을 만들려면 React를 탄탄하게 이해하는 것이 중요합니다. React 문서의 [Quick Start section](https://react.dev/learn)과 [Hooks section](https://react.dev/reference/react/hooks)을 읽어 보길 권장합니다.

### React Native

튜토리얼 앱을 개발하는 동안 React Native를 광범위하게 사용했습니다. 더 배우고 싶다면 [React Native basics guide](https://reactnative.dev/docs/getting-started)부터 시작할 수 있습니다. 아래 문서도 함께 확인해 보세요:

-   [View API reference](https://reactnative.dev/docs/view)
-   [Text API reference](https://reactnative.dev/docs/text)
-   [Platform specific code](https://reactnative.dev/docs/platform-specific-code)
-   [Presenting data in a list](https://reactnative.dev/docs/using-a-listview)

우리는 Flexbox를 사용해 컴포넌트 레이아웃을 구성했습니다. 더 알아보려면 아래 자료를 참고하세요:

-   [Height and Width](https://reactnative.dev/docs/height-and-width)
-   [Layout with Flexbox](https://reactnative.dev/docs/flexbox)

### Gesture와 animation

여러 종류의 gesture와 animation을 구현하는 방법을 더 배우려면 아래 문서를 추천합니다:

-   [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/docs/)
-   [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started)

## 커뮤니티 참여하기

다른 Expo 사용자와 대화하거나 질문하려면 [Discord](https://chat.expo.dev/) 커뮤니티에 참여하세요.
