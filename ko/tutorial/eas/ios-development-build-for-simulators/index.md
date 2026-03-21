---
modificationDate: March 09, 2026
title: iOS Simulator용 cloud build 만들고 실행하기
description: EAS Build를 사용해 iOS Simulator용 development build를 설정하는 방법을 알아봅니다.
---

# iOS Simulator용 cloud build 만들고 실행하기

EAS Build를 사용해 iOS Simulator용 development build를 설정하는 방법을 알아봅니다.

이 장에서는 EAS Build를 사용해 iOS Simulator에서 실행할 수 있는 development build를 만들어 보겠습니다.

iOS Simulator용 development build는 iOS 디바이스와는 다른 **.app** 형식으로 생성됩니다.

[시청하기: iOS Simulator용 development build 만들기](https://www.youtube.com/watch?v=SgL97PFZctg) — eas.json에서 simulator build profile을 만들고 iOS Simulator에서 development build를 실행하는 방법을 알아봅니다.

## eas.json에 simulator build profile 만들기

**eas.json**에서 [`ios.simulator`](/eas/json#simulator) 속성을 가진 `ios-simulator`라는 새 build profile을 추가하세요. 값은 `true`로 설정합니다:

```json
{
  "build": {
    "development": {
      ... 
    },
    "ios-simulator": {
      "ios": {
        "simulator": true
      }
    }
  }
}
```

development build에서는 profile 안에 `developmentClient`와 `distribution` 속성이 정의되어 있어야 합니다. 중복을 피하기 위해 `development` profile 속성을 확장할 수 있습니다:

```json
{
  "ios-simulator": {
    "extends": "development",
    "ios": {
      "simulator": true
    }
  }
}
```

## iOS Simulator용 development build

### 만들기

`ios`를 platform으로, `ios-simulator`를 build profile로 지정해 `eas build` 명령을 실행하세요:

```sh
eas build --platform ios --profile ios-simulator
```

이 명령은 build를 처음 만들 때 다음 질문들을 표시합니다:

-   **What would you like your iOS bundle identifier to be?** 이 프롬프트에서 제공되는 기본값을 선택하려면 return을 누르세요. 그러면 **app.json**에 [`ios.bundleIdentifier`](/versions/latest/config/app#package)가 추가됩니다.
-   **iOS app only uses standard/exempt encryption?** 이 프롬프트에서 제공되는 기본값을 선택하려면 Y를 누르세요. 우리 앱은 encryption을 사용하지 않으므로, **Info.plist** 파일의 `ITSAppUsesNonExemptEncryption`을 `NO`로 설정하고, 나중에 앱을 TestFlight/Apple App Store에 릴리스할 때 관련 compliance check도 처리해 줍니다. 자신의 앱을 릴리스할 때 encryption을 사용하는 경우에는 N을 선택해 다음부터 이 프롬프트를 건너뛸 수 있습니다.

프롬프트에 응답하면 EAS Build가 queue에 들어가고, EAS CLI가 EAS dashboard에서 build 세부 정보와 진행 상황을 볼 수 있는 링크를 제공합니다:

build details 페이지에는 무엇이 있나요?

build details 페이지는 build type, profile, Expo SDK version, app version, build number, 마지막 commit hash, 그리고 build를 시작한 개발자 또는 계정 소유자의 정보를 표시합니다.

위 이미지에서 **Build artifact**의 현재 상태는 build가 진행 중임을 보여줍니다. 완료되면 이 섹션에 build를 다운로드할 수 있는 옵션이 제공됩니다. **Logs**는 EAS Build에서 수행한 iOS build 과정의 모든 단계를 보여줍니다. 간결함을 위해 여기서는 각 단계를 자세히 보지 않겠습니다. 더 자세한 내용은 [iOS build process](/build-reference/ios-builds)를 참고하세요.

iOS bundle identifier란 무엇인가요?

`ios.bundleIdentifier`는 앱의 고유 이름입니다. 지금 당장 앱을 게시한다면 Apple App Store는 이 속성과 값을 사용해 스토어에서 앱을 식별합니다.

이 표기법은 `host.owner.app-name` 형식으로 정의됩니다. 예를 들어 예제 앱은 `com.owner.stickersmash`를 사용하며, 여기서 `com.owner`는 도메인이고 `stickersmash`는 앱 이름입니다.

### 설치하기

터미널에서 build가 완료되면 EAS CLI가 iOS Simulator에서 build를 실행할지 묻습니다. Y를 누르세요.

대안: Expo Orbit 사용하기

[Expo Orbit](https://expo.dev/orbit)를 사용해 development build를 설치할 수도 있습니다. EAS dashboard의 **Build artifact**에서 **Open with Expo Orbit**를 클릭하면 iOS Simulator에 development build가 설치됩니다.

### 실행하기

프로젝트 디렉터리에서 `npx expo start` 명령을 실행해 development server를 시작합니다:

```sh
npx expo start
```

터미널 창에서 i를 눌러 iOS Simulator에서 프로젝트를 엽니다.

## 요약

3장: iOS Simulator용 cloud build 만들고 실행하기

EAS Build를 사용해 iOS Simulator에서 development build를 성공적으로 만들고 실행했습니다.

다음 장에서는 iOS용 development build를 만들고 디바이스에 설치해 실행해 보겠습니다.

[다음: iOS 디바이스용 cloud build 만들고 실행하기](/tutorial/eas/ios-development-build-for-devices)
