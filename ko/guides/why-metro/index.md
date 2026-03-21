---
modificationDate: March 05, 2026
title: 왜 Metro인가요?
description: Metro가 React Native에서 범용 번들링의 미래인 이유와 개발자에게 어떤 이점을 주는지 알아보세요.
---

# 왜 Metro인가요?

Metro가 React Native에서 범용 번들링의 미래인 이유와 개발자에게 어떤 이점을 주는지 알아보세요.

[Metro](https://metrobundler.dev/)는 Expo와 React Native의 공식 bundler입니다. Expo 프레임워크의 핵심 빌드 도구이기도 합니다. Bundler에는 수천 가지의 판단과 trade-off가 담겨 있습니다. 이 문서는 Expo가 왜 Metro를 중심으로 개발되는지, 그리고 그것이 개발자에게 어떤 이점을 주는지 핵심 이유를 설명합니다.

## Meta의 공식 bundler

Metro는 React, React Native, Yoga, Hermes의 유지보수 주체인 Meta가 관리합니다. 앱 스토어의 모든 카테고리에 걸쳐, 세계에서 가장 큰 규모의 일부 앱을 개발하는 데 사용됩니다.

Meta 엔지니어들은 40만 개가 넘는 source files 전체를 번들링하면서도 빠르고 안정적으로 유지해야 한다는 명확한 요구 사항 아래 Metro를 적극적으로 개발하고 있습니다.

최상급 Metro 지원을 통해 Expo 개발자는 Meta의 도구 전반에서 연속성을 확보하고, 새롭게 등장하는 기능에 즉시 접근할 수 있습니다. 여기에는 다음이 포함됩니다:

-   React Fast Refresh는 2019년에 Metro 기능으로 [처음 도입](https://reactnative.dev/blog/2019/09/18/version-0.61)되었습니다. React 웹 커뮤니티는 이듬해 Webpack을 통해 이를 채택했습니다.
-   즉시 네이티브 시작을 위해 JavaScript를 Hermes bytecode로 변환합니다.
-   [network and JS debugging](/debugging/tools#debugging-with-react-native-devtools)에 대한 최상급 지원을 포함한 React Native DevTools는 Metro와 Hermes에서만 독점적으로 사용할 수 있습니다.
-   React Compiler는 처음에 Metro와 호환되는 Babel plugin으로 배포되었습니다.

Metro에 도입될 예정인 새로운 기능과 앞으로의 기능에는 다음이 포함됩니다:

-   Static Hermes를 사용해 Flow 코드를 네이티브 machine code로 컴파일합니다. 자세한 내용은 Tzvetan Mikov의 [Static Hermes](https://www.youtube.com/watch?v=GUM64b-gAGg) 발표를 참고하세요.
-   모든 플랫폼을 위한 범용 React Server Components와 함께 data fetching, streaming, React Suspense, server rendering, 빌드 시점 static rendering을 지원합니다. 자세한 내용은 React Conf 2024의 [Universal React Server Components](https://www.youtube.com/watch?v=djhEgxQf3Kw) 발표를 참고하세요.

Expo 팀은 Meta와 협력하여 Expo Router를 위한 Metro를 개발하고 있으며, [file-based routing](/develop/app-navigation), [web support](/guides/customizing-metro#web-support), [bundle splitting](/guides/customizing-metro#bundle-splitting), [tree shaking](/guides/tree-shaking), [CSS](/versions/latest/config/metro#css), [DOM components](/guides/dom-components), server components, [API routes](/router/web/api-routes) 같은 기능을 추가하고 있습니다.

## 대규모에서 검증된 안정성

거의 모든 React Native 앱이 Metro를 사용하므로, Metro는 대규모 프로젝트에 최적화된 검증된 솔루션입니다. 덕분에 취미 개발자부터 대기업까지 모든 규모의 개발자에게 적합합니다. Metro는 Meta의 대규모 앱을 처리하도록 특별히 설계되었기 때문에, Watchman을 통한 네이티브 파일 감시와 [shared remote caches](https://metrobundler.dev/docs/caching) 같은 기능을 갖추고 있습니다.

## 요청 시 처리

개발 환경에서 Metro는 요청되기 전까지 플랫폼별 작업을 수행하지 않습니다. 이를 통해 개발자는 지원하는 플랫폼 수 때문에 성능 비용을 지불하지 않고도 대규모 프로젝트에서 작업할 수 있습니다. 공격적인 캐싱과 [async routes](/router/web/async-routes)를 함께 사용하면, 개발자는 현재 작업 중인 앱의 부분만 점진적으로 번들링할 수 있습니다.

## 다차원 구조

전통적인 bundler가 server 코드와 client 코드를 번들링하기 위해 여러 인스턴스를 생성하는 것과 달리, Metro는 플랫폼과 환경(server, client, DOM components) 전반에서 리소스 재사용을 극대화합니다. 이 아키텍처는 멀티플랫폼 및 서버 개발에 이상적입니다.

## 재사용 가능한 transform memoization

Metro는 점진적으로 동작하며, 여러 머신에서 사용할 수 있는 캐시된 transform artifact를 생성할 수 있습니다. 덕분에 대규모 팀은 원격 빌더의 작업 결과를 재사용할 수 있는데, 이는 Meta가 모든 대형 프로젝트에서 사용하는 기법입니다.

## 커스텀 런타임에 최적화됨

다른 bundler가 웹 브라우저의 정적 명세를 중심으로 설계된 반면, Metro는 React Native의 유연성에 최적화되어 있습니다. 덕분에 Hermes bytecode 컴파일에 필요한 지원 언어 기능 집합만 생성하는 기능을 제공하며, 이는 프로덕션에서 더 빠른 앱 시작으로 이어집니다. 이 기능은 Static Hermes에도 확장되어, 정적 타입 정보를 네이티브 앱용 machine code로 컴파일하게 될 것입니다.

## 크로스 기술 지원

Expo는 Metro의 기술을 활용해 [DOM components](/guides/dom-components) 같은 새로운 기능을 만듭니다. 이를 통해 네이티브 앱의 React component를, 부모 앱과 동일한 기본값을 유지한 전체 웹사이트로 요청 시 동적으로 번들링할 수 있습니다.

## 네이티브 asset export

최종 결과가 완전히 호스팅되는 앱인 전통적인 bundler와 달리, Metro의 구성 옵션은 번들을 독립 실행형 앱 바이너리에 삽입할 네이티브 artifact로 내보내는 것을 지원합니다. 이는 Apple 플랫폼의 `xcassets` 같은 OS별 최적화를 활용합니다.

## 동시 처리

Metro의 모든 AST transformation은 사용 가능한 모든 스레드에서 동시에 수행되어 하드웨어 활용을 극대화합니다.

## 다른 접근 방식과의 비교

Metro는 범용 앱 개발을 위해 설계되었지만, 웹 전용 bundler와 자주 비교됩니다. 다음은 몇 가지 핵심 차이점입니다:

### Browser ESM과 번들링

Vite 같은 bundler는 브라우저의 내장 ESM 지원을 활용하지만, 이 접근 방식은 수천 개의 연쇄적인 network request 때문에 중간 규모 이상에서 실제 개발 시간을 느리게 만들 수 있습니다. Metro는 로컬 개발에서 번들링을 수행하므로 개발 결과가 프로덕션 결과와 훨씬 더 가깝게 일치하고, 더 많은 모듈 수를 가진 React Native에 더 적합합니다.

### JavaScript와 네이티브 언어

여러 bundler가 성능상의 이유로 core를 Rust로 작성하고 있지만, 이는 기여, patch, 개발을 더 어렵게 만드는 trade-off를 동반합니다. Metro는 작업에 따라 여러 기술을 조합해 사용합니다:

-   core bundler와 utilities는 JS/Flow로 작성됩니다.
-   파일 감시는 C++로 작성된 Watchman을 사용하며, JS fallback도 제공합니다. 그리고 Watchman은 컴퓨터의 여러 프로젝트 전반에서 활용됩니다.
-   AST는 Hermes parser(WebAssembly)로 Babel 호환 형식으로 파싱됩니다.
-   AST transformation은 Babel로 수행됩니다. 이를 통해 개발자 customization을 극대화합니다.
-   Minification은 네이티브 플랫폼에서 Hermes를 사용하고, 웹에서는 Terser(선택적으로 ESBuild 지원 포함)를 사용합니다.
-   CSS 파싱과 minification은 [LightningCSS](https://lightningcss.dev/) (Rust)로 수행됩니다.

이 접근 방식은 Meta와 커뮤니티 도구에 맞추면서도, 개발자가 더 쉽게 디버깅하고, 프로파일링하고, patch할 수 있게 해줍니다.
