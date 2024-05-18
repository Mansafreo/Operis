//File to manage the kanban board for a particular project

//Importing the required modules

//Import the models
const { ProjectItems } = require('../Database/models');
//Import some functions from projects.js
const { loadProjects } = require('./projects');

//Function to toggle the kanban board
function toggleKanban(event){
    //Get the kanban board
    const kanban = document.querySelector('#kanban');
    //Toggle the kanban board
    kanban.classList.toggle('hide');
    //Set the value of the kanban to the id of the project
    let projectID=event.target.value;
    kanban.setAttribute('value', projectID);
}

//To toggle the kanban item form
function toggleProjectItemForm(){
    //Get the kanban item form
    const kanbanItemForm = document.querySelector('#projectItemForm');
    //Toggle the kanban item form to flex display
    let display = 'flex';
    if(kanbanItemForm.style.display === 'flex'){
        display = 'none';
    }
    kanbanItemForm.style.display = display;
}

//Function to save the project Item
async function saveProjectItem(){
    //Get the project item form
    const projectItemForm = document.querySelector('#projectItemForm');
    //Get the project item form elements
    const title = projectItemForm.querySelector('#kanbanTitle').value;
    const description = projectItemForm.querySelector('#kanbanDescription').value;
    const status = projectItemForm.querySelector('#kanbanStatus').value;
    const dueDate = projectItemForm.querySelector('#kanbanDueDate').value;
    const projectId = document.querySelector('#kanban').getAttribute('value');
    //Save the project item
    await ProjectItems.create({
        Title: title,
        Content: description,
        Status:status,
        DueDate: dueDate,
        projectId: projectId,
    });
    //Get the project item form
    projectItemForm.style.display = 'none';
    //Load the project items
    loadProjects();
}


module.exports = {
    toggleKanban,
    toggleProjectItemForm,
    saveProjectItem,
}