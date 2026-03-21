---
modificationDate: March 05, 2026
title: Modals
description: Expo Router에서 modals를 사용하는 방법을 알아보세요.
---

# Modals

Expo Router에서 modals를 사용하는 방법을 알아보세요.

[Using Modals with Expo Router](https://www.youtube.com/watch?v=gNzuJVRmyDk) — 앱의 나머지 부분 위에 콘텐츠를 표시하는 여러 방법을 알아보세요.

Modals는 모바일 앱에서 흔히 쓰이는 사용자 인터페이스 패턴입니다. 기존 화면 위에 콘텐츠를 표시하는 데 사용되며, 확인 알림을 보여주거나 독립적인 form을 표시하는 등 다양한 목적에 쓰입니다. 앱에서 다음과 같은 방법으로 modals를 만들 수 있습니다:

-   React Native의 [`Modal`](https://reactnative.dev/docs/modal) 컴포넌트를 사용합니다.
-   Expo Router의 특수한 파일 기반 문법을 사용해 앱의 내비게이션 시스템 안에서 modal screen을 만듭니다.

각 접근 방식은 각자에 맞는 사용 사례가 있습니다. 긍정적인 사용자 경험을 만들기 위해 언제 어떤 방법을 써야 하는지 이해하는 것이 중요합니다.

## React Native의 Modal 컴포넌트

`Modal` 컴포넌트는 React Native의 core API 일부입니다. 대표적인 사용 사례는 다음과 같습니다:

-   내비게이션 시스템의 일부일 필요가 없는 독립적인 작업 같은 standalone 상호작용
-   빠른 상호작용에 적합한 임시 alert 또는 confirmation dialog

아래는 서로 다른 플랫폼에서 현재 화면 위에 오버레이되는 커스텀 `Modal` 컴포넌트 예시입니다:

대부분의 사용 사례에서는 `Modal` 컴포넌트를 사용하고 앱의 사용자 인터페이스 요구 사항에 맞게 커스터마이즈하면 됩니다. `Modal` 컴포넌트와 그 props 사용법에 대한 자세한 내용은 [React Native documentation](https://reactnative.dev/docs/modal)을 참고하세요.

## Expo Router를 사용한 modal screen

modal screen은 **src/app** 디렉터리 안에 만드는 파일이며 기존 stack 안의 route로 사용됩니다. 완료 후 특정 화면으로 링크할 수 있는 multi-step form처럼, 내비게이션 시스템의 일부여야 하는 복잡한 상호작용에 사용됩니다.

아래는 modal screen이 서로 다른 플랫폼에서 동작하는 방식의 예시입니다:

### Usage

modal route를 구현하려면 **src/app** 디렉터리 안에 **modal.tsx**라는 화면을 만드세요. 예시 파일 구조는 다음과 같습니다:

`src`

 `app`

  `_layout.tsx`

  `index.tsx`

  `modal.tsx`

위 파일 구조는 `index`가 stack의 첫 route가 되는 layout을 만듭니다. 루트 layout 파일(**src/app/_layout.tsx**) 안에서 stack에 `modal` route를 추가할 수 있습니다. 이를 modal로 표시하려면 route에 `presentation` 옵션을 `modal`로 설정하세요.

```tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
```

**index.tsx** 파일에서 `Link` 컴포넌트를 사용해 modal screen으로 이동할 수 있습니다.

```tsx
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text>Home screen</Text>
      <Link href="/modal" style={styles.link}>
        Open modal
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    paddingTop: 20,
    fontSize: 20,
  },
});
```

**modal.tsx**는 modal의 내용을 표시합니다.

```tsx
import { StyleSheet, Text, View } from 'react-native';

export default function Modal() {
  return (
    <View style={styles.container}>
      <Text>Modal screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

### Modal 표시와 닫기 동작

modal은 navigator에서 현재 screen일 때 이전 context를 잃고 독립적인 screen으로 표시됩니다. 표시 방식과 닫기 동작은 플랫폼마다 다릅니다:

-   Android에서는 modal이 현재 screen 위로 슬라이드됩니다. 닫으려면 back button을 사용해 이전 screen으로 돌아가세요.
-   iOS에서는 modal이 현재 screen의 아래쪽에서 위로 슬라이드됩니다. 닫으려면 위쪽에서 아래로 스와이프하세요.
-   web에서는 modal이 별도의 route로 표시되며, 닫기 동작은 [`router.canGoBack()`](/router/basics/navigation)을 사용해 수동으로 제공해야 합니다. modal을 닫는 예시는 다음과 같습니다:

```tsx
import { Link, router} from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function Modal() {
  const isPresented = router.canGoBack();

  return (
    <View style={styles.container}>
      <Text>Modal screen</Text>
      {isPresented && <Link href="../">Dismiss modal</Link>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

### iOS에서 status bar 모양 바꾸기

기본적으로 iOS에서 modal은 status bar를 가리는 어두운 배경을 가집니다. status bar 모양을 바꾸려면 `Platform` API로 현재 플랫폼이 iOS인지 확인한 뒤, **modal.tsx** 파일 안에서 [`StatusBar`](/versions/latest/sdk/status-bar) 컴포넌트를 사용해 모양을 바꿀 수 있습니다.

```tsx
import { StyleSheet, Text, View, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function Modal() {
  return (
    <View style={styles.container}>
      <Text>Modal screen</Text>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

### deep-linked modals 처리하기

stack 또는 nested stack navigators와 함께 작업할 때, 올바른 내비게이션 동작을 보장하려면 modals에 anchor를 지정해야 합니다. 이는 modal routes로 deep-linking할 때 특히 중요합니다. anchor가 없으면 modal 뒤의 screen이 지워져 내비게이션 context가 남지 않게 됩니다.

_anchor_는 modal의 기준점 역할을 합니다. 복잡한 앱에서 nested stack이 있을 경우, anchor는 nested stack에 정의되어야 하며 그 값은 해당 stack의 initial route가 됩니다.

stack의 layout 파일에서 `unstable_settings`를 export하여 anchor를 구성할 수 있습니다:

```tsx
export const unstable_settings = {
  anchor: 'index', // Anchor to the index route
};
```

위 예시의 `anchor: 'index'`는 Expo Router가 modal을 표시할 때 지정된 anchor route를 background에 유지해야 함을 의미합니다.

## Form sheet presentation

Form sheet는 modal을 bottom sheet로 표시하며, 사용자는 이를 여러 높이(detents라고 부름) 사이에서 드래그할 수 있습니다. 이는 부분 화면만 덮고 상호작용 가능한 크기 조절이 필요한 콘텐츠에 유용합니다.

### Basic usage

form sheet를 사용하려면 modal screen에 `presentation` 옵션을 `formSheet`로 설정하세요:

```tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'formSheet',
        }}
      />
    </Stack>
  );
}
```

### sheet detents 구성하기

Detents는 sheet가 멈출 수 있는 높이를 정의합니다. `sheetAllowedDetents`를 사용해 이를 설정하세요:

-   **숫자 배열**(`number[]`): 0과 1 사이의 screen height 비율로 snap 위치를 지정합니다. 예를 들어 `[0.25, 0.5, 1]`은 25%, 50%, 전체 화면 높이의 세 snap point를 만듭니다. 값은 오름차순으로 정렬되어야 합니다.
    
-   **콘텐츠에 맞춤**(`'fitToContents'`): sheet가 콘텐츠에 맞춰 자동으로 크기를 조정합니다. 이 옵션을 사용할 때는 콘텐츠의 실제 크기를 기준으로 높이를 계산해야 하므로 `flex: 1`이 지원되지 않으며, 명시적인 콘텐츠 크기 지정이 필요합니다.
    

> Android는 최대 3개의 detents를 지원합니다. iOS는 개수 제한 없이 detents를 받을 수 있습니다.

```tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.25, 0.5, 1],
          sheetInitialDetentIndex: 1,
        }}
      />
    </Stack>
  );
}
```

### Additional sheet options

| Option | Type | Description |
| --- | --- | --- |
| `sheetInitialDetentIndex` | `number | 'last'` | 시트가 열릴 때의 detent index입니다(기본값: `0`). |
| `sheetGrabberVisible` | `boolean` | 시트 상단에 grabber handle을 표시합니다(iOS only). |
| `sheetCornerRadius` | `number` | 시트 모서리 반지름(픽셀 단위)입니다. |
| `sheetLargestUndimmedDetentIndex` | `number | 'none' | 'last'` | background가 어두워지지 않은 상태를 유지하는 가장 큰 detent index입니다. |

```tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.25, 0.5, 1],
          sheetInitialDetentIndex: 0,
          sheetGrabberVisible: true,
          sheetCornerRadius: 24,
          sheetLargestUndimmedDetentIndex: 1,
        }}
      />
    </Stack>
  );
}
```

### Sheet footer (Android)

> `unstable_sheetFooter`는 향후 릴리스에서 변경될 수 있는 Android 전용 실험적 기능입니다.

React 컴포넌트를 사용해 모든 detent 위치에서 계속 표시되는 footer를 sheet에 추가할 수 있습니다:

```tsx
import { Stack } from 'expo-router';
import { View, Button } from 'react-native';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.5, 1],
          unstable_sheetFooter: () => (
            <View style={{ padding: 16, backgroundColor: 'white' }}>
              <Button title="Confirm" onPress={() => {}} />
            </View>
          ),
        }}
      />
    </Stack>
  );
}
```

### 커스텀 detents와 함께 `flex: 1` 사용하기

> SDK 55 이상에서는 커스텀 숫자 detents를 사용할 때 iOS에서 `flex: 1`이 올바르게 동작합니다. 콘텐츠의 명시적 크기 지정을 요구하는 `fitToContents`에서는 동작하지 않습니다.

숫자 detents를 사용할 때 modal 콘텐츠는 `flex: 1`을 사용해 sheet 안에서 사용 가능한 공간을 채울 수 있습니다:

```tsx
import { StyleSheet, Text, View } from 'react-native';

