/* global mermaid:true */

sap.ui.define([
  "pt/chain/OpenFlow/controller/BaseController",
  "pt/chain/OpenFlow/model/FlowDesigner",
  "pt/chain/OpenFlow/libs/mermaid",
  "sap/ui/model/json/JSONModel"
], function(Controller, FlowDesigner, mermaidjs, JSONModel) {
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
      const oModel = new JSONModel({ category: oParam.caseCategory,
                                     version: oParam.caseVersion });
      oModel.refresh(); //Force UI update

      this.getView().setModel(oModel, "case");

      let oFlowModel = new JSONModel();
      oFlowModel.loadData("model/flow.json");
      oFlowModel.attachRequestCompleted(function() {
        const oResponse = oFlowModel.getData();
        FlowDesigner.buildFlowchart(oResponse.steps, oResponse.sequence);
      });
    },
  });
});
