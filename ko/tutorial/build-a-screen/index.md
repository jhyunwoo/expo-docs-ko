---
modificationDate: March 09, 2026
title: 화면 만들기
description: 이 튜토리얼에서는 React Native의 Pressable과 Expo Image 같은 컴포넌트를 사용해 화면을 만드는 방법을 알아봅니다.
---

# 화면 만들기

이 튜토리얼에서는 React Native의 Pressable과 Expo Image 같은 컴포넌트를 사용해 화면을 만드는 방법을 알아봅니다.

이 장에서는 StickerSmash 앱의 첫 번째 화면을 만들어 보겠습니다.

위 화면은 이미지 하나와 버튼 두 개를 표시합니다. 앱 사용자는 두 버튼 중 하나를 사용해 이미지를 선택할 수 있습니다. 첫 번째 버튼은 디바이스에서 이미지를 선택할 수 있게 해줍니다. 두 번째 버튼은 앱이 제공하는 기본 이미지로 계속 진행할 수 있게 해줍니다.

사용자가 이미지를 선택하면 그 위에 스티커를 추가할 수 있습니다. 그러니 이 화면부터 만들어 봅시다.

[시청하기: 유니버설 Expo 앱에서 화면 만들기](https://www.youtube.com/watch?v=3rcOP8xDwTQ) — Pressable, Expo Image, 그리고 다른 핵심 컴포넌트를 사용해 이미지 선택기 레이아웃으로 StickerSmash 앱의 첫 화면을 만듭니다.

## 화면을 분해해 보기

이 화면을 코드를 작성해 만들기 전에, 몇 가지 핵심 요소로 먼저 나눠 보겠습니다.

필수 요소는 두 가지입니다:

-   화면 중앙에 큰 이미지가 표시됩니다
-   화면 아래쪽 절반에 버튼 두 개가 있습니다

첫 번째 버튼은 여러 컴포넌트로 구성됩니다. 부모 요소가 노란색 테두리를 제공하고, 그 안에 icon과 text 컴포넌트가 행 방향으로 들어 있습니다.

이제 UI를 더 작은 조각으로 나눴으니 코딩을 시작할 준비가 되었습니다.

## 이미지 표시하기

앱에서 이미지를 표시하기 위해 `expo-image` 라이브러리를 사용하겠습니다. 이 라이브러리는 이미지를 로드하고 렌더링하는 cross-platform `<Image>` 컴포넌트를 제공합니다. 우리가 사용 중인 기본 프로젝트 템플릿에는 이미 포함되어 있습니다.

Image 컴포넌트는 이미지의 source를 값으로 받습니다. source는 [static asset](https://reactnative.dev/docs/images#static-image-resources)일 수도 있고 URL일 수도 있습니다. 예를 들어 **assets/images** 디렉터리에서 `require`한 source는 static입니다. [Network](https://reactnative.dev/docs/images#network-images)의 `uri` 속성에서 가져올 수도 있습니다.

**app/(tabs)/index.tsx** 파일에서 Image 컴포넌트를 사용하려면:

1.  `expo-image` 라이브러리에서 `Image`를 import합니다.
2.  `PlaceholderImage` 변수를 만들어 **assets/images/background-image.png** 파일을 `Image` 컴포넌트의 `source` prop으로 사용합니다.

```tsx
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={PlaceholderImage} style={styles.image} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});
```

## 컴포넌트를 파일로 나누기

이 화면에 더 많은 컴포넌트를 추가할수록 코드를 여러 파일로 나눠 보겠습니다. 이 튜토리얼 전체에서 custom 컴포넌트를 만들기 위해 components 디렉터리를 사용할 것입니다.

1.  최상위에 **components** 디렉터리를 만들고, 그 안에 **ImageViewer.tsx** 파일을 만듭니다.
2.  이미지를 표시하는 코드와 `image` 스타일을 이 파일로 옮깁니다.

```tsx
import { ImageSourcePropType, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

type Props = {
  imgSource: ImageSourcePropType;
};

export default function ImageViewer({ imgSource }: Props) {
  return <Image source={imgSource} style={styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});
```

> **ImageViewer**는 custom 컴포넌트이므로 **app** 디렉터리가 아니라 별도 디렉터리에 둡니다. **app** 디렉터리 안의 모든 파일은 layout 파일이거나 route 파일입니다. 자세한 내용은 [내비게이션이 아닌 컴포넌트는 app 디렉터리 밖에 둡니다](/router/basics/core-concepts#5-non-navigation-components-live-outside-of-app-directory)를 참고하세요.

**app/(tabs)/index.tsx**에서 `ImageViewer`를 import해 사용합니다:

```tsx
import { StyleSheet, View } from 'react-native';

import ImageViewer from '@/components/ImageViewer';

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
  },
});
```

import 문 안의 `@`는 무엇일까요?

`@` 기호는 상대 경로 대신 custom 컴포넌트와 다른 모듈을 import하기 위한 custom [path alias](/guides/typescript#path-aliases-optional)입니다. Expo CLI가 **tsconfig.json** 안에서 이를 자동으로 설정합니다.

## Pressable로 버튼 만들기

React Native에는 터치 이벤트를 처리하는 여러 컴포넌트가 포함되어 있지만, 유연성 때문에 [`<Pressable>`](https://reactnative.dev/docs/pressable)을 사용하는 것이 권장됩니다. 단일 탭, 길게 누르기, 버튼을 누를 때와 뗄 때 각각 다른 이벤트를 감지하는 등 다양한 동작을 할 수 있습니다.

디자인에는 만들어야 할 버튼이 두 개 있습니다. 각 버튼은 서로 다른 스타일과 label을 가집니다. 먼저 이 버튼들을 위한 재사용 가능한 컴포넌트를 만들어 보겠습니다. **components** 디렉터리 안에 **Button.tsx** 파일을 만들고 다음 코드를 추가하세요:

```tsx
import { StyleSheet, View, Pressable, Text } from 'react-native';

type Props = {
  label: string;
};

export default function Button({ label }: Props) {
  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={() => alert('You pressed a button.')}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
});
```

앱은 사용자가 화면의 버튼 중 하나를 탭하면 alert를 표시합니다. 이는 `<Pressable>`이 `onPress` prop에서 `alert()`를 호출하기 때문입니다. 이제 이 컴포넌트를 **app/(tabs)/index.tsx** 파일로 import하고, 이 버튼들을 감싸는 `<View>`에 대한 스타일도 추가해 봅시다:

```tsx
import { View, StyleSheet } from 'react-native';

import Button from '@/components/Button';
import ImageViewer from '@/components/ImageViewer';

const PlaceholderImage = require("@/assets/images/background-image.png");

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} />
      </View>
      <View style={styles.footerContainer}>
        <Button label="Choose a photo" />
        <Button label="Use this photo" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 28,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
});
```

이제 Android, iOS, 웹에서 앱을 살펴봅시다:

라벨이 "Use this photo"인 두 번째 버튼은 디자인의 실제 버튼과 비슷합니다. 하지만 첫 번째 버튼은 디자인에 맞추려면 더 많은 스타일링이 필요합니다.

## 재사용 가능한 버튼 컴포넌트 개선하기

"Choose a photo" 버튼은 "Use this photo" 버튼과 다른 스타일이 필요하므로, `primary` theme를 적용할 수 있도록 새로운 button theme prop을 추가하겠습니다. 이 버튼은 label 앞에 icon도 가지고 있습니다. 아이콘은 `@expo/vector-icons` 라이브러리에서 사용하겠습니다.

버튼에 icon을 로드하고 표시하기 위해 라이브러리의 `FontAwesome`을 사용하겠습니다. **components/Button.tsx**를 수정해 다음 코드 조각을 추가하세요:

```tsx
import { StyleSheet, View, Pressable, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type Props = {
  label: string;
  theme?: 'primary';
};

export default function Button({ label, theme }: Props) {
  if (theme === 'primary') {
  return (
      <View
        style={[
          styles.buttonContainer,
          { borderWidth: 4, borderColor: '#ffd33d', borderRadius: 18 },
        ]}>
        <Pressable
          style={[styles.button, { backgroundColor: '#fff' }]}
          onPress={() => alert('You pressed a button.')}>
          <FontAwesome name="picture-o" size={18} color="#25292e" style={styles.buttonIcon} />
          <Text style={[styles.buttonLabel, { color: '#25292e' }]}>{label}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={() => alert('You pressed a button.')}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
});
```

위 코드가 무엇을 하는지 살펴봅시다:

-   primary theme 버튼은 **inline styles**를 사용하며, 이는 `style` prop에 직접 전달한 object로 `StyleSheet.create()`에서 정의한 스타일을 덮어씁니다.
-   primary theme 안의 `<Pressable>` 컴포넌트는 `backgroundColor` 속성 값으로 `#fff`를 사용해 버튼 배경을 흰색으로 설정합니다. 이 속성을 `styles.button`에 추가하면 primary theme 버튼과 스타일을 주지 않은 버튼 모두에 배경색이 적용됩니다.
-   inline styles는 JavaScript를 사용하며 특정 값에 대해 기본 스타일을 덮어씁니다.

이제 **app/(tabs)/index.tsx** 파일을 수정해 첫 번째 버튼에 `theme="primary"` prop을 사용하세요.

```tsx
import { View, StyleSheet } from 'react-native';

import Button from '@/components/Button';
import ImageViewer from '@/components/ImageViewer';

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} />
      </View>
      <View style={styles.footerContainer}>
        <Button theme="primary" label="Choose a photo" />
        <Button label="Use this photo" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
});
```

이제 Android, iOS, 웹에서 앱을 살펴봅시다:

## 요약

3장: 화면 만들기

앱의 첫 번째 화면을 만들기 위한 초기 디자인을 성공적으로 구현했습니다.

다음 장에서는 디바이스의 media library에서 이미지를 선택하는 기능을 추가하겠습니다.

[다음: 이미지 picker 사용하기](/tutorial/image-picker)
