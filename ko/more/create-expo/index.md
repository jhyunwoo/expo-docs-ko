---
modificationDate: March 01, 2026
title: create-expo-app
description: 새 Expo 및 React Native 프로젝트를 만드는 명령줄 도구입니다.
---

# create-expo-app

새 Expo 및 React Native 프로젝트를 만드는 명령줄 도구입니다.

`create-expo-app`은 새 Expo 및 React Native 프로젝트를 만들고 설정하는 명령줄 도구입니다. 이 도구는 수동 설정 없이도 빠르게 시작할 수 있도록 여러 템플릿을 제공하여 초기화 과정을 단순화합니다.

## 새 프로젝트 만들기

새 프로젝트를 만들려면 다음 명령을 실행하세요.

```sh
# npm
npx create-expo-app@latest --template default@sdk-55

# yarn
yarn create expo-app --template default@sdk-55

# pnpm
pnpm create expo-app --template default@sdk-55

# bun
bun create expo --template default@sdk-55
```

> **참고:** SDK 55 전환 기간 동안 `--template` 플래그 없이 `create-expo-app@latest`를 실행하면 SDK 54 프로젝트가 생성됩니다. 실제 기기에서 Expo Go를 사용할 계획이라면 SDK 54 프로젝트를 사용하세요. 그렇지 않다면 `--template default@sdk-55`를 사용해 SDK 55 프로젝트를 만드세요.

