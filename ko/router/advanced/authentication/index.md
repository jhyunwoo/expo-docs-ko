---
modificationDate: February 26, 2026
title: Expo Router에서의 인증
description: Expo Router로 인증을 구현하고 routes를 보호하는 방법.
---

# Expo Router에서의 인증

Expo Router로 인증을 구현하고 routes를 보호하는 방법.

> **참고:** 이 가이드는 SDK 53 이상이 필요합니다. 이전 버전의 이 가이드는 [Authentication (redirects)](/router/advanced/authentication-rewrites)를 참고하세요.

Expo Router에서는 모든 routes가 항상 정의되어 있고 접근 가능합니다. 사용자가 인증되었는지 여부에 따라 특정 화면에서 사용자를 다른 곳으로 보내기 위해 런타임 로직을 사용할 수 있습니다. routes 안에서 사용자를 인증하는 방법은 두 가지가 있습니다. 이 가이드는 표준 네이티브 앱의 동작을 보여주는 예제를 제공합니다.

## Protected Routes 사용하기

[Protected routes](/router/advanced/protected)는 client-side navigation을 사용해 사용자가 특정 routes에 접근하지 못하게 할 수 있도록 해줍니다. 사용자가 보호된 화면으로 이동하려 하거나, 화면이 활성 상태인 동안 보호 상태로 바뀌면 anchor route(보통 index screen) 또는 stack에서 사용 가능한 첫 번째 screen으로 리디렉션됩니다. 항상 접근 가능한 `/sign-in` route와 인증이 필요한 `(app)` group이 있는 다음 프로젝트 구조를 생각해 봅시다:

`src`

 `app`

  `_layout.tsx``무엇이 보호되는지 제어`

  `sign-in.tsx``항상 접근 가능`

  `(app)`

   `_layout.tsx``인증 필요`

   `index.tsx``(app)/_layout에 의해 보호되어야 함`

위 예제를 따르려면, 앱 전체에 인증 session을 노출할 수 있는 [React Context provider](https://react.dev/reference/react/createContext)를 설정하세요. 커스텀 인증 session provider를 직접 구현할 수도 있고, 아래 **Example authentication context**의 provider를 사용할 수도 있습니다.

Example authentication context

이 provider는 mock 구현을 사용합니다. 원하는 [authentication provider](/guides/authentication)로 바꿔 사용할 수 있습니다.

```tsx
import { use, createContext, type PropsWithChildren } from 'react';

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

// Use this hook to access the user info.
export function useSession() {
  const value = use(AuthContext);
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
  if (Platform.OS === 'web') {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.error('Local storage is unavailable:', e);
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

splash screen을 관리하기 위해 **SplashScreenController**를 만드세요. 인증 로딩은 비동기이므로, 인증이 로드될 때까지 splash screen을 계속 표시해 두세요.

```tsx
import { SplashScreen } from 'expo-router';
import { useSession } from './ctx';

SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const { isLoading } = useSession();

  if (!isLoading) {
    SplashScreen.hide();
  }

  return null;
}
```

루트 layout에 `SessionProvider`를 추가하세요. 이렇게 하면 앱 전체가 인증 context에 접근할 수 있습니다. `SplashScreenController`는 반드시 `SessionProvider` 안에 있어야 합니다.

```tsx
import { Stack } from 'expo-router';

import { SessionProvider } from '@/ctx';
import { SplashScreenController } from '@/splash';

export default function Root() {
  // Set up the auth context and render your layout inside of it.
  return (
    <SessionProvider>
      <SplashScreenController />
      <RootNavigator />
    </SessionProvider>
  );
}

// Create a new component that can access the SessionProvider context later.
function RootNavigator() {
  return <Stack />;
}
```

`/sign-in` 화면을 만드세요. 이 화면은 `signIn()`을 사용해 인증 상태를 전환합니다. 이 화면은 `(app)` group 밖에 있으므로, 이 화면을 렌더링할 때는 group의 layout과 인증 확인이 실행되지 않습니다. 덕분에 로그아웃된 사용자도 이 화면에 접근할 수 있습니다.

```tsx
import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { useSession } from '@/ctx';

export default function SignIn() {
  const { signIn } = useSession();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text
        onPress={() => {
          signIn();
          // Navigate after signing in. You may want to tweak this to ensure sign-in is successful before navigating.
          router.replace('/');
        }}>
        Sign In
      </Text>
    </View>
  );
}
```

이제 `SessionProvider`를 기반으로 routes를 보호하도록 `RootNavigator`를 수정하세요.

```tsx
// All import statements remain the same except you need to import `useSession` from your `ctx.tsx` file.
import { SessionProvider, useSession } from '@/ctx';

// All of the above code remains unchanged. Update the `RootNavigator` to protect routes based on your `SessionProvider` below.

function RootNavigator() {
  const { session } = useSession();

  return (
    <Stack>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
    </Stack>
  );
}
```

사용자가 sign out할 수 있는 인증된 화면을 구현하세요.

```tsx
import { Text, View } from 'react-native';

import { useSession } from '@/ctx';

export default function Index() {
  const { signOut } = useSession();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text
        onPress={() => {
          // The guard in `RootNavigator` redirects back to the sign-in screen.
          signOut();
        }}>
        Sign Out
      </Text>
    </View>
  );
}
```

**src/app/(app)/_layout.tsx**를 만드세요:

```tsx
import { Stack } from 'expo-router';

export default function AppLayout() {
  // This renders the navigation stack for all authenticated app routes.
  return <Stack />;
}
```

이제 초기 인증 상태가 로드될 때까지 splash screen을 보여주고, 사용자가 인증되지 않았으면 sign-in 화면으로 리디렉션하는 앱이 완성되었습니다. 사용자가 인증 확인이 있는 routes로 deep link를 방문하면 sign-in 화면으로 리디렉션됩니다.

## Modals and per-route authentication

또 다른 흔한 패턴은 앱 위에 sign-in modal을 렌더링하는 것입니다. 이렇게 하면 인증이 끝났을 때 deep link를 닫고 일부 상태를 유지할 수 있습니다. 하지만 이 패턴은 인증 없이도 데이터 로딩을 처리해야 하므로 background에서 routes가 렌더링되어야 합니다.

`src`

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
  initialRouteName: '(root)',
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

## More information

더 많은 패턴을 알아보려면 [Protected routes documentation](/router/advanced/protected)를 읽어보세요.

[How to use Protected Routes in Expo Router version 5 and later for smooth authentication](https://www.youtube.com/watch?v=XCTaMu0qnFY) — Expo Router version 5 이상에서 Protected Routes를 사용해 인증 흐름을 만드는 방법을 알아보세요.

## Middleware

전통적으로 웹사이트는 routes를 보호하기 위해 어떤 형태로든 서버 측 리디렉션을 활용할 수 있습니다. 현재 web의 Expo Router는 빌드 시점 정적 생성만 지원하며, custom middleware나 serving은 지원하지 않습니다. 이는 앞으로 더 나은 web 경험을 위해 추가될 수 있습니다. 그때까지는 client-side redirects와 loading state를 사용해 인증을 구현할 수 있습니다.
