sap.ui.define(["sap/ui/core/mvc/Controller"],
	function(Controller){
		"use strict";
		return Controller.extend("sap.dev.user.controllers.ComponentView",{ 
			
			onInit:function(){
				sap.ui.core.UIComponent.getRouterFor(this).getRoute("ComponentView").attachPatternMatched(this._patternMatched, this);
			},
			
			_elementContext: null,
			
			_patternMatched:function(oEvent){
				this._elementContext = "/Project('" + oEvent.getParameter("arguments").projectId + "')";
				this.getView().bindElement({
					path: this._elementContext
				});
			},
			handleAddComponents:function(oEvent){
				sap.ui.core.UIComponent.getRouterFor(this).navTo("ComponentCreate");
			}
	});
});