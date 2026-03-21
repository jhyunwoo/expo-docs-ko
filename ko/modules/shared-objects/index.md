---
modificationDate: March 03, 2026
title: shared object 사용하기
description: Expo Modules API의 shared object를 사용하는 방법을 알아보세요.
---

# shared object 사용하기

Expo Modules API의 shared object를 사용하는 방법을 알아보세요.

shared object를 사용하면 수명을 오래 유지하는 네이티브 인스턴스를 Android와 iOS에서 앱의 JavaScript/TypeScript로 노출하면서도, 그 생명주기 제어권은 넘기지 않을 수 있습니다. 이를 사용하면 디코딩된 비트맵처럼 무거운 상태 객체를 React 컴포넌트 간에 계속 살려둘 수 있으며, 컴포넌트가 마운트될 때마다 매번 새로운 네이티브 인스턴스를 만들지 않아도 됩니다.

이 가이드에서는 shared object가 무엇인지, 그리고 네이티브 플랫폼에서 어떻게 구현되는지 이해해 보겠습니다.

## shared object란 무엇인가요?

shared object는 Expo 모듈을 통해 Android 및/또는 iOS의 네이티브 인스턴스를 앱의 JavaScript/TypeScript 코드와 연결하는 사용자 정의 클래스입니다. Kotlin과 Swift의 네이티브 측에서는 `SharedObject`를 상속해 클래스를 선언하고, 모듈 정의에서 `Class()`를 사용해 이를 노출합니다. shared object는 JavaScript와 네이티브 어느 쪽에서도 참조하지 않게 되면 자동으로 해제됩니다.

## 왜 shared object를 사용하나요?

이미지 같은 큰 미디어 에셋은 메모리에 디코딩되면 수 메가바이트를 넘길 수 있습니다. shared object가 없으면 이런 에셋을 앱의 여러 부분 사이에서 전달할 때, 각 부분이 매번 디스크에서 다시 불러오고 같은 파일을 여러 번 디코딩해야 합니다. 그러면 메모리 압박이 커지고, I/O 병목이 생기며, 프레임 드롭이나 배터리 소모가 발생할 수 있습니다.

shared object는 여러 JavaScript 참조가 하나의 네이티브 인스턴스를 가리키도록 하여, 메모리 안에서 그 인스턴스를 하나만 유지함으로써 이 문제를 해결합니다.

## 예시: 디스크 I/O 없는 이미지 조작

shared object를 이해하기 위해, 앱 사용자가 고른 이미지를 회전하고 뒤집은 뒤 조작된 이미지를 앱에 표시해야 하는 예시를 생각해 보겠습니다.

### shared object가 없는 경우

과거에는 네이티브 모듈이 종종 _stateless_ 방식으로 작성되었고, 각 함수는 호출 사이에 상태를 유지하지 않은 채 독립적으로 동작했습니다. 같은 객체(예: 이미지 파일)에 대해 두 개의 별도 작업을 수행하고 싶다면, 두 위치 모두에서 디스크에서 로드하고 매번 I/O 작업을 반복해야 했습니다.

shared object가 없으면 `ImagePicker`는 `"file:///path/to/image.jpg"` 같은 파일 URI를 읽고 이미지를 메모리에 디코딩합니다. 그런 다음 이미지 조작 모듈은 같은 URI를 다시 읽고 이미지를 다시 메모리에 디코딩합니다. 앱 사용자가 이미지를 회전하기 위해 `rotate()` 같은 transform 메서드를 호출하면, 모듈은 회전된 이미지를 새 파일로 저장합니다. 마지막으로 새 URI가 `Image` 컴포넌트에 전달되면, 컴포넌트는 이미지를 렌더링하기 위해 다시 디스크에서 이미지를 디코딩합니다. 이 워크플로는 두 번 이상의 디코딩과 디스크 읽기 작업을 발생시킵니다.

### shared object가 있는 경우

같은 시나리오도 shared object를 사용하면 훨씬 효율적입니다. `ImagePicker`는 URI를 읽고 이미지를 한 번만 디코딩해 shared object로 만듭니다. 앱 사용자가 이미지를 회전하기 위해 `rotate()` 같은 transform 메서드를 호출하면, 모듈은 디스크에 쓰지 않고 메모리 안의 비트맵을 조작합니다. 파일 출력이 필요하다면 이미지 조작기에서 `saveAsync` 같은 명시적인 저장 함수를 호출하면 되고, 그렇지 않으면 변환은 메모리 안에서만 유지됩니다.

