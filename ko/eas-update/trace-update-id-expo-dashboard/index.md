---
modificationDate: February 26, 2026
title: update ID를 EAS dashboard로 역추적하는 방법
description: EAS Update와 expo-updates 라이브러리를 사용할 때 update ID를 EAS dashboard로 역추적하는 방법을 알아보세요.
---

# update ID를 EAS dashboard로 역추적하는 방법

EAS Update와 expo-updates 라이브러리를 사용할 때 update ID를 EAS dashboard로 역추적하는 방법을 알아보세요.

[EAS Updates](/eas-update/introduction)로 작업하다 보면 `updateId`를 [EAS dashboard](https://expo.dev/accounts/%5Baccount%5D)로 역추적해야 하는 상황을 만날 수 있습니다. 이 작업은 까다로울 수 있는데, [`Updates.isEmbeddedLaunch`](/versions/latest/sdk/updates#updatesisembeddedlaunch)가 `true`인지 `false`인지와 관계없이 `Updates.updateId`는 항상 ID를 반환하기 때문입니다. 하지만 앱이 embedded update를 실행 중일 때 [EAS dashboard](https://expo.dev/accounts/%5Baccount%5D)에서 해당 `updateId`를 조회하려고 하면 오류가 발생합니다. embedded update는 dashboard에서 추적되지 않기 때문입니다.

## update가 embedded인지 다운로드된 것인지 확인하기

이 문제를 피하려면 `Updates.isEmbeddedLaunch` 속성을 사용해 앱이 build에 포함된 embedded update를 실행 중인지, 아니면 서버에서 다운로드한 update를 실행 중인지 확인할 수 있습니다. `Updates.isEmbeddedLaunch`가 `true`라면 현재 실행 중인 update는 build에 포함된 것이므로 EAS dashboard에서 찾을 수 없습니다.

다음은 update가 embedded인지 다운로드된 것인지 표시하는 예시입니다:

```tsx
import * as Updates from 'expo-updates';
import { Text } from 'react-native';

export default function UpdateStatus() {
  return (
    <Text>
      {Updates.isEmbeddedLaunch
        ? '(Embedded) ❌ You cannot trace this update in the EAS dashboard.'
        : '(Downloaded) ✅ You can trace this update in the EAS dashboard.'}
    </Text>
  );
}
```

EAS dashboard에서 update group으로 이동하면(프로젝트를 열고 **Over-the-air updates**를 선택한 뒤 특정 update를 클릭), URL은 다음과 같이 표시됩니다:

```text
https://expo.dev/accounts/[accountName]/projects/[projectName]/updates/[updateGroupId]
```

`updateGroupId`를 `Updates.updateId`로 바꾸면 특정 플랫폼 update로 직접 이동할 수 있습니다:

```text
https://expo.dev/accounts/[accountName]/projects/[projectName]/updates/[updateId]
```

이렇게 하면 해당 플랫폼별 update에 대응하는 update group이 열립니다.
