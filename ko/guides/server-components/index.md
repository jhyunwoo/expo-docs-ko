---
modificationDate: December 30, 2025
title: Expo Router 앱에서 React Server Components 사용하기
description: Expo에서 서버에서 React 컴포넌트를 렌더링하는 방법을 알아보세요.
---

# Expo Router 앱에서 React Server Components 사용하기

Expo에서 서버에서 React 컴포넌트를 렌더링하는 방법을 알아보세요.

> **SDK 52 이상**에서 실험적으로 사용할 수 있습니다. 이것은 베타 릴리스이며 호환성이 깨지는 변경이 있을 수 있습니다.

React Server Components는 다음과 같은 여러 흥미로운 기능을 가능하게 합니다:

-   async 컴포넌트와 React Suspense를 사용한 데이터 페칭.
-   secret 및 server-side API 다루기.
-   SEO와 성능을 위한 server-side rendering(SSR).
-   사용하지 않는 JS 코드를 제거하기 위한 build-time rendering.

Expo Router는 모든 플랫폼에서 [React Server Components](https://react.dev/reference/rsc/server-components)를 지원할 수 있게 해줍니다. 이것은 앞으로 Expo Router에서 기본 활성화될 기능의 초기 프리뷰입니다.

## Prerequisites

프로젝트는 Expo Router와 React Native new architecture(SDK 52부터 기본값)를 사용해야 합니다.

## Usage

Expo 앱에서 React Server Components를 사용하려면 다음이 필요합니다:

1.  필요한 RSC 의존성을 설치합니다
    
    ```sh
    npx expo install react-server-dom-webpack
    ```
    
2.  **package.json**에서 entry module이 `expo-router/entry`(기본값)인지 확인합니다.
    
3.  프로젝트 app config에서 플래그를 활성화합니다:
    

```json
{
  "expo": {
    "experiments": {
      "reactServerFunctions": true
    }
  }
}
```

4.  app config 어디에서도 `"origin"`이 boolean 값으로 설정되지 않았는지 확인합니다.
5.  초기 route **app/index.tsx**를 만듭니다:

```tsx
/// <reference types="react/canary" />

import React from 'react';
import { ActivityIndicator } from 'react-native';
import renderInfo from '../actions/render-info';

export default function Index() {
  return (
    <React.Suspense
      fallback={
        // The view that will render while the Server Function is awaiting data.
        <ActivityIndicator />
      }>
      {renderInfo({ name: 'World' })}
    </React.Suspense>
  );
}
```

4.  Server Function **actions/render-info.tsx**를 만듭니다:

```tsx
'use server';

import { Text } from 'react-native';

export default async function renderInfo({ name }) {
  // Securely fetch data from an API, and read environment variables...
  return <Text>Hello, {name}!</Text>;
}
```

Server Function이 반환하는 뷰 값은 클라이언트로 스트리밍될 React Server Component payload입니다.

> 개발자 프리뷰 동안 app config의 `web.output`은 반드시 `single`이어야 합니다. 더 많은 output mode 지원이 곧 제공될 예정입니다.

## Server Components

Server Components는 서버에서 실행되므로 서버 API와 Node.js built-in(로컬 실행 시)에 접근할 수 있습니다. 또한 async 컴포넌트를 사용할 수도 있습니다.

다음과 같이 데이터를 가져와 렌더링하는 컴포넌트를 생각해 보세요:

```tsx
import 'server-only';

import { Image, Text, View } from 'react-native';

export async function Pokemon() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon/2');
  const json = await res.json();
  return (
    <View style={{ padding: 8, borderWidth: 1 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 24 }}>{json.name}</Text>
      <Image source={{ uri: json.sprites.front_default }} style={{ width: 100, height: 100 }} />

      {json.abilities.map(ability => (
        <Text key={ability.ability.name}>- {ability.ability.name}</Text>
      ))}
    </View>
  );
}
```

이것을 server component로 렌더링하려면 Server Function에서 이를 반환해야 합니다.

### Key points

-   Server Components에서는 `useState`, `useEffect`, `useContext` 같은 hook을 사용할 수 없습니다.
-   Server Components에서는 browser 또는 native API를 사용할 수 없습니다.
-   `"use server"`는 파일을 server component로 표시하기 위한 것이 아닙니다. 이 지시어는 React Server Functions를 export하는 파일임을 표시하는 데 사용됩니다.
-   server component는 클라이언트 바깥에서 안전하게 실행되므로 모든 환경 변수에 접근할 수 있습니다.

## Client Components

Server Components는 native API나 React Context에 접근할 수 없기 때문에, 이런 기능을 사용하려면 Client Component를 만들 수 있습니다. 파일 상단에 `"use client"` directive를 표시해 만들 수 있습니다.

```tsx
'use client';
import { Text } from 'react-native';

export default function Button({ title }) {
  return <Text onPress={() => {}}>{title}</Text>;
}
```

이 모듈은 Server Function이나 Server Component에서 import해서 사용할 수 있습니다.

### Key point

Server Components에는 함수를 prop으로 전달할 수 없습니다. 직렬화 가능한 데이터만 전달할 수 있습니다.

## React Server Functions

Server Functions는 서버에서 실행되며 Client Components에서 호출할 수 있는 함수입니다. fully-typed API route를 더 쉽게 작성하는 방식이라고 생각하면 됩니다.

항상 async function이어야 하며 함수 상단에 `"use server"`를 표시해야 합니다.

```tsx
export default function Index() {
  return (
    <Button
      title="Press me"
      onPress={async () => {
        'use server';
        // This code runs on the server.
        console.log('Button pressed');
        return '...';
      }}
    />
  );
}
```

Server Function을 호출하는 Client Component를 만들 수 있습니다:

```tsx
'use client';
import { Text } from 'react-native';

export default function Button({ title, onPress }) {
  return <Text onPress={() => onPress()}>{title}</Text>;
}
```

Server Functions는 독립 파일(상단에 `"use server"` 포함)에 정의한 뒤 Client Components에서 import할 수도 있습니다:

```tsx
'use server';

export async function callAction() {
  // ...
}
```

이 함수는 Client Component에서 사용할 수 있습니다:

```tsx
import { Text } from 'react-native';
import { callAction } from './server-actions';

export default function Button({ title }) {
  return <Text onPress={() => callAction()}>{title}</Text>;
}
```

### Key points

-   Server Functions에는 인수로 직렬화 가능한 데이터만 전달할 수 있습니다.
-   Server Functions는 직렬화 가능한 데이터만 반환할 수 있습니다.
-   Server Functions는 서버에서 실행되며 클라이언트에 노출되어서는 안 되는 로직을 넣기에 좋은 위치입니다.
-   Server Functions는 현재 DOM components 내부에서는 사용할 수 없습니다

### Rendering in Server Functions

Expo Router의 React Server Functions는 서버에서 React 컴포넌트를 렌더링하고, 클라이언트에서 렌더링할 수 있도록 **RSC payload**(React 팀이 유지하는 custom JSON 유사 포맷)를 스트리밍해 돌려줄 수 있습니다. 이는 웹의 server-side rendering(SSR)과 비슷합니다.

예를 들어 다음 Server Function은 일부 텍스트를 렌더링합니다:

```tsx
'use server';

// Optional: Import "server-only" for sanity.
import 'server-only';

import { View, Image, Text } from 'react-native';

export async function renderProfile({
  username,
  accessToken,
}: {
  username: string;
  accessToken: string;
}) {
  // NOTE: Rate limits, GDPR, and other server-side operations can be done here.

  // Fetch some data securely from an API.
  const { name, image } = await fetch(`https://api.example.com/profile/${username}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      // Use secret environment variables securely as this code will live on the server.
      // The EXPO_PUBLIC_ prefix is not required here.
      'X-Secret': process.env.SECRET,
    },
  }).then(res => res.json());

  // Render
  return (
    <View>
      <Image source={{ uri: image }} />
      <Text>{name}</Text>
    </View>
  );
}
```

이 Server Function은 Client Component에서 호출할 수 있고, 내용이 클라이언트로 스트리밍되어 돌아옵니다:

```tsx
'use client';

import { useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { Text } from 'react-native';

import { renderProfile } from '@/components/server-actions';

// Loading state that renders while data is being fetched.
function Fallback() {
  return <Text>Loading...</Text>;
}

export default function Profile() {
  const { username } = useLocalSearchParams();
  const { accessToken } = useCustomAuthProvider();

  // Call the Server Function with the username and access token.
  const profile = React.useMemo(
    () => renderProfile({ username, accessToken }),
    [username, accessToken]
  );

  // Render the profile asynchronously with React Suspense and a custom loading state.
  return <React.Suspense fallback={<Fallback />}>{profile}</React.Suspense>;
}
```

## Library compatibility

아직 모든 라이브러리가 React Server Components에 맞게 최적화되어 있지는 않습니다. 파일을 Client Component로 표시하고 Server Component에서 사용할 수 있도록 `"use client"` directive를 사용할 수 있습니다. 이는 호환성 문제를 임시로 우회하는 데 사용할 수 있습니다.

예를 들어 `"use client"` directive를 아직 제공하지 않는 `react-native-unoptimized` 라이브러리를 생각해 보겠습니다. 다음처럼 모듈을 만들고 각 모듈을 다시 export해서 우회할 수 있습니다:

```tsx
// This directive opts the module into client-side rendering.
'use client';

// Re-exporting the imports from the library.
export { One, Two, Three } from 'react-native-unoptimized';
```

`export * from '...'`는 서버와 클라이언트 사이 interop의 일부 내부 동작을 깨뜨리므로 사용을 피하세요.

`"use client"`로 표시된 모듈은 Server Components에서 dot-access할 수 없습니다. 즉 `react-native` 패키지가 더 최적화되기 전까지는 `StyleSheet.create`나 `Platform.OS` 같은 동작이 서버에서 기대대로 작동하지 않습니다.

## Suspense

React Suspense를 사용하면 데이터를 기다리는 동안 서버에서 부분적인 UI를 스트리밍해 돌려줄 수 있습니다.

다음 예제에서는 클라이언트에 `Loading...` 텍스트가 즉시 반환되고, `<MediumTask>`가 1초 뒤 렌더링을 마치면 텍스트를 `Medium task done!`으로 바꿉니다. `<ExpensiveTask>`는 로드에 3초가 걸리며, 완료되면 텍스트를 `Expensive task done!`으로 바꿉니다.

```tsx
import { Suspense } from 'react';
import { renderMediumTask, renderExpensiveTask } from '@/actions/tasks';

export default function App() {
  return <Suspense fallback={<Text>Loading...</Text>}>{renderTasks()}</Suspense>;
}
```

```tsx
'use server';

export async function renderTasks() {
  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      <>
        <MediumTask />
        <Suspense fallback={<Text>Loading...</Text>}>
          <ExpensiveTask />
        </Suspense>
      </>
    </Suspense>
  );
}

