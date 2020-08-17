sap.ui.define([
  "sap/ui/test/Opa5"
], function(Opa5) {
  "use strict";

  return Opa5.extend("pt.chain.OpenFlow.test.integration.arrangements.Startup", {

    iStartMyApp: function () {
      this.iStartMyUIComponent({
        componentConfig: {
          name: "pt.chain.OpenFlow",
          async: true,
          manifest: true
        }
      });
    }

  });
});
