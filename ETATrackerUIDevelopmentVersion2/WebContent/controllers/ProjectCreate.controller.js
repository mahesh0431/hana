sap.ui.define(["sap/ui/core/mvc/Controller"],
	function(Controller){
		"use strict";
		return Controller.extend("sap.dev.user.controllers.ProjectCreate",{ 
			
			onInit:function(){
				var oModel = new sap.ui.model.json.JSONModel();
				var data = {"PROJECTID":"",
							"DESCRIPTION":""}
				oModel.setData(data);
				this.getView().setModel(oModel, "projectDetails");
			},
			handleSaveProject:function(){
				jQuery.sap.require("sap.m.MessageToast");
//				var batchPush = [];
				var oBusyDialog = new sap.m.BusyDialog();
				
				var oModel = this.getView().getModel();
				
				var projectModel = this.getView().getModel("projectDetails");
				
//				var dataTab = [];
//				var batchPush = [];
				
				
				var data = projectModel.getData();
					
//				dataTab.push(data);
				
				
//				batchPush.push("/Project","POST", dataTab[0]);
				

//				oModel.addBatchChangeOperations(batchPush);
				
				oBusyDialog.open();
//				oModel.submitBatch( 
//					function(){
//						oBusyDialog.close();
//							sap.m.MessageToast.show("Saved Successfully");
//					},
//					function(){
//						oBusyDialog.close();
//						sap.m.MessageToast.show("Problem creating new data");
//					}
//				);
				
				oModel.create("/Project", data, 
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