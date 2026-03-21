---
modificationDate: July 01, 2024
title: iOS Simulator용 빌드
description: EAS Build를 사용할 때 iOS Simulator용 빌드를 구성하고 설치하는 방법을 알아보세요.
---

# iOS Simulator용 빌드

EAS Build를 사용할 때 iOS Simulator용 빌드를 구성하고 설치하는 방법을 알아보세요.

iOS Simulator에서 앱 빌드를 실행하는 것은 유용합니다. 빌드 profile을 구성하고, 빌드를 simulator에 자동으로 설치할 수 있습니다. 이렇게 하면 TestFlight에 배포하지 않거나 Apple Developer 계정이 없어도 앱의 standalone 버전(Expo Go와 독립적으로 동작하는 버전)을 실행할 수 있습니다.

## Simulator용으로 빌드하는 profile 구성하기

iOS Simulator에 앱 빌드를 설치하려면 [**eas.json**](/build/eas-json)의 build profile을 수정하고 `ios.simulator` 값을 `true`로 설정하세요:

```json
{
  "build": {
    "preview": {
      "ios": {
        "simulator": true
      }
    },
    "production": {}
  }
}
```

이제 아래와 같이 명령을 실행해 빌드를 시작하세요:

```sh
eas build -p ios --profile preview
```

profile 이름은 원하는 대로 정할 수 있다는 점을 기억하세요. 위 예시에서는 `preview`라고 했지만, `local`, `simulator` 또는 가장 이해하기 쉬운 다른 이름을 사용할 수 있습니다.

## Simulator에 빌드 설치하기

> iOS Simulator를 아직 설치하거나 실행해 본 적이 없다면 진행하기 전에 [iOS Simulator 가이드](/workflow/ios-simulator)를 따라 하세요.

빌드가 완료되면 CLI가 빌드를 자동으로 다운로드하고 iOS Simulator에 설치할지 묻습니다. 프롬프트가 나타나면 Y를 눌러 simulator에 바로 설치하세요.

빌드가 여러 개 있다면 언제든지 `eas build:run` 명령을 실행해 특정 빌드를 다운로드하고 iOS Simulator에 자동으로 설치할 수도 있습니다:

```sh
eas build:run -p ios
```

이 명령은 프로젝트에서 사용할 수 있는 빌드 목록도 함께 보여줍니다. 이 목록에서 simulator에 설치할 빌드를 선택할 수 있습니다. 목록의 각 빌드에는 build ID, 빌드 생성 후 경과 시간, build number, version number, git commit 정보가 포함됩니다. 프로젝트에 invalid build가 있으면 목록에 함께 표시됩니다.

예를 들어 아래 이미지는 프로젝트의 이전 빌드 두 개를 보여줍니다:

빌드 설치가 완료되면 홈 화면에 표시됩니다. development build라면 터미널 창을 열고 `npx expo start` 명령을 실행해 development server를 시작하세요.

### 최신 빌드 실행하기

`eas build:run` 명령에 `--latest` 플래그를 전달하면 최신 빌드를 다운로드해 iOS Simulator에 설치할 수 있습니다:

```sh
eas build:run -p ios --latest
```
