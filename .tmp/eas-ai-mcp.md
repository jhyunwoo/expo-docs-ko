---
modificationDate: March 12, 2026
title: Using Model Context Protocol (MCP) with Expo
description: A guide on integrating Model Context Protocol with Expo projects to enhance AI model capabilities.
---

# Using Model Context Protocol (MCP) with Expo

A guide on integrating Model Context Protocol with Expo projects to enhance AI model capabilities.

> Expo MCP Server requires an [EAS paid plan](https://expo.dev/pricing).

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/) is a standard protocol that allows AI models to integrate with external data sources, providing enhanced context for more precise responses. It enables AI-assisted tools like agents to understand your development environment more deeply, allowing them to provide better assistance with your codebase.

Expo MCP Server is a remote MCP server hosted by Expo that integrates with popular AI-assisted tools such as Claude Code, Cursor, VS Code, and others, enabling them to interact directly with your Expo projects.

[Introducing Expo MCP Server: for accurate, context-aware AI responses](https://www.youtube.com/watch?v=dp9dpIgDxZQ) — Enhance your AI-assisted tools for building apps with Expo.

## What does Expo MCP Server do?

Expo MCP Server teaches your AI-assisted tools about the Expo SDK and lets them interact with mobile simulators and the React Native DevTools. These are some examples of the tasks Expo MCP Server enhances:

**Learn about developing with Expo.** Your AI-assisted tools can fetch the latest official Expo documentation on demand and use it to reply to prompts like:

-   "How do I use Expo Router?"
-   "Search the Expo docs for implementing deep linking"
-   "Read the Expo Router docs page"
-   "What is Expo CNG?"

**Manage dependencies.** Expo MCP Server guides you toward installing our recommended packages and uses `npx expo install` to install known, compatible versions.

-   "Add SQLite with basic CRUD operations"
-   "Install `expo-camera` and show me how to take photos"
-   "Add `expo-notifications` for push notifications"

**Manage builds and workflows.** Expo MCP Server can trigger and monitor EAS builds, run workflows, and pull crash data from TestFlight:

-   "Investigate why my most recent iOS build on EAS failed"
-   "Identify any patterns in recent failing workflows"
-   "Create a workflow that runs Maestro tests"
-   "Show me recent TestFlight crashes"
-   "Show TestFlight feedback for my app"

**Automate visual verification and testing.** Multimodal AI-assisted tools can screenshot and interact with your running app in a simulator. Expo MCP Server includes local capabilities enabled by adding the `expo-mcp` package to your project's dependencies.

-   "Add a blue circle view and make sure it renders correctly"
-   "Add a button and tap it to verify the interaction works"
-   "Add a counter button that increments on tap and verify the state updates correctly"

Your AI-assisted tools can autonomously write the code, capture screenshots to verify the UI is correct, test interactions, and fix issues they find.

The complete table of [MCP capabilities](/eas/ai/mcp#available-mcp-capabilities) documents the tools and prompts Expo MCP Server provides to AI-assisted tools.

## Prerequisites

Before using Expo MCP Server, ensure you have:

-   An Expo account with an EAS paid plan
-   An Expo project created either with `npx create-expo-app@latest --template default@sdk-55` or has the latest `expo` package version installed
-   AI-assisted tools with remote MCP server support (Claude Code, Cursor, VS Code, and so on)

## Installation and setup

### Install Expo MCP Server

Expo MCP Server supports integration with various AI-assisted tools. Use the general settings below or expand your specific tool for detailed instructions:

-   **Server type**: Streamable HTTP
-   **URL**: `https://mcp.expo.dev/mcp`
-   **Authentication**: OAuth

Claude Code setup

```sh
claude mcp add --transport http expo-mcp https://mcp.expo.dev/mcp
```

After installation, run `/mcp` in your Claude Code session to authenticate.

Cursor setup

Click the following link to install the MCP server for Cursor:

VS Code setup

1.  Open Command Palette (Cmd ⌘ + Shift + P or Ctrl + Shift + P)
2.  Run **MCP: Add Server**
3.  Select **HTTP**
4.  Enter the server details:
    -   **URL**: `https://mcp.expo.dev/mcp`
    -   **Name**: expo-mcp

Codex setup

```sh
codex mcp add expo-mcp --url https://mcp.expo.dev/mcp
```

The above command adds the MCP server to your Codex configuration file and prompts you to authenticate with your Expo account.

### Authenticate with Expo

After installing the MCP server, you'll need to authenticate using one of two methods:

#### Access token (recommended)

Generate a **Personal access token** from your Expo account and use it during the OAuth flow.

-   To generate an access token, open [Access tokens](https://expo.dev/accounts/%5Baccount%5D/settings/access-tokens) settings page in EAS dashboard.
-   Under **Personal access tokens**, click **Create token**. Copy the token and use it during the OAuth flow.

#### Credentials

Use your Expo account username and password. In this case, the server will generate an access token automatically.

### Set up local capabilities (Recommended)

> Local capabilities are only available in **SDK 54 and later**.

For the full MCP experience with advanced features like taking screenshots from your iOS Simulator, opening DevTools, and automation capabilities, set up a local Expo development server:

```sh
cd /path/to/your-project
npx expo install expo-mcp --dev
npx expo whoami || npx expo login
EXPO_UNSTABLE_MCP_SERVER=1 npx expo start
```

> Whenever you start or stop the development server, you need to **reconnect or restart** your MCP server connection in your AI-assisted tool to ensure the AI-assisted tool gets refreshed capabilities.

## Server capabilities versus local capabilities

Expo MCP Server provides two types of capabilities depending on your setup:

### Server capabilities

Server capabilities are available with just the remote MCP server connection, without needing to set up a local development server. The **search_documentation** tool is an example of a server capability.

### Local capabilities

Local capabilities require a local Expo development server to be running and provide advanced features that interact with your local development environment:

-   **Automation tools**: Take screenshots, tap views, find elements by testID
-   **Development tools**: Open React Native DevTools
-   **Project analysis**: Generate `expo-router` sitemap

These capabilities enable more sophisticated workflows like automated testing, visual verification, and deeper project introspection. To use local capabilities, you will need to follow the [Set up local capabilities](/eas/ai/mcp#set-up-local-capabilities-recommended) section above.

## Available MCP capabilities

> The MCP capabilities are subject to change from the `expo-mcp` package updates or MCP server changes. The following list is a reference and may not be up to date.

### Tools

| Tool | Description | Example Prompt | Availability |
| --- | --- | --- | --- |
| `learn` | Learn Expo how-to for a specific topic | "learn how to use expo-router" | Server |
| `search_documentation` | Search from Expo documentation using natural language | "search documentation for CNG" | Server |
| `read_documentation` | Fetch a single Expo documentation page as markdown | "read the Expo Router docs page" | Server |
| `add_library` | Install Expo packages with `npx expo install` and show documentation | "add sqlite and basic CRUD to the app" | Server |
| `build_info` | Get details of a specific build | "get the status of my latest iOS build" | Server |
| `build_list` | List builds for a project | "list the recent builds for this project" | Server |
| `build_logs` | Fetch logs for a completed build | "show me the logs for the failed build" | Server |
| `build_run` | Trigger a new build from a git reference | "run a production build for iOS" | Server |
| `build_cancel` | Cancel a build that is queued or in progress | "cancel the build that is currently in progress" | Server |
| `build_submit` | Submit a build to app stores | "submit the latest build to the App Store" | Server |
| `testflight_crashes` | Fetch TestFlight crash data or get a full stack trace by ID | "show me recent TestFlight crashes" | Server |
| `testflight_feedback` | Fetch TestFlight screenshot feedback with device info and comments | "show TestFlight feedback for my app" | Server |
| `workflow_create` | Create a new workflow YAML file and learn workflow syntax | "create a CI/CD workflow for building and deploying" | Server |
| `workflow_info` | Get details of a specific workflow run | "get the status of the latest workflow run" | Server |
| `workflow_list` | List recent workflow runs for a project | "list the recent workflow runs" | Server |
| `workflow_logs` | Fetch logs for a specific job in an workflow run | "show me the logs for the build job in the workflow" | Server |
| `workflow_run` | Trigger a workflow run from a git reference | "run the build-and-deploy workflow" | Server |
| `workflow_cancel` | Cancel a running workflow | "cancel the running workflow" | Server |
| `workflow_validate` | Validate workflow YAML syntax and configuration | "validate my workflow file" | Server |
| `expo_router_sitemap` | Execute and display expo-router-sitemap output | "check the expo-router-sitemap output" | Local (requires `expo-router` library) |
| `open_devtools` | Open React Native DevTools | "open devtools" | Local |
| `automation_tap` | Tap at specific screen coordinates | "tap the screen at x=12, y=22" | Local |
| `automation_take_screenshot` | Take full device screenshots | "take a screenshot and verify the blue circle view" | Local |
| `automation_find_view_by_testid` | Find and analyze views by testID | "dump properties for testID 'button-123'" | Local |
| `automation_tap_by_testid` | Tap views by testID | "click the view with testID 'button-123'" | Local |
| `automation_take_screenshot_by_testid` | Screenshot specific views by testID | "screenshot the view with testID 'button-123'" | Local |

### Prompts

If your AI-assisted tool supports [MCP prompts](https://modelcontextprotocol.io/specification/2025-06-18/server/prompts), you may see additional menu options, such as [slash commands in Claude Code](https://docs.claude.com/en/docs/claude-code/mcp#use-mcp-prompts-as-slash-commands):

| Prompt | Description | Availability |
| --- | --- | --- |
| `expo_router_sitemap` | Execute and display expo-router-sitemap output | Local (requires `expo-router` library) |

## Limitations

The current implementation has the following limitations:

-   Only supports a **single development server** connection at a time
-   iOS support for local capabilities is limited to simulators only (physical devices not yet supported)
-   iOS support for local capabilities is only available on macOS hosts.

## Additional resources

[Model Context Protocol Documentation](https://modelcontextprotocol.io/) — Learn more about the MCP specification and protocol details.