export default function Modal() {
  return (
    <View style={styles.container}>
      <Text>Modal content</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
```

## Additional information

### Presentation options

Android와 iOS에서 `presentation` 옵션을 사용해 modal screen을 표시하는 다양한 방법이 있습니다.

| Option | Description |
| --- | --- |
| `card` | 새 screen이 stack 위로 push됩니다. Android의 기본 애니메이션은 OS 버전과 theme에 따라 달라집니다. iOS에서는 옆에서 슬라이드됩니다. |
| `modal` | 새 screen이 modal로 표시되며, screen 내부에 nested stack을 렌더링할 수 있습니다. |
| `transparentModal` | 새 screen이 modal로 표시되며, 이전 screen은 계속 보입니다. screen 배경이 반투명할 때 아래 콘텐츠를 계속 볼 수 있습니다. |
| `containedModal` | Android에서는 `modal`로 fallback됩니다. iOS에서는 [`UIModalPresentationCurrentContext`](https://developer.apple.com/documentation/uikit/uimodalpresentationstyle/uimodalpresentationcurrentcontext) modal style을 사용합니다. |
| `containedTransparentModal` | Android에서는 `transparentModal`로 fallback됩니다. iOS에서는 [`UIModalPresentationOverCurrentContext`](https://developer.apple.com/documentation/uikit/uimodalpresentationstyle/uimodalpresentationovercurrentcontext) modal style을 사용합니다. |
| `fullScreenModal` | Android에서는 `modal`로 fallback됩니다. iOS에서는 [`UIModalPresentationFullScreen`](https://developer.apple.com/documentation/uikit/uimodalpresentationstyle/uimodalpresentationfullscreen) modal style을 사용합니다. |
| `formSheet` | detents를 구성할 수 있는 bottom sheet를 표시합니다. 자세한 내용은 [FormSheet presentation](/router/advanced/modals#form-sheet-presentation)을 참고하세요. |
