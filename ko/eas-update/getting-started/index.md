---
modificationDate: March 05, 2026
title: EAS Update 시작하기
description: 프로젝트에서 EAS Update를 구성하고 사용하는 데 필요한 설정을 시작하는 방법을 알아보세요.
---

# EAS Update 시작하기

프로젝트에서 EAS Update를 구성하고 사용하는 데 필요한 설정을 시작하는 방법을 알아보세요.

EAS Update를 설정하면 사용자가 즉시 필요로 하는 치명적인 버그 수정과 개선 사항을 푸시할 수 있습니다. 이 가이드는 새 프로젝트 또는 기존 프로젝트에서 EAS Update를 설정하는 과정을 안내합니다.

> EAS Update를 EAS Build와 함께 사용할 계획이라면, 여기로 진행하기 전에 [EAS Build 설정 가이드](/build/setup)를 먼저 따르는 것을 권장합니다. 다만 [다른 어떤 EAS 서비스 없이도 EAS Update를 사용할 수 있습니다](/eas-update/standalone-service).

## 사전 준비

Expo 사용자 계정

EAS Update는 EAS 요금을 지불하는지, Free 플랜을 사용하는지와 관계없이 Expo 계정만 있으면 누구나 사용할 수 있습니다. [expo.dev/signup](https://expo.dev/signup)에서 가입할 수 있습니다.

유료 구독자는 더 많은 사용자에게 update를 게시할 수 있고, 더 많은 대역폭과 저장소를 사용할 수 있습니다. 다양한 플랜과 혜택에 대해서는 [EAS pricing](https://expo.dev/pricing)에서 자세히 알아보세요.

React Native 프로젝트

아직 프로젝트가 없나요? 문제없습니다. 이 가이드와 함께 사용할 수 있는 "Hello world" 앱은 빠르고 쉽게 만들 수 있습니다.

새 프로젝트를 만들려면 다음 명령을 실행하세요:

```sh
npx create-expo-app@latest my-app --template default@sdk-55
```

EAS Update는 `npx create-react-native-app`, `npx react-native`, `ignite-cli` 및 기타 프로젝트 부트스트래핑 도구로 만든 프로젝트와도 잘 작동합니다.

프로젝트는 Expo CLI를 사용하고 Expo Metro Config를 확장해야 합니다

이미 `npx expo [command]`로 프로젝트를 실행하고 있다면(예를 들어 `npx create-expo-app`으로 생성한 경우), 준비가 끝난 상태입니다.

아직 프로젝트에 `expo` 패키지가 없다면, 아래 명령을 실행해 설치하고 [Expo CLI 및 Metro Config 사용을 활성화](/bare/installing-expo-modules#configure-expo-cli-for-bundling-on-android-and-ios)하세요:

```sh
npx install-expo-modules@latest
```

명령이 실패하면 [Expo modules 설치](/bare/installing-expo-modules#manual-installation) 가이드를 참고하세요.

프로젝트는 `registerComponent` 대신 `registerRootComponent` 함수를 사용해야 합니다

`npx create-expo-app`으로 프로젝트를 만들었거나, 앱에서 `registerRootComponent`를 전혀 직접 호출하지 않는다면(예: Expo Router가 처리하는 경우), 이미 준비가 끝난 상태입니다. 아래 내용은 React Native Community CLI 같은 다른 도구로 만든 프로젝트에 해당합니다.

EAS Update를 사용하는 앱은 React Native의 `registerApplication` 대신 Expo의 [`registerRootComponent`](/versions/latest/sdk/expo#registerrootcomponentcomponent)를 사용하는 것을 권장합니다. 그래야 update에 포함된 image 같은 asset을 로드할 수 있도록 Expo가 React Native를 구성할 수 있습니다. `registerRootComponent`를 사용하지 않으면 release build에서 asset을 사용할 수 없을 수 있습니다.

React Native Community CLI로 만든 단순한 앱에서는 diff가 다음과 같을 것입니다:

```diff
- import {AppRegistry} from 'react-native';
- import {name as appName} from './app.json';
+ import {registerRootComponent} from 'expo';
  import App from './App';
- AppRegistry.registerComponent(appName, () => App);
+ export default registerRootComponent(App);
```

이 변경을 한 뒤에는 [`MainActivity`](/versions/latest/sdk/expo#rootregistercomponent-setup-for-existing-react-native-projects)와 [`AppDelegate`](/versions/latest/sdk/expo#rootregistercomponent-setup-for-existing-react-native-projects)를 업데이트해 앱 이름 대신 module name `"main"`을 사용하도록 하세요.

## 최신 EAS CLI 설치하기

EAS CLI는 터미널에서 EAS 서비스와 상호작용할 때 사용할 command line 앱입니다. 설치하려면 다음 명령을 실행하세요:

```sh
npm install --global eas-cli
```

위 명령은 새 버전의 EAS CLI가 있는지 확인하는 데도 사용할 수 있습니다. 항상 최신 버전을 유지하는 것을 권장합니다.

> 전역 패키지 설치에는 `yarn`보다 `npm`을 사용하는 것을 권장합니다. 대안으로 `npx eas-cli@latest`를 사용할 수도 있습니다. 문서에서 `eas`를 사용하는 부분이 나오면 그 대신 이 명령을 사용해야 한다는 점을 기억하세요.

## Expo 계정에 로그인하기

이미 Expo CLI를 통해 Expo 계정에 로그인되어 있다면 이 섹션의 단계는 건너뛰어도 됩니다. 로그인되어 있지 않다면 다음 명령을 실행해 로그인하세요:

```sh
eas login
```

`eas whoami`를 실행해 로그인 여부를 확인할 수 있습니다.

## 프로젝트 구성하기

터미널에서 프로젝트 디렉터리로 이동한 뒤 다음 명령을 실행하세요:

```sh
eas update:configure
```

이 명령은 무엇을 하나요?

`eas update:configure` 명령은 **app.json** 파일에 `runtimeVersion`과 `updates.url` 속성을 추가하고, 프로젝트가 이전에 어떤 EAS 서비스도 사용하지 않았다면 `extra.eas.projectId` 필드도 추가합니다.

[CNG](/workflow/continuous-native-generation)를 사용하지 않는 프로젝트에서 `eas update:configure`를 실행하면, native 프로젝트에 다음과 같은 변경이 보입니다:

#### Android

**android/app/src/main/AndroidManifest.xml** 파일 안에 다음 항목이 추가됩니다:

```xml
<meta-data android:name="expo.modules.updates.EXPO_UPDATE_URL" android:value="https://u.expo.dev/your-project-id"/>
<meta-data android:name="expo.modules.updates.EXPO_RUNTIME_VERSION" android:value="@string/expo_runtime_version"/>
```

`EXPO_UPDATE_URL` 값에는 프로젝트의 ID가 포함되어 있어야 합니다.

**android/app/src/main/res/values/strings.xml** 안에서는 `resources` 객체에 `expo_runtime_version` string 항목이 추가된 것을 볼 수 있습니다:

#### iOS

**ios/project-name/Supporting/Expo.plist** 안에서는 다음 항목이 추가됩니다:

```xml
<key>EXUpdatesRuntimeVersion</key>
<string>1.0.0</string>
<key>EXUpdatesURL</key>
<string>https://u.expo.dev/your-project-id</string>
```

`EXUpdatesURL` 값에는 프로젝트의 ID가 포함되어 있어야 합니다.

> Xcode를 사용해 project build를 만든다면, `Expo.plist` 파일이 [Xcode project에 추가되어 있는지](https://developer.apple.com/documentation/xcode/managing-files-and-folders-in-your-xcode-project#Add-existing-files-and-folders-to-a-project) 확인하세요.

## update channel 구성하기

build의 channel 속성은 update를 특정 유형의 build로 보낼 수 있게 해 줍니다. 예를 들어 production 배포에 영향을 주지 않으면서 preview build에 update를 게시할 수 있습니다.

**EAS Build를 사용 중이라면**, `eas update:configure`는 **eas.json**의 `preview` 및 `production` profile에 update `channel` 속성을 설정합니다. 다른 profile 이름을 사용한다면 직접 설정하세요.

eas.json의 예시 channel 구성

```json
{
  "build": {
    "preview": {
      "channel": "preview"
      // ...
    },
    "production": {
      "channel": "production"
      // ...
    }
  }
}
```

**EAS Build를 사용하지 않는다면**, [CNG](/workflow/continuous-native-generation)를 사용하는지 여부에 따라 **app.json** 또는 native project에서 channel을 구성해야 합니다. 다른 환경용 build를 만들 때는 build가 올바른 channel에서 update를 가져오도록 channel을 수정해야 합니다. 자세한 내용은 [독립형 서비스로 EAS Update 사용하기](/eas-update/standalone-service)를 참고하세요.

app.json에서 update channel 구성하기

Continuous Native Generation(CNG)을 사용한다면 **app.json**의 `updates.requestHeaders` 속성으로 channel을 구성할 수 있습니다:

```json
{
  "expo": {
    ... 
    "updates": {
      ... 
      "requestHeaders": {
        "expo-channel-name": "your-channel-name"
      }
      ... 
    }
    ... 
  }
}
```

이 구성은 다음에 `npx expo prebuild`를 실행할 때 적용됩니다.

Android native project에서 update channel 구성하기

**AndroidManifest.xml**에서는 프로젝트에 맞는 channel로 `your-channel-name`을 바꿔 다음 항목을 추가해야 합니다:

```xml
<meta-data android:name="expo.modules.updates.UPDATES_CONFIGURATION_REQUEST_HEADERS_KEY" android:value="{"expo-channel-name":"your-channel-name"}"/>
```

iOS native project에서 update channel 구성하기

**Expo.plist**에서는 프로젝트에 맞는 channel로 `your-channel-name`을 바꿔 다음 항목을 추가해야 합니다:

```xml
<key>EXUpdatesRequestHeaders</key>
<dict>
  <key>expo-channel-name</key>
  <string>your-channel-name</string>
</dict>
```

> Xcode를 사용해 project build를 만든다면, `Expo.plist` 파일이 [Xcode project에 추가되어 있는지](https://developer.apple.com/documentation/xcode/managing-files-and-folders-in-your-xcode-project#Add-existing-files-and-folders-to-a-project) 확인하세요.

## 프로젝트용 build 만들기

Android 또는 iOS용 build를 하나 만들어야 합니다. 먼저 `preview` build profile로 build를 만드는 것을 권장합니다. 시작 방법은 [첫 번째 build 만들기](/build/setup)를 참고하고, 기기 또는 simulator를 위한 [Internal distribution](/build/internal-distribution#setting-up-internal-distribution)도 함께 설정하세요.

기기나 simulator에서 build를 실행할 수 있게 되면 update를 보낼 준비가 된 것입니다.

## 로컬에서 변경하기

build를 만든 뒤에는 프로젝트를 반복적으로 개선할 준비가 됩니다. 다음 명령으로 로컬 development server를 시작하세요:

```sh
npx expo start
```

그런 다음 프로젝트의 JavaScript, styling 또는 image asset에 원하는 변경을 만드세요.

## update 게시하기

update를 게시하면 다음이 가능해집니다:

-   새 build를 만들지 않고도 버그를 수정하고 프로젝트의 비네이티브 부분을 빠르게 업데이트하기
-   internal distribution을 사용해 [앱의 preview 버전 공유하기](/review/overview)

프로젝트의 변경 사항으로 update를 게시하려면 `eas update` 명령을 사용하고, channel 이름과 update를 설명하는 `message`, 그리고 사용할 [EAS environment variables](/eas/environment-variables)를 지정하기 위한 `--environment` 플래그(SDK 55 이상에서 필수)를 지정하세요:

```sh
eas update --channel [channel-name] --message "[message]" --environment [environment-name]
```

update를 게시하면 어떻게 동작하나요?

`eas update` 명령으로 update를 게시하면 새 update bundle을 생성해 EAS 서버에 업로드합니다. channel 이름은 다른 update branch들 가운데 새 update를 게시할 올바른 branch를 찾는 데 사용됩니다. 이는 모든 commit이 Git branch 위에 있는 Git commit 동작과 비슷합니다.

예를 들어 앱이 `preview` channel에서 update를 가져오도록 설정되어 있다면, `eas update --channel preview`로 해당 build용 update를 게시할 수 있습니다. 그러면 `preview` channel에 (기본적으로 `preview`라는 이름의) branch가 생성됩니다. 내부적으로 이 명령은 `npx expo export`를 실행해 **dist** 디렉터리를 생성하고 로컬 update bundle을 만듭니다. 이 update bundle이 EAS Update 서버에 업로드됩니다.

[EAS Update 동작 방식 심층 가이드](/eas-update/how-it-works) — EAS Update가 어떻게 동작하는지 더 깊이 이해해 보세요.

## update 테스트하기

update가 EAS Update에 업로드되면 다음 방법 중 하나로 테스트할 수 있습니다:

-   [development build](/eas-update/expo-dev-client)의 Extensions 탭을 사용해 update 로드하기
-   [Expo Orbit](/review/with-orbit)를 사용해 development build에서 update 설치 및 실행하기
-   [Updates API](/versions/latest/sdk/updates)와 [app config](/versions/latest/config/app#updates)를 사용해 앱에서 프로그래밍 방식으로 update를 로드하는 custom 전략 구현하기
-   앱의 release build를 최대 두 번 강제 종료했다가 다시 열어 update를 수동으로 테스트하기. non-development build(preview 또는 production)용 update는 앱이 시작되어 새 update 요청을 보낼 때 기기 백그라운드에서 자동으로 다운로드됩니다. update는 다운로드가 끝나고 앱이 다시 시작되면 적용됩니다.

뭔가 동작하지 않나요?

앱이 기대한 대로 update되지 않는다면 구성 검증 기법을 설명하는 [디버깅 가이드](/eas-update/debug)를 참고하세요.

## 다음 단계

[update 미리보기](/eas-update/preview) — QA와 테스트를 위해 update를 공유해 빠르게 반복 작업하는 방법을 알아보세요.

[update 배포하기](/eas-update/deployment) — EAS Update를 사용할 때 프로젝트에 적용할 수 있는 다양한 배포 패턴을 알아보세요.
