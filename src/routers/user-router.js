const express = require('express');
const User = require('../models/user');
const sharp = require('sharp');
const router = new express.Router();
const auth = require('../middleware/auth');
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account');
const multer = require('multer');



// Creating a new user.
router.post('/users', async (req, res)=>{
    const user = new User(req.body);    // create an instance of the mongoose model
       
    // user.save().then(()=> {
    //     res.status(201).send(user);
    // }).catch((e) => {
    //     res.status(400).send(e);  // use of chaining
    //     //res.send(e);
    // })

    try {
        console.log(user) ;
        await user.save();
        sendWelcomeEmail(user.email, user.name);  // asynchonous, but we don't wait.
        const token = await user.generateAuthToken();
        console.log("saved") ;
        res.status(201).send( {user, token} );
        // if user.save() promise is NOT fulfilled, then the following code won't run
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
    
});

router.post('/users/login', async (req, res) => {
    console.log("1-login");
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        console.log("4-login");
        // res.status(200).send({user: user, token: token});
        res.send({ user: user, token: token });
    } catch (error) {
        res.status(400).send('Mistake');
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })

        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
})

// Logout of all users
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
})

// route function for /users will run the auth function first and then the route handler.
router.get('/users/me', auth ,async (req, res) => {

    res.send(req.user);

    // try {
    //     const users = await User.find({});
    //     res.send(users);
    // } catch (error) {
    //     res.status(500).send();
    // }

    // User.find({ }).then((users) => {
    //     res.send(users)
    // }).catch((error) => {
    //     res.status(500).send()
    // })
});

const avatar = multer({
    
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if (file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            callback(undefined, true);  // if everything is OK.
        } else {
            return callback(new Error('Please upload a jpg|jpeg|png less than 1MB'));
        }

        // callback(new Error('File must be a PDF'));  // if something goes wrong, pass callback an error.
        
        // callback(undefined, false);  // silently reject the upload
    }
});

const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if (file.originalname.match(/\.(doc|docx)$/)) {
            callback(undefined, true);  // if everything is OK.
        } else {
            return callback(new Error('Please upload a doc|docx less than 1MB'));
        }

        // callback(new Error('File must be a PDF'));  // if something goes wrong, pass callback an error.
        
        // callback(undefined, false);  // silently reject the upload
    }
});

const errorMiddleware = (req, res, next) => {
    throw new Error('From my middleware');
}

router.post('/upload', upload.single('upload'), /* errorMiddleware */ async (req, res) => {
    // req.file.buffer can only be accessed if dest option is not specified.
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({error: error.message});
});

router.post('/users/me/avatar', auth, avatar.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();  // converts to png
    req.user.avatar = buffer;
    await req.user.save();
    res.send( );
}, (error, req, res, next) => {
    res.status(400).send({error: error.message});
});

router.delete('/users/me/avatar', auth, async(req, res) => {
    try {
          req.user.avatar = undefined;

          await req.user.save();
          
          res.send();

    } catch (error) {
        res.status(500).send();
    }
});

router.get('/users/:id/avatar', async(req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error();
        }
        else {
            res.set('Content-Type', 'image/png');
            res.send(user.avatar);
        }
    } catch (error) {
        res.status(404).send();
    }
});


router.patch('/users/me', auth,  async (req, res) => {
    
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];

    const isValidOperation = updates.every((update)=> {
        return allowedUpdates.includes(update);
    });

    console.log("router.patch");

    if (!isValidOperation) {
        console.log("router.patch-1");
       return res.status(400).send({ error: 'Invalid updates!'});
    }

    try {
        //const user = await User.findById(req.params.id);

        updates.forEach((update) => {
            req.user[update] = req.body[update];
        });

        console.log("router.patch-3");

        await req.user.save();
        
        // findByIdAndUpdate bypasses mongoose.  performs a direct operation on the database, that's why runValidators must be set.
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        res.send(req.user);
        


    } catch(error) {
        console.log("router.patch-2");
        res.status(400).send(error);
    }
});

router.delete('/users/me', auth, async(req, res) => {
    try {
    //    const user = await User.findByIdAndDelete(req.user._id);

    //    if (!user) {
    //        return res.status(404).send()
    //    }
    //    else {
    //        res.send(user);
    //    }
          await req.user.remove();
console.log("before sendCancelEmail");
          sendCancelEmail(req.user.email, req.user.name);
console.log("after sendCancelEmail");          
          res.send(req.user);

    } catch (error) {
        res.status(500).send();
    }
});






module.exports = router;