---
modificationDate: March 01, 2026
title: 'Expo Modules API: 개요'
description: Expo가 네이티브 모듈 개발을 위해 제공하는 API와 유틸리티의 개요입니다.
---

# Expo Modules API: 개요

Expo가 네이티브 모듈 개발을 위해 제공하는 API와 유틸리티의 개요입니다.

## Expo Modules API란 무엇인가요

Expo Modules API를 사용하면 Swift와 Kotlin을 작성해 네이티브 모듈과 뷰로 앱에 새로운 기능을 추가할 수 있습니다. 이 API는 최신 언어 기능을 활용하고, 두 플랫폼에서 가능한 한 일관되게 동작하며, 최소한의 보일러플레이트만 요구하고, React Native의 Turbo Modules API와 비슷한 성능 특성을 제공하도록 설계되었습니다. Expo Modules는 모두 New Architecture를 지원하며, 이전 아키텍처를 사용하는 기존 React Native 앱과도 자동으로 하위 호환됩니다.

우리는 Expo Modules API를 사용하면 거의 모든 종류의 React Native 모듈을 가능한 한 쉽게 만들고 유지할 수 있다고 믿으며, 앱용 네이티브 모듈을 만드는 대다수 개발자에게 Expo Modules API가 가장 좋은 선택이라고 생각합니다.

### 자주 묻는 질문

Expo / React Native 앱을 만들려면 Expo Modules API를 알아야 하나요?

대부분의 경우 Expo와 React Native 개발자는 네이티브 코드를 직접 작성할 필요가 없습니다. 카메라, 비디오, 지도, 햅틱 등 훨씬 더 많은 사용 사례를 포괄하는 라이브러리가 이미 준비되어 있기 때문입니다.

하지만 때로는 필요한 기능을 정확히 만족하는 것이 없을 수 있습니다. 예를 들어 회사에서 의무적으로 사용하는 분석 서비스를 연동해야 하는데 아직 React Native 라이브러리가 없다면, 해당 SDK를 감싸는 모듈을 직접 만들어야 할 수 있습니다. 또는 앱에 꼭 필요한 시스템 기능이 있지만 흔히 쓰이지 않아 아무도 라이브러리를 유지하지 않는 경우도 있습니다.

Turbo Modules는 언제 사용해야 하고, Expo Modules API는 언제 사용해야 하나요?

