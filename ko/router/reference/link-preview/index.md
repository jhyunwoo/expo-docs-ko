---
modificationDate: October 06, 2025
title: Link preview
description: Expo Router를 사용할 때 iOS에서 link에 preview를 추가하는 방법을 알아보세요.
---

# Link preview

Expo Router를 사용할 때 iOS에서 link에 preview를 추가하는 방법을 알아보세요.

> Link preview는 SDK 54 이상에서 사용할 수 있는 iOS 전용 기능입니다.

Link preview(일명 "Peek and Pop")는 iOS에서 흔히 사용되는 기능으로, link가 가리키는 screen의 preview popup을 사용자에게 보여줍니다. 이 가이드는 iOS용 앱에서 link preview를 추가하고 커스터마이징하는 방법을 보여줍니다.

앱에 link가 있다면, link의 콘텐츠를 [`Link.Trigger`](/versions/latest/sdk/router#linktrigger)로 바꾸고 여기에 [`Link.Preview`](/versions/latest/sdk/router#linkpreview) component를 추가해 link preview를 넣을 수 있습니다. 이렇게 하면 link가 가리키는 page의 preview가 생성됩니다.

```tsx
import { Link } from 'expo-router';

export default function Page() {
  return (
    <Link href="/about">
      <Link.Trigger>About</Link.Trigger>
      <Link.Preview />
    </Link>
  );
}
```

## Customizing the link preview

기본적으로 link preview는 전체 크기의 page snapshot으로 렌더링됩니다. 이 동작을 커스터마이징하는 방법은 여러 가지가 있습니다.

### Custom size

`width`와 `height`를 사용해 선호하는 preview 크기를 제안할 수 있습니다. 시스템은 이 선호값을 고려하지만, 사용 가능한 공간이나 플랫폼 동작에 따라 이를 덮어쓸 수 있습니다.

```tsx
<Link href="...">
  <Link.Trigger>Content</Link.Trigger>
  <Link.Preview style={{ width: 300, height: 200 }} />
</Link>
```

다음 예시는 iOS에서 custom link preview 크기를 보여줍니다:

### Custom preview

기본 preview를 보여주고 싶지 않다면 `Link.Preview` component에 children으로 custom content를 전달할 수 있습니다. 이 custom content는 link target의 기본 preview를 대체합니다.

```tsx
export default function Page() {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const { width } = useWindowDimensions();
  const previewHeight = (width / imageSize.width) * imageSize.height;

  return (
    <Link href="/about">
      <Link.Trigger>About</Link.Trigger>
      <Link.Trigger>Content</Link.Trigger>
      <Link.Preview style={{ width, height: previewHeight }}>
        <Image
          onLoad={e => setImageSize(e.nativeEvent.source)}
          source={source}
          style={{ width: '100%', height: '100%' }}
        />
      </Link.Preview>
    </Link>
  );
}
```

다음 예시는 iOS에서 custom link preview를 보여줍니다:

## Menu

preview 옆에 context menu를 렌더링하려면 [`Link.Menu`](/versions/latest/sdk/router#linkmenu)를 추가하고 그 안에 [`Link.MenuAction`](/versions/latest/sdk/router#linkmenuaction) child를 넣으세요.

```tsx
<Link href="/about">
  <Link.Trigger>About</Link.Trigger>
  <Link.Menu>
    <Link.MenuAction title="Share" icon="square.and.arrow.up" onPress={handleSharePress} />
    <Link.MenuAction title="Block" icon="nosign" destructive onPress={handleBlockPress} />
  </Link.Menu>
</Link>
```

다음 예시는 iOS에서 custom link preview를 보여줍니다:

### Icons

[SF Symbols](https://developer.apple.com/sf-symbols/)를 사용해 각 menu action에 icon을 지정할 수 있습니다.

```tsx
<Link href="/about">
  <Link.Trigger>About</Link.Trigger>
  <Link.Menu>
    <Link.MenuAction title="Share" icon="square.and.arrow.up" onPress={handleSharePress} />
    <Link.MenuAction title="Block" icon="nosign" onPress={handleBlockPress} />
    <Link.MenuAction
      title="Follow"
      icon="person.crop.circle.badge.plus"
      onPress={handleFollowPress}
    />
    <Link.MenuAction title="Copy" icon="doc.on.doc" onPress={handleCopyPress} />
  </Link.Menu>
</Link>
```

다음 예시는 iOS에서 서로 다른 icon을 사용하는 네 개의 요소가 들어 있는 context menu를 보여줍니다:

### Nested menus

다른 menu 안에 [`Link.Menu`](/versions/latest/sdk/router#linkmenu)를 배치해 menu를 중첩할 수 있습니다:

```jsx
<Link href="...">
  <Link.Trigger>About</Link.Trigger>
  <Link.Menu>
    <Link.MenuAction title="Share" icon="square.and.arrow.up" onPress={() => {}} />
    <Link.Menu title="More" icon="ellipsis">
      <Link.MenuAction title="Copy" icon="doc.on.doc" onPress={() => {}} />
      <Link.MenuAction title="Delete" icon="trash" destructive onPress={() => {}} />
    </Link.Menu>
  </Link.Menu>
</Link>
```

다음 예시는 iOS에서 중첩된 context menu를 보여줍니다:

### More customization options

사용 가능한 모든 customization option을 살펴보려면 [`Link.MenuAction`](/versions/latest/sdk/router#linkmenuaction)의 API 문서를 참고하세요.

## Detecting if component is in preview

preview 안에서 렌더링될 수도 있는 component를 만들고 있다면 [`useIsPreview()`](/versions/latest/sdk/router#useispreview) hook을 사용해 그에 맞게 동작을 조정할 수 있습니다:

```jsx
function MyComponent() {
  // This will be true if component/screen is being rendered inside a preview
  const isInsidePreview = useIsPreview();

  return isInsidePreview ? <Text>From within preview</Text> : <Text>I am outside of preview</Text>;
}
```

## Known limitations

### `replace` not supported

[`replace`](/versions/latest/sdk/router#replace) 모드에서 link preview를 사용하는 것은 현재 **지원되지 않습니다**. preview는 기본 [`push`](/versions/latest/sdk/router#push) navigation 모드에서만 사용할 수 있습니다.

### JavaScript tabs and slots

native tabs가 아닌 JavaScript tabs나 [`Slot`](/versions/latest/sdk/router#slot) 안에서 navigation할 때는 preview 전환 animation이 다소 어색하게 보일 수 있습니다. 이는 네이티브 preview animation은 즉시 시작되는데 React 렌더링은 지연되기 때문입니다. 이 문제를 막으려면 native tabs와 stack navigator를 사용하세요.

### Missing `Link.Trigger`

preview나 context menu가 있는 `Link`를 렌더링하면서 `Link.Trigger`를 넣지 않으면 예외가 발생합니다. preview 모드에서 `Link` 안에 `Link.*`가 아닌 component를 직접 배치하는 경우에도 마찬가지입니다.

### Multiple `Link.Trigger` children with `asChild` prop

`asChild` prop과 함께 `Link`를 사용할 때는 `Link.Trigger`에 **하나의** child만 지정할 수 있습니다. `onPress` event는 그 child 하나에게만 전달됩니다.

### Changing href while preview is open

preview가 열려 있는 동안 `href` prop의 path를 동적으로 바꾸는 것은 **지원되지 않습니다**. query parameter만 동적으로 수정할 수 있습니다.
