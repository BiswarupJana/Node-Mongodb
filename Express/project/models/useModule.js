const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
            validate: [validator.isEmail, 'please provide a valid email']

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
);

userSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();
  
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
  
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
  });


const User = mongoose.model('User', userSchema);

module.exports = User;