---
modificationDate: February 26, 2026
title: Web modals
description: Expo Router를 사용해 웹 앱에서 modal의 동작을 구현하고 커스터마이징하는 방법을 알아보세요.
---

# Web modals

Expo Router를 사용해 웹 앱에서 modal의 동작을 구현하고 커스터마이징하는 방법을 알아보세요.

> Web modals는 alpha 상태이며 SDK 54 이상에서 사용할 수 있습니다. 이 기능을 사용하려면 프로젝트에서 `EXPO_UNSTABLE_WEB_MODAL=1` 환경 변수를 설정해야 합니다.

현대적인 웹 앱은 서로 다른 콘텐츠 크기와 사용자 상호작용에 맞게 적응하는 유연한 modal 경험을 필요로 합니다. Expo Router는 현대적인 웹 경험을 위한 다양한 modal presentation 패턴을 제공합니다. 이 패턴들은 `modal`, `formSheet`, `transparentModal`, `containedTransparentModal`과 함께 `presentation`을 활용해 screen 너비에 따라 다른 방식의 modal을 표시하고, `webModalStyle`을 통해 커스터마이징 가능한 스타일 prop도 제공합니다.

## Get started

> 새로운 web modal 기능을 사용하려면 개발 빌드와 [export](/deploy/web#export-your-web-project) 빌드 둘 다에서 `EXPO_UNSTABLE_WEB_MODAL=1` 환경 변수를 설정해야 합니다. 프로젝트 루트의 **.env** 파일에 추가하거나, 예를 들어 `EXPO_UNSTABLE_WEB_MODAL=1 npx expo start`처럼 명령 앞에 붙여 설정할 수 있습니다.

Expo Router에서 modal은 특정 option이 들어간 `Stack.Screen` component로 구성합니다. 이를 위해 modal screen을 앱의 `Stack` layout 파일에 추가해야 합니다.

다음 navigation tree를 생각해봅시다. 여기에는 layout 파일에 정의된 stack navigator, modal에 접근하는 home screen, 그리고 modal screen component가 포함됩니다:

`src`

 `app`

  `_layout.tsx`

  `index.tsx`

  `modal.tsx`

layout 파일(**src/app/_layout.tsx**)에서는 modal screen component를 Stack navigator에 추가합니다:

```tsx
import { Stack } from 'expo-router';

export const unstable_settings = {
  anchor: 'index',
};

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'modal', // Enables modal behavior
          sheetAllowedDetents: [0.5, 1], // Array of snap positions for screens that have a width less than 768px.
        }}
      />
    </Stack>
  );
}
```

**modal.tsx**는 modal의 콘텐츠를 표시하는 데 사용됩니다:

```tsx
import { Text, View } from 'react-native';

export default function Modal() {
  return <View style={{ flex: 1, padding: 16 }}>{/* Modal content goes here */}</View>;
}
```

이제 **index.tsx**에서 modal을 열려면 index route 안에서 `router.push('/modal')`를 사용할 수 있습니다:

```tsx
import { router } from 'expo-router';
import { Pressable, Text, View, StyleSheet } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Pressable onPress={() => router.push('/modal')} style={styles.button}>
        <Text style={styles.buttonText}>Open Modal</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

위 예시의 결과는 다음과 같습니다:

## Anchors and nested stacks

stack 또는 중첩 stack navigator와 함께 작업할 때 modal route로 deep-linking하는 경우를 포함해 올바른 navigation 동작을 보장하려면 modal을 적절히 anchor에 연결해야 합니다. anchor가 없으면 modal 뒤의 screen이 지워져 navigation context가 남지 않게 됩니다.

_anchor_는 modal의 기준점 역할을 합니다. 중첩 stack이 있는 복잡한 앱에서는 중첩 stack에 anchor를 정의해야 하며, 그 값은 stack의 initial route가 됩니다.

stack의 layout 파일에서 `unable_settings`를 export해 anchor를 구성할 수 있습니다:

```tsx
export const unstable_settings = {
  anchor: 'index', // Anchor to the index route
};
```

위 예시에서 `anchor: 'index'`는 modal을 표시할 때 Expo Router가 지정한 anchor route를 background에 유지해야 한다는 뜻입니다.

## Modal presentation style

웹 앱이 모바일 기기에서 실행될 때는 sheet 동작을 유지하면서, 큰 screen(예: desktop)에서는 modal이 웹 앱에 어떻게 표시되는지의 차이는 configuration option에 따라 달라집니다. 다음은 `Stack.Screen`의 `options` object에 전달해 web modal의 appearance를 구성할 수 있는 option입니다.

| Option | Type | Description |
| --- | --- | --- |
| `presentation` | `'modal'`, `'formSheet'`, `'transparentModal'`, `'containedTransparentModal'` | Modal presentation style입니다. 너비가 768px보다 큰 screen에서는 모든 스타일이 중앙 정렬된 overlay(예: lightbox)로 표시됩니다. 너비가 `768px`보다 작은 screen에서는 `formSheet`를 사용해 bottom sheet로 표시합니다. `transparentModal`로 설정하면 배경 콘텐츠를 완전히 가리지 않는 overlay로 표시됩니다. Detent와 sheet grabber 속성은 적용되지 않습니다. 이 presentation은 직접 custom modal을 만들 때 유용합니다. `transparentModal`과 비슷하게 `containedTransparentModal`로 설정하면 배경 콘텐츠를 완전히 가리지 않는 overlay로 표시됩니다. Detent와 다른 속성은 적용되지 않습니다. 이 presentation도 직접 custom modal을 만들 때 유용합니다. |
| `sheetAllowedDetents` | `number[]`, `'fitToContents'` | 백분율(0.0-1.0) 형태의 snap position 또는 자동 맞춤입니다. 너비가 `768px`보다 작은 screen에만 적용됩니다. |
| `sheetGrabberVisible` | `boolean` | **On iOS, s**heet 상단의 drag handle을 표시/숨깁니다. Android와 web에서는 지원되지 않습니다. 모든 플랫폼에서 grabber를 흉내 내려면 custom sheet header component를 사용하는 것을 권장합니다. |
| `sheetCornerRadius` | `number` | 픽셀 단위의 sheet corner radius입니다. |
| `webModalStyle` | `WebModalStyle` | modal appearance를 세밀하게 조정할 수 있는 web 전용 styling option을 허용하는 특별한 prop입니다. |

## Custom modal styling with `webModalStyle`

> **Note:** `webModalStyle` 속성은 web 플랫폼에서만 적용됩니다. 모바일에서는 modal이 터치 상호작용에 맞는 sheet 형태 동작으로 자동 적응합니다.

`webModalStyle`을 사용해 web에서 modal의 크기와 appearance를 커스터마이징할 수 있습니다. 더 세부적인 조정을 위해 다음 속성을 제공합니다:

| Property | Type | Description | Default |
| --- | --- | --- | --- |
| `width` | `number` `string` | modal의 너비를 덮어씁니다(px 또는 percentage). desktop의 web 플랫폼에서만 적용됩니다. | `83vw` |
| `height` | `number` `string` | modal의 높이를 덮어씁니다(px 또는 percentage). desktop의 web 플랫폼에서만 적용됩니다. | `79vh` |
| `minHeight` | `number` `string` | desktop modal의 최소 높이입니다(px 또는 percentage). 기본 iOS 26 sizing을 덮어씁니다. | `min(586px, 79vh)` |
| `minWidth` | `number` `string` | desktop modal의 최소 너비입니다(px 또는 percentage). 기본 iOS 26 sizing을 덮어씁니다. | `min(936px, 83vw)` |
| `border` | `string` | desktop modal의 border를 덮어씁니다(유효한 모든 CSS border 값, 예: `'1px solid #ccc'` 또는 `'none'`) | None |
| `overlayBackground` | `string` | overlay 배경색을 덮어씁니다(유효한 모든 CSS color 또는 rgba/hsla 값). | Semi-transparent black |
| `shadow` | `string` | modal shadow filter를 덮어씁니다(유효한 모든 CSS filter 값, 예: `'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'` 또는 `'none'`) | Drop-shadow filter |

### Custom CSS properties

Expo Router는 modal 스타일링에 custom CSS property를 사용하며, `webModalStyle`을 통해 전역적으로 덮어쓸 수 있습니다. 이 변수들은 modal appearance를 세밀하게 제어할 수 있게 해줍니다.

#### Width and height sizing variables

```css
/* Default modal width (83vw on desktop, following iOS 26 specifications) */
--expo-router-modal-width: 83vw;

/* Maximum modal width (936px max, 83vw by default, following iOS 26) */
--expo-router-modal-max-width: min(936px, 83vw);

/* Minimum modal width (auto by default) */
--expo-router-modal-min-width: auto;

/* Default modal height (79vh, following iOS 26 specifications) */
--expo-router-modal-height: 79vh;

/* Minimum modal height (586px max, 79vh by default, following iOS 26) */
--expo-router-modal-min-height: min(586px, 79vh);
```

#### Border and overlay styling variables

```css
/* Modal border (none by default) */
--expo-router-modal-border: none;

/* Modal corner radius (24px by default, following iOS 26) */
--expo-router-modal-border-radius: 24px;

/* Modal shadow filter (drop-shadow by default) */
--expo-router-modal-shadow: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04))
  drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));

