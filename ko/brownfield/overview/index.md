---
modificationDate: February 24, 2026
title: 기존 네이티브 앱에 Expo 도구 통합하기
description: 기존 네이티브 앱("brownfield" 앱)에 Expo 도구를 통합하는 방법 개요입니다.
---

# 기존 네이티브 앱에 Expo 도구 통합하기

기존 네이티브 앱("brownfield" 앱)에 Expo 도구를 통합하는 방법 개요입니다.

React Native 뷰가 _아닌_ 것이 주 진입점인, 다른 기술로 만들어진 기존 네이티브 앱은 일반적으로 "brownfield" 앱이라고 부릅니다. 예를 들어 앱이 UIKit과 Swift로 만들어졌고 단일 화면에 React Native를 사용하고 싶다면, 이것은 "기존 네이티브 앱"이자 "brownfield"로 간주됩니다.

반대로 "greenfield" 앱은 Expo나 React Native로 처음부터 만들어졌거나, React Native가 진입점이고 다른 모든 UI가 그 위에서 뻗어 나가는 앱을 의미합니다.

이 정의에 따르면, Android나 iOS용 "기존 네이티브 앱"이 있고 프로젝트에서 Expo와 React Native를 사용하는 방법을 배우고 싶다면(어쩌면 단일 화면이나 단일 기능 수준에서라도), 이 가이드는 여러분을 위한 것입니다.

## 기존 네이티브 앱과의 호환성

> 기존 네이티브 프로젝트에 Expo modules를 통합하는 지원은 alpha 상태입니다. 문제가 발생하면 [GitHub에 이슈를 생성](https://github.com/expo/expo/issues)하세요. 아래 도구와 서비스의 모든 기능이 기존 네이티브 앱 환경에서 사용 가능하지는 않을 수 있습니다.

Expo는 주로 greenfield 앱을 염두에 두고 만들어졌지만, brownfield 시나리오에도 점점 더 많은 투자를 하고 있습니다. 아직 모든 Expo 도구와 서비스가 기존 네이티브 프로젝트와 호환되는 것은 아닙니다. 또한 brownfield 통합에 대한 포괄적인 문서가 아직 충분하지 않을 수 있으므로, 관련 문서를 여러분의 맥락에 맞게 조정해야 할 수도 있습니다.

| Tool/Service | Supports brownfield? |
| --- | --- |
| [Expo SDK](/versions/latest) - React Native를 위한 확장 표준 라이브러리 | Yes |
| [Expo Modules API](/modules/overview) - 관용적인 Swift/Kotlin API로 네이티브 확장 만들기 | Yes |
| [Expo Router](/router/introduction) - 파일 기반 라우팅 및 내비게이션 | Yes |
| [Expo CLI](/more/expo-cli) - 터미널에서 앱을 실행하고 개발하는 도구 | Yes |
| [Expo Dev Client](/versions/latest/sdk/dev-client) - Debug 빌드에 앱 내 개발자 도구 추가 | No |
| [EAS Build](/build/introduction) - Expo/React Native 전용 CI/CD 서비스 | Yes |
| [EAS Submit](/submit/introduction) - 앱을 스토어에 업로드하는 호스팅 서비스 | Yes |
| [EAS Update](/eas-update/introduction) - 앱 JavaScript 및 에셋의 즉시 업데이트 | Yes |

## 통합 접근 방식과 격리 접근 방식

기존 네이티브 앱에 React Native를 통합할 때는 크게 두 가지 접근 방식 중에서 선택할 수 있습니다: 통합 방식과 격리 방식. 어떤 방식이 더 적합한지는 프로젝트 구조, 팀의 워크플로, 장기적인 목표에 따라 달라집니다.

### 통합 접근 방식

통합 접근 방식에서는 React Native 코드가 기존 네이티브 프로젝트 내부에 함께 존재합니다. 이렇게 하면 React Native 코드와 네이티브 코드가 긴밀하게 결합될 수 있습니다.

예를 들어 기존 Android 또는 iOS 네이티브 프로젝트를 React Native 프로젝트의 하위 디렉터리에 추가할 수 있습니다. 이는 React Native로 시작한 뒤 나중에 네이티브 코드를 추가한 프로젝트에서 흔한 구성 방식이지만, 기존 네이티브 앱에도 사용할 수 있습니다. 네이티브 프로젝트에 표준 `android` 및 `ios` 하위 디렉터리를 사용할 수 없다면, 간단한 모노레포 설정으로 React Native 코드의 사용자 정의 루트 폴더를 구성할 수 있습니다.

**다음과 같은 경우 이 접근 방식을 선택하세요:**

-   네이티브 코드와 React Native 코드를 함께 자주 반복 개발해야 한다.
-   네이티브 개발과 React Native 개발을 모두 관리하는 단일 팀이 있다.
-   프로젝트 구조상 React Native 프로젝트를 직접 추가할 수 있다.

### 격리 접근 방식

격리 접근 방식에서는 React Native 코드가 네이티브 프로젝트와 별도로 개발되고 유지보수되며, 별도 저장소나 모노레포에서 관리할 수 있습니다.

이 접근 방식에서는 React Native 앱을 네이티브 라이브러리(Android용 AAR, iOS용 XCFramework)로 패키징합니다. 그런 다음 다른 네이티브 의존성과 똑같이 이 라이브러리를 네이티브 앱에 통합합니다.

이렇게 분리하면 네이티브 개발자의 워크플로가 단순해집니다. Node.js 환경을 설정하거나 React Native 빌드 의존성을 다룰 필요 없이, 앱의 React Native 부분을 미리 빌드된 아티팩트로 소비하기만 하면 되기 때문입니다.

**다음과 같은 경우 이 접근 방식을 선택하세요:**

-   네이티브 개발 팀과 React Native 개발 팀이 분리되어 있다.
-   React Native 추가가 기존 네이티브 빌드 프로세스에 미치는 영향을 최소화하고 싶다.
-   앱의 React Native 부분을 독립적인 모듈처럼 다루고 싶다.

## 다음 단계

[격리 접근 방식: Expo를 네이티브 라이브러리로 패키징하기](/brownfield/isolated-approach) — React Native 코드를 AAR/XCFramework 아티팩트로 빌드하여 어떤 네이티브 앱에도 통합하세요.

[통합 접근 방식: Expo를 네이티브 프로젝트에 직접 추가하기](/brownfield/integrated-approach) — 기존 네이티브 프로젝트가 React Native와 Expo를 직접 사용하도록 구성하세요.
