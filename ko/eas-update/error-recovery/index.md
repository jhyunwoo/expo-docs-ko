---
modificationDate: May 21, 2025
title: 오류 복구
description: expo-updates 라이브러리를 사용할 때 내장된 오류 복구를 활용하는 방법을 알아보세요.
---

# 오류 복구

expo-updates 라이브러리를 사용할 때 내장된 오류 복구를 활용하는 방법을 알아보세요.

`expo-updates`를 사용하는 앱은 실수로 깨진 update를 게시했을 때를 대비한 추가 안전장치로, 내장된 오류 복구 동작을 활용할 수 있습니다.

production에 게시하기 전에 staging 환경에서 update를 테스트하는 것이 얼마나 중요한지는 아무리 강조해도 지나치지 않지만, 사람(그리고 컴퓨터)도 가끔 실수합니다. 여기서 설명하는 오류 복구 동작은 그런 경우에 최후의 수단 역할을 할 수 있습니다.

> **면책 조항:** 아래에 문서화된 동작은 변경될 수 있으며, 이에 의존해서는 안 됩니다. update를 게시하기 전에 production과 유사한 환경에서 항상 코드를 신중하고 철저하게 테스트하세요.

## 도와주세요! production에 깨진 update를 게시했습니다. 어떻게 해야 하나요?

우선 당황하지 마세요. 실수는 일어날 수 있고, 대부분은 괜찮을 가능성이 높습니다.

중요한 것은 **가능한 한 빨리 수정이 포함된 새 update를 게시하는 것(단, 수정이 100% 확실하다는 자신이 들기 전에는 안 됩니다)** 입니다. `expo-updates`의 오류 복구 메커니즘은 대부분의 경우, 이미 깨진 update를 다운로드한 사용자도 수정 사항을 받을 수 있도록 보장해 줍니다.

가장 먼저 시도할 일은 정상 동작한다고 알고 있는 이전 update로 롤백하는 것입니다. **하지만 이것이 항상 안전한 것은 아닙니다.** 예를 들어 깨진 update가 persistent state(예: AsyncStorage나 기기 파일 시스템에 저장된 데이터)를 하위 호환되지 않는 방식으로 수정했을 수 있습니다. 최종 사용자의 기기 상태를 가능한 한 가깝게 에뮬레이션한 staging 환경에서 깨진 update를 로드한 뒤 롤백하는 테스트를 하는 것이 중요합니다.

