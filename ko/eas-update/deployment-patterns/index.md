---
modificationDate: January 06, 2025
title: 대안적 배포 패턴
description: EAS Update를 사용할 때 프로젝트에 적용할 수 있는 다양한 배포 패턴을 알아보세요.
---

# 대안적 배포 패턴

EAS Update를 사용할 때 프로젝트에 적용할 수 있는 다양한 배포 패턴을 알아보세요.

앱에 기능을 만들고 버그를 수정한 뒤에는, 가능한 한 빠르고 안전하게 사용자에게 그 기능과 수정 사항을 전달하고 싶습니다. 하지만 사용자의 기기에 코드를 전달할 때 "안전"과 "빠름"은 종종 서로 반대되는 힘으로 작용합니다. 코드를 직접 production에 푸시하면 빠르지만 테스트하지 않았으므로 안전하지 않을 수 있습니다. 반대로 테스트 build를 만들고 QA 팀과 공유하고 주기적으로 릴리스하면 더 안전하지만 변경 사항을 사용자에게 전달하는 속도는 느려집니다.

프로젝트마다 사용자에게 update를 전달할 때 얼마나 "빠르고" 얼마나 "안전해야" 하는지에 대한 허용 범위가 다릅니다.

EAS Update 배포 프로세스를 설계할 때 고려해야 할 부분은 세 가지입니다:

1.  **build 만들기**
    -   (a) production용 build만 만들 수 있습니다.
    -   (b) production용 build와 pre-production 변경 사항 테스트용 별도 build를 만들 수 있습니다.
2.  **변경 사항 테스트하기**
    -   (a) TestFlight와 Play Store Internal Track으로 변경 사항을 테스트할 수 있습니다.
    -   (b) internal distribution build로 변경 사항을 테스트할 수 있습니다.
    -   (c) Expo Go 또는 [development build](/develop/development-builds/introduction)로 변경 사항을 테스트할 수 있습니다.
3.  **update 게시하기**
    -   (a) 단일 branch에 update를 게시할 수 있습니다.
    -   (b) "production", "staging"처럼 환경 기반 update branch를 만들 수 있습니다.
    -   (c) "version-1.0"처럼 버전 기반 update branch를 만들 수 있으며, 이를 통해 한 channel에서 다른 channel로 update를 promote할 수 있습니다.

위 요소들을 조합하고 조정해, 팀과 사용자에게 적절한 릴리스 속도와 안전성의 균형을 갖춘 프로세스를 만들 수 있습니다.

또 다른 고려 사항은 프로세스 전반에서 버전/이름/환경을 얼마나 세세하게 관리해야 하는가입니다. 관리 포인트가 적을수록 일관된 프로세스를 따르기 쉬워지고, 동료와도 소통하기 쉬워집니다. 반대로 더 세밀한 제어가 필요하다면 원하는 정확한 프로세스를 얻기 위해 추가 관리가 필요합니다.

아래에는 EAS Update를 사용해 프로젝트를 배포하는 네 가지 일반적인 패턴을 설명합니다.

## Two-command flow

이 흐름은 가장 단순하고 빠른 흐름이며, 안전성 검사가 가장 적습니다. Expo를 시험해 보거나 작은 프로젝트에 적합합니다. 이 흐름은 위에서 설명한 배포 프로세스 요소 중 다음으로 구성됩니다:

**build 만들기:** (a) production용 build만 만듭니다.

**변경 사항 테스트하기:** (c) Expo Go 또는 [development build](/develop/development-builds/introduction)로 변경 사항을 테스트합니다.

**update 게시하기:** (a) 단일 branch에 게시합니다.

### 흐름 다이어그램

### 흐름 설명

1.  로컬에서 프로젝트를 개발하고 development build 또는 Expo Go에서 변경 사항을 테스트합니다.
2.  `eas build`를 실행해 build를 만들고 app store에 제출합니다. 이 build는 공개 사용을 위한 것이며 app store에 제출되고 심사를 거쳐 릴리스되어야 합니다.
3.  사용자에게 전달하고 싶은 update가 생기면 `eas update --branch production`을 실행해 즉시 전달합니다.

#### 이 흐름의 장점

-   이 흐름은 추가 버전이나 환경 이름을 관리할 필요가 없어 다른 사람과 소통하기 쉽습니다.
-   build에 update를 전달하는 속도가 매우 빠릅니다.

#### 이 흐름의 단점

-   코드가 의도대로 동작할지 확인할 pre-production 검사가 없습니다. Expo Go 또는 [development build](/develop/development-builds/introduction)로 테스트할 수는 있지만, 전용 테스트 환경을 갖는 것보다 안전성이 낮습니다.

## Persistent staging flow

이 흐름은 "branch promotion flow"의 버전 없는 변형입니다. branch로 릴리스 버전을 추적하지 않습니다. 대신 지속적인 "staging" 및 "production" branch를 두고 계속 merge해 나갑니다. 이 흐름은 위 배포 프로세스 요소 중 다음으로 구성됩니다:

**build 만들기:** (b) production용 build와 테스트용 별도 build를 만듭니다.

