---
modificationDate: January 20, 2026
title: Google 인증 사용하기
description: @react-native-google-signin/google-signin 라이브러리를 사용해 Expo 프로젝트에 Google 인증을 통합하는 가이드입니다.
---

# Google 인증 사용하기

@react-native-google-signin/google-signin 라이브러리를 사용해 Expo 프로젝트에 Google 인증을 통합하는 가이드입니다.

[`@react-native-google-signin/google-signin`](https://github.com/react-native-google-signin/google-signin) 라이브러리는 Expo 앱에 Google 인증을 통합하는 방법을 제공합니다. 또한 네이티브 로그인 버튼을 제공하고, 사용자를 인증하는 것뿐 아니라 Google API 사용 권한을 얻는 것도 지원합니다. 프로젝트에서는 [config plugin](/config-plugins/introduction)을 [app config](/versions/latest/config/app)에 추가해 이 라이브러리를 사용할 수 있습니다.

이 가이드는 프로젝트용으로 라이브러리를 구성하는 방법에 대한 정보를 제공합니다.

## 사전 요구 사항

`@react-native-google-signin/google-signin` 라이브러리는 custom 네이티브 코드가 필요하므로 Expo Go 앱에서는 사용할 수 없습니다. 자세한 내용은 [앱에 custom 네이티브 코드 추가하기](/workflow/customizing)를 참고하세요.

## 설치

라이브러리를 설치하고 구성하는 방법은 `@react-native-google-signin/google-signin` 문서를 참고하세요:

[React Native Google Sign In: Expo 설치 지침](https://react-native-google-signin.github.io/docs/setting-up/expo)

## Android와 iOS용 Google 프로젝트 구성하기

아래는 Android와 iOS용으로 Google 프로젝트를 구성하는 방법에 대한 지침입니다.

### 앱을 Google Play Store에 업로드하기

앱이 production에서 실행될 예정이라면 Google Play Store에 업로드하는 것을 권장합니다. 프로젝트가 아직 development 중이어도 테스트를 위해 스토어에 앱을 제출할 수 있습니다. 이렇게 하면 앱이 테스트용으로 EAS에 의해 서명되었을 때와, 스토어 배포용으로 [Google Play App Signing](https://support.google.com/googleplay/android-developer/answer/9842756?hl=en)에 의해 서명되었을 때 모두 Google Sign In을 테스트할 수 있습니다. 앱 제출 과정에 대해 더 알아보려면 아래 가이드를 제시된 순서대로 참고하세요:

[첫 번째 EAS Build 만들기](/build/setup)

[앱 스토어용으로 프로젝트 빌드하기](/deploy/build-project)

[처음으로 Android 앱 수동 업로드하기](https://expo.fyi/first-android-submission)

### Firebase 또는 Google Cloud Console 프로젝트 구성하기

> 더 자세한 구성 가이드는 [라이브러리 문서](https://react-native-google-signin.github.io/docs/setting-up/get-config-file)를 참고하세요.

Android의 경우, 앱을 업로드한 뒤 Firebase나 Google Cloud Console에서 프로젝트를 구성하는 동안 SHA-1 certificate fingerprint 값을 제공해야 합니다. 제공할 수 있는 값은 두 종류입니다:

-   빌드한 **.apk**의 fingerprint(직접 만든 것 또는 EAS Build로 만든 것). SHA-1 certificate fingerprint는 Google Play Console의 **Release** > **Setup** > **App Integrity** > **Upload key certificate**에서 찾을 수 있습니다.
-   Play Store에서 다운로드한 **production app**의 fingerprint. SHA-1 certificate fingerprint는 Google Play Console의 **Release** > **Setup** > **App Integrity** > **App signing key certificate**에서 찾을 수 있습니다.

### Firebase 사용하기

Firebase로 Android와 iOS용 프로젝트를 구성하는 방법에 대한 추가 지침은 다음을 참고하세요:

[Firebase](https://react-native-google-signin.github.io/docs/setting-up/expo#expo-and-firebase-authentication)

#### google-services.json과 GoogleService-Info.plist를 EAS에 업로드하기

Android와 iOS에서 Firebase 방식을 사용한다면(위 섹션들에서 공유한 방식), 앱을 빌드할 때 **google-services.json**과 **GoogleService-Info.plist**를 EAS에서 사용할 수 있도록 해야 합니다. 이 파일에는 민감한 값이 들어 있지 않아 repository에 포함해도 되지만, secret처럼 다루고 **.gitignore**에 추가한 뒤 아래 가이드를 사용해 EAS에서 사용할 수 있게 할 수도 있습니다.

[secret 파일을 EAS에 업로드하고 app config에서 사용하기](/eas/environment-variables/usage#using-environment-variables-with-eas-build)

### Google Cloud Console 사용하기

이 방법은 [Firebase](/guides/google-authentication#with-firebase)를 사용하지 않을 때 Google 프로젝트를 구성하는 대체 방법입니다.

Google Cloud Console을 사용해 Android와 iOS용 Google 프로젝트를 구성하는 방법에 대한 추가 지침은 다음을 참고하세요:

[Firebase 없이 Expo 사용하기](https://react-native-google-signin.github.io/docs/setting-up/expo#expo-without-firebase)
