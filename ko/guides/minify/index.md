---
modificationDate: December 11, 2025
title: JavaScript minify하기
description: Metro bundler와 함께 Expo CLI에서 JavaScript minification 과정을 커스터마이즈하는 방법을 알아보세요.
---

# JavaScript minify하기

Metro bundler와 함께 Expo CLI에서 JavaScript minification 과정을 커스터마이즈하는 방법을 알아보세요.

Minification은 최적화 빌드 단계입니다. source code에서 공백 축약, 주석 제거, 정적인 연산 단축처럼 불필요한 문자를 제거합니다. 이 과정은 최종 크기를 줄이고 로딩 시간을 개선합니다.

## Expo CLI의 minification

Expo CLI에서는 production export 중에 JavaScript 파일에 대해 minification이 수행됩니다(`npx expo export`, `npx expo export:embed`, `eas build` 등의 명령이 실행될 때).

예를 들어 프로젝트에 다음 코드 조각이 있다고 해보겠습니다:

```js
// This comment will be stripped
console.log('a' + ' ' + 'long' + ' string' + ' to ' + 'collapse');
```

이 코드는 Expo CLI에 의해 다음과 같이 minify됩니다:

```js
console.log('a long string to collapse');
```

> **팁:** 주석은 `/** @preserve */` 지시어를 사용해 유지할 수 있습니다.

Expo CLI의 기본 minification은 대부분의 프로젝트에 충분합니다. 하지만 속도에 맞춰 최적화하거나 로그 같은 추가 기능을 제거하려면 minifier를 커스터마이즈할 수 있습니다.

## console 로그 제거하기

production build에서 console 로그를 제거할 수 있습니다. Terser minifier config의 `drop_console` 옵션을 사용하세요.

```js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.minifierConfig = {
  compress: {
    // The option below removes all console logs statements in production.
    drop_console: true,
  },
};

module.exports = config;
```

특정 로그만 유지하고 싶다면 제거할 console 타입 배열을 전달할 수도 있습니다. 예를 들어 `drop_console: ['log', 'info']`는 `console.log`와 `console.info`를 제거하지만 `console.warn`과 `console.error`는 유지합니다.

## Minifier 커스터마이즈하기

서로 다른 minifier는 속도와 압축률 사이에서 각기 다른 tradeoff를 가집니다. 프로젝트의 **metro.config.js** 파일을 수정해 Expo CLI가 사용하는 minifier를 커스터마이즈할 수 있습니다.

### Terser

> [`terser`](https://github.com/terser/terser)는 기본 minifier입니다([Metro@0.73.0 changelog](https://github.com/facebook/metro/releases/tag/v0.73.0)).

프로젝트에 Terser를 설치하려면 다음 명령을 실행하세요:

```sh
yarn add --dev metro-minify-terser
```

`transformer.minifierPath`로 Terser를 minifier로 설정하고, `transformer.minifierConfig`에 [`terser` 옵션](https://github.com/terser/terser#compress-options)을 전달하세요.

```js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.minifierPath = 'metro-minify-terser';
config.transformer.minifierConfig = {
  // Terser options...
};

module.exports = config;
```

### Unsafe Terser 옵션

모든 JavaScript engine에서 동작하지 않을 수도 있는 추가 압축을 원한다면 [`unsafe` `compress` 옵션](https://terser.org/docs/miscellaneous/#the-unsafe-compress-option)을 활성화하세요:

```js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.minifierPath = 'metro-minify-terser';

config.transformer.minifierConfig = {
  compress: {
    // Enable all unsafe optimizations.
    unsafe: true,
    unsafe_arrows: true,
    unsafe_comps: true,
    unsafe_Function: true,
    unsafe_math: true,
    unsafe_symbols: true,
    unsafe_methods: true,
    unsafe_proto: true,
    unsafe_regexp: true,
    unsafe_undefined: true,
    unused: true,
  },
};

module.exports = config;
```

### esbuild

[`esbuild`](https://esbuild.github.io/)는 `uglify-es`와 `terser`보다 기하급수적으로 빠르게 minify하는 데 사용됩니다. 자세한 내용은 [`metro-minify-esbuild`](https://github.com/EvanBacon/metro-minify-esbuild#usage) 사용법을 참고하세요.

### Uglify

아래 단계를 따라 [`uglify-es`](https://github.com/mishoo/UglifyJS)를 사용할 수 있습니다:

프로젝트에 Uglify를 설치하려면 다음 명령을 실행하세요:

```sh
yarn add --dev metro-minify-uglify
```

> 프로젝트의 `metro-minify-uglify` 버전이 `metro` 버전과 일치하는지 확인하세요.

`transformer.minifierPath`로 Uglify를 minifier로 설정하고, `transformer.minifierConfig`에 [옵션](https://github.com/mishoo/UglifyJS#compress-options)을 전달하세요.

```js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.minifierPath = 'metro-minify-uglify';
config.transformer.minifierConfig = {
  // Options: https://github.com/mishoo/UglifyJS#compress-options
};

module.exports = config;
```
