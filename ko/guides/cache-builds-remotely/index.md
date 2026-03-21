---
modificationDate: November 20, 2025
title: build cache provider 사용하기
description: provider에서 build를 캐시하고 재사용해 로컬 개발 속도를 높이는 방법을 알아보세요.
---

# build cache provider 사용하기

provider에서 build를 캐시하고 재사용해 로컬 개발 속도를 높이는 방법을 알아보세요.

build caching은 프로젝트의 [fingerprint](/versions/latest/sdk/fingerprint)를 기반으로 build를 원격에 캐시하여 `npx expo run:[android|ios]`를 더 빠르게 만드는 기능입니다. `npx expo run:[android|ios]`를 실행하면 일치하는 fingerprint를 가진 build가 있는지 확인한 뒤, 다시 컴파일하는 대신 해당 build를 다운로드해서 실행합니다. 일치하는 build가 없으면 평소처럼 프로젝트를 컴파일한 다음, 이후 실행을 위해 생성된 binary를 원격 cache에 업로드합니다.

## EAS를 build provider로 사용하기

EAS Build provider plugin을 사용하려면 먼저 `eas-build-cache-provider` package를 개발용 dependency로 설치하세요:

```sh
npx expo install eas-build-cache-provider --dev
```

그다음 **app.json**을 업데이트해 `buildCacheProvider` property와 해당 provider를 포함하세요:

```json
{
  "expo": {
    "buildCacheProvider": "eas"
    ... 
  }
}
```

다음 메서드를 구현하는 plugin을 export하여 직접 cache provider를 만들 수도 있습니다:

```ts
type BuildCacheProviderPlugin<T = any> = {
  /**
   * Try to fetch an existing build. Return its URL or null if missing.
   */
  resolveBuildCache(props: ResolveBuildCacheProps, options: T): Promise<string | null>;

  /**
   * Upload a new build binary. Return its URL or null on failure.
   */
  uploadBuildCache(props: UploadBuildCacheProps, options: T): Promise<string | null>;

  /**
   * (Optional) Customize the fingerprint hash algorithm.
   */
  calculateFingerprintHash?: (
    props: CalculateFingerprintHashProps,
    options: T
  ) => Promise<string | null>;
};

type ResolveBuildCacheProps = {
  projectRoot: string;
  platform: 'android' | 'ios';
  runOptions: RunOptions;
  fingerprintHash: string;
};
type UploadBuildCacheProps = {
  projectRoot: string;
  buildPath: string;
  runOptions: RunOptions;
  fingerprintHash: string;
  platform: 'android' | 'ios';
};
type CalculateFingerprintHashProps = {
  projectRoot: string;
  platform: 'android' | 'ios';
  runOptions: RunOptions;
};
```

GitHub Releases를 사용해 build를 캐시하는 reference 구현은 [Build Cache Provider Example](https://github.com/expo/examples/tree/master/with-github-remote-build-cache-provider)에서 확인할 수 있습니다.

## custom build provider 만들기

먼저 TypeScript로 provider plugin을 작성하기 위한 **provider** 디렉터리를 만들고, 프로젝트 루트에 plugin의 entry point가 될 **provider.plugin.js** 파일을 추가하세요.

### `provider/tsconfig.json` 파일 만들기

```json
{
  "extends": "expo-module-scripts/tsconfig.plugin",
  "compilerOptions": {
    "outDir": "build",
    "rootDir": "src"
  },
  "include": ["./src"],
  "exclude": ["**/__mocks__/*", "**/__tests__/*"]
}
```

### plugin용 `provider/src/index.ts` 파일 만들기

```ts
import { type BuildCacheProviderPlugin } from '@expo/config';

const plugin: BuildCacheProviderPlugin = {
  resolveBuildCache: async () => {
    console.log('Searching for remote builds...');
    return null;
  },
  uploadBuildCache: async () => {
    console.log('Uploading build to remote...');
    return null;
  },
};

export default plugin;
```

### 루트 디렉터리에 `provider.plugin.js` 파일 만들기

```js
// This file configures the entry file for your plugin.
module.exports = require('./provider/build');
```

### provider plugin 빌드하기

프로젝트 루트에서 `npm run build provider`를 실행해 TypeScript compiler를 watch mode로 시작하세요.

### `example/app.json` 파일에 다음 줄을 추가해 example 프로젝트가 plugin을 사용하도록 구성하기

```json
{
  "expo": {
    ... 
    "buildCacheProvider": {
      "plugin": "./provider.plugin.js"
    }
  }
}
```

### provider 테스트하기

**example** 디렉터리 안에서 `npx expo run` 명령을 실행하면 로그에 plugin의 console statement가 표시되어야 합니다.

```sh
cd example
npx expo run:android
npx expo run:ios
```

이제 끝입니다. 이제 build 속도를 높이기 위한 원격 build cache provider가 생겼습니다.

### custom option 전달하기

plugin에 custom option을 주입하려면 `options` field를 사용할 수 있으며, 이 값은 custom function의 두 번째 매개변수로 전달됩니다. 이를 위해 아래와 같이 **example/app.json**의 `buildCacheProvider` field를 수정하세요:

```json
{
  "expo": {
    ... 
    "buildCacheProvider": {
      "plugin": "./provider.plugin.js",
      "options": {
        "myCustomKey": "XXX-XXX-XXX"
      }
    }
  }
}
```
