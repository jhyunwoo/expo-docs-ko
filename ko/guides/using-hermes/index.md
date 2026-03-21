---
modificationDate: February 16, 2026
title: Hermes Engine 사용하기
description: Expo 프로젝트에서 Android와 iOS 모두에 대해 Hermes를 설정하는 가이드입니다.
---

# Hermes Engine 사용하기

Expo 프로젝트에서 Android와 iOS 모두에 대해 Hermes를 설정하는 가이드입니다.

[Hermes](https://hermesengine.dev/)는 React Native에 최적화된 JavaScript 엔진입니다. Hermes는 JavaScript를 미리 bytecode로 컴파일함으로써 앱 시작 시간을 개선할 수 있습니다. 또한 Hermes의 binary 크기는 JavaScriptCore(JSC) 같은 다른 JavaScript 엔진보다 더 작습니다. 런타임에서 사용하는 메모리도 더 적으며, 이는 특히 사양이 낮은 Android 기기에서 큰 가치가 있습니다.

## Support

Hermes 엔진은 Expo에서 기본으로 사용되는 JavaScript 엔진이며, 모든 Expo tooling에서 완전히 지원됩니다.

### 특정 플랫폼에서 JavaScript 엔진 전환하기

한 플랫폼에서는 Hermes를 쓰고 다른 플랫폼에서는 JSC를 쓰고 싶을 수 있습니다. 한 가지 방법은 app config의 최상위 레벨에서 `"jsEngine"`을 `"hermes"`로 설정한 뒤, `"ios"` 키 아래에서 이를 `"jsc"`로 덮어쓰는 것입니다. 이 경우 `"android"` 키에만 `"hermes"`를 명시적으로 설정하는 방식을 선호할 수도 있습니다.

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

## Publish updates

`eas update`와 `npx expo export`로 업데이트를 배포하면 Hermes bytecode 번들과 그 source map이 생성됩니다.

Hermes bytecode 형식은 서로 다른 Hermes 버전 사이에서 달라질 수 있다는 점에 유의하세요. 특정 Hermes 버전에 맞춰 생성된 업데이트는 다른 버전의 Hermes에서는 실행되지 않습니다. Expo SDK 46(React Native 0.69)부터 [Hermes는 React Native 안에 번들링됩니다](https://reactnative.dev/architecture/bundled-hermes). React Native 버전 또는 Hermes 버전을 업데이트하는 것은 다른 native module을 업데이트하는 것과 같은 방식으로 생각할 수 있습니다. 따라서 `react-native` 버전을 업데이트한다면 **app.json**의 `runtimeVersion`도 함께 업데이트해야 합니다. 그렇지 않으면 기존 binary가 더 오래된 Hermes 버전을 사용하고 있고, 그것이 업데이트된 bytecode 형식과 호환되지 않아 업데이트를 로드하면서 앱이 실행 시점에 crash할 수 있습니다. 자세한 내용은 [`runtimeVersion`](/eas-update/runtime-versions)을 참고하세요.

## JavaScript debugger

Hermes에서 실행 중인 JavaScript 코드를 디버그하려면 `npx expo start`로 프로젝트를 시작한 뒤 j를 눌러 Google Chrome 또는 Microsoft Edge에서 debugger를 열 수 있습니다. development build와 Expo Go의 developer menu에도 같은 작업을 수행하는 **Open DevTools**(이전 이름은 **Open JS Debugger**) 옵션이 있습니다.

또는 [Google Chrome DevTools를 수동으로 열어](https://reactnative.dev/docs/other-debugging-methods#remote-javascript-debugging-deprecated) JavaScript inspector를 사용할 수도 있습니다.

### Troubleshooting

> debugger를 열 때 `No compatible apps connected. JavaScript Debugging can only be used with the Hermes engine.`가 표시되는 경우

-   [`jsEngine` 필드에서 Hermes를 설정했는지](/guides/using-hermes#setup) 확인하세요.
    
-   앱을 `eas build`, `npx expo run:android`, `npx expo run:ios`로 빌드했다면 debug build인지 확인하세요.
    
-   내부적으로 앱은 WebSocket 연결을 수립하므로, 앱이 development server에 연결되어 있는지 확인하세요.
    
    -   Expo CLI Terminal UI에서 r을 눌러 앱을 다시 로드해 보세요.
    -   다음 명령으로 디버깅 가능 여부를 테스트하세요: `curl http://127.0.0.1:8081/json/list` (`127.0.0.1:8081`은 dev server URL에 맞게 조정하세요). HTTP 응답은 아래와 같이 배열이어야 합니다. 빈 응답이라면 `npx expo start` 명령에 `--localhost` 또는 `--tunnel` 플래그를 추가하세요.
    
    ```json
    [
      {
        "id": "0-2",
        "description": "host.exp.Exponent",
        "title": "Hermes ABI47_0_0React Native",
        "faviconUrl": "https://react.dev/favicon.ico",
        "devtoolsFrontendUrl": "devtools://devtools/bundled/js_app.html?experiments=true&v8only=true&ws=%5B%3A%3A1%5D%3A8081%2Finspector%2Fdebug%3Fdevice%3D0%26page%3D2",
        "type": "node",
        "webSocketDebuggerUrl": "ws://[::1]:8081/inspector/debug?device=0&page=2",
        "vm": "Hermes"
      },
      {
        "id": "0--1",
        "description": "host.exp.Exponent",
        "title": "React Native Experimental (Improved Chrome Reloads)",
        "faviconUrl": "https://react.dev/favicon.ico",
        "devtoolsFrontendUrl": "devtools://devtools/bundled/js_app.html?experiments=true&v8only=true&ws=%5B%3A%3A1%5D%3A8081%2Finspector%2Fdebug%3Fdevice%3D0%26page%3D-1",
        "type": "node",
        "webSocketDebuggerUrl": "ws://[::1]:8081/inspector/debug?device=0&page=-1",
        "vm": "don't use"
      }
    ]
    ```
    

### Hermes에서 Remote Debugging을 사용할 수 있나요?

[remote debugging](/more/glossary-of-terms#remote-debugging)의 여러 한계 중 하나는 [JSI](https://github.com/react-native-community/discussions-and-proposals/issues/91) 위에 구축된 모듈, 예를 들어 [`react-native-reanimated`](https://github.com/software-mansion/react-native-reanimated) 버전 2 이상에서는 동작하지 않는다는 점입니다.

Hermes는 [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/v8/)을 지원하므로, 데스크톱 Chrome 탭 안에서 JavaScript를 실행하는 remote debugging과 달리 기기에서 실행 중인 엔진에 직접 연결해 JavaScript를 제자리에서 디버깅할 수 있습니다. Hermes 앱은 Expo Go 또는 development build에서 debugger를 열면 자동으로 이 디버깅 기법을 사용합니다.
