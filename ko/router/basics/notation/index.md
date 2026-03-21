---
modificationDate: February 26, 2026
title: Expo Router notation
description: 프로젝트 파일 구조 안에서 앱의 navigation tree를 표현력 있게 정의하기 위해 특수 파일명과 표기법을 사용하는 방법을 알아보세요.
---

# Expo Router notation

프로젝트 파일 구조 안에서 앱의 navigation tree를 표현력 있게 정의하기 위해 특수 파일명과 표기법을 사용하는 방법을 알아보세요.

일반적인 Expo Router 프로젝트의 **src/app** 디렉터리를 들여다보면 단순한 파일명과 디렉터리명만 보이지는 않습니다. 괄호와 대괄호는 무엇을 뜻할까요? file-based routing 표기법의 의미와, 이 표기법이 복잡한 navigation 패턴을 정의할 수 있게 해주는 방식을 알아봅시다.

## Types of route notation

### Simple names/no notation

`src`

 `app`

  `home.tsx`

  `feed`

   `favorites.tsx`

아무 표기법이 없는 일반 파일명과 디렉터리명은 _static routes_를 의미합니다. URL은 파일 트리에 나타난 그대로와 정확히 일치합니다. 따라서 **feed** 디렉터리 안의 **favorites.tsx** 파일은 `/feed/favorites`라는 URL을 갖습니다.

### Square brackets

`src`

 `app`

  `[userName].tsx`

  `products`

   `[productId]`

    `index.tsx`

파일이나 디렉터리 이름에 대괄호가 보인다면 _dynamic route_를 보고 있는 것입니다. route 이름에는 page를 렌더링할 때 사용할 수 있는 parameter가 포함됩니다. parameter는 디렉터리명일 수도 있고 파일명일 수도 있습니다. 예를 들어 **[userName].tsx**라는 파일은 `/evanbacon`, `/expo` 또는 다른 username과 일치합니다. 그런 다음 page 안에서 `useLocalSearchParams` hook을 사용해 해당 parameter에 접근하고, 이를 이용해 특정 사용자에 대한 데이터를 로드할 수 있습니다.

### Parentheses

`src`

 `app`

  `(home)`

   `index.tsx`

   `settings.tsx`

이름이 괄호로 둘러싸인 디렉터리는 _route group_을 나타냅니다. 이런 디렉터리는 URL에 영향을 주지 않으면서 route를 함께 묶는 데 유용합니다. 예를 들어 **src/app/(home)/settings.tsx**라는 파일의 URL은 **src/app** 디렉터리 바로 안에 있지 않더라도 `/settings`가 됩니다.

route group은 단순한 정리 용도로도 유용하지만, 복잡한 route 관계를 정의할 때 훨씬 더 중요해지는 경우가 많습니다.

### index.tsx files

`src`

 `app`

  `(home)`

   `index.tsx`

  `profile`

   `index.tsx`

웹과 마찬가지로 **index.tsx** 파일은 디렉터리의 기본 route를 의미합니다. 예를 들어 **profile/index.tsx** 파일은 `/profile`과 일치합니다. **(home)/index.tsx** 파일은 `/`와 일치하며, 사실상 앱 전체의 기본 route가 됩니다.

### _layout.tsx files

`src`

 `app`

  `_layout.tsx`

  `(home)`

   `_layout.tsx`

  `feed`

   `_layout.tsx`

**_layout.tsx** 파일은 그 자체가 page는 아니지만, 디렉터리 안에 있는 route group이 서로 어떤 관계에 있는지 정의하는 특수 파일입니다. route 디렉터리가 stack이나 tabs로 구성되어 있다면, layout route는 stack navigator나 tab navigator component를 사용해 그 관계를 정의하는 곳입니다.

layout route는 해당 디렉터리 안의 실제 page route보다 먼저 렌더링됩니다. 즉, **src/app** 디렉터리 바로 안의 **_layout.tsx**는 앱에서 다른 어떤 것보다 먼저 렌더링되며, 예전에는 **App.jsx** 파일 안에 넣었을 초기화 코드를 두는 곳입니다.

### Plus sign

`src`

 `app`

  `+not-found.tsx`

  `+html.tsx`

  `+native-intent.tsx`

  `+middleware.ts`

`+`가 포함된 route는 Expo Router에서 특별한 의미를 가지며, 특정 목적을 위해 사용됩니다. 몇 가지 예시는 다음과 같습니다:

-   [`+not-found`](/router/error-handling#unmatched-routes)는 앱 안의 어떤 route와도 일치하지 않는 요청을 처리합니다.
-   [`+html`](/router/web/static-rendering#root-html)은 web에서 앱이 사용하는 HTML boilerplate를 커스터마이징하는 데 사용됩니다.
-   [`+native-intent`](/router/advanced/native-intent)는 third-party 서비스가 생성한 link처럼, 특정 route와 일치하지 않는 deep link를 앱 안에서 처리하는 데 사용됩니다.
-   [`+middleware`](/router/web/middleware)는 route가 렌더링되기 전에 코드를 실행해, 모든 요청에 대해 authentication이나 redirection 같은 작업을 수행하는 데 사용됩니다.

> `/assets` 같은 일부 path 이름은 Metro와 Expo Router에서 예약되어 있습니다. route로 사용하지 마세요. 전체 목록은 [Reserved paths](/router/reference/reserved-paths)를 참고하세요.

## Route notation applied

다음 프로젝트 파일 구조를 보고 어떤 종류의 route가 표현되어 있는지 식별해봅시다:

`src`

 `app`

  `(home)`

   `_layout.tsx`

   `index.tsx`

   `feed.tsx`

   `profile.tsx`

  `_layout.tsx`

  `users`

   `[userId].tsx`

  `+not-found.tsx`

  `about.tsx`

-   **src/app/about.tsx**는 `/about`과 일치하는 static route입니다.
-   **src/app/users/[userId].tsx**는 `/users/123`, `/users/456` 등과 일치하는 dynamic route입니다.
-   **src/app/(home)**는 route group입니다. URL에 포함되지 않으므로 `/feed`는 **src/app/(home)/feed.tsx**와 일치합니다.
-   **src/app/(home)/index.tsx**는 **(home)** 디렉터리의 기본 route이며 `/` URL과 일치합니다.
-   **src/app/(home)/_layout.tsx**는 **src/app/(home)/** 안의 page들이 서로 어떤 관계에 있는지 정의하는 layout 파일입니다.
-   **src/app/_layout.tsx**는 root layout 파일이며, 앱의 다른 어떤 route보다 먼저 렌더링됩니다.
-   **src/app/+not-found.tsx**는 사용자가 앱에 존재하지 않는 route로 이동했을 때 표시되는 특수 route입니다.
