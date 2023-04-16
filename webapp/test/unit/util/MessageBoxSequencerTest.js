/*global QUnit*/

sap.ui.define([
        "Demo/MessageBoxSequencer",
        "sap/m/InstanceManager"
], function (MessageBoxSequencer, InstanceManager) {
        "use strict";

        QUnit.module("Message Box Sequencer", {
                beforeEach: function () {
                        this._sequencer = new MessageBoxSequencer();
                },
                afterEach: function () {
                        this._sequencer.destroy()
                }
        });

        QUnit.test("Should create a MessageMox", async function (assert) {
                const done = assert.async()

                this._sequencer.handleMessage("Test Case 1")

                const messageBoxInstance = InstanceManager.getOpenDialogs().find((dialog) => dialog.getId() === "MessageBoxToBeShownInSequence")

                assert.ok(messageBoxInstance)
                assert.equal(messageBoxInstance.getId(), "MessageBoxToBeShownInSequence")

                await new Promise((resolve) => {
                        setTimeout(async () => {
                                await new Promise((res) => InstanceManager.closeAllDialogs(res))
                                resolve(done())
                        }, 500)
                })
        });

        QUnit.test("Should store 3 messages into internal message queue", async function (assert) {
                const done = assert.async()

                this._sequencer._attachAfterCloseHandler = this.stub().returns(null) // prevent chaining
                this._sequencer.handleMessage("Test Case 2")
                this._sequencer.handleMessage("Text2")
                this._sequencer.handleMessage("Text3")
                this._sequencer.handleMessage("Text4")

                assert.equal(this._sequencer._messageQueue.length, 3)

                await new Promise((resolve) => {
                        setTimeout(async () => {
                                await new Promise((res) => InstanceManager.closeAllDialogs(res))
                                resolve(done())
                        }, 500)
                })
        });

        QUnit.test("Should find a created MessageBox by it's Id", async function (assert) {
                const done = assert.async()

                this._sequencer.handleMessage("Test Case 3")
                const messageBoxInstance = this._sequencer._getDialogInstanceById("MessageBoxToBeShownInSequence")

                assert.ok(messageBoxInstance)
                assert.equal(messageBoxInstance.getId(), "MessageBoxToBeShownInSequence")

                await new Promise((resolve) => {
                        setTimeout(async () => {
                                await new Promise((res) => InstanceManager.closeAllDialogs(res))
                                resolve(done())
                        }, 500)
                })
        });

        QUnit.test("Should open 4 MessageBoxes after another", async function (assert) {
                const done = assert.async()

                this._sequencer.handleMessage("Text0", { title: "Text0" })
                this._sequencer.handleMessage("Text1", { title: "Text1" })
                this._sequencer.handleMessage("Text2", { title: "Text2" })
                this._sequencer.handleMessage("Text3", { title: "Text3" })

                console.log(this._sequencer._getDialogInstanceById("MessageBoxToBeShownInSequence").getTitle())
                let index
                for (index = 0; index < 4; index++) {
                        assert.equal(this._sequencer._getDialogInstanceById("MessageBoxToBeShownInSequence").getTitle(), `Text${index}`)
                        await new Promise((res) => InstanceManager.closeAllDialogs(res))
                }

                // We should've looped 4 times, closing 4 MessageBoxes in total
                assert.equal(index, 4)

                await new Promise((resolve) => {
                        setTimeout(async () => {
                                resolve(done())
                        }, 500)
                })
        });
});