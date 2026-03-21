---
modificationDate: November 03, 2025
title: Supabase 사용하기
description: Supabase를 사용해 React Native 앱에 Postgres 데이터베이스와 사용자 인증을 추가하세요.
---

# Supabase 사용하기

Supabase를 사용해 React Native 앱에 Postgres 데이터베이스와 사용자 인증을 추가하세요.

[Supabase](https://supabase.com/?utm_source=expo&utm_medium=referral&utm_term=expo-react-native)는 Postgres 데이터베이스, 사용자 인증, 파일 저장소, edge functions, 실시간 동기화, 벡터 및 AI 툴킷 같은 호스팅 백엔드 서비스를 제공하는 Backend-as-a-Service(BaaS) 앱 개발 플랫폼입니다. Google의 Firebase를 대체할 수 있는 오픈 소스 대안이기도 합니다.

Supabase는 데이터베이스에서 자동으로 [REST API를 생성](https://supabase.com/docs/guides/api?utm_source=expo&utm_medium=referral&utm_term=expo-react-native)하고, 데이터를 보호하기 위해 [row level security (RLS)](https://supabase.com/docs/guides/auth/row-level-security?utm_source=expo&utm_medium=referral&utm_term=expo-react-native)라는 개념을 사용합니다. 덕분에 서버를 거치지 않고도 React Native 애플리케이션에서 직접 데이터베이스와 상호작용할 수 있습니다.

Supabase는 REST API와 상호작용하기 위한 TypeScript 클라이언트 라이브러리인 [`supabase-js`](https://supabase.com/docs/reference/javascript/introduction?utm_source=expo&utm_medium=referral&utm_term=expo-react-native)를 제공합니다. 또는 Supabase가 [GraphQL API](https://supabase.com/docs/guides/database/extensions/pg_graphql?utm_source=expo&utm_medium=referral&utm_term=expo-react-native)도 노출하므로, 원한다면 [Apollo Client](https://supabase.github.io/pg_graphql/usage_with_apollo/) 같은 선호하는 GraphQL 클라이언트를 사용할 수도 있습니다.

## 사전 준비

[database.new](https://database.new?utm_source=expo&utm_medium=referral&utm_term=expo-react-native)로 이동해 새 Supabase 프로젝트를 생성하세요.

### API 키 가져오기

API settings에서 **Project URL**을, API Keys에서 **Publishable key**를 가져오세요:

1.  Dashboard에서 [API Settings](https://supabase.com/dashboard/project/_/settings/api) 페이지로 이동합니다.
2.  이 페이지에서 Project `URL`과 `service_role` 키를 찾습니다.
3.  그런 다음 [API Keys](https://supabase.com/dashboard/project/_/settings/api-keys)로 이동합니다.
4.  API Keys 탭 아래에서 Project **Publishable key**를 찾습니다.

## Supabase TypeScript SDK 사용하기

[`supabase-js`](https://supabase.com/docs/reference/javascript/introduction?utm_source=expo&utm_medium=referral&utm_term=expo-react-native)를 사용하는 것은 Supabase 스택의 전체 기능을 활용하는 가장 편리한 방법입니다. 데이터베이스, auth, realtime, storage, edge functions 등 서로 다른 서비스를 하나로 편리하게 묶어 주기 때문입니다.

### Supabase TypeScript SDK 설치 및 초기화

[Expo 프로젝트](/get-started/create-a-project)를 만든 후, 다음 명령어로 `@supabase/supabase-js`와 필요한 의존성을 설치하세요:

```sh
npx expo install @supabase/supabase-js expo-sqlite
```

Supabase 클라이언트(`@supabase/supabase-js`)를 초기화할 helper 파일을 만드세요. [앞에서](/guides/using-supabase#get-the-api-keys) 복사한 API URL과 `Publishable` 키가 필요합니다. Supabase는 Database에 [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security?utm_source=expo&utm_medium=referral&utm_term=expo-react-native)가 활성화되어 있으므로, 이 변수들은 Expo 앱에 노출되어도 안전합니다.

```ts
import 'expo-sqlite/localStorage/install';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = YOUR_REACT_NATIVE_SUPABASE_URL;
const supabasePublishableKey = YOUR_REACT_NATIVE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

이제 애플리케이션 전반에서 `import { supabase } from '/utils/supabase'`를 사용해 Supabase의 전체 기능을 활용할 수 있습니다.

## 다음 단계

[사용자 관리 앱 만들기](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native?utm_source=expo&utm_medium=referral&utm_term=expo-react-native) — 이 quickstart guide에서 Supabase Auth와 Database를 함께 사용하는 방법을 배워보세요.

[Apple로 로그인](https://supabase.com/docs/guides/auth/social-login/auth-apple?platform=react-native&utm_source=expo&utm_medium=referral&utm_term=expo-react-native) — Supabase Auth는 웹과 iOS, macOS, watchOS, tvOS용 네이티브 앱에서 Sign in with Apple을 지원합니다.

[Google로 로그인](https://supabase.com/docs/guides/auth/social-login/auth-google?platform=react-native&utm_source=expo&utm_medium=referral&utm_term=expo-react-native) — Supabase Auth는 웹, 네이티브 Android 애플리케이션, Chrome 확장에서 Sign in with Google을 지원합니다.

[OAuth 및 Magic Links를 위한 Deep Linking](https://supabase.com/docs/guides/auth/native-mobile-deep-linking?utm_source=expo&utm_medium=referral&utm_term=expo-react-native) — 네이티브 모바일 애플리케이션에서 OAuth를 수행하거나 magic link 이메일을 보낼 때 Android와 iOS 애플리케이션용 deep linking을 설정하는 방법을 알아보세요.

[WatermelonDB를 사용한 Offline-first React Native Apps](https://supabase.com/blog/react-native-offline-first-watermelon-db?utm_source=expo&utm_medium=referral&utm_term=expo-react-native) — 데이터를 로컬에 저장하고 WatermelonDB를 사용해 Postgres와 동기화하는 방법을 배워보세요.

[Supabase Storage를 사용한 React Native 파일 업로드](https://supabase.com/blog/react-native-storage?utm_source=expo&utm_medium=referral&utm_term=expo-react-native) — React Native 앱에서 인증과 파일 업로드를 구현하는 방법을 배워보세요.
