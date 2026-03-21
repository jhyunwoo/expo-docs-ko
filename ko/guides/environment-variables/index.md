---
modificationDate: February 28, 2026
title: Expo의 environment variable
description: Expo 프로젝트에서 environment variable을 사용하는 방법을 알아보세요.
---

# Expo의 environment variable

Expo 프로젝트에서 environment variable을 사용하는 방법을 알아보세요.

environment variable은 source code 바깥에서 구성되는 key-value 쌍으로, 환경에 따라 앱이 다르게 동작하도록 해줍니다. 예를 들어 테스트 버전을 빌드할 때 특정 기능을 켜거나 끌 수 있고, production용으로 빌드할 때는 다른 API endpoint로 전환할 수 있습니다.

Expo CLI는 로컬 development mode에서 앱을 시작하기 위해 `npx expo start`를 실행할 때처럼 Expo CLI를 사용할 때마다, JavaScript code 안에서 사용할 수 있도록 **.env** 파일에 있는 `EXPO_PUBLIC_` prefix 환경 변수를 자동으로 로드합니다.

## .env 파일에서 environment variable 읽기

프로젝트 디렉터리 루트에 **.env** 파일을 만들고, `EXPO_PUBLIC_[NAME]=VALUE` 형식으로 환경별 변수를 새 줄에 추가하세요:

```bash
EXPO_PUBLIC_API_URL=https://staging.example.com
EXPO_PUBLIC_API_KEY=abc123
```

이제 source code 안에서 environment variable을 직접 사용할 수 있습니다:

```tsx
import { Button } from 'react-native';

function Post() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  async function onPress() {
    await fetch(apiUrl, { ... })
  }

  return <Button onPress={onPress} title="Post" />;
}
```

`npx expo start`를 실행하면 앱 bundle 안에서 `process.env.EXPO_PUBLIC_API_URL`이 `https://staging.example.com`으로 대체됩니다. 코드를 편집하는 동안 Expo CLI를 다시 시작하거나 cache를 비우지 않아도 변수를 업데이트할 수 있습니다. 다만 업데이트된 값을 보려면 전체 reload를 수행해야 합니다(예: Expo Go 또는 development build에서 흔들기 제스처 후 Reload 선택).

> private key 같은 민감한 정보는 `EXPO_PUBLIC_` 변수에 저장하지 마세요. 이 변수들은 컴파일된 애플리케이션 안에서 평문으로 보이게 됩니다.

### 변수가 로드되는 방식

