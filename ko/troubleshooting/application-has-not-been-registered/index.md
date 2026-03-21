---
modificationDate: July 08, 2025
title: '"Application has not been registered" 오류'
description: Expo 또는 React Native 앱에서 Application has not been registered 오류가 무엇을 의미하는지와 이를 해결하는 방법을 알아보세요.
---

# "Application has not been registered" 오류

Expo 또는 React Native 앱에서 Application has not been registered 오류가 무엇을 의미하는지와 이를 해결하는 방법을 알아보세요.

Expo 또는 React Native 앱을 개발할 때는 다음과 같은 오류를 자주 만나게 됩니다:

```sh
Application "main" has not been registered.
Invariant Violation: "main" has not been registered.
```

이 특정 오류에서 `"main"`은 어떤 문자열이든 될 수 있습니다.

## 이 오류가 의미하는 것

### 예외 때문에 앱이 자신을 등록하지 못하고 있을 수 있습니다

이 오류의 가장 흔한 원인은 애플리케이션이 스스로를 등록하기 전에 예외가 발생하는 것입니다. React Native 애플리케이션이 로드될 때는 두 단계가 있습니다:

1.  JavaScript 코드를 로드하고, 모든 것이 성공하면 애플리케이션이 등록됩니다. 번들을 로드하는 중 예외가 발생하면 실행이 중단되고, 애플리케이션이 등록되는 부분까지 절대 도달하지 못합니다.
2.  등록된 애플리케이션을 실행합니다. 코드 로드에 실패했다면 애플리케이션은 등록되지 않으며, 이 페이지의 주제인 오류가 표시됩니다.

이 상황이라면, 지금 보고 있는 오류 메시지는 [red herring](https://en.wikipedia.org/wiki/Red_herring)입니다. 애플리케이션이 등록되지 않게 만든 실제 오류에서 여러분의 주의를 다른 곳으로 돌리고 있는 것입니다.

이 오류 메시지 이전의 로그를 살펴보고 무엇이 원인이었는지 확인하세요. 자주 있는 원인 중 하나는 자신을 view로 등록하는 네이티브 모듈 dependency의 여러 버전이 동시에 존재하는 경우입니다. 예를 들어 작성자가 dependency 안에 `react-native-safe-area-context`의 여러 버전을 가지고 있었던 [이 Stack Overflow thread](https://stackoverflow.com/questions/67543844/invariant-violation-main-has-not-been-registered-while-running-react-native-a/67550379)를 참고하세요.

### 앱의 루트 컴포넌트가 등록되지 않았을 수 있습니다

또 다른 가능성은 [`AppRegistry.registerComponent`](https://reactnative.dev/docs/appregistry#registercomponent)에 전달되는 `AppKey`와 네이티브 iOS 또는 Android 쪽에 등록되는 `AppKey` 사이에 불일치가 있는 경우입니다.

managed project에서는 기본 동작으로 `"main"`을 `AppKey`로 사용합니다. 이 부분은 자동으로 처리되며, **package.json**의 `"main"` 필드를 기본값에서 바꾸지 않는 한 그대로 잘 동작합니다. 앱 entry point를 커스터마이즈하고 싶다면 [registerRootComponent](/versions/latest/sdk/expo#registerrootcomponentcomponent) API reference를 참고하세요.

네이티브 코드가 있는 프로젝트에서는 기본적으로 **index.js**에 다음과 같은 코드가 있습니다:

```js
import { registerRootComponent } from 'expo';
import App from './App';
registerRootComponent(App);
```

여기서 `registerRootComponent`는 다음과 같이 구현됩니다:

```js
function registerRootComponent(component) {
  AppRegistry.registerComponent('main', () => component);
}
```

그리고 네이티브 쪽에서는 **AppDelegate.m**에 다음과 같은 코드가 있어야 합니다:

```objectivec
RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge moduleName:@"main" initialProperties:nil];
```

그리고 **MainActivity.java**에는 다음이 있어야 합니다:

```java
@Override
protected String getMainComponentName() {
  return "main";
}
```

기본적으로 프로젝트 전체에서 "main"이 일관되게 사용됩니다. 이 오류가 발생하고 있다면, 무언가가 변경되어 이 값들이 더 이상 일치하지 않을 가능성이 큽니다. JavaScript 쪽에서 등록하는 이름이 네이티브 쪽에서 기대하는 이름과 같은지 확인하세요(Expo의 `registerRootComponent` 함수를 사용하고 있다면 그 값은 "main"입니다).

## 기타 고려 사항

이 오류는 몇 가지 다른 상황에서도 발생할 수 있지만, 예측하기가 더 어렵고 수정 방법도 프로젝트에 더 특화될 수 있습니다. 예를 들어 다른 사례는 다음과 같습니다:

-   잘못된 프로젝트의 로컬 development server에 연결하고 있습니다. 다른 Expo CLI 또는 React Native community CLI 프로세스를 종료해 보세요(`ps -A | grep "expo\|react-native"`로 찾을 수 있습니다).
-   이 오류가 production 앱에서만 발생한다면, `npx expo start --no-dev --minify`로 앱을 로컬에서 production mode로 실행해 오류의 원인을 찾아보세요.
