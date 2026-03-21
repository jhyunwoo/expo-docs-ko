---
modificationDate: December 12, 2025
title: '배포: 개요'
description: app store 제출 또는 internal distribution에 대한 개요입니다.
---

# 배포: 개요

app store 제출 또는 internal distribution에 대한 개요입니다.

앱을 app store에 제출하거나 [Internal Distribution](/build/internal-distribution)을 사용해 사용자 손에 전달하세요.

```sh
npm i -g eas-cli
eas build --auto-submit
eas submit
```

[EAS CLI](/eas)로 `eas build --auto-submit`을 실행하면 앱을 빌드하고 Google Play Store와 Apple App Store에 배포할 binary를 자동으로 업로드할 수 있습니다.

이 과정은 어떤 React Native 앱이든 Android와 iOS의 **모든 네이티브 코드 서명**을 자동으로 관리합니다. 결제, 알림, universal link, iCloud 같은 고급 기능도 [config plugin](/config-plugins/introduction)이나 네이티브 entitlement를 기준으로 자동 활성화할 수 있으므로, 라이브러리를 제대로 설정하려고 느린 portal과 씨름할 필요가 없어집니다.

### 시작하기

[Google Play Store에 제출하기](/submit/android) — Android 앱을 Google Play Store에 제출하는 방법을 알아보세요.

[Apple App Store에 제출하기](/submit/ios) — 어떤 운영체제에서든 iOS 또는 iPadOS 앱을 Apple App Store에 제출하는 방법을 알아보세요.

[Internal Distribution](/build/internal-distribution) — AdHoc build를 사용해 모바일 앱을 테스터와 내부 공유하세요.

[웹사이트 게시하기](/guides/publishing-websites) — 웹사이트를 export하고 원하는 웹 호스트에 업로드하세요.

[OTA updates](/eas-update/introduction) — 사용자에게 over-the-air 업데이트를 즉시 전송하세요.
