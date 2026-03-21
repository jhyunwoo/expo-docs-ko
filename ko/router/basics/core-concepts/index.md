---
modificationDate: February 26, 2026
title: Core concepts of file-based routing in Expo Router
description: Expo Router의 기본 규칙과 그것이 나머지 코드와 어떻게 연결되는지 알아보세요.
---

# Core concepts of file-based routing in Expo Router

Expo Router의 기본 규칙과 그것이 나머지 코드와 어떻게 연결되는지 알아보세요.

Expo Router로 앱의 navigation tree를 어떻게 구성할지 살펴보기 전에, 먼저 Expo Router의 file-based routing 기초를 이루는 핵심 개념과 Expo Router 프로젝트 구조가 다른 React Native 프로젝트와 어떻게 다를 수 있는지 이해해봅시다.

## The rules of Expo Router

### 1\. All screens/pages are files inside the src/app directory

앱의 모든 navigation route는 [**src/app**](/router/reference/src-directory) 디렉터리 안의 파일과 하위 디렉터리로 정의됩니다. **src/app** 디렉터리 안의 모든 파일은 앱의 개별 page를 정의하는 default export를 가집니다(특수한 **_layout** 파일은 제외).

따라서 **src/app** 안의 디렉터리는 서로 관련된 screen들의 그룹을 함께 정의합니다.

### 2\. All pages have a URL

모든 page는 **src/app** 디렉터리 안에서 파일 위치와 일치하는 URL path를 가지며, web에서는 주소창에서 그 page로 이동하는 데 사용할 수 있고 네이티브 모바일 앱에서는 앱 전용 deep link로 사용할 수 있습니다. 이것이 Expo Router가 [universal deep-linking](/linking/overview)을 지원한다는 뜻입니다. 플랫폼과 관계없이 앱의 모든 page는 URL로 이동할 수 있습니다.

### 3\. First index.tsx is the initial route

