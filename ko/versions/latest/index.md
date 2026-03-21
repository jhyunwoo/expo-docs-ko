---
title: Expo SDK 레퍼런스
description: Expo SDK 패키지를 사용해 Expo 및 React Native 앱에서 device와 system 기능에 접근하세요.
---

# Expo SDK 레퍼런스

Expo SDK 패키지를 사용해 Expo 및 React Native 앱에서 device와 system 기능에 접근하세요.

Expo SDK는 camera, contacts, location, sensors, haptics 등 device와 system 기능에 접근할 수 있게 해주는 패키지 모음입니다. 각 패키지는 특정 기능을 대상으로 하며 독립적으로 사용할 수 있습니다. 모든 패키지는 `expo` 패키지가 설치된 모든 React Native 앱에서 동작합니다.

어떤 Expo SDK 패키지든 [`npx expo install`](/more/expo-cli#install) 명령으로 설치할 수 있습니다. 예를 들어 아래 명령은 세 개의 서로 다른 패키지를 설치합니다:

```sh
npx expo install expo-camera expo-contacts expo-sensors
```

하나 이상의 패키지를 설치한 뒤에는 JavaScript 코드에서 이를 import할 수 있습니다:

```js
import { CameraView } from 'expo-camera';
import * as Contacts from 'expo-contacts';
import { Gyroscope } from 'expo-sensors';
```

이렇게 하면 [`Contacts.getContactsAsync()`](/versions/latest/sdk/contacts#contactsgetcontactsasynccontactquery)를 작성해 device의 연락처를 읽고, gyroscope sensor를 읽어 device 움직임을 감지하거나, 휴대폰 camera를 시작해 사진을 찍을 수 있습니다.

## 모든 Expo SDK 패키지는 어떤 React Native 앱에서도 동작합니다

Expo 앱은 React Native 앱이므로, `expo` 패키지가 설치되고 구성되어 있다면 모든 Expo SDK 패키지는 어떤 React Native 앱에서도 동작합니다. Expo SDK 패키지를 지원하는 React Native 앱을 가장 쉽게 만드는 방법은 `create-expo-app`을 사용하는 것입니다. 하지만 `npx install-expo-modules` 명령으로 기존 React Native 앱에 Expo SDK 지원을 추가할 수도 있습니다.

```sh
npx create-expo-app my-app --template bare-minimum
```

[기존 React Native 앱에 Expo SDK 패키지 설치하기](/bare/installing-expo-modules) — `npx @react-native-community/cli@latest init`으로 만든 프로젝트를 Expo SDK 패키지에 맞게 구성하는 방법을 더 알아보세요. — npx @react-native-community/cli@latest init

[라이브러리 사용하기](/workflow/using-libraries) — 프로젝트에 Expo SDK 패키지를 설치하는 방법을 알아보세요.

## pre-release 버전 사용하기

새 Expo SDK 버전은 매년 세 번 릴리스됩니다. 이 릴리스 사이에는 `expo` 패키지와 모든 Expo SDK 패키지의 pre-release 버전을 게시합니다. pre-release는 안정 버전으로 간주되지 않으며, 버그나 다른 문제를 만날 위험을 감수할 수 있는 경우에만 사용해야 합니다.

### Canary 릴리스

Canary 릴리스는 게시 시점의 `main` branch 상태를 스냅샷으로 나타냅니다. Canary 패키지 버전 이름에는 `-canary`가 포함되며, `55.0.0-canary-20260121-a63c0dd`처럼 날짜와 commit hash도 함께 포함됩니다. 최신 canary 릴리스를 설치하려면:

```sh
npm install expo@canary && npx expo install --fix
```

안정된 Expo SDK 릴리스와 함께 개별 패키지의 pre-release 버전을 사용할 수 있는 경우가 많습니다. 다만 canary 품질의 릴리스에서는 가끔 호환성 문제나 다른 문제가 생길 수 있습니다. canary 패키지를 선택적으로 사용하기로 했고, 그것이 여러분의 사용 사례에서 잘 동작하는지 확인했다면 [dependency validation warnings를 숨기고 싶을 수도 있습니다](/more/expo-cli#configuring-dependency-validation).

### Beta 릴리스

각 Expo SDK 릴리스 전에 `expo` 패키지와 모든 Expo SDK 패키지의 beta 버전을 게시합니다. Beta 릴리스는 canary 릴리스보다 훨씬 더 안정적인 것으로 간주되며, 개발자들이 자신의 앱에서 사용해 보고 피드백을 공유해 주길 권장합니다. Beta 릴리스는 npm에서 `beta` 태그를 사용하며 관련 [changelog](https://expo.dev/changelog) 게시물의 안내를 따릅니다.

## 각 Expo SDK 버전은 특정 React Native 버전에 의존합니다

| Expo SDK version | React Native version | React version | React Native Web version | React Native TV version | Minimum Node.js version |
| --- | --- | --- | --- | --- | --- |
| 55.0.0 | 0.83 | 19.2.0 | 0.21.0 | 0.83-stable | 20.19.x |
| 54.0.0 | 0.81 | 19.1.0 | 0.21.0 | 0.81-stable | 20.19.x |
| 53.0.0 | 0.79 | 19.0.0 | 0.20.0 | 0.79-stable | 20.18.x |

### 추가 정보

React Native 릴리스를 추적하는 Expo SDK 정책

-   Expo SDK 버전은 매년 세 번 릴리스되며, 각 Expo SDK 릴리스는 하나의 React Native 버전을 대상으로 합니다. 이는 보통 릴리스 시점의 최신 안정 버전입니다.
-   React Native의 릴리스 주기는 역사적으로 변동이 있었고, 현재는 2025년에 여섯 번 릴리스되는 속도로 진행되고 있습니다. 이 속도가 유지되는 동안에는 두 번의 React Native 릴리스마다 하나의 Expo SDK 버전이 나온다고 기대할 수 있습니다.
-   다음 Expo SDK의 pre-release 버전은 최신 React Native 버전을 빠르게 지원하며, 보통 릴리스된 당일에 지원이 포함됩니다. Expo SDK 팀 구성원 한 명이 매 릴리스마다 React Native 릴리스 팀에서도 함께 일하며, Expo 저장소의 React Native 버전을 지속적으로 업데이트하고, 호환성을 검증하며, 회귀 문제를 Meta 팀에 보고하는 역할을 맡고 있습니다.

왜 React Native가 새로 릴리스될 때마다 즉시 새 Expo SDK 버전을 내놓지 않나요?

Expo에서는 매년 세 번 major version을 릴리스하는 것이 오픈 소스 도구에 의존하는 개발자들에게 안정성과 혁신 사이에서 좋은 균형을 제공한다고 판단했습니다. Expo와 Meta는 릴리스 과정에서 긴밀히 협력하고 있으며, 최신 Expo와 React Native 기능을 가능한 한 빠르게 전달하기 위해 계속 프로세스를 개선해 나갈 것입니다.

최신 React Native 버전의 변경 사항이 필요한데 아직 Expo SDK 릴리스에 포함되지 않았다면 어떻게 하나요?

우리는 Meta 팀과 긴밀히 협력하여 긴급한 수정 사항이 최신 Expo SDK가 사용하는 React Native 버전에 포함되도록 하고 있습니다. 만약 여러분의 이슈가 더 특수하거나 breaking change를 포함하기 때문에 기존 릴리스에 cherry-pick되지 않는다면, 두 가지 선택지가 있습니다:

1.  수정 사항을 가져오기 위해 [`patch-package`](https://github.com/ds300/patch-package)를 사용합니다.
2.  [Expo SDK의 pre-release 버전](/versions/latest#using-pre-release-versions)을 사용합니다. ([예시](https://expo.dev/changelog/react-native-78)).

최신 Expo SDK와 함께 이전 React Native 버전을 사용할 수 있나요?

Expo SDK의 패키지는 해당 SDK가 대상으로 하는 React Native 버전을 지원하도록 설계되어 있습니다. 보통은 더 오래된 React Native 버전을 지원하지 않지만, 가능할 수도 있습니다. 새로운 React Native 버전이 릴리스되면, Expo SDK 패키지의 최신 버전도 일반적으로 이를 지원하도록 업데이트됩니다. 하지만 릴리스의 변경 범위에 따라 몇 주 이상 걸릴 수도 있습니다.

## Android 및 iOS 버전 지원

각 Expo SDK 버전은 Android와 iOS의 최소 OS 버전을 지원합니다. Android의 경우 앱을 컴파일할 때 사용할 Android SDK 버전을 [Gradle](https://developer.android.com/studio/build)에 알려 주는 `compileSdkVersion`이 정의됩니다. 이는 또한 해당 SDK 버전과 이전 버전들에 포함된 Android API 기능을 사용할 수 있다는 뜻이기도 합니다. iOS의 경우 앱을 컴파일할 때 사용할 최소 Xcode SDK 버전을 [Xcode](https://developer.apple.com/news/upcoming-requirements/)가 알려 줍니다.

| Expo SDK version | Android version | `compileSdkVersion` | `targetSdkVersion` | iOS version | Xcode version |
| --- | --- | --- | --- | --- | --- |
| 55.0.0 | 7+ | 36 | 36 | 15.1+ | 26.2+ |
| 54.0.0 | 7+ | 36 | 36 | 15.1+ | 16.1+ |
| 53.0.0 | 7+ | 35 | 35 | 15.1+ | 16.0+ |

어떤 Expo SDK 버전으로 업그레이드할지 결정할 때는 위 표에 설명된 것처럼 Expo의 SDK 버전과 앱 스토어 제출 요구 사항을 모두 고려해야 합니다. Google Play Store와 Apple App Store는 새 앱 제출에 필요한 최소 OS 버전과 API 레벨을 주기적으로 상향합니다. Expo는 앱 스토어 요구 사항을 통제할 수 없으므로, 현재 스토어 제출 요구 사항은 [Google](https://developer.android.com/studio/build)과 [Apple](https://developer.apple.com/news/upcoming-requirements/)에서 직접 확인해야 합니다.
