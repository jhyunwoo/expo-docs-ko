---
modificationDate: November 03, 2025
title: update 다운로드하기
description: update를 다운로드하고 실행하기 위한 전략을 알아보세요.
---

# update 다운로드하기

update를 다운로드하고 실행하기 위한 전략을 알아보세요.

> 이 페이지의 아래 정보는 모두 release build와 [`EX_UPDATES_NATIVE_DEBUG`가 활성화된](/eas-update/debug#runtime-issues) debug build에만 적용됩니다.

이 섹션에서는 update를 다운로드하고 실행하는 다양한 전략을 다룹니다. 목표는 느린 로딩 화면이나 기타 문제로 사용자 경험을 해치지 않으면서, 게시된 뒤 가능한 한 빨리 최종 사용자가 앱의 최신 버전을 사용하도록 하는 것입니다. 이 전략들은 서로 배타적이지 않으며, 앱의 요구 사항에 맞게 필요에 따라 조합해 사용할 수 있습니다.

## 기본적으로 update는 시작 시 비동기로 로드됩니다

기본 동작은 앱을 cold boot할 때(완전히 종료된 상태에서 실행할 때) update를 확인하고, 사용 가능하면 다운로드하는 것입니다. 이 과정은 앱 로딩을 막지 않으므로, 이 전략을 사용하면 최종 사용자는 update가 게시된 뒤 cold boot를 하고, 그다음 어느 시점에 앱을 종료했다가 다시 시작할 때에만 update를 로드하게 됩니다(예를 들어 OS의 최근 앱 목록에서 닫거나 기기를 껐다가 다시 켰을 때).

이 동작이 안전한 이유는 네트워크 요청이 끝날 때까지 기다리느라 앱 시작을 방해하지 않기 때문입니다(현실에서 사용자가 느린 연결 상태에 있을 때 몇 초 동안 로딩 화면에 갇히는 것은 좋지 않은 사용자 경험입니다). 단점은 사용자가 최신 버전을 채택하는 데 훨씬 더 오랜 시간이 걸린다는 점입니다. 이상적인 상태가 update가 게시되자마자 모든 사용자가 즉시 채택하는 것이라면, 이 전략은 그 목표에 크게 못 미칩니다.

항상 최신 update가 다운로드될 때까지 앱 시작을 막고 싶다면 어떻게 하나요?

이 전략은 사용자 경험이 극도로 나빠지므로 권장하지 않습니다. 일반적으로 사용자가 앱을 실행할 때 splash screen에서 오래 기다리게 되면 앱을 닫고 다시 시도하게 되고(그 결과 update 다운로드가 완료되지 않습니다), 아니면 포기하고 다른 앱을 사용합니다. 사용자의 기기가 느린 네트워크에 연결되어 있으면, update가 없더라도 앱을 로드하는 데 몇 초 이상 기다려야 할 수 있습니다. 사용자가 항상 최신 앱 버전을 갖고 있어야 하는 것이 매우 중요하다면, 여기서 설명하는 다른 전략 중 하나를 살펴보는 것이 좋습니다.

기본 동작을 비활성화하려면 어떻게 하나요?

`updates` 구성에서 [`checkAutomatically`](/versions/latest/sdk/updates#updatescheckautomaticallyvalue) 옵션을 `NEVER`로 설정하면 기본 동작을 비활성화할 수 있습니다. 이렇게 하면 앱이 자동으로 update를 확인하고 다운로드하지 않습니다.

## 앱이 실행 중일 때 update 확인하기

앱이 실행 중일 때 `Updates.checkForUpdateAsync()`를 사용해 update를 확인할 수 있습니다. 이 메서드는 promise를 반환하며, update를 사용할 수 있으면 `isAvailable`이 `true`로 설정되고 [`UpdateCheckResult` 객체](/versions/latest/sdk/updates#updatecheckresult)로 resolve되며, update 정보는 [`manifest`](/versions/latest/sdk/manifests#expoupdatesmanifest) 속성에 담겨 있습니다.

update를 사용할 수 있다면 `Updates.fetchUpdateAsync()` 메서드를 사용해 update를 다운로드할 수 있습니다. 이 메서드는 다운로드가 완료되면 resolve되는 promise를 반환합니다. 마지막으로 `Updates.reloadAsync()` 메서드를 사용해 앱을 새 버전으로 다시 로드할 수 있습니다. `useUpdates()` hook을 사용해 React component에서 `expo-updates` 라이브러리의 상태를 모니터링할 수도 있습니다.

앱이 실행 중일 때 update를 확인하는 일반적인 패턴에는 무엇이 있나요?

-   앱 lifecycle의 여러 시점, 예를 들어 [foreground로 돌아올 때](https://reactnative.dev/docs/appstate)나 일정 간격마다 update를 확인할 수 있습니다. update를 발견하면 사용자에게 update를 권유하는 dialog를 보여 주는 것을 고려할 수 있습니다.
-   실행 시 update를 확인하고, 사용자가 시작 시 항상 최신 version을 받도록 보장하는 것이 사용 사례에서 매우 중요하다면 자체 custom loading screen을 표시할 수 있습니다.

## 앱이 background 상태일 때 update 확인하기

앱이 background 상태일 때 [`expo-background-task`](/versions/latest/sdk/background-task)를 사용해 update를 확인할 수 있습니다. 이렇게 하려면 foreground에서 사용하는 것과 동일한 `Updates.checkForUpdateAsync()` 및 `Updates.fetchUpdateAsync()` 메서드를 사용하되, 이를 background task 안에서 실행하세요. 이렇게 하면 사용자가 한동안 앱을 열지 않았더라도 항상 최신 버전의 앱을 갖도록 하는 훌륭한 방법이 됩니다.

background에서 update가 다운로드된 뒤 앱을 다시 로드할지, 아니면 사용자가 앱을 닫았다가 다시 열 때까지 기다릴지 고려해 볼 가치가 있습니다. background에서 다운로드만 하고 적용하지 않더라도, 다음 부팅에서 즉시 최신 버전을 사용할 수 있게 하므로 여전히 유용하며 기본 동작보다 update 채택 속도를 더 빠르게 만들 수 있습니다.

background에서 update를 확인하는 예시

애플리케이션이 시작될 때 background task가 등록되도록 하려면, 최상위 component에서 `setupBackgroundUpdates` 함수를 import하고 호출하세요.

```ts
import * as TaskManager from 'expo-task-manager';
import * as BackgroundTask from 'expo-background-task';
import * as Updates from 'expo-updates';

const BACKGROUND_TASK_NAME = 'task-run-expo-update';

export const setupBackgroundUpdates = async () => {
  TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
    return Promise.resolve();
  });

  await BackgroundTask.registerTaskAsync(BACKGROUND_TASK_NAME, {
    minimumInterval: 60 * 24,
  });
};

setupBackgroundUpdates();
```

앱이 background 상태일 때도 `Updates.reloadAsync()`로 update를 적용해야 하나요?

**앱이 background 상태일 때 `Updates.reloadAsync()`를 호출하는 기능 지원은 실험적입니다**. 이것은 새로운 기능이며 널리 사용되지는 않았으므로, 처음 활성화할 때는 충돌을 꼭 모니터링하세요. background에서 update를 다운로드하는 것은 안전합니다.

앱이 background 상태일 때 update를 다시 로드하면 사용자가 다시 앱을 열 때 최신 버전을 사용하도록 하는 훌륭한 방법이 될 수 있습니다. 다만 앱이 background 상태가 되었을 때의 상태를 저장하고 다시 복원하지 않는 한, 사용자는 앱을 다시 열 때 cold boot를 경험하게 된다는 점을 유의해야 합니다. 이를 완화하는 한 가지 방법은 앱이 일정 시간 동안 비활성 상태였을 때에만 background에서 reload를 수행하는 것입니다. 이 정도 시간이 지나면 사용자가 앱이 이전 상태를 복원할 것이라고 기대하지 않을 가능성이 높기 때문입니다.

## 중요/필수 update

`expo-updates` 라이브러리에는 중요/필수 update에 대한 1급 지원이 없습니다. 하지만 중요 update를 확인하고 수동으로 적용하는 로직은 직접 구현할 수 있습니다. [`expo/UpdatesAPIDemo` 저장소](https://github.com/expo/UpdatesAPIDemo)에는 이를 접근하는 한 가지 방법의 예제가 들어 있습니다. 위 전략들과 결합해 update를 확인할 수 있습니다.

## 클라이언트 측에서 어떤 update를 로드할지 제어하기

일반적인 EAS Update 사용 방식은 앱 build 안에 단일 update URL과 request header 집합(update channel 이름 등)을 임베드하는 것입니다. 어떤 update를 로드할지는 `eas update` 명령이나 EAS dashboard를 통해 서버에서 변경을 가함으로써 제어합니다. 예를 들어 build가 가리키는 channel에 새 update를 게시하면, build는 다음 실행 시 해당 update를 가져옵니다. build가 가리키는 것과 다른 channel에 게시된 update는 이 방식으로는 다운로드되지 않습니다.

`Updates.setUpdateURLAndRequestHeadersOverride()` 메서드를 사용하면 runtime에 update URL과 request header를 재정의할 수 있습니다. 앱이 실행 중일 때 특정 update를 로드하거나 update channel을 바꾸고 싶을 때 유용합니다. [자세히 알아보세요](/eas-update/override).

## update 채택 상황 모니터링하기

update의 세부 정보 페이지(예: `https://expo.dev/accounts/[account]/projects/[project]/updates/[id]`)에는 해당 update를 실행한 사용자 수와 failed install 수(사용자가 update를 다운로드하고 실행을 시도했지만 충돌한 경우)에 대한 metric이 표시됩니다.

Deployments 페이지(예: `https://expo.dev/accounts/[account]/projects/[project]/deployments/production/[runtime-version]`)에는 특정 update channel과 runtime version 조합에 관련된 각 update를 일정 기간 동안 실행한 사용자 수를 보여 주는 표와 차트가 포함되어 있습니다.
