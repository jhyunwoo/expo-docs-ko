---
modificationDate: December 30, 2024
title: 기존 라이브러리에 통합하기
description: 기존 React Native 라이브러리에 Expo Modules API를 통합하는 방법을 알아보세요.
---

# 기존 라이브러리에 통합하기

기존 React Native 라이브러리에 Expo Modules API를 통합하는 방법을 알아보세요.

기존 React Native 라이브러리에 Expo Modules API를 통합하고 싶을 때가 있습니다. 예를 들어 라이브러리를 점진적으로 다시 작성하거나, [Android lifecycle listeners](/modules/android-lifecycle-listeners)와 [iOS AppDelegate subscribers](/modules/appdelegate-subscribers)를 활용해 라이브러리 설정을 자동화하고 싶을 수 있습니다.

이 가이드는 기존 React Native 라이브러리에서 Expo Modules API에 접근할 수 있도록 설정하는 방법을 안내합니다.

## 사전 준비

프로젝트 루트에 [**expo-module.config.json**](/modules/module-config) 파일을 만들고, 내부에 빈 객체 `{}`를 추가하세요. 이후 특정 기능을 활성화하기 위해 이 파일 내용을 채우게 됩니다.

이 파일을 만드는 것은 [Expo Autolinking](/modules/autolinking)이 라이브러리를 Expo 모듈로 인식하고 네이티브 코드를 자동으로 링크하는 데 필요합니다.

## `expo-modules-core` 네이티브 의존성 추가하기

**build.gradle**과 **podspec** 파일에 `expo-modules-core`를 의존성으로 추가하세요:

```groovy
// ...
dependencies {
  // ...
  implementation project(':expo-modules-core')
}
```

```ruby
# ...
Pod::Spec.new do |s|
  # ...
  s.dependency 'ExpoModulesCore'
end
```

## 의존성에 Expo 패키지 추가하기

**package.json**에 `expo` 패키지를 peer dependency로 추가하세요. 사용자 **node_modules** 디렉터리 안에 중복 패키지가 생기지 않도록 버전 범위는 `*`를 사용하는 것을 권장합니다.

라이브러리는 `expo-modules-core`에도 의존해야 하지만, 이는 dev dependency로만 추가하면 됩니다. 이 패키지는 이미 라이브러리를 사용하는 프로젝트에서 `expo` 패키지를 통해 제공되며, 해당 프로젝트에서 사용하는 특정 SDK와 호환되는 core 버전이 함께 설치됩니다.

```json
{
  ... 
  "devDependencies": {
    "expo-modules-core": "^X.Y.Z"
  },
  "peerDependencies": {
    "expo": "*"
  },
  "peerDependenciesMeta": {
    "expo": {
      "optional": true
    }
  }
}
```

## 네이티브 모듈 만들기

아래 템플릿을 바탕으로 Kotlin과 Swift 파일을 만드세요:

```kotlin
package my.module.package

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class MyModule : Module() {
  override fun definition() = ModuleDefinition {
    // Definition components go here
  }
}
```

```swift
import ExpoModulesCore

public class MyModule: Module {
  public func definition() -> ModuleDefinition {
    // Definition components go here
  }
}
```

그다음 [**expo-module.config.json**](/modules/module-config) 파일의 Android 및/또는 iOS `modules`에 해당 클래스를 추가하세요. Expo Autolinking이 이 클래스를 사용자의 프로젝트에서 네이티브 모듈로 자동 연결해 줍니다.

```json
{
  "ios": {
    "modules": ["MyModule"]
  },
  "android": {
    "modules": ["my.module.package.MyModule"]
  }
}
```

워크스페이스에 이미 example 앱이 있다면, 모듈이 올바르게 링크되는지 확인하세요.

-   **Android에서는** Gradle 빌드 작업의 일부로 빌드 전에 네이티브 모듈 클래스가 자동으로 링크됩니다.
-   **iOS에서는** 새 클래스를 링크하기 위해 `pod install`을 실행해야 합니다.

이제 이 모듈 클래스들은 `expo-modules-core` 패키지의 `requireNativeModule` 함수를 사용해 JavaScript 코드에서 접근할 수 있습니다. 단순화를 위해 네이티브 모듈을 export하는 별도 파일을 만드는 것을 권장합니다.

```ts
import { requireNativeModule } from 'expo-modules-core';

export default requireNativeModule('MyModule');
```

이제 클래스가 설정되고 링크되었으므로 기능 구현을 시작할 수 있습니다. API 사용법을 이해하려면 [native module API](/modules/module-api) 참조 페이지와, 단순한 예제부터 중간 수준의 실제 모듈까지 연결된 [examples](/modules/module-api#examples)를 참고하세요.
