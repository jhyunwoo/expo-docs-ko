---
modificationDate: January 06, 2026
title: Clerk 사용하기
description: Expo 및 React Native 프로젝트에 Clerk authentication을 통합하는 방법을 알아보세요.
---

# Clerk 사용하기

Expo 및 React Native 프로젝트에 Clerk authentication을 통합하는 방법을 알아보세요.

[Clerk](https://clerk.com/)는 직접 auth backend를 만들지 않고도 회원가입, 로그인, 계정 관리를 추가할 수 있게 도와주는 full stack authentication 및 사용자 관리 플랫폼입니다. 여러 authentication 전략, session 관리, multi-tenant 앱을 위한 organization을 지원합니다.

Clerk는 hook, UI, control component를 제공하므로 완전히 커스텀한 authentication 화면을 구축할 수 있습니다. 이를 `expo-secure-store`와 함께 사용해 기기 내 session token을 암호화 상태로 유지하고, 프로젝트의 provider와 policy를 Clerk dashboard에서 설정할 수 있습니다.

> **참고:** Clerk의 [prebuilt UI components](https://clerk.com/docs/expo/reference/components/overview)는 웹에서만 사용할 수 있습니다. native 플랫폼에서는 Clerk가 custom flow를 구축하는 방식을 권장합니다.

## Features

-   **Authentication flows:** 이메일 인증 코드, magic link, 비밀번호, 소셜 provider(20개 이상), passkey, 전화번호 인증, SAML, OpenID Connect, Web3(MetaMask), 그리고 multi-factor authentication용 authenticator app을 통한 회원가입 및 로그인.
-   **Session management:** [`expo-secure-store`](/versions/latest/sdk/secure-store)를 사용한 안전한 token 처리.
-   **User management:** multi-tenant 앱을 위한 프로필 데이터, 계정 설정, organization 멤버십.

## Get started

시작하려면 Clerk 문서의 안내를 따르세요:

[Clerk Expo quickstart](https://clerk.com/docs/expo/getting-started/quickstart) — Expo SDK 설치, secure token 저장소 설정, 로그인 및 회원가입 흐름 구축을 위한 공식 quickstart를 따라가세요.
