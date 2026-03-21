---
modificationDate: January 01, 2025
title: Expo for Web에서 Next.js 사용하기
description: 웹용으로 Expo와 Next.js를 통합하는 가이드입니다.
---

# Expo for Web에서 Next.js 사용하기

웹용으로 Expo와 Next.js를 통합하는 가이드입니다.

> Next.js 사용은 Expo의 범용 앱 개발 워크플로에서 공식적으로 포함된 부분은 아닙니다.

[Next.js](https://nextjs.org/)는 간단한 페이지 기반 라우팅과 server-side rendering을 제공하는 React 프레임워크입니다. Expo SDK와 함께 Next.js를 사용하려면 설정 처리를 위해 [`@expo/next-adapter`](https://github.com/expo/expo-cli/tree/main/packages/next-adapter) 라이브러리를 사용하는 것을 권장합니다.

Expo와 Next.js를 함께 사용하면 기존 컴포넌트와 API 일부를 모바일 앱과 웹 앱 사이에서 공유할 수 있습니다. Next.js는 웹 플랫폼 개발 시 별도의 자체 CLI를 사용하므로, **웹 프로젝트는 `npx expo start`가 아니라 Next.js CLI로 시작해야 합니다**.

> native 앱에는 Server-Side Rendering(SSR) 지원이 없기 때문에, Next.js는 Expo for web에서만 사용할 수 있습니다.

## Automatic setup

빠르게 시작하려면 [with-nextjs](https://github.com/expo/examples/tree/master/with-nextjs) template으로 새 프로젝트를 만드세요:

```sh
npx create-expo-app -e with-nextjs
```

-   **Native**: `npx expo start` — Expo 프로젝트 시작
-   **Web**: `npx next dev` — Next.js 프로젝트 시작

## Manual setup

### 의존성 설치

프로젝트에 `expo`, `next`, `@expo/next-adapter`가 설치되어 있는지 확인하세요:

```sh
yarn add expo next @expo/next-adapter
```

### Transpilation

언어 기능을 변환하도록 Next.js를 설정하세요:

swc를 사용하는 Next.js. (권장)

SWC와 함께 Next.js를 사용하는 것을 권장합니다. [**babel.config.js**](/versions/latest/config/babel)가 native만 고려하도록 설정할 수 있습니다:

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

또한 **next.config.js**에 다음을 추가해 [Next.js가 SWC를 사용하도록 강제](https://nextjs.org/docs/messages/swc-disabled)해야 합니다:

```js
module.exports = {
  experimental: {
    forceSwcTransforms: true,
  },
};
```
Babel을 사용하는 Next.js. (권장하지 않음)

웹에서 webpack으로 번들링할 때만 `next/babel`을 조건부로 추가하도록 **babel.config.js**를 조정하세요:

```js
module.exports = function (api) {
  // Detect web usage (this may change in the future if Next.js changes the loader)
  const isWeb = api.caller(
    caller =>
      caller && (caller.name === 'babel-loader' || caller.name === 'next-babel-turbo-loader')
  );
  return {
    presets: [
      // Only use next in the browser, it'll break your native project
      isWeb && require('next/babel'),
      'babel-preset-expo',
    ].filter(Boolean),
  };
};
```

### Next.js configuration

**next.config.js**에 다음을 추가하세요:

```js
const { withExpo } = require('@expo/next-adapter');

module.exports = withExpo({
  // transpilePackages is a Next.js +13.1 feature.
  // older versions can use next-transpile-modules
  transpilePackages: [
    'react-native',
    'react-native-web',
    'expo',
    // Add more React Native/Expo packages here...
  ],
});
```

전체 Next.js config는 다음과 같을 수 있습니다:

```js
const { withExpo } = require('@expo/next-adapter');

/** @type {import('next').NextConfig} */
const nextConfig = withExpo({
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [
    'react-native',
    'react-native-web',
    'expo',
    // Add more React Native/Expo packages here...
  ],
  experimental: {
    forceSwcTransforms: true,
  },
});

module.exports = nextConfig;
```

### React Native Web styling

패키지 `react-native-web`은 reset CSS 스타일이 적용된다는 가정 위에 구축되어 있습니다. 다음은 **pages** 디렉터리를 사용해 Next.js에서 스타일을 reset하는 방법입니다.

```jsx
import { Children } from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { AppRegistry } from 'react-native';

// Follows the setup for react-native-web:
// https://necolas.github.io/react-native-web/docs/setup/#root-element
// Plus additional React Native scroll and text parity styles for various
// browsers.
// Force Next-generated DOM elements to fill their parent's height
const style = `
html, body, #__next {
  -webkit-overflow-scrolling: touch;
}
#__next {
  display: flex;
  flex-direction: column;
  height: 100%;
}
html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}
body {
  /* Allows you to scroll below the viewport; default value is visible */
  overflow-y: auto;
  overscroll-behavior-y: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -ms-overflow-style: scrollbar;
}
`;

export default class MyDocument extends Document {
  static async getInitialProps({ renderPage }) {
    AppRegistry.registerComponent('main', () => Main);
    const { getStyleElement } = AppRegistry.getApplication('main');
    const page = await renderPage();
    const styles = [
      <style key="react-native-style" dangerouslySetInnerHTML={{ __html: style }} />,
      getStyleElement(),
    ];
    return { ...page, styles: Children.toArray(styles) };
  }

  render() {
    return (
      <Html style={{ height: '100%' }}>
        <Head />
        <body style={{ height: '100%', overflow: 'hidden' }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
```

