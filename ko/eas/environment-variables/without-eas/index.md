---
modificationDate: February 24, 2026
title: EAS 없이 Environment variables 사용하기
description: Expo 및 React Native 프로젝트에서 EAS 없이 environment variables를 관리하는 방법을 알아보세요.
---

# EAS 없이 Environment variables 사용하기

Expo 및 React Native 프로젝트에서 EAS 없이 environment variables를 관리하는 방법을 알아보세요.

Cloud build와 update에서는 [EAS Environment Variables](/eas/environment-variables)를 사용하는 것이 environment variables를 관리하는 권장 방식이지만, 여전히 로컬이나 다른 도구와 함께 작업할 수 있습니다.

## EAS 없이 environment variables 관리하기

EAS 없이 environment variables를 관리하려면 [`dotenv`](https://www.npmjs.com/package/dotenv) 같은 도구(Node 기반 loader)나 environment variables를 주입해 주는 [Doppler](https://www.doppler.com/) 같은 서비스를 사용할 수 있습니다. 이러한 유틸리티를 사용하면 environment variables를 저장할 수 있는 **.env** 파일을 만들 수 있습니다.

> **참고:** EAS 없이 environment variables를 관리하는 경우 비밀 정보를 **.env** 파일에 커밋하지 마세요.

## Environment variables가 로드되는 방식

**.env** 파일을 만든 뒤에는 해당 파일이 **.gitignore** 또는 **.easignore** 파일에 포함되어 있지 않은지 확인해야 합니다. 그러면 `eas build`, `eas update` 같은 EAS 명령이 이 파일을 사용할 수 있습니다.

**.env** 파일은 [표준 **.env** 파일](https://github.com/bkeepers/dotenv/blob/c6e583a/README.md#what-other-env-files-can-i-use) 해석 순서에 따라 로드된 다음, 코드 안의 `process.env.EXPO_PUBLIC_[VARIABLE_NAME]` 참조를 **.env** 파일에 설정된 대응 값으로 모두 치환합니다. 보안상의 이유로 **node_modules** 디렉터리 내부의 코드는 영향을 받지 않습니다.

[Reading environment variables from .env files](/guides/environment-variables#reading-environment-variables-from-env-files) — 자세한 내용은 Expo CLI에서 .env 파일로부터 environment variables를 읽는 방법을 참고하세요.

## EAS Hosting과 함께 .env 파일 사용하기

EAS Hosting에서 **.env** 파일을 사용할 때 `EXPO_PUBLIC_` 접두사가 붙은 environment variables는 client-side 코드와 server-side 코드 모두에서 사용할 수 있습니다. `EXPO_PUBLIC_` 접두사가 없는 변수는 server-side 코드에서만 사용할 수 있습니다.

[Client-side와 server-side environment variables를 포함하는 단계](/eas/environment-variables/usage#storing-environment-variables)는 EAS environment variables를 사용할 때와 동일합니다. 따라서 `npx expo export` 명령을 실행하기 전에 로컬 **.env** 파일에 올바른 environment variables가 들어 있는지 확인해야 합니다.
