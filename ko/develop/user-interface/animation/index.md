---
modificationDate: December 18, 2024
title: Animation
description: React Native animation을 통합하고 Expo 프로젝트에서 사용하는 방법을 알아보세요.
---

# Animation

React Native animation을 통합하고 Expo 프로젝트에서 사용하는 방법을 알아보세요.

animation은 더 나은 사용자 경험을 제공하고 앱을 풍부하게 만드는 훌륭한 방법입니다. Expo 프로젝트에서는 React Native의 [Animated API](https://reactnative.dev/docs/next/animations)를 사용할 수 있습니다. 하지만 더 높은 성능의 고급 animation을 사용하고 싶다면 [`react-native-reanimated`](https://docs.swmansion.com/react-native-reanimated/) 라이브러리를 사용할 수 있습니다. 이 라이브러리는 부드럽고 강력하며 유지보수하기 쉬운 animation을 만드는 과정을 단순화하는 API를 제공합니다.

## 설치

[기본 template](/get-started/create-a-project)로 프로젝트를 만들었다면 `react-native-reanimated` 설치는 건너뛰어도 됩니다. 이 라이브러리는 이미 설치되어 있습니다. 그렇지 않다면 다음 명령으로 설치하세요:

```sh
npx expo install react-native-reanimated
```

## 사용 방법

### 최소 예제

다음 예제는 `react-native-reanimated` 라이브러리를 사용해 간단한 animation을 만드는 방법을 보여 줍니다. API와 고급 사용법에 대한 자세한 내용은 [`react-native-reanimated` documentation](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/your-first-animation)를 참고하세요.

```tsx
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { View, Button, StyleSheet } from 'react-native';

export default function AnimatedStyleUpdateExample() {
  const randomWidth = useSharedValue(10);

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const style = useAnimatedStyle(() => {
    return {
      width: withTiming(randomWidth.value, config),
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, style]} />
      <Button
        title="toggle"
        onPress={() => {
          randomWidth.value = Math.random() * 350;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 100,
    height: 80,
    backgroundColor: 'black',
    margin: 30,
  },
});
```

## 다른 animation 라이브러리

Expo 프로젝트에서는 [Moti](https://moti.fyi/) 같은 다른 animation package도 사용할 수 있습니다. Android, iOS, web에서 모두 동작합니다.
