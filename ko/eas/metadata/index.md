---
modificationDate: March 01, 2026
title: EAS Metadata
description: EAS Metadata를 사용해 커맨드라인에서 앱 스토어 존재감을 자동화하고 유지 관리하는 방법을 개괄적으로 알아보세요.
---

# EAS Metadata

EAS Metadata를 사용해 커맨드라인에서 앱 스토어 존재감을 자동화하고 유지 관리하는 방법을 개괄적으로 알아보세요.

> **EAS Metadata**는 beta 상태이며 호환성이 깨지는 변경이 생길 수 있습니다.

**EAS Metadata**는 앱 스토어 존재감을 자동화하고 유지 관리할 수 있게 해 주는 EAS(Expo Application Services)의 커맨드라인 도구입니다.

사용자가 앱을 이용하기 전에 여러 앱 스토어에 많은 정보를 제공해야 합니다. 이 정보는 종종 앱과는 직접 관련이 없는 복잡한 주제에 관한 것입니다. 정보를 제출한 뒤에는 긴 심사 과정을 시작해야 합니다. 심사자가 제출한 정보에서 문제를 발견하면 이 과정을 다시 시작해야 합니다.

EAS Metadata는 앱 스토어 대시보드의 여러 양식을 거치거나 프로젝트 환경을 벗어나지 않고도 정보를 제공할 수 있도록 [**store.config.json**](/eas/metadata/config#static-store-config) 파일을 사용합니다. 여기에 built-in validation이 더해져, 심사 전에라도 제공하는 내용에 대해 즉시 피드백을 받을 수 있습니다.

## 빠른 시작

> 아래의 `eas` 명령은 EAS CLI가 필요합니다. 자세한 내용은 [How to install EAS CLI](/eas/cli#installation)를 참고하세요.

다음 명령을 실행해 store config를 앱 스토어로 push할 수 있습니다.

```sh
eas metadata:push
```

> VS Code를 사용하나요? [Expo Tools extension](https://github.com/expo/vscode-expo#readme)을 설치하면 **store.config.json** 파일에서 자동 완성, 제안, 경고를 받을 수 있습니다.

## 주요 기능

### 쉽게 구성, 업데이트, 유지 관리하기

EAS Metadata는 기존 앱에서 [새 store config를 만들거나 생성하는 방식](/eas/metadata/getting-started#create-the-store-config)으로 시작할 수 있습니다. 이 store config를 사용하면 프로젝트 환경을 벗어나지 않고 앱 스토어 정보를 빠르게 업데이트할 수 있습니다. 변경 사항을 앱 스토어에 push하기 전에 EAS Metadata는 앱 거절로 이어질 수 있는 일반적인 함정을 찾아줍니다.

### Validation을 통한 더 빠른 피드백 루프

EAS Metadata에는 앱 스토어로 아무것도 전송하기 전에도 동작하는 built-in validation이 포함되어 있습니다. 이 validation은 심사를 시작하지 않고도 정보를 더 빠르게 다듬을 수 있게 해 줍니다. 대신 모든 정보가 제공되고 문제가 감지되지 않았을 때 심사 과정을 시작할 수 있습니다.

> **store.config.json** 파일에 대한 자동 완성, 제안, 경고를 받으려면 [VS Code Expo Tools extension](https://github.com/expo/vscode-expo#readme)을 설치하세요.

### 동적 store config로 확장 가능

EAS Metadata는 JSON 파일만 사용하는 대신 더 [동적인 store config](/eas/metadata/config#dynamic-store-config)도 지원합니다. 이 동적 store config를 사용하면 외부 서비스 같은 다른 곳에서 정보를 가져올 수 있습니다. 비동기 함수를 사용하면 선호하는 workflow에 맞춰 EAS Metadata를 조정하는 데 사실상 제한이 없습니다.

## EAS Metadata를 사용해야 하는 경우

| Scenario | Recommendation |
| --- | --- |
| 앱 스토어 정보를 프로그래밍 방식으로 관리하고 싶다 | ✓ |
| 심사 전에 metadata 문제를 잡고 싶다 | ✓ |
| 스토어 존재감 업데이트를 팀과 함께 작업하고 싶다 | ✓ |
| Google Play Store listing을 관리하고 싶다 | ✗ |
| 스크린샷을 업로드하고 싶다 | ✗ |

## 자주 묻는 질문(FAQ)

Google Play Store에서 EAS Metadata를 사용할 수 있나요?

우리는 EAS Metadata에 계속 투자하고 있으며 시간이 지나면서 기능을 확장할 예정입니다. 이는 곧 아직 EAS Metadata에 구현되지 않은 기능도 있다는 뜻입니다. Google Play Store는 현재 아직 구현되지 않은 기능 중 하나입니다.

현재 존재하는 모든 기능은 [store config schema](/eas/metadata/schema#config-schema)에서 확인하세요.

지원되지 않는 앱 스토어 기능은 어떻게 사용하나요?

EAS Metadata는 store config의 데이터를 앱 스토어로 전송할 뿐입니다. EAS Metadata가 아직 다루지 않는 기능이 필요하다고 해서 앱 스토어 대시보드를 사용하는 것을 막지는 않습니다.

EAS Metadata를 사용하는 동안 앱 스토어 대시보드에서 무언가를 수정했다면, 그런 변경 후에는 반드시 `eas metadata:pull`을 실행하세요. 로컬 store config를 업데이트하지 않으면 EAS Metadata가 push할 때 해당 변경을 덮어쓸 수 있습니다.

제한된 앱 스토어 계정에서 EAS Metadata는 어떻게 사용하나요?

EAS Metadata가 정보에 접근하려면 먼저 앱 스토어에 인증해야 합니다. 대규모 기업 계정으로 작업하는 경우 EAS Metadata의 모든 기능을 사용할 권한이 없을 수도 있습니다. 이런 경우에도 EAS Metadata를 사용할 수는 있지만, 보안 제한 때문에 더 까다로운 경우가 많습니다.

## 시작하기

[Introduction](/eas/metadata/getting-started) — 새 프로젝트에 EAS Metadata를 추가하거나 기존 앱에서 store config를 생성하세요.

[Customize the store config](/eas/metadata/config) — 선호하는 workflow에 맞게 store config를 사용자 지정하세요.

[Store config schema](/eas/metadata/schema) — EAS Metadata가 제공하는 모든 설정 옵션을 살펴보세요.
