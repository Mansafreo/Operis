//module to handle calendar events in the UI
//Import the dialog module from electron
const { dialog } = require('electron');
//Import the generate calendar function from the calendar module
const { generateCalendar } = require('./calendar');
//Import the path module
const path = require('path');
const calendar = require('./calendar');
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
    //Get the workspaceID
    //Get the workspaceID of the authenticated user from the database
    let workspaceID=document.getElementById('workspaceID').value;
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
    //reset the "form" fields
    resetEventsForm();
    //To regenerate the calendar
    const calendarElement = document.getElementById('calendar');
    //Get the month and year
    let month = calendarElement.dataset.month;
    let year = calendarElement.dataset.year;
    //Generate the calendar
    generateCalendar(year, month);
     //Reload the dashboard
     loadEventsDashboard();
}

async function getEvents(date){
    let eventsArray=[];
    //Get the workspaceID
    //Get the workspaceID of the authenticated user from the database
    let workspaceID=document.getElementById('workspaceID').value;
    //Get the calendarID of the authenticated user from the database
    await Calendars.findOne({
        where: {
            workspaceID: workspaceID
        }
    }).then((calendar) => {
        calendarID=calendar.calendarID;
        return calendarID;
    });
    //Get the events for the date
    let events = await Events.findAll({
        where: {
            calendarID: calendarID,
            eventDate: date
        }
    }).then((events) => {
        eventsArray=events;
    });
    return eventsArray;
}

async function showEventsForDay(date)
{
    toggleEventsBox();
    //Get the events for that date
    let events =await  getEvents(date);
    let target = document.getElementById('eventsBox').querySelector('#events');
    //set the value attribute of the events box to the date
    let eventsBox = document.getElementById('eventsBox');
    eventsBox.setAttribute('value', date);
    //Clear the events box
    target.innerHTML = '';
    events.forEach(event => {
        //Create an event element
        let eventElement = createEventElement(event);
        //Append the event element to the events box
        target.appendChild(eventElement);
    });
}
function createEventElement(eventData) {
    eventData=eventData.dataValues;
    // Create main event container
    const eventDiv = document.createElement('div');
    eventDiv.classList.add('event');

    // Create event details container
    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('eventDetails');

    // Create time paragraph
    const timeP = document.createElement('p');
    timeP.classList.add('time');
    timeP.textContent = eventData.eventTime;

    // Create title paragraph
    const titleP = document.createElement('p');
    titleP.classList.add('title');
    titleP.textContent = eventData.eventTitle;

    // Create description paragraph
    const descriptionP = document.createElement('p');
    descriptionP.classList.add('description');
    descriptionP.textContent = eventData.eventDescription;

    // Append time, title, and description to details container
    detailsDiv.appendChild(timeP);
    detailsDiv.appendChild(titleP);
    detailsDiv.appendChild(descriptionP);

    // Create event actions container
    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('eventActions');

    // Create edit icon
    const editImg = document.createElement('img');
    editImg.src = 'Images/icons8-edit-50.png';
    editImg.alt = 'edit';
    editImg.id = eventData.eventID; // Assuming event object has an id property
    editImg.classList.add('edit');

    // Create delete icon
    const deleteImg = document.createElement('img');
    deleteImg.src = 'Images/icons8-trash-24.png';
    deleteImg.alt = 'delete';
    deleteImg.id = eventData.eventID; // Assuming event object has an id property
    deleteImg.classList.add('delete');
    // Add event listeners to edit and delete icons
    editImg.addEventListener('click', editEvent);
    deleteImg.addEventListener('click', deleteEvent);
    //Set an attribute to the edit and delete to store the eventID
    editImg.setAttribute('value', eventData.eventID);
    deleteImg.setAttribute('value', eventData.eventID);

    // Append edit and delete icons to actions container
    actionsDiv.appendChild(editImg);
    actionsDiv.appendChild(deleteImg);

    // Append details container and actions container to main event container
    eventDiv.appendChild(detailsDiv);
    eventDiv.appendChild(actionsDiv);

    return eventDiv;
}

function toggleEventsBox() {
    const eventsBox = document.getElementById('eventsBox');
    if (eventsBox.style.display === 'none' || eventsBox.style.display === '') {
        eventsBox.style.display = 'block';
    } else if (eventsBox.style.display === 'block'){
        eventsBox.style.display = 'none';
    }
    else{
        eventsBox.style.display = 'none';
    }
}

