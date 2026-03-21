---
modificationDate: October 06, 2025
title: Expo Atlas와 Lighthouse로 JavaScript 번들 분석하기
description: Expo Atlas와 Lighthouse를 사용해 Expo 앱과 웹사이트의 production JavaScript 번들 크기를 개선하는 방법을 알아보세요.
---

# Expo Atlas와 Lighthouse로 JavaScript 번들 분석하기

Expo Atlas와 Lighthouse를 사용해 Expo 앱과 웹사이트의 production JavaScript 번들 크기를 개선하는 방법을 알아보세요.

번들 성능은 플랫폼에 따라 달라집니다. 예를 들어 웹 브라우저는 사전 컴파일된 bytecode를 지원하지 않으므로 JavaScript 번들 크기는 시작 시간과 성능을 개선하는 데 중요합니다. 번들이 작을수록 더 빠르게 다운로드되고 파싱될 수 있습니다.

## Expo Atlas로 번들 크기 분석하기

프로젝트에서 사용하는 라이브러리는 production JavaScript 번들 크기에 영향을 줍니다. [Expo Atlas](https://github.com/expo/expo-atlas#readme)를 사용하면 production bundle을 시각화하고 어떤 라이브러리가 번들 크기에 기여하는지 식별할 수 있습니다.

### `npx expo start`와 함께 Atlas 사용하기

로컬 development server와 함께 Expo Atlas를 사용할 수 있습니다. 이 방법을 사용하면 프로젝트의 코드를 변경할 때마다 Atlas가 업데이트됩니다.

Android, iOS, 웹 중 하나 이상에서 로컬 development server로 앱을 실행한 뒤에는 shift + m으로 [dev tools plugin menu](/debugging/devtools-plugins#using-a-dev-tools-plugin)를 열어 Atlas를 실행할 수 있습니다.

```sh
EXPO_ATLAS=true npx expo start
```

#### development mode를 production으로 변경하기

기본적으로 Expo는 로컬 development server를 [development mode](/workflow/development-mode#development-mode)로 시작합니다. development mode는 [production mode](/workflow/development-mode#production-mode)에서 활성화되는 일부 최적화를 비활성화합니다. production 번들 크기를 더 정확하게 나타내려면 로컬 development server를 production mode로 시작할 수도 있습니다:

```sh
EXPO_ATLAS=true npx expo start --no-dev
```

### `npx expo export`와 함께 Expo Atlas 사용하기

앱이나 EAS Update를 위한 production bundle을 생성할 때도 Expo Atlas를 사용할 수 있습니다. Atlas는 export 중에 **.expo/atlas.jsonl** 파일을 생성하며, 이 파일은 프로젝트에 접근하지 못해도 공유해서 열어볼 수 있습니다.

```sh
EXPO_ATLAS=true npx expo export
npx expo-atlas .expo/atlas.jsonl
```

`--platform` 옵션을 사용해 분석할 플랫폼을 지정할 수도 있습니다. Expo Atlas는 export한 플랫폼에 대해서만 데이터를 수집합니다.

### 변환된 module 분석하기

Atlas 안에서 ⌘ Cmd를 누른 채 graph node를 클릭하면 변환된 module의 세부 정보를 볼 수 있습니다. 이 기능은 module이 Babel에 의해 어떻게 변환되는지, 어떤 module을 import하는지, 어떤 module이 그것을 import했는지 이해하는 데 도움이 됩니다. 이를 이용해 dependency graph 전반에서 module의 출처를 추적할 수 있습니다.

## source-map-explorer로 번들 크기 분석하기

> **SDK 50 이하**를 위한 대체 방법입니다.

SDK 50 이하를 사용 중이라면 [`source-map-explorer`](https://www.npmjs.com/package/source-map-explorer) 라이브러리를 사용해 production JavaScript 번들을 시각화하고 분석할 수 있습니다.

source map explorer를 사용하려면 먼저 다음 명령으로 설치하세요:

```sh
npm i --save-dev source-map-explorer
```

실행할 수 있도록 **package.json**에 script를 추가하세요. 플랫폼이나 사용 중인 SDK에 따라 입력 경로를 조정해야 할 수 있습니다. 간단히 하기 위해 아래 예시는 프로젝트가 Expo SDK 50이고 Expo Router `server` output을 사용하지 않는다고 가정합니다.

```json
{
  "scripts": {
    "analyze:web": "source-map-explorer 'dist/_expo/static/js/web/*.js' 'dist/_expo/static/js/web/*.js.map'",
    "analyze:ios": "source-map-explorer 'dist/_expo/static/js/ios/*.js' 'dist/_expo/static/js/ios/*.js.map'",
    "analyze:android": "source-map-explorer 'dist/_expo/static/js/android/*.js' 'dist/_expo/static/js/android/*.js.map'"
  }
}
```

웹에서 SDK 50의 `server` output을 사용 중이라면, 웹 번들을 매핑할 때는 다음을 사용하세요:

```sh
npx source-map-explorer 'dist/client/_expo/static/js/web/*.js' 'dist/client/_expo/static/js/web/*.js.map'
```

server code가 client에 노출되는 것을 막기 위해 웹 번들은 **dist/client** 하위 디렉터리에 출력됩니다.

production JavaScript 번들을 export할 때는 source map explorer가 source map을 읽을 수 있도록 `--source-maps` 플래그를 포함하세요. Hermes를 사용하는 native 앱이라면 `--no-bytecode` 옵션을 사용해 bytecode 생성을 비활성화할 수 있습니다.

```sh
npx expo export --source-maps --platform web
npx expo export --source-maps --platform ios --no-bytecode
```

이 명령은 출력에 JavaScript 번들과 source map 경로를 보여줍니다. 다음 단계에서 이 경로를 source map explorer에 전달하게 됩니다.

> source map을 production에 publish하지 마세요. 보안 문제와 성능 문제를 모두 일으킬 수 있습니다. 브라우저가 큰 map 파일을 다운로드할 수 있기 때문입니다.

번들을 분석하려면 script를 실행하세요:

```sh
npm run analyze:web
```

이 명령을 실행하면 다음과 같은 오류가 보일 수 있습니다:

```text
You must provide the URL of lib/mappings.wasm by calling SourceMapConsumer.initialize({ 'lib/mappings.wasm': ... }) before using SourceMapConsumer
```

이 문제는 Node.js 18 이상에서 `source-map-explorer`의 [known issue](https://github.com/danvk/source-map-explorer/issues/247) 때문일 가능성이 큽니다. 이를 해결하려면 analyze script를 실행하기 전에 environment variable `NODE_OPTIONS=--no-experimental-fetch`를 설정하세요.

`Unable to map 809/13787 bytes (5.87%)` 같은 경고를 볼 수도 있습니다. 이는 source map에 bundler runtime 정의(예: `__d(() => {}, [])`)가 자주 제외되기 때문에 발생합니다. 이 값은 일관되며 걱정할 이유는 아닙니다.

## Lighthouse

Lighthouse는 웹사이트가 얼마나 빠르고, 접근 가능하며, 성능이 좋은지 확인하는 훌륭한 방법입니다. Chrome의 **Audit** 탭이나 [Lighthouse CLI](https://github.com/GoogleChrome/lighthouse#using-the-node-cli)로 프로젝트를 테스트할 수 있습니다.

`npx expo export -p web`으로 production build를 만들고 이를 제공한 뒤(`npx serve dist`, production deployment, custom server 중 하나 사용), 사이트가 호스팅되는 URL로 Lighthouse를 실행하세요.

```sh
npm install -g lighthouse
npx lighthouse  --view
```
