---
modificationDate: October 22, 2025
title: 기본 응답 및 헤더
description: EAS Hosting 사용 시 요청에 자동으로 추가되는 기본값을 알아보세요.
---

# 기본 응답 및 헤더

EAS Hosting 사용 시 요청에 자동으로 추가되는 기본값을 알아보세요.

**EAS Hosting**은 deployment에 여러 기본값을 적용합니다. 이는 간단한 API routes를 만들 때 도움이 되도록 설계되었으며, 직접 추가해야 하는 코드 양을 줄여 줍니다.

## Asset 응답

Asset 응답에는 주로 캐싱을 위한 브라우저용 추가 metadata 헤더가 포함됩니다.

기본 `ETag` 헤더는 모든 asset 응답에 추가되어 브라우저가 `if-none-match` 요청 헤더를 사용해 캐시를 재검증할 수 있게 합니다.

## CORS 응답

기본적으로 API route가 `OPTIONS` 요청을 처리하지 않으면, EAS Hosting이 자동으로 기본 CORS 응답을 반환합니다.

이 기본값은 매우 허용적인 편이며, 일반적으로 모든 브라우저가 해당 API route에 요청을 보낼 수 있도록 허용합니다. **원하지 않는다면** API routes에서 직접 `OPTIONS` 요청을 처리하세요.

기본적으로 다음 헤더가 전송됩니다.

```sh
Access-Control-Allow-Origin: <origin || '*'>
Access-Control-Allow-Headers: <access-control-request-headers || '*'>
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: *
Access-Control-Max-Age: 3600
Vary: Origin, Access-Control-Request-Headers
```

이 헤더들은 모든 클라이언트가 어떤 origin에서든, 어떤 헤더로든, credentials를 포함해 요청할 수 있도록 하며, `OPTIONS` 응답을 3600초 동안 캐시할 수 있게 합니다.

[Preflight `OPTIONS` 요청에 대한 자세한 내용은 MDN 문서](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request)에서 확인할 수 있습니다.

## Strict-Transport-Security 헤더

이 헤더는 브라우저가 앞으로 해당 URL에 HTTPS 프로토콜로만 접근하도록 지시합니다. EAS Hosting은 이 헤더가 없으면 자동으로 추가합니다.

기본값은 `max-age=31536000; includeSubDomains; preload`입니다.

