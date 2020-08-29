sap.ui.define([
	"sap/ui/core/util/MockServer",
	"sap/ui/model/json/JSONModel",
	"sap/base/util/UriParameters"
], function(MockServer, JSONModel, UriParameters) {
	"use strict";

	return {
		/**
		 * Initializes the mock server
		 */
		init: function() {
			// create
			var oMockServer = new MockServer({
				rootUri: "/sap/bc/openflow/",
				requests: [{
					method: "GET",
					path: "categories",
					response: function(xhr) {
						let oMockModel = new JSONModel();
						oMockModel.loadData("/localService/model/categories.json", {}, false);
                        xhr.respondJSON(200, {}, oMockModel.getJSON());
					}
                },
                {
					method: "GET",
					path: new RegExp("flow(.*)"),
					response: function(xhr, param) {
                        const oUriParam = jQuery.sap.getUriParameters(xhr.url);
                        const sCategory = oUriParam.get("category");
                        const sVersion = oUriParam.get("version");
						const sJsonFile = `flow-${sCategory}-${sVersion}.json`;

						let oMockModel = new JSONModel();
						oMockModel.loadData("/localService/model/" + sJsonFile, {}, false);
						xhr.respondJSON(200, {}, oMockModel.getJSON());
                    }
                }
            ]

			});

			// start
			oMockServer.start();
		}

	};

});