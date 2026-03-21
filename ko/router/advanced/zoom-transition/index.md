---
modificationDate: February 26, 2026
title: Zoom transition
description: Expo Router를 iOS에서 사용할 때 screen 사이에 부드러운 animation을 만드는 zoom transition 사용 방법을 알아보세요.
---

# Zoom transition

Expo Router를 iOS에서 사용할 때 screen 사이에 부드러운 animation을 만드는 zoom transition 사용 방법을 알아보세요.

> Zoom transition은 **iOS 전용**으로 **Expo SDK 55** 이상에서 사용할 수 있는 alpha API입니다. 이 API는 호환성이 깨지는 변경이 생길 수 있습니다.

Zoom transition은 source element에서 대상 screen으로 확대되며 screen 사이를 이동할 때 부드러운 animation 효과를 제공합니다. 이 기능은 iOS 18+의 네이티브 zoom transition API를 활용해 route 사이의 공간적 연결감을 만들어주는 shared interactive transition을 구현합니다. 예를 들어 card thumbnail이 다음 route에서 전체 너비 banner로 전환될 수 있습니다.

## Get started

zoom transition을 구현하려면 source element를 표시하는 `Link.AppleZoom` component를 사용하고, 필요하면 대상 screen에서 target alignment를 지정하기 위해 `Link.AppleZoomTarget`도 사용해야 합니다.

### Basic example

link에 zoom transition을 활성화하려면 screen에서 source(`Image`) element를 `Link.AppleZoom`으로 감싸세요:

```tsx
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Image } from 'expo-image';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Link href="/image" asChild>
        <Link.AppleZoom>
          <Pressable>
            <Image
              source={{ uri: 'https://example.com/image-1.jpg' }}
              style={{ width: 100, height: 200 }}
            />
          </Pressable>
        </Link.AppleZoom>
      </Link>
    </View>
  );
}
```

대상 screen에서는 `Image` component를 정의합니다:

```tsx
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

export default function DetailsScreen() {
  return <Image source={{ uri: 'https://example.com/image-1.jpg' }} style={{ flex: 1 }} />;
}
```

## Using `Link.AppleZoom`

`Link.AppleZoom` component는 확대 시작 지점이 될 element를 감쌉니다. 확대되는 콘텐츠와 함께 추가 element를 포함하고 싶을 때 zoom transition의 source를 표시하는 데 유용합니다.

```tsx
<Link href="/image" asChild>
  <Pressable>
    <Link.AppleZoom>
      <View>{/* Your content */}</View>
    </Link.AppleZoom>
    <Text>Subtitle</Text>
  </Pressable>
</Link>
```

> `Link.AppleZoom`은 단일 child component만 받을 수 있습니다. 여러 child를 감싸야 한다면 `View`나 다른 container component를 사용하세요.

### Customizing alignment

대상 screen에서 확대된 element의 정렬을 지정하려면 `Link.AppleZoomTarget` element를 사용할 수 있습니다.

```tsx
export default function ImageScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Link.AppleZoomTarget>
        <Image source={{ uri: 'https://example.com/image-1.jpg' }} style={{ width: '100%' }} />
      </Link.AppleZoomTarget>
    </View>
  );
}
```

alignment rectangle을 더 세밀하게 제어해야 한다면 `Link.AppleZoom`에 `alignmentRect` prop을 전달할 수 있습니다. 하지만 보통 `Link.AppleZoomTarget`을 사용한다면 이 작업은 필요하지 않습니다.

