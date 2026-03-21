---
modificationDate: February 26, 2026
title: Native tabs
description: Expo Router에서 native tabs layout을 사용하는 방법을 알아보세요.
---

# Native tabs

Expo Router에서 native tabs layout을 사용하는 방법을 알아보세요.

[Liquid Glass Tabs with Expo Router](https://www.youtube.com/watch?v=QqNZXdGFl44) — Expo Router에서 native tabs를 사용해 iOS의 liquid glass tabs를 만드는 방법을 알아보세요.

> Native tabs는 alpha 상태이며 SDK 54 이상에서 사용할 수 있습니다. API는 변경될 수 있습니다.

Tabs는 앱의 서로 다른 섹션 사이를 이동하는 일반적인 방법입니다. Expo Router에서는 필요에 따라 다양한 tab layout을 사용할 수 있습니다. 이 가이드는 native tabs를 다룹니다. [다른 tabs layout](/router/advanced/tabs#multiple-tab-layouts)과 달리 native tabs는 네이티브 시스템 tab bar를 사용합니다.

다른 tab layout은 다음을 참고하세요:

[Custom tabs](/router/advanced/custom-tabs) — 시스템 tabs로는 불가능한 완전한 커스텀 디자인이 필요하다면 custom tabs를 참고하세요.

[JavaScript tabs](/router/advanced/tabs) — 이미 React Navigation의 tabs를 사용하고 있다면 JavaScript tabs를 참고하세요.

## Get started

파일 기반 라우팅을 사용해 tabs layout을 만들 수 있습니다. 예시 파일 구조는 다음과 같습니다:

`src`

 `app`

  `_layout.tsx`

  `index.tsx`

  `settings.tsx`

위 파일 구조는 화면 하단에 tab bar가 있는 layout을 만듭니다. tab bar에는 **Home**과 **Settings** 두 개의 tab이 생깁니다.

**src/app/_layout.tsx** 파일을 사용해 tabs 기반의 앱 루트 layout을 정의할 수 있습니다. 이 파일은 tab bar와 각 tab을 위한 메인 layout 파일입니다. 이 안에서 tab bar와 각 tab item의 모양과 동작을 제어할 수 있습니다.

```tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon sf="gear" md="settings" />
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

마지막으로 tabs의 콘텐츠를 이루는 두 tab 파일 **src/app/index.tsx**와 **src/app/settings.tsx**가 있습니다.

```tsx
import { View, Text, StyleSheet } from 'react-native';

export default function Tab() {
  return (
    <View style={styles.container}>
      <Text>Tab [Home|Settings]</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

**index.tsx**라는 이름의 tab 파일은 앱이 처음 로드될 때 기본 tab이 됩니다. 두 번째 tab 파일 **settings.tsx**는 tab bar에 더 많은 tabs를 추가하는 방법을 보여줍니다.

> Stack navigator와 달리 tabs는 tab bar에 자동으로 추가되지 않습니다. layout 파일에서 `NativeTabs.Trigger`를 사용해 명시적으로 추가해야 합니다.

## tab bar items 커스터마이징하기

tab bar item을 커스터마이징하고 싶다면, 이 목적을 위해 설계된 components API를 사용하는 것을 권장합니다. 현재 커스터마이징할 수 있는 항목은 다음과 같습니다:

-   **Icon**: tab bar item에 표시되는 icon
-   **Label**: tab bar item에 표시되는 label
-   **Badge**: tab bar item에 표시되는 badge

### Icon

> `NativeTabs.Trigger.Icon`은 SDK 55 이상에서 사용할 수 있습니다. SDK 54에서는 `expo-router/unstable-native-tabs`에서 import한 `Icon`을 사용하세요.

`Icon` 컴포넌트를 사용해 tab bar item에 표시되는 icon을 커스터마이징할 수 있습니다. `Icon` 컴포넌트는 Android material symbols용 `md` prop, Apple SF Symbols icons용 `sf` prop, 커스텀 이미지를 위한 `src` prop을 받습니다.

또는 `sf`나 `src` prop 중 하나에 `{default: ..., selected: ...}`를 전달해 기본 상태와 선택 상태에 서로 다른 icons를 지정할 수 있습니다(현재 Android에서는 지원되지 않음).

```tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon src={require('../../../assets/setting_icon.png')} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

iOS의 liquid glass는 배경색이 밝은지 어두운지에 따라 자동으로 색상을 바꿉니다. 이에 대한 콜백은 없으므로, `PlatformColor` 또는 `DynamicColorIOS`를 사용해 icon 색상을 설정해야 합니다.

```tsx
import { DynamicColorIOS } from 'react-native';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs
      labelStyle={{
        // For the text color
        color: DynamicColorIOS({
          dark: 'white',
          light: 'black',
        }),
      }}
      // For the selected icon color
      tintColor={DynamicColorIOS({
        dark: 'white',
        light: 'black',
      })}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon
          src={{
            default: require('../assets/setting_icon.png'),
            selected: require('../assets/selected_setting_icon.png'),
          }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

#### Icon rendering mode

> Icon rendering mode는 SDK 55 이상에서 사용할 수 있습니다.

iOS에서 커스텀 이미지에 `src` 또는 `xcasset` prop을 사용할 때 `renderingMode` prop으로 icon 렌더링 방식을 제어할 수 있습니다:

-   **`template` (기본값)**: icon이 template image로 렌더링되어 iOS가 tint color를 적용할 수 있습니다. 앱의 색상 체계와 맞춰야 하는 단색 icon에 적합합니다.
-   **`original`**: icon이 원래 색상을 유지한 채 렌더링됩니다. gradient나 여러 색상을 가진 icon에 유용합니다.

```tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      {/* Icon with original colors preserved (e.g., for gradient or multi-color icons) */}
      <NativeTabs.Trigger name="colorful">
        <NativeTabs.Trigger.Icon
          src={require('../../../assets/colorful_icon.png')}
          renderingMode="original"
        />
      </NativeTabs.Trigger>
      {/* Icon rendered as a template (default behavior) */}
      <NativeTabs.Trigger name="simple">
        <NativeTabs.Trigger.Icon
          src={require('../../../assets/simple_icon.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

> `renderingMode` prop은 iOS에만 영향을 줍니다. Android에서는 모든 image icons가 원래 색상으로 렌더링됩니다.

#### Asset catalog icons (iOS)

> 이 기능은 SDK 55 이상에서 사용할 수 있습니다.

iOS에서는 `xcasset` prop을 사용해 Xcode asset catalog의 이미지를 tab icon으로 사용할 수 있습니다. 번들 이미지 파일 대신 Xcode asset catalog를 통해 icons를 관리하고 싶을 때 유용합니다.

기본 상태와 선택 상태에 동일한 icon을 사용하려면 asset 이름 문자열을 전달하세요:

```tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon xcasset="home-icon" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

기본 상태와 선택 상태에 다른 icons를 사용하려면 object를 전달하세요:

```tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon
          xcasset={{
            default: 'home-outline',
            selected: 'home-filled',
          }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

> Asset catalog icons는 `src` icons와 마찬가지로 `renderingMode` prop을 지원합니다. `iconColor`가 설정되어 있으면 기본값은 `template` 렌더링이고, 그렇지 않으면 `original`이 기본값입니다.

### Label

`Label` 컴포넌트를 사용해 tab bar item에 표시되는 label을 커스터마이징할 수 있습니다. `Label` 컴포넌트는 child로 전달된 문자열 label을 받습니다. label이 제공되지 않으면 tab bar item은 route 이름을 label로 사용합니다.

label을 표시하고 싶지 않다면 `hidden` prop을 사용해 label을 숨길 수 있습니다.

```tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label hidden />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

### Badge

`Badge` 컴포넌트를 사용해 tab bar item에 표시되는 badge를 커스터마이징할 수 있습니다. badge는 tab 위에 추가로 표시되는 표시이며, 알림 개수나 읽지 않은 메시지 수를 보여주는 데 유용합니다.

```tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="messages">
        <NativeTabs.Trigger.Badge>9+</NativeTabs.Trigger.Badge>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Badge />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

## tab bar 커스터마이징하기

native tab layout의 모양은 플랫폼마다 다르므로, 커스터마이징 옵션도 다릅니다. 전체 옵션은 [`NativeTabs`용 API reference](/versions/latest/sdk/router-native-tabs)를 참고하세요.

## Advanced

### Tab bar 숨기기

> `hidden` 속성은 SDK 55 이상에서 사용할 수 있습니다.

`NativeTabs` 컴포넌트의 `hidden` prop을 사용해 tab bar를 숨길 수 있습니다. 특정 screens에서만 tab bar를 숨기려면 context API를 사용해 `hidden` prop을 동적으로 설정할 수 있습니다.

```tsx
import { createContext } from 'react';

export const TabBarContext = createContext<{
  setIsTabBarHidden: (hidden: boolean) => void;
}>({
  setIsTabBarHidden: () => {},
});
```

```tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useState } from 'react';

import { TabBarContext } from '@/context/TabBarContext';

export default function TabLayout() {
  const [isTabBarHidden, setIsTabBarHidden] = useState(false);
  return (
    <TabBarContext value={{ setIsTabBarHidden }}>
      <NativeTabs hidden={isTabBarHidden}>
        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="settings">
          <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </TabBarContext>
  );
}
```

```tsx
import { useFocusEffect } from 'expo-router';
import { use } from 'react';

import { TabBarContext } from '@/context/TabBarContext';

export default function HomeScreen() {
  const { setIsTabBarHidden } = use(TabBarContext);

  useFocusEffect(() => {
    setIsTabBarHidden(true);
    return () => setIsTabBarHidden(false);
  });

  return (
    // Screen content
  );
}
```

### tab을 조건부로 숨기기

> tabs를 동적으로 숨기면 navigator가 remount되고 상태가 초기화됩니다. tabs의 가시성은 navigator가 mount되기 전이나 사용자에게 보이지 않을 때만 변경하세요.

조건에 따라 tab을 숨기고 싶다면 trigger를 제거하거나 `NativeTabs.Trigger` 컴포넌트에 `hidden` prop을 전달하면 됩니다.

```tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  const shouldHideMessagesTab = true; // Replace with your condition
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="messages" hidden={shouldHideMessagesTab} />
    </NativeTabs>
  );
}
```

> **참고**: tab을 `hidden`으로 표시하면 어떤 방식으로도 해당 tab으로 이동할 수 없습니다.

### Dismiss behavior

> Dismiss behavior는 SDK 55 이상에서 Android에서 사용할 수 있습니다.

기본적으로 이미 활성화된 tab을 탭하면 해당 tab의 stack 안의 모든 screen이 닫히고 루트 screen으로 돌아갑니다. 이를 끄려면 `NativeTabs.Trigger` 컴포넌트에 `disablePopToTop` prop을 설정하세요.

```tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index" disablePopToTop>
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

### Scroll to top

> Scroll to top은 SDK 55 이상에서 Android에서 사용할 수 있습니다.

기본적으로 이미 활성화되어 있고 루트 screen을 표시 중인 tab을 탭하면 콘텐츠가 맨 위로 스크롤됩니다. 이를 끄려면 `NativeTabs.Trigger` 컴포넌트에 `disableScrollToTop` prop을 설정하세요.

```tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index" disableScrollToTop>
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

### iOS 26 features

> 이 섹션의 기능을 사용하려면 Xcode 26 이상으로 앱을 컴파일해야 합니다.

#### Separate search tab

별도의 search tab을 추가하려면 분리해서 표시하려는 native tab에 `role`을 지정하고 값을 `search`로 설정하세요.

```tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search" role="search">
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

#### Tabbar search input

tab bar에 search field를 추가하려면 screen을 Stack navigator로 감싸고 `headerSearchBarOptions`를 구성하세요.

`src`

 `app`

  `_layout.tsx`

  `index.tsx`

  `search`

   `_layout.tsx`

   `index.tsx`

```tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search" role="search">
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

```tsx
import { Stack } from 'expo-router';

export default function SearchLayout() {
  return <Stack />;
}
```

```tsx
import { ScrollView } from 'react-native';
import { Stack } from 'expo-router';

export default function SearchIndex() {
  return (
    <>
      <Stack.Screen.Title>Search</Stack.Screen.Title>
      <Stack.SearchBar placement="automatic" placeholder="Search" onChangeText={() => {}} />
      <ScrollView>{/* Screen content */}</ScrollView>
    </>
  );
}
```

#### Tab bar minimize behavior

tab bar에 minimize 동작을 구현하려면 `NativeTabs`의 [`minimizeBehavior`](/versions/latest/sdk/router-native-tabs#minimizebehavior) prop을 사용할 수 있습니다. 아래 예시에서는 아래로 스크롤할 때 tab bar가 최소화됩니다.

```tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="tab-1">
        <NativeTabs.Trigger.Label>Tab 1</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

#### Bottom accessory

> 이 기능은 SDK 55 이상에서 사용할 수 있습니다.

bottom accessory는 tab bar 위에 나타나는 floating view로, 미니 음악 플레이어 같은 지속적인 컨트롤을 표시하는 데 유용합니다. 자세한 내용은 Apple의 [`UITabBarController` bottomAccessory documentation](https://developer.apple.com/documentation/uikit/uitabbarcontroller/bottomaccessory)를 참고하세요.

bottom accessory는 두 가지 배치 방식으로 표시될 수 있습니다: `'regular'`(tab bar 위의 표준 위치) 또는 `'inline'`(tab bar와 나란한 compact mode). 현재 배치 방식에 따라 UI를 조정하려면 `usePlacement` hook을 사용하세요.

> accessory component 밖에서 props, context, 또는 외부 상태 관리로 상태를 저장해야 합니다. bottom accessory component는 두 개의 인스턴스가 동시에 렌더링되며(배치마다 하나씩) 이들 사이에서 상태는 **공유되지 않습니다**.

다음 예시는 상태를 부모 컴포넌트로 끌어올린 mini player를 보여줍니다:

```tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

function MiniPlayer({ isPlaying, onToggle }) {
  const placement = NativeTabs.BottomAccessory.usePlacement();

  if (placement === 'inline') {
    // Compact UI for inline placement
    return (
      <Pressable onPress={onToggle} style={styles.inlinePlayer}>
        <Text>{isPlaying ? '⏸' : '▶'}</Text>
      </Pressable>
    );
  }

  // Full UI for regular placement
  return (
    <View style={styles.regularPlayer}>
      <Text>Now Playing: Song Title</Text>
      <Pressable onPress={onToggle}>
        <Text>{isPlaying ? 'Pause' : 'Play'}</Text>
      </Pressable>
    </View>
  );
}

export default function TabLayout() {
  // State must be stored outside BottomAccessory
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <NativeTabs>
      <NativeTabs.BottomAccessory>
        <MiniPlayer isPlaying={isPlaying} onToggle={() => setIsPlaying(!isPlaying)} />
      </NativeTabs.BottomAccessory>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="library">
        <NativeTabs.Trigger.Label>Library</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

const styles = StyleSheet.create({
  inlinePlayer: {
    padding: 8,
  },
  regularPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
});
```

### Android에서 keyboard avoidance 비활성화하기

기본적으로 Android에서 키보드가 표시되면 native tabs가 가려지지 않도록 자동으로 조정됩니다. app config 파일에서 [`android.softwareKeyboardLayoutMode`](/versions/latest/config/app#softwarekeyboardlayoutmode) 속성을 `pan`으로 바꾸면 이 동작을 비활성화할 수 있습니다:

```json
{
  "expo": {
    "android": {
      "softwareKeyboardLayoutMode": "pan"
    }
  }
}
```

### Safe area handling

> 이 기능은 SDK 55 이상에서 사용할 수 있습니다.

native tabs는 플랫폼별 동작에 따라 safe area insets를 자동으로 처리합니다:

-   **Android**: 화면 콘텐츠는 tab bar에 대해 **bottom** inset을 적용하는 `SafeAreaView`로 자동으로 감싸집니다. 다른 insets(top, left, right)는 수동으로 처리해야 합니다.
-   **iOS**: native tabs screen 안에 중첩된 첫 번째 `ScrollView`에는 [automatic content inset adjustment](https://reactnative.dev/docs/scrollview#contentinsetadjustmentbehavior-ios)가 활성화됩니다. 덕분에 tab bar 뒤에서도 콘텐츠가 올바르게 스크롤됩니다.

#### 자동 content insets 비활성화하기

safe area handling을 완전히 직접 제어해야 한다면 `NativeTabs.Trigger`의 `disableAutomaticContentInsets` prop을 사용해 자동 content inset 조정을 비활성화할 수 있습니다:

```tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index" disableAutomaticContentInsets>
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

`disableAutomaticContentInsets`를 `true`로 설정하면 safe area insets를 수동으로 관리해야 합니다. `react-native-screens/experimental`의 `SafeAreaView`를 사용할 수 있습니다:

```tsx
import { SafeAreaView } from 'react-native-screens/experimental';

export default function HomeScreen() {
  return (
    <SafeAreaView edges={{ bottom: true }} style={{ flex: 1 }}>
      {/* Screen content */}
    </SafeAreaView>
  );
}
```

### Lazy loading

native tabs의 모든 tab screens는 navigator가 mount될 때 eager하게 렌더링됩니다. native tab bar는 각 screen이 전환을 위해 준비되어 있어야 하므로 이 동작은 바꿀 수 없습니다. 실제로 사용자가 tab을 방문할 때까지 무거운 콘텐츠를 미루고 싶다면 다음 접근 방식 중 하나를 사용할 수 있습니다.

#### focus될 때만 콘텐츠 렌더링하기

`useIsFocused`를 사용해 조건부로 콘텐츠를 렌더링하세요. 사용자가 다른 곳으로 이동하면 콘텐츠는 unmount되고, 다시 돌아오면 다시 렌더링됩니다. 즉, 모든 tab 전환 시 local state(스크롤 위치, form 입력값)는 사라집니다.

```tsx
import { useIsFocused } from 'expo-router';
import { View, ActivityIndicator, Text } from 'react-native';

export default function SearchScreen() {
  const isFocused = useIsFocused();

  if (!isFocused) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Text>Expensive content that only renders when this tab is focused</Text>
    </View>
  );
}
```

#### 첫 focus에서 한 번만 로드하기

state flag와 함께 `useFocusEffect`를 사용해 tab이 처음 focus될 때 콘텐츠를 로드하고, 이후에는 mount된 상태를 유지하세요.

```tsx
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

export default function SearchScreen() {
  const [hasActivated, setHasActivated] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setHasActivated(true);
    }, [])
  );

  if (!hasActivated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Text>Content that loads once and stays mounted</Text>
    </View>
  );
}
```

### Custom web layout

native tabs는 Android와 iOS에서 플랫폼별 tab bars를 렌더링하지만, web에는 표준 시스템 tab bar가 없습니다. web에서는 native tabs가 iPad 디자인을 느슨하게 참고한 기본 구현으로 fallback됩니다. mobile에서는 native tabs를 유지하면서 web에는 `expo-router/ui`의 headless tabs를 사용해 커스텀 web layout을 제공할 수 있습니다. 이를 설정하는 방법은 두 가지입니다.

#### Platform-specific layout files

**_layout.tsx**와 함께 **_layout.web.tsx** 파일을 사용하세요. web 파일은 web에서 layout을 완전히 대체하므로 플랫폼마다 완전히 다른 layout을 가질 수 있습니다.

`app`

 `_layout.tsx — Android와 iOS용 native tabs`

 `_layout.web.tsx — web용 headless tabs`

```tsx
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { StyleSheet } from 'react-native';

export default function WebLayout() {
  return (
    <Tabs>
      <TabSlot />
      <TabList style={styles.tabList}>
        <TabTrigger name="index" href="/" style={styles.tab}>
          Home
        </TabTrigger>
        <TabTrigger name="settings" href="/settings" style={styles.tab}>
          Settings
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabList: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    padding: 16,
  },
  tab: {
    padding: 8,
  },
});
```

#### Shared component with platform extensions

platform-specific extensions가 있는 컴포넌트로 tab UI를 분리하세요. 하나의 **_layout.tsx**가 shared logic(provider, wrappers, analytics)을 처리하고, tab 컴포넌트를 import하면 플랫폼에 맞는 파일로 resolve됩니다.

`app`

 `_layout.tsx — shared layout, AppTabs import`

`components`

 `app-tabs.tsx — Android와 iOS용 native tabs`

 `app-tabs.web.tsx — web용 headless tabs`

```tsx
import AppTabs from '@/components/app-tabs';

