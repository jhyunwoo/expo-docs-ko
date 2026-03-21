---
modificationDate: March 11, 2026
title: EAS Workflows 시작하기
description: React Native CI/CD 개발 및 릴리스 프로세스를 자동화하기 위해 EAS Workflows를 사용하는 방법을 알아보세요.
---

# EAS Workflows 시작하기

React Native CI/CD 개발 및 릴리스 프로세스를 자동화하기 위해 EAS Workflows를 사용하는 방법을 알아보세요.

이 페이지는 앱을 build하고 앱 스토어에 제출하는 첫 번째 EAS Workflow를 만드는 과정을 단계별로 안내합니다.

## 시작하기

사전 요구 사항

요구 사항 4개

1.

Expo 계정 가입하기

[sign up](https://expo.dev/signup) 링크를 통해 Expo 계정을 만들어야 합니다.

2.

프로젝트 만들기

다음 명령으로 프로젝트를 만들어야 합니다.

```sh
npx create-expo-app@latest --template default@sdk-55
```

3.

프로젝트를 EAS와 동기화하기

다음 명령으로 프로젝트를 EAS와 동기화해야 합니다. 이 과정에서 EAS 프로젝트가 생성되고 로컬 프로젝트와 연결됩니다.

```sh
npx eas-cli@latest init
```

4.

eas.json 추가하기

아직 없다면 프로젝트 루트에 `eas.json` 파일을 추가해야 합니다.

```sh
touch eas.json && echo "{}" > eas.json
```

프로젝트 루트에 **.eas/workflows**라는 디렉터리를 만들고 그 안에 YAML 파일을 하나 추가하세요. 예: **.eas/workflows/create-production-builds.yml**

`my-app`

 `.eas`

  `workflows`

   `create-production-builds.yml`

 `eas.json`

`create-production-builds.yml` 파일에 다음 YAML을 추가하세요.

```yaml
name: Create Production Builds

jobs:
  build_android:
    type: build # This job type creates a production build for Android
    params:
      platform: android
  build_ios:
    type: build # This job type creates a production build for iOS
    params:
      platform: ios
```

위 workflow는 Android와 iOS용 production build를 병렬로 생성합니다. 이 workflow를 성공적으로 실행하려면 먼저 [EAS CLI로 프로젝트를 설정하고 build](/build/setup)해야 합니다.

마지막으로 다음 명령으로 workflow를 실행하세요.

```sh
npx eas-cli@latest workflow:run create-production-builds.yml
```

실행하면 프로젝트의 [workflows page](https://expo.dev/accounts/%5Baccount%5D/projects/%5BprojectName%5D/workflows)에서 workflow가 돌아가는 모습을 볼 수 있습니다.

## 더 보기

### GitHub 이벤트로 workflow 자동화하기

GitHub 저장소에 commit을 push해 workflow를 트리거할 수 있습니다. 다음 단계로 GitHub 저장소를 EAS 프로젝트에 연결할 수 있습니다.

-   프로젝트의 [GitHub settings](https://expo.dev/accounts/%5Baccount%5D/projects/%5BprojectName%5D/github)로 이동합니다.
-   UI 안내에 따라 GitHub 앱을 설치합니다.
-   Expo 프로젝트와 일치하는 GitHub 저장소를 선택해 연결합니다.

그런 다음 workflow 파일에 [`on` trigger](/eas/workflows/syntax#on)를 추가하세요. 예를 들어 `main` branch에 commit이 push될 때 workflow를 트리거하려면 다음 내용을 추가할 수 있습니다.

```yaml
name: Create Production Builds

on:
  push:
    branches: ['main']

  jobs:
    build_android:
      type: build
      params:
        platform: android
    build_ios:
      type: build
      params:
        platform: ios
```

### VS Code 확장 기능

workflow 파일에 대한 설명과 자동 완성을 얻으려면 [Expo Tools VS Code extension](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools)을 다운로드하세요.

> 피드백이나 기능 요청이 있다면 [workflows@expo.dev](mailto:workflows@expo.dev)로 이메일을 보내 주세요.
