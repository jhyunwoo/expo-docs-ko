---
modificationDate: February 26, 2026
title: EAS의 environment variables에 대한 자주 묻는 질문
description: EAS의 environment variables에 대한 자주 묻는 질문입니다.
---

# EAS의 environment variables에 대한 자주 묻는 질문

EAS의 environment variables에 대한 자주 묻는 질문입니다.

이 페이지는 EAS의 environment variables에 대해 자주 묻는 질문을 다룹니다.

## 내 EAS 프로젝트에서 environment variables를 사용하는 권장 워크플로는 무엇인가요?

EAS 프로젝트에서 environment variables를 효율적으로 다루는 한 가지 방법은 다음과 같습니다:

### 올바른 visibility 설정 사용하기

environment variables의 visibility를 적절한 수준으로 설정하세요. 앱의 JavaScript 코드에서 사용되거나 앱 구성을 해석하는 데 사용되는 `EXPO_PUBLIC_` 변수에 과도하게 secret visibility를 설정하지 마세요. secret visibility를 가진 environment variables는 EAS 서버 밖에서는 읽을 수 없으며, 로컬 개발용으로 pull하거나 update를 위해 앱의 JavaScript 코드를 번들링할 때 사용할 수 없다는 점을 기억하세요.

### .env 파일을 .gitignore에 추가하기

cloud job 중 혼란스러운 override를 피하고 민감한 정보가 유출되지 않도록 **.env** 파일을 **.gitignore** 파일에 추가하세요.

### `eas update`와 함께 `--environment` 플래그 사용하기

update를 게시할 때는 `eas update` 명령에서 `--environment` 플래그가 필수입니다. 이렇게 하면 build job과 update 모두에서 동일한 environment variables가 사용됩니다.

`--environment` 플래그가 제공되면 `eas update`는 update job에 대해 EAS 서버의 environment variables를 사용하고, 로컬 개발용으로 자주 쓰이는 프로젝트의 **.env** 파일은 무시합니다.

### `eas env:pull`로 로컬 개발용 environment variables 동기화하기

`eas env:pull` 명령을 사용해 EAS 서버의 environment variables를 로컬 **.env** 파일로 가져와 개발에 사용할 수 있습니다. 이 목적에 가장 적합한 environment는 `development` environment인데, development build에서 기본으로 사용하는 environment이기 때문입니다.

### build에 사용할 environment를 명시적으로 지정하기

build job에서 항상 올바른 environment variables가 사용되도록 하고 이 과정을 완전히 제어하려면, build profile의 **eas.json**에 [`environment`](/eas/json#environment) 값을 명시적으로 설정하세요.

## `eas build` 명령으로 build를 트리거할 때 CI provider에서 environment variables를 설정할 수 있나요?

environment variables가 EAS Build builder에서 사용 가능하려면 EAS 서버에 정의되어 있어야 합니다. CI에서 build를 트리거하는 경우에도 같은 규칙이 적용되며, GitHub Actions(또는 선택한 다른 provider)에 environment variables를 설정하는 것과 EAS 서버에 environment variables 및 secret을 설정하는 것을 혼동하지 않도록 주의해야 합니다.

## development build에서는 environment variables가 어떻게 동작하나요?

**app.config.js**에 영향을 주는 build profile의 environment variables는 development build를 구성하는 데 사용됩니다.

development build 안에서 앱을 로드하기 위해 `npx expo start`를 실행하면, 개발 머신에서 사용할 수 있는 environment variables만 사용됩니다.

## 내 EAS 프로젝트에서 file environment variables를 사용할 수 있나요?

문자열 값을 설정하는 것 외에도 파일을 environment variable의 값으로 업로드할 수도 있습니다.

file environment variable의 일반적인 사용 사례 중 하나는 git ignore된 **google-services.json** 구성 파일을 build job에 전달하는 것입니다. job이 실행되는 동안 파일은 프로젝트 디렉터리 밖의 위치에 생성되고, 그 파일 경로가 environment variable에 할당됩니다(`GOOGLE_SERVICES_JSON=/path/to/google-services.json`). 예를 들어 build나 workflow job 실행 시 이 파일을 사용하려면 app config에서 `android.googleServicesFile`을 `GOOGLE_SERVICES_JSON` environment variable 값으로 설정할 수 있습니다.

```js
export default {
  ...
  android: {
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? '/local/path/to/google-services.json',
    ...
  },
};
```

## EAS CLI와 Expo CLI에서 environment variables를 처리하는 방식의 차이

Expo framework에서 environment variables를 사용하는 것과 EAS에서 사용하는 것의 차이점 중 하나는, EAS CLI 자체는 app config를 해석할 때 environment variables를 설정하기 위해 **.env** 파일을 로드하는 기능을 지원하지 않는다는 것입니다. 대신 혼란을 줄이고, 다음 두 경우 모두에서 정확히 동일한 environment variables가 사용되도록, EAS CLI 명령에서는 EAS environment variables 관리 시스템을 사용해 build job과 update에 필요한 environment variables를 설정하는 것을 권장합니다:

-   EAS CLI가 app config를 준비할 때 수행하는 로컬 app config 해석
-   EAS 서버에서 실행되는 원격 job. 이런 job은 보통 git ignore된 로컬 **.env** 파일에 접근할 수 없습니다

**SDK 54 이하**에서는 `eas update`가 이 규칙의 예외였습니다. 기본적으로 이 명령은 프로젝트 디렉터리 안의 **.env** 파일을 사용해 update job의 environment variables를 설정했으며, 이는 [Expo CLI](/guides/environment-variables)가 동작하는 방식과 같습니다(내부적으로 `npx expo export` 명령을 실행합니다). **SDK 55 이상**에서는 `--environment` 플래그가 필수이며, `eas update`는 EAS 서버에 설정된 environment variables만 사용합니다.

SDK 54 이하 프로젝트에서는 `eas update` 명령과 함께 `--environment` 플래그를 사용해 이 동작을 opt-in할 수 있습니다.

## EAS에서 environment variables를 사용할 때 제한 사항이 있나요?

-   environment variable 값 크기는 secret visibility 변수의 경우 32 KiB, 다른 visibility 유형의 경우 4 KiB로 제한됩니다.
-   Expo account마다 account-wide environment variable은 최대 150개, 앱마다 project-specific environment variable은 최대 200개까지 만들 수 있습니다.
-   [Custom environments](/eas/environment-variables/manage#custom-environments)는 프로젝트당 최대 10개로 제한됩니다.
-   custom environment를 만들 때 environment 이름에는 문자, 숫자, underscore, hyphen을 사용할 수 있으며 길이는 3~100자여야 합니다.
