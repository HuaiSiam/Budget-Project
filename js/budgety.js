var items, users, tables, bottom_id, user, DOMstrings, data;

tables = [];
items = [];

users = [
    {
        id: 1,
        name: 'Kevin'
    },
    {
        id: 2,
        name: 'Louis'
    }
];

user = {
    user_budget: 0,
    user_total_inc: 0,
    user_total_exp: 0
};

DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLable: '.budget__expenses--value',
    percentageLable: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title',
    incomeBudget: '.budget__income',
    expenseBudget: '.budget__expenses',
    tableContainer: '.table__row',
    fromDate: '.from__date',
    toDate: '.to__date',
    userTable: '.user_table',
    bottom: '.bottom',
    btn__back: '.btn__back',
    navBar: '.navbar',
    image: '.top' 
};

data = {
    totals: {
        exp: 0,
        inc: 0
    },
    budget: 0               
};

function Item (id, date, type, description, value, user_id) {
    this.id = id;
    this.date = date;
    this.type = type;
    this.description = description;
    this.value = value,
    this.user_id = user_id
}

// Add New Data
function addNewItem (type, description, value) {
    var ID, newItem, ids, date;
    
    if (items.length > 0) {
        ID = items[items.length - 1].id + 1;
    } else {
        ID = 0;
    }

    bottom_id = document.querySelector(DOMstrings.bottom).id;

    ids = users.find(el => el.id == bottom_id);

    date = formatDate();

    newItem = new Item(ID, date, type, description, value, ids.id);

    items.push(newItem);

    saveData();
}

// Get input value
function getInput () {
    return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value) 
    }
}

function formatNumber(num, type) {
    var numSplit, int, dec;
   
    num = Math.abs(num);
    num = num.toFixed(2);
    
    numSplit = num.split('.');

    int = numSplit[0];
    if (int.length > 3) {
        int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    }
    dec = numSplit[1];

    return (type === 'exp' ? '-' : '+') + int + '.' + dec;
}

// Get today date
function formatDate() {
    var date, month, year, day, today;
    date = new Date();

    day = date.getDate();
    month = date.getMonth() + 1;
    year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    today = year + "-" + month + "-" + day;

    document.querySelector(DOMstrings.fromDate).value = today;

    document.querySelector(DOMstrings.toDate).value = today;

    return today;
}

// Save data to local storage
function saveData () {
    var str = JSON.stringify(items);
    localStorage.setItem('data', str);
}

// Get data from local storage
function getData () {
    var str = localStorage.getItem('data');
    items = JSON.parse(str);
    if (!items) {
        items = [];
    }
}

//is like for each
var nodeListForEach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
        callback(list[i], i);
    }
};