마지막으로 shared object가 `Image` 컴포넌트로 전달되면, 이번에는 이미지가 메모리에서 바로 렌더링됩니다. 전체 워크플로는 디스크 읽기 한 번과 디코딩 한 번만 필요하며, 모든 변환은 메모리 안에서 일어납니다.

성능 향상은 매우 큽니다. 중복되는 디스크 I/O와 디코딩 작업을 제거함으로써 여러 복사본 대신 메모리에 하나의 비트맵만 유지하게 됩니다. 이는 CPU 사용량을 줄여 배터리 수명 유지에 도움을 주고, 메모리 압박으로 인한 크래시 위험도 낮춥니다.

shared object는 더 편리한 객체 지향 API 형태도 가능하게 합니다. 상태가 있는 객체에서 `rotate()`, `flipX()`, `renderAsync()` 같은 메서드를 노출해 호출자가 체이닝으로 작업하도록 만들 수 있으며, stateless 함수 집합을 평평하게 노출할 필요가 없습니다.

### shared object를 사용한 구현

이제 shared object가 왜 유용한지 이해했으니, 앞선 예시의 핵심 개념을 보여 주는 최소 구현을 살펴보겠습니다.

이 예시는 파일 경로에서 이미지를 로드하고, transform을 메모리 안에서 적용하고(rotate와 flip), 다른 모듈이 소비할 수 있는 shared reference를 노출하는 간단한 이미지 조작 모듈을 만듭니다.

### Android 구현

Android에서는 `expo.modules.kotlin.sharedobjects.SharedObject`가 제공하는 `SharedObject` 클래스에서 shared object를 만듭니다. 이 클래스는 디코딩된 비트맵을 관리하고 조작 메서드를 노출합니다. 이 구현은 현재 이미지 하나만 메모리에 유지하고 transform을 제자리에서 적용하므로, 회전이나 뒤집기처럼 실제로 새 비트맵이 필요한 경우에만 새 비트맵을 할당합니다.

```kotlin
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Matrix
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.sharedobjects.SharedObject

class ImageRef : SharedRef<Bitmap>()

class SimpleImageContext(
  runtimeContext: RuntimeContext,
  bitmap: Bitmap
) : SharedObject(runtimeContext) {
  private var current: Bitmap = bitmap

  fun rotate(degrees: Float) = apply {
    val matrix = Matrix().apply { postRotate(degrees) }
    current = Bitmap.createBitmap(current, 0, 0, current.width, current.height, matrix, true)
  }

  fun flipX() = apply {
    val matrix = Matrix().apply { preScale(-1f, 1f) }
    current = Bitmap.createBitmap(current, 0, 0, current.width, current.height, matrix, true)
  }

  fun render(): ImageRef = ImageRef(current, runtimeContext)

  override fun sharedObjectDidRelease() {
    if (!current.isRecycled) current.recycle()
  }
}
```

위 예시는 iOS 구현과 매우 비슷합니다. 하지만 Android에는 한 가지 차이가 있습니다. 바로 `sharedObjectDidRelease()` 메서드입니다. 이 생명주기 콜백은 JavaScript가 shared object에 대한 모든 참조를 해제했을 때 호출되며, 네이티브 리소스를 정리할 기회를 제공합니다.

이 클래스의 결과가 다른 모듈로 전달되면, `render` 메서드는 `ImageRef`를 반환합니다. 이는 `expo-image`와 다른 이미지 인식 모듈이 이미 이해할 수 있는 특수한 `SharedRef<Bitmap>` 타입입니다.

모듈 정의는 context를 생성하는 async 함수와 메서드를 바인딩하는 class definition을 노출합니다. Expo Modules API는 모듈 이름, 인스턴스를 생성하는 함수, 그리고 메서드를 shared object에 매핑하는 class definition을 선언적으로 지정하는 문법을 사용합니다.

```kotlin
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class SimpleImageModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("SimpleImageModule")

    AsyncFunction("createContextAsync") { path: String ->
      val bitmap = BitmapFactory.decodeFile(path)
        ?: throw Exceptions.IllegalArgument("Unable to decode image at $path")
      SimpleImageContext(runtimeContext, bitmap)
    }

    Class<SimpleImageContext>("Context") {
      Function("rotate") { ctx: SimpleImageContext, degrees: Float -> ctx.rotate(degrees) }
      Function("flipX") { ctx: SimpleImageContext -> ctx.flipX() }
      AsyncFunction("renderAsync") Coroutine { ctx: SimpleImageContext -> ctx.render() }
    }
  }
}
```

