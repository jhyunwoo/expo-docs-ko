---
modificationDate: March 06, 2026
title: iOS Universal Links
description: 표준 웹 URL에서 Expo 앱이 열리도록 iOS Universal Links를 구성하는 방법을 알아보세요.
---

# iOS Universal Links

표준 웹 URL에서 Expo 앱이 열리도록 iOS Universal Links를 구성하는 방법을 알아보세요.

앱에 iOS Universal Links를 구성하려면 웹사이트와 네이티브 앱을 검증하는 **양방향 연결**을 설정해야 합니다.

[Watch: Set up iOS Universal Links with Expo Router](https://www.youtube.com/watch?v=kNbEEYlFIPs&t=68) — 표준 웹 URL에서 Expo 앱이 열리도록 iOS Universal Links를 구성하는 방법을 알아보세요.

## 양방향 연결 설정하기

iOS에서 웹사이트와 앱 사이의 **양방향 연결**을 설정하려면 다음 단계를 수행해야 합니다:

-   **웹사이트 검증:** 대상 웹사이트의 **/.well-known** 디렉터리 안에 **apple-app-site-association (AASA)** 파일을 만들고 호스팅해야 합니다. 이 파일은 특정 링크에서 열린 앱이 올바른 앱인지 검증하는 데 사용됩니다.
-   **네이티브 앱 검증:** 대상 웹사이트 도메인(URL)을 참조하는 일종의 코드 서명이 필요합니다.

### AASA 파일 만들기

웹사이트 검증을 위해 **/.well-known** 디렉터리 안에 **apple-app-site-association** 파일을 만드세요. 이 파일은 Apple Developer Team ID, bundle identifier, 그리고 네이티브 앱으로 리디렉션할 지원 path 목록을 지정합니다.

> 프로젝트 안에서 실험적 CLI 명령 `npx setup-safari`를 실행하면 bundle identifier를 Apple 계정에 자동 등록하고, 해당 ID에 entitlements를 할당하며, 스토어에 iTunes 앱 항목을 생성할 수 있습니다. 로컬 설정 결과가 출력되며, 아래 단계 대부분을 건너뛸 수 있습니다. 이것이 iOS에서 universal links를 시작하는 가장 쉬운 방법입니다.

Expo Router로 웹사이트를 빌드하는 경우(또는 Remix, Next.js 같은 다른 최신 React 프레임워크를 사용하는 경우), AASA 파일을 **public/.well-known/apple-app-site-association**에 만드세요. 레거시 Expo webpack 프로젝트라면 **web/.well-known/apple-app-site-association**에 파일을 만드세요.

```json
{
  // This section enables Universal Links
  "applinks": {
    "apps": [],
    "details": [
      {
        // Syntax: "<APPLE_TEAM_ID>.<BUNDLE_ID>"
        "appID": "QQ57RJ5UTD.com.example.myapp",
        // All paths that should support redirecting.
        "paths": ["/records/*"]
      }
    ]
  },
  // This section enables Apple Handoff
  "activitycontinuation": {
    "apps": ["<APPLE_TEAM_ID>.<BUNDLE_ID>"]
  },
  // This section enable Shared Web Credentials
  "webcredentials": {
    "apps": ["<APPLE_TEAM_ID>.<BUNDLE_ID>"]
  }
}
```

위 예시에서:

-   `https://www.myapp.io/records/*`에 대한 모든 링크는 iOS 디바이스에서 일치하는 bundle identifier를 가진 앱으로 직접 열려야 합니다. 이는 [Apple Team ID](https://expo.fyi/apple-team)와 bundle identifier의 조합입니다.
-   `*` 와일드카드는 도메인이나 path 구분자(마침표와 슬래시)에는 **일치하지 않습니다**.
-   `activitycontinuation`과 `webcredentials` 객체는 선택 사항이지만 권장됩니다.

> AASA 형식에 대한 자세한 내용은 [Apple의 문서](https://developer.apple.com/library/archive/documentation/General/Conceptual/AppSearch/UniversalLinks.html)를 참고하세요. Branch는 AASA가 올바르게 배포되었고 형식이 유효한지 확인하는 데 도움이 되는 [AASA validator](https://branch.io/resources/aasa-validator/)를 제공합니다.

### `details` 형식 지원

[`details` 형식은 iOS 13부터 지원](https://developer.apple.com/documentation/xcode/supporting-associated-domains)됩니다. 이를 사용하면 다음을 지정할 수 있습니다:

-   `appID` 대신 `appIDs`: 같은 구성으로 여러 앱을 연결하기 더 쉬워집니다.
-   `components` 배열: fragment를 지정하고, 특정 path를 제외하고, comment를 추가할 수 있습니다.

Apple 문서의 AASA JSON 예시

```json
{
  "applinks": {
    "details": [
      {
        "appIDs": ["ABCDE12345.com.example.app", "ABCDE12345.com.example.app2"],
        "components": [
          {
            "#": "no_universal_links",
            "exclude": true,
            "comment": "Matches any URL whose fragment equals no_universal_links and instructs the system not to open it as a universal link"
          },
          {
            "/": "/buy/*",
            "comment": "Matches any URL whose path starts with /buy/"
          },
          {
            "/": "/help/website/*",
            "exclude": true,
            "comment": "Matches any URL whose path starts with /help/website/ and instructs the system not to open it as a universal link"
          },
          {
            "/": "/help/*",
            "?": {
              "articleNumber": "????"
            },
            "comment": "Matches any URL whose path starts with /help/ and which has a query item with name 'articleNumber' and a value of exactly 4 characters"
          }
        ]
      }
    ]
  }
}
```

모든 iOS 버전을 지원하려면 `details` 키에 위 두 형식을 모두 제공할 수 있지만, 최신 iOS 버전용 구성을 먼저 배치하는 것을 권장합니다.

### AASA 파일 호스팅하기

도메인에 연결된 웹 서버로 **apple-app-site-association** 파일을 호스팅하세요. 이 파일은 HTTPS 연결을 통해 제공되어야 합니다. 브라우저에서 이 파일에 접근할 수 있는지 확인하세요.

AASA 파일 설정을 마쳤다면, HTTPS를 지원하는 서버에 웹사이트를 배포하세요(대부분의 최신 웹 호스팅이 이를 지원합니다).

### 네이티브 앱 구성

**apple-app-site-association** (AASA) 파일을 배포한 뒤, [`ios.associatedDomains`](/versions/latest/config/app#associateddomains)를 [app config](/workflow/configuration)에 추가하여 앱이 해당 associated domain을 사용하도록 구성하세요. [Apple이 지정한 형식](https://developer.apple.com/documentation/bundleresources/entitlements/com_apple_developer_associated-domains)을 따르고, URL에 프로토콜(`https`)을 **포함하지 않도록** 하세요. 이는 universal links가 동작하지 않게 만드는 흔한 실수입니다.

예를 들어 associated website가 `https://expo.dev/`라면 `applinks`는 다음과 같습니다:

```json
{
  "expo": {
    "ios": {
      "associatedDomains": ["applinks:expo.dev"]
    }
  }
}
```

[EAS Build](/build/setup)로 iOS 앱을 빌드하면 entitlement가 Apple에 자동으로 등록됩니다.

수동 네이티브 구성

EAS나 [Continuous Native Generation](/workflow/continuous-native-generation) (`npx expo prebuild`)을 사용하지 않는다면, bundle identifier에 대해 **Associated Domains** capability를 [수동으로 구성](/build-reference/ios-capabilities#manual-setup)해야 합니다.

[Apple Developer Console](/build-reference/ios-capabilities#apple-developer-console)을 통해 이를 활성화한 경우, **ios/[app]/[app].entitlements** 파일에 다음 entitlement를 추가해야 합니다:

```xml
<key>com.apple.developer.associated-domains</key>
<array>
  <string>applinks:expo.dev</string>
</array>
```

### 네이티브 앱 검증

검증 프로세스를 트리거하려면 iOS 디바이스에 앱을 설치하세요. 모바일 디바이스에서 웹사이트 링크를 열었을 때 앱이 실행되어야 합니다. 실행되지 않는다면, AASA가 유효한지, AASA에 지정한 path가 올바른지, 그리고 [Apple Developer Console](https://developer.apple.com/account/resources/identifiers/list)에서 App ID를 정확히 구성했는지 이전 단계를 다시 확인하세요.

앱이 열린 후에는, 들어오는 링크를 처리하고 사용자가 요청한 콘텐츠를 보여주는 방법에 대한 자세한 내용은 [Handle links into your app](/linking/into-your-app#handle-urls)을 참고하세요.

> iOS는 앱이 처음 설치되거나 App Store에서 업데이트가 설치될 때 AASA를 다운로드합니다. 이후에는 운영 체제가 이 파일을 자주 새로 고치지 않습니다. 프로덕션 앱의 AASA path를 변경하려면 App Store를 통해 전체 업데이트를 배포해야 하며, 그래야 모든 사용자의 앱이 AASA를 다시 가져와 새 path를 인식할 수 있습니다.

## Apple Smart Banner

사용자에게 앱이 설치되어 있지 않으면 웹사이트로 이동하게 됩니다. [Apple Smart Banner](https://developer.apple.com/documentation/webkit/promoting_apps_with_smart_app_banners)를 사용하면 페이지 상단에 앱 설치를 유도하는 배너를 표시할 수 있습니다. 이 배너는 사용자가 모바일 디바이스를 사용 중이고 앱이 설치되어 있지 않을 때만 표시됩니다.

배너를 활성화하려면 웹사이트의 `<head>`에 다음 meta tag를 추가하세요. `<ITUNES_ID>`는 앱의 iTunes ID로 바꾸세요:

```html
<meta name="apple-itunes-app" content="app-id=<ITUNES_ID>" />
```

배너 설정에 어려움이 있다면, 다음 명령어를 실행해 프로젝트에 맞는 meta tag를 자동 생성할 수 있습니다:

```sh
npx setup-safari
```

### 정적으로 렌더링된 웹사이트에 meta tag 추가하기

[Expo Router로 정적으로 렌더링된 웹사이트를 빌드](/router/web/static-rendering)하고 있다면, [**src/app/+html.js** file](/router/web/static-rendering#root-html)의 `<head>` component에 HTML tag를 추가하세요.

```tsx
import { type PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="apple-itunes-app" content="app-id=<ITUNES_ID>" />
        {/* Other head elements... */}
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## 디버깅

Expo CLI를 사용하면 웹사이트를 배포하지 않고도 iOS Universal Links를 테스트할 수 있습니다. [`--tunnel`](/more/expo-cli#tunneling) 기능을 사용하면 dev server를 공개적으로 접근 가능한 HTTPS URL로 포워딩할 수 있습니다.

환경 변수 `EXPO_TUNNEL_SUBDOMAIN=my-custom-domain`을 설정하세요. 여기서 `my-custom-domain`은 개발 중에 사용할 고유 문자열입니다. 이렇게 하면 dev server를 다시 시작해도 tunnel URL이 일정하게 유지됩니다.

[위에서 설명한 대로](/linking/ios-universal-links#native-app-configuration) app config에 `associatedDomains`를 추가하세요. 도메인 값은 Ngrok URL인 `my-custom-domain.ngrok.io`로 바꾸세요.

`--tunnel` 플래그로 dev server를 시작하세요:

```sh
npx expo start --tunnel
```

디바이스에서 development build를 컴파일하세요:

```sh
npx expo run:ios
```

이제 디바이스의 웹 브라우저에 커스텀 도메인 링크를 입력하면 앱을 열 수 있습니다.

## 문제 해결

iOS Universal Links를 구현할 때 문제 해결에 도움이 되는 일반적인 팁은 다음과 같습니다:

-   [debugging universal links](https://developer.apple.com/documentation/technotes/tn3155-debugging-universal-links)에 대한 Apple의 공식 문서를 읽어보세요.
-   [validator tool](https://branch.io/resources/aasa-validator/)을 사용해 apple app site association 파일이 유효한지 확인하세요.
-   압축되지 않은 `apple-app-site-association` 파일은 [128kb보다 클 수 없습니다](https://developer.apple.com/library/archive/documentation/General/Conceptual/AppSearch/UniversalLinks.html).
-   웹사이트가 HTTPS로 제공되는지 확인하세요.
-   웹 파일을 업데이트했다면, 공급업체 측(Apple) 서버 업데이트를 트리거하기 위해 네이티브 앱을 다시 빌드하세요.
