// CRUD create, read, update, and delete

//const mongodb = require('mongodb');

//const MongoClient = mongodb.MongoClient;

const connectionURL = 'mongodb://127.0.0.1:27017';  // do not use localhost.
const databaseName = 'task-manager';
//const ObjectID = mongodb.ObjectID;  // guid.

// Destructured
const {MongoClient, ObjectID} = require('mongodb');

// creating ids
// const id = new ObjectID();  // new is optional, will be added automatically
// console.log(id.id);
// console.log(id.getTimestamp());

MongoClient.connect(process.env.CONNECTION_URL, { useNewUrlParser: true}, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database!');
    }
    else{
        const db = client.db(process.env.DATABASE_NAME);  // automatically created.

        const query = {age: 59};
        const update = {$set: {completed: true}}; 

        db.collection('tasks').updateMany(query, update).then((result) => {
            console.log('result.modifiedCount');
        }).catch(() => {
            console.log(error);
        });

        // deleteOne & deleteMany
        db.collection('users').deleteOne(query).then((result) => {
            console.log(result);
        }).catch(() => {
            console.log(error);
        });


        // db.collection('users').updateOne({
        //     _id: new ObjectID("5ccb0d487f886c42c80ba92b")
        // }, {
        //     $inc: {
        //         age: 2
        //     }
        // }).then((result) => {
        //     console.log(result);
        // }).catch((error) => {
        //     console.log(error);
        // })
        

        // db.collection('users').findOne({_id: new ObjectID("5ccb0d487f886c42c80ba92b")}, (error, user) => {
        //     if (error) {
        //         return console.log('Unable to fetch');
        //     }
        //     else {
        //         console.log(user);
        //     }
        // });

        // db.collection('users').find({age: 57}).toArray((error, users) => {
        //     console.log(users);
        // });
        
        // db.collection('users').find({age: 57}).count((error, count) => {
        //     console.log(count);
        // });



        // Inserts a document into a collection.  insertOne is an asynchronous function.
        // db.collection('users').insertOne({
        //     name: 'Louis',
        //     age: 15
        // }, (error, result) => {
        //     if (error)
        //     {
        //         return console.log('Unable to insert user');
        //     }
        //     else {
        //         console.log(result.ops);
        //     }
        // });

        // db.collection('users').insertMany([{name: 'Katherine', age: 18},
        //                                    {name: 'Kenneth'  , age: 15}
        //                                   ], (error, result) => {
        //                                       if (error) {
        //                                           return console.log('Unable to insert documents!');
        //                                       }
        //                                       else {
        //                                          console.log(result.ops) ;
        //                                       }
        //                                   });

        // db.collection('tasks').insertMany([{description: 'Takeout garbage', completed: true},
        //                                    {description: 'Write motion to reargue', completed: true}, 
        //                                    {description: 'Get motion to reargue notarized', completed: false}, 
                                           
        //                                   ], (error, result) => {
        //                                       if (error) {
        //                                           return console.log('Unable to insert documents!');
        //                                       }
        //                                       else {
        //                                          console.log(result.ops) ;
        //                                       }
        //                                   });

// db.collection('tasks').findOne({_id: new ObjectID("5cd03042b3735d4f188aa92b")}, (error, task) => {
//             if (error) {
//                 return console.log('Unable to fetch');
//             }
//             else {
//                 console.log(task);
//             }
//         }); 
        
// db.collection('tasks').find({completed: false}).toArray((error, tasks) => {
//             console.log(tasks);
//         });        

    }
})