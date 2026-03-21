---
modificationDate: May 01, 2025
title: Dev tools plugins
description: Expo 프로젝트를 검사하고 디버그하기 위해 dev tools plugin을 사용하는 방법을 알아보세요.
---

# Dev tools plugins

Expo 프로젝트를 검사하고 디버그하기 위해 dev tools plugin을 사용하는 방법을 알아보세요.

dev tools plugin은 앱을 디버그하는 데 도움이 되도록 로컬 개발 환경에서 사용할 수 있습니다. 프로젝트에 추가하는 소량의 코드로 구성되며, 앱과 외부 Chrome 창 사이의 양방향 통신을 가능하게 합니다. 이 설정을 통해 앱을 검사하고, 테스트를 위해 특정 동작을 트리거하고, 그 외 다양한 작업을 수행할 수 있는 표시 도구를 제공합니다.

dev tools plugin은 Development build와 Expo Go에서 사용할 수 있는 Flipper plugin과 비슷하며, 프로젝트에 native module이나 config plugin을 추가할 필요가 없습니다.

## 프로젝트에 dev tools plugin 추가하기

앱에 dev tool plugin을 추가하려면 package로 설치하고, 코드를 앱에 연결하는 작은 snippet을 추가하세요. 이 코드는 앱의 root component에서 호출되어 앱과 plugin 사이에 양방향 통신을 설정합니다. 그러면 plugin은 앱이 development mode로 실행되는 전체 시간 동안 앱의 여러 측면을 검사할 수 있습니다.

