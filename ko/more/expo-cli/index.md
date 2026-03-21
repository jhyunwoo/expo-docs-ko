---
modificationDate: March 07, 2026
title: Expo CLI
description: Expo CLI는 개발자와 다른 Expo 도구 사이의 주요 인터페이스 역할을 하는 명령줄 도구입니다.
---

# Expo CLI

Expo CLI는 개발자와 다른 Expo 도구 사이의 주요 인터페이스 역할을 하는 명령줄 도구입니다.

`expo` 패키지는 앱 개발 중 빠르게 작업을 이어갈 수 있도록 설계된 작고 강력한 CLI 도구 `npx expo`를 제공합니다.

## 주요 기능

-   앱 개발용 [서버 시작](/more/expo-cli#develop): `npx expo start`.
-   프로젝트용 네이티브 Android 및 iOS 디렉터리 [생성](/more/expo-cli#prebuild): `npx expo prebuild`.
-   네이티브 앱을 로컬에서 [빌드하고 실행](/more/expo-cli#compiling): `npx expo run:ios` 및 `npx expo run:android`.
-   프로젝트의 `react-native` 버전에 맞는 패키지 [설치 및 업데이트](/more/expo-cli#install): `npx expo install package-name`.
-   `npx expo`는 `npx react-native`와 동시에 사용할 수 있습니다.

Expo CLI에서 사용 가능한 명령 목록을 보려면 프로젝트에서 다음 명령을 실행하세요.

```sh
npx expo -h
```

> 패키지 매니저로 yarn을 쓰고 싶다면 `yarn expo -h`를 실행해도 됩니다.

출력은 다음과 비슷하게 표시됩니다.

```sh
Usage
  $ npx expo <command>

Commands
  start, export
  run:ios, run:android, prebuild
  install, customize, config
  login, logout, whoami, register

Options
  --version, -v   Version number
  --help, -h      Usage info
```

모든 명령은 `--help` 또는 `-h` 플래그와 함께 실행해 더 자세히 알아볼 수 있습니다.

```sh
npx expo login -h
```

## 설치

Expo CLI는 `expo` 패키지에 포함되어 있습니다. npm 또는 yarn으로 설치할 수 있습니다.

```sh
yarn add expo
```

> [Expo Prebuild](/more/expo-cli#prebuild)를 사용하지 않는 프로젝트(일반적으로 _Bare projects_라고도 부름)는 모든 Expo 커스텀 번들링 기능이 올바르게 작동하도록 추가 설정이 필요합니다. 자세한 내용은 [Metro: Bare workflow setup](/versions/latest/config/metro#bare-workflow-setup)을 참고하세요.

## 개발

프로젝트 작업을 위해 개발 서버를 시작하려면 다음을 실행하세요.

```sh
npx expo start
```

> `npx expo`를 `npx expo start`의 별칭으로 실행할 수도 있습니다.

이 명령은 클라이언트가 번들러와 상호작용할 수 있도록 `http://localhost:8081`에 서버를 시작합니다. 기본 번들러는 [Metro](https://metrobundler.dev/)입니다.

프로세스에 표시되는 UI를 **Terminal UI**라고 합니다. 여기에는 QR 코드(개발 서버 URL용)와 누를 수 있는 키보드 단축키 목록이 포함됩니다.

| Keyboard shortcut | Description |
| --- | --- |
| A | 연결된 Android 기기에서 프로젝트를 엽니다. |
| Shift + A | 열 Android 기기 또는 에뮬레이터를 선택합니다. |
| I | iOS Simulator에서 프로젝트를 엽니다. |
| Shift + I | 열 iOS Simulator를 선택합니다. |
| W | 웹 브라우저에서 프로젝트를 엽니다. 프로젝트에 webpack 설치가 필요할 수 있습니다. |
| R | 연결된 모든 기기에서 앱을 다시 로드합니다. |
| S | Expo Go와 development build 사이에서 실행 대상을 전환합니다. |
| M | 연결된 모든 네이티브 기기에서 dev menu를 엽니다(웹은 지원되지 않음). |
| Shift + M | 연결된 기기에서 실행할 추가 명령을 선택합니다. 여기에는 performance monitor 토글, element inspector 열기, 기기 다시 로드, dev menu 열기가 포함됩니다. |
| J | JavaScript 엔진으로 Hermes를 사용하는 연결된 기기의 React Native DevTools를 엽니다. [자세히 알아보기](/guides/using-hermes#javascript-inspector-for-hermes). |
| O | 에디터에서 프로젝트 코드를 엽니다. `EXPO_EDITOR` 및 `EDITOR` [environment variables](/more/expo-cli#environment-variables)로 설정할 수 있습니다. |
| E | 터미널에 개발 서버 URL을 QR 코드로 표시합니다. |
| ? | 모든 Terminal UI 명령을 표시합니다. |

### 실행 대상

`expo-dev-client`가 프로젝트에 설치되어 있으면 `npx expo start` 명령은 자동으로 development build에서 앱을 실행합니다. 그렇지 않으면 Expo Go에서 앱을 실행합니다.

또는 다음 플래그를 명령에 전달해 실행 대상을 강제로 지정할 수 있습니다.

-   `--dev-client`: 항상 development build에서 앱을 실행합니다.
-   `--go`: 항상 Expo Go에서 앱을 실행합니다.

런타임 중에도 **Terminal UI**에서 S를 눌러 실행 대상을 전환할 수 있습니다. `run` 명령도 development build를 컴파일한 뒤 기본적으로 `--dev-client`를 사용합니다.

### 서버 URL

기본적으로 프로젝트는 LAN 연결로 제공됩니다. `npx expo start --localhost` 플래그를 사용하면 이 동작을 localhost 전용으로 바꿀 수 있습니다.

다른 사용 가능한 옵션은 다음과 같습니다.

-   `--port`: 개발 서버를 시작할 포트입니다(webpack 또는 [tunnel URLs](/more/expo-cli#tunneling)에는 적용되지 않음). `--port 0`을 사용하면 사용 가능한 첫 번째 포트를 자동으로 사용합니다. 기본값: **8081**.
-   `--https`: **(`--tunnel` 권장으로 인해 Deprecated)** 보안 origin을 사용해 개발 서버를 시작합니다. 현재는 웹에서만 지원됩니다.

`EXPO_PACKAGER_PROXY_URL` 환경 변수로 URL을 원하는 값으로 강제할 수 있습니다. 예를 들면 다음과 같습니다.

```sh
export EXPO_PACKAGER_PROXY_URL=http://expo.dev
npx expo start
```

이 경우 앱은 `exp://expo.dev:80`으로 열립니다(`:80`은 Android WebSockets를 위한 임시 우회책입니다).

#### 터널링

제한적인 네트워크 환경(공용 Wi-Fi에서 흔함), 방화벽(Windows 사용자에게 흔함), 또는 Emulator 설정 문제 때문에 원격 기기를 lan/localhost를 통해 개발 서버에 연결하기 어려울 수 있습니다.

인터넷에 접속 가능한 모든 기기에서 접근할 수 있는 프록시 URL을 통해 개발 서버에 연결하는 편이 더 쉬울 때가 있는데, 이를 **터널링**이라고 합니다. `npx expo start`는 [ngrok](https://ngrok.com)을 통한 **터널링**을 내장 지원합니다.

터널링을 활성화하려면 먼저 `@expo/ngrok`를 설치하세요.

```sh
npm i -g @expo/ngrok
```

그런 다음 다음 명령으로 개발 서버를 _tunnel_ URL로 시작합니다.

```sh
npx expo start --tunnel
```

이렇게 하면 앱이 `https://xxxxxxx.bacon.19000.exp.direct:80` 같은 공개 URL로 제공됩니다.

`EXPO_TUNNEL_SUBDOMAIN` 환경 변수를 사용하면 실험적으로 터널 URL의 서브도메인을 지정할 수 있습니다. 이는 iOS에서 universal link 테스트에 유용합니다. 하지만 `expo-linking` 및 Expo Go와 예상치 못한 문제를 일으킬 수 있습니다. 사용할 정확한 서브도메인은 `true`, `false`, `1`, `0` 중 하나가 아닌 `string` 값으로 지정하세요.

**단점**

-   요청이 공개 URL로 전달되어야 하므로 터널링은 로컬 연결보다 느립니다.
-   터널 URL은 공개되어 있어 네트워크 연결이 있는 모든 기기에서 접근할 수 있습니다. Expo CLI는 URL 앞부분에 entropy를 추가해 노출 위험을 완화합니다. entropy는 프로젝트의 **.expo** 디렉터리를 지우면 초기화할 수 있습니다.
-   터널은 양쪽 기기 모두 네트워크 연결이 필요하므로, 이 기능은 `--offline` 플래그와 함께 사용할 수 없습니다.

터널링은 서드파티 호스팅 서비스가 필요하므로 `ngrok tunnel took too long to connect` 또는 `Tunnel connection has been closed. This is often related to intermittent connection problems with the Ngrok servers...` 같은 간헐적인 문제가 발생할 수 있습니다. 이슈를 보고하기 전에 [Ngrok 장애](https://status.ngrok.com/)가 없는지 꼭 확인하세요. 일부 Windows 사용자는 Ngrok가 정상적으로 동작하도록 백신 설정을 수정해야 했다고도 보고했습니다.

#### 오프라인

`--offline` 플래그를 사용하면 네트워크 연결 없이 개발할 수 있습니다.

```sh
npx expo start --offline
```

offline 모드는 CLI가 네트워크 요청을 보내지 않도록 합니다. 플래그를 사용하지 않더라도 컴퓨터에 인터넷 연결이 없다면 offline 지원이 자동으로 활성화되지만, 연결 가능 여부를 확인하는 데 약간 더 오래 걸릴 수 있습니다.

Expo CLI는 Expo Go 같은 재사용 가능한 런타임에서 민감한 정보가 sandboxed되도록 manifest를 사용자 자격 증명으로 서명하기 위해 네트워크 요청을 보냅니다.

### .expo 디렉터리

프로젝트에서 처음으로 개발 서버를 시작하면 프로젝트 루트에 **.expo** 디렉터리가 생성됩니다. 이 디렉터리에는 두 개의 파일이 들어 있습니다.

-   **devices.json**: 최근 이 프로젝트를 연 기기 정보가 들어 있습니다.
-   **settings.json**: 프로젝트 manifest를 제공하는 데 사용하는 서버 설정 정보가 들어 있습니다.

이 두 파일에는 로컬 컴퓨터에만 해당하는 정보가 들어 있습니다. 그래서 새 프로젝트를 만들 때 기본적으로 **.expo** 디렉터리가 **.gitignore** 파일에 포함됩니다. 다른 개발자와 공유하기 위한 디렉터리가 아닙니다.

## 빌드

React Native 앱은 두 부분으로 구성됩니다. 하나는 네이티브 런타임([compiling](/more/expo-cli#compiling))이고, 다른 하나는 JavaScript 번들과 asset 같은 정적 파일([exporting](/more/expo-cli#exporting))입니다. Expo CLI는 두 작업 모두를 위한 명령을 제공합니다.

### 컴파일

`run` 명령으로 로컬에서 앱을 컴파일할 수 있습니다.

```sh
npx expo run:ios
npx expo run:android
```

**주요 기능**

-   `--device` 플래그를 사용하면 전역 부작용 없이 연결된 기기에서 직접 빌드할 수 있습니다. 잠긴 기기도 지원하므로 다시 빌드하지 않고 즉시 재시도할 수 있습니다.
-   Xcode를 열지 않아도 CLI에서 iOS 앱의 개발용 codesign을 자동으로 수행합니다.
-   지능형 로그 파싱을 통해 Xcode처럼 node modules에서 나오는 수백 개의 무해한 경고 대신 프로젝트 소스 코드의 경고와 오류를 보여 줍니다.
-   앱 크래시를 유발하는 치명적 오류가 터미널에 표시되어 Xcode에서 다시 재현할 필요를 줄여 줍니다.

`npx expo run:ios`는 Mac에서만 실행할 수 있으며 Xcode가 설치되어 있어야 합니다. 어떤 컴퓨터에서든 `eas build -p ios`를 사용해 클라우드에서 앱을 빌드할 수 있습니다. 마찬가지로 `npx expo run:android`를 사용하려면 컴퓨터에 Android Studio와 Java가 설치 및 설정되어 있어야 합니다.

로컬 빌드는 네이티브 모듈 개발과 [복잡한 네이티브 이슈 디버깅](/debugging/runtime-issues#native-debugging)에 유용합니다. `eas build`를 사용한 원격 빌드는 미리 설정된 클라우드 환경 덕분에 훨씬 더 안정적인 선택지입니다.

프로젝트에 해당 네이티브 디렉터리가 없다면, 빌드 전에 `npx expo prebuild` 명령이 한 번 실행되어 필요한 디렉터리를 생성합니다.

예를 들어 프로젝트 루트에 **ios** 디렉터리가 없다면 `npx expo run:ios`는 앱을 컴파일하기 전에 먼저 `npx expo prebuild -p ios`를 실행합니다. 이 과정에 대한 자세한 내용은 [Expo Prebuild](/workflow/continuous-native-generation)를 참고하세요.

**크로스 플랫폼 인수**

-   `--no-build-cache`: 빌드 전에 네이티브 캐시를 지웁니다. iOS에서는 **derived data** 디렉터리입니다. 캐시 삭제는 빌드 시간 프로파일링에 유용합니다.
-   `--no-install`: 의존성 설치를 건너뜁니다. iOS에서는 프로젝트의 `package.json`에 있는 `dependencies` 필드가 바뀌었을 때 `npx pod-install` 실행도 건너뜁니다.
-   `--no-bundler`: 개발 서버 시작을 건너뜁니다. 개발 서버가 이미 다른 프로세스에서 앱을 서비스 중이면 자동으로 활성화됩니다.
-   `-d, --device [device]`: 앱을 빌드할 기기 이름 또는 ID입니다. 인수 없이 `--device`만 전달하면 사용 가능한 옵션 목록에서 기기를 선택할 수 있습니다. 연결된 실제 기기와 가상 기기 모두 지원합니다. 특정 기기를 타겟하지 않고 빌드만 하려면 `--device generic`을 사용하세요.
-   `-o, --output <path>`: 빌드 완료 후 생성된 앱 바이너리를 복사할 디렉터리입니다. CI/CD 파이프라인이나 예측 가능한 위치에 바이너리를 두고 싶을 때 유용합니다.
-   `-p, --port <port>`: 개발 서버를 시작할 포트입니다. **기본값: 8081**. 이 값은 development build에서만 관련이 있습니다. Production build는 기기에 설치하기 전에 프로젝트를 [export](/more/expo-cli#exporting)하고 파일을 네이티브 바이너리에 포함합니다.
-   `--binary <path>`: 기기에 설치할 바이너리 파일 경로입니다. 이 값이 제공되면 빌드 과정은 건너뛰고 바이너리를 직접 설치하려고 시도합니다. 바이너리가 올바른 기기용으로 빌드되지 않았다면, 예를 들어 시뮬레이터용을 실제 기기에 설치하려 하면 명령은 실패합니다.

#### Android 컴파일

Android 앱은 프로젝트의 `build.gradle` 파일에 정의된 여러 **variant**를 가질 수 있습니다. variant는 `--variant` 플래그로 선택할 수 있습니다.

##### `debug` variant

디버그 빌드에는 `debug` variant를 사용하세요.

```sh
npx expo run:android --variant debug
```

##### `debugOptimized` variant

> `debugOptimized`는 SDK 54 이상에서 사용할 수 있습니다.

전체 빌드를 디버그 친화적 모드로 유지하면서도 release 빌드에 가까운 성능으로 더 빠르게 개발하려면 `debugOptimized` variant를 사용하세요.

```sh
npx expo run:android --variant debugOptimized
```

이 variant를 사용할 때는 다음 사항을 염두에 두세요.

-   release 빌드처럼 C++ 라이브러리를 최적화해 런타임 성능을 높입니다.
-   EAS Build에서는 [`eas.json`의 `:app:assembleDebugOptimized`](/build-reference/apk#configuring-a-profile-to-build-apks) 같은 대응 Gradle 명령을 사용하세요.
-   **제한 사항**: C++ 디버깅은 비활성화되며 C++ 크래시의 stack trace 가독성이 떨어질 수 있습니다.

##### `release` variant

다음 명령으로 Android 앱을 프로덕션용으로 컴파일할 수 있습니다.

```sh
npx expo run:android --variant release
```

이 빌드는 Google Play Store 제출용으로 자동 code-sign 되지 않습니다. 이 명령은 프로덕션 빌드에서만 나타나는 버그를 테스트할 때 사용해야 합니다. Play Store용으로 code-sign 된 프로덕션 빌드를 생성하려면 [EAS Build](/build/introduction) 사용을 권장합니다.

##### 네이티브 Android 프로젝트 디버깅

Android Studio에서 **android** 디렉터리를 열어 네이티브 Android 프로젝트를 디버깅할 수 있습니다.

```sh
open -a /Applications/Android\\ Studio.app android
```

다른 product flavor를 사용하는 커스텀 Android 프로젝트가 있다면 `--variant`와 `--app-id` 플래그를 사용해 flavor와 application ID를 모두 설정할 수 있습니다.

```sh
npx expo run:android --variant freeDebug --app-id dev.expo.myapp.free
```

자세한 내용은 [Local builds using Android product flavors](/guides/local-app-development#local-builds-using-android-product-flavors) 가이드를 참고하세요.

#### iOS 컴파일

iOS 앱은 App Clip, watchOS 앱, Safari Extension 등 서로 다른 하위 앱을 표현하기 위한 여러 **scheme**를 가질 수 있습니다. 기본적으로 `npx expo run:ios`는 iOS 앱용 scheme를 선택합니다. `--scheme <my-scheme>` 인수로 커스텀 scheme를 선택할 수 있습니다. `--scheme` 인수만 전달하면 Expo CLI가 Xcode 프로젝트의 사용 가능한 옵션 목록에서 scheme를 선택하도록 프롬프트를 표시합니다.

선택한 scheme는 선택 프롬프트에 표시되는 `--device` 옵션을 필터링합니다. 예를 들어 Apple TV scheme를 선택하면 사용 가능한 Apple TV 기기만 표시됩니다.

다음 명령으로 iOS 앱을 프로덕션용으로 컴파일할 수 있습니다.

```sh
npx expo run:ios --configuration Release
```

이 빌드는 Apple App Store 제출용으로 자동 code-sign 되지 않습니다. `npx expo run:ios`는 주로 프로덕션 빌드에서만 나타나는 버그를 테스트할 때 사용해야 합니다. 네이티브 코드 서명은 여러 네트워크 요청이 필요하며 Apple 서버에서 비롯되는 다양한 오류에 취약합니다. App Store용으로 code-sign 된 프로덕션 빌드를 생성하려면 [EAS Build](/build/introduction) 사용을 권장합니다.

시뮬레이터에 앱을 컴파일하면 시뮬레이터의 네이티브 오류 로그가 터미널의 Expo CLI 프로세스로 전달됩니다. 이는 치명적인 오류를 빠르게 확인하는 데 유용합니다. 예를 들어 누락된 권한 메시지를 확인할 수 있습니다. 오류 전달은 실제 iOS 기기에서는 사용할 수 없습니다.

프로젝트를 Xcode에서 열고 Xcode에서 다시 빌드하면 `lldb`와 Apple의 모든 네이티브 디버깅 도구를 사용할 수 있습니다.

```sh
xed ios
```

Xcode에서 빌드하는 방식은 네이티브 브레이크포인트를 설정하고 애플리케이션의 어느 부분이든 프로파일링할 수 있기 때문에 유용합니다. `npx expo prebuild -p ios --clean`으로 네이티브 앱을 다시 생성해야 할 수 있으므로, source control(git)에서 변경 사항을 추적해 두세요.

##### 빌드 전용 워크플로

`generic` 기기 옵션을 사용하면 특정 기기를 타겟하지 않고 iOS Simulator 앱을 빌드할 수 있습니다.

```sh
npx expo run:ios --device generic
```

위 명령은 특정 시뮬레이터 UDID 대신 일반적인 Xcode destination(`generic/platform=iOS Simulator`)을 사용하며, 다음과 같은 경우에 유용합니다.

-   **CI/CD pipelines**: 빌드 머신에 시뮬레이터가 설정되어 있지 않아도 시뮬레이터 앱을 빌드할 수 있습니다.
-   **시뮬레이터 빌드 배포**: 모든 호환 시뮬레이터에서 실행할 수 있는 **.app** 번들을 만들어 공유할 수 있습니다.
-   **빌드 전용 워크플로**: 설치하거나 실행하지 않고 컴파일된 바이너리만 필요할 때 사용할 수 있습니다.

빌드가 완료되면 CLI는 생성된 **.app** 번들의 경로를 출력합니다.

```sh
✓ Build complete
Binary: ~/Library/Developer/Xcode/DerivedData/.../Release-iphonesimulator/MyApp.app
```

이를 `--configuration Release`와 함께 사용하면 프로덕션 시뮬레이터 빌드를 만들 수 있고, `--output`을 사용해 바이너리를 특정 디렉터리로 복사할 수 있습니다.

```sh
npx expo run:ios --configuration Release --device generic --output ./build
```

위 명령은 빌드된 **.app** 번들을 **./build/MyApp.app**으로 복사합니다.

**iOS development signing**

기기에서 앱이 어떻게 실행되는지 보고 싶다면, 기기를 연결하고 `npx expo run:ios --device`를 실행한 뒤 연결된 기기를 선택하면 됩니다.

Expo CLI는 자동으로 해당 기기를 개발용으로 서명하고, 앱을 설치한 뒤 실행합니다.

컴퓨터에 개발자 프로필이 설정되어 있지 않다면, 이 가이드를 따라 Expo CLI 밖에서 수동으로 설정해야 합니다. [Setup Xcode signing](https://expo.fyi/setup-xcode-signing).

### export

Metro bundler를 사용해 앱의 JavaScript와 asset을 export하려면 다음을 실행합니다.

```sh
npx expo export
```

이 작업은 `eas update`를 사용하거나 네이티브 런타임을 컴파일할 때 자동으로 수행됩니다. `export` 명령은 대부분의 웹 프레임워크와 비슷하게 동작합니다.

-   번들러는 애플리케이션 코드를 **production** 환경용으로 트랜스파일하고 번들링하며, `__DEV__` boolean으로 보호된 코드는 모두 제거합니다.
-   모든 정적 파일은 정적 호스트에서 제공할 수 있는 정적 **dist** 디렉터리로 복사됩니다.
-   **public** 디렉터리의 내용은 있는 그대로 **dist** 디렉터리로 복사됩니다.

다음 옵션을 사용할 수 있습니다.

-   `--platform <platform>`: 컴파일할 플랫폼을 선택합니다. 'ios', 'android', 'all'. **기본값: all**. app config에서 설정되어 있다면 'web'도 사용할 수 있습니다. 자세한 내용은 [Customizing Metro](/guides/customizing-metro)를 참고하세요.
-   `--dev`: 코드를 최소화하지 않고 `__DEV__` boolean도 제거하지 않은 채 **development** 환경용으로 번들링합니다.
-   `--output-dir <dir>`: 정적 파일을 export할 디렉터리입니다. **기본값: dist**
-   `--max-workers <number>`: bundler가 생성할 수 있는 최대 작업 수입니다. `0`으로 설정하면 모든 트랜스파일이 같은 프로세스에서 실행되므로 Babel 트랜스파일을 쉽게 디버깅할 수 있습니다.
-   `-c, --clear`: export 전에 bundler 캐시를 지웁니다.
-   `--no-minify`: JavaScript와 CSS asset 최소화를 건너뜁니다.
-   `--no-bytecode`: 네이티브 플랫폼용 Hermes bytecode 생성을 건너뜁니다. 번들 크기 분석에만 사용해야 하며 UTF-8 번들을 네이티브 플랫폼에 배포해서는 안 됩니다. 그렇게 하면 시작 시간이 훨씬 길어집니다.
-   `--no-ssg`: 웹 라우트용 정적 HTML 파일 export를 건너뜁니다. 이 옵션은 **dist** 디렉터리 안의 서버 코드만 생성합니다. [API routes](/router/web/api-routes)에 유용합니다.

#### 하위 경로로 호스팅하기

> 실험적 기능입니다.

[app config](/workflow/configuration)의 `experiments.baseUrl` 필드를 설정해 정적 asset의 prefix를 구성할 수 있습니다.

```json
{
  "expo": {
    "experiments": {
      "baseUrl": "/my-root"
    }
  }
}
```

이렇게 하면 웹사이트의 모든 리소스가 `/my-root` prefix와 함께 export됩니다. 예를 들어 `assets/image.png`에 있는 이미지는 **/my-root/assets/image.png**에서 호스팅된다고 가정합니다. 실제 파일은 전체 디렉터리가 서버에서 `/my-root`에 호스팅된다고 기대하기 때문에 파일 시스템에서는 같은 위치에 놓입니다.

Expo Router는 `baseUrl`을 기본 지원합니다. `Link`와 `router` API를 사용하면 `baseUrl`이 URL 앞에 자동으로 붙습니다.

```jsx
import { Link } from 'expo-router';

export default function Blog() {
  return <Link href="/blog/123">Go to blog post</Link>;
}
```

이 코드는 다음과 같이 **export**됩니다.

```html
<a href="/my-root/blog/123">Go to blog post</a>
```

`<a>`, React Navigation, 또는 `Linking` API를 직접 사용한다면 `baseUrl`을 수동으로 앞에 붙여야 합니다.

`baseUrl` 기능은 production 전용이며 웹사이트를 export하기 전에 설정해야 합니다. 값을 바꾸면 웹사이트를 다시 export해야 합니다.

이미지와 다른 asset은 `require` 또는 `import`로 가져오면 자동으로 동작합니다. 하지만 리소스 URL을 직접 참조한다면 **baseUrl**을 수동으로 붙여야 합니다.

```jsx
import { Image } from 'expo-image';

export default function Blog() {
  return <Image source={require('@/assets/image.png')} />;
}
```

이 코드는 다음과 같이 **export**됩니다.

```html
<img src="/my-root/assets/assets/image.png" />
```

URL을 직접 전달하는 경우에는 수동으로 prefix를 붙여야 합니다.

```jsx
export default function Blog() {
  return <img src="/my-root/assets/image.png" />;
}
```

### webpack으로 export하기

> **Deprecated**: SDK 50 이상에서는 Expo Webpack이 범용 Metro(`npx expo export`)로 대체되어 deprecated 되었습니다. 자세한 내용은 [migrating from Webpack to Expo Router](/router/migrate/from-expo-webpack)를 참고하세요.

다음을 실행하면 webpack을 사용해 웹 앱의 JavaScript와 asset을 export할 수 있습니다.

```sh
npx expo export:web
```

-   `--dev`: 코드를 최소화하지 않고 `__DEV__` boolean도 제거하지 않은 채 'development' 모드로 번들링합니다.
-   `-c, --clear`: export 전에 bundler 캐시를 지웁니다.

프로젝트가 `app.json`의 `expo.web.bundler: 'metro'` 필드를 통해 웹 프로젝트 번들링에 `metro`를 사용하도록 설정되어 있다면 이 명령은 비활성화됩니다.

## Prebuild

```sh
npx expo prebuild
```

네이티브 앱이 컴파일되기 전에 네이티브 소스 코드를 생성해야 합니다. Expo CLI는 _prebuild_라고 하는 독특하고 강력한 시스템을 제공하며, 이 시스템은 프로젝트의 네이티브 코드를 생성합니다. 자세한 내용은 [Expo Prebuild docs](/workflow/continuous-native-generation)를 참고하세요.

## Lint

```sh
npx expo lint
```

Lint는 모범 사례를 강제하고 코드 일관성을 유지하는 데 도움이 됩니다. `npx expo lint` 명령은 Expo 전용 설정으로 ESLint를 구성하고 Expo 프레임워크에 최적화된 옵션으로 `npx eslint` 명령을 실행합니다. `npx expo lint --fix`를 실행하면 lint 이슈를 자동으로 수정할 수 있습니다.

기본적으로 `npx expo lint`는 **src**, **app**, **components** 디렉터리의 모든 파일을 대상으로 합니다. 사용자 지정 파일이나 디렉터리를 인수로 전달할 수도 있습니다. 예를 들면 다음과 같습니다.

```sh
npx expo lint ./utils constants.ts
```

기본적으로 `.js, .jsx, .ts, .tsx, .mjs, .cjs` 확장자에 일치하는 모든 파일이 lint 대상입니다. `--ext` 플래그를 전달해 확장자를 사용자 지정할 수 있습니다. 예를 들어 `.ts`와 `.tsx`만 lint하려면 `--ext` 옵션을 사용할 수 있습니다. `npx expo lint --ext .ts,.tsx` 또는 `npx expo lint --ext .js --tsx .tsx`.

추가 사용자 정의가 필요하다면 `--` 연산자를 사용해 추가 인수를 전달할 수 있습니다. 예를 들어 ESLint에 `--no-error-on-unmatched-pattern` 플래그를 넘기려면 다음과 같이 실행할 수 있습니다.

```sh
npx expo lint -- --no-error-on-unmatched-pattern
```

더 많은 사용자 정의가 필요하면 `npx eslint`를 직접 사용할 수 있습니다.

[Using ESLint](/guides/using-eslint) — Expo 프로젝트에서 ESLint로 모범 사례를 보장하는 방법을 더 알아보세요.

## Config

다음을 실행해 app config(**app.json**, 또는 **app.config.js**)를 평가합니다.

```sh
npx expo config
```

-   `--full`: 모든 프로젝트 config 데이터를 포함합니다.
-   `--json`: JSON 형식으로 출력합니다. **app.config.js**를 **app.config.json**으로 변환할 때 유용합니다.
-   `-t, --type`: 표시할 [config type](/more/expo-cli#config-type)입니다.

### Config type

app config에서 생성되는 config type은 세 가지입니다.

-   `public`: OTA 업데이트와 함께 사용할 manifest 파일입니다. 네이티브 앱용 `index.html` 파일의 `<head />` 요소처럼 생각하면 됩니다.
-   `prebuild`: 비동기 modifier를 포함한 [Expo Prebuild](/workflow/continuous-native-generation)에 사용되는 config입니다. 이때만 config가 직렬화 가능하지 않습니다.
-   `introspect`: `Info.plist`나 **AndroidManifest.xml** 변경처럼 메모리상 수정만 보여 주는 `prebuild` config의 부분 집합입니다. 자세한 내용은 [introspection](/config-plugins/development-and-debugging#introspection)을 참고하세요.

## Install

웹과 달리 React Native는 하위 호환되지 않습니다. 즉 npm 패키지는 프로젝트에 현재 설치된 `react-native` 복사본과 정확히 맞는 버전이어야 하는 경우가 많습니다. Expo CLI는 인기 있는 패키지 목록과 알려진 호환 버전 조합을 바탕으로 이를 best-effort 방식으로 해결하는 도구를 제공합니다. `install` 명령을 `npm install`의 드롭인 대체재처럼 사용하면 됩니다.

```sh
npx expo install expo-camera
```

이 명령을 한 번 실행할 때 여러 패키지도 함께 설치할 수 있습니다.

```sh
npx expo install typescript expo-sms
```

`--` 연산자를 사용하면 내부 패키지 매니저에 직접 인수를 전달할 수 있습니다.

```sh
yarn expo install typescript -- -D
```

### 버전 검증

`--check`와 `--fix` 플래그를 사용해 검증 및 수정 작업을 할 수 있습니다.

-   `--check`: 업데이트가 필요한 설치 패키지를 확인합니다.
-   `--fix`: 잘못된 패키지 버전을 자동으로 업데이트합니다.

예를 들면 다음과 같습니다.

```sh
npx expo install --check
```

`npx expo install --check`는 잘못 설치된 패키지에 대해 프롬프트를 표시합니다. 또한 이 패키지를 로컬에서 호환되는 버전으로 설치할지 묻습니다. Continuous Integration(CI)에서는 non-zero로 종료합니다. 즉, 이를 사용해 지속적인 immutable validation을 할 수 있습니다. 반면 `npx expo install --fix`는 환경에 상관없이 필요하면 항상 패키지를 수정합니다.

특정 패키지만 전달해 검증할 수도 있습니다.

```sh
npx expo install react-native expo-sms --check
```

`npx expo install expo-camera`와 `npx expo install expo-camera --fix` 명령은 같은 목적을 가지며, `--fix` 명령은 다음과 같이 프로젝트의 모든 패키지를 업그레이드할 때 유용합니다.

```sh
npx expo install --fix
```

### 의존성 검증 구성하기

`npx expo install`이 권장하는 버전과 다른 패키지 버전을 써야 하는 경우가 있을 수 있습니다. 이 경우 프로젝트 **package.json**의 [`expo.install.exclude`](/versions/latest/config/package-json#exclude) 속성을 사용해 특정 패키지를 버전 검사에서 제외할 수 있습니다.

### Install package managers

`npx expo install`은 `bun`, `npm`, `pnpm`, `yarn`을 지원합니다.

명명된 인수로 패키지 매니저를 강제로 지정할 수 있습니다.

-   `--bun`: `bun`으로 의존성을 설치합니다. **bun.lockb** 또는 **bun.lock**이 있으면 기본값입니다.
-   `--npm`: `npm`으로 의존성을 설치합니다. **package-lock.json**이 있으면 기본값입니다.
-   `--pnpm`: `pnpm`으로 의존성을 설치합니다. **pnpm-lock.yaml**이 있으면 기본값입니다.
-   `--yarn`: `yarn`으로 의존성을 설치합니다. **yarn.lock**이 있으면 기본값입니다.

## 인증

Expo CLI는 `npx expo start` 명령과 함께 사용할 수 있는 인증 방법을 제공합니다. 인증은 안전한 OTA 사용을 위해 manifest를 "code sign"하는 데 사용됩니다. 웹의 HTTPS와 비슷하다고 생각하면 됩니다.

1.  `npx expo register`로 계정을 등록합니다.
2.  `npx expo login`으로 계정에 로그인합니다.
3.  `npx expo whoami`로 현재 인증된 계정을 확인합니다.
4.  `npx expo logout`으로 로그아웃합니다.

이 자격 증명은 Expo CLI와 EAS CLI 전반에서 공유됩니다.

## Customizing

때로는 Expo CLI가 메모리에서 생성하는 프로젝트 파일을 직접 사용자 정의하고 싶을 수 있습니다. Expo CLI 이외의 도구를 사용할 때는 기본 config 파일이 실제로 존재해야 합니다. 그렇지 않으면 앱이 기대대로 동작하지 않을 수 있습니다. 다음 명령으로 파일을 생성할 수 있습니다.

```sh
npx expo customize
```

여기에서 다음과 같은 기본 프로젝트 파일을 생성할 수 있습니다.

-   **babel.config.js** -- Babel 설정입니다. Expo CLI 외의 도구로 프로젝트를 번들링하려면 이 파일이 있어야 합니다.
-   **webpack.config.js** -- 웹 개발용 기본 webpack config입니다.
-   **metro.config.js** -- 범용 개발용 기본 Metro config입니다. `npx react-native` 사용 시 필요합니다.
-   **tsconfig.json** -- TypeScript config 파일을 만들고 필요한 의존성을 설치합니다.

## Environment variables

| Name | Type | Description |
| --- | --- | --- |
| `HTTP_PROXY` | **string** | 모든 네트워크 요청에 연결할 HTTP/HTTPS 프록시 URL입니다. [Undici EnvHttpProxyAgent](https://github.com/nodejs/undici/blob/main/docs/docs/api/EnvHttpProxyAgent.md)를 구성합니다. |
| `EXPO_NO_WEB_SETUP` | **boolean** | 웹 기능을 사용하기 전에 CLI가 웹 의존성(`react-dom`, `react-native-web`, `@expo/webpack-config`) 설치를 강제하지 않도록 합니다. 비표준 웹 개발을 하고 싶은 경우에 유용합니다. |
| `EXPO_OFFLINE` | **boolean** | 가능한 경우 모든 네트워크 요청을 건너뜁니다. 네트워크 연결이 좋지 않은 환경에서 더 빠르게 개발할 수 있습니다. |
| `EXPO_NO_TYPESCRIPT_SETUP` | **boolean** | `npx expo start`에서 CLI가 TypeScript 설정을 강제하지 않도록 합니다. 자세한 내용은 [TypeScript guide](/guides/typescript)를 참고하세요. |
| `DEBUG=expo:*` | **string** | CLI용 디버그 로그를 활성화합니다. [`debug` convention](https://github.com/debug-js/debug#conventions)으로 이를 설정할 수 있습니다. |
| `EXPO_DEBUG` | **boolean** | `DEBUG=expo:*`의 별칭입니다. |
| `EXPO_PROFILE` | **boolean** | CLI용 profiling 통계를 활성화합니다. 애플리케이션 자체를 프로파일링하는 것은 아닙니다. |
| `EXPO_NO_CACHE` | **boolean** | 모든 전역 캐싱을 비활성화합니다. 기본적으로 app config JSON schema, simulator 및 emulator용 Expo Go 바이너리, 프로젝트 템플릿은 컴퓨터의 전역 **.expo** 디렉터리에 캐시됩니다. |
| `CI` | **boolean** | 활성화되면 CLI는 상호작용 기능을 비활성화하고, 선택적 프롬프트를 건너뛰며, 필수 프롬프트에서는 실패합니다. 예: `CI=1 npx expo install --check`는 설치된 패키지 중 오래된 것이 있으면 실패합니다. |
| `EXPO_NO_TELEMETRY` | **boolean** | 익명 사용량 수집을 비활성화합니다. [telemetry 자세히 보기](/more/expo-cli#telemetry). |
| `EXPO_NO_GIT_STATUS` | **boolean** | `npx expo prebuild --clean` 같은 잠재적으로 위험한 작업 중 git 상태 경고를 건너뜁니다. |
| `EXPO_NO_REDIRECT_PAGE` | **boolean** | 사용자가 `expo-dev-client`를 설치했고 `npx expo start --dev-client` 대신 `npx expo start`로 프로젝트를 시작할 때 표시되는 앱 선택 redirect page를 비활성화합니다. |
| `EXPO_PUBLIC_FOLDER` | **string** | 웹용 Metro에서 사용할 public 디렉터리 경로입니다. [Metro 사용자 정의 자세히 보기](/guides/customizing-metro). 기본값: `public` |
| `EDITOR` | **string** | Terminal UI에서 O를 눌렀을 때 열 에디터의 이름입니다. 이 값은 많은 명령줄 도구에서 공통으로 사용됩니다. |
| `EXPO_EDITOR` | **string** | `EDITOR` 변수의 Expo 전용 버전이며, 정의되어 있으면 더 높은 우선순위를 가집니다. |
| `EXPO_IMAGE_UTILS_NO_SHARP` | **boolean** | 이미지 조작 시 전역 Sharp CLI 설치 사용을 비활성화하고 더 느린 Jimp 패키지를 사용하게 합니다. 이는 `npx expo prebuild`에서 앱 아이콘 생성 같은 곳에 사용됩니다. |
| `EXPO_TUNNEL_SUBDOMAIN` | **boolean** | , Experimental`--tunnel` 연결에서 호스트 이름으로 `exp.direct`를 사용하지 않도록 합니다. 이를 통해 iOS에서 universal link 테스트에 사용할 수 있는 **https://** 포워딩이 가능해집니다. `expo-linking` 및 Expo Go와 예상치 못한 문제가 생길 수 있습니다. `true`, `false`, `1`, `0`이 아닌 `string` 값을 전달해 정확한 서브도메인을 선택하세요. |
| `EXPO_METRO_NO_MAIN_FIELD_OVERRIDE` | **boolean** | 모든 플랫폼에서 프로젝트 **metro.config.js**의 [`resolver.resolverMainFields`](https://metrobundler.dev/docs/configuration/#resolvermainfields)를 사용하도록 Expo CLI를 강제합니다. 기본적으로 Expo CLI는 웹에서는 webpack 기본값인 `['browser', 'module', 'main']`을 사용하고, 다른 플랫폼에서는 사용자가 정의한 main field를 사용합니다. |
| ~`EXPO_NO_INSPECTOR_PROXY`~ | **boolean** | , Deprecated개선된 Chrome DevTools protocol 지원이 포함된 사용자 지정 inspector proxy를 비활성화합니다. 여기에는 network inspector 지원도 포함됩니다. |
| `EXPO_NO_CLIENT_ENV_VARS` | **boolean** | 클라이언트 번들에서 `EXPO_PUBLIC_` 환경 변수 인라인화를 막습니다. |
| `EXPO_NO_DOTENV` | **boolean** | Expo CLI 전체에서 `.env` 파일 로딩을 막습니다. |
| `EXPO_NO_METRO_LAZY` | **boolean** | Metro URL(`metro@0.76.3` 이상)에 `lazy=true` 쿼리 파라미터를 추가하지 않도록 합니다. 그러면 `import()` 지원이 비활성화됩니다. |
| `EXPO_USE_TYPED_ROUTES` | **boolean** | `expo.experiments.typedRoutes`를 사용해 Expo Router에서 정적으로 타입이 지정된 route를 활성화합니다. |
| ~`EXPO_METRO_UNSTABLE_ERRORS`~ | **boolean** | , DeprecatedMetro 번들링 오류에 대한 역방향 의존성 stack trace를 비활성화합니다. 기본적으로 활성화되어 있습니다. |
| ~`EXPO_USE_METRO_WORKSPACE_ROOT`~ | **boolean** | , Deprecated: SDK 52+Metro의 자동 서버 루트 감지를 활성화합니다. 서버 루트를 workspace 루트로 변경합니다. monorepo에 유용합니다. |
| `EXPO_NO_METRO_WORKSPACE_ROOT` | **boolean** | , SDK 52+Metro의 자동 서버 루트 감지를 비활성화합니다. 비활성화하면 서버 루트가 workspace 루트로 바뀌지 않습니다. 이를 활성화하는 것은 monorepo에 유용합니다. |
| ~`EXPO_USE_UNSTABLE_DEBUGGER`~ | **boolean** | , Deprecated: SDK 52+React Native의 실험적 디버거를 활성화합니다. |
| `EXPO_ADB_USER` | **string** | ADB 명령에 `--user`와 함께 전달할 `user` 번호를 설정합니다. 여러 프로필이 있는 Android 기기에 APK를 설치할 때 사용합니다. 기본값은 `0`입니다. |
| `EXPO_NO_TELEMETRY_DETACH` | **boolean** | , SDK 51+`@expo/cli`의 메인 스레드에서 telemetry 이벤트를 전송합니다. 이 경우 모든 이벤트가 전송될 때까지 CLI가 기다리므로 느려질 수 있습니다. |
| `EXPO_UNSTABLE_ATLAS` | **boolean** | , Experimental, SDK 51+개발 또는 export 중에 Metro bundle 정보를 수집합니다. SDK 53부터는 이 환경 변수가 `EXPO_ATLAS`로 대체되어 deprecated 됩니다. |
| `EXPO_ATLAS` | **boolean** | , SDK 53+개발 또는 export 중에 Metro bundle 정보를 수집합니다. |
| `EXPO_NO_BUNDLE_SPLITTING` | **boolean** | , Experimental, SDK 51+프로덕션(웹 전용)에서 async import 시 Metro가 chunk를 분리하지 않도록 합니다. |
| `EXPO_USE_METRO_REQUIRE` | **boolean** | , SDK 52+Expo의 커스텀 Metro `require` 구현과 `string` 기반 module ID 사용을 활성화합니다. 이는 React Server Components에서 더 나은 디버깅과 결정적 ID를 제공합니다. 레거시 RAM bundle은 지원하지 않습니다. |
| `EXPO_UNSTABLE_METRO_OPTIMIZE_GRAPH` | **boolean** | , Experimental, SDK 52+전체 번들이 생성된 뒤 uncached 상태로 transformation을 실행하는 eager bundling을 활성화합니다. 이는 production tree shaking에 필요하며 development bundling에는 덜 최적화되어 있습니다. |
| `EXPO_UNSTABLE_TREE_SHAKING` | **boolean** | , Experimental, SDK 52+모든 플랫폼에서 불안정한 tree shaking 지원을 활성화합니다. 자세한 내용은 [tree shaking](/guides/tree-shaking)을 참고하세요. |
| `EXPO_NO_REACT_NATIVE_WEB` | **boolean** | , Experimental, SDK 52+React Native Web 없이도 웹에서 Expo 앱을 실행할 수 있는 실험적 모드를 활성화합니다. |
| `EXPO_NO_DEPENDENCY_VALIDATION` | **boolean** | , SDK 52+`npx expo install`과 `npx expo start`를 통해 패키지를 설치할 때 내장 의존성 검증을 비활성화합니다. |
| `EXPO_WEB_DEV_HYDRATE` | **boolean** | 웹 프로젝트에서 개발 중 React hydration을 활성화합니다. hydration 문제를 조기에 발견하는 데 도움이 됩니다. |
| `EXPO_UNSTABLE_LIVE_BINDINGS` | **boolean** | , Experimental, SDK 54+실험적 import/export 지원에서 live binding을 비활성화합니다. 기본적으로 활성화되어 있습니다. live binding은 순환 의존성 지원을 개선하지만, 약간의 성능 저하를 유발할 수 있습니다. |
| `EXPO_UNSTABLE_LOG_BOX` | **boolean** | , Experimental, SDK 55+네이티브 애플리케이션용 실험적 LogBox error overlay를 활성화합니다. 웹에서는 기본적으로 활성화되어 있습니다. |
| `EXPO_NO_QR_CODE` | **boolean** | CLI가 콘솔에 QR 코드를 표시하지 않도록 합니다. |

## Telemetry

Expo dev tools는 일반적인 사용에 대한 익명 데이터를 수집합니다. 이를 통해 기능이 기대한 대로 동작하지 않을 때를 파악할 수 있습니다. Telemetry는 완전히 선택 사항이며, `EXPO_NO_TELEMETRY=1` 환경 변수를 사용해 opt out할 수 있습니다.
