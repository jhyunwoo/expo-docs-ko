---
title: Accelerometer
description: 기기의 accelerometer sensor에 접근할 수 있게 해주는 라이브러리입니다.
sourceCodeUrl: 'https://github.com/expo/expo/tree/main/packages/expo-sensors'
packageName: 'expo-sensors'
iconUrl: '/static/images/packages/expo-sensors.png'
platforms: ['android', 'ios*', 'web', 'expo-go']
---

# Expo Accelerometer

기기의 accelerometer sensor에 접근할 수 있게 해주는 라이브러리입니다.
Android, iOS(기기 전용), Web, Expo Go에 포함

`expo-sensors`의 `Accelerometer`는 기기의 accelerometer sensor와, 3차원 공간에서의 가속도 변화, 즉 움직임이나 진동에 반응할 수 있는 관련 listener에 대한 접근을 제공합니다.

## Installation

```sh
npx expo install expo-sensors
```

이를 [기존 React Native 앱](/bare/overview)에 설치하는 경우, 프로젝트에 [`expo`를 설치](/bare/installing-expo-modules)했는지 확인하세요.

## Usage

```jsx
import { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';

export default function App() {
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);

  const _slow = () => Accelerometer.setUpdateInterval(1000);
  const _fast = () => Accelerometer.setUpdateInterval(16);

  const _subscribe = () => {
    setSubscription(Accelerometer.addListener(setData));
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Accelerometer: (in gs where 1g = 9.81 m/s^2)</Text>
      <Text style={styles.text}>x: {x}</Text>
      <Text style={styles.text}>y: {y}</Text>
      <Text style={styles.text}>z: {z}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={subscription ? _unsubscribe : _subscribe} style={styles.button}>
          <Text>{subscription ? 'On' : 'Off'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_slow} style={[styles.button, styles.middleButton]}>
          <Text>Slow</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_fast} style={styles.button}>
          <Text>Fast</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  text: {
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
});
```

## API

```js
import { Accelerometer } from 'expo-sensors';
```

## Classes

### `Accelerometer`

지원 플랫폼: Android, iOS, Web.

