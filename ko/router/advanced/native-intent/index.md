---
modificationDate: February 26, 2026
title: links 커스터마이징하기
description: Expo Router 사용 시 +native-intent로 link redirection을 수행하고 서드파티 deep links를 활용하는 방법을 알아보세요.
---

# links 커스터마이징하기

Expo Router 사용 시 +native-intent로 link redirection을 수행하고 서드파티 deep links를 활용하는 방법을 알아보세요.

Expo Router는 앱 안에서 내비게이션하기 위해 웹 표준의 확장 버전을 사용합니다. 하지만 네이티브 앱은 항상 서버 기반 라우팅을 따르지 않습니다. 이 때문에 서드파티 서비스를 통합할 때 어긋남이 생길 수 있습니다. 예를 들어 앱은 URL 대신 임의의 문자열이나 intent object로 실행될 수 있습니다. link를 커스터마이징해야 하는 흔한 시나리오는 두 가지입니다:

-   **App Closed**: 앱이 열려 있지 않을 때 들어오는 deep-link URL은 자연스러운 내비게이션을 보장하기 위해 rewrite가 필요할 수 있습니다.
    
-   **App Open**: 앱이 이미 열려 있을 때는 특정 비즈니스 로직이나 사용자 상호작용에 따라 URL 커스터마이징이 필요할 수 있습니다. 이 로직은 앱 전체에 적용되는 전역 로직일 수도 있고, 특정 routes 집합에만 적용되는 로컬 로직일 수도 있습니다.
    

## linking 설정하기

앱에서 linking을 설정하고 테스트하는 방법은 [Linking into your app](/linking/into-your-app) 가이드를 참고하세요.

## 들어오는 네이티브 deep links rewrite하기

Expo Router는 항상 URL이 앱 내부의 특정 페이지를 가리킨다고 가정하고 평가합니다. 하지만 실제로는 이러한 URL의 성격이 달라질 수 있습니다:

-   **서드파티 provider가 생성한 고유/추천 URL**: 이런 URL은 대개 `<my-scheme>://<provider-hostname>/<uuid>`처럼 특정 스키마를 따르며, 외부 소스가 사용자에게 앱 안의 특정 콘텐츠로 이동하게 하기 위해 생성합니다.
-   **이전 버전의 오래된 URL**: 앱 사용자는 앱의 오래된 버전에서 생성된 URL을 접할 수 있으며, 이는 더 이상 존재하지 않거나 오래된 콘텐츠로 이어질 수 있습니다. 자연스러운 사용자 경험을 위해 이런 경우를 적절히 처리하는 것이 중요합니다.

이런 상황에서는 URL을 올바른 route로 향하도록 rewrite해야 합니다.

