---
modificationDate: January 19, 2026
title: Server headers
description: Expo Router에서 모든 server route response에 custom HTTP header를 설정하는 방법을 알아보세요.
---

# Server headers

Expo Router에서 모든 server route response에 custom HTTP header를 설정하는 방법을 알아보세요.

> Server header는 SDK 54 이상에서 사용할 수 있으며, export한 애플리케이션을 제공하려면 [`expo-server`](/versions/latest/sdk/server)가 필요합니다.

Expo Router의 server header를 사용하면 route response에 대해 보안, caching, cookie, custom metadata용 custom HTTP header를 설정할 수 있습니다. Header는 HTML과 API route response에만 적용되며, 이미지, 폰트, JavaScript bundle 같은 정적 asset에는 적용되지 않습니다.

## Setup

[app config](/versions/latest/config/app)의 `expo-router` plugin에서 header를 구성하세요:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-router",
        {
          "headers": {
            "X-Frame-Options": "DENY"
          }
        }
      ]
    ]
  }
}
```

Development server를 시작하거나 production용으로 export하세요:

```sh
npx expo start
npx expo export -p web
```

Header는 모든 HTML 및 API route response에 자동으로 적용됩니다.

## Configuration

Header는 key가 header 이름이고 value가 문자열 또는 문자열 배열인 object로 구성합니다.

```json
{
  "expo": {
    "plugins": [
      [
        "expo-router",
        {
          "headers": {
            "X-Frame-Options": "DENY",
            "X-Content-Type-Options": "nosniff",
            "Set-Cookie": ["session=abc123; HttpOnly", "preference=dark; Path=/"]
          }
        }
      ]
    ]
  }
}
```

## Examples

Security headers

애플리케이션을 보호하기 위해 일반적인 보안 header를 추가하세요:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-router",
        {
          "headers": {
            "X-Frame-Options": "DENY",
            "X-Content-Type-Options": "nosniff",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "X-XSS-Protection": "1; mode=block"
          }
        }
      ]
    ]
  }
}
```
Cross-Origin headers for SharedArrayBuffer

[`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) 같은 일부 web API는 특정 Cross-Origin header가 필요합니다. 이는 [`expo-sqlite` on web](/versions/latest/sdk/sqlite#web-setup) 같은 기능에 필요합니다.

```json
{
  "expo": {
    "plugins": [
      [
        "expo-router",
        {
          "headers": {
            "Cross-Origin-Embedder-Policy": "credentialless",
            "Cross-Origin-Opener-Policy": "same-origin"
          }
        }
      ]
    ]
  }
}
```
Cache-Control headers

Response에 대한 caching policy를 설정하세요:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-router",
        {
          "headers": {
            "Cache-Control": "public, max-age=3600, s-maxage=86400"
          }
        }
      ]
    ]
  }
}
```
Custom headers

앱에 대한 metadata가 담긴 custom header를 추가하세요:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-router",
        {
          "headers": {
            "X-App-Version": "1.0.0",
            "X-Environment": "production"
          }
        }
      ]
    ]
  }
}
```

## How it works

### Output modes

Server header는 app config에서 구성한 두 output mode 모두와 함께 동작합니다:

-   **`static`**: [`expo-server`](/versions/latest/sdk/server)로 pre-rendered HTML file을 제공할 때 header가 적용됩니다
-   **`server`**: 동적으로 렌더링된 response에 header가 적용됩니다

### Header precedence

`expo-router` plugin에 정의한 header는 전역적으로 적용되지만 API route가 설정한 header를 덮어쓰지는 않습니다. API route가 plugin 구성에도 정의된 header를 포함한 response를 반환하면, route별 header가 우선합니다.

예를 들어 전역적으로 `Cache-Control: public, max-age=3600`을 구성했더라도, 실시간 데이터를 반환하는 API route가 `Cache-Control: no-store`를 설정하면 API route의 header가 우선합니다.

## Known limitations

-   **Redirects**: Header는 redirect response에는 적용되지 않습니다
-   **Static assets**: Header는 HTML 및 API route response에만 적용되며, 이미지, 폰트, JavaScript bundle 같은 정적 asset에는 적용되지 않습니다

## Related

[API Routes](/router/web/api-routes) — Expo Router로 server endpoint를 만드는 방법을 알아보세요.

[Server middleware](/router/web/middleware) — Expo Router에서 server로 들어오는 모든 request에 대해 실행되는 middleware를 만드는 방법을 알아보세요.
