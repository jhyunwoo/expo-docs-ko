---
title: app.json / app.config.js
description: Expo app config에서 사용할 수 있는 속성 레퍼런스입니다.
---

# app.json / app.config.js

Expo app config에서 사용할 수 있는 속성 레퍼런스입니다.

다음은 **app.json** 또는 **app.config.json**의 `"expo"` 키 아래에서 사용할 수 있는 속성 목록입니다. 이 속성들은 **app.config.js** 또는 **app.config.ts**의 최상위 객체에 전달할 수 있습니다.

[app config로 구성하기](/workflow/configuration) — 앱 구성, 다양한 app config 파일 간 차이, 동적으로 사용하는 방법에 대한 정보입니다.

## 속성

### `name`

타입: `string`

Expo Go 안과 standalone 앱의 홈 화면 양쪽에 표시되는 앱 이름입니다.

기존 React Native 앱?

앱 이름을 변경하려면 Xcode의 'Display Name' 필드와 `android/app/src/main/res/values/strings.xml`의 `app_name` 문자열을 수정하세요

### `description`

타입: `string`

앱이 무엇이고 왜 훌륭한지에 대한 짧은 설명입니다.

### `slug`

타입: `string`

계정 전체에서 고유한, URL 친화적인 프로젝트 이름입니다.

### `owner`

타입: `string`

프로젝트를 소유한 Expo 계정의 이름입니다. 팀이 함께 프로젝트를 협업할 때 유용합니다. 제공하지 않으면 owner는 현재 사용자의 username으로 기본 설정됩니다.

### `currentFullName`

타입: `string`

표시 목적으로 사용되는 자동 생성된 Expo 계정 이름과 slug입니다. 직접 설정하는 용도가 아닙니다. 형식은 `@username/slug`입니다. 인증되지 않은 경우 username은 `@anonymous`입니다. 게시된 프로젝트의 경우 프로젝트가 계정 간에 이전되거나 이름이 변경되면 이 값이 바뀔 수 있습니다.

### `originalFullName`

타입: `string`

Notifications 및 AuthSession proxy 같은 서비스에 사용되는 자동 생성된 Expo 계정 이름과 slug입니다. 직접 설정하는 용도가 아닙니다. 형식은 `@username/slug`입니다. 인증되지 않은 경우 username은 `@anonymous`입니다. 게시된 프로젝트의 경우 프로젝트가 계정 간에 이전되거나 이름이 변경되더라도 이 값은 바뀌지 않습니다.

### `sdkVersion`

타입: `string`

프로젝트를 실행할 Expo sdkVersion입니다. 이는 package.json에 지정된 버전과 일치해야 합니다.

### `runtimeVersion`

다음 타입 중 하나:

-   `string` matching the following pattern: `^[a-zA-Z\d][a-zA-Z\d._+()-]{0,254}$`
-   `string` matching the following pattern: `^exposdk:((\d+\.\d+\.\d+)|(UNVERSIONED))$`
-   다음 속성을 가진 `object`:
    
    #### `policy`
    
    타입: `enum` • 경로: `runtimeVersion.policy`
    
    유효한 값: `nativeVersion`, `sdkVersion`, `appVersion`, `fingerprint`.
    

빌드의 네이티브 코드와 OTA update 사이의 호환성을 나타내는 속성입니다.

### `version`

타입: `string`

