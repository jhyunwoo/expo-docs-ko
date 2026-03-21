---
modificationDate: March 01, 2026
title: 커스텀 tab layout
description: Expo Router에서 headless tab components를 사용해 커스텀 tab layout을 만드는 방법을 알아보세요.
---

# 커스텀 tab layout

Expo Router에서 headless tab components를 사용해 커스텀 tab layout을 만드는 방법을 알아보세요.

> SDK 52 이상에서 실험적으로 사용할 수 있습니다.

Expo Router는 [`expo-router/ui`](/versions/latest/sdk/router-ui) 서브모듈을 통해 커스텀 tab layout을 만들 수 있는 컴포넌트 집합을 제공합니다. React Navigation 스타일의 `Tabs`와 달리, 이 컴포넌트들은 스타일이 적용되어 있지 않고 유연합니다. 프로젝트에서 복잡한 UI 패턴을 처음부터 직접 만들 수 있도록 설계되었습니다.

다른 tab layout은 다음을 참고하세요:

[Native tabs](/router/advanced/native-tabs) — tab bar에 네이티브한 look and feel을 원한다면 native tabs를 확인하세요.

[JavaScript tabs](/router/advanced/tabs) — 이미 React Navigation의 tabs를 사용하고 있다면 JavaScript tabs를 확인하세요.

## 커스텀 Tabs 컴포넌트의 구성

`expo-router/ui`는 커스텀 tab layout을 만들기 위해 네 가지 컴포넌트를 제공합니다:

| Component | Description |
| --- | --- |
| `Tabs` | tabs를 위한 `<View>`를 포함하는 wrapper 컴포넌트입니다. |
| `TabList` | `TabTrigger` 컴포넌트 목록을 담는 `<View>`입니다. |
| `TabTrigger` | 지정된 tab으로 전환하는 trigger 컴포넌트입니다. `href` prop으로 route를 정의하고 각 tab의 `name`을 지정하는 데 사용됩니다. |
| `TabSlot` | 현재 선택된 tab을 렌더링하는 slot입니다. |

커스텀 tab layout의 가장 최소한 구조는 여기 보이는 것처럼 `TabList`(각 tab에 대한 `TabTrigger`를 포함)와a`TabSlot`으로 이루어지며, 모두 `Tabs` 컴포넌트 안에 있어야 합니다:

```tsx
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { Text } from 'react-native';

// Defining the layout of the custom tab navigator
export default function Layout() {
  return (
    <Tabs>
      <TabSlot />
      <TabList>
        <TabTrigger name="home" href="/">
          <Text>Home</Text>
        </TabTrigger>
        <TabTrigger name="article" href="/article">
          <Text>Article</Text>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}
```

## routes 만들기

`TabList`에는 tab navigator 안에서 사용할 수 있는 모든 routes가 들어 있습니다. 반드시 `Tabs`의 직계 자식이어야 합니다. 각 route는 `TabList` 안의 `TabTrigger`로 정의됩니다. `TabList` 안의 `TabTrigger`는 반드시 `name`과 `href` prop을 포함해야 합니다.

보통 `TabList`는 사용 가능한 tab routes와 tab의 모양을 모두 정의하며, 각 `TabTrigger`의 children은 각 tab button의 모양을 정의합니다.

> **참고:** `name`은 어떤 `string`이든 가능합니다. 이것은 tab을 가리키기 위해 사용하는 사용자 정의 이름입니다.

### Dynamic routes

Dynamic routes도 허용되며 `href`를 통해 값을 전달할 수 있습니다.

`_layout.tsx`

`[slug].tsx`

trigger `<TabTrigger name="dynamic page" href="/hello-world" />`는 params `{ slug: 'hello-world' }`를 가진 **[slug].tsx**용 tab을 만듭니다. 이 구성은 앱에서 각 사용자 프로필마다 별도의 tab을 보여주는 것처럼, 최종 사용자 데이터를 기반으로 tab bar에 임의 개수의 tabs를 표시할 때 유용할 수 있습니다.

### Ambiguous routes

`_layout.tsx`

`(one,two)`

 `route.tsx``shared group 안의 route`

`TabTrigger`에 제공하는 `href` 값은 항상 단일 route를 가리켜야 합니다. shared route의 위 예시에서는 href `/route`는 허용되지 않습니다. `/(one)/route`일 수도 있고 `/(two)/route`일 수도 있기 때문입니다. 하지만 href 안에 route group을 명시하면 동작합니다(예: `href="/(one)/route"`).

### Nested routes

`_layout.tsx`

`(stack-one)`

 `_layout.tsx``<Stack> layout`

 `(stack-two)`

  `_layout.tsx``중첩된 <Stack> layout`

  `route.tsx`

`TabTrigger`는 깊게 중첩된 route에도 연결할 수 있습니다. `<TabTrigger name="route" href="/route" />`는 **(stack-one)/(stack-two)/route.tsx** route를 보여줍니다. 이 tab은 해당 route의 부모 navigator(즉, **stack-two_layout.tsx** 안의 navigator)에 의해 제어됩니다. 이 내비게이션은 deep link와 비슷합니다.

