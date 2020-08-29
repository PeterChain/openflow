/* global mermaid:true */

sap.ui.define([
  "pt/chain/OpenFlow/controller/BaseController",
  "pt/chain/OpenFlow/model/FlowDesigner",
  "pt/chain/OpenFlow/libs/mermaid",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageBox",
], function(Controller, FlowDesigner, mermaidjs, JSONModel, MessageBox) {
  "use strict";

  return Controller.extend("pt.chain.OpenFlow.controller.FlowView", {
    /**
     * OnInit lifecycle event
     */
    onInit: function() {
      this.getRouter().getRoute("RouteFlowView").attachMatched(this._onRouteMatched, this);
    },

    /**
     * Callback router pattern function for filling view container
     * @param {Object} oEvent
     */
    _onRouteMatched: function(oEvent) {
      const oParam = oEvent.getParameter("arguments");
      const oResourceBundle = this.getResourceBundle();
      const oModel = new JSONModel({ category: oParam.caseCategory,
                                     version: oParam.caseVersion });
      oModel.refresh(); //Force UI update

      this.getView().setModel(oModel);

      let oFlowModel = new JSONModel();
      oFlowModel.loadData("/sap/bc/openflow/flow", {category: oParam.caseCategory,
                                                    version: oParam.caseVersion});
      this.setModel(oFlowModel, "flow");
      oFlowModel.attachRequestCompleted(function() {
        const oResponse = oFlowModel.getData();

        // No flow? then we go back
        if (oResponse.notFound) {
          MessageBox.alert(oResourceBundle.get("noFlowAlert"));
          this.onNavBack();
        }

        FlowDesigner.buildFlowchart(oResponse.steps, oResponse.sequence);
      });
    },
  });
});
