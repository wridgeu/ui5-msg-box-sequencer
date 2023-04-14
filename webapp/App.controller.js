sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/InstanceManager",
    "sap/m/MessageBox",
    "sap/ui/base/EventProvider",
    "Demo/MessageBoxSequencer"
  ],
  function (Controller, InstanceManger, MessageBox, EventProvider, MessageBoxSequencer) {
    "use strict";
    return Controller.extend("Demo.App", {
      onInit: function () {
        this._messageBoxSequencer = new MessageBoxSequencer()
        // this._messageToBeShownLater = []
      },

      onButton: function () {
        // pretend a WebSocket message and some further messages after immediately afterwards
        let value;
        for (let i = 0; i < 5; ++i) {
          value = this.byId(`input${i}`).getValue()
          if (!value || typeof value !== 'string') {
            continue;
          }
          this._webSocketHandler(value)
        }
      },

      _webSocketHandler: function (text) {
        this._messageBoxSequencer.handleMessage(text)
      }
      // _webSocketHandler: async function (text) {
      //   let skip = await new Promise((res) => {
      //     InstanceManger.getOpenDialogs().forEach((dialog) => {
      //       if (dialog.getId() === "test") {
      //         this._messageToBeShownLater.push(text)
      //         // register callback to currently opened popup
      //         if (!EventProvider.hasListener(dialog, "afterClose", this._afterCloseHandler, this) && this._messageToBeShownLater.length !== 0) {
      //           dialog.attachAfterClose(this._afterCloseHandler, this)
      //         }
      //         res(true);
      //       }
      //     })
      //     res(false);
      //   })
      //   if (skip) {
      //     return;
      //   }
      //   await new Promise((res) => {
      //     MessageBox.show(text.toString(), {
      //       icon: MessageBox.Icon.INFORMATION,
      //       id: "test",
      //       actions: [MessageBox.Action.YES, MessageBox.Action.NO],
      //       onClose: (oAction) => { res("") },
      //     });
      //   })
      // },

      // _afterCloseHandler: async function () {
      //   await this._webSocketHandler(this._messageToBeShownLater.pop())
      // }
    });
  }
);
