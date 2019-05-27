const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});




// //  const me = new User({
// //      name: '     Felix     ',
// //      email: 'feASSASAASlix@hh.com',
// //      password: 'dddfgertd'
// //  });

// // me.save().then((me) => {
// //     console.log(me);
// // }).catch((error) => {
// //     console.log('Error : ', error)
// // });

// const task = new Task({
//     task_name: 'Attend Sewanhaka Budget Hearing',
//     task_completed: false
// });

// task.save().then((task) => {
//     console.log(task);
// }).catch((error) => {
//     console.log('Error!!! ', error);
// });
