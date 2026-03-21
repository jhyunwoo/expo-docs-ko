---
modificationDate: March 02, 2026
title: EAS CLI 명령 자동화하기
description: EAS Workflows로 EAS CLI 명령 시퀀스를 자동화하는 방법을 알아보세요.
---

# EAS CLI 명령 자동화하기

EAS Workflows로 EAS CLI 명령 시퀀스를 자동화하는 방법을 알아보세요.

EAS CLI를 사용해 앱을 build, submit, update하고 있다면 EAS Workflows로 이런 명령 시퀀스를 자동화할 수 있습니다. EAS Workflows는 앱을 build, submit, update할 수 있으며, Maestro 테스트, unit test, custom script 등 다른 job도 함께 실행할 수 있습니다.

아래에서는 먼저 프로젝트를 EAS Workflows에서 사용할 수 있도록 설정하는 방법을 설명하고, 그다음 흔히 사용하는 EAS CLI 명령과 이를 EAS Workflows로 실행하는 방법을 소개합니다.

## 프로젝트 구성하기

EAS Workflows는 선택적으로 EAS 프로젝트에 연결된 GitHub 저장소를 지원합니다. 이 가이드는 GitHub 저장소가 이미 연결되어 있다고 가정하며, GitHub의 특정 branch에 push할 때 workflow를 트리거하는 방법을 보여 줍니다. 다음 단계로 GitHub 저장소를 EAS 프로젝트에 연결할 수 있습니다.

-   프로젝트의 [GitHub settings](https://expo.dev/accounts/%5Baccount%5D/projects/%5BprojectName%5D/github)로 이동합니다.
-   UI 안내에 따라 GitHub 앱을 설치합니다.
-   Expo 프로젝트와 일치하는 GitHub 저장소를 선택해 연결합니다.

## Build 만들기

EAS CLI의 `eas build` 명령으로 프로젝트 build를 만들 수 있습니다. `production` build profile로 iOS build를 만들려면 다음 EAS CLI 명령을 실행할 수 있습니다.

```sh
eas build --platform ios --profile production
```

이 명령을 workflow로 작성하려면 프로젝트 루트에 **.eas/workflows/build-ios-production.yml**이라는 workflow 파일을 만드세요.

**build-ios-production.yml** 안에서는 다음 workflow를 사용해 `production` build profile로 iOS build를 생성하는 job을 시작할 수 있습니다.

```yaml
name: iOS production build

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

이 workflow 파일이 있으면 `main` branch에 commit을 push하거나, 다음 EAS CLI 명령을 실행해 workflow를 시작할 수 있습니다.

```sh
eas workflow:run build-ios-production.yml
```

매개변수를 바꿔 Android build를 만들거나 다른 build profile을 사용할 수도 있습니다. build job 매개변수에 대한 자세한 내용은 [build job documentation](/eas/workflows/syntax#build)을 참고하세요.

## Build 제출하기

EAS CLI의 `eas submit` 명령으로 앱을 앱 스토어에 제출할 수 있습니다. iOS 앱을 제출하려면 다음 EAS CLI 명령을 실행할 수 있습니다.

```sh
eas submit --platform ios
```

이 명령을 workflow로 작성하려면 프로젝트 루트에 **.eas/workflows/submit-ios.yml**이라는 workflow 파일을 만드세요.

**submit-ios.yml** 안에서는 다음 workflow를 사용해 iOS 앱을 제출하는 job을 시작할 수 있습니다.

```yaml
name: Submit iOS app

on:
  push:
    branches: ['main']

jobs:
  submit_ios:
    name: Submit iOS
    type: submit
    params:
      platform: ios
```

이 workflow 파일이 있으면 `main` branch에 commit을 push하거나, 다음 EAS CLI 명령을 실행해 workflow를 시작할 수 있습니다.

```sh
eas workflow:run submit-ios.yml
```

매개변수를 바꿔 다른 플랫폼을 제출하거나 다른 submit profile을 사용할 수도 있습니다. submit job 매개변수에 대한 자세한 내용은 [submit job documentation](/eas/workflows/syntax#submit)을 참고하세요.

## Update 게시하기

EAS CLI의 `eas update` 명령으로 앱을 업데이트할 수 있습니다. 앱을 업데이트하려면 다음 EAS CLI 명령을 실행할 수 있습니다.

```sh
eas update --auto
```

이 명령을 workflow로 작성하려면 프로젝트 루트에 **.eas/workflows/publish-update.yml**이라는 workflow 파일을 만드세요.

**publish-update.yml** 안에서는 다음 workflow를 사용해 over-the-air update를 전송하는 job을 시작할 수 있습니다.

```yaml
name: Publish update

on:
  push:
    branches: ['*']

jobs:
  update:
    name: Update
    type: update
    params:
      branch: ${{ github.ref_name || 'test'}}
```

이 workflow 파일이 있으면 어떤 branch에든 commit을 push하거나, 다음 EAS CLI 명령을 실행해 workflow를 시작할 수 있습니다.

```sh
eas workflow:run publish-update.yml
```

매개변수를 바꿔 특정 branch나 channel을 업데이트하고, update message를 구성할 수도 있습니다. update job 매개변수에 대한 자세한 내용은 [update job documentation](/eas/workflows/syntax#update)을 참고하세요.

## 다음 단계

Workflows는 개발 및 릴리스 프로세스를 자동화하는 강력한 방법입니다. development build 만들기, preview update 게시하기, production build 만들기에 대해 workflows examples 가이드에서 더 알아보세요.

[Workflow examples](/eas/workflows/examples/introduction) — workflow를 사용해 development build를 만들고, preview update를 게시하고, production build를 만드는 방법을 알아보세요.
