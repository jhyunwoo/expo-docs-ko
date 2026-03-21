---
modificationDate: February 26, 2026
title: Common navigation patterns in Expo Router
description: 앱에서 사용할 수 있는 실제 navigation 패턴에 Expo Router의 기본 개념을 적용해보세요.
---

# Common navigation patterns in Expo Router

앱에서 사용할 수 있는 실제 navigation 패턴에 Expo Router의 기본 개념을 적용해보세요.

이제 Expo Router에서 파일과 디렉터리의 이름을 짓고 배치하는 기본 방식을 알게 되었으니, 그 지식을 실제 앱에서 사용할 수 있는 몇 가지 navigation 패턴에 적용해봅시다.

## Stacks inside tabs: nested navigators

앱의 일반적인 시작 지점이 tab 집합이지만, 하나 이상의 tab에 둘 이상의 screen이 연결될 수 있다면 tab 안에 stack navigator를 중첩하는 것이 좋은 방법인 경우가 많습니다. 이 패턴은 대체로 직관적인 URL을 만들고, primary tab이 항상 보이는 경우가 많은 desktop web 앱까지도 잘 확장됩니다.

다음 navigation tree를 생각해봅시다:

`src`

 `app`

  `(tabs)`

   `_layout.tsx`

   `index.tsx``single page tab`

   `feed`

    `_layout.tsx``tab with a stack inside`

    `index.tsx`

    `[postId].tsx`

   `settings.tsx``single page tab`

**src/app/(tabs)/_layout.tsx** 파일에서 `Tabs` component를 반환합니다:

```tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="feed" options={{ title: 'Feed' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
```

**src/app/(tabs)/feed/_layout.tsx** 파일에서 `Stack` component를 반환합니다:

```tsx
import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function FeedLayout() {
  return <Stack />;
}
```

이제 **src/app/(tabs)/feed** 디렉터리 안에서 서로 다른 post를 가리키는 `Link` component(예: `/feed/123`)를 둘 수 있습니다. 이 link들은 `feed/[postId]` route를 stack 위로 push하면서 tab navigator는 그대로 보이게 유지합니다.

같은 URL을 사용해 다른 tab 어디에서든 feed tab의 post로 이동할 수도 있습니다. `feed/index` route가 항상 stack의 첫 번째 screen이 되도록 하려면 `withAnchor`를 `initialRouteName`과 함께 사용하세요:

```tsx
<Link href="/feed/123" withAnchor>
  Go to post
</Link>
```

outer stack navigator 안에 tabs를 중첩할 수도 있습니다. 이런 방식은 tab 위에 modal을 표시할 때 더 유용한 경우가 많습니다.

[Nested navigators](/router/advanced/nesting-navigators) — Expo Router 앱에서 nested navigator를 사용하는 방법을 더 알아보세요.

## Different tabs per platform: platform-specific tabs

cross-platform 앱을 만들 때 Android와 iOS에서는 플랫폼 네이티브 look and feel을 위해 [native tabs](/router/advanced/native-tabs)를 사용하고, web에서는 스타일을 완전히 제어하기 위해 [custom tabs](/router/advanced/custom-tabs)를 사용하고 싶을 수 있습니다. 이 패턴은 [platform-specific file extensions](/router/advanced/platform-specific-modules)를 사용해 구현할 수 있습니다.

`src`

 `app`

  `_layout.tsx``imports AppTabs`

  `index.tsx`

  `feed.tsx`

  `profile.tsx`

 `components`

  `app-tabs.native.tsx``AppTabs (native tabs) for Android and iOS`

  `app-tabs.tsx``AppTabs (custom tabs) for web`

루트 layout은 `AppTabs` component를 렌더링합니다. Expo의 module resolution은 Android와 iOS에서는 자동으로 **app-tabs.native.tsx**를 선택하고, web에서는 **app-tabs.tsx**를 선택하므로, 각 플랫폼이 자기 관례에 맞는 tab 구현을 사용할 수 있습니다.

