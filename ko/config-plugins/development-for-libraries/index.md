---
modificationDate: September 11, 2025
title: 라이브러리를 위한 플러그인 개발
description: Expo 및 React Native 라이브러리를 위한 config plugin 개발 방법을 알아보세요.
---

# 라이브러리를 위한 플러그인 개발

Expo 및 React Native 라이브러리를 위한 config plugin 개발 방법을 알아보세요.

React Native 라이브러리 안의 Expo config plugin은 네이티브 프로젝트 구성을 자동화하는 혁신적인 접근 방식입니다. 라이브러리 사용자가 **AndroidManifest.xml**, **Info.plist** 같은 네이티브 파일을 수동으로 수정하도록 요구하는 대신, prebuild 과정에서 이러한 구성을 자동으로 처리하는 plugin을 제공할 수 있습니다. 이렇게 하면 실수하기 쉬운 수동 설정 경험이, 프로젝트마다 일관되게 동작할 수 있는 신뢰성 있는 자동 구성으로 바뀝니다.

이 가이드는 라이브러리에서 config plugin을 구현할 때 사용할 수 있는 핵심 구성 단계와 전략을 설명합니다.

## 라이브러리 안 config plugin의 전략적 가치

Config plugin은 역사적으로 React Native 라이브러리 도입을 필요 이상으로 어렵게 만들었던 여러 연결된 문제를 해결하는 경향이 있습니다. 사용자가 React Native 라이브러리를 설치할 때, 라이브러리가 동작하기 위해 정확하게 수행해야 하는 복잡한 네이티브 구성 단계를 마주하는 경우가 있습니다. 이러한 단계는 플랫폼별이며, 때로는 네이티브 개발 개념에 대한 깊은 이해를 요구합니다.

라이브러리 안에 config plugin을 만들면, 이 복잡해 보이는 수동 과정을 사용자가 Expo 프로젝트의 app config 파일(보통 **app.json**)에 적용할 수 있는 단순한 구성 선언으로 바꿀 수 있습니다. 이렇게 하면 라이브러리 도입 장벽이 낮아지고 동시에 설정 과정의 신뢰성도 높아집니다.

즉각적인 사용자 경험 개선을 넘어, config plugin은 [Continuous Native Generation](/workflow/continuous-native-generation)과의 호환성도 제공합니다. CNG에서는 네이티브 디렉터리를 버전 관리에 체크인하지 않고 자동 생성합니다. config plugin이 없으면 CNG를 채택한 개발자는 어려운 선택을 해야 합니다. 네이티브 파일을 수동 구성하기 위해 CNG 워크플로를 포기하거나, 직접 자동화 솔루션을 만드는 데 많은 노력을 들여야 합니다. 이는 현대 Expo 개발 워크플로에서 라이브러리 도입에 큰 장벽이 됩니다.

## 프로젝트 구조

디렉터리 구조는 라이브러리 안에서 config plugin을 유지 보수하기 위한 기반입니다. 아래는 예시 디렉터리 구조입니다:

`.`

 `android``Android native module code`

  `src`

   `main`

    `java`

     `com`

      `your-awesome-library`

  `build.gradle`

 `ios``iOS native module code`

  `YourAwesomeLibrary`

  `YourAwesomeLibrary.podspec`

 `src`

  `index.ts``Main library entry point`

  `YourAwesomeLibrary.ts``Core library implementation`

  `types.ts``TypeScript type definitions`

 `plugin`

  `src`

   `index.ts``Plugin entry point`

   `withAndroid.ts``Android-specific configurations`

   `withIos.ts``iOS-specific configurations`

  `build`

  `__tests__`

  `tsconfig.json``Plugin-specific TypeScript config`

 `example`

  `app.json``Example app configuration`

  `App.tsx``Example app implementation`

  `package.json``Example app dependencies`

 `__tests__`

 `app.plugin.js``Plugin entry point for Expo CLI`

 `package.json``Package configuration`

 `tsconfig.json``Main TypeScript configuration`

 `jest.config.js``Testing configuration`

 `README.md``Documentation`

위 예시 디렉터리 구조는 다음과 같은 조직 원칙을 보여 줍니다:

