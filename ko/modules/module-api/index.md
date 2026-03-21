---
modificationDate: March 10, 2026
title: 모듈 API 참조
description: Expo modules API의 API 참조입니다.
---

# 모듈 API 참조

Expo modules API의 API 참조입니다.

네이티브 모듈 API는 [JSI](https://reactnative.dev/architecture/glossary#javascript-interfaces-jsi)와 React Native가 기반으로 삼는 다른 저수준 프리미티브 위에 있는 추상화 계층입니다. 이 API는 최신 언어(Swift와 Kotlin)로 구축되었으며, 가능한 한 플랫폼 간 일관된, 사용하기 쉽고 편리한 API를 제공합니다.

## 정의 컴포넌트

[Get Started](/modules/get-started) 페이지의 스니펫에서 보았듯이, 각 모듈 클래스는 `definition` 함수를 구현해야 합니다. 모듈 정의는 모듈의 기능과 동작을 설명하는 DSL 컴포넌트들로 구성됩니다.

### `Name`

JavaScript 코드가 모듈을 참조할 때 사용할 모듈 이름을 설정합니다. 문자열을 인자로 받습니다. 이 값은 모듈 클래스 이름에서 유추할 수도 있지만, 명확성을 위해 명시적으로 설정하는 것을 권장합니다.

```swift
Name("MyModuleName")
```

### `Constant`

JavaScript 객체에 상수 속성을 정의합니다. 이 속성은 처음 접근될 때 한 번만 계산되며, 이후 접근에서는 캐시된 값을 반환합니다.

```swift
Constant("PI") {
  Double.pi
}
```

```kotlin
Constant("PI") {
  Math.PI
}
```

### `Constants`

> **Deprecated:** 대신 [`Constant`](/modules/module-api#constant)를 사용하세요.

모듈에 상수 속성을 설정합니다. dictionary를 받거나 dictionary를 반환하는 closure를 받을 수 있습니다.

```swift
// Created from the dictionary
Constants([
  "PI": Double.pi
])

// or returned by the closure
Constants {
  return [
    "PI": Double.pi
  ]
}
```

```kotlin
// Passed as arguments
Constants(
  "PI" to kotlin.math.PI
)

// or returned by the closure
Constants {
  return@Constants mapOf(
    "PI" to kotlin.math.PI
  )
}
```

### `Function`

JavaScript로 export될 네이티브 동기 함수를 정의합니다. 동기 함수란 JavaScript에서 이 함수가 실행될 때 네이티브 코드가 같은 스레드에서 실행되며, 네이티브 함수가 반환될 때까지 스크립트의 추가 실행을 막는다는 뜻입니다.

#### 인자

-   **name**: `String` — JavaScript에서 호출할 함수 이름입니다.
-   **body**: `(args...) -> ReturnType` — 함수가 호출될 때 실행할 closure입니다.

이 함수는 최대 8개의 인자를 받을 수 있습니다. 이는 이 컴포넌트가 각각의 arity마다 별도로 구현되어야 하기 때문에 Swift와 Kotlin의 generic 한계에서 비롯됩니다.

함수 본문에서 어떤 타입을 사용할 수 있는지에 대한 자세한 내용은 [Argument types](/modules/module-api#argument-types) 섹션을 참고하세요.

```swift
Function("mySyncFunction") { (message: String) in
  return message
}
```

```kotlin
Function("mySyncFunction") { message: String ->
  return@Function message
}
```

```js
import { requireNativeModule } from 'expo-modules-core';

// Assume that we have named the module "MyModule"
const MyModule = requireNativeModule('MyModule');

function getMessage() {
  return MyModule.mySyncFunction('bar');
}
```

### `AsyncFunction`

항상 `Promise`를 반환하는 JavaScript 함수를 정의하며, 기본적으로 그 네이티브 코드는 JavaScript 런타임이 실행되는 스레드와 다른 스레드에서 디스패치됩니다.

#### 인자

-   **name**: `String` — JavaScript에서 호출할 함수 이름입니다.
-   **body**: `(args...) -> ReturnType` — 함수가 호출될 때 실행할 closure입니다.

마지막 인자의 타입이 `Promise`이면, 함수는 promise가 resolve 또는 reject될 때까지 기다린 후 응답을 JavaScript로 전달합니다. 그렇지 않으면 함수는 반환값으로 즉시 resolve되며, 예외가 발생하면 reject됩니다. 이 함수는 최대 8개의 인자(promise 포함)를 받을 수 있습니다.

함수 본문에서 어떤 타입을 사용할 수 있는지에 대한 자세한 내용은 [Argument types](/modules/module-api#argument-types) 섹션을 참고하세요.

다음과 같은 경우에는 `Function`보다 `AsyncFunction`을 사용하는 것이 권장됩니다:

-   네트워크 요청 전송이나 파일 시스템과의 상호작용처럼 I/O bound 작업을 수행할 때
-   UI 관련 작업을 위해 메인 UI 스레드처럼 다른 스레드에서 실행되어야 할 때
-   JavaScript 스레드를 막아 애플리케이션의 응답성을 떨어뜨릴 수 있는 광범위하거나 오래 걸리는 작업일 때

```swift
AsyncFunction("myAsyncFunction") { (message: String) in
  return message
}

// or

AsyncFunction("myAsyncFunction") { (message: String, promise: Promise) in
  promise.resolve(message)
}
```

```kotlin
AsyncFunction("myAsyncFunction") { message: String ->
  return@AsyncFunction message
}

// or

// Make sure to import `Promise` class from `expo.modules.kotlin` instead of `expo.modules.core`.
AsyncFunction("myAsyncFunction") { message: String, promise: Promise ->
  promise.resolve(message)
}
```

```js
import { requireNativeModule } from 'expo-modules-core';

// Assume that we have named the module "MyModule"
const MyModule = requireNativeModule('MyModule');

async function getMessageAsync() {
  return await MyModule.myAsyncFunction('bar');
}
```

컴포넌트의 결과에 `.runOnQueue` 함수를 호출해 `AsyncFunction`의 네이티브 큐를 바꿀 수 있습니다.

```swift
AsyncFunction("myAsyncFunction") { (message: String) in
  return message
}.runOnQueue(.main)
```

```kotlin
AsyncFunction("myAsyncFunction") { message: String ->
  return@AsyncFunction message
}.runOnQueue(Queues.MAIN)
```

#### Kotlin coroutines

Android에서 `AsyncFunction`은 suspendable body를 받을 수 있습니다. 다만 `Coroutine` 블록 뒤에 infix notation으로 전달해야 합니다. suspendable function과 coroutine에 대한 자세한 내용은 [coroutine overview](https://kotlinlang.org/docs/coroutines-overview.html)를 참고하세요.

suspendable body가 있는 `AsyncFunction`은 `Promise`를 인자로 받을 수 없습니다. 이 함수는 suspension 메커니즘을 사용해 비동기 호출을 실행합니다. 제공된 suspendable block의 반환값으로 즉시 resolve되거나, 예외가 발생하면 reject됩니다. 이 함수는 최대 8개의 인자를 받을 수 있습니다.

기본적으로 suspend function은 모듈의 coroutine scope에서 디스패치됩니다. 또한 body block 안에서 호출되는 다른 모든 suspendable function도 같은 scope 안에서 실행됩니다. 이 scope의 lifecycle은 모듈의 lifecycle에 결합되어 있어, 모듈이 deallocate되면 완료되지 않은 모든 suspend function은 취소됩니다.

```kotlin
AsyncFunction("suspendFunction") Coroutine { message: String ->
  // You can execute other suspendable functions here.
  // For example, you can use `kotlinx.coroutines.delay` to delay resolving the underlying promise.
  delay(5000)
  return@Coroutine message
}
```

### `Property`

네이티브 모듈을 나타내는 JavaScript 객체에 새 속성을 직접 정의합니다. 이는 모듈 객체에 [`Object.defineProperty`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)를 호출하는 것과 같습니다.

읽기 전용 속성을 선언하려면 두 개의 인자만 받는 축약 문법을 사용할 수 있습니다:

-   **name**: `String` — JavaScript에서 사용할 속성 이름입니다.
-   **getter**: `() -> PropertyType` — 속성 getter가 호출될 때 실행할 closure입니다.

```swift
Property("foo") {
  return "bar"
}
```

```kotlin
Property("foo") {
  return@Property "bar"
}
```

mutable 속성의 경우 getter와 setter closure가 모두 필요합니다(아래 문법은 setter만 있는 속성을 선언하는 데도 사용할 수 있습니다):

-   **name**: `String` — JavaScript에서 사용할 속성 이름입니다.
-   **getter**: `() -> PropertyType` — 속성 getter가 호출될 때 실행할 closure입니다.
-   **setter**: `(newValue: PropertyType) -> void` — 속성 setter가 호출될 때 실행할 closure입니다.

```swift
Property("foo")
  .get { return "bar" }
  .set { (newValue: String) in
    // do something with new value
  }
```

```kotlin
Property("foo")
  .get { return@get "bar" }
  .set { newValue: String ->
    // do something with new value
  }
```

```js
import { requireNativeModule } from 'expo-modules-core';

// Assume that we have named the module "MyModule"
const MyModule = requireNativeModule('MyModule');

// Obtain the property value
MyModule.foo;

// Set a new value
MyModule.foo = 'foobar';
```

### `View`

모듈을 네이티브 view로 사용할 수 있게 합니다. view 정의 안에서 허용되는 정의 컴포넌트는 [`Prop`](/modules/module-api#prop), [`Events`](/modules/module-api#events), [`GroupView`](/modules/module-api#groupview), [`AsyncFunction`](/modules/module-api#asyncfunction)입니다.

view 정의 안의 [`AsyncFunction`](/modules/module-api#asyncfunction)은 네이티브 view를 나타내는 React 컴포넌트의 React ref에 추가됩니다. 이러한 async function은 자동으로 네이티브 view 인스턴스를 첫 번째 인자로 받고, 기본적으로 UI 스레드에서 실행됩니다.

#### 인자

-   **viewType** — 렌더링될 네이티브 view의 클래스입니다. 참고: Android에서는 제공한 클래스가 반드시 [`ExpoView`](/modules/module-api#expoview)를 상속해야 하며, iOS에서는 선택 사항입니다. [`Extending ExpoView`](/modules/module-api#extending--expoview)를 참고하세요.
-   **definition**: `() -> ViewDefinition` — view 정의를 구성하는 builder입니다.

```swift
View(UITextView.self) {
  Prop("text") { ...  }

  AsyncFunction("focus") { (view: UITextView) in
    view.becomeFirstResponder()
  }
}
```

```kotlin
View(TextView::class) {
  Prop("text") { ...  }

  AsyncFunction("focus") { view: TextView ->
    view.requestFocus()
  }
}
```

> SwiftUI view 렌더링 지원이 예정되어 있습니다. 현재로서는 [`UIHostingController`](https://developer.apple.com/documentation/swiftui/uihostingcontroller)를 사용해 그 content view를 UIKit view에 추가할 수 있습니다.

### 이벤트 관찰

### `Events`

모듈이 JavaScript로 보낼 수 있는 이벤트 이름을 정의합니다.

> **Note:** 이 컴포넌트는 [`View`](/modules/module-api#view) 블록 안에서 callback 이름을 정의하는 데 사용할 수 있습니다. [`View callbacks`](/modules/module-api#view-callbacks)을 참고하세요.

```swift
Events("onCameraReady", "onPictureSaved", "onBarCodeScanned")
```

```kotlin
Events("onCameraReady", "onPictureSaved", "onBarCodeScanned")
```

네이티브 코드에서 JavaScript/TypeScript로 이벤트를 보내는 방법은 [Sending events](/modules/module-api#sending-events)를 참고하세요.

### `OnStartObserving`

첫 번째 이벤트 listener가 추가될 때 호출되는 함수를 정의합니다.

listener를 특정 이벤트로 한정하려면 이벤트 이름을 전달해야 합니다. 이는 전역적으로가 아니라 이벤트별로 리소스를 설정하거나 해제해야 할 때 유용합니다.

```swift
// Called when a listener for "onURLReceived" is added
OnStartObserving("onURLReceived") {
  ... 
}
```

```kotlin
// Called when a listener for "onURLReceived" is added
OnStartObserving("onURLReceived") {
  ... 
}
```

### `OnStopObserving`

특정 이벤트의 모든 이벤트 listener가 제거될 때 호출되는 함수를 정의합니다.

`OnStartObserving`과 마찬가지로 listener를 특정 이벤트에 한정하려면 이벤트 이름을 전달해야 합니다.

```swift
// Called when listeners for "onURLReceived" are removed
OnStopObserving("onURLReceived") {
  ... 
}
```

```kotlin
// Called when listeners for "onURLReceived" are removed
OnStopObserving("onURLReceived") {
  ... 
}
```

### Lifecycle listeners

### `OnCreate`

모듈 초기화 직후 호출되는 모듈 lifecycle listener를 정의합니다. 모듈이 초기화될 때 무언가를 설정해야 한다면, 모듈 클래스의 initializer 대신 이를 사용하세요.

### `OnDestroy`

모듈이 deallocate되기 직전에 호출되는 모듈 lifecycle listener를 정의합니다. 모듈 클래스의 destructor 대신 이를 사용하세요.

### `OnAppContextDestroys`

모듈을 소유한 app context가 deallocate되기 직전에 호출되는 모듈 lifecycle listener를 정의합니다.

### `OnAppEntersForeground`

지원 플랫폼: iOS.

앱이 foreground 모드로 들어가려 할 때 호출되는 listener를 정의합니다.

> **Note:** 이 함수는 Android에서는 사용할 수 없습니다. 대신 [`OnActivityEntersForeground`](/modules/module-api#onactivityentersforeground)를 사용해 보세요.

### `OnAppEntersBackground`

지원 플랫폼: iOS.

앱이 background 모드로 들어갈 때 호출되는 listener를 정의합니다.

> **Note:** 이 함수는 Android에서는 사용할 수 없습니다. 대신 [`OnActivityEntersBackground`](/modules/module-api#onactivityentersbackground)를 사용해 보세요.

### `OnAppBecomesActive`

지원 플랫폼: iOS.

앱이 다시 활성 상태가 될 때(`OnAppEntersForeground` 이후) 호출되는 listener를 정의합니다.

> **Note:** 이 함수는 Android에서는 사용할 수 없습니다. 대신 [`OnActivityEntersForeground`](/modules/module-api#onactivityentersforeground)를 사용해 보세요.

### `OnActivityEntersForeground`

지원 플랫폼: Android.

activity가 resume된 직후 호출되는 activity lifecycle listener를 정의합니다.

> **Note:** 이 함수는 iOS에서는 사용할 수 없습니다. 대신 [`OnAppEntersForeground`](/modules/module-api#onappentersforeground)를 사용해 보세요.

### `OnActivityEntersBackground`

지원 플랫폼: Android.

activity가 pause된 직후 호출되는 activity lifecycle listener를 정의합니다.

> **Note:** 이 함수는 iOS에서는 사용할 수 없습니다. 대신 [`OnAppEntersBackground`](/modules/module-api#onappentersbackground)를 사용해 보세요.

### `OnActivityDestroys`

지원 플랫폼: Android.

JavaScript context를 소유한 activity가 파괴되기 직전에 호출되는 activity lifecycle listener를 정의합니다.

> **Note:** 이 함수는 iOS에서는 사용할 수 없습니다. 대신 [`OnAppEntersBackground`](/modules/module-api#onappentersbackground)를 사용해 보세요.

### `OnActivityResult`

지원 플랫폼: Android.

`startActivityForResult`로 실행된 activity가 결과를 반환할 때 호출되는 activity lifecycle listener를 정의합니다.

#### 인자

-   **activity** — 결과를 받은 Android activity입니다.
-   **payload** — activity 결과에 대한 데이터를 담은 객체입니다.
    -   **requestCode**: `Int` — 결과의 출처를 식별하기 위해 `startActivityForResult`에 원래 전달했던 request code입니다.
    -   **resultCode**: `Int` — 하위 activity가 반환한 result code입니다(예: `Activity.RESULT_OK`, `Activity.RESULT_CANCELED`).
    -   **data** — 실행한 activity가 반환한 결과 데이터를 담는 선택적 intent입니다. `null`일 수 있습니다.

```kotlin
AsyncFunction('someFunc') {
  ... 
  activity.startActivityForResult(someIntent, SOME_REQUEST_CODE)
}

OnActivityResult { activity, payload ->
  ... 
}
```

### `OnNewIntent`

지원 플랫폼: Android.

activity가 새 intent를 받을 때(예: deep link) 호출되는 activity lifecycle listener를 정의합니다.

#### 인자

-   **intent**: `Intent` — activity에 전달된 새 intent입니다. `Intent` 타입에 대한 자세한 내용은 다음을 참고하세요: [https://developer.android.com/reference/android/content/Intent](https://developer.android.com/reference/android/content/Intent).

```kotlin
OnNewIntent { intent ->
  val data = intent.data
  // Handle the incoming intent
}
```

### `OnUserLeavesActivity`

지원 플랫폼: Android.

사용자 선택으로 activity가 background로 가기 직전에 activity lifecycle 중 호출되는 activity lifecycle listener를 정의합니다. 예를 들어 사용자가 Home 키를 누르면 `OnUserLeavesActivity`가 호출되지만, 수신 전화로 인해 in-call Activity가 자동으로 foreground로 올라오는 경우에는 중단되는 activity에서 `OnUserLeavesActivity`가 호출되지 않습니다.

```kotlin
OnUserLeavesActivity {
  // Your implementation
}
```

### `RegisterActivityContracts`

지원 플랫폼: Android.

type-safe한 방식으로 activity를 실행하고 결과를 처리할 수 있게 해주는 Android [activity result contracts](https://developer.android.com/training/basics/intents/result)를 등록합니다. 이것은 `startActivityForResult`의 최신 대체 방식입니다.

`RegisterActivityContracts` 블록 안에서 `registerForActivityResult`를 사용해 각 contract를 등록하세요. 등록된 launcher는 이후 async function에서 activity를 실행하는 데 사용할 수 있습니다.

```kotlin
class ImagePickerModule : Module() {
  private lateinit var cameraLauncher: ActivityResultLauncher<CameraContractOptions>
  private lateinit var imageLibraryLauncher: ActivityResultLauncher<ImageLibraryContractOptions>

  override fun definition() = ModuleDefinition {
    Name("ImagePicker")

    RegisterActivityContracts {
      cameraLauncher = registerForActivityResult(
        CameraContract(this@ImagePickerModule)
      ) { input, result ->
        handleResult(result, input.options)
      }

      imageLibraryLauncher = registerForActivityResult(
        ImageLibraryContract(this@ImagePickerModule)
      ) { input, result ->
        handleResult(result, input.options)
      }
    }

    AsyncFunction("launchCameraAsync") { options: PickerOptions ->
      cameraLauncher.launch(CameraContractOptions(options))
    }
  }
}
```

## View 정의 컴포넌트

view 정의는 view의 기능과 동작을 설명하는 DSL 컴포넌트들로 구성됩니다. 이 컴포넌트들은 [`View`](/modules/module-api#view) closure 안에서만 사용할 수 있습니다.

### `Name`

JavaScript 코드가 view를 참조할 때 사용할 view 이름을 설정합니다. 문자열을 인자로 받습니다. 이 값은 view 클래스 이름에서 유추할 수 있지만, 명확성을 위해 명시적으로 설정하는 것을 권장합니다.

```swift
Name("MyViewName")
```

### `Prop`

주어진 이름의 view prop에 대한 setter를 정의합니다.

#### 인자

-   **name**: `String` — setter를 정의하려는 view prop의 이름입니다.
-   **defaultValue**: `ValueType` — setter가 `null`로 호출될 때 사용할 선택적 기본값입니다.
-   **setter**: `(view: ViewType, value: ValueType) -> ()` — view가 rerender될 때 호출되는 closure입니다.

이 속성은 [`View`](/modules/module-api#view) closure 안에서만 사용할 수 있습니다.

```swift
Prop("background") { (view: UIView, color: UIColor) in
  view.backgroundColor = color
}
```

```kotlin
Prop("background") { view: View, @ColorInt color: Int ->
  view.setBackgroundColor(color)
}
```

기본값이 있는 Prop 정의입니다.

```swift
Prop("background", UIColor.black) { (view: UIView, color: UIColor) in
  view.backgroundColor = color
}
```

```kotlin
Prop("background", Color.BLACK) { view: View, @ColorInt color: Int ->
  view.setBackgroundColor(color)
}
```

> **Note:** 함수 타입(callback)의 prop은 아직 지원되지 않습니다.

### `PropGroup`

지원 플랫폼: Android.

공통 setter 패턴을 공유하는 여러 prop을 한꺼번에 등록합니다. 각 prop을 개별적으로 정의하는 대신, 하나의 handler로 모두 한 번에 등록할 수 있습니다.

두 가지 overload가 제공됩니다:

-   **Pair-based**: 각 prop은 `Pair<String, CustomValueType>`입니다. handler는 view, 매핑된 custom value, prop 값을 받습니다.
-   **String-based**: 각 prop은 이름 문자열입니다. handler는 view, 위치 인덱스, prop 값을 받습니다.

```kotlin
// Pair-based: map each prop name to a custom value
PropGroup(
  "borderTopColor" to LogicalEdge.TOP,
  "borderBottomColor" to LogicalEdge.BOTTOM,
  "borderLeftColor" to LogicalEdge.LEFT,
  "borderRightColor" to LogicalEdge.RIGHT
) { view: View, edge: LogicalEdge, color: Int? ->
  BackgroundStyleApplicator.setBorderColor(view, edge, color)
}

// String-based: use positional index
PropGroup(
  "borderWidth", "borderLeftWidth", "borderRightWidth",
  "borderTopWidth", "borderBottomWidth"
) { view: View, index: Int, width: Float? ->
  val edge = LogicalEdge.entries[index]
  BackgroundStyleApplicator.setBorderWidth(view, edge, width ?: Float.NaN)
}
```

> **Note:** `PropGroup`은 CSS prop decorator 내부에서 사용됩니다. 대부분의 모듈은 공통 setter 패턴을 가진 많은 prop이 있지 않다면 개별 `Prop` 정의를 사용하면 됩니다.

### Lifecycle

### `OnViewDidUpdateProps`

view가 모든 prop 업데이트를 마쳤을 때 호출되는 view lifecycle 메서드를 정의합니다.

```swift
OnViewDidUpdateProps { view: MyView in
  ... 
}
```

```kotlin
OnViewDidUpdateProps { view: MyView ->
  ... 
}
```

### `OnViewDestroys`

지원 플랫폼: Android.

React Native가 더 이상 view를 사용하지 않게 된 직후 호출되는 view lifecycle listener를 생성합니다.

```kotlin
View(MyView::class) {
  OnViewDestroys { view: MyView ->
    ... 
  }
}
```

> **Note:** 이 함수는 iOS에서는 사용할 수 없습니다. 유사한 결과를 원한다면 네이티브 view의 destructor를 사용해 보세요.

### `AsyncFunction`

모듈 정의 안의 [`AsyncFunction`](/modules/module-api#asyncfunction)과 비슷하게, 네이티브 view를 직접 수정할 수 있도록 view ref에 연결되는 함수를 정의할 수 있습니다.

view async function은 항상 main queue에서 디스패치되며, 첫 번째 인자로 view 인스턴스를 받을 수 있습니다.

```swift
View(MyView.self) {
  AsyncFunction("myAsyncFunction") { (view: MyView, message: String) in
    view.displayMessage(message)
  }
}
```

```kotlin
View(MyView::class) {
  AsyncFunction("myAsyncFunction") { view: MyView, message: String ->
    view.displayMessage(message);
  }
}
```

```js
const MyNativeView = requireNativeViewManager('MyView');

function MyComponent() {
  const ref = React.useRef(null);

  React.useEffect(() => {
    ref.current?.myAsyncFunction();
  }, [ref]);

  return <MyNativeView ref={ref} />;
}
```

### View groups

### `GroupView`

지원 플랫폼: Android.

view를 view group으로 사용할 수 있게 합니다. group view 정의 안에서 허용되는 정의 컴포넌트는 [`AddChildView`](/modules/module-api#addchildview), [`GetChildCount`](/modules/module-api#getchildcount), [`GetChildViewAt`](/modules/module-api#getchildviewat), [`RemoveChildView`](/modules/module-api#removechildview), [`RemoveChildViewAt`](/modules/module-api#removechildviewat)입니다.

#### 인자

-   **viewType** — 네이티브 view의 클래스입니다. 제공된 클래스는 반드시 Android `ViewGroup`을 상속해야 합니다.
-   **definition**: `() -> ViewGroupDefinition` — view group 정의를 구성하는 builder입니다.

이 속성은 [`View`](/modules/module-api#view) closure 안에서만 사용할 수 있습니다.

```kotlin
GroupView<ViewGroup> {
  AddChildView { parent, child, index -> ... }
}
```

### `AddChildView`

지원 플랫폼: Android.

view group에 child view를 추가하는 동작을 정의합니다.

#### 인자

-   **action**: `(parent: ParentType, child: ChildType, index: Int) -> ()` — child view를 view group에 추가하는 동작입니다.

이 속성은 [`GroupView`](/modules/module-api#groupview) closure 안에서만 사용할 수 있습니다.

```kotlin
AddChildView { parent, child: View, index ->
  parent.addView(child, index)
}
```

### `GetChildCount`

지원 플랫폼: Android.

view group 안의 child view 개수를 가져오는 동작을 정의합니다.

#### 인자

-   **action**: `(parent: ParentType) -> Int` — child view 개수를 반환하는 함수입니다.

이 속성은 [`GroupView`](/modules/module-api#groupview) closure 안에서만 사용할 수 있습니다.

```kotlin
GetChildCount { parent ->
  return@GetChildCount parent.childCount
}
```

### `GetChildViewAt`

지원 플랫폼: Android.

view group에서 특정 인덱스의 child view를 가져오는 동작을 정의합니다.

#### 인자

-   **action**: `(parent: ParentType, index: Int) -> ChildType` — 특정 인덱스의 child view를 가져오는 함수입니다.

이 속성은 [`GroupView`](/modules/module-api#groupview) closure 안에서만 사용할 수 있습니다.

```kotlin
GetChildViewAt { parent, index ->
  parent.getChildAt(index)
}
```

### `RemoveChildView`

지원 플랫폼: Android.

view group에서 특정 child view를 제거하는 동작을 정의합니다.

#### 인자

-   **action**: `(parent: ParentType, child: ChildType) -> ()` — 특정 child view를 제거하는 함수입니다.

이 속성은 [`GroupView`](/modules/module-api#groupview) closure 안에서만 사용할 수 있습니다.

```kotlin
RemoveChildView { parent, child: View ->
  parent.removeView(child)
}
```

### `RemoveChildViewAt`

지원 플랫폼: Android.

view group에서 특정 인덱스의 child view를 제거하는 동작을 정의합니다.

#### 인자

-   **action**: `(parent: ParentType, child: ChildType) -> ()` — 특정 인덱스의 child view를 제거하는 함수입니다.

이 속성은 [`GroupView`](/modules/module-api#groupview) closure 안에서만 사용할 수 있습니다.

```kotlin
RemoveChildViewAt { parent, index ->
  parent.removeViewAt(child)
}
```

## 인자 타입

기본적으로 런타임 사이에는 primitive하고 직렬화 가능한 데이터만 주고받을 수 있습니다. 하지만 네이티브 모듈은 보통 네이티브 타입 안전성을 유지하면서, 각 값의 타입이 알려지지 않은(`Any`) 단순 dictionary(Swift)나 map(Kotlin)보다 더 정교한 커스텀 데이터 구조를 받아야 합니다. Expo Modules API는 데이터 객체를 더 편리하게 다루고, 자동 검증을 제공하며, 각 객체 멤버에 대해 네이티브 타입 안전성을 보장하기 위한 프로토콜을 제공합니다.

### `Primitives`

모든 함수와 view prop setter는 Swift와 Kotlin의 일반적인 primitive 타입을 모두 인자로 받습니다. 여기에는 이러한 primitive 타입의 배열, dictionary/map, optional도 포함됩니다.

| 언어 | 지원되는 primitive 타입 |
| --- | --- |
| Swift | `Bool`, `Int`, `Int8`, `Int16`, `Int32`, `Int64`, `UInt`, `UInt8`, `UInt16`, `UInt32`, `UInt64`, `Float32`, `Double`, `String` |
| Kotlin | `Boolean`, `Int`, `Long`, `Float`, `Double`, `String`, `Pair` |

### `Convertibles`

_Convertibles_는 JavaScript에서 전달된 특정 형태의 데이터로부터 초기화될 수 있는 네이티브 타입입니다. 이러한 타입은 `Function` body에서 인자 타입으로 사용할 수 있습니다. 예를 들어 `CGPoint` 타입을 함수 인자 타입으로 사용하면, `{ x: number, y: number }` 형태의 JavaScript 객체나 숫자 두 개 `(x, y)`의 배열로부터 인스턴스를 만들 수 있습니다.

내장 Convertibles는 [아래에서 더 자세히](/modules/module-api#built-in-convertibles) 설명합니다.

추가 Convertibles는 네이티브 Swift 타입이 `Convertible` 프로토콜을 따르도록 만들어 정의할 수 있습니다:

### `Convertible`

지원 플랫폼: iOS.

`Convertible`은 하나의 static 메서드를 가진 Swift 프로토콜입니다:

### `convert(value, appContext)`

| Parameter | Type | Description |
| --- | --- | --- |
| `value` | `Any?` | 변환할 JavaScript 값 |
| `appContext` | `AppContext` | 현재 실행 중인 Expo 앱 인스턴스의 context 객체 |

  

JavaScript의 동적 타입 값을 `Convertible`을 따르는 Swift 타입의 인스턴스로 변환하는 static 메서드입니다. 구현체는 값이 유효하지 않거나 지원되지 않는 타입일 때 예외를 던져야 합니다.

Returns: `Self`

#### 예시

```swift
import ExpoModulesCore

extension CMTime: @retroactive Convertible {
  public static func convert(from value: Any?, appContext: AppContext) throws -> CMTime {
    if let seconds = value as? Double {
      return CMTime(seconds: seconds, preferredTimescale: .max)
    }
    throw Conversions.ConvertingException<CMTime>(value)
  }
}
```

Kotlin에서는 기존 타입에 프로토콜을 확장해 붙일 수 없습니다. 사용 가능한 타입을 확장하려면 `ModuleConverters` builder를 사용할 수 있습니다:

### `ModuleConverters`

지원 플랫폼: Android.

Android에서 모듈은 커스텀 타입 변환기를 정의해 비표준 타입을 함수 인자로 사용할 수 있습니다. `Module` 클래스에서 `converters()` 메서드를 재정의하고 `ModuleConverters` builder를 사용해 `.from<SourceType> { }` 체인으로 변환기를 등록하세요.

```kotlin
class MyModule : Module() {
  override fun converters() = ModuleConverters {
    TypeConverter(CustomType::class)
      .from { number: Int ->
        CustomType.fromInt(number)
      }
      .from { string: String ->
        CustomType.parse(string)
      }
  }

  override fun definition() = ModuleDefinition {
    Name("MyModule")

    // CustomType can now be used as an argument type
    Function("process") { value: CustomType ->
      value.doSomething()
    }
  }
}
```

각 `.from<T> { }` 호출은 타입 `T`에서 커스텀 타입으로의 변환기를 등록합니다. 런타임에서 프레임워크는 들어온 JavaScript 값과 일치하는 변환기를 찾을 때까지 등록된 변환기를 순서대로 시도합니다.

> **Note:** iOS에서는 대신 `Convertible` 프로토콜을 사용하세요(위에서 설명됨).

### Built-in Convertibles

`CoreGraphics`와 `UIKit` 시스템 프레임워크의 일부 일반적인 iOS 타입은 이미 convertible로 구현되어 있습니다.

| Native iOS Type | TypeScript |
| --- | --- |
| `URL` | URL이 포함된 `string`. scheme이 제공되지 않으면 file URL로 간주됩니다. |
| `CGFloat` | `number` |
| `CGPoint` | `{ x: number, y: number }` 또는 _x_와 _y_ 좌표를 담은 `number[]` |
| `CGSize` | `{ width: number, height: number }` 또는 _width_와 _height_를 담은 `number[]` |
| `CGVector` | `{ dx: number, dy: number }` 또는 _dx_와 _dy_ 벡터 차이를 담은 `number[]` |
| `CGRect` | `{ x: number, y: number, width: number, height: number }` 또는 _x_, _y_, _width_, _height_ 값을 담은 `number[]` |
| `CGColor``UIColor` | Color hex string (`#RRGGBB`, `#RRGGBBAA`, `#RGB`, `#RGBA`), [CSS3/SVG specification](https://www.w3.org/TR/css-color-3/#svg-color)을 따르는 named colors, 또는 `"transparent"` |
| `Data` | `Uint8Array` , SDK 50+ |

비슷하게 `java.io`, `java.net`, `android.graphics` 같은 패키지의 일반적인 Android 타입도 convertible로 구현되어 있습니다.

> **Note:** Android에서는 가능하면 primitive array를 사용하는 것이 좋습니다.

| Native Android Type | TypeScript |
| --- | --- |
| `java.net.URL` | URL이 포함된 `string`. scheme이 반드시 제공되어야 합니다(URL에는 인코딩되지 않은 `%` 문자가 포함되어서는 안 됩니다). |
| `android.net.Uri``java.net.URI` | URI가 포함된 `string`. scheme이 반드시 제공되어야 합니다(URI에는 인코딩되지 않은 `%` 문자가 포함되어서는 안 됩니다). |
| `java.io.File``java.nio.file.Path` (Android API 26에서만 사용 가능) | 파일 경로가 담긴 `string` |
| `android.graphics.Color` | Color hex string (`#RRGGBB`, `#RRGGBBAA`, `#RGB`, `#RGBA`), [CSS3/SVG specification](https://www.w3.org/TR/css-color-3/#svg-color)을 따르는 named colors, 또는 `"transparent"` |
| `kotlin.Pair<A, B>` | 첫 번째 값이 _A_ 타입, 두 번째 값이 _B_ 타입인 두 값의 배열 |
| `kotlin.ByteArray` | `Uint8Array` , SDK 50+ |
| `kotlin.BooleanArray` | `boolean[]` |
| `kotlin.IntArray``kotlin.FloatArray``kotlin.LongArray``kotlin.DoubleArray` | `number[]` |
| `kotlin.time.Duration` | 초 단위 duration을 나타내는 `number` , SDK 52+ |

### `Records`

_Record_는 convertible 타입이며 dictionary(Swift) 또는 map(Kotlin)에 해당하지만, 각 필드가 자신의 타입을 가질 수 있고 기본값도 제공할 수 있는 struct로 표현됩니다. JavaScript 객체를 네이티브 타입 안전성을 유지한 채 표현하는 더 나은 방법입니다.

```swift
struct FileReadOptions: Record {
  @Field
  var encoding: String = "utf8"

  @Field
  var position: Int = 0

  @Field
  var length: Int?
}

// Now this record can be used as an argument of the functions or the view prop setters.
Function("readFile") { (path: String, options: FileReadOptions) -> String in
  // Read the file using given `options`
}
```

```kotlin
class FileReadOptions : Record {
  @Field
  val encoding: String = "utf8"

  @Field
  val position: Int = 0

  @Field
  val length: Int? = null
}

// Now this record can be used as an argument of the functions or the view prop setters.
Function("readFile") { path: String, options: FileReadOptions ->
  // Read the file using given `options`
}
```

### `Formatter`

> **This feature is experimental.**

Formatter API를 사용하면 네이티브 함수에서 반환될 때 Record가 어떻게 직렬화되는지 커스터마이즈할 수 있습니다. JavaScript로 보내기 전에 속성 값을 변환하거나, 출력에서 특정 속성을 조건부로 제외해야 할 때 유용합니다.

#### 작업

-   **map**: 직렬화 전에 속성 값을 변환합니다.
-   **skip**: 출력에서 속성을 완전히 제외합니다.

#### 기본 사용법

```swift
struct UserInfo: Record {
  @Field var id: Int = 0
  @Field var email: String = ""
  @Field var password: String = ""
}

Function("getUser") {
  let user = UserInfo(id: 1, email: "user@example.com", password: "secret123")

  // Return user without exposing the password
  return user.format { formatter in
    formatter.property("password", keyPath: \.password).skip()
  }
}
```

```kotlin
class UserInfo(
  @Field val id: Int = 0,
  @Field val email: String = "",
  @Field val password: String = ""
) : Record

Function("getUser") {
  val user = UserInfo(id = 1, email = "user@example.com", password = "secret123")

  // Return user without exposing the password
  formatter {
    property(UserInfo::password).skip()
  }.format(user)
}
```

```js
const user = MyModule.getUser();
console.log(user);
// Output: { id: 1, email: "user@example.com" }
// Note: password is not present in the object
```

#### `map`으로 값 변환하기

`map`을 사용해 JavaScript로 보내기 전에 속성 값을 변환할 수 있습니다:

```swift
struct Product: Record {
  @Field var name: String = ""
  @Field var price: Double = 0.0
}

Function("getProduct") {
  let product = Product(name: "Widget", price: 19.99)

  return product.format { formatter in
    // Transform price to include currency symbol
    formatter.property("price", keyPath: \.price).map { value in
      "$\(String(format: "%.2f", value))"
    }
  }
}
```

```kotlin
class Product(
  @Field val name: String = "",
  @Field val price: Double = 0.0
) : Record

Function("getProduct") {
  val product = Product(name = "Widget", price = 19.99)

  formatter {
    // Transform price to include currency symbol
    property(Product::price).map { value ->
      "${"$"}${String.format("%.2f", value)}"
    }
  }.format(product)
}
```

#### 조건부 skip

값이나 Record의 상태에 따라 속성을 조건부로 skip할 수 있습니다:

```swift
struct Settings: Record {
  @Field var theme: String = "light"
  @Field var debugMode: Bool = false
  @Field var apiKey: String? = nil
}

Function("getSettings") {
  let settings = Settings(theme: "dark", debugMode: true, apiKey: "secret")

  return settings.format { formatter in
    // Skip apiKey if nil
    formatter.property("apiKey", keyPath: \.apiKey).skip { value in
      value == nil
    }
  }
}
```

```kotlin
class Settings(
  @Field val theme: String = "light",
  @Field val debugMode: Boolean = false,
  @Field val apiKey: String? = null
) : Record

Function("getSettings") {
  val settings = Settings(theme = "dark", debugMode = true, apiKey = "secret")

  formatter {
    // Skip apiKey if null
    property(Settings::apiKey).skip { value ->
      value == null
    }
  }.format(settings)
}
```

#### 작업 체이닝

같은 속성에 여러 작업을 체인으로 연결할 수 있습니다:

```swift
struct Data: Record {
  @Field var value: Int? = nil
}

Function("getData") {
  let data = Data(value: nil)

  return data.format { formatter in
    formatter.property("value", keyPath: \.value)
      .map { $0 ?? 0 }  // Default to 0 if nil
      .map { $0 * 2 }   // Double the value
  }
}
```

```kotlin
class Data(
  @Field val value: Int? = null
) : Record

Function("getData") {
  val data = Data(value = null)

  formatter {
    property(Data::value)
      .map { it ?: 0 }  // Default to 0 if null
      .map { it * 2 }   // Double the value
  }.format(data)
}
```

### `Enums`

enum을 사용하면 위 예제(`FileReadOptions` record)보다 더 나아가 지원되는 encoding을 `"utf8"`과 `"base64"`로 제한할 수 있습니다. enum을 인자나 record 필드로 사용하려면 primitive 값(예: `String`, `Int`)을 표현해야 하며 `Enumerable`을 따라야 합니다.

```swift
enum FileEncoding: String, Enumerable {
  case utf8
  case base64
}

struct FileReadOptions: Record {
  @Field
  var encoding: FileEncoding = .utf8
  ... 
}
```

```kotlin
// Note: the constructor must have an argument called value.
enum class FileEncoding(val value: String) : Enumerable {
  utf8("utf8"),
  base64("base64")
}

class FileReadOptions : Record {
  @Field
  val encoding: FileEncoding = FileEncoding.utf8
  ... 
}
```

### `Eithers`

하나의 함수 인자에 여러 타입을 전달하고 싶은 사용 사례도 있습니다. 이때 Either 타입이 유용할 수 있습니다. Either는 여러 타입 중 하나의 값을 담는 컨테이너 역할을 합니다.

```swift
Function("foo") { (bar: Either<String, Int>) in
  if let bar: String = bar.get() {
    // `bar` is a String
  }
  if let bar: Int = bar.get() {
    // `bar` is an Int
  }
}
```

```kotlin
Function("foo") { bar: Either<String, Int> ->
  bar.get(String::class).let {
    // `it` is a String
  }
  bar.get(Int::class).let {
    // `it` is an Int
  }
}
```

현재는 세 가지 Either 타입 구현이 기본 제공되며, 최대 네 개의 서로 다른 subtype까지 사용할 수 있습니다.

-   `Either<FirstType, SecondType>` — 두 타입 중 하나를 담는 컨테이너.
-   `EitherOfThree<FirstType, SecondType, ThirdType>` — 세 타입 중 하나를 담는 컨테이너.
-   `EitherOfFour<FirstType, SecondType, ThirdType, FourthType>` — 네 타입 중 하나를 담는 컨테이너.

### `ValueOrUndefined`

> **This feature is experimental.**

`ValueOrUndefined`는 JavaScript의 `undefined` 값과 실제 값을 구분할 수 있게 해주는 wrapper 타입입니다.

일반 optional 타입에서는 JavaScript의 `undefined`와 `null`이 모두 네이티브 쪽에서 `null`로 변환되어 둘을 구분할 수 없습니다. `ValueOrUndefined`는 이 구분을 보존해 이 문제를 해결합니다.

#### 속성

### `isUndefined`

JavaScript 값이 `undefined`였다면 `true`, 그렇지 않다면 `false`를 반환합니다.

Returns: `Bool`

### `optional`

값이 존재하면 unwrap된 값을 반환하고, 값이 `undefined`였다면 `null`을 반환합니다.

Returns: `InnerType?`

```swift
Function("configure") { (timeout: ValueOrUndefined<Int>) in
  if timeout.isUndefined {
    // Argument was not provided, use default behavior
  } else if let value = timeout.optional {
    // Argument was provided with a value
  }
}
```

```kotlin
Function("configure") { timeout: ValueOrUndefined<Int> ->
  if (timeout.isUndefined) {
    // Argument was not provided, use default behavior
  } else {
    timeout.optional?.let { value ->
      // Argument was provided with a value
    }
  }
}
```

#### `undefined`와 `null` 구분하기

optional inner type과 함께 `ValueOrUndefined`를 사용하면 세 가지 상태를 구분할 수 있습니다:

```swift
Function("setName") { (name: ValueOrUndefined<String?>) in
  switch name {
  case .undefined:
    // name argument was not provided
    break
  case .value(let unwrapped) where unwrapped == nil:
    // name was explicitly set to null
    break
  case .value(let unwrapped):
    // name was set to a string value
    print("Name: \(unwrapped!)")
  }
}
```

```kotlin
Function("setName") { name: ValueOrUndefined<String?> ->
  when {
    name.isUndefined -> {
      // name argument was not provided
    }
    name.optional == null -> {
      // name was explicitly set to null
    }
    else -> {
      // name was set to a string value
      println("Name: ${name.optional}")
    }
  }
}
```

```js
import { requireNativeModule } from 'expo-modules-core';

const MyModule = requireNativeModule('MyModule');

MyModule.setName('Alice'); // name is a value
MyModule.setName(null); // name is null (but not undefined)
MyModule.setName(undefined); // name is undefined
```

### `JavaScript values`

`JavaScriptValue` 타입도 사용할 수 있습니다. 이는 JavaScript에서 표현 가능한 어떤 값이든 담을 수 있는 holder입니다. 이 타입은 전달된 인자를 수정하고 싶거나 타입 검증과 변환을 생략하고 싶을 때 유용합니다. JavaScript 전용 타입의 사용은 JavaScript 런타임에 대한 모든 읽기/쓰기가 JavaScript 스레드에서 이뤄져야 하므로 동기 함수로 제한됩니다. 다른 스레드에서 이 값에 접근하면 크래시가 발생합니다.

raw 값 외에도 객체 타입만 허용하는 `JavaScriptObject` 타입과, callback을 위한 `JavaScriptFunction<ReturnType>`도 사용할 수 있습니다.

```swift
Function("mutateMe") { (value: JavaScriptValue) in
  if value.isObject() {
    let jsObject = value.getObject()
    jsObject.setProperty("expo", value: "modules")
  }
}

// or

Function("mutateMe") { (jsObject: JavaScriptObject) in
  jsObject.setProperty("expo", value: "modules")
}
```

```kotlin
Function("mutateMe") { value: JavaScriptValue ->
  if (value.isObject()) {
    val jsObject = value.getObject()
    jsObject.setProperty("expo", "modules")
  }
}

// or

Function("mutateMe") { jsObject: JavaScriptObject ->
  jsObject.setProperty("expo", "modules")
}
```

## 네이티브 클래스

### `Module`

네이티브 모듈의 base class입니다.

#### 속성

### `appContext`

[`AppContext`](#appcontext)에 접근할 수 있게 합니다.

Returns: `AppContext`

#### 메서드

### `sendEvent(eventName, payload)`

| Parameter | Type | Description |
| --- | --- | --- |
| `eventName` | `string` | JavaScript 이벤트 이름 |
| `payload` | `Android: Map<String, Any?> | Bundle iOS: [String: Any?]` | 이벤트 payload |

  

주어진 이름과 payload를 가진 이벤트를 JavaScript로 보냅니다. [`Sending events`](#sending-events)를 참고하세요.

Returns: `void`

### `AppContext`

app context는 하나의 Expo 앱에 대한 인터페이스입니다.

#### 속성

### `constants`

legacy module registry의 app 상수에 접근할 수 있게 합니다.

Returns: `Android: ConstantsInterface? iOS: EXConstantsInterface?`

### `permissions`

legacy module registry의 permissions manager에 접근할 수 있게 합니다.

Returns: `Android: Permissions? iOS: EXPermissionsInterface?`

### `activityProvider`

legacy module registry의 activity provider에 접근할 수 있게 합니다.

Returns: `ActivityProvider?`

### `reactContext`

react application context에 접근할 수 있게 합니다.

Returns: `Context?`

### `hasActiveReactInstance`

null이 아니고 살아 있는 react native 인스턴스가 있는지 확인합니다.

Returns: `Boolean`

### `utilities`

legacy module registry의 utilities에 접근할 수 있게 합니다.

Returns: `EXUtilitiesInterface?`

### `ExpoView`

모든 export된 view가 사용해야 하는 base class입니다.

iOS에서 `ExpoView`는 일부 스타일(예: border)과 accessibility를 처리하는 `RCTView`를 상속합니다.

#### 속성

### `appContext`

[`AppContext`](#appcontext)에 접근할 수 있게 합니다.

Returns: `AppContext`

#### `ExpoView` 확장하기

[`View`](/modules/module-api#view) 컴포넌트를 사용해 view를 export하려면, 커스텀 클래스가 반드시 `ExpoView`를 상속해야 합니다. 이렇게 하면 [`AppContext`](/modules/module-api#appcontext) 객체에 접근할 수 있습니다. 이는 다른 모듈 및 JavaScript 런타임과 통신하는 유일한 방법입니다. 또한 제공되는 view는 `expo-modules-core`가 초기화하므로 constructor parameter를 바꿀 수 없습니다.

```swift
class LinearGradientView: ExpoView {}

public class LinearGradientModule: Module {
  public func definition() -> ModuleDefinition {
    View(LinearGradientView.self) {
      ... 
    }
  }
}
```

```kotlin
class LinearGradientView(
  context: Context,
  appContext: AppContext,
) : ExpoView(context, appContext)

class LinearGradientModule : Module() {
  override fun definition() = ModuleDefinition {
    View(LinearGradientView::class) {
      ... 
    }
  }
}
```

## 가이드

### 이벤트 보내기

JavaScript/TypeScript에서 네이티브로의 통신은 대부분 네이티브 함수로 해결되지만, clipboard 내용이 바뀌었을 때처럼 JavaScript/TypeScript 코드에 특정 시스템 이벤트를 알려주고 싶은 경우도 있을 수 있습니다.

이를 위해 모듈 정의에서, 모듈이 보낼 수 있는 이벤트 이름을 [Events](/modules/module-api#events) 정의 컴포넌트로 제공해야 합니다. 그 후 모듈 인스턴스에서 `sendEvent(eventName, payload)` 함수를 사용해 실제 이벤트와 payload를 보낼 수 있습니다. 예를 들어 네이티브 이벤트를 보내는 최소한의 clipboard 구현은 다음과 같을 수 있습니다:

```swift
let CLIPBOARD_CHANGED_EVENT_NAME = "onClipboardChanged"

public class ClipboardModule: Module {
  public func definition() -> ModuleDefinition {
    Events(CLIPBOARD_CHANGED_EVENT_NAME)

    OnStartObserving {
      NotificationCenter.default.addObserver(
        self,
        selector: #selector(self.clipboardChangedListener),
        name: UIPasteboard.changedNotification,
        object: nil
      )
    }

    OnStopObserving {
      NotificationCenter.default.removeObserver(
        self,
        name: UIPasteboard.changedNotification,
        object: nil
      )
    }
  }

  @objc
  private func clipboardChangedListener() {
    sendEvent(CLIPBOARD_CHANGED_EVENT_NAME, [
      "contentTypes": availableContentTypes()
    ])
  }
}
```

```kotlin
const val CLIPBOARD_CHANGED_EVENT_NAME = "onClipboardChanged"

class ClipboardModule : Module() {
  override fun definition() = ModuleDefinition {
    Events(CLIPBOARD_CHANGED_EVENT_NAME)

    OnStartObserving {
      clipboardManager?.addPrimaryClipChangedListener(listener)
    }

    OnStopObserving {
      clipboardManager?.removePrimaryClipChangedListener(listener)
    }
  }

  private val clipboardManager: ClipboardManager?
    get() = appContext.reactContext?.getSystemService(Context.CLIPBOARD_SERVICE) as? ClipboardManager

  private val listener = ClipboardManager.OnPrimaryClipChangedListener {
    clipboardManager?.primaryClipDescription?.let { clip ->
      this@ClipboardModule.sendEvent(
        CLIPBOARD_CHANGED_EVENT_NAME,
        bundleOf(
          "contentTypes" to availableContentTypes(clip)
        )
      )
    }
  }
}
```

JavaScript/TypeScript에서 이 이벤트를 구독하려면, `requireNativeModule`이 반환한 모듈 객체에서 [`addListener`](/versions/latest/sdk/expo#addlistenereventname-listener)를 사용하세요. 모듈은 내장 [`EventEmitter`](/versions/latest/sdk/expo#eventemitter) 클래스를 확장합니다. 또는 [`useEvent`](/versions/latest/sdk/expo#useeventeventemitter-eventname-initialvalue)나 [`useEventListener`](/versions/latest/sdk/expo#useeventlistenereventemitter-eventname-listener) hook을 사용할 수도 있습니다.

```ts
import { requireNativeModule, NativeModule } from 'expo';

type ClipboardChangeEvent = {
  contentTypes: string[];
};

type ClipboardModuleEvents = {
  onClipboardChanged(event: ClipboardChangeEvent): void;
};

declare class ClipboardModule extends NativeModule<ClipboardModuleEvents> {}

const Clipboard = requireNativeModule<ClipboardModule>('Clipboard');

Clipboard.addListener('onClipboardChanged', (event: ClipboardChangeEvent) => {
  alert('Clipboard has changed');
});
```

### View callbacks

일부 이벤트는 특정 view에 연결됩니다. 예를 들어 touch event는 눌린 실제 JavaScript view에만 보내져야 합니다. 이런 경우 [`Sending events`](/modules/module-api#sending-events)에서 설명한 `sendEvent`는 사용할 수 없습니다. `expo-modules-core`는 view에 바인딩된 이벤트를 처리하기 위한 view callback 메커니즘을 도입합니다.

이를 사용하려면, view 정의 안에서 view가 보낼 수 있는 이벤트 이름을 [Events](/modules/module-api#events) 정의 컴포넌트로 제공해야 합니다. 그다음 view 클래스에 `EventDispatcher` 타입의 속성을 선언해야 합니다. 선언한 속성 이름은 `Events` 컴포넌트에서 export한 이름과 같아야 합니다. 이후 이 속성을 함수처럼 호출하고, iOS에서는 `[String: Any?]`, Android에서는 `Map<String, Any?>` 타입의 payload를 전달할 수 있습니다.

> **Note:**: Android에서는 payload 타입을 지정할 수 있습니다. 객체로 변환되지 않는 타입의 경우 payload는 `{payload: <provided value>}` 형태로 `payload` 키 아래에 래핑되어 저장됩니다.

```swift
class CameraViewModule: Module {
  public func definition() -> ModuleDefinition {
    View(CameraView.self) {
      Events(
        "onCameraReady"
      )
      ... 
    }
  }
}

class CameraView: ExpoView {
  let onCameraReady = EventDispatcher()

  func callOnCameraReady() {
    onCameraReady([
      "message": "Camera was mounted"
    ]);
  }
}
```

```kotlin
class CameraViewModule : Module() {
  override fun definition() = ModuleDefinition {
    View(ExpoCameraView::class) {
      Events(
        "onCameraReady"
      )
      ... 
    }
  }
}

class CameraView(
  context: Context,
  appContext: AppContext
) : ExpoView(context, appContext) {
  val onCameraReady by EventDispatcher()

  fun callOnCameraReady() {
    onCameraReady(mapOf(
      "message" to "Camera was mounted"
    ));
  }
}
```

JavaScript/TypeScript에서 이 이벤트를 구독하려면 아래와 같이 네이티브 view에 함수를 전달해야 합니다:

```tsx
import { requireNativeViewManager } from 'expo-modules-core';

const CameraView = requireNativeViewManager('CameraView');

export default function MainView() {
  const onCameraReady = event => {
    console.log(event.nativeEvent);
  };

  return <CameraView onCameraReady={onCameraReady} />;
}
```

제공된 payload는 `nativeEvent` 키 아래에서 사용할 수 있습니다.

## 예시

```swift
public class MyModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MyFirstExpoModule")

    Function("hello") { (name: String) in
      return "Hello \(name)!"
    }
  }
}
```

```kotlin
class MyModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("MyFirstExpoModule")

    Function("hello") { name: String ->
      return "Hello $name!"
    }
  }
}
```

실제 모듈의 더 많은 예시는 이미 이 API를 사용 중인 Expo 모듈을 GitHub에서 참고할 수 있습니다:

`expo-battery`[Swift](https://github.com/expo/expo/tree/main/packages/expo-battery/ios)

`expo-cellular`

[Kotlin](https://github.com/expo/expo/tree/main/packages/expo-cellular/android/src/main/java/expo/modules/cellular), [Swift](https://github.com/expo/expo/tree/main/packages/expo-cellular/ios)

`expo-clipboard`

[Kotlin](https://github.com/expo/expo/tree/main/packages/expo-clipboard/android/src/main/java/expo/modules/clipboard), [Swift](https://github.com/expo/expo/tree/main/packages/expo-clipboard/ios)

`expo-crypto`

[Kotlin](https://github.com/expo/expo/tree/main/packages/expo-crypto/android/src/main/java/expo/modules/crypto), [Swift](https://github.com/expo/expo/tree/main/packages/expo-crypto/ios)

`expo-device`[Swift](https://github.com/expo/expo/tree/main/packages/expo-device/ios)

`expo-haptics`[Swift](https://github.com/expo/expo/tree/main/packages/expo-haptics/ios)

`expo-image-manipulator`[Swift](https://github.com/expo/expo/tree/main/packages/expo-image-manipulator/ios)

`expo-image-picker`

[Kotlin](https://github.com/expo/expo/tree/main/packages/expo-image-picker/android/src/main/java/expo/modules/imagepicker), [Swift](https://github.com/expo/expo/tree/main/packages/expo-image-picker/ios)

`expo-linear-gradient`

[Kotlin](https://github.com/expo/expo/tree/main/packages/expo-linear-gradient/android/src/main/java/expo/modules/lineargradient), [Swift](https://github.com/expo/expo/tree/main/packages/expo-linear-gradient/ios)

`expo-localization`

[Kotlin](https://github.com/expo/expo/tree/main/packages/expo-localization/android/src/main/java/expo/modules/localization), [Swift](https://github.com/expo/expo/tree/main/packages/expo-localization/ios)

`expo-store-review`[Swift](https://github.com/expo/expo/tree/main/packages/expo-store-review/ios)

`expo-system-ui`[Swift](https://github.com/expo/expo/tree/main/packages/expo-system-ui/ios/ExpoSystemUI)

`expo-video-thumbnails`[Swift](https://github.com/expo/expo/tree/main/packages/expo-video-thumbnails/ios)

`expo-web-browser`

[Kotlin](https://github.com/expo/expo/tree/main/packages/expo-web-browser/android/src/main/java/expo/modules/webbrowser), [Swift](https://github.com/expo/expo/tree/main/packages/expo-web-browser/ios)
