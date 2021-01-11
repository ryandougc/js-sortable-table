# js-sortable-table
A Vanilla JavaScript plugin that adds feature rich tables to your site.

# Features
- Sort each column in ascending or descending order
- Search table filter
- Filter number of rows
- Paginate table

# How to use
#### 1. Create a table HTML element with and id of "table"
`<table id="table"></table>`
<br>  <br>

#### 2. Add your headers in the table.headers property in 'sortingTable.js'
Headers are stored in an array:
`['Header1', 'Header2']`
<br><br>

#### 3. Add your data into the table object in 'sortingTable.js'
Data is stored in an array, with each index holding an array to represent the data for each row of the table:
`[['row1', 'value1'], ['row2', 'value2]]`
<br><br>

#### 4. Optional: Filters
Filters are enabled by adding elements inside a div with the id of "table-filters" which is placed above the initial table element:

    <div id="table-filters"></div>
    <table id="table></div>
<br>

- Adding Search:

Inside the table-filters div, add a text input with the id of "search-bar":

    <div id="table-filters">
        <div id="search-bar></div>
    </div>
<br>

- Adding Item limit and pagination

Inside the table-filters div, add a select box with the id of "item-limit":

    <div id="table-filters">
        <select id="item-limit"></select>
    </div>
<br>

- A fully featured table

This is what a fully featured table will look like in your HTML:

    <div id="table-filters">
        <div id="search-bar></div>
        <select id="item-limit"></select>
    </div>

    <table id="table></div>