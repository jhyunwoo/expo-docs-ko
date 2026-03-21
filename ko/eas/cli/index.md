---
modificationDate: March 12, 2026
title: EAS CLI 레퍼런스
description: EAS CLI는 터미널에서 Expo Application Services(EAS)와 상호작용할 수 있게 해 주는 명령줄 도구입니다.
cliVersion: 18.3.0
---

# EAS CLI 레퍼런스

EAS CLI는 터미널에서 Expo Application Services(EAS)와 상호작용할 수 있게 해 주는 명령줄 도구입니다.

CLI 버전:

18.3.0

CLI 버전 18.3.0

터미널 창에서 EAS Command-Line Interface(CLI)를 사용해 Expo 및 React Native 프로젝트에서 build, update, submit, deploy를 수행하거나 workflow를 사용할 수 있습니다.

## 설치

EAS CLI를 머신에 전역으로 설치해야 합니다. 다음 명령을 실행하면 됩니다:

```sh
# npm
npm install --global eas-cli

# yarn
yarn global add eas-cli

# pnpm
pnpm add -g eas-cli

# bun
bun add -g eas-cli
```

또는 패키지 관리자가 제공하는 CLI 도구를 사용해 EAS CLI 명령을 실행할 수도 있습니다:

```sh
# npm
npx eas-cli@latest

# yarn
yarn dlx eas-cli@latest

# pnpm
pnpm dlx eas-cli@latest

# bun
bunx eas-cli@latest
```

## 명령어

이 페이지에 문서화된 명령 중 하나를 실행해 EAS CLI를 사용할 수 있으며, 필요에 따라 플래그나 인자를 뒤에 붙일 수 있습니다. 플래그는 명령의 동작을 세부 조정하고, 인자는 해당 명령에만 적용됩니다.

### `eas account:login`

Expo 계정으로 로그인합니다.

#### 사용법

```sh
eas account:login [-s] [-b]
```

#### 플래그

-   `-b, --browser` 브라우저로 로그인합니다.
-   `-s, --sso` SSO로 로그인합니다.

#### 별칭

```sh
eas login
```

### `eas account:logout`

로그아웃합니다.

#### 사용법

```sh
eas account:logout
```

#### 별칭

```sh
eas logout
```

### `eas account:usage [ACCOUNT_NAME]`

현재 주기의 계정 사용량과 청구 정보를 확인합니다.

#### 사용법

```sh
eas account:usage [ACCOUNT_NAME] [--json] [--non-interactive]
```

#### 인자

-   `[ACCOUNT_NAME]` 사용량을 확인할 account 이름입니다. 제공하지 않으면 account를 대화형으로 선택합니다(또는 account가 하나뿐이면 해당 account가 기본값이 됩니다).

#### 플래그

-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.

### `eas account:view`

현재 로그인한 사용자 이름을 표시합니다.

#### 사용법

```sh
eas account:view
```

#### 별칭

```sh
eas whoami
```

### `eas analytics [STATUS]`

analytics 설정을 표시하거나 변경합니다.

#### 사용법

```sh
eas analytics [STATUS]
```

### `eas autocomplete [SHELL]`

autocomplete 설치 지침을 표시합니다.

#### 사용법

```sh
eas autocomplete [SHELL] [-r]
```

#### 인자

-   `[SHELL]` (zsh|bash|powershell) 셸 유형입니다.

#### 플래그

-   `-r, --refresh-cache` 캐시를 새로고침합니다(지침 표시를 무시합니다).

#### 예시

```sh
eas autocomplete
eas autocomplete bash
eas autocomplete zsh
eas autocomplete powershell
eas autocomplete --refresh-cache
```

### `eas branch:create [NAME]`

branch를 생성합니다.

#### 사용법

```sh
eas branch:create [NAME] [--json] [--non-interactive]
```

#### 인자

-   `[NAME]` 생성할 branch 이름입니다.

#### 플래그

-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.

### `eas branch:delete [NAME]`

branch를 삭제합니다.

#### 사용법

```sh
eas branch:delete [NAME] [--json] [--non-interactive]
```

#### 인자

-   `[NAME]` 삭제할 branch 이름입니다.

#### 플래그

-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.

### `eas branch:list`

모든 branch를 나열합니다.

#### 사용법

```sh
eas branch:list [--offset ] [--limit ] [--json] [--non-interactive]
```

#### 플래그

-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--limit=<value>` 각 쿼리에서 가져올 항목 수입니다. 기본값은 50이며 최대 100입니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--offset=<value>` 지정한 인덱스부터 쿼리를 시작합니다. 결과 페이지네이션에 사용합니다. 기본값은 0입니다.

### `eas branch:rename`

branch 이름을 변경합니다.

#### 사용법

```sh
eas branch:rename [--from ] [--to ] [--json] [--non-interactive]
```

#### 플래그