## routes 렌더링하기

`TabSlot` 컴포넌트는 현재 route를 렌더링합니다. `TabSlot`은 `Tabs` 안에서 다른 컴포넌트 안에 중첩될 수는 있지만 `TabList` 안에 들어갈 수는 없습니다.

```tsx
<Tabs>
  <TabList>
    <TabTrigger name="home" href="/">
      <Text>Home</Text>
    </TabTrigger>
  </TabList>
  {/* Customize how `<TabSlot />` is rendered. */}
  <View>
    <View>
      <TabSlot />
    </View>
  </View>
</Tabs>
```

## tabs 전환하기

tabs는 `Link` 또는 imperative API를 통해 전환할 수 있습니다. 하지만 이 API들은 항상 내비게이션 동작을 수행합니다(tab을 전환하고 URL도 바꿀 수 있습니다). 아무 내비게이션도 수행하지 않고 tab만 전환하려면 `TabTrigger`를 사용해야 합니다. `TabTrigger`는 눌렀을 때 tab을 전환하는 스타일 없는 `<View>`이며, 텍스트나 컴포넌트를 `Link`로 감싸 눌릴 수 있는 내비게이션 요소로 만드는 방식과 비슷합니다.

### 내비게이션 초기화하기

`TabTrigger`의 `reset` prop은 tab이 언제 내비게이션 상태를 초기화할지 제어하는 데 사용할 수 있습니다. 옵션은 `always`, `onLongPress`, `never`입니다. 이는 tab 안에 중첩된 stack navigator에서 특히 유용합니다. 예를 들어 `<TabTrigger name="home" reset="always" />`는 사용자를 tab의 중첩 stack navigator 안 index route로 되돌립니다.

## TabTrigger

`TabTrigger`는 tabs를 전환하는 데 사용되지만, 동시에 어떤 routes가 tab으로 제공되는지도 정의하는 이중 역할을 가집니다.

### TabList 내부

`TabTrigger`를 `TabList`의 자식으로 사용하면, tab navigator 안에서 어떤 routes를 사용할 수 있는지 정의하게 됩니다. 이런 `TabTrigger`는 `name`과 `href` props를 모두 포함해야 합니다. 해당 tab의 URL과 tab을 가리키는 데 사용할 커스텀 이름을 정의하기 때문입니다. `TabTrigger` 컴포넌트가 text나 다른 컴포넌트를 children으로 가지고 있다면, 그것들이 tab buttons로 렌더링됩니다. 하지만 `TabList` 안의 `TabTrigger`를 UI 없이 정의해 둘 수도 있고, 그러면 이후 `TabList` 밖의 `TabTrigger`에서 이를 호출할 수 있습니다.

### TabList 외부

추가 `TabTrigger`를 `TabList` 밖에 정의하면, `TabList` 안에 정의된 `TabTrigger`와 동일한 동작을 수행할 수 있습니다. 이 경우 `TabTrigger`에는 `href` prop이 없습니다. 대신 동일한 `name` prop을 가진 기본 `TabTrigger`와 같은 동작을 수행합니다. 덕분에 현재 내비게이션 상태와 무관하게 tabs를 전환할 수 있는 컴포넌트를 만들 수 있습니다. 모든 `TabTrigger`는 최소한 `Tabs` 컴포넌트의 하위에 있어야 하며, 그렇지 않으면 tab navigator 밖에 있는 것으로 간주되어 이를 호출할 수 없습니다.

## 모양 커스터마이징하기

모든 컴포넌트는 스타일 없는 `<View>`로 렌더링되며, `TabTrigger`만 `<Pressable>`로 렌더링됩니다. 따라서 커스텀 `style` prop을 제공해 모양을 바꿀 수 있습니다. `TabList` 스타일링은 React Navigation에서 tab bar를 커스터마이징하는 것과 비슷하고, `TabTrigger` 스타일링은 tab button의 모양에 영향을 줍니다.

컴포넌트의 구조 자체를 바꿔야 한다면 `asChild` props를 사용해 내부 컴포넌트를 override할 수 있습니다. 이 경우 컴포넌트는 slot처럼 동작하며, 자신의 props를 직계 child로 전달합니다.

```tsx
<Tabs>
  <TabSlot />
  <TabList asChild>
    {/* Render a custom TabList */}
    <CustomTabList>
      <TabTrigger name="home" href="/">
        <Text>Home</Text>
      </TabTrigger>
    </CustomTabList>
  </TabList>
</Tabs>
```

```tsx
<Tabs>
  <TabSlot />
  <TabList asChild>
    <TabTrigger name="home" href="/" asChild>
      {/* Render a custom button */}
      <CustomButton>
        <Text>Home</Text>
      </CustomButton>
    </TabTrigger>
  </TabList>
</Tabs>
```

