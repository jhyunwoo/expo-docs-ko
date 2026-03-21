---
modificationDate: November 11, 2025
title: OAuth 또는 OpenID provider로 인증하기
description: expo-auth-session 라이브러리를 사용해 OAuth 또는 OpenID provider 인증을 구현하는 방법을 알아보세요.
---

# OAuth 또는 OpenID provider로 인증하기

expo-auth-session 라이브러리를 사용해 OAuth 또는 OpenID provider 인증을 구현하는 방법을 알아보세요.

[`expo-auth-session`](/versions/latest/sdk/auth-session)은 Android, iOS, 웹에서 OAuth 및 OpenID Connect provider를 구현하기 위한 통합 API를 제공합니다. 이 가이드에서는 몇 가지 예제를 통해 `AuthSession` API를 사용하는 방법을 보여줍니다.

## 모든 인증 provider에 대한 규칙

`AuthSession` API를 사용할 때는 모든 인증 provider에 다음 규칙이 적용됩니다:

-   웹 popup을 닫기 위해 `WebBrowser.maybeCompleteAuthSession()`을 사용하세요. 이 코드를 추가하지 않으면 popup 창이 닫히지 않습니다.
-   `AuthSession.makeRedirectUri()`로 redirect를 만드세요. 이 함수는 범용 플랫폼 지원에 필요한 많은 복잡한 작업을 처리해 줍니다. 내부적으로 `expo-linking`을 사용합니다.
-   `AuthSession.useAuthRequest()`로 request를 만드세요. 이 hook은 비동기 설정을 허용하므로 모바일 브라우저가 인증을 차단하지 않게 해 줍니다.
-   `request`가 정의되기 전까지는 반드시 prompt를 비활성화하세요.
-   웹에서는 사용자 상호작용 안에서만 `promptAsync`를 호출할 수 있습니다.
-   앱 scheme를 커스터마이즈할 수 없기 때문에, Expo Go는 OAuth 또는 OpenID Connect가 활성화된 앱의 로컬 개발 및 테스트에 사용할 수 없습니다. 대신 [Development Build](/develop/development-builds/introduction)를 사용할 수 있습니다. 이는 Expo Go와 유사한 개발 경험을 제공하면서 로그인 후 앱으로 되돌아오는 OAuth redirect도 production과 동일한 방식으로 지원합니다.

## access token 얻기

