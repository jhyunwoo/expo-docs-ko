---
modificationDate: February 26, 2026
title: Manual installation
description: 자세한 안내를 따라 기존 프로젝트에 Expo Router를 추가하는 방법을 알아보세요.
---

# Manual installation

자세한 안내를 따라 기존 프로젝트에 Expo Router를 추가하는 방법을 알아보세요.

기존 프로젝트에 Expo Router를 추가하려면 아래 단계를 따르세요. 새 프로젝트라면 소개 가이드의 [Quick start](/router/introduction#quick-start)를 참고하세요.

### Prerequisites

컴퓨터가 [Expo 앱을 실행할 수 있도록 설정되어 있는지](/get-started/create-a-project) 확인하세요.

### Install dependencies

다음 dependency를 설치해야 합니다:

```sh
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

위 명령은 현재 프로젝트에서 사용하는 Expo SDK 버전과 호환되는 라이브러리 버전을 설치합니다.

### Setup entry point

**package.json**의 `main` 속성 값으로 `expo-router/entry`를 사용하세요. 초기 client 파일은 [**src/app/_layout.tsx**](/router/reference/src-directory)입니다(또는 **src** 디렉터리를 사용하지 않는다면 [**app/_layout.tsx**](/router/basics/layout#root-layout)).

```json
{
  "main": "expo-router/entry"
}
```

Custom entry point to initialize and load side-effects

루트 layout(**src/app/_layout.tsx**)이 로드되기 전에 초기화와 side-effect 로드를 수행하기 위해 Expo Router 프로젝트에 custom entry point를 만들 수 있습니다. custom entry point가 자주 필요한 경우는 다음과 같습니다:

-   analytics, error reporting 같은 전역 서비스를 초기화할 때.
-   polyfill을 설정할 때
-   `react-native`의 `LogBox`를 사용해 특정 로그를 무시할 때

1.  프로젝트 루트에 **index.js** 같은 새 파일을 만드세요. 이 파일을 만든 뒤 프로젝트 구조는 다음과 같아야 합니다:
    
    `src`
    
     `app`
    
      `_layout.tsx`
    
    `index.js`
    
    `package.json`
    
    `Other project files`
    
2.  해당 파일에 custom configuration을 import하거나 추가하세요. 그런 다음 앱 entry를 등록하기 위해 `expo-router/entry`를 import합니다. 앱이 렌더링되기 전에 모든 configuration이 올바르게 설정되도록, 항상 마지막에 import해야 한다는 점을 기억하세요.
    
    ```js
    // Import side effects first and services
    
    // Initialize services
    
    // Register app entry through Expo Router
    import 'expo-router/entry';
    ```
    
3.  **package.json**의 `main` 속성을 새 entry 파일로 가리키도록 업데이트하세요.
    
    ```json
    {
      "main": "index.js"
    }
    ```

### Modify project configuration

deep linking `scheme`을 추가하고 [typed routes](/router/reference/typed-routes)를 [app config](/workflow/configuration)에서 활성화하세요:

```json
{
  "scheme": "your-app-scheme",
  "experiments": {
    "typedRoutes": true
  }
}
```

앱을 web용으로 개발하고 있다면 다음 dependency를 설치하세요:

```sh
npx expo install react-native-web react-dom
```

그런 다음 [Metro web](/guides/customizing-metro#adding-web-support-to-metro) 지원을 활성화하려면 다음 내용을 [app config](/workflow/configuration)에 추가하세요:

```json
{
  "web": {
    "bundler": "metro"
  }
}
```

### Modify babel.config.js

프로젝트에 **babel.config.js** 파일이 있다면, `preset`으로 `babel-preset-expo`를 사용하는지 확인하세요. custom Babel configuration이 따로 필요 없다면 이 파일을 완전히 삭제해도 됩니다:

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

### Configure path aliases

[`src` directory](/router/reference/src-directory)를 사용 중이라면 **tsconfig.json**에 path alias를 추가해 상대 경로 대신 `@/components/button`처럼 짧은 import 경로를 사용할 수 있게 하세요:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

위 예시에서 `@/*` alias는 **src** 디렉터리로 매핑됩니다.

### Clear bundler cache

configuration을 업데이트한 뒤 bundler cache를 지우려면 다음 명령을 실행하세요:

```sh
npx expo start --clear
```

### Update resolutions

구버전 Expo Router에서 업그레이드 중이라면 **package.json**에 있는 오래된 Yarn resolution 또는 npm override를 모두 제거했는지 확인하세요. 특히 **package.json**에서 `metro`, `metro-resolver`, `react-refresh` resolution을 제거하세요.
