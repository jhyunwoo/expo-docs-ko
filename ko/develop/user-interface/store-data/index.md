---
modificationDate: March 09, 2026
title: 데이터 저장하기
description: Expo 프로젝트에서 데이터를 저장할 때 사용할 수 있는 다양한 라이브러리를 알아보세요.
---

# 데이터 저장하기

Expo 프로젝트에서 데이터를 저장할 때 사용할 수 있는 다양한 라이브러리를 알아보세요.

데이터 저장은 모바일 앱에 구현하는 기능에서 필수적인 요소일 수 있습니다. 어떤 유형의 데이터를 저장할지와 앱의 보안 요구 사항에 따라 Expo 프로젝트에서 데이터를 저장하는 방법은 달라집니다. 이 페이지는 프로젝트에 가장 적합한 솔루션을 결정하는 데 도움이 되도록 여러 라이브러리를 소개합니다.

## Expo SecureStore

`expo-secure-store`는 key-value 쌍을 기기에 로컬로 암호화하여 안전하게 저장하는 방법을 제공합니다.

[Expo SecureStore API reference](/versions/latest/sdk/securestore) — expo-secure-store를 설치하고 사용하는 방법에 대한 자세한 내용은 API 문서를 참고하세요.

## Expo FileSystem

`expo-file-system`은 기기에 로컬로 저장된 파일 시스템에 접근할 수 있게 해 줍니다. Expo Go 안에서는 각 프로젝트가 별도의 파일 시스템을 가지며 다른 Expo 프로젝트의 파일에는 접근할 수 없습니다. 하지만 다른 프로젝트가 공유한 콘텐츠를 로컬 파일 시스템에 저장하고, 로컬 파일을 다른 프로젝트와 공유할 수 있습니다. 네트워크 URL에서 파일을 업로드하고 다운로드하는 기능도 제공합니다.

[Expo FileSystem API reference](/versions/latest/sdk/filesystem) — expo-file-system을 설치하고 사용하는 방법에 대한 자세한 내용은 API 문서를 참고하세요.

## Expo SQLite

`expo-sqlite` package는 WebSQL과 비슷한 API를 통해 질의할 수 있는 데이터베이스에 앱이 접근할 수 있게 해 줍니다. 데이터베이스는 앱이 재시작되어도 유지됩니다. 기존 데이터베이스를 가져오고, 데이터베이스를 열고, table을 만들고, item을 삽입하고, 결과를 조회하고 표시하고, prepared statement를 사용하는 데 활용할 수 있습니다.

[Expo SQLite API reference](/versions/latest/sdk/sqlite) — expo-sqlite를 설치하고 사용하는 방법에 대한 자세한 내용은 API 문서를 참고하세요.

## Async Storage

[Async Storage](https://react-native-async-storage.github.io/2.0/integrations/expo/)는 React Native 앱을 위한 비동기식, 비암호화, 지속형 key-value 저장소입니다. API가 단순해서 적은 양의 데이터를 저장하기에 좋은 선택입니다. 사용자 환경설정이나 앱 상태처럼 암호화가 필요하지 않은 데이터를 저장할 때도 적합합니다.

[Async Storage documentation](https://react-native-async-storage.github.io/2.0/api/usage/) — Async Storage를 설치하고 사용하는 방법에 대한 자세한 내용은 문서를 참고하세요.

## 다른 라이브러리

데이터를 저장하는 목적에 따라 사용할 수 있는 다른 라이브러리도 있습니다. 예를 들어 프로젝트에서 암호화가 필요하지 않거나 Async Storage와 비슷하지만 더 빠른 솔루션을 찾고 있을 수 있습니다.

프로젝트 데이터를 저장하는 데 도움이 되는 라이브러리 목록은 [React Native의 라이브러리 목록](https://reactnative.directory/?search=storage)을 확인해 보시길 권장합니다.
