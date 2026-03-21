---
modificationDate: March 20, 2025
title: Get started with custom builds
description: Learn how to extend EAS Build with custom builds.
---

# Get started with custom builds

Learn how to extend EAS Build with custom builds.

Custom builds allow customizing the build process for your project by running commands before, during, or after the build process. Customized builds can run from EAS CLI or when running builds in a React Native CI/CD pipeline, like with [EAS Workflows](/eas/workflows/get-started).

## Create a custom build config

To get started, create directories and a file named **.eas/build/hello-world.yml** at the same level as **eas.json**. The location and name of both directories are important for EAS Build to identify that a project contains a custom build config.

Inside the **hello-world.yml**, you'll write your custom build config. The filename is unimportant; you can name it whatever you want. The only requirement is that the file extension uses **.yml**.

Add the following custom build config steps in the file:

```yaml
build:
  name: Hello World!
  steps:
    - run: echo "Hello, world!"
    # A built-in function (optional)
```

In a real world scenario, you will call a [built-in function](/custom-builds/schema#built-in-eas-functions) to trigger the build.

## Add `config` property in eas.json

To use the custom build config, add the `config` property in **eas.json** under a build profile.

Let's create a new [build profile](/build/eas-json#build-profiles) called `test` under `build` to run the custom config from the **test.yml** file:

```json
{
  "build": {
    ... 
    "test": {
      "config": "test.yml",
    },
}
```

If you wish to use separate configs for each platform, you can create separate YAML config files for Android and iOS. For example:

```json
{
  "build": {
    ... 
    "test": {
      "ios": {
        "config": "hello-ios.yml",
      },
      "android": {
        "config": "hello-android.yml",
      }
    },
}
```

## Run a build to test the custom build config

To test the custom build config, run the following command:

```sh
eas build -p android -e test
```

After the build is complete, you can verify that the `echo "Hello World!"` script was executed by checking the logs on the build's detail page.

## Learn more

Check out the example repository for more detailed examples:

[Custom build example repository](https://github.com/expo/eas-custom-builds-example/tree/main) — A custom EAS Build example that includes examples for custom builds such as setting up functions, using environment variables, uploading artifacts, and more.
