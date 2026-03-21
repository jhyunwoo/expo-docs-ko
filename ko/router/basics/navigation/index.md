---
modificationDate: March 10, 2026
title: Navigating between pages in Expo Router
description: Expo Router에서 page로 link하고 이동하는 다양한 방법을 알아보세요.
---

# Navigating between pages in Expo Router

Expo Router에서 page로 link하고 이동하는 다양한 방법을 알아보세요.

앱에 몇 개의 page와 그 layout을 준비했다면, 이제 page 사이를 이동할 차례입니다. Expo Router의 navigation은 React Navigation과 매우 비슷하게 동작하지만, 모든 page가 기본적으로 URL을 가지므로 familiar한 웹 패턴을 사용해 link를 만들고 이 URL로 앱 안을 이동할 수 있습니다.

## Native navigation basics with `useRouter`

React Navigation과 마찬가지로 `onPress` handler 안에서 함수를 호출해 다른 page로 이동할 수 있습니다. Expo Router에서는 `useRouter` hook을 사용해 navigation 함수에 접근할 수 있습니다:

```tsx
import { useRouter } from 'expo-router';
import { Button } from 'react-native';

export default function Home() {
  const router = useRouter();

  return <Button title="Go to About" onPress={() => router.navigate('/about')} />;
}
```

Expo Router 앱은 기본적으로 stack navigation을 사용하며, 새 route로 이동하면 screen이 stack 위에 push되고, 그 route에서 뒤로 나가면 stack에서 pop됩니다. 보통은 `router.navigate` 함수를 사용하면 됩니다. 이 함수는 새 page를 stack에 push하거나, stack 안에 이미 존재하는 route로 되돌아갑니다. 하지만 `router.push`를 호출해 새 page를 명시적으로 stack에 push하거나, `router.back`으로 이전 page로 돌아가거나, `router.replace`로 stack의 현재 page를 교체할 수도 있습니다.

Expo Router에서는 page를 URL 또는 **src/app** 디렉터리를 기준으로 한 상대 위치로 참조합니다. 다음 파일 구조와 각 page로 이동하는 방식을 살펴보세요:

`src`

 `app`

  `index.tsx``router.navigate("/")`

  `about.tsx``router.navigate("/about")`

  `profile`

   `index.tsx``router.navigate("/profile")`

   `friends.tsx``router.navigate("/profile/friends")`

