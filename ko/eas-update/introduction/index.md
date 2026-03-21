---
modificationDate: March 05, 2026
title: EAS Update
description: EAS Update는 expo-updates 라이브러리를 사용하는 프로젝트에 update를 제공하는 cloud service입니다.
---

# EAS Update

EAS Update는 expo-updates 라이브러리를 사용하는 프로젝트에 update를 제공하는 cloud service입니다.

**EAS Update**는 [`expo-updates`](/versions/latest/sdk/updates) 라이브러리를 사용하는 프로젝트에 update를 제공하는 EAS(Expo Application Services)의 cloud service입니다.

EAS Update를 사용하면 app store 제출 사이사이에 작은 버그를 고치고 빠른 수정 사항을 매우 손쉽게 푸시할 수 있습니다. 이는 앱이 자신의 비네이티브 부분(JS, styling, image 등)을 OTA 방식으로 업데이트할 수 있게 함으로써 이루어집니다. `expo-updates` 라이브러리가 포함된 모든 앱은 update를 받을 수 있습니다.

## 빠른 시작

> 아래 `eas` 명령을 사용하려면 EAS CLI가 필요합니다. 자세한 내용은 [EAS CLI 설치 방법](/eas/cli#installation)을 참고하세요.

`expo-updates` 라이브러리를 설치하고 EAS Update를 구성하세요:

```sh
npx expo install expo-updates
eas update:configure
```

build에 `expo-updates` 라이브러리를 포함하려면 Android 또는 iOS용 새 build를 만들어야 합니다. 그 후에는 production channel로 update를 푸시할 수 있습니다:

```sh
eas update --channel production --message "Fix login button alignment"
```

이 명령은 JavaScript bundle과 asset을 게시하므로, 사용자는 다음 앱 실행 시 새 버전을 받게 됩니다.

EAS Update 사용을 시작하는 전체 단계는 [EAS Update 시작하기](/eas-update/getting-started)를 참고하세요.

## 주요 기능

### update 관리를 위한 JS API

updates [JavaScript API](/versions/latest/sdk/updates)에는 `useUpdates()`라는 React hook이 포함되어 있습니다. 이 hook은 현재 실행 중인 update와, 사용 가능하거나 이미 다운로드된 새 update에 대한 자세한 정보를 제공합니다. 또한 앱이 update를 시도하는 동안 발생한 오류도 볼 수 있어 문제를 디버깅하는 데 도움이 됩니다.

이 API는 `checkForUpdateAsync()`와 `fetchUpdateAsync()` 같은 메서드도 제공하며, 이를 통해 앱이 update를 확인하고 다운로드하는 시점을 제어할 수 있습니다.

### Insight 추적

어떤 update가 어떤 build로 전달되고 있는지 시각화하는 데 도움이 되는 [deployments dashboard](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/deployments)를 사용할 수 있습니다. updates는 [insights](/eas-insights/introduction)와 함께 작동하여, 사용자가 여러분의 update를 얼마나 채택했는지에 대한 데이터를 제공합니다.

### 실수를 되돌리기 위한 republish

update가 기대한 대로 동작하지 않는다면, 버전 관리 시스템의 새 "commit"처럼 문제가 있는 update 위에 이전의 안정적인 version을 [republish](/eas-update/eas-cli#republish-a-previous-update-within-a-branch)할 수 있습니다.

## EAS Update를 사용해야 할 때

| 시나리오 | 권장 여부 |
| --- | --- |
| JavaScript code의 버그나 충돌을 수정하고 몇 분 안에 update 배포하기 | ✓ |
| copy, 번역, UI styling 또는 screen layout 업데이트하기 | ✓ |
| [rollouts](/eas-update/rollouts)을 사용해 일부 사용자 비율에 변경 사항 rollout하기 | ✓ |
| [CI 또는 자동화된 워크플로](/eas/workflows/pre-packaged-jobs#update)에서 update 게시하기 | ✓ |
| production release 전에 internal team과 update 테스트하기 | ✓ |
| native code 또는 native dependency 변경하기 | ✗ |
| 앱 권한(camera, location 등) 변경하기 | ✗ |
| Expo SDK version 업데이트하기 | ✗ |
| 새로운 앱 binary version이 필요한 모든 것 | ✗ |

✗로 표시된 시나리오에서는 [EAS Build](/build/introduction)를 사용해 새 app binary를 만들어 제출하세요.

## 자주 묻는 질문(FAQ)

update를 게시할 때 어떤 가이드라인을 따라야 하나요?

EAS Update의 규칙 중 하나는 build 대상 플랫폼과 app store의 규칙을 따라야 한다는 것입니다. 즉 update 내용과 update 사용 방식 모두 App Store와 Play Store 가이드라인을 따라야 합니다. 보통 이는 앱 동작의 변경 사항이 리뷰를 거쳐야 함을 의미합니다.

App Store 규칙은 정기적으로 바뀌며, Expo 없이 앱을 작성할 때 규칙을 따라야 하는 것처럼, Expo와 EAS Update를 사용할 때도 규칙을 따라야 합니다.

EAS Update는 앱 사용자에게 개선 사항을 빠르게 전달할 수 있는 훌륭한 방법입니다. 예를 들어 즉시 수정해야 하는 치명적인 버그가 있는 앱을 생각해 보세요. EAS Update를 사용하면 빠르게 수정 사항을 배포하고, 이후 해당 수정이 내장된 새 제출로 이어갈 수 있습니다.

청구 주기에서 "monthly active users"는 어떻게 계산되나요?

> **참고**: monthly active user 1명은 청구 주기 동안 update를 최소 1회 다운로드한 앱의 고유 설치 1건과 같습니다.

-   청구 주기의 매일 새 update를 다운로드하는 앱 설치 1건은 monthly active user 1명으로 계산됩니다.
-   청구 주기 동안 새 update를 전혀 다운로드하지 않는 앱 설치 1건은 monthly active user 0명으로 계산됩니다.
-   앱을 uninstall했다가 reinstall하고, 청구 주기 동안 각각에서 update를 다운로드했다면 monthly active user 2명으로 계산됩니다.
-   단일 기기에 하나의 Expo account가 소유한 앱 두 개가 설치되어 있고 둘 다 updates를 사용한다면, 해당 account에서는 monthly active user 2명으로 계산됩니다.

앱에 custom update 전략을 구현하려면 어떻게 해야 하나요?

기본적으로 `expo-updates`는 앱이 로드될 때마다 update를 확인합니다. [Updates API](/versions/latest/sdk/updates)와 [app config](/versions/latest/config/app#updates)를 사용해 custom update 전략을 구현할 수 있습니다.

기존 React Native 프로젝트에서 EAS Update를 사용할 수 있나요?

네. EAS Update는 [Continuous Native Generation(CNG)](/workflow/continuous-native-generation)을 사용하는 프로젝트와, [기존 React Native 프로젝트](/bare/installing-updates) 중 [`expo-updates`](/versions/latest/sdk/updates) 라이브러리가 설치된 프로젝트 모두에서 동작합니다.

앱 사용자는 update를 받기 위해 앱을 다시 설치해야 하나요?

아니요. update는 앱 내부에서 다운로드되고 구성에 따라 적용됩니다. 앱 사용자는 다음 앱 실행이나 reload에서 새 버전을 보게 됩니다.

EAS Update는 native code 호환성을 어떻게 처리하나요?

EAS Update는 [runtime version policy](/eas-update/runtime-versions)를 사용해 호환되는 native code가 있는 build에만 update가 전송되도록 보장합니다. native code가 바뀌면 새 runtime version을 만듭니다.

EAS Workflows 안에서나 다른 CI/CD pipeline에서 EAS Update를 사용할 수 있나요?

네. EAS Update는 [EAS Workflows](/eas/workflows/get-started)와 함께 동작합니다. 여전히 Android 또는 iOS용 새 build를 구성하고 만들어야 합니다. 그 후에는 workflow 구성에 update job을 추가할 수 있습니다. 예를 들면 다음과 같습니다:

```yaml
jobs:
  publish_update:
    type: update
    params:
      message: 'Fix login button alignment'
      channel: production
```

자세한 내용은 [EAS Workflows 사전 패키징 job](/eas/workflows/pre-packaged-jobs#update)을 참고하세요.

GitHub Actions로 update 게시를 자동화하려면 [PR preview용 GitHub Action](/eas-update/github-actions) 가이드를 참고하세요.

EAS Update와 CodePush의 차이는 무엇인가요?

EAS Update는 [EAS Build](/build/introduction)와도 통합되는 native 솔루션이며 통합 워크플로를 제공합니다. CodePush는 약간 다른 접근 방식을 사용합니다. 두 차이에 대해 더 자세히 알아보려면 [CodePush와 EAS Update의 개념적 차이](/eas-update/codepush#conceptual-differences-between-codepush-and-eas-update)를 참고하세요.

Classic Updates는 아직 지원되나요?

Classic Updates 서비스는 2021년 12월 이전에 제공되었고 현재는 deprecated 상태입니다. 새 update는 `expo publish`로 게시할 수 없지만, 기존 앱은 이미 게시되어 현재도 사용 중인 Classic Updates를 계속 받을 수 있습니다.

EAS Update로 전환하거나 [self-hosted update service](/versions/latest/sdk/updates)를 사용하는 것을 권장합니다.

## 시작하기

[EAS Update 시작하기](/eas-update/getting-started) — 프로젝트에서 EAS Update를 구성하고 사용하는 데 필요한 설정을 시작하는 방법을 알아보세요.

[update 게시하기](/eas-update/getting-started#publish-an-update) — EAS Update로 특정 branch에 update를 게시하는 방법을 알아보세요.

[update 미리보기](/eas-update/preview) — EAS Update로 동료의 변경 사항을 확인하세요.

[GitHub Actions 사용하기](/eas-update/github-actions) — commit 이후 QR 코드와 함께 update를 게시하고 preview하세요.

[CodePush에서 마이그레이션하기](/eas-update/codepush) — CodePush에서 EAS Update로 마이그레이션하는 방법을 알아보세요.

[다른 EAS 서비스와 함께 EAS Update 사용하기](/tutorial/eas/introduction) — EAS Update를 다른 EAS 서비스와 함께 사용하는 전체 튜토리얼은 이 EAS 튜토리얼을 참고하세요.
