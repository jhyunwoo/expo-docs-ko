---
modificationDate: March 09, 2026
title: 리치 텍스트 편집하기
description: React Native에서 리치 텍스트를 미리 보고 편집하는 현재 접근 방식을 알아보세요.
---

# 리치 텍스트 편집하기

React Native에서 리치 텍스트를 미리 보고 편집하는 현재 접근 방식을 알아보세요.

많은 애플리케이션은 사용자가 텍스트를 입력할 수 있어야 합니다. 예를 들어 메시징 앱이나 소셜 미디어 앱을 만들고 싶다면 텍스트 입력에 크게 의존하게 될 가능성이 높습니다. React Native에는 이런 단순한 경우를 큰 노력 없이 구현할 수 있도록 기본 제공 `<TextInput>` 컴포넌트가 있습니다.

하지만 때로는 더 높은 유연성이 필요합니다. 긴 소셜 미디어 게시물, 메모 앱, 문서 편집기를 떠올려 보세요. 이상적으로는 서로 다른 텍스트 스타일, 목록, heading, embedded image 등을 허용해야 합니다. 이를 리치 텍스트 편집기라고 하며, React Native를 포함해 어느 곳에서나 해결하기 어려운 문제입니다.

현재 React Native ecosystem에는 이를 위한 기본 해법이 없습니다. 하지만 이 가이드는 각기 다른 tradeoff를 가진 몇 가지 선택지와 유망한 접근 방식을 살펴봅니다.

