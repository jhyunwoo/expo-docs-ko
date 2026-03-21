---
modificationDate: February 26, 2026
title: LogRocket 사용하기
description: session replay와 error monitoring을 위해 LogRocket을 설치하고 설정하는 가이드입니다.
---

# LogRocket 사용하기

session replay와 error monitoring을 위해 LogRocket을 설치하고 설정하는 가이드입니다.

[LogRocket](https://logrocket.com)는 사용자가 앱을 사용하는 동안 사용자 세션을 기록하고 버그를 식별합니다. 업데이트 ID로 세션을 필터링할 수도 있고, EAS dashboard에서 LogRocket 계정에 연결해 앱의 세션 데이터에 빠르게 접근할 수도 있습니다.

## LogRocket 설치 및 설정

다음 명령으로 LogRocket SDK를 설치할 수 있습니다:

```sh
npx expo install @logrocket/react-native expo-build-properties
```

그런 다음 [app config](/workflow/configuration)에 LogRocket config plugin을 포함하세요:

```json
{
  "plugins": [
    [
      "expo-build-properties",
      {
        "android": {
          "minSdkVersion": 25
        }
      }
    ],
    "@logrocket/react-native"
  ]
}
```

마지막으로 **src/app/_layout.tsx** 같은 최상위 파일에서 앱 안에 LogRocket을 초기화하세요:

```tsx
import { useEffect } from 'react';
import * as Updates from 'expo-updates';
import LogRocket from '@logrocket/react-native';

const App = () => {
  useEffect(() => {
    LogRocket.init('<App ID>', {
      updateId: Updates.isEmbeddedLaunch ? null : Updates.updateId,
      expoChannel: Updates.channel,
    });
  }, []);
};
```

위 코드에서 `<App ID>`를 [LogRocket App ID](https://app.logrocket.com/r/settings/setup)로 바꾸세요.

## EAS dashboard에서 LogRocket 연결하기

Expo dashboard에서 LogRocket 계정과 프로젝트를 Expo 계정 및 프로젝트에 연결할 수 있습니다. 그러면 deployments 및 updates dashboard에서 앱의 최근 몇 개 세션을 볼 수 있습니다.

**Account settings** > [**Overview**](https://expo.dev/accounts/%5Baccount%5D/settings) > **Connections**로 이동한 뒤 **Connect**를 클릭해 LogRocket으로 인증하세요:

그런 다음 프로젝트로 이동해 **Project settings** > [**General**](https://expo.dev/accounts/%5Baccount%5D/projects/%5BprojectName%5D/settings) 아래에서 **Connect**를 클릭해 Expo 프로젝트와 LogRocket 프로젝트를 연결하세요:

그 후 EAS dashboard의 Native Deployments 및 Updates dashboard에서 **View on LogRocket** 버튼과 함께 앱의 최근 몇 개 세션이 보이기 시작합니다.

## LogRocket에 대해 더 알아보기

Expo와 함께 LogRocket을 사용하는 방법을 더 알아보려면 [LogRocket documentation](https://docs.logrocket.com/reference/react-native-expo-adding-the-sdk)을 확인하세요.
