sap.ui.define(function () {
	"use strict";

	return {
		name: "QUnit test suite for MessageBoxSequencer",
		defaults: {
			page: "ui5://test-resources/Demo/Test.qunit.html?testsuite={suite}&test={name}",
			qunit: {
				version: 2
			},
			sinon: {
				version: 4
			},
			ui5: {
				theme: "sap_horizon"
			},
			coverage: {
				only: "Demo/",
				never: "test-resources/Demo/"
			},
			loader: {
				paths: {
					"Demo": "../"
				}
			}
		},
		tests: {
			"unit/MessageBoxSequencer": {
				title: "MessageBoxSequencer — Unit Tests"
			}
		}
	};
});
