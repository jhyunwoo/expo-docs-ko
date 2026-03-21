---
modificationDate: November 11, 2025
title: Expo 및 React Native 앱에서의 인증
description: Expo 프로젝트에서 인증을 설정하는 방법을 알아보세요.
---

# Expo 및 React Native 앱에서의 인증

Expo 프로젝트에서 인증을 설정하는 방법을 알아보세요.

인증은 현대적인 앱의 90~95퍼센트에서 핵심적인 부분입니다. 이 가이드는 Expo 앱에 인증을 구현하는 데 도움이 되도록 일반적인 방법, 패턴, 솔루션을 설명합니다.

> **TL;DR**: 인증은 어렵습니다. 복잡함을 건너뛰고 싶다면 바로 [인증 솔루션](/develop/authentication#auth-solutions) 섹션으로 이동해 바로 사용할 수 있는 솔루션을 확인하세요. 그렇지 않다면 계속 읽어 보세요.

인증을 구현하려면 단순히 클라이언트 측 코드를 작성하는 것 이상이 필요합니다. 서버 요청, 비밀번호 흐름, Google 또는 Apple 같은 서드파티 provider, 이메일 처리, OAuth 표준 등을 관리해야 합니다. 복잡해지는 데 오래 걸리지 않습니다.

인증 방법에는 여러 종류가 있습니다. 어떤 것은 단순하면서도 효과적이고, 어떤 것은 더 나은 사용자 경험을 제공하지만 더 많은 작업이 필요합니다. 가장 일반적인 접근 방식과 이를 구현하는 방법을 살펴보겠습니다.

## 내비게이션 인증 흐름

기본부터 시작해 봅시다. 어떤 인증 시스템이든 **공개 화면**(예: 로그인 또는 회원가입)과 **보호된 화면**(예: 홈 또는 프로필)을 분리해야 합니다. 내비게이션 수준에서는 결국 단순한 확인으로 귀결됩니다. 사용자가 인증되었는가?

시작할 때는 `isAuthenticated = true` 같은 하드코딩된 boolean 값으로 이를 시뮬레이션하고, 그 값을 기준으로 내비게이션 로직을 구성할 수 있습니다. 모든 것이 정상적으로 동작하면 실제 인증 흐름을 연결하면 됩니다.

Expo Router 사용하기

Expo Router v5에는 [보호된 라우트](/router/advanced/protected)가 도입되어, 사용자가 인증되지 않은 경우 특정 화면에 접근하지 못하게 합니다. 이 기능은 클라이언트 측 내비게이션에 잘 맞고 설정도 단순하게 만들어 줍니다.

이전 버전의 Expo Router를 사용 중이라면 대신 [redirects](/router/advanced/authentication-rewrites)를 사용할 수 있습니다. redirects도 같은 결과를 제공하지만 수동 구성이 조금 더 필요합니다. Expo Router v5에서도 이전 버전과의 호환성을 위해 계속 지원됩니다.

[Expo Router 보호된 라우트](https://www.youtube.com/watch?v=zHZjJDTTHJg) — Expo Router로 인증 흐름을 구현하는 방법을 알아보세요

React Navigation 사용하기

React Navigation을 사용 중이라면 내비게이션 로직 구조를 설명하는 유용한 [인증 흐름 가이드](https://reactnavigation.org/docs/auth-flow/)를 제공합니다. 여기에는 사용자의 인증 상태를 기준으로 한 [정적](https://reactnavigation.org/docs/auth-flow/?config=static#how-it-will-work) 접근 방식과 [동적](https://reactnavigation.org/docs/auth-flow/?config=dynamic#how-it-will-work) 접근 방식 예제가 모두 포함되어 있습니다.

Expo Router와 React Navigation 모두 사용자가 로그인했는지 여부에 따라 보호된 내비게이션을 구현할 수 있는 유연한 도구를 제공합니다.

## 이메일과 비밀번호

이메일과 비밀번호는 앱에 인증을 추가할 때 널리 사용되는 옵션입니다.

이 흐름을 사용자 친화적으로 만들려면 비밀번호를 잊어버린 사용자나 계정 접근 권한을 잃은 사용자가 복구할 수 있도록 비밀번호 찾기와 비밀번호 재설정 기능도 구현해야 합니다.

더 빠른 해결책을 원한다면 여러 서비스가 내장된 이메일 및 비밀번호 인증을 제공합니다. 예를 들어 [Clerk](/develop/authentication#clerk), [Supabase](/develop/authentication#supabase), [Cognito](/develop/authentication#cognito), [Firebase](/develop/authentication#firebase-auth), [Better Auth](/develop/authentication#better-auth)가 있습니다. 이들 대부분은 넉넉한 무료 요금제를 제공하지만, 앱이 빠르게 성장한다면 요금 체계를 미리 검토해 두는 것이 좋습니다.

이러한 서비스의 가장 큰 장점은 통합이 쉽다는 점입니다. 대개 문서가 명확하고, starter kit과 미리 만들어진 component를 제공해 시간을 절약해 줍니다.

보안 체크리스트(OWASP)와 스토어 심사 시 주의할 점

이 흐름을 직접 구축한다면 OWASP의 [Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-cheat-sheet)를 꼭 확인하세요. 비밀번호 길이, 암호화, 복구, 안전한 저장 등과 관련한 모범 사례가 정리되어 있습니다.

> 이메일과 비밀번호 인증을 추가하는 것만으로도 보통 App Store와 Play Store 심사를 통과하기에 충분합니다. 우선 이 방식으로 앱을 제출할 수 있습니다. "Sign in with Google"을 포함하면, "Sign in with Apple"도 함께 지원하지 않는 한 Apple이 앱을 거절할 수 있습니다. Google Play에서도 반대 방향으로 같은 규칙이 적용됩니다.

[Better Auth 예제](https://github.com/expo/examples/tree/master/with-better-auth) — Better Auth를 사용한 이메일 및 비밀번호 인증 예제입니다.

## 비밀번호 없는 로그인

비밀번호 없는 로그인은 사용자가 비밀번호를 만들거나 기억할 필요를 없애 줍니다. 대신 가입 시 이메일 주소나 전화번호를 제공합니다. 그러면 앱이 [magic link](https://auth0.com/docs/authenticate/passwordless/authentication-methods/email-magic-link#classic-login-flow-with-magic-links) 또는 [일회용 패스코드(OTP)](https://en.wikipedia.org/wiki/One-time_password)를 사용자에게 전송합니다. 대부분의 사용자에게 더 부드러운 경험을 제공하고 온보딩 과정의 마찰을 줄여 줍니다.

Magic Links

magic link를 사용하면 사용자는 이메일로 앱으로 다시 돌아오게 하는 링크를 받습니다. 모든 것이 올바르게 작동하면 세션이 검증되고 설정됩니다.

여기서 중요한 세부 사항은 [deep linking](/linking/into-your-app)입니다. 사용자가 이메일을 확인하기 위해 앱을 떠나기 때문에, 링크는 앱을 열고 올바른 화면으로 라우팅해야 합니다. deep linking이 실패하면 세션을 검증할 수 없고 로그인 흐름도 깨집니다.

Expo Router를 사용하고 있다면 deep linking은 대부분의 경우 자동으로 처리됩니다. 보통 magic link가 제대로 동작하도록 추가 구성을 할 필요가 없으므로 이 접근 방식을 더 쉽게 도입할 수 있습니다. 자세한 내용은 [앱으로 deep linking 하기](/linking/into-your-app)를 참고하세요.

[React Navigation](https://reactnavigation.org/)도 deep linking을 지원하지만 직접 구성해야 합니다. 자세한 내용은 [Deep Linking 가이드](https://reactnavigation.org/docs/deep-linking/)를 참고하세요.

일회용 패스코드(OTP)

magic link의 대안으로 이메일 또는 SMS를 통해 일회용 패스코드를 보낼 수 있습니다. 사용자는 링크를 클릭하는 대신 코드를 복사한 뒤 직접 앱으로 돌아와 입력합니다. 코드는 만료되기 전에 정해진 시간 안에 사용되어야 합니다.

이 방식에는 deep linking이 필요하지 않습니다. 사용자가 흐름을 직접 제어하며 스스로 앱으로 돌아와야 합니다.

다행히 최신 Android와 iOS 버전은 수신 메시지의 패스코드를 자동으로 감지합니다. 덕분에 키보드 위에 자동 완성 제안이 나타나 사용자가 한 번의 탭으로 코드를 입력할 수 있습니다. 이 기능이 잘 동작하면 경험은 매우 자연스럽습니다.

> Magic link와 패스코드는 모두 Google Play Store와 Apple App Store 심사에서 유효한 인증 방법입니다. 이 둘 중 하나만 제공하는 상태로 앱을 제출해도 승인을 받을 수 있으며, 이후에 소셜 로그인이나 OAuth 로그인 옵션을 추가하면 됩니다.

## OAuth 2.0

Google, Apple, GitHub 같은 서비스의 기존 계정으로 사용자가 로그인할 수 있게 하려면 OAuth 2.0을 사용할 수 있습니다.

[OAuth 2.0](https://oauth.net/2)은 널리 사용되는 안전한 프로토콜로, 앱이 비밀번호를 직접 다루지 않고도 다른 서비스의 사용자 정보에 접근할 수 있게 해 줍니다. 사용자는 한 번의 탭으로 로그인할 수 있어 시간을 절약하고 신뢰를 높이며, 비밀번호를 관리할 필요도 줄어듭니다.

> OAuth 흐름은 복잡할 수 있습니다. 간단한 통합을 원한다면 대부분의 provider가 모든 과정을 처리해 주는 SDK나 서비스를 제공합니다. 자세한 내용은 [인증 솔루션](/develop/authentication#auth-solutions) 섹션에서 확인할 수 있습니다.

OAuth가 내부적으로 어떻게 동작하는지 이해하고 싶거나 완전한 제어권이 필요하다면, 다음 섹션에서는 Expo를 사용해 전체 OAuth 흐름을 직접 구현하는 방법을 보여 줍니다.

### OAuth 동작 방식

OAuth는 안전한 중개자 역할을 하는 authorization server를 도입하는 방식으로 동작합니다. 사용자는 앱에 비밀번호를 제공하는 대신 이 서버를 통해 로그인하고, 특정 데이터(예: 이름이나 이메일)에 대한 접근 권한을 승인합니다. 그러면 서버는 임시 코드를 발급하고, 앱은 그 코드를 안전한 access token으로 교환할 수 있습니다.

이 다이어그램에서 'client'는 단순히 애플리케이션을 의미하며, 서버, 데스크톱, 모바일 기기, 기타 플랫폼 어디에서 실행되는지와 같은 구체적인 구현 세부 사항을 뜻하지는 않습니다.

이 패턴을 이해하면 어떤 provider에도 적용할 수 있습니다. Google, Apple, GitHub를 위한 설정도 모두 같은 일반적인 단계를 따릅니다.

### Expo API Routes로 custom OAuth 구현하기

앞의 다이어그램은 OAuth 흐름의 상위 수준 개요를 보여 줍니다. 그러나 사용자가 authorization grant를 제공할 때 client가 이를 얻는 권장 방식은 authorization server를 중개자로 사용하는 것이며, 바로 이것을 Expo API Routes로 구축할 수 있습니다.

다음 다이어그램은 이 흐름을 더 자세히 보여 줍니다:

Expo를 사용하면 다음을 통해 앱 안에서 전체 OAuth 흐름을 직접 구현할 수 있습니다:

[Expo Router](/router/introduction)

[Expo Router API Routes](/router/web/api-routes)

[Expo AuthSession](/versions/latest/sdk/auth-session)

일부 provider는 앱 내부에서 직접 로그인 흐름을 처리할 수 있는 네이티브 API를 제공합니다. Google은 Android에서 네이티브 Sign in with Google 경험을 제공합니다. 네이티브 구현을 원한다면 [Google authentication guide](/guides/google-authentication)를 참고하세요. Apple은 iOS에서 네이티브 bottom sheet와 Face ID를 사용하는 Sign in with Apple을 제공합니다. [`expo-apple-authentication`](/versions/latest/sdk/apple-authentication) 레퍼런스를 참고하세요.

다음 설정은 Android, iOS, web 전반에서 로그인 경험을 완전히 제어할 수 있게 해 줍니다.

Expo API Routes란?

[Expo Router API Routes](/router/web/api-routes)를 사용하면 Expo 앱 안에서 직접 서버 측 로직을 작성할 수 있습니다. Express나 Next.js backend처럼 요청을 처리하는 함수를 정의할 수 있으며, 별도의 외부 서버가 필요하지 않습니다.

이를 통해 [authorization code exchange](https://www.oauth.com/oauth2-servers/pkce/authorization-code-exchange)처럼 인증 흐름의 민감한 부분을 앱 안에서 안전하게 처리할 수 있습니다. 이 route들은 서버에서 실행되므로 secret 관리, JWT 발급, token 검증을 안전하게 수행할 수 있습니다.

> 본질적으로는 자신의 애플리케이션에 한정된 경량 custom auth server를, Expo 프로젝트만으로 구축하는 셈입니다.

Expo AuthSession이란?

[Expo AuthSession](/versions/latest/sdk/auth-session)은 OAuth 로그인 흐름을 시작하기 위해 웹 브라우저나 네이티브 modal을 열 수 있게 도와주는 클라이언트 측 package입니다. redirect를 처리하고 authorization 응답을 파싱한 다음, 사용자를 앱으로 다시 되돌려 줍니다.

이 도구는 흐름을 시작하고 사용자가 접근을 승인한 뒤 API Route와 통신합니다. 자세한 내용은 [OAuth 또는 OpenID provider를 사용한 인증](/guides/authentication)을 참고하세요.

이 설정을 사용하면 다음을 할 수 있습니다:

-   AuthSession으로 로그인 흐름 시작하기
-   API Route에서 auth code 받기
-   토큰으로 코드를 안전하게 교환하기
-   자신만의 로직으로 custom JWT 생성하기
-   그 토큰을 client로 반환하기
-   쿠키(Web) 또는 JWT(Native)로 세션 저장하기
-   EAS Hosting을 사용해 즉시 배포하기(무료로 시작 가능)

다음 튜토리얼에서는 Android, iOS, web에서 OAuth를 구현하는 방법과 custom JWT 생성 및 검증, 세션 관리, API route 보호 방법을 다룹니다. 이 흐름이 처음이라면 Google 튜토리얼부터 시작하는 것을 권장합니다.

[Expo OAuth로 Google Sign-In](https://www.youtube.com/watch?v=V2YdhR1hVNw) — Expo Router API Routes를 사용해 Google Sign-In을 구현하는 방법을 알아보세요

[Expo로 Sign in with Apple 구현하기](https://www.youtube.com/watch?v=tqxTijhYhp8) — Expo에서 Sign in with Apple을 구현하는 방법을 알아보세요

OAuth 이후 세션 관리하기

OAuth 흐름을 안전하게 처리하는 것은 시작에 불과합니다. 사용자가 인증된 뒤에는 세션을 어떻게 저장하고, 복원하고, 검증할지 생각해야 합니다.

여기에는 다음이 포함됩니다:

-   클라이언트에 세션을 안전하게 저장하기
-   앱이 다시 시작될 때 세션 복원하기
-   인증된 사용자만 접근할 수 있도록 API route 보호하기

전통적으로 web에서는 세션 저장에 [cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies#what_cookies_are_used_for)를 사용하고, 네이티브 애플리케이션에서는 [JSON Web Tokens (JWTs)](https://en.wikipedia.org/wiki/JSON_Web_Token)를 흔히 사용합니다.

위 튜토리얼은 이 부분을 정확히 어떻게 처리하는지 보여 줍니다. Google이나 Apple 같은 provider로부터 ID token을 받은 뒤, Expo API Routes를 사용해 서버에서 custom JWT를 생성합니다.

이렇게 하면 세션에 대해 다음과 같은 완전한 제어권을 가질 수 있습니다:

-   provider 전반에서 일관된 필드를 사용해 payload 구조화하기
-   만료 시간 사용자 지정하기
-   서버가 나중에 검증할 수 있도록 secret key로 token 서명하기

토큰이 생성되면:

-   Android 및 iOS 앱에서는 [`expo-secure-store`](/versions/latest/sdk/securestore)를 사용해 안전하게 저장할 수 있습니다
-   web 앱에서는 세션 유지를 위해 secure cookie로 설정할 수 있습니다

모든 요청마다 token이 서버로 다시 전송되고, 서버는 서명을 검증하고 만료 여부를 확인합니다. 모든 검사가 통과하면 요청 처리를 계속합니다.

이 세션 모델은 backend를 stateless하고 확장 가능하며 안전하게 유지해 주고, 플랫폼 전반에서 일관되게 동작합니다.

이 모든 내용은 위에 연결된 동영상 튜토리얼에서 다루며, 다음 항목을 포함합니다:

-   custom JWT 생성 및 검증하기
-   Secure Store와 cookies를 사용한 세션 저장 처리하기
-   인증 로직으로 API route 보호하기

## 인증 솔루션

전체 인증 시스템을 처음부터 직접 만들고 싶지 않다면, Expo를 훌륭하게 지원하는 여러 서비스가 내장 솔루션을 제공합니다. 여기 가장 인기 있는 옵션 몇 가지를 소개합니다:

Better Auth

[BetterAuth](https://www.better-auth.com/docs/integrations/expo)는 개발자를 위해 만들어진 현대적인 오픈소스 인증 provider입니다. Expo와 자연스럽게 통합되며, 완전한 제어를 위해 [Expo API Routes](https://www.better-auth.com/docs/integrations/expo)와 함께 사용하는 방법을 설명하는 가이드도 제공합니다. 어떤 provider와도 잘 동작하고 EAS Hosting으로도 쉽게 배포할 수 있습니다.

Clerk

[Clerk](https://clerk.com/expo-authentication)는 강력하고 기능이 풍부한 인증 서비스로, Expo 지원이 매우 뛰어납니다. 이메일/비밀번호, passcode, magic link, OAuth provider, 심지어 passkey까지 포함합니다. 통합의 많은 부분을 처리해 주는 네이티브 Expo module도 제공합니다.

Supabase

[Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)는 hosted backend 서비스 전체를 제공하는 플랫폼으로, 어떤 OAuth provider와도 연동되는 내장 인증 서비스를 포함합니다. Expo 앱과 잘 통합되며 이메일, magic link 등도 지원합니다.

Cognito

[AWS Cognito](https://medium.com/@juliuscecilia33/aws-cognito-and-react-native-bf23ef7fea23)는 사용자 pool과 identity를 관리하기 위한 Amazon의 솔루션입니다. 다른 AWS 서비스와 자연스럽게 연결되며 AWS Amplify를 사용해 Expo 앱에 통합할 수 있습니다. 더 많은 구성이 필요하지만 강력하고 확장성이 좋습니다.

Firebase Auth

[Firebase Authentication](https://rnfirebase.io/auth/usage)은 Google의 인증 플랫폼으로, 이메일, magic link, OAuth provider를 지원합니다. Expo development build와 호환되는 [`react-native-firebase`](https://github.com/invertase/react-native-firebase)를 통해 React Native에서 사용할 수 있습니다.

## 최신 방식

작동하는 인증 시스템을 갖추고 나면 생체 인증과 passkey 같은 선택적이지만 강력한 기능을 추가해 사용자 경험을 향상시킬 수 있습니다. 이러한 기능은 로그인 흐름에 편의성, 신뢰, 속도를 더해 줍니다.

생체 인증

Face ID나 Touch ID 같은 생체 인증은 유효한 세션이 설정된 이후 앱 잠금 해제나 본인 확인에 사용할 수 있습니다. 이것만으로 독립적인 인증 방법이 되지는 않지만, 재인증을 더 빠르고 안전하게 만들어 주는 로컬 게이트 역할을 합니다.

React Native는 [`expo-local-authentication`](/versions/latest/sdk/local-authentication)이나 [`react-native-biometrics`](https://github.com/SelfLender/react-native-biometrics) 같은 라이브러리를 통해 생체 인증 API에 접근할 수 있게 해 줍니다.

Passkeys

[Passkeys](https://safety.google/authentication/passkey)는 앱과 웹사이트에 로그인하는 새로운 비밀번호 없는 방식입니다. Apple, Google, Microsoft가 지원하며, 비밀번호 없이 사용자를 인증하기 위해 플랫폼 수준의 암호화와 생체 인증을 사용합니다.

passkey는 매끄럽고 안전한 경험을 제공하지만, 등록하기 전에 사용자가 이미 인증되어 있어야 합니다. 또한 이를 대신 처리해 주는 provider를 사용하지 않는다면 추가 구성이 필요합니다.

-   React Native passkey 지원: [`react-native-passkeys`](https://github.com/peterferguson/react-native-passkeys)
-   Clerk를 사용한 네이티브 passkey 지원: [Clerk Passkeys for Expo](https://clerk.com/docs/references/expo/passkeys)

## 권장 사항

이 가이드는 기본 이메일/비밀번호 흐름부터 완전히 custom한 OAuth 구현, 세션 관리, 생체 인증과 passkey 같은 최신 방식까지 폭넓게 다룹니다. 이 모든 것을 한 번에 구현할 필요는 없습니다.

많은 경우에는 단순하게 시작하는 것이 가장 좋습니다. magic link나 일회용 패스코드를 이용한 이메일 인증 같은 것으로 앱을 먼저 출시하는 것만으로도 App Store 심사를 통과하고 실제 사용자에게서 피드백을 받기 시작하기에 충분한 경우가 많습니다.

그렇지만 출시 첫날부터 많은 트래픽이 예상되거나, 여러 플랫폼에서 마찰이 적은 로그인 경험을 지원해야 하는 앱을 만들고 있다면 더 완전한 인증 흐름에 일찍 투자하는 것이 큰 차이를 만들 수 있습니다. 이는 사용자 온보딩, 신뢰, 유지율을 처음부터 개선하는 데 도움이 됩니다.

OAuth, 생체 인증, passkey 같은 최신 솔루션은 필수는 아니지만 핵심 시스템이 갖춰진 뒤에는 훌륭한 추가 기능이 될 수 있습니다.

핵심은 현재 필요에 맞는 인증을 구축하되, 제품과 함께 성장할 수 있을 만큼 유연성을 유지하는 것입니다.