[시청하기: DOM 컴포넌트를 사용해 Rich Text Editor를 구현하는 방법](https://www.youtube.com/watch?v=CxORa1tXMjw) — Expo DOM 컴포넌트를 사용해 네이티브 앱 안에서 웹 기반 editor를 렌더링하는 React Native용 rich text editor를 만들어 보세요.

## 리치 텍스트 렌더링하기

리치 텍스트를 표시하는 좋은 방법은 많이 있습니다:

-   markdown 콘텐츠라면 [`react-native-markdown-display`](https://www.npmjs.com/package/react-native-markdown-display) 같은 markdown renderer를 사용할 수 있습니다.

-   HTML 콘텐츠라면 [`@expo/html-elements`](https://www.npmjs.com/package/@expo/html-elements) 또는 webview([`react-native-webview`](/versions/latest/sdk/webview))를 사용할 수 있습니다.

-   custom format과 더 많은 제어가 필요하다면 `<Text>` 컴포넌트를 중첩해 style과 layout을 렌더링할 수 있습니다.

    ```jsx
    <TextInput>
      <Text>
        <Text style={{ fontWeight: 900 }}>Some bold text</Text>Some regular text
      </Text>
    </TextInput>
    ```

-   [Expo Modules API](/modules/overview)를 사용해 Android에서는 [Markwon](https://github.com/noties/Markwon), iOS에서는 `AttributedString` 같은 third-party library를 활용한 custom renderer 컴포넌트를 네이티브 플랫폼 primitive 위에 직접 작성할 수도 있습니다.

## 리치 텍스트 편집 접근 방식

리치 텍스트 렌더링을 동작하게 하는 접근 방식은 몇 가지가 있습니다. 하지만 모두 서로 다른 제약이 있습니다.

### Webview 기반 editor

대부분의 React Native UI 컴포넌트는 네이티브 플랫폼 primitive를 감싸므로 빠르고 성능이 좋으며 결과적으로 **네이티브다운 느낌**을 줍니다. 반면 webview 기반 rich text editor는 다른 접근 방식을 사용합니다.

이들은 [`react-native-webview`](/versions/latest/sdk/webview) 안에 JavaScript로 작성된 기존 웹용 rich text editor를 감쌉니다. 모든 플랫폼(Android, iOS, Web)에서 동작하고 Web 플랫폼에서 제공되는 인기 있는 rich text editor를 활용할 수 있지만, 성능과 UX 측면의 비용이 따릅니다.

editor 내부에서는 네이티브 UI 컴포넌트를 사용할 수 없습니다. mentions나 image embedding 같은 기능을 구현하려면 기능이 중복되며, 구현에 상당한 노력이 필요합니다.

### 기존 Webview 기반 React Native 라이브러리

rich-text 편집을 지원하는 기존 React Native 라이브러리가 몇 가지 있습니다. 기본적인 rich text editor가 필요하고 설정 범위가 제한적이며, 성능이나 UX에 대한 엄격한 요구 사항이 없다면 가장 쉽게 시작할 수 있는 선택지입니다:

-   [`react-native-rich-editor`](https://github.com/wxik/react-native-rich-editor)
-   [`react-native-cn-quill`](https://github.com/imnapo/react-native-cn-quill)
-   [`@10play/tentap-editor`](https://github.com/10play/10Tap-Editor)

### custom Webview 기반 editor

더 높은 구성 가능성이 필요하다면 기존의 웹 전용 editor를 사용해 비슷한 라이브러리를 직접 만들 수 있습니다. 다만 message passing과 웹 구현을 직접 처리해야 합니다. 이렇게 하면 기반 editor가 제공하는 모든 옵션을 활용할 수 있고 더 많은 기능도 구현할 수 있습니다.

-   [Quill](https://quilljs.com/)
-   [lexical](https://github.com/facebook/lexical)
-   [slate](https://github.com/ianstormtaylor/slate)

webview와 text 및 `onChange` event를 주고받으려면 message passing을 사용해야 합니다. rich text는 대개 길어지므로 매 키 입력마다 지연이 생기지 않도록 uncontrolled component로 모델링하는 편이 낫습니다. 또한 매 키 입력마다 전체 state를 직렬화해서 보내는 일을 피할 수 있다면 성능이 더 좋아집니다.

## React Native TextInput 위에 구축하기

이 섹션에서는 일반적인 용도의 완전한 기능을 갖춘 rich text input을 만들 수 있는지 논의해 보겠습니다.

React Native는 중첩된 `<Text>` 컴포넌트를 허용하고, 이를 `<TextInput>`의 child로 사용해 styled text를 렌더링하고 편집할 수 있게 합니다. 새로운 React Native architecture에서는 이것이 동기적으로 동작합니다(`onChange` event는 text input field에 새 문자가 입력된 직후 즉시 발생합니다).

안타깝게도 `<TextInput>` 컴포넌트는 일반 텍스트 작업에 맞춰져 있으며, `onTextChange` callback에서는 문자열만 반환합니다. 이는 상당한 한계입니다.

간단한 예를 살펴보겠습니다. 우선 다음과 같은 굵은 텍스트가 포함된 text input을 렌더링해 봅시다:

```jsx
<TextInput>
  <Text>
    {/* The following will render a bold text in this format: **aa**aa */}
    <Text style={{ fontWeight: 900 }}>aa</Text>aa
  </Text>
</TextInput>
```

그다음 text input 끝에 다섯 번째 글자 `a`를 추가해 봅시다. 새 글자가 굵은 문자열의 일부인지 아닌지는 cursor 위치가 결정해야 합니다. 하지만 callback은 안타깝게도 `aaaaa`만 반환합니다.

이 정보를 얻기 위해 사용할 수 있는 추가 `onSelectionChange` prop도 있습니다. 하지만 이로 인해 작업이 훨씬 더 어려워집니다. 목록이나 bullet point를 위한 줄바꿈 같은 추가 문자를 삽입하면 selection도 비동기화됩니다.

이런 editor를 만들려는 시도는 몇 가지 있습니다. 예를 들어 [`markdown-editor`](https://github.com/shakogegia/markdown-editor)(활발히 유지보수되지 않음)와 [`rn-text-editor`](https://github.com/amjadbouhouch/rn-text-editor)(beta)가 있지만, 널리 사용되는 package는 없습니다.

## 스타일 마커가 보이는 Markdown editor

markdown을 사용해 텍스트에 스타일을 적용하는 방식이 요구 사항을 충족한다면, 편집 중에는 별도의 수정 불가능한 view에서 markdown을 렌더링할 수 있습니다. 이는 어떤 markdown renderer를 사용해도 직접 구현하기 어렵지 않습니다. [`react-native-markdown-editor`](https://github.com/kunall17/react-native-markdown-editor) 같은 third-party library를 사용할 수도 있습니다.

이 편집 경험은 power user나 프로그래밍/기술 애플리케이션에 잘 맞습니다. 선택된 텍스트 조각에서만 markdown을 보여주면서 rich text를 렌더링하거나, 그 밖의 hybrid 접근 방식도 탐색할 수 있습니다.

## 네이티브 editor

React Native module로 감싼 네이티브 Android 또는 iOS rich text editor를 사용할 수 있습니다. 몇 가지 선택지는 다음과 같습니다:

-   [`react-native-aztec`](https://github.com/WordPress/gutenberg/tree/trunk/packages/react-native-aztec)
-   [`gutenberg-mobile`](https://github.com/wordpress-mobile/gutenberg-mobile)
-   [`react-native-live-markdown`](https://github.com/Expensify/react-native-live-markdown)
-   [`react-native-enriched`](https://github.com/software-mansion-labs/react-native-enriched)

또한 [Expo Modules API](/modules/overview)를 사용해 어떤 네이티브 rich text editor든 감쌀 수 있지만, 각 플랫폼에서 서로 다른 editor를 사용한다면 API와 입력 형식을 직접 통일해야 합니다.

> 리치 텍스트는 보통 [abstract syntax tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree)를 사용해 표현합니다. 예를 들어 bullet list는 `bulleted-list` 타입의 node가 되고, 그 아래에 여러 개의 `list-item` 타입 child가 있을 수 있습니다. HTML과 markdown 모두를 적절한 AST 형식으로 변환할 수 있습니다.

lexical editor를 Android와 iOS로 port하고 React Native wrapper를 제공하려는 노력도 있으며, [여기서 추적할 수 있습니다](https://github.com/facebook/lexical/discussions/2410).

## 요약

리치 텍스트를 표시하는 훌륭한 방법은 많이 있지만, React Native에서의 리치 텍스트 편집에는 모든 경우에 맞는 단일 해법이 없습니다. 대부분의 사용 사례에 충분한 인기 있는 해법도 아직 없습니다. 기존 해법을 개선하거나 새로운 해법을 추가하려면 community의 추가 기여가 필요합니다.

현재로서는 더 많은 기능을 제공하지만 유지보수가 더 어려울 수 있는 복잡한 네이티브 editor와, `react-native` primitive 위에 구축한 editor 사이에서 신중히 선택해야 합니다. 이는 해당 기능이 앱에서 얼마나 핵심적인지, editor에 얼마나 많은 기능이 필요한지, 그리고 이를 구축하는 데 얼마나 많은 노력을 들일 의향이 있는지에 따라 달라집니다.
