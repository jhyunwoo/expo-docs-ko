---
modificationDate: February 18, 2025
title: EAS Update가 작동하는 방식
description: EAS Update가 어떻게 작동하는지에 대한 개념적 개요입니다.
---

# EAS Update가 작동하는 방식

EAS Update가 어떻게 작동하는지에 대한 개념적 개요입니다.

EAS Update는 다음 app store release를 준비하는 동안 사용자에게 작은 버그 수정과 update를 즉시 전달할 수 있게 해 주는 서비스입니다. update를 build에서 사용할 수 있게 하려면 build와 update 사이의 연결을 만들어야 합니다.

build와 update 사이에 연결을 만들려면, 먼저 해당 update가 그 build에서 실행될 수 있는지 확인해야 합니다. 또한 준비가 되었을 때 특정 build에 특정 update를 노출할 수 있도록 배포 프로세스를 구성할 수 있어야 합니다.

build와 update가 어떻게 상호작용하는지 설명하기 위해, 다음 다이어그램을 살펴보세요:

build는 두 개의 layer로 생각할 수 있습니다. 앱 binary에 포함된 native layer와, 다른 호환 update로 교체 가능한 update layer입니다. 이런 분리를 통해 bug fix가 들어 있는 update가 build 내부의 native layer에서 실행될 수 있기만 하면 build에 bug fix를 전달할 수 있습니다.

update가 build에서 실행될 수 있도록 하려면, build가 update를 실행할 수 있다는 것을 확신할 수 있게 해 주는 다양한 속성을 설정해야 합니다. 이 과정은 프로젝트의 build를 만드는 시점부터 시작됩니다.

## 개념적 개요

### build 배포하기

Expo 프로젝트의 build를 만들 준비가 되면 `eas build`를 실행해 build를 만들 수 있습니다. build 중에는 update에 중요한 몇 가지 속성이 build 안에 포함됩니다. 그 속성은 다음과 같습니다:

-   **Channel:** channel은 여러 build를 쉽게 식별할 수 있도록 붙이는 이름입니다. `eas.json`에 정의됩니다. 예를 들어 Android와 iOS build 한 쌍에 "production"이라는 channel을 둘 수 있고, 다른 build 한 쌍에는 "staging"이라는 channel을 둘 수 있습니다. 그러면 "production" channel의 build는 공개 app store에 배포하고, "staging" build는 Play Store Internal Track과 TestFlight에 둘 수 있습니다. 이후 update를 게시할 때는 먼저 "staging" channel의 build에서 사용할 수 있게 하고, 변경 사항을 테스트한 뒤 "production" channel의 build에서 사용할 수 있게 만들 수 있습니다.
-   **Runtime version:** runtime version은 앱의 update layer를 실행하는 native code layer가 정의하는 JS-native interface를 설명합니다. 프로젝트의 [app config](/workflow/configuration)에 정의됩니다. 앱의 JS-native interface를 바꾸는 native code 변경이 생길 때마다 runtime version도 업데이트해야 합니다. [자세히 알아보세요.](/eas-update/runtime-versions)
-   **Platform:** 모든 build에는 "Android" 또는 "iOS" 같은 platform이 있습니다.

"staging"과 "production"이라는 channel 이름을 가진 두 세트의 build를 만들었다면, build를 네 곳에 배포할 수 있습니다:

이 다이어그램은 build를 만들고 channel에 이름을 붙이는 방법, 그리고 그 build를 어디에 둘 수 있는지를 보여 주는 하나의 예시일 뿐입니다. 결국 어떤 channel 이름을 쓰고 그 build를 어디에 둘지는 여러분에게 달려 있습니다.

### update 게시하기

build를 만든 뒤에는 update를 게시해 프로젝트의 update layer를 바꿀 수 있습니다. 예를 들어 **App.js** 안의 텍스트를 일부 수정한 뒤, 그 변경을 update로 게시할 수 있습니다.

update를 게시하려면 `eas update --auto`를 실행하면 됩니다. 이 명령은 프로젝트의 **dist** 디렉터리 안에 로컬 update bundle을 만듭니다. update bundle이 만들어지면, 그 bundle을 EAS 서버의 _branch_라는 데이터베이스 객체에 업로드합니다. branch에는 이름이 있고 update 목록이 들어 있으며, 가장 최근 update가 해당 branch의 활성 update입니다. EAS branch는 Git branch와 비슷하게 생각할 수 있습니다. Git branch에 commit 목록이 들어 있듯, EAS branch에는 update 목록이 들어 있습니다.

### update와 build 매칭하기

build와 마찬가지로, branch의 모든 update에도 target runtime version과 target platform이 들어 있습니다. 이 필드를 통해 _update policy_라는 규칙으로 update가 build에서 실행될 수 있는지 확인할 수 있습니다. EAS의 update policy는 다음과 같습니다:

-   build의 platform과 update의 target platform이 정확히 일치해야 합니다.
-   build의 runtime version과 update의 target runtime version이 정확히 일치해야 합니다.
-   channel은 어떤 branch와도 연결할 수 있습니다. 기본적으로 channel은 같은 이름의 branch에 연결됩니다.

마지막 항목에 집중해 보겠습니다. 모든 build에는 channel이 있고, 개발자는 그 channel을 어떤 branch에든 연결할 수 있습니다. 그러면 연결된 channel에서 그 branch의 가장 최신 호환 update를 사용할 수 있게 됩니다. 이 연결을 단순화하기 위해, 기본값으로 channel은 같은 이름의 branch에 자동 연결됩니다. 예를 들어 "production"이라는 channel로 build를 만들었다면, "production"이라는 branch에 update를 게시할 수 있고, 별도로 수동 연결을 하지 않아도 build는 "production" branch의 update를 받게 됩니다.

