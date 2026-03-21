---
modificationDate: March 05, 2026
title: Redirects와 rewrites
description: 더 이상 존재하지 않을 수 있는 routes를 위한 redirects를 만드는 방법을 알아보세요.
---

# Redirects와 rewrites

더 이상 존재하지 않을 수 있는 routes를 위한 redirects를 만드는 방법을 알아보세요.

> 정적 redirects는 Expo Router `4.x.x`부터 사용할 수 있습니다.

## Redirect component

`<Redirect />` 컴포넌트를 사용하려면 `expo-router`에서 import하고 `href` prop에 원하는 목적지 route를 지정하세요.

```tsx
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/home" />;
}
```

위 예제에서는 앱 사용자가 이 페이지를 방문하면 자동으로 `/home` route로 리디렉션됩니다.

탐색 전에 조건을 확인하는 컴포넌트 안에서도 `<Redirect />`를 사용할 수 있습니다.

```tsx
import { Redirect } from 'expo-router';
import { useState, useEffect } from 'react';

export default function ProtectedPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulate checking authentication status
    setTimeout(() => setIsAuthenticated(true), 2000);
  }, []);

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Text>Welcome to the protected page!</Text>;
}
```

이 경우 사용자가 인증되지 않았다면 `/login` 페이지로 리디렉션됩니다.

## Static redirects

정적 redirects를 사용하면 `expo-router` config plugin을 통해 [app config](/workflow/configuration)에 redirect 구성을 지정할 수 있습니다. 이를 사용하면 **app** 디렉터리에 더 이상 존재하지 않는 routes에 대한 redirects를 지정할 수 있습니다. 화면으로 이동할 때 Expo Router는 로컬 서버에 `GET` 요청을 보내는 것처럼 동작하고, 이 서버는 해당 screen의 콘텐츠로 응답합니다. 덕분에 Expo Router는 native, web, React Server Components를 가져올 때 일관되게 동작합니다. 따라서 이 구성은 **server requests**를 기준으로 하며, screen 이름이 아니라 요청 URL을 기준으로 합니다.

```json
{
  "plugins": [
    [
      "expo-router",
      {
        "redirects": [
          {
            "source": "/redirect/from/here",
            "destination": "/to/this/route"
          },
          {
            "source": "/or/redirect/from/here",
            "destination": "http://to.this.site"
          }
        ]
      }
    ]
  ]
}
```

각 redirect 구성은 다음 속성을 가져야 합니다:

-   **source**: 들어오는 요청 path 패턴
-   **destination**: 라우팅하려는 path입니다. Expo Router 프로젝트 내부의 path일 수도 있고 외부 URL일 수도 있습니다.

redirect 구성은 다음 선택적 속성을 가질 수 있습니다:

-   **permanent**: `true` 또는 `false`를 받습니다. `true`면 클라이언트/검색 엔진에게 redirect를 영구적으로 캐시하도록 지시하는 308 상태 코드를 사용합니다. `false`면 임시 redirect이고 캐시되지 않는 307 상태 코드를 사용합니다.

**app** 디렉터리 안의 routes와 달리, 디렉터리 route에 `/index` suffix를 추가하거나 API routes에 `+api`를 붙일 필요가 없습니다. **_layout** 파일에 대한 redirects는 만들 수 없습니다.

### Dynamic routes

`source`와 `destination` routes는 [dynamic route syntax](/develop/app-navigation)를 사용해 동적 route용 redirects를 만들 수 있습니다. 이를 `expo-router` config plugin을 통해 **app.json**에 정의할 수 있습니다.

```json
{
  "plugins": [
    [
      "expo-router",
      {
        "redirects": [
          {
            "source": "/redirect/[slug]",
            "destination": "/target/[slug]"
          }
        ]
      }
    ]
  ]
}
```

리디렉션을 수행할 때 변수 이름이 가능하면 매칭됩니다. 매칭되지 않은 변수는 query params로 전달됩니다.

```json
{
  "plugins": [
    [
      "expo-router",
      {
        "redirects": [
          {
            "source": "/redirect/[fruit]/[vegetable]/[meat]",
            "destination": "/target/[vegetable]/[fruit]"
          }
        ]
      }
    ]
  ]
}
```

위 구성을 사용하면 `/redirect/apple/carrot/beef`는 `/target/carrot/apple?meat=beef`로 리디렉션됩니다.

### HTTP methods

특정 HTTP method에만 redirect를 적용하려면 methods를 배열 안의 문자열로 제공하세요. screens는 `GET` 요청으로 간주된다는 점을 기억하세요.

```json
{
  "plugins": [
    [
      "expo-router",
      {
        "redirects": [{
          "source": "/redirect/[slug]",
          "destination": "/target/[slug]"
          "methods": ["POST"]
        }]
      }
    ]
  ]
}
```

## Rewrites

> 정적 URL rewrites는 server 환경에서만 지원되며, 정적 export나 native apps에서는 **사용할 수 없습니다**. client-side navigation의 경우에는 대신 [redirects](/router/advanced/redirects#redirect-component)를 고려하세요.

Rewrites는 정적 구성으로만 가능합니다. redirect와 다른 점은 URL proxy처럼 동작하면서 destination URL을 숨긴다는 것입니다. redirect는 HTTP 상태 코드를 반환하고 요청을 다른 곳으로 보내지만, rewrite는 URL을 바꾸지 않고 새 destination을 렌더링합니다.

```json
{
  "plugins": [
    [
      "expo-router",
      {
        "rewrites": [
          {
            "source": "/redirect/from/here",
            "destination": "/to/this/route"
          }
        ]
      }
    ]
  ]
}
```