앱 버전입니다. 이 필드 외에도 `ios.buildNumber`와 `android.versionCode`를 함께 사용합니다. 앱 버전 관리 방법은 [여기](https://docs.expo.dev/distribution/app-stores/#versioning-your-app)에서 더 읽어보세요. iOS에서는 `CFBundleShortVersionString`에 해당하고, Android에서는 `versionName`에 해당합니다. 필요한 형식은 [여기](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleshortversionstring)에서 확인할 수 있습니다.

기존 React Native 앱?

앱 버전을 변경하려면 Xcode의 'Version' 필드와 `android/app/build.gradle`의 `versionName` 문자열을 수정하세요

### `platforms`

타입: `array`

프로젝트가 명시적으로 지원하는 플랫폼입니다. 지정하지 않으면 기본값은 `["ios", "android"]`입니다.

예시

`[ "ios", "android", "web" ]`

### `githubUrl`

타입: `string`

앱의 source code를 Github에서 공유하고 싶다면 저장소 URL을 여기에 입력하세요. 그러면 Expo 프로젝트 페이지에서 링크됩니다.

예시

`"https://github.com/expo/expo"`

### `orientation`

타입: `enum` • 다음 중 하나: `default`, `portrait`, `landscape`

앱을 portrait 또는 landscape의 특정 orientation으로 고정합니다. 기본값은 잠금 없음입니다. 유효한 값: `default`, `portrait`, `landscape`

### `userInterfaceStyle`

타입: `enum` • 다음 중 하나: `light`, `dark`, `automatic`

"dark mode" 같은 light 또는 dark 사용자 인터페이스 외형을 앱에 강제 적용하거나, 시스템 설정에 자동으로 맞추도록 구성합니다. 제공하지 않으면 기본값은 `light`입니다. Android에서 동작하려면 프로젝트에 `expo-system-ui`가 설치되어 있어야 합니다.

### `backgroundColor`

타입: `string`

React view 뒤쪽에 표시되는 앱의 배경색입니다. 루트 view 배경색이라고도 합니다. iOS에서 동작하려면 프로젝트에 `expo-system-ui`가 설치되어 있어야 합니다.

예를 들어 `'#000000'` 같은 6자리 hex 색상 문자열입니다. 기본값은 흰색 `'#ffffff'`입니다.

### `primaryColor`

타입: `string`

Android에서는 multitasker에서 앱의 색상을 결정합니다. 현재 iOS에서는 사용되지 않지만, 앞으로 다른 목적으로 사용될 수 있습니다.

예를 들어 `'#000000'` 같은 6자리 hex 색상 문자열입니다.

### `icon`

타입: `string`

앱 아이콘으로 사용할 이미지의 로컬 경로 또는 원격 URL입니다. 1024x1024 png 파일 사용을 권장합니다. 이 아이콘은 홈 화면과 Expo Go 앱 안에 표시됩니다.

기존 React Native 앱?

앱 아이콘을 변경하려면 `ios/<PROJECT-NAME>/Assets.xcassets/AppIcon.appiconset`의 파일(iOS는 Xcode 사용 권장)과 `android/app/src/main/res/mipmap-<RESOLUTION>`을 수정하거나 교체하세요. 각 플랫폼의 가이드라인([iOS](https://developer.apple.com/design/human-interface-guidelines/ios/icons-and-images/app-icon/), [Android 7.1 이하](https://material.io/design/iconography/#icon-treatments), [Android 8+](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive))을 따르고, 기존의 각 크기별 아이콘을 모두 제공해야 합니다.

### `androidStatusBar`

타입: `object`

Android의 status bar 구성입니다. 자세한 내용은 [StatusBar 구성하기](https://docs.expo.dev/guides/configuring-statusbar/)를 참고하세요.

#### `barStyle`

타입: `enum` • 다음 중 하나: `light-content`, `dark-content` • 경로: `androidStatusBar.barStyle`

status bar 아이콘이 light 또는 dark 색상을 갖도록 구성합니다. 유효한 값: `light-content`, `dark-content`. 기본값은 `dark-content`입니다.

#### `backgroundColor`

타입: `string` • 경로: `androidStatusBar.backgroundColor`

status bar의 배경색을 지정합니다. `dark-content` bar style에서는 기본값이 `#00000000`(투명)이고, `light-content` bar style에서는 `#00000088`(반투명 검정)입니다.

예를 들어 검정색 `'#000000'` 같은 6자리 hex 색상 문자열 또는 반투명 검정 `'#00000088'` 같은 8자리 hex 색상 문자열 `'#RRGGBBAA'`입니다.

#### `hidden`

타입: `boolean` • 경로: `androidStatusBar.hidden`

시스템에 status bar를 표시할지 여부를 지시합니다. 기본값은 `false`입니다.

#### `translucent`

타입: `boolean` • 경로: `androidStatusBar.translucent`

false이면 시스템 status bar가 앱 콘텐츠를 아래로 밀어냅니다(`position: relative`와 유사). true이면 status bar가 앱 콘텐츠 위에 떠 있게 됩니다(`position: absolute`와 유사). iOS status bar 동작(콘텐츠 위에만 뜰 수 있음)에 맞추기 위해 기본값은 `true`입니다. 이 속성을 명시적으로 `true`로 설정하면 `styles.xml`에 `android:windowTranslucentStatus`가 추가되며, `softwareKeyboardLayoutMode`가 `resize`로 설정된 경우 Android에서 예상치 못한 keyboard 동작을 일으킬 수 있습니다. 이 경우 keyboard 레이아웃 관리를 위해 `KeyboardAvoidingView`를 사용해야 합니다.

### `developmentClient`

타입: `object`

development client에서 이 앱을 실행할 때만 적용되는 설정입니다.

#### `silentLaunch`

타입: `boolean` • 경로: `developmentClient.silentLaunch`

true이면 앱이 development client에서 별도의 dialog나 진행 표시 없이 standalone 앱처럼 바로 실행됩니다.

### `scheme`

다음 타입 중 하나:

-   `string` matching the following pattern: `^[a-z][a-z0-9+.-]*$`
`{ "type": "array", "items": { "type": "string", "pattern": "^[a-z][a-z0-9+.-]*$" } }`

앱으로 연결될 URL scheme입니다. 예를 들어 이를 `'demo'`로 설정하면 demo:// URL을 탭했을 때 앱이 열립니다. 이는 빌드 시점 구성으로, Expo Go에서는 아무 효과가 없습니다.

**소문자** 문자로 시작하고 그 뒤에 **소문자** 문자, 숫자, "+", "." 또는 "-"의 조합이 올 수 있는 문자열입니다.

기존 React Native 앱?

앱 scheme을 변경하려면 `Info.plist`와 `AndroidManifest.xml`에서 이전 scheme이 나타나는 모든 부분을 바꾸세요

### `extra`

타입: `object`

experience에 전달하고 싶은 추가 필드입니다. 값은 `Constants.expoConfig.extra`를 통해 접근할 수 있습니다 ([자세히 보기](https://docs.expo.dev/versions/latest/sdk/constants/#constantsmanifest))

### `updates`

타입: `object`

expo-updates 라이브러리의 구성입니다

#### `enabled`

타입: `boolean` • 경로: `updates.enabled`

updates 시스템을 실행할지 여부입니다. 기본값은 true입니다. false로 설정하면 빌드 시점에 번들된 코드와 assets만 사용합니다.

#### `checkAutomatically`

타입: `enum` • 다음 중 하나: `ON_ERROR_RECOVERY`, `ON_LOAD`, `WIFI_ONLY`, `NEVER` • 경로: `updates.checkAutomatically`

기본적으로 expo-updates는 앱이 로드될 때마다 update를 확인합니다. 오류 복구 중일 때만 자동 확인을 하려면 `ON_ERROR_RECOVERY`로 설정하세요. 자동 확인을 끄려면 `NEVER`로 설정하세요. 유효한 값: `ON_LOAD`(기본값), `ON_ERROR_RECOVERY`, `WIFI_ONLY`, `NEVER`

#### `useEmbeddedUpdate`

타입: `boolean` • 경로: `updates.useEmbeddedUpdate`

내장된 update를 로드할지 여부입니다. 기본값은 true입니다. false로 설정하면 실행 시 update를 가져옵니다. false로 설정할 때는 `checkAutomatically`를 `ON_LOAD`로 설정하고, 초기 원격 update가 다운로드될 수 있을 만큼 `fallbackToCacheTimeout`을 충분히 크게 설정하세요. production에서는 사용하지 않아야 합니다.

#### `fallbackToCacheTimeout`

타입: `number` • 경로: `updates.fallbackToCacheTimeout`

앱 실행 시 새 update를 확인하고 가져오기를 기다리는 시간(ms)입니다. 이 시간이 지나면 device에 이미 있는 가장 최근 update로 되돌아갑니다. 기본값은 0입니다. 0과 300000(5분) 사이여야 합니다. 시작 시 update 확인이 이 값보다 오래 걸리면, 확인 중 다운로드된 update는 다음 앱 실행 시 적용됩니다.

#### `url`

타입: `string` • 경로: `updates.url`

expo-updates가 update manifest를 가져올 URL입니다.

#### `codeSigningCertificate`

타입: `string` • 경로: `updates.codeSigningCertificate`

code-signed update를 검증하는 데 사용되는 PEM 형식 X.509 인증서의 로컬 경로입니다. 제공되면 expo-updates가 다운로드하는 모든 update는 서명되어 있어야 합니다.

#### `codeSigningMetadata`

타입: `object` • 경로: `updates.codeSigningMetadata`

`codeSigningCertificate`용 메타데이터입니다.

##### `alg`

타입: `enum` • 다음 중 하나: `rsa-v1_5-sha256` • 경로: `updates.codeSigningMetadata.alg`

manifest code signing signature를 생성하는 데 사용되는 알고리즘입니다. 유효한 값: `rsa-v1_5-sha256`

##### `keyid`

타입: `string` • 경로: `updates.codeSigningMetadata.keyid`

인증서 안 키의 식별자입니다. 서명 생성 또는 검증 시 서명 메커니즘에 지시를 내리는 데 사용됩니다.

#### `requestHeaders`

타입: `object` • 경로: `updates.requestHeaders`

manifest 또는 assets를 가져올 때 `expo-updates`가 만드는 HTTP 요청에 포함할 추가 HTTP 헤더입니다. 사전 설정된 헤더를 덮어쓸 수 있습니다.

#### `assetPatternsToBeBundled`

타입: `array` • 경로: `updates.assetPatternsToBeBundled`

update에 포함되어야 하는 파일을 지정하는 glob pattern 배열입니다. Glob pattern은 프로젝트 루트를 기준으로 상대 경로입니다. `['**']` 값은 프로젝트 루트 안의 모든 asset 파일과 매칭됩니다. 제공하지 않으면 모든 asset 파일이 포함됩니다. 예시: `['app/images/**/*.png', 'app/fonts/**/*.woff']` 값을 사용하면 `app/images`의 모든 하위 디렉터리에 있는 `.png` 파일과 `app/fonts`의 모든 하위 디렉터리에 있는 `.woff` 파일이 update에 포함됩니다.

#### `disableAntiBrickingMeasures`

타입: `boolean` • 경로: `updates.disableAntiBrickingMeasures`

expo-updates에 내장된 anti-bricking 보호 조치를 비활성화할지 여부입니다. 기본값은 false입니다. true로 설정하면 특정 구성 옵션을 JS API에서 덮어쓸 수 있게 되며, 주의하지 않으면 앱이 벽돌 상태가 될 수 있습니다. production에서는 사용하지 않아야 합니다.

#### `useNativeDebug`

타입: `boolean` • 경로: `updates.useNativeDebug`

updates가 활성화된 상태에서 native code 디버깅을 활성화합니다. 기본값은 false입니다. true로 설정하면 Podfile.properties.json과 gradle.properties에 EX_UPDATES_NATIVE_DEBUG 환경 변수가 설정됩니다. 그러면 Xcode와 Android Studio debug build가 expo-updates가 활성화된 상태로 빌드되고, JS 디버깅(dev client 또는 packager 사용)은 비활성화됩니다. production에서는 사용하지 않아야 합니다.

#### `enableBsdiffPatchSupport`

타입: `boolean` • 경로: `updates.enableBsdiffPatchSupport`

bsdiff를 사용해 bundle diff를 다운로드하고 적용하는 기능을 활성화할지 여부입니다. 기본값은 false입니다.

### `locales`

타입: `object`

Permissions Box 같은 시스템 dialog 프롬프트에 locale별 값을 제공하고, 예를 들어 push notification을 localize할 수 있도록 Localizable.strings 파일을 생성합니다. 플랫폼별 locale 문자열은 `ios`와 `android` 키 아래에 중첩되어야 합니다.

기존 React Native 앱?

iOS 앱에서 언어 및 localization 정보를 추가하거나 변경하려면 Xcode를 사용해야 합니다.

### `plugins`

타입: `array`

프로젝트에 추가 기능을 더하기 위한 config plugin입니다. [자세히 보기](https://docs.expo.dev/guides/config-plugins/).

기존 React Native 앱?

수정 사항을 추가하는 plugin은 [prebuilding](https://expo.fyi/prebuilding)과 managed EAS Build에서만 사용할 수 있습니다.

### `buildCacheProvider`

타입: `undefined`

원격에서 캐시된 build를 다운로드하도록 활성화합니다.

### `ios`

타입: `object`

iOS 플랫폼에만 해당하는 구성입니다.

#### `appleTeamId`

타입: `string` • 경로: `ios.appleTeamId`

모든 네이티브 target에 사용할 Apple development team ID입니다. team ID는 [Apple Developer Portal](https://developer.apple.com/help/account/manage-your-team/locate-your-team-id/)에서 확인할 수 있습니다.

#### `publishManifestPath`

타입: `string` • 경로: `ios.publishManifestPath`

앱의 iOS 버전용 manifest는 publish 중 이 경로에 기록됩니다.

#### `publishBundlePath`

타입: `string` • 경로: `ios.publishBundlePath`

앱의 iOS 버전용 bundle은 publish 중 이 경로에 기록됩니다.

#### `bundleIdentifier`

타입: `string` • 경로: `ios.bundleIdentifier`

iOS standalone 앱의 bundle identifier입니다. 직접 정하면 되지만, App Store에서 고유해야 합니다. [이 StackOverflow 질문](http://stackoverflow.com/questions/11347470/what-does-bundle-identifier-mean-in-the-ios-project)을 참고하세요.

앱의 고유 이름을 나타내는 iOS bundle identifier 표기입니다. 예를 들어 `host.exp.expo`에서 `exp.host`는 도메인이고 `expo`는 앱 이름입니다.

기존 React Native 앱?

이 값은 `info.plist`의 `CFBundleIdentifier` 아래에 설정합니다.

#### `buildNumber`

타입: `string` • 경로: `ios.buildNumber`

iOS standalone 앱의 build number입니다. `CFBundleVersion`에 해당하며 Apple의 [지정 형식](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleversion)과 일치해야 합니다. (참고: Transporter는 `Version Number` 값을 `expo.ios.buildNumber`가 아니라 `expo.version`에서 가져옵니다.)

기존 React Native 앱?

이 값은 `info.plist`의 `CFBundleVersion` 아래에 설정합니다.

#### `backgroundColor`

타입: `string` • 경로: `ios.backgroundColor`

React view 뒤쪽에 표시되는 iOS 앱의 배경색입니다. 상위 레벨의 `backgroundColor` 키가 있으면 이를 덮어씁니다. iOS에서 동작하려면 프로젝트에 `expo-system-ui`가 설치되어 있어야 합니다.

예를 들어 `'#000000'` 같은 6자리 hex 색상 문자열입니다.

#### `scheme`

다음 타입 중 하나:

-   `string` matching the following pattern: `^[a-z][a-z0-9+.-]*$`
`{ "type": "array", "items": { "type": "string", "pattern": "^[a-z][a-z0-9+.-]*$" } }`

iOS 앱으로 연결될 URL scheme입니다. 이 필드에 추가한 scheme은 config 최상위의 `scheme` 키 안 scheme과 병합됩니다.

**소문자** 문자로 시작하고 그 뒤에 **소문자** 문자, 숫자, "+", "." 또는 "-"의 조합이 올 수 있는 문자열입니다.

기존 React Native 앱?

앱 scheme을 변경하려면 `Info.plist`와 `AndroidManifest.xml`에서 이전 scheme이 나타나는 모든 부분을 바꾸세요

#### `icon`

다음 타입 중 하나:

-   `string` matching the following pattern: `\.icon$`
-   `string`
-   다음 속성을 가진 `object`:
    
    ##### `light`
    
    타입: `string` • 경로: `ios.icon.light`
    
    light icon입니다. dark 또는 tinted icon이 사용되지 않거나 제공되지 않은 경우 표시됩니다.
    
    ##### `dark`
    
    타입: `string` • 경로: `ios.icon.dark`
    
    dark icon입니다. 사용자의 시스템 appearance가 dark일 때 앱에 표시됩니다. 자세한 내용은 Apple의 [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/app-icons#iOS-iPadOS)를 참고하세요.
    
    ##### `tinted`
    
    타입: `string` • 경로: `ios.icon.tinted`
    
    tinted icon입니다. 사용자의 시스템 appearance가 tinted일 때 앱에 표시됩니다. 자세한 내용은 Apple의 [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/app-icons#iOS-iPadOS)를 참고하세요.
    

iOS에서 앱 아이콘으로 사용할 이미지의 로컬 경로 또는 원격 URL입니다. 또는 다양한 시스템 appearance(예: dark, tinted)에 따라 다른 아이콘을 지정하는 객체를 제공할 수도 있습니다. `.icon` 디렉터리 경로를 제공할 수도 있습니다. 지정하면 최상위 `icon` 키를 덮어씁니다. 색상 프로파일과 투명도를 포함해 Apple의 아이콘 인터페이스 가이드라인을 따르는 1024x1024 아이콘을 사용하세요.

Expo는 필요한 다른 크기도 자동으로 생성합니다. 이 아이콘은 홈 화면과 Expo Go 앱 안에 표시됩니다.

#### `appStoreUrl`

타입: `string` • 경로: `ios.appStoreUrl`

이미 Apple App Store에 배포했다면 앱의 Apple App Store URL입니다. 앱이 공개 상태일 때 Expo 프로젝트 페이지에서 스토어 페이지로 링크하는 데 사용됩니다.

예시

`"https://apps.apple.com/us/app/expo-client/id982107779"`

#### `bitcode`

타입: `undefined` • 경로: `ios.bitcode`

네이티브 빌드에서 iOS Bitcode 최적화를 활성화합니다. 단일 구성에 대해서만 활성화하고 나머지는 비활성화하기 위해 iOS build configuration 이름(Debug, Release 등)을 받습니다. Expo Go에서는 사용할 수 없습니다. 기본값은 `undefined`이며 템플릿의 미리 정의된 설정을 사용합니다.

#### `config`

타입: `object` • 경로: `ios.config`

참고: 이 속성 키는 production manifest에 포함되지 않으며 `undefined`로 평가됩니다. 내부적으로 빌드 과정에서만 사용되는데, 일부 사용자는 이 안의 API 키를 비공개로 유지하고 싶어하기 때문입니다.

##### `branch`

타입: `object` • 경로: `ios.config.branch`

[Branch](https://branch.io/) linking 서비스를 연결하기 위한 Branch 키입니다.

##### `apiKey`

타입: `string` • 경로: `ios.config.branch.apiKey`

여러분의 Branch API 키입니다.

##### `usesNonExemptEncryption`

타입: `boolean` • 경로: `ios.config.usesNonExemptEncryption`

standalone ipa의 Info.plist에서 `ITSAppUsesNonExemptEncryption`을 주어진 boolean 값으로 설정합니다.

##### `googleMapsApiKey`

타입: `string` • 경로: `ios.config.googleMapsApiKey`

standalone 앱용 [Google Maps iOS SDK](https://developers.google.com/maps/documentation/ios-sdk/start) 키입니다.

##### `googleMobileAdsAppId`

> Deprecated

타입: `string` • 경로: `ios.config.googleMobileAdsAppId`

이 필드는 deprecated되고 제거된 `expo-ads-admob` 패키지에서 사용되던 것입니다. [Google Mobile Ads App ID](https://support.google.com/admob/answer/6232340) Google AdMob App ID입니다.

##### `googleMobileAdsAutoInit`

> Deprecated

타입: `boolean` • 경로: `ios.config.googleMobileAdsAutoInit`

이 필드는 deprecated되고 제거된 `expo-ads-admob` 패키지에서 사용되던 것입니다. 앱이 시작될 때 Google App Measurement를 초기화하고 사용자 수준 이벤트 데이터를 Google로 즉시 전송할지 나타내는 boolean입니다. Expo(Go와 standalone 앱 모두)에서 기본값은 `false`입니다. [주어진 값의 반대값을 `Info.plist`의 다음 키에 설정합니다.](https://developers.google.com/admob/ios/eu-consent#delay_app_measurement_optional)

#### `googleServicesFile`

타입: `string` • 경로: `ios.googleServicesFile`

Firebase 구성을 위한 `GoogleService-Info.plist` 파일의 위치입니다. [Firebase Configuration File](https://support.google.com/firebase/answer/7015592)

#### `supportsTablet`

타입: `boolean` • 경로: `ios.supportsTablet`

standalone iOS 앱이 tablet 화면 크기를 지원하는지 여부입니다. 기본값은 `false`입니다.

기존 React Native 앱?

이 값은 `info.plist`의 `UISupportedInterfaceOrientations~ipad` 아래에 설정합니다.

#### `isTabletOnly`

타입: `boolean` • 경로: `ios.isTabletOnly`

true이면 standalone iOS 앱이 handset을 지원하지 않고 tablet만 지원함을 나타냅니다.

기존 React Native 앱?

이 값은 `info.plist`의 `UISupportedInterfaceOrientations` 아래에 설정합니다.

#### `requireFullScreen`

타입: `boolean` • 경로: `ios.requireFullScreen`

true이면 standalone iOS 앱이 iPad의 Slide Over와 Split View를 지원하지 않음을 나타냅니다. 기본값은 `false`입니다.

기존 React Native 앱?

Xcode를 사용해 `UIRequiresFullScreen`을 설정하세요

#### `userInterfaceStyle`

타입: `enum` • 다음 중 하나: `light`, `dark`, `automatic` • 경로: `ios.userInterfaceStyle`

"dark mode" 같은 light 또는 dark 사용자 인터페이스 외형을 앱에 강제 적용하거나, 시스템 설정에 자동으로 맞추도록 구성합니다. 제공하지 않으면 기본값은 `light`입니다.

#### `infoPlist`

타입: `object` • 경로: `ios.infoPlist`

standalone 앱의 네이티브 Info.plist에 추가할 임의 구성 딕셔너리입니다. 다른 모든 Expo 전용 구성보다 먼저 적용됩니다. 별도의 검증은 수행되지 않으므로 App Store 심사 거절 위험을 감수하고 사용해야 합니다.

#### `entitlements`

타입: `object` • 경로: `ios.entitlements`

standalone 앱의 네이티브 \*.entitlements(plist)에 추가할 임의 구성 딕셔너리입니다. 다른 모든 Expo 전용 구성보다 먼저 적용됩니다. 별도의 검증은 수행되지 않으므로 App Store 심사 거절 위험을 감수하고 사용해야 합니다.

#### `privacyManifests`

타입: `object` • 경로: `ios.privacyManifests`

앱의 네이티브 PrivacyInfo.xcprivacy 파일에 추가할 privacy manifest 정의 딕셔너리입니다. [자세히 보기](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files)

##### `NSPrivacyAccessedAPITypes`

타입: `array` • 경로: `ios.privacyManifests.NSPrivacyAccessedAPITypes`

앱이 제한된 API category를 사용하는 이유를 설명하는 required reason 목록입니다. [자세히 보기](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api)

##### `NSPrivacyAccessedAPIType`

타입: `string` • 경로: `ios.privacyManifests.NSPrivacyAccessedAPITypes.NSPrivacyAccessedAPIType`

앱이 사용하는 required reason API category를 식별하는 문자열입니다.

##### `NSPrivacyAccessedAPITypeReasons`

타입: `array` • 경로: `ios.privacyManifests.NSPrivacyAccessedAPITypes.NSPrivacyAccessedAPITypeReasons`

특정 category에 대한 reason 목록입니다.

##### `NSPrivacyTrackingDomains`

타입: `array` • 경로: `ios.privacyManifests.NSPrivacyTrackingDomains`

앱이 tracking에 사용하는 domain 목록입니다.

##### `NSPrivacyTracking`

타입: `boolean` • 경로: `ios.privacyManifests.NSPrivacyTracking`

앱 또는 서드파티 SDK가 tracking 목적으로 데이터를 사용하는지 여부를 나타내는 Boolean입니다.

##### `NSPrivacyCollectedDataTypes`

타입: `array` • 경로: `ios.privacyManifests.NSPrivacyCollectedDataTypes`

앱이 사용하는 수집 데이터 유형 목록입니다.

##### `NSPrivacyCollectedDataType`

타입: `string` • 경로: `ios.privacyManifests.NSPrivacyCollectedDataTypes.NSPrivacyCollectedDataType`

##### `NSPrivacyCollectedDataTypeLinked`

타입: `boolean` • 경로: `ios.privacyManifests.NSPrivacyCollectedDataTypes.NSPrivacyCollectedDataTypeLinked`

##### `NSPrivacyCollectedDataTypeTracking`

타입: `boolean` • 경로: `ios.privacyManifests.NSPrivacyCollectedDataTypes.NSPrivacyCollectedDataTypeTracking`

##### `NSPrivacyCollectedDataTypePurposes`

타입: `array` • 경로: `ios.privacyManifests.NSPrivacyCollectedDataTypes.NSPrivacyCollectedDataTypePurposes`

#### `associatedDomains`

타입: `array` • 경로: `ios.associatedDomains`

standalone 앱의 Associated Domains를 담는 배열입니다. [자세히 보기](https://developer.apple.com/documentation/safariservices/supporting_associated_domains).

항목은 `applinks:<fully qualified domain>[:port number]` 형식을 따라야 합니다. [자세히 보기](https://developer.apple.com/documentation/safariservices/supporting_associated_domains).

기존 React Native 앱?

EAS로 빌드하거나, Xcode를 사용해 이 capability를 수동으로 활성화하세요. [자세히 보기](https://developer.apple.com/documentation/safariservices/supporting_associated_domains).

#### `usesIcloudStorage`

타입: `boolean` • 경로: `ios.usesIcloudStorage`

앱이 `DocumentPicker`용 iCloud Storage를 사용하는지 나타내는 boolean입니다. 자세한 내용은 `DocumentPicker` 문서를 참고하세요.

기존 React Native 앱?

이를 구성하려면 Xcode 또는 ios.entitlements를 사용하세요.

#### `usesAppleSignIn`

타입: `boolean` • 경로: `ios.usesAppleSignIn`

앱이 Apple Sign-In을 사용하는지 나타내는 boolean입니다. 자세한 내용은 `AppleAuthentication` 문서를 참고하세요.

#### `usesBroadcastPushNotifications`

타입: `boolean` • 경로: `ios.usesBroadcastPushNotifications`

앱이 Push Notifications capability의 Push Notifications Broadcast 옵션을 사용하는지 나타내는 boolean입니다. true이면 EAS CLI가 capability 동기화 중 이 값을 사용합니다. EAS CLI를 사용하지 않는 경우에는 다른 도구가 이를 처리하지 않는 한 이 구성은 아무 효과가 없으므로, 그런 경우에는 Apple Developer Portal에서 capability를 수동으로 활성화해야 합니다.

#### `accessesContactNotes`

타입: `boolean` • 경로: `ios.accessesContactNotes`

앱이 연락처에 저장된 note에 접근할 수 있는지 여부를 나타내는 Boolean 값입니다. 이 capability를 사용해 앱을 심사에 제출하기 전에 반드시 [Apple의 허가를 받아야 합니다](https://developer.apple.com/documentation/bundleresources/entitlements/com_apple_developer_contacts_notes).

#### `splash`

> Deprecated

타입: `object` • 경로: `ios.splash`

대신 `expo-splash-screen` config plugin을 사용하세요. standalone iOS 앱의 로딩 및 splash screen 구성입니다.

##### `backgroundColor`

타입: `string` • 경로: `ios.splash.backgroundColor`

로딩 화면 배경을 채울 색상입니다.

예를 들어 `'#000000'` 같은 6자리 hex 색상 문자열입니다.

##### `resizeMode`

타입: `enum` • 다음 중 하나: `cover`, `contain` • 경로: `ios.splash.resizeMode`

로딩 splash screen에서 `image`가 어떻게 표시될지 결정합니다. `cover` 또는 `contain` 중 하나여야 하며, 기본값은 `contain`입니다.

##### `image`

타입: `string` • 경로: `ios.splash.image`

로딩 화면 배경을 채울 이미지의 로컬 경로 또는 원격 URL입니다. 이미지 크기와 종횡비는 자유입니다. `.png`여야 합니다.

##### `tabletImage`

타입: `string` • 경로: `ios.splash.tabletImage`

로딩 화면 배경을 채울 이미지의 로컬 경로 또는 원격 URL입니다. 이미지 크기와 종횡비는 자유입니다. `.png`여야 합니다.

##### `dark`

타입: `object` • 경로: `ios.splash.dark`

dark mode에서 standalone iOS 앱의 로딩 및 splash screen 구성입니다.

##### `backgroundColor`

타입: `string` • 경로: `ios.splash.dark.backgroundColor`

로딩 화면 배경을 채울 색상입니다.

예를 들어 `'#000000'` 같은 6자리 hex 색상 문자열입니다.

##### `resizeMode`

타입: `enum` • 다음 중 하나: `cover`, `contain` • 경로: `ios.splash.dark.resizeMode`

로딩 splash screen에서 `image`가 어떻게 표시될지 결정합니다. `cover` 또는 `contain` 중 하나여야 하며, 기본값은 `contain`입니다.

##### `image`

타입: `string` • 경로: `ios.splash.dark.image`

로딩 화면 배경을 채울 이미지의 로컬 경로 또는 원격 URL입니다. 이미지 크기와 종횡비는 자유입니다. `.png`여야 합니다.

##### `tabletImage`

타입: `string` • 경로: `ios.splash.dark.tabletImage`

로딩 화면 배경을 채울 이미지의 로컬 경로 또는 원격 URL입니다. 이미지 크기와 종횡비는 자유입니다. `.png`여야 합니다.

#### `runtimeVersion`

다음 타입 중 하나:

-   `string` matching the following pattern: `^[a-zA-Z\d][a-zA-Z\d._+()-]{0,254}$`
-   `string` matching the following pattern: `^exposdk:((\d+\.\d+\.\d+)|(UNVERSIONED))$`
-   다음 속성을 가진 `object`:
    
    ##### `policy`
    
    타입: `enum` • 경로: `ios.runtimeVersion.policy`
    
    유효한 값: `nativeVersion`, `sdkVersion`, `appVersion`, `fingerprint`.
    

iOS 플랫폼용 iOS build의 네이티브 코드와 OTA update 사이의 호환성을 나타내는 속성입니다. 제공되면 iOS에서 최상위 `runtimeVersion` 키의 값을 덮어씁니다.

#### `version`

타입: `string` • 경로: `ios.version`

iOS 앱 버전입니다. 루트 `version` 필드보다 우선합니다. 이 필드 외에도 `ios.buildNumber`를 함께 사용합니다. 앱 버전 관리 방법은 [여기](https://docs.expo.dev/distribution/app-stores/#versioning-your-app)에서 더 읽어보세요. 이는 `CFBundleShortVersionString`에 해당합니다. 필요한 형식은 [여기](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleshortversionstring)에서 확인할 수 있습니다.

기존 React Native 앱?

앱 버전을 변경하려면 Xcode의 'Version' 필드를 수정하세요\`

### `android`

타입: `object`

Android 플랫폼에만 해당하는 구성입니다.

#### `publishManifestPath`

타입: `string` • 경로: `android.publishManifestPath`

앱의 Android 버전용 manifest는 publish 중 이 경로에 기록됩니다.

#### `publishBundlePath`

타입: `string` • 경로: `android.publishBundlePath`

앱의 Android 버전용 bundle은 publish 중 이 경로에 기록됩니다.

#### `package`

타입: `string` • 경로: `android.package`

Android standalone 앱의 package 이름입니다. 직접 정하면 되지만, Play Store에서 고유해야 합니다. [이 StackOverflow 질문](http://stackoverflow.com/questions/6273892/android-package-name-convention)을 참고하세요.

앱의 고유 이름을 나타내는 Reverse DNS 표기법입니다. 유효한 Android Application ID여야 합니다. 예를 들어 `com.example.app`에서 `com.example`은 도메인이고 `app`은 앱 이름입니다. 이름은 마침표(.)로 구분된 소문자와 대문자(a-z, A-Z), 숫자(0-9), 밑줄(_)만 포함할 수 있습니다. 이름의 각 구성 요소는 소문자로 시작해야 합니다.

기존 React Native 앱?

이는 `android/app/build.gradle`의 `applicationId`와 `AndroidManifest.xml` 파일의 여러 위치에 설정됩니다.

#### `versionCode`

타입: `integer` • 경로: `android.versionCode`

Google Play에서 요구하는 버전 번호입니다. 릴리스할 때마다 1씩 증가시켜야 합니다. 양의 정수여야 합니다. [자세히 보기](https://developer.android.com/studio/publish/versioning.html)

기존 React Native 앱?

이는 `android/app/build.gradle`의 `versionCode`로 설정됩니다.

#### `backgroundColor`

타입: `string` • 경로: `android.backgroundColor`

React view 뒤쪽에 표시되는 Android 앱의 배경색입니다. 상위 레벨의 `backgroundColor` 키가 있으면 이를 덮어씁니다.

예를 들어 `'#000000'` 같은 6자리 hex 색상 문자열입니다.

기존 React Native 앱?

이는 `android/app/src/main/AndroidManifest.xml`의 `android:windowBackground` 아래에 설정됩니다.

#### `userInterfaceStyle`

타입: `enum` • 다음 중 하나: `light`, `dark`, `automatic` • 경로: `android.userInterfaceStyle`

"dark mode" 같은 light 또는 dark 사용자 인터페이스 외형을 앱에 강제 적용하거나, 시스템 설정에 자동으로 맞추도록 구성합니다. 제공하지 않으면 기본값은 `light`입니다. Android에서 동작하려면 프로젝트에 `expo-system-ui`가 설치되어 있어야 합니다.

#### `scheme`

다음 타입 중 하나:

-   `string` matching the following pattern: `^[a-z][a-z0-9+.-]*$`
`{ "type": "array", "items": { "type": "string", "pattern": "^[a-z][a-z0-9+.-]*$" } }`

Android 앱으로 연결될 URL scheme입니다. 이 필드에 추가한 scheme은 config 최상위의 `scheme` 키 안 scheme과 병합됩니다.

**소문자** 문자로 시작하고 그 뒤에 **소문자** 문자, 숫자, "+", "." 또는 "-"의 조합이 올 수 있는 문자열입니다.

기존 React Native 앱?

앱 scheme을 변경하려면 `Info.plist`와 `AndroidManifest.xml`에서 이전 scheme이 나타나는 모든 부분을 바꾸세요

#### `icon`

타입: `string` • 경로: `android.icon`

Android에서 앱 아이콘으로 사용할 이미지의 로컬 경로 또는 원격 URL입니다. 지정하면 최상위 `icon` 키를 덮어씁니다. 1024x1024 png 파일 사용을 권장합니다(Google Play Store를 위해 투명도 권장). 이 아이콘은 홈 화면과 Expo Go 앱 안에 표시됩니다.

#### `adaptiveIcon`

타입: `object` • 경로: `android.adaptiveIcon`

Android의 Adaptive Launcher Icon 설정입니다. [자세히 보기](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive)

##### `foregroundImage`

타입: `string` • 경로: `android.adaptiveIcon.foregroundImage`

Android에서 앱 아이콘으로 사용할 이미지의 로컬 경로 또는 원격 URL입니다. 지정하면 최상위 `icon`과 `android.icon` 키를 덮어씁니다. [명시된 가이드라인](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive)을 따라야 합니다. 이 아이콘은 홈 화면에 표시됩니다.

##### `monochromeImage`

타입: `string` • 경로: `android.adaptiveIcon.monochromeImage`

Android 13+ 단색 아이콘을 나타내는 이미지의 로컬 경로 또는 원격 URL입니다. [명시된 가이드라인](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive)을 따라야 합니다. 이 아이콘은 Android 13+ device에서 사용자가 시스템 설정의 'Themed icons'를 활성화했을 때 홈 화면에 표시됩니다.

##### `backgroundImage`

타입: `string` • 경로: `android.adaptiveIcon.backgroundImage`

Android의 Adaptive Icon 배경 이미지의 로컬 경로 또는 원격 URL입니다. 지정하면 `backgroundColor` 키를 덮어씁니다. `foregroundImage`와 같은 크기여야 하며, `foregroundImage`가 지정되지 않으면 아무 효과가 없습니다. [명시된 가이드라인](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive)을 따라야 합니다.

##### `backgroundColor`

타입: `string` • 경로: `android.adaptiveIcon.backgroundColor`

Android의 Adaptive Icon 배경으로 사용할 색상입니다. 기본값은 흰색 `#FFFFFF`입니다. `foregroundImage`가 지정되지 않으면 아무 효과가 없습니다.

예를 들어 `'#000000'` 같은 6자리 hex 색상 문자열입니다.

#### `playStoreUrl`

타입: `string` • 경로: `android.playStoreUrl`

이미 Google Play Store에 배포했다면 앱의 Google Play Store URL입니다. 앱이 공개 상태일 때 Expo 프로젝트 페이지에서 스토어 페이지로 링크하는 데 사용됩니다.

예시

`"https://play.google.com/store/apps/details?id=host.exp.exponent"`

#### `permissions`

타입: `array` • 경로: `android.permissions`

prebuild 중 앱의 `AndroidManifest.xml`에 추가할 permission 목록입니다. 예: `['android.permission.SCHEDULE_EXACT_ALARM']`

기존 React Native 앱?

앱이 요청하는 permission을 변경하려면 `AndroidManifest.xml`을 직접 수정하세요. 특정 permission 요청을 막으려면(설치된 네이티브 패키지를 통해 자동으로 추가되는 경우가 있을 수 있음), `AndroidManifest.xml`에 해당 permission을 `tools:node="remove"` 태그와 함께 추가하세요.

#### `blockedPermissions`

타입: `array` • 경로: `android.blockedPermissions`

최종 `AndroidManifest.xml`에서 차단할 permission 목록입니다. 이는 네이티브 패키지의 `AndroidManifest.xml` 파일에서 추가되어 최종 manifest에 병합되는 permission을 제거하는 데 유용합니다. 내부적으로 이 기능은 permission을 제거하기 위해 `tools:node="remove"` XML 속성을 사용합니다. Expo Go에서는 사용할 수 없습니다.

#### `googleServicesFile`

타입: `string` • 경로: `android.googleServicesFile`

Firebase 구성을 위한 `google-services.json` 파일의 위치입니다. [Firebase Configuration File](https://support.google.com/firebase/answer/7015592) 이 키를 포함하면 standalone 앱에서 FCM이 자동으로 활성화됩니다.

기존 React Native 앱?

파일을 `android/app/google-services.json`에 직접 추가하거나 수정하세요

#### `config`

타입: `object` • 경로: `android.config`

참고: 이 속성 키는 production manifest에 포함되지 않으며 `undefined`로 평가됩니다. 내부적으로 빌드 과정에서만 사용되는데, 일부 사용자는 이 안의 API 키를 비공개로 유지하고 싶어하기 때문입니다.

##### `branch`

타입: `object` • 경로: `android.config.branch`

[Branch](https://branch.io/) linking 서비스를 연결하기 위한 Branch 키입니다.

##### `apiKey`

타입: `string` • 경로: `android.config.branch.apiKey`

여러분의 Branch API 키입니다.

##### `googleMaps`

타입: `object` • 경로: `android.config.googleMaps`

standalone 앱용 [Google Maps Android SDK](https://developers.google.com/maps/documentation/android-api/signup) 구성입니다.

##### `apiKey`

타입: `string` • 경로: `android.config.googleMaps.apiKey`

여러분의 Google Maps Android SDK API 키입니다.

##### `googleMobileAdsAppId`

> Deprecated

타입: `string` • 경로: `android.config.googleMobileAdsAppId`

이 필드는 deprecated되고 제거된 `expo-ads-admob` 패키지에서 사용되던 것입니다. [Google Mobile Ads App ID](https://support.google.com/admob/answer/6232340) Google AdMob App ID입니다.

##### `googleMobileAdsAutoInit`

> Deprecated

타입: `boolean` • 경로: `android.config.googleMobileAdsAutoInit`

이 필드는 deprecated되고 제거된 `expo-ads-admob` 패키지에서 사용되던 것입니다. 앱이 시작될 때 Google App Measurement를 초기화하고 사용자 수준 이벤트 데이터를 Google로 즉시 전송할지 나타내는 boolean입니다. Expo(Client와 standalone 앱 모두)에서 기본값은 `false`입니다. [주어진 값의 반대값을 `Info.plist`의 다음 키에 설정합니다](https://developers.google.com/admob/ios/eu-consent#delay_app_measurement_optional)

#### `splash`

> Deprecated

타입: `object` • 경로: `android.splash`

대신 `expo-splash-screen` config plugin을 사용하세요. managed 및 standalone Android 앱의 로딩 및 splash screen 구성입니다.

##### `backgroundColor`

타입: `string` • 경로: `android.splash.backgroundColor`

로딩 화면 배경을 채울 색상입니다.

예를 들어 `'#000000'` 같은 6자리 hex 색상 문자열입니다.

##### `resizeMode`

타입: `enum` • 다음 중 하나: `cover`, `contain`, `native` • 경로: `android.splash.resizeMode`

로딩 splash screen에서 `image`가 어떻게 표시될지 결정합니다. `cover`, `contain`, `native` 중 하나여야 하며, 기본값은 `contain`입니다.

##### `image`

타입: `string` • 경로: `android.splash.image`

로딩 화면 배경을 채울 이미지의 로컬 경로 또는 원격 URL입니다. 이미지 크기와 종횡비는 자유입니다. `.png`여야 합니다.

##### `mdpi`

타입: `string` • 경로: `android.splash.mdpi`

"native" 모드에서 로딩 화면 배경을 채울 이미지의 로컬 경로 또는 원격 URL입니다. 이미지 크기와 종횡비는 자유입니다. [자세히 보기](https://developer.android.com/training/multiscreen/screendensities)

`자연 크기 이미지 (baseline)`

##### `hdpi`

타입: `string` • 경로: `android.splash.hdpi`

"native" 모드에서 로딩 화면 배경을 채울 이미지의 로컬 경로 또는 원격 URL입니다. 이미지 크기와 종횡비는 자유입니다. [자세히 보기](https://developer.android.com/training/multiscreen/screendensities)

`1.5배 스케일`

##### `xhdpi`

타입: `string` • 경로: `android.splash.xhdpi`

"native" 모드에서 로딩 화면 배경을 채울 이미지의 로컬 경로 또는 원격 URL입니다. 이미지 크기와 종횡비는 자유입니다. [자세히 보기](https://developer.android.com/training/multiscreen/screendensities)

`2배 스케일`

##### `xxhdpi`

타입: `string` • 경로: `android.splash.xxhdpi`

"native" 모드에서 로딩 화면 배경을 채울 이미지의 로컬 경로 또는 원격 URL입니다. 이미지 크기와 종횡비는 자유입니다. [자세히 보기](https://developer.android.com/training/multiscreen/screendensities)

`3배 스케일`

##### `xxxhdpi`

타입: `string` • 경로: `android.splash.xxxhdpi`

"native" 모드에서 로딩 화면 배경을 채울 이미지의 로컬 경로 또는 원격 URL입니다. 이미지 크기와 종횡비는 자유입니다. [자세히 보기](https://developer.android.com/training/multiscreen/screendensities)

`4배 스케일`

##### `dark`

타입: `object` • 경로: `android.splash.dark`

dark mode에서 managed 및 standalone Android 앱의 로딩 및 splash screen 구성입니다.

##### `backgroundColor`

타입: `string` • 경로: `android.splash.dark.backgroundColor`

로딩 화면 배경을 채울 색상입니다.

예를 들어 `'#000000'` 같은 6자리 hex 색상 문자열입니다.

##### `resizeMode`

타입: `enum` • 다음 중 하나: `cover`, `contain`, `native` • 경로: `android.splash.dark.resizeMode`

로딩 splash screen에서 `image`가 어떻게 표시될지 결정합니다. `cover`, `contain`, `native` 중 하나여야 하며, 기본값은 `contain`입니다.

##### `image`

타입: `string` • 경로: `android.splash.dark.image`

로딩 화면 배경을 채울 이미지의 로컬 경로 또는 원격 URL입니다. 이미지 크기와 종횡비는 자유입니다. `.png`여야 합니다.

##### `mdpi`

타입: `string` • 경로: `android.splash.dark.mdpi`

"native" 모드에서 로딩 화면 배경을 채울 이미지의 로컬 경로 또는 원격 URL입니다. 이미지 크기와 종횡비는 자유입니다. [자세히 보기](https://developer.android.com/training/multiscreen/screendensities)

`자연 크기 이미지 (baseline)`

##### `hdpi`

타입: `string` • 경로: `android.splash.dark.hdpi`

"native" 모드에서 로딩 화면 배경을 채울 이미지의 로컬 경로 또는 원격 URL입니다. 이미지 크기와 종횡비는 자유입니다. [자세히 보기](https://developer.android.com/training/multiscreen/screendensities)

`1.5배 스케일`

##### `xhdpi`

타입: `string` • 경로: `android.splash.dark.xhdpi`

"native" 모드에서 로딩 화면 배경을 채울 이미지의 로컬 경로 또는 원격 URL입니다. 이미지 크기와 종횡비는 자유입니다. [자세히 보기](https://developer.android.com/training/multiscreen/screendensities)

`2배 스케일`

##### `xxhdpi`

타입: `string` • 경로: `android.splash.dark.xxhdpi`

"native" 모드에서 로딩 화면 배경을 채울 이미지의 로컬 경로 또는 원격 URL입니다. 이미지 크기와 종횡비는 자유입니다. [자세히 보기](https://developer.android.com/training/multiscreen/screendensities)

`3배 스케일`

##### `xxxhdpi`

타입: `string` • 경로: `android.splash.dark.xxxhdpi`

"native" 모드에서 로딩 화면 배경을 채울 이미지의 로컬 경로 또는 원격 URL입니다. 이미지 크기와 종횡비는 자유입니다. [자세히 보기](https://developer.android.com/training/multiscreen/screendensities)

`4배 스케일`

#### `intentFilters`

타입: `array` • 경로: `android.intentFilters`

Android manifest에서 사용자 지정 intent filter 배열을 설정하기 위한 구성입니다. [자세히 보기](https://developer.android.com/guide/components/intents-filters)

기존 React Native 앱?

이는 `AndroidManifest.xml`에 직접 설정합니다. [자세히 보기.](https://developer.android.com/guide/components/intents-filters)

예시

`[ { "autoVerify": true, "action": "VIEW", "data": { "scheme": "https", "host": "*.example.com" }, "category": [ "BROWSABLE", "DEFAULT" ] } ]`

##### `autoVerify`

타입: `boolean` • 경로: `android.intentFilters.autoVerify`

intent filter를 사용해 앱을 링크의 기본 처리기로 설정할 수도 있습니다(사용자에게 옵션 dialog를 보여주지 않음). 이를 위해 `true`를 사용한 뒤, 해당 domain을 소유하고 있음을 검증하는 JSON 파일을 서버에서 제공하도록 구성하세요. [자세히 보기](https://developer.android.com/training/app-links)

##### `action`

타입: `string` • 경로: `android.intentFilters.action`

##### `data`

타입: `undefined` • 경로: `android.intentFilters.data`

##### `category`

타입: `undefined` • 경로: `android.intentFilters.category`

#### `allowBackup`

타입: `boolean` • 경로: `android.allowBackup`

사용자의 앱 데이터를 Google Drive에 자동으로 백업하도록 허용합니다. false로 설정하면 앱에 대한 백업과 복원이 절대 수행되지 않습니다(민감한 정보를 다루는 앱에 유용합니다). 기본값은 Android 기본값인 `true`입니다.

#### `softwareKeyboardLayoutMode`

타입: `enum` • 다음 중 하나: `resize`, `pan` • 경로: `android.softwareKeyboardLayoutMode`

소프트웨어 keyboard가 애플리케이션 레이아웃에 어떤 영향을 줄지 결정합니다. 이는 `android:windowSoftInputMode` 속성에 매핑됩니다. 기본값은 `resize`입니다. 유효한 값: `resize`, `pan`.

#### `runtimeVersion`

다음 타입 중 하나:

-   `string` matching the following pattern: `^[a-zA-Z\d][a-zA-Z\d._+()-]{0,254}$`
-   `string` matching the following pattern: `^exposdk:((\d+\.\d+\.\d+)|(UNVERSIONED))$`
-   다음 속성을 가진 `object`:
    
    ##### `policy`
    
    타입: `enum` • 경로: `android.runtimeVersion.policy`
    
    유효한 값: `nativeVersion`, `sdkVersion`, `appVersion`, `fingerprint`.
    

Android 플랫폼용 Android build의 네이티브 코드와 OTA update 사이의 호환성을 나타내는 속성입니다. 제공되면 Android에서 최상위 `runtimeVersion` 키의 값을 덮어씁니다.

#### `version`

타입: `string` • 경로: `android.version`

Android 앱 버전입니다. 루트 `version` 필드보다 우선합니다. 이 필드 외에도 `android.versionCode`를 함께 사용합니다. 앱 버전 관리 방법은 [여기](https://docs.expo.dev/distribution/app-stores/#versioning-your-app)에서 더 읽어보세요. 이는 `versionName`에 해당합니다. 필요한 형식은 [여기](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleshortversionstring)에서 확인할 수 있습니다.

기존 React Native 앱?

앱 버전을 변경하려면 `android/app/build.gradle`의 `versionName` 문자열을 수정하세요

#### `predictiveBackGestureEnabled`

타입: `boolean` • 경로: `android.predictiveBackGestureEnabled`

Android 13(API level 33) 이상에서 앱이 [predictive back gesture](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture)를 사용할 수 있게 합니다. 기본값은 false입니다.

기존 React Native 앱?

설정을 변경하려면 `AndroidManifest.xml`의 `android:enableOnBackInvokedCallback` 값을 업데이트하세요.

### `web`

타입: `object`

웹 플랫폼에만 해당하는 구성입니다.

#### `output`

타입: `enum` • 다음 중 하나: `single`, `static`, `server` • 경로: `web.output`

웹 앱의 export 방식을 `expo start`와 `expo export` 모두에 대해 설정합니다. `static`은 `app/` 디렉터리의 모든 route에 대해 HTML 파일을 정적으로 렌더링하며, Expo Router 앱에서만 사용할 수 있습니다. `single`은 출력 폴더 안에 단일 `index.html`만 가진 Single Page Application(SPA)을 출력하며, 정적으로 인덱싱 가능한 HTML은 없습니다. `server`는 사용자 지정 Node.js 서버로 호스팅하기 위한 static HTML과 API Routes를 출력합니다. 기본값은 `single`입니다.

#### `favicon`

타입: `string` • 경로: `web.favicon`

앱의 favicon으로 사용할 이미지의 상대 경로입니다.

#### `name`

타입: `string` • 경로: `web.name`

문서의 title을 정의하며, 기본값은 바깥 레벨의 name입니다.

#### `shortName`

타입: `string` • 경로: `web.shortName`

앱 이름의 짧은 버전으로, 12자 이하입니다. 앱 launcher와 새 탭 페이지에서 사용됩니다. PWA manifest.json의 `short_name`에 매핑됩니다. 기본값은 `name` 속성입니다.

최대 12자 길이입니다.

#### `lang`

타입: `string` • 경로: `web.lang`

name과 short_name 멤버 값에 대한 기본 언어를 지정합니다. 이 값은 하나의 language tag를 담은 문자열입니다.

#### `scope`

타입: `string` • 경로: `web.scope`

이 website context의 navigation scope를 정의합니다. 이는 manifest가 적용된 동안 어떤 웹 페이지를 볼 수 있는지를 제한합니다. 사용자가 scope 밖으로 이동하면 브라우저 탭/창 안의 일반 웹 페이지로 돌아갑니다. scope가 상대 URL이면 기준 URL은 manifest의 URL이 됩니다.

#### `themeColor`

타입: `string` • 경로: `web.themeColor`

Android toolbar의 색상을 정의하며, task switcher의 앱 preview에도 반영될 수 있습니다.

예를 들어 `'#000000'` 같은 6자리 hex 색상 문자열입니다.

#### `description`

타입: `string` • 경로: `web.description`

고정된 website가 어떤 기능을 하는지에 대한 일반적인 설명을 제공합니다.

#### `dir`

타입: `enum` • 다음 중 하나: `auto`, `ltr`, `rtl` • 경로: `web.dir`

name, short_name, description 멤버에 대한 기본 텍스트 방향을 지정합니다. lang 멤버와 함께 오른쪽에서 왼쪽으로 쓰는 언어를 올바르게 표시하는 데 도움을 줍니다.

#### `display`

타입: `enum` • 다음 중 하나: `fullscreen`, `standalone`, `minimal-ui`, `browser` • 경로: `web.display`

웹사이트에 대해 개발자가 선호하는 표시 모드를 정의합니다.

#### `startUrl`

타입: `string` • 경로: `web.startUrl`

사용자가 애플리케이션을 실행할 때(예: 홈 화면에 추가 후) 로드되는 URL이며, 보통은 index입니다. 참고: 이는 manifest URL에 대한 상대 URL이어야 합니다.

#### `orientation`

타입: `enum` • 다음 중 하나: `any`, `natural`, `landscape`, `landscape-primary`, `landscape-secondary`, `portrait`, `portrait-primary`, `portrait-secondary` • 경로: `web.orientation`

website의 모든 최상위 browsing context에 대한 기본 orientation을 정의합니다.

#### `backgroundColor`

타입: `string` • 경로: `web.backgroundColor`

website에 대해 기대되는 “배경색”을 정의합니다. 이 값은 사이트의 CSS에도 이미 존재하지만, stylesheet가 로드되기 전에 manifest를 사용할 수 있는 경우 브라우저가 shortcut의 배경색을 그리는 데 사용할 수 있습니다. 이를 통해 웹 애플리케이션을 실행하는 순간과 사이트 콘텐츠를 로드하는 순간 사이의 전환이 더 부드러워집니다.

예를 들어 `'#000000'` 같은 6자리 hex 색상 문자열입니다.

#### `barStyle`

타입: `enum` • 다음 중 하나: `default`, `black`, `black-translucent` • 경로: `web.barStyle`

content가 default로 설정되면 status bar는 일반적으로 표시됩니다. black으로 설정하면 status bar는 검은 배경을 갖습니다. black-translucent로 설정하면 status bar는 검고 반투명합니다. default 또는 black이면 웹 콘텐츠가 status bar 아래에 표시됩니다. black-translucent이면 웹 콘텐츠가 전체 화면에 표시되지만 status bar에 일부 가려집니다.

#### `preferRelatedApplications`

타입: `boolean` • 경로: `web.preferRelatedApplications`

사용자 에이전트가 사용자에게 특정 네이티브 애플리케이션(expo.ios와 expo.android에 정의됨)이 website보다 더 권장된다고 표시하도록 힌트를 줍니다.

#### `dangerous`

타입: `object` • 경로: `web.dangerous`

실험적 기능입니다. deprecation 공지 없이 깨질 수 있습니다.

#### `splash`

타입: `object` • 경로: `web.splash`

PWA splash screen 구성입니다.

기존 React Native 앱?

[expo-splash-screen](https://github.com/expo/expo/tree/main/packages/expo-splash-screen#expo-splash-screen)을 사용하세요

##### `backgroundColor`

타입: `string` • 경로: `web.splash.backgroundColor`

로딩 화면 배경을 채울 색상입니다.

예를 들어 `'#000000'` 같은 6자리 hex 색상 문자열입니다.

##### `resizeMode`

타입: `enum` • 다음 중 하나: `cover`, `contain` • 경로: `web.splash.resizeMode`

로딩 splash screen에서 `image`가 어떻게 표시될지 결정합니다. `cover` 또는 `contain` 중 하나여야 하며, 기본값은 `contain`입니다.

##### `image`

타입: `string` • 경로: `web.splash.image`

로딩 화면 배경을 채울 이미지의 로컬 경로 또는 원격 URL입니다. 이미지 크기와 종횡비는 자유입니다. `.png`여야 합니다.

#### `config`

타입: `object` • 경로: `web.config`

Firebase 웹 구성입니다. web과 native 모두에서 expo-firebase 패키지가 사용합니다. [자세히 보기](https://firebase.google.com/docs/reference/js/firebase.html#initializeapp)

##### `firebase`

타입: `object` • 경로: `web.config.firebase`

##### `apiKey`

타입: `string` • 경로: `web.config.firebase.apiKey`

##### `authDomain`

타입: `string` • 경로: `web.config.firebase.authDomain`

##### `databaseURL`

타입: `string` • 경로: `web.config.firebase.databaseURL`

##### `projectId`

타입: `string` • 경로: `web.config.firebase.projectId`

##### `storageBucket`

타입: `string` • 경로: `web.config.firebase.storageBucket`

##### `messagingSenderId`

타입: `string` • 경로: `web.config.firebase.messagingSenderId`

##### `appId`

타입: `string` • 경로: `web.config.firebase.appId`

##### `measurementId`

타입: `string` • 경로: `web.config.firebase.measurementId`

#### `bundler`

타입: `enum` • 다음 중 하나: `webpack`, `metro` • 경로: `web.bundler`

웹 플랫폼에서 사용할 bundler를 설정합니다. 로컬 CLI `npx expo`에서만 지원됩니다. `@expo/webpack-config` 패키지가 설치되어 있으면 기본값은 `webpack`, 그렇지 않으면 `metro`입니다.

### `experiments`

타입: `object`

불안정하거나, 지원되지 않거나, deprecation 공지 없이 제거될 수 있는 실험적 기능을 활성화합니다.

#### `autolinkingModuleResolution`

타입: `boolean` • 경로: `experiments.autolinkingModuleResolution`

Expo Autolinking의 검색 결과를 Metro의 모듈 해석에 적용합니다. 이렇게 하면 앱을 번들링할 때 프로젝트의 `react`, `react-dom`, `react-native` 의존성과, autolink된 Expo 및 React Native 모듈의 버전이 강제로 해석됩니다. 이는 버전 불일치를 방지하며 monorepo와 충돌 방지에 유용합니다.

#### `baseUrl`

타입: `string` • 경로: `experiments.baseUrl`

domain의 하위 경로를 기준으로 website를 export합니다. 이 경로는 번들된 모든 리소스 링크 앞에 있는 그대로 붙습니다. 서버 루트를 기준으로 모든 리소스를 로드하려면 경로를 `/`로 시작하세요(권장). 경로가 `/`로 시작하지 않으면 리소스는 이를 요청한 코드 기준 상대 경로로 로드되므로 예상치 못한 동작을 유발할 수 있습니다. 예시: '/subpath'. 기본값은 ''(빈 문자열)입니다.

#### `buildCacheProvider`

> Deprecated

타입: `undefined` • 경로: `experiments.buildCacheProvider`

이 필드는 더 이상 실험적 기능으로 표시되지 않으며, 향후 릴리스에서 제거될 예정입니다. 대신 `buildCacheProvider` 필드를 사용하세요.

#### `supportsTVOnly`

타입: `boolean` • 경로: `experiments.supportsTVOnly`

true이면 이 프로젝트가 tablet이나 handset을 지원하지 않고 Apple TV와 Android TV만 지원함을 나타냅니다.

#### `functionalCSS`

타입: `boolean` • 경로: `experiments.functionalCSS`

native 플랫폼에서 React 기반 CSS 지원을 활성화합니다. CSS 속성, class name selector의 일부만 지원하며 cascading은 없습니다.

#### `tsconfigPaths`

타입: `boolean` • 경로: `experiments.tsconfigPaths`

Metro에서 import alias를 위해 tsconfig/jsconfig의 `compilerOptions.paths` 및 `compilerOptions.baseUrl` 지원을 활성화합니다.

#### `typedRoutes`

타입: `boolean` • 경로: `experiments.typedRoutes`

Expo Router에서 정적으로 타입 지정된 link를 지원합니다. 이 기능을 사용하려면 Expo Router v2 프로젝트에 TypeScript가 설정되어 있어야 합니다.

#### `turboModules`

타입: `boolean` • 경로: `experiments.turboModules`

Turbo Modules를 활성화합니다. 이는 JS와 플랫폼 코드 사이 통신 방식이 다른 네이티브 모듈 유형입니다. Turbo Module을 설치할 때는 이 실험 옵션을 활성화해야 합니다(라이브러리가 react-native-reanimated v2처럼 이미 Expo SDK에 포함되어 있어야 함). Turbo Modules는 원격 디버깅을 지원하지 않으며, 이 옵션을 활성화하면 원격 디버깅이 비활성화됩니다.

#### `reactCanary`

타입: `boolean` • 경로: `experiments.reactCanary`

다가오는 기능 테스트를 위해 vendored canary build의 React를 실험적으로 사용합니다.

#### `reactCompiler`

타입: `boolean` • 경로: `experiments.reactCompiler`

React Compiler를 실험적으로 활성화합니다.

#### `reactServerComponentRoutes`

타입: `boolean` • 경로: `experiments.reactServerComponentRoutes`

Expo Router에서 기본적으로 React Server Components와 transition용 concurrent routing을 실험적으로 활성화합니다.

#### `reactServerFunctions`

타입: `boolean` • 경로: `experiments.reactServerFunctions`

Expo CLI와 Expo Router에서 React Server Functions 지원을 실험적으로 활성화합니다.

### `_internal`

타입: `object`

개발자 도구용 내부 속성입니다.

#### `pluginHistory`

타입: `object` • 경로: `_internal.pluginHistory`

config에서 이미 실행된 plugin 목록입니다
