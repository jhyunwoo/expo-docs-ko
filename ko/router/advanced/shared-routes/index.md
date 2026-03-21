---
modificationDate: February 26, 2026
title: Shared routes
description: Expo Router에서 shared routes를 정의하거나 arrays를 사용해 같은 route를 서로 다른 layouts에서 여러 번 사용하는 방법을 알아보세요.
---

# Shared routes

Expo Router에서 shared routes를 정의하거나 arrays를 사용해 같은 route를 서로 다른 layouts에서 여러 번 사용하는 방법을 알아보세요.

같은 URL을 서로 다른 layout과 매칭하려면 겹치는 child routes를 가진 [**groups**](/router/basics/notation#parentheses)를 사용하세요. 이 패턴은 네이티브 앱에서 매우 흔합니다. 예를 들어 X 앱에서는 프로필을 모든 tab(예: home, search, profile)에서 볼 수 있습니다. 하지만 이 route에 접근하는 데 필요한 URL은 하나뿐입니다.

아래 예시에서 **src/app/_layout.tsx**는 tab bar이고 각 route는 자체 header를 가집니다. **src/app/(profile)/[user].tsx** route는 각 tab 사이에서 공유됩니다.

`src`

 `app`

  `_layout.tsx`

  `(home)`

   `_layout.tsx`

   `[user].tsx`

  `(search)`

   `_layout.tsx`

   `[user].tsx`

  `(profile)`

   `_layout.tsx`

   `[user].tsx`

> 페이지를 다시 로드할 때는 알파벳 순서상 가장 먼저 매칭되는 항목이 렌더링됩니다.

Shared routes는 route에 group 이름을 포함해 직접 이동할 수 있습니다. 예를 들어 `/(search)/baconbrix`는 "search" layout 안의 `/baconbrix`로 이동합니다.

## Arrays

> Array syntax는 네이티브 앱 개발에만 있는 고급 개념입니다.

같은 route를 서로 다른 layout으로 여러 번 정의하는 대신, array syntax `(,)`를 사용해 group의 children을 복제하세요. 예를 들어 `src/app/(home,search)/[user].tsx`는 메모리 안에 `src/app/(home)/[user].tsx`와 `src/app/(search)/[user].tsx`를 만듭니다.

두 route를 구분하려면 layout의 `segment` prop을 사용하세요:

```tsx
export default function DynamicLayout({ segment }) {
  if (segment === '(search)') {
    return <SearchStack />;
  }

  return <Stack />;
}
```

**array syntax**를 활성화하려면 dynamic layout 안의 `unstable_settings` object를 사용해 각 group의 [`initialRouteName`](/router/advanced/router-settings#initialroutename)을 지정하세요:

```tsx
export const unstable_settings = {
  initialRouteName: 'home',
  search: {
    initialRouteName: 'search',
  },
};

export default function DynamicLayout({ segment }) {
   ... 
}
```

위 예시에서 `home` route는 `home` group과 앱의 기본 route입니다. `search` route는 `search` group의 기본 route입니다.

## Key points

-   현재 navigator에 대한 groups만 제공할 수 있습니다.
-   array syntax를 사용할 때 두 개의 group이 있다면(예: `(one)/(two)`), route 매칭에는 마지막 group의 segment만 사용됩니다.
-   group `initialRouteNames`가 최소 두 개 이상인데 기본 `initialRouteName`이 제공되지 않았다면, 첫 번째 group의 `initialRouteName`이 사용됩니다.
