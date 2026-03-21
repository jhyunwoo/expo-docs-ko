---
modificationDate: February 26, 2026
title: 개발 시작하기
description: Expo 프로젝트를 처음 수정하고 기기에서 바로 반영되는 모습을 확인해 보세요.
---

# 개발 시작하기

Expo 프로젝트를 처음 수정하고 기기에서 바로 반영되는 모습을 확인해 보세요.

## development server 시작하기

development server를 시작하려면 다음 명령을 실행하세요:

```sh
npx expo start
```

## 기기에서 앱 열기

위 명령을 실행하면 터미널에 QR 코드가 표시됩니다. 이 QR 코드를 스캔해 기기에서 앱을 여세요.

Android Emulator나 iOS Simulator를 사용 중이라면 각각 a 또는 i를 눌러 앱을 열 수 있습니다.

문제가 있나요?

컴퓨터와 기기가 같은 Wi-Fi 네트워크에 연결되어 있는지 확인하세요.

그래도 동작하지 않는다면 router 설정 때문일 수 있습니다. 공용 네트워크에서는 흔한 문제입니다. development server를 시작할 때 **Tunnel** connection type을 선택한 다음 QR 코드를 다시 스캔해 이 문제를 우회할 수 있습니다.

```sh
npx expo start --tunnel
```

> **Tunnel** connection type을 사용하면 **LAN** 또는 **Local**보다 앱 reload 속도가 훨씬 느려지므로 가능하다면 tunnel은 피하는 것이 좋습니다. 네트워크의 다른 기기에서 여러분의 머신에 접근하려면 **Tunnel**이 필요할 수 있으므로, 이 경우 개발 속도를 높이기 위해 emulator나 simulator를 설치해 사용하는 것이 좋습니다.

## 첫 번째 변경하기

코드 에디터에서 **src/app/index.tsx** 파일을 열고 변경을 하나 적용하세요.

```diff
- Welcome to Expo
+ Hello World!
```

기기에서 변경 사항이 보이지 않나요?

기본적으로 Expo Go는 파일이 변경될 때마다 앱을 자동으로 다시 불러오도록 설정되어 있지만, 혹시 동작하지 않을 때를 대비해 이를 활성화하는 단계를 다시 확인해 봅시다.

-   [Expo CLI에서 development mode가 활성화되어 있는지](/workflow/development-mode#development-mode) 확인하세요.
    
-   Expo 앱을 종료한 뒤 다시 여세요.
    
-   앱을 다시 연 뒤 기기를 흔들어 developer menu를 여세요. Cmd ⌘ + D를 누르세요.
    
-   **Fast Refresh**가 활성화되어 있다면 한 번 토글하세요. **Disable Fast Refresh**가 보인다면 developer menu를 닫으세요. 이제 다시 한 번 변경을 적용해 보세요.
    

## 파일 구조

아래에서 기본 프로젝트의 파일 구조를 익혀 볼 수 있습니다:

Files

### app

앱의 navigation이 들어 있으며, file-based 방식으로 구성됩니다. **src/app** 디렉터리의 파일 구조가 앱의 navigation을 결정합니다.

앱에는 **src/app/index.tsx**와 **src/app/explore.tsx**라는 두 파일로 정의된 두 개의 route가 있습니다. **src/app/_layout.tsx**의 layout 파일은 platform별 **AppTabs** component를 사용해 tab navigator를 설정합니다.

## 기능

기본 프로젝트 template에는 다음 기능이 포함되어 있습니다:

Default project

### File-based routing

앱에는 **src/app/index.tsx**와 **src/app/explore.tsx** 두 개의 screen이 있습니다. **src/app/_layout.tsx**의 layout 파일은 platform별 **AppTabs** component를 사용해 navigation을 설정하며, Android와 iOS에서는 native tab을 사용하고 웹에서는 Expo Router UI tab을 사용합니다.
