---
modificationDate: March 05, 2026
title: FAQ
description: Expo와 관련 서비스에 대한 자주 묻는 질문과 제한 사항 목록입니다.
---

# FAQ

Expo와 관련 서비스에 대한 자주 묻는 질문과 제한 사항 목록입니다.

이 페이지에는 Expo와 관련 서비스에 대한 자주 묻는 질문과 답변 일부가 정리되어 있습니다. 여기에서 답을 찾지 못한 질문이 있다면 더 많은 일반 질문은 [Forums](https://chat.expo.dev/)를 참고하세요.

## Expo는 무엇에 사용되나요?

Expo는 Android, iOS, 웹에서 네이티브로 실행되는 앱을 위한 [오픈 소스 프레임워크](https://github.com/expo/expo)입니다. Expo는 모바일과 웹의 장점을 결합하고, live update, 앱 즉시 공유, 웹 지원처럼 앱을 빌드하고 확장하는 데 중요한 많은 기능을 제공합니다. `expo` npm package는 React Native 앱을 위한 뛰어난 기능 모음을 제공합니다. `expo` package는 거의 모든 React Native 프로젝트에 설치할 수 있습니다. 자세한 내용은 [what Expo offers](/core-concepts)를 참고하세요.

## 기업에서도 Expo를 사용하나요?

네, Expo는 전 세계의 주요 기업에서 사용하고 있으며 수억 명의 최종 사용자를 지원하고 있습니다. [showcase](https://expo.dev/customers)를 참고하세요.

## Expo는 왜 자체 SDK를 가지고 있나요?

Expo가 처음 만들어졌을 때는 React Native가 아직 공개 릴리스되지 않았습니다. 즉, third-party package가 없었습니다. React Native의 개발자 경험을 합리적인 수준으로 만들기 위해, 저희는 [일반적인 기능을 구현하기 위한 여러 라이브러리](/versions/latest)를 만들었습니다. 이후 이 라이브러리들 중 많은 수가 다양한 요구를 충족하기 위해 fork되고 수정되었습니다. 사용자가 자신의 앱을 훌륭하게 만들기 위해 필요한 [custom native code](/workflow/customizing)를 자유롭게 조합해 사용하는 것을 환영합니다.

Expo SDK는 충분히 테스트되었고, TypeScript로 작성되었으며, 문서화되어 있고, Android, iOS, 웹을 위해 빌드되었습니다. Expo SDK의 모든 module은 서로 함께 동작해 version이 항상 일치하도록 보장합니다. 이는 훌륭한 업그레이드 경험을 만들어 줍니다.

Expo SDK는 또한 [Expo Modules API](/modules/overview)로 작성되어 기여, 유지보수, 이해가 더 쉬워집니다.

## Expo와 React Native의 차이점은 무엇인가요?

`expo` package는 복잡한 React Native 애플리케이션을 더 쉽게 개발하고 확장할 수 있도록 해 주는 기능 모음을 제공합니다. 거의 모든 React Native 앱에 `expo`를 설치할 수 있습니다. [Expo Application Services (EAS)](/eas) 또는 React Native를 사용하는 데 `expo` package가 필수는 아니지만, 강력히 권장됩니다. 자세한 내용은 [what Expo offers](/core-concepts)를 참고하세요.

## Expo를 사용하려면 React Native에서 전환해야 하나요?

아니요. `expo` npm package와 CLI는 모든 React Native 앱과 함께 동작합니다. [Expo Application Services (EAS)](/eas) 역시 모든 React Native 앱에서 동작하며 build, update, app store submission 등을 훌륭하게 지원합니다.

## Expo는 비용이 얼마나 드나요?

Expo 플랫폼은 [무료이며 오픈 소스](https://blog.expo.dev/exponent-is-free-as-in-and-as-in-1d6d948a60dc)입니다. 여기에는 [Expo SDK](/versions/latest)를 구성하는 라이브러리와 개발에 사용하는 [Expo CLI](/more/expo-cli)가 포함됩니다. 시작하기 가장 쉬운 방법인 Expo Go 앱도 app store에서 무료로 제공됩니다.

[Expo Application Services (EAS)](/eas)는 Expo 팀이 제공하는 React Native 앱용 선택형 cloud services 모음입니다. EAS를 사용하면 앱을 더 쉽게 build하고, store에 제출하고, 최신 상태로 유지하고, push notification을 보내는 등의 작업을 할 수 있습니다. 앱에 [Free plan](https://expo.dev/pricing) 할당량이면 충분하다면 EAS를 무료로 사용할 수 있습니다. 자세한 내용은 [pricing page](https://expo.dev/pricing)에서 확인할 수 있습니다.

## Expo 프로젝트에 custom native code를 어떻게 추가하나요?

Expo는 custom native code를 추가하고 그 native code(Android/Xcode 프로젝트)를 커스터마이즈하는 것을 지원합니다. custom native code를 사용하려면 [development build](/develop/development-builds/introduction)와 [config plugins](/config-plugins/introduction)을 만들 수 있습니다. 다만 업그레이드가 더 쉽고 개발자 경험이 더 좋아지기 때문에 가능하면 [Expo SDK](/versions/latest)의 module을 사용하는 것을 권장합니다.

## React Native CLI로 만든 앱에서도 Expo를 사용할 수 있나요?

네. 모든 Expo 도구와 서비스는 어떤 React Native 앱에서도 잘 동작합니다. 예를 들어 [Expo SDK](/versions/latest)의 어떤 부분이든, [`expo-dev-client`](/develop/development-builds/create-a-build), EAS Build, Submit, Update를 사용할 수 있으며 모두 잘 동작합니다. [프로젝트에 `expo` 설치하기](/bare/installing-expo-modules), [prebuild 도입하기](/guides/adopting-prebuild), [EAS Build 설정하기](/build/introduction)에 대해 더 알아보세요.

## Expo 프로젝트를 어떻게 공유하나요? App store에 제출할 수 있나요?

프로젝트를 공유하는 가장 빠른 방법은 [EAS Update](/eas-update/introduction)로 publish하고 [development build](/develop/development-builds/introduction)에서 실행하는 것입니다. 이렇게 하면 앱에 URL이 생기고, Android 또는 iOS용 [development build](/develop/development-builds/introduction)가 있는 누구에게나 이 URL을 공유할 수 있습니다. URL은 Android용 Expo Go에서도 열 수 있습니다.

준비가 되면 production build(**.aab** 및 **.ipa**)를 만들어 app store에 제출할 수 있습니다. [EAS Build](/build/introduction)로 한 번의 명령으로 앱을 build하고 [EAS Submit](/submit/introduction)으로 store에 제출할 수 있습니다.

또한 Android에서는 APK로, iOS에서는 ad-hoc 또는 enterprise provisioning으로 앱을 공유하기 위해 [internal distribution](/build/internal-distribution)을 사용할 수도 있습니다.

## Windows 컴퓨터에서 iOS 앱을 개발할 수 있나요?

전통적으로 iOS 앱을 개발하려면 macOS가 필요했지만, [EAS Build](/build/introduction)를 사용하면 cloud에서 앱을 build할 수 있습니다. [EAS Submit](/submit/introduction)을 사용해 앱을 store에 제출할 수도 있습니다. 테스트는 [Expo Go](https://expo.dev/go) 또는 [development build](/develop/development-builds/introduction)를 사용해 실제 iOS 기기에서 할 수 있습니다.

## Expo SDK는 어떤 버전의 Android와 iOS를 지원하나요?

현재 Expo SDK는 Android 7+ 및 iOS 15.1+를 지원합니다. 자세한 내용은 [Support for Android and iOS versions](/versions/latest#support-for-android-and-ios-versions)를 참고하세요.

## "hello world" expo 앱의 최소 크기는 어느 정도인가요?

순수 Expo만 사용해 만든 최소한의 production 앱은 3MB 미만입니다. iOS의 경우 Expo는 더 최신 최소 iOS 버전을 대상으로 하므로 app store 최적화를 활용할 수 있습니다.

앱에 `expo` package가 포함되어 있더라도 app store에서 최종 앱 크기에 한 번만 1MB가 추가됩니다. `expo` package의 크기 비용은 미미합니다. 예를 들어 Android에서는 150 KiB 정도입니다. 나머지 크기는 언어 runtime(Android의 Kotlin 같은 것)에서 옵니다.

## Expo에서 내 native library를 사용할 수 있나요?

Swift와 Kotlin으로 [custom native module](/modules/overview)을 만들어 Expo에서 native Android 및 iOS 라이브러리를 사용할 수 있습니다. 많은 인기 라이브러리는 이미 custom native module을 가지고 있습니다. 사용 사례에 맞는 인기 라이브러리를 찾으려면 [React Native directory](https://reactnative.directory)를 확인해 보세요.

## 이 웹 라이브러리를 Expo와 함께 사용할 수 있나요?

three.js 같은 많은 인기 웹 package는 Expo 및 React Native와 함께 동작합니다. 자세한 내용은 [Expo examples](https://github.com/expo/examples)를 참고하세요.

## Expo는 웹 개발에서의 React와 비슷한가요?

Expo는 Android, iOS, 웹에서 네이티브로 실행되는 앱을 위한 [오픈 소스 프레임워크](https://github.com/expo/expo)입니다. React Native는 웹 개발의 `react-dom`과 비슷하게 특정 플랫폼에서 React를 실행할 수 있게 해 주지만, 몇 가지 중요한 차이점이 있습니다:

-   React Native는 HTML이나 CSS를 지원하지 않습니다.
-   DOM 대신 React Native는 native component를 사용합니다. 예를 들어 `<div />` 대신 `<View />`를 사용합니다. Native component는 DOM보다 성능이 더 좋고 훨씬 더 나은 사용자 경험을 제공합니다.
-   browser API에 접근할 수 있는 React.js와 달리 React Native는 custom native API를 사용합니다. 예를 들어 `navigator.geolocation` 대신 `expo-location`을 사용해 사용자의 위치에 접근합니다. Custom native API는 browser API와 비슷하지만 사용자가 이를 완전히 제어할 수 있습니다. 즉, browser에서 제공되기 전에 새로운 기능에 접근할 수 있습니다.

React.js 프레임워크가 사용자가 더 큰 웹사이트를 쉽게 만들 수 있도록 돕는 것과 같은 방식으로, Expo는 사용자가 더 큰 앱을 쉽게 만들 수 있도록 돕습니다. Expo는 Android, iOS, 웹에서 동작하는 충분히 테스트된 React Native module 모음을 제공합니다. Expo는 또한 앱을 build, deploy, update하기 위한 [도구 모음](/eas)도 제공합니다.

## 해석형 코드에 대한 store 정책은 어떻게 되나요?

React Native는 JavaScript interpreter(JSC, V8, Hermes)를 사용해 애플리케이션 코드를 실행합니다. 최신 정책 정보는 [Google Play Policy Center](https://play.google/developer-content-policy/)와 [Apple Developer Program License Agreement](https://developer.apple.com/support/terms/apple-developer-program-license-agreement)를 직접 참고하세요.

_다음은 2024년 4월 25일 기준 관련 정책 일부 발췌입니다._

### Google Play Store

```text
...an app may not download executable code (such as dex, JAR, .so files) from a
source other than Google Play. This restriction does not apply to code that runs
in a virtual machine or an interpreter where either provides indirect access to
Android APIs (such as JavaScript in a webview or browser).

Apps or third-party code, like SDKs, with interpreted languages (JavaScript,
Python, Lua, etc.) loaded at run time (for example, not packaged with the app)
must not allow potential violations of Google Play policies.
```

출처: [Google Play Policy Center](https://support.google.com/googleplay/android-developer/answer/9888379?hl=en).

### Apple App Store

```text
...Interpreted code may be downloaded to an Application but only so long as such code:
(a) does not change the primary purpose of the Application by providing features
    or functionality that are inconsistent with the intended and advertised purpose
    of the Application as submitted to the App Store,
(b) does not create a store or storefront for other code or applications, and
(c) does not bypass signing, sandbox, or other security features of the OS.
```

출처: [3.3.1 APIs and Functionality - B. Executable Code](https://developer.apple.com/support/terms/apple-developer-program-license-agreement#b331).

## Expo CLI를 써야 하나요, React Native Community CLI를 써야 하나요?

Expo CLI는 React Native Community CLI(일명 "React Native CLI")와 동일한 핵심 기능에 더해 자동 [TypeScript 설정](/guides/typescript), [웹 지원](/workflow/web), [호환 라이브러리 자동 설치](/more/expo-cli#install), [향상된 native build 명령](/more/expo-cli#compiling), [tunneling](/more/expo-cli#tunneling), [Prebuild](/more/glossary-of-terms#prebuild) 등 [더 많은 기능](/more/expo-cli)을 제공합니다.

React Native Community와 동시에 사용할 수도 있습니다. 어떤 CLI를 사용하든 프로젝트에서 [Expo SDK](/versions/latest)의 어떤 부분이든, [Expo Application Services](/eas)든 사용할 수 있습니다. 자세한 내용은 다음을 참고하세요:

-   [기존 React Native 프로젝트](/bare/using-expo-cli)에서 Expo CLI로 마이그레이션하는 방법을 알아보세요.
-   [using a framework to build React Native apps](https://reactnative.dev/blog/2024/06/25/use-a-framework-to-build-react-native-apps)에서 프레임워크를 사용해 React Native 앱을 빌드하는 이점을 알아보세요.
-   앱 성능 향상, 출시 가속화, 팀 전반의 더 강한 협업 같은 Expo CLI 마이그레이션의 이점을 [this blog post](https://expo.dev/blog/from-rnc-cli-to-expo)에서 알아보세요.

> **Note:** EAS Build는 기존 React Native 프로젝트(native 디렉터리가 version control에 체크인된 경우)와 호환됩니다. 이러한 디렉터리가 있으면 EAS Build는 prebuild step을 실행하지 않습니다. 이 step은 native 프로젝트 파일에 가한 수동 customizations를 덮어쓸 수 있기 때문입니다. Android Studio나 Xcode 같은 native tool을 사용해 native 디렉터리를 직접 구성해야 합니다.

## Expo Go는 오픈 소스인가요?

네, Expo Go의 source는 [expo/expo GitHub repository](https://github.com/expo/expo)의 **apps/expo-go** 디렉터리에서 찾을 수 있습니다. Expo Go 앱도 Expo와 React Native로 빌드됩니다.

## Expo Go로 할 수 있는 것과 할 수 없는 것은 무엇인가요?

[Expo Go](/get-started/set-up-your-environment?redirected=#how-would-you-like-to-develop)는 학생과 학습자가 Expo를 빠르게 시험해 보고 기본 개념을 이해할 수 있는 playground입니다. Expo SDK에 포함된 라이브러리와 custom native code가 필요하지 않은 라이브러리를 사용할 수 있습니다.

Expo Go에서는 custom native code가 필요한 third-party library를 사용할 수 없고, Expo Go 안에서 native code를 직접 수정할 수도 없습니다. 제한이 있으며 production 수준 프로젝트를 빌드하는 데는 적합하지 않습니다.

**어떤 실제 프로젝트든 [development build](/develop/development-builds/introduction)를 사용할 것을 강력히 권장합니다. 앱의 요구에 맞게 특별히 커스터마이즈된 Expo Go 버전을 만드는 것과 비슷합니다.**

## eject는 deprecated되었나요?

네, eject는 deprecated된 용어이며 더 이상 필요하지 않습니다. Expo가 처음 출시되었을 때는 앱의 native binary 크기가 더 컸고 "ejecting" 없이는 custom native code를 지원하지 않았습니다. 이는 2020년 12월에 [EAS Build](/build/introduction)가 출시되며 바뀌었습니다. 이 서비스는 모든 React Native 앱을 지원합니다. "ejecting" 개념은 SDK 41(2021년 4월)의 [`npx expo prebuild`](/more/glossary-of-terms#prebuild) 명령으로 대체되었고, 이 명령은 프로젝트의 라이브러리와 app config(**app.json**)를 기반으로 native 프로젝트를 지속적으로 생성합니다. `expo eject` 명령은 SDK 46(2022년 8월)에 완전히 deprecated되었습니다.

이전 eject workflow와 달리, 작성자는 [config plugin](/config-plugins/introduction)을 만들어 자신의 라이브러리가 Expo Prebuild와 함께 동작하도록 구성할 수 있습니다. 즉, Expo Prebuild와 함께 어떤 라이브러리든 사용할 수 있습니다. [development build](/develop/development-builds/introduction)를 만들면 Expo Prebuild에서 어떤 custom native code도 사용할 수 있습니다. 자세한 내용은 [Expo Prebuild documentation](/workflow/continuous-native-generation)에서 확인하세요.