코드가 포함된 전체 예시는 Layout 가이드의 [Platform-specific tabs](/router/basics/layout#platform-specific-tabs)를 참고하세요.

## One screen, two tabs: sharing routes

route group을 사용하면 하나의 screen을 두 개의 서로 다른 tab 사이에서 공유할 수 있습니다. 예를 들어 Feed tab과 Search tab이 있고, 두 tab이 모두 사용자 profile을 보는 페이지를 공유하는 navigation tree를 생각해봅시다:

`src`

 `app`

  `(tabs)`

   `_layout.tsx`

   `(feed)`

    `index.tsx``default route`

   `(search)`

    `search.tsx`

   `(feed,search)`

    `_layout.tsx``layout shared between the two tabs`

    `users`

     `[username].tsx``shared user profile page`

각 tab은 group 안에 들어가므로, 두 group 사이에서 route를 공유하는 세 번째 디렉터리(**src/app/(tabs)/(feed,search)/**)를 정의할 수 있습니다. 레이어가 하나 더 생겨도 **src/app/(tabs)/(feed)/index.tsx**가 여전히 가장 가까운 index이므로 기본 route가 됩니다.

```tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="(feed)" options={{ title: 'Feed' }} />
      <Tabs.Screen name="(search)" options={{ title: 'Search' }} />
    </Tabs>
  );
}
```

`(feed)`와 `(search)` route group 둘 다 stack을 포함하므로 하나의 layout도 공유할 수 있습니다:

```tsx
import { Stack } from 'expo-router';

export default function SharedLayout() {
  return <Stack />;
}
```

shared group이 shared page만 포함하고, 각 개별 group이 자신만의 layout 파일을 가지도록 구성하는 것도 가능합니다.

이제 두 tab 모두 `/users/evanbacon`으로 이동해 같은 사용자 profile 페이지를 볼 수 있습니다.

이미 어떤 tab에 포커스된 상태에서 사용자로 이동하면 현재 tab의 group 안에 머무르게 됩니다. 하지만 앱 밖에서 사용자 profile 페이지로 직접 deep-linking할 때는 Expo Router가 두 group 중 하나를 골라야 하므로 알파벳 순으로 첫 번째 group을 선택합니다. 따라서 `/users/evanbacon`으로 deep-linking하면 Feed tab 안에서 사용자 profile이 표시됩니다.

[Shared routes](/router/advanced/shared-routes) — Expo Router에서 서로 다른 route가 같은 URL을 공유하는 방법을 더 알아보세요.

## Authenticated users only: protected routes

인증이 필요한 모바일 앱에서는 인증된 사용자만 접근할 수 있어야 하는 route 집합이 필요할 가능성이 큽니다.

예를 들어 bottom tabs layout, sign-in 페이지, 계정 생성 페이지, 그리고 인증된 사용자에게만 보여야 하는 modal이 있는 다음 navigation tree를 생각해봅시다:

`src`

 `app`

  `_layout.tsx``Root layout`

  `(tabs)`

   `_layout.tsx`

   `index.tsx``Protected`

   `settings.tsx``Protected`

  `sign-in.tsx`

  `create-account.tsx`

  `modal.tsx``Protected`

앱이 처음 실행되면 router는 루트 index인 **src/app/(tabs)/index.tsx**를 열려고 시도합니다. 이 screen을 `guard={false}`인 `Stack.Protected`로 감싸면 screen은 접근 불가 상태가 되고 대신 다음으로 사용 가능한 screen이 열립니다. 이 예시에서는 다음 사용 가능한 route인 `sign-in` screen이 열리게 됩니다.

```tsx
import { Stack } from 'expo-router';
import { useAuthState } from '@/utils/authState';

export default function RootLayout() {
  const { isLoggedIn } = useAuthState();

  return (
    <Stack>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" />
      </Stack.Protected>

      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="create-account" />
      </Stack.Protected>
    </Stack>
  );
}
```

이렇게 하면 store에서 auth state를 가져와 알맞은 screen을 보여줄 수 있습니다. auth state가 바뀌면 layout이 다시 렌더링되므로, `isLoggedIn`이 `false`에서 `true`로 바뀌면 앱은 자동으로 `(tabs)` group의 루트로 이동합니다.

protected route의 또 다른 장점은 페이지로 직접 deep link해도 검사된다는 점입니다. 예를 들어 인증되지 않은 사용자가 위의 modal screen으로 deep link하면 sign-in 페이지로 리디렉션됩니다.

protected route는 bottom tab을 조건부로 표시하는 데도 사용할 수 있습니다. 이 예시에서는 `vip` tab이 VIP 회원인 인증 사용자에게만 표시됩니다:

```tsx
import { Stack } from 'expo-router';
import { useAuthState } from '@/utils/authState';

export default function TabsLayout() {
  const { isVip } = useAuthState();

  return (
    <Tabs>
      <Tabs.Screen name="index" />

      <Tabs.Protected guard={isVip}>
        <Tabs.Screen name="vip" />
      </Tabs.Protected>

      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
```

[Expo Router authentication](/router/advanced/authentication) — protected route를 사용해 authentication을 구현하는 심화 가이드를 따라가 보세요.

## Sometimes the best route isn't a route at all

navigation state를 서로 다른 route로 분리하는 목적은 결국 여러분과 앱을 돕기 위한 것입니다. 때로는 가장 좋은 패턴이 아예 다른 route로 이동하는 것을 포함하지 않을 수도 있습니다. layout 파일은 결국 React component이므로 navigator 주변, 옆, 혹은 navigator 대신에도 온갖 UI를 표시하는 데 사용할 수 있습니다.

authentication 예시로 돌아가 보면, 사용자가 로그인하지 않으면 특정 페이지에 아예 방문할 수 없어야 할 때 protected route 설정은 아주 잘 작동합니다. 하지만 인증되지 않은 사용자도 읽기 전용 모드로 앱을 둘러볼 수 있어야 한다면 어떨까요? 그런 경우에는 사용자를 로그인 페이지로 리디렉션하는 대신 앱 위에 login modal을 표시하고 싶을 수 있습니다:

```tsx
import { Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

export default function Layout() {
  const isAuthenticated = /* check for valid auth token / session */

  return (
    <SafeAreaView>
      <Stack />
      <Modal visible={!isAuthenticated}>{/* login UX */}</Modal>
    </SafeAreaView>
  );
}
```

[Modals in Expo Router](/router/advanced/modals) — layout 파일 안에서 modal을 사용하는 방법을 포함해 Expo Router에서 modal을 표시하는 여러 패턴을 알아보세요.
