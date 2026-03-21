---
modificationDate: February 26, 2026
title: Progressive web apps
description: Expo 웹사이트에 progressive web app 지원을 추가하는 방법을 알아보세요.
---

# Progressive web apps

Expo 웹사이트에 progressive web app 지원을 추가하는 방법을 알아보세요.

progressive web app(PWA)은 사용자의 기기에 설치할 수 있고 오프라인으로도 사용할 수 있는 웹사이트입니다. 가능한 경우에는 오프라인 지원이 가장 뛰어난 native app을 만드는 것을 권장하지만, PWA는 데스크톱 사용자에게 아주 좋은 선택지입니다.

## Favicons

Expo CLI는 **app.json**의 `web.favicon` 필드를 기반으로 **favicon.ico** 파일을 자동 생성합니다.

```json
{
  "web": {
    "favicon": "./assets/favicon.png"
  }
}
```

또는 **public** 디렉터리에 **favicon.ico** 파일을 만들어 아이콘을 직접 지정할 수도 있습니다.

## Manifest file

PWA는 앱 이름, 아이콘 및 기타 메타데이터를 설명하는 [manifest file](https://developer.mozilla.org/en-US/docs/Web/Manifest)로 구성할 수 있습니다.

**public/manifest.json**에 PWA manifest를 만드세요:

```json
{
  "short_name": "Expo App",
  "name": "Expo Router Sample",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```

**logo192.png** 및 **logo512.png** 파일은 앱이 사용자의 기기에 설치될 때 사용되는 아이콘입니다. 이 파일들도 **public** 디렉터리에 추가해야 합니다.

`public`

 `manifest.json``PWA Manifest`

 `logo192.png``192x192 icon`

 `logo512.png``512x512 icon`

이제 HTML 파일에서 manifest를 연결하세요. 여기서 방법은 웹사이트의 출력 모드(**app.json**의 `web.output`에 표시되며 기본값은 `single`)에 따라 달라집니다.

single-page app을 사용 중이라면, 먼저 **public/index.html**에 템플릿 HTML을 만든 뒤 HTML 파일에서 manifest를 연결할 수 있습니다:

```sh
npx expo customize public/index.html
```

그런 다음 `<head>` 태그에 manifest를 추가하세요:

```html
<link rel="manifest" href="/manifest.json" />
```

## Service workers

service worker는 주로 웹사이트에 오프라인 지원을 추가하는 데 사용됩니다. Google의 Workbox는 웹사이트에 service worker를 추가하는 가장 좋은 방법입니다. [using Workbox CLI](https://developer.chrome.com/docs/workbox/modules/workbox-cli/) 가이드를 따르되, 그 문서에서 "build script"라고 언급하는 곳에서는 `npx expo export -p web`을 사용하세요.

> service worker를 추가할 때는 주의하세요. 웹에서 예상치 못한 동작을 일으키는 것으로 잘 알려져 있습니다. 실수로 웹사이트를 공격적으로 캐시하는 service worker를 배포하면, 사용자가 업데이트를 쉽게 요청할 수 없게 됩니다. 최고의 오프라인 모바일 경험을 원한다면 Expo로 native app을 만드세요. service worker가 있는 웹사이트와 달리 native app은 앱 스토어를 통해 업데이트하여 캐시된 경험을 지울 수 있습니다. 이는 사용자의 기본 브라우저를 초기화하는 것과 비슷하며(service worker가 충분히 공격적이라면 사용자가 실제로 그렇게 해야 할 수도 있습니다). 자세한 내용은 [why service workers are suboptimal](https://github.com/facebook/create-react-app/issues/2398)을 참고하세요.

예를 들어, Workbox를 설정하는 가능한 흐름은 다음과 같습니다:

다음 명령으로 새 프로젝트를 만드세요:

```sh
npm create expo -t tabs my-app
cd my-app
```

이제 HTML 파일에 service worker를 등록하세요. 여기서 방법은 웹사이트의 출력 모드(**app.json**의 `web.output`에 표시되며 기본값은 `single`)에 따라 달라집니다.

다음으로 루트 **index.html**에 service worker 등록 스크립트를 추가하세요.

먼저 아직 없다면 **public/index.html**에 템플릿 HTML을 만드세요:

```sh
npx expo customize public/index.html
```

그런 다음 `<head>` 태그에 service worker 등록 스크립트를 만드세요:

```html
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
</script>
```

이제 wizard를 실행하기 전에 웹사이트를 빌드하세요:

```sh
npx expo export -p web
```

wizard 명령을 실행하고, 앱의 루트로 `dist`를 선택하고 나머지는 기본값을 선택하세요:

```sh
npx workbox-cli wizard
? What is the root of your web app (that is which directory do you deploy)? dist/
? Which file types would you like to precache? js, html, ttf, ico, json
? Where would you like your service worker file to be saved? dist/sw.js
? Where would you like to save these configuration options? workbox-config.js
? Does your web app manifest include search parameter(s) in the 'start_url', other than 'utm_' or 'fbclid' (like '?source=pwa')? No
```

마지막으로 `npx workbox-cli generateSW workbox-config.js`를 실행해 service worker config를 생성하세요.

앞으로는 **package.json**에 build script를 추가해 두 스크립트를 올바른 순서로 함께 실행할 수 있습니다:

```json
{
  "scripts": {
    "build:web": "expo export -p web && npx workbox-cli generateSW workbox-config.js"
  }
}
```

웹사이트를 호스팅한 뒤 Chrome에서 접속하면 Chrome DevTools의 **Application > Service Workers**로 이동해 service worker를 검사할 수 있습니다.
