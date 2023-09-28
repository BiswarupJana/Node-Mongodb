const mongoose = require('mongoose');
const validator = require('validator');


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: [true, 'Please tell us your name!'],
        },
        email: {
            type: String,
            require: [true, 'Please provide your email'],
            unique: true,
            lowercase: true,
            validator: [validator.isEnail, 'please provide a valid email']

        },
        photo: String,
        role: {
            type: String,
            enum: ['user', 'guide', 'lead-guide', 'admin'],
            default: 'user'
        },
        password: {
            type: String,
            required: [true, 'please provide a password'],
            minlength: 8,
            select: false
        },
        passwordConfirm: {
            type: String,
            required: [true, 'Please confirm your password'],
            validate: {
                // This only works on CREATE and SAVE !!!
                validator: function (el) {
                    return el === this.password;
                },
                message: 'Passwords are not the Same!'
            }
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        PasswordResetExpires: Date,
        active: {
            type: Boolean,
            default: true,
            select: false
        }
    }
)


const User = mongoose.model('User', userSchema);

module.exports = User;