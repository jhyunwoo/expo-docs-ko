---
modificationDate: October 06, 2025
title: Tree shaking과 코드 제거
description: Expo CLI가 프로덕션 JavaScript 번들을 어떻게 최적화하는지 알아보세요.
platforms: ['android', 'ios', 'web', 'tvos']
---

# Tree shaking과 코드 제거

Expo CLI가 프로덕션 JavaScript 번들을 어떻게 최적화하는지 알아보세요.
Android, iOS, tvOS, Web

Tree shaking(또는 _dead code removal_이라고도 함)은 프로덕션 번들에서 사용되지 않는 코드를 제거하는 기법입니다. Expo CLI는 [minification](/guides/minify)을 포함한 여러 기법을 사용해 사용되지 않는 코드를 제거함으로써 시작 시간을 개선합니다.

## Platform shaking

Expo CLI는 앱 번들링 시 **platform shaking**이라 불리는 과정을 사용합니다. 이 과정에서 각 플랫폼(Android, iOS, web)에 대해 별도의 번들을 만들고, 특정 플랫폼에서만 사용되는 코드는 다른 플랫폼 번들에서 제거합니다.

`react-native`의 `Platform` 모듈을 기준으로 조건부로 사용되는 코드는 다른 플랫폼에서 제거됩니다. 하지만 이 제외는 각 파일에서 `Platform.select`와 `Platform.OS`를 react-native로부터 직접 import한 경우에만 적용됩니다. 이것들을 다른 모듈을 통해 다시 export하면 플랫폼별 번들링 과정에서 제거되지 않습니다.

예를 들어 다음 변환 입력을 생각해 보겠습니다:

```js
import { Platform } from 'react-native';

if (Platform.OS === 'ios') {
  console.log('Hello on iOS');
}
```

프로덕션 번들에서는 플랫폼 기반 조건문이 제거됩니다:

```js
Empty on Android
```

```js
console.log('Hello on iOS');
```

이 최적화는 프로덕션 전용이며 파일 단위로 실행됩니다. `Platform.OS`를 다른 모듈에서 다시 export하면 프로덕션 번들에서 제거되지 않습니다.

`process.env.EXPO_OS`는 JavaScript가 어떤 플랫폼용으로 번들링되었는지 감지하는 데 사용할 수 있습니다(런타임에는 바뀌지 않음). 이 값은 Metro가 의존성 해석 이후에 코드를 minify하는 방식 때문에 platform shaking import를 지원하지 않습니다.

## 개발 전용 코드 제거

프로젝트 안에는 개발 과정을 돕기 위한 코드가 있을 수 있습니다. 이런 코드는 프로덕션 번들에서 제외되어야 합니다. 이런 상황을 처리하려면 `process.env.NODE_ENV` 환경 변수 또는 비표준 전역 boolean인 `__DEV__`를 사용하세요.

예를 들어 다음 코드 조각은 프로덕션 번들에서 제거됩니다:

```js
if (process.env.NODE_ENV === 'development') {
  console.log('Hello in development');
}

if (__DEV__) {
  console.log('Another development-only conditional...');
}
```

_constants folding_이 일어난 뒤에는 조건을 정적으로 평가할 수 있습니다:

```js
if ('production' === 'development') {
  console.log('Hello in development');
}

if (false) {
  console.log('Another development-only conditional...');
}
```

도달할 수 없는 조건은 [minification](/guides/minify) 중 제거됩니다:

```js
Empty file
```

속도를 개선하기 위해 Expo CLI는 프로덕션 빌드에서만 코드 제거를 수행합니다. 위 코드 조각의 조건문은 개발 빌드에서는 유지됩니다.

## Custom code removal

`EXPO_PUBLIC_` 환경 변수는 minification 전에 inline됩니다. 즉, 이를 사용해 프로덕션 번들에서 코드를 제거할 수 있습니다. 예:

```js
EXPO_PUBLIC_DISABLE_FEATURE=true;
```

