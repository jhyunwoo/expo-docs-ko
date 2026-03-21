---
modificationDate: February 28, 2026
title: 비공개 npm 패키지 사용하기
sidebar_label: 비공개 npm 패키지
description: EAS Build가 비공개 npm 패키지를 사용하도록 구성하는 방법을 알아보세요.
---

# 비공개 npm 패키지 사용하기

EAS Build가 비공개 npm 패키지를 사용하도록 구성하는 방법을 알아보세요.

EAS Build는 프로젝트에서 비공개 npm 패키지를 사용하는 것을 완전히 지원합니다. 이러한 패키지는 npm에 게시할 수도 있고([Pro/Teams 플랜](https://www.npmjs.com/products)이 있다면), 비공개 registry에 게시할 수도 있습니다(예: 자체 호스팅 [Verdaccio](https://verdaccio.org/) 사용).

빌드를 시작하기 전에 프로젝트를 구성해 npm token을 EAS Build에 제공해야 합니다.

## 기본 npm 구성

기본적으로 EAS Build는 모든 빌드의 의존성 설치를 빠르게 해 주는 자체 호스팅 npm cache를 사용합니다. 각 EAS Build builder는 플랫폼별로 다음과 같은 **.npmrc** 파일로 구성되어 있습니다:

### Android

```ini
registry=http://npm-cache-service.worker-infra-production.svc.cluster.local:4873
```

### iOS

```ini
registry=http://10.254.24.8:4873
```

## npm에 게시된 비공개 패키지

프로젝트에서 npm에 게시된 비공개 패키지를 사용한다면, 의존성을 성공적으로 설치할 수 있도록 EAS Build에 [읽기 전용 npm token](https://docs.npmjs.com/about-access-tokens)을 제공해야 합니다.

권장되는 방법은 계정 또는 프로젝트의 secret에 `NPM_TOKEN` secret을 추가하는 것입니다:

방법에 대한 자세한 내용은 [secret environment variables](/eas/environment-variables/manage#create-variables-in-the-dashboard)를 참고하세요.

EAS는 빌드 중 `NPM_TOKEN` 환경 변수를 사용할 수 있다고 감지하면 자동으로 다음 **.npmrc**를 생성합니다:

```ini
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
registry=https://registry.npmjs.org/
```

하지만 이는 프로젝트 루트 디렉터리에 **.npmrc**가 없을 때만 적용됩니다. 이미 이 파일이 있다면 수동으로 업데이트해야 합니다.

빌드 로그에서 **Prepare project** 빌드 단계를 찾아보면 제대로 동작했는지 확인할 수 있습니다:

## 비공개 registry에 게시된 패키지

자체 호스팅 [Verdaccio](https://verdaccio.org/) 같은 비공개 npm registry를 사용한다면 **.npmrc**를 수동으로 구성해야 합니다.

프로젝트 루트 디렉터리에 다음 내용을 가진 **.npmrc** 파일을 만드세요:

```ini
registry=__REPLACE_WITH_REGISTRY_URL__
```

registry에 인증이 필요하다면 token도 제공해야 합니다. 예를 들어 registry URL이 `https://registry.johndoe.com/`라면 파일을 다음과 같이 업데이트합니다:

```ini
//registry.johndoe.com/:_authToken=${NPM_TOKEN}
registry=https://registry.johndoe.com/
```

## 비공개 npm 패키지와 비공개 registry를 함께 사용하는 경우

> 고급 예시입니다.

비공개 npm 패키지는 항상 [scoped](https://docs.npmjs.com/about-scopes#scopes-and-package-visibility) 패키지입니다. 예를 들어 npm 사용자 이름이 `johndoe`이고, 비공개 자체 호스팅 registry URL이 `https://registry.johndoe.com/`이라면, 두 소스에서 모두 의존성을 설치하려면 프로젝트 루트에 다음과 같은 **.npmrc**를 만드세요:

```ini
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
@johndoe:registry=https://registry.npmjs.org/
registry=https://registry.johndoe.com/
```

## 비공개 저장소의 서브모듈

비공개 저장소에 서브모듈이 있다면 SSH key를 설정해 초기화해야 합니다. 자세한 내용은 [submodules initialization](/build-reference/git-submodules#submodules-initialization)을 참고하세요.