-   `--from=<value>` 현재 branch 이름입니다.
-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--to=<value>` 새 branch 이름입니다.

### `eas branch:view [NAME]`

branch를 확인합니다.

#### 사용법

```sh
eas branch:view [NAME] [--offset ] [--limit ] [--json] [--non-interactive]
```

#### 인자

-   `[NAME]` 조회할 branch 이름입니다.

#### 플래그

-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--limit=<value>` 각 쿼리에서 가져올 항목 수입니다. 기본값은 25이며 최대 50입니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--offset=<value>` 지정한 인덱스부터 쿼리를 시작합니다. 결과 페이지네이션에 사용합니다. 기본값은 0입니다.

### `eas build`

build를 시작합니다.

#### 사용법

```sh
eas build [-p android|ios|all] [-e PROFILE_NAME] [--local] [--output ] [--wait] [--clear-cache]
[-s | --auto-submit-with-profile PROFILE_NAME] [--what-to-test ] [-m ] [--build-logger-level
trace|debug|info|warn|error|fatal] [--freeze-credentials] [--verbose-logs] [--json] [--non-interactive]
```

#### 플래그

-   `-e, --profile=PROFILE_NAME` eas.json의 build profile 이름입니다. eas.json에 정의되어 있으면 기본값은 "production"입니다.
-   `-m, --message=<value>` build을(를) 설명하는 짧은 메시지입니다.
-   `-p, --platform=<option>` <options: android|ios|all>.
-   `-s, --auto-submit` build가 완료되면 build profile과 같은 이름의 submit profile을 사용해 제출합니다.
-   `--auto-submit-with-profile=PROFILE_NAME` build가 완료되면 제공된 이름의 submit profile을 사용해 제출합니다.
-   `--build-logger-level=<option>` build 과정에서 출력할 로그 수준입니다. 기본값은 "info"입니다. <options: trace|debug|info|warn|error|fatal>.
-   `--clear-cache` build 전에 캐시를 비웁니다.
-   `--freeze-credentials` 비대화형 모드에서 build가 credentials를 업데이트하지 못하게 합니다.
-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--local` build를 로컬에서 실행합니다 [experimental].
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--output=<value>` 로컬 build의 출력 경로입니다.
-   `--verbose-logs` build 과정에서 상세 로그를 사용합니다.
-   `--[no-]wait` build가 완료될 때까지 기다립니다.
-   `--what-to-test=<value>` TestFlight에서 build의 "What to Test" 정보를 지정합니다(iOS 전용). `auto-submit` 플래그와 함께 사용합니다.

### `eas build:cancel [BUILD_ID]`

build를 취소합니다.

#### 사용법

```sh
eas build:cancel [BUILD_ID] [--non-interactive] [-p android|ios|all] [-e PROFILE_NAME]
```

#### 플래그

-   `-e, --profile=PROFILE_NAME` build ID를 제공하지 않은 경우 build profile로 build를 필터링합니다.
-   `-p, --platform=<option>` build ID를 제공하지 않은 경우 platform으로 build를 필터링합니다 <options: android|ios|all>.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.

### `eas build:configure`

프로젝트가 EAS Build를 지원하도록 구성합니다.

#### 사용법

```sh
eas build:configure [-p android|ios|all]
```

#### 플래그

-   `-p, --platform=<option>` 구성할 platform입니다 <options: android|ios|all>.

### `eas build:delete [BUILD_ID]`

build를 삭제합니다.

#### 사용법

```sh
eas build:delete [BUILD_ID] [--non-interactive] [-p android|ios|all] [-e PROFILE_NAME]
```

#### 플래그

-   `-e, --profile=PROFILE_NAME` build ID를 제공하지 않은 경우 build profile로 build를 필터링합니다.
-   `-p, --platform=<option>` build ID를 제공하지 않은 경우 platform으로 build를 필터링합니다 <options: android|ios|all>.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.

### `eas build:dev`

일치하는 fingerprint를 가진 dev client simulator/emulator build를 실행하거나 새로 생성합니다.

#### 사용법

```sh
eas build:dev [-p ios|android] [-e PROFILE_NAME]
```

#### 플래그

-   `-e, --profile=PROFILE_NAME` eas.json의 build profile 이름입니다. emulator/simulator용 internal distribution dev client build를 생성할 수 있는 profile이어야 합니다. 기본적으로 "development-simulator" build profile이 선택됩니다.
-   `-p, --platform=<option>` <options: ios|android>.

### `eas build:download`

지정한 fingerprint hash에 대한 simulator/emulator build를 다운로드합니다.

#### 사용법

```sh
eas build:download --fingerprint  [-p ios|android] [--dev-client] [--json] [--non-interactive]
```

#### 플래그

-   `-p, --platform=<option>` <options: ios|android>.
-   `--[no-]dev-client` dev-client build만 필터링합니다.
-   `--fingerprint=<value>` (required) 다운로드할 build의 fingerprint hash입니다.
-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.

### `eas build:inspect`

특정 build 단계에서 프로젝트 상태를 검사합니다. 문제 해결에 유용합니다.

#### 사용법

```sh
eas build:inspect -p android|ios -s archive|pre-build|post-build -o OUTPUT_DIRECTORY [-e PROFILE_NAME]
[--force] [-v]
```

#### 플래그

-   `-e, --profile=PROFILE_NAME` eas.json의 build profile 이름입니다. eas.json에 정의되어 있으면 기본값은 "production"입니다.
-   `-o, --output=OUTPUT_DIRECTORY` (required) 출력 디렉터리입니다.
-   `-p, --platform=<option>` (required) <options: android|ios>.
-   `-s, --stage=<option>` (required) 검사할 build 단계입니다.
    -   `archive` build 시 EAS에 업로드될 프로젝트 archive를 생성합니다.
    -   `pre-build` Gradle/Xcode로 build할 수 있도록 프로젝트를 준비합니다. native build는 실행하지 않습니다.
    -   `post-build` native 프로젝트를 build하고 검사할 수 있도록 출력 디렉터리를 남겨 둡니다 <options: archive|pre-build|post-build>.
-   `-v, --verbose`
-   `--force` OUTPUT_DIRECTORY가 이미 존재하면 삭제합니다.

### `eas build:list`

프로젝트의 모든 build를 나열합니다.

#### 사용법

```sh
eas build:list [-p android|ios|all] [--status
new|in-queue|in-progress|pending-cancel|errored|finished|canceled] [--distribution store|internal|simulator]
[--channel ] [--app-version ] [--app-build-version ] [--sdk-version ] [--runtime-version
] [--app-identifier ] [-e ] [--git-commit-hash ] [--fingerprint-hash ] [--offset
] [--limit ] [--json] [--non-interactive] [--simulator]
```

#### 플래그

-   `-e, --build-profile=<value>` 지정한 build profile로 생성된 build만 필터링합니다.
-   `-p, --platform=<option>` <options: android|ios|all>.
-   `--app-build-version=<value>` 지정한 app build version로 생성된 build만 필터링합니다.
-   `--app-identifier=<value>` 지정한 app identifier로 생성된 build만 필터링합니다.
-   `--app-version=<value>` 지정한 main app version로 생성된 build만 필터링합니다.
-   `--channel=<value>`
-   `--distribution=<option>` 지정한 distribution type <options: store|internal|simulator>을(를) 가진 build만 필터링합니다.
-   `--fingerprint-hash=<value>` 지정한 fingerprint hash을(를) 가진 build만 필터링합니다.
-   `--git-commit-hash=<value>` 지정한 git commit hash로 생성된 build만 필터링합니다.
-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--limit=<value>` 각 쿼리에서 가져올 항목 수입니다. 기본값은 10이며 최대 50입니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--offset=<value>` 지정한 인덱스부터 쿼리를 시작합니다. 결과 페이지네이션에 사용합니다. 기본값은 0입니다.
-   `--runtime-version=<value>` 지정한 runtime version로 생성된 build만 필터링합니다.
-   `--sdk-version=<value>` 지정한 Expo SDK version로 생성된 build만 필터링합니다.
-   `--simulator` `--platform` 플래그가 "ios"로 설정된 경우에만 사용할 수 있으며, iOS simulator build만 필터링합니다.
-   `--status=<option>` 지정한 status <options: new|in-queue|in-progress|pending-cancel|errored|finished|canceled>을(를) 가진 build만 필터링합니다.

### `eas build:resign`

build archive를 다시 서명합니다.

#### 사용법

```sh
eas build:resign [-p android|ios] [-e PROFILE_NAME] [--source-profile PROFILE_NAME] [--wait] [--id ]
[--offset ] [--limit ] [--json] [--non-interactive]
```

#### 플래그

-   `-e, --target-profile=PROFILE_NAME` eas.json의 대상 build profile 이름입니다. 이 profile의 credentials와 환경 변수가 재서명 시 사용됩니다. eas.json에 정의되어 있으면 기본값은 "production"입니다.
-   `-p, --platform=<option>` <options: android|ios>.
-   `--id=<value>` 재서명할 build ID입니다.
-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--limit=<value>` 각 쿼리에서 가져올 항목 수입니다. 기본값은 50이며 최대 100입니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--offset=<value>` 지정한 인덱스부터 쿼리를 시작합니다. 결과 페이지네이션에 사용합니다. 기본값은 0입니다.
-   `--source-profile=PROFILE_NAME` eas.json의 소스 build profile 이름입니다. 재서명 가능한 build를 필터링하는 데 사용됩니다.
-   `--[no-]wait` build가 완료될 때까지 기다립니다.

### `eas build:run`

eas-cli에서 simulator/emulator build를 실행합니다.

#### 사용법

```sh
eas build:run [--latest | --id  | --path  | --url ] [-p android|ios] [-e PROFILE_NAME]
[--offset ] [--limit ]
```

#### 플래그

-   `-e, --profile=PROFILE_NAME` 실행할 build를 만들 때 사용한 build profile 이름입니다. 지정하면 해당 build profile로 생성된 build만 조회합니다.
-   `-p, --platform=<option>` <options: android|ios>.
-   `--id=<value>` 실행할 simulator/emulator build ID입니다.
-   `--latest` 지정한 platform의 최신 simulator/emulator build를 실행합니다.
-   `--limit=<value>` 각 쿼리에서 가져올 항목 수입니다. 기본값은 50이며 최대 100입니다.
-   `--offset=<value>` 지정한 인덱스부터 쿼리를 시작합니다. 결과 페이지네이션에 사용합니다. 기본값은 0입니다.
-   `--path=<value>` simulator/emulator build archive or app 경로입니다.
-   `--url=<value>` Simulator/Emulator build archive URL입니다.

### `eas build:submit`

앱 binary를 App Store 및/또는 Play Store에 제출합니다.

#### 사용법

```sh
eas build:submit [-p android|ios|all] [-e ] [--latest | --id  | --path  | --url ]
[--what-to-test ] [--verbose] [--wait] [--verbose-fastlane] [-g ...] [--non-interactive]
```

#### 플래그

-   `-e, --profile=<value>` eas.json의 submit profile 이름입니다. eas.json에 정의되어 있으면 기본값은 "production"입니다.
-   `-g, --groups=<value>...` build를 추가할 내부 TestFlight 테스트 그룹입니다(iOS 전용). 자세히 알아보기: [https://developer.apple.com/help/app-store-connect/test-a-beta-version/add-internal-testers](https://developer.apple.com/help/app-store-connect/test-a-beta-version/add-internal-testers).
-   `-p, --platform=<option>` <options: android|ios|all>.
-   `--id=<value>` 제출할 build ID입니다.
-   `--latest` 지정한 platform의 최신 build를 제출합니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--path=<value>` **.apk**/**.aab**/**.ipa** file 경로입니다.
-   `--url=<value>` 앱 archive URL입니다.
-   `--verbose` EAS Submit의 로그를 항상 출력합니다.
-   `--verbose-fastlane` 제출 과정의 상세 로깅을 활성화합니다.
-   `--[no-]wait` 제출이 완료될 때까지 기다립니다.
-   `--what-to-test=<value>` TestFlight의 "What to test" 정보를 설정합니다(iOS 전용).

