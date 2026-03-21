---
modificationDate: September 10, 2025
title: config plugin 만들고 사용하기
description: Expo 프로젝트에서 config plugin을 만들고 사용하는 방법을 알아보세요.
---

# config plugin 만들고 사용하기

Expo 프로젝트에서 config plugin을 만들고 사용하는 방법을 알아보세요.

이 가이드는 config plugin을 만드는 방법, config plugin에 매개변수를 전달하는 방법, 여러 config plugin을 함께 체이닝하는 방법을 다룹니다. 또한 Expo 라이브러리에서 config plugin을 사용하는 방법도 설명합니다.

아래 다이어그램을 사용해, 이 가이드에서는 config plugin 계층 구조의 처음 두 부분을 배우게 됩니다:

```
withMyPlugin ("myPlugin") [Config Plugin]
→ withAndroidPlugin, withIosPlugin [Plugin Function]
→ withAndroidManifest, withInfoPlist [Mod Plugin Function]
→ mods.android.manifest, mods.ios.infoplist [Mod]
```

> **참고:** 아래 섹션에서는 동적 [app config](/workflow/configuration) (**app.config.js/app.config.ts** 형태, **app.json** 아님)를 사용합니다. 단순한 config plugin을 사용하는 데 이것이 반드시 필요한 것은 아닙니다. 하지만 매개변수를 받는 함수 기반 config plugin을 만들거나 사용할 때는 동적 app config가 필요합니다.

## config plugin 만들기

다음 섹션에서는 Android용 **AndroidManifest.xml**과 iOS용 **Info.plist**에 임의의 속성 `HelloWorldMessage`를 추가하는 로컬 config plugin을 만들어 보겠습니다.

이 예시에서는 다음 파일을 만들고 수정합니다. 따라 하려면 프로젝트 루트에 **plugins** 디렉터리를 만들고, 그 안에 **withAndroidPlugin.ts**, **withIosPlugins.ts**, **withPlugin.ts** 파일을 만드세요.

`plugins`

 `withAndroidPlugin.ts``Android 전용 수정 로직 포함`

 `withIosPlugin.ts``iOS 전용 수정 로직 포함`

 `withPlugin.ts``Android와 iOS 플러그인을 결합하는 메인 plugin 파일`

`app.config.ts``플러그인을 사용하는 동적 app config 파일`

### Android plugin 만들기

**withAndroidPlugin.ts**에 다음 코드를 추가하세요:

```ts
import { ConfigPlugin, withAndroidManifest } from 'expo/config-plugins';

const withAndroidPlugin: ConfigPlugin = config => {
  // Define a custom message
  const message = 'Hello world, from Expo plugin!';

  return withAndroidManifest(config, config => {
    const mainApplication = config?.modResults?.manifest?.application?.[0];

    if (mainApplication) {
      // Ensure meta-data array exists
      if (!mainApplication['meta-data']) {
        mainApplication['meta-data'] = [];
      }

      // Add the custom message as a meta-data entry
      mainApplication['meta-data'].push({
        $: {
          'android:name': 'HelloWorldMessage',
          'android:value': message,
        },
      });
    }

    return config;
  });
};

export default withAndroidPlugin;
```