위 명령을 실행하면 프로젝트의 앱 이름을 입력하라는 프롬프트가 표시됩니다. 이 앱 이름은 앱 config의 [`name`](/versions/latest/config/app#name) 속성에도 사용됩니다.

```sh
What is your app named? my-app
```

## 옵션

다음 옵션을 사용해 명령 동작을 사용자 정의할 수 있습니다.

### `--yes`

기본 옵션을 사용해 새 프로젝트를 만듭니다.

### `--no-install`

npm 의존성 또는 CocoaPods 설치를 건너뜁니다.

### `--template`

[Node Package Manager](/more/create-expo#node-package-managers-support)와 함께 `create-expo-app`을 실행하면 기본 템플릿을 사용해 새 Expo 프로젝트를 초기화하고 설정합니다.

`--template` 옵션을 사용해 아래 템플릿 중 하나를 선택하거나, 해당 값을 옵션 인수로 전달할 수 있습니다. 예를 들어 `--template default`처럼 사용할 수 있습니다.

> 더 많은 템플릿을 찾고 있나요? 특정 기능과 통합을 보여 주는 example 앱 중 하나로 프로젝트를 초기화하려면 [`--example`](/more/create-expo#--example) 옵션을 확인해 보세요.

| Template | Description |
| --- | --- |
| [`default`](https://github.com/expo/expo/tree/main/templates/expo-template-default) | 기본 템플릿입니다. 여러 화면을 가진 앱을 만들도록 설계되었습니다. Expo CLI, Expo Router 라이브러리, 활성화된 TypeScript 설정 등 권장 도구가 포함됩니다. 대부분의 앱에 적합합니다. |
| [`blank`](https://github.com/expo/expo/tree/main/templates/expo-template-blank) | navigation을 설정하지 않고 최소한으로 필요한 npm 의존성만 설치합니다. |
| [`blank-typescript`](https://github.com/expo/expo/tree/main/templates/expo-template-blank-typescript) | TypeScript가 활성화된 Blank 템플릿입니다. |
| [`tabs`](https://github.com/expo/expo/tree/main/templates/expo-template-tabs) | Expo Router와 활성화된 TypeScript를 사용해 파일 기반 라우팅을 설치하고 설정합니다. |
| [`bare-minimum`](https://github.com/expo/expo/tree/main/templates/expo-template-bare-minimum) | 네이티브 디렉터리(**android**와 **ios**)가 생성되는 Blank 템플릿입니다. 설정 과정에서 [`npx expo prebuild`](/workflow/continuous-native-generation)를 실행합니다. |

### `--example`

[expo/examples](https://github.com/expo/examples)의 example을 사용해 프로젝트를 초기화하려면 이 옵션을 사용하세요.

예를 들면 다음과 같습니다.

-   `npx create-expo-app --example with-router`를 실행하면 Expo Router 라이브러리가 포함된 프로젝트가 설정됩니다.
-   `npx create-expo-app --example with-react-navigation`을 실행하면 기본 템플릿과 비슷하지만 일반 React Navigation 라이브러리로 설정된 프로젝트가 만들어집니다.

### `--version`

버전 번호를 출력하고 종료합니다.

### `--help`

사용 가능한 옵션 목록을 출력하고 종료합니다.

## Node Package Managers support

`create-expo-app`으로 새 프로젝트를 만들면 특정 Node Package Manager에 필요한 추가 설정도 함께 처리됩니다.

**하나의 패키지 매니저에서 다른 패키지 매니저로 마이그레이션하는 경우**, 프로젝트에서 필요한 추가 설정은 직접 수행해야 합니다. **[EAS](/eas)를 사용 중이라면** 추가로 필요한 단계에 맞춰 프로젝트를 수동으로 설정해야 합니다.

각 패키지 매니저별 추가 단계는 아래에 정리되어 있습니다.

### npm

#### 로컬 설치

npm은 Node.js 설치의 일부로 함께 설치됩니다. 설치 방법은 [Node.js documentation](https://nodejs.org/en/download/package-manager)을 참고하세요.

#### EAS 설치

프로젝트 디렉터리에 **package-lock.json**이 있으면 기본적으로 지원됩니다.

### Yarn 1 (Classic)

#### 로컬 설치

Yarn 1 (Classic)은 보통 npm의 전역 의존성으로 설치됩니다. 설치 방법은 [Yarn 1 documentation](https://classic.yarnpkg.com/en/docs/getting-started)을 참고하세요.

#### EAS 설치

프로젝트 디렉터리에 **yarn.lock**이 있으면 기본적으로 지원됩니다.

### Yarn 2+ (Modern)

#### 로컬 설치

설치 방법은 [Yarn documentation](https://yarnpkg.com/getting-started/install)을 참고하세요.

Yarn 2+는 패키지 관리를 Yarn 1과 다르게 처리합니다. Yarn 2+의 핵심 변화 중 하나는 React Native와 호환되지 않는 [Plug'n'Play (PnP)](https://yarnpkg.com/features/pnp) node linking 모델입니다.

기본적으로 `create-expo-app`과 Yarn 2+로 만든 프로젝트는 의존성 설치에 [`nodeLinker`](https://yarnpkg.com/features/linkers#nodelinker-node-modules)를 사용하며, 값은 `node-modules`로 설정됩니다.

```yaml
nodeLinker: node-modules
```

#### EAS 설치

EAS에서 Yarn Modern을 사용하려면 [`eas-build-pre-install` hook](/build-reference/npm-hooks)을 추가해야 합니다. 프로젝트의 **package.json**에 다음 설정을 추가하세요.

```json
{
  "scripts": {
    "eas-build-pre-install": "corepack enable && yarn set version 4"
  }
}
```

### pnpm

#### 로컬 설치

Node.js 설치가 필요합니다. 설치 방법은 [pnpm documentation](https://pnpm.io/installation)을 참고하세요.

기본적으로 `create-expo-app`과 pnpm으로 만든 프로젝트는 의존성 설치에 [`node-linker`](https://pnpm.io/npmrc#node-linker)를 사용하며, 값은 `hoisted`로 설정됩니다.

```ini
node-linker=hoisted
```

> **SDK 54** 이상에서는 Expo가 isolated installation을 지원하므로, isolated dependency를 사용하고 싶다면 `node-linker` 설정을 삭제해도 됩니다.

#### EAS 설치

프로젝트 디렉터리에 **pnpm-lock.yaml**이 있으면 기본적으로 지원됩니다.

### Bun

`bun`으로 새 Expo 프로젝트를 만드는 방법, 다른 패키지 매니저에서 마이그레이션하는 방법, EAS와 함께 사용하는 방법에 대한 자세한 내용은 [Bun](/guides/using-bun) 가이드를 참고하세요.
