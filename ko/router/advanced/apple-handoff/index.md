---
modificationDate: February 26, 2026
title: Apple Handoff
description: Expo Router와 Apple Handoff로 Apple 디바이스 간 앱 내비게이션을 끊김 없이 이어가는 방법을 알아보세요.
platforms: ['ios*', 'web']
---

# Apple Handoff

Expo Router와 Apple Handoff로 Apple 디바이스 간 앱 내비게이션을 끊김 없이 이어가는 방법을 알아보세요.
iOS (실제 디바이스만), Web

Apple Handoff는 사용자가 다른 디바이스에서 앱이나 웹사이트 탐색을 계속할 수 있게 해주는 기능입니다. Expo Router는 이 기능에 필요한 런타임 라우팅을 모두 자동화합니다. 하지만 한 번만 하면 되는 설정 작업은 수동으로 구성해야 합니다.

Expo Router에서 내부적으로 사용하는 iOS API(`NSUserActivity`)는 OS가 앱으로 전환할 때 현재 URL로 권장하는 `webpageUrl`을 필요로 합니다. `expo-router/head` 컴포넌트에는 `webpageUrl`을 Expo Router에서 현재 포커스된 route로 자동 설정할 수 있는 선택적 네이티브 모듈이 있습니다.

## Setup

다음 제한 사항과 고려 사항을 알아두는 것이 중요합니다:

-   Handoff는 Apple 전용입니다.
-   Handoff는 빌드 시점 설정이 필요하므로 Expo Go 앱에서는 사용할 수 없습니다.
-   Handoff를 사용하려면 적어도 iOS에서 [universal links](/linking/into-your-app)가 구성되어 있어야 하며, `activitycontinuation` object를 포함해야 합니다.
-   Handoff를 지원하려는 각 페이지에서 `expo-router/head` 컴포넌트를 사용해야 하며, 모든 페이지를 연속적으로 이어가고 싶다면 root layout에서 사용해야 합니다.

**public/.well-known/apple-app-site-association** 파일이 올바르게 구성되도록 하려면, `activitycontinuation` key와 함께 `<APPLE_TEAM_ID>.<IOS_BUNDLE_ID>` 형식의 앱 bundle ID와 Team ID를 포함하는 `apps` 배열이 있어야 합니다. 예를 들어 `QQ57RJ5UTD.app.expo.acme`에서 `QQ57RJ5UTD`는 Team ID이고 `app.expo.acme`는 bundle identifier입니다.

```json
{
  "applinks": {
    "details": [
      {
        "appIDs": ["<APPLE_TEAM_ID>.<IOS_BUNDLE_ID>"],
        "components": [
          {
            "/": "*",
            "comment": "Matches all routes"
          }
        ]
      }
    ]
  },
  "activitycontinuation": {
    "apps": ["<APPLE_TEAM_ID>.<IOS_BUNDLE_ID>"]
  },
  "webcredentials": {
    "apps": ["<APPLE_TEAM_ID>.<IOS_BUNDLE_ID>"]
  }
}
```

> `webcredentials` object는 선택 사항이지만 권장됩니다.

[app config](/versions/latest/config/app)를 기반으로 **apple-app-site-association** 파일을 생성하려면 다음 명령을 사용할 수 있습니다:

```sh
npx setup-safari
```

