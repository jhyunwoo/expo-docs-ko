---
modificationDate: February 28, 2026
title: Typed routes
description: Expo Router에서 정적으로 타입이 지정된 link와 route를 사용하는 방법을 알아보세요.
---

# Typed routes

Expo Router에서 정적으로 타입이 지정된 link와 route를 사용하는 방법을 알아보세요.

> 프로젝트에서 TypeScript를 사용할 때 이용할 수 있습니다. Expo Router는 별도 설정 없이 기본적으로 표준 TypeScript를 지원합니다. 설정 방법에 대한 자세한 내용은 [TypeScript](/guides/typescript) 가이드를 참고하세요.

Expo Router는 Expo CLI를 사용해 TypeScript 타입을 자동으로 생성하는 기능을 지원합니다. 이를 통해 `<Link>`와 [hooks API](/versions/latest/sdk/router#hooks)를 정적으로 타입 지정할 수 있습니다. 이 기능은 현재 beta이며 기본적으로 활성화되어 있지 않습니다.

## Get started

### Quick start

[Expo Router quick start guide](/router/introduction#quick-start)를 사용해 프로젝트를 만들었다면, 프로젝트는 이미 typed routes를 사용하도록 구성되어 있습니다. Expo CLI는 처음 `npx expo start`를 실행할 때 필요한 type file을 생성합니다. 그 후에는 **.tsx** 파일에서 Expo Router `<Link>` component를 사용할 때마다 `href` prop에 대해 autocomplete를 사용할 수 있습니다.

### Manual configuration

이 기능이 beta 상태인 동안에는 **app.json**에서 `experiments.typedRoutes`를 `true`로 설정해 활성화할 수 있습니다:

```json
{
  "expo": {
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

필요한 `includes` field가 추가되도록 **tsconfig.json**을 구성하기 위해 `npx expo customize tsconfig.json`을 실행하세요.

그런 다음 `npx expo start`를 실행해 development server를 시작하세요. 이제 Expo Router `<Link>` component의 `href` prop에서 autocomplete를 사용할 수 있습니다.

## Type generation

Expo Router의 typed routes는 development server가 시작될 때 자동으로 생성됩니다. 기본적으로 이렇게 생성된 타입은 Git에서 추적하지 않도록 구성되며, 로컬 **.gitignore** 파일에 추가됩니다. 이렇게 하면 자동 생성된 파일이 version control system을 어지럽히지 않습니다.

development server를 시작하지 않고도 이 타입을 생성해야 하는 상황이 있을 수 있습니다. 예를 들어 Continuous Integration(CI) server에서 type checking을 수행할 때입니다. 이 경우 CI에서 `npx expo customize tsconfig.json` 명령을 실행하세요.

## Statically typed routes

이제 `Href<T>`를 사용하는 component와 function은 정적으로 타입 지정되며 훨씬 더 엄격한 정의를 갖게 됩니다. 예를 들면 다음과 같습니다:

```tsx
✅ <Link href="/about" />
✅ <Link href="/user/1" />
✅ <Link href={`/user/${id}`} />
✅ <Link href={("/user" + id) as Href} />
// TypeScript errors if href is not a valid route
❌ <Link href="/usser/1" />
```

> **Note**: 프로젝트의 모든 유효한 route와 자동으로 일치하는 [`Route` type](/versions/latest/sdk/router#route)도 `expo-router`에서 제공합니다.

dynamic route의 경우 Href는 object여야 하며 parameter도 엄격하게 타입이 지정됩니다:

```tsx
✅ <Link href={{ pathname: "/user/[id]", params: { id: 1 }}} />
// TypeScript errors as href is valid, but it should be a HrefObject with params
❌ <Link href="/user/[id]" />
// TypeScript errors as params contain invalid keys
❌ <Link href={{ pathname: "/user/[id]", params: { _id: 1 }}} />
// TypeScript errors as params contain unknown keys
❌ <Link href={{ pathname: "/user/[id]", params: { id: 1, id2: 2 }}} />
```

### Relative paths

정적으로 타입 지정된 route는 상대 경로를 지원하지 않습니다. 모든 route에 절대 경로를 사용해야 합니다:

```tsx
✅ <Link href="/about" />

// Relative paths are not supported
❌ <Link href="./about" />
```

`expo-router`의 `useSegments()` hook을 활용하면 복잡한 상대 경로를 만들 수 있습니다. 다음 구조를 생각해 봅시다:

`src`

 `app`

  `(feed)`

   `_layout.tsx`

   `feed.tsx`

   `search.tsx`

   `profile.tsx`

  `(search)`

   `profile.tsx`

 `components`

  `button.tsx`

현재 route의 첫 번째 segment를 얻기 위해 `useSegments()` hook을 사용하면 같은 tab 안으로 push되도록 만들 수 있습니다.

```tsx
import { Link, useSegments } from 'expo-router';

export function Button() {
  const [
    // This will be either `(feed)` or `(search)` depending on the current tab.
    first,
  ] = useSegments();

  return <Link href={`/${first}/profile`}>Push profile</Link>;
}
```

이제 **src/app/(feed)/feed.tsx**와 **src/app/(search)/search.tsx** 모두에서 `<Button />`을 활용해 현재 tab을 유지한 채 `./profile`을 push할 수 있습니다.

특정 용도로 segment가 필요하다면 전체 route를 `useSegments`에 전달할 수 있습니다:

```tsx
import { Link, useSegments } from 'expo-router';

export function useMySegments() {
  const segments = useSegments<'/(search)/profile'>();
  //    ^? segments = ['(search)', 'profile']
  return segments;
}
```

## Imperative navigation

typed `router` object를 사용해 imperative하게 이동할 수 있습니다:

```tsx
import { router } from 'expo-router';

router.push('/about');
```

또는 typed `useRouter()` hook을 사용할 수도 있습니다:

```tsx
import { useRouter } from 'expo-router';

function Page() {
  const router = useRouter();

  router.push('/about');

  // ...
}
```

## Route parameters

강하게 타입이 지정된 route parameter를 위해서는 `useLocalSearchParams`와 `useGlobalSearchParams` hook에 전체 href를 전달할 수 있습니다. 예를 들면 다음과 같습니다:

```tsx
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Page() {
  const {
    profile, // string
    search, // string[]
  } = useLocalSearchParams<'/(search)/[profile]/[...search]'>();

  return (
    <>
      <Text>Profile: {profile}</Text>
      <Text>Search: {search.join(',')}</Text>
    </>
  );
}
```

## Query parameters

대부분의 query parameter는 파일 시스템에 표현되지 않으므로 자동으로 타입을 지정할 수 없습니다. `useLocalSearchParams`와 `useGlobalSearchParams` hook에 generic을 전달해 query parameter를 수동으로 타입 지정할 수 있습니다. 예를 들면 다음과 같습니다:

```tsx
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Page() {
  const { query } = useLocalSearchParams<{ query?: string }>();

  return <Text>Search: {query ?? 'unset'}</Text>;
}
```

route parameter와 query parameter를 함께 사용해야 한다면, 첫 번째 generic으로 route를 전달하고 그다음 query parameter를 전달하세요:

```tsx
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Page() {
  const { query, profile, search } = useLocalSearchParams<
    '/[profile]/[...search]',
    { query?: string }
  >();

  return <Text>Search: {query ?? 'unset'}</Text>;
}
```

## Changes made to the environment

typed routes가 활성화되면 Expo CLI는 프로젝트 루트 디렉터리에 Git에서 무시되는 **expo-env.d.ts** 파일을 생성하고, 새 루트 **expo-env.d.ts** 파일을 무시하도록 **.gitignore**를 업데이트하며, 새 **expo-env.d.ts** 파일을 포함하도록 **tsconfig.json**을 수정합니다.

**tsconfig.json**의 `includes` field는 **expo-env.d.ts**와 숨겨진 **.expo** 디렉터리를 포함하도록 업데이트됩니다. 이 항목들은 필수이며 파일에서 제거하면 안 됩니다.

생성된 **expo-env.d.ts**는 어떤 시점에도 삭제하거나 변경하면 안 됩니다. 이 파일은 commit하면 안 되며 version control에서 무시되어야 합니다.

### Global types

typed routes가 활성화되면 Expo CLI는 프로젝트에 다음 global type을 추가합니다:

-   `process.env.NODE_ENV = "development" | "production" | "test"`를 설정합니다
-   `.[css|sass|scss]` 파일을 import할 수 있게 합니다
-   `*.module.[css|sass|scss]`의 export를 `Record<string, string>`로 설정합니다
-   Metro의 `require.context`에 대한 type을 추가합니다. 이는 `expo/metro-config`에서 활성화되며 정적 route 생성에 사용됩니다.

### React Native Web

typed routes를 활성화하면 Expo CLI는 React Native Web을 지원하도록 `react-native` type도 확장합니다. 다음과 같은 변경이 이루어집니다:

-   `ViewStyle`, `TextStyle`, `ImageStyle`에 추가적인 web 전용 style을 추가합니다
-   `TextProps`에 `tabIndex`, `aria-level`, `lang`를 추가합니다
-   Pressable의 `children`과 `style` state callback function에 `hovered`를 추가합니다
-   `className` elements를 추가합니다
