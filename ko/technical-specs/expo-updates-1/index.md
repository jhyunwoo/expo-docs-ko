---
modificationDate: March 13, 2023
title: Expo Updates v1
description: 버전 1
---

# Expo Updates v1

버전 1

## 소개

이 문서는 여러 플랫폼에서 실행되는 Expo 앱에 업데이트를 전달하기 위한 protocol인 Expo Updates의 명세입니다.

### 준수성

이 명세를 준수하는 서버와 클라이언트 라이브러리는 모든 규범적 요구 사항을 충족해야 합니다. 준수 요구 사항은 이 문서에서 설명적 단언과 의미가 명확하게 정의된 핵심 용어를 통해 설명합니다.

이 문서의 규범적 부분에서 사용하는 핵심 용어 "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", "OPTIONAL"은 [IETF RFC 2119](https://tools.ietf.org/html/rfc2119)에 설명된 의미로 해석해야 합니다. 이러한 핵심 용어는 명시적으로 비규범적이라고 선언되지 않는 한 소문자로 나타나더라도 동일한 의미를 유지합니다.

이 protocol을 준수하는 구현은 추가 기능을 제공할 수 있지만, 명시적으로 금지된 경우나 그 밖에 준수하지 않는 결과를 초래하는 경우에는 그렇게 해서는 안 됩니다. 관련이 있는 경우, 준수하는 클라이언트는 알 수 없는 필드를 허용하고 무시해야 합니다.

### 개요

준수하는 서버와 클라이언트 라이브러리는 이 명세에서 더 정확하게 설명하는 지침과 함께 [RFC 7231](https://tools.ietf.org/html/rfc7231)에 설명된 HTTP spec을 따라야 합니다.

-   _업데이트_는 [_매니페스트_](/technical-specs/expo-updates-1#manifest-body)와 그 매니페스트 안에서 참조되는 asset들을 함께 정의한 것입니다.
-   [_지시문_](/technical-specs/expo-updates-1#directive-body)은 서버가 클라이언트에 어떤 동작을 수행하도록 지시하는 메시지로 정의합니다.

Expo Updates는 업데이트와 지시문을 조립해 클라이언트에 전달하기 위한 protocol입니다.

이 명세의 주요 독자는 Expo Application Services와 내부 요구 사항을 충족하기 위해 자체 업데이트 서버를 운영하려는 조직입니다.

## 클라이언트

> [reference client library](https://github.com/expo/expo/tree/main/packages/expo-updates)를 참고하세요.

준수하는 Expo Updates 클라이언트 라이브러리를 실행하는 앱은 클라이언트 라이브러리의 업데이트 데이터베이스에 저장된 가장 최신 _업데이트_를 로드해야 하며, 필요한 경우 업데이트의 매니페스트 [_metadata_](/technical-specs/expo-updates-1#manifest-body) 내용을 기준으로 필터링한 뒤 로드할 수 있습니다.

다음은 준수하는 Expo Updates 클라이언트 라이브러리가 준수하는 서버에서 새 업데이트를 가져오는 방법을 설명합니다.

1.  클라이언트 라이브러리는 헤더에 명시된 제약 조건과 함께 가장 최신 업데이트와 지시문을 요청하는 [request](/technical-specs/expo-updates-1#request)를 보내야 합니다.
2.  [response](/technical-specs/expo-updates-1#response)를 받으면 클라이언트 라이브러리는 그 내용을 처리해야 합니다.
    -   _업데이트_가 포함된 응답이라면, 클라이언트 라이브러리는 매니페스트에 지정된 새로운 asset을 다운로드하고 저장하기 위한 추가 요청을 진행해야 합니다. 매니페스트와 asset을 함께 새로운 _업데이트_로 간주합니다. 클라이언트 라이브러리는 로컬 상태를 수정해 새 업데이트가 로컬 저장소에 추가되었음을 반영합니다. 또한 응답 [headers](/technical-specs/expo-updates-1#manifest-response-headers)에서 찾은 새로운 `expo-manifest-filters`와 `expo-server-defined-headers`로 로컬 상태를 업데이트합니다.
    -   _지시문_이 포함된 응답이라면, 클라이언트 라이브러리는 지시문 유형에 따라 지시문을 소비하고 그에 맞게 로컬 상태를 수정합니다.

## 요청

준수하는 클라이언트 라이브러리는 다음 헤더와 함께 GET 요청을 보내야 합니다.

1.  이 Expo Updates 명세의 버전 1을 지정하기 위한 `expo-protocol-version: 1`
2.  클라이언트가 실행 중인 플랫폼 유형을 지정하기 위한 `expo-platform`
    -   iOS는 반드시 `expo-platform: ios`여야 합니다.
    -   Android는 반드시 `expo-platform: android`여야 합니다.
    -   이들 플랫폼 중 하나가 아니라면 서버는 400 또는 404를 반환해야 합니다.
3.  `expo-runtime-version`은 클라이언트와 호환되는 runtime version이어야 합니다. runtime version은 클라이언트가 실행 중인 네이티브 코드 구성을 규정합니다. 이 값은 클라이언트를 빌드할 때 설정해야 합니다. 예를 들어 iOS 클라이언트에서는 plist 파일에 이 값을 설정할 수 있습니다.
4.  이전 응답의 [server defined headers](/technical-specs/expo-updates-1#response)에 의해 규정된 모든 헤더

준수하는 클라이언트 라이브러리는 [지원되는 response 구조](/technical-specs/expo-updates-1#response)에 따라 `accept: application/expo+json`, `accept: application/json`, `accept: multipart/mixed` 중 하나를 보낼 수 있으며, `accept: application/expo+json, application/json, multipart/mixed`를 보내는 것이 권장됩니다. 준수하는 클라이언트 라이브러리는 [RFC 7231](https://datatracker.ietf.org/doc/html/rfc7231#section-5.3.1)에 지정된 "q" 매개변수를 사용해 선호도를 표현할 수 있으며, 기본값은 `1`입니다.

[code signing](/technical-specs/expo-updates-1#code-signing) 검증을 수행하도록 구성된 준수하는 클라이언트 라이브러리는, 준수하는 서버가 매니페스트 응답에 `expo-signature` 헤더를 포함할 것을 기대함을 나타내기 위해 `expo-expect-signature` 헤더를 보내야 합니다. `expo-expect-signature`는 다음 key-value 쌍을 포함할 수 있는 [Expo SFV](/technical-specs/expo-sfv-0) dictionary입니다.

-   `sig`는 준수하는 서버가 `sig` key에 서명을 담아 응답해야 함을 나타내는 boolean `true`를 담는 것이 권장됩니다.
-   `keyid`는 클라이언트가 서명 검증에 사용할 공개 키의 keyId를 담는 것이 권장됩니다.
-   `alg`는 클라이언트가 서명 검증에 사용할 알고리즘을 담는 것이 권장됩니다.

예시:

```text
expo-protocol-version: 1
accept: application/expo+json;q=0.9, application/json;q=0.8, multipart/mixed
expo-platform: *
expo-runtime-version: *
expo-expect-signature: sig, keyid="root", alg="rsa-v1_5-sha256"
```

## 응답

준수하는 서버는 아래 두 가지 응답 구조 중 최소 하나에 맞는 응답을 반환해야 하며, 둘 중 하나 또는 둘 모두를 지원할 수 있습니다. 지원하지 않는 응답 구조를 요청받은 경우 서버는 HTTP `406` 오류 상태로 응답해야 합니다. 요청된 protocol 버전에 대해 호환되지 않는 응답을 반환하려는 서버도 역시 HTTP `406` 오류 상태로 응답해야 합니다.

-   `content-type: application/json` 또는 `content-type: application/expo+json`인 응답에서는 [공통 응답 헤더](/technical-specs/expo-updates-1#common-response-headers)와 [기타 응답 헤더](/technical-specs/expo-updates-1#other-response-headers)를 응답 헤더로 보내야 하고, [매니페스트 본문](/technical-specs/expo-updates-1#manifest-body)을 응답 본문으로 보내야 합니다. 이 형식의 응답은 여러 응답 파트를 지원하지 않으므로 _지시문_을 지원하지 않으며, 제공해야 할 가장 최신 응답이 _업데이트_가 아닐 경우 HTTP `406` 오류 상태로 응답해야 합니다.
-   `content-type: multipart/mixed`인 응답은 [multipart response](/technical-specs/expo-updates-1#multipart-response) 섹션에 명시된 구조를 따라야 합니다.
-   파트가 없는 [multipart response](/technical-specs/expo-updates-1#multipart-response)는 HTTP `204` 상태와 빈 콘텐츠로 응답할 수 있으며, 이 경우 `content-type` 응답 헤더도 없어집니다.

어떤 업데이트와 헤더를 반환할지는 요청 헤더 값에 따라 달라집니다. 준수하는 서버는 [request headers](/technical-specs/expo-updates-1#request)가 부과하는 모든 매개변수와 제약을 만족하면서 생성 시간 기준으로 가장 최신인 업데이트를 반환해야 합니다. 서버는 요청 제약을 모두 만족하는 여러 업데이트 중 하나를 선택할 때, 헤더와 source IP address를 포함한 요청의 어떤 속성이든 사용할 수 있습니다.

### 공통 응답 헤더

```text
expo-protocol-version: 1
expo-sfv-version: 0
expo-manifest-filters: <expo-sfv>
expo-server-defined-headers: <expo-sfv>
cache-control: *
content-type: *
```

-   `expo-protocol-version`은 이 명세에서 정의한 protocol 버전을 설명하며 반드시 `1`이어야 합니다.
-   `expo-sfv-version`은 반드시 `0`이어야 합니다.
-   `expo-manifest-filters`는 [Expo SFV](/technical-specs/expo-sfv-0) dictionary입니다. 이는 [manifest](/technical-specs/expo-updates-1#manifest-body)에 포함된 `metadata` 속성을 기준으로 클라이언트 라이브러리에 저장된 업데이트를 필터링하는 데 사용됩니다. 필터에 필드가 언급되면, 해당 필드는 metadata에 없거나 같아야만 그 업데이트가 포함됩니다. 클라이언트 라이브러리는 더 최신 응답으로 덮어쓰기 전까지 manifest filters를 저장해야 합니다.
-   `expo-server-defined-headers`는 [Expo SFV](/technical-specs/expo-sfv-0) dictionary입니다. 이는 클라이언트 라이브러리가 더 최신 dictionary로 덮어쓰기 전까지 저장해야 하는 헤더를 정의하며, 이후의 모든 [update request](/technical-specs/expo-updates-1#request)에 반드시 포함되어야 합니다.
-   `cache-control`은 적절히 짧은 기간으로 설정해야 합니다. 가장 최신 manifest가 반환되도록 `cache-control: private, max-age=0` 값을 사용하는 것이 권장됩니다. 더 긴 cache age를 설정하면 오래된 업데이트가 반환될 수 있습니다.
-   `content-type`은 [RFC 7231](https://tools.ietf.org/html/rfc7231#section-3.4.1)에 정의된 _proactive negotiation_으로 결정해야 합니다. 클라이언트 라이브러리는 각 manifest 요청에 `accept` 헤더를 보내도록 [요구](/technical-specs/expo-updates-1#request)되므로, 이 값은 항상 `application/expo+json` 또는 `application/json`이어야 합니다. 그렇지 않으면 요청은 `406` 오류를 반환합니다.

### 기타 응답 헤더

```text
expo-signature: *
```

-   `expo-signature`는 manifest 요청에 `expo-expect-signature` 헤더가 포함된 경우 [code signing](/technical-specs/expo-updates-1#code-signing) 검증 단계에서 사용할 매니페스트 서명을 담는 것이 권장됩니다. 이것은 다음 key-value 쌍을 포함할 수 있는 [Expo SFV](/technical-specs/expo-sfv-0) dictionary입니다.
    -   `sig`는 매니페스트의 서명을 담아야 합니다. 이 필드 이름은 `expo-expect-signature`의 필드 이름과 일치합니다.
    -   `keyid`는 서버가 응답 서명에 사용한 키의 keyId를 담을 수 있습니다. 클라이언트는 이 `keyid`와 일치하는 certificate를 사용해 서명을 검증하는 것이 권장됩니다.
    -   `alg`는 서버가 응답 서명에 사용한 알고리즘을 담을 수 있습니다. 클라이언트는 이 필드가 `keyid`와 일치하는 certificate에 정의된 알고리즘과 일치할 때만 사용하는 것이 권장됩니다.

### Multipart 응답

이 형식의 업데이트 응답은 [RFC 2046](https://tools.ietf.org/html/rfc2046#section-5.1)에 정의된 `multipart/mixed` MIME type으로 정의됩니다.

이 응답 형식의 헤더는 [공통 응답 헤더](/technical-specs/expo-updates-1#common-response-headers)와 같으며, 다음 예외가 있습니다.

-   `content-type`은 [RFC 2046](https://tools.ietf.org/html/rfc2046#section-5.1)에 정의된 `multipart/mixed` 값을 사용하는 것이 권장됩니다.

파트 순서는 엄격하지 않습니다. 파트가 없는 multipart 응답(본문 길이가 0)은 아무 동작도 하지 않는 것으로 간주해야 하지만(사용 가능한 업데이트나 지시문이 없음), 그럼에도 응답 헤더는 보내고 클라이언트가 처리해야 합니다.

각 파트는 다음과 같이 정의됩니다.

1.  OPTIONAL `"manifest"` part:
    -   part header `content-disposition: form-data; name="manifest"`를 가져야 합니다. 첫 번째 매개변수(`form-data`)는 `form-data`가 아니어도 되지만, `name` 매개변수 값은 반드시 `manifest`여야 합니다.
    -   part header `content-type: application/json` 또는 `application/expo+json`을 가져야 합니다.
    -   code signing을 사용하는 경우 [other response headers](/technical-specs/expo-updates-1#other-response-headers)에 정의된 `expo-signature` part header를 가지는 것이 권장됩니다.
    -   [manifest body](/technical-specs/expo-updates-1#manifest-body)를 part body로 보내야 합니다.
2.  OPTIONAL `"extensions"` part:
    -   part header `content-disposition: form-data; name="extensions"`를 가져야 합니다. 첫 번째 매개변수(`form-data`)는 `form-data`가 아니어도 되지만, `name` 매개변수 값은 반드시 `extensions`여야 합니다.
    -   part header `content-type: application/json`을 가져야 합니다.
    -   [extensions-body](/technical-specs/expo-updates-1#extensions-body)를 part body로 보내야 합니다.
3.  OPTIONAL `"directive"` part:
    -   part header `content-disposition: form-data; name="directive"`를 가져야 합니다. 첫 번째 매개변수(`form-data`)는 `form-data`가 아니어도 되지만, `name` 매개변수 값은 반드시 `directive`여야 합니다.
    -   part header `content-type: application/json` 또는 `application/expo+json`을 가져야 합니다.
    -   code signing을 사용하는 경우 [other response headers](/technical-specs/expo-updates-1#other-response-headers)에 정의된 `expo-signature` part header를 가지는 것이 권장됩니다.
    -   [directive body](/technical-specs/expo-updates-1#directive-body)를 part body로 보내야 합니다.

### 매니페스트 본문

아래 [TypeScript](https://www.typescriptlang.org/)로 표현한 `Manifest` 정의와 각 필드의 자세한 설명을 모두 만족하는 JSON으로 정의합니다.

```ts
type Manifest = {
  id: string;
  createdAt: string;
  runtimeVersion: string;
  launchAsset: Asset;
  assets: Asset[];
  metadata: { [key: string]: string };
  extra: { [key: string]: any };
};

type Asset = {
  hash?: string;
  key: string;
  contentType: string;
  fileExtension?: string;
  url: string;
};
```

-   `id`: ID는 매니페스트를 고유하게 식별해야 하며 UUID여야 합니다.
    
-   `createdAt`: 업데이트가 생성된 날짜와 시간은 클라이언트 라이브러리가 가장 최신 업데이트를 선택하는 데 필수적입니다(`expo-manifest-filters` 헤더가 제공하는 제약이 있는 경우 이를 따릅니다). datetime은 [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)에 따라 형식을 지정해야 합니다.
    
-   `runtimeVersion`: 개발자가 정의하는 어떤 문자열이든 될 수 있습니다. 연관된 업데이트를 실행하는 데 필요한 네이티브 코드 구성을 규정합니다.
    
-   `launchAsset`: 애플리케이션 코드의 진입점이 되는 특별한 asset입니다. 이 asset의 `fileExtension` 필드는 무시되며 생략하는 것이 권장됩니다.
    
-   `assets`: JavaScript, pictures, fonts 등 업데이트 번들에서 사용하는 asset들의 배열입니다. 업데이트를 실행하기 전에 모든 asset(`launchAsset` 포함)을 디스크에 다운로드해야 하며, asset `key`와 디스크 상 위치의 매핑을 애플리케이션 코드에 제공해야 합니다.
    
-   각 asset object의 속성:
    
    -   `hash`: 무결성을 보장하기 위한 파일의 Base64URL-encoded SHA-256 hash입니다. Base64URL encoding은 [IETF RFC 4648](https://datatracker.ietf.org/doc/html/rfc4648#section-5)에 정의되어 있습니다.
    -   `key`: 업데이트의 애플리케이션 코드에서 이 asset을 참조할 때 사용하는 key입니다. 예를 들어 이 key는 bundler처럼 애플리케이션 코드를 처리하는 별도의 빌드 단계에서 생성될 수 있습니다.
    -   `contentType`: [RFC 2045](https://tools.ietf.org/html/rfc2045)에 정의된 파일의 MIME type입니다. 예를 들어 `application/javascript`, `image/jpeg` 등이 있습니다.
    -   `fileExtension`: 파일을 클라이언트에 저장할 때 사용할 것을 제안하는 확장자입니다. iOS 같은 일부 플랫폼에서는 특정 파일 유형을 확장자와 함께 저장해야 합니다. 확장자는 반드시 `.`로 시작해야 합니다. 예를 들어 **.jpeg**입니다. launchAsset 같은 일부 경우에는 이 필드보다 로컬에서 결정한 확장자를 우선해 이 필드가 무시됩니다. 이 필드가 생략되고 로컬에서 규정한 확장자도 없다면, asset은 확장자 없이 저장됩니다. 예를 들어 끝에 `.`이 없는 `./filename` 형태입니다. 준수하는 클라이언트는 파일 확장자가 비어 있지 않은데 `.` 접두사가 없다면 그 앞에 `.`를 붙이는 것이 권장됩니다.
    -   `url`: 파일을 가져올 수 있는 위치입니다.
-   `metadata`: 업데이트와 연결된 metadata입니다. 문자열 값을 갖는 dictionary입니다. 서버는 업데이트 필터링에 사용하길 원하는 어떤 값이든 반환할 수 있습니다. metadata는 함께 제공되는 `expo-manifest-filters` 헤더가 정의한 필터를 통과해야 합니다.
    
-   `extra`: third-party configuration과 같은 선택적 "extra" 정보를 저장하기 위한 공간입니다. 예를 들어 업데이트가 Expo Application Services(EAS)에 호스팅된다면 EAS project ID를 포함할 수 있습니다.
    
    ```json
    "extra": {
      "eas": {
        "projectId": "00000000-0000-0000-0000-000000000000"
      }
    }
    ```
    

### Extensions 본문

아래 [TypeScript](https://www.typescriptlang.org/)로 표현한 `Extensions` 정의와 각 필드의 자세한 설명을 모두 만족하는 JSON으로 정의합니다.

```ts
type Extensions = {
  assetRequestHeaders: ExpoAssetHeaderDictionary;
  ...
}

type ExpoAssetHeaderDictionary = {
  [assetKey: string]: {
    [headerName: string]: string,
  };
}
```

-   `assetRequestHeaders`: asset 요청에 포함할 header `(key, value)` 쌍의 dictionary를 담을 수 있습니다. key와 value는 모두 문자열이어야 합니다.

### Directive 본문

아래 [TypeScript](https://www.typescriptlang.org/)로 표현한 `Directive` 정의와 각 필드의 자세한 설명을 모두 만족하는 JSON으로 정의합니다.

```ts
type Directive = {
  type: string;
  parameters?: { [key: string]: any };
  extra?: { [key: string]: any };
};
```

-   `type`: 지시문의 유형입니다.
-   `parameters`: `type`별로 필요한 추가 정보를 담을 수 있습니다.
-   `extra`: third-party 정보와 같은 선택적 "extra" 정보를 저장하기 위한 공간입니다. 예를 들어 업데이트가 Expo Application Services(EAS)에 호스팅된다면 EAS project ID를 포함할 수 있습니다.

준수하는 클라이언트 라이브러리와 서버는 애플리케이션의 필요에 맞는 지시문 유형을 정의하고 구현할 수 있습니다. 예를 들어 Expo Application Services는 지금까지 `rollBackToEmbedded`라는 한 가지 유형을 사용하며, 이는 expo-updates 라이브러리에 다운로드된 다른 업데이트 대신 호스트 애플리케이션에 포함된 업데이트를 사용하도록 지시합니다.

## Asset 요청

준수하는 클라이언트 라이브러리는 매니페스트에 지정된 asset URL로 GET 요청을 보내야 합니다. 클라이언트 라이브러리는 매니페스트에 지정된 asset의 content type을 수락하는 header를 포함하는 것이 권장됩니다. 또한 클라이언트 라이브러리가 처리할 수 있는 compression encoding을 명시하는 것이 권장됩니다.

예시 헤더:

```text
accept: image/jpeg, */*
accept-encoding: br, gzip
```

준수하는 클라이언트 라이브러리는 또한 이 asset key에 대해 [`assetRequestHeaders`](/technical-specs/expo-updates-1#manifest-extensions)에 포함된 모든 header `(key, value)` 쌍을 반드시 포함해야 합니다.

## Asset 응답

특정 URL에 있는 asset은 클라이언트 라이브러리가 언제든 어떤 업데이트에 대해서든 asset을 가져올 수 있으므로 변경되거나 제거되어서는 안 됩니다. 준수하는 클라이언트는 asset의 base64url-encoded SHA-256 hash가 매니페스트에 있는 해당 asset의 `hash` 필드와 일치하는지 검증해야 합니다.

### Asset 응답 헤더

asset은 요청의 `accept-encoding` header에 따라 클라이언트가 지원하는 compression 형식으로 인코딩되어야 합니다. 서버는 압축되지 않은 asset을 제공할 수 있습니다. 응답에는 asset의 MIME type을 담은 `content-type` header가 반드시 포함되어야 합니다. 예를 들면 다음과 같습니다.

```text
content-encoding: br
content-type: application/javascript
```

주어진 URL의 asset은 변경되어서는 안 되므로, asset에는 긴 기간의 `cache-control` header를 설정해 제공하는 것이 권장됩니다. 예를 들면 다음과 같습니다.

```text
cache-control: public, max-age=31536000, immutable
```

### 압축

asset은 [Gzip](https://www.gnu.org/software/gzip/)과 [Brotli](https://github.com/google/brotli) 압축으로 제공할 수 있어야 합니다.

## 코드 서명

Expo Updates는 매니페스트와 지시문 본문에 대한 코드 서명을 지원합니다. 매니페스트를 코드 서명하면 asset hash가 매니페스트에 포함되어 있고 준수하는 클라이언트가 이를 검증하므로 asset도 전이적으로 서명됩니다. 준수하는 클라이언트는 private key를 사용해 매니페스트나 지시문에 서명해 달라고 요청할 수 있으며, 이후 매니페스트나 지시문을 사용하거나 해당 매니페스트 asset을 다운로드하기 전에 반드시 대응되는 코드 서명 certificate를 사용해 서명을 검증해야 합니다. 클라이언트는 서명 certificate가 self-signed trusted root certificate이거나 trusted root certificate가 서명한 certificate chain 안에 있는지 검증해야 합니다. 어느 경우든 root certificate는 애플리케이션이나 디바이스 운영 체제에 내장되어 있어야 합니다.
