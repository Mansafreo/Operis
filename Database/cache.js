//A cache managing file to minimise requent access to the database
//Require the path module
const path = require('path');
//Require the models from the models.js file
let modelsPath = path.resolve(__dirname,'models.js');
const { Workspaces,Tasks ,Calendars} = require(modelsPath);
//Require the cache module
const NodeCache = require('node-cache');
const { get } = require('http');
//Get the workspaceID from the database where the workspaceType is 'Personal'
function getWorkspaceID()
{
    return Workspaces.findOne({
        where: {
            workspaceType: 'Personal'
        }
    });
}
//Create a cache object
let cache = new NodeCache();
//Get the workspace ID from the database
getWorkspaceID().then(workspace=>{
    //Set the workspaceID in the cache
    cache.set("workspaceID",workspace.workspaceID);
    //set the user ID in the cache
    cache.set("userID",workspace.userID);
});

//Export the cache object
module.exports = {
    cache
};