//module to handle calendar events in the UI

//Import the path module
const path = require('path');
//Import the models module
const modelsPath = path.resolve(__dirname, '../Database', 'models.js');
const {
    Users,
    Workspaces,
    Calendars,
    Events
}= require(modelsPath);

//Function to toggle the event form
function toggleEventForm(){
    //Get the eventForm
    let eventForm = document.getElementById('eventForm');
    //Toggle the eventForm display property
    if(eventForm.style.display=='none' || eventForm.style.display=='')
    {
        eventForm.style.display='block';
    }
    else
    {
        eventForm.style.display='none';
    }
}

async function saveEvent()
{
    let eventTitle = document.getElementById('eventTitle').value;
    if(eventTitle.length==0)
    {
        console.log("Please enter the event title");
        return;
    }
    let eventDescription = document.getElementById('eventDescription').value;
    let eventDate = document.getElementById('eventDate').value;
    if(eventDate.length==0)
    {
        console.log("Please enter the event date");
        return;
    }
    let eventTime = document.getElementById('eventTime').value;
    let event = {
        title: eventTitle
        ,description: eventDescription
        ,date: eventDate
        ,time: eventTime
    }
    //Get the authenticated User
    let userID=await Users.findOne({
        where: {
            verified: true
        }
    }).then((user) => {
        return user.userID;
    });
    //Get the type of workspace
    let workspaceType=document.getElementById('workspaceType').value;
    //Get the workspaceID
    //Get the workspaceID of the authenticated user from the database
    let workspaceID;
    await Workspaces.findOne({
        where: {
            userID: userID,
            workspaceType: workspaceType
        }
    }).then((workspace) => {
        workspaceID=workspace.workspaceID;
        return workspaceID;
    });
    //To get the calendarID that belongs to the workspace
    let calendarID;
    //Get the calendarID of the authenticated user from the database
    await Calendars.findOne({
        where: {
            workspaceID: workspaceID
        }
    }).then((calendar) => {
        calendarID=calendar.calendarID;
        return calendarID;
    });
    console.log(calendarID);
    //To create a new event object
    // To create a new event object
    let newEvent = {
        eventTitle: event.title,
        eventDescription: event.description,
        eventDate: event.date,
        eventTime: event.time,
        calendarID: calendarID
    };
    // To save the event to the database
    await Events.create(newEvent)
    toggleEventForm();
}

function showEventsForDay(date)
{
    console.log(date);
}

function addEvent(){
    toggleEventForm();
}

//export the addEvent function
module.exports = {
    toggleEventForm
    ,addEvent,saveEvent,showEventsForDay
}
