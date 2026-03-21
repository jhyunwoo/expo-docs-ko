---
modificationDate: January 27, 2026
title: EAS Metadata용 스키마
description: EAS Metadata의 store config reference입니다.
---

# EAS Metadata용 스키마

EAS Metadata의 store config reference입니다.

> **EAS Metadata**는 beta 상태이며 호환성이 깨지는 변경이 생길 수 있습니다.

EAS Metadata의 store config에는 그렇지 않으면 앱 스토어 대시보드를 통해 수동으로 제공해야 하는 정보가 들어 있습니다. 이 문서는 store config 안 객체의 구조를 설명합니다.

> [VS Code Expo Tools extension](https://github.com/expo/vscode-expo#readme)을 사용하면 에디터 안에서 자동 완성, 제안, 경고를 통해 이 모든 정보를 확인할 수 있습니다.

## Config schema

store config 객체에서 핵심 속성 중 하나는 `configVersion` 속성입니다. 앱 스토어는 앱을 게시하기 위해 더 많은 정보를 요구하거나 기존 정보 구조를 변경할 수 있습니다. 이 속성은 하위 호환되지 않는 변경을 버전으로 관리하는 데 도움을 줍니다.

현재 EAS Metadata는 _Apple App Store만_ 지원합니다.

| Property | Type | Description |
| --- | --- | --- |
| `configVersion` | `number`. enum: 0 | EAS Metadata store configuration schema 버전입니다. |
| `apple` | `object`. | App Store에 대해 설정 가능한 모든 속성입니다. |
| `version` | `string`. | store config에 정의된 모든 metadata를 동기화할 때 사용할 앱 버전입니다. 기본적으로 EAS Metadata는 앱 스토어에서 사용 가능한 최신 버전을 선택합니다. |
| `copyright` | `string`. | 앱의 독점 권리를 소유한 개인 또는 법인의 이름이며, 권리를 취득한 연도가 앞에 붙습니다. (예: `"2008 Acme Inc."`) |
| `advisory` | [AppleAdvisory](#apple-advisory). | 앱의 연령 등급을 결정하기 위한 App Store 설문입니다. |
| `categories` | [AppleCategories](#apple-categories). | 앱의 App Store 카테고리입니다. 기본, 보조, 그리고 가능한 하위 카테고리를 추가할 수 있습니다. |
| `info` | Map<[AppleLanguage](#apple-info), [AppleInfo](#apple-info)\>. | 앱의 현지화된 App Store 노출 정보입니다. |
| `release` | [AppleRelease](#apple-release). | 선택한 버전에 대한 앱 출시 전략입니다. |
| `review` | [AppleReview](#apple-review). | App Store 심사팀이 앱을 검토하는 데 필요한 모든 정보입니다. 연락처 정보와 자격 증명도 포함됩니다. (해당하는 경우) |

### Apple advisory

Apple은 앱의 [연령 등급](https://help.apple.com/app-store-connect/#/dev599d50efb)을 결정하기 위해 복잡한 설문을 사용합니다. App Store의 parental controls는 이 계산된 연령 등급을 사용합니다. EAS Metadata는 기본적으로 각 질문에 대해 가장 덜 제한적인 답변을 사용합니다.

가장 덜 제한적인 답변으로 채운 complete advisory

```json
{
  "configVersion": 0,
  "apple": {
    "advisory": {
      "alcoholTobaccoOrDrugUseOrReferences": "NONE",
      "contests": "NONE",
      "gamblingSimulated": "NONE",
      "horrorOrFearThemes": "NONE",
      "matureOrSuggestiveThemes": "NONE",
      "medicalOrTreatmentInformation": "NONE",
      "profanityOrCrudeHumor": "NONE",
      "sexualContentGraphicAndNudity": "NONE",
      "sexualContentOrNudity": "NONE",
      "violenceCartoonOrFantasy": "NONE",
      "violenceRealistic": "NONE",
      "violenceRealisticProlongedGraphicOrSadistic": "NONE",
      "gambling": false,
      "unrestrictedWebAccess": false,
      "kidsAgeBand": null,
      "ageRatingOverride": "NONE",
      "koreaAgeRatingOverride": "NONE"
    }
  }
}
```

| Property | Type | Description |
| --- | --- | --- |
| `alcoholTobaccoOrDrugUseOrReferences` | [AppleAgeRating](#apple-advisory-age-rating). | 앱에 알코올, 담배, 약물 사용 또는 관련 언급이 포함되어 있나요? |
| `contests` | [AppleAgeRating](#apple-advisory-age-rating). | 앱에 경품 행사나 콘테스트가 포함되어 있나요? |
| `gambling` | `boolean`. | 앱에 도박 요소가 포함되어 있나요? |
| `gamblingSimulated` | [AppleAgeRating](#apple-advisory-age-rating). | 앱에 모의 도박이 포함되어 있나요? |
| `horrorOrFearThemes` | [AppleAgeRating](#apple-advisory-age-rating). | 앱에 공포 또는 두려움 테마가 포함되어 있나요? |
| `kidsAgeBand` | [AppleKidsAge](#apple-advisory-kids-age). | 부모가 App Store의 Kids 카테고리를 방문할 때, 그들은 아이들의 데이터를 보호하고, 연령에 맞는 콘텐츠만 제공하며, 앱 외부로 이동하거나 권한을 요청하거나 구매 기회를 보여 주기 전에 parental gate를 요구하는 앱을 기대합니다. 개인 식별 정보나 기기 정보가 제3자에게 전송되지 않고, 광고가 표시되기 전에 연령 적합성을 사람이 검토하는 것이 중요합니다. [자세히 알아보기](https://developer.apple.com/news/?id=091202019a) |
| `matureOrSuggestiveThemes` | [AppleAgeRating](#apple-advisory-age-rating). | 앱에 성숙하거나 암시적인 테마가 포함되어 있나요? |
| `medicalOrTreatmentInformation` | [AppleAgeRating](#apple-advisory-age-rating). | 앱에 의료 또는 치료 정보가 포함되어 있나요? |
| `profanityOrCrudeHumor` | [AppleAgeRating](#apple-advisory-age-rating). | 앱에 욕설이나 저속한 유머가 포함되어 있나요? |
| `ageRatingOverride` | [AppleAgeRatingOverride](#apple-advisory-age-rating-override). | 앱의 등급이 12+ 이하이고 콘텐츠가 어린이에게 적합하지 않을 수 있다고 판단되면 연령 등급을 수동으로 재정의할 수 있습니다. [자세히 알아보기](https://developer.apple.com/help/app-store-connect/manage-app-information/set-an-app-age-rating) |
| `koreaAgeRatingOverride` | [AppleKoreaAgeRatingOverride](#apple-advisory-korea-age-rating-override). | 앱의 등급이 12+ 이하이고 콘텐츠가 어린이에게 적합하지 않을 수 있다고 판단되면 연령 등급을 수동으로 재정의할 수 있습니다. `ageRatingOverride`와 같지만 한국에 적용됩니다. [자세히 알아보기](https://developer.apple.com/help/app-store-connect/manage-app-information/set-an-app-age-rating) |
| `sexualContentGraphicAndNudity` | [AppleAgeRating](#apple-advisory-age-rating). | 앱에 노골적인 성적 콘텐츠와 노출이 포함되어 있나요? |
| `sexualContentOrNudity` | [AppleAgeRating](#apple-advisory-age-rating). | 앱에 성적 콘텐츠나 노출이 포함되어 있나요? |
| `unrestrictedWebAccess` | `boolean`. | 앱에 임베디드 브라우저처럼 제한 없는 웹 접근 기능이 포함되어 있나요? |
| `violenceCartoonOrFantasy` | [AppleAgeRating](#apple-advisory-age-rating). | 앱에 만화적 또는 판타지 폭력이 포함되어 있나요? |
| `violenceRealistic` | [AppleAgeRating](#apple-advisory-age-rating). | 앱에 현실적인 폭력이 포함되어 있나요? |
| `violenceRealisticProlongedGraphicOrSadistic` | [AppleAgeRating](#apple-advisory-age-rating). | 앱에 장시간 지속되는 노골적이거나 가학적인 현실 폭력이 포함되어 있나요? |

#### Apple advisory age rating

| Name | Description |
| --- | --- |
| `NONE` | 해당 주제를 전혀 사용하지 않는 앱에 사용합니다. |
| `INFREQUENT_OR_MILD` | 해당 주제를 언급하거나 주요 기능이 아닌 방식으로 사용하는 앱에 사용합니다. |
| `FREQUENT_OR_INTENSE` | 해당 주제를 주요 기능으로 사용하는 앱에 사용합니다. |

#### Apple advisory kids age

| Name | Description |
| --- | --- |
| `FIVE_AND_UNDER` | 5세 이하 어린이를 위한 경우입니다. |
| `SIX_TO_EIGHT` | 6세에서 8세 사이 어린이를 위한 경우입니다. |
| `NINE_TO_ELEVEN` | 9세에서 11세 사이 어린이를 위한 경우입니다. |

#### Apple advisory age rating override

| Name | Description |
| --- | --- |
| `NONE` | 연령 등급 재정의 없음 |
| `SEVENTEEN_PLUS` | 앱에 17세 미만 어린이에게 적합하지 않을 수 있는 콘텐츠가 포함되어 있습니다. |
| `UNRATED` | 성인 전용입니다. 이 콘텐츠는 App Store에 게시할 수 없습니다. iOS의 대체 앱 마켓플레이스나 유럽 연합 내 웹사이트에는 게시될 수 있습니다. |

#### Apple advisory korea age rating override

| Name | Description |
| --- | --- |
| `NONE` | 연령 등급 재정의 없음 |
| `FIFTEEN_PLUS` | 앱에 15세 미만 어린이에게 적합하지 않을 수 있는 콘텐츠가 포함되어 있습니다. |
| `NINETEEN_PLUS` | 앱에 19세 미만 청소년에게 적합하지 않을 수 있는 콘텐츠가 포함되어 있습니다. |

### Apple categories

App Store는 [카테고리별로 앱을 분류](https://developer.apple.com/app-store/categories/)해 사용자가 새 앱을 발견하도록 돕습니다. 여기에는 기본 카테고리, 보조 카테고리, 가능한 하위 카테고리가 사용됩니다.

기본 카테고리와 보조 카테고리

```json
{
  "configVersion": 0,
  "apple": {
    "categories": ["FINANCE", "NEWS"]
  }
}
```

기본 카테고리, 하위 카테고리, 보조 카테고리

```json
{
  "configVersion": 0,
  "apple": {
    "categories": [["GAMES", "GAMES_CARD", "GAMES_BOARD"], "ENTERTAINMENT"]
  }
}
```

| Name | Description |
| --- | --- |
| `BOOKS` | 전통적으로 인쇄물 형태로 제공되던 콘텐츠에 추가 상호작용을 제공하는 앱입니다. |
| `BUSINESS` | 비즈니스 운영을 돕거나, 비즈니스 관련 콘텐츠를 협업·편집·공유할 수 있게 하는 앱입니다. |
| `DEVELOPER_TOOLS` | 사용자가 소프트웨어를 개발, 유지 관리, 공유하는 데 도움을 주는 앱입니다. |
| `EDUCATION` | 특정 기술이나 주제에 대해 상호작용형 학습 경험을 제공하는 앱입니다. |
| `ENTERTAINMENT` | 오디오, 비주얼 또는 그 밖의 콘텐츠로 사용자를 즐겁게 하도록 설계된 상호작용형 앱입니다. |
| `FINANCE` | 비즈니스 또는 개인 재정을 돕기 위한 금융 서비스나 정보를 제공하는 앱입니다. |
| `FOOD_AND_DRINK` | 음식 또는 음료를 준비, 소비, 리뷰하는 것과 관련된 추천, 안내, 리뷰를 제공하는 앱입니다. |
| `GAMES` | 오락 목적의 싱글플레이 또는 멀티플레이 상호작용 경험을 제공하는 앱입니다. 이 카테고리는 최대 2개의 하위 카테고리를 가질 수 있습니다. `GAMES_ACTION` `GAMES_ADVENTURE` `GAMES_BOARD` `GAMES_CARD` `GAMES_CASINO` `GAMES_CASUAL` `GAMES_FAMILY` `GAMES_MUSIC` `GAMES_PUZZLE` `GAMES_RACING` `GAMES_ROLE_PLAYING` `GAMES_SIMULATION` `GAMES_SPORTS` `GAMES_STRATEGY` `GAMES_TRIVIA` `GAMES_WORD` |
| `GRAPHICS_AND_DESIGN` | 시각 콘텐츠를 만들고, 편집하고, 공유할 수 있는 도구나 팁을 제공하는 앱입니다. |
| `HEALTH_AND_FITNESS` | 스트레스 관리, 피트니스, 레크리에이션 활동을 포함한 건강한 생활과 관련된 앱입니다. |
| `LIFESTYLE` | 일반적인 관심 주제나 서비스와 관련된 앱입니다. |
| `MAGAZINES_AND_NEWSPAPERS` | 전통적으로 인쇄물 형태로 제공되던 저널리즘 콘텐츠에 추가 상호작용을 제공하는 앱입니다. |
| `MEDICAL` | 환자 또는 의료 전문가를 위한 의료 교육, 정보 또는 건강 참고 자료에 초점을 맞춘 앱입니다. |
| `MUSIC` | 음악을 발견하고, 듣고, 녹음하고, 연주하고, 작곡하기 위한 앱입니다. |
| `NAVIGATION` | 사용자가 실제 위치에 도달하는 데 도움이 되는 정보를 제공하는 앱입니다. |
| `NEWS` | 정치, 엔터테인먼트, 비즈니스, 과학, 기술 등 관심 분야의 현재 사건 및 동향에 대한 정보를 제공하는 앱입니다. |
| `PHOTO_AND_VIDEO` | 사진과 비디오를 촬영, 편집, 관리, 저장, 공유하는 데 도움을 주는 앱입니다. |
| `PRODUCTIVITY` | 특정 과정이나 작업을 더 체계적이고 효율적으로 만들어 주는 앱입니다. |
| `REFERENCE` | 사용자가 일반 정보를 접근하거나 검색할 수 있도록 돕는 앱입니다. |
| `SHOPPING` | 상품이나 서비스를 구매할 수 있는 수단을 제공하는 앱입니다. |
| `SOCIAL_NETWORKING` | 텍스트, 음성, 사진, 비디오를 통해 사람들을 연결하는 앱입니다. |
| `SPORTS` | 프로, 아마추어, 대학, 레크리에이션 스포츠 활동과 관련된 앱입니다. |
| `STICKERS` | 메시징 앱에 확장된 시각 기능을 제공하는 앱입니다. 이 카테고리는 최대 2개의 하위 카테고리를 가질 수 있습니다. `STICKERS_ANIMALS` `STICKERS_ART` `STICKERS_CELEBRATIONS` `STICKERS_CELEBRITIES` `STICKERS_CHARACTERS` `STICKERS_EATING_AND_DRINKING` `STICKERS_EMOJI_AND_EXPRESSIONS` `STICKERS_FASHION` `STICKERS_GAMING` `STICKERS_KIDS_AND_FAMILY` `STICKERS_MOVIES_AND_TV` `STICKERS_MUSIC` `STICKERS_PEOPLE` `STICKERS_PLACES_AND_OBJECTS` `STICKERS_SPORTS_AND_ACTIVITIES` |
| `TRAVEL` | 계획, 구매, 추적 등 여행의 모든 측면을 돕는 앱입니다. |
| `UTILITIES` | 사용자가 문제를 해결하거나 특정 작업을 완료할 수 있게 하는 앱입니다. |
| `WEATHER` | 구체적인 날씨 관련 정보를 제공하는 앱입니다. |

### Apple info

App Store는 다양한 언어를 사용하는 많은 사람이 이용하는 글로벌 서비스입니다. 앱의 App Store 노출 정보는 [여러 언어](/eas/metadata/schema#apple-info-languages)로 현지화할 수 있습니다.

영어(미국)로 된 최소 localized info

```json
{
  "configVersion": 0,
  "apple": {
    "info": {
      "en-US": {
        "title": "Awesome app",
        "privacyPolicyUrl": "https://example.com/en/privacy"
      }
    }
  }
}
```

영어(미국)로 작성된 complete localized info

```json
{
  "configVersion": 0,
  "apple": {
    "info": {
      "en-US": {
        "title": "App title",
        "subtitle": "Subtitle for your app",
        "description": "A longer description of what your app does",
        "keywords": ["keyword", "other-keyword"],
        "releaseNotes": "Bug fixes and improved stability",
        "promoText": "Short tagline for your app",
        "marketingUrl": "https://example.com/en",
        "supportUrl": "https://example.com/en/help",
        "privacyPolicyUrl": "https://example.com/en/privacy",
        "privacyChoicesUrl": "https://example.com/en/privacy/choices"
      }
    }
  }
}
```

| Property | Type | Description |
| --- | --- | --- |
| `title` | `string`. length: 2. 30 | 스토어에 표시되는 앱 이름입니다. 이 이름은 설치된 앱 이름과 비슷해야 합니다. 이 이름은 App Store에 공개되기 전에 심사를 받습니다. |
| `subtitle` | `string`. length: 30 | 스토어에 표시되는 앱의 부제입니다. 예: `"A Fun Game For Friends"`. 부제는 App Store에 공개되기 전에 심사를 받습니다. |
| `description` | `string`. length: 10. 4000 | 앱이 무엇을 하는지 설명하는 주요 설명입니다. |
| `keywords` | `string[]`. unique itemsmax length item: 100 | 사용자가 App Store에서 앱을 찾는 데 도움이 되는 키워드 목록입니다. |
| `releaseNotes` | `string`. max length: 4000 | 마지막 공개 버전 이후 변경 사항입니다. |
| `promoText` | `string`. max length: 170 | 앱을 위한 짧은 태그라인입니다. |
| `marketingUrl` | `string`. max length: 255 | 앱 마케팅 페이지의 URL입니다. |
| `supportUrl` | `string`. max length: 255 | 앱 지원 페이지의 URL입니다. |
| `privacyPolicyText` | `string`. | Apple TV용 개인정보 처리방침입니다. |
| `privacyPolicyUrl` | `string`. max length: 255 | 개인정보 처리방침으로 연결되는 URL입니다. 모든 앱에는 개인정보 처리방침이 필요합니다. |
| `privacyChoicesUrl` | `string`. max length: 255 | 사용자가 앱에서 수집된 데이터를 수정·삭제하거나, 데이터가 사용되고 공유되는 방식을 결정할 수 있는 URL입니다. |

#### Apple info languages

| Language | Language Code |
| --- | --- |
| Arabic | `ar-SA` |
| Catalan | `ca` |
| Chinese | `zh-Hans` (Simplified). `zh-Hant` (Traditional) |
| Croatian | `hr` |
| Czech | `cs` |
| Danish | `da` |
| Dutch | `nl-NL` |
| English | `en-AU` (Australia). `en-CA` (Canada). `en-GB` (U.K.). `en-US` (U.S.) |
| Finnish | `fi` |
| French | `fr-CA` (Canada). `fr-FR` (France) |
| German | `de-DE` |
| Greek | `el` |
| Hebrew | `he` |
| Hindi | `hi` |
| Hungarian | `hu` |
| Indonesian | `id` |
| Italian | `it` |
| Japanese | `ja` |
| Korean | `ko` |
| Malay | `ms` |
| Norwegian | `no` |
| Polish | `pl` |
| Portuguese | `pt-BR` (Brazil). `pt-PT` (Portugal) |
| Romanian | `ro` |
| Russian | `ru` |
| Slovak | `sk` |
| Spanish | `es-MX` (Mexico). `es-ES` (Spain) |
| Swedish | `sv` |
| Thai | `th` |
| Turkish | `tr` |
| Ukrainian | `uk` |
| Vietnamese | `vi` |

### Apple release

앱을 사용자 손에 전달하는 전략은 여러 가지가 있습니다. App Store 승인이 난 뒤 앱을 자동으로 출시하거나, 사용자에게 점진적으로 업데이트를 배포할 수 있습니다.

2022년 12월 25일(UTC) 이후 자동 출시

```json
{
  "configVersion": 0,
  "apple": {
    "release": {
      "automaticRelease": "2022-12-25T00:00:00+00:00"
    }
  }
}
```

| Property | Type | Description |
| --- | --- | --- |
| `automaticRelease` | `boolean|Date`. | App Store 승인 이후 앱을 자동 출시할지와 그 방식을 지정합니다.
-   `false` - 스토어 승인 후 수동으로 앱을 출시합니다. (기본 동작)
-   `true` - 스토어 승인 후 자동으로 출시합니다.
-   `Date` - 스토어 승인 후 이 날짜에 자동 출시를 예약합니다([RFC 3339](https://www.rfc-editor.org/rfc/rfc3339) 형식 사용).

. Apple은 선택한 예약 출시 날짜에 앱이 정확히 제공될 것을 보장하지 않습니다. |
| `phasedRelease` | `boolean`. | 자동 업데이트에 대한 phased release를 사용하면, 자동 업데이트를 켠 사용자에게 이 업데이트를 7일에 걸쳐 점진적으로 배포할 수 있습니다. 이 버전은 여전히 App Store에서 모든 사용자에게 수동 업데이트로 제공된다는 점을 기억하세요. phased release는 최대 30일 동안 일시 중지할 수 있으며, 언제든 모든 사용자에게 이 업데이트를 배포할 수 있습니다. [자세히 알아보기](https://help.apple.com/app-store-connect/#/dev3d65fcee1) |

### Apple review

앱을 App Store에 게시하기 전에 스토어 승인이 필요합니다. App Store 심사팀은 앱을 테스트하는 데 필요한 모든 정보를 받아야 하며, 그렇지 않으면 앱이 거절될 위험이 있습니다.

최소 review 정보

```json
{
  "configVersion": 0,
  "apple": {
    "review": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1 123 456 7890"
    }
  }
}
```

완전한 review 정보

```json
{
  "configVersion": 0,
  "apple": {
    "review": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1 123 456 7890",
      "demoUsername": "john",
      "demoPassword": "applereview",
      "demoRequired": false,
      "notes": "This is an example app primarily used for educational purposes."
    }
  }
}
```

| Property | Type | Description |
| --- | --- | --- |
| `firstName` | `string`. min length: 1 | App Store 심사팀과 소통이 필요할 경우 사용할 앱 담당자의 이름입니다. |
| `lastName` | `string`. min length: 1 | App Store 심사팀과 소통이 필요할 경우 사용할 앱 담당자의 성입니다. |
| `email` | `string`. email | App Store 심사팀과 소통이 필요할 경우 사용할 이메일 연락처 주소입니다. |
| `phone` | `string`. | App Store 심사팀과 소통이 필요할 경우 사용할 연락처 전화번호입니다. 전화번호 앞에는 국가 코드를 포함한 `"+"`를 붙이세요. (예: `+44 844 209 0611`) |
| `demoUsername` | `string`. | 앱 기능 검토를 위해 앱에 로그인할 사용자 이름입니다. |
| `demoPassword` | `string`. | 앱 기능 검토를 위해 앱에 로그인할 비밀번호입니다. |
| `demoRequired` | `boolean`. | 앱 기능 검토를 위해 로그인 정보가 필요한지를 나타내는 Boolean 값입니다. 사용자가 소셜 미디어로 로그인한다면 심사용 계정 정보를 제공하세요. 자격 증명은 심사 기간 동안 유효하고 활성 상태여야 합니다. |
| `notes` | `string`. length: 2. 4000 | 심사 과정에서 도움이 될 수 있는 앱에 대한 추가 정보입니다. 노트에 데모 계정 정보를 포함하지 마세요. 대신 `demoUsername`과 `demoPassword` 속성을 사용하세요. |