#### 별칭

```sh
eas build:submit
```

### `eas build:version:get`

EAS 서버에서 최신 version을 가져옵니다.

#### 사용법

```sh
eas build:version:get [-p android|ios|all] [-e PROFILE_NAME] [--json] [--non-interactive]
```

#### 플래그

-   `-e, --profile=PROFILE_NAME` eas.json의 build profile 이름입니다. eas.json에 정의되어 있으면 기본값은 "production"입니다.
-   `-p, --platform=<option>` <options: android|ios|all>.
-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.

### `eas build:version:set`

앱 version을 업데이트합니다.

#### 사용법

```sh
eas build:version:set [-p android|ios] [-e PROFILE_NAME]
```

#### 플래그

-   `-e, --profile=PROFILE_NAME` eas.json의 build profile 이름입니다. eas.json에 정의되어 있으면 기본값은 "production"입니다.
-   `-p, --platform=<option>` <options: android|ios>.

### `eas build:version:sync`

EAS 서버에 저장된 값으로 native code의 version을 업데이트합니다.

#### 사용법

```sh
eas build:version:sync [-p android|ios|all] [-e PROFILE_NAME]
```

#### 플래그

-   `-e, --profile=PROFILE_NAME` eas.json의 build profile 이름입니다. eas.json에 정의되어 있으면 기본값은 "production"입니다.
-   `-p, --platform=<option>` <options: android|ios|all>.

### `eas build:view [BUILD_ID]`

프로젝트의 build를 확인합니다.

#### 사용법

```sh
eas build:view [BUILD_ID] [--json]
```

#### 플래그

-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다.

### `eas channel:create [NAME]`

channel을 생성합니다.

#### 사용법

```sh
eas channel:create [NAME] [--json] [--non-interactive]
```

#### 인자

-   `[NAME]` 생성할 channel 이름입니다.

#### 플래그

-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.

### `eas channel:delete [NAME]`

channel을 삭제합니다.

#### 사용법

```sh
eas channel:delete [NAME] [--json] [--non-interactive]
```

#### 인자

-   `[NAME]` 삭제할 channel 이름입니다.

#### 플래그

-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.

### `eas channel:edit [NAME]`

channel이 새 branch를 가리키도록 설정합니다.

#### 사용법

```sh
eas channel:edit [NAME] [--branch ] [--json] [--non-interactive]
```

#### 인자

-   `[NAME]` 수정할 channel 이름입니다.

#### 플래그

-   `--branch=<value>` 가리킬 branch 이름입니다.
-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.

### `eas channel:list`

모든 channel을 나열합니다.

#### 사용법

```sh
eas channel:list [--offset ] [--limit ] [--json] [--non-interactive]
```

#### 플래그

-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--limit=<value>` 각 쿼리에서 가져올 항목 수입니다. 기본값은 10이며 최대 25입니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--offset=<value>` 지정한 인덱스부터 쿼리를 시작합니다. 결과 페이지네이션에 사용합니다. 기본값은 0입니다.

### `eas channel:pause [NAME]`

channel을 일시 중지해 update 전송을 멈춥니다.

#### 사용법

```sh
eas channel:pause [NAME] [--branch ] [--json] [--non-interactive]
```

#### 인자

-   `[NAME]` 수정할 channel 이름입니다.

#### 플래그

-   `--branch=<value>` 가리킬 branch 이름입니다.
-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.

### `eas channel:resume [NAME]`

channel을 재개해 update 전송을 시작합니다.

#### 사용법

```sh
eas channel:resume [NAME] [--branch ] [--json] [--non-interactive]
```

#### 인자

-   `[NAME]` 수정할 channel 이름입니다.

#### 플래그

-   `--branch=<value>` 가리킬 branch 이름입니다.
-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.

### `eas channel:rollout [CHANNEL]`

channel에서 새 branch를 점진적으로 롤아웃합니다.

#### 사용법

```sh
eas channel:rollout [CHANNEL] [--action create|edit|end|view] [--percent ] [--outcome
republish-and-revert|revert] [--branch ] [--runtime-version ] [--private-key-path ] [--json]
[--non-interactive]
```

#### 인자

-   `[CHANNEL]` 롤아웃을 수행할 channel입니다.

#### 플래그

-   `--action=<option>` 수행할 rollout 동작입니다 <options: create|edit|end|view>.
-   `--branch=<value>` `--action=create`와 함께 사용할 롤아웃 대상 branch입니다.
-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--outcome=<option>` `--action=end`와 함께 사용할 rollout 종료 결과입니다 <options: republish-and-revert|revert>.
-   `--percent=<value>` `--action=edit` 또는 `--action=create`와 함께 사용할, 새 branch로 보낼 사용자 비율입니다.
-   `--private-key-path=<value>` expo-updates 구성의 certificate에 대응하는 PEM 인코딩 private key가 들어 있는 파일입니다. 기본값은 certificate 디렉터리의 "**private-key.pem**" 파일입니다. code signing을 사용하는 경우에만 관련 있습니다: [https://docs.expo.dev/eas-update/code-signing/](https://docs.expo.dev/eas-update/code-signing/).
-   `--runtime-version=<value>` `--action=create`와 함께 사용할 대상 runtime version입니다.

### `eas channel:view [NAME]`

channel을 확인합니다.

#### 사용법

```sh
eas channel:view [NAME] [--json] [--non-interactive] [--offset ] [--limit ]
```

#### 인자

-   `[NAME]` 조회할 channel 이름입니다.

#### 플래그

-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--limit=<value>` 각 쿼리에서 가져올 항목 수입니다. 기본값은 50이며 최대 100입니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--offset=<value>` 지정한 인덱스부터 쿼리를 시작합니다. 결과 페이지네이션에 사용합니다. 기본값은 0입니다.

### `eas config`

프로젝트 구성(**app.json** + **eas.json**)을 표시합니다.

#### 사용법

```sh
eas config [-p android|ios] [-e PROFILE_NAME] [--json] [--non-interactive]
```

#### 플래그

-   `-e, --profile=PROFILE_NAME` eas.json의 build profile 이름입니다. eas.json에 정의되어 있으면 기본값은 "production"입니다.
-   `-p, --platform=<option>` <options: android|ios>.
-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.

### `eas credentials`

credentials를 관리합니다.

#### 사용법

```sh
eas credentials [-p android|ios]
```

#### 플래그

-   `-p, --platform=<option>` <options: android|ios>.

### `eas credentials:configure-build`

프로젝트 build용 credentials를 설정합니다.

#### 사용법

```sh
eas credentials:configure-build [-p android|ios] [-e PROFILE_NAME]
```

#### 플래그

-   `-e, --profile=PROFILE_NAME` eas.json의 build profile 이름입니다.
-   `-p, --platform=<option>` <options: android|ios>.

### `eas deploy [options]`

Expo Router web build와 API Routes를 배포합니다.

#### 사용법

```sh
eas deploy [options]
eas deploy --prod
```

#### 플래그

-   `--alias=name` 새 deployment에 할당할 custom alias입니다.
-   `--dry-run` 업로드하는 대신 새 deployment의 tarball을 출력합니다.
-   `--environment=<value>` 예: 'production', 'preview', 'development'와 같은 환경 변수의 environment입니다.
-   `--export-dir=dir` [default: dist] Expo 프로젝트가 export된 디렉터리입니다.
-   `--id=xyz123` 새 deployment의 custom 고유 식별자입니다.
-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--prod` 새 production deployment를 생성합니다.
-   `--[no-]source-maps` deployment에 source map을 포함합니다.

