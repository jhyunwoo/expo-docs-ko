---
modificationDate: September 26, 2025
title: Android lifecycle listeners
description: Expo modules API를 사용해 라이브러리가 Android Activity와 Application 함수에 연결될 수 있게 해주는 메커니즘을 알아보세요.
---

# Android lifecycle listeners

Expo modules API를 사용해 라이브러리가 Android Activity와 Application 함수에 연결될 수 있게 해주는 메커니즘을 알아보세요.

들어오는 링크나 구성 변경 같은 앱과 관련된 특정 Android 시스템 이벤트에 응답하려면, **MainActivity.java** 및/또는 **MainApplication.java**에서 해당 lifecycle callback을 재정의해야 합니다.

React Native module API는 여기에 연결할 수 있는 메커니즘을 제공하지 않으므로, React Native 라이브러리의 설정 안내에는 종종 이 파일들에 코드를 복사하라는 단계가 포함됩니다. 설정과 유지보수를 단순화하고 자동화하기 위해, Expo Modules API는 라이브러리가 `Activity` 또는 `Application` 함수에 연결될 수 있는 메커니즘을 제공합니다.

## 시작하기

먼저 Expo 모듈을 만들었거나 React Native module API를 사용하는 라이브러리에 Expo modules API를 통합해 두어야 합니다. [자세히 알아보기](/modules/overview#setup).

모듈 내부에 [`Package`](https://github.com/expo/expo/tree/main/packages/expo-modules-core/android/src/main/java/expo/modules/core/interfaces/Package.java) 인터페이스를 구현하는 구체 클래스를 만드세요. 대부분의 경우 `createReactActivityLifecycleListeners` 또는 `createApplicationLifecycleListeners` 메서드만 구현하면 됩니다.

## `Activity` lifecycle listeners

`ReactActivityLifecycleListener`를 사용하면 `Activity` lifecycle에 연결할 수 있습니다. `ReactActivityLifecycleListener`는 `ReactActivityDelegate`를 사용해 React Native의 `ReactActivity` lifecycle에 연결되며, Android `Activity` lifecycle과 유사한 경험을 제공합니다.

현재 지원되는 `Activity` lifecycle callback은 다음과 같습니다:

-   `onCreate`
-   `onResume`
-   `onPause`
-   `onDestroy`
-   `onNewIntent`
-   `onBackPressed`

`ReactActivityLifecycleListener`를 만들려면, 상속한 `Package` 클래스에서 `createReactActivityLifecycleListeners`를 구현해야 합니다. 예를 들어 `MyLibPackage`에서 구현할 수 있습니다.

```kotlin
// android/src/main/java/expo/modules/mylib/MyLibPackage.kt
package expo.modules.mylib

import android.content.Context
import expo.modules.core.interfaces.Package
import expo.modules.core.interfaces.ReactActivityLifecycleListener

class MyLibPackage : Package {
  override fun createReactActivityLifecycleListeners(activityContext: Context): List<ReactActivityLifecycleListener> {
    return listOf(MyLibReactActivityLifecycleListener())
  }
}
```

`MyLibReactActivityLifecycleListener`는 lifecycle에 연결할 수 있는 `ReactActivityLifecycleListener` 파생 클래스입니다. 필요한 메서드만 재정의하면 됩니다.

```kotlin
// android/src/main/java/expo/modules/mylib/MyLibReactActivityLifecycleListener.kt
package expo.modules.mylib

import android.app.Activity
import android.os.Bundle
import expo.modules.core.interfaces.ReactActivityLifecycleListener

class MyLibReactActivityLifecycleListener : ReactActivityLifecycleListener {
  override fun onCreate(activity: Activity, savedInstanceState: Bundle?) {
    // Your setup code in `Activity.onCreate`.
    doSomeSetupInActivityOnCreate(activity)
  }
}
```

다른 lifecycle 메서드도 재정의할 수 있습니다. 아래 예시는 하나의 listener 클래스에서 여러 lifecycle 메서드를 재정의하는 방법을 보여줍니다. 이 예시는 deep links를 처리하기 위해 서로 다른 lifecycle 메서드를 사용하는 `expo-linking` 모듈을 기반으로 합니다. 사용 사례에 필요한 메서드만 구현하면 됩니다:

```kotlin
// android/src/main/java/expo/modules/mylib/MyLibReactActivityLifecycleListener.kt
package expo.modules.mylib

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import expo.modules.core.interfaces.ReactActivityLifecycleListener

class MyLibReactActivityLifecycleListener : ReactActivityLifecycleListener {
  override fun onCreate(activity: Activity?, savedInstanceState: Bundle?) {
    // Called when the activity is first created
    // Initialize your setup here, for example handling deep links
    val deepLinkUrl = activity?.intent?.data
    if (deepLinkUrl != null) {
      handleDeepLink(deepLinkUrl.toString())
    }
  }

  override fun onResume(activity: Activity) {
    // Called when the activity comes to the foreground
    // For example, track when user returns to the app
    trackAppStateChange("active")
  }

  override fun onPause(activity: Activity) {
    // Called when the activity goes to the background
    // For example, pause ongoing operations such as track analytics
    trackAppStateChange("inactive")
  }

  override fun onDestroy(activity: Activity) {
    // Called when the activity is being destroyed
    // Clean up resources here
    cleanup()
  }

  override fun onNewIntent(intent: Intent?): Boolean {
    // Called when app receives a new intent while already running
    // For example, handle new deep links while app is open
    val newUrl = intent?.data
    if (newUrl != null) {
      handleDeepLink(newUrl.toString())
      return true
    }
    return false
  }

  override fun onBackPressed(): Boolean {
    // Called when user presses the back button
    // Return true to prevent default back behavior
    return handleCustomBackNavigation()
  }

  // Now, you can add private functions to handle
  // your logic for deep links, app state tracking, clean up, and so on.
}
```

## JavaScript 이벤트 흐름으로 lifecycle listeners 연결하기

lifecycle listener는 Expo 모듈 인스턴스와 독립적으로 존재하는 singleton 클래스입니다. lifecycle listener와 모듈 사이에서 통신하려면(예: 앱의 JavaScript 코드로 이벤트를 보내기 위해), 모듈에서 이벤트를 관찰하고 이벤트가 발생할 때 lifecycle listener에 알릴 수 있어야 합니다. 일반적인 흐름은 다음 단계로 구성될 수 있습니다:

-   **시스템 통합**: lifecycle listener가 URL 데이터가 포함된 Android intent를 캡처합니다.
-   **Observer pattern**: singleton lifecycle listener가 모듈 인스턴스와 통신합니다.
-   **이벤트 브리징**: 모듈이 구조화된 이벤트를 JavaScript로 보냅니다.
-   **메모리 관리**: weak reference가 memory leak을 방지합니다.
-   **타입 안정성과 React 통합**: 적절한 event type과 custom hook을 갖춘 TypeScript 지원으로 deep link 이벤트에 쉽게 접근할 수 있습니다.

커스텀 모듈 구현이 위 이벤트 흐름의 모든 요소를 필요로 하지는 않을 수 있습니다. 하지만 이 패턴은 앱 상태 변경, 구성 변경, 또는 Android lifecycle 이벤트를 React Native 앱으로 브리지해야 하는 커스텀 비즈니스 로직 같은 다른 시스템 이벤트에도 응용할 수 있습니다.

다음 예시는 lifecycle listener를 사용해 Android 시스템 이벤트를 React Native 앱으로 브리지하는 방법을 보여줍니다. 이 예시는 앱이 열리거나 새 intent를 받을 때 URL을 캡처하는 deep link handler를 만들기 위해 lifecycle listener를 사용하는 [`expo-linking`](https://github.com/expo/expo/tree/main/packages/expo-linking)를 기반으로 합니다.

### 모듈 등록

먼저 lifecycle listener를 등록하는 모듈 클래스를 만드세요:

```kotlin
// android/src/main/java/expo/modules/deeplinkhandler/DeepLinkHandlerPackage.kt
package expo.modules.deeplinkhandler

import android.content.Context
import expo.modules.core.interfaces.Package
import expo.modules.core.interfaces.ReactActivityLifecycleListener

class DeepLinkHandlerPackage : Package {
  override fun createReactActivityLifecycleListeners(activityContext: Context?): List<ReactActivityLifecycleListener> {
    return listOf(DeepLinkHandlerActivityLifecycleListener())
  }
}
```

### observer 알림이 있는 Activity lifecycle listener

deep link를 캡처하고 모듈 observer에 알리는 lifecycle listener를 만드세요:

```kotlin
// android/src/main/java/expo/modules/deeplinkhandler/DeepLinkHandlerActivityLifecycleListener.kt
package expo.modules.deeplinkhandler

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import expo.modules.core.interfaces.ReactActivityLifecycleListener

class DeepLinkHandlerActivityLifecycleListener : ReactActivityLifecycleListener {
  override fun onCreate(activity: Activity?, savedInstanceState: Bundle?) {
    handleIntent(activity?.intent)
  }

  override fun onNewIntent(intent: Intent?): Boolean {
    handleIntent(intent)
    return true
  }

  private fun handleIntent(intent: Intent?) {
    val url = intent?.data
    if (url != null) {
      // Store the initial URL for later retrieval
      DeepLinkHandlerModule.initialUrl = url

      // Notify all observers about the new deep link
      DeepLinkHandlerModule.urlReceivedObservers.forEach { observer ->
        observer(url)
      }
    }
  }
}
```

### 이벤트를 전송하는 Expo 모듈

observer를 유지하고 JavaScript로 이벤트를 보내는 모듈을 만드세요:

```kotlin
// android/src/main/java/expo/modules/deeplinkhandler/DeepLinkHandlerModule.kt
package expo.modules.deeplinkhandler

import android.net.Uri
import androidx.core.os.bundleOf
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.lang.ref.WeakReference

class DeepLinkHandlerModule : Module() {
  companion object {
    var initialUrl: Uri? = null
    var urlReceivedObservers: MutableSet<((Uri) -> Unit)> = mutableSetOf()
  }

  private var urlReceivedObserver: ((Uri) -> Unit)? = null

  override fun definition() = ModuleDefinition {
    Name("DeepLinkHandler")

    Events("onUrlReceived")

    Function("getInitialUrl") {
      initialUrl?.toString()
    }

    OnStartObserving("onUrlReceived") {
      val weakModule = WeakReference(this@DeepLinkHandlerModule)
      val observer: (Uri) -> Unit = { uri ->
        weakModule.get()?.sendEvent(
          "onUrlReceived",
          bundleOf(
            "url" to uri.toString(),
            "scheme" to uri.scheme,
            "host" to uri.host,
            "path" to uri.path
          )
        )
      }
      urlReceivedObservers.add(observer)
      urlReceivedObserver = observer
    }

    OnStopObserving("onUrlReceived") {
      urlReceivedObservers.remove(urlReceivedObserver)
    }
  }
}
```

### TypeScript 인터페이스와 React 사용법

Android lifecycle 이벤트를 JavaScript로 브리지하기 위한 모듈의 TypeScript 인터페이스를 정의하세요:

```ts
import { requireNativeModule, NativeModule } from 'expo-modules-core';

export type DeepLinkEvent = {
  url: string;
  scheme?: string;
  host?: string;
  path?: string;
};

type DeepLinkHandlerModuleEvents = {
  onUrlReceived(event: DeepLinkEvent): void;
};

declare class DeepLinkHandlerNativeModule extends NativeModule<DeepLinkHandlerModuleEvents> {
  getInitialUrl(): string | null;
}

const DeepLinkHandler = requireNativeModule<DeepLinkHandlerNativeModule>('DeepLinkHandler');
export default DeepLinkHandler;
```

deep link 이벤트에 쉽게 접근할 수 있도록 React hook을 만드세요:

```tsx
import { useEffect, useState } from 'react';
import DeepLinkHandler, { DeepLinkEvent } from './DeepLinkHandler';

export function useDeepLinkHandler(): {
  initialUrl: string | null;
  url: string | null;
  event: DeepLinkEvent | null;
} {
  const [initialUrl] = useState<string | null>(DeepLinkHandler.getInitialUrl());
  const [event, setEvent] = useState<DeepLinkEvent | null>(null);

  useEffect(() => {
    const subscription = DeepLinkHandler.addListener('onUrlReceived', event => {
      setEvent(event);
    });

    return () => subscription.remove();
  }, []);

  return {
    initialUrl,
    url: event?.url ?? initialUrl,
    event,
  };
}
```

React component에서 사용하세요:

```tsx
import { Text, View, StyleSheet } from 'react-native';
import { useDeepLinkHandler } from './useDeepLinkHandler';

export function App() {
  const { initialUrl, url, event } = useDeepLinkHandler();

  return (
    <View style={styles.container}>
      <Text>Initial URL: {initialUrl || 'None'}</Text>
      <Text>Current URL: {url || 'None'}</Text>
      {event && (
        <View style={styles.textContainer}>
          <Text>Latest Deep Link:</Text>
          <Text>Scheme: {event.scheme}</Text>
          <Text>Host: {event.host}</Text>
          <Text>Path: {event.path}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginTop: 20,
  },
});
```

### 모듈 구성

마지막으로, 모듈을 lifecycle listener에 연결하기 위해 **expo-module.config.json**에서 모듈을 구성하세요:

```json
{
  "platforms": ["android"],
  "android": {
    "modules": ["expo.modules.deeplinkhandler.DeepLinkHandlerModule"]
  }
}
```

## `Application` lifecycle listeners

`ApplicationLifecycleListener`를 사용하면 `Application` lifecycle에 연결할 수 있습니다.

현재 지원되는 `Application` lifecycle callback은 다음과 같습니다:

-   `onCreate`
-   `onConfigurationChanged`

`ApplicationLifecycleListener`를 만들려면, 상속한 `Package` 클래스에서 `createApplicationLifecycleListeners`를 구현해야 합니다. 예를 들어 `MyLibPackage`에서 구현할 수 있습니다.

```kotlin
// android/src/main/java/expo/modules/mylib/MyLibPackage.kt
package expo.modules.mylib

import android.content.Context
import expo.modules.core.interfaces.ApplicationLifecycleListener
import expo.modules.core.interfaces.Package

class MyLibPackage : Package {
  override fun createApplicationLifecycleListeners(context: Context): List<ApplicationLifecycleListener> {
    return listOf(MyLibApplicationLifecycleListener())
  }
}
```

`MyLibApplicationLifecycleListener`는 `Application` lifecycle callback에 연결할 수 있는 `ApplicationLifecycleListener` 파생 클래스입니다. 필요한 메서드만 재정의해야 합니다([잠재적인 유지보수 비용 때문](/modules/android-lifecycle-listeners#interface-stability)입니다).

```kotlin
// android/src/main/java/expo/modules/mylib/MyLibApplicationLifecycleListener.kt
package expo.modules.mylib

import android.app.Application
import expo.modules.core.interfaces.ApplicationLifecycleListener

class MyLibApplicationLifecycleListener : ApplicationLifecycleListener {
  override fun onCreate(application: Application) {
    // Your setup code in `Application.onCreate`.
    doSomeSetupInApplicationOnCreate(application)
  }
}
```

## 알려진 문제

### `onStart`와 `onStop` Activity listener가 없는 이유

현재 구현에서는 `MainActivity`가 아니라 [`ReactActivityDelegate`](https://github.com/facebook/react-native/blob/400902093aa3ccfc05712a996c592a86f342253a/ReactAndroid/src/main/java/com/facebook/react/ReactActivityDelegate.java)에서 hook을 설정합니다. `MainActivity`와 `ReactActivityDelegate` 사이에는 약간의 차이가 있습니다. `ReactActivityDelegate`에는 `onStart`와 `onStop`이 없기 때문에, 아직 여기서는 이를 지원하지 않습니다.

### 인터페이스 안정성

listener 인터페이스는 Expo SDK 릴리스 사이에서 때때로 변경될 수 있습니다. 이전 버전과의 호환성을 위한 우리의 전략은 항상 새 인터페이스를 추가하고, 제거할 예정인 인터페이스에는 `@Deprecated` annotation을 추가하는 것입니다. 이 인터페이스들은 모두 Java 8 interface default method를 기반으로 하므로, 모든 메서드를 구현할 필요도 없고 구현해서도 안 됩니다. 이렇게 하면 Expo SDK 간 모듈 유지보수 비용을 줄이는 데 도움이 됩니다.
