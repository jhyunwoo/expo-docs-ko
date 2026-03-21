---
modificationDate: June 24, 2025
title: '튜토리얼: 네이티브 뷰 만들기'
description: Expo Modules API로 WebView를 렌더링하는 네이티브 뷰를 만드는 튜토리얼입니다.
---

# 튜토리얼: 네이티브 뷰 만들기

Expo Modules API로 WebView를 렌더링하는 네이티브 뷰를 만드는 튜토리얼입니다.

이 튜토리얼에서는 WebView를 렌더링하는 네이티브 뷰가 포함된 example 모듈을 만듭니다. Android에서는 [`WebView`](https://developer.android.com/reference/android/webkit/WebView) 컴포넌트를 사용하고, iOS에서는 [`WKWebView`](https://developer.apple.com/documentation/webkit/wkwebview)를 사용합니다. 웹 지원은 [`iframe`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)을 사용해 구현할 수 있으며, 이는 직접 해보는 과제로 남겨둡니다.

## 새 모듈 초기화하기

다음 명령을 실행해 새 모듈을 만들고, example 모듈 이름을 `expo-web-view`로 지정합니다.

```sh
npx create-expo-module expo-web-view
```

> 이것은 example 라이브러리이며 배포하지 않을 예정이므로, 모든 프롬프트에서 Enter를 눌러 기본값을 그대로 사용하세요.

## 워크스페이스 설정하기

다음 파일을 삭제해서 기본 모듈을 정리하고 깔끔한 상태에서 시작합니다.

```sh
cd expo-web-view
rm src/ExpoWebView.types.ts src/ExpoWebViewModule.ts
rm src/ExpoWebView.web.tsx src/ExpoWebViewModule.web.ts
```

다음 파일을 찾아 제공된 최소 보일러플레이트로 교체합니다.

```kotlin
package expo.modules.webview

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoWebViewModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoWebView")

    View(ExpoWebView::class) {}
  }
}
```

```swift
import ExpoModulesCore

public class ExpoWebViewModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoWebView")

    View(ExpoWebView.self) {}
  }
}
```

```tsx
import { ViewProps } from 'react-native';
import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

export type Props = ViewProps;

const NativeView: React.ComponentType<Props> = requireNativeViewManager('ExpoWebView');

export default function ExpoWebView(props: Props) {
  return <NativeView {...props} />;
}
```

```tsx
export { default as WebView, Props as WebViewProps } from './ExpoWebView';
```

```tsx
import { WebView } from 'expo-web-view';

export default function App() {
  return <WebView style={{ flex: 1, backgroundColor: 'purple' }} />;
}
```

## example 프로젝트 실행하기

모든 것이 제대로 동작하는지 확인하려면, 변경 사항을 감시하고 모듈의 JavaScript를 다시 빌드하도록 TypeScript 컴파일러를 시작합니다.

```sh
npm run build
```

```sh
cd example
npx expo run:android
npx expo run:ios
```

이제 빈 보라색 화면이 보여야 합니다. 아주 흥미롭진 않지만, 좋은 시작입니다. 다음에는 이것을 WebView로 바꿔보겠습니다.

## 시스템 WebView를 서브뷰로 추가하기

하드코딩된 URL을 가진 시스템 `WebView`를 `ExpoWebView`의 서브뷰로 추가합니다. `ExpoWebView` 클래스는 `ExpoView`를 확장하고, `ExpoView`는 React Native의 `RCTView`를 확장하며, 결국 Android의 `View`와 iOS의 `UIView`를 확장합니다.

`WebView` 서브뷰가 React Native의 레이아웃 엔진이 계산한 `ExpoWebView`와 동일한 레이아웃을 사용하도록 해야 합니다.

### Android 뷰

Android에서는 `LayoutParams`를 사용해 WebView의 레이아웃이 `ExpoWebView` 레이아웃과 일치하도록 설정합니다. WebView를 인스턴스화할 때 이 작업을 할 수 있습니다.

```kotlin
package expo.modules.webview

import android.content.Context
import android.webkit.WebView
import android.webkit.WebViewClient
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView

class ExpoWebView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  internal val webView = WebView(context).also {
    it.layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
    it.webViewClient = object : WebViewClient() {}
    addView(it)

    it.loadUrl("https://docs.expo.dev/modules/")
  }
}
```

### iOS 뷰

iOS에서는 `clipsToBounds`를 `true`로 설정하고, `layoutSubviews`에서 WebView의 `frame`이 `ExpoWebView`의 bounds와 일치하도록 해야 합니다. `init` 메서드는 뷰가 생성될 때 호출되고, `layoutSubviews`는 레이아웃이 변경될 때 호출됩니다.

```swift
import ExpoModulesCore
import WebKit

class ExpoWebView: ExpoView {
  let webView = WKWebView()

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    clipsToBounds = true
    addSubview(webView)

    let url =  URL(string:"https://docs.expo.dev/modules/")!
    let urlRequest = URLRequest(url:url)
    webView.load(urlRequest)
  }

  override func layoutSubviews() {
    webView.frame = bounds
  }
}
```

### Example app

변경할 것은 없습니다. 다음 명령으로 앱을 다시 빌드하고 실행합니다.

```sh
npx expo prebuild --clean
npx expo run:android
npx expo run:ios
```

그러면 [Expo Modules API overview page](/modules/overview)가 렌더링된 것을 보게 됩니다. 변경 사항이 반영되지 않으면 앱을 다시 설치해 보세요.

## URL을 설정하는 prop 추가하기

뷰에 prop을 설정하려면 `ExpoWebViewModule` 안에서 prop 이름과 setter를 정의합니다. 이 경우에는 편의상 `webView` 프로퍼티에 직접 접근할 수 있습니다. 하지만 실제 환경에서는 `ExpoWebViewModule`이 내부 구현을 가능한 한 적게 알도록 로직을 `ExpoWebView` 클래스 내부에 두는 것이 좋습니다.

prop을 정의하려면 [Prop definition component](/modules/module-api#prop)를 사용합니다. prop setter 블록에서는 뷰와 prop 모두에 접근할 수 있습니다. URL의 타입을 `URL`로 지정하세요. Expo modules API가 문자열을 네이티브 `URL` 타입으로 변환해 줍니다.

### Android 모듈

```kotlin
package expo.modules.webview

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.URL

class ExpoWebViewModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoWebView")

    View(ExpoWebView::class) {
      Prop("url") { view: ExpoWebView, url: URL? ->
        view.webView.loadUrl(url.toString())
      }
    }
  }
}
```

### iOS 모듈

```swift
import ExpoModulesCore

public class ExpoWebViewModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoWebView")

    View(ExpoWebView.self) {
      Prop("url") { (view, url: URL) in
        if view.webView.url != url {
          let urlRequest = URLRequest(url: url)
          view.webView.load(urlRequest)
        }
      }
    }
  }
}
```

### TypeScript 모듈

다음으로 `Props` 타입에 `url` prop을 추가합니다.

```tsx
import { ViewProps } from 'react-native';
import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

export type Props = {
  url?: string;
} & ViewProps;

const NativeView: React.ComponentType<Props> = requireNativeViewManager('ExpoWebView');

export default function ExpoWebView(props: Props) {
  return <NativeView {...props} />;
}
```

### Example app

마지막으로 example 앱의 `WebView` 컴포넌트에 `URL`을 전달합니다.

```tsx
import { WebView } from 'expo-web-view';

export default function App() {
  return <WebView style={{ flex: 1 }} url="https://expo.dev" />;
}
```

example 앱을 다시 빌드합니다.

```sh
npx expo prebuild --clean
npx expo run:android
npx expo run:ios
```

그러면 WebView 안에 [Expo homepage](https://expo.dev)가 보입니다.

## 페이지가 로드되었을 때 알리는 이벤트 추가하기

[View callbacks](/modules/module-api#view-callbacks)을 사용하면 개발자가 컴포넌트의 이벤트를 들을 수 있습니다. 일반적으로는 `<Image onLoad={...} />`처럼 컴포넌트의 prop을 통해 등록합니다. WebView용 이벤트를 정의하려면 [Events definition component](/modules/module-api#events)를 사용합니다. 이벤트 이름은 `onLoad`로 하겠습니다.

### Android 뷰와 모듈

Android에서는 `onPageFinished` 함수를 override합니다. 그런 다음 모듈에서 정의한 `onLoad` 이벤트 핸들러를 호출합니다.

```kotlin
package expo.modules.webview

import android.content.Context
import android.webkit.WebView
import android.webkit.WebViewClient
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView

class ExpoWebView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  private val onLoad by EventDispatcher()

  internal val webView = WebView(context).also {
    it.layoutParams = LayoutParams(
      LayoutParams.MATCH_PARENT,
      LayoutParams.MATCH_PARENT
    )

    it.webViewClient = object : WebViewClient() {
      override fun onPageFinished(view: WebView, url: String) {
        onLoad(mapOf("url" to url))
      }
    }

    addView(it)
  }
}
```

`ExpoWebViewModule`에서 해당 `View`에 `onLoad` 이벤트가 있음을 표시합니다.

```kotlin
package expo.modules.webview

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.URL

class ExpoWebViewModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoWebView")

    View(ExpoWebView::class) {
      Events("onLoad")

      Prop("url") { view: ExpoWebView, url: URL? ->
        view.webView.loadUrl(url.toString())
      }
    }
  }
}
```

### iOS 뷰와 모듈

iOS에서는 `webView(_:didFinish:)`를 구현하고 `ExpoWebView`가 `WKNavigationDelegate`를 확장하도록 만듭니다. 그런 다음 해당 delegate 메서드에서 `onLoad`를 호출합니다.

```swift
import ExpoModulesCore
import WebKit

class ExpoWebView: ExpoView, WKNavigationDelegate {
  let webView = WKWebView()
  let onLoad = EventDispatcher()

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    clipsToBounds = true
    webView.navigationDelegate = self
    addSubview(webView)
  }

  override func layoutSubviews() {
    webView.frame = bounds
  }

  func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
    if let url = webView.url {
      onLoad([
        "url": url.absoluteString
      ])
    }
  }
}
```

`ExpoWebViewModule`에서 해당 `View`에 `onLoad` 이벤트가 있음을 표시합니다.

```swift
import ExpoModulesCore

public class ExpoWebViewModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoWebView")

    View(ExpoWebView.self) {
      Events("onLoad")

      Prop("url") { (view, url: URL) in
        if view.webView.url != url {
          let urlRequest = URLRequest(url: url)
          view.webView.load(urlRequest)
        }
      }
    }
  }
}
```

### TypeScript 모듈

이벤트 payload는 이벤트의 `nativeEvent` 프로퍼티 안에 포함됩니다. `onLoad` 이벤트에서 `url`에 접근하려면 `event.nativeEvent.url`을 읽습니다.

```tsx
import { ViewProps } from 'react-native';
import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

export type OnLoadEvent = {
  url: string;
};

export type Props = {
  url?: string;
  onLoad?: (event: { nativeEvent: OnLoadEvent }) => void;
} & ViewProps;

const NativeView: React.ComponentType<Props> = requireNativeViewManager('ExpoWebView');

export default function ExpoWebView(props: Props) {
  return <NativeView {...props} />;
}
```

### Example app

페이지가 로드되면 alert가 보이도록 example 앱을 업데이트합니다. 다음 코드를 복사한 뒤 앱을 다시 빌드하고 실행하면 alert가 보일 것입니다.

```tsx
import { WebView } from 'expo-web-view';

export default function App() {
  return (
    <WebView
      style={{ flex: 1 }}
      url="https://expo.dev"
      onLoad={event => alert(`loaded ${event.nativeEvent.url}`)}
    />
  );
}
```

## 보너스: 그 위에 웹 브라우저 UI 만들기

이제 WebView가 있으니 그 위에 웹 브라우저 UI를 만들어 보세요. 브라우저 UI를 직접 다시 만들어 보고, 필요하면 새로운 네이티브 기능도 자유롭게 추가해 보세요. 예를 들어 뒤로 가기나 새로고침 버튼을 지원할 수 있습니다. 영감이 필요하다면 아래 example을 참고하세요.

example/App.tsx

```tsx
import { useState } from 'react';
import { ActivityIndicator, Platform, Text, TextInput, View } from 'react-native';
import { WebView } from 'expo-web-view';

export default function App() {
  const [inputUrl, setInputUrl] = useState('https://docs.expo.dev/modules/');
  const [url, setUrl] = useState(inputUrl);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 80 : 30 }}>
      <TextInput
        value={inputUrl}
        onChangeText={setInputUrl}
        returnKeyType="go"
        autoCapitalize="none"
        onSubmitEditing={() => {
          if (inputUrl !== url) {
            setUrl(inputUrl);
            setIsLoading(true);
          }
        }}
        keyboardType="url"
        style={{
          color: '#fff',
          backgroundColor: '#000',
          borderRadius: 10,
          marginHorizontal: 10,
          paddingHorizontal: 20,
          height: 60,
        }}
      />

      <WebView
        url={url.startsWith('https://') || url.startsWith('http://') ? url : `https://${url}`}
        onLoad={() => setIsLoading(false)}
        style={{ flex: 1, marginTop: 20 }}
      />
      <LoadingView isLoading={isLoading} />
    </View>
  );
}

function LoadingView({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) {
    return null;
  }

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      }}>
      <ActivityIndicator animating={isLoading} color="#fff" style={{ marginRight: 10 }} />
      <Text style={{ color: '#fff' }}>Loading...</Text>
    </View>
  );
}
```

축하합니다! 이제 Android와 iOS용 네이티브 뷰가 포함된 첫 Expo module을 만들었습니다.

## 다음 단계

[Expo Modules API Reference](/modules/module-api) — Kotlin과 Swift를 사용해 네이티브 모듈을 만듭니다.

[Tutorial: Creating a native module](/modules/native-module-tutorial) — Expo Modules API로 설정을 유지하는 네이티브 모듈을 만드는 튜토리얼입니다.
