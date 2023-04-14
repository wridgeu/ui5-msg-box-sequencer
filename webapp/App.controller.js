sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "Demo/MessageBoxSequencer"
  ],
  function (Controller, MessageBoxSequencer) {
    "use strict";
    return Controller.extend("Demo.App", {
      onInit: function () {
        this._messageBoxSequencer = new MessageBoxSequencer()
      },

      onButton() {
        let value;
        for (let i = 0; i < 5; ++i) {
          value = this.byId(`input${i}`).getValue()
          if (!value || typeof value !== 'string') {
            continue;
          }
          this._webSocketHandler(value)
        }
      },

      _webSocketHandler(text) {
        this._messageBoxSequencer.handleMessage(text)
      }
    });
  }
);
