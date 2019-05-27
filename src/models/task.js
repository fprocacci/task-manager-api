const mongoose = require('mongoose');

// defines the metadata for a mongo document
const taskSchema = new mongoose.Schema({
    task_name: {
    type: String,
    trim: true,
    required: true,
    default: "fake name"
    ,
},
task_completed : {
    type: Boolean,
    required: false,
    default: false
},
owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'         // reference to another model
}
}, {timestamps: true});

const Task = mongoose.model('Task', taskSchema);
    



module.exports = Task;