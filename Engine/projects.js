//Import the projects.js file from the Engine folder
const path = require('path');
// Define the path to the models.js file
const modelsPath = path.resolve(__dirname, '../Database','models.js');
//Import the models.js file
const {Projects,ProjectItems} = require(modelsPath);

//Import some functions from the kanban.js file
const {toggleKanban} = require('./kanban.js');


//To toggle the display of the projects
function toggleProjects() {
    //Get the projects container
    let projectsContainer = document.getElementsByClassName('projects')[0];
    //Check if the projects container is hidden
    if (projectsContainer.style.display === 'none' || projectsContainer.style.display === '') {
        //If the projects container is hidden, show it
        projectsContainer.style.display = 'block';
        //load the projects
        loadProjects();
    } else {
        //If the projects container is shown, hide it
        projectsContainer.style.display = 'none';
    }
}

function toggleProjectForm() {
    //Get the project form
    let projectForm = document.getElementById('projectForm');
    //Check if the project form is hidden
    if (projectForm.style.display === 'none' || projectForm.style.display === '') {
        //If the project form is hidden, show it
        projectForm.style.display = 'block';
    } else {
        //If the project form is shown, hide it
        projectForm.style.display = 'none';
    }
}

async function saveProject()
{
    //Get the project name
    let projectName = document.getElementById('projectName').value;
    //Get the project description
    let projectDescription = document.getElementById('projectDescription').value;
    //Get the project deadline
    let projectDueDate = document.getElementById('projectDueDate').value;
    let pStatus=document.getElementById('projectStatus').value;
    //Get the workspace ID
    let workspaceID = document.getElementById('workspaceID').value;
    //Create a new project object
    Projects.create({
        ProjectName: projectName,
        ProjectDescription: projectDescription,
        ProjectDueDate: projectDueDate,
        ProjectStatus:pStatus,
        workspaceID: workspaceID
    }).then(project => {
        console.log(project)
        console.log('Project created');
    });
    //Hide the project form
    toggleProjectForm();
    //Load the projects
    loadProjects();
}

//Function to load the projects
async function loadProjects() {
    //Get the projectsList
    const projectsList=document.getElementById('projectsList');
    //Get the projects
    const projects = await getProjects();
    //Clear the projectsList
    projectsList.innerHTML = '';
    //Loop through the projects
    projects.forEach(project => {
        //Create the project HTML
        createProjectHTML(project).then(projectHTML => {
        //Append the project HTML to the projectsList
        projectsList.appendChild(projectHTML);
         });
    });
}

async function getProjects() {
    //Get the workspace ID
    let workspaceID = document.getElementById('workspaceID').value;
    //Get the projects list
    let projectsList = document.getElementById('projectsList');
    let filter=document.getElementById('projectFilter').value;
    let projectsArray = [];
    //To filter the array according to the workspace ID and filter parameters
    if (filter == "All") {
       // Get all the tasks asynchronously
       const projects = await Projects.findAll({
        where: {
            workspaceID: workspaceID
        }
    });
    // Extract task data and push to tasksArray
    projects.forEach(project => {
        projectsArray.push(project.dataValues);
    });
    }
    //Not started projects
    else if (filter == "Not_Started") {
        // Get all the tasks asynchronously
        const projects = await Projects.findAll({
            where: {
                workspaceID: workspaceID,
                ProjectStatus: "Not Started"
            }
        });
        // Extract task data and push to tasksArray
        projects.forEach(project => {
            projectsArray.push(project.dataValues);
        });
    }
    //In Progress projects
    else if (filter == "In_Progress") {
        // Get all the tasks asynchronously
        const projects = await Projects.findAll({
            where: {
                workspaceID: workspaceID,
                ProjectStatus: "In Progress"
            }
        });
        // Extract task data and push to tasksArray
        projects.forEach(project => {
            projectsArray.push(project.dataValues);
        });
    }
    //completed projects
    else if (filter == "Completed") {
        // Get all the tasks asynchronously
        const projects = await Projects.findAll({
            where: {
                workspaceID: workspaceID,
                ProjectStatus: "Completed"
            }
        });
        // Extract task data and push to tasksArray
        projects.forEach(project => {
            projectsArray.push(project.dataValues);
        });
    }
    return projectsArray;
}