위 예시에서 `createContextAsync` 함수는 파일 경로에서 비트맵을 디코딩하고 새 `SimpleImageContext` 인스턴스를 반환합니다. context가 만들어진 뒤에는 `rotate`와 `flipX` 함수가 메모리 안에서만 조작하므로 동기적으로 실행됩니다. `renderAsync` 함수는 비트맵을 다른 모듈이 소비할 수 있도록 복사하거나 준비하는 과정이 포함될 수 있음을 나타내기 위해 async로 표시됩니다.

### iOS 구현

iOS에서는 `ExpoModulesCore`가 제공하는 `SharedObject` 클래스에서 상속받아 shared object를 만듭니다. 이 클래스는 디코딩된 비트맵을 관리하고 조작 메서드를 노출합니다. 이 구현은 현재 이미지 하나만 메모리에 유지하고 transform을 제자리에서 적용합니다.

```swift
import ExpoModulesCore
import UIKit

final class ImageRef: SharedRef<UIImage> {}

final class SimpleImageContext: SharedObject {
  private var current: UIImage

  init(path: String) throws {
    guard let data = try? Data(contentsOf: URL(fileURLWithPath: path)),
          let image = UIImage(data: data) else {
      throw Exceptions.InvalidArgument()
    }
    self.current = image
    super.init()
  }

  func rotate(by degrees: Double) {
    current = current.rotated(degrees: degrees)
  }

  func flipX() {
    current = current.withHorizontallyFlippedOrientation()
  }

  func render() -> ImageRef {
    return ImageRef(current)
  }
}
```

위 예시에서 `SimpleImageContext`는 이미지 파일을 읽고 단일 `UIImage`를 메모리에 유지합니다. `rotate`와 `flipX` 메서드는 디스크를 건드리지 않고 메모리 안의 현재 이미지를 변경합니다.

이 클래스의 결과가 다른 모듈로 전달되면, `render` 메서드는 `ImageRef`를 반환합니다. 이는 `expo-image`와 다른 이미지 인식 모듈이 이미 이해할 수 있는 특수한 `SharedRef<UIImage>` 타입입니다.

이제 shared object class definition이 준비되었으니, 모듈 정의를 통해 이를 노출할 수 있습니다. Expo Modules API는 모듈 이름, 인스턴스를 생성하는 함수, 그리고 메서드를 shared object에 매핑하는 class definition을 선언적으로 지정하는 문법을 사용합니다.

```swift
public final class SimpleImageModule: Module {
  public func definition() -> ModuleDefinition {
    Name("SimpleImageModule")

    AsyncFunction("createContextAsync") { (path: String) -> SimpleImageContext in
      return try SimpleImageContext(path: path)
    }

    Class("Context", SimpleImageContext.self) {
      Function("rotate") { (ctx, degrees: Double) -> SimpleImageContext in
        ctx.rotate(by: degrees)
        return ctx
      }

      Function("flipX") { (ctx: SimpleImageContext) -> SimpleImageContext in
        ctx.flipX()
        return ctx
      }

      AsyncFunction("renderAsync") { (ctx: SimpleImageContext) -> ImageRef in
        return ctx.render()
      }
    }
  }
}
```

위 예시에서 `createContextAsync`는 디스크에서 이미지를 로드하고 디코딩하는 작업이 I/O이기 때문에 비동기 함수입니다. context가 만들어진 뒤에는 `rotate`와 `flipX` 함수가 메모리 안에서만 조작하므로 동기적으로 실행됩니다. `renderAsync` 함수는 비트맵을 다른 모듈이 소비할 수 있도록 복사하거나 준비하는 과정이 포함될 수 있음을 나타내기 위해 async로 표시되며, 이 간단한 예제에서는 즉시 반환됩니다.

### 앱에서 shared object 사용하기

이제 앱의 JavaScript/TypeScript 코드에서 shared object를 사용해 경로에서 이미지를 로드하고, 로드된 이미지의 context를 만들고, 메모리 안에서 transform을 체이닝하고, shared reference를 얻기 위해 render한 뒤, 그 reference를 `Image` 컴포넌트에 전달할 수 있습니다.

