---
modificationDate: March 09, 2026
title: Stack Toolbar
description: Expo Router에서 Stack navigation과 함께 iOS toolbar를 사용하는 방법을 알아보세요.
---

# Stack Toolbar

Expo Router에서 Stack navigation과 함께 iOS toolbar를 사용하는 방법을 알아보세요.

> `Stack.Toolbar`는 **iOS 전용**으로 **Expo SDK 55** 이상에서 사용할 수 있는 alpha API입니다. 이 API는 호환성이 깨지는 변경이 생길 수 있습니다.

[`Stack.Toolbar`](/versions/latest/sdk/router#stacktoolbar)를 사용하면 Stack screen에 네이티브 iOS toolbar item을 추가할 수 있습니다. 버튼, 메뉴, 커스텀 view를 header(왼쪽 또는 오른쪽)나 하단 toolbar 영역에 배치할 수 있습니다.

## Adding header buttons

navigation header에 버튼을 추가하려면 `Stack.Toolbar` 안에서 [`Stack.Toolbar.Button`](/versions/latest/sdk/router#stacktoolbarbutton)을 `placement="right"` 또는 `placement="left"`와 함께 사용하세요. 즐겨찾기, 공유, 콘텐츠 편집 같은 작업에 유용합니다.

```tsx
import { useState } from 'react';
import { Stack } from 'expo-router';
import { View, Text, Alert } from 'react-native';

export default function NoteScreen() {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon={isFavorite ? 'star.fill' : 'star'}
          onPress={() => setIsFavorite(!isFavorite)}
        />
        <Stack.Toolbar.Button icon="square.and.arrow.up" onPress={() => Alert.alert('Share')} />
      </Stack.Toolbar>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button icon="sidebar.left" onPress={() => Alert.alert('Sidebar')} />
      </Stack.Toolbar>

      <View style={{ flex: 1, padding: 16 }}>
        <Text>Note content...</Text>
      </View>
    </>
  );
}
```

## Icons

toolbar 버튼은 SF Symbols와 커스텀 이미지, 두 가지 icon 유형을 지원합니다.

### SF Symbols

icon을 추가하는 가장 쉬운 방법은 Apple의 내장 icon 라이브러리인 [SF Symbols](https://developer.apple.com/sf-symbols/)를 사용하는 것입니다. symbol 이름을 `icon` prop에 바로 전달하세요:

```tsx
<Stack.Toolbar.Button icon="star.fill" onPress={() => {}} />
<Stack.Toolbar.Button icon="square.and.arrow.up" onPress={() => {}} />
<Stack.Toolbar.Menu icon="ellipsis.circle">{/* ... */}</Stack.Toolbar.Menu>
```

사용 가능한 symbol은 Apple의 SF Symbols 앱에서 찾아볼 수 있습니다.

### Custom images

커스텀 이미지를 사용할 수도 있습니다. header toolbar(`placement="left"` 또는 `placement="right"`)에서는 이미지 source를 `icon` prop에 직접 전달하세요.

> header placement 안의 submenu(`Stack.Toolbar.Menu`)에서 커스텀 이미지를 사용하려면 `react-native-screens` 4.24.0 이상이 필요합니다. SDK 55에는 `~4.23.0`이 번들되어 있으므로, 이 기능을 사용하려면 `react-native-screens@~4.24.0`을 수동으로 설치해야 합니다.

```tsx
import { Stack } from 'expo-router';

export default function Page() {
  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button icon={require('./assets/expo.png')} onPress={() => {}} />
      </Stack.Toolbar>
      {/* Screen content */}
    </>
  );
}
```

하단 toolbar에서는 `expo-image`의 `useImage` hook을 사용하고, 그 결과를 `image` prop으로 전달하세요:

```tsx
import { Stack } from 'expo-router';
import { useImage } from 'expo-image';

export default function Page() {
  const customIcon = useImage('https://simpleicons.org/icons/expo.svg', {
    maxWidth: 24,
    maxHeight: 24,
  });

  return (
    <>
      <Stack.Toolbar>
        <Stack.Toolbar.Button image={customIcon} onPress={() => {}} />
      </Stack.Toolbar>
      {/* Screen content */}
    </>
  );
}
```

> 하단 toolbar의 커스텀 이미지에 사용하는 `useImage` 및 `image` prop 패턴은 임시 API이며, 이후 릴리스에서 변경될 수 있습니다.

## Building action menus

screen에 여러 action이 있다면 [`Stack.Toolbar.Menu`](/versions/latest/sdk/router#stacktoolbarmenu)를 사용해 dropdown menu로 묶으세요:

```tsx
import { useState } from 'react';
import { Stack } from 'expo-router';
import { Alert } from 'react-native';

export default function EmailScreen() {
  const [isArchived, setIsArchived] = useState(false);

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Menu icon="ellipsis.circle">
          <Stack.Toolbar.MenuAction
            icon="arrowshape.turn.up.left"
            onPress={() => Alert.alert('Reply')}>
            Reply
          </Stack.Toolbar.MenuAction>

          <Stack.Toolbar.MenuAction
            icon="arrowshape.turn.up.right"
            onPress={() => Alert.alert('Forward')}>
            Forward
          </Stack.Toolbar.MenuAction>

          <Stack.Toolbar.MenuAction
            icon={isArchived ? 'tray.full' : 'archivebox'}
            isOn={isArchived}
            onPress={() => setIsArchived(!isArchived)}>
            {isArchived ? 'Unarchive' : 'Archive'}
          </Stack.Toolbar.MenuAction>

          <Stack.Toolbar.MenuAction icon="trash" destructive onPress={() => Alert.alert('Delete')}>
            Delete
          </Stack.Toolbar.MenuAction>
        </Stack.Toolbar.Menu>
      </Stack.Toolbar>
      {/* Email content */}
    </>
  );
}
```

[`Stack.Toolbar.MenuAction`](/versions/latest/sdk/router#stacktoolbarmenuaction)의 `isOn` prop은 action 옆에 checkmark를 표시하므로 toggle 상태에 유용합니다. `destructive` prop은 action을 빨간색으로 표시해 위험한 작업임을 나타냅니다.

### Nested submenus

더 복잡한 menu가 필요하면 `Stack.Toolbar.Menu`를 다른 menu 안에 중첩하세요. submenu item을 접지 않고 바로 표시하려면 `inline` prop을 사용합니다:

```tsx
import { useState } from 'react';
import { Stack } from 'expo-router';

export default function EmailScreen() {
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('name');
  const [showHiddenFiles, setShowHiddenFiles] = useState(false);

  return (
    <>
      <Stack.Toolbar>
        <Stack.Toolbar.Menu icon="ellipsis.circle">
          {/* Inline submenu - options appear directly in the menu */}
          <Stack.Toolbar.Menu inline title="Sort By">
            <Stack.Toolbar.MenuAction isOn={sortBy === 'name'} onPress={() => setSortBy('name')}>
              Name
            </Stack.Toolbar.MenuAction>
            <Stack.Toolbar.MenuAction isOn={sortBy === 'date'} onPress={() => setSortBy('date')}>
              Date
            </Stack.Toolbar.MenuAction>
            <Stack.Toolbar.MenuAction isOn={sortBy === 'size'} onPress={() => setSortBy('size')}>
              Size
            </Stack.Toolbar.MenuAction>
          </Stack.Toolbar.Menu>

          {/* Nested submenu - opens as a separate menu */}
          <Stack.Toolbar.Menu title="Preferences">
            <Stack.Toolbar.MenuAction
              isOn={showHiddenFiles}
              onPress={() => setShowHiddenFiles(!showHiddenFiles)}>
              Show Hidden Files
            </Stack.Toolbar.MenuAction>
          </Stack.Toolbar.Menu>
        </Stack.Toolbar.Menu>
      </Stack.Toolbar>
      {/* Email content */}
    </>
  );
}
```

## Using the bottom toolbar

iOS 앱은 주요 action을 위한 하단 toolbar를 두는 경우가 많습니다. 추가하려면 placement prop 없이 `Stack.Toolbar`를 사용하세요(기본값은 `"bottom"`입니다):

```tsx
import { Stack } from 'expo-router';
import { Alert } from 'react-native';

export default function PhotosScreen() {
  return (
    <>
      <Stack.Toolbar>
        <Stack.Toolbar.Button icon="photo.on.rectangle" onPress={() => Alert.alert('Select')}>
          Select
        </Stack.Toolbar.Button>
        <Stack.Toolbar.Spacer />
        <Stack.Toolbar.Button icon="plus" onPress={() => Alert.alert('Add')}>
          Add
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
    </>
  );
}
```

[`Stack.Toolbar.Spacer`](/versions/latest/sdk/router#stacktoolbarspacer)는 item 사이에 유연한 공간을 만들어, item이 toolbar 양 끝으로 밀려나게 합니다. toolbar 양쪽 끝에 버튼을 두는 레이아웃을 만들 때 사용하는 방법입니다.

> 하단 toolbar는 layout 파일이 아니라 page component 안에서만 사용할 수 있습니다.

## Adding badges to buttons

header toolbar에서는 개수나 상태를 나타내는 badge를 추가할 수 있습니다. [`Stack.Toolbar.Icon`](/versions/latest/sdk/router#stacktoolbaricon), [`Stack.Toolbar.Label`](/versions/latest/sdk/router#stacktoolbarlabel), [`Stack.Toolbar.Badge`](/versions/latest/sdk/router#stacktoolbarbadge)를 사용해 버튼 콘텐츠를 조합하세요:

```tsx
import { Stack } from 'expo-router';

export default function InboxScreen() {
  const unreadCount = 5;

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button onPress={() => {}}>
          <Stack.Toolbar.Icon sf="bell" />
          <Stack.Toolbar.Label>Notifications</Stack.Toolbar.Label>
          {unreadCount > 0 && <Stack.Toolbar.Badge>{String(unreadCount)}</Stack.Toolbar.Badge>}
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
      {/* Screen content */}
    </>
  );
}
```

> badge는 header placement(`left` 또는 `right`)에서만 동작하며, 하단 toolbar에서는 사용할 수 없습니다.

## Embedding custom views

버튼과 menu만으로 부족하다면 [`Stack.Toolbar.View`](/versions/latest/sdk/router#stacktoolbarview)를 사용해 원하는 React Native component를 embed하세요:

```tsx
import { Stack } from 'expo-router';
import { Pressable, Alert } from 'react-native';
import { SymbolView } from 'expo-symbols';

export default function SearchScreen() {
  return (
    <>
      <Stack.Toolbar>
        <Stack.Toolbar.View>
          <Pressable
            style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => {
              Alert.alert('Filter pressed');
            }}>
            <SymbolView name="line.3.horizontal.decrease.circle" size={24} />
          </Pressable>
        </Stack.Toolbar.View>
      </Stack.Toolbar>
      {/* Screen content */}
    </>
  );
}
```

## Showing and hiding items dynamically

state에 따라 toolbar item을 토글하려면 `hidden` prop을 사용하세요:

```tsx
import { useState } from 'react';
import { Stack } from 'expo-router';

export default function DocumentScreen() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button hidden={isEditing} icon="pencil" onPress={() => setIsEditing(true)} />
        <Stack.Toolbar.Button hidden={!isEditing} onPress={() => setIsEditing(false)}>
          Done
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
      {/* Document content */}
    </>
  );
}
```

## Common problems

Liquid glass toolbar buttons flicker in dark mode on iOS 26

liquid glass 스타일의 toolbar 버튼은 iOS 26의 dark mode에서 screen 사이를 이동할 때 배경이 깜빡이거나 번쩍일 수 있습니다. React Navigation의 기본 theme가 시스템 dark mode와 일치하지 않아 liquid glass 렌더링에 시각적 artifact가 생기기 때문입니다.

문제를 해결하려면 루트 layout을 `@react-navigation/native`의 `<ThemeProvider>`로 감싸고, 알맞은 theme를 사용하세요:

```tsx
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack />
    </ThemeProvider>
  );
}
```
White background flashes when navigating between screens

screen 전환 사이에 흰색이 번쩍 보인다면 navigation stack이 밝은 배경을 사용하고 있는데 앱은 dark theme를 사용하고 있다는 뜻인 경우가 많습니다. screen에 toolbar item이 들어 있으면 이 현상은 toolbar 스타일과 대비되어 더 두드러지게 보입니다.

문제를 해결하려면 루트 layout을 React Navigation의 `<ThemeProvider>`로 감싸고 적절한 theme를 전달하세요:

```tsx
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack />
    </ThemeProvider>
  );
}
```
Large title does not collapse when scrolling

`headerLargeTitle: true`(또는 `<Stack.Screen.Title large>`)를 `Stack.Toolbar`와 함께 사용할 때 large title이 scroll에 따라 접히지 않을 수 있습니다. scroll 가능한 view가 screen component의 직접적인 첫 번째 자식이 아닐 때 이런 일이 발생합니다.

문제를 해결하려면 `ScrollView` 또는 `FlatList`가 screen component가 렌더링하는 첫 번째 자식이 되도록 하세요. wrapper가 필요하다면 그 wrapper에 `collapsable={false}`를 설정하세요:

```tsx
import { Stack } from 'expo-router';
import { ScrollView, View, Text } from 'react-native';

export default function Home() {
  return (
    <ScrollView>
      <Stack.Screen.Title large>Home</Stack.Screen.Title>
      <Text>Content here</Text>
    </ScrollView>
  );
}
```

`ScrollView`를 감싸야 한다면 wrapper에 `collapsable={false}`를 설정하세요:

```tsx
import { Stack } from 'expo-router';
import { ScrollView, View, Text } from 'react-native';

export default function Home() {
  return (
    <View collapsable={false}>
      <ScrollView>
        <Stack.Screen.Title large>Home</Stack.Screen.Title>
        <Text>Content here</Text>
      </ScrollView>
    </View>
  );
}
```

## Known limitations

iOS only

`Stack.Toolbar`는 iOS에서만 사용할 수 있습니다. Android와 web에서는 이 component가 렌더링되지 않습니다.

Bottom toolbar only in page components

하단 toolbar는 layout 파일이 아니라 page component 안에서만 사용할 수 있습니다. 하단 toolbar는 특정 screen의 콘텐츠와 연결되어야 하기 때문입니다.

Cannot nest toolbars

`Stack.Toolbar` component를 서로 안에 중첩할 수는 없습니다.

Badge only in header placements

`Stack.Toolbar.Badge`는 `placement="left"` 또는 `placement="right"`를 사용할 때만 지원됩니다. 하단 toolbar에서는 badge가 표시되지 않습니다.

## Learn more

사용 가능한 모든 prop을 포함한 전체 API 문서는 [`Stack.Toolbar` API reference](/versions/latest/sdk/router#stacktoolbar)를 참고하세요.
