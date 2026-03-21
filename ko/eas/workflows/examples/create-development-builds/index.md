---
modificationDate: March 09, 2026
title: EAS Workflows로 development build 만들기
description: EAS Workflows로 development build를 만드는 방법을 알아보세요.
---

# EAS Workflows로 development build 만들기

EAS Workflows로 development build를 만드는 방법을 알아보세요.

[Development builds](/develop/development-builds/introduction)는 Expo의 개발자 도구를 포함하는 프로젝트 전용 build입니다. 이런 종류의 build에는 프로젝트 안의 모든 native dependency가 포함되므로, simulator, emulator, 또는 실제 device에서 프로젝트의 production과 유사한 build를 실행할 수 있습니다. 이 workflow를 사용하면 각 플랫폼에 대해, 그리고 실제 device, Android emulator, iOS simulator용 development build를 모두 만들 수 있으며, 팀은 이를 `eas build:dev`로 접근할 수 있습니다.

[Expo Golden Workflow: development build 생성 자동화하기](https://www.youtube.com/watch?v=u8MAJ0F18s0) — EAS Workflows를 사용해 Android, iOS device, simulator용 development build를 자동화하는 방법을 알아보세요.

## 시작하기

사전 요구 사항

요구 사항 2개

1.

환경 설정하기

시작하려면 development build를 build하고 실행할 수 있도록 프로젝트와 device를 구성해야 합니다. 다음 가이드를 참고해 development build용 환경을 설정하세요.

[Android device setup](/get-started/set-up-your-environment?mode=development-build&platform=android&device=physical) — development build를 위한 프로젝트 준비하기.

[Android Emulator setup](/get-started/set-up-your-environment?mode=development-build&platform=android&device=simulated) — development build를 위한 프로젝트 준비하기.

[iOS device setup](/get-started/set-up-your-environment?mode=development-build&platform=ios&device=physical) — development build를 위한 프로젝트 준비하기.

[iOS Simulator setup](/get-started/set-up-your-environment?mode=development-build&platform=ios&device=simulated) — development build를 위한 프로젝트 준비하기.

2.

Build profile 만들기

프로젝트와 device 구성을 마쳤다면 **eas.json** 파일에 다음 build profile을 추가하세요.

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "development-simulator": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    }
  }
}
```

다음 workflow는 각 플랫폼에 대해, 그리고 실제 device, Android emulator, iOS simulator용 build를 각각 생성합니다. 이들은 모두 병렬로 실행됩니다.

```yaml
name: Create development builds

jobs:
  android_development_build:
    name: Build Android
    type: build
    params:
      platform: android
      profile: development
  ios_device_development_build:
    name: Build iOS device
    type: build
    params:
      platform: ios
      profile: development
  ios_simulator_development_build:
    name: Build iOS simulator
    type: build
    params:
      platform: ios
      profile: development-simulator
```

위 workflow는 다음 명령으로 실행할 수 있습니다.

```sh
eas workflow:run .eas/workflows/create-development-builds.yml
```
