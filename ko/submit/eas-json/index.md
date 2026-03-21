---
modificationDate: February 20, 2026
title: Configure EAS Submit with eas.json
description: eas.json으로 프로젝트를 EAS Submit에 맞게 구성하는 방법을 알아보세요.
---

# Configure EAS Submit with eas.json

eas.json으로 프로젝트를 EAS Submit에 맞게 구성하는 방법을 알아보세요.

**eas.json**은 EAS CLI와 서비스의 설정 파일입니다. 프로젝트에서 처음 [`eas build:configure` command](/build/setup#configure-the-project)를 실행할 때 생성되며, 프로젝트 루트에서 **package.json** 옆에 위치합니다. EAS Submit을 사용하는 데 **eas.json**이 필수는 아니지만, 여러 설정을 전환해야 할 때 있으면 훨씬 편리합니다.

## Production profile

Profile 이름을 지정하지 않고 `eas submit`을 실행하면, **eas.json**에 `production` profile이 이미 정의되어 있다면 제출 설정에 그 profile을 사용합니다. `production` profile에 값이 없다면, EAS CLI가 값을 대화형으로 입력하라고 안내합니다.

아래에 나온 `production` profile은 [EAS Workflows](/eas/workflows/introduction) 같은 CI/CD process에서 Android와 iOS 제출을 실행하려면 필요합니다:

```json
{
  "cli": {
    "version": ">= 0.34.0"
  },
  "submit": {
    "production": {
      "android": {
        "track": "internal"
      },
      "ios": {
        "ascAppId": "your-app-store-connect-app-id"
      }
    }
  }
}
```

[Android specific options](/eas/json#android-specific-options-1)와 [iOS specific options](/eas/json#ios-specific-options-1)에서 설정할 수 있는 값에 대해 더 알아보세요. 또한 [Apple App Store](/submit/ios)와 [Google Play Store](/submit/android)에 제출하는 방법도 확인할 수 있습니다.

## Multiple profiles

`submit` 아래의 JSON object에는 여러 submit profile을 포함할 수 있습니다. `submit` 아래의 각 profile은 아래 예시처럼 임의의 이름을 가질 수 있습니다:

```json
{
  "cli": {
    "version": "SEMVER_RANGE",
    "requireCommit": boolean
  },
  "build": {
    // EAS Build configuration
    ... 
  },
  "submit": {
    "SUBMIT_PROFILE_NAME_1": {
      "android": {
        ...ANDROID_OPTIONS
      },
      "ios": {
        ...IOS_OPTIONS
      }
    },
    "SUBMIT_PROFILE_NAME_2": {
      "extends": "SUBMIT_PROFILE_NAME_1",
      "android": {
        ...ANDROID_OPTIONS
      }
    },
    ... 
  }
}
```

제출할 build를 선택하면, 선택된 build에 사용된 profile을 기반으로 사용할 profile이 결정됩니다. 해당 profile이 없으면 기본 `production` profile이 선택됩니다.

또한 EAS CLI에 parameter로 다른 `submit` profile을 지정해 그 profile을 선택하도록 할 수도 있습니다. 예를 들면 다음과 같습니다:

```sh
eas submit --platform ios --profile
```

## Share configuration between `submit` profiles

`submit` profile은 `extends` key를 사용해 다른 profile을 확장할 수 있습니다.

예를 들어 `preview` profile에 `"extends": "production"`을 둘 수 있습니다. 그러면 `preview` profile은 `production` profile의 설정을 상속합니다.

순환 의존성만 만들지 않는다면 profile 확장은 최대 깊이 5까지 계속 연결할 수 있습니다.

## Next step

[EAS Submit schema reference](/eas/json#eas-submit) — 프로젝트 안에서 EAS Submit을 구성하고 기본 동작을 override하기 위해 사용할 수 있는 속성을 알아보세요.
