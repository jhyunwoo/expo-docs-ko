---
modificationDate: March 01, 2026
title: Prebuild 도입하기
description: React Native CLI로 시작한 프로젝트에 Expo Prebuild를 도입하는 방법을 알아보세요.
---

# Prebuild 도입하기

React Native CLI로 시작한 프로젝트에 Expo Prebuild를 도입하는 방법을 알아보세요.

[native project를 지속적으로 생성](/workflow/continuous-native-generation)하기 위해 [Expo Prebuild](/workflow/continuous-native-generation)를 사용하면 [많은 장점](/workflow/continuous-native-generation)이 있습니다. 이 가이드는 `npx @react-native-community/cli@latest init`으로 시작한 프로젝트에 Expo Prebuild를 도입하는 방법을 보여줍니다. 프로젝트를 전환하는 데 걸리는 시간은 Android와 iOS native 프로젝트에 가한 custom native 변경의 양에 따라 달라집니다. 새 프로젝트라면 1~2분 정도 걸릴 수 있지만, 큰 프로젝트라면 훨씬 더 오래 걸릴 수 있습니다.

prebuild를 도입하면 `expo-modules-core`를 native로 연결해 [Expo native module API](/modules/module-api)로 module을 개발하는 지원이 자동으로 추가됩니다. 프로젝트에서 [Expo CLI](/more/expo-cli)의 어떤 명령이든 사용할 수도 있습니다.

> [`react-native`의 모든 버전이 명시적으로 지원되는 것은 아닙니다](/versions/latest#each-expo-sdk-version-depends-on-a-react-native-version). 대응되는 Expo SDK 버전이 있는 `react-native` 버전을 사용하는지 확인하세요.

## `expo` package 설치

`expo` package에는 [`npx expo prebuild`](/more/expo-cli#prebuild) 명령이 포함되어 있으며, 어떤 [prebuild template](/workflow/continuous-native-generation#templates)를 사용할지도 지정합니다:

```sh
npm install expo
```

현재 설치된 [`react-native` 버전](/versions/latest#each-expo-sdk-version-depends-on-a-react-native-version)과 호환되는 `expo` 버전을 설치해야 합니다.

## entry file 업데이트

entry file을 수정해 `AppRegistry.registerComponent` 대신 [`registerRootComponent`](/versions/latest/sdk/expo#registerrootcomponentcomponent)를 사용하세요:

```diff
- import {AppRegistry} from 'react-native';
- import {name as appName} from './app.json';
+ import {registerRootComponent} from 'expo';
  import App from './App';
- AppRegistry.registerComponent(appName, () => App);
+ registerRootComponent(App);
```

> [`registerRootComponent`](/versions/latest/sdk/expo#registerrootcomponentcomponent)에 대해 더 알아보세요.

## Prebuild

> 되돌리고 싶을 때를 대비해 변경 사항을 커밋해 두세요. 이 명령도 그 점을 경고해 줄 것입니다.

기존 프로젝트를 마이그레이션하는 중이라면 먼저 [**native customizations 마이그레이션**](/guides/adopting-prebuild#migrate-native-customizations)을 참고하는 것이 좋습니다.

app config(**app.json/app.config.js**) 구성을 기반으로 **android**와 **ios** 디렉터리를 다시 생성하려면 다음 명령을 실행하세요:

```sh
npx expo prebuild --clean
```

프로젝트를 로컬에서 빌드해 모든 것이 잘 동작하는지 테스트할 수 있습니다:

```sh
npx expo run:android
npx expo run:ios
```

> [native app 컴파일](/more/expo-cli#compiling)에 대해 더 알아보세요.

## 추가 변경 사항

다음 변경 사항은 선택 사항이지만 권장됩니다.

**.gitignore**

Expo CLI가 생성한 값이 커밋되지 않도록 **.expo**를 **.gitignore**에 추가할 수 있습니다. 이 [값들은 로컬 컴퓨터의 프로젝트별 고유 값](/more/expo-cli#expo-directory)입니다.

새 프로젝트를 만들 때 **android**와 **ios** 디렉터리는 자동으로 **.gitignore**에 추가되므로 prebuild 사이에 커밋되지 않습니다.

**app.json**

최상위 `expo` 객체 바깥에 있는 모든 필드는 `npx expo prebuild`에서 사용되지 않으므로 제거하세요.

**metro.config.js**

[Customizing Metro](/guides/customizing-metro)를 참고하세요.

**package.json**

script를 [Expo CLI](/more/expo-cli#compiling) run 명령을 사용하도록 바꾸는 것이 좋습니다:

이 명령들은 더 나은 logging, 자동 code signing, 더 나은 simulator 처리 기능을 제공하며, 파일을 제공하기 위해 `npx expo start`를 실행하도록 보장합니다.

## native customizations 마이그레이션

프로젝트에 native 수정 사항이 있다면(**android** 또는 **ios** 디렉터리의 변경, 예: app icon 구성이나 splash screen), 그 native 변경을 반영하도록 app config(**app.json**)를 구성해야 합니다.

-   변경 사항이 기본 제공 [app config field](/versions/latest/config/app)와 겹치는지 확인하세요. 예를 들어 app icon이 있다면 **app.json**의 `expo.icon`으로 정의한 뒤 `npx expo prebuild`를 다시 실행해야 합니다.
-   사용 중인 package 중 [Expo config plugin](/config-plugins/introduction)이 필요한 것이 있는지 확인하세요. 프로젝트의 package가 **android** 또는 **ios** 디렉터리 내부에 추가 변경을 요구한다면, 아마 Config Plugin이 필요할 것입니다. 일부 plugin은 **package.json**의 dependency에 있는 모든 package에 대해 `npx expo install`을 실행하면 자동으로 추가될 수 있습니다. package에 plugin이 필요하지만 제공하지 않는다면, 커뮤니티 plugin이 이미 있는지 [`expo/config-plugins`](https://github.com/expo/config-plugins)에서 확인해 볼 수 있습니다.
-   [VS Code Expo extension](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools)을 사용해 변경 사항을 들여다보고 prebuild가 기대한 native code를 생성하는지 디버깅할 수 있습니다. Cmd ⌘ + Shift + p를 누른 뒤 "Expo: Preview Modifier"를 입력하고 확인하고 싶은 native file을 선택하세요.
-   추가로, 필요에 맞게 로컬 config plugin을 개발할 수도 있습니다. [Learn more](/config-plugins/development-and-debugging#develop-a-plugin).

## 더 많은 기능 추가

prebuild는 자동화 빙산의 일각일 뿐입니다. 다음으로 도입할 수 있는 기능은 다음과 같습니다:

-   [EAS Build](/build/setup): code signing과 cloud build.
-   [EAS Update](/build/updates): over-the-air update를 즉시 전송합니다.
-   [Expo for web](/workflow/web): 브라우저에서 앱을 실행합니다.
-   [Expo Dev Client](/develop/development-builds/introduction): native runtime을 중심으로 여러분만의 "Expo Go" 유형 앱을 만듭니다.
-   [Expo native module API](/modules/module-api): Swift와 Kotlin으로 module을 작성합니다. `npx expo prebuild`를 사용할 때 자동으로 지원됩니다.
