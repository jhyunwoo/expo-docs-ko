---
modificationDate: March 02, 2026
title: App store용 프로젝트 빌드하기
description: EAS Build를 사용해 command line에서 app store에 제출할 준비가 된 production build를 만드는 방법을 알아보세요.
---

# App store용 프로젝트 빌드하기

EAS Build를 사용해 command line에서 app store에 제출할 준비가 된 production build를 만드는 방법을 알아보세요.

[EAS](/build/setup) 또는 [locally](/guides/local-app-development)를 사용해 native app binary를 만들었다면, 앱 개발 여정의 다음 단계는 앱을 스토어에 제출하는 것입니다. 이를 위해서는 **production build**를 만들어야 합니다.

production build는 일반 대중에게 공개하기 위해 또는 TestFlight 같은 store 기반 테스트 프로세스의 일부로 app store에 제출됩니다. 이 가이드는 [EAS](/deploy/build-project#production-builds-using-eas)와 [locally](/deploy/build-project#production-builds-locally)에서 production build를 만드는 방법을 설명합니다. Android와 iOS 앱을 컴파일할 수 있는 CI 서비스라면 어떤 것이든 Expo 앱의 production build를 만드는 것도 가능합니다.

## EAS를 사용한 Production builds

production build는 각 app store를 통해 설치되어야 합니다. Android Emulator, iOS Emulator, 또는 device에 직접 설치할 수는 없습니다. 유일한 예외는 build profile에서 Android에 대해 `"buildType": "apk"`를 명시적으로 설정한 경우입니다. 하지만 store에 제출할 때는 **aab**를 사용하는 것이 권장되며, 이것이 기본 구성입니다.

### `eas.json` configuration

**eas.json**에서 production build를 만들기 위한 최소 구성은 첫 번째 build를 만들 때 이미 생성됩니다:

```json
{
  "build": {
    ... 
    "production": {}
    ... 
  }
}
```

### Production build 만들기

production build를 만들려면, 플랫폼에 대해 다음 명령을 실행하세요:

```sh
eas build --platform android
```

예를 들어 `eas build --platform ios --message "Some message"`처럼 build 명령에 `--message`를 전달해 build에 메시지를 첨부할 수 있습니다. 이 메시지는 EAS dashboard에 표시됩니다. 팀을 위해 build의 목적을 지정하고 싶을 때 유용합니다.

또는 `--platform all` 옵션을 사용해 Android와 iOS를 동시에 build할 수도 있습니다:

```sh
eas build --platform all
```

## Developer account

앱을 제출하려는 app store용 developer account가 필요합니다.

Google Play Store에 배포하려면 Google Play Developer membership이 필요합니다.

EAS Build를 사용해 앱을 build하고 sign할 수는 있지만, membership이 없다면 Google Play Store에 업로드할 수 없습니다. membership 비용은 일회성 $25 USD입니다.

Apple App Store용으로 build하려면 Apple Developer Program membership이 필요합니다.

Apple App Store용 production build를 만들기 위해 EAS Build를 사용할 계획이라면, $99 USD의 [Apple Developer Program](https://developer.apple.com/programs) membership이 있는 account에 접근할 수 있어야 합니다.

## App signing credentials

app store용 build 프로세스를 시작하기 전에, store developer account가 필요하고 app signing credentials를 생성하거나 제공해야 합니다.

app signing credentials 생성 경험이 있든 없든, EAS CLI가 많은 작업을 대신 처리해 줄 수 있습니다. app signing credentials 과정을 EAS CLI가 처리하도록 opt-in할 수 있습니다.

### Android app signing credentials

-   앱용 keystore를 아직 생성하지 않았다면 EAS CLI에서 `Generate new keystore`를 선택하세요. 그러면 끝입니다. keystore는 EAS 서버에 안전하게 저장됩니다.
-   keystore를 수동으로 생성하고 싶다면, 자세한 내용은 [manual Android credentials guide](/app-signing/local-credentials#android-credentials)를 참고하세요.

### iOS app signing credentials

-   provisioning profile과 distribution certificate를 아직 생성하지 않았다면, Apple Developer Program account로 로그인한 후 EAS CLI의 prompt를 따르세요.
-   credentials를 수동으로 생성하고 싶다면, 자세한 내용은 [manual iOS credentials guide](/app-signing/local-credentials#ios-credentials)를 참고하세요.

## Build 완료를 기다리기

기본적으로 `eas build` 명령은 build가 완료될 때까지 기다리지만, 기다리고 싶지 않다면 중단할 수 있습니다. 대신 EAS CLI가 출력하는 build details page 링크를 사용해 build 진행 상황을 모니터링하고 build log를 읽으세요. [your build dashboard](https://expo.dev/builds)를 방문하거나 다음 명령을 실행해서도 이 페이지를 찾을 수 있습니다:

```sh
eas build:list
```

organization 멤버이며 build가 그 organization을 대신해 실행된 것이라면, [the build dashboard for that account](https://expo.dev/accounts/%5Baccount%5D/builds)에서 build details를 확인할 수 있습니다.

## Build 자동으로 만들기

[EAS Workflows](/eas/workflows/introduction)를 사용하면 특정 branch에 대한 commit에서 자동으로 build를 만들 수 있습니다. 먼저 [configure your project](/eas/workflows/get-started)를 진행하고, 프로젝트 루트에 **.eas/workflows/create-builds.yml**이라는 파일을 추가한 다음, 아래 workflow 구성을 넣으세요:

```yaml
name: Create builds

on:
  push:
    branches: ['main']

jobs:
  build_android:
    name: Build Android app
    type: build
    params:
      platform: android
      profile: production
  build_ios:
    name: Build iOS app
    type: build
    params:
      platform: ios
      profile: production
```

위 workflow는 프로젝트의 `main` branch에 commit이 있을 때마다 Android와 iOS build를 생성합니다. 다음 EAS CLI 명령으로 이 workflow를 수동 실행할 수도 있습니다:

```sh
eas workflow:run create-builds.yml
```

[workflows examples guide](/eas/workflows/examples/introduction)에서 일반적인 패턴에 대해 더 알아보세요.

## 로컬에서 Release builds 만들기

로컬에서 release build(즉, production build)를 만들려면, Android와 iOS에 필요한 단계에 대한 자세한 정보는 아래 React Native 가이드를 참고하세요.

이 가이드는 프로젝트에 각 native 프로젝트를 포함하는 **android** 및/또는 **ios** 디렉터리가 있다고 가정합니다. [Continuous Native Generation](/workflow/continuous-native-generation)을 사용한다면, 가이드를 따르기 전에 [prebuild](/more/glossary-of-terms#prebuild)를 실행해 디렉터리를 생성해야 합니다.

> **참고**: 아래 가이드의 4단계에서 Android release **.aab**를 build할 때는 `npx react-native build-android --mode=release` 대신 **android** 디렉터리에서 `./gradlew app:bundleRelease`를 실행하세요.

[Publishing to Google Play Store](https://reactnative.dev/docs/signed-apk-android) - 필요한 단계를 수동으로 따라 Google Play Store에 앱을 게시하는 방법을 알아보세요.

[Publishing to Apple App Store](https://reactnative.dev/docs/publishing-to-app-store) - 필요한 단계를 수동으로 따라 Apple App Store에 앱을 게시하는 방법을 알아보세요.

## Next step

[App stores best practices](/distribution/app-stores) - app store에 앱을 제출할 때의 모범 사례를 알아보세요.
