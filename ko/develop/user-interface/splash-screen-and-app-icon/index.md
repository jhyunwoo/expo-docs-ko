---
modificationDate: March 01, 2026
title: Splash screen과 app icon
description: Expo 프로젝트에 splash screen과 app icon을 추가하는 방법을 알아보세요.
---

# Splash screen과 app icon

Expo 프로젝트에 splash screen과 app icon을 추가하는 방법을 알아보세요.

splash screen과 app icon은 모바일 앱의 기본 요소입니다. 사용자 경험과 앱 브랜딩에서 중요한 역할을 합니다. 이 가이드는 이를 만들고 앱에 추가하는 방법을 안내합니다.

[App Icon과 Splash Screen 만들기](https://www.youtube.com/watch?v=3Bsw8a1BJoQ) — Expo 프로젝트용 app icon과 splash screen을 만드는 자세한 walkthrough를 확인하세요.

## Splash screen

splash screen은 launch screen이라고도 하며, 사용자가 앱을 열었을 때 가장 먼저 보게 되는 화면입니다. 앱이 로딩되는 동안 계속 표시됩니다. 네이티브 [SplashScreen API](/versions/latest/sdk/splash-screen)를 사용하면 splash screen이 사라지는 시점을 제어할 수도 있습니다.

[`expo-splash-screen`](/versions/latest/sdk/splash-screen)에는 splash icon과 background color 같은 속성을 구성할 수 있게 해 주는 내장 [config plugin](/config-plugins/introduction)이 있습니다.

> **splash screen을 테스트할 때는 Expo Go나 development build를 사용하지 마세요**. Expo Go는 splash screen이 표시되는 동안 앱 icon을 렌더링하므로 테스트를 방해할 수 있습니다. development build에는 `expo-dev-client`가 포함되어 있어 자체 splash screen을 가지며 충돌을 일으킬 수 있습니다. **대신 [preview build](/build/eas-json#preview-builds) 또는 [production build](/build/eas-json#production-builds)를 사용하세요**.

### splash screen icon 만들기

splash screen icon을 만들려면 이 [Figma template](https://www.figma.com/community/file/1466490409418563617)를 사용할 수 있습니다. Android와 iOS용 icon 및 splash 이미지를 위한 최소 디자인이 제공됩니다.

**권장 사항:**

-   1024x1024 이미지를 사용하세요.
-   **.png** 파일을 사용하세요.
-   투명한 배경을 사용하세요.

### splash icon을 .png로 내보내기

splash screen icon을 만든 뒤 **.png**로 export하고 **assets/images** 디렉터리에 저장하세요. 기본적으로 Expo는 파일 이름으로 **splash-icon.png**를 사용합니다. splash screen 파일 이름을 바꾸기로 했다면 다음 단계에서 그 이름을 사용해야 합니다.

> **참고:** **현재 Expo 프로젝트에서 splash screen icon으로 사용할 수 있는 형식은 .png 이미지만 지원됩니다**. 다른 이미지 형식을 사용하면 앱의 production build가 실패합니다.

### splash screen icon 구성하기

app config 파일을 열고 plugins 아래에 다음 속성을 설정하세요:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#232323",
          "image": "./assets/images/splash-icon.png",
          "dark": {
            "image": "./assets/images/splash-icon-dark.png",
            "backgroundColor": "#000000"
          },
          "imageWidth": 200
        }
      ]
    ]
  }
}
```

새 splash screen을 테스트하려면 앱을 [internal distribution](/tutorial/eas/internal-distribution-builds) 또는 production용으로 빌드하세요. [Android](/tutorial/eas/android-production-build)와 [iOS](/tutorial/eas/ios-production-build) 가이드를 참고하세요.

[구성 가능한 splash screen 속성](/versions/latest/sdk/splash-screen#configurable-properties) — SplashScreen API에서 구성할 수 있는 속성을 알아보세요.

Android와 iOS에 대해 `expo-splash-screen` 속성을 별도로 구성하기

[`expo-splash-screen`](/versions/latest/sdk/splash-screen)은 특정 플랫폼의 splash screen을 구성하기 위한 `android`와 `ios` 속성도 지원합니다. 다음 예제를 참고하세요:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-splash-screen",
        {
          "ios": {
            "backgroundColor": "#ffffff",
            "image": "./assets/images/splash-icon.png",
            "resizeMode": "cover"
          },
          "android": {
            "backgroundColor": "#0c7cff",
            "image": "./assets/images/splash-android-icon.png",
            "imageWidth": 150
          }
        }
      ]
    ]
  }
}
```

prebuild를 사용하지 않나요?