이 헤더가 왜 좋은 기본값인지, 보안과 성능을 어떻게 개선하는지에 대해서는 [`web.dev`의 글](https://web.dev/blog/bbc-hsts)을 읽어 보세요. [`Strict-Transport-Security`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security) 헤더 자체에 대해서도 MDN 문서에서 더 자세히 볼 수 있습니다.

## 공통 헤더

기본적으로 EAS Hosting은 `X-Powered-By` 및 `X-Aspnet-Version` 헤더를 제거하고 전달하지 않습니다. API routes에서는 이 헤더들이 큰 의미가 없으며, 실행 중인 코드의 내부 정보를 불필요하게 노출하므로 `X-Powered-By` 같은 대체 헤더도 추가하지 않는 것을 권장합니다.

API routes가 사용자 지정 `X-Frame-Options` 헤더로 응답하면, 이 헤더들은 응답에서 자동으로 `Content-Security-Policy` 지시어로 변환됩니다.

## 크래시 페이지

API route가 처리되지 않은 JavaScript 오류를 throw하면, 이는 API route가 오류 응답을 전달할 수 없었다는 뜻이므로 "crash"로 처리됩니다.

이런 경우 EAS Hosting은 오류 페이지로 응답합니다. `Accept: text/html` 요청 헤더가 전송되었다면 오류 페이지는 HTML 응답으로 렌더링됩니다. 그렇지 않으면 plain text 응답만 반환합니다.

## 요청 헤더

**EAS Hosting**은 API routes로 요청을 전달하기 전에 모든 요청에 다음 헤더를 추가합니다. 이 헤더들은 일반적으로 누가 요청을 보냈는지에 대한 더 많은 정보를 제공합니다.

| Request header | Description |
| --- | --- |
| `Forwarded` | 세미콜론으로 구분된 `for`, `host`, `proto` 매개변수들의 쉼표 구분 목록입니다. 자세한 내용은 [HTTP `Forwarded` header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Forwarded)에 대한 MDN 문서를 참고하세요. |
| `X-Forwarded-For` | 특정 요청에 대한 forwarder IP의 쉼표 구분 목록 |
| `X-Forwarded-Proto` | 요청에 사용된 프로토콜. 일반적으로 `https` |
| `X-Forwarded-Host` | 들어온 요청의 hostname |
| `X-Real-IP` | 들어온 요청의 IP 주소 |
| `Origin` | 들어온 요청의 URL Origin |
| `Host` | 전달된 요청의 hostname(`request.url`의 hostname과 일치) |
| `eas-colo` | 요청을 처리한 Cloudflare 데이터 센터의 코드. 예: `lhr` |
| `eas-ip-continent` | 클라이언트의 두 글자 대륙 코드. `AF`, `AN`, `AS`, `EU`, `NA`, `OC`, `SA` 중 하나 |
| `eas-ip-country` | ISO-3166 Alpha 2 형식의 클라이언트 국가 코드. 예: `US` 또는 `JP` |
| `eas-ip-region` | ISO-3166-2 형식의 클라이언트 지역 코드. 최대 길이는 세 글자 |
| `eas-ip-city` | 사람이 읽을 수 있는 클라이언트 도시 이름(선택 사항). 예: `London`, `Chicago` |
| `eas-ip-latitude` | 클라이언트 위도에 대한 최선의 추정값(선택 사항) |
| `eas-ip-longitude` | 클라이언트 경도에 대한 최선의 추정값(선택 사항) |
| `eas-ip-timezone` | 클라이언트의 timezone. 예: `Europe/London` |
| `eas-ip-eu` | 요청이 유럽 연합의 관할 구역에서 시작된 것으로 추정되면 `1`로 설정됨 |

### Request URL과 origin

EAS Hosting은 여러 hostname의 요청을 deployment로 라우팅합니다. [Aliases](/eas/hosting/deployments-and-aliases)와 [Custom domains](/eas/hosting/custom-domain) 때문에 클라이언트가 요청할 때 사용한 **incoming** URL과 API routes가 받는 **target** URL이 다를 수 있습니다.

예를 들어 클라이언트가 `https://my-app--staging.expo.app/` 같은 alias URL로 요청하더라도, 해당 요청을 받는 worker deployment의 URL은 `https://my-app--or1170q9ix.expo.app/`처럼 deployment ID를 포함하게 됩니다.

이 차이는 API routes에서 받는 `Request`의 URL과 헤더에도 그대로 반영됩니다. `request.url`은 worker deployment의 URL이 되지만, `Origin`과 `X-Forwarded-Host` 헤더는 클라이언트가 실제로 사용한 incoming URL로 설정됩니다.

```js
export async function GET(request) {
  request.url; // 'https://my-app--or1170q9ix.expo.app/'
  request.headers.get('Origin'); // 'https://my-app--staging.expo.app/'
  request.headers.get('X-Forwarded-Host'); // 'my-app--staging.expo.app'
  origin; // 'https://my-app--staging.expo.app/'
}
```

### IP 헤더

요청에는 요청을 보낸 사용자 기기의 IP 주소를 식별하기 위한 여러 헤더가 포함됩니다.

-   `Forwarded`는 세미콜론으로 구분된 매개변수들의 쉼표 구분 목록을 포함합니다. 목록의 각 항목은 요청을 전달한 프록시 하나를 나타냅니다. 따라서 첫 번째 항목의 `for` 매개변수가 원래 클라이언트의 IP 주소일 가능성이 높습니다.
-   `X-Forwarded-For`는 쉼표로 구분된 IP 주소 목록만 포함합니다. 목록의 각 항목 역시 요청을 전달한 프록시를 나타냅니다.
-   `X-Real-IP`는 원래 요청의 IP 주소만 포함합니다.

예를 들어 API route를 호출하는 사용자 브라우저의 IP 주소를 가져오려면 요청에서 `X-Real-IP` 헤더를 읽으면 됩니다.

```js
export async function GET(request) {
  const ip = request.headers.get('X-Real-IP');
}
```

### Geo 헤더

요청에는 요청이 어디에서 왔는지에 대한 지리 정보가 담긴 여러 헤더도 포함됩니다.

-   `eas-colo`는 요청을 처리한 데이터 센터의 Cloudflare 코드를 포함합니다. 예: `lhr`
-   `eas-ip-continent`는 현재 요청의 대륙 코드를 포함합니다.
    -   `AF`: 아프리카
    -   `AN`: 남극
    -   `AS`: 아시아
    -   `EU`: 유럽
    -   `NA`: 북아메리카
    -   `OC`: 오세아니아
    -   `SA`: 남아메리카
-   `eas-ip-country`는 ISO-3166 Alpha 2 국가 코드를 포함합니다. 최대 두 글자입니다. 예: `US`, `JP`
-   `eas-ip-region`은 요청에 대한 ISO-3166-2 지역 코드를 포함합니다. 이 값의 최대 길이는 세 글자입니다. 다만 특정 국가의 지역 코드 방식에 따라 달라질 수 있으며, 한 자리에서 세 자리 숫자, 한 자리에서 세 자리 문자, 또는 그 밖의 조합일 수 있습니다.
-   `eas-ip-city`는 사람이 읽을 수 있는 도시 이름을 포함할 수 있습니다. 예: `London`, `Chicago`
-   `eas-ip-latitude`와 `eas-ip-longitude`는 요청의 대략적인 위도와 경도를 포함합니다.
-   `eas-ip-timezone`은 요청이 시작된 timezone에 대한 최선의 추정값을 포함합니다. 예: `Europe/London`
-   `eas-ip-eu`는 요청이 유럽 연합의 관할 구역에서 시작된 것으로 추정되면 `1`로 설정됩니다.
