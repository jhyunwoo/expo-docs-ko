---
modificationDate: December 18, 2024
title: Facebook 인증 사용하기
description: react-native-fbsdk-next 라이브러리를 사용해 Expo 프로젝트에 Facebook 인증을 통합하는 가이드입니다.
---

# Facebook 인증 사용하기

react-native-fbsdk-next 라이브러리를 사용해 Expo 프로젝트에 Facebook 인증을 통합하는 가이드입니다.

[`react-native-fbsdk-next`](https://github.com/thebergamo/react-native-fbsdk-next/) 라이브러리는 Facebook의 Android 및 iOS SDK를 감싼 wrapper를 제공합니다. 이를 통해 Expo 프로젝트에 Facebook 인증을 통합하고 네이티브 컴포넌트에 접근할 수 있습니다.

이 가이드는 Android용으로 Expo와 함께 이 라이브러리를 구성하는 추가 정보를 제공합니다.

## 사전 요구 사항

`react-native-fbsdk-next` 라이브러리는 custom 네이티브 코드가 필요하므로 Expo Go 앱에서는 사용할 수 없습니다. 자세한 내용은 [앱에 custom 네이티브 코드 추가하기](/workflow/customizing)를 참고하세요.

## 설치

라이브러리를 설치하고 구성하는 방법은 `react-native-fbsdk-next` 문서를 참고하세요:

[React Native FBSDK Next: Expo 설치 지침](https://github.com/thebergamo/react-native-fbsdk-next/#expo-installation)

## Android용 구성

Facebook 프로젝트에 Android를 플랫폼으로 추가하려면, 앱이 올바른 Play Store URL을 갖고 앱과 연결된 [`package`](/versions/latest/config/app#package) 이름이 있도록 Google Play Store의 승인을 받아야 합니다. 그렇지 않으면 다음 오류가 발생합니다:

앱 스토어용으로 프로젝트를 빌드하는 방법은 다음 가이드를 참고하세요:

[앱 스토어용으로 프로젝트 빌드하기](/deploy/build-project)

[처음으로 Android 앱 수동 업로드하기](https://expo.fyi/first-android-submission)

앱을 Play Store에 업로드하면 앱 검토를 제출할 수 있습니다. 검토가 승인되면 Facebook 프로젝트가 Play Store URL에서 앱에 접근할 수 있게 됩니다.

그다음 Facebook 프로젝트의 **Settings** > **Basic**으로 이동해 **Android** 플랫폼을 추가하세요. 여기에는 Key hash, Package name, Class name을 제공해야 합니다.

-   Key hash를 추가하려면 Play Store Console에서 **Release** > **Setup** > **App Integrity** > **App signing key certificate**로 이동해 SHA-1 certificate fingerprint를 가져오세요. 그런 다음 [certificate의 Hex 값을 Base64로 변환](https://base64.guru/converter/encode/hex)하고 Facebook 프로젝트의 **Android** > **Key hashes** 아래에 추가하세요.
-   Package name은 [app config](/versions/latest/config/app)의 [`android.package`](/versions/latest/config/app#package) field에서 찾을 수 있습니다.
-   Class name은 기본적으로 `MainActivity`이며, 프로젝트 app config의 `android.package`를 `package`로 사용해 `package.MainActivity`를 사용할 수 있습니다. 예를 들어 앱의 `package` 이름이 `com.myapp.example`이라면 `com.myapp.example.MainActivity`가 됩니다.
-   그런 다음 **Save changes**를 클릭해 구성을 저장하세요.

이제 development build, release build, production 앱에서 Facebook 프로젝트를 사용할 수 있습니다.
