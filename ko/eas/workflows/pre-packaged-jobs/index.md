---
modificationDate: March 01, 2026
title: EAS Workflows의 사전 패키징 job
description: EAS Workflows에서 사전 패키징 job을 설정하고 사용하는 방법을 알아보세요.
---

# EAS Workflows의 사전 패키징 job

EAS Workflows에서 사전 패키징 job을 설정하고 사용하는 방법을 알아보세요.

사전 패키징 job은 앱을 build, submit, test하는 일반적인 작업을 자동화하는 데 도움을 주는 즉시 사용 가능한 workflow job입니다. 이 job들은 custom job 구성을 처음부터 직접 작성하지 않고도 이러한 작업을 처리할 수 있는 표준화된 방법을 제공합니다. 이 가이드는 사용 가능한 사전 패키징 job과 workflow에서 이를 사용하는 방법을 다룹니다.

## Build

프로젝트를 Android 또는 iOS 앱으로 build합니다.

Build job은 build 과정에서 custom command를 실행할 수 있도록 사용자 지정할 수 있습니다. 자세한 내용은 [Custom builds](/custom-builds/get-started)를 참고하세요.

### Prerequisites

build job을 성공적으로 사용하려면 사전 패키징 job과 동일한 platform과 profile을 사용해 EAS CLI로 build를 완료해야 합니다. 시작하려면 [첫 build 만들기](/build/setup)를 참고하세요.

### Syntax

```yaml
jobs:
  build_app:
    type: build
    runs_on: string # optional - see https://docs.expo.dev/build-reference/infrastructure/ for available options
    params:
      platform: android | ios # required
      profile: string # optional - default: production
      message: string # optional
```

#### Parameters

다음 매개변수를 `params` 목록에 전달할 수 있습니다.

| Parameter | Type | Description |
| --- | --- | --- |
| platform | string | **필수.** build할 platform입니다. `android` 또는 `ios` 중 하나일 수 있습니다. |
| profile | string | 선택 사항. 사용할 build profile입니다. 기본값은 `production`입니다. |
| message | string | 선택 사항. build에 첨부할 custom message입니다. `eas build`를 실행할 때의 `--message` 플래그에 대응합니다. |

#### Environment variables