async function MediumTask() {
  // Wait one second before resolving.
  await new Promise(resolve => setTimeout(resolve, 1000));
  return <Text>Medium task done!</Text>;
}

async function ExpensiveTask() {
  // Wait three seconds before resolving.
  await new Promise(resolve => setTimeout(resolve, 3000));
  return <Text>Expensive task done!</Text>;
}
```

`<ExpensiveTask>` 주위의 `Suspense` wrapper를 제거하면, `Loading...`이 두 컴포넌트가 모두 렌더링을 마칠 때까지 기다렸다가 UI를 업데이트하는 것을 볼 수 있습니다. 이를 통해 loading state를 점진적으로 제어할 수 있습니다. 때로는 한 번에 모든 것이 로드되기를 기다리는 편이 타당하고(대부분의 경우), 다른 때는 가능한 즉시 UI를 스트리밍해 돌려주는 것이 유리합니다(ChatGPT의 텍스트 응답처럼).

## Secrets

Server Components는 secret과 server-side API에 접근할 수 있습니다. 환경 변수에 접근하려면 `process.env` 객체를 사용할 수 있습니다. 프로젝트에서 `server-only` 모듈을 import하면 해당 모듈이 절대 클라이언트에서 실행되지 않도록 보장할 수 있습니다.

```tsx
// This will assert if the module runs on the client.
import 'server-only';

import { Text } from 'react-native';

