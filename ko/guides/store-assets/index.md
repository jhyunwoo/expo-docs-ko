---
modificationDate: June 17, 2025
title: 앱 스토어 에셋 만들기
description: 앱 스토어 페이지용 스크린샷과 미리보기를 만드는 방법을 알아보세요.
---

# 앱 스토어 에셋 만들기

앱 스토어 페이지용 스크린샷과 미리보기를 만드는 방법을 알아보세요.

앱을 Google Play Store와 Apple App Store에 제출하기 전에, 스토어 목록 페이지에 필요한 몇 가지 에셋을 준비해야 합니다. 이 이미지와 동영상의 목적은 잠재 사용자에게 앱 경험이 어떤 느낌일지 감을 주는 것입니다.

두 앱 스토어 모두에 앱 스크린샷을 업로드해야 합니다. 두 스토어 모두 이를 "app screenshots"라고 부르지만, 이 이미지에는 실제 앱의 정확한 화면이 _반드시_ 포함되어야 합니다. 다만 이 이미지가 특정 기기에서 촬영한 스크린샷이어야 한다고 명시한 규칙은 없습니다.

두 앱 스토어 모두 이미지 형식과 크기에 대한 요구 사항이 있습니다. 하지만 이러한 제한 안에서는 창의성을 발휘할 수 있습니다. 예를 들어 흔한 접근 방식은 Figma 같은 디자인 도구로 에셋을 디자인하고, 실제 앱 스크린샷(또는 디자인)에 보조 메시지를 결합하는 것입니다.

## "스크린샷"을 만드는 여러 접근 방식

스토어 스크린샷을 만드는 데에는 일반적으로 세 가지 접근 방식이 사용됩니다. 앱의 필요와 리소스에 가장 잘 맞는 방법을 선택할 수 있습니다.

### Option 1: 실제 스크린샷

가장 단순한 방법은 실제 기기에서 앱을 열고 스크린샷을 찍는 것입니다.

**장점**: 만들기 간단합니다. 앱을 가장 정확하게 보여줍니다.

**단점**: 전체 스크린샷 세트를 만들려면 다양한 기기에서 앱을 실행해야 합니다.

Expo Go Apple App Store Listing Page의 스크린샷.

### Option 2: 디자인 안에 넣는 스크린샷

대부분의 앱은 이 방식을 사용합니다. 앱의 스크린샷을 찍거나(또는 경우에 따라 실제 스크린샷 대신 기존 디자인을 사용해) 적절한 메시지와 함께 스토어 에셋 안에 배치하는 방식입니다.

**장점:** 에셋 안에서 추가 메시지를 전달할 수 있습니다.

**단점:** 디자인 프로그램을 사용해 에셋을 제작해야 합니다.

Brex Apple App Store Listing Page의 스크린샷.

### Option 3: 더 화려하게 만들기

이 방법에서는 앱 스토어 페이지에서 앱 디자인 요소와 창의적인 메시지를 활용해 제품을 강조할 수 있습니다.

**장점:** 스토어 페이지를 창의적이고 재미있게 만들 수 있습니다.

**단점:** 에셋을 만들고 유지관리할 숙련된 디자이너가 필요합니다.

MS Office Apple Store Listing Page의 스크린샷.

## Google Play Store 에셋 요구 사항

Google은 Apple과는 다른 스토어 에셋 형식 및 크기 요구 사항을 갖고 있습니다. 최신 사양은 Google Play Store 에셋에 대한 자세한 요구 사항이 정리된 [공식 문서](https://support.google.com/googleplay/android-developer/answer/9866151)를 참고하세요.

[스토어 에셋 Figma 템플릿](https://www.figma.com/community/file/1352686667495694112) — 최소 에셋 요구 사항 요약을 위한 템플릿을 참고하세요.

### App icon

Apple App Store에서는 앱 아이콘이 항상 앱 번들에서 자동으로 가져와지지만, Google Play Store에서는 스토어 목록용 별도의 App Icon도 직접 업로드해야 합니다.

### Feature graphic

Store Listing을 게시하려면 feature graphic을 제공해야 합니다. 이것은 스토어 목록 페이지 상단에 표시되는 배너입니다.

### Screenshots

앱을 게시하려면 최소 네 장의 스크린샷을 업로드해야 합니다.

### Video (optional)

Store Listing에 preview video 하나를 추가할 수 있습니다. 동영상은 YouTube에 업로드되어 있어야 하며, **preview video** 필드에 YouTube URL을 입력해서 추가할 수 있습니다.

## iOS App Store 에셋 요구 사항

iOS App Store에는 스크린샷(이미지)과 미리보기(동영상)를 업로드할 수 있습니다. 각각에 대해 Apple은 특정 너비와 높이를 요구합니다. 정확한 크기는 Apple의 [Screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications/)를 반드시 참고하세요. 픽셀이 단 하나만 어긋나도 이미지를 제출할 수 없습니다.

[스토어 에셋 Figma 템플릿](https://www.figma.com/community/file/1352686667495694112) — 최소 에셋 요구 사항 요약을 위한 템플릿을 참고하세요.

### Screenshots

최소 기준으로 Apple은 dynamic island가 있는 iPhone(6.9인치)용 스크린샷 업로드를 요구합니다. 다른 화면 크기에 대한 추가 스크린샷은 선택적으로 업로드할 수 있습니다. 특정 스크린샷이 제공되지 않으면, 가장 가까운 업로드 크기에서 축소된 스크린샷이 대신 사용됩니다.

앱이 iPad에서 실행된다면 iPad 스크린샷(13인치) 한 세트도 제공해야 합니다.

현지화별로 최대 10장의 스크린샷을 업로드할 수 있습니다. 앱이 여러 언어로 제공되고 스크린샷에 텍스트가 포함되어 있다면, 각 현지화에 맞는 언어의 스크린샷을 업로드해야 합니다.

스크린샷은 세로 또는 가로 방향일 수 있습니다.

### Preview (optional)

앱이 어떻게 동작하는지 보여주기 위해 app preview video를 포함할 수 있습니다. 화면 크기별로 최대 세 개의 app preview를 추가할 수 있습니다.

동영상 크기와 형식 요약은 Apple 문서의 [App Preview Specifications](https://developer.apple.com/help/app-store-connect/reference/app-preview-specifications/)를 참고하세요.

## Bare minimum

아래는 앱을 게시하는 데 필요한 최소한의 항목입니다.

### Play Store - Android

| Type | Amount | Dimensions | Requirements |
| --- | --- | --- | --- |
| App Icon | 1 | 512 × 512 | 32-bit PNG (with alpha); Maximum file size: 1024 KB |
| Feature Graphic | 1 | 1024 × 500 | JPEG or 24-bit PNG (no alpha) |
| Screenshots | 4-10 | minimum: 1024 × 500maximum width: 3840px9:16 aspect ratio | JPEG or 24-bit PNG (no alpha) |

### App Store - iPhone

| Type | Amount | Dimensions (choose one) | Requirements |
| --- | --- | --- | --- |
| Screenshots (iPhone with the dynamic island) | 2-10 | 1320 × 28681290 × 2796 | JPG or PNG (no alpha) |

### App Store - iPad

앱이 iPad에서도 실행된다면 추가 스크린샷을 제공해야 합니다.

| Type | Amount | Dimensions (choose one) | Requirements |
| --- | --- | --- | --- |
| Screenshots | 2-10 | 2064 × 27522048 × 2732 | JPG or PNG (no alpha) |