build 과정에서 특정 environment variables가 필요하다면, 지정한 build `profile`에 대해 [eas.json](/eas/json#environment)에 포함할 수 있습니다. 이 값은 [EAS environment variables](/eas/environment-variables)에서 가져옵니다.

#### Outputs

이후 job에서 다음 output을 참조할 수 있습니다.

| Output | Type | Description |
| --- | --- | --- |
| build_id | string | 생성된 build의 ID입니다. |
| app_build_version | string | 앱의 version code/build number입니다. |
| app_identifier | string | 앱의 bundle identifier/package name입니다. |
| app_version | string | 앱 버전입니다. |
| channel | string | build에 사용된 update channel입니다. |
| distribution | string | 사용된 distribution 방식입니다. `internal` 또는 `store`일 수 있습니다. |
| fingerprint_hash | string | build의 fingerprint hash입니다. |
| git_commit_hash | string | build에 사용된 git commit hash입니다. |
| platform | string | build가 생성된 platform입니다. `android` 또는 `ios`입니다. |
| profile | string | 사용된 build profile입니다. |
| runtime_version | string | 사용된 runtime version입니다. |
| sdk_version | string | 사용된 SDK version입니다. |
| simulator | string | simulator용 build인지 여부입니다. |

### Examples

다음은 build job을 사용하는 실용적인 예시입니다.

특정 platform용 기본 build

이 workflow는 `main` branch에 push할 때마다 iOS 앱을 build합니다.

```yaml
name: Build iOS app

on:
  push:
    branches: ['main']

jobs:
  build_ios:
    name: Build iOS
    type: build
    params:
      platform: ios
      profile: production
```

두 platform을 병렬로 build하기

이 workflow는 `main` branch에 push할 때 Android와 iOS 앱을 병렬로 build합니다.

```yaml
name: Build for all platforms

on:
  push:
    branches: ['main']

jobs:
  build_android:
    name: Build Android
    type: build
    params:
      platform: android
      profile: production

  build_ios:
    name: Build iOS
    type: build
    params:
      platform: ios
      profile: production
```

Environment variables와 함께 build하기

이 workflow는 build 과정에서 사용할 수 있는 custom environment variables와 함께 Android 앱을 build합니다.

```yaml
name: Build with environment variables

on:
  push:
    branches: ['main']

jobs:
  build_android:
    name: Build Android
    type: build
    env:
      APP_ENV: production
      API_URL: https://api.example.com
    params:
      platform: android
      profile: production
```

서로 다른 profile로 build하기

이 workflow는 서로 다른 profile을 사용해 두 개의 Android build를 생성합니다. 하나는 internal distribution용이고, 다른 하나는 development 및 production profile을 사용하는 store submission용입니다.

```yaml
name: Build with different profiles

on:
  push:
    branches: ['main']

jobs:
  build_android_development:
    name: Build Android Development
    type: build
    params:
      platform: android
      profile: development

  build_android_production:
    name: Build Android Production
    type: build
    params:
      platform: android
      profile: production
```

## Deploy

[EAS Hosting](/eas/hosting/introduction)을 사용해 애플리케이션을 배포합니다.

### Prerequisites

EAS Hosting을 사용해 애플리케이션을 배포하려면 프로젝트를 설정해야 합니다. 자세한 내용은 [Get Started with EAS Hosting](/eas/hosting/get-started#prerequisites)을 참고하세요.

### Syntax

```yaml
jobs:
  deploy_web:
    type: deploy
    params:
      alias: string # optional
      prod: boolean # optional
```

#### Parameters

다음 매개변수를 `params` 목록에 전달할 수 있습니다.

| Parameter | Type | Description |
| --- | --- | --- |
| alias | string | 선택 사항. 배포할 [alias](/eas/hosting/deployments-and-aliases#aliases)입니다. |
| prod | boolean | 선택 사항. production으로 배포할지 여부입니다. |

#### Outputs

이후 job에서 다음 output을 참조할 수 있습니다.

| Output | Type | Description |
| --- | --- | --- |
| deploy_json | string | deployment 세부 정보를 담은 JSON 객체입니다(`npx eas-cli deploy --json`의 출력). |
| deploy_url | string | deployment URL입니다. production deployment였다면 production URL을 사용합니다. 그렇지 않으면 첫 alias URL 또는 deployment URL을 사용합니다. |
| deploy_alias_url | string | deployment의 alias URL입니다(예: `https://account-project--alias.expo.app`). |
| deploy_deployment_url | string | deployment의 고유 URL입니다(예: `https://account-project--uniqueid.expo.app`). |
| deploy_identifier | string | deployment 식별자입니다. |
| deploy_dashboard_url | string | deployment dashboard URL입니다(예: `https://expo.dev/projects/[project]/hosting/deployments`). |

### Examples

다음은 deploy job을 사용하는 실용적인 예시입니다.

Production에 기본 배포

이 workflow는 EAS Hosting을 사용해 애플리케이션을 production에 배포합니다.

```yaml
name: Basic Deployment

jobs:
  deploy:
    name: Deploy to Production
    type: deploy
    params:
      prod: true
```

`main` branch에 merge될 때만 production에 배포하기

이 workflow는 `main` branch에 merge될 때 애플리케이션을 production에 배포하고, 다른 모든 branch에서는 non-production deployment를 만듭니다.

```yaml
name: Deploy

on:
  push:
    branches: ['*']

jobs:
  deploy:
    name: Deploy
    type: deploy
    params:
      prod: ${{ github.ref_name == 'main' }}
```

Custom alias로 배포하기

이 workflow는 애플리케이션을 production의 custom alias로 배포합니다.

```yaml
name: Deployment with Alias

jobs:
  deploy:
    name: Deploy with Alias
    type: deploy
    params:
      alias: my-custom-alias
      prod: true
```

## Fingerprint

프로젝트의 fingerprint를 계산합니다.

> **참고:** 이 job type은 [CNG (managed)](/workflow/continuous-native-generation) workflow만 지원합니다. **android** 또는 **ios** 디렉터리를 커밋하면 fingerprint job은 동작하지 않습니다.

> **참고:** fingerprint가 build와 일치하도록 하려면 build profile과 같은 `environment` 설정을 사용하세요. environment variable의 경우, 더 일관성 있게 사용하려면 [EAS environment variables](/eas/environment-variables)를 [`env`](/eas/workflows/syntax#jobsjob_idenv) 필드보다 권장합니다.

### Syntax

```yaml
jobs:
  fingerprint:
    type: fingerprint
    environment: production | preview | development # optional, defaults to production
    env: # optional list of environment variables
      ENV_VAR_NAME: value
```

#### Environment variables

`env` 매개변수에 environment variable 목록을 전달할 수 있습니다. 이 environment variable은 [EAS environment variables](/eas/environment-variables)에서 가져옵니다. 전달한 `environment` 매개변수는 environment variable의 environment로 사용되며, 같은 environment variable이 여러 environment에 정의되어 있을 때 유용합니다.

#### Outputs

이후 job에서 다음 output을 참조할 수 있습니다.

| Output | Type | Description |
| --- | --- | --- |
| android_fingerprint_hash | string | Android용 fingerprint hash입니다. |
| ios_fingerprint_hash | string | iOS용 fingerprint hash입니다. |

### Examples

다음은 fingerprint job을 사용하는 실용적인 예시입니다.

기본 fingerprint 계산

이 workflow는 Android와 iOS build 모두에 대한 fingerprint를 계산합니다. fingerprint가 정확히 일치하려면 `environment`는 build profile과 같아야 합니다.

```yaml
name: Basic Fingerprint

jobs:
  fingerprint:
    name: Calculate Fingerprint
    type: fingerprint
    environment: production
```

Inline environment variables를 사용하는 fingerprint

> **참고:** inline environment variable에 의존한다면 fingerprint가 일치하도록 모든 곳(build profile, fingerprint job, update job 등)에서 올바른 environment variable 집합을 올바른 값으로 항상 설정해야 합니다. **대신 [EAS Environment Variables](/eas/environment-variables) 사용을 권장합니다.** 이 방식에서는 변수 집합을 environment로 그룹화하고 build profile과 workflow job에서 참조할 수 있습니다.

```yaml
name: Fingerprint with Environment Variables

jobs:
  fingerprint:
    name: Calculate Fingerprint
    type: fingerprint
    environment: production
    # Resulting environment will be a union of the "production" environment and the inline environment variables.
    # `env` variables override environment variables of the same name from the "production" environment.
    env:
      APP_VARIANT: staging
      API_URL: https://api.staging.example.com
```

## Get Build

제공한 매개변수와 일치하는 기존 build를 EAS에서 가져옵니다.

### Syntax

```yaml
jobs:
  get_build:
    type: get-build
    params:
      platform: ios | android # optional
      profile: string # optional
      distribution: store | internal | simulator # optional
      channel: string # optional
      app_identifier: string # optional
      app_build_version: string # optional
      app_version: string # optional
      git_commit_hash: string # optional
      fingerprint_hash: string # optional
      sdk_version: string # optional
      runtime_version: string # optional
      simulator: boolean # optional
      wait_for_in_progress: boolean # optional
```

#### Parameters

다음 매개변수를 `params` 목록에 전달할 수 있습니다.

| Parameter | Type | Description |
| --- | --- | --- |
| platform | string | 선택 사항. build를 가져올 platform입니다. `ios` 또는 `android`일 수 있습니다. |
| profile | string | 선택 사항. 사용할 build profile입니다. |
| distribution | string | 선택 사항. distribution 방식입니다. `store`, `internal`, `simulator`일 수 있습니다. |
| channel | string | 선택 사항. update channel입니다. |
| app_identifier | string | 선택 사항. bundle identifier/package name입니다. |
| app_build_version | string | 선택 사항. build version입니다. |
| app_version | string | 선택 사항. 앱 버전입니다. |
| git_commit_hash | string | 선택 사항. git commit hash입니다. |
| fingerprint_hash | string | 선택 사항. fingerprint hash입니다. |
| sdk_version | string | 선택 사항. SDK version입니다. |
| runtime_version | string | 선택 사항. runtime version입니다. |
| simulator | boolean | 선택 사항. simulator build를 가져올지 여부입니다. |
| wait_for_in_progress | boolean | 선택 사항. 일치하는 진행 중 build를 기다릴지 여부입니다. 기본값은 `false`입니다. |

`wait_for_in_progress`를 `true`로 설정하면, job은 여전히 성공한 build가 있다면 즉시 그것을 우선 사용하지만, 동시에 진행 중인 build도 찾습니다. 성공한 build를 찾지 못하면 계속 진행하기 전에 진행 중인 build가 완료될 때까지 기다립니다. 일치한 build가 성공하면 job은 성공으로 표시되고 그 성공한 build를 반환합니다. 일치한 build가 실패하면 job은 성공으로 표시되지만 output은 비어 있게 됩니다. 즉, build가 일치하지 않은 것처럼 동작합니다.

#### Outputs

이후 job에서 다음 output을 참조할 수 있습니다.

| Output | Type | Description |
| --- | --- | --- |
| build_id | string | 가져온 build의 ID입니다. |
| app_build_version | string | 앱의 build version입니다. |
| app_identifier | string | 앱의 bundle identifier/package name입니다. |
| app_version | string | 앱 버전입니다. |
| channel | string | build에 사용된 update channel입니다. |
| distribution | string | 사용된 distribution 방식입니다. |
| fingerprint_hash | string | build의 fingerprint hash입니다. |
| git_commit_hash | string | build에 사용된 git commit hash입니다. |
| platform | string | build가 생성된 platform입니다. |
| profile | string | 사용된 build profile입니다. |
| runtime_version | string | 사용된 runtime version입니다. |
| sdk_version | string | 사용된 SDK version입니다. |
| simulator | string | simulator용 build인지 여부입니다. |

### Examples

다음은 get-build job을 사용하는 실용적인 예시입니다.

최신 production build 가져오기

이 workflow는 store distribution channel에서 iOS용 최신 production build를 가져옵니다.

```yaml
name: Get Production Build

jobs:
  get_build:
    name: Get Latest Production Build
    type: get-build
    params:
      platform: ios
      profile: production
      distribution: store
      channel: production
```

버전으로 build 가져오기

이 workflow는 app version과 build version으로 특정 Android build 버전을 가져옵니다.

```yaml
name: Get Build by Version

jobs:
  get_build:
    name: Get Specific Version Build
    type: get-build
    params:
      platform: android
      app_identifier: com.example.app
      app_version: 1.0.0
      app_build_version: 42
```

Simulator build 가져오기

이 workflow는 iOS development용 simulator build를 가져옵니다. `wait_for_in_progress`를 `true`로 설정했기 때문에 필터와 일치하는 build가 이미 존재하면, 계속 진행하기 전에 해당 build가 완료될 때까지 기다립니다.

```yaml
name: Get Simulator Build

jobs:
  get_build:
    name: Get Simulator Build
    type: get-build
    params:
      platform: ios
      simulator: true
      profile: development
      wait_for_in_progress: true
```

## Submit

EAS Submit을 사용해 Android 또는 iOS build를 앱 스토어에 제출합니다.

### Prerequisites

Submission job은 CI/CD 프로세스 안에서 실행하려면 추가 구성이 필요합니다. 자세한 내용은 [Apple App Store CI/CD submission guide](/submit/ios#submitting-your-app-using-cicd-services)와 [Google Play Store CI/CD submission guide](/submit/android#submitting-your-app-using-cicd-services)를 참고하세요.

### Syntax

```yaml
jobs:
  submit_to_store:
    type: submit
    runs_on: string # optional - see https://docs.expo.dev/build-reference/infrastructure/ for available options
    params:
      build_id: string # required
      profile: string # optional - default: production
```

#### Parameters

다음 매개변수를 `params` 목록에 전달할 수 있습니다.

| Parameter | Type | Description |
| --- | --- | --- |
| build_id | string | 필수. 제출할 build의 ID입니다. |
| profile | string | 선택 사항. 사용할 submit profile입니다. 기본값은 `production`입니다. |

#### Outputs

이후 job에서 다음 output을 참조할 수 있습니다.

| Output | Type | Description |
| --- | --- | --- |
| apple_app_id | string | 제출된 build의 Apple App ID입니다. |
| ios_bundle_identifier | string | 제출된 build의 iOS bundle identifier입니다. |
| android_package_id | string | 제출된 build의 Android package ID입니다. |

### Examples

다음은 submit job을 사용하는 실용적인 예시입니다.

Submit iOS build

이 workflow는 production submit profile을 사용해 iOS build를 App Store에 제출합니다.

```yaml
name: Submit iOS Build

jobs:
  build_ios:
    name: Build iOS
    type: build
    params:
      platform: ios
      profile: production

  submit:
    name: Submit to App Store
    type: submit
    needs: [build_ios]
    params:
      build_id: ${{ needs.build_ios.outputs.build_id }}
      profile: production
```

Submit Android build

이 workflow는 production submit profile을 사용해 Android build를 Play Store에 제출합니다.

```yaml
name: Submit Android Build

jobs:
  build_android:
    name: Build Android
    type: build
    params:
      platform: android
      profile: production

  submit:
    name: Submit to Play Store
    type: submit
    needs: [build_android]
    params:
      build_id: ${{ needs.build_android.outputs.build_id }}
      profile: production
```

## TestFlight

iOS build를 TestFlight internal 및 external testing group에 배포합니다. 이 job은 더 고급 TestFlight 기능이 필요할 때 iOS submit job의 대안으로 사용할 수 있습니다. test group, changelog, Beta App Review 제출을 제어해야 한다면 submit 대신 `testflight` job을 사용하세요.

### Prerequisites

TestFlight job은 `distribution: store`로 생성된 iOS build가 필요합니다. Apple Developer 계정도 구성되어 있어야 합니다. 자세한 내용은 [TestFlight submission guide](/submit/ios#submitting-your-app-using-cicd-services)를 참고하세요.

### Syntax

```yaml
jobs:
  testflight_distribution:
    type: testflight
    runs_on: string # optional - see https://docs.expo.dev/build-reference/infrastructure/ for available options
    params:
      build_id: string # required
      profile: string # optional - default: production
      internal_groups: string[] # optional
      external_groups: string[] # optional
      changelog: string # optional
      submit_beta_review: boolean # optional
      wait_processing_timeout_seconds: number # optional - default: 1800 (30 minutes)
```

#### Parameters

다음 매개변수를 `params` 목록에 전달할 수 있습니다.

| Parameter | Type | Description |
| --- | --- | --- |
| build_id | string | 필수. 배포할 iOS build의 ID입니다. |
| profile | string | 선택 사항. 사용할 submit profile입니다. 기본값은 `production`입니다. |
| internal_groups | string[] | 선택 사항. build를 추가할 TestFlight internal group 이름 배열입니다. automatic distribution이 활성화되지 않은 group만 포함하세요. |
| external_groups | string[] | 선택 사항. build를 추가할 TestFlight external group 이름 배열입니다. |
| changelog | string | 선택 사항. TestFlight 테스터를 위한 테스트 노트("What to Test")입니다. |
| submit_beta_review | boolean | 선택 사항. Beta App Review를 제출할지 여부입니다. 지정하지 않으면 external_groups가 제공된 경우 기본값은 `true`, 아니면 `false`입니다. |
| wait_processing_timeout_seconds | number | 선택 사항. App Store Connect의 build processing을 기다릴 timeout(초)입니다. 기본값은 `1800`(30분)입니다. |

#### Outputs

이후 job에서 다음 output을 참조할 수 있습니다.

| Output | Type | Description |
| --- | --- | --- |
| apple_app_id | string | 제출된 build의 Apple App ID입니다. |
| ios_bundle_identifier | string | 제출된 build의 iOS bundle identifier입니다. |

### Examples

다음은 TestFlight job을 사용하는 실용적인 예시입니다.

Internal 및 external group으로 전체 배포

이 workflow는 changelog와 함께 internal 및 external TestFlight group 모두에 배포합니다.

```yaml
name: TestFlight Distribution

jobs:
  build_ios:
    name: Build iOS
    type: build
    params:
      platform: ios
      profile: production

  testflight:
    name: Distribute to TestFlight
    type: testflight
    needs: [build_ios]
    params:
      build_id: ${{ needs.build_ios.outputs.build_id }}
      internal_groups: ['QA Team']
      external_groups: ['Public Beta']
      changelog: |
        What's new in this release:
        - New features
        - Bug fixes
```

Changelog만 포함해 업로드하기

이 workflow는 build를 명시적으로 추가할 group을 지정하지 않고 changelog만 포함해 업로드합니다. 이 경우 build는 "auto-distribute"가 활성화된 internal group에만 추가됩니다.

```yaml
name: TestFlight with Changelog

jobs:
  testflight:
    name: Upload with Changelog
    type: testflight
    params:
      build_id: ${{ needs.build_ios.outputs.build_id }}
      changelog: "${{ github.commit_message || 'Bug fixes' }}"
      # github.commit_message only available in push & schedule events.
```

## Update

[EAS Update](/eas-update/introduction)를 사용해 update를 게시합니다.

### Prerequisites

update preview를 게시하고 over-the-air update를 보내려면 `npx eas-cli@latest update:configure`를 실행한 다음 새 build를 만들어야 합니다. 자세한 내용은 [configuring EAS Update](/eas-update/getting-started#prerequisites)를 참고하세요.

### Syntax

```yaml
jobs:
  publish_update:
    type: update
    environment: production | preview | development # optional, defaults to production
    env: # optional list of environment variables
      ENV_VAR_NAME: value
    runs_on: string # optional - see https://docs.expo.dev/build-reference/infrastructure/ for available options
    params:
      message: string # optional
      platform: string # optional - android | ios | all, defaults to all
      branch: string # optional
      channel: string # optional - cannot be used with branch
      private_key_path: string # optional
      upload_sentry_sourcemaps: boolean # optional - defaults to "try uploading, but don't fail the job if it fails"
```

#### Environment variables

`env` 매개변수에 environment variable 목록을 전달할 수 있습니다. 이 environment variable은 [EAS environment variables](/eas/environment-variables)에서 가져옵니다. 전달한 `environment` 매개변수는 environment variable의 environment로 사용되며, 같은 environment variable이 여러 environment에 정의되어 있을 때 유용합니다.

#### Parameters

다음 매개변수를 `params` 목록에 전달할 수 있습니다.

| Parameter | Type | Description |
| --- | --- | --- |
| message | string | 선택 사항. update에 사용할 message입니다. 제공하지 않으면 commit message가 사용됩니다. |
| platform | string | 선택 사항. update에 사용할 platform입니다. `android`, `ios`, `all` 중 하나일 수 있습니다. 기본값은 `all`입니다. |
| branch | string | 선택 사항. update에 사용할 branch입니다. 제공하지 않으면 workflow 실행의 branch가 사용됩니다. 수동 실행 workflow에서는 값을 반드시 제공해야 합니다. 예: `${{ github.ref_name || 'testing' }}`. branch와 channel 중 _하나만_ 제공하세요. |
| channel | string | 선택 사항. update에 사용할 channel입니다. branch와 channel 중 _하나만_ 제공하세요. |
| private_key_path | string | 선택 사항. [EAS Update configuration](/eas-update/code-signing#publish-a-signed-update-for-your-app)의 인증서에 대응하는 PEM 인코딩 private key가 들어 있는 파일의 경로입니다. `"$VARIABLE_NAME"` 문법으로 파일형 [EAS environment variable](/eas/environment-variables)을 참조할 수 있습니다. 이는 EAS CLI에 `--private-key-path`를 전달하는 것과 같습니다. |
| upload_sentry_sourcemaps | boolean | 선택 사항. Sentry sourcemap을 업로드할지 여부입니다. 값이 `true`이면 job이 Sentry source map을 업로드하고 실패 시 job도 실패합니다. 값이 `false`이면 sourcemap을 Sentry에 업로드하지 않습니다. 값을 제공하지 않으면 job은 `@sentry/react-native`가 설치되어 있는지 확인하고, 설치되어 있으면 sourcemap 업로드를 시도합니다. 이 시도가 실패해도 오류 메시지만 출력하고 job은 성공으로 계속 진행됩니다. |

#### Outputs

이후 job에서 다음 output을 참조할 수 있습니다.

| Output | Type | Description |
| --- | --- | --- |
| first_update_group_id | string | 첫 번째 update group의 ID입니다. |
| updates_json | string | 모든 update group 정보를 담은 JSON 문자열입니다. |

### Examples

다음은 update job을 사용하는 실용적인 예시입니다.

Production channel에 기본 update 게시

이 workflow는 `main` branch에 push할 때마다 commit message를 update message로 사용해 production channel에 update를 게시합니다.

```yaml
name: Update Production

on:
  push:
    branches: ['main']

jobs:
  update_production:
    name: Update Production Channel
    type: update
    params:
      channel: production
```

Platform별 update

이 workflow는 Android와 iOS platform에 대해 각각 별도의 update를 게시하므로, platform별 변경 사항을 나눠서 관리할 수 있습니다.

```yaml
name: Platform-specific Updates

on:
  push:
    branches: ['main']

jobs:
  update_android:
    name: Update Android
    type: update
    params:
      platform: android
      channel: production

  update_ios:
    name: Update iOS
    type: update
    params:
      platform: ios
      channel: production
```

Branch 기반 배포로 update하기

이 workflow는 branch 이름을 기준으로 update를 게시하므로, branch에 따라 다른 환경(staging/production)에 대응할 수 있습니다.

```yaml
name: Branch-based Updates

on:
  push:
    branches: ['main', 'staging']

jobs:
  update_branch:
    name: Update Branch
    type: update
    params:
      branch: ${{ github.ref_name }}
      message: 'Update for branch: ${{ github.ref_name }}'
```

## Maestro

Android emulator 또는 iOS Simulator build에서 Maestro 테스트를 실행합니다.

> Maestro 테스트는 [alpha](/more/release-statuses#alpha) 상태입니다.

### Syntax

```yaml
jobs:
  run_maestro_tests:
    type: maestro
    environment: production | preview | development # optional - defaults to preview
    image: string # optional - see https://docs.expo.dev/build-reference/infrastructure/ for a list of available images.
    params:
      build_id: string # required
      flow_path: string | string[] # required
      shards: number # optional - defaults to 1
      retries: number # optional - defaults to 1
      record_screen: boolean # optional - defaults to false
      include_tags: string | string[] # optional
      exclude_tags: string | string[] # optional
      maestro_version: string # optional - defaults to latest
      android_system_image_package: string # optional
      device_identifier: string | { android: string, ios: string } # optional
```

#### Parameters

다음 매개변수를 `params` 목록에 전달할 수 있습니다.

| Parameter | Type | Description |
| --- | --- | --- |
| build_id | string | 필수. 테스트할 build의 ID입니다. |
| flow_path | string or string[] | 필수. 실행할 Maestro flow 파일 또는 디렉터리의 경로입니다. |
| shards | number | 선택 사항이며 실험적입니다. 테스트를 나눌 shard 수입니다. 기본값은 1입니다. |
| retries | number | 선택 사항. 실패한 테스트를 재시도할 횟수입니다. 기본값은 1입니다. |
| record_screen | boolean | 선택 사항. 화면 녹화를 할지 여부입니다. 기본값은 false입니다. 참고: 화면 녹화는 emulator 성능에 영향을 줄 수 있습니다. 화면 녹화를 사용할 때는 large runner를 사용하는 것이 좋습니다. |
| include_tags | string or string[] | 선택 사항. 테스트에 포함할 flow tag입니다. Maestro에 `--include-tags`로 전달됩니다. |
| exclude_tags | string or string[] | 선택 사항. 테스트에서 제외할 flow tag입니다. Maestro에 `--exclude-tags`로 전달됩니다. |
| maestro_version | string | 선택 사항. 테스트에 사용할 Maestro 버전입니다. 제공하지 않으면 최신 버전이 사용됩니다. |
| output_format | string | 선택 사항. Maestro 테스트 리포트 형식입니다. Maestro에 `--format`으로 전달됩니다. `junit` 또는 다른 지원 형식이 될 수 있습니다. |
| android_system_image_package | string | 선택 사항. 사용할 Android Emulator system image package입니다. 사용 가능한 package 목록은 로컬에서 `sdkmanager --list`를 실행해 확인하세요. `x86_64` 변형을 선택하세요. 예: `system-images;android-36;google_apis;x86_64`, `system-images;android-35-ext15;google_apis_playstore;x86_64`. 최신 image일수록 더 많은 컴퓨팅 자원이 필요할 수 있으므로 large runner 사용을 고려하세요. |
| device_identifier | string or `{ android?: string, ios?: string }` object | 선택 사항. 테스트에 사용할 device identifier입니다. `pixel_6`, `iPhone 16 Plus`, `${{ needs.build.outputs.platform == "android" ? "pixel_6" : "iPhone 16 Plus" }}` 같은 단일 값 표현식도 사용할 수 있고, `device_identifier: { android: "pixel_6", ios: "iPhone 16 Plus" }` 같은 객체도 사용할 수 있습니다. iOS device 가용성은 runner image마다 다르다는 점에 유의하세요. 사용 가능한 device 목록은 job log에서 확인할 수 있습니다. |
| skip_build_check | boolean | 선택 사항. build 검증(iOS build가 simulator build인지 여부 확인)을 건너뜁니다. 기본값은 false입니다. |

### Examples

다음은 Maestro job을 사용하는 실용적인 예시입니다.

기본 Maestro 테스트

이 workflow는 기본 설정으로 iOS Simulator build에서 Maestro 테스트를 실행합니다.

```yaml
name: Basic Maestro Test

jobs:
  test:
    name: Run Maestro Tests
    type: maestro
    environment: preview
    params:
      build_id: ${{ needs.build_ios_simulator.outputs.build_id }}
      flow_path: ./maestro/flows
```

Sharding을 사용하는 Maestro 테스트

이 workflow는 Android emulator build에서 3개의 shard와 실패 테스트 2회 재시도로 Maestro 테스트를 실행합니다.

```yaml
name: Sharded Maestro Test

jobs:
  test:
    name: Run Sharded Maestro Tests
    type: maestro
    environment: preview
    runs_on: linux-large-nested-virtualization
    params:
      build_id: ${{ needs.build_android_emulator.outputs.build_id }}
      flow_path: ./maestro/flows
      shards: 3
      retries: 2
```

Maestro 접두사 environment variable 사용하기

변수 이름이 `MAESTRO_`로 시작하면 Maestro는 workflow 안의 environment variable을 자동으로 읽을 수 있습니다. 자세한 내용은 [shell variables에 대한 Maestro documentation](https://docs.maestro.dev/advanced/parameters-and-constants#accessing-variables-from-the-shell)을 참고하세요.

```yaml
name: Basic Maestro Test

jobs:
  test:
    name: Run Maestro Tests
    type: maestro
    env:
      MAESTRO_APP_ID: 'com.yourhost.yourapp'
    params:
      build_id: ${{ needs.build_ios_simulator.outputs.build_id }}
```

화면 녹화와 특정 device 사용하기

이 workflow는 특정 device를 사용해 Android emulator build에서 Maestro 테스트를 실행하고 화면을 녹화합니다.

```yaml
name: Pixel E2E Test

jobs:
  test:
    name: Run Maestro Tests
    type: maestro
    runs_on: linux-large-nested-virtualization
    params:
      build_id: ${{ needs.build_android_emulator.outputs.build_id }}
      device_identifier: 'pixel_6'
      record_screen: true
      android_system_image_package: 'system-images;android-35;default;x86_64'
```

스크린샷과 녹화 저장하기

나중에 디버깅에 사용할 수 있도록 Maestro 명령이 생성한 asset([`takeScreenshot`](https://docs.maestro.dev/api-reference/commands/takescreenshot) 또는 [`startRecording`](https://docs.maestro.dev/api-reference/commands/startrecording) 등)을 저장하려면 `MAESTRO_TESTS_DIR` environment variable을 사용하세요.

Maestro flow 파일 안에서 asset 위치를 지정합니다.

```yaml
appId: com.myapp
---
- launchApp
- startRecording: ${MAESTRO_TESTS_DIR}/my_recording
- takeScreenshot: ${MAESTRO_TESTS_DIR}/my_screenshot
- tapOn: 'Login Button'
- takeScreenshot: ${MAESTRO_TESTS_DIR}/after_login_screenshot
- stopRecording
```

이 asset들은 Artifacts 섹션의 "Maestro Test Results" artifact에서 확인할 수 있습니다.

## Maestro Cloud

Maestro Cloud에서 Maestro 테스트를 실행합니다.

> 이 기능을 사용하려면 Maestro Cloud 계정과 Cloud Plan 구독이 필요합니다. 자세한 내용은 [Maestro docs](https://docs.maestro.dev/cloud/run-maestro-tests-in-the-cloud)를 참고하세요.

### Syntax

```yaml
jobs:
  run_maestro_tests:
    type: maestro-cloud
    environment: production | preview | development # optional - defaults to preview
    image: string # optional- see https://docs.expo.dev/build-reference/infrastructure/ for a list of available images.
    params:
      build_id: string # required - ID of the build to test.
      maestro_project_id: string # required - Maestro Cloud project ID. Example: `proj_01jw6hxgmdffrbye9fqn0pyzm0`.
      flows: string # required - Path to the Maestro flow file or directory containing the flows to run. Corresponds to `--flows` param to `maestro cloud`.
      maestro_api_key: string # optional - defaults to `$MAESTRO_CLOUD_API_KEY`
      include_tags: string | string[] # optional - tags to include in the tests. Will be passed to Maestro as `--include-tags`.
      exclude_tags: string | string[] # optional - tags to exclude from the tests. Will be passed to Maestro as `--exclude-tags`.
      maestro_version: string # optional - version of Maestro to use for the tests. If not provided, the latest version will be used.
      android_api_level: string # optional - Android API level to use for the tests. Will be passed to Maestro as `--android-api-level`.
      maestro_config: string # optional - path to the Maestro `config.yaml` file to use for the tests. Will be passed to Maestro as `--config`.
      device_locale: string # optional - device locale to use for the tests. Will be passed to Maestro as `--device-locale`. Run `maestro cloud --help` for a list of supported values.
      device_model: string # optional - model of the device to use for the tests. Will be passed to Maestro as `--device-model`. Run `maestro cloud --help` for a list of supported values.
      device_os: string # optional - OS of the device to use for the tests. Will be passed to Maestro as `--device-os`. Run `maestro cloud --help` for a list of supported values.
      name: string # optional - name for the Maestro Cloud upload. Corresponds to `--name` param to `maestro cloud`.
      branch: string # optional - override for the branch the Maestro Cloud upload originated from. By default, if the workflow run has been triggered from GitHub, the branch of the workflow run will be used. Corresponds to `--branch` param to `maestro cloud`.
      async: boolean # optional - run the Maestro Cloud tests asynchronously. If true, the status of the job will only denote whether the upload was successful, _not_ whether the tests succeeded. Corresponds to `--async` param to `maestro cloud`.
```

#### Parameters

다음 매개변수를 `params` 목록에 전달할 수 있습니다.

| Parameter | Type | Description |
| --- | --- | --- |
| build_id | string | 필수. 테스트할 build의 ID입니다. 예: `${{ needs.build_android.outputs.build_id }}`. |
| maestro_project_id | string | 필수. 사용할 Maestro Cloud project의 ID입니다. `maestro cloud`의 `--project-id` 매개변수에 대응합니다. 예: `proj_01jw6hxgmdffrbye9fqn0pyzm0`. 자신의 값은 [Maestro Cloud](https://app.maestro.dev/)에서 확인하세요. |
| flows | string | 필수. 실행할 Maestro flow 파일 또는 flow가 들어 있는 디렉터리 경로입니다. `maestro cloud`의 `--flows` 매개변수에 대응합니다. |
| maestro_api_key | string | 선택 사항. Maestro project에 사용할 API key입니다. 기본적으로 `MAESTRO_CLOUD_API_KEY` environment variable이 사용됩니다. `maestro cloud`의 `--api-key` 매개변수에 대응합니다. |
| include_tags | string | 선택 사항. 테스트에 포함할 tag입니다. `maestro cloud`의 `--include-tags` 매개변수에 대응합니다. 예: `"pull,push"`. |
| exclude_tags | string | 선택 사항. 테스트에서 제외할 tag입니다. `maestro cloud`의 `--exclude-tags` 매개변수에 대응합니다. 예: `"disabled"`. |
| maestro_version | string | 선택 사항. 사용할 Maestro 버전입니다. 예: `1.30.0`. |
| android_api_level | string | 선택 사항. 사용할 Android API level입니다. `maestro cloud`의 `--android-api-level` 매개변수에 대응합니다. 예: `29`. |
| maestro_config | string | 선택 사항. 사용할 Maestro `config.yaml` 파일의 경로입니다. `maestro cloud`의 `--config` 매개변수에 대응합니다. 예: `.maestro/config.yaml`. |
| device_locale | string | 선택 사항. 테스트에 사용할 device locale입니다. `maestro cloud`의 `--device-locale` 매개변수에 대응합니다. 예: `pl_PL`. |
| device_model | string | 선택 사항. 테스트에 사용할 device model입니다. `maestro cloud`의 `--device-model` 매개변수에 대응합니다. 예: `iPhone-11`. 지원 값 목록은 `maestro cloud --help`에서 확인하세요. |
| device_os | string | 선택 사항. 테스트에 사용할 device OS입니다. `maestro cloud`의 `--device-os` 매개변수에 대응합니다. 예: `iOS-18-2`. 지원 값 목록은 `maestro cloud --help`에서 확인하세요. |
| name | string | 선택 사항. Maestro Cloud 업로드 이름입니다. `maestro cloud`의 `--name` 매개변수에 대응합니다. |
| branch | string | 선택 사항. Maestro Cloud 업로드의 원본 branch를 재정의합니다. 기본적으로 workflow 실행이 GitHub에서 트리거된 경우 그 workflow 실행의 branch가 사용됩니다. `maestro cloud`의 `--branch` 매개변수에 대응합니다. |
| async | boolean | 선택 사항. Maestro Cloud 테스트를 비동기로 실행합니다. 값이 true이면 job의 상태는 테스트 성공 여부가 아니라 업로드 성공 여부만 나타냅니다. `maestro cloud`의 `--async` 매개변수에 대응합니다. |

> `maestro_api_key` 매개변수를 설정하거나, job environment에 `MAESTRO_CLOUD_API_KEY` environment variable을 설정해야 합니다. API key를 생성하려면 [Maestro Cloud](https://app.maestro.dev/)의 "Settings"로 이동한 다음, 이를 프로젝트에 추가하려면 [Environment variables](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/environment-variables)로 이동하세요.

#### Outputs

이후 job에서 다음 output을 참조할 수 있습니다.

| Output | Type | Description |
| --- | --- | --- |
| maestro_cloud_url | string | Maestro Cloud 업로드 결과 페이지의 URL입니다. |
| total_flows_count | number | 실행된 flow의 총 개수입니다. |
| successful_flows_count | number | 성공적으로 완료된 flow의 개수입니다(status가 SUCCESS 또는 WARNING). |
| failed_flows_count | number | 실패한 flow의 개수입니다(status가 ERROR 또는 STOPPED). |
| successful_flow_names_json | string | 성공한 flow 이름이 들어 있는 JSON 배열입니다. |
| failed_flow_names_json | string | 실패한 flow 이름이 들어 있는 JSON 배열입니다. |

> **참고:** `async: true` 모드를 사용할 때는 `maestro_cloud_url` output만 유효하다고 보장됩니다. 다른 output(flow 수와 flow 이름)은 job이 업로드 완료를 기다리지 않고 flow가 아직 실행되지 않았기 때문에 잘못되었거나 비어 있을 수 있습니다.

### Examples

다음은 Maestro job을 사용하는 실용적인 예시입니다.

기본 Maestro Cloud 테스트

이 workflow는 기본 설정으로 iOS Simulator build에서 Maestro 테스트를 실행합니다.

```yaml
name: Basic Maestro Test

jobs:
  test:
    name: Run Maestro Tests
    type: maestro-cloud
    environment: preview
    params:
      build_id: ${{ needs.build_ios_simulator.outputs.build_id }}
      maestro_project_id: proj_01jw6hxgmdffrbye9fqn0pyzm0
      flows: ./maestro/flows
```

Maestro 접두사 environment variables 사용하기

변수 이름이 `MAESTRO_`로 시작하면 Maestro는 workflow 안의 environment variable을 자동으로 읽을 수 있습니다. 자세한 내용은 [shell variables에 대한 Maestro documentation](https://docs.maestro.dev/advanced/parameters-and-constants#accessing-variables-from-the-shell)을 참고하세요.

```yaml
name: Basic Maestro Test

jobs:
  test:
    name: Run Maestro Tests
    type: maestro-cloud
    env:
      MAESTRO_APP_ID: 'com.yourhost.yourapp'
    params:
      build_id: ${{ needs.build_ios_simulator.outputs.build_id }}
      maestro_project_id: proj_01jw6hxgmdffrbye9fqn0pyzm0
      flows: ./maestro/flows
```

이후 job에서 Maestro Cloud output 사용하기

이 workflow는 Maestro Cloud 테스트를 실행한 다음, 테스트 결과를 Slack 알림에서 사용합니다.

```yaml
name: Maestro Cloud with Notification

jobs:
  maestro_test:
    name: Run Maestro Cloud Tests
    type: maestro-cloud
    environment: preview
    params:
      build_id: ${{ needs.build.outputs.build_id }}
      maestro_project_id: proj_xyz
      flows: ./maestro/flows

  notify:
    name: Send Test Results
    after: [maestro_test]
    type: slack
    environment: production
    params:
      webhook_url: ${{ env.SLACK_WEBHOOK_URL }} # make sure to set it up in the right environment (see "environment: ..." above)
      message: 'Tests complete: ${{ after.maestro_test.outputs.successful_flows_count }}/${{ after.maestro_test.outputs.total_flows_count }} passed'
```

## Slack

[Slack webhook URL](https://api.slack.com/messaging/webhooks)을 사용해 Slack channel에 메시지를 보냅니다.

### Syntax

```yaml
jobs:
  send_slack_notification:
    type: slack
    params:
      webhook_url: string # required
      message: string # required if payload is not provided
      payload: object # required if message is not provided
```

#### Parameters

다음 매개변수를 `params` 목록에 전달할 수 있습니다.

| Parameter | Type | Description |
| --- | --- | --- |
| webhook_url | string | 필수. 메시지를 보낼 Slack webhook URL입니다. 현재는 하드코딩된 문자열만 지원합니다. `env`에 저장된 webhook 사용은 추후 지원될 예정이지만 아직은 지원되지 않습니다. |
| message | string | `payload`가 제공되지 않은 경우 필수입니다. 보낼 메시지입니다. |
| payload | object | `message`가 제공되지 않은 경우 필수입니다. 전송할 [Slack Block Kit](https://api.slack.com/block-kit) payload입니다. |

### Examples

다음은 Slack job을 사용하는 실용적인 예시입니다.

기본 build 알림

이 workflow는 iOS 앱을 build한 뒤 build job output의 app identifier와 version을 포함한 알림을 보냅니다.

```yaml
name: Build Notification

jobs:
  build_ios:
    name: Build iOS
    type: build
    params:
      platform: ios
      profile: production

  notify_build:
    name: Notify Build Status
    needs: [build_ios]
    type: slack
    params:
      webhook_url: https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
      message: 'Build completed for app ${{ needs.build_ios.outputs.app_identifier }} (version ${{ needs.build_ios.outputs.app_version }})'
```

Block Kit을 사용한 풍부한 build 알림

이 workflow는 Android 앱을 build하고 build job output을 사용해 풍부한 알림을 전송합니다.

```yaml
name: Rich Build Notification

jobs:
  build_android:
    name: Build Android
    type: build
    params:
      platform: android
      profile: production

  notify_build:
    name: Notify Build Status
    needs: [build_android]
    type: slack
    params:
      webhook_url: https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
      payload:
        blocks:
          - type: header
            text:
              type: plain_text
              text: 'Build Completed'
          - type: section
            fields:
              - type: mrkdwn
                text: "*App:*\n${{ needs.build_android.outputs.app_identifier }}"
              - type: mrkdwn
                text: "*Version:*\n${{ needs.build_android.outputs.app_version }}"
          - type: section
            fields:
              - type: mrkdwn
                text: "*Build ID:*\n${{ needs.build_android.outputs.build_id }}"
              - type: mrkdwn
                text: "*Platform:*\n${{ needs.build_android.outputs.platform }}"
          - type: section
            text:
              type: mrkdwn
              text: 'Distribution: ${{ needs.build_android.outputs.distribution }}'
```

## GitHub Comment

완료된 build, update, deployment 결과를 GitHub pull request에 자동으로 게시합니다. 이 job은 PR build에 대한 즉각적인 피드백 제공, QR 코드를 통한 테스트 build 공유, EAS Hosting deployment preview 표시, deployment 알림 자동화에 특히 유용합니다. `payload` 매개변수를 제공해 comment 내용을 직접 재정의할 수도 있습니다.

### Prerequisites

GitHub Comment job을 사용하려면 프로젝트에 연결된 GitHub 저장소가 있어야 합니다. 시작하려면 [GitHub 저장소 연결하기](/build/building-from-github)를 참고하세요.

### Syntax

```yaml
jobs:
  github_comment:
    type: github-comment
    params:
      message: string # optional - custom message to include in the report
      build_ids: string[] # optional - specific build IDs to include, defaults to all related to the running workflow
      update_group_ids: string[] # optional - specific update group IDs to include, defaults to all related to the workflow
      deployment_ids: string[] # optional - specific deployment IDs to include, defaults to all related to the workflow

  # instead of using message and the builds, updates, and deployments table, you can also override the comment contents with `payload`
  custom_github_comment:
    type: github-comment
    params:
      payload: string # optional - raw markdown/HTML content for fully custom comment
```

#### Parameters

이 job은 서로 배타적인 두 가지 모드로 동작합니다.

##### Mode 1: Auto-with-overrides mode

기본 동작은 build와 update를 자동으로 찾는 것이며, 원한다면 다음 매개변수를 지정할 수 있습니다.

| Parameter | Type | Description |
| --- | --- | --- |
| message | string | 선택 사항. comment 상단에 포함할 custom message입니다. 기본값은 `"Your builds, updates, and deployments are ready for testing!"`입니다. |
| build_ids | string[] | 선택 사항. 포함할 특정 build ID 배열입니다. 지정하지 않으면 완료/실패/취소된 build를 모두 자동으로 찾습니다. build를 제외하려면 빈 배열 `[]`을 사용하세요. |
| update_group_ids | string[] | 선택 사항. 포함할 특정 update group ID 배열입니다. 지정하지 않으면 성공한 update를 모두 자동으로 찾습니다. update를 제외하려면 빈 배열 `[]`을 사용하세요. |
| deployment_ids | string[] | 선택 사항. 포함할 특정 deployment ID 배열입니다. 지정하지 않으면 성공한 deployment를 모두 자동으로 찾습니다. deployment를 제외하려면 빈 배열 `[]`을 사용하세요. |

> **Auto-discovery 동작:** `build_ids`, `update_group_ids`, `deployment_ids`가 지정되지 않으면(undefined) job은 현재 workflow에서 관련 build, update, deployment를 모두 자동으로 찾습니다. build, update, deployment를 명시적으로 제외하려면 빈 배열 `[]`을 전달하세요.

##### Mode 2: Payload mode

payload mode를 사용할 때는 다른 매개변수를 함께 지정할 수 없습니다.

| Parameter | Type | Description |
| --- | --- | --- |
| payload | string | comment로 게시할 raw markdown 또는 HTML 콘텐츠입니다. workflow 변수 보간을 지원합니다. |

#### Outputs

이후 job에서 다음 output을 참조할 수 있습니다.

| Output | Type | Description |
| --- | --- | --- |
| comment_url | string | 게시된 GitHub comment의 URL입니다(comment가 성공적으로 게시된 경우에만 제공). |

### Examples

다음은 GitHub Comment job의 두 모드를 모두 보여 주는 실용적인 예시입니다.

#### Auto-with-overrides mode examples

모든 build, update, deployment 자동 찾기

가장 단순한 사용 방식으로, workflow의 모든 build, update, deployment를 자동으로 찾아 게시합니다.

```yaml
name: PR Auto Comment

on:
  pull_request: {}

jobs:
  # ...

  comment_on_pr:
    name: Post Results to PR
    after: [build_ios, build_android, publish_update, deploy]
    type: github-comment
    # No params needed - auto-discovers all builds, updates, and deployments
```

Custom message와 auto-discovery 사용하기

build, update, deployment를 모두 자동으로 찾으면서 custom message를 추가합니다.

```yaml
name: PR Custom Message

on:
  pull_request: {}

jobs:
  # ...

  comment_on_pr:
    name: Post Build to PR
    after: [build_ios, build_android, publish_update, deploy]
    type: github-comment
    params:
      message: '🎉 Preview builds are ready! Please test these changes before approving the PR.'
      # build_ids, update_group_ids, and deployment_ids are undefined, so auto-discovery is enabled
```

EAS Hosting deployment가 있는 PR preview

이 workflow는 EAS Hosting을 사용해 웹사이트 preview를 배포하고 deployment 세부 정보를 pull request에 게시합니다.

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

정확한 build와 update 지정하기

comment에 포함할 build와 update를 명시적으로 지정합니다.

```yaml
name: PR Specific Builds

on:
  pull_request: {}

jobs:
  # ...

  comment_update:
    name: Post Update to PR
    after: [build_ios, build_android, publish_update]
    type: github-comment
    params:
      message: 'Testing builds ready for QA review'
      build_ids:
        - ${{ after.build_ios.outputs.build_id }}
        - ${{ after.build_android.outputs.build_id }}
      update_group_ids:
        - ${{ after.publish_update.outputs.first_update_group_id }}
```

Build, update, deployment 제외하기

특정 콘텐츠 유형을 제외하려면 빈 배열을 사용하세요.

```yaml
name: PR Updates Only

on:
  pull_request: {}

jobs:
  # ...

  comment_updates_only:
    name: Post Updates Only
    after: [publish_update]
    type: github-comment
    params:
      message: 'New update available for testing!'
      build_ids: [] # Empty array excludes all builds
      deployment_ids: [] # Empty array excludes all deployments
      # update_group_ids undefined = auto-discover updates
```

#### Payload mode examples

payload로 완전히 custom comment 만들기

payload mode는 comment 내용 전체를 완전히 제어할 수 있게 해 줍니다. payload를 사용할 때는 다른 매개변수를 함께 지정할 수 없다는 점에 유의하세요.

```yaml
name: Custom PR Comment

on:
  pull_request: {}

jobs:
  # ...

  custom_comment:
    name: Post Custom Comment
    needs: [build_ios]
    type: github-comment
    params:
      # Payload mode: complete control over content
      # Cannot use message, build_ids, or update_group_ids with payload
      payload: |
        ## 🚀 Build Status Update

        ### iOS Build Completed
        - **Build ID**: `${{ needs.build_ios.outputs.build_id }}`
        - **Version**: ${{ needs.build_ios.outputs.app_version }}
        - **Build Number**: ${{ needs.build_ios.outputs.app_build_version }}

        ### Next Steps
        1. Download the build from [EAS Dashboard](https://expo.dev/accounts/[account]/projects/[project]/builds/${{ needs.build_ios.outputs.build_id }})
        2. Test on physical device
        3. Approve for TestFlight distribution

        ---
        *This comment was automatically generated by EAS Workflows*
```

Build 상태에 따라 조건부 comment 게시하기

이 workflow는 build가 성공했는지 실패했는지에 따라 서로 다른 comment를 게시합니다.

```yaml
name: Conditional PR Comment

on:
  pull_request: {}

jobs:
  build_android:
    name: Build Android
    type: build
    params:
      platform: android
      profile: preview

  comment_success:
    name: Post Success Comment
    needs: [build_android]
    if: ${{ needs.build_android.status == 'success' }}
    type: github-comment
    params:
      message: '✅ Android build succeeded! Ready for testing.'
      build_ids: # provided only for instructional purposes, you could as well omit this here
        - ${{ needs.build_android.outputs.build_id }}

  comment_failure:
    name: Post Failure Comment
    after: [build_android]
    if: ${{ after.build_android.status == 'failure' }}
    type: github-comment
    params:
      payload: |
        ❌ **Android build failed**

        Please check the [workflow logs](https://expo.dev/accounts/[account]/projects/[project]/workflows) for details.
```

## Require Approval

workflow를 계속 진행하기 전에 사용자 승인을 요구합니다. 사용자는 승인 또는 거절할 수 있으며, 이는 job의 성공 또는 실패로 이어집니다.

### Syntax

```yaml
jobs:
  require_approval:
    type: require-approval
```

#### Parameters

이 job은 어떤 매개변수도 받지 않습니다.

### Examples

다음은 Require Approval job을 사용하는 실용적인 예시입니다.

Production에 배포하기 전에 승인 요청하기

이 workflow는 먼저 web app을 preview에 배포한 뒤, production 배포 전에 사용자 승인을 요구합니다.

```yaml
jobs:
  web_preview:
    name: Deploy Web Preview
    type: deploy

  require_approval:
    name: Deploy Web to Production?
    needs: [web_preview]
    type: require-approval

  web_production:
    name: Deploy Web Production
    needs: [require_approval]
    type: deploy
    params:
      prod: true
```

Workflow 흐름 제어하기

이 workflow는 결말을 공개하기 전에 승인을 요구함으로써 사용자가 이야기의 결말을 결정하게 합니다.

```yaml
jobs:
  show_story_intro:
    name: Dragon and Knight Story Intro
    type: doc
    params:
      md: |
        # The Dragon and the Knight

        Once upon a time, in a land far away, a brave knight set out to face a mighty dragon.

        The dragon roared, breathing fire across the valley, but the knight stood firm, shield raised high.

        Now, the fate of their encounter is in your hands...

  require_approval:
    name: Should the knight and dragon become friends?
    needs: [show_story_intro]
    type: require-approval

  happy_ending:
    name: Friendship Ending
    needs: [require_approval]
    type: doc
    params:
      md: |
        ## A New Friendship

        The knight lowered his sword, and the dragon ceased its fire. They realized they both longed for peace. From that day on, they became the best of friends, protecting the kingdom together.

  epic_battle:
    name: Epic Battle Ending
    after: [require_approval]
    if: ${{ failure() }}
    type: doc
    params:
      md: |
        ## The Epic Battle

        The knight charged forward, and the dragon unleashed a mighty roar. Their battle shook the mountains and echoed through the ages. In the end, both were remembered as fierce and noble adversaries.
```

## Doc

workflow log에 Markdown 섹션을 표시합니다.

### Syntax

```yaml
jobs:
  show_whats_next:
    type: doc
    params:
      md: string
```

#### Parameters

다음 매개변수를 `params` 목록에 전달할 수 있습니다.

| Parameter | Type | Description |
| --- | --- | --- |
| md | string | 필수. 표시할 Markdown 콘텐츠입니다. `${{ . . }}` workflow interpolation을 사용할 수 있습니다. |

### Examples

다음은 Doc job을 사용하는 실용적인 예시입니다.

안내 표시하기

이 workflow는 iOS 앱을 build한 다음 workflow log에 Markdown 섹션을 표시합니다.

```yaml
jobs:
  build_ios:
    name: Build iOS
    type: build
    params:
      platform: ios
      profile: production

  submit:
    name: Submit to App Store
    type: submit
    needs: [build_ios]
    params:
      build_id: ${{ needs.build_ios.outputs.build_id }}
      profile: production

  next_steps:
    name: Next Steps
    needs: [submit]
    type: doc
    params:
      md: |
        # To do next

        Your app has just been sent to [App Store Connect](https://appstoreconnect.apple.com/apps).

        1. Download the app from TestFlight.
        2. Test the app a bunch.
        3. Submit the app for review.
```

## Repack

기존 build에서 앱을 repack합니다. 이 job은 전체 native rebuild를 수행하지 않고 앱의 metadata와 JavaScript bundle을 다시 패키징하므로, 특정 fingerprint와 호환되는 더 빠른 build를 만드는 데 유용합니다.

### Syntax

```yaml
jobs:
  repack:
    type: repack
    runs_on: string # optional - see https://docs.expo.dev/build-reference/infrastructure/ for available options
    params:
      build_id: string # required
      profile: string # optional
      embed_bundle_assets: boolean # optional
      message: string # optional
      repack_version: string # optional
```

### Common questions

언제 repack을 사용하고, 언제 사용하지 말아야 하나요?

Repack job은 다음 사용 사례에 적합합니다.

-   기존 build를 재사용해 CI build 시간을 줄이는 경우
-   필요할 때만 전체 native build를 트리거하는 경우
-   팀에 더 빠른 피드백 루프를 제공하는 경우

Repack job은 다음 사용 사례에는 적합하지 않습니다.

-   올바른 symbolication 및 app signing을 위해 build가 전체 pipeline을 통과해야 하는 production build

#### Parameters

다음 매개변수를 `params` 목록에 전달할 수 있습니다.

| Parameter | Type | Description |
| --- | --- | --- |
| build_id | string | 필수. repack할 build의 source build ID입니다. |
| profile | string | 선택 사항. 사용할 build profile입니다. 기본값은 `build_id`에서 가져온 source build의 profile입니다. |
| embed_bundle_assets | boolean | 선택 사항. repack된 build에 bundle asset을 포함할지 여부입니다. 기본적으로 source build를 기준으로 자동 결정됩니다. |
| message | string | 선택 사항. build에 첨부할 custom message입니다. `eas build`를 실행할 때의 `--message` 플래그에 대응합니다. |
| repack_version | string | 선택 사항. 사용할 `@expo/repack-app` 버전입니다. 기본값은 최신 버전입니다. |

### Examples

다음은 Fingerprint와 Repack job을 함께 사용하는 실용적인 예시입니다.

Fingerprint와 Repack을 사용한 Continuous Deployment

이 workflow는 먼저 fingerprint를 생성한 다음, 해당 fingerprint와 호환되는 build가 이미 있는지에 따라 앱을 build하거나 repack합니다. 마지막으로 Maestro 테스트를 실행합니다.

```yaml
name: continuous-deploy-fingerprint

jobs:
  fingerprint:
    id: fingerprint
    type: fingerprint
    environment: production

  android_get_build:
    needs: [fingerprint]
    id: android_get_build
    type: get-build
    params:
      fingerprint_hash: ${{ needs.fingerprint.outputs.android_fingerprint_hash }}
      platform: android

  android_repack:
    needs: [android_get_build]
    id: android_repack
    if: ${{ needs.android_get_build.outputs.build_id }}
    type: repack
    params:
      build_id: ${{ needs.android_get_build.outputs.build_id }}

  android_build:
    needs: [android_get_build]
    id: android_build
    if: ${{ !needs.android_get_build.outputs.build_id }}
    type: build
    params:
      platform: android
      profile: preview-simulator

  android_maestro:
    after: [android_repack, android_build]
    id: android_maestro
    type: maestro
    image: latest
    params:
      build_id: ${{ needs.android_repack.outputs.build_id || needs.android_build.outputs.build_id }}
      flow_path: ['maestro.yaml']

  ios_get_build:
    needs: [fingerprint]
    id: ios_get_build
    type: get-build
    params:
      fingerprint_hash: ${{ needs.fingerprint.outputs.ios_fingerprint_hash }}
      platform: ios

  ios_repack:
    needs: [ios_get_build]
    id: ios_repack
    if: ${{ needs.ios_get_build.outputs.build_id }}
    type: repack
    params:
      build_id: ${{ needs.ios_get_build.outputs.build_id }}

  ios_build:
    needs: [ios_get_build]
    id: ios_build
    if: ${{ !needs.ios_get_build.outputs.build_id }}
    type: build
    params:
      platform: ios
      profile: preview-simulator

  ios_maestro:
    after: [ios_repack, ios_build]
    id: ios_maestro
    type: maestro
    image: latest
    params:
      build_id: ${{ needs.ios_repack.outputs.build_id || needs.ios_build.outputs.build_id }}
      flow_path: ['maestro.yaml']
```
