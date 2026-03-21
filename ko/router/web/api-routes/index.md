---
modificationDate: March 09, 2026
title: API Routes
description: Expo Router로 server endpoint를 만드는 방법을 알아보세요.
---

# API Routes

Expo Router로 server endpoint를 만드는 방법을 알아보세요.

Expo Router를 사용하면 **src/app** 디렉터리 안에서 모든 플랫폼을 위한 안전한 server code를 작성할 수 있습니다.

```ts
export function GET(request: Request) {
  return Response.json({ hello: 'world' });
}
```

Server 기능은 custom server가 필요하며, EAS 또는 대부분의 [other hosting providers](/router/web/api-routes#deployment)에 배포할 수 있습니다.

[시청: Expo Router API Routes Handle Requests & Stream Data](https://www.youtube.com/watch?v=2_UzR1wdimI) — Expo Router API route로 server endpoint를 만들어 request를 처리하고, JSON을 반환하고, data를 stream하는 방법을 확인해 보세요.

## What are API Routes

API Route는 route가 매칭될 때 server에서 실행되는 function입니다. API key 같은 민감한 데이터를 안전하게 처리하거나, auth code를 access token으로 교환하는 것과 같은 custom server logic을 구현하는 데 사용할 수 있습니다. API Route는 [WinterCG](https://wintercg.org/)-compliant 환경에서 실행되어야 합니다.

Expo에서 API Route는 **app** 디렉터리 안에 `+api.ts` 확장자를 가진 파일을 만들어 정의합니다. 예를 들어, 다음 API route는 `/hello` route가 매칭될 때 실행됩니다.

`src`

 `app`

  `index.tsx`

  `hello+api.ts``API Route`

## Create an API route

프로젝트가 server output을 사용하고 있는지 확인하세요. 이렇게 하면 export와 production build가 client bundle과 함께 server bundle도 생성하도록 구성됩니다.

```json
{
  "web": {
    "output": "server"
  }
}
```

API route는 **app** 디렉터리 안에 생성됩니다. 예를 들어, 다음 route handler를 추가해 보세요. 이 handler는 `/hello` route가 매칭될 때 실행됩니다.

```ts
export function GET(request: Request) {
  return Response.json({ hello: 'world' });
}
```

Server route에서는 `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS` function 가운데 어느 것이든 export할 수 있습니다. 해당 HTTP method가 매칭되면 그 function이 실행됩니다. 지원하지 않는 method는 자동으로 `405: Method not allowed`를 반환합니다.

Expo CLI로 development server를 시작하세요:

```sh
npx expo
```

Route에 network request를 보내 데이터를 확인할 수 있습니다. 다음 명령으로 route를 테스트하세요:

```sh
curl http://localhost:8081/hello
```

Client code에서 request를 보낼 수도 있습니다:

```tsx
import { Button } from 'react-native';

async function fetchHello() {
  const response = await fetch('/hello');
  const data = await response.json();
  alert('Hello ' + data.hello);
}

export default function App() {
  return <Button onPress={() => fetchHello()} title="Fetch hello" />;
}
```

상대 `fetch` request는 development에서는 자동으로 dev server origin을 기준으로 요청되며, production에서는 **app.json**의 `origin` field로 구성할 수 있습니다:

```json
{
  "plugins": [
    [
      "expo-router",
      {
        "origin": "https://evanbacon.dev/"
      }
    ]
  ]
}
```

이 URL은 `EXPO_UNSTABLE_DEPLOY_SERVER=1` environment variable을 설정해 EAS Build 중 자동으로 구성할 수 있습니다. 그러면 versioned server deployment가 실행되고, origin이 preview deploy URL로 자동 설정됩니다.

Website와 server를 [hosting provider](/router/web/api-routes#deployment)에 배포하면 native와 web 모두에서 production 환경의 route에 접근할 수 있습니다.

> API route 파일 이름에는 플랫폼 전용 확장자를 사용할 수 없습니다. 예를 들어 **hello+api.web.ts**는 동작하지 않습니다.

## Requests

Request는 전역 표준 [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) object를 사용합니다.

```ts
export async function GET(request: Request, { post }: Record<string, string>) {
  // const postId = new URL(request.url).searchParams.get('post')
  // fetch data for 'post'
  return Response.json({ ... });
}
```

### Request body

Request body에 접근하려면 `request.json()` function을 사용하세요. 이 함수는 body를 자동으로 파싱해 결과를 반환합니다.

```ts
export async function POST(request: Request) {
  const body = await request.json();

  return Response.json({ ... });
}
```

### Request query parameters

Query parameter는 request URL을 파싱해서 접근할 수 있습니다:

```ts
export async function GET(request: Request) {
  const url = new URL(request.url);
  const post = url.searchParams.get('post');

  // fetch data for 'post'
  return Response.json({ ... });
}
```

## Response

Response는 전역 표준 [`Response`](https://fetch.spec.whatwg.org/#response) object를 사용합니다.

```ts
export function GET() {
  return Response.json({ hello: 'universe' });
}
```

### Errors

오류 상황에서는 원하는 status code와 response body를 가진 `Response`를 만들 수 있습니다.

```ts
export async function GET(request: Request, { post }: Record<string, string>) {
  if (!post) {
    return new Response('No post found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
  // fetch data for `post`
  return Response.json({ ... });
}
```

정의되지 않은 method로 request를 보내면 자동으로 `405: Method not allowed`가 반환됩니다. Request 처리 중 error가 throw되면 자동으로 `500: Internal server error`가 반환됩니다.

## Runtime API

> Server runtime API와 `expo-server`는 SDK 54 이상에서 사용할 수 있으며, production에서 사용하려면 배포된 server가 필요합니다.

[`expo-server`](/versions/latest/sdk/server) 라이브러리를 사용하면 어떤 server-side Expo code에서든 동작하는 여러 유틸리티와 code pattern을 사용할 수 있습니다. 여기에는 request metadata를 가져오는 유틸리티, task scheduling, error handling이 포함됩니다.

```sh
npx expo install expo-server
```

`expo-server`의 사용은 API Route에만 제한되지 않으며, 예를 들어 [server middleware](/router/web/middleware) 같은 다른 server code에서도 사용할 수 있습니다.

### Error handling

[`StatusError`](/versions/latest/sdk/server#statuserror)를 throw하면 request를 중단하고 대신 error `Response`를 반환할 수 있습니다. 이것은 특별한 `Error` 인스턴스로, error 자체 대신 HTTP response로 대체됩니다.

```ts
import { StatusError } from 'expo-server';

export async function GET(request: Request, { post }: Record<string, string>) {
  if (!post) {
    throw new StatusError(404, 'No post found');
  }
  // ...
}
```

직접 server utility와 helper를 구성할 때 `StatusError`는 예외를 다루기에 더 편리한 방식입니다. 이를 throw하면 API function이 즉시 중단되고 error가 조기에 반환되기 때문입니다.

`StatusError`는 status code와 error message를 받습니다. 선택적으로 JSON이나 `Error` object를 넘길 수도 있으며, 항상 JSON body 안에 `error` key를 포함한 `Response`를 반환합니다.

이 방식은 제약이 있을 수 있어서 모든 경우에 적합하지는 않습니다. 경우에 따라서는 `Response` object 자체를 `throw`하는 편이 더 유리할 수 있습니다. 이렇게 하면 logic이 중단되는 것은 같지만, `StatusError` wrapper 없이 API route에서 직접 resolved `Response`를 대체합니다. 예를 들어 redirect response를 만들 때 사용할 수 있습니다.

```ts
import { StatusError } from 'expo-server';

export async function GET(request: Request, { post }: Record<string, string>) {
  if (!post) {
    throw Response.redirect('https://expo.dev', 302);
  }
  // ...
}
```

### Request metadata

Request는 보통 필요한 대부분의 metadata를 header에 담고 있습니다. 하지만 `expo-server`는 자주 쓰는 값을 더 쉽게 가져오기 위한 helper function을 제공합니다.

`expo-server`의 helper function은 현재 `Request` 범위에 묶인 값을 반환합니다. 이 함수들은 server-side code에서만, 그리고 request가 진행 중일 때만 호출할 수 있습니다.

자주 접근해야 하는 값 중 하나는 request의 origin URL입니다. Origin URL은 보통 request의 `Origin` header를 통해 전달되며, 사용자가 API route에 접근할 때 사용한 URL을 나타냅니다. 이 값은 request가 proxy를 거칠 때 server가 보는 내부 deployment URL과 다를 수 있습니다. 이 값에 접근하려면 `expo-server`의 [`origin()`](/versions/latest/sdk/server#origin) helper method를 사용할 수 있습니다.

```ts
import { origin } from 'expo-server';

export async function GET(request: Request) {
  const target = new URL('/help', origin() ?? request.url);
  return Response.redirect('https://expo.dev', 302);
}
```

Server code를 배포하는 대부분의 runtime에는 production과 staging deployment를 구분하기 위한 environment 개념이 있습니다. `expo-server`의 [`environment()`](/versions/latest/sdk/server#environment) helper를 사용하면 environment 이름을 가져올 수 있습니다. 이 값은 server code를 실행하는 방식에 따라 달라집니다.

```ts
import { environment } from 'expo-server';

export async function GET(request: Request) {
  const env = environment();
  if (env === 'staging') {
    return Response.json({ isStaging: true });
  } else if (!env) {
    return Response.json({ isProduction: true });
  } else {
    return Response.json({ env });
  }
}
```

### Task scheduling

Request handler 안에서는 server logic과 병렬로 비동기 task를 실행해야 할 수 있습니다.

```ts
export async function GET(request: Request) {
  // This will delay the response:
  await pingAnalytics(...);

  const data = await fetchExampleData(...);
  return Response.json({ data });
}
```

위 예제에서는 `await`된 function call이 API route의 나머지 실행을 지연시킵니다. `Response`를 지연시키고 싶지 않다면 이렇게 `await`하는 방식은 مناسب하지 않습니다. 그렇다고 `await` 없이 호출하면 이 task가 serverless function을 계속 실행 상태로 유지한다는 보장이 없습니다.

대신 `expo-server`의 [`runTask()`](/versions/latest/sdk/server#runtaskfn) helper function을 사용해 동시 task를 실행할 수 있습니다. 이것은 service worker code나 다른 serverless runtime에서 보게 되는 [`waitUntil()`](https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent/waitUntil) method와 동등합니다.

```ts
import { runTask } from 'expo-server';

export async function GET(request: Request) {
  // This will NOT delay the response:
  runTask(async () => {
    await pingAnalytics(...);
  });

  const data = await fetchExampleData(...);
  return Response.json({ data });
}
```

`runTask`를 사용하면 비동기 function을 `await`하는 것과 하지 않는 것 사이에서 절충할 수 있습니다. Task는 병렬로 실행되며 API route의 response나 실행을 지연시키지 않지만, runtime이 이를 인지하도록 만들어 너무 일찍 종료되지 않게 해줍니다.

하지만 어떤 경우에는 API route가 `Response`를 반환한 뒤에 task를 지연 실행하고 싶을 수도 있습니다. 이런 경우 API가 request를 거부했다면 그 task를 실행하지 않는 편이 더 나을 수 있습니다. 또한 time-sensitive task가 끝난 뒤에만 함수를 실행하고 싶을 수도 있는데, 이는 concurrent code가 API route 안의 연산량이 큰 작업을 지연시키는 일을 막기 위함입니다.

`expo-server`의 [`deferTask()`](/versions/latest/sdk/server#defertaskfn) helper function을 사용하면 API route가 `Response`를 resolve한 뒤 실행될 task를 예약할 수 있습니다.

```ts
import { deferTask } from 'expo-server';

export async function GET(request: Request) {
  // This will run after this entire function resolves:
  deferTask(async () => {
    await pingAnalytics(...);
  });

  const data = await fetchExampleData(...);
  return Response.json({ data });
}
```

### Response headers

Server logic을 별도의 helper function과 file로 구조화하고 분리할 때는, `Response`가 생성되기 전에 `Response` header를 수정해야 할 수 있습니다.

예를 들어, API route code가 실행되기 전에 [server middleware](/router/web/middleware)에서 `Response`에 metadata를 추가해야 할 수 있습니다.

```ts
import { setResponseHeaders } from 'expo-server';

export default function middleware(request: Request) {
  // Rate limiters typically add a `Retry-After` header
  setResponseHeaders({ 'Retry-After': '3600' });
}
```

위 예제에서는 API route가 나중에 생성할 `Response`에 `Retry-After` header를 추가하고 있습니다. 이 방식은 authentication과 cookie에도 확장해서 사용할 수 있습니다.

```ts
import { setResponseHeaders } from 'expo-server';

export default function middleware(request: Request) {
  // Append cookie to future response
  setResponseHeaders(headers => {
    headers.append('Set-Cookie', 'token=123; Secure');
  });
}
```

## Bundling

API Route는 Expo CLI와 [Metro bundler](/guides/customizing-metro)로 번들됩니다. 이들은 client code와 동일한 언어 기능에 접근할 수 있습니다:

-   [TypeScript](/guides/typescript) — 타입과 [**tsconfig.json** paths](/guides/typescript#path-aliases-optional).
-   [Environment variables](/guides/environment-variables) — server route는 `EXPO_PUBLIC_` 접두사가 붙은 변수뿐 아니라 모든 environment variable에 접근할 수 있습니다.
-   Node.js standard library — server 환경에 맞는 올바른 Node.js 버전을 로컬에서 사용하고 있는지 확인하세요.
-   **babel.config.js**와 **metro.config.js** 지원 — 설정은 client code와 server code 양쪽 모두에서 동작합니다.

## Security

Route handler는 client code와 격리된 sandbox 환경에서 실행됩니다. 즉, route handler 안에 민감한 데이터를 저장해도 client에 노출되지 않으므로 안전합니다.

-   secret가 들어 있는 코드를 import하는 client code는 client bundle에 포함됩니다. 이는 route handler file이 아니더라도(**+api.ts** 접미사가 붙지 않았더라도) **src/app directory**의 **모든 파일**에 적용됩니다.
-   secret가 **<...>+api.ts** 파일 안에 있으면 client bundle에 포함되지 않습니다. 이는 route handler가 import하는 모든 파일에 적용됩니다.
-   Secret stripping은 `expo/metro-config`에서 수행되므로 **metro.config.js**에서 이를 사용해야 합니다.

## Deployment

Production에 배포할 준비가 되었다면 다음 명령을 실행해 **dist** 디렉터리에 server bundle을 만드세요(자세한 내용은 [Expo CLI documentation](/more/expo-cli#exporting)을 참고하세요):

```sh
npx expo export --platform web
```

이 server는 `npx expo serve`(Expo SDK 52 이상에서 사용 가능)로 로컬 테스트할 수 있습니다. 웹 브라우저에서 URL에 접속하거나, local server URL로 `origin`을 설정한 native build를 만들어 확인할 수 있습니다. Production용 server는 [EAS Hosting](/eas/hosting/get-started) 또는 다른 third-party service를 사용해 배포할 수 있습니다.

API Route만 export하고 앱의 website 버전 생성을 건너뛰고 싶다면, 다음 명령을 사용할 수 있습니다. 이 명령은 프로젝트의 server code만 포함하는 **dist** 디렉터리를 생성합니다.

```sh
npx expo export --platform web --no-ssg
```

[Deploy instantly with EAS](/eas/hosting/get-started) — EAS Hosting은 Expo API route와 server를 배포하는 가장 좋은 방법입니다.

### Native deployment

> 이는 SDK 52 이상에서 시작된 alpha 기능입니다. 앞으로 더 자동화되고 더 나은 지원이 제공될 예정입니다.

Expo Router의 server 기능(API Route와 React Server Components)은 remote server를 가리키는 `window.location`과 `fetch`의 native 구현을 중심으로 동작합니다. Development에서는 `npx expo start`로 실행 중인 dev server를 자동으로 가리키지만, production native build가 동작하려면 server를 secure host에 배포하고 Expo Router Config Plugin의 `origin` 속성을 설정해야 합니다.

이렇게 구성하면 `fetch('/my-endpoint')` 같은 상대 fetch request가 자동으로 server origin을 가리키게 됩니다.

이 deployment process는 `EXPO_UNSTABLE_DEPLOY_SERVER=1` environment variable을 사용해 native build 중 올바른 versioning을 보장하도록 실험적으로 자동화할 수 있습니다.

다음은 build 시 versioned production server를 자동 배포하고 연결하도록 native 앱을 구성하는 방법입니다:

**app.json**이나 `expo.extra.router.origin` field에 `origin` field가 설정되어 있지 않은지 확인하세요. 또한 자동 연결 deployment에서는 아직 지원되지 않으므로 **app.config.js**를 사용하지 않는지도 확인하세요.

먼저 한 번 로컬에서 배포해 프로젝트에 [EAS Hosting](/eas/hosting/get-started)을 설정하세요.

```sh
npx expo export -p web
eas deploy
```

`.env` 파일에 `EXPO_UNSTABLE_DEPLOY_SERVER` environment variable을 설정하세요. 이 값은 EAS Build 중 실험적 server deployment 기능을 활성화하는 데 사용됩니다.

```sh
EXPO_UNSTABLE_DEPLOY_SERVER=1
```

이제 자동 server deployment를 사용할 준비가 되었습니다. Build 명령을 실행해 process를 시작하세요.

```sh
eas build
```

다음 명령으로 로컬에서도 실행할 수 있습니다:

```sh
npx expo run:android --variant release
npx expo run:ios --configuration Release
```

Native 앱용 자동 server deployment에 대한 참고 사항:

-   무언가 제대로 설정되지 않았다면 EAS Build의 `Bundle JavaScript` 단계에서 server failure가 발생할 수 있습니다.
-   원한다면 server를 수동으로 배포하고 app build 전에 `origin` URL을 설정할 수 있습니다.
-   자동 deployment는 `EXPO_NO_DEPLOY=1` environment variable로 강제로 건너뛸 수 있습니다.
-   자동 deployment는 아직 [dynamic app config](/workflow/configuration#dynamic-configuration) (**app.config.js**와 **app.config.ts**) file을 지원하지 않습니다.
-   Deployment 로그는 `.expo/logs/deploy.log`에 기록됩니다.
-   `EXPO_OFFLINE` mode에서는 deployment가 실행되지 않습니다.

### Testing the native production app locally

Production build를 local dev server와 연결해 테스트해 보는 것이 유용한 경우가 많습니다. 이렇게 하면 모든 것이 예상대로 동작하는지 확인할 수 있고, 디버깅 속도도 크게 빨라질 수 있습니다.

Production server를 export하세요:

```sh
npx expo export
```

Production server를 로컬에서 호스팅하세요:

```sh
npx expo serve
```

**app.json**의 `origin` field에 origin을 설정하세요. `expo.extra.router.origin`에는 생성된 값이 없어야 합니다. 값은 `http://localhost:8081`이어야 합니다(`npx expo serve`가 기본 포트에서 실행 중이라고 가정).

```json
{
  "expo": {
    "plugins": [
      [
        "expo-router",
        {
          "origin": "http://localhost:8081"
        }
      ]
    ]
  }
}
```

Production에 배포할 때는 이 `origin` 값을 제거하는 것을 잊지 마세요.

Simulator에 release mode로 앱을 build하세요:

```sh
EXPO_NO_DEPLOY=1 npx expo run:ios --configuration Release
```

이제 local server로 들어오는 request를 볼 수 있을 것입니다. Simulator의 network traffic을 검사하고 더 나은 통찰을 얻으려면 [Proxyman](https://proxyman.com/) 같은 도구를 사용하세요.

실험적으로 `--unstable-rebundle` flag를 사용해 URL을 바꾸고 iOS를 빠르게 다시 build할 수 있습니다. 이렇게 하면 native rebuild를 건너뛰고 **app.json**과 client asset만 새로운 것으로 교체합니다.

예를 들어 `eas deploy`를 실행해 새 deployment URL을 얻고, 이를 **app.json**에 추가한 뒤, `npx expo run:ios --unstable-rebundle --configuration Release`를 실행해 새 URL로 앱을 빠르게 다시 build할 수 있습니다.

Store에 제출하기 전에는 일시적인 문제가 없는지 확인하기 위해 clean build를 수행하는 것이 좋습니다.

## Hosting on third-party services

> `expo-server` 라이브러리는 SDK 54에서 추가되었습니다. 더 오래된 SDK에서는 대신 `@expo/server`를 사용하세요.

모든 cloud hosting provider는 Expo server runtime을 지원하기 위해 custom adapter가 필요합니다. 다음 third-party provider는 Expo 팀에서 비공식적이거나 실험적인 지원을 제공합니다.

이 provider에 배포하기 전에 [`npx expo export`](/more/expo-cli#exporting) 명령의 기본 사항을 익혀 두면 좋습니다:

-   **dist**는 Expo CLI의 기본 export 디렉터리입니다.
-   **public** 디렉터리의 파일은 export 시 **dist**로 복사됩니다.
-   `expo-server` 패키지는 export된 Expo web 및 API route artifact를 위한 server-side runtime입니다.
-   `expo-server`는 **.env** file에서 environment variable을 불러오지 않습니다. 이 값들은 hosting provider 또는 사용자에 의해 로드되어야 합니다.
-   Server에는 Metro가 포함되지 않습니다.

`expo-server` 라이브러리에는 여러 provider와 runtime을 위한 adapter가 들어 있습니다. 아래 섹션을 진행하기 전에 `expo-server` 라이브러리를 설치하세요.

```sh
npx expo install expo-server
```

### Bun

Production용 website를 export하세요:

```sh
bunx expo export -p web
```

정적 파일을 제공하고 request를 server route로 위임하는 server entry file을 작성하세요:

```ts
import { createRequestHandler } from 'expo-server/adapter/bun';

const CLIENT_BUILD_DIR = `${process.cwd()}/dist/client`;
const SERVER_BUILD_DIR = `${process.cwd()}/dist/server`;
const handleRequest = createRequestHandler({ build: SERVER_BUILD_DIR });

const port = process.env.PORT || 3000;

Bun.serve({
  port: process.env.PORT || 3000,
  async fetch(req) {
    const url = new URL(req.url);
    console.log('Request URL:', url.pathname);

    const staticPath = url.pathname === '/' ? '/index.html' : url.pathname;
    const file = Bun.file(CLIENT_BUILD_DIR + staticPath);

    if (await file.exists()) return new Response(await file.arrayBuffer());

    return handleRequest(req);
  },
  websocket,
});

console.log(`Bun server running at http://localhost:${port}`);
```

`bun`으로 server를 시작하세요:

```sh
bun run server.ts
```

### Express

필요한 dependency를 설치하세요:

```sh
npm i -D express compression morgan
```

Production용 website를 export하세요:

```sh
npx expo export -p web
```

정적 파일을 제공하고 request를 server route로 위임하는 server entry file을 작성하세요:

```ts
#!/usr/bin/env node

const path = require('path');
const { createRequestHandler } = require('expo-server/adapter/express');

const express = require('express');
const compression = require('compression');
const morgan = require('morgan');

const CLIENT_BUILD_DIR = path.join(process.cwd(), 'dist/client');
const SERVER_BUILD_DIR = path.join(process.cwd(), 'dist/server');

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');

process.env.NODE_ENV = 'production';

app.use(
  express.static(CLIENT_BUILD_DIR, {
    maxAge: '1h',
    extensions: ['html'],
  })
);

app.use(morgan('tiny'));

app.all(
  '/{*all}',
  createRequestHandler({
    build: SERVER_BUILD_DIR,
  })
);
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
```

`node` 명령으로 server를 시작하세요:

```sh
node server.ts
```

### Netlify

> Third-party adapter는 breaking change의 영향을 받을 수 있습니다. 이에 대한 continuous test는 제공하지 않습니다.

Server entry file을 만드세요. 모든 request는 이 middleware를 통해 위임됩니다. 정확한 file 위치가 중요합니다.

```ts
import path from 'node:path';
import { createRequestHandler } from 'expo-server/adapter/netlify';

export default createRequestHandler({
  build: path.join(__dirname, '../../dist/server'),
});
```

프로젝트 루트에 Netlify configuration file을 만들어 모든 request를 server function으로 redirect하세요.

```yaml
[build]
  command = "expo export -p web"
  functions = "netlify/functions"
  publish = "dist/client"

[[redirects]]
  from = "/*"
  to = "/.netlify/functions/server"
  status = 404

[functions]
  # Include everything to ensure dynamic routes can be used.
  included_files = ["dist/server/**/*"]

[[headers]]
  for = "/dist/server/_expo/functions/*"
  [headers.values]
    # Set to 60 seconds as an example.
    "Cache-Control" = "public, max-age=60, s-maxage=60"
```

Configuration file을 만든 뒤, Expo CLI로 website와 function을 build할 수 있습니다:

```sh
npx expo export -p web
```

[Netlify CLI](https://docs.netlify.com/cli/get-started/)를 사용해 Netlify에 배포하세요.

```sh
npm install netlify-cli -g
netlify deploy
```

이제 Netlify CLI가 제공하는 URL에서 website에 접속할 수 있습니다. `netlify deploy --prod`를 실행하면 production URL에 게시됩니다.

Environment variable이나 **.env** file을 사용한다면 이를 Netlify에 추가하세요. **Site settings**로 이동해서 **Build & deploy** 섹션에 추가하면 됩니다.

### Vercel

> Third-party adapter는 breaking change의 영향을 받을 수 있습니다. 이에 대한 continuous test는 제공하지 않습니다.

Server entry file을 만드세요. 모든 request는 이 middleware를 통해 위임됩니다. 정확한 file 위치가 중요합니다.

```ts
const { createRequestHandler } = require('expo-server/adapter/vercel');

module.exports = createRequestHandler({
  build: require('path').join(__dirname, '../dist/server'),
});
```

프로젝트 루트에 Vercel configuration file(**vercel.json**)을 만들어 모든 request를 server function으로 redirect하세요.

```json
{
  "buildCommand": "expo export -p web",
  "outputDirectory": "dist/client",
  "functions": {
    "api/index.ts": {
      "runtime": "@vercel/node@5.1.8",
      "includeFiles": "dist/server/**"
    }
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/api/index"
    }
  ]
}
```

최신 버전의 **vercel.json**은 더 이상 `routes`와 `builds` 설정 옵션을 사용하지 않으며, **dist/client** output 디렉터리에서 public asset을 자동으로 제공합니다.

> **Note:** 이 단계는 **legacy** 버전의 **vercel.json** 사용자를 위한 것입니다. v3를 사용 중이라면 이 단계는 건너뛰어도 됩니다.

Configuration file을 만든 뒤, **package.json**에 `vercel-build` script를 추가하고 값을 `expo export -p web`으로 설정하세요.

[Vercel CLI](https://vercel.com/docs/cli)를 사용해 Vercel에 배포하세요.

```sh
npm install vercel -g
vercel build
vercel deploy --prebuilt
```

이제 Vercel CLI가 제공한 URL에서 website에 접속할 수 있습니다.

## Known limitations

API Routes beta release에서는 아직 지원되지 않는 알려진 기능들이 몇 가지 있습니다.

### No dynamic imports

현재 API Route는 모든 code(Node.js built-in 제외)를 단일 file로 번들하는 방식으로 동작합니다. 즉, server와 함께 번들되지 않는 외부 dependency는 사용할 수 없습니다. 예를 들어 여러 플랫폼 binary를 포함하는 `sharp` 같은 라이브러리는 사용할 수 없습니다. 이 문제는 이후 버전에서 해결될 예정입니다.

### ESM not supported

현재 번들링 구현은 유연성보다 통일성을 더 우선합니다. 그래서 native가 ESM을 지원하지 않는다는 제한이 API Route에도 그대로 이어집니다. 모든 code는 Common JS(`require`/`module.exports`)로 transpile됩니다. 다만 API Route 자체는 ESM으로 작성하는 것을 권장합니다. 이 문제는 이후 버전에서 해결될 예정입니다.
