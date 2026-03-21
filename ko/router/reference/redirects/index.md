---
modificationDate: July 10, 2024
title: Redirects
description: Expo Router에서 URL을 리디렉션하는 방법을 알아보세요.
---

# Redirects

Expo Router에서 URL을 리디렉션하는 방법을 알아보세요.

앱 내부의 어떤 기준에 따라 요청을 다른 URL로 리디렉션할 수 있습니다. Expo Router는 여러 가지 리디렉션 패턴을 지원합니다.

## Using `Redirect` component

`Redirect` component를 사용하면 특정 screen에서 즉시 리디렉션할 수 있습니다:

```tsx
import { View, Text } from 'react-native';
import { Redirect } from 'expo-router';

export default function Page() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <View>
      <Text>Welcome Back!</Text>
    </View>
  );
}
```

## Using `useRouter` hook

`useRouter` hook을 사용해 imperative하게 리디렉션할 수도 있습니다:

```tsx
import { Text } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';

function MyScreen() {
  const router = useRouter();

  useFocusEffect(() => {
    // Call the replace method to redirect to a new route without adding to the history.
    // We do this in a useFocusEffect to ensure the redirect happens every time the screen
    // is focused.
    router.replace('/profile/settings');
  });

  return <Text>My Screen</Text>;
}
```
