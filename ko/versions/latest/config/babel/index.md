---
title: babel.config.js
description: Babel 구성 파일 레퍼런스입니다.
---

# babel.config.js

Babel 구성 파일 레퍼런스입니다.

Babel은 최신 JavaScript(ES6+)를 모바일 기기의 JavaScript 엔진과 호환되는 버전으로 변환하는 JavaScript 컴파일러로 사용됩니다.

`npx create-expo-app`을 사용해 새로 만든 모든 Expo 프로젝트는 Babel을 자동으로 구성하며 기본 프리셋으로 [`babel-preset-expo`](https://github.com/expo/expo/tree/main/packages/babel-preset-expo)를 사용합니다. Babel 구성을 사용자 지정해야 하는 경우가 아니라면 **babel.config.js** 파일을 만들 필요는 없습니다.

## babel.config.js 만들기

프로젝트에 사용자 지정 Babel 구성이 필요하다면, 아래 단계를 따라 프로젝트에 **babel.config.js** 파일을 생성해야 합니다:

1.  프로젝트 루트로 이동한 다음 터미널에서 아래 명령어를 실행합니다. 그러면 프로젝트 루트에 **babel.config.js** 파일이 생성됩니다.

```sh
npx expo customize babel.config.js
```

2.  **babel.config.js** 파일에는 다음 기본 구성이 들어 있습니다:

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

3.  **babel.config.js** 파일을 변경했다면 변경 사항을 적용하려면 Metro 번들러를 다시 시작해야 하며, Expo CLI의 `--clear` 옵션을 사용해 Metro 번들러 캐시를 비워야 합니다:

```sh
npx expo start --clear
```

## babel-preset-expo

[`babel-preset-expo`](https://github.com/expo/expo/tree/main/packages/babel-preset-expo)는 Expo 프로젝트에서 사용되는 기본 프리셋입니다. 이는 기본 React Native 프리셋(`@react-native/babel-preset`)을 확장하고 데코레이터, 웹 라이브러리의 tree-shaking, 폰트 아이콘 로딩에 대한 지원을 추가합니다.
