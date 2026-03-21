---
modificationDate: November 03, 2025
title: React Compiler
description: Expo 앱에서 React Compiler를 활성화하고 사용하는 방법을 알아보세요.
---

# React Compiler

Expo 앱에서 React Compiler를 활성화하고 사용하는 방법을 알아보세요.

새로운 [React Compiler](https://react.dev/learn/react-compiler)는 컴포넌트와 hook을 자동으로 memoization하여 세밀한 반응성을 가능하게 합니다. 이는 앱에서 상당한 성능 향상으로 이어질 수 있습니다. 아래 지침을 따라 앱에서 이를 활성화할 수 있습니다.

## Enabling React Compiler

프로젝트가 React Compiler와 [얼마나 호환되는지 확인하세요](https://react.dev/learn/react-compiler#checking-compatibility).

```sh
npx react-compiler-healthcheck@latest
```

이 명령은 일반적으로 앱이 [**rules of React**](https://react.dev/reference/rules)를 따르고 있는지 확인합니다.

프로젝트에 `babel-plugin-react-compiler`와 React compiler runtime을 설치하세요:

Babel은 Expo SDK 54 이상에서 자동으로 설정됩니다.

app config 파일에서 React Compiler experiment를 켜세요:

```json
{
  "expo": {
    "experiments": {
      "reactCompiler": true
    }
  }
}
```

### Enabling the linter

> 앞으로는 아래의 모든 단계가 Expo CLI에 의해 자동화될 예정입니다.

또한 프로젝트에서 rules of React를 지속적으로 강제하려면 ESLint plugin을 사용하는 것이 좋습니다.

앱에 ESLint가 설정되어 있는지 확인하려면 [`npx expo lint`](/guides/using-eslint#eslint)를 실행한 뒤, React Compiler용 ESLint plugin을 설치하세요:

```sh
npx expo install eslint-plugin-react-compiler -- -D
```

plugin이 포함되도록 [ESLint configuration](/guides/using-eslint)을 업데이트하세요:

```js
// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const reactCompiler = require('eslint-plugin-react-compiler');

module.exports = defineConfig([
  expoConfig,
  reactCompiler.configs.recommended,
  {
    ignores: ['dist/*'],
  },
]);
```

## Incremental adoption

몇 가지 전략을 사용해 앱에서 React Compiler를 점진적으로 도입할 수 있습니다:

Babel plugin이 특정 파일이나 컴포넌트에만 실행되도록 구성하세요. 이를 위해:

1.  프로젝트에 [**babel.config.js**](/versions/latest/config/babel)가 없다면 `npx expo customize babel.config.js`를 실행해 파일을 만드세요.
2.  **babel.config.js**에 다음 설정을 추가하세요:

```js
module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      [
        'babel-preset-expo',
        {
          'react-compiler': {
            sources: filename => {
              // Match file names to include in the React Compiler.
              return filename.includes('src/path/to/dir');
            },
          },
        },
      ],
    ],
  };
};
```

**babel.config.js** 파일을 변경할 때마다 변경 사항을 적용하려면 Metro bundler를 다시 시작해야 합니다:

```sh
npx expo start --clear
```

특정 컴포넌트나 파일에서 React Compiler를 제외하려면 `"use no memo"` directive를 사용하세요.

```jsx
function MyComponent() {
  'use no memo';

  return <Text>Will not be optimized</Text>;
}
```

## Usage

> React Compiler가 어떻게 동작하는지 더 잘 이해하려면 [React Playground](https://playground.react.dev/)를 확인해 보세요.

개선 사항은 기본적으로 자동으로 적용됩니다. 자동 memoization을 활용하는 쪽으로 `useCallback`, `useMemo`, `React.memo` 사용 사례를 제거할 수 있습니다. class component는 최적화되지 않습니다. 대신 function component로 마이그레이션하세요.

Expo의 React Compiler 구현은 애플리케이션 코드에서만 실행되며(node modules 제외), 클라이언트용 번들링 시에만 동작합니다(server rendering에서는 비활성화됨).

## Configuration

Babel configuration의 `react-compiler` 객체를 사용해 React Compiler Babel plugin에 추가 설정을 전달할 수 있습니다:

```js
module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      [
        'babel-preset-expo',
        {
          'react-compiler': {
            // Passed directly to the React Compiler Babel plugin.
            compilationMode: 'all',
            panicThreshold: 'all_errors',
          },
          web: {
            'react-compiler': {
              // Web-only settings...
            },
          },
        },
      ],
    ],
  };
};
```