모든 [Expo dev tools plugins](/debugging/devtools-plugins#expo-dev-tools-plugins)과 [our creation tool](/debugging/create-devtools-plugins)로 만든 plugin은 앱에 plugin을 연결하는 데 사용할 수 있는 hook을 export합니다. 이 hook과 hook이 반환하는 함수는 앱이 development mode에서 실행되지 않을 때 no-op으로 동작합니다.

일부 plugin hook은 plugin이 앱을 검사하는 방식과 관련된 parameter를 요구합니다. 예를 들어 React Navigation 상태를 검사하는 plugin은 navigation root에 대한 reference를 요구할 수 있습니다.

plugin 사용을 시작하려면 앱의 root component에서 hook을 사용하세요:

```jsx
import { useMyDevToolsPlugin } from 'my-devtools-plugin';

export default App() {
  useMyDevToolsPlugin();
  return (/* rest of your app */)
}
```

경우에 따라 plugin과 직접 상호작용해야 할 수도 있습니다. 모든 plugin은 `expo/devtools`의 export를 통해 통신하며, `useDevToolsPluginClient`를 통해 메시지를 보내고 받을 수 있습니다. `useDevToolsPluginClient`에는 plugin의 웹 사용자 인터페이스에서 사용하는 것과 동일한 plugin 이름을 전달해야 합니다:

```jsx
import { useDevToolsPluginClient } from 'expo/devtools';

export default App() {
  const client = useDevToolsPluginClient('my-devtools-plugin');
   useEffect(() => {
    // receive messages
    client?.addMessageListener("ping", (data) => {
      alert(`Received ping from ${data.from}`);
    });
    // send messages
    client?.sendMessage("ping", { from: "app" });
   }, []);

  return (/* rest of your app */)
}
```

### Expo Go 및 Development build와의 호환성

dev tools plugin에는 JavaScript 코드만 포함되어야 합니다. 일반적으로 Expo Go와 [Development builds](/develop/development-builds/introduction)에서 호환되며, plugin을 추가하기 위해 새 development build를 만들 필요가 없습니다. plugin이 검사하는 package의 기반 module에 native code가 포함되어 있고 그것이 Expo Go의 일부가 아니라면, 해당 package의 component와 plugin을 모두 사용하려면 새 development build를 만드세요.

예를 들어 [React Native Firebase](/guides/using-firebase#using-react-native-firebase)를 검사하는 dev tools plugin은 Expo Go에서는 동작하지 않습니다. React Native Firebase에는 Expo Go에 포함되지 않은 native code가 들어 있습니다. dev tools plugin과 React Native Firebase를 함께 사용하려면 development build를 만드세요.

## dev tools plugin 사용하기

dev tools plugin을 설치하고 프로젝트에 필요한 연결 코드를 추가한 뒤에는 `npx expo start`로 dev server를 시작할 수 있습니다. 그런 다음 shift + m을 눌러 사용 가능한 dev tools plugin 목록을 여세요. 사용하려는 plugin을 선택하면 새 Chrome 창에서 열립니다.

> Expo CLI로 dev server를 시작할 때 ? 를 눌러 **show all commands**를 표시할 수 있습니다. 여기에는 **more tools**를 여는 단축키를 포함한 추가 명령이 표시됩니다. dev tools plugin도 이 메뉴에서 선택할 수 있습니다.

## Expo dev tools plugins

Expo는 일반적인 디버깅 작업을 위한 몇 가지 dev tools plugin을 제공합니다. 아래 지침에 따라 앱에서 사용을 시작하세요.

> **참고**: 아래의 각 dev tools plugin hook은 development mode에서만 plugin을 활성화합니다. production bundle에는 영향을 주지 않습니다.

### React Navigation

[`@react-navigation/devtools`](https://github.com/react-navigation/react-navigation/tree/main/packages/devtools)에서 영감을 받은 React Navigation dev tools plugin은 [React Navigation](https://reactnavigation.org/) action과 상태의 기록을 볼 수 있게 해 줍니다. navigation 기록의 이전 지점으로 되돌아가거나 앱으로 deep link를 보낼 수도 있습니다. Expo Router는 React Navigation 위에 구축되어 있기 때문에, 이 plugin은 [Expo Router](/router/introduction)와 완전히 호환됩니다.

plugin을 사용하려면 먼저 package를 설치하세요:

```sh
npx expo install @dev-plugins/react-navigation
```

앱의 entry point에서 navigation root를 plugin에 전달하세요:

```jsx
import { useEffect, useRef } from 'react';
import { useNavigationContainerRef, Slot } from 'expo-router';
import { useReactNavigationDevTools } from '@dev-plugins/react-navigation';

export default Layout() {
  const navigationRef = useNavigationContainerRef();

  useReactNavigationDevTools(navigationRef);

  return <Slot />;
}
```

터미널에서 `npx expo start`를 실행하고, shift + m을 눌러 dev tools 목록을 연 다음, React Navigation plugin을 선택하세요. 그러면 plugin의 웹 인터페이스가 열리고, 앱을 탐색하는 동안 navigation 기록이 표시됩니다.

### Apollo Client

[`react-native-apollo-devtools`](https://github.com/razorpay/react-native-apollo-devtools)에서 영감을 받은 Apollo Client dev tools plugin은 Apollo Client의 cache, query, mutation을 검사할 수 있게 해 줍니다.

plugin을 사용하려면 먼저 package를 설치하세요:

```sh
npx expo install @dev-plugins/apollo-client
```

그런 다음 앱의 root component나 앱의 나머지 부분을 `ApolloProvider`로 감싸는 위치에서 client instance를 plugin에 전달하세요:

```jsx
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { useApolloClientDevTools } from '@dev-plugins/apollo-client';

const client = new ApolloClient({
  uri: 'https://demo.test.com/',
  cache: new InMemoryCache(),
});

export default function App() {
  useApolloClientDevTools(client);

  return <ApolloProvider>{/* ... */}</ApolloProvider>;
}
```

터미널에서 `npx expo start`를 실행하고, shift + m을 눌러 dev tools 목록을 연 다음, Apollo Client plugin을 선택하세요. 그러면 plugin의 웹 인터페이스가 열리고, 앱이 Apollo Client 작업을 수행하는 동안 query 기록, cache, mutation이 표시됩니다.

### React Query

[`react-query-native-devtools`](https://github.com/bgaleotti/react-query-native-devtools)에서 영감을 받은 React Query dev tools plugin은 [TanStack Query](https://tanstack.com/query/latest/)의 데이터와 query, cache 상태를 탐색하고, cache에서 query를 다시 가져오거나 제거할 수 있게 해 줍니다.

plugin을 사용하려면 먼저 package를 설치하세요:

```sh
npx expo install @dev-plugins/react-query
```

그런 다음 앱의 root component나 앱의 나머지 부분을 `QueryClientProvider`로 감싸는 위치에서 client instance를 plugin에 전달하세요:

```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useReactQueryDevTools } from '@dev-plugins/react-query';

const queryClient = new QueryClient({});

export default function App() {
  useReactQueryDevTools(queryClient);

  return <QueryClientProvider client={queryClient}>{/* ... */}</QueryClientProvider>;
}
```

터미널에서 `npx expo start`를 실행하고, shift + m을 눌러 dev tools 목록을 연 다음, React Query plugin을 선택하세요. 그러면 plugin의 웹 인터페이스가 열리고, 앱에서 query가 사용될 때 해당 query가 표시됩니다.

### Redux

`redux-devtools-expo-dev-plugin`은 [Redux DevTools](https://github.com/reduxjs/redux-devtools/)를 기반으로 합니다(Chrome extension에서 제공). action의 실시간 목록과 action이 state에 미치는 영향을 제공하며, DevTools에서 action을 되감기, 재생, dispatch할 수 있습니다.

plugin을 사용하려면 먼저 package를 설치하세요:

```sh
npx expo install redux-devtools-expo-dev-plugin
```

`@reduxjs/toolkit`을 사용 중이라면 `devTools: false`를 전달해 built-in dev tools를 비활성화하도록 `configureStore` 호출을 수정하세요. 그런 다음 `devToolsEnhancer()`를 이어 붙여 Expo DevTools plugin enhancer를 추가하세요. `configureStore` 호출은 다음과 같이 보입니다:

```js
import devToolsEnhancer from 'redux-devtools-expo-dev-plugin';

const store = configureStore({
  reducer: rootReducer,
  devTools: false,
  enhancers: getDefaultEnhancers => getDefaultEnhancers().concat(devToolsEnhancer()),
});
```

터미널에서 `npx expo start`를 실행하고, shift + m을 눌러 dev tools 목록을 연 다음, `redux-devtools-expo-dev-plugin`을 선택하세요. 그러면 plugin의 웹 인터페이스가 열리고, action이 dispatch될 때 action과 store 내용이 표시됩니다.

`redux`를 `@reduxjs/toolkit` 대신 직접 사용하는 경우를 포함한 전체 설치 및 사용 지침은 [see the project's README](https://github.com/matt-oakes/redux-devtools-expo-dev-plugin)를 참고하세요.

### TinyBase

TinyBase dev tools plugin은 TinyBase Store Inspector를 앱에 연결해 앱 store의 내용을 보고 업데이트할 수 있게 해 줍니다.

plugin을 사용하려면 먼저 package를 설치하세요:

```sh
npx expo install @dev-plugins/tinybase
```

그런 다음 앱의 root component나 store의 `Provider`로 앱의 나머지를 감싸는 위치에서 client instance를 plugin에 전달하세요:

```jsx
import { createStore } from 'tinybase';
import { useValue, Provider } from 'tinybase/lib/ui-react';
import { useTinyBaseDevTools } from '@dev-plugins/tinybase';

const store = createStore().setValue('counter', 0);

export default function App() {
  useTinyBaseDevTools(store);

  return <Provider store={store}>{/* ... */}</Provider>;
}
```

터미널에서 `npx expo start`를 실행하고, shift + m을 눌러 dev tools 목록을 연 다음, Tinybase plugin을 선택하세요. 그러면 plugin의 웹 인터페이스가 열리고, store가 수정될 때 그 내용이 표시됩니다.
