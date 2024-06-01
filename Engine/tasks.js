//Require the models from the models.js file
//Import the path module
const path = require('path');
let modelsPath = path.resolve(__dirname,'../Database' ,'models.js');
const { Workspaces,Tasks } = require(modelsPath);
//Import the sequelize operators
const { Op } = require('sequelize');
//Function to toggle Tasks view
function toggleTasks()
{
    //Toggle the visibility of the tasks view
    let element = document.getElementsByClassName("tasks")[0];
    if (element.style.display === "none" || element.style.display=='')
    {
        element.style.display = "block";
    }
    else
    {
        element.style.display = "none";
    }
    setTimeout(loadTasks, 1000);
}

function toggleTaskForm()
{
    //Select the form
    let form = document.getElementById("taskForm");
    //Toggle the visibility of the form
    if (form.style.display === "none" || form.style.display=='')
    {
        form.style.display = "block";
    }
    else
    {
        form.style.display = "none";
    }
}

function saveTask()
{
    //Get the form
    let form = document.getElementById("taskForm");
    let WID = document.getElementById("workspaceID").value;
    //Get the form data
    let taskTitle = form.querySelector('input[name="taskTitle"]').value;
    let taskDescription = form.querySelector('textarea[name="taskDescription"]').value;
    let taskDueDate = form.querySelector('input[name="taskDueDate"]').value;
    let taskDate = form.querySelector('input[name="taskDate"]').value;
    let taskStatus = form.querySelector('select[name="taskStatus"]').value;
    let taskPriority = form.querySelector('select[name="taskPriority"]').value;
    let data={
        taskTitle: taskTitle,
        taskDescription: taskDescription,
        taskDueDate: taskDueDate,
        taskDate: taskDate,
        taskStatus: taskStatus,
        taskPriority: taskPriority
    }
    //Create a new task
    Tasks.create({
        Title: data.taskTitle,
        Description: data.taskDescription,
        DueDate: data.taskDueDate,
        Date: data.taskDate,
        Status: data.taskStatus,
        Priority: data.taskPriority,
        workspaceID: WID//Get the workspaceID from the DOM
    }).then(task => {
        console.log(`Task created\n ${task}`);
    });
    //Return the form to its original state
    resetForm();
    //Toggle the form
    toggleTaskForm();
    //Reload the tasks
    loadTasks();
}

