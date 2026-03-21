---
modificationDate: March 01, 2026
title: Glossary of terms
description: List of non-obvious terms used within the documentation, related to Expo or cross-platform development in general.
---

# Glossary of terms

List of non-obvious terms used within the documentation, related to Expo or cross-platform development in general.

### Android

The mobile operating system that is sponsored by Google for use with **Android** devices.

### App config

A file named **app.json**, **app.config.json**, **app.config.js**, or **app.config.ts** in the root project directory. For more information, see [app config configuration](/workflow/configuration).

This file is used for the following purposes:

-   To configure how [Expo CLI](/more/glossary-of-terms#expo-cli) works.
-   Generate a project's public [manifest](/more/glossary-of-terms#manifest) in EAS Update (think **index.html** but for native apps).
-   List Expo [config plugins](/more/glossary-of-terms#config-plugin) which influence how `npx expo prebuild` generates native code.

### app.json

An [app config](/more/glossary-of-terms#app-config) file.

### Apple capabilities

Cloud services that are provided by Apple. These services must be enabled for an application in the [Apple Developer Portal](/more/glossary-of-terms#apple-developer-portal).

### Apple Developer Portal

Apple's [official website](https://developer.apple.com/) for managing application code signing. EAS Credentials automate most of the common reasons a developer might visit this website when developing an app.

### Auto capability signing

A feature of EAS Build that automatically enables or disables [Apple capabilities](/more/glossary-of-terms#apple-capabilities) based on the project's entitlements file. [Learn more](/build-reference/ios-capabilities).

### Autolinking

A cross-platform tool for automatically linking native modules to native apps via native package managers.

-   On Android the tool is used in the **android/app/build.gradle** and invoked during the [Gradle](/more/glossary-of-terms#gradle) sync process.
-   On iOS the tool is used in [CocoaPods](/more/glossary-of-terms#cocoapods) **ios/Podfile** and invoked during `pod install`.

There are two versions of Autolinking: [Expo Autolinking](/more/glossary-of-terms#expo-autolinking), and [Community Autolinking](/more/glossary-of-terms#community-autolinking).

The default [Prebuild template](/more/glossary-of-terms#prebuild-template) includes support for [Expo Autolinking](/more/glossary-of-terms#expo-autolinking), and the [Community Autolinking](/more/glossary-of-terms#community-autolinking) fork.

### Babel

Transpiler used for removing language features that aren't available in the runtime's [JavaScript engine](/more/glossary-of-terms#javascript-engine). [Metro](/more/glossary-of-terms#metro-bundler) uses Babel internally.

Projects can configure how Babel is used by modifying the [**babel.config.js**](/versions/latest/config/babel) file in the project directory. This file is optional when using [Expo CLI](/more/glossary-of-terms#expo-cli). Expo projects should extend the default Babel preset [`babel-preset-expo`](https://github.com/expo/expo/tree/main/packages/babel-preset-expo).

### Bare workflow

Describes the approach when the native projects (in the **android** and **ios** directories) are versioned in Git and maintained manually. It's typical for **existing "bare" React Native apps** where you manually make changes to the native projects. There is freedom to customize them but also high maintenance overhead.

This is in contrast to using [app config and prebuild](/workflow/continuous-native-generation), where the native projects are not versioned. Instead, they are generated on demand using the `npx expo prebuild`, which is the [recommended approach](/workflow/continuous-native-generation).

### Bun

A JavaScript runtime and a drop-in alternative for Node.js. Bun can also be used as a [package manager for JavaScript](/more/glossary-of-terms#package-manager). For more information about usage with Expo and EAS, see [using Bun](/guides/using-bun) guide.

### CocoaPods

The iOS package manager that is used to link native modules to the native iOS project. This package manager is configured using the **ios/Podfile** file and updated when a user runs `pod install` in the **ios** directory.

### Community Autolinking

This refers to the React Native community [fork](https://github.com/react-native-community/cli/issues/248#issue-422591744) of the [Expo Autolinking](/more/glossary-of-terms#expo-autolinking). The requirements for linking a module are different from [Expo Autolinking](/more/glossary-of-terms#expo-autolinking), however, the implementation is the same.

### Config introspection

A process for evaluating the results of [`npx expo prebuild`](/more/glossary-of-terms#prebuild) in-memory without persisting any code changes. This is used in [Auto Capability Signing](/more/glossary-of-terms#auto-capability-signing) to determine what the entitlements file will look like without generating any native code. This process is also used in the [VS Code Expo](/more/glossary-of-terms#vs-code-expo) extension to debug [Config Mods](/more/glossary-of-terms#config-mods).

### Config Mods

Async functions that are appended to the [app config](/more/glossary-of-terms#app-config) for use in [Prebuild](/more/glossary-of-terms#prebuild). These functions are given a single native file to modify such as **AndroidManifest.xml** or **Info.plist**. Config mods are chained together and come from the package `@expo/config-plugins`. For more information, see [Config plugins](/config-plugins/introduction).

### Config Plugin

A JavaScript function that is used to append [config mods](/more/glossary-of-terms#config-mods) to the [app Config](/more/glossary-of-terms#app-config) for use in [Prebuild](/more/glossary-of-terms#prebuild). For more information, see [Config Plugins](/config-plugins/introduction).

### Continuous Native Generation (CNG)

An abstract concept that describes the process of generating native projects from a set of inputs. In the context of Expo, CNG is implemented via the [`prebuild`](/more/glossary-of-terms#prebuild) command. See [Continuous Native Generation](/workflow/continuous-native-generation) for more information.

### create-expo-app

A standalone command line tool (CLI) for bootstrapping new React Native apps with the `expo` package installed. See [`create-expo-app` reference](/more/create-expo) for more information.

### create-react-native-app

A standalone command line tool (CLI) for bootstrapping new React Native apps with the `expo` package installed and the native code generated. This CLI also enables the use of bootstrapping from an example project in [expo/examples](https://github.com/expo/examples).

This package can be used by running any of the following commands:

-   `npx create-expo-app`
-   `yarn create expo-app`
-   `npm create expo-app`

### Dangerous mods

Config [modifiers](/more/glossary-of-terms#config-mods) that apply unstable changes to a native project during [prebuild](/more/glossary-of-terms#prebuild). Using these modifiers is unpredictable and prone to breaking changes between major version bumps in [Expo SDK](/more/glossary-of-terms#expo-sdk). For more information, see [Using a dangerous mod](/config-plugins/dangerous-mods).

### Development build

A development build is a debug build of your app that contains the `expo-dev-client` package. It's like an evolution of [Expo Go](/more/glossary-of-terms#expo-go) which doesn't have Expo Go's limitations and can be customized to your application's needs.

This is the recommended approach for building production-grade apps with Expo. For more information, see [Development builds](/get-started/set-up-your-environment?mode=development-build).

### Dev clients

`expo-dev-client` is a library that allows you to create a development build and includes useful development tools. You might also come across "custom dev client", a synonym for [Development builds](/more/glossary-of-terms#development-build).

### Development server

A development server (or dev server) is a server that is started locally, usually by running `npx expo start` from [Expo CLI](/more/glossary-of-terms#expo-cli).

The development server is typically hosted on `http://localhost:8081`. It hosts a [manifest](/more/glossary-of-terms#manifest) from `/` which the client uses to request the JavaScript bundle from the bundler.

### EAS

[Expo Application Services (EAS)](/eas) are deeply integrated cloud services for Expo and React Native apps, such as [EAS Build](/build/introduction), [EAS Submit](/submit/introduction) and [EAS Update](/eas-update/introduction).

### EAS CLI

The command-line tool for working with EAS.

### EAS Config

The **eas.json** file used to configure [EAS CLI](/more/glossary-of-terms#eas-cli). For more information, see [Configuring EAS Build with eas.json](/build/eas-json).

### EAS Metadata

A command-line tool for uploading and downloading Apple App Store metadata as JSON. This tool is available in the [EAS CLI](/more/glossary-of-terms#eas-cli) package and should be used to improve the iOS submission process. For more information, see [EAS Metadata](/eas/metadata).

### EAS Update

1.  The cloud hosting service [EAS Update](/eas-update/introduction) that is used for OTA Updates.
2.  The CLI command `eas update` from [EAS CLI](/more/glossary-of-terms#eas-cli) used to publish static files to the cloud hosting service.

### Emulator

Emulator is used to describe software emulators of Android devices on your computers. Typically, iOS emulators are referred to as [Simulators](/more/glossary-of-terms#simulator).

### Entry point

The entry point usually refers to the initial JavaScript file used to load an application. In apps using [Expo CLI](/more/glossary-of-terms#expo-cli), the default entry point is **./node_modules/expo/AppEntry.js** which simply imports the **App.js** file from the root project directory and registers it as the initial component in the native app.

### Experience

A synonym for an app that usually implies something more single-use and smaller in scope, sometimes artistic and whimsical.

### Expo Autolinking

The original [Autolinking](/more/glossary-of-terms#autolinking) system is designed for projects using `expo-modules-core`. This system links modules based on the existence of an **expo-module.config.json** in the library's root directory.

### Expo CLI

The command-line tool for working with Expo. This term now refers to the [Local Expo CLI](/more/glossary-of-terms#local-expo-cli), but historically referred to the [Global Expo CLI](/more/glossary-of-terms#global-expo-cli). For more information, see [Expo CLI](/more/expo-cli).

### Expo client

The former name for the [Expo Go](/more/glossary-of-terms#expo-go) app.

### Expo export

Refers to the command `npx expo export` from [Expo CLI](/more/glossary-of-terms#expo-cli). This command is used to bundle the app's JavaScript and assets, and then export them into a static directory that can be uploaded to a hosting service like [EAS Update](/more/glossary-of-terms#eas-update), and embedded in a [native runtime](/more/glossary-of-terms#native-runtime) for offline use.

### Expo Go

The Android and iOS app that serves as a sandbox for learning and experimenting with React Native.

Due to its limitations (such as the inability to include custom native code), it's not recommended for building and distributing production apps. Instead, use a [development build](/more/glossary-of-terms#development-build).

### Expo install

Refers to the command `npx expo install` from [Expo CLI](/more/glossary-of-terms#expo-cli). This command is used to install npm packages containing [native modules](/more/glossary-of-terms#native-module) that work with the currently installed version of `expo` in the project. Not all packages are supported. This command wraps the globally installed [package managers](/more/glossary-of-terms#package-manager).

### Expo Module Config

A file named **expo-module.config.json** that lives in the root directory of a [native module](/more/glossary-of-terms#native-module). For more information, see [Module Config](/modules/module-config).

### Expo SDK

A collection of [npm](/more/glossary-of-terms#npm) packages containing [native modules](/more/glossary-of-terms#native-module) that provides access to device/system functionality such as camera, push notification, contacts, file system, and more.

-   Each package supports Android, iOS, and web whenever possible.
-   The interface is completely written in [TypeScript](/more/glossary-of-terms#typescript).
-   All packages in the Expo SDK work with each other and can safely be compiled together.
-   Any package in the SDK can be used in any [React Native](/more/glossary-of-terms#react-native) app, with minimal, shared setup. [Learn more](/bare/installing-expo-modules).
-   All packages are [open source](https://github.com/expo/expo/tree/main/packages) and can be freely customized.

### Expo start

Refers to the command `npx expo start` from [Expo CLI](/more/glossary-of-terms#expo-cli). This command is used to start a local [development server](/more/glossary-of-terms#development-server) that a [client](/more/glossary-of-terms#expo-client) connects to interact with the [Metro bundler](/more/glossary-of-terms#metro-bundler).

### Fabric

The React Native rendering system which is used to create and manage native views. For more information, see [Fabric Renderer](https://reactnative.dev/architecture/fabric-renderer).

### Flipper

A mobile app debugger used internally at Meta. It was previously recommended for use with React Native, but the integration is now deprecated and no longer supported by the React Native team [(RFC-0641)](https://github.com/react-native-community/discussions-and-proposals/blob/main/proposals/0641-decoupling-flipper-from-react-native-core.md).

### FYI

Sometimes referred to as **Expo FYI**, is a collection of tailored solutions to complex issues that live at [expo.fyi](https://expo.fyi/). FYI links are utilized throughout Expo's developer tooling to help provide a better developer experience to users.

### Global Expo CLI

The package `expo-cli` was installed globally on the user's machine and used across all projects. This CLI was introduced in SDK 30 (2018), and deprecated in favor of the [Local Expo CLI](/more/glossary-of-terms#local-expo-cli) in SDK 46 (2022).

### Gradle

Gradle is a build automation tool for multi-language software development. It's used to build Android apps. It controls the development process in the tasks of compilation and packaging to testing, deployment, and publishing.

### Hermes engine

A [JavaScript engine](/more/glossary-of-terms#javascript-engine) developed by [Meta](/more/glossary-of-terms#meta) specifically for use with [React Native](/more/glossary-of-terms#react-native). Hermes features ahead-of-time static optimization and compact bytecode to improve performance with focus on mobile devices, and is the default JS engine.

### iOS

The operating system used on iPhone, iPad, and Apple TV. [Expo Go](/more/glossary-of-terms#expo-go) currently runs on iOS for iPhone and iPad.

### JavaScript engine

A native package that can evaluate JavaScript on-device. In React Native, we predominantly use [Hermes](/more/glossary-of-terms#hermes-engine) by [Meta](/more/glossary-of-terms#meta). Other options include [JavaScriptCore](/more/glossary-of-terms#javascriptcore-engine) by Apple, and V8 by Google.

### JavaScriptCore engine

A [JavaScript engine](/more/glossary-of-terms#javascript-engine) developed by Apple and built-in to [iOS](/more/glossary-of-terms#ios). React Native for [Android](/more/glossary-of-terms#android) also can use a version of JavaScriptCore for parity. Debugging with JavaScriptCore is less sophisticated than V8 or [Hermes](/more/glossary-of-terms#hermes-engine) which implement the [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/).

### Linking

Linking can mean [deep linking into apps similar to how you link to websites on the web](/linking/overview) or [autolinking](/more/glossary-of-terms#autolinking).

### Local Expo CLI

The package `@expo/cli` is installed with the `expo` package. This is sometimes referred to as the "Versioned Expo CLI" because it is installed inside the user's project as opposed to the now deprecated `expo-cli` which was installed globally.

### Manifest

An Expo app manifest is similar to a [web app manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest). It provides information that Expo Go needs to know how to run the app and other relevant data.

### Meta

Formerly Facebook, Meta is the group that develops [React Native](/more/glossary-of-terms#react-native), [Metro Bundler](/more/glossary-of-terms#metro-bundler), [Hermes Engine](/more/glossary-of-terms#hermes-engine), [Yoga](/more/glossary-of-terms#yoga) and more. The Expo team collaborates with Meta to deliver the best possible developer experience.

### Metro bundler

The bundler used for converting JavaScript files and assets into a format that runs on a [native runtime](/more/glossary-of-terms#native-runtime). This bundler is maintained by [Meta](/more/glossary-of-terms#meta) and used for React Native (including web) apps. For more information, see [Metro documentation](https://metrobundler.dev/).

### Metro config

The **metro.config.js** file used to configure [Metro bundler](/more/glossary-of-terms#metro-bundler). This should extend the package `@expo/metro-config` when using [Expo CLI](/more/glossary-of-terms#expo-cli). For more information, see [Customizing Metro](/guides/customizing-metro).

### Monorepo

A project that has multiple sub-projects which are all linked together via the package manager. A monorepo is a great way to maintain codebase for a cross-platform app.

### Native directory

The React Native ecosystem has thousands of libraries. Without a purpose-built tool, it's hard to know what the libraries are, to search through them, to determine the quality, try them out, and filter out the libraries that won't work for your project (some don't work with Expo, some don't work with Android or iOS). [React Native Directory](https://reactnative.directory/) is a website that aims to solve this problem, we recommend you use it to find packages to use in your projects.

### Native module

A module written in native code that exposes native platform functionality to the JavaScript engine via the JS global. This functionality is usually accessed via `import { NativeModules } from 'react-native';`.

### Native runtime

A native application containing a [JavaScript engine](/more/glossary-of-terms#javascript-engine), and is capable of running a React application. This includes [Expo Go](/more/glossary-of-terms#expo-go), [development build](/more/glossary-of-terms#development-build), [standalone apps](/more/glossary-of-terms#standalone-app), and even web browsers like Chrome.

### npm

[npm](https://www.npmjs.com/) is a [package manager for JavaScript](/more/glossary-of-terms#package-manager) and the registry where the packages are stored.

### Package manager

Automates the process of installing, upgrading, configuring, and removing libraries, also known as dependencies, from your project. See [Bun](/more/glossary-of-terms#bun), [npm](/more/glossary-of-terms#npm), [pnpm](/more/glossary-of-terms#pnpm), and [Yarn](/more/glossary-of-terms#yarn).

### Package manager workspaces

The recommended [monorepo](/more/glossary-of-terms#monorepo) solution for Expo users. See [Working with Monorepos](/guides/monorepos) guide for more information on how to configure workspaces with supported package managers.

### Platform extensions

Platform extensions are a feature of the [Metro bundler](/more/glossary-of-terms#metro-bundler) which enables users to substitute files on a per-platform basis given a specific filename. For example, if a project has a **.index.js** file and a **.index.ios.js** file, then the **index.ios.js** will be used when bundling for iOS, and the **index.js** file will be used when bundling for all other platforms.

By default, platform extensions are resolved in `@expo/metro-config` using the following formula:

-   Android: **\*.android.js**, **\*.native.js**, **\*.js**
-   iOS: **\*.ios.js**, **\*.native.js**, **\*.js**
-   Web: **\*.web.js**, **\*.js**

### pnpm

[pnpm](https://pnpm.io/) is [package manager for JavaScript](/more/glossary-of-terms#package-manager), focused on disk space efficiency.

### Prebuild

The process of generating the temporary native **android** and **ios** directories for a React Native project based on the [app config](/more/glossary-of-terms#app-config). This process is performed by running the command `npx expo prebuild` from [Expo CLI](/more/glossary-of-terms#expo-cli) in a project directory.

See [Prebuild template](/more/glossary-of-terms#prebuild-template) and [Autolinking](/more/glossary-of-terms#autolinking) for further information.

### Prebuild template

The React Native project template is used as the first step of [Prebuilding](/more/glossary-of-terms#prebuild). This template is versioned with the [Expo SDK](/more/glossary-of-terms#expo-sdk), and the template is chosen based on the installed version of `expo` in a project. After the template is cloned, `npx expo prebuild` evaluates the [app config](/more/glossary-of-terms#app-config) and runs the [Config mods](/more/glossary-of-terms#config-mods) which modify various files in the template.

Although the template can be changed by using the `npx expo prebuild --template /path/to/template` flag, the default prebuild template contains important initial defaults that the `npx expo prebuild` command makes assumptions about.

The default template currently lives at [`expo-template-bare-minimum`](https://github.com/expo/expo/tree/main/templates/expo-template-bare-minimum).

### Publish

We use the word "publish" as a synonym for "deploy". When you publish an app, it becomes available at a persistent URL from Expo Go, or in the case of [Standalone apps](/more/glossary-of-terms#standalone-app), it updates the app.

### React Native

[React Native](https://reactnative.dev/) lets you build mobile apps using only JavaScript. It uses the same design as React, letting you compose a rich mobile UI from declarative components.

### React Native Web

A high-performing abstraction on top of `react-dom` that enables core primitives from [React Native](/more/glossary-of-terms#react-native) to run in the browser. React Native for web (RNW) was developed at X and is currently used for their [main website](https://x.com). [Expo SDK](/more/glossary-of-terms#expo-sdk) and [Expo CLI](/more/glossary-of-terms#expo-cli) have first-class support for RNW.

### React Navigation

The preferred navigation library for React Native apps, developed and sponsored by the Expo team.

### Remote Debugging

Remote Debugging is a deprecated way of debugging React Native apps. A better alternative today is to use [Hermes](/more/glossary-of-terms#hermes-engine), as you can connect React Native DevTools to it.

Also known as Async Chrome Debugging, it was an experimental system for debugging React Native apps. The system works by executing the application JavaScript in a Chrome tab's web worker, then sending native commands over a websocket to the native device.

### Simulator

An emulator for iOS devices that you can run on macOS (or in [Snack](/more/glossary-of-terms#snack)) to work on your app without having to have a physical device handy.

### Slug

`slug` in the \[app config\]((#appjson) is a URL-friendly name for your project. It is unique across your Expo account.

### Snack

[Snack](https://snack.expo.dev/) is an in-browser development environment where you can build Expo [experiences](/more/glossary-of-terms#experience) without installing any tools on your phone or computer.

### Software Mansion

A development agency in Kraków, Poland. Maintainers of `react-native-gesture-handler`, `react-native-screens`, and `react-native-reanimated`. The platform team at Expo is composed of a number of contractors from Software Mansion. All of Software Mansion's core React Native libraries are supported in [Expo Go](/more/glossary-of-terms#expo-go).

### Standalone app

Synonymous with "Production build". An application binary that can be submitted to the Google Play Store or Apple App Store. For more information, see [Build your project for app stores](/deploy/build-project) or [Run builds locally or on your own infrastructure](/build-reference/local-builds).

### Store config

The **store.config.json** file used to configure [EAS Metadata](/more/glossary-of-terms#eas-metadata). This file can be generated from an existing App Store entry using `eas metadata:pull`.

### Sweet API

The Swift and Kotlin API for writing React Native modules. This API is provided by the library `expo-modules-core` which is shipped with the `expo` package. For more information, see [Module API](/modules/module-api).

### TypeScript

TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale. The Expo SDK is written in TypeScript, and we highly recommend using it. For more information, see our [TypeScript guide](/guides/typescript).

### Updates

Traditionally, apps for Android and iOS are updated by submitting an updated binary to the App and Play stores. Updates allow you to push an update to your app without the overhead of submitting a new release to the stores. For more information, see [Publishing](/eas-update/introduction) documentation.

### VS Code Expo Tools

The VS Code extension for improving the developer experience of working with app config files. This extension provides autocomplete and intellisense for the [app config](/more/glossary-of-terms#app-config), [Store Config](/more/glossary-of-terms#store-config), [Expo Module Config](/more/glossary-of-terms#expo-module-config), and [EAS Config](/more/glossary-of-terms#eas-config). For more information, see the [VS Code Expo Tools extension](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools).

### Watchman

The file watcher used by [Metro](/more/glossary-of-terms#metro-bundler) to perform hot reloads during development. Watchman contains native code and may cause issues when installed globally. Watchman is maintained by [Meta](/more/glossary-of-terms#meta).

### webpack

The deprecated bundler used by [Expo CLI](/more/glossary-of-terms#expo-cli) for developing [`react-native-web`](/more/glossary-of-terms#react-native-web) apps.

### Yarn

[Yarn](https://yarnpkg.com/) is a [package manager for JavaScript](/more/glossary-of-terms#package-manager), created at Meta. It has two mainline versions [Yarn v1 (Classic)](https://classic.yarnpkg.com/lang/en/) and [Yarn Berry](https://github.com/yarnpkg/berry).

### Yoga

A native cross-platform library used by React Native internally to provide [CSS FlexBox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox) support to native views. React Native styles are passed to Yoga to lay out and style elements on the screen. For more information, see [Yoga](https://github.com/facebook/yoga) documentation.
