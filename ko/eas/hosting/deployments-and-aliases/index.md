---
modificationDate: May 06, 2025
title: Alias 할당 및 production으로 승격하기
description: deployment URL과 alias를 설정하는 방법을 알아보세요.
---

# Alias 할당 및 production으로 승격하기

deployment URL과 alias를 설정하는 방법을 알아보세요.

## Deployments

EAS Hosting에 배포된 deployment는 immutable입니다. 각 deployment는 preview 서브도메인 이름과 deployment ID로 구성된 고유 deployment URL을 통해 접근할 수 있습니다.

### Preview 서브도메인 이름

프로젝트에서 EAS Hosting을 활성화하려면 **preview 서브도메인 이름**을 선택해야 합니다. 이 작업은 [expo.dev](http://expo.dev) 웹사이트에서 프로젝트의 **Hosting** 섹션을 통해 할 수 있습니다. 또는 EAS CLI로 첫 deployment를 만들 때 preview 서브도메인을 선택하라는 안내가 표시됩니다.

### Preview 및 production URL

**preview 서브도메인 이름**은 앱의 preview URL에 사용하는 접두사입니다. 예를 들어 preview 서브도메인 이름으로 `my-app`을 선택하면 preview URL은 `https://my-app--or1170q9ix.expo.app/`가 되고, production URL은 `https://my-app.expo.app/`가 됩니다.

### Deployment ID

각 deployment는 고유 deployment ID로 식별됩니다. 이 ID는 사용자 지정할 수 있지만, 기본값은 영문자와 숫자로 이루어진 임의 문자열입니다.

deployment는 immutable입니다. 한 번 배포되면 변경할 수 없으며, deployment ID를 통해 항상 접근하고 식별할 수 있습니다.

## Aliases

Alias는 deployment용 커스텀 URL을 만들기 위해 사용하는 사용자 정의 값입니다.

deployment를 만들고 alias를 할당하려면 `--alias` 옵션을 사용하세요.

```sh
eas deploy --alias hello
```

위 명령은 `https://my-app--or1170q9ix.expo.app/`의 표준 URL과 `https://my-app--hello.expo.app/`의 alias URL을 모두 가진 deployment를 만듭니다.

> Alias는 프로젝트마다 고유합니다. 이미 사용 중인 alias를 선택하면 새 deployment에 다시 할당됩니다.

하나의 deployment에는 여러 alias를 연결할 수 있습니다. `--id` 옵션을 사용하면 기존 deployment에도 alias를 할당할 수 있습니다.

```sh
eas deploy:alias --id=my-id
```

위 명령에서 `my-id`는 preview URL에 있는 ID입니다.

Alias 이름은 자유롭게 정할 수 있습니다. 예를 들어 staging 환경을 만들고 싶다면 `staging`이라는 alias를 만든 뒤 deployment에 할당할 수 있습니다.

### Production alias

preview 서브도메인 이름이 `my-app`이라면 production URL은 `https://my-app.expo.app/`가 됩니다.

다른 alias와 마찬가지로 `--prod` 옵션을 사용해 deployment를 production으로 승격할 수 있습니다.

```sh
eas deploy --prod
```

기존 deployment도 `--id` 옵션과 deployment ID를 사용해 production으로 승격할 수 있습니다.

```sh
eas deploy:alias --prod --id=deploymentId
```

## 용어

다음 예시에서는 preview 서브도메인 이름으로 `my-app`을 선택했다고 가정합니다.

-   `https://my-app--or1170q9ix.expo.app/`: Preview URL이며, 고유하고 deployment에 접근할 수 있는 주소입니다.
    -   `my-app`: Preview 서브도메인 이름. 프로젝트에 연결된 전역 고유 prefix입니다.
    -   `or1170q9ix`: Deployment ID이며, 이 deployment에 고유한 값입니다.
-   `https://my-app--hello.expo.app/`: Alias가 붙은 deployment URL입니다.
    -   `hello`: 사용자 정의 alias입니다.
-   `https://my-app.expo.app/`: Production deployment URL입니다.

## 자주 묻는 질문

### EAS Hosting은 전용 IP 주소를 제공하나요?

아니요. EAS Hosting은 **SNI(Server Name Indication)**를 사용하므로 IP 주소는 여러 프로젝트가 공유하며, 단일 프로젝트 전용으로 제공되지 않습니다.