export default function Layout() {
  return (
    <ThemeProvider>
      <AppTabs />
    </ThemeProvider>
  );
}
```

```tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function AppTabs() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon sf="gear" md="settings" />
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

```tsx
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { StyleSheet } from 'react-native';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot />
      <TabList style={styles.tabList}>
        <TabTrigger name="index" href="/" style={styles.tab}>
          Home
        </TabTrigger>
        <TabTrigger name="settings" href="/settings" style={styles.tab}>
          Settings
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabList: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    padding: 16,
  },
  tab: {
    padding: 8,
  },
});
```

[Custom tabs](/router/advanced/custom-tabs) — expo-router/ui의 headless tabs 커스터마이징에 대해 더 알아보세요.

[Platform-specific extensions](/router/advanced/platform-specific-modules) — Expo Router에서 `.web.tsx` 같은 platform-specific file extensions가 어떻게 동작하는지 알아보세요.

## SDK 54에서 55로 native tabs 마이그레이션하기

SDK 55에서는 tab bar item 컴포넌트에 접근하는 방식이 바뀌었습니다. `Icon`, `Label`, `Badge`를 따로 import하는 대신 compound component API인 `NativeTabs.Trigger.Icon`, `NativeTabs.Trigger.Label`, `NativeTabs.Trigger.Badge`를 사용하세요. Android icons에는 `md` prop이 Material Symbols를 사용하는 새로운 권장 방식입니다.

