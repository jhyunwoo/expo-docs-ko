---
modificationDate: February 26, 2026
title: Router settings
description: Expo Router에서 정적 속성으로 layouts를 구성하는 방법을 알아보세요.
---

# Router settings

Expo Router에서 정적 속성으로 layouts를 구성하는 방법을 알아보세요.

> **경고:** `unstable_settings`는 현재 [async routes](/router/web/async-routes)와 함께 동작하지 않습니다(개발 전용). 이 기능이 _unstable_로 지정된 이유가 바로 이것입니다.

### `initialRouteName`

route로 deep linking할 때 사용자에게 "back" 버튼을 제공하고 싶을 수 있습니다. `initialRouteName`은 stack의 기본 screen을 설정하며 유효한 파일명(확장자 제외)과 일치해야 합니다.

`src`

 `app`

  `_layout.tsx`

  `index.tsx`

  `other.tsx`

```tsx
import { Stack } from 'expo-router';

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: 'index',
};

export default function Layout() {
  return <Stack />;
}
```

이제 `/other`로 직접 deep linking하거나 페이지를 다시 로드해도 back 화살표가 계속 표시됩니다.

[array syntax](/router/advanced/shared-routes#arrays) `(foo,bar)`를 사용할 때는 특정 segment를 대상으로 `unstable_settings` object 안에 group 이름을 지정할 수 있습니다.

```tsx
export const unstable_settings = {
  // Used for `(foo)`
  initialRouteName: 'first',
  // Used for `(bar)`
  bar: {
    initialRouteName: 'second',
  },
};
```

`initialRouteName`은 route로 deep-linking할 때만 사용됩니다. 앱 내비게이션 중에는 사용자가 이동하는 route 자체가 initial route가 됩니다. 이 동작은 `<Link />` 컴포넌트의 `initial` prop을 사용하거나 imperative API에 옵션을 전달해 비활성화할 수 있습니다.

```js
// If this navigates to a new _layout, don't override the initial route
<Link href="/route" initial={false} />;

router.push('/route', { overrideInitialScreen: false });
```
