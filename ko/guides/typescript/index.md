---
modificationDate: February 26, 2026
title: TypeScript 사용하기
description: TypeScript로 Expo 프로젝트를 설정하는 방법에 대한 심층 가이드입니다.
---

# TypeScript 사용하기

TypeScript로 Expo 프로젝트를 설정하는 방법에 대한 심층 가이드입니다.

Expo는 [TypeScript](https://www.typescriptlang.org/)를 최고 수준으로 지원합니다. Expo SDK의 JavaScript 인터페이스는 TypeScript로 작성되어 있습니다.

이 가이드는 새 프로젝트를 빠르게 시작하는 방법과, 기존 JavaScript 기반 Expo 프로젝트를 TypeScript로 마이그레이션하는 단계도 함께 제공합니다.

## Quick start

새 프로젝트를 만들려면 기본 TypeScript 설정, 예제 코드, 기본 navigation 구조가 포함된 기본 template을 사용하세요:

```sh
npx create-expo-app@latest --template default@sdk-55
```

위 명령으로 새 프로젝트를 만든 뒤에는 다음 문서의 지침을 꼭 따라가세요:

-   로컬 개발 환경 설정에 필요한 단계를 제공하는 [Set up your environment](/get-started/set-up-your-environment).
-   개발 서버 실행, 파일 구조, 기타 기능 세부 정보를 제공하는 [Start developing](/get-started/start-developing).

## 기존 JavaScript 프로젝트 마이그레이션

기존 JavaScript 기반 프로젝트를 TypeScript로 마이그레이션하려면 아래 지침을 따르세요:

### .tsx 또는 .ts 확장자를 사용하도록 파일 이름 바꾸기

파일 이름을 바꿔 TypeScript로 변환하세요. 예를 들어 **App.js** 같은 루트 컴포넌트 파일부터 시작해 **App.tsx**로 이름을 바꿀 수 있습니다:

```sh
mv App.js App.tsx
```

> **팁:** 파일에 React 컴포넌트(JSX)가 포함되어 있다면 **.tsx** 확장자를 사용하세요. JSX가 전혀 없다면 **.ts** 확장자를 사용할 수 있습니다.

### 필요한 개발 의존성 설치하기

**package.json**에 `typescript`와 `@types/react` 같은 필요한 `devDependencies`를 설치하려면:

```sh
npx expo install typescript @types/react --dev
```

> 또는 `npx expo start` 명령을 실행해 `typescript`와 `@types/react` dev dependency를 설치할 수 있습니다.

`tsc`로 프로젝트 파일 type checking하기

프로젝트 파일을 type check하려면 프로젝트 루트 디렉터리에서 `tsc` 명령을 실행하세요:

```sh
npm run tsc
yarn tsc
```

### tsconfig.json으로 기본 설정 추가하기

프로젝트의 **tsconfig.json**은 기본적으로 `expo/tsconfig.base`를 확장해야 합니다. 다음 명령을 실행하면 **tsconfig.json** 파일을 자동으로 생성할 수 있습니다:

```sh
npx expo customize tsconfig.json
```

**tsconfig.json**의 기본 설정은 사용하기 쉽고 도입을 장려하도록 구성되어 있습니다. **strict type checking**을 선호하고 런타임 오류 가능성을 줄이고 싶다면 [`compilerOptions`](https://www.typescriptlang.org/docs/handbook/compiler-options.html) 아래에서 `strict`를 활성화하세요:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true
  }
}
```

### Path aliases (선택 사항)

Expo CLI는 **tsconfig.json**의 [path aliases](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)를 자동으로 지원합니다. 이를 사용하면 상대 경로 대신 custom alias로 모듈을 import할 수 있습니다.

예를 들어 **src/components/Button.tsx**의 `Button` 컴포넌트를 **@/components/Button** alias로 import하려면 **tsconfig.json**에 `@/*` alias를 추가하고 이를 **src** 디렉터리로 설정하세요:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

Path alias 비활성화하기

`tsconfigPaths`는 기본적으로 활성화되어 있어 path alias를 설정할 수 있습니다. 프로젝트의 [app config](/workflow/configuration)에서 `tsconfigPaths`를 `false`로 설정하면 비활성화할 수 있습니다:

```json
{
  "expo": {
    "experiments": {
      "tsconfigPaths": false
    }
  }
}
```

#### Considerations

path alias를 사용할 때는 다음을 고려하세요:

-   path alias를 업데이트하려면 **tsconfig.json**을 수정한 뒤 Expo CLI를 다시 시작하세요. alias가 바뀌어도 Metro cache를 지울 필요는 없습니다.
-   TypeScript를 사용하지 않는다면 **jsconfig.json**이 **tsconfig.json**의 대안이 될 수 있습니다.
-   path alias를 정의하면 추가적인 resolution 시간이 들어갑니다.
-   path alias는 Metro(Metro web 포함)에서만 지원되며, deprecated된 `@expo/webpack-config`에서는 지원되지 않습니다.
-   bare 프로젝트에서는 이 기능을 위해 추가 설정이 필요합니다. 자세한 내용은 [Metro setup guide](/versions/latest/config/metro#bare-workflow-setup)를 참고하세요.

### Absolute imports (선택 사항)

프로젝트 루트 디렉터리에서 absolute import를 활성화하려면 **tsconfig.json** 파일에 [`compilerOptions.baseUrl`](https://www.typescriptlang.org/docs/handbook/module-resolution.html#base-url)을 정의하세요:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "baseUrl": "./"
  }
}
```

예를 들어 위 설정을 하면 **src/components/Button** 경로에서 `Button` 컴포넌트를 import할 수 있습니다:

```tsx
import Button from 'src/components/Button';
```

#### Considerations

absolute import를 사용할 때는 다음을 고려하세요:

-   `compilerOptions.paths`는 `compilerOptions.baseUrl`이 정의되어 있다면 그것을 기준으로 resolve되고, 그렇지 않으면 프로젝트 루트 디렉터리를 기준으로 resolve됩니다.
-   `compilerOptions.baseUrl`은 node modules보다 먼저 resolve됩니다. 즉 `./path.ts`라는 파일이 있으면 `path`라는 node module 대신 import될 수 있습니다.
-   **tsconfig.json**을 수정한 뒤 [`compilerOptions.baseUrl`](https://www.typescriptlang.org/docs/handbook/module-resolution.html#base-url)을 업데이트하려면 Expo CLI를 다시 시작해야 합니다.
-   TypeScript를 사용하지 않는다면 **jsconfig.json**이 **tsconfig.json**의 대안이 될 수 있습니다.
-   absolute import는 Metro(Metro web 포함)에서만 지원되며 `@expo/webpack-config`에서는 지원되지 않습니다.
-   bare 프로젝트에서는 이 기능을 위해 추가 설정이 필요합니다. 자세한 내용은 [versioned Metro setup guide](/versions/latest/config/metro#bare-workflow-setup)를 참고하세요.

## Type generation

일부 Expo 라이브러리는 정적 타입과 type generation 기능을 함께 제공합니다. 이 타입들은 프로젝트가 빌드될 때 또는 `npx expo customize tsconfig.json` 명령을 실행할 때 자동 생성됩니다.

## 프로젝트 config 파일용 TypeScript

**metro.config.js** 또는 **app.config.js** 같은 설정 파일에 TypeScript를 사용하려면 추가 설정이 필요합니다.

dev dependency로 [`tsx`](https://tsx.is/)를 설치하고, JS 설정 파일 안에서 TypeScript 파일을 import할 수 있도록 [`tsx/cjs` require hook](https://tsx.is/dev-api/entry-point#commonjs-mode-only)을 사용하세요. 이 hook은 루트 파일을 JavaScript로 유지하면서도 TypeScript import를 허용합니다. 아래 명령은 다음 하위 섹션 예제에서 `import 'tsx/cjs'`가 동작하도록 `tsx`를 추가합니다.

```sh
npx expo install tsx --dev
```

### metro.config.js

**metro.config.js**가 **metro.config.ts** 파일을 require하도록 업데이트하세요:

```js
require('tsx/cjs'); // Add this to import TypeScript files
module.exports = require('./metro.config.ts');
```

프로젝트의 metro 설정으로 **metro.config.ts** 파일을 업데이트하세요:

```ts
import { getDefaultConfig } from 'expo/metro-config';

const config = getDefaultConfig(__dirname);

module.exports = config;
```

Deprecated: webpack.config.js

`@expo/webpack-config` 패키지를 설치하세요.

```js
require('tsx/cjs'); // Add this to import TypeScript files
module.exports = require('./webpack.config.ts');
```

```ts
import createExpoWebpackConfigAsync from '@expo/webpack-config/webpack';
import { Arguments, Environment } from '@expo/webpack-config/webpack/types';

module.exports = async function (env: Environment, argv: Arguments) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Customize the config before returning it.
  return config;
};
```

### app.config.js

**app.config.ts**는 기본적으로 지원됩니다. 하지만 외부 TypeScript 모듈이나 **tsconfig.json** 커스터마이징은 지원하지 않습니다. 더 포괄적인 TypeScript 설정을 원한다면 다음 접근 방식을 사용할 수 있습니다:

```ts
import 'tsx/cjs'; // Add this to import TypeScript files
import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'my-app',
  slug: 'my-app',
};

export default config;
```

## 기타 TypeScript 기능

일부 언어 기능은 추가 설정이 필요할 수 있습니다. 예를 들어 decorator를 사용하고 싶다면 `experimentalDecorators` 옵션을 추가해야 합니다. 사용 가능한 속성에 대한 자세한 내용은 [TypeScript compiler options](https://www.typescriptlang.org/docs/handbook/compiler-options.html) 문서를 참고하세요.

## TypeScript 사용법 익히기

TypeScript 학습을 시작하기 좋은 곳은 공식 [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)입니다.

**TypeScript와 React 컴포넌트에 대해서는,** 다양한 일반적인 상황에서 React 컴포넌트에 타입을 지정하는 방법을 배우기 위해 [React TypeScript CheatSheet](https://github.com/typescript-cheatsheets/react)를 참고하는 것을 권장합니다.
