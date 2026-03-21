---
modificationDate: March 01, 2026
title: EAS Workflows 소개
description: EAS Workflows는 React Native 및 Expo 앱의 build, update, submission, test를 자동화하기 위한 CI/CD 서비스입니다.
---

# EAS Workflows 소개

EAS Workflows는 React Native 및 Expo 앱의 build, update, submission, test를 자동화하기 위한 CI/CD 서비스입니다.

**EAS Workflows**는 Android 및 iOS binary build, over-the-air update 게시, 앱 스토어 제출, Maestro를 사용한 E2E 테스트 실행, EAS Hosting으로 웹 앱 배포 같은 반복 작업을 팀이 자동화할 수 있게 해 주는 EAS(Expo Application Services)의 CI/CD 서비스입니다.

EAS Workflows는 모바일 앱 개발에 맞춰 특별히 설계된 pre-packaged job type을 갖춘 managed cloud 환경에서 실행됩니다. EAS 프로젝트가 GitHub와 연결되어 있으면, 팀은 GitHub 이벤트(push, pull request, labels) 또는 일정(cron)으로 workflow를 트리거하거나, EAS CLI를 통해 수동으로 실행할 수 있습니다.

[Watch: EAS Workflows 시작하기](https://www.youtube.com/watch?v=OJ2u9tQCpr4) — 모든 앱 개발 팀이 다뤄야 하는 가장 일반적인 프로세스 일부, 즉 development build 생성, preview update 게시, production 배포를 자동화하는 방법을 알아보세요.

  

## 빠른 시작

> 아래의 `eas` 명령은 EAS CLI가 필요합니다. 자세한 내용은 [How to install EAS CLI](/eas/cli#installation)를 참고하세요.

Workflows는 프로젝트 루트의 **.eas/workflows/** 디렉터리에 YAML 파일로 정의됩니다. 각 파일은 `name`, 선택적인 trigger(`on`), 그리고 클라우드에서 실행되는 하나 이상의 `jobs`를 지정합니다. 다음 명령으로 EAS CLI에서 workflow를 실행할 수 있습니다.

```sh
eas workflow:run .eas/workflows/your-workflow.yml
```

## 주요 기능

-   **React Native/Expo에 맞춘 pre-packaged 제공**: 구현 복잡성을 추상화한 즉시 사용 가능한 job type(`build`, `submit`, `update`, `maestro`, `deploy` 등)을 제공합니다.
-   **관리할 인프라 없음**: macOS 및 Linux worker가 있는 EAS에서 실행되므로, 자체 CI 서버를 유지하거나 Android Studio/Xcode를 직접 구성할 필요가 없습니다.
-   **통합 artifact 관리**: 모든 build artifact, update, log가 EAS dashboard에 표시됩니다.
-   **GitHub 통합**: branch 및 path filtering과 함께 push, pull request, label 이벤트에서 workflow를 자동으로 트리거할 수 있습니다.
-   **더 빠른 반복**: Fingerprint, Get Build, Update job을 조합해 불필요한 native build를 피하고, 가능할 때 OTA(over-the-air) update를 게시할 수 있습니다.
-   **E2E 테스트 내장**: workflow 안에서 Android emulator와 iOS simulator에서 Maestro 테스트를 직접 실행할 수 있습니다.
-   **Slack 알림**: workflow가 성공하거나 실패할 때 Slack channel로 알림을 보낼 수 있습니다.
-   **Repack**: 기존 build의 metadata와 JavaScript bundle을 재사용해 더 빠르게 호환 build를 만들 수 있습니다.

## Workflow trigger 유형

### Push workflows

일치하는 branch 또는 tag에 commit이 push될 때 실행됩니다. glob pattern을 사용한 branch, tag, path filtering을 지원합니다.

### Pull request workflows

pull request가 열리거나, 업데이트되거나, label이 붙을 때 실행됩니다. merge 전에 preview build와 자동 테스트를 수행할 때 유용합니다.

### Scheduled workflows

cron 일정에 따라 실행됩니다(예: nightly build, weekly regression test). Scheduled workflow는 기본 branch에서만 실행됩니다.

### Manual workflows

`eas workflow:run` 명령을 사용해 필요할 때 실행합니다. 유연한 실행을 위해 parameterized input을 지원합니다.

## EAS Workflows를 사용해야 하는 경우

| Scenario | Recommendation |
| --- | --- |
| Expo 및 React Native 앱의 Android/iOS build를 자동화하고 싶다 | ✓ |
| App Store와 Google Play에 build를 자동 제출하고 싶다 | ✓ |
| 각 commit 또는 merge마다 over-the-air update를 게시하고 싶다 | ✓ |
| CI의 일부로 Maestro를 사용한 E2E 테스트를 실행하고 싶다 | ✓ |
| GitHub push 또는 pull request 이벤트로 build와 update를 트리거하고 싶다 | ✓ |
| 웹 앱을 EAS Hosting에 배포하고 싶다 | ✓ |
| fingerprint 기반 로직으로 불필요한 native build를 건너뛰고 싶다 | ✓ |
| 자체 인프라나 macOS 머신을 관리하지 않고 CI/CD를 운영하고 싶다 | ✓ |
| 비-EAS 서비스(Docker, custom runner 등)를 포함한 고도로 맞춤화된 pipeline이 필요하다 | ✗ |
| 여러 구성 변형을 병렬로 실행하는 matrix build가 필요하다 | ✗ |
| React Native가 아닌 프로젝트의 CI/CD가 필요하다 | ✗ |

## 자주 묻는 질문(FAQ)

workflow는 다른 CI 서비스와 어떻게 다른가요?

EAS Workflows는 팀이 앱을 릴리스할 수 있도록 설계되었습니다. build, submit, update, Maestro test 실행 등을 할 수 있는 pre-packaged job type이 미리 구성되어 있습니다. 모든 job type은 EAS에서 실행되므로, 하나의 YAML 파일 세트만 관리하면 되고 job 실행의 모든 artifact도 [expo.dev](https://expo.dev/)에 나타납니다.

CircleCI나 GitHub Actions 같은 다른 CI 서비스는 더 범용적이어서 workflow보다 더 많은 일을 할 수 있습니다. 하지만 그런 서비스는 각 job의 구현 방식도 더 많이 이해해야 합니다. 어떤 경우에는 그게 필요하지만, workflows는 앱 개발자에게 가장 필수적인 job type을 미리 패키징해 일반적인 작업을 빠르게 처리하도록 도와줍니다. 게다가 workflows는 작업에 가장 빠른 클라우드 머신을 제공하도록 설계되어 있으며, 우리는 이를 계속 업데이트합니다.

EAS Workflows는 Expo 앱과 관련된 작업에 매우 적합하며, 다른 CI/CD 서비스는 그 외 유형의 workflow에 더 나은 경험을 제공할 수 있습니다.

GitHub 없이도 workflow를 트리거할 수 있나요?

예. 모든 workflow는 `on` trigger 구성과 관계없이 `eas workflow:run`을 사용해 수동으로 실행할 수 있습니다. cron 문법을 사용하는 scheduled trigger도 사용할 수 있습니다.

workflow는 어떤 클라우드 머신에서 실행되나요?

workflow는 EAS의 managed infrastructure에서 실행됩니다.

-   **Linux workers**: `linux-medium`(4 vCPU, 16 GB RAM) 또는 `linux-large`(8 vCPU, 32 GB RAM)
-   **Android emulator용 nested virtualization이 있는 Linux**: `linux-medium-nested-virtualization` 또는 `linux-large-nested-virtualization`
-   **iOS build와 simulator용 macOS workers**: `macos-medium`(5 cores, 20 GB RAM) 또는 `macos-large`(10 cores, 40 GB RAM)

workflow에서 job을 병렬 실행할 수 있나요?

예. 의존성이 없는 job은 기본적으로 병렬 실행됩니다.

어떤 job이 다른 job의 성공을 기다려야 한다면 `needs`를, 성공 여부와 관계없이 완료만 기다리려면 `after`를 사용하세요.

workflow에서 environment variables를 사용할 수 있나요?

예. workflows는 [EAS environment variables](/eas/environment-variables)와 inline `env` 값을 지원합니다. environment variables는 `${{ env.VARIABLE_NAME }}` 문법으로 참조할 수 있습니다.

현재 제한 사항은 무엇인가요?

공유 workflow 구성은 없고(각 workflow를 독립적으로 정의해야 함), matrix build도 없습니다(다른 구성을 가진 여러 변형을 병렬 실행할 수 없음). 자세한 내용과 업데이트는 [Limitations](/eas/workflows/limitations)를 참고하세요.

workflow에서 custom script를 실행할 수 있나요?

예. `steps`가 있는 [Custom jobs](/eas/workflows/syntax#custom-jobs)를 사용하면 shell command를 실행하고, `eas/checkout`, `eas/install_node_modules` 같은 built-in function을 사용하며, downstream job을 위한 output을 설정할 수 있습니다.

EAS Workflows는 기존 React Native 프로젝트와도 동작하나요?

예. EAS Build용으로 프로젝트가 구성되어 있다면 EAS Workflows는 [CNG(Continuous Native Generation)](/workflow/continuous-native-generation)와 [기존 React Native 프로젝트](/bare/overview) 모두에서 동작합니다.

EAS Workflows를 검토 중이신가요? 다음 팀 회의에서 아래 슬라이드를 공유해 보세요.

팀 회의에서 아래 슬라이드를 공유해 EAS Workflows가 무엇이고 팀에 어떤 도움을 줄 수 있는지 논의해 보세요.

[

EAS Workflows CI/CD 소개 슬라이드

EAS Workflows를 사용해 CI/CD 프로세스를 자동화할 때의 이점을 알아보세요.

](/static/images/eas-workflows/eas-worfklows-slide.png)

## 시작하기

[Create your first workflow](/eas/workflows/get-started) — 첫 workflow를 만들고 실행하는 방법을 알아보세요.

[Pre-packaged jobs](/eas/workflows/pre-packaged-jobs) — 즉시 사용 가능한 job으로 앱을 build, submit, update, test, deploy하세요.

[Workflow syntax reference](/eas/workflows/syntax) — workflow를 정의하는 YAML 문법을 알아보세요.

[Example workflows](/eas/workflows/examples/introduction) — development build, preview update, production deployment에 대한 일반적인 workflow를 살펴보세요.