개발 환경에서 handoff를 테스트하려면 [Test the deep link](/linking/into-your-app#test-the-deep-link) 가이드를 참고하세요.

### Expo Head setup

`expo-router` config plugin을 사용해 `app.config.tsx` 파일에서 Handoff origin을 설정해야 합니다. 이 값은 사용자가 앱으로 전환할 때 `webpageUrl`로 사용될 URL입니다.

```tsx
// Be sure to change this to be unique to your project.
process.env.EXPO_TUNNEL_SUBDOMAIN = 'bacon-router-sandbox';

const ngrokUrl = `${process.env.EXPO_TUNNEL_SUBDOMAIN}.ngrok.io`;

/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  // ...
  ios: {
    associatedDomains: [
      `applinks:${ngrokUrl}`,
      `activitycontinuation:${ngrokUrl}`,
      `webcredentials:${ngrokUrl}`,
      // Add additional production-URLs here.
      // `applinks:example.com`,
      // `activitycontinuation:example.com`,
      // `webcredentials:example.com`,
    ],
  },

  plugins: [
    [
      'expo-router',
      {
        // Note: The URL must start with "https://" in "headOrigin"
        headOrigin:
          process.env.NODE_ENV === 'development'
            ? `https://${ngrokUrl}`
            : 'https://my-website-example.com',
      },
    ],
  ],
};
```

> 네이티브로 handoff를 테스트할 때는 개발 전용 `?mode=developer` suffix를 사용하지 마세요.

app config를 설정한 뒤에는 다음 명령으로 native project를 다시 생성하세요:

```sh
npx expo prebuild -p ios
```

개발 환경에서는 **앱을 디바이스에 설치하기 전에** 웹사이트를 먼저 시작해야 합니다. 앱을 설치할 때 OS가 Apple's servers를 통해 웹사이트의 **.well-known/apple-app-site-association** 파일을 조회하기 때문입니다. 웹사이트가 실행 중이 아니면 OS가 파일을 찾지 못해 handoff가 동작하지 않습니다. 이런 경우 `npx expo run:ios -d`로 native app을 다시 빌드하세요.

## Usage

handoff를 지원하려는 모든 route에서 `expo-router/head`의 `Head` 컴포넌트를 사용하세요:

```tsx
import Head from 'expo-router/head';
import { Text } from 'react-native';

export default function App() {
  return (
    <>
      <Head>
        <meta property="expo:handoff" content="true" />
      </Head>
      <Text>Hello World</Text>
    </>
  );
}
```

### Meta tags

`expo-router/head` 컴포넌트는 다음 meta tags를 지원합니다:

| Meta tags | Description |
| --- | --- |
| `expo:handoff` | 현재 route에서 handoff를 활성화하려면 `true`로 설정합니다. 기본값은 `false`입니다. (iOS only) |
| `og:title` and `<title>` | `NSUserActivity`용 title을 설정합니다. handoff에서는 사용되지 않습니다. |
| `og:description` | `NSUserActivity`용 description을 설정합니다. handoff에서는 사용되지 않습니다. |
| `og:url` | 사용자가 앱으로 전환할 때 열려야 하는 URL을 설정합니다. 기본값은 `expo-router` config plugin의 `headOrigin` prop을 baseURL로 삼아, 앱 내 현재 URL을 사용합니다. 상대 경로를 전달하면 `headOrigin`이 해당 path 앞에 붙습니다. |

플랫폼별로 값을 다르게 주고 싶다면 **Platform.select**를 사용할 수 있습니다:

```tsx
import Head from 'expo-router/head';

export default function App() {
  return (
    <Head>
      <meta
        property="og:url"
        content={Platform.select({ web: 'https://expo.dev', default: null })}
      />
    </Head>
  );
}
```

## Debugging

Apple 디바이스에서 [Handoff enabled](https://support.apple.com/en-us/HT209455) 상태인지 확인하세요. 아래 단계에서 앱 대신 Safari를 사용해 이 기능을 테스트할 수도 있습니다.

1.  디바이스에서 native application을 엽니다.
2.  Expo Router의 `<Head />` element를 렌더링하는 handoff 지원 route로 이동합니다.
3.  Mac으로 전환한 뒤 Dock에서 앱의 Handoff icon을 클릭합니다.
4.  iPhone 또는 iPad로 전환하려면 App Switcher를 열고 화면 하단의 앱 배너를 탭합니다.

아이폰의 App Switcher에 Safari icon만 보인다면 handoff가 동작하지 않는 것입니다.

## Troubleshooting

[AASA Validator](https://branch.io/resources/aasa-validator/) 같은 validator를 사용해 Apple App Site Association 파일(**public/.well-known/apple-app-site-association**)을 테스트할 수 있습니다.

문제가 있다면 가장 먼저 할 수 있는 최선의 방법은 앱에서 가장 공격적인 handoff 설정을 활성화하는 것입니다. 이렇게 하면 가능한 모든 route가 linkable한 상태가 됩니다. 이를 위해 **public/.well-known/apple-app-site-association** 파일이 모든 route와 일치하도록 하세요:

```json
{
  "applinks": {
    "details": [
      {
        "appIDs": ["<APPLE_TEAM_ID>.<IOS_BUNDLE_ID>"],
        "components": [
          {
            "/": "*",
            "comment": "Matches all routes"
          }
        ]
      }
    ]
  }
}
```

애플리케이션에서는 `<Head />` element를 조건부로 렌더링하지 않도록 하세요(예: `if/else` 블록 안에서). handoff를 지원하려는 모든 페이지에서 반드시 렌더링되어야 합니다. 디버깅 중에는 모든 route가 linkable하도록 [Root Layout](/router/basics/layout#root-layout) 컴포넌트에 추가하는 것을 권장합니다.

디바이스에 앱을 설치하기 전에 Ngrok URL에 접근할 수 있는지(예: 브라우저를 통해) 확인하세요. URL에 접근할 수 없다면 OS가 파일을 찾지 못해 handoff가 동작하지 않습니다.

`npx expo run:ios`와 Xcode는 둘 다 associated domains가 설정되어 있을 때 앱에 codesign을 수행하며, 이것은 handoff와 universal links가 동작하는 데 필요합니다.

Mac과 iPhone/iPad 사이의 Handoff는 Expo Go 앱에서는 지원되지 않습니다. 앱을 직접 빌드해 디바이스에 설치해야 합니다.

**iPhone의 App Switcher에서 Safari icon이 보인다면**, 이는 handoff가 동작하지 않는다는 뜻입니다.

-   네이티브로 handoff를 테스트할 때 `?mode=developer` suffix를 사용하지 않는지 확인하세요.
-   로컬 개발 서버 URL도 사용하지 않도록 하세요. 예를 들어 `http://localhost:8081`은 유효한 app site association 링크로 사용할 수 없으므로, 실행 중인 Ngrok URL을 브라우저에서 열어 테스트하세요.
-   **public/.well-known/apple-app-site-association** 파일에 `activitycontinuation` 필드가 포함되어 있는지 확인하세요.
-   iOS 16.3.1 및 macOS 13.0(Ventura)에서는 `app.` 또는 `io.`로 시작하는 bundle identifier가 iOS task switcher에 native app을 표시하지 않는 경우가 있는 것을 확인했습니다. bundle identifier의 첫 부분은 `com.`을 사용하세요.

