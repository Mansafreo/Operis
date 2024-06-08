const path = require('path');
const modelsPath = path.resolve(__dirname, '../Database', 'models.js');
const {Workspaces,Users,Calendars}=require(modelsPath);
//Import the calendar module
const calendarPath = path.resolve(__dirname, 'calendar.js');
const calendar=require(calendarPath);
//Function to get all workspaces from the database
function getWorkspace()
{
   //Get the "Default" workspace
    Workspaces.findOne({
         where:{
              workspaceName:'Default'
         }
    }).then(workspace=>{
        document.getElementById('workspaceID').value=workspace.workspaceID;
         return workspace.dataValues.workspaceID;
    }).catch(err=>{
         console.log(err)
    })
}

async function getWorkspaces()
{
    return Workspaces.findAll().then(workspaces=>{
        return workspaces
    }).catch(err=>{
        console.log(err)
    })
}

async function deleteWorkspace()
{
    //check if the workspace is the Default workspace
    let workspace=document.getElementsByClassName('switchWorkspace')[0];
    let workspaceOptions=workspace.getElementsByTagName('select')[0];
    let workspaceID=workspaceOptions.value;
    //check if the workspace is the default workspace
    Workspaces.findOne({
        where:{
            workspaceID:workspaceID
        }
    }).then(workspace=>{
        if(workspace.dataValues.workspaceName=='Default')
        {
            let wmessage=document.getElementById('workspaceMessage');
            wmessage.innerText='Cannot Delete Default Workspace';
            return;
        }
        else{
            completeDeletion(workspaceID);
        }
    }).catch(err=>{
        console.log(err)
    })
    function completeDeletion(workspaceID){
    //Delete the workspace and associated calendars
    calendar.deleteCalendar(workspaceID);
    //Delete the workspace
    Workspaces.destroy({
        where:{
            workspaceID:workspaceID
        }
    }).then(workspace=>{
        let wmessage=document.getElementById('workspaceMessage');
        wmessage.innerText='Workspace Deleted';
        createWorkspaceOptions();//Create the workspace options
    }).catch(err=>{
        console.log(err)
    })
    }
}
//Function to dynamically create workspace options
async function createWorkspaceOptions()
{
    let workspace=document.getElementsByClassName('switchWorkspace')[0];
    let workspaceOptions=workspace.getElementsByTagName('select')[0];
    workspaceOptions.innerHTML='';//Clear the workspace options
    let workspaces=await getWorkspaces();
    workspaces.forEach(workspace=>{
        let option=document.createElement('option');
        option.className='workspaceOption';
        option.value=workspace.dataValues.workspaceID;
        option.innerText=workspace.dataValues.workspaceName;
        workspaceOptions.appendChild(option);
    })
}

function  toggleSwitchWorkspace(){
    let workspace=document.getElementsByClassName('switchWorkspace')[0];
    if(workspace.style.display=='none'){
        workspace.style.display='flex'
        createWorkspaceOptions();//Create the workspace options
    }else{
        workspace.style.display='none'
        let wmessage=document.getElementById('workspaceMessage');
        wmessage.innerText='';//Clear the message
    }
}

function loadWorkspace()
{
    //Get the first workspace from the database
    Workspaces.findOne().then(workspace=>{
        let workspaceName=workspace.dataValues.workspaceName;
        document.getElementsByClassName('cworkspaceName')[0].innerText=workspaceName;
    }).catch(err=>{
        console.log(err)
    })
}
//Function to get the userID from the database
async function getUserID()
{
    return Users.findOne().then(user=>{
        return user.dataValues.userID
    }).catch(err=>{
        console.log(err)
    })
}

async function createWorkspace()
{
    let wmessage=document.getElementById('workspaceMessage');
    wmessage.innerText='';//Clear the message
    let userID=await getUserID();
    //Get the workspace name
    let workspaceName=document.getElementById('workspaceNameInput').value;
    //Check if the workspace name is already in the database
    Workspaces.findOne({
        where:{
            workspaceName:workspaceName
        }
    }).then(workspace=>{
        if(workspace==null){
            Workspaces.create({
                workspaceName:workspaceName,
                workspaceType:'Personal',
                userID:userID
            }).then(workspace=>{
                wmessage.innerText='Workspace Created';
                createWorkspaceOptions();//Create the workspace options
                //Create a calendar for the workspace
                Calendars.create({
                    workspaceID:workspace.dataValues.workspaceID
                }).then(calendar=>{
                    wmessage.innerHTML+='<br> Calendar Created';
                }).catch(err=>{
                    console.log(err)
                })
            }).catch(err=>{
                console.log(err)
            })
        }else{
            wmessage.innerText='Workspace Name Already Exists';
        }
    }).catch(err=>{
        console.log(err)
    })
}

async function  getCurrentWorkspace()
{
    let workspace=document.getElementsByClassName('switchWorkspace')[0];
    let workspaceName=workspace.getElementsByClassName('workspaceName')[0].innerText;
    return Workspaces.findOne({
        where:{
            workspaceName:workspaceName
        }
    }).then(workspace=>{
        return workspace
    }).catch(err=>{
        console.log(err)
    })
}

function switchWorkspace()
{
    //To switch the workspace
    let workspace=document.getElementsByClassName('switchWorkspace')[0];
    let workspaceOptions=workspace.getElementsByTagName('select')[0];
    let workspaceID=workspaceOptions.value;
    //Set the workspaceId in the hidden input
    let workspaceIdInput=document.getElementById('workspaceID');
    workspaceIdInput.value=workspaceID;
    let workspaceName=workspaceOptions.options[workspaceOptions.selectedIndex].text;
    let cworkspaceName=document.getElementsByClassName('cworkspaceName')[0];
    cworkspaceName.innerText=workspaceName;
    //Close the workspace options
    toggleSwitchWorkspace();
    //call the dashboard function
    dashboard();
}

module.exports={
    toggleSwitchWorkspace,
    loadWorkspace,
    createWorkspace,
    getCurrentWorkspace,
    deleteWorkspace,
    switchWorkspace,
    getWorkspace
}