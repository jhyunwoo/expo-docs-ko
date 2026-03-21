---
modificationDate: March 09, 2026
title: EAS Workflows로 production에 배포하기
description: EAS Workflows로 production에 배포하는 방법을 알아보세요.
---

# EAS Workflows로 production에 배포하기

EAS Workflows로 production에 배포하는 방법을 알아보세요.

변경 사항을 사용자에게 전달할 준비가 되면, 앱 스토어에 build를 제출하거나 over-the-air update를 보낼 수 있습니다. 다음 workflow는 새 build가 필요한지 감지하고, 필요하다면 앱 스토어로 전송합니다. 새 build가 필요하지 않다면 over-the-air update를 보냅니다.

[Expo Golden Workflow: 자동화된 workflow로 앱을 production에 배포하기](https://www.youtube.com/watch?v=o-peODF6E2o) — EAS Workflows를 사용해 production 릴리스를 자동화하고, 앱 스토어에 build를 제출하거나 새 build가 필요 없을 때 update를 보내는 방법을 알아보세요.

## 시작하기

사전 요구 사항

요구 사항 3개

1.

EAS Build 설정하기

EAS Build를 설정하려면 다음 가이드를 따르세요.

[EAS Build prerequisites](/build/setup) — EAS Build를 위한 프로젝트 준비하기.

2.

EAS Submit 설정하기

EAS Submit을 설정하려면 Google Play Store 및 Apple App Store 제출 가이드를 따르세요.

[Google Play Store CI/CD submission guide](/submit/android#submitting-your-app-using-cicd-services) — Google Play Store 제출을 위한 프로젝트 준비하기.

[Apple App Store CI/CD submission guide](/submit/ios#submitting-your-app-using-cicd-services) — Apple App Store 제출을 위한 프로젝트 준비하기.

3.

EAS Update 설정하기

마지막으로 EAS Update도 설정해야 하며, 다음 명령으로 구성할 수 있습니다.

```sh
eas update:configure
```

다음 workflow는 `main` branch에 push할 때마다 실행되며 다음 작업을 수행합니다.

-   [Expo Fingerprint](/versions/latest/sdk/fingerprint)를 사용해 프로젝트의 native 특성에 대한 hash를 계산합니다.
-   해당 fingerprint에 대해 이미 build가 존재하는지 확인합니다.
-   build가 존재하지 않으면 프로젝트를 build하고 앱 스토어에 제출합니다.
-   build가 존재하면 over-the-air update를 전송합니다.

```yaml
name: Deploy to production

on:
  push:
    branches: ['main']

jobs:
  fingerprint:
    name: Fingerprint
    type: fingerprint
    environment: production
  get_android_build:
    name: Check for existing android build
    needs: [fingerprint]
    type: get-build
    params:
      fingerprint_hash: ${{ needs.fingerprint.outputs.android_fingerprint_hash }}
      profile: production
  get_ios_build:
    name: Check for existing ios build
    needs: [fingerprint]
    type: get-build
    params:
      fingerprint_hash: ${{ needs.fingerprint.outputs.ios_fingerprint_hash }}
      profile: production
  build_android:
    name: Build Android
    needs: [get_android_build]
    if: ${{ !needs.get_android_build.outputs.build_id }}
    type: build
    params:
      platform: android
      profile: production
  build_ios:
    name: Build iOS
    needs: [get_ios_build]
    if: ${{ !needs.get_ios_build.outputs.build_id }}
    type: build
    params:
      platform: ios
      profile: production
  submit_android_build:
    name: Submit Android Build
    needs: [build_android]
    type: submit
    params:
      build_id: ${{ needs.build_android.outputs.build_id }}
  submit_ios_build:
    name: Submit iOS Build
    needs: [build_ios]
    type: submit
    params:
      build_id: ${{ needs.build_ios.outputs.build_id }}
  publish_android_update:
    name: Publish Android update
    needs: [get_android_build]
    if: ${{ needs.get_android_build.outputs.build_id }}
    type: update
    params:
      branch: production
      platform: android
  publish_ios_update:
    name: Publish iOS update
    needs: [get_ios_build]
    if: ${{ needs.get_ios_build.outputs.build_id }}
    type: update
    params:
      branch: production
      platform: ios
```
