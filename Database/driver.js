//File to manage database Transactions using models defined in models.js
//Resolve the path for the Engine folder
const { resolve } = require('path');
//Database Module
const dbPath = resolve(__dirname, '../Database', 'database.js');//Relative to the HTML in the renderer process
console.log(dbPath);
//check if the dbFile exists
const fs = require('fs');
if (fs.existsSync(dbPath)) {
    console.log("File exists");
} else {
    console.log("File does not exist");
}
function createDatabase() {
    const { createDatabase } = require(dbPath);
    createDatabase();
}