안전하게 롤백할 수 있는 이전 update를 식별할 수 있다면 [EAS dashboard](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/updates) 또는 [EAS CLI](/eas-update/eas-cli#republish-a-previous-update-within-a-branch)의 EAS Update `republish` 옵션을 사용해 롤백할 수 있습니다.

안전하게 롤백할 수 있는 이전 update를 찾지 못했다면, 앞으로 나아가며 수정해야 합니다. 가능한 한 빨리 수정 사항을 배포하는 것이 가장 좋지만, 그 수정이 견고하다는 것을 확인할 시간을 가지세요. 그 사이 깨진 update를 다운로드한 사용자도 여전히 수정 사항을 다운로드할 수 있습니다.

이 동작이 어떻게 이루어지는지 더 자세히 알고 싶다면, 계속 읽어 보세요.

## 오류 복구 흐름 설명

오류 복구 흐름은 가능한 한 가볍게 유지되도록 설계되었습니다. 이것은 최종 사용자를 오류의 결과로부터 완전히 보호하는 안전망이 아닙니다. 많은 경우 사용자는 여전히 충돌을 보게 됩니다.

오히려 목적은 update가 앱을 "벽돌 상태"로 만드는 것(업데이트를 확인하기도 전에 실행 시 충돌해 앱을 제거하고 다시 설치하기 전까지 사용할 수 없게 되는 상태)을 방지하는 것입니다. 가능한 한 많은 경우 앱이 새 update를 다운로드하고 스스로를 복구할 기회를 갖게 만드는 것이 목적입니다.

### 오류 포착하기

앱 lifecycle에서 충분히 이른 시점에 JS 실행 중 fatal error가 발생해 앱이 더 이상의 update를 다운로드하지 못할 수 있다면, `expo-updates`가 이 오류를 잡습니다.

> 앱이 처음 렌더링된 시점부터 fatal error가 발생할 때까지 10초 이상 경과했다면 `expo-updates`는 이 오류를 전혀 잡지 못하고 어떤 오류 복구 코드도 트리거되지 않습니다. 따라서 앱이 실행된 직후, 자동이든 수동이든 매우 빠르게 update를 확인하도록 강력히 권장합니다. 그래야 미래의 오류가 발생했을 때 수정 사항을 배포할 수 있습니다.

`expo-updates`가 JS 오류를 포착하면, 그다음에 무슨 일이 일어날지는 React Native가 네이티브 "content appeared" 이벤트를 발생시켰는지에 따라 달라집니다(Android의 `ReactMarkerConstants.CONTENT_APPEARED` 또는 iOS의 `RCTContentDidAppearNotification`). 이는 대략적으로 이 특정 update에 대해 앱의 첫 번째 view가 화면에 렌더링된 시점이며, 이번 실행일 수도 있고 이전 실행일 수도 있습니다.

> **왜 이런 구분이 필요한가요?** 어떤 경우에는 `expo-updates`가 자동으로 이전의(정상 동작하던) update로 롤백하려고 시도할 수 있지만, 새 update가 persistent state를 하위 호환되지 않는 방식으로 변경했다면 이는 위험할 수 있습니다. 우리는 첫 번째 view가 렌더링되기 전에 오류가 발생했다면 그런 코드가 아직 실행되지 않았다고 가정하므로, 롤백이 안전하다고 봅니다. 이 시점 이후에는 `expo-updates`는 앞으로 수정만 수행하고 롤백하지 않습니다.

### content가 이미 나타난 경우

오류가 포착되었고 "content appeared" 이벤트가 이미 발생했거나, 혹은 같은 update의 과거 실행에서 이 기기에서 한 번이라도 발생한 적이 있다면 다음과 같은 일이 일어납니다:

-   5초 타이머가 시작되고, (`EXUpdatesCheckOnLaunch`/`expo.modules.updates.EXPO_UPDATES_CHECK_ON_LAUNCH`가 `NEVER`로 설정되어 있지 않은 한) 앱은 새 update를 확인하고 있으면 다운로드합니다.
-   새 update가 없거나, update 다운로드가 완료되거나, 타이머가 끝나면(셋 중 무엇이 먼저든) 앱은 원래 오류를 다시 throw하고 충돌합니다.

새 update가 다운로드되면 사용자가 다음에 앱을 열려고 할 때 실행된다는 점에 유의하세요.

### content가 아직 나타나지 않은 경우

"content appeared" 이벤트가 발생하기 전에 오류가 포착되었고, 현재 update가 이 기기에서 처음 실행되는 것이라면 다음과 같은 일이 일어납니다:

-   해당 update는 로컬에서 "failed"로 표시되며 이 기기에서 다시 실행되지 않습니다.
-   5초 타이머가 시작되고, (`EXUpdatesCheckOnLaunch`/`expo.modules.updates.EXPO_UPDATES_CHECK_ON_LAUNCH`가 `NEVER`로 설정되어 있지 않은 한) 앱은 새 update를 확인하고 있으면 다운로드합니다.
-   새 update가 타이머가 끝나기 전에 다운로드를 마치면 앱은 즉시 스스로를 다시 로드하고 새로 다운로드된 update를 실행하려고 시도합니다.
-   이 새로 다운로드된 update도 fatal error를 던지거나, 새 update가 없거나, 타이머가 끝나면 앱은 즉시 다시 로드하려고 시도하면서 이전에 가장 최근에 성공적으로 실행된 update로 롤백합니다.
-   이것도 실패하거나, 기기에 사용할 수 있는 이전 update가 없으면 앱은 원래 오류를 다시 throw하고 충돌합니다.

## 오류 stacktrace

앱이 fatal JS error를 만나고 오류 복구 시스템이 복구하지 못하면, 원래 예외를 다시 throw해서 충돌을 일으킵니다. stacktrace는 다음과 비슷하게 보입니다:

```text
--------- beginning of crash
AndroidRuntime: FATAL EXCEPTION: expo-updates-error-recovery
AndroidRuntime: Process: com.myapp.MyApp, PID: 12498
AndroidRuntime: com.facebook.react.common.JavascriptException
AndroidRuntime:
AndroidRuntime: 	at com.facebook.react.modules.core.ExceptionsManagerModule.reportException(ExceptionsManagerModule.java:72)
AndroidRuntime: 	at java.lang.reflect.Method.invoke(Native Method)
AndroidRuntime: 	at com.facebook.react.bridge.JavaMethodWrapper.invoke(JavaMethodWrapper.java:372)
AndroidRuntime: 	at com.facebook.react.bridge.JavaModuleWrapper.invoke(JavaModuleWrapper.java:188)
AndroidRuntime: 	at com.facebook.react.bridge.queue.NativeRunnable.run(Native Method)
AndroidRuntime: 	at android.os.Handler.handleCallback(Handler.java:938)
AndroidRuntime: 	at android.os.Handler.dispatchMessage(Handler.java:99)
AndroidRuntime: 	at com.facebook.react.bridge.queue.MessageQueueThreadHandler.dispatchMessage(MessageQueueThreadHandler.java:27)
AndroidRuntime: 	at android.os.Looper.loop(Looper.java:223)
AndroidRuntime: 	at com.facebook.react.bridge.queue.MessageQueueThreadImpl$4.run(MessageQueueThreadImpl.java:228)
AndroidRuntime: 	at java.lang.Thread.run(Thread.java:923)
```

Android에서는 원래 예외의 stacktrace가 보존됩니다. crash reporting service에 따라 기본 오류에 대한 더 많은 정보를 보려면 충돌을 로컬에서 재현해야 할 수도 있고, 그렇지 않을 수도 있습니다.
