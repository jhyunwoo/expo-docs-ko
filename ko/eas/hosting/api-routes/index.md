---
modificationDate: November 11, 2025
title: API Routes
description: EAS Hosting 대시보드에서 API Routes의 요청을 검사하는 방법을 알아보세요.
---

# API Routes

EAS Hosting 대시보드에서 API Routes의 요청을 검사하는 방법을 알아보세요.

> 이 페이지는 API Routes에 대한 EAS Hosting 고유 내용을 다룹니다. 일반적인 주제 문서는 Expo Router 아래의 [API routes](/router/web/api-routes) 문서를 참고하세요.

API Routes에서 발생하는 크래시, 로그, 요청은 EAS Hosting 대시보드에서 확인할 수 있습니다.

### 크래시

크래시는 요청을 처리하는 동안 응답이 반환되지 못하게 만든 모든 미처리 오류를 뜻합니다. 예를 들어 `throw new Error("An error!")`가 여기에 해당합니다. 크래시는 [Hosting crashes](https://expo.dev/accounts/%5BaccountName%5D/projects/%5BprojectName%5D/hosting/crashes) 페이지에서 볼 수 있습니다.

크래시는 그룹으로 묶입니다. 유사한 크래시가 감지되면 한 줄 항목으로만 표시됩니다. 크래시 세부 정보에는 해당 크래시가 처음 발생한 시점과 마지막으로 확인된 시점의 stack trace와 metadata가 표시됩니다.

### 로그

API Routes와 server function의 모든 로그(`console.log`, `console.info`, `console.error` 등)는 deployment 단위 로그 페이지에 기록됩니다. [Hosting deployments](https://expo.dev/accounts/%5BaccountName%5D/projects/%5BprojectName%5D/hosting/deployments)로 이동한 다음, _deployment 하나를 선택_하고 **Logs**를 열어 보세요.

### 요청

요청은 프로젝트 단위 [Hosting requests](https://expo.dev/accounts/%5BaccountName%5D/projects/%5BprojectName%5D/hosting/requests)와 deployment 단위 [Hosting Deployments](https://expo.dev/accounts/%5BaccountName%5D/projects/%5BprojectName%5D/hosting/deployments) > _deployment 하나를 선택_ > **Requests**에서 볼 수 있습니다.

여기에는 서비스로 들어온 요청 목록과 함께 요청별 metadata(status, browser, region, duration 등)가 표시됩니다. 여기에는 API Routes에 대한 요청을 포함해 서비스로 향한 모든 요청이 포함됩니다.

### ID로 요청 조회하기

모든 응답 헤더에는 `8ffb63895cf6779b-LHR`처럼 보이는 `Cf-Ray` 헤더가 포함됩니다. 이 값의 첫 번째 부분이 request ID이며, [**Hosting** > **Requests**](https://expo.dev/accounts/%5BaccountName%5D/projects/%5BprojectName%5D/hosting/requests)의 필터에서 이 ID를 사용해 EAS 대시보드에서 해당 요청을 조회할 수 있습니다.

이 request ID는 서비스 수준 오류 페이지에도 표시됩니다.

### 샘플링

deployment가 많은 트래픽을 받는 경우 EAS Hosting이 기록하는 데이터는 [downsampled](https://developers.cloudflare.com/analytics/graphql-api/sampling/)될 수 있습니다. 즉 deployment로 더 많은 요청이 들어올수록 기록되는 데이터 포인트 수는 줄어들며, 개별 요청, 로그, 크래시가 하나씩 모두 표시되지 않을 수 있습니다. 다만 요청 수나 크래시 수 같은 통계 수치는 모든 요청을 비례적으로 반영하도록 추정됩니다.
