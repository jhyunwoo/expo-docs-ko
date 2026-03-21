---
modificationDate: January 28, 2026
title: EAS Update용 bundle diffing
description: 가능할 때 bundle diff를 수용하도록 프로젝트를 활성화하세요.
---

# EAS Update용 bundle diffing

가능할 때 bundle diff를 수용하도록 프로젝트를 활성화하세요.

> Bundle diffing은 **beta** 상태이며 제한이 있을 수 있습니다. 자세한 내용은 [현재 제한 사항](/eas-update/bundle-diffing#current-limitations)을 참고하세요.

bundle diffing을 활성화하면 가능할 때 EAS Update가 **bundle patch**를 전달할 수 있습니다. 새 update를 게시하면 EAS Update는 기기에서 현재 실행 중인 bundle과 새 bundle 사이의 차이만 포함한 더 작은 파일을 생성할 수 있습니다. 이로 인해 update 다운로드 크기가 크게 줄어드는 경우가 많습니다.

## 사전 준비

앱은 반드시 **Expo SDK 55 이상**을 사용해야 합니다.

## bundle diffing 활성화하기

프로젝트의 [app config](/workflow/configuration)에서 `updates.enableBsdiffPatchSupport`를 `true`로 설정하세요:

```json
{
  "expo": {
    "updates": {
      "enableBsdiffPatchSupport": true
    }
  }
}
```

## bundle diff가 실제로 제공되는지 확인하기

### Expo website

[Update Details](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/updates) 페이지에서 bundle diff가 제공되는지 확인할 수 있습니다. 게시한 Update Group을 열고, 검사하려는 플랫폼을 선택하세요.

### Updates API

`Updates.readLogEntriesAsync()`로 update 로그를 검사해 bundle diff가 제공되는지 확인할 수 있습니다. 앱이 patch를 받았다면, 성공적으로 적용되었다는 항목(예: "patch successfully applied")이 표시됩니다.

## patch 생성과 제공

EAS Update는 bundle patch를 생성하기 위해 [bsdiff algorithm](https://en.wikipedia.org/wiki/Bsdiff)을 사용합니다.

patch는 다음 조건일 때만 제공됩니다:

-   **전체 bundle보다 의미 있게 더 작을 때.** 그렇지 않으면 EAS Update는 대신 전체 bundle을 제공합니다.
-   **효율적으로 계산할 수 있을 때.** patch 생성 비용이 너무 크면 EAS Update는 대신 전체 bundle을 제공합니다.

## 현재 제한 사항

-   **임베드된 bundle은 대상이 아닙니다.** 임베드된 bundle은 patch 생성의 base로 절대 사용되지 않습니다. patch를 받으려면 기기가 이미 게시된 update를 실행 중이어야 합니다.
-   **모든 가능한 update 쌍에 대해 즉시 patch가 보장되지는 않습니다.** update가 게시될 때 EAS Update는 channel에서 두 번째로 최신인 update와의 patch만 미리 계산합니다. 기기가 다른 게시된 update를 실행 중인 상태에서 새 update를 요청하면, 처음에는 전체 bundle을 받게 됩니다. 이후 그 특정 base update에 대한 patch가 필요 시 생성되어, 이후 유사한 요청에 제공됩니다.
-   **patch는 게시 직후 잠시 뒤에 생성됩니다.** update를 게시한 시점과 patch가 준비되는 시점 사이에는 몇 분 정도의 간격이 있을 수 있습니다. 그 시간 동안 기기는 전체 bundle을 받을 수 있습니다.
