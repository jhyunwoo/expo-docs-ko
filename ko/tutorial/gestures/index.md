---
modificationDate: March 09, 2026
title: Gesture 추가하기
description: 이 튜토리얼에서는 React Native Gesture Handler와 Reanimated 라이브러리의 gesture를 구현하는 방법을 배웁니다.
---

# Gesture 추가하기

이 튜토리얼에서는 React Native Gesture Handler와 Reanimated 라이브러리의 gesture를 구현하는 방법을 배웁니다.

Gesture는 앱에서 직관적인 사용자 경험을 제공하는 훌륭한 방법입니다. [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/docs/) 라이브러리는 gesture를 처리할 수 있는 기본 제공 네이티브 컴포넌트를 제공합니다. 이 라이브러리는 플랫폼의 네이티브 터치 처리 시스템을 사용해 pan, tap, rotation 등의 gesture를 인식합니다. 이 장에서는 이 라이브러리를 사용해 두 가지 서로 다른 gesture를 추가하겠습니다:

-   이모지 스티커를 double tap하면 크기를 키우고, 다시 double tap하면 크기를 줄입니다.
-   Pan gesture로 이모지 스티커를 화면 위에서 움직여 사용자가 이미지를 원하는 위치에 배치할 수 있게 합니다.

또한 [Reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/handling-gestures/) 라이브러리를 사용해 gesture 상태 간 전환에 animation을 적용하겠습니다.

