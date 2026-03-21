---
modificationDate: October 22, 2025
title: iOS build process
description: Learn how an iOS project is built on EAS Build.
---

# iOS build process

Learn how an iOS project is built on EAS Build.

This page describes the process of building iOS projects with EAS Build. You may want to read this if you are interested in the implementation details of the build service.

## Build process

Let's take a closer look at the steps for building iOS projects with EAS Build. We'll first run some steps on your local machine to prepare the project, and then we'll build the project on a remote service.

### Local steps

The first phase happens on your computer. EAS CLI is in charge of completing the following steps:

1.  If `cli.requireCommit` is set to `true` in **eas.json**, check if the git index is clean - this means that there aren't any uncommitted changes. If it's not clean, EAS CLI will provide an option to commit local changes for you or abort the build process.
    
2.  Prepare the credentials needed for the build.
    
    -   Depending on the value of `builds.ios.PROFILE_NAME.credentialsSource`, the credentials are obtained from either the local **credentials.json** file or from the EAS servers. If the `remote` mode is selected but no credentials exist yet, you're offered to generate them.
3.  **Bare** projects require an additional step: check whether the Xcode project is configured to be buildable on the EAS servers (to ensure the correct bundle identifier and Apple Team ID are set).
    
4.  Create the tarball containing a copy of the repository. Actual behavior depends on the [VCS workflow](https://expo.fyi/eas-vcs-workflow) you are using.
    
5.  Upload the project tarball to a private AWS S3 bucket and send the build request to EAS Build.
    

### Remote steps

In this next phase, this is what happens when EAS Build picks up your request:

1.  Create a new macOS VM for the build.
    
    -   Every build gets its own fresh macOS VM with all build tools installed there (Xcode, Fastlane, and so on).
2.  Download the project tarball from a private AWS S3 bucket and unpack it.
    
3.  [Create **.npmrc**](/build-reference/private-npm-packages) if `NPM_TOKEN` is set.
    
4.  Run the `eas-build-pre-install` script from **package.json** if defined.
    
5.  Run `npm install` in the project root (or `yarn install` if **yarn.lock** exists).
    
6.  Run `npx expo-doctor` to diagnose potential issues with your project configuration.
    
7.  Restore the credentials
    
    -   Create a new keychain.
    -   Import the Distribution Certificate into the keychain.
    -   Write the Provisioning Profile to the **~/Library/MobileDevice/Provisioning Profiles** directory.
    -   Verify that the Distribution Certificate and Provisioning Profile match (every Provisioning Profile is assigned to a particular Distribution Certificate and cannot be used for building the iOS with any other certificate).
8.  Additional step for **managed** projects: Run `npx expo prebuild` to convert the project to a bare one. This step will use the versioned Expo CLI.
    
9.  Restore a previously saved cache identified by the `cache.key` value in the [build profile](/build/eas-json).
    
10.  Run `pod install` in the **ios** directory inside your project.
     
11.  Run the `eas-build-post-install` script from **package.json** if defined.
     
12.  Update the Xcode project with the ID of the Provisioning Profile.
     
13.  Create **Gymfile** in the **ios** directory if it does **not** already exist (check out the [Default Gymfile](/build-reference/ios-builds#default-gymfile) section).
     
14.  Run `fastlane gym` in the **ios** directory.
     
15.  **Deprecated:** Run the `eas-build-pre-upload-artifacts` script from **package.json** if defined.
     
16.  Store a cache of files and directories defined in the [build profile](/build/eas-json). **Podfile.lock** is cached by default. Subsequent builds will restore this cache.
     
17.  Upload the application archive to a private AWS S3 bucket.
     
     -   The artifact path can be configured in **eas.json** at `builds.ios.PROFILE_NAME.applicationArchivePath`. It defaults to **ios/build/App.ipa**. You can specify a glob-like pattern for `applicationArchivePath`. We're using [glob patterns](https://github.com/isaacs/node-glob#glob-primer) for pattern matching.
18.  If the build was successful: run the `eas-build-on-success` script from **package.json** if defined.
     
19.  If the build failed: run the `eas-build-on-error` script from **package.json** if defined.
     
20.  Run the `eas-build-on-complete` script from **package.json** if defined. The `EAS_BUILD_STATUS` env variable is set to either `finished` or `errored`.
     
21.  Upload the build artifacts archive to a private AWS S3 bucket if `buildArtifactPaths` is specified in the build profile.
     

## Building iOS projects with Fastlane

We're using [Fastlane](https://fastlane.tools/) for building iOS projects. To be more precise, we're using the `fastlane gym` command ([see the Fastlane docs to learn more](https://docs.fastlane.tools/actions/gym/)). This command allows you to declare the build configuration in **Gymfile**.

EAS Build can use your own **Gymfile**. All you need to do is to place this file in the **ios** directory.

### Default Gymfile

If the **ios/Gymfile** file doesn't exist, the iOS builder creates a default one which looks similar to the following:

```rb
suppress_xcode_output(true)
clean(true)

scheme("app")

export_options({
  method: "app-store",
  provisioningProfiles: {
    "com.expo.eas.builds.test.application" => "dd83ed9c-4f89-462e-b901-60ae7fe6d737"
  }
})

export_xcargs "OTHER_CODE_SIGN_FLAGS=\"--keychain /tmp/path/to/keychain\""

disable_xcpretty(true)

output_directory("./build")
output_name("App")
```
