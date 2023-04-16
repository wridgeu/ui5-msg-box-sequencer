# ui5-msg-box-sequencer

Minimalistic example of what _could_ be done to put Dialogs/Popups in sequence without any async/await/etc.

## Use Case

You have a central event listener for WebSocket messages in your app. This handler directly takes care of any message (text) from a supervisor coming from the backend. You want to ensure that MessageBoxes (or others) are shown in the sequence they're sent from the backend, because sending messages like this is completely asynchronous and can happen at any time from anyone without any sort of predefined order given.

## Usage

As this is a minimalistic example without any tooling, you can simply use the `http-server` or open up the `html` files via [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) directly.

## Template

Demo Template to get things quickly up for testing taken and adjusted from: [CodeSandbox](https://codesandbox.io/s/ui5-example-pglil?from-embed=&file=/webapp/App.view.xml)
