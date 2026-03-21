---
modificationDate: February 26, 2026
title: Navigation layouts in Expo Router
description: 디렉터리와 layout 파일을 사용해 page 사이의 서로 다른 관계를 구성하는 방법을 알아보세요.
---

# Navigation layouts in Expo Router

디렉터리와 layout 파일을 사용해 page 사이의 서로 다른 관계를 구성하는 방법을 알아보세요.

[Introduction to Expo Router Layout Files](https://www.youtube.com/watch?v=Yh6Qlg2CYwQ) — layout 파일이 무엇인지, screen 사이를 어떻게 이동하는지, redirects를 사용해 접근을 차단하는 방법을 알아보세요.

**src/app** 디렉터리 안의 각 디렉터리(**src/app** 자체 포함)는 그 디렉터리 안에 있는 **_layout.tsx** 파일 형태로 layout을 정의할 수 있습니다. 이 파일은 해당 디렉터리 안의 모든 page가 어떻게 배치되는지 정의합니다. 이곳에서 stack navigator, tab navigator, drawer navigator 또는 그 디렉터리의 page에 사용하고 싶은 다른 layout을 정의합니다. layout 파일은 그 디렉터리 안에서 이동하려는 page보다 먼저 렌더링되는 default component를 export합니다.

몇 가지 일반적인 layout 시나리오를 살펴보겠습니다.

## Root layout

사실상 모든 앱은 **src/app** 디렉터리 바로 안에 **_layout.tsx** 파일을 하나 가지게 됩니다. 이것이 root layout이며 navigation의 진입점을 나타냅니다. 이 파일은 앱의 최상위 navigator를 설명하는 것 외에도, 예전에는 **App.jsx** 파일 안에 넣었을 초기화 코드, 예를 들어 font 로딩, splash screen 제어, context provider 추가 같은 작업을 두는 곳입니다.

다음은 root layout의 예시입니다:

```tsx
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hide();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <Stack />;
}
```

위 예시는 처음에 splash screen을 보여주고, font가 로드되면 stack navigator를 렌더링합니다. 그러면 앱은 initial route로 진행하게 됩니다.

## Stacks

위에서 본 것처럼 root layout이나 디렉터리 안의 다른 어떤 layout 파일에서도 stack navigator를 구현할 수 있습니다. 디렉터리 안에 stack이 있는 다음 파일 구조를 가정해봅시다:

`src`

 `app`

  `products`

   `_layout.tsx`

   `index.tsx`

   `[productId].tsx`

   `accessories`

    `index.tsx`

**src/app/products** 디렉터리 안의 모든 것을 stack 관계로 배치하고 싶다면 **_layout.tsx** 파일 안에서 `Stack` component를 반환하면 됩니다:

```tsx
import { Stack } from 'expo-router';

export default function StackLayout() {
  return <Stack />;
}
```

`/products`로 이동하면 먼저 기본 route인 **products/index.tsx**로 이동합니다. `/products/123`으로 이동하면 그 page가 stack 위로 push됩니다. 기본적으로 stack은 header에 back button을 렌더링하며, 이 버튼은 현재 page를 stack에서 pop해 사용자를 이전 page로 되돌립니다. page가 보이지 않더라도 여전히 stack에 push된 상태라면 계속 렌더링되고 있습니다.

`Stack` component는 [React Navigation's native stack](https://reactnavigation.org/docs/native-stack-navigator/)을 구현하며 같은 screen option을 사용할 수 있습니다. 하지만 navigator 안에 page를 직접 정의할 필요는 없습니다. 디렉터리 안의 파일들은 자동으로 stack 안에서 사용 가능한 route로 취급됩니다. 다만 screen option을 정의하고 싶다면 `Stack` component 안에 `Stack.Screen` component를 추가할 수 있습니다. `name` prop은 route 이름과 일치해야 하지만 `component` prop을 제공할 필요는 없습니다. Expo Router가 자동으로 매핑해줍니다:

```tsx
import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen name="[productId]" options={{ headerShown: false }} />
    </Stack>
  );
}
```

navigator를 중첩하는 것도 가능하지만, 정말 필요한 경우에만 그렇게 해야 합니다. 위 예시에서 **products/accessories/index.tsx**를 stack에 push하고 싶다고 해서 **accessories** 디렉터리 안에 `Stack` navigator가 들어 있는 추가 **_layout.tsx**가 꼭 필요한 것은 아닙니다. 그렇게 하면 첫 번째 stack 안에 또 다른 stack이 정의됩니다. URL에만 영향을 주는 디렉터리를 추가하는 것은 괜찮지만, 그렇지 않다면 부모 디렉터리와 같은 navigator를 사용하세요.

## Tabs

Expo Router는 필요에 따라 tab navigation을 구현하는 여러 가지 방법을 제공합니다.

### JavaScript tabs

layout 파일 안에서 `Tabs` component를 사용해 JavaScript 기반 tab navigator를 구현할 수 있습니다. 해당 디렉터리 바로 안에 있는 모든 route는 tab으로 취급됩니다. 다음 파일 구조를 생각해봅시다:

`src`

 `app`

  `(tabs)`

   `_layout.tsx`

   `index.tsx`

   `feed.tsx`

   `profile.tsx`

**_layout.tsx** 파일에서 `Tabs` component를 반환합니다:

```tsx
import { Tabs } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen name="feed" options={{ title: 'Feed' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
```

이렇게 하면 **index.tsx**, **feed.tsx**, **profile.tsx** 파일이 같은 bottom tabs navigator 안에 함께 표시됩니다. 이 `Tabs` component는 [React Navigation's native bottom tabs](https://reactnavigation.org/docs/bottom-tab-navigator/)를 사용하며 동일한 option을 지원합니다.

`Tabs`의 경우 tab이 나타나는 순서, title, tab 안의 icon에 영향을 주기 때문에 navigator 안에서 tab을 정의하고 싶을 가능성이 높습니다. index route가 기본 선택 tab이 됩니다.

### Native tabs

Android와 iOS에서는 [native tabs](/router/advanced/native-tabs)를 사용해 플랫폼에 내장된 tab bar를 렌더링할 수 있습니다. native tabs는 탭을 눌렀을 때 scroll-to-top, 네이티브 animation, 네이티브 look and feel 같은 플랫폼에서 기대되는 동작을 제공합니다.

JavaScript tabs와 마찬가지로 native tabs도 route group 디렉터리 안의 layout 파일에서 사용할 수 있습니다:

`src`

 `app`

  `(tabs)`

   `_layout.tsx`

   `index.tsx`

   `feed.tsx`

   `profile.tsx`

```tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={require('@/assets/images/tabIcons/home.png')} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="feed">
        <NativeTabs.Trigger.Label>Feed</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={require('@/assets/images/tabIcons/feed.png')} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={require('@/assets/images/tabIcons/profile.png')} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

### Platform-specific tabs

native tabs는 Android와 iOS에서만 사용할 수 있으므로, 흔한 패턴 하나는 [platform-specific file extensions](/router/advanced/platform-specific-modules)를 사용해 native와 web에 서로 다른 tab 구현을 제공하는 것입니다. root layout은 tab component를 렌더링하고, Expo의 module resolution이 플랫폼에 따라 올바른 파일을 자동으로 선택합니다.

`src`

 `app`

  `_layout.tsx`

  `index.tsx`

  `explore.tsx`

 `components`

  `app-tabs.native.tsx``Native tabs (Android and iOS)`

  `app-tabs.tsx``Custom tabs (web)`

root layout은 `AppTabs` component를 import해 렌더링합니다. **app-tabs.native.tsx**는 Android와 iOS에서 사용되고, **app-tabs.tsx**는 web에서 사용됩니다:

```tsx
import AppTabs from '@/components/app-tabs';

export default function RootLayout() {
  return <AppTabs />;
}
```

Android와 iOS에서는 **app-tabs.native.tsx**가 [native tabs](/router/advanced/native-tabs)를 사용합니다:

```tsx
import { NativeTabs } from 'expo-router/native-tabs';

export default function AppTabs() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={require('@/assets/images/tabIcons/home.png')} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={require('@/assets/images/tabIcons/explore.png')} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

web에서는 **app-tabs.tsx**가 `expo-router/ui`의 [custom tabs](/router/advanced/custom-tabs)를 사용하며, 이 component들은 스타일이 지정되지 않은 유연한 component입니다:

```tsx
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot />
      <TabList>
        <TabTrigger name="index" href="/">
          Home
        </TabTrigger>
        <TabTrigger name="explore" href="/explore">
          Explore
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}
```

## Slot

어떤 경우에는 navigator가 없는 layout이 필요할 수 있습니다. 현재 route 주위에 header나 footer를 추가하거나, 디렉터리 안의 어떤 route 위에든 modal을 표시하고 싶을 때 유용합니다. 이런 경우 현재 child route의 placeholder 역할을 하는 `Slot` component를 사용할 수 있습니다.

다음 파일 구조를 생각해봅시다:

`src`

 `app`

  `social`

   `_layout.tsx`

   `index.tsx`

   `feed.tsx`

   `profile.tsx`

예를 들어 **social** 디렉터리 안의 어떤 route든 header와 footer로 감싸고 싶지만, page 사이를 이동할 때는 나중에 "back" navigation action으로 pop할 수 있도록 새 page를 stack에 push하는 대신 단순히 현재 page를 교체하고 싶을 수 있습니다. **_layout.tsx** 파일에서 header와 footer로 둘러싸인 `Slot` component를 반환하세요:

```tsx
import { Slot } from 'expo-router';

export default function Layout() {
  return (
    <>
      <Header />
      <Slot />
      <Footer />
    </>
  );
}
```

## Other layouts

이것들은 동작 방식을 이해할 수 있도록 보여주는 몇 가지 일반적인 layout 예시일 뿐입니다. layout으로 할 수 있는 일은 훨씬 더 많습니다:

-   [Drawer navigator](/router/advanced/drawer)를 구현할 수 있습니다
-   Android와 iOS에서 플랫폼 네이티브 tab bar를 위해 [native tabs](/router/advanced/native-tabs)를 사용할 수 있습니다
-   기본 tabs를 [완전히 커스터마이즈된 tabs](/router/advanced/custom-tabs)로 대체할 수 있습니다
-   부모 navigator가 아래에서 계속 보이도록 투명도를 가진 page를 표시하기 위해 [modal](/router/advanced/modals)을 사용할 수 있습니다
-   top tabs, bottom sheets 등을 포함해 [React Navigation과 호환되는 어떤 navigator든 적용](/versions/latest/sdk/router#withlayoutcontextnav-processor)할 수 있습니다