```js
if (!process.env.EXPO_PUBLIC_DISABLE_FEATURE) {
  console.log('Hello from the feature!');
}
```

위 입력 코드는 `babel-preset-expo`를 거친 뒤 다음과 같이 변환됩니다:

```js
if (!'true') {
  console.log('Hello from the feature!');
}
```

그 다음 이 코드는 minify되며, 사용되지 않는 조건문이 제거됩니다:

```js
// Empty file
```

-   이 시스템은 서버 번들에서 환경 변수를 inline하지 않기 때문에 서버 코드에는 적용되지 않습니다.
-   라이브러리 작성자는 보안상 애플리케이션 코드에서만 실행되므로 `EXPO_PUBLIC_` 환경 변수를 사용하면 안 됩니다.

## 서버 코드 제거

서버 및 클라이언트 환경에서 코드를 조건부로 활성화하거나 비활성화하기 위해 `typeof window === 'undefined'`를 사용하는 것은 흔한 패턴입니다.

`babel-preset-expo`는 서버 환경용으로 번들링할 때 `typeof window === 'undefined'`를 `true`로 변환합니다. 기본적으로 이 검사는 웹 클라이언트 환경용 번들링에서는 변경되지 않습니다. 이 변환은 개발과 프로덕션 모두에서 실행되지만, 프로덕션에서만 조건부 require를 제거합니다.

`{ minifyTypeofWindow: true }`를 전달해 `babel-preset-expo`에서 이 변환을 활성화하도록 설정할 수 있습니다. 기본적으로는 web worker에는 `window` 전역이 없기 때문에 웹 환경에서도 이 변환이 비활성화된 상태입니다.

```js
if (typeof window === 'undefined') {
  console.log('Hello on the server!');
}
```

이전 단계의 입력 코드는 서버 환경(API route, server rendering)용으로 번들링될 때 `babel-preset-expo` 이후 다음 코드 조각으로 변환됩니다:

```js
if (true) {
  console.log('Hello on the server!');
}
```

웹 또는 native 앱의 클라이언트 코드를 번들링할 때는 `minifyTypeOfWindow: true`가 설정되지 않는 한 `typeof window`가 대체되지 않습니다:

```js
if (typeof window === 'undefined') {
  console.log('Hello on the server!');
}
```

서버 환경에서는 위 코드 조각이 그 후 minify되어 사용되지 않는 조건문이 제거됩니다:

```js
console.log('Hello on the server!');
```

```js
if (typeof window === 'undefined') {
  console.log('Hello on the server!');
}
// Empty file
```

## React Native web imports

`babel-preset-expo`는 `react-native-web` barrel file에 대한 내장 최적화를 제공합니다. ESM을 사용해 `react-native`를 직접 import하면, 프로덕션 번들에서 barrel file이 제거됩니다.

정적 `import` 문법으로 `react-native`를 import하면 barrel file이 제거됩니다.

```js
import { View, Image } from 'react-native';
```

```js
import View from 'react-native-web/dist/exports/View';
import Image from 'react-native-web/dist/exports/Image';
```

## 사용되지 않는 import와 export 제거

> SDK 52 이상에서 실험적으로 사용할 수 있습니다.

모듈 전반에 걸쳐 사용되지 않는 import와 export를 자동으로 제거하는 기능을 실험적으로 활성화할 수 있습니다. 이는 native OTA 다운로드 속도를 높이고, 표준 JavaScript 엔진으로 파싱 및 실행해야 하는 웹 성능을 최적화하는 데 유용합니다.

다음 예제 코드를 생각해 보겠습니다:

```js
import { ArrowUp } from './icons';

export default function Home() {
  return <ArrowUp />;
}
```

```js
export function ArrowUp() {
  /* ... */
}

export function ArrowDown() {
  /* ... */
}

export function ArrowRight() {
  /* ... */
}

export function ArrowLeft() {
  /* ... */
}
```

`index.js`에서 `ArrowUp`만 사용되므로, 프로덕션 번들은 `icons.js`에서 다른 모든 컴포넌트를 제거합니다.