export async function renderData() {
  // This code only runs on the server.
  const data = await fetch('https://my-endpoint/', {
    headers: {
      Authorization: `Bearer ${process.env.SECRET}`,
    },
  });

  // ...
  return <div />;
}
```

secret은 **.env** 파일에 정의할 수 있습니다:

```text
SECRET=123
```

> 환경 변수를 업데이트하기 위해 dev server를 다시 시작할 필요는 없습니다. 모든 요청마다 자동으로 다시 로드됩니다.

## Platform detection

코드가 어떤 플랫폼용으로 번들링되는지 감지하려면 `process.env.EXPO_OS` 환경 변수를 사용하세요. 예를 들어 `process.env.EXPO_OS === 'ios'`입니다. `react-native`는 아직 React Server Components에 완전히 최적화되지 않았고 기대대로 동작하지 않으므로 `Platform.OS`보다 이것을 선호하세요.

`typeof window === 'undefined'` 검사를 수행하면 코드가 서버에서 실행되는지 감지할 수 있습니다. 이 값은 클라이언트 기기에서는 항상 `true`를 반환하고 서버에서는 `false`를 반환합니다.

## Testing with jest

라이브러리 작성자는 `jest-expo`를 사용해 자신의 모듈이 Server Components를 지원하는지 테스트할 수 있습니다. 자세한 내용은 [Testing React Server Components](/guides/testing-rsc) 가이드를 참고하세요.

## Metadata

React Server Components는 React 19의 기능입니다. 이를 활성화하기 위해 Expo CLI는 모든 플랫폼에서 자동으로 React의 특별한 canary build를 사용합니다. 앞으로 React Native에서 React 19가 기본 활성화되면 이 동작은 제거될 예정입니다.

그 결과 앱 어디에서나 `<meta>` 태그를 배치하는 등 React 19 기능을 사용할 수 있습니다(웹 전용).

```tsx
export default function Index() {
  return (
    <>
      {process.env.EXPO_OS === 'web' && (
        <>
          <meta name="description" content="Hello, world!" />
          <meta property="og:image" content="/og-image.png" />
        </>
      )}
      <MyComponent />
    </>
  );
}
```

이 방식은 `expo-router/head`의 `Head` 컴포넌트 대신 사용할 수 있지만, 현재는 웹에서만 동작합니다.

## Request headers

`expo-router/rsc/headers` 모듈을 사용하면 Server Component 요청을 만들 때 사용된 request header에 접근할 수 있습니다.

```tsx
import { unstable_headers } from 'expo-router/rsc/headers';

export async function renderHome() {
  const authorization = (await unstable_headers()).get('authorization');

  return <Text>{authorization}</Text>;
}
```

`unstable_headers` 함수는 읽기 전용 `Headers` 객체로 resolve되는 promise를 반환합니다.

### Key points

-   이 API는 요청에 따라 header가 동적으로 바뀌기 때문에 build-time rendering(`render: 'static'`)과 함께 사용할 수 없습니다. 앞으로 output mode가 `static`이면 이 API가 assertion을 발생시키게 될 예정입니다.
-   `unstable_headers`는 server-only이며 클라이언트에서 사용할 수 없습니다.

## Full React Server Components mode

> 이 모드는 experimental입니다.

전체 React Server Components 지원을 활성화하면 더 많은 기능을 활용할 수 있습니다. 이 모드에서는 route의 기본 렌더링 모드가 client component가 아니라 server component가 됩니다. Router와 React Navigation이 concurrency를 지원하도록 다시 작성되어야 하기 때문에 아직 개발 중입니다.

전체 Server Components mode를 활성화하려면 app config에서 `reactServerComponentRoutes` 플래그를 활성화해야 합니다:

```json
{
  "expo": {
    "experiments": {
      "reactServerFunctions": true,
      "reactServerComponentRoutes": true
    }
  }
}
```

이 설정이 켜지면 모든 route가 기본적으로 Server Components로 렌더링됩니다. 앞으로는 이것이 server/client waterfall을 줄이고 build-time rendering을 가능하게 하여 더 나은 오프라인 지원을 제공하게 됩니다.

-   현재는 stack routing이 없습니다. custom layout, `Stack`, `Tabs`, `Drawer`는 아직 Server Components를 지원하지 않습니다.
-   대부분의 `Link` component prop도 아직 지원되지 않습니다.

### Reloading Server Components

> 이것은 전체 React Server Components mode에서만 제한적으로 지원됩니다.

개발 중에는 Server Components가 모든 요청마다 다시 로드됩니다. 즉 server component를 변경하면 그 변경 사항이 클라이언트 runtime에 즉시 반영됩니다. 데이터를 다시 가져오거나 컴포넌트를 다시 렌더링하기 위해 프로그래밍 방식으로 reload event를 직접 트리거하고 싶을 수도 있습니다. 이는 `useRouter` hook의 `router.reload()` 함수를 사용해 수행할 수 있습니다.

```tsx
'use client';
import { useRouter } from 'expo-router';
import { Text } from 'react-native';

export function Button() {
  const router = useRouter();
  return (
    <Text
      onPress={() => {
        // Reload the current route.
        router.reload();
      }}>
      Reload current route
    </Text>
  );
}
```

route가 build-time에 렌더링되었다면 클라이언트에서 다시 렌더링되지 않습니다. 이는 렌더링 코드가 프로덕션 서버에 포함되지 않기 때문입니다.

### Build-time rendering

> 이것은 전체 React Server Components mode에서만 제한적으로 지원됩니다.

Expo Router는 Server Components를 렌더링하는 두 가지 서로 다른 모드를 지원합니다: build-time rendering과 request-time rendering입니다. 이 모드들은 `unstable_settings` export를 사용해 route별로 지정할 수 있습니다:

```tsx
import { Text, View } from 'react-native';

