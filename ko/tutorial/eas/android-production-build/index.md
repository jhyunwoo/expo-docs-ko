---
modificationDate: March 09, 2026
title: Android용 production build 만들기
description: Android용 production build를 만드는 과정과 릴리스 프로세스를 자동화하는 방법을 알아봅니다.
---

# Android용 production build 만들기

Android용 production build를 만드는 과정과 릴리스 프로세스를 자동화하는 방법을 알아봅니다.

이 장에서는 예제 앱의 production 버전을 만들고 Google Play Store에 제출하겠습니다. 또한 새 앱 버전 생성과 릴리스를 자동화하는 방법도 살펴보겠습니다.

[시청하기: Android용 production build 만들고 릴리스하기](https://www.youtube.com/watch?v=nxlt8uwqhpE) — EAS로 Android용 production build를 만들고, Google Play Store에 제출하고, 릴리스 프로세스를 자동화합니다.

## 사전 준비

Google Play Store에 앱을 게시하고 배포하려면 다음이 필요합니다:

-   **Google Play Developer Account:** 유료 developer account가 있어야 합니다. 설정 방법은 [Google Play sign-up page](https://play.google.com/apps/publish/signup/)를 참고하세요.
-   **Google Service Account key:** 앱 제출 프로세스를 자동화하려면 Google Service Account email과 JSON key가 필요합니다. **[Google Service Account key를 만들거나 기존 계정에서 다운로드하는 방법](https://expo.fyi/creating-google-service-account)에 대한 자세한 가이드의 지침을 따른 뒤 다시 이 가이드로 돌아오세요.** 이것은 선택 사항이지만 [릴리스 프로세스 자동화](/tutorial/eas/android-production-build#automated-release)를 위해 필요합니다.
-   **Production build profile:** **eas.json**에 `production` build profile이 있는지 확인하세요. 기본적으로 추가되어 있습니다.

## Android용 production build

[production Android build](/build/eas-json#production-builds)는 Google Play Store 배포에 최적화된 **.aab** 형식입니다. **.apk** build와 달리 **.aab** 파일은 Google Play Store를 통해서만 배포 및 설치할 수 있습니다.

## production build 만들기

기본 `production` profile을 사용해 Android production build를 만들려면 터미널을 열고 다음 명령을 실행하세요. EAS 설정에서 `production`이 기본 profile로 설정되어 있으므로 `--profile` flag로 이를 명시적으로 지정할 필요는 없습니다.

```sh
eas build --platform android
```

위 명령은 build를 queue에 추가합니다. EAS dashboard에서 **Version Code**가 자동으로 증가하는 것을 확인해 보세요.

## Google Play Console에 앱 만들기

앱을 처음으로 Google Play Store에 업로드하려면 다음이 필요합니다:

-   Google Play dashboard로 이동합니다.
-   **Home** 페이지에서 **Create app**을 클릭해 새 앱을 만듭니다.

-   앱 세부 정보를 입력하고 **Create app** 버튼을 클릭합니다.

## internal testing 버전 릴리스하기

Google Play Console에 앱을 만들고 나면 앱의 Dashboard 화면으로 이동합니다. 이제 앱의 internal test 버전을 준비해야 합니다.

-   **Dashboard**에서 **Start testing now**를 클릭합니다.

-   **Internal Testing** > **Testers for the internal testing release** 아래에 사용자 이메일 목록을 만듭니다.

-   Google Play Console은 internal testing release를 만들라고 안내합니다.
-   새 release를 만들려면 **Dashboard**로 이동해 **Create new release**를 클릭합니다. 가장 먼저 눈에 띄는 것은 Google Play Console이 **App integrity** 아래에 signing key를 자동으로 생성한다는 점입니다.

## 앱 binary 업로드하기

EAS가 production build를 만든 뒤:

-   EAS dashboard를 열고 **Download**를 클릭해 **.aab** 파일을 받습니다.

-   Google Play Console로 돌아가 **Test and release** > **Testing** > **Internal testing**으로 이동합니다.
-   **App bundles** 아래에서 **Upload**를 클릭해 **.aab** 파일을 추가합니다. 그런 다음 앱의 릴리스 세부 정보를 입력하고 **Next**를 클릭합니다.
-   다음 화면에서 **Save and publish**를 클릭합니다.

## internal release 버전 공유하기

**Track Summary** 아래에서 최신 release가 임시 앱 이름을 표시하는 것을 볼 수 있습니다. 이는 앱이 아직 검토되지 않았기 때문입니다.

**Releases** 아래에서는 앱이 internal tester에게 제공되고 있음을 볼 수 있습니다. 이 앱을 tester 팀과 공유하려면:

-   **Releases** 옆의 **Testers** 탭으로 전환합니다.
-   **How testers join your test** 아래의 **copy link**를 클릭합니다. 이 링크를 이메일이나 메시지로 tester 팀과 공유할 수 있습니다.

-   디바이스에서 테스트 이메일을 열고 안내에 따라 앱을 다운로드합니다.

-   테스트 이메일을 받은 사람은 초대를 수락해야 하며, 수락 후 디바이스에 앱을 설치할 수 있습니다.

> **Tip**: Play Store에 앱을 게시하려면 Google Dashboard의 **Set up your app** 아래 단계를 완료하세요. 이 단계들은 앱을 처음으로 Play Store에 릴리스하기 전에 필요합니다. privacy policy 링크, target audience, data safety 등의 정보를 제공해야 합니다.

> **Complete app store listing**: 스토어 등록을 준비하려면 스크린샷과 preview를 만드는 방법을 설명하는 [앱 스토어 asset 만들기](/guides/store-assets)를 참고하세요.

testing release 홍보하기

internal test release 버전을 **alpha**로 승격하려면 Google Play Store Console에서:

-   **Test and release** 아래에서 **Testing** > **Closed testing**으로 이동합니다.
-   **Closed testing - Alpha** 옆의 **Manage track**을 클릭합니다.

## Google Service Account permissions key 추가하기

> **Tip**: 이 섹션의 단계를 따르기 전에 [Google Service Account key를 만들거나 기존 계정에서 다운로드하는 방법](https://expo.fyi/creating-google-service-account) 가이드의 지침을 먼저 참고하세요.

이제부터는 [EAS Submit](/submit/introduction)을 사용해 릴리스를 자동화하고 수동 과정을 피할 수 있습니다. 이를 위해 서비스 계정 key를 프로젝트 credential에 추가해야 합니다.

Google Service Account 가이드 단계를 따른 뒤, 다운로드한 JSON key를 EAS dashboard에 업로드할 수 있습니다:

-   프로젝트의 EAS dashboard로 이동해 **Credentials**를 클릭하고, **Android** 아래에서 앱의 **Application identifier**를 클릭합니다.

-   **Service Credentials** 아래에서 **Add a Google Service Account Key**를 클릭합니다.

-   **Change Google Service Account Key** 아래에서 **Upload new key**가 선택되어 있는지 확인하고 다운로드한 JSON key를 업로드합니다. 그러면 key가 프로젝트 credential에 추가됩니다.

## internal release

**eas.json**에서 track을 `internal`로 설정해 봅시다.

-   `submit.production` profile 아래의 `track`을 `internal`로 설정합니다:

```json
{
  ... 
  "submit": {
    "production": {
      "android": {
        "track": "internal"
      }
    }
  }
}
```

위 코드 조각에서는 [`track`](/eas/json#track) 속성을 추가하고 그 값을 `internal`로 설정하고 있습니다. 이렇게 하면 `eas submit` 명령이 production build를 업로드하고 Google Play Store에서 internal testing용으로 릴리스할 수 있게 됩니다.

-   이제 `eas submit` 명령을 실행해 새 internal testing 버전을 릴리스하세요:

```sh
eas submit --platform android
```

-   이 명령은 Google Play Console에 새 internal release 버전을 자동으로 생성합니다:

## production release

production으로 앱을 릴리스하려면:

-   **eas.json**에서 `track` 값을 `production`으로 바꿉니다:

```json
{
  ... 
  "submit": {
    "production": {
      "android": {
        "track": "production"
      }
    }
  }
}
```

-   internal testing release 때 사용했던 동일한 EAS Build를 그대로 사용할 수도 있습니다. Play Store로 릴리스하려면 `eas submit` 명령을 실행하세요:

```sh
eas submit --platform android
```

-   track을 만들고 앱을 Google Play Store의 검토 프로세스로 보내려면 **Test and release** > **Production**으로 이동하고 **Releases** 아래에서 검토에 보낼 build를 선택해야 합니다.

## 자동화된 릴리스

이후 릴리스에서는 [`--auto-submit`](/build/automate-submissions) flag를 `eas build`와 함께 사용해 build 생성과 Play Store 제출을 한 단계로 결합함으로써 프로세스를 간소화할 수 있습니다:

```sh
eas build --platform android --auto-submit
```

## 요약

8장: Android용 production build 만들기

production 준비가 된 Android build를 성공적으로 만들었고, `eas submit`을 사용한 Google Play Store 업로드의 수동/자동 방식에 대해 이야기했으며, `--auto-submit`으로 릴리스 프로세스도 자동화했습니다.

다음 장에서는 iOS용 production build를 만드는 과정을 알아봅니다.

[다음: iOS용 production build 만들기](/tutorial/eas/ios-production-build)
