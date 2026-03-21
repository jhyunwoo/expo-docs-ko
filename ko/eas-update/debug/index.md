---
modificationDate: March 05, 2026
title: EAS Update 디버깅
description: update 문제를 해결하기 위한 기본 디버깅 기법을 사용하는 방법을 알아보세요.
---

# EAS Update 디버깅

update 문제를 해결하기 위한 기본 디버깅 기법을 사용하는 방법을 알아보세요.

이 가이드는 게시한 update가 앱에 표시되지 않는 문제 같은 상황에서 원인을 찾을 수 있도록 구성을 검증하는 방법을 보여 줍니다. 어떤 시점이든 앱의 현재 상태를 파악하는 것이 중요하기 때문에, EAS Update는 이를 염두에 두고 설계되었습니다. 어떤 build에서 어떤 update가 실행 중인지 알게 되면, 앱이 기대하는 상태가 되도록 필요한 변경을 가할 수 있습니다.

[EAS Update 디버그하는 방법](https://www.youtube.com/watch?v=m9PLTr3t3S4) — 이 Expo 디버깅 튜토리얼에서는 build가 update를 받지 못하는 상황을 디버그하는 방법을 배웁니다.

  

> EAS Build를 사용하지 않는다면 Deployments 페이지는 비어 있게 됩니다. 대신 [EAS Build 없이 구성 디버깅하기](/eas-update/debug#configuration-without-eas-build) 가이드를 따르세요.

## Deployments 페이지로 이동하기

EAS 웹사이트에는 앱의 현재 상태를 보여 주는 [Deployments page](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/deployments)가 있습니다. _deployment_라는 용어는 build와 그에 대응하는 update의 그룹을 의미합니다. EAS로 build와 update를 만들었다면, 웹사이트의 Deployments 탭에서 프로젝트 상태를 확인할 수 있습니다.

## 일반적인 문제

아래 섹션은 흔히 발생하는 문제와 그 해결 방법을 설명합니다. 아래에는 EAS Update가 어떻게 동작하는지, 그리고 문제의 근본 원인을 찾을 때 어떤 지점을 검사하면 유용한지 보여 주는 다이어그램이 있습니다. 이어지는 섹션에서 이러한 지점과 그 밖의 사항을 점검하고 검증하게 됩니다.

### 예상과 다른 channel

deployment channel이 예상과 다르다면, build가 올바른 channel로 빌드되지 않았다는 의미입니다. 이를 해결하려면 [channel을 구성](/eas-update/debug#configure-channel)하고 앱을 다시 빌드하세요.

### 예상과 다른 runtime version

deployment runtime version이 예상과 다르다면, build가 올바른 runtime version으로 빌드되지 않았다는 의미입니다. 이를 해결하려면 [runtime version을 구성](/eas-update/debug#configure-runtime-version)하고 앱을 다시 빌드하세요.

### 예상과 다른 branch

deployment가 예상과 다른 branch를 가리킨다면, [channel을 올바른 branch에 매핑](/eas-update/debug#map-channel-to-branch)해야 합니다.

### 누락된 update

표시된 deployment에 update가 하나도 없습니다. 이를 해결하려면 [branch에 update를 게시](/eas-update/debug#publish-update)하세요. 이미 update를 게시했다면 [Updates page](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/updates)에서 build의 runtime version과 일치하는지 확인하세요.

### 누락된 branch

표시된 deployment는 올바른 channel을 갖고 있지만 branch와 연결되어 있지 않습니다. 이를 해결하려면 [channel을 올바른 branch에 매핑](/eas-update/debug#map-channel-to-branch)하세요.

### 누락된 deployment

deployment가 표시되지 않는다면, build가 EAS Update용으로 제대로 구성되지 않았다는 의미입니다. 이를 해결하려면 [channel을 구성](/eas-update/debug#configure-channel)하고, [runtime version을 구성](/eas-update/debug#configure-runtime-version)하고, [일반 구성을 검증](/eas-update/debug#verifying-app-configuration)하세요. 이런 변경을 한 뒤에는 앱을 다시 빌드해야 합니다.

### update 충돌 시 자동 롤백

Deployments 페이지에서 모든 것이 올바르게 보이는데도 앱이 여전히 이전 update나 build에 포함된 코드를 보여 준다면, 새 update의 코드가 충돌하고 있을 수 있습니다. 이는 앱이 새 update를 다운로드하고 적용한 뒤 root component가 렌더링되기 전에 새 update가 충돌할 때 발생할 수 있습니다.

EAS Update는 앱이 시작 직후 새 update가 충돌했다고 감지하면 자동으로 이전 update로 롤백하도록 설계되어 있습니다. 자세한 내용은 [EAS Update가 충돌을 감지하고 이전에 작동하던 버전으로 롤백하는 방법](/eas-update/error-recovery#explaining-the-error-recovery-flow)을 참고하세요.

update 충돌을 일으키는 오류를 진단하려면:

-   [runtime issue에 대한 Troubleshooting guide](/debugging/runtime-issues)를 참고해 오류를 식별하는 전략을 적용하세요.
-   오류를 식별한 뒤, 충돌을 해결하는 새 update를 게시하세요.

새 update는 동작하지 않는데 embedded code는 동작하는 흔한 이유 중 하나는 환경 변수가 빠져 있기 때문입니다. 자세한 내용은 [환경 변수가 EAS Update와 함께 동작하는 방식](/eas/environment-variables/usage#using-environment-variables-with-eas-update)을 참고하세요.

### Failed to load all assets

사용자에게 "Failed to load all assets" 오류가 보인다면, 앱이 manifest는 다운로드했지만 update 실행에 필요한 모든 asset을 다운로드하지 못했다는 의미입니다. asset이 원래 build에 포함되어 있지 않다면 다운로드가 필요합니다. 오류의 일반적인 원인은 다음과 같습니다:

-   update에 대용량 asset이 많이 추가되었고, 네트워크 문제로 앱이 이를 모두 다운로드하지 못함.
-   사용자 인터넷 연결 상태가 좋지 않음.
-   사용자가 EAS Update가 asset을 제공하는 데 사용하는 Cloudflare IP 주소를 차단하거나 속도 제한하는 국가에 있음.

asset 로딩 문제를 진단하려면:

-   [asset list](/eas-update/debug#viewing-all-assets-included-in-an-update)를 확인해 사용자가 어떤 asset을 다운로드하고 그 크기가 얼마인지 검증하세요.
-   자신의 기기에서 문제를 재현하고 네이티브 레이어에서 노출되는 `expo-updates` [logs entries](/versions/latest/sdk/updates#updatesreadlogentriesasyncmaxage)를 검사하세요.
-   Sentry 같은 서비스에 이 오류를 기록했다면, 오류를 겪은 사용자의 IP 주소를 확인하고 Cloudflare IP 주소를 차단하거나 속도 제한하는 것으로 알려진 국가인지 검증하세요.

## 해결 방법

### channel 구성하기

build가 특정 channel을 갖는지 검증하려면 **eas.json**의 build profile에 channel 속성이 있는지 확인하세요:

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "channel": "preview"
    },
    "production": {
      "channel": "production"
    }
  }
}
```

그다음 `eas build --profile preview` 같은 명령을 실행해 "preview"라는 이름의 channel을 가진 build를 만들 수 있습니다.

### runtime version 구성하기

runtime version을 검증하려면 app config(**app.json**/**app.config.js**)에 `runtimeVersion` 속성이 있는지 확인하세요:

```json
{
  "expo": {
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
}
```

기본값은 `{ "policy": "appVersion" }`이지만, [다른 policy나 특정 version을 사용](/eas-update/runtime-versions)하도록 runtime을 변경할 수 있습니다. 그다음 `eas build --profile preview` 같은 명령을 실행해 기대하는 runtime version을 가진 build를 만들 수 있습니다.

### channel을 branch에 매핑하기

channel이 기대하는 branch에 매핑되어 있지 않다면 다음 명령으로 연결을 변경할 수 있습니다:

```sh
eas channel:edit production --branch release-1.0
```

branch가 목록에 없다면 `eas branch:create`로 새 branch를 만들 수 있습니다.

### update 게시하기

update를 생성하고 게시하려면 다음 명령을 실행합니다:

```sh
eas update
```

게시가 끝나면 출력에 branch와 runtime version이 표시됩니다. 이 정보는 기대한 구성으로 update를 만들고 있는지 검증하는 데 도움이 됩니다.

## 일반 전략

이 가이드에서 설명하는 더 구체적인 방법을 사용하기 전에 아래 전략들을 먼저 시도해 보세요.

### `expo-dev-client` 사용하기

[build의 development version](/eas-update/expo-dev-client)을 만드세요. 문제가 있는 build 안에서 게시된 update를 미리 보는 데 도움이 됩니다.

### 앱 내부 디버깅

`expo-updates` 라이브러리는 앱이 이미 실행 중인 상태에서 update와 상호작용할 수 있는 다양한 함수를 export합니다. 어떤 경우에는 update를 가져오는 호출을 해 보고 오류 메시지를 확인하는 것만으로도 근본 원인을 좁히는 데 도움이 됩니다. 프로젝트의 simulator build를 만들고, 수동으로 update가 있는지 또는 가져오는 중 오류가 있는지 확인해 볼 수 있습니다.

-   구성을 검증하기 위해 [Update.Constants](/versions/latest/sdk/updates#constants)를 출력하세요.
-   네이티브 레이어에서 노출되는 [log entries](/versions/latest/sdk/updates#updatesreadlogentriesasyncmaxage)를 검사하세요.
-   [수동으로 update를 가져오고 로드](/versions/latest/sdk/updates#check-for-updates-manually)하세요.

## 구성 문제

[기본 가이드](/eas-update/debug)를 따랐는데도 앱이 여전히 기대한 update를 받지 못하고 있습니다.

### `expo-updates` 구성

`expo-updates` 라이브러리는 최종 사용자의 앱 안에서 실행되며, 최신 update를 받기 위해 update server로 요청을 보냅니다.

#### 앱 구성 검증하기

EAS Update를 설정할 때, 아마 `expo-updates`가 EAS Update와 동작하도록 `eas update:configure`를 실행했을 것입니다. 이 명령은 app config(**app.json**/**app.config.js**)를 변경합니다. 여기서 기대할 수 있는 필드는 다음과 같습니다:

-   `runtimeVersion`이 설정되어 있어야 합니다. 기본값은 `{ "policy": "appVersion" }`입니다. 프로젝트에 **android**와 **ios** 디렉터리가 있다면 `runtimeVersion`을 수동으로 설정해야 합니다.
-   `updates.url`은 `https://u.expo.dev/your-project-id` 같은 값이어야 하며, 여기서 `your-project-id`는 프로젝트 ID와 일치해야 합니다. 이 ID는 [웹사이트](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D)에서 확인할 수 있습니다.
-   `updates.enabled`는 `false`가 아니어야 합니다. 명시하지 않았다면 기본값은 `true`입니다.

마지막으로 **package.json**에 `expo-updates`가 포함되어 있는지 확인하세요. 없다면 다음을 실행하세요:

```sh
npx expo install expo-updates
```

#### prebuild 후 expo-updates 구성 검사하기

`eas build`를 실행할 때마다, EAS 서버에서는 네이티브 파일이 들어 있는 **android**와 **ios** 디렉터리를 풀어내기 위해 프로젝트에 `npx expo prebuild` 명령이 실행됩니다. 이 덕분에 EAS Build는 네이티브 파일이 있든 없든 어떤 프로젝트든 빌드할 수 있습니다.

프로젝트에 **android** 또는 **ios** 디렉터리가 없다면, 먼저 현재 변경 사항을 commit한 뒤 `npx expo prebuild`를 실행해 EAS Build가 다루게 될 프로젝트 상태를 점검할 수 있습니다. 이 명령을 실행한 후에는 **android/app/src/main/AndroidManifest.xml**과 **ios/your-project-name/Supporting/Expo.plist** 파일을 찾으세요.

각 파일에는 EAS Update URL과 runtime version 구성이 있어야 합니다. 각 파일에서 기대하는 속성은 다음과 같습니다:

```xml
... 
<meta-data android:name="expo.modules.updates.EXPO_RUNTIME_VERSION" android:value="your-runtime-version-here"/>
<meta-data android:name="expo.modules.updates.EXPO_UPDATE_URL" android:value="https://u.expo.dev/your-project-id-here"/>
...
```

```xml
... 
<key>EXUpdatesRuntimeVersion</key>
<string>your-runtime-version-here</string>
<key>EXUpdatesURL</key>
<string>https://u.expo.dev/your-project-id-here</string>
...
```

### EAS Build 없이 구성하기

EAS Build를 사용하지 않는다면, 이 섹션은 프로젝트 안에서 EAS Update 상태를 디버깅하는 과정을 안내합니다. 시스템의 여러 지점을 살펴봐야 합니다. 아래에는 EAS Update가 어떻게 동작하는지, 그리고 문제의 근본 원인을 찾을 때 어떤 지점이 유용한지 보여 주는 다이어그램이 있습니다. 이어지는 섹션에서 이 지점들과 그 밖의 항목을 점검하고 검증합니다.

#### build 구성 검증하기

[Building Locally guide](/eas-update/standalone-service)를 따라 앱의 channel과 runtime version을 구성하세요. 또한 [일반 구성](/eas-update/debug#expo-updates-configuration)이 올바른지도 확인해야 합니다.

#### channel 검증하기

build에는 `channel`이라는 속성이 있으며, EAS Update는 이를 사용해 branch와 연결합니다. channel은 흔히 여러 플랫폼별 build에 공통으로 부여됩니다. 예를 들어 Android build와 iOS build가 모두 `"production"`이라는 channel을 가질 수 있습니다.

build에 channel 이름이 지정되면, EAS 서버가 이를 알고 있는지 [Channels page](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/channels)에서 확인할 수 있습니다.

이 페이지에는 build가 가진 것과 같은 channel 이름이 표시되어야 합니다. 없다면 다음 명령으로 EAS 서버에 channel을 만들 수 있습니다:

```sh
eas channel:create production
```

#### channel/branch 매핑 검증하기

channel과 branch 사이에는 개발자가 정의한 연결이 있습니다. channel과 branch가 연결되면, 해당 channel을 가진 앱은 연결된 branch에서 가장 최신의 호환 가능한 update를 받게 됩니다.

[Channels page](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/channels)는 channel과 branch의 매핑이 존재할 경우 이를 표시합니다.

channel이 기대하는 branch에 연결되어 있지 않다면 다음 명령으로 연결을 바꿀 수 있습니다:

```sh
eas channel:edit production --branch release-1.0
```

#### update 검증하기

각 branch는 update 목록을 가지고 있습니다. build가 update를 요청하면, 먼저 build의 channel을 찾고 그 channel에 연결된 branch를 찾습니다. branch를 찾으면 EAS는 그 branch에 있는 가장 최신의 호환 가능한 update를 반환합니다. build와 update는 runtime version과 platform이 같을 때 호환됩니다.

branch에 어떤 update가 있는지 검사하려면 [Branches page](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/branches)로 이동해 관심 있는 branch를 선택하세요.

Branch Detail 페이지에는 update 목록과 각 update의 runtime version, platform이 표시됩니다. 이 목록을 보면 build의 runtime version과 platform을 update의 runtime version, platform과 맞춰서 어떤 update가 특정 build에 적용되어야 하는지 알 수 있습니다. 가장 최신이면서 호환되는 update를 build가 다운로드하고 실행할 수 있습니다.

## EAS Update 디버깅하기

`expo-updates`와 EAS Update 구성을 검증한 뒤에는, 프로젝트가 update와 어떻게 상호작용하는지 디버깅하는 단계로 넘어갈 수 있습니다.

### 앱 내부 디버깅

`expo-updates` 라이브러리는 앱이 이미 실행 중인 상태에서 update와 상호작용할 수 있는 다양한 함수를 export합니다. 어떤 경우에는 update를 가져오는 호출을 해 보고 오류 메시지를 확인하는 것만으로도 근본 원인을 좁히는 데 도움이 됩니다. 프로젝트의 simulator build를 만들고, 수동으로 update가 있는지 또는 가져오는 중 오류가 있는지 확인해 볼 수 있습니다. [수동으로 update 확인하기](/versions/latest/sdk/updates#use-expo-updates-with-a-custom-server) 코드 예제를 참고하세요.

### build를 수동으로 검사하기

프로젝트를 앱으로 빌드할 때는 `npx expo prebuild` 출력물을 바꾸는 여러 단계가 있을 수 있습니다. build를 만든 후에는 build 내용을 열어 네이티브 파일을 검사함으로써 최종 구성을 확인할 수 있습니다.

macOS에서 iOS Simulator build를 검사하는 단계는 다음과 같습니다:

1.  EAS Build를 사용해 앱의 iOS Simulator build를 만듭니다. 이를 위해 build profile에 `"ios": { "simulator": true }`를 추가합니다.
2.  build가 끝나면 결과물을 다운로드하고 압축을 풉니다.
3.  앱을 우클릭한 뒤 "Show Package Contents"를 선택합니다.
4.  그 안에서 **Expo.plist** 파일을 검사할 수 있습니다.

**Expo.plist** 파일 안에는 아래와 같은 구성이 있어야 합니다:

```xml
... 
<key>EXUpdatesRequestHeaders</key>
<dict>
  <key>expo-channel-name</key>
  <string>your-channel-name</string>
</dict>
<key>EXUpdatesRuntimeVersion</key>
<string>your-runtime-version</string>
<key>EXUpdatesURL</key>
<string>https://u.expo.dev/your-project-id</string>
...
```

### manifest를 수동으로 검사하기

EAS Update로 update를 게시하면 최종 사용자 앱이 요청하는 manifest를 생성합니다. manifest에는 update를 로드하는 데 필요한 asset과 version 같은 정보가 포함됩니다. 브라우저에서 특정 URL로 이동하거나 `curl`을 사용해 manifest를 검사할 수 있습니다.

프로젝트의 app config(**app.json**/**app.config.json**) 안에서 GET 요청할 URL은 `updates.url` 아래에 있습니다.

이 `url`은 EAS의 "[https://u.expo.dev](https://u.expo.dev)" 도메인 뒤에 EAS 서버상의 프로젝트 ID가 이어지는 형태입니다. URL로 직접 접근하면 header가 없다는 오류가 보입니다. manifest를 보려면 URL에 `runtime-version`, `channel-name`, `platform`이라는 세 개의 query parameter를 추가해야 합니다. 예를 들어 runtime version이 `1.0.0`, channel이 `production`, platform이 `android`인 update를 게시했다면, 접근할 전체 URL은 다음과 비슷합니다:

```text
https://u.expo.dev/your-project-id?runtime-version=1.0.0&channel-name=production&platform=android
```

### 네트워크 요청 보기

문제의 근본 원인을 식별하는 또 다른 방법은 앱이 EAS 서버로 보내는 네트워크 요청과 그 응답을 살펴보는 것입니다. 앱의 네트워크 요청을 관찰하려면 [Proxyman](https://proxyman.io/) 또는 [Charles Proxy](https://www.charlesproxy.com/) 같은 프로그램을 사용하는 것을 권장합니다.

두 프로그램 모두 HTTPS 요청을 해독할 수 있도록 SSL certificate를 설치하는 절차를 따라야 합니다. simulator나 실제 기기에 구성이 끝나면 앱을 열고 요청을 관찰할 수 있습니다.

우리가 관심 있게 봐야 하는 요청은 [https://u.expo.dev](https://u.expo.dev)와 [https://assets.eascdn.net](https://assets.eascdn.net)에서 오는 것입니다. [https://u.expo.dev](https://u.expo.dev)에서 온 응답에는 앱이 update 실행을 위해 어떤 asset을 가져와야 하는지 지정하는 update manifest가 포함됩니다. [https://assets.eascdn.net](https://assets.eascdn.net)에서 온 응답에는 이미지, font 파일 등 update 실행에 필요한 asset이 들어 있습니다.

[https://u.expo.dev](https://u.expo.dev)로 향하는 요청을 검사할 때는 다음 request header를 확인할 수 있습니다:

-   `Expo-Runtime-Version`: build와 update를 만들 때 사용한 runtime version과 같아야 합니다.
-   `expo-channel-name`: **eas.json** build profile에 지정한 channel 이름과 같아야 합니다.
-   `Expo-Platform`: "android" 또는 "ios"여야 합니다.

모든 요청에서 응답 코드는 `200`이거나, 변경 사항이 없다면 `304`를 기대할 수 있습니다.

아래는 성공적인 update manifest 요청의 예를 보여 주는 스크린샷입니다:

## Runtime issues

기대한 update는 로드되지만 프로젝트가 예상치 못한 동작을 보입니다.

### expo-updates를 통해 앱을 로드할 때 네이티브 코드 디버깅하기

기본적으로 `expo-updates`가 활성화되어 development server 대신 update를 로드하게 하려면 release build를 만들어야 합니다. debug build는 일반적인 React Native 프로젝트의 debug build처럼 동작하기 때문입니다.

production과 더 가까운 환경에서 네이티브 코드를 쉽게 테스트하고 디버그할 수 있도록, 아래 단계에 따라 `expo-updates`가 활성화된 앱의 debug build를 만드세요.

또한 release build 또는 debug build를 사용해 Android Studio나 Xcode에서 로컬 개발 환경으로 EAS Update를 빠르게 시험해 볼 수 있도록 [단계별 가이드](/eas-update/standalone-service)도 제공합니다.

#### Android 로컬 build

-   debug 환경 변수를 설정합니다: `export EX_UPDATES_NATIVE_DEBUG=1`
-   [원하는 channel이 **AndroidManifest.xml**에 설정되어 있는지 확인하세요](/eas-update/getting-started#configure-the-update-channel)
-   Android Studio 또는 command line에서 앱의 [debug build](/debugging/runtime-issues#native-debugging)를 실행합니다.

#### iOS 로컬 build

-   debug 환경 변수를 설정합니다: `export EX_UPDATES_NATIVE_DEBUG=1`
-   `npx pod-install`로 pod를 다시 설치합니다. 이제 `expo-updates` podspec이 이 환경 변수를 감지하여, 보통 Metro packager에서 로드하던 debug 코드를 우회하고 EAS에서 update를 로드하는 데 필요한 EXUpdates bundle과 기타 dependency를 포함해 앱을 빌드하도록 변경합니다.
-   [원하는 channel이 **Expo.plist**에 설정되어 있는지 확인하세요](/eas-update/getting-started#configure-the-update-channel)
-   debug와 release build 모두에서 애플리케이션 JavaScript를 강제로 번들하도록 Xcode 프로젝트 파일을 수정합니다:
    
    ```sh
    sed -i '' 's/SKIP_BUNDLING/FORCE_BUNDLING/g;' ios/.xcodeproj/project.pbxproj
    ```
    
-   Xcode 또는 command line에서 앱의 [debug build](/debugging/runtime-issues#native-debugging)를 실행합니다.

#### EAS Build

또는 `expo-updates`가 활성화된 debug build를 EAS로 만들 수도 있습니다. 환경 변수는 아래 예제처럼 **eas.json**에 설정합니다:

```json
{
  "build": {
    "preview_debug": {
      "env": {
        "EX_UPDATES_NATIVE_DEBUG": "1"
      },
      "android": {
        "distribution": "internal",
        "withoutCredentials": true,
        "gradleCommand": ":app:assembleDebug"
      },
      "ios": {
        "simulator": true,
        "buildConfiguration": "Debug"
      },
      "channel": "preview_debug"
    }
  }
}
```

## 게시 문제

update를 게시할 수 없거나, update의 일부가 기대한 대로 게시되지 않습니다.

### 최신 update를 로컬에서 검사하기

EAS Update로 update를 게시하면, 로컬 프로젝트 루트에 **/dist** 디렉터리가 생성되며 여기에는 update의 일부로 업로드된 asset이 포함됩니다.

### update에 포함된 모든 asset 보기

update bundle에 어떤 asset이 포함되어 있는지 확인하는 것이 도움이 될 수 있습니다. [Updates Detail](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/updates) 페이지에서 이름이 지정된 asset 목록을 볼 수 있습니다:

또는 로컬에서 다음을 실행하세요:

```sh
npx expo export
```

## 완화 단계

문제의 근본 원인을 찾고 나면 여러 완화 단계를 고려할 수 있습니다. 가장 흔한 문제 중 하나는 버그가 포함된 update를 게시하는 것입니다. 이런 경우 이전 update를 다시 게시해 문제를 해결할 수 있습니다.

### 이전 update 다시 게시하기

잘못된 게시를 가장 빨리 "되돌리는" 방법은 잘 작동하는 것으로 확인된 update를 다시 게시하는 것입니다. 예를 들어 branch에 두 개의 update가 있다고 가정해 봅시다:

```sh
branch: "production"
updates: [
update 2 (id: xyz2) "fixes typo"     // bad update
update 1 (id: abc1) "updates color"  // good update
]
```

"update 2"가 잘못된 update라는 것이 확인되었다면, 다음과 같은 명령으로 "update 1"을 다시 게시할 수 있습니다:

```sh
eas update:republish --group abc1
eas update:republish --branch production
```

위 예제 명령을 실행하면 branch는 다음과 같은 상태가 됩니다:

```sh
branch: "production"
updates: [
update 3 (id: def3) "updates color"  // re-publish of update 1 (id: abc1)
update 2 (id: xyz2) "fixes typo"     // bad update
update 1 (id: abc1) "updates color"  // good update
]
```

"update 3"이 이제 "production" branch에서 가장 최신 update가 되었으므로, 앞으로 update를 조회하는 모든 사용자는 잘못된 "update 2" 대신 "update 3"을 받게 됩니다.

이렇게 하면 새 사용자에게 잘못된 update가 보이는 일은 막을 수 있지만, 이미 잘못된 update를 받은 사용자는 최신 update를 다운로드할 때까지 그 버전을 계속 실행하게 됩니다. 모바일 네트워크는 항상 최신 update를 다운로드할 수 있는 것이 아니므로, 어떤 사용자는 오랫동안 잘못된 update를 실행할 수도 있습니다. 앱의 오류 로그를 볼 때, 사용자 앱이 최신 update나 build를 받을 때까지 한동안 오류가 길게 남아 있는 것은 정상입니다. 오류율이 크게 떨어지면 버그를 해결했다고 판단할 수 있지만, 여러 지역과 다양한 모바일 네트워크에 걸친 사용자 기반이 있다면 완전히 사라지지 않을 수도 있습니다.
