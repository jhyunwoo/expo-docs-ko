---
modificationDate: February 26, 2026
title: EAS에서 Environment variables 사용하기
description: EAS build, update, hosting, workflow job에서 environment variables를 사용하는 방법을 알아보세요.
---

# EAS에서 Environment variables 사용하기

EAS build, update, hosting, workflow job에서 environment variables를 사용하는 방법을 알아보세요.

아래 섹션에서는 EAS build, update, workflow job에서 environment variables를 사용하는 방법을 다룹니다.

## EAS Build와 함께 environment variables 사용하기

build에 사용되는 environment를 완전히 제어하려면 **eas.json** 파일의 build profile 설정에 [`environment`](/eas/json#environment) 필드를 지정할 수 있습니다.

```json
{
  "build": {
    "development": {
      "environment": "development"
      ... 
    },
    "preview": {
      "environment": "preview"
      ... 
    },
    "production": {
      "environment": "production"
      ... 
    },
    "my-profile": {
      "environment": "production"
      ... 
    }
  }
}
```

선택한 environment의 모든 environment variables가 build 과정에서 사용됩니다. plain text와 sensitive 변수는 EAS CLI에서 dynamic app config를 기반으로 build 구성을 해석할 때도 사용할 수 있습니다.

`environment` 옵션을 설정하지 않으면 build 구성에 따라 environment를 자동으로 설정합니다:

-   `distribution`이 `store`로 설정된 경우 `production`
-   `developmentClient`가 `true`인 경우 `development`
-   그 외 모든 경우 `preview`

built-in environment variables

다음 environment variables는 각 job에 노출되는 추가 system environment variables이며 어떤 build step에서도 사용할 수 있습니다. 이 변수들은 어떤 프로젝트 environment의 일부도 아니며 **app.config.js**를 로컬에서 평가할 때는 사용할 수 없습니다:

-   `CI=1`: CI 환경임을 나타냅니다
-   `EAS_BUILD=true`: EAS Build 환경임을 나타냅니다
-   `EAS_BUILD_PLATFORM`: `android` 또는 `ios`
-   `EAS_BUILD_RUNNER`: EAS Build cloud build에서는 `eas-build`, [local build](/build-reference/local-builds)에서는 `local-build-plugin`
-   `EAS_BUILD_ID`: build ID. 예: `f51831f0-ea30-406a-8c5f-f8e1cc57d39c`
-   `EAS_BUILD_PROFILE`: **eas.json**의 build profile 이름. 예: `production`
-   `EAS_BUILD_PROJECT_ID`: EAS 프로젝트 ID. 예: `bd2f7e21-1ee7-47f2-8357-d7c4b50622fb`
-   `EAS_BUILD_GIT_COMMIT_HASH`: Git commit의 hash. 예: `88f28ab5ea39108ade978de2d0d1adeedf0ece76`
-   `EAS_BUILD_NPM_CACHE_URL`: npm cache의 URL([자세히 알아보기](/build-reference/private-npm-packages))
-   `EAS_BUILD_MAVEN_CACHE_URL`: Maven cache의 URL([자세히 알아보기](/build-reference/caching#android-dependencies))
-   `EAS_BUILD_COCOAPODS_CACHE_URL`: CocoaPods cache의 URL([자세히 알아보기](/build-reference/caching#ios-dependencies))
-   `EAS_BUILD_USERNAME`: build를 시작한 사용자의 사용자 이름(bot 사용자의 경우 undefined)
-   `EAS_BUILD_WORKINGDIR`: 프로젝트가 있는 원격 디렉터리 경로

> secret 타입의 environment variables는 EAS 서버 밖에서는 읽을 수 없으므로, EAS CLI에서 build 구성 해석 단계에서는 사용할 수 없습니다.

## EAS Update와 함께 environment variables 사용하기

**SDK 55 이상**에서는 `eas update`를 실행할 때 `--environment` 플래그가 필수입니다. 지정한 EAS environment의 environment variables가 update 과정에서 사용됩니다. SDK 54 이하 프로젝트에서는 `--environment` 플래그를 생략하면 `eas update`가 로컬 **.env** 파일로 fallback합니다.

EAS Update와 함께 EAS environment variables를 사용하려면 `--environment` 플래그를 붙여 `eas update` 명령을 실행하세요:

```sh
eas update --environment production
```

`--environment` 플래그를 사용하면 **지정한 EAS environment의 environment variables만 update 과정에서 사용되며** 프로젝트 안의 **.env** 파일은 사용하지 않습니다. 이렇게 하면 update와 build 모두에서 같은 environment variables를 사용하게 됩니다.

Expo CLI는 `--environment` 플래그로 지정한 environment에 대해 EAS 서버에 설정된 해당 plain text 및 sensitive environment variable 값으로, 코드 안의 prefixed 변수(예: `process.env.EXPO_PUBLIC_VARNAME`)를 대체합니다. 애플리케이션 코드의 모든 `EXPO_PUBLIC_` 변수는 로컬 머신이든 CI/CD 서버든 관계없이 해당 EAS environment의 값으로 인라인 치환됩니다.

`--environment` 플래그는 update job과 build job 모두에서 같은 environment variables를 사용하게 해 줍니다.

> secret 변수는 EAS 서버 밖에서는 읽을 수 없으므로 update 과정에서는 사용할 수 없습니다.

## EAS Hosting과 함께 environment variables 사용하기

Expo Router web 프로젝트에는 client와 server 모두에서 사용하는 environment variables가 포함될 수 있습니다. client-side 값은 `npx expo export`를 실행할 때 JavaScript bundle에 인라인되고, server-side 값은 서버에 저장된 뒤 `eas deploy`를 실행할 때 API route와 함께 배포됩니다.

> EAS Hosting에서는 **plain text** 및 **sensitive** [environment variables](/eas/environment-variables#visibility-settings-for-environment-variables)만 사용할 수 있습니다. secret은 EAS Hosting과 함께 배포할 수 없습니다.

Client-side environment variables

브라우저에서 실행되는 모든 코드는 client-side입니다. Expo Router 프로젝트에서는 API Route나 server function이 아닌 모든 코드가 여기에 해당합니다. client-side 코드의 environment variables는 build 시점에 인라인됩니다. client-side 코드에는 민감한 정보를 절대 넣어서는 안 되므로, 모든 client-side environment variables는 [`EXPO_PUBLIC_`](/guides/environment-variables) 접두사를 가져야 합니다.

`npx expo export`를 실행하면 `process.env.EXPO_PUBLIC_*` environment variable의 모든 인스턴스가 environment의 값으로 대체됩니다.

Server-side environment variables

[API routes](/router/web/api-routes)(**+api.ts**로 끝나는 파일)의 코드는 모두 서버에서 실행됩니다. 서버에서 실행되는 코드는 앱 사용자에게 보이지 않으므로 API key나 token 같은 sensitive environment variables를 안전하게 사용할 수 있습니다.

server-side environment variables는 코드 안에 인라인되지 않고, `eas deploy` 명령을 실행할 때 deployment와 함께 업로드됩니다.

### environment variables 저장하기

EAS environment variables로 프로젝트를 배포할 때는 client-side와 server-side 코드의 environment variables가 서로 다른 단계에서 포함된다는 점에 유의하세요:

-   `npx expo export --platform web`를 실행하면 frontend 코드에 `EXPO_PUBLIC_` 변수가 인라인됩니다. 따라서 `npx expo export` 명령을 실행하기 전에 **.env.local** 파일에 올바른 environment variables가 들어 있는지 확인하세요.
-   `eas deploy --environment production`은 지정한 environment(이 경우 `production`)의 모든 변수를 API route에 포함합니다. `--environment` 플래그로 로드한 EAS Environment variables는 **.env** 및 **.env.local** 파일에 정의된 값보다 우선합니다.

> **environment variables는 deployment마다 다르며, deployment는 immutable입니다**. 즉 environment variable을 바꾼 뒤에는 반영을 위해 프로젝트를 다시 export하고 다시 deploy해야 합니다.

### 로컬 개발용

로컬 개발에서는 client와 server 양쪽 environment variables가 모두 [로컬 **.env** 파일](/guides/environment-variables)에서 로드되며, 이런 파일은 gitignore에 넣어야 합니다. EAS environment variables를 사용 중이라면 [`eas env:pull`](/eas/environment-variables/manage#pull-variables-for-local-development)을 사용해 `development`, `preview`, `production`용 environment variables를 가져오세요.

## 다른 명령에서 environment variables 사용하기

secret이 아닌 EAS environment variables를 다른 EAS 명령에 전달하는 한 가지 방법은 `eas env:exec` 명령을 사용하는 것입니다.

```sh
eas env:exec --environment production 'echo $APP_VARIANT'
```

예를 들어 update bundle이 생성된 뒤 [`SENTRY_AUTH_TOKEN`](/guides/using-sentry) 변수를 사용해 Sentry에 source map을 업로드할 때 유용할 수 있습니다.

```sh
eas env:exec --environment production 'npx sentry-expo-upload-sourcemaps dist'
```

## EAS Workflows에서 environment variables 사용하기

### workflow job에 EAS environment 설정하기

-   **Build jobs**: environment는 **eas.json**의 build profile(`build.<profile>.environment`)에서 가져옵니다. 해당 필드가 없으면 위에서 설명한 자동 기본값이 적용됩니다. [EAS Build와 함께 environment variables 사용하기](/eas/environment-variables/usage#using-environment-variables-with-eas-build).
-   **Other jobs**(예: update, submit, fingerprint, Maestro, custom job): [`jobs.<job_id>.environment`](/eas/workflows/syntax#jobsjob_idenvironment)를 설정하세요. 생략하면 `production`이 사용됩니다. 이를 명시적으로 설정하면 workflow 앞부분에서 사용한 build profile과 job이 일치하도록 유지하기 쉽습니다.

다음 예시에서는 build job이 `preview` profile을 사용하도록 구성되어 있고, 이어서 update job도 같은 EAS environment를 사용하도록 구성되어 있습니다.

```yaml
name: Publish preview build and update

jobs:
  build_preview:
    type: build
    params:
      platform: ios
      profile: preview # uses environment from eas.json's build.preview.environment

  publish_preview_update:
    needs: [build_preview]
    type: update
    environment: preview # pulls variables from the preview environment
    params:
      branch: preview
```

다음 예시에서는 fingerprint job이 `production` environment를 사용하도록 구성되어 있고, 이어서 build job도 같은 EAS environment를 사용하도록 구성되어 있습니다.

```yaml
name: Fingerprint and build

jobs:
  fingerprint:
    type: fingerprint
    environment: production # defaults to production, but set explicitly to match the build
  build_ios:
    needs: [fingerprint]
    type: build
    params:
      platform: ios
      profile: production # uses environment from eas.json's build.production.environment
```

job environment 값은 build profile과 동기화된 상태로 유지해 secret 불일치를 피하세요. 예를 들어 fingerprint/update job은 보통 build profile의 environment와 맞춰야 합니다.

### job 실행 중 environment variables를 동적으로 설정하기

`set-env` 명령을 사용하면 job 실행 중 environment variables를 동적으로 설정할 수도 있습니다. `set-env` 실행 파일은 EAS Build worker의 `PATH`에 들어 있으며, 다음 build phase에서 볼 수 있는 environment variables를 설정하는 데 사용할 수 있습니다.

예를 들어 아래 내용을 [EAS Build hooks](/build-reference/npm-hooks) 중 하나에 추가하면 environment variable `EXAMPLE_ENV`를 build job이 끝날 때까지 사용할 수 있습니다.

```sh
set-env EXAMPLE_ENV "example value"
```

### environment variables 접근하기

environment variable을 생성한 뒤에는 이후 EAS Build job에서 Node.js의 `process.env.VARIABLE_NAME` 또는 shell script의 `$VARIABLE_NAME`으로 읽을 수 있습니다.
