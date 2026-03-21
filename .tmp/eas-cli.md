---
modificationDate: March 12, 2026
title: EAS CLI reference
description: EAS CLI is a command-line tool that allows you to interact with Expo Application Services (EAS) from your terminal.
cliVersion: 18.3.0
---

# EAS CLI reference

EAS CLI is a command-line tool that allows you to interact with Expo Application Services (EAS) from your terminal.

CLI version:

18.3.0

CLI version 18.3.0

You can use EAS Command-Line Interface (CLI) to build, update, submit, deploy or use workflows in your Expo and React Native project from a terminal window.

## Installation

You need to install the EAS CLI globally on your machine. You do this by running the following command:

```sh
# npm
npm install --global eas-cli

# yarn
yarn global add eas-cli

# pnpm
pnpm add -g eas-cli

# bun
bun add -g eas-cli
```

Alternatively, you can use CLI tools provided by your package manager to run EAS CLI commands:

```sh
# npm
npx eas-cli@latest

# yarn
yarn dlx eas-cli@latest

# pnpm
pnpm dlx eas-cli@latest

# bun
bunx eas-cli@latest
```

## Commands

Use the EAS CLI by running one of the commands documented on this page, optionally followed by any flags or arguments. Flags customize the behavior of a command, and arguments are specific to the command.

### `eas account:login`

Log in with your Expo account.

#### Usage

```sh
eas account:login [-s] [-b]
```

#### Flags

-   `-b, --browser` Login with your browser.
-   `-s, --sso` Login with SSO.

#### Alias

```sh
eas login
```

### `eas account:logout`

Log out.

#### Usage

```sh
eas account:logout
```

#### Alias

```sh
eas logout
```

### `eas account:usage [ACCOUNT_NAME]`

View account usage and billing for the current cycle.

#### Usage

```sh
eas account:usage [ACCOUNT_NAME] [--json] [--non-interactive]
```

#### Argument

-   `[ACCOUNT_NAME]` Account name to view usage for. If not provided, the account will be selected interactively (or defaults to the only account if there is just one).

#### Flags

-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`.
-   `--non-interactive` Run the command in non-interactive mode.

### `eas account:view`

Show the username you are logged in as.

#### Usage

```sh
eas account:view
```

#### Alias

```sh
eas whoami
```

### `eas analytics [STATUS]`

Display or change analytics settings.

#### Usage

```sh
eas analytics [STATUS]
```

### `eas autocomplete [SHELL]`

Display autocomplete installation instructions.

#### Usage

```sh
eas autocomplete [SHELL] [-r]
```

#### Argument

-   `[SHELL]` (zsh|bash|powershell) Shell type.

#### Flag

-   `-r, --refresh-cache` Refresh cache (ignores displaying instructions).

#### Examples

```sh
eas autocomplete
eas autocomplete bash
eas autocomplete zsh
eas autocomplete powershell
eas autocomplete --refresh-cache
```

### `eas branch:create [NAME]`

Create a branch.

#### Usage

```sh
eas branch:create [NAME] [--json] [--non-interactive]
```

#### Argument

-   `[NAME]` Name of the branch to create.

#### Flags

-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--non-interactive` Run the command in non-interactive mode.

### `eas branch:delete [NAME]`

Delete a branch.

#### Usage

```sh
eas branch:delete [NAME] [--json] [--non-interactive]
```

#### Argument

-   `[NAME]` Name of the branch to delete.

#### Flags

-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--non-interactive` Run the command in non-interactive mode.

### `eas branch:list`

List all branches.

#### Usage

```sh
eas branch:list [--offset ] [--limit ] [--json] [--non-interactive]
```

#### Flags

-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--limit=<value>` The number of items to fetch each query. Defaults to 50 and is capped at 100.
-   `--non-interactive` Run the command in non-interactive mode.
-   `--offset=<value>` Start queries from specified index. Use for paginating results. Defaults to 0.

### `eas branch:rename`

Rename a branch.

#### Usage

```sh
eas branch:rename [--from ] [--to ] [--json] [--non-interactive]
```

#### Flags

-   `--from=<value>` Current name of the branch.
-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--non-interactive` Run the command in non-interactive mode.
-   `--to=<value>` New name of the branch.

### `eas branch:view [NAME]`

View a branch.

#### Usage

```sh
eas branch:view [NAME] [--offset ] [--limit ] [--json] [--non-interactive]
```

#### Argument

-   `[NAME]` Name of the branch to view.

#### Flags

-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--limit=<value>` The number of items to fetch each query. Defaults to 25 and is capped at 50.
-   `--non-interactive` Run the command in non-interactive mode.
-   `--offset=<value>` Start queries from specified index. Use for paginating results. Defaults to 0.

### `eas build`

Start a build.

#### Usage

```sh
eas build [-p android|ios|all] [-e PROFILE_NAME] [--local] [--output ] [--wait] [--clear-cache]
[-s | --auto-submit-with-profile PROFILE_NAME] [--what-to-test ] [-m ] [--build-logger-level
trace|debug|info|warn|error|fatal] [--freeze-credentials] [--verbose-logs] [--json] [--non-interactive]
```

#### Flags

-   `-e, --profile=PROFILE_NAME` Name of the build profile from **eas.json.** Defaults to "production" if defined in **eas.json.**
-   `-m, --message=<value>` A short message describing the build.
-   `-p, --platform=<option>` <options: android|ios|all>.
-   `-s, --auto-submit` Submit on build complete using the submit profile with the same name as the build profile.
-   `--auto-submit-with-profile=PROFILE_NAME` Submit on build complete using the submit profile with provided name.
-   `--build-logger-level=<option>` The level of logs to output during the build process. Defaults to "info". <options: trace|debug|info|warn|error|fatal>.
-   `--clear-cache` Clear cache before the build.
-   `--freeze-credentials` Prevent the build from updating credentials in non-interactive mode.
-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--local` Run build locally [experimental].
-   `--non-interactive` Run the command in non-interactive mode.
-   `--output=<value>` Output path for local build.
-   `--verbose-logs` Use verbose logs for the build process.
-   `--[no-]wait` Wait for build(s) to complete.
-   `--what-to-test=<value>` Specify the "What to Test" information for the build in TestFlight (iOS-only). To be used with the `auto-submit` flag.

### `eas build:cancel [BUILD_ID]`

Cancel a build.

#### Usage

```sh
eas build:cancel [BUILD_ID] [--non-interactive] [-p android|ios|all] [-e PROFILE_NAME]
```

#### Flags

-   `-e, --profile=PROFILE_NAME` Filter builds by build profile if build ID is not provided.
-   `-p, --platform=<option>` Filter builds by the platform if build ID is not provided <options: android|ios|all>.
-   `--non-interactive` Run the command in non-interactive mode.

### `eas build:configure`

Configure the project to support EAS Build.

#### Usage

```sh
eas build:configure [-p android|ios|all]
```

#### Flag

-   `-p, --platform=<option>` Platform to configure <options: android|ios|all>.

### `eas build:delete [BUILD_ID]`

Delete a build.

#### Usage

```sh
eas build:delete [BUILD_ID] [--non-interactive] [-p android|ios|all] [-e PROFILE_NAME]
```

#### Flags

-   `-e, --profile=PROFILE_NAME` Filter builds by build profile if build ID is not provided.
-   `-p, --platform=<option>` Filter builds by the platform if build ID is not provided <options: android|ios|all>.
-   `--non-interactive` Run the command in non-interactive mode.

### `eas build:dev`

Run dev client simulator/emulator build with matching fingerprint or create a new one.

#### Usage

```sh
eas build:dev [-p ios|android] [-e PROFILE_NAME]
```

#### Flags

-   `-e, --profile=PROFILE_NAME` Name of the build profile from **eas.json.** It must be a profile allowing to create emulator/simulator internal distribution dev client builds. The "development-simulator" build profile will be selected by default.
-   `-p, --platform=<option>` <options: ios|android>.

### `eas build:download`

Download simulator/emulator builds for a given fingerprint hash.

#### Usage

```sh
eas build:download --fingerprint  [-p ios|android] [--dev-client] [--json] [--non-interactive]
```

#### Flags

-   `-p, --platform=<option>` <options: ios|android>.
-   `--[no-]dev-client` Filter only dev-client builds.
-   `--fingerprint=<value>` (required) Fingerprint hash of the build to download.
-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--non-interactive` Run the command in non-interactive mode.

