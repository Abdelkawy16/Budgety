//BUDGET CONTROLLER
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    return {
        addItem: function (type, description, value) {
            //new ID
            var newItem, id;
            if (data.allItems[type].length === 0) {
                id = 0;
            } else {
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            //create new item
            if (type === 'exp') {
                newItem = new Expense(id, description, value);
            } else if (type === 'inc') {
                newItem = new Income(id, description, value);
            }
            //push it into data structure
            data.allItems[type].push(newItem);
            data.totals[type] += value;
            //return the new element
            return newItem;
        },
        removeItem: function (ItemID) {
            var type = ItemID.slice(0, 3), ID = parseFloat(ItemID.slice(4)), index;
            var element = data.allItems[type].map(element => {
                 return element.id;
            });
            index = element.indexOf(ID);
            if (index !== -1) {
                var deletedElement = data.allItems[type].splice(index, 1);
                data.totals[type] -= deletedElement[0].value;
            }
        },
        // get and update data
        getBudget: function () {
            data.budget = data.totals.inc - data.totals.exp;
            if (data.totals.inc > 0) {
                data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
            } else {
                data.percentage = -1;
            }
            return {
                budget: data.budget,
                percentage: data.percentage,
                totalExp: data.totals.exp,
                totalInc: data.totals.inc
            };
        },
        testing: function(){
            return data;
        }
    };
})();

//UI CONTROLLER
var UIController = (function () {
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        budgetLabel: '.budget__value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    }
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },
        addListItem: function (obj, type) {
            // create HTML 
            var html, element, htmlObject;
            if (type === 'exp') {
                element = DOMstrings.expenseContainer;
                htmlObject = document.createElement('div');
                htmlObject.className = "item clearfix";
                htmlObject.setAttribute('id', `exp-${obj.id}`)
                html = `<div class="item__description">${obj.description}</div>
                    <div class="right clearfix">
                        <div class="item__value">- ${obj.value}</div>
                        <div class="item__percentage">21%</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>`;
            } else if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                htmlObject = document.createElement('div');
                htmlObject.className = "item clearfix";
                htmlObject.setAttribute('id', `inc-${obj.id}`)
                html = `<div class="item__description">${obj.description}</div>
                    <div class="right clearfix">
                        <div class="item__value">+ ${obj.value}</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>`;
            }
            // insert the HTML to the DOM
            htmlObject.innerHTML = html;
            document.querySelector(element).insertAdjacentElement('beforeend', htmlObject);
        },
        removeListItem: function(id){
            document.getElementById(id).remove();
        },
        clearFields: function () {
            var fields;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            var fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(element => {
                element.value = '';
            });
            fieldsArr[0].focus();
        },
        getDOMstrings: function () {
            return DOMstrings;
        },
        displayBudget: function (budget) {
            document.querySelector(DOMstrings.incomeLabel).textContent = `+ ${(budget.totalInc).toFixed(2)}`;
            document.querySelector(DOMstrings.expenseLabel).textContent = `- ${(budget.totalExp).toFixed(2)}`;
            document.querySelector(DOMstrings.budgetLabel).textContent = `${(budget.budget).toFixed(2)}`;
            if (budget.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = `${budget.percentage}%`;
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = `---`;
            }
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
        document.querySelector(UIctrl.getDOMstrings().container).addEventListener('click', ctrlRemoveItem);
    };

    //update Budget
    var updateBudget = function () {
        var budget = budgetCtrl.getBudget();
        // display Budget
        UIctrl.displayBudget(budget);
    };

    var ctrlAddItem = function () {
        var input, newItem;
        // 1. Get the field input data
        input = UIctrl.getInput();
        if (input.description && input.value) {
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // 3. Add the item to the UI
            UIctrl.addListItem(newItem, input.type);
            // 4. Clear the fields
            UIctrl.clearFields();
            updateBudget();
        } else {
            alert('Please enter description and its value!');
        }
    };

    var ctrlRemoveItem = function (event) {
        var itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        budgetCtrl.removeItem(itemID);
        UIctrl.removeListItem(itemID);
        updateBudget();
    };
    return {
        init: function () {
            console.log('Application has started.');
            UIctrl.displayBudget({
                totalInc: 0,
                totalExp: 0,
                budget: 0,
                percentage: 0
            });
            setupEventListener();
        }
    };

})(budgetController, UIController);

controller.init();