[React Native 팀의 권장 사항](https://github.com/react-native-community/discussions-and-proposals/blob/main/proposals/0759-react-native-frameworks.md#what-do-we-recommend-to-react-native-library-developers)을 요약하고 바꿔 말하면 다음과 같습니다.

-   네이티브 모듈에서 C++를 사용할 계획이라면, 더 낮은 수준의 메커니즘에 더 쉽게 접근할 수 있으므로 Turbo Modules를 사용하세요.
-   더 나은 개발자 경험을 원하고 모듈에서 `expo` 패키지에 의존해도 괜찮다면, Expo Modules API를 사용하세요.

배울 수 있는 오픈소스 Expo Modules는 어디에서 찾을 수 있나요?

[Expo SDK](https://github.com/expo/expo/tree/main/packages)는 우리가 라이브러리를 어떻게 구현했는지 배우고 싶을 때 살펴보기 좋은 곳입니다. 또 다른 훌륭한 자료로는 [Bluesky](https://github.com/bluesky-social/social-app/tree/main/modules) 같은 오픈소스 앱이 있습니다.

다음 라이브러리는 커뮤니티에서 우리가 특히 좋아하는 몇 가지 예시입니다.

-   [`react-native-widget-extension`](https://github.com/bndkt/react-native-widget-extension)
-   [`burnt`](https://github.com/nandorojo/burnt)
-   [`expo-video-metadata`](https://github.com/hirbod/expo-video-metadata)
-   [`swiftui-react-native`](https://github.com/andrew-levy/swiftui-react-native)
-   [`react-native-ios-context-menu`](https://github.com/dominicstop/react-native-ios-context-menu)
-   [`react-native-mlkit`](https://github.com/infinitered/react-native-mlkit)
-   [`react-native-passkeys`](https://github.com/peterferguson/react-native-passkeys)
-   [`expo-drag-drop-content-view`](https://github.com/AlirezaHadjar/expo-drag-drop-content-view)

Expo Modules API를 사용하면 앱 크기에 어떤 영향이 있나요?

앱에 Expo Modules API를 추가해도 앱 크기에 미치는 영향은 미미하며, 몇백 킬로바이트 정도 증가할 수 있습니다. [이 블로그 글에서 더 자세히 알아보세요](https://blog.expo.dev/embracing-expo-modules-in-your-react-native-projects-cd8ed4cbec3).

Expo Modules API를 사용하면 앱 성능에 어떤 영향이 있나요?

Expo Modules API는 React Native의 Turbo Modules API와 비슷한 성능 특성을 가집니다. 두 API 모두 JSON 메시지 큐("bridge")를 사용하는 기존 방식 대신 React Native의 JavaScript Interface(JSI)를 활용합니다([JSI에 대해 더 알아보기](https://reactnative.dev/docs/the-new-architecture/landing-page#fast-javascriptnative-interfacing)).

Expo Modules와 Turbo Modules 모두 기술적으로 가능한 한 가장 빠르도록 설계된 것은 아니지만, 중요한 지점에서는 충분히 빠르게 동작합니다. 예를 들어 Expo Modules API는 코드 생성과 새로운 네이티브 Swift / C++ 상호 운용을 활용해 개별 메서드 호출의 오버헤드를 줄일 수도 있습니다. 하지만 이는 개발자 경험 측면의 도전과 추가 오버헤드를 초래하며, 지금까지 우리는 그런 최적화가 실제 환경에서 의미 있는 성능 향상을 제공하는 사례를 아직 보지 못했습니다. 실제로는 네이티브 메서드 본문을 실행하는 데 걸리는 시간이 메서드 호출 오버헤드보다 훨씬 큰 경우가 많습니다. Expo Modules와 Turbo Modules는 둘 다 초당 수십만 번의 네이티브 메서드 호출을 손쉽게 실행할 수 있으며, 이는 대부분의 앱에서 필요할 법한 수준을 훨씬 넘습니다. 따라서 메서드 호출 오버헤드가 병목이 될 가능성은 낮습니다.

Expo Modules API에서 성능 병목을 발견했다면 [이슈를 등록](https://github.com/expo/expo/issues/new/choose)해 주세요. 기꺼이 함께 논의하겠습니다.

Expo Modules API는 Android, iOS, 웹 외의 플랫폼도 지원하나요?

Expo Modules API는 macOS와 tvOS를 실험적으로 지원합니다. 자세한 내용은 [추가 플랫폼 지원](/modules/additional-platform-support) 튜토리얼을 참고하세요.

서드파티 SDK를 Expo 앱에서 사용할 수 있게 하려면 Expo Modules API를 어떻게 활용하나요?

[기존 라이브러리 통합](/modules/existing-library) 튜토리얼에서 이에 대해 더 자세히 알아보세요.

## 다음 단계

[Tutorial: Creating a native module](/modules/native-module-tutorial) — Expo Modules API로 설정을 유지하는 네이티브 모듈을 만드는 튜토리얼입니다.

[Tutorial: Creating a native view](/modules/native-view-tutorial) — Expo Modules API로 WebView를 렌더링하는 네이티브 뷰를 만드는 튜토리얼입니다.

[Expo Modules API: Reference](/modules/module-api) — Kotlin과 Swfit를 사용해 네이티브 모듈을 만드는 참고 문서입니다.

[Expo Modules API: Design considerations](/modules/design) — Expo Modules API의 설계 고려 사항에 대한 개요입니다.

[expo-module.config.json](/modules/module-config) — 사용 가능한 설정 옵션에 대한 참고 문서입니다.
