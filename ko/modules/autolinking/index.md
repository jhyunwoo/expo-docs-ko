---
modificationDate: February 20, 2026
title: Autolinking
description: Expo 프로젝트에서 네이티브 의존성을 자동으로 링크하기 위해 Expo Autolinking을 사용하는 방법을 알아보세요.
---

# Autolinking

Expo 프로젝트에서 네이티브 의존성을 자동으로 링크하기 위해 Expo Autolinking을 사용하는 방법을 알아보세요.

보통 네이티브 모바일 앱을 개발하면서 서드파티 라이브러리를 설치하려고 하면, 패키지 매니저의 manifest 파일(Android에서는 **build.gradle**, iOS의 CocoaPods에서는 **Podfile**, iOS의 SwiftPM에서는 **Package.swift**)에 의존성을 추가하라는 안내를 받습니다. Expo와 React Native에서는 [npm](https://www.npmjs.com) 레지스트리에서 패키지를 설치함으로써 이미 **package.json** 파일에서 그 작업을 수행하고 있습니다. 대부분의 React Native 라이브러리는 일부 네이티브(플랫폼별) 코드를 포함하고 있으므로, 라이브러리 하나를 설치하려면 많게는 서로 다른 패키지 매니저 세 개까지 구성해야 할 수 있습니다.

Expo Autolinking은 이 과정을 자동화해 라이브러리 설치 과정을 최소화하는 메커니즘입니다. 보통은 `npm`에서 패키지를 설치하고 `pod install`만 다시 실행하면 됩니다. 핵심 구현은 [`expo-modules-autolinking`](https://github.com/expo/expo/tree/main/packages/expo-modules-autolinking) 패키지에 있으며 세 부분으로 나뉩니다:

1.  모듈 해석 알고리즘을 담은 CLI 명령
2.  Android용 Gradle 빌드 시스템과 통합되는 코드
3.  iOS용 CocoaPods와 통합되는 코드

SDK 52부터 Expo Autolinking은 Expo 모듈뿐 아니라 React Native 모듈도 링크합니다. 대신 React Native community CLI autolinking을 사용하려면 [React Native 모듈에 대해 Expo Autolinking 비활성화](/modules/autolinking#opting-out-of-expo-autolinking-for-react-native-modules) 섹션을 참고하세요.

## Linking 동작 방식

Expo Autolinking은 Android의 Gradle 빌드 시스템과 iOS의 CocoaPods에 통합되어 있습니다. 앱을 빌드할 때 Expo Autolinking CLI가 호출되어 autolink할 Expo 및 React Native 모듈을 검색합니다.

이 모듈 해석 과정은 autolink 후보 의존성을 네 단계로 나누어 검색합니다:

1.  React Native 모듈에 한해, 프로젝트 루트의 **react-native.config.js**에서 명시적인 `root` path를 포함한 `dependencies`를 고려합니다. 이 파일은 선택 사항이며 대부분의 Expo 프로젝트에는 존재하지 않습니다.
2.  autolinking 구성의 `searchPaths` 옵션에 지정된 모든 디렉터리를 검색합니다.
3.  autolinking 구성의 `nativeModulesDir` 옵션에 지정된 디렉터리에서 로컬 모듈을 검색합니다. 기본값은 `./modules/`입니다.
4.  앱의 의존성과, 그 의존성 또는 peer dependency를 재귀적으로 해석합니다. 이는 [Node.js resolution algorithm](https://nodejs.org/api/modules.html#loading-from-node_modules-folders)과 일치합니다.

autolink된 모듈은 빌드에 자동으로 추가되며, 이는 보통 네이티브(플랫폼별) 코드를 포함한 앱의 의존성이 자동으로 설정된다는 뜻입니다.

## 구성

모듈 해석 동작은 몇 가지 구성 옵션으로 커스터마이즈할 수 있습니다. 이 옵션들은 우선순위가 낮은 것부터 높은 것까지 다음 세 곳에서 정의할 수 있습니다:

-   애플리케이션 **package.json**의 `expo.autolinking` config 객체
-   `expo.autolinking.ios`와 `expo.autolinking.android` 객체를 통한 플랫폼별 override
-   CLI 명령, **Podfile**의 `use_expo_modules!` 메서드, 또는 **settings.gradle**의 `useExpoModules` 함수에 전달되는 옵션

### `searchPaths`

Expo Autolinking이 autolink할 모듈을 검색해야 하는, 앱 루트 디렉터리를 기준으로 한 path 목록입니다. 프로젝트 구조가 커스텀되어 있거나 **node_modules**와 다른 디렉터리에 있는 로컬 패키지를 링크하려는 경우 유용합니다. 지정하는 path는 여전히 **node_modules** 디렉터리처럼 구성되어 있어야 합니다.

```json
{
  "expo": {
    "autolinking": {
      "searchPaths": ["../../packages"]
    }
  }
}
```

> **SDK 54 이전**에는 이 목록의 기본값이 앱의 **node_modules** 디렉터리와, monorepo에서 그 상위에 있는 모든 **node_modules** 디렉터리였습니다. 이전 동작으로 되돌리려면 이 목록을 앱의 **node_modules** 디렉터리들로 설정하세요. 예: `["../../node_modules", "./node_modules"]`.

### `nativeModulesDir`

Expo Autolinking이 autolink할 로컬 모듈을 검색해야 하는, 앱 루트 디렉터리를 기준으로 한 path입니다. 이 옵션의 기본값은 `"./modules"`입니다. 이 옵션을 바꾸는 것은 [로컬 Expo 모듈](/modules/get-started)의 path를 변경해야 하는 경우에만 유용합니다.

```json
{
  "expo": {
    "autolinking": {
      "nativeModulesDir": "./modules"
    }
  }
}
```

### `exclude`

autolinking에서 제외할 패키지 이름 목록입니다. 특정 플랫폼에서 사용하지 않는 패키지를 링크하지 않도록 해 바이너리 크기를 줄이고 싶을 때 유용합니다. 아래 **package.json** 구성은 Android에서 `expo-random`과 `third-party-expo-module`을 autolinking 대상에서 제외합니다:

```json
{
  "expo": {
    "autolinking": {
      "android": {
        "exclude": ["expo-random", "third-party-expo-module"]
      }
    }
  }
}
```

React Native 모듈도 프로젝트 루트에 **react-native.config.js**를 만들고, 해당 플랫폼에서 제외할 모듈의 플랫폼 구성을 `null`로 설정해 제외할 수 있습니다. 다음 구성은 Android에서 `library-name`을 autolinking 대상에서 제외합니다:

```js
module.exports = {
  dependencies: {
    'library-name': {
      platforms: {
        android: null,
      },
    },
  },
};
```

> **SDK 54 이전**에는 `exclude` 옵션이 Expo 모듈에만 적용되고 React Native 모듈에는 적용되지 않았습니다. React Native 모듈은 프로젝트 루트의 **react-native.config.js** 파일을 통해서만 제외할 수 있었습니다.

### `flags`

지원 플랫폼: iOS.

각 autolink된 pod에 전달할 CocoaPods 플래그입니다. 대부분의 개발자에게는 autolink된 모듈을 컴파일할 때 발생하는 Xcode 경고를 숨기기 위한 `inhibit_warnings`가 가장 유용할 가능성이 큽니다. 사용 가능한 플래그는 [CocoaPods Podfile documentation](https://guides.cocoapods.org/syntax/podfile.html#pod)를 참고하세요.

```ruby
use_expo_modules!({
  flags: {
    :inhibit_warnings => false
  }
})
```

```json
{
  "expo": {
    "autolinking": {
      "ios": {
        "flags": {
          "inhibit_warnings": true
        }
      }
    }
  }
}
```

### `buildFromSource`

지원 플랫폼: Android.

prebuilt Expo 모듈에서 제외할 패키지 이름 목록입니다. 전체 참조는 [Prebuilt Expo Modules for Android](/guides/prebuilt-expo-modules#selectively-opt-out)를 참고하세요.

### `legacy_shallowReactNativeLinking`

앱의 React Native 모듈을 해석할 때, Expo Autolinking은 앱의 의존성과 그 의존성의 의존성을 재귀적으로 검색합니다([Node.js resolution algorithm](https://nodejs.org/api/modules.html#loading-from-node_modules-folders)과 동일). **SDK 54 이전**에는 Expo Autolinking이 의존성을 재귀적으로 검색하지 않았고, 앱의 직접 의존성만 해석했습니다.

이 플래그를 활성화하면 새 동작을 비활성화하고 **SDK 54 이전**의 동작으로 되돌아가, React Native 모듈을 찾을 때 앱의 직접 의존성만 검색합니다. 이 옵션은 Expo 모듈을 해석할 때는 고려되지 않습니다.

## CLI 명령

### `search`

이 명령은 autolinking의 첫 번째 단계에서 Expo 모듈을 해석하기 위해 빌드 시스템이 호출합니다. 구현은 모든 플랫폼에서 공유됩니다. `search`의 출력에는 중복이 발견된 경우 패키지별 `duplicates` 목록이 포함됩니다.

```sh
npx expo-modules-autolinking search
```

위 명령은 Expo Autolinking이 찾은 Expo 모듈을 담은 JSON 형식 객체를 반환합니다:

```json
{
  "expo-random": {
    "path": "/absolute/path/to/node_modules/expo-random",
    "version": "13.0.0",
    "config": {
      // Contents of `expo-module.config.json`
    },
    "duplicates": [
      // List of conflicting duplicates for this module (with lower precedence)
    ]
  }
  // more modules...
}
```

### `resolve`

이 명령은 autolinking의 두 번째 단계에서 빌드 시스템이 호출합니다. 각 Expo 모듈에 대해 **build.gradle** 또는 podspec 파일의 path, 그리고 링크할 모듈 클래스 같은 더 많은 플랫폼별 세부 정보를 담은 객체를 출력합니다.

```sh
npx expo-modules-autolinking resolve --platform
```

예를 들어 `--platform apple` 옵션과 함께 사용하면, 플랫폼에 대한 모듈 배열과 해석된 세부 정보를 담은 JSON 형식 객체를 반환합니다:

```json
{
  "modules": [
    {
      "packageName": "expo-random",
      "packageVersion": "13.0.0",
      "pods": [
        {
          "podName": "ExpoRandom",
          "podspecDir": "/absolute/path/to/node_modules/expo-random/ios"
        }
      ],
      "swiftModuleNames": ["ExpoRandom"],
      "modules": ["RandomModule"],
      "appDelegateSubscribers": [],
      "reactDelegateHandlers": [],
      "debugOnly": false
    }
    // more modules...
  ]
}
```

### `verify`

중복을 검사해 autolink된 네이티브 모듈을 검증합니다. 충돌하는 중복 설치가 있을 때마다 경고가 표시됩니다.

```sh
npx expo-modules-autolinking verify
```

`--verbose` 옵션을 전달하면 autolink된 모든 네이티브 모듈을 나열합니다.

### `react-native-config`

이 명령은 React Native 모듈을 autolinking할 때 빌드 시스템이 호출합니다. 각 React Native 모듈에 대해 gradle 또는 podspec 파일의 path 같은 보다 플랫폼별 세부 정보를 담은 객체를 출력합니다.

```sh
npx expo-modules-autolinking react-native-config
```

예를 들어 `--platform ios` 옵션과 함께 사용하면, 각 React Native 의존성에 대한 정보와 React Native 설치 path를 담은 **react-native.config.js** 출력 형식의 객체를 반환합니다.

```json
{
  "root": "/absolute/path/to",
  "reactNativePath": "/absolute/path/to/node_modules/react-native",
  "dependencies": {
    "@react-native-async-storage/async-storage": {
      "root": "/absolute/path/to/node_modules/@react-native-async-storage/async-storage",
      "name": "@react-native-async-storage/async-storage",
      "platforms": {
        "ios": {
          "podspecPath": "/absolute/path/to/node_modules/@react-native-async-storage/async-storage/RNCAsyncStorage.podspec",
          "version": "",
          "configurations": [],
          "scriptPhases": []
        }
      }
    }
    // more modules...
  }
}
```

## 의존성 해석과 충돌

Autolinking과 Node 해석은 목표가 다르며, Node와 Metro의 모듈 해석 알고리즘은 때때로 충돌할 수 있습니다. 앱에 autolinking이 감지하는 네이티브 모듈의 중복 설치본이 포함되어 있으면, JavaScript 번들에는 두 버전의 네이티브 모듈이 모두 포함될 수 있지만 autolinking과 네이티브 앱에는 그중 하나만 포함됩니다. 이로 인해 런타임 크래시가 발생하거나 호환성 문제가 생길 수 있습니다.

이 문제는 특히 isolated dependencies나 monorepo에서 흔하며, [의존성 안의 네이티브 모듈을 점검하고 deduplicate](/guides/monorepos#duplicate-native-packages-within-monorepos)해야 합니다.

**SDK 54**부터는 [app config](/workflow/configuration)에서 `experiments.autolinkingModuleResolution`을 `true`로 설정해 Expo CLI와 Metro bundler에 autolinking을 자동 적용할 수 있습니다. 이렇게 하면 Metro가 해석하는 의존성이 **autolinking**이 해석하는 네이티브 모듈과 일치하도록 강제할 수 있습니다.

**SDK 55**부터는 monorepo 앱에서 `experiments.autolinkingModuleResolution` 플래그가 기본적으로 활성화됩니다.

## 자주 묻는 질문

### 앱에서 autolinking을 어떻게 설정하나요?

`npx create-expo-app` 명령으로 생성된 모든 프로젝트는 이미 Expo Autolinking을 사용하도록 구성되어 있습니다. 프로젝트가 다른 도구로 생성되었다면, 프로젝트에 필요한 변경 사항이 모두 포함되어 있는지 [Installing Expo modules](/bare/installing-expo-modules)를 참고해 확인하세요.

### 모듈이 autolink 가능하려면 무엇이 필요하나요?

모듈 해석 알고리즘은 루트 디렉터리의 **package.json** 옆에 [Expo module config](/modules/module-config) 파일(**expo-module.config.json**)이 있는 패키지만 검색합니다. 또한 `platforms` 배열에 지원하는 플랫폼을 포함해야 합니다. autolinking 알고리즘이 실행되는 플랫폼이 이 배열에 없으면 검색 결과에서 건너뜁니다.

### React Native community CLI autolinking과 어떻게 다른가요?

-   Expo Autolinking은 monorepo, 패키지 매니저 workspace, transitive dependencies, isolated dependencies 설치를 기본 지원합니다.
-   더 신뢰할 수 있고 Node.js의 모듈 해석과 일치하도록 모듈 해석 알고리즘이 더 복잡하지만, 속도도 훨씬 빠릅니다.
-   Expo 모듈 해석은 monorepo에서 흔한 문제인 중복 의존성도 감지할 수 있습니다.
-   마지막으로, Expo Modules API가 제공하는 기능과도 잘 통합되며 React Native 모듈도 지원합니다.

### React Native 모듈에 대해 Expo Autolinking 비활성화하기

SDK 52부터 Expo Autolinking은 기본적으로 React Native community CLI autolinking을 대체합니다. 대신 React Native community CLI의 autolinking을 사용하고 싶다면, 환경 변수 `EXPO_USE_COMMUNITY_AUTOLINKING=1`을 설정하고 프로젝트에 `@react-native-community/cli`를 dev dependency로 추가하세요.

이 환경 변수를 설정하면 Expo Autolinking은 React Native 모듈 해석에는 사용되지 않지만, Expo 모듈은 계속 autolink합니다.
