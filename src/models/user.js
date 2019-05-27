const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema(
    {
        name: {
          type: String,
          required: true,
          trim: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            validate(value)  {
                if(!validator.isEmail(value)) {
                    throw new Error('Email is invalid');
                }
            }
        },
        age: {
          type: Number,
          default: 0,
          validate (value) {
              if (value < 0) {
                  throw new Error('Age must be +')
              }
          }
        },
        password: {
            type: String,
            trim: true,
            required: false,
            minlength: 7,
            validate (value) {
                if (!validator.isLength(value, {min: 7, max:undefined}))  {
                    throw new Error('Password must be > 6 characters');
                }
                else if (validator.contains(value, 'password'))
                {
                    // also value.toLowerCase().includes('password')
                    throw new Error('Password cannot contain the text "password" ');
                }
            }
        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }],
        avatar: {
            type: Buffer
        }
    },
    {
        timestamps: true
    }
);

// Virtual property.  Relationship between two entities
userSchema.virtual('tasks', {
    ref: 'Task', 
    localField: '_id',
    foreignField: 'owner'
});


userSchema.plugin(uniqueValidator);

// methods are available on the instances.  donot use arrow function because the instance this pointer is required.
userSchema.methods.generateAuthToken = async function() {
    const user = this;

    const token = jwt.sign({ _id:user._id.toString() }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({ token: token});
    await user.save();
    return token;
}

// this function runs even though it is not explicitly called.
// this is the profile response
userSchema.methods.toJSON = function() {
   const user = this;
   const userObject = user.toObject();  // returns a cloned object.

   delete userObject.password;  // removes members from the userObject.
   delete userObject.tokens;
   delete userObject.avatar;  // removed from body after {{url/users/me}} is sent.

   return userObject;
}

// available on the model, like a static function in C++.
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email: email});

    if (!user) {
        throw new Error('Unable to login');
    }
    else {
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error('Unable to Login');
        }
    }

    return user;
}

// Hash the plain text password before saving
// pre MUST use a standard function.
// THIS IS MIDDLEWARE
userSchema.pre('save', async function(next) {
    console.log('just before saving');

    
    if (this.isModified('password')) {
       this.password = await bcrypt.hash(this.password, 8);
    }

    next();  // needs to be called 
});

// Delete user tasks when user is removed.
userSchema.pre('remove', async function (next) {
    const user = this;
console.log('deletemany');
    await Task.deleteMany( { owner: user._id} );

    next();
});

const User = mongoose.model('User', userSchema);


module.exports = User;