대부분의 provider는 안전한 인증 및 권한 부여를 위해 [OAuth 2](https://oauth.net/2/) 표준을 사용합니다. authorization code grant에서는 identity provider가 일회성 코드를 반환합니다. 이 코드는 이후 사용자의 access token으로 교환됩니다.

[클라이언트 애플리케이션 코드에는 비밀 값을 저장하기에 안전하지 않기 때문에](https://reactnative.dev/docs/security#storing-sensitive-info), authorization code는 [API routes](/router/web/api-routes) 또는 [React Server Components](/guides/server-components) 같은 서버에서 교환해야 합니다. 이렇게 하면 provider의 token endpoint에 접근하기 위한 client secret을 안전하게 저장하고 사용할 수 있습니다.

## 예제

다음 예제는 `AuthSession` API를 사용해 몇 가지 인기 있는 provider로 인증하는 방법을 보여줍니다.

### GitHub

| Website | Provider | PKCE | Auto Discovery |
| --- | --- | --- | --- |
| [Get Your Config](https://github.com/settings/developers) | OAuth 2.0 | Supported | Not Available |

-   provider는 앱당 하나의 redirect URI만 허용합니다. 사용하려는 각 방법마다 별도의 앱이 필요합니다:
    -   Standalone / development build: `com.your.app://*`
    -   Web: `https://yourwebsite.com/*`
-   `redirectUri`에는 두 개의 슬래시(`://`)가 필요합니다.
-   `revocationEndpoint`는 동적이며 `config.clientId`가 필요합니다.

```tsx
import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { Button } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications/<CLIENT_ID>',
};

export default function App() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: 'CLIENT_ID',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'your.app'
      }),
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
    }
  }, [response]);

  return (
    <Button
      disabled={!request}
      title="Login"
      onPress={() => {
        promptAsync();
      }}
    />
  );
}
```

### Okta

| Website | Provider | PKCE | Auto Discovery |
| --- | --- | --- | --- |
| [Sign-up](https://developer.okta.com/signup/) > Applications | OpenID | Supported | Available |

-   custom `redirectUri`는 정의할 수 없으며, Okta가 이를 제공합니다.

```tsx
import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, useAutoDiscovery } from 'expo-auth-session';
import { Button, Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  // Endpoint
  const discovery = useAutoDiscovery('https://<OKTA_DOMAIN>.com/oauth2/default');
  // Request
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: 'CLIENT_ID',
      scopes: ['openid', 'profile'],
      redirectUri: makeRedirectUri({
        native: 'com.okta.<OKTA_DOMAIN>:/callback',
      }),
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
    }
  }, [response]);

  return (
    <Button
      disabled={!request}
      title="Login"
      onPress={() => {
        promptAsync();
      }}
    />
  );
}
```

## Redirect URI 패턴

여기서는 자주 사용하게 되는 일반적인 redirect URI 패턴 몇 가지를 예시로 보여줍니다.

### Standalone/development build

> `yourscheme://path`

경우에 따라 슬래시(`/`)가 1개에서 3개까지 들어갈 수 있습니다.

-   **Environment:**
    
    -   Bare workflow
        -   `npx expo prebuild`
    -   App Store 또는 Play Store의 standalone build 또는 로컬 테스트
        -   Android: `eas build` 또는 `npx expo run:android`
        -   iOS: `eas build` 또는 `npx expo run:ios`
-   **Create:** 올바른 environment에서 실행할 때 native를 선택하려면 `AuthSession.makeRedirectUri({ native: '<YOUR_URI>' })`를 사용하세요.
    
    -   `your.app://redirect` -> `makeRedirectUri({ scheme: 'your.app', path: 'redirect' })`
    -   `your.app:///` -> `makeRedirectUri({ scheme: 'your.app', isTripleSlashed: true })`
    -   `your.app:/authorize` -> `makeRedirectUri({ native: 'your.app:/authorize' })`
    -   `your.app://auth?foo=bar` -> `makeRedirectUri({ scheme: 'your.app', path: 'auth', queryParams: { foo: 'bar' } })`
    -   `exp://u.expo.dev/[project-id]?channel-name=[channel-name]&runtime-version=[runtime-version]` -> `makeRedirectUri()`
    -   이 링크는 종종 자동으로 생성할 수 있지만, 최소한 `scheme` property를 정의하는 것을 권장합니다. 앱에서는 `native` property를 전달해 전체 URL을 재정의할 수 있습니다. 보통 Google이나 Okta처럼 custom native URI redirect 사용이 필요한 provider에서 이 방식을 사용합니다. `npx uri-scheme`을 사용해 URI scheme를 추가, 나열, 열 수 있습니다.
    -   eject 이후 `expo.scheme`를 변경했다면 `expo apply` 명령을 사용해 변경 사항을 native 프로젝트에 적용한 뒤, 다시 빌드해야 합니다(`yarn ios`, `yarn android`).
-   **Usage:** `promptAsync({ redirectUri })`
    

## 사용자 경험 개선하기

"login flow"는 제대로 만들어야 할 중요한 부분입니다. 많은 경우 이 지점에서 사용자는 여러분의 앱을 계속 사용할지 _결정_하게 됩니다. 나쁜 경험은 사용자가 앱을 제대로 써보기도 전에 포기하게 만들 수 있습니다.

다음은 사용자에게 인증을 빠르고, 쉽게, 안전하게 제공하기 위한 몇 가지 팁입니다:

### 브라우저 워밍업

Android에서는 웹 브라우저를 사용하기 전에 선택적으로 워밍업할 수 있습니다. 이렇게 하면 브라우저 앱이 백그라운드에서 미리 초기화됩니다. 이 과정을 통해 사용자에게 인증 prompt를 띄우는 속도를 크게 높일 수 있습니다.

```tsx
import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';

function App() {
  useEffect(() => {
    WebBrowser.warmUpAsync();

    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  // Do authentication ...
}
```

### Implicit login

과거에는 앱 번들 안에 client secret을 저장할 안전한 방법이 없었기 때문에, 많은 provider가 client secret 없이 access token을 요청할 수 있는 "Implicit flow"를 제공했습니다. **하지만 이는 더 이상 권장되지 않습니다.** access token injection 위험을 포함한 고유한 보안 위험이 있기 때문입니다. 대신 대부분의 provider는 이제 PKCE(Proof Key for Code Exchange) 확장을 적용한 authorization code 방식을 지원하며, 이를 통해 클라이언트 앱 코드 안에서 authorization code를 안전하게 access token으로 교환할 수 있습니다. [Implicit flow에서 PKCE가 포함된 authorization code로 전환하는 방법](https://oauth.net/2/grant-types/implicit/)을 더 알아보세요.

`expo-auth-session`은 여전히 레거시 코드를 위해 Implicit flow를 지원합니다. 아래는 Implicit flow 구현 예시입니다.

```tsx
import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
};

function App() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: 'CLIENT_ID',
      scopes: ['user-read-email', 'playlist-modify-public'],
      redirectUri: makeRedirectUri({
        scheme: 'your.app'
      }),
    },
    discovery
  );

  useEffect(() => {
    if (response && response.type === 'success') {
      const token = response.params.access_token;
    }
  }, [response]);

  return <Button disabled={!request} onPress={() => promptAsync()} title="Login" />;
}
```

### 데이터 저장

Android와 iOS 같은 native 플랫폼에서는 [`expo-secure-store`](/versions/latest/sdk/securestore)라는 라이브러리를 사용해 access token 같은 값을 로컬에 안전하게 저장할 수 있습니다. 이는 secure하지 않은 `AsyncStorage`와는 다릅니다. Android에서는 암호화된 [`SharedPreferences`](https://developer.android.com/training/basics/data-storage/shared-preferences.html)에, iOS에서는 [keychain services](https://developer.apple.com/documentation/security/keychain_services)에 native 접근을 제공합니다. 웹에는 이에 해당하는 기능이 없습니다.

인증 결과를 저장하고 나중에 다시 복원하면 사용자가 다시 로그인 prompt를 보지 않도록 할 수 있습니다.

```tsx
import * as SecureStore from 'expo-secure-store';

const MY_SECURE_AUTH_STATE_KEY = 'MySecureAuthStateKey';

function App() {
  const [, response] = useAuthRequest({});

  useEffect(() => {
    if (response && response.type === 'success') {
      const auth = response.params;
      const storageValue = JSON.stringify(auth);

      if (Platform.OS !== 'web') {
        // Securely store the auth on your device
        SecureStore.setItemAsync(MY_SECURE_AUTH_STATE_KEY, storageValue);
      }
    }
  }, [response]);

  // More login code...
}
```
