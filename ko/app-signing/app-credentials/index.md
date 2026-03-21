---
modificationDate: July 24, 2024
title: 앱 자격 증명
description: Android와 iOS에 어떤 앱 자격 증명이 필요한지 알아보세요.
---

# 앱 자격 증명

Android와 iOS에 어떤 앱 자격 증명이 필요한지 알아보세요.

Expo는 Android와 iOS용 앱 서명 과정을 자동화하지만, 두 경우 모두 직접 재정의 값을 제공할 수 있습니다. [EAS Build](/build/introduction)는 서명된 애플리케이션과 서명되지 않은 애플리케이션을 모두 생성할 수 있지만, 스토어를 통해 애플리케이션을 배포하려면 **반드시** 서명된 애플리케이션이어야 합니다.

이 페이지에서는 각 플랫폼에 필요한 자격 증명에 대해 알아봅니다. Expo 쪽에서 자격 증명을 어떻게 저장하는지 궁금하다면 [보안 문서](/app-signing/security)를 확인해 보세요.

## Android

Google은 모든 Android 앱이 기기에 설치되거나 업데이트되기 전에 인증서로 디지털 서명되도록 요구합니다. 일반적으로 개인 키와 그 공개 인증서는 키스토어에 저장됩니다. 과거에는 스토어에 업로드하는 APK가 반드시 **앱 서명 인증서**(Play Store에서 앱에 연결될 인증서)로 서명되어야 했고, 키스토어를 잃어버리면 이를 복구하거나 재설정할 방법이 없었습니다. 이제는 Google Play 앱 서명에 옵트인하여 **업로드 인증서**로 서명된 APK를 업로드하기만 하면, Google Play가 이를 자동으로 **앱 서명 인증서**로 교체합니다. 기존 방식(앱 서명 인증서)과 새 방식(업로드 인증서)은 본질적으로 같은 메커니즘이지만, 새 방식을 사용하면 업로드 키스토어를 잃어버리거나 유출된 경우 Google Play 지원팀에 연락해 키를 재설정할 수 있습니다.

Expo 빌드 프로세스의 관점에서는 앱이 **업로드 인증서**로 서명되었는지 **앱 서명 키**로 서명되었는지 차이가 없습니다. 어느 쪽이든 `eas build`는 현재 애플리케이션과 연결된 키스토어로 서명된 **.apk** 또는 **.aab**를 생성합니다. 업로드 키스토어를 수동으로 만들고 싶다면 원래 키스토어를 만들었던 것과 같은 방식으로 만들 수 있습니다.

