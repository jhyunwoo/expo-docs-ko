---
modificationDate: February 26, 2026
title: ESLint와 Prettier 사용하기
description: Expo 앱을 포맷하기 위해 ESLint와 Prettier를 설정하는 가이드입니다.
---

# ESLint와 Prettier 사용하기

Expo 앱을 포맷하기 위해 ESLint와 Prettier를 설정하는 가이드입니다.

[ESLint](https://eslint.org/)는 코드의 오류를 찾고 수정하는 데 도움을 주는 JavaScript linter입니다. 더 나은 코드를 작성하고 실수가 프로덕션에 반영되기 전에 잡아내는 데 아주 좋은 도구입니다. 함께 [Prettier](https://prettier.io/docs/en/)를 사용할 수도 있는데, 이것은 모든 코드 파일이 일관된 스타일을 따르도록 보장하는 code formatter입니다.

이 가이드는 ESLint와 Prettier를 설정하고 구성하는 단계를 제공합니다.

## ESLint

### Setup

> **SDK 53부터는**, 기본 ESLint config 파일이 [Flat config](https://eslint.org/blog/2022/08/new-config-system-part-2/) 형식을 사용합니다. legacy config도 지원합니다. **SDK 52 이하에서는**, 기본 ESLint config 파일이 legacy config를 사용하며 Flat config를 지원하지 않습니다.

Expo 프로젝트에서 ESLint를 설정하려면 Expo CLI를 사용해 필요한 의존성을 설치할 수 있습니다. 이 명령을 실행하면 프로젝트 루트에 [`eslint-config-expo`](https://github.com/expo/expo/tree/main/packages/eslint-config-expo)의 설정을 확장하는 **eslint.config.js** 파일도 생성됩니다.

```sh
npx expo lint
```

### Usage

> **권장:** VS Code를 사용 중이라면 [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)을 설치해 입력하면서 바로 lint가 실행되도록 하세요.

명령줄에서 `npx expo lint` 스크립트로 수동으로 코드를 lint할 수 있습니다:

```sh
npx expo lint
```

위 명령을 실행하면 **package.json**의 `lint` 스크립트가 실행됩니다.

```sh
/src/components/hello-wave.tsx
22:6 warning React Hook useEffect has a missing dependency: "rotateAnimation".
Either include it or remove the dependency array react-hooks/exhaustive-deps
✖ 1 problem (0 errors, 1 warning)
```

### Environment configuration

ESLint는 일반적으로 단일 환경을 기준으로 설정됩니다. 하지만 Expo 앱에서는 소스 코드가 여러 다른 환경에서 실행되는 JavaScript로 작성됩니다. 예를 들어 **app.config.js**, **metro.config.js**, **babel.config.js**, **src/app/+html.tsx** 파일은 Node.js 환경에서 실행됩니다. 즉 전역 `__dirname` 변수에 접근할 수 있고 `path` 같은 Node.js 모듈을 사용할 수 있습니다. **src/app/index.js** 같은 표준 Expo 프로젝트 파일은 Hermes, Node.js 또는 웹 브라우저에서 실행될 수 있습니다.

환경별 전역 변수를 설정하는 방식은 Flat config와 legacy config에 따라 다릅니다:

Flat config의 경우, **metro.config.js** 파일은 `eslint-config-expo`의 내장 지원 덕분에 이미 Node.js 전역과 함께 잘 동작합니다. Node.js 전역이 필요할 수 있는 다른 설정 파일에 대해서는 **eslint.config.js**에서 [`languageOptions.globals`](https://eslint.org/docs/latest/use/configure/language-options#predefined-global-variables)를 사용하세요:

```js
const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  globalIgnores(['dist/*']),
  expoConfig,
  {
    files: ['babel.config.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
]);
```

예를 들어 이 설정을 사용하면 이제 **babel.config.js**에서 Node.js 전역을 사용할 수 있습니다:

```js
import path from 'path';
const __dirname = path.dirname(__filename);

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

## Prettier

### Installation

프로젝트에 Prettier를 설치하려면:

```sh
npx expo install prettier eslint-config-prettier eslint-plugin-prettier --dev
```

### Setup

Prettier를 ESLint와 통합하려면 **eslint.config.js**를 업데이트하세요:

```js
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: ['dist/*'],
  },
]);
```

이제 `npx expo lint`를 실행하면 Prettier 포맷과 맞지 않는 모든 내용이 오류로 잡히게 됩니다.

Prettier 설정을 커스터마이즈하려면 프로젝트 루트에 **.prettierrc** 파일을 만들고 원하는 설정을 추가하세요.

[Custom Prettier configuration](https://github.com/expo/expo/tree/main/packages/eslint-config-universe#customizing-prettier) — Prettier 설정 커스터마이즈에 대해 더 알아보세요.

## Troubleshooting

### VS Code에서 ESLint가 업데이트되지 않는 경우

VS Code를 사용 중이라면 [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)을 설치해 입력하면서 코드 lint가 실행되도록 하세요. [command palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette)에서 `ESLint: Restart ESLint Server` 명령을 실행해 ESLint 서버를 다시 시작해 볼 수도 있습니다.

### ESLint가 느린 경우

ESLint는 큰 프로젝트에서 실행 속도가 느릴 수 있습니다. 가장 쉬운 속도 개선 방법은 lint 대상 파일 수를 줄이는 것입니다. 프로젝트 루트에 **.eslintignore** 파일을 추가해 다음과 같은 특정 파일과 디렉터리를 무시하세요:

```sh
/.expo
node_modules
```

## Flat config로 마이그레이션

> **참고:** Flat config는 Expo SDK 53 이상에서 지원됩니다.

ESLint와 `eslint-config-expo`를 업그레이드하세요:

```sh
npx expo install eslint eslint-config-expo  --dev
```

ESLint config를 전혀 커스터마이즈하지 않았다면 **.eslintrc.js**를 삭제하고 다음 명령으로 새 config를 생성하세요:

```sh
npx expo lint
```

또는 [ESLint의 migration guide](https://eslint.org/docs/latest/use/configure/migration-guide)를 참고해 config를 마이그레이션할 수 있습니다. `npx expo lint`는 legacy config와 flat config를 모두 지원하므로, 새 config는 CLI에서 자동으로 인식됩니다.
