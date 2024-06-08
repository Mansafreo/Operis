//Intermediary between the JS engine and the UI
//This file is responsible for handling the UI events and calling the appropriate functions in the JS engine
//Resolve the path for th Engine folder
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
    switchWorkspace
}= require(workspacePath);

window.onload = function() {
    generateCurrentMonth();
    setInterval(set_time, 1000);//Call the set_time function every 1000 milliseconds
    setInterval(set_date, 1000);//Call the set_time function every 1000 milliseconds
    //To make the dashboard active
    dashboard();
    //Load the workspace Name
    loadWorkspace();
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


