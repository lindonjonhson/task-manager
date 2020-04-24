const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();

// This is the database connection
const { mongoose } = require('./db/mongoose');

// Load in the mongoose models
const { List, Task, User } = require('./db/models');

// MIDDLEWARE

// Load middleware
app.use(bodyParser.json());

// CORS HEADERS MIDDLEWARE
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );

    next();
});

// check the request has a valid JWT access token
let authenticate = (req, res, next) => {
    let token = req.header('x-access-token');

    // verify the JWT
    jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
        if (err){
            // There was an error
            // JWT is invalid - DON'T AUTHENTICATE
            res.status(401).send(err);
        } else {
            // JWT is valid
            req.user_id = decoded._id;
            next();
        }
    });
}

// Verify Refresh Token middleware( which will be verifying the session) 
let verifySession = (req, res, next) => {
    //Grab refresh token from header
    refreshToken = req.header('x-refresh-token');
    // console.log(refreshToken);
    //Grab Id from request header
    let _id = req.header('_id');
    // console.log(_id);

    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if(!user){
            //User not found
            return Promise.reject({
                'error': 'User not found. Make sure that the refresh token and user id are correct.'
            });
        }
        // if the code reaches here the user was found
        // therefore refresh token exists, but we have to check if it has expired
        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;

        let isSessionValid = false;

        user.sessions.forEach((session) => {
            if (session.token === refreshToken) {
                //Check if session has expired
                if(User.hasRefreshTokenExpired(session.expiresAt) === false){
                    //refresh token not expired
                    isSessionValid = true;
                }
            }
        });

        if(isSessionValid){
            // session is valid, call next to continue the webreq
            next();
        }else{
            // session not valid
            return Promise.reject({
                'error': 'Refresh token has expired or the session is invalid'
            });
        }
    }).catch((e) => {
        res.status(401).send(e);
    });
};


// END MIDDLEWARE

// ROUTE HANDLERS

// LIST ROUTES

/**
 * GET /lists
 * Purpose: Get all lists
 */
app.get("/lists", authenticate, (req, res) => {
    // Return an array of  the lists in the database that belong to the authenticated user
    List.find({
        _userId: req.user_id
    }).then((lists)=>{
        res.send(lists); 
    }).catch((e) => {
        res.send(e);
    });
});

/**
 * POST /lists
 * Purpose: Create new list
 */
app.post("/lists", authenticate, (req, res) => {
    // Create a new list and return the new list document back to the user, which includes the id
    // List information will be passed in via JSON request body
    let title = req.body.title;
    let newList = new List({
        title,
        _userId: req.user_id
    });
    newList.save().then((listDoc)=>{
        res.send(listDoc);
    });

});

/**
 * PATCH /lists/:id
 * Purpose: Update specified list
 */
app.patch("/lists/:id", authenticate, (req, res) => {
    // We want to update the specified list ( list document with id in the URL ) with new values specified in the JSON body

    List.findOneAndUpdate(
        // Search Statement
        { _id: req.params.id, _userId: req.user_id },
        // Update Statement
        { $set: req.body}
        // We are using req.params.id, because the id will come through the url
        // "$set" will get the whole object List, so the method will update all the informations
    ).then(() => { 
        res.sendStatus(200);
    });
});

/**
 * DELETE /lists/:id
 * Purpose: Delete specified list
 */
