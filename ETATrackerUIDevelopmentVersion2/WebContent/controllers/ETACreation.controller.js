sap.ui.define(["sap/ui/core/mvc/Controller",
               "sap/dev/user/papa/papaparse"],
	function(Controller){
		"use strict";
		return Controller.extend("sap.dev.user.controllers.ETACreation",
			{
			
			oBusyDialog: null,
			
			onInit:	function(){
				var eventBus = sap.ui.getCore().getEventBus();
				
				eventBus.subscribe("channel1", "event1", this.handleEvent1, this);	
				
			},
			
			handleEvent1 : function(channel, event, data) {
				if(data.customData){
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({
					"ETAData": data.customData
				});
				this.getView().setModel(oModel, "jsonModel");
				this.getView().byId("tMultiCreate").getBinding("items").refresh();
				sap.ui.getCore().byId("fileUploader").clear();
				this.getOwnerComponent().dialog.close();
				this.getView().byId('CANCELETA').setVisible(true);
				this.getView().byId('SAVEETA').setVisible(true);
				this.getView().byId('LOADETA').setVisible(false);
				}
			},
			
			handleUploadComplete: function(oEvent){
				
			},
			
			OnAddItem: function(){
//				this.getView().getModel("jsonModel").getData().userDetails.push({
//					"id":"TestId",
//					"firstName":"",
//					"lastName":"",
//					"emailId":""
//					});
//				this.getView().byId("tMultiCreate").getBinding("items").refresh();
			},
			
			handleUploadPress: function(oEvent) {
				
			},
			
			onLoad: function(oEvent){
				this.getOwnerComponent().dialog.open(this.getView(), this, "UPLOAD");
			},
			onCloseDialog: function(oEvent){
				var oFileUploader = sap.ui.getCore().byId("fileUploader");
//				oFileUploader.upload();
				this.getOwnerComponent().dialog.close();
			},
			
			onChangeFUP:function(e){
				this._import(e.getParameter("files") && e.getParameter("files")[0]);
			},
			
			_import : function(file) {  
				  if(file && window.FileReader){  
				  var reader = new FileReader();  
				  reader.onload = this.onload;
				 reader.readAsText(file);  
				}
			},
			onload: function(e){
				 var strCSV= e.target.result; //string in CSV 
				 var data = Papa.parse(strCSV);
				 var array = data.data;
				 array.splice(0,1);
				 array.splice(array.length-1,1)
				 var jsonOSS = [];
				 for(var i=0; i<array.length; i++){
					 var line = array[i];
					 var jsonLine = {};
					 jsonLine.INCIDENT = "";
					 for(var j=0; j<line.length; j++){
						 switch(j){
						 	case 6:
						 		jsonLine.INCIDENT = line[j];
						 		break;
						 	case 7:
						 		jsonLine.YEAR = line[j];
						 		break;
						 	case 5:
								jsonLine.DESCRIPTION = line[j];
						 		break;
							case 0:
								jsonLine.COMPONENT = line[j];
						 		break;
							case 1:
								jsonLine.PROCESSOR = line[j];
						 		break;
							case 2:
								jsonLine.PRIORITY = line[j];
						 		break;
							case 4:
								jsonLine.STATUS = line[j];
						 		break;
							case 3:
								jsonLine.CREATIONDATE = line[j];
						 		break;
							case 9:
								jsonLine.MPTPLANNEDDATE = line[j];
						 		break;
							case 10:
								jsonLine.INCIDENTNO = line[j].replace(/ /g,'');
						 		break;
							case 8:
								jsonLine.SYSTEMID = line[j];
						 		break;
						 };
					 };
//					 jsonOSS.push(jsonLine);
					 jsonOSS[i] = jsonLine;
				 };
				 var eventBus = sap.ui.getCore().getEventBus();

				 eventBus.publish("channel1", "event1", 
				     {
				         customData: jsonOSS
				     });
			},
			
			onSave:function(){
				jQuery.sap.require("sap.m.MessageToast");
				var batchPush = [];
				var oBusyDialog = new sap.m.BusyDialog();
				
				var oModel = new sap.ui.model.odata.ODataModel("https://s9hanaxs.hanatrial.ondemand.com/c5208507trial/hanainstance/ETATracker/ETATrackerBL/services/eta.xsodata");
				var jsonModel = this.getView().getModel("jsonModel");
				var data = jsonModel.getData();
				if ( !data.ETAData[0] )
				{
					sap.m.MessageToast.show("Please Load Data First");
					return;
				}
				for( var i=0; i<data.ETAData.length; i++){
//					data.ETAData[i].HISTORYNO = 0;
//					data.ETAData[i].ETADATE = "Dummy";
					batchPush.push(oModel.createBatchOperation("/ETA","POST", data.ETAData[i]));
				}

				oModel.addBatchChangeOperations(batchPush);
				
				oBusyDialog.open();
				oModel.submitBatch( 
					function(){
						oBusyDialog.close();
							sap.m.MessageToast.show("Saved Successfully");
							this.getView().byId('CANCELETA').setVisible(false);
							this.getView().byId('SAVEETA').setVisible(true);
					},
					function(){
						oBusyDialog.close();
						sap.m.MessageToast.show("Problem creating new data");
						this.getView().byId('CANCELETA').setVisible(true);
						this.getView().byId('SAVEETA').setVisible(false);
					}
				);
				
				
//				oModel.create('/ETA', data.ETAData,
//						{
//							success : jQuery.proxy(function(mResponse) {
//								sap.m.MessageToast.show("Saved Successfully");
//							}, this),
//							error : jQuery.proxy(function(mResponse) {
//								sap.m.MessageToast.show("Problem creating new data");
//							}, 
//							this) });
				
			}
		})
	});