**변경 사항 테스트하기:** (a) TestFlight와 Play Store Internal Track에서 테스트하고/또는 (b) internal distribution build로 테스트합니다.

**update 게시하기:** (b) "staging"과 "production"처럼 환경 기반 update branch를 만듭니다.

### 흐름 다이어그램

### 흐름 설명

1.  로컬에서 프로젝트를 개발하고 Expo Go에서 변경 사항을 테스트합니다.
2.  나중에 심사를 거쳐 app store에서 제공될 "production"이라는 channel 이름의 build를 만듭니다. 또 다른 build 세트는 "staging"이라는 channel 이름으로 만들고, 이를 TestFlight와 Play Store Internal Track에서 테스트하는 데 사용합니다.
3.  branch에 commit을 merge할 때 update를 게시하도록 `expo-github-action`을 설정합니다.
4.  "staging"이라는 이름의 branch로 변경 사항을 merge합니다. GitHub Action이 update를 게시하고 테스트 build에서 사용할 수 있게 합니다.
5.  준비가 되면 변경 사항을 "production" branch에 merge해 production build에 update를 게시합니다.

#### 이 흐름의 장점

-   production 배포 속도를 development 속도와 독립적으로 제어할 수 있습니다. 앱을 추가로 테스트할 기회를 주며, PR이 merge될 때마다 사용자가 새 update를 내려받지 않도록 해 줍니다.
-   "staging"과 "production"이라는 GitHub branch에 merge할 때 update 배포가 일어나므로 팀과 소통하기 쉽습니다.

#### 이 흐름의 단점

-   이전 버전의 앱을 checkout하는 과정이 조금 더 복잡합니다. 이전 branch가 아니라 이전 commit을 checkout해야 하기 때문입니다.
-   "production"에 merge할 때 update가 "staging" channel의 build에서 "production" channel의 build로 이동되는 것이 아니라, 다시 빌드되고 다시 게시됩니다.

## Platform-specific flow

이 흐름은 Android 앱과 iOS 앱을 항상 별도로 빌드하고 업데이트해야 하는 프로젝트를 위한 것입니다. 따라서 Android와 iOS 앱에 update를 전달하는 명령이 각각 따로 생깁니다. 이 흐름은 위 배포 프로세스 요소 중 다음으로 구성됩니다:

**build 만들기:** (a) production용 build만 만들거나, (b) production용 build와 테스트용 별도 build를 만듭니다.

**변경 사항 테스트하기:** (a) TestFlight와 Play Store Internal Track에서 테스트하고/또는 (b) internal distribution build로 테스트합니다.

**update 게시하기:** (b) "ios-staging", "ios-production", "android-staging", "android-production"처럼 환경과 플랫폼 기반 update branch를 만듭니다.

### 흐름 다이어그램

### 흐름 설명

1.  로컬에서 프로젝트를 개발하고 Expo Go에서 변경 사항을 테스트합니다.
2.  "ios-staging", "ios-production", "android-staging", "android-production" 같은 이름의 channel로 build를 만듭니다. 그런 다음 "ios-staging" build를 TestFlight에 올리고 "ios-production" build를 공개 App Store에 제출합니다. 마찬가지로 "android-staging" build는 Play Store Internal Track에 올리고, "android-production" build는 공개 Play Store에 제출합니다.
3.  branch에 commit을 merge할 때 필요한 플랫폼에 update를 게시하도록 `expo-github-action`을 설정합니다.
4.  그런 다음 iOS 앱 변경 사항은 "ios-staging" branch에 merge하고, 준비가 되면 "ios-production" branch에 merge합니다. 마찬가지로 Android 앱 변경 사항은 "android-staging" branch에 merge하고, 준비가 되면 "android-production" branch에 merge합니다.

#### 이 흐름의 장점

-   이 흐름은 Android와 iOS build에 어떤 update가 가는지 완전히 제어할 수 있게 해 줍니다. update가 두 플랫폼에 동시에 적용되는 일은 없습니다.

#### 이 흐름의 단점

-   두 플랫폼 모두의 변경 사항을 수정하려면 명령 한 번이 아니라 두 번 실행해야 합니다.

## Branch promotion flow

이 흐름은 버전이 있는 릴리스를 관리하는 흐름의 예시입니다.

