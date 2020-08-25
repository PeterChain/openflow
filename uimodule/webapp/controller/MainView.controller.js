sap.ui.define([
  "pt/chain/OpenFlow/controller/BaseController"
], function(Controller) {
  "use strict";

  return Controller.extend("pt.chain.OpenFlow.controller.MainView", {

    displayDiag: function(oEvent) {
      this.navTo("RouteFlowView", {  caseCategory:"Z001", caseVersion:"001" })
    }
  });
});
