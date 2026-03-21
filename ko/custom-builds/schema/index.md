---
modificationDate: January 23, 2026
title: Custom build 구성 스키마
description: EAS Build의 custom build용 구성 옵션 레퍼런스입니다.
---

# Custom build 구성 스키마

EAS Build의 custom build용 구성 옵션 레퍼런스입니다.

EAS Build용 custom build를 만들면 프로젝트의 build 프로세스를 사용자 지정하는 데 도움이 됩니다.

## custom build를 위한 YAML 문법

custom build config 파일은 **.eas/build** 디렉터리 경로 안에 저장됩니다. YAML 문법을 사용하며 파일 확장자는 `.yml` 또는 `.yaml`이어야 합니다. YAML이 처음이거나 문법을 더 배우고 싶다면 [Learn YAML in Y minutes](https://learnxinyminutes.com/docs/yaml/)를 참고하세요.

## `build`

custom build 구성을 설명하기 위해 정의합니다. custom build를 만들기 위한 모든 config 옵션은 이 아래에 지정합니다.

### `name`

build 로그에서 custom build를 식별하는 데 사용하는 custom build의 이름입니다. EAS Build는 이 속성을 사용해 대시보드에 build 이름을 표시합니다.

예를 들어 build 이름이 `Run tests`인 경우입니다:

```yaml
build:
  name: Run tests
  steps:
    - eas/checkout
    - run:
        name: Install dependencies
        command: npm install
```

### `steps`

step은 명령 또는 함수 호출 형태의 작업 목록을 설명하는 데 사용됩니다. 이 작업들은 EAS Build에서 custom build가 실행될 때 수행됩니다. build config에는 하나 또는 여러 step을 정의할 수 있습니다. 하지만 build마다 최소 한 개의 step을 정의하는 것은 **필수**입니다.

각 step은 다음 속성으로 구성됩니다:

#### `steps[].run`

`run` 키는 일련의 지시를 실행하는 데 사용됩니다. 예를 들어 `run` 키를 사용해 `npm install` 명령으로 의존성을 설치할 수 있습니다:

```yaml
build:
  name: Install npm dependencies
  steps:
    - eas/checkout
    - run:
        name: Install dependencies
        command: npm install
```

`steps[].run`은 단일 또는 여러 줄의 shell 명령 실행에도 사용할 수 있습니다:

```yaml
build:
  name: Run inline shell commands
  steps:
    - run: echo "Hello world"
    - run: |
        echo "Multiline"
        echo "bash commands"
```

#### 단일 step 사용하기

예를 들어 다음 `steps`를 가진 build config는 "Hello world"를 출력합니다:

```yaml
build:
  name: Greeting
  steps:
    - run: echo "Hello world"
```

> **참고:** `run` 앞의 `-`는 들여쓰기로 간주됩니다.

#### 여러 step 사용하기

여러 `steps`가 정의되면 순차적으로 실행됩니다. 예를 들어 다음 `steps`를 가진 build config는 먼저 프로젝트를 checkout하고, npm 의존성을 설치한 다음, 테스트를 실행하는 명령을 수행합니다:

```yaml
build:
  name: Run tests
  steps:
    - eas/checkout
    - run:
        name: Install dependencies
        command: npm install
    - run:
        name: Run tests
        command: |
          echo "Running tests..."
          npm test
```

#### 다른 step과 environment variable 공유하기

한 step의 `command` 안에서 `export`로 내보낸 environment variable은 다른 step에 자동으로 노출되지 않습니다. 다른 step과 environment variable을 공유하려면 `set-env` 실행 파일을 사용하세요.

`set-env`는 environment variable 이름과 값을 두 개의 인자로 받아 호출되어야 합니다. 예를 들어 `set-env NPM_TOKEN "abcdef"`는 값이 `abcdef`인 `$NPM_TOKEN` 변수를 다른 step에 노출합니다.

> **참고:** `set-env`로 공유한 변수는 로컬에 자동으로 export되지 않습니다. 직접 `export`를 호출해야 합니다.

```yaml
build:
  name: Shared environment variable example
  steps:
    - run:
        name: Set environment variables
        command: |
          set -x

          # Set variable
          ENV_TEST_LOCAL="present-only-in-current-shell-context"
          # Set and export variable
          export ENV_TEST_LOCAL_EXPORT="present-in-current-step"
          # Set shared variable
          set-env ENV_TEST_SET_ENV "present-in-following-steps"

          # Will print "ENV_TEST_LOCAL: present-only-in-current-shell-context"
          # because current shell has access to this local variable.
          echo "ENV_TEST_LOCAL: $ENV_TEST_LOCAL"

          # Will print "ENV_TEST_LOCAL_EXPORT: present-in-current-step"
          # because export also sets the local variable value.
          echo "ENV_TEST_LOCAL_EXPORT: $ENV_TEST_LOCAL_EXPORT"

          # Will "ENV_TEST_SET_ENV: "
          # because set-env does not set or export variables.
          echo "ENV_TEST_SET_ENV: $ENV_TEST_SET_ENV"

          # Will only print LOCALLY_EXPORTED_ENV,
          # because it is the only export-ed variable.
          env | grep ENV_TEST_
    - run:
        name: Check variables values in next step
        command: |
          set -x

          # Will print "ENV_TEST_LOCAL: ", because ENV_TEST_LOCAL
          # is only a local variable in previous step.
          echo "ENV_TEST_LOCAL: $ENV_TEST_LOCAL"

          # Will print "ENV_TEST_LOCAL_EXPORT: "
          # because export does not share a variable to other steps.
          echo "ENV_TEST_LOCAL_EXPORT: $ENV_TEST_LOCAL_EXPORT"

          # Will print "ENV_TEST_SET_ENV: present-in-following-steps"
          # because set-env "exported" variable to other steps.
          echo "ENV_TEST_SET_ENV: $ENV_TEST_SET_ENV"

          # Will only print ENV_TEST_SET_ENV,
          # because set-env "exported" it to other steps.
          env | grep ENV_TEST_
```

#### `steps[].run.name`

build 로그에서 step 이름을 표시하는 데 사용하는 이름입니다.

#### `steps[].run.command`

`command`는 step이 실행될 때 수행할 custom shell 명령을 정의합니다. 각 step마다 명령을 정의하는 것은 **필수**입니다. 여러 줄의 shell 명령일 수도 있습니다:

```yaml
build:
  name: Run tests
  steps:
    - eas/checkout
    - run:
        name: Run tests
        command: |
          echo "Running tests..."
          npm test
```

#### `steps[].run.working_directory`

`working_directory`는 프로젝트의 root 디렉터리 기준으로 존재하는 디렉터리를 정의하는 데 사용됩니다. step에 존재하는 경로를 정의하면, 해당 step에서는 현재 디렉터리가 그 경로로 변경됩니다. 예를 들어 Expo 프로젝트 안의 **assets** 디렉터리에 있는 모든 asset을 나열하는 step을 만들고, `working_directory`를 `assets`로 설정할 수 있습니다:

```yaml
build:
  name: Demo
  steps:
    - eas/checkout
    - run:
        name: List assets
        working_directory: assets
        command: ls -la
```

#### `steps[].run.shell`

step의 기본 실행 shell을 정의하는 데 사용됩니다. 예를 들어 step의 shell을 `/bin/sh`로 설정할 수 있습니다:

```yaml
build:
  name: Demo
  steps:
    - run:
        shell: /bin/sh
        command: |
          echo "Steps can use another shell"
          ps -p $$
```

#### `steps[].run.inputs`

step에 입력값을 제공합니다. 예를 들어 `input`을 사용해 값을 제공할 수 있습니다:

```yaml
build:
  name: Demo
  steps:
    - run:
        name: Say Hi
        inputs:
          name: Expo
        command: echo "Hi, ${ inputs.name }!"
```

#### `steps[].run.outputs`

step 실행 중 output 값을 기대합니다. 예를 들어 어떤 step이 `Hello world`라는 output 값을 가질 수 있습니다:

```yaml
build:
  name: Demo
  steps:
    - run:
        name: Produce output
        outputs: [value]
        command: |
          echo "Producing output for another step"
          set-output value "Output from another step..."
```

#### `steps[].run.outputs.required`

output 값은 boolean으로 필수 여부를 나타낼 수 있습니다. 예를 들어 어떤 함수에 필수 output 값이 없는 경우입니다:

```yaml
build:
  name: Demo
  steps:
    - run:
        name: Produce another output
        id: id456
        outputs:
          - required_param
          - name: optional_param
            required: false
        command: |
          echo "Producing more output"
          set-output required_param "abc 123 456"
```

#### `steps[].run.id`

step에 `id`를 정의하면 다음이 가능해집니다:

-   하나 이상의 output을 생성하는 동일한 함수를 여러 번 호출하기
-   한 step의 output을 다른 step에서 사용하기

#### 같은 함수를 한 번 이상 호출하기

예를 들어 다음 함수는 난수를 생성합니다:

```yaml
functions:
  random:
    name: Generate random number
    outputs: [value]
    command: set-output value `random_number`
```

build config에서 `random` 함수를 사용해 난수 두 개를 생성하고 출력해 보겠습니다:

```yaml
build:
  name: Functions Demo
  steps:
    - random:
        id: random_1
    - random:
        id: random_2
    - run:
        name: Print random numbers
        inputs:
          random_1: ${ steps.random_1.value }
          random_2: ${ steps.random_2.value }
        command: |
          echo "${ inputs.random_1 }"
          echo "${ inputs.random_2 }"
```

#### 한 step의 output을 다른 step에서 사용하기

예를 들어 다음 build config는 한 step의 output을 다른 step에서 사용하는 방법을 보여 줍니다:

```yaml
build:
  name: Outputs demo
  steps:
    - run:
        name: Produce output
        id: id123 # <---- !!!
        outputs: [foo]
        command: |
          echo "Producing output for another step"
          set-output foo bar
    - run:
        name: Use output from another step
        inputs:
          foo: ${ steps.id123.foo }
        command: |
          echo "foo = \"${ inputs.foo }\""
```

## `functions`

build config에서 사용할 수 있는 재사용 가능한 함수를 설명하기 위해 정의합니다. 함수를 만들기 위한 모든 config 옵션은 다음 속성으로 지정됩니다:

### `functions.[function_name]`

`[function_name]`은 `build.steps`에서 식별하기 위해 정의하는 함수 이름입니다. 예를 들어 `greetings`라는 이름의 함수를 정의할 수 있습니다:

```yaml
functions:
  greetings:
    name: Say Hi!
```

### `functions.[function_name].name`

build 로그에서 함수 이름을 표시할 때 사용하는 이름입니다. 예를 들어 표시 이름이 `Say Hi!`인 함수입니다:

```yaml
functions:
  greetings:
    name: Say Hi!
```

### `functions.[function_name].inputs`

함수에 입력값을 제공합니다.

#### `inputs[].name`

입력값의 이름입니다. bash 명령 보간처럼 입력값에 접근할 때 식별자로 사용됩니다.

```yaml
functions:
  greetings:
    name: Say Hi!
    inputs:
      - name: name
        default_value: Hello world
    command: echo "${ inputs.name }!"
```

#### `inputs[].required`

입력값이 필수인지 여부를 나타내는 boolean입니다. 예를 들어 어떤 함수에 필수 값이 없는 경우입니다:

```yaml
functions:
  greetings:
    name: Say Hi!
    inputs:
      - name: name
        required: false
```

#### `inputs[].type`

입력값의 타입입니다. `string`, `num`, `json` 중 하나일 수 있습니다.

함수 호출에서 설정한 입력값과 함수의 `default_value`, `allowed_values`는 모두 이 타입에 맞춰 검증됩니다.

기본 입력 `type`은 `string`입니다.

예를 들어 함수가 `string` 타입 입력값을 가지는 경우입니다:

```yaml
functions:
  greetings:
    name: Say Hi!
    inputs:
      - name: name
        type: string
      - name: age
        type: num
      - name: other_data
        type: json
```

#### `inputs[].default_value`

`default_value`를 사용해 기본 입력값 하나를 제공할 수 있습니다. 예를 들어 함수의 기본값이 `Hello world`인 경우입니다:

```yaml
functions:
  greetings:
    name: Say Hi!
    inputs:
      - name: name
        default_value: Hello world
```

#### `inputs[].allowed_values`

`allowed_values`를 사용해 배열 형태로 여러 값을 제공할 수 있습니다. 예를 들어 함수가 여러 허용 값을 가지는 경우입니다:

```yaml
functions:
  greetings:
    name: Say Hi!
    inputs:
      - name: name
        default_value: Hello world
        allowed_values: [Hi, Hello, Hey]
        type: string
```

#### 여러 입력값 사용하기

함수에는 여러 입력값을 제공할 수 있습니다.

```yaml
functions:
  greetings:
    name: Say Hi!
    inputs:
      - name: name
        default_value: Expo
      - name: greeting
        default_value: Hi
        allowed_values: [Hi, Hello]
    command: echo "${ inputs.greeting }, ${ inputs.name }!"
```

### `functions.[function_name].outputs`

함수에서 output 값을 기대합니다. 예를 들어 함수가 `Hello world`라는 output 값을 가지는 경우입니다:

```yaml
functions:
  greetings:
    name: Say Hi!
    outputs: [value]
    command: set-output value "Hello world"
```

#### `outputs[].name`

output 값의 이름입니다. 다른 step에서 output 값에 접근할 때 식별자로 사용됩니다:

```yaml
functions:
  greetings:
    name: Say Hi!
    outputs:
      - name: name
```

#### `outputs[].required`

output 값이 필수인지 여부를 나타내는 boolean입니다. 예를 들어 어떤 함수에 필수 output 값이 없는 경우입니다:

```yaml
functions:
  greetings:
    name: Say Hi!
    outputs:
      - name: value
        required: false
```

### `functions.[function_name].command`

함수를 단순한 shell script로 사용하고 싶다면, 함수가 실행될 때 수행할 명령을 정의하는 데 사용합니다. 각 함수는 `command` 또는 함수를 구현한 JS/TS module의 `path` 중 하나를 **반드시** 정의해야 합니다. 예를 들어 `echo "Hello world"` 명령을 사용해 메시지를 출력할 수 있습니다:

```yaml
functions:
  greetings:
    name: Say Hi!
    command: echo "Hi!"
```

### `functions.[function_name].path`

함수를 구현한 JavaScript/TypeScript module의 경로를 정의하는 데 사용합니다. 각 함수는 `command` 또는 `path` 속성 중 하나를 **반드시** 정의해야 합니다. 예를 들어 `./greetings` 경로를 사용해 `greetings` module에 선언된 `greetings` 함수를 실행할 수 있습니다:

```yaml
functions:
  greetings:
    name: Say Hi!
    path: ./greetings
```

> [custom TypeScript/JavaScript 함수를 만들고 사용하는 방법 자세히 알아보기](/custom-builds/functions).

### `functions.[function_name].shell`

함수가 실행되는 step의 기본 실행 shell을 정의하는 데 사용됩니다. 예를 들어 step의 shell을 `/bin/sh`로 설정할 수 있습니다:

```yaml
functions:
  greetings:
    name: Say Hi!
    shell: /bin/sh
    command: echo "Hi!"
```

### `functions.[function_name].supported_platforms`

함수가 지원하는 플랫폼을 정의하는 데 사용됩니다. 기본값은 모든 플랫폼입니다. 허용되는 플랫폼은 `darwin`, `linux`입니다.

예를 들어 함수의 지원 플랫폼이 `darwin`(macOS)인 경우입니다:

```yaml
functions:
  greetings:
    name: Say Hi!
    supported_platforms: [darwin]
    command: echo "Hi!"
```

## `import`

다른 구성 파일에서 함수를 가져오는 데 사용하는 구성 파일 경로 목록입니다. 가져온 파일에는 `build` 섹션이 있으면 안 됩니다.

예를 들어, 다음 빌드 구성은 두 개의 파일을 가져오고, 가져온 두 함수 `say_hi`와 `say_bye`를 호출합니다.

```yaml
import:
  - common-functions.yml
  - another-file.yml

build:
  steps:
    - say_hi
    - say_bye
```

```yaml
functions:
  say_hi:
    name: Say Hi!
    command: echo "Hi!"
```

```yaml
functions:
  say_bye:
    name: Say bye :(
    command: echo "Bye!"
```

## 함수

### 내장 EAS 함수

EAS는 함수 정의를 따로 작성하지 않고도 빌드 구성에서 사용할 수 있는 내장 재사용 함수 집합을 제공합니다.

> **팁:** EAS가 내장으로 제공하는 함수는 모두 `eas/` 접두사로 시작해야 합니다.

#### `eas/build`

전체 EAS Build 빌드 프로세스를 캡슐화한 올인원 함수입니다. [**eas.json**](/eas/json)에 있는 빌드 프로필 설정을 기반으로 가장 적절한 빌드 구성을 해석합니다.

빌드 프로세스를 수동으로 변경하거나 구성하는 데 신경 쓰지 않고 빌드를 수행하고 싶은 사람에게 적합합니다. 빌드 프로세스 자체는 바꾸고 싶지 않지만, 그 전후에 다른 커스텀 step을 사용하고 싶다면 커스텀 빌드 구성의 좋은 출발점이 될 수 있습니다.

```yaml
build:
  name: Run a build using a single command
  steps:
    - eas/build
```

빌드 프로세스를 더 세밀하게 제어하고 요구 사항에 맞게 사용자화하려면, 아래의 커스텀 함수와 step을 참고하세요. 이들은 `eas/build`가 내부적으로 실행하는 항목들입니다. 빌드 프로필 구성에 따라 빌드 프로세스의 일부로 실행됩니다.

##### Android

빌드 구성이 [`withoutCredentials`](/eas/json#withoutcredentials)를 사용하는 경우:

-   [`eas/checkout`](/custom-builds/schema#eascheckout)
-   [`eas/use_npm_token`](/custom-builds/schema#easuse_npm_token)
-   [`eas/install_node_modules`](/custom-builds/schema#easinstall_node_modules)
-   [`eas/resolve_build_config`](/custom-builds/schema#easresolve_build_config)
-   [`eas/prebuild`](/custom-builds/schema#easprebuild)
-   [`eas/configure_eas_update`](/custom-builds/schema#easconfigure_eas_update)
-   [`eas/run_gradle`](/custom-builds/schema#easrun_gradle)
-   [`eas/find_and_upload_build_artifacts`](/custom-builds/schema#easfind_and_upload_build_artifacts)

빌드 구성이 자격 증명을 사용하는 경우(`internal`, `store` [distribution](/eas/json#distribution) 빌드 모두 포함):

-   [`eas/checkout`](/custom-builds/schema#eascheckout)
-   [`eas/use_npm_token`](/custom-builds/schema#easuse_npm_token)
-   [`eas/install_node_modules`](/custom-builds/schema#easinstall_node_modules)
-   [`eas/resolve_build_config`](/custom-builds/schema#easresolve_build_config)
-   [`eas/prebuild`](/custom-builds/schema#easprebuild)
-   [`eas/configure_eas_update`](/custom-builds/schema#easconfigure_eas_update)
-   [`eas/inject_android_credentials`](/custom-builds/schema#easinject_android_credentials)
-   [`eas/configure_android_version`](/custom-builds/schema#easconfigure_android_version)
-   [`eas/run_gradle`](/custom-builds/schema#easrun_gradle)
-   [`eas/find_and_upload_build_artifacts`](/custom-builds/schema#easfind_and_upload_build_artifacts)

##### iOS

빌드 구성이 [`withoutCredentials`](/eas/json#withoutcredentials) 또는 [`simulator`](/eas/json#simulator)를 사용하는 경우:

-   [`eas/checkout`](/custom-builds/schema#eascheckout)
-   [`eas/use_npm_token`](/custom-builds/schema#easuse_npm_token)
-   [`eas/install_node_modules`](/custom-builds/schema#easinstall_node_modules)
-   [`eas/resolve_build_config`](/custom-builds/schema#easresolve_build_config)
-   [`eas/prebuild`](/custom-builds/schema#easprebuild)
-   `pod install` 명령을 사용해 pods 설치
-   [`eas/configure_eas_update`](/custom-builds/schema#easconfigure_eas_update)
-   [`eas/generate_gymfile_from_template`](/custom-builds/schema#easgenerate_gymfile_from_template)
-   [`eas/run_fastlane`](/custom-builds/schema#easrun_fastlane)
-   [`eas/find_and_upload_build_artifacts`](/custom-builds/schema#easfind_and_upload_build_artifacts)

빌드 구성이 자격 증명을 사용하는 경우(`internal`, `store` [distribution](/eas/json#distribution) 빌드 모두 포함):

-   [`eas/checkout`](/custom-builds/schema#eascheckout)
-   [`eas/use_npm_token`](/custom-builds/schema#easuse_npm_token)
-   [`eas/install_node_modules`](/custom-builds/schema#easinstall_node_modules)
-   [`eas/resolve_build_config`](/custom-builds/schema#easresolve_build_config)
-   [`eas/resolve_apple_team_id_from_credentials`](/custom-builds/schema#easresolve_apple_team_id_from_credentials)
-   [`eas/prebuild`](/custom-builds/schema#easprebuild)
-   `pod install` 명령을 사용해 pods 설치
-   [`eas/configure_eas_update`](/custom-builds/schema#easconfigure_eas_update)
-   [`eas/configure_ios_credentials`](/custom-builds/schema#easconfigure_ios_credentials)
-   [`eas/configure_ios_version`](/custom-builds/schema#easconfigure_ios_version)
-   [`eas/generate_gymfile_from_template`](/custom-builds/schema#easgenerate_gymfile_from_template)
-   [`eas/run_fastlane`](/custom-builds/schema#easrun_fastlane)
-   [`eas/find_and_upload_build_artifacts`](/custom-builds/schema#easfind_and_upload_build_artifacts)

YAML 구성 파일에서 다음 step들을 사용하면 `eas/build` 명령 호출을 대체할 수 있습니다:

[ios-simulator-build.yml](https://github.com/expo/eas-custom-builds-example/blob/main/.eas/build/ios-simulator-build.yml) — 예제 리포지토리에서 iOS simulator 빌드에 대해 `eas/build` 함수가 내부적으로 실행하는 step을 확인하세요.

[ios-credentials-build.yml](https://github.com/expo/eas-custom-builds-example/blob/main/.eas/build/ios-build-with-credentials.yml) — 예제 리포지토리에서 자격 증명을 사용하는 iOS 빌드에 대해 `eas/build` 함수가 내부적으로 실행하는 step을 확인하세요.

[android-build-without-credentials.yml](https://github.com/expo/eas-custom-builds-example/blob/main/.eas/build/android-build-without-credentials.yml) — 예제 리포지토리에서 자격 증명을 사용하지 않는 Android 빌드에 대해 `eas/build` 함수가 내부적으로 실행하는 step을 확인하세요.

[android-build-with-credentials.yml](https://github.com/expo/eas-custom-builds-example/blob/main/.eas/build/android-build-with-credentials.yml) — 예제 리포지토리에서 자격 증명을 사용하는 Android 빌드에 대해 `eas/build` 함수가 내부적으로 실행하는 step을 확인하세요.

##### 알려진 제한 사항

-   입력을 받지 않으며, 해석된 빌드 프로세스는 [**eas.json**](/eas/json)에 있는 빌드 프로필을 기반으로 구성됩니다.
-   `eas/build`가 만들어내는 빌드 프로세스는 구성할 수 없으며 사용자화할 수도 없습니다. 빌드 프로세스를 사용자화해야 한다면, 위 예시처럼 이 함수가 내부적으로 실행하는 함수와 step의 부분집합을 사용해 YAML 구성 파일에서 수동으로 구성하세요.

#### `eas/maestro_test`

Maestro를 설치하고, 테스트 환경(Android Emulator 또는 iOS Simulator)을 준비한 뒤, 앱을 테스트하는 올인원 함수입니다.

> Android Emulator를 시작하려면 프로젝트가 이전 Build Infrastructure를 사용하도록 구성되어 있어야 합니다. 설정하려면 [Project settings](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/settings)로 이동하세요. 자세한 내용은 [이 changelog 게시물](https://expo.dev/changelog/2024/08-29-c3d-default)을 참고하세요.

| 입력 | 타입 | 설명 |
| --- | --- | --- |
| `flow_path` | `string` | 실행할 [Maestro flows](https://docs.maestro.dev/getting-started/writing-your-first-flow)의 경로입니다(또는 여러 경로를 각 줄에 하나씩 지정). |
| `app_path` | `string` | 테스트해야 할 emulator/simulator 앱의 경로(또는 regex 패턴)입니다. 제공하지 않으면 Android는 기본적으로 **android/app/build/outputs/\*\*/\*.apk**, iOS는 **ios/build/Build/Products/\*simulator/\*.app**를 사용합니다. |

```yaml
build:
  name: Build and test
  steps:
    - eas/build
    - eas/maestro_test:
        inputs:
          flow_path: |
            maestro/sign_in.yml
            maestro/create_post.yml
            maestro/sign_out.yml
```

```yaml
build:
  name: Build and test iOS simulator app
  steps:
    - eas/checkout
    - eas/maestro_test:
        app_path: ./fixtures/my_app.app
        inputs:
          flow_path: |
            maestro/sign_in.yml
            maestro/create_post.yml
            maestro/sign_out.yml
```

```yaml
build:
  name: Build and test Android emulator app
  steps:
    - eas/checkout
    - eas/maestro_test:
        app_path: ./fixtures/my_app.apk
        inputs:
          flow_path: |
            maestro/sign_in.yml
            maestro/create_post.yml
            maestro/sign_out.yml
```

내부적으로는 다음을 사용합니다:

-   Maestro 설치를 위한 [`eas/install_maestro`](/custom-builds/schema#easinstall_maestro)
-   필요할 경우 Android Emulator 시작을 위한 [`eas/start_android_emulator`](/custom-builds/schema#easstart_android_emulator)
-   필요할 경우 iOS Simulator 시작을 위한 [`eas/start_ios_simulator`](/custom-builds/schema#easstart_ios_simulator)
-   실행 중인 Android Emulator에 **.apk**를, iOS Simulator에 **.app**을 설치하기 위한 커스텀 `run`
-   제공된 각 flow에 대해 `maestro test`를 실행하는 일련의 `run`
-   Maestro 테스트 아티팩트를 빌드 아티팩트로 업로드하기 위한 [`eas/upload_artifact`](/custom-builds/schema#easupload_artifact)

> Xcode 15.0 또는 15.2 이미지에서 Maestro 테스트가 자주 시간 초과되는 현상을 확인했습니다. 문제를 피하려면 `latest` 이미지를 사용하세요.

Maestro 버전을 사용자화하거나, 특정 Android Emulator 또는 iOS Simulator를 실행하거나, 여러 빌드 아티팩트를 업로드하려면 이 일련의 step을 직접 작성해야 합니다.

`eas/maestro_test`를 확장한 Android 빌드 구성 예시

```yaml
build:
  name: Build and test (Android, expanded)
  steps:
    - eas/build
    - eas/install_maestro
    - eas/start_android_emulator:
        inputs:
          system_package_name: system-images;android-34;default;x86_64
    - run:
        command: |
          # shopt -s globstar is necessary to add /**/ support
          shopt -s globstar
          # shopt -s nullglob is necessary not to try to install
          # SEARCH_PATH literally if there are no matching files.
          shopt -s nullglob

          SEARCH_PATH="android/app/build/outputs/**/*.apk"
          FILES_FOUND=false

          for APP_PATH in $SEARCH_PATH; do
            FILES_FOUND=true
            echo "Installing \\"$APP_PATH\\""
            adb install "$APP_PATH"
          done

          if ! $FILES_FOUND; then
            echo "No files found matching \\"$SEARCH_PATH\\". Are you sure you've built an Emulator app?"
            exit 1
          fi
    - run:
        command: |
          maestro test maestro/flow.yml
    - eas/upload_artifact:
        name: Upload test artifact
        if: ${ always() }
        inputs:
          type: build-artifact
          path: ${ eas.env.HOME }/.maestro/tests
```

`eas/maestro_test`를 확장한 iOS 빌드 구성 예시

```yaml
build:
name: Build and test (iOS, expanded)
steps:
  - eas/build
  - eas/install_maestro
  - eas/start_ios_simulator
  - run:
      command: |
        # shopt -s nullglob is necessary not to try to install
        # SEARCH_PATH literally if there are no matching files.
        shopt -s nullglob

        SEARCH_PATH="ios/build/Build/Products/*simulator/*.app"
        FILES_FOUND=false

        for APP_PATH in $SEARCH_PATH; do
          FILES_FOUND=true
          echo "Installing \\"$APP_PATH\\""
          xcrun simctl install booted "$APP_PATH"
        done

        if ! $FILES_FOUND; then
          echo "No files found matching \\"$SEARCH_PATH\\". Are you sure you've built a Simulator app?"
          exit 1
        fi
  - run:
      command: |
        maestro test maestro/flow.yml
  - eas/upload_artifact:
      name: Upload test artifact
      if: ${ always() }
      inputs:
        type: build-artifact
        path: ${ eas.env.HOME }/.maestro/tests
```

[eas/maestro_test 소스 코드](https://github.com/expo/eas-build/blob/main/packages/build-tools/src/steps/functionGroups/maestroTest.ts) — GitHub에서 eas/maestro_test 함수의 소스 코드를 확인하세요.

#### `eas/checkout`

프로젝트 소스 파일을 체크아웃합니다.

예를 들어, 다음 `steps`를 가진 빌드 구성은 프로젝트를 체크아웃하고 **assets** 디렉터리의 파일을 나열합니다:

```yaml
build:
  name: List files
  steps:
    - eas/checkout
    - run:
        name: List assets
        run: ls assets
```

[eas/checkout 소스 코드](https://github.com/expo/eas-build/blob/main/packages/build-tools/src/steps/functions/checkout.ts) — GitHub에서 eas/checkout 함수의 소스 코드를 확인하세요.

#### `eas/use_npm_token`

npm 또는 비공개 레지스트리에 게시된 비공개 패키지를 사용할 수 있도록 node package manager(npm, pnpm, Yarn)를 구성합니다. 프로젝트의 secrets에 `NPM_TOKEN`을 설정하면, 이 함수가 토큰이 포함된 **.npmrc**를 생성하여 빌드 환경을 구성합니다.

```yaml
build:
  name: Install private npm modules
  steps:
    - eas/checkout
    - eas/use_npm_token
    - run:
        name: Install dependencies
        run: npm install # <---- Can now install private packages
```

[eas/use_npm_token 소스 코드](https://github.com/expo/eas-build/blob/main/packages/build-tools/src/steps/functions/useNpmToken.ts) — GitHub에서 eas/use_npm_token 함수의 소스 코드를 확인하세요.

#### `eas/install_node_modules`

프로젝트를 기준으로 감지된 package manager(npm, pnpm, Yarn)를 사용해 node modules를 설치합니다. monorepo에서도 동작합니다.

```yaml
build:
  name: Install node modules
  steps:
    - eas/checkout
    - eas/install_node_modules
```

[eas/install_node_modules 소스 코드](https://github.com/expo/eas-build/blob/main/packages/build-tools/src/steps/functions/installNodeModules.ts) — GitHub에서 eas/install_node_modules 함수의 소스 코드를 확인하세요.

#### `eas/restore_build_cache`

지정한 키에서 이전에 저장된 빌드 캐시를 복원합니다. 컴파일된 의존성, 빌드 도구, 기타 중간 빌드 출력 같은 캐시된 아티팩트를 재사용해 빌드 속도를 높일 때 유용합니다.

```yaml
build:
  name: Build with cache
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/prebuild
    - eas/restore_build_cache:
        inputs:
          key: cache-${{ hashFiles('package-lock.json') }}
          restore_keys: cache
          path: /path/to/cache
```

```yaml
build:
  name: Build with cache
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/prebuild
    - eas/restore_build_cache:
        inputs:
          key: cache-${{ hashFiles('package-lock.json') }}
          path: /path/to/cache
```

| 속성 | 타입 | 설명 |
| --- | --- | --- |
| `name` | - | 빌드 로그에 표시되는 재사용 함수 내 step의 이름입니다. 기본값은 `Restore build cache`입니다. |
| `inputs.key` | `string` | 필수입니다. 복원할 캐시 키입니다. `${{ hashFiles('package-lock.json') }}` 같은 표현식을 사용해 파일 해시 기반의 동적 키를 만들 수 있습니다. |
| `inputs.restore_keys` | `string` | 선택 사항입니다. 정확한 키를 찾지 못했을 때 사용할 대체 키 또는 접두사입니다. 제공되면 캐시 시스템은 이 접두사로 시작하는 캐시 항목을 찾습니다. |
| `inputs.path` | `string` | 필수입니다. 캐시를 복원할 경로입니다. 캐시를 저장할 때 사용한 경로와 일치해야 합니다. |

[eas/restore_build_cache 소스 코드](https://github.com/expo/eas-build/blob/main/packages/build-tools/src/steps/functions/restoreBuildCache.ts) — GitHub에서 eas/restore_build_cache 함수의 소스 코드를 확인하세요.

#### `eas/save_build_cache`

지정한 키에 빌드 캐시를 저장합니다. 빌드 아티팩트, 컴파일된 의존성, 기타 중간 출력물을 보존하여 이후 빌드에서 재사용하고 빌드 속도를 높일 수 있습니다.

```yaml
build:
  name: Build with cache
  steps:
    - eas/checkout
    - eas/restore_build_cache:
        inputs:
          key: cache-${{ hashFiles('package-lock.json') }}
          path: /path/to/cache
    - eas/install_node_modules
    - eas/prebuild
    - eas/run_gradle
    - eas/save_build_cache:
        inputs:
          key: cache-${{ hashFiles('package-lock.json') }}
          path: /path/to/cache
```

| 속성 | 타입 | 설명 |
| --- | --- | --- |
| `name` | - | 빌드 로그에 표시되는 재사용 함수 내 step의 이름입니다. 기본값은 `Save build cache`입니다. |
| `inputs.key` | `string` | 필수입니다. 캐시를 저장할 때 사용할 키입니다. `${{ hashFiles('package-lock.json') }}` 같은 표현식을 사용해 파일 해시 기반의 동적 키를 만들 수 있습니다. 캐시를 복원할 때 사용한 키와 일치해야 합니다. |
| `inputs.path` | `string` | 필수입니다. 캐시할 디렉터리 또는 파일의 경로입니다. 캐시를 복원할 때 사용한 경로와 일치해야 합니다. |

[eas/save_build_cache 소스 코드](https://github.com/expo/eas-build/blob/main/packages/build-tools/src/steps/functions/saveBuildCache.ts) — GitHub에서 eas/save_build_cache 함수의 소스 코드를 확인하세요.

#### `eas/resolve_build_config`

빌드 구성을 해석하고 출력합니다. GitHub 통합으로 빌드가 트리거된 경우 현재 `job` 및 `metadata` 컨텍스트 값을 업데이트합니다. 구성은 config plugins의 영향을 받을 수 있으므로 의존성을 설치한 뒤 호출해야 합니다.

이 함수는 [`eas/build`](/custom-builds/schema#easbuild) 함수 그룹에 의해 자동으로 실행됩니다.

[eas/resolve_build_config 소스 코드](https://github.com/expo/eas-build/blob/main/packages/build-tools/src/steps/functions/resolveBuildConfig.ts) — GitHub에서 eas/resolve_build_config 함수의 소스 코드를 확인하세요.

#### `eas/get_credentials_for_build_triggered_by_github_integration`

> **사용 중단됨:** 이 step 대신 [`eas/resolve_build_config`](/custom-builds/schema#easresolve_build_config)을 사용하세요.

#### `eas/resolve_apple_team_id_from_credentials`

> 이 함수는 iOS 빌드에서만 사용할 수 있습니다.

`inputs.credentials`에 제공된 빌드 자격 증명을 기반으로 Apple team ID 값을 해석합니다. 해석된 Apple team ID는 `outputs.apple_team_id` 출력 값에 저장됩니다.

```yaml
build:
  name: Run prebuild script
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/resolve_apple_team_id_from_credentials:
        id: resolve_apple_team_id_from_credentials
    - eas/prebuild:
        inputs:
          apple_team_id: ${ steps.resolve_apple_team_id_from_credentials.apple_team_id }
```

| 속성 | 타입 | 설명 |
| --- | --- | --- |
| `name` | `string` | 빌드 로그에 표시되는 재사용 함수 내 step의 이름입니다. 기본값은 `Resolve Apple team ID from credentials`입니다. |
| `inputs.credentials` | `json` | 선택 사항인 입력으로, iOS 빌드에 사용할 앱 자격 증명을 정의합니다. 기본값은 `${ eas.job.secrets.buildCredentials }`입니다. iOS용 `${ eas.job.secrets.buildCredentials }` 스키마를 준수해야 합니다. |

[eas/resolve_apple_team_id_from_credentials 소스 코드](https://github.com/expo/eas-build/blob/main/packages/build-tools/src/steps/functions/resolveAppleTeamIdFromCredentials.ts) — GitHub에서 eas/resolve_apple_team_id_from_credentials 함수의 소스 코드를 확인하세요.

#### `eas/prebuild`

프로젝트에 맞게 감지된 package manager(npm, pnpm, Yarn)를 사용해, 빌드 유형과 빌드 환경에 가장 적합한 명령으로 `expo prebuild` 명령을 실행합니다.

```yaml
build:
  name: Run prebuild script
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/resolve_apple_team_id_from_credentials:
        id: resolve_apple_team_id_from_credentials
    - eas/prebuild:
        inputs:
          clean: false
          apple_team_id: ${ steps.resolve_apple_team_id_from_credentials.apple_team_id }
```

```yaml
build:
  name: Run prebuild script
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/prebuild
```

| 속성 | 타입 | 설명 |
| --- | --- | --- |
| `name` | - | 빌드 로그에 표시되는 재사용 함수 내 step의 이름입니다. 기본값은 `Prebuild`입니다. |
| `inputs.clean` | `boolean` | 선택 사항인 입력으로, 명령 실행 시 함수가 `--clean` 플래그를 사용할지 정의합니다. 기본값은 false입니다. |
| `inputs.apple_team_id` | `boolean` | 선택 사항인 입력으로, prebuild 시 사용할 Apple team ID를 정의합니다. 자격 증명을 사용하는 iOS 빌드에서는 지정해야 합니다. |

[eas/prebuild 소스 코드](https://github.com/expo/eas-build/blob/main/packages/build-tools/src/steps/functions/prebuild.ts) — GitHub에서 eas/resolve_apple_team_id_from_credentials 함수의 소스 코드를 확인하세요.

#### `eas/configure_eas_update`

> 이 함수를 사용하려면 프로젝트에 EAS Update가 구성되어 있어야 합니다.

빌드의 runtime version과 release channel을 구성합니다.

```yaml
build:
  name: Configure EAS Update
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/prebuild
    - eas/configure_eas_update
```

```yaml
build:
  name: Configure EAS Update
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/prebuild
    - eas/configure_eas_update:
        inputs:
          runtime_version: 1.0.0
          channel: mychannel
```

| 속성 | 타입 | 설명 |
| --- | --- | --- |
| `name` | - | 빌드 로그에 표시되는 재사용 함수 내 step의 이름입니다. 기본값은 `Configure EAS Update`입니다. |
| `inputs.runtime_version` | `string` | 선택 사항인 입력으로, 빌드에 설정할 runtime version을 정의합니다. 기본값은 `${ eas.job.version.runtimeVersion }` 또는 네이티브에 정의된 runtime version입니다. |
| `inputs.channel` | `string` | 선택 사항인 입력으로, 빌드에 설정할 channel을 정의합니다. 기본값은 `${ eas.job.updates.channel }`입니다. |

[eas/configure_eas_update 소스 코드](https://github.com/expo/eas-build/blob/main/packages/build-tools/src/steps/functions/configureEASUpdateIfInstalled.ts) — GitHub에서 eas/configure_eas_update 함수의 소스 코드를 확인하세요.

#### `eas/inject_android_credentials`

> 이 함수는 Android 빌드에서만 사용할 수 있습니다.

builder에서 Android keystore를 자격 증명으로 구성하고, 이 자격 증명을 사용한 앱 서명 구성을 gradle config에 주입합니다.

```yaml
build:
  name: Android credentials
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/prebuild
    - eas/inject_android_credentials
```

| 속성 | 타입 | 설명 |
| --- | --- | --- |
| `name` | - | 빌드 로그에 표시되는 재사용 함수 내 step의 이름입니다. 기본값은 `Inject Android credentials`입니다. |
| `inputs.credentials` | `json` | 선택 사항인 입력으로, Android 빌드에 사용할 앱 자격 증명을 정의합니다. 기본값은 `${ eas.job.secrets.buildCredentials }`입니다. Android용 `${ eas.job.secrets.buildCredentials }` 스키마를 준수해야 합니다. |

[eas/inject_android_credentials 소스 코드](https://github.com/expo/eas-build/blob/main/packages/build-tools/src/steps/functions/injectAndroidCredentials.ts) — GitHub에서 eas/inject_android_credentials 함수의 소스 코드를 확인하세요.

#### `eas/configure_ios_credentials`

> 이 함수는 iOS 빌드에서만 사용할 수 있습니다.

builder에서 iOS 자격 증명을 구성합니다. provisioning profile을 target에 할당하여 Xcode 프로젝트 구성을 수정합니다.

```yaml
build:
  name: iOS credentials
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/resolve_apple_team_id_from_credentials:
        id: resolve_apple_team_id_from_credentials
    - eas/prebuild:
        inputs:
          clean: false
          apple_team_id: ${ steps.resolve_apple_team_id_from_credentials.apple_team_id }
    - eas/configure_ios_credentials
```

| 속성 | 타입 | 설명 |
| --- | --- | --- |
| `name` | - | 빌드 로그에 표시되는 재사용 함수 내 step의 이름입니다. 기본값은 `Configure iOS credentials`입니다. |
| `inputs.build_configuration` | `string` | 선택 사항인 입력으로, Xcode 프로젝트의 Build Configuration을 정의합니다. 기본값은 `${ eas.job.buildConfiguration }`이며, 지정되지 않으면 development client는 `Debug`, 그 외 빌드는 `Release`로 해석됩니다. |
| `inputs.credentials` | `json` | 선택 사항인 입력으로, iOS 빌드에 사용할 앱 자격 증명을 정의합니다. 기본값은 `${ eas.job.secrets.buildCredentials }`입니다. iOS용 `${ eas.job.secrets.buildCredentials }` 스키마를 준수해야 합니다. |

[eas/configure_ios_credentials 소스 코드](https://github.com/expo/eas-build/blob/main/packages/build-tools/src/steps/functions/configureIosCredentials.ts) — GitHub에서 eas/configure_ios_credentials 함수의 소스 코드를 확인하세요.

#### `eas/configure_android_version`

> 이 함수는 Android 빌드에서만 사용할 수 있습니다.

Android 앱의 버전을 구성합니다. [원격 앱 버전 관리](/build-reference/app-versions)를 사용할 때 버전을 설정하는 데 사용됩니다.

이 함수는 필수는 아니며, 사용하지 않으면 prebuild 단계에서 생성된 네이티브 코드의 버전이 사용됩니다.

```yaml
build:
  name: Configure Android version
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/prebuild
    - eas/configure_eas_update
    - eas/inject_android_credentials
    - eas/configure_android_version
```

```yaml
build:
  name: Configure Android version
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/prebuild
    - eas/configure_eas_update
    - eas/inject_android_credentials
    - eas/configure_android_version:
        inputs:
          version_code: '123'
          version_name: '1.0.0'
```

| 속성 | 타입 | 설명 |
| --- | --- | --- |
| `name` | - | 빌드 로그에 표시되는 재사용 함수 내 step의 이름입니다. 기본값은 `Configure Android version`입니다. |
| `inputs.version_code` | `string` | 선택 사항인 입력으로, Android 빌드의 `versionCode`를 정의합니다. 기본값은 `${ eas.job.version.versionCode }`입니다. |
| `inputs.version_name` | `string` | 선택 사항인 입력으로, Android 빌드의 `versionName`을 정의합니다. 기본값은 `${ eas.job.version.versionName }`입니다. |

[eas/configure_android_version 소스 코드](https://github.com/expo/eas-build/blob/main/packages/build-tools/src/steps/functions/configureAndroidVersion.ts) — GitHub에서 eas/configure_android_version 함수의 소스 코드를 확인하세요.

#### `eas/configure_ios_version`

> 이 함수는 iOS 빌드에서만 사용할 수 있습니다.

iOS 앱의 버전을 구성합니다. [원격 앱 버전 관리](/build-reference/app-versions)를 사용할 때 버전을 설정하는 데 사용됩니다.

이 함수는 필수는 아니며, 사용하지 않으면 prebuild 단계에서 생성된 네이티브 코드의 버전이 사용됩니다.

```yaml
build:
  name: Configure iOS version
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/resolve_apple_team_id_from_credentials:
        id: resolve_apple_team_id_from_credentials
    - eas/prebuild:
        inputs:
          clean: false
          apple_team_id: ${ steps.resolve_apple_team_id_from_credentials.apple_team_id }
    - eas/configure_eas_update
    - eas/configure_ios_credentials
    - eas/configure_ios_version
```

```yaml
build:
  name: Configure iOS version
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/resolve_apple_team_id_from_credentials:
        id: resolve_apple_team_id_from_credentials
    - eas/prebuild:
        inputs:
          clean: false
          apple_team_id: ${ steps.resolve_apple_team_id_from_credentials.apple_team_id }
    - eas/configure_eas_update
    - eas/configure_ios_credentials
    - eas/configure_ios_version:
        inputs:
          build_number: '123'
          app_version: '1.0.0'
```

| 속성 | 타입 | 설명 |
| --- | --- | --- |
| `name` | - | 빌드 로그에 표시되는 재사용 함수 내 step의 이름입니다. 기본값은 `Configure iOS version`입니다. |
| `inputs.build_number` | `string` | 선택 사항인 입력으로, iOS 빌드의 build number(`CFBundleVersion`)를 정의합니다. 기본값은 `${ eas.job.version.buildNumber }`입니다. |
| `inputs.app_version` | `string` | 선택 사항인 입력으로, iOS 빌드의 app version(`CFBundleShortVersionString`)를 정의합니다. 기본값은 `${ eas.job.version.appVersion }`입니다. |
| `inputs.build_configuration` | `string` | 선택 사항인 입력으로, Xcode 프로젝트의 Build Configuration을 정의합니다. 기본값은 `${ eas.job.buildConfiguration }`이며, 지정되지 않으면 development client는 `Debug`, 그 외 빌드는 `Release`로 해석됩니다. |
| `inputs.credentials` | `json` | 선택 사항인 입력으로, iOS 빌드에 사용할 앱 자격 증명을 정의합니다. 기본값은 `${ eas.job.secrets.buildCredentials }`입니다. iOS용 `${ eas.job.secrets.buildCredentials }` 스키마를 준수해야 합니다. |

[eas/configure_ios_version 소스 코드](https://github.com/expo/eas-build/blob/main/packages/build-tools/src/steps/functions/configureIosVersion.ts) — GitHub에서 eas/configure_ios_version 함수의 소스 코드를 확인하세요.

#### `eas/run_gradle`

> 이 함수는 Android 빌드에서만 사용할 수 있습니다.

Android 앱을 빌드하기 위해 Gradle 명령을 실행합니다.

```yaml
build:
  name: Build Android app
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/prebuild
    - eas/configure_eas_update
    - eas/inject_android_credentials
    - eas/run_gradle
```

```yaml
build:
  name: Build Android app
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/prebuild
    - eas/configure_eas_update
    - eas/inject_android_credentials
    - eas/run_gradle:
        inputs:
          command: :app:bundleRelease
```

| 속성 | 타입 | 설명 |
| --- | --- | --- |
| `name` | - | 빌드 로그에 표시되는 재사용 함수 내 step의 이름입니다. 기본값은 `Run gradle`입니다. |
| `inputs.command` | `string` | 선택 사항인 입력으로, Android 앱을 빌드할 때 실행할 Gradle 명령을 정의합니다. 지정하지 않으면 `${ eas.job }` 객체의 build configuration 및 내용에 따라 해석됩니다. |

[eas/run_gradle 소스 코드](https://github.com/expo/eas-build/blob/main/packages/build-tools/src/steps/functions/runGradle.ts) — GitHub에서 eas/run_gradle 함수의 소스 코드를 확인하세요.

#### `eas/generate_gymfile_from_template`

> 이 함수는 iOS build에서만 사용할 수 있습니다.

template를 바탕으로 Fastlane을 사용해 iOS 앱을 build하는 데 사용하는 [`Gymfile`](https://docs.fastlane.tools/actions/gym/#gymfile)을 생성합니다.

인증 정보를 전달한 경우 사용하는 기본 template:

```ruby
suppress_xcode_output(true)
clean(<%- CLEAN %>)

scheme("<%- SCHEME %>")
<% if (BUILD_CONFIGURATION) { %>
configuration("<%- BUILD_CONFIGURATION %>")
<% } %>

export_options({
method: "<%- EXPORT_METHOD %>",
provisioningProfiles: {<% _.forEach(PROFILES, function(profile) { %>
    "<%- profile.BUNDLE_ID %>" => "<%- profile.UUID %>",<% }); %>
}<% if (ICLOUD_CONTAINER_ENVIRONMENT) { %>,
iCloudContainerEnvironment: "<%- ICLOUD_CONTAINER_ENVIRONMENT %>"
<% } %>
})

export_xcargs "OTHER_CODE_SIGN_FLAGS=\"--keychain <%- KEYCHAIN_PATH %>\""

disable_xcpretty(true)
buildlog_path("<%- LOGS_DIRECTORY %>")

output_directory("<%- OUTPUT_DIRECTORY %>")
```

인증 정보를 전달하지 않은 경우(simulator build)에 사용하는 기본 template:

```ruby
suppress_xcode_output(true)
clean(<%- CLEAN %>)

scheme("<%- SCHEME %>")
<% if (BUILD_CONFIGURATION) { %>
configuration("<%- BUILD_CONFIGURATION %>")
<% } %>

derived_data_path("<%- DERIVED_DATA_PATH %>")
skip_package_ipa(true)
skip_archive(true)
destination("<%- SCHEME_SIMULATOR_DESTINATION %>")

disable_xcpretty(true)
buildlog_path("<%- LOGS_DIRECTORY %>")
```

`CLEAN`, `SCHEME`, `BUILD_CONFIGURATION`, `EXPORT_METHOD`, `PROFILES`, `ICLOUD_CONTAINER_ENVIRONMENT`, `KEYCHAIN_PATH`, `LOGS_DIRECTORY`, `OUTPUT_DIRECTORY`, `DERIVED_DATA_PATH`, `SCHEME_SIMULATOR_DESTINATION` 값은 입력값과 EAS Build의 기본 내부 구성을 바탕으로 template에 제공됩니다.

```yaml
build:
  name: Generate Gymfile template
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/resolve_apple_team_id_from_credentials:
        id: resolve_apple_team_id_from_credentials
    - eas/prebuild:
        inputs:
          clean: false
          apple_team_id: ${ steps.resolve_apple_team_id_from_credentials.apple_team_id }
    - eas/configure_eas_update
    - eas/configure_ios_credentials
    - eas/generate_gymfile_from_template:
        inputs:
          credentials: ${ eas.job.secrets.buildCredentials }
```

```yaml
build:
  name: Generate Gymfile template
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/prebuild
    - eas/generate_gymfile_from_template
```

하지만 `inputs.template`에 custom template를 지정하고 `inputs.extra` 객체에 custom 속성의 값을 제공하면, template 안에서 다른 custom 속성도 사용할 수 있습니다.

```yaml
build:
  name: Generate Gymfile template
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/resolve_apple_team_id_from_credentials:
        id: resolve_apple_team_id_from_credentials
    - eas/prebuild:
        inputs:
          clean: false
          apple_team_id: ${ steps.resolve_apple_team_id_from_credentials.apple_team_id }
    - eas/configure_eas_update
    - eas/configure_ios_credentials
    - eas/generate_gymfile_from_template:
        inputs:
          credentials: ${ eas.job.secrets.buildCredentials }
          extra:
            MY_VALUE: my value
          template: |
            suppress_xcode_output(true)
            clean(<%- CLEAN %>)

            scheme("<%- SCHEME %>")
            <% if (BUILD_CONFIGURATION) { %>
            configuration("<%- BUILD_CONFIGURATION %>")
            <% } %>

            export_options({
            method: "<%- EXPORT_METHOD %>",
            provisioningProfiles: {<% _.forEach(PROFILES, function(profile) { %>
                "<%- profile.BUNDLE_ID %>" => "<%- profile.UUID %>",<% }); %>
            }<% if (ICLOUD_CONTAINER_ENVIRONMENT) { %>,
            iCloudContainerEnvironment: "<%- ICLOUD_CONTAINER_ENVIRONMENT %>"
            <% } %>
            })

            export_xcargs "OTHER_CODE_SIGN_FLAGS=\"--keychain <%- KEYCHAIN_PATH %>\""

            disable_xcpretty(true)
            buildlog_path("<%- LOGS_DIRECTORY %>")

            output_directory("<%- OUTPUT_DIRECTORY %>")

            sth_else("<%- MY_VALUE %>")
```

| Property | Type | Description |
| --- | --- | --- |
| `name` | - | build 로그에 표시되는 reusable function 안의 step 이름입니다. 기본값은 `Generate Gymfile from template`입니다. |
| `inputs.template` | `string` | 선택 사항인 입력값으로, 사용할 Gymfile template를 정의합니다. 지정하지 않으면 `inputs.credentials` 값이 지정되었는지에 따라 두 기본 template 중 하나를 사용합니다. |
| `inputs.credentials` | `json` | 선택 사항인 입력값으로, iOS build용 앱 인증 정보를 정의합니다. 이 값을 지정하면 `KEYCHAIN_PATH`, `EXPORT_METHOD`, `PROFILES` 값이 template에 제공됩니다. |
| `inputs.build_configuration` | `string` | 선택 사항인 입력값으로, Xcode 프로젝트의 Build Configuration을 정의합니다. 기본값은 `${ eas.job.buildConfiguration }`이며, 지정되지 않으면 development client의 경우 `Debug`, 그 외 build에서는 `Release`로 해석됩니다. 이는 `BUILD_CONFIGURATION` template 값에 대응합니다. |
| `inputs.scheme` | `string` | 선택 사항인 입력값으로, build에 사용할 Xcode 프로젝트 scheme을 정의합니다. 기본값은 `${ eas.job.scheme }`이며, 지정되지 않으면 Xcode 프로젝트에서 찾은 첫 번째 scheme으로 해석됩니다. 이는 `SCHEME` template 값에 대응합니다. |
| `inputs.clean` | `boolean` | 선택 사항인 입력값으로, build 전에 Xcode 프로젝트를 정리할지 정의합니다. 기본값은 `true`입니다. 이는 `CLEAN` template 변수에 대응합니다. |
| `inputs.extra` | `json` | 선택 사항인 입력값으로, template에 제공할 추가 값을 정의합니다. |

[eas/generate_gymfile_from_template source code](https://github.com/expo/eas-build/blob/main/packages/build-tools/src/steps/functions/generateGymfileFromTemplate.ts) - GitHub에서 eas/generate_gymfile_from_template 함수의 source code를 확인하세요.

#### `eas/run_fastlane`

> 이 함수는 iOS build에서만 사용할 수 있습니다.

[`fastlane gym`](https://docs.fastlane.tools/actions/gym/#gym) 명령을 `ios` 프로젝트 디렉터리에 있는 [`Gymfile`](https://docs.fastlane.tools/actions/gym/#gymfile)에 대해 실행하여 iOS 앱을 build합니다.

```yaml
build:
  name: Build iOS app
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/resolve_apple_team_id_from_credentials:
        id: resolve_apple_team_id_from_credentials
    - eas/prebuild:
        inputs:
          clean: false
          apple_team_id: ${ steps.resolve_apple_team_id_from_credentials.apple_team_id }
    - eas/configure_eas_update
    - eas/configure_ios_credentials
    - eas/generate_gymfile_from_template:
        inputs:
          credentials: ${ eas.job.secrets.buildCredentials }
    - eas/run_fastlane
```

```yaml
build:
  name: Build iOS app
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/prebuild
    - eas/configure_eas_update
    - eas/generate_gymfile_from_template
    - eas/run_fastlane
```

[eas/run_fastlane source code](https://github.com/expo/eas-build/blob/main/packages/build-tools/src/steps/functions/runFastlane.ts) - GitHub에서 eas/run_fastlane 함수의 source code를 확인하세요.

#### `eas/find_and_upload_build_artifacts`

> **현재는 build job당 각 artifact type을 한 번만 업로드할 수 있습니다.**  
> build profile에 [`eas/find_and_upload_build_artifacts`](/custom-builds/schema#easfind_and_upload_build_artifacts)를 사용하면서 [`buildArtifactPaths`](/eas/json#buildartifactpaths)도 구성되어 있으면, 이 step이 일부 build artifact를 찾아 업로드한 뒤 이어지는 `eas/upload_artifact` step은 실패합니다.  
> 현재로서는 이를 해결하기 위해 custom build profile에서 `buildArtifactPaths`를 제거하고, 필요하다면 YAML 안에서 `eas/upload_artifact`로 artifact를 수동 업로드하는 것을 권장합니다.

기본 위치와 [`buildArtifactPaths`](/eas/json#buildartifactpaths) 구성을 사용해 application archive, 추가 build artifact, Xcode 로그를 자동으로 찾아 업로드합니다. 찾은 artifact는 EAS 서버로 업로드됩니다.

```yaml
build:
  name: Build iOS app
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/resolve_apple_team_id_from_credentials:
        id: resolve_apple_team_id_from_credentials
    - eas/prebuild:
        inputs:
          clean: false
          apple_team_id: ${ steps.resolve_apple_team_id_from_credentials.apple_team_id }
    - eas/configure_eas_update
    - eas/configure_ios_credentials
    - eas/generate_gymfile_from_template:
        inputs:
          credentials: ${ eas.job.secrets.buildCredentials }
    - eas/run_fastlane
    - eas/find_and_upload_build_artifacts
```

```yaml
build:
  name: Build iOS app
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/prebuild
    - eas/configure_eas_update
    - eas/generate_gymfile_from_template
    - eas/run_fastlane
    - eas/find_and_upload_build_artifacts
```

```yaml
build:
  name: Build Android app
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/prebuild
    - eas/configure_eas_update
    - eas/inject_android_credentials
    - eas/run_gradle
    - eas/find_and_upload_build_artifacts
```

[eas/find_and_upload_build_artifacts source code](https://github.com/expo/eas-build/blob/main/packages/build-tools/src/steps/functions/findAndUploadBuildArtifacts.ts) - GitHub에서 eas/find_and_upload_build_artifacts 함수의 source code를 확인하세요.

#### `eas/upload_artifact`

제공한 경로에서 build artifact를 업로드합니다.

> **현재는 build job당 각 artifact type을 한 번만 업로드할 수 있습니다.**  
> build profile에 [`eas/find_and_upload_build_artifacts`](/custom-builds/schema#easfind_and_upload_build_artifacts)를 사용하면서 [`buildArtifactPaths`](/eas/json#buildartifactpaths)도 구성되어 있으면, 이 step이 일부 build artifact를 찾아 업로드한 뒤 이어지는 `eas/upload_artifact` step은 실패합니다.  
> 현재로서는 이를 해결하기 위해 custom build profile에서 `buildArtifactPaths`를 제거하고, 필요하다면 YAML 안에서 `eas/upload_artifact`로 artifact를 수동 업로드하는 것을 권장합니다.

예를 들어 다음 `steps`를 가진 build config는 EAS 서버에 artifact를 업로드합니다:

```yaml
build:
  name: Upload artifacts
  steps:
    - eas/checkout
    # - ...
    - eas/upload_artifact:
        name: Upload application archive
        inputs:
          path: fixtures/app-debug.apk
    - eas/upload_artifact:
        name: Upload artifacts
        inputs:
          type: build-artifact
          path: |
            assets/*.jpg
            assets/*.png
```

| Input | Type | Description |
| --- | --- | --- |
| `path` | `string` | 필수입니다. EAS 서버에 업로드할 artifact 경로 또는 줄바꿈으로 구분한 경로 목록입니다. `*` 와일드카드와 다른 [glob pattern](https://github.com/isaacs/node-glob#glob-primer)을 사용할 수 있습니다. |
| `type` | `string` | EAS 서버에 업로드할 artifact의 타입입니다. 허용 값은 `application-archive`, `build-artifact`이며 기본값은 `application-archive`입니다. |

[eas/upload_artifact source code](https://github.com/expo/eas-build/blob/main/packages/build-tools/src/steps/functions/uploadArtifact.ts) - GitHub에서 eas/upload_artifact 함수의 source code를 확인하세요.

#### `eas/install_maestro`

[Maestro](https://maestro.dev/) 모바일 UI 테스트 프레임워크와 그 의존성이 모두 설치되어 있는지 확인합니다.

```yaml
build:
  name: Build and test
  steps:
    - eas/build
    # ... simulator/emulator setup
    - eas/install_maestro:
        inputs:
          maestro_version: 1.35.0
    - run:
        command: maestro test flows/signin.yml
    - eas/upload_artifact:
        name: Upload Maestro artifacts
        inputs:
          type: build-artifact
          path: ${ eas.env.HOME }/.maestro/tests
```

| Input | Type | Description |
| --- | --- | --- |
| `maestro_version` | `string` | 설치할 Maestro 버전입니다(예: 1.35.0). 제공하지 않으면 `install_maestro`가 최신 버전을 설치합니다. |

[eas/install_maestro source code](https://github.com/expo/eas-build/blob/main/packages/build-tools/src/steps/functions/installMaestro.ts) - GitHub에서 eas/install_maestro 함수의 source code를 확인하세요.

#### `eas/start_android_emulator`

앱 테스트에 사용할 Android Emulator를 시작합니다. Android용 build를 실행할 때만 사용할 수 있습니다.

> Android Emulator를 시작하려면 프로젝트가 old Build Infrastructure를 사용하도록 구성되어 있어야 합니다. 설정하려면 [Project settings](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/settings)로 이동하세요. 자세한 내용은 [이 changelog 글](https://expo.dev/changelog/2024/08-29-c3d-default)을 참고하세요.

```yaml
build:
  name: Build and test
  steps:
    - eas/build
    - eas/start_android_emulator:
        inputs:
          system_image_package: system-images;android-30;default;x86_64
    # ... Maestro setup and tests
```

| Input | Type | Description |
| --- | --- | --- |
| `device_name` | `string` | 생성할 기기 이름입니다. 여러 emulator를 시작할 때 원하는 이름으로 바꿀 수 있습니다. |
| `system_image_package` | `string` | emulator에 사용할 Android package 경로입니다. 예: `system-images;android-30;default;x86_64`. 사용 가능한 system image 목록을 확인하려면 로컬 컴퓨터에서 [`sdkmanager --list`](https://developer.android.com/tools/sdkmanager#list)를 실행하세요. VM은 x86_64 아키텍처에서 실행되므로 항상 `x86_64` package variant를 선택해야 합니다. [`sdkmanager` tool](https://developer.android.com/tools/sdkmanager)은 Android SDK command-line tools에 포함되어 있습니다. |

[eas/start_android_emulator source code](https://github.com/expo/eas-build/blob/main/packages/build-tools/src/steps/functions/startAndroidEmulator.ts) - GitHub에서 eas/start_android_emulator 함수의 source code를 확인하세요.

#### `eas/start_ios_simulator`

앱 테스트에 사용할 iOS Simulator를 시작합니다. iOS용 build를 실행할 때만 사용할 수 있습니다.

```yaml
build:
  name: Build and test
  steps:
    - eas/build
    - eas/start_ios_simulator
    # ... Maestro setup and tests
```

| Input | Type | Description |
| --- | --- | --- |
| `device_identifier` | `string` | 시작하려는 Simulator의 이름 또는 UDID입니다. 예: `iPhone [XY] Pro`, `AEF997BB-222C-4379-89BA-D21070B1D787`. **참고:** 사용 가능한 Simulator는 image마다 다릅니다. image를 바꾸면 같은 이름의 Simulator를 사용할 수 없게 될 수 있습니다. 예를 들어 Xcode 14 image에는 iPhone 14 Simulator가 있고, Xcode 15 image에는 iPhone 15 simulator가 있습니다. 일반적으로는 이 입력값을 제공하지 않는 것을 권장합니다. 자세한 내용은 [runner images](/build/eas-json#selecting-a-base-image)를 참고하세요. |

[eas/start_ios_simulator source code](https://github.com/expo/eas-build/blob/main/packages/build-tools/src/steps/functions/startIosSimulator.ts) - GitHub에서 eas/start_ios_simulator 함수의 source code를 확인하세요.

#### `eas/send_slack_message`

구성된 [Slack webhook URL](https://api.slack.com/messaging/webhooks)로 지정한 메시지를 전송하고, 관련 Slack channel에 게시합니다. 메시지는 plain text 또는 [Slack Block Kit](https://api.slack.com/block-kit) 메시지로 지정할 수 있습니다. 두 경우 모두 build job 속성과 [다른 step의 output](/custom-builds/schema#use-output-from-one-step-to-another)을 참조해 동적으로 평가되는 메시지를 만들 수 있습니다. 예를 들어 `'Build URL: ${ eas.job.expoBuildUrl }'`, `Build finished with status: ${ steps.run_fastlane.status_text }`, `Build failed with error: ${ steps.run_gradle.error_text }`처럼 사용할 수 있습니다. `message` 또는 `payload` 중 하나는 반드시 지정해야 하며, 둘 다 지정할 수는 없습니다.

```yaml
build:
  name: Slack your team from custom build
  steps:
    - eas/send_slack_message:
        name: Send Slack message to a given webhook URL
        inputs:
          message: 'This is a message to plain input URL'
          slack_hook_url: 'https://hooks.slack.com/services/[rest_of_hook_url]'
    - eas/send_slack_message:
        name: Send Slack message to a default webhook URL from SLACK_HOOK_URL secret
        inputs:
          message: 'This is a test message to default URL from SLACK_HOOK_URL secret'
    - eas/send_slack_message:
        name: Send Slack message to a webhook URL from specified secret
        inputs:
          message: 'This is a test message to a URL from specified secret'
          slack_hook_url: ${ eas.env.ANOTHER_SLACK_HOOK_URL }

    - eas/build
    - eas/send_slack_message:
        if: ${ always() }
        name: Send Slack message when the build finishes (Android)
        inputs:
          message: |
            This is a test message when Android build finishes
            Status: `${ steps.run_gradle.status_text }`
            Link: `${ eas.job.expoBuildUrl }`
    - eas/send_slack_message:
        if: ${ always() }
        name: Send Slack message when the build finishes (iOS)
        inputs:
          message: |
            This is a test message when iOS build finishes
            Status: `${ steps.run_fastlane.status_text }`
            Link: `${ eas.job.expoBuildUrl }`
    - eas/send_slack_message:
        if: ${ failure() }
        name: Send Slack message when the build fails (Android)
        inputs:
          message: |
            This is a test message when Android build fails
            Error: `${ steps.run_gradle.error_text }`
    - eas/send_slack_message:
        if: ${ failure() }
        name: Send Slack message when the build fails (iOS)
        inputs:
          message: |
            This is a test message when iOS build fails
            Error: `${ steps.run_fastlane.error_text }`
    - eas/send_slack_message:
        if: ${ success() }
        name: Send Slack message when the build succeeds
        inputs:
          message: |
            This is a test message when build succeeds
    - eas/send_slack_message:
        if: ${ always() }
        name: Send Slack message with Slack Block Kit layout
        inputs:
          payload:
            blocks:
              - type: section
                text:
                  type: mrkdwn
                  text: |-
                    Hello, Sir Developer

                     *Your build has finished!*
              - type: divider
              - type: section
                text:
                  type: mrkdwn
                  text: |-
                    *${ eas.env.EAS_BUILD_ID }*
                    *Status:* `${ steps.run_gradle.status_text }`
                    *Link:* `${ eas.job.expoBuildUrl }`
                accessory:
                  type: image
                  image_url: [your_image_url]
                  alt_text: alt text for image
              - type: divider
              - type: actions
                elements:
                  - type: button
                    text:
                      type: plain_text
                      text: 'Do a thing :rocket:'
                      emoji: true
                    value: a_thing
                  - type: button
                    text:
                      type: plain_text
                      text: 'Do another thing :x:'
                      emoji: true
                    value: another_thing
```

| Input | Type | Description |
| --- | --- | --- |
| `message` | `string` | 전송할 메시지 텍스트입니다. 예: `'This is the content of the message'`. **참고:** `message` 또는 `payload` 중 하나는 반드시 제공해야 하며, 둘 다 제공할 수는 없습니다. |
| `payload` | `string` | [Slack Block Kit](https://api.slack.com/block-kit) 레이아웃을 사용해 정의한 메시지 내용입니다. **참고:** `message` 또는 `payload` 중 하나는 반드시 제공해야 하며, 둘 다 제공할 수는 없습니다. |
| `slack_hook_url` | `string` | 미리 구성한 Slack webhook URL로, 지정한 channel에 메시지를 게시합니다. `slack_hook_url: 'https://hooks.slack.com/services/[rest_of_hook_url]'`처럼 plain URL을 제공하거나, `slack_hook_url: ${ eas.env.ANOTHER_SLACK_HOOK_URL }`처럼 EAS secret을 사용할 수 있습니다. 또는 기본 webhook URL로 동작하는 `SLACK_HOOK_URL` secret을 설정할 수도 있습니다. 이 마지막 경우에는 `slack_hook_url` 입력값을 따로 제공할 필요가 없습니다. |

[eas/send_slack_message source code](https://github.com/expo/eas-build/blob/main/packages/build-tools/src/steps/functions/sendSlackMessage.ts) - GitHub에서 eas/send_slack_message 함수의 source code를 확인하세요.

### built-in EAS 함수로 앱 build하기

built-in EAS 함수를 사용하면 서로 다른 build 유형에 대해 기본 EAS Build 프로세스를 다시 구성할 수 있습니다.

예를 들어 Android의 internal distribution build와 iOS의 simulator build를 만드는 build를 트리거하려면 다음 구성을 사용할 수 있습니다:

```json
{
  ... 
  "build": {
    ... 
    "developmentBuild": {
      "distribution": "internal",
      "android": {
        "config": "development-build-android.yml"
      },
      "ios": {
        "simulator": true,
        "config": "development-build-ios.yml"
      }
    }
    ... 
  }
  ... 
}
```

```yaml
build:
  name: Simple internal distribution Android build
  steps:
    - eas/checkout

    - eas/install_node_modules

    - eas/prebuild

    - eas/inject_android_credentials

    - eas/run_gradle

    - eas/find_and_upload_build_artifacts
```

```yaml
build:
  name: Simple simulator iOS build
  steps:
    - eas/checkout

    - eas/install_node_modules

    - eas/prebuild

    - run:
        name: Install pods
        working_directory: ./ios
        command: pod install

    - eas/generate_gymfile_from_template

    - eas/run_fastlane

    - eas/find_and_upload_build_artifacts
```

Android용 Google Play Store build와 iOS용 Apple App Store build를 만들려면 다음 구성을 사용할 수 있습니다:

```json
{
  ... 
  "build": {
    ... 
    "productionBuild": {
      "android": {
        "config": "production-build-android.yml"
      },
      "ios": {
        "config": "production-build-ios.yml"
      }
    }
    ... 
  }
  ... 
}
```

```yaml
build:
  name: Customized Android Play Store build example
  steps:
    - eas/checkout

    - eas/install_node_modules

    - eas/prebuild

    - eas/inject_android_credentials

    - eas/run_gradle

    - eas/find_and_upload_build_artifacts
```

```yaml
build:
  name: Customized iOS App Store build example
  steps:
    - eas/checkout

    - eas/install_node_modules

    - eas/resolve_apple_team_id_from_credentials:
        id: resolve_apple_team_id_from_credentials

    - eas/prebuild:
        inputs:
          apple_team_id: ${ steps.resolve_apple_team_id_from_credentials.apple_team_id }

    - run:
        name: Install pods
        working_directory: ./ios
        command: pod install

    - eas/configure_ios_credentials

    - eas/generate_gymfile_from_template:
        inputs:
          credentials: ${ eas.job.secrets.buildCredentials }

    - eas/run_fastlane

    - eas/find_and_upload_build_artifacts
```

더 자세한 예시는 **example repository**를 확인하세요:

[Custom build example repository](https://github.com/expo/eas-custom-builds-example/tree/main) - 함수 설정, environment variable 사용, artifact 업로드 등 custom build 예제를 포함한 custom EAS Build 예제입니다.

### `build`에서 재사용 가능한 함수 사용하기

예를 들어 다음 재사용 함수가 포함된 custom build config는 echo되는 메시지를 출력하는 단일 명령을 포함합니다.

```yaml
functions:
  greetings:
    - name: name
      default_value: Hello world
    inputs: [value]
    command: echo "${ inputs.name }, { inputs.value }"
```

위 함수는 `build`에서 다음과 같이 사용할 수 있습니다:

```yaml
build:
  name: Functions Demo
  steps:
    - greetings:
        inputs:
          value: Expo
```

> **팁:** `build.steps`는 여러 reusable `functions`를 순차적으로 실행할 수 있습니다.

## `build`에서 값 재정의하기

다음 속성의 값을 재정의할 수 있습니다:

-   `working_directory`
-   `name`
-   `shell`

예를 들어 `list_files`라는 reusable 함수가 있다고 가정해 보겠습니다:

```yaml
functions:
  list_files:
    name: List files
    command: ls -la
```

build config에서 `list_files`를 호출하면 프로젝트의 root 디렉터리에 있는 모든 파일을 나열합니다:

```yaml
build:
  name: List files
  steps:
    - eas/checkout
    - list_files
```

다른 디렉터리에 있는 파일을 나열하도록 함수 호출의 동작을 바꾸려면 `working_directory` 속성을 사용해 해당 디렉터리 경로를 지정할 수 있습니다:

```yaml
build:
  name: List files
    steps:
      - eas/checkout
      - list_files:
          working_directory: /a/b/c
```
