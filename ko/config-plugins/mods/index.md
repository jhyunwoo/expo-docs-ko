---
modificationDate: November 20, 2025
title: Mods
description: config plugin을 만들 때 mods가 무엇이며 어떻게 사용하는지 알아보세요.
---

# Mods

config plugin을 만들 때 mods가 무엇이며 어떻게 사용하는지 알아보세요.

이 가이드는 mods와 mod plugin이 무엇인지, 어떻게 동작하는지, 그리고 Expo 프로젝트용 config plugin을 만들 때 이를 효과적으로 사용하는 방법을 설명합니다.

아래 다이어그램을 사용해, 이 가이드에서는 config plugin 계층 구조의 마지막 두 부분을 배우게 됩니다:

```
withMyPlugin ("myPlugin") [Config Plugin]
→ withAndroidPlugin, withIosPlugin [Plugin Function]
→ withAndroidManifest, withInfoPlist [Mod Plugin Function]
→ mods.android.manifest, mods.ios.infoplist [Mod]
```

## Mod plugin

mod plugin은 prebuild 과정에서 네이티브 프로젝트 파일을 수정하는 방법을 제공합니다. 이들은 `expo/config-plugins` 라이브러리에서 제공되며, 최상위 mod(또는 _기본 [mods](/config-plugins/mods#mods)_)를 감싸는 역할을 합니다. 최상위 mod는 플랫폼별이며 처음에는 이해하기 어려운 다양한 작업을 수행하기 때문입니다.

> **Tip:** mods가 필요한 기능을 개발하고 있다면, 최상위 mod와 직접 상호작용하기보다 _mod plugin_을 사용해야 합니다.

### 사용 가능한 mod plugin

다음 mod plugin을 `expo/config-plugins` 라이브러리에서 사용할 수 있습니다:

#### Android

| Default Android mod | Mod plugin | Dangerous | Description |
| --- | --- | --- | --- |
| `mods.android.manifest` | `withAndroidManifest` ([Example](https://github.com/expo/expo/blob/main/packages/expo-notifications/plugin/src/withNotificationsAndroid.ts)) | - | **android/app/src/main/AndroidManifest.xml**을 JSON으로 수정합니다([`xml2js`](https://www.npmjs.com/package/xml2js)로 파싱). |
| `mods.android.strings` | `withStringsXml` ([Example](https://github.com/expo/expo/blob/d7fb5d254d5cb57ab06055136db72b9347d3db1e/packages/expo-navigation-bar/plugin/src/withNavigationBar.ts)) | - | **android/app/src/main/res/values/strings.xml**을 JSON으로 수정합니다([`xml2js`](https://www.npmjs.com/package/xml2js)로 파싱). |
| `mods.android.colors` | `withAndroidColors` ([Example](https://github.com/expo/expo/blob/main/packages/%40expo/config-plugins/src/android/StatusBar.ts#L8)) | - | **android/app/src/main/res/values/colors.xml**을 JSON으로 수정합니다([`xml2js`](https://www.npmjs.com/package/xml2js)로 파싱). |
| `mods.android.colorsNight` | `withAndroidColorsNight` ([Example](https://github.com/expo/expo/blob/main/packages/%40expo/prebuild-config/src/plugins/unversioned/expo-splash-screen/withAndroidSplashStyles.ts#L5)) | - | **android/app/src/main/res/values-night/colors.xml**을 JSON으로 수정합니다([`xml2js`](https://www.npmjs.com/package/xml2js)로 파싱). |
| `mods.android.styles` | `withAndroidStyles` ([Example](https://github.com/expo/expo/blob/main/packages/%40expo/prebuild-config/src/plugins/unversioned/expo-splash-screen/withAndroidSplashStyles.ts#L5)) | - | **android/app/src/main/res/values/styles.xml**을 JSON으로 수정합니다([`xml2js`](https://www.npmjs.com/package/xml2js)로 파싱). |
| `mods.android.gradleProperties` | `withGradleProperties` ([Example](https://github.com/expo/expo/blob/main/packages/%40expo/config-plugins/src/android/BuildProperties.ts#L5)) | - | **android/gradle.properties**를 `Properties.PropertiesItem[]` 형태로 수정합니다. |
| `mods.android.mainActivity` | `withMainActivity` ([Example](https://github.com/expo/expo/blob/main/packages/install-expo-modules/src/plugins/android/withAndroidModulesMainActivity.ts#L2)) |  | **android/app/src/main/<package>/MainActivity.java**를 문자열로 수정합니다. |
| `mods.android.mainApplication` | `withMainApplication` ([Example](https://github.com/expo/expo/blob/main/packages/expo-web-browser/plugin/src/withWebBrowserAndroid.ts#L8)) |  | **android/app/src/main/<package>/MainApplication.java**를 문자열로 수정합니다. |
| `mods.android.appBuildGradle` | `withAppBuildGradle` ([Example](https://github.com/expo/expo/blob/main/packages/%40expo/config-plugins/src/android/GoogleServices.ts#L5)) |  | **android/app/build.gradle**를 문자열로 수정합니다. |
| `mods.android.projectBuildGradle` | `withProjectBuildGradle` ([Example](https://github.com/expo/expo/blob/main/packages/%40expo/config-plugins/src/android/GoogleServices.ts#L5)) |  | **android/build.gradle**를 문자열로 수정합니다. |
| `mods.android.settingsGradle` | `withSettingsGradle` ([Example](https://github.com/expo/expo/blob/main/packages/install-expo-modules/src/plugins/android/withAndroidSettingsGradle.ts#L2)) |  | **android/settings.gradle**를 문자열로 수정합니다. |

#### iOS

| Default iOS mod | Mod plugin | Dangerous | Description |
| --- | --- | --- | --- |
| `mods.ios.infoPlist` | `withInfoPlist` ([Example](https://github.com/expo/expo/blob/main/packages/expo-location/plugin/src/withLocation.ts)) | - | **ios/<name>/Info.plist**를 JSON으로 수정합니다([`@expo/plist`](https://www.npmjs.com/package/@expo/plist)로 파싱). |
| `mods.ios.entitlements` | `withEntitlementsPlist` ([Example](https://github.com/expo/expo/blob/main/packages/expo-apple-authentication/plugin/src/withAppleAuthIOS.ts)) | - | **ios/<name>/<product-name>.entitlements**를 JSON으로 수정합니다([`@expo/plist`](https://www.npmjs.com/package/@expo/plist)로 파싱). |
| `mods.ios.expoPlist` | `withExpoPlist` ([Example](https://github.com/expo/expo/blob/main/packages/%40expo/config-plugins/src/ios/Updates.ts#L6)) | - | **ios/<name>/Expo.plist**를 JSON으로 수정합니다(iOS용 Expo updates config) ([`@expo/plist`](https://www.npmjs.com/package/@expo/plist)로 파싱). |
| `mods.ios.xcodeproj` | `withXcodeProject` ([Example](https://github.com/expo/expo/blob/main/packages/expo-asset/plugin/src/withAssetsIos.ts)) | - | **ios/<name>.xcodeproj**를 `XcodeProject` 객체로 수정합니다([`xcode`](https://www.npmjs.com/package/xcode)로 파싱). |
| `mods.ios.podfile` | `withPodfile` ([Example](https://github.com/expo/expo/blob/main/packages/%40expo/config-plugins/src/ios/Maps.ts#L6) | - | **ios/Podfile**를 문자열로 수정합니다. |
| `mods.ios.podfileProperties` | `withPodfileProperties` ([Example](https://github.com/expo/expo/blob/main/packages/%40expo/config-plugins/src/ios/BuildProperties.ts#L4)) | - | **ios/Podfile.properties.json**을 JSON으로 수정합니다. |
| `mods.ios.appDelegate` | `withAppDelegate` ([Example](https://github.com/expo/expo/blob/main/packages/%40expo/config-plugins/src/ios/Maps.ts#L6)) |  | **ios/<name>/AppDelegate.m**를 문자열로 수정합니다. |

> **기본 Android 및 iOS mod에 대한 참고:**  
> 기본 mod는 일반적인 파일 조작을 위해 mod compiler가 제공합니다. dangerous modification은 정규 표현식(regex)에 의존해 애플리케이션 코드를 수정하므로 빌드가 깨질 수 있습니다. regex mod는 버전 관리도 어렵기 때문에 신중하게 사용해야 합니다. 가능하다면 애플리케이션 코드를 수정할 때도 애플리케이션 코드, 즉 [Expo Modules](https://github.com/expo/expo/tree/main/packages/expo-modules-core) 네이티브 API를 사용하는 방향을 택하세요.

## Mods

config plugin은 prebuild 과정에서 네이티브 프로젝트 파일을 수정하기 위해 **mods**(modifier의 줄임말)를 사용합니다. mod는 **AndroidManifest.xml**, **Info.plist** 같은 플랫폼별 파일과 기타 네이티브 구성 파일을 수동으로 수정하지 않고도 변경할 수 있게 해 주는 비동기 함수입니다. 이 함수들은 `npx expo prebuild`의 **syncing** 단계(prebuild 과정)에서만 실행됩니다.

mod는 config와 데이터 객체를 받아 둘 다 수정한 뒤 하나의 객체로 반환합니다. 예를 들어 네이티브 프로젝트에서 `mods.android.manifest`는 **AndroidManifest.xml**을 수정하고, `mods.ios.plist`는 **Info.plist**를 수정합니다.

**config plugin 안에서 mod를 최상위 함수(예: `with.android.manifest`)처럼 직접 사용하지는 않습니다.** mod가 필요할 때는 config plugin 안에서 _mod plugin_을 사용합니다. 이 mod plugin은 `expo/config-plugins` 라이브러리에서 제공되며, 최상위 mod 함수를 감싸고 내부적으로 여러 작업을 수행합니다. 사용 가능한 mod 목록은 [`expo/config-plugins`가 제공하는 mod plugin](/config-plugins/mods#available-mod-plugins)을 참고하세요.

기본 mod의 동작 방식과 핵심 특징

기본 mod가 resolve되면 app config의 `mods` 객체에 추가됩니다. 이 `mods` 객체는 app config의 나머지 부분과 다릅니다. serialize되지 않으므로, 코드 생성 _중간에_ 작업을 수행하는 데 사용할 수 있기 때문입니다. 가능하면 기본 mod보다 사용 가능한 mod plugin을 사용하는 것이 좋습니다. 다루기가 더 쉽기 때문입니다.

다음은 기본 mod가 동작하는 방식의 개략적인 흐름입니다:

-   `@expo/prebuild-config`의 [`getPrebuildConfig`](https://github.com/expo/expo/blob/efc2db4eb1c909544e28792a15c89f8d22113c5b/packages/%40expo/prebuild-config/src/getPrebuildConfig.ts#L28)을 사용해 config를 읽습니다.
-   Expo가 지원하는 모든 핵심 기능은 `withIosExpoPlugins`의 plugin을 통해 추가됩니다. 여기에는 이름, 버전, 아이콘, locale 등이 포함됩니다.
-   config는 compiler `compileModsAsync`에 전달됩니다.
-   compiler는 **Info.plist** 같은 데이터를 읽고, 이름 있는 mod(예: `mods.ios.infoPlist`)를 실행한 다음, 결과를 파일 시스템에 다시 쓰는 base mod를 추가합니다.
-   compiler는 모든 mod를 순회하며 비동기적으로 평가하고, `projectRoot` 같은 몇 가지 기본 prop을 제공합니다.
    -   각 mod가 끝난 뒤에는 잘못된 mod로 인해 mod chain이 깨졌는지 오류 처리에서 검사합니다.

기본 mod의 몇 가지 핵심 특징은 다음과 같습니다:

-   `mods`는 manifest에서 제외되며 **`Updates.manifest`를 통해 접근할 수 없습니다**. mods는 오직 코드 생성 중 네이티브 프로젝트 파일을 수정하기 위해 존재합니다!
    
-   `mods`는 `npx expo prebuild` 명령 동안 파일을 안전하게 읽고 쓸 수 있습니다. 이것이 Expo CLI가 **Info.plist**, entitlements, xcproj 등을 수정하는 방법입니다.
    
-   `mods`는 플랫폼별이며 항상 플랫폼별 객체에 추가되어야 합니다:
    
    ```ts
    module.exports = {
      name: 'my-app',
      mods: {
        ios: {
          /* iOS mods... */
        },
        android: {
          /* Android mods... */
        },
      },
    };
    ```
    

mod가 resolve된 뒤에는 각 mod의 내용이 디스크에 기록됩니다. 새로운 네이티브 파일을 지원하기 위해 사용자 정의 mod도 추가할 수 있습니다. 예를 들어 **GoogleServices-Info.plist**를 지원하는 mod를 만들고, 다른 mod에 전달할 수 있습니다.

### mod plugin의 동작 방식

mod plugin이 실행되면 `config` 객체와 함께 추가 속성인 `modResults`와 `modRequest`를 전달받습니다.

#### `modResults`

`modResults` 객체에는 수정하고 반환할 데이터가 들어 있습니다. 그 타입은 사용 중인 mod에 따라 달라집니다.

#### `modRequest`

`modRequest` 객체에는 mod compiler가 제공하는 다음 추가 속성이 포함됩니다.

| Property | Type | Description |
| --- | --- | --- |
| `projectRoot` | `string` | 범용 앱의 프로젝트 루트 디렉터리입니다. |
| `platformProjectRoot` | `string` | 특정 플랫폼의 프로젝트 루트입니다. |
| `modName` | `string` | mod의 이름입니다. |
| `platform` | `ModPlatform` | mods config에서 사용되는 플랫폼 이름입니다. |
| `projectName` | `string` | (iOS 전용) 프로젝트 파일 조회에 사용되는 경로 구성 요소입니다. 예: `projectRoot/ios/[projectName]/`. |

## 직접 mod 만들기

예를 들어 Xcode Project의 "product name"을 업데이트하는 mod를 작성하고 싶다면, [`withXcodeProject`](/config-plugins/mods#ios) mod plugin을 사용하는 config plugin 파일을 만들게 됩니다.

```ts
import { ConfigPlugin, withXcodeProject, IOSConfig } from 'expo/config-plugins';

const withCustomProductName: ConfigPlugin<string> = (config, customName) => {
  return withXcodeProject(
    config,
    async (
      config
    ) => {
      config.modResults = IOSConfig.Name.setProductName({ name: customName }, config.modResults);
      return config;
    }
  );
};

// Usage:

/// Create a config
const config = {
  name: 'my app',
};

/// Use the plugin
export default withCustomProductName(config, 'new_name');
```

## Plugin 모듈 해석

plugin을 구현할 때는 두 가지 기본 접근 방식을 고려할 수 있습니다:

1.  **앱 프로젝트 내부에 정의된 plugin**: 이러한 plugin은 프로젝트 내부에 로컬로 존재하므로, 앱 코드와 함께 사용자 정의하고 유지보수하기 쉽습니다. 프로젝트별 사용자 정의에 적합합니다.
    
2.  **독립 패키지 plugin**: 이러한 plugin은 별도 패키지로 존재하며 npm에 게시됩니다. 여러 프로젝트에서 공유할 수 있는 재사용 가능한 plugin에 적합합니다.
    

두 접근 방식 모두 네이티브 구성을 수정하는 동일한 기능을 제공하지만, 구조와 import 방식이 다릅니다. 아래 섹션에서는 각 접근 방식에서 모듈 해석이 어떻게 동작하는지 설명합니다.

> 아래에 명시되지 않은 해석 패턴은 예상되지 않는 동작이며, 향후 breaking change의 대상이 될 수 있습니다.

### 앱 프로젝트 내부에 정의된 plugin

앱 프로젝트 내부에 정의된 plugin은 여러 방식으로 프로젝트 안에서 직접 구현할 수 있습니다:

#### 파일 import

JavaScript/TypeScript 파일을 하나 만들고, 다른 JS/TS 파일처럼 config에서 사용하는 방식으로 프로젝트 안에 plugin을 빠르게 만들 수 있습니다.

`app.config.ts``` `import "./my-config-plugin"` ``

`my-config-plugin.ts``✓ Imported from config`

위 예시에서 config plugin 파일은 최소한의 bare function을 포함합니다:

```ts
module.exports = ({ config }: { config: ExpoConfig }) => {};
```

#### 동적 app config 내부의 inline function

Expo config 객체는 `plugins` 배열에 함수를 그대로 전달하는 것도 지원합니다. 이는 테스트하거나 파일을 따로 만들지 않고 plugin을 사용하고 싶을 때 유용합니다.

```js
const withCustom = (config, props) => config;

const config = {
  plugins: [
    [
      withCustom,
      {
        /* props */
      },
    ],
    withCustom,
  ],
};
```

문자열 대신 함수를 사용할 때의 한 가지 주의점은 serialization 과정에서 함수가 함수 이름으로 대체된다는 것입니다. 이렇게 해야 **manifest**(앱의 **index.html**과 비슷한 역할)가 예상대로 동작합니다. 직렬화된 config는 다음과 같습니다:

```json
{
  "plugins": [["withCustom", {}], "withCustom"]
}
```

### 독립 패키지 plugin

> 독립 패키지 plugin을 만드는 단계별 가이드는 [config plugin이 포함된 module 만들기](/modules/config-plugin-and-native-module-tutorial)를 참고하세요.

독립 패키지 plugin은 두 가지 방식으로 구현할 수 있습니다:

#### 1\. 전용 config plugin 패키지

이 패키지는 config plugin 제공만을 목적으로 하는 npm 패키지입니다. 전용 config plugin 패키지의 경우 `app.plugin.js`를 사용해 plugin을 export할 수 있습니다:

`app.config.ts``` `import "expo-splash-screen"` ``

`node_modules`

 `expo-splash-screen``Node module`

  `app.plugin.js``✓ Entry file for custom plugins`

  `build`

   `index.js``` ✗ Skipped in favor of `app.plugin.js` ``

#### 2\. companion package가 있는 config plugin

config plugin이 **app.plugin.js**가 없는 Node module의 일부인 경우에는 패키지의 `main` 진입점을 사용합니다:

`app.config.ts``` `import "expo-splash-screen"` ``

`node_modules`

 `expo-splash-screen``Node module`

  `package.json``` `"main": "./build/index.js"` ``

  `build`

   `index.js``✓ Node resolve to this file`

### Plugin 해석 순서

plugin package를 import할 때 파일은 다음 순서대로 해석됩니다:

1.  **패키지 루트의 app.plugin.js**

`app.config.ts``` `import "expo-splash-screen"` ``

`node_modules`

 `expo-splash-screen``Node module`

  `package.json``` `"main": "./build/index.js"` ``

  `app.plugin.js``✓ Entry file for custom plugins`

  `build`

   `index.js``✗ Skipped in favor of app.plugin.js`

2.  **패키지의 main entry (package.json 기준)**

`app.config.ts``` `import "expo-splash-screen"` ``

`node_modules`

 `expo-splash-screen``Node module`

  `package.json``` `"main": "./build/index.js"` ``

  `build`

   `index.js``✓ Node resolve to this file`

3.  **직접 내부 import** (권장되지 않음)

> 표준 해석 순서를 우회하며 향후 업데이트에서 깨질 수 있으므로 module 내부를 직접 import하는 것은 피하세요.

`app.config.ts``` `import "expo-splash-screen/build/index.js"` ``

`node_modules`

 `expo-splash-screen`

  `package.json``` `"main": "./build/index.js"` ``

  `app.plugin.js``✗ Ignored due to direct import`

  `build`

   `index.js``` ✓ `expo-splash-screen/build/index.js` ``

### plugin에 app.plugin.js를 사용하는 이유

config plugin에는 `app.plugin.js` 접근 방식을 선호합니다. 이 방식은 메인 패키지 코드와는 다른 transpilation 설정을 허용하기 때문입니다. 이는 특히 Node 환경이 Android, iOS, 웹 JS 환경과는 다른 transpilation preset을 요구하는 경우에 중요합니다(예: `import/export` 대신 `module.exports` 사용).