## JavaScript tabs에서 마이그레이션하기

native tabs는 [JavaScript tabs](/router/advanced/tabs)의 drop-in replacement로 설계되지 않았습니다. native tabs는 네이티브 플랫폼 동작에 제약을 받지만, JavaScript tabs는 더 자유롭게 커스터마이징할 수 있습니다. 네이티브 플랫폼 동작이 꼭 필요하지 않다면 JavaScript tabs를 계속 사용할 수 있습니다.

### `Screen` 대신 `Trigger` 사용하기

`NativeTabs`는 layout에 routes를 추가하기 위해 `Trigger`라는 개념을 도입합니다. 자동으로 추가된 routes를 스타일링하는 `Screen`과 달리, `Trigger` 시스템은 tab bar에서 tabs를 숨기거나 제거할 때 더 나은 제어권을 제공합니다.

### props 대신 React components 사용하기

`NativeTabs`는 props object보다 컴포넌트를 사용해 UI를 정의하는 React 우선 API를 채택합니다.

### tabs 안에 Stacks 사용하기

JavaScript `<Tabs />`에는 모의 stack header가 있지만 native tabs에는 없습니다. 대신 native tabs 안에 native `<Stack />` layout을 중첩해 headers와 screen push 둘 다 지원해야 합니다.

