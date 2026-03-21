---
modificationDate: January 28, 2026
title: Bundle diffing for EAS Update
description: Enable your project to accept bundle diffs when available.
---

# Bundle diffing for EAS Update

Enable your project to accept bundle diffs when available.

> Bundle diffing is in **beta** and may have limitations. See [Current limitations](/eas-update/bundle-diffing#current-limitations) for details.

Enable bundle diffing to let EAS Update deliver a **bundle patch** when possible. When you publish a new update, EAS Update can generate a smaller file containing only the differences between the bundle currently running on the device and the new bundle. This often reduces update download size significantly.

## Prerequisites

Your app must use **Expo SDK 55 or later**.

## Enable bundle diffing

In your project's [app config](/workflow/configuration), set `updates.enableBsdiffPatchSupport` to `true`:

```json
{
  "expo": {
    "updates": {
      "enableBsdiffPatchSupport": true
    }
  }
}
```

## Verify bundle diffs are being served

### Expo website

You can confirm that bundle diffs are being served from the [Update Details](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/updates) page. Open the Update Group you published, then select the platform you want to inspect.

### Updates API

You can confirm that bundle diffs are being served by inspecting update logs with `Updates.readLogEntriesAsync()`. If your app received a patch, you will see an entry indicating it was successfully applied (for example, "patch successfully applied").

## Patch generation and serving

EAS Update uses the [bsdiff algorithm](https://en.wikipedia.org/wiki/Bsdiff) to generate bundle patches.

A patch is served only when:

-   **It's meaningfully smaller than the full bundle.** If it isn't, EAS Update serves the full bundle instead.
-   **It can be computed efficiently.** If generating the patch is too resource intensive, EAS Update serves the full bundle instead.

## Current limitations

-   **Embedded bundles aren't eligible.** The embedded bundle is never used as a base for patching. Devices must already be running a published update to receive a patch.
-   **Patches aren't guaranteed for every possible update pair immediately.** When an update is published, EAS Update precomputes a patch only against the second-newest update on the channel. If a device requests the new update while running a different published update, it will initially receive the full bundle. A patch for that specific base update is then generated on demand and served to future similar requests.
-   **Patches are generated shortly after publishing.** It can take a few minutes between publishing an update and the patch being ready. During that window, devices may receive the full bundle.
