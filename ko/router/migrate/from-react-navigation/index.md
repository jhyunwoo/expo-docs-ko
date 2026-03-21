---
modificationDate: February 28, 2026
title: Migrate from React Navigation
description: React Navigation을 사용하는 프로젝트를 Expo Router로 마이그레이션하는 방법을 알아보세요.
---

# Migrate from React Navigation

React Navigation을 사용하는 프로젝트를 Expo Router로 마이그레이션하는 방법을 알아보세요.

React Navigation과 Expo Router는 모두 Expo의 routing 및 navigation framework입니다. Expo Router는 React Navigation을 감싼 wrapper이며, 많은 개념이 동일합니다.

## Pitch

Expo Router는 React Navigation의 모든 장점과 함께 자동 deep linking, [type safety](/router/reference/typed-routes), [deferred bundling](/router/web/async-routes), [static rendering on web](/router/web/static-rendering) 등을 제공합니다.

## Anti-pitch

앱에서 custom `getPathFromState` 또는 `getStateFromPath` component를 사용한다면 Expo Router가 잘 맞지 않을 수 있습니다. 이 함수를 [shared routes](/router/advanced/shared-routes) 지원을 위해 사용하고 있다면 Expo Router에 이 기능이 내장되어 있으므로 괜찮습니다.

## Recommendations

마이그레이션을 시작하기 전에 코드베이스에 다음 변경을 먼저 적용하는 것을 권장합니다:

