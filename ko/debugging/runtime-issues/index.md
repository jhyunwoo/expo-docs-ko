---
modificationDate: February 19, 2026
title: 런타임 이슈 디버깅
description: Expo 프로젝트를 디버깅하는 데 사용할 수 있는 다양한 기법을 알아보세요.
---

# 런타임 이슈 디버깅

Expo 프로젝트를 디버깅하는 데 사용할 수 있는 다양한 기법을 알아보세요.

앱을 로컬에서 개발하든, 일부 베타 테스터에게 배포하든, 앱 스토어에 실제로 출시하든, 언제나 이슈를 디버깅하게 됩니다. 오류를 두 가지 범주로 나누어 생각하는 것이 유용합니다:

-   개발 중에 마주치는 오류
-   production에서 사용자나 본인이 마주치는 오류

위 두 상황 각각을 다룰 때 권장되는 방법을 살펴보겠습니다.

> 이미 React Native 디버깅에 익숙한가요? React Native DevTools와 built-in profiler 같은 Expo 전용 도구는 [Debugging tools](/debugging/tools)을 참고하세요.

## Development errors

이것들은 앱을 개발하는 동안 흔히 마주치는 오류입니다. 이를 파고드는 일이 항상 간단한 것은 아닙니다. 보통은 [Expo CLI](/more/expo-cli)로 앱을 실행하면서 디버깅하는 것만으로도 충분합니다.

