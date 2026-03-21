---
modificationDate: March 03, 2026
title: Permissions
description: app config 파일에서 permission을 설정하고 추가하는 방법을 알아보세요.
---

# Permissions

app config 파일에서 permission을 설정하고 추가하는 방법을 알아보세요.

사용자의 위치나 연락처처럼 기기 내 잠재적으로 민감한 정보에 접근해야 하는 native app을 개발할 때는, 앱이 먼저 사용자의 permission을 요청해야 합니다. 예를 들어 사용자의 media library에 접근하려면 앱이 [`MediaLibrary.requestPermissionsAsync()`](/versions/latest/sdk/media-library#medialibraryrequestpermissionsasync)를 실행해야 합니다.

standalone 및 [development build](/develop/development-builds/introduction)의 permission은 runtime JavaScript code로 요청하기 전에 native build 시점 설정이 필요합니다. [Expo Go](https://expo.dev/go) 앱에서 프로젝트를 테스트할 때는 이 과정이 필요하지 않습니다.

> native permission을 제대로 설정하거나 설명하지 않으면 **앱이 스토어에서 거절되거나 내려갈 수 있습니다**.

## Android

permission은 [`android.permissions`](/versions/latest/config/app#permissions) 및 [`android.blockedPermissions`](/versions/latest/config/app#blockedpermissions) 키를 [app config](/workflow/configuration)에서 사용해 설정합니다.

대부분의 permission은 [config plugins](/config-plugins/plugins#creating-a-config-plugin) 또는 패키지 수준 **AndroidManifest.xml**을 통해 앱에서 사용하는 라이브러리가 자동으로 추가합니다. 라이브러리에 기본 포함되지 않은 추가 permission을 넣고 싶을 때만 `android.permissions`를 사용하면 됩니다.

```json
{
  "android": {
    "permissions": ["android.permission.SCHEDULE_EXACT_ALARM"]
  }
}
```

패키지 수준 **AndroidManifest.xml** 파일이 추가한 permission을 제거하는 유일한 방법은 [`android.blockedPermissions`](/versions/latest/config/app#blockedpermissions) 속성으로 차단하는 것입니다. 이때는 **전체 permission 이름**을 지정해야 합니다. 예를 들어 `expo-camera`가 추가하는 audio recording permission을 제거하고 싶다면 다음과 같이 합니다:

```json
{
  "android": {
    "blockedPermissions": ["android.permission.RECORD_AUDIO"]
  }
}
```

-   [`android.permissions`](/versions/latest/config/app#permissions)를 참고해 기본 [prebuild template](/workflow/continuous-native-generation#templates)에 어떤 permission이 포함되는지 알아보세요.
-   정당한 사유 없이 _dangerous_ 또는 _signature_ permission을 사용하는 앱은 **Google에서 거절될 수 있습니다**. 앱을 제출할 때 [Android permissions best practices](https://developer.android.com/training/permissions/usage-notes)를 반드시 따르세요.
-   [사용 가능한 모든 Android `Manifest.permissions`](https://developer.android.com/reference/android/Manifest.permission).

기존 React Native 앱에서 이 라이브러리를 사용하고 있나요?

특정 permission을 제외하려면 **AndroidManifest.xml**을 수정하세요. `<use-permission>` 태그에 `tools:node="remove"` 속성을 추가하면, 라이브러리의 **AndroidManifest.xml**에 포함되어 있더라도 제거되도록 할 수 있습니다.

```xml
<manifest xmlns:tools="http://schemas.android.com/tools">
  <uses-permission tools:node="remove" android:name="android.permission.ACCESS_FINE_LOCATION" />
</manifest>
```

> permission에 `tools:node` 속성을 사용하려면 먼저 `<manifest>`에 `xmlns:tools` 속성을 정의해야 합니다.

## iOS

iOS 앱은 사용자에게 system permission을 요청할 수 있습니다. 예를 들어 기기의 camera를 사용하거나 사진에 접근하려면 Apple은 앱이 해당 데이터를 어떻게 사용하는지에 대한 설명을 요구합니다. 대부분의 패키지는 [config plugins](/config-plugins/introduction)을 통해 특정 permission에 대한 boilerplate reason을 자동으로 제공합니다. 하지만 App Store에서 승인을 받으려면 이러한 기본 메시지를 앱의 실제 사용 사례에 맞게 조정해야 할 가능성이 큽니다.

permission 메시지를 설정하려면 [`ios.infoPlist`](/versions/latest/config/app#infoplist) 키를 [app config](/workflow/configuration)에서 사용하세요. 예:

```json
{
  "ios": {
    "infoPlist": {
      "NSCameraUsageDescription": "This app uses the camera to scan barcodes on event tickets."
    }
  }
}
```

이러한 속성 중 다수는 해당 속성을 추가하는 라이브러리에 연결된 [config plugin](/config-plugins/introduction) 속성으로도 직접 설정할 수 있습니다. 예를 들어 [`expo-media-library`](/versions/latest/sdk/media-library)를 사용하면 사진 permission 메시지를 다음과 같이 설정할 수 있습니다:

```json
{
  "plugins": [
    [
      "expo-media-library",
      {
        "photosPermission": "Allow $(PRODUCT_NAME) to access your photos.",
        "savePhotosPermission": "Allow $(PRODUCT_NAME) to save photos."
      }
    ]
  ]
}
```

-   **Info.plist** 변경 사항은 over-the-air로 업데이트할 수 없으며, 새 native binary를 제출할 때만 배포됩니다. 예: [`eas build`](/build/introduction).
-   Apple의 공식 [permission message recommendations](https://developer.apple.com/design/human-interface-guidelines/privacy#Requesting-permission).
-   [사용 가능한 모든 **Info.plist** 속성](https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/CocoaKeys.html).

기존 React Native 앱에서 이 라이브러리를 사용하고 있나요?

permission 메시지 값을 **Info.plist** 파일에 직접 추가하고 수정하세요. 자동 완성을 위해 Xcode에서 직접 작업하는 것을 권장합니다.

## Web

웹에서는 `Camera`와 `Location` 같은 permission을 [secure context](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts#When_is_a_context_considered_secure)에서만 요청할 수 있습니다. 예를 들어 `https://` 또는 `http://localhost`를 사용해야 합니다. 이 제한은 Android의 manifest permission 및 iOS의 **Info.plist** usage message와 유사하며, 개인정보 보호를 강화하기 위해 적용됩니다.

## Resetting permissions

사용자가 permission을 거부했을 때 어떤 일이 일어나는지 테스트해 앱이 자연스럽게 반응하는지 확인하고 싶을 때가 많습니다. Android와 iOS 모두 운영체제 수준의 제한 때문에 앱은 같은 permission을 한 번 이상 요청할 수 없습니다(거부한 뒤에도 같은 permission 요청이 반복되면 사용자에게 얼마나 불편할지 생각해볼 수 있습니다). 개발 중 permission 관련 여러 흐름을 테스트하려면 native app을 삭제한 뒤 다시 설치해야 할 수 있습니다.

[Expo Go](https://expo.dev/go)에서 테스트할 때는 `npx expo start`를 실행한 뒤 [Expo CLI](/more/expo-cli) Terminal UI에서 i 또는 a를 눌러 앱을 삭제하고 다시 설치할 수 있습니다.