앱이 네이티브 **android**와 **ios** 디렉터리를 생성하기 위해 [Expo Prebuild](/more/glossary-of-terms#prebuild)(이전의 _managed workflow_)를 사용하지 않는다면, app config의 변경 사항은 아무 효과가 없습니다. 자세한 내용은 [수동으로 구성을 사용자 지정하는 방법](https://github.com/expo/expo/tree/main/packages/expo-splash-screen#-installation-in-bare-react-native-projects)을 참고하세요.

문제 해결: iOS에서 새 splash screen이 나타나지 않음

SDK 52 이하의 iOS development build에서는 launch screen이 빌드 사이에 cache되어 새 이미지를 테스트하기 어려운 경우가 있습니다. Apple은 rebuild 전에 _derived data_ 디렉터리를 지우는 것을 권장하며, Expo CLI에서는 다음 명령으로 이를 수행할 수 있습니다:

```sh
npx expo run:ios --no-build-cache
```

자세한 내용은 [launch screen 테스트에 대한 Apple 가이드](https://developer.apple.com/documentation/technotes/tn3118-debugging-your-apps-launch-screen)를 참고하세요.

## App icon

앱 icon은 사용자가 기기의 홈 화면과 app store에서 보게 되는 아이콘입니다. Android와 iOS는 서로 다른 엄격한 요구 사항을 가지고 있습니다.

### app icon 만들기

app icon을 만들려면 이 [Figma template](https://www.figma.com/community/file/1466490409418563617)를 사용할 수 있습니다. Android와 iOS용 icon 및 splash 이미지를 위한 최소 디자인이 제공됩니다.

### icon 이미지를 .png로 내보내기

app icon을 만든 뒤 **.png**로 export하고 **assets/images** 디렉터리에 저장하세요. 기본적으로 Expo는 파일 이름으로 **icon.png**를 사용합니다. 다른 파일 이름을 쓰기로 했다면 다음 단계에서 반드시 그 이름을 사용하세요.

### app config에 icon 추가하기

app config를 열고 새 app icon을 가리키도록 [`icon`](/versions/latest/config/app#icon) 속성 값에 로컬 경로를 추가하세요:

```json
{
  "icon": "./assets/images/icon.png"
}
```

Android와 iOS용 custom 구성 팁

#### Android

Android icon의 추가 사용자 지정은 [`android.adaptiveIcon`](/versions/latest/config/app#adaptiveicon) 속성을 사용해 가능하며, 이 속성은 앞서 언급한 설정을 모두 덮어씁니다.

Android Adaptive Icon은 foreground image와 background color 또는 image라는 두 개의 분리된 layer로 구성됩니다. 이를 통해 운영체제가 icon을 다양한 모양으로 mask할 수 있고 시각 효과도 지원할 수 있습니다. Android 13 이상에서는 기기 theme가 정한 wallpaper와 theme를 사용해 색상을 결정하는 themed app icon도 지원합니다.

제공하는 디자인은 launcher icon을 위한 [Android Adaptive Icon Guidelines](https://developer.android.com/develop/ui/views/launch/icon_design_adaptive)를 따라야 합니다. 또한 다음도 지켜야 합니다:

-   **.png** 파일을 사용하세요.
-   foreground image 경로를 지정하려면 `android.adaptiveIcon.foregroundImage` 속성을 사용하세요.
-   monochrome image 경로를 지정하려면 `android.adaptiveIcon.monochromeImage` 속성을 사용하세요.
-   기본 background color는 흰색입니다. 다른 background color를 지정하려면 `android.adaptiveIcon.backgroundColor` 속성을 사용하세요. 대신 `android.adaptiveIcon.backgroundImage` 속성으로 background image를 지정할 수도 있습니다. 이 image는 foreground image와 같은 크기여야 합니다.

Adaptive Icon을 지원하지 않는 오래된 Android 기기를 위해 별도의 icon을 제공하고 싶을 수도 있습니다. 이 경우 `android.icon` 속성을 사용할 수 있습니다. 이 단일 icon은 foreground와 background layer를 합친 형태가 됩니다.

> icon이 전문적으로 보이도록, 서로 다른 wallpaper에서 icon을 테스트하고 제품 wordmark 옆에 텍스트를 피하는 등의 [Apple best practices](https://developer.apple.com/design/human-interface-guidelines/app-icons/#Best-practices)를 참고하세요. 아이콘은 최소 512x512 픽셀 이상으로 제공하세요.

#### iOS

[Icon Composer](https://www.youtube.com/watch?v=RZ_QMym3adw) — Expo 프로젝트용 app icon을 만들기 위해 새로운 Icon Composer를 사용하는 방법을 알아보세요.

iOS에서는 app icon이 [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/app-icons/)를 따라야 합니다. [Icon Composer](https://developer.apple.com/icon-composer/) 앱을 사용해 app icon을 만들 수 있습니다. 그러면 프로젝트의 **assets** 디렉터리에 추가할 수 있는 **.icon** 디렉터리가 출력됩니다. 그 뒤 app config에서 이 디렉터리 경로를 제공하면 됩니다. dark mode 지원은 Icon Composer에서 처리되므로, 이 접근 방식을 사용할 때는 별도의 variant를 제공할 필요가 없습니다.

> **참고:** `ios.icon`을 통해 Icon Composer **.icon** 디렉터리를 제공하는 기능은 **SDK 54** 이상에서 지원됩니다.

```json
{
  "expo": {
    "ios": {
      "icon": "./assets/app.icon"
    }
  }
}
```

이전 방식처럼 이미지를 제공하는 방법도 여전히 지원됩니다. 다음 사항을 지켜야 합니다:

-   **.png** 파일을 사용하세요.
-   1024x1024가 적절한 크기입니다. `npx create-expo-app`으로 만든 Expo 프로젝트라면 [EAS Build](/build/setup)가 다른 크기들을 생성해 줍니다. bare React Native 프로젝트라면 아이콘을 직접 생성해야 합니다. EAS Build가 생성하는 가장 큰 크기는 1024x1024입니다.
-   icon은 정확히 정사각형이어야 합니다. 예를 들어 1023x1024 아이콘은 유효하지 않습니다.
-   icon이 둥근 모서리나 다른 투명 픽셀 없이 정사각형 전체를 채우도록 하세요. 운영체제가 필요한 경우 icon을 mask합니다.
-   다양한 시스템 appearance(예: dark, tinted)에 맞는 다른 icon을 제공하려면 `ios.icon`을 사용할 수 있습니다. 이 값이 지정되면 app config 파일의 최상위 icon 키를 덮어씁니다. 아래 예제를 참고하세요:

```json
{
  "expo": {
    "ios": {
      "icon": {
        "dark": "./assets/images/ios-dark.png",
        "light": "./assets/images/ios-light.png",
        "tinted": "./assets/images/ios-tinted.png"
      }
    }
  }
}
```
