//A js module to generate reports based on completed tasks/projects
//Import the path module
const path = require('path');
//Import the fs module
const fs = require('fs');
//Get the path to the models file
let modelsPath = path.resolve(__dirname,'../Database' ,'models.js');
const {
    Tasks,
    Projects,
    ProjectItems,
    Subjects,
    Notes,
    Events,
    Calendars
}= require(modelsPath);
//Import the sequelize module
const sequelize = require('sequelize');
let chartInstances = {};
function drawCharts(sampleData)
{
const SubjectNames = sampleData.subjectNames; // Example subjects
const projectNames =sampleData.projectNames; // Example projects
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; // Months
// Create charts
const ctxTasksCompleted = document.getElementById('tasksCompletedChart').getContext('2d');
const ctxProjectsCompleted = document.getElementById('projectsCompletedChart').getContext('2d');
const ctxOutstandingTasksProjects = document.getElementById('outstandingTasksProjectsChart').getContext('2d');
const ctxNotesCreated = document.getElementById('notesCreatedChart').getContext('2d');
const ctxAverageBooksPerSubject = document.getElementById('averageBooksPerSubjectChart').getContext('2d');
const ctxAverageTaskCompletionTime = document.getElementById('averageTaskCompletionTimeChart').getContext('2d');
const ctxAverageItemsInProject = document.getElementById('averageItemsInProjectChart').getContext('2d');
const ctxBooksPerSubject = document.getElementById('booksPerSubjectChart').getContext('2d');
const ctxTasksPerProject = document.getElementById('tasksPerProjectChart').getContext('2d');
const ctxTasksPerMonth = document.getElementById('tasksPerMonthChart').getContext('2d');
const ctxEventsPerMonth = document.getElementById('eventsPerMonthChart').getContext('2d');

// Tasks Completed Chart
chartInstances['tasksCompletedChart']=new Chart(ctxTasksCompleted, {
    type: 'bar',
    data: {
        labels: ['Tasks Completed'],
        datasets: [{
            label: 'Tasks Completed',
            data: [sampleData.tasksCompleted],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Projects Completed Chart
chartInstances['projectsCompletedChart']=new Chart(ctxProjectsCompleted, {
    type: 'bar',
    data: {
        labels: ['Projects Completed'],
        datasets: [{
            label: 'Projects Completed',
            data: [sampleData.projectsCompleted],
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Outstanding Tasks/Projects Chart
chartInstances['outstandingTasksProjectsChart']=new Chart(ctxOutstandingTasksProjects, {
    type: 'bar',
    data: {
        labels: ['Outstanding Tasks', 'Outstanding Projects'],
        datasets: [{
            label: 'Outstanding Items',
            data: [sampleData.outstandingTasks, sampleData.outstandingProjects],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 206, 86, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Notes Created Chart
chartInstances['notesCreatedChart']=new Chart(ctxNotesCreated, {
    type: 'bar',
    data: {
        labels: ['Notes Created'],
        datasets: [{
            label: 'Notes Created',
            data: [sampleData.notesCreated],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

//Add the books per subject and find the average
let totalBooks=0;
sampleData.booksPerSubject.forEach(book=>totalBooks+=book);
averageBooks=totalBooks/sampleData.booksPerSubject.length;

// Average Books per Subject Chart
chartInstances['averageBooksPerSubjectChart']=new Chart(ctxAverageBooksPerSubject, {
    type: 'bar',
    data: {
        labels: ['Average Books per Subject'],
        datasets: [{
            label: 'Average Books per Subject',
            data: [averageBooks],
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Average Task Completion Time Chart
chartInstances['averageTaskCompletionTimeChart']=new Chart(ctxAverageTaskCompletionTime, {
    type: 'bar',
    data: {
        labels: ['Average Task Completion Time (days)'],
        datasets: [{
            label: 'Average Task Completion Time',
            data: [sampleData.averageTaskCompletionTime],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Average Items in Project Chart
chartInstances['averageItemsInProjectChart']=new Chart(ctxAverageItemsInProject, {
    type: 'bar',
    data: {
        labels: ['Average Items in Project'],
        datasets: [{
            label: 'Average Items in Project',
            data: [sampleData.averageItemsInProject],
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Books per Subject Chart
chartInstances['booksPerSubjectChart']=new Chart(ctxBooksPerSubject, {
    type: 'bar',
    data: {
        labels: SubjectNames,
        datasets: [{
            label: 'Books per Subject',
            data: sampleData.booksPerSubject,
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Tasks per Project Chart
chartInstances['tasksPerProjectChart']=new Chart(ctxTasksPerProject, {
    type: 'bar',
    data: {
        labels: projectNames,
        datasets: [{
            label: 'Tasks per Project',
            data: sampleData.tasksPerProject,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Tasks per Month Chart
chartInstances['tasksPerMonthChart']=new Chart(ctxTasksPerMonth, {
    type: 'line',
    data: {
        labels: months,
        datasets: [{
            label: 'Tasks per Month',
            data: sampleData.tasksPerMonth,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: true
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Events per Month Chart
chartInstances['eventsPerMonthChart']=new Chart(ctxEventsPerMonth, {
    type: 'line',
    data: {
        labels: months,
        datasets: [{
            label: 'Events per Month',
            data: sampleData.eventsPerMonth,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            fill: true
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
}

const { Op, fn, col } = require('sequelize');

async function fetchSummaryData(workspaceID) {
    // Tasks completed
    const tasksCompleted = await ProjectItems.count({
        include: [{
            model: Projects,
            where: { workspaceID: workspaceID }
        }],
        where: {
            Status: 'completed'
        }
    });

    // Projects completed
    const projectsCompleted = await Projects.count({
        where: {
            workspaceID: workspaceID,
            ProjectStatus: 'completed'
        }
    });

    // Outstanding tasks
    const outstandingTasks = await ProjectItems.count({
        include: [{
            model: Projects,
            where: { workspaceID: workspaceID }
        }],
        where: {
            Status: { [Op.ne]: 'completed' }
        }
    });

    // Outstanding projects
    const outstandingProjects = await Projects.count({
        where: {
            workspaceID: workspaceID,
            ProjectStatus: { [Op.ne]: 'completed' }
        }
    });

    // Notes created
    const notesCreated = await Notes.count({
        include: [{
            model: Subjects,
            where: { workspaceID: workspaceID }
        }]
    });

    // Average books per subject
    const subjectsCount = await Subjects.count({ where: { workspaceID: workspaceID } });
    const averageBooksPerSubject = subjectsCount ? notesCreated / subjectsCount : 0;

    // Average task completion time
    const completedTasks = await ProjectItems.findAll({
        include: [{
            model: Projects,
            where: { workspaceID: workspaceID }
        }],
        where: {
            Status: 'completed'
        }
    });
    const totalCompletionTime = completedTasks.reduce((sum, task) => {
        const createdDate = new Date(task.createdAt);
        const dueDate = new Date(task.DueDate);
        const completionTime = (dueDate - createdDate) / (1000 * 60 * 60 * 24); // in days
        return sum + completionTime;
    }, 0);
    const averageTaskCompletionTime = completedTasks.length ? totalCompletionTime / completedTasks.length : 0;

    // Average items in a project
    const projects = await Projects.findAll({
        where: { workspaceID: workspaceID },
        include: [ProjectItems]
    });
    const totalItems = projects.reduce((sum, project) => sum + project.ProjectItems.length, 0);
    const averageItemsInProject = projects.length ? totalItems / projects.length : 0;

    // Books per subject
    const booksPerSubject = await Subjects.findAll({
        where: { workspaceID: workspaceID },
        include: [Notes]
    }).then(subjects => subjects.map(subject => subject.Notes.length));

    // Tasks per project
    const tasksPerProject = await Projects.findAll({
        where: { workspaceID: workspaceID },
        include: [ProjectItems]
    }).then(projects => projects.map(project => project.ProjectItems.length));

    // Tasks per month
    const tasksPerMonth = await ProjectItems.findAll({
        include: [{
            model: Projects,
            where: { workspaceID: workspaceID }
        }],
        attributes: [
            [fn('strftime', '%Y-%m', col('DueDate')), 'month'],
            [fn('count', col('itemID')), 'count']
        ],
        group: 'month'
    }).then(tasks => {
        const counts = Array(12).fill(0);
        tasks.forEach(task => {
            const month = new Date(task.get('month') + '-01').getMonth();
            counts[month] = task.get('count');
        });
        return counts;
    });

    // Events per month
    const eventsPerMonth = await Events.findAll({
        include: [{
            model: Calendars,
            where: { workspaceID: workspaceID }
        }],
        attributes: [
            [fn('strftime', '%Y-%m', col('eventDate')), 'month'],
            [fn('count', col('eventID')), 'count']
        ],
        group: 'month'
    }).then(events => {
        const counts = Array(12).fill(0);
        events.forEach(event => {
            const month = new Date(event.get('month') + '-01').getMonth();
            counts[month] = event.get('count');
        });
        return counts;
    });
    //get the names of the subjects and put it in an array
    const subjectNames=[];
    await Subjects.findAll({
        where: { workspaceID: workspaceID }
    }).then((subjects=>{
        subjects.forEach(subject => {
            subject=subject.dataValues;
            subjectNames.push(subject.name);
        })
    }));

    //get the names of the projects and put it in an array
    const projectNames=[];
    await Projects.findAll({
        where: { workspaceID: workspaceID }
    }).then((projects=>{
        projects.forEach(project => {
            project=project.dataValues;
            projectNames.push(project.ProjectName);
        })
    }));

    // Return the sample data
    return {
        tasksCompleted,
        projectsCompleted,
        outstandingTasks,
        outstandingProjects,
        notesCreated,
        averageBooksPerSubject,
        averageTaskCompletionTime,
        averageItemsInProject,
        booksPerSubject,
        tasksPerProject,
        tasksPerMonth,
        eventsPerMonth,
        subjectNames,
        projectNames
    };
}

//Function to toggle the display of the report
function toggleReports()
{
    let report=document.getElementById('reports');
    if(report.style.display==='none' || report.style.display==='' || report.style.display===null || report.style.display===undefined)
    {
        report.style.display='flex';
        generateReports();
    }
    else
    {
        report.style.display='none';
    }
}

function clearCanvas() {
    const reportSection = document.getElementById('reports');
    const canvases = reportSection.getElementsByTagName('canvas');

    Array.from(canvases).forEach(canvas => {
        if (chartInstances[canvas.id]) {
            chartInstances[canvas.id].destroy();
            delete chartInstances[canvas.id];
        }
    });
}
//function to fetch data from the database and draw the charts
async function generateReports()
{
    clearCanvas();
    //Destroy the previous charts
    let report=document.getElementById('reports');
    //Get all elements with the class 'chart-container' then empty the canvas
    let charts=report.getElementsByClassName('chart-container');
    for(let i=0;i<charts.length;i++)
    {
        let canvas=charts[i].getElementsByTagName('canvas');
        if(canvas.length>0)
        {
            canvas[0].innerHTML='';
        }
    }
    //get the workspaceID
    let workspaceID=document.getElementById('workspaceID').value;
    let summaryData=await fetchSummaryData(workspaceID);
    drawCharts(summaryData);
}

module.exports = {
    drawCharts,
    fetchSummaryData,
    toggleReports,
    generateReports
};