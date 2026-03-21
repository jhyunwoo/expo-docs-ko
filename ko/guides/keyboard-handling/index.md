---
modificationDate: February 26, 2026
title: Keyboard handling
description: Android 또는 iOS 기기에서 흔한 keyboard 상호작용을 처리하기 위한 가이드입니다.
---

# Keyboard handling

Android 또는 iOS 기기에서 흔한 keyboard 상호작용을 처리하기 위한 가이드입니다.

keyboard handling은 Expo 앱에서 훌륭한 사용자 경험을 만드는 데 매우 중요합니다. React Native는 keyboard event를 처리할 때 흔히 사용하는 [`Keyboard`](https://reactnative.dev/docs/keyboard)와 [`KeyboardAvoidingView`](https://reactnative.dev/docs/keyboardavoidingview)를 제공합니다. 더 복잡하거나 custom keyboard 상호작용이 필요하다면, 고급 keyboard handling 기능을 제공하는 라이브러리인 [`react-native-keyboard-controller`](https://kirillzyusko.github.io/react-native-keyboard-controller)를 고려할 수 있습니다.

이 가이드는 흔한 keyboard 상호작용과 이를 효과적으로 관리하는 방법을 다룹니다.

[React Native 앱을 위한 Keyboard Handling 튜토리얼](https://www.youtube.com/watch?v=Y51mDfAhd4E) — 이 React Native 앱용 keyboard handling 튜토리얼에서는 앱에서 입력하려고 할 때 keyboard가 input을 가리는 문제를 해결하는 방법을 배웁니다.

## Keyboard handling 기초

다음 섹션에서는 흔히 사용하는 API로 keyboard 상호작용을 처리하는 방법을 설명합니다.

### Keyboard avoiding view

`KeyboardAvoidingView`는 keyboard 높이에 따라 view의 높이, 위치 또는 아래쪽 padding을 자동으로 조정해 keyboard가 표시되는 동안에도 화면에 보이도록 하는 컴포넌트입니다.

Android와 iOS는 `behavior` 속성을 서로 다르게 처리합니다. iOS에서는 보통 `padding`이 가장 잘 동작하고, Android에서는 `KeyboardAvoidingView`를 두는 것만으로도 input이 가려지는 것을 막을 수 있습니다. 그래서 아래 예시는 Android에 `undefined`를 사용합니다. 앱에 따라 다른 옵션이 더 잘 맞을 수 있으므로 `behavior`를 여러 방식으로 시도해 보는 것이 좋습니다.

```tsx
import { KeyboardAvoidingView, TextInput } from 'react-native';

export default function HomeScreen() {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <TextInput placeholder="Type here..." />
    </KeyboardAvoidingView>;
  );
}
```

위 예시에서 `KeyboardAvoidingView`의 높이는 기기의 keyboard 높이에 따라 자동으로 조정되며, 덕분에 input이 항상 보이게 됩니다.

Android에서 Bottom Tab navigator를 사용할 때 input field에 focus하면 bottom tab가 keyboard 위로 밀려 올라오는 것을 볼 수 있습니다. 이 문제를 해결하려면 [app config](/workflow/configuration)의 Android 구성에 `softwareKeyboardLayoutMode` 속성을 추가하고 값을 `pan`으로 설정하세요.

```json
"expo" {
  "android": {
    "softwareKeyboardLayoutMode": "pan"
  }
}
```

이 속성을 추가한 뒤에는 development server를 다시 시작하고 앱을 reload해서 변경 사항을 적용하세요.

[`tabBarHideOnKeyboard`](https://reactnavigation.org/docs/bottom-tab-navigator/#tabbarhideonkeyboard)를 사용해 keyboard가 열릴 때 bottom tab를 숨기는 것도 가능합니다. 이 옵션은 Bottom Tab Navigator의 옵션입니다. `true`로 설정하면 keyboard가 열릴 때 bar를 숨깁니다.

```tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarHideOnKeyboard: true,
      }}>
      <Tabs.Screen name="index" />
    </Tabs>
  );
}
```

### Keyboard event

React Native의 `Keyboard` module을 사용하면 네이티브 event를 구독하고, 이에 반응하고, keyboard를 dismiss하는 것과 같은 변경을 적용할 수 있습니다.

keyboard event를 구독하려면 `Keyboard.addListener` method를 사용하세요. 이 method는 event 이름과 callback 함수를 인수로 받습니다. keyboard가 나타나거나 사라질 때 event data와 함께 callback 함수가 호출됩니다.

다음 예시는 keyboard listener를 추가하는 사용 사례를 보여줍니다. state 변수 `isKeyboardVisible`은 keyboard가 나타나거나 사라질 때마다 토글됩니다. 이 변수를 바탕으로 버튼은 keyboard가 활성 상태일 때만 dismiss할 수 있게 합니다. 또한 버튼이 `Keyboard.dismiss` method를 사용한다는 점도 확인하세요.

```tsx
import { useEffect, useState } from 'react';
import { Keyboard, View, Button, TextInput } from 'react-native';

export default function HomeScreen() {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
    const hideSubscription = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleKeyboardShow = event => {
    setIsKeyboardVisible(true);
  };

  const handleKeyboardHide = event => {
    setIsKeyboardVisible(false);
  };

  return (
    <View>
      {isKeyboardVisible && <Button title="Dismiss keyboard" onPress={Keyboard.dismiss} />}
      <TextInput placeholder="Type here..." />
    </View>
  );
}
```

## Keyboard Controller를 사용한 고급 keyboard handling

여러 text input field가 있는 큰 scroll 가능한 입력 form처럼 더 복잡한 keyboard 상호작용이 필요하다면 [`react-native-keyboard-controller` (Keyboard Controller)](https://kirillzyusko.github.io/react-native-keyboard-controller) 라이브러리 사용을 고려하세요. 이 라이브러리는 기본 React Native keyboard API를 넘어서는 추가 기능을 제공하며, 최소한의 구성으로 Android와 iOS 전반에서 일관성을 제공하고 사용자가 기대하는 네이티브 감각을 제공합니다.

### 사전 요구 사항

아래 단계는 Keyboard Controller 라이브러리가 Expo Go에 포함되어 있지 않기 때문에 [development build](/develop/development-builds/introduction)를 기준으로 설명합니다. 자세한 내용은 [development build 만들기](/develop/development-builds/create-a-build)를 참고하세요.

[Keyboard Controller](https://kirillzyusko.github.io/react-native-keyboard-controller)는 올바르게 동작하려면 `react-native-reanimated`도 필요합니다. 설치하려면 이 [설치 지침](/versions/latest/sdk/reanimated#installation)을 따르세요.

### 설치

먼저 Expo 프로젝트에 Keyboard Controller 라이브러리를 설치하세요:

```sh
npx expo install react-native-keyboard-controller
```

### Provider 설정

설정을 마무리하려면 앱에 `KeyboardProvider`를 추가하세요.

```tsx
import { Stack } from 'expo-router';
import { KeyboardProvider } from 'react-native-keyboard-controller';

export default function RootLayout() {
  return (
    <KeyboardProvider>
      <Stack>
        <Stack.Screen name="home" />
        <Stack.Screen name="chat" />
      </Stack>
    </KeyboardProvider>
  );
}
```

### 여러 input 처리하기

[`KeyboardAvoidingView`](/guides/keyboard-handling#keyboard-avoiding-view) 컴포넌트는 프로토타이핑에는 훌륭하지만, 플랫폼별 구성이 필요하고 커스터마이징 여지도 크지 않습니다.

더 강력한 대안으로는 [`KeyboardAwareScrollView`](https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/components/keyboard-aware-scroll-view) 컴포넌트를 사용할 수 있습니다. 이 컴포넌트는 focus된 `TextInput`으로 자동 스크롤하고 네이티브에 가까운 성능을 제공합니다. 요소가 몇 개 안 되는 단순한 화면에서는 `KeyboardAwareScrollView`를 사용하는 것이 아주 좋은 접근입니다.

여러 input이 있는 화면에서는 Keyboard Controller 라이브러리가 `KeyboardAwareScrollView`와 함께 사용할 `KeyboardToolbar` 컴포넌트도 제공합니다. 이 두 컴포넌트를 함께 사용하면 custom 구성 없이도 input navigation을 처리하고 keyboard가 화면을 가리지 않게 할 수 있습니다:

```tsx
import { TextInput, View, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView, KeyboardToolbar } from 'react-native-keyboard-controller';

export default function FormScreen() {
  return (
    <>
      <KeyboardAwareScrollView bottomOffset={62} contentContainerStyle={styles.container}>
        <View>
          <TextInput placeholder="Type a message..." style={styles.textInput} />
          <TextInput placeholder="Type a message..." style={styles.textInput} />
        </View>
        <TextInput placeholder="Type a message..." style={styles.textInput} />
        <View>
          <TextInput placeholder="Type a message..." style={styles.textInput} />
          <TextInput placeholder="Type a message..." style={styles.textInput} />
          <TextInput placeholder="Type a message..." style={styles.textInput} />
        </View>
        <TextInput placeholder="Type a message..." style={styles.textInput} />
      </KeyboardAwareScrollView>
      <KeyboardToolbar />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 16,
  },
  listStyle: {
    padding: 16,
    gap: 16,
  },
  textInput: {
    width: 'auto',
    flexGrow: 1,
    flexShrink: 1,
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#d8d8d8',
    backgroundColor: '#fff',
    padding: 8,
    marginBottom: 8,
  },
});
```

위 예시는 keyboard가 input을 가리지 않도록 input을 `KeyboardAwareScrollView`로 감쌉니다. `KeyboardToolbar` 컴포넌트는 navigation control과 dismiss 버튼을 표시합니다. 별도 설정 없이도 동작하지만, 필요하다면 toolbar 콘텐츠를 커스터마이즈할 수 있습니다.

### Keyboard 높이에 맞춰 view를 동기화해 애니메이션하기

더 고급스럽고 커스터마이즈 가능한 접근으로는 [`useKeyboardHandler`](https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/hooks/keyboard/use-keyboard-handler)를 사용할 수 있습니다. 이 hook은 keyboard lifecycle event에 접근할 수 있게 해줍니다. 이를 통해 keyboard 애니메이션이 언제 시작되는지, 그리고 애니메이션의 각 frame에서 keyboard 위치가 어디인지 알 수 있습니다.

`useKeyboardHandler` hook을 사용하면 각 frame에서 keyboard 높이에 접근하는 custom hook을 만들 수 있습니다. 아래 예시처럼 reanimated의 `useSharedValue`를 사용해 높이를 반환합니다.

```tsx
import { useKeyboardHandler } from 'react-native-keyboard-controller';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const useGradualAnimation = () => {
  const height = useSharedValue(0);

  useKeyboardHandler(
    {
      onMove: event => {
        'worklet';
        height.value = Math.max(event.height, 0);
      },
    },
    []
  );
  return { height };
};
```

`useGradualAnimation` hook을 사용하면 예를 들어 chat screen 컴포넌트처럼, keyboard가 활성화되거나 dismiss될 때 부드러운 애니메이션을 주도록 view를 애니메이션할 수 있습니다(아래 예시 참고). 이 컴포넌트는 hook에서 keyboard 높이를 가져옵니다. 그런 다음 reanimated의 `useAnimatedStyle` hook을 사용해 `fakeView`라는 animated style을 만듭니다. 이 style에는 `height`라는 한 가지 속성만 있으며, keyboard 높이로 설정됩니다.

`fakeView` animated style은 `TextInput` 뒤의 animated view에 사용됩니다. 이 view의 높이는 각 frame에서 keyboard 높이에 따라 애니메이션되며, 결과적으로 콘텐츠를 keyboard 위로 부드럽게 밀어 올립니다. 또한 keyboard가 dismiss되면 높이가 0으로 줄어듭니다.

```tsx
import { StyleSheet, Platform, FlatList, View, StatusBar, TextInput } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useKeyboardHandler } from 'react-native-keyboard-controller';

import MessageItem from '@/components/MessageItem';
import { messages } from '@/messages';

const useGradualAnimation = () => {
  // Code remains same from previous example 
};

export default function ChatScreen() {
  const { height } = useGradualAnimation();

  const fakeView = useAnimatedStyle(() => {
    return {
      height: Math.abs(height.value),
    };
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <MessageItem message={item} />}
        keyExtractor={item => item.createdAt.toString()}
        contentContainerStyle={styles.listStyle}
      />
      <TextInput placeholder="Type a message..." style={styles.textInput} />
      <Animated.View style={fakeView} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  listStyle: {
    padding: 16,
    gap: 16,
  },
  textInput: {
    width: '95%',
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#d8d8d8',
    backgroundColor: '#fff',
    padding: 8,
    alignSelf: 'center',
    marginBottom: 8,
  },
});
```

## 추가 자료

[Example](https://github.com/betomoedano/keyboard-guide) — GitHub에서 예제 프로젝트의 source code를 확인하세요.

[react-native-keyboard-controller](https://kirillzyusko.github.io/react-native-keyboard-controller) — react-native-keyboard-controller — Keyboard Controller 라이브러리에 대한 자세한 내용은 documentation을 참고하세요.
