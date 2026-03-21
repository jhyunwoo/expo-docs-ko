---
modificationDate: March 01, 2026
title: 빌드
description: EAS Build는 Expo 및 React Native 프로젝트용 앱 바이너리를 빌드하는 호스팅 서비스입니다.
---

# 빌드

EAS Build는 Expo 및 React Native 프로젝트용 앱 바이너리를 빌드하는 호스팅 서비스입니다.

**EAS Build**는 Expo 및 React Native 프로젝트용 앱 바이너리(또는 [standalone app](/more/glossary-of-terms#standalone-app))를 빌드하는 호스팅형 Expo Application Services(EAS) 서비스입니다.

EAS Build는 Expo와 React Native 프로젝트에 즉시 잘 동작하는 기본값을 제공하고, 원한다면 앱 서명 자격 증명도 대신 처리해 주므로 앱 배포용 빌드를 쉽고 자동화하기 좋게 만들어 줍니다. 또한 [internal distribution](/build/internal-distribution)([ad hoc](/build/internal-distribution) 및/또는 enterprise "universal" provisioning 사용)으로 팀과 빌드를 예전보다 훨씬 쉽게 공유할 수 있고, 앱 스토어 제출을 위해 EAS Submit과 깊게 통합되며, [`expo-updates`](/build/updates) 라이브러리에 대한 1급 지원도 제공합니다.

EAS Build는 Expo와 React Native를 사용하든 아니든 모든 네이티브 프로젝트에서 동작하도록 설계되어 있습니다. `npx create-expo-app` 또는 `npx @react-native-community/cli@latest init`에서 앱 스토어까지 가는 가장 빠른 길입니다.

## 빠른 시작

> 아래의 `eas` 명령을 사용하려면 EAS CLI가 필요합니다. 자세한 내용은 [How to install EAS CLI](/eas/cli#installation)를 참고하세요.

앱을 빌드하려면 다음 명령을 실행하세요:

```sh
eas build --platform all
```

이 명령은 프로젝트를 EAS Build로 보내고 Android와 iOS용 설치 가능한 바이너리를 생성합니다. 필요에 따라 `--platform android` 또는 `--platform ios`를 넘겨 한 번에 한 플랫폼씩 빌드할 수도 있습니다. 전체 설정 방법은 [첫 빌드 만들기](/build/setup)를 참고하세요.

## 주요 기능

-   일관된 환경에서 Android와 iOS용 클라우드 빌드
-   앱 서명 자격 증명을 자동으로 프로비저닝하고 관리하거나, 직접 제공한 자격 증명 사용 가능
-   URL로 [internal distribution](/build/internal-distribution) 빌드 공유
-   **eas.json**의 [build profile](/build/eas-json#build-profiles)(이름이 지정된 빌드 설정 묶음)과 [EAS Workflows](/eas/workflows/get-started) 또는 [CI pipeline](/build/building-on-ci) 통합을 통한 빌드 자동화
-   [`--auto-submit`](/build/automate-submissions)과 EAS Submit을 통한 성공 빌드의 앱 스토어 자동 제출
-   1급 [`expo-updates` 통합](/build/updates)과 profile별 channel, [runtime version](/eas-update/runtime-versions) 가이드
-   팀 전체가 [development build](/develop/development-builds/introduction)를 재사용 가능. 두 팀원이 `eas build:dev`를 실행했고 프로젝트 fingerprint가 일치하면, 새 빌드를 만드는 대신 기존 빌드를 EAS에서 다운로드합니다.
-   [의존성 캐싱과 사용자 지정 cache path](/build-reference/caching)를 통한 더 빠른 빌드
-   [Expo Orbit](https://expo.dev/orbit)로 기기에 빌드와 업데이트 설치

## EAS Build를 사용해야 하는 경우

| Scenario | Recommendation |
| --- | --- |
| 앱 스토어용 프로덕션 준비 바이너리 빌드 | ✓ |
| [internal distribution](/build/internal-distribution)으로 테스터와 빌드 공유 | ✓ |
| 로컬 환경 설정 없이 팀원 간 일관된 빌드 | ✓ |
| CI 또는 [EAS Workflows](/eas/workflows/get-started)에서 빌드 자동화 | ✓ |
| 앱 서명 자격 증명 관리 | ✓ |
| 네이티브 코드를 로컬에서 디버깅 | ✗ |

## 자주 묻는 질문

앱 스토어에 제출하기 전에 팀과 빌드를 어떻게 공유하나요?

빌드를 URL로 공유하려면 [internal distribution](/build/internal-distribution)을 사용하세요. **eas.json**의 [build profile](/build/eas-json#build-profiles)에 `"distribution": "internal"`을 설정하면 Android용 설치 가능한 Android Package(APK) 파일과 iOS용 [ad hoc build](/build/internal-distribution)를 생성할 수 있습니다.

기존 React Native 프로젝트에서도 EAS Build를 사용할 수 있나요?

네. EAS Build는 `npx react-native init`이나 비슷한 도구로 만든 기존 React Native 프로젝트에서도 동작합니다. 자세한 내용은 [기존 React Native 앱에서 Expo 사용 개요](/bare/overview)를 참고하세요.

EAS Build가 앱 서명 자격 증명도 처리해 주나요?

네. EAS Build는 Android [keystore](/app-signing/app-credentials#android), iOS [provisioning profile](/app-signing/app-credentials#ios), [distribution certificate](/app-signing/app-credentials#ios)를 생성하고 관리하거나, 여러분이 제공한 자격 증명을 사용할 수 있습니다. 자세한 내용은 [앱 서명 자격 증명](/app-signing/app-credentials)를 참고하세요.

클라우드 대신 로컬에서 빌드를 실행할 수 있나요?

네. `eas build --local`과 함께 [local build](/build-reference/local-builds)를 사용하면 여러분의 머신에서 빌드를 실행할 수 있습니다. 이는 디버깅이나 로컬 빌드를 요구하는 보안 정책이 있을 때 유용합니다.

EAS Workflows나 CI pipeline과 함께 EAS Build를 사용할 수 있나요?

네. EAS Build는 `build` job type을 통해 [EAS Workflows](/eas/workflows/get-started)와 통합됩니다. 예를 들어 workflow 구성에 build job을 추가할 수 있습니다:

```yaml
jobs:
  build_ios:
    type: build
    params:
      platform: ios
```

이 build job은 두 플랫폼 모두에 대한 빌드나 브랜치에 따른 조건부 빌드도 지원합니다:

```yaml
jobs:
  build:
    type: build
    params:
      platform: all
      profile: ${{ github.ref_name == 'main' && 'production' || 'preview' }}
```

자세한 내용과 다른 사용 예시는 [EAS Workflows build job](/eas/workflows/pre-packaged-jobs#build)을 참고하세요.

EAS Build는 어떤 provider와도 함께 [GitHub에서 빌드](/build/building-from-github)하고 [CI에서 빌드](/build/building-on-ci)하는 것을 지원합니다.

EAS Build는 어떤 빌드 서버 인프라를 사용하나요?

Android 빌드는 Google Cloud Platform에 호스팅된 Linux runner에서 실행되고, iOS 빌드는 Expo의 macOS cloud에 호스팅된 macOS runner에서 실행됩니다. 자세한 내용은 [빌드 서버 인프라](/build-reference/infrastructure)를 참고하세요.

## 시작하기

[첫 빌드 만들기](/build/setup) — iOS 및/또는 Android용으로 시작하는 데 총 몇 분밖에 걸리지 않습니다.

[내부 테스터와 앱 공유하기](/build/internal-distribution) — EAS Build는 앱의 preview build를 하나의 URL로 공유하는 데 도움을 줍니다.

[제출 자동화하기](/build/automate-submissions) — EAS Build가 성공한 빌드를 받아 앱 스토어 업로드를 자동으로 처리하는 방법을 알아보세요.

[앱 버전 관리](/build-reference/app-versions) — 더 이상 신경 쓰지 않아도 되도록 버전 증가를 자동화하세요.

[로컬 또는 자체 인프라에서 빌드 실행하기](/build-reference/local-builds) — EAS Build는 호스팅 서비스이면서, 디버깅이나 회사 보안 정책 준수를 위해 여러분의 머신에서도 실행할 수 있습니다.

[제한 사항](/build-reference/limitations) — EAS Build는 새롭고 빠르게 발전하고 있으므로 현재 제한 사항을 익혀 두는 것을 권장합니다.
