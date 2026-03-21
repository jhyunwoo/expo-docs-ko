---
title: AgeRange
description: Android에서는 Play Age Signals API, iOS에서는 Declared Age Range framework를 사용해 연령대 정보에 접근할 수 있게 해주는 라이브러리입니다.
sourceCodeUrl: 'https://github.com/expo/expo/tree/main/packages/expo-age-range'
packageName: 'expo-age-range'
platforms: ['android', 'ios', 'expo-go']
isAlpha: true
---

# Expo AgeRange

Android에서는 Play Age Signals API, iOS에서는 Declared Age Range framework를 사용해 연령대 정보에 접근할 수 있게 해주는 라이브러리입니다.
Android, iOS, Expo Go에 포함

> **이 라이브러리는 현재 alpha 상태이며, 자주 호환성이 깨지는 변경이 발생할 수 있습니다.**

`expo-age-range`는 사용자 연령대 정보에 대한 접근을 제공합니다. Android에서는 Google의 [Play Age Signals API](https://developer.android.com/google/play/age-signals/use-age-signals-api)를 사용하고, iOS에서는 Apple의 [Declared Age Range framework](https://developer.apple.com/documentation/declaredagerange/)를 사용합니다.

이 라이브러리를 사용하면 앱 사용자의 연령대 정보를 요청해 연령에 적합한 콘텐츠 규정을 준수하고(예: [미국 텍사스주](https://developer.apple.com/news/?id=btkirlj8)), 앱에서 연령에 맞는 경험을 제공할 수 있습니다.

### 제한 사항

simulator runtime은 예상대로 동작하지 않을 수 있으므로, 실제 기기에서 기능을 테스트할 것을 강력히 권장합니다.

Android에서는 Play Age Signals API(beta)가 [공식 Android 문서](https://developer.android.com/google/play/age-signals/use-age-signals-api#integrate-play-age-signals)에 따라 2026년 1월 1일까지 예외를 발생시킬 수 있습니다. 1월 1일부터는 API가 실제 응답을 반환합니다.

## Installation

```sh
npx expo install expo-age-range
```

이를 [기존 React Native 앱](/bare/overview)에 설치하는 경우, 프로젝트에 [`expo`를 설치](/bare/installing-expo-modules)했는지 확인하세요.

## app config에서 구성하기

### iOS 프로젝트 설정

iOS에서 age range API를 사용하려면 Xcode 26.0 이상으로 프로젝트를 빌드해야 합니다. `com.apple.developer.declared-age-range` entitlement가 필요합니다. 이를 [app config](/versions/latest/sdk/config/app) 파일에 추가하세요:

```json
{
  "expo": {
    "ios": {
      "entitlements": {
        "com.apple.developer.declared-age-range": true
      }
    }
  }
}
```

기존 React Native 앱에서 이 라이브러리를 사용하고 있나요?

기존 React Native 프로젝트의 경우, 프로젝트의 **ios/[app]/[app].entitlements** 파일에 entitlement를 추가하세요:

```xml
<key>com.apple.developer.declared-age-range</key>
<true/>
```

## Usage

```tsx
import * as AgeRange from 'expo-age-range';
import { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function App() {
  const [result, setResult] = useState<AgeRange.AgeRangeResponse | { error: string } | null>(null);

  const requestAgeRange = async () => {
    try {
      const ageRange = await AgeRange.requestAgeRangeAsync({
        threshold1: 10,
        threshold2: 13,
        threshold3: 18,
      });
      setResult(ageRange);
    } catch (error) {
      setResult({ error: error.message });
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Request Age Range" onPress={requestAgeRange} />
      {result && (
        <Text style={styles.result}>
          {'error' in result ? `Error: ${result.error}` : `Lower age bound: ${result.lowerBound}`}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  result: {
    marginTop: 20,
    fontSize: 16,
  },
});
```

## Additional resources

-   [Play Age Signals API](https://developer.android.com/google/play/age-signals/use-age-signals-api): age signals에 대한 Android 문서
-   [Declared Age Range framework](https://developer.apple.com/documentation/declaredagerange/): declared age range에 대한 iOS 문서

## API

```ts
import * as AgeRange from 'expo-age-range';
```

## Methods

### `AgeRange.requestAgeRangeAsync(options)`

지원 플랫폼: Android, iOS 26.0+.

| Parameter | Type |
| --- | --- |
| `options` | [AgeRangeRequest](#agerangerequest) |

  

사용자에게 앱과 연령대 정보를 공유할지 묻습니다. 응답은 향후 요청을 위해 OS에 의해 캐시될 수 있습니다.

반환값: `Promise<agerangeresponse>`

사용자의 연령대 응답으로 resolve되거나 오류와 함께 reject되는 promise입니다. 유효한 응답을 얻으려면 사용자가 기기에서 로그인되어 있어야 합니다. 지원되지 않는 경우(iOS 26 미만 및 web)에는 호출이 `lowerBound: 18`을 반환하며, 이는 성인 사용자 응답과 동일합니다.

## Types

### `AgeRangeRequest`

지원 플랫폼: iOS.

사용자에게 연령대 정보를 요청할 때 사용하는 옵션입니다.

| Property | Type | Description |
| --- | --- | --- |
| threshold1 | `number` | 앱에 필요한 최소 연령입니다. |
| threshold2(optional) | `number` | 앱에 대한 선택적 추가 최소 연령입니다. |
| threshold3(optional) | `number` | 앱에 대한 선택적 추가 최소 연령입니다. |

### `AgeRangeResponse`

지원 플랫폼: Android, iOS.

사용자의 연령대 정보를 담고 있는 응답입니다.

연령 경계값과 플랫폼별 메타데이터를 포함합니다.

| Property | Type | Description |
| --- | --- | --- |
| activeParentalControls(optional) | `string[]` | 지원 플랫폼: iOS. 연령대 선언의 일부로 활성화되어 공유된 parental control 목록입니다. |
| ageRangeDeclaration(optional) | `'selfDeclared' | 'guardianDeclared'` | 지원 플랫폼: iOS. 연령대가 사용자 본인에 의해 선언되었는지, 아니면 다른 사람(부모, 보호자, 또는 Family Sharing 그룹의 Family Organizer)에 의해 선언되었는지를 나타냅니다. |
| installId(optional) | `string` | 지원 플랫폼: Android. Google Play가 supervised user install에 할당하는 ID로, 앱 승인 취소를 알리는 데 사용됩니다. |
| lowerBound(optional) | `number` | 해당 사람의 연령대 하한입니다. |
| mostRecentApprovalDate(optional) | `number` | 지원 플랫폼: Android. 가장 최근에 승인된 주요 변경의 효력 발생일(timestamp)입니다. |
| upperBound(optional) | `number` | 해당 사람의 연령대 상한입니다. |
| userStatus(optional) | `'VERIFIED' | 'SUPERVISED' | 'SUPERVISED_APPROVAL_PENDING' | 'SUPERVISED_APPROVAL_DENIED' | 'DECLARED' | 'UNKNOWN'` | 지원 플랫폼: Android. 사용자의 연령 검증 또는 supervision 상태입니다. |

## Error codes

native module이 던지는 모든 error의 `code` 속성에서 사용할 수 있습니다. Android 전용 error code는 [Use Play Age Signals API docs](https://developer.android.com/google/play/age-signals/use-age-signals-api#handle-api-errors)의 "Handle API error codes"를 참고하세요.

| Code | Platform | Description |
| --- | --- | --- |
| `ERR_AGE_RANGE_USER_DECLINED` | iOS | 사용자가 자신의 연령대 공유를 거부했습니다. |
| `ERR_AGE_RANGE_NOT_AVAILABLE` | iOS | 연령대를 사용할 수 없습니다. 가장 가능성 높은 원인은 사용자가 기기에서 Apple account에 로그인되어 있지 않은 경우입니다. |
| `ERR_AGE_RANGE_INVALID_REQUEST` | iOS | 제공된 params가 올바르지 않았습니다. 연령대는 최소 2년 이상 차이가 나야 합니다. |
