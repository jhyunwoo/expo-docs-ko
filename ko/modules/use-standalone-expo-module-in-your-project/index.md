---
modificationDate: February 28, 2026
title: 독립형 Expo 모듈 사용하는 방법
description: monorepo를 사용하거나 패키지를 npm에 게시해 create-expo-module로 만든 독립형 모듈을 프로젝트에서 사용하는 방법을 알아보세요.
---

# 독립형 Expo 모듈 사용하는 방법

monorepo를 사용하거나 패키지를 npm에 게시해 create-expo-module로 만든 독립형 모듈을 프로젝트에서 사용하는 방법을 알아보세요.

**기존 프로젝트에서 Expo 모듈을 만드는 권장 방식**은 [Expo Modules API: Get Started](/modules/get-started) 가이드에 설명되어 있습니다. 이 튜토리얼에서는 기존 프로젝트에서 `create-expo-module`로 만든 모듈을 사용하는 두 가지 추가 방법을 설명합니다.

-   [monorepo 설정하기](/modules/use-standalone-expo-module-in-your-project#use-a-monorepo)
-   [모듈을 npm에 게시하기](/modules/use-standalone-expo-module-in-your-project#publish-the-module-to-npm)

이 방법들은 모듈을 애플리케이션과 분리해 유지하고 싶거나, 다른 개발자와 공유하고 싶을 때 유용합니다.

## monorepo 사용하기

프로젝트는 다음 구조를 사용하는 것이 좋습니다.

-   **apps**: React Native 앱을 포함한 여러 프로젝트를 저장하는 디렉터리입니다.
-   **packages**: 앱에서 사용하는 여러 패키지를 보관하는 디렉터리입니다.
-   **package.json**: Yarn workspaces 설정이 들어 있는 루트 패키지 파일입니다.

> 프로젝트를 monorepo로 설정하는 방법을 알아보려면 [Working with monorepos](/guides/monorepos) 가이드를 참고하세요.

### 새 모듈 초기화하기

기본 monorepo 구조를 설정한 뒤에는 example 앱 생성을 건너뛰기 위해 `--no-example` 플래그를 사용해서 `create-expo-module`로 새 모듈을 만듭니다.

```sh
npx create-expo-module packages/expo-settings --no-example
```

### workspace 의존성 설정하기

**packages**에 있는 네이티브 모듈을 앱의 의존성에 추가합니다. 네이티브 모듈을 사용할 **apps** 디렉터리 안 각 앱의 **package.json** 파일을 업데이트하고, 기존 dependencies 항목에 네이티브 모듈을 추가합니다.

```json
{
  "dependencies": {
    ... 
    "expo-settings": "*"
    ... 
  }
}
```

### 모듈 실행하기

앱 중 하나를 실행해 모든 것이 제대로 동작하는지 확인합니다. 그런 다음 **packages/expo-settings**에서 TypeScript 컴파일러를 시작해 변경 사항을 감시하고 모듈의 JavaScript를 다시 빌드합니다.

```sh
cd packages/expo-settings
npm run build
```

다른 터미널 창을 열고 **apps** 디렉터리에서 앱 하나를 선택한 다음 `--clean` 옵션과 함께 `prebuild` 명령을 실행합니다. monorepo의 각 앱에서 새 모듈을 사용하려면 이 단계를 반복하세요.

```sh
npx expo prebuild --clean
```

다음 명령으로 앱을 컴파일하고 실행합니다.

```sh
npx expo run:android
npx expo run:ios
```

이제 앱에서 모듈을 사용할 수 있습니다. 테스트하려면 앱의 **src/app/index.tsx** 파일을 편집해 `expo-settings` 모듈의 텍스트 메시지를 렌더링하세요.

```tsx
import React from 'react';
import { Text, View } from 'react-native';
import * as Settings from 'expo-settings';

export default function TabOneScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{Settings.hello()}</Text>
    </View>
  );
}
```

이 구성이 끝나면 앱에는 "Hello world! 👋" 텍스트가 표시됩니다.

## 모듈을 npm에 게시하기

아래 단계를 따르면 모듈을 npm에 게시하고 프로젝트의 의존성으로 설치할 수 있습니다.

### 새 모듈 초기화하기

먼저 `create-expo-module`로 새 모듈을 만듭니다. 이 라이브러리를 게시할 예정이므로 프롬프트를 주의 깊게 따라가고, npm 패키지 이름은 고유한 이름을 선택하세요.

```sh
npx create-expo-module expo-settings
```

### example 프로젝트 실행하기

앱 중 하나를 실행해 모든 것이 제대로 동작하는지 확인합니다. 그런 다음 프로젝트 루트에서 TypeScript 컴파일러를 시작해 변경 사항을 감시하고 모듈의 JavaScript를 다시 빌드합니다.

```sh
npm run build
```

다른 터미널 창을 열고 example 앱을 컴파일하고 실행합니다.

```sh
cd example
npx expo run:android
npx expo run:ios
```

### 패키지를 npm에 게시하기

패키지를 npm에 게시하려면 npm 계정이 필요합니다. 계정이 없다면 [npm 웹사이트](https://www.npmjs.com/signup)에서 계정을 만드세요. 계정을 만든 뒤에는 다음 명령으로 로그인합니다.

```sh
npm login
```

모듈 루트로 이동한 다음, 아래 명령을 실행해 게시합니다.

```sh
npm publish
```

이제 모듈이 npm에 게시되며, 다른 프로젝트에서 `npm install`을 사용해 설치할 수 있습니다.

모듈을 npm에 게시하는 것 외에도, 다음 방법으로 프로젝트에서 사용할 수 있습니다.

-   **tarball 만들기**: `npm pack`을 사용해 모듈의 tarball을 만든 뒤, `npm install /path/to/tarball`을 실행해 프로젝트에 설치합니다. 이 방법은 게시 전에 로컬에서 모듈을 테스트하거나 npm registry에 접근할 수 없는 사람과 공유할 때 유용합니다.
-   **로컬 npm registry 실행하기**: [Verdaccio](https://verdaccio.org/) 같은 도구를 사용해 로컬 npm registry를 호스팅합니다. 이 registry에서 모듈을 설치할 수 있으며, 회사나 조직 안에서 내부 패키지를 관리할 때 유용합니다.
-   **비공개 패키지 게시하기**: [Use a private registry with EAS Build](/build-reference/private-npm-packages)를 사용해 비공개 모듈을 안전하게 관리합니다.

### 게시된 모듈 테스트하기

새 프로젝트에서 게시된 모듈을 테스트하려면, 새 앱을 만들고 아래 명령으로 해당 모듈을 의존성으로 설치합니다.

```sh
npx create-expo-app@latest my-app --template default@sdk-55
cd my-app
npx expo install expo-settings
```

이제 앱에서 모듈을 사용할 수 있습니다. 테스트하려면 **src/app/index.tsx**를 편집하고 **expo-settings**의 텍스트 메시지를 렌더링하세요.

```tsx
import React from 'react';
import * as Settings from 'expo-settings';
import { Text, View } from 'react-native';

export default function TabOneScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{Settings.hello()}</Text>
    </View>
  );
}
```

마지막으로 프로젝트를 prebuild한 뒤 아래 명령으로 앱을 실행합니다.

```sh
npx expo prebuild --clean
npx expo run:android
npx expo run:ios
```

이 구성이 끝나면 앱에 "Hello world! 👋" 텍스트가 표시됩니다.

## 다음 단계

[Wrap third-party native libraries](/modules/third-party-library) — Expo 모듈에서 서드파티 네이티브 라이브러리를 감싸는 방법을 알아보세요.

[Tutorial: Creating a native module](/modules/native-module-tutorial) — Expo Modules API로 설정을 유지하는 네이티브 모듈을 만드는 튜토리얼입니다.