> `alignmentRect` prop은 내부적으로 [`alignmentRectProvider`](https://developer.apple.com/documentation/uikit/uiviewcontroller/transition/zoomoptions/alignmentrectprovider) API에 의존합니다.

```tsx
<Link.AppleZoom alignmentRect={{ x: 0, y: 0, width: 200, height: 300 }}>
  <Image source={{ uri: 'https://example.com/image-1.jpg' }} style={{ width: 100, height: 150 }} />
</Link.AppleZoom>
```

## Complete example

아래는 gallery grid에서 zoom transition으로 detail view로 이동하는 조금 더 복잡한 예시입니다. source screen component(**src/app/index.tsx**)는 `Image` component를 감싸기 위해 `Link.AppleZoom`을 사용합니다:

```tsx
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Text, Pressable, ScrollView, StyleSheet } from 'react-native';

const IMAGES = [
  // Define your array of images here.
];

export default function Index() {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}
      contentInsetAdjustmentBehavior="automatic">
      {IMAGES.map((_, index) => (
        <Thumbnail key={index} index={index} />
      ))}
    </ScrollView>
  );
}

function Thumbnail({ index }: { index: number }) {
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  return (
    <Link
      href={{
        pathname: `/image/[id]`,
        // You need to pass the image size to the detail page, so that the layout can be measured during the first render.
        params: { id: index, width: size?.width, height: size?.height },
      }}
      asChild>
      <Pressable style={styles.thumbnail}>
        <Link.AppleZoom>
          <Image
            source={IMAGES[index % IMAGES.length]}
            style={styles.thumbnailImage}
            onLoad={e => setSize({ width: e.source.width, height: e.source.height })}
          />
        </Link.AppleZoom>
        <Text style={{ textAlign: 'center' }}>Photo {index + 1}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  scrollViewContent: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  thumbnail: {
    width: 170,
    aspectRatio: 1,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});
```

대상 screen에서는 확대된 element의 정렬을 지정하기 위해 `Link.AppleZoomTarget`을 사용합니다:

```tsx
import { Image } from 'expo-image';
import { Link, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

export default function ImagePage() {
  const params = useLocalSearchParams();
  const index = params.id ? parseInt(params.id as string, 10) : 0;
  const imageSource = IMAGES[index % IMAGES.length];
  const imageSize = {
    width: parseInt(params.width as string, 10),
    height: parseInt(params.height as string, 10),
  };
  const windowDimensions = useWindowDimensions();
  // Compute the size to fit within the window while maintaining aspect ratio.
  const computedSize = useMemo(() => {
    if (!imageSize.width || !imageSize.height) {
      return { width: windowDimensions.width, height: windowDimensions.height };
    }
    const widthRatio = windowDimensions.width / imageSize.width;
    const heightRatio = windowDimensions.height / imageSize.height;
    const minRatio = Math.min(widthRatio, heightRatio);
    return {
      width: imageSize.width * minRatio,
      height: imageSize.height * minRatio,
    };
  }, [imageSize, windowDimensions]);

  return (
    <View style={styles.container}>
      <Link.AppleZoomTarget>
        <View style={{ ...computedSize }}>
          <Image source={imageSource} style={styles.image} />
        </View>
      </Link.AppleZoomTarget>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
```

## Controlling dismissal gestures

[`usePreventZoomTransitionDismissal`](/versions/latest/sdk/router#usepreventzoomtransitiondismissal_options) hook을 사용하면 zoom transition을 사용하는 screen에서 interactive swipe-to-dismiss gesture를 제어할 수 있습니다. 실수로 dismiss되는 일을 막거나 특정 screen 영역에서만 dismiss를 허용하고 싶을 때 유용합니다.

### Disabling dismissal completely

option 없이 hook을 호출하면 swipe-to-dismiss gesture를 완전히 비활성화할 수 있습니다:

```tsx
import { usePreventZoomTransitionDismissal } from 'expo-router';

export default function DetailScreen() {
  usePreventZoomTransitionDismissal();
  // Dismissal gesture is now disabled - users must use navigation controls to go back
  return <View>{/* Content */}</View>;
}
```

### Restricting dismissal to a specific area

`unstable_dismissalBoundsRect` option을 사용해 dismissal gesture가 허용되는 사각형 영역을 정의할 수 있습니다. 이미지를 보는 화면에서 이미지 영역에서만 dismissal을 허용하고 싶을 때 유용합니다:

```tsx
import { usePreventZoomTransitionDismissal } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

export default function DetailScreen() {
  // Only allow dismissal gestures that start within this rectangle
  usePreventZoomTransitionDismissal({
    unstable_dismissalBoundsRect: { minX: 100, minY: 100, maxX: 300, maxY: 300 },
  });

  return (
    <View style={styles.container}>
      {/* Visual indicator of the dismissal zone (for demonstration) */}
      <View style={styles.dismissalZone} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  dismissalZone: {
    position: 'absolute',
    left: 100,
    top: 100,
    width: 200, // maxX - minX = 300 - 100
    height: 200, // maxY - minY = 300 - 100
    borderWidth: 2,
    borderColor: 'rgba(0, 122, 255, 0.5)',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
});
```

> `unstable_dismissalBoundsRect` option은 내부적으로 [`interactiveDismissShouldBegin`](https://developer.apple.com/documentation/uikit/uiviewcontroller/transition/zoomoptions/interactivedismissshouldbegin) API에 의존합니다.

## Platform support

Zoom transition은 iOS 18 이상에서만 사용할 수 있습니다. 더 오래된 iOS 버전이나 다른 플랫폼에서는 이 component가 zoom animation 효과 없이 일반적으로 렌더링됩니다.

zoom transition component는 플랫폼 지원 여부를 자동으로 감지하고, 지원되지 않는 플랫폼에서는 표준 navigation으로 자연스럽게 fallback됩니다.

## Known limitations

Using zoom transition with headers

header(navigation bar)가 있는 screen 사이를 이동할 때는 zoom transition 사용을 피하는 것을 권장합니다. 네이티브 iOS zoom transition API에는 알려진 문제가 있어 header가 포함되면 시각적 glitch나 예상치 못한 동작이 생길 수 있습니다.

Using zoom transition with Link.Preview

`Link.Preview`를 zoom transition과 함께 사용할 때는 대상 screen이 예를 들어 `presentation: 'fullScreenModal'` 같은 modal presentation을 사용해야 합니다. 이는 기반이 되는 iOS zoom transition API의 제한입니다. `Link.Preview`에서 modal이 아닌 screen으로 이동하면 zoom transition은 기대한 대로 동작하지 않고 표준 navigation transition으로 fallback됩니다.

`usePreventZoomTransitionDismissal` cannot be used in screens with modal presentation

`usePreventZoomTransitionDismissal` hook은 예를 들어 `presentation: 'fullScreenModal'`처럼 modal presentation이 있는 screen에서는 사용할 수 없습니다. modal screen에서 사용해도 hook은 아무 효과가 없고 dismissal gesture는 평소처럼 동작합니다.

Single child requirement

`Link.AppleZoom`과 `Link.AppleZoomTarget`은 둘 다 단일 child component만 받을 수 있습니다. 여러 child를 전달하려고 하면 warning이 기록되고 component가 올바르게 렌더링되지 않습니다.

**Incorrect:**

```tsx
<Link.AppleZoom>
  <View />
  <Text />
</Link.AppleZoom>
```

**Correct:**

```tsx
<Link.AppleZoom>
  <View>
    <Image />
    <Text />
  </View>
</Link.AppleZoom>
```

Noticeable delay when opening or dismissing screens

zoom transition을 사용하는 screen을 열거나 dismiss할 때, 특히 빠르게 열기/닫기/다시 열기 제스처를 수행하면 눈에 띄는 지연(약 1초)을 겪을 수 있습니다. 이 지연은 동일한 zoom transition API를 사용하는 네이티브 iOS 앱에서 보게 될 것보다 큽니다.

이 문제는 iOS에서 transition을 처리하는 방식과 관련된 `react-native-screens`의 upstream issue입니다. Expo 팀은 이를 개선하기 위해 `react-native-screens` 팀과 적극적으로 협력하고 있습니다. 업데이트와 자세한 내용은 이 [GitHub Issue](https://github.com/expo/expo/issues/42797)를 참고하세요.

Supported only within router's Stack navigator

zoom transition 기능은 router의 내장 Stack navigator를 사용할 때만 지원됩니다. Stack navigator의 일부가 아닌 screen에 대해 Link와 함께 zoom transition을 사용하려고 하면 zoom transition이 기대한 대로 동작하지 않습니다.

Must be used within a Link

`Link.AppleZoom`은 `asChild` prop이 있는 `Link` component의 직접 또는 간접 child로 사용해야 합니다. 이 문맥 밖에서 사용하면 error가 발생합니다.

iOS 18+ only

zoom transition 기능은 iOS 18 이상이 필요합니다. component는 더 오래된 버전에서도 렌더링되지만 zoom animation은 적용되지 않습니다.
