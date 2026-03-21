---
modificationDate: March 05, 2026
title: Submit to the Google Play Store
description: 컴퓨터와 CI/CD 서비스에서 앱을 Google Play Store에 제출하는 방법을 알아보세요.
---

# Submit to the Google Play Store

컴퓨터와 CI/CD 서비스에서 앱을 Google Play Store에 제출하는 방법을 알아보세요.

이 가이드는 컴퓨터 또는 CI/CD 서비스에서 앱을 Google Play Store에 제출하는 방법을 설명합니다.

## Submitting your app from your computer

Prerequisites

7 requirements

1.

Sign up for a Google Play Developer account

앱을 Google Play Store에 제출하려면 Google Play Developer 계정이 필요합니다. [Google Play Console sign-up page](https://play.google.com/apps/publish/signup/)에서 Google Play Developer 계정을 등록할 수 있습니다.

2.

Create an app on Google Play Console

[Google Play Console](https://play.google.com/apps/publish/)에서 **Create app**을 클릭해 앱을 생성하세요.

3.

Create a Google Service Account

EAS에서 Android 앱을 Google Play Store에 제출하려면 Google Service Account Key를 업로드하고 구성해야 합니다. [uploading a Google Service Account Key for Play Store submissions with EAS](https://github.com/expo/fyi/blob/main/creating-google-service-account.md) 가이드를 따라 생성할 수 있습니다.

4.

Install EAS CLI and authenticate with your Expo account

EAS CLI를 설치하고 Expo 계정으로 로그인하세요:

```sh
npm install -g eas-cli && eas login
```

5.

Include a package name in app.json

**app.json**에 앱의 package name을 포함하세요:

```json
{
  "android": {
    "package": "com.yourcompany.yourapp"
  }
}
```

6.

Build a production app

Store 제출을 위한 production build가 준비되어 있어야 합니다. [EAS Build](/build/introduction)를 사용해 만들 수 있습니다:

```sh
eas build --platform android --profile production
```

또는 `eas build --platform android --profile production --local`을 사용해 직접 컴퓨터에서 빌드하거나 Android Studio를 사용할 수도 있습니다.

7.

Upload your app manually at least once

앱을 최소 한 번은 수동으로 업로드해야 합니다. 이는 Google Play Store API의 제한 사항입니다.

[first submission of an Android app](https://expo.fyi/first-android-submission) 가이드에서 방법을 확인하세요.

모든 사전 준비를 마쳤다면 제출 과정을 시작할 수 있습니다.

다음 명령을 실행해 build를 Google Play Store에 제출하세요:

```sh
eas submit --platform android
```

이 명령은 앱 제출 과정을 단계별로 안내합니다. **eas.json**에 submission profile을 추가해 제출 과정을 구성할 수 있습니다. 제공 가능한 모든 option은 [eas.json reference](/eas/json#android-specific-options-1)에서 확인하세요.

제출 과정을 더 빠르게 진행하려면 build가 끝난 뒤 자동으로 제출하는 `--auto-submit` flag를 사용할 수 있습니다:

```sh
eas build --platform android --auto-submit
```

`--auto-submit` flag에 대한 자세한 내용은 [automate submissions](/build/automate-submissions) 가이드를 참고하세요.

## Submitting your app using CI/CD services

Prerequisites

8 requirements

1.

Sign up for a Google Play Developer account

앱을 Google Play Store에 제출하려면 Google Play Developer 계정이 필요합니다. [Google Play Console sign-up page](https://play.google.com/apps/publish/signup/)에서 Google Play Developer 계정을 등록할 수 있습니다.

2.

Create an app on Google Play Console

[Google Play Console](https://play.google.com/apps/publish/)에서 **Create app**을 클릭해 앱을 생성하세요.

3.

Create a Google Service Account

EAS에서 Android 앱을 Google Play Store에 제출하려면 Google Service Account Key를 업로드하고 구성해야 합니다. [uploading a Google Service Account Key for Play Store submissions with EAS](https://github.com/expo/fyi/blob/main/creating-google-service-account.md) 가이드를 따라 생성할 수 있습니다.

4.

Install EAS CLI and authenticate with your Expo account

EAS CLI를 설치하고 Expo 계정으로 로그인하세요:

```sh
npm install -g eas-cli && eas login
```

5.

Include a package name in app.json

**app.json**에 앱의 package name을 포함하세요:

```json
{
  "android": {
    "package": "com.yourcompany.yourapp"
  }
}
```

6.

Upload your Google Service Account key to EAS dashboard

그다음 프로젝트 credential 아래의 EAS dashboard에 Google Service Account key를 업로드해야 합니다.

-   프로젝트의 EAS dashboard로 이동해 **Credentials**를 클릭한 다음 **Android** 아래에서 앱의 **Application identifier**를 클릭합니다.
-   **Service Credentials** 아래에서 **Add a Google Service Account Key**를 클릭합니다.
-   **Change Google Service Account Key** 아래에서 **Upload new key**가 선택되어 있는지 확인하고 다운로드한 JSON key를 업로드합니다. 그러면 key가 프로젝트 credential에 추가됩니다.

7.

Build a production app

Store 제출을 위한 production build가 준비되어 있어야 합니다. [EAS Build](/build/introduction)를 사용해 만들 수 있습니다:

```sh
eas build --platform android --profile production
```

또는 `eas build --platform android --profile production --local`을 사용해 직접 컴퓨터에서 빌드하거나 Android Studio를 사용할 수도 있습니다.

8.

Upload your app manually at least once

앱을 최소 한 번은 수동으로 업로드해야 합니다. 이는 Google Play Store API의 제한 사항입니다.

[first submission of an Android app](https://expo.fyi/first-android-submission) 가이드에서 방법을 확인하세요.

모든 사전 준비를 마쳤다면, 이제 Google Play Store에 앱을 제출하기 위한 CI/CD pipeline을 설정할 수 있습니다.

### Use EAS Workflows CI/CD

[EAS Workflows](/eas/workflows/get-started)를 사용해 앱을 자동으로 빌드하고 제출할 수 있습니다.

1.  프로젝트 루트에 **.eas/workflows/submit-android.yml**이라는 workflow file을 만듭니다.
    
2.  **submit-android.yml** 안에서 다음 workflow를 사용해 Android 앱을 제출하는 job을 시작할 수 있습니다.
    
    ```yaml
    on:
      push:
        branches: ['main']
    
    jobs:
      build_android:
        name: Build Android app
        type: build
        params:
          platform: android
          profile: production
    
      submit_android:
        name: Submit to Google Play Store
        needs: [build_android]
        type: submit
        params:
          profile: production
          build_id: ${{ needs.build_android.outputs.build_id }}
    ```
    
    위 workflow는 Android 앱을 빌드한 다음 Google Play Store에 제출합니다.
    

### Use other CI/CD services

다음 명령을 실행해 GitHub Actions, GitLab CI 등 다른 CI/CD 서비스에서도 EAS Submit으로 앱을 제출할 수 있습니다:

```sh
eas submit --platform android --profile production
```

이 명령은 Expo 계정 인증을 위해 [personal access token](/accounts/programmatic-access#personal-access-tokens)이 필요합니다. Token이 있다면 CI/CD 서비스에 `EXPO_TOKEN` environment variable을 제공하면 `eas submit` 명령을 실행할 수 있습니다.
