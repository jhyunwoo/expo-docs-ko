---
modificationDate: January 14, 2025
title: EAS Hosting deployment에서의 캐싱
description: EAS Hosting에서 캐싱이 어떻게 동작하는지 알아보세요.
---

# EAS Hosting deployment에서의 캐싱

EAS Hosting에서 캐싱이 어떻게 동작하는지 알아보세요.

## API Routes와 함께 캐싱 사용하기

API routes는 `Cache-Control` 지시어를 반환할 수 있으며, EAS Hosting은 이 값에 따라 응답을 적절히 캐시합니다.

```js
export async function GET(request) {
  return Response.json({ ... }, {
    headers: {
	    'Cache-Control': 'public, max-age=3600'
    },
  });
}
```

응답에 포함된 `Cache-Control` 지시어는 명시된 방식대로 EAS Hosting이 응답을 캐시하는 데 사용됩니다. 예를 들어 `Response`가 `max-age`를 1800초로 지정한 캐시 지시어를 포함하면, API route가 다시 호출되기 전까지 응답은 지정된 시간 동안 캐시됩니다.

`Cache-Control` 지시어에 대한 자세한 내용은 [MDN 문서](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)를 참고하세요.

## Cache-Control 지시어

`Cache-Control` 헤더는 요청 헤더와 응답 헤더의 일부로 전송될 수 있으며, 쉼표로 구분된 설정 문자열입니다.

요청이 `Cache-Control` 헤더를 보내면 일반적으로 캐시된 응답을 어떻게 제공할 수 있는지 제한하는 지시어를 전달합니다. 응답 헤더로 보내면 EAS Hosting에 응답을 어떻게 캐시하고, API route를 다시 호출해 얼마나 자주 재검증할지 지정합니다.

캐시 지시어가 매개변수를 받는 경우 지시어 뒤에 등호와 매개변수 값을 붙입니다. 예를 들어 `max-age=3600`입니다. 매개변수를 받지 않는 지시어는 `public`처럼 값 없이 작성합니다.

여러 캐시 지시어를 전달할 경우 각각은 `public, max-age=3600`처럼 쉼표로 구분합니다.

## 캐시 가능성

몇 가지 응답 지시어는 캐시된 응답을 캐시하거나 클라이언트에 반환할 수 있는지를 결정합니다.

-   `public` — EAS Hosting을 포함한 모든 cache가 응답을 저장할 수 있음을 나타냅니다. 이 값이 없으면 응답이 여러 요청 간에 공유되지 않는다고 간주됩니다.
-   `private` — 응답이 단일 사용자를 위한 것이며 브라우저만 캐시할 수 있음을 나타냅니다.
-   `no-store` 또는 `no-cache` — 이 응답은 절대 캐시하거나 저장해서는 안 된다는 뜻입니다.

예를 들어 `public, max-age=3600`을 지정하면 사용자의 브라우저뿐 아니라 EAS Hosting도 응답을 3600초 동안 저장할 수 있습니다. 반면 `private, max-age=3600`은 사용자의 브라우저만 응답을 3600초 동안 저장할 수 있고, EAS Hosting은 이를 캐시하지 않는다는 의미입니다.

`Authorization` 헤더가 없고 요청 메서드가 `HEAD` 또는 `GET`인 요청에 대한 응답은 자동으로 공개 캐시 가능(publicly cacheable)한 것으로 간주됩니다.

브라우저와 EAS Hosting이 각각 무엇을 캐시할 수 있는지 구분하려면 `s-maxage` 지시어를 사용할 수 있습니다. 예를 들어 `s-maxage=3600` 지시어로 응답하면 EAS Hosting은 응답을 3600초 동안 캐시하지만, 사용자의 브라우저는 전혀 캐시하지 않습니다.

## 헤더 이름