이 기본 연결 방식은 Git branch와 EAS branch를 여러 개 일관되게 운영하는 배포 프로세스에 매우 잘 맞습니다. 예를 들어 Git과 EAS에 모두 "production" branch와 "staging" branch를 둘 수 있습니다. [GitHub Action](/eas-update/github-actions)과 함께 사용하면 "staging" Git branch에 commit이 push될 때마다 "staging" EAS Update branch에 게시되도록 만들 수 있고, 그러면 "staging" channel을 가진 모든 build에 그 update가 적용됩니다. staging build에서 변경 사항을 테스트한 뒤에는 "staging" Git branch를 "production" Git branch로 merge하고, 이 과정에서 "production" EAS Update branch에 update가 게시됩니다. 마지막으로 "production" EAS Update branch의 최신 update가 "production" channel을 가진 build에 적용됩니다.

이 흐름을 사용하면 GitHub에 push한 뒤, 다른 개입 없이도 build가 업데이트되는 것을 볼 수 있습니다.

이 흐름은 많은 개발자에게 적합하지만, channel과 branch 사이의 연결을 바꿀 수 있기 때문에 다른 흐름도 구현할 수 있습니다. 예를 들어 branch 이름을 "version-1.0", "version-2.0", "version-3.0"처럼 붙인다고 생각해 봅시다. "version-1.0" EAS Update branch를 "production" channel에 연결해 "production" build에서 사용할 수 있게 만들 수 있습니다. 동시에 "version-2.0" EAS Update branch를 "staging" channel에 연결해 tester가 사용할 수 있게 할 수 있습니다. 마지막으로, 아직 어떤 build와도 연결되지 않은 "version-3.0" EAS Update branch를 만들어 development build로만 개발자가 테스트하게 할 수도 있습니다.

tester가 "version-2.0" EAS Update branch의 update가 production에 준비되었다고 확인하면, "production" channel을 업데이트해 "version-2.0" branch에 연결할 수 있습니다. 이렇게 하려면 다음 명령을 실행하면 됩니다:

```sh
eas channel:edit production --branch version-2.0
```

이 상태가 된 뒤에는 "version-3.0" EAS Update branch 테스트를 시작할 준비가 됩니다. 앞 단계와 비슷하게, 다음 명령으로 "staging" channel을 "version-3.0" EAS Update branch에 연결할 수 있습니다:

```sh
eas channel:edit staging --branch version-3.0
```

## 실용적인 개요

이제 EAS Update의 핵심 개념에 익숙해졌으니, 실제로 이 프로세스가 어떻게 일어나는지 이야기해 보겠습니다.

`expo-updates`가 포함된 Expo 프로젝트가 build되면, 포함된 native Android 및 iOS code가 update를 관리하고, 가져오고, 파싱하고, 검증하는 역할을 담당합니다.

라이브러리가 update를 확인하는 시점과 다운로드하는 방식은 [구성 가능](/versions/latest/config/app#updates)합니다. 기본적으로 라이브러리는 앱이 열릴 때 update를 확인합니다. 현재 실행 중인 update보다 새로운 update를 찾으면 더 새로운 update를 다운로드해 실행합니다. 더 새로운 update를 찾지 못하면, 다운로드된 update 중 가장 최신 것을 실행하고, 아직 아무것도 다운로드되지 않았다면 build 시점에 앱 안에 포함된 update로 fallback합니다.

`expo-updates`는 두 단계로 update를 다운로드합니다. 먼저 update 실행에 필요한 asset(image, JavaScript bundle, font 파일 등)의 목록을 포함한 update 정보가 담긴 가장 최신 _manifest_를 다운로드합니다. 그 다음에는 manifest에 지정된 asset 중 이전 update에서 아직 다운로드하지 않은 것들을 다운로드합니다. 예를 들어 update에 새 image가 포함되어 있다면, 라이브러리는 해당 새 image asset을 다운로드한 뒤 update를 실행합니다. 최종 사용자가 update를 빠르고 안정적으로 받을 수 있도록 하려면 update를 가능한 한 작게 유지해야 합니다.

라이브러리가 `fallbackToCacheTimeout` 설정 시간 안에 manifest(1단계)와 필요한 모든 asset(2단계)을 다운로드할 수 있다면, 새 update는 실행 즉시 바로 실행됩니다. `fallbackToCacheTimeout` 안에 manifest와 asset을 가져오지 못하면, 새 update 다운로드는 백그라운드에서 계속 진행되고 다음 실행 때 적용됩니다.

## 마무리

EAS Update를 사용하면 작지만 중요한 bug fix를 사용자에게 빠르게 전달하고, 사용자에게 가능한 한 좋은 경험을 제공할 수 있습니다. 이 모든 것은 build의 runtime version, platform, channel을 기반으로 구성됩니다. 이 세 가지 제약을 통해 특정 build 그룹에 특정 update를 제공할 수 있습니다. 그러면 production에 가기 전에 배포 프로세스 안에서 변경 사항을 테스트할 수 있습니다. 배포 프로세스를 어떻게 구성하느냐에 따라 속도를 최적화할 수도 있고, 배포를 최대한 안전하고 bug-free하게 만들 수도 있습니다. 배포 가능성은 매우 넓으며, 여러분이 선호하는 거의 모든 release 프로세스에 맞출 수 있습니다.
