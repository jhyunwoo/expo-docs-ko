---
modificationDate: March 09, 2026
title: Linking, Deep Links, Android App Links, iOS Universal Links 개요
description: Expo 앱에서 Linking과 Deep Links를 구현하기 위해 사용할 수 있는 리소스를 개괄적으로 살펴봅니다.
---

# Linking, Deep Links, Android App Links, iOS Universal Links 개요

Expo 앱에서 Linking과 Deep Links를 구현하기 위해 사용할 수 있는 리소스를 개괄적으로 살펴봅니다.

## Linking

Linking을 사용하면 앱이 들어오거나 나가는 URL과 상호작용할 수 있습니다. 이 과정에서 사용자는 단순히 앱을 열라는 안내를 받는 데 그치지 않고, 앱 내부의 특정 화면(route)으로 이동하게 됩니다.

[Watch: Setting up linking with Expo](https://www.youtube.com/watch?v=kNbEEYlFIPs) — 들어오고 나가는 URL을 처리할 수 있도록 Expo 앱에서 deep links, universal links, app links를 설정하세요.

### Linking 전략

Expo 앱에서 처리할 수 있는 Linking 전략은 여러 가지가 있습니다:

-   웹 도메인 링크를 사용해 앱으로 연결하기([universal linking](/linking/overview#universal-linking), `https` 또는 `http` scheme 사용)
-   커스텀 scheme을 사용해 다른 앱이나 웹사이트에서 앱으로 연결하기(deep links)
-   앱에서 다른 앱으로 연결하기(outgoing links)

> **Tip:** Expo Go에서 들어오는 링크 지원은 제한적입니다. 앱의 linking 전략을 테스트할 때는 [Development builds](/develop/development-builds/introduction)를 사용하는 것을 권장합니다.

## Universal linking

Android와 iOS는 모두 앱이 설치되어 있을 경우 웹 URL을 앱으로 라우팅하는 자체 시스템을 구현하고 있습니다. Android에서는 이를 App Links라고 부르고, iOS에서는 Universal Links라고 부릅니다. 두 시스템 모두의 전제 조건은, 도메인에 대한 제어 권한을 검증하는 파일을 호스팅할 수 있는 웹 도메인을 가지고 있어야 한다는 점입니다.

### Android App Links

Android App Links는 일반 HTTP 및 HTTPS scheme을 사용하고 Android 디바이스에만 적용된다는 점에서 [standard deep links](/linking/overview#linking-to-your-app-from-other-apps-or-websites)와 다릅니다.

이 링크 유형을 사용하면 사용자가 링크를 클릭할 때, 디바이스에 표시되는 대화상자에서 브라우저나 다른 핸들러 중 하나를 고르는 대신 앱이 항상 열리게 할 수 있습니다. 사용자의 디바이스에 앱이 설치되어 있지 않다면, 링크는 앱과 연결된 웹사이트로 이동합니다.

[Configure Android App Links](/linking/android-app-links) — 표준 웹 URL에서 intentFilters를 구성하고 양방향 연결을 설정하는 방법을 알아보세요. — intentFilters

### iOS Universal Links

iOS Universal Links는 일반 HTTP 및 HTTPS scheme을 사용하고 iOS 디바이스에만 적용된다는 점에서 [standard deep links](/linking/overview#linking-to-your-app-from-other-apps-or-websites)와 다릅니다.

이 링크 유형을 사용하면 사용자가 웹 도메인을 가리키는 HTTP(S) 링크를 클릭할 때 앱이 열리게 할 수 있습니다. 사용자의 디바이스에 앱이 설치되어 있지 않다면, 링크는 앱과 연결된 웹사이트로 이동합니다. 더 나아가 [Apple Smart Banner](/linking/ios-universal-links#apple-smart-banner)를 사용해 웹사이트 상단에 앱 열기를 유도하는 배너를 표시하도록 구성할 수 있습니다.

[Configure iOS Universal Links](/linking/ios-universal-links) — associatedDomains를 구성하고 양방향 연결을 설정하는 방법을 알아보세요. — associatedDomains

## 다른 앱이나 웹사이트에서 앱으로 연결하기

[Deep Links](https://en.wikipedia.org/wiki/Deep_linking)는 앱 또는 웹사이트 내부의 특정 URL 기반 콘텐츠를 가리키는 링크입니다.

예를 들어, 사용자가 상품 광고를 클릭하면 사용자의 디바이스에서 앱이 열리고 해당 상품의 상세 정보를 볼 수 있습니다. 사용자가 클릭한 이 상품 링크는 다음과 같은 형태일 수 있습니다(또는 JavaScript에서 `window.location.href`를 설정해 실행할 수도 있습니다):

```html
<a href="myapp://web-app.com/product">View Product</a>
```

이 링크는 세 부분으로 구성됩니다:

-   **Scheme**: 어떤 앱이 URL을 열어야 하는지 식별하는 URL scheme입니다(예: `myapp://`). 비표준 deep links에서는 `https` 또는 `http`일 수도 있습니다. http(s) 기반 deep links에는 [universal linking](/linking/overview#universal-linking)을 권장합니다.
-   **Host**: URL을 열어야 하는 앱의 도메인 이름입니다(예: `web-app.com`).
-   **Path**: 열어야 할 화면의 path입니다(예: `/product`). path가 지정되지 않으면 사용자는 앱의 홈 화면으로 이동합니다.

[Linking to your app](/linking/into-your-app) — 앱의 deep link를 만들기 위해 커스텀 URL scheme을 구성하는 방법을 알아보세요.

### Deep linking을 처리할 때 Expo Router 사용하기

위 Linking 전략 중 어떤 것이든 구현할 때는, 모든 화면에 대해 deep linking이 자동으로 활성화되므로 **Expo Router 사용을 권장합니다**.

**Benefits:**

-   [Expo Router](/router/introduction)의 `Link` component는 [다른 앱에 대한 URL schemes를 처리](/linking/into-other-apps#expo-router)하는 데 사용할 수 있습니다.
-   Android App Links와 iOS Universal Links는 앱 내부 링크를 위한 런타임 라우팅을 JavaScript에서 구성해야 합니다. Expo Router를 사용하면 모든 route에 대해 deep links가 자동으로 활성화되므로 런타임 라우팅을 따로 구성할 필요가 없습니다.
-   서드파티 deep links의 경우, 들어오는 링크를 처리하고 navigation events를 보내기 위해 기본 linking 동작을 재정의할 수 있습니다. 자세한 내용은 [Customizing links](/router/advanced/native-intent)를 참고하세요.

## 앱에서 다른 앱으로 연결하기

앱에서 다른 앱으로 연결하는 것은 대상 앱의 URL scheme을 기반으로 한 URL을 사용해 이뤄집니다. 이 **URL scheme**을 사용하면 해당 네이티브 앱 내부의 리소스를 참조할 수 있습니다.

앱은 `https`와 `http`를 포함한 기본 앱용 [common URL scheme](/linking/into-other-apps#common-url-schemes)을 사용할 수 있으며(Chrome, Safari 같은 웹 브라우저에서 흔히 사용됩니다), JavaScript를 사용해 해당 네이티브 앱을 실행하는 URL을 호출할 수 있습니다.

[Linking into other apps](/linking/into-other-apps) — 앱에서 다른 앱으로 연결하기 위해 common URL schemes와 custom URL schemes를 처리하는 방법을 알아보세요.
