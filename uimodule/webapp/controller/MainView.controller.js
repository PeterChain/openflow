sap.ui.define([
  "pt/chain/OpenFlow/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageBox",
  "sap/ui/model/resource/ResourceModel"
], function(Controller, JSONModel, MessageBox, ResourceModel) {
  "use strict";

  return Controller.extend("pt.chain.OpenFlow.controller.MainView", {

    /**
     * Init lifecycle function
     */
    onInit: function() {
      const oCategoriesModel = new JSONModel();
      oCategoriesModel.loadData("/sap/bc/openflow/categories");
      this.getView().setModel(oCategoriesModel, "categories");
      this.setModel(new JSONModel({ caseCat: "",
                                    caseVersion: "" }),
                    "entry");
      const i18nModel = new ResourceModel({
        bundleName: "pt.chain.OpenFlow.i18n.i18n"
      });
    },

    /**
     * Display diagram for the case
     * @param {Object} oEvent Event handler
     */
    displayDiag: function(oEvent) {
      const oInput = this.getModel("entry");
      const oResourceBundle = this.getResourceBundle();
      const sError = oResourceBundle.getText("error");
      const sCaseCat = oInput.getProperty("/caseCat");
      const sCaseVersion = oInput.getProperty("/caseVersion");

      if (sCaseCat === "") {
        MessageBox.error(oResourceBundle.getText("errorEmptyCat"));
        return;
      }

      if (sCaseVersion === "") {
        MessageBox.error(oResourceBundle.getText("errorEmptyVersion"));
        return;
      }

      if (!this.key_exists(sCaseCat, sCaseVersion)) {
        MessageBox.error(oResourceBundle.getText("errorNoCaseMatch"));
        return;
      }

      this.navTo("RouteFlowView", { caseCategory:sCaseCat,
                                    caseVersion:sCaseVersion });
    },

    /**
     * Checks if the combination of category/version exists in the JSON model
     * @param {String} sCaseCat Case category from UI
     * @param {String} sCaseVersion Case version from UI
     */
    key_exists: function(sCaseCat, sCaseVersion) {
      const aCategories = this.getModel("categories").getData().categories;
      let bKeyExists = false;

      aCategories.forEach(function(entry, index) {
        if (entry.case === sCaseCat &&
            entry.version === sCaseVersion)
            bKeyExists = true;
            return;
      });

      return bKeyExists;
    }
  });
});
