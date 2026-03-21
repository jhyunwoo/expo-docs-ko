---
modificationDate: March 01, 2026
title: Introduction to Expo Router
description: Expo Router는 Expo로 만든 Universal React Native 애플리케이션을 위한 오픈소스 routing 라이브러리입니다.
---

# Introduction to Expo Router

Expo Router는 Expo로 만든 Universal React Native 애플리케이션을 위한 오픈소스 routing 라이브러리입니다.

Expo Router는 React Native와 웹 애플리케이션을 위한 file-based router입니다. 앱 안의 screen 사이 navigation을 관리할 수 있게 해주며, 동일한 component를 여러 플랫폼(Android, iOS, web)에서 사용하면서 사용자가 앱 UI의 서로 다른 부분 사이를 자연스럽게 이동할 수 있게 해줍니다.

Expo Router는 웹의 가장 좋은 file-system routing 개념을 universal 애플리케이션에 가져와 routing이 모든 플랫폼에서 동작하도록 해줍니다. **app** 디렉터리에 파일을 추가하면 그 파일은 자동으로 navigation 안의 route가 됩니다.

## Quick start

Expo Router 라이브러리가 이미 설치되고 구성된 프로젝트를 만들기 위해 `create-expo-app`으로 새 Expo 앱을 만드는 것을 권장합니다:

```sh
# npm
npx create-expo-app@latest --template default@sdk-55

# yarn
yarn create expo-app --template default@sdk-55

# pnpm
pnpm create expo-app --template default@sdk-55

# bun
bun create expo --template default@sdk-55
```

> **Note:** SDK 55 전환 기간 동안 `--template` 플래그 없이 `create-expo-app@latest`를 실행하면 SDK 54 프로젝트가 생성됩니다. 실제 기기에서 Expo Go를 사용할 계획이라면 SDK 54 프로젝트를 사용하세요. 그렇지 않다면 `--template default@sdk-55`를 사용해 SDK 55 프로젝트를 만드세요.

이제 다음 명령을 실행해 프로젝트를 시작할 수 있습니다:

```sh
npx expo start
```

