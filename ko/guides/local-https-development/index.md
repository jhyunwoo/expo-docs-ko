---
modificationDate: February 26, 2026
title: 로컬 HTTPS 개발 사용하기
description: Expo 웹 앱을 위한 로컬 HTTPS를 설정하는 방법을 알아보세요.
---

# 로컬 HTTPS 개발 사용하기

Expo 웹 앱을 위한 로컬 HTTPS를 설정하는 방법을 알아보세요.

Expo 웹 앱을 로컬에서 개발할 때, 보안 브라우저 API를 테스트하려면 로컬 개발 환경에서 HTTPS를 사용해야 할 수 있습니다. 이 가이드는 Expo 웹 앱에 로컬 HTTPS를 설정하는 방법을 보여줍니다.

## 사전 요구 사항

이 가이드를 따르려면 머신에 다음 도구가 설치되어 있어야 합니다:

-   `mkcert`: development certificate를 만들기 위한 도구입니다. 설치 방법은 [`mkcert` GitHub 저장소](https://github.com/FiloSottile/mkcert#installation)를 참고하세요.

## 장점

-   **팀 확장성**: 같은 설정이 모든 사람에게 동일하게 동작합니다.
-   **인증 지원**: HTTP-Only Cookie와 secure context를 사용할 수 있습니다.
-   **프로덕션 환경과의 일치성**: 프로덕션 HTTPS 환경과 맞출 수 있습니다.
-   **공유 용이성**: 팀 전체에서 일관된 개발 URL을 사용할 수 있습니다.

## 프로젝트 설정

Expo 프로젝트를 생성하거나 해당 프로젝트 디렉터리로 이동하세요:

```sh
npx create-expo-app@latest example-app --template default@sdk-55
cd example-app
cd your-expo-project
```

Expo development server를 시작하세요:

```sh
npx expo start --web
```

앱은 `http://localhost:8081`에서 실행됩니다. 이 터미널 창은 열어 둔 상태로 유지하세요.

`mkcert`를 사용해 localhost용 certificate를 생성하세요. 프로젝트 루트 디렉터리에서 새 터미널 창을 열고 다음 명령을 실행하세요:

```sh
mkcert localhost
```

> **팁**: `mkcert` 설치 후에는 로컬 certificate authority(CA)를 설치하기 위해 `mkcert -install`도 실행해야 합니다.

이 명령은 프로젝트 루트 디렉터리 안에 두 개의 서명된 certificate 파일 `localhost.pem`(certificate)과 `localhost-key.pem`(private key)을 생성합니다.

프로젝트 루트 디렉터리에서 다음 명령을 실행해 proxy를 시작하세요:

```sh
npx local-ssl-proxy --source 443 --target 8081 --cert localhost.pem --key localhost-key.pem
```

> **팁**: [`local-ssl-proxy`](https://github.com/cameronhunter/local-ssl-proxy)는 포트 443의 HTTPS 트래픽을 포트 8081의 Expo dev server로 전달하는 proxy server를 만드는 도구입니다.

이렇게 하면 포트 443의 HTTPS 트래픽을 포트 8081의 Expo dev server로 전달하는 proxy가 생성됩니다.

브라우저에서 `https://localhost`를 열어 앱에 접근하세요. 이제 Expo 앱이 HTTPS로 실행됩니다.
