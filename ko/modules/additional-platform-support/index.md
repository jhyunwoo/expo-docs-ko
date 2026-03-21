---
modificationDate: March 06, 2026
title: 추가 플랫폼 지원
description: macOS와 tvOS 플랫폼 지원을 추가하는 방법을 알아보세요.
---

# 추가 플랫폼 지원

macOS와 tvOS 플랫폼 지원을 추가하는 방법을 알아보세요.

Expo Modules API는 Android와 iOS를 최상급으로 지원합니다. 하지만 모든 Apple 플랫폼은 같은 기반 위에 있으며 같은 프로그래밍 언어를 사용하므로, Expo 모듈에서 다른 [Out-of-Tree platforms](https://reactnative.dev/docs/out-of-tree-platforms)를 대상으로 하는 것도 가능합니다.

현재는 **macOS**와 **tvOS** 플랫폼만 지원됩니다. 이 가이드는 이들 플랫폼에 대한 지원을 추가하는 과정을 안내합니다.

## `expo-module.config.json`에서 `"apple"` 플랫폼 사용하기

다른 Apple 플랫폼을 자연스럽게 지원하기 위해 Expo SDK는 범용 `"apple"` 플랫폼을 도입했습니다. 이는 [autolinking](/modules/autolinking)에 모듈이 Apple 플랫폼 전반을 지원할 수 있음을 알려주며, 특정 CocoaPods target에서 모듈을 연결할지 여부는 podspec이 결정하도록 옮겨졌습니다. 이전에 `"ios"`를 사용했다면 안전하게 다음처럼 바꿀 수 있습니다:

```diff
- "platforms": ["ios"],
- "ios": {
- "modules": ["MyModule"]
- }
+ "platforms": ["apple"],
+ "apple": {
+ "modules": ["MyModule"]
+ }
  }
```

## 다른 플랫폼 지원을 선언하도록 podspec 업데이트하기

모듈의 podspec은 지원하는 플랫폼 목록으로 업데이트해야 합니다. 그렇지 않으면 다른 플랫폼용 target에서 CocoaPods가 pod 설치에 실패할 수 있습니다. 첫 단계에서 언급했듯이, 모듈이 범용 `"apple"` 플랫폼으로 구성되어 있을 때 autolinking의 기준 정보는 이 spec 부분입니다.

```diff
- s.platform       = :ios, '13.4'
+ s.platforms = {
+ :ios => '13.4',
+ :tvos => '13.4',
+ :osx => '10.15'
+ }
```

podspec의 변경 사항을 적용하려면 `pod install`을 실행해야 합니다.

## 앱에서 `react-native-macos` 또는 `react-native-tvos` 설정하기

로컬 모듈을 작성 중이고 앱이 이미 설정되어 있다면 이 단계는 건너뛰어도 됩니다. 그렇지 않다면 앱 또는 standalone(비로컬) 모듈을 작성하는 경우 example 앱을 설정해야 합니다.

-   **macOS의 경우**: `react-native-macos` 문서의 공식 [Install React Native for macOS](https://microsoft.github.io/react-native-macos/docs/getting-started) 가이드를 따르세요.
-   **tvOS의 경우**: [`react-native-tvos`](https://github.com/react-native-tvos/react-native-tvos) 저장소의 안내를 따르세요. Expo 앱을 빌드하는 경우 [Build Expo apps for TV guide](/guides/building-for-tv)의 안내도 함께 따라야 합니다.

## 이들 플랫폼에서 지원되지 않는 API를 사용하는 코드 검토하기

플랫폼 API는 Apple 플랫폼마다 다를 수 있습니다. 가장 눈에 띄는 차이는 서로 다른 UI framework에 의존한다는 점입니다. iOS/tvOS는 `UIKit`을, macOS는 `AppKit`을 사용합니다.

`react-native-macos`와 `expo-modules-core`는 모두 macOS target에서 `UIKit` 클래스를 참조할 수 있도록 alias와 polyfill을 제공합니다(예: `UIView`는 `NSView`의 alias이고, `UIApplication`은 `NSApplication`의 alias입니다). 하지만 보통 이것만으로는 iOS 우선 라이브러리가 다른 플랫폼을 즉시 지원하기에 충분하지 않습니다. 플랫폼에 따라 다른 구현을 사용하는 조건부 컴파일 코드를 작성해야 할 수도 있습니다.

이를 위해 `os` 조건을 갖는 Swift compiler directive를 사용하세요. 이는 앱이 특정 플랫폼용으로 빌드될 때 주어진 코드 조각을 포함합니다. `#if` 및 `#else` directive와 함께 사용하면 크로스 플랫폼 코드 안에서 플랫폼별 분기를 설정할 수 있습니다.

```swift
#if os(iOS)
  // iOS implementation
#elseif os(macOS)
  // macOS implementation
#elseif os(tvOS)
  // tvOS implementation
#endif
```

이제 모듈은 Out-of-Tree platform에서 사용할 준비가 되었습니다.
