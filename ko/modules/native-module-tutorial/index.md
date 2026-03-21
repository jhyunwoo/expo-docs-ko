---
modificationDate: March 09, 2026
title: '튜토리얼: 네이티브 모듈 만들기'
description: Expo Modules API로 설정을 유지하는 네이티브 모듈을 만드는 튜토리얼입니다.
---

# 튜토리얼: 네이티브 모듈 만들기

Expo Modules API로 설정을 유지하는 네이티브 모듈을 만드는 튜토리얼입니다.

이 튜토리얼에서는 사용자가 선호하는 앱 테마인 dark, light, system을 저장하는 모듈을 만듭니다. Android에서는 [`SharedPreferences`](https://developer.android.com/reference/android/content/SharedPreferences)를 사용하고, iOS에서는 [`UserDefaults`](https://developer.apple.com/documentation/foundation/userdefaults)를 사용합니다. 웹 지원은 [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)로 구현할 수 있지만, 이 튜토리얼에서는 다루지 않습니다.

[영상 보기: Expo Modules API로 네이티브 모듈 만드는 방법](https://www.youtube.com/watch?v=CdaQSlyGik8) — Android의 SharedPreferences와 iOS의 UserDefaults를 사용해 사용자 설정을 유지하는 네이티브 모듈을 만들어 봅니다.

## 새 모듈 초기화하기

먼저 새 모듈을 만듭니다. 이 튜토리얼에서는 모듈 이름을 `expo-settings` 또는 `ExpoSettings`로 사용합니다. 다른 이름을 선택해도 되지만, 그 선택에 맞게 안내를 조정해야 합니다.

```sh
npx create-expo-module expo-settings
```

> 이 라이브러리를 실제로 배포할 계획은 아니므로, 모든 프롬프트에서 Enter를 눌러 기본값을 그대로 사용해도 됩니다.

## 워크스페이스 설정하기

빈 상태에서 시작할 수 있도록 기본 모듈을 정리합니다. 이 가이드에서는 view 모듈을 사용하지 않으므로 삭제합니다.

```sh
cd expo-settings
rm ios/ExpoSettingsView.swift
rm android/src/main/java/expo/modules/settings/ExpoSettingsView.kt
rm src/ExpoSettingsView.tsx
rm src/ExpoSettingsView.web.tsx src/ExpoSettingsModule.web.ts
```

다음 파일을 찾아 제공된 최소 보일러플레이트로 내용을 교체합니다.

```kotlin
package expo.modules.settings

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoSettingsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoSettings")

    Function("getTheme") {
      return@Function "system"
    }
  }
}
```

```swift
import ExpoModulesCore

public class ExpoSettingsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoSettings")

    Function("getTheme") { () -> String in
      "system"
    }
  }
}
```

```ts
export type ExpoSettingsModuleEvents = {};
```

```ts
import { NativeModule, requireNativeModule } from 'expo';

import { ExpoSettingsModuleEvents } from './ExpoSettings.types';

declare class ExpoSettingsModule extends NativeModule<ExpoSettingsModuleEvents> {
  getTheme: () => string;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoSettingsModule>('ExpoSettings');
```

```ts
import ExpoSettingsModule from './ExpoSettingsModule';

export function getTheme(): string {
  return ExpoSettingsModule.getTheme();
}
```

```tsx
import * as Settings from 'expo-settings';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Theme: {Settings.getTheme()}</Text>
    </View>
  );
}
```

## example 프로젝트 실행하기

변경 사항을 감시하도록 TypeScript 컴파일러를 시작합니다.

```sh
npm run build
```

별도의 터미널 창에서 example 앱을 실행합니다.

```sh
cd example
npx expo run:android
npx expo run:ios
```

example 앱을 실행하면 화면 중앙에 "Theme: system"이라는 텍스트가 보여야 합니다. 값 `"system"`은 네이티브 모듈의 `getTheme()` 함수를 동기적으로 호출해 가져온 것입니다. 다음 단계에서 이 값을 바꾸게 됩니다.

## 테마 선호 값 가져오기, 설정하기, 그리고 유지하기

### Android 네이티브 모듈

값을 읽으려면 `"theme"` 키 아래의 `SharedPreferences` 문자열을 찾습니다. 키가 없으면 기본값으로 `"system"`을 사용합니다. `reactContext`(React Native의 [ContextWrapper](https://developer.android.com/reference/android/content/ContextWrapper))를 사용해 `getSharedPreferences()`로 `SharedPreferences` 인스턴스에 접근합니다.

값을 설정하려면 `SharedPreferences`의 `edit()` 메서드로 `Editor` 인스턴스를 가져옵니다. 그런 다음 `putString()`을 사용해 값을 설정합니다. `setTheme` 함수가 `String` 타입 값을 받도록 해야 합니다.

```kotlin
package expo.modules.settings

import android.content.Context
import android.content.SharedPreferences
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoSettingsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoSettings")

    Function("setTheme") { theme: String ->
      getPreferences().edit().putString("theme", theme).commit()
    }

    Function("getTheme") {
      return@Function getPreferences().getString("theme", "system")
    }
  }

  private val context
  get() = requireNotNull(appContext.reactContext)

  private fun getPreferences(): SharedPreferences {
    return context.getSharedPreferences(context.packageName + ".settings", Context.MODE_PRIVATE)
  }
}
```

### iOS 네이티브 모듈

iOS에서 값을 읽으려면 `"theme"` 키 아래의 `UserDefaults` 문자열을 찾습니다. 키가 없으면 기본값으로 `"system"`을 사용합니다.

값을 설정하려면 `UserDefaults`의 `set(_:forKey:)` 메서드를 사용합니다. `setTheme` 함수가 `String` 타입 값을 받도록 해야 합니다.

```swift
import ExpoModulesCore

public class ExpoSettingsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoSettings")

    Function("setTheme") { (theme: String) -> Void in
      UserDefaults.standard.set(theme, forKey:"theme")
    }

    Function("getTheme") { () -> String in
      UserDefaults.standard.string(forKey: "theme") ?? "system"
    }
  }
}
```

### TypeScript 모듈

테마를 업데이트할 수 있도록 네이티브 모듈 `ExpoSettingsModule`용 TypeScript 인터페이스를 추가하도록 **ExpoSettingsModule.ts**를 업데이트합니다.

```ts
import { NativeModule, requireNativeModule } from 'expo';

import { ExpoSettingsModuleEvents } from './ExpoSettings.types';

declare class ExpoSettingsModule extends NativeModule<ExpoSettingsModuleEvents> {
  setTheme: (theme: string) => void;
  getTheme: () => string;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoSettingsModule>('ExpoSettings');
```

이제 TypeScript에서 네이티브 모듈을 호출합니다.

```ts
import ExpoSettingsModule from './ExpoSettingsModule';

export function getTheme(): string {
  return ExpoSettingsModule.getTheme();
}

export function setTheme(theme: string): void {
  return ExpoSettingsModule.setTheme(theme);
}
```

### Example app

이제 example 앱에서 Settings API를 사용할 수 있습니다.

```tsx
import * as Settings from 'expo-settings';
import { Button, Text, View } from 'react-native';

export default function App() {
  const theme = Settings.getTheme();
  // Toggle between dark and light theme
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Theme: {Settings.getTheme()}</Text>
      <Button title={`Set theme to ${nextTheme}`} onPress={() => Settings.setTheme(nextTheme)} />
    </View>
  );
}
```

앱을 다시 빌드하고 실행해도 `"system"` 테마가 그대로 설정되어 있습니다. 버튼을 눌러도 아무 일도 일어나지 않지만, 앱을 다시 로드하면 테마가 바뀝니다. 이는 앱이 새 테마 값을 다시 가져오거나 다시 렌더링하지 않기 때문입니다. 다음 단계에서 이 문제를 고칩니다.

## 테마 값 변경 이벤트 내보내기

값이 업데이트될 때마다 변경 이벤트를 내보내서 API를 사용하는 개발자가 테마 값 변경에 반응할 수 있도록 합니다. 모듈이 내보내는 이벤트를 설명하려면 [Events](/modules/module-api#events) definition component를 사용하고, 네이티브 코드에서 이벤트를 내보내려면 `sendEvent`를 사용하며, JavaScript에서 이벤트를 구독하려면 [EventEmitter](/modules/module-api#sending-events) API를 사용합니다. 이벤트 payload는 `{ theme: string }`입니다.

### Android 네이티브 모듈

Android에서 이벤트 payload는 [`Bundle`](https://developer.android.com/reference/android/os/Bundle.html) 인스턴스로 표현되며, [`bundleOf`](https://developer.android.com/reference/kotlin/androidx/core/os/package-summary#bundleOf\(kotlin.Array\)) 함수를 사용해 만들 수 있습니다.

```kotlin
package expo.modules.settings

import android.content.Context
import android.content.SharedPreferences
import androidx.core.os.bundleOf
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoSettingsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoSettings")

    Events("onChangeTheme")

    Function("setTheme") { theme: String ->
      getPreferences().edit().putString("theme", theme).commit()
      this@ExpoSettingsModule.sendEvent("onChangeTheme", bundleOf("theme" to theme))
    }

    Function("getTheme") {
      return@Function getPreferences().getString("theme", "system")
    }
  }

  private val context
  get() = requireNotNull(appContext.reactContext)

  private fun getPreferences(): SharedPreferences {
    return context.getSharedPreferences(context.packageName + ".settings", Context.MODE_PRIVATE)
  }
}
```

### iOS 네이티브 모듈

```swift
import ExpoModulesCore

public class ExpoSettingsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoSettings")

    Events("onChangeTheme")

    Function("setTheme") { (theme: String) -> Void in
      UserDefaults.standard.set(theme, forKey:"theme")
      sendEvent("onChangeTheme", [
        "theme": theme
      ])
    }

    Function("getTheme") { () -> String in
      UserDefaults.standard.string(forKey: "theme") ?? "system"
    }
  }
}
```

### TypeScript 모듈

```ts
export type ThemeChangeEvent = {
  theme: string;
};

export type ExpoSettingsModuleEvents = {
  onChangeTheme: (params: ThemeChangeEvent) => void;
};
```

```ts
import { EventSubscription } from 'expo-modules-core';
import ExpoSettingsModule from './ExpoSettingsModule';
import { ThemeChangeEvent } from './ExpoSettings.types';

export function addThemeListener(listener: (event: ThemeChangeEvent) => void): EventSubscription {
  return ExpoSettingsModule.addListener('onChangeTheme', listener);
}

export function getTheme(): string {
  return ExpoSettingsModule.getTheme();
}

export function setTheme(theme: string): void {
  return ExpoSettingsModule.setTheme(theme);
}
```

### Example app

```tsx
import * as Settings from 'expo-settings';
import { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';

export default function App() {
  const [theme, setTheme] = useState<string>(Settings.getTheme());

  useEffect(() => {
    const subscription = Settings.addThemeListener(({ theme: newTheme }) => {
      setTheme(newTheme);
    });

    return () => subscription.remove();
  }, [setTheme]);

  // Toggle between dark and light theme
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Theme: {Settings.getTheme()}</Text>
      <Button title={`Set theme to ${nextTheme}`} onPress={() => Settings.setTheme(nextTheme)} />
    </View>
  );
}
```

## Enum으로 타입 안정성 개선하기

현재 형태의 `Settings.setTheme()` API는 어떤 문자열 값이든 허용하므로 실수하기 쉽습니다. enum을 사용해 가능한 값을 `system`, `light`, `dark`로 제한함으로써 이 API의 타입 안정성을 개선합니다.

### Android 네이티브 모듈

```kotlin
package expo.modules.settings

import android.content.Context
import android.content.SharedPreferences
import androidx.core.os.bundleOf
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.types.Enumerable

class ExpoSettingsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoSettings")

    Events("onChangeTheme")

    Function("setTheme") { theme: Theme ->
      getPreferences().edit().putString("theme", theme.value).commit()
      this@ExpoSettingsModule.sendEvent("onChangeTheme", bundleOf("theme" to theme.value))
    }

    Function("getTheme") {
      return@Function getPreferences().getString("theme", Theme.SYSTEM.value)
    }
  }

  private val context
  get() = requireNotNull(appContext.reactContext)

  private fun getPreferences(): SharedPreferences {
    return context.getSharedPreferences(context.packageName + ".settings", Context.MODE_PRIVATE)
  }
}

enum class Theme(val value: String) : Enumerable {
  LIGHT("light"),
  DARK("dark"),
  SYSTEM("system")
}
```

### iOS 네이티브 모듈

```swift
import ExpoModulesCore

public class ExpoSettingsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoSettings")

    Events("onChangeTheme")

    Function("setTheme") { (theme: Theme) -> Void in
      UserDefaults.standard.set(theme.rawValue, forKey:"theme")
      sendEvent("onChangeTheme", [
        "theme": theme.rawValue
      ])
    }

    Function("getTheme") { () -> String in
      UserDefaults.standard.string(forKey: "theme") ?? Theme.system.rawValue
    }
  }

  enum Theme: String, Enumerable {
    case light
    case dark
    case system
  }
}
```

### TypeScript 모듈

```ts
export type Theme = 'light' | 'dark' | 'system';

export type ThemeChangeEvent = {
  theme: Theme;
};

export type ExpoSettingsModuleEvents = {
  onChangeTheme: (params: ThemeChangeEvent) => void;
};
```

```ts
import { NativeModule, requireNativeModule } from 'expo';

import { ExpoSettingsModuleEvents, Theme } from './ExpoSettings.types';

declare class ExpoSettingsModule extends NativeModule<ExpoSettingsModuleEvents> {
  setTheme: (theme: Theme) => void;
  getTheme: () => Theme;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoSettingsModule>('ExpoSettings');
```

```ts
import { EventSubscription } from 'expo-modules-core';

import ExpoSettingsModule from './ExpoSettingsModule';

import { Theme, ThemeChangeEvent } from './ExpoSettings.types';

export function addThemeListener(listener: (event: ThemeChangeEvent) => void): EventSubscription {
  return ExpoSettingsModule.addListener('onChangeTheme', listener);
}

export function getTheme(): Theme {
  return ExpoSettingsModule.getTheme();
}

export function setTheme(theme: Theme): void {
  return ExpoSettingsModule.setTheme(theme);
}
```

### Example app

`Settings.setTheme(nextTheme)`을 `Settings.setTheme("not-a-real-theme")`으로 바꾸면 TypeScript가 오류를 발생시킵니다. 오류를 무시하고 버튼을 누르면 다음과 같은 런타임 오류가 표시됩니다.

```text
ERROR  Error: FunctionCallException: Calling the 'setTheme' function has failed (at ExpoModulesCore/SyncFunctionComponent.swift:76)
→ Caused by: ArgumentCastException: Argument at index '0' couldn't be cast to type Enum<Theme> (at ExpoModulesCore/JavaScriptUtils.swift:41)
→ Caused by: EnumNoSuchValueException: 'not-a-real-theme' is not present in Theme enum, it must be one of: 'light', 'dark', 'system' (at ExpoModulesCore/Enumerable.swift:37)
```

오류 메시지의 마지막 줄은 `not-a-real-theme`이 `Theme` enum에서 유효한 값이 아니라는 점을 보여줍니다. 유효한 값은 `light`, `dark`, `system`뿐입니다.

축하합니다! 이제 Android와 iOS용 첫 Expo Module을 만들었습니다.

## 다음 단계

[Expo Modules API Reference](/modules/module-api) — Kotlin과 Swift를 사용해 네이티브 모듈을 만듭니다.

[Tutorial: Creating a native view](/modules/native-view-tutorial) — Expo Modules API로 네이티브 뷰를 만드는 튜토리얼입니다.
