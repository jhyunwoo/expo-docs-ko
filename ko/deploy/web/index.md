---
modificationDate: March 02, 2026
title: 웹 앱 게시하기
description: EAS Hosting을 사용해 웹 앱을 배포하는 방법을 알아보세요.
---

# 웹 앱 게시하기

EAS Hosting을 사용해 웹 앱을 배포하는 방법을 알아보세요.

universal app을 만들고 있다면 [EAS Hosting](/eas/hosting/introduction)을 사용해 웹 앱을 빠르게 배포할 수 있습니다. 이것은 Expo Router와 React로 빌드된 웹 앱을 배포하기 위한 서비스입니다.

## Prerequisites

시작하기 전에 프로젝트의 **app.json** 파일에서 [`expo.web.output`](/versions/latest/config/app#output) 속성이 `static` 또는 `server`인지 확인하세요.

## 웹 프로젝트 export하기

웹 앱을 배포하려면 웹 프로젝트의 static build를 만들어야 합니다. 다음 명령을 실행해 웹 프로젝트를 **dist** 디렉터리로 export하세요:

```sh
npx expo export --platform web
```

> 웹 앱을 수정한 뒤 배포할 때마다 이 명령을 다시 실행해야 한다는 점을 기억하세요.

## 초기 배포

웹 앱을 게시하려면 다음 [EAS CLI](/develop/tools#eas-cli) 명령을 실행하세요:

```sh
eas deploy
```

이 명령을 처음 실행하면 프로젝트용 preview subdomain을 선택하라는 prompt가 표시됩니다. 이 subdomain은 preview URL을 만들 때 사용하는 prefix이며 production deployment에도 사용됩니다. 예를 들어 `https://test-app--1234.expo.app`에서 `test-app`이 preview subdomain입니다.

배포가 완료되면 EAS CLI가 배포된 앱에 접근할 수 있는 preview URL을 출력합니다.

## Production deployment

production deployment를 만들려면 다음 [EAS CLI](/develop/tools#eas-cli) 명령을 실행하세요:

```sh
eas deploy --prod
```

배포가 완료되면 EAS CLI가 배포된 앱에 접근할 수 있는 production URL을 출력합니다.

## 자동 배포

[EAS Workflows](/eas/workflows/introduction)를 사용하면 웹에 앱을 자동 배포할 수 있습니다. 먼저 [configure your project](/eas/workflows/get-started)를 진행하고, 프로젝트 루트에 **.eas/workflows/deploy-web.yml**이라는 파일을 추가한 다음, 아래 workflow 구성을 넣으세요:

```yaml
name: Deploy web

on:
  push:
    branches: ['main']

jobs:
  deploy_web:
    name: Deploy web
    type: deploy
    params:
      prod: true
```

위 workflow는 프로젝트의 `main` branch에 commit이 있을 때마다 웹 deployment를 생성합니다. 다음 EAS CLI 명령으로 이 workflow를 수동 실행할 수도 있습니다:

```sh
eas workflow:run deploy-web.yml
```

[workflows examples guide](/eas/workflows/examples/introduction)에서 일반적인 패턴에 대해 더 알아보세요.

## Learn more

[deployment aliases](/eas/hosting/deployments-and-aliases) 설정, [custom domain](/eas/hosting/custom-domain) 사용, 또는 [deploying an API Route](/router/web/api-routes#deployment)에 대해 더 배울 수 있습니다.
