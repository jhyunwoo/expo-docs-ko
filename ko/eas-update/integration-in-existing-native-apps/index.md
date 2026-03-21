---
modificationDate: March 05, 2026
title: 기존 네이티브 앱에서 EAS Update 사용하기
description: OTA update를 활성화하기 위해 기존 네이티브 Android 및 iOS 앱에 EAS Update를 통합하는 방법을 알아보세요.
---

# 기존 네이티브 앱에서 EAS Update 사용하기

OTA update를 활성화하기 위해 기존 네이티브 Android 및 iOS 앱에 EAS Update를 통합하는 방법을 알아보세요.

> 프로젝트가 **greenfield React Native app**이고, 처음부터 주로 React Native로 빌드되었으며 앱의 진입점이 React Native라면, 이 가이드는 건너뛰고 [EAS Update 시작하기](/eas-update/getting-started)로 진행하세요.

이 가이드는 기존 네이티브 앱, 흔히 brownfield app이라고 부르는 앱에 EAS Update를 통합하는 방법을 설명합니다. Expo SDK 52 이상과 React Native 0.76 이상을 사용한다고 가정합니다.

더 오래된 Expo SDK 및 React Native version에 대한 지침은 제공되지 않습니다. 더 오래된 version 통합에 대한 추가 실무 지원은 엔터프라이즈 고객에게만 제공될 수 있습니다([문의하기](https://expo.dev/contact)).

## 사전 준비

> 아래 지침은 모든 프로젝트에서 동작하지 않을 수 있습니다. 기존 프로젝트에 EAS Update를 통합하는 세부 사항은 앱의 구체적인 구조에 크게 좌우되므로, 여러분의 고유한 설정에 맞게 지침을 조정해야 할 수 있습니다. 문제가 생기면 [GitHub에 issue를 생성](https://github.com/expo/expo/issues)하거나, 이 가이드 개선을 제안하는 pull request를 열어 주세요.

React Native가 설치되어 있고 root view를 렌더링하도록 구성된 brownfield native project가 있어야 합니다. 아직 준비되지 않았다면 React Native 문서의 [Integration with Existing Apps](https://reactnative.dev/docs/integration-with-existing-apps) 가이드를 먼저 따르고, 그 단계를 마친 뒤 여기로 돌아오세요.

-   앱은 [최신 Expo SDK version 및 그 SDK가 지원하는 React Native version](/versions/latest#each-expo-sdk-version-depends-on-a-react-native-version)을 사용해야 합니다.
-   react-native-code-push 같은 다른 update 라이브러리 통합은 앱에서 제거하고, 지원하는 플랫폼의 debug와 release 모두에서 앱이 성공적으로 컴파일되고 실행되는지 확인하세요.
-   Expo module 지원(`expo` 패키지를 통해 제공됨)이 프로젝트에 설치되고 구성되어 있어야 합니다. [자세히 알아보세요](/brownfield/overview).
-   **metro.config.js**는 [반드시 `expo/metro-config`를 확장해야 합니다](/guides/customizing-metro#customizing).
-   **babel.config.js**는 [반드시 `babel-preset-expo`를 확장해야 합니다](/versions/latest/config/babel).
-   프로젝트가 Android를 지원한다면 `npx expo export -p android`가 성공적으로 실행되어야 하고, iOS를 지원한다면 `npx expo export -p ios`도 성공적으로 실행되어야 합니다.

## 설치 및 기본 구성

[EAS Update 시작하기](/eas-update/getting-started) 가이드의 1, 2, 3, 4단계를 따르세요.

이 단계가 끝나면 `eas-cli` 설치 및 인증, 프로젝트에 `expo-updates` 설치, 연결된 EAS 프로젝트 초기화, native 프로젝트에 기본 구성 추가가 완료됩니다.

## 자동 설정 비활성화하기

다음 단계는 greenfield React Native 프로젝트를 지원하도록 `expo-updates`가 자동으로 자신을 설정하는 기본 동작을 비활성화하는 것입니다.

### Android에서 자동 설정 비활성화하기

자동 updates 초기화를 비활성화하는 속성을 설정하도록 **android/settings.gradle**을 아래 예시처럼 수정하세요:

### iOS에서 자동 설정 비활성화하기

CocoaPods 설치 시 environment variable을 전달해 자동 updates 초기화를 비활성화하세요.

```sh
EX_UPDATES_CUSTOM_INIT=1 npx pod-install
```

## React Native 앱이 release bundle 로딩에 expo-updates를 사용하도록 설정하기

다음 단계는 Android 및 iOS 프로젝트에 `expo-updates`를 통합해, 앱이 release build에서 앱 JavaScript의 source로 `expo-updates`를 사용하도록 만드는 것입니다.

예시

완전히 동작하는 예시는 [이 GitHub 저장소](https://github.com/expo/CustomRNView)에서 확인할 수 있습니다.

### React Native bundling에 expo-updates 통합하기

1.  Metro config가 아래 예시처럼 Expo config를 확장하는지 확인하세요:

    ```js
    // Learn more https://docs.expo.io/guides/customizing-metro
    const { getDefaultConfig } = require('expo/metro-config');

    /** @type {import('expo/metro-config').MetroConfig} */
    const config = getDefaultConfig(__dirname); // eslint-disable-line no-undef

    // Make any custom changes you need for your project by
    // directly modifying "config"

    module.exports = config;
    ```

2.  custom entry point를 사용하고 있다면, 그 안에 Expo 초기화를 포함해야 합니다. 그래야 Expo 라이브러리(`expo-updates` 포함)가 모두 올바르게 초기화됩니다. 아래 두 가지 예시를 참고하세요:

    ```jsx
    // Expo recommends using registerRootComponent().
    // It registers the component with the react-native AppRegistry,
    // and performs all required Expo initialization
    // (including expo-updates setup)

    import App from './App';
    import { registerRootComponent } from 'expo';

    registerRootComponent(App);
    ```

    ```jsx
    // If you need to keep an existing entry point that uses AppRegistry directly,
    // you will need to add a call to Expo's initialization before registering the
    // app, as shown below.
    import App from './App';
    import 'expo/src/Expo.fx';
    import { AppRegistry } from 'react-native';

    function getApp() {
      return <App />;
    }

    AppRegistry.registerComponent('App', () => getApp());
    ```

### Android에서 expo-updates 통합하기

아래 지침은 Kotlin으로 작성된 앱과 하나 이상의 native activity가 있다고 가정합니다. **android/app/src/main/java/com/<your-app-name>/MainActivity.kt**를 열고 아래 단계를 따르세요.

1.  React Native activity는 `com.facebook.react.ReactActivity`를 subclass해야 합니다.
2.  이 activity의 `onCreate()`에 updates system을 초기화하는 코드를 추가하세요. 초기화는 main thread에서 일어나면 안 됩니다(그렇지 않으면 lockup과 ANR이 발생합니다).
3.  위 JS entry point에서 등록한 앱 이름을 반환하도록 `getMainComponentName()`을 override하세요.
4.  아래와 같이 `createReactActivityDelegate()` 메서드를 override해 React Native view를 표시하세요.

```kotlin
package com.yourpackagename

import android.content.Context
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import expo.modules.ReactActivityDelegateWrapper
import expo.modules.updates.UpdatesController
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

// Step 1
class MainActivity : ReactActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        CoroutineScope(Dispatchers.IO).launch {
            startUpdatesController(applicationContext)
        }
    }

    // Step 2
    private fun startUpdatesController(context: Context) {
        UpdatesController.initialize(context)
        // Call the synchronous `launchAssetFile()` function to wait for updates ready
        UpdatesController.instance.launchAssetFile
    }

    // Step 3
    override fun getMainComponentName(): String = "App"

    // Step 4
    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return ReactActivityDelegateWrapper(
            this,
            BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
            object : DefaultReactActivityDelegate(
                this,
                mainComponentName,
                fabricEnabled
            ) {})
    }
}
```

### iOS에서 expo-updates 통합하기

아래 지침은 Swift로 작성된 앱과 custom UIViewController를 가진 하나 이상의 native screen이 있다고 가정합니다. React Native 앱을 렌더링하는 custom view controller를 추가하겠습니다.

#### AppDelegate 변경

1.  **AppDelegate.swift**가 `ExpoAppDelegate`를 확장하도록 수정하세요.
2.  아직 그렇게 하고 있지 않다면, 나중에 custom view controller가 접근할 수 있도록 실행 중인 `AppDelegate` 인스턴스를 가져오는 public 메서드를 추가하세요.
3.  iOS에서 updates system을 관리하는 `expo-updates`의 `AppController` class singleton 인스턴스에 대한 reference를 추가하세요.
4.  `ExpoReactNativeFactoryDelegate`를 확장하고, updates system이 실행 중일 때 올바른 update bundle URL을 반환하도록 `bundleUrl()` 메서드를 override하는 `CustomReactNativeFactoryDelegate`라는 새 class를 추가하세요.
5.  `didFinishLaunchingWithOptions()` 메서드는 두 단계를 수행해야 합니다:
    1.  위에서 만든 `CustomReactNativeFactoryDelegate`를 사용해 `ExpoReactNativeFactory`를 초기화합니다. 이것은 나중에 React Native root view를 만드는 데 사용됩니다.
    2.  `AppController.initializeWithoutStarting()`을 호출합니다. 이렇게 하면 controller 인스턴스는 생성되지만, 이후 updates 시작 절차는 필요할 때까지 미뤄집니다.

```swift
import Expo
import EXUpdates
import React
import ReactAppDependencyProvider
import UIKit

@UIApplicationMain
// Step 1
class AppDelegate: ExpoAppDelegate {
  var launchOptions: [UIApplication.LaunchOptionsKey: Any]?

  // Step 2
  public static func shared() -> AppDelegate {
    guard let delegate = UIApplication.shared.delegate as? AppDelegate else {
      fatalError("Could not get app delegate")
    }
    return delegate
  }

  // Step 3
  var updatesController: (any InternalAppControllerInterface)?

  // Step 5
  private func initializeReactNativeAndUpdates(_ launchOptions: [UIApplication.LaunchOptionsKey: Any]?) {
    // Step 5.1
    self.launchOptions = launchOptions
    let delegate = CustomReactNativeFactoryDelegate()
    let factory = ExpoReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeFactoryDelegate = delegate
    reactNativeFactory = factory
    // Step 5.2
    AppController.initializeWithoutStarting()
  }

  /**
   Application launch initializes the custom view controller: all React Native
   and updates initialization is handled there
   */
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    initializeReactNativeAndUpdates(launchOptions)

    // Create custom view controller, where the React Native view will be created
    self.window = UIWindow(frame: UIScreen.main.bounds)
    let controller = CustomViewController()
    controller.view.clipsToBounds = true
    self.window?.rootViewController = controller
    window?.makeKeyAndVisible()

    return true
  }

  override func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
    return super.application(app, open: url, options: options) ||
      RCTLinkingManager.application(app, open: url, options: options)
  }
}

// Step 4
class CustomReactNativeFactoryDelegate: ExpoReactNativeFactoryDelegate {
  let bundledUrl = Bundle.main.url(forResource: "main", withExtension: "jsbundle")
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    // needed to return the correct URL for expo-dev-client.
    bridge.bundleURL ?? bundleURL()
  }

  override func bundleURL() -> URL? {
    if let updatesUrl = AppDelegate.shared().updatesController?.launchAssetUrl() {
      return updatesUrl
    }
    return bundledUrl
  }
}
```

#### custom view controller 구현하기

1.  view controller는 updates protocol `AppControllerDelegate`를 구현해야 합니다.
2.  view controller 초기화는 다음을 수행해야 합니다.
    1.  위의 `bundleURL()` 메서드가 update에 대해 올바르게 동작하도록 app delegate의 updates controller 인스턴스를 설정합니다.
    2.  `AppController` delegate를 view controller 인스턴스로 설정합니다.
    3.  `AppController`를 시작합니다.
3.  마지막으로 view controller는 `AppControllerDelegate` protocol의 유일한 메서드인 `appController(_ appController: AppControllerInterface, didStartWithSuccess success: Bool)`를 구현해야 합니다. 이 메서드는 updates system이 완전히 초기화되고 최신 update(또는 embedded bundle)가 렌더링 준비가 되었을 때 호출됩니다.
    1.  app delegate가 만든 `ExpoReactNativeFactory`를 사용해 React Native root view를 생성합니다. 여기 전달하는 앱 이름은 위 JS entry point에 등록한 앱 이름과 일치해야 합니다.
    2.  이 root view를 view controller에 추가합니다.

```swift
import UIKit
import EXUpdates
import ExpoModulesCore

/**
 Custom view controller that handles React Native and expo-updates initialization
 */
// Step 1
public class CustomViewController: UIViewController, AppControllerDelegate {
  let appDelegate = AppDelegate.shared()

  // Step 2
  public convenience init() {
    self.init(nibName: nil, bundle: nil)
    self.view.backgroundColor = .clear
    // Step 2.1
    appDelegate.updatesController = AppController.sharedInstance
    // Step 2.2
    AppController.sharedInstance.delegate = self
    // Step 2.3
    AppController.sharedInstance.start()
  }

  required public override init(nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?) {
    super.init(nibName: nibNameOrNil, bundle: nibBundleOrNil)
  }

  @available(*, unavailable)
  required public init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  // Step 3
  public func appController(
    _ appController: AppControllerInterface,
    didStartWithSuccess success: Bool
  ) {
    createView()
  }

  private func createView() {
    // Step 3.1
    guard let rootViewFactory: RCTRootViewFactory = appDelegate.reactNativeFactory?.rootViewFactory else {
      fatalError("rootViewFactory has not been initialized")
    }
    let rootView = rootViewFactory.view(
      withModuleName: "main",
      initialProperties: [:],
      launchOptions: appDelegate.launchOptions
    )
    // Step 3.2
    let controller = self
    controller.view.clipsToBounds = true
    controller.view.addSubview(rootView)
    rootView.translatesAutoresizingMaskIntoConstraints = false
    NSLayoutConstraint.activate([
      rootView.topAnchor.constraint(equalTo: controller.view.safeAreaLayoutGuide.topAnchor),
      rootView.bottomAnchor.constraint(equalTo: controller.view.safeAreaLayoutGuide.bottomAnchor),
      rootView.leadingAnchor.constraint(equalTo: controller.view.safeAreaLayoutGuide.leadingAnchor),
      rootView.trailingAnchor.constraint(equalTo: controller.view.safeAreaLayoutGuide.trailingAnchor)
    ])
  }
}
```

## 자주 묻는 질문

이 기능을 앱에 추가하는 데 얼마나 걸리나요?

Expo SDK가 지원하는 최신 React Native version을 사용하고 있고, native project 안에서의 React Native 통합에 익숙하다면, 대체로 CodePush나 Sentry 같은 도구를 통합하는 데 걸리는 시간과 비슷한 정도로 EAS Update를 통합할 수 있을 것입니다.

가장 중요한 요소는 앱이 사용하는 React Native version입니다. 앱이 Expo SDK가 지원하는 최신 version보다 오래된 버전을 사용하고 있다면(이 가이드 상단에 언급된 기준), 먼저 해당 version으로 업그레이드해야 하며, 그에 걸리는 시간은 앱의 크기와 복잡도, 그리고 작업하는 팀의 역량과 경험 수준에 크게 좌우됩니다.

CodePush에서 마이그레이션 중인데, 추가로 알아야 할 것이 있나요?

자세한 내용은 [CodePush에서 마이그레이션하기](/eas-update/codepush) 가이드를 참고하세요.
