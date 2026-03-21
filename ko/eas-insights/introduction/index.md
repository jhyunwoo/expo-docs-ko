---
modificationDate: January 15, 2026
title: EAS Insights
description: expo-insights 라이브러리를 사용하는 프로젝트를 위한 preview 서비스인 EAS Insights 소개입니다.
---

# EAS Insights

expo-insights 라이브러리를 사용하는 프로젝트를 위한 preview 서비스인 EAS Insights 소개입니다.

> **EAS Insights**는 beta 상태이며 호환성이 깨지는 변경이 있을 수 있습니다. preview 기간에는 무료로 사용할 수 있습니다.

**EAS Insights**는 프로젝트의 성능, 사용량, 도달 범위를 보여 주는 서비스입니다. 현재 모든 개발자가 사용할 수 있는 Insights preview를 제공하고 있으며, 사용자 피드백과 제안을 바탕으로 새로운 기능과 기능성을 계속 추가할 예정입니다.

EAS Insights를 사용하면 플랫폼, app store version, 기간별 사용량 정보를 제공받아 앱 상태를 쉽게 파악할 수 있습니다.

## EAS Update와의 통합

이미 [EAS Update](/eas-update/introduction)를 사용하고 있다면, 추가적인 클라이언트 측 변경 없이도 특정한 상위 수준의 usage insight를 제공합니다. 이는 업데이트를 확인하기 위한 클라이언트 요청의 데이터를 집계해, 시간에 따른 사용량과 플랫폼별로 나뉜 사용량을 보여 주는 제한된 Insights view를 만들 수 있기 때문입니다.

## `expo-insights` 라이브러리 사용하기

개발자는 프로젝트에 `expo-insights` 라이브러리를 추가해, 단순히 update 요청을 집계하는 것보다 더 정밀한 usage metric과 app store version별 추가 분류를 얻을 수 있습니다. 현재 이 라이브러리는 앱의 cold start와 관련된 클라이언트 이벤트만 전송하는 데 한정되어 있지만, 앞으로는 `expo-insights`를 확장해 더 고급 기능을 지원할 새로운 이벤트 유형과 payload를 제공할 예정입니다.

### 설치

`expo-insights`를 사용하려면 `eas init`을 실행해 앱이 **app.json** / **app.config.js**에서 EAS project에 연결되어 있는지 확인한 뒤, 라이브러리를 설치하세요.

```sh
npm i -g eas-cli
eas init
npx expo install expo-insights
```

라이브러리를 설치한 뒤 [EAS](/build/setup) 또는 [로컬](/guides/local-app-development)에서 build를 생성하세요. 앱이 실행되면 라이브러리가 자동으로 EAS Insights로 이벤트를 전송합니다.

### insight 보기

앱의 insight 데이터를 보려면 EAS dashboard에서 projects 목록으로 이동해 프로젝트를 선택한 뒤, navigation menu에서 **Insights**를 선택하세요.
