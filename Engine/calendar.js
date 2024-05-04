const path = require('path');//importing the path module
const { Op } = require('sequelize');//importing the Op object from the sequelize module
//Import the models module
const modelsPath = path.resolve(__dirname, '../Database', 'models.js');//Relative to the HTML in the renderer process
const {Events}=require(modelsPath);//importing the Events model from the models file
//file to create the content in the calendar page
async function generateCalendar(year, month) {
    const calendarElement = document.getElementById('calendar');
    //Add a value to the calendar element so we can keep track of the current month
    calendarElement.dataset.month = month;
    calendarElement.dataset.year = year;
    const daysInMonth = new Date(year, month, 0).getDate(); // Get total days in month
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay(); // Get first day of the month (0-6)
    // Clear previous content
    calendarElement.innerHTML = '';
    // Fill in days
    for (let i = 0; i < daysInMonth + firstDayOfMonth; i++) {
      const dayElement = document.createElement('div');
      dayElement.classList.add('day');
      if(checkDate(year, month, i - firstDayOfMonth + 1)) {
        dayElement.classList.add('today');
      }
      if (i >= firstDayOfMonth) {
        dayElement.textContent = i - firstDayOfMonth + 1;
      }
      calendarElement.appendChild(dayElement);
    }
    //Create the event bubbles
    createEventBubbles(year, month);
}
//Function to create Events Bubbles in the calendar
async function createEventBubbles(year, month) {
    let monthString=month;
    if(monthString<10)
    {
        monthString='0'+monthString.toString();
    }
    else{
        monthString=monthString.toString();
    }
    const events = await getEvents(year, monthString);
    //Get the content of the calendar
    const calendarElement = document.getElementById('calendar');
    //Get the days in the month
    let days=calendarElement.getElementsByClassName('day');
    //Loop through the days
    for(let i=0;i<days.length;i++)
    {
        //Get the day
        let day=days[i].textContent;
        //Check if the day is empty
        if(day.length>0)
        {
            let day_string=day;
            if(day_string<10)
            {
                day_string='0'+day_string.toString();
            }
            else{
                day_string=day_string.toString();
            }
            //Get the date in the form yyyy-mm-dd
            let date=`${year}-${monthString}-${day_string}`;
            //Get the events for the day
            let dayEvents=events.filter((event)=>event.eventDate==date);
            if(dayEvents.length==0)
            {
                continue;
            }
            //Create a div to hold the number of events on that day
            const eventCountElement = document.createElement('div');
            eventCountElement.setAttribute('onclick', `showEventsForDay('${date}')`);
            eventCountElement.classList.add('event-count');
            //Set the event count to 0
            eventCountElement.textContent = dayEvents.length;
            //Append the event count to the day
            days[i].appendChild(eventCountElement);
        }
    }
}
async function getEvents(year, month) {
    // Dates are stored in the form yyyy-mm-dd
    try {
        const events = await Events.findAll({
            where: {
                eventDate: {
                    [Op.startsWith]: `${year}-${month}`
                }
            }
        });
        return events;
    } catch (error) {
        console.error("Error fetching events:", error);
        return [];
    }
}
function getMonthName(month) {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month - 1];
}

function checkDate(year, month, day) {
    //Check if the given date is the current date
    const currentDate = new Date();
    return currentDate.getFullYear() === year && currentDate.getMonth() === month - 1 && currentDate.getDate() === day;
}
function generateCurrentMonth() {
    //Get the current year and month
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    generateCalendar(currentYear, currentMonth);
    replaceCalendarHead();
}
//Function to handle the next month button click
function nextMonth() {
   //get current year and month from the calendar element
   let calendarElement = document.getElementById('calendar');
   let currentYear = parseInt(calendarElement.dataset.year);
   let currentMonth = parseInt(calendarElement.dataset.month);
    if (currentMonth === 12) {
        currentMonth = 1;
        currentYear++;
    } else {
        currentMonth++;
    }
    console.log(currentYear);
    generateCalendar(currentYear, currentMonth);
    replaceCalendarHead();
}
//Function to handle the previous month button click
function previousMonth() {
    //get current year and month from the calendar element
    let calendarElement = document.getElementById('calendar');
    let currentYear = parseInt(calendarElement.dataset.year);
    let currentMonth = parseInt(calendarElement.dataset.month);
    if (currentMonth === 1) {
        currentYear--;
        currentMonth = 12;
    } else {
        currentMonth--;
    } 
    generateCalendar(currentYear, currentMonth);
    replaceCalendarHead();
}
//To replace the name of the month in the UI
function replaceCalendarHead() {
    let calendarElement = document.getElementById('calendar');
    let currentYear = parseInt(calendarElement.dataset.year);
    let currentMonth = parseInt(calendarElement.dataset.month);
    let monthName = getMonthName(currentMonth);
    document.getElementById('Month').querySelector("h2").textContent = monthName;
    //set the year
    document.getElementById('Year').querySelector("h2").textContent = currentYear;
}

function toggleCalendar() {
    const calendarElement = document.getElementsByClassName('calendar')[0];
    if (calendarElement.style.display === 'none' || calendarElement.style.display === '') {
        generateCurrentMonth();
        calendarElement.style.display = 'block';
    } else {
        calendarElement.style.display = 'none';
    }
}


module.exports={
    generateCalendar:generateCalendar,//exporting the function
    getMonthName:getMonthName,//exporting the function
    checkDate:checkDate,//exporting the function
    generateCurrentMonth:generateCurrentMonth,//exporting the function
    nextMonth:nextMonth,//exporting the function
    previousMonth:previousMonth,//exporting the function
    replaceCalendarHead:replaceCalendarHead,//exporting the function
    toggleCalendar:toggleCalendar//exporting the function
}