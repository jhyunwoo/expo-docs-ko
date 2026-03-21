---
modificationDate: March 01, 2026
title: 기존 React Native 앱에서 Expo 사용 개요
description: 기존 React Native 앱에서 Expo 도구와 서비스를 사용하는 방법을 알아보세요.
---

# 기존 React Native 앱에서 Expo 사용 개요

기존 React Native 앱에서 Expo 도구와 서비스를 사용하는 방법을 알아보세요.

아직 Expo 도구를 전혀 사용하지 않는 React Native 앱이 있다면, Expo가 무엇을 제공할 수 있는지, 왜 Expo 도구와 서비스를 사용하고 싶어질 수 있는지, 그리고 어떻게 시작하면 되는지 궁금할 수 있습니다.

**Expo가 제공하는 모든 도구와 서비스는 어떤 React Native 앱에서도 훌륭하게 동작합니다**.

[EAS](/eas)를 사용하면 앱을 빌드하고, 검토하고, 배포하고, 업데이트하는 전문적인 CI/CD 워크플로를 빠르게 구축할 수 있습니다. [Expo CLI](/more/expo-cli)는 React Native 작업에 가장 뛰어난 명령줄 경험을 제공합니다. [Expo SDK](/versions/latest)는 React Native를 위한 확장 표준 라이브러리입니다. 일관된 API 규칙을 따르는, 품질 높고 잘 관리되는 네이티브 라이브러리를 개발자에게 제공해 배우고 사용하기 쉽게 해줍니다.

React Native용 네이티브 module을 직접 작성해 본 적이 있다면, [Expo Modules API](/modules/overview)가 제공하는 관용적인 Swift 및 Kotlin DSL을 사용해 module을 얼마나 더 쉽게 만들고 유지보수할 수 있는지에 놀랄 수 있습니다.

살펴볼 것은 훨씬 더 많고, 아래 링크들이 여러분이 사용할 수 있는 선택지를 탐색하는 데 도움이 될 것입니다.

## 점진적 도입 단계

아래에는 점진적으로 도입할 때 추천하는 네 가지 단계가 있습니다. 일반적으로 이 단계들은 개발자 경험을 빠르게 개선하는 변경에서 시작해, 더 큰 워크플로 및 코드베이스 최적화로 이어집니다.

다른 단계들이 필요로 하는 것은 첫 번째 단계인 사전 준비 사항뿐입니다. 이 단계를 따른 뒤에는 Expo 도입 목표에 가장 잘 맞는 도구와 서비스로 바로 건너뛸 수 있습니다.

### 사전 준비 사항

이 첫 단계들은 이후 Expo 도구와 서비스를 도입하기 위해 필요합니다:

[Expo modules 설치하기](/bare/installing-expo-modules) — Expo 기능을 활용하려면 기존 React Native 프로젝트에 expo 패키지를 설치해야 합니다. 이 가이드는 자동 설치와 수동 설치 단계를 모두 제공합니다. — expo

[Expo CLI 사용하기](/bare/using-expo-cli) — Expo CLI로의 마이그레이션은 @react-native-community/cli를 그대로 대체하는 방식입니다. 모든 Expo 도구와 서비스와 완전한 호환성을 제공합니다. 이 가이드는 expo 패키지를 설치한 뒤 개발 서버를 시작하기 위한 컴파일 명령과 장점을 설명합니다. — @react-native-community/cli — expo

### 빠른 성과

다음 항목들은 개발 경험 향상에 도움이 되며, 설정이 필요합니다:

[Expo SDK 사용하기](/versions) — Expo SDK가 제공하는 많은 라이브러리 중 하나를 사용해 보세요. Expo SDK는 네이티브 API 접근을 제공하는 광범위한 라이브러리 집합입니다.

[expo-dev-client 설치하기](/bare/install-dev-builds-in-bare) — expo-dev-client는 디버그 앱 변형에 Expo Go 스타일의 앱 실행기 인터페이스 접근을 제공합니다. 기존 React Native 프로젝트에 설치하고 구성하는 방법을 알아보세요. — expo-dev-client

[네이티브 module 작성하기](/modules/overview) — Expo Modules API를 사용해 Swift와 Kotlin으로 네이티브 module을 작성하세요.

[네이티브 프로젝트 업그레이드 헬퍼](/bare/upgrade) — 다음 Expo SDK 및 React Native 버전으로 업그레이드하기 위해 네이티브 프로젝트에 적용해야 하는 모든 변경 사항을 파일 단위 diff로 확인하세요.

### 새로운 워크플로

앱에 `expo` 패키지가 설치되면, 단일 명령으로 앱 스토어에 제출하거나 `expo-updates` 라이브러리를 구성해 앱 코드의 원격 업데이트를 관리할 수 있습니다:

[앱 배포](/distribution/introduction) — 단일 명령으로 앱을 빌드하고 앱 스토어에 제출하세요.

[expo-updates 설치하기](/bare/installing-updates) — expo-updates를 설치하고 구성해 원격 업데이트를 관리하고 PR preview를 활성화하는 방법을 알아보세요. — expo-updates

### 새로운 관점

다음 항목들은 프로젝트의 장기적인 유지보수성, 네이티브 코드 유지보수, 더 쉬운 업그레이드에 도움이 됩니다:

