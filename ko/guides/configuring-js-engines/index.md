---
modificationDate: October 06, 2025
title: JS engine 구성하기
description: Expo 프로젝트에서 Android와 iOS용 JS engine을 구성하는 가이드입니다.
---

# JS engine 구성하기

Expo 프로젝트에서 Android와 iOS용 JS engine을 구성하는 가이드입니다.

JavaScript engine은 애플리케이션 코드를 실행하며 메모리 관리, 최적화, 오류 처리 같은 다양한 기능을 제공합니다. 기본적으로 Expo 프로젝트는 JavaScript engine으로 [Hermes](https://hermesengine.dev/)를 사용합니다. Android와 iOS 플랫폼에서는 JSC나 V8 같은 다른 engine으로 전환할 수 있습니다. 하지만 웹은 JavaScript engine이 웹 브라우저에 포함되어 있으므로 전환할 수 없습니다.

## app config를 통해 `jsEngine` 구성하기

> SDK 52부터는 Expo Go에서 JS engine 변경을 사용할 수 없습니다(Hermes engine만 사용 가능). 이 커스터마이징을 사용하려면 [development build](/develop/development-builds/introduction)가 필요합니다.

Hermes는 React Native 앱을 위해 특별히 만들어지고 최적화되었으며, 가장 뛰어난 디버깅 경험을 제공하므로 이를 권장합니다. 서로 다른 JavaScript engine의 tradeoff를 잘 알고 있고 Hermes 외 다른 engine으로 바꾸고 싶다면, [`jsEngine`](/versions/latest/config/app#jsengine) field를 [app config](/workflow/configuration) 안에서 사용해 앱의 JavaScript engine을 지정할 수 있습니다. 기본값은 `hermes`입니다.

JSC를 대신 사용하려면 app config의 `jsEngine` field를 다음과 같이 설정하세요:

```json
{
  "expo": {
    "jsEngine": "jsc"
  }
}
```

bare React Native 프로젝트에서의 사용

bare React Native 프로젝트에서 JavaScript engine을 변경하려면 **android/gradle.properties**와 **ios/Podfile.properties.json**의 `expo.jsEngine` 값을 업데이트하세요.

JS engine을 변경하면 정상적으로 동작하도록 `eas build`로 development build를 다시 컴파일해야 한다는 점을 꼭 기억하세요.

## V8 engine 사용하기

V8 engine을 사용하려면 React Native에 V8 runtime 지원을 추가하는 opt-in package인 [`react-native-v8`](https://github.com/Kudo/react-native-v8)를 설치해야 합니다. 다음 명령으로 설치할 수 있습니다:

```sh
npx expo install react-native-v8 v8-android-jit
```

app config에서 `jsEngine` field는 제거해야 합니다.

Expo Prebuild와 함께 사용하는 경우

설치 후 다시 prebuild하려면 `npx expo prebuild -p android --clean`을 실행하세요.

## 특정 플랫폼에서 JavaScript engine 전환하기

하나의 특정 플랫폼에서만 다른 engine을 사용하려면 최상위에 `"jsEngine"` 값을 설정한 다음, `"android"` 또는 `"ios"` key 아래에서 다른 값으로 덮어쓸 수 있습니다. 플랫폼에 지정한 값이 공통 field보다 우선합니다.

```json
{
  "expo": {
    "jsEngine": "hermes",
    "ios": {
      "jsEngine": "jsc"
    }
  }
}
```
