---
modificationDate: September 17, 2024
title: 'Expo Modules API: 설계 고려 사항'
description: Expo Modules API의 설계 배경에 있는 고려 사항을 개괄적으로 설명합니다.
---

# Expo Modules API: 설계 고려 사항

Expo Modules API의 설계 배경에 있는 고려 사항을 개괄적으로 설명합니다.

Expo 팀은 많은 수의 라이브러리를 유지보수하고 있으며, 끊임없이 변하는 환경 속에서 네이티브 모듈을 장기간 유지보수하는 일은 어려울 수 있습니다. Expo Modules API를 통해 우리는 이러한 라이브러리를 더 쉽게 만들고 유지보수할 수 있게 해주는 강력한 도구를 구축하고자 했습니다.

### 최신 언어 기능 활용하기

Expo SDK에서 50개가 넘는 네이티브 모듈을 수년간 유지보수하면서, 많은 문제가 처리되지 않은 null 값이나 잘못된 타입 때문에 발생한다는 사실을 알게 되었습니다. 최신 언어 기능은 개발자가 이런 버그를 피하도록 도와줄 수 있습니다. 예를 들어 Objective-C는 동적이라는 특성과 optional type의 부재가 결합되어, Swift에서는 컴파일러가 잡아줬을 특정 종류의 버그를 잡아내기 어렵게 만들었습니다.

React Native 모듈을 작성할 때의 또 다른 어려움은 플랫폼마다 네이티브 모듈을 작성하는 언어와 패러다임이 크게 달라서 발생하는 컨텍스트 전환입니다. 이러한 플랫폼 차이 때문에 이를 완전히 없앨 수는 없습니다. 하지만 우리는 개발을 최대한 단순화하고, 한 명의 개발자가 여러 플랫폼에서 하나의 라이브러리를 더 쉽게 유지보수할 수 있도록 하나의 공통 API와 문서가 필요하다고 느꼈습니다.

이것이 Expo Modules 생태계를 최신 네이티브 언어인 Swift와 Kotlin으로 사용할 수 있도록 처음부터 설계한 이유 중 하나입니다.

### 런타임 간 데이터 전달을 쉽게 만들기

Expo Modules API는 네이티브 함수가 기대하는 인자 타입을 완전히 알고 있습니다. 이 API는 인자를 미리 검증하고 변환할 수 있으며, dictionary는 우리가 [Records](/modules/module-api#records)라고 부르는 네이티브 struct로 표현될 수 있습니다.

이 API로 해결하고자 했던 큰 문제 중 하나는 JavaScript에서 네이티브 함수로 전달되는 인자의 검증입니다. 이는 특히 런타임에서 값의 타입을 알 수 없고 각 속성을 개발자가 개별적으로 검증해야 하는 `NSDictionary` 또는 `ReadableMap`에서 오류가 발생하기 쉽고, 시간도 오래 걸리며, 유지보수도 어렵습니다.

인자 타입을 알고 있기 때문에, 일부 플랫폼별 타입으로 [인자를 자동 변환](/modules/module-api#convertibles)하는 것도 가능합니다(예를 들어 `{ x: number, y: number }` 또는 `[number, number]`는 편의를 위해 CoreGraphics의 `CGPoint`로 변환될 수 있습니다).

요약하면, Expo Modules는 강력한 내장형 타입 변환과 확장 가능한 타입 안전성을 제공합니다. primitive 값(예: `Bool`/`Int`/`UInt`/`Float32`/`Double`/`Pair`/`String`), 복잡한 내장 타입(예: `URL`, `CGPoint`, `UIColor`, `Data`, `java.net.URL`, `android.graphics.Color`, `kotlin.ByteArray`), records(사용자 정의 타입, 예: `struct`/`Object`), enum의 자동 변환을 지원합니다.

### 표현력 있는 객체 지향 API 지원하기

네이티브 모듈 상태의 source of truth를 JavaScript와 네이티브 양쪽에 흩어놓고 직접 관련 bookkeeping을 하는 대신, 한 곳에 유지하세요. 우리는 이 기능을 **Shared Objects**라고 부릅니다. 예를 들어 [`expo-sqlite` database instance는 Shared Objects로 뒷받침됩니다](https://github.com/expo/expo/blob/718a9ac107231475ca4b2e6427317ade9d1e70fa/packages/expo-sqlite/src/SQLiteDatabase.ts#L421). Shared Objects에 대한 자세한 문서는 곧 제공될 예정입니다.

### 앱 lifecycle 이벤트에 연결할 수 있는 안전하고 조합 가능한 메커니즘 제공하기

[Android lifecycle listeners](/modules/android-lifecycle-listeners)와 [iOS AppDelegate subscribers](/modules/appdelegate-subscribers)는 모듈 코드를 `MainActivity`와 `AppDelegate` 클래스에 분산시키거나 라이브러리 사용자에게 같은 작업을 요구하지 않고도 앱 lifecycle에 연결할 수 있게 해주는 강력한 기능입니다. 이는 특히 [Continuous Native Generation](/workflow/continuous-native-generation)과의 매끄러운 통합에 유용한데, 라이브러리가 다른 라이브러리들이 무엇을 하고 있는지 걱정할 필요 없이 조합 가능한 방식으로 앱 lifecycle 이벤트에 연결할 수 있는 메커니즘을 제공하기 때문입니다.

### 새로운 아키텍처를 지원하면서도 이전 버전과의 호환성 유지하기

React Native 0.68은 모바일 앱 개발을 위한 새로운 기능을 제공하는 [New Architecture](https://reactnative.dev/docs/the-new-architecture/landing-page)를 도입했습니다. 이 아키텍처는 [Turbo Modules](https://reactnative.dev/docs/the-new-architecture/pillars-turbomodules)라는 새로운 네이티브 모듈 시스템과 [Fabric](https://reactnative.dev/architecture/fabric-renderer)라는 새로운 렌더링 시스템으로 구성됩니다. 네이티브 라이브러리는 이 새로운 시스템을 활용하기 위해 적응해야 합니다. 특히 Fabric의 경우 호환성 계층을 제공하지 않기 때문에 더 많은 작업이 필요합니다. 즉, 기존 방식으로 작성된 view manager는 Fabric에서 동작하지 않고, 반대로 Fabric 네이티브 컴포넌트는 기존 렌더러에서 동작하지 않습니다. 결국 기존 라이브러리는 한동안 두 아키텍처를 모두 지원해야 하므로 기술 부채가 증가하게 됩니다.

새 아키텍처는 대부분 C++로 작성되어 있으므로, 라이브러리에도 어느 정도 C++ 코드를 작성해야 할 수 있습니다. 우리 역시 다른 React Native 개발자들과 마찬가지로 일상적으로 고수준 JavaScript를 사용하므로, 그 반대편에 있는 C++를 작성하는 데에는 다소 신중할 수밖에 없습니다. 게다가 라이브러리에 C++ 코드를 포함하면 특히 Android에서 빌드 시간이 길어지고, 디버깅도 더 어려워질 수 있습니다.

우리는 Expo Modules API를 설계할 때 이 점들을 고려했고, 모듈이 앱이 새 아키텍처에서 실행되는지 여부를 알 필요가 없도록 renderer-agnostic하게 만들고자 했습니다. 이를 통해 라이브러리 개발자의 비용을 크게 줄일 수 있습니다.
