---
modificationDate: March 12, 2026
title: 기존 React Native 프로젝트에 Expo modules 설치하기
description: 기존 React Native 프로젝트에서 Expo module을 설치하고 사용하도록 준비하는 방법을 알아보세요.
---

# 기존 React Native 프로젝트에 Expo modules 설치하기

기존 React Native 프로젝트에서 Expo module을 설치하고 사용하도록 준비하는 방법을 알아보세요.

앱에서 Expo modules를 사용하려면 `expo` 패키지를 설치하고 설정해야 합니다.

`expo` 패키지는 부담이 작은 편입니다. 거의 모든 앱에 필요한 최소한의 패키지와, 다른 Expo SDK 패키지가 그 위에 구축되는 module 및 autolinking 인프라만 포함합니다. 프로젝트에 `expo` 패키지를 설치하고 설정한 뒤에는 `npx expo install`을 사용해 SDK의 다른 Expo module을 추가할 수 있습니다.

프로젝트를 [어떻게 초기화했는지](/bare/overview)에 따라 Expo modules를 설치하는 방법은 두 가지가 있습니다. [자동 설치](/bare/installing-expo-modules#automatic-installation) 또는 [수동 설치](/bare/installing-expo-modules#manual-installation)입니다.

## 자동 설치

Expo modules를 설치하고 사용하려면 `install-expo-modules` 명령으로 시작하는 것이 가장 쉬운 방법입니다.

```sh
npx install-expo-modules@latest
```

-   ✓ **명령이 성공하면** 앱에서 어떤 Expo module이든 추가할 수 있습니다. 자세한 내용은 [사용법](/bare/installing-expo-modules#usage)으로 이동하세요.
    
-   ✗ **명령이 실패하면** 수동 설치 안내를 따르세요. 코드를 프로그래밍 방식으로 업데이트하는 작업은 까다로울 수 있고, 프로젝트가 기본 React Native 프로젝트에서 많이 벗어나 있다면 수동 설치를 진행하면서 여기 안내를 코드베이스에 맞게 조정해야 합니다.
    

## 수동 설치

다음 안내는 React Native 0.83에 최신 버전의 Expo modules를 설치하는 경우에 적용됩니다. 이전 버전은 [native upgrade helper](/bare/upgrade)를 확인해 이 파일들이 어떻게 커스터마이즈되는지 살펴보세요.

```sh
npm install expo
```

설치가 끝나면 아래 diff의 변경 사항을 적용해 프로젝트에서 Expo modules를 설정하세요. 이 작업은 약 5분 정도 걸리며, 프로젝트가 얼마나 커스터마이즈되어 있는지에 따라 약간의 조정이 필요할 수 있습니다.

### Android 설정

### iOS 설정

선택적으로 **AppDelegate.swift**에 추가 delegate method도 넣을 수 있습니다. 일부 라이브러리는 이 메서드를 필요로 하므로, 특별히 제외해야 할 이유가 없다면 추가하는 것을 권장합니다. [AppDelegate.swift의 delegate methods 보기](https://github.com/expo/expo/blob/sdk-54/templates/expo-template-bare-minimum/ios/HelloWorld/AppDelegate.swift#L24-L42).

모든 변경 사항을 저장한 뒤 Xcode에서 iOS Deployment Target을 `iOS 15.1`로 업데이트하세요:

-   Xcode에서 **your-project-name.xcworkspace**를 열고, 왼쪽 사이드바에서 프로젝트를 선택합니다.
-   **Targets** > **your-project-name** > **Build Settings** > **iOS Deployment Target**을 선택하고 값을 `iOS 15.1`로 설정합니다.

마지막 단계는 **Podfile**에 추가한 `use_expo_modules!` 지시어로 감지된 Expo modules를 끌어오기 위해 프로젝트의 CocoaPods를 다시 설치하는 것입니다:

```sh
npx pod-install
npx expo run:ios
```

### Android와 iOS에서 번들링하도록 Expo CLI 구성하기

앱의 JavaScript 코드와 에셋을 번들링할 때는 Expo CLI와 관련 도구 구성을 사용하는 것을 권장합니다. 이렇게 하면 **package.json**의 `"main"` 필드를 사용해 [Expo Router](/router/introduction) 라이브러리를 쓸 수 있도록 지원이 추가됩니다. 번들링에 Expo CLI를 사용하지 않으면 예상치 못한 동작이 발생할 수 있습니다. [Expo CLI에 대해 더 알아보기](/bare/using-expo-cli).

`babel.config.js`에서 babel-preset-expo 사용하기

`metro.config.js`에서 expo/metro-config 확장하기

Android 프로젝트가 Expo CLI로 번들링되도록 구성하기

iOS 프로젝트가 Expo CLI로 번들링되도록 구성하기

Xcode의 **Build Phases** > **Bundle React Native code and images** 아래 셸 스크립트를 다음 내용으로 교체하세요:

```sh
if [[ -f "$PODS_ROOT/../.xcode.env" ]]; then
  source "$PODS_ROOT/../.xcode.env"
fi
if [[ -f "$PODS_ROOT/../.xcode.env.local" ]]; then
  source "$PODS_ROOT/../.xcode.env.local"
fi

# The project root by default is one level up from the ios directory
export PROJECT_ROOT="$PROJECT_DIR"/..

if [[ "$CONFIGURATION" = *Debug* ]]; then
  export SKIP_BUNDLING=1
fi
if [[ -z "$ENTRY_FILE" ]]; then
  # Set the entry JS file using the bundler's entry resolution.
  export ENTRY_FILE="$("$NODE_BINARY" -e "require('expo/scripts/resolveAppEntry')" "$PROJECT_ROOT" ios relative | tail -n 1)"
fi

if [[ -z "$CLI_PATH" ]]; then
  # Use Expo CLI
  export CLI_PATH="$("$NODE_BINARY" --print "require.resolve('@expo/cli')")"
fi
if [[ -z "$BUNDLE_COMMAND" ]]; then
  # Default Expo CLI command for bundling
  export BUNDLE_COMMAND="export:embed"
fi

`"$NODE_BINARY" --print "require('path').dirname(require.resolve('react-native/package.json')) + '/scripts/react-native-xcode.sh'"`
```

그리고 **package.json**의 `"main"` 필드를 지원하도록 **AppDelegate.swift**를 다음과 같이 변경하세요:

```diff
override func bundleURL() -> URL? {
  #if DEBUG
- RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
+ RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: ".expo/.virtual-metro-entry")
  #else
  Bundle.main.url(forResource: "main", withExtension: "jsbundle")
  #endif
  }
```

## 사용법

### 설치 확인하기

설치가 성공했는지는 [`expo-constants`](/versions/latest/sdk/constants)의 값을 로그로 출력해 확인할 수 있습니다.

-   `npx expo install expo-constants`를 실행합니다.
-   그런 다음 `npx expo run`을 실행하고 앱의 JavaScript 코드에 다음 내용을 추가합니다:

```js
import Constants from 'expo-constants';
console.log(Constants.systemFonts);
```

### Expo SDK 패키지 사용하기

프로젝트에 `expo` 패키지가 설치되고 설정된 뒤에는 `npx expo install`을 사용해 SDK의 다른 Expo module을 추가할 수 있습니다. 자세한 내용은 [라이브러리 사용하기](/workflow/using-libraries)를 참고하세요.

### `expo` 패키지에 포함되는 Expo modules

다음 Expo modules는 `expo` 패키지의 의존성으로 함께 설치됩니다:

-   [`expo-asset`](/versions/latest/sdk/asset) - `expo-file-system`을 기반으로 구축된 JavaScript 전용 패키지이며, 모든 Expo module에서 에셋을 다루기 위한 공통 기반을 제공합니다.
-   [`expo-constants`](/versions/latest/sdk/constants) - 매니페스트에 접근할 수 있게 해줍니다.
-   [`expo-file-system`](/versions/latest/sdk/filesystem) - 기기 파일 시스템과 상호작용합니다. `expo-asset`과 여러 다른 Expo module에서 사용되며, 개발자가 애플리케이션 코드에서 직접 사용하는 경우도 많습니다.
-   [`expo-font`](/versions/latest/sdk/font) - 런타임에 폰트를 로드합니다. 이 module은 선택 사항이므로 안전하게 제거할 수 있지만, 개발에 `expo-dev-client`를 사용한다면 권장되며 `@expo/vector-icons`에서는 필수입니다.
-   [`expo-keep-awake`](/versions/latest/sdk/keep-awake) - 앱을 개발하는 동안 기기가 잠들지 않도록 합니다. 이 module은 선택 사항이므로 안전하게 제거할 수 있습니다.

이들 module 중 일부를 제외하려면 [autolinking에서 module 제외하기](/bare/installing-expo-modules#excluding-specific-modules-from-autolinking) 가이드를 참고하세요.

### autolinking에서 특정 module 제외하기

사용하지 않는 Expo modules의 네이티브 코드가 다른 의존성에 의해 함께 설치되었고 이를 제외해야 한다면, **package.json**의 [`expo.autolinking.exclude`](/modules/autolinking#exclude) 속성을 사용할 수 있습니다:

```json
{
  "name": "...",
  "dependencies": {},
  "expo": {
    "autolinking": {
      "exclude": ["expo-keep-awake"]
    }
  }
}
```
