---
modificationDate: October 17, 2025
title: 앱 버전 관리
description: 다양한 버전 유형과 이를 원격 또는 로컬에서 관리하는 방법을 알아보세요.
---

# 앱 버전 관리

다양한 버전 유형과 이를 원격 또는 로컬에서 관리하는 방법을 알아보세요.

Android와 iOS는 각각 앱 버전을 식별하기 위한 두 가지 값을 제공합니다. 하나는 스토어에 표시되는 버전(사용자 대상 버전)이고, 다른 하나는 개발자만 볼 수 있는 버전(개발자 대상 빌드 버전)입니다. 이 가이드는 이러한 버전을 원격 또는 로컬에서 관리하는 방법을 설명합니다.

[Automatic App Version Management](https://www.youtube.com/watch?v=Gk7RHDWsLsQ) — Expo feature focus 영상에서 Expo EAS Build의 자동 앱 버전 관리에 대해 알아보세요.

## 앱 버전

Expo 프로젝트에서는 [app config](/workflow/configuration) 파일에서 앱 버전을 정의하는 데 다음 속성을 사용할 수 있습니다.

| Property | Description |
| --- | --- |
| [`version`](/versions/latest/config/app#version) | 스토어에 표시되는 사용자 대상 버전입니다. Android에서는 **android/app/build.gradle**의 `versionName`을 의미합니다. iOS에서는 **Info.plist**의 `CFBundleShortVersionString`을 의미합니다. |
| [`android.versionCode`](/versions/latest/config/app#versioncode) | Android용 개발자 대상 빌드 버전입니다. **android/app/build.gradle**의 `versionCode`를 의미합니다. |
| [`ios.buildNumber`](/versions/latest/config/app#buildnumber) | iOS용 개발자 대상 빌드 버전입니다. **Info.plist**의 `CFBundleVersion`을 의미합니다. |

### 앱에서 앱 버전 사용하기

앱 내부에 사용자 대상 버전을 표시하려면 `expo-application` 라이브러리의 [`Application.nativeApplicationVersion`](/versions/latest/sdk/application#applicationnativeapplicationversion)을 사용할 수 있습니다.

앱 내부에 개발자 대상 빌드 버전을 표시하려면 `expo-application` 라이브러리의 [`Application.nativeBuildVersion`](/versions/latest/sdk/application#applicationnativebuildversion)을 사용할 수 있습니다.

## 권장 워크플로

### 사용자 대상 버전

프로덕션 릴리스를 할 때는 사용자 대상 버전을 명시적으로 설정하고 직접 업데이트해야 합니다. 프로덕션 빌드를 앱 스토어에 제출할 때 app config의 `version` 속성을 업데이트할 수 있습니다. 이 규칙은 프로젝트가 자동 runtime version 정책과 함께 `expo-updates`를 사용하는 경우에도 동일합니다. 이는 앱의 새 버전에 대한 새로운 개발 사이클이 시작되었음을 표시합니다. 자세한 내용은 [deployment patterns](/eas-update/deployment-patterns)를 참고하세요.

### 개발자 대상 빌드 버전

개발자 대상 빌드 버전은 모든 빌드마다 자동 증가하도록 설정할 수 있습니다. 이렇게 하면 Play Store 테스트 채널이나 TestFlight에 새 아카이브를 업로드할 때마다 프로젝트를 수동으로 변경할 필요가 없어집니다. 앱 스토어에서 거절되는 흔한 원인 중 하나는 중복된 버전 번호의 빌드를 제출하는 것입니다. 이는 개발자가 새 빌드를 만들기 전에 개발자 대상 빌드 버전 번호를 올리는 것을 잊었을 때 발생합니다.

EAS Build는 [`remote` version source](/build-reference/app-versions#remote-version-source)를 선택했을 때 이 버전을 대신 증가시켜 주므로 개발자 대상 빌드 버전을 자동으로 관리하는 데 도움이 됩니다. 이것이 권장 동작입니다. 선택적으로 `local` 앱 버전 소스를 사용할 수도 있는데, 이 경우 각 구성 파일에서 버전을 직접 수동 관리하게 됩니다.

## Remote version source

> `remote` version source는 EAS CLI 버전 `12.0.0`부터 권장되는 동작입니다.

EAS 서버는 앱의 개발자 대상 빌드 버전(`android.versionCode` 및 `ios.buildNumber`)을 원격으로 저장하고 관리할 수 있습니다. 이를 활성화하려면 **eas.json**에서 `cli.appVersionSource`를 `remote`로 설정해야 합니다. 그런 다음 `production` build profile 아래에서 `autoIncrement` 속성을 `true`로 설정할 수 있습니다.

```json
{
  "cli": {
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      ... 
    },
    "preview": {
      ... 
    },
    "production": {
      "autoIncrement": true
    }
  }
  ... 
}
```

원격 버전은 로컬 프로젝트의 값으로 초기화됩니다. 예를 들어 app config에서 `android.versionCode`가 `1`로 설정되어 있다면, remote version source를 사용해 새 빌드를 만들 때 자동으로 `2`가 됩니다. 하지만 app config에 빌드 버전이 설정되어 있지 않다면 첫 빌드 생성 시 원격 버전은 `1`로 초기화됩니다.

**eas.json**에서 `remote` version 속성이 활성화되면 app config에 저장된 빌드 버전 값은 무시되며, 원격에서 버전이 증가할 때도 업데이트되지 않습니다. remote version source 값은 빌드 실행 시 네이티브 프로젝트에 설정되며, 이것이 이 값들의 source of truth로 간주됩니다. 따라서 app config에서 해당 값을 안전하게 제거할 수 있습니다.

### 이미 정의된 버전을 remote로 동기화하기

이미 프로젝트에 버전이 설정되어 있고, 새 EAS Build를 만들 때 그 버전에서 이어서 증가시키고 싶을 수 있습니다. 하지만 이러한 기존 버전이 EAS와 원격으로 동기화되어 있지 않을 수도 있습니다. 이런 시나리오의 예시는 다음과 같습니다:

-   이미 앱 스토어에 앱을 게시했고 동일한 버전 번호를 계속 사용하고 싶다.
-   EAS CLI가 현재 앱 버전을 감지할 수 없다.
-   그 밖의 이유로 app config 등에 버전이 명시적으로 설정되어 있다.

이러한 경우 다음 단계로 EAS CLI를 사용해 현재 버전을 EAS Build에 동기화할 수 있습니다:

-   터미널 창에서 다음 명령을 실행합니다:
    
    ```sh
    eas build:version:set
    ```
    
-   프롬프트가 표시되면 플랫폼(Android 또는 iOS)을 선택합니다.
    
-   **Do you want to set app version source to remote now?** 라는 프롬프트가 표시되면 **yes**를 선택합니다. 그러면 **eas.json**에서 `cli.appVersionSource`가 `remote`로 설정됩니다.
    
-   **What version would you like to initialize it with?** 라는 프롬프트가 표시되면, 앱 스토어에서 마지막으로 사용한 버전 번호를 입력합니다.
    

이 단계를 완료하면 앱 버전이 EAS Build에 원격으로 동기화됩니다. 이제 **eas.json**에서 `build.production.autoIncrement`를 `true`로 설정할 수 있습니다. 새 프로덕션 빌드를 만들면 `versionCode`와 `buildNumber`가 자동으로 증가합니다.

### remote에서 local로 버전 동기화하기

로컬에서 Android Studio나 Xcode로 프로젝트를 빌드할 때 EAS에 원격 저장된 동일한 버전을 사용하려면 다음 명령으로 원격 버전을 로컬 프로젝트에 반영하세요:

```sh
eas build:version:sync
```

### 제한 사항

-   Android에서 `eas build:version:sync` 명령은 여러 flavor가 있는 bare 프로젝트를 지원하지 않습니다. 하지만 나머지 원격 버전 관리 기능은 모든 프로젝트에서 동작해야 합니다.
-   `autoIncrement`는 `version` 옵션을 지원하지 않습니다.
-   EAS Update를 사용하면서 runtime policy를 `"runtimeVersion": { "policy": "nativeVersion" }`로 설정한 경우에는 지원되지 않습니다. 유사한 동작이 필요하다면 대신 `"appVersion"` 정책을 사용하세요.

## Local version source

프로젝트 버전의 source of truth를 로컬 프로젝트 소스 코드 자체로 설정할 수 있습니다. 이를 위해 **eas.json**에서 `cli.appVersionSource`를 `local`로 설정하세요.

이 구성을 사용하면 EAS는 앱 버전 값을 읽고 그대로 프로젝트를 빌드합니다. 프로젝트에 값을 쓰지는 않습니다. 또한 build profile에서 `autoIncrement` 옵션을 설정하여 버전을 로컬에서 자동 증가시키도록 할 수도 있습니다.

```json
{
  "cli": {
    "appVersionSource": "local"
  },
  "build": {
    "development": {
      ... 
    },
    "preview": {
      ... 
    },
    "production": {
      "autoIncrement": true
    }
  }
  ... 
}
```

[기존 React Native 프로젝트](/bare/overview)의 경우 네이티브 코드의 값이 우선합니다. `expo-constants`와 `expo-updates` 라이브러리는 app config 파일의 값을 읽습니다. 매니페스트의 버전 값에 의존한다면, 네이티브 코드와 값을 동기화해 두어야 합니다. 특히 EAS Update에서 runtime policy를 `"runtimeVersion": { "policy": "nativeVersion" }`로 설정한 경우 버전 불일치로 인해 잘못된 애플리케이션 버전에 업데이트가 전달될 수 있으므로 이 동기화가 매우 중요합니다. app config 값에 의존하기보다는 [`expo-application`](/versions/latest/sdk/application#constants)을 사용해 버전을 읽는 것을 권장합니다.

### 제한 사항

-   `autoIncrement`를 사용하면 버전 변경이 유지되도록 매 빌드마다 변경 사항을 커밋해야 합니다. 이는 CI에서 빌드할 때 조율이 어려울 수 있습니다.
-   여러 flavor를 지원하는 Gradle 구성을 가진 기존 React Native 프로젝트의 경우 EAS CLI가 버전을 읽거나 수정할 수 없으므로 `autoIncrement` 옵션이 지원되지 않으며, [expo.dev](https://expo.dev)의 build details 페이지에도 버전이 표시되지 않습니다.