#### 별칭

```sh
eas worker:deploy
```

### `eas deploy:alias`

deployment alias를 할당합니다.

#### 사용법

```sh
eas deploy:alias [--prod] [--alias name] [--id xyz123] [--json] [--non-interactive]
```

#### 플래그

-   `--alias=name` 기존 deployment에 할당할 custom alias입니다.
-   `--id=xyz123` 기존 deployment의 고유 식별자입니다.
-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--prod` 기존 deployment를 production으로 승격합니다.

#### Aliases

```sh
eas worker:alias
eas deploy:promote
```

### `eas deploy:alias:delete [ALIAS_NAME]`

deployment alias를 삭제합니다.

#### 사용법

```sh
eas deploy:alias:delete [ALIAS_NAME] [--json] [--non-interactive]
```

#### 플래그

-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.

#### 별칭

```sh
eas worker:alias:delete
```

### `eas deploy:delete [DEPLOYMENT_ID]`

deployment를 삭제합니다.

#### 사용법

```sh
eas deploy:delete [DEPLOYMENT_ID] [--json] [--non-interactive]
```

#### 플래그

-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.

#### 별칭

```sh
eas worker:delete
```

### `eas deploy:promote`

deployment alias를 할당합니다.

#### 사용법

```sh
eas deploy:promote [--prod] [--alias name] [--id xyz123] [--json] [--non-interactive]
```

#### 플래그

-   `--alias=name` 기존 deployment에 할당할 custom alias입니다.
-   `--id=xyz123` 기존 deployment의 고유 식별자입니다.
-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--prod` 기존 deployment를 production으로 승격합니다.

#### Aliases

```sh
eas worker:alias
eas deploy:promote
```

### `eas device:create`

internal distribution에 사용할 새 Apple Device를 등록합니다.

#### 사용법

```sh
eas device:create
```

### `eas device:delete`

계정에서 등록된 device를 제거합니다.

#### 사용법

```sh
eas device:delete [--apple-team-id ] [--udid ] [--json] [--non-interactive]
```

#### 플래그

-   `--apple-team-id=<value>` device를 찾을 Apple team ID입니다.
-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--udid=<value>` 비활성화할 Apple device ID입니다.

### `eas device:list`

계정에 등록된 모든 device를 나열합니다.

#### 사용법

```sh
eas device:list [--apple-team-id ] [--offset ] [--limit ] [--json] [--non-interactive]
```

#### 플래그

-   `--apple-team-id=<value>`
-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--limit=<value>` 각 쿼리에서 가져올 항목 수입니다. 기본값은 50이며 최대 100입니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--offset=<value>` 지정한 인덱스부터 쿼리를 시작합니다. 결과 페이지네이션에 사용합니다. 기본값은 0입니다.

### `eas device:rename`

등록된 device 이름을 변경합니다.

#### 사용법

```sh
eas device:rename [--apple-team-id ] [--udid ] [--name ] [--json] [--non-interactive]
```

#### 플래그

-   `--apple-team-id=<value>` device를 찾을 Apple team ID입니다.
-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--name=<value>` device의 새 이름입니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--udid=<value>` 이름을 변경할 Apple device ID입니다.

### `eas device:view [UDID]`

프로젝트의 device를 확인합니다.

#### 사용법

```sh
eas device:view [UDID]
```

### `eas diagnostics`

환경 정보를 표시합니다.

#### 사용법

```sh
eas diagnostics
```

### `eas env:create [ENVIRONMENT]`

현재 프로젝트 또는 계정의 환경 변수를 생성합니다.

#### 사용법

```sh
eas env:create [ENVIRONMENT] [--name ] [--value ] [--force] [--type string|file] [--visibility
plaintext|sensitive|secret] [--scope project|account] [--environment ...] [--non-interactive]
```

#### 인자

-   `[ENVIRONMENT]` 변수를 생성할 environment입니다. 기본 environment는 'production', 'preview', 'development'입니다.

#### 플래그

-   `--environment=<value>...` 예: 'production', 'preview', 'development'와 같은 환경 변수의 environment입니다.
-   `--force` 기존 변수를 덮어씁니다.
-   `--name=<value>` 변수 이름입니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--scope=<option>` [default: project] 변수의 범위입니다 <options: project|account>.
-   `--type=<option>` 변수 유형입니다 <options: string|file>.
-   `--value=<value>` 변수의 텍스트 값입니다.
-   `--visibility=<option>` 변수의 가시성입니다 <options: plaintext|sensitive|secret>.

### `eas env:delete [ENVIRONMENT]`

현재 프로젝트 또는 계정의 환경 변수를 삭제합니다.

#### 사용법

```sh
eas env:delete [ENVIRONMENT] [--variable-name ] [--variable-environment ] [--scope
project|account] [--non-interactive]
```

#### 인자

-   `[ENVIRONMENT]` 삭제할 변수의 현재 environment입니다. 기본 environment는 'production', 'preview', 'development'입니다.

#### 플래그

-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--scope=<option>` [default: project] 변수의 범위입니다 <options: project|account>.
-   `--variable-environment=<value>` 삭제할 변수의 현재 environment입니다.
-   `--variable-name=<value>` 삭제할 variable 이름입니다.

### `eas env:exec ENVIRONMENT BASH_COMMAND`

선택한 환경의 환경 변수를 사용해 명령을 실행합니다.

#### 사용법

```sh
eas env:exec ENVIRONMENT BASH_COMMAND [--non-interactive]
```

#### 인자

-   `ENVIRONMENT` 명령을 실행할 environment입니다. 기본 environment는 'production', 'preview', 'development'입니다.
-   `BASH_COMMAND` 해당 environment의 환경 변수를 사용해 실행할 Bash 명령입니다.

#### 플래그

-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.

### `eas env:get [ENVIRONMENT]`

현재 프로젝트 또는 계정의 환경 변수를 확인합니다.

#### 사용법

```sh
eas env:get [ENVIRONMENT] [--variable-name ] [--variable-environment ] [--format
long|short] [--scope project|account] [--non-interactive]
```

#### 인자

-   `[ENVIRONMENT]` 변수의 현재 environment입니다. 기본 environment는 'production', 'preview', 'development'입니다.

#### 플래그

-   `--format=<option>` [default: short] 출력 형식입니다 <options: long|short>.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--scope=<option>` [default: project] 변수의 범위입니다 <options: project|account>.
-   `--variable-environment=<value>` 변수의 현재 environment입니다.
-   `--variable-name=<value>` 변수 이름입니다.

