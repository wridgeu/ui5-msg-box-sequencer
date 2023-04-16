/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"Demo/test/unit/util/MessageBoxSequencerTest"
	], function () {
		QUnit.start();
	});
});
