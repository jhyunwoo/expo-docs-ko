---
modificationDate: March 09, 2026
title: cloud에서 development build 설정하기
description: EAS Build를 사용해 프로젝트용 development build를 설정하는 방법을 알아봅니다.
---

# cloud에서 development build 설정하기

EAS Build를 사용해 프로젝트용 development build를 설정하는 방법을 알아봅니다.

이 장에서는 예제 앱을 위해 EAS로 development build를 설정하고 구성해 보겠습니다.

[시청하기: development build 설정하는 방법](https://www.youtube.com/watch?v=uQCE9zl3dXU) — expo-dev-client를 설치하고, eas.json에서 build profile을 설정하고, EAS Build로 첫 development build를 만드는 방법을 알아봅니다.

## development build 이해하기

먼저 development build가 무엇이고 왜 필요한지부터 알아보겠습니다.

[development build](/develop/development-builds/introduction)는 프로젝트의 debug 버전입니다. 앱을 만들 때 빠른 반복 작업에 최적화되어 있습니다. 이 빌드에는 강력하고 완전한 development 환경을 제공하는 [`expo-dev-client`](/versions/latest/sdk/dev-client) 라이브러리가 포함됩니다. 이 구성을 사용하면 필요에 따라 어떤 native library든 통합하거나 [native directories](/workflow/overview#android-and-ios-native-projects) 안의 코드를 변경할 수 있습니다.

### 핵심 특징

> **Note:** [Expo Go](/get-started/set-up-your-environment)에 익숙하다면, development build는 프로젝트 요구 사항에 맞게 커스터마이즈할 수 있는 Expo Go 버전이라고 생각하면 됩니다.

| Feature | Development Builds | Expo Go |
| --- | --- | --- |
| **Development phase** | 모바일 앱 개발에 웹과 비슷한 반복 속도를 제공합니다. | client app을 사용해 Expo SDK 프로젝트를 빠르게 반복 개발하고 테스트할 수 있게 해줍니다. |
| **Collaboration** | 공유된 native runtime으로 팀 테스트를 지원합니다. | 디바이스에서 QR 코드로 프로젝트를 쉽게 공유할 수 있습니다. |
| **Third-party libraries support** | custom native code가 필요한 경우를 포함해 모든 [third-party library](/workflow/using-libraries#third-party-libraries)를 완전히 지원합니다. | Expo SDK 안의 라이브러리로 제한되며, custom native dependency에는 적합하지 않습니다. |
| **Customization** | [config plugins](/config-plugins/introduction)과 native code에 대한 직접 접근으로 폭넓은 커스터마이징이 가능합니다. | direct native code 수정 없이 Expo SDK 기능 중심의 제한된 커스터마이징만 가능합니다. |
| **Intended use** | 스토어 배포를 목표로 하는 본격적인 앱 개발에 적합하며, 완전한 development 환경과 도구를 제공합니다. | 학습, 프로토타이핑, 실험에 적합합니다. production 앱에는 권장되지 않습니다. |

## expo-dev-client 라이브러리 설치하기

development build용으로 프로젝트를 초기화하려면 프로젝트 디렉터리 안으로 [`cd`](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Command_line#basic_built-in_terminal_commands)한 뒤 다음 명령어를 실행해 라이브러리를 설치합니다:

```sh
npx expo install expo-dev-client
```

### development server 시작하기

[development server](/get-started/start-developing#start-a-development-server)를 시작하려면 `npx expo start`를 실행합니다:

```sh
npx expo start
```

이 명령은 metro bundler를 시작합니다. 터미널 창에서는 QR 코드와 함께 `Metro waiting on...`, 그리고 manifest URL이 표시됩니다:

`expo-dev-client` 라이브러리를 설치하면서 달라진 점을 살펴봅시다:

-   manifest URL에 앱 scheme과 함께 `expo-development-client`가 포함됩니다
-   development server가 이제 Expo Go용이 아니라 development build용으로 동작합니다.

우리 디바이스나 emulator/simulator 중 어느 곳에도 아직 development build가 설치되어 있지 않기 때문에, 지금은 프로젝트를 실행할 수 없습니다.

## development build 초기화하기

### EAS CLI 설치하기

로컬 머신에 EAS Command Line Interface(CLI) 도구를 전역 dependency로 설치해야 합니다. 다음 명령을 실행하세요:

```sh
npm install -g eas-cli
```

### Expo 계정으로 로그인하거나 가입하기

> Expo 계정이 있고 Expo CLI로 이미 로그인한 상태라면 이 단계는 건너뛰세요. Expo 계정이 없다면 [여기에서 가입](https://expo.dev/signup)한 뒤 아래 로그인 명령을 진행하세요.

로그인하려면 다음 명령을 실행하세요:

```sh
eas login
```

이 명령은 로그인을 완료하기 위해 Expo 계정 email 또는 username과 password를 묻습니다.

### 프로젝트를 초기화하고 EAS에 연결하기

새 프로젝트에서는 가장 먼저 프로젝트를 초기화하고 EAS 서버에 연결해야 합니다. 다음 명령을 실행하세요:

```sh
eas init
```

이 명령을 실행하면:

-   Expo 계정 자격 증명을 입력해 계정 소유자를 확인하고, 새 EAS 프로젝트를 만들 것인지 묻습니다:

```sh
✔ Which account should own this project? > your-username
✔ Would you like to create a project for @your-username/sticker-smash? … yes
✔ Created @your-username/sticker-smash
✔ Project successfully linked (ID: XXXX-XX-XX-XXXX) (modified app.json)
```

-   EAS 프로젝트를 생성하고, EAS dashboard에서 열 수 있는 해당 프로젝트 링크를 제공합니다:

-   고유한 `projectId`를 생성하고, 이 EAS 프로젝트를 개발 머신의 예제 앱과 연결합니다.
-   **app.json**을 수정해 [`extra.eas.projectId`](/versions/latest/sdk/constants#easconfig)를 포함시키고, 방금 만든 고유 ID 값으로 업데이트합니다.

app.json의 `projectId`란 무엇인가요?

`eas init`가 실행되면 **app.json**의 `extra.eas.projectId` 아래에 프로젝트의 고유 식별자가 연결됩니다. 이 속성 값은 EAS 서버에서 프로젝트를 식별하는 데 사용됩니다.

```json
{
  "extra": {
    "eas": {
      "projectId": "0cd3da2d-xxx-xxx-xxx-xxxxxxxxxx"
    }
  }
}
```

## EAS Build용 프로젝트 설정하기

프로젝트를 EAS Build용으로 설정하려면 다음 명령을 실행하세요:

```sh
eas build:configure
```

이 명령을 실행하면:

-   플랫폼 선택을 묻습니다: **Android**, **iOS**, 또는 **All**. 우리는 Android와 iOS 앱을 만들 것이므로 **All**을 선택합시다.
-   프로젝트 디렉터리 루트에 다음 설정으로 **eas.json**을 생성합니다:

```json
{
  "cli": {
    "version": ">= 16.18.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

이것은 새 프로젝트에서의 **eas.json** 기본 설정입니다. 이 설정은 두 가지를 수행합니다:

-   현재 EAS CLI 버전을 정의합니다.
-   `development`, `preview`, `production` 세 개의 [build profiles](/build/eas-json#build-profiles)를 추가합니다.

development profile 더 살펴보기

**eas.json**은 여러 build profile의 모음입니다. 각 profile은 특정 build 유형을 만들기 위해 서로 다른 설정으로 구성됩니다. 또한 Android 또는 iOS용 플랫폼별 설정도 포함할 수 있습니다.

현재 우리가 집중할 것은 `development` profile이며, 다음 설정이 포함되어 있습니다:

-   [`developmentClient`](/eas/json#developmentclient): debug build 생성을 위해 활성화(`true`)되어 있습니다. 이 설정은 development 도구를 제공하는 `expo-dev-client` 라이브러리를 사용해 앱을 로드하고, 디바이스 또는 emulator/simulator에 설치할 수 있는 build artifact를 생성하며, JavaScript를 즉시 업데이트할 수 있어 로컬 개발에 앱을 사용할 수 있게 해줍니다.
-   [`distribution`](/eas/json#distribution): build를 내부적으로 공유하기 원한다는 뜻으로 `internal`로 설정되어 있습니다(앱 스토어 업로드 대신).

> **Note**: build는 플랫폼별 설정과 여러 build profile 간 설정 확장을 포함해 매우 폭넓은 커스터마이징 옵션을 제공합니다. 자세한 내용은 [build profile 커스터마이징](/build/eas-json#build-profiles)을 참고하세요.

## 요약

1장: cloud에서 development build 설정하기

EAS CLI를 사용해 프로젝트를 초기화하고 설정했으며, EAS 서버와 연결하고 development build를 준비하는 데 성공했습니다.

다음 장에서는 Android용 development build를 만들고, 이를 디바이스와 emulator에 설치한 뒤 development server와 함께 실행해 보겠습니다.

[다음: Android용 cloud build 만들고 실행하기](/tutorial/eas/android-development-build)