-   React Navigation screen component를 개별 파일로 분리하세요. 예를 들어 `<Stack.Screen component={HomeScreen} />`가 있다면 `HomeScreen` component가 반드시 자체 파일에 있도록 하세요.
-   프로젝트를 [TypeScript](/guides/typescript#migrating-existing-javascript-project)로 전환하세요. 마이그레이션 중 발생할 수 있는 오류를 더 쉽게 발견할 수 있습니다.
-   상대 import를 [typed aliases](/guides/typescript#path-aliases-optional)로 바꾸세요. 예를 들어 마이그레이션을 시작하기 전에 `../../components/button.tsx`를 `@/components/button`으로 바꾸세요. 이렇게 하면 screen을 파일 시스템 안에서 이동해도 상대 경로를 갱신할 필요가 줄어듭니다.
-   `resetRoot` 사용을 없애세요. 이것은 실행 중 앱을 "재시작"하는 데 사용되는데, 일반적으로 좋지 않은 관행으로 여겨집니다. 앱 navigation 구조를 바꿔서 이 동작이 필요 없도록 해야 합니다.
-   initial route 이름을 `index`로 바꾸세요. Expo Router는 실행 시 열리는 route를 `/`와 일치하는 route로 간주하지만, React Navigation 사용자는 일반적으로 initial route에 "Home" 같은 이름을 사용합니다.

### Refactor search parameters

screen이 [직렬화 가능한 최상위 query parameter](https://reactnavigation.org/docs/params/#what-should-be-in-params)를 사용하도록 리팩터링하세요. 이는 React Navigation에서도 권장하는 방식입니다.

Expo Router에서는 search parameter가 `number`, `boolean`, `string` 같은 최상위 값만 직렬화할 수 있습니다. React Navigation에는 같은 제한이 없기 때문에 사용자가 Function, Object, Map 같은 잘못된 parameter를 전달하는 경우가 있습니다.

코드가 아래와 비슷하다면:

```js
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();

navigation.push('Followers', {
  onPress: profile => {
    navigation.push('User', { profile });
  },
});
```

함수를 "followers" screen에서 접근할 수 있도록 구조를 바꾸는 것을 고려하세요. 이 경우 "followers" screen에서 router에 접근해 직접 push할 수 있습니다.

### Eagerly load UI

React Native 앱에서는 asset과 font가 로드되는 동안 루트 component에서 `return null`을 하는 경우가 흔합니다. 이는 좋지 않은 관행이며 일반적으로 Expo Router에서는 지원되지 않습니다. 렌더링을 정말로 지연해야 한다면 어떤 screen으로도 navigation을 시도하지 않도록 하세요.

역사적으로 이 패턴이 존재했던 이유는, 로드되지 않은 custom font를 사용하면 React Native가 오류를 던졌기 때문입니다. 우리는 React Native 0.72(SDK 49)에서 이 동작을 상향 수정해, 이제 기본 동작은 custom font가 로드되면 기본 font를 교체하는 방식입니다. 특정 text element만 font 로드가 끝날 때까지 숨기고 싶다면, font가 로드될 때까지 null을 반환하는 wrapper `<Text>`를 작성하세요.

web에서는 루트에서 `null`을 반환하면 [static rendering](/router/web/static-rendering)이 모든 child를 건너뛰게 되어 searchable content가 전혀 남지 않습니다. 이는 Chrome에서 "View Page Source"를 사용하거나 JavaScript를 비활성화한 뒤 페이지를 다시 로드해 확인할 수 있습니다.

## Migration

### Delete unused or managed code

Expo Router는 `react-native-safe-area-context` 지원을 자동으로 추가합니다.

Expo Router는 **`react-native-gesture-handler`를 추가하지 않습니다**(v3 기준). 따라서 Gesture Handler나 `<Drawer />` layout을 사용 중이라면 직접 추가해야 합니다. 이 패키지는 자주 사용되지 않는 많은 JavaScript를 더하므로 web에서는 사용을 피하세요.

### Copy screens to the app directory

루트 **src** 디렉터리 안에 **app** 디렉터리를 만드세요. Expo Router는 **src/app** 디렉터리를 route의 루트로 자동 감지합니다.

**tsconfig.json**과 **app.json**이 올바르게 구성되어 있는지 확인하세요

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"],
      "@/assets/*": ["./assets/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

또한 **app.json**에 `expo-router` plugin이 구성되어 있는지도 확인하세요:

```json
{
  "expo": {
    ... 
    "plugins": ["expo-router"]
  }
}
```

[application of Expo Router rules](/router/basics/core-concepts#the-rules-of-expo-router-applied)에 따라 파일을 만들어 앱 구조를 배치하세요. route 파일명에는 kebab-case와 소문자를 사용하는 것이 모범 사례입니다.

예를 들어 navigator를 디렉터리로 치환하세요:

```jsx
function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Feed" component={Feed} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    // NavigationContainer is managed by Expo Router.
    <NavigationContainer
      linking={
        {
          // ...linking configuration
        }
      }
    >
      <Stack.Navigator>
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen
          name="Home"
          component={HomeTabs}
          options={{
            title: 'Home Screen',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

**Expo Router:**

-   "main" route 이름을 **Home**에서 **index**로 바꾸어 `/` path와 일치하도록 하세요.
-   이름을 소문자로 바꾸세요.
-   모든 screen을 app 디렉터리 안의 적절한 파일 위치로 옮기세요. 약간의 실험이 필요할 수 있습니다.

`src`

 `app`

  `_layout.tsx`

  `(home)`

   `_layout.tsx`

   `index.tsx`

   `feed.tsx`

  `profile.tsx`

  `settings.tsx`

```tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(home)"
        options={
          {
            title: 'Home Screen',
          }
        }
      />
    </Stack>
  );
}
```

tab navigator는 하위 디렉터리로 이동하게 됩니다.

```tsx
import { Tabs } from 'expo-router';

export default function HomeLayout() {
  return <Tabs />;
}
```

### Use Expo Router hooks

React Navigation v6 이하에서는 모든 screen에 `{ navigation, route }` prop을 전달합니다. 이 패턴은 React Navigation에서도 사라지고 있으며, Expo Router에는 애초에 도입되지 않았습니다.

대신 `navigation`은 `useRouter` hook으로 마이그레이션하세요.

비슷하게 `route` prop은 [`useLocalSearchParams`](/versions/latest/sdk/router#uselocalsearchparams) hook으로 마이그레이션하세요.

[`navigation.navigate`](https://reactnavigation.org/docs/navigation-object/#navigate)에 접근하려면 [`useNavigation`](/versions/latest/sdk/router#usenavigation) hook에서 `navigation` prop을 가져오세요.

### Migrate the Link component

React Navigation과 Expo Router는 둘 다 Link component를 제공합니다. 하지만 Expo의 Link component는 [`to`](https://reactnavigation.org/docs/use-link-props/#to) 대신 `href`를 사용합니다.

```jsx
// React Navigation
<Link to="Settings" />

// Expo Router
<Link href="/settings" />
```

React Navigation 사용자는 child component를 제어하기 위해 `useLinkProps` hook으로 custom Link component를 만드는 경우가 많습니다. Expo Router에서는 그럴 필요 없이 `asChild` prop을 사용하면 됩니다.

### Share screens across navigators

React Navigation 앱에서는 여러 navigator 사이에서 동일한 route 집합을 재사용하는 경우가 흔합니다. 이는 일반적으로 각 tab이 어떤 screen이든 push할 수 있도록 보장하기 위해 tab과 함께 사용됩니다.

Expo Router에서는 [shared routes](/router/advanced/shared-routes)로 마이그레이션하거나, 같은 component를 여러 파일에서 re-export하는 방식으로 구현할 수 있습니다.

group이나 shared route를 사용할 때는 `/settings` 대신 `/(home)/settings`처럼 fully qualified route name을 사용해 특정 tab으로 이동할 수 있습니다.

### Migrate screen tracking events

[React Navigation screen tracking guide](https://reactnavigation.org/docs/screen-tracking/)에 따라 screen tracking을 설정했다면, 이를 [Expo Router screen tracking guide](/router/reference/screen-tracking)에 맞춰 업데이트하세요.

### Use platform-specific components for screens

플랫폼에 따라 UI를 전환하는 방법은 [platform-specific modules](/router/advanced/platform-specific-modules) 가이드를 참고하세요.

### Replace the `NavigationContainer`

전역 React Navigation [`<NavigationContainer />`](https://reactnavigation.org/docs/navigation-container/)는 Expo Router에서 완전히 관리됩니다. Expo Router는 `NavigationContainer`를 직접 사용하지 않고도 동일한 기능을 달성할 수 있는 시스템을 제공합니다.

API substitutions

### Ref

`NavigationContainer` ref에는 직접 접근하지 않아야 합니다. 대신 아래 메서드를 사용하세요.

#### `resetRoot​`

애플리케이션의 initial route로 이동합니다. 예를 들어 앱이 `/`에서 시작한다면(권장), 이 메서드로 현재 route를 `/`로 교체할 수 있습니다.

```jsx
import { useRouter } from 'expo-router';

function Example() {
  const router = useRouter();

  return (
    <Text
      onPress={() => {
        // Go to the initial route of the application.
        router.replace('/');
      }}>
      Reset App
    </Text>
  );
}
```

#### `getRootState`

`useRootNavigationState()`를 사용하세요.

#### `getCurrentRoute`

React Navigation과 달리 Expo Router는 어떤 route든 신뢰성 있게 문자열로 표현할 수 있습니다. 현재 route를 식별하려면 [`usePathname()`](/versions/latest/sdk/router#usepathname) 또는 [`useSegments()`](/versions/latest/sdk/router#usesegments) hook을 사용하세요.

#### `getCurrentOptions`

현재 route의 query parameter를 얻으려면 [`useLocalSearchParams()`](/versions/latest/sdk/router#uselocalsearchparams) hook을 사용하세요.

#### `addListener`

다음 event들은 마이그레이션할 수 있습니다:

#### `state`

현재 route를 식별하려면 [`usePathname()`](/versions/latest/sdk/router#usepathname) 또는 [`useSegments()`](/versions/latest/sdk/router#usesegments) hook을 사용하세요. `useEffect(() => {}, [...])`와 함께 사용해 변경을 관찰하세요.

#### `options`

현재 route의 query parameter를 얻으려면 [`useLocalSearchParams()`](/versions/latest/sdk/router#uselocalsearchparams) hook을 사용하세요. `useEffect(() => {}, [...])`와 함께 사용해 변경을 관찰하세요.

### props

다음 `<NavigationContainer />` prop을 마이그레이션하세요:

#### `initialState`

Expo Router에서는 route 문자열(예: `/user/evanbacon`)로 애플리케이션 state를 다시 복원할 수 있습니다. initial state를 처리할 때는 [redirects](/router/reference/redirects)를 사용하세요. 고급 redirect는 [shared routes](/router/advanced/shared-routes)를 참고하세요.

이 패턴은 deep linking을 사용하는 방식으로 대체하는 것이 좋습니다(예: 사용자가 홈 화면이 아니라 `/profile`로 앱을 엽니다). 특정 screen 때문에 앱이 충돌하는 경우, 앱을 시작할 때 자동으로 다시 그 정확한 screen으로 이동하는 것은 피하는 것이 좋습니다. 그렇지 않으면 문제를 해결하려고 앱을 재설치해야 할 수도 있습니다.

#### `onStateChange`

현재 route state를 식별하려면 [`usePathname()`](/versions/latest/sdk/router#usepathname), [`useSegments()`](/versions/latest/sdk/router#usesegments), [`useGlobalSearchParams()`](/versions/latest/sdk/router#useglobalsearchparams) hook을 사용하세요. `useEffect(() => {}, [...])`와 함께 사용해 변경을 관찰하세요.

-   screen 변화를 추적하려는 경우 [Screen Tracking guide](/router/reference/screen-tracking)를 따르세요.
-   React Navigation은 [`onStateChange`](https://reactnavigation.org/docs/navigation-container/#onstatechange)를 피하는 것을 권장합니다.

#### `onReady`

React Navigation에서 [`onReady`](https://reactnavigation.org/docs/navigation-container/#onready)는 주로 splash screen을 언제 숨길지 판단하거나 analytics로 screen을 추적하는 데 사용됩니다. Expo Router는 이 두 사용 사례 모두를 특별히 처리합니다. Expo Router에서는 navigation이 항상 navigation event를 받을 준비가 되어 있다고 가정하세요.

-   React Navigation에서 analytics를 마이그레이션하는 방법은 [Screen Tracking guide](/router/reference/screen-tracking)를 참고하세요.
-   splash screen 처리 방법은 [Splash Screen feature](/develop/user-interface/splash-screen-and-app-icon)를 참고하세요.

#### `onUnhandledAction`

Expo Router에서는 action이 항상 처리됩니다. [dynamic routes](/router/basics/notation#square-brackets)와 [404 screens](/router/error-handling#unmatched-routes)을 사용해 [`onUnhandledAction`](https://reactnavigation.org/docs/navigation-container/#onunhandledaction)을 대체하세요.

#### `linking`

[`linking`](https://reactnavigation.org/docs/navigation-container/#linking) prop은 **app** 디렉터리의 파일을 기준으로 자동 구성됩니다.

#### `fallback`

[`fallback`](https://reactnavigation.org/docs/navigation-container/#fallback) prop은 Expo Router가 자동으로 처리합니다. 자세한 내용은 [Splash Screen](/versions/latest/sdk/splash-screen) reference를 참고하세요.

#### `theme`

React Navigation에서는 [`<NavigationContainer />`](https://reactnavigation.org/docs/navigation-container/#theme) component를 사용해 앱 전체의 theme를 설정합니다. Expo Router는 루트 container를 대신 관리하므로, 대신 `ThemeProvider`를 직접 사용해 theme를 설정해야 합니다.

```tsx
import { ThemeProvider, DarkTheme, DefaultTheme, useTheme } from '@react-navigation/native';
import { Slot } from 'expo-router';

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <Slot />
    </ThemeProvider>
  );
}
```

이 기법은 앱의 어느 레이어에서든 특정 layout에 theme를 설정하는 데 사용할 수 있습니다. 현재 theme는 `@react-navigation/native`의 `useTheme` hook으로 접근할 수 있습니다.

#### `children`

`children` prop은 **app** 디렉터리의 파일과 현재 열려 있는 URL에 따라 자동으로 채워집니다.

#### `independent`

Expo Router는 [`independent`](https://reactnavigation.org/docs/navigation-container/#independent) container를 지원하지 않습니다. router가 단일 `<NavigationContainer />`를 관리해야 하기 때문입니다. 추가 container는 Expo Router에 의해 자동 관리되지 않습니다.

#### `documentTitle`

웹페이지 title을 설정하려면 [Head component](/router/web/static-rendering#meta-tags)를 사용하세요.

#### `ref`

대신 `useNavigationContainerRef()` hook을 사용하세요.

### Rewrite custom navigators

프로젝트에 custom navigator가 있다면, 이를 다시 작성하거나 Expo Router로 포팅할 수 있습니다.

포팅하려면 `withLayoutContext` 함수를 사용하면 됩니다:

```js
import { createCustomNavigator } from './my-navigator';

export const CustomNavigator = withLayoutContext(createCustomNavigator().Navigator);
```

다시 작성하려면 React Navigation의 [`useNavigationBuilder`](https://reactnavigation.org/docs/custom-navigators#usenavigationbuilder) hook을 감싸는 `Navigator` component를 사용하세요.

`useNavigationBuilder`의 반환값은 `<Navigator />` component 안에서 `Navigator.useContext()` hook으로 접근할 수 있습니다. `<Navigator />`의 props를 통해 `useNavigationBuilder`에 속성을 전달할 수 있으며, 여기에는 `initialRouteName`, `screenOptions`, `router`가 포함됩니다.

`<Navigator />` component의 모든 `children`은 있는 그대로 렌더링됩니다.

-   `Navigator.useContext`: custom navigator를 위한 React Navigation의 `state`, `navigation`, `descriptors`, `router`에 접근합니다.
-   `Navigator.Slot`: 현재 선택된 route를 렌더링하는 데 사용하는 React component입니다. 이 component는 `<Navigator />` 안에서만 렌더링할 수 있습니다.

#### Example

custom layout에는 내부 context가 있으며, `<Navigator />` component 없이 `<Slot />` component를 사용할 경우 이 context는 무시됩니다.

```jsx
import { View } from 'react-native';
import { TabRouter } from '@react-navigation/native';

import { Navigator, usePathname, Slot, Link } from 'expo-router';

export default function App() {
  return (
    <Navigator router={TabRouter}>
      <Header />
      <Slot />
    </Navigator>
  );
}

function Header() {;
  const pathname = usePathname();

  return (
    <View>
      <Link href="/">Home</Link>
      <Link
        href="/profile"
        style={[pathname === '/profile' && { color: 'blue' }]}>
        Profile
      </Link>
      <Link href="/settings">Settings</Link>
    </View>
  );
}
```

### Use Expo Router's Splash Screen wrapper

Expo Router는 `expo-splash-screen`을 감싸고, navigation이 mount된 뒤와 예상치 못한 error가 잡힐 때 숨겨지도록 특별 처리합니다. 단순히 `expo-splash-screen` 대신 `expo-router`의 `SplashScreen`을 import하도록 마이그레이션하면 됩니다.

### Navigation state observation

navigation state를 직접 관찰하고 있다면 [`usePathname`](/versions/latest/sdk/router#usepathname), [`useSegments`](/versions/latest/sdk/router#usesegments), [`useGlobalSearchParams`](/versions/latest/sdk/router#useglobalsearchparams) hook으로 마이그레이션하세요.

### Pass params to nested screens

[nested screen navigation events](https://reactnavigation.org/docs/params/#passing-params-to-nested-navigators)를 사용하는 대신 qualified href를 사용하세요:

```js
// React Navigation
navigation.navigate('Account', {
  screen: 'Settings',
  params: { user: 'jane' },
});

// Expo Router
router.push({ pathname: '/account/settings', params: { user: 'jane' } });
```

### Set initial routes for deep linking and server navigation

React Navigation에서는 linking configuration의 `initialRouteName` 속성을 사용할 수 있습니다. Expo Router에서는 [layout settings](/router/advanced/router-settings)를 사용하세요.

### Reset navigation state

React Navigation 라이브러리의 [`reset`](https://reactnavigation.org/docs/navigation-actions/#reset) action을 사용해 navigation state를 초기화할 수 있습니다. 이는 Expo Router의 [`useNavigation`](/versions/latest/sdk/router#usenavigation) hook을 통해 얻은 `navigation` prop으로 dispatch합니다.

아래 예시에서 `navigation` prop은 `useNavigation` hook으로 접근하고, `@react-navigation/native`의 `CommonActions.reset` action을 사용합니다. `reset` action에 지정한 object는 기존 navigation state를 새 상태로 대체합니다.

```tsx
import { useNavigation } from 'expo-router'
import { CommonActions } from '@react-navigation/native'

export default function Screen() {
  const navigation = useNavigation();

  const handleResetAction = () => {
    navigation.dispatch(CommonActions.reset({
      routes: [{key: "(tabs)", name: "(tabs)"}]
    }))
  }

  return (
    <>
      {/* ...rest of the code */}
      <Button title='Reset' onPress={handleResetAction} />
    </>
  );
}
```

### Migrate TypeScript types

Expo Router는 자동으로 [statically typed routes](/router/reference/typed-routes)를 생성할 수 있으며, 이로써 유효한 route로만 navigation할 수 있게 보장합니다.

## Additional information

### React Navigation themes

React Navigation navigator인 `<Stack>`, `<Drawer>`, `<Tabs>`는 공유 appearance provider를 사용합니다. React Navigation에서는 `<NavigationContainer />` component로 앱 전체의 theme를 설정합니다. Expo Router는 루트 container를 관리하므로 대신 `ThemeProvider`를 직접 사용해 theme를 설정할 수 있습니다.

```tsx
import { ThemeProvider, DarkTheme, DefaultTheme, useTheme } from '@react-navigation/native';
import { Slot } from 'expo-router';

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <Slot />
    </ThemeProvider>
  );
}
```

이 기법은 앱의 어느 레이어에서든 특정 layout에 theme를 설정하는 데 사용할 수 있습니다. 현재 theme는 `@react-navigation/native`의 `useTheme` hook으로 접근할 수 있습니다.

### React Navigation Elements

[`@react-navigation/elements`](https://reactnavigation.org/docs/elements/) 라이브러리는 navigation UI를 구축하는 데 사용할 수 있는 UI element와 helper 집합을 제공합니다. 이 component들은 조합 가능하고 커스터마이징 가능하도록 설계되었습니다. 라이브러리의 기본 기능을 재사용할 수도 있고, 그 위에 navigator UI를 직접 만들 수도 있습니다.

Expo Router와 함께 사용하려면 이 라이브러리를 설치해야 합니다:

```sh
npx expo install @react-navigation/elements
```

라이브러리가 제공하는 component와 utility에 대해 더 알아보려면 [Elements library](https://reactnavigation.org/docs/elements/) documentation을 참고하세요.