여러분의 **public/.well-known/apple-app-site-association**는 보안 URL(HTTPS)에서 제공되어야 합니다. development tunnel을 사용 중이라면 `EXPO_TUNNEL_SUBDOMAIN` environment variable을 사용해 development tunnel의 subdomain을 설정해야 합니다. universal links를 사용하려면 SSL이 필요하므로 개발 환경 테스트에서도 tunnel이 필요하며, Expo CLI는 `npx expo start --tunnel`을 실행해 이를 기본 지원합니다.

**ios/project/project.entitlements** 파일의 `com.apple.developer.associated-domains` key 아래를 확인하세요. 여기에 웹 서버/웹사이트와 동일한 domains가 들어 있어야 합니다. URL에는 protocol(`https://`)이나 추가 pathname, query parameters, fragments가 들어가면 안 됩니다.

### Still stuck

> 이 기능은 중요하지만 설정하기 매우 어렵습니다. Expo Router는 움직이는 많은 부분을 자동화하고, Expo CLI는 상당한 설정과 호스팅을 자동화합니다. 하지만 하드웨어 설정은 여전히 잘못 구성될 수 있습니다.

그래도 해결되지 않는다면 [Apple Docs](https://developer.apple.com/documentation/foundation/task_management/implementing_handoff_in_your_app)의 단계를 따라 문제를 디버깅해볼 수 있습니다. 다음 사항을 참고하세요:

-   "`NSUserActivity`의 인스턴스로 사용자 활동을 표현하기."는 Expo Head native module이 수행합니다.
-   "사용자가 앱에서 동작할 때 activity 인스턴스를 업데이트하기."는 내부에 `<meta property="expo:handoff" content="true" />` meta tag를 둔 `<Head />` 컴포넌트를 mount/render하는 방식으로 수행됩니다.
-   "다른 디바이스의 앱에서 Handoff 활동 받기."는 Expo Head native module의 [App Delegate Subscriber](/modules/appdelegate-subscribers)가 수행합니다. 이것은 native app으로 handoff할 때 올바른 route로 리디렉션하는 데 사용됩니다.

## Known issues

web에서 native로의 Handoff는 client-side routing을 지원하지 않습니다. 즉, App Switcher에 표시되는 URL은 링크를 클릭했을 때 또는 페이지를 새로고침했을 때 머물러 있던 페이지의 URL이 됩니다. 이것은 웹 플랫폼의 한계이며 Expo Router가 수정할 수 있는 문제가 아닙니다.
