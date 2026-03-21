---
modificationDate: March 10, 2026
title: Tailwind CSS
description: Expo 프로젝트에서 Tailwind CSS를 설정하고 사용하는 방법을 알아보세요.
---

# Tailwind CSS

Expo 프로젝트에서 Tailwind CSS를 설정하고 사용하는 방법을 알아보세요.

> 표준 Tailwind CSS는 웹 플랫폼만 지원합니다. 범용 지원이 필요하다면 [NativeWind](https://www.nativewind.dev/) 또는 [Uniwind](https://uniwind.dev/) 같은 라이브러리를 사용하세요. 이 라이브러리들은 Tailwind CSS로 스타일이 적용된 React Native 컴포넌트를 만들 수 있게 해줍니다.

[Tailwind CSS](https://tailwindcss.com/)는 utility-first CSS 프레임워크이며 웹 프로젝트에서 Metro와 함께 사용할 수 있습니다. 이 가이드는 Expo 프로젝트가 이 프레임워크를 사용하도록 설정하는 방법을 설명합니다.

## Prerequisites

다음 파일들이 Tailwind CSS 설정을 위해 수정됩니다:

`app.json`

`package.json`

`global.css`

`index.js`

프로젝트가 웹에서 Metro를 사용하고 있는지 확인하세요. **app.json** 파일에서 `web.bundler` 필드가 `metro`로 설정되어 있는지 확인하면 검증할 수 있습니다.

```json
{
  "expo": {
    "web": {
      "bundler": "metro"
    }
  }
}
```

## Configuration

[Tailwind PostCSS documentation](https://tailwindcss.com/docs/installation/using-postcss)에 따라 Expo 프로젝트에서 Tailwind CSS를 설정하세요.

`tailwindcss`와 필요한 peer dependency를 설치하세요. 그런 다음 초기화 명령을 실행해 프로젝트 루트에 **tailwind.config.js**와 **post.config.js** 파일을 생성하세요.

```sh
npx expo install tailwindcss@3 postcss autoprefixer --dev
npx tailwindcss init -p
```

**tailwind.config.js** 안의 모든 template 파일에 대한 경로를 추가하세요.

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Ensure this points to your source code
    './src/app/**/*.{js,tsx,ts,jsx}',
    // If you use a `src` directory, add: './src/**/*.{js,tsx,ts,jsx}'
    // Do the same with `components`, `hooks`, `styles`, or any other top-level directories
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

> Expo Router를 사용 중이라면 이 단계를 단순화하기 위해 루트 **src** 디렉터리를 사용하는 것도 고려해 보세요. 자세한 내용은 [top-level src directory](/router/reference/src-directory)를 참고하세요.

프로젝트 루트에 **global.css** 파일을 만들고 Tailwind의 각 레이어에 대한 directive를 추가하세요:

```css
/* This file adds the requisite utility classes for Tailwind to work. */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Expo Router를 사용한다면 **src/app/_layout.tsx**에, 그렇지 않다면 **index.js** 파일에 **global.css** 파일을 import하세요:

```tsx
import '../../global.css';
```

```tsx
// Import the global.css file in the index.js file:
import './global.css';
```

> [DOM components](/guides/dom-components)를 사용한다면 `"use dom"` directive를 사용하는 각 모듈에 이 파일 import를 추가하세요. 이들은 global을 공유하지 않습니다.

이제 프로젝트를 시작하고 컴포넌트에서 Tailwind CSS 클래스를 사용할 수 있습니다.

```sh
npx expo start
```

## Usage

React DOM element에서는 Tailwind를 그대로 사용할 수 있습니다:

```tsx
export default function Index() {
  return (
    <div className="bg-slate-100 rounded-xl">
      <p className="text-lg font-medium">Welcome to Tailwind</p>
    </div>
  );
}
```

React Native 웹 element에서는 `{ $$css: true }` 문법으로 Tailwind를 사용할 수 있습니다:

```tsx
import { View, Text } from 'react-native';

export default function Index() {
  return (
    <View style={{ $$css: true, _: 'bg-slate-100 rounded-xl' }}>
      <Text style={{ $$css: true, _: 'text-lg font-medium' }}>Welcome to Tailwind</Text>
    </View>
  );
}
```

## Tailwind for Android and iOS

Tailwind는 Android와 iOS 플랫폼을 지원하지 않습니다. 범용 지원이 필요하다면 [NativeWind](https://www.nativewind.dev/) 또는 [Uniwind](https://uniwind.dev/) 같은 호환성 라이브러리를 사용할 수 있습니다.

## Alternative for Android and iOS

또는 [DOM components](/guides/dom-components)를 사용해 native에서 `WebView` 안에 Tailwind 웹 코드를 렌더링할 수 있습니다.

```tsx
'use dom';

// Remember to import the global.css file in each DOM component.
import '../../global.css';

export default function Page() {
  return (
    <div className="bg-slate-100 rounded-xl">
      <p className="text-lg font-medium">Welcome to Tailwind</p>
    </div>
  );
}
```

## Troubleshooting

**metro.config.js**에 custom `config.cacheStores`가 있다면, `FileStore`의 Expo superclass를 확장해야 합니다:

```js
// Import the Expo superclass which has support for PostCSS.
const { FileStore } = require('@expo/metro-config/file-store');

config.cacheStores = [
  new FileStore({
    root: '/path/to/custom/cache',
  }),
];

module.exports = config;
```

**metro.config.js**에서 CSS가 비활성화되어 있지 않은지도 확인하세요:

```js
/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Do not disable CSS support when using Tailwind.
  isCSSEnabled: true,
});
```
