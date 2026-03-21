---
modificationDate: January 26, 2026
title: runtime에 update 구성 재정의하기
description: 클라이언트 측에서 어떤 update를 로드할지 제어하기 위해 runtime에 update URL과 request header를 재정의하는 방법을 알아보세요.
---

# runtime에 update 구성 재정의하기

클라이언트 측에서 어떤 update를 로드할지 제어하기 위해 runtime에 update URL과 request header를 재정의하는 방법을 알아보세요.

일반적인 EAS Update 사용 방식은 앱의 build 안에 단일 update URL과 request header 집합(update channel 이름 등)을 임베드하는 것입니다. 어떤 update를 로드할지는 `eas update` 명령이나 EAS dashboard를 통해 서버에서 변경을 가함으로써 제어합니다. 예를 들어 build가 가리키는 channel에 새 update를 게시하면, build는 다음 실행 때 그 update를 가져옵니다. build가 가리키는 것과 다른 channel에 게시된 update는 이 방식으로는 다운로드되지 않습니다.

이 가이드는 runtime에 update URL과 request header를 변경하는 방법을 설명합니다. 이를 통해 새 build를 만들고 설치하지 않고도 특정 ID의 update를 로드하거나, update를 가져오는 channel을 바꿀 수 있습니다.

## request header 재정의하기

> 이 섹션에서 설명하는 기능은 Expo SDK 54와 `expo-updates` version 0.29.0 이상에서 사용할 수 있습니다.

