---
modificationDate: March 05, 2026
title: Submit to the Apple App Store
description: 컴퓨터와 CI/CD 서비스에서 앱을 Apple App Store에 제출하는 방법을 알아보세요.
---

# Submit to the Apple App Store

컴퓨터와 CI/CD 서비스에서 앱을 Apple App Store에 제출하는 방법을 알아보세요.

이 가이드는 컴퓨터 또는 CI/CD 서비스에서 앱을 Apple App Store에 제출하는 방법을 설명합니다.

## Submitting your app from your computer

Prerequisites

4 requirements

1.

Sign up for an Apple Developer account

앱을 Apple App Store에 제출하려면 Apple Developer 계정이 필요합니다. [Apple Developer Portal](https://developer.apple.com/account/)에서 Apple Developer 계정을 등록할 수 있습니다.

2.

Include a bundle identifier in app.json

**app.json**에 앱의 bundle identifier를 포함하세요:

```json
{
  "ios": {
    "bundleIdentifier": "com.yourcompany.yourapp"
  }
}
```

3.

Install EAS CLI and authenticate with your Expo account

EAS CLI를 설치하고 Expo 계정으로 로그인하세요:

```sh
npm install -g eas-cli && eas login
```

4.

Build a production app

Store 제출을 위한 production build가 준비되어 있어야 합니다. [EAS Build](/build/introduction)를 사용해 만들 수 있습니다:

```sh
eas build --platform ios --profile production
```

또는 `eas build --platform ios --profile production --local`을 사용해 직접 컴퓨터에서 빌드하거나 Xcode를 사용할 수도 있습니다.

모든 사전 준비를 마쳤다면 제출 과정을 시작할 수 있습니다.

다음 명령을 실행해 build를 Apple App Store에 제출하세요:

```sh
eas submit --platform ios
```

이 명령은 앱 제출 과정을 단계별로 안내합니다. **eas.json**에 submission profile을 추가해 제출 과정을 구성할 수 있습니다:

```json
{
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "your-app-store-connect-app-id"
      }
    }
  }
}
```

How to find `ascAppId`

1.  [App Store Connect](https://appstoreconnect.apple.com/)에 로그인하고 team을 선택합니다.
2.  [Apps](https://appstoreconnect.apple.com/apps)로 이동합니다.
3.  앱을 클릭합니다.
4.  **App Store** tab이 활성화되어 있는지 확인합니다.
5.  왼쪽 패널의 **General** 섹션 아래에서 **App Information**을 선택합니다.
6.  앱의 `ascAppId`는 **General Information** 섹션의 **Apple ID** 아래에서 찾을 수 있습니다.

[eas.json reference](/eas/json#ios-specific-options-1)에서 제공할 수 있는 모든 option에 대해 알아보세요.

제출 과정을 더 빠르게 진행하려면 build가 끝난 뒤 자동으로 제출하는 `--auto-submit` flag를 사용할 수 있습니다:

```sh
eas build --platform ios --auto-submit
```

`--auto-submit` flag에 대한 자세한 내용은 [automate submissions](/build/automate-submissions) 가이드를 참고하세요.

## Submitting your app using CI/CD services

Prerequisites

5 requirements

1.

Sign up for an Apple Developer account

앱을 Apple App Store에 제출하려면 Apple Developer 계정이 필요합니다. [Apple Developer Portal](https://developer.apple.com/account/)에서 Apple Developer 계정을 등록할 수 있습니다.

2.

Include a bundle identifier in app.json

**app.json**에 앱의 bundle identifier를 포함하세요:

```json
{
  "ios": {
    "bundleIdentifier": "com.yourcompany.yourapp"
  }
}
```

3.

Configure your App Store Connect API Key

다음 명령을 실행해 App Store Connect API Key를 구성하세요:

```sh
eas credentials --platform ios
```

이 명령은 어떤 유형의 credential을 구성할지 선택하도록 안내합니다.

1.  `production` build profile을 선택합니다
2.  Apple Developer 계정으로 로그인하고 안내에 따릅니다
3.  **App Store Connect: Manage your API Key**를 선택합니다
4.  **Set up your project to use an API Key for EAS Submit**을 선택합니다

Do you want to use your own credentials?

**App Store Connect API Key:** 직접 [API Key](https://expo.fyi/creating-asc-api-key)를 만든 뒤 **eas.json**의 `ascApiKeyPath`, `ascApiKeyIssuerId`, `ascApiKeyId` field로 설정할 수 있습니다.

**App Specific Password:** [password](https://expo.fyi/apple-app-specific-password)와 Apple ID Username을 각각 `EXPO_APPLE_APP_SPECIFIC_PASSWORD` environment variable과 **eas.json**의 `appleId` field로 전달하세요.

4.

Provide a submission profile in eas.json

그다음, **eas.json**에 다음 field를 포함한 submission profile을 제공해야 합니다:

```json
{
    "submit": {
      "production": {
        "ios": {
          "ascAppId": "your-app-store-connect-app-id"
        }
      }
    }
  }
```

How to find `ascAppId`

1.  [App Store Connect](https://appstoreconnect.apple.com/)에 로그인하고 team을 선택합니다.
2.  [Apps](https://appstoreconnect.apple.com/apps)로 이동합니다.
3.  앱을 클릭합니다.
4.  **App Store** tab이 활성화되어 있는지 확인합니다.
5.  왼쪽 패널의 **General** 섹션 아래에서 **App Information**을 선택합니다.
6.  앱의 `ascAppId`는 **General Information** 섹션의 **Apple ID** 아래에서 찾을 수 있습니다.

[eas.json reference](/eas/json#ios-specific-options-1)에서 제공할 수 있는 모든 option에 대해 알아보세요.

5.

Build a production app

Store 제출을 위한 production build가 준비되어 있어야 합니다. [EAS Build](/build/introduction)를 사용해 만들 수 있습니다:

```sh
eas build --platform ios --profile production
```

또는 `eas build --platform ios --profile production --local`을 사용해 직접 컴퓨터에서 빌드하거나 Xcode를 사용할 수도 있습니다.

모든 사전 준비를 마쳤다면, 이제 Apple App Store에 앱을 제출하기 위한 CI/CD pipeline을 설정할 수 있습니다.

### Use EAS Workflows CI/CD

[EAS Workflows](/eas/workflows/get-started)를 사용해 앱을 자동으로 빌드하고 제출할 수 있습니다.

1.  프로젝트 루트에 **.eas/workflows/submit-ios.yml**이라는 workflow file을 만듭니다.
    
2.  **submit-ios.yml** 안에서 다음 workflow를 사용해 iOS 앱을 제출하는 job을 시작할 수 있습니다:
    
    ```yaml
    on:
      push:
        branches: ['main']
    
    jobs:
      build_ios:
        name: Build iOS app
        type: build
        params:
          platform: ios
          profile: production
    
      submit_ios:
        name: Submit to TestFlight
        needs: [build_ios]
        type: testflight
        params:
          build_id: ${{ needs.build_ios.outputs.build_id }}
    ```
    
    위 workflow는 iOS 앱을 빌드한 다음 Apple App Store의 TestFlight에 제출합니다. `testflight` job을 사용해 internal 및 external testing group과 공유할 수 있습니다. 자세한 내용은 [pre-packaged `testflight` job](/eas/workflows/pre-packaged-jobs#testflight)을 참고하세요.
    

### Use other CI/CD services

다음 명령을 실행해 GitHub Actions, GitLab CI 등 다른 CI/CD 서비스에서도 EAS Submit으로 앱을 제출할 수 있습니다:

```sh
eas submit --platform ios --profile production
```

이 명령은 Expo 계정 인증을 위해 [personal access token](/accounts/programmatic-access#personal-access-tokens)이 필요합니다. Token이 있다면 CI/CD 서비스에 `EXPO_TOKEN` environment variable을 제공하면 `eas submit` 명령을 실행할 수 있습니다.

## Manual submissions

EAS Submit을 거치지 않고 build를 제출해야 할 때도 있습니다. 예를 들어 서비스가 유지보수로 일시적으로 사용할 수 없는 경우, macOS device에서 Apple App Store로 수동 업로드할 수 있습니다.

How to upload to the Apple App Store manually from a macOS device

#### Creating an entry on App Store Connect

아직 만들지 않았다면 먼저 App Store Connect에서 앱 profile을 생성하세요:

1.  [App Store Connect](https://appstoreconnect.apple.com)에 가서 로그인합니다. 페이지 상단에 있는 법적 고지나 약관을 모두 수락했는지 확인하세요.
2.  Apps header 옆의 파란색 plus 버튼을 클릭한 다음 **New App**을 클릭합니다.
3.  앱 이름, 언어, bundle identifier, SKU(최종 사용자에게 보이지 않는 값으로 어떤 고유 문자열이든 가능합니다. 보통 앱의 bundle identifier인 `"com.company.my-app"` 같은 값을 사용합니다)를 추가합니다.
4.  **Create**를 클릭합니다. 성공했다면 앱 record를 생성한 것입니다.

#### Uploading with Transporter

마지막으로 IPA를 Apple App Store에 업로드해야 합니다.

1.  [App Store에서 **Transporter**를 다운로드](https://apps.apple.com/app/transporter/id1450874784)합니다.
2.  Apple ID로 로그인합니다.
3.  IPA file을 Transporter 창으로 직접 드래그하거나 **+** 또는 **Add App** 버튼으로 열린 파일 대화상자에서 선택해 build를 추가합니다.
4.  **Deliver** 버튼을 클릭해 제출합니다.

이 과정은 몇 분 정도 걸릴 수 있고, 이후 Apple 서버에서 10-15분 정도 추가 처리 시간이 필요합니다. 그 뒤에는 App Store Connect에서 binary 상태를 확인할 수 있습니다:

1.  [App Store Connect](https://appstoreconnect.apple.com)에 방문해 **My Apps**를 선택한 뒤, 이전에 만든 앱 항목을 클릭합니다.
2.  아래로 스크롤해 **Build** 섹션으로 이동하고, 새로 업로드한 binary를 선택합니다.
