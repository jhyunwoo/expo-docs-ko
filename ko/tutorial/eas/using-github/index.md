---
modificationDate: March 09, 2026
title: GitHub 저장소에서 build 트리거하기
description: GitHub 저장소에서 build를 트리거하는 과정을 알아봅니다.
---

# GitHub 저장소에서 build 트리거하기

GitHub 저장소에서 build를 트리거하는 과정을 알아봅니다.

[Expo GitHub App](/build/building-from-github)은 EAS를 사용해 GitHub 프로젝트에서 build를 자동으로 트리거합니다. 개발 팀의 선호에 따라 어떤 build profile이든 트리거할 수 있습니다. 또한 저장소에 직접 push한 `git` commit이나 pull request를 기준으로도 build를 트리거할 수 있습니다.

이 장에서는 이 기능을 구성해 보겠습니다. 예제 앱에는 이를 시연하기 위한 GitHub 저장소가 이미 준비되어 있습니다.

[시청하기: GitHub 저장소에서 build를 트리거하는 방법](https://www.youtube.com/watch?v=fBLFEFC0ip0) — Expo GitHub App을 저장소에 연결하고, push 또는 pull request에서 EAS build를 트리거하도록 구성합니다.

## Expo GitHub app 구성하기

이 기능을 사용하려면 GitHub 계정을 연결해야 합니다:

-   EAS dashboard에서 [expo.dev/settings](https://expo.dev/settings#connections)로 이동한 뒤, **Connections** > **GitHub** 아래에서 **Connect**를 클릭합니다. 그러면 **Connect GitHub** accounts 페이지가 열립니다.
-   **Get started** 버튼을 클릭하면 Expo GitHub app 권한 부여 popup이 열립니다. **Install and Authorize**를 클릭하세요.
-   앱이 GitHub 계정에 설치되면 Expo 계정과 연결해야 합니다. 다음 popup에서 **Link installation**을 클릭하세요.
-   계정이 연결되면 **GitHub** 아래에 표시됩니다.

## GitHub 저장소 연결하기

GitHub 저장소에서 build 트리거를 활성화하려면 EAS dashboard에서 해당 저장소를 프로젝트에 연결해야 합니다:

-   EAS dashboard에서 **Projects** > 프로젝트 선택 > **Project settings** > **GitHub**로 이동합니다.
-   **Connect a GitHub repository** 아래에서 GitHub 저장소 목록을 볼 수 있습니다. 여기서 올바른 저장소를 연결해야 합니다. 예시에서는 **sticker-smash** 저장소를 찾고 있습니다.
-   프로젝트 저장소에서 **Connect**를 클릭합니다.

## 기본 저장소 설정 사용하기

Expo GitHub app은 프로젝트의 source code가 어디에 있는지 알아야 합니다. 기본적으로 루트 디렉터리 `/`를 선택합니다. 예제 프로젝트에서는 source code도 저장소 루트에 있으므로 EAS dashboard에서 기본 설정을 그대로 사용하면 됩니다.

## GitHub PR label을 사용해 build 트리거하기

Expo GitHub app은 [여러 옵션](/build/building-from-github#trigger-a-build-from-github)을 제공하여 build를 트리거할 수 있게 해줍니다. 예를 들면 다음과 같습니다:

-   특정 플랫폼에 대해 Builds 페이지에서 수동으로 트리거
-   새 코드가 저장소에 push될 때 자동으로 트리거
-   GitHub PR label을 사용해 자동으로 트리거

GitHub PR label을 사용해 build를 자동으로 트리거하려면, 위 목록의 세 번째 옵션을 사용하겠습니다:

-   사용할 build image를 지정해야 합니다. **eas.json**을 열고 `development` profile 아래에 [`android.image`](/eas/json#image)와 [`ios.image`](/eas/json#image-1) 속성을 추가한 뒤 값을 [`latest`](/build-reference/infrastructure#configuring-build-environment)로 설정합니다.
    
    ```json
    {
      "build": {
        "development": {
          ... 
          "android": {
            "image": "latest"
          },
          "ios": {
            "image": "latest"
          }
        }
      }
      ... 
    }
    ```
    
-   다음으로 `dev`라는 새 branch를 만들고, 앱의 JavaScript 코드에 변경 사항을 추가합니다. 그런 다음 변경 사항을 commit하고 branch를 push한 뒤, 해당 branch에서 PR을 만듭니다.
    
-   PR 링크의 **Labels** 아래에서 `eas-build-all:development`라는 label을 만듭니다.
    

-   **Create pull request** 버튼을 클릭해 PR을 생성합니다. Expo GitHub app이 development build 생성 과정을 시작합니다.
    
-   EAS dashboard의 **Builds** 페이지에서 Android와 iOS build가 모두 트리거되었는지 확인할 수 있습니다.
    

-   개별 build의 세부 사항을 확인하면 **Created by** 아래에서 이 build가 GitHub app에 의해 생성되었음을 볼 수 있습니다.

## 요약

11장: GitHub 저장소에서 build 트리거하기

Expo와 GitHub 계정을 성공적으로 연결했고, 저장소를 EAS 프로젝트에 연결했으며, GitHub PR label을 사용해 development build를 자동으로 생성하는 방법도 배웠습니다.

EAS를 사용하기 위한 다음 단계를 알아보세요.

[다음: EAS 여정의 다음 단계](/tutorial/eas/next-steps)
