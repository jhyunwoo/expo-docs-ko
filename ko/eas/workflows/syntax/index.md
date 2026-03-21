---
modificationDate: March 09, 2026
title: EAS Workflows 문법
description: EAS Workflows 구성 파일 문법에 대한 reference 가이드입니다.
---

# EAS Workflows 문법

EAS Workflows 구성 파일 문법에 대한 reference 가이드입니다.

workflow는 하나 이상의 job으로 이루어진 구성 가능한 자동화 프로세스입니다. workflow 구성을 정의하려면 YAML 파일을 만들어야 합니다.

workflows를 시작하려면 [Get Started with EAS Workflows](/eas/workflows/get-started)를 참고하거나, 전체 workflow 구성 예시는 [Examples](/eas/workflows/examples/introduction)를 참고하세요.

## Workflow 파일

Workflow 파일은 YAML 문법을 사용하며 파일 확장자는 반드시 `.yml` 또는 `.yaml`이어야 합니다. YAML이 처음이고 더 알아보고 싶다면 [Learn YAML in Y minutes](https://learnxinyminutes.com/docs/yaml/)를 참고하세요.

Workflow 파일은 프로젝트의 **.eas/workflows** 디렉터리에 위치합니다. **.eas** 디렉터리는 [**eas.json**](/build/eas-json) 파일과 같은 레벨에 있어야 합니다.

예:

`my-app`

 `.eas`

  `workflows`

   `create-development-builds.yml`

   `publish-preview-update.yml`

   `deploy-to-production.yml`

 `eas.json`

## Configuration reference

아래는 workflow 구성 파일 문법에 대한 reference입니다.

## `name`

workflow의 사람이 읽기 쉬운 이름입니다. 이 값은 EAS dashboard의 workflows 목록 페이지에 표시되며 workflow 상세 페이지의 제목으로 사용됩니다.

```yaml
name: My workflow
```

## `on`

`on` key는 어떤 GitHub event가 workflow를 트리거할지 정의합니다. 어떤 workflow든 `on` key와 관계없이 `eas workflow:run` 명령으로 실행할 수 있습니다.

```yaml
on:
  # Trigger on pushes to main branch
  push:
    branches:
      - main
  # And on pull requests starting with 'version-'
  pull_request:
    branches:
      - version-*
```

> commit message에 `[eas skip]`, `[skip eas]`, 또는 `[no eas]`를 포함하면 `push` 및 `pull_request`로 트리거되는 workflow 실행을 건너뛸 수 있습니다.

### `on.push`

일치하는 branch 및/또는 tag에 commit을 push할 때 workflow를 실행합니다.

`branches` 목록을 사용하면 지정한 branch에 push될 때만 workflow를 트리거할 수 있습니다. 예를 들어 `branches: ['main']`을 사용하면 `main` branch로의 push만 workflow를 트리거합니다. glob을 지원합니다. `!` 접두사를 사용하면 무시할 branch를 지정할 수 있습니다. 이 경우에도 접두사 없이 최소 하나의 branch pattern은 제공해야 합니다.

`tags` 목록을 사용하면 지정한 tag가 push될 때만 workflow를 트리거할 수 있습니다. 예를 들어 `tags: ['v1']`을 사용하면 `v1` tag가 push될 때만 workflow를 트리거합니다. glob을 지원합니다. `!` 접두사를 사용하면 무시할 tag를 지정할 수 있습니다. 이 경우에도 접두사 없이 최소 하나의 tag pattern은 제공해야 합니다.

`paths` 목록을 사용하면 지정한 path와 일치하는 파일에 변경이 있을 때만 workflow를 트리거할 수 있습니다. 예를 들어 `paths: ['apps/mobile/**']`를 사용하면 `apps/mobile` 디렉터리의 파일 변경만 workflow를 트리거합니다. glob을 지원합니다. 기본적으로는 어떤 path의 변경이든 workflow를 트리거합니다.

`branches`와 `tags`를 모두 제공하지 않으면 `branches`의 기본값은 `['*']`, `tags`의 기본값은 `[]`가 됩니다. 즉 모든 branch의 push event에서 workflow가 트리거되고, tag push에서는 트리거되지 않습니다. 둘 중 하나만 제공하면 다른 하나는 `[]`로 기본 설정됩니다.

```yaml
on:
  push:
    branches:
      - main
      - feature/**
      - !feature/test-** # other branch names and globs

    tags:
      - v1
      - v2*
      - !v2-preview** # other tag names and globs

    paths:
      - apps/mobile/**
      - packages/shared/**
      - !**/*.md # ignore markdown files
```

### `on.pull_request`

일치하는 branch 중 하나를 대상으로 하는 pull request를 생성하거나 업데이트할 때 workflow를 실행합니다.

`branches` 목록을 사용하면 지정한 branch가 pull request의 대상일 때만 workflow를 트리거할 수 있습니다. 예를 들어 `branches: ['main']`을 사용하면 main branch로 병합하려는 pull request만 workflow를 트리거합니다. glob을 지원합니다. 제공하지 않으면 기본값은 `['*']`이며, 이는 모든 branch로 가는 pull request event에서 workflow가 트리거된다는 뜻입니다. `!` 접두사를 사용하면 무시할 branch를 지정할 수 있습니다. 이 경우에도 접두사 없이 최소 하나의 branch pattern은 제공해야 합니다.

`types` 목록을 사용하면 지정한 pull request event type에서만 workflow를 트리거할 수 있습니다. 예를 들어 `types: ['opened']`를 사용하면 `pull_request.opened` event만 workflow를 트리거합니다. 이 event는 pull request가 처음 열릴 때 전송됩니다. 제공하지 않으면 기본값은 `['opened', 'reopened', 'synchronize']`입니다. 지원되는 event type은 다음과 같습니다:

-   `opened`
-   `ready_for_review`
-   `reopened`
-   `synchronize`
-   `labeled`

`paths` 목록을 사용하면 지정한 path와 일치하는 파일에 변경이 있을 때만 workflow를 트리거할 수 있습니다. 예를 들어 `paths: ['apps/mobile/**']`를 사용하면 `apps/mobile` 디렉터리의 파일 변경만 workflow를 트리거합니다. glob을 지원합니다. 기본적으로는 어떤 path의 변경이든 workflow를 트리거합니다.

```yaml
on:
  pull_request:
    branches:
      - main
      - feature/**
      - !feature/test-** # other branch names and globs

    types:
      - opened
      # other event types

    paths:
      - apps/mobile/**
      - packages/shared/**
      - !**/*.md # ignore markdown files
```

### `on.pull_request_labeled`

일치하는 label이 pull request에 붙었을 때 workflow를 실행합니다.

`labels` 목록을 사용하면 어떤 label이 pull request에 할당될 때 workflow를 트리거할지 지정할 수 있습니다. 예를 들어 `labels: ['Test']`를 사용하면 `Test` label이 pull request에 붙을 때만 workflow가 트리거됩니다. 제공하지 않으면 기본값은 `[]`이며, 어떤 label도 workflow를 트리거하지 않습니다.

더 간단한 문법을 위해 `on.pull_request_labeled`에 일치할 label 목록을 직접 제공할 수도 있습니다.

```yaml
on:
  pull_request_labeled:
    labels:
      - Test
      - Preview
      # other labels
```

또는:

```yaml
on:
  pull_request_labeled:
    - Test
    - Preview
    # other labels
```

### `on.schedule.cron`

[unix-cron](https://www.ibm.com/docs/en/db2/11.5?topic=task-unix-cron-format) 문법을 사용해 예약된 시각에 workflow를 실행합니다. cron 문자열을 만들려면 [crontab guru](https://crontab.guru/)와 그들의 [examples](https://crontab.guru/examples.html)를 사용할 수 있습니다.

-   예약 workflow는 저장소의 default branch에서만 실행됩니다. 많은 경우 이는 `main` branch의 workflow 파일 안에 있는 cron은 예약되지만 feature branch의 workflow 파일 안에 있는 cron은 예약되지 않는다는 뜻입니다.
-   예약 workflow는 높은 부하 시간대에 지연될 수 있습니다. 높은 부하 시간대에는 매 시각 정각이 포함됩니다. 드물게 job이 건너뛰어지거나 여러 번 실행될 수 있습니다. workflow는 idempotent하도록 만들고 해로운 부작용이 없도록 하세요.
-   하나의 workflow에는 여러 `cron` schedule이 있을 수 있습니다.
-   예약 workflow는 GMT time zone에서 실행됩니다.

```yaml
on:
  schedule:
    - cron: '0 0 * * *' # Runs at midnight GMT every day
```

### `on.workflow_dispatch.inputs`

`eas workflow:run` 명령으로 workflow를 수동 실행할 때 제공할 수 있는 input을 정의합니다. 이를 통해 실행할 때마다 다른 값을 받을 수 있는 parameterized workflow를 만들 수 있습니다.

```yaml
on:
  workflow_dispatch:
    inputs:
      name:
        type: string
        required: false
        description: 'Name of the person to greet'
        default: 'World'
      choice_example:
        type: choice
        options:
          - to be
          - not to be
        required: true
```

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | `string` | Yes | input type입니다(`string`, `boolean`, `number`, `choice`, 또는 `environment`). |
| `description` | `string` | No | input에 대한 설명입니다. |
| `required` | `boolean` | No | input이 필수인지 여부입니다. 기본값은 `false`입니다. |
| `default` | varies | No | input의 기본값입니다. input type과 일치해야 합니다. |
| `options` | `string[]` | Yes (for `type: choice`) | choice input에 사용할 수 있는 옵션입니다. |

#### Providing inputs

input과 함께 workflow를 실행할 때는 여러 방식으로 값을 제공할 수 있습니다:

1.  Command line flag:
    
    ```sh
    eas workflow:run .eas/workflows/deploy.yml -F environment=production -F debug=true -F version=1.2.3
    ```
    
2.  stdin을 통한 JSON:
    
    ```sh
    echo '{"environment": "production", "debug": true, "version": "1.2.3"}' | eas workflow:run .eas/workflows/deploy.yml
    ```
    
3.  Interactive prompt: 필수 input이 빠져 있고 `--non-interactive`를 사용하지 않는 경우 CLI가 값을 물어봅니다:
    
    ```sh
    eas workflow:run .eas/workflows/deploy.yml
    ```
    

#### Usage

input 값은 workflow job에서 `${{ inputs.<input_name> }}` 문법으로 사용할 수 있습니다:

```yaml
on:
  workflow_dispatch:
    inputs:
      name:
        type: string
        required: true
        description: 'Name of the person to greet'

jobs:
  deploy:
    steps:
      - name: Deploy to environment
        run: |
          echo "Hello, ${{ inputs.name }}!"

          # Note: you can use `||` to provide a default value
          #       for non-eas-workflow:run-run workflows.
          echo "Hello, ${{ inputs.name || 'World' }}!"
```

## `jobs`

workflow 실행은 하나 이상의 job으로 구성됩니다.

```yaml
jobs:
  job_1:
    # ...
  job_2:
    # ...
```

### `jobs.<job_id>`

각 job에는 ID가 있어야 합니다. ID는 workflow 내에서 고유해야 하며 영숫자와 밑줄을 포함할 수 있습니다. 예를 들어 다음 YAML의 `my_job`입니다:

```yaml
jobs:
  my_job:
    # ...
```

### `jobs.<job_id>.name`

workflow 상세 페이지에 표시되는 job의 사람이 읽기 쉬운 이름입니다.

```yaml
jobs:
  my_job:
    name: Build app
```

### `jobs.<job_id>.environment`

job에 사용할 [EAS environment variable](/eas/environment-variables) environment를 설정합니다. 가능한 값은 세 가지입니다:

-   `production` (default)
-   `preview`
-   `development`

`environment` key는 모든 job에서 사용할 수 있습니다.

```yaml
jobs:
  my_job:
    environment: production | preview | development
```

### `jobs.<job_id>.env`

job의 environment variable을 설정합니다. 이 속성은 VM에서 실행되는 모든 job에서 사용할 수 있습니다. pre-packaged `require-approval`, `doc`, `get-build`, `slack` job은 제외됩니다.

```yaml
jobs:
  my_job:
    env:
      APP_VARIANT: staging
      RETRY_COUNT: 3
      PREV_JOB_OUTPUT: ${{ needs.previous_job.outputs.some_output }}
```

### `jobs.<job_id>.defaults.run.working_directory`

job 안의 모든 step이 명령을 실행할 디렉터리를 설정합니다.

```yaml
jobs:
  my_job:
    defaults:
      run:
        working_directory: ./my-app
    steps:
      - name: My first step
        run: pwd # prints: /home/expo/workingdir/build/my-app
```

## `defaults`

workflow 구성에 정의된 모든 job에 기본값으로 사용할 매개변수입니다.

### `defaults.run.working_directory`

script를 실행할 기본 working directory입니다. `"./assets"` 또는 `"assets"` 같은 상대 경로는 앱의 base directory를 기준으로 해석됩니다.

### `defaults.tools`

이 workflow 구성에 정의된 job에 사용할 특정 tool 버전입니다. 사용 가능한 값은 각 tool의 문서를 따르세요.

| Tool | Description |
| --- | --- |
| `node` | `nvm`으로 설치하는 Node.js 버전입니다. |
| `yarn` | `npm -g`로 설치하는 Yarn 버전입니다. |
| `corepack` | `true`로 설정하면 build 프로세스 시작 시 [corepack](https://nodejs.org/api/corepack.html)이 활성화됩니다. 기본값은 false입니다. |
| `pnpm` | `npm -g`로 설치하는 pnpm 버전입니다. |
| `bun` | Bun 설치 스크립트에 `bun-v$VERSION`을 전달해 설치하는 Bun 버전입니다. |
| `ndk` | `sdkmanager`를 통해 설치하는 Android NDK 버전입니다. |
| `bundler` | `gem install -v`에 전달할 Bundler 버전입니다. |
| `fastlane` | `gem install -v`에 전달할 fastlane 버전입니다. |
| `cocoapods` | `gem install -v`에 전달할 CocoaPods 버전입니다. |

`defaults.tools`를 사용하는 workflow 예시:

```yaml
name: Set up custom versions
defaults:
  tools:
    node: latest
    yarn: '2'
    corepack: true
    pnpm: '8'
    bun: '1.0.0'
    fastlane: 2.224.0
    cocoapods: 1.12.0

on:
  push:
    branches: ['*']

jobs:
  setup:
    steps:
      - name: Check Node version
        run: node --version # should print a concrete version, like 23.9.0
      - name: Check Yarn version
        run: yarn --version # should print a concrete version, like 2.4.3
```

## `concurrency`

동시 실행 제어를 위한 구성입니다. 현재는 같은 branch의 workflow에 대해 `cancel_in_progress` 설정만 허용합니다.

```yaml
concurrency:
  cancel_in_progress: true
  group: ${{ workflow.filename }}-${{ github.ref }}
```

| Property | Type | Description |
| --- | --- | --- |
| `cancel_in_progress` | `boolean` | true이면 GitHub에서 시작된 새 workflow 실행이 같은 branch에서 현재 진행 중인 실행을 취소합니다. |
| `group` | `string` | 아직 custom concurrency group은 지원하지 않습니다. 나중에 custom group을 지원하게 되었을 때도 workflow가 호환되도록 이 placeholder 값을 설정하세요. |

## Control flow

`needs`와 `after` keyword를 사용해 job 실행 시점을 제어할 수 있습니다. 또한 `if` keyword를 사용해 조건에 따라 job을 실행할지 결정할 수 있습니다.

### `jobs.<job_id>.needs`

이 job이 실행되기 전에 성공적으로 완료되어야 하는 job ID 목록입니다.

```yaml
jobs:
  test:
    steps:
      - uses: eas/checkout
      - uses: eas/use_npm_token
      - uses: eas/install_node_modules
      - name: tsc
        run: yarn tsc
  build:
    needs: [test] # This job will only run if the 'test' job succeeds
    type: build
    params:
      platform: ios
```

### `jobs.<job_id>.after`

이 job이 실행되기 전에 완료되어야 하는 job ID 목록입니다. 성공 여부는 상관없습니다.

```yaml
jobs:
  build:
    type: build
    params:
      platform: ios
  notify:
    after: [build] # This job will run after build completes (whether build succeeds or fails)
```

### `jobs.<job_id>.if`

`if` 조건식은 job 실행 여부를 결정합니다. `if` 조건이 충족되면 job이 실행됩니다. 조건이 충족되지 않으면 job은 건너뜁니다. 건너뛴 job은 성공적으로 완료된 것으로 간주되지 않으며, 이 job을 `needs` 목록에 포함한 downstream job은 실행되지 않습니다.

```yaml
jobs:
  my_job:
    if: ${{ github.ref_name == 'main' }}
```

## Interpolation

workflow 실행 컨텍스트를 기반으로 workflow의 동작을 커스터마이즈할 수 있습니다. 예를 들어 실행할 명령, control flow, environment variable, build profile, app 버전 등을 바꿀 수 있습니다.

`${{ expression }}` 문법을 사용해 context property와 function에 접근하세요. 예: `${{ github.ref_name }}` 또는 `${{ needs.build_ios.outputs.build_id }}`.

### Context properties

다음 property를 interpolation context에서 사용할 수 있습니다:

#### `after`

현재 job의 `after` 목록에 지정된 모든 upstream job의 record입니다. 각 job은 다음을 제공합니다:

```json
{
  "status": "success" | "failure" | "skipped",
  "outputs": {}
}
```

예:

```yaml
jobs:
  build:
    type: build
    params:
      platform: ios
  notify:
    after: [build]
    steps:
      - run: echo "Build status: ${{ after.build.status }}"
```

#### `needs`

현재 job의 `needs` 목록에 지정된 모든 upstream job의 record입니다. 각 job은 다음을 제공합니다:

```json
{
  "status": "success" | "failure" | "skipped",
  "outputs": {}
}
```

대부분의 pre-packaged job은 특정 output을 노출합니다. [custom job에서 `set-output` function을 사용해 output을 설정](/eas/workflows/syntax#jobsjob_idoutputs)할 수도 있습니다.

예:

```yaml
jobs:
  setup:
    outputs:
      date: ${{ steps.current_date.outputs.date }}
    steps:
      - id: current_date
        run: |
          DATE=$(date +"%Y.%-m.%-d")
          set-output date "$DATE"

  build_ios:
    needs: [setup]
    type: build
    env:
      # You might use process.env.VERSION_SUFFIX to customize
      # app version in your dynamic app config.
      VERSION_SUFFIX: ${{ needs.setup.outputs.date }}
    params:
      platform: ios
      profile: development
```

#### `steps`

현재 job 안의 모든 step에 대한 record입니다. 각 step은 [`set-output`](/eas/workflows/syntax#set-output) function으로 설정한 output을 제공합니다.

> **Note:** `steps` context는 workflow 레벨이 아니라 job의 step 안에서만 사용할 수 있습니다. step의 output을 다른 job에 노출하려면 [`set-output`](/eas/workflows/syntax#set-output) function과 [job의 `outputs` configuration](/eas/workflows/syntax#jobsjob_idoutputs)을 사용하세요.

예:

```yaml
jobs:
  my_job:
    outputs:
      value: ${{ steps.step_1.outputs.value }}
    steps:
      - id: step_1
        run: set-output value "hello"
      - run: echo ${{ steps.step_1.outputs.value }}

  another_job:
    needs: [my_job]
    steps:
      - run: echo "Value: ${{ needs.my_job.outputs.value }}"
```

#### `inputs`

[`workflow_dispatch`](/eas/workflows/syntax#onworkflow_dispatchinputs)로 workflow를 수동 실행할 때 제공된 input의 record입니다. input parameter와 함께 `eas workflow:run` 명령으로 workflow가 트리거되었을 때 사용할 수 있습니다.

예:

```yaml
on:
  workflow_dispatch:
    inputs:
      name:
        type: string
        required: true

jobs:
  greet:
    steps:
      - run: echo "Hello, ${{ inputs.name }}!"
```

#### `github`

GitHub Actions에서 EAS Workflows로 마이그레이션하기 쉽게 하기 위해 유용할 수 있는 몇 가지 context field를 제공합니다.

```ts
type GitHubContext = {
  triggering_actor?: string;
  event_name: 'pull_request' | 'push' | 'schedule' | 'workflow_dispatch';
  sha: string;
  ref: string; // e.g. refs/heads/main
  ref_name: string; // e.g. main
  ref_type: 'branch' | 'tag' | 'other';
  commit_message?: string; // Only available for push and schedule events
  label?: string;
  repository?: string;
  repository_owner?: string;
  event?: {
    label?: {
      name: string;
    };
    // Only available for push and schedule events
    head_commit?: {
      message: string;
      id: string;
    };
    pull_request?: {
      number: number;
      title: string;
      body: string | null;
      state: 'open' | 'closed';
      draft: boolean;
      merged: boolean | null;
      // ... Other fields from the GitHub Pull Request webhook payload
    };
    number?: number;
    schedule?: string;
    inputs?: Record<string, string | number | boolean>;
  };
};
```

> `event` 객체에는 전체 [GitHub webhook payload](https://docs.github.com/en/webhooks/webhook-events-and-payloads)가 들어 있습니다. `pull_request` event의 경우 `event.pull_request`에는 GitHub의 Pull Request webhook payload에 있는 모든 field가 포함됩니다. 위에는 자주 사용하는 field만 나와 있지만 `user`, `labels`, `milestone` 같은 추가 field도 사용할 수 있습니다.

workflow 실행이 `eas workflow:run`에서 시작되면 `event_name`은 `workflow_dispatch`가 되며 나머지 property는 모두 비어 있습니다.

예:

```yaml
jobs:
  build_ios:
    type: build
    if: ${{ github.ref_name == 'main' }}
    params:
      platform: ios
      profile: production
```

[${{ github }} context](https://github.com/expo/eas-build/blob/main/packages/eas-build-job/src/common.ts) — `${{ github }}` 정의 source code 보기.

#### `workflow`

현재 workflow에 대한 정보입니다.

```ts
type WorkflowContext = {
  id: string;
  name: string;
  filename: string;
  url: string;
};
```

예:

```yaml
jobs:
  notify_slack:
    after: [...]
    type: slack
    params:
      message: |
        Workflow run completed: ${{ workflow.name }}
        View details: ${{ workflow.url }}
```

#### `env`

현재 job context에서 사용할 수 있는 environment variable의 record입니다.

> **Note:** `env` context는 workflow 레벨이 아니라 job context 안에서만 사용할 수 있습니다.

예:

```yaml
jobs:
  my_job:
    steps:
      - run: echo "API URL: ${{ env.API_URL }}"
```

### Context functions

다음 function을 interpolation context에서 사용할 수 있습니다:

#### `success()`

이전 job이 모두 성공했는지 반환합니다.

```yaml
jobs:
  notify:
    if: ${{ success() }}
    steps:
      - run: echo "All jobs succeeded"
```

#### `failure()`

이전 job 중 하나라도 실패했는지 반환합니다.

```yaml
jobs:
  notify:
    if: ${{ failure() }}
    steps:
      - run: echo "A job failed"
```

#### `fromJSON(value)`

JSON 문자열을 파싱합니다. `JSON.parse()`와 동일합니다.

예:

```yaml
jobs:
  publish_update:
    type: update

  print_debug_info:
    needs: [publish_update]
    steps:
      - run: |
          echo "First update group: ${{ needs.publish_update.outputs.first_update_group_id }}"
          echo "Second update group: ${{ fromJSON(needs.publish_update.outputs.updates_json || '[]')[1].group }}"
```

#### `toJSON(value)`

값을 JSON 문자열로 변환합니다. `JSON.stringify()`와 동일합니다.

예:

```yaml
jobs:
  my_job:
    steps:
      - run: echo '${{ toJSON(github.event) }}'
```

#### `contains(value, substring)`

`value`에 `substring`이 포함되어 있는지 확인합니다.

예:

```yaml
jobs:
  my_job:
    if: ${{ contains(github.ref_name, 'feature') }}
    steps:
      - run: echo "Feature branch"
```

#### `startsWith(value, prefix)`

`value`가 `prefix`로 시작하는지 확인합니다.

예:

```yaml
jobs:
  my_job:
    if: ${{ startsWith(github.ref_name, 'release') }}
    steps:
      - run: echo "Release branch"
```

#### `endsWith(value, suffix)`

`value`가 `suffix`로 끝나는지 확인합니다.

예:

```yaml
jobs:
  my_job:
    if: ${{ endsWith(github.ref_name, '-production') }}
    steps:
      - run: echo "Production branch"
```

#### `hashFiles(...globs)`

제공한 glob pattern과 일치하는 파일의 hash를 반환합니다. cache key에 유용합니다.

> **Note:** `hashFiles` function은 workflow 레벨이 아니라 job의 step 안에서만 사용할 수 있습니다.

예:

```yaml
jobs:
  my_job:
    steps:
      - run: echo "Dependencies hash: ${{ hashFiles('package-lock.json', 'yarn.lock') }}"
```

#### `replaceAll(input, stringToReplace, replacementString)`

`input`에서 `stringToReplace`의 모든 항목을 `replacementString`으로 바꿉니다.

예:

```yaml
jobs:
  my_job:
    steps:
      - run: echo "${{ replaceAll(github.ref_name, '/', '-') }}"
```

#### `substring(input, start, end)`

`input`에서 `start`부터 `end`까지의 substring을 추출합니다. `end`를 제공하지 않으면 `start`부터 `input` 끝까지 추출합니다. 내부적으로 [`String#substring`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring)을 사용합니다.

예:

```yaml
jobs:
  my_job:
    steps:
      - run: echo "${{ substring(github.ref_name, 0, 50) }}"
```

## Pre-packaged jobs

### `jobs.<job_id>.type`

실행할 pre-packaged job의 type을 지정합니다. pre-packaged job은 workflow 상세 페이지에서 job type에 맞는 전용 UI를 제공합니다.

```yaml
jobs:
  my_job:
    type: build
```

아래에서 다양한 pre-packaged job을 알아보세요.

#### `build`

[EAS Build](/build/introduction)를 사용해 프로젝트의 Android 또는 iOS build를 만듭니다. 자세한 정보와 예시는 [Build job 문서](/eas/workflows/pre-packaged-jobs#build)를 참고하세요.

```yaml
jobs:
  my_job:
    type: build
    params:
      platform: ios | android # required
      profile: string # optional, default: production
      message: string # optional
```

이 job은 다음 property를 output으로 제공합니다:

```json
{
  "build_id": string,
  "app_build_version": string | null,
  "app_identifier": string | null,
  "app_version": string | null,
  "channel": string | null,
  "distribution": "internal" | "store" | null,
  "fingerprint_hash": string | null,
  "git_commit_hash": string | null,
  "platform": "ios" | "android" | null,
  "profile": string | null,
  "runtime_version": string | null,
  "sdk_version": string | null,
  "simulator": "true" | "false" | null
}
```

#### `deploy`

[EAS Hosting](/eas/hosting/introduction)을 사용해 애플리케이션을 배포합니다. 자세한 정보와 예시는 [Deploy job 문서](/eas/workflows/pre-packaged-jobs#deploy)를 참고하세요.

```yaml
jobs:
  my_job:
    type: deploy
    params:
      alias: string # optional
      prod: boolean # optional
```

이 job은 다음 property를 output으로 제공합니다:

```json
{
  "deploy_json": string, // JSON object containing the deployment details (output of `npx eas-cli deploy --json`).
  "deploy_url": string, // URL to the deployment. It uses production URL if this was a production deployment. Otherwise, it uses the first alias URL or the deployment URL.
  "deploy_alias_url": string, // Alias URL to the deployment (for example, `https://account-project--alias.expo.app`).
  "deploy_deployment_url": string, // Unique URL to the deployment (for example, `https://account-project--uniqueid.expo.app`).
  "deploy_identifier": string, // Identifier of the deployment.
  "deploy_dashboard_url": string, // URL to the deployment dashboard (for example, `https://expo.dev/projects/[project]/hosting/deployments`).
}
```

#### `fingerprint`

프로젝트의 fingerprint를 계산합니다. 자세한 정보와 예시는 [Fingerprint job 문서](/eas/workflows/pre-packaged-jobs#fingerprint)를 참고하세요.

```yaml
jobs:
  my_job:
    type: fingerprint
    environment: production # Should match your build profile
```

이 job은 다음 property를 output으로 제공합니다:

```json
{
  "android_fingerprint_hash": string,
  "ios_fingerprint_hash": string,
}
```

> **Note:** fingerprint를 정확히 일치시키려면 fingerprint job의 `environment`가 build profile과 같아야 합니다. job 간 일관성을 높이려면 `env`보다 [EAS environment variables](/eas/environment-variables) 사용을 고려하세요.

#### `get-build`

제공한 parameter와 일치하는 기존 build를 EAS에서 가져옵니다. 자세한 정보와 예시는 [Get Build job 문서](/eas/workflows/pre-packaged-jobs#get-build)를 참고하세요.

```yaml
jobs:
  my_job:
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

이 job은 다음 property를 output으로 제공합니다:

```json
{
  "build_id": string,
  "app_build_version": string | null,
  "app_identifier": string | null,
  "app_version": string | null,
  "channel": string | null,
  "distribution": "internal" | "store" | null,
  "fingerprint_hash": string | null,
  "git_commit_hash": string | null,
  "platform": "ios" | "android" | null,
  "profile": string | null,
  "runtime_version": string | null,
  "sdk_version": string | null,
  "simulator": "true" | "false" | null
}
```

#### `submit`

[EAS Submit](/submit/introduction)을 사용해 Android 또는 iOS build를 app store에 제출합니다. 자세한 정보와 예시는 [Submit job 문서](/eas/workflows/pre-packaged-jobs#submit)를 참고하세요.

```yaml
jobs:
  my_job:
    type: submit
    params:
      build_id: string # required
      profile: string # optional, default: production
      groups: string[] # optional
```

이 job은 다음 property를 output으로 제공합니다:

```json
{
  "apple_app_id": string | null, // Apple App ID. https://expo.fyi/asc-app-id
  "ios_bundle_identifier": string | null, // iOS bundle identifier of the submitted build. https://expo.fyi/bundle-identifier
  "android_package_id": string | null // Submitted Android package ID. https://expo.fyi/android-package
}
```

#### `testflight`

iOS build를 TestFlight internal 및 external testing group에 배포합니다. 자세한 정보와 예시는 [TestFlight job 문서](/eas/workflows/pre-packaged-jobs#testflight)를 참고하세요.

```yaml
jobs:
  my_job:
    type: testflight
    params:
      build_id: string # required
      profile: string # optional, default: production
      internal_groups: string[] # optional
      external_groups: string[] # optional
      changelog: string # optional
      submit_beta_review: boolean # optional
      wait_processing_timeout_seconds: number # optional, default: 1800 (30 minutes)
```

이 job은 다음 property를 output으로 제공합니다:

```json
{
  "apple_app_id": string | null, // Apple App ID. https://expo.fyi/asc-app-id
  "ios_bundle_identifier": string | null // iOS bundle identifier of the submitted build. https://expo.fyi/bundle-identifier
}
```

#### `update`

[EAS Update](/eas-update/introduction)를 사용해 update를 publish합니다. 자세한 정보와 예시는 [Update job 문서](/eas/workflows/pre-packaged-jobs#update)를 참고하세요.

```yaml
jobs:
  my_job:
    type: update
    params:
      message: string # optional
      platform: string # optional - android | ios | all, defaults to all
      branch: string # optional
      channel: string # optional - cannot be used with branch
      private_key_path: string # optional
      upload_sentry_sourcemaps: boolean # optional - defaults to "try uploading, but don't fail the job if it fails"
```

이 job은 다음 property를 output으로 제공합니다:

```json
{
  "first_update_group_id": string, // ID of the first update group. You can use it to e.g. construct the update URL for a development client deep link.
  "updates_json": string // Stringified JSON array of update groups. Output of `eas update --json`.
}
```

#### `maestro`

build에서 [Maestro](https://maestro.dev/) 테스트를 실행합니다. 자세한 정보와 예시는 [Maestro job 문서](/eas/workflows/pre-packaged-jobs#maestro)를 참고하세요.

> Maestro 테스트는 [alpha](/more/release-statuses#alpha) 상태입니다.

```yaml
jobs:
  my_job:
    type: maestro
    environment: production | preview | development # optional, defaults to preview
    image: string # optional. See https://docs.expo.dev/eas/workflows/syntax/#jobsjob_idruns_on  for a list of available images.
    params:
      build_id: string # required
      flow_path: string | string[] # required
      shards: number # optional, defaults to 1
      retries: number # optional, defaults to 1
      record_screen: boolean # optional, defaults to false. If true, uploads a screen recording of the tests.
      include_tags: string | string[] # optional. Tags to include in the tests. Will be passed to Maestro as `--include-tags`.
      exclude_tags: string | string[] # optional. Tags to exclude from the tests. Will be passed to Maestro as `--exclude-tags`.
      maestro_version: string # optional. Version of Maestro to use for the tests. If not provided, the latest version will be used.
      android_system_image_package: string # optional. Android emulator system image package to use.
      device_identifier: string | { android?: string, ios?: string } # optional. Device identifier to use for the tests.
      output_format?: string # optional. Maestro test report format. Will be passed to Maestro as `--format`. Can be `junit` or other supported formats.
```

#### `maestro-cloud`

[Maestro](https://maestro.dev/) 테스트를 [Maestro Cloud](https://docs.maestro.dev/cloud/run-maestro-tests-in-the-cloud)에서 build에 대해 실행합니다. 자세한 정보와 예시는 [Maestro Cloud job 문서](/eas/workflows/pre-packaged-jobs#maestro-cloud)를 참고하세요.

> Maestro Cloud에서 테스트를 실행하려면 Maestro Cloud account와 Cloud Plan 구독이 필요합니다. 자세한 내용은 [Maestro docs](https://docs.maestro.dev/cloud/run-maestro-tests-in-the-cloud)를 참고하세요.

```yaml
jobs:
  my_job:
    type: maestro-cloud
    environment: production | preview | development # optional, defaults to preview
    image: string # optional. See https://docs.expo.dev/eas/workflows/syntax/#jobsjob_idruns_on  for a list of available images.
    params:
      build_id: string # required. ID of the build to test.
      maestro_project_id: string # required. Maestro Cloud project ID. Example: `proj_01jw6hxgmdffrbye9fqn0pyzm0`.
      flows: string # required. Path to the Maestro flow file or directory containing the flows to run. Corresponds to `--flows` param to `maestro cloud`.
      maestro_api_key: string # optional. The API key to use for the Maestro project. By default, `MAESTRO_CLOUD_API_KEY` environment variable will be used. Corresponds to `--api-key` param to `maestro cloud`.
      include_tags: string | string[] # optional. Tags to include in the tests. Will be passed to Maestro as `--include-tags`.
      exclude_tags: string | string[] # optional. Tags to exclude from the tests. Will be passed to Maestro as `--exclude-tags`.
      maestro_version: string # optional. Version of Maestro to use for the tests. If not provided, the latest version will be used.
      android_api_level: string # optional. Android API level to use for the tests. Will be passed to Maestro as `--android-api-level`.
      maestro_config: string # optional. Path to the Maestro `config.yaml` file to use for the tests. Will be passed to Maestro as `--config`.
      device_locale: string # optional. Device locale to use for the tests. Will be passed to Maestro as `--device-locale`. Run `maestro cloud --help` for a list of supported values.
      device_model: string # optional. Model of the device to use for the tests. Will be passed to Maestro as `--device-model`. Run `maestro cloud --help` for a list of supported values.
      device_os: string # optional. OS of the device to use for the tests. Will be passed to Maestro as `--device-os`. Run `maestro cloud --help` for a list of supported values.
      name: string # optional. Name for the Maestro Cloud upload. Corresponds to `--name` param to `maestro cloud`.
      branch: string # optional. Override for the branch the Maestro Cloud upload originated from. By default, if the workflow run has been triggered from GitHub, the branch of the workflow run will be used. Corresponds to `--branch` param to `maestro cloud`.
      async: boolean # optional. Run the Maestro Cloud tests asynchronously. If true, the status of the job will only denote whether the upload was successful, *not* whether the tests succeeded. Corresponds to `--async` param to `maestro cloud`.
```

#### `slack`

webhook URL을 사용해 Slack channel에 메시지를 보냅니다. 자세한 정보와 예시는 [Slack job 문서](/eas/workflows/pre-packaged-jobs#slack)를 참고하세요.

```yaml
jobs:
  my_job:
    type: slack
    params:
      webhook_url: string # required
      message: string # required if payload is not provided
      payload: object # required if message is not provided
```

#### `github-comment`

workflow에서 완료된 build, update, deployment에 대한 종합 report 또는 사용자가 제공한 content를 GitHub pull request에 자동으로 게시합니다. 자세한 정보와 예시는 [GitHub Comment job 문서](/eas/workflows/pre-packaged-jobs#github-comment)를 참고하세요.

```yaml
jobs:
  my_job:
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

이 job은 다음 property를 output으로 제공합니다:

```json
{
  "comment_url": string | undefined  // URL of the posted GitHub comment
}
```

#### `require-approval`

workflow를 계속 진행하기 전에 사용자의 승인을 요구합니다. 사용자는 approve 또는 reject할 수 있으며, 이는 각각 job의 success 또는 failure로 변환됩니다. 자세한 정보와 예시는 [Require Approval job 문서](/eas/workflows/pre-packaged-jobs#require-approval)를 참고하세요.

```yaml
jobs:
  confirm:
    type: require-approval
```

#### `doc`

workflow log에 Markdown section을 표시합니다. 자세한 정보와 예시는 [Doc job 문서](/eas/workflows/pre-packaged-jobs#doc)를 참고하세요.

```yaml
jobs:
  next_steps:
    type: doc
    params:
      md: string
```

#### `repack`

기존 build에서 앱을 다시 패키징합니다. 이 job은 전체 native rebuild를 수행하지 않고 앱의 metadata와 JavaScript bundle을 다시 패키징하므로, 특정 fingerprint와 호환되는 더 빠른 build를 만드는 데 유용합니다. 자세한 정보와 예시는 [Repack job 문서](/eas/workflows/pre-packaged-jobs#repack)를 참고하세요.

```yaml
jobs:
  next_steps:
    type: repack
    params:
      build_id: string # required
      profile: string # optional
      embed_bundle_assets: boolean # optional
      message: string # optional
      repack_version: string # optional
```

## Custom jobs

custom code를 실행하며 built-in EAS function을 사용할 수 있습니다. `type` field는 필요하지 않습니다.

```yaml
jobs:
  my_job:
    steps:
      # ...
```

### `jobs.<job_id>.steps`

job은 `steps`라고 부르는 task의 순서로 구성됩니다. step은 명령을 실행할 수 있습니다. `steps`는 custom job과 `build` job에서만 제공할 수 있습니다.

```yaml
jobs:
  my_job:
    steps:
      - name: My first step
        run: echo "Hello World"
```

### `jobs.<job_id>.outputs`

job이 정의하는 output 목록입니다. 이 output은 이 job에 의존하는 모든 downstream job에서 접근할 수 있습니다. output을 설정하려면 job step 안에서 [`set-output`](/eas/workflows/syntax#set-output) function을 사용하세요.

Downstream job은 [interpolation context](/eas/workflows/syntax#interpolation) 안에서 다음 표현식으로 이 output에 접근할 수 있습니다:

-   `needs.<job_id>.outputs.<output_name>`
-   `after.<job_id>.outputs.<output_name>`

여기서 `<job_id>`는 upstream job의 식별자이고, `<output_name>`은 접근하려는 특정 output 변수입니다.

아래 예시에서는 `set-output` function이 `job_1`의 `step_1` step에서 `test`라는 이름의 output을 `hello world` 값으로 설정합니다. 이후 `job_2`에서는 `step_2`에서 `needs.job_1.outputs.output_1`로 그 값을 사용합니다.

```yaml
jobs:
  job_1:
    outputs:
      output_1: ${{ steps.step_1.outputs.test }}
    steps:
      - id: step_1
        run: set-output test "hello world"
  job_2:
    needs: [job_1]
    steps:
      - id: step_2
        run: echo ${{ needs.job_1.outputs.output_1 }}
```

### `jobs.<job_id>.image`

job에 사용할 VM image를 지정합니다. 사용 가능한 image는 [Infrastructure](/build-reference/infrastructure)를 참고하세요.

```yaml
jobs:
  my_job:
    image: auto | string # optional, defaults to 'auto'
```

### `jobs.<job_id>.runs_on`

job을 실행할 worker를 지정합니다. custom job에서만 사용할 수 있습니다.

```yaml
jobs:
  my_job:
    runs_on: linux-medium | linux-large |
      linux-medium-nested-virtualization |
      linux-large-nested-virtualization |
      macos-medium | macos-large # optional, defaults to linux-medium
```

| Worker | vCPU | Memory (GiB RAM) | SSD (GiB) | Notes |
| --- | --- | --- | --- | --- |
| linux-medium | 4 | 16 | 14 | 기본 worker입니다. |
| linux-large | 8 | 32 | 28 |  |
| linux-medium-nested-virtualization | 4 | 16 | 14 | Android Emulator 실행을 허용합니다. |
| linux-large-nested-virtualization | 4 | 32 | 28 | Android Emulator 실행을 허용합니다. |

| Worker | Efficiency cores | Unified memory (GiB RAM) | SSD (GiB) | Notes |
| --- | --- | --- | --- | --- |
| macos-medium | 5 | 20 | 125 | simulator를 포함한 iOS job을 실행합니다. |
| macos-large | 10 | 40 | 125 | simulator를 포함한 iOS job을 실행합니다. |

> **Note:** Android Emulator job에는 반드시 `linux-*-nested-virtualization` worker를 사용해야 합니다. iOS build와 iOS Simulator job에는 반드시 `macos-*` worker를 사용해야 합니다.

### `jobs.<job_id>.steps.<step>.id`

`id` property는 job 안에서 step을 참조할 때 사용합니다. downstream job에서 step의 output을 사용할 때 유용합니다.

```yaml
jobs:
  my_job:
    outputs:
      test: ${{ steps.step_1.outputs.test }} # References the output from step_1
    steps:
      - id: step_1
        run: set-output test "hello world"
```

### `jobs.<job_id>.steps.<step>.name`

job log에 표시되는 step의 사람이 읽기 쉬운 이름입니다. step의 이름을 제공하지 않으면 `run` 명령이 step 이름으로 사용됩니다.

```yaml
jobs:
  my_job:
    steps:
      - name: My first step
        run: echo "Hello World"
```

### `jobs.<job_id>.steps.<step>.run`

step에서 실행할 shell 명령입니다.

```yaml
jobs:
  my_job:
    steps:
      - run: echo "Hello World"
```

### `jobs.<job_id>.steps.<step>.shell`

명령 실행에 사용할 shell입니다. 기본값은 `bash`입니다.

```yaml
jobs:
  my_job:
    steps:
      - run: echo "Hello World"
        shell: bash
```

### `jobs.<job_id>.steps.<step>.working_directory`

명령을 실행할 디렉터리입니다. step 레벨에서 정의하면 job에도 정의된 `jobs.<job_id>.defaults.run.working_directory` 설정을 덮어씁니다.

```yaml
jobs:
  my_job:
    steps:
      - uses: eas/checkout
      - run: pwd # prints: /home/expo/workingdir/build/my-app
        working_directory: ./my-app
```

### `jobs.<job_id>.steps.<step>.uses`

EAS는 workflow step에서 사용할 수 있는 built-in reusable function 세트를 제공합니다. `uses` keyword는 사용할 function을 지정하는 데 쓰입니다. 모든 built-in function은 `eas/` 접두사로 시작합니다.

```yaml
jobs:
  my_job:
    steps:
      - uses: eas/checkout
      - uses: eas/install_node_modules
      - uses: eas/prebuild
      - name: List files
        run: ls -la
```

아래는 workflow step에서 사용할 수 있는 built-in function 목록입니다.

#### `eas/checkout`

프로젝트 source file을 checkout합니다.

```yaml
jobs:
  my_job:
    steps:
      - uses: eas/checkout
```

[eas/checkout source code](https://github.com/expo/eas-build/blob/main/packages/build-tools/src/steps/functions/checkout.ts) — GitHub에서 eas/checkout function의 source code 보기.

#### `eas/install_node_modules`

프로젝트를 기준으로 감지한 package manager(bun, npm, pnpm, Yarn)를 사용해 node_modules를 설치합니다. monorepo에서도 동작합니다.

```yaml
jobs:
  my_job:
    steps:
      - uses: eas/checkout
      - uses: eas/install_node_modules
```

[eas/install_node_modules source code](https://github.com/expo/eas-build/blob/main/packages/build-tools/src/steps/functions/installNodeModules.ts) — GitHub에서 eas/install_node_modules function의 source code 보기.

#### `eas/download_build`

지정한 build의 애플리케이션 archive를 다운로드합니다. 기본적으로 다운로드되는 artifact는 **.apk**, **.aab**, **.ipa**, **.app** 파일이거나, 이러한 파일 중 하나 이상이 들어 있는 **.tar.gz** archive일 수 있습니다. artifact가 **.tar.gz** archive이면 압축을 풀고 지정한 확장자와 일치하는 첫 번째 파일을 반환합니다. build에서 애플리케이션 archive를 생성하지 않았다면 step은 실패합니다.

```yaml
jobs:
  my_job:
    steps:
      - uses: eas/download_build
        with:
          build_id: string # Required. ID of the build to download.
          extensions: [apk, aab, ipa, app] # Optional. List of file extensions to look for. Defaults to ["apk", "aab", "ipa", "app"].
```

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `build_id` | string | Yes | – | 다운로드할 build의 ID입니다. 유효한 UUID여야 합니다. |
| `extensions` | string[] | No | `["apk", "aab", "ipa", "app"]` | 다운로드한 artifact 또는 archive에서 찾을 파일 확장자 목록입니다. |

**Outputs:**

-   `artifact_path`: 일치하는 애플리케이션 archive의 절대 경로입니다. 이 output은 workflow의 다른 step에 input으로 전달할 수 있습니다. 예를 들어 artifact를 업로드하거나 추가 처리할 때 사용할 수 있습니다.

사용 예시:

```yaml
jobs:
  build_ios:
    type: build
    params:
      platform: ios
      profile: production

  my_job:
    needs: [build_ios]
    steps:
      - uses: eas/download_build
        id: download_build
        with:
          build_id: ${{ needs.build_ios.outputs.build_id }}
      - name: Print artifact path
        run: |
          echo "Artifact path: ${{ steps.download_build.outputs.artifact_path }}"
```

[eas/download_build source code](https://github.com/expo/eas-build/blob/main/packages/build-tools/src/steps/functions/downloadBuild.ts) — GitHub에서 eas/download_build function의 source code 보기.

#### `eas/prebuild`

프로젝트를 기준으로 감지한 package manager(bun, npm, pnpm, Yarn)를 사용해 `expo prebuild` 명령을 실행합니다. build type과 build environment에 가장 적합한 명령을 사용합니다.

```yaml
jobs:
  my_job:
    steps:
      - uses: eas/checkout
      - uses: eas/install_node_modules
      - uses: eas/prebuild
```

```yaml
jobs:
  my_job:
    steps:
      - uses: eas/checkout
      - uses: eas/install_node_modules
      - uses: eas/resolve_apple_team_id_from_credentials
        id: resolve_apple_team_id_from_credentials
      - uses: eas/prebuild
        with:
          clean: false
          apple_team_id: ${{ steps.resolve_apple_team_id_from_credentials.outputs.apple_team_id }}
```

| Property | Type | Description |
| --- | --- | --- |
| `clean` | `boolean` | 명령 실행 시 `--clean` 플래그를 사용할지 정의하는 선택 속성입니다. 기본값은 false입니다. |
| `apple_team_id` | `string` | prebuild 시 사용할 Apple team ID를 정의하는 선택 속성입니다. credentials를 사용하는 iOS build에 지정해야 합니다. |

[eas/prebuild source code](https://github.com/expo/eas-build/blob/main/packages/build-tools/src/steps/functions/prebuild.ts) — GitHub에서 eas/prebuild function의 source code 보기.

#### `eas/restore_cache`

지정한 key로 이전에 저장한 cache를 복원합니다. 컴파일된 dependency, build tool, 기타 중간 build output 같은 cached artifact를 재사용해 build 속도를 높일 때 유용합니다.

```yaml
jobs:
  my_job:
    steps:
      - uses: eas/checkout
      - uses: eas/install_node_modules
      - uses: eas/prebuild
      - uses: eas/restore_cache
        with:
          key: cache-${{ hashFiles('package-lock.json') }}
          restore_keys: cache
          path: /path/to/cache
```

```yaml
jobs:
  my_job:
    steps:
      - uses: eas/checkout
      - uses: eas/install_node_modules
      - uses: eas/prebuild
      - uses: eas/restore_cache
        with:
          key: cache-${{ hashFiles('package-lock.json') }}
          path: /path/to/cache
```

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `key` | `string` | Yes | 복원할 cache key입니다. `${{ hashFiles('package-lock.json') }}` 같은 표현식을 사용해 파일 hash에 기반한 동적 key를 만들 수 있습니다. |
| `restore_keys` | `string` | No | 정확한 key를 찾지 못했을 때 사용할 fallback key 또는 prefix입니다. 제공하면 cache system이 이 prefix로 시작하는 cache entry를 찾습니다. |
| `path` | `string` | Yes | cache를 복원할 path입니다. cache를 저장할 때 사용한 path와 일치해야 합니다. |

[eas/restore_cache source code](https://github.com/expo/eas-build/blob/main/packages/build-tools/src/steps/functions/restoreCache.ts) — GitHub에서 eas/restore_cache function의 source code 보기.

#### `eas/save_cache`

지정한 key로 cache를 저장합니다. 이를 통해 build artifact, 컴파일된 dependency, 기타 중간 output을 보존했다가 이후 build에서 재사용해 build 속도를 높일 수 있습니다.

```yaml
jobs:
  my_job:
    steps:
      - uses: eas/checkout
      - uses: eas/install_node_modules
      - uses: eas/prebuild
      - uses: eas/restore_cache
        with:
          key: cache-${{ hashFiles('package-lock.json') }}
          path: /path/to/cache
      - name: Build Android app
        run: cd android && ./gradlew assembleRelease
      - uses: eas/save_cache
        with:
          key: cache-${{ hashFiles('package-lock.json') }}
          path: /path/to/cache
```

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `key` | `string` | Yes | cache를 저장할 cache key입니다. `${{ hashFiles('package-lock.json') }}` 같은 표현식을 사용해 파일 hash 기반의 동적 key를 만들 수 있습니다. cache를 복원할 때 사용한 key와 일치해야 합니다. |
| `path` | `string` | Yes | cache할 디렉터리 또는 파일의 path입니다. cache를 복원할 때 사용한 path와 일치해야 합니다. |

[eas/save_cache source code](https://github.com/expo/eas-build/blob/main/packages/build-tools/src/steps/functions/saveCache.ts) — GitHub에서 eas/save_cache function의 source code 보기.

#### `eas/send_slack_message`

구성된 [Slack webhook URL](https://api.slack.com/messaging/webhooks)로 지정한 메시지를 보내고, 해당 Slack channel에 게시합니다. 메시지는 plaintext 또는 [Slack Block Kit](https://api.slack.com/block-kit) 메시지로 지정할 수 있습니다.

두 경우 모두 동적으로 평가하기 위해 메시지 안에서 build job property를 참조하거나 [다른 step output](/eas/workflows/syntax#jobsjob_idoutputs)을 사용할 수 있습니다. 예: `Build URL: https://expo.dev/builds/${{ needs.build_ios.outputs.build_id }}`, `Build finished with status: ${{ after.build_android.status }}`.

`message` 또는 `payload` 중 하나만 지정해야 하며 둘 다 지정할 수는 없습니다.

```yaml
jobs:
  my_job:
    steps:
      - uses: eas/send_slack_message
        with:
          message: 'This is a message to plain input URL'
          slack_hook_url: 'https://hooks.slack.com/services/[rest_of_hook_url]'
```

| Property | Type | Description |
| --- | --- | --- |
| `message` | `string` | 보낼 메시지의 텍스트입니다. 예: `'This is the content of the message'`. **Note:** `message` 또는 `payload` 중 하나는 반드시 제공해야 하지만 둘 다 제공할 수는 없습니다. |
| `payload` | `json` | [Slack Block Kit](https://api.slack.com/block-kit) layout으로 정의한 메시지 content입니다. **Note:** `message` 또는 `payload` 중 하나는 반드시 제공해야 하지만 둘 다 제공할 수는 없습니다. |
| `slack_hook_url` | `string` | 이전에 구성한 Slack webhook URL입니다. 이 URL은 지정한 channel에 메시지를 게시합니다. `slack_hook_url: 'https://hooks.slack.com/services/[rest_of_hook_url]'`처럼 plain URL을 제공하거나, `slack_hook_url: ${{ env.ANOTHER_SLACK_HOOK_URL }}`처럼 [EAS Environment Variables](/eas/environment-variables#managing-environment-variables)를 사용하거나, 기본 webhook URL로 동작하는 `SLACK_HOOK_URL` Environment Variable을 설정할 수 있습니다. 이 마지막 경우에는 `slack_hook_url` property를 제공할 필요가 없습니다. |

[eas/send_slack_message source code](https://github.com/expo/eas-build/blob/main/packages/build-tools/src/steps/functions/sendSlackMessage.ts) — GitHub에서 eas/send_slack_message function의 source code 보기.

#### `eas/use_npm_token`

npm 또는 private registry에 publish된 private package와 함께 사용할 수 있도록 Node package manager(bun, npm, pnpm, Yarn)를 구성합니다.

프로젝트 secret에 `NPM_TOKEN`을 설정하면 이 function이 **.npmrc**를 생성해 token을 사용하도록 build environment를 구성합니다.

```yaml
jobs:
  my_job:
    name: Install private npm modules
    steps:
      - uses: eas/checkout
      - uses: eas/use_npm_token
      - name: Install dependencies
        run: npm install # <---- Can now install private packages
```

[eas/use_npm_token source code](https://github.com/expo/eas-build/blob/main/packages/build-tools/src/steps/functions/useNpmToken.ts) — GitHub에서 eas/use_npm_token function의 source code 보기.

#### `eas/download_artifact`

artifact의 ID 또는 name을 사용해 EAS에서 artifact를 다운로드합니다. 이전 job의 artifact를 다른 서비스로 전달할 때 유용합니다.

```yaml
jobs:
  my_job:
    steps:
      - uses: eas/download_artifact
        with:
          name: string # Required if artifact_id is not provided. Name of the artifact to download.
          artifact_id: string # Required if artifact_name is not provided. ID of the artifact to download.
```

##### Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | No | 다운로드할 artifact의 이름입니다. `artifact_id`를 제공하지 않으면 필수입니다. |
| `artifact_id` | string | No | 다운로드할 artifact의 ID입니다. `name`을 제공하지 않으면 필수입니다. |

##### Outputs

| Property | Type | Description |
| --- | --- | --- |
| `artifact_path` | string | 다운로드한 artifact의 path입니다. 이 output은 workflow의 다른 step에 input으로 전달할 수 있습니다. 예를 들어 artifact를 보내거나 처리할 때 사용할 수 있습니다. |

##### Example

```yaml
jobs:
  maestro_tests:
    type: maestro
    params:
      build_id: '123-abc'
      flow_path: 'path/to/flow.yaml'
      output_format: 'junit'
  my_job:
    needs: [maestro_tests]
    steps:
      - uses: eas/download_artifact
        id: download_artifact
        with:
          name: 'iOS Maestro Test Report (junit)'
      - name: Print Maestro output
        run: echo ${{ steps.download_artifact.outputs.artifact_path }}
```

[eas/download_artifact source code](https://github.com/expo/eas-build/blob/main/packages/build-tools/src/steps/functions/downloadArtifact.ts) — GitHub에서 eas/download_artifact function의 source code 보기.

## Built-in shell functions

EAS Workflows는 workflow step 안에서 variable output을 설정할 때 사용할 수 있는 다음 shell function을 제공합니다.

### `set-output`

workflow의 다른 step이나 다른 job에서 접근할 수 있는 output 변수를 설정합니다.

```bash
set-output <name> <value>
```

다른 step과 변수를 공유하는 사용 예시:

```yaml
jobs:
  my_job:
    steps:
      - id: step_1
        run: set-output variable_1 "Variable 1"
      - id: step_2
        run: echo ${{ steps.step_1.outputs.variable_1 }} # prints: Variable 1
```

다른 job과 변수를 공유하는 사용 예시:

```yaml
jobs:
  job_1:
    outputs:
      variable_1: ${{ steps.step_1.outputs.variable_1 }}
    steps:
      - id: step_1
        run: set-output variable_1 "Variable 1"
  job_2:
    needs: [job_1]
    steps:
      - run: echo ${{ needs.job_1.outputs.variable_1 }} # prints: Variable 1
```

### `set-env`

같은 job 안의 이후 step에서 사용할 수 있는 environment variable을 설정합니다. 한 step의 명령 안에서 `export`로 내보낸 environment variable은 다른 step에 자동으로 노출되지 않습니다. 다른 step과 environment variable을 공유하려면 `set-env` executable을 사용하세요.

```bash
set-env <name> <value>
```

`set-env`는 environment variable의 이름과 값을 인수 두 개로 받아야 합니다. 예를 들어 `set-env NPM_TOKEN "abcdef"`를 호출하면 이후 step에서 값이 `abcdef`인 `$NPM_TOKEN` 변수를 사용할 수 있습니다.

> **Note:** `set-env`로 공유한 변수는 현재 step에 자동으로 export되지 않습니다. 현재 step에서 이 변수를 사용하려면 직접 `export`를 호출해야 합니다.

다른 step과 environment variable을 공유하는 사용 예시:

```yaml
jobs:
  my_job:
    steps:
      - name: Set environment variables
        run: |
          # Using export only makes it available in the current step
          export LOCAL_VAR="only in this step"

          # Using set-env makes it available in subsequent steps
          set-env SHARED_VAR "available in next steps"

          # SHARED_VAR is not yet available in current step's environment
          echo "LOCAL_VAR: $LOCAL_VAR"     # prints: only in this step
          echo "SHARED_VAR: $SHARED_VAR"   # prints: (empty)
      - name: Use shared variable
        run: |
          # SHARED_VAR is now available
          # @info #
          echo "SHARED_VAR: $SHARED_VAR"   # prints: available in next steps
          # @end #
```

#### Sharing environment variables between jobs

`set-env` function은 같은 job 안의 다른 step에만 environment variable을 공유합니다. 서로 다른 job 사이에서 값을 공유하려면 job의 [`outputs`](/eas/workflows/syntax#jobsjob_idoutputs)와 `set-output`을 사용하고, 받는 job의 [`env`](/eas/workflows/syntax#jobsjob_idenv) property를 통해 전달하세요:

```yaml
jobs:
  job_1:
    outputs:
      my_value: ${{ steps.step_1.outputs.my_value }}
    steps:
      - id: step_1
        run: set-output my_value "value from job_1"

  job_2:
    needs: [job_1]
    env:
      MY_VALUE: ${{ needs.job_1.outputs.my_value }}
    steps:
      - run: echo "MY_VALUE: $MY_VALUE"  # prints: value from job_1
```
