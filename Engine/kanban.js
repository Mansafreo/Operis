//File to manage the kanban board for a particular project

//Importing the required modules

//Import the models
const { ProjectItems } = require('../Database/models');

//Function to toggle the kanban board
function toggleKanban(event){
    //Get the kanban board
    const kanban = document.querySelector('#kanban');
    //Toggle the kanban board
    kanban.classList.toggle('hide');
    //Set the value of the kanban to the id of the project
    let projectID=event.target.value;
    kanban.setAttribute('value', projectID);
    //Load the project items
    loadProjectItems(projectID);
}

function closeKanban(){
    //Get the kanban board
    const kanban = document.querySelector('#kanban');
    //Toggle the kanban board
    kanban.classList.toggle('hide');
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
    const kanbanElement = document.querySelector('#kanban');
    if (!kanbanElement) {
        console.error('No element with id "kanban" found');
        return;
    }
    const projectIdNum= kanbanElement.getAttribute('value');
    if (!projectIdNum) {
        console.error('No value attribute found on #kanban element');
        return;
    }
    const parsedProjectId = parseInt(projectIdNum);
    if (isNaN(parsedProjectId)) {
        console.error(`Unable to parse projectId "${projectIdNum}" to an integer`);
        return;
    }
    let projectItemData={   
        Title: title,
        Content: description,
        Status:status,
        DueDate: dueDate,
        //Make the projectID an int
        id: parseInt(projectIdNum),
    }
    //Check if any of the fields in projectItemData is empty
    for(let key in projectItemData){
        if(projectItemData[key] === '' || projectItemData[key] == null){
            console.log('Please fill all the fields');
            return;
        }
    }
    //Save the project item
    await ProjectItems.create({
        Title: projectItemData.Title,
        Content: projectItemData.Content,
        DueDate: projectItemData.DueDate,
        Status: projectItemData.Status,
        projectID: projectItemData.id
    });
    //Get the project item form
    projectItemForm.style.display = 'none';
    //Load the project items
    loadProjectItems(parsedProjectId);
}

//Function to create the HTML for a kanban item
function createKanbanCard(data) {
    // Create the main card div
    const kanbanCard = document.createElement('div');
    kanbanCard.className = 'kanbanCard';
    // Create and append the card header
    const cardHeader = document.createElement('div');
    cardHeader.className = 'cardHeader';
    const headerP = document.createElement('p');
    headerP.textContent = data.Title;
    cardHeader.appendChild(headerP);
    kanbanCard.appendChild(cardHeader);
    // Create and append the card body
    const cardBody = document.createElement('div');
    cardBody.className = 'cardBody';
    const bodyP = document.createElement('p');
    bodyP.textContent = data.Content;
    cardBody.appendChild(bodyP);
    kanbanCard.appendChild(cardBody);
    // Create and append the card footer
    const cardFooter = document.createElement('div');
    cardFooter.className = 'cardFooter';
    const statusP = document.createElement('p');
    statusP.textContent = `Status: ${data.Status}`;
    cardFooter.appendChild(statusP);
    const dueDateP = document.createElement('p');
    dueDateP.textContent = `Due Date: ${data.DueDate}`;
    cardFooter.appendChild(dueDateP);
    // Create and append the card buttons
    const cardButtons = document.createElement('div');
    cardButtons.className = 'cardButtons';
    const editButton = document.createElement('button');
    editButton.className = 'editButton';
    editButton.textContent = 'Edit';
    //Set the value of the edit button to the itemID
    editButton.onclick = 
    ()=> {
         editProjectItem(data.itemID);//editProjectItem(this);
    };
    cardButtons.appendChild(editButton);
    const deleteButton = document.createElement('button');
    deleteButton.className = 'deleteButton';
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('value', data.projectID);
    deleteButton.onclick = function() { deleteProjectItem(data.itemID); };
    cardButtons.appendChild(deleteButton);
    const promoteButton = document.createElement('button');
    promoteButton.className = 'promoteButton';
    promoteButton.textContent = 'Promote';
    promoteButton.onclick = function() {
         promoteProjectItem(data.itemID);
    };
    if(data.Status === 'completed'){
        promoteButton.textContent = 'Completed';
        promoteButton.disabled = true;
        promoteButton.style.backgroundColor = 'black';
    }
    cardButtons.appendChild(promoteButton);
    cardFooter.appendChild(cardButtons);
    kanbanCard.appendChild(cardFooter);
    return kanbanCard;
}
//Function to get all the projectItems from the database
async function getProjectItems(projectID){
    let projectItems = await ProjectItems.findAll({
        where: {
            projectID: projectID
        }
    }).then((projectItems) => {
        return projectItems;
    });
    return projectItems;
}


