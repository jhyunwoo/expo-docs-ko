---
modificationDate: December 17, 2025
title: 수명주기 리스너 구성하기
description: Expo Modules API가 앱의 수명주기에 훅을 걸 수 있게 해주는 메커니즘을 알아보세요.
---

# 수명주기 리스너 구성하기

Expo Modules API가 앱의 수명주기에 훅을 걸 수 있게 해주는 메커니즘을 알아보세요.

일부 Expo 라이브러리는 `Activity`/`Application` 또는 `AppDelegate` 수명주기 콜백을 구현하여 딥 링크, 푸시 알림, 구성 변경 같은 시스템 이벤트를 처리해야 합니다.

Expo Modules API는 이런 콜백을 쉽게 관리할 수 있는 방법을 제공합니다:

-   Android의 `ApplicationLifecycleDispatcher`와 `ReactActivityHandler`는 `Application` 및 `Activity` 수명주기 이벤트를 등록된 리스너에게 전달합니다. 모듈은 콜백을 등록하기 위해 `Package` 클래스를 통해 `ReactActivityLifecycleListener`와 `ApplicationLifecycleListener` 구현을 제공할 수 있습니다.
-   iOS의 `ExpoAppDelegate`는 `AppDelegate` 호출을 등록된 subscriber에게 전달합니다. 모듈은 콜백을 등록하기 위해 `ExpoAppDelegateSubscriber` 구현을 제공할 수 있습니다.

이 메커니즘을 사용하면 모듈이 네이티브 진입점을 반복해서 수정하지 않고도 동작을 등록할 수 있습니다.

## 네이티브 프로젝트 구성하기

### Android

Android에서 `Application` 수명주기 리스너를 통합하려면, `Application` 클래스의 `onCreate()` 및 `onConfigurationChanged()` 호출을 `ApplicationLifecycleDispatcher`로 전달하세요:

### iOS

iOS에서 `AppDelegate` subscriber를 통합하려면, 기존 `AppDelegate` 구현에서 관련 호출을 `ExpoAppDelegateSubscriberManager`로 전달하여 subscriber가 이에 응답할 수 있도록 하세요:

대안으로, `AppDelegate`가 아직 다른 클래스를 상속하지 않는다면 `ExpoAppDelegate`를 상속해 설정을 단순화할 수 있습니다. 그러면 전달 처리를 자동으로 수행합니다:

> **참고:** 중요한 부작용을 일으킬 수 있는 모든 `UIApplicationDelegate` 메서드가 지원되는 것은 아닙니다. 특정 delegate에 의존해야 한다면 전달되는 전체 메서드 목록은 Expo 소스(**ExpoAppDelegate.swift**)를 참고하세요.

## 통합 테스트하기

콜백이 올바르게 동작하는지 테스트하려면, 이에 의존하는 모듈을 설치하세요. 딥 링크를 처리하기 위해 수명주기 리스너를 사용하는 `expo-linking`을 설치합니다:

```sh
npx expo install expo-linking
```

코드에 딥 링크 리스너를 추가하고 딥 링크를 열 때 콘솔을 확인하세요:

```jsx
import * as Linking from 'expo-linking';
import { useEffect } from 'react';

useEffect(() => {
  const listener = Linking.addEventListener('url', ({ url }) => {
    console.log('Received deep link:', url);
  });

  return listener.remove;
}, []);
```

다음 명령을 실행해 앱으로 딥 링크를 여세요:

```sh
npx uri-scheme open com.example.app://somepath/details --android
npx uri-scheme open myapp://somepath/details --ios
```
