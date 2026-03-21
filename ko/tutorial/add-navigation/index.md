---
modificationDate: March 09, 2026
title: 내비게이션 추가하기
description: 이 장에서는 Expo 앱에 내비게이션을 추가하는 방법을 알아봅니다.
---

# 내비게이션 추가하기

이 장에서는 Expo 앱에 내비게이션을 추가하는 방법을 알아봅니다.

이 장에서는 두 개의 탭이 있는 stack navigation과 하단 탭 바를 만들기 위해 Expo Router의 기본 개념을 배워보겠습니다.

[시청하기: 유니버설 Expo 앱에 내비게이션 추가하기](https://www.youtube.com/watch?v=8336fcFV_T4) — Expo Router로 file-based routing을 설정하고, 화면 사이에 stack navigation을 만들고, 하단 탭 바를 구성합니다.

## Expo Router 기본 개념

Expo Router는 React Native와 웹 앱을 위한 file-based routing framework입니다. 화면 간 내비게이션을 관리하고 여러 플랫폼에서 같은 컴포넌트를 사용합니다. 시작하려면 다음 규칙을 알아야 합니다:

-   **app directory**: route와 해당 layout만 포함하는 특별한 디렉터리입니다. 이 디렉터리에 추가한 모든 파일은 네이티브 앱 안의 화면이 되고 웹에서는 페이지가 됩니다.
-   **Root layout**: **app/_layout.tsx** 파일입니다. header와 tab bar 같은 공통 UI 요소를 정의해 서로 다른 route 간에도 일관되게 유지합니다.
-   **File name conventions**: **index.tsx** 같은 _Index_ 파일 이름은 상위 디렉터리와 매칭되며 path segment를 추가하지 않습니다. 예를 들어 **app** 디렉터리 안의 **index.tsx** 파일은 `/` route와 매칭됩니다.
-   **route** 파일은 React component를 default value로 export합니다. 확장자는 `.js`, `.jsx`, `.ts`, `.tsx` 중 어느 것이든 사용할 수 있습니다.
-   Android, iOS, 웹은 하나의 통합된 내비게이션 구조를 공유합니다.

> 위 목록만으로도 시작하기에는 충분합니다. 전체 기능 목록은 [Expo Router 소개](/router/introduction)를 참고하세요.

## 스택에 새 화면 추가하기

**app** 디렉터리 안에 **about.tsx**라는 새 파일을 만들어 봅시다. 사용자가 `/about` route로 이동했을 때 화면 이름을 표시합니다.

```tsx
import { Text, View, StyleSheet } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>About screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});
```

**app/_layout.tsx** 안에서:

1.  `<Stack.Screen />` 컴포넌트와 `options` prop을 추가해 `/about` route의 title을 업데이트합니다.
2.  `options` prop을 추가해 `/index` route의 title을 `Home`으로 업데이트합니다.

```tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="about" options={{ title: 'About' }} />
    </Stack>
  );
}
```

`Stack`이란 무엇일까요?

stack navigator는 앱에서 서로 다른 화면 사이를 이동하기 위한 기반입니다. Android에서는 쌓이는 route가 현재 화면 위로 애니메이션되며, iOS에서는 오른쪽에서 들어오는 애니메이션이 적용됩니다. Expo Router는 새 route를 추가할 수 있는 navigation stack을 만들기 위해 `Stack` 컴포넌트를 제공합니다.

## 화면 사이를 이동하기

Expo Router의 `Link` 컴포넌트를 사용해 `/index` route에서 `/about` route로 이동하겠습니다. 이것은 주어진 `href` prop으로 `<Text>`를 렌더링하는 React component입니다.

1.  **index.tsx** 안에서 `expo-router`의 `Link` 컴포넌트를 import합니다.
2.  `<Text>` 컴포넌트 뒤에 `Link` 컴포넌트를 추가하고 `/about` route를 가진 `href` prop을 전달합니다.
3.  `Link` 컴포넌트에 `fontSize`, `textDecorationLine`, `color` 스타일을 추가합니다. `<Text>` 컴포넌트와 같은 prop을 받습니다.

```tsx
import { Text, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home screen</Text>
      <Link href="/about" style={styles.button}>
        Go to About screen
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});
```

이제 앱의 변경 사항을 살펴봅시다. `Link`를 클릭해 `/about` route로 이동해 보세요:

## not-found route 추가하기

route가 존재하지 않을 때는 `+not-found` route를 사용해 fallback 화면을 보여줄 수 있습니다. 이는 모바일에서 잘못된 route로 이동했을 때 앱이 crash되는 대신 custom 화면을 보여주거나 웹에서 _404_ 오류를 보여주고 싶을 때 유용합니다. Expo Router는 이 상황을 처리하기 위해 특별한 **+not-found.tsx** 파일을 사용합니다.

1.  app 디렉터리 안에 **+not-found.tsx**라는 새 파일을 만들어 `NotFoundScreen` 컴포넌트를 추가합니다.
2.  이 route에 대한 custom screen title을 표시하기 위해 `Stack.Screen`의 `options` prop을 추가합니다.
3.  fallback route인 `/` route로 이동할 수 있도록 `Link` 컴포넌트를 추가합니다.

```tsx
import { View, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Not Found' }} />
      <View style={styles.container}>
        <Link href="/" style={styles.button}>
          Go back to Home screen!
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});
```

이것을 테스트하려면 웹 브라우저에서 `http:localhost:8081/123` URL로 이동해 보세요. 웹에서는 URL path를 바꾸기 쉽기 때문입니다. 앱은 `NotFoundScreen` 컴포넌트를 표시해야 합니다:

## 하단 탭 navigator 추가하기

이 시점에서 **app** 디렉터리의 파일 구조는 다음과 같습니다:

`app`

 `_layout.tsx``Root layout`

 `index.tsx``matches route '/'`

 `about.tsx``matches route '/about'`

 `+not-found.tsx``matches route any 404 route`

이제 앱에 하단 탭 navigator를 추가하고 기존 Home과 About 화면을 재사용해 tab layout을 만들겠습니다(X나 BlueSky 같은 많은 소셜 미디어 앱의 일반적인 내비게이션 패턴입니다). 또한 Root layout에서 stack navigator를 사용해 `+not-found` route가 다른 중첩 navigator 위에 표시되도록 하겠습니다.

1.  **app** 디렉터리 안에 **(tabs)** 하위 디렉터리를 추가합니다. 이 특별한 디렉터리는 route를 함께 그룹화하고 하단 탭 바에 표시할 때 사용합니다.
2.  해당 디렉터리 안에 **(tabs)/_layout.tsx** 파일을 만듭니다. 이 파일은 Root layout과는 별개의 tab layout을 정의하는 데 사용됩니다.
3.  기존 **index.tsx**와 **about.tsx** 파일을 **(tabs)** 디렉터리 안으로 옮깁니다. **app** 디렉터리 구조는 다음처럼 보일 것입니다:

`app`

 `_layout.tsx``Root layout`

 `+not-found.tsx``matches route any 404 route`

 `(tabs)`

  `_layout.tsx``Tab layout`

  `index.tsx``matches route '/'`

  `about.tsx``matches route '/about'`

Root layout 파일을 업데이트해 `(tabs)` route를 추가합니다:

```tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
```

**(tabs)/_layout.tsx** 안에 `Tabs` 컴포넌트를 추가해 하단 탭 layout을 정의합니다:

```tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="about" options={{ title: 'About' }} />
    </Tabs>
  );
}
```

이제 새로운 하단 탭이 추가된 앱을 살펴봅시다:

## 하단 탭 navigator 모양 업데이트하기

지금은 하단 탭 navigator가 모든 플랫폼에서 똑같이 보이지만 앱의 스타일과는 맞지 않습니다. 예를 들어 tab bar나 header에는 custom icon이 표시되지 않고, 하단 탭 배경색도 앱의 배경색과 맞지 않습니다.

**(tabs)/_layout.tsx** 파일을 수정해 tab bar icon을 추가합니다:

1.  인기 있는 icon 세트를 포함한 라이브러리인 [`@expo/vector-icons`](/guides/icons#expovector-icons)에서 `Ionicons` icon set을 import합니다.
2.  `index`와 `about` route 모두에 `tabBarIcon`을 추가합니다. 이 함수는 `focused`와 `color`를 매개변수로 받아 icon 컴포넌트를 렌더링합니다. icon set에서 원하는 icon 이름을 지정할 수 있습니다.
3.  `Tabs` 컴포넌트에 `screenOptions.tabBarActiveTintColor`를 추가하고 값을 `#ffd33d`로 설정합니다. 이렇게 하면 활성 상태일 때 tab bar icon과 label의 색상이 바뀝니다.

```tsx
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffd33d',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24}/>
          ),
        }}
      />
    </Tabs>
  );
}
```

`screenOptions` prop을 사용해 tab bar와 header의 배경색도 변경해 봅시다:

```tsx
<Tabs
  screenOptions={{
    tabBarActiveTintColor: '#ffd33d',
    headerStyle: {
      backgroundColor: '#25292e',
    },
    headerShadowVisible: false,
    headerTintColor: '#fff',
    tabBarStyle: {
      backgroundColor: '#25292e',
    },
  }}
>
```

위 코드에서:

-   header 배경은 `headerStyle` 속성을 사용해 `#25292e`로 설정합니다. 또한 `headerShadowVisible`을 사용해 header의 shadow를 비활성화했습니다.
-   `headerTintColor`는 header label에 `#fff`를 적용합니다
-   `tabBarStyle.backgroundColor`는 tab bar에 `#25292e`를 적용합니다

이제 우리 앱에는 custom 하단 탭 navigator가 생겼습니다:

## 요약

2장: 내비게이션 추가하기

앱에 stack navigator와 tab navigator를 성공적으로 추가했습니다.

다음 장에서는 앱의 첫 번째 화면을 만드는 방법을 알아보겠습니다.

[다음: 앱의 첫 번째 화면 만들기](/tutorial/build-a-screen)