export const unstable_settings = {
  // This component will be rendered at build-time and never re-rendered in production.
  render: 'static',
};

export default function Index() {
  return (
    <View>
      <Text>Hello, world!</Text>
    </View>
  );
}
```

-   `render: 'static'`은 컴포넌트를 build-time에 렌더링하고 프로덕션에서는 절대 다시 렌더링하지 않습니다. 이는 전통적인 static site generator가 동작하는 방식과 비슷합니다.
-   `render: 'dynamic'`은 컴포넌트를 request-time에 렌더링하고 모든 요청마다 다시 렌더링합니다. 이는 server-side rendering이 동작하는 방식과 비슷합니다.

클라이언트 측 렌더링을 원한다면 데이터 페칭을 Client Component로 옮기고 로컬에서 렌더링을 제어하세요.

`static` output으로 표시된 route는 build-time에 렌더링되어 native binary에 포함됩니다. 이는 서버 요청이 앱 다운로드 시점에 이미 수행되었기 때문에, 서버 요청 없이 route를 렌더링할 수 있게 해줍니다.

현재 기본값은 `dynamic` rendering입니다. 앞으로는 caching과 최적화가 더 똑똑하고 자동적으로 바뀔 예정입니다.

`generateStaticParams` 함수를 사용해 build-time에 static page를 생성할 수 있습니다. 이는 서버가 아니라 build-time에만 실행되어야 하는 컴포넌트에 유용합니다.

```tsx
import { Text } from 'react-native';

// Adding `unstable_settings.render: 'static'` will prevent this component from running on the server.
export const unstable_settings = {
  render: 'static',
};

// This function will generate static pages for each shape.
export async function generateStaticParams() {
  return [{ shape: 'square' }];
}

export default function ShapeRoute({ shape }) {
  return <Text>{shape}</Text>;
}
```

### CSS

> 이것은 전체 React Server Components mode에서만 제한적으로 지원됩니다.

Expo Router는 Server Components에서 global CSS와 CSS module import를 지원합니다.

```tsx
import './styles.css';
import styles from './styles.module.css';

export default function Index() {
  return <div className={styles.container}>Hello, world!</div>;
}
```

CSS는 서버에서 클라이언트 번들로 hoist됩니다.

## Deployment

> Universal React Server Components는 아직 beta입니다.

### Web

먼저 웹 프로젝트를 빌드하세요:

```sh
npx expo export -p web
```

그런 다음 `npx expo serve`로 로컬에서 호스팅하거나 클라우드에 배포할 수 있습니다:

[EAS로 즉시 배포하기](/eas/hosting/get-started) — EAS Hosting은 Expo API route와 서버를 배포하는 가장 좋은 방법입니다.

### Native

다음 서버 배포 가이드를 따라 native React Server Components를 배포할 수 있습니다:

[Native 서버를 EAS에 배포하기](/router/web/api-routes#native-deployment) — 버전이 지정된 서버를 프로덕션 native 앱에 배포하고 연결합니다.

## Known limitations

> 이것은 현재 활발히 개발 중인 매우 초기 단계의 technical preview입니다.

-   Expo Snack은 Server Components 번들링을 지원하지 않습니다.
-   EAS Update는 아직 Server Components와 함께 동작하지 않습니다.
-   DOM components는 아직 프로덕션에서 React Server Functions를 사용할 수 없습니다.
-   프로덕션 배포는 아직 제한적이며 권장되지 않습니다.
-   Server Rendering RSC payload를 HTML로 렌더링하는 기능은 아직 지원되지 않습니다. 즉 static 및 server output이 아직 완전히 동작하지 않습니다.
-   [`generateStaticParams`](/router/web/static-rendering#generatestaticparams)는 전체 React Server Components mode에서 부분적으로만 지원됩니다.
-   Server Functions와 HTML `form` 통합은 아직 지원되지 않습니다(일부는 자동으로 동작하지만 데이터는 암호화되지 않습니다).
-   `StyleSheet.create`와 `Platform.OS`는 native에서 지원되지 않습니다. 스타일에는 일반 객체를 사용하고 플랫폼 감지에는 `process.env.EXPO_OS`를 사용하세요.
-   다른 Server Functions를 호출하는 React Server Functions는 Hermes runtime의 제한 때문에 Hermes에서 지원되지 않습니다. 이는 Static Hermes로 해결될 수 있습니다.