//Function to get the number of project Items that belong to a project
async function getProjectItems(projectID)
{
    //Get the project items
    const projectItems = await ProjectItems.findAll({
        where: {
            projectID: projectID
        }
    });
    return projectItems.length;
}

//Function to create the project HTML
async function createProjectHTML(project) {
    // Create elements
    const projectDiv = document.createElement('div');
    projectDiv.classList.add('project');
    const projectTitleDiv = document.createElement('div');
    projectTitleDiv.classList.add('projectTitle');
    const titleParagraph = document.createElement('p');
    titleParagraph.textContent = project.ProjectName;
    const projectContentDiv = document.createElement('div');
    projectContentDiv.classList.add('projectContent');
    const projectCardDiv = document.createElement('div');
    projectCardDiv.classList.add('projectCard');
    const cardHeaderDiv = document.createElement('div');
    cardHeaderDiv.classList.add('cardHeader');
    const headerParagraph = document.createElement('p');
    headerParagraph.textContent = 'Description';
    const cardBodyDiv = document.createElement('div');
    cardBodyDiv.classList.add('cardBody');
    const bodyParagraph = document.createElement('p');
    bodyParagraph.textContent = project.ProjectDescription;
    const cardFooterDiv = document.createElement('div');
    cardFooterDiv.classList.add('cardFooter');
    const statusParagraph = document.createElement('p');
    statusParagraph.textContent = `Status: ${project.ProjectStatus}`;
    const dueDateParagraph = document.createElement('p');
    dueDateParagraph.textContent = `Due Date: ${project.ProjectDueDate}`;
    const tasksParagraph = document.createElement('p');
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //Will get back to this after assigning tasks to projects
    const projectItems = await getProjectItems(project.projectID);
    tasksParagraph.textContent = `Tasks: ${projectItems}`;
    const cardButtonsDiv = document.createElement('div');
    cardButtonsDiv.classList.add('cardButtons');
    const editButton = document.createElement('button');
    editButton.classList.add('editButton');
    const editImage = document.createElement('img');
    editImage.src = 'Images/icons8-edit-50.png';
    editImage.alt = 'edit';
    editImage.classList.add('icon');
    editImage.setAttribute('value', project.projectID);
    editImage.addEventListener('click', editProject);
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('deleteButton');
    const deleteImage = document.createElement('img');
    deleteImage.src = 'Images/icons8-trash-24.png';
    deleteImage.alt = 'delete';
    deleteImage.classList.add('icon');
    deleteImage.setAttribute('value', project.projectID);
    deleteImage.addEventListener('click', deleteProject);
    const openImage = document.createElement('img');
    openImage.src = 'Images/icons8-open-30.png';
    openImage.alt = 'open';
    openImage.classList.add('icon');
    const openButton = document.createElement('button');
    openButton.classList.add('openButton');
    // openButton.textContent = 'Open';
    openButton.setAttribute('value', project.projectID);
    openButton.addEventListener('click', toggleKanban);
    // Append elements 
    openButton.appendChild(openImage);
    editButton.appendChild(editImage);
    deleteButton.appendChild(deleteImage);
    cardButtonsDiv.appendChild(openButton);
    cardButtonsDiv.appendChild(editButton);
    cardButtonsDiv.appendChild(deleteButton);
    cardHeaderDiv.appendChild(headerParagraph);
    cardBodyDiv.appendChild(bodyParagraph);
    cardFooterDiv.appendChild(statusParagraph);
    cardFooterDiv.appendChild(dueDateParagraph);
    cardFooterDiv.appendChild(tasksParagraph);
    cardFooterDiv.appendChild(cardButtonsDiv);
    projectCardDiv.appendChild(cardHeaderDiv);
    projectCardDiv.appendChild(cardBodyDiv);
    projectCardDiv.appendChild(cardFooterDiv);
    projectContentDiv.appendChild(projectCardDiv);
    projectTitleDiv.appendChild(titleParagraph);
    projectDiv.appendChild(projectTitleDiv);
    projectDiv.appendChild(projectContentDiv);
    return projectDiv;
}