[Prebuild 도입하기](/guides/adopting-prebuild) — 설정에서 필요할 때마다 네이티브 프로젝트를 생성하여 유지보수를 단순화하는 방법을 알아보세요.

[Expo Router](/router/introduction) — Expo Router는 정리된 내비게이션 계층, 자동 딥 링크 지원 등 여러 장점을 제공하는 파일 기반 라우팅 라이브러리입니다.

## 자주 묻는 질문

기존 React Native 프로젝트에 Expo를 도입하는 데 얼마나 걸리나요?

Expo 도입은 한 번에 모두 할 필요가 없습니다. 먼저 _빠른 성과_부터 시작한 뒤 더 복잡한 부분으로 넘어갈 수 있습니다. 프로젝트에 가장 도움이 되는 기능만 골라 도입할 수도 있습니다.

React Native 앱에서 Expo를 사용하면 무엇을 얻을 수 있나요?

기존 React Native 앱에 Expo 도구를 도입하면 [Expo SDK](/versions/latest)로 더 빠르게 개발하고, [CNG](/workflow/continuous-native-generation)로 네이티브 코드 유지보수와 업그레이드를 단순화하며, [EAS Update](/eas-update/introduction)로 더 빠르게 배포하는 등 다양한 이점을 얻을 수 있습니다.

누가 Expo를 사용하나요?

Expo는 전 세계의 주요 기업들이 사용하고 있으며, 수백만 명의 최종 사용자를 대상으로 서비스합니다. 자세한 내용은 [Expo showcase](https://expo.dev/customers)를 참고하세요.

Expo를 도입하면 앱 크기에 어떤 영향이 있나요?

`expo` 패키지는 모든 앱에 필요한 최소 module 집합과 autolinking 인프라, 그리고 내장된 다른 Expo SDK 라이브러리만 포함하므로 크기 부담이 작습니다. 앱의 실제 크기를 판단하는 방법에 대한 자세한 내용은 [앱 크기 이해하기](/distribution/app-size)를 참고하세요.

왜 React Native는 Expo 사용을 권장했나요?

대부분의 React Native 개발자는 앱을 만들 때 내비게이션 구현, Native API 접근, 새 버전으로 업그레이드 같은 공통 문제를 해결해야 합니다. 그러려면 앱을 만들고 유지보수하기 위해 특정 도구와 라이브러리 집합을 사용해야 하며, 결국 여러분만의 프레임워크를 만들게 됩니다.

Expo는 이런 문제를 해결하기 위해 기본 구성 요소 집합을 제공하고, 개발자인 여러분이 앱 자체를 만드는 데 집중할 수 있도록 도와줍니다. 또한 개발 중 더 빠르게 반복할 수 있는 도구도 제공합니다. 자세한 내용은 [Why React Native recommends using a framework](https://reactnative.dev/blog/2024/06/25/use-a-framework-to-build-react-native-apps)를 참고하세요.

Expo를 쓰려면 네이티브 프로젝트를 없애야 하나요?

기본적으로 `create-expo-app`으로 만든 Expo 프로젝트는 [Continuous Native Generation (CNG)](/workflow/continuous-native-generation)를 사용하며 **android**와 **ios** 네이티브 디렉터리를 포함하지 않습니다. 기존 React Native 앱에 Expo를 점진적으로 도입하는 경우, 이 디렉터리를 제거할 필요는 없습니다. `@react-native-community/cli`가 제공하는 명령 대신 `npx expo run:[android|ios]`를 사용해 앱을 로컬에서 컴파일하고 네이티브 프로젝트 구성을 유지할 수 있습니다.

저는 CodePush를 사용합니다. Expo와 함께 계속 사용할 수 있나요?

CodePush는 2025년 3월에 종료되었고 React Native의 New Architecture와 호환되지 않으므로, 장기적으로는 앱 코드의 원격 업데이트를 관리하기 위해 EAS Update로 전환하는 것을 권장합니다. 하지만 지금도 Expo SDK, Expo CLI, EAS Build 등을 포함한 Expo 도구는 CodePush가 활성화된 앱에서 사용할 수 있습니다.

반드시 EAS로 빌드해야 하나요?

[Expo Application Services (EAS)](/eas)는 Expo 및 React Native 앱을 위한 깊이 통합된 클라우드 서비스로, 앱을 빌드하고 테스트하고 배포하는 도구를 제공합니다.

원활한 팀 협업과 빠른 배포를 위해 EAS 사용을 권장하지만, 앱은 로컬에서, CI에서, 또는 원하는 다른 방식으로도 컴파일할 수 있습니다.

코드에서 서드파티 네이티브 라이브러리를 설치할 수 있나요?

네. 네이티브 프로젝트(**android**와 **ios**) 설정이 필요하거나 [config plugin](/config-plugins/introduction)을 제공하는 서드파티 라이브러리를 [development builds](/workflow/overview#development-builds)와 함께 설치하고 사용할 수 있습니다. 자세한 내용은 [서드파티 라이브러리 사용하기](/workflow/using-libraries#third-party-libraries)를 참고하세요.

저는 React Navigation을 사용합니다. Expo Router도 써야 하나요?

프로젝트에서는 원하는 내비게이션 라이브러리를 계속 사용할 수 있습니다. 다만 [여기 설명된 장점들](/router/introduction)을 위해 Expo Router 사용을 권장합니다.
