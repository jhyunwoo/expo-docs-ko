---
modificationDate: March 09, 2026
title: 플랫폼 차이 처리하기
description: 이 튜토리얼에서는 universal 앱을 만들 때 native와 web 사이의 플랫폼 차이를 처리하는 방법을 배웁니다.
---

# 플랫폼 차이 처리하기

이 튜토리얼에서는 universal 앱을 만들 때 native와 web 사이의 플랫폼 차이를 처리하는 방법을 배웁니다.

Android, iOS, 웹은 서로 다른 기능을 제공합니다. 우리의 경우 Android와 iOS는 모두 `react-native-view-shot` 라이브러리로 screenshot을 찍을 수 있습니다. 하지만 웹 브라우저는 그렇지 않습니다.

이 장에서는 앱이 모든 플랫폼에서 동일한 기능을 갖도록 웹 브라우저에서 screenshot을 찍는 방법을 처리하는 법을 배우겠습니다.

[시청하기: universal Expo 앱에서 플랫폼 차이 처리하기](https://www.youtube.com/watch?v=mEKQvF4irBM) — dom-to-image를 이용한 플랫폼별 screenshot 캡처 구현으로 Android, iOS, 웹 사이의 플랫폼 차이를 처리합니다.

## dom-to-image 설치하고 import하기

웹에서 screenshot을 찍어 이미지로 저장하려면 [`dom-to-image`](https://github.com/tsayen/dom-to-image#readme)라는 서드파티 라이브러리를 사용하겠습니다. 이 라이브러리는 어떤 DOM node든 screenshot으로 찍어서 vector(SVG) 또는 raster(PNG, JPEG) 이미지로 바꿔 줍니다.

development server를 중지하고 아래 명령을 실행해 라이브러리를 설치하세요:

```sh
npm install dom-to-image
```

> **Note:** 여기서는 설명을 위해 `dom-to-image` 라이브러리를 사용합니다. production 앱에서는 구체적인 사용 사례에 더 적합한 다른 솔루션이나 API를 검토해 보는 것이 좋습니다.

설치한 뒤 development server를 다시 시작하고 터미널에서 w를 누르세요.

## 플랫폼별 코드 추가하기

React Native의 `Platform` 모듈을 사용하면 플랫폼별 동작을 구현할 수 있습니다. **app/(tabs)/index.tsx** 안에서 다음을 수행하세요:

1.  `react-native`에서 `Platform` 모듈을 import합니다.
2.  `dom-to-image`에서 `domtoimage` 라이브러리를 import합니다.
3.  `onSaveImageAsync()` 함수를 업데이트해 `Platform.OS` 속성으로 현재 플랫폼이 `'web'`인지 확인합니다. `'web'`이라면 `domtoimage.toJpeg()` 메서드를 사용해 현재 `<View>`를 JPEG 이미지로 변환하고 캡처합니다. 그렇지 않다면 native 플랫폼용으로 추가했던 기존 로직을 계속 사용합니다.

```tsx
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useRef, useState } from 'react';
import { ImageSourcePropType, View, StyleSheet, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { captureRef } from 'react-native-view-shot';
import domtoimage from 'dom-to-image';

import Button from '@/components/Button';
import ImageViewer from '@/components/ImageViewer';
import IconButton from '@/components/IconButton';
import CircleButton from '@/components/CircleButton';
import EmojiPicker from '@/components/EmojiPicker';
import EmojiList from '@/components/EmojiList';
import EmojiSticker from '@/components/EmojiSticker';

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [pickedEmoji, setPickedEmoji] = useState<ImageSourcePropType | undefined>(undefined);
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
    if (Platform.OS !== 'web') {
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
    } else {
      try {
        const dataUrl = await domtoimage.toJpeg(imageRef.current, {
          quality: 0.95,
          width: 320,
          height: 440,
        });

        let link = document.createElement('a');
        link.download = 'sticker-smash.jpeg';
        link.href = dataUrl;
        link.click();
      } catch (e) {
        console.log(e);
      }
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

`dom-to-image` TypeScript module 오류 수정하기

TypeScript를 사용하고 있으므로 `domtoimage` 라이브러리를 import한 뒤 type definition을 추가해야 합니다. 이를 위해 프로젝트 루트 디렉터리에 **types.d.ts** 파일을 만들고 아래 선언문을 추가합니다:

```tsx
declare module 'dom-to-image';
```

이제 웹 브라우저에서 앱을 실행하면 screenshot을 저장할 수 있습니다:

## 요약

8장: 플랫폼 차이 처리하기

앱은 우리가 의도한 기능을 모두 수행하므로, 이제는 순수하게 미적인 부분으로 초점을 옮길 때입니다..

다음 장에서는 앱의 status bar, splash screen, app icon을 사용자 지정하겠습니다.

[다음: status bar, splash screen, app icon 구성하기](/tutorial/configuration)