```jsx
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
```

## 모듈 transpiling

기본적으로 React Native 생태계의 모듈은 웹 브라우저에서 실행되도록 transpile되지 않습니다. React Native는 빠른 reload를 위해 Metro의 고급 캐싱에 의존합니다. Next.js는 webpack을 사용하며 같은 수준의 캐싱이 없으므로, 기본적으로는 어떤 node module도 transpile되지 않습니다. **next.config.js**의 `transpilePackages` 옵션에 transpile하고 싶은 모든 모듈을 수동으로 표시해야 합니다:

```js
const { withExpo } = require('@expo/next-adapter');

module.exports = withExpo({
  experimental: {
    transpilePackages: [
      // NOTE: Even though `react-native` is never used in Next.js,
      // you need to list `react-native` because `react-native-web`
      // is aliased to `react-native`.
      'react-native',
      'react-native-web',
      'expo',
      // Add more React Native/Expo packages here...
    ],
  },
});
```

## Vercel에 배포하기

이것은 Next.js 프로젝트를 프로덕션에 배포하기 위해 Vercel이 선호하는 방법입니다.

**package.json**에 `build` 스크립트를 추가하세요:

```json
{
  "scripts": {
    "build": "next build"
  }
}
```

Vercel CLI를 설치하세요:

```sh
npm i -g vercel
```

Vercel에 배포하세요:

```sh
vercel
```

## 기본 Expo for Web과 비교한 제한 사항 또는 차이점

웹에 Next.js를 사용한다는 것은 Next.js webpack config로 번들링한다는 뜻입니다. 이로 인해 앱과 웹사이트를 개발하는 방식에 몇 가지 핵심 차이가 생깁니다.

-   Expo Next.js adapter는 실험적인 **app** 디렉터리를 지원하지 않습니다.
-   native의 파일 기반 라우팅에는 [Expo Router](https://github.com/expo/router) 사용을 권장합니다.

## Contributing

Expo에서 Next.js 지원을 더 좋게 만드는 데 도움을 주고 싶다면 자유롭게 PR을 열거나 이슈를 제출해 주세요:

-   [@expo/next-adapter](https://github.com/expo/expo-cli/tree/main/packages/next-adapter)

## Troubleshooting

### Cannot use import statement outside a module

어떤 모듈에 해당 import 문이 있는지 찾아서 **next.config.js**의 `transpilePackages` 옵션에 추가하세요:

```js
const { withExpo } = require('@expo/next-adapter');

module.exports = withExpo({
  experimental: {
    transpilePackages: [
      'react-native',
      'react-native-web',
      'expo',
      // Add the failing package here, and restart the server...
    ],
  },
});
```
