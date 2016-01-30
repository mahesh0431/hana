sap.ui.define(["sap/ui/core/mvc/Controller",
               "sap/ui/core/routing/History"],
	function(Controller,History){
		"use strict";
		return Controller.extend("sap.dev.user.controllers.IncidentView",{
			_elementContext: null,
			
			_formFragments:[],
			
//			formatCheckBox:function(oEvent){
//				if (oEvent == 'X'){
//					return true;
//				}else{
//					return false;
//				}
//			},
			
			onTBD:function(oEvent){
				if (oEvent.getParameter("selected") == false){
					this.getView().getModel().setProperty(this._elementContext+"/TBD", "");
				}else{
					this.getView().getModel().setProperty(this._elementContext+"/TBD", "X")
				};
			},
			
			formatDate:function(oEvent){
				if (!oEvent){
					return;
				}
				if( oEvent.getDate() < 1 || oEvent.getMonth() < 1 || oEvent.getYear() < 1){
					return null;
				}else{
					return oEvent.toLocaleDateString();
				}
			},
			onInit:function(){
				
				var eventBus = sap.ui.getCore().getEventBus();
				eventBus.subscribe("channel1", "setVisibility", this.handleEditPress, this);	
				
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({
					isedit:false,
					ETAVisibility:true,
					editVisibility:true
				});
				this.getView().setModel(oModel,"edit");
				sap.ui.core.UIComponent.getRouterFor(this).getRoute("incidentView").attachPatternMatched(this._patternMatched, this);
				
				this.getView().byId("IncidentsDispChange").insertContent(this._createFragment("fragIncidentDisplay"));
			},
			_patternMatched:function(oEvent){
				this._elementContext = "/ETADataSingle(INCIDENTNO='" + oEvent.getParameter("arguments").incidentno +
				"',HISTORYNO=" + oEvent.getParameter("arguments").historyno + ")";
				this.getView().bindElement({
					path: this._elementContext	
				});
			},
			handleEditPress:function(oEvent){
				if( this.getView().getModel("edit").getData().isedit == false){
					this.getView().getModel("edit").getData().isedit = true;
					this.getView().getModel("edit").getData().editVisibility = false;
					
					this.getView().byId("IncidentsDispChange").removeAllContent();
					this.getView().byId("IncidentsDispChange").insertContent(this._createFragment("fragIncidentChange"));
				}else{
					this.getView().getModel("edit").getData().isedit = false;
					this.getView().getModel("edit").getData().editVisibility = true;
					
					this.getView().byId("IncidentsDispChange").removeAllContent();
					this.getView().byId("IncidentsDispChange").insertContent(this._createFragment("fragIncidentDisplay"));
				}
				this.getView().getModel("edit").refresh();
			},
			
			_createFragment: function(sFragmentName){
				var oFormFragment = this._formFragments[sFragmentName];
				if (oFormFragment) {
					return oFormFragment;
				};
				
				oFormFragment = sap.ui.xmlfragment("sap.dev.user.views." + sFragmentName, this);
				this.getView().addDependent(oFormFragment);
				return this._formFragments[sFragmentName] = oFormFragment;
				
//				this.getView().byId("IncidentsDispChange").insertContent(
//						sap.ui.xmlfragment(this.getView().getId(), "sap.dev.user.views." + "fragIncidentChange")	
//				);
			},
			
			onDateChange:function(oEvent){
//				this.getView().getModel().setProperty(this.getView().getElementBinding().sPath+"/ETA",this.getView().byId("DataTimeInput1").getDateValue());
			},
			onBack:function(oEvent){
				var oHistory, sPreviousHash;

				oHistory = History.getInstance();
				sPreviousHash = oHistory.getPreviousHash();

				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					sap.ui.core.UIComponent.getRouterFor(this).navTo("DailyETA", {}, true /*no history*/);
				}
			},
			handleOpenIncident:function(oEvent){
				var vIncidentNo = this.getView().getModel().getProperty(this._elementContext+"/INCIDENTNO");
				window.open("https://support.wdf.sap.corp/sap/support/message/"+vIncidentNo+"/x");
			},
			handleSavePress:function(oEvent){
				jQuery.sap.require("sap.m.MessageToast");
				if(this.getView().getModel().hasPendingChanges() == true){
//					this.getView().getModel().submitChanges( 
//					function(oEvent){
//						sap.m.MessageToast.show("Data Saved Successfully");
//					},
//					function(oEvent){
//						sap.m.MessageToast.show("Data is not saved, Please contact Administator");
//					});
					
					var data = {};					
					var oModel = this.getView().getModel();
					
					data.INCIDENTNO = oModel.getProperty(this._elementContext+"/INCIDENTNO");
					data.HISTORYNO = oModel.getProperty(this._elementContext+"/HISTORYNO");
					data.STATUS = oModel.getProperty(this._elementContext+"/STATUS");
					
					if (oModel.getProperty(this._elementContext+"/ETA")){
						var vETA = oModel.getProperty(this._elementContext+"/ETA");
						if( vETA.getDate() < 1 || vETA.getMonth() < 1 || vETA.getYear() < 1){
						
						}else{
							data.ETA = vETA;
						};
					};
					
					if (oModel.getProperty(this._elementContext+"/USERCOMMENT")){
						data.USERCOMMENT = oModel.getProperty(this._elementContext+"/USERCOMMENT");
					};
					
					if (oModel.getProperty(this._elementContext+"/ADMINCOMMENT")){
						data.ADMINCOMMENT = oModel.getProperty(this._elementContext+"/ADMINCOMMENT");
					};
					
					if (oModel.getProperty(this._elementContext+"/TBD")){
						data.TBD = oModel.getProperty(this._elementContext+"/TBD");
					};
					
					if (oModel.getProperty(this._elementContext+"/ETACREATIONDATE")){
						data.ETACREATIONDATE = oModel.getProperty(this._elementContext+"/ETACREATIONDATE");
					};
					
					oModel.create("/ETAUpdate", data, 
							{
						success : jQuery.proxy(function(mResponse) {
							var eventBus = sap.ui.getCore().getEventBus();
							eventBus.publish("channel1", "setVisibility");
							sap.m.MessageToast.show("Saved Successfully");
						}, this),
						error : jQuery.proxy(function(mResponse) {
							sap.m.MessageToast.show("Problem creating new data");
						}, 
						this) }
								);
					
//					oModel.create('/ETA', data.ETAData,
//					{
//						success : jQuery.proxy(function(mResponse) {
//							sap.m.MessageToast.show("Saved Successfully");
//						}, this),
//						error : jQuery.proxy(function(mResponse) {
//							sap.m.MessageToast.show("Problem creating new data");
//						}, 
//						this) });
					
				}else{
					sap.m.MessageToast.show("Please provide the ETA information to Save the Data");
				}
			}
		});
});