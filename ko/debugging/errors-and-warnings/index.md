---
modificationDate: June 16, 2024
title: Errors and warnings
description: Expo 프로젝트에서 Redbox 오류와 stack trace에 대해 알아보세요.
---

# Errors and warnings

Expo 프로젝트에서 Redbox 오류와 stack trace에 대해 알아보세요.

Expo를 사용해 애플리케이션을 개발할 때는 **Redbox** 오류나 **Yellowbox** 경고를 마주치게 됩니다. 이러한 로깅 경험은 [LogBox in React Native](https://reactnative.dev/blog/2020/07/06/version-0.63)에서 제공합니다.

## Redbox error와 Yellowbox warning

Redbox error는 치명적인 오류 때문에 앱이 실행될 수 없을 때 표시됩니다. Yellowbox warning은 가능한 문제가 있음을 알리고, 앱을 배포하기 전에 아마 해결해야 한다는 점을 알려주기 위해 표시됩니다.

`console.warn("Warning message")`와 `console.error("Error message")`를 사용해 직접 warning과 error를 만들 수도 있습니다. redbox를 트리거하는 또 다른 방법은 오류를 throw하고 잡지 않는 것입니다: `throw Error("Error message")`.

> 이것은 Expo CLI로 React Native 앱을 디버깅하는 방법에 대한 간단한 소개입니다. 더 자세한 정보는 [Debugging](/debugging/runtime-issues)을 참고하세요.

## Stack traces

개발 중에 오류를 만나면 오류 메시지와 함께 **stack trace**를 보게 됩니다. stack trace는 애플리케이션이 충돌하기 전에 최근에 수행한 호출에 대한 보고서입니다. 이 stack trace는 터미널과 Expo Go 앱 모두에서, 또는 development build를 만든 경우 development build에서도 표시됩니다.

이 stack trace는 오류가 발생한 위치를 알려 주기 때문에 **매우 중요한 정보**입니다. 예를 들어 아래 이미지에서는 오류가 **HomeScreen.js** 파일에서 발생했고, 그 파일의 7번째 줄이 원인이라는 것을 보여 줍니다.

그 파일의 7번째 줄을 보면 `renderDescription`이라는 변수가 참조되고 있습니다. 오류 메시지는 그 변수가 **HomeScreen.js**에 선언되어 있지 않기 때문에 찾을 수 없다고 설명합니다. 이는 오류 메시지와 stack trace를 시간을 들여 해독하면 얼마나 도움이 되는지를 보여 주는 전형적인 예입니다.

오류를 디버깅하는 일은 개발에서 가장 답답하면서도 가장 보람 있는 부분 중 하나입니다. 하지만 절대 혼자가 아니라는 점을 기억하세요. 막혔을 때는 **Expo community**, React community, React Native community가 모두 훌륭한 도움 자원입니다. 누군가가 이미 정확히 같은 오류를 겪었을 가능성이 높습니다. 문서를 읽고, [forums](https://chat.expo.dev/), [GitHub issues](https://github.com/expo/expo/issues/), [Stack Overflow](https://stackoverflow.com/)를 꼭 검색해 보세요.
