---
modificationDate: February 26, 2026
title: Color themes
description: 앱에서 light mode와 dark mode를 지원하는 방법을 알아보세요.
---

# Color themes

앱에서 light mode와 dark mode를 지원하는 방법을 알아보세요.

앱이 light 및 dark color scheme을 지원하는 것은 흔한 일입니다. Expo 프로젝트에서 두 모드를 모두 지원하면 다음과 같은 모습이 됩니다:

## 구성

> Android와 iOS 프로젝트에서는 light mode와 dark mode 전환을 지원하기 위해 추가 구성이 필요합니다. web에서는 추가 구성이 필요하지 않습니다.

지원할 appearance style을 구성하려면 프로젝트의 [`userInterfaceStyle`](/versions/latest/config/app#userinterfacestyle) 속성을 [app config](/versions/latest/config/app)에서 사용할 수 있습니다. 기본적으로 이 속성은 [기본 template](/get-started/create-a-project)로 새 프로젝트를 만들면 `automatic`으로 설정됩니다.

다음은 구성 예제입니다:

```json
{
  "expo": {
    "userInterfaceStyle": "automatic"
  }
}
```

특정 플랫폼에 대해서만 `userInterfaceStyle` 속성을 구성하려면 [`android.userInterfaceStyle`](/versions/latest/config/app#userinterfacestyle-2) 또는 [`ios.userInterfaceStyle`](/versions/latest/config/app#userinterfacestyle-1) 중 하나를 원하는 값으로 설정할 수 있습니다.

> 이 속성이 없으면 앱은 기본적으로 `light` 스타일을 사용합니다.

development build를 만들 때 Android에서 appearance style을 지원하려면 [`expo-system-ui`](/versions/latest/sdk/system-ui#installation)를 설치해야 합니다. 그렇지 않으면 `userInterfaceStyle` 속성이 무시됩니다.

```sh
npx expo install expo-system-ui
```

프로젝트 구성이 잘못되어 `expo-system-ui`가 설치되어 있지 않으면 터미널에 다음 경고가 표시됩니다:

```sh
» android: userInterfaceStyle: Install expo-system-ui in your project to enable this feature.
```

다음 명령으로 프로젝트 구성이 잘못되었는지도 확인할 수 있습니다:

```sh
npx expo config --type introspect
```

bare React Native 앱을 사용하고 있나요?

#### Android

**AndroidManifest.xml**의 `MainActivity`(및 이 동작이 필요한 다른 activity)에서 `uiMode` 플래그가 포함되어 있는지 확인하세요:

```xml
<activity android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode">
```

**MainActivity.java**에 `onConfigurationChanged` 메서드를 구현하세요:

```java
import android.content.Intent;
import android.content.res.Configuration;
public class MainActivity extends ReactActivity {
  ... 

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    Intent intent = new Intent("onConfigurationChanged");
    intent.putExtra("newConfig", newConfig);
    sendBroadcast(intent);
  }
  ... 
}
```

#### iOS

앱의 **Info.plist**에서 [`UIUserInterfaceStyle`](https://developer.apple.com/documentation/bundleresources/information_property_list/uiuserinterfacestyle) 키를 사용해 지원하는 스타일을 구성할 수 있습니다. light mode와 dark mode를 모두 지원하려면 `Automatic`을 사용하세요.

### 지원되는 appearance style

`userInterfaceStyle` 속성은 다음 값을 지원합니다:

-   `automatic`: 시스템 appearance 설정을 따르고, 사용자가 변경한 내용도 모두 알립니다.
-   `light`: 앱이 light theme만 지원하도록 제한합니다.
-   `dark`: 앱이 dark theme만 지원하도록 제한합니다.

## color scheme 감지하기

프로젝트에서 color scheme을 감지하려면 `react-native`의 `Appearance` 또는 `useColorScheme`을 사용하세요:

```tsx
import { Appearance, useColorScheme } from 'react-native';
```

그런 다음 아래와 같이 `useColorScheme()` hook을 사용할 수 있습니다:

```tsx
function MyComponent() {
  let colorScheme = useColorScheme();

  if (colorScheme === 'dark') {
    // render some dark thing
  } else {
    // render some light thing
  }
}
```

경우에 따라 [`Appearance.getColorScheme()`로 현재 color scheme을 즉시 가져오거나 `Appearance.addChangeListener()`로 변경을 감지](https://reactnative.dev/docs/appearance)하는 것이 유용할 수 있습니다.

## 추가 정보

### 최소 예제

```tsx
import { Text, StyleSheet, View, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const colorScheme = useColorScheme();

  const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  return (
    <View style={[styles.container, themeContainerStyle]}>
      <Text style={[styles.text, themeTextStyle]}>Color scheme: {colorScheme}</Text>
      <StatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
  },
  lightContainer: {
    backgroundColor: '#d0d0c0',
  },
  darkContainer: {
    backgroundColor: '#242c40',
  },
  lightThemeText: {
    color: '#242c40',
  },
  darkThemeText: {
    color: '#d0d0c0',
  },
});
```

### 팁

프로젝트를 개발하는 동안 다음 단축키를 사용해 simulator나 기기의 appearance를 바꿀 수 있습니다:

-   Android Emulator를 사용 중이라면 `adb shell "cmd uimode night yes"`로 dark mode를 활성화하고, `adb shell "cmd uimode night no"`로 dark mode를 비활성화할 수 있습니다.
-   실제 Android 기기나 Android Emulator를 사용 중이라면 기기 설정에서 시스템 dark mode 설정을 전환할 수 있습니다.
-   로컬에서 iOS emulator로 작업 중이라면 Cmd ⌘ + Shift + a 단축키로 light mode와 dark mode를 전환할 수 있습니다.
