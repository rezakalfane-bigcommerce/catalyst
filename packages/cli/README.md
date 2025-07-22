# @bigcommerce/catalyst

## Known Limitations

- [`<Image />` component](../../core/components/image/index.tsx)?

## Prerequisites

<!-- ff: CATALYST-796.enable_native_hosting_api -->

- Request that BigCommerce enable the Native Hosting feature flag on your BigCommerce store.
- Create a [Store-level API Account](https://support.bigcommerce.com/s/article/Store-API-Accounts) with `modify` permissions on the `Themes` OAuth scope.

## Usage

The Catalyst CLI provides a few simple commands that allow you to deploy a Catalyst storefront application to the BigCommerce Ignition Hosting Platform.

### `link`

The first command you're going to run is called `link`. This command creates a relationship between your local Catalyst codebase, and an Ignition "Project ID". Under the hood, `link` simply writes your selected Project ID to a `projectId` field in a file you can find at `.bigcommerce/project.json`. You are safe to manually modify the Project ID if you please. This may change in a future update. Run `catalyst link --help` for details on how to use the command.

1. Using the store hash and access token you generated in the [prerequisites](#prerequisites) above, run the following command:
   ```bash
   catalyst link --store-hash YOUR_STORE_HASH --access-token YOUR_ACCESS_TOKEN
   ```

> [!WARNING]
> The command above, if ran unmodified, will be saved to your bash/zsh/fish history file. If you do not want to save your access token in plain text to your history file, you have a couple options:
>
> 1. Prepend your command with a space character. This will cause the command to be ignored by the history mechanism:
>    ```bash
>     catalyst link --store-hash YOUR_STORE_HASH --access-token YOUR_ACCESS_TOKEN
>    ```
> 2. Create a file (e.g., `credentials.sh`) with the following environment variables:
>
>    ```bash
>    BIGCOMMERCE_STORE_HASH="YOUR_STORE_HASH"
>    BIGCOMMERCE_ACCESS_TOKEN="YOUR_ACCESS_TOKEN"
>    ```
>
>    _\*Note, the spelling of the variables is important._
>
>    Now, you can run the CLI `link` command and the values from those variables will be read automatically by the CLI (as long as the variable names are spelled exactly as they are above)
>
>    ```bash
>    catalyst link
>    ```

<!-- @todo helpful architecture diagram to explain projects? -->

<!-- @todo how to run the CLI in CI environments -->
