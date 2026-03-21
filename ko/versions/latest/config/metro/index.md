---
title: metro.config.js
description: Metro에서 사용할 수 있는 구성 레퍼런스입니다.
---

# metro.config.js

Metro에서 사용할 수 있는 구성 레퍼런스입니다.

**metro.config.js**에 대한 자세한 내용은 [Metro 사용자 지정 가이드](/guides/customizing-metro)를 참고하세요.

## 환경 변수

Expo CLI는 **.env** 파일에서 환경 변수를 불러올 수 있습니다. Expo CLI에서 환경 변수를 사용하는 방법은 [환경 변수 가이드](/guides/environment-variables)에서 자세히 알아보세요.

EAS CLI는 컴파일과 번들링을 위해 Expo CLI를 호출할 때를 제외하면 환경 변수에 대해 다른 메커니즘을 사용합니다. 자세한 내용은 [EAS의 환경 변수](/build-reference/variables)를 참고하세요.

오래된 프로젝트를 마이그레이션하는 중이라면, 로컬 env 파일은 아래 내용을 **.gitignore**에 추가해 무시해야 합니다:

```sh
# local env files
.env*.local
```

### dotenv 파일 비활성화

Dotenv 파일 로딩은 Expo CLI 명령을 실행하기 전에 `EXPO_NO_DOTENV` 환경 변수를 활성화하면 Expo CLI에서 완전히 비활성화할 수 있습니다.

```sh
npx cross-env EXPO_NO_DOTENV=1 expo start
EXPO_NO_DOTENV=1 npx expo start
```

### `EXPO_PUBLIC_` 접두사가 붙은 client 환경 변수 비활성화

`EXPO_PUBLIC_` 접두사가 붙은 환경 변수는 빌드 시점에 앱에 노출됩니다. 예를 들어 `EXPO_PUBLIC_API_KEY`는 `process.env.EXPO_PUBLIC_API_KEY`로 사용할 수 있습니다.

Client 환경 변수 인라인화는 `EXPO_NO_CLIENT_ENV_VARS=1` 환경 변수로 비활성화할 수 있으며, 이 값은 번들링이 시작되기 전에 정의되어 있어야 합니다.

```sh
npx cross-env EXPO_NO_CLIENT_ENV_VARS=1 expo start
EXPO_NO_CLIENT_ENV_VARS=1 npx expo start
```

## CSS

> CSS 지원은 현재 개발 중이며 현재는 web에서만 동작합니다.

Expo는 프로젝트에서 CSS를 지원합니다. 어떤 component에서든 CSS 파일을 import할 수 있습니다. CSS Modules도 지원됩니다.

CSS 지원은 기본적으로 활성화되어 있습니다. Metro config에서 `isCSSEnabled`를 설정해 이 기능을 비활성화할 수 있습니다.

```js
/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Disable CSS support.
  isCSSEnabled: false,
});
```

### Global CSS

> Global styles는 web 전용이며, 이를 사용하면 native와 시각적으로 다른 애플리케이션이 됩니다.

어떤 component에서든 CSS 파일을 import할 수 있습니다. CSS는 전체 페이지에 적용됩니다.

여기서는 클래스 이름 `.container`에 대한 global style을 정의하겠습니다:

```css
.container {
  background-color: red;
}
```

그런 다음 stylesheet를 import하고 `.container`를 사용해 component에서 해당 클래스 이름을 사용할 수 있습니다:

```jsx
import './styles.css';
import { View } from 'react-native';

export default function App() {
  return (
    <>
      {/* Use `className` to assign the style with React DOM components. */}
      <div className="container">Hello World</div>

      {/* Use `style` with the following syntax to append class names in React Native for web. */}
      <View
        style={{
          $$css: true,
          _: 'container',
        }}>
        Hello World
      </View>
    </>
  );
}
```

node module을 import하듯이 library에 포함된 stylesheet도 import할 수 있습니다:

```js
// Applies the styles app-wide.
import 'emoji-mart/css/emoji-mart.css';
```

-   native에서는 모든 global stylesheet가 자동으로 무시됩니다.
-   Global stylesheet는 hot reloading을 지원하므로 파일을 저장하기만 하면 변경 사항이 적용됩니다.

