---
modificationDate: March 09, 2026
title: Screenshot 찍기
description: 이 튜토리얼에서는 서드파티 라이브러리와 Expo Media Library를 사용해 screenshot을 캡처하는 방법을 배웁니다.
---

# Screenshot 찍기

이 튜토리얼에서는 서드파티 라이브러리와 Expo Media Library를 사용해 screenshot을 캡처하는 방법을 배웁니다.

이 장에서는 서드파티 라이브러리를 사용해 screenshot을 찍고 device의 미디어 라이브러리에 저장하는 방법을 배우겠습니다. screenshot을 찍기 위해 [`react-native-view-shot`](https://github.com/gre/react-native-view-shot)을 사용하고, 이미지를 device의 미디어 라이브러리에 저장하기 위해 [`expo-media-library`](/versions/latest/sdk/media-library)를 사용하겠습니다.

> 지금까지 우리는 `react-native-gesture-handler`, `react-native-reanimated` 같은 서드파티 라이브러리를 사용해 왔습니다. 사용 사례에 따라 [React Native Directory](https://reactnative.directory/)에서 수백 개의 다른 서드파티 라이브러리를 찾을 수 있습니다.

[시청하기: universal Expo 앱에서 screenshot 찍기](https://www.youtube.com/watch?v=Jft3_Yfr-p4) — react-native-view-shot으로 screenshot을 찍고 expo-media-library를 사용해 device의 미디어 라이브러리에 저장합니다.

## 라이브러리 설치하기

`react-native-view-shot`과 `expo-media-library`를 설치하려면 다음 명령을 실행하세요:

```sh
npx expo install react-native-view-shot expo-media-library
```

## 권한 요청하기

device의 미디어 라이브러리에 접근하는 것처럼 민감한 정보가 필요한 앱은 접근을 허용하거나 거부할 수 있도록 권한 요청을 해야 합니다. `expo-media-library`의 `usePermissions()` hook을 사용하면 permission `permissionResponse`와 `requestPermission()` 메서드를 사용해 접근 권한을 요청할 수 있습니다.

앱이 처음 로드되고 권한 상태가 허용도 거부도 아닌 경우, `permissionResponse` 값은 `null`입니다. 권한을 요청받으면 사용자는 권한을 허용하거나 거부할 수 있습니다. 허용되지 않았는지 확인하는 조건을 추가할 수 있습니다. 허용되지 않았다면 `requestPermission()` 메서드를 트리거합니다. 접근 권한을 얻으면 `permissionResponse` 값은 `granted`로 바뀝니다.

다음 코드 조각을 **app/(tabs)/index.tsx** 안에 추가하세요:

```tsx
import { useEffect, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';

// ...rest of the code remains same

export default function Index() {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  // ...rest of the code remains same

  useEffect(() => {
    if (!permissionResponse?.granted) {
      requestPermission();
    }
  }, []);

  // ...rest of the code remains same
}
```

## 현재 view를 저장할 ref 만들기

앱 안에서 사용자가 screenshot을 찍을 수 있도록 `react-native-view-shot`을 사용하겠습니다. 이 라이브러리는 `captureRef()` 메서드를 사용해 `<View>`의 screenshot을 이미지로 캡처합니다. 캡처된 screenshot 이미지 파일의 URI를 반환합니다.

1.  `react-native-view-shot`에서 `captureRef`를 import하고, React에서 `useRef`를 import합니다.
2.  캡처한 screenshot 이미지의 참조를 저장하기 위해 `imageRef` 참조 변수를 만듭니다.
3.  `<ImageViewer>`와 `<EmojiSticker>` 컴포넌트를 `<View>` 안으로 감싼 다음, 참조 변수를 그 `<View>`에 전달합니다.

```tsx
import { useEffect, useState, useRef } from 'react';
import { captureRef } from 'react-native-view-shot';

export default function Index() {
  const imageRef = useRef<View>(null);

  // ...rest of the code remains same

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}>
          <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
          {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
        </View>
      </View>
      {/* ...rest of the code remains same */}
    </GestureHandlerRootView>
  );
}
```

위 코드에서 `collapsable` prop은 `false`로 설정했습니다. 이렇게 하면 `<View>` 컴포넌트는 background 이미지와 emoji sticker만 screenshot으로 캡처할 수 있습니다.

## Screenshot 캡처하고 저장하기

`onSaveImageAsync()` 함수 안에서 `react-native-view-shot`의 `captureRef()` 메서드를 호출해 view의 screenshot을 캡처할 수 있습니다. 이 메서드는 선택적 인수를 받아 screenshot 캡처 영역의 `width`와 `height`를 전달할 수 있습니다. 사용 가능한 옵션에 대한 더 많은 내용은 [라이브러리 문서](https://github.com/gre/react-native-view-shot#capturerefview-options-lower-level-imperative-api)에서 확인할 수 있습니다.

`captureRef()` 메서드는 screenshot URI로 이행되는 promise도 반환합니다. 이 URI를 [`MediaLibrary.saveToLibraryAsync()`](/versions/latest/sdk/media-library#medialibrarysavetolibraryasynclocaluri)에 매개변수로 전달하여 screenshot을 device의 미디어 라이브러리에 저장하겠습니다.

**app/(tabs)/index.tsx** 안에서 `onSaveImageAsync()` 함수를 아래 코드로 업데이트하세요:

```tsx
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useRef, useState } from 'react';
import { ImageSourcePropType, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { captureRef } from 'react-native-view-shot';

import Button from '@/components/Button';
import CircleButton from '@/components/CircleButton';
import EmojiList from '@/components/EmojiList';
import EmojiPicker from '@/components/EmojiPicker';
import IconButton from '@/components/IconButton';
import ImageViewer from '@/components/ImageViewer';

import EmojiSticker from '@/components/EmojiSticker';

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [pickedEmoji, setPickedEmoji] = useState<
    ImageSourcePropType | undefined
  >(undefined);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const imageRef = useRef<View>(null);

  useEffect(() => {
    if (!permissionResponse?.granted) {
      requestPermission();
    }
  }, []);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert('You did not select any image.');
    }
  };

  const onReset = () => {
    setShowAppOptions(false);
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const onSaveImageAsync = async () => {
    try {
      const localUri = await captureRef(imageRef, {
        height: 440,
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        alert('Saved!');
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}>
          <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
          {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
        </View>
      </View>
      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
          </View>
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
          <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
        </View>
      )}
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
    </GestureHandlerRootView>
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
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
```

이제 앱에서 사진을 하나 선택하고 스티커를 추가한 뒤 "Save" 버튼을 탭해 보세요. Android와 iOS에서는 아래와 같은 결과를 확인할 수 있습니다:

## 요약

7장: Screenshot 찍기

`react-native-view-shot`과 `expo-media-library`를 사용해 screenshot을 캡처하고 device의 라이브러리에 저장하는 작업을 성공적으로 구현했습니다.

다음 장에서는 웹에서도 동일한 기능을 구현할 수 있도록 모바일과 웹 플랫폼의 차이를 처리하는 방법을 배웁니다.

[다음: 플랫폼 차이 처리하기](/tutorial/platform-differences)
