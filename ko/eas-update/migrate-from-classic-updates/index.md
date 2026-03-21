---
modificationDate: May 21, 2025
title: Classic Updates에서 마이그레이션하기
description: Classic Updates에서 EAS Update로 마이그레이션하는 데 도움이 되는 가이드입니다.
---

# Classic Updates에서 마이그레이션하기

Classic Updates에서 EAS Update로 마이그레이션하는 데 도움이 되는 가이드입니다.

> SDK 49는 Classic Updates를 지원한 마지막 version입니다. deprecated된 `expo publish` 명령을 계속 사용하려면 app config에서 [`updates.useClassicUpdates`](/versions/latest/config/app#useclassicupdates)를 설정하세요.

EAS Update는 Expo updates service의 차세대 버전입니다. Classic Updates를 사용 중이라면, 이 가이드가 EAS Update로 업그레이드하는 데 도움을 줄 것입니다.

## 사전 준비

EAS Update를 사용하려면 다음 version 이상이 필요합니다:

-   Expo SDK >= 45.0.0
-   Expo CLI >= 5.3.0
-   EAS CLI >= 0.50.0
-   expo-updates >= 0.13.0

## EAS CLI 설치하기

EAS CLI를 설치하세요:

```sh
npm install --global eas-cli
```

그런 다음 expo account로 로그인하세요:

```sh
eas login
```

## 프로젝트 구성하기

프로젝트에 다음 변경을 적용해야 합니다:

EAS Update로 프로젝트를 초기화하세요:

```sh
eas update:configure
```

이 명령을 실행한 뒤에는 app config에 `expo.updates.url`과 `expo.runtimeVersion`이라는 두 새 필드가 있어야 합니다.

build 내부의 native code와 update가 호환되도록 보장하기 위해, EAS Update는 프로젝트 app config의 `sdkVersion` 필드를 대체하는 `runtimeVersion`이라는 새 필드를 사용합니다. app config에서 `expo.sdkVersion` 속성을 제거하세요.

EAS로 만든 build에 update가 적용되도록 하려면 **eas.json**의 EAS Build profile에 `channel` 속성을 포함하도록 업데이트해야 합니다. 이 channel은 `releaseChannel` 속성을 대체합니다. 보통 `channel` 이름을 profile 이름과 같게 두는 것이 편리합니다. 예를 들어 `preview` profile에는 `"preview"`라는 `channel`을 두고, `production` profile에는 `"production"`이라는 `channel`을 둘 수 있습니다.

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview"
    },
    "production": {
      "channel": "production"
    }
  }
}
```

**선택 사항**: 프로젝트가 bare React Native 프로젝트라면, 추가 구성이 필요할 수 있으므로 [기존 프로젝트에서 EAS Update 사용하기](/eas-update/getting-started)를 참고하세요.

## 새 build 만들기

위 변경 사항은 build 내부의 native code layer에 영향을 주므로, update를 보내기 시작하려면 새 build를 만들어야 합니다. build가 완료되면 update를 게시할 준비가 됩니다.

## update 게시하기

프로젝트를 로컬에서 변경한 뒤에는 update를 게시할 준비가 된 것입니다. 다음을 실행하세요:

```sh
eas update --channel [channel-name] --message [message]
eas update --channel production --message "Fixes typo"
```

게시가 끝나면 [EAS dashboard](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/updates)에서 update를 확인할 수 있습니다.

## 추가 마이그레이션 단계

-   스크립트에서 `expo publish` 사용 부분을 `eas update`로 바꾸세요. 게시 옵션 전체는 `eas update --help`로 확인할 수 있습니다.
-   `expo-updates` 라이브러리의 `Updates.releaseChannel`을 참조하는 코드가 있다면 `Updates.channel`로 바꾸세요.
-   `Constants.manifest`를 참조하는 코드는 모두 제거하세요. 이제 이 값은 항상 `null`을 반환합니다. 필요한 대부분의 속성은 `expo-constants` 라이브러리의 `Constants.expoConfig`에서 접근할 수 있습니다.

## 더 알아보기

위 단계들을 따르면 Classic Updates와 비슷한 흐름으로 사용할 수 있습니다. 하지만 EAS Update는 더 유연하고 기능도 더 많습니다. 더 안정적인 release 흐름을 만드는 데 사용할 수 있습니다. [EAS Update가 작동하는 방식](/eas-update/how-it-works)과 프로젝트 및 팀에 맞는 더 안정적인 [배포 프로세스](/eas-update/deployment-patterns)를 만드는 방법을 알아보세요.

마이그레이션 중 문제가 발생하면 [디버깅 가이드](/eas-update/debug)를 확인하세요. 피드백이 있다면 [Discord](https://chat.expo.dev/)의 #update 채널에 참여해 주세요.