Expo CLI는 [표준 .env 파일 해석 규칙](https://github.com/bkeepers/dotenv/blob/c6e583a/README.md#what-other-env-files-can-i-use)에 따라 **.env** 파일을 로드한 뒤, 코드 안의 `process.env.EXPO_PUBLIC_[VARNAME]` 참조를 **.env** 파일에 설정된 대응 값으로 모두 치환합니다. 보안상의 이유로 **node_modules** 내부 코드는 영향을 받지 않습니다.

### environment variable을 읽는 방법

-   ✓ **인라인 치환이 되려면 모든 environment variable은 JavaScript의 dot notation을 사용해 `process.env`의 property로 정적으로 참조되어야 합니다.** 예를 들어 `process.env.EXPO_PUBLIC_KEY` 표현식은 유효하며 인라인 처리됩니다.

-   ✗ **다른 형태의 표현식은 지원되지 않습니다**. 예를 들어 `process.env['EXPO_PUBLIC_KEY']` 또는 `const {EXPO_PUBLIC_X} = process.env`는 유효하지 않으며 인라인 처리되지 않습니다.

### 여러 .env 파일을 사용해 별도 환경 정의하기

[표준 .env 파일](https://github.com/bkeepers/dotenv/blob/c6e583a/README.md#what-other-env-files-can-i-use)은 무엇이든 정의할 수 있으므로, **.env**와 **.env.local** 같은 별도 파일을 두고 표준 우선순위에 따라 로드되게 할 수 있습니다.

기본 **.env** 파일이나 다른 표준 구성을 commit할지 선택할 수는 있지만, 일반적으로 **.env.local** 파일은 **.gitignore**에 추가해야 합니다. 이 파일은 로컬 머신에 특화된 환경 구성을 지정하는 데 사용되기 때문입니다(예를 들어 로컬 서버로 요청을 보내기 위해 필요한 네트워크 IP 주소 등).

```bash
.env*.local
```

#### environment variable과 `NODE_ENV`

**.env.test**, **.env.production**처럼 **.env** 파일을 전환하기 위해 `NODE_ENV`를 사용하는 것은 권장하지 않습니다. 기술적으로는 가능하지만(`NODE_ENV=test npx expo start`는 **.env.test**를 로드함) 기대한 대로 동작하지 않을 수 있습니다. 예를 들어 `npx expo export`는 항상 `NODE_ENV`를 `production`으로 강제하므로, `NODE_ENV=test npx expo export`를 실행해도 실제로는 `NODE_ENV`가 `test`로 설정된 상태로 명령이 실행되지 않습니다.

Expo CLI 명령 위에 구축된 다른 도구들도 같은 동작을 보입니다. 예를 들어 `eas update`는 내부적으로 `npx expo export`를 호출하므로, 그 결과 `NODE_ENV=test eas update` 역시 `NODE_ENV`가 `test`인 상태로 실행되지 않습니다(`production`이 됩니다). `NODE_ENV` environment variable은 많은 도구가 각기 다른 방식으로 사용합니다(예를 들어 `NODE_ENV=production npm install`을 실행하면 `devDependencies`가 설치되지 않음). React Native 프로젝트에서는 이 변수에 이 용도까지 더해 과도하게 사용하지 않는 편이 가장 낫다는 것이 우리의 판단입니다.

EAS를 사용한다면 대신 `eas env:pull` 사용을 고려하세요. 이렇게 하면 `NODE_ENV`에 의존하는 대신 원하는 환경으로 **.env.local**을 교체할 수 있습니다. EAS 없이도, 작업하려는 환경에 맞는 내용으로 **.env.local** 또는 **.env**를 덮어쓰는 script를 작성하면 비슷한 동작을 구현할 수 있습니다.

### environment variable 비활성화하기

Expo CLI의 environment variable 기능은 두 부분으로 나뉘며, 둘 다 비활성화할 수 있습니다:

1.  Expo CLI는 **.env** 파일을 전역 process에 자동으로 로드합니다. 이 동작을 비활성화하려면, 어떤 Expo CLI 명령을 실행하기 전에 environment variable `EXPO_NO_DOTENV`를 `1`로 설정하세요: `EXPO_NO_DOTENV=1`.
2.  Expo의 Metro config는 client JavaScript bundle 안에 environment variable을 인라인 직렬화하는 기능을 포함합니다. 이 동작을 비활성화하려면 `EXPO_NO_CLIENT_ENV_VARS=1`을 사용할 수 있습니다.

environment variable과 관련된 문제가 발생한다면, 이 기능 중 하나 또는 둘 다 비활성화해 볼 수 있습니다.

## Expo Application Services의 environment variable

### EAS Build

[EAS Build](/build/introduction)는 앱 binary 안에 포함되는 JavaScript bundle을 빌드하기 위해 Metro Bundler를 사용하므로, build job과 함께 업로드된 **.env** 파일을 사용해 `EXPO_PUBLIC_` 변수를 코드에 인라인합니다. 또한 EAS Build는 **eas.json**의 build profile 내부와 EAS Secrets를 통해 environment variable을 정의할 수 있게 해줍니다. 자세한 내용은 EAS Build 문서의 [environment variable 및 build secret](/eas/environment-variables)을 참고하세요.

### EAS Update

[EAS Update](/eas-update/introduction)는 앱 bundle을 빌드하기 위해 로컬 환경 또는 CI에서 Metro Bundler를 사용하므로, 사용 가능한 **.env** 파일을 사용해 `EXPO_PUBLIC_` 변수를 코드에 인라인합니다. 자세한 내용은 EAS Update 문서의 [environment variable](/eas/environment-variables/usage#using-environment-variables-with-eas-update)을 참고하세요.

## Expo environment variable로 마이그레이션하기

### react-native-config에서 옮기기

JavaScript code 안에서 사용하는 변수를 모두 `EXPO_PUBLIC_` prefix를 붙이도록 **.env** 파일을 업데이트하세요:

```diff
- API_URL=https://myapi.com
+ EXPO_PUBLIC_API_URL=https://myapi.com
```

> 표준이 아닌 **.env** 파일(예: **.env.staging**)이 있다면, 이를 [표준 .env 파일](https://github.com/bkeepers/dotenv/blob/c6e583a/README.md#what-other-env-files-can-i-use) 중 하나로 마이그레이션해야 합니다.

그다음 코드를 `process.env.EXPO_PUBLIC_[VARNAME]`을 사용하도록 업데이트하세요:

```diff
- import Config from 'react-native-config';

- const apiUrl = Config.API_URL;
+ const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

### babel-plugin-transform-inline-environment-variables에서 옮기기

코드 안의 environment variable 참조를 변환하기 위해 Babel plugin을 사용하는 방식은 Expo environment variable이 동작하는 방식과 비슷합니다. 변수를 **.env** 파일에 설정하고, 변수 이름을 `EXPO_PUBLIC_` prefix를 사용하도록 바꾸세요:

```diff
- const apiUrl = process.env.API_URL;
+ const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

그다음 [Babel config](/versions/latest/config/babel)에서 plugin을 제거할 수 있습니다:

```diff
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
--    plugins: ['transform-inline-environment-variables'],
  };
};
```

Babel config 파일을 업데이트한 뒤에는 `npx expo start --clear`로 cache를 꼭 비우세요.

### direnv에서 옮기기

JavaScript에서 사용하는 environment variable을 **.envrc** 파일에서 **.env** 파일로 옮기고, `EXPO_PUBLIC_` prefix를 붙이세요.

이전에는 `direnv`와 함께 [dynamic app config](/versions/latest/config/app#app-config)를 사용해 [`process.env`](https://nodejs.org/dist/latest/docs/api/process.html#process_process_env)에서 값을 읽고, 그 environment variable을 `extra` field에 설정한 다음 JavaScript 코드 안에서 [`expo-constants`](/versions/latest/sdk/constants)를 통해 사용할 수 있었습니다. 이제는 그 참조를 `EXPO_PUBLIC_` prefix를 붙여 코드 안으로 직접 옮기세요:

```diff
- import Constants from 'expo-constants';

- const apiUrl = Constants.expoConfig.extra.apiUrl;
+ const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

> [`direnv`](https://direnv.net/)는 현재 디렉터리에 따라 shell에서 environment variable을 자동으로 로드하고 해제합니다. 즉, Expo CLI만이 아니라 해당 디렉터리에서 실행되는 모든 process의 환경에 영향을 줄 수 있습니다. JavaScript 코드에서 사용하지 않는 다른 environment variable을 위해서는 계속 `direnv`를 사용하는 편이 좋을 가능성이 큽니다.

## 보안 고려 사항

`EXPO_PUBLIC_` prefix가 붙은 environment variable에는 민감한 secret을 절대 저장하지 마세요. 최종 사용자가 앱을 실행할 때, 앱 안의 모든 code와 embedded environment variable에 접근할 수 있습니다. 자세한 내용은 [민감한 정보 저장하기](https://reactnative.dev/docs/security#storing-sensitive-info)를 참고하세요.