```js
export function ArrowUp() {
  /* ... */
}
```

이 시스템은 앱의 모든 `import` 및 `export` 문법을 모든 플랫폼에서 자동으로 최적화하도록 확장됩니다. 이로 인해 번들은 더 작아지지만, JS를 처리하는 데는 여전히 시간과 컴퓨터 메모리가 필요하므로 수백만 개의 모듈을 import하는 것은 피하세요.

-   Tree-shaking은 프로덕션 번들에서만 실행되며 `import`와 `export` 문법을 사용하는 모듈에서만 동작할 수 있습니다. `module.exports`와 `require`를 사용하는 파일은 tree-shaken되지 않습니다.
-   `import`/`export` 문법을 CJS로 변환하는 `@babel/plugin-transform-modules-commonjs` 같은 Babel plugin을 추가하지 마세요. 이것은 프로젝트 전체의 tree-shaking을 깨뜨립니다.
-   side-effect로 표시된 모듈은 그래프에서 제거되지 않습니다.
-   `export * from "..."`는 export가 `module.exports` 또는 `exports`를 사용하지 않는 한 확장되고 최적화됩니다.
-   Expo SDK의 모든 모듈은 ESM으로 제공되며 철저하게 tree-shaken될 수 있습니다.

## Enabling tree shaking

> SDK 52 이상에서 실험적으로 사용할 수 있습니다.

`experimentalImportSupport`를 활성화하고 앱이 예상대로 빌드되고 실행되는지 확인하세요.

> **참고**: SDK 54 이상에서는 기본적으로 활성화됩니다.

이전 SDK 버전에서 import support를 활성화하는 방법은 무엇인가요?

```js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: true,
  },
});

module.exports = config;
```

Experimental import support는 `@babel/plugin-transform-modules-commonjs` plugin의 custom 버전을 사용합니다. 이는 resolution 수를 크게 줄이고 output bundle을 단순화합니다. 이 기능은 `inlineRequires`와 함께 사용해 번들을 추가로 실험적으로 최적화할 수 있습니다.

그래프 전체가 만들어질 때까지 모듈을 유지하도록 환경 변수 `EXPO_UNSTABLE_METRO_OPTIMIZE_GRAPH=1`을 켜세요. 계속 진행하기 전에 이 기능을 켠 상태에서 앱이 프로덕션에서 예상대로 빌드되고 실행되는지 확인하세요.

```sh
EXPO_UNSTABLE_METRO_OPTIMIZE_GRAPH=1
```

이 설정은 프로덕션 모드에서만 사용됩니다.

기능을 활성화하려면 환경 변수 `EXPO_UNSTABLE_TREE_SHAKING=1`을 켜세요.

```sh
EXPO_UNSTABLE_TREE_SHAKING=1
```

이 설정은 프로덕션 모드에서만 사용됩니다.

tree shaking의 효과를 보려면 앱을 프로덕션 모드로 번들링하세요.

```sh
npx expo export
```

이 기능은 Metro가 코드를 번들링하는 근본적인 구조를 바꾸기 때문에 매우 실험적입니다. 기본적으로 Metro는 가능한 한 빠른 개발 시간을 보장하기 위해 모든 것을 요청 시점에 지연 로딩하면서 번들링합니다. 반대로 tree shaking은 전체 번들이 만들어진 뒤에 일부 변환을 지연시켜야 합니다. 이는 캐시할 수 있는 코드가 줄어든다는 뜻이지만, tree shaking은 프로덕션 전용 기능이고 프로덕션 번들은 보통 transform cache를 사용하지 않으므로 대체로 괜찮습니다.

## Barrel files

> SDK 52 이상에서 실험적으로 사용할 수 있습니다.

Expo tree shaking을 사용하면 star export는 사용 여부에 따라 자동으로 확장되고 shake됩니다. 예를 들어 다음 코드 조각을 생각해 보겠습니다:

