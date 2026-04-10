sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "Demo/MessageBoxSequencer"
  ],
  function (Controller, MessageBoxSequencer) {
    "use strict";
    return Controller.extend("Demo.App", {
      onInit() {
        this._messageBoxSequencer = new MessageBoxSequencer()
      },

      onButton() {
        this.byId("inputBox").getItems()
          .filter((item) => item.isA("sap.m.Input"))
          .map((input) => input.getValue())
          .filter((value) => value && typeof value === "string")
          .forEach((value) => this._messageBoxSequencer.handleMessage(value))
      }
    });
  }
);
