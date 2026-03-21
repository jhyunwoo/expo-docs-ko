---
modificationDate: March 09, 2026
title: 서로 다른 앱 버전 관리하기
description: developer-facing 앱 버전과 user-facing 앱 버전에 대해 알아보고, EAS Build가 developer-facing 버전을 어떻게 자동으로 관리하는지 배워 봅니다.
---

# 서로 다른 앱 버전 관리하기

developer-facing 앱 버전과 user-facing 앱 버전에 대해 알아보고, EAS Build가 developer-facing 버전을 어떻게 자동으로 관리하는지 배워 봅니다.

이 장에서는 EAS Build가 Android와 iOS의 developer-facing 앱 버전을 어떻게 자동으로 관리하는지 알아보겠습니다. 다음 두 장에서 production build를 다루기 전에 이 내용을 알아 두면 도움이 됩니다.

[시청하기: 앱 버전 코드 자동화](https://www.youtube.com/watch?v=C8x4N9UmzS8) — developer-facing 앱 버전과 user-facing 앱 버전을 이해하고, EAS Build가 버전 관리를 어떻게 자동화하는지 알아보세요.

## developer-facing 앱 버전과 user-facing 앱 버전 이해하기

앱 버전은 두 값으로 구성됩니다:

-   Developer-facing 값: Android에서는 [`versionCode`](/versions/latest/config/app#versioncode), iOS에서는 [`buildNumber`](/versions/latest/config/app#buildnumber)로 나타냅니다.
-   User-facing 값: **app.config.js**의 [`version`](/versions/latest/config/app#version)으로 나타냅니다.

Google Play Store와 Apple App Store는 모두 각 고유 build를 식별하기 위해 developer-facing 값을 사용합니다. 예를 들어 앱 버전 `1.0.0 (1)`인 앱을 업로드하면, 같은 앱 버전으로 다른 build를 다시 앱 스토어에 제출할 수 없습니다. 중복된 앱 버전 번호로 build를 제출하면 제출이 실패합니다.

developer-facing 값을 수동으로 관리하는 예시는 아래 **app.config.js**의 `android.versionCode`와 `ios.buildNumber`에서 볼 수 있습니다. **EAS Build가 이를 자동화해 주므로 우리는 이 값을 직접 추가하거나 관리할 필요가 없습니다**.

```js
{
  ios: {
    buildNumber: 1
    ... 
  },
  android: {
    versionCode: 1
  }
  ... 
}
```

> **참고**: [user-facing 버전 번호](/build-reference/app-versions#user-facing-version)는 EAS가 처리하지 않습니다. 대신 production 앱을 심사에 제출하기 전에 앱 스토어 개발자 포털에서 직접 정의합니다.

## EAS Build를 사용한 자동 앱 버전 관리

기본적으로 EAS Build는 developer-facing 값 자동화를 도와줍니다. [remote version source](/build-reference/app-versions#remote-version-source)를 사용하여 새로운 production 릴리스가 만들어질 때마다 developer-facing 값을 자동으로 증가시킵니다.

프로젝트를 `eas init` 명령으로 초기화했을 때, EAS CLI는 자동으로 다음 속성을 **eas.json**에 추가했습니다:

-   `remote`로 설정된 `cli.appVersionSource`
-   `true`로 설정된 [`build.production.autoIncrement`](/eas/json#autoincrement-1)

프로젝트의 **eas.json**에서 이를 확인할 수 있습니다:

```json
{
  "cli": {
    ... 
    "appVersionSource": "remote"
  },
  "build": {
    "production": {
      "autoIncrement": true
    }
  }
  ... 
}
```

다음 두 장에서 새로운 production build를 만들면 Android의 `versionCode`와 iOS의 `buildNumber`가 자동으로 증가합니다.

이미 앱 스토어에 게시된 앱의 developer-facing 앱 버전을 EAS에 동기화하기

앱이 이미 앱 스토어에 게시되어 있다면 developer-facing 앱 버전은 이미 설정되어 있습니다. 이 앱을 EAS Build로 마이그레이션할 때는 아래 단계를 따라 해당 앱 버전을 동기화하세요:

-   터미널 창에서 `eas build:version:set` 명령을 실행합니다:

```sh
eas build:version:set
```

-   프롬프트가 표시되면 플랫폼(Android 또는 iOS)을 선택합니다.
-   **Do you want to set app version source to remote now?** 프롬프트가 표시되면 **yes**를 선택합니다. 그러면 **eas.json**에서 `cli.appVersionSource`가 `remote`로 설정됩니다.
-   **What version would you like to initialize it with?** 프롬프트가 표시되면 앱 스토어에 마지막으로 설정한 버전 번호를 입력합니다.

이 단계를 마치면 앱 버전이 EAS Build에 원격으로 동기화됩니다. **eas.json**에서 `build.production.autoIncrement`를 `true`로 설정할 수 있습니다. 이제 새로운 production build를 만들 때마다 `versionCode`와 `buildNumber`가 자동으로 증가합니다.

## 요약

7장: 서로 다른 앱 버전 관리하기

앱 버전 관리의 차이를 살펴보았고, 스토어 반려를 방지하려면 고유한 앱 버전이 왜 중요한지 이해했으며, production build를 위해 **eas.json**에서 자동 버전 업데이트도 활성화했습니다.

다음 장에서는 Android용 production build를 만드는 과정을 알아봅니다.

[다음: Android용 production build 만들기](/tutorial/eas/android-production-build)
