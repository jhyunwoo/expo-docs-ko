---
modificationDate: February 26, 2026
title: Troubleshooting
description: Expo Router 설정에서 자주 발생하는 문제를 해결하세요.
---

# Troubleshooting

Expo Router 설정에서 자주 발생하는 문제를 해결하세요.

## Missing files or source maps in React Native DevTools

Chrome DevTools의 ignore list 안에 exclusion이 있으면 이런 일이 발생할 수 있습니다. 문제를 해결하려면 [React Native DevTools](https://reactnative.dev/docs/react-native-devtools)를 사용하세요:

1.  터미널 창에서 실행 중인 development server에서 `j`를 눌러 React Native DevTools를 시작합니다
2.  gear icon을 클릭해 **Settings**를 엽니다
3.  **Extensions** 아래에서 **Restore defaults and reload**를 클릭합니다
4.  다시 **Settings**를 열고 **Ignore List** tab으로 이동합니다
5.  `/node_modules/`에 대한 exclusion이 있다면 모두 체크 해제합니다

## `EXPO_ROUTER_APP_ROOT` not defined

`process.env.EXPO_ROUTER_APP_ROOT`가 정의되지 않았다면 다음 오류가 표시됩니다:

```sh
Invalid call at line 11: process.env.EXPO_ROUTER_APP_ROOT First argument of require.context should be a string.
```

이 문제는 프로젝트 **babel.config.js**에서 Babel plugin `expo-router/babel`을 사용하지 않을 때 발생할 수 있습니다. 다음과 같이 cache를 지워볼 수 있습니다:

```sh
npx expo start --clear
```

또는 프로젝트 루트에 다음 내용을 가진 **index.js** 파일을 만들어 이 문제를 우회할 수 있습니다:

```jsx
import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
```

그런 다음 **package.json**에서 앱의 main entry point를 업데이트하세요:

```json
{
  "main": "index.js"
  ... 
}
```

> 다른 위치에서의 사용을 고려하지 못하므로, 이를 이용해 root 디렉터리(**app**)를 바꾸지는 마세요.

## `require.context` not enabled

context module을 활성화하지 않는 custom 버전의 `@expo/metro-config`를 사용할 때 이런 일이 발생할 수 있습니다. Expo Router는 프로젝트의 **metro.config.js**가 기본 설정으로 `expo-router/metro`를 사용해야 합니다. **metro.config.js**를 삭제하거나 `expo/metro-config`를 확장하세요. 자세한 내용은 [Customizing metro](/guides/customizing-metro)를 참고하세요.

## Missing back button

modal이나 back button이 있어야 하는 다른 screen을 설정했다면, 초기 route가 구성되도록 route의 layout에 [`unstable_settings`](/router/advanced/router-settings)를 추가해야 합니다. Initial route는 모바일 앱에 다소 고유한 개념이라 시스템에 어색하게 들어맞습니다. 개선은 예정되어 있습니다.

```tsx
export const unstable_settings = {
  initialRouteName: 'index',
};
```