```tsx
import { useState } from 'react';
import { Button } from 'react-native';
import { Image } from 'expo-image';
import type { SharedRef } from 'expo';
import SimpleImageModule from 'simple-image-module'; // The native custom module

import { pickImageAsync } from './pickImage'; // The custom TypeScript function

export function SharedImageExample() {
  const [context, setContext] = useState(null);
  const [result, setResult] = useState<SharedRef<'image'> | null>(null);

  const load = async () => {
    const uri = await pickImageAsync();
    if (!uri) {
      return;
    }

    const ctx = await SimpleImageModule.createContextAsync(uri);

    setContext(ctx);
    setResult(await ctx.renderAsync());
  };

  const rotateAndFlip = async () => {
    if (!context) {
      return;
    }

    setResult(await context.rotate(90).flipX().renderAsync());
  };

  return (
    <>
      <Button title="Pick image" onPress={load} />
      <Button title="Rotate 90° + flip X" onPress={rotateAndFlip} disabled={!context} />
      {result && <Image source={result} style={{ width: 200, height: 200 }} />}
    </>
  );
}
```

위 예시에서 React 컴포넌트는 이미지 조작기 context가 변환한 네이티브 이미지만 소비하며, 이 이미지는 이미 메모리에 있고 shared object(`ImageRef`)가 참조하고 있습니다. 그 결과 이미지 뷰는 다음 프레임에서 즉시 이미지를 표시할 수 있고, 체이닝된 transform도 파일 시스템을 전혀 건드리지 않습니다.

JavaScript API는 `ImagePicker`를 사용해 이미지를 고르며, 이는 일반적인 파일 URI를 반환합니다. 이 URI는 `SharedImageExample()` 안에서 shared object를 만들기 위해 사용자 정의 네이티브 모듈로 전달됩니다.

```tsx
import * as ImagePicker from 'expo-image-picker';

export async function pickImageAsync() {
  const result = await ImagePicker.launchImageLibraryAsync({
    quality: 1,
    allowsMultipleSelection: false,
  });

  if (result.canceled || !result.assets?.length) {
    return null;
  }

  // At this point we still have a disk URI.
  // The native module will lift it into a shared object.
  return result.assets[0].uri;
}
```

위 예시에서 `ImagePicker`는 shared object를 알 필요가 없습니다. 자신이 반환해야 하는 값인 파일 경로만 반환하면 됩니다. 그 경로를 `expo-image`의 `Image` 같은 다른 Expo 모듈이 사용할 수 있는 shared object로 변환하는 책임은 네이티브 모듈에 있습니다.

## shared object를 사용하는 Expo 라이브러리

shared object를 사용하는 [Expo SDK 라이브러리](/versions/latest)의 몇 가지 예와 그 목적은 다음과 같습니다.

