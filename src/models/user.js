const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
/**
 * 
 *      This is the user schema model and contain all his fields
 *      first name
 *      last name
 *      user name
 *      age
 *      email
 *      password
 *      isEmailVerified
 *      isPhoneNumberVerified
 *      tokens array
 *      
 */
const userSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: [true, 'You Must Type Your first Name'],
        trim: true,
    },
    lastName:{
        type: String,
        required:[true, 'You Must Type Your last Name'],
        trim: true,
    },
    userName:{
        type: String,
        required: [true, 'You Must Type Your user Name'],
        unique:[true, 'your username must be unique'],
        trim: true,
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0)
                throw new Error('Age Must Be Greater Than Zero! ')
        }
    },
    email:{
        type: String,
        required:[true, 'You Must Type Your email address'],
        unique:[true, 'your email must be unique'],
        trim: true,
        validate(email){
            if( !validator.isEmail(email))
                throw new Error('Email Adress Is Not Valid')
        }
    },
    password:{
        type: String,
        required: [true, 'You Must Type Your user password'],
        trim: true,
        min:[6, 'Your Password must be more than 6 characters'],
        max:[100, 'Your Password must be lower than 100 characters']
    },
    phoneNumber:{
        type:String,
        required:[true, 'You Must Type Your phone Number'],
        unique:[true, 'your phone Number must be unique'],
    },
    isEmailVerified:{
        type: Boolean,
        default: false
    },
    isPhoneNumberVerified:{
        type: Boolean,
        default: false
    },
    code: String,
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
})


/// Hide Non Useful information
userSchema.methods.toJSON = function () {
    const user = this
    const userObejct = user.toObject()

    delete userObejct.tokens
    delete userObejct.password

    return userObejct
}

/// userSchema instance Fun to create a token
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

/// find user by email and password
userSchema.statics.findByCredntials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user)
        throw new Error('Unable To Login!')

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
        throw new Error('Unable To Login!')

    return user
}

///midleware for hashing fun before saving it!
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model('User',userSchema)
module.exports = User