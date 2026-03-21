---
modificationDate: December 01, 2025
title: CI에서 빌드 트리거하기
description: GitHub Actions 등 CI 환경에서 앱의 EAS 빌드를 트리거하는 방법을 알아보세요.
---

# CI에서 빌드 트리거하기

GitHub Actions 등 CI 환경에서 앱의 EAS 빌드를 트리거하는 방법을 알아보세요.

이 문서는 GitHub Actions, Travis CI 등과 같은 CI 환경에서 앱의 EAS 빌드를 트리거하는 방법을 설명합니다.

## 사전 준비

### 로컬 머신에서 빌드를 성공적으로 실행하기

CI 환경에서 EAS 빌드를 트리거하려면, 앱이 non-interactive 모드에서 EAS Build를 사용할 수 있도록 설정되어 있어야 합니다. 이를 위해 EAS Build 초기화 단계를 거치고, CI에서 지원하려는 각 플랫폼에 대해 로컬 터미널에서 빌드를 한 번 성공적으로 실행하세요. 이렇게 하면 `eas build` 명령이 필요한 추가 구성을 물어볼 수 있고, 그 구성이 이후 CI에서의 non-interactive 실행에도 그대로 사용됩니다.

로컬에서 빌드를 실행하면 다음과 같은 중요한 구성 단계를 완료하게 됩니다:

-   `projectId`를 생성해 프로젝트를 EAS에 초기화합니다.
-   build profile을 정의하는 **eas.json** 파일을 추가합니다.
-   `android.packageName`과 `ios.bundleIdentifier` 같은 네이티브 빌드용 핵심 app config 속성을 채웁니다.
-   Android keystore, iOS 배포 인증서와 provisioning profile을 포함한 빌드 자격 증명이 생성되어 있는지 보장합니다.

`eas build -p [all|android|ios]`를 실행하고 각 플랫폼의 빌드가 성공적으로 완료되는지 확인하세요. 그다음 아래 단계로 진행해 CI에 EAS Build를 구현하면 됩니다.

아직 이 작업을 하지 않았다면 [첫 빌드 만들기](/build/setup) 가이드를 보고 준비가 되면 여기로 돌아오세요.

## EAS Workflows 사용하기

[EAS Workflows](/eas/workflows/get-started)는 Expo에서 제공하는 CI/CD 서비스로, EAS에서 빌드와 그 외 다양한 작업 유형을 실행할 수 있게 해 줍니다. development build 생성이나 앱 스토어 자동 빌드 및 제출처럼 개발 및 릴리스 프로세스를 자동화하는 데 사용할 수 있습니다.

EAS Workflows로 빌드를 만들려면 먼저 **.eas/workflows/build.yml**에 다음 코드를 추가하세요:

```yaml
name: Build

on:
  push:
    branches:
      - main

jobs:
  build_android:
    name: Build Android App
    type: build
    params:
      platform: android
  build_ios:
    name: Build iOS App
    type: build
    params:
      platform: ios
```

main 브랜치에 커밋이 push되면 이 workflow가 Android와 iOS 빌드를 생성합니다. 이 workflow를 수정하고 다른 유형의 작업을 순차적으로 실행하는 방법은 [EAS Workflows 문서](/eas/workflows/get-started)에서 더 알아볼 수 있습니다.

## 다른 CI 서비스용으로 앱 구성하기

### CI에서 Expo 계정에 인증하기 위한 personal access token 제공하기

다음으로, CI에서 앱 소유자로 인증할 수 있도록 해야 합니다. 이를 위해 CI 설정에서 `EXPO_TOKEN` 환경 변수에 personal access token을 저장할 수 있습니다.