### Multiple tab bars

`TabList`는 `Tabs`의 구성과 기본 모양을 동시에 담당하지만, tab bar를 렌더링하는 유일한 방법은 아닙니다. `TabList`를 숨기면 `TabTrigger`를 사용해 커스텀 tab bars를 구성할 수 있습니다.

```tsx
<Tabs>
  <TabSlot />
  {/* A custom tab bar */}
  <View>
    <View>
      <TabTrigger name="home">
        <Text>Home</Text>
      </TabTrigger>
      <TabTrigger name="article">
        <Text>article</Text>
      </TabTrigger>
    </View>
  </View>
  <TabList style={{ display: 'none' }}>
    <TabTrigger name="home" href="/">
      <Text>Home</Text>
    </TabTrigger>
    <TabTrigger name="article" href="/article">
      <Text>article</Text>
    </TabTrigger>
  </TabList>
</Tabs>
```

`TabTrigger`는 `isFocused` prop을 전달하므로, focus 상태에 반응하는 별도의 tab button 컴포넌트를 만들 수 있습니다.

```tsx
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { TabTriggerSlotProps } from 'expo-router/ui';
import { ComponentProps, Ref } from 'react';
import { Text, Pressable, View } from 'react-native';

type Icon = ComponentProps<typeof FontAwesome>['name'];

export type TabButtonProps = TabTriggerSlotProps & {
  icon?: Icon;
  ref: Ref<View>;
};

export function TabButton({ icon, children, isFocused, ...props }: TabButtonProps) {
  return (
    <Pressable
      {...props}
      style={[
        {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 5,
          padding: 10,
        },
        isFocused ? { backgroundColor: 'white' } : undefined,
      ]}>
      <FontAwesome name={icon} />
      <Text style={[{ fontSize: 16 }, isFocused ? { color: 'white' } : undefined]}>{children}</Text>
    </Pressable>
  );
}
```

Expo SDK 52 / React 18 및 이전 버전

Expo SDK 52 및 이전 버전(React 18)에서는 `ref` 핸들에 접근하려면 레거시 `forwardRef` 함수를 사용하세요.

### Hooks

모든 컴포넌트에는 렌더 트리를 제어할 수 있는 hook 버전도 있습니다. 사용 가능한 hook 전체 목록은 [Router UI Reference](/versions/latest/sdk/router-ui)를 참고하세요.

hooks 사용은 이 라이브러리의 고급 사용 방식으로 간주됩니다. 대부분의 사용 사례에서는 컴포넌트에 `asChild`를 사용하는 것만으로도 렌더 트리를 충분히 제어할 수 있습니다.

커스텀 `<TabTrigger />`를 개발 중이라면, `<TabList />`도 커스텀으로 개발해야 할 수 있습니다. `<TabList />`는 exported `<TabTrigger />` 컴포넌트를 사용해야 하는 [`useTabsWithChildren()`](/versions/latest/sdk/router-ui#usetabswithchildrenoptions)을 사용하기 때문입니다.

### tab screen 렌더링 방식 커스터마이징하기

`TabSlot`은 `renderFn` 속성을 받습니다. 이 함수는 screen이 렌더링되는 방식을 override하는 데 사용할 수 있어, 애니메이션이나 screen 유지/언마운트 같은 고급 기능을 구현할 수 있습니다. 자세한 내용은 [Router UI Reference](/versions/latest/sdk/router-ui)를 참고하세요.

## 자주 묻는 질문

같은 route에 대해 여러 tabs를 만들려면 어떻게 하나요?

`_layout.tsx``Tabs layout`

`(movie,tv)`

 `[id].tsx`

route를 shared group에 추가하고 각 `group`마다 별도의 `TabTrigger`를 만들어야 합니다.

tab을 숨기려면 어떻게 하나요?

`TabTrigger`를 렌더링하지 않으면 해당 tab(및 그 내비게이션 상태)이 앱에서 제거됩니다.

animated tabs는 어떻게 만들 수 있나요?

`TabSlot`에 커스텀 renderer를 제공해 screen 렌더링 방식을 바꿀 수 있습니다. 이를 사용하면 screen이 focus되었는지 감지하고 그에 맞게 애니메이션을 적용할 수 있습니다.

relative hrefs를 사용할 수 있나요?

`directory`

 `_layout.tsx``로컬 pathname은 /directory`

 `page.tsx``pathname은 /directory/page`

 `profile.tsx``pathname은 /directory/profile`

relative href를 가진 `TabTrigger`는 `Tabs`가 렌더링된 로컬 path name을 기준으로 합니다. 이는 현재 표시 중인 route를 기준으로 하는 일반적인 relative href와는 다릅니다. 예를 들어 `<TabTrigger href="./profile" />`는 `/directory/page` route가 표시 중이더라도 `/directory/profile`로 해석됩니다. Expo는 relative href 사용을 권장하지 않습니다.
