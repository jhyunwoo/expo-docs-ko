---
modificationDate: December 16, 2025
title: 기존 React Native 프로젝트에 expo-updates 설치하기
description: 기존 React Native 프로젝트에 expo-updates를 설치하고 설정하는 방법을 알아보세요.
---

# 기존 React Native 프로젝트에 expo-updates 설치하기

기존 React Native 프로젝트에 expo-updates를 설치하고 설정하는 방법을 알아보세요.

`expo-updates`는 앱이 애플리케이션 코드의 원격 업데이트를 관리할 수 있게 해주는 라이브러리입니다. 구성된 원격 업데이트 서비스와 통신하여 사용 가능한 업데이트 정보를 가져옵니다. 이 가이드는 `expo-updates` 라이브러리의 설치와 구성을 더 쉽게 해주는 호스팅형 원격 업데이트 서비스인 [EAS Update](/eas-update/introduction)와 함께 bare React Native 프로젝트를 설정하는 방법을 설명합니다.

프로젝트에서 Continuous Native Generation(CNG)을 사용하나요?

다른 가이드를 보고 있을 수도 있습니다. [CNG](/workflow/continuous-native-generation)를 사용하는 프로젝트에서 `expo-updates`를 사용하려면 [EAS Update "Get started"](/eas-update/getting-started)를 참고하세요.

## 사전 준비 사항

**`expo` 패키지가 설치되고 설정되어 있어야 합니다.** 프로젝트를 `npx @react-native-community/cli@latest init`으로 만들었고 다른 Expo 라이브러리가 하나도 설치되어 있지 않다면, 계속 진행하기 전에 [Expo modules 설치하기](/bare/installing-expo-modules)를 먼저 해야 합니다.

## 설치

시작하려면 `expo-updates`를 설치하세요:

```sh
npx expo install expo-updates
```

그다음 iOS용 pods를 설치하세요:

```sh
npx pod-install
```

## expo-updates 라이브러리 구성하기

아래 섹션의 diff 변경 사항을 적용해 프로젝트에서 `expo-updates`를 구성하세요.

### JavaScript 및 JSON

`eas update:configure`를 실행해 **app.json**에 `updates` URL과 `projectId`를 설정하세요.

```sh
eas update:configure
```

**app.json**의 `expo` 섹션을 수정하세요. 프로젝트를 `npx @react-native-community/cli@latest init`으로 만들었다면 [`updates` URL](/versions/latest/config/app#url)을 포함해 다음 변경 사항을 추가해야 합니다.

> 아래에 표시된 예시 `updates` URL과 `projectId`는 EAS Update와 함께 사용됩니다. EAS CLI는 `eas update:configure`를 실행할 때 EAS Update 서비스에 맞게 이 URL을 올바르게 설정합니다.

대신 [커스텀 `expo-updates` 서버](https://github.com/expo/custom-expo-updates-server)를 설정하고 싶다면 **app.json**의 `updates.url`에 여러분의 URL을 추가하세요.

```diff
"expo": {
  "name": "MyApp",
- "updates": {
- "url": "https://u.expo.dev/[your-project-id]"
- }
+ "updates": {
+ "url": "http://localhost:3000/api/manifest"
+ }
  }
  }
```

### Android

**android/app/build.gradle**을 수정해 Expo 파일에서 JS 엔진 구성(JSC 또는 Hermes)을 확인하도록 하세요:

**android/app/src/main/AndroidManifest.xml**을 수정해 **app.json**의 내용과 일치하도록 `expo-updates` 구성 XML을 추가하세요:

업데이트 서버 URL(같은 머신에서 실행되는 커스텀 비 HTTPS 업데이트 서버)을 사용하는 경우에는 **android/app/src/main/AndroidManifest.xml**을 수정해 업데이트 서버 URL을 추가하고 `usesCleartextTraffic`를 활성화해야 합니다:

Expo runtime version 문자열 키를 **android/app/src/main/res/values/strings.xml**에 추가하세요:

### iOS

**ios** 디렉터리에 **Podfile.properties.json** 파일을 추가하세요:

```json
{
  "expo.jsEngine": "hermes"
}
```

**ios/Podfile**을 수정해 Expo 파일에서 JS 엔진 구성(JSC 또는 Hermes)을 확인하도록 하세요:

Xcode를 사용해 **app.json**의 내용과 일치하도록 다음 내용을 가진 **Expo.plist** 파일을 **ios/your-project/Supporting**에 추가하세요:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>EXUpdatesCheckOnLaunch</key>
    <string>ALWAYS</string>
    <key>EXUpdatesEnabled</key>
    <true/>
    <key>EXUpdatesLaunchWaitMs</key>
    <integer>0</integer>
    <key>EXUpdatesRuntimeVersion</key>
    <string>1.0.0</string>
    <key>EXUpdatesURL</key>
    <string>http://localhost:3000/api/manifest</string>
  </dict>
</plist>
```

## 다음 단계

-   EAS Build와 함께 EAS Update를 사용하려면 EAS Update의 [Get started](/eas-update/getting-started)를 참고하세요.
-   라이브러리 사용 방법에 대한 자세한 내용은 [`expo-updates` API reference](/versions/latest/sdk/updates)를 참고하세요.
-   [EAS Update를 로컬 빌드와 직접 함께 사용하는 방법](/eas-update/standalone-service)도 확인해 보세요.
-   [Expo Updates protocol](/technical-specs/expo-updates-1)을 구현한 커스텀 서버와 함께 `expo-updates`를 사용하는 것도 가능합니다. [`custom-expo-updates-server` README](https://github.com/expo/custom-expo-updates-server#readme)를 참고하세요.
