---
modificationDate: March 03, 2026
title: '튜토리얼: config plugin이 있는 모듈 만들기'
description: Expo Modules API를 사용해 config plugin이 포함된 네이티브 모듈을 만드는 튜토리얼입니다.
---

# 튜토리얼: config plugin이 있는 모듈 만들기

Expo Modules API를 사용해 config plugin이 포함된 네이티브 모듈을 만드는 튜토리얼입니다.

[Config plugins](/config-plugins/introduction)을 사용하면 [Continuous Native Generation (CNG)](/workflow/continuous-native-generation) 프로젝트에서 `npx expo prebuild`로 생성된 네이티브 Android 및 iOS 프로젝트를 커스터마이즈할 수 있습니다. 이를 사용해 네이티브 config 파일에 속성을 추가하고, 네이티브 프로젝트에 asset을 복사하거나, [app extension target](/build-reference/app-extensions) 추가 같은 고급 구성을 적용할 수 있습니다.

앱 개발자 입장에서 config plugin은 기본 [app config](/workflow/configuration)로 노출되지 않은 커스터마이징을 적용하는 데 도움이 됩니다. 라이브러리 작성자 입장에서는 라이브러리를 사용하는 개발자를 위해 네이티브 프로젝트를 자동으로 구성할 수 있게 해줍니다.

이 튜토리얼은 새 config plugin을 처음부터 만들고, plugin이 **AndroidManifest.xml**과 **Info.plist**에 주입한 커스텀 값을 Expo 모듈에서 읽는 방법을 설명합니다.

## 모듈 초기화하기

먼저 `create-expo-module`로 새 Expo 모듈 프로젝트를 초기화하세요. 이 명령은 Android, iOS, TypeScript용 스캐폴딩을 설정하고, 앱 안에서 모듈을 테스트할 수 있는 example 프로젝트도 포함합니다. 시작하려면 다음 명령을 실행하세요:

```sh
npx create-expo-module expo-native-configuration
```

이 가이드에서는 모듈 프로젝트 이름으로 `expo-native-configuration`/`ExpoNativeConfiguration`을 사용합니다. 하지만 원하는 이름을 자유롭게 선택할 수 있습니다.

## 워크스페이스 설정하기

이 예제에서는 `create-expo-module`이 포함해 주는 view module이 필요하지 않습니다. 다음 명령으로 기본 모듈을 정리하세요:

```sh
cd expo-native-configuration
rm android/src/main/java/expo/modules/nativeconfiguration/ExpoNativeConfigurationView.kt
rm ios/ExpoNativeConfigurationView.swift
rm src/ExpoNativeConfigurationView.tsx src/ExpoNativeConfiguration.types.ts
rm src/ExpoNativeConfigurationView.web.tsx src/ExpoNativeConfigurationModule.web.ts
```

다음 파일을 찾아 제공된 최소 boilerplate로 교체하세요:

-   **android/src/main/java/expo/modules/nativeconfiguration/ExpoNativeConfigurationModule.kt**
-   **ios/ExpoNativeConfigurationModule.swift**
-   **src/ExpoNativeConfigurationModule.ts**
-   **src/index.ts**
-   **example/App.tsx**
-   **package.json**

```kotlin
package expo.modules.nativeconfiguration

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoNativeConfigurationModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoNativeConfiguration")

    Function("getApiKey") {
      return@Function "api-key"
    }
  }
}
```

```swift
import ExpoModulesCore

public class ExpoNativeConfigurationModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoNativeConfiguration")

    Function("getApiKey") { () -> String in
      "api-key"
    }
  }
}
```

```ts
import { NativeModule, requireNativeModule } from 'expo';

declare class ExpoNativeConfigurationModule extends NativeModule {
  getApiKey(): string;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoNativeConfigurationModule>('ExpoNativeConfiguration');
```

```ts
import ExpoNativeConfigurationModule from './ExpoNativeConfigurationModule';

export function getApiKey(): string {
  return ExpoNativeConfigurationModule.getApiKey();
}
```

```tsx
import * as ExpoNativeConfiguration from 'expo-native-configuration';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>API key: {ExpoNativeConfiguration.getApiKey()}</Text>
    </View>
  );
}
```

```json
{
  ... 
  "dependencies": {
    "expo-native-configuration": "file:.."
    ... 
  }
}
```

## example 프로젝트 실행하기

프로젝트 루트에서 TypeScript 컴파일러를 실행해 변경 사항을 감시하고 모듈의 JavaScript를 다시 빌드하세요:

```sh
npm run build
```

다른 터미널 창에서 example 앱을 컴파일하고 실행하세요:

```sh
cd example
rm -rf node_modules && npm install
npx expo run:android
npx expo run:ios
```

화면에 "API key: api-key"라는 텍스트가 보여야 합니다.

## 새 config plugin 만들기

[Plugins](/config-plugins/introduction#plugin-function)은 `ExpoConfig`를 받아 수정된 `ExpoConfig`를 반환하는 동기 함수입니다. 관례상 이 함수 이름은 `with`로 시작합니다. plugin 이름을 `withMyApiKey`로 짓거나, 이 관례만 따른다면 다른 이름을 사용해도 됩니다.

다음은 기본 config plugin 함수 예시입니다:

```js
const withMyApiKey = config => {
  return config;
};
```

`mods`도 사용할 수 있는데, 이는 네이티브 프로젝트의 소스 코드나 설정 파일(plist, xml) 같은 파일을 수정하는 비동기 함수입니다. `mods` 객체는 앱 config의 나머지 부분과 다릅니다. 처음 읽은 뒤 직렬화되지 않기 때문입니다. 덕분에 코드 생성 _도중에_ 작업을 수행할 수 있습니다.

config plugin을 작성할 때는 다음 사항을 따르세요:

-   Plugins는 동기여야 하며, 추가된 `mods`를 제외한 반환값은 직렬화 가능해야 합니다.
-   `plugins`는 `expo/config`의 `getConfig` 메서드가 구성을 읽을 때마다 호출됩니다. 반면 `mods`는 `npx expo prebuild`의 "syncing" 단계에서만 호출됩니다.

> 선택 사항이긴 하지만, plugin 개발을 단순화하려면 [`expo-module-scripts`](https://www.npmjs.com/package/expo-module-scripts)를 사용하세요. TypeScript와 Jest용 권장 기본 구성을 제공합니다. 자세한 내용은 [config plugins guide](https://github.com/expo/expo/tree/main/packages/expo-module-scripts#-config-plugin)를 참고하세요.

다음 최소 boilerplate로 plugin 작성을 시작하세요. TypeScript로 plugin을 작성하기 위해 **plugin** 디렉터리를 만들고, 프로젝트 루트에 plugin의 entry point가 될 **app.plugin.js** 파일을 추가하세요.

### plugin용 plugin/tsconfig.json 파일 만들기

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

### plugin용 plugin/src/index.ts 파일 만들기

```ts
import { ConfigPlugin } from 'expo/config-plugins';

const withMyApiKey: ConfigPlugin = config => {
  console.log('my custom plugin');
  return config;
};

export default withMyApiKey;
```

### 루트 디렉터리에 app.plugin.js 파일 만들기

```js
// This file configures the entry file for your plugin.
module.exports = require('./plugin/build');
```

프로젝트 루트에서 `npm run build plugin`을 실행해 TypeScript 컴파일러를 watch mode로 시작하세요. 다음으로 example 프로젝트가 plugin을 사용하도록 **example/app.json** 파일에 다음 줄을 추가하세요:

```json
{
  "expo": {
    ... 
    "plugins": ["../app.plugin.js"]
  }
}
```

**example** 디렉터리 안에서 `npx expo prebuild` 명령을 실행하면, 터미널에 console statement를 통해 "my custom plugin"이 출력됩니다.

```sh
cd example
npx expo prebuild --clean
```

커스텀 API 키를 **AndroidManifest.xml**과 **Info.plist**에 주입하려면, [`expo/config-plugins`](/config-plugins/mods)이 제공하는 helper `mods`를 사용하세요. 이를 사용하면 네이티브 파일을 쉽게 수정할 수 있습니다. 이 예제에서는 `withAndroidManifest`와 `withInfoPlist`를 사용합니다.

이름에서 알 수 있듯, `withAndroidManifest`는 **AndroidManifest.xml** 파일을 읽고 수정할 수 있게 해줍니다. 아래처럼 `AndroidConfig` helper를 사용해 main application에 metadata 항목을 추가하세요:

```ts
const withMyApiKey: ConfigPlugin<{ apiKey: string }> = (config, { apiKey }) => {
  config = withAndroidManifest(config, config => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      'MY_CUSTOM_API_KEY',
      apiKey
    );
    return config;
  });

  return config;
};
```

마찬가지로 `withInfoPlist`를 사용해 **Info.plist** 값을 수정할 수 있습니다. `modResults` 속성을 사용해 아래 코드처럼 커스텀 값을 추가할 수 있습니다:

```ts
const withMyApiKey: ConfigPlugin<{ apiKey: string }> = (config, { apiKey }) => {
  config = withInfoPlist(config, config => {
    config.modResults['MY_CUSTOM_API_KEY'] = apiKey;
    return config;
  });

  return config;
};
```

모든 내용을 하나의 함수로 합쳐 커스텀 plugin을 만들 수 있습니다:

```ts
import {
  withInfoPlist,
  withAndroidManifest,
  AndroidConfig,
  ConfigPlugin,
} from 'expo/config-plugins';

const withMyApiKey: ConfigPlugin<{ apiKey: string }> = (config, { apiKey }) => {
  config = withInfoPlist(config, config => {
    config.modResults['MY_CUSTOM_API_KEY'] = apiKey;
    return config;
  });

  config = withAndroidManifest(config, config => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      'MY_CUSTOM_API_KEY',
      apiKey
    );
    return config;
  });

  return config;
};

export default withMyApiKey;
```

plugin을 사용할 준비가 되었으면, example 앱이 API 키를 구성 옵션으로 plugin에 전달하도록 업데이트하세요. 아래처럼 **example/app.json**의 `plugins` 필드를 수정하세요:

```json
{
  "expo": {
    ... 
    "plugins": [["../app.plugin.js", { "apiKey": "custom_secret_api" }]]
  }
}
```

이 변경 후에는 **example** 디렉터리 안에서 `npx expo prebuild --clean`을 실행해 plugin이 올바르게 동작하는지 테스트하세요. 이 명령은 plugin을 실행하고 네이티브 파일을 업데이트해 `"MY_CUSTOM_API_KEY"`를 **AndroidManifest.xml**과 **Info.plist**에 주입합니다. **example/android/app/src/main/AndroidManifest.xml**과 **example/ios/exponativeconfigurationexample/Info.plist** 내용을 확인해 이를 검증할 수 있습니다.

## 모듈에서 네이티브 값 읽기

이제 플랫폼별 메서드를 사용해 **AndroidManifest.xml**과 **Info.plist**에 추가한 필드를 네이티브 모듈이 읽도록 만드세요.

Android에서는 `packageManager` 클래스를 사용해 **AndroidManifest.xml** 파일의 metadata 정보를 읽습니다. `"MY_CUSTOM_API_KEY"` 값을 읽으려면 **android/src/main/java/expo/modules/nativeconfiguration/ExpoNativeConfigurationModule.kt** 파일을 다음처럼 업데이트하세요:

```kotlin
package expo.modules.nativeconfiguration

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.content.pm.PackageManager

class ExpoNativeConfigurationModule() : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoNativeConfiguration")

    Function("getApiKey") {
      val applicationInfo = appContext?.reactContext?.packageManager?.getApplicationInfo(appContext?.reactContext?.packageName.toString(), PackageManager.GET_META_DATA)

      return@Function applicationInfo?.metaData?.getString("MY_CUSTOM_API_KEY")
    }
  }
}
```

iOS에서는 `Bundle.main.object(forInfoDictionaryKey: "")` 메서드를 사용해 **Info.plist** 속성 내용을 읽을 수 있습니다. 앞서 추가한 `"MY_CUSTOM_API_KEY"` 값에 접근하려면 **ios/ExpoNativeConfigurationModule.swift** 파일을 다음처럼 업데이트하세요:

```swift
import ExpoModulesCore

public class ExpoNativeConfigurationModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoNativeConfiguration")

    Function("getApiKey") {
     return Bundle.main.object(forInfoDictionaryKey: "MY_CUSTOM_API_KEY") as? String
    }
  }
}
```

## 모듈 실행하기

네이티브 모듈이 네이티브 파일에 추가된 필드를 읽도록 했으니, 이제 example 앱을 실행하고 `ExamplePlugin.getApiKey()` 함수를 통해 커스텀 API 키에 접근할 수 있습니다.

```sh
cd example
npx expo prebuild
npx expo run:android
npx expo run:ios
```

## 다음 단계

축하합니다. Android와 iOS용 Expo 모듈과 상호작용하는 config plugin을 만들었습니다.

더 도전해 보고 plugin을 더 유연하게 만들고 싶다면, 다음 과제를 직접 해볼 수 있습니다. 임의의 config 키와 값을 전달할 수 있도록 plugin을 수정하고, 모듈에서 임의의 키를 읽는 기능도 추가해 보세요.

[Expo Modules API Reference](/modules/module-api) — Kotlin과 Swift를 사용해 네이티브 모듈을 만드는 참조 문서입니다.

[Additional platform support](/modules/additional-platform-support) — macOS와 tvOS 플랫폼 지원을 추가하는 방법을 알아보세요.
