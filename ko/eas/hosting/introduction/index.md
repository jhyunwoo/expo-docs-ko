---
modificationDate: March 05, 2026
title: EAS Hosting 소개
description: EAS Hosting은 Expo Router 라이브러리와 React Native web으로 빌드한 웹 프로젝트를 빠르게 배포하기 위한 서비스입니다.
---

# EAS Hosting 소개

EAS Hosting은 Expo Router 라이브러리와 React Native web으로 빌드한 웹 프로젝트를 빠르게 배포하기 위한 서비스입니다.

**EAS Hosting**은 [Expo Router](/router/introduction)와 React Native web으로 빌드한 웹 프로젝트를 빠르게 배포하기 위한 EAS(Expo Application Services) 서비스입니다. Expo CLI와 매끄럽게 통합되어 API routes, server functions, server-side assets의 배포를 자동화할 수 있습니다.

EAS Hosting은 `npx create-expo-app`에서 API routes와 server functions를 갖춘 완전 배포형 웹 앱까지 가는 가장 빠른 경로를 제공합니다.

## 빠른 시작

> 아래의 `eas` 명령은 EAS CLI가 필요합니다. 자세한 내용은 [EAS CLI 설치 방법](/eas/cli#installation)을 참고하세요.

웹 앱을 배포하려면 웹 프로젝트의 정적 build를 만들어야 합니다. 다음 명령을 실행해 웹 프로젝트를 **dist** 디렉터리로 export하세요.

```sh
npx expo export --platform web
```

웹 앱을 게시하려면 다음 명령을 실행하세요.

```sh
eas deploy
```

deployment가 완료되면 EAS CLI가 배포된 웹 앱에 접근할 수 있는 preview URL을 출력합니다.

## 왜 EAS Hosting을 사용하나요

과거에는 Expo Router 및 React 앱을 배포할 때 전통적인 웹사이트 호스팅 서비스를 권장했습니다. 하지만 이 접근 방식은 네이티브 앱을 다룰 때 생기는 고유한 문제를 해결하지 못합니다. 대표적인 제한 사항은 다음과 같습니다.

-   **버전 동기화**: 앱 스토어 퍼블리싱 과정에서 서버의 새 버전을 함께 배포해야 할 수 있습니다.
-   **요청 라우팅 복잡성**: 네이티브 앱의 서로 다른 버전은 특정 서버 버전으로 라우팅되어야 할 수 있습니다. 이로 인해 요청 처리 로직이 복잡해질 수 있습니다.
-   **플랫폼별 분석**: 네이티브 앱을 실행할 때는 플랫폼별 지표를 위한 향상된 observability가 필요합니다.

EAS Hosting은 모든 플랫폼에서 통합된 배포 경험을 제공해 이러한 제한을 해결합니다.

## EAS Hosting을 사용해야 하는 경우

| 시나리오 | 권장 여부 |
| --- | --- |
| 별도 hosting provider를 설정하지 않고 web build를 배포하고 싶다 | ✓ |
| Expo Router 앱에서 API routes나 server functions를 사용한다 | ✓ |
| Android, iOS, web 전반에서 일관된 deployment workflow를 유지하고 싶다 | ✓ |
| [EAS Workflows](/eas/hosting/workflows)로 deployment를 자동화하고 싶다 | ✓ |
| server-side 코드의 크래시, 로그, 요청을 위한 built-in monitoring이 필요하다 | ✓ |
| web 요소가 없는 모바일 전용 프로젝트다 | ✗ |
| 전체 Node.js runtime 호환성이 필요하다(EAS Hosting은 일부 Node.js만 지원하는 [Cloudflare Workers runtime](/eas/hosting/reference/worker-runtime)을 사용함) | ✗ |
| 이미 요구 사항을 충족하는 기존 웹 인프라가 있다 | ✗ |

## 자주 묻는 질문(FAQ)

EAS Hosting에서 어떤 웹 output 모드를 사용할 수 있나요?

EAS Hosting은 app config의 `expo.web.output`에 설정하는 세 가지 output 모드를 모두 지원합니다.

-   `single`: Expo 앱을 **index.html** 출력 하나만 가지는 single-page app으로 export합니다.
-   `static`: Expo 앱을 [정적 생성 웹 앱](/router/web/static-rendering)으로 export합니다.
-   `server`: 정적 페이지와 함께 [server functions](/guides/server-components#react-server-functions) 및 [API routes](/router/web/api-routes)를 지원합니다.

EAS Hosting에서 API routes를 사용할 수 있나요?

EAS Hosting은 `server` output 모드를 사용할 때 [API routes](/router/web/api-routes)(**+api.ts**로 끝나는 파일)를 완전히 지원합니다. API routes에서 발생한 크래시, 로그, 요청은 [EAS dashboard](/eas/hosting/api-routes)에서 모니터링할 수 있습니다.

EAS Hosting은 어떤 runtime을 사용하나요?

EAS Hosting은 [Cloudflare Workers](https://developers.cloudflare.com/workers/) 위에 구축되어 있으며, V8 JavaScript 엔진에서 실행됩니다. 전체 Node.js process 대신 V8 isolate를 사용합니다. Node.js 호환 모듈도 제공되지만 일부 제한이 있습니다. 지원 모듈 전체 목록은 [worker runtime reference](/eas/hosting/reference/worker-runtime)를 참고하세요.

production deployment에 커스텀 도메인을 설정할 수 있나요?

[커스텀 도메인](/eas/hosting/custom-domain)은 유료 플랜에서 사용할 수 있습니다. 각 프로젝트는 production deployment에 하나의 커스텀 도메인을 할당할 수 있습니다. apex 도메인과 서브도메인 모두 지원합니다.

deployment alias는 어떻게 만들 수 있나요?

EAS Hosting deployment는 immutable입니다. 각 deployment에는 고유 preview URL이 부여됩니다. [alias](/eas/hosting/deployments-and-aliases)를 만들어 deployment에 `staging`이나 `production` 같은 커스텀 이름을 할당할 수 있습니다. deployment는 immutable이므로 `eas deploy:alias --prod --id=<deploymentId>`로 이전 deployment ID에 alias를 다시 연결해 즉시 rollback할 수 있습니다.

EAS Hosting에서는 어떤 monitoring 기능을 제공하나요?

EAS Hosting은 [EAS dashboard](/eas/hosting/api-routes)에 built-in monitoring을 제공합니다.

-   **Crashes**: API routes에서 발생한 미처리 오류를 유사도 기준으로 묶어 볼 수 있습니다.
-   **Logs**: API routes의 모든 `console.log`, `console.info`, `console.error` 출력
-   **Requests**: status, browser, region, duration을 포함한 요청 metadata

EAS Hosting에서 caching은 어떻게 설정하나요?

API routes는 EAS Hosting이 전역 CDN(Content Delivery Network)에서 응답을 캐시할 때 사용할 `Cache-Control` 지시어를 반환할 수 있습니다. 정적 asset은 기본적으로 브라우저 캐시 시간이 3600초로 설정됩니다. 자세한 내용은 [Caching](/eas/hosting/reference/caching) 문서를 참고하세요.

EAS Hosting을 EAS Workflows와 함께 사용할 수 있나요?

EAS Hosting은 `deploy` job type을 사용해 [EAS Workflows](/eas/workflows/get-started)와 통합됩니다. workflow 설정에 deploy job을 추가할 수 있습니다. 예를 들면 다음과 같습니다.

```yaml
jobs:
  deploy_web:
    type: deploy
    environment: production
    params:
      prod: true
```

특정 alias로 배포하거나 branch에 따라 production 여부를 조건부로 지정할 수도 있습니다.

```yaml
jobs:
  deploy:
    type: deploy
    params:
      prod: ${{ github.ref_name == 'main' }}
```

자세한 내용은 [EAS Workflows로 웹 배포하기](/eas/hosting/workflows)를 참고하세요.

## 시작하기

[첫 번째 deployment 만들기](/eas/hosting/get-started) — 새 앱에서 배포된 웹사이트까지 1분 안에 도달해 보세요.

[deployment alias 할당하기](/eas/hosting/deployments-and-aliases) — Alias를 만들고 deployment를 production으로 승격하세요.

[environment variables 설정하기](/eas/environment-variables/usage#using-environment-variables-with-eas-hosting) — 웹 코드와 서버 코드에서 environment variables를 사용하세요.

[커스텀 도메인](/eas/hosting/custom-domain) — production deployment에 커스텀 도메인을 설정하세요.

[API Routes](/eas/hosting/api-routes) — EAS Hosting 대시보드에서 API Routes의 요청을 확인하세요.

[EAS Workflows로 배포하기](/eas/hosting/workflows) — EAS Workflows로 deployment를 자동화하세요.
