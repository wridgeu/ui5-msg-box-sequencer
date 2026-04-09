# ui5-msg-box-sequencer

Minimalistic example of what _could_ be done to put Dialogs/Popups in sequence without any async/await/etc. Currently explicitly developed against the [`MessageBox`](https://ui5.sap.com/#/api/sap.m.MessageBox) Control.

## Use Case

You have a central event listener (like the app controller where any other view will be embedded in or the component) for WebSocket messages in your app. This handler directly takes care of any message (text) from a supervisor coming from the backend. You want to ensure that MessageBoxes (or others) are shown in the sequence they're sent from the backend, because sending messages like this is completely asynchronous and can happen at any time from anyone without any sort of predefined order given.

Of course this could also be implemented as singleton (with a then shared queue across usages or the queue could be pulled up into the prototype so instances share the same queue no matter what) and used accordingly.

For a full WebSocket integration example with retry logic, eventing facade, and a custom terminal control, see [ui5-websocket-demo](https://github.com/wridgeu/ui5-websocket-demo).

### Other designs

You could also have queues or save messages in the backend and have various checks if someone is logged/using the application before sending them and so on. The sky is the limit when it comes to architecting this, it usually boils down to the business requirements and time constraint.

## Usage

1. Have NodeJS installed
2. Install all dependencies
   ```sh
   npm i
   ```
3. Run the application via
   ```sh
   npm start
   ```
4. Run the tests via
   ```sh
   npm test
   ```

## Contribute

Feel free to open any kind of issue or pr, any idea/improvement or similar is very welcome.

## Template

Demo Template to get things quickly up for testing taken and adjusted from: [CodeSandbox](https://codesandbox.io/s/ui5-example-pglil?from-embed=&file=/webapp/App.view.xml)
