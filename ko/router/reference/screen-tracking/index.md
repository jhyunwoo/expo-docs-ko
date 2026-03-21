---
modificationDate: February 26, 2026
title: Screen tracking for analytics
description: Expo Router를 사용할 때 analytics용 screen tracking을 활성화하는 방법을 알아보세요.
---

# Screen tracking for analytics

Expo Router를 사용할 때 analytics용 screen tracking을 활성화하는 방법을 알아보세요.

React Navigation과 달리, Expo Router는 항상 URL에 접근할 수 있습니다. 즉, screen tracking은 web에서와 마찬가지로 매우 간단합니다.

1.  현재 선택된 URL을 관찰하는 higher-order component를 만듭니다
2.  analytics provider에서 URL을 추적합니다

`src`

 `app`

  `_layout.tsx`

```tsx
import { useEffect } from 'react';
import { usePathname, useGlobalSearchParams, Slot } from 'expo-router';

export default function Layout() {
  const pathname = usePathname();
  const params = useGlobalSearchParams();

  // Track the location in your analytics provider here.
  useEffect(() => {
    analytics.track({ pathname, params });
  }, [pathname, params]);

  // Export all the children routes in the most basic way.
  return <Slot />;
}
```

이제 사용자가 route를 변경하면 analytics provider에 알림이 전달됩니다.

## Migrating from React Navigation

React Navigation의 [screen tracking guide](https://reactnavigation.org/docs/screen-tracking/)는 Expo Router가 할 수 있는 것과 동일한 navigation state 가정을 할 수 없습니다. 그 결과, 구현에는 `onReady`와 `onStateChange` callback을 사용해야 합니다. 가능하면 이러한 방법은 피하세요. 루트 `<NavigationContainer />`가 직접 노출되지 않고 Expo Router에서 cascading을 허용하기 때문입니다.
