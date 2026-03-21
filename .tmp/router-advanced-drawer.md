---
modificationDate: February 26, 2026
title: Drawer
description: Learn how to use the Drawer layout in Expo Router.
---

# Drawer

Learn how to use the Drawer layout in Expo Router.

A navigation drawer is a common pattern in mobile apps, it allows users to swipe open a menu from a side of their screen to expose navigation options. This menu is also typically toggleable through a button in the app's header.

## Installation

To use [drawer navigator](https://reactnavigation.org/docs/drawer-based-navigation) you'll need to install some additional dependencies if you do not have them already. On Android and iOS, the drawer navigator requires `react-native-reanimated` and `react-native-worklets` to drive its animations. On web, this is handled by CSS animations.

```sh
npx expo install @react-navigation/drawer react-native-reanimated react-native-worklets
```

## Usage

Now you can use the `Drawer` layout to create a drawer navigator.

```tsx
import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return <Drawer />;
}
```

To edit the drawer navigation menu labels, titles and screen options specific screens are required as follows:

```tsx
import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <Drawer>
      <Drawer.Screen
        name="index" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: 'Home',
          title: 'overview',
        }}
      />
      <Drawer.Screen
        name="user/[id]" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: 'User',
          title: 'overview',
        }}
      />
    </Drawer>
  );
}
```