// Show input value in UI
function addListItems () {
    var income_html = '', expense_html = '', tmp, val;

    bottom_id = document.querySelector(DOMstrings.bottom).id;

    for (var i in items) {
        if (items[i].user_id == bottom_id) {
            tmp = Object.assign({},items[i]);
            
            //Create HTML string with placeholder text
            if(tmp.type === 'inc') {
                val = formatNumber(tmp.value, 'inc');

                income_html += `<div class="item clearfix" id='${tmp.type}-${tmp.id}'> <div class="item__date">${tmp.date}</div> <div class="item__description">${tmp.description}</div> <div class="right clearfix"><div class="item__value">${val}</div><div class="item__delete"><button class="item__delete--btn"> <i class="ion-ios-close-outline"></i> </button></div></div></div>`;
            } else if (tmp.type === 'exp') {
                val = formatNumber(tmp.value, 'exp');

                expense_html += `<div class="item clearfix exp" id='${tmp.type}-${tmp.id}'> <div class="item__date">${tmp.date}</div> <div class="item__description">${tmp.description}</div><div class="right clearfix"><div class="item__value">${val}</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
            }
        }
    }

    if (items.length > 0) {
        //Insert the HTML into DOM
        document.querySelector(DOMstrings.incomeContainer).innerHTML = income_html;
        document.querySelector(DOMstrings.expensesContainer).innerHTML = expense_html;        
    }
}

function calculateBudget() {
    var incsum = 0, expsum = 0;

    bottom_id = document.querySelector(DOMstrings.bottom).id;

    items.forEach(function(cur){
        if (cur.user_id == bottom_id) {
            if (cur.type === 'inc') {
                incsum += cur.value;
            } else {
                expsum += cur.value;
            }
        }
    });

    data.totals.inc = incsum;
    data.totals.exp = expsum;

    data.budget = data.totals.inc - data.totals.exp;
}

// Get budget as object
function getBudget () {
    return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp                
    }
}

// Add budget to UI
function displayBudget (obj) {
    var type;
    obj.budget > 0 ? type = 'inc' : type = 'exp';

    document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
    document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
    document.querySelector(DOMstrings.expensesLable).textContent = formatNumber(obj.totalExp, 'exp');
    
    if(obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLable).textContent = obj.percentage + '%';            
    } else {
        document.querySelector(DOMstrings.percentageLable).textContent = '---';                  
    }    
}

// Calculate and update budget
function updateBudget () {
    calculateBudget();

    var budget = getBudget();

    displayBudget(budget);
}

// When enter clear input field
function clearFields () {
    var field, fieldArr;
    field = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
    
    //Convert a list to an array
    fieldArr = Array.prototype.slice.call(field);

    fieldArr.forEach(function(current) {
        current.value = ''
    });
    
    // Place focus in description field
    fieldArr[0].focus();
}

//when select type change border color
function changedType () {
    var fields = document.querySelectorAll(
        DOMstrings.inputType + ',' + 
        DOMstrings.inputDescription + ',' +
        DOMstrings.inputValue);

    nodeListForEach(fields, function(cur) {
        cur.classList.toggle('red-focus');
    });

    document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
}

// Delete item from array
function deleteItem (id) {
    var ids, index;

    ids = items.map(cur => cur.id);

    index = ids.indexOf(id);

    if (index !== -1) {
        items.splice(index, 1);
    }    
}

// Delete item from UI
function deleteListItem (selectorID) {
    var el = document.getElementById(selectorID);

    el.parentNode.removeChild(el);
}

// check event target id and want to delete item id then delete item
function ctrlDeleteItem(event) {
    var itemID, splitID, type, ID, element, all;
    
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    
    if(itemID) { 
        splitID = itemID.split('-');
        type = splitID[0];
        ID = parseInt(splitID[1]);
    }

    element = items.find(el=>el.id==ID);

    all = element.type + '-' + element.id

    //1. Delete the item from data structure
    deleteItem(element.id);

    //2. Delete the item from UI
    deleteListItem(all);

    //3. Update and show the new budget
    updateBudget();

    saveData();
}

function ctrlAddItem () {
    var input = getInput ();
    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
        // Add data to array
        addNewItem(input.type, input.description, input.value);

        // Add item to the UI
        addListItems();

        // Clear input Fields
        clearFields();

        // Calculate and update the budget
        updateBudget();
    }
}

function setupEventListener () {
    document.querySelector(DOMstrings.inputBtn).addEventListener('click', ctrlAddItem);
    
    document.addEventListener('keypress', function(event) {
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
    });

    document.querySelector(DOMstrings.container).addEventListener('click', ctrlDeleteItem);

    document.querySelector(DOMstrings.inputType).addEventListener('change', changedType);

    document.querySelector(DOMstrings.btn__back).addEventListener('click', function() {
        window.location.reload();
        // document.querySelector(DOMstrings.userTable).style.display = 'block';
        // document.querySelector(DOMstrings.bottom).style.display = 'none';
    });
}

// Search data with date
function searchWithDate() {
    var select_from_date, select_to_date;

    select_from_date = document.querySelector(DOMstrings.fromDate).value;
    select_to_date = document.querySelector(DOMstrings.toDate).value;

    bottom_id = document.querySelector(DOMstrings.bottom).id;

    items.forEach( function (cur){
        if(cur.user_id == bottom_id) {
            if (cur.date >= select_from_date && cur.date <= select_to_date) {
                document.getElementById(cur.type + '-' + cur.id).style.display = 'block'; 
            } else {
                document.getElementById(cur.type + '-' + cur.id).style.display = 'none'; 
            }
        }
    });
}

// when click on edit icon
function editUser(id) {
    var ids;

    document.querySelector(DOMstrings.userTable).style.display = 'none';
    document.querySelector(DOMstrings.navBar).style.display = 'block';
    document.querySelector(DOMstrings.image).style.height = '54vh';

    // ids = users.find(el => el.id == id);
    document.querySelector(DOMstrings.bottom).setAttribute('id', id);

    ids = document.querySelector(DOMstrings.bottom).id;

    if (ids == id) {
        document.querySelector(DOMstrings.bottom).style.display = 'block';
        getData();
        addListItems();
        setupEventListener();
        updateBudget();
    }
}

function userDetail (id, name) {
    var incsum = 0, expsum = 0, type;
    items.forEach(function(cur){
        if (cur.user_id == id) {
            if (cur.type === 'inc') {
                incsum += cur.value;
            } else {
                expsum += cur.value;
            }
        }
    });

    data.totals.inc = incsum;
    data.totals.exp = expsum;

    user.user_total_inc += data.totals.inc;
    user.user_total_exp += data.totals.exp;
    user.user_budget = user.user_total_inc - user.user_total_exp;

    user.user_budget > 0 ? type = 'inc' : type = 'exp';

    document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(user.user_budget, type);
    document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(user.user_total_inc, 'inc');
    document.querySelector(DOMstrings.expensesLable).textContent = formatNumber(user.user_total_exp, 'exp');

    // push user array to tables
    tables.push(`
        <tr>
        <td>${id}</td>
        <td>${name}</td>
        <td class="text-right user_income">${formatNumber(data.totals.inc, 'inc')}</td>
        <td class="text-right user_expense">${formatNumber(data.totals.exp, 'exp')}</td>
        <td class="text-center">
        <a onclick="editUser(${users[i].id})"><i class="fa fa-edit" style="color: #4fb7ad;"></i></a>
        </td>
        </tr>`);

    document.querySelector('.table__row').innerHTML = tables.join('');

}

//Initialize
getData();
formatDate();
for (var i = 0; i < users.length; i++) {
    userDetail(users[i].id, users[i].name);
}

