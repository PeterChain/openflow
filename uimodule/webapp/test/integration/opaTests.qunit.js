/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function() {
  "use strict";

  sap.ui.require([
    "pt/chain/OpenFlow/test/integration/AllJourneys"
  ], function() {
    QUnit.start();
  });
});