위 예시 코드는 `expo/config-plugins` 라이브러리에서 `ConfigPlugin`과 `withAndroidManifest`를 가져와 **android/app/src/main/AndroidManifest.xml** 파일에 `HelloWorldMessage`라는 meta-data 항목을 추가합니다. [`withAndroidManifest`](/config-plugins/mods#mod-plugins) mod plugin은 config와 데이터 객체를 받아 값을 수정한 뒤 객체를 반환하는 비동기 함수입니다.

### iOS plugin 만들기

**withIosPlugin.ts**에 다음 코드를 추가하세요:

```ts
import { ConfigPlugin, withInfoPlist } from 'expo/config-plugins';

const withIosPlugin: ConfigPlugin = config => {
  // Define the custom message
  const message = 'Hello world, from Expo plugin!';

  return withInfoPlist(config, config => {
    // Add the custom message to the Info.plist file
    config.modResults.HelloWorldMessage = message;
    return config;
  });
};

export default withIosPlugin;
```

위 예시 코드는 `expo/config-plugins` 라이브러리에서 `ConfigPlugin`과 `withInfoPlist`를 가져와 **ios/<your-project-name>/Info.plist** 파일에 사용자 정의 키 `HelloWorldMessage`와 사용자 정의 메시지를 추가합니다. [`withInfoPlist`](/config-plugins/mods#mod-plugins) mod plugin은 config와 데이터 객체를 받아 값을 수정한 뒤 객체를 반환하는 비동기 함수입니다.

### 결합된 plugin 만들기

이제 두 플랫폼 전용 plugin을 모두 적용하는 결합 plugin을 만들 수 있습니다. 이 접근 방식은 플랫폼별 코드를 분리해서 유지하면서도 하나의 진입점을 제공할 수 있게 해 줍니다.

**withPlugin.ts**에 다음 코드를 추가하세요:

```ts
import { ConfigPlugin } from 'expo/config-plugins';
import withAndroidPlugin from './withAndroidPlugin';
import withIosPlugin from './withIosPlugin';

const withPlugin: ConfigPlugin = config => {
  // Apply Android modifications first
  config = withAndroidPlugin(config);
  // Then apply iOS modifications and return
  return withIosPlugin(config);
};

export default withPlugin;
```

### TypeScript 지원 추가하고 동적 app config로 변환하기

구성 객체에 대한 IntelliSense를 제공하므로 config plugin은 TypeScript로 작성하는 것을 권장합니다. 하지만 app config는 최종적으로 Node.js가 평가하는데, Node.js는 기본적으로 TypeScript 코드를 인식하지 못합니다. 따라서 **plugins** 디렉터리의 TypeScript 파일을 읽기 위한 파서를 **app.config.ts** 파일에 추가해야 합니다.

다음 명령을 실행해 `tsx` 라이브러리를 설치하세요:

```sh
npm install --save-dev tsx
```

그다음 정적 app config(**app.json**)를 [동적 app config(**app.config.ts**)](/workflow/configuration#dynamic-configuration) 파일로 바꾸세요. **app.json** 파일 이름을 **app.config.ts**로 바꾸고, 파일 내용을 아래처럼 수정하면 됩니다. **app.config.ts** 파일 상단에 다음 import 문을 추가해야 합니다:

```ts
import 'tsx/cjs';

module.exports = () => {
  ... rest of your app config 
};
```

### 동적 app config에서 config plugin 호출하기

이제 동적 app config에서 config plugin을 호출할 수 있습니다. 이를 위해 app config의 plugins 배열에 **withPlugin.ts** 파일 경로를 추가해야 합니다:

```ts
import "tsx/cjs";
import { ExpoConfig } from "expo/config";

module.exports = ({ config }: { config: ExpoConfig }) => {
  ... rest of your app config 
  plugins: [
      ["./plugins/withPlugin.ts"],
    ],
};
```

네이티브 프로젝트에 사용자 정의 구성이 적용된 모습을 보려면 다음 명령을 실행하세요:

```sh
npx expo prebuild --clean --no-install
```

사용자 정의 config plugin이 적용되었는지 확인하려면 **android/app/src/main/AndroidManifest.xml**과 **ios/<your-project-name>/Info.plist** 파일을 열어 보세요:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
<!-- ... rest of the configuration-->
	<application ...>
		<meta-data android:name="HelloWorldMessage" android:value="Hello world, from Expo plugin!"/>
		<!-- ... -->
	</application>
</manifest>
```

```xml
<plist version="1.0">
  <dict>
  <!-- ... -->
    <key>HelloWorldMessage</key>
    <string>Hello world, from Expo plugin!</string>
	<!-- ... -->
	</dict>
</plist>
```

## config plugin에 매개변수 전달하기

config plugin은 app config에서 전달한 매개변수를 받을 수 있습니다. 그러려면 config plugin 함수 안에서 매개변수를 읽고, app config에서 config plugin 함수와 함께 해당 매개변수를 담은 객체를 전달해야 합니다.

앞선 예시를 바탕으로, plugin에 사용자 정의 메시지를 전달해 보겠습니다. **withAndroidPlugin.ts**에 `options` 객체를 추가하고, `message` 변수가 `options.message` 속성을 사용하도록 업데이트하세요:

```ts
...
type AndroidProps = {
  message?: string;
};

const withAndroidPlugin: ConfigPlugin<AndroidProps> = (
  config,
  options = {}
) => {
  const message = options.message || 'Hello world, from Expo plugin!';
  return withAndroidManifest(config, config => {
   ... rest of the example remains unchanged 
  });
};

export default withAndroidPlugin;
```

비슷하게, **withIosPlugin.ts**에도 `options` 객체를 추가하고 `message` 변수가 `options.message` 속성을 사용하도록 업데이트하세요:

```ts
...
type IosProps = {
  message?: string;
};

const withIosPlugin: ConfigPlugin<IosProps> = (config, options = {}) => {
   const message = options.message || 'Hello world, from Expo plugin!';
  ... rest of the example remains unchanged
};

export default withIosPlugin;
```

**withPlugin.ts** 파일도 업데이트해 `options` 객체를 두 plugin에 모두 전달하세요:

```ts
...
const withPlugin: ConfigPlugin<{ message?: string }> = (config, options = {}) => {
  config = withAndroidPlugin(config, options);
  return withIosPlugin(config, options);
};
```

plugin에 값을 동적으로 전달하려면 app config의 plugin에 `message` 속성이 있는 객체를 전달하면 됩니다:

```ts
{
  ...
  plugins: [
    [
      "./plugins/withPlugin.ts",
      { message: "Custom message from app.config.ts" },
    ],
  ],
}
```

## config plugin 체이닝하기

config plugin은 여러 수정 작업을 적용하도록 체이닝할 수 있습니다. 체인 안의 각 plugin은 나타나는 순서대로 실행되며, 하나의 plugin 출력이 다음 plugin의 입력이 됩니다. 이러한 순차 실행 덕분에 plugin 간의 의존성이 올바르게 지켜지고, 네이티브 코드 수정 순서를 정밀하게 제어할 수 있습니다.

config plugin을 체이닝하려면 app config의 `plugins` 배열 속성에 plugin 배열을 전달하면 됩니다. 이 방식은 JSON app config 파일 형식(**app.json**)에서도 지원됩니다.

```ts
module.exports = ({ config }: { config: ExpoConfig }) => {
  name: 'my app',
  plugins: [
    [withFoo, 'input 1'],
    [withBar, 'input 2'],
    [withDelta, 'input 3'],
  ],
};
```

`plugins` 배열은 내부적으로 `withPlugins` 메서드를 사용해 plugin을 체이닝합니다. plugins 배열이 길어지거나 구성이 복잡해지고 있다면 `withPlugins` 메서드를 직접 사용해 구성을 더 읽기 쉽게 만들 수 있습니다. `withPlugins`는 plugin을 순서대로 체이닝하고 실행합니다.

```ts
import { withPlugins } from 'expo/config-plugins';

// Create a base config object
const baseConfig = {
  name: 'my app',
  ... rest of the config 
};

// ❌ Hard to read
withDelta(withFoo(withBar(config, 'input 1'), 'input 2'), 'input 3');

// ✅ Easy to read
withPlugins(config, [
  [withFoo, 'input 1'],
  [withBar, 'input 2'],
  // When no input is required, you can just pass the method
  withDelta,
]);

// Export the base config with plugins applied
module.exports = ({ config }: { config: ExpoConfig }) => {
  return withPlugins(baseConfig, plugins);
};
```

## config plugin 사용하기

Expo config plugin은 보통 Node.js module 안에 포함되어 있습니다. 프로젝트의 다른 라이브러리처럼 설치할 수 있습니다.

예를 들어 `expo-camera`에는 **AndroidManifest.xml**과 **Info.plist**에 카메라 권한을 추가하는 plugin이 있습니다. 프로젝트에 설치하려면 다음 명령을 실행하세요:

```sh
npx expo install expo-camera
```

[app config](/versions/latest/config/app)에서 `expo-camera`를 plugins 목록에 추가할 수 있습니다:

```json
{
  "expo": {
    "plugins": ["expo-camera"]
  }
}
```

일부 config plugin은 옵션을 전달해 구성을 사용자 지정할 수 있도록 유연성을 제공합니다. 이를 위해 Expo 라이브러리 이름을 첫 번째 인자로, 옵션이 담긴 객체를 두 번째 인자로 하는 배열을 전달할 수 있습니다. 예를 들어 `expo-camera` plugin은 카메라 권한 메시지를 사용자 지정할 수 있습니다:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera."
        }
      ]
    ]
  }
}
```

> **팁:** config plugin이 있는 Expo 라이브러리라면, 해당 라이브러리의 API 레퍼런스에서 관련 정보를 더 찾을 수 있습니다. 예를 들어 [`expo-camera` 라이브러리에는 config plugin 섹션](/versions/latest/sdk/camera#configuration-in-appjsonappconfigjs)이 있습니다.

`npx expo prebuild`를 실행하면 [`mods`](/config-plugins/introduction#mods)가 컴파일되고 네이티브 파일이 변경됩니다.

변경 사항은 Xcode처럼 네이티브 프로젝트를 다시 빌드할 때까지 적용되지 않습니다. **네이티브 디렉터리가 없는 프로젝트(CNG 프로젝트)에서 config plugin을 사용하고 있다면, EAS Build의 prebuild 단계 또는 로컬에서 `npx expo prebuild|android|ios`를 실행할 때 적용됩니다.**
