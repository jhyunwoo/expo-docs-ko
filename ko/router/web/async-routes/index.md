---
modificationDate: December 30, 2025
title: Async routes
description: Expo Router에서 async bundling으로 개발 속도를 높이는 방법을 알아보세요.
---

# Async routes

Expo Router에서 async bundling으로 개발 속도를 높이는 방법을 알아보세요.

> Async routes는 alpha 단계입니다.

Expo Router는 [React Suspense](https://react.dev/reference/react/Suspense)를 사용해 route file을 기준으로 JavaScript bundle을 자동으로 분할할 수 있습니다. 이렇게 하면 이동하는 route만 bundle되거나 memory에 로드되므로 개발 속도가 더 빨라집니다. 또한 애플리케이션의 초기 bundle 크기를 줄이는 데도 유용할 수 있습니다.

Hermes Engine을 사용하는 앱은 bytecode가 이미 미리 memory mapped되므로 bundle splitting의 이점을 그렇게 크게 얻지는 못합니다. 하지만 over-the-air update, React Server Components, web 지원에는 도움이 됩니다.

> **네이티브 플랫폼에서** production으로 번들링할 때는 모든 suspense boundary가 **비활성화**되며 loading state도 존재하지 않습니다.

## How it works

모든 Route는 suspense boundary 안에 감싸지고 비동기적으로 로드됩니다. 즉, 어떤 route로 처음 이동할 때는 로드에 시간이 조금 더 걸립니다. 하지만 한 번 로드되면 cache되므로 이후 방문은 즉시 이루어집니다.

Loading error는 부모 route에서 [`ErrorBoundary`](/router/error-handling#errorboundary) export를 통해 처리됩니다.

Async route는 development 중에는 정적으로 분석할 수 없으므로, 기본 component를 export하지 않더라도 모든 file이 route로 취급됩니다. Component가 bundle되고 로드된 뒤에는 유효하지 않은 route가 fallback warning screen을 사용하게 됩니다.

고급 bundling 기법에 익숙한 분이라면, async routes 기능은 [React Suspense](https://react.dev/reference/react/Suspense), [route-based bundle splitting](https://legacy.reactjs.org/docs/code-splitting.html#route-based-code-splitting), 그리고 development에서의 [lazy bundling](https://github.com/react-native-community/discussions-and-proposals/blob/main/proposals/0605-lazy-bundling.md)으로 구성되어 있다고 이해하시면 됩니다.

## Setup

[app config](/versions/latest/config/app)의 Expo Router config plugin에서 `asyncRoutes` option을 설정해 이 기능을 활성화하세요:

> Production bundle splitting을 활성화하려면 `asyncRoutes`를 `true`로 설정하세요.

```json
{
  "expo": {
    "plugins": [
      [
        "expo-router",
        {
          "origin": "https://acme.com",
          "asyncRoutes": {
            "web": true,
            "default": "development"
          }
        }
      ]
    ]
  }
}
```

Object를 사용하면 `asyncRoutes`에 대해 플랫폼별 설정(`default`, `android`, `ios`, `web`)을 지정할 수 있습니다:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-router",
        {
          "origin": "https://acme.com",
          "asyncRoutes": {
            "web": true,
            "android": false,
            "default": "development"
          }
        }
      ]
    ]
  }
}
```

그런 다음 프로젝트를 시작하려고 할 때 Metro cache를 지우기 위해 `--clear` flag를 사용할 수 있습니다. 이렇게 하면 route가 비동기적으로 로드됩니다:

```sh
npx expo start --clear
npx expo export --clear
```

## Static rendering

Static rendering은 production web app에서 지원됩니다. Node.js에서 모든 Suspense boundary를 동기적으로 렌더링한 다음, 특정 HTML file에 대해 선택된 모든 route를 기준으로 HTML 안에서 모든 async chunk를 서로 연결하는 방식입니다. 이렇게 하면 server navigation에서 loading state가 연쇄적으로 발생하는 문제를 피할 수 있습니다. 이후 navigation에서는 누락된 chunk를 재귀적으로 로드합니다.

일관된 첫 렌더링을 보장하기 위해, 어떤 URL의 leaf route까지 이어지는 모든 layout route가 초기 server response에 포함됩니다.

`unstable_settings = { initialRouteName: '...' }`로 정의된 모든 initial route는 첫 렌더링에 필요하므로 초기 HTML file에 포함됩니다. 예를 들어 server request가 modal용이라면, modal 아래에 렌더링되는 screen도 modal이 올바르게 렌더링되도록 함께 포함됩니다.

## Caveats

Async Routes는 앞으로 [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)를 지원하기 위해 계획 중인 방향의 초기 미리보기입니다. 따라서 다음과 같은 주의 사항이 있습니다:

-   Async Routes는 아직 네이티브 production app을 지원하지 않습니다.
-   Development에서는 runtime JavaScript가 lazy bundling되므로 HTML이 사용 가능한 JavaScript와 일치하지 않는 경우를 만날 수 있습니다.
-   현재는 loading state를 사용자화할 수 없습니다.