### `eas env:list [ENVIRONMENT]`

현재 프로젝트 또는 계정의 환경 변수를 나열합니다.

#### 사용법

```sh
eas env:list [ENVIRONMENT] [--include-sensitive] [--include-file-content] [--environment ...]
[--format long|short] [--scope project|account]
```

#### 인자

-   `[ENVIRONMENT]` 변수를 나열할 environment입니다. 기본 environment는 'production', 'preview', 'development'입니다.

#### 플래그

-   `--environment=<value>...` 예: 'production', 'preview', 'development'와 같은 환경 변수의 environment입니다.
-   `--format=<option>` [default: short] 출력 형식입니다 <options: long|short>.
-   `--include-file-content` 출력에 파일 내용을 표시합니다.
-   `--include-sensitive` 출력에 민감한 값을 표시합니다.
-   `--scope=<option>` [default: project] 변수의 범위입니다 <options: project|account>.

### `eas env:pull [ENVIRONMENT]`

선택한 환경의 환경 변수를 **.env** 파일로 가져옵니다.

#### 사용법

```sh
eas env:pull [ENVIRONMENT] [--non-interactive] [--environment ] [--path ]
```

#### 인자

-   `[ENVIRONMENT]` 변수를 가져올 environment입니다. 기본 environment는 'production', 'preview', 'development'입니다.

#### 플래그

-   `--environment=<value>` 예: 'production', 'preview', 'development'와 같은 환경 변수의 environment입니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--path=<value>` [default: **.env.local**] 결과 `.env` 파일 경로입니다.

### `eas env:push [ENVIRONMENT]`

**.env** 파일의 환경 변수를 선택한 환경으로 푸시합니다.

#### 사용법

```sh
eas env:push [ENVIRONMENT] [--environment ...] [--path ] [--force]
```

#### 인자

-   `[ENVIRONMENT]` 변수를 푸시할 environment입니다. 기본 environment는 'production', 'preview', 'development'입니다.

#### 플래그

-   `--environment=<value>...` 예: 'production', 'preview', 'development'와 같은 환경 변수의 environment입니다.
-   `--force` 확인을 건너뛰고 기존 변수를 자동으로 덮어씁니다.
-   `--path=<value>` [default: **.env.local**] 입력 `.env` 파일 경로입니다.

### `eas env:update [ENVIRONMENT]`

현재 프로젝트 또는 계정의 환경 변수를 업데이트합니다.

#### 사용법

```sh
eas env:update [ENVIRONMENT] [--variable-name ] [--variable-environment ] [--name ]
[--value ] [--type string|file] [--visibility plaintext|sensitive|secret] [--scope project|account]
[--environment ...] [--non-interactive]
```

#### 인자

-   `[ENVIRONMENT]` 업데이트할 변수의 현재 environment입니다. 기본 environment는 'production', 'preview', 'development'입니다.

#### 플래그

-   `--environment=<value>...` 예: 'production', 'preview', 'development'와 같은 환경 변수의 environment입니다.
-   `--name=<value>` 새 variable 이름입니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--scope=<option>` [default: project] 변수의 범위입니다 <options: project|account>.
-   `--type=<option>` 변수 유형입니다 <options: string|file>.
-   `--value=<value>` 변수의 새 값입니다.
-   `--variable-environment=<value>` 업데이트할 변수의 현재 environment입니다.
-   `--variable-name=<value>` 현재 variable 이름입니다.
-   `--visibility=<option>` 변수의 가시성입니다 <options: plaintext|sensitive|secret>.

### `eas fingerprint:compare [HASH1] [HASH2]`

현재 프로젝트, build, update의 fingerprint를 비교합니다.

#### 사용법

```sh
eas fingerprint:compare [HASH1...] [HASH2...] [--build-id ...] [--update-id ...] [--open]
[--environment ] [--json] [--non-interactive]
```

#### 인자

-   `[HASH1...]` 단독으로 제공되면 HASH1을 현재 프로젝트의 fingerprint와 비교합니다.
-   `[HASH2...]` 두 hash가 제공되면 HASH1을 HASH2와 비교합니다.

#### 플래그

