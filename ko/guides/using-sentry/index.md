---
modificationDate: December 20, 2025
title: Sentry 사용하기
description: 크래시 리포팅을 위해 Sentry를 설치하고 구성하는 방법을 안내하는 가이드입니다.
platforms: ['android', 'ios', 'web']
---

# Sentry 사용하기

크래시 리포팅을 위해 Sentry를 설치하고 구성하는 방법을 안내하는 가이드입니다.
Android, iOS, Web

[Sentry](http://getsentry.com/)는 **크래시를 재현하고 수정하는 데 필요한 정보와 함께 프로덕션 배포를 실시간으로 파악할 수 있게 해주는** 크래시 리포팅 플랫폼입니다.

사용자가 앱을 사용하는 동안 마주치는 예외나 오류를 알려 주고, 이를 웹 대시보드에서 정리해 보여줍니다. 보고되는 예외에는 stacktrace, 디바이스 정보, 버전, 그 밖의 관련 컨텍스트가 자동으로 포함됩니다. 현재 route나 user id처럼 애플리케이션에 특화된 추가 컨텍스트를 직접 제공할 수도 있습니다.

## 무엇을 배우게 되나요

이 가이드는 Expo 프로젝트에 Sentry를 통합할 때의 세 가지 주요 측면을 다룹니다:

-   React Native 앱에서 [Sentry 설치 및 구성](/guides/using-sentry#install-and-configure-sentry)
    
-   EAS와 함께 Sentry 사용:
    
    -   앱을 빌드하기 위한 [EAS Build](/guides/using-sentry#usage-with-eas-build)
    -   OTA 업데이트를 위한 [EAS Update](/guides/using-sentry#usage-with-eas-update)
-   EAS 대시보드에서 크래시 리포트와 세션 리플레이를 직접 보기 위한 [Sentry-Expo 통합 설정](/guides/using-sentry#sentry-integration-with-eas-dashboard)
    

## Sentry 설치 및 구성

### Sentry 계정을 만들고 프로젝트 생성하기

Sentry 설치를 진행하기 전에, Sentry 계정과 프로젝트가 생성되어 있는지 확인해야 합니다:

1.1

[Sentry에 가입](https://sentry.io/signup/)하고(무료 플랜은 월 최대 5,000 events를 지원합니다), Dashboard에서 프로젝트를 생성하세요. 나중에 필요하므로 **organization slug**, **project name**, **DSN**을 기록해 두세요:

-   **organization slug**는 **Organization settings** 탭에서 확인할 수 있습니다.
-   **project name**은 프로젝트의 **Settings** > **Projects** 탭에서 확인할 수 있습니다(목록에서 찾으세요).
-   **DSN**은 프로젝트의 **Settings** > **Projects** > **Project name** > **SDK Setup** 섹션 아래의 **Client Keys (DSN)** 탭에서 확인할 수 있습니다.

1.2

[Developer Settings > Auth Tokens](https://sentry.io/settings/auth-tokens/) 페이지로 이동해 새 [Organization Auth Token](https://docs.sentry.io/account/auth-tokens/#organization-auth-tokens)을 생성하세요. 이 토큰은 Source Map Upload와 Release Creation 권한 범위가 자동으로 설정됩니다. 저장해 두세요.

이제 **organization slug**, **project name**, **DSN**, **auth token**을 모두 갖추었으므로 다음 단계로 진행할 준비가 되었습니다.

### Sentry wizard로 프로젝트 설정하기

Expo 프로젝트에서 Sentry를 설정하는 가장 쉬운 방법은 Sentry wizard를 사용하는 것입니다. 이 도구는 올바른 설정으로 프로젝트를 자동 구성해 줍니다.

프로젝트 디렉터리에서 다음 명령어를 실행하세요:

```sh
npx @sentry/wizard@latest -i reactNative
```

wizard는 다음 작업을 수행합니다:

-   필요한 의존성 설치
-   프로젝트가 Sentry를 사용하도록 구성
-   Metro 구성을 자동으로 설정
-   앱에 필요한 initialization 코드 추가

wizard의 안내에 따라 설정을 완료하세요. wizard가 Sentry 계정 로그인과 프로젝트 관련 올바른 정보 가져오기를 단계별로 안내합니다.

### 구성 확인하기

앱의 새 release build를 생성하고 source map이 올바르게 업로드되는지 확인하세요. 동작 여부와 sourcemap 연결 상태를 검증하기 위해 앱에 테스트용 버튼을 추가하고 싶을 수 있습니다. 예를 들면 다음과 같습니다:

```jsx
import { Button } from 'react-native';

// Inside some component
<Button title="Press me" onPress={() => { throw new Error('Hello, again, Sentry!'); }}/>
```

## EAS Build와 함께 사용하기

빌드 환경에 `SENTRY_AUTH_TOKEN`이 설정되어 있는지 확인하면, Sentry가 source map을 자동으로 업로드합니다. 앱 config에서 속성 대신 환경 변수를 사용한다면, 해당 변수들도 함께 설정되어 있어야 합니다.

위 안내를 따른 경우, EAS Build를 사용할 때 Sentry를 프로젝트에 통합하기 위해 추가로 해야 할 작업은 없습니다.

## EAS Update와 함께 사용하기

`eas update` 실행 후 source map을 Sentry에 업로드하세요:

```sh
npx sentry-expo-upload-sourcemaps dist
```

이것으로 끝입니다. 이제 업데이트에서 발생한 오류가 Sentry에서 올바르게 symbolicate됩니다.

업데이트와 sourcemap 업로드를 한 번의 명령어로 게시하고 싶나요?

`&&`로 명령어를 연결하면 업데이트 게시와 sourcemap 업로드를 한 단계로 처리할 수 있습니다:

```sh
eas update --branch  && npx sentry-expo-upload-sourcemaps dist
```

오류 리포트에 업데이트 관련 추가 메타데이터를 덧붙이고 싶나요?

업데이트 정보로 scope에 tag를 설정하도록 Sentry를 구성하면, Sentry 대시보드에서 특정 업데이트에서 발생한 오류를 확인할 수 있습니다.

다음 스니펫을 애플리케이션 생명주기에서 가능한 한 이른 시점의 전역 scope에 추가하세요.

```js
import * as Sentry from '@sentry/react-native';
import * as Updates from 'expo-updates';

const manifest = Updates.manifest;
const metadata = 'metadata' in manifest ? manifest.metadata : undefined;
const extra = 'extra' in manifest ? manifest.extra : undefined;
const updateGroup = metadata && 'updateGroup' in metadata ? metadata.updateGroup : undefined;

Sentry.init({
  // dsn, release, dist, etc...
});

const scope = Sentry.getGlobalScope();

scope.setTag('expo-update-id', Updates.updateId);
scope.setTag('expo-is-embedded-update', Updates.isEmbeddedLaunch);

if (typeof updateGroup === 'string') {
  scope.setTag('expo-update-group-id', updateGroup);

  const owner = extra?.expoClient?.owner ?? '[account]';
  const slug = extra?.expoClient?.slug ?? '[project]';
  scope.setTag(
    'expo-update-debug-url',
    `https://expo.dev/accounts/${owner}/projects/${slug}/updates/${updateGroup}`
  );
} else if (Updates.isEmbeddedLaunch) {
  // This will be `true` if the update is the one embedded in the build, and not one downloaded from the updates server.
  scope.setTag('expo-update-debug-url', 'not applicable for embedded updates');
}
```

구성이 완료되면 연결된 업데이트 정보가 오류의 tag 섹션에 표시됩니다:

## EAS 대시보드와의 Sentry 통합

Expo와의 Sentry 통합을 사용하면 Expo 앱 배포의 크래시 리포트와 Session Replays를 EAS 대시보드 안에서 직접 볼 수 있습니다. 이 통합은 전체 컨텍스트, session replays, 디버깅 기능이 포함된 Sentry stack trace로 바로 이동할 수 있게 해줍니다.

### 설치

> 이 통합을 설치하려면 Sentry owner, manager, 또는 admin 권한이 필요합니다.

1.  Expo 계정에 로그인하고 [**Account settings > Overview**](https://expo.dev/accounts/%5Byour-account%5D/settings)를 엽니다.
2.  **Connections** 아래에서 Sentry 옆의 **Connect**를 클릭합니다.
3.  Sentry 계정에 로그인하고 organization에 통합을 허용합니다. 그러면 **Account settings**로 다시 이동합니다.

### 프로젝트 연결하기

계정을 연결한 후에는 EAS Project를 Sentry Project와 연결해야 합니다:

1.  EAS에서 **Projects > [Your Project] > Configuration > Project settings**를 엽니다.
2.  **Link**를 클릭하고 드롭다운에서 Sentry Project를 선택합니다.

### 사용 방법

EAS 대시보드에서 Sentry 데이터를 보려면 **Projects > [Your Project] > Updates > Deployments > [Deployment]**를 열어 Release의 Sentry 데이터를 확인하세요.

이 통합으로 다음이 가능합니다:

-   EAS 대시보드에서 직접 크래시 리포트 보기
-   오류가 발생하기 전에 정확히 어떤 일이 있었는지 확인할 수 있도록 Session Replays에 접근
-   전체 컨텍스트가 포함된 자세한 stack trace 확인
-   디버깅을 위해 EAS와 Sentry 사이를 자연스럽게 이동

## Sentry 더 알아보기

Sentry는 단순히 치명적인 오류를 잡는 것 이상을 제공합니다. Sentry 활용 방법에 대해 더 알아보려면 Sentry의 [JavaScript usage](https://docs.sentry.io/platforms/javascript/) 문서를 참고하세요.
