---
modificationDate: October 30, 2025
title: npx testflight 명령
description: iOS 앱을 TestFlight에 빌드, 서명, 제출할 수 있게 해 주는 단일 명령입니다.
---

# npx testflight 명령

iOS 앱을 TestFlight에 빌드, 서명, 제출할 수 있게 해 주는 단일 명령입니다.

[`npx testflight`](https://www.npmjs.com/package/testflight)는 iOS 앱을 빌드하고, 서명하고, TestFlight에 제출하는 과정을 단계별로 안내해 주는 CLI 도구입니다.

## 사전 준비

-   TestFlight에 배포하려는 React Native iOS 프로젝트
-   유료 [Apple Developer Account](https://developer.apple.com/account/)
-   [Expo](https://expo.dev/signup) 계정

## `npx testflight` 명령 실행하기

프로젝트 루트 디렉터리 안에서 다음 명령을 실행하세요:

```sh
npx testflight
```

이 명령의 워크플로는 인터랙티브하며, 최신 EAS CLI 버전을 사용해 다음 프롬프트를 안내합니다:

-   **연결된 EAS 프로젝트를 초기화하거나 감지합니다.** 새 프로젝트에서 이 명령을 실행하면 CLI는 앱 config 파일의 slug를 사용해 새 EAS 프로젝트를 생성합니다. 프로젝트가 이미 EAS에 생성되어 있음을 CLI가 감지하면 같은 slug를 계속 사용합니다.
-   **bundle identifier를 확인합니다.** 새 프로젝트에서 이 명령을 실행하면 새 identifier를 입력할 수 있고, 이후 실행에서는 CLI가 감지한 값을 받아들일 수 있습니다. wizard는 앱이 표준 암호화를 사용하는지, 예외 암호화를 사용하는지도 묻습니다. 이후 이 명령을 다시 실행할 때는 [`buildNumber`](/tutorial/eas/manage-app-versions#understanding-developer-facing-and-user-facing-app-versions)가 자동으로 증가합니다.
-   **Apple Developer에 로그인합니다.** Apple ID를 입력하고, 2단계 인증을 완료한 다음, CLI가 새 배포 인증서나 기존 배포 인증서 또는 provisioning profile을 생성하거나 재사용하도록 허용합니다.
-   **자격 증명을 생성합니다.** 해당 bundle identifier에 대한 자격 증명을 EAS가 아직 관리하지 않는다면, CLI가 배포 인증서와 provisioning profile을 생성하거나 업데이트합니다.
-   **프로덕션 빌드를 생성합니다.** 기본 EAS [`production` profile](/build/eas-json#production-builds)을 사용해 iOS 아카이브(**.ipa**) 파일을 만들기 위한 iOS 빌드를 시작합니다.
-   **App Store Connect 접근 권한을 확인합니다.** submit 단계는 [App Store Connect API key](https://expo.fyi/creating-asc-api-key)를 확인하고 필요하면 생성합니다.
-   **앱을 TestFlight에 제출합니다.** 생성된 **.ipa** 파일을 App Store Connect에 업로드하고, 팀의 내부 테스트 그룹에 대해 TestFlight 배포를 활성화합니다.

프로세스 전반에 걸쳐 터미널 창 안에서 빌드 및 제출 상태 업데이트를 받게 됩니다. App Store Connect 대시보드에서는 테스터와 배포를 관리할 수 있습니다.

> **참고:** 모든 프롬프트는 EAS Build와 EAS Submit 흐름을 그대로 반영하므로, `eas build` 또는 `eas submit`을 각각 실행할 때와 같은 방식으로 답하면 됩니다. 즉, 빌드와 제출 과정 중 EAS 대시보드 링크가 생성되며 이를 사용해 진행 상황을 볼 수 있습니다. 제출이 성공적으로 완료되면 App Store Connect 링크도 제공되며, 이를 통해 TestFlight 제출 결과를 확인할 수 있습니다.

## `npx testflight`를 사용하는 이유

-   빌드와 제출 단계를 따로 실행하지 않아도 되어 개발 시간을 절약할 수 있습니다.
-   EAS CLI의 가이드형 프롬프트를 통해 Apple 자격 증명, provisioning profile, App Store Connect API key를 처리합니다.
-   별도의 명령을 따로 실행하지 않고 새 빌드를 만들고 TestFlight에 제출합니다.
-   전역 패키지 설치가 번거로운 공유 머신이나 CI runner에서도 잘 동작합니다.

## `npx testflight`를 사용해야 하는 경우

-   로컬 머신에서 TestFlight 빌드를 빠르게 배포하고 싶을 때
-   완전한 CI 워크플로를 구성하지 않고 TestFlight로 하나 이상의 빌드를 트리거하고 싶을 때
-   내부 테스트 그룹이 있고 앱의 최신 변경 사항을 가능한 빨리 배포하고 싶을 때
-   EAS가 인증서, provisioning profile, API key를 자동으로 처리하게 하고 싶을 때

## 자주 묻는 질문

`npx testflight` 명령을 non-interactive 모드로 실행할 수 있나요?

네. **eas.json**의 `submit.production` profile에 `ascAppId`를 제공하면 `npx testflight` 명령은 앱이 App Store Connect에 존재하는지 확인하는 과정을 건너뜁니다.

```json
{
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "your-app-store-connect-app-id"
      }
    }
  }
}
```

`ascAppId`를 찾는 방법을 더 알아보려면 [Apple App Store에 제출하기의 이 단계](/submit/ios#how-to-find-ascappid)를 참고하세요.
