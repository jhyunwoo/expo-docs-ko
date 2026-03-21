---
modificationDate: February 26, 2026
title: Reserved paths
description: Metro와 Expo Router에서 예약해 두었으므로 route나 정적 파일에 사용하지 말아야 하는 URL path를 알아보세요.
---

# Reserved paths

Metro와 Expo Router에서 예약해 두었으므로 route나 정적 파일에 사용하지 말아야 하는 URL path를 알아보세요.

특정 URL path에 route를 만들거나 정적 파일을 두면, Metro 또는 Expo Router가 콘텐츠를 제공하는 대신 그 요청을 가로챕니다. path에 따라 "404 Asset not found" 오류가 나거나, 페이지가 내부 dev server 응답으로 조용히 대체될 수 있습니다.

## `/assets/*`

Metro는 이 path에서 번들된 모든 asset(이미지, 폰트, 기타 파일)을 제공합니다. **app/assets.tsx**에 route를 만들거나 **public/assets/**에 디렉터리를 만들면 Metro가 요청을 가로채고, 여러분의 콘텐츠에는 절대 도달하지 않습니다.

이 동작은 최상위 route와 정적 파일 모두에 적용됩니다:

`app`

  `assets.tsx`Conflicts with Metro

  `assets`

    `index.tsx`Conflicts with Metro

`public`

  `assets`

    `logo.png`Conflicts with Metro

충돌을 피하려면 route나 디렉터리 이름을 바꾸세요:

`app`

  `media.tsx`Works

`public`

  `images`

    `logo.png`Works

## `/_expo/*`

Expo Router는 dev tools와 manifest를 포함한 여러 내부 middleware에 이 path를 사용합니다. 이 path 아래에 route나 정적 파일을 만들지 마세요.

## `/_flight/*`

React Server Components는 내부적으로 이 path를 사용합니다. 이 path 아래에 route나 정적 파일을 만들지 마세요.

## `/inspector`

React Native는 debugger를 위해 `/inspector/debug`와 `/inspector/network`를 사용합니다. `/inspector` 또는 그 하위 path와 일치하는 route를 만들지 마세요.

## `/expo-dev-plugins/*`

Expo development tool plugin은 이 path를 사용합니다. 이 path 아래에 route나 정적 파일을 만들지 마세요.

## `/manifest`

dev server는 이 path에서 네이티브 앱 manifest를 제공합니다. **app/manifest.tsx**에 route를 만들면 dev server가 여러분의 페이지 대신 manifest JSON을 응답합니다. 개발 중에는 route가 조용히 로드되지 않는 것처럼 보일 것입니다.

## `/_sitemap`

Expo Router는 디버깅을 위해 이 path에 sitemap route를 자동 생성합니다. **app/_sitemap.tsx**에 route를 만들면 내장 sitemap을 덮어쓰게 됩니다. 이 기능에 대한 자세한 내용은 [Sitemap](/router/reference/sitemap)을 참고하세요.

## `/public/*`

프로젝트에 **public** 디렉터리가 있다면 `/public` URL path는 정적 파일 제공과 충돌할 수 있습니다. **public** 디렉터리가 존재할 때는 path가 암묵적으로 예약되므로 **app/public.tsx** 또는 **app/public/index.tsx**에 route를 만들지 마세요.

## `/favicon.ico`

위 path들과 달리 `/favicon.ico`는 덮어써도 안전합니다. Expo CLI는 제공된 favicon이 없으면 기본 favicon을 제공합니다. **public** 디렉터리에 **favicon.ico** 파일을 두거나 [API route](/router/web/api-routes)를 만들어 이를 대체할 수 있습니다.