[Router imperative navigation API reference](/versions/latest/sdk/router#router) — imperative navigation에 사용할 수 있는 모든 함수를 알아보세요.

## Links and buttons

Expo Router에서 page로 link하는 일반적인 방법은 웹 앱처럼 link를 사용하는 것입니다. Expo Router에는 page 사이를 이동하기 위한 `Link` component가 있으며, 이때 `href`는 `router.navigate`에 쓰는 route와 같습니다:

```tsx
import { View } from 'react-native';
import { Link } from 'expo-router';

export default function Page() {
  return (
    <View>
      <Link href="/about">About</Link>
    </View>
  );
}
```

기본적으로 `Link` component는 children을 `<Text>` element 안에 렌더링합니다. 즉, `View` 같은 비텍스트 child는 예상치 못한 layout 동작을 보일 수 있습니다. layout을 완전히 제어하려면 `asChild` prop을 `Pressable`이나 `onPress`/`onClick` prop을 받는 다른 component와 함께 사용하세요:

```tsx
import { Pressable, Text } from 'react-native';
import { Link } from 'expo-router';

export default function Page() {
  return (
    <Link href="/other" asChild>
      <Pressable>
        <Text>Home</Text>
      </Pressable>
    </Link>
  );
}
```

[Link API reference](/versions/latest/sdk/router#link) — navigation에 Link를 사용할 때 사용할 수 있는 option을 알아보세요.

[Link preview](/router/reference/link-preview) — Expo Router 사용 시 iOS에서 link에 preview를 추가하는 방법을 알아보세요.

## Relative routes

항상 route의 절대 경로를 사용할 필요는 없습니다. `./`(현재 디렉터리) 또는 `../`(부모 디렉터리)로 시작하는 path를 사용하면 현재 route를 기준으로 상대 이동합니다.

상대 URL은 `./article`이나 `./article/`처럼 `./`가 앞에 붙은 URL입니다. 상대 URL은 현재 렌더링된 screen을 기준으로 해석됩니다.

```tsx
<Link href="./article">Go to article</Link>
```

```ts
router.navigate('./article');
```

## Dynamic routes and URL parameters

[Using dynamic routes with Expo Router](https://www.youtube.com/watch?v=izZv6a99Roo&t=350) — route의 일부 segment를 dynamic하게 만드는 방법을 알아보세요.

dynamic route는 전체 URL로 link할 수도 있고, `params` object를 전달해서 link할 수도 있습니다.

다음 파일 구조를 생각해봅시다:

`src`

 `app`

  `user`

   `[id].tsx`

아래 link들은 모두 같은 page로 이동합니다:

```tsx
import { Link, router } from 'expo-router';
import { View, Pressable, Text } from 'react-native';

export default function Page() {
  return (
    <View>
      <Link
        href="/user/bacon">
        View user (id inline)
      </Link>
      <Link
        href={{
          pathname: '/user/[id]',
          params: { id: 'bacon' }
        }}
      >
        View user (id in params in href)
      </Link>
      <Pressable
        onPress={() =>
          router.navigate({
            pathname: '/user/[id]',
            params: { id: 'bacon' }
          })
        }
      >
        <Text>View user (imperative)</Text>
      </Pressable>
    </View>
  );
}
```

> 일부 parameter는 Expo Router와 React Navigation에서 내부적으로 사용하도록 예약되어 있습니다. [Using URL parameters guide](/router/reference/url-parameters#reserved-parameters)에서 확인할 수 있습니다.

### Passing query parameters

query parameter는 link URL 자체에 지정하거나, `params` object 안의 추가 parameter로 지정할 수 있습니다. dynamic route 변수 이름과 일치하지 않는 parameter는 모두 query parameter와 동일하게 처리됩니다.

```tsx
<Link href="/users?limit=20">View users</Link>

<Link
  href={{
    pathname: '/users',
    params: { limit: 20 }
  }}>
  View users
</Link>
```

### Using dynamic route variables and query parameters in the destination page

link URL 안의 모든 변수는 `useLocalSearchParams` hook을 통해 받는 page에서 접근할 수 있습니다. 이 hook은 `params`로 전달된 값을 포함해 URL parameter 전체를 담은 object를 반환합니다.

예를 들어 다음과 같은 link가 있다면:

```tsx
<Link href="/users?limit=20">View users</Link>
```

반대편에서는 parameter를 이렇게 읽을 수 있습니다:

```tsx
import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function Users() {
  const { id, limit } = useLocalSearchParams();

  return (
    <View>
      <Text>User ID: {id}</Text>
      <Text>Limit: {limit}</Text>
    </View>
  );
}
```

### Updating query parameters without navigating

query parameter는 새 page로 이동하지 않고도 업데이트할 수 있습니다. 현재 page와 같은 URL을 사용하되 query parameter만 바꾼 `Link`를 사용하거나, imperative 방식으로 처리하면 됩니다.

```tsx
<Link href="/users?limit=50">View more users</Link>

<Pressable onPress={() => router.setParams({ limit: 50 })}>
  <Text>View more users</Text>
</Pressable>
```

[Using URL parameters](/router/reference/url-parameters) — Expo Router에서 URL parameter를 설정하고 사용하는 방법을 더 알아보세요.

## Redirects

`Redirect` component를 사용하면 page나 layout에서 즉시 다른 route로 리디렉션할 수 있습니다. 이는 imperative navigation 함수인 `replace`처럼 동작합니다. redirect는 현재 page를 렌더링하지 않고 바로 새 route로 이동합니다.

```tsx
import { Redirect } from 'expo-router';

export default function Page() {
  return <Redirect href="/about" />;
}
```

## Prefetching

`<Link />` component의 `prefetch` prop은 component가 렌더링될 때 대상 screen을 미리 불러오는 prefetch를 활성화합니다. 이를 통해 screen을 미리 준비해 더 빠르게 이동할 수 있습니다.

```tsx
import { Link } from 'expo-router';

export default function Page() {
  return <Link href="/about" prefetch />;
}
```

`prefetch`가 설정되면 Expo Router는 대상 screen을 화면 밖에서 렌더링하려고 시도합니다. 정확한 동작은 사용하는 navigator 유형에 따라 달라집니다:

-   **Expo Router Navigators**: preload를 가능하게 하기 위해 대상 screen을 화면 밖에서 렌더링합니다.
-   **Custom Navigators**: prefetch를 다르게 구현하거나 아예 지원하지 않을 수 있습니다.

stack navigator에서 screen이 preload되면 몇 가지 제한이 생깁니다:

-   imperative `router` API를 사용할 수 없습니다.
-   `useNavigation().setOptions()`로 option을 업데이트할 수 없습니다
-   navigator의 event(focus, tabPress 등)를 들을 수 없습니다.

screen으로 실제 이동하면 navigation object가 업데이트됩니다. 그래서 useEffect hook 안에 event listener가 있고 navigation을 dependency로 두고 있다면, screen으로 이동했을 때 listener가 추가됩니다:

```tsx
const navigation = useNavigation();

useEffect(() => {
  const unsubscribe = navigation.addListener('tabPress', () => {
    // do something
  });

  return () => {
    unsubscribe();
  };
}, [navigation]);
```

비슷하게 action을 dispatch하거나 option을 업데이트할 때도, screen이 focus된 상태인지 확인한 뒤 처리할 수 있습니다:

```tsx
const navigation = useNavigation();

if (navigation.isFocused()) {
  navigation.setOptions({ title: 'Updated title' });
}
```

자세한 내용은 [React Navigation preload docs](https://reactnavigation.org/docs/navigation-object/#preload)를 참고하세요.

## Deep links

deep linking은 URL이 앱 안의 특정 page를 여는 것을 뜻합니다. Expo Router는 기본적으로 deep linking을 지원하므로, 앱 안에서 `Link`로 하듯이 앱 밖에서도 URL로 앱의 어떤 page든 link할 수 있습니다. 이것은 앱 안의 특정 page에 대한 link를 공유할 때 특히 유용합니다.

web에서는 웹 브라우저에서 해당 URL로 이동하는 것만으로 deep linking이 됩니다. 모바일에서는 [app config](/workflow/configuration) 파일에 `scheme`을 정의하고, 이것이 앱으로 들어오는 deep link의 prefix가 됩니다.

`scheme`이 `myapp`이라고 가정하면, 웹 페이지나 다른 앱에서 앱 안의 page로 link하는 예시는 다음과 같습니다:

`src`

 `app`

  `about.tsx``myapp://about`

  `profile`

   `index.tsx``myapp://profile`

  `users`

   `[username].tsx``myapp://users/evanbacon`

app link와 universal link를 사용하면 `https` URL로도 앱에 link할 수 있습니다. 자세한 내용은 [Universal linking](/linking/overview#universal-linking)을 참고하세요.

## Initial routes

앱 안의 page로 deep link를 열 때, 사용자가 home page에서 그 page로 이동한 것처럼 back navigation이 동작하길 원할 가능성이 큽니다. 이를 위해 layout 안에서 deep linked page보다 먼저 로드되어야 하는 page를 정의하는 `initialRouteName` configuration을 지정할 수 있습니다.

다음 파일 구조를 생각해봅시다:

`src`

 `app`

  `index.tsx`

  `stack`

   `index.tsx`

   `second.tsx`

   `_layout.tsx`

`stack`은 stack navigator이며 `/stack/index`는 항상 stack의 첫 번째 route입니다.

사용자가 `/stack/second`로 deep link하더라도 `/stack/index`가 항상 먼저 로드되게 하려면 **src/app/stack/_layout.tsx**에서 `initialRouteName`을 설정할 수 있습니다:

```tsx
export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: 'index',
};
```

기본적으로 `initialRouteName`은 deep linking할 때만 고려되며 앱 내부 navigation 중에는 고려되지 않습니다. 하지만 `Link`의 `withAnchor` prop을 사용하면 앱 안에서 다른 stack 내부로 직접 이동할 때도 initial route가 먼저 로드되도록 강제할 수 있습니다.

따라서 **src/app/index.tsx**에 `/stack/second`로 가는 link가 있다면 `withAnchor` prop을 추가해 `/stack/index`가 먼저 로드되도록 하세요. 그러면 사용자가 `/stack/second`에서 back button을 눌렀을 때 `/stack/index`로 돌아가게 됩니다:

```tsx
<Link href="/stack/second" withAnchor>
  Go to second
</Link>
```

> deep link를 테스트할 때 back button이 보이지 않는다면, `initialRouteName`을 설정하면 해결되는 경우가 많습니다.
