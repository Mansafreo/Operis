//module to handle calendar events in the UI

//Import the path module
const path = require('path');
//Import the models module
const modelsPath = path.resolve(__dirname, '../Database', 'models.js');
const models = require(modelsPath);

//Function to toggle the event form
function toggleEventForm(){
    //Get the eventForm
    let eventForm = document.getElementById('eventForm');
    //Toggle the eventForm display property
    eventForm.style.display = eventForm.style.display === 'none' ? 'block' : 'none';
}

async function saveEvent()
{
    let eventTitle = document.getElementById('eventTitle').value;
    let eventDescription = document.getElementById('eventDescription').value;
    let eventDate = document.getElementById('eventDate').value;
    let eventTime = document.getElementById('eventTime').value;
    let event = {
        title: eventTitle
        ,description: eventDescription
        ,date: eventDate
        ,time: eventTime
    }
    //Get the authenticated User
    let userID;
    await models.user.getUser().then((user) => {
        userID=user[0].userID;
       return userID;
    });
    //Get the type of workspace
    let workspaceType=document.getElementById('workspaceType').value;
    //Get the workspaceID
    let workspaceID;
    await models.workspace.getWorkspace(workspaceType,userID).then((workspace) => {
        workspaceID=workspace[0].workspaceID;
        return workspaceID;
    });
    //To get the calendarID that belongs to the workspace
    let calendarID;
    await models.calendar.getCalendar(workspaceID).then((calendar) => {
        calendarID=calendar[0].calendarID;
        return calendarID;
    });
    console.log(calendarID);
    //To create a new event object
    let newEvent = new models.event(calendarID,userID,event.date,event.time,event.description,event.title);
    //To set the event properties
    console.log(newEvent);
    //To save the event
    newEvent.save();
}

function addEvent(){
    toggleEventForm();
}

//export the addEvent function
module.exports = {
    toggleEventForm
    ,addEvent,saveEvent
}