타입: Class extends [DeviceSensor](/versions/latest/sdk/sensors)<[AccelerometerMeasurement](#accelerometermeasurement)\>

구독 가능한 sensor를 위한 기본 class입니다. 이 class가 내보내는 event는 타입 매개변수 `Measurement`로 지정된 measurement입니다.

Accelerometer 메서드

### `addListener(listener)`

지원 플랫폼: Android, iOS, Web.

| Parameter | Type | Description |
| --- | --- | --- |
| `listener` | Listener<[AccelerometerMeasurement](#accelerometermeasurement)\> | accelerometer 업데이트를 사용할 수 있을 때 호출되는 callback입니다. 호출되면 listener에는 `AccelerometerMeasurement` object인 단일 인수가 전달됩니다. |

  

accelerometer 업데이트를 구독합니다.

반환값: `EventSubscription`

listener 구독을 해제하고 싶을 때 `remove()`를 호출할 수 있는 subscription입니다.

### `getListenerCount()`

지원 플랫폼: Android, iOS, Web.

등록된 listener 수를 반환합니다.

반환값: `number`

### `getPermissionsAsync()`

지원 플랫폼: Android, iOS, Web.

sensor 접근에 대한 사용자의 권한을 확인합니다.

반환값: `Promise<permissionresponse>`

### `hasListeners()`

지원 플랫폼: Android, iOS, Web.

sensor에 등록된 listener가 있는지를 나타내는 boolean 값을 반환합니다.

반환값: `boolean`

### `isAvailableAsync()`

지원 플랫폼: Android, iOS, Web.

> sensor를 사용하려고 하기 전에 항상 사용 가능 여부를 확인해야 합니다.

기기에서 accelerometer가 활성화되어 있는지 여부를 반환합니다.

모바일 web에서는 이 module을 사용하기 전에 먼저 사용자 상호작용(예: touch event) 안에서 `Accelerometer.requestPermissionsAsync()`를 호출해야 합니다. `status`가 `granted`와 다르면, 최종 사용자에게 settings를 열어야 할 수 있다는 점을 안내해야 합니다.

**web**에서는 timer를 시작하고 event가 발생하는지 기다립니다. 이를 통해 iOS 기기에서 **Settings > Safari > Motion & Orientation Access**에 있는 **device orientation** API가 비활성화되어 있는지 예측할 수 있습니다. 일부 기기는 `DeviceMotion`이 이제 보안 API로 간주되기 때문에 사이트가 **HTTPS**로 호스팅되지 않으면 event를 발생시키지 않습니다. `DeviceMotion` 상태를 감지하는 공식 API는 없으므로, 이 API는 web에서 때때로 신뢰할 수 없을 수 있습니다.

반환값: `Promise<boolean>`

accelerometer 사용 가능 여부를 나타내는 `boolean`으로 resolve되는 promise입니다.

### `removeAllListeners()`

지원 플랫폼: Android, iOS, Web.

등록된 모든 listener를 제거합니다.

반환값: `void`

> **Deprecated:** 대신 subscription.remove()를 사용하세요.

### `removeSubscription(subscription)`

지원 플랫폼: Android, iOS, Web.

| Parameter | Type |
| --- | --- |
| `subscription` | `EventSubscription` |

  

반환값: `void`

### `requestPermissionsAsync()`

지원 플랫폼: Android, iOS, Web.

sensor 접근 권한을 부여할지 사용자에게 요청합니다.

반환값: `Promise<permissionresponse>`

### `setUpdateInterval(intervalMs)`

지원 플랫폼: Android, iOS, Web.

| Parameter | Type | Description |
| --- | --- | --- |
| `intervalMs` | `number` | sensor 업데이트 사이의 원하는 간격(밀리초)입니다. Android 12(API level 31)부터는 시스템이 각 sensor 업데이트에 대해 200Hz 제한을 둡니다. |

  

sensor 업데이트 간격을 설정합니다.

반환값: `void`

## Interfaces

### `Subscription`

지원 플랫폼: Android, iOS, Web.

emitter에서 event listener를 편리하게 제거할 수 있게 해주는 subscription object입니다.

Subscription 메서드

### `remove()`

지원 플랫폼: Android, iOS, Web.

해당 subscription이 생성된 event listener를 제거합니다. 이 함수를 호출한 뒤에는 listener가 더 이상 emitter의 어떤 event도 받지 않습니다.

반환값: `void`

## Types

### `AccelerometerMeasurement`

지원 플랫폼: Android, iOS, Web.

이 key들은 각각 해당 축 방향의 가속도를 g-force(`g` 단위로 측정)로 나타냅니다.

`g`는 지구 중력장(`9.81 m/s^2`)이 가하는 힘과 동일한 중력 단위입니다.

| Property | Type | Description |
| --- | --- | --- |
| timestamp | `number` | 초 단위의 measurement timestamp입니다. |
| x | `number` | 기기가 X축에서 보고한 `g` 값입니다. |
| y | `number` | 기기가 Y축에서 보고한 `g` 값입니다. |
| z | `number` | 기기가 Z축에서 보고한 `g` 값입니다. |

### `PermissionExpiration`

지원 플랫폼: Android, iOS, Web.

리터럴 타입: `union`

권한 만료 시간입니다. 현재는 모든 권한이 영구적으로 부여됩니다.

허용되는 값은 다음과 같습니다: `'never'` | `number`

### `PermissionResponse`

지원 플랫폼: Android, iOS, Web.

권한 조회 및 요청 함수로부터 얻는 object입니다.

| Property | Type | Description |
| --- | --- | --- |
| canAskAgain | `boolean` | 사용자가 특정 권한을 다시 요청받을 수 있는지를 나타냅니다. 그렇지 않다면 권한을 활성화하거나 비활성화하기 위해 Settings 앱으로 안내해야 합니다. |
| expires | `PermissionExpiration` | 권한이 만료되는 시점을 결정합니다. |
| granted | `boolean` | 권한이 부여되었는지 나타내는 편의용 boolean 값입니다. |
| status | `PermissionStatus` | 권한 상태를 결정합니다. |

## Enums

### `PermissionStatus`

지원 플랫폼: Android, iOS, Web.

#### `DENIED`

`PermissionStatus.DENIED = "denied"`

사용자가 권한을 거부했습니다.

#### `GRANTED`

`PermissionStatus.GRANTED = "granted"`

사용자가 권한을 허용했습니다.

#### `UNDETERMINED`

`PermissionStatus.UNDETERMINED = "undetermined"`

사용자가 아직 권한을 허용하거나 거부하지 않았습니다.
