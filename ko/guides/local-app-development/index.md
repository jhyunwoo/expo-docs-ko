---
modificationDate: February 20, 2026
title: 로컬에서 디버그 빌드 만들기
description: Expo 앱의 디버그 빌드를 로컬에서 만드는 방법을 알아보세요.
---

# 로컬에서 디버그 빌드 만들기

Expo 앱의 디버그 빌드를 로컬에서 만드는 방법을 알아보세요.

자신의 머신에서 프로젝트를 로컬 앱으로 빌드하려면, 디버그 빌드를 테스트하거나 앱 스토어에 제출할 production build를 만들기 전에 네이티브 코드를 수동으로 생성해야 합니다. 앱을 로컬에서 빌드하는 방법은 두 가지가 있습니다. 이 가이드는 두 방법을 간단히 소개하고, 이 workflow를 만드는 데 필요한 다른 가이드도 함께 안내합니다.

## 사전 요구 사항

로컬 머신에서 Android와 iOS 프로젝트를 컴파일하고 실행하려면 Android Studio와 Xcode를 설치하고 설정해야 합니다. 설정 방법은 다음을 참고하세요:

-   [Android Studio](/get-started/set-up-your-environment?platform=android&device=physical&mode=development-build&buildEnv=local#set-up-an-android-device-with-a-development-build)
-   [Xcode](/get-started/set-up-your-environment?platform=ios&device=physical&mode=development-build&buildEnv=local#set-up-an-ios-device-with-a-development-build)

## 로컬 앱 컴파일

프로젝트를 로컬에서 빌드하려면 **android**와 **ios** 디렉터리를 생성하는 Expo CLI의 compile 명령을 사용할 수 있습니다:

```sh
npx expo run:android
npx expo run:ios
```

위 명령은 로컬에 설치된 Android SDK 또는 Xcode를 사용해 프로젝트를 앱의 디버그 빌드로 컴파일합니다. 각 명령은 두 단계를 수행합니다. 먼저 기기나 emulator에 네이티브 binary를 컴파일하고 설치한 다음, JavaScript 또는 TypeScript 코드를 제공하기 위해 Metro bundler를 시작합니다.

-   이 컴파일 명령은 처음에 `npx expo prebuild`를 실행해, 네이티브 디렉터리(**android**와 **ios**)가 아직 없다면 빌드 전에 생성합니다. 이미 존재한다면 이 단계는 건너뜁니다.
-   `--device` 플래그를 추가해 앱을 실행할 기기를 선택할 수도 있습니다. 실제로 연결된 기기나 emulator/simulator를 선택할 수 있습니다.
-   `--variant release`(Android) 또는 `--configuration Release`(iOS)를 전달해 [앱의 production build](/deploy/build-project#release-builds-locally)를 만들 수 있습니다. 다만 이 빌드는 서명되지 않으므로 앱 스토어에 제출할 수 없습니다. production build에 서명하려면 [Local app production](/guides/local-app-production)을 참고하세요.
-   **Android 전용**: SDK 54부터는 더 빠른 개발 반복을 위해 `--variant debugOptimized` variant를 전달할 수 있습니다. 자세한 내용은 [Compiling Android in Expo CLI reference](/more/expo-cli#compiling-android)를 참고하세요.

### 첫 번째 빌드 이후: `npx expo start` 사용하기

앱이 기기나 emulator에 컴파일 및 설치된 뒤에는 변경할 때마다 다시 빌드할 필요가 없습니다. JavaScript나 TypeScript 코드만 수정하는 경우에는 Metro bundler만 따로 시작하면 됩니다:

```sh
npx expo start
```

그다음 터미널에서 Android는 a, iOS는 i를 눌러 이미 설치된 앱을 실행하세요. Metro가 네이티브 코드를 다시 컴파일하지 않고 업데이트된 JavaScript bundle을 제공하므로, 앱은 수분이 아니라 수초 안에 로드됩니다.

| Command | What it does | When to use it |
| --- | --- | --- |
| `npx expo run:android` / `npx expo run:ios` | 네이티브 코드를 컴파일하고, 앱을 설치하고, Metro를 시작합니다. | 첫 번째 빌드, 네이티브 라이브러리를 추가한 뒤, 또는 config plugin을 수정한 뒤 |
| `npx expo start` | Metro bundler만 시작합니다. | JavaScript나 TypeScript 코드만 바꾸는 일상 개발 작업 |

첫 번째 빌드 이후에 프로젝트 설정이나 네이티브 코드를 수정하려면 `npx expo run:android|ios`를 다시 사용해 프로젝트를 재빌드해야 합니다. `npx expo prebuild`를 다시 실행하면 변경 사항을 기존 파일 위에 덧씌웁니다. 또한 빌드 이후에는 다른 결과를 만들 수도 있습니다.

이를 피하려면 새 프로젝트를 만들 때 네이티브 디렉터리가 자동으로 프로젝트의 **.gitignore**에 추가되며, `npx expo prebuild --clean` 명령을 사용할 수 있습니다. 이렇게 하면 프로젝트가 항상 managed 상태로 유지되고, [`--clean` flag](/workflow/continuous-native-generation#clean)는 기존 디렉터리를 삭제한 뒤 다시 생성합니다. [app config](/workflow/configuration)를 사용하거나 [config plugin](/config-plugins/introduction)을 만들어 프로젝트 설정이나 네이티브 디렉터리 내부 코드를 수정할 수 있습니다.

컴파일과 prebuild가 어떻게 동작하는지 더 알아보려면 다음 가이드를 참고하세요:

[Compiling with Expo CLI](/more/expo-cli#compiling) — Expo CLI가 run 명령을 사용해 앱을 로컬에서 어떻게 컴파일하는지, CLI에 전달할 수 있는 인수 등 더 많은 내용을 알아보세요. — run

[Prebuild](/workflow/continuous-native-generation) — Expo CLI가 컴파일 전에 프로젝트의 네이티브 코드를 어떻게 생성하는지 알아보세요.

## `expo-dev-client`를 사용한 로컬 빌드

프로젝트에 [`expo-dev-client`](/develop/development-builds/introduction)를 설치하면, 프로젝트의 디버그 빌드에 `expo-dev-client` UI와 tooling이 포함되며, 우리는 이를 development build라고 부릅니다.

```sh
npx expo install expo-dev-client
```

development build를 만들려면 [로컬 앱 컴파일](/guides/local-app-development#local-app-compilation) 명령(`npx expo run:[android|ios]`)을 사용할 수 있으며, 이 명령은 디버그 빌드를 만들고 development server도 함께 시작합니다.

## Android product flavor를 사용한 로컬 빌드

> 이 기능은 SDK 52 이상에서만 사용할 수 있습니다.

서로 다른 application ID를 사용하는 여러 product flavor가 있는 custom Android 프로젝트가 있다면, `npx expo run:android`가 올바른 flavor와 build type을 사용하도록 구성할 수 있습니다. Expo는 빌드와 실행 동작을 커스터마이즈하기 위해 `--variant`와 `--app-id`를 모두 지원합니다.

`--variant` 플래그는 Android build type을 **debug**에서 **release**로 전환할 수 있습니다. 이 플래그는 camelCase 형식으로 작성하면 product flavor와 build type도 함께 구성할 수 있습니다. 예를 들어 [**free**와 **paid** product flavor](https://developer.android.com/build/build-variants#change-app-id)가 모두 있다면, 다음과 같이 앱의 development 버전을 빌드할 수 있습니다:

```sh
npx expo run:android --variant freeDebug
npx expo run:android --variant paidDebug
```

`--app-id` 플래그는 커스텀 application id를 사용해 빌드 후 앱을 실행하는 데 사용할 수 있습니다. 예를 들어 product flavor **free**가 `applicationIdSuffix ".free"` 또는 `applicationId "dev.expo.myapp.free"`를 사용한다면, 다음과 같이 빌드하고 앱을 실행할 수 있습니다:

```sh
npx expo run:android --variant freeDebug --app-id dev.expo.myapp.free
```

> Android build type을 커스터마이즈하는 것도 가능하지만, 그러면 production에는 **release** build type을 사용한다는 Expo의 가정이 깨집니다. **release** 대신 다른 build type을 사용하면 앱 안에 최적화되지 않은 코드가 들어갈 수 있습니다.

## EAS를 사용한 로컬 빌드

[Run builds on your infrastructure](/build-reference/local-builds) — `--local` 플래그를 사용해 자체 인프라 또는 로컬 머신에서 EAS Build를 실행하는 방법을 알아보세요. — --local
