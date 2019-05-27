require('../src/db/mongoose');

const User = require('../src/models/user');

// 5cd4284e04e83f620cf22bf5

// User.findByIdAndUpdate('5cd4284e04e83f620cf22bf5', { age: 1}).then((user) => {
//     console.log(user);

//     return User.countDocuments( {age: 1})
// }).then((result) => {
//     console.log(result);
// }).catch((error) => {
//     console.log(e);
// });

const updateAgeAndCount = async (id, age) => {

    const user = await User.findByIdAndUpdate(id, {age: age});   // or { age }

    const count = await User.countDocuments( { age: age});  // or { age }


    return count;
}

updateAgeAndCount('5cd4284e04e83f620cf22bf5', 9).then((count) => {
    console.log(count);
}).catch((e) => {
    console.log(e);
})