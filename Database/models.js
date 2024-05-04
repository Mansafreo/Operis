//Use sequelize to define the model for the database
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const dbPath = path.resolve(__dirname, 'database.db');
// Initialize Sequelize with SQLite dialect
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath
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
    password: {
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
    Tasks
};


