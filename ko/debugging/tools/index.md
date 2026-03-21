---
modificationDate: February 16, 2026
title: 디버깅 및 profiling 도구
description: Expo 프로젝트를 런타임에 검사하는 데 사용할 수 있는 다양한 도구를 알아보세요.
---

# 디버깅 및 profiling 도구

Expo 프로젝트를 런타임에 검사하는 데 사용할 수 있는 다양한 도구를 알아보세요.

React Native는 JavaScript 코드와 native 코드로 모두 이루어져 있습니다. 디버깅할 때 이 구분은 매우 중요합니다. 오류가 JavaScript 코드에서 발생했다면 native 코드용 디버깅 도구로는 찾지 못할 수 있습니다. 이 페이지에서는 Expo 프로젝트를 디버그하는 데 도움이 되는 몇 가지 도구를 소개합니다.

## Developer menu

**Developer menu**는 유용한 디버깅 기능에 접근할 수 있게 해 줍니다. 이 메뉴는 dev client와 Expo Go에 기본으로 포함되어 있습니다. emulator 또는 simulator를 사용 중이거나 USB로 연결한 device가 있다면, Expo CLI가 development server를 시작한 터미널에서 m을 눌러 이 메뉴를 열 수 있습니다.

Developer menu를 여는 다른 방법

-   Android device(USB 없이): device를 세로로 흔드세요.
-   Android Emulator 또는 device(USB 사용):
    -   Cmd ⌘ + m 또는 Ctrl + m을 누르세요.
    -   다음 명령을 터미널에서 실행해 menu button을 누르는 동작을 시뮬레이션하세요:

        ```sh
        adb shell input keyevent 82
        ```

-   iOS device(USB 없이):
    -   device를 흔드세요.
    -   화면을 세 손가락으로 터치하세요.
-   iOS Simulator 또는 device(USB 사용):
    -   Ctrl + Cmd ⌘ + z 또는 Cmd ⌘ + d를 누르세요.

Developer menu가 열리면 아래와 같이 표시됩니다:

Developer menu는 다음 옵션을 제공합니다:

