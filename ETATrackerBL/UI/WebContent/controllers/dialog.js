sap.ui.define(["sap/ui/base/Object"],
	function(Object){
		"use strict";
		return Object.extend("sap.dev.user.controllers.dialog", {
			_getDialogUpload:		function(caller){
				if(!this._oDialog){
					this._oDialog = sap.ui.xmlfragment("sap.dev.user.views.Upload", caller);
					// this.getView().addDependent(this._oDialog);
				}
				return this._oDialog;
			},
		
			open:			function(oView, caller){
				var oDialog = this._getDialogUpload(caller);
				
				// forward compact/cozy style into Dialog
				jQuery.sap.syncStyleClass(oView.getController().getOwnerComponent().getContentDensityClass(), oView, oDialog);				
				
				oView.addDependent(oDialog);
				oDialog.open();
			},
		
			close:			function(){
				this._getDialogUpload().close();
			}
		});
});