const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { resolve } = require('path');

// Get the users models
const modelsPath = resolve(__dirname, '../Database', 'models.js');
const { Users } = require(modelsPath);

async function getUser() {
    // Get the user from the database
    return Users.findOne({
        where: {
            verified: true
        }
    }).then((user) => {
        if (user) {
            return user.dataValues;
        } else {
            return false;
        }
    });
}

// To get all the files in the Storage folder
function getFiles() {
    // Get the path to the storage folder
    const storagePath = path.resolve(__dirname, '../Storage');
    // Read the contents of the folder
    return fs.readdirSync(storagePath);
}

// Function to send axios requests to the server
/*
Request Type: POST
Route: /sync
Data: email, file, fileName, fileType
*/
function sendFile(email, filePath, fileName, fileType) {
    let fileData=fs.readFileSync(filePath);
    axios.post('http://localhost:5000/sync', {
        email: email,
        fileData: fileData,
        fileName: fileName,
        fileType: fileType
    })
    .then((response) => {
        console.log(response.data);
    })
    .catch((error) => {
        console.error(error);
    });
}

async function sync() {
    let syncButton = document.getElementsByClassName('syncIcon')[0];
    syncButton.style.animationName = 'rotate';
    // First of all get the user
    let user = await getUser();
    if (!user) {
        console.log("No verified user found");
        return;
    }

    let email = user.email;

    // Get all the files in the storage folder
    let files = getFiles();
    // Iterate over the files
    files.forEach(file => {
        // Get the file path
        let filePath = path.resolve(__dirname, '../Storage', file);
        // Get the file type
        let fileType = path.extname(file);
        // Send the file to the server
        sendFile(email, filePath, file, fileType);
    });

    // Next send the database .db file
    // Get the database file
    let dbPath = path.resolve(__dirname, '../Database', 'database.db');
    // Send the database file
    sendFile(email, dbPath, 'database.db', '.db');
    setTimeout(() => {
        syncButton.style.animationName = '';
    }, 2000);
}

// Add event listener to the button
document.getElementById('syncButton').addEventListener('click', sync);


module.exports = {
    getUser,
    getFiles,
    sendFile,
    sync
};
