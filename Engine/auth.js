//Try to use axios to send a request to the server

const axios = require('axios');
const { resolve } = require('path');
//Get the users models
const modelsPath = resolve(__dirname, '../Database', 'models.js');
const { Users,Calendars,Workspaces } = require(modelsPath);
const fs = require('fs');
const path = require('path');

//To check whether there is a verified user 
function checkUser() {
    //Get the user from the database
    return Users.findOne({
            where: {
                verified: true
            }
    }).then((user) => {
        if (user) {
           return user.dataValues;
        }
        else {
            return false;
        }
    });
}

//To send login data to the server
function register() {
    //Get the username and password
    const username = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    console.log(username+" "+email+" "+password);
    //check if the username, email and password are not empty
    if (username === '' || email === '' || password === '') {
        let rError=document.getElementById('registrationError');
        rError.textContent='Please fill in all the fields';
        return;
    }
    //Send the data to the server as a POST request using x-www-form-urlencoded
    axios.post('http://localhost:5000/register', {
        name: username,
        email: email,
        password: password
    })
        .then((response) => {
            console.log(response.data);
            if (response.data.status === 'success') {
                //Redirect to the dashboard
                let registration=document.getElementById('registration');
                registration.style.display='none';
                let verification=document.getElementById('verification');
                verification.style.display='flex';
                //Create a user in the database
                Users.create({
                    username: username,
                    email: email,
                });
                checkAuth();
            }
            //Display the error message
            else {
                let rError=document.getElementById('registrationError');
                rError.textContent=response.data.message;
            }
        })
        .catch((error) => {
            console.error(error);
        });
}

function verify()
{
    //Get the verification code
    const verificationCode = document.getElementById('code').value;
    //check if the verification code is not empty
    if (verificationCode === '') {
        let vError=document.getElementById('verificationError');
        vError.textContent='Please fill in the verification code';
        return;
    }
    //Send the verification code to the server as a POST request using x-www-form-urlencoded
    axios.post('http://localhost:5000/verify', {
        token: verificationCode,
        email: document.getElementById('email').value
    })
        .then((response) => {
            console.log(response.data);
            if (response.data.status === 'success') {
                let verification=document.getElementById('verification');
                verification.style.display='none';
                //Create a user in the database
                Users.update({
                    verified: true
                },{
                    where:{
                        email:document.getElementById('email').value
                    }
                });
                initializeWorkspaces();
            }
            //Display the error message
            else {
                let vError=document.getElementById('verificationError');
                vError.textContent=response.data.message;
            }
        })
        .catch((error) => {
            console.error(error);
        });
}


//function to login
function login() {
    //Get the email and password
    const email = document.getElementById('loginemail').value;
    const password = document.getElementById('loginpassword').value;
    //check if the email and password are not empty
    if (email === '' || password === '') {
        let lError=document.getElementById('loginError');
        lError.textContent='Please fill in all the fields';
        return;
    }
    //Send the data to the server as a POST request using x-www-form-urlencoded
    axios.post('http://localhost:5000/login', {
        email: email,
        password: password
    })
        .then((response) => {
            console.log(response.data);
            if (response.data.status === 'success') {
                //Redirect to the dashboard
                let login=document.getElementById('login');
                login.style.display='none';
                // initializeWorkspaces();
                syncDown(email);
                checkAuth();
            }
            //Display the error message
            else {
                let lError=document.getElementById('loginError');
                lError.textContent=response.data.message;
            }
        })
        .catch((error) => {
            console.error(error);
        });
}

function initializeWorkspaces()
{
    //Get the user from the database
    Users.findOne({
        where: {
            verified: true
        }
    }).then((user) => {
        if (user) {
            //Create a workspace in the database
            Workspaces.create({
                workspaceName: 'Default',
                workspaceType: 'Personal',
                userID: user.dataValues.userID
            }).then(workspace => {
                //Create a calendar in the database
                Calendars.create({
                    workspaceID: workspace.dataValues.workspaceID,
                });
                //Set the workspaceID in the UI
                document.getElementById('workspaceID').value=workspace.dataValues.workspaceID;
            });
        }
    });
}


//Function to syncDown
function syncDown(email) {
    axios.post('http://localhost:5000/syncDown', {
            email: email
        })
        .then(response => response.data)
        .then(response => {
            let data = response.data;
            // Iterate through the files
            data.forEach(file => {
                let fileName = file.fileName;
                let fileType = file.fileType;
                let fileData = Buffer.from(file.fileData); // Convert array of bytes to buffer
                // Write the file to the storage folder
                if(fileType!=='.db'){
                fs.writeFileSync(path.resolve(__dirname, '../Storage', fileName), fileData);
                console.log('File written to storage folder: ' + fileName);
                }
                else{
                fs.writeFileSync(path.resolve(__dirname, '../Database', fileName), fileData);
                console.log('File written to database folder: ' + fileName);
                }
            });
        })
        .catch((error) => {
            console.error(error);
        });
}

async function checkAuth()
{
    let user=await checkUser();
    if(user)
    {
        let userP=document.getElementsByClassName('user-info')[0];
        userP.querySelector('.username').textContent=user.username;
        return true;
    }
    else{
        //Make the registration form visible
        let registration=document.getElementById('registration');
        registration.style.display='flex';
    }
} 
module.exports = {
  register,
  verify,
  checkUser,
  login,
    checkAuth
}