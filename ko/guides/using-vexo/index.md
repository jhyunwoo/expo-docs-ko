---
modificationDate: March 05, 2026
title: Vexo 사용하기
description: 실시간 사용자 분석을 위해 Vexo를 설치하고 구성하는 방법을 안내하는 가이드입니다.
---

# Vexo 사용하기

실시간 사용자 분석을 위해 Vexo를 설치하고 구성하는 방법을 안내하는 가이드입니다.

[Vexo](https://www.vexo.co/)는 Expo 애플리케이션을 위한 실시간 사용자 분석을 제공하여, 사용자가 앱과 어떻게 상호작용하는지 이해하고, 마찰 지점을 식별하며, 참여도를 개선할 수 있도록 도와줍니다.

두 줄만 통합하면 Vexo가 자동으로 데이터를 수집하기 시작하므로, 앱의 사용자 경험을 최적화하는 데 도움이 되는 실행 가능한 인사이트를 얻을 수 있습니다. 필요하다면 커스텀 이벤트도 만들 수 있습니다.

## 기능

1.  **완전한 대시보드**
    -   활성 사용자
    -   세션 시간
    -   다운로드 수
    -   OS 분포
    -   버전 채택 현황
    -   지역별 인사이트
    -   인기 화면
2.  **세션 리플레이**
    -   실제 사용자 세션을 시청하며 상호작용을 이해할 수 있습니다.
3.  **히트맵**
    -   앱에서 가장 활발하게 상호작용하는 영역을 식별할 수 있습니다.
4.  **퍼널**
    -   사용자 흐름을 분석하고 전환율을 최적화할 수 있습니다.
5.  **커스텀 이벤트와 대시보드 개인화**
    -   커스텀 이벤트를 생성해 특정 사용자 행동을 추적할 수 있습니다.
    -   핵심 지표를 시각화하도록 대시보드를 맞춤 설정할 수 있습니다.

## 시작하기

1.  계정 만들기: [Vexo 계정](https://www.vexo.co/)에 가입하세요.
    
2.  새 앱 만들기: 새 앱을 만들라는 안내가 표시됩니다. 이름을 지정하고(나중에 변경할 수 있습니다), 제출하면 API 키를 받게 됩니다.
    
3.  Vexo 패키지 설치하기: 프로젝트에서 다음 명령어를 실행하세요:
    
    ```sh
    # npm
    npm install vexo-analytics
    
    # yarn
    yarn add vexo-analytics
    
    # pnpm
    pnpm add vexo-analytics
    
    # bun
    bun install vexo-analytics
    ```
    
4.  Vexo 초기화하기: 앱의 entry 파일(예: Expo Router를 사용하는 경우 **index.js**, **App.js**, 또는 **src/app/_layout.tsx**)에 다음 코드를 추가하세요:
    
    ```tsx
    import { vexo } from 'vexo-analytics';
    
    // You may want to wrap this with `if (!__DEV__) { ... }` to only run Vexo in production.
    vexo('YOUR_API_KEY');
    ```
    
5.  앱 다시 빌드하고 실행하기: `vexo-analytics`에는 네이티브 코드가 포함되어 있으므로 애플리케이션을 다시 빌드해야 합니다.
    
6.  통합 확인하기: Vexo에서 앱 페이지로 이동하면 첫 번째 이벤트가 표시될 것입니다.
    

## 호환성

-   Expo: Vexo는 [Development builds](/develop/development-builds/introduction)와 호환되며 추가 configuration plugin이 필요하지 않습니다.
-   Expo Go: Vexo는 커스텀 네이티브 코드가 필요하므로 지원되지 않습니다.

## Vexo 더 알아보기

Expo와 함께 Vexo를 사용하는 방법을 더 알아보려면 [Vexo 문서](https://docs.vexo.co/)를 확인하세요.
