sap.ui.define(
	[
		"sap/ui/base/Object",
		"sap/m/InstanceManager",
		"sap/m/MessageBox",
		"sap/ui/base/EventProvider",
	],
	function (UI5Object, InstanceManger, MessageBox, EventProvider) {
		"use strict";

		/**
		 * @constant {string}
		 */
		const MESSAGE_BOX_ID = "MessageBoxToBeShownInSequence"

		return UI5Object.extend("Demo.MessageBoxSequencer", {

			/**	
			 * @constructor
			 * @public
			 */
			constructor: function () {
				UI5Object.apply(this, arguments)
				// Internal Queue, FIFO
				this._messageQueue = []
			},

			/**
			 * Handle incoming messages without use of promises/async or await, execution flow does not matter as the 
			 * state is handled internally by a queue.
			 * 1. Check if there is already a MessageBox Instance opened
			 * 		1a. If there is, append the message to be shown into the queue and abort further execution
			 * 2. If there is not, create one by using MessageBox.show() which interally openes up a Dialog (creates a DialogInstance)
			 * 3. As MessageBox does not hand us the created DialogInstance, we manually access it right after and attach the `afterClose`-Handler as well.
			 * @param {string|sap.ui.core.Control} message 
			 * @returns 
			 * @public
			 */
			handleMessage: function (message, messageBoxOptions) {
				if (this._getDialogInstanceById(MESSAGE_BOX_ID)) {
					this._messageQueue.push({ message, messageBoxOptions })
					return
				}

				MessageBox.show(message, {
					...messageBoxOptions,
					// icon: MessageBox.Icon.INFORMATION,
					id: MESSAGE_BOX_ID, // => ID to be used for the show dialog. Intended for test scenarios, not recommended for productive apps.
				})

				const dialogInstance = this._getDialogInstanceById(MESSAGE_BOX_ID)
				if (dialogInstance) {
					this._attachAfterCloseHandler(dialogInstance)
				}
			},

			/**
			 * Return the found DialogInstance if there is one by the given Id (only the ones created by us).
			 * In case the InstanceManager does not have it, maybe the ElementRegistry does? ;)
			 * @returns {sap.ui.core.Control|undefined}
			 * @private
			 */
			_getDialogInstanceById: function (Id) {
				return InstanceManger.getOpenDialogs().find((dialog) => dialog.getId() === Id)
			},

			/**
			 * Attaches the internal `afterClose`-Handler function, if it is not already attached to ensure proper sequencing.
			 * No need to check if there are messages, the last function call won't receive a message and therefore stop the execution.
			 * Each MessageBox closing should trigger a "roundtrip" to slowly reduce the queued content.
			 * @private
			 */
			_attachAfterCloseHandler: function (dialogInstance) {
				if (!EventProvider.hasListener(dialogInstance, "afterClose", this._afterCloseHandler, this)) {
					dialogInstance.attachAfterClose(this._afterCloseHandler, this)
				}
			},

			/**
			 * Internal `afterClose`-Handler. Trigger execution flow again after MessageBox has been closed.
			 * @private
			 */
			_afterCloseHandler: async function () {
				const { message, messageBoxOptions } = this._messageQueue.shift() || {};
				if (message) {
					await this.handleMessage(message, messageBoxOptions)
				}
			},

			/**
			 * Destroys the MessageBoxSequencer instance.
			 * @public
			 */
			destroy: function () {
				this._messageQueue = [];
				UI5Object.prototype.destroy.apply(this, arguments)
			}
		});
	}
);