이 과정에 대한 자세한 내용은 [Android 문서](https://developer.android.com/studio/publish/app-signing)를 참조하세요.

### Google Play 앱 서명

[첫 번째 릴리스를 Google Play에 업로드](https://expo.fyi/first-android-submission)하면 "App signing by Google Play"와 "Google is protecting your app signing key"에 대한 안내가 표시됩니다. 이것이 기본 동작이며 **Continue**를 누르는 것 외에는 별도의 조치가 필요하지 않습니다.

현재 직접 앱 서명 키를 관리하고 있고 Google이 대신 관리하길 원한다면 [Use app signing by Google Play](https://support.google.com/googleplay/android-developer/answer/9842756)를 참조하세요.

키스토어를 잃어버렸나요? Google Play에서 업로드 키를 재설정하는 방법을 알아보세요.

Expo 키스토어를 Google과 동기화하려면 다음 단계를 따르세요:

#### 자격 증명 다운로드

터미널 창에서:

1.  `eas credentials` 명령을 실행합니다.
2.  플랫폼으로 `Android`를 선택하고, 자격 증명을 다운로드하려는 프로필을 선택합니다.
3.  `credentials.json: Upload/Download credentials between EAS servers and your local json` 옵션을 선택합니다.
4.  `Download credentials from EAS to credentials.json`을 선택합니다.

애플리케이션의 키스토어는 비공개로 유지해야 합니다. **어떤 경우에도 저장소에 커밋하면 안 됩니다.** 유일한 예외는 디버그 키스토어인데, Google Play Store에 앱을 업로드할 때는 이를 사용하지 않기 때문입니다.

#### 키스토어를 `pem` 형식으로 내보내기

자격 증명과 키스토어를 다운로드한 뒤, Google에 제출할 수 있도록 `pem` 형식으로 내보내세요:

1.  **credentials.json** 파일에서 `keyAlias` 키 아래에 있는 키 별칭을 찾습니다.
2.  `keytool`을 사용해 인증서를 내보냅니다:

```sh
keytool -export -rfc -alias alias_from_step_1 -file certificate_for_google.pem -keystore ./path/to/keystore.jks
```

#### Google 지원에 문의하기

[이 지원 양식](https://support.google.com/googleplay/android-developer/contact/key)을 사용해 Google Support에 연락하고 키 변경을 요청하세요. 양식을 작성할 때 키스토어에서 내보낸 `pem` 파일을 첨부합니다.

Google이 계정에 이 변경을 반영하면 `eas build`로 생성된 빌드가 Google Play Store에서 기대하는 방식으로 올바르게 서명됩니다. Google은 새 업로드 인증서의 유효 시작일을 현재로부터 72시간 후로 설정하므로, 이 과정을 수행한 뒤 첫 제출 전에는 기다려야 한다는 점에 유의하세요.

## iOS

Apple Developer 계정과 연결되는 iOS의 세 가지 주요 자격 증명은 다음과 같습니다:

-   Distribution Certificate
-   Provisioning Profiles
-   Push Notification Keys

모든 자격 증명을 EAS에 맡기든 직접 관리하든, 각 자격 증명이 무엇을 의미하는지, 언제 어디서 사용되는지, 만료되거나 취소되면 어떤 일이 일어나는지 이해해 두는 것이 유용합니다. `eas credentials`를 실행하면 EAS CLI로 모든 자격 증명을 확인하고 관리할 수 있습니다.

### 배포 인증서

배포 인증서는 특정 앱이 아니라 개발자인 여러분 자신과 관련이 있습니다. Apple Developer 계정에는 하나의 배포 인증서만 연결할 수 있습니다. 이 인증서는 여러분의 모든 앱에 사용됩니다. 이 인증서가 만료되어도 프로덕션에 있는 앱에는 영향을 주지 않습니다. 하지만 새 앱을 App Store에 업로드하거나 기존 앱을 업데이트하려면 새 인증서를 생성해야 합니다. 배포 인증서를 삭제해도 이미 App Store에 올라가 있는 앱에는 아무 영향이 없습니다. 다음에 빌드할 때 `eas credentials`를 실행하고 안내를 따르면 Expo가 현재 여러분의 앱용으로 저장하고 있는 배포 인증서를 지울 수 있습니다.

### 푸시 알림 키

Apple Push Notification Keys(흔히 APN 키라고 줄여 부름)는 연결된 앱이 푸시 알림을 보내고 받을 수 있도록 합니다.

Apple Developer 계정에는 최대 2개의 APN 키만 연결할 수 있으며, 하나의 키를 여러 앱에서 사용할 수 있습니다. APN 키를 취소하면 그 키에 의존하는 모든 앱은 새 키를 업로드해 교체할 때까지 푸시 알림을 보내거나 받을 수 없게 됩니다. 새 APN 키를 업로드해도 사용자의 [Expo Push Tokens](/versions/latest/sdk/notifications#notificationsgetexpopushtokenasync)는 **변경되지 않습니다**. 푸시 알림 키는 만료되지 않습니다. `eas credentials`를 실행하고 안내를 따르면 Expo가 현재 여러분의 앱용으로 저장하고 있는 APN 키를 지울 수 있습니다.

> Expo가 만든 APN 키는 [Expo website](https://expo.dev/accounts/%5Baccount%5D/settings/credentials)에서 다운로드할 수 있습니다.

### 프로비저닝 프로파일

각 프로파일은 앱별로 다르므로 App Store에 제출하는 모든 앱마다 하나의 프로비저닝 프로파일이 있게 됩니다. 이 프로비저닝 프로파일은 배포 인증서와 연결되어 있으므로, 배포 인증서가 취소되거나 만료되면 앱의 프로비저닝 프로파일도 다시 생성해야 합니다. 배포 인증서와 마찬가지로 앱의 프로비저닝 프로파일을 취소해도 이미 App Store에 있는 앱에는 아무 영향이 없습니다.

프로비저닝 프로파일은 12개월 후 만료되지만 프로덕션 앱에는 영향을 주지 않습니다. 다음에 앱을 빌드할 때 `eas build -p ios`를 실행하거나, 수동으로 `eas credentials`를 실행해 새 프로파일을 만들면 됩니다.

### 요약

| Credential | Limit Per Account | App-specific? | Can be revoked with no production side effects? | Used at |
| --- | --- | --- | --- | --- |
| 배포 인증서 | 2 | ✗ | ✓ | 빌드 시점 |
| 푸시 알림 키 | 2 | ✗ | ✗ | 런타임 |
| 프로비저닝 프로파일 | Unlimited | ✓ | ✓ | 빌드 시점 |

### 자격 증명 삭제

`eas credentials` 명령으로 자격 증명을 삭제하면, 이는 Expo 서버에서만 자격 증명을 제거합니다. **Apple 관점에서는 자격 증명이 삭제되지 않습니다**. 즉, 자격 증명을 완전히 삭제하려면(예를 들어 새 푸시 알림 키가 필요하지만 이미 두 개가 있는 경우) [Apple Developer Console](https://developer.apple.com/account/resources/certificates/list)에서 직접 삭제해야 합니다.

### 새 자격 증명으로 다시 서명하기

`eas build:resign`을 사용하면 기존 iOS용 **.ipa**에 새 ad hoc provisioning profile로 코드 서명을 할 수 있습니다. 이는 내부 배포 시 시간을 줄이는 데 도움이 됩니다. 예를 들어 기존 빌드에 새 테스트 기기를 추가하고 싶을 때, 전체 앱을 처음부터 다시 빌드하지 않고도 이 명령으로 프로비저닝 프로파일을 업데이트해 해당 기기를 포함시킬 수 있습니다.

명령을 실행하면 다시 서명할 빌드를 선택하라는 안내가 표시됩니다. 예를 들어 예제 프로젝트에서 명령을 실행하면 사용 가능한 빌드가 표시됩니다:

빌드를 선택한 뒤 Apple Developer 계정에 로그인하는 단계를 따르세요. **Show devices and ask me again**라는 안내가 표시되면 새 프로비저닝 프로파일을 선택할 수 있습니다.

새 기기를 선택하면 명령이 EAS Build를 다시 실행합니다. 이번에 트리거된 빌드는 선택한 빌드의 애플리케이션 아티팩트를 재사용하고 새 프로비저닝 프로파일로 코드 서명한다는 점에 유의하세요. 이 과정이 완료되면 새 빌드 링크를 사용해 프로비저닝 프로파일에 추가된 iOS 기기에 **.ipa**를 설치할 수 있습니다.
