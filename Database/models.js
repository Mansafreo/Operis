//Use sequelize to define the model for the database
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const dbPath = path.resolve(__dirname, 'database.db');
// Initialize Sequelize with SQLite dialect
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
});
//Users Model
const Users = sequelize.define('User', {
    //Primary Key
    userID: {
        type: DataTypes.INTEGER,
        primaryKey: true,      // Make 'id' the primary key
        autoIncrement: true    // Enable auto-increment
    },
    // Model attributes are defined here
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});
//Workspace Model
const Workspaces = sequelize.define('Workspace', {
    //Primary Key
    workspaceID: {
        type: DataTypes.INTEGER,
        primaryKey: true,      // Make 'id' the primary key
        autoIncrement: true    // Enable auto-increment
    },
    // Model attributes are defined here
    workspaceType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    //workspacename
    workspaceName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    //Foreign Key
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});
//Calendar Model
const Calendars = sequelize.define('Calendar', {
    calendarID: {
        type: DataTypes.INTEGER,
        primaryKey: true,      // Make 'id' the primary key
        autoIncrement: true    // Enable auto-increment
    },
    //Foreign Key
    workspaceID: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});
//Events Model
const Events = sequelize.define('Event', {
    eventID: {
        type: DataTypes.INTEGER,
        primaryKey: true,      // Make 'id' the primary key
        autoIncrement: true    // Enable auto-increment
    },
    // Model attributes are defined here
    eventTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    eventDescription: {
        type: DataTypes.STRING,
        allowNull: false
    },
    eventDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    eventTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    //Foreign Key
    calendarID: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});
//Create the tasks model
//[taskID, Title, Description, DueDate, Date, Status, workspaceID]
const Tasks = sequelize.define('Task', {
    taskID: {
        type: DataTypes.INTEGER,
        primaryKey: true,      // Make 'id' the primary key
        autoIncrement: true    // Enable auto-increment
    },
    Title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    DueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    Date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    Status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Priority:{
        type: DataTypes.STRING,
        allowNull: false
    },
    //Foreign Key
    workspaceID: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

//sync the model with the database
function sync() {
    sequelize.sync()
        .then(() => {
            console.log('Database & tables created!');
        }).catch(err => {
            console.error('Error creating tables', err);
    });
}
//Create a sample user
function createUser() {
    Users.create({
        username: 'admin',
        password: 'admin',
        verified: true
    }).then(user => {
        console.log('User created');
    });
}
//Create a sample workspace
function createWorkspace() {
    Workspaces.create({
        workspaceType: 'Personal',
        userID: 1
    }).then(workspace => {
        console.log('Workspace created');
    });
}
//Create a sample calendar
function createCalendar() {
    Calendars.create({
        workspaceID: 1
    }).then(calendar => {
        console.log('Calendar created');
    });
}

//Create the projects
const Projects = sequelize.define('Project', {
    projectID: {
        type: DataTypes.INTEGER,
        primaryKey: true,      // Make 'id' the primary key
        autoIncrement: true    // Enable auto-increment
    },
    // Model attributes are defined here
    ProjectName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ProjectDescription: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ProjectDueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    ProjectStatus: {
        type: DataTypes.STRING,
        allowNull: false
    },
    //Foreign Key
    workspaceID: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

//Model for Project Items
const ProjectItems=sequelize.define('ProjectItem',{
    itemID:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    Title:{
        type:DataTypes.STRING,
        allowNull:false
    },
    Content:{
        type:DataTypes.STRING,
        allowNull:false
    },
    DueDate:{
        type:DataTypes.DATEONLY,
        allowNull:false
    },
    Status:{
        type:DataTypes.STRING,
        allowNull:false
    },
    //Foreign Key
    projectID:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
});
//Declare the subjects model
/*
subject[
    subjectID pk
    name
    description
]
*/
const Subjects = sequelize.define('Subject', {
    subjectID: {
        type: DataTypes.INTEGER,
        primaryKey: true,      // Make 'id' the primary key
        autoIncrement: true    // Enable auto-increment
    },
    // Model attributes are defined here
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    //Foreign Key
    workspaceID: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

//A model for the books AKA Notes
/*
Notes[
    Pk noteID
    name
    storageLocation
    FK subjectID
]
*/
const Notes=sequelize.define('Note',{
    noteID:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    storageLocation:{
        type:DataTypes.STRING,
        allowNull:false
    },
    //Foreign Key
    subjectID:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
});

Workspaces.hasMany(Subjects, { foreignKey: 'workspaceID' });
Subjects.belongsTo(Workspaces, { foreignKey: 'workspaceID' });

Subjects.hasMany(Notes, { foreignKey: 'subjectID' });
Notes.belongsTo(Subjects, { foreignKey: 'subjectID' });

Workspaces.hasMany(Projects, { foreignKey: 'workspaceID' });
Projects.belongsTo(Workspaces, { foreignKey: 'workspaceID' });

Projects.hasMany(ProjectItems, { foreignKey: 'projectID' });
ProjectItems.belongsTo(Projects, { foreignKey: 'projectID' });

Workspaces.hasMany(Tasks, { foreignKey: 'workspaceID' });
Tasks.belongsTo(Workspaces, { foreignKey: 'workspaceID' });

Workspaces.hasMany(Calendars, { foreignKey: 'workspaceID' });
Calendars.belongsTo(Workspaces, { foreignKey: 'workspaceID' });

Calendars.hasMany(Events, { foreignKey: 'calendarID' });
Events.belongsTo(Calendars, { foreignKey: 'calendarID' });
//Export the models
module.exports = {
    Users,
    Workspaces,
    Calendars,
    Events,
    sync,
    createUser,
    createWorkspace,
    createCalendar,
    Tasks,
    Projects,
    ProjectItems,
    Subjects,
    Notes
};


