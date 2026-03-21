---
modificationDate: December 11, 2025
title: dev tools plugin 만들기
description: 개발 경험을 향상시키기 위한 dev tools plugin을 만드는 방법을 알아보세요.
---

# dev tools plugin 만들기

개발 경험을 향상시키기 위한 dev tools plugin을 만드는 방법을 알아보세요.

> **팁:** 완전한 예시는 [Expo DevTools Plugins](https://github.com/expo/dev-plugins)를 확인하세요.

공통 프레임워크나 라이브러리의 특정 측면을 검사하기 위한 것이든, custom code에 특화된 것이든 dev tools plugin을 만들 수 있습니다. 이 가이드는 dev tools plugin을 만드는 과정을 안내합니다.

## dev tools plugin이란 무엇인가요?

dev tools plugin은 로컬 개발 환경의 웹 브라우저에서 실행되며 Expo 앱과 연결됩니다.

plugin은 세 가지 핵심 요소로 구성됩니다:

-   dev tools 웹 사용자 인터페이스를 표시하는 Expo 앱
-   Expo CLI가 인식하기 위한 **expo-module.config.json**
-   앱이 dev tool의 웹 인터페이스와 양방향으로 통신할 수 있도록 하는 `expo/devtools` API 호출

plugin은 npm에 배포하거나 앱의 monorepo 내부에 포함할 수 있습니다. 일반적으로 앱이 debug 모드에서 실행될 때 웹 인터페이스와 양방향 통신을 시작하기 위해 앱의 root component에서 사용할 수 있는 단일 hook을 export합니다.

## plugin 만들기

### 새 plugin 프로젝트 만들기

`create-dev-plugin`이 새 plugin 프로젝트를 설정해 줍니다. 새 plugin 프로젝트를 만들려면 다음 명령을 실행하세요:

```sh
npx create-dev-plugin@latest
```

`create-dev-plugin`은 plugin 이름, 설명, 그리고 plugin 사용자가 사용할 hook의 이름을 물어봅니다.

plugin 프로젝트에는 다음 디렉터리가 포함됩니다:

-   **src** - 사용하는 앱 내부에서 plugin과 연결할 때 사용할 hook을 export합니다.
-   **webui** - plugin의 웹 사용자 인터페이스가 들어 있습니다.

### plugin 기능 사용자 지정하기

template에는 plugin과 앱 사이에서 메시지를 주고받는 간단한 예제가 포함되어 있습니다. `expo/devtools`에서 import하는 `useDevToolsPluginClient`는 plugin과 앱 사이에서 메시지를 주고받는 기능을 제공합니다.

`useDevToolsPluginClient`가 반환하는 client 객체에는 다음이 포함됩니다:

### `addMessageListener`

입력한 문자열과 일치하는 메시지를 수신하고, 메시지 데이터와 함께 callback을 호출합니다.

```jsx
const client = useDevToolsPluginClient('my-devtools-plugin');
client.addMessageListener('ping', data => {
  alert(`Received ping from ${data.from}`);
});
```

### `sendMessage`

입력한 문자열과 일치하는 메시지를 전송합니다.

```jsx
const client = useDevToolsPluginClient('my-devtools-plugin');
client?.sendMessage('ping', { from: 'web' });
```

앱의 진단 정보를 표시하거나 테스트 시나리오를 트리거하는 사용자 인터페이스를 사용자 지정하려면 **webui** 디렉터리 안의 Expo 앱을 수정하세요:

```tsx
import { useDevToolsPluginClient, type EventSubscription } from 'expo/devtools';
import { useEffect } from 'react';

export default function App() {
  const client = useDevToolsPluginClient('my-devtools-plugin');

  useEffect(() => {
    const subscriptions: EventSubscription[] = [];

    subscriptions.push(
      client?.addMessageListener('ping', data => {
        alert(`Received ping from ${data.from}`);
      })
    );

    return () => {
      for (const subscription of subscriptions) {
        subscription?.remove();
      }
    };
  }, [client]);
}
```

plugin으로 어떤 진단 정보를 보낼지, 또는 웹 사용자 인터페이스의 메시지에 앱이 어떻게 응답할지를 사용자 지정하려면 **src** 디렉터리의 hook을 수정하세요:

```tsx
import { useDevToolsPluginClient } from 'expo/devtools';

export function useMyDevToolsPlugin() {
  const client = useDevToolsPluginClient('my-devtools-plugin');

  const sendPing = () => {
    client?.sendMessage('ping', { from: 'app' });
  };

  return {
    sendPing,
  };
}
```

hook을 업데이트해 앱이 호출할 함수를 반환하도록 했다면, 앱이 debug 모드에서 실행되지 않을 때 no-op 함수를 export하도록 **src/index.ts**도 업데이트해야 합니다:

```diff
if (process.env.NODE_ENV !== 'production') {
  useMyDevToolsPlugin = require('./useMyDevToolsPlugin').useMyDevToolsPlugin;
} else {
  useMyDevToolsPlugin = () => ({
+    sendPing: () => {},
  });
}
```

## plugin 테스트하기

plugin 웹 UI는 Expo 앱이므로, 브라우저에서만 실행한다는 점을 제외하면 `npx expo start`로 다른 Expo 앱을 테스트하듯이 테스트할 수 있습니다. template에는 로컬 개발 모드에서 plugin을 실행하기 위한 편의 명령이 포함되어 있습니다:

```sh
npm run web:dev
```

## 배포를 위해 plugin 빌드하기

plugin을 배포하거나 monorepo 내에서 사용하기 위해 준비하려면 다음 명령으로 plugin을 build해야 합니다:

```sh
npm run build:all
```

이 명령은 hook 코드를 **build** 디렉터리에, 웹 사용자 인터페이스를 **dist** 디렉터리에 build합니다.

## plugin 사용하기

앱의 root component에 plugin의 hook을 import하고 호출해 앱을 plugin에 연결하세요:

```jsx
import { useMyDevToolsPlugin } from 'my-devtools-plugin';
import { Button } from 'react-native';

export default function App() {
  const { sendPing } = useMyDevToolsPlugin();

  return (
    <View style={styles.container}>
      <Button
        title="Ping"
        onPress={() => {
          sendPing();
        }}
      />
    </View>
  );
}
```
