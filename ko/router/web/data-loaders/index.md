---
modificationDate: March 01, 2026
title: Data loaders
description: Expo Router의 data loader를 사용해 server에서 데이터를 가져오는 방법을 알아보세요.
isAlpha: true
---

# Data loaders

Expo Router의 data loader를 사용해 server에서 데이터를 가져오는 방법을 알아보세요.

> Data loader는 alpha 단계이며 SDK 55 이상에서 사용할 수 있습니다. [static rendering](/router/web/static-rendering) 또는 [server rendering](/router/web/server-rendering)이 필요합니다.

Data loader를 사용하면 route를 위한 server-side data fetching을 할 수 있습니다. Route file에서 `loader` function을 export하면 server에서 데이터를 가져오고 [`useLoaderData`](/versions/latest/sdk/router#useloaderdata) hook을 사용해 component에서 그 데이터에 접근할 수 있습니다. 이렇게 하면 민감한 데이터와 API key는 server에 유지하면서 component에는 필요한 데이터만 제공할 수 있습니다.

## Setup

프로젝트의 [app config](/versions/latest/config/app)에서 `expo-router` plugin에 `unstable_useServerDataLoaders` option을 추가해 data loader를 활성화하세요:

```json
{
  "expo": {
    ... 
    "plugins": [
      [
        "expo-router",
        {
          "unstable_useServerDataLoaders": true,
          "unstable_useServerRendering": true
        }
      ]
    ]
  }
}
```

Web output mode를 구성하세요. Data loader는 [static rendering](/router/web/static-rendering) (`web.output: 'static'`)과 [server rendering](/router/web/server-rendering) (`web.output: 'server'`) 모두에서 동작합니다:

```json
{
  "expo": {
    ... 
    "web": {
      ... 
      "output": "server"
    }
  }
}
```

Development server를 시작하세요:

```sh
npx expo start
```

## Basic example

Route file에서 `loader` function을 export하고 [`useLoaderData`](/versions/latest/sdk/router#useloaderdata) hook을 사용해 component 안에서 데이터에 접근하세요:

```tsx
import { Text, View } from 'react-native';
import { useLoaderData } from 'expo-router';

export async function loader() {
  // Fetch data from an API, database, or any server-side source
  const response = await fetch('https://api.example.com/data');
  return response.json();
}

export default function Home() {
  const data = useLoaderData<typeof loader>();

  return (
    <View>
      <Text>Data: {JSON.stringify(data)}</Text>
    </View>
  );
}
```

`loader` function은 server에서 실행되며, 그 반환값은 serialize되어 component에 전달됩니다. 즉, client에 노출되면 안 되는 server-side secret, database connection, 기타 리소스를 안전하게 사용할 수 있습니다. TypeScript를 사용할 때 [`useLoaderData`](/versions/latest/sdk/router#useloaderdata)에 generic parameter로 `typeof loader`를 넘기면 hook이 loader function의 반환 타입을 추론할 수 있습니다.

> [`useLoaderData`](/versions/latest/sdk/router#useloaderdata) hook은 route component 자체에서 호출할 필요가 없습니다. Route의 component tree 안에 있는 어떤 child component에서도 호출할 수 있습니다.

### Using Suspense

Component가 데이터를 아직 불러오는 중일 때 [`useLoaderData`](/versions/latest/sdk/router#useloaderdata) hook을 호출하면 React는 그 component를 suspend합니다. Loading state는 component tree를 따라 위로 전파되어 가장 가까운 [`<Suspense>`](https://react.dev/reference/react/Suspense) boundary에 도달하고, 그 boundary가 fallback을 렌더링합니다.

즉, component tree 안에 [`<Suspense>`](https://react.dev/reference/react/Suspense) boundary를 배치해 loading fallback이 정확히 어디에 나타날지 제어할 수 있습니다:

```tsx
import { Suspense } from 'react';
import { Text, View } from 'react-native';
import { useLoaderData } from 'expo-router';

export async function loader() {
  const response = await fetch('https://api.example.com/data');
  return response.json();
}

export default function Home() {
  return (
    <View>
      <Text>Welcome</Text>
      <Suspense fallback={<Text>Loading...</Text>}>
        <DataSection />
      </Suspense>
    </View>
  );
}

function DataSection() {
  const data = useLoaderData<typeof loader>();
  return <Text>{data.title}</Text>;
}
```

위 예제에서는 [`useLoaderData`](/versions/latest/sdk/router#useloaderdata)가 `<Home>`의 child component 안에 있으며, loading state를 보여주기 위해 [`<Suspense>`](https://react.dev/reference/react/Suspense)로 감쌌습니다.

### Error handling

Loader가 error를 throw하면 가장 가까운 [error boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)로 전파됩니다. Loader error를 처리하려면 같은 route file에서 [`ErrorBoundary`](/versions/latest/sdk/router#errorboundary) component를 export할 수 있습니다:

```tsx
import { Text, View } from 'react-native';
import { useLoaderData, type ErrorBoundaryProps } from 'expo-router';

export async function loader() {
  const response = await fetch('https://api.example.com/data');
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View>
      <Text>Error: {error.message}</Text>
      <Text onPress={retry}>Try again</Text>
    </View>
  );
}

export default function DataPage() {
  const data = useLoaderData<typeof loader>();
  return (
    <View>
      <Text>{data.title}</Text>
    </View>
  );
}
```

`ErrorBoundary`를 export하지 않으면 error는 가장 가까운 부모 route의 error boundary로 전파됩니다. Component tree의 특정 지점에서 error를 잡고 싶다면 route 안에서 custom error boundary component를 사용할 수도 있습니다.

## Dynamic routes

Loader는 두 번째 인수로 route parameter를 받습니다:

```tsx
import { Text, View } from 'react-native';
import { useLoaderData } from 'expo-router';

export async function loader(request, params) {
  const response = await fetch(`https://api.example.com/posts/${params.postId}`);
  return response.json();
}

export default function Post() {
  const data = useLoaderData<typeof loader>();

  return (
    <View>
      <Text>{data.title}</Text>
      <Text>{data.content}</Text>
    </View>
  );
}
```

## Accessing the request

> Static rendering을 사용할 때는 build 시점에 HTTP request가 없기 때문에 `request` parameter는 `undefined`입니다.

[server rendering](/router/web/server-rendering)을 사용할 때 loader는 첫 번째 인수로 들어오는 HTTP request를 받습니다. 따라서 header, cookie, 기타 request 정보를 읽을 수 있습니다:

```tsx
import { Text, View } from 'react-native';
import { useLoaderData } from 'expo-router';

export async function loader(request) {
  // Access authorization header
  const authToken = request?.headers.get('Authorization');

  if (!authToken) {
    return { user: null };
  }

  // Fetch user data using the token
  const response = await fetch('https://api.example.com/user', {
    headers: { Authorization: authToken },
  });

  return { user: await response.json() };
}

export default function Profile() {
  const { user } = useLoaderData<typeof loader>();

  if (!user) {
    return <Text>Please log in</Text>;
  }

  return (
    <View>
      <Text>Welcome, {user.name}</Text>
    </View>
  );
}
```

## Returning data

Loader는 plain JSON 형태로 데이터를 반환할 수 있으며, 이 데이터는 [`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)로 쉽게 역직렬화할 수 있습니다. 여기에는 object, array, 그리고 [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)로 직렬화할 수 있는 다른 primitive가 포함됩니다.

```tsx
export async function loader() {
  const response = await fetch('https://api.example.com/data');
  return response.json();
}
```

Loader가 `undefined` 또는 `null`을 반환하면 그 값은 `null`로 정규화됩니다.

## Runtime API

Data loader는 [Runtime API](/router/web/api-routes#runtime-api)를 [`expo-server`](/versions/latest/sdk/server)를 통해 완전히 사용할 수 있습니다. 여기에는 response header 설정, HTTP error throw, background task 실행을 위한 유틸리티가 포함됩니다:

```tsx
import { setResponseHeaders, StatusError } from 'expo-server';

export async function loader(request) {
  const authToken = request?.headers.get('Authorization');

  if (!authToken) {
    throw new StatusError(401, 'Unauthorized');
  }

  setResponseHeaders({ 'Cache-Control': 'private, max-age=60' });

  return { user: 'authenticated' };
}
```

사용 가능한 전체 function 목록은 [Runtime API documentation](/router/web/api-routes#runtime-api)을 참고하세요.

## Environment variables

Loader는 server에서 실행되므로 `process.env`에 접근할 수 있습니다. Loader에서 사용하는 environment variable은 client bundle에 절대 노출되지 않습니다. 이는 API key와 다른 secret에 접근할 때 유용합니다:

```tsx
import { Text, View } from 'react-native';
import { useLoaderData } from 'expo-router';

export async function loader() {
  const apiKey = process.env.API_SECRET_KEY;

  const response = await fetch('https://api.example.com/data', {
    headers: { 'X-API-Key': apiKey },
  });

  return response.json();
}

export default function ApiData() {
  const data = useLoaderData<typeof loader>();

  return (
    <View>
      <Text>{JSON.stringify(data)}</Text>
    </View>
  );
}
```

## Difference between static and server rendering

Data loader의 동작은 [`web.output`](/versions/latest/config/app#output) 설정에 따라 달라집니다:

| Aspect | Static Rendering | Server Rendering |
| --- | --- | --- |
| Loader execution | Build time | Request time |
| `request` parameter | `undefined` | [`ImmutableRequest`](/versions/latest/sdk/server#immutablerequest) |
| Best for | Blogs, marketing pages, documentation | Personalized content, authentication-dependent pages |

### Static rendering

Static rendering에서는 `npx expo export`로 앱을 export할 때 loader가 실행됩니다. 데이터는 생성된 HTML과 JSON file 안에 포함됩니다. 이는 다음을 의미합니다:

-   데이터는 build 시점에 결정되며 다음 build 전까지는 바뀌지 않습니다
-   Build 중에는 HTTP request가 없으므로 `request` parameter는 `undefined`입니다
-   자주 바뀌지 않는 콘텐츠에 적합합니다

### Server rendering

Server rendering에서는 request마다 loader가 실행됩니다. 이는 다음을 의미합니다:

-   `request` parameter에 들어오는 HTTP request의 immutable version이 포함됩니다
-   Production 배포를 위해 [`expo-server`](/versions/latest/sdk/server)가 필요합니다

## Typed loader functions

더 나은 type safety를 위해 `expo-router`에서 `LoaderFunction` type을 import할 수 있습니다:

```tsx
import { Text, View } from 'react-native';
import { useLoaderData } from 'expo-router';
import { type LoaderFunction } from 'expo-router/server';

type PostData = {
  title: string;
  content: string;
};

export const loader: LoaderFunction<PostData> = async (request, params) => {
  const response = await fetch(`https://api.example.com/posts/${params.postId}`);
  return response.json();
};

export default function Post() {
  const data = useLoaderData<typeof loader>();

  return (
    <View>
      <Text>{data.title}</Text>
      <Text>{data.content}</Text>
    </View>
  );
}
```

## Known limitations

-   Loader는 JSON으로 직렬화 가능한 데이터만 반환할 수 있습니다. Streaming response는 현재 지원되지 않습니다. 이는 이후 릴리스에서 개선될 예정입니다.
-   Loader data는 navigation 중 client에 cache됩니다. 현재는 이 cache를 무효화하는 built-in 방법이 없습니다. 이는 이후 릴리스에서 개선될 예정입니다.

## Common questions

Server rendering 없이도 data loader를 사용할 수 있나요?

예. Data loader는 static rendering (`web.output: 'static'`)과 server rendering (`web.output: 'server'`) 모두에서 동작합니다.

Loader는 client bundle에 포함되나요?

아니요. `loader` export는 client bundle에서 제거됩니다. 다만 다른 module이 server-side logic을 포함하고 있고, **src/app** 디렉터리 밖에서 client-side code가 그 module을 import한다면 client-side bundle에 포함될 수 있습니다.
