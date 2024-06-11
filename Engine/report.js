//A js module to generate reports based on completed tasks/projects
//Import the path module
const path = require('path');
//Import the fs module
const fs = require('fs');
//Get the path to the models file
let modelsPath = path.resolve(__dirname,'../Database' ,'models.js');
const models= require(modelsPath);

//Function to generate a report based on the completed tasks
function generateTaskReport(){
    //Get the completed tasks
    models.Task.find({status: 'completed'}, function(err, tasks){
        if(err){
            console.log(err);
        }else{
            //Create a report file
            let reportPath = path.resolve(__dirname, 'reports', 'taskReport.txt');
            let report = fs.createWriteStream(reportPath);
            //Write the report header
            report.write('Task Report\n');
            report.write('Task Name, Task Description, Task Status\n');
            //Write the tasks to the report
            tasks.forEach(function(task){
                report.write(task.name + ',' + task.description + ',' + task.status + '\n');
            });
            //Close the report file
            report.end();
        }
    });
}