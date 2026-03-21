---
modificationDate: March 06, 2026
title: Protected routes
description: client-side navigation에서 화면에 접근할 수 없도록 만드는 방법을 알아보세요.
---

# Protected routes

client-side navigation에서 화면에 접근할 수 없도록 만드는 방법을 알아보세요.

> Protected routes는 SDK 53 이상에서 사용할 수 있습니다.

[Watch: Using protected routes](https://www.youtube.com/watch?v=zHZjJDTTHJg) — Expo Router의 protected routes를 사용해 인증 상태에 따라 screen 접근을 제한하는 방법을 알아보세요.

## Overview

Protected screens를 사용하면 client-side navigation을 통해 사용자가 특정 routes에 접근하지 못하게 할 수 있습니다. 사용자가 보호된 screen으로 이동하려 하거나, screen이 활성 상태에서 보호 상태로 바뀌면 anchor route(보통 index screen) 또는 stack에서 사용 가능한 첫 번째 screen으로 리디렉션됩니다.

`src`

 `app`

  `_layout.tsx`

  `index.tsx`

  `about.tsx`

  `login.tsx``인증되지 않은 상태에서만 사용 가능해야 함`

  `private`

   `_layout.tsx``인증된 상태에서만 사용 가능해야 함`

   `index.tsx`

   `page.tsx`

```tsx
import { Stack } from 'expo-router';

const isLoggedIn = false;

export function AppLayout() {
  return (
    <Stack>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" />
      </Stack.Protected>

      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="private" />
      </Stack.Protected>
      {/* Expo Router includes all routes by default. Adding Stack.Protected creates exceptions for these screens. */}
    </Stack>
  );
}
```

이 예시에서는 `guard`가 false이므로 `/private` route에 접근할 수 없습니다. 사용자가 `/private`에 접근하려고 하면 anchor route인 **index** screen으로 리디렉션됩니다.

또한 사용자가 `/private/page`에 있는 상태에서 `guard` 조건이 **false**로 바뀌면 자동으로 리디렉션됩니다.

screen의 **guard**가 **true**에서 **false**로 바뀌면, 해당 screen의 모든 history entry가 navigation history에서 제거됩니다.

## Multiple protected screens

Expo Router에서는 하나의 screen이 **한 번에 하나의 활성 route group에만 존재할 수 있습니다**.

screen은 가장 적절한 group 또는 stack에서 한 번만 선언해야 합니다. screen의 가용성이 로직에 따라 달라진다면, screen을 중복 선언하는 대신 조건부 group으로 감싸세요.

```tsx
import { Stack } from 'expo-router';

const isLoggedIn = true;
const isAdmin = true;

export function AppLayout() {
  return (
    <Stack>
      <Stack.Protected guard={true}>
        <Stack.Screen name="profile" />
      </Stack.Protected>
      <Stack.Screen name="profile" /> // ❌ Not allowed: duplicate screen
    </Stack>
  );
}
```

## protected screens 중첩하기

Protected screens는 계층적인 접근 제어 로직을 정의하기 위해 중첩할 수 있습니다.

```tsx
import { Stack } from 'expo-router';

const isLoggedIn = true;
const isAdmin = true;

export function AppLayout() {
  return (
    <Stack>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Protected guard={isAdmin}>
          <Stack.Screen name="private" />
        </Stack.Protected>

        <Stack.Screen name="about" />
      </Stack.Protected>
    </Stack>
  );
}
```

이 경우:

-   `/private`는 사용자가 로그인되어 있고 admin인 경우에만 보호됩니다.
-   `/about`는 로그인한 모든 사용자에게 보호됩니다.

## 특정 screen으로 fallback하기

접근이 거부되었을 때 navigator가 특정 screen으로 fallback되도록 구성할 수 있습니다.

`src`

 `app`

  `_layout.tsx`

  `index.tsx`

  `about.tsx`

  `login.tsx`

  `private`

   `_layout.tsx`

   `index.tsx`

   `page.tsx`

```tsx
import { Stack } from 'expo-router';

const isLoggedIn = false;

export function AppLayout() {
  return (
    <Stack>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="index" />
        <Stack.Screen name="private" />
      </Stack.Protected>

      <Stack.Screen name="login" />
    </Stack>
  );
}
```

위 예시에서는 **index** screen도 보호되어 있고 `guard`가 **false**이므로, router는 첫 번째로 사용 가능한 screen인 **login**으로 리디렉션됩니다.

## Tabs와 Drawer

Protected routes는 [Tabs](/router/advanced/tabs)와 [Drawer](/router/advanced/drawer) navigators에서도 사용할 수 있습니다.

```tsx
import { Tabs } from 'expo-router';

const isLoggedIn = false;

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ tabBarLabel: 'Home' }} />
      <Tabs.Protected guard={isLoggedIn}>
        <Tabs.Screen name="private" options={{ tabBarLabel: 'Private' }} />
        <Tabs.Screen name="profile" options={{ tabBarLabel: 'Profile' }} />
      </Tabs.Protected>

      <Tabs.Protected guard={!isLoggedIn}>
        <Tabs.Screen name="login" options={{ tabBarLabel: 'Login' }} />
      </Tabs.Protected>
    </Tabs>
  );
}
```

## Custom navigators

`Protected`는 `withLayoutContext` hook을 사용하는 [custom navigators](/router/migrate/from-react-navigation#rewrite-custom-navigators)에서도 사용할 수 있습니다.

## Static rendering 고려 사항

Protected screens는 클라이언트 측에서만 평가됩니다. 정적 사이트 생성 중에는 보호된 routes용 HTML 파일이 생성되지 않습니다. 하지만 사용자가 이 routes의 URL을 알고 있다면 해당 HTML 또는 JavaScript 파일을 직접 요청할 수는 있습니다. Protected screens는 서버 측 인증이나 접근 제어를 대체하는 기능이 아닙니다.
