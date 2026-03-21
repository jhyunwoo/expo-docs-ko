---
modificationDate: February 26, 2026
title: Expo 및 React Native 앱에서의 navigation
description: Expo 및 React Native 프로젝트에서 navigation을 통합하는 권장 접근 방식을 알아보세요.
---

# Expo 및 React Native 앱에서의 navigation

Expo 및 React Native 프로젝트에서 navigation을 통합하는 권장 접근 방식을 알아보세요.

React Native core library에는 built-in navigation solution이 포함되어 있지 않기 때문에, 필요에 가장 잘 맞는 navigation library를 선택할 수 있습니다. Expo와 React Native 앱에서는 일반적으로 [React Navigation](https://reactnavigation.org/) 또는 [Expo Router](/router/introduction) 중에서 선택하게 됩니다.

## React Native 앱에 navigation library가 필요한 이유

React Native core에는 기본 UI component, touch handling, device API, networking이 포함되어 있지만, storage, camera, maps, 대부분의 device sensor, 그리고 **navigation** 등은 포함되어 있지 않습니다. 이런 기능은 community library가 담당하도록 설계되었습니다.

## React Navigation

React Navigation은 React Native 생태계 전반에서 널리 사용되는 component 기반 navigation library입니다. 이 library를 사용하면 stack, tab, drawer navigator를 모두 코드로 조합할 수 있어 복잡한 흐름, custom transition, 앱별 UX 패턴을 구현할 수 있습니다.

이 library는 부드러운 animation과 gesture, 통합된 mobile 및 web routing, automatic deep link, static configuration을 통한 type route, 그리고 높은 사용자 지정 가능성을 포함한 플랫폼별 look-and-feel을 제공합니다.

[React Navigation: Getting started](https://reactnavigation.org/docs/getting-started) - React Navigation을 시작하는 방법을 알아보세요.

## Expo Router(Expo 프로젝트에 권장)

Expo Router는 Expo 및 React Native 프로젝트를 위한 file-based routing library이며 React Navigation 위에 구축되어 있습니다. **app** 디렉터리 규칙을 따르면 파일을 route로 바꿔 주며, 추가 설정 없이 [Expo CLI](/more/expo-cli)와 bundling에 통합됩니다. 또한 typed route, dynamic route, development에서의 lazy bundling, web용 static rendering, automatic deep linking 같은 기능도 제공합니다.

`npx create-expo-app@latest --template default@sdk-55`로 생성된 새 Expo 프로젝트에는 Expo Router가 기본 포함되어 있으므로, 필요할 때 React Navigation API도 활용하면서 cross-platform navigation을 빠르게 배포할 수 있습니다.

[Introduction to Expo Router](/router/introduction) - Expo Router는 Expo로 구축된 Universal React Native 애플리케이션을 위한 오픈소스 routing library입니다.

[Installation](/router/installation) - Expo Router로 새 프로젝트를 만들거나 기존 프로젝트에 library를 추가해 빠르게 시작하는 방법을 알아보세요.

[Core concepts](/router/basics/core-concepts) - Expo의 file-based routing 핵심 개념을 알아보세요.
