sap.ui.define(["sap/ui/core/mvc/Controller",
               "sap/dev/user/papa/papaparse",
               'sap/m/MessageBox'],
	function(Controller, papaparse, MessageBox){
		"use strict";
		return Controller.extend("sap.dev.user.controllers.DailyETA",{
				onInit:function(){
					this.dateformat = sap.ui.core.format.DateFormat.getDateInstance({pattern:"yyyyMMdd", style:"medium"});
					this.getView().byId("date12").setValue("now");
					
//					this.bindDate(this.getView().byId("date12").getDateValue());
					
					sap.ui.core.UIComponent.getRouterFor(this).getRoute("DailyETA").attachPatternMatched(this._patternMatched, this);
				},
				_patternMatched:function(oEvent){ 
					this.getView().getModel().refresh();
					
				},
				//Project related changes
				_dataReceived:function(oEvent){
					var data = oEvent.getParameter("data");
					if(data){
						var sSelected = this.getView().byId("selectProjectID").getSelectedItem();
						
						var sProj
						
						if(!sSelected){
							sProj = data.results[0].PROJECTID;
						}else{
							sProj = sSelected.getKey();
						};
						
						this.bindDate(this.getView().byId("date12").getDateValue(), sProj);
					}
				},
				handleAddProject:function(oEvent){
					sap.ui.core.UIComponent.getRouterFor(this).navTo("UserProjectRegister");
				},
				handleProjectChange:function(oEvent){
//					var sProject = oEvent.getParameter("selectedItem").getKey();
					if(!this.getView().byId("selectProjectID").getSelectedItem()){
						var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
						MessageBox.error(
								"Please register for a project before accessing the ETA",
								{
									styleClass: bCompact? "sapUiSizeCompact" : ""
								}
							);
						return;
					}
					var sProject = this.getView().byId("selectProjectID").getSelectedItem().getKey();
					if(sProject){
						
						this.bindDate(this.getView().byId("date12").getDateValue(), sProject);
					}
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
				onDateChange:function(oEvent){
//					this.bindDate(oEvent.getParameter("dateValue"));
					this.handleProjectChange();
				},
				bindDate:function(oEvent, oProjectID){
					if (!oProjectID){
						var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
						MessageBox.error(
								"Please register for a project before accessing the ETA",
								{
									styleClass: bCompact? "sapUiSizeCompact" : ""
								}
							);
						return;
					}
					this.getView().byId("tMultiCreate12").setBusy(true);
					var sDate;
					var now;
					var oFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern:"MM/dd/yyyy", style:"medium"});
					var date = new Date();
					if(oEvent.getDate() == date.getDate() && oEvent.getYear() == date.getYear() 
							&& oEvent.getMonth() == date.getMonth()){
						now = "X";
					}else{
						now = "";
					}
					sDate = this.dateformat.format(oEvent);
					
					this._contextPath = "/ETADataParameters(ETADATE='"+sDate+"',NOW='"+now+"',PROJECTID='"+oProjectID+"')";
					this.getView().bindElement(this._contextPath);
				},
				
				_contextPath: null,
				
				onTableLoaded:function(oEvent){
					this.getView().byId("tMultiCreate12").setBusy(false);
				},
				onListItemPressed:function(oEvent){
					//oEvent.getSource().getBindingContext().getProperty("INCIDENT")
					sap.ui.core.UIComponent.getRouterFor(this).navTo("incidentView",{
						incidentno: oEvent.getSource().getBindingContext().getProperty("INCIDENTNO"),
						historyno: oEvent.getSource().getBindingContext().getProperty("HISTORYNO")
					});
				},
				handlePostETA:function(oEvent){
					
					var items = this.getView().byId("tMultiCreate12").getItems();
					this._postETA(items);
				},
				_postETA:function(items){
					
					jQuery.sap.require("sap.m.MessageToast");
					var batchPush = [];
					var oBusyDialog = new sap.m.BusyDialog();
					
					var oModel = this.getView().getModel();
					
					var dataTab = [];
					var batchPush = [];
					
					for(var i=0; i<items.length; i++){
						var data = {upd:{}};
						var path = items[i].getBindingContext().getPath();
						data.path = path;
						data.upd.INCIDENTNO = items[i].getModel().getProperty(path+"/INCIDENTNO");
						data.upd.HISTORYNO = items[i].getModel().getProperty(path+"/HISTORYNO");
						data.upd.ETADAY = "X";
						dataTab.push(data);
					};
					
					for( var i=0; i<dataTab.length; i++){
						batchPush.push(oModel.createBatchOperation(dataTab[i].path,"PUT", dataTab[i].upd));
					}

					oModel.addBatchChangeOperations(batchPush);
					
					oBusyDialog.open();
					oModel.submitBatch( 
						function(){
							oBusyDialog.close();
								sap.m.MessageToast.show("Saved Successfully");
						},
						function(){
							sap.m.MessageToast.show("Problem creating new data");
						}
					);
				},
//				onDataExport : sap.m.Table.prototype.exportData || function(oEvent) {
				onDataExport : function(oEvent) {
//					var oExport = new Export({
//
//						// Type that will be used to generate the content. Own ExportType's can be created to support other formats
//						exportType : new ExportTypeCSV({
//							separatorChar : ","
//						}),
//
//						// Pass in the model created above
//						models : this.getView().getModel(),
//
//						// binding information for the rows aggregation
//						rows : {
//							path : this._contextPath + "/Results"
//						},
//
//						// column definitions with column name and binding info for the content
//
//						columns : [{
//							name : "Component",
//							template : {
//								content : "{COMPONENT}"
//							}
//						}, {
//							name : "Processor",
//							template : {
//								content : "{PROCESSOR}"
//							}
//						}, {
//							name : "Priority",
//							template : {
//								content : "{PRIORITY}"
//							}
//						}, {
//							name : "Creation Date",
//							template : {
//								content : "{CREATIONDATE}"
//							}
//						}, {
//							name : "Status",
//							template : {
//								content : "{STATUS}"
//							}
//						}, {
//							name : "Description",
//							template : {
//								content : "{DESCRIPTION}"
//							}
//						}, {
//							name : "Incident Number",
//							template : {
//								content : "{INCIDENT}"
//							}
//						}, {
//							name : "Incident Year",
//							template : {
//								content : "{YEAR}"
//							}
//						},{
//							name : "System ID",
//							template : {
//								content : "{SYSTEMID}"
//							}
//						},{
//							name : "Note",
//							template : {
//								content : "{NOTE}"
//							}
//						},{
//							name : "ETA",
//							template : {
//								content : "{ETA}"
//							}
//						},{
//							name : "Comment",
//							template : {
//								content : "{ADMINCOMMENT}"
//							}
//						},{
//							name : "User Comments",
//							template : {
//								content : "{USERCOMMENT}"
//							}
//						}]
//					});
//
//					// download exported file
//					oExport.saveFile().always(function() {
//						this.destroy();
//					});
					var aUrl = "https://s9hanaxs.hanatrial.ondemand.com/c5208507trial/hanainstance/ETATracker/ETATrackerBL/services/eta.xsodata";
					var aUri = this._contextPath + "/Results";
					 
					 
					var oJSON;
					jQuery.ajax({
					  url: aUrl + aUri,
					  method: 'GET',
					  async: false,
					  dataType: 'json',
					  success: function(data) {
//					      alert('Successful in json call ');
//					      oJSON = JSON.parse(response.body);
//					      jQuery.sap.require("sap.dev.user.papa.csvGenerator");
					      jQuery.sap.require("sap.dev.user.papa.csvGen2");
					      
					      
					      var etaCreationDate;
					      var dateIntParse;
					      var creationDate;
					      
					      
					      var dateConv = function(c){
					    	
					    	var a = c.substring(6, c.length-2);
						    var b = parseInt(a);
						    return new Date(b);
					      }
					      
					      var eta = $.map(data.d.results, function(value, index) { return [value];});

					      var bEta;
					      var tab = [];
					      
					      tab.push(["Component","Processor","Priority","Creation Date","Status","Short Text","Incident Number",
					                "Incident Year","System ID","Note","ETA","Comment","****User Comments****"]);
					      
					      for(var i = 0; i<eta.length; i++){
					    	 bEta = null;
					    	 
						     var bEtaDate;
						     bEtaDate = null;
						     
					    	 creationDate = dateConv(eta[i].CREATIONDATE);
					    	 
					    	 if (eta[i].TBD){
					    		 bEta = "TBD";
					     	 }else{
					     		 if (eta[i].ETA){
					     			 bEtaDate = dateConv(eta[i].ETA);
					     			 bEta = bEtaDate.toLocaleDateString();
					     		 }
					     	 }
					    	
					    	 var array = [ eta[i].COMPONENT, eta[i].PROCESSOR, eta[i].PRIORITY, creationDate.toLocaleDateString(), 
					    			  eta[i].STATUS, eta[i].DESCRIPTION, eta[i].INCIDENT, eta[i].YEAR, eta[i].SYSTEMID, eta[i].NOTE, 
					    			  bEta, eta[i].ADMINCOMMENT, eta[i].USERCOMMENT ];
					    	 
					    	 tab.push(array);
					      };

					      JSONToCSVConvertor(tab, "Daily ETA", false);
					      
					  },
					  error: function() {alert('Error in json call ');}
					});
				}
			});
});