-   `--build-id=<value>...` 지정한 ID의 build와 fingerprint를 비교합니다.
-   `--environment=<value>` 로컬 디렉터리에서 fingerprint를 생성하는 경우 지정한 environment를 사용합니다.
-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--open` 브라우저에서 fingerprint 비교를 엽니다.
-   `--update-id=<value>...` 지정한 ID의 update와 fingerprint를 비교합니다.

#### 예시

```sh
eas fingerprint:compare 	 # Compare fingerprints in interactive mode
eas fingerprint:compare  	 # Compare fingerprint against local directory
eas fingerprint:compare   	 # Compare provided fingerprints
eas fingerprint:compare --build-id  	 # Compare fingerprint from build against local directory
eas fingerprint:compare --build-id  --environment production 	 # Compare fingerprint from build against local directory with the "production" environment
eas fingerprint:compare --build-id  --build-id 	 # Compare fingerprint from a build against another build
eas fingerprint:compare --build-id  --update-id 	 # Compare fingerprint from build against fingerprint from update
eas fingerprint:compare  --update-id  	 # Compare fingerprint from update against provided fingerprint
```

### `eas fingerprint:generate`

현재 프로젝트에서 fingerprint를 생성합니다.

#### 사용법

```sh
eas fingerprint:generate [-p android|ios] [--environment  | -e ] [--json] [--non-interactive]
```

#### 플래그

-   `-e, --build-profile=<value>` eas.json의 build profile 이름입니다.
-   `-p, --platform=<option>` <options: android|ios>.
-   `--environment=<value>` 예: 'production', 'preview', 'development'와 같은 환경 변수의 environment입니다.
-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.

#### 예시

```sh
eas fingerprint:generate  	 # Generate fingerprint in interactive mode
eas fingerprint:generate --build-profile preview  	 # Generate a fingerprint using the "preview" build profile
eas fingerprint:generate --environment preview  	 # Generate a fingerprint using the "preview" environment
eas fingerprint:generate --json --non-interactive --platform android  	 # Output fingerprint json to stdout
```

### `eas help [COMMAND]`

eas 도움말을 표시합니다.

#### 사용법

```sh
eas help [COMMAND...] [-n]
```

#### 인자

-   `[COMMAND...]` 도움말을 표시할 명령입니다.

#### 플래그

-   `-n, --nested-commands` 출력에 모든 중첩 명령을 포함합니다.

### `eas init`

EAS 프로젝트를 생성하거나 연결합니다.

#### 사용법

```sh
eas init [--id ] [--force] [--non-interactive]
```

#### 플래그

-   `--force` `--id` 플래그와 함께 실행할 때 추가 프롬프트 없이 새 프로젝트를 생성/기존 프로젝트를 연결하거나 기존 프로젝트 ID를 덮어쓸지 여부입니다.
-   `--id=<value>` 연결할 EAS 프로젝트 ID입니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.

#### 별칭

```sh
eas init
```

### `eas init:onboarding [TARGET_PROJECT_DIRECTORY]`

[https://expo.new](https://expo.new) 웹사이트에서 시작한 onboarding 과정을 이어서 진행합니다.

#### 사용법

```sh
eas init:onboarding [TARGET_PROJECT_DIRECTORY]
```

#### Aliases

```sh
eas init:onboarding
eas onboarding
```

### `eas login`

Expo 계정으로 로그인합니다.

#### 사용법

```sh
eas login [-s] [-b]
```

#### 플래그

-   `-b, --browser` 브라우저로 로그인합니다.
-   `-s, --sso` SSO로 로그인합니다.

#### 별칭

```sh
eas login
```

### `eas logout`

로그아웃합니다.

#### 사용법

```sh
eas logout
```

#### 별칭

```sh
eas logout
```

### `eas metadata:lint`

로컬 store 구성을 검증합니다.

#### 사용법

```sh
eas metadata:lint [--json] [--profile ]
```

#### 플래그

-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다.
-   `--profile=<value>` eas.json의 submit profile 이름입니다. eas.json에 정의되어 있으면 기본값은 "production"입니다.

### `eas metadata:pull`

app store에서 로컬 store 구성을 생성합니다.

#### 사용법

```sh
eas metadata:pull [-e ]
```

#### 플래그

-   `-e, --profile=<value>` eas.json의 submit profile 이름입니다. eas.json에 정의되어 있으면 기본값은 "production"입니다.

### `eas metadata:push`

로컬 store 구성을 app store와 동기화합니다.

#### 사용법

```sh
eas metadata:push [-e ]
```

#### 플래그

-   `-e, --profile=<value>` eas.json의 submit profile 이름입니다. eas.json에 정의되어 있으면 기본값은 "production"입니다.

### `eas new [PATH]`

Expo Application Services(EAS)로 구성된 새 프로젝트를 생성합니다.

#### 사용법

```sh
eas new [PATH] [-p bun|npm|pnpm|yarn]
```

#### 인자

-   `[PATH]` create the project (defaults to current directory) 경로입니다.

#### 플래그

-   `-p, --package-manager=<option>` [default: npm] dependency 설치에 사용할 패키지 관리자입니다 <options: bun|npm|pnpm|yarn>.

#### 별칭

```sh
eas new
```

### `eas onboarding [TARGET_PROJECT_DIRECTORY]`

[https://expo.new](https://expo.new) 웹사이트에서 시작한 onboarding 과정을 이어서 진행합니다.

#### 사용법

```sh
eas onboarding [TARGET_PROJECT_DIRECTORY]
```

#### Aliases

```sh
eas init:onboarding
eas onboarding
```

### `eas open`

웹 브라우저에서 프로젝트 페이지를 엽니다.

#### 사용법

```sh
eas open
```

### `eas project:info`

현재 프로젝트 정보를 표시합니다.

#### 사용법

```sh
eas project:info
```

### `eas project:init`

EAS 프로젝트를 생성하거나 연결합니다.

#### 사용법

```sh
eas project:init [--id ] [--force] [--non-interactive]
```

#### 플래그

-   `--force` `--id` 플래그와 함께 실행할 때 추가 프롬프트 없이 새 프로젝트를 생성/기존 프로젝트를 연결하거나 기존 프로젝트 ID를 덮어쓸지 여부입니다.
-   `--id=<value>` 연결할 EAS 프로젝트 ID입니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.

#### 별칭

```sh
eas init
```

### `eas project:new [PATH]`

Expo Application Services(EAS)로 구성된 새 프로젝트를 생성합니다.

#### 사용법

```sh
eas project:new [PATH] [-p bun|npm|pnpm|yarn]
```

#### 인자

-   `[PATH]` create the project (defaults to current directory) 경로입니다.

#### 플래그

-   `-p, --package-manager=<option>` [default: npm] dependency 설치에 사용할 패키지 관리자입니다 <options: bun|npm|pnpm|yarn>.

#### 별칭

```sh
eas new
```

### `eas project:onboarding [TARGET_PROJECT_DIRECTORY]`

[https://expo.new](https://expo.new) 웹사이트에서 시작한 onboarding 과정을 이어서 진행합니다.

#### 사용법

```sh
eas project:onboarding [TARGET_PROJECT_DIRECTORY]
```

#### Aliases

```sh
eas init:onboarding
eas onboarding
```

### `eas submit`

앱 binary를 App Store 및/또는 Play Store에 제출합니다.

#### 사용법

```sh
eas submit [-p android|ios|all] [-e ] [--latest | --id  | --path  | --url ]
[--what-to-test ] [--verbose] [--wait] [--verbose-fastlane] [-g ...] [--non-interactive]
```

#### 플래그

-   `-e, --profile=<value>` eas.json의 submit profile 이름입니다. eas.json에 정의되어 있으면 기본값은 "production"입니다.
-   `-g, --groups=<value>...` build를 추가할 내부 TestFlight 테스트 그룹입니다(iOS 전용). 자세히 알아보기: [https://developer.apple.com/help/app-store-connect/test-a-beta-version/add-internal-testers](https://developer.apple.com/help/app-store-connect/test-a-beta-version/add-internal-testers).
-   `-p, --platform=<option>` <options: android|ios|all>.
-   `--id=<value>` 제출할 build ID입니다.
-   `--latest` 지정한 platform의 최신 build를 제출합니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--path=<value>` **.apk**/**.aab**/**.ipa** file 경로입니다.
-   `--url=<value>` 앱 archive URL입니다.
-   `--verbose` EAS Submit의 로그를 항상 출력합니다.
-   `--verbose-fastlane` 제출 과정의 상세 로깅을 활성화합니다.
-   `--[no-]wait` 제출이 완료될 때까지 기다립니다.
-   `--what-to-test=<value>` TestFlight의 "What to test" 정보를 설정합니다(iOS 전용).

#### 별칭

```sh
eas build:submit
```

### `eas update`

update group을 게시합니다.

#### 사용법

```sh
eas update [--branch ] [--channel ] [-m ] [--input-dir ] [--skip-bundler]
[--clear-cache] [--emit-metadata] [--rollout-percentage ] [-p android|ios|all] [--auto] [--private-key-path
] [--environment ] [--json] [--non-interactive]
```

#### 플래그

-   `-m, --message=<value>` update을(를) 설명하는 짧은 메시지입니다.
-   `-p, --platform=<option>` [default: all] <options: android|ios|all>.
-   `--auto` 현재 git branch와 commit 메시지를 EAS branch 및 update 메시지에 사용합니다.
-   `--branch=<value>` update group을 게시할 branch입니다.
-   `--channel=<value>` 게시된 update가 영향을 줄 channel입니다.
-   `--clear-cache` 게시 전에 bundler 캐시를 비웁니다.
-   `--emit-metadata` 생성된 update의 자세한 정보가 담긴 "**eas-update-metadata.json**"을 bundle 폴더에 출력합니다.
-   `--environment=<value>` 명령 실행 중 서버 측에 정의된 EAS 환경 변수를 사용할 environment입니다. 예: "production", "preview", "development". Expo SDK 55 이상을 사용하는 프로젝트에서는 필수입니다.
-   `--input-dir=<value>` [default: dist] bundle 위치입니다.
-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--private-key-path=<value>` expo-updates 구성의 certificate에 대응하는 PEM 인코딩 private key가 들어 있는 파일입니다. 기본값은 certificate 디렉터리의 "**private-key.pem**" 파일입니다. code signing을 사용하는 경우에만 관련 있습니다: [https://docs.expo.dev/eas-update/code-signing/](https://docs.expo.dev/eas-update/code-signing/).
-   `--rollout-percentage=<value>` 이 update를 즉시 사용할 수 있어야 하는 사용자 비율입니다. 롤아웃 대상이 아닌 사용자는 해당 update 자체가 롤아웃 중이더라도 branch의 이전 최신 update를 받습니다. 지정 값은 1에서 100 사이의 정수여야 합니다. 지정하지 않으면 기본값은 100입니다.
-   `--skip-bundler` 게시 전에 앱을 번들링하기 위해 Expo CLI를 실행하는 과정을 건너뜁니다.

### `eas update:configure`

프로젝트가 EAS Update를 지원하도록 구성합니다.

#### 사용법

```sh
eas update:configure [-p android|ios|all] [--environment ] [--non-interactive]
```

#### 플래그

-   `-p, --platform=<option>` [default: all] 구성할 platform입니다 <options: android|ios|all>.
-   `--environment=<value>` 명령 실행 중 서버 측에 정의된 EAS 환경 변수를 사용할 environment입니다. 예: "production", "preview", "development".
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.

### `eas update:delete GROUPID`

update group 안의 모든 update를 삭제합니다.

#### 사용법

```sh
eas update:delete GROUPID [--json] [--non-interactive]
```

#### 인자

-   `GROUPID` 삭제할 update group의 ID입니다.

#### 플래그

-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.

### `eas update:edit [GROUPID]`

update group 안의 모든 update를 수정합니다.

#### 사용법

```sh
eas update:edit [GROUPID] [--rollout-percentage ] [--branch ] [--json] [--non-interactive]
```

#### 인자

-   `[GROUPID]` 수정할 update group의 ID입니다.

#### 플래그

-   `--branch=<value>` 선택할 update를 나열할 branch입니다.
-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--rollout-percentage=<value>` rollout update에 설정할 rollout 비율입니다. 지정 값은 1에서 100 사이의 정수여야 합니다.

