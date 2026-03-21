---
modificationDate: February 26, 2026
title: Server middleware
description: Expo Router에서 server로 들어오는 모든 request에 대해 실행되는 middleware를 만드는 방법을 알아보세요.
isAlpha: true
---

# Server middleware

Expo Router에서 server로 들어오는 모든 request에 대해 실행되는 middleware를 만드는 방법을 알아보세요.

> Server middleware는 alpha 단계이며 SDK 54 이상에서 사용할 수 있습니다. Production에서 사용하려면 [deployed server](/router/web/api-routes#deployment)가 필요합니다.

Expo Router의 server middleware를 사용하면 request가 route에 도달하기 전에 코드를 실행할 수 있으므로, 모든 request에 대해 authentication이나 logging 같은 강력한 server-side 기능을 구현할 수 있습니다. 특정 endpoint만 처리하는 [API routes](/router/web/api-routes)와 달리 middleware는 앱의 **모든** request에 대해 실행되므로, 앱 성능을 늦추지 않도록 최대한 빠르게 실행되어야 합니다. Native에서의 client-side navigation이나, web 앱에서 [`<Link />`](/versions/latest/sdk/router#link)를 사용할 때는 server middleware를 거치지 않습니다.

## Setup

### Enable server middleware in your app configuration

먼저 [app config](/versions/latest/config/app)에 server 구성을 추가해 앱이 server output을 사용하도록 설정하세요:

```json
{
  "expo": {
    ... 
    "web": {
      "output": "server"
    },
    "plugins": [
      [
        "expo-router",
        {
          "unstable_useServerMiddleware": true
        }
      ]
    ]
  }
}
```

### Create your middleware file

Server middleware function을 정의하기 위해 **src/app** 디렉터리에 **+middleware.ts** 파일을 만드세요:

```ts
export default function middleware(request) {
  console.log(`Middleware executed for: ${request.url}`);
  // Your middleware logic goes here
}
```

Middleware function은 파일의 default export여야 합니다. 이 함수는 [immutable request](/router/web/middleware#request-immutability)를 받고, [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)를 반환하거나 아무것도 반환하지 않아 request가 수정 없이 계속 진행되도록 할 수 있습니다. Side effect를 방지하기 위해 request는 immutable입니다. Header와 property는 읽을 수 있지만 header를 수정하거나 request body를 소비할 수는 없습니다.

### Start your development server

Middleware를 테스트하기 위해 development server를 실행하세요:

```sh
npx expo start
```

이제 middleware는 앱으로 들어오는 모든 request에 대해 실행됩니다.

### Test middleware functionality

Browser에서 앱을 열거나 request를 보내 middleware가 동작하는지 테스트하세요. Middleware function의 로그 메시지가 console에 출력되는지 확인하면 됩니다.

### Configure middleware matchers (optional)

기본적으로 middleware는 모든 server request에 대해 실행됩니다. `unstable_settings`를 사용해 middleware가 실행될 시점을 제어하는 matcher를 추가할 수 있습니다:

```ts
export const unstable_settings = {
  matcher: {
    // Only run on GET requests
    methods: ['GET'],
    // Only run on API routes and specific paths
    patterns: ['/api', '/admin/[...path]'],
  },
};

export default function middleware(request) {
  console.log(`Middleware executed for: ${request.url}`);
}
```

Matcher configuration으로 다음을 할 수 있습니다:

-   **HTTP method로 필터링**: 어떤 method가 middleware를 실행시켜야 하는지 지정합니다
-   **Path pattern으로 필터링**: 정확한 path, named parameter, regular expression을 사용해 어떤 URL pattern이 매칭되어야 하는지 정의합니다

## How it works

Middleware function은 어떤 route handler보다 먼저 실행되므로, logging, authentication, response 수정 같은 작업을 수행할 수 있습니다. Middleware는 server에서만, 그리고 실제 HTTP request에 대해서만 실행됩니다.

### Request/response flow

Request가 앱으로 들어오면 Expo Router는 다음 순서로 처리합니다:

1.  먼저 middleware function이 [immutable request](/router/web/middleware#request-immutability)와 함께 실행됩니다.
2.  Middleware가 `Response`를 반환하면 그 response가 즉시 전송됩니다
3.  Middleware가 아무것도 반환하지 않으면 request는 매칭되는 route로 계속 진행됩니다
4.  Route handler가 request를 처리하고 response를 반환합니다

### Pattern matching

Matcher는 middleware가 언제 실행될지 제어하기 위해 다양한 pattern type을 지원합니다:

```ts
export const unstable_settings = {
  matcher: {
    patterns: [
      '/api', // Exact path
      '/posts/[postId]', // Named parameter
      '/blog/[...slug]', // Catch-all parameter
      /^\/api\/v\d+\/users$/, // Regular expression
    ],
  },
};
```

-   **Exact paths**는 지정된 path에만 매칭됩니다. `/api`는 `/api`에는 매칭되지만 `/api/users`에는 매칭되지 않습니다
-   `[postId]` 같은 **Named parameters**는 하나의 segment를 캡처합니다. `/posts/[postId]`는 `/posts/123`이나 `/posts/my-post`에 매칭됩니다
-   `[...slug]` 같은 **Catch-all parameters**는 하나 이상의 segment를 캡처합니다. `/blog/[...slug]`는 `/blog/2024`나 `/blog/2024/12/post`에 매칭됩니다
-   **Regular expressions**는 복잡한 pattern을 위한 것입니다. `/^\/api\/v\d+\/users$/`는 `/api/v1/users`에는 매칭되지만 `/api/users`에는 매칭되지 않습니다

어떤 pattern이든 request URL에 매칭되면 middleware가 실행됩니다. `methods`와 `patterns`가 모두 지정된 경우에는 middleware가 실행되기 위해 두 조건을 모두 만족해야 합니다.

### Middleware execution order

Expo Router는 모든 server request에 대해 실행되는 **+middleware.ts**라는 단일 middleware file만 지원합니다. Matcher를 사용할 때 middleware는 지정된 pattern과 method에 매칭되는 request에 대해서만, 어떤 route matching이나 rendering이 일어나기 전에 실행됩니다.

### When middleware runs

Middleware는 server로 들어오는 실제 HTTP request에 대해서만 실행됩니다. 즉, 다음 경우에는 실행됩니다:

-   사용자가 사이트를 처음 방문할 때 같은 초기 페이지 로드
-   전체 페이지 새로고침
-   직접 URL로 이동하는 경우
-   어떤 client에서든(API route를 호출하는 native/web 앱, 외부 서비스) 들어오는 API route 호출
-   Server-side rendering request

다음 경우에는 middleware가 실행되지 않습니다:

-   [`<Link />`](/versions/latest/sdk/router#link) 또는 [`router`](/versions/latest/sdk/router#router)를 사용하는 client-side navigation
-   Native 앱 screen 전환
-   Prefetch된 route
-   이미지나 폰트 같은 정적 asset request

## Examples

Authentication

Middleware는 route가 로드되기 전에 authorization 검사를 수행하는 데 자주 사용됩니다. Header, cookie, query parameter를 검사해 사용자가 특정 route에 접근할 수 있는지 판단할 수 있습니다:

```ts
import { jwtVerify } from 'jose';

export default function middleware(request) {
  const token = request.headers.get('authorization');

  const decoded = jwtVerify(token, process.env.SECRET_KEY);
  if (!decoded.payload) {
    return new Response('Forbidden', { status: 403 });
  }
}
```
Logging

디버깅이나 analytics 용도로 request를 기록하기 위해 middleware를 사용할 수 있습니다. 이렇게 하면 사용자 활동을 추적하거나 앱의 문제를 진단하는 데 도움이 됩니다:

```ts
export default function middleware(request) {
  console.log(`${request.method} ${request.url}`);
}
```
Dynamic redirects

Middleware는 동적 redirect를 수행하는 데도 사용할 수 있습니다. 이를 통해 특정 조건에 따라 사용자 이동을 제어할 수 있습니다:

```ts
export default function middleware(request) {
  if (request.headers.has('specific-header')) {
    return Response.redirect('https://expo.dev');
  }
}
```
API-only middleware

Matcher를 사용하면 API route에 대해서만 middleware를 실행하고 다른 route는 영향받지 않게 할 수 있습니다:

```ts
export const unstable_settings = {
  matcher: {
    patterns: ['/api'],
  },
};

export default function middleware(request) {
  // Log all API requests for debugging
  console.log(`API request: ${request.method} ${request.url}`);

  // Add CORS headers for API routes
  const response = new Response();
  response.headers.set('Access-Control-Allow-Origin', '*');
  return response;
}
```
Method-specific authentication

공개 읽기 접근은 허용하면서 write operation(POST, PUT, DELETE)만 보호할 수 있습니다:

```ts
export const unstable_settings = {
  matcher: {
    methods: ['POST', 'PUT', 'DELETE'],
    patterns: ['/api', '/admin/[...path]'],
  },
};

export default function middleware(request) {
  const token = request.headers.get('authorization');

  if (!token || !isValidToken(token)) {
    return new Response('Unauthorized', { status: 401 });
  }
}

function isValidToken(token: string): boolean {
  // Your token validation logic
  return token.startsWith('Bearer ');
}
```
Selective logging

모든 request를 기록하지 않고 특정 endpoint만 모니터링할 수 있습니다:

```ts
export const unstable_settings = {
  matcher: {
    patterns: ['/api/users/[userId]', '/admin', /^\/webhook/],
  },
};

export default function middleware(request) {
  const userAgent = request.headers.get('user-agent');
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] ${request.method} ${request.url} - ${userAgent}`);
}
```

## Additional notes

### Best practices

-   Middleware는 모든 server request에 대해 동기적으로 실행되고 response time에 직접 영향을 주므로 가볍게 유지하세요.
-   특히 트래픽이 많은 애플리케이션에서는 matcher를 사용해 middleware가 필요 없는 route에서 불필요하게 실행되지 않도록 하여 성능을 최적화하세요.
-   단순한 pattern이 복잡한 regular expression보다 평가 속도가 빠르고 유지보수도 쉬우므로 regex보다 exact path와 named parameter를 우선 사용하세요.
-   Method와 pattern filtering을 함께 사용하면 middleware가 실행될 시점을 더 정밀하게 제어할 수 있습니다.
-   Native 앱에서는 안전한 data fetching을 위해 API route를 사용하세요. Native 앱이 API route를 호출할 때는 그 request가 먼저 middleware를 통과합니다.

### Typed middleware

```ts
import { MiddlewareFunction } from 'expo-router/server';

const middleware: MiddlewareFunction = request => {
  if (request.headers.has('specific-header')) {
    return Response.redirect('https://expo.dev');
  }
};

export default middleware;
```

### Limitations

-   Middleware는 server에서만, 그리고 HTTP request에 대해서만 실행됩니다. 예를 들어 [`<Link />`](/versions/latest/sdk/router#link)나 native 앱 screen 전환 같은 client-side navigation 중에는 실행되지 않습니다.
-   Side effect를 방지하기 위해 middleware에 전달되는 request object는 [immutable](/router/web/middleware#request-immutability)입니다. Header를 수정하거나 request body를 소비할 수 없으므로, route handler에서 계속 사용할 수 있습니다.
-   앱에는 루트 수준의 **+middleware.ts**를 하나만 둘 수 있습니다.
-   [API route에 적용되는 제한 사항](/router/web/api-routes#known-limitations)은 middleware에도 동일하게 적용됩니다.

### Request immutability

의도치 않은 side effect를 방지하고 request body가 route handler에서 계속 사용 가능하도록 하기 위해, middleware에 전달되는 [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request)는 immutable입니다. 즉, 다음은 할 수 있습니다:

-   `url`, `method`, `headers` 등 모든 request property를 읽기
-   `request.headers.get()`으로 header 값 읽기
-   `request.headers.has()`로 header 존재 여부 확인하기
-   URL parameter와 query string에 접근하기

하지만 다음은 할 수 없습니다:

-   `set()`, `append()`, `delete()`로 header 수정하기
-   `text()`, `json()`, `formData()` 등으로 request body 소비하기
-   `body` property에 직접 접근하기