위에서 보았듯 Cache-Control 헤더는 브라우저와 EAS Hosting 모두가 받아들이고 이해합니다. EAS Hosting용 캐싱을 사용자의 브라우저와 분리해 더 세밀하게 조정하려면 CDN-Cache-Control 헤더로 응답할 수 있습니다. 이 헤더를 사용하면 지시어에 암묵적으로 `public`이 추가되고, EAS Hosting이 해당 지시어에 따라 응답을 캐시하도록 강제합니다.

```js
export async function GET(request) {
  return Response.json({ ... }, {
    headers: {
	    'Cache-Control': 'no-store', // browsers should never store the response
	    'CDN-Cache-Control': 'max-age=3600', // EAS Hosting should cache for 3600s
    },
  });
}
```

## 만료 지시어

-   `max-age`는 응답이 stale 상태로 간주되기 전까지 얼마나 오래 캐시되는지 지정하는 데 사용합니다.
-   `s-maxage`는 EAS Hosting에만 응답을 얼마나 오래 캐시해야 하는지 알리는 데 사용합니다.
-   `no-cache`는 `max-age`를 0으로 지정하는 것과 같습니다.
-   `immutable`은 응답을 무기한 캐시 가능하다고 표시하며, 가능한 한 오래 캐시되고 stale로 간주되지 않아야 함을 나타냅니다.

추가로 더 최근에 도입된 두 가지 cache control 지시어를 사용하면 `max-age`로 지정된 기간보다 더 오래 stale 응답을 어떻게 사용할지 결정할 수 있습니다.

-   `stale-while-revalidate`는 응답의 stale 기간을 지정합니다. 캐시된 응답이 stale로 간주된 뒤에도 지정한 시간 동안에는 클라이언트에 응답을 계속 반환하면서, 백그라운드에서 요청을 재검증할 수 있게 합니다.
    -   예를 들어 `max-age=1800, stale-while-revalidate=3600`은 응답이 1800초 동안 캐시된다는 뜻입니다. 1800초가 지난 뒤 이 응답에 대한 새 요청이 들어오면, 요청 시점이 3600초 이내라면 stale 응답이 반환되지만 동시에 백그라운드에서 요청이 API route로 전달됩니다.
-   `stale-if-error`는 기본 API route가 예상치 못하게 실패했을 때 stale 응답을 반환할 수 있는 기간을 지정합니다. 이 기능은 API route를 fault-tolerant하게 만드는 데 유용하며, API route가 runtime error로 크래시하거나 `500`, `502`, `503`, `504` 상태 코드를 반환할 때 적용됩니다.
    -   예를 들어 `max-age=1800, stale-if-error=3600`은 응답이 1800초 동안 캐시된다는 뜻입니다. 1800초 이후 API route가 오류로 응답하면, 오류 대신 stale 캐시 응답이 클라이언트에 전송됩니다.

## 요청 지시어

`Cache-Control` 헤더는 요청 헤더의 일부로도 전송될 수 있으며, EAS Hosting이 캐시된 응답을 어떤 방식으로 반환할지에 영향을 줍니다.

-   `only-if-cached`는 응답이 캐시에 있을 때만 반환하고, 그렇지 않으면 `504` 응답(`must-revalidate` 지시어 포함)으로 요청을 중단합니다.
-   `no-store`, `no-cache`, 또는 `max-age=0`은 캐시된 응답을 건너뛰고, EAS Hosting이 요청 캐시를 무시하도록 항상 강제합니다.
-   `min-fresh`는 지정한 값보다 오래된 캐시 응답을 건너뜁니다. 예를 들어 `min-fresh=360`은 360초를 초과해 캐시된 응답이 반환되지 않도록 합니다.

추가로 `max-stale`과 `stale-if-error`를 요청의 cache directive 일부로 보낼 수 있으며, 캐시된 응답의 stale 기간을 제한합니다. 다만 이것이 요청이 캐시되는 기간 자체를 덮어쓰는 것은 아니므로, 이 값은 캐시된 응답이 허용하는 stale 기간을 **줄이는** 데만 사용할 수 있다는 점을 기억하세요.

