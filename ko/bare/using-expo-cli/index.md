---
modificationDate: March 01, 2026
title: React Native CLI에서 Expo CLI로 마이그레이션하기
description: 모든 React Native 프로젝트에서 React Native CLI(@react-native-community/cli)에서 Expo CLI로 마이그레이션하는 방법을 알아보세요.
---

# React Native CLI에서 Expo CLI로 마이그레이션하기

모든 React Native 프로젝트에서 React Native CLI(@react-native-community/cli)에서 Expo CLI로 마이그레이션하는 방법을 알아보세요.

React Native CLI(`npx @react-native-community/cli@latest init`)에서 Expo CLI로 마이그레이션하려면 Expo Modules API와 Expo CLI를 포함하는 `expo` 패키지를 설치해야 합니다. 이 가이드는 설치 단계, Expo CLI 사용의 장점, 그리고 Expo CLI로 마이그레이션한 뒤 프로젝트를 컴파일하고 실행하는 방법을 다룹니다.

다른 Expo 도구를 사용할 때는 Expo CLI 사용을 강력히 권장합니다. EAS Update, Expo Router, expo-dev-client 같은 많은 도구에서 필요하며, 이를 사용하지 않으면 다른 기능도 제대로 동작하지 않을 수 있습니다.

## `expo` 패키지 설치하기

대부분의 경우 프로젝트 디렉터리에서 다음 명령을 실행해 패키지를 설치하는 것만으로 충분합니다:

```sh
npx install-expo-modules@latest
```

자세한 설치 가이드는 [Expo modules 설치하기](/bare/installing-expo-modules)를 참고하세요.

