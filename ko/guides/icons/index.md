---
modificationDate: February 17, 2026
title: Expo Vector Icons
description: react native vector icons, custom icon font, icon image, icon button을 포함해 Expo 앱에서 다양한 종류의 icon을 사용하는 방법을 알아보세요.
---

# Expo Vector Icons

react native vector icons, custom icon font, icon image, icon button을 포함해 Expo 앱에서 다양한 종류의 icon을 사용하는 방법을 알아보세요.

모든 앱이 icon에 emoji를 써야 하는 것은 아닙니다. FontAwesome, Glyphicons, Ionicons 같은 icon font를 통해 인기 있는 icon set을 사용할 수도 있고, [The Noun Project](https://thenounproject.com/)에서 PNG를 고를 수도 있습니다. 이 가이드는 Expo 앱에서 icon을 사용하는 여러 방법을 설명합니다.

## `@expo/vector-icons`

`@expo/vector-icons` 라이브러리는 `npx create-expo-app`을 사용하는 template 프로젝트에 기본으로 설치되며 `expo` package의 일부입니다. 이 라이브러리는 [`react-native-vector-icons`](https://github.com/oblador/react-native-vector-icons)를 기반으로 만들어졌고 비슷한 API를 사용합니다. [icons.expo.fyi](https://icons.expo.fyi)에서 찾아볼 수 있는 인기 있는 icon set도 포함되어 있습니다.

다음 예시의 컴포넌트는 `Ionicons` font를 로드하고 checkmark icon을 렌더링합니다:

```jsx
import { View, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function App() {
  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-circle" size={32} color="green" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

> Expo의 [모든 custom font](/develop/user-interface/fonts#use-a-local-font-file)와 마찬가지로, 앱을 렌더링하기 전에 icon font를 미리 로드할 수 있습니다. font object는 font 컴포넌트의 static property로 제공됩니다. 따라서 위 사례에서는 `Ionicons.font`이며, 이는 `{ionicons: require('path/to/ionicons.ttf')}`로 평가됩니다.

## Custom icon font

custom icon font를 사용하려면 먼저 프로젝트에 이를 import하세요. font가 로드된 뒤에만 Icon set을 만들 수 있습니다. [custom font 로드에 대해 더 알아보세요](/develop/user-interface/fonts#handle-expovector-icons-initial-load).

`@expo/vector-icons`는 icon set 생성을 돕는 세 가지 method를 제공합니다:

### `createIconSet`

`createIconSet` method는 key가 icon 이름이고 value가 UTF-8 문자 또는 그 문자 코드인 `glyphMap`을 기반으로 custom font를 반환합니다.

아래 예시에서는 `glyphMap` object를 정의한 다음 `createIconSet` method의 첫 번째 인수로 전달합니다. 두 번째 인수 `fontFamily`는 font 이름입니다(파일 이름이 아님). 선택적으로 Android 지원을 위한 세 번째 인수(custom font 파일 이름)를 전달할 수 있습니다.

```jsx
import createIconSet from '@expo/vector-icons/createIconSet';

const glyphMap = { 'icon-name': 1234, test: '∆' };
const CustomIcon = createIconSet(glyphMap, 'fontFamily', 'custom-icon-font.ttf');

export default function CustomIconExample() {
  return <CustomIcon name="icon-name" size={32} color="red" />;
}
```

### `createIconSetFromIcoMoon`

`createIconSetFromIcoMoon` method는 [IcoMoon](https://icomoon.io/) config 파일을 기반으로 custom font를 만드는 데 사용됩니다. **selection.json**과 **.ttf**를 프로젝트 안, 가능하면 **assets** 디렉터리에 저장한 다음 `expo-font`의 `useFonts` hook 또는 `Font.loadAsync` method를 사용해 font를 로드해야 합니다.

> **IcoMoon app 버전:** [새 IcoMoon app](https://icomoon.io/new-app)은 [기존 IcoMoon app](https://icomoon.io/app)과 다른 JSON 형식을 export합니다. 현재 `createIconSetFromIcoMoon` 함수는 기존 app의 출력만 지원합니다. 새 형식 지원을 추가하는 [GitHub Pull Request](https://github.com/expo/vector-icons/pull/356)를 참고하세요. 이 지원은 `@expo/vector-icons`에 릴리스되면 동작합니다.

다음은 `useFonts` hook을 사용해 font를 로드하는 예시입니다:

```jsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import createIconSetFromIcoMoon from '@expo/vector-icons/createIconSetFromIcoMoon';

const Icon = createIconSetFromIcoMoon(
  require('./assets/icomoon/selection.json'),
  'IcoMoon',
  'icomoon.ttf'
);

export default function App() {
  const [fontsLoaded] = useFonts({
    IcoMoon: require('./assets/icomoon/icomoon.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Icon name="pacman" size={50} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

### `createIconSetFromFontello`

`createIconSetFromFontello` method는 [Fontello](http://fontello.com/) config 파일을 기반으로 custom font를 만드는 데 사용됩니다. **config.json**과 **.ttf**를 프로젝트 안의 적절한 위치, 가능하면 **assets** 디렉터리에 저장한 다음 `expo-font`의 `useFonts` hook 또는 `Font.loadAsync` method를 사용해 font를 로드해야 합니다.

예시에서 보듯 `createIconSetFromIcoMoon`과 비슷한 구성을 따릅니다:

```js
// Import the createIconSetFromFontello method
import createIconSetFromFontello from '@expo/vector-icons/createIconSetFromFontello';

// Import the config file
import fontelloConfig from './config.json';

// Both the font name and files exported from Fontello are most likely called "fontello".
// Ensure this is the `fontname.ttf` and not the file path.
const Icon = createIconSetFromFontello(fontelloConfig, 'fontello', 'fontello.ttf');
```

## Button 컴포넌트

`Font`가 `@expo/vector-icons`에서 import한 icon set일 때, `Font.Button` 문법을 사용해 Icon Button을 만들 수 있습니다.

아래 예시에서는 로그인 버튼이 `FontAwesome` icon set을 사용합니다. `FontAwesome.Button` 컴포넌트는 버튼이 눌렸을 때의 action을 처리하는 props를 받을 수 있고, 버튼 텍스트도 감쌀 수 있다는 점에 주목하세요.

```jsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function App() {
  const loginWithFacebook = () => {
    console.log('Button pressed');
  };

  return (
    <View style={styles.container}>
      <FontAwesome.Button name="facebook" backgroundColor="#3b5998" onPress={loginWithFacebook}>
        Login with Facebook
      </FontAwesome.Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

### 속성

다음 속성 외에도 모든 [`Text`](http://reactnative.dev/docs/text), [`TouchableHighlight`](http://reactnative.dev/docs/touchablehighlight), [`TouchableWithoutFeedback`](http://reactnative.dev/docs/touchablewithoutfeedback) 속성을 사용할 수 있습니다:

| Prop | Description | Default |
| --- | --- | --- |
| `color` | 텍스트와 icon 색상입니다. 서로 다른 색이 필요하다면 `iconStyle`을 사용하거나 `Text` 컴포넌트를 중첩하세요. | `white` |
| `size` | Icon 크기입니다. | `20` |
| `iconStyle` | icon에만 적용되는 스타일입니다. margin이나 다른 색상을 지정할 때 좋습니다. _참고: margin에는 `iconStyle`을 사용하세요. 그렇지 않으면 동작이 불안정할 수 있습니다._ | `{marginRight: 10}` |
| `backgroundColor` | 버튼의 배경색입니다. | `#007AFF` |
| `borderRadius` | 버튼의 border radius입니다. 비활성화하려면 `0`으로 설정하세요. | `5` |
| `onPress` | 버튼이 눌렸을 때 호출되는 함수입니다. | _없음_ |
