---
modificationDate: February 26, 2026
title: Static rendering
description: Expo Router로 route를 정적 HTML 및 CSS 파일로 렌더링하는 방법을 알아보세요.
---

# Static rendering

Expo Router로 route를 정적 HTML 및 CSS 파일로 렌더링하는 방법을 알아보세요.

Web에서 Search Engine Optimization(SEO)을 활성화하려면 앱을 정적으로 렌더링해야 합니다. 이 가이드는 Expo Router 앱을 정적으로 렌더링하는 과정을 안내합니다.

> Static rendering에서는 [data loaders](/router/web/data-loaders)가 build 과정에서 실행되며 그 결과가 output HTML 파일에 포함됩니다.

## Setup

프로젝트의 [app config](/versions/latest/config/app)에서 static rendering을 활성화하세요:

```json
{
  "expo": {
    ... 
    "web": {
      "output": "static"
    }
  }
}
```

Development server를 시작하세요:

```sh
npx expo start
```

## Production

Production용 정적 웹사이트를 번들하려면 export 명령을 실행하세요:

```sh
npx expo export --platform web
```

이 명령은 정적으로 렌더링된 웹사이트가 들어 있는 **dist** 디렉터리를 생성합니다. 로컬 **public** 디렉터리에 파일이 있다면 그 파일들도 함께 복사됩니다. 다음 명령을 실행하고 연결된 URL을 browser에서 열어 production build를 로컬에서 테스트할 수 있습니다:

```sh
npx serve dist
```

이 프로젝트는 거의 모든 호스팅 서비스에 배포할 수 있습니다. 이것은 single-page application이 아니며 custom server API도 포함하지 않는다는 점에 유의하세요. 즉, dynamic route(예: **src/app/[id].tsx**)는 임의로는 동작하지 않습니다. Dynamic route를 처리하려면 serverless function을 직접 만들어야 할 수 있습니다.

## Dynamic Routes

`static` output은 각 route에 대해 HTML file을 생성합니다. 즉, dynamic route(**src/app/[id].tsx**)는 별도 설정 없이 바로 동작하지 않습니다. 알려진 route는 `generateStaticParams` function을 사용해 미리 생성할 수 있습니다.

```tsx
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export async function generateStaticParams(): Promise<Record<string, string>[]> {
  const posts = await getPosts();
  // Return an array of params to generate static HTML files for.
  // Each entry in the array will be a new page.
  return posts.map(post => ({ id: post.id }));
}

export default function Page() {
  const { id } = useLocalSearchParams();

  return <Text>Post {id}</Text>;
}
```

이렇게 하면 **dist** 디렉터리 안에 각 post마다 file이 생성됩니다. 예를 들어 `generateStaticParams` method가 `[{ id: "alpha" }, { id: "beta" }]`를 반환했다면 다음 파일이 생성됩니다:

`dist`

 `blog`

  `alpha.html`

  `beta.html`

### `generateStaticParams`

Build 시점에 Expo CLI가 Node.js 환경에서 평가하는 server 전용 function입니다. 즉, `__dirname`, `process.cwd()`, `process.env` 등에 접근할 수 있습니다. 또한 process에서 사용할 수 있는 모든 environment variable에도 접근할 수 있습니다. 하지만 `EXPO_PUBLIC_` 접두사가 붙은 값도 browser 환경에서 실행되는 것은 아니므로 `localStorage`나 `document` 같은 browser API에는 접근할 수 없습니다. 또한 `expo-camera`나 `expo-location` 같은 native Expo API에도 접근할 수 없습니다.

```tsx
export async function generateStaticParams(): Promise<Record<string, string>[]> {
  console.log(process.cwd());

  return [];
}
```

`generateStaticParams`는 중첩된 부모에서 자식으로 cascade됩니다. Cascade된 parameter는 **generateStaticParams**를 export하는 모든 dynamic child route에 전달됩니다.

```tsx
export async function generateStaticParams(): Promise<Record<string, string>[]> {
  return [{ id: 'one' }, { id: 'two' }];
}
```