### CSS Modules

> native용 CSS Modules는 현재 개발 중이며 현재는 web에서만 동작합니다.

CSS Modules는 CSS를 특정 component 범위로 제한하는 방법입니다. 이는 이름 충돌을 피하고 스타일이 의도한 component에만 적용되도록 보장할 때 유용합니다.

Expo에서 CSS Modules는 `.module.css` 확장자를 가진 파일을 만들어 정의합니다. 이 파일은 어떤 component에서든 import할 수 있습니다. export된 값은 클래스 이름을 key로, web 전용 scope 이름을 value로 갖는 object입니다. `unstable_styles` import를 사용하면 `react-native-web`에서 안전한 스타일에 접근할 수 있습니다.

CSS Modules는 플랫폼 확장을 지원하므로 플랫폼마다 다른 스타일을 정의할 수 있습니다. 예를 들어 Android와 iOS용 스타일을 각각 정의하기 위해 `module.ios.css`와 `module.android.css` 파일을 만들 수 있습니다. import할 때는 확장자를 생략해야 합니다. 예를 들면 다음과 같습니다:

확장자를 뒤집어서 예를 들어 `App.ios.module.css`처럼 작성하면 동작하지 않으며, `App.ios.module`이라는 범용 module이 됩니다.

> React Native 또는 React Native for web component의 `className` prop에는 styles를 전달할 수 없습니다. 대신 `style` prop을 사용해야 합니다.

```jsx
import styles, { unstable_styles } from './App.module.css';

export default function Page() {
  return (
    <>
      <Text
        style={{
          // This is how react-native-web class names are applied
          $$css: true,
          _: styles.text,
        }}>
        Hello World
      </Text>
      <Text style={unstable_styles.text}>Hello World</Text>
      {/* Web-only usage: */}
      <p className={styles.text}>Hello World</p>
    </>
  );
}
```

```css
.text {
  color: red;
}
```

