---
modificationDate: March 01, 2026
title: 용어집
description: 문서 전반과 Expo 또는 일반적인 크로스 플랫폼 개발과 관련해 사용되는, 직관적으로 이해하기 어려운 용어 목록입니다.
---

# 용어집

문서 전반과 Expo 또는 일반적인 크로스 플랫폼 개발과 관련해 사용되는, 직관적으로 이해하기 어려운 용어 목록입니다.

### Android

**Android** 기기에서 사용되도록 Google이 후원하는 모바일 운영체제입니다.

### App config

루트 프로젝트 디렉터리에 있는 **app.json**, **app.config.json**, **app.config.js**, 또는 **app.config.ts**라는 이름의 파일입니다. 자세한 내용은 [app config configuration](/workflow/configuration)을 참고하세요.

이 파일은 다음과 같은 용도로 사용됩니다.

-   [Expo CLI](/more/glossary-of-terms#expo-cli)가 어떻게 동작할지 구성합니다.
-   EAS Update에서 프로젝트의 공개 [manifest](/more/glossary-of-terms#manifest)를 생성합니다(네이티브 앱용 **index.html**이라고 생각하면 됩니다).
-   `npx expo prebuild`가 네이티브 코드를 생성하는 방식에 영향을 주는 Expo [config plugins](/more/glossary-of-terms#config-plugin)을 나열합니다.

### app.json

[app config](/more/glossary-of-terms#app-config) 파일입니다.

### Apple capabilities

Apple이 제공하는 클라우드 서비스입니다. 이러한 서비스는 애플리케이션에 대해 [Apple Developer Portal](/more/glossary-of-terms#apple-developer-portal)에서 활성화되어야 합니다.

### Apple Developer Portal

애플리케이션 코드 서명을 관리하기 위한 Apple의 [공식 웹사이트](https://developer.apple.com/)입니다. EAS Credentials는 앱 개발 중 개발자가 이 웹사이트를 방문하게 되는 일반적인 이유 대부분을 자동화해 줍니다.

### Auto capability signing

프로젝트의 entitlements 파일을 기반으로 [Apple capabilities](/more/glossary-of-terms#apple-capabilities)를 자동으로 활성화하거나 비활성화하는 EAS Build 기능입니다. [자세히 알아보기](/build-reference/ios-capabilities).

### Autolinking

네이티브 패키지 매니저를 통해 네이티브 모듈을 네이티브 앱에 자동으로 연결하는 크로스 플랫폼 도구입니다.

-   Android에서는 **android/app/build.gradle**에서 사용되며 [Gradle](/more/glossary-of-terms#gradle) sync 과정 중 실행됩니다.
-   iOS에서는 [CocoaPods](/more/glossary-of-terms#cocoapods)의 **ios/Podfile**에서 사용되며 `pod install` 실행 중 호출됩니다.

Autolinking에는 두 가지 버전이 있습니다. [Expo Autolinking](/more/glossary-of-terms#expo-autolinking)과 [Community Autolinking](/more/glossary-of-terms#community-autolinking)입니다.

기본 [Prebuild template](/more/glossary-of-terms#prebuild-template)에는 [Expo Autolinking](/more/glossary-of-terms#expo-autolinking)과 [Community Autolinking](/more/glossary-of-terms#community-autolinking) 포크에 대한 지원이 포함되어 있습니다.

### Babel

런타임의 [JavaScript engine](/more/glossary-of-terms#javascript-engine)에서 사용할 수 없는 언어 기능을 제거하는 데 사용하는 트랜스파일러입니다. [Metro](/more/glossary-of-terms#metro-bundler)는 내부적으로 Babel을 사용합니다.

프로젝트 디렉터리의 [**babel.config.js**](/versions/latest/config/babel) 파일을 수정하면 Babel 사용 방식을 구성할 수 있습니다. [Expo CLI](/more/glossary-of-terms#expo-cli)를 사용할 때 이 파일은 선택 사항입니다. Expo 프로젝트는 기본 Babel preset인 [`babel-preset-expo`](https://github.com/expo/expo/tree/main/packages/babel-preset-expo)를 확장해야 합니다.

### Bare workflow

네이티브 프로젝트(**android** 및 **ios** 디렉터리 안의 프로젝트)를 Git에 버전 관리하고 수동으로 유지보수하는 접근 방식을 설명하는 용어입니다. 이는 네이티브 프로젝트를 직접 수정하는 **기존 "bare" React Native 앱**에서 흔히 볼 수 있습니다. 자유롭게 커스터마이즈할 수 있지만 유지보수 부담도 큽니다.

이는 [app config와 prebuild](/workflow/continuous-native-generation)를 사용하는 방식과 대비됩니다. 이 방식에서는 네이티브 프로젝트를 버전 관리하지 않고, 대신 [권장 접근 방식](/workflow/continuous-native-generation)인 `npx expo prebuild`를 사용해 필요할 때 생성합니다.

### Bun

JavaScript 런타임이며 Node.js를 대체할 수 있는 드롭인 대안입니다. Bun은 [JavaScript용 package manager](/more/glossary-of-terms#package-manager)로도 사용할 수 있습니다. Expo 및 EAS와 함께 사용하는 방법은 [using Bun](/guides/using-bun) 가이드를 참고하세요.

### CocoaPods

네이티브 모듈을 네이티브 iOS 프로젝트에 연결하는 데 사용되는 iOS 패키지 매니저입니다. 이 패키지 매니저는 **ios/Podfile** 파일로 설정되며, 사용자가 **ios** 디렉터리에서 `pod install`을 실행할 때 업데이트됩니다.

### Community Autolinking

React Native 커뮤니티가 [fork](https://github.com/react-native-community/cli/issues/248#issue-422591744)한 [Expo Autolinking](/more/glossary-of-terms#expo-autolinking)을 가리킵니다. 모듈 링크에 필요한 요구 사항은 [Expo Autolinking](/more/glossary-of-terms#expo-autolinking)과 다르지만 구현 자체는 동일합니다.

### Config introspection

코드 변경 사항을 저장하지 않고 메모리 안에서 [`npx expo prebuild`](/more/glossary-of-terms#prebuild)의 결과를 평가하는 과정입니다. 이는 [Auto Capability Signing](/more/glossary-of-terms#auto-capability-signing)에서 네이티브 코드를 생성하지 않고도 entitlements 파일이 어떤 모습이 될지 판단하는 데 사용됩니다. 이 과정은 [VS Code Expo](/more/glossary-of-terms#vs-code-expo) 확장에서 [Config Mods](/more/glossary-of-terms#config-mods)를 디버깅할 때도 사용됩니다.

### Config Mods

[app config](/more/glossary-of-terms#app-config)에 추가되어 [Prebuild](/more/glossary-of-terms#prebuild)에서 사용되는 비동기 함수입니다. 이 함수들은 **AndroidManifest.xml**이나 **Info.plist** 같은 단일 네이티브 파일을 수정하도록 전달받습니다. Config mods는 체이닝되며 `@expo/config-plugins` 패키지에서 제공됩니다. 자세한 내용은 [Config plugins](/config-plugins/introduction)을 참고하세요.

### Config Plugin

[config mods](/more/glossary-of-terms#config-mods)를 [app Config](/more/glossary-of-terms#app-config)에 추가해 [Prebuild](/more/glossary-of-terms#prebuild)에서 사용할 수 있도록 하는 JavaScript 함수입니다. 자세한 내용은 [Config Plugins](/config-plugins/introduction)을 참고하세요.

### Continuous Native Generation (CNG)

입력 집합으로부터 네이티브 프로젝트를 생성하는 과정을 설명하는 추상적인 개념입니다. Expo의 맥락에서는 [`prebuild`](/more/glossary-of-terms#prebuild) 명령으로 구현됩니다. 자세한 내용은 [Continuous Native Generation](/workflow/continuous-native-generation)을 참고하세요.

### create-expo-app

`expo` 패키지가 설치된 새 React Native 앱을 부트스트래핑하는 독립형 명령줄 도구(CLI)입니다. 자세한 내용은 [`create-expo-app` reference](/more/create-expo)를 참고하세요.

### create-react-native-app

`expo` 패키지가 설치되고 네이티브 코드가 생성된 새 React Native 앱을 부트스트래핑하는 독립형 명령줄 도구(CLI)입니다. 이 CLI는 [expo/examples](https://github.com/expo/examples)의 example 프로젝트에서 부트스트래핑하는 기능도 활성화합니다.

이 패키지는 다음 명령 중 아무 것이나 실행해 사용할 수 있습니다.

-   `npx create-expo-app`
-   `yarn create expo-app`
-   `npm create expo-app`

### Dangerous mods

[Config modifiers](/more/glossary-of-terms#config-mods)는 [prebuild](/more/glossary-of-terms#prebuild) 중 네이티브 프로젝트에 불안정한 변경을 적용합니다. 이러한 modifier를 사용하는 것은 예측하기 어렵고 [Expo SDK](/more/glossary-of-terms#expo-sdk)의 major version이 올라갈 때 깨지는 변경이 생기기 쉽습니다. 자세한 내용은 [Using a dangerous mod](/config-plugins/dangerous-mods)를 참고하세요.

### Development build

development build는 `expo-dev-client` 패키지를 포함한 앱의 디버그 빌드입니다. 이것은 [Expo Go](/more/glossary-of-terms#expo-go)의 진화된 형태라고 볼 수 있으며, Expo Go의 제약이 없고 애플리케이션 요구에 맞게 커스터마이즈할 수 있습니다.

이는 Expo로 프로덕션 수준의 앱을 빌드할 때 권장되는 접근 방식입니다. 자세한 내용은 [Development builds](/get-started/set-up-your-environment?mode=development-build)를 참고하세요.

### Dev clients

`expo-dev-client`는 development build를 만들 수 있게 해주고 유용한 개발 도구를 포함하는 라이브러리입니다. "custom dev client"라는 표현도 볼 수 있는데, 이는 [Development builds](/more/glossary-of-terms#development-build)의 동의어입니다.

### Development server

development server(또는 dev server)는 보통 [Expo CLI](/more/glossary-of-terms#expo-cli)에서 `npx expo start`를 실행해 로컬에서 시작하는 서버를 말합니다.

development server는 일반적으로 `http://localhost:8081`에서 호스팅됩니다. 클라이언트는 `/` 경로에서 제공되는 [manifest](/more/glossary-of-terms#manifest)를 사용해 bundler로부터 JavaScript bundle을 요청합니다.

### EAS

[Expo Application Services (EAS)](/eas)는 [EAS Build](/build/introduction), [EAS Submit](/submit/introduction), [EAS Update](/eas-update/introduction) 같은 Expo 및 React Native 앱용으로 깊이 통합된 클라우드 서비스입니다.

### EAS CLI

EAS를 다루기 위한 명령줄 도구입니다.

### EAS Config

[EAS CLI](/more/glossary-of-terms#eas-cli)를 구성하는 데 사용되는 **eas.json** 파일입니다. 자세한 내용은 [Configuring EAS Build with eas.json](/build/eas-json)을 참고하세요.

### EAS Metadata

Apple App Store 메타데이터를 JSON으로 업로드하고 다운로드하는 명령줄 도구입니다. 이 도구는 [EAS CLI](/more/glossary-of-terms#eas-cli) 패키지에서 사용할 수 있으며, iOS 제출 과정을 개선하는 데 사용해야 합니다. 자세한 내용은 [EAS Metadata](/eas/metadata)를 참고하세요.

### EAS Update

1.  OTA Update에 사용되는 클라우드 호스팅 서비스 [EAS Update](/eas-update/introduction)입니다.
2.  정적 파일을 해당 클라우드 호스팅 서비스에 게시하는 데 사용되는 [EAS CLI](/more/glossary-of-terms#eas-cli)의 `eas update` CLI 명령입니다.

### Emulator

Emulator는 컴퓨터에서 실행되는 Android 기기의 소프트웨어 에뮬레이터를 설명할 때 사용됩니다. 보통 iOS 에뮬레이터는 [Simulators](/more/glossary-of-terms#simulator)라고 부릅니다.

### Entry point

entry point는 보통 애플리케이션을 로드하는 데 사용되는 초기 JavaScript 파일을 가리킵니다. [Expo CLI](/more/glossary-of-terms#expo-cli)를 사용하는 앱에서는 기본 entry point가 **./node_modules/expo/AppEntry.js**이며, 이 파일은 루트 프로젝트 디렉터리의 **App.js** 파일을 import해 네이티브 앱의 초기 컴포넌트로 등록합니다.

### Experience

보통 더 단일 용도이며 범위가 작고, 때로는 예술적이거나 기발한 느낌을 주는 앱을 뜻하는 동의어입니다.

### Expo Autolinking

원래의 [Autolinking](/more/glossary-of-terms#autolinking) 시스템으로, `expo-modules-core`를 사용하는 프로젝트를 위해 설계되었습니다. 이 시스템은 라이브러리 루트 디렉터리에 **expo-module.config.json**이 존재하는지 여부를 바탕으로 모듈을 연결합니다.

### Expo CLI

Expo 작업을 위한 명령줄 도구입니다. 현재 이 용어는 [Local Expo CLI](/more/glossary-of-terms#local-expo-cli)를 가리키지만, 역사적으로는 [Global Expo CLI](/more/glossary-of-terms#global-expo-cli)를 뜻했습니다. 자세한 내용은 [Expo CLI](/more/expo-cli)를 참고하세요.

### Expo client

[Expo Go](/more/glossary-of-terms#expo-go) 앱의 이전 이름입니다.

### Expo export

[Expo CLI](/more/glossary-of-terms#expo-cli)의 `npx expo export` 명령을 가리킵니다. 이 명령은 앱의 JavaScript와 asset을 번들링한 뒤, 이를 [EAS Update](/more/glossary-of-terms#eas-update) 같은 호스팅 서비스에 업로드할 수 있고 오프라인 사용을 위해 [native runtime](/more/glossary-of-terms#native-runtime)에 포함할 수도 있는 정적 디렉터리로 export하는 데 사용됩니다.

### Expo Go

React Native를 학습하고 실험하기 위한 샌드박스 역할을 하는 Android 및 iOS 앱입니다.

제약 사항(예: 커스텀 네이티브 코드를 포함할 수 없음) 때문에 프로덕션 앱을 빌드하고 배포하는 데는 권장되지 않습니다. 대신 [development build](/more/glossary-of-terms#development-build)를 사용하세요.

### Expo install

[Expo CLI](/more/glossary-of-terms#expo-cli)의 `npx expo install` 명령을 가리킵니다. 이 명령은 프로젝트에 현재 설치된 `expo` 버전과 호환되는 [native modules](/more/glossary-of-terms#native-module)를 포함한 npm 패키지를 설치하는 데 사용됩니다. 모든 패키지가 지원되는 것은 아닙니다. 이 명령은 전역 설치된 [package managers](/more/glossary-of-terms#package-manager)를 감쌉니다.

### Expo Module Config

[native module](/more/glossary-of-terms#native-module) 루트 디렉터리에 있는 **expo-module.config.json**이라는 이름의 파일입니다. 자세한 내용은 [Module Config](/modules/module-config)를 참고하세요.

### Expo SDK

[npm](/more/glossary-of-terms#npm) 패키지 모음으로, 카메라, 푸시 알림, 연락처, 파일 시스템 등 디바이스/시스템 기능에 접근할 수 있도록 해주는 [native modules](/more/glossary-of-terms#native-module)를 포함합니다.

-   가능할 때마다 각 패키지는 Android, iOS, 웹을 지원합니다.
-   인터페이스는 전부 [TypeScript](/more/glossary-of-terms#typescript)로 작성됩니다.
-   Expo SDK의 모든 패키지는 서로 함께 동작하며 안전하게 함께 컴파일할 수 있습니다.
-   SDK의 어떤 패키지든 최소한의 공통 설정만으로 모든 [React Native](/more/glossary-of-terms#react-native) 앱에서 사용할 수 있습니다. [자세히 알아보기](/bare/installing-expo-modules).
-   모든 패키지는 [오픈소스](https://github.com/expo/expo/tree/main/packages)이며 자유롭게 커스터마이즈할 수 있습니다.

### Expo start

[Expo CLI](/more/glossary-of-terms#expo-cli)의 `npx expo start` 명령을 가리킵니다. 이 명령은 [development server](/more/glossary-of-terms#development-server)를 로컬에서 시작하며, [client](/more/glossary-of-terms#expo-client)가 여기에 연결해 [Metro bundler](/more/glossary-of-terms#metro-bundler)와 상호작용할 수 있게 해줍니다.

### Fabric

네이티브 뷰를 생성하고 관리하는 데 사용되는 React Native의 렌더링 시스템입니다. 자세한 내용은 [Fabric Renderer](https://reactnative.dev/architecture/fabric-renderer)를 참고하세요.

### Flipper

Meta 내부에서 사용하는 모바일 앱 디버거입니다. 예전에는 React Native와 함께 사용할 것이 권장되었지만, 현재 통합은 deprecated 되었고 React Native 팀에서도 더 이상 지원하지 않습니다([(RFC-0641)](https://github.com/react-native-community/discussions-and-proposals/blob/main/proposals/0641-decoupling-flipper-from-react-native-core.md)).

### FYI

때때로 **Expo FYI**라고도 부르며, [expo.fyi](https://expo.fyi/)에 있는 복잡한 문제에 대한 맞춤형 해법 모음입니다. FYI 링크는 Expo의 개발자 도구 전반에서 더 나은 개발 경험을 제공하는 데 활용됩니다.

### Global Expo CLI

`expo-cli` 패키지가 사용자의 컴퓨터에 전역 설치되어 모든 프로젝트에서 사용되던 형태를 말합니다. 이 CLI는 SDK 30(2018)에 도입되었고, SDK 46(2022)에서 [Local Expo CLI](/more/glossary-of-terms#local-expo-cli)를 위해 deprecated 되었습니다.

### Gradle

Gradle은 다중 언어 소프트웨어 개발을 위한 빌드 자동화 도구입니다. Android 앱을 빌드하는 데 사용됩니다. 컴파일과 패키징부터 테스트, 배포, 퍼블리싱까지의 작업 전반에서 개발 과정을 제어합니다.

### Hermes engine

[JavaScript engine](/more/glossary-of-terms#javascript-engine)으로, [Meta](/more/glossary-of-terms#meta)가 [React Native](/more/glossary-of-terms#react-native)용으로 특별히 개발했습니다. Hermes는 모바일 기기에 초점을 맞춰 ahead-of-time 정적 최적화와 compact bytecode를 제공해 성능을 향상시키며, 기본 JS 엔진입니다.

### iOS

iPhone, iPad, Apple TV에서 사용되는 운영체제입니다. [Expo Go](/more/glossary-of-terms#expo-go)는 현재 iPhone과 iPad용 iOS에서 실행됩니다.

### JavaScript engine

기기에서 JavaScript를 실행할 수 있는 네이티브 패키지입니다. React Native에서는 주로 [Hermes](/more/glossary-of-terms#hermes-engine)를 사용하며, 이는 [Meta](/more/glossary-of-terms#meta)가 개발했습니다. 다른 선택지로는 Apple의 [JavaScriptCore](/more/glossary-of-terms#javascriptcore-engine)와 Google의 V8이 있습니다.

### JavaScriptCore engine

[JavaScript engine](/more/glossary-of-terms#javascript-engine)으로, Apple이 개발했고 [iOS](/more/glossary-of-terms#ios)에 내장되어 있습니다. [Android](/more/glossary-of-terms#android)용 React Native도 parity를 위해 JavaScriptCore 버전을 사용할 수 있습니다. JavaScriptCore를 사용한 디버깅은 V8이나 [Hermes](/more/glossary-of-terms#hermes-engine)가 구현하는 [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) 기반 디버깅보다 정교하지 않습니다.

### Linking

Linking은 [웹에서 웹사이트에 링크하는 것처럼 앱으로 deep link하는 것](/linking/overview)을 의미할 수도 있고, [autolinking](/more/glossary-of-terms#autolinking)을 의미할 수도 있습니다.

### Local Expo CLI

`@expo/cli` 패키지는 `expo` 패키지와 함께 설치됩니다. 현재는 deprecated 된 전역 설치형 `expo-cli`와 달리 사용자의 프로젝트 내부에 설치되기 때문에, 이를 "Versioned Expo CLI"라고 부르기도 합니다.

### Manifest

Expo 앱 manifest는 [web app manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)와 비슷합니다. Expo Go가 앱을 어떻게 실행해야 하는지와 기타 관련 데이터를 알기 위해 필요한 정보를 제공합니다.

### Meta

이전의 Facebook인 Meta는 [React Native](/more/glossary-of-terms#react-native), [Metro Bundler](/more/glossary-of-terms#metro-bundler), [Hermes Engine](/more/glossary-of-terms#hermes-engine), [Yoga](/more/glossary-of-terms#yoga) 등을 개발하는 그룹입니다. Expo 팀은 가능한 최고의 개발자 경험을 제공하기 위해 Meta와 협업합니다.

### Metro bundler

JavaScript 파일과 asset을 [native runtime](/more/glossary-of-terms#native-runtime)에서 실행할 수 있는 형식으로 변환하는 데 사용하는 bundler입니다. 이 bundler는 [Meta](/more/glossary-of-terms#meta)가 유지보수하며 React Native(웹 포함) 앱에 사용됩니다. 자세한 내용은 [Metro documentation](https://metrobundler.dev/)을 참고하세요.

### Metro config

[Metro bundler](/more/glossary-of-terms#metro-bundler)를 구성하는 데 사용되는 **metro.config.js** 파일입니다. [Expo CLI](/more/glossary-of-terms#expo-cli)를 사용할 때는 `@expo/metro-config` 패키지를 확장해야 합니다. 자세한 내용은 [Customizing Metro](/guides/customizing-metro)를 참고하세요.

### Monorepo

패키지 매니저를 통해 서로 연결된 여러 하위 프로젝트를 포함하는 프로젝트입니다. monorepo는 크로스 플랫폼 앱의 코드베이스를 유지보수하는 데 아주 좋은 방식입니다.

### Native directory

React Native 생태계에는 수천 개의 라이브러리가 있습니다. 목적에 맞는 도구가 없으면 어떤 라이브러리가 있는지 파악하고, 검색하고, 품질을 판단하고, 직접 시도해 보고, 프로젝트에 맞지 않는 라이브러리(Expo에서 동작하지 않거나 Android 또는 iOS에서 동작하지 않는 것들)를 걸러내기가 어렵습니다. [React Native Directory](https://reactnative.directory/)는 이 문제를 해결하기 위한 웹사이트이며, 프로젝트에서 사용할 패키지를 찾을 때 활용하기를 권장합니다.

### Native module

네이티브 플랫폼 기능을 JS global을 통해 JavaScript 엔진에 노출하는, 네이티브 코드로 작성된 모듈입니다. 이 기능은 보통 `import { NativeModules } from 'react-native';`를 통해 접근합니다.

### Native runtime

[JavaScript engine](/more/glossary-of-terms#javascript-engine)을 포함하고 React 애플리케이션을 실행할 수 있는 네이티브 애플리케이션입니다. 여기에는 [Expo Go](/more/glossary-of-terms#expo-go), [development build](/more/glossary-of-terms#development-build), [standalone apps](/more/glossary-of-terms#standalone-app), 심지어 Chrome 같은 웹 브라우저까지 포함됩니다.

### npm

[npm](https://www.npmjs.com/)은 [JavaScript용 package manager](/more/glossary-of-terms#package-manager)이자 패키지가 저장되는 레지스트리입니다.

### Package manager

프로젝트에서 dependency라고도 부르는 라이브러리를 설치, 업그레이드, 구성, 제거하는 과정을 자동화합니다. [Bun](/more/glossary-of-terms#bun), [npm](/more/glossary-of-terms#npm), [pnpm](/more/glossary-of-terms#pnpm), [Yarn](/more/glossary-of-terms#yarn)을 참고하세요.

### Package manager workspaces

Expo 사용자에게 권장되는 [monorepo](/more/glossary-of-terms#monorepo) 해법입니다. 지원되는 패키지 매니저로 workspaces를 설정하는 방법은 [Working with Monorepos](/guides/monorepos) 가이드를 참고하세요.

### Platform extensions

Platform extensions는 [Metro bundler](/more/glossary-of-terms#metro-bundler)의 기능으로, 특정 파일 이름에 대해 플랫폼별로 파일을 대체할 수 있게 해줍니다. 예를 들어 프로젝트에 **.index.js** 파일과 **.index.ios.js** 파일이 있으면, iOS용 번들링에서는 **index.ios.js**가 사용되고 다른 모든 플랫폼에서는 **index.js**가 사용됩니다.

기본적으로 platform extensions는 `@expo/metro-config`에서 다음 규칙으로 해석됩니다.

-   Android: **\*.android.js**, **\*.native.js**, **\*.js**
-   iOS: **\*.ios.js**, **\*.native.js**, **\*.js**
-   Web: **\*.web.js**, **\*.js**

### pnpm

[pnpm](https://pnpm.io/)은 디스크 공간 효율성에 중점을 둔 [JavaScript용 package manager](/more/glossary-of-terms#package-manager)입니다.

### Prebuild

[app config](/more/glossary-of-terms#app-config)를 기반으로 React Native 프로젝트의 임시 네이티브 **android** 및 **ios** 디렉터리를 생성하는 과정입니다. 이 과정은 프로젝트 디렉터리에서 [Expo CLI](/more/glossary-of-terms#expo-cli)의 `npx expo prebuild` 명령을 실행해 수행합니다.

자세한 내용은 [Prebuild template](/more/glossary-of-terms#prebuild-template)와 [Autolinking](/more/glossary-of-terms#autolinking)을 참고하세요.

### Prebuild template

React Native 프로젝트 템플릿은 [Prebuilding](/more/glossary-of-terms#prebuild)의 첫 단계로 사용됩니다. 이 템플릿은 [Expo SDK](/more/glossary-of-terms#expo-sdk)와 함께 버전 관리되며, 프로젝트에 설치된 `expo` 버전에 따라 템플릿이 선택됩니다. 템플릿이 clone된 후 `npx expo prebuild`는 [app config](/more/glossary-of-terms#app-config)를 평가하고, 템플릿 내 여러 파일을 수정하는 [Config mods](/more/glossary-of-terms#config-mods)를 실행합니다.

`npx expo prebuild --template /path/to/template` 플래그를 사용해 템플릿을 바꿀 수는 있지만, 기본 prebuild template에는 `npx expo prebuild` 명령이 전제로 삼는 중요한 초기 기본값들이 포함되어 있습니다.

현재 기본 템플릿은 [`expo-template-bare-minimum`](https://github.com/expo/expo/tree/main/templates/expo-template-bare-minimum)에 있습니다.

### Publish

우리는 "publish"라는 단어를 "deploy"의 동의어로 사용합니다. 앱을 publish하면 Expo Go에서는 지속적인 URL을 통해 사용할 수 있게 되고, [Standalone apps](/more/glossary-of-terms#standalone-app)의 경우 앱이 업데이트됩니다.

### React Native

[React Native](https://reactnative.dev/)를 사용하면 JavaScript만으로 모바일 앱을 만들 수 있습니다. React와 같은 설계를 사용하므로 선언형 컴포넌트로 풍부한 모바일 UI를 조합할 수 있습니다.

### React Native Web

`react-dom` 위에서 동작하는 고성능 추상화 계층으로, [React Native](/more/glossary-of-terms#react-native)의 핵심 primitive를 브라우저에서 실행할 수 있게 해줍니다. React Native for web(RNW)은 X에서 개발되었고 현재 [메인 웹사이트](https://x.com)에 사용되고 있습니다. [Expo SDK](/more/glossary-of-terms#expo-sdk)와 [Expo CLI](/more/glossary-of-terms#expo-cli)는 RNW를 1급 지원합니다.

### React Navigation

Expo 팀이 개발하고 후원하는, React Native 앱용 권장 navigation 라이브러리입니다.

### Remote Debugging

Remote Debugging은 React Native 앱을 디버깅하는 deprecated 방식입니다. 오늘날 더 나은 대안은 [Hermes](/more/glossary-of-terms#hermes-engine)를 사용하는 것이며, React Native DevTools를 Hermes에 연결할 수 있습니다.

Async Chrome Debugging이라고도 불리며, React Native 앱 디버깅을 위한 실험적 시스템이었습니다. 이 시스템은 애플리케이션 JavaScript를 Chrome 탭의 web worker에서 실행한 다음, websocket을 통해 네이티브 명령을 네이티브 기기로 보내는 방식으로 동작합니다.

### Simulator

실제 기기를 손에 들고 있지 않아도 앱 작업을 할 수 있도록 macOS에서 실행할 수 있는 iOS 기기 에뮬레이터입니다([Snack](/more/glossary-of-terms#snack)에서도 사용 가능).

### Slug

[app config]((#appjson)에 있는 `slug`는 프로젝트의 URL 친화적 이름입니다. 이 값은 Expo 계정 전체에서 고유합니다.

### Snack

[Snack](https://snack.expo.dev/)은 휴대전화나 컴퓨터에 어떤 도구도 설치하지 않고 Expo [experiences](/more/glossary-of-terms#experience)를 만들 수 있는 브라우저 내 개발 환경입니다.

### Software Mansion

폴란드 크라쿠프에 있는 개발 에이전시입니다. `react-native-gesture-handler`, `react-native-screens`, `react-native-reanimated`의 유지보수 팀입니다. Expo의 플랫폼 팀은 Software Mansion 소속 계약자 여러 명으로 구성되어 있습니다. Software Mansion의 핵심 React Native 라이브러리는 모두 [Expo Go](/more/glossary-of-terms#expo-go)에서 지원됩니다.

### Standalone app

"Production build"와 같은 뜻입니다. Google Play Store나 Apple App Store에 제출할 수 있는 애플리케이션 바이너리입니다. 자세한 내용은 [Build your project for app stores](/deploy/build-project) 또는 [Run builds locally or on your own infrastructure](/build-reference/local-builds)를 참고하세요.

### Store config

[EAS Metadata](/more/glossary-of-terms#eas-metadata)를 구성하는 데 사용되는 **store.config.json** 파일입니다. 이 파일은 기존 App Store 항목에서 `eas metadata:pull`로 생성할 수 있습니다.

### Sweet API

React Native 모듈을 작성하기 위한 Swift 및 Kotlin API입니다. 이 API는 `expo` 패키지와 함께 제공되는 `expo-modules-core` 라이브러리가 제공합니다. 자세한 내용은 [Module API](/modules/module-api)를 참고하세요.

### TypeScript

TypeScript는 JavaScript를 기반으로 하면서 더 나은 도구 지원을 제공하는 강타입 프로그래밍 언어입니다. Expo SDK는 TypeScript로 작성되어 있으며, 우리는 TypeScript 사용을 강력히 권장합니다. 자세한 내용은 [TypeScript guide](/guides/typescript)를 참고하세요.

### Updates

전통적으로 Android와 iOS 앱은 업데이트된 바이너리를 App Store와 Play Store에 제출하는 방식으로 업데이트됩니다. Updates를 사용하면 스토어에 새 릴리스를 제출하는 부담 없이 앱에 업데이트를 푸시할 수 있습니다. 자세한 내용은 [Publishing](/eas-update/introduction) 문서를 참고하세요.

### VS Code Expo Tools

app config 파일 작업의 개발 경험을 개선하기 위한 VS Code 확장입니다. 이 확장은 [app config](/more/glossary-of-terms#app-config), [Store Config](/more/glossary-of-terms#store-config), [Expo Module Config](/more/glossary-of-terms#expo-module-config), [EAS Config](/more/glossary-of-terms#eas-config)에 대해 autocomplete와 intellisense를 제공합니다. 자세한 내용은 [VS Code Expo Tools extension](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools)을 참고하세요.

### Watchman

[Metro](/more/glossary-of-terms#metro-bundler)가 개발 중 hot reload를 수행하기 위해 사용하는 파일 watcher입니다. Watchman에는 네이티브 코드가 포함되어 있어 전역 설치 시 문제가 생길 수 있습니다. Watchman은 [Meta](/more/glossary-of-terms#meta)가 유지보수합니다.

### webpack

[Expo CLI](/more/glossary-of-terms#expo-cli)가 [`react-native-web`](/more/glossary-of-terms#react-native-web) 앱 개발에 사용하던 deprecated bundler입니다.

### Yarn

[Yarn](https://yarnpkg.com/)은 Meta에서 만든 [JavaScript용 package manager](/more/glossary-of-terms#package-manager)입니다. 두 개의 주요 계열 버전인 [Yarn v1 (Classic)](https://classic.yarnpkg.com/lang/en/)과 [Yarn Berry](https://github.com/yarnpkg/berry)가 있습니다.

### Yoga

React Native 내부에서 네이티브 뷰에 [CSS FlexBox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox) 지원을 제공하기 위해 사용하는 네이티브 크로스 플랫폼 라이브러리입니다. React Native 스타일은 화면상의 요소를 배치하고 스타일링하기 위해 Yoga로 전달됩니다. 자세한 내용은 [Yoga](https://github.com/facebook/yoga) 문서를 참고하세요.
