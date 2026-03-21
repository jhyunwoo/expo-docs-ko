---
modificationDate: February 10, 2025
title: expo-module.config.json
description: expo-module.config.json에서 사용할 수 있는 다양한 구성 옵션을 알아보세요.
---

# expo-module.config.json

expo-module.config.json에서 사용할 수 있는 다양한 구성 옵션을 알아보세요.

Expo 모듈은 **expo-module.config.json**에서 구성됩니다. 이 파일은 현재 autolinking과 모듈 등록을 구성할 수 있습니다. 다음 속성을 사용할 수 있습니다:

-   `platforms` — 지원되는 플랫폼 배열입니다. 허용되는 값은 `android`, `apple`(또는 더 세분화된 `ios` / `macos` / `tvos` 사용), `web`, `devtools`입니다([Create a dev tools plugin](/debugging/create-devtools-plugins) 참고).
-   `apple` — Apple 플랫폼 전용 옵션이 있는 config
    -   `modules` — 생성된 modules provider 파일에 넣을 Swift 네이티브 모듈 클래스 이름입니다.
    -   `appDelegateSubscribers` — AppDelegate lifecycle 이벤트를 받기 위해 `ExpoAppDelegate`에 연결되는 Swift 클래스 이름입니다.
-   `android` — Android 플랫폼 전용 옵션이 있는 config
    -   `modules` — 생성된 package provider 파일에 넣을 Kotlin 네이티브 모듈 클래스의 전체 이름(package + class name)입니다.
