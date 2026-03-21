---
modificationDate: March 09, 2026
title: iOS용 production build 만들기
description: iOS용 production build를 만드는 과정과 릴리스 프로세스를 자동화하는 방법을 알아봅니다.
---

# iOS용 production build 만들기

iOS용 production build를 만드는 과정과 릴리스 프로세스를 자동화하는 방법을 알아봅니다.

이 장에서는 예제 앱의 production 버전을 만들고 TestFlight를 사용해 테스트용으로 제출하겠습니다. 그 다음 App Store 심사에 제출해 App Store에 올려 보겠습니다.

[시청하기: iOS용 production build 만들고 릴리스하기](https://www.youtube.com/watch?v=VZL_e0cEwo8) — EAS로 iOS용 production build를 만들고, TestFlight로 테스트하고, App Store에 제출합니다.

## 사전 준비

Apple의 앱 스토어에 앱을 게시하고 배포하려면 다음이 필요합니다:

-   **Apple Developer account:** 계정을 만들려면 [Apple Developer Portal](https://developer.apple.com/account/)을 참고하세요.
-   **Production build profile:** **eas.json**에 `production` build profile이 있는지 확인하세요. 기본으로 추가되어 있습니다.

## iOS용 production build

[production iOS build](/build/eas-json#production-builds)는 Apple's App Store Connect에 맞게 최적화되어 있으며, 이를 통해 TestFlight로 테스터에게 build를 배포하고 App Store를 통해 일반 사용자에게 공개할 수 있습니다. 이 build 유형은 simulator나 device에 side-load할 수 없고 App Store Connect를 통해서만 배포할 수 있습니다.

## distribution provisioning profile 만들기

터미널에서 `eas credentials` 명령을 실행한 뒤 EAS CLI의 다음 프롬프트에 답하세요:

-   **Select platform** iOS를 선택합니다.
-   **Which build profile do you want to configure?** production을 선택합니다.
-   **Do you want to log in to your Apple account?** Y를 누르세요. 그러면 Apple Developer account에 로그인합니다.
-   **What do you want to do?** **Build credentials**를 선택하고 **All: Set up all the required credentials to build your project**를 고릅니다.
-   이제 이전 Distribution Certificate를 재사용할지 묻습니다. Y를 누르세요.
-   **Generate a new Apple Provisioning Profile?** Y를 누르세요. 이것이 production 앱용 provisioning profile이 됩니다.
-   profile 생성이 끝나면 아무 `ctrl + c`나 눌러 EAS CLI를 종료합니다.

## production build 만들기

기본 `production` profile을 사용해 iOS production build를 만들려면 터미널을 열고 다음 명령을 실행하세요. EAS 설정에서 `production`이 기본 profile로 설정되어 있으므로 `--profile` flag로 명시할 필요가 없습니다.

```sh
eas build --platform ios
```

이 명령은 build를 queue에 추가합니다. EAS dashboard에서 **Build Number**가 자동으로 증가하는 것을 확인해 보세요.

## 앱 binary를 App Store에 제출하기

가장 최근 EAS Build에서 생성한 앱 binary를 제출하려면 [`eas submit`](/submit/introduction) 명령을 실행하세요:

```sh
eas submit --platform ios
```

이 명령을 실행한 뒤에는 다음을 해야 합니다:

-   **Select a build from EAS.** 가장 최근 build ID를 선택합시다.
-   **Follow the prompt to log in to our Apple account.** **Reuse this App Store Connect API Key?**를 묻는다면 Y를 누르세요.

그러면 제출 프로세스가 시작됩니다.

## internal testing 버전 릴리스하기

제출 프로세스가 끝나면 웹 브라우저에서 Apple Developer account에 로그인해야 합니다.

-   **[Apps](https://appstoreconnect.apple.com/apps)**를 클릭하고 앱 아이콘을 확인합니다.
-   앱 이름을 클릭한 뒤, navigation tab 메뉴에서 **TestFlight**를 클릭합니다. build를 방금 제출했다면 Apple이 TestFlight로 배포 가능하도록 처리하는 데 몇 분이 걸릴 수 있습니다.

> **Only if you have skipped [iOS development build for devices chapter](/tutorial/eas/ios-development-build-for-devices):** **iOS app only uses standard/exempt encryption?** 이 프롬프트에서 제공되는 기본값을 선택하려면 Y를 누르세요. 우리 앱은 encryption을 사용하지 않으므로, **Info.plist** 파일의 `ITSAppUsesNonExemptEncryption`을 `NO`로 설정하고, 나중에 앱을 TestFlight/Apple App Store에 릴리스할 때 관련 compliance check도 처리해 줍니다. 자신의 앱을 릴리스할 때 encryption을 사용하는 경우에는 N을 선택해 다음부터 이 프롬프트를 건너뛸 수 있습니다.

-   App Store Connect의 **Internal Testing** 아래에서 테스트 그룹을 만듭니다. 이렇게 하면 테스트 사용자를 초대할 수 있습니다.

-   그룹이 만들어지면 모든 테스트 사용자에게 이메일이 전송됩니다.

-   이메일에서 **View in TestFlight**를 클릭하고 초대를 수락한 다음 **Install**을 탭합니다.

그 후 앱이 디바이스에 다운로드되어 테스트할 수 있게 됩니다.

> **Note**: internal testing과 비슷하게 TestFlight를 사용해 external tester를 초대하는 그룹도 만들 수 있습니다. internal testing은 100명 제한이 있지만, TestFlight는 최대 10,000명의 tester에게 외부 테스트 릴리스 버전을 공유할 수 있고 공개 공유 링크도 제공합니다. 간결함을 위해 이 튜토리얼에서는 그 단계까지는 다루지 않겠습니다.

## 앱을 Apple App Store에 제출하기

App Store 제출을 준비하려면 **App Store** 탭으로 이동하세요:

-   metadata 세부 사항을 입력하고 Apple 가이드라인에 맞는 스크린샷을 제공하며 **General** 아래 세부 정보도 입력합니다.

-   그런 다음 build를 수동으로 선택합니다.

> **Complete App Store listing**: 스토어 등록을 준비하려면 스크린샷과 preview를 만드는 방법을 설명하는 [앱 스토어 asset 만들기](/guides/store-assets)를 참고하세요.

-   앱이 준비되면 **Submit to App Review**를 클릭합니다. 그러면 Apple이 앱을 검토하고, 승인되면 App Store에서 사용할 수 있게 됩니다.

## 자동화된 제출

이후 릴리스에서는 [`--auto-submit`](/build/automate-submissions) flag를 `eas build`와 함께 사용해 build 생성과 App Store 제출을 한 단계로 결합함으로써 프로세스를 간소화할 수 있습니다:

```sh
eas build --platform ios --auto-submit
```

> **Note:** 이 명령은 build를 내부 테스트용 TestFlight에 자동 업로드하지만, App Store 심사에는 자동 제출하지 않습니다. 공개 릴리스 준비가 되었을 때는 여전히 TestFlight에서 App Store로 build를 수동 승격해야 합니다. 자세한 내용은 [앱 스토어 기본 제출 동작](/build/automate-submissions#default-submission-behavior-for-app-stores)을 참고하세요.

## 요약

9장: iOS용 production build 만들기

production 준비가 된 iOS build를 성공적으로 만들었고, `eas submit`을 사용한 TestFlight와 Apple App Store 배포에 대해 이야기했으며, `--auto-submit`으로 릴리스 프로세스도 자동화했습니다.

다음 장에서는 EAS Update를 사용해 OTA update를 보내고 팀과 preview를 공유하는 방법을 알아봅니다.

[다음: 팀과 preview 공유하기](/tutorial/eas/team-development)