-   `expo-image` 라이브러리는 `SharedObject`를 사용해 디코딩된 작업 결과를 계속 유지하며, 뷰 컴포넌트는 Android에서 `SharedRef<Bitmap>`, iOS에서 `SharedRef<UIImage>`를 받습니다. 이 설계 덕분에 이미지를 다시 디코딩하지 않고도 모듈 간에 전달할 수 있습니다. 더 자세히 살펴보려면 `expo-image` 라이브러리의 [Android](https://github.com/expo/expo/tree/main/packages/expo-image/android/src/main/java/expo/modules/image) 및 [iOS](https://github.com/expo/expo/tree/main/packages/expo-image/ios) 소스 코드를 참고하세요.
-   `expo-image-manipulator` 라이브러리는 비동기 작업 처리, 여러 작업의 큐잉, 그리고 깔끔한 JavaScript API 노출을 보여 줍니다. 더 자세히 살펴보려면 `expo-image-manipulator` 라이브러리의 [Android](https://github.com/expo/expo/tree/main/packages/expo-image-manipulator/android/src/main/java/expo/modules/imagemanipulator) 및 [iOS](https://github.com/expo/expo/tree/main/packages/expo-image-manipulator/ios) 소스 코드를 참고하세요.
-   `expo-sqlite` 라이브러리는 데이터베이스, 세션, statement 핸들을 호출 사이에 유지하면서 기저 데이터베이스 접근을 조정하기 위해 shared object를 사용합니다. 더 자세히 살펴보려면 `expo-sqlite` 라이브러리의 [Android](https://github.com/expo/expo/tree/main/packages/expo-sqlite/android/src/main/java/expo/modules/sqlite) 및 [iOS](https://github.com/expo/expo/tree/main/packages/expo-sqlite/ios) 소스 코드를 참고하세요.
-   `expo/fetch` 라이브러리는 스트리밍, 취소, 리디렉션 처리를 위해 request와 response 생명주기를 유지하면서도 JavaScript의 fetch와 호환되는 API를 제공하기 위해 shared object를 사용합니다. 더 자세히 살펴보려면 `expo/fetch` 라이브러리의 [Android](https://github.com/expo/expo/tree/main/packages/expo/android/src/main/java/expo/modules/fetch) 및 [iOS](https://github.com/expo/expo/tree/main/packages/expo/ios/Fetch) 소스 코드를 참고하세요.

## shared object의 성능 이점

shared object를 사용하면 다음과 같은 여러 성능 개선 효과를 얻을 수 있습니다.

-   **디스크 I/O 감소:** 서로 다른 모듈이나 함수 호출에서 여러 번 읽는 대신 한 번만 읽습니다.
-   **디코딩 작업 감소:** JPEG/PNG를 비트맵으로 바꾸는 것처럼 비용이 큰 디코딩이 한 번만 일어나고 반복되지 않습니다.
-   **메모리 압박 감소:** 메모리에 여러 복사본 대신 디코딩된 인스턴스 하나만 유지합니다.
-   **더 빠른 작업:** 메모리 안에서 수행하는 transform은 디스크 기반 작업보다 훨씬 빠릅니다.
-   **프레임 드롭 방지:** I/O 블로킹이 줄어들어 UI 상호작용이 더 부드러워집니다.

## Class definition DSL

`Class()`를 사용해 shared object를 노출할 때, class definition 블록은 `Function`과 `AsyncFunction` 외에도 여러 DSL 컴포넌트를 받을 수 있습니다. 이 컴포넌트들을 사용하면 생성자, static 메서드, 프로퍼티를 클래스에 직접 정의할 수 있습니다.

### `Constructor`

JavaScript 코드가 `new ClassName(args)`로 shared object의 새 인스턴스를 만들 수 있는 생성자를 정의합니다. `Constructor`가 없으면, shared object를 반환하는 네이티브 함수로만 인스턴스를 만들 수 있습니다.

생성자는 JavaScript에서 전달된 인수를 받고 shared object 클래스의 인스턴스를 반환해야 합니다.

```swift
Class(MySharedObject.self) {
  Constructor { (date: Date) in
    ... 
  }
}
```

```kotlin
Class(MySharedObject::class) {
  Constructor { date: Date ->
    ... 
  }
}
```

### `StaticFunction`

JavaScript에서 `ClassName.functionName()`으로 호출할 수 있는 클래스 프로토타입의 동기 함수를 정의합니다. `Function`과 달리 `StaticFunction`은 인스턴스를 인수로 받지 않습니다.

```swift
StaticFunction("myStaticFunction") { in
  ... 
}
```

```kotlin
StaticFunction("myStaticFunction") { ->
  ... 
}
```

### `StaticAsyncFunction`

JavaScript에서 `await ClassName.functionName()`으로 호출할 수 있는 클래스 자체의 비동기 함수를 정의합니다. `Promise`를 반환합니다. Kotlin에서는 suspend 가능한 본문에 `Coroutine` modifier를 사용할 수 있습니다.

```swift
StaticAsyncFunction("myStaticAsyncFunction") { in
  ... 
}
```

```kotlin
StaticAsyncFunction("myStaticAsyncFunction") { ->
  ... 
}
```

### `Property`

`Class()` 블록 안에서 `Property`는 `Function`과 비슷하게 클래스 인스턴스를 파라미터로 받습니다. 이를 통해 shared object 인스턴스에 계산된 프로퍼티를 노출할 수 있습니다.

```swift
Class(VideoPlayer.self) {
  Property("isPlaying") { (player: VideoPlayer) -> Bool in
    return player.isPlaying
  }

  Property("volume")
    .get { (player: VideoPlayer) -> Float in
      return player.volume
    }
    .set { (player: VideoPlayer, volume: Float) in
      player.volume = volume
    }
}
```

```kotlin
Class(VideoPlayer::class) {
  Property("isPlaying") { player: VideoPlayer ->
    return@Property player.isPlaying
  }

  Property("volume")
    .get { player: VideoPlayer ->
      return@get player.volume
    }
    .set { player: VideoPlayer, volume: Float ->
      player.volume = volume
    }
}
```

```js
const player = new VideoPlayer(source);

// Read-only property
console.log(player.isPlaying); // false

// Read-write property
player.volume = 0.5;
console.log(player.volume); // 0.5
```

## 추가 자료

[The real-world impact of Shared Objects in Expo Modules](https://expo.dev/blog/the-real-world-impact-of-shared-objects) — Shared Objects는 Expo API의 많은 근본적인 문제를 해결하며, 동시에 객체 지향 API를 설계하는 완전히 새로운 방식을 열어 줍니다.
