---
modificationDate: July 29, 2025
title: 제출 자동화하기
description: EAS Build에서 자동 제출을 활성화하는 방법을 알아보세요.
---

# 제출 자동화하기

EAS Build에서 자동 제출을 활성화하는 방법을 알아보세요.

많은 모바일 배포 프로세스는 적절한 빌드가 완료되면 앱을 각 스토어에 자동으로 제출하는 단계까지 발전합니다. 이렇게 하면 개발자가 빌드가 끝날 때까지 기다릴 필요가 없고, 약간의 수작업을 줄일 수 있으며, 팀에 앱 스토어 자격 증명을 어떻게 제공할지 조율할 필요도 사라집니다.

EAS Build는 `--auto-submit` 플래그를 통해 자동 제출 기능을 기본으로 제공합니다. 이 플래그는 빌드가 완료되면 EAS Build가 적절한 submission profile과 함께 빌드를 EAS Submit으로 넘기도록 지시합니다. 제출 설정 방법에 대한 자세한 내용은 [EAS Submit 문서](/submit/introduction)를 참고하세요.

`eas build --auto-submit`을 실행하면 제출 진행 상황을 추적할 수 있는 submission details 페이지 링크가 제공됩니다. 이 페이지는 언제든지 [프로젝트의 submissions dashboard](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/submissions)에서도 찾을 수 있으며, build details 페이지에서도 연결됩니다.

## submission profile 선택하기

기본적으로 `--auto-submit`은 선택한 build profile과 같은 이름의 submission profile을 사용하려고 시도합니다. 이 profile이 없거나 다른 profile을 사용하고 싶다면 대신 `--auto-submit-with-profile=<profile-name>`을 사용할 수 있습니다.

## build profile 환경 변수와 제출

`eas build --profile <profile-name> --auto-submit`을 실행할 때 프로젝트의 **app.config.js**는 build profile `<profile-name>`과 연결된 환경 변수를 사용해 평가됩니다. 예를 들어, 아래와 같은 구성으로 `eas build -p ios --profile production --auto-submit`을 실행했다고 가정해 보겠습니다:

```json
{
  "build": {
    "production": {
      "env": {
        "APP_ENV": "production"
      }
    },
    "development": {
      "env": {
        "APP_ENV": "development"
      }
    }
  }
}
```

```js
export default () => {
  return {
    name: process.env.APP_ENV === 'production' ? 'My App' : 'My App (DEV)',
    ios: {
      bundleIdentifier: process.env.APP_ENV === 'production' ? 'com.my.app' : 'com.my.app-dev',
    },
    // ... other config here
  };
};
```

제출을 위해 **app.config.js**를 평가할 때 `production` profile의 `APP_ENV` 변수가 사용되므로, 이름은 `My App`이 되고 bundle identifier는 `com.my.app`이 됩니다.

## 앱 스토어별 기본 제출 동작

기본적으로 `--auto-submit` 플래그는 빌드를 internal testing용으로 사용할 수 있게 만들지만, 앱을 public distribution을 위한 심사에 자동으로 제출하지는 않습니다. 아래 섹션은 Android와 iOS의 기본 제출 동작을 설명합니다.

### Android 제출

Android에서는 충분한 메타데이터가 제공되지 않으면, 기본 동작은 새 앱에 대해 internal release를 만드는 것입니다. 빌드가 어디에 어떤 방식으로 제출될지 제어하려면 **eas.json**의 submission profile에서 `releaseStatus`와 `track` 필드를 지정할 수 있습니다:

**Release status 옵션:**

-   `draft`: Google Play Console에서 수동 승격이 필요한 draft release를 만듭니다.
-   `completed`: 지정된 track에 즉시 사용자 대상으로 릴리스합니다.
-   `inProgress`: 단계적 롤아웃 릴리스입니다(`rollout` 비율과 함께 사용).
-   `halted`: 중단된 릴리스입니다.

**eas.json**의 submission profile에 track을 명시적으로 설정하면 `--auto-submit` 플래그는 선택한 track으로 빌드를 제출합니다. 이 경우 `releaseStatus`도 `completed`로 설정해야 합니다:

**Track 옵션:**

-   `internal`: internal testing track(최대 100명 테스터) (기본값)
-   `alpha`: closed testing track
-   `beta`: open testing track
-   `production`: production track(public release)

### iOS 제출

iOS의 기본 제출 동작은 빌드를 App Store 심사가 아니라 TestFlight에 제출하는 것입니다. 이는 다음을 의미합니다:

-   빌드는 TestFlight에 제출되어 internal testing에 사용할 수 있게 됩니다.
-   App Store Connect에서 "Enable automatic distribution"을 켜 두었다면, TestFlight가 자동으로 그룹을 만들고 팀의 모든 internal TestFlight 사용자에게 빌드 테스트 초대를 보냅니다.
-   **eas.json** submission profile의 [`groups`](/eas/json#groups) 필드를 사용해 추가 TestFlight 그룹을 지정할 수도 있습니다.
-   TestFlight를 사용하면 앱 버전을 internal testing과 external testing 둘 다를 위해 배포할 수 있습니다. TestFlight는 internal 테스터 최대 100명과, public link를 통한 external 테스터 최대 10,000명 공유를 지원합니다.
-   Apple App Store 심사 제출은 수동 프로세스입니다. TestFlight에 제출을 완료한 뒤에는 빌드를 App Store로 수동 승격해야 합니다.

이 동작은 `--auto-submit` 사용 시 모든 iOS 릴리스가 TestFlight를 거치도록 보장하므로, 대중에게 공개하기 전에 릴리스를 테스트할 수 있습니다.

### App Store listing 수정하기(iOS 전용)

EAS Submit 단독으로는 스토어 메타데이터(앱 설명, Apple 자문 정보, 언어 등)를 업데이트하지 않습니다. 하지만 EAS Submit으로 새 버전 번호의 빌드를 TestFlight에 업로드한 뒤에는 EAS Metadata로 이 정보를 업데이트할 수 있습니다.

[EAS Metadata](/eas/metadata/getting-started): iOS 앱의 메타데이터를 자동으로 업데이트하는 방법을 알아보세요.
