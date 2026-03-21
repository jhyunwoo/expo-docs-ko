---
modificationDate: March 09, 2026
title: 여러 앱 variant 구성하기
description: 하나의 디바이스에 여러 앱 variant를 설치할 수 있도록 동적 앱 구성을 설정하는 방법을 알아봅니다.
---

# 여러 앱 variant 구성하기

하나의 디바이스에 여러 앱 variant를 설치할 수 있도록 동적 앱 구성을 설정하는 방법을 알아봅니다.

이 장에서는 하나의 디바이스에서 여러 build 유형(development, preview, production)을 동시에 실행할 수 있도록 프로젝트를 구성하겠습니다. 이렇게 설정하면 서로 다른 버전을 삭제하고 다시 설치할 필요 없이 앱 개발의 여러 단계를 테스트할 수 있습니다.

[시청하기: 여러 앱 variant 구성 방법](https://www.youtube.com/watch?v=UtJJCAfrjIg) — 고유한 bundle identifier를 사용해 development, preview, production 앱 variant를 구성하고 하나의 디바이스에서 나란히 실행합니다.

각 variant는 하나의 디바이스에 동시에 설치할 수 있도록 고유한 Android Application ID와 iOS Bundle Identifier가 필요합니다. 우리 **app.json** 파일에서는 ID가 아래와 같이 설정되어 있습니다:

```json
{
  "ios": {
    "bundleIdentifier": "com.yourname.stickersmash"
    ... 
  },
  "android": {
    "package": "com.yourname.stickersmash"
    ... 
  }
}
```

## 동적 구성을 위한 app.config.js 추가하기

**app.json**은 앱 관련 구성을 JSON 파일에 담고 있습니다. 하지만 정적 파일이기 때문에 [일부 속성에 동적 값](/workflow/configuration#dynamic-configuration)을 사용하려는 경우에는 적합하지 않습니다. 이제 [환경 변수](/workflow/configuration#switching-configuration-based-on-the-environment)를 기반으로 모든 build profile에 대해 서로 다른 Android Application ID와 iOS Bundle Identifier를 추가하겠습니다.

-   프로젝트 루트에 **app.config.js**라는 새 파일을 만듭니다.
-   **app.config.js**에서 `config`를 인수로 받는 기본 함수를 export합니다. 그런 다음 `config`를 구조 분해하여 **app.json**의 기존 속성을 모두 복사하겠습니다.

```js
export default ({ config }) => ({
  ...config,
});
```

## 환경에 따라 동적 값 업데이트하기

build 유형을 식별하기 위해 **app.config.js**에서 `development`와 `preview` build profile에 사용할 `IS_DEV`와 `IS_PREVIEW`라는 두 환경 변수를 추가해 봅시다:

```js
const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';
```

그다음 앱 이름, Android Application ID, iOS Bundle Identifier를 동적으로 변경하는 두 함수를 추가합니다:

```js
const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return 'com.yourname.stickersmash.dev';
  }

  if (IS_PREVIEW) {
    return 'com.yourname.stickersmash.preview';
  }

  return 'com.yourname.stickersmash';
};

const getAppName = () => {
  if (IS_DEV) {
    return 'StickerSmash (Dev)';
  }

  if (IS_PREVIEW) {
    return 'StickerSmash (Preview)';
  }

  return 'StickerSmash: Emoji Stickers';
};
```

앱에는 동적인 `name` 값을 할당하기 위해 `getAppName()`을 사용하고, development 및 preview build의 `android.package`와 `ios.bundleIdentifier`를 구분하기 위해 `getUniqueIdentifier()`를 사용하겠습니다:

```js
export default ({ config }) => ({
  ...config,
  name: getAppName(),
  ios: {
    ...config.ios,
    bundleIdentifier: getUniqueIdentifier(),
  },
  android: {
    ...config.android,
    package: getUniqueIdentifier(),
  },
});
```

## eas.json 구성하기

**eas.json**에 `APP_VARIANT` 환경 변수를 추가합니다:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "APP_VARIANT": "development"
      }
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "APP_VARIANT": "preview"
      }
    }
    ... 
  }
}
```

이제 `eas build --profile development`를 실행하면 `APP_VARIANT`가 `development`로 설정됩니다.

> **참고**: Android Application ID와 iOS Bundle Identifier를 변경했기 때문에, EAS CLI는 Android용 새 Keystore와 iOS용 새 provisioning profile을 생성할지 물어봅니다. 이 단계에 무엇이 포함되는지 더 알고 싶다면, 자세한 내용은 이전 장을 참고하세요.

`ios-simulator` build profile은 `development`를 확장하므로, 이 구성은 iOS Simulator에도 자동으로 적용됩니다.

## development server 실행하기

> build가 완료되면 이전 장과 같은 절차에 따라 device 또는 emulator/simulator에 설치하세요.

development build를 `APP_VARIANT` 환경 변수로 식별하고 있으므로, development server를 시작할 때도 이 값을 명령에 전달해야 합니다. 이를 위해 프로젝트 **package.json**의 [`"scripts"`](https://docs.npmjs.com/cli/v10/using-npm/scripts) 필드에 `dev` 스크립트를 추가합니다:

```json
{
  "scripts": {
    "dev": "APP_VARIANT=development npx expo start"
  }
}
```

development server를 시작하려면 `npm run dev` 명령을 실행합니다:

```sh
npm run dev
```

이 스크립트는 로컬에서 **app.config.js**를 평가하고 `development` profile용 환경 변수를 로드합니다.

이제 development build는 Android와 iOS 모두에서 실행되며, **app.config.js**에서 수정한 앱 이름을 표시합니다. 예를 들어 아래 development build는 iOS Simulator에서 실행 중입니다. 앱 이름이 **StickerSmash (Dev)**로 표시되는 것을 확인해 보세요:

이제 정적 값은 계속 **app.json**에서 사용하고, 동적 값은 **app.config.js**에서 사용할 수 있습니다.

## 요약

5장: 여러 앱 variant 구성하기

정적 구성은 **app.json**에 그대로 두고 동적 구성만을 위한 **app.config.js**를 성공적으로 만들었으며, 특정 build profile을 구성하기 위해 **eas.json**에 환경 변수를 추가했고, 사용자 지정 **package.json** 스크립트로 development server를 시작하는 방법도 배웠습니다.

다음 장에서는 internal distribution build가 무엇인지, 왜 필요한지, 그리고 이를 만드는 방법을 알아봅니다.

[다음: internal distribution build 만들고 공유하기](/tutorial/eas/internal-distribution-builds)
