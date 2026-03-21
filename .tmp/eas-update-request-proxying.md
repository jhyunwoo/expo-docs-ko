---
modificationDate: November 13, 2025
title: Request proxying
description: Proxy requests to the EAS Update server through your own server.
---

# Request proxying

Proxy requests to the EAS Update server through your own server.

EAS Update supports request proxying, which allows you to proxy requests to the EAS Update server through your own server. This can be useful for various reasons, such as adding custom headers, logging requests, or implementing additional security or request IP anonymization measures.

## Enabling request proxying

1.  Create two proxy servers that will handle the requests:
    
    -   One for the update asset requests (JavaScript bundles, images, and so on).
        -   This must forward requests to `assets.eascdn.net`, the EAS Update asset server.
        -   This must pass-through all URL contents (path, query parameters, and so on).
        -   This must forward all request headers that:
            -   start with `expo-` or `eas-`, or
            -   are exactly `authorization` or `a-im`.
    -   One for the update manifest requests.
        -   This must forward requests to `u.expo.dev`, the EAS Update server.
        -   This must pass-through all URL contents (path, query parameters, and so on).
        -   This must pass-through all headers prefixed with `expo-` or `eas-`.
2.  Add the following fields to your **eas.json** configuration file, replacing the placeholders with your actual proxy server URLs:
    
    ```json
    {
      "cli": {
        ... 
        "updateAssetHostOverride": "updates-asset-proxy.example.com",
        "updateManifestHostOverride": "updates-manifest-proxy.example.com"
      }
    }
    ```
    
3.  Run the following command to apply the changes:
    
    ```sh
    eas update:configure
    ```
    
4.  Publish an update to test the proxying:
    
    ```sh
    eas update
    ```
    
5.  Verify by navigating to the update group on the [EAS Update dashboard](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/updates) and clicking "View Metadata" for one of the platforms.
    
    -   **manifest.json** should show the overridden `manifestHostOverride`.
    -   Other assets should show the overridden `assetHostOverride`.
