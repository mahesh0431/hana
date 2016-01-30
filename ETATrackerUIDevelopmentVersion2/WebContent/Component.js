sap.ui.define(["sap/ui/core/UIComponent",
               "sap/ui/model/resource/ResourceModel",
               "sap/ui/model/odata/ODataModel",
               "sap/dev/user/controllers/dialog"],
	function(UIComponent, ResourceModel, ODataModel, dialog){
		"use strict";
		return UIComponent.extend("sap.dev.user.Component",{
			metadata	:	{
				manifest	:	"json"
			},
			
			init		:	function(){
				UIComponent.prototype.init.apply(this, arguments);
				
				var i18nModel = new ResourceModel({
					bundleName	:	"sap.dev.user.i18n.i18n"
				})
				this.setModel(i18nModel, "i18n");
				var oConfig = this.getMetadata().getConfig();
				var oUserModel = new ODataModel(oConfig.user);
				oUserModel.setDefaultBindingMode("TwoWay");
				this.setModel(oUserModel);
				this.dialog = new dialog();
				
				this.getRouter().initialize();
			},
			
			getContentDensityClass
						:	function(){
				if(!this._sContentDensityClass){
					if(!sap.ui.Device.support.touch){
						this._sContentDensityClass = "sapUiSizeCompact";
					}else{
						this._sContentDensityClass = "sapUiSizeCozy";
					}
				}
				return this._sContentDensityClass;
			}
		});
});