---
modificationDate: February 24, 2026
title: EAS에서 environment variables 생성 및 관리하기
description: EAS dashboard와 EAS CLI로 environment variables를 생성하고, 범위를 정하고, 사용하는 방법을 알아보세요.
---

# EAS에서 environment variables 생성 및 관리하기

EAS dashboard와 EAS CLI로 environment variables를 생성하고, 범위를 정하고, 사용하는 방법을 알아보세요.

아래 섹션에서는 EAS dashboard와 EAS CLI를 사용해 environment variables를 생성하고, 범위를 정하고, 사용하는 방법을 다룹니다.

## environment variables 생성하기

-   [**environment 하나 또는 여러 개 선택하기**](/eas/environment-variables#available-environments): `development`, `preview`, `production`이 기본으로 제공됩니다. 변수는 이들 사이에서 재사용하거나 environment별로 다르게 설정할 수 있습니다.
-   [**scope 선택하기**](/eas/environment-variables#scope): Project-wide 변수는 하나의 프로젝트에 적용됩니다. Account-wide 변수는 여러 프로젝트에서 재사용할 수 있으며 build 시 project 변수와 병합됩니다.
-   [**visibility 선택하기**](/eas/environment-variables#visibility-settings-for-environment-variables): EAS 서버를 절대 벗어나면 안 되는 값에는 **secret**, 로컬에서 드러나도 되는 값에는 **sensitive**, 민감하지 않은 값에는 **plain text**를 사용하세요.

### dashboard에서 변수 생성하기

EAS 서버에 새 environment variable을 생성하려면 프로젝트 dashboard에서 **Project settings** > [**Environment variables**](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/environment-variables)로 이동한 뒤 **Add Variables** 버튼을 클릭하세요.

[environment variables 생성 폼](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/environment-variables) 페이지에서 이름, 값, environment(s), visibility, 선택적 설명을 설정하세요.

생성된 변수는 scope, visibility, environment tag와 함께 목록에 표시됩니다. 이 예시의 environment variables를 기준으로 하면 목록은 다음처럼 보일 수 있습니다:

위 예시 목록에서는:

-   `SENTRY_AUTH_TOKEN` 변수는 sensitive environment variable입니다. build와 update 뒤에 source map을 업로드하기 위해 Sentry를 인증하는 데 사용되며, EAS 서버 밖에서도 접근 가능해야 합니다.
-   `GOOGLE_SERVICES_JSON` 변수는 업로드된 파일을 사용하는 secret environment variable입니다. Google Services JSON 파일에 접근하기 위해 Google을 인증하는 데 사용되며, EAS 서버에 안전하게 저장되어야 합니다. 이 업로드된 JSON 파일은 보통 프로젝트의 **.gitignore**에 추가합니다.
-   `APP_VARIANT`, `EXPO_PUBLIC_API_URL` 같은 다른 변수는 모두 plain text environment variables입니다.

### EAS CLI로 변수 생성하기

변수를 추가하려면 `eas env:create`를 사용하고, 무엇이 설정되어 있는지 확인하려면 `eas env:list`를 사용하세요.

```sh
eas env:create --name EXPO_PUBLIC_API_URL --value https://example.app/staging --environment preview --visibility plaintext
eas env:list --environment preview
```

## 코드에서 environment variables 사용하기

### client-side 값

[`EXPO_PUBLIC_`](/guides/environment-variables) 접두사가 붙은 environment variables는 앱 코드에서 `process.env` 변수로 사용할 수 있습니다. 값을 기반으로 앱 동작을 동적으로 구성하는 데 사용할 수 있습니다:

```tsx
import { Button } from 'react-native';

function Post() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  async function onPress() {
    await fetch(apiUrl, {
      ... 
    });
  }

  return <Button onPress={onPress} title="Post" />;
}
```

위 예시에서 `EXPO_PUBLIC_API_URL`은 fetch 요청의 API URL을 동적으로 설정하는 데 사용됩니다.

> `EXPO_PUBLIC_` 변수에는 secret을 넣지 마세요. client bundle 안의 모든 것은 최종 사용자가 읽을 수 있습니다.

### build 시점과 app config

`EXPO_PUBLIC_` 접두사가 없는 다른 변수는 [app config](/workflow/configuration)를 해석하는 동안 앱 동작을 구성하는 데 사용할 수 있습니다. 예를 들어 `APP_VARIANT` 변수는 선택한 [app variant](/build-reference/variants)에 따라 앱 이름, package name, bundle identifier를 결정하는 데 사용됩니다:

dynamic app config에서는 접두사가 없는 변수를 사용하세요. 로컬에서 config를 해석해야 한다면 visibility는 최소 **sensitive**로 유지하세요(plain text와 sensitive는 EAS CLI에서 읽을 수 있지만 secret은 서버에만 남습니다).

```js
const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

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

export default {
  name: getAppName(),
  ... 
  ios: {
    bundleIdentifier: getUniqueIdentifier(),
    ... 
  },
  android: {
    package: getUniqueIdentifier(),
    ... 
  },
};
```

### secrets와 file 변수

`GOOGLE_SERVICES_JSON` 같은 environment variable은 EAS 서버 밖에서는 읽을 수 없는 secret file 변수이며, git ignore된 **google-services.json** 파일을 EAS Build job에 제공하는 데 사용됩니다. app config에서 사용하려면 `process.env` 변수를 사용하고, 변수가 설정되지 않았을 때를 대비한 fallback 값을 함께 제공할 수 있습니다(로컬 개발에서는 보통 프로젝트 저장소 안에 파일이 있기 때문입니다):

```js
export default {
  android: {
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? '/local/path/to/google-services.json',
  },
};
```

## environment variables 관리하기

프로젝트 또는 account의 [EAS dashboard](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/environment-variables)를 사용해 environment variables를 생성, 업데이트, 삭제할 수 있습니다.

EAS CLI로도 관리할 수 있습니다. 아래 명령은 `production` environment를 예시로 사용합니다. 실제 사용할 때는 `production`을 관리하려는 environment 이름으로 바꾸세요.

```sh
eas env:create --name EXPO_PUBLIC_API_URL --value https://example.app/staging --environment production --visibility plaintext
eas env:update --name EXPO_PUBLIC_API_URL --value https://example.app/staging --environment production --visibility plaintext
eas env:delete
eas env:list --environment production
eas env:pull --environment production
```

> **Tip:** 위 명령에 대한 자세한 내용은 [EAS CLI command reference](https://github.com/expo/eas-cli/blob/main/packages/eas-cli/README.md)를 참고하세요.

### 로컬 개발용 변수 pull하기

로컬 개발에서 EAS environment variables를 효율적으로 사용하는 방법은 `eas env:pull --environment environment-name` 명령으로 **.env** 파일에 가져오는 것입니다:

예를 들어 `production` environment의 environment variables를 **.env** 파일로 가져오려면 다음을 실행하세요:

```sh
eas env:pull --environment production
```

생성된 파일은 다음과 같을 수 있습니다:

```bash
# Environment: production

APP_VARIANT=development
EXPO_PUBLIC_API_URL=https://staging.my-api-url.mycompany.com
# GOOGLE_SERVICES_JSON=***** (secret variables are not available for reading)
SENTRY_AUTH_TOKEN=token
```

> **Tip:** 생성된 **.env** 파일은 유출과 로컬/클라우드 job 간 우선순위 충돌을 피하기 위해 **.gitignore**에 포함하세요.

EAS dashboard의 **Export** 옵션을 사용해 파일을 다운로드한 뒤 프로젝트 안에 저장할 수도 있습니다.

## custom environments

> custom environment 생성은 [Enterprise 및 production](/billing/plans#plans) 플랜에서 사용할 수 있습니다.

기본 세 가지 environment면 대부분의 사용 사례에는 충분하지만, 프로젝트가 복잡한 workflow에 의존하고 더 많은 environment를 만들 수 있는 유연성이 필요하다면 custom environment가 도움이 될 수 있습니다.

### EAS dashboard에서 custom environment 생성하기

EAS dashboard에서 custom environment를 생성하려면:

-   프로젝트에서 **Project settings** > [**Environment variables**](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/environment-variables)로 이동한 뒤 **Add Variables** 버튼을 클릭하세요.
-   **Environments** 아래에서 **plus (+) icon**을 클릭해 custom environment 이름을 입력하세요.

-   environment를 만든 뒤에는 **Custom environments** 섹션 아래에서 미리 선택된 상태로 표시됩니다.
-   이 environment에 연결된 environment variable이 하나 이상 있는 한, 해당 account 또는 프로젝트의 모든 environment variable에서 선택 가능한 옵션으로 표시됩니다.

### EAS CLI로 custom environment 생성하기

environment variable을 custom environment에 할당하려면 environment 자리에서 custom environment 이름을 사용하세요. 예를 들어 아래 명령은 새 변수 `EXPO_PUBLIC_API_URL`을 생성하고 custom `staging` environment에 할당합니다:

```sh
eas env:create --name EXPO_PUBLIC_API_URL --value https://example.app/staging --environment staging --visibility plaintext
```
