/*global QUnit*/

sap.ui.define([
        "Demo/MessageBoxSequencer",
        "sap/m/InstanceManager",
        "sap/m/Button"
], function (MessageBoxSequencer, InstanceManager, Button) {
        "use strict";

        QUnit.module("MessageBoxSequencer", {
                before: function () {
                        this._stableMessageBoxId = "MessageBoxToBeShownInSequence"
                },
                beforeEach: function () {
                        this._sequencer = new MessageBoxSequencer();
                },
                afterEach: function () {
                        this._sequencer.destroy()
                }
        });

        QUnit.test("Should create a MessageBox", async function (assert) {
                const done = assert.async()

                this._sequencer.handleMessage("Test Case 1")

                const messageBoxInstance = InstanceManager.getOpenDialogs().find((dialog) => dialog.getId() === this._stableMessageBoxId)

                assert.ok(messageBoxInstance, 'MessageBox Instance found')
                assert.equal(messageBoxInstance.getId(), this._stableMessageBoxId, 'MessageBox Id equals internal constant Id')

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

                assert.equal(this._sequencer._messageQueue.length, 3, 'Internal message queue holds 3 texts to be displayed')

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
                const messageBoxInstance = this._sequencer._getDialogInstanceById(this._stableMessageBoxId)

                assert.ok(messageBoxInstance, 'MessageBox Instance found by internal _getDialogInstanceById method')
                assert.equal(messageBoxInstance.getId(), this._stableMessageBoxId, 'MessageBox Id equals internal constant Id')

                await new Promise((resolve) => {
                        setTimeout(async () => {
                                await new Promise((res) => InstanceManager.closeAllDialogs(res))
                                resolve(done())
                        }, 500)
                })
        });

        QUnit.test("Should open 4 MessageBoxes in sequence", async function (assert) {
                const done = assert.async()

                this._sequencer.handleMessage("Text0", { title: "Text0" })
                this._sequencer.handleMessage("Text1", { title: "Text1" })
                this._sequencer.handleMessage("Text2", { title: "Text2" })
                this._sequencer.handleMessage("Text3", { title: "Text3" })

                let index
                let queueLength = 3
                for (index = 0; index < 4; index++) {
                        assert.equal(InstanceManager.getOpenDialogs().find((dialog) => dialog.getId() === this._stableMessageBoxId).getTitle(), `Text${index}`, `MessageBox has been created in proper sequence: ${index}`)
                        assert.equal(this._sequencer._messageQueue.length, queueLength--, 'Internal message queue is reduced after opening a MessageBox accordingly')
                        await new Promise((res) => InstanceManager.closeAllDialogs(res))
                }

                // We should've looped 4 times, closing 4 MessageBoxes in total
                assert.equal(index, 4, 'Looped 4 times, should open 4 MessageBoxes in total')

                await new Promise((resolve) => {
                        setTimeout(async () => {
                                resolve(done())
                        }, 500)
                })
        });

        QUnit.test("Should not display numbers", async function (assert) {
                const done = assert.async()

                this._sequencer.handleMessage(0)

                const messageBoxInstance = InstanceManager.getOpenDialogs().find((dialog) => dialog.getId() === this._stableMessageBoxId)
                assert.deepEqual(messageBoxInstance.getContent(), [], 'Empty content array returned, nothing displayed in the MessageBox')

                await new Promise((resolve) => {
                        setTimeout(async () => {
                                await new Promise((res) => InstanceManager.closeAllDialogs(res))
                                resolve(done())
                        }, 500)
                })
        });


        QUnit.test("Should display string", async function (assert) {
                const done = assert.async()

                this._sequencer.handleMessage("TextString")

                const messageBoxInstance = InstanceManager.getOpenDialogs().find((dialog) => dialog.getId() === this._stableMessageBoxId)

                assert.equal(messageBoxInstance.getContent()[0].isA("sap.m.Text"), true, 'Content array element equals to an sap.m.Text control')
                assert.equal(messageBoxInstance.getContent()[0].getText(), "TextString", 'Content array with one entry returned, text matches given string')

                await new Promise((resolve) => {
                        setTimeout(async () => {
                                await new Promise((res) => InstanceManager.closeAllDialogs(res))
                                resolve(done())
                        }, 500)
                })
        });

        QUnit.test("Should display ui5 control", async function (assert) {
                const done = assert.async()

                this._sequencer.handleMessage(new Button({ text: "test" }))

                const messageBoxInstance = InstanceManager.getOpenDialogs().find((dialog) => dialog.getId() === this._stableMessageBoxId)

                assert.equal(messageBoxInstance.getContent()[0].isA("sap.m.Button"), true, 'Content array element equals to an sap.m.Button control')
                assert.equal(messageBoxInstance.getContent()[0].getText(), "test", 'Buttons text property equals the given value')

                await new Promise((resolve) => {
                        setTimeout(async () => {
                                await new Promise((res) => InstanceManager.closeAllDialogs(res))
                                resolve(done())
                        }, 500)
                })
        });
});