이제 dynamic child route는 `{ id: 'one' }` 한 번, `{ id: 'two' }` 한 번, 총 두 번 호출됩니다. 모든 variation을 고려해야 합니다.

```tsx
export async function generateStaticParams(params: {
  id: 'one' | 'two';
}): Promise<Record<string, string>[]> {
  const comments = await getComments(params.id);
  return comments.map(comment => ({
    ...params,
    comment: comment.id,
  }));
}
```

### Read files using `process.cwd()`

Expo Router는 코드를 별도의 디렉터리로 컴파일하므로, `__dirname`을 사용해 path를 만들면 예상과 다른 값이 될 수 있어 사용할 수 없습니다.

대신 `process.cwd()`를 사용하세요. 이 값은 프로젝트가 컴파일되고 있는 디렉터리를 반환합니다.

```tsx
import fs from 'node:fs/promises';
import path from 'node:path';

export async function generateStaticParams(params: {
  id: string;
}): Promise<Record<string, string>[]> {
  const directory = await fs.readdir(path.join(process.cwd(), './posts/'));
  const posts = directory.filter(fileOrSubDirectory => return path.extname(fileOrSubDirectory) === '.md')

  return [{
    id,
    posts,
  }];
}
```

## Root HTML

기본적으로 모든 페이지는 작은 HTML boilerplate로 감싸집니다. 이것을 **root HTML**이라고 합니다.

프로젝트에 **src/app/+html.tsx** 파일을 만들어 root HTML file을 사용자화할 수 있습니다. 이 파일은 Node.js에서만 실행되는 React component를 export하므로, 그 안에서는 global CSS를 import할 수 없습니다. 이 component는 **app** 디렉터리의 모든 route를 감쌉니다. 이는 전역 `<head>` element를 추가하거나 body scrolling을 비활성화할 때 유용합니다.