app.delete("/lists/:id", authenticate, (req, res) => {
    // We want to delete the specified list ( list document with id in the URL )
    List.findOneAndRemove({
        _id: req.params.id,
        _userId: req.user_id
    }).then((removedListDoc) => {
        res.send(removedListDoc);

        // delete all the tasks that are on the deleted list
        deleteTasksFromList(removedListDoc._id);
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
app.get("/lists/:listId/tasks", authenticate, (req, res) => {
    // Return an array of all the tasks that belong to the list id

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
app.get("/lists/:listId/tasks/:taskId", authenticate, (req, res) => {
    // Find one particular task
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
app.post("/lists/:listId/tasks", authenticate, (req, res) => {
    // Create a new task and return the new taks document back to the user, which includes the id
    // Task information will be passed in via JSON request body

    //Firstly we gonna validate the user
    List.findOne({
        _id: req.params.listId,
        _userId: req.user_id
    }).then((list) => {
        if (list) {
            // List object is valid
            // Therefore the currently authenticated user can create new tasks
            return true;
        }
        // else - the list object is undefined
        return false
    }).then((canCreateTask) => {
        if(canCreateTask){
            // let title = req.body.title;
            // let listId = req.params.listId
            let newTask = new Task({
                title: req.body.title,
                _listId: req.params.listId
            });
            newTask.save().then((taskDoc)=>{
                res.send(taskDoc);
            });
        } else {
            res.sendStatus(404);
        }
    });

});

/**
 * PATCH /lists/:id
 * Purpose: Update specified tasks
 */
app.patch("/lists/:listId/tasks/:taskId", authenticate, (req, res) => {
    // We want to update the specified task ( task document with id in the URL ) with new values specified in the JSON body

    // Firstly we gonna validate the user
    List.findOne({
        _id: req.params.listId,
        _userId: req.user_id
    }).then((list) => {
        if(list){
            // List object is valid
            // Therefore the currently authenticated user can update new tasks
            return true;
        }
        // else - the list object is undefined
        return false;
    }).then((canUpdateTask) => {
        if(canUpdateTask){
            // Currently authenticated user can update tasks
            Task.findOneAndUpdate(
                // Search statement
                { 
                    _id: req.params.taskId,
                    _listId: req.params.listId
                },
                // Update statement
                { $set: req.body}
                // We are using req.params.id, because the id will come through the url
                // "$set" will get the whole object List, so the method will update all the informations
            ).then(() => { 
                res.send({message: "Completed Successfully"});
            });
        }else{
            res.sendStatus(404);
        }
    });

});

/**
 * DELETE /lists/:listId/tasks/:taskId
 * Purpose: Delete specified task
 */
app.delete("/lists/:listId/tasks/:taskId", authenticate, (req, res) => {

  //Firstly we gonna validate the user
  List.findOne({
    _id: req.params.listId,
    _userId: req.user_id
}).then((list) => {
    if(list){
        // List object is valid
        // Therefore the currently authenticated user can delete tasks
        return true;
    }
    // else - the list object is undefined
    return false;
}).then((canDeleteTask) => {
    if(canDeleteTask){
        // We want to delete the specified list ( list document with id in the URL )
        Task.findOneAndRemove(
            { 
                _id: req.params.taskId,
                _listId: req.params.listId
            }
        ).then((removedTaskDoc) => {
            res.send(removedTaskDoc);
        });
    }else{
        res.sendStatus(404);
    }
});



});

/* USER ROUTES */

/**
 * POST /users
 * Purpose: Sign up
 */
app.post('/users', (req, res) => {
    // User sign up

    let body = req.body;
    let newUser = new User(body);

    newUser.save().then(() => {
        return newUser.createSession();
    }).then((refreshToken) => {
        // Session created successfully - refreshToken returned.
        // now we geneate an access auth token for the user

        return newUser.generateAccessAuthToken().then((accessToken) => {
            // access auth token generated successfully, now we return an object containing the auth tokens
            return { accessToken, refreshToken }
        });
    }).then((authTokens) => {
        // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
        res
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(newUser);
    }).catch((e) => {
        res.status(400).send(e);
    })
})

/**
 * POST /users/login
 * Purpose: Login
 */
app.post('/users/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findByCredentials(email, password).then((user) => {
        return user.createSession().then((refreshToken) => {
            // Session created successfully - refreshToken returned.
            // now we geneate an access auth token for the user

            return user.generateAccessAuthToken().then((accessToken) => {
                // access auth token generated successfully, now we return an object containing the auth tokens
                return { accessToken, refreshToken }
            });
        }).then((authTokens) => {
            // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user);
        })
    }).catch((e) => {
        res.status(400).send(e);
    });
})

/**
 * GET /users/me/access-token
 * Purpose: Generates and returns access token
 */

 app.get('/users/me/access-token', verifySession, (req, res) => {
    // We know the caller is authenticated and we have user Id and Object avaliable
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({accessToken});
    }).catch((e) => {
        res.status(400).send(e);
    })
 });

 // Helper method
 let deleteTasksFromList = (_listId) => {
    Task.deleteMany({
        _listId
    }).then(() => {
        console.log("Tasks from " + _listId + " were deleted");
    });
 }