/* Overlay background color (25% black by default) */
--expo-router-modal-overlay-background: rgba(0, 0, 0, 0.25);
```

#### How `webModalStyle` maps to CSS variables

`webModalStyle`을 사용해 sizing 변수를 덮어쓰면 Expo Router는 자동으로 이 CSS 변수들을 제공한 값으로 설정합니다:

```tsx
// This webModalStyle configuration
webModalStyle: {
  width: 800,
  height: 600,
  border: '2px solid blue',
  overlayBackground: 'rgba(0, 0, 0, 0.7)',
  shadow: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))',
}

// ...automatically sets these CSS variables:
// --expo-router-modal-width: 800px
// --expo-router-modal-height: 600px
// --expo-router-modal-border: 2px solid blue
// --expo-router-modal-overlay-background: rgba(0, 0, 0, 0.7)
// --expo-router-modal-shadow: drop-shadow(0 8px 16px rgba(0,0,0,0.2))
```

## Common examples

Full screen modal example

최대한 넓은 공간을 덮는 콘텐츠용 full screen modal을 만들려면 modal route의 `Stack.Screen` options에서 `webModalStyle` 속성을 사용할 수 있습니다:

```tsx
import { Stack } from 'expo-router';

export const unstable_settings = {
  anchor: 'index',
};

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'modal',
          webModalStyle: {
            width: '95vw',
            height: '95vh',
            border: 'none',
          },
        }}
      />
    </Stack>
  );
}
```

위 예시의 결과는 다음과 같습니다:

웹 앱을 모바일 기기에서 실행할 때 full screen modal이 뜨는 것을 피하고 싶다면 `sheetAllowedDetents`를 `fitToContents` 또는 custom 값으로 설정할 수 있습니다:

```tsx
import { Stack } from 'expo-router';