-   web에서는 모든 CSS 값을 사용할 수 있습니다. CSS는 React Native Web의 `StyleSheet` API처럼 처리되거나 자동으로 prefix가 붙지 않습니다. `postcss.config.js`를 사용해 CSS에 autoprefix를 적용할 수 있습니다.
-   CSS Modules는 내부적으로 [lightningcss](https://github.com/parcel-bundler/lightningcss)를 사용합니다. 지원되지 않는 기능은 [이슈 목록](https://github.com/parcel-bundler/lightningcss/issues)에서 확인하세요.

### PostCSS

[PostCSS](https://github.com/postcss/postcss)는 프로젝트 루트에 `postcss.config.json` 파일을 추가해 사용자 지정할 수 있습니다. 이 파일은 PostCSS configuration object를 반환하는 함수를 export해야 합니다. 예를 들면 다음과 같습니다:

```json
{
  "plugins": {
    "tailwindcss": {}
  }
}
```

`postcss.config.json`과 `postcss.config.js` 모두 지원되지만, `postcss.config.json`이 더 나은 caching을 제공합니다.

Expo CLI는 [browserslist](https://browsersl.ist/)에 대한 내장 지원으로 CSS vendor prefix를 자동 처리합니다. `autoprefixer`를 추가하면 기능이 중복되고 번들링 속도가 느려지므로 피하세요.

#### 업데이트 후 cache 초기화

Post CSS 또는 `browserslist` 구성을 변경하면 Metro cache를 비워야 합니다:

```sh
npx expo start --clear
npx expo export --clear
```

### browserslist

Expo는 Rust 기반 CSS parser를 통해 자동 [browserslist](https://browsersl.ist/) 지원을 제공합니다. **package.json** 파일에 **browserslist** 필드를 추가해 CSS vendor prefix와 브라우저 지원 범위를 사용자 지정할 수 있습니다. 예를 들면 다음과 같습니다:

```json
{
  "browserslist": [">0.2%", "not dead", "not op_mini all"]
}
```

### SASS

Expo Metro는 SCSS/SASS를 _부분적으로_ 지원합니다.

설정하려면 프로젝트에 `sass` 패키지를 설치하세요:

```sh
yarn add -D sass
```

그런 다음 **metro.config.js** 파일에서 [CSS가 설정되어 있는지](/versions/latest/config/metro#css) 확인하세요.

-   `sass`가 설치되어 있으면 확장자가 없는 module은 `scss`, `sass`, `css` 순서로 resolve됩니다.
-   `sass` 파일에는 의도한 문법만 사용하세요.
-   현재 scss/sass 파일 내부에서 다른 파일을 import하는 것은 지원되지 않습니다.

### Tailwind

> Standard Tailwind CSS는 web 플랫폼만 지원합니다. 범용 지원이 필요하다면 [NativeWind](https://www.nativewind.dev/)나 [Uniwind](https://uniwind.dev/) 같은 library를 사용하세요. 이들은 Tailwind CSS로 스타일링된 React Native component를 만들 수 있게 해줍니다.

[Tailwind CSS](/guides/tailwind) — Expo 프로젝트에서 Tailwind CSS를 구성하고 사용하는 방법을 알아보세요.

## Babel transformer 확장하기

Expo의 Metro config는 `expo-babel-preset`이 항상 사용되고 web/Node.js 환경이 지원되도록 사용자 지정 `transformer.babelTransformerPath` 값을 사용합니다.

Babel transformer를 확장하려면 `metro-react-native-babel-transformer` 대신 `@expo/metro-config/babel-transformer`에서 upstream transformer를 import하세요. 예를 들면 다음과 같습니다:

```js
const upstreamTransformer = require('@expo/metro-config/babel-transformer');

module.exports.transform = async ({ src, filename, options }) => {
  // Do something custom for SVG files...
  if (filename.endsWith('.svg')) {
    src = '...';
  }
  // Pass the source through the upstream Expo transformer.
  return upstreamTransformer.transform({ src, filename, options });
};
```

## 사용자 지정 resolving

Expo CLI는 기본 Metro resolver를 확장해 Web, Server, tsconfig alias 지원 같은 기능을 추가합니다. 같은 방식으로 `config.resolver.resolveRequest` 함수를 체이닝해 Metro의 기본 resolution 동작을 사용자 지정할 수 있습니다.

```tsx
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('my-custom-resolver:')) {
    // Logic to resolve the module name to a file path...
    // NOTE: Throw an error if there is no resolution.
    return {
      filePath: 'path/to/file',
      type: 'sourceFile',
    };
  }

  // Ensure you call the default resolver.
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
```

전통적인 bundler와 달리 Metro는 모든 플랫폼에서 동일한 resolver 함수를 공유합니다. 따라서 `context` object를 사용해 각 요청마다 resolution 설정을 동적으로 변경할 수 있습니다.

### Module mock 처리

특정 플랫폼에서 어떤 module을 비워 두고 싶다면 resolver에서 `type: 'empty'` object를 반환하면 됩니다. 다음 예시는 web에서 `lodash`를 빈 module로 만듭니다:

```ts
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'lodash') {
    return {
      type: 'empty',
    };
  }

  // Ensure you call the default resolver.
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
```

이 기법은 Webpack이나 Vite에서 빈 externals를 사용하는 것과 동일하지만, 특정 플랫폼만 대상으로 지정할 수 있다는 추가 이점이 있습니다.

### Virtual modules

현재 Metro는 virtual module을 지원하지 않습니다. 비슷한 동작을 얻는 한 가지 방법은 `node_modules/.cache/...` 디렉터리에 module을 만들고 resolution을 그 파일로 리디렉션하는 것입니다.

다음 예시는 `node_modules/.cache/virtual/virtual-module.js`에 module을 만들고 `virtual:my-module`의 resolution을 그 파일로 리디렉션합니다:

```ts
const path = require('path');
const fs = require('fs');

const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const virtualPath = path.resolve(__dirname, 'node_modules/.cache/virtual/virtual-module.js');

// Create the virtual module in a generated directory...
fs.mkdirSync(path.dirname(virtualPath), { recursive: true });
fs.writeFileSync(virtualPath, 'export default "Hello World";');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'virtual:my-module') {
    return {
      filePath: virtualPath,
      type: 'sourceFile',
    };
  }

  // Ensure you call the default resolver.
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
```

이 방식은 사용자 지정 import로 `externals`를 흉내 내는 데 사용할 수 있습니다. 예를 들어 `require('expo')`를 `SystemJS.require('expo')`처럼 사용자 지정한 무언가로 리디렉션하고 싶다면, `SystemJS.require('expo')`를 export하는 virtual module을 만든 다음 `expo`의 resolution을 그 파일로 리디렉션하면 됩니다.

## 사용자 지정 transforming

> Transform은 Metro에서 강하게 cache됩니다. 무언가를 업데이트했다면 변경 내용을 보려면 `--clear` 플래그를 사용하세요. 예: `npx expo start --clear`.

Metro에는 파일을 변환하기 위한 표현력이 높은 plugin system이 없으므로, 대신 [**babel.config.js**](/versions/latest/config/babel)와 caller object를 사용해 변환을 사용자 지정하세요.

```js
module.exports = function (api) {
  // Get the platform that Expo CLI is transforming for.
  const platform = api.caller(caller => (caller ? caller.platform : 'ios'));

  // Detect if the bundling operation is for Hermes engine or not, e.g. `'hermes'` | `undefined`.
  const engine = api.caller(caller => (caller ? caller.engine : null));

  // Is bundling for a server environment, e.g. API Routes.
  const isServer = api.caller(caller => (caller ? caller.isServer : false));

  // Is bundling for development or production.
  const isDev = api.caller(caller =>
    caller
      ? caller.isDev
      : process.env.BABEL_ENV === 'development' || process.env.NODE_ENV === 'development'
  );

  // Ensure the config is not cached otherwise the platform will not be updated.
  api.cache(false);
  // You can alternatively provide a more robust CONFIG cache invalidation:
  // api.cache.invalidate(() => platform);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Add a plugin based on the platform...
      platform === 'web' && 'my-plugin',

      // Ensure you filter out falsy values.
    ].filter(Boolean),
  };
};
```

caller에 `engine`, `platform`, `bundler` 등이 없다면 transformer로 `@expo/metro-config/babel-transformer`를 사용하고 있는지 확인하세요. 사용자 지정 transformer를 사용 중이라면 Expo transformer를 확장해야 할 수 있습니다.

가능하다면 항상 사용자 지정 로직은 resolver에 구현하려고 하세요. caching이 훨씬 단순하고 추론하기 쉽습니다. 예를 들어 import를 다시 매핑해야 한다면, 가능한 모든 import 방식을 파싱하고 transformer에서 다시 매핑하는 것보다 resolver를 사용해 정적 파일로 resolve하는 편이 더 단순하고 빠릅니다.

항상 `babel-preset-expo`를 기본 Babel preset으로 사용하세요. 그래야 변환이 항상 Expo runtime과 호환됩니다. `babel-preset-expo`는 주어진 플랫폼, engine, 환경에 최적화하기 위해 caller 입력값을 내부적으로 모두 사용합니다.

## Node.js built-ins

server 환경으로 번들링할 때 Expo의 Metro config는 현재 Node.js 버전에 따라 Node.js built-in module(`fs`, `path`, `node:crypto` 등)을 자동으로 externalize하도록 지원합니다. CLI가 browser 환경용으로 번들링하는 경우 built-in은 먼저 module이 로컬에 설치되어 있는지 확인하고, 없으면 빈 shim으로 대체합니다. 예를 들어 browser에서 사용하기 위해 `path`를 설치했다면 그것을 사용할 수 있고, 그렇지 않으면 해당 module은 자동으로 건너뜁니다.

## 환경 설정

> 이 환경 변수들은 test 환경에서는 정의되지 않습니다.

Expo의 Metro config는 client bundle에서 환경 변수로 사용할 수 있는 build 설정을 주입합니다. 모든 변수는 inline 처리되므로 동적으로 사용할 수 없습니다. 예를 들어 `process.env["EXPO_BASE_URL"]`은 동작하지 않습니다.

-   `process.env.EXPO_BASE_URL`은 `experiments.baseUrl`에 정의된 base URL을 노출합니다. Expo Router에서 배포를 위한 production base URL을 존중하는 데 사용됩니다.

## Bundle splitting

Expo CLI는 production에서 async import를 기준으로 web bundle을 자동으로 여러 chunk로 분할합니다. 이 기능을 사용하려면 `@expo/metro-runtime`이 설치되어 있고 entry bundle 어딘가에서 import되어 있어야 합니다(Expo Router에서는 기본 제공).

async bundle의 공통 dependency는 요청 수를 줄이기 위해 하나의 chunk로 합쳐집니다. 예를 들어 `lodash`를 import하는 async bundle이 두 개 있다면, 그 library는 하나의 초기 chunk로 병합됩니다.

chunk 분할 heuristic은 사용자 지정할 수 없습니다. 예를 들면 다음과 같습니다:

`math.js`

`index.js`

```js
export function add(a, b) {
  return a + b;
}
```

```js
import '@expo/metro-runtime';

// This will be split into a separate chunk.
import('./math').then(math => {
  console.log(math.add(1, 2));
});
```

`npx expo export -p web`를 실행하면 bundle은 여러 파일로 분할되고, entry bundle은 main HTML 파일에 추가됩니다. `@expo/metro-runtime`은 async bundle을 로드하고 평가하는 runtime code를 추가합니다.

## Source map debug ID

bundle이 외부 source map과 함께 export되면 파일 끝에 [**Debug ID**](https://sentry.engineering/blog/the-case-for-debug-ids) annotation이 추가되고, source map에도 대응 파일을 연결하기 위한 동일한 `debugId`가 포함됩니다. source map을 export하지 않거나 inline source map을 사용하면 이 annotation은 추가되지 않습니다.

```js
// <all source code>

//# debugId=<deterministic chunk hash>
```

연관된 `*.js.map` 또는 `*.hbc.map` source map은 같은 `debugId` 속성을 포함하는 JSON 파일이 됩니다. `debugId`는 모든 경우에 일치하도록 Hermes bytecode 생성 전에 주입됩니다.

`debugId`는 외부 bundle splitting 참조를 제외한 bundle 내용의 deterministic hash입니다. 이는 chunk filename을 생성할 때 사용하는 값과 같지만 UUID 형식으로 표현됩니다. 예: `431b98e2-c997-4975-a3d9-2987710abd44`.

`@expo/metro-config`는 `npx expo export`와 `npx expo export:embed` 중 `debugId`를 주입합니다. Hermes bytecode 생성 같은 `npx expo export:embed`의 추가 최적화 단계를 거칠 경우 `debugId`를 수동으로 주입해야 합니다.

## Metro require runtime

환경 변수 `EXPO_USE_METRO_REQUIRE=1`로 사용자 지정 Metro `require` 구현을 선택적으로 활성화할 수 있습니다. 이 runtime은 다음 기능을 제공합니다:

-   사람이 읽을 수 있는 문자열 module ID를 사용해 누락된 module 오류를 더 쉽게 추적할 수 있습니다.
-   실행 간, module 간에 동일한 deterministic ID를 사용합니다(development에서 React Server Components에 필요).
-   legacy RAM bundle 지원이 제거됩니다.

## Magic import comments

> SDK 52부터 모든 플랫폼에서 사용 가능합니다.

Workers, Node.js 같은 server 환경은 런타임에 임의의 파일을 import할 수 있으므로, Metro의 require system을 사용하는 대신 `import` 문법을 그대로 유지하고 싶을 수 있습니다. `import()` 구문 안에 `/* @metro-ignore */` comment를 넣으면 dynamic import를 opt-out할 수 있습니다.

```js
// Manually ensure `./my-module.js` is included in the correct spot relative to the module.
const myModule = await import(/* @metro-ignore */ './my-module.js');
```

Expo CLI는 `./my-module.js` dependency를 건너뛰고, 개발자가 이를 출력 bundle에 수동으로 추가했다고 가정합니다. 내부적으로는 요청에 따라 파일을 동적으로 전환하는 사용자 지정 server code를 export할 때 이 기능을 사용합니다. React Native에서 Hermes가 활성화된 상태에서는 일반적으로 `import()`를 사용할 수 없으므로 native bundle에는 이 문법을 사용하지 않는 것이 좋습니다.

많은 React library는 비슷한 동작을 위해 Webpack의 `/* webpackIgnore: true */` comment를 사용해 왔습니다. 이 차이를 메우기 위해 Webpack comment도 지원하지만, 앱에서는 Metro에 해당하는 comment 사용을 권장합니다.

## ES Module resolution

> 이 섹션은 SDK 53부터 모든 플랫폼에 적용됩니다.

Metro는 ES Module `import`와 CommonJS `require`를 서로 다른 resolution 전략으로 처리합니다.

이전에는 Metro가 ES Modules 지원을 위한 몇 가지 추가 기능과 함께 classic Node.js module resolution 전략(Node.js v12 이전 버전과 일치)을 적용했습니다. 이 전략에서는 Metro가 `node_modules`와 JS 파일에서 module을 resolve하며, 필요하면 `.js` 같은 확장자를 생략하고 `main`, `module`, `react-native` 같은 `package.json` 필드를 사용합니다.

이제 modern ES Modules resolution 전략에서는 Metro가 `node_modules`에서 module을 resolve한 뒤 `exports` 같은 서로 다른 `package.json` 필드, [패키지가 노출하는 하위 경로의 중첩 맵](https://nodejs.org/api/packages.html#conditional-exports), 그리고 `main`을 기준으로 매칭합니다.

패키지가 import되는 방식에 따라 이 두 전략 중 하나가 사용됩니다. 일반적으로 Node module에서 `require`가 아니라 `import`로 import된 파일은 ES Modules resolution 전략을 사용하고, 그다음 일반 classic Node.js resolution으로 fallback합니다. ES Modules resolution으로 resolve되지 않았거나 CommonJS `require`로 import된 파일은 classic resolution 전략을 사용합니다.

### `package.json:exports`

ES Modules resolution을 수행할 때 Metro는 `package.json:exports` conditions map을 확인합니다. 이는 import subpath와 condition을 Node module package 안의 파일에 매핑한 것입니다.

예를 들어 항상 **index.js** 파일을 노출하고 Metro의 classic CommonJS module resolution과도 맞는 package는 `default` condition이 있는 map을 지정할 수 있습니다.

```json
{
  "exports": {
    "default": "./index.js"
  }
}
```

반면 CommonJS와 ES Modules entrypoint를 모두 제공하는 package는 `import`와 `require` condition을 포함한 mapping을 제공할 수 있습니다.

```json
{
  "exports": {
    "import": "./index.mjs",
    "require": "./index.cjs"
  }
}
```

기본적으로 Metro는 플랫폼과 resolution이 CommonJS `require` 호출에서 시작되었는지, ES Modules `import` 문에서 시작되었는지에 따라 서로 다른 condition을 매칭하며 그에 맞게 condition을 변경합니다.

native 플랫폼에서는 `react-native` condition이 추가되고, web export에는 `browser` condition이 추가되며, API route나 React Server function 같은 server export에는 `node`, `react-server`, `workerd` condition이 추가됩니다. 이 condition들은 정의된 순서대로 매칭되는 것이 아닙니다. 대신 `package.json:exports` map의 속성 순서를 기준으로 매칭됩니다.

TypeScript는 Metro와 별도로 ES Module resolution을 수행하며, `compilerOptions.moduleResolution` 구성 옵션이 `"bundler"`(Metro 동작과 더 유사) 또는 `"node16"` / `"nodenext"`로 설정되어 있으면 `package.json:exports` map도 존중합니다. 다만 TypeScript는 `types` condition도 함께 매칭합니다. 따라서 package가 exports map에서 `types` condition을 가장 앞에 두지 않으면 type resolution이 올바르게 동작하지 않을 수 있습니다.

exports map에는 subpath가 포함될 수 있으므로, package import가 더 이상 반드시 package의 modules folder 안 파일과 일치할 필요는 없으며 "리디렉션된" import가 될 수도 있습니다. `'package/submodule'`을 import해도 `package.json:exports`에 지정되어 있다면 **node_modules/package/submodule.js**가 아닌 다른 파일과 매칭될 수 있습니다.

```json
{
  "exports": {
    ".": "./index.js",
    "./submodule": "./submodule/submodule.js"
  }
}
```

새 ES Modules resolution 전략과 호환되지 않거나 아직 준비되지 않은 package를 만난다면, 해당 `package.json` 파일을 patch해서 `package.json:exports` conditions map을 추가하거나 수정하면 문제를 해결할 수 있을 수 있습니다. 하지만 `unstable_enablePackageExports` 옵션을 비활성화해 Metro가 `package.json:exports` map을 resolution에 사용하지 못하게 할 수도 있습니다.

```js
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = false;

module.exports = config;
```

## Asset imports

asset를 import하면 asset import에 필요한 데이터를 표현하는 virtual module이 생성됩니다.

native 플랫폼에서 asset는 `1`, `2`, `3` 같은 숫자 ID가 되며, `require("@react-native/assets-registry/registry").getAssetByID(<NUMBER>)`를 사용해 조회할 수 있습니다. web과 server 플랫폼에서는 파일 유형에 따라 asset 값이 달라집니다. 파일이 이미지라면 asset는 `{ uri: string, width?: number, height?: number }`가 되고, 그 외의 경우 asset는 해당 asset의 원격 URL을 나타내는 `string`이 됩니다. SDK 55부터는 web에서 `String(asset)`를 사용해 모든 asset의 공개 URL을 얻을 수 있지만, `toString` 함수를 가질 수 없는 React Server Component 환경은 제외됩니다.

asset는 다음과 같이 사용할 수 있습니다:

```jsx
import { Image } from 'react-native';

import asset from './img.png';

function Demo() {
  return <Image source={asset} />;
}
```

API route에서는 asset type이 숫자가 아니라고 항상 가정할 수 있습니다:

```js
import asset from './img.png';

export async function GET(req: Request) {
  const ImageData = await fetch(
    new URL(
      // Access the asset URI.
      asset.uri,
      // Append to the current request URL origin.
      req.url
    )
  ).then(res => res.arrayBuffer());

  return new Response(ImageData, {
    headers: {
      'Content-Type': 'image/png',
    },
  });
}
```

## Web workers

> 이 기능은 alpha이며, 호환성이 깨지는 변경이 생길 수 있습니다.

```ts
new Worker(new URL('./worker', window.location.href));
```

Expo Metro에는 실험적인 web worker 지원이 있습니다. 이 기능은 현재 web 전용이며 native에서는 동작하지 않습니다. native에서 사용하면 "Property 'Worker' doesn't exist" 오류가 발생합니다.

Web worker는 작업을 web의 별도 thread로 오프로드해 main thread가 계속 반응하도록 만들 때 사용할 수 있습니다. 이는 이미지 처리, 암호화, 또는 main thread를 막아버릴 수 있는 다른 고비용 계산 작업에 유용합니다.

Worker는 `Blob`을 사용해 inline으로 생성할 수 있지만, 때로는 TypeScript 사용이나 다른 module import 같은 현대적인 기능을 활용하고 싶을 수 있습니다.

Web worker는 Expo bundle splitting 지원에 의존하므로 Expo Router를 사용하거나 `@expo/metro-runtime`을 설치하고 import해야 합니다. 또한 web worker와 함께 `EXPO_NO_METRO_LAZY=1` 환경 변수를 사용할 수 없습니다.

숫자를 두 배로 만드는 worker 예시는 다음과 같습니다:

```ts
self.onmessage = ({ data }) => {
  const result = data * 2; // Example: double the number
  self.postMessage(result);
};
```

이 worker 파일은 main app에서 `Worker`로 import할 수 있습니다:

```ts
// worker is of type `Worker`
const worker = new Worker(new URL('./worker', window.location.href));

worker.onmessage = ({ data }) => {
  console.log(`Worker responded: ${data}`);
};

worker.postMessage(5);
```

내부적으로 Expo CLI는 다음과 같은 코드를 생성합니다:

```ts
const worker = new Worker(
  new URL('/worker.bundle?platform=web&dev=true&etc', window.location.href)
);
```

생성된 bundle URL은 development/production에 따라 달라져 worker가 올바르게 로드되고 번들되도록 보장합니다. 전통적인 bundle splitting과 달리 worker 파일은 자신이 사용하는 모든 module 사본을 스스로 포함해야 하며 main bundle의 공통 module에 의존할 수 없습니다.

native API인 `Worker`는 원래 React Native에서 사용할 수 없고 Expo SDK에서도 제공하지 않기 때문에, 이 번들링 기능은 기술적으로는 모든 플랫폼에서 동작하더라도 실제로 유용한 것은 web뿐입니다. native 플랫폼도 지원하고 싶다면 이론적으로는 `Worker` API를 polyfill하는 native Expo module을 작성할 수 있습니다. 또는 native에서 별도 thread로 작업을 오프로드하려면 React Native Reanimated의 "worklet" API를 사용할 수 있습니다.

또는 먼저 변환된 JS 파일을 **public** 디렉터리에 넣은 뒤, worker import에서 변수를 사용해 public path로 Worker를 import할 수도 있습니다:

```ts
// Will avoid the transform and use the public path directly.
const worker = new Worker('/worker.js');

// The variable breaks the transform causing the literal path to be used instead of the transformed path.
const path = '/worker.js';

const anotherWorker = new Worker(new URL(path, window.location.href));
```

`Worker` constructor에서 변수를 사용하는 방식은 bundling을 위해 지원되지 않습니다. 내부 URL을 확인하려면 내부 문법인 `require.unstable_resolveWorker('./path/to/worker.js')`를 사용해 URL fragment를 얻을 수 있습니다.

## Bare workflow 설정

> 이 가이드는 버전이 지정되므로 Expo를 업그레이드하거나 다운그레이드할 때 다시 검토해야 합니다. 또는 완전히 자동화된 설정을 위해 [Expo Prebuild](/more/glossary-of-terms#prebuild)를 사용하세요.

[Expo Prebuild](/more/glossary-of-terms#prebuild)를 사용하지 않는 프로젝트는 Expo Metro config가 항상 프로젝트 번들링에 사용되도록 native 파일을 구성해야 합니다.

이 수정은 `npx react-native bundle`과 `npx react-native start`를 각각 `npx expo export:embed`와 `npx expo start`로 대체하기 위한 것입니다.

### metro.config.js

**metro.config.js**가 `expo/metro-config`를 확장하고 있는지 확인하세요:

```js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
```

### `android/app/build.gradle`

Android **app/build.gradle**은 production bundling에 Expo CLI를 사용하도록 구성되어야 합니다. `react` config object를 수정하세요:

### `ios/<Project>.xcodeproj/project.pbxproj`

**ios/<Project>.xcodeproj/project.pbxproj** 파일에서는 다음 script를 교체하세요:

#### "Start Packager" script

**"Start Packager"** script를 제거하세요. dev server는 앱 실행 전이나 후에 `npx expo`로 시작해야 합니다.

#### "Bundle React Native code and images" script

또는 Xcode 프로젝트에서 **"Bundle React Native code and images"** build phase를 선택한 뒤 다음 수정 사항을 추가하세요:

> `CLI_PATH`, `BUNDLE_COMMAND`, `ENTRY_FILE` 환경 변수를 설정해 이 기본값들을 덮어쓸 수 있습니다.

### 사용자 지정 entry file

기본적으로 React Native는 루트 `index.js` 파일(또는 `index.ios.js` 같은 플랫폼별 변형)만 entry file로 지원합니다. Expo 프로젝트는 어떤 entry file이든 사용할 수 있지만, 이를 위해서는 bare setup을 추가해야 합니다.

#### Development

development mode entry file은 [`expo-dev-client`](/versions/latest/sdk/dev-client) 패키지를 사용해 활성화할 수 있습니다. 또는 다음 구성을 추가할 수 있습니다:

#### Production

**ios/<Project>.xcodeproj/project.pbxproj** 파일에서 **"Bundle React Native code and images"** script를 교체해 Metro를 사용해 `$ENTRY_FILE`을 적절히 설정하세요:

Android **app/build.gradle**은 루트 entry file을 찾기 위해 Metro module resolution을 사용하도록 구성되어야 합니다. `react` config object를 수정하세요:
