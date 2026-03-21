---
modificationDate: June 10, 2024
title: 네이티브 프로젝트 업그레이드 헬퍼
description: 다음 Expo SDK 버전으로 업그레이드하기 위해 네이티브 프로젝트에 적용해야 하는 모든 변경 사항을 파일 단위 diff로 확인하세요.
---

# 네이티브 프로젝트 업그레이드 헬퍼

다음 Expo SDK 버전으로 업그레이드하기 위해 네이티브 프로젝트에 적용해야 하는 모든 변경 사항을 파일 단위 diff로 확인하세요.

네이티브 프로젝트(이전 명칭 bare workflow)를 직접 관리하고 있다면, [최신 Expo SDK로 업그레이드](/workflow/upgrading-expo-sdk-walkthrough)하려면 네이티브 프로젝트에 변경을 해야 합니다. 어떤 네이티브 파일이 바뀌는지, 어느 파일에서 무엇을 업데이트해야 하는지 찾는 일은 복잡할 수 있습니다.

다음 가이드는 프로젝트의 현재 SDK 버전과 업그레이드하려는 대상 SDK 버전 사이에서 네이티브 프로젝트 파일을 비교할 수 있는 diff를 제공합니다. 프로젝트가 사용하는 `expo` 패키지 버전에 따라 이 diff를 참고하여 프로젝트에 변경 사항을 적용할 수 있습니다. 이 페이지의 도구는 [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/)와 비슷하지만, Expo modules와 관련 도구를 사용하는 프로젝트에 맞춰져 있습니다.

> 네이티브 코드를 아예 업그레이드하지 않는 방법에 관심이 있나요? [Continuous Native Generation (CNG)](/workflow/continuous-native-generation)를 참고해 Expo Prebuild가 빌드 전에 네이티브 프로젝트를 생성하는 방법을 알아보세요.

## 네이티브 프로젝트 파일 업그레이드하기

[Expo SDK 버전과 관련 의존성을 업그레이드](/workflow/upgrading-expo-sdk-walkthrough#how-to-upgrade-to-the-latest-sdk-version)한 뒤에는 아래 diff 도구를 사용해 네이티브 프로젝트에 어떤 변경이 필요한지 확인하고, 현재 Expo SDK 버전에 맞게 최신 상태로 가져가세요.

생성된 diff를 보려면 **from SDK version**과 **to SDK version**을 선택하세요. 그런 다음 복사해서 붙여넣거나 직접 프로젝트 파일을 수정하여 해당 변경 사항을 네이티브 프로젝트에 적용하세요.

#### 시작 SDK 버전:

#### 대상 SDK 버전:

### SDK 54에서 55로의 네이티브 코드 변경 사항

[android/app/build.gradleMODIFIED](#androidappbuildgradle)

```diff
react {
  entryFile = file(["node", "-e", "require('expo/scripts/resolveAppEntry')", projectRoot, "android", "absolute"].execute(null, rootDir).text.trim())
  reactNativeDir = new File(["node", "--print", "require.resolve('react-native/package.json')"].execute(null, rootDir).text.trim()).getParentFile().getAbsoluteFile()
- hermesCommand = new File(["node", "--print", "require.resolve('react-native/package.json')"].execute(null, rootDir).text.trim()).getParentFile().getAbsolutePath() + "/sdks/hermesc/%OS-BIN%/hermesc"
+ hermesCommand = new File(["node", "--print", "require.resolve('hermes-compiler/package.json', { paths: [require.resolve('react-native/package.json')] })"].execute(null, rootDir).text.trim()).getParentFile().getAbsolutePath() + "/hermesc/%OS-BIN%/hermesc"
  codegenDir = new File(["node", "--print", "require.resolve('@react-native/codegen/package.json', { paths: [require.resolve('react-native/package.json')] })"].execute(null, rootDir).text.trim()).getParentFile().getAbsoluteFile()
  enableBundleCompression = (findProperty('android.enableBundleCompression') ?: false).toBoolean()
```

[android/app/src/main/AndroidManifest.xmlMODIFIED](#androidappsrcmainandroidmanifestxml)

```diff
- 
- 
+ 
+ 
  
  
  
  
- 
+
```

[android/app/src/main/java/com/helloworld/MainApplication.ktMODIFIED](#androidappsrcmainjavacomhelloworldmainapplicationkt)

```diff
import com.facebook.react.PackageList
  import com.facebook.react.ReactApplication
  import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
- import com.facebook.react.ReactNativeHost
  import com.facebook.react.ReactPackage
  import com.facebook.react.ReactHost
  import com.facebook.react.common.ReleaseLevel
  import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint
- import com.facebook.react.defaults.DefaultReactNativeHost
  import expo.modules.ApplicationLifecycleDispatcher
- import expo.modules.ReactNativeHostWrapper
+ import expo.modules.ExpoReactHostFactory
  class MainApplication : Application(), ReactApplication {
- override val reactNativeHost: ReactNativeHost = ReactNativeHostWrapper(
- this,
- object : DefaultReactNativeHost(this) {
- override fun getPackages(): List =
- PackageList(this).packages.apply {
- // Packages that cannot be autolinked yet can be added manually here, for example:
- // add(MyReactNativePackage())
- }
- override fun getJSMainModuleName(): String = ".expo/.virtual-metro-entry"
- override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG
- override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
- }
- )
- override val reactHost: ReactHost
- get() = ReactNativeHostWrapper.createReactHost(applicationContext, reactNativeHost)
+ override val reactHost: ReactHost by lazy {
+ ExpoReactHostFactory.getDefaultReactHost(
+ context = applicationContext,
+ packageList =
+ PackageList(this).packages.apply {
+ // Packages that cannot be autolinked yet can be added manually here, for example:
+ // add(MyReactNativePackage())
+ }
+ )
+ }
  override fun onCreate() {
  super.onCreate()
```

[android/gradle/wrapper/gradle-wrapper.propertiesMODIFIED](#androidgradlewrappergradle-wrapperproperties)

```diff
distributionBase=GRADLE_USER_HOME
  distributionPath=wrapper/dists
- distributionUrl=https\://services.gradle.org/distributions/gradle-8.14.3-bin.zip
+ distributionUrl=https\://services.gradle.org/distributions/gradle-9.0.0-bin.zip
  networkTimeout=10000
  validateDistributionUrl=true
  zipStoreBase=GRADLE_USER_HOME
```

[android/gradlewMODIFIED](#androidgradlew)

```diff
#!/bin/sh
  #
- # Copyright © 2015-2021 the original authors.
+ # Copyright © 2015 the original authors.
  #
  # Licensed under the Apache License, Version 2.0 (the "License");
  # you may not use this file except in compliance with the License.
```

[ios/HelloWorld/AppDelegate.swiftMODIFIED](#ioshelloworldappdelegateswift)

```diff
- import Expo
+ internal import Expo
  import React
  import ReactAppDependencyProvider
- @UIApplicationMain
- public class AppDelegate: ExpoAppDelegate {
+ @main
+ class AppDelegate: ExpoAppDelegate {
  var window: UIWindow?
  var reactNativeDelegate: ExpoReactNativeFactoryDelegate?
  reactNativeDelegate = delegate
  reactNativeFactory = factory
- bindReactNativeFactory(factory)
  #if os(iOS) || os(tvOS)
  window = UIWindow(frame: UIScreen.main.bounds)
```

[ios/PodfileMODIFIED](#iospodfile)

```diff
def ccache_enabled?(podfile_properties)
  # Environment variable takes precedence
  return ENV['USE_CCACHE'] == '1' if ENV['USE_CCACHE']
  # Fall back to Podfile properties
  podfile_properties['apple.ccacheEnabled'] == 'true'
  end
- ENV['RCT_NEW_ARCH_ENABLED'] ||= '0' if podfile_properties['newArchEnabled'] == 'false'
  ENV['EX_DEV_CLIENT_NETWORK_INSPECTOR'] ||= podfile_properties['EX_DEV_CLIENT_NETWORK_INSPECTOR']
- ENV['RCT_USE_RN_DEP'] ||= '1' if podfile_properties['ios.buildReactNativeFromSource'] != 'true' && podfile_properties['newArchEnabled'] != 'false'
- ENV['RCT_USE_PREBUILT_RNCORE'] ||= '1' if podfile_properties['ios.buildReactNativeFromSource'] != 'true' && podfile_properties['newArchEnabled'] != 'false'
+ ENV['RCT_USE_RN_DEP'] ||= '1' if podfile_properties['ios.buildReactNativeFromSource'] != 'true'
+ ENV['RCT_USE_PREBUILT_RNCORE'] ||= '1' if podfile_properties['ios.buildReactNativeFromSource'] != 'true'
+ ENV['RCT_HERMES_V1_ENABLED'] ||= '1' if podfile_properties['expo.useHermesV1'] == 'true'
  platform :ios, podfile_properties['ios.deploymentTarget'] || '15.1'
  prepare_react_native_project!
```

[package.jsonMODIFIED](#packagejson)

```diff
"name": "expo-template-bare-minimum",
  "description": "This bare project template includes a minimal setup for using unimodules with React Native.",
  "license": "0BSD",
- "version": "54.0.50",
+ "version": "55.0.8",
  "main": "index.js",
  "scripts": {
  "start": "expo start --dev-client",
  "web": "expo start --web"
  },
  "dependencies": {
- "expo": "~54.0.33",
- "expo-status-bar": "~3.0.9",
- "react": "19.1.0",
- "react-native": "0.81.5"
+ "expo": "~55.0.0-preview.9",
+ "expo-status-bar": "~55.0.2",
+ "react": "19.2.0",
+ "react-native": "0.83.1"
  }
  }
```