> **Note**: 전역 context provider는 Root HTML component가 아니라 [Root Layout](/router/basics/layout#root-layout) component에 두어야 합니다.

```tsx
import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
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
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
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

-   `children` prop에는 내부에 root `<div id="root" />` tag가 포함된 상태로 전달됩니다.
-   JavaScript script는 정적 렌더링 뒤에 추가됩니다.
-   React Native web style은 자동으로 정적으로 주입됩니다.
-   이 파일에는 global CSS를 import하면 안 됩니다. 대신 [Root Layout](/router/basics/layout#root-layout) component를 사용하세요.
-   `window.location` 같은 browser API는 이 component에서 사용할 수 없습니다. Static rendering 중 Node.js에서만 실행되기 때문입니다.

### `expo-router/html`

`expo-router/html`의 export는 Root HTML component와 관련되어 있습니다.

-   `ScrollViewStyleReset`: Root `<ScrollView />`를 사용하는 전체 화면 [React Native web apps](https://necolas.github.io/react-native-web/docs/setup/#root-element)를 위한 root style-reset입니다. Native parity를 보장하기 위해 다음 style을 사용해야 합니다.

## Meta tags

`expo-router`의 `<Head />` module을 사용해 페이지에 meta tag를 추가할 수 있습니다:

```tsx
import Head from 'expo-router/head';
import { Text } from 'react-native';

export default function Page() {
  return (
    <>
      <Head>
        <title>My Blog Website</title>
        <meta name="description" content="This is my blog." />
      </Head>
      <Text>About my blog</Text>
    </>
  );
}
```

Head element는 같은 API를 사용해 동적으로도 업데이트할 수 있습니다. 하지만 SEO를 위해서는 정적 head element를 미리 렌더링해 두는 편이 유용합니다.

## Static files

Expo CLI는 static rendering 동안 **dist** 디렉터리로 복사되는 루트 **public** 디렉터리를 지원합니다. 이는 이미지, 폰트, 기타 asset 같은 정적 파일을 추가할 때 유용합니다.

`public`

 `favicon.ico`

 `logo.png`

 `.well-known`

   `apple-app-site-association`

> `/assets` 같은 일부 path는 Metro가 예약합니다. **public/assets/** 또는 다른 예약된 path에 파일을 두지 마세요. 전체 목록은 [Reserved paths](/router/reference/reserved-paths)를 참고하세요.

이 파일들은 static rendering 동안 **dist** 디렉터리로 복사됩니다:

`dist`

 `index.html`

 `favicon.ico`

 `logo.png`

 `.well-known`

   `apple-app-site-association`

 `_expo`

   `static`

     `js`

       `index-xxx.js`

     `css`

       `index-xxx.css`

> **Web only**: 정적 asset은 runtime code에서 상대 경로로 접근할 수 있습니다. 예를 들어 **logo.png**는 `/logo.png`에서 접근할 수 있습니다:

```tsx
import { Image } from 'react-native';

export default function Page() {
  return <Image source={{ uri: '/logo.png' }} />;
}
```

## Fonts

Expo Font는 Expo Router에서 폰트 로딩을 위한 자동 static optimization을 제공합니다. `expo-font`로 font를 로드하면 Expo CLI가 font resource를 자동으로 추출해 페이지의 HTML에 포함시키므로, preloading, 더 빠른 hydration, 그리고 더 적은 layout shift가 가능해집니다.

다음 snippet은 Inter를 namespace에 로드하고 web에서 정적으로 최적화합니다:

```tsx
import { Text } from 'react-native';
import { useFonts } from 'expo-font';

export default function App() {
  const [isLoaded] = useFonts({
    inter: require('@/assets/inter.ttf'),
  });

  if (!isLoaded) {
    return null;
  }

  return <Text style={{ fontFamily: 'inter' }}>Hello Universe</Text>;
}
```

이 코드는 다음과 같은 정적 HTML을 생성합니다:

```html
/* @info preload the font before the JavaScript loads. */
<link rel="preload" href="/assets/inter.ttf" as="font" crossorigin />
/* @end */
<style id="expo-generated-fonts" type="text/css">
  @font-face {
    font-family: inter;
    src: url(/assets/inter.ttf);
    font-display: auto;
  }
</style>
```

-   정적 폰트 최적화를 사용하려면 font가 동기적으로 로드되어야 합니다. Font가 정적으로 최적화되지 않는다면 `useEffect`, deferred component, 또는 async function 안에서 로드되었기 때문일 수 있습니다.
-   정적 최적화는 `expo-font`의 `Font.loadAsync`와 `Font.useFonts`에서만 지원됩니다. Wrapper function도 wrapper가 동기적이라면 지원됩니다.

## Common questions

### How do I add a custom server?

Custom server를 추가하는 정해진 방법은 없습니다. 어떤 server든 사용할 수 있습니다. 다만 dynamic route는 직접 처리해야 합니다. 알려진 route에 대한 정적 HTML file을 생성하려면 `generateStaticParams` function을 사용할 수 있습니다.

앞으로는 server API와 새로운 `web.output` mode가 제공될 예정이며, 이 mode는 다른 여러 기능과 함께 dynamic route도 지원하는 프로젝트를 생성하게 됩니다.

## Server-side Rendering

`web.output: 'static'`에서는 request 시점 렌더링이 지원되지 않습니다. 각 request마다 페이지를 동적으로 렌더링하려면 대신 `web.output: 'server'`와 함께 [server rendering](/router/web/server-rendering)을 사용하세요.

### Where can I deploy statically rendered websites?

정적으로 렌더링된 웹사이트는 어떤 정적 호스팅 서비스에도 배포할 수 있습니다. 널리 쓰이는 선택지는 다음과 같습니다:

-   [EAS Hosting](/eas/hosting/introduction)
-   [Netlify](https://www.netlify.com/)
-   [Cloudflare Pages](https://pages.cloudflare.com/)
-   [AWS Amplify](https://aws.amazon.com/amplify/)
-   [Vercel](https://vercel.com/)
-   [GitHub Pages](https://pages.github.com/)
-   [Render](https://render.com/)
-   [Surge](https://surge.sh/)

> **Note:** 정적 호스팅 서비스에 Single-Page Application 방식의 redirect를 추가할 필요는 없습니다. 이 정적 웹사이트는 single-page application이 아니라 정적 HTML file들의 모음입니다.
