//To manage the databasefile itself for data integrity
const fs = require('fs');
const { resolve } = require('path');
const dbPath = resolve(__dirname, 'database.db');//Relative to the HTML in the renderer process

//check if the database file exists
function checkDatabase() {
    //check if the dbFile exists
    if (fs.existsSync(dbPath)) {
        console.log("Database exists");
    } else {
        createDatabase();
    }
}
function createDatabase() {
    //Create the database file
    fs.writeFileSync(dbPath, "");
    console.log("Database created");
}
checkDatabase();