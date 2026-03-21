---
modificationDate: February 11, 2026
title: EAS Workflows와 Maestro에서 E2E 테스트 실행하기
description: Maestro와 함께 EAS Workflows에서 E2E 테스트를 설정하고 실행하는 방법을 알아보세요.
---

# EAS Workflows와 Maestro에서 E2E 테스트 실행하기

Maestro와 함께 EAS Workflows에서 E2E 테스트를 설정하고 실행하는 방법을 알아보세요.

이 가이드에서는 [Maestro](https://maestro.dev/)를 사용해 EAS Workflows에서 end-to-end(E2E) 테스트를 실행하는 방법을 배웁니다. 예시는 [default Expo template](/more/create-expo#--template)을 사용해 E2E 테스트 workflow를 구성하는 방법을 보여 줍니다. 실제 앱에서는 앱 UI에 맞게 flow를 조정해야 합니다.

## 프로젝트 설정하기

아직 하지 않았다면 새 프로젝트를 만들고 EAS와 동기화하세요.

[Get started with EAS Workflows guide](/eas/workflows/get-started)를 따라 새 프로젝트를 만들고 EAS와 동기화하세요. 그런 다음 [프로젝트를 구성](/eas/workflows/get-started)하고 GitHub 저장소를 연결하세요.

## 예제 Maestro 테스트 케이스 추가하기

default Expo template에서 만든 앱의 UI는 다음과 같이 보입니다.

예제 앱을 위해 간단한 Maestro flow 두 개를 만들어 봅시다. 먼저 프로젝트 디렉터리 루트에 **.maestro**라는 디렉터리를 만드세요. 이 디렉터리에는 구성할 flow가 들어가며, **eas.json**과 같은 레벨에 있어야 합니다.

그 안에 **home.yml**이라는 새 파일을 만드세요. 이 flow는 앱을 실행하고 홈 화면에 `"Welcome!"` 텍스트가 보이는지 확인합니다.

```yaml
appId: dev.expo.eastestsexample # This is an example app id. Replace it with your app id.
---
- launchApp
- assertVisible: 'Welcome!'
```

다음으로 **expand_test.yml**이라는 새 flow를 만드세요. 이 flow는 예제 앱의 `"Explore"` 화면을 열고, `"File-based routing"` 접기/펼치기 항목을 클릭한 다음, 화면에 `"This app has two screens."` 텍스트가 보이는지 확인합니다.

```yaml
appId: dev.expo.eastestsexample # This is an example app id. Replace it with your app id.
---
- launchApp
- tapOn: 'Explore.*'
- tapOn: '.*File-based routing'
- assertVisible: 'This app has two screens.*'
```

## Maestro 테스트를 로컬에서 실행하기(선택 사항)

Maestro 테스트를 로컬에서 실행하려면 [Installing Maestro](https://docs.maestro.dev/getting-started/installing-maestro)의 안내에 따라 Maestro CLI를 설치하세요.

[앱을 로컬 Android Emulator 또는 iOS Simulator에 설치](/more/expo-cli#compiling)하세요. 터미널을 열고 Maestro 디렉터리로 이동한 뒤, Maestro CLI로 테스트를 시작하려면 다음 명령을 실행하세요.

```sh
maestro test .maestro/expand_test.yml
maestro test .maestro/home.yml
```

아래 영상은 **.maestro/expand_test.yml** flow가 성공적으로 실행된 모습을 보여 줍니다.

## E2E 테스트용 build profile

E2E 테스트에는 EAS가 emulator/simulator에 설치하고 테스트할 수 있는 빌드된 앱 파일이 필요합니다. Android용 **.apk** 또는 iOS용 **.app**가 이에 해당합니다.

**eas.json** 파일에 E2E 테스트용 build profile을 만드세요. 파일이 없으면 `eas build:configure`를 실행해 생성할 수 있습니다.

```json
{
  "build": {
    "e2e-test": {
      "withoutCredentials": true,
      "ios": {
        "simulator": true
      },
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

위 build profile은 Android용 **.apk**와 iOS용 **.app**를 만듭니다. workflow는 이 profile을 사용해 EAS 서버에서 앱을 build합니다.

## E2E 테스트 workflow 만들기

프로젝트 루트에 **.eas/workflows** 디렉터리를 만드세요. 그런 다음 **.eas/workflows/e2e-test-android.yml** 같은 E2E 테스트 workflow용 YAML 파일을 추가하세요.

```yaml
name: e2e-test-android

on:
  pull_request:
    branches: ['*'] # Run the E2E test workflow on every pull request.
jobs:
  build_android_for_e2e:
    type: build
    params:
      platform: android
      profile: e2e-test # your eas build profile for E2E test

  maestro_test:
    needs: [build_android_for_e2e]
    type: maestro
    params:
      build_id: ${{ needs.build_android_for_e2e.outputs.build_id }}
      flow_path: ['.maestro/home.yml', '.maestro/expand_test.yml']
```

이 workflow는 이전 단계의 `e2e-test` build profile을 사용해 Android용 **.apk**를 build합니다. 그런 다음 빌드된 APK에서 **.maestro/home.yml** flow를 실행합니다.

다음은 iOS용 동일 테스트 workflow 예시입니다.

```yaml
name: e2e-test-ios

on:
  pull_request:
    branches: ['*']

jobs:
  build_ios_for_e2e:
    type: build
    params:
      platform: ios
      profile: e2e-test # your eas build profile for E2E test

  maestro_test:
    needs: [build_ios_for_e2e]
    type: maestro
    params:
      build_id: ${{ needs.build_ios_for_e2e.outputs.build_id }}
      flow_path: ['.maestro/home.yml', '.maestro/expand_test.yml']
```

[Syntax for EAS Workflows](/eas/workflows/syntax)에서 더 자세히 알아보세요.

## E2E 테스트 workflow 실행하기

E2E 테스트 workflow는 두 가지 방법으로 실행할 수 있습니다.

1.  **EAS CLI를 사용해 수동으로 실행**

```sh
npx eas-cli@latest workflow:run .eas/workflows/e2e-test-android.yml
```

2.  **pull request를 열 때 자동으로 실행**

이 workflow는 `pull_request` 트리거를 사용하므로 누군가 저장소에 pull request를 열면 자동으로 실행됩니다. [EAS Workflow triggers](/eas/workflows/syntax#on)에서 더 자세히 알아보세요.

workflow가 시작되면 EAS dashboard에서 진행 상황을 추적하고 결과를 볼 수 있습니다. 아래는 완료된 workflow 실행의 스크린샷입니다.

## 더 보기

[Syntax for EAS Workflows](/eas/workflows/syntax) — EAS Workflows 문법을 더 알아보세요.

[Example CI/CD workflows](/eas/workflows/examples) — EAS Workflows용 예제 CI/CD workflow를 더 알아보세요.

[Maestro documentation](https://docs.maestro.dev/) — Maestro flow와 작성 방법을 더 알아보세요.
