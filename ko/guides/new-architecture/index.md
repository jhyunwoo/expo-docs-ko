---
modificationDate: February 26, 2026
title: React Native의 New Architecture
description: React Native의 "New Architecture"가 무엇인지, 그리고 어떻게 왜 그 구조로 마이그레이션해야 하는지 알아보세요.
---

# React Native의 New Architecture

React Native의 "New Architecture"가 무엇인지, 그리고 어떻게 왜 그 구조로 마이그레이션해야 하는지 알아보세요.

> **SDK 55 이상은 전적으로 New Architecture에서 실행됩니다.** New Architecture는 항상 활성화되어 있으며 비활성화할 수 없습니다. 레거시 아키텍처를 사용해야 한다면 SDK 54 이하를 사용하세요.

New Architecture는 React Native 내부 전반의 완전한 리팩터링을 설명하기 위해 우리가 사용하는 이름입니다. 또한 Meta와 다른 회사들이 수년 동안 프로덕션에서 React Native를 사용하며 발견한 기존 React Native 아키텍처의 한계를 해결하기 위해 사용됩니다.

이 가이드에서는 오늘날 Expo 프로젝트에서 New Architecture를 사용하는 방법을 살펴봅니다.

[New Architecture is here](https://reactnative.dev/blog/2024/10/23/the-new-architecture-is-here) — New Architecture의 기능과 이를 구축하게 된 배경을 개괄적으로 설명하는 Meta React Native 팀의 블로그 글입니다.

[React Native 0.82 - A New Era](https://reactnative.dev/blog/2025/10/08/react-native-0.82) — React Native 0.82는 전적으로 New Architecture에서 실행되는 첫 번째 버전입니다. SDK 55는 이 동작을 이어받는 React Native 0.83을 사용합니다.

왜 New Architecture로 마이그레이션해야 할까요?

**New Architecture는 React Native의 현재이자 미래입니다**. React Native 0.82부터 New Architecture는 항상 활성화되며 비활성화할 수 없습니다. SDK 55는 이 동작을 이어받는 React Native 0.83을 사용합니다. [레거시 아키텍처는](https://github.com/reactwg/react-native-new-architecture/discussions/290) 2025년 6월에 동결되었으며, 이는 더 이상 새로운 기능이나 버그 수정이 개발되지 않는다는 뜻입니다.

**새로운 React 및 React Native 기능은 New Architecture에만 제공됩니다**. 예를 들어 New Architecture에는 레거시 아키텍처에는 구현되지 않은 [Suspense 완전 지원](https://reactnative.dev/blog/2024/10/23/the-new-architecture-is-here#full-support-for-suspense)과 [새로운 스타일링 기능](https://reactnative.dev/blog/2025/01/21/version-0.77#new-css-features-for-better-layouts-sizing-and-blending)이 포함됩니다. 이제 많은 인기 라이브러리가 New Architecture만 지원합니다.

**SDK 54 이하를 사용 중이라면** `newArchEnabled`를 `false`로 설정해 여전히 레거시 아키텍처를 사용할 수 있습니다. 하지만 SDK 55 이상으로 업그레이드하기 전에 New Architecture로 마이그레이션해야 합니다.

## Expo tools and the New Architecture

SDK 53부터 [Expo SDK](/versions/latest)의 모든 `expo-*` 패키지는 New Architecture를 지원합니다([bridgeless](https://github.com/reactwg/react-native-new-architecture/discussions/154) 포함). [알려진 이슈 더 알아보기](/guides/new-architecture#known-issues-in-expo-sdk-libraries).

또한 [Expo Modules API](/modules/overview)로 작성된 모든 모듈은 기본적으로 New Architecture를 지원합니다. 따라서 이 API로 직접 native module을 만들었다면 New Architecture와 함께 사용하기 위해 추가 작업이 필요하지 않습니다.

**2026년 1월 기준으로 [EAS Build](/build/introduction)로 빌드된 SDK 54 프로젝트의 약 83%가 New Architecture를 사용합니다**.

## Third-party libraries and the New Architecture

가장 인기 있는 라이브러리 다수의 호환성 상태는 [React Native Directory](https://reactnative.directory/)에서 추적됩니다([서드파티 라이브러리의 알려진 이슈 더 알아보기](/guides/new-architecture#known-issues-in-third-party-libraries)). Expo Doctor에는 React Native Directory와 연동되는 도구가 내장되어 있어 의존성을 검증하고, 유지보수되지 않는 라이브러리와 New Architecture와 호환되지 않거나 테스트되지 않은 라이브러리를 빠르게 파악할 수 있습니다.

### Validate your dependencies with React Native Directory

`npx expo-doctor`를 실행해 React Native Directory의 데이터와 대조하여 의존성을 점검하세요.

```sh
npx expo-doctor@latest
```

**package.json** 파일에서 React Native Directory 검사를 설정할 수 있습니다. 예를 들어 특정 패키지를 검사 대상에서 제외하고 싶다면 다음과 같이 설정합니다:

```json
{
  "expo": {
    "doctor": {
      "reactNativeDirectoryCheck": {
        "exclude": ["react-redux"]
      }
    }
  }
}
```

사용 가능한 모든 옵션 보기

-   **enabled**: `true`이면 React Native Directory에 없는 패키지가 있을 때 경고합니다. 이 동작을 끄려면 `false`로 설정하세요. SDK 52 이상에서는 기본값이 `true`이고, 그 외에는 기본값이 `false`입니다. `EXPO_DOCTOR_ENABLE_DIRECTORY_CHECK` 환경 변수로도 이 설정을 덮어쓸 수 있습니다(0은 `false`, 1은 `true`).
-   **exclude**: 검사에서 제외할 패키지 목록입니다. 정확한 패키지 이름과 regex pattern을 지원합니다. 예: `["exact-package", "/or-a-regex-.*/"]`.
-   **listUnknownPackages**: 기본적으로 React Native Directory에 없는 패키지가 있으면 경고합니다. 이 동작을 끄려면 false로 설정하세요.

## Initialize a new project with the New Architecture

**SDK 52부터** 모든 새 프로젝트는 기본적으로 New Architecture가 활성화된 상태로 초기화됩니다.

```sh
npx create-expo-app@latest --template default@sdk-55
```

## Enable the New Architecture in an existing project

**SDK 55 이상에서는 New Architecture가 항상 활성화됩니다**. 이를 비활성화하는 옵션은 없습니다. SDK 55는 React Native 0.83을 사용합니다. [React Native 0.82는 New Architecture를 비활성화하는 옵션이 제거된 첫 번째 버전이었으며](https://reactnative.dev/blog/2025/10/08/react-native-0.82), 이는 그 이후 모든 버전에 적용됩니다.

이전에 app config에서 `newArchEnabled: false`를 사용하고 있었다면 이 설정은 무시됩니다. 혼란을 피하려면 설정에서 제거하세요.

bare React Native 앱에서 New Architecture를 활성화하고 있나요?

Expo SDK 53 이상을 사용 중이라면 New Architecture는 기본적으로 활성화되어 있습니다. SDK 55 이상에서는 New Architecture가 항상 활성화되며 비활성화할 수 없습니다. 다음 지침은 SDK 52 이하 프로젝트에 적용됩니다.

-   **Android**: **gradle.properties** 파일에서 `newArchEnabled=true`를 설정하세요.
-   **iOS**: 프로젝트에 **Podfile.properties.json** 파일(`npx create-expo-app` 또는 `npx expo prebuild`가 생성함)이 있다면 **Podfile.properties.json** 파일에서 `newArchEnabled` 속성을 `"true"`로 설정해 New Architecture를 활성화할 수 있습니다. 그렇지 않다면 React Native New Architecture working group의 ["Enable the New Architecture for Apps"](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/enable-apps.md) 섹션을 참고하세요.

## Disable the New Architecture in an existing project

> **SDK 55 이상은 New Architecture 비활성화를 지원하지 않습니다.** SDK 55는 React Native 0.83을 사용합니다. [React Native 0.82부터 New Architecture를 비활성화하는 옵션이 제거되었기 때문에](https://reactnative.dev/blog/2025/10/08/react-native-0.82), `newArchEnabled`를 `false`로 설정해도 아무 효과가 없습니다. 레거시 아키텍처를 사용해야 한다면 SDK 54 이하를 사용하세요.

> Expo Go는 New Architecture만 지원합니다.

**SDK 54 이하에서는** app config에서 `newArchEnabled` 속성을 `false`로 설정하고 [development build](/develop/development-builds/introduction)를 생성해 New Architecture를 사용하지 않도록 선택할 수 있습니다.

```json
{
  "expo": {
    "newArchEnabled": false
  }
}
```

bare React Native 앱에서 New Architecture를 비활성화하고 있나요? (SDK 54 이하)

-   **Android**: **gradle.properties** 파일에서 `newArchEnabled=false`를 설정하세요.
-   **iOS**: 프로젝트에 **Podfile.properties.json** 파일(`npx create-expo-app` 또는 `npx expo prebuild`가 생성함)이 있다면 **Podfile.properties.json** 파일에서 `newArchEnabled` 속성을 `"false"`로 설정해 New Architecture를 비활성화할 수 있습니다. 그렇지 않다면 React Native New Architecture working group의 ["Enable the New Architecture for Apps"](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/enable-apps.md) 섹션을 참고하세요.

## Troubleshooting

Meta와 Expo는 New Architecture를 모든 새 앱의 기본값으로 만들고, 기존 앱을 최대한 쉽게 마이그레이션할 수 있도록 노력하고 있습니다. 하지만 New Architecture는 단순한 이름이 아닙니다. React Native의 많은 내부 구조가 밑바닥부터 다시 설계되고 다시 구축되었습니다. 그 결과 앱에서 New Architecture를 활성화할 때 문제를 겪을 수 있습니다. 아래는 이러한 문제를 해결하는 데 도움이 되는 몇 가지 조언입니다.

제가 사용하는 라이브러리 중 일부가 지원되지 않아도 New Architecture를 시도해볼 수 있나요?

사용 중인 라이브러리 중 일부가 지원되지 않더라도 앱에서 New Architecture를 시도해볼 수는 있지만, 그 라이브러리들을 일시적으로 제거해야 할 수 있습니다. 저장소에 새 브랜치를 만들고 앱이 실행될 때까지 호환되지 않는 라이브러리를 제거하세요. 이렇게 하면 New Architecture로 완전히 마이그레이션하기 전에 아직 어떤 라이브러리에 추가 작업이 필요한지 파악할 수 있습니다. 해당 라이브러리 저장소에 이슈나 pull request를 만들어 New Architecture와 호환되도록 돕는 것을 권장합니다. 또는 New Architecture와 호환되는 다른 라이브러리로 전환할 수도 있습니다. 호환 라이브러리를 찾으려면 [React Native Directory](https://reactnative.directory/)를 참고하세요.

Known issues in React Native

[React Native GitHub 저장소에서 "Type: New Architecture" 라벨이 붙은 이슈](https://github.com/facebook/react-native/issues?q=is%3Aopen+is%3Aissue+label%3A%22Type%3A+New+Architecture%22)를 참고하세요.

Known issues in Expo libraries

Expo 라이브러리에는 New Architecture에만 한정된 알려진 이슈가 없습니다.

Known issues in third-party libraries

React Native 0.74부터 다양한 Interop Layer가 기본적으로 활성화되어 있습니다. 덕분에 구 아키텍처용으로 만들어진 많은 라이브러리가 수정 없이도 New Architecture에서 동작할 수 있습니다. 하지만 interop는 완벽하지 않으며 일부 라이브러리는 업데이트가 필요합니다. 특히 서드파티 native code를 포함하거나 이에 의존하는 라이브러리일수록 업데이트가 필요할 가능성이 높습니다. [New Architecture에서의 라이브러리 지원에 대해 더 알아보기](https://github.com/reactwg/react-native-new-architecture/discussions/167).

New Architecture와의 호환성을 포함해 더 완전한 라이브러리 목록은 [React Native Directory](https://reactnative.directory/)를 참고하세요. 다음 라이브러리들은 Expo 앱에서 많이 사용되며 호환되지 않는 것으로 알려져 있습니다:

다음은 Expo 앱에서 많이 사용되는 라이브러리의 알려진 이슈입니다.

-   **react-native-maps**: SDK 53의 기본값인 버전 1.20.x는 interop layer와 함께 New Architecture를 지원하며 대부분의 기능에서 잘 동작합니다. New Architecture 우선 버전은 1.21.0에 제공되지만 아직 안정화 중입니다. 앱에서 직접 테스트하고, 발견한 이슈를 보고하며, [GitHub 토론도 계속 확인해 보시길](https://github.com/react-native-maps/react-native-maps/discussions/5355) 권장합니다. 또한 모듈을 다시 작성하기보다 [interop layer](https://github.com/reactwg/react-native-new-architecture/discussions/175)를 활용해 더 매끄러운 마이그레이션 경로를 제공할 수 있는 다른 접근도 조사 중입니다. 참고로 앱이 iOS 17 이상만 지원하도록 최소 버전을 강제할 수 있거나 iOS에서 지도를 지원할 필요가 없다면 [`expo-maps`](/versions/latest/sdk/maps) 사용도 고려할 수 있습니다.
-   **@stripe/react-native**: New Architecture는 SDK 53의 기본값인 0.45.0 버전부터 지원됩니다.
-   **@react-native-community/masked-view**: 대신 `@react-native-masked-view/masked-view`를 사용하세요.
-   **@react-native-community/clipboard**: 대신 `@react-native-clipboard/clipboard`를 사용하세요.
-   **rn-fetch-blob**: 대신 `react-native-blob-util`을 사용하세요.
-   **react-native-fs**: 대신 `expo-file-system` 또는 [react-native-fs의 fork](https://github.com/birdofpreyru/react-native-fs)를 사용하세요.
-   **react-native-geolocation-service**: 대신 `expo-location`을 사용하세요.
-   **react-native-datepicker**: 대신 `react-native-date-picker` 또는 `@react-native-community/datetimepicker`를 사용하세요.

My build failed after enabling the New Architecture

전혀 이상한 일은 아닙니다. 아직 모든 라이브러리가 호환되는 것은 아니며, 어떤 경우에는 호환성이 아주 최근에 추가되었을 수도 있으므로 라이브러리를 최신 버전으로 업데이트해야 합니다. 어떤 라이브러리가 호환되지 않는지 판단하려면 로그를 읽어보세요. 또한 `npx expo-doctor@latest`를 실행해 React Native Directory의 데이터와 대조하여 의존성을 확인하세요.

라이브러리의 최신 버전을 사용하고 있는데도 호환되지 않는다면, 문제가 발생한 내용을 해당 GitHub 저장소에 보고하세요. [minimal reproducible example](https://stackoverflow.com/help/minimal-reproducible-example)을 만들고 라이브러리 작성자에게 이슈를 보고하세요. 문제가 라이브러리가 아니라 React Native 자체에서 비롯된 것이라고 생각한다면 React Native 팀에도 보고하세요(이 경우에도 최소 재현 예제가 필요합니다).
