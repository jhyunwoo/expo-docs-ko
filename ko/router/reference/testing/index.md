---
modificationDate: February 28, 2026
title: Testing configuration for Expo Router
description: Expo Router를 사용할 때 앱의 integration test를 만드는 방법을 알아보세요.
---

# Testing configuration for Expo Router

Expo Router를 사용할 때 앱의 integration test를 만드는 방법을 알아보세요.

Expo Router는 파일 시스템에 의존하므로 integration test를 위한 mock을 설정할 때 어려움이 생길 수 있습니다. Expo Router의 submodule인 `expo-router/testing-library`는 널리 사용되는 [`@testing-library/react-native`](https://callstack.github.io/react-native-testing-library/) 위에 구축된 테스트 유틸리티 모음이며, 테스트용으로 사전 구성된 in-memory Expo Router 앱을 빠르게 만들 수 있게 해줍니다.

## Configuration

계속 진행하기 전에 프로젝트에서 [Unit testing with Jest](/develop/unit-testing)와 [`@testing-library/react-native`](https://callstack.github.io/react-native-testing-library/docs/start/quick-start)에 따라 `jest-expo`를 설정했는지 확인하세요.

> **Note**: Expo Router를 사용할 때는 test 파일을 **app** 디렉터리 안에 두지 마세요. **app** 디렉터리 안의 모든 파일은 route 또는 layout 파일이어야 합니다. 대신 **__tests__** 디렉터리나 별도의 디렉터리를 사용하세요. 이 접근 방식은 [Unit testing with Jest](/develop/unit-testing#structure-your-tests)에서 설명합니다.

## `renderRouter`

`renderRouter`는 [`render`](https://callstack.github.io/react-native-testing-library/docs/api#render)의 기능을 확장해 Expo Router와 함께하는 테스트를 단순하게 만들어 줍니다. [`render`](https://callstack.github.io/react-native-testing-library/docs/api#render)와 동일한 query object를 반환하며, [`screen`](https://callstack.github.io/react-native-testing-library/docs/api#screen)과 호환되므로 표준 [query API](https://callstack.github.io/react-native-testing-library/docs/api/queries)를 사용해 component를 찾을 수 있습니다.

`renderRouter`는 `render`와 동일한 [options](https://callstack.github.io/react-native-testing-library/docs/api#render-options)를 받으며, deep-linking을 시뮬레이션하기 위한 초기 route를 설정하는 추가 option `initialUrl`을 도입합니다.

### `Inline file system`

`renderRouter(mock: Record<string, ReactComponent>, options: RenderOptions)`

`renderRouter`는 첫 번째 parameter로 object를 전달하면 file system을 inline-mocking할 수 있습니다. object의 key는 mock filesystem path입니다. **이 path를 정의할 때는 앞에 상대(`./`) 또는 절대(`/`) 표기를 사용하지 말고 file extension도 제외하세요.**

```tsx
import { renderRouter, screen } from 'expo-router/testing-library';
import { View } from 'react-native';

it('my-test', async () => {
  const MockComponent = jest.fn(() => <View />);

  renderRouter(
    {
      index: MockComponent,
      'directory/a': MockComponent,
      '(group)/b': MockComponent,
    },
    {
      initialUrl: '/directory/a',
    }
  );

  expect(screen).toHavePathname('/directory/a');
});
```

### ``인라인 file system과 `null` component``

`renderRouter(mock: string[], options: RenderOptions)`

`renderRouter`에 문자열 배열을 제공하면 `null` component(`{ default: () => null }`)로 구성된 inline mock filesystem을 만듭니다. 이는 route의 출력은 테스트할 필요가 없는 시나리오를 테스트할 때 유용합니다.

```tsx
import { renderRouter, screen } from 'expo-router/testing-library';

it('my-test', async () => {
  renderRouter(['index', 'directory/a', '(group)/b'], {
    initialUrl: '/directory/a',
  });

  expect(screen).toHavePathname('/directory/a');
});
```

### `Path to fixture`

`renderRouter(fixturePath: string, options: RenderOptions)`

`renderRouter`는 기존 fixture를 mock하기 위해 디렉터리 path를 받을 수 있습니다. 제공하는 path는 현재 test 파일을 기준으로 한 상대 경로여야 합니다.

```tsx
import { renderRouter } from 'expo-router/testing-library';
import { View } from 'react-native';

it('my-test', async () => {
  const MockComponent = jest.fn(() => <View />);
  renderRouter('./my-test-fixture');
});
```

### `Path to the fixture with overrides`

`renderRouter({ appDir: string, overrides: Record<string, ReactComponent>}, options: RenderOptions)`

더 복잡한 테스트 시나리오를 위해 `renderRouter`는 디렉터리 path와 inline-mocking 방식을 동시에 사용할 수 있습니다. `appDir` parameter는 디렉터리를 가리키는 pathname 문자열을 받습니다. `overrides` parameter는 `appDir` 내의 특정 path를 override하는 데 사용할 수 있는 inline mock입니다. 이 조합을 통해 mock 환경을 세밀하게 제어할 수 있습니다.

```tsx
import { renderRouter } from 'expo-router/testing-library';
import { View } from 'react-native';

it('my-test', async () => {
  const MockAuthLayout = jest.fn(() => <View />);
  renderRouter({
    appDir: './my-test-fixture',
    overrides: {
      'directory/(auth)/_layout': MockAuthLayout,
    },
  });
});
```

## Jest matchers

다음 matcher가 `expect`에 추가되었으며 `screen`의 값을 검증하는 데 사용할 수 있습니다.

### `toHavePathname()`

현재 pathname이 주어진 문자열과 일치하는지 검증합니다. 이 matcher는 현재 `screen`에서 [`usePathname`](/versions/latest/sdk/router#usepathname) hook의 값을 사용합니다.

```tsx
expect(screen).toHavePathname('/my-router');
```

### `toHavePathnameWithParams()`

URL parameter를 포함한 현재 pathname이 주어진 문자열과 일치하는지 검증합니다. 이는 web browser에 표시되는 URL을 검증할 때 유용합니다.

```tsx
expect(screen).toHavePathnameWithParams('/my-router?hello=world');
```

### `toHaveSegments()`

현재 segment가 문자열 배열과 일치하는지 검증합니다. 이 matcher는 현재 `screen`에서 [`useSegments`](/versions/latest/sdk/router#usesegments) hook의 값을 사용합니다.

```tsx
expect(screen).toHaveSegments(['[id]']);
```

### `useLocalSearchParams()`

현재 local URL parameter가 object와 일치하는지 검증합니다. 이 matcher는 현재 `screen`에서 [`useLocalSearchParams`](/versions/latest/sdk/router#uselocalsearchparams) hook의 값을 사용합니다.

```tsx
expect(screen).useLocalSearchParams({ first: 'abc' });
```

### `useGlobalSearchParams()`

일치하는 값을 기준으로 현재 screen의 pathname을 검증합니다. 비교는 [`useGlobalSearchParams`](/versions/latest/sdk/router#useglobalsearchparams) hook의 값을 사용해 수행됩니다.

현재 global URL parameter가 object와 일치하는지 검증합니다. 이 matcher는 현재 `screen`에서 [`useGlobalSearchParams`](/versions/latest/sdk/router#useglobalsearchparams) hook의 값을 사용합니다.

```tsx
expect(screen).useGlobalSearchParams({ first: 'abc' });
```

### `toHaveRouterState()`

현재 router state가 object와 일치하는지 검증하는 고급 matcher입니다.

```tsx
expect(screen).toHaveRouterState({
  routes: [{ name: 'index', path: '/' }],
});
```