> `expo` 패키지를 설치한 뒤에는 프로젝트가 Expo CLI를 사용하도록 구성해야 합니다. 여기에는 Metro config, Babel preset, 그리고 네이티브 프로젝트 구성이 포함됩니다. 전체 설정 방법은 [Android와 iOS에서 번들링하도록 Expo CLI 구성하기](/bare/installing-expo-modules#configure-expo-cli-for-bundling-on-android-and-ios) 섹션을 참고하세요.

## React Native CLI 대신 Expo CLI를 쓰는 이유

Expo CLI 명령은 `@react-native-community/cli`의 유사한 명령보다 여러 장점을 제공합니다. 예를 들면 다음과 같습니다:

-   `j` 키 한 번으로 Hermes 디버거에 즉시 접근할 수 있습니다.
-   디버거에는 [React Native DevTools](/debugging/tools#debugging-with-react-native-devtools)가 함께 제공됩니다.
-   업그레이드, 화이트라벨링, 서드파티 패키지의 쉬운 설정, 더 나은 코드베이스 유지보수성(표면적 감소)을 위해 [Continuous Native Generation (CNG)](/workflow/continuous-native-generation)과 [`expo prebuild`](/more/glossary-of-terms#prebuild)를 지원합니다.
-   [`expo-router`](/router/introduction)를 통한 파일 기반 라우팅을 지원합니다.
    -   개발 환경에서 [async bundling](/router/web/async-routes)을 지원합니다.
-   기본 제공 [환경 변수 지원](/guides/environment-variables)과 **.env** 파일 통합이 있습니다.
-   터미널에서 JavaScript 로그와 함께 네이티브 로그를 직접 볼 수 있습니다.
-   React Native 앱에 특화된 Expo CLI의 `xcpretty` 스타일 도구를 사용해 네이티브 빌드 로그 형식이 개선됩니다. 예를 들어 Pod를 컴파일할 때 어떤 Node module이 이를 포함했는지 확인할 수 있습니다.
-   [일급 TypeScript 지원](/guides/typescript)을 제공합니다.
-   `paths`와 `baseUrl`이 있는 **tsconfig.json** 별칭을 [Metro에 내장된 방식으로](/guides/typescript#path-aliases-optional) 지원합니다.
-   Metro를 이용한 [웹 지원](/guides/customizing-metro#adding-web-support-to-metro)을 제공합니다. React Native Web에 대해 완전히 타입이 지정됩니다.
-   Tailwind, PostCSS, CSS Modules, SASS 등을 포함한 최신 [CSS 지원](/versions/latest/config/metro#css)을 제공합니다.
-   Expo Router와 Metro web을 이용한 정적 사이트 생성을 지원합니다.
-   기본으로 [monorepo 지원](/guides/monorepos)을 제공합니다.
-   [`expo-dev-client`](/develop/development-builds/introduction), [Expo Updates protocol](/technical-specs/expo-updates-1), [EAS Update](/eas-update/introduction) 같은 Expo 도구를 지원합니다.
-   `npx expo run:ios` 사용 시 `pod install`을 자동으로 실행합니다.
-   `npx expo install`은 잘 알려진 패키지에 대해 호환 가능한 의존성 버전을 선택합니다.
-   `npx expo run:[android|ios]`와 `npx expo start` 실행 시 자동으로 포트를 감지합니다. 기본 포트에서 다른 앱이 실행 중이면 다른 포트를 사용합니다.
-   인터랙티브 프롬프트에서 Shift + a 또는 Shift + i로 Android 또는 iOS 기기 실행 대상을 빠르게 선택할 수 있습니다.
-   [ngrok 터널](/develop/development-builds/development-workflows#tunnel-urls)을 통해 앱을 제공하는 기능이 내장되어 있습니다.
-   어떤 포트에서든, 어떤 엔트리 JavaScript 파일로든 개발할 수 있습니다.

Android, iOS, 웹을 대상으로 하는 대부분의 React Native 프로젝트에는 Expo CLI를 권장합니다. 다만 아직 Windows나 macOS 같은 가장 널리 쓰이는 out-of-tree 플랫폼에 대한 내장 지원은 없습니다. 이런 플랫폼을 빌드한다면 지원되는 플랫폼에는 Expo CLI를, 나머지 플랫폼에는 `@react-native-community/cli`를 함께 사용할 수 있습니다.

## 앱 컴파일 및 실행하기

`expo` 패키지를 설치한 뒤에는 `npx react-native run-android`와 `npx react-native run-ios` 대신 다음 명령을 사용할 수 있습니다:

```sh
npx expo run:android
npx expo run:ios
```

프로젝트를 빌드할 때는 `--device` 플래그를 사용해 기기나 시뮬레이터를 선택할 수 있습니다. 이 옵션은 컴퓨터에 연결된 어떤 iOS 기기에도 동일하게 적용됩니다.

## 번들러를 독립적으로 시작하기

`npx expo run:[android|ios]`는 번들러/개발 서버를 자동으로 시작합니다. 번들러를 `npx expo start` 명령으로 독립적으로 시작하고 싶다면, `npx expo run:[android|ios]` 명령에 `--no-bundler`를 전달하세요.

## 자주 묻는 질문

Expo Modules API를 설치하지 않고 Expo CLI만 사용할 수 있나요?

`npx install-expo-modules`로 `expo` 패키지를 설치하면 Expo Modules API도 함께 설치됩니다. 지금은 Expo Modules API 없이 Expo CLI만 시험해 보고 싶다면 `npm install`로 `expo` 패키지를 설치한 뒤, **react-native.config.js**를 구성하여 autolinking에서 해당 패키지를 제외하세요:

```js
module.exports = {
  dependencies: {
    expo: {
      platforms: {
        android: null,
        ios: null,
        macos: null,
      },
    },
  },
};
```

> **참고:** Expo API Modules가 설치되어 있지 않으면 `expo-dev-client`나 `expo-router` 같은 일부 기능은 사용할 수 없습니다.

macOS나 Windows 같은 out-of-tree 플랫폼에도 prebuild를 사용할 수 있나요?

네. 자세한 내용은 [Customized Prebuild Example repository](https://github.com/byCedric/custom-prebuild-example)를 참고하세요.

## 다음 단계

이제 프로젝트에 `expo` 패키지가 설치되고 구성되었으므로, Expo CLI와 SDK의 모든 기능을 사용할 수 있습니다. 더 깊이 알아보기 위한 추천 다음 단계는 다음과 같습니다:

[Expo CLI Reference](/more/expo-cli) — Expo CLI에서 사용할 수 있는 명령과 플래그를 더 자세히 알아보세요.

[Customizing Metro](/guides/customizing-metro) — 프로젝트에 맞게 Metro bundler 구성을 커스터마이즈하는 방법을 알아보세요.

[Prebuild 도입하기](/guides/adopting-prebuild) — app.json을 사용해 네이티브 디렉터리를 자동화하세요. — app.json

[Expo SDK 사용하기](/versions) — 앱에서 Expo SDK 라이브러리를 사용해 보세요.

[Expo Router](/router/introduction) — Expo Router는 웹의 훌륭한 라우팅 개념을 Android와 iOS 네이티브 앱으로 가져옵니다.
