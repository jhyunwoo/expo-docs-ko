---
modificationDate: March 06, 2026
title: Firebase 사용하기
description: Firebase JS SDK와 React Native Firebase 라이브러리를 시작하고 사용하는 가이드입니다.
---

# Firebase 사용하기

Firebase JS SDK와 React Native Firebase 라이브러리를 시작하고 사용하는 가이드입니다.

[Firebase](https://firebase.google.com/)는 실시간 데이터베이스, 클라우드 스토리지, 인증, crash reporting, analytics 등 호스팅된 백엔드 서비스를 제공하는 Backend-as-a-Service(BaaS) 앱 개발 플랫폼입니다. Google의 인프라 위에 구축되어 있으며 자동으로 확장됩니다.

프로젝트에서 Firebase를 사용하는 방법은 두 가지가 있습니다:

-   [Firebase JS SDK](/guides/using-firebase#using-firebase-js-sdk) 사용
-   [React Native Firebase](/guides/using-firebase#using-react-native-firebase) 사용

React Native는 JS SDK와 native SDK를 모두 지원합니다. 아래 섹션에서는 어떤 경우에 어떤 SDK를 사용해야 하는지와, Expo 프로젝트에서 Firebase를 사용하기 위해 필요한 모든 설정 단계를 안내합니다.

## Prerequisites

계속하기 전에 [Firebase console](https://console.firebase.google.com/)을 사용해 새 Firebase 프로젝트를 만들었거나 기존 프로젝트가 있는지 확인하세요.

## Using Firebase JS SDK

[Firebase JS SDK](https://firebase.google.com/docs/web/setup)는 프로젝트에서 Firebase 서비스와 상호작용할 수 있게 해주는 JavaScript 라이브러리입니다. React Native 앱에서 [Authentication](https://firebase.google.com/docs/auth), [Firestore](https://firebase.google.com/docs/firestore), [Realtime Database](https://firebase.google.com/docs/database), [Storage](https://firebase.google.com/docs/storage) 같은 서비스를 지원합니다.

### When to use Firebase JS SDK

다음과 같은 경우 Firebase JS SDK 사용을 고려할 수 있습니다:

-   앱에서 Authentication, Firestore, Realtime Database, Storage 같은 Firebase 서비스를 사용하고 싶고 [**Expo Go**](/get-started/set-up-your-environment)로 앱을 개발하고 싶을 때.
-   Firebase 서비스를 빠르게 시작하고 싶을 때.
-   Android, iOS, 웹을 위한 범용 앱을 만들고 싶을 때.

#### Caveats

Firebase JS SDK는 모바일 앱용 모든 서비스를 지원하지는 않습니다. 예를 들어 Analytics, Dynamic Links, Crashlytics 같은 서비스는 지원되지 않습니다. 이 서비스들을 사용하려면 [React Native Firebase](/guides/using-firebase#using-react-native-firebase) 섹션을 참고하세요.

### Firebase JS SDK 설치 및 초기화

> Expo SDK 53 이상은 `firebase@^12.0.0`만 지원합니다. 이보다 이전 버전은 ES module resolution 오류를 일으킵니다.

#### SDK 설치하기

[Expo 프로젝트](/get-started/create-a-project)를 만든 뒤, 다음 명령으로 Firebase JS SDK를 설치할 수 있습니다:

```sh
npx expo install firebase
```

#### 프로젝트에서 SDK 초기화하기

Expo 프로젝트에서 Firebase 인스턴스를 초기화하려면 config 객체를 만들고 이를 `firebase/app` 모듈에서 import한 `initializeApp()` 메서드에 전달해야 합니다.

config 객체에는 API key와 다른 고유 식별자가 필요합니다. 이 값들을 얻으려면 Firebase 프로젝트에서 웹 앱을 등록해야 합니다. 해당 절차는 [Firebase documentation](https://firebase.google.com/docs/web/setup#register-app)에서 확인할 수 있습니다.

API key와 다른 식별자를 확보했다면, 프로젝트 루트 디렉터리나 설정 파일을 보관하는 다른 디렉터리에 새 **firebaseConfig.js** 파일을 만들고 다음 코드 조각을 붙여 넣을 수 있습니다.

```js
import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
// import {...} from 'firebase/auth';
// import {...} from 'firebase/database';
// import {...} from 'firebase/firestore';
// import {...} from 'firebase/functions';
// import {...} from 'firebase/storage';

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'api-key',
  authDomain: 'project-id.firebaseapp.com',
  databaseURL: 'https://project-id.firebaseio.com',
  projectId: 'project-id',
  storageBucket: 'project-id.appspot.com',
  messagingSenderId: 'sender-id',
  appId: 'app-id',
  measurementId: 'G-measurement-id',
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
```

Firebase JS SDK를 사용하기 위해 다른 plugin이나 설정을 추가로 설치할 필요는 없습니다.

Firebase 버전 9 이상은 modular API를 제공합니다. 사용하려는 서비스를 `firebase` 패키지에서 직접 import할 수 있습니다. 예를 들어 프로젝트에서 authentication 서비스를 사용하고 싶다면 `firebase/auth` 패키지에서 `auth` 모듈을 import하면 됩니다.

> **문제 해결 팁:** Firebase JS SDK에서 authentication persistence 관련 이슈가 있다면, [새로고침 사이에서도 사용자가 로그인 상태를 유지하도록 persistence를 설정하는 가이드](https://expo.fyi/firebase-js-auth-setup)를 참고하세요.

### Next steps

[Authentication](https://firebase.google.com/docs/auth/web/start) — 프로젝트에서 Authentication을 사용하는 방법에 대한 자세한 내용은 Firebase documentation을 참고하세요.

[Firestore](https://firebase.google.com/docs/firestore/quickstart) — 프로젝트에서 Firestore 데이터베이스를 사용하는 방법에 대한 자세한 내용은 Firebase documentation을 참고하세요.

[Realtime Database](https://firebase.google.com/docs/database) — 프로젝트에서 Realtime Database를 사용하는 방법에 대한 자세한 내용은 Firebase documentation을 참고하세요.

[Storage](https://firebase.google.com/docs/storage/web/start) — Storage를 사용하는 방법에 대한 자세한 내용은 Firebase documentation을 참고하세요.

[Firebase Storage example](https://github.com/expo/examples/tree/master/with-firebase-storage-upload) — 예제로 Expo 프로젝트에서 Firebase Storage를 사용하는 방법을 알아보세요.

[Managing API keys for Firebase projects](https://firebase.google.com/docs/projects/api-keys) — Firebase 프로젝트의 API Key와 고유 식별자 관리에 대한 자세한 내용을 참고하세요.

[Migrate from Expo Firebase packages to React Native Firebase](https://expo.fyi/firebase-migration-guide) — expo-firebase-analytics 또는 expo-firebase-recaptcha 패키지에서 React Native Firebase로 마이그레이션하는 방법에 대한 자세한 내용을 참고하세요.

## Using React Native Firebase

[React Native Firebase](https://rnfirebase.io/)는 Android와 iOS의 native SDK를 JavaScript API로 감싸서 native code 접근을 제공합니다. 각 Firebase 서비스는 프로젝트 의존성으로 추가할 수 있는 모듈 형태로 제공됩니다. 예를 들어 `auth` 모듈은 Firebase Authentication 서비스에 대한 접근을 제공합니다.

### When to use React Native Firebase

다음과 같은 경우 React Native Firebase 사용을 고려할 수 있습니다:

-   앱에서 [Dynamic Links](https://rnfirebase.io/screencasts/dynamic-links-overview), [Crashlytics](https://rnfirebase.io/crashlytics/usage) 등 Firebase JS SDK가 지원하지 않는 Firebase 서비스에 접근해야 할 때. native SDK가 제공하는 추가 기능에 대한 자세한 내용은 [React Native Firebase documentation](https://rnfirebase.io/faqs-and-tips#why-react-native-firebase-over-firebase-js-sdk)를 참고하세요.
-   앱에서 native SDK를 사용하고 싶을 때.
-   이미 React Native Firebase가 설정된 bare React Native 앱이 있고, Expo SDK를 사용하도록 마이그레이션 중일 때.
-   앱에서 [Firebase Analytics](https://rnfirebase.io/analytics/usage)를 사용하고 싶을 때.

Expo Firebase 패키지에서 마이그레이션 중인가요?

프로젝트가 이전에 `expo-firebase-analytics`와 `expo-firebase-recaptcha` 패키지를 사용하고 있었다면 React Native Firebase 라이브러리로 마이그레이션할 수 있습니다. 자세한 내용은 [Firebase migration guide](https://expo.fyi/firebase-migration-guide)를 참고하세요.

#### Caveats

React Native Firebase는 [custom native code가 필요하며 Expo Go에서는 사용할 수 없습니다](/workflow/customizing).

### React Native Firebase 설치 및 초기화

#### expo-dev-client 설치하기

React Native Firebase는 custom native code가 필요하므로, 프로젝트에 `expo-dev-client` 라이브러리를 설치해야 합니다. 이 라이브러리는 native code를 직접 작성하지 않고도 [Config plugins](/config-plugins/introduction)을 사용해 React Native Firebase에 필요한 native code를 설정할 수 있게 해줍니다.

[`expo-dev-client`](/develop/development-builds/create-a-build)를 설치하려면 프로젝트에서 다음 명령을 실행하세요:

```sh
npx expo install expo-dev-client
```

#### React Native Firebase 설치하기

React Native Firebase를 사용하려면 `@react-native-firebase/app` 모듈 설치가 필요합니다. 이 모듈은 다른 모든 모듈을 위한 핵심 기능을 제공합니다. 또한 config plugin을 사용해 프로젝트에 custom native code를 추가합니다. 다음 명령으로 설치할 수 있습니다:

```sh
npx expo install @react-native-firebase/app
```

**이 시점에서 반드시 [React Native Firebase documentation](https://rnfirebase.io/#managed-workflow)의 지침을 따라야 합니다.** 이 문서는 라이브러리로 프로젝트를 설정하는 데 필요한 모든 단계를 다룹니다.

프로젝트에서 React Native Firebase 라이브러리 설정을 마쳤다면, 다음 단계에서 프로젝트를 실행하는 방법을 배우기 위해 이 가이드로 돌아오세요.

#### 프로젝트 실행하기

**[EAS Build](/build/introduction)를 사용 중이라면 기기에 development build를 생성하고 설치할 수 있습니다.** development build를 만들기 전에 프로젝트를 로컬에서 실행할 필요는 없습니다. development build 생성에 대한 자세한 내용은 [installing a development build](/develop/development-builds/create-a-build) 섹션을 참고하세요.

프로젝트를 로컬에서 실행하나요?

프로젝트를 로컬에서 실행하려면 Android Studio와 Xcode가 둘 다 설치되고 머신에 설정되어 있어야 합니다. 자세한 내용은 [Local app development](/guides/local-app-development) 가이드를 참고하세요.

특정 React Native Firebase 모듈에 custom native 설정 단계가 필요하다면, 이를 [app config](/workflow/configuration) 파일에 `plugin`으로 추가해야 합니다. 그런 다음 프로젝트를 로컬에서 실행하려면 `npx expo run` 명령 전에 native 변경 사항을 적용하기 위해 `npx expo prebuild --clean` 명령을 실행하세요.

### Next steps

React Native Firebase 라이브러리 설정을 마친 뒤에는, Expo 프로젝트에서 이 라이브러리가 제공하는 어떤 모듈이든 사용할 수 있습니다.

[React Native Firebase documentation](https://rnfirebase.io/) — React Native Firebase의 특정 모듈을 설치하고 사용하는 방법에 대한 자세한 내용은 해당 문서를 확인하는 것을 권장합니다.
