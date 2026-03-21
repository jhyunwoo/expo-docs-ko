---
modificationDate: November 20, 2025
title: Expo GitHub App에서 빌드 트리거하기
description: Expo GitHub App을 사용해 GitHub에서 앱의 EAS 빌드를 트리거하는 방법을 알아보세요.
---

# Expo GitHub App에서 빌드 트리거하기

Expo GitHub App을 사용해 GitHub에서 앱의 EAS 빌드를 트리거하는 방법을 알아보세요.

이 가이드는 Expo GitHub App을 사용해 GitHub 저장소에서 직접 빌드를 트리거하는 방법을 설명합니다.

## 사전 준비

### eas.json에서 `image` 필드 설정하기

GitHub와 함께 사용할 build profile에서는 **eas.json**의 네이티브 플랫폼에 사용할 [`image`](/eas/json#image)를 지정하세요.

프로젝트 구성이 특정 [build image](/build-reference/infrastructure)에 의존하지 않는다면 `latest` image를 사용하세요. 예를 들면 다음과 같습니다:

```json
{
  ... 
  "build": {
    "production": {
      "android": {
        "image": "latest"
      },
      "ios": {
        "image": "latest"
      }
    }
  }
}
```

### 로컬 머신에서 빌드를 성공적으로 실행하기

GitHub 저장소에서 EAS 빌드를 트리거하려면, 프로젝트를 EAS Build용으로 구성하고 GitHub에서 지원하려는 각 플랫폼에 대해 컴퓨터에서 빌드를 성공적으로 실행해 두어야 합니다.

아직 `eas build -p [all|ios|android]`를 성공적으로 실행해 보지 않았다면 [첫 빌드 만들기](/build/setup)를 먼저 참고하세요. 완료했다면 이 가이드의 다음 단계로 진행하세요.

또한 다음 조건도 충족해야 합니다:

-   조직의 Expo 사용자 중 한 명은 대상 저장소에 접근 권한이 있는 연결된 GitHub 사용자를 가지고 있어야 합니다. **Account settings** > **Overview** > **User settings** > [**Connections**](https://expo.dev/settings#connections)에서 GitHub 사용자 계정이 연결되어 있는지 확인하세요.
-   [Expo GitHub app](https://github.com/settings/installations)이 요청하는 권한을 승인해야 합니다.

## GitHub용으로 앱 구성하기

### GitHub 저장소를 Expo 프로젝트에 연결하기

프로젝트의 [GitHub settings](https://expo.dev/accounts/%5Baccount%5D/projects/%5BprojectName%5D/github) 페이지로 이동하세요.

GitHub 계정에 Expo GitHub App을 설치하세요.

> **참고:** 앱을 설치하려면 Expo 계정에서 [Owner 또는 Admin 접근 권한](/accounts/account-types#manage-access)이 있어야 합니다.

그다음 GitHub 저장소를 Expo 프로젝트에 연결하세요.

> **참고:** Expo organization에는 [GitHub organization repository](https://docs.github.com/en/organizations)만 연결할 수 있습니다.

다른 GitHub 계정의 저장소를 추가하려면 account selector dropdown에서 **Add new account** 옵션을 클릭하세요.

### 저장소 설정 구성하기

빌드를 실행하기 전에 Expo GitHub App은 프로젝트 소스 코드를 어디에서 찾아야 하는지 알아야 합니다. Expo 프로젝트 소스 코드가 저장소 루트에 있다면 아무것도 할 필요가 없습니다. 소스 코드가 하위 디렉터리에 있다면 프로젝트의 [GitHub settings page](https://expo.dev/accounts/%5Baccount%5D/projects/%5BprojectName%5D/github)에서 저장소의 "Base directory" 설정을 구성해야 합니다.

## GitHub에서 빌드 트리거하기

GitHub용으로 앱을 구성했다면 프로젝트 build list 페이지의 UI를 사용하거나 GitHub PR의 label을 사용해 GitHub에서 빌드를 트리거할 수 있습니다.

### Expo 웹사이트에서 빌드하기

프로젝트의 [build list page](https://expo.dev/accounts/%5Baccount%5D/projects/%5BprojectName%5D/builds)로 이동해 "Build from GitHub" 버튼을 클릭하세요. 그러면 빌드할 Git ref(branch/commit/tag), 대상 플랫폼, 적용할 build profile을 선택하라는 안내가 표시됩니다.

이 특정 빌드에 대해서만 base directory를 지정할 수도 있습니다. 이는 프로젝트의 전역 설정을 바꾸지는 않습니다.

### GitHub PR label로 빌드하기

PR에 label을 추가하면 GitHub PR에서 빌드를 트리거할 수 있습니다. label 형식은 `eas-build-[platform]:[profile]`이어야 하며, `[platform]`은 `android`, `ios`, `all` 중 하나이고 `[profile]`은 **eas.json**에 지정된 build profile 이름입니다. 빌드 플랫폼을 지정하지 않으면 기본값은 `all`입니다. build profile을 지정하지 않으면 기본값은 `production`입니다.

예를 들어 Android용 production 빌드를 트리거하려면 PR에 `eas-build-android` label을 추가하세요.

빌드는 PR의 base branch 최신 커밋을 대상으로 트리거됩니다. PR의 checks에서 빌드 상태를 볼 수 있습니다. 빌드 링크는 check details에서 확인할 수 있습니다.

### GitHub 저장소에 코드가 push될 때 자동으로 빌드하기

GitHub에 코드를 push할 때 Expo 프로젝트가 자동으로 빌드되도록 설정해 빌드 자동화를 한 단계 더 발전시킬 수 있습니다.

#### EAS Workflows 사용하기

EAS Workflows는 Expo에서 제공하는 서비스로, EAS에서 빌드와 그 밖의 여러 작업 유형을 실행할 수 있게 해 줍니다. EAS Workflows를 사용하면 development build 생성이나 앱 스토어로 자동 빌드 및 제출 같은 개발 및 릴리스 프로세스를 자동화할 수 있습니다.

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

main 브랜치에 커밋이 push되면 이 workflow가 Android와 iOS 빌드를 생성합니다. 이 workflow를 수정하고 다른 작업 유형을 순서대로 실행하는 방법은 [EAS Workflows 문서](/eas/workflows/get-started)에서 더 알아볼 수 있습니다.

#### build trigger 설정하기

> **Deprecated:** 이 기능은 deprecated 상태이며 새 프로젝트에서는 비활성화되어 있습니다. 대신 [EAS Workflows](/eas/workflows/get-started)를 사용하는 것을 권장합니다.

build trigger 설정 방법 알아보기

GitHub에서 언제 EAS가 앱을 빌드할지 구성하려면 build trigger를 설정할 수 있습니다. branch로 push할 때, pull request에서, Git tag에서 빌드하도록 설정할 수 있습니다.

대시보드에서 Expo 프로젝트를 엽니다. build trigger를 만들려면 프로젝트 GitHub settings 페이지의 **Build triggers** 섹션으로 내려가 **New Build Trigger**를 클릭하세요.

**New Build Trigger**를 클릭하면 이 빌드가 어떻게 실행될지 구성하는 form이 표시됩니다.

이 패턴에는 별표(`*`)로 표현되는 wildcard를 포함할 수 있으며, 패턴 안의 어떤 문자와 어떤 길이도 매칭할 수 있습니다. 예를 들어 `releases/*`는 `releases/`, `release/1234`, `release/genesis` 등에 매칭될 수 있습니다. 패턴을 단독 별표(`*`)로 지정하면 모든 branch/tag가 매칭됩니다.

특정 플랫폼과 build profile에 대한 trigger도 구성할 수 있습니다. 여러 플랫폼을 선택하면 각 플랫폼마다 별도의 trigger가 생성됩니다.

branch나 tag에 push하면 커밋의 **Checks** 섹션에서 빌드를 찾을 수 있습니다.

pull request의 경우 **target branch pattern**을 구성할 수 있습니다. 이는 빌드하고 싶은 pull request의 대상 브랜치입니다. wildcard 규칙도 동일하게 적용됩니다.

source branch와 target branch가 이 trigger와 일치하는 pull request에 push하면, pull request의 checks 섹션에서 이 빌드들을 찾을 수 있습니다:

> **참고:** pull request에서 빌드를 트리거하려면 pull request 작성자가 GitHub 저장소의 collaborator여야 합니다. 외부 기여자의 pull request를 빌드하고 싶다면 [PR label 적용하기](/build/building-from-github#build-using-github-pr-labels)를 사용하세요.

#### build trigger 관리하기

EAS dashboard의 프로젝트 GitHub settings 페이지에서 build trigger 행 오른쪽의 options 버튼을 클릭하면 trigger를 비활성화, 수정, 삭제할 수 있습니다.

trigger의 매개변수를 사용해 GitHub 빌드를 수동 실행할 수도 있습니다. 이 경우 자동 build trigger 기록에는 포함되지 않습니다.

#### EAS Submit으로 앱 스토어 자동 제출하기

빌드가 완료되면 EAS Submit을 사용해 앱을 앱 스토어에 자동으로 제출할 수 있습니다. 이 기능은 게시에 필요한 수동 단계를 줄여 전체 과정을 간소화합니다.

자동 제출을 활성화하려면 build trigger를 구성할 때 빌드 프로세스의 일부로 submission을 포함해야 합니다. 설정 방법은 다음과 같습니다:

-   EAS dashboard에서 프로젝트의 GitHub settings 페이지로 이동합니다.
-   수정하려는 build trigger를 찾아 options 버튼을 클릭합니다.
-   **Edit trigger**를 선택하고, 나타나는 dialog에서 **Submit to store after build** 옵션을 체크합니다.

-   변경 사항을 저장합니다.

이 기능을 켜 두면 이 구성으로 빌드가 트리거될 때마다 **eas.json**의 `submit` 필드에 구성된 앱 스토어로 자동 제출됩니다.

> **참고:** 제출용 **eas.json**이 올바르게 구성되어 있는지 확인하세요. 여기에는 올바른 앱 스토어 자격 증명과 submission profile 지정이 포함됩니다. 자세한 내용은 [EAS Submit](/submit/eas-json)을 참고하세요.

### 문제 해결

-   문제가 발생하면, 빌드를 시도했던 커밋에 일부 오류 정보를 담은 댓글을 남깁니다.
-   빌드 시도 전에 [Prerequisites](/build/building-from-github#prerequisites) 섹션의 모든 조건이 참인지 다시 확인하세요.
-   모노레포 구성을 사용 중이라면 base directory가 정확한지 확인하세요.
-   build profile이 올바른가요? **eas.json**에서 일치하는 profile을 찾지 못하면 빌드는 dispatch되지 않습니다.
