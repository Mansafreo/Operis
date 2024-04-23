//file to create the content in the calendar page
function generateCalendar(year, month) {
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
   const calendarElement = document.getElementById('calendar');
   const currentYear = parseInt(calendarElement.dataset.year);
   let currentMonth = parseInt(calendarElement.dataset.month);
    if (currentMonth === 12) {
        currentMonth = 1;
    } else {
        currentMonth++;
    }
    
    generateCalendar(currentYear, currentMonth);
    replaceCalendarHead();
}
//Function to handle the previous month button click
function previousMonth() {
    //get current year and month from the calendar element
    const calendarElement = document.getElementById('calendar');
    const currentYear = parseInt(calendarElement.dataset.year);
    let currentMonth = parseInt(calendarElement.dataset.month);
    if (currentMonth === 1) {
        currentMonth = 12;
    } else {
        currentMonth--;
    } 
    generateCalendar(currentYear, currentMonth);
    replaceCalendarHead();
}
//To replace the name of the month in the UI
function replaceCalendarHead() {
    const calendarElement = document.getElementById('calendar');
    const currentYear = parseInt(calendarElement.dataset.year);
    let currentMonth = parseInt(calendarElement.dataset.month);
    let monthName = getMonthName(currentMonth);
    document.getElementById('Month').querySelector("h2").textContent = monthName;
}

function toggleCalendar() {
    const calendarElement = document.getElementsByClassName('calendar')[0];
    if (calendarElement.style.display === 'none') {
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