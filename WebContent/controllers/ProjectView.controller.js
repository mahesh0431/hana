sap.ui.define(["sap/ui/core/mvc/Controller"],
	function(Controller){
		"use strict";
		return Controller.extend("sap.dev.user.controllers.ProjectView",{ 
			
			onInit:function(){
				
			},
			
			onListItemPressed:function(oEvent){
				sap.ui.core.UIComponent.getRouterFor(this).navTo("ComponentView",{
					projectId: oEvent.getSource().getBindingContext().getProperty("PROJECTID"),
				});
			},
			handleCreateProject:function(oEvent){
				sap.ui.core.UIComponent.getRouterFor(this).navTo("ProjectCreate");
			}
			
			});
		});