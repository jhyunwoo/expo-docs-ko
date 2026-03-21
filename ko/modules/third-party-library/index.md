---
modificationDate: February 28, 2026
title: 서드파티 네이티브 라이브러리 감싸기
description: Expo Modules API를 사용해 두 개의 별도 네이티브 라이브러리를 감싸는 간단한 wrapper를 만드는 방법을 알아보세요.
---

# 서드파티 네이티브 라이브러리 감싸기

Expo Modules API를 사용해 두 개의 별도 네이티브 라이브러리를 감싸는 간단한 wrapper를 만드는 방법을 알아보세요.

Expo 모듈을 사용하면 Android와 iOS용으로 만들어진 네이티브 외부 라이브러리를 React Native 프로젝트에서 쉽게 사용할 수 있습니다. 이 튜토리얼은 두 네이티브 플랫폼 모두에서 사용할 수 있는 비슷한 두 라이브러리를 활용해 방사형 차트를 만드는 Expo Modules API 사용법에 초점을 맞춥니다.

-   [MPAndroidChart by PhilJay](https://github.com/PhilJay/MPAndroidChart)
-   [Charts by Daniel Cohen Gindi](https://github.com/danielgindi/Charts)

iOS 라이브러리는 Android 라이브러리에서 영감을 받아 만들어졌으므로 API와 기능이 서로 비슷합니다. 그래서 이 튜토리얼의 좋은 예제가 됩니다.

[네이티브 라이브러리 감싸는 방법](https://www.youtube.com/watch?v=M8eNfH1o0eE) — 이 영상에서는 Expo Modules API를 사용해 네이티브 라이브러리를 감싸는 방법을 배울 수 있습니다.

## 새 모듈 만들기

다음 단계는 새 모듈을 새로운 Expo 프로젝트 안에서 만든다고 가정합니다. 하지만 대체 안내를 따르면 기존 프로젝트 안에서도 새 모듈을 만들 수 있습니다.

또는 기존 Expo 프로젝트 디렉터리 안에서 새 모듈을 view로 사용할 수도 있습니다. 프로젝트 디렉터리에서 다음 명령을 실행하세요.

```sh
npx create-expo-module --local expo-radial-chart
```

이제 새로 생성된 `modules/expo-radial-chart` 디렉터리를 열고 네이티브 코드 편집을 시작합니다.

## example 프로젝트 실행하기

모든 것이 올바르게 동작하는지 확인하려면 example 프로젝트를 실행해 봅시다.

기존 Expo 프로젝트에서 시작했다면, Expo 프로젝트 루트 디렉터리에서 다음 명령을 실행하세요.

```sh
npx expo run:android
npx expo run:ios
```

## 네이티브 의존성 추가하기

**expo-radial-chart/android/build.gradle** 및 **expo-radial-chart/ios/ExpoRadialChart.podspec** 파일을 편집해 모듈에 네이티브 의존성을 추가합니다.

`.aar` 의존성을 사용하려고 하나요?

**android** 디렉터리 안에 **libs**라는 또 다른 디렉터리를 만들고 **.aar** 파일을 그 안에 넣으세요. 그런 다음 autolinking에서 해당 파일을 Gradle 프로젝트로 추가합니다.

마지막으로 **android/build.gradle** 파일의 `dependencies` 목록에, 의존성이 지정한 이름 앞에 `${project.name}$` 접두사를 붙여 의존성을 추가합니다.

`.xcframework` 또는 `.framework` 의존성을 사용하려고 하나요?

iOS에서는 `vendored_frameworks` 설정 옵션을 사용해 framework로 묶인 의존성도 사용할 수 있습니다.

> **참고**: framework 경로를 지정할 때 사용하는 파일 패턴은 podspec 파일 기준 상대 경로이며, 상위 디렉터리(`..`)로 이동하는 것을 지원하지 않습니다. 따라서 framework는 **ios** 디렉터리 안이나 **ios**의 하위 디렉터리 안에 두어야 합니다.

framework를 추가한 뒤에는 `source_files` 옵션의 파일 패턴이 framework 내부 파일과 일치하지 않도록 해야 합니다. 이를 위한 한 가지 방법은 iOS 소스 Swift 파일(예: `ExpoRadialChartView.swift`, `ExpoRadialChartModule.swift`)을 framework를 둔 위치와 분리된 **src** 디렉터리로 옮기고, `source_files` 옵션이 **src** 디렉터리만 일치하도록 업데이트하는 것입니다.

최종적으로 **ios** 디렉터리의 파일 구조는 다음과 비슷해져야 합니다.

`Frameworks`

 `MyFramework.framework`

`src`

 `ExpoRadialChartView.swift`

 `ExpoRadialChartModule.swift`

`ExpoRadialChart.podspec`

## API 정의하기

앱에서 모듈을 사용하려면 props 타입을 정의합니다. 이 모듈은 각 항목이 color와 percentage 값을 가진 series 목록을 받습니다.

```ts
import { ViewStyle } from 'react-native/types';

export type ChangeEventPayload = {
  value: string;
};

type Series = {
  color: string;
  percentage: number;
};

export type ExpoRadialChartViewProps = {
  style?: ViewStyle;
  data: Series[];
};
```

이 예제에서는 웹용 모듈을 구현하지 않으므로 **src/ExpoRadialChartView.web.tsx** 파일을 다음과 같이 바꿉니다.

```tsx
import * as React from 'react';

export default function ExpoRadialChartView() {
  return <div>Not implemented</div>;
}
```

## Android에서 모듈 구현하기

이제 placeholder 파일을 다음과 같이 수정해 네이티브 기능을 구현할 수 있습니다.

1.  `PieChart` 인스턴스를 만들고 `layoutParams`를 부모 뷰와 일치하도록 설정합니다. 그런 다음 `addView` 함수를 사용해 뷰 계층에 추가합니다.
2.  `Series` 객체 목록을 받는 `setChartData` 함수를 정의합니다. 목록을 순회하면서 각 series에 대해 `PieEntry`를 만들고, color는 별도 목록에 저장할 수 있습니다.
3.  `PieDataSet`을 만들고, 이를 사용해 `PieData` 객체를 생성한 뒤 `PieChart` 인스턴스의 데이터로 설정합니다.

```kotlin
package expo.modules.radialchart

import android.content.Context
import android.graphics.Color
import androidx.annotation.ColorInt
import com.github.mikephil.charting.charts.PieChart
import com.github.mikephil.charting.data.PieData
import com.github.mikephil.charting.data.PieDataSet
import com.github.mikephil.charting.data.PieEntry
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.views.ExpoView

class Series : Record {
  @Field
  val color: String = "#ff0000"

  @Field
  val percentage: Float = 0.0f
}

class ExpoRadialChartView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  internal val chartView = PieChart(context).also {
    it.layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
    addView(it)
  }

  fun setChartData(data: ArrayList<Series>) {
    val entries: ArrayList<PieEntry> = ArrayList()
    val colors: ArrayList<Int> = ArrayList()
    for (series in data) {
      entries.add(PieEntry(series.percentage))
      colors.add(Color.parseColor(series.color))
    }
    val dataSet = PieDataSet(entries, "DataSet");
    dataSet.colors = colors;
    val pieData = PieData(dataSet);
    chartView.data = pieData;
    chartView.invalidate();

  }
}
```

또한 [`Prop`](/modules/module-api#prop) 함수를 사용해 `data` prop을 정의하고, prop이 바뀔 때 네이티브 `setChartData` 함수를 호출해야 합니다.

```kotlin
package expo.modules.radialchart

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoRadialChartModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoRadialChart")

    View(ExpoRadialChartView::class) {
      Prop("data") { view: ExpoRadialChartView, prop: ArrayList<Series> ->
        view.setChartData(prop);
      }
    }
  }
}
```

## iOS에서 모듈 구현하기

이제 placeholder 파일을 다음과 같이 수정해 네이티브 기능을 구현할 수 있습니다.

1.  새 `PieChartView` 인스턴스를 만들고 `addSubview` 함수를 사용해 뷰 계층에 추가합니다.
2.  `clipsToBounds` 프로퍼티를 설정하고 `layoutSubviews` 함수를 override해서 차트 뷰가 항상 부모 뷰와 같은 크기를 갖도록 합니다.
3.  series 목록을 받는 `setChartData` 함수를 만들고, 데이터로 `PieChartDataSet` 인스턴스를 생성한 뒤 `PieChartView` 인스턴스의 `data` 프로퍼티에 할당합니다.

```swift
import ExpoModulesCore
import DGCharts

struct Series: Record {
  @Field
  var color: UIColor = UIColor.black

  @Field
  var percentage: Double = 0
}

class ExpoRadialChartView: ExpoView {
  let chartView = PieChartView()

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    clipsToBounds = true
    addSubview(chartView)
  }

  override func layoutSubviews() {
    chartView.frame = bounds
  }

  func setChartData(data: [Series]) {
    let set1 = PieChartDataSet(entries: data.map({ (series: Series) -> PieChartDataEntry in
      return PieChartDataEntry(value: series.percentage)
    }))
    set1.colors = data.map({ (series: Series) -> UIColor in
      return series.color
    })
    let chartData: PieChartData = [set1]
    chartView.data = chartData
  }
}
```

또한 [`Prop`](/modules/module-api#prop) 함수를 사용해 `data` prop을 정의하고, prop이 바뀔 때 네이티브 `setChartData` 함수를 호출해야 합니다.

```swift
import ExpoModulesCore

public class ExpoRadialChartModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoRadialChart")

    View(ExpoRadialChartView.self) {
      Prop("data") { (view: ExpoRadialChartView, prop: [Series]) in
        view.setChartData(data: prop)
      }
    }
  }
}
```

## 모듈을 사용하는 example 앱 작성하기

모듈을 테스트하려면 **src/app** 디렉터리 안의 앱을 업데이트할 수 있습니다. `ExpoRadialChartView` 컴포넌트를 사용해 세 개의 조각을 가진 원형 차트를 렌더링하세요.

```tsx
import { ExpoRadialChartView } from '@/modules/expo-radial-chart';
import { StyleSheet } from 'react-native';

export default function App() {
  return (
    <ExpoRadialChartView
      style={styles.container}
      data={[
        {
          color: '#ff0000',
          percentage: 0.5,
        },
        {
          color: '#00ff00',
          percentage: 0.2,
        },
        {
          color: '#0000ff',
          percentage: 0.3,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

> **팁**: 새 모듈을 만들었다면 import 문을 다음과 같이 업데이트해야 합니다. `import { ExpoRadialChartView } from 'expo-radial-chart';`

## 애플리케이션 다시 빌드하고 실행하기

앱이 두 플랫폼 모두에서 성공적으로 빌드되는지 확인하려면 2단계의 빌드 명령을 다시 실행합니다. 어느 플랫폼에서든 앱이 성공적으로 빌드되면 세 개의 조각이 있는 원형 차트가 보입니다.

축하합니다! 이제 Expo Modules API를 사용해 두 개의 별도 서드파티 네이티브 라이브러리를 감싸는 첫 번째 간단한 wrapper를 만들었습니다.

## 다음 단계

[Expo Modules API Reference](/modules/module-api) — Kotlin과 Swift를 사용해 네이티브 모듈을 만드는 참고 문서입니다.