export const unstable_settings = {
  anchor: 'index',
};

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'modal',
          webModalStyle: {
            width: '95vw',
            height: '95vh',
            border: 'none',
          },
          sheetAllowedDetents: 'fitToContents',
        }}
      />
    </Stack>
  );
}
```

modal은 모바일 기기에서 sheet로 나타납니다:

Compact modal example

더 작은 상호작용을 위해 콘텐츠에 맞는 compact modal을 만들 수 있습니다:

```tsx
import { Stack } from 'expo-router';

export const unstable_settings = {
  anchor: 'index',
};

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'modal',
          webModalStyle: {
            width: 400,
            height: 'auto',
            minHeight: 200,
            border: '1px solid #e5e7eb',
            overlayBackground: 'rgba(0, 0, 0, 0.3)',
          },
          sheetCornerRadius: 12,
          sheetAllowedDetents: 'fitToContents',
        }}
      />
    </Stack>
  );
}
```

위 예시의 결과는 다음과 같습니다:

Transparent modal example

아래 screen의 시각적 맥락을 유지하는 overlay를 표시하고 싶다면 `presentation` option을 `transparentModal`로 설정할 수 있습니다:

```tsx
import { Stack } from 'expo-router';

export const unstable_settings = {
  anchor: 'index',
};

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'transparentModal',
        }}
      />
    </Stack>
  );
}
```

위 예시의 결과는 다음과 같습니다:

Corner radius example

`sheetCornerRadius`를 사용해 corner radius를 커스터마이징할 수 있습니다:

```tsx
import { Stack } from 'expo-router';