-   모바일 기기에서 앱을 보려면 [Expo Go](/get-started/set-up-your-environment#how-would-you-like-to-develop)로 시작하는 것을 권장합니다. 애플리케이션이 더 복잡해지고 더 많은 제어가 필요해지면 [development build](/develop/development-builds/introduction)를 만들 수 있습니다.
-   Terminal UI에서 `w`를 눌러 웹 브라우저로 프로젝트를 여세요. Android는 `a`(Android Studio 필요), iOS는 `i`(macOS와 Xcode 필요)를 누르세요.

## Resources

[Expo Tutorial](/tutorial/introduction) — Android, iOS, web에서 실행되는 Expo 앱을 만드는 단계별 가이드입니다.

[Expo Router API reference](/versions/latest/sdk/router) — API component, hook, method, configuration option을 제공합니다.

[Expo Router video playlist](https://www.youtube.com/playlist?list=PLsXDmrmFV_AT17JDf-otXSNE_eH7s0uDD) — 핵심 개념부터 더 복잡한 navigation 흐름까지 다루는 튜토리얼 시리즈입니다.

## Key features

-   **Native**: 강력한 [React Navigation suite](https://reactnavigation.org/) 위에 구축되어, Expo Router navigation은 기본적으로 진짜 네이티브이며 플랫폼 최적화되어 있습니다.
-   **Shareable**: 앱의 모든 screen은 자동으로 [deep linkable](/linking/overview)하므로, 앱 안의 어떤 route도 링크로 공유할 수 있습니다.
-   **Offline-first**: 앱은 캐시되어 offline-first로 실행되며, 새 버전을 publish하면 자동으로 업데이트됩니다. 네트워크 연결이나 서버 없이도 들어오는 모든 네이티브 URL을 처리합니다.
-   **Optimized**: route는 production에서 [lazy-evaluation](/router/web/async-routes)으로, development에서는 deferred bundling으로 자동 최적화됩니다.
-   **Iteration**: bundler의 artifact memoization과 함께 Android, iOS, web 전반에서 Universal Fast Refresh를 제공해 규모가 커져도 빠르게 작업할 수 있습니다.
-   **Universal**: Android, iOS, web은 통합된 navigation 구조를 공유하며, route 수준에서 플랫폼 전용 API로 내려갈 수 있습니다.
-   **Discoverable**: Expo Router는 web에서 build-time [static rendering](/router/web/static-rendering)과 native에서 [universal linking](/linking/overview)을 지원합니다. 즉, 앱 콘텐츠를 search engine이 색인할 수 있습니다.

## Using a different navigation library

[React Navigation](https://reactnavigation.org/docs/getting-started#installation) 같은 다른 navigation 라이브러리를 Expo 프로젝트에서 사용할 수도 있습니다. 하지만 새 앱을 만들고 있다면 **위에서 설명한 모든 기능 때문에 Expo Router를 사용하는 것을 권장합니다**. 다른 navigation 라이브러리를 쓰면 공유 가능한 링크나 같은 프로젝트 안에서 web/native navigation을 처리하는 것 같은 기능은 직접 전략을 구현해야 할 수 있습니다.

[React Native Navigation by Wix](https://github.com/wix/react-native-navigation)를 사용하려 한다면, 이것은 Expo Go에서 사용할 수 없고 아직 `expo-dev-client`와도 호환되지 않습니다. Android와 iOS 네이티브 navigation API를 사용하려면 React Navigation의 [`createNativeStackNavigator`](https://reactnavigation.org/docs/native-stack-navigator)를 사용하는 것을 권장합니다.

## Common questions

Expo Router versus Expo versus React Native CLI

역사적으로 React Native는 앱을 어떻게 만들어야 하는지에 대해 강한 규범을 두지 않았고, 이것은 현대적인 웹 프레임워크 없이 React를 사용하는 것과 비슷합니다. Expo Router는 React Native를 위한 opinionated framework이며, Remix와 Next.js가 웹 전용 React를 위한 opinionated framework인 것과 비슷합니다.

Expo Router는 최고의 아키텍처 패턴을 모두에게 제공해 React Native를 최대한 활용할 수 있도록 설계되었습니다. 예를 들어 Expo Router의 [Async Routes](/router/web/async-routes) 기능은 모두가 lazy bundling을 사용할 수 있게 해줍니다. 이전에는 lazy bundling이 Meta 내부에서 Facebook 앱을 만들 때만 사용되었습니다.

Can I use Expo Router in my existing React Native app?

네, Expo Router는 universal React Native 앱을 위한 framework입니다. router와 bundler가 깊게 연결되어 있기 때문에 Expo Router는 Metro를 사용하는 Expo CLI 프로젝트에서만 사용할 수 있습니다. 다행히도 [어떤 React Native 프로젝트에서도 Expo CLI를 사용할 수 있습니다](/bare/using-expo-cli)!

What are the benefits of file-based routing?

-   파일 시스템은 잘 알려져 있고 널리 이해되는 개념입니다. 더 단순한 mental model은 새 팀원을 교육하고 애플리케이션을 확장하기 쉽게 만듭니다.
-   새 사용자를 온보딩하는 가장 빠른 방법은 universal link를 열게 해서, 앱이 설치되어 있는지 여부에 따라 앱 또는 웹사이트가 올바른 screen을 열게 하는 것입니다. 이 기법은 너무 고급이라 보통 플랫폼 간 동등성을 만들고 유지할 수 있는 대기업에서만 사용할 수 있었습니다. 하지만 Expo의 file-based routing을 사용하면 이 기능을 바로 사용할 수 있습니다.
-   파일을 이동해도 import나 routing component를 업데이트할 필요가 없기 때문에 refactoring이 더 쉽습니다.
-   Expo Router는 route를 자동으로 정적으로 타입 지정할 수 있습니다. 따라서 유효한 route로만 link할 수 있고 존재하지 않는 route로 link할 수 없습니다. Typed Routes는 link가 깨지면 type error를 보여주기 때문에 refactoring도 더 쉬워집니다.
-   Async Routes(bundle splitting)는 특히 큰 프로젝트에서 development 속도를 높여줍니다. 또한 error가 하나의 route에만 격리되므로 앱 전체를 한 번에(traditional React Native 방식으로) 업데이트하거나 리팩터링하는 대신 page-by-page로 점진적으로 업데이트하거나 리팩터링할 수 있게 해주어 업그레이드도 더 쉬워집니다.
-   모든 page에서 deep link가 항상 동작합니다. 따라서 앱 안의 어떤 콘텐츠든 link로 공유할 수 있고, 이는 앱 홍보, bug report 수집, E2E testing, screenshot 자동화 등에 매우 유용합니다.
-   Expo Head는 자동 link를 사용해 deep-native integration을 가능하게 합니다. Quick Notes, Handoff, Siri context, universal links 같은 기능은 코드 변경 없이 configuration만으로 동작합니다. 이를 통해 사용자가 가진 스마트 기기 전체 생태계와 완벽한 수직 통합이 가능해지고, universal 앱(web ⇄ native)에서만 가능한 사용자 경험을 만들 수 있습니다.
-   Expo Router는 web에서 각 page를 자동으로 정적 렌더링할 수 있어 실제 SEO와 앱 콘텐츠의 완전한 discoverability를 제공합니다. 이는 file-based convention 덕분에 가능한 일입니다.
-   **Expo CLI**는 앱이 알려진 convention을 따를 때 많은 정보를 추론할 수 있습니다. 예를 들어 route별 자동 bundle splitting을 구현하거나 웹사이트용 sitemap을 자동 생성할 수 있습니다. 앱에 단일 entry point만 있을 때는 이런 일이 불가능합니다.
-   notification과 홈 화면 widget 같은 재참여 기능은 query parameter를 포함한 launch와 deep link를 앱 안 어디서든 가로채기만 하면 되므로 통합이 더 쉽습니다.
-   웹처럼 analytics와 error reporting도 route 이름을 자동으로 포함하도록 쉽게 설정할 수 있어, 디버깅과 사용자 행동 이해에 유용합니다.

Why should I use Expo Router over React Navigation?

Expo Router와 React Navigation은 둘 다 Expo 팀이 만든 라이브러리입니다. 우리는 file-based routing의 이점을 가능하게 하기 위해 React Navigation 위에 Expo Router를 만들었습니다. Expo Router는 React Navigation의 상위 집합(superset)이므로, Expo Router와 함께 어떤 React Navigation component와 API든 사용할 수 있습니다.

file-based routing이 프로젝트에 맞지 않는다면 React Navigation으로 내려가 route, type, link를 수동으로 설정할 수 있습니다.

How do I server-render my Expo Router website?

기본적인 static rendering(SSG)은 Expo Router에서 지원됩니다. 현재 server-side rendering은 직접 인프라를 구성해야 합니다.

## Next steps

[Manual installation](/router/installation) — Expo Router를 시작하고 기존 앱에 추가하는 자세한 안내입니다.

[Router 101](/router/basics/core-concepts) — 핵심 개념, 표기 패턴, navigation layout, 일반적인 navigation 패턴 정보를 보려면 Router 101 섹션부터 시작하세요.

[Example app](https://github.com/expo/expo/tree/main/templates/expo-template-tabs) — GitHub에서 example app의 소스 코드를 확인하세요.
