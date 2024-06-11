//Intermediary between the JS engine and the UI
//This file is responsible for handling the UI events and calling the appropriate functions in the JS engine
//Resolve the path for th Engine folder
const { log } = require('console');
const { get } = require('http');
const { resolve } = require('path');
//Calendar Module
const calendarPath = resolve(__dirname, '../Engine', 'calendar.js');//Relative to the HTML in the renderer process
const { 
    generateCalendar, 
    getMonthName,
    checkDate,
    generateCurrentMonth,
    nextMonth,
    previousMonth,
    replaceCalendarHead,
    toggleCalendar,
    createEventBubbles,
    createEventForm,
}= require(calendarPath);
//End of Calendar Module

//chrono Module
const chronoPath = resolve(__dirname, '../Engine', 'chrono.js');//Relative to the HTML in the renderer process
const { 
    set_time,
    set_date
}= require(chronoPath);
//End of chrono Module

//Event Module
const eventPath = resolve(__dirname, '../Engine', 'events.js');//Relative to the HTML in the renderer process
const { 
    saveEvent,
    addEvent,
    getEvent,
    deleteEvent,
    updateEvent,
    getEvents,
    toggleEventForm,
    showEventsForDay,
    toggleEventsBox,
    loadEventsDashboard
}= require(eventPath);

//Tasks Module
const tasksPath = resolve(__dirname, '../Engine', 'tasks.js');//Relative to the HTML in the renderer process
const { 
    toggleTasks,
    toggleTaskForm,
    saveTask,
    loadTasks,
    saveTaskEdit,
    deleteTask,
    loadTasksDashboard
}= require(tasksPath);

//Projects Module
const projectsPath = resolve(__dirname, '../Engine', 'projects.js');//Relative to the HTML in the renderer process
const { 
    toggleProjects,
    saveProject,
    loadProjects,
    saveProjectEdit,
    deleteProject,
    toggleProjectForm,
    loadProjectsDashboard,
}= require(projectsPath);   

//Kanban Module
const kanbanPath = resolve(__dirname, '../Engine', 'kanban.js');//Relative to the HTML in the renderer process
const { 
    toggleKanban,
    toggleProjectItemForm,
    saveProjectItem,
    closeKanban,
}= require(kanbanPath);

//Notes module
const notesPath=resolve(__dirname, '../Engine', 'notes.js')
const{
    toggleNotes,
    toggleSubjectForm,
    saveSubject,
    editSubject,
    toggleBookForm,
    saveBook,
    openBookForm,
    closeBook,
    openBook,
    editBook,
    liveKeys,
    closeEditor
}=require(notesPath)

//Timeline Module
const timelinePath = resolve(__dirname, '../Engine', 'timeline.js');//Relative to the HTML in the renderer process
const { 
    toggleTimeline,
}= require(timelinePath);

//Workspace Module
const workspacePath = resolve(__dirname, '../Engine', 'workspace.js');//Relative to the HTML in the renderer process
const {
    toggleSwitchWorkspace,
    loadWorkspace,
    createWorkspace,
    deleteWorkspace,
    switchWorkspace,
    getWorkspace
}= require(workspacePath);

//Auth Module
const authPath = resolve(__dirname, '../Engine', 'auth.js');//Relative to the HTML in the renderer process
const {
    register,
    verify,
    checkUser,
    login,
    checkAuth,
    logout,
    setWorkspace
}= require(authPath);

//sync Module
const syncPath = resolve(__dirname, '../Engine', 'sync.js');//Relative to the HTML in the renderer process
const {
    sync
}= require(syncPath);

window.onload = function() {
    generateCurrentMonth();
    setInterval(set_time, 1000);//Call the set_time function every 1000 milliseconds
    setInterval(set_date, 1000);//Call the set_time function every 1000 milliseconds
    //To make the dashboard active
    dashboard();
    //Load the workspace Name
    loadWorkspace();
    //login function
    registerForm();
    //
    codeForm();
    //
    LoginForm();
    //Check if the user is authenticated
    checkAuth();
    getWorkspace();
    //Set an interval for the sync function
    //About every 10 minutes
    setInterval(sync, 600000);

    setWorkspace();
}

function dashboard(){
    loadTasksDashboard();
    loadProjectsDashboard();
    loadEventsDashboard();
}

//Function to set everthing to none display
function home()
{
    let ids=[
        'kanban',
        'eventForm',
        'eventsBox',
        'taskForm',
        'subjectForm',
        'bookForm',
        'bookReader',
        'bookEditor',
        'timeline',
        'projectItemForm',
        'projectForm',
    ]
    let classes=[
        'projects',
        'calendar',
        'tasks',
        'notes',
    ]
    ids.forEach(id=>{
        document.getElementById(id).style.display='none'
    })
    classes.forEach(cl=>{
        let elements=document.getElementsByClassName(cl)
        for(let i=0;i<elements.length;i++){
            elements[i].style.display='none'
        }
    })
}

function registerForm()
{
    document.getElementById('registerForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // Clear previous errors
        document.getElementById('nameError').textContent = '';
        document.getElementById('emailError').textContent = '';
        document.getElementById('passwordError').textContent = '';

        let isValid = true;

        // Validate name
        const name = document.getElementById('name').value;
        if (name.length < 3) {
            isValid = false;
            document.getElementById('nameError').textContent = 'Name must be at least 3 characters long';
        }

        // Validate email
        const email = document.getElementById('email').value;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            isValid = false;
            document.getElementById('emailError').textContent = 'Invalid email format';
        }

        // Validate password
        const password = document.getElementById('password').value;
        if (password.length < 6) {
            isValid = false;
            document.getElementById('passwordError').textContent = 'Password must be at least 6 characters long';
        }

        if (isValid) {
            register();//Call the register function from the auth module
        }
        home()
    });
}

function LoginForm()
{
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        // Clear previous errors
        document.getElementById('lError').textContent = '';
        login();//Call the login function from the auth module
        home();
    });
}

function codeForm()
{
    document.getElementById('verifyForm').addEventListener('submit', function(event) {
        event.preventDefault();
        // Clear previous errors
        document.getElementById('codeError').textContent = '';
        // Validate code
        const code = document.getElementById('code').value;
        verify();//Call the verify function from the auth module
    });
}



//Function to exchange the register form with the login form
function switchForm()
{
    //If one is display none, make it display flex
    let login=document.getElementById('login');
    let registration=document.getElementById('registration');
    if(login.style.display==='none')
    {
        login.style.display='flex';
        registration.style.display='none';
    }
    else{
        login.style.display='none';
        registration.style.display='flex';
    }
    //If one is display flex, make it display none
}
