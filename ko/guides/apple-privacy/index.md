---
modificationDate: May 01, 2025
title: Privacy manifest
description: 모바일 앱을 위한 iOS privacy manifest를 구성하는 방법을 알아보세요.
---

# Privacy manifest

모바일 앱을 위한 iOS privacy manifest를 구성하는 방법을 알아보세요.

"restricted reason" API를 사용하는 native iOS 라이브러리를 사용 중이라면, 그 API를 호출하는 native code를 앱에 포함하는 이유를 선언하기 위해 iOS privacy manifest를 구성해야 합니다.

자세한 내용과 "required reason" API 목록은 [Apple Developer Documentation](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files)에서 확인할 수 있습니다.

> 이 가이드에 포함된 정보와 단계는 아직 개발 중이며, 이 목적을 위한 새 도구가 만들어지거나 Apple의 새로운 요구 사항이 생기면 바뀔 수 있습니다.

## Privacy manifest란 무엇인가요?

privacy manifest는 iOS native 프로젝트에 포함되는 **PrivacyInfo.xcprivacy**라는 파일입니다. 이 파일은 Apple이 민감하다고 간주하는 특정 API를 호출하는 native code를 앱이 왜 포함하는지 선언하는 데 사용됩니다.

현재 이러한 API에는 UserDefaults 접근, 파일 timestamp, system boot time, 디스크 공간, 활성 keyboard 접근이 포함됩니다. Apple은 이를 향후 확장될 수 있는 열린 목록으로 간주합니다.

## app config에서의 구성

app config의 `expo.ios` 아래에 있는 `privacyManifests` field를 사용해 iOS privacy manifest를 포함할 수 있습니다.

```json
{
  "expo": {
    "name": "My App",
    "slug": "my-app",
    ... 
    "ios": {
      "privacyManifests": {
        "NSPrivacyAccessedAPITypes": [
          {
            "NSPrivacyAccessedAPIType": "NSPrivacyAccessedAPICategoryUserDefaults",
            "NSPrivacyAccessedAPITypeReasons": ["CA92.1"]
          }
        ]
      }
    }
  }
}
```

`npx expo install --fix`를 사용해 Expo SDK 버전에 맞는 최신 버전으로 Expo SDK 라이브러리를 업데이트했는지 확인하세요.

기존 React Native 앱에서 이 라이브러리를 사용하고 있나요?

Xcode를 사용해 **PrivacyInfo.xcprivacy** 파일을 만들고 iOS app target에 추가하면 bare Expo 앱에 iOS privacy manifest를 포함할 수 있습니다. **PrivacyInfo.xcprivacy** 파일을 만드는 방법은 [Apple의 Privacy manifest files](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files) 가이드를 따르세요.

[Apple Developer documentation](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api)을 보면 `NSPrivacyAccessedAPITypes`와 `NSPrivacyAccessedAPITypeReasons` 값을 식별할 수 있습니다.

### Expo SDK package 및 기타 third-party library에 필요한 이유 포함하기

현재 Apple은 static CocoaPods dependency(Expo SDK package 및 기타 ecosystem library 등)에 포함된 모든 **PrivacyInfo** 파일을 올바르게 파싱하지 못합니다. 해당 dependency가 사용하는 API에 대한 required reason을 앱의 **PrivacyInfo.xcprivacy** 파일 또는 **app.json**의 구성에 포함해야 할 수도 있습니다.

"required reason" API 파일을 사용하는 모든 Expo SDK package는 package 디렉터리에 **PrivacyInfo** 파일이 포함되어 있습니다. 예를 들어 `expo-application` 라이브러리에는 [이 예시 파일](https://github.com/expo/expo/blob/main/packages/expo-application/ios/PrivacyInfo.xcprivacy)이 포함되어 있습니다.

보통 다른 third-party library가 사용하는 API의 required reason은, 사용하려는 라이브러리의 **node_modules/package_name/ios** 디렉터리에 **PrivacyInfo.xcprivacy** 파일이 있는지 확인해 알 수 있습니다. 파일이 있다면 그 안의 `NSPrivacyAccessedAPITypes`와 `NSPrivacyAccessedAPITypeReasons` 값을 확인하고 그 값을 여러분의 구성으로 복사할 수 있습니다.

다른 방법으로는 privacy manifest 파일이나 특정 reason이 누락된 build를 제출한 뒤 Apple이 개발자에게 알리도록 둘 수 있습니다. Apple에서 알림 이메일을 받을 때까지 기다린 다음, 이메일에 나열된 required reason을 앱의 **PrivacyInfo.xcprivacy** 파일에 포함할 수 있습니다. [CNG](/workflow/continuous-native-generation)를 사용하지 않는 경우에 해당합니다. 또는 **app.json** 파일의 구성에 포함할 수도 있습니다.

## Privacy manifest 테스트하기

앱을 빌드하고 제출해 privacy manifest를 테스트할 수 있습니다. App Store review process를 통해 제출하거나 TestFlight의 external review에 제출하면 됩니다. 앱이 사용하는 API에 필요한 reason이 누락된 경우, Apple은 제출 후 몇 분 안에 이메일을 보내 알려줍니다.
