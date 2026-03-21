---
title: AgeRange
description: A library that provides access to age range information using Play Age Signals API on Android and Declared Age Range framework on iOS.
sourceCodeUrl: 'https://github.com/expo/expo/tree/main/packages/expo-age-range'
packageName: 'expo-age-range'
platforms: ['android', 'ios', 'expo-go']
isAlpha: true
---

# Expo AgeRange

A library that provides access to age range information using Play Age Signals API on Android and Declared Age Range framework on iOS.
Android, iOS, Included in Expo Go

> **This library is currently in alpha and will frequently experience breaking changes.**

`expo-age-range` provides access to user age range information. It uses Google's [Play Age Signals API](https://developer.android.com/google/play/age-signals/use-age-signals-api) on Android and Apple's [Declared Age Range framework](https://developer.apple.com/documentation/declaredagerange/) on iOS.

This library allows you to request age range information from your app users to help you comply with age-appropriate content regulations (such as in [Texas, USA](https://developer.apple.com/news/?id=btkirlj8)) and provide age-appropriate experiences in your app.

### Limitations

We strongly recommend testing the functionality on a real device, as simulator runtimes may not work as expected.

On Android, the Play Age Signals API (beta) may throw an exception until January 1, 2026, as per the [official Android documentation](https://developer.android.com/google/play/age-signals/use-age-signals-api#integrate-play-age-signals). From January 1, the API will return live responses.

## Installation

```sh
npx expo install expo-age-range
```

If you are installing this in an [existing React Native app](/bare/overview), make sure to [install `expo`](/bare/installing-expo-modules) in your project.

## Configuration in app config

### Setup iOS project

To use the age range API on iOS, you need to build your project with Xcode 26.0 or later. The `com.apple.developer.declared-age-range` entitlement is required. Add it to your [app config](/versions/latest/sdk/config/app) file:

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

Are you using this library in an existing React Native app?

For existing React Native projects, add the entitlement to your project's **ios/[app]/[app].entitlements** file:

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

-   [Play Age Signals API](https://developer.android.com/google/play/age-signals/use-age-signals-api): Android documentation for age signals
-   [Declared Age Range framework](https://developer.apple.com/documentation/declaredagerange/): iOS documentation for declared age range

## API

```ts
import * as AgeRange from 'expo-age-range';
```

## Methods

### `AgeRange.requestAgeRangeAsync(options)`

Supported platforms: Android, iOS 26.0+.

| Parameter | Type |
| --- | --- |
| `options` | [AgeRangeRequest](#agerangerequest) |

  

Prompts the user to share their age range with the app. Responses may be cached by the OS for future requests.

Returns: `Promise<agerangeresponse>`

A promise that resolves with user's age range response, or rejects with an error. The user needs to be signed in on the device to get a valid response. When not supported (earlier than iOS 26 and web), the call returns `lowerBound: 18`, which is equivalent to the response of an adult user.

## Types

### `AgeRangeRequest`

Supported platforms: iOS.

Options for requesting age range information from the user.

| Property | Type | Description |
| --- | --- | --- |
| threshold1 | `number` | The required minimum age for your app. |
| threshold2(optional) | `number` | An optional additional minimum age for your app. |
| threshold3(optional) | `number` | An optional additional minimum age for your app. |

### `AgeRangeResponse`

Supported platforms: Android, iOS.

Response containing the user's age range information.

Contains age boundaries and platform-specific metadata.

| Property | Type | Description |
| --- | --- | --- |
| activeParentalControls(optional) | `string[]` | Supported platforms: iOS. List of parental controls enabled and shared as a part of age range declaration. |
| ageRangeDeclaration(optional) | `'selfDeclared' | 'guardianDeclared'` | Supported platforms: iOS. Indicates whether the age range was declared by the user themselves or someone else (parent, guardian, or Family Organizer in a Family Sharing group). |
| installId(optional) | `string` | Supported platforms: Android. An ID assigned to supervised user installs by Google Play, used to notify you of revoked app approval. |
| lowerBound(optional) | `number` | The lower limit of the person’s age range. |
| mostRecentApprovalDate(optional) | `number` | Supported platforms: Android. The effective date (timestamp) of the most recent significant change that was approved. |
| upperBound(optional) | `number` | The upper limit of the person’s age range. |
| userStatus(optional) | `'VERIFIED' | 'SUPERVISED' | 'SUPERVISED_APPROVAL_PENDING' | 'SUPERVISED_APPROVAL_DENIED' | 'DECLARED' | 'UNKNOWN'` | Supported platforms: Android. The user's age verification or supervision status. |

## Error codes

Available in the `code` property of any error thrown by the native module. For Android-specific error codes, see "Handle API error codes" in [Use Play Age Signals API docs](https://developer.android.com/google/play/age-signals/use-age-signals-api#handle-api-errors).

| Code | Platform | Description |
| --- | --- | --- |
| `ERR_AGE_RANGE_USER_DECLINED` | iOS | User declined to share their age range. |
| `ERR_AGE_RANGE_NOT_AVAILABLE` | iOS | Age range not available. The most likely cause is that user is not signed in to their Apple account on the device. |
| `ERR_AGE_RANGE_INVALID_REQUEST` | iOS | The provided params were invalid. The age ranges need to be minimum 2 years apart. |
