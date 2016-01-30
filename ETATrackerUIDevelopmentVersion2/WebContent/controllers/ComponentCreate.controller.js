sap.ui.define(["sap/ui/core/mvc/Controller"],
	function(Controller){
		"use strict";
		return Controller.extend("sap.dev.user.controllers.ComponentCreate",{ 
			
			onInit:function(){
			
				sap.ui.core.UIComponent.getRouterFor(this).getRoute("ComponentCreate").attachPatternMatched(this._patternMatched, this);
			},
			
			_elementContext: null,
			
			_patternMatched:function(oEvent){				
				var oModel = new sap.ui.model.json.JSONModel();
				var data = {"PROJECTID"	 : oEvent.getParameter("arguments").projectId,
							"COMPONENTID":"",
							"DESCRIPTION":""};
				oModel.setData(data);
				this.getView().setModel(oModel, "componentDetails");
			},
			
			handleSaveComponent:function(){
				jQuery.sap.require("sap.m.MessageToast");
//				var batchPush = [];
				var oBusyDialog = new sap.m.BusyDialog();
				
				var oModel = this.getView().getModel();
				
				var projectModel = this.getView().getModel("componentDetails");
			
				
				var data = projectModel.getData();
				
				oBusyDialog.open();
				
				oModel.create("/Component", data, 
						{
					success : jQuery.proxy(function(mResponse) {
						oBusyDialog.close();
						sap.m.MessageToast.show("Saved Successfully");
					}, this),
					error : jQuery.proxy(function(mResponse) {
						oBusyDialog.close();						
						sap.m.MessageToast.show("Problem creating new data");
					}, 
					this) }
							);
				
			}
			
	});
});