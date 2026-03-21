---
modificationDate: January 27, 2026
title: EAS Metadata 시작하기
description: EAS Metadata를 사용해 커맨드라인에서 앱 스토어 존재감을 자동화하고 유지 관리하는 방법을 알아보세요.
---

# EAS Metadata 시작하기

EAS Metadata를 사용해 커맨드라인에서 앱 스토어 존재감을 자동화하고 유지 관리하는 방법을 알아보세요.

> **EAS Metadata**는 beta 상태이며 호환성이 깨지는 변경이 생길 수 있습니다.

EAS Metadata를 사용하면 커맨드라인에서 앱 스토어 존재감을 자동화하고 유지 관리할 수 있습니다. 여러 다른 양식을 거치는 대신 필요한 앱 정보를 모두 담은 [**store.config.json**](/eas/metadata/config#static-store-config) 파일을 사용합니다. 또한 built-in validation을 통해 앱 거절로 이어질 수 있는 일반적인 함정도 찾으려고 시도합니다.

## 사전 요구 사항

현재 EAS Metadata는 **Apple App Store만 지원합니다**.

> VS Code를 사용하나요? [Expo Tools extension](https://github.com/expo/vscode-expo#readme)을 설치하면 **store.config.json** 파일에서 자동 완성, 제안, 경고를 받을 수 있습니다.

## Store config 만들기

먼저 프로젝트의 루트 디렉터리에 **store.config.json** 파일을 만드는 것으로 시작해 봅시다. 이 파일에는 앱 스토어에 업로드하려는 모든 정보가 들어갑니다.

이미 스토어에 앱이 있다면 다음 명령을 실행해 정보를 store config로 가져올 수 있습니다.

```sh
eas metadata:pull
```

아직 스토어에 앱이 없다면 EAS Metadata가 store config를 자동 생성해 줄 수는 없습니다. 대신 새 store config 파일을 만들어야 합니다.

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

> 기본적으로 EAS Metadata는 프로젝트 루트의 **store.config.json** 파일을 사용합니다. **eas.json**의 [`metadataPath`](/submit/eas-json#metadatapath) 속성을 설정해 파일 이름과 위치를 바꿀 수 있습니다.

## Store config 업데이트하기

이제 **store.config.json** 파일을 편집해 앱에 맞게 사용자 지정할 차례입니다. 사용 가능한 모든 옵션은 [store config schema](/eas/metadata/schema)에서 확인할 수 있습니다.

## 새 앱 버전 업로드하기

**store.config.json**을 앱 스토어에 push하기 전에 먼저 앱의 새 binary를 업로드해야 합니다. 자세한 내용은 [uploading new binaries to stores](/submit/introduction)를 참고하세요.

binary가 제출되고 처리되면 store config를 앱 스토어로 push할 수 있습니다.

## Store config 업로드하기

**store.config.json** 설정이 만족스러우면 다음 명령을 실행해 앱 스토어로 push할 수 있습니다.

```sh
eas metadata:push
```

EAS Metadata가 store config에서 문제를 발견하면 이 명령을 실행할 때 경고를 표시합니다. 오류가 없거나, 가능한 문제를 감수하고 push하겠다고 확인하면 가능한 한 많은 항목을 업로드하려고 시도합니다.

store config가 부분적으로 실패하면 store config를 수정한 뒤 다시 시도할 수 있습니다. `eas metadata:push`는 누락된 항목을 다시 push하는 데 사용할 수 있습니다.

## 다음 단계

[Customize the store config](/eas/metadata/config) — 선호하는 workflow에 맞게 store config를 사용자 지정하세요.

[Store config schema](/eas/metadata/schema) — EAS Metadata가 제공하는 모든 설정 옵션을 살펴보세요.