이런 이슈를 디버깅하는 한 가지 방법은 [stack trace](/debugging/errors-and-warnings#stack-traces)를 살펴보는 것입니다. 하지만 어떤 시나리오에서는 추적된 오류 메시지가 조금 더 난해해서 stack trace만으로는 충분하지 않을 수 있습니다. 그런 오류라면 아래 단계를 따르세요:

-   오류 메시지를 Google과 [Stack Overflow](https://stackoverflow.com/questions)에서 검색하세요. 아마 당신이 처음 겪는 사람은 아닐 가능성이 높습니다.
-   **오류를 던지는 코드를 격리하세요**. 이 단계는 난해한 오류를 해결하는 데 _매우 중요합니다_. 이를 위해:
    -   코드가 정상 작동하던 버전으로 되돌리세요. 심지어 완전히 비어 있는 `npx create-expo-app` 프로젝트일 수도 있습니다.
    -   최근 변경 사항을 조금씩 다시 적용해 보다가, 어디서 깨지는지 확인하세요.
    -   각 \"조각\"으로 추가하는 코드가 복잡하다면, 현재 하려는 일을 더 단순화해 보는 것이 좋습니다. 예를 들어 Redux 같은 상태 관리 라이브러리를 사용한다면, 상태 관리가 원인인지 확인하기 위해 그 부분을 완전히 제거해 볼 수 있습니다. React 앱에서 흔한 원인입니다.
    -   이렇게 하면 오류의 가능한 원인을 좁힐 수 있고, 같은 문제를 겪은 다른 사람을 인터넷에서 찾기 위한 더 많은 정보를 얻게 됩니다.
-   breakpoint 또는 `console.log`를 사용해 특정 코드 조각이 실제로 실행되는지, 혹은 어떤 변수가 특정 값을 갖는지 확인하세요. `console.log`를 통한 디버깅은 최선의 방법으로 여겨지지는 않지만, 빠르고 쉽고, 종종 아주 유용한 정보를 제공합니다.

오류의 원인을 추적하기 위해 코드를 가능한 한 단순화하는 것은 앱을 디버깅하는 훌륭한 방법이며, 할수록 점점 더 쉬워집니다. 그래서 많은 오픈소스 저장소는 이슈를 열 때 [minimal reproducible example](https://stackoverflow.com/help/minimal-reproducible-example)을 요구합니다. 이는 문제를 격리하고 정확히 어디에서 문제가 발생하는지 식별했는지 확인해 줍니다. 앱이 너무 크고 복잡하다면, 추가하려는 기능을 비어 있는 `npx create-expo-app` 프로젝트로 추출해 보고 거기서부터 진행해 보세요.

### Native debugging

로컬에서 source code를 생성하고 그 source로부터 build함으로써 Android Studio와 Xcode에서 전체 native debugging을 수행할 수 있습니다.

#### Android Studio

다음 명령을 실행해 프로젝트의 native code를 생성하세요:

```sh
npx expo prebuild -p android
```

이렇게 하면 프로젝트 루트에 **android** 디렉터리가 추가됩니다.

다음 명령을 실행해 Android Studio에서 프로젝트를 여세요:

```sh
open -a "/Applications/Android Studio.app" ./android
```

Android Studio에서 앱을 build하고 debugger를 연결하세요. 자세한 내용은 [Google's documentation](https://developer.android.com/studio/debug#startdebug)을 참고하세요.

> 이 과정을 마친 뒤에는 **android** 디렉터리를 삭제할 수 있습니다. 이렇게 하면 프로젝트가 Expo CLI에 의해 관리되는 상태를 유지할 수 있습니다. 디렉터리를 그대로 두고 `npx expo prebuild` 밖에서 수동으로 수정하면, 이후 native library를 직접 업그레이드하고 구성해야 합니다.

#### Xcode

> 이 기능은 macOS 사용자만 사용할 수 있으며 Xcode가 설치되어 있어야 합니다.

다음 명령을 실행해 프로젝트의 native code를 생성하세요:

```sh
npx expo prebuild -p ios
```

이렇게 하면 프로젝트 루트에 **ios** 디렉터리가 추가됩니다.

다음 명령을 실행해 Xcode에서 프로젝트를 여세요. 이 명령은 프로젝트의 **ios** 디렉터리 안에 있는 `.xcworkspace` 파일을 Xcode로 여는 shortcut입니다.

```sh
xed ios
```

Cmd ⌘ + r 또는 Xcode 왼쪽 위의 play button을 눌러 앱을 build하세요.

이제 [**Low-level debugger (LLDB)**](https://developer.apple.com/library/archive/documentation/IDEs/Conceptual/gdb_to_lldb_transition_guide/document/Introduction.html)와 다른 모든 [Xcode debugging tools](https://developer.apple.com/documentation/metal/debugging_tools)을 활용해 native runtime을 살펴볼 수 있습니다.

> 이 과정을 마친 뒤에는 **ios** 디렉터리를 삭제하거나 gitignore 처리할 수 있습니다. 이렇게 하면 프로젝트가 Expo CLI에 의해 관리되는 상태를 유지할 수 있습니다. 디렉터리를 그대로 두고 `npx expo prebuild` 밖에서 수동으로 수정하면, 이후 native library를 직접 업그레이드하고 구성해야 합니다.

## Native logs 보기

앱이 충돌하거나 예상치 못하게 동작할 때, JavaScript 오류 출력만으로는 전체 상황을 알 수 없는 경우가 많습니다. Android와 iOS의 native logs는 Metro bundler나 React Native DevTools에 드러나지 않는 충돌 원인, native module 오류, 시스템 수준 warning을 보여 줄 수 있습니다.

[How to use ADB Logcat & macOS Console to debug](https://www.youtube.com/watch?v=LvCci4Bwmpc) - 이 튜토리얼에서는 ADB Logcat과 macOS Console 같은 native device logging 기능을 사용해 코드의 bug를 찾고 빠르게 수정하는 방법을 배울 수 있습니다.

### Android: adb logcat

Android device를 연결하거나 emulator를 사용한 뒤, 다음 명령을 실행하세요:

```sh
adb logcat
```

Android Debug Bridge(`adb`) 프로그램은 Android SDK의 일부이며, streaming log를 볼 수 있게 해 줍니다. Android SDK를 설치하지 않고도 사용할 수 있는 대안으로 Chrome에서 [WebADB](https://webadb.com/)를 사용할 수 있습니다.

### iOS: Console app

device를 Mac에 연결하거나 iOS Simulator를 실행하는 동안 Xcode의 **Console** app을 사용할 수 있습니다. Console app에 접근하려면 아래 단계를 따르세요:

Xcode app을 열고 Shift + Cmd ⌘ + 2를 눌러 **Devices and Simulators** 창을 여세요.

실제 device를 연결했다면 **Devices** 아래에서 선택하세요. simulator를 사용 중이라면 **Simulators** 아래에서 선택하세요.

창에 표시되는 **Open Console** button을 클릭해 console app을 여세요.

그러면 device 또는 simulator의 log를 볼 수 있도록 console app이 열립니다.

## Production errors

production 앱의 오류나 bug는 해결하기가 훨씬 더 어려울 수 있습니다. 주된 이유는 오류에 대한 맥락, 즉 어디서, 어떻게, 왜 발생했는지에 대한 정보가 development 때보다 훨씬 적기 때문입니다.

**production 오류를 다룰 때 가장 좋은 첫 단계는 로컬에서 재현하는 것입니다.** 로컬에서 오류를 재현한 뒤에는 [development debugging process](/debugging/runtime-issues#development-errors)를 따라 근본 원인을 격리하고 해결할 수 있습니다.

### Production app이 충돌하는 경우

production 앱이 충돌하면 development에 비해 얻을 수 있는 정보가 매우 적습니다. 먼저 로컬에서 충돌을 재현해 보고, 원인을 좁혀 나가기 위해 다음 단계를 수행하세요:

-   **플랫폼별 crash report를 확인하세요.**
    -   Google Play Store의 Android 앱은 [Google Play Console](https://play.google.com/console/about/)의 crashes section을 참고하세요.
    -   TestFlight 또는 App Store의 iOS 앱은 Xcode의 [Crashes Organizer](https://developer.apple.com/news/?id=nra79npr)를 사용하세요. Apple's [Diagnosing Issues Using Crash Reports and Device Logs](https://developer.apple.com/documentation/xcode/diagnosing-issues-using-crash-reports-and-device-logs) 가이드도 참고하세요.
-   **Native log 도구를 사용하세요.** 충돌을 재현하는 device를 연결하고 [`adb logcat` 또는 the Console app](/debugging/runtime-issues#viewing-native-logs)을 사용해 native log 출력을 수집하세요. JavaScript error boundary가 문제를 잡지 못할 때, native logs는 종종 근본 원인을 보여 줍니다.
-   **로컬에서 production mode를 시도하세요.** 앱을 로컬에서 **production mode**로 실행하면 보통은 던져지지 않는 오류도 볼 수 있습니다. 이를 위해 `npx expo start --no-dev --minify`를 실행할 수 있습니다. `--no-dev` 플래그는 server를 production mode로 실행하도록 하고, `--minify`는 production JavaScript bundle과 같은 방식으로 코드를 minify하는 데 사용됩니다.
-   **Crash reporting dashboard를 확인하세요.** [Sentry](/guides/using-sentry), [BugSnag](/guides/using-bugsnag), 또는 유사한 서비스를 사용 중이라면 먼저 այնտեղ에서 crash를 확인하세요. 이런 서비스는 stack trace, device 정보, 재현 맥락을 제공합니다.

### 특정(오래된) device에서 앱이 충돌하는 경우

이 경우 성능 이슈일 가능성이 있습니다. 어떤 프로세스가 앱을 종료시키는지 더 잘 파악하려면 profiler를 실행해야 하며, [React Native provides some great documentation for this](https://reactnative.dev/docs/profiling). 또한 [React Native DevTools](/debugging/tools#debugging-with-react-native-devtools)와 여기에 포함된 [profiler](/debugging/tools#profiling-javascript-performance)를 사용하는 것도 권장합니다. 이를 사용하면 앱의 JavaScript 성능 병목을 아주 쉽게 식별할 수 있습니다.

### Error reporting service 사용하기

production 앱에 crash 및 bug reporting service를 구현하면 다음과 같은 여러 이점이 있습니다:

-   crash와 bug를 재현하기 위한 정보와 함께 production 배포에 대한 실시간 인사이트 제공
-   치명적인 JavaScript 오류나 사용자가 설정한 다른 이벤트에 대해 알림을 받는 alert system 설정
-   stack trace, device 정보 등 예외 세부 정보를 볼 수 있는 web dashboard 사용

Expo에서는 [Sentry](/guides/using-sentry) 또는 [BugSnag](/guides/using-bugsnag) 같은 reporting service를 통합해 실시간으로 더 많은 인사이트를 얻을 수 있습니다.

## 막혔나요?

막혔을 때는 Expo community와 React, React Native community가 모두 훌륭한 도움 자원입니다. 누군가가 이미 같은 오류를 겪었을 가능성이 높으므로, 문서를 읽고 [forums](https://chat.expo.dev/), [GitHub issues](https://github.com/expo/expo/issues/), [Stack Overflow](https://stackoverflow.com/)를 꼭 검색해 보세요.
