---
modificationDate: May 02, 2025
title: Internal distribution
description: EAS Build가 internal distribution을 위해 팀과 공유할 수 있는 빌드 URL을 어떻게 제공하는지 알아보세요.
---

# Internal distribution

EAS Build가 internal distribution을 위해 팀과 공유할 수 있는 빌드 URL을 어떻게 제공하는지 알아보세요.

internal distribution build를 설정하는 데는 EAS Build로 몇 분밖에 걸리지 않으며, 팀과 다른 테스터에게 피드백을 받기 위해 앱을 공유하는 간소화된 방법을 제공합니다. 이것은 기기에 앱을 직접 설치할 수 있게 해 주는 URL을 제공함으로써 이루어집니다. 아직 이 접근 방식을 사용할지 확신이 없고 앱을 내부적으로 배포하는 모든 선택지를 먼저 알고 싶다면 [review용 앱 배포 개요](/review/overview) 가이드를 참고하세요.

## Internal distribution 사용하기

internal distribution용 build profile을 구성하려면 해당 profile에 `"distribution": "internal"`을 설정하세요. 이 구성을 설정하면 build profile에는 다음과 같은 영향이 있습니다:

-   **Android**: `gradleCommand`의 기본 동작이 AAB가 아니라 APK를 생성하도록 바뀝니다. 사용자 지정 `gradleCommand`를 지정했다면, 그것이 [APK를 생성](/build-reference/apk#configuring-a-profile-to-build-apks)하는지 반드시 확인하세요. 그렇지 않으면 Android 기기에 직접 설치할 수 없습니다. 또한 EAS Build는 APK 서명을 위해 새 Android keystore를 생성하거나, package name이 [development build](/develop/development-builds/introduction)와 같다면 기존 keystore를 사용합니다.
-   **iOS**: 이 profile을 사용하는 빌드는 [ad hoc 또는 enterprise provisioning](/build/internal-distribution#overview-of-distribution-mechanisms)을 사용합니다. ad hoc provisioning을 사용하는 경우 EAS Build는 기기 UDID allow-list가 포함된 provisioning profile을 생성하며, 빌드 시점에 이 목록에 있는 기기만 설치할 수 있습니다. `eas device:create`를 실행하고 새 빌드를 만들면 기기를 추가할 수 있습니다.
-   기본적으로 internal distribution build URL은 URL을 아는 누구에게나 열려 있으며, 각 URL은 32자 UUID로 식별됩니다. 권한이 있는 Expo 계정으로 로그인해야만 이 빌드에 접근하도록 하려면 [project settings](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/settings)에서 **Unauthenticated access to internal builds** 옵션을 비활성화하세요.

아래의 EAS Build internal distribution 튜토리얼에서 build를 구성하고 생성하고 설치하는 방법을 더 자세히 볼 수 있습니다:

[Create and share internal distribution build](/tutorial/eas/internal-distribution-builds) — EAS Build로 internal distribution build를 설정하고 공유하는 전체 단계별 가이드입니다.

### CI에서 자동화하기(선택 사항)

`--non-interactive` 플래그를 사용하면 CI에서 internal distribution build를 non-interactive 모드로 실행할 수 있습니다. 다만 iOS에서 ad hoc provisioning을 사용한다면 이 플래그를 사용할 때 provisioning profile에 새 기기를 추가할 수 없습니다. `eas device:create`로 기기를 등록한 뒤에는, EAS가 그 기기를 provisioning profile에 추가할 수 있도록 `eas build`를 interactive 모드로 실행하고 Apple에 인증해야 합니다. 자세한 내용은 [CI에서 빌드 트리거하기](/build/building-on-ci)를 참고하세요.

### 기기 관리하기

`eas device:create`로 등록한 기기는 다음 명령으로 확인할 수 있습니다:

```sh
eas device:list
```

ad hoc provisioning용으로 Expo에 등록된 기기는 EAS Build로 새 internal build를 만들거나, `eas build:resign`으로 [기존 빌드를 새 자격 증명으로 다시 서명](/app-signing/app-credentials#re-signing-new-credentials)할 때 provisioning profile 생성에 사용된 이후 Apple Developer Portal에 표시됩니다.

#### 기기 제거하기

더 이상 사용하지 않는 기기는 다음 명령으로 이 목록에서 제거할 수 있습니다:

```sh
eas device:delete
```

이 명령은 Apple Developer Portal에서도 기기를 비활성화할지 묻습니다. 비활성화된 기기도 앱당 ad hoc distribution에 대한 [Apple의 100대 기기 제한](https://developer.apple.com/support/account/#:~:text=Resetting%20your%20device%20list%20annually)에 계속 포함됩니다.

#### 기기 이름 바꾸기

웹사이트 URL/QR 코드로 추가한 기기는 EAS Build에서 선택할 때 기본적으로 UDID가 표시됩니다. 다음 명령으로 기기에 이해하기 쉬운 이름을 붙일 수 있습니다:

```sh
eas device:rename
```

## 배포 메커니즘 개요

다음은 internal distribution에서 지원하는 기기 배포 메커니즘입니다.

Android: APK 빌드 및 배포

앱을 Android 기기에 공유하려면 프로젝트의 APK(Android application package file)를 빌드해야 합니다. APK는 사용자가 Play Store 심사를 거치지 않은 앱 설치에 대한 보안 경고를 수락하면 USB로 직접 설치하거나, 웹에서 파일을 내려받거나, 이메일 또는 채팅 앱을 통해 Android 기기에 직접 설치할 수 있습니다. 반면 앱의 AAB(Android app bundle) 바이너리는 Play Store를 통해 배포해야 합니다.

iOS: Ad Hoc distribution

Apple은 기기를 Apple Developer 계정에 등록한 뒤 앱을 테스트 기기에 배포할 수 있도록 [ad hoc provisioning profile](https://help.apple.com/xcode/mac/current/#/dev7ccaf4d3c)을 제공합니다. 이 방법을 사용하려면 유료 Apple Developer 계정이 필요하며, 한 계정으로는 1년에 최대 100대의 iPhone에만 이 방식으로 배포할 수 있습니다.

앱을 설치할 각 기기의 UDID(Unique Device Identifier)를 알아야 하므로, 개발자가 아닌 사람과 앱을 공유하려는 경우에는 다소 까다로울 수 있습니다. 새 기기를 추가하려면 앱을 다시 빌드하거나, [새 자격 증명으로 빌드를 다시 서명](/app-signing/app-credentials#re-signing-new-credentials)해야 합니다.

Ad Hoc 인증서를 올바르게 설정하는 일은 처음이라면 부담스럽고, 경험이 있어도 번거롭습니다. 하지만 [EAS Build](/build/internal-distribution#internal-distribution-with-eas-build)를 사용한다면, Expo와 React Native 프로젝트에 최적화되어 있기 때문에 Ad Hoc 자격 증명을 설정하는 데 드는 번거로운 부분을 대신 처리해 줍니다.

iOS: Enterprise distribution

앱이 대규모 조직의 직원만을 위한 내부 사용 목적이며 App Store를 통해 배포할 수 없다면 Enterprise distribution을 사용해야 합니다. Ad Hoc Distribution과 달리 앱을 설치할 수 있는 기기 수에 제한이 없고, 각 기기의 UDID를 관리할 필요도 없습니다. 이런 앱은 보통 모바일 기기 관리(MDM) 솔루션을 통해 최종 사용자에게 배포됩니다. Enterprise Distribution을 사용하려면 [Apple Developer Enterprise Program](https://developer.apple.com/programs/enterprise/) 멤버십이 필요합니다. Enterprise Program에 가입하는 조직은 App Store 배포보다 더 많은 추가 요건을 충족해야 합니다.
