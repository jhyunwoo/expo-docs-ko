---
modificationDate: August 01, 2025
title: React Server Components 테스트하기
description: Expo에서 React Server Components용 unit test를 작성하는 방법을 알아보세요.
platforms: ['android', 'ios', 'web']
---

# React Server Components 테스트하기

Expo에서 React Server Components용 unit test를 작성하는 방법을 알아보세요.
Android, iOS, Web

> 이 가이드는 아직 개발 중인 실험적 기능인 React Server Components를 다룹니다.

React Server Components(RSC)는 서버에서 렌더링되고 클라이언트에서 hydrate될 수 있는 컴포넌트를 만들 수 있게 해주는 React의 새로운 기능입니다. 이 가이드는 프로젝트에서 RSC용 unit test를 작성하는 방법을 자세히 설명합니다.

## Jest testing

React Server Components는 Node.js에서 실행됩니다. 즉 Node.js와 웹 브라우저 사이의 통신을 위해 Jest preset이 필요한 클라이언트 기반 테스트와 달리, Jest만으로도 서버 측 렌더링 환경을 상당히 가깝게 에뮬레이션할 수 있습니다.

### Setup

표준 server rendering은 웹 전용이지만, Expo의 범용 RSC 번들은 각 플랫폼에 맞는 custom server renderer를 포함합니다. 이는 플랫폼별 파일 확장자를 지원한다는 뜻입니다. 예를 들어 iOS 앱용 Server Component를 작성할 때는 **\*.ios.js** 및 **\*.native.ts** 같은 플랫폼별 확장자가 resolve됩니다.

`jest-expo`는 Server Components 테스트를 위한 몇 가지 다른 preset을 제공합니다:

| Runner | Description |
| --- | --- |
| `jest-expo/rsc/android` | Android 전용 RSC runner입니다. **\*.android.js**, **\*.native.js**, **\*.js** 파일을 사용합니다. |
| `jest-expo/rsc/ios` | iOS 전용 RSC runner입니다. **\*.ios.js**, **\*.native.js**, **\*.js** 파일을 사용합니다. |
| `jest-expo/rsc/web` | 웹 전용 RSC runner입니다. **\*.web.js** 및 **\*.js** 파일을 사용합니다. |
| `jest-expo/rsc` | 위 runner들을 결합한 multi-runner입니다. |

RSC용으로 Jest를 설정하려면 프로젝트 루트에 **jest-rsc.config.js** 파일을 만드세요:

```js
module.exports = require('jest-expo/rsc/jest-preset');
```

그런 다음 **package.json**에 `test:rsc` 같은 스크립트를 추가할 수 있습니다:

```json
{
  "scripts": {
    "test:rsc": "jest --config jest-rsc.config.js"
  }
}
```

### Writing tests

Jest가 클라이언트 테스트를 서버에서 실행하지 않도록 테스트는 **__rsc_tests__** 디렉터리에 작성해야 합니다.

```tsx
/// <reference types="jest-expo/rsc/expect" />

import { LinearGradient } from 'expo-linear-gradient';

it(`renders to RSC`, async () => {
  const jsx = (
    <LinearGradient
      colors={['cyan', '#ff00ff', 'rgba(0,0,0,0)', 'rgba(0,255,255,0.5)']}
      testID="gradient"
    />
  );

  await expect(jsx).toMatchFlight(`1:I["src/LinearGradient.tsx",[],"LinearGradient"]
0:["$","$L1",null,{"colors":["cyan","#ff00ff","rgba(0,0,0,0)","rgba(0,255,255,0.5)"],"testID":"gradient"},null]`);
});
```

테스트 파일에서 import한 모든 코드는 서버 환경에서 실행됩니다. `react-server`나 `server-only` 같은 server-only 모듈을 import할 수 있습니다. 이는 라이브러리가 RSC와 호환되는지 판단하는 데 유용합니다.

### Custom expect matchers

RSC용 `jest-expo`는 Jest의 `expect`에 몇 가지 custom matcher를 추가합니다:

-   `toMatchFlight`: Expo CLI의 렌더링에 대한 pseudo-implementation을 사용해 JSX element를 렌더링하고 flight string과 비교합니다.
-   `toMatchFlightSnapshot`: `toMatchFlight`와 같지만 flight string을 snapshot 파일로 저장합니다.

내부적으로 이 메서드들은 RSC를 렌더링하는 데 필요한 프레임워크 동작 일부를 처리합니다. 컴포넌트의 render stream은 문자열로 버퍼링된 뒤 한 번에 비교됩니다. 또는 렌더링 진행 상황을 관찰하기 위해 직접 수동으로 스트리밍할 수도 있습니다.

컴포넌트 렌더링에 실패하면 matcher는 테스트를 실패시키기 위해 오류를 던집니다. 실제로는 server renderer가 `E:` 라인을 생성하고, 이것이 클라이언트로 전송되어 사용자 쪽에서 로컬로 throw됩니다.

### Running tests

`test:rsc` 스크립트로 테스트를 실행할 수 있습니다:

```sh
yarn test:rsc --watch
```

multi-runner를 사용 중이라면 `--selectProjects` 플래그를 사용해 특정 프로젝트를 선택할 수 있습니다. 다음 예시는 웹 플랫폼만 실행합니다:

```sh
yarn test:rsc --watch --selectProjects rsc/web
```

### Environments

RSC 번들링 환경에서는 다음과 같은 파일을 import할 수 있습니다

## Tips

모듈이 클라이언트 또는 서버에서 import되면 안 된다는 점을 보장하려면 `server-only`와 `client-only` 모듈을 사용하세요:

```js
import 'server-only';
```

RSC는 기본적으로 package export를 지원합니다. `react-server` 조건을 사용해 모듈에서 어떤 파일이 import될지 바꿀 수 있습니다:

```json
{
  "exports": {
    ".": {
      "react-server": "./index.react-server.js",
      "default": "./index.js"
    }
  }
}
```

RSC용으로 번들링할 때는 모든 모듈이 React Server mode로 번들링되며, `"use client"` directive로 opt out할 수 있습니다. `"use client"`가 발견되면 해당 모듈은 클라이언트 모듈에 대한 async reference가 됩니다.

`"use server"`는 `"use client"`의 반대 개념이 아닙니다. 대신 React Server Functions 파일을 정의하는 데 사용됩니다.
