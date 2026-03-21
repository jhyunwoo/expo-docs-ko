---
modificationDate: March 01, 2026
title: EAS Submit
description: EAS Submit은 명령줄에서 Android와 iOS 앱 바이너리를 Google Play Store와 Apple App Store에 제출할 수 있게 해주는 hosted 서비스입니다.
---

# EAS Submit

EAS Submit은 명령줄에서 Android와 iOS 앱 바이너리를 Google Play Store와 Apple App Store에 제출할 수 있게 해주는 hosted 서비스입니다.

**EAS Submit**은 EAS(Expo Application Services)가 제공하는 hosted 서비스로, [Google Play Console](https://play.google.com/console)를 열거나 [Transporter app](https://apps.apple.com/us/app/transporter/id1450874784)을 다운로드하지 않고도 Android 및 iOS binary를 Google Play Store와 Apple App Store에 직접 제출할 수 있게 해줍니다.

EAS Submit은 빌드된 binary를 Google과 Apple에 보내 store review를 받게 함으로써 모바일 앱 배포의 마지막 단계를 자동화합니다. 수동 업로드가 필요 없어지고 store 제출 중 발생하는 오류도 줄일 수 있습니다. 또한 Windows와 Linux를 사용하는 개발자도 iOS build를 업로드할 수 있게 해주는데, 이는 원래 macOS 장비에서만 지원되는 작업입니다.

EAS Submit은 [EAS Build](/build/introduction)로 빌드한 앱 또는 로컬에서 빌드한 앱과 함께 동작하며, 여러 submission profile을 지원합니다. CLI 명령으로 제출을 시작할 수도 있고, build가 끝난 뒤 자동으로 제출하거나 CI/CD 서비스에서 제출할 수도 있습니다. 이를 통해 팀은 두 플랫폼 모두에서 더 빠르고 일관된 릴리스 workflow를 가질 수 있습니다.

## Quick start

> 아래 `eas` 명령은 EAS CLI가 필요합니다. 자세한 내용은 [How to install EAS CLI](/eas/cli#installation)를 참고하세요.

Android build 제출:

```sh
eas submit --platform android
```

iOS build 제출:

```sh
eas submit --platform ios
```

빌드와 제출을 한 번에 실행:

```sh
eas build --platform ios --auto-submit
```

## How EAS Submit works

**EAS Submit**은 앱을 app store의 배포 pipeline(Google Play Store의 선택한 track 또는 iOS용 [TestFlight](https://developer.apple.com/testflight/))으로 전달하며, 이는 [default submission behavior for app stores](/build/automate-submissions#default-submission-behavior-for-app-stores)를 따릅니다. Google Play Console과 App Store Connect에서 앱 배포를 위한 대기열에 올린 다음, 해당 사이트에 로그인해 review로 보낼 수 있으며, 그 후 사용자에게 배포할 수 있습니다.

### Android (Google Play Store)

-   어디로 가나: EAS Submit은 build를 Google Play Console로 업로드합니다.
-   그다음 무슨 일이 일어나나: Build는 지정한 track(internal, alpha, beta, production)에 배치됩니다.
-   첫 제출: Google은 API 기반 제출이 동작하기 전에 앱을 최소 한 번 수동으로 업로드할 것을 요구합니다.
-   이것이 production을 의미하나?
    -   internal, alpha, beta를 사용하면 앱은 해당 track의 tester에게만 제공됩니다.
    -   production을 명시적으로 선택했다면 그렇습니다. Google이 릴리스를 승인하면 모든 사용자에게 제공됩니다.

### iOS (App Store Connect/TestFlight)

-   어디로 가나: EAS Submit은 build를 App Store Connect로 업로드합니다.
-   그다음 무슨 일이 일어나나: Build가 TestFlight에서 사용할 수 있게 됩니다.
-   이것이 production을 의미하나? 아닙니다. TestFlight build는 Apple App Store에 자동으로 출시되지 않습니다.
-   Production이 되는 방법: App Store Connect에 로그인하고 모든 metadata, security questionnaire, 앱 스크린샷을 업로드한 뒤 build를 선택하고 App Review에 제출해야 production으로 출시할 수 있습니다.

## When to use EAS Submit

| Scenario | Recommendation |
| --- | --- |
| 앱 binary를 [Google Play Console](https://play.google.com/console/about/)과 [Apple App Store](https://developer.apple.com/app-store-connect/)에 업로드 | ✓ |
| non-macOS 장비에서 iOS 앱 binary 업로드 | ✓ |
| Play Console, App Store Connect, Transporter를 통한 수동 업로드 피하기 | ✓ |
| [CI 또는 자동화 workflow](/eas/workflows/pre-packaged-jobs#submit)에서 build 제출 | ✓ |
| [eas.json](/eas/json) config file로 릴리스 프로세스 표준화 | ✓ |
| 제출 과정에서의 human error 줄이기 | ✓ |
| 로컬에서 테스트 중이고 아직 store 제출 준비가 안 됨 | ✗ |
| Google Play Store용 store listing이 아직 구성되지 않음 | ✗ |

## Frequently asked questions (FAQ)

Can I submit builds that were not built with EAS Build?

예. EAS Submit은 유효한 **.aab**(Android App Bundle) 또는 **.ipa**(iOS App Archive) 파일이라면 모두 받을 수 있습니다.

EAS Build로 생성한 build는 `eas submit`을 실행한 뒤 목록에서 build를 선택하거나, 최신 build를 자동으로 사용하게 할 수 있습니다.

로컬 build의 경우 `--path` flag를 사용해 binary를 지정하세요:

```sh
eas submit --platform android --path ./my-app.aab
eas submit --platform ios --path ./my-app.ipa
```

Binary는 올바르게 서명되어 있어야 합니다. Android의 경우 release keystore를 의미하고, iOS의 경우 distribution certificate와 provisioning profile을 의미합니다.

Can I use EAS Submit for TestFlight?

예. EAS Submit을 통한 모든 iOS 제출은 App Store Connect로 업로드되며, 처리 후 TestFlight에 나타납니다. 처리에는 보통 10-15분 정도 걸리지만 달라질 수 있습니다.

처리가 끝나면 internal tester에게 즉시 배포하거나, 간단한 Beta App Review 후 external tester를 추가할 수 있습니다. App Store에 출시하려면 App Store Connect에서 build를 수동으로 App Review에 제출해야 합니다.

Can I use EAS Submit inside EAS Workflows or from other CI/CD pipelines?

예. EAS Submit은 CI 환경에서 동작하며 [EAS Workflows](/eas/workflows/get-started)와 통합됩니다. Workflow 설정에 submit job을 추가할 수 있습니다. 예를 들면 다음과 같습니다:

```yaml
jobs:
  submit_ios_to_store:
    type: submit
    params:
      platform: ios
    after:
      - build_ios
```

자세한 내용은 [EAS Workflows pre-packaged jobs](/eas/workflows/pre-packaged-jobs#submit)를 참고하세요.

CI pipeline에서는 prompt를 건너뛰기 위해 `--non-interactive` flag를 사용하고, 최신 build를 자동 선택하기 위해 `--latest`를 사용할 수도 있습니다:

```sh
eas submit --platform android --latest --non-interactive
```

Do I need to handle metadata or screenshots?

EAS Submit은 binary를 업로드하지만, store listing metadata, screenshot, release note는 관리하지 않습니다.

Google Play Store의 경우 제출 전에 [Google Play Console](https://play.google.com/console/about/)에서 store listing을 직접 구성하세요.

Apple App Store의 경우 [EAS Metadata](/eas/metadata)를 사용해 앱 정보와 localized description을 자동화할 수 있습니다.

What credentials do I need?

Android의 경우 Google Play Console에서 앱에 접근할 수 있는 [Google Service Account Key](/submit/android#creating-a-google-service-account)가 필요합니다. API 제출이 동작하기 전에 앱을 최소 한 번 수동으로 업로드해야 합니다.

iOS의 경우 Apple Developer 계정이 필요합니다. EAS Submit은 [`ascAppId`](/eas/json#ascappid)(App Store Connect app ID)가 필요하며, Apple ID credential을 묻거나 구성된 App Store Connect API Key를 사용합니다.

자세한 내용은 [Google's Play Store's prerequisites](/submit/android#prerequisites)와 [Apple's App Store prerequisites](/submit/ios#prerequisites)를 참고하세요.

How do I know why my submission failed?

EAS Submit 제출이 왜 실패했는지 확인하려면 [EAS dashboard](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/submissions)의 submission details 페이지를 여세요:

-   submission details 페이지에 제공되는 로그를 사용해 오류를 파악하세요.
-   ["Build Annotations" bubble](https://expo.dev/changelog/2023-12-01-build-annotations)이 있다면 확인하세요. 이는 로그 안에서 일반적인 실패 원인과 제안되는 수정 방법을 바로 보여줍니다.

## Get started

[Submit to the Google Play Store](/submit/android) — Android 앱을 Google Play Store에 제출하는 방법을 알아보세요.

[Submit to the Apple App Store](/submit/ios) — iOS/iPadOS 앱을 Apple App Store에 제출하는 방법을 알아보세요.

[Configuration with eas.json](/submit/eas-json) — eas.json으로 제출을 구성하는 방법을 확인하세요.
