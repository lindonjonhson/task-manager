const express = require('express');
const bodyParser = require('body-parser');
const app = express();

//This is the database connection
const { mongoose } = require('./db/mongoose');

// Load in the mongoose models
//const { List } = require('./db/models/list.model');
//const { Task } = require('./db/models/task.model');
const { List, Task } = require('./db/models');

//Load middleware
app.use(bodyParser.json());

//Cors Headers Middleware
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


//ROUTE HANDLERS

//LIST ROUTES

/**
 * GET /lists
 * Purpose: Get all lists
 */
app.get("/lists", (req, res) => {
    //Return an array of all the lists in the database
    List.find({}).then((lists)=>{
        res.send(lists);
    });
});

/**
 * POST /lists
 * Purpose: Create new list
 */
app.post("/lists", (req, res) => {
    //Create a new list and return the new list document back to the user, which includes the id
    //List information will be passed in via JSON request body
    let title = req.body.title;
    let newList = new List({
        title
    });
    newList.save().then((listDoc)=>{
        res.send(listDoc);
    });

});

/**
 * PATCH /lists/:id
 * Purpose: Update specified list
 */
app.patch("/lists/:id", (req, res) => {
    //We want to update the specified list ( list document with id in the URL ) with new values specified in the JSON body

    List.findOneAndUpdate(
        //Search Statement
        { _id: req.params.id},
        //Update Statement
        { $set: req.body}
        //We are using req.params.id, because the id will come through the url
        //"$set" will get the whole object List, so the method will update all the informations
    ).then(() => { 
        res.sendStatus(200);
    });
});

/**
 * DELETE /lists/:id
 * Purpose: Delete specified list
 */
app.delete("/lists/:id", (req, res) => {
    //We want to delete the specified list ( list document with id in the URL )
    List.findOneAndRemove({
        _id: req.params.id
    }).then((removedListDoc) => {
        res.send(removedListDoc);
    });
});

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});

//TASK ROUTES


/**
 * GET /lists/:listId/tasks
 * Purpose: Get all tasks
 */
app.get("/lists/:listId/tasks", (req, res) => {
    //Return an array of all the tasks that belong to the list id

    Task.find({
        _listId: req.params.listId
    }).then((tasks)=>{
        res.send(tasks);
    });

});

/**
 * GET /lists/:listId/tasks/:taskId
 * Purpose: Find one particular task
 */
app.get("/lists/:listId/tasks/:taskId", (req, res) => {
    //Find one particular task
    Task.findOne(
        { 
            _id: req.params.taskId,
            _listId: req.params.listId
        }
    ).then((task) => {
        res.send(task)
    });
});

/**
 * POST /lists/:listId/tasks
 * Purpose: Create new task with the "listId"
 */
app.post("/lists/:listId/tasks", (req, res) => {
    //Create a new task and return the new taks document back to the user, which includes the id
    //Task information will be passed in via JSON request body
    //let title = req.body.title;
    //let listId = req.params.listId
    let newTask = new Task({
        title: req.body.title,
        _listId: req.params.listId
    });

    newTask.save().then((taskDoc)=>{
        res.send(taskDoc);
    });

});

/**
 * PATCH /lists/:id
 * Purpose: Update specified tasks
 */
app.patch("/lists/:listId/tasks/:taskId", (req, res) => {
    //We want to update the specified task ( task document with id in the URL ) with new values specified in the JSON body

    Task.findOneAndUpdate(
        //Search statement
        { 
            _id: req.params.taskId,
            _listId: req.params.listId
        },
        //Update statement
        { $set: req.body}
        //We are using req.params.id, because the id will come through the url
        //"$set" will get the whole object List, so the method will update all the informations
    ).then(() => { 
        res.sendStatus(200);
    });

});


/**
 * DELETE /lists/:listId/tasks/:taskId
 * Purpose: Delete specified task
 */
app.delete("/lists/:listId/tasks/:taskId", (req, res) => {
    //We want to delete the specified list ( list document with id in the URL )
    Task.findOneAndRemove(
        { 
            _id: req.params.taskId,
            _listId: req.params.listId
        }
    ).then((removedTaskDoc) => {
        res.send(removedTaskDoc);
    });
});
