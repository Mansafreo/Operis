const path = require('path');
const { where ,Op} = require('sequelize');
let modelsPath = path.resolve(__dirname,'../Database' ,'models.js');
const models = require(modelsPath);
//The function to fetch the data from the database
async function fetchTimelineData() {
    try {
        // Get the workspaceID from the hidden input field
        const workspaceID = document.getElementById("workspaceID").value;
        console.log('Workspace ID:', workspaceID);

        // Get the calendar associated with the workspace
        const calendar = await models.Calendars.findOne({
            where: {
                workspaceID: workspaceID
            }
        });
        if (!calendar) {
            console.error('No calendar found for the given workspaceID');
            return;
        }
        const calendarID = calendar.dataValues.calendarID;
        console.log('Calendar ID:', calendarID);

        // Get the tasks associated with the workspace
        const tasks = await models.Tasks.findAll({
            where: {
                workspaceID: workspaceID
            }
        });
        console.log('Tasks:', tasks);

        // Get the events associated with the calendar
        const events = await models.Events.findAll({
            attributes: ['eventTitle', 'eventDescription', 'eventDate', 'eventTime'],
            where: {
                calendarID: calendarID
            }
        });
        console.log('Events:', events);

        // Get the projects associated with the workspace
        const projects = await models.Projects.findAll({
            where: {
                workspaceID: workspaceID
            }
        });
        console.log('Projects:', projects);

        // Extract project IDs
        const projectIDs = projects.map(project => project.dataValues.projectID);
        console.log('Project IDs:', projectIDs);

        // Fetch the project items associated with the projects
        const projectItems = await models.ProjectItems.findAll({
            where: {
                projectID: {
                    [Op.in]: projectIDs
                }
            }
        });
        console.log('Project Items:', projectItems);

        // Return the data object with the data values
        return {
            tasks: tasks.map(task => task.dataValues),
            events: events.map(event => event.dataValues),
            projects: projects.map(project => project.dataValues),
            projectItems: projectItems.map(item => item.dataValues)
        };
    } catch (error) {
        console.error('Error fetching timeline data:', error);
    }
}


function renderTimeline(data) {
    const timeline = document.getElementById('timeline');
    // Clear the timeline before rendering
    timeline.innerHTML = '';
    for (const date in data) {
        //Check if the date is today
        const today = new Date();
        const dateParts = date.split('-');
        const timelineDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      
        const tile = document.createElement('div');
        tile.className = 'tile';
        if (today.toDateString() === timelineDate.toDateString()) {
            //Add a todayTimeline class to the tile
            tile.classList.add('todayTimeline');
        }
        const dateTitle = document.createElement('h2');
        dateTitle.textContent = date;
        tile.appendChild(dateTitle);

        if (data[date].tasks.length > 0) {
            const taskSection = document.createElement('div');
            taskSection.className = 'section';
            const taskTitle = document.createElement('h3');
            taskTitle.textContent = 'Tasks';
            taskSection.appendChild(taskTitle);
            data[date].tasks.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.className = 'item';
                taskItem.textContent = `${task.Title} - ${task.Description} [${task.Status}, Priority: ${task.Priority}]`;
                taskSection.appendChild(taskItem);
            });
            tile.appendChild(taskSection);
        }

        if (data[date].events.length > 0) {
            const eventSection = document.createElement('div');
            eventSection.className = 'section';
            const eventTitle = document.createElement('h3');
            eventTitle.textContent = 'Events';
            eventSection.appendChild(eventTitle);
            data[date].events.forEach(event => {
                const eventItem = document.createElement('div');
                eventItem.className = 'item';
                eventItem.textContent = `${event.eventTitle} - ${event.eventDescription} [${event.eventTime}]`;
                eventSection.appendChild(eventItem);
            });
            tile.appendChild(eventSection);
        }

        if (data[date].projects.length > 0) {
            const projectSection = document.createElement('div');
            projectSection.className = 'section';
            const projectTitle = document.createElement('h3');
            projectTitle.textContent = 'Projects';
            projectSection.appendChild(projectTitle);
            data[date].projects.forEach(project => {
                const projectItem = document.createElement('div');
                projectItem.className = 'item';
                projectItem.textContent = `${project.ProjectName} - ${project.ProjectDescription} [${project.Projectstatus}]`;
                projectSection.appendChild(projectItem);
            });
            tile.appendChild(projectSection);
        }

        if (data[date].projectItems.length > 0) {
            const projectItemSection = document.createElement('div');
            projectItemSection.className = 'section';
            const projectItemTitle = document.createElement('h3');
            projectItemTitle.textContent = 'Project Items';
            projectItemSection.appendChild(projectItemTitle);
            data[date].projectItems.forEach(item => {
                const projectItem = document.createElement('div');
                projectItem.className = 'item';
                projectItem.textContent = `${item.Title} - ${item.Content} [${item.Status}]`;
                projectItemSection.appendChild(projectItem);
            });
            tile.appendChild(projectItemSection);
        }

        timeline.appendChild(tile);
    }
}
function groupByDate(data) {
    const grouped = {};

    data.tasks.forEach(task => {
        const date = task.DueDate;
        if (!grouped[date]) grouped[date] = { tasks: [], events: [], projects: [], projectItems: [] };
        grouped[date].tasks.push(task);
    });

    data.events.forEach(event => {
        const date = event.eventDate;
        if (!grouped[date]) grouped[date] = { tasks: [], events: [], projects: [], projectItems: [] };
        grouped[date].events.push(event);
    });

    data.projects.forEach(project => {
        const date = project.ProjectDueDate;
        if (!grouped[date]) grouped[date] = { tasks: [], events: [], projects: [], projectItems: [] };
        grouped[date].projects.push(project);
    });

    data.projectItems.forEach(item => {
        const date = item.DueDate;
        if (!grouped[date]) grouped[date] = { tasks: [], events: [], projects: [], projectItems: [] };
        grouped[date].projectItems.push(item);
    });

    // Sort grouped items by date
    const sortedGrouped = {};
    Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b)).forEach(date => {
        sortedGrouped[date] = grouped[date];
    });

    return sortedGrouped;
}


async function loadTimeline() {
    const data = await fetchTimelineData();
    console.log('Timeline Data:', data);
    const grouped = groupByDate(data);
    renderTimeline(grouped);
    
    // Scroll to the div with 'todayTimeline' class if it exists with smooth scrolling
    const todayTimeline = document.querySelector('.todayTimeline');
    if (todayTimeline) {
        todayTimeline.scrollIntoView({ behavior: 'smooth' });
    }
}


//Function to toggle the timeline
function toggleTimeline() {
    const timeline = document.getElementById('timeline');
    if (timeline.style.display === 'none' || timeline.style.display === '' || timeline.style.display === 'undefined') {
        timeline.style.display = 'grid';
    } else {
        timeline.style.display = 'none';
    }
    loadTimeline();
}

module.exports = {
    toggleTimeline
};