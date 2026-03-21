---
modificationDate: March 01, 2026
title: Server rendering
description: Server-side rendering(SSR)을 사용해 request 시점에 Expo Router route를 동적으로 렌더링하는 방법을 알아보세요.
isAlpha: true
---

# Server rendering

Server-side rendering(SSR)을 사용해 request 시점에 Expo Router route를 동적으로 렌더링하는 방법을 알아보세요.

> Server rendering은 alpha 단계이며 SDK 55 이상에서 사용할 수 있습니다. Production에서 사용하려면 [deployed server](/router/web/api-routes#deployment)가 필요합니다.

Server-side rendering(SSR)은 build 시점에 HTML을 미리 렌더링하는 [static rendering](/router/web/static-rendering)과 달리, 요청마다 HTML을 동적으로 생성합니다. 이 가이드는 Expo Router 앱에서 server rendering을 활성화하는 방법을 안내합니다.

> Server-side rendering에서는 [data loaders](/router/web/data-loaders)가 각 request마다 server에서 실행되며 그 결과가 HTML response에 포함됩니다.

## Setup

프로젝트의 [app config](/versions/latest/config/app)에서 server rendering을 활성화하세요:

```json
{
  "expo": {
    ... 
    "web": {
      "output": "server"
    },
    "plugins": [
      [
        "expo-router",
        {
          "unstable_useServerRendering": true
        }
      ]
    ]
  }
}
```

Development server를 시작하세요:

```sh
npx expo start
```

## Production

Production용으로 앱을 export하려면 export 명령을 실행하세요:

```sh
npx expo export --platform web
```

이렇게 하면 server-rendered 애플리케이션이 포함된 **dist** 디렉터리가 생성됩니다. Static rendering과 달리 HTML file은 미리 생성되지 않습니다. 대신 output에는 아래와 유사한 디렉터리 구조가 포함됩니다:

`dist`

 `client`

  `_expo`

   `static`

     `js`

       `web`

         `entry-[hash].js`

     `css`

       `[name]-[hash].css`

 `server`

  `_expo`

   `routes.json`

   `server`

     `render.js`

위 output에는 **dist** 디렉터리 안에 다음 디렉터리가 포함됩니다:

-   **client** 디렉터리: Client-side hydration을 위한 JavaScript 및 CSS bundle을 포함합니다
-   **server** 디렉터리: Route manifest와 server rendering module을 포함합니다

다음 명령을 실행하고 연결된 URL을 browser에서 열어 production build를 로컬에서 테스트할 수 있습니다:

```sh
npx expo serve
```

위 명령은 각 request마다 페이지를 렌더링하는 로컬 server를 시작해 production 환경을 시뮬레이션합니다.

## Dynamic routes

Server rendering에서는 dynamic route가 즉시 렌더링되며, [`generateStaticParams`](/router/web/static-rendering#generatestaticparams) export는 필요하지 않고 제거해야 합니다. Route file이 `generateStaticParams`를 export하더라도, 해당 route는 대신 동적으로 처리됩니다. Route는 URL의 실제 parameter를 사용해 request 시점에 렌더링됩니다.

```tsx
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Page() {
  const { id } = useLocalSearchParams();

  return <Text>Post {id}</Text>;
}
```

위 예제에서 앱 사용자가 `/blog/my-post`를 방문하면, server는 `id`를 `"my-post"`로 설정해 페이지를 렌더링합니다.

## Root HTML

**src/app/+html.tsx** file을 만들어 root HTML document를 사용자화할 수 있습니다. 이 component는 모든 route를 감싸며 server에서만 실행됩니다.

```tsx
import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

// This file is web-only and used to configure the root HTML for every
// web page during server rendering.
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/*
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native platforms.
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <ScrollViewStyleReset />

        {/* Add any additional <head> elements that you want globally available on web... */}
      </head>
      <body>{children}</body>
    </html>
  );
}
```

**+html.tsx** file은 server renderer에서만 사용되며 client code에서는 절대 사용되지 않습니다. 이는 다음을 의미합니다:

-   Server rendering 동안 `expo-server`가 이 file을 실행합니다
-   Client에서 rehydrate되지 않으므로 React hook을 사용하면 안 됩니다
-   `+html.tsx`에서는 global CSS를 import할 수 없습니다(style은 [Root Layout](/router/basics/layout#root-layout)을 사용하세요)
-   `+html.tsx` 안에서는 `window`나 `document` 같은 browser API를 호출할 수 없습니다

모든 `+html.tsx` component는 JSX content 안에서 전달받은 `children` prop을 렌더링해야 합니다.

## Meta tags

`expo-router`의 `<Head />` component를 사용해 페이지에 meta tag를 추가하세요:

```tsx
import Head from 'expo-router/head';
import { Text } from 'react-native';

export default function Page() {
  return (
    <>
      <Head>
        <title>About Us</title>
        <meta name="description" content="Learn more about our company." />
      </Head>
      <Text>About page content</Text>
    </>
  );
}
```

Server-side rendering 중에는 `<Head>` element가 추출되어 초기 HTML response에 포함됩니다. 이렇게 하면 client로 전송되는 `<head>` element가 수정되고, 검색 엔진 최적화(SEO)도 개선됩니다.

## Deployment

Server-side rendering은 각 request마다 페이지를 렌더링할 runtime server가 필요합니다. Server-side rendered Expo 앱은 GitHub Pages 같은 정적 호스팅 서비스에 **배포할 수 없습니다**.

### Supported platforms

| Platform | Adapter |
| --- | --- |
| [EAS Hosting](/eas/hosting/introduction) | Built-in |
| Node.js/Express | `expo-server/adapter/express` |
| Cloudflare Workers | `expo-server/adapter/workerd` |
| Vercel Edge Functions | `expo-server/adapter/vercel` |
| Netlify Edge Functions | `expo-server/adapter/netlify` |
| Bun | `expo-server/adapter/bun` |

예시: EAS Hosting으로 배포

EAS Hosting은 기본적으로 server rendering을 지원합니다. 앱을 export하고 다음과 같이 배포하세요:

```sh
npx expo export --platform web
npx eas-cli@latest hosting:deploy dist
```

## Comparison with static rendering

| Feature |  | Static Rendering | Server Rendering |
| --- | --- | --- | --- |
| HTML generation |  | Build time | Request time |
| Configuration |  | `web.output: 'static'` | `web.output: 'server'` |
| Dynamic routes |  | Requires [`generateStaticParams`](/router/web/static-rendering#generatestaticparams) | Works automatically |
| Server required |  | No | Yes |
| Time to First Byte |  | Fastest (cached) | Slower (rendered per request) |
| Hosting |  | Any static host | Server runtime required |

## Common questions

Server rendering과 함께 data loader를 사용할 수 있나요?

예. Server rendering은 [data loaders](/router/web/data-loaders)와 함께 동작하며, 렌더링 전에 server에서 데이터를 가져올 수 있습니다.

Server rendering과 static rendering을 섞어 쓸 수 있나요?

현재 Expo Router는 같은 프로젝트 안에서 server rendering과 static rendering을 함께 지원하지 않습니다. 요구 사항에 따라 하나의 output mode를 선택하세요.

Server-rendered response는 어떻게 cache하나요?

Caching은 server 또는 CDN 수준에서 처리됩니다. 배포 플랫폼이 URL pattern이나 cache header를 기준으로 response를 cache하도록 구성하세요.

Server rendering은 API route와 함께 동작하나요?

예. [API routes](/router/web/api-routes)는 rendering mode와 독립적으로 동작합니다. 이들은 항상 server에서 실행됩니다.
