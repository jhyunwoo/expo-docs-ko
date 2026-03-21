---
modificationDate: March 02, 2026
title: SwiftUI로 확장하기
description: Expo UI와 통합되는 custom SwiftUI 컴포넌트와 modifier를 만드는 방법을 알아보세요.
platforms: ['ios', 'tvos']
---

# SwiftUI로 확장하기

Expo UI와 통합되는 custom SwiftUI 컴포넌트와 modifier를 만드는 방법을 알아보세요.
iOS, tvOS

이 가이드는 Expo UI와 자연스럽게 통합되는 custom SwiftUI 컴포넌트와 modifier를 만드는 방법을 설명합니다.

## 사전 요구 사항

시작하기 전에 다음을 준비했는지 확인하세요:

-   프로젝트에 `@expo/ui`가 설치되어 있어야 합니다. 자세한 내용은 [Expo UI로 SwiftUI 앱 빌드하기](/guides/expo-ui-swift-ui)를 참고하세요.
-   앱의 [development build](/develop/development-builds/introduction)가 있어야 합니다(Expo UI는 Expo Go에서 사용할 수 없음).
-   [Expo Modules API](/modules/overview)와 [SwiftUI](https://developer.apple.com/swiftui/)에 대한 기본적인 이해가 있어야 합니다.

```sh
npx expo install @expo/ui
```

## custom 컴포넌트 만들기

### 프로젝트 설정

프로젝트에 로컬 Expo module을 만드세요:

```sh
npx create-expo-module@latest --local my-ui
```

module의 podspec 파일에 `ExpoUI`를 dependency로 추가하세요:

```ruby
Pod::Spec.new do |s|
  s.name           = 'MyUi'
  s.version        = '1.0.0'
  s.summary        = 'Custom UI components extending Expo UI'
  # ... other config
  # Add ExpoUI dependency
  s.dependency 'ExpoUI'
  # ... other config
end
```

### SwiftUI view 만들기

SwiftUI view는 두 부분으로 만듭니다:

1.  **Props class**: `ExpoUI`의 `UIBaseViewProps`를 확장하여 [`modifiers`](/versions/latest/sdk/ui/swift-ui/modifiers) prop에 대한 자동 지원을 얻습니다.
2.  **View struct**: `ExpoSwiftUI.View` protocol을 따르며, `@ObservedObject` props property와 `body`를 요구합니다.

```swift
import SwiftUI
import ExpoModulesCore
import ExpoUI

final class MyCustomViewProps: UIBaseViewProps {
  @Field var title: String = ""
}

struct MyCustomView: ExpoSwiftUI.View {
  @ObservedObject public var props: MyCustomViewProps

  var body: some View {
    VStack {
      Text(props.title)
        .font(.headline)
      Children() // Renders React children
    }
  }
}
```

module 안에서 `ExpoUIView`를 사용해 view를 등록하세요. 이렇게 하면 SwiftUI view가 modifier 지원과 함께 감싸지고 JavaScript에서 사용할 수 있게 됩니다:

```swift
import ExpoModulesCore
import ExpoUI

public class MyUiModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MyUi")

    ExpoUIView(MyCustomView.self)
  }
}
```

modifier와 event handling을 연결하는 wrapper 컴포넌트를 만드세요. `createViewModifierEventListener` 유틸리티는 `onTapGesture`와 `onAppear` 같은 event 기반 modifier가 custom view에서 동작하도록 해줍니다:

```tsx
import { requireNativeView } from 'expo';
import { type CommonViewModifierProps } from '@expo/ui/swift-ui';
import { createViewModifierEventListener } from '@expo/ui/swift-ui/modifiers';

export interface MyCustomViewProps extends CommonViewModifierProps {
  title: string;
  children?: React.ReactNode;
}

const NativeMyCustomView = requireNativeView<MyCustomViewProps>('MyUi', 'MyCustomView');

export function MyCustomView({ modifiers, ...restProps }: MyCustomViewProps) {
  return (
    <NativeMyCustomView
      modifiers={modifiers}
      {...(modifiers ? createViewModifierEventListener(modifiers) : undefined)}
      {...restProps}
    />
  );
}
```

### custom 컴포넌트 사용하기

이제 custom 컴포넌트는 모든 `ExpoUI` 내장 modifier와 함께 동작합니다:

```tsx
import { Host, Text } from '@expo/ui/swift-ui';
import { padding, cornerRadius, background } from '@expo/ui/swift-ui/modifiers';
import { MyCustomView } from './modules/my-ui';

export default function App() {
  return (
    <Host style={{ flex: 1 }}>
      <MyCustomView
        title="Hello World"
        modifiers={[padding({ all: 16 }), cornerRadius(12), background('#f0f0f0')]}>
        <Text>Child content</Text>
      </MyCustomView>
    </Host>
  );
}
```

## custom modifier 만들기

어떤 Expo UI 컴포넌트와도 함께 동작하는 custom modifier도 만들 수 있습니다.

> Modifier는 스타일, layout, 동작 등을 위해 view를 구성하는 SwiftUI 방식입니다. 자세한 내용은 Apple의 [ViewModifier documentation](https://developer.apple.com/documentation/swiftui/viewmodifier)를 참고하세요.

### 네이티브 modifier 구현

`ViewModifier`와 `Record`를 따르는 modifier struct를 만드세요:

```swift
import SwiftUI
import ExpoModulesCore
import ExpoUI

struct CustomBorderModifier: ViewModifier, Record {
  @Field var color: Color = .red
  @Field var width: CGFloat = 2
  @Field var cornerRadius: CGFloat = 0

  func body(content: Content) -> some View {
    content
      .overlay(
        RoundedRectangle(cornerRadius: cornerRadius)
          .stroke(color, lineWidth: width)
      )
  }
}
```

module definition 안에서 `ViewModifierRegistry`로 modifier를 등록하세요. SwiftUI render thread와의 race condition을 피하려면 `OnCreate`에서 등록하고 `OnDestroy`에서 등록 해제하세요:

```swift
import ExpoModulesCore
import ExpoUI

public class MyUiModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MyUi")

    OnCreate {
      ViewModifierRegistry.register("customBorder") { params, appContext, _ in
        return try CustomBorderModifier(from: params, appContext: appContext)
      }
    }

    OnDestroy {
      ViewModifierRegistry.unregister("customBorder")
    }

    ExpoUIView(MyCustomView.self)
  }
}
```

### JavaScript modifier 함수

modifier config를 생성하는 TypeScript 함수를 만드세요:

```ts
import { createModifier } from '@expo/ui/swift-ui/modifiers';

export const customBorder = (params: { color?: string; width?: number; cornerRadius?: number }) =>
  createModifier('customBorder', params);
```

module에서 modifier를 export하세요:

```ts
export { MyCustomView, type MyCustomViewProps } from './src/MyCustomView';
export { customBorder } from './src/modifiers';
```

### custom modifier 사용하기

이제 custom modifier는 어떤 `ExpoUI` 컴포넌트와도 함께 동작합니다:

```tsx
import { Host, Text, VStack } from '@expo/ui/swift-ui';
import { padding } from '@expo/ui/swift-ui/modifiers';
import { customBorder } from './modules/my-ui';

export default function App() {
  return (
    <Host style={{ flex: 1 }}>
      <VStack
        modifiers={[
          padding({ all: 20 }),
          customBorder({ color: '#FF6B35', width: 3, cornerRadius: 8 }),
        ]}>
        <Text>This has a custom border!</Text>
      </VStack>
    </Host>
  );
}
```

## 다음 단계

축하합니다! Expo UI를 custom SwiftUI 컴포넌트와 modifier로 확장하는 방법을 배웠습니다. 이제 custom 컴포넌트는 내장 modifier 시스템과 자연스럽게 통합됩니다.

다음에 만들어 볼 만한 아이디어는 다음과 같습니다:

-   Expo UI와 함께 제공되는 [내장 SwiftUI 컴포넌트](/versions/latest/sdk/ui/swift-ui)를 사용해 보기
-   앱 전용 styling 패턴을 위한 custom modifier 만들기
-   React Native에서 사용할 third-party SwiftUI 라이브러리 감싸기
-   다른 사람도 사용할 수 있도록 컴포넌트를 npm package로 공유하기
