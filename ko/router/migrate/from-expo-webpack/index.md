---
modificationDate: February 26, 2026
title: Migrate from Expo Webpack
description: Expo Webpack을 사용하는 웹사이트를 Expo Router로 마이그레이션하는 방법을 알아보세요.
---

# Migrate from Expo Webpack

Expo Webpack을 사용하는 웹사이트를 Expo Router로 마이그레이션하는 방법을 알아보세요.

원래 **Expo for web** 버전은 Webpack 4를 기반으로 했고, 주로 single-page application(SPA)을 만드는 데 초점을 맞췄습니다. 이 접근 방식은 [Create React App](https://create-react-app.dev/)을 기반으로 하며 Expo SDK와 React Native for web으로 간단한 웹 앱을 만들 수 있게 해주었습니다.

Expo Router는 web과 native에서 실행되는 강력한 universal 앱을 만들기 위한 새로운 접근 방식입니다. 이 가이드는 기존 웹사이트를 Expo Router로 마이그레이션하는 데 도움을 줍니다.

React Navigation과 Expo Router는 모두 Expo가 제공하는 routing 및 navigation framework입니다. Expo Router는 React Navigation을 감싼 wrapper이며, 많은 공통 개념을 공유합니다.

## Pitch

> `@expo/webpack-config`는 deprecated 상태이며 새로운 기능 업데이트를 받지 않습니다.

Expo Router는 [static rendering on web](/router/web/static-rendering)을 지원하므로, Expo Webpack과 달리 search engine optimization(SEO), social media preview, 더 빠른 로딩 시간을 가능하게 합니다. React Navigation의 장점과 함께 자동 deep linking, [type safety](/router/reference/typed-routes), [deferred bundling](/router/web/async-routes), [modular HTML templates](/router/web/static-rendering#root-html), [static rendering on web](/router/web/static-rendering) 등을 지원합니다.

Expo Router는 기능이나 성능을 타협하지 않고 web과 native 사이에서 navigation을 공유함으로써 Expo Webpack의 주요 cross-platform 문제를 해결하도록 설계되었습니다.

## Anti-pitch

Expo Router는 [Metro](https://metrobundler.dev/) 기반의 custom bundler stack을 사용합니다. 이것은 React Native가 사용하는 것과 같은 bundler입니다. 이 덕분에 최대한의 코드 재사용성을 보장할 수 있고, 플랫폼마다 다른 bundler를 사용하면서 생기는 여러 갈래의 동작 문제를 해결할 수 있습니다. 동시에, 특정 bundling 기능은 아직 Expo Router에서 사용할 수 없을 수도 있다는 뜻이기도 합니다.

결국 full universal framework로서 Expo Router는 bundler integration인 `@expo/webpack-config`보다 훨씬 더 견고한 솔루션입니다. 모든 새 Expo web 프로젝트에서 사용해야 합니다.

## Expo CLI

`@expo/webpack-config`와 달리 Expo Router는 web과 native에 대해 같은 CLI 명령과 기능을 사용합니다. Expo Router와 `@expo/webpack-config`의 차이는 아래 표를 참고하세요.

| Feature | Expo Router | `@expo/webpack-config` |
| --- | --- | --- |
| Start command | `npx expo start` | `npx expo start` |
| Bundle command | `npx expo export` | `npx expo export:web` |
| Output directory | **dist** | **web-build** |
| Static directory | **public** | **web** |
| Config file | **metro.config.js** | **webpack.config.js** |
| Default config | `@expo/metro-config` | `@expo/webpack-config` |
| Bundle Splitting | ✓ (SDK 50 • web) | ✓ |
| Global CSS | ✓ (SDK 50 • web) | ✓ |
| CSS Modules | ✓ (SDK 50 • web) | ✗ |
| Static Font Optimization | ✓ (SDK 50 • web) | ✗ |
| API Routes | ✓ (SDK 50) | ✗ |
| Multi-platform | ✓ | ✗ |
| Fast Refresh | ✓ | ✗ |
| Error Overlay | ✓ | ✗ |
| Lazy bundling | ✓ | ✗ |
| Static Generation | ✓ | ✗ |
| Environment Variables | ✓ | ✗ |
| `tsconfig.json` paths | ✓ | ✗ |
| Tree Shaking | ([Partial support](/guides/tree-shaking)) | ✓ |

## HTML template

`@expo/webpack-config`에서는 모든 route가 하나의 HTML 파일을 공유했습니다. 이 파일은 `web/index.html`의 template를 기반으로 하며, 이후 `@expo/webpack-config`가 필요한 script와 stylesheet를 포함하도록 수정했습니다.

Expo Router에는 두 가지 렌더링 패턴이 있습니다:

-   **Recommended**: `web.output: "static"`은 앱의 각 route마다 새로운 HTML 파일을 출력합니다. 이 접근 방식은 [**src/app/+html.tsx** 파일을 사용해 전체 HTML template를 동적으로 생성](/router/web/static-rendering#root-html)할 수 있게 해줍니다.
-   **Not recommended**: `web.output: "single"`은 single-page application을 출력합니다. 이 접근 방식에서는 `public/index.html`을 template HTML 파일로 사용할 수 있습니다.

## Static resources

`@expo/webpack-config`에서는 `web` 디렉터리에 정적 파일을 호스팅할 수 있었고, 이 파일은 웹사이트의 루트에서 제공되었습니다. 예를 들어 `web/favicon.ico`는 `https://example.com/favicon.ico`에서 제공되었습니다.

Expo Router에서는 **public** 디렉터리를 사용해 정적 파일을 호스팅할 수 있습니다. 예를 들어 **public/favicon.ico**는 `https://example.com/favicon.ico`에서 제공됩니다. Webpack과 달리 Expo Router의 호스팅은 native에서도 동작합니다. production에서 사용하기 전에 서버에서 파일을 호스팅해야 한다는 점을 기억하세요.

## Bundling for production

`@expo/webpack-config`에서는 `npx expo export:web`을 사용해 웹사이트를 production용으로 번들링할 수 있었습니다. 이 명령은 **web-build** 디렉터리에 번들을 출력했습니다.

Expo Router에서는 `npx expo export --platform web` 명령을 사용해 **dist** 디렉터리로 export하세요. `--dump-sourcemap` 플래그를 사용하면 sourcemap을 생성할 수 있습니다. 빌드 시 **public** 디렉터리의 내용은 **dist** 디렉터리로 복사됩니다.

## Babel configuration

예전과 마찬가지로 루트 [**babel.config.js**](/versions/latest/config/babel) 파일은 web과 native 모두에 사용됩니다. API caller에서 `platform` 속성을 사용해 preset을 바꿀 수 있습니다:

```js
module.exports = api => {
  // Get the platform from the API caller...
  const platform = api.caller(caller => caller && caller.platform);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Add a web-only plugin...
      platform === 'web' && 'custom-web-only-plugin',
    ].filter(Boolean),
  };
};
```

## Dev server

Expo Router에서는 모든 플랫폼이 같은 port의 같은 dev server에서 호스팅됩니다. 이는 앱의 production 동작을 에뮬레이션하기에 편리합니다. 모든 로그와 hot module reloading 역시 같은 port를 통해 동작합니다.

native의 한계 때문에 fake HTTPS를 사용한 호스팅은 현재 지원되지 않습니다. 하지만 2018년보다 이 기능의 중요성은 낮아졌습니다. 이제는 Chrome 같은 웹 브라우저에서 localhost로 camera나 location 같은 보안 기능을 테스트할 수 있기 때문입니다.

## Expo constants

[`expo-constants`](/versions/latest/sdk/constants) 라이브러리는 앱 안에서 **app.json**에 접근하는 데 사용할 수 있습니다. 내부적으로는 **app.json** 파일 내용을 문자열로 만든 값을 `process.env.APP_MANIFEST`에 설정하는 방식으로 이 기능을 구현합니다.

Expo Router에서는 `babel-preset-expo`를 사용하는 Babel을 통해 이 작업을 수행합니다. **app.json**을 수정했다면 `npx expo start --clear`로 Babel cache를 재시작해 변경 사항을 확인하세요.

## Base path and subpath hosting

> Experimental functionality.

`@expo/webpack-config`에서는 `PUBLIC_URL` 환경 변수나 프로젝트의 **package.json**에 있는 `homepage` 필드를 사용해 웹사이트를 subpath에서 호스팅되도록 번들링할 수 있었습니다:

```json
{
  "homepage": "/evanbacon/my-website"
}
```

Expo Router에서는 프로젝트의 **app.json**에 실험적인 `baseUrl` 필드를 사용할 수 있습니다:

```json
{
  "expo": {
    "experiments": {
      "baseUrl": "/evanbacon/my-website"
    }
  }
}
```

이전 시스템과 달리, 이 방식은 base path를 반영하도록 routing도 함께 업데이트합니다. 예를 들어 route가 `/profile`이고 base path를 `/evanbacon/my-website`로 설정했다면, route는 `/evanbacon/my-website/profile`이 됩니다.

자세한 내용은 [hosting with sub-paths](/more/expo-cli#hosting-with-sub-paths)를 참고하세요.

## Fast refresh

`@expo/webpack-config`에서는 `@pmmmwh/react-refresh-webpack-plugin`을 설치하고 **webpack.config.js**에 다음을 추가할 수 있었습니다:

```js
const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Use the React refresh plugin in development mode
  if (env.mode === 'development') {
    config.plugins.push(new ReactRefreshWebpackPlugin({ disableRefreshCheck: true }));
  }

  return config;
};
```

Expo Router에서는 **Fast Refresh가 기본적으로 활성화**되어 있으며, Meta의 공식 Fast Refresh 구현을 사용합니다.

## Favicons

`@expo/webpack-config`와 마찬가지로 Expo Router도 **app.json**의 `web.favicon` 필드를 기반으로 **favicon.ico** 파일을 생성하는 것을 지원합니다.

## Service workers

> service worker를 추가할 때는 예상치 못한 웹 동작을 일으키는 것으로 알려져 있으니 주의하세요. 웹사이트를 공격적으로 캐시하는 service worker를 실수로 배포하면 사용자가 쉽게 업데이트를 요청할 수 없게 됩니다. 최고의 offline 모바일 경험을 위해서는 Expo로 native 앱을 만드세요. service worker를 사용하는 웹사이트와 달리 native 앱은 앱 스토어를 통해 업데이트되어 캐시된 경험을 초기화할 수 있습니다. 이것은 사용자의 네이티브 브라우저를 초기화하는 것과 비슷합니다(service worker가 충분히 공격적이면 사용자가 실제로 그렇게 해야 할 수도 있습니다). 자세한 내용은 [why service workers are suboptimal](https://github.com/facebook/create-react-app/issues/2398)를 참고하세요.

Expo Webpack에는 내장 service worker 지원이 없었습니다. 하지만 `workbox-webpack-plugin`을 사용해 **webpack.config.js**에 추가함으로써 직접 넣을 수는 있었습니다.

Workbox에는 Metro integration이 없지만, Workbox는 bundler의 핵심 기능(transformation, resolution, serialization)을 필요로 하지 않기 때문에 빌드 후 단계로 쉽게 사용할 수 있습니다. [using Workbox CLI](https://developer.chrome.com/docs/workbox/modules/workbox-cli/) 가이드를 따르되, 거기서 "build script"를 언급하는 부분은 `npx expo export -p web`으로 바꿔 생각하면 됩니다.

예를 들어 Workbox를 설정하는 가능한 흐름은 다음과 같습니다. 다음 명령으로 새 프로젝트를 만드세요:

```sh
npm create expo -t tabs my-app
cd my-app
```

그다음 앱용 루트 HTML 파일을 만들고 service worker registration script를 추가하세요:

```tsx
import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

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

        {/* Bootstrap the service worker. */}
        <script dangerouslySetInnerHTML={{ __html: sw }} />

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

const sw = `
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        }).catch(error => {
            console.error('Service Worker registration failed:', error);
        });
    });
}
`;
```

이제 wizard를 실행하기 전에 앱을 빌드하세요:

```sh
npx expo export -p web
```

wizard 명령을 실행하고, 앱의 루트로 `dist`를 선택한 다음, 나머지는 기본값을 선택하세요:

```sh
npx workbox-cli wizard
? What is the root of your web app (that is which directory do you deploy)? dist/
? Which file types would you like to precache? js, html, ttf, ico, json
? Where would you like your service worker file to be saved? dist/sw.js
? Where would you like to save these configuration options? workbox-config.js
? Does your web app manifest include search parameter(s) in the 'start_url', other than 'utm_' or 'fbclid' (like '?source=pwa')? No
```

마지막으로 `npx workbox-cli generateSW workbox-config.js`를 실행해 service worker config를 생성하세요. 이후에는 **package.json**에 build script를 추가해 두 스크립트를 올바른 순서로 실행할 수 있습니다:

```json
{
  "scripts": {
    "build:web": "expo export -p web && npx workbox-cli generateSW workbox-config.js"
  }
}
```

## PWA manifests

`@expo/webpack-config`와 달리 Expo Router는 PWA manifest configuration을 자동 생성하려고 시도하지 않습니다. 대신 **public/manifest.json**에 직접 만들 수 있습니다:

```json
{
  "short_name": "Expo App",
  "name": "Expo Router Sample",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```

그리고 HTML 파일에서 `link` tag를 사용해 이를 연결할 수 있습니다:

```tsx
import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

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

        {/* Link the PWA manifest file. */}
        <link rel="manifest" href="/manifest.json" />

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

## Bundler plugins

custom bundler plugin을 사용하고 있었다면, bundler pipeline에 custom 기능을 추가하는 방법은 [Expo Metro config](/versions/latest/config/metro)를 참고하세요.

## Navigation

`@expo/webpack-config`에서 screen 사이 navigation에 React Navigation을 사용했다면, [migration guide for React Navigation](/router/migrate/from-react-navigation)을 참고하세요.

## Deployment

Expo Router 웹사이트를 다양한 호스팅 제공자에 배포하는 방법은 [Publishing websites](/guides/publishing-websites)를 확인하세요.
