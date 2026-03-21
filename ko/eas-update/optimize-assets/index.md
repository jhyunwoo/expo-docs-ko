---
modificationDate: May 01, 2025
title: EAS Update용 asset 최적화하기
description: EAS Update가 asset을 다운로드하는 방식과 다운로드 크기에 맞게 asset을 최적화하는 방법을 알아보세요.
---

# EAS Update용 asset 최적화하기

EAS Update가 asset을 다운로드하는 방식과 다운로드 크기에 맞게 asset을 최적화하는 방법을 알아보세요.

> 새로운 [asset selection 기능](/eas-update/asset-selection)을 사용하면 다운로드되는 asset의 총 개수와 크기를 크게 줄일 수 있습니다.

앱이 새 update를 발견하면 먼저 manifest를 다운로드한 뒤, update를 실행할 수 있도록 새 asset이나 변경된 asset을 다운로드합니다. 과정은 다음과 같습니다:

Android와 iOS 앱을 사용하는 많은 사용자는 Wi-Fi를 사용할 때만큼 일관적이거나 빠르지 않은 모바일 연결을 사용하고 있으므로, update의 일부로 전달되는 asset은 가능한 한 작아야 합니다.

## 코드 asset

update를 게시할 때 EAS CLI는 Expo CLI를 실행해 프로젝트를 update로 번들링합니다. 그러면 update가 프로젝트의 **dist** 디렉터리에 나타납니다.

**dist/bundles**에서는 각각 Android와 iOS update의 일부가 될 **index.android.js**와 **index.ios.js** 파일의 크기를 볼 수 있습니다. 이 값은 압축되지 않은 파일 크기라는 점에 유의하세요. EAS Update는 Brotli와 gzip 압축을 사용하므로 실제 다운로드 크기를 크게 줄일 수 있습니다. 그럼에도 이 파일들은 사용자의 기기가 이전에 해당 파일을 다운로드한 적이 없다면, 새 update를 받을 때 기기로 다운로드됩니다. 이 파일들의 크기를 가능한 한 작게 유지하면 최종 사용자가 update를 빠르게 다운로드하는 데 도움이 됩니다.

## 이미지 asset

앱 사용자는 새 update를 감지했을 때, 해당 asset이 이미 build의 일부가 아니라면 모든 새 image나 기타 asset을 다운로드해야 합니다. EAS 서버에 업로드된 모든 asset은 **dist/assets**에서 볼 수 있습니다. 그 안의 asset은 확장자가 제거된 해시 이름으로 저장되므로 어떤 asset인지 알기 어렵습니다. asset 목록을 보기 좋게 출력하려면 다음 명령을 실행하면 됩니다:

```sh
npx expo export
```

### 이미지 asset 최적화하기

프로젝트의 이미지 asset을 수동으로 최적화하려면 `npx expo-optimize` 명령을 사용할 수 있습니다. 이 명령은 [sharp](https://sharp.pixelplumbing.com/) 라이브러리를 사용해 이미지를 압축합니다.

```sh
npx expo-optimize
```

명령을 실행하면 이미 최적화된 이미지를 제외한 모든 image asset이 압축됩니다. `--quality [number]` 옵션을 함께 사용해 압축 품질을 조정할 수도 있습니다. 예를 들어 90%로 압축하려면 다음을 실행하세요:

```sh
npx expo-optimize --quality 90
```

### 기타 수동 최적화 방법

이미지와 비디오를 수동으로 최적화하는 방법은 [Assets](/develop/user-interface/assets#manual-optimization-methods)에서 자세히 알아보세요.

## asset이 update에 포함되도록 보장하기

update를 게시하면 EAS는 사용자가 앱을 실행할 때 해당 asset을 가져올 수 있도록 asset을 CDN에 업로드합니다. 하지만 asset이 CDN에 업로드되려면, 애플리케이션 코드 어딘가에서 반드시 명시적으로 require되어야 합니다. 조건부로 asset을 require하면 bundler가 이를 감지하지 못하게 되고, 프로젝트를 게시할 때 업로드되지 않습니다.

## 추가 고려 사항

사용자의 앱은 새 asset이나 변경된 asset만 다운로드한다는 점을 기억하는 것이 중요합니다. 앱 안에 이미 존재하는 변경되지 않은 asset은 다시 다운로드하지 않습니다.

update를 가능한 한 가볍게 유지하는 한 가지 방법은 앱을 자주 build하고 app store에 제출해, 사용자가 더 최신 asset이 포함된 새 app binary를 다운로드하도록 만드는 것입니다. 일반적으로 큰 asset이나 여러 asset을 추가할 때는 앱을 build하고 제출하는 것이 좋은 습관이며, app store release 사이에는 작은 버그 수정과 사소한 변경에 update를 사용하는 것이 좋습니다.
