---
modificationDate: March 06, 2026
title: 이미지 피커 사용하기
description: 이 튜토리얼에서는 Expo Image Picker를 사용하는 방법을 배웁니다.
---

# 이미지 피커 사용하기

이 튜토리얼에서는 Expo Image Picker를 사용하는 방법을 배웁니다.

React Native는 `<View>`, `<Text>`, `<Pressable>` 같은 기본 구성 요소를 표준 빌딩 블록으로 제공합니다. 지금 우리는 device의 미디어 갤러리에서 이미지를 선택하는 기능을 만들고 있습니다. 이 기능은 core component만으로는 구현할 수 없으므로, 앱에 이 기능을 추가하려면 라이브러리가 필요합니다.

우리는 Expo SDK의 라이브러리인 [`expo-image-picker`](/versions/latest/sdk/imagepicker)를 사용하겠습니다.

> `expo-image-picker`는 휴대폰 라이브러리에서 이미지와 비디오를 선택할 수 있도록 시스템 UI에 접근하는 기능을 제공합니다.

[시청하기: universal Expo 앱에서 이미지 피커 사용하기](https://www.youtube.com/watch?v=iEQZU58naS8) — expo-image-picker를 사용해 device의 미디어 라이브러리에서 이미지를 선택하는 방법을 배웁니다.

## expo-image-picker 설치하기

`expo-image-picker` 라이브러리를 설치하려면 터미널에서 Ctrl + c를 눌러 development server를 중지한 다음, 아래 명령을 실행하세요:

```sh
npx expo install expo-image-picker
```

[`npx expo install`](/more/expo-cli#installation) 명령은 라이브러리를 설치하고 프로젝트의 **package.json** 안 dependencies에 추가합니다.

> **Tip:** 프로젝트에 새 라이브러리를 설치할 때마다 터미널에서 Ctrl + c를 눌러 development server를 중지한 뒤 설치 명령을 실행하세요. 설치가 끝나면 `npx expo start`를 실행해 development server를 다시 시작하세요.

## device의 미디어 라이브러리에서 이미지 선택하기

`expo-image-picker`는 device의 미디어 라이브러리에서 이미지나 비디오를 고를 수 있도록 시스템 UI를 표시하는 `launchImageLibraryAsync()` 메서드를 제공합니다. 이 기능을 구현하기 위해 이전 장에서 만든 primary themed button을 사용해 device의 미디어 라이브러리에서 이미지를 선택하고, device 이미지 라이브러리를 여는 함수를 만들겠습니다.

**app/(tabs)/index.tsx**에서 `expo-image-picker` 라이브러리를 import하고, `Index` 컴포넌트 안에 `pickImageAsync()` 함수를 만드세요:

```tsx
// ...rest of the import statements remain unchanged
import * as ImagePicker from 'expo-image-picker';

export default function Index() {
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
    } else {
      alert('You did not select any image.');
    }
  };

  // ...rest of the code remains same
}
```

위 코드가 무엇을 하는지 살펴봅시다:

-   `launchImageLibraryAsync()`는 여러 옵션을 지정하는 객체를 받습니다. 이 객체는 [`ImagePickerOptions`](/versions/latest/sdk/imagepicker#imagepickeroptions) 객체이며, 메서드를 호출할 때 이 값을 전달하고 있습니다.
-   `allowsEditing`을 `true`로 설정하면 Android와 iOS에서 사용자가 선택 과정 중 이미지를 자를 수 있습니다.

## Button component 업데이트하기

primary button을 누르면 `Button` 컴포넌트에서 `pickImageAsync()` 함수를 호출하도록 하겠습니다. **components/Button.tsx**에서 `Button` 컴포넌트의 `onPress` prop을 업데이트하세요:

```tsx
import { StyleSheet, View, Pressable, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type Props = {
  label: string;
  theme?: 'primary';
  onPress?: () => void;
};

export default function Button({ label, theme, onPress }: Props) {
  if (theme === 'primary') {
    return (
      <View
        style={[
          styles.buttonContainer,
          { borderWidth: 4, borderColor: '#ffd33d', borderRadius: 18 },
        ]}>
        <Pressable style={[styles.button, { backgroundColor: '#fff' }]} onPress={onPress}>
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

**app/(tabs)/index.tsx**에서 첫 번째 `<Button>`의 `onPress` prop에 `pickImageAsync()` 함수를 추가하세요.

```tsx
import { View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import Button from '@/components/Button';
import ImageViewer from '@/components/ImageViewer';

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
    } else {
      alert('You did not select any image.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} />
      </View>
      <View style={styles.footerContainer}>
        <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
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

`pickImageAsync()` 함수는 `ImagePicker.launchImageLibraryAsync()`를 호출한 다음 그 결과를 처리합니다. `launchImageLibraryAsync()` 메서드는 선택된 이미지에 대한 정보를 담고 있는 객체를 반환합니다.

아래는 `result` 객체와 그 안에 포함된 속성 예시입니다:

```json
{
  "assets": [
    {
      "assetId": null,
      "base64": null,
      "duration": null,
      "exif": null,
      "fileName": "ea574eaa-f332-44a7-85b7-99704c22b402.jpeg",
      "fileSize": 4513577,
      "height": 4570,
      "mimeType": "image/jpeg",
      "rotation": null,
      "type": "image",
      "uri": "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FStickerSmash-13f21121-fc9d-4ec6-bf89-bf7d6165eb69/ImagePicker/ea574eaa-f332-44a7-85b7-99704c22b402.jpeg",
      "width": 2854
    }
  ],
  "canceled": false
}
```

## 선택한 이미지 사용하기

`result` 객체는 선택한 이미지의 `uri`를 담고 있는 `assets` 배열을 제공합니다. 이제 이 값을 image picker에서 가져와 앱에서 선택한 이미지를 표시하는 데 사용해 봅시다.

**app/(tabs)/index.tsx** 파일을 수정하세요:

1.  React의 [`useState`](https://react.dev/learn/state-a-components-memory#adding-a-state-variable) hook을 사용해 `selectedImage`라는 state 변수를 선언합니다. 이 state 변수에는 선택한 이미지의 URI를 저장하겠습니다.
2.  `pickImageAsync()` 함수를 업데이트해 이미지 URI를 `selectedImage` state 변수에 저장합니다.
3.  `selectedImage`를 prop으로 `ImageViewer` 컴포넌트에 전달합니다.

```tsx
import { View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

import Button from '@/components/Button';
import ImageViewer from '@/components/ImageViewer';

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert('You did not select any image.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
      </View>
      <View style={styles.footerContainer}>
        <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
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

placeholder 이미지 대신 선택한 이미지를 표시하려면 `selectedImage` prop을 `ImageViewer` 컴포넌트에 전달하세요.

1.  **components/ImageViewer.tsx** 파일을 수정해 `selectedImage` prop을 받을 수 있게 합니다.
2.  이미지 source 표현이 길어지고 있으므로, 이를 `imageSource`라는 별도 변수로 옮깁니다.
3.  `Image` 컴포넌트의 `source` prop 값으로 `imageSource`를 전달합니다.

```tsx
import { ImageSourcePropType, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

type Props = {
  imgSource: ImageSourcePropType;
  selectedImage?: string;
};

export default function ImageViewer({ imgSource, selectedImage }: Props) {
  const imageSource = selectedImage ? { uri: selectedImage } : imgSource;

  return <Image source={imageSource} style={styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});
```

위 코드에서 Image 컴포넌트는 조건 연산자를 사용해 이미지 source를 로드합니다. 선택한 이미지는 placeholder 이미지 같은 로컬 asset이 아니라 [`uri` string](https://reactnative.dev/docs/images#network-images)입니다.

이제 앱이 어떻게 보이는지 살펴봅시다:

> 이 튜토리얼의 예제 앱에 사용한 이미지는 [Unsplash](https://unsplash.com)에서 선택했습니다.

## 요약

4장: 이미지 피커 사용하기

device의 미디어 라이브러리에서 이미지를 선택하는 기능을 성공적으로 추가했습니다.

다음 장에서는 이모지 피커 modal component를 만드는 방법을 배웁니다.

[다음: 이모지 피커 modal 만들기](/tutorial/create-a-modal)
