---
modificationDate: October 08, 2025
title: Android Emulator 및 기기용 APK 빌드하기
description: EAS Build를 사용할 때 Android Emulator와 기기에 설치할 .apk를 구성하고 설치하는 방법을 알아보세요.
---

# Android Emulator 및 기기용 APK 빌드하기

EAS Build를 사용할 때 Android Emulator와 기기에 설치할 .apk를 구성하고 설치하는 방법을 알아보세요.

EAS Build로 Android 앱을 빌드할 때 기본 파일 형식은 [Android App Bundle](https://developer.android.com/platform/technology/app-bundle)(AAB/**.aab**)입니다. 이 형식은 Google Play Store 배포에 최적화되어 있습니다. 하지만 AAB는 기기에 직접 설치할 수 없습니다. Android 기기나 emulator에 직접 빌드를 설치하려면 대신 [Android Package](https://en.wikipedia.org/wiki/Android_application_package)(APK/**.apk**)를 빌드해야 합니다.

## APK를 빌드하도록 프로필 구성하기

**.apk**를 생성하려면 build profile 안에서 [**eas.json**](/build/eas-json)에 다음 속성 중 하나를 추가하세요:

-   `developmentClient`를 `true`로 설정 (**default**)
-   `distribution`을 `internal`로 설정
-   `android.buildType`을 `apk`로 설정
-   `android.gradleCommand`를 `:app:assembleRelease`, `:app:assembleDebug`, [`:app:assembleDebugOptimized`](/more/expo-cli#compiling-android)(SDK 54 이상에서 사용 가능), 또는 **.apk**를 생성하는 다른 Gradle 명령으로 설정

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "preview2": {
      "android": {
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "preview3": {
      "developmentClient": true
    },
    "preview4": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

이제 다음 명령으로 빌드를 실행할 수 있습니다:

```sh
eas build -p android --profile preview
```

프로필 이름은 원하는 대로 정할 수 있다는 점을 기억하세요. 여기서는 `preview`라는 이름을 사용했지만, `local`, `emulator`, 또는 여러분에게 가장 의미 있는 이름을 사용해도 됩니다.

## 빌드 설치하기

### Emulator(가상 기기)

> 아직 Android Emulator를 설치하거나 실행해 본 적이 없다면 계속 진행하기 전에 [Android Studio emulator guide](/workflow/android-studio-emulator)를 따라 하세요.

빌드가 완료되면 CLI가 Android Emulator에 자동으로 다운로드하고 설치할지 묻습니다. 프롬프트가 표시되면 `Y`를 눌러 emulator에 바로 설치하세요.

빌드가 여러 개 있는 경우 언제든 `eas build:run` 명령을 실행해 특정 빌드를 다운로드하고 Android Emulator에 자동 설치할 수도 있습니다:

```sh
eas build:run -p android
```

이 명령은 프로젝트에서 사용 가능한 빌드 목록도 함께 보여 줍니다. 이 목록에서 emulator에 설치할 빌드를 선택할 수 있습니다. 목록의 각 빌드에는 build ID, 빌드 생성 이후 경과 시간, build number, version number, git commit 정보가 포함됩니다. 프로젝트에 invalid build가 있는 경우 목록에 함께 표시됩니다.

예를 들어 아래 이미지는 한 프로젝트의 빌드 목록을 보여 줍니다:

빌드 설치가 끝나면 홈 화면에 표시됩니다. development build라면 터미널 창을 열고 `npx expo start` 명령을 실행해 개발 서버를 시작하세요.

#### 최신 빌드 실행하기

`eas build:run` 명령에 `--latest` 플래그를 전달하면 최신 빌드를 다운로드해 Android Emulator에 설치할 수 있습니다:

```sh
eas build:run -p android --latest
```

### 실제 기기

#### 기기로 직접 다운로드하기

-   빌드가 완료되면 build details 페이지나 `eas build` 완료 시 제공되는 링크에서 APK URL을 복사하세요.
-   그 URL을 기기로 보내세요. 이메일로 보내도 되고, 방법은 자유입니다.
-   기기에서 URL을 열고 APK를 설치한 뒤 실행하세요.

#### `adb`로 설치하기

-   아직 설치하지 않았다면 [adb 설치하기](https://developer.android.com/studio/command-line/adb)를 참고하세요.
-   기기를 컴퓨터에 연결하고 아직 하지 않았다면 [기기에서 adb debugging 활성화](https://developer.android.com/studio/command-line/adb#Enabling)하세요.
-   빌드가 완료되면 build details 페이지나 `eas build` 완료 시 제공되는 링크에서 APK를 다운로드하세요.
-   `adb install path/to/the/file.apk`를 실행하세요.
-   기기에서 앱을 실행하세요.
