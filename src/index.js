// index.js STARTING POINT for the application

const express = require('express');
const userRouter = require('./routers/user-router.js');
const taskRouter = require('./routers/task-router.js');

require('./db/mongoose.js');
const mongoose1 = require('mongoose');

const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 3000;  // herocu env variable.

const multer = require('multer');




app.use(express.json());  // automatically parses the body of a json object
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log('Server is running on : ', port);
});





 