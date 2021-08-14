//BUDGET CONTROLLER
var budgetController = (function () {

})();

//UI CONTROLLER
var UIController = (function () {
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }
        },
        getDOMstrings: function (){
            return DOMstrings;
        }
    } 
})();

//Global APP CONTROLLER
var controller = (function (budgetCtrl, UIctrl) {

    var setupEventListener = function () {
        document.querySelector(UIctrl.getDOMstrings().inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (ev) {
            //console.log(ev);
            if (ev.keyCode === 13 || ev.which === 13) {
                ctrlAddItem();
            }
        });
    };

    var ctrlAddItem = function () {
        // 1. Get the field input data
        console.log(UIctrl.getInput());
    }

})(budgetController, UIController)