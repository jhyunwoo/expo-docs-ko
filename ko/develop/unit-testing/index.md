---
modificationDate: February 26, 2026
title: Jest로 unit testing 하기
description: Jest와 함께 프로젝트에서 unit test와 snapshot test를 작성할 수 있도록 jest-expo 라이브러리를 설정하고 구성하는 방법을 알아보세요.
---

# Jest로 unit testing 하기

Jest와 함께 프로젝트에서 unit test와 snapshot test를 작성할 수 있도록 jest-expo 라이브러리를 설정하고 구성하는 방법을 알아보세요.

[Jest](https://jestjs.io)는 가장 널리 사용되는 unit test 및 snapshot JavaScript 테스트 프레임워크입니다. 이 가이드에서는 프로젝트에서 Jest를 설정하고, unit test를 작성하고, snapshot test를 작성하는 방법과 React Native에서 Jest를 사용할 때 테스트를 구조화하는 모범 사례를 배웁니다.

또한 Expo SDK의 네이티브 부분을 mock 처리하고 Expo 프로젝트에 필요한 대부분의 구성을 담당하는 Jest preset인 [`jest-expo`](https://github.com/expo/expo/tree/main/packages/jest-expo) 라이브러리도 사용합니다.

## 설치 및 구성

Expo 프로젝트를 만든 후 아래 안내에 따라 프로젝트에 `jest-expo`를 설치하고 구성하세요:

프로젝트에 `jest-expo`와 다른 필수 dev dependency를 설치합니다. 프로젝트 루트 디렉터리에서 다음 명령을 실행하세요:

```sh
npx expo install jest-expo jest @types/jest --dev
```

> **참고:** 프로젝트에서 TypeScript를 사용하지 않는다면 `@types/jest` 설치는 건너뛰어도 됩니다.

**package.json**을 열고 테스트 실행용 script를 추가한 뒤, `jest-expo`의 기본 구성을 사용할 preset도 추가하세요:

```json
{
  "scripts": {
    "test": "jest --watchAll"
    ...
```

**package.json**에서 `jest-expo`를 preset으로 추가하면 Jest 구성을 위한 기본값이 설정됩니다:

```json
{
  "jest": {
    "preset": "jest-expo"
  }
}
```

`transformIgnorePatterns`를 사용하기 위한 추가 구성

**package.json**에서 [`transformIgnorePatterns`](https://jestjs.io/docs/configuration#transformignorepatterns-arraystring)를 구성하면 프로젝트가 사용하는 node module을 transpile할 수 있습니다. 이 속성은 regex pattern을 값으로 받습니다:

```json
"jest": {
  "preset": "jest-expo",
  "transformIgnorePatterns": [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg)"
  ]
}
```

Jest에는 많은 구성 옵션이 있지만, 위 설정이면 대부분의 요구 사항을 충족할 수 있습니다. 필요하다면 이 pattern 목록에 언제든지 항목을 더 추가할 수 있습니다. 자세한 내용은 [Configuring Jest](https://jestjs.io/docs/configuration)를 참고하세요.

## React Native Testing Library 설치하기

[React Native Testing Library (`@testing-library/react-native`)](https://callstack.github.io/react-native-testing-library/)는 React Native component를 테스트하기 위한 가벼운 솔루션입니다. 유틸리티 함수를 제공하며 Jest와 함께 동작합니다.

설치하려면 다음 명령을 실행하세요:

```sh
npx expo install @testing-library/react-native --dev
```

> **Deprecated:** `@testing-library/react-native`는 더 이상 사용이 권장되지 않는 `react-test-renderer`를 대체합니다. `react-test-renderer`는 React 19 이상을 지원하지 않기 때문입니다. 현재 사용 중이라면 프로젝트에서 deprecated 라이브러리를 제거하세요. 자세한 내용은 [React 문서](https://react.dev/warnings/react-test-renderer)를 참고하세요.

## Unit test

unit test는 보통 함수 같은 가장 작은 코드 단위를 검사합니다. 첫 unit test를 작성하려면 다음 예제를 살펴보세요:

프로젝트의 **src/app** 디렉터리 안에 **index.tsx**라는 새 파일을 만들고, 간단한 component를 렌더링하는 다음 코드를 추가하세요:

```tsx
import { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const CustomText = ({ children }: PropsWithChildren) => <Text>{children}</Text>;

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <CustomText>Welcome!</CustomText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

프로젝트 루트 디렉터리에 **__tests__** 디렉터리를 만드세요. 이미 있다면 그 디렉터리를 사용하면 됩니다. 그런 다음 **home-screen-test.tsx**라는 새 파일을 만드세요. `jest-expo` preset은 **-test.ts|tsx** 확장자를 가진 파일도 테스트로 인식하도록 Jest 구성을 사용자 지정합니다.

**home-screen-test.tsx**에 다음 예제 코드를 추가하세요:

```tsx
import { render } from '@testing-library/react-native';

import HomeScreen, { CustomText } from '@/app/index';

describe('<HomeScreen />', () => {
  test('Text renders correctly on HomeScreen', () => {
    const { getByText } = render(<HomeScreen />);

    getByText('Welcome!');
  });
});
```

위 예제에서 `getByText` query는 테스트가 앱 사용자 인터페이스에서 관련 요소를 찾고, 특정 요소가 존재하는지 여부를 단언하는 데 도움을 줍니다. React Native Testing Library가 이 query를 제공하며, 각 [query variant](https://callstack.github.io/react-native-testing-library/docs/api/queries#query-variant)는 반환 타입이 다릅니다. 더 많은 예제와 자세한 API 정보는 React Native Testing Library의 [Queries API reference](https://callstack.github.io/react-native-testing-library/docs/api/queries)를 참고하세요.

테스트를 실행하려면 터미널 창에서 다음 명령을 실행하세요:

```sh
npm run test
```

테스트 1개가 통과하는 것을 보게 됩니다.

## 테스트 구조화하기

테스트 파일을 정리하는 것은 유지보수를 쉽게 만드는 데 중요합니다. 일반적인 패턴은 **__tests__** 디렉터리를 만들고 그 안에 모든 테스트를 넣는 것입니다.

**components** 디렉터리 옆에 테스트를 배치한 예시 구조는 다음과 같습니다:

`__tests__`

 `themed-text-test.tsx`

`src`

 `components`

  `themed-text.tsx`

  `themed-view.tsx`

또는 프로젝트의 영역별로 여러 **__tests__** 하위 디렉터리를 둘 수도 있습니다. 예를 들어 **components**용 테스트 디렉터리를 따로 만들 수 있습니다:

`src`

 `components`

  `themed-text.tsx`

  `__tests__`

   `themed-text-test.tsx`

 `utils`

  `index.tsx`

  `__tests__`

   `index-test.tsx`

결국은 선호도의 문제이며, 프로젝트 디렉터리를 어떻게 구성할지는 여러분이 결정하면 됩니다.

## Snapshot test

> **참고:** UI 테스트에는 snapshot unit test보다 end-to-end test를 권장합니다. [Maestro로 E2E 테스트하기](/eas/workflows/examples/e2e-tests) 가이드를 참고하세요.

[snapshot test](https://jestjs.io/docs/en/snapshot-testing)는 UI가 일관되게 유지되는지 확인하는 데 사용되며, 특히 여러 component에서 공유될 수 있는 전역 스타일을 사용하는 프로젝트에서 유용합니다.

`<HomeScreen />`에 snapshot test를 추가하려면 **home-screen-test.tsx**의 `describe()` 안에 다음 코드 조각을 추가하세요:

```tsx
describe('<HomeScreen />', () => {
  ... 

  test('CustomText renders correctly', () => {
    const tree = render(<CustomText>Some text</CustomText>).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
```

`npm run test` 명령을 실행하면 **__tests__\\__snapshots__** 디렉터리 안에 snapshot이 생성되고, 테스트 2개가 통과하는 것을 볼 수 있습니다.

## 코드 커버리지 리포트

코드 커버리지 리포트는 코드 중 얼마나 많은 부분이 테스트되고 있는지 이해하는 데 도움을 줍니다. 프로젝트에서 HTML 형식의 코드 커버리지 리포트를 보려면 **package.json**의 `jest` 아래에서 `collectCoverage`를 true로 설정하고, `collectCoverageFrom`으로 커버리지 수집 시 제외할 파일 목록을 지정하세요.

```json
"jest": {
  ...
  "collectCoverage": true,
  "collectCoverageFrom": [
    "**/*.{ts,tsx,js,jsx}",
    "!**/coverage/**",
    "!**/node_modules/**",
    "!**/babel.config.js",
    "!**/expo-env.d.ts",
    "!**/.expo/**"
  ]
}
```

`npm run test`를 실행하세요. 프로젝트에 **coverage** 디렉터리가 생성됩니다. **lcov-report/index.html**을 찾아 브라우저에서 열면 커버리지 리포트를 볼 수 있습니다.

> 보통은 **index.html** 파일을 git에 업로드하는 것을 권장하지 않습니다. 추적되지 않도록 **.gitignore** 파일에 `coverage/**/*`를 추가하세요.

## Jest 흐름 (선택 사항)

테스트를 실행할 때 서로 다른 흐름을 사용할 수도 있습니다. 아래는 시도해 볼 수 있는 script 예제 몇 가지입니다:

```json
"scripts": {
  "test": "jest --watch --coverage=false --changedSince=origin/main",
  "testDebug": "jest -o --watch --coverage=false",
  "testFinal": "jest",
  "updateSnapshots": "jest -u --coverage=false"
  ... 
}
```

자세한 내용은 Jest 문서의 [CLI Options](https://jestjs.io/docs/en/cli)를 참고하세요.

## 추가 정보

[React Native Testing library documentation](https://callstack.github.io/react-native-testing-library/docs/start/quick-start) — Jest와 함께 동작하며 좋은 테스트 관행을 장려하는 테스트 유틸리티를 제공하는 React Native Testing Library 문서를 참고하세요.

[Expo Router용 테스트 구성](/router/reference/testing) — Expo Router를 사용할 때 앱의 integration test를 만드는 방법을 알아보세요.

[EAS Workflows로 E2E 테스트하기](/eas/workflows/examples/e2e-tests) — Maestro와 함께 EAS Workflows에서 E2E 테스트를 설정하고 실행하는 방법을 알아보세요.
