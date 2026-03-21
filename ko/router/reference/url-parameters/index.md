---
modificationDate: February 26, 2026
title: Using URL parameters
description: 앱에서 route parameter와 search parameter에 접근하고 수정하는 방법을 알아보세요.
---

# Using URL parameters

앱에서 route parameter와 search parameter에 접근하고 수정하는 방법을 알아보세요.

URL parameter에는 **route parameters**와 **search parameters**가 모두 포함됩니다. Expo Router는 이러한 parameter에 접근하고 수정하기 위한 hook을 제공합니다.

## Difference between route and search parameters

Route parameter는 `/profile/[user]`처럼 URL path에 정의되는 dynamic segment이며, 여기서 `user`가 route parameter입니다. 이들은 route를 매칭하는 데 사용됩니다.

Search parameter는 query param이라고도 하며, `/profile?extra=info`처럼 URL에 덧붙일 수 있는 직렬화 가능한 field입니다. 여기서 `extra`가 search parameter입니다. 이들은 일반적으로 페이지 사이에 데이터를 전달하는 데 사용됩니다.

## Local versus global URL parameters

nested app에서는 종종 **여러 페이지가 동시에 mount된 상태**가 됩니다. 예를 들어 stack에서는 새 route가 push될 때 이전 페이지와 현재 페이지가 모두 메모리에 남아 있습니다. 이 때문에 Expo Router는 URL parameter에 접근하기 위한 두 가지 서로 다른 hook을 제공합니다:

-   **useLocalSearchParams**: 현재 component의 URL parameter를 반환합니다. global URL이 route와 일치할 때만 업데이트됩니다.
-   **useGlobalSearchParams**: component와 관계없이 global URL을 반환합니다. URL param이 바뀔 때마다 업데이트되며, background에서 component가 불필요하게 업데이트될 수 있습니다.

`useGlobalSearchParams`와 `useLocalSearchParams` hook을 사용하면 component 내부에서 이러한 parameter에 접근할 수 있어, 두 종류의 URL parameter를 모두 가져오고 활용할 수 있습니다.

두 hook 모두 타입이 지정되며 사용하는 방식도 같습니다. 차이는 얼마나 자주 업데이트되는지뿐입니다.

아래 예제는 `useLocalSearchParams`와 `useGlobalSearchParams`의 차이를 보여줍니다. 이 예제는 다음 **app** 디렉터리 구조를 사용합니다:

`src`

 `app`

  `_layout.tsx`

  `index.tsx`

  `[user].tsx`

Root Layout은 stack navigator입니다:

```tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return <Stack />;
}
```

초기 route는 **user=evanbacon**과 함께 dynamic route **src/app/[user].tsx**로 리디렉션됩니다:

```tsx
import { Redirect } from 'expo-router';

export default function Route() {
  return <Redirect href="/evanbacon" />;
}
```

dynamic route **src/app/[user]**는 global 및 local URL parameter를 출력합니다. 이 경우 route parameter입니다. 또한 서로 다른 **route parameters**를 사용해 같은 route의 새 인스턴스를 push할 수도 있습니다:

```tsx
import { Text, View } from 'react-native';
import { useLocalSearchParams, useGlobalSearchParams, Link } from 'expo-router';

const friends = ['charlie', 'james']

export default function Route() {
  const glob = useGlobalSearchParams();
  const local = useLocalSearchParams();

  console.log("Local:", local.user, "Global:", glob.user);

  return (
    <View>
      <Text>User: {local.user}</Text>
      {friends.map(friend => (
        <Link key={friend} href={`/${friend}`}>
          Visit {friend}
        </Link>
      ))}
    </View>
  );
}
```

앱이 시작되면 다음 로그가 출력됩니다:

```sh
Local: evanbacon Global: evanbacon
```

"Visit charlie"를 누르면 **user=charlie**와 함께 `/[user]`의 새 인스턴스가 push되고, 다음 로그가 출력됩니다:

```sh
Local: charlie Global: charlie
Local: evanbacon Global: charlie
```

"Visit james"를 누르면 비슷한 효과가 발생합니다:

```sh
Local: james Global: james
Local: evanbacon Global: james
Local: charlie Global: james
```

**결과:**

-   URL의 **route parameters**가 바뀌면 `useGlobalSearchParams` 때문에 background screen이 다시 렌더링되었습니다. 과도하게 사용하면 성능 문제를 일으킬 수 있습니다.
-   Global re-render는 stack 순서대로 실행되므로 첫 번째 screen이 먼저 다시 렌더링되고, 그다음 **user=charlie** screen이 다시 렌더링됩니다.
-   global URL의 **route parameters**가 바뀌어도 `useLocalSearchParams`는 그대로 유지되었습니다. 이 동작을 data fetching에 활용하면 이전 screen으로 돌아갈 때도 앞선 screen의 데이터를 계속 사용할 수 있습니다.

## Statically-typed URL parameters

`useLocalSearchParams`와 `useGlobalSearchParams`는 모두 generic을 사용해 정적으로 타입 지정할 수 있습니다. 다음은 `user` route parameter의 예입니다:

```tsx
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Route() {
  const { user } = useLocalSearchParams<{ user: string }>();

  return <Text>User: {user}</Text>;
}

// Given the URL: `/evanbacon`
// The following is returned: { user: "evanbacon" }
```

search parameter(예: `?query=...`)는 optional하게 타입 지정할 수 있습니다:

```tsx
const { user, query } = useLocalSearchParams<{ user: string; query?: string }>();

// Given the URL: `/evanbacon?query=hello`
// The following is returned: { user: "evanbacon", query: "hello" }
```

