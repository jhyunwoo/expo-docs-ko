---
modificationDate: October 06, 2025
title: Android용 사전 빌드된 Expo Modules
description: 사전 빌드된 Expo Modules가 로컬 머신에서 Android build 시간을 최대 25%까지 줄여주는 방법을 알아보세요.
---

# Android용 사전 빌드된 Expo Modules

사전 빌드된 Expo Modules가 로컬 머신에서 Android build 시간을 최대 25%까지 줄여주는 방법을 알아보세요.

React Native 앱을 빌드할 때 build 시간이 길어지면 개발 워크플로가 느려지고 생산성이 떨어질 수 있습니다. 코드를 변경할 때마다 build 프로세스가 끝나기를 기다려야 할 수 있고, 이 지연이 쌓이면 상당한 시간이 됩니다.

**SDK 53부터**, Expo는 이 문제를 해결하기 위해 Android용 사전 빌드된 Expo Modules를 도입했습니다. 이제 각 build마다 Expo Modules source code를 처음부터 컴파일하는 대신, 프로젝트에서 미리 컴파일된 모듈 버전을 사용할 수 있습니다. 그 결과 build 시간이 더 빨라집니다.

## Benefits

-   **더 빠른 로컬 개발**: 로컬 머신에서 Android build 시간이 최대 25% 감소
-   **향상된 개발자 경험**: 개발 iteration 중 대기 시간 감소
-   **자동 최적화**: SDK 53 이상 신규 프로젝트에서 별도 설정 없이 동작

## How prebuilt Expo Modules for Android work

프로젝트의 Android build 과정에서 build output의 패키지 이름 옆에 `[📦]` 이모지 접두사가 붙어 있는지 확인하세요. 이는 해당 패키지가 source에서 컴파일되는 대신 사전 빌드된 버전을 사용하고 있음을 의미합니다.

예를 들어 SDK 53의 기본 template으로 프로젝트를 생성한 뒤 `npx expo run:android` 명령을 실행하면, 사전 컴파일된 패키지 옆에 `[📦 package-name` 접두사가 표시되는 것을 볼 수 있습니다:

## Configuration

**SDK 53 이상에서는, 사용 가능한 [Expo templates](/more/create-expo#--template) 중 하나로 생성한 프로젝트에 별도의 설정 단계가 필요하지 않습니다**.

### Opting out of prebuilt Expo Modules

사전 빌드된 모듈 사용을 비활성화할 수도 있습니다. 직접 모듈 source code를 수정하는 경우에는 이 설정이 필요할 수 있습니다. 이 경우 **package.json** 파일에 `buildFromSource`를 추가해 Expo Autolinking 설정을 구성할 수 있습니다:

```json
{
  "name": "your-app-name",
  "expo": {
    "autolinking": {
      "android": {
        "buildFromSource": [
          ".*"
        ]
      }
    }
  }
}
```

### Selectively opt out

와일드카드 `".*"` 대신 개별 패키지 이름을 지정하면, 다른 모듈은 사전 빌드 상태로 유지한 채 특정 모듈만 선택적으로 제외할 수도 있습니다:

```json
{
  "name": "your-app-name",
  "expo": {
    "autolinking": {
      "android": {
        "buildFromSource": [
          "expo-camera",
          "expo-web-browser",
          "expo-linking",
        ]
      }
    }
  }
}
```

## Considerations

-   기존 프로젝트도 SDK 53 이상으로 업그레이드하면 이 기능의 이점을 얻을 수 있습니다
-   성능 향상 폭은 하드웨어 구성에 따라 달라질 수 있습니다
-   현재 EAS Build에서의 개선 폭은 더 완만하지만, 앞으로의 caching 메커니즘을 위한 기반을 제공합니다
