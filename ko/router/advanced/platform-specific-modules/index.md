---
modificationDate: February 26, 2026
title: 플랫폼별 확장자와 모듈
description: Expo Router에서 플랫폼별 확장자와 React Native의 Platform 모듈을 사용해 플랫폼에 따라 모듈을 전환하는 방법을 알아보세요.
---

# 플랫폼별 확장자와 모듈

Expo Router에서 플랫폼별 확장자와 React Native의 Platform 모듈을 사용해 플랫폼에 따라 모듈을 전환하는 방법을 알아보세요.

앱을 만들다 보면 현재 플랫폼에 따라 다른 콘텐츠를 보여주고 싶을 수 있습니다. 플랫폼별 확장자와 `Platform` 모듈을 사용하면 각 플랫폼에 더 자연스러운 경험을 만들 수 있습니다. 아래 섹션에서는 Expo Router에서 이를 구현하는 방법을 설명합니다.

## 플랫폼별 확장자

> 플랫폼별 확장자는 Expo Router `3.5.x`에 추가되었습니다. 더 오래된 버전의 라이브러리를 사용 중이라면 [Platform-specific modules](/router/advanced/platform-specific-modules#platform-module)의 안내를 따르세요.

플랫폼별 확장자를 사용하는 방법은 두 가지입니다:

### src/app 디렉터리 내부

Metro bundler의 플랫폼별 확장자(예: **.android.tsx**, **.ios.tsx**, **.native.tsx**, 또는 **.web.tsx**)는 **비플랫폼 버전**도 함께 존재할 때만 **src/app** 디렉터리 안에서 지원됩니다. 이렇게 해야 deep linking을 위해 routes가 플랫폼 전반에 걸쳐 보편적으로 유지됩니다.

다음 프로젝트 구조를 생각해 봅시다:

`src`

 `app`

  `_layout.tsx`

  `_layout.web.tsx`

  `index.tsx`

  `about.tsx`

  `about.web.tsx`

위 파일 구조에서는:

-   **_layout.web.tsx** 파일은 web에서 layout으로 사용되고, **_layout.tsx**는 다른 모든 플랫폼에서 사용됩니다.
-   **index.tsx** 파일은 모든 플랫폼의 홈 페이지로 사용됩니다.
-   **about.web.tsx** 파일은 web용 about 페이지로 사용되고, **about.tsx** 파일은 다른 모든 플랫폼에서 사용됩니다.

### src/app 디렉터리 외부

**src/app** 디렉터리 밖에서 플랫폼별 확장자(예: **.android.tsx**, **.ios.tsx**, **.native.tsx**, 또는 **.web.tsx**)를 가진 파일을 만들고, 이를 **src/app** 디렉터리 안에서 사용할 수 있습니다.

다음 프로젝트 구조를 생각해 봅시다:

`src`

 `app`

  `_layout.tsx`

  `index.tsx`

  `about.tsx`

 `components`

  `about.tsx`

  `about.ios.tsx`

  `about.web.tsx`

위 파일 구조에서는 디자인 요구 사항상 플랫폼마다 다른 `about` 화면을 만들어야 합니다. 이런 경우 **src/components** 디렉터리 안에 플랫폼 확장자를 사용해 각 플랫폼용 컴포넌트를 만들 수 있습니다. import되면 Metro가 현재 플랫폼에 맞는 올바른 컴포넌트 버전을 사용하도록 보장합니다. 그런 다음 이 컴포넌트를 **src/app** 디렉터리 안에서 screen으로 다시 export할 수 있습니다.

```tsx
export { default } from '@/components/about';
```

## Platform 모듈

React Native의 [`Platform`](https://reactnative.dev/docs/platform-specific-code#platform-module) 모듈을 사용해 현재 플랫폼을 감지하고, 그 결과에 따라 적절한 콘텐츠를 렌더링할 수 있습니다. 예를 들어 네이티브에서는 `Tabs` layout을, web에서는 커스텀 layout을 렌더링할 수 있습니다.

```tsx
import { Platform } from 'react-native';
import { Link, Slot, Tabs } from 'expo-router';

export default function Layout() {
  if (Platform.OS === 'web') {
    // Use a basic custom layout on web.
    return (
      <div style={{ flex: 1 }}>
        <header>
          <Link href="/">Home</Link>
          <Link href="/settings">Settings</Link>
        </header>
        <Slot />
      </div>
    );
  }
  // Use a native bottom tabs layout on native platforms.
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
```
