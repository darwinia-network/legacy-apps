# overview

A Portal into the Darwinia networks. Provides a view and interaction layer from a browser.

## overview

The repo is split into a number of packages, each representing an application. These are -

- [apps](packages/apps/) This is the main entry point. It handles the selection sidebar and routing to the specific application being displayed.
- [page-accounts](packages/page-accounts/) A basic account management app.
- [page-extrinsics](packages/page-extrinsics/) Submission of extrinsics to a node.
- [page-settings](packages/page-settings/) A basic settings management app, allowing choice of language, node to connect to, and theme
- [page-staking](packages/page-staking/) A basic staking management app, allowing staking and nominations.
- [page-storage](packages/page-storage/) A simple node storage query application. Multiple queries can be queued and updates as new values become available.

- [react-components](packages/react-components/) A reactive (using RxJS) application framework with a number of useful shared components.
- [react-signer](packages/react-signer/) Signer implementation for apps.
- [react-query](packages/react-query) Base components that use the RxJS Observable APIs

## development

Contributions are welcome!

To get started -

1. Clone the repo locally, via `git clone https://github.com/darwinia-network/apps <optional local path>`
2. Ensure that you have a recent LTS version of Node.js, for development purposes [Node >=10.13.0](https://nodejs.org/en/) is recommended.
3. Ensure that you have a recent version of Yarn, for development purposes [Yarn >=1.10.1](https://yarnpkg.com/docs/install) is required.
4. Install the dependencies by running `yarn`
5. Ready! Now you can launch the UI (assuming you have a local Darwinia Node running), via `yarn run start`
6. Access the UI via [http://localhost:3001](http://localhost:3001)