```js
export * from './icons';
```

최적화 단계는 `./icons`를 순회해 export를 현재 모듈에 추가합니다. export가 사용되지 않으면 프로덕션 번들에서 제거됩니다.

```js
export { ArrowRight, ArrowLeft } from './icons';
```

이 코드는 표준 tree shaking 규칙에 따라 shake됩니다. `ArrowRight`만 import하면 `ArrowLeft`는 프로덕션 번들에서 제거됩니다.

star export가 `module.exports.ArrowUp` 또는 `exports.ArrowDown` 같은 모호한 export를 끌어오면, 최적화 단계는 star export를 확장하지 않고 barrel file에서 어떤 export도 제거하지 않습니다. 확장된 export는 [Expo Atlas](/guides/analyzing-bundles#analyzing-bundle-size-with-atlas)로 검사할 수 있습니다.

이 전략은 `lucide-react` 같은 라이브러리와 함께 사용해 앱에서 사용하지 않는 아이콘을 모두 제거하는 데 활용할 수 있습니다.

## Recursive optimizations

> SDK 52 이상에서 실험적으로 사용할 수 있습니다.

Expo는 사용되지 않는 import를 찾기 위해 그래프를 철저히 재귀 순회하면서 모듈을 최적화합니다. 다음 코드 조각을 생각해 보겠습니다:

```js
export function foo() {
  // Because bar is used here, it cannot be removed.
  bar();
}

export function bar() {}
```

이 경우 `bar`는 `foo` 안에서 사용되므로 제거할 수 없습니다. 하지만 앱 어디에서도 `foo`가 사용되지 않는다면 `foo`가 제거되고, 그다음 모듈을 다시 스캔해 `bar`도 제거할 수 있는지 확인합니다. 이 과정은 성능상의 이유로 중단되기 전까지 주어진 모듈에 대해 5번 재귀합니다.

## Side-effects

Expo CLI는 [Webpack system](https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free)에 따라 모듈 side-effect를 존중합니다. side-effect는 일반적으로 전역 변수 정의(`console.log`)나 prototype 수정(이런 일은 피하세요)에 사용됩니다.

모듈에 side-effect가 있는지는 **package.json**에서 표시할 수 있습니다:

```json
{
  "name": "library",
  "sideEffects": ["./src/*.js"]
}
```

side-effect는 사용되지 않는 모듈의 제거를 막고, JS 코드가 예상한 순서대로 실행되도록 module inlining도 비활성화합니다. side-effect가 비어 있거나 주석과 directive(`"use strict"`, `"use client"` 등)만 포함하고 있다면 제거됩니다.

Expo tree shaking이 활성화된 경우, 프로덕션 번들을 위해 **metro.config.js**에서 `inlineRequires`를 안전하게 활성화할 수 있습니다. 이렇게 하면 모듈이 평가될 때 지연 로딩되어 시작 시간이 더 빨라집니다. Expo tree shaking 없이 이 기능을 사용하면 모듈이 side-effect 실행 순서를 바꿀 수 있는 방식으로 이동되므로 피하세요.

```js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: true,
    inlineRequires: true,
  },
});

module.exports = config;
```

## Tree shaking에 맞게 최적화하기

Expo tree shaking 이전에는 React Native 라이브러리들이 다음과 같이 조건문 블록 안에 import를 감싸서 import를 제거하곤 했습니다:

```js
if (process.env.NODE_ENV === 'development') {
  require('./dev-only').doSomething();
}
```

이 방식은 정확한 TypeScript 지원을 받기 어렵고, 코드를 정적으로 분석할 수 없기 때문에 그래프가 모호해진다는 문제가 있습니다. Expo tree shaking을 활성화하면 이 코드를 ESM import를 사용하도록 재구성할 수 있습니다:

```js
import { doSomething } from './dev-only';

if (process.env.NODE_ENV === 'development') {
  doSomething();
}
```

두 경우 모두 프로덕션 번들에서는 전체 모듈이 비게 됩니다.