> 이 흐름은 관리할 항목이 조금 더 많고 자동 [runtime version policy](/eas-update/runtime-versions#setting-runtimeversion)(`"sdkVersion"`, `"appVersion"`, `"nativeVersion"`, `"fingerprint"`)를 지원하지 않습니다. 이 흐름에서는 runtime version을 [수동으로 지정](/eas-update/runtime-versions#custom-runtimeversion)해야 합니다.

이 흐름은 위 배포 프로세스 요소 중 다음으로 구성됩니다:

**build 만들기:** (b) production용 build(메이저 버전마다 하나)와 테스트용 별도 build를 만듭니다.

**변경 사항 테스트하기:** (a) TestFlight와 Play Store Internal Track에서 테스트하고/또는 (b) internal distribution build로 테스트합니다.

**update 게시하기:** (c) "version-1.0"처럼 버전 기반 update branch를 만듭니다. branch는 channel에 동적으로 매핑되어 잘 테스트된 변경 사항을 테스트에서 production으로 promote합니다.

### 흐름 다이어그램

### 흐름 설명

1.  로컬에서 프로젝트를 개발하고 Expo Go 또는 [development build](/develop/development-builds/introduction)에서 변경 사항을 테스트합니다.
2.  "production-rtv-1"(runtime version "1"을 가진 channel을 의미)이라는 channel 이름으로 build를 만들고, 이는 나중에 심사를 거쳐 app store에서 사용할 수 있게 됩니다. 또 다른 build 세트는 "staging"이라는 channel 이름으로 만들고, 이를 TestFlight와 Play Store Internal Track에서 테스트하는 데 사용합니다.
3.  branch에 commit을 merge할 때 update를 게시하도록 `expo-github-action`을 설정합니다.
4.  변경 사항을 "version-1"이라는 branch에 merge합니다.
5.  웹사이트나 EAS CLI를 사용해 "staging" channel이 EAS Update branch "version-1"을 가리키도록 합니다. TestFlight와 Play Store Internal Track에서 앱을 열어 update를 테스트합니다.
6.  준비가 되면 웹사이트나 EAS CLI를 사용해 "production-rtv-1" channel이 EAS Update branch "version-1"을 가리키도록 합니다.
7.  이후에는 다음 두 가지 update 시나리오가 있을 수 있습니다:
    -   새 릴리스에 새 runtime version이 필요하지 않은 경우:
        1.  "version-2"라는 또 다른 GitHub branch를 만듭니다.
        2.  웹사이트나 EAS CLI를 사용해 "staging" channel이 EAS Update branch "version-2"를 가리키도록 합니다.
        3.  새 기능과 수정 사항이 준비되고 안정화될 때까지 "version-2" branch에 commit을 merge합니다.
        4.  웹사이트나 EAS CLI를 사용해 "production-rtv-1" channel이 EAS Update branch "version-2"를 가리키도록 합니다. 그러면 production build를 가진 모든 사용자(app store에서 앱을 다운로드한 사용자)는 이제 "version-2" branch의 최신 update를 받게 됩니다.
    -   새 릴리스에 새 runtime version이 필요한 경우(예: 새 네이티브 라이브러리 추가 또는 SDK 버전 업그레이드 시):
        1.  runtime version을 "1"에서 "2"로 올립니다.
        2.  새 runtime version으로 새로운 "staging" build를 만듭니다.
        3.  "version-2"라는 또 다른 GitHub branch를 만듭니다.
        4.  웹사이트나 EAS CLI를 사용해 "staging" channel이 EAS Update branch "version-2"를 가리키도록 합니다.
        5.  새 기능과 수정 사항이 준비되고 안정화될 때까지 "version-2" branch에 commit을 merge합니다.
        6.  "production-rtv-2"라는 channel 이름으로 새 build를 만듭니다. 이는 나중에 심사를 거쳐 app store에서 사용할 수 있게 됩니다.
        7.  웹사이트나 EAS CLI를 사용해 "production-rtv-2" channel이 EAS Update branch "version-2"를 가리키도록 합니다. 그러면 이전 production build를 가지고 있던 사용자(app store에서 앱을 다운로드한 사용자)는 app store에서 새 앱 버전을 다운로드할 때까지 EAS Update branch "version-1"의 최신 update를 계속 받게 되고, 새 앱 버전을 다운로드한 시점부터 "version-2" branch의 최신 update를 받게 됩니다.

#### 이 흐름의 장점

-   이 흐름은 다른 흐름보다 안전합니다. 모든 update가 내부 테스터에게 배포되는 테스트 build에서 먼저 검증되고, branch가 channel 사이를 이동하기 때문에 실제로 테스트한 artifact가 그대로 production build에 배포됩니다.
-   이 흐름은 GitHub branch와 EAS Update branch 사이의 직접적인 매핑을 만들어 줍니다. 또한 GitHub commit과 EAS Update update 사이의 매핑도 만들어 줍니다. GitHub branch를 추적하고 있다면 각 GitHub branch에 대응하는 EAS Update branch를 만들고, 그 branch를 build의 channel에 연결할 수 있습니다. 실제로는 GitHub에 push한 뒤 Expo에서 같은 branch 이름을 선택해 build와 연결할 수 있게 됩니다.
-   배포의 이전 버전이 항상 GitHub에 보존됩니다. "version-1.0" branch가 배포된 뒤 이후 "version-1.1" 같은 다른 버전이 배포되더라도 "version-1.0" branch는 계속 보존되므로 이전 버전의 프로젝트를 쉽게 checkout할 수 있습니다.

#### 이 흐름의 단점

-   이전 production 릴리스의 이력 update를 유지하려면 production runtime version마다 하나의 channel이 필요합니다. 이 때문에 runtime version policy를 사용하는 것이 더 어려워집니다.
-   이 흐름에서는 branch 이름을 관리해야 하므로, 현재 어떤 branch가 테스트 build와 production build를 가리키고 있는지 팀과 지속적으로 소통해야 합니다.
