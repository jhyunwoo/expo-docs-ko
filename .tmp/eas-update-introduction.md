---
modificationDate: March 05, 2026
title: EAS Update
description: EAS Update is a cloud service that serves updates for projects using the expo-updates library.
---

# EAS Update

EAS Update is a cloud service that serves updates for projects using the expo-updates library.

**EAS Update** is a cloud service from EAS (Expo Application Services) that serves updates for projects using the [`expo-updates`](/versions/latest/sdk/updates) library.

EAS Update makes fixing small bugs and pushing quick fixes a snap in between app store submissions. It accomplishes this by enabling an app to update its own non-native pieces (such as JS, styling, and images) over-the-air. All apps that include the `expo-updates` library have the ability to receive updates.

## Quick start

> The `eas` commands below require EAS CLI. See [How to install EAS CLI](/eas/cli#installation) for more information.

Install the `expo-updates` library and configure EAS Update:

```sh
npx expo install expo-updates
eas update:configure
```

You need to create a new build for Android or iOS to include the `expo-updates` library in your build. After that, you can push an update to the production channel:

```sh
eas update --channel production --message "Fix login button alignment"
```

This command publishes your JavaScript bundle and assets so users receive the new version on their next app launch.

For complete steps to start using EAS Update, see [Get started with EAS Update](/eas-update/getting-started).

## Key features

### JS API for update management

The updates [JavaScript API](/versions/latest/sdk/updates) includes a React hook called `useUpdates()`. This hook provides detailed information about the currently running update and any new updates that are available or have been downloaded. In addition, you can view any errors that were encountered during the update process to help you debug any issues while the app is attempting to update.

The API also provides methods such as `checkForUpdateAsync()` and `fetchUpdateAsync()` which allow you to control when your app checks for and downloads updates.

### Insight tracking

You'll get a [deployments dashboard](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/deployments) that helps visualize which updates are being sent to builds. Updates work in concert with [insights](/eas-insights/introduction) to provide data on the adoption rates of your updates with your users.

### Republish for reverting mistakes

If an update isn't performing as expected, you can [republish](/eas-update/eas-cli#republish-a-previous-update-within-a-branch) a previous, stable version on top of the problematic one, much like a new "commit" in version control systems.

## When to use EAS Update

| Scenario | Recommendation |
| --- | --- |
| Fix a bug or crash in JavaScript code and deploy updates in minutes | ✓ |
| Update copy, translations, UI styling, or screen layouts | ✓ |
| Roll out changes to a percentage of users using [rollouts](/eas-update/rollouts) | ✓ |
| Publish updates from [CI or automated workflows](/eas/workflows/pre-packaged-jobs#update) | ✓ |
| Test updates with internal teams before production release | ✓ |
| Change to native code or native dependencies | ✗ |
| Change to app permissions (camera, location, and others) | ✗ |
| Update the Expo SDK version | ✗ |
| Anything that requires a new app binary version | ✗ |

For scenarios marked with ✗, use [EAS Build](/build/introduction) to create and submit a new app binary.

## Frequently asked questions (FAQ)

What guidelines must I follow when publishing updates?

One of the rules of EAS Update is that you need to follow the rules of the platforms and app stores you are building for. This means your updates need to follow the App Store and Play Store guidelines, including the content of the updates and how you use them. This usually means changes to your app's behavior need to be reviewed.

App Store rules regularly change and just as you need to follow them if you were writing an app without Expo, you need to follow them when you are using Expo and EAS Update.

EAS Update is a great way to quickly deliver improvements to the people who use your apps. For example, consider an app that has a critical bug that needs to be fixed. With EAS Update, you can quickly get the fix out and later follow up with a new submission that includes the fix built in.

How are "monthly active users" counted for a billing cycle?

> **Note**: 1 monthly active user equals 1 unique installation of an app that downloads at least 1 update during your billing cycle.

-   An app install that downloads a new update on each day of your billing cycle counts as 1 monthly active user.
-   An app install that does not download any new updates during your billing cycle counts as 0 monthly active users.
-   Uninstalling and reinstalling an app (and downloading updates in each during your billing cycle) counts as 2 monthly active users.
-   A single device that has two apps owned by a single Expo account, both of which use updates, is considered 2 monthly active users for the account.

How can I implement a custom update strategy for my app?

By default, `expo-updates` checks for updates every time the app is loaded. You can implement a custom update strategy with the [Updates API](/versions/latest/sdk/updates) and [app config](/versions/latest/config/app#updates).

Can I use EAS Update with my existing React Native project?

Yes. EAS Update works with both projects that use [Continuous Native Generation (CNG)](/workflow/continuous-native-generation) and [existing React Native projects](/bare/installing-updates) that have the [`expo-updates`](/versions/latest/sdk/updates) library installed.

Do my app users need to reinstall the app to receive updates?

No. Updates are downloaded inside the app and applied based on your configuration. App users see the new version on their next app launch or reload.

How does EAS Update handle native code compatibility?

EAS Update uses [runtime version policies](/eas-update/runtime-versions) to ensure updates are only sent to builds with compatible native code. If your native code changes, you create a new runtime version.

Can I use EAS Update inside EAS Workflows or from other CI/CD pipelines?

Yes. EAS Update works with [EAS Workflows](/eas/workflows/get-started). You still need to configure and create a new build for Android or iOS. After that, you can add an update job to your workflow configuration. For example:

```yaml
jobs:
  publish_update:
    type: update
    params:
      message: 'Fix login button alignment'
      channel: production
```

For more information, see [EAS Workflows pre-packaged jobs](/eas/workflows/pre-packaged-jobs#update).

To automate publishing updates with GitHub Actions, see the [GitHub Action for PR previews](/eas-update/github-actions) guide.

What's the difference between EAS Update and CodePush?

EAS Update is a native solution that also integrates with [EAS Build](/build/introduction) and provides a unified workflow. CodePush uses a slightly different approach. To learn more about the differences between EAS Update and CodePush, see [Conceptual differences between CodePush and EAS Update](/eas-update/codepush#conceptual-differences-between-codepush-and-eas-update).

Are Classic Updates still supported?

The Classic Updates service was available before December 2021 and is now deprecated. New updates cannot be published via `expo publish`, however, existing apps will continue to receive Classic Updates that have already been published and are actively used.

We recommend transitioning to EAS Update or using a [self-hosted update service](/versions/latest/sdk/updates).

## Get started

[Get started with EAS Update](/eas-update/getting-started) — Learn how to get started with the setup required to configure and use EAS Update in your project.

[Publish an update](/eas-update/getting-started#publish-an-update) — Learn how to publish an update to a specific branch with EAS Update.

[Preview updates](/eas-update/preview) — View your teammate's changes with EAS Update.

[Use GitHub Actions](/eas-update/github-actions) — Publish an update and preview with a QR code after a commit.

[Migrate from CodePush](/eas-update/codepush) — Learn how to migrate from CodePush to EAS Update.

[Using EAS Update with other EAS services](/tutorial/eas/introduction) — For a complete tutorial of using EAS Update with other EAS services, refer to this EAS tutorial.
