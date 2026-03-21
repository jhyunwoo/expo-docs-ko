---
modificationDate: March 09, 2026
title: Android용 cloud build 만들고 실행하기
description: EAS Build를 사용해 Android 디바이스와 emulator를 위한 development build를 설정하는 방법을 알아봅니다.
---

# Android용 cloud build 만들고 실행하기

EAS Build를 사용해 Android 디바이스와 emulator를 위한 development build를 설정하는 방법을 알아봅니다.

이 장에서는 EAS Build를 사용해 Android에서 실행할 수 있는 development build를 만들어 보겠습니다.

Android 디바이스와 emulator에서 build를 만들고 실행하는 과정은 동일하며, 차이는 development build를 설치하는 부분에만 있습니다.

[시청하기: Android용 cloud build 만들고 실행하는 방법](https://www.youtube.com/watch?v=D612BUtvvl8) — EAS Build로 Android development build를 만들고 디바이스 또는 emulator에 설치하는 방법을 알아봅니다.

## development profile용 build 만들기

Android에서는 development build가 **.apk** 형식이어야 합니다. 기본 Android 형식은 Google Play Store 배포에 적합한 **.aab**이지만, 디바이스나 emulator에는 설치할 수 없습니다.

**.apk**를 만들려면:

-   **eas.json**에서 `build.development` profile 아래의 `developmentClient`가 `true`로 설정되어 있는지 확인합니다.
    
-   그런 다음 `android`를 platform으로, `development`를 build profile로 지정해 `eas build` 명령어를 실행합니다:
    
    ```sh
    eas build --platform android --profile development
    ```
    
    > **Tip**: 다음부터 `eas build` 명령을 실행할 때는 platform 지정에 `-p`도 사용할 수 있습니다. `--platform`의 축약형입니다.
    

이 명령은 다음 질문을 표시합니다:

-   **What would you like your Android application id to be?** 이 프롬프트에서 제공되는 기본값을 선택하려면 return을 누르세요. 그러면 **app.json**에 [`android.package`](/versions/latest/config/app#package)가 추가됩니다.
-   **Generate a new Android Keystore**? Y를 누르세요.

응답을 마치면 build가 queue에 들어가고, EAS CLI가 제공하는 링크를 통해 EAS dashboard에서 진행 상황을 추적할 수 있습니다:

build details 페이지에는 어떤 정보가 있나요?

build details 페이지는 build type, profile, Expo SDK version, app version, version code, 마지막 commit hash, 그리고 build를 시작한 개발자 또는 계정 소유자의 정보를 표시합니다.

위 이미지에서 **Build artifact**의 현재 상태는 build가 진행 중임을 보여줍니다. 완료되면 이 섹션에 build를 다운로드할 수 있는 옵션이 제공됩니다. **Logs**는 EAS Build에서 Android build 과정 중 수행된 모든 단계를 보여줍니다. 간결함을 위해 여기서는 각 단계를 자세히 살펴보지 않겠습니다. 더 자세한 내용은 [Android build process](/build-reference/android-builds)를 참고하세요.

Android application ID란 무엇인가요?

Android 앱의 package name이라고도 하며, 값은 DNS reverse notation 형식(`com.owner.appname`)으로 저장됩니다. 이 표기법의 각 구성 요소는 소문자로 시작해야 합니다.

예를 들어 예제 앱은 `com.owner.stickersmash`를 사용하며, 여기서 `com.owner`는 도메인이고 `stickersmash`는 앱 이름입니다.

## Android 디바이스

### development build 설치하기

build가 완료되면 **Build artifact** 섹션이 업데이트되어 build가 완료되었음을 보여줍니다:

이 섹션은 Android 디바이스에서 development build를 실행할 수 있는 방법으로 Expo Orbit과 Install 버튼을 제공합니다.

[Expo Orbit](https://expo.dev/orbit)는 Android 디바이스에 development build를 매끄럽게 설치할 수 있게 해줍니다. 이 방법을 사용하려면:

-   Android 디바이스를 USB로 로컬 머신에 연결합니다.
-   Orbit menu bar 앱을 엽니다.
-   Orbit 앱에서 **Device**를 선택합니다.

-   EAS dashboard의 **Build artifact** 아래에서 **Open with Orbit**를 클릭합니다.

build가 설치되면 Orbit 앱이 디바이스에서 development build를 실행합니다.

대안: Install 버튼과 QR 코드 사용하기

**Build artifact**의 **Install** 버튼은 설치용 QR 코드를 생성합니다:

-   **Install**을 클릭해 QR 코드가 있는 팝업을 표시합니다.

-   Android 디바이스의 카메라로 QR 코드를 스캔해 기본 웹 브라우저에서 build 링크를 엽니다.
-   웹페이지에서 **Install** 버튼을 탭해 **.apk** 파일을 다운로드합니다.
-   다운로드가 끝나면 **.apk**를 열어 설치 과정을 시작합니다.
-   **Unsafe app blocked message**가 나타나면 **Install anyway**를 선택합니다. **.apk**의 출처(우리가 생성한 것)는 신뢰할 수 있으므로 이 경고는 안전하게 무시해도 됩니다.

### development build 실행하기

프로젝트 디렉터리에서 `npx expo start`를 실행해 development server를 시작합니다. 서버가 실행되면 터미널 창에서 a를 눌러 프로젝트를 엽니다:

```sh
npx expo start
```

## Android Emulator

### development build 설치하기

터미널에서 build가 완료되면 EAS CLI가 Android Emulator에서 build를 실행할지 묻습니다. Y를 누르세요.

대안: Expo Orbit 사용하기

또는 설치를 위해 [Expo Orbit](/build/orbit)을 사용할 수 있습니다. EAS dashboard의 **Build artifact**에서 **Open with Expo Orbit**를 클릭해 Android Emulator에 development build를 설치합니다.

### development build 실행하기

프로젝트 디렉터리에서 `npx expo start`를 실행해 development server를 시작합니다. 서버가 실행되면 터미널 창에서 a를 눌러 프로젝트를 엽니다:

```sh
npx expo start
```

## 요약

2장: Android용 cloud build 만들고 실행하기

EAS Build를 사용해 Android 디바이스와 emulator에서 development build를 성공적으로 만들고 실행했으며, **.apk**와 **.aab** 파일 형식에 대해서도 배웠습니다.

다음 장에서는 EAS Build를 사용해 iOS Simulator용 development build를 설정하고 실행하는 방법을 알아봅니다.

[다음: iOS Simulator용 cloud build 만들고 실행하기](/tutorial/eas/ios-development-build-for-simulators)
