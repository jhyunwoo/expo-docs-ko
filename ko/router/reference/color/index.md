---
modificationDate: February 10, 2026
title: Color
description: Expo Router에서 type safety와 함께 플랫폼 전용 색상에 접근하세요.
---

# Color

Expo Router에서 type safety와 함께 플랫폼 전용 색상에 접근하세요.

`Color` API는 Android와 iOS의 플랫폼 전용 색상에 type-safe하게 접근할 수 있도록 해줍니다. React Native의 `PlatformColor`를 전체 TypeScript 지원과 함께 감싸므로, 시스템 색상에 대해 autocomplete와 compile-time type checking을 사용할 수 있습니다.

## Usage

```tsx
import { Color } from 'expo-router';
```

`Color` object에는 플랫폼별 namespace 두 개가 있습니다:

-   `Color.android.*` - 기본 색상, attribute, Material Design 3 색상을 포함한 Android 색상
-   `Color.ios.*` - UIKit의 iOS 시스템 색상

## Android colors

Android는 `Color.android` namespace를 통해 네 가지 범주의 색상을 제공합니다.

### Base colors

`Color.android.*`를 사용해 Android 시스템 색상에 접근합니다. 이들은 `@android:color/` 리소스에 매핑됩니다.

```tsx
import { Color } from 'expo-router';

// Basic colors
Color.android.black;
Color.android.white;
Color.android.transparent;

// Background colors
Color.android.background_dark;
Color.android.background_light;
```

사용 가능한 전체 색상 목록은 [Android R.color documentation](https://developer.android.com/reference/android/R.color)을 참고하세요.

### Attribute colors

`Color.android.attr.*`를 사용해 Android theme attribute에 접근합니다. 이들은 `?attr/` 문법을 사용해 현재 theme의 색상을 resolve합니다.

```tsx
import { Color } from 'expo-router';

// Theme colors
Color.android.attr.colorPrimary;
Color.android.attr.colorSecondary;
Color.android.attr.colorAccent;
Color.android.attr.colorBackground;
```

자세한 내용은 [Android R.attr documentation](https://developer.android.com/reference/android/R.attr)을 참고하세요.

### Material Design 3 static colors

`Color.android.material.*`를 사용해 Material Design 3 static color에 접근합니다. 이들은 표준 Material 3 Light/Dark theme 색상을 사용합니다.

```tsx
import { Color } from 'expo-router';

// Primary colors
Color.android.material.primary;
Color.android.material.onPrimary;
Color.android.material.primaryContainer;
Color.android.material.onPrimaryContainer;

// Surface colors
Color.android.material.surface;
Color.android.material.onSurface;
```

각 색상 role에 대한 자세한 내용은 [Material Design 3 color roles documentation](https://m3.material.io/styles/color/roles)을 참고하세요.

### Material Design 3 dynamic colors

`Color.android.dynamic.*`를 사용해 Material Design 3 dynamic color에 접근합니다. Dynamic color는 Android 12+(API 31+)에서 사용할 수 있는 Android의 [Dynamic Color feature](https://m3.material.io/styles/color/dynamic/user-generated-source)를 사용해 사용자의 wallpaper에 맞춰 변경됩니다.

```tsx
import { Color } from 'expo-router';

// Dynamic colors adapt to user's wallpaper
Color.android.dynamic.primary;
Color.android.dynamic.onPrimary;
Color.android.dynamic.surface;
Color.android.dynamic.onSurface;
```

사용 가능한 색상은 [Material 3 static colors](/router/reference/color#material-design-3-static-colors)와 동일합니다.

### Responding to theme changes on Android

Android Material 색상(static과 dynamic 모두)은 시스템의 light/dark mode에 반응합니다. theme가 바뀔 때 component가 다시 렌더링되도록 하려면 React Native의 `useColorScheme()` hook을 사용하세요.

```tsx
import { Color } from 'expo-router';
import { View, Text, useColorScheme } from 'react-native';

function MyComponent() {
  // Triggers re-render when system theme changes
  useColorScheme();

  return (
    <View style={{ backgroundColor: Color.android.dynamic.surface }}>
      <Text style={{ color: Color.android.dynamic.onSurface }}>Hello, World!</Text>
    </View>
  );
}
```

`useColorScheme()`를 사용하지 않으면 사용자가 light mode와 dark mode 사이를 전환할 때 색상이 업데이트되지 않을 수 있습니다.

> 이것은 특히 React Compiler를 사용할 때 중요합니다. `useColorScheme()`가 호출되지 않으면 component가 memoize되어 re-render를 건너뛸 수 있기 때문입니다.

## iOS colors

`Color.ios.*`를 사용해 iOS 시스템 색상에 접근합니다. 이들은 UIKit의 [standard colors](https://developer.apple.com/documentation/uikit/standard-colors)와 [UI element colors](https://developer.apple.com/documentation/uikit/ui-element-colors)에 직접 매핑됩니다.

```tsx
import { Color } from 'expo-router';
import { View, Text } from 'react-native';

function MyComponent() {
  return (
    <View style={{ backgroundColor: Color.ios.systemBackground }}>
      <Text style={{ color: Color.ios.label }}>Hello, World!</Text>
    </View>
  );
}
```

iOS 색상은 시스템 appearance(light/dark mode)와 accessibility 설정에 자동으로 맞춰집니다.

## Cross-platform usage

`Color` API는 플랫폼 전용입니다. 각 플랫폼에 맞는 색상을 선택하려면 `useMemo`를 사용하세요:

```tsx
import { Platform, View, Text } from 'react-native';
import { Color } from 'expo-router';

function MyComponent() {
  const backgroundColor = Platform.select({
    ios: Color.ios.systemBackground,
    android: Color.android.dynamic.surface,
    default: '#000000',
  });

  const textColor = Platform.select({
    ios: Color.ios.label,
    android: Color.android.dynamic.onSurface,
    default: '#FFFFFF',
  });

  return (
    <View style={{ backgroundColor }}>
      <Text style={{ color: textColor }}>Hello, World!</Text>
    </View>
  );
}
```

## API reference

[Color API reference](/versions/latest/sdk/router#color) — 사용 가능한 전체 타입과 색상 목록은 Expo Router의 Color API reference를 참고하세요.
