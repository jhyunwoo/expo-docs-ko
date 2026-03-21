---
modificationDate: August 05, 2024
title: macOS와 Linux에서 bundler cache 비우기
description: macOS와 Linux에서 Expo CLI 또는 React Native CLI와 함께 Yarn 또는 npm을 사용할 때 bundler cache를 비우는 방법을 알아보세요.
---

# macOS와 Linux에서 bundler cache 비우기

macOS와 Linux에서 Expo CLI 또는 React Native CLI와 함께 Yarn 또는 npm을 사용할 때 bundler cache를 비우는 방법을 알아보세요.

> Windows에서 development cache를 비워야 하나요? [여기에서 관련 명령어를 확인하세요.](/troubleshooting/clear-cache-windows)

프로젝트에는 의도한 대로 실행되지 않게 만들 수 있는 여러 종류의 cache가 연결되어 있습니다. cache를 비우면 오래되었거나 손상된 데이터와 관련된 문제를 우회하는 데 도움이 될 수 있으며, troubleshooting과 debugging을 할 때 자주 유용합니다.

여러 cache를 비우려면 다음을 실행하세요:

## Expo CLI와 Yarn

```sh
rm -rf node_modules
yarn cache clean
yarn
watchman watch-del-all
rm -fr $TMPDIR/haste-map-*
rm -rf $TMPDIR/metro-cache
npx expo start --clear
```

## Expo CLI와 npm

```sh
rm -rf node_modules
npm cache clean --force
npm install
watchman watch-del-all
rm -fr $TMPDIR/haste-map-*
rm -rf $TMPDIR/metro-cache
npx expo start --clear
```

## React Native CLI와 Yarn

```sh
rm -rf node_modules
yarn cache clean
yarn
watchman watch-del-all
rm -fr $TMPDIR/haste-map-*
rm -rf $TMPDIR/metro-cache
yarn start -- --reset-cache
```

## React Native CLI와 npm

```sh
rm -rf node_modules
npm cache clean --force
npm install
watchman watch-del-all
rm -fr $TMPDIR/haste-map-*
rm -rf $TMPDIR/metro-cache
npm start -- --reset-cache
```

## 이 명령어들이 하는 일

인터넷에서 찾은 명령어를 실행하기 전에 그 명령어를 이해하는 습관을 들이는 것이 좋습니다. 아래에서는 Expo CLI, npm, Yarn 각각에 대해 각 명령어를 설명하지만, 대응하는 React Native CLI 명령어도 동일하게 동작합니다.

| Command | Description |
| --- | --- |
| `rm -rf node_modules` | 프로젝트의 모든 dependency를 삭제합니다 |
| `yarn cache clean` | 전역 Yarn cache를 비웁니다 |
| `npm cache clean --force` | 전역 npm cache를 비웁니다 |
| `yarn`/`npm install` | 모든 dependency를 다시 설치합니다 |
| `watchman watch-del-all` | `watchman` 파일 watcher를 재설정합니다 |
| `rm -rf $TMPDIR/<cache>` | 지정한 packager/bundler cache 파일 또는 디렉터리를 비웁니다 |
| `npx expo start --clear` | development server를 다시 시작하고 JavaScript transformation cache를 비웁니다 |
