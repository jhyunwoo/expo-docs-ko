---
modificationDate: February 26, 2026
title: System bars
description: Expo 프로젝트에서 safe area와 edge-to-edge layout을 위해 system bar를 처리하고 사용자 지정하는 방법을 알아보세요.
---

# System bars

Expo 프로젝트에서 safe area와 edge-to-edge layout을 위해 system bar를 처리하고 사용자 지정하는 방법을 알아보세요.

system bar는 화면 가장자리에 위치하며 필수 기기 정보와 내비게이션 제어를 제공하는 UI 요소입니다. 모바일 OS에 따라 status bar([Android](https://developer.android.com/design/ui/mobile/guides/foundations/system-bars)와 [iOS](https://developer.apple.com/design/human-interface-guidelines/status-bars)), caption bar([Android](https://medium.com/androiddevelopers/insets-handling-tips-for-android-15s-edge-to-edge-enforcement-872774e8839b#:~:text=or%20SHORT_EDGES.-,Caption%20bars,-When%20your%20app) 전용), navigation bar([Android](https://developer.android.com/design/ui/mobile/guides/foundations/system-bars#navigation-bar)와 [iOS](https://developer.apple.com/design/human-interface-guidelines/navigation-bars)), home indicator(iOS 전용)를 포함합니다.

이 component들은 배터리 잔량, 시간, 알림 경고 같은 기기 정보를 표시하고, 기기 인터페이스 어디에서나 기기와 직접 상호작용할 수 있게 해 줍니다. 예를 들어 앱 사용자는 현재 어떤 앱을 사용 중이든 status bar를 아래로 당겨 빠른 설정과 알림에 접근할 수 있습니다.

system bar는 모바일 경험의 기본 요소이므로, 이를 올바르게 다루는 방법을 이해하는 것은 앱을 만드는 데 중요합니다.

## safe area를 사용해 겹침 처리하기

앱의 일부 콘텐츠는 system bar 뒤까지 그려질 수 있습니다. 이를 처리하려면 콘텐츠가 system bar와 겹치지 않도록 올바르게 배치하고, system bar의 제어 요소가 존재하도록 해야 합니다.

다음 가이드는 `SafeAreaView` 또는 hook을 사용해 화면 각 edge에 직접 inset을 적용하는 방법을 안내합니다.

[Safe areas](/develop/user-interface/safe-areas) — Expo 프로젝트 안의 화면 component에 safe area를 추가하는 방법을 알아보세요.

### Android의 safe area와 edge-to-edge layout

[Android의 edge-to-edge](https://expo.dev/blog/edge-to-edge-display-now-streamlined-for-android)가 도입되기 전에는 반투명 status bar와 navigation bar를 사용하는 것이 일반적이었습니다. 이 접근 방식에서는 해당 bar 뒤에 그려진 콘텐츠가 이미 그 아래에 위치해 있었고, 보통 safe area를 고려할 필요가 없었습니다.

이제 [Android의 edge-to-edge](https://expo.dev/blog/edge-to-edge-display-now-streamlined-for-android)를 사용하면 콘텐츠가 system bar와 겹치지 않도록 safe area를 사용해야 합니다.

## system bar 사용자 지정하기

system bar는 앱 디자인에 맞추고 다양한 상황에서 더 나은 가시성을 제공하도록 사용자 지정할 수 있습니다. Expo에서는 이를 위해 `expo-status-bar`와 `expo-navigation-bar`(Android 전용) 두 라이브러리를 사용할 수 있습니다.

### Status bar 구성

status bar는 Android와 iOS 모두에서 화면 상단에 나타납니다. [`expo-status-bar`](/versions/latest/sdk/status-bar)를 사용해 사용자 지정할 수 있습니다. 앱이 실행 중일 때 [`style`](/versions/latest/sdk/status-bar#style) 속성이나 [`setStatusBarStyle`](/versions/latest/sdk/status-bar#statusbarsetstatusbarstylestyle-animated) 메서드를 사용해 status bar 모양을 제어할 수 있도록 `StatusBar` component를 제공합니다:

```tsx
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  <>
    {/* Use light text instead of dark text in the status bar to provide more contrast with a dark background. */}
    <StatusBar style="light" />
  </>;
}
```

> **참고:** Expo 기본 template에서는 `style` 속성이 `auto`로 설정되어 있습니다. 앱이 현재 사용하는 color scheme(light mode 또는 dark mode)에 따라 적절한 스타일을 자동으로 선택합니다.

`StatusBar`의 표시 여부를 제어하려면 [`hidden`](/versions/latest/sdk/status-bar#hidden) 속성을 `true`로 설정하거나 [`setStatusBarHidden`](/versions/latest/sdk/status-bar#statusbarsetstatusbarhiddenhidden-animation) 메서드를 사용할 수 있습니다.

**Android에서 edge-to-edge가 활성화된 경우, 불투명한 status bar에 의존하는 `expo-status-bar` 기능은 [사용할 수 없습니다](https://developer.android.com/about/versions/15/behavior-changes-15#edge-to-edge)**. 스타일과 표시 여부만 사용자 지정할 수 있습니다. 다른 속성은 no-op 처리되고 경고를 표시합니다.

### Navigation bar 구성 (Android 전용)

Android 기기에서는 navigation bar가 화면 하단에 나타납니다. [`expo-navigation-bar`](/versions/latest/sdk/navigation-bar) 라이브러리를 사용해 사용자 지정할 수 있습니다. [`setStyle`](/versions/latest/sdk/navigation-bar#navigationbarsetstylestyle) 메서드로 navigation bar 스타일을 설정할 수 있는 `NavigationBar` component를 제공합니다:

```tsx
import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';

useEffect(() => {
  if (Platform.OS === 'android') {
    // Set the navigation bar style
    NavigationBar.setStyle('dark');
  }
}, []);
```

`NavigationBar`의 표시 여부를 제어하려면 [`setVisibilityAsync`](/versions/latest/sdk/navigation-bar#navigationbarsetvisibilityasyncvisibility) 메서드를 사용할 수 있습니다.

**Android에서 edge-to-edge가 활성화된 경우, 불투명한 navigation bar에 의존하는 `expo-navigation-bar` 기능은 [사용할 수 없습니다](https://developer.android.com/about/versions/15/behavior-changes-15#edge-to-edge)**. 스타일과 표시 여부만 사용자 지정할 수 있습니다. 다른 속성은 no-op 처리되고 경고를 표시합니다.
