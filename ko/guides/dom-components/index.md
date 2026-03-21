---
modificationDate: March 01, 2026
title: Expo 네이티브 앱에서 React DOM 사용하기
description: 'use dom' 지시어를 사용해 Expo 네이티브 앱에서 React DOM 컴포넌트를 렌더링하는 방법을 알아보세요.
---

# Expo 네이티브 앱에서 React DOM 사용하기

'use dom' 지시어를 사용해 Expo 네이티브 앱에서 React DOM 컴포넌트를 렌더링하는 방법을 알아보세요.

> **SDK 52 이상**에서 사용할 수 있습니다.

Expo는 `'use dom'` 지시어를 통해 최신 웹 코드를 네이티브 앱 안에서 직접 다룰 수 있는 새로운 접근 방식을 제공합니다. 이를 통해 전체 웹사이트를 범용 앱으로 점진적으로 마이그레이션할 수 있으며, 컴포넌트 단위로 옮겨갈 수 있습니다.

Expo 네이티브 runtime은 일반적으로 `<div>`나 `<img>` 같은 element를 지원하지 않지만, 웹 컴포넌트를 빠르게 포함해야 하는 경우가 있을 수 있습니다. 이런 경우 DOM 컴포넌트가 유용한 해법이 됩니다.

## 사전 요구 사항

프로젝트는 Expo CLI를 사용하고 Expo Metro Config를 확장해야 합니다.

이미 `npx expo [command]`로 프로젝트를 실행하고 있다면(예를 들어 `npx create-expo-app`으로 만들었다면) 준비가 완료된 상태이므로 이 단계는 건너뛰어도 됩니다.

