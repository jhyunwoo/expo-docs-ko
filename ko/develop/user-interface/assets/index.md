---
modificationDate: February 26, 2026
title: Assets
description: 이미지, 비디오, 사운드, 데이터베이스 파일, 폰트를 포함해 프로젝트에서 정적 asset을 사용하는 방법을 알아보세요.
---

# Assets

이미지, 비디오, 사운드, 데이터베이스 파일, 폰트를 포함해 프로젝트에서 정적 asset을 사용하는 방법을 알아보세요.

**정적 asset**은 앱의 binary(네이티브 binary)와 함께 번들되는 파일입니다. 이 파일 유형은 앱 코드가 들어 있는 JavaScript bundle의 일부가 아닙니다. 정적 asset의 일반적인 유형에는 이미지, 비디오, 사운드, SQLite용 데이터베이스 파일, 폰트가 있습니다. 이러한 asset은 프로젝트에서 로컬로 제공할 수도 있고 네트워크를 통해 원격으로 제공할 수도 있습니다.

이 가이드는 프로젝트에서 asset을 로드하고 사용하는 다양한 방법을 다루며, asset을 최적화하고 minify하는 방법에 대한 추가 정보도 제공합니다.

## 로컬에서 asset 제공하기

asset이 프로젝트의 파일 시스템에 저장되어 있으면 빌드 시점에 앱 binary에 포함하거나 런타임에 로드할 수 있습니다. `require` 또는 `import` 문을 사용해 JavaScript module처럼 가져올 수 있습니다.

예를 들어 **App.js**에서 **example.png**라는 이미지를 렌더링하려면, 프로젝트의 **assets/images** 디렉터리에서 `require`로 이미지를 가져와 `<Image>` component에 전달하면 됩니다:

```tsx
<Image source={require('./assets/images/example.png')} />
```