이 기능의 주요 사용 사례는 [channel surfing](/eas-update/override#what-is-channel-surfing)입니다. 이는 production build 안에서 runtime에 update channel을 전환할 수 있게 해 줍니다. 덕분에 비기술 이해관계자도 development build를 사용하거나 각 변경마다 별도의 preview build를 만들지 않고, pull request나 다른 feature branch에서 진행 중인 update를 테스트하고 검증할 수 있습니다.

예를 들어 production update용 `default` channel과 preview update용 `preview` channel이 있다면, `expo-channel-name` request header를 재정의해 `preview` channel을 가리키게 만들 수 있습니다. 그러면 현재 production build 안에서 preview update를 테스트할 수 있습니다.

또 다른 잠재적 사용 사례는 서로 다른 사용자에게 서로 다른 update를 제공하는 것입니다. 예를 들어 일부 internal 사용자(직원 등)가 최종 사용자보다 먼저 update를 받도록 만들 수 있습니다.

### channel surfing이란 무엇인가요?

channel surfing은 설치된 앱이 runtime에 어떤 update channel에서 update를 가져올지 전환하는 방식입니다. build 시점에 구성된 channel에 영구적으로 묶여 있는 대신, 실행 중인 앱을 다른 channel(예: `preview` channel)로 리디렉션해 그곳의 update를 로드할 수 있습니다.

channel surfing은 다음과 같은 용도로 사용할 수 있습니다:

-   설치된 앱 하나가 필요할 때 channel 사이를 이동하도록 허용합니다. 앱은 build 시점에 정의된 channel에 영구적으로 잠기지 않고 runtime에 channel을 전환할 수 있습니다.
-   실제 build에서 preview와 테스트 워크플로를 가능하게 하므로, 개발자나 QA 또는 다른 이해관계자가 사용자가 설치한 것과 동일한 production build로 진행 중인 update를 시험할 수 있습니다.
-   반복과 검증 속도를 높일 수 있습니다. 새 build를 기다리지 않고도 앱을 다른 channel로 리디렉션해 update를 즉시 테스트, 리뷰, 검증할 수 있습니다.

channel surfing이 해결하는 문제와 적용 방법에 대한 자세한 내용은 [channel surfing 블로그 글](https://expo.dev/blog/channel-surfing-for-expo-updates-how-to-switch-update-channels-at-runtime)을 참고하세요.

### 동작 방식

[`Updates.setUpdateRequestHeadersOverride`](/versions/latest/sdk/updates#updatessetupdaterequestheadersoverriderequestheaders)를 호출해 `expo-channel-name` request header를 재정의할 수 있습니다. 그러면 지정한 channel에서 update를 가져오도록 update 요청이 재정의됩니다.

앱 어딘가에 사용자가 request header 변경을 트리거할 수 있는 수단을 제공해야 합니다. 사용 사례에 따라 신뢰된 사용자만 접근할 수 있는 숨겨진 메뉴일 수도 있고, 다른 메커니즘일 수도 있습니다. 매개변수가 바뀐 뒤에는 [`fetchUpdateAsync()`](/versions/latest/sdk/updates#updatesfetchupdateasync)로 update를 가져오고, [`reloadAsync()`](/versions/latest/sdk/updates#updatesreloadasyncoptions)로 앱을 다시 로드할 수 있습니다. 또는 다음 실행을 기다려도 됩니다. 다음 실행 시에는 자동으로 update를 가져오고 설치합니다.

```js
import * as Updates from 'expo-updates';

// Where you call this method depends on your use case - it may make sense to
// have a menu in your preview builds that allows testers to pick from available channels,
// for example:
Updates.setUpdateRequestHeadersOverride({ 'expo-channel-name': 'preview' });

// You can fetch and reload the update immediately, or wait for the next launch
await Updates.fetchUpdateAsync();
await Updates.reloadAsync();
```

### channel 전환 시 위험과 고려 사항

channel을 전환하면 앱이 실행하는 JavaScript bundle이 바뀝니다. 앱이 channel 간에 호환되지 않는 migration이나 data shape에 의존한다면, 앞뒤로 전환할 때 문제가 생길 수 있습니다.

예를 들어 beta update가 database migration을 적용하면, production version은 그 새 schema를 이해하지 못할 수 있습니다. 개발자는 update가 서로 전환되어도 안전하도록 보장하거나, 필요할 때는 단방향 전환만 허용해야 합니다.

## update URL과 request header를 모두 재정의하기

> 이 섹션에서 설명하는 기능은 Expo SDK 52와 `expo-updates` version 0.27.0 이상에서 사용할 수 있습니다. `disableAntiBrickingMeasures` 옵션 사용은 production 앱에는 권장되지 않으며, 현재는 주로 preview 환경을 위한 기능입니다.

[request header 재정의하기](/eas-update/override#override-request-headers)와 비슷하게, 특정 update로 update URL까지 추가로 재정의하고 싶다면 [`Updates.setUpdateURLAndRequestHeadersOverride`](/versions/latest/sdk/updates#updatessetupdateurlandrequestheadersoverrideconfigoverride) 메서드를 사용할 수 있습니다. 이를 통해 현재 build가 만들어지기 전에 게시된 update라도 ID로 특정 update를 로드할 수 있습니다.

이 기능을 production에서 사용하기로 결정하기 전에 [보안 고려 사항](/eas-update/override#security-considerations)에 익숙해지는 것이 중요합니다. 향후에는 이 사용 사례에 더 적합한, 더 제한적인 버전을 지원할 수도 있습니다.

### 동작 방식

관련 API는 두 가지입니다:

1.  `Updates.setUpdateURLAndRequestHeadersOverride({ url: string, requestHeaders: Object })` - 이 메서드는 **app.json** / **Expo.plist** / **AndroidManifest.xml**에 지정된 update URL과 request header(`expo-channel-name` header 등)를 재정의합니다.
2.  `disableAntiBrickingMeasures` - app config의 이 필드는 `expo-updates`에 내장된 anti-bricking 조치를 비활성화합니다. 이 조치는 이전에 설치된 update에 문제가 생겼을 때도 이후 update를 항상 게시해 복구할 수 있도록 보장합니다. 이 값을 변경하면 적용을 위해 새 build를 만들어야 합니다. **production build에서는 이 값을 활성화하지 마세요.** 이렇게 이름이 붙은 이유는 update URL/header를 재정의할 때, 이전에 로드된 update로 안전하게 롤백할 수 없음을 명확히 드러내기 위함입니다. 즉, 이 필드와 `setUpdateURLAndRequestHeadersOverride`를 함께 사용하면 embedded update가 비활성화되므로, 새 update가 앱을 충돌시키더라도 `expo-updates`가 자동으로 복구할 수 없습니다. 롤백할 update가 존재하지 않기 때문입니다. 이 경우 사용자는 앱을 삭제하고 다시 설치해야 합니다. 따라서 이 기능은 preview build에서만 사용해야 합니다.

이 API를 사용하는 방법:

1.  **update URL/header를 재정의하고, 사용자에게 앱을 닫으라고 안내하기**: 앱 어딘가에 사용자가 URL 및/또는 request header 변경을 트리거할 수 있는 수단을 제공해야 합니다. 사용 사례에 따라 trusted user만 접근할 수 있는 숨겨진 메뉴일 수도 있고, 다른 방식일 수도 있습니다. 매개변수가 바뀌면 alert 같은 방식으로 사용자가 앱을 닫았다가 다시 열어야 한다고 알려주세요. `expo-updates` 라이브러리의 `checkForUpdateAsync()` 같은 메서드는 앱이 완전히 닫혔다가 다시 열리기 전까지는 새로 재정의된 URL과 request header를 사용하지 않습니다.
2.  **새 update는 다음 앱 실행 때 다운로드되고 실행됩니다**: 앱이 완전히 닫힌 뒤("killed" 상태여야 하며 단순히 background로 간 것만으로는 안 됩니다) 다시 열리면, update와 관련 asset이 모두 다운로드됩니다. 준비가 끝나면 앱이 실행됩니다. 다운로드 중에는 사용자가 splash screen에서 기다려야 합니다. splash screen에서 기다리는 경험이 이상적이지 않다는 점은 이해하고 있으며, 이 기능이 널리 사용된다면 향후 개선할 계획입니다. 현재 권장 사용 사례(preview)에서는 이 정도 절충이 수용 가능할 가능성이 높습니다.

### 보안 고려 사항

`disableAntiBrickingMeasures`로 비활성화할 수 있는 anti-bricking 조치는 어떤 update가 게시되더라도 이후에 항상 또 다른 update를 게시해 복구할 수 있도록 보장합니다. 이 조치를 비활성화하면, 특히 사내(악의적인 직원)에서 malicious update를 게시하는 상황을 중심으로 특정 공격과 악용이 가능해집니다. 예를 들어 update를 게시할 권한이 있는 직원이 update URL과 request header를 자신의 서버로 바꾸는 악성 update를 게시해 앱 설치본을 탈취할 수 있습니다. 이 위험은 production update에 [code signing](/eas-update/code-signing)을 사용하고 key 접근을 제한함으로써 완화할 수는 있지만, 완전히 제거할 수는 없습니다.

비슷한 CodePush 사용 방식도 같은 위험을 가졌나요?

네. CodePush는 `sync({ deploymentKey: string })`로 deployment key를 교체할 수 있었으며, 이 역시 같은 방식으로 악의적으로 앱 설치본을 탈취하는 데 사용될 수 있었습니다.

### 예시 코드

이 API를 어떻게 사용할 수 있는지 예시는 다음과 같습니다:

```js
import * as Updates from 'expo-updates';

// Where you call this method depends on your use case - it may make sense to
// have a menu in your preview builds that allows testers to pick from available
// pull requests, for example.
function overrideUpdateURLAndHeaders() {
  Updates.setUpdateURLAndRequestHeadersOverride({
    url: 'https://u.expo.dev/{updateId}/group/{groupId}',
    requestHeaders: {},
  });

  alert('Close and re-open the app to load the latest version.');
}
```

```json
{
  "expo": {
    "updates": {
      // We recommend only enabling this in preview builds.
      // You can use app.config.js to configure it dynamically.
      "disableAntiBrickingMeasures": true
      // etc..
    }
  }
}
```
