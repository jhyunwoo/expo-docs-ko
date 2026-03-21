---
modificationDate: June 16, 2024
title: qr.expo.dev
description: qr.expo.dev의 QR 코드 생성기 참고 문서입니다.
---

# qr.expo.dev

qr.expo.dev의 QR 코드 생성기 참고 문서입니다.

qr.expo.dev는 Expo 브랜드가 적용된 QR 코드를 생성하는 클라우드 함수입니다. 이 함수는 [EAS Update](/eas-update/introduction)용 QR 코드를 생성하며, 이 QR 코드는 [development builds](/develop/development-builds/introduction)와 Expo Go에서 업데이트를 미리 보기 위해 사용됩니다.

예를 들어, 당신과 팀이 development build를 가지고 있고 특정 빌드 채널의 최신 업데이트를 로드하고 싶다면, 다음 endpoint로 이동해 QR 코드를 생성할 수 있습니다.

```text
https://qr.expo.dev/eas-update?projectId=your-project-id&runtimeVersion=your-runtime-version&channel=your-channel
```

그러면 다음과 같은 QR 코드 SVG가 생성됩니다.

이 QR 코드는 다음 URL을 나타냅니다.

```text
exp+your-slug://expo-development-client/?url=https://u.expo.dev/your-project-id?runtime-version=your-runtime-version&channel-name=your-channel
```

이 URL은 development build로 deep link하고, 지정된 채널의 최신 업데이트를 가져오라고 지시합니다.

> URL을 공유하는 편이 더 편리하다면, 쿼리 파라미터에 `format=url`을 추가해 URL을 직접 요청할 수 있습니다.

## General

다음 파라미터는 `/eas-update` endpoint에 적용됩니다.

### Base query parameters

다음 기본 쿼리 파라미터는 `/eas-update`로 보내는 어떤 요청에도 포함할 수 있습니다.

| Param | Required | Default | Description |
| --- | --- | --- | --- |
| `slug` | No | exp | development build를 대상으로 하려면 [`slug`](/versions/latest/config/app#slug)를 [app config](/workflow/configuration)에서 사용합니다. 그렇지 않으면 Expo Go를 대상으로 `"exp"`를 사용합니다. |
| `appScheme` (deprecated) | No | exp | `slug`로 대체되었습니다. 대신 `slug`를 사용하세요. |
| `host` | No | u.expo.dev | 업데이트 요청을 처리하는 서버의 호스트 이름입니다. |
| `format` | No | svg | endpoint는 기본적으로 SVG를 반환합니다. 일반 텍스트 URL을 받으려면 `url`을 사용하세요. |

### Update by device traits

Preview 및 production build는 `runtimeVersion`과 `channel` 속성을 사용해 EAS Update 서비스에 요청을 보냅니다. 다음 쿼리 파라미터를 사용하면 이 동작을 에뮬레이션할 수 있습니다.

| Param | Required | Description |
| --- | --- | --- |
| `projectId` | Yes | 프로젝트의 ID |
| `runtimeVersion` | Yes | 빌드의 [runtime version](/eas-update/runtime-versions) |
| `channel` | Yes | 빌드의 채널 이름 |

#### Example

```text
https://qr.expo.dev/eas-update?projectId=your-project-id&runtimeVersion=your-runtime-version&channel=your-channel
```

### Update by ID

플랫폼별 ID가 주어지면 특정 업데이트에 대한 QR 코드를 만들 수 있습니다.

| Param | Required | Description |
| --- | --- | --- |
| `updateId` | Yes | 업데이트의 ID |

#### Example

```text
https://qr.expo.dev/eas-update?updateId=your-update-id
```

### Update by group ID

업데이트의 group ID가 주어지면 update group에 대한 QR 코드를 만들 수 있습니다.

| Param | Required | Description |
| --- | --- | --- |
| `projectId` | Yes | 프로젝트의 ID |
| `groupId` | Yes | 업데이트 그룹의 ID |

#### Example

```text
https://qr.expo.dev/eas-update?projectId=your-project-id&groupId=your-update-id
```

### Update by branch ID

branch의 ID를 사용해 QR 코드를 만들 수 있으며, 이 경우 해당 branch에서 사용 가능한 최신 업데이트가 반환됩니다.

| Param | Required | Description |
| --- | --- | --- |
| `projectId` | Yes | 프로젝트의 ID |
| `branchId` | Yes | branch의 ID |

#### Example

```text
https://qr.expo.dev/eas-update?projectId=your-project-id&branchId=your-branch-id
```

### Update by channel ID

channel의 ID를 사용해 QR 코드를 만들 수 있으며, 이 경우 해당 channel에 매핑된 branch 또는 branches에서 사용 가능한 최신 업데이트가 반환됩니다.

| Param | Required | Description |
| --- | --- | --- |
| `projectId` | Yes | 프로젝트의 ID |
| `channelId` | Yes | channel의 ID |

#### Example

```text
https://qr.expo.dev/eas-update?projectId=your-project-id&channelId=your-channel-id
```
