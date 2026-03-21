---
modificationDate: May 23, 2025
title: EAS Build를 위한 Apple Developer Program 역할 및 권한
description: EAS Build를 생성하기 위한 Apple Developer 계정 멤버십 요구 사항을 알아보세요.
---

# EAS Build를 위한 Apple Developer Program 역할 및 권한

EAS Build를 생성하기 위한 Apple Developer 계정 멤버십 요구 사항을 알아보세요.

EAS Build를 사용해 iOS 기기용 빌드를 만들 때는 인증서, 식별자, 프로비저닝 프로파일과 같은 [앱 서명 자격 증명](/app-signing/managed-credentials#generating-app-signing-credentials)을 생성할 수 있는 권한이 있는 Apple Developer 계정이 필요합니다. 이러한 자격 증명은 EAS CLI에서 Apple 계정으로 로그인해 빌드를 제출할 때 생성할 수 있고, 권한이 있는 사용자가 Expo 계정에 업로드할 수도 있으므로 Apple Developer 계정 접근 권한이 없는 사용자도 업로드된 자격 증명을 사용해 빌드를 만들 수 있습니다.

개인 Apple Developer 계정에서는 Account Holder 역할만 앱 서명 자격 증명을 생성할 수 있습니다. 조직 Apple Developer 계정에서는 Account Holder와 Admin 역할이 항상 앱 서명 자격 증명을 생성할 수 있으며, App Store Connect 사용자 권한에서 **Access to Certificates, Identifiers, and Profiles**가 활성화된 경우에는 App Manager 역할 사용자도 자격 증명을 생성할 수 있습니다.

App Store Connect의 Access to Certificates, Identifiers, and Profiles 설정.

이 가이드는 권한이 있는 사용자가 앱 서명 자격 증명을 생성해 EAS를 사용하는 팀원에게 제공할 수 있도록 따라야 할 단계를 설명합니다. 또한 팀 개발자가 미리 생성된 자격 증명을 사용해 EAS Build를 만드는 단계도 함께 설명합니다.

> 각 역할의 차이와 Developer 계정 유형별 권한, 그리고 역할마다 필요한 권한에 대한 자세한 내용은 [Apple의 Program Roles 문서](https://developer.apple.com/support/roles/)를 참고하세요.

## Apple Developer 계정의 권한 있는 사용자를 위한 단계

Apple Developer 계정의 권한 있는 사용자는 다음 자격 증명을 생성해야 합니다:

-   **Distribution signing certificate**: iOS 기기에 설치되는 개발 빌드와 릴리스 빌드에 서명하는 데 필요합니다.
-   **Ad hoc provisioning profile**: Apple App Store 외부에서 기기에 설치되는 빌드에 서명하는 데 필요합니다.
-   **Distribution provisioning profile**: Apple App Store에 제출하는 빌드에 서명하는 데 필요합니다.
-   **Push key**: 푸시 알림 서비스를 사용할 때 필요합니다.

Distribution certificate, Provisioning profiles, Push keys에 대한 자세한 내용은 [필수 iOS 앱 자격 증명](/app-signing/app-credentials#ios)을 참고하세요.

EAS CLI를 사용하면 위의 모든 자격 증명을 자동으로 생성하고 Apple Developer 계정과 동기화할 수 있습니다. 권한 있는 사용자가 [Expo 계정](/accounts/account-types)에 로그인한 뒤 EAS CLI로 `eas credentials`를 실행하면 프로비저닝 프로파일을 만들거나 업데이트할 수 있습니다.

```sh
eas login
eas credentials
```

CLI는 EAS Build에 사용할 [build profile](/build/eas-json#build-profiles)을 선택하라고 안내합니다. Apple Developer 계정의 권한 있는 사용자가 프로덕션 빌드를 만드는 경우에는 다음 단계에 따라 [distribution provisioning profile을 생성](/tutorial/eas/ios-production-build#create-a-distribution-provisioning-profile)하세요. 개발자 빌드를 만들려면 다음 단계에 따라 [ad hoc provisioning profile을 생성](/tutorial/eas/ios-development-build-for-devices#provisioning-profile)하세요.

이렇게 하면 Expo 계정과 연결된 프로비저닝 프로파일이 필요한 권한을 갖추도록 보장할 수 있습니다.

> 기존 자격 증명이 있는 프로젝트라면, 이를 EAS와 동기화하거나 수동으로 관리하는 방법은 [기존 자격 증명 사용하기](/app-signing/existing-credentials)를 참고하세요.

## 팀 개발자를 위한 단계

팀의 개발자가 터미널 창에서 `eas build -p ios`를 실행하면 EAS CLI가 Apple Developer 계정으로 로그인할지 묻습니다.

```sh
? Do you want to log in to your Apple account? > (Y/n)
No problem! 👌 If any of the next steps will require Apple account access we will ask you again about it.
```

접근 권한이 없다면 `n`을 눌러 Apple Developer 계정 로그인을 건너뛰세요. 개인 Apple Developer 계정이 있더라도 그 계정으로 로그인하지 않는 것이 좋습니다. CLI는 프로비저닝 프로파일 검증과 기타 앱 서명 자격 증명 검증을 건너뛴다는 메시지를 표시한 뒤, 기존 자격 증명을 사용해 EAS Build 생성을 계속 진행합니다.

EAS CLI는 iOS 빌드를 만들기 위해 Expo 계정과 연결된 프로비저닝 프로파일을 사용해야 합니다. 로그인을 건너뛰면 EAS Build는 조직의 Expo 계정에서 Apple Developer 계정의 권한 있는 사용자가 마지막으로 업데이트한 프로비저닝 프로파일과 기타 자격 증명을 사용합니다.

## 추가 정보

### 미리 생성한 Apple 자격 증명 업로드하기

일부 개발 팀은 EAS 외부에서 distribution certificate와 provisioning profile을 생성하는 방식을 선택할 수 있습니다. 이러한 자격 증명은 `eas credentials`를 사용하거나 EAS 대시보드의 **Select your project** > **Project settings** > **Configuration** > **Credentials**에서 Developer 이상 권한을 가진 모든 EAS 사용자가 추가할 수 있습니다.

자격 증명을 업로드할 때는 **.p12** 파일과 **.mobileprovision** 파일, 그리고 distribution certificate를 생성할 때 설정한 비밀번호가 필요합니다.

### 프로비저닝 프로파일 만료 및 업데이트

연결된 프로비저닝 프로파일은 특정 [iOS capabilities](/build-reference/ios-capabilities)(예: entitlements)가 추가되거나 제거될 때, 또는 프로파일의 연간 만료 시점에 업데이트해야 합니다. 이 단계는 Apple Developer 계정의 권한 있는 사용자가 처리합니다.

### 연동형 Apple Developer 계정

#### EAS Build

EAS CLI는 Apple Developer 계정에 로그인할 때 Apple 계정의 이메일과 비밀번호만 사용할 수 있습니다. 따라서 [연동형 Apple Developer 계정](https://support.apple.com/en-in/guide/apple-business-manager/axmb19317543/web)으로 로그인해 distribution certificate나 provisioning profile을 업데이트할 수는 없습니다. 빌드 자격 증명에 변경이 필요하지 않다면 로그인을 건너뛰어도 됩니다. 그러면 현재 업로드된 자격 증명을 계속 사용하면서 빌드를 진행할 수 있습니다.

하지만 `eas build` 명령을 실행할 때 Admin 권한이 있는 App Store Connect(ASC) API 토큰을 제공하여 Apple 자격 증명을 확인하고 업데이트할 수는 있습니다. 필수 토큰 값을 `eas build` 명령에 전달해 빌드를 생성하려면 [Apple Team용 ASC API 토큰 제공하기](/build/building-on-ci#optional-provide-an-asc-api-token-for-your-apple-team)의 단계를 따르세요.

#### EAS Submit

EAS Submit은 TestFlight에 제출할 때 ASC API 토큰을 사용합니다. 연동형 Apple Developer 계정을 사용 중이라면 일반적인 EAS Submit 설정 절차를 따르면 됩니다. 이렇게 하면 `eas build --auto-submit`을 사용해 빌드를 자동 제출할 수 있습니다.