//Function to load the project items to the UI
async function loadProjectItems(){
    const kanbanElement = document.querySelector('#kanban');
    if (!kanbanElement) {
        console.error('No element with id "kanban" found');
        return;
    }
    const projectIdNum= kanbanElement.getAttribute('value');
    //Step 1 get the project items
    let projectItems = await getProjectItems(projectIdNum);
    //Sort them into the respective columns
    let todo = [];
    let inProgress = [];
    let completed = [];
    projectItems.forEach((projectItem) => {
        if(projectItem.Status === 'to do'){
            todo.push(projectItem.dataValues);
        }else if(projectItem.Status === 'in progress'){
            inProgress.push(projectItem.dataValues);
        }else if(projectItem.Status === 'completed'){
            completed.push(projectItem.dataValues);
        }
    });
    //Get the columns
    const kanbanItems=document.querySelector('#kanbanItems');
    const todoColumn = kanbanItems.querySelector('.toDoItems');
    const inProgressColumn = kanbanItems.querySelector('.inProgressItems');
    const completedColumn = kanbanItems.querySelector('.completedItems');
    //Clear the columns
    todoColumn.innerHTML = '';
    inProgressColumn.innerHTML = '';
    completedColumn.innerHTML = '';
    //Load the project items
    todo.forEach((projectItem) => {
        todoColumn.appendChild(createKanbanCard(projectItem));
    });
    inProgress.forEach((projectItem) => {
        inProgressColumn.appendChild(createKanbanCard(projectItem));
    });
    completed.forEach((projectItem) => {
        completedColumn.appendChild(createKanbanCard(projectItem));
    });
}


//To promote a project item
async function promoteProjectItem(id){
    //Get the project item
    let projectItemID = id;
    //Get the project item
    let projectItem = await ProjectItems.findOne({
        where: {
            itemID: projectItemID
        }
    });
    //Promote the project item
    if(projectItem.Status === 'to do'){
        await ProjectItems.update({
            Status: 'in progress'
        }, {
            where: {
                itemID: projectItemID
            }
        });
    }else if(projectItem.Status === 'in progress'){
        await ProjectItems.update({
            Status: 'completed'
        }, {
            where: {
                itemID: projectItemID
            }
        });
    }
    //Load the project items
    loadProjectItems();
}
//To delete a project item
async function deleteProjectItem(id){
    //Get the project item
    let projectItemID = id;
    //Delete the project item
    await ProjectItems.destroy({
        where: {
            itemID: projectItemID
        }
    });
    //Load the project items
    loadProjectItems();
}

//Function to edit a project item
function editProjectItem(id){
   //Step 1-> Get the projectItemForm
   //step 2-> Get the projectItem from the database
   //step 3-> Set the values of the projectItemForm to the projectItem
   //step 4-> Show the projectItemForm
   //Step 5-> Change the save button to an edit button
   //Step 6-> Change the onclick function of the save button to editProjectItem
  //Step 7-> Set the value of the save button to the itemID

  const projectItemForm = document.querySelector('#projectItemForm');
  //Get the project item
    let projectItemID = id;
    //Get the projectItem from the database
    ProjectItems.findOne({
        where: {
            itemID: projectItemID
        }
    }).then((projectItem) => {
        //Set the values of the projectItemForm to the projectItem
        projectItemForm.querySelector('#kanbanTitle').value = projectItem.dataValues.Title;
        projectItemForm.querySelector('#kanbanDescription').value = projectItem.dataValues.Content;
        projectItemForm.querySelector('#kanbanStatus').value = projectItem.dataValues.Status;
        projectItemForm.querySelector('#kanbanDueDate').value = projectItem.dataValues.DueDate;
    });
    //Show the projectItemForm
    projectItemForm.style.display = 'flex';
    //Change the save button to an edit button
    const saveButton = projectItemForm.querySelector('#saveProjectItem');
    saveButton.textContent = 'Edit';
    //Change the onclick function of the save button to editProjectItem
    saveButton.onclick = function() { editProjectItemData(projectItemID); };
    //Set the value of the save button to the itemID
    saveButton.setAttribute('value', projectItemID);
}

//To edit the project item
async function editProjectItemData(id){
    //Get the project item form
    const projectItemForm = document.querySelector('#projectItemForm');
    //Get the project item form elements
    const title = projectItemForm.querySelector('#kanbanTitle').value;
    const description = projectItemForm.querySelector('#kanbanDescription').value;
    const status = projectItemForm.querySelector('#kanbanStatus').value;
    const dueDate = projectItemForm.querySelector('#kanbanDueDate').value;
    let projectItemData={   
        Title: title,
        Content: description,
        Status:status,
        DueDate: dueDate,
        itemID: id
    }
    //Check if any of the fields in projectItemData is empty
    for(let key in projectItemData){
        if(projectItemData[key] === '' || projectItemData[key] == null){
            console.log('Please fill all the fields');
            return;
        }
    }
    //Edit the project item
    await ProjectItems.update({
        Title: projectItemData.Title,
        Content: projectItemData.Content,
        DueDate: projectItemData.DueDate,
        Status: projectItemData.Status,
    }, {
        where: {
            itemID: projectItemData.itemID
        }
    });
    //Get the project item form
    projectItemForm.style.display = 'none';
    //Load the project items
    loadProjectItems();
    //Return the project item form to its original state
    const saveButton = projectItemForm.querySelector('#saveProjectItem');
    saveButton.textContent = 'Save';
    saveButton.onclick = saveProjectItem;
    saveButton.removeAttribute('value');
    projectItemForm.querySelector('#kanbanTitle').value = '';
    projectItemForm.querySelector('#kanbanDescription').value = '';
    projectItemForm.querySelector('#kanbanStatus').value = '';
    projectItemForm.querySelector('#kanbanDueDate').value = '';
}

module.exports = {
    toggleKanban,
    toggleProjectItemForm,
    saveProjectItem,
    loadProjectItems,
    promoteProjectItem,
    deleteProjectItem,
    editProjectItem,
    editProjectItemData,
    closeKanban
}