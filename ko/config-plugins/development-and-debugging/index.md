---
modificationDate: September 11, 2025
title: 플러그인 개발 및 디버깅하기
description: Expo config plugin을 위한 개발 모범 사례와 디버깅 기법을 알아보세요.
---

# 플러그인 개발 및 디버깅하기

Expo config plugin을 위한 개발 모범 사례와 디버깅 기법을 알아보세요.

플러그인을 개발하는 것은 Expo 생태계를 확장하는 훌륭한 방법입니다. 하지만 플러그인을 디버깅해야 하는 경우도 있습니다. 이 페이지에서는 플러그인을 개발하고 디버깅할 때의 몇 가지 모범 사례를 제공합니다.

## 플러그인 개발

> 플러그인 결과를 실시간으로 디버깅하려면 [modifier previews](https://github.com/expo/vscode-expo#expo-preview-modifier)를 사용하세요.

플러그인 개발을 더 쉽게 하기 위해 [`expo-module-scripts`](https://www.npmjs.com/package/expo-module-scripts)에 plugin 지원을 추가했습니다. TypeScript와 Jest를 사용해 plugin을 빌드하는 방법은 [config plugins guide](https://github.com/expo/expo/tree/main/packages/expo-module-scripts#-config-plugin)를 참고하세요.

### 의존성 설치하기

config plugin을 제공하는 라이브러리에서는 다음 의존성을 사용하세요:

```json
{
  "dependencies": {},
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

-   특정 버전에 맞춰 빌드하려면 `expo`의 정확한 버전을 조정할 수 있습니다.
-   **AndroidManifest.xml**이나 **Info.plist**만 수정하는 것처럼 핵심적이고 안정적인 API에만 의존하는 단순한 config plugin이라면, 위 예시처럼 느슨한 의존성을 사용할 수 있습니다.
-   [`expo-module-scripts`](https://github.com/expo/expo/blob/main/packages/expo-module-scripts/README.md)를 개발 의존성으로 추가하고 싶을 수도 있지만, 필수는 아닙니다.

### config plugins package 가져오기

`expo/config-plugins`와 `expo/config` package는 `expo` package에서 다시 export됩니다.

```js
const { ... } = require('expo/config-plugins');
const { ... } = require('expo/config');
```

`expo` package를 통해 import하면, `expo` package가 의존하는 버전의 `expo/config-plugins`와 `expo/config`를 사용하게 됩니다.

이 방식으로 `expo` re-export를 통하지 않고 package를 import하면, 모듈을 소비하는 개발자가 사용하는 package manager의 module hoisting 구현 세부 사항에 따라 호환되지 않는 버전을 실수로 import할 수 있고, 혹은 아예 import하지 못할 수도 있습니다(Yarn Berry나 pnpm 같은 package manager의 "plug and play" 기능을 사용하는 경우).

config type은 `expo/config`에서 직접 export되므로 `expo/config-types`를 설치하거나 거기서 import할 필요가 없습니다:

```ts
import { ExpoConfig, ConfigContext } from 'expo/config';
```

### mods 모범 사례

-   regex를 피하세요: [static modification](/config-plugins/development-and-debugging#static-modification)이 핵심입니다. Android gradle 파일의 값을 수정하고 싶다면 `gradle.properties`를 고려하세요. Podfile의 코드를 수정하고 싶다면 JSON에 값을 기록하고 Podfile에서 그 static 값을 읽도록 하는 방식을 고려하세요.
-   mod 안에서 네트워크 요청이나 Node module 설치처럼 오래 걸리는 작업을 수행하지 마세요.
-   mod 안에 interactive terminal prompt를 추가하지 마세요.
-   새 파일 생성, 이동, 삭제는 dangerous mod에서만 수행하세요. 그렇지 않으면 [introspection](/config-plugins/development-and-debugging#introspection)이 깨집니다.
-   `withXcodeProject` 같은 내장 config plugin을 활용해 파일을 읽고 파싱하는 횟수를 줄이세요.
-   prebuild가 내부적으로 사용하는 XML parsing 라이브러리를 그대로 사용하세요. 그래야 코드가 불필요하게 재배열되는 변경을 방지할 수 있습니다.

## 플러그인 구조와 스캐폴딩

### 버전 관리

기본적으로 `npx expo prebuild`는 프로젝트가 사용 중인 Expo SDK 버전에 연결된 [source template](https://github.com/expo/expo/tree/main/templates/expo-template-bare-minimum)에 변환을 적용합니다. SDK 버전은 **app.json**에 정의되거나, 프로젝트에 설치된 `expo` 버전으로부터 추론됩니다.

예를 들어 Expo SDK가 React Native의 새 버전으로 업그레이드되면, React Native 변경 사항이나 Android 또는 iOS의 새 릴리스를 반영하기 위해 template가 크게 바뀔 수 있습니다.

플러그인이 대부분 [static modification](/config-plugins/development-and-debugging#static-modification)을 사용한다면 보통 SDK 버전 전반에서 잘 동작합니다. 하지만 regex를 사용해 앱 코드를 변환한다면, 플러그인이 어느 Expo SDK 버전을 대상으로 하는지 반드시 문서화해야 합니다. SDK 릴리스 주기 중에는 [beta period](https://github.com/expo/expo/blob/main/guides/releasing/Release%20Workflow.md#stage-4---beta-release)가 있어서 새 버전이 정식 릴리스되기 전에 플러그인이 동작하는지 테스트할 수 있습니다.

### 플러그인 속성

속성은 prebuild 중 플러그인이 동작하는 방식을 사용자 지정하는 데 사용됩니다. 이 값은 항상 정적인 값이어야 합니다(함수나 promise는 사용할 수 없음). 다음 타입을 보세요:

```ts
type StaticValue = boolean | number | string | null | StaticArray | StaticObject;

type StaticArray = StaticValue[];

interface StaticObject {
  [key: string]: StaticValue | undefined;
}
```

정적 속성이 필요한 이유는 앱 config가 앱 manifest로 사용되기 위해 JSON으로 serialize 가능해야 하기 때문입니다.

가능하다면 props 없이도 플러그인이 동작하도록 만들어 보세요. 그래야 [`expo install`](/config-plugins/development-and-debugging#expo-install)이나 [VS Code Expo Tools](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools) 같은 resolution 도구가 더 잘 동작합니다. 속성을 하나 추가할 때마다 복잡성이 늘어나고, 나중에 변경하기 어려워지며, 테스트해야 할 기능도 늘어난다는 점을 기억하세요. 가능하다면 필수 구성을 강제하기보다 좋은 기본값을 제공하는 편이 좋습니다.

## 개발 환경

### 도구

[Expo Tools VS Code extension](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools)을 설치하는 것을 강력히 권장합니다. 이 확장은 plugin 자동 검증을 수행하고, Config Plugin 개발에 도움이 되는 오류 정보와 여러 품질 개선 기능을 제공합니다.

### playground 환경 설정하기

JS만으로도 plugin을 쉽게 개발할 수 있지만, Jest 테스트를 설정하고 TypeScript를 사용하려면 monorepo를 구성하는 것이 좋습니다.

monorepo를 사용하면 node module을 작업하면서, npm에 게시된 것처럼 app config에서 import할 수 있습니다. Expo config plugin은 monorepo를 기본 지원하므로 프로젝트만 설정하면 됩니다.

monorepo의 `packages/` 디렉터리에 module을 만들고, 그 안에서 [config plugin bootstrap](https://github.com/expo/expo/tree/main/packages/expo-module-scripts#-config-plugin)을 하세요.

### 플러그인을 수동으로 실행하기

monorepo 설정이 부담스럽다면 플러그인을 수동으로 실행해 볼 수 있습니다:

-   config plugin이 들어 있는 package에서 `npm pack`을 실행합니다.
-   테스트 프로젝트에서 `npm install path/to/react-native-my-package-1.0.0.tgz`를 실행합니다. 그러면 package가 **package.json**의 `dependencies` 객체에 추가됩니다.
-   **app.json**의 `plugins` 배열에 package를 추가합니다: `{ "plugins": ["react-native-my-package"] }`
    -   [VS Code Expo Tools](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools)가 설치되어 있으면 plugin 자동 완성이 동작해야 합니다.
-   package를 업데이트해야 한다면 package의 **package.json**에서 `version`을 바꾸고 같은 과정을 반복합니다.

## 플러그인으로 네이티브 파일 수정하기

### AndroidManifest.xml 수정하기

package는 config plugin을 사용하기 전에 먼저 내장된 **AndroidManifest.xml** [merging system](https://developer.android.com/studio/build/manage-manifests)을 사용하려고 시도해야 합니다. 이 방식은 permission처럼 정적이고 선택 사항이 아닌 기능에 사용할 수 있습니다. 이렇게 하면 기능이 prebuild 시점이 아니라 build 시점에 병합되므로, 사용자가 prebuild를 잊어서 구성이 누락될 가능성을 줄일 수 있습니다. 단점은 사용자가 [introspection](/config-plugins/development-and-debugging#introspection)으로 변경 사항을 미리 보고 잠재적 문제를 디버깅할 수 없다는 점입니다.

다음은 필수 permission을 주입하는 package의 **AndroidManifest.xml** 예시입니다:

```xml
<manifest package="expo.modules.filesystem" xmlns:android="http://schemas.android.com/apk/res/android">
  <uses-permission android:name="android.permission.INTERNET"/>
</manifest>
```

로컬 프로젝트용 plugin을 만들고 있거나 package가 더 많은 제어가 필요하다면 plugin을 구현해야 합니다.

복잡한 객체를 다룰 때는 내장 타입과 helper를 사용하면 작업이 쉬워집니다. 다음은 기본 `<application android:name=".MainApplication" />`에 `<meta-data android:name="..." android:value="..."/>`를 추가하는 예시입니다.

```ts
import { AndroidConfig, ConfigPlugin, withAndroidManifest } from 'expo/config-plugins';
import { ExpoConfig } from 'expo/config';

// Using helpers keeps error messages unified and helps cut down on XML format changes.
const { addMetaDataItemToMainApplication, getMainApplicationOrThrow } = AndroidConfig.Manifest;

export const withMyCustomConfig: ConfigPlugin = config => {
  return withAndroidManifest(config, async config => {
    // Modifiers can be async, but try to keep them fast.
    config.modResults = await setCustomConfigAsync(config, config.modResults);
    return config;
  });
};

// Splitting this function out of the mod makes it easier to test.
async function setCustomConfigAsync(
  config: Pick<ExpoConfig, 'android'>,
  androidManifest: AndroidConfig.Manifest.AndroidManifest
): Promise<AndroidConfig.Manifest.AndroidManifest> {
  const appId = 'my-app-id';
  // Get the <application /> tag and assert if it doesn't exist.
  const mainApplication = getMainApplicationOrThrow(androidManifest);

  addMetaDataItemToMainApplication(
    mainApplication,
    // value for `android:name`
    'my-app-id-key',
    // value for `android:value`
    appId
  );

  return androidManifest;
}
```

### Info.plist 수정하기

`withInfoPlist`를 사용하는 것은 **app.json**의 `expo.ios.infoPlist` 객체를 정적으로 수정하는 것보다 조금 더 안전합니다. `withInfoPlist`는 Info.plist의 내용을 읽어 `expo.ios.infoPlist`와 병합하므로, 변경 사항이 덮어써지지 않도록 시도할 수 있기 때문입니다.

다음은 **Info.plist**에 `GADApplicationIdentifier`를 추가하는 예시입니다:

```ts
import { ConfigPlugin, withInfoPlist } from 'expo/config-plugins';

// Pass `<string>` to specify that this plugin requires a string property.
export const withCustomConfig: ConfigPlugin<string> = (config, id) => {
  return withInfoPlist(config, config => {
    config.modResults.GADApplicationIdentifier = id;
    return config;
  });
};
```

### iOS Podfile 수정하기

iOS **Podfile**은 iOS의 의존성 관리자인 CocoaPods의 설정 파일입니다. iOS에서의 **package.json**과 비슷합니다. **Podfile**은 Ruby 파일이기 때문에 Expo config plugin으로는 **안전하게 수정할 수 없으며**, [Expo Autolinking](/modules/autolinking) hook 같은 다른 접근 방식을 선택해야 합니다.

Podfile과 안전하게 상호작용할 수 있는 메커니즘을 하나 제공하긴 하지만, 매우 제한적입니다. 버전 고정된 [template Podfile](https://github.com/expo/expo/tree/main/templates/expo-template-bare-minimum/ios/Podfile)은 정적 JSON 파일인 **Podfile.properties.json**을 읽도록 하드코딩되어 있습니다. 우리는 이 파일을 안전하게 읽고 쓸 수 있도록 mod (`ios.podfileProperties`, `withPodfileProperties`)를 노출합니다. 이것은 [expo-build-properties](/versions/latest/sdk/build-properties)와 JavaScript engine 구성에 사용됩니다.

### `pluginHistory`에 플러그인 추가하기

`_internal.pluginHistory`는 legacy UNVERSIONED plugin에서 versioned plugin으로 마이그레이션할 때 중복 plugin 실행을 막기 위해 만들어졌습니다.

```ts
import { ConfigPlugin, createRunOncePlugin } from 'expo/config-plugins';

// Keeping the name, and version in sync with it's package.
const pkg = require('my-cool-plugin/package.json');

const withMyCoolPlugin: ConfigPlugin = config => config;

// A helper method that wraps `withRunOnce` and appends items to `pluginHistory`.
export default createRunOncePlugin(
  // The plugin to guard.
  withMyCoolPlugin,
  // An identifier used to track if the plugin has already been run.
  pkg.name,
  // Optional version property, if omitted, defaults to UNVERSIONED.
  pkg.version
);
```

### Android 앱 시작 구성하기

프로젝트에 JS engine이 시작되기 전에 설정이 적용되어야 하는 경우가 있을 수 있습니다. 예를 들어 Android의 `expo-splash-screen`에서는 **MainActivity.java**의 `onCreate` 메서드에 resize mode를 지정해야 합니다. 이런 변경을 dangerous mod로 `MainActivity`에 regex로 위험하게 삽입하려고 하기보다는, 모든 지원 Android 언어(Java, Kotlin), Expo 버전, config plugin 조합에서 기능이 안전하게 동작하도록 lifecycle hook과 static setting 시스템을 사용합니다.

이 시스템은 세 가지 구성 요소로 이루어져 있습니다:

-   `ReactActivityLifecycleListeners`: 프로젝트 `ReactActivity`의 `onCreate` 메서드가 호출될 때 네이티브 callback을 얻기 위해 `expo-modules-core`가 노출하는 interface입니다.
-   `withStringsXml`: Android **strings.xml** 파일에 속성을 기록하는 `expo/config-plugins`의 mod입니다. 라이브러리는 strings.xml 값을 안전하게 읽어 초기 설정을 수행할 수 있습니다. string XML 값은 일관성을 위해 정해진 형식을 따릅니다.
-   `SingletonModule`(선택 사항): 네이티브 module과 `ReactActivityLifecycleListeners` 사이에 공유 interface를 만들기 위해 `expo-modules-core`가 노출하는 interface입니다.

다음 예시를 봅시다. Android `Activity`의 `onCreate` 메서드가 호출된 직후에 사용자 지정 `"value"` 문자열을 속성에 설정하고 싶다고 가정합시다. 이를 위해 `expo-custom`이라는 node module을 만들고 `expo-modules-core`와 Expo config plugin을 구현하면 안전하게 처리할 수 있습니다:

먼저 Android 네이티브 module에서 `ReactActivity` listener를 등록합니다. 이 listener는 사용자가 프로젝트에 `expo-modules-core` 지원을 설정해 두었을 때만 호출됩니다(Expo CLI, Create React Native App, Ignite CLI, Expo prebuild로 생성한 프로젝트에서는 기본 지원).

```kotlin
package expo.modules.custom

import android.content.Context
import expo.modules.core.BasePackage
import expo.modules.core.interfaces.ReactActivityLifecycleListener

class CustomPackage : BasePackage() {
  override fun createReactActivityLifecycleListeners(activityContext: Context): List<ReactActivityLifecycleListener> {
    return listOf(CustomReactActivityLifecycleListener(activityContext))
  }

  // ...
}
```

다음으로 `ReactActivity` listener를 구현합니다. 이 listener는 `Context`를 전달받고 프로젝트의 **strings.xml** 파일을 읽을 수 있습니다.

```kotlin
package expo.modules.custom

import android.app.Activity
import android.content.Context
import android.os.Bundle
import android.util.Log
import expo.modules.core.interfaces.ReactActivityLifecycleListener

class CustomReactActivityLifecycleListener(activityContext: Context) : ReactActivityLifecycleListener {
  override fun onCreate(activity: Activity, savedInstanceState: Bundle?) {
    // Execute static tasks before the JS engine starts.
    // These values are defined via config plugins.

    var value = getValue(activity)
    if (value != "") {
      // Do something to the Activity that requires the static value...
    }
  }

  // Naming is node module name (`expo-custom`) plus value name (`value`) using underscores as a delimiter
  // i.e. `expo_custom_value`
  // `@expo/vector-icons` + `iconName` -> `expo__vector_icons_icon_name`
  private fun getValue(context: Context): String = context.getString(R.string.expo_custom_value).toLowerCase()
}
```

사용자가 로컬에서 동일한 `name` 속성을 가진 **strings.xml** 파일을 사용해 덮어쓸 수 있도록 기본 **string.xml** 값을 정의해야 합니다.

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="expo_custom_value" translatable="false"></string>
</resources>
```

이 시점에서 bare 사용자는 로컬 **strings.xml** 파일에 문자열을 만들어 이 값을 설정할 수 있습니다(`expo-modules-core` 지원도 설정되어 있다고 가정):

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="expo_custom_value" translatable="false">I Love Expo</string>
</resources>
```

managed 사용자를 위해서는 Expo config plugin으로 이 기능을 (안전하게!) 노출할 수 있습니다:

```js
const { AndroidConfig, withStringsXml } = require('expo/config-plugins');

function withCustom(config, value) {
  return withStringsXml(config, config => {
    config.modResults = setStrings(config.modResults, value);
    return config;
  });
}

function setStrings(strings, value) {
  // Helper to add string.xml JSON items or overwrite existing items with the same name.
  return AndroidConfig.Strings.setStringItem(
    [
      // XML represented as JSON
      // <string name="expo_custom_value" translatable="false">value</string>
      { $: { name: 'expo_custom_value', translatable: 'false' }, _: value },
    ],
    strings
  );
}
```

이제 managed Expo 사용자는 다음과 같이 이 API와 상호작용할 수 있습니다:

```json
{
  "expo": {
    "plugins": [["expo-custom", "I Love Expo"]]
  }
}
```

사용자가 `npx expo prebuild -p` (`eas build -p android`, 또는 `npx expo run:ios`)를 다시 실행하면, 관리형 프로젝트에 변경 사항이 안전하게 적용된 것을 확인할 수 있습니다!

예시에서 볼 수 있듯이 우리는 애플리케이션 코드(`expo-modules-core`)가 애플리케이션 코드(네이티브 프로젝트)와 상호작용하도록 크게 의존합니다. 이렇게 해야 config plugin이 오랫동안 안전하고 신뢰할 수 있게 유지됩니다.

## Config plugin 디버깅하기

`EXPO_DEBUG=1 expo prebuild`를 실행하면 config plugin을 디버깅할 수 있습니다. `EXPO_DEBUG`를 켜면 plugin stack 로그가 출력되며, 어떤 mod가 어떤 순서로 실행되었는지 확인하는 데 유용합니다. 모든 static plugin resolution 오류를 보려면 `EXPO_CONFIG_PLUGIN_VERBOSE_ERRORS`를 활성화하세요. 이 옵션은 plugin 작성자에게만 필요합니다. 기본적으로 일부 자동 plugin 오류는 숨겨지는데, 보통 버전 문제와 관련되어 있어 도움이 되지 않는 경우가 많기 때문입니다(예: legacy package에 아직 config plugin이 없는 경우).

`npx expo prebuild --clean`을 실행하면 컴파일 전에 생성된 네이티브 디렉터리를 제거합니다.

또한 `npx expo config --type prebuild`를 실행하면 mods가 평가되지 않은 상태(코드 생성 없음)에서 plugin 결과를 출력할 수 있습니다.

Expo CLI 명령은 `EXPO_PROFILE=1`로 프로파일링할 수 있습니다.

## Introspection

Introspection은 프로젝트에서 코드를 생성하지 않고 modifier의 평가 결과를 읽는 고급 기법입니다. [static modification](/config-plugins/development-and-debugging#static-modification)의 결과를 prebuild 실행 없이 빠르게 디버깅하는 데 사용할 수 있습니다. `vscode-expo`의 [preview feature](https://github.com/expo/vscode-expo#expo-preview-modifier)를 사용하면 live하게 introspection과 상호작용할 수 있습니다.

프로젝트에서 `expo config --type introspect`를 실행해 introspection을 시도해 볼 수 있습니다.

Introspection은 일부 modifier만 지원합니다:

-   `android.manifest`
-   `android.gradleProperties`
-   `android.strings`
-   `android.colors`
-   `android.colorsNight`
-   `android.styles`
-   `ios.infoPlist`
-   `ios.entitlements`
-   `ios.expoPlist`
-   `ios.podfileProperties`

> Introspection은 안전한 modifier(JSON, XML, plist, properties 같은 정적 파일)에서만 동작합니다. 단, `ios.xcodeproj`는 파일 시스템 변경이 자주 필요해 idempotent하지 않기 때문에 예외입니다.

Introspection은 기본 base mod와 비슷하게 동작하는 커스텀 base mod를 만들되, 마지막에 `modResults`를 디스크에 쓰지 않는 방식으로 동작합니다. 저장하는 대신 결과를 app config의 `_internal.modResults` 아래에 mod 이름과 함께 저장합니다. 예를 들어 `ios.infoPlist` mod는 `_internal.modResults.ios.infoPlist: {}`에 저장됩니다.

실제 사례로는 `eas-cli`가 managed 앱에서 최종 iOS entitlement가 무엇인지 판단해 빌드 전에 Apple Developer Portal과 동기화하는 데 introspection을 사용합니다. 또한 유용한 디버깅 및 개발 도구로도 활용할 수 있습니다.

## Legacy plugin

`eas build`가 기존 `expo build` 서비스와 동일하게 동작하도록, 프로젝트에 설치되었을 때 자동으로 적용되는 "legacy plugin" 지원을 추가했습니다.

예를 들어 프로젝트에 `expo-camera`가 설치되어 있지만 **app.json**에 `plugins: ['expo-camera']`가 없다고 가정해 봅시다. Expo CLI는 필요한 camera와 microphone permission이 프로젝트에 추가되도록 `expo-camera`를 plugin에 자동으로 추가합니다. 사용자는 여전히 `plugins` 배열에 `expo-camera`를 수동으로 추가해 plugin을 사용자 지정할 수 있고, 수동으로 정의한 plugin이 자동 plugin보다 우선합니다.

어떤 plugin이 추가되었는지는 `expo config --type prebuild`를 실행하고 `_internal.pluginHistory` 속성을 보면 디버깅할 수 있습니다.

그러면 `expo/config-plugins`의 `withRunOnce` plugin을 사용해 추가된 모든 plugin을 담은 객체가 표시됩니다.

`expo-location`은 `version: '11.0.0'`을 사용하고, `react-native-maps`는 `version: 'UNVERSIONED'`를 사용하는 점에 주목하세요. 이는 다음을 의미합니다:

-   `expo-location`과 `react-native-maps`가 모두 프로젝트에 설치되어 있습니다.
-   `expo-location`은 프로젝트의 `node_modules/expo-location/app.plugin.js`에 있는 plugin을 사용합니다.
-   프로젝트에 설치된 `react-native-maps` 버전에는 plugin이 없기 때문에, legacy 지원을 위해 `expo-cli`에 포함된 unversioned plugin으로 fallback합니다.

```json
{
  _internal: {
    pluginHistory: {
      'expo-location': {
        name: 'expo-location',
        version: '11.0.0',
      },
      'react-native-maps': {
        name: 'react-native-maps',
        version: 'UNVERSIONED',
      },
    },
  },
};
```

가장 _안정적인_ 경험을 위해서는 프로젝트에 `UNVERSIONED` plugin이 없도록 하는 것이 좋습니다. `UNVERSIONED` plugin은 프로젝트의 네이티브 코드를 지원하지 않을 수 있기 때문입니다. 예를 들어 프로젝트에 `UNVERSIONED` Facebook plugin이 있고 Facebook 네이티브 코드나 plugin에 breaking change가 생기면, 프로젝트의 prebuild 방식이 깨져 빌드 오류가 발생할 수 있습니다.

## Static modification

plugin은 regex를 사용해 애플리케이션 코드를 변환할 수 있지만, template가 시간이 지나면서 바뀌면 이런 수정은 위험해집니다. regex 동작을 예측하기 어려워지고(사용자가 파일을 수동으로 수정하거나 커스텀 template를 사용하는 경우도 마찬가지), 충돌 위험이 커집니다. 아래는 직접 수정하지 말아야 할 파일과 그 대안의 예시입니다.

### Android Gradle 파일

Gradle 파일은 Groovy 또는 Kotlin으로 작성됩니다. Android 앱의 의존성, 버전, 기타 설정을 관리하는 데 사용됩니다. `withProjectBuildGradle`, `withAppBuildGradle`, `withSettingsGradle` mod로 직접 수정하기보다 정적인 `gradle.properties` 파일을 활용하세요.

`gradle.properties`는 groovy 파일이 읽을 수 있는 정적 key/value 쌍입니다. 예를 들어 Groovy에서 어떤 toggle을 제어하고 싶다면:

```properties
expo.react.jsEngine=hermes
```

그다음 Gradle 파일에서:

```groovy
project.ext.react = [enableHermes: findProperty('expo.react.jsEngine') ?: 'jsc']
```

-   `gradle.properties`의 key는 `.`로 구분된 camel case를 사용하고, 보통 prebuild가 관리하는 속성임을 나타내기 위해 `expo` 접두사를 사용하세요.
-   속성에 접근할 때는 두 가지 전역 메서드 중 하나를 사용하세요:
    -   `property`: 속성을 가져오며, 정의되지 않았으면 오류를 던집니다.
    -   `findProperty`: 속성이 없어도 오류를 던지지 않고 가져옵니다. 보통 `?:` 연산자와 함께 사용해 기본값을 줄 수 있습니다.

일반적으로 Gradle 파일과는 Expo [Autolinking](/more/glossary-of-terms#autolinking)을 통해서만 상호작용해야 합니다. 이 방식은 프로젝트 파일에 대한 프로그래밍 인터페이스를 제공합니다.

### iOS AppDelegate

일부 module은 프로젝트 AppDelegate에 delegate 메서드를 추가해야 할 수 있습니다. 이는 [AppDelegate subscribers](/modules/appdelegate-subscribers)를 사용하면 안전하게 할 수 있고, `withAppDelegate` mod로 위험하게도 할 수 있습니다(_강하게 비권장_). AppDelegate subscriber를 사용하면 네이티브 Expo module이 중요한 이벤트에 안전하고 신뢰할 수 있게 반응할 수 있습니다.

아래는 AppDelegate subscriber가 실제로 동작하는 예시입니다. 추가로 GitHub의 커뮤니티 저장소에서도 많은 예시를 찾을 수 있습니다([예시 하나](https://github.com/bamlab/react-native-app-security/blob/c1a861cbd348f404ec18ffae90d1c9bdc66bc00d/ios/RNASAppLifecyleDelegate.swift)).

-   `expo-linking`: [**LinkingAppDelegateSubscriber.swift**](https://github.com/expo/expo/blob/b4ca25a4319d7148258ebd5121d1df40a3b1333e/packages/expo-linking/ios/LinkingAppDelegateSubscriber.swift#L14) (openURL)
-   `expo-notifications`: [**NotificationsAppDelegateSubscriber.swift**](https://github.com/expo/expo/blob/bd469e421856f348d539b1b57325890147935dbc/packages/expo-notifications/ios/EXNotifications/PushToken/EXPushTokenManager.m) (didRegisterForRemoteNotificationsWithDeviceToken, didFailToRegisterForRemoteNotificationsWithError, didReceiveRemoteNotification)

### iOS CocoaPods Podfile

**Podfile**은 정규 표현식으로 사용자 지정할 수 있지만(이런 변경은 서로 잘 합성되지 않고 여러 변경이 충돌할 가능성이 높기 때문에 위험하다고 간주됨), 더 신뢰할 수 있는 방법은 **Podfile.properties.json**이라는 JSON 파일에 구성 값을 설정하는 것입니다. 아래에서 **Podfile**을 사용자 지정하는 데 `podfile_properties`가 어떻게 사용되는지 보세요:

```ruby
require 'json'

podfile_properties = JSON.parse(File.read(File.join(__dir__, 'Podfile.properties.json'))) rescue {}

platform :ios, podfile_properties['ios.deploymentTarget'] || '15.1'

target 'yolo27' do
  use_expo_modules!
  # ...

  # podfile_properties['your_property']
end
```

일반적으로 Podfile과는 Expo [Autolinking](/more/glossary-of-terms#autolinking)을 통해서만 상호작용해야 합니다. 이 방식은 프로젝트 파일에 대한 프로그래밍 인터페이스를 제공합니다.

### 사용자 지정 base modifier

Expo CLI의 `npx expo prebuild` 명령은 기본 base modifier를 가져오기 위해 [`@expo/prebuild-config`](https://github.com/expo/expo/tree/main/packages/%40expo/prebuild-config)를 사용합니다. 기본값은 흔한 파일 일부만 관리하므로, 사용자 지정 파일을 관리하려면 로컬에서 새 base modifier를 추가할 수 있습니다.

예를 들어 `ios/*/AppDelegate.h` 파일 관리 지원을 추가하고 싶다면 `ios.appDelegateHeader` modifier를 추가해 처리할 수 있습니다.

> 이 예시는 단순한 로컬 TypeScript 지원을 위해 `tsx`를 사용합니다. 꼭 필요한 것은 아닙니다. 자세한 내용은 [Learn more](/guides/typescript#appconfigjs)를 참고하세요.

```ts
import { ConfigPlugin, IOSConfig, Mod, withMod, BaseMods } from 'expo/config-plugins';
import fs from 'fs';

/**
 * A plugin which adds new base modifiers to the prebuild config.
 */
export function withAppDelegateHeaderBaseMod(config) {
  return BaseMods.withGeneratedBaseMods<'appDelegateHeader'>(config, {
    platform: 'ios',
    providers: {
      // Append a custom rule to supply AppDelegate header data to mods on `mods.ios.appDelegateHeader`
      appDelegateHeader: BaseMods.provider<IOSConfig.Paths.AppDelegateProjectFile>({
        // Get the local filepath that should be passed to the `read` method.
        getFilePath({ modRequest: { projectRoot } }) {
          const filePath = IOSConfig.Paths.getAppDelegateFilePath(projectRoot);
          // Replace the .m with a .h
          if (filePath.endsWith('.m')) {
            return filePath.substr(0, filePath.lastIndexOf('.')) + '.h';
          }
          // Possibly a Swift project...
          throw new Error(`Could not locate a valid AppDelegate.h at root: "${projectRoot}"`);
        },
        // Read the input file from the filesystem.
        async read(filePath) {
          return IOSConfig.Paths.getFileInfo(filePath);
        },
        // Write the resulting output to the filesystem.
        async write(filePath: string, { modResults: { contents } }) {
          await fs.promises.writeFile(filePath, contents);
        },
      }),
    },
  });
}

/**
 * (Utility) Provides the AppDelegate header file for modification.
 */
export const withAppDelegateHeader: ConfigPlugin<Mod<IOSConfig.Paths.AppDelegateProjectFile>> = (
  config,
  action
) => {
  return withMod(config, {
    platform: 'ios',
    mod: 'appDelegateHeader',
    action,
  });
};

// (Example) Log the contents of the modifier.
export const withSimpleAppDelegateHeaderMod = config => {
  return withAppDelegateHeader(config, config => {
    console.log('modify header:', config.modResults);
    return config;
  });
};
```

이 새 base mod를 사용하려면 plugins 배열에 추가하세요. base mod는 **반드시** 이 mod를 사용하는 다른 모든 plugin 뒤, 즉 마지막에 추가해야 합니다. 프로세스 마지막에 결과를 디스크에 써야 하기 때문입니다.

```js
// Required for external files using TS
require('tsx/cjs');

import {
  withAppDelegateHeaderBaseMod,
  withSimpleAppDelegateHeaderMod,
} from './withAppDelegateHeaderBaseMod.ts';

export default ({ config }) => {
  if (!config.plugins) config.plugins = [];
  config.plugins.push(
    withSimpleAppDelegateHeaderMod,

    // Base mods MUST be last
    withAppDelegateHeaderBaseMod
  );
  return config;
};
```

자세한 내용은 이 기능 지원을 추가한 [the PR that adds support](https://github.com/expo/expo-cli/pull/3852)를 참고하세요.

## expo install

node module을 `npx expo install` 명령으로 설치할 때 config plugin이 포함되어 있다면, 그 plugin은 프로젝트의 app config에 자동으로 추가됩니다. 이는 설정을 더 쉽게 만들고 사용자가 plugin 추가를 잊는 일을 줄여 줍니다. 하지만 몇 가지 주의할 점이 있습니다:

1.  `npx expo install`은 루트 **app.config.js** 파일을 사용하는 config plugin만 app manifest에 자동 추가합니다. 이 규칙은 `lodash` 같은 인기 package가 config plugin으로 오인되어 prebuild를 깨뜨리는 일을 막기 위해 추가되었습니다.
2.  현재는 config plugin이 필수 props를 갖는지 감지하는 메커니즘이 없습니다. 그래서 `expo install`은 plugin만 추가하고, 추가 props를 넣으려고 시도하지 않습니다. 예를 들어 `expo-camera`는 선택적인 추가 props를 가지므로 `plugins: ['expo-camera']`는 유효하지만, 필수 props가 있다면 `expo-camera`는 오류를 던질 것입니다.
3.  plugin은 사용자의 프로젝트가 정적 app config(**app.json**, **app.config.json**)를 사용할 때만 자동으로 추가할 수 있습니다. 사용자가 **app.config.js**가 있는 프로젝트에서 `expo install expo-camera`를 실행하면 다음과 같은 경고를 보게 됩니다:

```sh
Cannot automatically write to dynamic config at: app.config.js
Please add the following to your app config

{
  "plugins": [
    "expo-camera"
  ]
}
```
