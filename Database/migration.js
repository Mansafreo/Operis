//Import the models.js file from the Database folder
const path = require('path');
const modelsPath = path.resolve(__dirname, 'models.js');
const {sync}= require(modelsPath);
//Use the sync function to sync the database
sync();