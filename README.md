# js-sortable-table
A Vanilla JavaScript plugin that adds feature rich tables to your site.

# Features
- Search array of data
- Limit number of items shown at once
- Paginate data
- Sort each column in ascending or descending order
# How to use
1. Create a table HTML element with and id of "table"
`<table id="table"></table>`

3. Add your headers in the table.headers property in 'sortingTable.js'
Headers are stored in an array
`['Header1', 'Header2']`

2. Add your data into the table object in 'sortingTable.js'
Data is stored in an array, with each index holding an array to represent the data for each row of the table
`[['row1', 'value1'], ['row2', 'value2]]`