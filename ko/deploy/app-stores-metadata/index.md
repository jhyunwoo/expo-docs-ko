---
modificationDate: January 27, 2026
title: App stores metadata
description: EAS Metadata를 사용해 앱 스토어 존재 정보를 자동화하고 유지 관리하는 방법에 대한 간단한 개요입니다.
---

# App stores metadata

EAS Metadata를 사용해 앱 스토어 존재 정보를 자동화하고 유지 관리하는 방법에 대한 간단한 개요입니다.

> **EAS Metadata**는 beta 상태이며 breaking change가 있을 수 있습니다.

앱을 app store에 제출할 때는 metadata를 제공해야 합니다. 이 과정은 길고, 종종 앱과 관련 없는 복잡한 주제를 포함합니다. 제공한 정보가 검토된 뒤 문제가 있으면 이 과정을 다시 처음부터 시작해야 합니다.

[**EAS Metadata**](/eas/metadata)를 사용하면 app store dashboard에서 여러 form을 거치는 대신 command line에서 이 정보를 자동화하고 유지 관리할 수 있습니다. 또한 긴 review 대기열 이후 rejection을 유발할 수 있는 잘 알려진 app store 제한 사항도 즉시 식별할 수 있습니다. 이 가이드는 EAS Metadata를 사용해 app store presence를 자동화하고 유지 관리하는 방법을 보여 줍니다.

## Prerequisites

EAS Metadata는 현재 **Apple App Store만 지원합니다**.

> VS Code를 사용 중인가요? **store.config.json** 파일에서 auto-complete, suggestion, warning을 받으려면 [Expo Tools extension](https://github.com/expo/vscode-expo#readme)을 설치하세요.

## Store config 만들기

EAS Metadata는 app store에 업로드하려는 모든 정보를 담기 위해 [store.config.json](/eas/metadata/config) 파일을 사용합니다. 이 파일은 Expo 프로젝트의 루트에 위치합니다.

아래 예시와 같이 프로젝트 디렉터리 루트에 새 **store.config.json** 파일을 만드세요:

```json
{
  "configVersion": 0,
  "apple": {
    "info": {
      "en-US": {
        "title": "Awesome App",
        "subtitle": "Your self-made awesome app",
        "description": "The most awesome app you have ever seen",
        "keywords": ["awesome", "app"],
        "marketingUrl": "https://example.com/en/promo",
        "supportUrl": "https://example.com/en/support",
        "privacyPolicyUrl": "https://example.com/en/privacy"
      }
    }
  }
}
```

위 예시 파일은 JSON schema를 포함합니다. 예시 값을 본인의 값으로 바꾸세요. 보통 앱의 `title`, `subtitle`, `description`, `keywords`, `marketingUrl` 등이 들어갑니다.

**위 예시에서 기억해야 할 중요한 점은 `configVersion` 속성입니다.** 이 속성은 하위 호환되지 않는 변경 사항의 버전 관리를 돕습니다.

> **store.config.json**에 정의할 수 있는 속성에 대한 자세한 내용은 [Schema for EAS Metadata](/eas/metadata/schema#config-schema)를 참고하세요.

## Store config 업로드하기

> **store.config.json**을 app store에 push하기 전에 앱의 새 binary를 먼저 업로드해야 합니다. 자세한 내용은 [App Store submissions](/deploy/submit-to-app-stores)을 참고하세요. binary가 제출되고 처리된 뒤에 아래 단계를 계속 진행할 수 있습니다.

**store.config.json** 파일을 만들고 앱과 관련된 필요한 정보를 추가한 뒤에는, 다음 명령을 실행해 store config를 app store에 push할 수 있습니다:

```sh
eas metadata:push
```

EAS Metadata가 store config에서 문제를 발견하면, 이 명령을 실행할 때 warning을 표시합니다. 오류가 없거나, 가능한 문제를 감수하고 push하는 것을 확인하면, 가능한 한 많이 업로드하려고 시도합니다.

**store.config.json** 파일을 수정하고 최신 변경 사항을 app store에 push하고 싶을 때도 이 명령을 다시 사용할 수 있습니다.

## Next steps

[EAS Metadata schema](/eas/metadata/schema) - EAS Metadata의 store config 레퍼런스입니다.

[Static and dynamic configurations with EAS Metadata](/eas/metadata/config) - EAS Metadata를 구성하는 다양한 방법을 알아보세요.
