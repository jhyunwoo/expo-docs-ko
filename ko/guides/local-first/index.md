---
modificationDate: March 11, 2026
title: Expo와 함께하는 Local-first 아키텍처
description: 관련 학습 자료와 도구 링크를 포함해, 부상 중인 local-first 소프트웨어 운동을 소개합니다.
---

# Expo와 함께하는 Local-first 아키텍처

관련 학습 자료와 도구 링크를 포함해, 부상 중인 local-first 소프트웨어 운동을 소개합니다.

> 이 가이드는 아직 작성 중입니다. 의견이 있다면 GitHub 저장소에서 [issue를 열어 주세요](https://github.com/expo/expo/issues/new/choose).

"local-first"라는 용어는 논문 ["Local-first software"](https://www.inkandswitch.com/local-first/)에서 처음 쓰였고, 이 논문은 연구소 [Ink & Switch](https://www.inkandswitch.com/)가 작성했습니다. 하지만 그 배경이 되는 아이디어는 훨씬 오래전부터 존재해 왔습니다. 이 아키텍처는 [Linear](https://linear.app/), [Superhuman](https://superhuman.com/), [Excalidraw](https://excalidraw.com/), 심지어 [Apple Notes](https://en.wikipedia.org/wiki/Notes_\(Apple\)) 같은 우리가 좋아하는 앱 일부를 구동하는 방식이기도 합니다.

local-first 소프트웨어에서는 "다른 컴퓨터의 가용성이 작업을 막아서는 안 됩니다"([Martin Kleppmann의 설명](https://www.youtube.com/watch?v=NMq0vncHJvU)). 오프라인일 때도 기기 내 데이터베이스에서 직접 읽고 쓸 수 있습니다. 소프트웨어가 오프라인에서도 동작할 것이라 신뢰할 수 있고, 인터넷에 연결되면 데이터가 매끄럽게 동기화되어 앱을 실행하는 어떤 기기에서든 사용할 수 있다는 것도 알 수 있습니다. 온라인 상태에서는 이 아키텍처가 [Figma가 대중화한](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/) "멀티플레이어" 앱에 특히 잘 맞습니다.

local-first가 무엇이고 어떻게 동작하는지 더 깊이 알고 싶다면 아래 [추가 자료](/guides/local-first#additional-resources)를 참고하세요.

## 왜 local-first 아키텍처를 사용하나요?

### 사용자 경험 측면의 이점

local-first 소프트웨어는 상호작용이 더 이상 네트워크에 묶여 있지 않고, 기기 안의 데이터베이스에 직접 읽고 쓸 수 있기 때문에 **빠르게** 느껴집니다.

소프트웨어가 오프라인에서도 동작할 것이라 신뢰할 수 있고, 인터넷에 연결되면 데이터가 매끄럽게 동기화되어 앱을 실행하는 어떤 기기에서든 사용할 수 있다는 점도 알 수 있습니다.

local-first 소프트웨어의 또 다른 특징은 협업 가능성입니다. 여러 기기가 같은 데이터에서 작업할 수 있고, 변경 사항은 모든 기기에 동기화됩니다. 이는 [Figma](https://www.figma.com/)에서 디자인을 함께 작업할 때처럼 실시간으로 일어날 수도 있고, Linear에서 오프라인으로 작업을 만든 뒤 다시 온라인이 되었을 때 동기화되는 것처럼 비동기적으로 일어날 수도 있습니다.

### 개발자 경험 측면의 이점

더 이상 각 네트워크 요청마다 앱의 다양한 상태, 예를 들어 "loaded", "loading", "error" 같은 상태와 그에 대응하는 UI 상태 및 기타 로직을 일일이 관리할 필요가 없습니다. 로컬 데이터베이스에 쓰기만 하면 앱이 변경 사항을 자동으로 서버에 동기화합니다. 즉, 네트워킹과 오프라인 상태를 덜 걱정하고 앱을 만드는 데 더 집중할 수 있습니다.

서버 가용성은 여전히 중요할 수 있지만, 장애가 발생해도 사용자는 앱에 계속 접근해 작업을 이어갈 수 있습니다. 심지어 서버를 거치지 않고 데이터를 동기화하는 메커니즘을 제공할 수도 있습니다.

## local-first 앱 구축의 과제

오늘날 사용할 수 있는 도구는 여전히 초기 단계에 있으므로, 지금 사용하는 도구가 이미 해결해 주었을 것이라 기대한 문제를 직접 해결하게 될 수 있습니다. 예를 들어 custom sync layer를 구현해야 하거나, 여러 사용자가 같은 데이터에 대해 작업할 때 권한을 어떻게 처리할지 스스로 판단해야 할 수 있습니다. ecosystem이 발전함에 따라 local-first 앱을 만드는 일은 더 쉬워질 것으로 기대합니다. early adopter가 되는 부담을 감당할 준비가 되어 있지 않다면, 도구가 더 성숙할 때까지 기다렸다가 local-first 도구로 앱을 만드는 편이 나을 수도 있습니다.

## local-first 앱을 만들기 위한 도구

포괄적인 도구 목록은 ["Local-first software" community website](https://localfirstweb.dev/)에서 볼 수 있습니다. 아래는 Expo에서 직접 사용해 본 경험이 있는 도구를 중심으로 더 짧게 정리한 목록입니다.

local-first 도구를 이해하는 한 가지 방법은 persistence, state management, syncing이라는 범주로 나누어 보는 것입니다. 일부 도구는 문제의 여러 측면을 다루기 때문에 여러 범주에 동시에 들어갈 수 있습니다. syncing은 다시 sync 가능한 데이터 구조와 transport layer로 세분화할 수 있습니다.

### Legend-State

[Legend-State](https://legendapp.com/open-source/state/v3/)는 더 적은 코드로 더 빠른 앱을 만들 수 있게 해주는 매우 빠른 올인원 state 및 sync 라이브러리입니다. 주요 목표는 다음과 같습니다:

-   React 앱을 위한 더 빠른 state management
-   최소한의 렌더링을 위한 세밀한 반응성
-   강력한 sync 및 persistence(Supabase 지원 내장)

Expo와 React Native에서 동작하며([`react-native-async-storage`](https://github.com/react-native-async-storage/async-storage?tab=readme-ov-file#react-native-async-storage) 경유), 이는 local-first 모바일 및 웹 앱을 만드는 데 아주 잘 맞습니다. [Legend-State Supabase example](https://github.com/expo/examples/tree/master/with-legend-state-supabase)을 사용해 시작해 보세요:

```sh
npx create-expo-app --example with-legend-state-supabase
```

### TinyBase

[TinyBase](https://tinybase.org/)는 스스로를 "local-first 앱을 위한 반응형 데이터 저장소"라고 소개합니다. 이 도구는 [Yjs](/guides/local-first#yjs), [SQLite](/guides/local-first#sqlite) 같은 가장 인기 있는 syncing 및 persistence layer와 연결되는 state management 라이브러리입니다. 데이터를 저장하고 동기화해야 하는 local-first 앱을 구축할 때 매우 좋은 선택입니다. [TinyBase example](https://github.com/expo/examples/tree/master/with-tinybase)을 사용해 시작해 보세요:

```sh
npx create-expo-app --example with-tinybase
```

TinyBase는 Expo Go와 자연스럽게 동작해 빠르게 개발할 수 있습니다. Android와 iOS에서는 데이터를 저장하기 위해 [`expo-sqlite`](/versions/latest/sdk/sqlite) 라이브러리를 사용합니다. 웹에서는 [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) API를 사용합니다. [Beto Moedano](https://github.com/betomoedano)는 아래 영상에서 [Universal Local-first Shopping List App](https://github.com/betomoedano/groceries-shopping-list-app)을 만드는 방법을 보여줍니다:

[시청하기: Expo와 TinyBase로 Local-First 실시간 쇼핑 목록 앱 만들기](https://www.youtube.com/watch?v=HqOiB2tDM8Q) — persistence와 자동 syncing을 위해 expo-sqlite와 TinyBase를 사용해 실시간 쇼핑 목록 앱을 만드세요.

### SQLite

[Expo SQLite](/versions/latest/sdk/sqlite)는 local-first 앱에서 persistence 용도로 매우 좋은 선택인 SQLite 라이브러리입니다. SQLite 앞단에 서로 다른 state management 및 syncing layer를 둘 수 있는데, 예를 들면 [`y-expo-sqlite`](https://github.com/brentvatne/y-expo-sqlite)로 [Yjs](/guides/local-first#yjs) 문서를 저장하거나, [TinyBase](/guides/local-first#tinybase)를 state management layer로 둘 수 있습니다. SQLite를 사용하는 방식은 유연하지만, 완전한 local-first 해법을 얻으려면 다른 도구와 조합하거나 직접 도구를 만들어야 합니다. 자세한 내용은 [Expo SQLite API reference](/versions/latest/sdk/sqlite)를 참고하세요.

### Yjs

[Yjs](https://github.com/yjs/yjs)는 여러 클라이언트 간에 동기화할 수 있는 데이터 타입을 제공하는 [CRDT 구현](https://github.com/yjs/yjs?tab=readme-ov-file#yjs-crdt-algorithm)입니다. Yjs로 앱을 만들고 동기화 가능한 데이터를 다룬다면, `Array`와 `Object` 대신 `Y.Array`와 `Y.Map`으로 데이터를 표현하게 됩니다. Yjs 위에 [TinyBase](/guides/local-first#tinybase) 같은 라이브러리를 state management 용도로 사용할 수 있고, persistence는 파일시스템의 JSON 파일부터 완전한 데이터베이스([`y-expo-sqlite`](https://github.com/brentvatne/y-expo-sqlite) 등)까지 다양한 도구로 처리할 수 있습니다. 자세한 내용은 [Yjs의 GitHub 저장소](https://github.com/yjs/yjs)를 참고하세요.

### Prisma

[Prisma](https://prisma.io)는 Node.js와 TypeScript 백엔드에서 가장 인기 있는 ORM으로 잘 알려져 있으며, 이제 [Expo와 React Native에서도 early access로 사용할 수 있습니다](https://www.prisma.io/blog/bringing-prisma-orm-to-react-native-and-expo). Prisma는 state management, syncing, persistence를 모두 아우르는 완전한 local-first 해법을 제공하는 것을 목표로 합니다. 아직 초기 단계이지만, [Beto Moedano](https://github.com/betomoedano)가 Prisma와 Expo를 사용해 local-first Notion 클론을 만드는 전체 과정을 정리해 두었고, [GitHub 코드도 확인할 수 있습니다](https://github.com/betomoedano/React-Native-Notion-Clone).

[시청하기: React Native Expo와 Prisma로 Local-first Notion Clone 만들기](https://www.youtube.com/watch?v=uTrPte0sCiw) — Expo용 Prisma ORM으로 state management, syncing, persistence를 포함한 local-first Notion 클론을 만드세요.

### Jazz

[Jazz.tools](https://jazz.tools/docs/react-native)는 local-first 앱을 만들기 위한 프레임워크입니다. 오픈 소스이며 Expo를 일급으로 지원하고, 직접 self-host할 수도 있고 [Jazz Cloud](https://jazz.tools/cloud)를 사용해 빠르게 시작할 수도 있습니다. [Jazz](https://jazz.tools). 더 알아보려면 [examples](https://jazz.tools/examples#react-native)를 확인하거나, 자세한 지침이 담긴 [Getting Started Guide](https://jazz.tools/docs/react-native)를 참고하세요.

### LiveStore

[LiveStore](https://docs.livestore.dev/getting-started/expo/)는 고성능 애플리케이션을 위한 client-centric local-first data layer입니다. Expo를 일급으로 지원하며, local-first 앱을 만드는 데 아주 좋은 선택입니다. [LiveStore: local-first 앱을 위한 SQLite 기반 data layer](https://expo.dev/blog/local-first-application-development-with-livestore) 블로그 글도 참고하세요.

[시청하기: LiveStore와 Expo로 local-first 네이티브 앱 만들기](https://www.youtube.com/watch?v=zQIhJqYU1Qw) — LiveStore의 SQLite 기반 data layer를 사용해 Expo로 고성능 local-first 앱을 만드세요.

### Turso

[Turso](https://turso.tech)는 SQLite 기반의 현대적인 데이터베이스 서비스입니다. 이제 진정한 local-first 경험을 가능하게 하는 [Offline Sync](https://turso.tech/blog/turso-offline-sync-public-beta)를 지원합니다. 로컬과 원격 소스 사이에서 양방향 sync와 내장 conflict detection을 사용해 데이터베이스를 동기화할 수 있습니다. 자동 conflict resolution은 아직 없지만, 이 기능만으로도 큰 진전입니다. 오늘 바로 [expo-sqlite](/versions/latest/sdk/sqlite)와 함께 Turso를 사용할 수 있습니다. 자세한 내용은 [Turso: Offline Sync Public Beta](https://turso.tech/blog/turso-offline-sync-public-beta) 블로그 글을 읽어 보세요. 예시 통합으로는 [Notes App](https://github.com/betomoedano/notes-app)을 확인할 수 있습니다.

[시청하기: Turso와 Expo로 local-first Notes App 만들기](https://www.youtube.com/watch?v=SBv32tmyb3k) — Turso의 offline sync와 expo-sqlite를 사용해 양방향 데이터 sync가 가능한 local-first 노트 앱을 만드세요.

### Instant

[Instant](https://www.instantdb.com/)는 Firebase의 현대적인 대안입니다. 프론트엔드 개발에 집중할 수 있도록 실시간 데이터베이스를 제공합니다. 시작하려면 [Getting Started Guide](https://www.instantdb.com/docs/start-rn)를 참고하세요. 아래 영상에서 소개한 [Sketch App](https://github.com/betomoedano/sketch-app)도 살펴볼 수 있습니다.

[시청하기: Expo, Instant, Reanimated로 Local-First Sketch App 만들기](https://www.youtube.com/watch?v=DEJIcaGN3vY) — Instant의 실시간 데이터베이스와 Reanimated를 사용해 부드러운 드로잉 상호작용을 갖춘 협업 스케치 앱을 만드세요.

### RxDB

[RxDB](https://rxdb.info/) (Reactive Database)는 JavaScript 애플리케이션을 위한 local-first NoSQL 데이터베이스입니다. 매우 반응적으로 동작하며, query 결과를 구독할 수 있어서 데이터가 바뀌면 UI가 자동으로 업데이트됩니다. RxDB는 오프라인에서도 동작하고 다시 온라인이 되면 동기화되는 앱을 만들기 위해 offline-first 기능에 초점을 맞춥니다. RxDB는 [SQLite storage adapter](https://rxdb.info/rx-storage-sqlite.html#usage-with-expo-sqlite)를 통해 Expo와 함께 동작하며, 이 adapter는 [`expo-sqlite`](/versions/latest/sdk/sqlite)를 감쌉니다. 또한 HTTP, GraphQL, Supabase, custom backend 등 기존 백엔드와 동기화할 수 있는 다양한 replication plugin도 제공합니다.

### 기타 도구

다음 목록은 포괄적이진 않지만, 우리가 주목했고 여러분도 흥미롭게 살펴볼 수 있을 도구를 담고 있습니다. 더 자세한 목록은 ["Local-first software" community website](https://localfirstweb.dev/)를 참고하세요.

-   [Automerge](https://automerge.org/)
-   [ElectricSQL](https://electric-sql.com/)
-   [PowerSync](https://www.powersync.com/)

## 추가 자료

-   Martin Kleppmann의 ["The past, present, and future of local-first"](https://www.youtube.com/watch?v=NMq0vncHJvU)
-   Ink & Switch의 ["Local-first software"](https://www.inkandswitch.com/local-first/)
-   ["Local-first software" community website](https://localfirstweb.dev/) 및 [YouTube의 meetup playlist](https://www.youtube.com/playlist?list=PLTbD2QA-VMnXFsLbuPGz1H-Najv9MD2-H)
-   Johannes Schickling의 [localfirst.fm podcast](https://localfirst.fm/)
