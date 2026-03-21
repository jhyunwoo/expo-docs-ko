---
modificationDate: February 26, 2026
title: Drawer
description: Expo Router에서 Drawer layout을 사용하는 방법을 알아보세요.
---

# Drawer

Expo Router에서 Drawer layout을 사용하는 방법을 알아보세요.

navigation drawer는 모바일 앱에서 흔히 쓰이는 패턴으로, 사용자가 화면 한쪽에서 메뉴를 스와이프로 열어 내비게이션 옵션을 볼 수 있게 해줍니다. 이 메뉴는 보통 앱의 헤더에 있는 버튼으로도 토글할 수 있습니다.

## Installation

[drawer navigator](https://reactnavigation.org/docs/drawer-based-navigation)를 사용하려면 아직 설치하지 않았다면 몇 가지 추가 의존성을 설치해야 합니다. Android와 iOS에서는 drawer navigator가 애니메이션을 구동하기 위해 `react-native-reanimated`와 `react-native-worklets`를 필요로 합니다. web에서는 CSS 애니메이션으로 처리됩니다.

```sh
npx expo install @react-navigation/drawer react-native-reanimated react-native-worklets
```

## Usage

이제 `Drawer` layout을 사용해 drawer navigator를 만들 수 있습니다.

```tsx
import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return <Drawer />;
}
```

drawer navigation menu의 label, title, screen options를 수정하려면 아래처럼 각 화면에 대한 설정이 필요합니다:

```tsx
import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <Drawer>
      <Drawer.Screen
        name="index" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: 'Home',
          title: 'overview',
        }}
      />
      <Drawer.Screen
        name="user/[id]" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: 'User',
          title: 'overview',
        }}
      />
    </Drawer>
  );
}
```
