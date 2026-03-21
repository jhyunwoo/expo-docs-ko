---
modificationDate: February 05, 2026
title: Convex 사용하기
description: Convex로 앱에 데이터베이스를 추가하세요.
---

# Convex 사용하기

Convex로 앱에 데이터베이스를 추가하세요.

[Convex](https://www.convex.dev/)는 cluster 관리, SQL, ORM이 필요 없는 TypeScript 기반 데이터베이스입니다. Convex는 WebSocket을 통한 실시간 업데이트를 제공하므로 반응형 앱에 매우 잘 맞습니다.

## Convex 설치하기

[Expo 프로젝트](/get-started/create-a-project)를 만든 뒤, 다음 명령으로 `convex`를 설치하세요:

```sh
npx expo install convex
```

## Convex dev deployment 설정하기

다음 명령을 실행해 Convex 프로젝트를 설정하세요:

```sh
npx convex dev
```

이 명령은 다음을 수행합니다:

-   Convex 계정을 만들거나 로그인할 수 있게 해줍니다.
-   Convex에 프로젝트를 생성합니다.
-   production 및 deployment URL을 저장합니다.

또한 Convex가 호스팅할 백엔드 API 함수를 작성할 수 있는 **convex/** 폴더도 생성합니다.

이 명령이 Convex cloud의 dev deployment와 함수를 동기화할 수 있도록 하나의 터미널 창에서 계속 실행해 두세요.

## Convex URL을 EAS 환경 변수로 저장하기

`npx convex dev`를 실행하면 deployment URL이 **.env.local** 파일에 `EXPO_PUBLIC_CONVEX_URL`로 저장됩니다. 앱 빌드에서 사용할 수 있게 하려면 새로운 터미널 세션에서 이를 [EAS environment variable](/eas/environment-variables)로 추가하세요:

```sh
eas env:create --name EXPO_PUBLIC_CONVEX_URL --value https://YOUR_DEPLOYMENT_URL.convex.cloud --visibility plaintext --environment production --environment preview --environment development
```

`https://YOUR_DEPLOYMENT_URL.convex.cloud`를 **.env.local** 파일의 `EXPO_PUBLIC_CONVEX_URL` 값으로 바꾸세요. 자세한 내용은 [Environment variables](/guides/environment-variables)를 참고하세요.

## 데이터베이스 seed하기

다음으로, 아래 sample data로 **sampleData.jsonl** 파일을 만드세요:

```json
{"text": "Buy groceries", "isCompleted": true}
{"text": "Go for a swim", "isCompleted": true}
{"text": "Integrate Convex", "isCompleted": false}
```

이 데이터를 Convex로 보내려면 다음을 실행하세요:

```sh
npx convex import --table tasks sampleData.jsonl
```

## 데이터베이스 query하기

Convex의 모든 query는 TypeScript 코드입니다. 다음 내용으로 **convex/tasks.ts** 파일을 만드세요:

```ts
import { query } from './_generated/server';

export const get = query({
  args: {},
  handler: async ctx => {
    return await ctx.db.query('tasks').collect();
  },
});
```

## 앱 연결하기

앱의 최상위 **src/app/_layout.tsx** 파일에서 `ConvexReactClient`를 만들고, 컴포넌트 트리를 감싸는 `ConvexProvider`에 전달하세요:

```tsx
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { Stack } from 'expo-router';

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  return (
    <ConvexProvider client={convex}>
      <Stack>
        <Stack.Screen name="index" />
      </Stack>
    </ConvexProvider>
  );
}
```

## 앱에서 데이터 표시하기

앱에서 `useQuery` hook을 사용해 `api.tasks.get` API에서 데이터를 가져오세요:

```tsx
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { Text, View } from 'react-native';

export default function Index() {
  const tasks = useQuery(api.tasks.get);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {tasks?.map(({ _id, text }) => (
        <Text key={_id}>{text}</Text>
      ))}
    </View>
  );
}
```

## Next steps

[Convex 사용법 알아보기](https://docs.convex.dev/tutorial/) — 채팅 앱을 만들면서 Convex가 어떻게 동작하는지 알아보세요.
