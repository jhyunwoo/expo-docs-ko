---
modificationDate: March 02, 2026
title: App store에 제출하기
description: EAS Submit을 사용해 command line에서 Google Play Store와 Apple App Store에 앱을 제출하는 방법을 알아보세요.
---

# App store에 제출하기

EAS Submit을 사용해 command line에서 Google Play Store와 Apple App Store에 앱을 제출하는 방법을 알아보세요.

**EAS Submit**은 EAS CLI를 사용해 app binary를 app store에 업로드하고 제출할 수 있게 해 주는 hosted service입니다. 이 가이드는 EAS Submit을 사용해 앱을 Google Play Store와 Apple App Store에 제출하는 방법을 설명합니다.

[How to quickly publish to the App Store & Play Store with EAS Submit](https://www.youtube.com/watch?v=-KZjr576tuE) - EAS Submit을 사용하면 간단한 명령 하나로 앱을 App Store와 Play Store에 쉽게 게시할 수 있습니다.

## Apple App Store

Prerequisites

4 requirements

1.

Apple Developer account 등록하기

앱을 Apple App Store에 제출하려면 Apple Developer account가 필요합니다. [Apple Developer Portal](https://developer.apple.com/account/)에서 Apple Developer account를 등록할 수 있습니다.

2.

app.json에 bundle identifier 포함하기

**app.json**에 앱의 bundle identifier를 포함하세요:

```json
{
  "ios": {
    "bundleIdentifier": "com.yourcompany.yourapp"
  }
}
```

3.

EAS CLI를 설치하고 Expo account로 인증하기

EAS CLI를 설치하고 Expo account로 로그인하세요:

```sh
npm install -g eas-cli && eas login
```

4.

Production app build하기

store 제출용 production build가 준비되어 있어야 합니다. [EAS Build](/build/introduction)를 사용해 만들 수 있습니다:

```sh
eas build --platform ios --profile production
```

또는 `eas build --platform ios --profile production --local`로 본인 컴퓨터에서 앱을 build하거나 Xcode를 사용할 수도 있습니다.

모든 prerequisites를 완료했다면 제출 프로세스를 시작할 수 있습니다.

다음 명령을 실행해 Apple App Store에 build를 제출하세요:

```sh
eas submit --platform ios
```

이 명령은 앱 제출 과정을 단계별로 안내해 줍니다.

## Google Play Store

Prerequisites

7 requirements

1.

Google Play Developer account 등록하기

앱을 Google Play Store에 제출하려면 Google Play Developer account가 필요합니다. [Google Play Console sign-up page](https://play.google.com/apps/publish/signup/)에서 Google Play Developer account를 등록할 수 있습니다.

2.

Google Service Account 만들기

Android 앱을 Google Play Store에 제출하려면 EAS에 Google Service Account Key를 업로드하고 구성해야 합니다. [uploading a Google Service Account Key for Play Store submissions with EAS](https://github.com/expo/fyi/blob/main/creating-google-service-account.md) 가이드를 따라 생성할 수 있습니다.

3.

Google Play Console에 앱 만들기

[Google Play Console](https://play.google.com/apps/publish/)에서 **Create app**을 클릭해 앱을 만드세요.

4.

EAS CLI를 설치하고 Expo account로 인증하기

EAS CLI를 설치하고 Expo account로 로그인하세요:

```sh
npm install -g eas-cli && eas login
```

5.

app.json에 package name 포함하기

**app.json**에 앱의 package name을 포함하세요:

```json
{
  "android": {
    "package": "com.yourcompany.yourapp"
  }
}
```

6.

Production app build하기

store 제출용 production build가 준비되어 있어야 합니다. [EAS Build](/build/introduction)를 사용해 만들 수 있습니다:

```sh
eas build --platform android --profile production
```

또는 `eas build --platform android --profile production --local`로 본인 컴퓨터에서 앱을 build하거나 Android Studio를 사용할 수도 있습니다.

7.

최소 한 번은 앱을 수동으로 업로드하기

앱을 최소 한 번은 수동으로 업로드해야 합니다. 이것은 Google Play Store API의 제한 사항입니다.

[first submission of an Android app](https://expo.fyi/first-android-submission) 가이드에서 방법을 알아보세요.

모든 prerequisites를 완료했다면 제출 프로세스를 시작할 수 있습니다.

다음 명령을 실행해 Google Play Store에 build를 제출하세요:

```sh
eas submit --platform android
```

이 명령은 앱 제출 과정을 단계별로 안내해 줍니다.

## Build하고 자동으로 제출하기

[EAS Workflows](/eas/workflows/introduction)를 사용하면 build를 자동으로 만들고 app store에 제출할 수 있습니다. 먼저 [configure your project](/eas/workflows/get-started)를 진행하고, 프로젝트 루트에 **.eas/workflows/build-and-submit.yml**이라는 파일을 추가한 다음, 아래 workflow 구성을 넣으세요:

```yaml
name: Build and submit

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
  build_ios:
    name: Build iOS app
    type: build
    params:
      platform: ios
      profile: production
  submit_android:
    name: Submit Android
    type: submit
    needs: [build_android]
    params:
      build_id: ${{ needs.build_android.outputs.build_id }}
  submit_ios:
    name: Submit iOS
    type: submit
    needs: [build_ios]
    params:
      build_id: ${{ needs.build_ios.outputs.build_id }}
```

위 workflow는 프로젝트의 `main` branch에 commit이 있을 때마다 Android와 iOS build를 만들고, 각각 Google Play와 Apple App Store에 제출합니다. 다음 EAS CLI 명령으로 이 workflow를 수동 실행할 수도 있습니다:

```sh
eas workflow:run build-and-submit.yml
```

[workflows examples guide](/eas/workflows/examples/introduction)에서 일반적인 패턴에 대해 더 알아보세요.

## App store에 수동 제출하기

Google Play Store와 Apple App Store에 앱을 수동으로 제출할 수도 있습니다.

[Manual Apple App Store submission](/guides/local-app-production#app-submission-using-app-store-connect) - Apple App Store에 앱을 수동으로 제출하는 방법을 알아보세요.

[Manual Google Play Store submission](https://expo.fyi/first-android-submission) - Google Play Store에 앱을 수동으로 제출하는 단계를 따라가세요.

## Next step

[Configure EAS Submit with eas.json](/submit/eas-json) - EAS Submit과 함께 `eas.json` 파일을 사용해 프로젝트를 미리 구성하는 방법과 Android 또는 iOS 전용 옵션에 대해 더 알아보세요.
