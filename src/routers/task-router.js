const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
    console.log(req.body);
    //const task = new Task(req.body);  // creates an instance of the Task model (metadata)
    const task = new Task({
        ...req.body,            // ES6 spread operator = ...  EXPANDS ALL MEMBERS OF body
        owner: req.user._id
    });


    //const user = new User(req.body);
    try {
        console.log(task);
        await task.save();
        //res.status(201).send(user);

        //await single_task.save();
        res.status(201).send(task);
    } catch (error) {
        return res.status(400).send(error);
    }
        
    // // save task to the database.
    // task.save().then(()=> {
    //     res.status(201).send(task);
    // }).catch((e) => {
    //     res.status(400).send(e);  // use of chaining
    //     //res.send(e);
    // })
});

// 


// GET /tasks?task_completed=false
router.get('/tasks', auth, async (req, res) => {
    
    //req.query.task_completed
    const match = {}

    const sort = {}

    if (req.query.task_completed) {
        match.task_completed = (req.query.task_completed === 'true')
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        console.log(parts[0]);
        console.log(sort[parts[0]]);
        console.log(sort);
    }

    console.log('get tasks');
    try {
        //const tasks = await Task.find({owner: req.user._id});
        await req.user.populate({
            path: 'tasks',
            match: match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort:sort
            }

        }).execPopulate();  // Explicitly executes population and returns a promise. Useful for ES2015 integration.
        res.send(req.user.tasks);
    } catch (error) {
        res.status(501).send();
    }    
    
    // console.log('tasks');
    // Task.find({ }).then((tasks) => {
    //     res.send(tasks)
    // }).catch((error) => {
    //     res.status(500).send()
    // })
});




// route to fetch an individual user
router.get('/tasks/:id', auth, async (req, res) => {

    console.log(req.params.id);
    const _id = req.params.id;
// string id is converted to an object id.
    try {
        
        
        const task = await Task.findOne({_id: _id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch (error) {
        return res.status(500).send();
    }
   
       
});

router.delete('/tasks/:id', auth, async(req, res) => {
    try {
       //const task = await Task.findByIdAndDelete(req.params.id);
       const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

       if (!task) {
           
           return res.status(404).send('Task not found1')
       }
       else {
           res.send(task);
       }

    } catch (error) {
        res.status(500).send();
    }
});





// Updating tasks
router.patch('/tasks/:id', auth, async (req, res) => {
    
    const updates = Object.keys(req.body);  // converts req.body to an array of properties
    const allowedUpdates = ['task_name', 'task_completed'];

    const isValidOperation = updates.every((update)=> {
        return allowedUpdates.includes(update);
    });

    if (!isValidOperation) {
       return res.status(400) .send({ error: 'Invalid updates!'});
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        //const task = await Task.findById(req.params.id);

        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

        if (!task)
        {
            return res.status(404).send();
        }
        else {
            updates.forEach((update) => task[update] = req.body[update]);
            await task.save();
    
            res.send(task);
        }


    } catch(error) {
        console.log(error);
        res.status(400).send(error);
    }
});


module.exports = router;