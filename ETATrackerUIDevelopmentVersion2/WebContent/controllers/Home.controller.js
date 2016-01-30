sap.ui.define(["sap/ui/core/mvc/Controller",
               "sap/ui/model/Filter"],
	function(Controller,Filter){
		"use strict";
		return Controller.extend("sap.dev.user.controllers.Home",{ 
			
			onInit:function(){
				
			},

			handlePress:function(oEvent){
				var sRef = oEvent.getSource().data("ref");
				var sUri;
				switch(sRef) {
			    case 'uploadETA':
			        sUri = 'ETACreate';
			        break;
			    case 'dailyETA':
			    	sUri = 'DailyETA';
			        break;
				
				case 'registerProject':
					sUri = 'UserProjectRegister';
					break;
					
				case 'createProject':
					sUri = 'Project';
					break;
				}
				
				sap.ui.core.UIComponent.getRouterFor(this).navTo(sUri);
				
			}
	}); 
});