위 예제에서 bundler는 가져온 이미지의 metadata를 읽고 너비와 높이를 자동으로 제공합니다. 자세한 내용은 [Static Image Resources](https://reactnative.dev/docs/images#static-image-resources)를 참고하세요.

`expo-image`와 `expo-file-system` 같은 라이브러리도 로컬 asset을 다룰 때 `<Image>` component와 비슷하게 동작합니다.

### asset은 로컬에서 어떻게 제공되나요?

로컬에 저장된 asset은 development 환경에서는 HTTP를 통해 제공됩니다. production 앱에서는 빌드 시점에 앱 binary에 자동으로 번들되며, 기기에서는 디스크에서 제공됩니다.

### `expo-asset` config plugin으로 빌드 시점에 asset 로드하기

빌드 시점에 asset을 로드하려면 `expo-asset` 라이브러리의 [config plugin](/versions/latest/sdk/asset#example-appjson-with-config-plugin)을 사용할 수 있습니다. 이 plugin은 네이티브 프로젝트에 asset 파일을 포함시킵니다.

`expo-asset` 라이브러리를 설치하세요.

```sh
npx expo install expo-asset
```

프로젝트의 [app config](/versions/latest/config/app#plugins) 파일에 config plugin을 추가하세요. 이 구성에는 네이티브 프로젝트에 연결할 하나 이상의 파일 또는 디렉터리 배열을 받는 [`assets`](/versions/latest/sdk/asset#configurable-properties) 속성을 사용해 asset 파일 경로가 포함되어야 합니다.

각 asset 파일의 경로는 app config 파일이 프로젝트 루트 디렉터리에 있으므로, 반드시 프로젝트 루트 기준 상대 경로여야 합니다.

```json
{
  "expo": {
    "plugins": [
      [
        "expo-asset",
        {
          "assets": ["./assets/images/example.png"]
        }
      ]
    ]
  }
}
```

config plugin으로 asset을 포함한 뒤에는 [새 development build를 만드세요](/develop/development-builds/create-a-build). 이제 `require`나 `import` 문 없이도 프로젝트에서 asset을 가져와 사용할 수 있습니다.

예를 들어 위 config plugin으로 **example.png**가 연결되어 있다면, 이를 component에 직접 가져와 resource name을 URI로 사용하면 됩니다. `require` 없이 asset을 렌더링할 때는 너비/높이를 명시적으로 제공해야 한다는 점에 유의하세요.

```tsx
import { Image } from 'expo-image';
... 

export default function HomeScreen() {
  return <Image source={{ uri: 'example' }} style={{ width: 100, height: 100 }} />;
}
```

> `expo-asset` config plugin은 여러 파일 형식을 지원합니다. 자세한 형식 목록은 [Assets API reference](/versions/latest/sdk/asset#configurable-properties)를 참고하세요. config plugin이 지원하지 않는 형식이라면 런타임에 asset을 로드하는 [`useAssets`](/develop/user-interface/assets#load-an-asset-at-runtime-with-useassets-hook) hook을 사용할 수 있습니다.

### `useAssets` hook으로 런타임에 asset 로드하기

`expo-asset` 라이브러리의 `useAssets` hook을 사용하면 asset을 비동기로 로드할 수 있습니다. 이 hook은 asset을 다운로드해 로컬에 저장하고, 로드가 완료되면 해당 asset 인스턴스 목록을 반환합니다.

`expo-asset` 라이브러리를 설치하세요.

```sh
npx expo install expo-asset
```

화면 component에서 `expo-asset` 라이브러리의 [`useAssets`](/versions/latest/sdk/asset#useassetsmoduleids) hook을 import하세요:

```tsx
import { useAssets } from 'expo-asset';

export default function HomeScreen() {
  const [assets, error] = useAssets([
    require('path/to/example-1.jpg'),
    require('path/to/example-2.png'),
  ]);

  return assets ? <Image source={assets[0]} /> : null;
}
```

## 원격으로 asset 제공하기

asset을 원격으로 제공하면 빌드 시점에 앱 binary에 번들되지 않습니다. 원격으로 호스팅되는 asset이라면 프로젝트에서 해당 리소스의 URL을 사용할 수 있습니다. 예를 들어 원격 이미지를 렌더링하려면 URL을 `<Image>` component에 전달하면 됩니다:

```jsx
import { Image } from 'expo-image';
... 

function App() {
  return (
    <Image source={{ uri: 'https://example.com/logo.png' }} style={{ width: 50, height: 50 }} />
  );
}
```

웹 URL을 통해 원격으로 제공되는 이미지의 가용성은 보장되지 않습니다. 인터넷 연결이 없을 수도 있고, asset이 삭제될 수도 있기 때문입니다.

또한 asset을 원격으로 로드할 때는 asset의 metadata를 직접 제공해야 합니다. 위 예제에서 bundler는 이미지의 너비와 높이를 가져올 수 없기 때문에, 그 값을 `<Image>` component에 명시적으로 전달합니다. 그렇지 않으면 이미지는 기본적으로 0px x 0px 크기가 됩니다.

## 추가 정보

### 수동 최적화 방법

#### 이미지

다음 도구를 사용해 이미지를 압축할 수 있습니다:

-   [`guetzli`](https://github.com/google/guetzli)
-   [`pngcrush`](https://pmt.sourceforge.io/pngcrush/)
-   [`optipng`](http://optipng.sourceforge.net/)

일부 이미지 optimizer는 lossless 방식입니다. 화면에 표시되는 픽셀을 바꾸거나 손실시키지 않으면서 이미지를 다시 인코딩해 더 작게 만듭니다. 원본 이미지의 각 픽셀이 그대로 유지되어야 한다면, PNG 같은 lossless 이미지 형식과 lossless optimizer가 좋은 선택입니다.

반대로 다른 이미지 optimizer는 lossy 방식입니다. 최적화된 이미지는 원본과 다릅니다. 보통 lossy optimizer가 더 효율적인데, 파일 크기를 줄이면서도 사람 눈에는 거의 동일하게 보이도록 시각 정보를 일부 버리기 때문입니다. `imagemagick` 같은 도구는 [SSIM](https://en.wikipedia.org/wiki/Structural_similarity) 같은 비교 알고리즘을 사용해 두 이미지가 얼마나 비슷해 보이는지 보여 줄 수 있습니다. 원본과 95% 이상 유사한 최적화 이미지가, 원본 파일 크기의 95%보다 훨씬 작아지는 일은 매우 흔합니다.

#### 다른 asset

GIF, 비디오, 혹은 코드도 이미지도 아닌 asset의 경우, 최적화와 minify는 여러분이 직접 수행해야 합니다.

> **참고**: GIF는 매우 비효율적인 형식입니다. 최신 비디오 codec은 더 나은 품질로 훨씬 작은 파일 크기를 만들 수 있습니다.

### Fonts

앱에 custom font를 추가하는 방법은 [Add a custom font](/develop/user-interface/fonts#add-a-custom-font)를 참고하세요.
