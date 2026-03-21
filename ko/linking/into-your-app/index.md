---
modificationDate: March 01, 2026
title: 앱으로 링크하기
description: React Native와 Expo 앱에서 deep link를 만들어 들어오는 URL을 처리하는 방법을 알아보세요.
---

# 앱으로 링크하기

React Native와 Expo 앱에서 deep link를 만들어 들어오는 URL을 처리하는 방법을 알아보세요.

이 가이드는 커스텀 scheme을 추가해 프로젝트에서 표준 **deep links**를 구성하는 단계를 제공합니다.

> 대부분의 앱에서는 이 가이드에서 설명하는 deep links 대신 [Android App/iOS Universal Links](/linking/overview#universal-linking)를 설정하거나, 둘 다 함께 설정하는 것이 좋습니다.

## app config에 커스텀 scheme 추가하기

앱에 대한 링크를 제공하려면 [`scheme`](/versions/latest/config/app#scheme) 속성에 커스텀 문자열을 추가하세요. 이 속성은 [app config](/workflow/configuration)에 있습니다:

```json
{
  "expo": {
    "scheme": "myapp"
  }
}
```

앱에 커스텀 scheme을 추가한 후에는 [새 development build를 생성](/develop/development-builds/create-a-build)해야 합니다. 앱이 디바이스에 설치되면 `myapp://`을 사용해 앱 내부의 링크를 열 수 있습니다.

**custom scheme이 정의되지 않은 경우**, 앱은 development build와 production build 모두에서 `android.package`와 `ios.bundleIdentifier`를 기본 scheme으로 사용합니다. 이는 [Expo Prebuild](/more/glossary-of-terms#prebuild)가 Android와 iOS용 커스텀 scheme으로 이 속성들을 자동으로 추가하기 때문입니다.

## deep link 테스트하기

[`npx uri-scheme`](https://github.com/expo/expo/tree/main/packages/uri-scheme#readme)을 사용하면 앱을 여는 링크를 테스트할 수 있습니다. 이 도구는 URI scheme과 상호작용하고 테스트하기 위한 명령줄 유틸리티입니다.

예를 들어, 사용자가 링크를 탭했을 때(다른 앱이나 웹 브라우저를 통해) 열고 싶은 `/details` 화면이 앱에 있다면, 다음 명령어를 실행해 이 동작을 테스트할 수 있습니다:

```sh
npx uri-scheme open com.example.app://somepath/details --android
npx uri-scheme open myapp://somepath/details --ios
```

위 명령어를 실행하면:

-   앱의 `/details` 화면이 열립니다.
-   `android` 또는 `ios` 옵션은 링크를 Android 또는 iOS에서 열어야 함을 지정합니다.
-   또는 디바이스의 웹 브라우저에서 `<a href="scheme://">Click me</a>` 같은 링크를 클릭해 링크를 열어볼 수도 있습니다. 주소창에 직접 링크를 입력하는 방식은 기대대로 동작하지 않을 수 있으며, 이 기능을 구현하려면 [universal linking](/linking/overview#universal-linking)을 사용할 수 있습니다.

Expo Go를 사용해 링크 테스트하기

기본적으로 [Expo Go](https://expo.dev/go)는 `exp://` scheme을 사용합니다. 뒤에 URL 주소를 지정하지 않고 `exp://`로 링크하면 앱의 홈 화면이 열립니다. 개발 중에는 앱의 전체 URL이 `exp://127.0.0.1:8081`처럼 보입니다.

Expo Go에서 `/details` 화면을 열면서 테스트하려면 `npx uri-scheme`을 사용할 수 있습니다:

```sh
npx uri-scheme open exp://127.0.0.1:8081/--/somepath/into/app?hello=world --ios
```

Expo Go에서는 path가 지정되면 URL에 `/--/`가 추가됩니다. 이는 그 뒤의 부분이 deep link path에 해당하며, 앱 자체로 가는 path의 일부가 아니라는 점을 Expo Go에 알려줍니다.

기본적으로 Expo Go에서 URL을 열 때 `exp://`는 `http://`로 바뀝니다. `https://` URL을 열기 위해 `exps://`도 사용할 수 있습니다. 다만 현재 `exps://`는 안전하지 않은 TLS 인증서를 사용하는 사이트 로딩을 지원하지 않습니다.

## URL 처리하기

> [Expo Router](/linking/overview#use-expo-router-to-handle-deep-linking)를 사용하고 있다면 이 섹션은 무시해도 됩니다.

[`Linking.useURL()`](/versions/latest/sdk/linking#useurl) hook을 사용하면 [`expo-linking`](/versions/latest/sdk/linking)을 통해 앱을 실행하는 링크를 관찰할 수 있습니다.

```tsx
import * as Linking from 'expo-linking';

export default function Home() {
  const url = Linking.useURL();

  return <Text>URL: {url}</Text>;
}
```

`Linking.useURL()` hook은 내부적으로 다음 imperative methods를 따라 동작합니다:

-   앱을 실행한 링크는 처음에 [`Linking.getInitialURL()`](/versions/latest/sdk/linking#linkinggetinitialurl)로 반환됩니다.
-   앱이 이미 열려 있는 동안 새로 트리거되는 링크는 [`Linking.addEventListener('url', callback)`](/versions/latest/sdk/linking#linkingaddeventlistenertype-handler)로 관찰됩니다.

## URL 파싱하기

[`Linking.parse()`](/versions/latest/sdk/linking#linkingparseurl) 메서드를 사용하면 URL에서 **path**, **hostname**, **query parameters**를 파싱할 수 있습니다. 이 메서드는 deep linking 정보를 추출하고 비표준 구현도 고려합니다.

```tsx
import * as Linking from 'expo-linking';

export default function Home() {
  const url = Linking.useURL();

  if (url) {
    const { hostname, path, queryParams } = Linking.parse(url);

    console.log(
      `Linked to app with hostname: ${hostname}, path: ${path} and data: ${JSON.stringify(
        queryParams
      )}`
    );
  }

  return (
    Your React component here. 
  )
}
```

## 제한 사항

사용자에게 앱이 설치되어 있지 않다면, 앱으로 향하는 deep links는 동작하지 않습니다. [Branch](https://www.branch.io/deep-linking/) 같은 attribution 서비스는 앱이나 웹 페이지로 조건부 링크를 제공하는 솔루션을 제공합니다.

Android App/iOS Universal Links도 이런 경우를 처리하는 또 다른 해결책입니다. 이 유형의 링크는 사용자가 웹 도메인을 가리키는 HTTP(S) 링크를 클릭할 때 앱을 열 수 있게 해줍니다. 사용자에게 앱이 설치되어 있지 않으면, 링크는 웹사이트로 이동합니다. 자세한 내용은 [universal linking](/linking/overview#universal-linking)을 참고하세요.
