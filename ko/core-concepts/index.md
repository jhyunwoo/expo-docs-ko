---
modificationDate: March 01, 2026
title: 핵심 개념
description: Expo 도구, 기능, 서비스 개요입니다.
---

# 핵심 개념

Expo 도구, 기능, 서비스 개요입니다.

Expo는 Android, iOS, 웹에서 네이티브로 실행되는 앱을 위한 [오픈 소스 프레임워크](https://github.com/expo/expo/)입니다. Expo는 모바일과 웹의 장점을 결합하고, 앱을 만들고 확장하는 데 중요한 여러 기능을 제공합니다.

`expo` npm package는 React Native 앱을 위한 놀라운 기능 모음을 제공합니다. `expo` package는 거의 **모든 React Native 프로젝트**에 설치할 수 있습니다.

## 도구와 기능

[Expo SDK](/versions/latest) — Android, iOS, 웹에서 동작하는 잘 검증된 React Native module의 종합 모음입니다.

[Expo로 앱 개발하기](/workflow/overview) — 핵심 개발 루프에 대한 멘탈 모델을 만드는 데 도움이 되도록 Expo 앱을 만드는 개발 과정을 개괄합니다.

[Expo Modules API](/modules/overview) — 최신 Swift와 Kotlin API로 고성능 네이티브 코드를 작성하세요.

[Prebuild](/workflow/continuous-native-generation) — React와 Native를 분리해 어떤 컴퓨터에서든 개발하고, 쉽게 업그레이드하고, white label 앱을 만들고, 더 큰 프로젝트를 유지하세요.

[Expo CLI](/more/expo-cli) — 강력한 dev server로 의존성을 관리하고, 네이티브 앱을 컴파일하고, 웹용으로 개발하고, 어떤 기기와도 연결하세요.

[Expo Go](/get-started/set-up-your-environment) — 학생과 입문자가 simulator나 기기에서 React Native를 시험해 볼 수 있는 playground입니다.

> 모든 기능은 무료이고 선택 사항이며, 서로 독립적으로 사용할 수 있습니다. 사용하지 않는 기능이 앱에 추가적인 부피를 더하지는 않습니다.

| Feature | With `expo` | Without `expo` (bare React Native) |
| --- | --- | --- |
| **전부** JavaScript로 복잡한 앱 개발 | ✓ | ✗ |
| Swift와 Kotlin으로 JSI 네이티브 module 작성 | ✓ | ✗ |
| Xcode나 Android Studio 없이 앱 개발 | ✓ | ✗ |
| 브라우저에서 [Snack](https://snack.expo.dev/)으로 예제 앱 생성 및 공유 | ✓ | ✗ |
| 네이티브 변경 없이 대규모 업그레이드 | ✓ | ✗ |
| 1급 TypeScript 지원 | ✓ | ✗ |
| 명령줄에서 네이티브 호환 라이브러리 설치 | ✓ | ✗ |
| 같은 코드베이스로 고성능 웹사이트 개발 | ✓ | ✗ |
| 어떤 기기에도 dev server [Tunnel](/more/expo-cli#tunneling) 연결 | ✓ | ✗ |

## 서비스

Expo 팀은 **Expo Application Services (EAS)**도 제공합니다. 이는 React Native 앱을 빌드하고, 제출하고, 업데이트하기 위한 깊게 통합된 클라우드 서비스입니다. EAS는 `expo` 사용 여부와 관계없이 **어떤 React Native 앱**에서도 사용할 수 있습니다.

[Expo Application Services](/eas) — 네이티브 앱을 빌드, 배포, 업데이트하는 가장 쉬운 방법입니다.
