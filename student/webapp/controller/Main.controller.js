sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    Controller,
    JSONModel,
    Fragment,
    Filter,
    FilterOperator,
    MessageToast
  ) {
    "use strict";

    return Controller.extend("screen.student.controller.Main", {
      _aStudent: [
        { StudentCode: "1453", StudentName: "Harun" },
        { StudentCode: "1923", StudentName: "Mustafa Kemal" },
        { StudentCode: "2022", StudentName: "Calkan Can" },
      ],
      _aClass: [
        { ClassCode: "0001", ClassName: "Math" },
        { ClassCode: "0002", ClassName: "Finance" },
        { ClassCode: "0003", ClassName: "History" },
        { ClassCode: "0004", ClassName: "Literature" },
      ],

      onInit: function () {
        var oMainModel = this.getOwnerComponent().getModel("main");
        oMainModel.setProperty("/Student", this._aStudent);
        var oClassMainModel = this.getOwnerComponent().getModel("class");
        oClassMainModel.setProperty("/Class", this._aClass);
      },
      onValueHelpRequest: function (oEvent) {
        var sInputValue = oEvent.getSource().getValue(),
          oView = this.getView();
        if (!this._pValueHelpDialog) {
          console.log(!this._pValueHelpDialog);
          this._pValueHelpDialog = Fragment.load({
            id: oView.getId(),
            name: "screen.student.fragments.ValueHelpDialog",
            controller: this,
          }).then(function (oDialog) {
            oView.addDependent(oDialog);
            return oDialog;
          });
        }
        var _this = this;
        this._pValueHelpDialog.then(function (oDialog) {
          oDialog
            .getBinding("items")
            .filter([
              new Filter(
                "StudentName",
                "StudentCode",
                FilterOperator.Contains,
                sInputValue
              ),
            ]);
          oDialog.setModel("main", _this.getView().getModel("main"));
          oDialog.setModel("i18n", _this.getView().getModel("i18n"));
          oDialog.open(sInputValue);
        });
      },

      onValueHelpSearch: function (oEvent) {
        var sValue = oEvent.getParameter("value");
        var oFilter = new Filter(
          "StudentName",
          FilterOperator.Contains,
          sValue
        );
        oEvent.getSource().getBinding("items").Filter([oFilter]);
      },
      onValueHelpClose: function (oEvent) {
        var oSelectedItem = oEvent.getParameter("selectedItem");
        oEvent.getSource().getBinding("items").filter([]);
        if (!oSelectedItem) {
          return;
        }
        var oMainModel = this.getView().getModel("main");
        oMainModel.setProperty("/StudentCode", oSelectedItem.getTitle());
      },
      handleSelectionChange: function (oEvent) {
        var changedItem = oEvent.getParameter("changedItem");
        var isSelected = oEvent.getParameter("selected");
        var state = "Selected";
        if (!isSelected) {
          state = "Deselected";
        }

        MessageToast.show(
          "Event 'selectionChange': " +
            state +
            " '" +
            changedItem.getText() +
            "'",
          {
            width: "auto",
          }
        );
      },
      handleSelectionFinish: function (oEvent) {
        var selectedItems = oEvent.getParameter("selectedItems");
			var messageText = "Event 'selectionFinished': [";

			for (var i = 0; i < selectedItems.length; i++) {
				messageText += "'" + selectedItems[i].getText() + "'";
				if (i != selectedItems.length - 1) {
					messageText += ",";
				}
			}

			messageText += "]";

			MessageToast.show(messageText, {
				width: "auto"
			});
      },
    });
  }
);
