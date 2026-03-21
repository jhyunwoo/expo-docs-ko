---
modificationDate: February 26, 2026
title: Error handling
description: Expo Router를 사용할 때 앱에서 일치하지 않는 route와 error를 처리하는 방법을 알아보세요.
---

# Error handling

Expo Router를 사용할 때 앱에서 일치하지 않는 route와 error를 처리하는 방법을 알아보세요.

이 가이드는 Expo Router를 사용할 때 앱에서 일치하지 않는 route와 error를 처리하는 방법을 설명합니다.

## Unmatched routes

네이티브 앱에는 서버가 없으므로 엄밀히 말하면 404는 없습니다. 하지만 router를 범용적으로 구현하고 있다면 누락된 route를 처리하는 것이 타당합니다. 이 작업은 각 앱에서 자동으로 이루어지지만, 직접 커스터마이징할 수도 있습니다.

```tsx
import { Unmatched } from 'expo-router';
export default Unmatched;
```

이렇게 하면 기본 `Unmatched`가 렌더링됩니다. 대신 렌더링하고 싶은 어떤 component든 export할 수 있습니다. 사용자가 홈 화면으로 돌아갈 수 있도록 `/`로 가는 link를 두는 것을 권장합니다.

### Route priority

web에서는 파일이 다음 순서로 제공됩니다:

1.  **public** 디렉터리 안의 정적 파일.
2.  app 디렉터리 안의 일반 route와 dynamic route.
3.  app 디렉터리 안의 [API routes](/router/web/api-routes).
4.  not-found route는 마지막에 404 status code와 함께 제공됩니다.

## Error handling

Expo Router는 앞으로 더 의견이 반영된 data-loading 전략을 가능하게 하기 위해 세밀한 error handling을 지원합니다.

어떤 route에서든 중첩된 [`ErrorBoundary`](/versions/latest/sdk/router#errorboundary) component를 export해 [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)를 사용해 component 수준 error를 가로채고 형식을 지정할 수 있습니다:

```tsx
import { View, Text } from 'react-native';
import { type ErrorBoundaryProps } from 'expo-router';

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={{ flex: 1, backgroundColor: "red" }}>
      <Text>{error.message}</Text>
      <Text onPress={retry}>Try Again?</Text>
    </View>
  );
}

export default function Page() { ... }
```

`ErrorBoundary`를 export하면 route는 사실상 다음과 같은 React Error Boundary로 감싸지게 됩니다:

```tsx
function Route({ ErrorBoundary, Component }) {
  return (
    <Try catch={ErrorBoundary}>
      <Component />
    </Try>
  );
}
```

`ErrorBoundary`가 없으면 error는 가장 가까운 부모의 `ErrorBoundary`로 던져지며, 이때 [`error`](/versions/latest/sdk/router#error)와 [`retry`](/versions/latest/sdk/router#retry) prop을 받습니다.

### Work in progress

error가 있을 때 개발하기 쉽도록 React Native LogBox는 덜 공격적으로 표시될 필요가 있습니다. 현재는 `console.error`와 `console.warn`에서도 표시됩니다. 하지만 이상적으로는 잡히지 않은 error에 대해서만 표시되어야 합니다.
