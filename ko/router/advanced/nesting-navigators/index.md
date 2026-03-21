---
modificationDate: February 26, 2026
title: navigator 중첩하기
description: Expo Router에서 navigators를 중첩하는 방법을 알아보세요.
---

# navigator 중첩하기

Expo Router에서 navigators를 중첩하는 방법을 알아보세요.

> Navigation UI 요소(Link, Tabs, Stack)는 향후 Expo Router 라이브러리 밖으로 이동할 수 있습니다.

[Using a Stack Navigator with Expo Router](https://www.youtube.com/watch?v=izZv6a99Roo) — 화면 사이를 이동하고, params를 전달하고, dynamic routes를 만들고, screen 제목과 애니메이션을 설정하는 방법을 알아보세요.

navigators를 중첩하면 다른 navigator의 screen 안에서 navigator를 렌더링할 수 있습니다. 이 가이드는 [React Navigation: Nesting navigators](https://reactnavigation.org/docs/nesting-navigators)를 Expo Router에 맞게 확장한 것입니다. Expo Router를 사용할 때 navigator 중첩이 어떻게 동작하는지 예시를 제공합니다.

## Example

예시로 사용되는 다음 파일 구조를 생각해 봅시다:

`src`

 `app`

  `_layout.tsx`

  `index.tsx`

  `home`

   `_layout.tsx`

   `feed.tsx`

   `messages.tsx`

위 예시에서 **src/app/home/feed.tsx**는 `/home/feed`에 매칭되고, **src/app/home/messages.tsx**는 `/home/messages`에 매칭됩니다.

```tsx
import { Stack } from 'expo-router';

export default Stack;
```

아래의 **src/app/home/_layout.tsx**와 **src/app/index.tsx**는 둘 다 **src/app/_layout.tsx** layout 안에 중첩되어 있으므로 stack으로 렌더링됩니다.

```tsx
import { Tabs } from 'expo-router';

export default Tabs;
```

```tsx
import { Link } from 'expo-router';

export default function Root() {
  return <Link href="/home/messages">중첩된 route로 이동</Link>;
}
```

아래의 **src/app/home/feed.tsx**와 **src/app/home/messages.tsx**는 둘 다 **home/_layout.tsx** layout 안에 중첩되어 있으므로 tab으로 렌더링됩니다.

```tsx
import { View, Text } from 'react-native';

export default function Feed() {
  return (
    <View>
      <Text>Feed screen</Text>
    </View>
  );
}
```

```tsx
import { View, Text } from 'react-native';

export default function Messages() {
  return (
    <View>
      <Text>Messages screen</Text>
    </View>
  );
}
```

## native tabs 안의 Stack

native tabs를 사용할 때는 각 tab 안에 `<Stack />` layout을 중첩해 header와 push screens를 지원할 수 있습니다. 전체 예시는 [Use Stacks inside tabs](/router/advanced/native-tabs#use-stacks-inside-tabs)를 참고하세요.

## 중첩 navigator 안의 screen으로 이동하기

React Navigation에서는 params에 screen 이름을 전달해 특정 중첩 screen으로 이동하는 동작을 제어할 수 있습니다. 이렇게 하면 해당 중첩 navigator의 초기 screen 대신 지정한 중첩 screen이 렌더링됩니다.

예를 들어 `root` navigator 안의 초기 screen에서 중첩 navigator인 `settings` 안의 `media`라는 screen으로 이동하고 싶다고 해봅시다. React Navigation에서는 아래 예시처럼 처리합니다:

```jsx
navigation.navigate('root', {
  screen: 'settings',
  params: {
    screen: 'media',
  },
});
```

Expo Router에서는 `router.push()`를 사용해 같은 결과를 얻을 수 있습니다. screen 이름을 params로 명시적으로 전달할 필요가 없습니다.

```jsx
router.push('/root/settings/media');
```