Expo Router에서는 initial route나 첫 번째 screen을 코드로 정의하지 않습니다. 대신 앱을 열면 Expo Router는 `/` URL과 일치하는 첫 번째 **index.tsx** 파일을 찾습니다. [default template](/router/installation#quick-start)에서는 이것이 **src/app/index.tsx**입니다. 앱 사용자가 기본적으로 navigation tree의 더 깊은 위치에서 시작해야 한다면 [route group](/router/basics/notation#parentheses)(이름을 괄호로 감싼 디렉터리)을 사용할 수 있으며, 이 그룹은 URL의 일부로 계산되지 않습니다. 첫 번째 screen을 tab 그룹으로 만들고 싶다면 모든 tab page를 **src/app/(tabs)** 디렉터리 안에 두고 기본 tab을 **index.tsx**로 정의하면 됩니다. 이렇게 구성하면 `/` URL은 사용자를 바로 **src/app/(tabs)/index.tsx** 파일로 데려갑니다.

### 4\. Root _layout.tsx replaces App.jsx/tsx

모든 프로젝트에는 **src/app** 디렉터리 바로 안에 **_layout.tsx** 파일이 있어야 합니다. 이 파일은 앱의 다른 어떤 route보다 먼저 렌더링되며, 예전에는 **App.jsx** 파일 안에 넣었을 초기화 코드, 예를 들어 font 로딩, theme provider 설정, splash screen 제어 같은 코드를 두는 곳입니다. 예를 들어 default template는 이 파일에서 dark/light mode 지원을 위해 앱을 `ThemeProvider`로 감싸고 `AppTabs` component를 렌더링합니다.

### 5\. Default template uses platform-specific tabs

default template는 플랫폼에 따라 서로 다른 두 가지 tab 구현을 사용합니다. Android와 iOS에서는 [native tabs](/router/advanced/native-tabs)를 사용해 tab을 렌더링하는데, 이는 네이티브 look and feel을 위해 플랫폼에 내장된 tab bar를 사용합니다. web에서는 `expo-router/ui`의 [custom tabs](/router/advanced/custom-tabs)를 사용해 tab을 렌더링하는데, 이는 스타일이 적용되지 않은 유연한 component로 tab bar appearance를 완전히 제어할 수 있게 해줍니다.

이 방식은 [platform-specific file extensions](/router/advanced/platform-specific-modules)를 통해 구현됩니다. tab component는 두 파일에 정의됩니다: Android와 iOS용 **src/components/app-tabs.native.tsx**, web용 **src/components/app-tabs.tsx**입니다. Expo의 module resolution은 플랫폼에 따라 자동으로 올바른 파일을 선택합니다. 이 패턴을 사용하는 이유는 네이티브 플랫폼에는 탭을 눌렀을 때 scroll-to-top이나 네이티브 animation 같은 기대되는 동작을 제공하는 시스템 tab bar가 있는 반면, web에서는 일반적인 웹사이트 navigation 패턴에 맞는 custom-styled tab bar가 필요하기 때문입니다.

### 6\. Non-navigation components live outside the src/app directory

Expo Router에서 **src/app** 디렉터리는 오직 앱의 route를 정의하는 용도로만 사용됩니다. component, hook, utility 등 앱의 다른 부분은 **src/components**, **src/hooks**, **src/constants** 같은 다른 디렉터리에 배치해야 합니다. **src/app** 디렉터리 안에 route가 아닌 파일을 넣으면 Expo Router는 그것을 route처럼 취급하려고 시도합니다.

### 7\. It's still React Navigation under the hood

이 설명이 React Navigation과 꽤 다르게 들릴 수 있지만, Expo Router는 실제로 React Navigation 위에 만들어져 있습니다. Expo Router는 여러분이 직접 코드로 정의하던 React Navigation component로 파일 구조를 변환해주는 Expo CLI 최적화라고 생각할 수 있습니다.

이 말은 기본 stack과 tab navigator가 정확히 같은 option을 사용하므로, navigation 스타일링이나 configuration 방법을 위해 React Navigation 문서를 참고해도 되는 경우가 많다는 뜻이기도 합니다.

## The rules of Expo Router applied

다음 프로젝트 파일 구조에서 핵심 요소를 빠르게 식별해보기 위해 Expo Router의 이 기본 규칙들을 적용해봅시다:

`src`

 `app`

  `index.tsx`

  `home.tsx`

  `_layout.tsx`

  `profile`

   `friends.tsx`

 `components`

  `app-tabs.native.tsx`

  `app-tabs.tsx`

  `text-field.tsx`

  `toolbar.tsx`

-   **src/app/index.tsx**는 initial route이며, 앱을 열거나 웹 앱의 루트 URL로 이동했을 때 가장 먼저 나타납니다.
-   **src/app/home.tsx**는 `/home` route를 가진 page이므로, 브라우저에서는 `yourapp.com/home` 같은 URL로, 네이티브 앱에서는 `yourapp://home` 같은 URL로 이동할 수 있습니다.
-   **src/app/_layout.tsx**는 root layout입니다. 예전에 **App.jsx**에 두었을 초기화 코드는 여기로 와야 합니다.
-   **src/app/profile/friends.tsx**는 `/profile/friends` route를 가진 page입니다.
-   **src/components/app-tabs.native.tsx**와 **src/components/app-tabs.tsx**는 [platform-specific](/router/advanced/platform-specific-modules) tab component입니다. **.native.tsx** 파일은 Android와 iOS에서 사용되고, **.tsx** 파일은 web에서 사용됩니다. root layout은 이들을 import해 tab navigator를 렌더링합니다.
-   **src/components/text-field.tsx**와 **src/components/toolbar.tsx**는 **src/app** 디렉터리 안에 있지 않으므로 page로 간주되지 않습니다. 이들은 URL을 가지지 않고 navigation action의 대상이 될 수도 없습니다. 하지만 **src/app** 디렉터리 안의 page에서 component로 사용할 수는 있습니다.