이를 돕기 위해 프로젝트의 **src/app** 디렉터리 최상위에 **+native-intent.tsx**라는 특별한 파일을 만드세요. 이 파일은 URL/path 처리를 담당하는 특별한 [`redirectSystemPath`](/versions/latest/sdk/router#nativeintent) 메서드를 export합니다. 이 메서드가 호출되면 `path`와 `initial`이라는 두 속성이 있는 `options` object를 받습니다.

`src`

 `app`

  `+native-intent.tsx`

다음은 **+native-intent.tsx** 파일 안에서 `redirectSystemPath`를 사용하는 방식에 대한 모범 사례 예시입니다. 이 예시를 따르면 앱의 URL 처리 기능을 안정적으로 유지하고 예기치 않은 오류나 크래시 위험을 줄일 수 있습니다.

```ts
import ThirdPartyService from 'third-party-sdk';

export function redirectSystemPath({ path, initial }) {
  try {
    if (initial) {
      // While the parameter is called `path` there is no guarantee that this is a path or a valid URL
      const url = new URL(path, 'myapp://app.home');
      // Detection of third-party URLs will change based on the provider
      if (url.hostname === '<third-party-provider-hostname>') {
        return ThirdPartyService.processReferringUrl(url).catch(() => {
          // Something went wrong
          return '/unexpected-error';
        });
      }
      return path;
    }
    return path;
  } catch {
    // Do not crash inside this function! Instead you should redirect users
    // to a custom route to handle unexpected errors, where they are able to report the incident
    return '/unexpected-error';
  }
}
```

## 들어오는 웹 deep links rewrite하기

웹에서 deep links를 처리하는 방식은 네이티브 플랫폼과 다릅니다. 초기 라우팅 과정이 다르게 일어나기 때문입니다. Expo Router는 web에 대해 `+native-intent`에 해당하는 직접적인 대응 기능을 제공할 수 없습니다. 웹 라우팅은 웹사이트의 JavaScript가 실행되기 전에 해결되며, 배포 출력 방식과 선택한 provider에 따라 달라지기 때문입니다.

따라서 요구 사항에 가장 잘 맞는 다음 패턴 중 하나를 구현해야 합니다:

-   **Server Redirect**: 정적 페이지를 포함한 모든 웹사이트는 서버에 호스팅되므로, 배포 provider가 제공하는 서버 측 redirection 또는 middleware 옵션을 활용해보세요. 이 접근 방식은 **server** 또는 **static** 출력을 대상으로 하는 배포에 적합합니다.
-   **Client Redirect**: 또는 앱의 루트 `_layout` 안에서 URL redirects를 관리할 수 있습니다. 이 접근 방식은 client-side rendering을 대상으로 하는 단일 출력 형식 프로젝트에 적합합니다.

웹 플랫폼에서 들어오는 deep links를 자연스럽게 처리하려면 배포 전략과 기술 요구 사항에 맞는 패턴을 선택하세요.

## URLs rewrite하기

앱이 열려 있는 동안에는 `_layout` 파일 안에서 `usePathname()` hook을 사용해 URL 변경에 반응할 수 있습니다. `_layout`의 위치가 subscription의 범위를 결정합니다.

-   **global**: 루트 `_layout` 파일에 로직을 추가합니다
-   **localized**: 기존 디렉터리에 `_layout` 파일을 추가합니다(또는 새 [group directory](/router/basics/notation#parentheses)를 만듭니다)

```tsx
import { Slot, Redirect } from 'expo-router';

export default function RootLayout() {
  const pathname = usePathname();

  if (pathname && !isUserAllowed(pathname)) {
    return <Redirect href="/home" />;
  }

  return <Slot />;
}
```

### `redirectSystemPath` 사용하기

네이티브 앱에서는 URL을 rewrite하는 대안으로 [`redirectSystemPath`](/router/advanced/native-intent#redirectsystempath) 메서드 안에서 직접 처리할 수도 있습니다. 일부 사용 사례에서는 이 접근이 더 단순할 수 있지만, 몇 가지 단점이 있습니다:

-   **네이티브 전용**: `+native-intent`는 네이티브 앱에서만 사용할 수 있으므로 이 메서드는 web에서 동작하지 않습니다.
-   **컨텍스트 부족**: `+native-intent`는 앱의 컨텍스트 밖에서 처리됩니다. 따라서 사용자 인증 상태나 현재 route 상태 같은 추가 로직에 접근할 수 없습니다.

## 서드파티 서비스로 내비게이션 이벤트 보내기

다음은 analytics 또는 logging 서비스 같은 외부 서비스로 내비게이션 이벤트를 보내는 기본 예시입니다. 구체적인 지침은 사용하는 provider의 문서를 참고하세요.

```tsx
import ThirdPartyService from 'third-party-sdk';
import { Slot, usePathname } from 'expo-router';

const thirdParty = new ThirdPartyService();

export default function RootLayout() {
  const pathname = usePathname();

  // Perform the service initiation logic
  useEffect(() => {
    thirdParty.register();
    return () => {
      thirdParty.deregister();
    };
  }, [thirdParty]);

  // Send pathname changes to the third party
  useEffect(() => {
    thirdParty.sendEvent({ pathname });
  }, [pathname]);

  return <Slot />;
}
```

## Universal Links와 multiple domains

Expo Router는 Universal Links와 multiple domains에 대해 추가 설정을 요구하지 않습니다. 앱에 제공되는 모든 URL이 평가됩니다. 앱의 URL scheme을 커스터마이징하려면 [app config에서 `scheme` 값을 커스터마이징](/versions/latest/config/app#scheme)하세요.

## 웹 링크 강제로 사용하기

URL을 사용자의 브라우저가 먼저 평가하게 하고 싶다면, `http`/`https` scheme을 가진 Fully Qualified URL(FQDN)로 주소를 작성하세요. 완전한 URL을 사용하면 해당 링크가 웹 URL로 해석되어 기본적으로 사용자의 브라우저에서 열립니다.

이 접근 방식은 사용자를 외부 웹사이트나 다른 앱의 Universal Links로 보내는 데 효과적입니다.

```ts
<Link href="https://my-website.com/router/introduction" />
```

## `legacy_subscribe`

> `legacy_subscribe`는 alpha 상태이며 SDK 52에서 사용할 수 있습니다.

Expo Router를 지원하지 않지만 기존 프로젝트용 `Linking.subscribe` 함수를 통해 React Navigation은 지원하는 서드파티 provider를 사용 중이라면, 대안 API로 `legacy_subscribe`를 사용할 수 있습니다.

이 API는 새 프로젝트나 새 통합에는 권장되지 않습니다. 이 API의 사용 방식은 Server Side Routing 및 [Static Rendering](/router/web/static-rendering)과 호환되지 않으며, 오프라인 상태나 네트워크 연결이 불안정한 환경에서는 관리가 어려울 수 있습니다.
