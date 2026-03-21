---
modificationDate: March 09, 2026
title: modal 만들기
description: 이 튜토리얼에서는 이미지를 선택하기 위한 React Native modal을 만드는 방법을 알아봅니다.
---

# modal 만들기

이 튜토리얼에서는 이미지를 선택하기 위한 React Native modal을 만드는 방법을 알아봅니다.

React Native는 앱의 다른 모든 내용 위에 콘텐츠를 표시하는 [`<Modal>` component](https://reactnative.dev/docs/modal)를 제공합니다. 일반적으로 modal은 사용자에게 중요한 정보에 주의를 기울이게 하거나 어떤 행동을 하도록 안내하는 데 사용됩니다. 예를 들어 [세 번째 장](/tutorial/build-a-screen#step-7-enhance-the-reusable-button-component)에서 버튼을 누른 뒤 `alert()`를 사용해 placeholder 텍스트를 표시했습니다. modal component가 overlay를 표시하는 방식이 바로 이와 같습니다.

이 장에서는 emoji picker 목록을 보여주는 modal을 만들어 보겠습니다.

[시청하기: 유니버설 Expo 앱에서 modal 만들기](https://www.youtube.com/watch?v=HRAMzrBwVeo) — React Native의 Modal API를 사용해 emoji picker를 표시하고 사용자 상호작용을 처리하는 modal component를 만듭니다.

## 버튼을 보여주기 위한 상태 변수 선언하기

modal을 구현하기 전에 버튼 세 개를 새로 추가하겠습니다. 이 버튼들은 사용자가 media library에서 이미지를 고르거나 placeholder 이미지를 사용한 뒤에 보입니다. 이 버튼들 중 하나가 emoji picker modal을 실행하게 됩니다.

**app/(tabs)/index.tsx** 안에서:

1.  modal을 여는 버튼과 몇 가지 다른 옵션을 표시하거나 숨기기 위한 boolean 상태 변수 `showAppOptions`를 선언합니다. 앱 화면이 로드될 때는 이미지를 고르기 전 옵션이 보이지 않도록 `false`로 설정합니다. 사용자가 이미지를 고르거나 placeholder 이미지를 사용할 때는 `true`로 설정합니다.
2.  사용자가 이미지를 고른 뒤 `showAppOptions` 값을 `true`로 설정하도록 `pickImageAsync()` 함수를 업데이트합니다.
3.  theme가 없는 버튼에 아래 값으로 `onPress` prop을 추가합니다.

```tsx
import { View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

import Button from '@/components/Button';
import ImageViewer from '@/components/ImageViewer';

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);

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

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
      </View>
      {showAppOptions ? (
        <View />
      ) : (
        <View style={styles.footerContainer}>
          <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
          <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
        </View>
      )}
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

위 코드 조각에서는 `showAppOptions` 값에 따라 `Button` component를 렌더링하고, 버튼들을 ternary operator 블록 안으로 옮겼습니다. `showAppOptions` 값이 `true`이면 빈 `<View>` component를 렌더링합니다. 이 상태는 다음 단계에서 다루겠습니다.

이제 `Button` component에서 `alert`를 제거하고, **components/Button.tsx**에서 두 번째 버튼을 렌더링할 때 `onPress` prop을 다음과 같이 업데이트할 수 있습니다:

```tsx
<Pressable style={styles.button} onPress={onPress}>
```

## 버튼 추가하기

이 장에서 구현할 옵션 버튼들의 레이아웃을 나눠서 살펴봅시다. 디자인은 다음과 같습니다:

이는 행 방향으로 정렬된 세 개의 버튼을 가진 부모 `<View>`를 포함합니다. 가운데에 있는 더하기 icon(+) 버튼은 modal을 열며 다른 두 버튼과 다른 스타일을 가집니다.

**components** 디렉터리 안에 새 **CircleButton.tsx** 파일을 만들고 다음 코드를 추가하세요:

```tsx
import { View, Pressable, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type Props = {
  onPress: () => void;
};

export default function CircleButton({ onPress }: Props) {
  return (
    <View style={styles.circleButtonContainer}>
      <Pressable style={styles.circleButton} onPress={onPress}>
        <MaterialIcons name="add" size={38} color="#25292e" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  circleButtonContainer: {
    width: 84,
    height: 84,
    marginHorizontal: 60,
    borderWidth: 4,
    borderColor: '#ffd33d',
    borderRadius: 42,
    padding: 3,
  },
  circleButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 42,
    backgroundColor: '#fff',
  },
});
```

더하기 icon을 렌더링하기 위해 이 버튼은 `@expo/vector-icons` 라이브러리의 `<MaterialIcons>` icon set을 사용합니다.

다른 두 버튼도 `<MaterialIcons>`를 사용해 수직 정렬된 text label과 icon을 표시합니다. **components** 디렉터리 안에 **IconButton.tsx**라는 파일을 만드세요. 이 component는 세 개의 prop을 받습니다:

-   `icon`: `MaterialIcons` 라이브러리 icon에 대응되는 이름입니다.
-   `label`: 버튼에 표시되는 text label입니다.
-   `onPress`: 사용자가 버튼을 누를 때 호출되는 함수입니다.

```tsx
import { Pressable, StyleSheet, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
};

export default function IconButton({ icon, label, onPress }: Props) {
  return (
    <Pressable style={styles.iconButton} onPress={onPress}>
      <MaterialIcons name={icon} size={24} color="#fff" />
      <Text style={styles.iconButtonLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonLabel: {
    color: '#fff',
    marginTop: 12,
  },
});
```

**app/(tabs)/index.tsx** 안에서:

1.  `CircleButton`과 `IconButton` component를 import해 표시합니다.
2.  이 버튼들을 위한 placeholder 함수 세 개를 추가합니다. `onReset()` 함수는 사용자가 reset 버튼을 눌렀을 때 호출되며, image picker 버튼이 다시 보이게 만듭니다. 다른 두 함수의 기능은 나중에 추가하겠습니다.

```tsx
import { View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

import Button from '@/components/Button';
import ImageViewer from '@/components/ImageViewer';
import IconButton from '@/components/IconButton';
import CircleButton from '@/components/CircleButton';

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);

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
    // we will implement this later
  };

  const onSaveImageAsync = async () => {
    // we will implement this later
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
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

이제 Android, iOS, 웹에서 앱을 살펴봅시다:

## emoji picker modal 만들기

modal은 사용자가 사용 가능한 emoji 목록에서 emoji를 선택할 수 있게 해줍니다. **components** 디렉터리 안에 **EmojiPicker.tsx** 파일을 만드세요. 이 component는 세 개의 prop을 받습니다:

-   `isVisible`: modal 표시 여부 상태를 결정하는 boolean입니다.
-   `onClose`: modal을 닫는 함수입니다.
-   `children`: 나중에 emoji 목록을 표시하는 데 사용됩니다.

```tsx
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { PropsWithChildren } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
}>;

export default function EmojiPicker({ isVisible, children, onClose }: Props) {
  return (
    <View>
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.modalContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Choose a sticker</Text>
          <Pressable onPress={onClose}>
            <MaterialIcons name="close" color="#fff" size={22} />
          </Pressable>
        </View>
        {children}
      </View>
    </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    height: '25%',
    width: '100%',
    backgroundColor: '#25292e',
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: 'absolute',
    bottom: 0,
  },
  titleContainer: {
    height: '16%',
    backgroundColor: '#464C55',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontSize: 16,
  },
});
```

위 코드가 무엇을 하는지 살펴봅시다:

-   `<Modal>` component는 title과 닫기 버튼을 표시합니다.
-   `visible` prop은 `isVisible` 값을 받아 modal이 열릴지 닫힐지를 제어합니다.
-   `transparent` prop은 boolean 값이며, modal이 전체 view를 채울지 여부를 결정합니다.
-   `animationType` prop은 화면에 들어오고 나갈 때의 방식을 결정합니다. 여기서는 화면 아래에서 위로 슬라이드됩니다.
-   마지막으로 `<EmojiPicker>`는 사용자가 닫기 `<Pressable>`을 눌렀을 때 `onClose` prop을 호출합니다.

이제 **app/(tabs)/index.tsx**를 수정해 봅시다:

1.  `<EmojiPicker>` component를 import합니다.
2.  `useState` hook으로 `isModalVisible` 상태 변수를 만듭니다. 기본값은 `false`이며, 사용자가 버튼을 눌러 열기 전까지 modal을 숨깁니다.
3.  사용자가 버튼을 눌렀을 때 `isModalVisible` 변수를 `true`로 업데이트하도록 `onAddSticker()` 함수의 주석을 바꿉니다. 이렇게 하면 emoji picker가 열립니다.
4.  `isModalVisible` 상태 변수를 업데이트하는 `onModalClose()` 함수를 만듭니다.
5.  `Index` component의 맨 아래에 `<EmojiPicker>` component를 배치합니다.

```tsx
import { View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

import Button from '@/components/Button';
import ImageViewer from '@/components/ImageViewer';
import IconButton from '@/components/IconButton';
import CircleButton from '@/components/CircleButton';
import EmojiPicker from '@/components/EmojiPicker';

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

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
    // we will implement this later
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
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
        {/* Emoji list component will go here */}
      </EmojiPicker>
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

이 단계까지의 결과는 다음과 같습니다:

## emoji 목록 표시하기

이제 modal 안의 콘텐츠에 가로 방향 emoji 목록을 추가해 봅시다. 이를 위해 React Native의 [`<FlatList>`](https://reactnative.dev/docs/flatlist) component를 사용하겠습니다.

**components** 디렉터리 안에 **EmojiList.tsx** 파일을 만들고 다음 코드를 추가하세요:

```tsx
import { useState } from 'react';
import { ImageSourcePropType, StyleSheet, FlatList, Platform, Pressable } from 'react-native';
import { Image } from 'expo-image';

type Props = {
  onSelect: (image: ImageSourcePropType) => void;
  onCloseModal: () => void;
};

export default function EmojiList({ onSelect, onCloseModal }: Props) {
  const [emoji] = useState<ImageSourcePropType[]>([
    require("../assets/images/emoji1.png"),
    require("../assets/images/emoji2.png"),
    require("../assets/images/emoji3.png"),
    require("../assets/images/emoji4.png"),
    require("../assets/images/emoji5.png"),
    require("../assets/images/emoji6.png"),
  ]);

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={Platform.OS === 'web'}
      data={emoji}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item, index }) => (
        <Pressable
          onPress={() => {
            onSelect(item);
            onCloseModal();
          }}>
          <Image source={item} key={index} style={styles.image} />
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 20,
  },
});
```

위 코드가 무엇을 하는지 살펴봅시다:

-   위의 `<FlatList>` component는 `Image` component를 사용해 모든 emoji 이미지를 렌더링하며, 각각은 `<Pressable>`로 감싸져 있습니다. 나중에는 사용자가 화면에서 emoji를 탭하면 이미지 위에 스티커처럼 나타나도록 이를 개선할 것입니다.
-   또한 `data` prop 값으로 `emoji` 배열 변수가 제공하는 item 배열을 받습니다. `renderItem` prop은 `data`에서 item을 받아 목록 안의 item을 반환합니다. 마지막으로 이 item을 표시하기 위해 `Image`와 `<Pressable>` component를 추가했습니다.
-   `horizontal` prop은 목록을 세로가 아니라 가로로 렌더링합니다. `showsHorizontalScrollIndicator`는 React Native의 `Platform` module을 사용해 값을 확인하고 웹에서 가로 스크롤 막대를 표시합니다.

이제 **app/(tabs)/index.tsx**를 업데이트해 `<EmojiList>` component를 import하고 `<EmojiPicker>` component 안의 주석을 다음 코드 조각으로 바꾸세요:

```tsx
import { ImageSourcePropType, View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

import Button from '@/components/Button';
import ImageViewer from '@/components/ImageViewer';
import IconButton from '@/components/IconButton';
import CircleButton from '@/components/CircleButton';
import EmojiPicker from '@/components/EmojiPicker';
import EmojiList from '@/components/EmojiList';

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [pickedEmoji, setPickedEmoji] = useState<ImageSourcePropType | undefined>(undefined);

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
    // we will implement this later
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
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

`EmojiList` component에서 `onSelect` prop은 emoji를 선택하며, 선택한 뒤 `onCloseModal`이 modal을 닫습니다.

이제 Android, iOS, 웹에서 앱을 살펴봅시다:

## 선택한 emoji 표시하기

이제 emoji 스티커를 이미지 위에 올려 보겠습니다. **components** 디렉터리 안에 새 파일을 만들고 **EmojiSticker.tsx**라고 이름 붙이세요. 그런 다음 다음 코드를 추가하세요:

```tsx
import { ImageSourcePropType, View } from 'react-native';
import { Image } from 'expo-image';

type Props = {
  imageSize: number;
  stickerSource: ImageSourcePropType;
};

export default function EmojiSticker({ imageSize, stickerSource }: Props) {
  return (
    <View style={{ top: -350 }}>
      <Image source={stickerSource} style={{ width: imageSize, height: imageSize }} />
    </View>
  );
}
```

이 component는 두 개의 prop을 받습니다:

-   `imageSize`: `Index` component 안에서 정의한 값입니다. 다음 장에서 이미지가 탭될 때 크기를 조절하는 데 이 값을 사용할 것입니다.
-   `stickerSource`: 선택한 emoji 이미지의 source입니다.

이 component를 **app/(tabs)/index.tsx** 파일에서 import하고, `Index` component를 업데이트해 이미지 위에 emoji 스티커를 표시하세요. `pickedEmoji` 상태가 `undefined`가 아닌지 확인하겠습니다:

```tsx
import { ImageSourcePropType, View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

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
    // we will implement this later
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
        {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
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

이제 Android, iOS, 웹에서 앱을 살펴봅시다:

## 요약

5장: modal 만들기

emoji picker modal을 성공적으로 만들었고, emoji를 선택해 이미지 위에 표시하는 로직도 구현했습니다.

다음 장에서는 gesture를 사용한 사용자 상호작용을 추가해 emoji를 드래그하고 탭으로 크기를 조절해 보겠습니다.

[다음: gesture 추가하기](/tutorial/gestures)
