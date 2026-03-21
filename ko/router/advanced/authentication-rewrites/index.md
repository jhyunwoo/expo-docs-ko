---
modificationDate: October 25, 2025
title: redirects를 사용한 Expo Router 인증
description: Expo Router로 인증을 구현하고 routes를 보호하는 방법.
---

# redirects를 사용한 Expo Router 인증

Expo Router로 인증을 구현하고 routes를 보호하는 방법.

> SDK 53에서는 인증을 처리하는 더 강력한 방법인 [Protected routes](/router/advanced/protected)가 도입되었습니다. SDK 52 이하를 사용 중이라면 이 가이드를 따르세요.

[Building an Auth Flow with Expo Router](https://www.youtube.com/watch?v=yNaOaR2kIa0) — Expo Router 프로젝트에서 auth flow를 구현하는 방법을 알아보세요.

Expo Router에서는 모든 routes가 항상 정의되어 있고 접근 가능합니다. 사용자가 인증되었는지 여부에 따라 특정 화면에서 사용자를 다른 곳으로 보내기 위해 런타임 로직을 사용할 수 있습니다. routes 안에서 사용자를 인증하는 방법은 두 가지가 있습니다. 이 가이드는 표준 네이티브 앱의 동작을 보여주는 예제를 제공합니다.

## React Context와 Route Groups 사용하기

특정 routes를 인증되지 않은 사용자로 제한하는 것은 흔한 일입니다. 이는 React Context와 Route Groups를 사용하면 체계적인 방식으로 달성할 수 있습니다. 항상 접근 가능한 `/sign-in` route와 인증이 필요한 `(app)` group이 있는 다음 프로젝트 구조를 생각해 봅시다:

`app`

 `_layout.tsx`

 `sign-in.tsx``항상 접근 가능`

 `(app)`

  `_layout.tsx``하위 routes 보호`

  `index.tsx``인증 필요`

위 예제를 따르려면, 앱 전체에 인증 session을 노출할 수 있는 [React Context provider](https://react.dev/reference/react/createContext)를 설정하세요. 커스텀 인증 session provider를 직접 구현할 수도 있고, 아래 **Example authentication context**의 provider를 사용할 수도 있습니다.

Example authentication context

이 provider는 mock 구현을 사용합니다. 원하는 [authentication provider](/guides/authentication)로 바꿔 사용할 수 있습니다.

```tsx
import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from './useStorageState';

const AuthContext = createContext<{
  signIn: () => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  return (
    <AuthContext.Provider
      value={{
        signIn: () => {
          // Perform sign-in logic here
          setSession('xxx');
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
```

다음 코드 스니펫은 네이티브에서는 [`expo-secure-store`](/versions/latest/sdk/securestore)를 사용해 토큰을 안전하게 저장하고, web에서는 local storage를 사용하는 기본 hook입니다.

```tsx
import  { useEffect, useCallback, useReducer } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null],
): UseStateHook<T> {
  return useReducer(
    (state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action],
    initialValue
  ) as UseStateHook<T>;
}

export async function setStorageItemAsync(key: string, value: string | null) {
  if (process.env.EXPO_OS === 'web') {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value);
    }
  } else {
    if (value == null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }
}

export function useStorageState(key: string): UseStateHook<string> {
  // Public
  const [state, setState] = useAsyncState<string>();

  // Get
  useEffect(() => {
    if (Platform.OS === 'web') {
      try {
        if (typeof localStorage !== 'undefined') {
          setState(localStorage.getItem(key));
        }
      } catch (e) {
        console.error('Local storage is unavailable:', e);
      }
    } else {
      SecureStore.getItemAsync(key).then((value: string | null) => {
        setState(value);
      });
    }
  }, [key]);

  // Set
  const setValue = useCallback(
    (value: string | null) => {
      setState(value);
      setStorageItemAsync(key, value);
    },
    [key]
  );

  return [state, setValue];
}
```

루트 layout에서 `SessionProvider`를 사용해 앱 전체에 인증 context를 제공하세요. 어떤 내비게이션 이벤트가 발생하기 전에 반드시 `<Slot />`이 mount되어 있어야 합니다. 그렇지 않으면 런타임 오류가 발생합니다.

```tsx
import { Slot } from 'expo-router';
import { SessionProvider } from '../ctx';

export default function Root() {
  // Set up the auth context and render our layout inside of it.
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
```

하위 route 컴포넌트를 렌더링하기 전에 사용자가 인증되었는지 확인하는 중첩 [layout route](/router/basics/layout)를 만드세요. 이 layout route는 인증되지 않은 사용자를 sign-in 화면으로 리디렉션합니다.

```tsx
import { Text } from 'react-native';
import { Redirect, Stack } from 'expo-router';

import { useSession } from '../../ctx';

export default function AppLayout() {
  const { session, isLoading } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/sign-in" />;
  }

  // This layout can be deferred because it's not the root layout.
  return <Stack />;
}
```

`/sign-in` 화면을 만드세요. 이 화면은 `signIn()`을 사용해 인증 상태를 전환할 수 있습니다. 이 화면은 `(app)` group 밖에 있으므로, 이 화면을 렌더링할 때는 group의 layout과 인증 확인이 실행되지 않습니다. 덕분에 로그아웃된 사용자도 이 화면을 볼 수 있습니다.

```tsx
import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { useSession } from '../ctx';

export default function SignIn() {
  const { signIn } = useSession();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text
        onPress={() => {
          signIn();
          // Navigate after signing in. You may want to tweak this to ensure sign-in is
          // successful before navigating.
          router.replace('/');
        }}>
        Sign In
      </Text>
    </View>
  );
}
```

사용자가 sign out할 수 있는 인증된 화면을 구현하세요.

```tsx
import { Text, View } from 'react-native';

import { useSession } from '../../ctx';

export default function Index() {
  const { signOut } = useSession();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text
        onPress={() => {
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
          signOut();
        }}>
        Sign Out
      </Text>
    </View>
  );
}
```

이제 초기 인증 상태를 확인하는 동안 loading state를 보여주고, 사용자가 인증되지 않았으면 sign-in 화면으로 리디렉션하는 앱이 완성되었습니다. 사용자가 인증 확인이 있는 routes로 deep link를 방문하면 sign-in 화면으로 리디렉션됩니다.

## Alternative loading states

Expo Router에서는 초기 auth 상태를 로딩하는 동안 화면에 무언가가 렌더링되어야 합니다. 위 예제에서는 app layout이 loading message를 렌더링합니다. 또는 `index` route를 loading state로 만들고 초기 route를 `/home` 같은 곳으로 옮길 수도 있는데, 이는 X가 동작하는 방식과 비슷합니다.

## Modals and per-route authentication

또 다른 흔한 패턴은 앱 위에 sign-in modal을 렌더링하는 것입니다. 이렇게 하면 인증이 끝났을 때 deep link를 닫고 일부 상태를 유지할 수 있습니다. 하지만 이 패턴은 인증 없이도 데이터 로딩을 처리해야 하므로 background에서 routes가 렌더링되어야 합니다.

`app`

 `_layout.tsx``전역 session context 선언`

 `(app)`

  `_layout.tsx`

  `sign-in.tsx``루트 위에 표시되는 modal`

  `(root)`

   `_layout.tsx``하위 routes 보호`

   `index.tsx``인증 필요`

```tsx
import { Stack } from 'expo-router';

export const unstable_settings = {
  anchor: '(root)',
};

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="(root)" />
      <Stack.Screen
        name="sign-in"
        options={{
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
```

## 내비게이션 없이 내비게이션하기

[root layout](/router/basics/layout#root-layout)에 navigator가 mount되기 전에 앱이 내비게이션을 수행하려고 하면 다음 오류를 만날 수 있습니다.

```text
Error: Attempted to navigate before mounting the Root Layout component. Ensure the Root Layout component is rendering a Slot, or other navigator on the first render.
```

이 문제를 해결하려면 group을 추가하고 조건부 로직을 한 단계 아래로 내리세요.

### Before

`app`

 `_layout.tsx`

 `about.tsx`

```tsx
export default function RootLayout() {
  React.useEffect(() => {
    // This navigation event will trigger the error above.
    router.push('/about');
  }, []);

  // This conditional statement creates a problem since the root layout's
  // content (the Slot) must be mounted before any navigation events occur.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return <Slot />;
}
```

### After

`app`

 `_layout.tsx`

 `(app)`

  `_layout.tsx``조건부 로직을 한 단계 아래로 이동`

  `about.tsx`

```tsx
export default function RootLayout() {
  return <Slot />;
}
```

```tsx
export default function RootLayout() {
  React.useEffect(() => {
    router.push('/about');
  }, []);

  // It is OK to defer rendering this nested layout's content. We couldn't
  // defer rendering the root layout's content since a navigation event (the
  // redirect) would have been triggered before the root layout's content had
  // been mounted.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return <Slot />;
}
```

## Middleware

전통적으로 웹사이트는 routes를 보호하기 위해 어떤 형태로든 서버 측 리디렉션을 활용할 수 있습니다. 현재 web의 Expo Router는 빌드 시점 정적 생성만 지원하며, custom middleware나 serving은 지원하지 않습니다. 이는 앞으로 더 나은 web 경험을 위해 추가될 수 있습니다. 그때까지는 client-side redirects와 loading state를 사용해 인증을 구현할 수 있습니다.
