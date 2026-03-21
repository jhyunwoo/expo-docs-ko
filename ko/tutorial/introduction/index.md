---
modificationDate: December 18, 2024
title: '튜토리얼: React Native와 Expo 사용하기'
description: Expo를 사용해 Android, iOS, 웹에서 실행되는 universal 앱을 만드는 방법을 다루는 React Native 튜토리얼 소개입니다.
---

# 튜토리얼: React Native와 Expo 사용하기

Expo를 사용해 Android, iOS, 웹에서 실행되는 universal 앱을 만드는 방법을 다루는 React Native 튜토리얼 소개입니다.

이제 universal 앱을 만드는 여정을 시작하려고 합니다. 이 튜토리얼에서는 하나의 코드베이스로 Android, iOS, 웹에서 모두 실행되는 Expo 앱을 만들어 보겠습니다. 시작해 봅시다!

## React Native와 Expo 튜토리얼 소개

이 튜토리얼의 목표는 Expo를 시작하고 Expo SDK에 익숙해지는 것입니다. 다음과 같은 주제를 다룹니다:

-   TypeScript가 활성화된 기본 템플릿으로 앱 만들기
-   Expo Router로 두 화면짜리 bottom tabs 레이아웃 구현하기
-   앱 레이아웃을 분석하고 flexbox로 구현하기
-   각 플랫폼의 시스템 UI를 사용해 미디어 라이브러리에서 이미지 선택하기
-   React Native의 `<Modal>`과 `<FlatList>` 컴포넌트를 사용해 스티커 modal 만들기
-   스티커와 상호작용할 수 있도록 터치 gesture 추가하기
-   서드파티 라이브러리를 사용해 screenshot을 찍고 디스크에 저장하기
-   Android, iOS, 웹 간 플랫폼 차이 처리하기
-   마지막으로 status bar, splash screen, icon을 구성하는 과정을 거쳐 앱 완성하기

이 주제들은 Expo 앱을 만드는 기초를 배우는 데 필요한 기반을 제공합니다. 이 튜토리얼은 자기 주도형으로 진행되며, 완료하는 데 최대 두 시간이 걸릴 수 있습니다.

초보자도 쉽게 따라올 수 있도록 튜토리얼을 아홉 개 장으로 나누었습니다. 따라서 그대로 따라오거나 중간에 멈췄다가 나중에 다시 이어서 볼 수 있습니다. 각 장에는 단계를 완료하는 데 필요한 코드 조각이 포함되어 있으므로, 처음부터 앱을 직접 만들면서 따라오거나 코드를 복사해 붙여 넣을 수 있습니다.

시작하기 전에 우리가 만들 앱을 먼저 살펴보세요. 이 앱의 이름은 **StickerSmash**이며 Android, iOS, 웹에서 실행됩니다:

> 이 튜토리얼의 전체 source code는 [GitHub](https://github.com/expo/examples/tree/master/stickersmash)에서 확인할 수 있습니다.

## 이 튜토리얼을 사용하는 방법

우리는 [직접 해보며 배우기](https://en.wikipedia.org/wiki/Learning-by-doing)를 중요하게 생각하므로, 이 튜토리얼은 설명보다 실제로 해보는 데 더 초점을 맞춥니다. 처음부터 앱을 직접 만들면서 앱을 완성해 가는 여정을 함께 따라올 수 있습니다.

튜토리얼 전반에서 중요한 코드나 예제 사이에서 변경된 코드는 초록색으로 강조됩니다. 강조된 부분에 마우스를 올리거나(데스크톱), 탭하면(모바일) 변경 사항에 대해 더 알아볼 수 있습니다. 예를 들어 아래 코드 조각에서 강조된 부분은 해당 코드가 무엇을 하는지 설명합니다:

```tsx
import { StyleSheet, Text, View } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Hello world!</Text>
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

## 다음 단계

이제 앱을 만들 준비가 되었습니다.

[시작하기](/tutorial/create-your-first-app) — 새 Expo 앱을 만드는 것부터 시작해 봅시다.
