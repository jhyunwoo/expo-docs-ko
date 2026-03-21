---
modificationDate: February 26, 2026
title: Stack
description: Expo Router에서 Stack navigator를 사용하는 방법을 알아보세요.
---

# Stack

Expo Router에서 Stack navigator를 사용하는 방법을 알아보세요.

[Using a Stack Navigator with Expo Router](https://www.youtube.com/watch?v=izZv6a99Roo) — screen 사이를 이동하고, screen 간에 param을 전달하고, dynamic route를 만들고, screen title과 animation을 구성하는 방법을 알아보세요.

stack navigator는 앱에서 route 사이를 이동하는 가장 기본적인 방식입니다. Android에서는 쌓인 route가 현재 screen 위로 animation되며, iOS에서는 오른쪽에서 animation되어 들어옵니다. Expo Router는 navigation stack을 만들고 앱에 새 route를 추가할 수 있게 해주는 `Stack` navigation component를 제공합니다.

이 가이드는 프로젝트에서 `Stack` navigator를 만드는 방법과 개별 route의 option 및 header를 커스터마이징하는 방법을 설명합니다.

## Get started

file-based routing을 사용해 stack navigator를 만들 수 있습니다. 다음은 예시 파일 구조입니다:

`src`

 `app`

  `_layout.tsx`

  `index.tsx`

  `details.tsx`

이 파일 구조는 `index` route가 stack의 첫 번째 route가 되고, 이동 시 `details` route가 `index` route 위로 push되는 layout을 만듭니다.

**src/app/_layout.tsx** 파일을 사용해 다음 두 route로 앱의 `Stack` navigator를 정의할 수 있습니다:

```tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return <Stack />;
}
```

## Screen options and header configuration

SDK 55부터는 options 기반 API 또는 새로운 composition components API를 사용해 screen option과 header를 구성할 수 있습니다. 두 API는 프로젝트 안에서 서로 바꿔 써도 됩니다.

### Statically configure route options

layout component route 안에서 `<Stack.Screen name={routeName} />` component를 사용해 route option을 정적으로 구성할 수 있습니다.

```tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      {/* Optionally configure static options outside the route.*/}
      <Stack.Screen name="home" options={{}} />
    </Stack>
  );
}
```

### Configure header bar

`screenOptions` prop을 사용하면 `Stack` navigator 안의 모든 route에 대해 header bar를 구성할 수 있습니다. 모든 route에 공통 header 스타일을 설정할 때 유용합니다.

```tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    />
  );
}
```

### Set screen options dynamically

route option을 동적으로 구성하려면 composition components 또는 options 기반 API를 사용할 수 있습니다.

```tsx
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function Details() {
  const router = useRouter();
  const params = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: params.name,
          headerStyle: { backgroundColor: 'lightblue' },
        }}
      />
      <Text
        onPress={() => {
          router.setParams({ name: 'Updated' });
        }}>
        Update the title
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

### Available header options

`Stack` navigator는 포괄적인 header configuration option을 지원합니다. 아래는 사용할 수 있는 모든 header 관련 option입니다:

Header options

| Option | Platform | Description |
| --- | --- | --- |
| `header` | Android, iOS | 기본 header 대신 사용할 custom header입니다. header로 표시할 React Element를 반환하는 함수를 받습니다. 이 함수는 다음 속성을 포함한 object를 인수로 받습니다:
-   `navigation` - 현재 screen의 navigation object.
-   `route` - 현재 screen의 route object.
-   `options` - 현재 screen의 options
-   `back` - back button용 options으로, back button label에 사용할 `title` 속성이 있는 object를 포함합니다.

. navigator의 모든 screen에 custom header를 설정하려면 navigator의 `screenOptions` prop에서 이 option을 지정하면 됩니다. custom header를 지정하면 large title, search bar 같은 네이티브 기능은 동작하지 않는다는 점에 유의하세요. |
| `headerBackButtonDisplayMode` | iOS | back button에 icon과 title을 어떻게 표시할지 지정합니다. 지원하는 값은 다음과 같습니다:

-   "default" - 사용 가능한 공간에 따라 이전 screen의 title, 일반 title(예: 'Back'), title 없음(icon만) 중 하나를 표시합니다.
-   "generic" – 사용 가능한 공간에 따라 일반 title(예: 'Back') 또는 title 없음(icon만)을 표시합니다.
-   "minimal" – title 없이 icon만 항상 표시합니다.

. 다음 경우에는 공간 인식 동작이 비활성화됩니다:

-   iOS 버전이 13 이하일 때
-   custom font family 또는 size가 설정된 경우(예: `headerBackTitleStyle` 사용)
-   back button menu가 비활성화된 경우(예: `headerBackButtonMenuEnabled` 사용)

. 이런 경우에는 항상 고정된 title과 icon이 표시됩니다. |
| `headerBackButtonMenuEnabled` | iOS | iOS >= 14에서 back button을 길게 눌렀을 때 menu를 표시할지 여부를 나타내는 boolean입니다. 기본값은 `true`입니다. |
| `headerBackground` | Android, iOS | header 배경으로 렌더링할 React Element를 반환하는 함수입니다. 이미지나 gradient 같은 배경을 사용할 때 유용합니다. |
| `headerBackImageSource` | Android, iOS | header의 back button icon으로 표시할 이미지입니다. 기본값은 플랫폼의 back icon 이미지입니다

-   iOS에서는 chevron
-   Android에서는 arrow

 |
| `headerBackTitle` | iOS | iOS에서 back button에 사용할 title 문자열입니다. 기본값은 이전 scene의 title, "Back", 또는 사용 가능한 공간에 따라 arrow icon입니다. 제한 사항과 동작 커스터마이징은 `headerBackButtonDisplayMode`를 참고하세요. 숨기려면 `headerBackButtonDisplayMode: "minimal"`을 사용하세요. |
| `headerBackTitleStyle` | iOS | header back title용 style object입니다. 지원하는 속성:

-   `fontFamily`
-   `fontSize`

 |
| `headerBackVisible` | Android, iOS | header에서 back button이 보이는지 여부입니다. `headerLeft`를 지정한 경우에도 back button을 함께 표시하는 데 사용할 수 있습니다. stack의 첫 번째 screen에는 영향을 주지 않습니다. |
| `headerBlurEffect` | iOS | translucent header에 적용할 blur effect입니다. 이 option이 동작하려면 `headerTransparent` option을 `true`로 설정해야 합니다. 지원하는 값: `extraLight`, `light`, `dark`, `regular`, `prominent`, `systemUltraThinMaterial`, `systemThinMaterial`, `systemMaterial`, `systemThickMaterial`, `systemChromeMaterial`, `systemUltraThinMaterialLight`, `systemThinMaterialLight`, `systemMaterialLight`, `systemThickMaterialLight`, `systemChromeMaterialLight`, `systemUltraThinMaterialDark`, `systemThinMaterialDark`, `systemMaterialDark`, `systemThickMaterialDark`, `systemChromeMaterialDark` |
| `headerLargeStyle` | iOS | large title이 표시될 때의 header style입니다. `headerLargeTitle`이 `true`이고 scroll 가능한 콘텐츠의 가장자리가 header의 대응 가장자리에 닿으면 large title이 표시됩니다. 지원하는 속성:

-   backgroundColor

 |
| `headerLargeTitle` | iOS | scroll 시 일반 header로 접히는 large title header를 활성화할지 여부입니다. 기본값은 `false`입니다. scroll 시 large title이 접히려면 screen의 콘텐츠를 `ScrollView`나 `FlatList` 같은 scroll 가능한 view로 감싸야 합니다. scroll 영역이 screen을 가득 채우지 않으면 large title은 scroll에 따라 접히지 않습니다. 또한 `ScrollView`, `FlatList` 등에 `contentInsetAdjustmentBehavior="automatic"`을 지정해야 합니다. |
| `headerLargeTitleShadowVisible` | Android, iOS | large title이 표시될 때 header의 drop shadow가 보일지 여부입니다. |
| `headerLargeTitleStyle` | iOS | header 안의 large title용 style object입니다. 지원하는 속성:

-   `fontFamily`
-   `fontSize`
-   `fontWeight`
-   `color`

 |
| `headerLeft` | Android, iOS | header 왼쪽에 표시할 React Element를 반환하는 함수입니다. 이것은 back button을 대체합니다. back button을 왼쪽 요소와 함께 표시하려면 `headerBackVisible`을 참고하세요. 인수로 다음 속성을 받습니다:

-   `tintColor` - 적용할 tint color. 기본값은 theme의 primary color입니다.
-   `canGoBack` - 뒤로 갈 screen이 있는지 여부를 나타내는 boolean입니다.
-   `label` - button용 label text입니다. 보통 이전 screen의 title입니다.
-   `href` - web에서 anchor tag에 사용할 `href`

 |
| `headerRight` | Android, iOS | header 오른쪽에 표시할 React Element를 반환하는 함수입니다. 인수로 다음 속성을 받습니다:

-   `tintColor` - 적용할 tint color. 기본값은 theme의 primary color입니다.
-   `canGoBack` - 뒤로 갈 screen이 있는지 여부를 나타내는 boolean입니다.

 |
| `headerSearchBarOptions` | iOS | iOS에서 네이티브 search bar를 렌더링하는 option입니다. search bar는 정적인 경우가 드물기 때문에 보통 component 본문에서 `headerSearchBarOptions` navigation option에 object를 전달해 제어합니다. 또한 `ScrollView`, `FlatList` 등에 `contentInsetAdjustmentBehavior="automatic"`을 지정해야 합니다. `ScrollView`가 없다면 `headerTransparent: false`를 지정하세요. 지원하는 속성은 다음과 같습니다: . **ref** . search input을 imperative하게 제어하는 ref입니다. 다음 method를 포함합니다:

-   `focus` - search bar에 focus를 줍니다
-   `blur` - focus를 제거합니다
-   `setText` - search bar 내용을 주어진 값으로 설정합니다
-   `clearText` - search bar input field에 있는 텍스트를 제거합니다
-   `cancelSearch` - search를 취소하고 search bar를 닫습니다

. **autoCapitalize** . 사용자가 입력할 때 텍스트를 자동으로 대문자화할지 제어합니다. 가능한 값:

-   `none`
-   `words`
-   `sentences`
-   `characters`

. 기본값은 `sentences`입니다. **autoFocus** . 표시될 때 search bar에 자동으로 focus를 줄지 여부입니다. 기본값은 `false`입니다. **barTintColor** . search field 배경색입니다. 기본적으로 bar tint color는 반투명입니다. **tintColor** . cursor caret과 cancel button text의 색상입니다. **cancelButtonText** . 기본 `Cancel` button text 대신 사용할 text입니다. **disableBackButtonOverride** . back button이 search bar의 text input을 닫을지 여부입니다. 기본값은 `false`입니다. **hideNavigationBar** . searching 중 navigation bar를 숨길지 여부를 나타내는 boolean입니다. 기본값은 `true`입니다. **hideWhenScrolling** . scrolling할 때 search bar를 숨길지 여부를 나타내는 boolean입니다. 기본값은 `true`입니다. **inputType** . input 유형입니다. 기본값은 `"text"`입니다. 지원하는 값: `"text"`, `"phone"`, `"number"`, `"email"` . **obscureBackground** . 아래 콘텐츠를 반투명 overlay로 가릴지 여부를 나타내는 boolean입니다. 기본값은 `true`입니다. **placeholder** . search field가 비어 있을 때 표시되는 text입니다. **textColor** . search field 안 text의 색상입니다. **hintTextColor** . search field 안 hint text의 색상입니다. **headerIconColor** . header에 표시되는 search 및 close icon의 색상입니다 . **shouldShowHintSearchIcon** . search bar에 focus가 있을 때 search hint icon을 표시할지 여부입니다. 기본값은 `true`입니다. **onBlur** . search bar가 focus를 잃을 때 호출되는 callback입니다. **onCancelButtonPress** . cancel button을 눌렀을 때 호출되는 callback입니다. **onChangeText** . text가 바뀔 때 호출되는 callback입니다. search bar의 현재 text 값을 받습니다. |
| `headerShadowVisible` | Android, iOS | header의 elevation shadow(Android) 또는 하단 border(iOS)를 숨길지 여부입니다. |
| `headerShown` | Android, iOS | header를 표시할지 여부입니다. header는 기본적으로 표시됩니다. `false`로 설정하면 header가 숨겨집니다. |
| `headerStyle` | Android, iOS | header용 style object입니다. 지원하는 속성:

-   `backgroundColor`

 |
| `headerTintColor` | Android, iOS | header용 tint color입니다. back button과 title의 색상을 변경합니다. |
| `headerTitle` | Android, iOS | header에 사용할 문자열 또는 React Element를 반환하는 함수입니다. 기본값은 `title` 또는 screen 이름입니다. 함수를 전달하면 options object의 인수로 `tintColor`와 `children`을 받습니다. title 문자열은 `children`으로 전달됩니다. 함수를 전달해 custom element를 렌더링하면 title animation은 동작하지 않는다는 점에 유의하세요. |
| `headerTitleAlign` | Android, iOS | header title 정렬 방식입니다. 가능한 값:

-   . `left`
-   . `center`

. 기본값은 iOS 외 플랫폼에서 `left`입니다. iOS에서는 지원되지 않습니다. iOS에서는 항상 `center`이며 변경할 수 없습니다. |
| `headerTitleStyle` | Android, iOS | header title용 style object입니다. 지원하는 속성:

-   `fontFamily`
-   `fontSize`
-   `fontWeight`
-   `color`

 |
| `headerTransparent` | Android, iOS | navigation bar가 반투명인지 나타내는 boolean입니다. 기본값은 `false`입니다. `true`로 설정하면 header가 absolute positioned 상태가 되어 screen 위에 떠서 아래 콘텐츠와 겹치며, `headerStyle`에서 따로 지정하지 않았다면 배경색이 `transparent`로 바뀝니다. 반투명 header나 blur 배경을 렌더링하려 할 때 유용합니다. 콘텐츠가 header 아래에 보이지 않게 하려면 콘텐츠에 직접 top margin을 추가해야 합니다. React Navigation이 자동으로 처리해주지 않습니다. header 높이를 얻으려면 React의 Context API와 함께 `HeaderHeightContext` 또는 `useHeaderHeight`를 사용할 수 있습니다. |
| `title` | Android, iOS | `headerTitle`의 fallback으로 사용할 수 있는 문자열입니다. |
| `unstable_headerLeftItems` | iOS | 이 option은 실험적이며 minor release에서 바뀔 수 있습니다. header 왼쪽에 표시할 item 배열을 반환하는 함수입니다. 둘 다 지정하면 `headerLeft`보다 이 option이 우선합니다. 인수로 다음 속성을 받습니다:

-   `tintColor` - 적용할 tint color. 기본값은 theme의 primary color입니다.
-   `canGoBack` - 뒤로 갈 screen이 있는지 여부를 나타내는 boolean입니다.

. 자세한 내용은 Header items를 참고하세요. |
| `unstable_headerRightItems` | iOS | 이 option은 실험적이며 minor release에서 바뀔 수 있습니다. header 오른쪽에 표시할 item 배열을 반환하는 함수입니다. 둘 다 지정하면 `headerRight`보다 이 option이 우선합니다. 인수로 다음 속성을 받습니다:

-   `tintColor` - 적용할 tint color. 기본값은 theme의 primary color입니다.
-   `canGoBack` - 뒤로 갈 screen이 있는지 여부를 나타내는 boolean입니다.

. 자세한 내용은 Header items를 참고하세요. |

추가 세부 정보와 navigator별 예시는 [React Navigation's Native Stack Navigator documentation](https://reactnavigation.org/docs/native-stack-navigator)을 참고하세요.

### Header buttons

`headerLeft`, `headerRight` option 또는 `<Stack.Toolbar>` component를 사용해 header에 button을 추가할 수 있습니다. 이 option들은 header에 렌더링되는 React component를 받습니다.

[Stack Toolbar](/router/advanced/stack-toolbar) — Liquid Glass 지원과 함께 iOS header toolbar를 구성합니다.

```tsx
import { Stack } from 'expo-router';
import { Button, Text, Image, StyleSheet } from 'react-native';
import { useState } from 'react';

function LogoTitle() {
  return (
    <Image style={styles.image} source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} />
  );
}

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: props => <LogoTitle {...props} />,
          headerRight: () => <Button onPress={() => setCount(c => c + 1)} title="Update count" />,
        }}
      />
      <Text>Count: {count}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
  },
});
```

### Other screen options

animation, gesture, 기타 configuration을 포함한 다른 모든 screen option의 전체 목록은 다음과 같습니다:

Screen options

| Option | Platform | Description |
| --- | --- | --- |
| `animation` | Android | screen이 push 또는 pop될 때 animation되는 방식입니다. 지원하는 값: `default`, `fade`, `fade_from_bottom`, `flip`, `simple_push`, `slide_from_bottom`, `slide_from_right`, `slide_from_left`, `none` |
| `animationDuration` | iOS | iOS에서 `slide_from_bottom`, `fade_from_bottom`, `fade`, `simple_push` transition의 duration(밀리초)을 바꿉니다. 기본값은 `350`입니다. `default`와 `flip` transition의 duration은 커스터마이징할 수 없습니다. |
| `animationMatchesGesture` | iOS | dismiss gesture가 `animation` prop에 제공된 animation을 사용할지 여부입니다. 기본값은 `false`입니다. modal로 표시되는 screen의 동작에는 영향을 주지 않습니다. |
| `animationTypeForReplace` | Android, iOS | 이 screen이 다른 screen을 대체할 때 사용할 animation 유형입니다. 기본값은 `push`입니다. 지원하는 값: `push`, `pop` |
| `autoHideHomeIndicator` | iOS | home indicator가 숨겨진 상태를 선호할지 여부를 나타내는 boolean입니다. 기본값은 `false`입니다. |
| `contentStyle` | Android, iOS | scene content용 style object입니다. |
| `freezeOnBlur` | iOS | 비활성 screen의 재렌더링을 막을지 여부를 나타내는 boolean입니다. 기본값은 `false`입니다. 애플리케이션 최상단에서 `react-native-screens` package의 `enableFreeze()`를 실행하면 기본값이 `true`가 됩니다. iOS와 Android에서만 지원됩니다. |
| `fullScreenGestureEnabled` | iOS | dismiss gesture가 screen 전체에서 동작할지 여부입니다. 이 option과 함께 dismiss gesture를 사용하면 `simple_push`와 같은 transition animation이 적용됩니다. 이 동작은 `customAnimationOnGesture` prop을 설정해 바꿀 수 있습니다. 플랫폼 제한 때문에 기본 iOS animation을 구현하는 것은 불가능합니다. 기본값은 `false`입니다. modal로 표시되는 screen의 동작에는 영향을 주지 않습니다. |
| `fullScreenGestureShadowEnabled` | Android, iOS | 전체 screen dismiss gesture에 transition 중 view 아래 shadow를 표시할지 여부입니다. 기본값은 `true`입니다. `fullScreenGestureEnabled` prop으로 활성화된 gesture를 사용하지 않는 transition의 동작에는 영향을 주지 않습니다. |
| `gestureDirection` | iOS | screen을 dismiss하기 위해 swipe해야 하는 방향을 설정합니다. 지원하는 값: `vertical`, `horizontal` . `vertical` option을 사용하면 `fullScreenGestureEnabled: true`, `customAnimationOnGesture: true`, `animation: 'slide_from_bottom'`이 기본으로 설정됩니다. |
| `gestureEnabled` | iOS | gesture를 사용해 이 screen을 dismiss할 수 있는지 여부입니다. 기본값은 `true`입니다. |
| `navigationBarColor` | Android | 이 option은 deprecated이며 향후 릴리스에서 제거될 예정입니다(Android SDK 35 이상을 타깃하는 앱은 edge-to-edge mode가 기본적으로 활성화되며, 향후 SDK에서 edge-to-edge가 강제될 예정입니다. 자세한 내용은 here 참고). navigation bar 색상을 설정합니다. 기본값은 초기 status bar 색상입니다. |
| `navigationBarHidden` | Android | navigation bar를 숨길지 여부를 나타내는 boolean입니다. 기본값은 `false`입니다. |
| `orientation` | Android | screen에 사용할 display orientation입니다. 지원하는 값: `default`, `all`, `portrait`, `portrait_up`, `portrait_down`, `landscape`, `landscape_left`, `landscape_right` |
| `presentation` | Android | screen을 어떤 방식으로 표시할지 지정합니다. 지원하는 값: `card`, `modal`, `transparentModal`, `containedModal`, `containedTransparentModal`, `fullScreenModal`, `formSheet` |
| `sheetAllowedDetents` | Android | `presentation`이 `formSheet`일 때만 동작합니다. sheet가 멈출 수 있는 높이를 설명합니다. 지원하는 값: `fitToContents` . 기본값은 `[1.0]`입니다. |
| `sheetCornerRadius` | Android | `presentation`이 `formSheet`일 때만 동작합니다. sheet가 렌더링하려는 corner radius입니다. 음수가 아닌 값을 설정하면 제공된 radius로 sheet를 렌더링하려고 시도하고, 그렇지 않으면 시스템 기본값을 적용합니다. 설정하지 않으면 시스템 기본값이 사용됩니다. |
| `sheetElevation` | Android | `presentation`이 `formSheet`일 때만 동작합니다. sheet 상단 edge의 shadow에 영향을 주는 elevation을 나타내는 integer 값입니다. 동적이지 않으므로 component가 렌더링된 뒤 값을 바꿔도 효과가 없습니다. 기본값은 `24`입니다. |
| `sheetExpandsWhenScrolledToEdge` | iOS | `presentation`이 `formSheet`일 때만 동작합니다. 스크롤할 때 sheet가 더 큰 detent로 확장될지 여부입니다. 기본값은 `true`입니다. 이 상호작용이 동작하려면 ScrollView가 Screen component의 "first-subview-chain" 자손이어야 한다는 점에 유의하세요. 이는 플랫폼 요구 사항 때문입니다. |
| `sheetGrabberVisible` | iOS | `presentation`이 `formSheet`일 때만 동작합니다. sheet 상단에 grabber를 표시할지 여부를 나타내는 boolean입니다. 기본값은 `false`입니다. |
| `sheetInitialDetentIndex` | Android | `presentation`이 `formSheet`일 때만 동작합니다. sheet가 열린 뒤 확장해야 하는 detent의 **index**입니다. 지정한 index가 `sheetAllowedDetents` 배열 범위를 벗어나면 dev 환경에서는 더 많은 error가 발생하고, production에서는 값이 기본값으로 재설정됩니다. 추가로 `last` 값을 사용할 수 있으며, 이 값을 설정하면 sheet는 처음에 마지막(가장 큰) detent로 확장됩니다. 기본값은 `0`으로, detents 배열의 첫 번째 detent를 의미합니다. |
| `sheetLargestUndimmedDetentIndex` | Android | `presentation`이 `formSheet`일 때만 동작합니다. 이 값보다 큰 detent가 아니면 아래 view가 어둡게 처리되지 않는 가장 큰 sheet detent입니다. 이 prop은 number로 설정할 수 있으며, `sheetAllowedDetents` 배열에서 sheet 아래 dimming view를 표시하지 않을 detent의 index를 뜻합니다. 추가로 다음 option도 사용할 수 있습니다:
-   `none` - 모든 detent level에서 dimming view가 표시됩니다,
-   `last` - 어떤 detent level에서도 dimming view가 표시되지 않습니다.

. 기본값은 `none`이며, dimming view가 항상 있어야 함을 의미합니다. |
| `statusBarAnimation` | Android | status bar animation을 설정합니다(`StatusBar` component와 유사). 기본값은 iOS에서 `fade`, Android에서 `none`입니다. 지원하는 값: `"fade"`, `"none"`, `"slide"` . Android에서 `fade`나 `slide`를 설정하면 status bar 색상 transition이 설정됩니다. iOS에서는 이 option이 status bar의 appearance animation에 적용됩니다. `Info.plist` 파일에서 `View controller-based status bar appearance -> YES`를 설정하거나(또는 해당 config를 제거해) 사용해야 합니다. |
| `statusBarBackgroundColor` | Android | 이 option은 deprecated이며 향후 릴리스에서 제거될 예정입니다(Android SDK 35 이상을 타깃하는 앱은 edge-to-edge mode가 기본적으로 활성화되며, 향후 SDK에서 edge-to-edge가 강제될 예정입니다. 자세한 내용은 here 참고). status bar 배경색을 설정합니다(`StatusBar` component와 유사). |
| `statusBarHidden` | Android | 이 screen에서 status bar를 숨길지 여부입니다. `Info.plist` 파일에서 `View controller-based status bar appearance -> YES`를 설정하거나(또는 해당 config를 제거해) 사용해야 합니다. |
| `statusBarStyle` | Android | status bar 색상을 설정합니다(`StatusBar` component와 유사). 지원하는 값: `"auto"`, `"inverted"`, `"dark"`, `"light"` . 기본값은 iOS에서 `auto`, Android에서 `light`입니다. `Info.plist` 파일에서 `View controller-based status bar appearance -> YES`를 설정하거나(또는 해당 config를 제거해) 사용해야 합니다. |
| `statusBarTranslucent` | Android | 이 option은 deprecated이며 향후 릴리스에서 제거될 예정입니다(Android SDK 35 이상을 타깃하는 앱은 edge-to-edge mode가 기본적으로 활성화되며, 향후 SDK에서 edge-to-edge가 강제될 예정입니다. 자세한 내용은 here 참고). status bar의 translucency를 설정합니다(`StatusBar` component와 유사). 기본값은 `false`입니다. |
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
| `tabBarBadgeStyle` | Android, iOS | tab icon 위 badge의 style입니다. 여기에서 배경색이나 text 색상을 지정할 수 있습니다. |
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

추가 세부 정보와 navigator별 예시는 [React Navigation's Native Stack Navigator documentation](https://reactnavigation.org/docs/native-stack-navigator)을 참고하세요.

## Custom push behavior

기본적으로 `Stack` navigator는 이미 stack 안에 있는 route를 push할 때 중복 screen을 제거합니다. 예를 들어 같은 screen을 두 번 push하면 두 번째 push는 무시됩니다. 이 push 동작은 `<Stack.Screen>`에 custom `getId()` 함수를 제공해 바꿀 수 있습니다.

예를 들어 다음 layout 구조의 `index` route는 앱의 서로 다른 사용자 profile 목록을 보여줍니다. 앱 사용자가 profile 상세로 이동할 수 있도록 `[details]` route를 [dynamic route](/router/basics/notation#square-brackets)로 만들어봅시다.

`src`

 `app`

  `_layout.tsx`

  `index.tsx`

  `[details].tsx``'/details1'`처럼 dynamic path와 일치합니다

`Stack` navigator는 앱 사용자가 다른 profile로 이동할 때마다 새 screen을 push하려고 하지만 실패합니다. 매번 새로운 ID를 반환하는 `getId()` 함수를 제공하면, 앱 사용자가 profile로 이동할 때마다 `Stack`이 새로운 screen을 push하게 됩니다.

push 동작을 바꾸려면 layout component route 안에서 `<Stack.Screen name="[profile]" getId={}>` component를 사용할 수 있습니다:

```tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="[profile]"
        getId={
          ({ params }) => String(Date.now())
        }
      />
    </Stack>
  );
}
```

## Removing stack screens

stack에서 하나 이상의 route를 dismiss하고 제거할 때 사용할 수 있는 action은 여러 가지가 있습니다.

### `dismiss` action

가장 가까운 stack의 마지막 screen을 dismiss합니다. 현재 screen이 stack 안의 유일한 route라면 stack 전체를 dismiss합니다.

양수를 선택적으로 전달해 지정한 개수만큼의 screen을 dismiss할 수 있습니다.

Dismiss는 가장 가까운 stack을 대상으로 하고 현재 navigator를 대상으로 하지 않는다는 점에서 `back`과 다릅니다. 중첩 navigator가 있다면 `dismiss`를 호출할 때 여러 screen 뒤로 이동할 수 있습니다.

```tsx
import { Button, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function Settings() {
  const router = useRouter();

  const handleDismiss = (count: number) => {
    router.dismiss(count)
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Go to first screen" onPress={() => handleDismiss(3)} />
    </View>
  );
}
```

### `dismissTo` action

> `dismissTo`는 Expo Router `4.0.8`에 추가되었습니다. Expo Router v3의 `navigation` function과 비슷하게 동작합니다.

지정한 `Href`에 도달할 때까지 현재 `<Stack />`의 screen들을 dismiss합니다. history에 해당 `Href`가 없으면 대신 `push` action이 수행됩니다.

예를 들어 `/one`, `/two`, `/three` route의 history가 있고 현재 route가 `/three`라고 해봅시다. `router.dismissTo('/one')` action은 history를 두 번 뒤로 이동시키고, `router.dismissTo('/four')`는 history를 앞으로 `push`해 `/four` route로 이동시킵니다.

```tsx
import { Button, View, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function Settings() {
  const router = useRouter();

  const handleDismissAll = () => {
    router.dismissTo('/')
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Go to first screen" onPress={handleDismissAll} />
    </View>
  );
}
```

### `dismissAll` action

가장 가까운 stack의 첫 번째 screen으로 돌아갑니다. 이는 [`popToTop`](https://reactnavigation.org/docs/stack-actions/#poptotop) stack action과 비슷합니다.

예를 들어 `home` route가 첫 번째 screen이고 `settings`가 마지막이라면, `settings`에서 `home` route로 가려면 `details`로 되돌아가야 합니다. 하지만 `dismissAll` action을 사용하면 `settings`에서 `home`으로 바로 이동하면서 그 사이 screen을 모두 dismiss할 수 있습니다.

```tsx
import { Button, View, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function Settings() {
  const router = useRouter();

  const handleDismissAll = () => {
    router.dismissAll()
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Go to first screen" onPress={handleDismissAll} />
    </View>
  );
}
```

### `canDismiss` action

현재 screen을 dismiss할 수 있는지 확인합니다. router가 history에 둘 이상의 screen이 있는 stack 안에 있으면 `true`를 반환합니다.

```tsx
import { Button, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function Settings() {
  const router = useRouter();

  const handleDismiss = (count: number) => {
    if (router.canDismiss()) {
      router.dismiss(count)
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Maybe dismiss" onPress={() => handleDismiss()} />
    </View>
  );
}
```

## Relation with Native Stack Navigator

Expo Router의 `Stack` navigator는 React Navigation의 [Native Stack Navigator](https://reactnavigation.org/docs/native-stack-navigator)를 감싼 wrapper입니다. Native Stack Navigator에서 사용할 수 있는 option은 Expo Router의 `Stack` navigator에서도 모두 사용할 수 있습니다.

### JavaScript stack with @react-navigation/stack

`@react-navigation/stack` 라이브러리를 `withLayoutContext`로 감싸 custom layout component를 만들어 JavaScript 기반 `@react-navigation/stack` 라이브러리를 사용할 수도 있습니다.

다음 예시에서는 `@react-navigation/stack` 라이브러리를 사용해 `JsStack` component를 정의합니다:

```tsx
import { ParamListBase, StackNavigationState } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationEventMap,
  StackNavigationOptions,
} from '@react-navigation/stack';
import { withLayoutContext } from 'expo-router';

const { Navigator } = createStackNavigator();

export const JsStack = withLayoutContext<
  StackNavigationOptions,
  typeof Navigator,
  StackNavigationState<ParamListBase>,
  StackNavigationEventMap
>(Navigator);
```

`JsStack` component를 정의한 뒤에는 앱에서 다음처럼 사용할 수 있습니다:

```tsx
import { JsStack } from '../layouts/js-stack';

export default function Layout() {
  return (
    <JsStack
      screenOptions={
        {
          ... 
        }
      }
    />
  );
}
```

사용 가능한 option에 대한 자세한 내용은 [`@react-navigation/stack` documentation](https://reactnavigation.org/docs/stack-navigator)을 참고하세요.

## iOS 26 Liquid Glass headers

iOS 26부터 navigation header는 기본적으로 시스템의 "Liquid Glass" effect를 채택합니다. screen별로 비활성화할 수 없으므로 전역 구성을 사용해 opt out해야 합니다.

### Method 1: Use `UIDesignRequiresCompatibility`

> **Note**: Expo Go에서는 지원되지 않습니다. 이 방법은 임시 workaround입니다. iOS 27부터 Apple이 이 option을 제거하므로 Liquid Glass effect를 opt out할 수 없게 됩니다.

[development build](/develop/development-builds/create-a-build#prerequisites)를 만들고 [`UIDesignRequiresCompatibility`](https://developer.apple.com/documentation/BundleResources/Information-Property-List/UIDesignRequiresCompatibility) 속성을 [app config](/workflow/configuration)에서 `true`로 설정하세요:

```json
{
  "ios": {
    "infoPlist": {
      "UIDesignRequiresCompatibility": true
    }
  }
}
```

### Method 2: Use JavaScript-based navigation stack

native navigation library([`@react-navigation/native`](https://reactnavigation.org/docs/native-stack-navigator/)) 대신 [`@react-navigation/stack`](https://reactnavigation.org/docs/stack-navigator/) 같은 JavaScript 기반 stack navigator 라이브러리로 전환하면 header UI를 완전히 제어할 수 있습니다. 다만 고도로 최적화된 iOS navigation view/controller를 사용할 때의 성능 이점은 포기해야 합니다.

자세한 내용은 [JavaScript stack with `@react-navigation/stack`](/router/advanced/stack#javascript-stack-with-react-navigationstack)을 참고하세요.

## Common problems

Large title does not collapse when scrolling

`headerLargeTitle: true`(또는 `<Stack.Screen.Title large>`)를 `ScrollView` 또는 `FlatList`와 함께 사용할 때 large title이 scroll에 따라 접히지 않을 수 있습니다. scroll 가능한 view가 screen component의 직접적인 첫 번째 자식이 아닐 때 이런 일이 발생합니다.

문제를 해결하려면 `ScrollView` 또는 `FlatList`가 screen component가 렌더링하는 첫 번째 자식이 되도록 하세요. wrapper가 필요하다면 그 wrapper에 `collapsable={false}`를 설정하세요:

```tsx
import { Stack } from 'expo-router';
import { ScrollView, View, Text } from 'react-native';

export default function Home() {
  return (
    <ScrollView>
      <Stack.Screen.Title large>Home</Stack.Screen.Title>
      <Text>Content here</Text>
    </ScrollView>
  );
}
```

`ScrollView`를 감싸야 한다면 wrapper에 `collapsable={false}`를 설정하세요:

```tsx
import { Stack } from 'expo-router';
import { ScrollView, View, Text } from 'react-native';

export default function Home() {
  return (
    <View collapsable={false}>
      <ScrollView>
        <Stack.Screen.Title large>Home</Stack.Screen.Title>
        <Text>Content here</Text>
      </ScrollView>
    </View>
  );
}
```
White background flashes when navigating between screens

screen 전환 사이에 흰색이 번쩍 보인다면 navigation stack이 밝은 배경을 사용하고 있는데 앱은 dark theme를 사용하고 있다는 뜻인 경우가 많습니다.

문제를 해결하려면 루트 layout을 React Navigation의 `<ThemeProvider>`로 감싸고 적절한 theme를 전달하세요:

```tsx
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack />
    </ThemeProvider>
  );
}
```

항상 dark theme를 사용하는 앱이라면:

```tsx
import { ThemeProvider, DarkTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <Stack />
    </ThemeProvider>
  );
}
```
