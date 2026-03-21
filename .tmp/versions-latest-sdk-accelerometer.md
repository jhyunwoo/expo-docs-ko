---
title: Accelerometer
description: A library that provides access to the device's accelerometer sensor.
sourceCodeUrl: 'https://github.com/expo/expo/tree/main/packages/expo-sensors'
packageName: 'expo-sensors'
iconUrl: '/static/images/packages/expo-sensors.png'
platforms: ['android', 'ios*', 'web', 'expo-go']
---

# Expo Accelerometer

A library that provides access to the device's accelerometer sensor.
Android, iOS (device only), Web, Included in Expo Go

`Accelerometer` from `expo-sensors` provides access to the device accelerometer sensor(s) and associated listeners to respond to changes in acceleration in three-dimensional space, meaning any movement or vibration.

## Installation

```sh
npx expo install expo-sensors
```

If you are installing this in an [existing React Native app](/bare/overview), make sure to [install `expo`](/bare/installing-expo-modules) in your project.

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

Supported platforms: Android, iOS, Web.

Type: Class extends [DeviceSensor](/versions/latest/sdk/sensors)<[AccelerometerMeasurement](#accelerometermeasurement)\>

A base class for subscribable sensors. The events emitted by this class are measurements specified by the parameter type `Measurement`.

Accelerometer Methods

### `addListener(listener)`

Supported platforms: Android, iOS, Web.

| Parameter | Type | Description |
| --- | --- | --- |
| `listener` | Listener<[AccelerometerMeasurement](#accelerometermeasurement)\> | A callback that is invoked when an accelerometer update is available. When invoked, the listener is provided a single argument that is an `AccelerometerMeasurement` object. |

  

Subscribe for updates to the accelerometer.

Returns: `EventSubscription`

A subscription that you can call `remove()` on when you would like to unsubscribe the listener.

### `getListenerCount()`

Supported platforms: Android, iOS, Web.

Returns the registered listeners count.

Returns: `number`

### `getPermissionsAsync()`

Supported platforms: Android, iOS, Web.

Checks user's permissions for accessing sensor.

Returns: `Promise<permissionresponse>`

### `hasListeners()`

Supported platforms: Android, iOS, Web.

Returns boolean which signifies if sensor has any listeners registered.

Returns: `boolean`

### `isAvailableAsync()`

Supported platforms: Android, iOS, Web.

> You should always check the sensor availability before attempting to use it.

Returns whether the accelerometer is enabled on the device.

On mobile web, you must first invoke `Accelerometer.requestPermissionsAsync()` in a user interaction (i.e. touch event) before you can use this module. If the `status` is not equal to `granted` then you should inform the end user that they may have to open settings.

On **web** this starts a timer and waits to see if an event is fired. This should predict if the iOS device has the **device orientation** API disabled in **Settings > Safari > Motion & Orientation Access**. Some devices will also not fire if the site isn't hosted with **HTTPS** as `DeviceMotion` is now considered a secure API. There is no formal API for detecting the status of `DeviceMotion` so this API can sometimes be unreliable on web.

Returns: `Promise<boolean>`

A promise that resolves to a `boolean` denoting the availability of the accelerometer.

### `removeAllListeners()`

Supported platforms: Android, iOS, Web.

Removes all registered listeners.

Returns: `void`

> **Deprecated:** use subscription.remove() instead.

### `removeSubscription(subscription)`

Supported platforms: Android, iOS, Web.

| Parameter | Type |
| --- | --- |
| `subscription` | `EventSubscription` |

  

Returns: `void`

### `requestPermissionsAsync()`

Supported platforms: Android, iOS, Web.

Asks the user to grant permissions for accessing sensor.

Returns: `Promise<permissionresponse>`

### `setUpdateInterval(intervalMs)`

Supported platforms: Android, iOS, Web.

| Parameter | Type | Description |
| --- | --- | --- |
| `intervalMs` | `number` | Desired interval in milliseconds between sensor updates. Starting from Android 12 (API level 31), the system has a 200Hz limit for each sensor updates. |

  

Set the sensor update interval.

Returns: `void`

## Interfaces

### `Subscription`

Supported platforms: Android, iOS, Web.

A subscription object that allows to conveniently remove an event listener from the emitter.

Subscription Methods

### `remove()`

Supported platforms: Android, iOS, Web.

Removes an event listener for which the subscription has been created. After calling this function, the listener will no longer receive any events from the emitter.

Returns: `void`

## Types

### `AccelerometerMeasurement`

Supported platforms: Android, iOS, Web.

Each of these keys represents the acceleration along that particular axis in g-force (measured in `g`s).

A `g` is a unit of gravitational force equal to that exerted by the earth’s gravitational field (`9.81 m/s^2`).

| Property | Type | Description |
| --- | --- | --- |
| timestamp | `number` | Timestamp of the measurement in seconds. |
| x | `number` | Value of `g`s device reported in X axis. |
| y | `number` | Value of `g`s device reported in Y axis. |
| z | `number` | Value of `g`s device reported in Z axis. |

### `PermissionExpiration`

Supported platforms: Android, iOS, Web.

Literal Type: `union`

Permission expiration time. Currently, all permissions are granted permanently.

Acceptable values are: `'never'` | `number`

### `PermissionResponse`

Supported platforms: Android, iOS, Web.

An object obtained by permissions get and request functions.

| Property | Type | Description |
| --- | --- | --- |
| canAskAgain | `boolean` | Indicates if user can be asked again for specific permission. If not, one should be directed to the Settings app in order to enable/disable the permission. |
| expires | `PermissionExpiration` | Determines time when the permission expires. |
| granted | `boolean` | A convenience boolean that indicates if the permission is granted. |
| status | `PermissionStatus` | Determines the status of the permission. |

## Enums

### `PermissionStatus`

Supported platforms: Android, iOS, Web.

#### `DENIED`

`PermissionStatus.DENIED = "denied"`

User has denied the permission.

#### `GRANTED`

`PermissionStatus.GRANTED = "granted"`

User has granted the permission.

#### `UNDETERMINED`

`PermissionStatus.UNDETERMINED = "undetermined"`

User hasn't granted or denied the permission yet.
