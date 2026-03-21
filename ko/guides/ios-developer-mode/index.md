---
modificationDate: December 19, 2025
title: iOS Developer Mode
description: iOS 16 이상에서 internal distribution build와 local development build를 실행하기 위해 iOS Developer Mode 설정을 활성화하는 방법을 알아보세요.
---

# iOS Developer Mode

iOS 16 이상에서 internal distribution build와 local development build를 실행하기 위해 iOS Developer Mode 설정을 활성화하는 방법을 알아보세요.

> 이는 enterprise provisioning으로 서명된 build나 iOS Simulator에 설치된 build에는 적용되지 않습니다.

iOS 16 이상을 실행하는 기기는 [internal distribution](/build/internal-distribution) build(EAS로 빌드한 경우 포함) 또는 local development build를 기기에 설치한 뒤 실행하기 전에 OS 수준의 **Developer Mode** 설정을 활성화해야 합니다.

기기에서 Developer Mode를 활성화하는 방법은 두 가지입니다:

-   iOS 기기에서 직접 활성화하기
-   Xcode가 설치된 Mac에 iOS 기기를 연결해 활성화하기

## 사전 요구 사항

아래 지침은 기기당 한 번만 따르면 됩니다.

## Developer Mode 활성화하기

### iOS 기기에서 직접 활성화하기

아래 단계를 따르기 전에 **Developer Mode를 활성화하기 전에 development build를 기기에 설치하세요.** build가 생성되면 EAS dashboard의 지침에 따라 iOS 기기에 설치하세요.

기기에 build가 설치되면 앱 아이콘을 누르세요. Developer Mode를 활성화하라는 alert가 열립니다. **OK**를 누르세요.

Settings 앱으로 이동한 뒤 **Privacy & Security** > **Developer Mode**로 이동하세요.

토글을 활성화하세요. iOS에서 기기를 재시동하라는 prompt가 표시됩니다. **Restart**를 누르세요.

기기가 다시 시작되면 잠금을 해제하세요. 시스템 alert가 나타나야 합니다. **Turn On**을 누른 뒤, 메시지가 표시되면 기기 암호를 입력하세요.

이제 Developer Mode가 활성화되었습니다. 이제 internal distribution build와 local development build를 사용할 수 있습니다.

Developer Mode는 언제든지 끌 수 있습니다. 다만 다시 활성화하려면 같은 과정을 반복해야 합니다.

### iOS 기기를 Mac에 연결하기

> **참고:** 아래 단계를 따르기 전에 Mac에 Xcode가 설치되어 있어야 합니다.

Mac에 연결해서 Developer Mode를 활성화하는 경우에는 먼저 iOS 기기에 development build를 설치할 필요가 없습니다. 다음과 같이 하면 됩니다:

USB 케이블을 사용해 iOS 기기를 Mac에 연결하세요. iOS 기기에서 **Trust This Computer?** alert가 표시되면 **Trust**를 누르세요.

Xcode를 열고 메뉴 막대에서 **Window** > **Devices and Simulators**로 이동하세요.

**Devices** 아래에 "Previous preparation error: Developer Mode disabled"라는 경고와 함께 iOS 기기에서 Developer Mode를 활성화하는 지침이 표시됩니다.

iOS 기기에서 **Settings** > **Privacy & Security** > **Developer Mode**를 여세요.

토글을 활성화하세요. iOS에서 기기를 재시동하라는 prompt가 표시됩니다. **Restart**를 누르세요.

기기가 다시 시작되면 잠금을 해제하세요. 시스템 alert가 나타나야 합니다. **Turn On**을 누르고, 메시지가 표시되면 기기 암호를 입력하세요.

이제 Developer Mode가 활성화되었습니다. 이제 internal distribution build와 local development build를 사용할 수 있습니다.

Developer Mode는 언제든지 끌 수 있습니다. 다만 다시 활성화하려면 같은 과정을 반복해야 합니다.