-   `max-stale`은 클라이언트가 받아들일 수 있는 캐시 응답의 최대 시간을 지정합니다. 예를 들어 응답이 `stale-while-revalidate=3600` 지시어로 캐시되었다면, 요청에서 `max-stale=1800`을 지정해 최대 1800초(`max-age`가 아니라 stale 기간 기준)까지만 stale 응답을 허용하도록 할 수 있습니다.
-   `stale-if-error`는 API route가 오류로 응답할 경우 stale 응답을 허용하는 기간을 사용자 지정하는 데 사용할 수 있습니다.

두 지시어 모두에서 server-side 응답이 응답의 `max-age` 위에 더해진 `max-stale` 또는 `stale-if-error` 기간보다 더 짧게 캐시되었다면, 이 지시어들은 아무런 효과가 없습니다.

## 요청 메서드

EAS Hosting은 `GET` 및 `HEAD` 요청 캐싱에 더해 `POST` 요청 캐싱도 지원합니다.

요청 본문이 1MB보다 작은 `POST` 요청이 전송되었다면, 응답에서 `public` 지시어가 포함된 `Cache-Control` 헤더를 지정해 요청을 캐시 가능하도록 표시할 수 있습니다.

## `Expires` 헤더

EAS Hosting은 오래된 [`Expires` 헤더](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expires)를 사용한 캐싱도 지원합니다.

이 방식은 응답을 공개 캐시 가능으로 표시하지 않으므로 일반적으로 인증되지 않은 `GET` 응답에만 사용됩니다. 응답이 캐시되는 시점까지의 HTTP Date 값을 지정할 수 있으며, 지정한 시각 이후 응답은 stale로 간주됩니다.

## `Vary` 헤더

기본적으로

-   `GET` 또는 `HEAD` 요청은 URL만을 기준으로 캐시됩니다.
-   `POST` 요청은 URL과 요청 본문만을 기준으로 캐시됩니다.

하지만 `Vary` 헤더를 사용하면 요청 헤더를 cache key로 사용하도록 지정할 수 있습니다. 예를 들어 API route가 `Vary: custom-header`로 응답하면, 요청의 `custom-header` 헤더 값이 캐시된 요청의 `custom-header` 값과 일치할 때만 캐시된 응답이 사용됩니다.

## CORS 캐싱

많은 웹 요청에서 브라우저는 라우트의 access control 설정을 확인하기 위해 `OPTIONS` 메서드로 CORS 요청을 보냅니다.

이 요청들은 특별한 `Access-Control-Max-Age` 헤더를 사용해 캐시할 수 있습니다. 예를 들어 `Access-Control-Max-Age: 3600`은 `OPTIONS` 응답을 3600초 동안 캐시하며, 이는 브라우저와 EAS Hosting 캐시 모두에 적용됩니다. 이렇게 하면 브라우저의 과도한 요청을 막고, CORS 요청 때문에 API route가 지나치게 자주 호출되는 것도 방지할 수 있습니다.

## Asset 캐싱

deployment가 응답하는 모든 asset에는 브라우저 캐시에 대해 기본 3600초 캐시 시간이 적용됩니다. 성능 향상을 위해 deployment별 asset은 내부적으로 무기한 캐시됩니다. deployment는 immutable이므로 이는 문제를 일으키지 않습니다.

EAS Hosting은 alias에 새 deployment를 할당하면 내부 asset 캐시를 무시합니다. 예를 들어 새 deployment를 production으로 승격하면 캐시는 무시되며, asset 응답은 즉시 새 deployment로 전환됩니다.

## 과금 및 metrics

EAS Hosting은 요청 수(100만 요청 단위)를 기준으로 과금합니다. 하지만 캐시된 요청도 **여전히 quota에 포함**되며, EAS Hosting이 캐시한 요청이라도 요청에 대한 비용이 청구됩니다.

metrics는 캐싱의 영향을 받지 않습니다. 캐시된 요청은 다른 요청과 마찬가지로 로그에 기록되며, EAS dashboard의 metrics에도 그대로 반영됩니다.
