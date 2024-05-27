// Purpose: To handle the notes page

//Import the models.js file from the Database folder
const path = require('path');
const modelsPath = path.resolve(__dirname, '../Database', 'models.js');
const {Subjects}= require(modelsPath);
//To toggle the display of the projects
function toggleNotes() {
    //Get the projects container
    let notesSection = document.getElementsByClassName('notes')[0];
    //Check if the projects container is hidden
    if (notesSection.style.display === 'none' || notesSection.style.display === '') {
        //If the projects container is hidden, show it
        notesSection.style.display = 'block';
        //load the subjects
        loadSubjects();
    } else {
        //If the projects container is shown, hide it
        notesSection.style.display = 'none';
    }
}

function toggleSubjectForm() {
    //Get the project form
    let subjectForm = document.getElementById('subjectForm');
    //Check if the project form is hidden
    if (subjectForm.style.display === 'none' || subjectForm.style.display === '') {
        //If the project form is hidden, show it
        subjectForm.style.display = 'block';
    } else {
        //If the project form is shown, hide it
        subjectForm.style.display = 'none';
    }
}

//To save a subject to the database
function saveSubject() {
    //Get the subject form
    let subjectForm = document.getElementById('subjectForm');
    //Get the subject name
    let subjectName = subjectForm.querySelector('#subjectName').value;
    //Get the subject description
    let subjectDescription = subjectForm.querySelector('#subjectDescription').value;
    //Get the workspaceID
    let workspaceID = document.getElementById('workspaceID').value;
    //Create a new subject object
    let subject = {
        name: subjectName,
        description: subjectDescription,
        workspaceID: workspaceID
    };
    //Use the sequelize create function to save the subject to the database
    Subjects.create(subject);
    //Hide the subject form
    toggleSubjectForm();
    //Clear the subject form
    clearSubjectForm();
    //Load the subjects
    loadSubjects();
}

function clearSubjectForm() {
    //Clear the subject name
    document.getElementById('subjectName').value = '';
    //Clear the subject description
    document.getElementById('subjectDescription').value = '';
}

//function to load the subjects
function loadSubjects() {
    //Get the workspaceID
    let workspaceID = document.getElementById('workspaceID').value;
    //Find all the subjects in the database
    Subjects.findAll({
        where: {
            workspaceID: workspaceID
        }
    }).then((subjects) => {
        //Get the subjects container
        let subjectsContainer = document.getElementById('subjectsList');
        //Clear the subjects container
        subjectsContainer.innerHTML = '';
        //Loop through the subjects
        subjects.forEach((subject) => {
            //Create a new subject element
            let subjectElement = createSubjectDiv(subject);
            //Append the subject element to the subjects container
            subjectsContainer.appendChild(subjectElement);
        });
    });
}

