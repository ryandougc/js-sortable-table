// Table element and data
let table = {
    headers: [
        "Title",
        "Price"
    ],
    data: [
        ["onion", 1.29],
        ["coffee", 5.99],
        ["sausage", 11.99],
        ["onion", 3.29],
        ["orange", 1.29],
        ["scallion", 0.99],
        ["Red Pepper", 0.79],
        ["Banana", 3.99],
        ["Cumin", 6.99],
        ["Paprika", 6.99],
        ["Orange Juice", 3.49],
        ["Fajita Box", 5.99],
        ["Salmon", 13.99],
        ["Chicken Breast", 12.99],
        ["French Fries", 9.99],
        ["Avocado", 1.39],
        ["Rice", 7.99],
        ["Rice-a-roni", 2.29],
        ["Tea", 3.49],
        ["Hummus", 7.99],
        ["Lunch Meat", 8.99],
        ["Ground Beef", 22.99],
        ["Chocolate Muffins", 7.99],
        ["Croissants", 5.99],
        ["Chicken Legs", 24.73],
        ["Trail Mix", 10.99],
        ["Cliff Bars", 18.99],
        ["Protein Powder", 34.99],
        ["Frozen Berries", 9.99],
        ["Iced Team", 8.83],
        ["Chalupas", 2.99],
        ["Hot Dogs", 1.79],
        ["Goat", 123.99],
        ["Olives", 3.99],
        ["Pickles", 5.99],
    ],
    sortDirection: [null, null],
    tableElem: document.getElementById('table'),
    limit: 10,
    page: 1,
    min: function() {
        return this.limit * this.page - this.limit;
    },
    max: function() {
        let result = this.limit * this.page;

        if (result > this.currentData.length) {
            result = this.currentData.length;
        }

        return result;
    },
    maxPage: function() {
        let numOfPages = this.data.length / this.limit;
        return Math.ceil(numOfPages); 
    }
}




// Make sure all item names are capitalized properly
table.data.forEach(item => {
    item[0] = capitalize(item[0]);
})
function capitalize(string) {
    let cleanedString = '';

    cleanedString = string.charAt(0).toUpperCase() + string.slice(1);

    return cleanedString;
}
table.currentData = JSON.parse(JSON.stringify(table.data));



// Build Table
function buildTableHeaders(tableDom, headers) {
    // Create Headers
    const tHead = tableDom.createTHead();
    const headerRow = tHead.insertRow();

    // Insert master checkbox
    const masterCheck = document.createElement('th');
    masterCheck.innerHTML = `<input type="checkbox" name="masterCheck" id="masterCheck">`;
    headerRow.appendChild(masterCheck);

    // Insert table headers
    headers.forEach((header, index) => {
        const th = document.createElement('th');
        th.innerHTML = `${header} <i class="fa fa-sort" onclick="sort(${index})"></i>`;
        headerRow.appendChild(th);
    });
}
function buildTableBody(tableDom, data, min, max) {
    // Clear any old body
    if (tableDom.tBodies.length > 0) {
        tableDom.removeChild(tableDom.getElementsByTagName("tbody")[0]);
    }

    // Create body
    const tBody = tableDom.createTBody();

    // Insert Body
    for (let i = min; i < max; i++) {
        let newRow = tBody.insertRow();

        // Insert Checkbox for each row
        let rowCheck = newRow.insertCell();
        rowCheck.innerHTML = `<input type="checkbox" name="rowCheck${i}" class="rowCheck">`;

        // Insert data into row
        data[i].forEach(cell => {
            let newCell             = newRow.insertCell();
            newCell.textContent     = cell;
        });
    }
}
// Build base table on load
buildTableHeaders(table.tableElem, table.headers);
buildTableBody(table.tableElem, table.currentData, table.min(), table.max());




// Fill a table with new data based on the original table structure
function fillTable(tableDom, data) {
    for (let i = 1; i < tableDom.rows.length; i++) {
        for (let j = 0; j < tableDom.rows[i].cells.length; j++) {
            tableDom.rows[i].cells[j].textContent = data[i - 1][j];
        }
    }
}




// Insertion sort an array in ascending or descenging order based on a parameter
function sort(index) { // Requires use of global variables
    let sortedArray = [];

    // Sort currentData
    if (table.sortDirection[0] === "ascending" && table.sortDirection[1] === index) {
        table.sortDirection[0] = "descending";
        table.sortDirection[1] = index;
        sortedArray = insertionSort("descending", [...table.currentData], index);
    } else {
        table.sortDirection[0] = "ascending";
        table.sortDirection[1] = index;
        sortedArray = insertionSort("ascending", [...table.currentData], index);
    }

    // Update the current data
    table.currentData = JSON.parse(JSON.stringify(sortedArray));

    // Fill the table with new current data
    fillTable(table.tableElem, table.currentData);
}
function insertionSort(direction, array, index) {
    for (let i = 1; i < array.length; i++) {
        let current = array[i];

        let j = i - 1;

        if (direction === "ascending") {
            while ((j > -1) && (current[index] < array[j][index])) {
                array[j + 1] = array[j];
                j--;
            }
        } else if (direction === "descending") {
            while ((j > -1) && (current[index] > array[j][index])) {
                array[j + 1] = array[j];
                j--;
            }
        }

        array[j + 1] = current;
    }

    return array;
}




// Limit # of items showing on a page
function limitTable(num) { // Uses global Variables
    if (num > table.currentData.length) {
        table.limit = table.data.length;
    } else {
        table.limit = num;
    }

    table.page = 1;

    buildTableBody(table.tableElem, table.currentData, table.min(), table.max());
}




// Pagination
const prevPageBtn = document.querySelector('#prev');
const nextPageBtn = document.querySelector('#next');

prevPageBtn.addEventListener('click', pageChange);
nextPageBtn.addEventListener('click', pageChange);

function pageChange(e) { // Requires Global variable
    if (e.target.value < 0 && table.page > 1) {
        // Previous Page
        table.page--;
    } else if (e.target.value > 0 && table.page < table.maxPage()) {
        // Next Page
        table.page++;
    }

    buildTableBody(table.tableElem, table.currentData, table.min(), table.max());
}




// Search the table
let searchTimeout   = null;
const searchBar     = document.querySelector('input');

searchBar.addEventListener('keydown', search);

function search(event) {
    clearTimeout(searchTimeout);

    table.tableElem.tBodies[0].style.display = 'none';

    searchTimeout = setTimeout(_ => {
        table.currentData = searchData(event.target.value);

        if (table.currentData === null) {
            table.currentData = JSON.parse(JSON.stringify(table.data));

            if (table.sortDirection[0] !== null) {
                table.currentData = insertionSort(table.sortDirection[0], table.currentData, table.sortDirection[1]);
            }
        }

        buildTableBody(table.tableElem, table.currentData, table.min(), table.max());
    }, 350)
}
function searchData(searchTerm) { // Uses Global Variables
    let matchingItems       = [];
    const searchTermRegex   = new RegExp(searchTerm.toLowerCase());

    if (searchTerm == "") {
        return null;
    }

    table.data.forEach( (item, i) => {
        item.forEach( (value, j) => {
            let valueStr = value.toString().toLowerCase();
            const isFound = Boolean(valueStr.match(searchTermRegex));

            if (isFound){
                matchingItems.push(item);
            }
        })
    })

    return matchingItems;
}