---
modificationDate: February 06, 2025
title: 빌드 구성 프로세스
description: EAS CLI가 프로젝트를 EAS Build용으로 어떻게 구성하는지 알아보세요.
---

# 빌드 구성 프로세스

EAS CLI가 프로젝트를 EAS Build용으로 어떻게 구성하는지 알아보세요.

이 가이드에서는 EAS CLI가 `eas build:configure`(또는 프로젝트가 아직 구성되지 않은 경우 동일한 프로세스를 실행하는 `eas build`)로 프로젝트를 구성할 때 어떤 일이 일어나는지 설명합니다.

EAS CLI는 프로젝트를 구성할 때 다음 단계를 수행합니다:

## 어떤 플랫폼을 구성할지 묻기

명령을 처음 실행하면 EAS 프로젝트를 초기화하고 어떤 플랫폼을 구성할지 선택하라고 묻습니다. EAS Build를 단일 플랫폼에만 사용하고 싶어도 괜찮습니다. 나중에 생각이 바뀌면 돌아와서 다른 플랫폼을 추가로 구성할 수 있습니다.

## eas.json 생성하기

명령은 루트 디렉터리에 기본 구성으로 **eas.json** 파일을 생성합니다. 대략 다음과 같은 모습입니다:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

bare 프로젝트라면 모양이 조금 다를 수 있습니다.

이것이 EAS Build 구성입니다. 각 플랫폼에 대해 `"development"`, `"preview"`, `"production"`이라는 세 개의 build profile을 정의합니다(`"production"`, `"debug"`, `"testing"` 등 여러 build profile을 가질 수 있습니다). **eas.json**에 대해 더 자세히 알고 싶다면 [**eas.json**으로 구성하기](/build/eas-json) 페이지를 참고하세요.

## 프로젝트 구성하기

이 단계는 프로젝트 유형에 따라 달라집니다.

3.1

### 초기화 완료

이로써 프로젝트가 EAS Build와 호환되도록 초기화하는 작업이 완료됩니다.

3.2

### Expo 프로젝트

아직 **app.json**에서 `android.package`와/또는 `ios.bundleIdentifier`를 설정하지 않았다면, 첫 빌드를 생성할 때 EAS CLI가 이를 지정하라고 안내합니다.

-   `android.package`는 Google Play Store에서 앱을 식별하는 Android application ID로 사용됩니다.
-   `ios.bundleIdentifier`는 Apple App Store에서 앱을 식별하는 값으로 사용됩니다.

위 예시에서 `eas build --platform android` 명령은 Android application ID를 설정하라고 묻습니다. `--platform ios`로 실행하면 iOS bundle identifier를 설정하라고 묻습니다.

3.3

### Bare React Native 프로젝트

bare 프로젝트에는 추가 단계가 없습니다.

## 다음 단계

이것으로 프로젝트를 EAS Build와 호환되도록 구성하는 작업은 모두 끝났습니다. 단, **eas.json**에서 `cli.requireCommit`를 `true`로 설정했다면 한 단계가 더 있습니다. 우리가 대신 만든 모든 변경 사항을 커밋할지 묻는 프롬프트가 표시됩니다. 커밋 전에 먼저 검토할 수도 있고, git commit message를 직접 지정하거나 기본 메시지를 사용할 수도 있습니다.
