---
modificationDate: January 27, 2026
title: EAS Metadata 구성하기
description: EAS Metadata를 구성하는 여러 방법을 알아보세요.
---

# EAS Metadata 구성하기

EAS Metadata를 구성하는 여러 방법을 알아보세요.

> **EAS Metadata**는 beta 상태이며 호환성이 깨지는 변경이 생길 수 있습니다.

EAS Metadata는 프로젝트 _루트_ 에 있는 **store.config.json** 파일로 구성합니다.

**eas.json**의 [`metadataPath`](/submit/eas-json#metadatapath) 속성으로 store config 파일의 경로나 이름을 구성할 수 있습니다. 기본 JSON 형식 외에도 EAS Metadata는 JavaScript 파일을 사용한 더 동적인 config도 지원합니다.

## 정적 store config

EAS Metadata의 기본 store config 유형은 단순한 JSON 파일입니다. 아래 코드 조각은 영어(미국)로 작성된 기본 App Store 정보를 담은 예시 store config를 보여 줍니다.

모든 구성 옵션은 [store config schema](/eas/metadata/schema)에서 확인할 수 있습니다.

> [VS Code Expo Tools extension](https://github.com/expo/vscode-expo#readme)이 설치되어 있다면 **store.config.json** 파일에서 자동 완성, 제안, 경고를 받을 수 있습니다.

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

## 동적 store config

때로는 Metadata 속성에 동적 값이 더 적합할 수 있습니다. 예를 들어 Metadata의 **copyright notice**에는 현재 연도가 들어가야 합니다. 이런 작업은 EAS Metadata로 자동화할 수 있습니다.

콘텐츠를 동적으로 생성하려면 먼저 JavaScript config 파일 **store.config.js**를 만드세요. 그런 다음 **eas.json** 파일의 [`metadataPath`](/eas/json#metadatapath) 속성을 사용해 JS config 파일을 선택합니다.

> `eas metadata:pull`은 동적 store config 파일을 업데이트할 수 없습니다. 대신 구성된 파일과 같은 이름의 JSON 파일을 생성합니다. `eas metadata:pull`의 데이터를 재사용하려면 이 JSON 파일을 import할 수 있습니다.

```js
// Use the data from `eas metadata:pull`
const config = require('./store.config.json');

const year = new Date().getFullYear();
config.apple.copyright = `${year} Acme, Inc.`;

module.exports = config;
```

```json
{
  "submit": {
    "production": {
      "ios": {
        "metadataPath": "./store.config.js"
      }
    }
  }
}
```

## 외부 콘텐츠를 사용하는 store config

현지화를 위해 외부 서비스를 사용하는 경우 외부 콘텐츠를 가져와야 합니다. EAS Metadata는 동적 store config 파일이 export하는 동기 함수와 비동기 함수를 모두 지원합니다. 함수 결과는 store와 validation 및 동기화를 수행하기 전에 await됩니다.

> **store.config.js** 함수는 Node.js에서 평가됩니다. secret처럼 특별한 값이 필요하다면 environment variables를 사용하세요.

```js
// Use the data from `eas metadata:pull`
const config = require('./store.config.json');

module.exports = async () => {
  const year = new Date().getFullYear();
  const info = await fetchLocalizations('...').then(response => response.json());

  config.apple.copyright = `${year} Acme, Inc.`;
  config.apple.info = info;

  return config;
};
```

```json
{
  "submit": {
    "production": {
      "ios": {
        "metadataPath": "./store.config.js"
      }
    }
  }
}
```