프로젝트에 아직 `expo` package가 없다면 아래 명령으로 설치한 뒤 [Expo CLI와 Metro Config 사용을 활성화](/bare/installing-expo-modules#configure-expo-cli-for-bundling-on-android-and-ios)하세요:

```sh
npx install-expo-modules@latest
```

명령이 실패하면 [Installing Expo modules](/bare/installing-expo-modules#manual-installation) 가이드를 참고하세요.

Expo Metro Runtime, React DOM, 그리고 React Native Web

Expo Router와 Expo Web을 사용 중이라면 이 단계는 건너뛰어도 됩니다. 그렇지 않다면 다음 package를 설치하세요:

```sh
npx expo install @expo/metro-runtime react-dom react-native-web
```

## 사용 방법

프로젝트에 `react-native-webview`를 설치하세요:

```sh
npx expo install react-native-webview
```

React 컴포넌트를 DOM에 렌더링하려면 웹 컴포넌트 파일 상단에 `'use dom'` 지시어를 추가하세요:

```tsx
'use dom';

export default function DOMComponent({ name }: { name: string }) {
  return (
    <div>
      <h1>Hello, {name}</h1>
    </div>
  );
}
```

네이티브 컴포넌트 파일 안에서는 웹 컴포넌트를 import해서 사용합니다:

```tsx
import DOMComponent from './my-component.tsx';

export default function App() {
  return (
    // This is a DOM component. It re-exports a wrapped `react-native-webview` behind the scenes.
    <DOMComponent name="Europa" />
  );
}
```

## 기능

-   웹, 네이티브, DOM 컴포넌트 전반에서 bundler config를 공유합니다.
-   React, TypeScript, CSS, 그리고 다른 모든 Metro 기능을 DOM 컴포넌트에서 사용할 수 있습니다.
-   터미널 logging과 Safari/Chrome 디버깅을 지원합니다.
-   Fast Refresh와 HMR을 지원합니다.
-   오프라인 지원을 위한 embedded export를 제공합니다.
-   asset이 웹과 네이티브 전반에서 통합됩니다.
-   DOM 컴포넌트 bundle은 디버깅을 위해 [Expo Atlas](/guides/analyzing-bundles#analyzing-bundle-size-with-atlas)에서 분석할 수 있습니다.
-   네이티브 rebuild 없이 모든 웹 기능에 접근할 수 있습니다.
-   development에서 runtime error overlay를 지원합니다.
-   Expo Go를 지원합니다.

## WebView props

기본 네이티브 **WebView**에 props를 전달하려면 컴포넌트의 `dom` prop을 사용하세요. 이 prop은 모든 DOM 컴포넌트에 기본으로 포함되어 있으며, 변경하고 싶은 [`WebView` props](https://github.com/react-native-webview/react-native-webview/blob/master/docs/Reference.md)를 담은 object를 받을 수 있습니다.

```tsx
import DOMComponent from './my-component';

export default function App() {
  return (
    <DOMComponent
      dom={{
        scrollEnabled: false,
      }}
    />
  );
}
```

DOM 컴포넌트 쪽에서는 TypeScript가 이를 인식할 수 있도록 `dom` prop을 추가하세요:

```tsx
'use dom';

export default function DOMComponent({}: { dom: import('expo/dom').DOMProps }) {
  return (
    <div>
      <h1>Hello, world!</h1>
    </div>
  );
}
```

## 마샬링된 props

직렬화 가능한 props(`number`, `string`, `boolean`, `null`, `undefined`, `Array`, `Object`)를 통해 DOM 컴포넌트로 데이터를 보낼 수 있습니다. 예를 들어 네이티브 컴포넌트 파일 안에서 DOM 컴포넌트에 prop을 전달할 수 있습니다:

```tsx
import DOMComponent from './my-component';

export default function App() {
  return <DOMComponent hello={'world'} />;
}
```

웹 컴포넌트 파일 안에서는 아래 예시처럼 prop을 받을 수 있습니다:

```tsx
'use dom';

export default function DOMComponent({ hello }: { hello: string }) {
  return <p>Hello, {hello}</p>;
}
```

props는 비동기 bridge를 통해 전달되므로 동기적으로 업데이트되지 않습니다. 또한 React root 컴포넌트의 props로 전달되기 때문에 React tree 전체를 다시 렌더링합니다.

## 네이티브 action

DOM 컴포넌트에 최상위 prop으로 비동기 함수를 전달하면 type-safe한 네이티브 함수를 DOM 컴포넌트로 보낼 수 있습니다:

```tsx
import DomComponent from './my-component';

export default function App() {
  return (
    <DomComponent
      hello={(data: string) => {
        console.log('Hello', data);
      }}
    />
  );
}
```

```tsx
'use dom';

export default function MyComponent({ hello }: { hello: (data: string) => Promise<void> }) {
  return <p onClick={() => hello('world')}>Click me</p>;
}
```

> 함수는 DOM 컴포넌트에 중첩된 props로 전달할 수 없습니다. 반드시 최상위 prop이어야 합니다.

네이티브 action은 DOM 컴포넌트의 JavaScript engine으로 bridge를 통해 데이터가 전달되므로 항상 비동기이며, 직렬화 가능한 인수만 받을 수 있습니다(즉, 함수는 전달할 수 없습니다).

네이티브 action은 DOM 컴포넌트에 직렬화 가능한 데이터를 반환할 수 있으며, 이는 네이티브 쪽에서 데이터를 다시 가져와야 할 때 유용합니다.

```tsx
getDeviceName(): Promise<string> {
  return DeviceInfo.getDeviceName();
}
```

이 함수들은 React Server Function과 비슷하게 생각할 수 있지만, 서버에 있는 대신 네이티브 앱 안에 로컬로 존재하고 DOM 컴포넌트와 통신합니다. 이런 접근은 DOM 컴포넌트에 진짜 네이티브 기능을 추가할 수 있는 강력한 방법을 제공합니다.

## ref 전달하기

> 이 기능은 alpha 단계이며 앞으로 변경될 수 있습니다.

DOM 컴포넌트 안에서 `useDOMImperativeHandle` hook을 사용하면 네이티브 쪽에서 오는 ref 호출을 받을 수 있습니다. 이 hook은 React의 [`useImperativeHandle`](https://react.dev/reference/react/useImperativeHandle) hook과 비슷하지만, 별도의 ref object를 전달할 필요는 없습니다.

```tsx
import { useRef } from 'react';
import { Button, View } from 'react-native';

import MyComponent, { type DOMRef } from './my-component';

export default function App() {
  const ref = useRef<DOMRef>(null);

  return (
    <View style={{ flex: 1 }}>
      <MyComponent ref={ref} />
      <Button
        title="focus"
        onPress={() => {
          ref.current?.focus();
        }}
      />
    </View>
  );
}
```

Expo SDK 53 이상은 React 19를 사용합니다. 즉, `ref` prop이 컴포넌트에 prop으로 전달되며 컴포넌트 안에서 직접 사용할 수 있습니다.

```tsx
'use dom';

import { useDOMImperativeHandle, type DOMImperativeFactory } from 'expo/dom';
import { Ref, useRef } from 'react';

export interface DOMRef extends DOMImperativeFactory {
  focus: () => void;
}

export default function MyComponent(props: {
  ref: Ref<DOMRef>;
  dom?: import('expo/dom').DOMProps;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useDOMImperativeHandle(
    props.ref,
    () => ({
      focus: () => {
        inputRef.current?.focus();
      },
    }),
    []
  );

  return <input ref={inputRef} />;
}
```

React는 기본적으로 단방향 data flow를 지향하므로, callback을 사용해 tree 위쪽으로 다시 올라가는 개념은 관용적인 방식이 아닙니다. 따라서 동작이 불안정할 수 있으며 앞으로의 React 버전에서는 단계적으로 사라질 가능성도 있습니다. tree 위쪽으로 데이터를 다시 보내는 권장 방식은 네이티브 action을 사용해 state를 업데이트한 뒤 그 값을 DOM 컴포넌트로 다시 전달하는 것입니다.

## 기능 감지

DOM 컴포넌트는 웹사이트를 실행하는 데 사용되므로, 특정 라이브러리를 더 잘 지원하려면 추가적인 판별 조건이 필요할 수 있습니다. 아래 코드를 사용하면 컴포넌트가 DOM 컴포넌트 안에서 실행 중인지 감지할 수 있습니다:

```ts
import { IS_DOM } from 'expo/dom';
```

DOM 컴포넌트 안에서는 `process.env.EXPO_OS`가 항상 web이지만, `process.env.EXPO_DOM_HOST_OS`를 사용하면 _상위_ 플랫폼을 감지할 수 있습니다. 이 값은 최상위 네이티브 플랫폼의 OS에 따라 `ios` 또는 `android`가 되며, 웹에서는 `undefined`입니다.

## Public asset

> **경고:** 이 기능은 alpha 단계이며 앞으로 변경될 수 있습니다. Public asset은 EAS Update에서 지원되지 않습니다. 대신 로컬 asset을 불러올 때는 `require()`를 사용하세요.

루트 **public** 디렉터리의 내용은 DOM 컴포넌트에서 public asset을 사용할 수 있도록 네이티브 앱 binary로 복사됩니다. 이러한 public asset은 로컬 파일시스템에서 제공되므로, 올바른 path를 참조하려면 `process.env.EXPO_BASE_URL` prefix를 사용해야 합니다. 예를 들면 다음과 같습니다:

```tsx
<img src={`${process.env.EXPO_BASE_URL}img.png`} />
```

## 디버깅

기본적으로 WebView 안의 모든 `console.log` method는 로그를 터미널로 전달하도록 확장됩니다. 덕분에 DOM 컴포넌트 내부에서 무슨 일이 일어나는지 빠르고 쉽게 확인할 수 있습니다.

Expo는 development mode로 번들링할 때 WebView inspection과 디버깅도 활성화합니다. **Safari** > **Develop** > **Simulator** > **MyComponent.tsx**를 열면 WebView의 console을 보고 element를 검사할 수 있습니다.

## 수동 WebView

`react-native-webview`의 `WebView` 컴포넌트를 사용하면 수동 WebView를 만들 수 있습니다. 이는 원격 서버의 웹사이트를 렌더링할 때 유용할 수 있습니다.

```tsx
import { WebView } from 'react-native-webview';

export default function App() {
  return <WebView source={{ html: '<h1>Hello, world!</h1>' }} />;
}
```

## 라우팅

`<Link />`, `useRouter` 같은 Expo Router API는 DOM 컴포넌트 안에서도 route 사이를 이동하는 데 사용할 수 있습니다.

```tsx
'use dom';
import Link from 'expo-router/link';

export default function DOMComponent() {
  return (
    <div>
      <h1>Hello, world!</h1>
      <Link href="/about">About</Link>
    </div>
  );
}
```

`useLocalSearchParams()`, `useGlobalSearchParams()`, `usePathname()`, `useSegments()`, `useRootNavigation()`, `useRootNavigationState()`처럼 동기적으로 routing 정보를 반환하는 API는 자동으로 지원되지 않습니다. 대신 DOM 컴포넌트 바깥에서 이 값을 읽고 prop으로 전달하세요.

```tsx
import DOMComponent from './my-component';
import { usePathname } from 'expo-router';

export default function App() {
  const pathname = usePathname();
  return <DOMComponent pathname={pathname} />;
}
```

`router.canGoBack()`와 `router.canDismiss()` 함수 역시 지원되지 않으며 수동 marshalling이 필요합니다. 이렇게 해야 불필요한 render cycle이 발생하지 않습니다.

navigation에 표준 웹 `<a />` anchor element를 사용하는 것은 피하세요. 이렇게 하면 사용자가 다시 돌아가기 어려운 방식으로 DOM 컴포넌트 origin이 바뀔 수 있습니다. 외부 웹사이트를 보여주고 싶다면 `WebBrowser`를 여는 방식을 권장합니다.

DOM 컴포넌트는 네이티브 children을 렌더링할 수 없으므로 layout route(`_layout`)는 DOM 컴포넌트가 될 수 없습니다. header, background 등을 만들기 위해 layout route에서 DOM 컴포넌트를 렌더링할 수는 있지만, layout route 자체는 항상 네이티브여야 합니다.

## DOM 컴포넌트 크기 측정하기

DOM 컴포넌트의 크기를 측정해 네이티브 쪽으로 다시 전달하고 싶을 수 있습니다(예를 들어 네이티브 scrolling). 이는 `matchContents` prop이나 수동 네이티브 action을 사용해 할 수 있습니다.

### `matchContents` prop으로 자동 측정하기

`dom={{ matchContents: true }}` prop을 사용하면 DOM 컴포넌트의 크기를 자동으로 측정하고 네이티브 view의 크기를 다시 조정할 수 있습니다. 이는 컴포넌트가 표시되기 위해 고유 크기를 가져야 하는 특정 layout에서 특히 유용합니다. 예를 들어 컴포넌트가 부모 view 안에서 가운데 정렬되는 경우가 그렇습니다:

```tsx
import DOMComponent from './my-component';

export default function Route() {
  return <DOMComponent dom={{ matchContents: true }} />;
}
```

### 크기를 직접 지정해 수동으로 측정하기

`dom` prop을 통해 `WebView`의 `style` prop에 크기를 전달하면 수동으로 크기를 제공할 수도 있습니다:

```tsx
import DOMComponent from './my-component';

export default function Route() {
  return (
    <DOMComponent
      dom={{
        style: { width, height },
      }}
    />
  );
}
```

### 크기 변화 관찰하기

DOM 컴포넌트 크기의 변화를 네이티브 쪽으로 다시 전달하고 싶다면, 크기가 바뀔 때마다 호출되는 네이티브 action을 DOM 컴포넌트에 추가할 수 있습니다:

```tsx
'use dom';

import { useEffect } from 'react';

function useSize(callback: (size: { width: number; height: number }) => void) {
  useEffect(() => {
    // Observe window size changes
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        callback({ width, height });
      }
    });

    observer.observe(document.body);

    callback({
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    });

    return () => {
      observer.disconnect();
    };
  }, [callback]);
}

export default function DOMComponent({
  onDOMLayout,
}: {
  dom?: import('expo/dom').DOMProps;
  onDOMLayout: (size: { width: number; height: number }) => void;
}) {
  useSize(onDOMLayout);

  return <div style={{ width: 500, height: 500, background: 'blue' }} />;
}
```

그다음 네이티브 코드에서는 DOM 컴포넌트가 크기 변화를 보고할 때마다 state에 그 크기를 저장하도록 업데이트하세요:

```tsx
import DOMComponent from '@/components/my-component';
import { useState } from 'react';
import { View, ScrollView } from 'react-native';

export default function App() {
  const [containerSize, setContainerSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <DOMComponent
          onDOMLayout={async ({ width, height }) => {
            if (containerSize?.width !== width || containerSize?.height !== height) {
              setContainerSize({ width, height });
            }
          }}
          dom={{
            containerStyle:
              containerSize != null
                ? { width: containerSize.width, height: containerSize.height }
                : null,
          }}
        />
      </ScrollView>
    </View>
  );
}
```

## 아키텍처

내장 DOM 지원은 웹사이트를 single-page application으로만 렌더링합니다(SSR과 SSG는 지원하지 않음). embedded JS code에는 검색 엔진 최적화와 indexing이 필요하지 않기 때문입니다.

module에 `'use dom'`이 표시되면 runtime에 import되는 proxy reference로 대체됩니다. 이 기능은 주로 bundler와 CLI의 여러 기법을 조합해 구현됩니다.

원한다면 `WebView` 컴포넌트에 raw HTML을 전달하는 표준 방식으로도 계속 WebView를 사용할 수 있습니다.

웹사이트나 다른 DOM 컴포넌트 안에서 렌더링되는 DOM 컴포넌트는 일반 컴포넌트처럼 동작하며 `dom` prop은 무시됩니다. 웹 콘텐츠는 `iframe`으로 감싸지지 않고 직접 전달되기 때문입니다.

전반적으로 이 시스템은 Expo의 React Server Components 구현과 많은 유사점을 공유합니다.

## 고려 사항

우리는 `View`, `Image`, `Text` 같은 범용 primitive를 사용해 진짜 네이티브 앱을 만드는 것을 권장합니다. DOM 컴포넌트는 표준 JavaScript만 지원하며, 이는 최적화된 Hermes bytecode보다 parsing과 startup이 느립니다.

DOM 컴포넌트와 네이티브 컴포넌트 사이의 데이터는 비동기 JSON 전송 시스템을 통해서만 보낼 수 있습니다. 현재 Expo Router와의 완전한 reconciliation을 지원하지 않으므로, 여러 JS engine에 걸친 데이터 의존이나 DOM 컴포넌트 내부 중첩 URL로의 deep linking에 의존하지 마세요.

DOM 컴포넌트는 Expo Router 전용 기능은 아니지만, Expo Router 앱에서 사용할 때 가장 좋은 경험을 제공하도록 Expo Router 기준으로 개발되고 테스트됩니다.

데이터 공유를 위한 전역 state가 있더라도 이는 여러 JS engine 사이에서는 접근할 수 없습니다.

Expo SDK의 네이티브 module은 DOM 컴포넌트를 지원하도록 최적화할 수 있지만, 이 최적화는 아직 구현되지 않았습니다. DOM 컴포넌트와 네이티브 기능을 공유하려면 네이티브 action과 props를 사용하세요.

DOM 컴포넌트와 일반적인 웹사이트는 네이티브 view보다 덜 최적이지만, 적절한 사용 사례가 분명히 있습니다. 예를 들어 rich-text와 markdown을 렌더링하는 데에는 개념적으로 웹이 가장 적합한 방식입니다. 또한 웹은 WebGL 지원도 매우 좋지만, 저전력 모드의 기기에서는 배터리를 아끼기 위해 웹 frame rate를 자주 제한한다는 점은 고려해야 합니다.

또한 많은 대형 앱은 블로그 글, rich-text(예: X의 장문 게시물), 설정 페이지, 도움말 페이지, 그리고 사용 빈도가 낮은 앱 영역 같은 보조 route에 일부 웹 콘텐츠를 사용합니다.

## Server Components

현재 DOM 컴포넌트는 single-page application으로만 렌더링되며 static rendering이나 React Server Components(RSC)는 지원하지 않습니다. 프로젝트가 React Server Components를 사용하더라도 `'use dom'`은 플랫폼과 관계없이 `'use client'`와 동일하게 동작합니다. RSC Payload는 DOM 컴포넌트의 prop으로 전달할 수 있습니다. 하지만 네이티브 runtime을 대상으로 렌더링되기 때문에 네이티브 플랫폼에서는 올바르게 hydrate될 수 없습니다.

## 제한 사항

-   server component와 달리 DOM 컴포넌트에는 `children`을 전달할 수 없습니다.
-   DOM 컴포넌트는 독립적으로 동작하며 서로 다른 instance 간에 데이터를 자동으로 공유하지 않습니다.
-   DOM 컴포넌트에 네이티브 view를 추가할 수 없습니다. 네이티브 view를 DOM 컴포넌트 위에 띄우는 시도는 가능하지만, 이 접근은 좋지 않은 사용자 경험으로 이어집니다.
-   함수 prop은 값을 동기적으로 반환할 수 없습니다. 반드시 비동기여야 합니다.
-   DOM 컴포넌트는 현재 embedded 방식으로만 사용할 수 있으며 OTA update를 지원하지 않습니다. 이 기능은 앞으로 React Server Components의 일부로 추가될 수 있습니다.

결국 가장 흥미로운 아키텍처는 범용 아키텍처입니다. Expo CLI의 폭넓은 범용 tooling이 있기 때문에, 이처럼 정교하고 가치 있는 기능을 아예 제공할 수 있는 것입니다.

DOM 컴포넌트는 마이그레이션과 빠른 개발에 도움이 되지만, 가능하다면 진짜 네이티브 view를 사용하는 것을 권장합니다.

## 자주 묻는 질문

DOM 컴포넌트에서 Secure Context를 얻으려면 어떻게 하나요?

일부 Web API는 올바르게 동작하려면 [Secure Context](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts)가 필요합니다. 예를 들어 [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)는 secure context에서만 사용할 수 있습니다. secure context는 원격 리소스가 HTTPS를 통해 제공되어야 함을 의미합니다. [secure context로 제한되는 기능에 대해 더 알아보세요](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts/features_restricted_to_secure_contexts).

DOM 컴포넌트가 secure context 안에서 실행되도록 하려면 다음 지침을 따르세요:

-   **Release build**: `file://` scheme으로 제공되는 DOM 컴포넌트는 기본적으로 secure context를 가집니다.
-   **Debug build**: development server를 사용할 때(기본적으로 `http://` protocol 사용) [tunneling](/more/expo-cli#tunneling)을 사용해 DOM 컴포넌트를 HTTPS로 제공할 수 있습니다.

**DOM 컴포넌트를 HTTPS로 터널링하는 예시 명령:**

```sh
npx expo install expo-dev-client
npx expo run:android
npx expo start --tunnel -d -a
npx expo run:ios
npx expo start --tunnel -d -i
```
