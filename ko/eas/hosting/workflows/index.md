---
modificationDate: February 11, 2026
title: EAS Workflows를 사용한 웹 배포
description: EAS Hosting과 Workflows로 웹사이트와 서버 deployment를 자동화하는 방법을 알아보세요.
---

# EAS Workflows를 사용한 웹 배포

EAS Hosting과 Workflows로 웹사이트와 서버 deployment를 자동화하는 방법을 알아보세요.

EAS Workflows는 pull request(PR) preview와 production deployment를 포함해, 프로젝트의 웹사이트와 API routes를 EAS Hosting에 배포하는 React Native CI/CD 파이프라인을 자동화하는 훌륭한 방법입니다.

## Workflows 설정하기

프로젝트를 자동으로 배포하기 위해 [EAS Workflows](/eas/workflows/get-started)를 사용하려면 [Get started with EAS Workflows](/eas/workflows/get-started)의 안내를 따르세요. 워크플로에 GitHub 저장소를 연결하려면 [GitHub integration](/eas/workflows/get-started)도 추가할 수 있습니다.

## Deployment workflow 만들기

다음 파일을 **.eas/workflows/deploy.yml**에 추가하세요. 이 설정은 production environment variables를 사용하고, web bundle을 export한 뒤, `main` branch에 push할 때마다 프로젝트를 배포하고 production으로 승격합니다.

```yaml
name: Deploy

on:
  push:
    branches: ['main']

jobs:
  deploy:
    type: deploy
    name: Deploy
    environment: production
    params:
      prod: true
```

이제 `main`에 commit이 push되거나 PR이 merge될 때마다 workflow가 실행되어 웹사이트를 배포합니다.

이 workflow는 다음 명령으로 수동 실행해 테스트할 수도 있습니다.

```sh
eas workflow:run .eas/workflows/deploy.yml
```

## PR preview workflow 만들기

다음 파일을 **.eas/workflows/pr-preview.yml**에 추가하세요. 이 설정은 pull request가 생성되거나 업데이트될 때마다 웹사이트의 preview를 자동 배포하고, deployment 세부 정보를 포함한 댓글을 PR에 남깁니다.

```yaml
name: PR Preview

on:
  pull_request: {}

jobs:
  deploy:
    type: deploy
    name: Deploy PR Preview

  comment:
    needs: [deploy]
    type: github-comment
```

이 workflow는 pull request가 열리거나, 다시 열리거나, synchronized될 때마다 실행됩니다. `comment` job은 deployment를 자동으로 찾아서 해당 세부 정보를 pull request에 게시하므로, 리뷰어가 변경 사항을 쉽게 테스트할 수 있습니다.