//To retreive tasks from the database
async function getTasks() {
    try {
        let WID = document.getElementById("workspaceID").value;
        let tasksArray = [];
        // Get the filter value so we can filter the tasks
        let filter = document.getElementById("taskFilter").value;
        
        if (filter == "All") {
            // Get all the tasks asynchronously
            const tasks = await Tasks.findAll({
                where: {
                    workspaceID: WID
                }
            });
            
            // Extract task data and push to tasksArray
            tasks.forEach(task => {
                tasksArray.push(task.dataValues);
            });
        }
        
        if(filter=="For_Today")
        {
                // Get all the tasks asynchronously
                const tasks = await Tasks.findAll({
                    where: {
                        workspaceID: WID,
                        //Date is in YYYY-MM-DD format
                        Date: new Date()
                    }
                });
                
                // Extract task data and push to tasksArray
                tasks.forEach(task => {
                    tasksArray.push(task.dataValues);
                });
        }
        if(filter=="Overdue")
        {
                //The tasks here should have a due date that is less than the current date and not be completed
                //Get all the tasks asynchronously
                const tasks = await Tasks.findAll({
                    where: {
                        workspaceID: WID,
                        DueDate: {
                            [Op.lt]: new Date()
                        },
                        Status: {
                            [Op.ne]: "Completed"
                        }
                    }
                });
                tasks.forEach(task => {
                    tasksArray.push(task.dataValues);
                });
        }
        if(filter=="Completed")
        {
                // Get all the tasks asynchronously
                const tasks = await Tasks.findAll({
                    where: {
                        workspaceID: WID,
                        Status: "Completed"
                    }
                });
                
                // Extract task data and push to tasksArray
                tasks.forEach(task => {
                    tasksArray.push(task.dataValues);
                });
        }
        if(filter=="Not_Started")
        {
                // Get all the tasks asynchronously
                const tasks = await Tasks.findAll({
                    where: {
                        workspaceID: WID,
                        Status: "Not Started"
                    }
                });
                
                // Extract task data and push to tasksArray
                tasks.forEach(task => {
                    tasksArray.push(task.dataValues);
                });
        }
        if(filter=="In_Progress")
        {
                // Get all the tasks asynchronously
                const tasks = await Tasks.findAll({
                    where: {
                        workspaceID: WID,
                        Status: "In Progress"
                    }
                });
                
                // Extract task data and push to tasksArray
                tasks.forEach(task => {
                    tasksArray.push(task.dataValues);
                });
        }
        if(filter=="High_Priority")
        {
                // Get all the tasks asynchronously
                const tasks = await Tasks.findAll({
                    where: {
                        workspaceID: WID,
                        Priority: "High"
                    }
                });
                
                // Extract task data and push to tasksArray
                tasks.forEach(task => {
                    tasksArray.push(task.dataValues);
                });
        }
        if(filter=="Medium_Priority")
        {
                // Get all the tasks asynchronously
                const tasks = await Tasks.findAll({
                    where: {
                        workspaceID: WID,
                        Priority: "Medium"
                    }
                });
                
                // Extract task data and push to tasksArray
                tasks.forEach(task => {
                    tasksArray.push(task.dataValues);
                });
        }
        if(filter=="Low_Priority")
        {
                // Get all the tasks asynchronously
                const tasks = await Tasks.findAll({
                    where: {
                        workspaceID: WID,
                        Priority: "Low"
                    }
                });
                
                // Extract task data and push to tasksArray
                tasks.forEach(task => {
                    tasksArray.push(task.dataValues);
                });
        }
        if(filter=="This_Month")
        {
                // Get all the tasks asynchronously
                const tasks = await Tasks.findAll({
                    where: {
                        workspaceID: WID,
                        DueDate: {
                            [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                            [Op.lte]: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
                        }
                    }
                });
                
                // Extract task data and push to tasksArray
                tasks.forEach(task => {
                    tasksArray.push(task.dataValues);
                });
        }
        if(filter=="Due_Today")
        {
                // Get all the tasks asynchronously
                const tasks = await Tasks.findAll({
                    where: {
                        workspaceID: WID,
                        DueDate: new Date()
                    }
                });
                
                // Extract task data and push to tasksArray
                tasks.forEach(task => {
                    tasksArray.push(task.dataValues);
                });
        }
        return tasksArray;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}



async function loadTasks()
{   
    let taskContainer = document.getElementById("tasks");
    let loading=document.createElement('h2');
    loading.textContent="Loading...";
    loading.style.textAlign="center";
    loading.style.marginTop="20px";
    loading.style.color="white";
    loading.style.fontFamily="Arial, sans-serif";
    loading.style.fontSize="20px";
    taskContainer.appendChild(loading);
    //Get the tasks
    let tasks = await getTasks();
    //Get the html element that contains the tasks
   
    //clear the tasks
    taskContainer.innerHTML = "";
    //Loop through the tasks
    tasks.forEach(task => {
        //Create a task element
        let taskElement = createTaskElement(task);
        //Append the task element to the task container
        taskContainer.appendChild(taskElement);
    });

    //To also update what is displayed in the dashboard
    loadTasksDashboard();
}

function createTaskElement(task) {
    // Create main task container
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task');
    // Create task title container and paragraph
    const titleDiv = document.createElement('div');
    titleDiv.classList.add('taskTitle');
    const titleP = document.createElement('p');
    titleP.textContent = task.Title;
    titleDiv.appendChild(titleP);
    // Create task content container and paragraphs
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('taskContent');
    const importanceP = document.createElement('p');
    importanceP.textContent = `Priority: ${task.Priority}`;
    importanceP.style.fontWeight = 'bold';
    importanceP.classList.add(`priority-${task.Priority}`);
    const descriptionP = document.createElement('p');
    descriptionP.textContent = `Description: ${task.Description}`;
    const dueDateP = document.createElement('p');
    dueDateP.textContent = `Due Date: ${task.DueDate}`;
    const statusP = document.createElement('p');
    statusP.textContent = `Status: ${task.Status}`;
    let statusFlag=task.Status[0].toLowerCase();
    statusP.classList.add(`status-${statusFlag}`);
    contentDiv.appendChild(importanceP);
    contentDiv.appendChild(descriptionP);
    contentDiv.appendChild(dueDateP);
    contentDiv.appendChild(statusP);
    // Create task actions container and images
    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('taskActions');
    const editImg = document.createElement('img');
    editImg.src = 'Images/icons8-edit-50.png';
    editImg.alt = 'edit';
    //add the ID of the task to the edit button
    editImg.id = task.taskID;
    editImg.classList.add('icon');
    editImg.onclick = editTask;
    const deleteImg = document.createElement('img');
    deleteImg.src = 'Images/icons8-trash-24.png';
    deleteImg.alt = 'delete';
    //add the ID of the task to the delete button
    deleteImg.id = task.taskID;
    deleteImg.classList.add('icon');
    deleteImg.onclick = deleteTask;
    actionsDiv.appendChild(editImg);
    actionsDiv.appendChild(deleteImg);
    // Append all elements to main task container
    taskDiv.appendChild(titleDiv);
    taskDiv.appendChild(contentDiv);
    taskDiv.appendChild(actionsDiv);
    return taskDiv;
}

function editTask(event) {
    //This is a bit more complex than the deleteTask function
    //We need to load the task data into the form
    let id=event.target.id;
    //Get the task from the database
    Tasks.findOne({
        where: {
            taskID: id
        }
    }).then(task => {
        //Get the form
        let form = document.getElementById("taskForm");
        //Get the form data
        let taskTitle = form.querySelector('input[name="taskTitle"]');
        let taskDescription = form.querySelector('textarea[name="taskDescription"]');
        let taskDueDate = form.querySelector('input[name="taskDueDate"]');
        let taskDate = form.querySelector('input[name="taskDate"]');
        let taskStatus = form.querySelector('select[name="taskStatus"]');
        let taskPriority = form.querySelector('select[name="taskPriority"]');
        //Set the form data
        taskTitle.value = task.Title;
        taskDescription.value = task.Description;
        taskDueDate.value = task.DueDate;
        taskDate.value = task.Date;
        taskStatus.value = task.Status;
        taskPriority.value = task.Priority;
    });
    //Edit the function to save the task
    let saveButton = document.getElementById("saveTask");
    //Remove the existing event listener
    saveButton.onclick = null;
    //Put the id as a value in the button
    saveButton.setAttribute('value', id);
    saveButton.addEventListener('click', saveTaskEdit);
    //Show the form
    toggleTaskForm();
}

function saveTaskEdit(event) {
    let id=event.target.getAttribute('value');
    //Get the form
    let form = document.getElementById("taskForm");
    //Get the form data
    let taskTitle = form.querySelector('input[name="taskTitle"]').value;
    let taskDescription = form.querySelector('textarea[name="taskDescription"]').value;
    let taskDueDate = form.querySelector('input[name="taskDueDate"]').value;
    let taskDate = form.querySelector('input[name="taskDate"]').value;
    let taskStatus = form.querySelector('select[name="taskStatus"]').value;
    let taskPriority = form.querySelector('select[name="taskPriority"]').value;
    let data={
        taskTitle: taskTitle,
        taskDescription: taskDescription,
        taskDueDate: taskDueDate,
        taskDate: taskDate,
        taskStatus: taskStatus,
        taskPriority: taskPriority
    }
    //Update the task in the database
    Tasks.update({
        Title: data.taskTitle,
        Description: data.taskDescription,
        DueDate: data.taskDueDate,
        Date: data.taskDate,
        Status: data.taskStatus,
        Priority: data.taskPriority
    }, {
        where: {
            taskID: id
        }
    }).then(() => {
        console.log(`Task with ID ${id} updated`);
        loadTasks();
    });
    //Return the form to its original state
    resetForm();
    //Toggle the form
    toggleTaskForm();
    //Change the save button event listener back to the original
    let saveButton = document.getElementById("saveTask");
    //Remove all the event listeners
    saveButton.removeEventListener('click', saveTaskEdit);
    saveButton.onclick = null;
    saveButton.addEventListener('click', saveTask);
}
function deleteTask(event) {
    //Use a confirm dialog to confirm the deletion
    let confirmDelete = confirm("Are you sure you want to delete this task? This is permanent.");
    if (confirmDelete) {
    let id=event.target.id;
    //To delete the task from the database
    Tasks.destroy({
        where: {
            taskID: id
        }
    }).then(() => {
        console.log(`Task with ID ${id} deleted`);
        loadTasks();
    });
    }
}

function resetForm() {
    //Get the form
    let form = document.getElementById("taskForm");
    //clear all the input fields
    //This is not an actual form reset so we have to do it manually
    form.querySelector('input[name="taskTitle"]').value = "";
    form.querySelector('textarea[name="taskDescription"]').value = "";
    form.querySelector('input[name="taskDueDate"]').value = "";
    form.querySelector('input[name="taskDate"]').value = "";
    form.querySelector('select[name="taskStatus"]').value = "";
}

//Function to get all tasks due today
async function getTasksForToday()
{
    let dueTasks = [];
    //Get the workspace ID
    let WID = document.getElementById("workspaceID").value;
    //Get the current date
    let currentDate = new Date();
    //Get the tasks that are due today
    await Tasks.findAll({
        where: {
            workspaceID: WID,
            DueDate: currentDate
        }
    }).then(tasks => {
        tasks.forEach(task => {
            dueTasks.push(task.dataValues);
        });
    });
    return dueTasks;
}
//Function to dynamically set the tasks in the dashboard
async function loadTasksDashboard()
{
    let taskContainer = document.getElementsByClassName("itemContent")[0];
    //Empty the container
    taskContainer.innerHTML = "";
    //Function to generate the HTML for the tasks
    function generateHTML(data) {
            // Create a paragraph element
            const p = document.createElement('p');
            // Set the inner text to the subject
            p.innerText = data.Title;
            // Create a line break
            const br = document.createElement('br');
            p.appendChild(br);
            // Create a span element with class "urgency"
            const urgencySpan = document.createElement('span');
            urgencySpan.className = 'urgency';
            // Create a span element for priority
            const prioritySpan = document.createElement('span');
            prioritySpan.className = 'priority';
            prioritySpan.innerText = `Priority:${data.Priority}`;
            // Create a span element for time
            const timeSpan = document.createElement('span');
            timeSpan.className = 'time';
            timeSpan.innerText = `Due:${data.DueDate}`;
            // Append priority and time spans to the urgency span
            urgencySpan.appendChild(prioritySpan);
            urgencySpan.appendChild(timeSpan);
            // Append the urgency span to the paragraph
            p.appendChild(urgencySpan);
            // Return the constructed HTML element
            return p;
    }
   //Get all the tasks due today
    let tasks = await getTasksForToday();
    //Loop through the tasks
    tasks.forEach(task => {
        //Create a task element
        let taskElement = generateHTML(task);
        //Append the task element to the task container
        taskContainer.appendChild(taskElement);
    });
    if(tasks.length==0)
    {
        let p=document.createElement('p');
        p.textContent="No tasks due today";
        taskContainer.appendChild(p);
    }
}

module.exports = {
    toggleTasks,
    toggleTaskForm,
    saveTask,
    loadTasks,
    saveTaskEdit,
    deleteTask,
    loadTasksDashboard
};