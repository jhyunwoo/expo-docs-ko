---
modificationDate: September 17, 2024
title: '"React Native version mismatch" 오류'
description: Expo 또는 React Native 앱에서 React Native version mismatch가 무엇을 의미하는지와 이를 해결하는 방법을 알아보세요.
---

# "React Native version mismatch" 오류

Expo 또는 React Native 앱에서 React Native version mismatch가 무엇을 의미하는지와 이를 해결하는 방법을 알아보세요.

Expo 또는 React Native 앱을 개발할 때는 다음과 같은 오류를 자주 만나게 됩니다:

```sh
React Native version mismatch.
JavaScript version: X.XX.X
Native version: X.XX.X
Make sure you have rebuilt the native code...
```

## 이 오류가 의미하는 것

터미널에서 실행 중인 bundler(`npx expo start` 사용)가 디바이스나 emulator의 네이티브 앱과 다른 JavaScript 버전의 `react-native`를 사용하고 있습니다. 이는 React Native 또는 Expo SDK 버전을 업그레이드한 뒤에 발생할 수 있고, _또는_ 잘못된 로컬 development server에 연결했을 때도 발생할 수 있습니다.

## 해결 방법

-   현재 실행 중인 development server를 모두 종료하세요(모든 터미널 프로세스는 `ps` 명령으로 확인할 수 있고, Expo CLI 또는 React Native community CLI 프로세스는 `ps -A | grep "expo\|react-native"`로 찾을 수 있습니다).
    
-   Expo 프로젝트라면 **app.json** 파일의 `sdkVersion` 필드를 제거하거나, 그 값이 **package.json** 파일의 `expo` dependency 값과 일치하는지 확인하세요.
    
-   Expo 프로젝트라면 `react-native` 버전이 올바른지도 확인해야 합니다. `npx expo-doctor`를 실행하면 설치해야 하는 `react-native` 버전에 대한 경고가 표시됩니다. 더 새로운 SDK로 업그레이드했다면 반드시 `npx expo install --fix`를 실행하고 안내에 따르세요. Expo CLI가 `expo`와 `react-native` 같은 패키지의 dependency 버전이 서로 맞도록 정렬해 줍니다.
    
-   bare React Native 프로젝트이고, 이 오류가 React Native 버전을 업그레이드한 직후 발생했다면, 업그레이드 단계를 각각 올바르게 수행했는지 다시 확인해야 합니다.
    
-   마지막으로:
    
    -   `rm -rf node_modules && npm cache clean --force && npm install && watchman watch-del-all && rm -rf $TMPDIR/haste-map-* && rm -rf $TMPDIR/metro-cache && npx expo start --clear`를 실행해 bundler cache를 비우세요
        -   npm을 사용하는 경우 명령어는 [여기](/troubleshooting/clear-cache-macos-linux)에서 확인할 수 있습니다.
        -   Windows를 사용하는 경우 명령어는 [여기](/troubleshooting/clear-cache-windows)에서 확인할 수 있습니다.
    -   bare React Native 프로젝트라면 `npx pod-install`을 실행한 뒤, 네이티브 프로젝트를 다시 빌드하세요(Android 재빌드는 `yarn android`, iOS 재빌드는 `yarn ios` 실행)
