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
}= require(projectsPath);   

window.onload = function() {
    generateCurrentMonth();
    setInterval(set_time, 1000);//Call the set_time function every 1000 milliseconds
    setInterval(set_date, 1000);//Call the set_time function every 1000 milliseconds
    toggleProjects();
}