//Function to dynamically create the subjects div
function createSubjectDiv(subject){
    subject=subject.dataValues;//Get the subject data values
    //Create the shelf div
    let shelf=document.createElement('div');
    shelf.className='shelf';
    //Put the subject id in the shelf
    shelf.setAttribute('value',subject.subjectID);
    //create the shelf-header div
    let shelfHeader=document.createElement('div');
    shelfHeader.className='shelf-header';
    //create the shelf-label div
    let shelfLabel=document.createElement('div');
    shelfLabel.className='shelf-label';
    shelfLabel.textContent=subject.name;
    //Put the shelf label in the shelf header
    shelfHeader.appendChild(shelfLabel);
    //Put the shelf header in the shelf
    shelf.appendChild(shelfHeader);
    //Create the shelf actions div
    let shelfActions=document.createElement('div');
    shelfActions.className='shelf-actions';
    //Create the edit button
    let editButton=document.createElement('button');
    editButton.className='shelf-edit-btn';
    //Create the edit icon
    let editIcon=document.createElement('img');
    editIcon.src='Images/icons8-edit-50.png';
    editIcon.className='icon';
    //Put the edit icon in the edit button
    editButton.appendChild(editIcon);
    //Put the subject id in the edit button
    editButton.setAttribute('value',subject.subjectID);
    //Add an event listener to the edit button
    editButton.addEventListener('click',()=>{
        editSubject(subject.subjectID);
    });
    //Create the delete button
    let deleteButton=document.createElement('button');
    deleteButton.className='shelf-delete-btn';
    //Create the delete icon
    let deleteIcon=document.createElement('img');
    deleteIcon.src='Images/icons8-trash-24.png';
    deleteIcon.className='icon';
    //Put the delete icon in the delete button
    deleteButton.appendChild(deleteIcon);
    //Put the subject id in the delete button
    deleteButton.setAttribute('value',subject.subjectID);
    //Add an event listener to the delete button
    deleteButton.addEventListener('click',()=>{
        deleteSubject(subject.subjectID);
    });
    //Put the edit button in the shelf actions
    shelfActions.appendChild(editButton);
    //Put the delete button in the shelf actions
    shelfActions.appendChild(deleteButton);
    //Put the shelf actions in the shelf 
    shelf.appendChild(shelfActions);
    //Create the add book div
    let addBook=document.createElement('div');
    addBook.className='add-book';
    //Create the add book button
    let addBookButton=document.createElement('button');
    addBookButton.className='add-book-btn';
    addBookButton.textContent='Add New Book';
    //Put the add book button in the add book div
    addBook.appendChild(addBookButton);
    //Put the add book div in the shelf
    shelf.appendChild(addBook);
    //Return the subject element
    return shelf;
}
//Function to edit a subject
function editSubject(id){
    //Find the subject in the database
    Subjects.findOne({
        where:{
            subjectID:id
        }
    }).then((subject)=>{
        subject=subject.dataValues;//Get the subject data values
        //Get the subject form
        let subjectForm = document.getElementById('subjectForm');
        //Get the subject name
        let subjectName = subjectForm.querySelector('#subjectName');
        //Get the subject description
        let subjectDescription = subjectForm.querySelector('#subjectDescription');
        //Set the subject name
        subjectName.value=subject.name;
        //Set the subject description
        subjectDescription.value=subject.description;
        //Show the subject form
        subjectForm.style.display='block';
        //Get the save button
        let saveButton=document.getElementById('saveSubject');
        //Change the save button to an update button
        saveButton.textContent='Edit Subject';
        //Remove the event listener from the save button
        saveButton.removeEventListener('click',saveSubject);
        saveButton.onclick=null;
        //put the subject id in the save button
        saveButton.setAttribute('value',subject.subjectID);
        //Add an event listener to the update button
        saveButton.addEventListener('click',saveSubjectEdit);
    });
    //Toggle the subject form
    toggleSubjectForm();
}

function saveSubjectEdit(e){
    //Get the subject id
    let subjectID=e.target.getAttribute('value');
    //Find the subject in the database
    Subjects.findOne({
        where:{
            subjectID:subjectID
        }
    }).then((subject)=>{
        //Get the subject form
        let subjectForm = document.getElementById('subjectForm');
        //Get the subject name
        let subjectName = subjectForm.querySelector('#subjectName').value;
        //Get the subject description
        let subjectDescription = subjectForm.querySelector('#subjectDescription').value;
        //Update the subject
        subject.update({
            name:subjectName,
            description:subjectDescription
        });
        //Hide the subject form
        subjectForm.style.display='none';
        //Clear the subject form
        clearSubjectForm();
        //Load the subjects
        loadSubjects();
        //Get the save button
        let saveButton=document.getElementById('saveSubject');
        //Change the update button to a save button
        saveButton.textContent='Save Subject';
        //Remove the event listener from the update button
        saveButton.removeEventListener('click',saveSubjectEdit);
        saveButton.onclick=null;
        //Add an event listener to the save button
        saveButton.addEventListener('click',saveSubject);
    });
}


//Function to delete a subject
function deleteSubject(id){
    //Find the subject in the database
    Subjects.findOne({
        where:{
            subjectID:id
        }
    }).then((subject)=>{
        //Delete the subject
        subject.destroy();
        //Load the subjects
        loadSubjects();
    });
}

//Export the functions
module.exports={
    toggleNotes,
    toggleSubjectForm,
    saveSubject,
    editSubject,
}
