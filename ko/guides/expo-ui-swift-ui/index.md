---
modificationDate: March 01, 2026
title: Expo UI로 SwiftUI 앱 빌드하기
description: Expo UI를 사용해 Expo 앱에 SwiftUI를 통합하는 방법을 알아보세요.
platforms: ['ios', 'macos', 'tvos']
---

# Expo UI로 SwiftUI 앱 빌드하기

Expo UI를 사용해 Expo 앱에 SwiftUI를 통합하는 방법을 알아보세요.
iOS, macOS, tvOS

> **SDK 54 이상**에서 사용할 수 있습니다.

Expo UI는 SwiftUI를 React Native로 가져옵니다. 최신 SwiftUI primitive를 사용해 앱을 빌드할 수 있습니다.

이 가이드는 Expo 앱에 SwiftUI를 통합하기 위해 Expo UI를 사용하는 기본 사항을 다룹니다.

[Expo UI iOS Liquid Glass 튜토리얼](https://www.youtube.com/watch?v=2wXYLWz3YEQ) — 새로운 Expo UI를 사용해 React Native 앱 안에서 실제 SwiftUI view를 빌드하는 방법을 알아보세요.

## 기능

-   **SwiftUI primitive**: Expo UI는 또 다른 UI 라이브러리가 아닙니다. Expo에 SwiftUI primitive를 가져옵니다.
-   **1:1 매핑**: Expo UI의 컴포넌트는 SwiftUI view와 1:1로 매핑됩니다. [Explore SwiftUI](https://exploreswiftui.com/)나 [Libraried app](https://apps.apple.com/us/app/libraried-ui-components/id1642862540) 같은 SwiftUI ecosystem의 사용 가능한 view를 쉽게 살펴보고, 대응하는 Expo UI 컴포넌트를 찾을 수 있습니다.
-   **전체 앱 지원**: Expo UI는 앱 전체에서 사용할 수 있도록 설계되었습니다. 유연성을 유지하면서도 앱 전체를 Expo UI로 작성할 수 있습니다. 통합은 컴포넌트 수준에서 동작합니다. [React Native 컴포넌트](https://reactnative.dev/docs/components-and-apis), [Expo UI 컴포넌트](/versions/latest/sdk/ui), [DOM 컴포넌트](/guides/dom-components), 또는 [`react-native-skia`](https://shopify.github.io/react-native-skia/)를 사용한 custom 2D 컴포넌트를 섞어 사용할 수도 있습니다.

## 설치

Expo 프로젝트에 `@expo/ui` package를 설치해야 합니다. 다음 명령으로 설치하세요:

```sh
npx expo install @expo/ui
```

## 사용 방법

Expo UI에는 여러 SwiftUI 컴포넌트가 준비되어 있습니다. `@expo/ui/swift-ui`에서 import해서 앱에서 사용할 수 있습니다. 하지만 React Native(UIKit)에서 SwiftUI로 경계를 넘으려면 [`Host`](/versions/latest/sdk/ui#host) 컴포넌트를 사용해야 합니다. [`Host`](/versions/latest/sdk/ui#host)는 SwiftUI view를 위한 컨테이너입니다. DOM의 [`<svg>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/svg)나 [`<Canvas>`](https://shopify.github.io/react-native-skia/docs/canvas/overview/) ([`react-native-skia`](https://shopify.github.io/react-native-skia/)에서 제공)처럼 생각할 수 있습니다. 내부적으로는 [`UIHostingController`](https://developer.apple.com/documentation/swiftui/uihostingcontroller)를 사용해 UIKit 안에서 SwiftUI view를 렌더링합니다.

### `Host`를 사용한 기본 사용법

```tsx
import { CircularProgress, Host } from '@expo/ui/swift-ui';
import { View, Text } from 'react-native';

export default function LoadingView() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Host matchContents>
        <CircularProgress />
      </Host>
      <Text>Loading...</Text>
    </View>
  );
}
```

### `HStack`와 `VStack` 사용하기

`HStack`와 `VStack` 컴포넌트를 사용해 전체 layout을 SwiftUI로 빌드할 수도 있습니다.

```tsx
import { CircularProgress, Host, HStack, LinearProgress, VStack } from '@expo/ui/swift-ui';

export default function LoadingView() {
  return (
    <Host style={{ flex: 1, margin: 32 }}>
      <VStack spacing={32}>
        <HStack spacing={32}>
          <CircularProgress />
          <CircularProgress color="orange" />
        </HStack>
        <LinearProgress progress={0.5} />
        <LinearProgress color="orange" progress={0.7} />
      </VStack>
    </Host>
  );
}
```

### Modifier

[SwiftUI modifier](https://developer.apple.com/documentation/swiftui/view/modifier\(_:\))는 SwiftUI 컴포넌트의 모양과 동작을 커스터마이즈하는 강력한 방법입니다. Expo UI도 SwiftUI 컴포넌트를 위한 modifier를 제공합니다. `@expo/ui/swift-ui/modifiers`에서 modifier를 import해서 `modifiers` prop에 배열로 전달할 수 있습니다. 아래 예시에서는 [`expo-mesh-gradient`](/versions/latest/sdk/mesh-gradient)와 `glassEffect` modifier를 조합해 Liquid Glass 텍스트를 만듭니다.

> **참고**: `glassEffect` modifier는 Xcode 26+와 iOS 26+가 필요합니다.

```tsx
import { Host, Text } from '@expo/ui/swift-ui';
import { glassEffect, padding } from '@expo/ui/swift-ui/modifiers';
import { MeshGradientView } from 'expo-mesh-gradient';
import { View } from 'react-native';

export default function Page() {
  return (
    <View style={{ flex: 1 }}>
      <MeshGradientView
        style={{ flex: 1 }}
        columns={3}
        rows={3}
        colors={['red', 'purple', 'indigo', 'orange', 'white', 'blue', 'yellow', 'green', 'cyan']}
        points={[
          [0.0, 0.0],
          [0.5, 0.0],
          [1.0, 0.0],
          [0.0, 0.5],
          [0.5, 0.5],
          [1.0, 0.5],
          [0.0, 1.0],
          [0.5, 1.0],
          [1.0, 1.0],
        ]}
      />
      <Host style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0 }}>
        <Text
          size={32}
          modifiers={[
            padding({
              all: 16,
            }),
            glassEffect({
              glass: {
                variant: 'clear',
              },
            }),
          ]}>
          Glass effect text
        </Text>
      </Host>
    </View>
  );
}
```

### iOS 설정 앱 예시

Expo UI 컴포넌트와 modifier를 조합하면 iOS Settings 앱 같은 UI를 빌드할 수 있습니다.

```tsx
import {
  Button,
  Form,
  Host,
  HStack,
  Image,
  Section,
  Spacer,
  Toggle,
  Text,
} from '@expo/ui/swift-ui';
import { background, buttonStyle, foregroundStyle, clipShape, frame } from '@expo/ui/swift-ui/modifiers';
import { Link } from 'expo-router';
import { useState } from 'react';

export default function SettingsView() {
  const [isAirplaneMode, setIsAirplaneMode] = useState(true);

  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <Section>
          <HStack spacing={8}>
            <Image
              systemName="airplane"
              color="white"
              size={18}
              modifiers={[
                frame({ width: 28, height: 28 }),
                background('#ffa500'),
                clipShape('roundedRectangle'),
              ]}
            />
            <Text>Airplane Mode</Text>
            <Spacer />
            <Toggle isOn={isAirplaneMode} onIsOnChange={setIsAirplaneMode} />
          </HStack>

          <Link href="/wifi" asChild>
            {/* Use buttonStyle('plain') to prevent default blue button styling */}
            <Button modifiers={[buttonStyle('plain')]}>
              <HStack spacing={8}>
                <Image
                  systemName="wifi"
                  color="white"
                  size={18}
                  modifiers={[
                    frame({ width: 28, height: 28 }),
                    background('#007aff'),
                    clipShape('roundedRectangle'),
                  ]}
                />
                {/* When Text is wrapped in a Link, the color needs to be specified explicitly */}
                <Text modifiers={[foregroundStyle({type: 'color', color: 'black'})]}>Wi-Fi</Text>
                <Spacer />
                <Image systemName="chevron.right" size={14} color="secondary" />
              </HStack>
            </Button>
          </Link>
        </Section>
      </Form>
    </Host>
  );
}
```

### 보조 텍스트 스타일링

`foregroundStyle`을 사용해 [계층형 스타일](/versions/v55.0.0/sdk/ui/swift-ui/modifiers#foregroundstylestyle)을 적용하면, 텍스트가 더 옅고 미묘하게 보이도록 만들 수 있습니다.

```tsx
import { Button, Form, Host, HStack, Image, List, Section, Spacer, Text } from '@expo/ui/swift-ui';
import { buttonStyle, font, foregroundStyle, padding } from '@expo/ui/swift-ui/modifiers';

export default function SecondaryTextExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <Section>
          <List>
            <Button onPress={() => console.log('Navigate')} modifiers={[buttonStyle('plain')]}>
              <HStack>
                <Text>Night Shift</Text>
                <Spacer />
                <Text
                  modifiers={[
                    foregroundStyle({type: 'hierarchical', style: 'secondary'}),
                    padding({ trailing: 8 }),
                  ]}>
                  22:00 to 07:00
                </Text>
                <Image systemName="chevron.right" size={14} color="#C7C7CC" />
              </HStack>
            </Button>
          </List>
          <List>
            <Text modifiers={[foregroundStyle({type: 'hierarchical', style: 'secondary'}), font({ size: 14 })]}>
              Save up to 280.7 MB. This will permanently delete all photos and videos kept in the
              "Recently Deleted" album.
            </Text>
          </List>
        </Section>
      </Form>
    </Host>
  );
}
```

### 아이콘이 있는 Slider

밝기나 볼륨 조절에서 흔히 쓰이는 패턴은 `Slider` 양옆에 아이콘을 두는 것입니다.

```tsx
import { useState } from 'react';
import {
  Form,
  Host,
  HStack,
  Image,
  List,
  Section,
  Slider,
  Spacer,
  Text,
  Toggle,
} from '@expo/ui/swift-ui';
import { padding } from '@expo/ui/swift-ui/modifiers';

export default function SliderWithIconsExample() {
  const [brightness, setBrightness] = useState(0.5);
  const [trueToneEnabled, setTrueToneEnabled] = useState(true);

  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <Section
          header={<Text>Brightness</Text>}
          footer={
            <Text>
              Automatically adapt iPhone display based on ambient lighting
              conditions to make colors appear consistent in different
              environments.
            </Text>
          }
        >
          <List>
            <HStack modifiers={[padding({ vertical: 6 })]}>
              <Image systemName="sun.min.fill" size={22} color="#8E8E93" />
              <Spacer />
              <Slider value={brightness} onValueChange={setBrightness} />
              <Spacer />
              <Image systemName="sun.max.fill" size={22} color="#8E8E93" />
            </HStack>
            <Toggle
              label="True Tone"
              isOn={trueToneEnabled}
              onIsOnChange={setTrueToneEnabled}
            />
          </List>
        </Section>
      </Form>
    </Host>
  );
}
```

### 여러 줄 list item

제목과 부제목이 있는 list item에는 `alignment="leading"`과 함께 `VStack`을 사용하세요.

```tsx
import {
  Button,
  Form,
  Host,
  HStack,
  Image,
  List,
  Section,
  Spacer,
  Text,
  VStack,
} from '@expo/ui/swift-ui';
import { buttonStyle, font, foregroundStyle, padding } from '@expo/ui/swift-ui/modifiers';

export default function MultiLineListItemExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <Section>
          <List>
            <HStack>
              <Image
                systemName="safari"
                size={22}
                modifiers={[padding({ trailing: 6 })]}
              />
              <Spacer />
              <Button
                onPress={() => console.log('Navigate')}
                modifiers={[buttonStyle('plain'), padding({ vertical: 6 })]}
              >
                <VStack spacing={4} alignment="leading">
                  <Text>Chrome</Text>
                  <Text modifiers={[foregroundStyle({type: 'hierarchical', style: 'secondary'}), font({ size: 14 })]}>
                    Last used: Today
                  </Text>
                </VStack>
                <Spacer />
                <Text
                  modifiers={[
                    foregroundStyle({type: 'hierarchical', style: 'secondary'}),
                    font({ size: 16 }),
                  ]}
                >
                  1.57 GB
                </Text>
                <Image systemName="chevron.right" size={14} color="#C7C7CC" />
              </Button>
            </HStack>
          </List>
        </Section>
      </Form>
    </Host>
  );
}
```

## 자주 묻는 질문

SwiftUI 컴포넌트에서 flexbox나 다른 스타일을 사용할 수 있나요?

flexbox 스타일은 `Host` 컴포넌트 자체에 적용할 수 있습니다. 하지만 SwiftUI context 안으로 들어간 뒤에는 [`Yoga`](https://www.yogalayout.dev/)를 사용할 수 없으므로, layout은 대신 `<HStack>`과 `<VStack>`으로 정의해야 합니다.

`Host` 컴포넌트가 무엇인가요?

`Host`는 SwiftUI view를 위한 컨테이너입니다. DOM의 [`<svg>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/svg)나 [`<Canvas>`](https://shopify.github.io/react-native-skia/docs/canvas/overview/) ([`react-native-skia`](https://shopify.github.io/react-native-skia/)에서 제공)처럼 생각할 수 있습니다. 내부적으로는 [`UIHostingController`](https://developer.apple.com/documentation/swiftui/uihostingcontroller)를 사용해 UIKit 안에서 SwiftUI view를 렌더링합니다.

Expo UI는 `react-native-paper`나 `react-native-elements` 같은 라이브러리와 어떻게 다른가요?

Expo UI는 "또 하나의" UI 라이브러리도 아니고, 특정한 디자인 kit를 강요하는 도구도 아닙니다. 대신 primitive 라이브러리입니다. JavaScript에서 UI를 다시 구현하거나 흉내 내는 대신, 네이티브 SwiftUI와 Jetpack Compose 컴포넌트를 JavaScript에 직접 노출합니다.

Android나 web에서도 `@expo/ui/swift-ui`를 사용할 수 있나요?

Expo UI의 첫 번째 milestone은 SwiftUI에서 Expo UI로의 1:1 매핑을 달성하는 것입니다. 범용 지원은 roadmap의 다음 단계에서 제공될 예정입니다. 우리의 우선순위는 먼저 강력한 SwiftUI 지원을 확립하고, 그다음 Android의 Jetpack Compose와 Web의 DOM 지원으로 확장하는 것입니다.

SwiftUI 컴포넌트 안에서 React Native 컴포넌트를 사용할 수 있나요?

네, Expo UI 컴포넌트의 JSX child로 React Native 컴포넌트를 둘 수 있습니다. Expo UI는 이를 위해 자동으로 [`UIViewRepresentable`](https://developer.apple.com/documentation/swiftui/uiviewrepresentable) wrapper를 생성합니다. 다만 SwiftUI layout system은 UIKit과 다르게 동작하며 몇 가지 제한이 있다는 점을 염두에 두어야 합니다. Apple 문서에 따르면:

> SwiftUI는 UIKit view의 [`center`](https://developer.apple.com/documentation/UIKit/UIView/center), [`bounds`](https://developer.apple.com/documentation/UIKit/UIView/bounds), [`frame`](https://developer.apple.com/documentation/UIKit/UIView/frame), 그리고 [`transform`](https://developer.apple.com/documentation/UIKit/UIView/transform) property의 layout을 완전히 제어합니다. [`UIViewRepresentable`](https://developer.apple.com/documentation/swiftui/uiviewrepresentable) instance가 관리하는 view에 대해 코드에서 이러한 layout 관련 property를 직접 설정하지 마세요. SwiftUI와 충돌해 정의되지 않은 동작이 발생합니다.

또한 React Native 컴포넌트를 렌더링하는 순간 SwiftUI context를 벗어나게 된다는 점도 기억하세요. 다시 Expo UI 컴포넌트를 추가하고 싶다면 `Host` wrapper를 다시 도입해야 합니다.

SwiftUI layout은 자체적으로 완결되게 유지하는 것을 권장합니다. 상호 운용은 가능하지만, 경계가 명확히 정의되어 있을 때 가장 잘 동작합니다.

저는 SwiftUI 개발자입니다. 왜 Expo UI를 배워야 하나요?

React의 _"한 번 배우면 어디서나 쓸 수 있다"_는 약속이 이제 SwiftUI와 Jetpack Compose까지 확장되기 때문입니다. Expo UI를 사용하면 SwiftUI 지식을 React Native ecosystem에서 실행되는 앱 빌드에 적용할 수 있고, [DOM 컴포넌트](/guides/dom-components)를 통해 Web으로 확장할 수 있으며, [2D](https://shopify.github.io/react-native-skia/)와 [3D](https://github.com/wcandillon/react-native-webgpu) 렌더링까지 통합할 수 있습니다. 이 시스템은 앱의 서로 다른 부분이 서로 다른 접근 방식을 쓸 수 있을 만큼 유연하며, 컴포넌트 수준에서 매끄러운 통합을 제공합니다.

## 추가 자료

[Expo UI reference](/versions/latest/sdk/ui) — API 컴포넌트, method 등에 대한 정보는 Expo UI reference를 참고하세요.

[Expo UI example](https://github.com/expo/expo/tree/main/apps/native-component-list/src/screens/UI) — 최신 Expo UI 예시

[Hot Chocolate app example](https://github.com/expo/hot-chocolate) — Expo UI로 YVR Hot Chocolate Fest 앱을 재현한 예시 앱

[Expo UI example replicate to TV](https://github.com/douglowder/ExpoUITV) — Expo UI에 대한 tvOS 지원
