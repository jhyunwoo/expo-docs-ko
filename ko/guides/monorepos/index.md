---
modificationDate: February 26, 2026
title: 모노레포로 작업하기
description: workspace를 사용하는 monorepo에서 Expo 프로젝트를 설정하는 방법을 알아보세요.
---

# 모노레포로 작업하기

workspace를 사용하는 monorepo에서 Expo 프로젝트를 설정하는 방법을 알아보세요.

Monorepo, 즉 _"monolithic repository"_는 여러 앱이나 package를 포함하는 단일 저장소입니다. 더 큰 프로젝트의 개발 속도를 높이고, 코드를 더 쉽게 공유하게 하며, 단일 진실 공급원 역할도 할 수 있습니다. 이 가이드는 Expo 프로젝트가 포함된 간단한 monorepo를 설정합니다. Expo는 workspace를 지원하는 package manager로 관리되는 monorepo를 일급 지원합니다: [Bun](https://bun.sh/docs/install/workspaces), [npm](https://docs.npmjs.com/cli/using-npm/workspaces), [pnpm](https://pnpm.io/workspaces), [Yarn](https://yarnpkg.com/features/workspaces) (v1 Classic 및 Berry)입니다. Expo는 monorepo를 자동으로 감지하고, monorepo에 추가된 새 앱 프로젝트를 구성합니다. 감지는 프로젝트의 workspace 설정을 기반으로 이루어집니다.

> Monorepo는 모든 프로젝트에 적합한 것은 아닙니다. 여러 앱이 하나의 저장소에 살면서 코드를 공유할 때 유용하고, 네이티브 module을 앱과 함께 colocate하는 데도 도움이 될 수 있습니다. 대신 tooling 설정과 구성의 복잡성이 증가하는 tradeoff가 있습니다. monorepo를 설정하기 전에 사용하는 도구와 라이브러리가 monorepo 안에서 잘 동작하는지 확인하세요.

Automatic Configuration (SDK 52+로 마이그레이션)

SDK 52부터 Expo는 monorepo용 Metro를 자동으로 구성합니다. [`expo/metro-config`](/guides/customizing-metro)를 사용하는 경우 monorepo에서 Metro를 수동으로 구성할 필요가 없습니다.

SDK 52 이후의 Expo SDK 버전으로 마이그레이션 중이고, 다음 속성 중 하나를 수동으로 수정하는 **metro.config.js**가 있다면 설정에서 이를 삭제하세요:

-   `watchFolders`
-   `resolver.nodeModulesPath`
-   `resolver.extraNodeModules`
-   `resolver.disableHierarchicalLookup`

이 옵션들을 삭제한 뒤에는 오래된 Metro cache를 지우기 위해 한 번 `npx expo start --clear`로 Expo를 실행해야 합니다. 이후에도 앱이 예상대로 계속 동작한다면, 이는 일반적인 Node monorepo이며 앞으로는 특별한 구성이 필요하지 않습니다.

Manual Configuration (SDK 52 이전)

SDK 52부터 Expo의 Metro config는 Bun, npm, pnpm, Yarn에 대한 monorepo 지원을 제공하며 자동으로 자체 구성을 합니다. [`expo/metro-config`](/guides/customizing-metro)의 config를 사용한다면 monorepo에서 Metro를 수동으로 구성할 필요가 없습니다. 그렇다면 monorepo 지원을 수동으로 구성할 필요도 없습니다.

SDK 52 이전에는 Metro로 monorepo를 수동 구성하려면 두 가지 수동 변경이 필요했습니다:

1.  Metro가 monorepo 안의 코드를 수동으로 감시하도록 구성해야 했습니다(예: **apps/cool-app**만 감시하지 않도록).
2.  Metro의 resolution을 조정해 다른 workspace와 여러 `node_modules` 폴더(예: **apps/cool-app/node_modules** 또는 **node_modules**)에서 package를 찾을 수 있게 해야 했습니다.

구성은 [다음 내용을 가진 **metro.config.js**를 생성해](/guides/customizing-metro#customizing) 조정했습니다:

```js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// This can be replaced with `find-yarn-workspace-root`
const monorepoRoot = path.resolve(__dirname, '../..');
const config = getDefaultConfig(__dirname);

// 1. Watch all files within the monorepo
config.watchFolders = [monorepoRoot];
// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

module.exports = config;
```

> [Metro 커스터마이즈하기](/guides/customizing-metro)에 대해 더 알아보세요.

## 모노레포 설정하기

monorepo에서 앱은 보통 저장소의 하위 디렉터리에 위치하며, package manager는 monorepo 내부의 다른 package에 dependency를 추가할 수 있도록 구성됩니다. 예를 들어 Expo 앱을 포함한 monorepo의 기본 구조는 다음과 같을 수 있습니다:

-   **apps**: Expo 앱을 포함한 여러 프로젝트를 담습니다.
-   **packages**: 앱에서 사용하는 여러 package를 담습니다.
-   **package.json**: 루트 package 파일입니다.

모든 monorepo는 "root" **package.json** 파일을 가져야 합니다. 이 파일은 monorepo의 주된 구성이며 저장소의 모든 프로젝트에 설치되는 도구를 포함할 수 있습니다. 어떤 package manager를 사용하느냐에 따라 workspace 설정 단계는 다를 수 있지만, [Bun](https://bun.sh/docs/install/workspaces), [npm](https://docs.npmjs.com/cli/using-npm/workspaces), [Yarn](https://yarnpkg.com/features/workspaces)의 경우에는 monorepo의 모든 workspace에 대한 [glob pattern](https://classic.yarnpkg.com/lang/en/docs/workspaces/#toc-tips-tricks)을 지정하는 `workspaces` 속성을 루트 **package.json** 파일에 추가해야 합니다:

```json
{
  "name": "monorepo",
  "private": true,
  "version": "0.0.0",
  "workspaces": ["apps/*", "packages/*"]
}
```

[pnpm](https://pnpm.io/workspaces)의 경우에는 대신 [**pnpm-workspace.yaml**](https://pnpm.io/pnpm-workspace_yaml)을 만들어야 합니다:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### 첫 번째 앱 만들기

이제 기본 monorepo 구조를 설정했으니 첫 번째 앱을 추가합니다.

앱을 만들기 전에 **apps** 디렉터리를 만들어야 합니다. 이 디렉터리에는 이 monorepo에 속한 별도의 앱이나 웹사이트가 모두 들어갑니다. 이 **apps** 디렉터리 안에 Expo 앱을 담는 하위 디렉터리를 만들 수 있습니다.

```sh
# npm
npx create-expo-app@latest --template default@sdk-55 apps/cool-app

# yarn
yarn create expo-app --template default@sdk-55 apps/cool-app

# pnpm
pnpm create expo-app --template default@sdk-55 apps/cool-app

# bun
bun create expo --template default@sdk-55 apps/cool-app
```

> 기존 앱이 있다면 그 파일들을 **apps** 내부의 디렉터리로 모두 복사할 수 있습니다.

첫 번째 앱을 복사하거나 만든 뒤에는 monorepo 루트 디렉터리에서 package manager를 사용해 dependency를 설치하고, 흔한 경고가 없는지 확인하세요.

### Package 만들기

Monorepo는 코드를 하나의 저장소에 모으는 데 도움을 줍니다. 여기에는 앱뿐 아니라 개별 package도 포함됩니다. 이 package들은 반드시 publish할 필요도 없습니다. [Expo 저장소](https://github.com/expo/expo)도 이 방식을 사용합니다. 모든 Expo SDK package는 우리 저장소의 [**packages**](https://github.com/expo/expo/tree/main/packages) 디렉터리에 위치합니다. 이렇게 하면 publish하기 전에 [**apps**](https://github.com/expo/expo/tree/main/apps/native-component-list) 디렉터리 중 하나에서 코드를 테스트할 수 있습니다.

이제 루트로 돌아가 **packages** 디렉터리를 만듭시다. 이 디렉터리에는 만들고 싶은 모든 개별 package를 담을 수 있습니다. 이 디렉터리 안으로 들어간 뒤 새로운 하위 디렉터리를 추가해야 합니다. 이 하위 디렉터리는 앱 안에서 사용할 수 있는 별도 package가 됩니다. 아래 예시에서는 이름을 **cool-package**로 정했습니다.

```sh
# npm
mkdir -p packages/cool-package && cd packages/cool-package && npm init

# yarn
mkdir -p packages/cool-package && cd packages/cool-package && yarn init

# pnpm
mkdir -p packages/cool-package && cd packages/cool-package && pnpm init

# bun
mkdir -p packages/cool-package && cd packages/cool-package && bun init --minimal
```

package를 만드는 상세한 내용까지는 다루지 않겠습니다. 이 부분이 익숙하지 않다면 monorepo 없이 단순한 앱을 사용하는 편이 나을 수 있습니다. 다만 예시를 완성하기 위해 아래 내용의 **index.js** 파일을 추가해 봅시다:

```js
export const greeting = 'Hello!';
```

### Package 사용하기

일반 package와 마찬가지로 **cool-package**를 **cool-app**의 dependency로 추가해야 합니다. 일반 package와 monorepo 안의 package 사이의 가장 큰 차이는, monorepo package는 항상 _"현재 package의 상태"_를 사용하고 버전을 사용하는 대신 그 상태를 사용하고 싶다는 점입니다. 앱 **package.json** 파일에 `"cool-package": "*"`를 추가해 **cool-package**를 앱에 넣어 봅시다:

```json
{
  "name": "cool-app",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "cool-package": "*",
    "expo": "~54.0.0",
    "expo-status-bar": "~3.0.6",
    "react": "19.1.0",
    "react-native": "0.81.1"
  }
}
```

Bun, npm, pnpm은 `"*"` 대신 `"workspace:*"`를 사용해 workspace dependency를 지정하는 것도 지원합니다. 이렇게 하면 workspace package가 npm registry의 같은 이름의 publish된 package로 resolve되는 일이 절대 없도록 보장하지만, 필수는 아닙니다.

package를 추가한 뒤에는 다시 한 번 monorepo 루트 디렉터리에서 package manager를 사용해 dependency를 설치하고 흔한 경고가 없는지 확인하세요.

이제 앱 안에서 package를 사용할 수 있어야 합니다! 이를 테스트하려면 앱의 **App.js**를 수정해서 **cool-package**의 `greeting` 텍스트를 렌더링해 봅시다.

```jsx
import { greeting } from 'cool-package';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{greeting}</Text>
      <StatusBar style="auto" />
    </View>
  );
}
```

## 흔한 문제

Monorepo는 일반 프로젝트에서는 발생하지 않는 resolution 및 dependency 문제를 일으킬 수 있습니다. 더 깊은 이해와 특정 tooling 구성이 필요합니다. 복잡성이 증가하고, workspace가 없으면 마주치지 않았을 문제를 직접 해결해야 합니다. 다음은 흔히 마주칠 수 있는 몇 가지 문제입니다.

### 격리된 dependency를 사용하는 package manager

> **SDK 54부터** Expo는 isolated dependency와 isolated install을 지원합니다.  
> **SDK 53에서는** isolated dependency를 비활성화하는 것을 권장합니다. 그렇지 않으면 네이티브 빌드 오류와 dependency 충돌을 만날 수 있습니다.

[Bun](https://bun.com/docs/install/isolated)과 [pnpm](https://pnpm.io/settings#nodelinker)은 isolated install을 일급으로 지원합니다. pnpm에서는 이를 비활성화하지 않는 한 기본 설치 전략입니다.

isolated dependency를 사용할 때 package manager는 중첩된 `node_modules` 디렉터리의 package를 더 상위 디렉터리로 hoist하지 않습니다. 대신 Node module을 담는 중앙 디렉터리를 만들고, 이 디렉터리에 대한 link를 생성합니다. 이런 dependency 구조는 package가 명시적으로 선언한 dependency에만 접근할 수 있도록 강제합니다. 이는 전통적인 **hoisted** 설치 전략보다 훨씬 엄격한 방식이며, npm과 Yarn의 기본 동작은 dependency를 평탄한 구조로 설치하는 **hoisted** 전략입니다.

**hoisted** 설치의 부작용 중 하나는, 자신의 **package.json** `dependencies`나 `peerDependencies`에 명시하지 않은 Node module에 실수로 의존할 수 있다는 점입니다. 대신 다른 package가 의존하는 더 많은 dependency가 hoist되어 접근 가능해집니다. 이는 비결정적인 동작을 만들고 깨진 dependency chain을 허용해 더 취약해지며, package를 업데이트하거나 업그레이드할 때 resolution 오류를 일으킬 수 있습니다. 특히 monorepo에서 흔합니다.

**SDK 54부터** Expo는 isolated dependency를 지원합니다. 안타깝게도 설치한 모든 package가 동작하는 것은 아니며, 일부 React Native 라이브러리는 isolated dependency와 함께 사용할 때 빌드 또는 resolution 오류를 일으킬 수 있습니다. [pnpm](https://pnpm.io/settings#nodelinker)의 isolated install에서 문제가 생긴다면, 저장소 루트의 **.npmrc** 파일에서 `node-linker` 설정을 바꿔 **hoisted** 설치 전략으로 전환하세요:

```plain
node-linker=hoisted
```

### Monorepo 안의 중복 네이티브 package

Expo는 isolated module 같은 더 완전한 **node_modules** 패턴에 대한 지원을 개선했습니다. 하지만 앱에 중복 dependency가 있다면 여전히 문제가 생길 수 있습니다:

-   단일 monorepo 안에서 React Native 버전이 중복되는 것은 지원되지 않습니다.
-   하나의 앱 안에서 React 버전이 중복되면 runtime 오류가 발생합니다.
-   Turbo 및 Expo module 버전이 중복되면 runtime 또는 빌드 오류가 날 수 있습니다.

예를 들어 `react-native`처럼 monorepo에 한 package의 여러 버전이 있는지, 왜 설치되었는지, 사용 중인 package manager를 통해 확인할 수 있습니다.

```sh
# npm
npm why react-native

# yarn
yarn why react-native

# pnpm
pnpm why --depth=10 react-native

# bun
bun pm why react-native
```

이 명령들의 출력은 package manager마다 매우 다르지만, 예를 들어 `react-native@0.79.5`와 `react-native@0.81.0`처럼 여러 버전이 보이는지 확인하면 어느 출력에서든 중복 package를 찾아낼 수 있습니다. **npm**,

#### peer dependency에 대한 dependency resolution 추가하기

중복 dependency를 자신의 dependency 변경만으로 해결할 수 없다면 resolution을 추가해야 할 수도 있습니다. 예를 들어 아직 모든 package가 React 19를 지원하도록 **peerDependencies**를 업데이트한 것은 아닙니다. 이를 우회하려면 `react`의 단일 버전이 설치되도록 강제하는 resolution을 만들 수 있습니다.

```json
{
  "name": "monorepo",
  "private": true,
  "version": "0.0.0",
  "workspaces": ["apps/*", "packages/*"],
  "resolutions": {
    "react": "^19.1.0"
  }
}
```

[npm](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#overrides)의 경우에는 `resolutions` 대신 `overrides`라는 속성을 사용해야 합니다.

#### auto-linked 네이티브 module deduplicate하기

중복 dependency가 있어도 문제가 되지 않는 경우가 많습니다. 하지만 네이티브 module은 절대 중복되면 안 됩니다. 앱 빌드 시점에는 네이티브 module의 한 버전만 컴파일할 수 있기 때문입니다. JavaScript dependency와 달리 네이티브 빌드에는 하나의 네이티브 module에 대한 서로 충돌하는 두 버전이 함께 들어갈 수 없습니다.

**SDK 54부터**는 **app.json**에서 `experiments.autolinkingModuleResolution`을 `true`로 설정해 autolinking을 Expo CLI와 Metro bundler에 자동 적용할 수 있습니다. 이렇게 하면 Metro가 resolve하는 dependency가 네이티브 빌드를 위해 [autolinking](/modules/autolinking)이 연결하는 네이티브 module과 일치하도록 강제됩니다.

**SDK 55부터**는 monorepo의 앱에서 이 기능이 자동으로 활성화됩니다.

### Script '...' does not exist

React Native는 JavaScript 파일과 네이티브 파일을 함께 제공하기 위해 package를 사용합니다. 이 네이티브 파일들도 [**react-native/react.Gradle**](https://github.com/facebook/react-native/blob/v0.70.6/react.gradle) 파일을 **android/app/build.Gradle**에서 연결하듯 링크해야 합니다. 보통 이 경로는 다음처럼 하드코딩되어 있습니다:

**Android** ([source](https://github.com/facebook/react-native/blob/e918362be3cb03ae9dee3b8d50a240c599f6723f/template/android/app/build.gradle#L84))

```groovy
apply from: "../../node_modules/react-native/react.gradle"
```

**iOS** ([source](https://github.com/facebook/react-native/blob/e918362be3cb03ae9dee3b8d50a240c599f6723f/template/ios/Podfile#L1))

```ruby
require_relative '../node_modules/react-native/scripts/react_native_pods'
```

안타깝게도 이 경로는 monorepo에서는 [hoisting](https://classic.yarnpkg.com/blog/2018/02/15/nohoist/) 때문에 달라질 수 있습니다. 또한 [Node module resolution](https://nodejs.org/api/modules.html#all-together)도 사용하지 않습니다. 이 문제는 경로를 하드코딩하는 대신 Node로 package 위치를 찾아 해결할 수 있습니다:

**Android** ([source](https://github.com/expo/expo/blob/6877c1f5cdca62b395b0d5f49d87f2f3dbb50bec/templates/expo-template-bare-minimum/android/app/build.gradle#L87))

```groovy
apply from: new File(["node", "--print", "require.resolve('react-native/package.json')"].execute(null, rootDir).text.trim(), "../react.gradle")
```

**iOS** ([source](https://github.com/expo/expo/blob/61cbd9a5092af319b44c319f7d51e4093210e81b/templates/expo-template-bare-minimum/ios/Podfile#L2))

```ruby
require File.join(File.dirname(`node --print "require.resolve('react-native/package.json')"`), "scripts/react_native_pods")
```

위 코드 조각에서는 Node 자체의 [`require.resolve()`](https://nodejs.org/api/modules.html#requireresolverequest-options) method를 사용해 package 위치를 찾는 것을 볼 수 있습니다. package의 진입점이 아니라 루트 위치를 찾고 싶기 때문에 명시적으로 `package.json`을 가리킵니다. 그리고 그 루트 위치를 바탕으로 package 내부에서 기대하는 상대 경로를 resolve할 수 있습니다. [이 reference에 대해 여기서 더 알아보세요](https://github.com/expo/expo/blob/4633ab2364e30ea87ca2da968f3adaf5cdde9d8b/packages/expo-modules-core/README.mdx#importing-native-dependencies---autolinking).

모든 Expo SDK module과 template는 이런 동적 reference를 사용하며 monorepo와 함께 동작합니다. 하지만 가끔은 여전히 하드코딩된 경로를 사용하는 package를 만날 수 있습니다. 이런 경우 [`patch-package`](https://github.com/ds300/patch-package#readme)로 수동 수정하거나, 해당 package 유지 관리자에게 이를 알려 주세요.
