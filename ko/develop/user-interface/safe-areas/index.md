---
modificationDate: February 26, 2026
title: Safe areas
description: Expo 프로젝트 안의 화면 component에 safe area를 추가하는 방법을 알아보세요.
---

# Safe areas

Expo 프로젝트 안의 화면 component에 safe area를 추가하는 방법을 알아보세요.

safe area를 적용하면 앱 화면의 콘텐츠가 올바르게 배치되도록 할 수 있습니다. 즉, 기기의 물리적 하드웨어 일부이거나 운영체제가 제어하는 notch, status bar, home indicator, 기타 인터페이스 요소와 겹치지 않게 됩니다. 콘텐츠가 겹치면 이러한 인터페이스 요소에 가려지게 됩니다.

아래는 Android에서 앱 화면 콘텐츠가 status bar에 가려지는 예시입니다. iOS에서는 같은 콘텐츠가 둥근 모서리, notch, status bar에 가려집니다.

## `react-native-safe-area-context` 라이브러리 사용하기

[`react-native-safe-area-context`](https://github.com/AppAndFlow/react-native-safe-area-context)는 Android와 iOS 기기의 safe area inset을 처리하기 위한 유연한 API를 제공합니다. 또한 screen component에서 safe area를 자동으로 반영할 수 있도록 [`<View>`](https://reactnative.dev/docs/view) 대신 사용할 수 있는 `SafeAreaView` component도 제공합니다.

이 라이브러리를 사용하면 위 예제의 결과가 바뀌어, 아래와 같이 콘텐츠가 safe area 안에 표시됩니다:

### 설치

[기본 template](/get-started/create-a-project)로 프로젝트를 만들었다면 `react-native-safe-area-context` 설치는 건너뛰어도 됩니다. 이 라이브러리는 Expo Router 라이브러리의 peer dependency로 설치됩니다. 그렇지 않다면 다음 명령으로 설치하세요:

```sh
npx expo install react-native-safe-area-context
```

### 사용 방법

screen component의 콘텐츠를 감싸기 위해 [`SafeAreaView`](https://appandflow.github.io/react-native-safe-area-context/api/safe-area-view)를 직접 사용할 수 있습니다. 이는 safe area inset이 추가 padding 또는 margin으로 적용된 일반 `<View>`입니다.

```tsx
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>Content is in safe area.</Text>
    </SafeAreaView>
  );
}
```

다른 Expo template를 사용하고 있고 Expo Router가 설치되어 있지 않나요?

screen component에서 `SafeAreaView`를 사용하기 전에 루트 component 파일(예: **App.tsx**)에 [`SafeAreaProvider`](https://appandflow.github.io/react-native-safe-area-context/api/safe-area-provider)를 import하고 추가하세요.

```tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    return <SafeAreaProvider>...</SafeAreaProvider>;
  );
}
```

## 대안: `useSafeAreaInsets` hook

`SafeAreaView`의 대안으로, screen component에서 [`useSafeAreaInsets`](https://appandflow.github.io/react-native-safe-area-context/api/use-safe-area-insets) hook을 사용할 수 있습니다. 이 hook은 safe area inset에 직접 접근할 수 있게 해 주며, hook에서 받은 inset을 사용해 `<View>`의 각 edge에 padding을 적용할 수 있습니다.

아래 예제는 `useSafeAreaInsets` hook을 사용합니다. `insets.top`을 사용해 `<View>`에 top padding을 적용합니다.

```tsx
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <Text>Content is in safe area.</Text>
    </View>
  );
}
```

이 hook은 inset을 아래와 같은 객체로 제공합니다:

```ts
{
  top: number,
  right: number,
  bottom: number,
  left: number
}
```

## 추가 정보

### 최소 예제

아래는 `useSafeAreaInsets` hook을 사용해 view에 top padding을 적용하는 최소 동작 예제입니다.

```tsx
import { Text, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

function HomeScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <Text style={{ fontSize: 28 }}>Content is in safe area.</Text>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <HomeScreen />
    </SafeAreaProvider>
  );
}
```

### React Navigation과 함께 사용하기

기본적으로 React Navigation은 safe area를 지원하며 `react-native-safe-area-context`를 peer dependency로 사용합니다. 자세한 내용은 [React Navigation documentation](https://reactnavigation.org/docs/handling-safe-area/)를 참고하세요.

### web과 함께 사용하기

web을 대상으로 한다면 [usage section](/develop/user-interface/safe-areas#usage)에서 설명한 대로 `SafeAreaProvider`를 설정하세요. server-side rendering(SSR)을 사용하고 있다면 라이브러리 문서의 [Web SSR section](https://appandflow.github.io/react-native-safe-area-context/optimizations#web-ssr)을 참고하세요.
