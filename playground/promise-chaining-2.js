
require('../src/db/mongoose');

const Task  = require('../src/models/task');

// Task.findByIdAndDelete('5cd425db282bd067b8f1274c').then((task) => {
//     console.log(task);
//     return Task.countDocuments({ completed: false })

// }).then((result) => {
//     console.log(result);
// }).catch((error) => {
//     console.log(e);
// });


const deleteTaskAndCount = async (id) => {

    const task = await Task.findByIdAndDelete(id);   // mongoose function.

    const count = await Task.countDocuments( { task_completed: false });

    return {task_data: task, count_data: count};
}

deleteTaskAndCount('5cd425eb82f5186608f03c0d').then((return_data) => {
    console.log(return_data.task_data, return_data.count_data);
}).catch((e) => {
    console.log(e);
})