export const unstable_settings = {
  anchor: 'index',
};

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.4],
          sheetCornerRadius: 32,
        }}
      />
    </Stack>
  );
}
```

위 예시의 결과는 다음과 같습니다:

Custom detents example

`sheetAllowedDetents`를 사용해 modal이 멈출 수 있는 높이를 정의할 수 있습니다:

```tsx
import { Stack } from 'expo-router';

export const unstable_settings = {
  anchor: 'index',
};

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.2, 0.5, 0.8, 0.98],
        }}
      />
    </Stack>
  );
}
```

위 예시의 결과는 다음과 같습니다:

## Global CSS customization

웹 앱에서 프로젝트 안의 [global CSS](https://docs.expo.dev/versions/latest/config/metro/#global-css) 파일을 사용 중이라면, width, height, border, overlay 변수도 덮어쓸 수 있습니다.

전역 CSS 파일에서 `--expo-router-*` 변수를 사용해 custom 값을 추가할 수 있습니다:

```css
/* Override default modal styling globally */
:root {
  --expo-router-modal-width: 700px;
  --expo-router-modal-min-width: auto;
  --expo-router-modal-max-width: 95vw;
  --expo-router-modal-height: 640px;
  --expo-router-modal-min-height: 640px;
  --expo-router-modal-border: none;
  --expo-router-modal-border-radius: 16px;
  --expo-router-modal-shadow: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2));
  --expo-router-modal-overlay-background: rgba(0, 0, 0, 0.5);
}
```

## Custom modal route implementation

위 영상은 웹 페이지의 main content 위에 나타나는 modal window를 보여줍니다. 사용자의 시선을 모으기 위해 배경이 어두워지고, modal 안에는 사용자를 위한 정보가 들어 있습니다. 이는 웹 modal의 전형적인 동작으로, 사용자는 modal과 상호작용하거나 modal을 닫고 메인 페이지로 돌아갈 수 있습니다.

이와 같은 웹 modal 동작은 [`transparentModal`](https://reactnavigation.org/docs/stack-navigator/#transparent-modals) presentation mode를 사용하고, overlay와 modal content를 스타일링하며, [`react-native-reanimated`](/versions/latest/sdk/reanimated#installation)를 사용해 modal 표시 애니메이션을 넣어 구현할 수 있습니다.

프로젝트의 루트 layout(**src/app/_layout.tsx**)을 수정해 modal route에 `options` object를 추가하세요:

```tsx
import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
```

> **Note:** `unstable_settings`는 현재 `Stack` navigator에서만 동작합니다.

위 예시는 `index` screen을 [`initialRouteName`](/router/advanced/router-settings#initialroutename)으로 설정할 때 [`unstable_settings`](/router/advanced/router-settings)를 사용합니다. 이렇게 하면 사용자가 direct link로 modal screen에 들어오더라도 transparent modal이 항상 현재 screen 위에 렌더링됩니다.

아래 예시처럼 **modal.tsx**에서 overlay와 modal content를 스타일링하세요:

```tsx
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

export default function Modal() {
  return (
    <Animated.View
      entering={FadeIn}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000040',
      }}
    >
      {/* Dismiss modal when pressing outside */}
      <Link href={'/'} asChild>
        <Pressable style={StyleSheet.absoluteFill} />
      </Link>
      <Animated.View
        entering={SlideInDown}
        style={{
          width: '90%',
          height: '80%',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
        }}
      >
        <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Modal Screen</Text>
        <Link href="/">
          <Text>← Go back</Text>
        </Link>
      </Animated.View>
    </Animated.View>
  );
}
```

필요에 맞게 modal appearance를 원하는 대로 커스터마이징할 수 있습니다.
