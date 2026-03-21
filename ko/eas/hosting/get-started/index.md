---
modificationDate: March 09, 2026
title: 첫 번째 Expo Router 및 React 앱 배포하기
description: Expo Router 및 React 앱을 EAS Hosting에 배포하는 방법을 알아보세요.
---

# 첫 번째 Expo Router 및 React 앱 배포하기

Expo Router 및 React 앱을 EAS Hosting에 배포하는 방법을 알아보세요.

EAS Hosting은 export된 Expo web build를 preview URL 또는 production URL에 배포할 수 있게 해 주는 React 호스팅 서비스입니다.

이 가이드는 첫 번째 웹 deployment를 만드는 과정을 단계별로 안내합니다.

[Watch: Expo Router web project 배포하기](https://www.youtube.com/watch?v=NaKsfWciJLo) — Expo Router web 프로젝트에 EAS Hosting을 설정하고, 첫 deployment를 만든 뒤, preview URL을 실행하는 과정을 확인해 보세요.

## 사전 요구 사항

Expo 사용자 계정

EAS Hosting은 EAS 유료 사용자든 Free 플랜 사용자든 관계없이 Expo 계정이 있으면 누구나 사용할 수 있습니다. [expo.dev/signup](https://expo.dev/signup)에서 가입할 수 있습니다.

유료 구독자는 더 많은 deployment를 만들 수 있고, 더 많은 bandwidth, storage, requests를 사용할 수 있으며, 커스텀 도메인도 설정할 수 있습니다. 서로 다른 플랜과 혜택에 대한 자세한 내용은 [EAS pricing](https://expo.dev/pricing#host)을 참고하세요.

Expo Router 웹 프로젝트

아직 프로젝트가 없나요? 괜찮습니다. 이 가이드와 함께 사용할 수 있는 "Hello world" 앱을 빠르고 쉽게 만들 수 있습니다.

다음 명령을 실행해 새 프로젝트를 만드세요.

```sh
npx create-expo-app@latest my-app --template default@sdk-55
```

## 최신 EAS CLI 설치하기

EAS CLI는 터미널에서 EAS 서비스와 상호작용할 때 사용하는 커맨드라인 앱입니다. 설치하려면 다음 명령을 실행하세요.

```sh
npm install --global eas-cli
```

위 명령으로 새 버전의 EAS CLI가 있는지도 확인할 수 있습니다. 항상 최신 버전을 유지하는 것을 권장합니다.

> 전역 패키지 설치에는 `yarn`보다 `npm` 사용을 권장합니다. 대안으로 `npx eas-cli@latest`를 사용할 수도 있습니다. 문서에서 `eas`를 사용하라고 할 때는 그 대신 이 명령을 사용하면 됩니다.

## Expo 계정에 로그인하기

이미 Expo CLI를 사용해 Expo 계정에 로그인되어 있다면 이 섹션의 단계는 건너뛰어도 됩니다. 아직 로그인하지 않았다면 다음 명령을 실행하세요.

```sh
eas login
```

`eas whoami`를 실행해 로그인 여부를 확인할 수 있습니다.

## 프로젝트 준비하기

앱 config 파일의 [`expo.web.output`](/versions/latest/config/app#output)을 `single`, `static`, `server` 중 무엇으로 설정할지 결정하세요.

-   `single`: Expo 앱을 `index.html` 출력 하나만 가지는 single-page app으로 export합니다.
-   `static`: Expo 앱을 [정적 생성 웹 앱](/router/web/static-rendering)으로 export합니다.
-   `server`: 앱의 정적 페이지와 함께 [server functions](/guides/server-components#react-server-functions) 및 [API routes](/router/web/api-routes)를 지원합니다.

> 어떤 output 모드가 필요한지 확실하지 않아도 괜찮습니다. 이 값은 나중에 언제든 바꿔서 다시 배포할 수 있습니다.

### 앱 export하기

웹 프로젝트를 **dist** 디렉터리로 export해야 합니다. 이를 위해 다음 명령을 실행하세요.

```sh
npx expo export --platform web
```

> 배포하기 전마다 이 명령을 다시 실행해야 한다는 점을 기억하세요.

### 앱 배포하기

이제 웹사이트를 EAS Hosting에 게시하세요.

```sh
eas deploy
```

이 명령을 처음 실행하면 다음을 수행합니다.

1.  아직 연결하지 않았다면 EAS 프로젝트를 연결하라고 안내합니다.
2.  preview 서브도메인 이름을 선택하라고 묻습니다.

> **preview 서브도메인 이름**은 앱의 preview URL에 사용하는 접두사입니다. 예를 들어 preview 서브도메인 이름으로 `my-app`을 선택하면 preview URL은 `https://my-app--or1170q9ix.expo.app/`처럼 보이고, production URL은 `https://my-app.expo.app/`가 됩니다.

deployment가 완료되면 CLI는 배포된 앱에 접근할 수 있는 preview URL과 함께, EAS Dashboard의 deployment 세부 정보 링크를 출력합니다.