### `eas update:list`

최근 update를 확인합니다.

#### 사용법

```sh
eas update:list [--branch  | --all] [-p android|ios|all] [--runtime-version ] [--offset
] [--limit ] [--json] [--non-interactive]
```

#### 플래그

-   `-p, --platform=<option>` platform으로 update를 필터링합니다 <options: android|ios|all>.
-   `--all` 모든 branch의 update를 나열합니다.
-   `--branch=<value>` 이 branch의 update만 나열합니다.
-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--limit=<value>` 각 쿼리에서 가져올 항목 수입니다. 기본값은 25이며 최대 50입니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--offset=<value>` 지정한 인덱스부터 쿼리를 시작합니다. 결과 페이지네이션에 사용합니다. 기본값은 0입니다.
-   `--runtime-version=<value>` runtime version으로 update를 필터링합니다.

### `eas update:republish`

기존 update로 롤백합니다.

#### 사용법

```sh
eas update:republish [--channel  | --branch  | --group ] [--destination-channel  |
--destination-branch ] [-m ] [-p android|ios|all] [--private-key-path ] [--rollout-percentage
] [--json] [--non-interactive]
```

#### 플래그

-   `-m, --message=<value>` republished update group을(를) 설명하는 짧은 메시지입니다.
-   `-p, --platform=<option>` [default: all] <options: android|ios|all>.
-   `--branch=<value>` 다시 게시할 update group을 선택할 branch 이름입니다.
-   `--channel=<value>` 다시 게시할 update group을 선택할 channel 이름입니다.
-   `--destination-branch=<value>` 다른 branch로 다시 게시하는 경우 대상 branch 이름입니다.
-   `--destination-channel=<value>` 다른 branch로 다시 게시하는 경우 대상 branch를 선택할 channel 이름입니다.
-   `--group=<value>` 다시 게시할 update group ID입니다.
-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--private-key-path=<value>` expo-updates 구성의 certificate에 대응하는 PEM 인코딩 private key가 들어 있는 파일입니다. 기본값은 certificate 디렉터리의 "**private-key.pem**" 파일입니다. code signing을 사용하는 경우에만 관련 있습니다: [https://docs.expo.dev/eas-update/code-signing/](https://docs.expo.dev/eas-update/code-signing/).
-   `--rollout-percentage=<value>` 이 update를 즉시 사용할 수 있어야 하는 사용자 비율입니다. 롤아웃 대상이 아닌 사용자는 해당 update 자체가 롤아웃 중이더라도 branch의 이전 최신 update를 받습니다. 지정 값은 1에서 100 사이의 정수여야 합니다. 지정하지 않으면 기본값은 100입니다.

### `eas update:revert-update-rollout`

프로젝트의 rollout update를 되돌립니다.

#### 사용법

```sh
eas update:revert-update-rollout [--channel  | --branch  | --group ] [-m ] [--private-key-path
] [--json] [--non-interactive]
```

#### 플래그

-   `-m, --message=<value>` revert을(를) 설명하는 짧은 메시지입니다.
-   `--branch=<value>` rollout update를 되돌릴 update group을 선택할 branch 이름입니다.
-   `--channel=<value>` rollout update를 되돌릴 update group을 선택할 channel 이름입니다.
-   `--group=<value>` 되돌릴 rollout update group ID입니다.
-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--private-key-path=<value>` expo-updates 구성의 certificate에 대응하는 PEM 인코딩 private key가 들어 있는 파일입니다. 기본값은 certificate 디렉터리의 "**private-key.pem**" 파일입니다. code signing을 사용하는 경우에만 관련 있습니다: [https://docs.expo.dev/eas-update/code-signing/](https://docs.expo.dev/eas-update/code-signing/).

### `eas update:roll-back-to-embedded`

embedded update로 롤백합니다.

#### 사용법

```sh
eas update:roll-back-to-embedded [--branch ] [--channel ] [--runtime-version ] [--message ] [-p
android|ios|all] [--private-key-path ] [--json] [--non-interactive]
```

#### 플래그

-   `-p, --platform=<option>` [default: all] <options: android|ios|all>.
-   `--branch=<value>` rollback-to-embedded update group을 게시할 branch입니다.
-   `--channel=<value>` 게시된 rollback-to-embedded update가 영향을 줄 channel입니다.
-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--message=<value>` rollback to embedded update을(를) 설명하는 짧은 메시지입니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--private-key-path=<value>` expo-updates 구성의 certificate에 대응하는 PEM 인코딩 private key가 들어 있는 파일입니다. 기본값은 certificate 디렉터리의 "**private-key.pem**" 파일입니다. code signing을 사용하는 경우에만 관련 있습니다: [https://docs.expo.dev/eas-update/code-signing/](https://docs.expo.dev/eas-update/code-signing/).
-   `--runtime-version=<value>` rollback-to-embedded update가 대상으로 할 runtime version입니다.

### `eas update:rollback`

embedded update 또는 기존 update로 롤백합니다. 이 명령을 비대화형으로 실행하려는 경우에는 대신 "eas update:republish" 또는 "eas update:roll-back-to-embedded"를 실행해야 합니다.

#### 사용법

```sh
eas update:rollback [--private-key-path ]
```

#### 플래그

-   `--private-key-path=<value>` expo-updates 구성의 certificate에 대응하는 PEM 인코딩 private key가 들어 있는 파일입니다. 기본값은 certificate 디렉터리의 "**private-key.pem**" 파일입니다. code signing을 사용하는 경우에만 관련 있습니다: [https://docs.expo.dev/eas-update/code-signing/](https://docs.expo.dev/eas-update/code-signing/).

### `eas update:view GROUPID`

update group 세부 정보를 표시합니다.

#### 사용법

```sh
eas update:view GROUPID [--json]
```

#### 인자

-   `GROUPID` update group의 ID입니다.

#### 플래그

-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다.

### `eas upload`

로컬 build를 업로드하고 공유 가능한 링크를 생성합니다.

#### 사용법

```sh
eas upload [-p ios|android] [--build-path ] [--fingerprint ] [--json] [--non-interactive]
```

#### 플래그

-   `-p, --platform=<option>` <options: ios|android>.
-   `--build-path=<value>` 로컬 build 경로입니다.
-   `--fingerprint=<value>` 로컬 build의 fingerprint hash입니다.
-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.

### `eas webhook:create`

webhook을 생성합니다.

#### 사용법

```sh
eas webhook:create [--event BUILD|SUBMIT] [--url ] [--secret ] [--non-interactive]
```

#### 플래그

-   `--event=<option>` webhook을 트리거하는 이벤트 유형입니다 <options: BUILD|SUBMIT>.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--secret=<value>` 요청 payload의 hash signature를 생성하는 데 사용하는 secret이며, `Expo-Signature` 헤더로 제공됩니다.
-   `--url=<value>` webhook URL입니다.

### `eas webhook:delete [ID]`

webhook을 삭제합니다.

#### 사용법

```sh
eas webhook:delete [ID] [--non-interactive]
```

#### 인자

-   `[ID]` 삭제할 webhook ID입니다.

#### 플래그

-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.

### `eas webhook:list`

webhook을 나열합니다.

#### 사용법

```sh
eas webhook:list [--event BUILD|SUBMIT] [--json]
```

#### 플래그

-   `--event=<option>` webhook을 트리거하는 이벤트 유형입니다 <options: BUILD|SUBMIT>.
-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다.

### `eas webhook:update`

webhook을 업데이트합니다.

#### 사용법

```sh
eas webhook:update --id  [--event BUILD|SUBMIT] [--url ] [--secret ] [--non-interactive]
```

#### 플래그

-   `--event=<option>` webhook을 트리거하는 이벤트 유형입니다 <options: BUILD|SUBMIT>.
-   `--id=<value>` (required) webhook ID입니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--secret=<value>` 요청 payload의 hash signature를 생성하는 데 사용하는 secret이며, `Expo-Signature` 헤더로 제공됩니다.
-   `--url=<value>` webhook URL입니다.

### `eas webhook:view ID`

webhook을 확인합니다.

#### 사용법

```sh
eas webhook:view ID
```

#### 인자

-   `ID` 조회할 webhook ID입니다.

### `eas whoami`

현재 로그인한 사용자 이름을 표시합니다.

#### 사용법

```sh
eas whoami
```

#### 별칭

```sh
eas whoami
```

### `eas worker:alias`

deployment alias를 할당합니다.

#### 사용법

```sh
eas worker:alias [--prod] [--alias name] [--id xyz123] [--json] [--non-interactive]
```

#### 플래그

-   `--alias=name` 기존 deployment에 할당할 custom alias입니다.
-   `--id=xyz123` 기존 deployment의 고유 식별자입니다.
-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--prod` 기존 deployment를 production으로 승격합니다.

#### Aliases

```sh
eas worker:alias
eas deploy:promote
```

### `eas worker:alias:delete [ALIAS_NAME]`

deployment alias를 삭제합니다.

#### 사용법

```sh
eas worker:alias:delete [ALIAS_NAME] [--json] [--non-interactive]
```

#### 플래그

-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.

#### 별칭

```sh
eas worker:alias:delete
```

### `eas worker:delete [DEPLOYMENT_ID]`

deployment를 삭제합니다.

#### 사용법

```sh
eas worker:delete [DEPLOYMENT_ID] [--json] [--non-interactive]
```

#### 플래그

-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다. 이 옵션은 `--non-interactive`를 암시합니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.

#### 별칭

```sh
eas worker:delete
```

### `eas workflow:cancel`

하나 이상의 workflow 실행을 취소합니다. workflow run ID를 제공하지 않으면 취소할 IN_PROGRESS 실행을 선택하라는 프롬프트가 표시됩니다.

#### 사용법

```sh
eas workflow:cancel [--non-interactive]
```

#### 플래그

-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.

### `eas workflow:create [NAME]`

새 workflow 구성 YAML 파일을 생성합니다.

#### 사용법

```sh
eas workflow:create [NAME] [--skip-validation]
```

#### 인자

-   `[NAME]` workflow 파일 이름입니다(**.yml** 또는 **.yaml**로 끝나야 함).

#### 플래그

-   `--skip-validation` 설정하면 workflow 파일을 생성하기 전에 검증하지 않습니다.

### `eas workflow:logs [ID]`

workflow 실행의 로그를 확인하며, 볼 job과 step을 선택합니다. workflow run ID 또는 job ID를 전달할 수 있습니다. ID를 전달하지 않으면 현재 프로젝트의 최근 workflow 실행 중에서 선택하라는 프롬프트가 표시됩니다.

#### 사용법

```sh
eas workflow:logs [ID] [--json] [--non-interactive] [--all-steps]
```

#### 인자

-   `[ID]` 로그를 볼 workflow run 또는 workflow job의 ID입니다.

#### 플래그

-   `--all-steps` 특정 step을 묻는 대신 모든 로그를 출력합니다. 비대화형 모드에서는 이 옵션이 자동으로 설정됩니다.
-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.

### `eas workflow:run FILE`

EAS workflow를 실행합니다. `--ref` 플래그를 사용하지 않는 한 로컬 프로젝트 디렉터리 전체가 패키징되어 workflow 실행을 위해 EAS 서버에 업로드됩니다.

#### 사용법

```sh
eas workflow:run FILE [--non-interactive] [--wait] [-F ...] [--ref ] [--json]
```

#### 인자

-   `FILE` workflow file to run 경로입니다.

#### 플래그

-   `-F, --input=<value>...` workflow 입력값을 설정합니다.
-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--ref=<value>` workflow를 실행할 git reference입니다.
-   `--[no-]wait` workflow 실행이 완료될 때까지 기다립니다. 기본값은 false입니다.

### `eas workflow:runs`

이 프로젝트의 최근 workflow 실행을 ID, 상태, 타임스탬프와 함께 나열합니다.

#### 사용법

```sh
eas workflow:runs [--workflow ] [--status ACTION_REQUIRED|CANCELED|FAILURE|IN_PROGRESS|NEW|SUCCESS]
[--json] [--limit ]
```

#### 플래그

-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다.
-   `--limit=<value>` 각 쿼리에서 가져올 항목 수입니다. 기본값은 10이며 최대 100입니다.
-   `--status=<option>` 지정하면 반환된 실행 중에서 특정 상태를 가진 항목만 필터링합니다 <options: ACTION_REQUIRED|CANCELED|FAILURE|IN_PROGRESS|NEW|SUCCESS>.
-   `--workflow=<value>` 지정하면 쿼리는 특정 workflow 파일 이름의 실행만 반환합니다.

### `eas workflow:status [WORKFLOW_RUN_ID]`

기존 workflow 실행의 상태를 표시합니다. run ID를 제공하지 않으면 현재 프로젝트의 최근 workflow 실행 중에서 선택하라는 프롬프트가 표시됩니다.

#### 사용법

```sh
eas workflow:status [WORKFLOW_RUN_ID] [--non-interactive] [--wait] [--json]
```

#### 인자

-   `[WORKFLOW_RUN_ID]` workflow run ID입니다.

#### 플래그

-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
-   `--[no-]wait` workflow 실행이 완료될 때까지 기다립니다. 기본값은 false입니다.

### `eas workflow:validate PATH`

workflow 구성 yaml 파일을 검증합니다.

#### 사용법

```sh
eas workflow:validate PATH [--non-interactive]
```

#### 인자

-   `PATH` workflow configuration YAML file (must end with **.yml** or **.yaml**) 경로입니다.

#### 플래그

-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.

### `eas workflow:view [ID]`

job을 포함한 workflow 실행 세부 정보를 확인합니다. run ID를 제공하지 않으면 현재 프로젝트의 최근 workflow 실행 중에서 선택하라는 프롬프트가 표시됩니다.

#### 사용법

```sh
eas workflow:view [ID] [--json] [--non-interactive]
```

#### 인자

-   `[ID]` 조회할 workflow run의 ID입니다.

#### 플래그

-   `--json` JSON 출력을 활성화합니다. JSON이 아닌 메시지는 `stderr`에 출력됩니다.
-   `--non-interactive` 비대화형 모드로 명령을 실행합니다.