### `eas build:inspect`

Inspect the state of the project at specific build stages, useful for troubleshooting.

#### Usage

```sh
eas build:inspect -p android|ios -s archive|pre-build|post-build -o OUTPUT_DIRECTORY [-e PROFILE_NAME]
[--force] [-v]
```

#### Flags

-   `-e, --profile=PROFILE_NAME` Name of the build profile from **eas.json.** Defaults to "production" if defined in **eas.json.**
-   `-o, --output=OUTPUT_DIRECTORY` (required) Output directory.
-   `-p, --platform=<option>` (required) <options: android|ios>.
-   `-s, --stage=<option>` (required) Stage of the build you want to inspect.
    -   `archive` Builds the project archive that would be uploaded to EAS when building.
    -   `pre-build` Prepares the project to be built with Gradle/Xcode. Does not run the native build.
    -   `post-build` Builds the native project and leaves the output directory for inspection <options: archive|pre-build|post-build>.
-   `-v, --verbose`
-   `--force` Delete OUTPUT_DIRECTORY if it already exists.

### `eas build:list`

List all builds for your project.

#### Usage

```sh
eas build:list [-p android|ios|all] [--status
new|in-queue|in-progress|pending-cancel|errored|finished|canceled] [--distribution store|internal|simulator]
[--channel ] [--app-version ] [--app-build-version ] [--sdk-version ] [--runtime-version
] [--app-identifier ] [-e ] [--git-commit-hash ] [--fingerprint-hash ] [--offset
] [--limit ] [--json] [--non-interactive] [--simulator]
```

#### Flags

-   `-e, --build-profile=<value>` Filter only builds created with the specified build profile.
-   `-p, --platform=<option>` <options: android|ios|all>.
-   `--app-build-version=<value>` Filter only builds created with the specified app build version.
-   `--app-identifier=<value>` Filter only builds created with the specified app identifier.
-   `--app-version=<value>` Filter only builds created with the specified main app version.
-   `--channel=<value>`
-   `--distribution=<option>` Filter only builds with the specified distribution type <options: store|internal|simulator>.
-   `--fingerprint-hash=<value>` Filter only builds with the specified fingerprint hash.
-   `--git-commit-hash=<value>` Filter only builds created with the specified git commit hash.
-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--limit=<value>` The number of items to fetch each query. Defaults to 10 and is capped at 50.
-   `--non-interactive` Run the command in non-interactive mode.
-   `--offset=<value>` Start queries from specified index. Use for paginating results. Defaults to 0.
-   `--runtime-version=<value>` Filter only builds created with the specified runtime version.
-   `--sdk-version=<value>` Filter only builds created with the specified Expo SDK version.
-   `--simulator` Filter only iOS simulator builds. Can only be used with `--platform` flag set to "ios".
-   `--status=<option>` Filter only builds with the specified status <options: new|in-queue|in-progress|pending-cancel|errored|finished|canceled>.

### `eas build:resign`

Re-sign a build archive.

#### Usage

```sh
eas build:resign [-p android|ios] [-e PROFILE_NAME] [--source-profile PROFILE_NAME] [--wait] [--id ]
[--offset ] [--limit ] [--json] [--non-interactive]
```

#### Flags

-   `-e, --target-profile=PROFILE_NAME` Name of the target build profile from **eas.json.** Credentials and environment variables from this profile will be used when re-signing. Defaults to "production" if defined in **eas.json.**
-   `-p, --platform=<option>` <options: android|ios>.
-   `--id=<value>` ID of the build to re-sign.
-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--limit=<value>` The number of items to fetch each query. Defaults to 50 and is capped at 100.
-   `--non-interactive` Run the command in non-interactive mode.
-   `--offset=<value>` Start queries from specified index. Use for paginating results. Defaults to 0.
-   `--source-profile=PROFILE_NAME` Name of the source build profile from **eas.json.** Used to filter builds eligible for re-signing.
-   `--[no-]wait` Wait for build(s) to complete.

### `eas build:run`

Run simulator/emulator builds from eas-cli.

#### Usage

```sh
eas build:run [--latest | --id  | --path  | --url ] [-p android|ios] [-e PROFILE_NAME]
[--offset ] [--limit ]
```

#### Flags

-   `-e, --profile=PROFILE_NAME` Name of the build profile used to create the build to run. When specified, only builds created with the specified build profile will be queried.
-   `-p, --platform=<option>` <options: android|ios>.
-   `--id=<value>` ID of the simulator/emulator build to run.
-   `--latest` Run the latest simulator/emulator build for specified platform.
-   `--limit=<value>` The number of items to fetch each query. Defaults to 50 and is capped at 100.
-   `--offset=<value>` Start queries from specified index. Use for paginating results. Defaults to 0.
-   `--path=<value>` Path to the simulator/emulator build archive or app.
-   `--url=<value>` Simulator/Emulator build archive url.

### `eas build:submit`

Submit app binary to App Store and/or Play Store.

#### Usage

```sh
eas build:submit [-p android|ios|all] [-e ] [--latest | --id  | --path  | --url ]
[--what-to-test ] [--verbose] [--wait] [--verbose-fastlane] [-g ...] [--non-interactive]
```

#### Flags