//Function to edit a project
function editProject(event) {
    //Repurpose the project form to edit the project
    let id=event.target.getAttribute('value');
    //Get the task from the database
    Projects.findOne({
        where: {
            projectID: id
        }
    }).then(project => {
        //Get the form
        let form = document.getElementById("projectForm");
        //Get the form data
        let ProjectName = form.querySelector('input[name="projectName"]');
        let ProjectDescription = form.querySelector('textarea[name="projectDescription"]');
        let ProjectDueDate = form.querySelector('input[name="projectDueDate"]');
        let ProjectStatus = form.querySelector('select[name="projectStatus"]');
        //Set the form data
        ProjectName.value = project.ProjectName;
        ProjectDescription.value = project.ProjectDescription;
        ProjectDueDate.value = project.ProjectDueDate;
        ProjectStatus.value = project.ProjectStatus;
    });
    //Edit the function to save the task
    let saveButton = document.getElementById("saveProject");
    //Remove the existing event listener
    saveButton.removeEventListener('click', saveProject);
    saveButton.onclick = null;
    //Put the id as a value in the button
    saveButton.textContent="Edit Project";
    saveButton.setAttribute('value', id);
    saveButton.addEventListener('click', saveProjectEdit);
    //Show the form
    toggleProjectForm();
}


//Function to save the edited project
function saveProjectEdit(event) {
    //The id of the project to be edited
    let id = event.target.getAttribute('value');
    //Get the project name
    let projectName = document.getElementById('projectName').value;
    //Get the project description
    let projectDescription = document.getElementById('projectDescription').value;
    //Get the project deadline
    let projectDueDate = document.getElementById('projectDueDate').value;
    let pStatus=document.getElementById('projectStatus').value;
    //Update the task in the database
    Projects.update({
        ProjectName: projectName,
        ProjectDescription: projectDescription,
        ProjectDueDate: projectDueDate,
        ProjectStatus:pStatus,
    }, {
        where: {
            projectID: id
        }
    }).then(() => {
          console.log(`Project with ID ${id} updated`);
          loadProjects();
    });
    //Return the form to its original state
    resetProjectsForm();
    //Toggle the form
    toggleProjectForm();
    //Change the save button event listener back to the original
    let saveButton = document.getElementById("saveProject");
    //Remove all the event listeners
    saveButton.removeEventListener('click', saveProjectEdit);
    saveButton.onclick = null;
    saveButton.addEventListener('click', saveProject);
}

//Reset the "form"
function resetProjectsForm()
{
    //Get the project name
    let projectName = document.getElementById('projectName');
    //Get the project description
    let projectDescription = document.getElementById('projectDescription');
    //Get the project deadline
    let projectDueDate = document.getElementById('projectDueDate');
    let pStatus=document.getElementById('projectStatus');
    //Set the project name
    projectName.value = '';
    //Set the project description
    projectDescription.value = '';
    //Set the project deadline
    projectDueDate.value = '';
    pStatus.value = 'Not Started';
}

//Function to delete a project
function deleteProject(event) {
    let projectID = event.target.getAttribute('value');
    // Delete project with projectID
    Projects.destroy({
        where: {
            projectID: projectID
        }
    }).then(() => {
        console.log('Project deleted');
    });
    // Load projects
    loadProjects();
}

module.exports = {
    toggleProjects,
    toggleProjectForm,
    saveProject,
    loadProjects,
    deleteProject
}