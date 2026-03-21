---
modificationDate: February 26, 2026
title: JavaScript tabs
description: Expo Router에서 JavaScript tabs layout(React Navigation bottom tabs)을 사용하는 방법을 알아보세요.
---

# JavaScript tabs

Expo Router에서 JavaScript tabs layout(React Navigation bottom tabs)을 사용하는 방법을 알아보세요.

[Using a JavaScript Tab Navigator with Expo Router](https://www.youtube.com/watch?v=BElPB4Ai3j0) — tab icon을 구성하고, navigator를 중첩하고, navigation history를 관리하는 방법을 알아보세요.

tabs는 앱의 서로 다른 섹션 사이를 이동하는 일반적인 방식입니다. Expo Router는 앱 하단에 tab bar를 만들 수 있도록 tabs layout을 제공합니다. 가장 빠르게 시작하는 방법은 template를 사용하는 것입니다. 시작하려면 [quick start installation](/router/introduction#quick-start)을 참고하세요.

## Multiple tab layouts

Expo Router는 세 가지 tab navigator 유형을 제공합니다:

-   **JavaScript tabs**: React Navigation의 bottom tabs로 구현되며, 이미 React Navigation을 사용해봤다면 익숙한 API를 제공합니다.
-   **Native tabs**: 플랫폼의 네이티브 tab bar를 사용하며 네이티브 look and feel을 제공합니다.
-   **Custom tabs**: `expo-router/ui`의 headless tab component를 제공해 복잡한 UI 패턴을 구현할 수 있는 완전한 custom tab layout을 만들 수 있습니다.

이 가이드는 **JavaScript tabs** layout을 다룹니다. 다른 tab layout은 다음을 참고하세요:

[Native tabs](/router/advanced/native-tabs) — tab bar에 네이티브 look and feel을 적용하고 싶다면 native tabs를 참고하세요.

[Custom tabs](/router/advanced/custom-tabs) — 앱에 system tabs로는 구현할 수 없는 완전한 custom design이 필요하다면 custom tabs를 참고하세요.

## Get started with JavaScript tabs

file-based routing을 사용해 tabs layout을 만들 수 있습니다. 다음은 예시 파일 구조입니다:

`src`

 `app`

  `_layout.tsx`

  `(tabs)`

   `_layout.tsx`

   `index.tsx`

   `settings.tsx`

이 파일 구조는 screen 하단에 tab bar가 있는 layout을 만듭니다. tab bar에는 **Home**과 **Settings** 두 개의 tab이 생깁니다:

**src/app/_layout.tsx** 파일을 사용해 앱의 루트 layout을 정의할 수 있습니다:

```tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
```

**(tabs)** 디렉터리는 Expo Router에 `Tabs` layout을 사용하라고 알려주는 특별한 디렉터리 이름입니다.

파일 구조를 보면 **(tabs)** 디렉터리 안에는 세 개의 파일이 있습니다. 첫 번째는 **(tabs)/_layout.tsx**입니다. 이 파일은 tab bar와 각 tab을 위한 메인 layout 파일입니다. 이 안에서 tab bar와 각 tab button의 모양과 동작을 제어할 수 있습니다.

```tsx
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}
```

마지막으로 tabs의 콘텐츠를 구성하는 두 개의 tab 파일인 **src/app/(tabs)/index.tsx**와 **src/app/(tabs)/settings.tsx**가 있습니다.

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

**index.tsx**라는 이름의 tab 파일은 앱이 로드될 때 기본 tab이 됩니다. 두 번째 tab 파일 **settings.tsx**는 tab bar에 더 많은 tab을 추가하는 방법을 보여줍니다.

## Tab bar options

Expo Router의 JavaScript tabs는 React Navigation의 [Bottom Tabs Navigator](https://reactnavigation.org/docs/bottom-tab-navigator)를 확장합니다. 사용 가능한 구체적인 API는 버전에 따라 달라집니다. 예를 들어 Expo Router v6는 Bottom Tabs Navigator v7을 확장합니다. 호환성을 보장하려면 버전을 확인한 뒤, 같은 configuration prop을 사용해 bottom tab bar와 개별 tab을 커스터마이징할 수 있습니다. 예를 들면:

```tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={
        {
          // Here to apply for all tabs
        }
      }>
      <Tabs.Screen
        name="index"
        options={
          {
            // Or here to apply for one tab
          }
        }
      />
    </Tabs>
  );
}
```

지원되는 tab bar option은 아래와 같습니다:

Tab bar options

| Option | Platform | Description |
| --- | --- | --- |
| `tabBarAccessibilityLabel` | Android, iOS | tab button의 accessibility label입니다. 사용자가 tab을 탭할 때 screen reader가 이 값을 읽습니다. tab에 label이 없다면 이 값을 설정하는 것을 권장합니다. |
| `tabBarActiveBackgroundColor` | Android, iOS | 활성 tab의 배경색입니다. |
| `tabBarActiveTintColor` | Android, iOS | 활성 tab의 icon과 label 색상입니다. |
| `tabBarBackground` | Android, iOS | tab bar 배경으로 사용할 React Element를 반환하는 함수입니다. 이미지, gradient, blur view 등을 렌더링할 수 있습니다:
```js
import { BlurView } from 'expo-blur';

// . .

<Tab.Navigator
  screenOptions={{
    tabBarStyle: { position: 'absolute' },
    tabBarBackground: () => (
      <BlurView tint="light" intensity={100} style={StyleSheet.absoluteFill} />
    ),
  }}
>
```

. `BlurView`를 사용할 때는 `tabBarStyle`에도 `position: 'absolute'`를 설정해야 합니다. 콘텐츠에 bottom padding을 추가하기 위해 `useBottomTabBarHeight`도 사용해야 할 수 있습니다. |
| `tabBarBadge` | Android, iOS | tab icon 위 badge에 표시할 text입니다. `string` 또는 `number`를 받을 수 있습니다. |
| `tabBarBadgeStyle` | Android, iOS | tab icon 위 badge의 style입니다. 여기서 배경색이나 text 색상을 지정할 수 있습니다. |
| `tabBarButton` | Android, iOS | tab bar button으로 렌더링할 React element를 반환하는 함수입니다. icon과 label을 감쌉니다. 기본적으로 `Pressable`을 렌더링합니다. 여기에 custom implementation을 지정할 수 있습니다:

```js
tabBarButton: (props) => <TouchableOpacity {. .props} />;
```

 |
| `tabBarButtonTestID` | Android, iOS | 테스트에서 이 tab button을 찾기 위한 ID입니다. |
| `tabBarHideOnKeyboard` | Android, iOS | keyboard가 열릴 때 tab bar를 숨길지 여부입니다. 기본값은 `false`입니다. |
| `tabBarIcon` | Android, iOS | `{ focused: boolean, color: string, size: number }`를 받아 tab bar에 표시할 React.Node를 반환하는 함수입니다. |
| `tabBarIconStyle` | Android, iOS | tab icon용 style object입니다. |
| `tabBarInactiveBackgroundColor` | Android, iOS | 비활성 tab의 배경색입니다. |
| `tabBarInactiveTintColor` | Android, iOS | 비활성 tab의 icon과 label 색상입니다. |
| `tabBarItemStyle` | Android, iOS | tab item container용 style object입니다. |
| `tabBarLabel` | Android, iOS | tab bar에 표시할 tab의 title 문자열 또는 `{ focused: boolean, color: string }`를 받아 tab bar에 표시할 React.Node를 반환하는 함수입니다. 정의되지 않으면 scene의 `title`이 사용됩니다. 숨기려면 `tabBarShowLabel`을 참고하세요. |
| `tabBarLabelPosition` | Android, iOS | label을 icon 아래에 표시할지, icon 옆에 표시할지 지정합니다. 기본적으로 위치는 기기 너비에 따라 자동으로 선택됩니다.

-   . `below-icon`: label이 icon 아래에 표시됩니다(일반적인 iPhone 동작)
-   . `beside-icon` label이 icon 옆에 표시됩니다(일반적인 iPad 동작)

 |
| `tabBarLabelStyle` | Android, iOS | tab label용 style object입니다. |
| `tabBarPosition` | Android, iOS | tab bar의 위치입니다. 사용 가능한 값은 다음과 같습니다:

-   `bottom` (기본값)
-   `top`
-   `left`
-   `right`

. tab bar가 `left` 또는 `right`에 배치되면 sidebar처럼 스타일링됩니다. 더 큰 screen에서는 sidebar를, 더 작은 screen에서는 bottom tab bar를 보여주고 싶을 때 유용합니다:

```js
<Tab.Navigator
  screenOptions={{
    tabBarPosition: dimensions.width < 600 ? 'bottom' : 'left',
    tabBarLabelPosition: 'below-icon',
  }}
>
```

 |
| `tabBarShowLabel` | Android, iOS | tab label을 표시할지 여부입니다. 기본값은 `true`입니다. |
| `tabBarStyle` | Android, iOS | tab bar용 style object입니다. 여기서 배경색 같은 스타일을 구성할 수 있습니다. screen을 tab bar 아래에 표시하려면 `position` style을 absolute로 설정할 수 있습니다:

```js
<Tab.Navigator
  screenOptions={{
    tabBarStyle: { position: 'absolute' },
  }}
>
```

. tab bar를 absolute positioned로 배치했다면 콘텐츠에 bottom margin을 추가해야 할 수도 있습니다. React Navigation은 이를 자동으로 처리하지 않습니다. 자세한 내용은 `useBottomTabBarHeight`를 참고하세요. |
| `tabBarVariant` | Android, iOS | tab bar의 variant입니다. 사용 가능한 값은 다음과 같습니다:

-   `uikit` (기본값) - tab bar는 iOS UIKit 가이드라인에 따라 스타일링됩니다.
-   `material` - tab bar는 Material Design 가이드라인에 따라 스타일링됩니다.

. 현재 `material` variant는 `tabBarPosition`이 `left` 또는 `right`로 설정된 경우에만 지원됩니다. |

추가 세부 정보와 navigator별 예시는 [React Navigation's Bottom Tabs Navigator documentation](https://reactnavigation.org/docs/bottom-tab-navigator/#options)을 참고하세요.

## Advanced

### Hiding a tab

때로는 route는 존재하지만 tab bar에는 나타나지 않게 하고 싶을 수 있습니다. button을 비활성화하려면 `href: null`을 전달하세요:

```tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
```

### Dynamic routes

tab bar 안에서 dynamic route를 사용할 수 있습니다. 예를 들어 사용자 profile을 보여주는 `[user]` tab이 있다고 해봅시다. `href` option을 사용해 특정 사용자의 profile로 연결할 수 있습니다.

```tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        // Name of the dynamic route.
        name="[user]"
        options={{
          // Ensure the tab always links to the same href.
          href: '/evanbacon',
          // OR you can use the href object.
          href: {
            pathname: '/[user]',
            params: {
              user: 'evanbacon',
            },
          },
        }}
      />
    </Tabs>
  );
}
```

> **Note**: tab layout에 dynamic route를 추가할 때는 정의한 dynamic route가 고유한지 확인하세요. 같은 dynamic route를 위한 screen 두 개를 둘 수는 없습니다. 예를 들어 `[user]` tab 두 개를 둘 수는 없습니다. 여러 dynamic route가 필요하다면 custom navigator를 만드세요.