-   `-e, --profile=<value>` Name of the submit profile from **eas.json.** Defaults to "production" if defined in **eas.json.**
-   `-g, --groups=<value>...` Internal TestFlight testing groups to add the build to (iOS only). Learn more: [https://developer.apple.com/help/app-store-connect/test-a-beta-version/add-internal-testers](https://developer.apple.com/help/app-store-connect/test-a-beta-version/add-internal-testers).
-   `-p, --platform=<option>` <options: android|ios|all>.
-   `--id=<value>` ID of the build to submit.
-   `--latest` Submit the latest build for specified platform.
-   `--non-interactive` Run command in non-interactive mode.
-   `--path=<value>` Path to the **.apk**/**.aab**/**.ipa** file.
-   `--url=<value>` App archive url.
-   `--verbose` Always print logs from EAS Submit.
-   `--verbose-fastlane` Enable verbose logging for the submission process.
-   `--[no-]wait` Wait for submission to complete.
-   `--what-to-test=<value>` Sets the "What to test" information in TestFlight (iOS only).

#### Alias

```sh
eas build:submit
```

### `eas build:version:get`

Get the latest version from EAS servers.

#### Usage

```sh
eas build:version:get [-p android|ios|all] [-e PROFILE_NAME] [--json] [--non-interactive]
```

#### Flags

-   `-e, --profile=PROFILE_NAME` Name of the build profile from **eas.json.** Defaults to "production" if defined in **eas.json.**
-   `-p, --platform=<option>` <options: android|ios|all>.
-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--non-interactive` Run the command in non-interactive mode.

### `eas build:version:set`

Update version of an app.

#### Usage

```sh
eas build:version:set [-p android|ios] [-e PROFILE_NAME]
```

#### Flags

-   `-e, --profile=PROFILE_NAME` Name of the build profile from **eas.json.** Defaults to "production" if defined in **eas.json.**
-   `-p, --platform=<option>` <options: android|ios>.

### `eas build:version:sync`

Update a version in native code with a value stored on EAS servers.

#### Usage

```sh
eas build:version:sync [-p android|ios|all] [-e PROFILE_NAME]
```

#### Flags

-   `-e, --profile=PROFILE_NAME` Name of the build profile from **eas.json.** Defaults to "production" if defined in **eas.json.**
-   `-p, --platform=<option>` <options: android|ios|all>.

### `eas build:view [BUILD_ID]`

View a build for your project.

#### Usage

```sh
eas build:view [BUILD_ID] [--json]
```

#### Flag

-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`.

### `eas channel:create [NAME]`

Create a channel.

#### Usage

```sh
eas channel:create [NAME] [--json] [--non-interactive]
```

#### Argument

-   `[NAME]` Name of the channel to create.

#### Flags

-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--non-interactive` Run the command in non-interactive mode.

### `eas channel:delete [NAME]`

Delete a channel.

#### Usage

```sh
eas channel:delete [NAME] [--json] [--non-interactive]
```

#### Argument

-   `[NAME]` Name of the channel to delete.

#### Flags

-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--non-interactive` Run the command in non-interactive mode.

### `eas channel:edit [NAME]`

Point a channel at a new branch.

#### Usage

```sh
eas channel:edit [NAME] [--branch ] [--json] [--non-interactive]
```

#### Argument

-   `[NAME]` Name of the channel to edit.

#### Flags

-   `--branch=<value>` Name of the branch to point to.
-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--non-interactive` Run the command in non-interactive mode.

### `eas channel:list`

List all channels.

#### Usage

```sh
eas channel:list [--offset ] [--limit ] [--json] [--non-interactive]
```

#### Flags

-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--limit=<value>` The number of items to fetch each query. Defaults to 10 and is capped at 25.
-   `--non-interactive` Run the command in non-interactive mode.
-   `--offset=<value>` Start queries from specified index. Use for paginating results. Defaults to 0.

### `eas channel:pause [NAME]`

Pause a channel to stop it from sending updates.

#### Usage

```sh
eas channel:pause [NAME] [--branch ] [--json] [--non-interactive]
```

#### Argument

-   `[NAME]` Name of the channel to edit.

#### Flags

-   `--branch=<value>` Name of the branch to point to.
-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--non-interactive` Run the command in non-interactive mode.

### `eas channel:resume [NAME]`

Resume a channel to start sending updates.

#### Usage

```sh
eas channel:resume [NAME] [--branch ] [--json] [--non-interactive]
```

#### Argument

-   `[NAME]` Name of the channel to edit.

#### Flags

-   `--branch=<value>` Name of the branch to point to.
-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--non-interactive` Run the command in non-interactive mode.

### `eas channel:rollout [CHANNEL]`

Roll a new branch out on a channel incrementally.

#### Usage

```sh
eas channel:rollout [CHANNEL] [--action create|edit|end|view] [--percent ] [--outcome
republish-and-revert|revert] [--branch ] [--runtime-version ] [--private-key-path ] [--json]
[--non-interactive]
```

#### Argument

-   `[CHANNEL]` Channel on which the rollout should be done.

#### Flags

-   `--action=<option>` Rollout action to perform <options: create|edit|end|view>.
-   `--branch=<value>` Branch to roll out. Use with `--action=create`.
-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--non-interactive` Run the command in non-interactive mode.
-   `--outcome=<option>` End outcome of rollout. Use with `--action=end` <options: republish-and-revert|revert>.
-   `--percent=<value>` Percent of users to send to the new branch. Use with `--action=edit` or `--action=create`.
-   `--private-key-path=<value>` File containing the PEM-encoded private key corresponding to the certificate in expo-updates' configuration. Defaults to a file named "**private-key.pem**" in the certificate's directory. Only relevant if you are using code signing: [https://docs.expo.dev/eas-update/code-signing/](https://docs.expo.dev/eas-update/code-signing/).
-   `--runtime-version=<value>` Runtime version to target. Use with `--action=create`.

### `eas channel:view [NAME]`

View a channel.

#### Usage

```sh
eas channel:view [NAME] [--json] [--non-interactive] [--offset ] [--limit ]
```

#### Argument

-   `[NAME]` Name of the channel to view.

#### Flags

-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--limit=<value>` The number of items to fetch each query. Defaults to 50 and is capped at 100.
-   `--non-interactive` Run the command in non-interactive mode.
-   `--offset=<value>` Start queries from specified index. Use for paginating results. Defaults to 0.

### `eas config`

Display project configuration (**app.json** + **eas.json**).

#### Usage

```sh
eas config [-p android|ios] [-e PROFILE_NAME] [--json] [--non-interactive]
```

#### Flags

-   `-e, --profile=PROFILE_NAME` Name of the build profile from **eas.json.** Defaults to "production" if defined in **eas.json.**
-   `-p, --platform=<option>` <options: android|ios>.
-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--non-interactive` Run the command in non-interactive mode.

### `eas credentials`

Manage credentials.

#### Usage

```sh
eas credentials [-p android|ios]
```

#### Flag

-   `-p, --platform=<option>` <options: android|ios>.

### `eas credentials:configure-build`

Set up credentials for building your project.

#### Usage

```sh
eas credentials:configure-build [-p android|ios] [-e PROFILE_NAME]
```

#### Flags

-   `-e, --profile=PROFILE_NAME` The name of the build profile in **eas.json.**
-   `-p, --platform=<option>` <options: android|ios>.

### `eas deploy [options]`

Deploy your Expo Router web build and API Routes.

#### Usage

```sh
eas deploy [options]
eas deploy --prod
```

#### Flags

-   `--alias=name` Custom alias to assign to the new deployment.
-   `--dry-run` Outputs a tarball of the new deployment instead of uploading it.
-   `--environment=<value>` Environment variable's environment, for example, 'production', 'preview', 'development'.
-   `--export-dir=dir` [default: dist] Directory where the Expo project was exported.
-   `--id=xyz123` Custom unique identifier for the new deployment.
-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--non-interactive` Run the command in non-interactive mode.
-   `--prod` Create a new production deployment.
-   `--[no-]source-maps` Include source maps in the deployment.

#### Alias

```sh
eas worker:deploy
```

### `eas deploy:alias`

Assign deployment aliases.

#### Usage

```sh
eas deploy:alias [--prod] [--alias name] [--id xyz123] [--json] [--non-interactive]
```

#### Flags

-   `--alias=name` Custom alias to assign to the existing deployment.
-   `--id=xyz123` Unique identifier of an existing deployment.
-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--non-interactive` Run the command in non-interactive mode.
-   `--prod` Promote an existing deployment to production.

#### Aliases

```sh
eas worker:alias
eas deploy:promote
```

### `eas deploy:alias:delete [ALIAS_NAME]`

Delete deployment aliases.

#### Usage

```sh
eas deploy:alias:delete [ALIAS_NAME] [--json] [--non-interactive]
```

#### Flags

-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--non-interactive` Run the command in non-interactive mode.

#### Alias

```sh
eas worker:alias:delete
```

### `eas deploy:delete [DEPLOYMENT_ID]`

Delete a deployment.

#### Usage

```sh
eas deploy:delete [DEPLOYMENT_ID] [--json] [--non-interactive]
```

#### Flags

-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--non-interactive` Run the command in non-interactive mode.

#### Alias

```sh
eas worker:delete
```

### `eas deploy:promote`

Assign deployment aliases.

#### Usage

```sh
eas deploy:promote [--prod] [--alias name] [--id xyz123] [--json] [--non-interactive]
```

#### Flags

-   `--alias=name` Custom alias to assign to the existing deployment.
-   `--id=xyz123` Unique identifier of an existing deployment.
-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--non-interactive` Run the command in non-interactive mode.
-   `--prod` Promote an existing deployment to production.

#### Aliases

```sh
eas worker:alias
eas deploy:promote
```

### `eas device:create`

Register new Apple Devices to use for internal distribution.

#### Usage

```sh
eas device:create
```

### `eas device:delete`

Remove a registered device from your account.

#### Usage

```sh
eas device:delete [--apple-team-id ] [--udid ] [--json] [--non-interactive]
```

#### Flags

-   `--apple-team-id=<value>` The Apple team ID on which to find the device.
-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--non-interactive` Run the command in non-interactive mode.
-   `--udid=<value>` The Apple device ID to disable.

### `eas device:list`

List all registered devices for your account.

#### Usage

```sh
eas device:list [--apple-team-id ] [--offset ] [--limit ] [--json] [--non-interactive]
```

#### Flags

-   `--apple-team-id=<value>`
-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--limit=<value>` The number of items to fetch each query. Defaults to 50 and is capped at 100.
-   `--non-interactive` Run the command in non-interactive mode.
-   `--offset=<value>` Start queries from specified index. Use for paginating results. Defaults to 0.

### `eas device:rename`

Rename a registered device.

#### Usage

```sh
eas device:rename [--apple-team-id ] [--udid ] [--name ] [--json] [--non-interactive]
```

#### Flags

-   `--apple-team-id=<value>` The Apple team ID on which to find the device.
-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--name=<value>` The new name for the device.
-   `--non-interactive` Run the command in non-interactive mode.
-   `--udid=<value>` The Apple device ID to rename.

### `eas device:view [UDID]`

View a device for your project.

#### Usage

```sh
eas device:view [UDID]
```

### `eas diagnostics`

Display environment info.

#### Usage

```sh
eas diagnostics
```

### `eas env:create [ENVIRONMENT]`

Create an environment variable for the current project or account.

#### Usage

```sh
eas env:create [ENVIRONMENT] [--name ] [--value ] [--force] [--type string|file] [--visibility
plaintext|sensitive|secret] [--scope project|account] [--environment ...] [--non-interactive]
```

#### Argument

-   `[ENVIRONMENT]` Environment to create the variable in. Default environments are 'production', 'preview', and 'development'.

#### Flags

-   `--environment=<value>...` Environment variable's environment, for example, 'production', 'preview', 'development'.
-   `--force` Overwrite existing variable.
-   `--name=<value>` Name of the variable.
-   `--non-interactive` Run the command in non-interactive mode.
-   `--scope=<option>` [default: project] Scope for the variable <options: project|account>.
-   `--type=<option>` The type of variable <options: string|file>.
-   `--value=<value>` Text value or the variable.
-   `--visibility=<option>` Visibility of the variable <options: plaintext|sensitive|secret>.

### `eas env:delete [ENVIRONMENT]`

Delete an environment variable for the current project or account.

#### Usage

```sh
eas env:delete [ENVIRONMENT] [--variable-name ] [--variable-environment ] [--scope
project|account] [--non-interactive]
```

#### Argument

-   `[ENVIRONMENT]` Current environment of the variable to delete. Default environments are 'production', 'preview', and 'development'.

#### Flags

-   `--non-interactive` Run the command in non-interactive mode.
-   `--scope=<option>` [default: project] Scope for the variable <options: project|account>.
-   `--variable-environment=<value>` Current environment of the variable to delete.
-   `--variable-name=<value>` Name of the variable to delete.

### `eas env:exec ENVIRONMENT BASH_COMMAND`

Execute a command with environment variables from the selected environment.

#### Usage

```sh
eas env:exec ENVIRONMENT BASH_COMMAND [--non-interactive]
```

#### Arguments

-   `ENVIRONMENT` Environment to execute the command in. Default environments are 'production', 'preview', and 'development'.
-   `BASH_COMMAND` Bash command to execute with the environment variables from the environment.

#### Flag

-   `--non-interactive` Run the command in non-interactive mode.

### `eas env:get [ENVIRONMENT]`

View an environment variable for the current project or account.

#### Usage

```sh
eas env:get [ENVIRONMENT] [--variable-name ] [--variable-environment ] [--format
long|short] [--scope project|account] [--non-interactive]
```

#### Argument

-   `[ENVIRONMENT]` Current environment of the variable. Default environments are 'production', 'preview', and 'development'.

#### Flags

-   `--format=<option>` [default: short] Output format <options: long|short>.
-   `--non-interactive` Run the command in non-interactive mode.
-   `--scope=<option>` [default: project] Scope for the variable <options: project|account>.
-   `--variable-environment=<value>` Current environment of the variable.
-   `--variable-name=<value>` Name of the variable.

### `eas env:list [ENVIRONMENT]`

List environment variables for the current project or account.

#### Usage

```sh
eas env:list [ENVIRONMENT] [--include-sensitive] [--include-file-content] [--environment ...]
[--format long|short] [--scope project|account]
```

#### Argument

-   `[ENVIRONMENT]` Environment to list the variables from. Default environments are 'production', 'preview', and 'development'.

#### Flags

-   `--environment=<value>...` Environment variable's environment, for example, 'production', 'preview', 'development'.
-   `--format=<option>` [default: short] Output format <options: long|short>.
-   `--include-file-content` Display files content in the output.
-   `--include-sensitive` Display sensitive values in the output.
-   `--scope=<option>` [default: project] Scope for the variable <options: project|account>.

### `eas env:pull [ENVIRONMENT]`

Pull environment variables for the selected environment to **.env** file.

#### Usage

```sh
eas env:pull [ENVIRONMENT] [--non-interactive] [--environment ] [--path ]
```

#### Argument

-   `[ENVIRONMENT]` Environment to pull variables from. Default environments are 'production', 'preview', and 'development'.

#### Flags

-   `--environment=<value>` Environment variable's environment, for example, 'production', 'preview', 'development'.
-   `--non-interactive` Run the command in non-interactive mode.
-   `--path=<value>` [default: **.env.local**] Path to the result `.env` file.

### `eas env:push [ENVIRONMENT]`

Push environment variables from **.env** file to the selected environment.

#### Usage

```sh
eas env:push [ENVIRONMENT] [--environment ...] [--path ] [--force]
```

#### Argument

-   `[ENVIRONMENT]` Environment to push variables to. Default environments are 'production', 'preview', and 'development'.

#### Flags

-   `--environment=<value>...` Environment variable's environment, for example, 'production', 'preview', 'development'.
-   `--force` Skip confirmation and automatically override existing variables.
-   `--path=<value>` [default: **.env.local**] Path to the input `.env` file.

### `eas env:update [ENVIRONMENT]`

Update an environment variable on the current project or account.

#### Usage

```sh
eas env:update [ENVIRONMENT] [--variable-name ] [--variable-environment ] [--name ]
[--value ] [--type string|file] [--visibility plaintext|sensitive|secret] [--scope project|account]
[--environment ...] [--non-interactive]
```

#### Argument

-   `[ENVIRONMENT]` Current environment of the variable to update. Default environments are 'production', 'preview', and 'development'.

#### Flags

-   `--environment=<value>...` Environment variable's environment, for example, 'production', 'preview', 'development'.
-   `--name=<value>` New name of the variable.
-   `--non-interactive` Run the command in non-interactive mode.
-   `--scope=<option>` [default: project] Scope for the variable <options: project|account>.
-   `--type=<option>` The type of variable <options: string|file>.
-   `--value=<value>` New value or the variable.
-   `--variable-environment=<value>` Current environment of the variable to update.
-   `--variable-name=<value>` Current name of the variable.
-   `--visibility=<option>` Visibility of the variable <options: plaintext|sensitive|secret>.

### `eas fingerprint:compare [HASH1] [HASH2]`

Compare fingerprints of the current project, builds, and updates.

#### Usage

```sh
eas fingerprint:compare [HASH1...] [HASH2...] [--build-id ...] [--update-id ...] [--open]
[--environment ] [--json] [--non-interactive]
```

#### Arguments

-   `[HASH1...]` If provided alone, HASH1 is compared against the current project's fingerprint.
-   `[HASH2...]` If two hashes are provided, HASH1 is compared against HASH2.

#### Flags

-   `--build-id=<value>...` Compare the fingerprint with the build with the specified ID.
-   `--environment=<value>` If generating a fingerprint from the local directory, use the specified environment.
-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--non-interactive` Run the command in non-interactive mode.
-   `--open` Open the fingerprint comparison in the browser.
-   `--update-id=<value>...` Compare the fingerprint with the update with the specified ID.

#### Examples

```sh
eas fingerprint:compare 	 # Compare fingerprints in interactive mode
eas fingerprint:compare  	 # Compare fingerprint against local directory
eas fingerprint:compare   	 # Compare provided fingerprints
eas fingerprint:compare --build-id  	 # Compare fingerprint from build against local directory
eas fingerprint:compare --build-id  --environment production 	 # Compare fingerprint from build against local directory with the "production" environment
eas fingerprint:compare --build-id  --build-id 	 # Compare fingerprint from a build against another build
eas fingerprint:compare --build-id  --update-id 	 # Compare fingerprint from build against fingerprint from update
eas fingerprint:compare  --update-id  	 # Compare fingerprint from update against provided fingerprint
```

### `eas fingerprint:generate`

Generate fingerprints from the current project.

#### Usage

```sh
eas fingerprint:generate [-p android|ios] [--environment  | -e ] [--json] [--non-interactive]
```

#### Flags

-   `-e, --build-profile=<value>` Name of the build profile from **eas.json.**
-   `-p, --platform=<option>` <options: android|ios>.
-   `--environment=<value>` Environment variable's environment, for example, 'production', 'preview', 'development'.
-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--non-interactive` Run the command in non-interactive mode.

#### Examples

```sh
eas fingerprint:generate  	 # Generate fingerprint in interactive mode
eas fingerprint:generate --build-profile preview  	 # Generate a fingerprint using the "preview" build profile
eas fingerprint:generate --environment preview  	 # Generate a fingerprint using the "preview" environment
eas fingerprint:generate --json --non-interactive --platform android  	 # Output fingerprint json to stdout
```

### `eas help [COMMAND]`

Display help for eas.

#### Usage

```sh
eas help [COMMAND...] [-n]
```

#### Argument

-   `[COMMAND...]` Command to show help for.

#### Flag

-   `-n, --nested-commands` Include all nested commands in the output.

### `eas init`

Create or link an EAS project.

#### Usage

```sh
eas init [--id ] [--force] [--non-interactive]
```

#### Flags

-   `--force` Whether to create a new project/link an existing project without additional prompts or overwrite any existing project ID when running with `--id` flag.
-   `--id=<value>` ID of the EAS project to link.
-   `--non-interactive` Run the command in non-interactive mode.

#### Alias

```sh
eas init
```

### `eas init:onboarding [TARGET_PROJECT_DIRECTORY]`

Continue onboarding process started on the [https://expo.new](https://expo.new) website.

#### Usage

```sh
eas init:onboarding [TARGET_PROJECT_DIRECTORY]
```

#### Aliases

```sh
eas init:onboarding
eas onboarding
```

### `eas login`

Log in with your Expo account.

#### Usage

```sh
eas login [-s] [-b]
```

#### Flags

-   `-b, --browser` Login with your browser.
-   `-s, --sso` Login with SSO.

#### Alias

```sh
eas login
```

### `eas logout`

Log out.

#### Usage

```sh
eas logout
```

#### Alias

```sh
eas logout
```

### `eas metadata:lint`

Validate the local store configuration.

#### Usage

```sh
eas metadata:lint [--json] [--profile ]
```

#### Flags

-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`.
-   `--profile=<value>` Name of the submit profile from **eas.json.** Defaults to "production" if defined in **eas.json.**

### `eas metadata:pull`

Generate the local store configuration from the app stores.

#### Usage

```sh
eas metadata:pull [-e ]
```

#### Flag

-   `-e, --profile=<value>` Name of the submit profile from **eas.json.** Defaults to "production" if defined in **eas.json.**

### `eas metadata:push`

Sync the local store configuration to the app stores.

#### Usage

```sh
eas metadata:push [-e ]
```

#### Flag

-   `-e, --profile=<value>` Name of the submit profile from **eas.json.** Defaults to "production" if defined in **eas.json.**

### `eas new [PATH]`

Create a new project configured with Expo Application Services (EAS).

#### Usage

```sh
eas new [PATH] [-p bun|npm|pnpm|yarn]
```

#### Argument

-   `[PATH]` Path to create the project (defaults to current directory).

#### Flag

-   `-p, --package-manager=<option>` [default: npm] Package manager to use for installing dependencies <options: bun|npm|pnpm|yarn>.

#### Alias

```sh
eas new
```

### `eas onboarding [TARGET_PROJECT_DIRECTORY]`

Continue onboarding process started on the [https://expo.new](https://expo.new) website.

#### Usage

```sh
eas onboarding [TARGET_PROJECT_DIRECTORY]
```

#### Aliases

```sh
eas init:onboarding
eas onboarding
```

### `eas open`

Open the project page in a web browser.

#### Usage

```sh
eas open
```

### `eas project:info`

Information about the current project.

#### Usage

```sh
eas project:info
```

### `eas project:init`

Create or link an EAS project.

#### Usage

```sh
eas project:init [--id ] [--force] [--non-interactive]
```

#### Flags

-   `--force` Whether to create a new project/link an existing project without additional prompts or overwrite any existing project ID when running with `--id` flag.
-   `--id=<value>` ID of the EAS project to link.
-   `--non-interactive` Run the command in non-interactive mode.

#### Alias

```sh
eas init
```

### `eas project:new [PATH]`

Create a new project configured with Expo Application Services (EAS).

#### Usage

```sh
eas project:new [PATH] [-p bun|npm|pnpm|yarn]
```

#### Argument

-   `[PATH]` Path to create the project (defaults to current directory).

#### Flag

-   `-p, --package-manager=<option>` [default: npm] Package manager to use for installing dependencies <options: bun|npm|pnpm|yarn>.

#### Alias

```sh
eas new
```

### `eas project:onboarding [TARGET_PROJECT_DIRECTORY]`

Continue onboarding process started on the [https://expo.new](https://expo.new) website.

#### Usage

```sh
eas project:onboarding [TARGET_PROJECT_DIRECTORY]
```

#### Aliases

```sh
eas init:onboarding
eas onboarding
```

### `eas submit`

Submit app binary to App Store and/or Play Store.

#### Usage

```sh
eas submit [-p android|ios|all] [-e ] [--latest | --id  | --path  | --url ]
[--what-to-test ] [--verbose] [--wait] [--verbose-fastlane] [-g ...] [--non-interactive]
```

#### Flags

-   `-e, --profile=<value>` Name of the submit profile from **eas.json.** Defaults to "production" if defined in **eas.json.**
-   `-g, --groups=<value>...` Internal TestFlight testing groups to add the build to (iOS only). Learn more: [https://developer.apple.com/help/app-store-connect/test-a-beta-version/add-internal-testers](https://developer.apple.com/help/app-store-connect/test-a-beta-version/add-internal-testers).
-   `-p, --platform=<option>` <options: android|ios|all>.
-   `--id=<value>` ID of the build to submit.
-   `--latest` Submit the latest build for specified platform.
-   `--non-interactive` Run command in non-interactive mode.
-   `--path=<value>` Path to the **.apk**/**.aab**/**.ipa** file.
-   `--url=<value>` App archive url.
-   `--verbose` Always print logs from EAS Submit.
-   `--verbose-fastlane` Enable verbose logging for the submission process.
-   `--[no-]wait` Wait for submission to complete.
-   `--what-to-test=<value>` Sets the "What to test" information in TestFlight (iOS only).

#### Alias

```sh
eas build:submit
```

### `eas update`

Publish an update group.

#### Usage

```sh
eas update [--branch ] [--channel ] [-m ] [--input-dir ] [--skip-bundler]
[--clear-cache] [--emit-metadata] [--rollout-percentage ] [-p android|ios|all] [--auto] [--private-key-path
] [--environment ] [--json] [--non-interactive]
```

#### Flags

-   `-m, --message=<value>` A short message describing the update.
-   `-p, --platform=<option>` [default: all] <options: android|ios|all>.
-   `--auto` Use the current git branch and commit message for the EAS branch and update message.
-   `--branch=<value>` Branch to publish the update group on.
-   `--channel=<value>` Channel that the published update should affect.
-   `--clear-cache` Clear the bundler cache before publishing.
-   `--emit-metadata` Emit "**eas-update-metadata.json**" in the bundle folder with detailed information about the generated updates.
-   `--environment=<value>` Environment to use for the server-side defined EAS environment variables during command execution, for example, "production", "preview", "development". Required for projects using Expo SDK 55 or greater.
-   `--input-dir=<value>` [default: dist] Location of the bundle.
-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--non-interactive` Run the command in non-interactive mode.
-   `--private-key-path=<value>` File containing the PEM-encoded private key corresponding to the certificate in expo-updates' configuration. Defaults to a file named "**private-key.pem**" in the certificate's directory. Only relevant if you are using code signing: [https://docs.expo.dev/eas-update/code-signing/](https://docs.expo.dev/eas-update/code-signing/).
-   `--rollout-percentage=<value>` Percentage of users this update should be immediately available to. Users not in the rollout will be served the previous latest update on the branch, even if that update is itself being rolled out. The specified number must be an integer between 1 and 100. When not specified, this defaults to 100.
-   `--skip-bundler` Skip running Expo CLI to bundle the app before publishing.

### `eas update:configure`

Configure the project to support EAS Update.

#### Usage

```sh
eas update:configure [-p android|ios|all] [--environment ] [--non-interactive]
```

#### Flags

-   `-p, --platform=<option>` [default: all] Platform to configure <options: android|ios|all>.
-   `--environment=<value>` Environment to use for the server-side defined EAS environment variables during command execution, for example, "production", "preview", "development".
-   `--non-interactive` Run the command in non-interactive mode.

### `eas update:delete GROUPID`

Delete all the updates in an update group.

#### Usage

```sh
eas update:delete GROUPID [--json] [--non-interactive]
```

#### Argument

-   `GROUPID` The ID of an update group to delete.

#### Flags

-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--non-interactive` Run the command in non-interactive mode.

### `eas update:edit [GROUPID]`

Edit all the updates in an update group.

#### Usage

```sh
eas update:edit [GROUPID] [--rollout-percentage ] [--branch ] [--json] [--non-interactive]
```

#### Argument

-   `[GROUPID]` The ID of an update group to edit.

#### Flags

-   `--branch=<value>` Branch for which to list updates to select from.
-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--non-interactive` Run the command in non-interactive mode.
-   `--rollout-percentage=<value>` Rollout percentage to set for a rollout update. The specified number must be an integer between 1 and 100.

### `eas update:list`

View the recent updates.

#### Usage

```sh
eas update:list [--branch  | --all] [-p android|ios|all] [--runtime-version ] [--offset
] [--limit ] [--json] [--non-interactive]
```

#### Flags

-   `-p, --platform=<option>` Filter updates by platform <options: android|ios|all>.
-   `--all` List updates on all branches.
-   `--branch=<value>` List updates only on this branch.
-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--limit=<value>` The number of items to fetch each query. Defaults to 25 and is capped at 50.
-   `--non-interactive` Run the command in non-interactive mode.
-   `--offset=<value>` Start queries from specified index. Use for paginating results. Defaults to 0.
-   `--runtime-version=<value>` Filter updates by runtime version.

### `eas update:republish`

Roll back to an existing update.

#### Usage

```sh
eas update:republish [--channel  | --branch  | --group ] [--destination-channel  |
--destination-branch ] [-m ] [-p android|ios|all] [--private-key-path ] [--rollout-percentage
] [--json] [--non-interactive]
```

#### Flags

-   `-m, --message=<value>` Short message describing the republished update group.
-   `-p, --platform=<option>` [default: all] <options: android|ios|all>.
-   `--branch=<value>` Branch name to select an update group to republish from.
-   `--channel=<value>` Channel name to select an update group to republish from.
-   `--destination-branch=<value>` Branch name to republish to if republishing to a different branch.
-   `--destination-channel=<value>` Channel name to select a branch to republish to if republishing to a different branch.
-   `--group=<value>` Update group ID to republish.
-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--non-interactive` Run the command in non-interactive mode.
-   `--private-key-path=<value>` File containing the PEM-encoded private key corresponding to the certificate in expo-updates' configuration. Defaults to a file named "**private-key.pem**" in the certificate's directory. Only relevant if you are using code signing: [https://docs.expo.dev/eas-update/code-signing/](https://docs.expo.dev/eas-update/code-signing/).
-   `--rollout-percentage=<value>` Percentage of users this update should be immediately available to. Users not in the rollout will be served the previous latest update on the branch, even if that update is itself being rolled out. The specified number must be an integer between 1 and 100. When not specified, this defaults to 100.

### `eas update:revert-update-rollout`

Revert a rollout update for a project.

#### Usage

```sh
eas update:revert-update-rollout [--channel  | --branch  | --group ] [-m ] [--private-key-path
] [--json] [--non-interactive]
```

#### Flags

-   `-m, --message=<value>` Short message describing the revert.
-   `--branch=<value>` Branch name to select an update group to revert the rollout update from.
-   `--channel=<value>` Channel name to select an update group to revert the rollout update from.
-   `--group=<value>` Rollout update group ID to revert.
-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--non-interactive` Run the command in non-interactive mode.
-   `--private-key-path=<value>` File containing the PEM-encoded private key corresponding to the certificate in expo-updates' configuration. Defaults to a file named "**private-key.pem**" in the certificate's directory. Only relevant if you are using code signing: [https://docs.expo.dev/eas-update/code-signing/](https://docs.expo.dev/eas-update/code-signing/).

### `eas update:roll-back-to-embedded`

Roll back to the embedded update.

#### Usage

```sh
eas update:roll-back-to-embedded [--branch ] [--channel ] [--runtime-version ] [--message ] [-p
android|ios|all] [--private-key-path ] [--json] [--non-interactive]
```

#### Flags

-   `-p, --platform=<option>` [default: all] <options: android|ios|all>.
-   `--branch=<value>` Branch to publish the rollback to embedded update group on.
-   `--channel=<value>` Channel that the published rollback to embedded update should affect.
-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--message=<value>` A short message describing the rollback to embedded update.
-   `--non-interactive` Run the command in non-interactive mode.
-   `--private-key-path=<value>` File containing the PEM-encoded private key corresponding to the certificate in expo-updates' configuration. Defaults to a file named "**private-key.pem**" in the certificate's directory. Only relevant if you are using code signing: [https://docs.expo.dev/eas-update/code-signing/](https://docs.expo.dev/eas-update/code-signing/).
-   `--runtime-version=<value>` Runtime version that the rollback to embedded update should target.

### `eas update:rollback`

Roll back to an embedded update or an existing update. Users wishing to run this command non-interactively should instead execute "eas update:republish" or "eas update:roll-back-to-embedded".

#### Usage

```sh
eas update:rollback [--private-key-path ]
```

#### Flag

-   `--private-key-path=<value>` File containing the PEM-encoded private key corresponding to the certificate in expo-updates' configuration. Defaults to a file named "**private-key.pem**" in the certificate's directory. Only relevant if you are using code signing: [https://docs.expo.dev/eas-update/code-signing/](https://docs.expo.dev/eas-update/code-signing/).

### `eas update:view GROUPID`

Update group details.

#### Usage

```sh
eas update:view GROUPID [--json]
```

#### Argument

-   `GROUPID` The ID of an update group.

#### Flag

-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`.

### `eas upload`

Upload a local build and generate a sharable link.

#### Usage

```sh
eas upload [-p ios|android] [--build-path ] [--fingerprint ] [--json] [--non-interactive]
```

#### Flags

-   `-p, --platform=<option>` <options: ios|android>.
-   `--build-path=<value>` Path for the local build.
-   `--fingerprint=<value>` Fingerprint hash of the local build.
-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--non-interactive` Run the command in non-interactive mode.

### `eas webhook:create`

Create a webhook.

#### Usage

```sh
eas webhook:create [--event BUILD|SUBMIT] [--url ] [--secret ] [--non-interactive]
```

#### Flags

-   `--event=<option>` Event type that triggers the webhook <options: BUILD|SUBMIT>.
-   `--non-interactive` Run the command in non-interactive mode.
-   `--secret=<value>` Secret used to create a hash signature of the request payload, provided in the 'Expo-Signature' header.
-   `--url=<value>` Webhook URL.

### `eas webhook:delete [ID]`

Delete a webhook.

#### Usage

```sh
eas webhook:delete [ID] [--non-interactive]
```

#### Argument

-   `[ID]` ID of the webhook to delete.

#### Flag

-   `--non-interactive` Run the command in non-interactive mode.

### `eas webhook:list`

List webhooks.

#### Usage

```sh
eas webhook:list [--event BUILD|SUBMIT] [--json]
```

#### Flags

-   `--event=<option>` Event type that triggers the webhook <options: BUILD|SUBMIT>.
-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`.

### `eas webhook:update`

Update a webhook.

#### Usage

```sh
eas webhook:update --id  [--event BUILD|SUBMIT] [--url ] [--secret ] [--non-interactive]
```

#### Flags

-   `--event=<option>` Event type that triggers the webhook <options: BUILD|SUBMIT>.
-   `--id=<value>` (required) Webhook ID.
-   `--non-interactive` Run the command in non-interactive mode.
-   `--secret=<value>` Secret used to create a hash signature of the request payload, provided in the 'Expo-Signature' header.
-   `--url=<value>` Webhook URL.

### `eas webhook:view ID`

View a webhook.

#### Usage

```sh
eas webhook:view ID
```

#### Argument

-   `ID` ID of the webhook to view.

### `eas whoami`

Show the username you are logged in as.

#### Usage

```sh
eas whoami
```

#### Alias

```sh
eas whoami
```

### `eas worker:alias`

Assign deployment aliases.

#### Usage

```sh
eas worker:alias [--prod] [--alias name] [--id xyz123] [--json] [--non-interactive]
```

#### Flags

-   `--alias=name` Custom alias to assign to the existing deployment.
-   `--id=xyz123` Unique identifier of an existing deployment.
-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--non-interactive` Run the command in non-interactive mode.
-   `--prod` Promote an existing deployment to production.

#### Aliases

```sh
eas worker:alias
eas deploy:promote
```

### `eas worker:alias:delete [ALIAS_NAME]`

Delete deployment aliases.

#### Usage

```sh
eas worker:alias:delete [ALIAS_NAME] [--json] [--non-interactive]
```

#### Flags

-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--non-interactive` Run the command in non-interactive mode.

#### Alias

```sh
eas worker:alias:delete
```

### `eas worker:delete [DEPLOYMENT_ID]`

Delete a deployment.

#### Usage

```sh
eas worker:delete [DEPLOYMENT_ID] [--json] [--non-interactive]
```

#### Flags

-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`. Implies `--non-interactive`.
-   `--non-interactive` Run the command in non-interactive mode.

#### Alias

```sh
eas worker:delete
```

### `eas workflow:cancel`

Cancel one or more workflow runs. If no workflow run IDs are provided, you will be prompted to select IN_PROGRESS runs to cancel.

#### Usage

```sh
eas workflow:cancel [--non-interactive]
```

#### Flag

-   `--non-interactive` Run the command in non-interactive mode.

### `eas workflow:create [NAME]`

Create a new workflow configuration YAML file.

#### Usage

```sh
eas workflow:create [NAME] [--skip-validation]
```

#### Argument

-   `[NAME]` Name of the workflow file (must end with **.yml** or **.yaml**).

#### Flag

-   `--skip-validation` If set, the workflow file will not be validated before being created.

### `eas workflow:logs [ID]`

View logs for a workflow run, selecting a job and step to view. You can pass in either a workflow run ID or a job ID. If no ID is passed in, you will be prompted to select from recent workflow runs for the current project.

#### Usage

```sh
eas workflow:logs [ID] [--json] [--non-interactive] [--all-steps]
```

#### Argument

-   `[ID]` ID of the workflow run or workflow job to view logs for.

#### Flags

-   `--all-steps` Print all logs, rather than prompting for a specific step. This will be automatically set when in non-interactive mode.
-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`.
-   `--non-interactive` Run the command in non-interactive mode.

### `eas workflow:run FILE`

Run an EAS workflow. The entire local project directory will be packaged and uploaded to EAS servers for the workflow run, unless the `--ref` flag is used.

#### Usage

```sh
eas workflow:run FILE [--non-interactive] [--wait] [-F ...] [--ref ] [--json]
```

#### Argument

-   `FILE` Path to the workflow file to run.

#### Flags

-   `-F, --input=<value>...` Set workflow inputs.
-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`.
-   `--non-interactive` Run the command in non-interactive mode.
-   `--ref=<value>` Git reference to run the workflow on.
-   `--[no-]wait` Wait for workflow run to complete. Defaults to false.

### `eas workflow:runs`

List recent workflow runs for this project, with their IDs, statuses, and timestamps.

#### Usage

```sh
eas workflow:runs [--workflow ] [--status ACTION_REQUIRED|CANCELED|FAILURE|IN_PROGRESS|NEW|SUCCESS]
[--json] [--limit ]
```

#### Flags

-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`.
-   `--limit=<value>` The number of items to fetch each query. Defaults to 10 and is capped at 100.
-   `--status=<option>` If present, filter the returned runs to select those with the specified status <options: ACTION_REQUIRED|CANCELED|FAILURE|IN_PROGRESS|NEW|SUCCESS>.
-   `--workflow=<value>` If present, the query will only return runs for the specified workflow file name.

### `eas workflow:status [WORKFLOW_RUN_ID]`

Show the status of an existing workflow run. If no run ID is provided, you will be prompted to select from recent workflow runs for the current project.

#### Usage

```sh
eas workflow:status [WORKFLOW_RUN_ID] [--non-interactive] [--wait] [--json]
```

#### Argument

-   `[WORKFLOW_RUN_ID]` A workflow run ID.

#### Flags

-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`.
-   `--non-interactive` Run the command in non-interactive mode.
-   `--[no-]wait` Wait for workflow run to complete. Defaults to false.

### `eas workflow:validate PATH`

Validate a workflow configuration yaml file.

#### Usage

```sh
eas workflow:validate PATH [--non-interactive]
```

#### Argument

-   `PATH` Path to the workflow configuration YAML file (must end with **.yml** or **.yaml**).

#### Flag

-   `--non-interactive` Run the command in non-interactive mode.

### `eas workflow:view [ID]`

View details for a workflow run, including jobs. If no run ID is provided, you will be prompted to select from recent workflow runs for the current project.

#### Usage

```sh
eas workflow:view [ID] [--json] [--non-interactive]
```

#### Argument

-   `[ID]` ID of the workflow run to view.

#### Flags

-   `--json` Enable JSON output, non-JSON messages will be printed to `stderr`.
-   `--non-interactive` Run the command in non-interactive mode.