-   **Copy link**: dev client의 dev server 주소 또는 Expo의 [`exp://`](/linking/into-your-app#test-a-link-using-expo-go) 링크를 복사합니다.
-   **Reload**: 앱을 다시 로드합니다. 보통 Fast Refresh가 기본으로 활성화되어 있으므로 필요하지 않습니다.
-   **Go Home**: 앱을 벗어나 dev client 또는 Expo Go 앱의 Home 화면으로 돌아갑니다.
-   **Toggle performance monitor**: 앱의 성능 정보를 확인합니다.
-   **Toggle element inspector**: element inspector overlay를 활성화하거나 비활성화합니다.
-   **Open DevTools**(이전 이름은 **Open JS debugger**): Hermes를 사용하는 앱의 경우 Console, Sources, Network(**Expo only**), Memory, Components, Profiler 탭에 접근할 수 있는 React Native DevTools를 엽니다. 자세한 내용은 [Debugging with React Native DevTools](/debugging/tools#debugging-with-react-native-devtools) 섹션을 참고하세요.
-   **Fast Refresh**: 텍스트 편집기로 프로젝트 파일을 변경할 때마다 JS bundle을 자동으로 새로고침할지 전환합니다.

이제 이 옵션들 중 일부를 좀 더 자세히 살펴보겠습니다.

### Toggle performance monitor

앱에 대한 다음 성능 정보를 제공하는 작은 overlay를 엽니다:

-   프로젝트의 RAM 사용량
-   JavaScript heap(애플리케이션의 memory leak을 파악하는 쉬운 방법입니다)
-   두 개의 Views. 위쪽은 화면의 view 수를, 아래쪽은 component의 view 수를 나타냅니다.
-   UI thread와 JS thread의 Frames Per Second. UI thread는 native Android 또는 iOS UI 렌더링에 사용됩니다. JS thread는 API 호출, touch event 등 앱의 대부분의 로직이 실행되는 곳입니다.

### Toggle element inspector

element inspector overlay를 엽니다:

이 overlay는 다음 기능을 제공합니다:

-   Inspect: element 검사
-   Perf: Performance overlay 표시
-   Network: network 세부 정보 표시
-   Touchables: 터치 가능한 element 강조

## React Native DevTools로 디버깅하기

> **React Native 0.76부터** React Native DevTools가 Chrome DevTools를 대체했습니다.

**React Native DevTools**는 Expo와 React Native 앱을 위한 현대적인 디버깅 도구입니다. [Console](/debugging/tools#interacting-with-the-console), [Sources](/debugging/tools#pausing-on-breakpoints), [Network](/debugging/tools#inspecting-network-requests-expo-only)(**Expo only**), [Memory](/debugging/tools#inspecting-memory) 탭을 통해 앱의 JavaScript 코드에 대한 인사이트를 얻을 수 있습니다. 또한 [Components](/debugging/tools#inspecting-components), [Profiler](/debugging/tools#profiling-javascript-performance) 탭과 같은 **React DevTools에 대한 built-in 지원**도 제공합니다. 이 모든 inspector는 [dev clients](/more/glossary-of-terms#dev-clients) 또는 Expo Go를 사용해 접근할 수 있습니다.

[Hermes](/guides/using-hermes)를 사용하는 모든 앱에서 React Native DevTools를 사용할 수 있습니다. **열려면 앱을 시작한 다음 Expo를 시작한 터미널에서 j를 누르세요**. React Native DevTools를 열면 아래와 같이 표시됩니다:

### Breakpoint에서 일시 정지하기

코드의 특정 부분에서 앱을 일시 정지할 수 있습니다. 이를 위해 Sources 탭에서 줄 번호를 클릭해 breakpoint를 설정하거나 코드에 `debugger` 문을 추가하세요.

앱이 breakpoint가 있는 코드를 실행하면 앱 전체가 일시 정지합니다. 이를 통해 해당 scope의 모든 변수와 함수를 검사할 수 있습니다. 또한 앱의 일부로서 [Console](/debugging/tools#interacting-with-the-console) 탭에서 코드를 실행할 수도 있습니다.

### Exception에서 일시 정지하기

앱이 예상치 못한 오류를 던지면, 오류의 원인을 찾기가 어려울 수 있습니다. React Native DevTools를 사용하면 오류가 던져지는 바로 그 순간 앱을 멈추고 stack trace와 변수를 검사할 수 있습니다.

> 일부 오류는 Expo Router 같은 앱 내부의 다른 component에 의해 잡힐 수 있습니다. 이런 경우 **Pause on caught exceptions**를 켤 수 있습니다. 그러면 적절히 처리된 오류를 포함해, 던져진 모든 오류를 검사할 수 있습니다.

### Console과 상호작용하기

**Console** 탭은 앱에 직접 연결된 interactive terminal을 제공합니다. 이 terminal 안에 어떤 JavaScript든 작성해, 마치 앱의 일부인 것처럼 code snippet을 실행할 수 있습니다. 기본적으로 코드는 global scope에서 실행됩니다. 하지만 [Sources](/debugging/tools#pausing-on-breakpoints) 탭의 breakpoint를 사용할 때는 도달한 breakpoint의 scope에서 실행됩니다. 이를 통해 앱 전반의 method를 호출하고 변수에 접근할 수 있습니다.

### Network request 검사하기(Expo only)

> React Native DevTools의 Network 탭은 프로젝트에 `expo`가 설치되어 있을 때만 사용할 수 있습니다.

**Network** 탭은 앱이 수행하는 network request에 대한 인사이트를 제공합니다. 각 request와 response를 클릭해 검사할 수 있습니다. 여기에는 `fetch` request, 외부에서 로드된 media, 그리고 경우에 따라 native module이 만든 request도 포함됩니다.

> network request를 검사하는 다른 방법은 [Inspecting network traffic](/debugging/tools#inspecting-network-traffic)을 참고하세요.

### Memory 검사하기

**Memory** 탭을 사용하면 앱 JavaScript 코드의 memory 사용량을 검사하고 heap snapshot을 찍을 수 있습니다.

### Components 검사하기

**Components** 탭을 사용하면 앱의 React component를 검사할 수 있습니다. React Native DevTools에서 component 위에 마우스를 올리면 각 component의 props와 styles를 볼 수 있습니다. 이는 앱 UI를 디버깅하고 component가 어떻게 구성되어 있는지 이해하는 훌륭한 방법입니다.

### JavaScript 성능 profiling

> profile은 아직 sourcemap으로 symbolicate되지 않으며, [debug build에서만 사용할 수 있습니다](https://github.com/facebook/hermes/issues/760). 이 제한 사항은 향후 릴리스에서 해결될 예정입니다.

**Profiler** 탭을 사용하면 앱 JavaScript의 성능을 기록하고 분석할 수 있습니다. recording을 시작하고, 앱과 상호작용한 다음, recording을 멈춰 profile을 분석하세요.

> native runtime을 profiling하려면 Android Studio 또는 Xcode에 포함된 도구를 사용하세요.

## VS Code로 디버깅하기

> VS Code debugger integration은 alpha 상태입니다. 가장 안정적인 디버깅 경험을 원한다면 [use the React Native DevTools](/debugging/tools#debugging-with-react-native-devtools)를 사용하세요.

VS Code는 built-in debugger를 갖춘 인기 있는 코드 편집기입니다. 이 debugger는 React Native DevTools와 동일한 시스템인 inspector protocol을 사용합니다.

[Expo Tools](https://github.com/expo/vscode-expo#readme) VS Code extension과 함께 이 debugger를 사용할 수 있습니다. 이 debugger를 사용하면 breakpoint를 설정하고, 변수를 검사하고, debug console을 통해 코드를 실행할 수 있습니다.

디버깅을 시작하려면:

-   앱을 연결하세요.
-   VS Code command palette를 여세요(컴퓨터에 따라 Ctrl + Shift + p 또는 Cmd ⌘ + Shift + p입니다).
-   **Expo: Debug ...** VS Code 명령을 실행하세요.

그러면 VS Code가 현재 실행 중인 앱에 연결됩니다.

또는 VS Code에서 더 완전한 기능의 IDE 구성을 원한다면 [Radon IDE](https://ide.swmansion.com/) extension(30일 무료 체험이 포함된 유료)을 확인해 보세요. 이 extension은 고급 디버깅, network inspector, router integration, 기타 built-in 도구를 포함해 React Native 및 Expo 프로젝트를 위해 특별히 설계된 강력한 환경으로 편집기를 바꿔 줍니다.

## React Native Debugger

> React Native Debugger는 Remote JS debugging이 필요하며, 이는 [React Native 0.73](https://reactnative.dev/docs/other-debugging-methods#remote-javascript-debugging-deprecated)부터 deprecated되었습니다.

React Native Debugger는 React DevTools, Redux DevTools, React Native DevTools를 감싸는 standalone 앱입니다. 안타깝게도 [deprecated된 Remote JS debugging workflow](https://github.com/jhen0409/react-native-debugger/discussions/774)가 필요하고 Hermes와는 호환되지 않습니다.

Expo **SDK 50** 이상을 사용하고 있다면, React Native Debugger에 해당하는 [Expo dev tools plugins](/debugging/devtools-plugins)을 사용할 수 있습니다:

-   [React Native DevTools](/debugging/tools#debugging-with-react-native-devtools)
-   [Redux DevTools](/debugging/devtools-plugins#redux)

Expo SDK 49 이하를 사용하고 있다면 React Native Debugger를 사용할 수 있습니다. 이 섹션에서는 빠른 시작 지침을 제공합니다. 더 자세한 내용은 해당 [documentation](https://github.com/jhen0409/react-native-debugger#documentation)을 확인하세요.

[release page](https://github.com/jhen0409/react-native-debugger/releases)에서 설치할 수 있으며, macOS를 사용 중이라면 다음을 실행할 수도 있습니다:

```sh
brew install react-native-debugger
```

### Startup

React Native Debugger를 실행한 뒤에는 port(단축키: macOS는 Cmd ⌘ + t, Linux/Windows는 Ctrl + t)를 `8081`로 지정해야 합니다. 그런 다음 `npx expo start`로 프로젝트를 실행하고, Developer Menu에서 `Debug remote JS`를 선택하세요. debugger가 자동으로 연결됩니다.

debugger console에서는 Element tree와, 선택한 element의 props, state, children을 볼 수 있습니다. 오른쪽에는 Chrome console도 있으며, console에 `$r`를 입력하면 선택한 element의 상세 내역을 볼 수 있습니다.

React Native Debugger 안의 아무 곳이나 오른쪽 클릭하면 JS를 다시 로드하고, element inspector와 network inspector를 켜거나 끄고, `AsyncStorage` 내용을 log 및 clear할 수 있는 유용한 shortcut을 볼 수 있습니다.

### Network traffic 검사하기

React Native Debugger를 사용해 network request를 디버그하는 것은 쉽습니다. React Native Debugger 안의 아무 곳이나 오른쪽 클릭하고 `Enable Network Inspect`를 선택하세요. 그러면 Network 탭이 활성화되고 `fetch` 및 `XMLHttpRequest` request를 검사할 수 있습니다.

하지만 [some limitations](https://github.com/jhen0409/react-native-debugger/blob/master/docs/network-inspect-of-chrome-devtools.md#limitations)이 있으므로, 모두 proxy 사용이 필요한 몇 가지 다른 대안도 있습니다:

-   [Charles Proxy](https://www.charlesproxy.com/documentation/configuration/browser-and-system-configuration/) (~$50 USD, 우리가 선호하는 도구)
-   [Proxyman](https://proxyman.io) (무료 버전 제공 또는 $49 ~ $59 USD)
-   [mitmproxy](https://medium.com/@rotxed/how-to-debug-http-s-traffic-on-android-7fbe5d2a34#.hnhanhyoz)
-   [Fiddler](http://www.telerik.com/fiddler)

## Production 앱 디버깅하기

현실적으로 앱은 bug를 안고 출시되는 경우가 많습니다. crash 및 bug reporting system을 구현하면 production 앱에 대한 실시간 인사이트를 얻는 데 도움이 됩니다. 자세한 내용은 [Using error reporting services](/debugging/runtime-issues#using-error-reporting-services)를 참고하세요.
