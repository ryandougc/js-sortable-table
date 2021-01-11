if(document.getElementById('table')){

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
// Set the table row limit
if(document.querySelector('#item-limit')){
    table.limit = 10;
}else {
    table.limit = table.currentData.length;
}




// Build Table
function buildTableHeaders(tableDom, headers) {
    // Create Headers
    const tHead = tableDom.createTHead();
    const headerRow = tHead.insertRow();

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


const pageLimitSelect = document.querySelector('#item-limit');

if(pageLimitSelect) {
    // Create page limit select box options
    const pageLimitOption1 = document.createElement('option');
    const pageLimitOption2 = document.createElement('option');
    const pageLimitOption3 = document.createElement('option');

    pageLimitOption1.setAttribute('value', '10');
    pageLimitOption2.setAttribute('value', '20');
    pageLimitOption3.setAttribute('value', '30');

    pageLimitOption1.innerHTML = "10";
    pageLimitOption2.innerHTML = "20";
    pageLimitOption3.innerHTML = "30";

    pageLimitSelect.appendChild(pageLimitOption1);
    pageLimitSelect.appendChild(pageLimitOption2);
    pageLimitSelect.appendChild(pageLimitOption3);

    pageLimitSelect.setAttribute('name', 'item-limit');
    pageLimitSelect.setAttribute('class', 'input');
    pageLimitSelect.setAttribute('autocomplete', 'off');

    pageLimitSelect.addEventListener('change', limitTable);

    // Logic to Limit # of items showing on a page
    function limitTable(event) { // Uses global Variables
        let num = event.target.value;
        if (num > table.currentData.length) {
            table.limit = table.data.length;
        } else {
            table.limit = num;
        }

        table.page = 1;

        buildTableBody(table.tableElem, table.currentData, table.min(), table.max());
    }




    // Create pagination buttons
    const pagination = document.createElement('div');
    pagination.setAttribute('id', 'pagination')

    const paginationBtnsDiv = document.createElement('div');
    paginationBtnsDiv.setAttribute('id', 'pagination-btns');

    const prevPageBtn = document.createElement('button');
    const nextPageBtn = document.createElement('button');

    prevPageBtn.setAttribute('id', 'prev');
    nextPageBtn.setAttribute('id', 'next');

    prevPageBtn.setAttribute('value', '-1');
    nextPageBtn.setAttribute('value', '1');

    prevPageBtn.classList.add('button', 'input');
    nextPageBtn.classList.add('button', 'input');

    prevPageBtn.innerHTML = "Previous";
    nextPageBtn.innerHTML = "Next";

    prevPageBtn.addEventListener('click', pageChange);
    nextPageBtn.addEventListener('click', pageChange);

    paginationBtnsDiv.appendChild(prevPageBtn);
    paginationBtnsDiv.appendChild(nextPageBtn);

    pagination.appendChild(paginationBtnsDiv);

    document.querySelector('#content').appendChild(pagination)

    // Logic to change page when clicking buttons
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
}




// Search the table
const searchBar     = document.querySelector('#search-bar');

if(searchBar) {
    searchBar.setAttribute("placeholder", "Search...");
    searchBar.setAttribute("autocomplete", "off");
    searchBar.setAttribute("value", "");
    searchBar.classList.add('input');
    searchBar.addEventListener('keydown', search);

    let searchTimeout   = null;

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
    function searchData(searchTerm) { // Requires Global Variables
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
}

}