## Common problems

iOS 18 이하에서 tab bar가 투명해집니다

iOS 18 이하에서는 스크롤 가능한 콘텐츠의 끝까지 스크롤하면 native tab bar가 투명해집니다. 즉, `ScrollView`의 끝까지 스크롤하거나 정적인 `View`를 렌더링하면 투명해질 수 있습니다.

이 동작을 끄려면 [`disableTransparentOnScrollEdge`](/versions/latest/sdk/router-native-tabs#disabletransparentonscrolledge) prop을 사용할 수 있습니다.

```tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index" disableTransparentOnScrollEdge>
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

`ScrollView`를 사용 중인데 tab bar가 처음부터 투명하다면, `ScrollView`가 screen component의 첫 번째 child인지 확인하세요. 다른 컴포넌트로 감쌌다면 wrapper component에 `collapsable`을 `false`로 설정하세요.

```tsx
import { ScrollView, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View collapsable={false} style={{ flex: 1 }}>
      <ScrollView>{/* Screen content */}</ScrollView>
    </View>
  );
}
```

iOS 26에서 tabs 전환 시 흰 배경이 번쩍입니다

이 문제는 React Navigation의 기본 theme가 흰 배경색을 사용하기 때문에 발생합니다. 이를 해결하려면 적절한 theme를 사용해 앱을 React Navigation의 `ThemeProvider`로 감싸세요.

**라이트 모드와 다크 모드를 모두 지원하는 앱의 경우:**

```tsx
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <NativeTabs>
        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="settings">
          <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </ThemeProvider>
  );
}
```

**다크 모드만 지원하는 앱의 경우:**

```tsx
import { ThemeProvider, DarkTheme } from '@react-navigation/native';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <NativeTabs>{/* tabs */}</NativeTabs>
    </ThemeProvider>
  );
}
```

**특정 배경색을 써야 하는 다른 방법:**

기본 themes와 맞지 않는 특정 배경색이 필요하다면 `NativeTabs.Trigger`의 [`contentStyle`](/versions/latest/sdk/router-native-tabs#contentstyle) prop을 사용할 수 있습니다:

```tsx
<NativeTabs.Trigger name="index" contentStyle={{ backgroundColor: '#1a1a2e' }}>
```

tab을 탭했을 때 맨 위로 스크롤되지 않습니다

활성화된 tab을 탭하면 콘텐츠가 맨 위로 스크롤되어야 하지만, `ScrollView`가 screen component의 첫 번째 child가 아니면 동작하지 않을 수 있습니다.

`ScrollView`가 screen component의 직접적인 첫 번째 child인지 확인하세요. 다른 컴포넌트로 감쌌다면 wrapper component에 `collapsable`을 `false`로 설정하세요.

```tsx
import { ScrollView, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View collapsable={false} style={{ flex: 1 }}>
      <ScrollView>{/* Screen content */}</ScrollView>
    </View>
  );
}
```

iOS 26 다크 모드에서 liquid glass header buttons가 깜빡입니다

liquid glass 스타일의 header buttons는 iOS 26의 다크 모드에서 tabs를 전환할 때 배경이 깜빡이거나 번쩍일 수 있습니다. 이는 React Navigation의 기본 theme가 시스템 다크 모드와 맞지 않아 liquid glass 렌더링에 시각적 artifact가 생기기 때문입니다.

해결 방법은 흰 배경 번쩍임 문제와 동일합니다. 적절한 theme를 사용해 `@react-navigation/native`의 `<ThemeProvider>`로 layout을 감싸세요.

**라이트 모드와 다크 모드를 모두 지원하는 앱의 경우:**

```tsx
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <NativeTabs>
        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="settings">
          <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </ThemeProvider>
  );
}
```

**다크 모드만 지원하는 앱의 경우:**

```tsx
import { ThemeProvider, DarkTheme } from '@react-navigation/native';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <NativeTabs>{/* tabs */}</NativeTabs>
    </ThemeProvider>
  );
}
```

## Known limitations

Android에서는 tab이 5개로 제한됩니다

Android에서는 tab bar에 최대 5개의 tab만 둘 수 있습니다. 이 제한은 플랫폼의 Material Tabs 컴포넌트에서 비롯됩니다.

tab bar 높이를 측정할 수 없습니다

tabs는 iPad에서 렌더링될 때는 화면 상단에 오기도 하고 Apple Vision Pro에서는 화면 옆으로 가기도 하는 등 위치가 달라질 수 있습니다. 앞으로 더 자세한 layout 정보를 제공하는 layout function을 준비하고 있습니다.

중첩 native tabs는 지원되지 않습니다

native tabs는 다른 native tabs 안에 중첩할 수 없습니다. 대신 native tabs 안에 [JavaScript tabs](/router/advanced/tabs)를 중첩할 수는 있습니다.

FlatList 지원이 제한적입니다

[FlatList](https://reactnative.dev/docs/flatlist)와 native tabs의 통합에는 제한이 있습니다. scroll-to-top과 minimize-on-scroll 같은 기능은 지원되지 않습니다. 또한 scroll edge 감지가 실패해 tab bar가 투명하게 보일 수 있습니다. 이를 해결하려면 [`disableTransparentOnScrollEdge`](/versions/latest/sdk/router-native-tabs#disabletransparentonscrolledge) prop을 사용하세요.

```tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs disableTransparentOnScrollEdge>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

tabs를 동적으로 추가하거나 제거하는 것은 지원되지 않습니다

런타임에 tabs를 동적으로 추가하거나 제거하는 것은 지원되지 않습니다. tabs는 layout 파일에 정적으로 정의하고 앱 수명 주기 내내 일관되게 유지해야 합니다. 이는 사용자가 앱의 내비게이션 구조에 대한 정신적 모델을 형성하도록 돕기 위해 tab bar 콘텐츠를 안정적으로 유지하라고 권장하는 [Apple's Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/tab-bars#Best-practices)와도 일치합니다. tabs를 동적으로 추가하거나 제거하면 콘텐츠가 remount되고 상태가 사라집니다.
