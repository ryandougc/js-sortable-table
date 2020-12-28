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
    page: 1
}
table.currentData = [...table.data];






// What happens when the page is loaded
function buildTable(headers, data, tableElem, itemLimit) { 
    const tHead         = tableElem.createTHead();
    const tBody         = tableElem.createTBody();
    const headerRow     = tHead.insertRow();

    // Insert table table.headers
    headers.forEach( (header, index) => {
        const th        = document.createElement('th');
        th.innerHTML    = `${header} <i class="fa fa-sort" onclick="sort(${index})"></i>`;
        headerRow.appendChild(th);
    });

    let min = 0;
    let max = itemLimit;

    for ( let i=min; i < max; i++ ) {
        let newRow = tBody.insertRow();

        data[i].forEach( cell => {
            let newCell         = newRow.insertCell();
            newCell.textContent = cell;
        });
    }
}
// Run the buildTable on page load
buildTable(table.headers, table.data, table.tableElem, table.limit);






// What happens when sorting is done

// Fill a table with new data based on the original table structure
function fillTable(tableShell, dataArray) {
    for (let i = 1; i < tableShell.rows.length; i++) {
        for (let j = 0; j < tableShell.rows[i].cells.length; j++) {
            tableShell.rows[i].cells[j].textContent = dataArray[i - 1][j];
        }
    }
}

// Insertion sort an array in ascending or descenging order based on a parameter
function sort(index) { // Requires use of global variables
    let sortedArray = [];

    if (table.sortDirection[0] === "ascending" && table.sortDirection[1] === index) {
        table.sortDirection[0] = "descending";
        table.sortDirection[1] = index;
        sortedArray = insertionSort("descending", [...table.data], index);
    } else {
        table.sortDirection[0] = "ascending";
        table.sortDirection[1] = index;
        sortedArray = insertionSort("ascending", [...table.data], index);
    }

    table.currentTable = [...sortedArray];

    fillTable(table.tableElem, sortedArray);
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





// What happens when something is searched

// Get all table rows
// const tableRows = document.querySelectorAll('#table tbody tr');
const tableRows = table.tableElem.tBodies[0].rows;
const tableItems = document.querySelectorAll('#table tbody tr td');

// Search Table
const searchBar = document.querySelector('input');
let searchTimeout = null;
searchBar.addEventListener('keydown', logSearch);

function logSearch(event) {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(_ => {
        console.log(table.tableElem);
        const itemPosition = searchTable(event.target.value);

        for (let i = 0; i < tableRows.length; i++) {
            console.log(tableRows[i]);
            tableRows[i].style.display = "none";
        }

        if (itemPosition[0] === -2) {
            for (let i = 0; i < tableRows.length; i++) {
                tableRows[i].style.display = "";
            }
        } else {
            itemPosition.forEach(item => {
                console.log(item);
                tableRows[item].style.display = "";
            })
        }
    }, 350);
}

function searchTable(searchTerm) {
    let itemPosition = [];
    const searchTermRegex = new RegExp(searchTerm.toLowerCase());

    if (searchTerm === ""){
        itemPosition.push(-2);
    } else {
        for (let i = 0; i < table.currentData.length - 1; i++) {
            for (let j = 0; j < table.currentData[i].length; j++) {
                const isInArray = Boolean(table.currentData[i][j].toString().toLowerCase().match(searchTermRegex));

                if (isInArray) {
                    itemPosition.push(i);
                }
            }
        }
    }

    return itemPosition;
}






// What happens when the number of viewed items is changed
function limitTable(num) {
    console.log(`Num: ${num}`);
    console.log(`Data Length: ${table.currentData.length}`);

    if (num > table.currentData.length - 1) {
        table.limit = table.currentData.length - 1;
    } else {
        table.limit = num;
    }

    rebuildTable(table.currentData);
}

function rebuildTable(data) {
    let min = 0;
    let max = table.limit;

    table.tableElem.tBodies[0].remove();

    const tBody = table.tableElem.createTBody();

    for (let i = min; i < max; i++) {
        let newRow = tBody.insertRow();

        data[i].forEach(cell => {
            let newCell = newRow.insertCell();
            newCell.textContent = cell;
        });
    }
}




// Pagination

const prevPageBtn = document.querySelector('#prev');
const nextPageBtn = document.querySelector('#next');

nextPageBtn.addEventListener('onclick', pageChange)

