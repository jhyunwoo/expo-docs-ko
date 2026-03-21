---
modificationDate: March 01, 2026
title: local 플래그로 로컬에서 EAS Build 실행하기
description: --local 플래그를 사용해 여러분의 머신이나 커스텀 인프라에서 EAS Build를 사용하는 방법을 알아보세요.
---

# local 플래그로 로컬에서 EAS Build 실행하기

`--local` 플래그를 사용해 여러분의 머신이나 커스텀 인프라에서 EAS Build를 사용하는 방법을 알아보세요.

`eas build --local` 플래그를 사용하면 보통 EAS Build 서버에서 실행되는 동일한 빌드 프로세스를 여러분의 머신에서 직접 실행할 수 있습니다. 이는 클라우드 빌드에서 발생하는 빌드 실패를 디버깅하는 데 유용하며, 동일한 단계 집합을 실행하지 않고서는 재현하기 어려운 문제를 확인할 수 있습니다.

```sh
eas build --platform android --local
eas build --platform ios --local
```

## 사전 준비

Expo에 인증되어 있어야 합니다:

-   `eas login`을 실행합니다.
-   또는 [token 기반 인증](/accounts/programmatic-access)을 사용해 `EXPO_TOKEN`을 설정합니다.

## 로컬 빌드의 사용 사례

-   EAS 서버에서 발생하는 빌드 실패를 [디버깅](/build-reference/local-builds#use-local-builds-for-debugging)할 때.
-   서드파티 CI/CD 서비스 사용을 제한하는 회사 정책이 있을 때. 로컬 빌드에서는 전체 프로세스가 여러분의 인프라에서 실행되며 EAS 서버와의 통신은 다음 경우에만 발생합니다:
    -   프로젝트 `@account/slug`가 존재하는지 확인할 때
    -   managed credentials를 사용 중이라면 이를 다운로드할 때

## 디버깅에 로컬 빌드 사용하기

EAS 서버에서 빌드 실패가 발생했고 로그를 살펴봐도 원인을 파악할 수 없다면, 문제를 로컬에서 디버깅하는 것이 도움이 될 수 있습니다. 이 과정을 단순하게 하기 위해 로컬 빌드 프로세스를 구성할 수 있는 여러 환경 변수를 지원합니다.

-   `EAS_LOCAL_BUILD_SKIP_CLEANUP=1` - 빌드 프로세스가 끝난 뒤 작업 디렉터리를 정리하지 않도록 설정합니다.
-   `EAS_LOCAL_BUILD_WORKINGDIR` - 빌드 프로세스의 작업 디렉터리를 지정합니다. 기본값은 **/tmp** 디렉터리 아래 어딘가입니다(플랫폼에 따라 달라집니다).
-   `EAS_LOCAL_BUILD_ARTIFACTS_DIR` - 성공적인 빌드 후 아티팩트가 복사되는 디렉터리입니다. 기본적으로 이 파일들은 현재 디렉터리로 복사되는데, 연속해서 많은 빌드를 실행하는 경우 원하지 않을 수 있습니다.

iOS 빌드에서 `EAS_LOCAL_BUILD_SKIP_CLEANUP`과 `EAS_LOCAL_BUILD_WORKINGDIR`를 사용하면 작업 디렉터리의 `logs` 하위 디렉터리 내용을 검사해 Xcode 로그를 읽을 수 있습니다.

## 제한 사항

클라우드 빌드에서 사용할 수 있는 일부 옵션은 로컬에서는 사용할 수 없습니다. 알아두어야 할 제한 사항은 다음과 같습니다:

-   특정 플랫폼에 대해서만 빌드할 수 있습니다(`all` 옵션은 비활성화되어 있습니다).
-   소프트웨어 버전을 사용자 지정하는 기능은 지원되지 않으며, **eas.json**의 `node`, `yarn`, `fastlane`, `cocoapods`, `ndk`, `image` 필드는 무시됩니다.
-   캐싱은 지원되지 않습니다.
-   ["Secret" 가시성](/eas/environment-variables#visibility-settings-for-environment-variables)을 가진 EAS 환경 변수는 지원되지 않습니다(대신 로컬 환경에 설정하세요).
-   환경에 필요한 도구가 모두 설치되어 있는지 확인하는 책임은 여러분에게 있습니다:
    -   Node.js/Yarn/npm
    -   fastlane(iOS 전용)
    -   CocoaPods(iOS 전용)
    -   Android SDK 및 NDK
-   Windows에서는 로컬 EAS Build에 [WSL](https://docs.microsoft.com/en-us/windows/wsl/install)을 사용할 수 있습니다. 하지만 이 플랫폼은 공식적으로 테스트하지 않으며 로컬 빌드에서 Windows를 지원하지 않습니다(macOS와 Linux는 지원).

## 로컬에서 개발용 및 프로덕션 빌드용 앱 컴파일하기

개발용으로 앱을 로컬 컴파일하려면 대신 Expo CLI의 `npx expo run:android` 또는 `npx expo run:ios` 명령을 사용하세요. [Continuous Native Generation](/workflow/continuous-native-generation)을 사용한다면 [prebuild](/more/glossary-of-terms#prebuild)를 실행해 **android** 및 **ios** 디렉터리를 생성한 뒤, 각 IDE에서 프로젝트를 열어 다른 네이티브 프로젝트처럼 빌드할 수도 있습니다. 자세한 내용은 다음을 참고하세요:

[Local app development](/guides/local-app-development): 여러분의 컴퓨터에서 Expo 앱을 로컬로 컴파일하고 빌드하는 방법을 알아보세요.

로컬에서 프로덕션 빌드를 만들려면 컴퓨터에 Android Studio와 Xcode가 설치되어 있어야 합니다. 자세한 내용은 다음 가이드를 참고하세요:

[Create a production build locally](/guides/local-app-production): 여러분의 컴퓨터에서 Expo 앱의 프로덕션 빌드를 만드는 방법을 알아보세요.

위 접근 방식들 중 무엇을 사용하든, 클라우드의 EAS Build로 빌드를 만드는 절차와는 다른 과정을 따르게 됩니다. 바로 그 점 때문에 `eas build --local` 플래그가 존재합니다.