rest 문법(`...`)과 함께 사용하면 route parameter는 문자열 배열로 반환됩니다:

```tsx
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Route() {
  const { everything } = useLocalSearchParams<{
    everything: string[];
  }>();
  const user = everything[0];

  return <Text>User: {user}</Text>;
}

// Given the URL: `/evanbacon/123`
// The following is returned: { everything: ["evanbacon", "123"] }
```

search parameter는 계속해서 각각의 문자열로 반환됩니다:

```tsx
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Route() {
  const { everything } = useLocalSearchParams<{
    everything: string[];
    query?: string;
    query2?: string;
  }>();
  const user = everything[0];

  return <Text>User: {user}</Text>;
}

// Given the URL: `/evanbacon/123?query=hello&query2=world`
// The following is returned: { everything: ["evanbacon", "123"], query: "hello", query2: "world" }
```

## Updating URL parameters

URL parameter는 imperative API의 **router.setParams** function을 사용해 업데이트할 수 있습니다. URL parameter를 업데이트해도 history stack에 새로운 항목이 push되지는 않습니다.

다음 예제는 `<TextInput>`을 사용해 search parameter **q**를 업데이트합니다:

```tsx
import { useLocalSearchParams, router } from 'expo-router';
import { useState } from 'react';
import { TextInput, View } from 'react-native';

export default function Page() {
  const params = useLocalSearchParams<{ query?: string }>();
  const [search, setSearch] = useState(params.query);

  return (
    <TextInput
      value={search}
      onChangeText={search => {
        setSearch(search);
        router.setParams({ query: search });
      }}
      placeholderTextColor="#A0A0A0"
      placeholder="Search"
      style={{
        borderRadius: 12,
        backgroundColor: '#fff',
        fontSize: 24,
        color: '#000',
        margin: 12,
        padding: 16,
      }}
    />
  );
}
```

다음은 `onPress` event를 사용해 route parameter **user**를 업데이트하는 예제입니다:

```tsx
import { useLocalSearchParams, router } from 'expo-router';
import { Text } from 'react-native';

export default function User() {
  const params = useLocalSearchParams<{ user: string }>();

  return (
    <>
      <Text>User: {params.user}</Text>
      <Text onPress={() => router.setParams({ user: 'evan' })}>Go to Evan</Text>
    </>
  );
}
```

## Route parameters versus search parameters

Route parameter는 route를 매칭하는 데 사용되고, search parameter는 route 사이에 데이터를 전달하는 데 사용됩니다. 다음 구조를 보세요. 여기서는 route parameter가 _user_ route를 매칭하는 데 사용됩니다:

`src`

 `app`

  `index.tsx`

  `[user].tsx``` `user`는 **route parameter**입니다 ```

`src/app/[user]` route가 매칭되면 `user` parameter가 component에 전달되며 nullish 값이 되는 일은 없습니다. search parameter와 route parameter는 함께 사용할 수 있으며, 둘 다 `useLocalSearchParams`와 `useGlobalSearchParams` hook으로 접근할 수 있습니다:

```tsx
import { useLocalSearchParams } from 'expo-router';

export default function User() {
  const {
    // The route parameter
    user,
    // An optional search parameter.
    tab,
  } = useLocalSearchParams<{ user: string; tab?: string }>();

  console.log({ user, tab });

  // Given the URL: `/bacon?tab=projects`, the following is printed:
  // { user: 'bacon', tab: 'projects' }

  // Given the URL: `/expo`, the following is printed:
  // { user: 'expo', tab: undefined }
}
```

route parameter가 바뀔 때마다 component는 다시 mount됩니다.

```tsx
import { Text } from 'react-native';
import { router, useLocalSearchParams, Link } from 'expo-router';

export default function User() {
  // All three of these will change the route parameter `user`, and add a new user page.
  return (
    <>
      <Text onPress={() => router.setParams({ user: 'evan' })}>Go to Evan</Text>
      <Text onPress={() => router.push('/mark')}>Go to Mark</Text>
      <Link href="/charlie">Go to Charlie</Link>
    </>
  );
}
```

## Hash support

URL [hash](https://developer.mozilla.org/en-US/docs/Web/API/URL/hash)는 URL에서 `#` 기호 뒤에 오는 문자열입니다. 보통 웹사이트에서 페이지의 특정 section으로 링크할 때 사용되지만, 데이터를 저장하는 데도 사용할 수 있습니다. Expo Router는 hash를 `#`라는 이름의 특별한 search parameter로 취급합니다. [search parameters](/router/reference/url-parameters#local-versus-global-search-parameters)에서 사용하는 것과 동일한 hook과 API로 접근하고 수정할 수 있습니다.

```tsx
import { Text } from 'react-native';
import { router, useLocalSearchParams, Link } from 'expo-router';

export default function User() {
  // Access the hash
  const { '#': hash } = useLocalSearchParams<{ '#': string }>();

  return (
    <>
      <Text onPress={() => router.setParams({ '#': 'my-hash' })}>Set a new hash</Text>
      <Text onPress={() => router.push('/#my-hash')}>Push with a new hash</Text>
      <Link href="/#my-hash">Link with a hash</Link>
    </>
  );
}
```

## Reserved parameters

특정 URL parameter 이름은 Expo Router와 React Navigation의 내부 용도로 예약되어 있습니다. 충돌을 방지하려면 다음 이름은 여러분의 parameter 이름으로 사용하지 마세요:

-   `screen`
-   `params`
-   `initial`
-   `state`