[시청하기: universal Expo 앱에 gesture 추가하기](https://www.youtube.com/watch?v=0q48LLvTGDU) — React Native Gesture Handler와 Reanimated를 사용해 이모지 스티커에 double tap과 pan gesture를 추가합니다.

## GestureHandlerRootView 추가하기

앱에서 gesture 상호작용이 동작하도록 하려면 `react-native-gesture-handler`의 `<GestureHandlerRootView>`를 `Index` 컴포넌트의 최상단에 렌더링해야 합니다. **app/(tabs)/index.tsx**의 루트 레벨 `<View>` 컴포넌트를 `<GestureHandlerRootView>`로 교체하세요.

```tsx
// ... rest of the import statements remain same
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Index() {
  return (
    <GestureHandlerRootView style={styles.container}>
      {/* ...rest of the code remains */}
    </GestureHandlerRootView>
  )
}
```

## Animated component 사용하기

`Animated` 컴포넌트는 컴포넌트의 `style` prop을 보고 어떤 값을 animation 처리할지 결정하고, animation을 만들기 위한 업데이트를 적용합니다. Reanimated는 `<Animated.View>`, `<Animated.Text>`, `<Animated.ScrollView>` 같은 animated component를 export합니다. 우리는 double tap gesture가 동작하도록 `<Animated.Image>` 컴포넌트에 animation을 적용하겠습니다.

1.  **components** 디렉터리의 **EmojiSticker.tsx** 파일을 엽니다. 내부에서 animated component를 사용하기 위해 `react-native-reanimated` 라이브러리에서 `Animated`를 import합니다.
2.  `Image` 컴포넌트를 `<Animated.Image>`로 바꿉니다.

```tsx
import { ImageSourcePropType, View } from 'react-native';
import Animated from 'react-native-reanimated';

type Props = {
  imageSize: number;
  stickerSource: ImageSourcePropType;
};

export default function EmojiSticker({ imageSize, stickerSource }: Props) {
  return (
    <View style={{ top: -350 }}>
      <Animated.Image
        source={stickerSource}
        resizeMode="contain"
        style={{ width: imageSize, height: imageSize }}
      />
    </View>
  );
}
```

> animated component API 전체 레퍼런스는 [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/docs/core/createAnimatedComponent) 문서를 참고하세요.

## tap gesture 추가하기

React Native Gesture Handler를 사용하면 double tap 이벤트처럼 터치 입력을 감지했을 때 동작을 추가할 수 있습니다.

**EmojiSticker.tsx** 파일에서 다음을 수행하세요:

1.  `react-native-gesture-handler`에서 `Gesture`와 `GestureDetector`를 import합니다.
2.  스티커의 tap을 인식하려면 `react-native-reanimated`에서 `useAnimatedStyle`, `useSharedValue`, `withSpring`을 import하여 `<Animated.Image>`의 스타일에 animation을 적용합니다.
3.  `EmojiSticker` 컴포넌트 내부에서 `useSharedValue()` hook을 사용해 `scaleImage`라는 참조를 만듭니다. 초기값은 `imageSize`로 설정합니다.

```tsx
// ...rest of the import statements remain same
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export default function EmojiSticker({ imageSize, stickerSource }: Props) {
  const scaleImage = useSharedValue(imageSize);

  return (
    // ...rest of the code remains same
  )
}
```

`useSharedValue()` hook으로 shared value를 만들면 여러 장점이 있습니다. 데이터 변경을 도와주고 현재 값을 기준으로 animation을 실행합니다. `.value` 속성을 사용해 shared value에 접근하고 수정할 수 있습니다. 이제 `doubleTap` 객체를 만들어 초기값을 확대하고, `Gesture.Tap()`을 사용해 스티커 이미지가 확대되는 전환을 animation 처리하겠습니다. 필요한 tap 횟수는 `numberOfTaps()`로 지정합니다.

`EmojiSticker` 컴포넌트 안에 다음 객체를 만드세요:

```tsx
const doubleTap = Gesture.Tap()
  .numberOfTaps(2)
  .onStart(() => {
    if (scaleImage.value !== imageSize * 2) {
      scaleImage.value = scaleImage.value * 2;
    } else {
      scaleImage.value = Math.round(scaleImage.value / 2);
    }
  });
```

전환에 animation을 적용하려면 spring 기반 animation을 사용해 봅시다. 이는 실제 세계의 spring 물리에 기반하므로 더 생동감 있게 느껴집니다. `react-native-reanimated`가 제공하는 `withSpring()` 함수를 사용하겠습니다.

스티커 이미지에는 `useAnimatedStyle()` hook을 사용해 스타일 객체를 만듭니다. 이 객체를 사용하면 animation이 일어날 때 shared value를 이용해 스타일을 갱신할 수 있습니다. 또한 `width`와 `height` 속성을 조작해 이미지 크기를 확대합니다. 이 속성들의 초기값은 `imageSize`입니다.

`EmojiSticker` 컴포넌트에 `imageStyle` 변수를 만들고 추가하세요:

```tsx
const imageStyle = useAnimatedStyle(() => {
  return {
    width: withSpring(scaleImage.value),
    height: withSpring(scaleImage.value),
  };
});
```

다음으로 `<Animated.Image>` 컴포넌트를 `<GestureDetector>`로 감싸고, `<Animated.Image>`의 `style` prop을 수정해 `imageStyle`을 전달합니다.

```tsx
import { ImageSourcePropType, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

type Props = {
  imageSize: number;
  stickerSource: ImageSourcePropType;
};

export default function EmojiSticker({ imageSize, stickerSource }: Props) {
  const scaleImage = useSharedValue(imageSize);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      if (scaleImage.value !== imageSize * 2) {
        scaleImage.value = scaleImage.value * 2;
      } else {
        scaleImage.value = Math.round(scaleImage.value / 2);
      }
    });

  const imageStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(scaleImage.value),
      height: withSpring(scaleImage.value),
    };
  });

  return (
    <View style={{ top: -350 }}>
      <GestureDetector gesture={doubleTap}>
        <Animated.Image
          source={stickerSource}
          resizeMode="contain"
          style={[imageStyle, { width: imageSize, height: imageSize }]}
        />
      </GestureDetector>
    </View>
  );
}
```

위 코드에서 `gesture` prop은 사용자가 스티커 이미지를 double tap할 때 gesture를 트리거하도록 `doubleTap` 값을 받습니다.

이제 Android, iOS, 웹에서 앱이 어떻게 보이는지 살펴봅시다:

> tap gesture API 전체 레퍼런스는 [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/docs/2.x/gestures/tap-gesture) 문서를 참고하세요.

## pan gesture 추가하기

스티커에서 드래그 gesture를 인식하고 그 움직임을 추적하려면 pan gesture를 사용하겠습니다. **components/EmojiSticker.tsx**에서 다음을 수행하세요:

1.  `translateX`와 `translateY`라는 두 개의 새로운 shared value를 만듭니다.
2.  `<View>`를 `<Animated.View>` 컴포넌트로 바꿉니다.

```tsx
export default function EmojiSticker({ imageSize, stickerSource }: Props) {
  const scaleImage = useSharedValue(imageSize);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  // ...rest of the code remains same

  return (
    <Animated.View style={{ top: -350 }}>
      <GestureDetector gesture={doubleTap}>
        {/* ...rest of the code remains same */}
      </GestureDetector>
    </Animated.View>
  );
}
```

위 코드가 하는 일을 살펴보겠습니다:

-   정의한 translation 값은 스티커를 화면 위에서 움직이게 합니다. 스티커는 두 축 모두를 따라 움직이므로 X와 Y 값을 모두 추적해야 합니다.
-   `useSharedValue()` hook에서 두 translation 변수 모두의 초기 위치를 `0`으로 설정했습니다. 이것이 스티커의 초기 위치이자 시작점입니다. 이 값은 gesture가 시작될 때 스티커의 초기 위치를 정합니다.

이전 단계에서는 `Gesture.Tap()` 메서드에 연결된 tap gesture에 대해 `onStart()` callback을 트리거했습니다. pan gesture에서는 gesture가 활성 상태이고 움직이는 동안 실행되는 `onChange()` callback을 지정합니다.

1.  pan gesture를 처리할 `drag` 객체를 만듭니다. `onChange()` callback은 `event`를 매개변수로 받습니다. `changeX`와 `changeY` 속성은 마지막 이벤트 이후 위치 변화를 담고 있으며, `translateX`와 `translateY`에 저장된 값을 갱신합니다.
2.  `useAnimatedStyle()` hook을 사용해 `containerStyle` 객체를 정의합니다. 이 객체는 transform 배열을 반환합니다. `<Animated.View>` 컴포넌트에는 `translateX`와 `translateY` 값을 `transform` 속성으로 설정해야 합니다. 이렇게 하면 gesture가 활성화되었을 때 스티커 위치가 바뀝니다.

```tsx
const drag = Gesture.Pan().onChange(event => {
  translateX.value += event.changeX;
  translateY.value += event.changeY;
});

const containerStyle = useAnimatedStyle(() => {
  return {
    transform: [
      {
        translateX: translateX.value,
      },
      {
        translateY: translateY.value,
      },
    ],
  };
});
```

다음으로 JSX 코드 안에서 다음을 수행하세요:

1.  `<EmojiSticker>` 컴포넌트를 업데이트하여 `<GestureDetector>` 컴포넌트가 최상위 컴포넌트가 되도록 합니다.
2.  transform 스타일을 적용하기 위해 `<Animated.View>` 컴포넌트에 `containerStyle`을 추가합니다.

```tsx
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { ImageSourcePropType } from 'react-native';

type Props = {
  imageSize: number;
  stickerSource: ImageSourcePropType;
};

export default function EmojiSticker({ imageSize, stickerSource }: Props) {
  const scaleImage = useSharedValue(imageSize);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      if (scaleImage.value !== imageSize * 2) {
        scaleImage.value = scaleImage.value * 2;
      } else {
        scaleImage.value = Math.round(scaleImage.value / 2);
      }
    });

  const imageStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(scaleImage.value),
      height: withSpring(scaleImage.value),
    };
  });

  const drag = Gesture.Pan().onChange(event => {
    translateX.value += event.changeX;
    translateY.value += event.changeY;
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={drag}>
      <Animated.View style={[containerStyle, { top: -350 }]}>
        <GestureDetector gesture={doubleTap}>
          <Animated.Image
            source={stickerSource}
            resizeMode="contain"
            style={[imageStyle, { width: imageSize, height: imageSize }]}
          />
        </GestureDetector>
      </Animated.View>
    </GestureDetector>
  );
}
```

이제 Android, iOS, 웹에서 앱이 어떻게 보이는지 살펴봅시다:

## 요약

6장: Gesture 추가하기

pan과 tap gesture를 성공적으로 구현했습니다.

다음 장에서는 이미지와 스티커의 screenshot을 찍어 device의 라이브러리에 저장하는 방법을 배웁니다.

[다음: Screenshot 찍기](/tutorial/screenshot)
