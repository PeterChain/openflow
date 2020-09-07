sap.ui.define([
  "pt/chain/OpenFlow/controller/BaseController",
  "sap/ui/core/Fragment",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageBox",
  "sap/ui/model/resource/ResourceModel"
], function(Controller, Fragment, JSONModel, MessageBox, ResourceModel) {
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
    },

    /**
     * Display diagram for the case
     * @param {Object} oEvent Event handler
     */
    displayDiag: function(oEvent) {
      const oInput = this.getModel("entry");
      const oResourceBundle = this.getResourceBundle();
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

      if (!this.keyExists(sCaseCat, sCaseVersion)) {
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
    keyExists: function(sCaseCat, sCaseVersion) {
      const aCategories = this.getModel("categories").getData().categories;
      let bKeyExists = false;

      aCategories.forEach(function(entry, index) {
        if (entry.case === sCaseCat &&
            entry.version === sCaseVersion)
            bKeyExists = true;
            return;
      });

      return bKeyExists;
    },

    /**
     * Displays the dialog for selecting case category and version
     * @param {Object} oEvent Event object for Dialog
     */
    onCaseSelectDialogPress: function (oEvent) {
			var oButton = oEvent.getSource();

			if (!this._oDialog) {
				Fragment.load({
					name: "pt.chain.OpenFlow.view.CaseValueHelpDlg",
					controller: this
				}).then(function (oDialog){
					this._oDialog = oDialog;
					this._oDialog.setModel(this.getView().getModel("categories"));
					this._oDialog.open();
				}.bind(this));
			} else {
				this._oDialog.open();
      }
    },

    /**
     * Process the output of the Dialog model (confirm/cancel)
     * @param {Object} oEvent Event object for Dialog
     */
    onDialogClosed: function(oEvent) {
      const oSelectedItem = oEvent.getParameter("selectedItem");
      if (!oSelectedItem) return;
      
      const sEntry = oSelectedItem.getTitle().substr(0,4),
            sVersion = oSelectedItem.getTitle().substr(5,6);

      this.setModel(new JSONModel({
        caseCat: sEntry,
        caseVersion: sVersion
      }), "entry");
    }
  })
});
