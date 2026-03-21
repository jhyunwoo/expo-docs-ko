---
modificationDate: February 26, 2026
title: Metro bundler
description: 커스터마이즈할 수 있는 다양한 Metro bundler 구성에 대해 알아보세요.
---

# Metro bundler

커스터마이즈할 수 있는 다양한 Metro bundler 구성에 대해 알아보세요.

Expo CLI는 [Metro](https://metrobundler.dev/)를 사용해 [`npx expo start`](/more/expo-cli#develop)와 [`npx expo export`](/more/expo-cli#exporting) 동안 JavaScript 코드와 asset을 번들링합니다. Metro는 React Native를 위해 만들어지고 최적화되었으며 Facebook과 Instagram 같은 대규모 애플리케이션에서 사용됩니다.

## Customizing

프로젝트 루트에 **metro.config.js** 파일을 만들어 Metro bundler를 커스터마이즈할 수 있습니다. 이 파일은 [Metro configuration](https://metrobundler.dev/docs/configuration/)을 export해야 하며, 이는 [`expo/metro-config`](https://github.com/expo/expo/tree/main/packages/@expo/metro-config)를 확장해야 합니다. 버전 일관성을 위해 `@expo/metro-config` 대신 `expo/metro-config`를 import하세요.

template 파일을 생성하려면 다음 명령을 실행하세요:

```sh
npx expo customize metro.config.js
```

**metro.config.js** 파일은 다음과 같습니다:

```js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
```

자세한 내용은 [**metro.config.js** documentation](https://metrobundler.dev/docs/configuration/)을 참고하세요.

## Assets

Metro는 파일을 source code 또는 asset으로 해석합니다. source code는 JavaScript, TypeScript, JSON 및 애플리케이션에서 사용하는 기타 파일입니다. [Assets](/develop/user-interface/assets)는 이미지, 폰트, 그리고 Metro가 변환해서는 안 되는 다른 파일입니다. 대규모 코드베이스를 수용하기 위해 Metro는 bundler를 시작하기 전에 source code와 asset 모두에 대한 모든 확장자를 명시적으로 정의해야 합니다. 이는 `resolver.sourceExts`와 `resolver.assetExts` 옵션을 Metro configuration에 추가해 처리합니다. 기본적으로는 다음 확장자가 포함됩니다:

-   [`resolver.assetExts`](https://github.com/facebook/metro/blob/7028b7f51074f9ceef22258a8643d0f90de2388b/packages/metro-config/src/defaults/defaults.js#L15)
-   [`resolver.sourceExts`](https://github.com/facebook/metro/blob/7028b7f51074f9ceef22258a8643d0f90de2388b/packages/metro-config/src/defaults/defaults.js#L53)

### `assetExts`에 더 많은 파일 확장자 추가하기

가장 흔한 커스터마이징은 Metro에 추가 asset 확장자를 포함하는 것입니다.

**metro.config.js** 파일에서 파일 확장자(앞에 `.` 없이)를 `resolver.assetExts` 배열에 추가하세요:

```js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push(
  // Adds support for `.db` files for SQLite databases
  'db'
);

module.exports = config;
```

## Alias

때로는 import를 다른 module이나 파일로 리디렉션하고 싶을 수 있습니다. 이를 alias라고 합니다. Metro가 동시에 여러 플랫폼을 대상으로 번들링하는 방식 때문에, alias를 처리하려면 custom resolver를 사용하는 것을 권장합니다.

다음 예시에서는 `old-module`에 대한 alias를 `new-module`로 추가합니다:

```js
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const ALIASES = {
  'old-module': 'new-module',
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Ensure you call the default resolver.
  return context.resolveRequest(
    context,
    // Use an alias if one exists.
    ALIASES[moduleName] ?? moduleName,
    platform
  );
};

module.exports = config;
```

특정 플랫폼에서만 alias를 적용하고 싶다면 `platform` 인수를 확인할 수 있습니다:

```js
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web') {
    // The alias will only be used when bundling for the web.
    return context.resolveRequest(context, ALIASES[moduleName] ?? moduleName, platform);
  }
  // Ensure you call the default resolver.
  return context.resolveRequest(context, moduleName, platform);
};
```

dev server를 다시 시작하면 다음 번에 변경 사항이 반영됩니다. resolution은 절대 캐시되지 않으므로 업데이트를 위해 `--clear` 플래그가 필요하지 않습니다. `babel-plugin-module-resolver`처럼 transform 기반 시스템을 사용하는 경우에는 변경 사항을 적용해 보려면 cache를 지워야 합니다.

[Customizing Metro resolution](/versions/latest/config/metro#custom-resolving) — 프로젝트에서 고급 Metro resolution에 대해 더 알아보세요.

## Bundle splitting

Expo CLI는 async import를 기반으로 bundle을 자동 분할합니다(웹 전용).

이 기법은 Expo Router와 함께 사용해 **app** 디렉터리의 route file을 기준으로 bundle을 자동 분할할 수 있습니다. 현재 route에 필요한 코드만 로드하고, 사용자가 다른 페이지로 이동할 때까지 추가 JavaScript 로딩은 미룰 수 있습니다. 자세한 내용은 [Async Routes](/router/web/async-routes)를 참고하세요.

## Tree shaking

[Tree shaking](/guides/tree-shaking) — Expo CLI가 production JavaScript bundle을 어떻게 최적화하는지 알아보세요.

## Minification

[Minifying JavaScript](/guides/minify) — Metro bundler와 함께 Expo CLI에서 JavaScript minification 과정을 커스터마이즈하는 방법을 알아보세요.

## Web support

Expo CLI는 Metro를 사용해 웹사이트를 번들링하는 기능을 지원합니다. 이는 native 앱에도 사용하는 동일한 bundler이며, 플랫폼 전반에 걸쳐 범용적으로 설계되었습니다. 웹 프로젝트에 권장되는 bundler입니다.

### Expo webpack과 Expo Metro 비교

이전에 deprecated된 `@expo/webpack-adapter`로 웹사이트를 작성했다면 [migration guide](/router/migrate/from-expo-webpack)와 [comparison chart](/router/migrate/from-expo-webpack#expo-cli)를 참고하세요.

### Metro에 Web support 추가하기

[app config](/workflow/configuration)를 수정해 `expo.web.bundler` field로 이 기능을 활성화하세요:

```json
{
  "expo": {
    "web": {
      "bundler": "metro"
    }
  }
}
```

#### Development

development server를 시작하려면 다음 명령을 실행하세요:

```sh
npx expo start --web
```

또는 Expo CLI 터미널 UI에서 W를 누르세요.

#### Static files

Expo의 Metro 구현은 루트 **public/** 디렉터리에 static file을 두면 dev server가 이를 호스팅하도록 지원합니다. 다른 많은 웹 프레임워크와 비슷합니다.

`npx expo export`로 export할 때 **public** 디렉터리의 내용은 **dist/** 디렉터리로 복사됩니다. 이는 앱이 host URL을 기준으로 이 asset을 가져올 수 있다는 뜻입니다. 가장 흔한 예시는 웹사이트에서 탭 아이콘을 렌더링할 때 사용하는 **public/favicon.ico**입니다.

프로젝트에 **public/index.html** 파일을 만들면 Metro 웹의 기본 **index.html**을 덮어쓸 수 있습니다.

앞으로는 이 기능이 EAS Update hosting과 함께 플랫폼 전반에서 범용적으로 동작하게 될 것입니다. 현재는 native 앱에 사용되는 static host를 기반으로 한 웹 전용 기능이며, 예를 들어 legacy Expo service updates는 이 기능을 지원하지 않습니다.

> `/assets` 같은 일부 path는 Metro에 예약되어 있습니다. **public/assets/** 또는 다른 예약된 path에 파일을 두지 마세요. 전체 목록은 [Reserved paths](/router/reference/reserved-paths)를 참고하세요.

## TypeScript

Expo의 Metro config는 프로젝트의 **tsconfig.json**(또는 **jsconfig.json**) 파일 안에 있는 `compilerOptions.paths`와 `compilerOptions.baseUrl` field를 지원합니다. 이를 통해 프로젝트에서 absolute import와 alias를 사용할 수 있습니다. 자세한 내용은 [TypeScript](/guides/typescript) 가이드를 참고하세요.

이 기능은 bare 프로젝트에서 추가 설정이 필요합니다. 자세한 내용은 [Metro setup guide](/versions/latest/config/metro#bare-workflow-setup)를 참고하세요.

## CSS

[Metro web CSS guide](/versions/latest/config/metro#css) — Expo CLI와 Metro bundler로 번들된 웹사이트에서 CSS를 사용하는 방법을 알아보세요.
