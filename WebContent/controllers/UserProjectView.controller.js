sap.ui.define(["sap/ui/core/mvc/Controller",
               "sap/ui/model/Filter"],
	function(Controller,Filter){
		"use strict";
		return Controller.extend("sap.dev.user.controllers.UserProjectView",{ 
			
			onInit:function(){
				
			},
			
			handleAddProject:function(oEvent){
				this.getOwnerComponent().dialog.open(this.getView(), this, "USERPROJECTREG");
			},
			
			onCloseDialog: function(oEvent){
				this.getOwnerComponent().dialog.close();
			},
			
			onSelectionChange : function (oEvt) {

				var oList = oEvt.getSource();
				var oLabel = sap.ui.getCore().byId("idFilterLabel");
				var oInfoToolbar = sap.ui.getCore().byId("idInfoToolbar");

				// With the 'getSelectedContexts' function you can access the context paths
				// of all list items that have been selected, regardless of any current
				// filter on the aggregation binding.
				var aContexts = oList.getSelectedContexts(true);

				// update UI
//				var bSelected = (aContexts && aContexts.length > 0);
//				var sText = (bSelected) ? aContexts.length + " selected" : null;
				var sText = "' " + aContexts[0].getProperty("PROJECTID") + " '" +"selected";
				oInfoToolbar.setVisible(true);
				oLabel.setText(sText);
			},
			
			onSearch : function (oEvt) {

				// add filter for search
				var aFilters = [];
				var sQuery = oEvt.getSource().getValue();
				if (sQuery && sQuery.length > 0) {
					var filter = new Filter("PROJECTID", sap.ui.model.FilterOperator.Contains, sQuery);
					aFilters.push(filter);
					
//					filter = new Filter("DESCRIPTION", sap.ui.model.FilterOperator.Contains, sQuery);
//					aFilters.push(filter);
				}

				// update list binding
				var list = sap.ui.getCore().byId("idList");
				var binding = list.getBinding("items");
				binding.filter(aFilters, "Application");
			},
			onAddProject: function(){
				var oList = sap.ui.getCore().byId("idList");
				var aContexts = oList.getSelectedContexts(true);
				var sProject = aContexts[0].getProperty("PROJECTID");
				
				if(sProject){
					
					jQuery.sap.require("sap.m.MessageToast");
					var oBusyDialog = new sap.m.BusyDialog();
					
					var oModel = this.getView().getModel();
									
					var data = {};
					data.PROJECTID = sProject;
					data.USERID = "";
					
					oBusyDialog.open();
					
					oModel.create("/UserProject", data, 
							{
						success : jQuery.proxy(function(mResponse) {
							oBusyDialog.close();
							this.onCloseDialog();
							sap.m.MessageToast.show("Saved Successfully");
						}, this),
						error : jQuery.proxy(function(mResponse) {
							oBusyDialog.close();						
							sap.m.MessageToast.show("Problem creating new data");
						}, 
						this) }
								);
					
				};
				
				
			}
			});
		});