function addEvent(){
    toggleEventForm();
}
async function editEvent(event) {
    let eventID = event.target.getAttribute('value');
    console.log(eventID);
    // Get the event from the database
    let eventItem = await Events.findOne({
        where: {
            eventID: eventID
        }
    });
    // Extract the data values
    eventItem = eventItem.dataValues;
    // Set the event data in the form
    document.getElementById('eventTitle').value = eventItem.eventTitle;
    document.getElementById('eventDescription').value = eventItem.eventDescription;
    document.getElementById('eventDate').value = eventItem.eventDate;
    document.getElementById('eventTime').value = eventItem.eventTime;
    // Show the event form
    toggleEventForm();
    // Change the form button to update
    let formButton = document.getElementById('saveEvent');
    formButton.textContent = 'Edit Event';
    // Remove the event listener from the form button
    formButton.removeAttribute('onclick');
    formButton.removeEventListener('click', saveEvent);
    // Add an event listener to the form button
    formButton.addEventListener('click', updateEvent);
    //put the value of the eventID in the form button
    formButton.setAttribute('value', eventID);

    //Togggle the eventsbox
    toggleEventsBox();//hide the events box
}


async function deleteEvent(event)
{
    let eventID = event.target.getAttribute('value');
    //Delete the event from the database
        await Events.destroy({
            where: {
                eventID: eventID
            }
    });
    //Remove the event from the UI
    event.target.parentElement.parentElement.remove();
    //toggle the events box
    toggleEventsBox();
    //To regenerate the calendar
    const calendarElement = document.getElementById('calendar');
    //Get the month and year
    let month = calendarElement.dataset.month;
    let year = calendarElement.dataset.year;
    //Generate the calendar
    generateCalendar(year, month);
    //Reload the dashboard
    loadEventsDashboard();
}

async function updateEvent(event)
{
    let id=event.target.getAttribute('value');
    let eventTitle = document.getElementById('eventTitle').value;
    let eventDescription = document.getElementById('eventDescription').value;
    let eventDate = document.getElementById('eventDate').value;
    let eventTime = document.getElementById('eventTime').value;
    let eventData= {
        title: eventTitle
        ,description: eventDescription
        ,date: eventDate
        ,time: eventTime
    }
    //Get the workspaceID of the authenticated user from the database
    let workspaceID=document.getElementById('workspaceID').value;
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
        eventTitle: eventData.title,
        eventDescription: eventData.description,
        eventDate: eventData.date,
        eventTime: eventData.time,
        calendarID: calendarID
    };
    // To save the event to the database
    await Events.update(newEvent,{
        where: {
            eventID: id // Assuming event object has an id property
        }
    });
    toggleEventForm();
    //Reset the form button text
    let formButton = document.getElementById('saveEvent');
    formButton.textContent='Save Event';
    //Remove the event listener from the form button
    formButton.removeEventListener('click',updateEvent);
    //Add an event listener to the form button
    formButton.addEventListener('click',saveEvent);
    //reset the "form" fields
    resetEventsForm();
     //Reload the dashboard
     loadEventsDashboard();
}

function resetEventsForm()
{
    document.getElementById('eventTitle').value='';
    document.getElementById('eventDescription').value='';
    document.getElementById('eventDate').value='';
    document.getElementById('eventTime').value='';
}

//function to get the ongoing projects
async function getCurrentEvents()
{
    //Get the workspace ID
    let workspaceID = document.getElementById('workspaceID').value;
    let currentDate=new Date();
    //Get the calendar attached to this workspace
    let calendarID
    const calendars=await Calendars.findOne({
        where:{
            workspaceID:workspaceID
        }
    }).then(calendar=>{
        calendarID=calendar.dataValues.calendarID;
    })
    // Get all the tasks asynchronously
    const events = await Events.findAll({
        where: {
            calendarID:calendarID,
            eventDate: currentDate
        }
    });
    // Create an empty array to store the events
    const eventsArray = [];
    // Loop through the events and push the data values to the events array
    events.forEach(event => {
        eventsArray.push(event.dataValues);
    });
    return eventsArray;
}
//Function to load the projects dashboard
async function loadEventsDashboard()
{
    let eventsContainer = document.getElementsByClassName("itemContent")[2];
    //Empty the container
    eventsContainer.innerHTML = '';
    //Function to generate the HTML for the tasks
    function generateHTML(data) {
            // Create a paragraph element
            const p = document.createElement('p');
            // Set the inner text to the subject
            p.innerText = data.eventTitle;
            // Return the constructed HTML element
            return p;
    }
   //Get all the events for the day
    const events = await getCurrentEvents();
    //Loop through the events and display them
    events.forEach(event => {
        // Create a new element
        const eventElement = generateHTML(event);
        // Append the element to the container
        eventsContainer.appendChild(eventElement);
    });
    //If there are no events
    if(events.length==0)
    {
        let p=document.createElement('p');
        p.textContent="No Events For today";
        eventsContainer.appendChild(p);
    }
}

//export the addEvent function
module.exports = {
    toggleEventForm
    ,addEvent,saveEvent,showEventsForDay,toggleEventsBox,
    loadEventsDashboard
}