-   **루트 수준 분리**: 라이브러리 코드(**src**)와 plugin 구현(**plugin**) 사이의 명확한 경계
-   **Plugin 디렉터리 구성**: 플랫폼별 파일(**withAndroid.ts**, **withIos.ts**)로 나누어 집중된 테스트와 유지 보수를 가능하게 함
-   **빌드 출력 관리**: **plugins/build/** 디렉터리에 컴파일된 JavaScript와 TypeScript declaration 배치
-   **테스트**: 서로 다른 관심사를 반영하기 위해 plugin 테스트와 라이브러리 테스트를 분리

## 개발을 위한 설치 및 구성

Expo 도구를 가장 단순하게 활용하는 방법은 `expo`와 [`expo-module-scripts`](https://www.npmjs.com/package/expo-module-scripts)를 사용하는 것입니다.

-   `expo`는 plugin이 사용할 config plugin API와 type을 제공합니다.
-   `expo-module-scripts`는 Expo module과 config plugin을 위해 특별히 설계된 빌드 도구를 제공합니다. TypeScript 컴파일도 처리합니다.

```sh
npx expo install package
```

`expo-module-scripts`를 사용할 때는 다음 **package.json** 구성이 필요합니다. 이미 같은 이름의 script가 있다면 교체하세요.

```json
{
  "scripts": {
    "build": "expo-module build",
    "build:plugin": "expo-module build plugin",
    "clean": "expo-module clean",
    "test": "expo-module test",
    "prepare": "expo-module prepare",
    "prepublishOnly": "expo-module prepublishOnly"
  },
  "devDependencies": {
    "expo": "^54.0.0"
  },
  "peerDependencies": {
    "expo": ">=54.0.0"
  },
  "peerDependenciesMeta": {
    "expo": {
      "optional": true
    }
  }
}
```

다음 단계는 **plugins** 디렉터리 안에서 TypeScript 지원을 추가하는 것입니다. **plugins/tsconfig.json** 파일을 열고 다음을 추가하세요:

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

또한 **app.plugin.js** 파일에서 config plugin의 메인 entry point를 정의해야 합니다. 이 파일은 **plugin/build** 디렉터리에 있는 컴파일된 plugin 코드를 export합니다:

```js
module.exports = require('./plugin/build');
```

위 구성은 필수적입니다. Expo CLI가 plugin을 찾을 때 라이브러리 프로젝트 루트에서 이 파일을 확인하기 때문입니다. **plugin/build** 디렉터리에는 config plugin TypeScript 소스 코드에서 생성된 JavaScript 파일이 들어 있습니다.

## 핵심 구현 패턴

성공적인 config plugin 구현을 위한 핵심 패턴에는 다음이 포함됩니다:

-   **Plugin 구조**: 모든 plugin이 따라야 하는 핵심 패턴
-   **플랫폼별 구현**: Android와 iOS 구성을 효과적으로 처리하는 방법
-   **테스트 전략**: 테스트를 통해 plugin 코드를 검증하는 방법

### Plugin 구조와 플랫폼별 구현

모든 config plugin은 같은 패턴을 따릅니다. 구성과 매개변수를 받고, mod를 통해 변환을 적용하고, 수정된 구성을 반환합니다. 다음 핵심 plugin 구조를 보세요:

```ts
import { type ConfigPlugin, withAndroidManifest, withInfoPlist } from 'expo/config-plugins';

export interface YourLibraryPluginProps {
  customProperty?: string;
  enableFeature?: boolean;
}

const withYourLibrary: ConfigPlugin<YourLibraryPluginProps> = (config, props = {}) => {
  // Apply Android configurations
  config = withAndroidConfiguration(config, props);

  // Apply iOS configurations
  config = withIosConfiguration(config, props);

  return config;
};

export default withYourLibrary;
```

### 테스트 전략

config plugin 테스트는 런타임 동작이 아니라 구성 변환을 테스트한다는 점에서 일반 라이브러리 테스트와 다릅니다. plugin은 구성 객체를 받아 수정된 구성 객체를 반환합니다.

효과적인 config plugin 테스트는 다음 중 하나 이상을 조합해 구성할 수 있습니다:

-   **Unit testing:** 모의 Expo configuration object를 사용해 구성 변환 로직 테스트
-   **크로스 플랫폼 검증**: example app을 사용해 실제 prebuild 출력 검증
-   **오류 조건 테스트**: 에러 핸들링 사용

unit test는 파일 시스템을 건드리지 않고 plugin의 변환 로직에 집중하므로, Jest를 사용해 모의 config object를 만들고 plugin에 통과시킨 뒤 기대한 수정이 올바르게 이루어졌는지 검증할 수 있습니다. 예를 들면:

```ts
import { withYourLibrary } from '../src';

describe('withYourLibrary', () => {
  it('should configure Android with custom property', () => {
    const config = {
      name: 'test-app',
      slug: 'test-app',
      platforms: ['android', 'ios'],
    };

    const result = withYourLibrary(config, {
      customProperty: 'test-value',
    });

    // Verify the plugin was applied correctly
    expect(result.plugins).toBeDefined();
  });
});
```

오류는 구성 실패 시 명확한 피드백을 제공할 수 있도록 config plugin 안에서 우아하게 처리해야 합니다. `try-catch` 블록을 사용해 조기에 오류를 잡으세요:

```ts
const withYourLibrary: ConfigPlugin<YourLibraryPluginProps> = (config, props = {}) => {
  try {
    // Validate configuration early
    validateProps(props);

    // Apply configurations
    config = withAndroidConfiguration(config, props);
    config = withIosConfiguration(config, props);

    return config;
  } catch (error) {
    // Re-throw with more context if needed
    throw new Error(`Failed to configure YourLibrary plugin: ${error.message}`);
  }
};
```

## 대체 빌드 접근 방식

라이브러리에서 `expo-module-scripts`를 사용하지 않는다면 두 가지 선택지가 있습니다:

### 메인 package에 plugin 추가하기

`create-react-native-library`로 만든 라이브러리처럼 다른 빌드 도구를 사용하는 경우, **app.plugin.js** 파일을 추가하고 메인 package와 함께 빌드하세요:

```js
module.exports = require('./lib/plugin');
```

### 별도의 plugin package 만들기

일부 라이브러리는 메인 라이브러리와 분리된 별도 package로 config plugin을 배포합니다. 이 접근 방식은 config plugin을 네이티브 module 나머지 부분과 분리해 관리할 수 있게 해 줍니다. **app.plugin.js**에 export를 포함하고, plugin의 **build** 디렉터리를 컴파일해야 합니다.

```js
{
  "name": "your-library-expo-plugin",
  "main": "app.plugin.js",
  "files": ["app.plugin.js", "build/"],
  "peerDependencies": {
    "expo": "*",
    "your-library": "*"
  }
}
```

## 플러그인 개발 모범 사례

-   **README에 지침 작성하기**: plugin이 React Native module과 연결되어 있다면 package에 대한 수동 설정 지침을 문서화해야 합니다. plugin에서 문제가 생기면 개발자가 plugin이 자동화한 프로젝트 변경 사항을 직접 수동으로 적용할 수 있어야 합니다. 이렇게 하면 [CNG](/workflow/continuous-native-generation)를 사용하지 않는 프로젝트도 지원할 수 있습니다.
    -   plugin에서 사용할 수 있는 속성을 문서화하고, 필수 속성이 있다면 반드시 명시하세요.
    -   가능하다면 plugin은 idempotent해야 합니다. 즉, 새 네이티브 프로젝트 template에서 실행하든 이미 그 변경이 들어 있는 프로젝트 template에서 다시 실행하든 동일한 변경을 만들어야 합니다. 그래야 개발자가 `--clean` 플래그 없이 `npx expo prebuild`를 실행해 config 변경 사항만 동기화할 수 있고, 네이티브 프로젝트 전체를 다시 만들 필요가 없습니다. dangerous mod를 사용할 때는 이 요구가 더 어려울 수 있습니다.
-   **이름 규칙**: 모든 플랫폼에 적용되는 plugin function 이름에는 `withFeatureName` 형식을 사용하세요. 플랫폼별 plugin이라면 "with" 뒤에 플랫폼 이름이 오는 camel case를 사용하세요. 예를 들어 `withAndroidSplash`, `withIosSplash`.
-   **내장 plugin 활용하기**: [app config](/versions/latest/config/app)와 [prebuild config](https://github.com/expo/expo/blob/main/packages/%40expo/prebuild-config/src/plugins/withDefaultPlugins.ts)에 이미 사용 가능한 구성이 있다면, 그에 대한 config plugin을 따로 작성할 필요가 없습니다.
-   **플랫폼별로 plugin 나누기**: config plugin 안에서 함수를 사용할 때는 플랫폼별로 나누세요. 예를 들어 `withAndroidSplash`, `withIosSplash`. 이렇게 하면 `npx expo prebuild`의 `--platform` 플래그를 사용할 때 `EXPO_DEBUG` 모드에서 어느 플랫폼 함수가 실행되는지 로그로 더 쉽게 따라갈 수 있습니다.
-   **plugin에 대한 unit test 작성하기**: 복잡한 수정에는 Jest 테스트를 작성하세요. plugin이 파일 시스템 접근을 요구한다면 mock 시스템 사용을 권장합니다([`memfs`](https://www.npmjs.com/package/memfs)를 강력히 권장). [`expo-notifications`](https://github.com/expo/expo/blob/fc3fb2e81ad3a62332fa1ba6956c1df1c3186464/packages/expo-notifications/plugin/src/__tests__/withNotificationsAndroid-test.ts#L34) plugin 테스트에서 이런 예시를 볼 수 있습니다.
    -   루트 [\*\*/__mocks__/\*\*/\*](https://github.com/expo/expo/tree/main/packages/expo-notifications/plugin/__mocks__) 디렉터리와 [**plugin/jest.config.js**](https://github.com/expo/expo/tree/main/packages/expo-notifications/plugin/jest.config.js)도 확인해 보세요.
-   타입 안정성이 추가되므로 JavaScript plugin보다 TypeScript plugin이 항상 더 바람직합니다. 자세한 내용은 [`expo-module-scripts` plugin](https://github.com/expo/expo/tree/main/packages/expo-module-scripts#-config-plugin) 도구를 참고하세요.
-   config plugin으로 `sdkVersion`을 수정하지 마세요. 이는 `expo install` 같은 명령을 깨뜨리고 다른 예기치 않은 문제를 일으킬 수 있습니다.