access token 생성 방법은 [personal access tokens](/accounts/programmatic-access#personal-access-tokens)를 참고하세요.

### (선택 사항) Apple Team용 ASC API Token 제공하기

iOS 자격 증명을 복구해야 하는 상황에서는 CI에서 Apple에 인증하기 위해 ASC API key가 필요합니다. 흔한 사례 중 하나는 provisioning profile을 다시 서명해야 하는 경우입니다.

[API Key](https://expo.fyi/creating-asc-api-key)를 생성해야 합니다. 그다음 [Apple Team](https://expo.fyi/apple-team)에 대한 정보를 수집해야 합니다.

수집한 정보를 사용해 환경 변수를 통해 build 명령에 전달하세요. 다음 값을 전달해야 합니다:

-   `EXPO_ASC_API_KEY_PATH`: ASC API Key **.p8** 파일 경로. 예: **/path/to/key/AuthKey_SFB993FB5F.p8**
-   `EXPO_ASC_KEY_ID`: ASC API Key의 key ID. 예: `SFB993FB5F`
-   `EXPO_ASC_ISSUER_ID`: ASC API Key의 issuer ID. 예: `f9675cff-f45d-4116-bd2c-2372142cee09`
-   `EXPO_APPLE_TEAM_ID`: Apple Team ID. 예: `77KQ969CHE`
-   `EXPO_APPLE_TEAM_TYPE`: Apple Team Type. 가능한 값은 `IN_HOUSE`, `COMPANY_OR_ORGANIZATION`, `INDIVIDUAL`입니다.

### 새 빌드 트리거하기

이제 Expo CLI로 인증이 되었으므로 빌드 단계를 만들 수 있습니다.

새 빌드를 트리거하려면 구성에 다음 스크립트를 추가합니다:

```sh
npx eas-cli build --platform all --non-interactive --no-wait
```

이렇게 하면 EAS에서 새 빌드가 트리거됩니다. EAS dashboard에서 빌드 진행 상황으로 연결되는 URL이 출력됩니다.

> `--no-wait` 플래그는 빌드가 트리거되면 해당 단계를 종료합니다. EAS가 빌드를 수행하는 동안에는 CI 실행 시간에 대한 과금이 발생하지 않습니다. 다만 CI는 EAS Build 트리거에 성공했을 때만 해당 빌드 작업을 성공으로 보고합니다.

Travis CI

프로젝트 저장소 루트의 **.travis.yml**에 다음 코드 스니펫을 추가하세요.

```yaml
language: node_js
node_js:
  - node
  - lts/*
cache:
  directories:
    - ~/.npm
before_script:
  - npm install -g npm@latest

jobs:
  include:
    - stage: build
      node_js: lts/*
      script:
        - npm ci
        - npx eas-cli build --platform all --non-interactive --no-wait
```
GitLab CI

프로젝트 저장소 루트의 **.gitlab-ci.yml**에 다음 코드 스니펫을 추가하세요.

```yaml
image: node:alpine

cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - .npm
    # or with Yarn:
    #- .yarn

stages:
  - build

before_script:
  - npm ci --cache .npm
  # or with Yarn:
  #- yarn install --cache-folder .yarn

eas-build:
  stage: build
  script:
    - apk add --no-cache bash
    - npx eas-cli build --platform all --non-interactive --no-wait
```
Bitbucket Pipelines

프로젝트 저장소 루트의 **bitbucket-pipelines.yml**에 다음 코드 스니펫을 추가하세요.

```yaml
image: node:alpine

definitions:
  caches:
    npm: ~/.npm

pipelines:
  default:
    - step:
        name: Build app
        deployment: test
        caches:
          - npm
        script:
          - apk add --no-cache bash
          - npm ci
          - npx eas-cli build --platform all --non-interactive --no-wait
```
CircleCI

프로젝트 저장소 루트의 **circleci/config.yml**에 다음 코드 스니펫을 추가하세요.

```yaml
version: 2.1

executors:
  default:
    docker:
      - image: cimg/node:lts
    working_directory: ~/my-app

jobs:
  eas_build:
    executor: default
    steps:
      - checkout
      - run:
          name: Install dependencies
          command: npm ci
      - run:
          name: Trigger build
          command: npx eas-cli build --platform all --non-interactive --no-wait

workflows:
  build_app:
    jobs:
      - eas_build:
          filters:
            branches:
              only: master
```
GitHub Actions

프로젝트 저장소 루트의 **.github/workflows/eas-build.yml**에 다음 코드 스니펫을 추가하세요.

```yaml
name: EAS Build
on:
  workflow_dispatch:
  push:
    branches:
      - main
jobs:
  build:
    name: Install and build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v6
        with:
          node-version: 22
          cache: npm
      - name: Setup Expo and EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - name: Install dependencies
        run: npm ci
      - name: Build on EAS
        run: eas build --platform all --non-interactive --no-wait
```
