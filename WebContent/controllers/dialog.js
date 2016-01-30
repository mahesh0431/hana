sap.ui.define([ "sap/ui/base/Object" ], function(Object) {
	"use strict";
	return Object.extend("sap.dev.user.controllers.dialog", {

		_tDialog : [],

		_getDialogUpload : function(caller, sName) {
			this._oDialog = this._tDialog[sName];
			if (this._oDialog) {
				return this._oDialog;
			};

			if (sName == "UPLOAD") {
				this._tDialog[sName] = this._oDialog = sap.ui.xmlfragment("sap.dev.user.views.Upload", caller);
			}else if(sName == "USERPROJECTREG"){
				this._tDialog[sName] = this._oDialog = sap.ui.xmlfragment("sap.dev.user.views.UserProjectAdd", caller);
			};
			
			return this._oDialog;
		},

		open : function(oView, caller, sName) {
			var oDialog = this._getDialogUpload(caller, sName);

			// forward compact/cozy style into Dialog
			jQuery.sap.syncStyleClass(oView.getController().getOwnerComponent()
					.getContentDensityClass(), oView, oDialog);

			oView.addDependent(oDialog);
			oDialog.open();
		},

		close : function() {
			this._oDialog.close();
		}
	});
});