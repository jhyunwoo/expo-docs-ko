---
modificationDate: February 28, 2026
title: 'Expo Modules API: 시작하기'
description: Expo modules API를 시작하는 방법을 알아보세요.
---

# Expo Modules API: 시작하기

Expo modules API를 시작하는 방법을 알아보세요.

**Expo Modules API를 시작하는 방법은 두 가지입니다:** 새 모듈을 처음부터 초기화하거나, 기존 모듈에 Expo Modules API를 추가할 수 있습니다. 이 가이드는 새 모듈을 처음부터 만드는 과정을 안내하며, 후자는 [기존 라이브러리에 통합하기](/modules/existing-library)에서 다룹니다.

Expo Modules API로 새 모듈을 만드는 데 권장되는 두 가지 흐름은 다음과 같습니다:

-   [기존 Expo 애플리케이션에 새 모듈 추가하기](/modules/get-started#add-a-new-module-to-an-existing-application): 모듈을 테스트하고 개발하는 데 사용합니다.
    
-   여러 프로젝트에서 재사용하거나 npm에 게시하려면 [생성된 example 프로젝트와 함께 새 모듈을 독립적으로 만들기](/modules/get-started#create-a-new-module-with-an-example-project)를 사용합니다.
    

이 두 흐름은 다음 섹션에서 모두 다룹니다.

## 기존 애플리케이션에 새 모듈 추가하기

### 로컬 Expo 모듈 만들기

프로젝트 디렉터리(**package.json** 파일이 들어 있는 디렉터리)로 이동한 뒤 다음 명령을 실행하세요. 이것이 로컬 Expo 모듈을 만드는 권장 방식입니다.

```sh
npx create-expo-module@latest --local
```

CLI 프롬프트에서 의미 있는 모듈 이름을 제공할 수 있습니다. 나머지 프롬프트는 기본 제안을 그대로 수락해도 됩니다.

명령을 실행하고 나면 프로젝트 안에 **modules**라는 새 디렉터리가 생성됩니다. 디렉터리 구조는 다음과 같아야 합니다:

`modules`

 `my-module`

  `android`

  `ios`

  `src`

  `expo-module.config.json`

  `index.ts`

그런 다음 프로젝트에 네이티브 프로젝트(**android**와 **ios** 디렉터리)가 아직 생성되어 있지 않다면 아래 명령을 실행하세요. 이미 있다면 이 명령은 건너뛰세요:

```sh
npx expo prebuild --clean
```

> **Note**: 프로젝트 루트에 `npx expo prebuild`로 생성한 기존 **ios** 디렉터리가 있다면, pods를 다시 설치해야 합니다:
> 
>   
> 
> ```sh
> npx pod-install
> ```

### 로컬 모듈 사용하기

예를 들어 **App.js**, **App.tsx**, 또는 **src/app/index.tsx**에서 애플리케이션에 로컬 모듈을 import하세요:

```tsx
...
import MyModule from '@/modules/my-module';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>{MyModule.hello()}</Text>
    </View>
  );
}
```

다음 단계에서 네이티브 모듈을 수정하고 앱을 빌드할 때 변경 사항이 앱에 반영되도록 터미널에서 development server를 시작하세요:

```sh
npx expo start
```

축하합니다! 로컬 Expo 모듈을 만들었습니다. 이제 이 모듈 작업을 시작할 수 있습니다.

> **Tip**: [이 구성 변경을 적용](https://expo.fyi/absolute-path-expo-modules.md)하면 absolute import path도 사용할 수 있습니다.

### 모듈 수정하기

모듈을 로컬에서 개발하고 테스트하려면 Android용 Android Studio와 iOS용 Xcode를 사용해 봅시다.

#### Android

1.  Android Studio에서 프로젝트의 **android** 디렉터리(1단계에서 `npx expo prebuild`로 생성된 디렉터리)를 엽니다. Gradle이 네이티브 디렉터리 프로젝트 동기화를 마칠 때까지 시간이 조금 걸릴 수 있습니다.
2.  프로젝트 동기화가 끝나면 **modules/my-module/android/src/main/java/expo/modules/mymodule/MyModule.kt** 파일을 엽니다.
3.  `hello` 함수가 "Hello world! 🌎🤖" 같은 다른 문자열을 반환하도록 바꾸고 파일을 저장합니다.
4.  상단 메뉴 바에서 **Run 'app'** 버튼을 클릭해 앱을 빌드하면 화면에 변경 사항이 표시됩니다.

네이티브 코드를 변경할 때마다 변경 사항을 적용하려면 빌드 단계를 반복해야 합니다.

#### iOS

1.  `xed ios` 명령을 실행해 Xcode에서 프로젝트의 **ios** 디렉터리(1단계에서 `npx expo prebuild`로 생성된 디렉터리)를 엽니다.
2.  **Pods** > **Development Pods** > **MyModule** 아래에서 **MyModule.swift** 파일을 엽니다.
3.  `hello` 함수가 "Hello world! 🌎🍎" 같은 다른 문자열을 반환하도록 바꾸고 저장합니다.
4.  상단 메뉴 바에서 **Run** 버튼을 클릭하거나 ⌘ Cmd + R을 눌러 앱을 빌드하면 화면에 변경 사항이 표시됩니다.

네이티브 코드를 변경할 때마다 변경 사항을 적용하려면 빌드 단계를 반복해야 합니다.

> **Tip**: 모듈에 새 네이티브 파일을 추가하거나 **expo-module.config.json**을 수정했을 때는 `npx pod-install`을 사용해 pods를 다시 설치하세요.

> **Note**: 애플리케이션과 병렬로 Expo 모듈을 작업하는 다른 흐름도 있습니다. 예를 들어 monorepo를 사용하거나 npm에 게시할 수 있으며, 자세한 내용은 [How to use a standalone Expo module](/modules/use-standalone-expo-module-in-your-project) 가이드를 참고하세요.

## example 프로젝트와 함께 새 모듈 만들기

### Expo 모듈 만들기

새 Expo 모듈을 처음부터 만들려면 아래와 같이 `create-expo-module` 스크립트를 실행하세요. 스크립트가 몇 가지 질문을 한 뒤, 새 모듈을 사용하는 Android 및 iOS용 example 앱과 함께 네이티브 Expo 모듈을 생성합니다.

```sh
npx create-expo-module@latest my-module
```

### 모듈 열기 및 development server 시작하기

모듈 디렉터리로 이동한 뒤 다음 명령을 실행해 Android 및/또는 iOS example 프로젝트를 여세요:

```sh
cd my-module
npm run open:android
npm run open:ios
```

다음 단계에서 네이티브 모듈을 수정하고 앱을 빌드할 때 변경 사항이 앱에 반영되도록 **example** 디렉터리로 이동한 뒤 터미널에서 development server를 시작하세요:

```sh
cd example
npx expo start
```

> **Note:** Windows를 사용 중이라면 Android Studio에서 **android** 디렉터리를 열어 example 프로젝트를 열 수는 있지만, iOS 프로젝트 파일은 열 수 없습니다.

### 모듈 수정하기

#### Android

1.  **my-module/android/src/main/java/expo/modules/mymodule/MyModule.kt** 파일을 엽니다.
2.  `hello` 함수가 "Hello world! 🌎🤖" 같은 다른 문자열을 반환하도록 바꾸고 저장합니다.
3.  상단 메뉴 바에서 **Run 'app'** 버튼을 클릭해 앱을 빌드하면 화면에 변경 사항이 표시됩니다.

네이티브 코드를 변경할 때마다 변경 사항을 적용하려면 빌드 단계를 반복해야 합니다.

#### iOS

1.  **Pods** > **Development Pods** > **MyModule** 아래에서 **MyModule.swift** 파일을 엽니다.
2.  `hello` 함수가 "Hello world! 🌎🍎" 같은 다른 문자열을 반환하도록 바꾸고 저장합니다.
3.  상단 메뉴 바에서 **Run** 버튼을 클릭하거나 ⌘ Cmd + R을 눌러 앱을 빌드하면 화면에 변경 사항이 표시됩니다.

네이티브 코드를 변경할 때마다 변경 사항을 적용하려면 빌드 단계를 반복해야 합니다.

> **Tip**: 모듈에 새 네이티브 파일을 추가하거나 **expo-module.config.json**을 수정했을 때는 `npx pod-install`을 사용해 pods를 다시 설치하세요.

## 다음 단계

이제 모듈을 초기화하고 간단한 변경을 적용하는 방법을 배웠으므로, 튜토리얼로 계속 진행하거나 바로 API 참조로 들어갈 수 있습니다.

[Tutorial: Creating a native module](/modules/native-module-tutorial) — Expo Modules API를 사용해 설정을 저장하는 네이티브 모듈을 만드는 튜토리얼입니다.

[Expo Modules API Reference](/modules/module-api) — Swift와 Kotlin을 사용해 네이티브 모듈을 만드는 참조 문서입니다.
