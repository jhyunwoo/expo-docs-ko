---
modificationDate: February 26, 2026
title: EAS의 Environment variables
description: build, update, workflow 전반에서 Expo Application Services(EAS) environment variables를 사용하는 방법에 대한 개요입니다.
---

# EAS의 Environment variables

build, update, workflow 전반에서 Expo Application Services(EAS) environment variables를 사용하는 방법에 대한 개요입니다.

이 가이드는 Expo Application Services(EAS)의 Environment Variables를 사용하는 방법을 설명합니다: Build, Updates, Workflows, Hosting. environment variables가 Expo framework와 함께 어떻게 동작하는지에 대한 일반적인 정보는 [Expo의 Environment variables](/guides/environment-variables)를 참고하세요.

로컬 개발 중에는 environment variables가 로컬 **.env** 또는 **.env.local** 파일에서 로드됩니다. 이런 파일은 일반적으로 프로젝트의 버전 관리에서 제외되므로(즉, **.gitignore** 파일에 나열되어 있거나 커밋되지 않았기 때문에) EAS Build나 EAS Workflows처럼 원격 서버에서 실행되는 job에서는 사용할 수 없습니다. 또한 대부분의 프로젝트는 여러 앱 variant를 가지고 있으며 여러 세트의 environment variables가 필요합니다(예: Development와 Production).

## EAS environment variables를 사용하는 이유

다음과 같은 필요가 있다면 EAS Environment variables를 사용하고 싶을 수 있습니다:

-   **.env** 파일을 커밋하지 않고도 cloud build, update, workflow용 구성을 한 곳에서 관리하기
-   이름은 재사용하면서 environment별(`development`, `preview`, `production`)로 값을 분리하기
-   올바른 surface만 각 값을 읽을 수 있도록 visibility(plain text, sensitive, secret)를 제어하기
-   [`eas env:pull`](/eas/environment-variables/manage#pull-variables-for-local-development) 또는 CI/CD 내부에서 동일한 세트를 로컬에 적용하기

이것이 바로 EAS Environment variables가 해결하도록 설계된 문제들입니다. EAS Environment variables를 사용하면 변수를 EAS CLI 또는 [expo.dev](https://expo.dev) dashboard에서 직접 EAS에 구성할 수 있고, EAS Build와 EAS Workflows는 물론 EAS CLI를 통해 로컬 머신에서도 접근할 수 있습니다.

## 빠른 시작

새 environment variable을 만들려면 EAS CLI를 사용해 프로젝트 디렉터리 안에서 다음 명령을 실행하세요. 아래 명령은 `production` environment용으로 이름이 `EXPO_PUBLIC_API_URL`, 값이 `https://api.example.com`인 새 environment variable을 생성합니다.

```sh
eas env:create --name EXPO_PUBLIC_API_URL --value https://api.example.com --environment production --visibility plaintext
```

environment variable이 성공적으로 생성되었는지 확인하려면 프로젝트 설정의 [Environment variables](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/environment-variables)에 **production** 배지와 함께 표시되는지 확인하세요. environment variables는 [expo.dev](https://expo.dev)에서 직접 관리할 수도 있습니다.

EAS Build에서 environment variable을 사용하려면 `production` build profile에 `environment` 필드를 추가하세요:

```json
{
  "build": {
    "production": {
      "environment": "production"
    }
  }
}
```

이제 `production` build profile용으로 생성한 environment variables는 build 과정에서 사용할 수 있습니다.

EAS Update에서 environment variable을 사용하려면 `--environment` 플래그를 지정해 `eas update` 명령을 실행하세요:

```sh
eas update --environment production
```

`--environment` 플래그는 update job에 사용할 environment를 지정하는 데 사용됩니다. 지정한 environment의 environment variables만 update 과정에서 사용됩니다.

EAS Hosting에서 environment variable을 사용하려면 `--environment` 플래그를 지정해 `eas deploy` 명령을 실행하세요. client와 server 측 environment variables가 모두 필요하다면 아래 명령을 나열된 순서대로 실행하고(클라이언트 측 변수는 secret이 아닌 plain text 또는 sensitive여야 함), 자세한 내용은 [client-side environment variables](/eas/environment-variables/usage#client-side-environment-variables)를 참고하세요.

```sh
eas env:pull --environment production
npx expo export --platform web
eas deploy --environment production
```

`--environment` 플래그는 deploy job에 사용할 environment를 지정하는 데 사용됩니다. 지정한 environment의 environment variables만 deploy 과정에서 사용됩니다.

## 핵심 개념

### 사용 가능한 environments

기본적으로 EAS는 environment variables용으로 `development`, `preview`, `production` 세 가지 environment를 지원합니다. custom environment 이름은 Enterprise 및 Production 플랜에서 사용할 수 있습니다.

각 environment는 서로 독립적인 변수 집합이며, 서로 다른 맥락에서 앱을 맞춤 구성하는 데 사용할 수 있습니다. 예를 들어 development와 production에 서로 다른 API key를 사용하거나, app store release에 서로 다른 bundle identifier를 사용할 수 있습니다.

모든 EAS Build 및 Workflows job은 사용 가능한 environment 중 하나의 environment variables를 사용해 실행됩니다. update에도 environment를 사용할 수 있으므로, build job에서 사용하는 것과 동일한 environment variable 세트를 사용할 수 있습니다. update를 게시할 때는 필수 `--environment` 플래그로 environment를 지정하세요.

environment variables는 여러 environment에 동시에 할당해 동일한 값을 공유할 수도 있고, 단일 environment용으로만 생성할 수도 있습니다.

### 범위

-   **Project-wide**: 하나의 EAS 프로젝트에만 적용됩니다. 프로젝트 dashboard의 [Environment variables](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/environment-variables) 페이지로 이동해 생성, 조회, 관리할 수 있습니다. 이런 environment variables는 이 프로젝트에 대해 EAS 서버에서 실행되는 모든 job과 update에서 사용할 수 있습니다. visibility 설정이 허용한다면 로컬 개발용으로 pull할 수도 있습니다.
-   **Account-wide**: EAS account의 모든 프로젝트에서 사용할 수 있습니다. account dashboard의 [Environment variables](https://expo.dev/accounts/%5Baccount%5D/settings/environment-variables) 페이지로 이동해 생성, 조회, 관리할 수 있습니다. 이런 environment variables는 프로젝트의 project-wide variables와 함께 EAS 서버에서 실행되는 job과 update에서 사용할 수 있습니다. [visibility setting](/eas/environment-variables#visibility-settings-for-environment-variables)이 허용한다면 로컬로 pull하거나 EAS 서버 밖에서 읽을 수도 있습니다.

### 변수 유형

-   **Strings**: build, update, workflow, hosting 전반에서 사용할 수 있는 표준 key/value 쌍입니다.
-   **Files**: 파일로 업로드되는 값입니다(예: `google-services.json` 또는 certificate). build runner에서는 파일 경로 형태로 job에 제공됩니다.

## environment variables의 visibility 설정

각 environment variable에는 세 가지 visibility 설정 중 하나를 선택할 수 있습니다:

| Visibility | Description |
| --- | --- |
| Plain text | 웹사이트, EAS CLI, 로그에서 볼 수 있습니다. |
| Sensitive | EAS Build 및 Workflows job 로그에서는 가려집니다. 웹사이트에서는 토글로 보이게 할 수 있습니다. EAS CLI에서도 읽을 수 있습니다. |
| Secret | 웹사이트와 EAS CLI를 포함해 EAS 서버 밖에서는 읽을 수 없습니다. EAS Build 및 Workflows job 로그에서는 가려집니다. |

> **클라이언트 측 코드에 포함되는 모든 것은 앱을 실행할 수 있는 누구에게나 공개되고 읽힐 수 있다고 간주해야 합니다**.

> **Secret type environment variables**는 EAS Build나 Workflows job이 job 실행 방식을 바꾸는 데 사용할 값을 제공하기 위한 용도입니다. 예를 들어 npm에서 private package를 설치하기 위한 `NPM_TOKEN`을 설정하거나, Sentry API key를 설정해 release를 만들고 source map을 업로드하는 경우가 있습니다. secret은 결국 애플리케이션 자체에 임베드하게 되는 값에 추가적인 보안을 제공하지 않습니다.

## 다음에 볼 내용

[EAS에서 environment variables 생성 및 관리하기](/eas/environment-variables/manage) — EAS dashboard와 EAS CLI로 environment variables를 생성하고, 범위를 정하고, 사용하는 방법을 알아보세요.

[EAS에서 environment variables 사용하기](/eas/environment-variables/usage) — EAS build, update, hosting, workflow job에서 environment variables를 사용하는 방법을 알아보세요.

[EAS 없이 environment variables 사용하기](/eas/environment-variables/without-eas) — Expo 및 React Native 프로젝트에서 environment variables를 관리하는 EAS 외의 방법을 알아보세요.

[FAQ](/eas/environment-variables/faq) — EAS의 environment variables에 대한 자주 묻는 질문입니다.
