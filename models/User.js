const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true, 
        required: [true, 'Please enter a username'],
        minlength: [5, 'Minimum username length is 5 characters'],
        maxlength: [15, 'Maximum username length is 15 characters'],
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters'],
    },
    enrolled_courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;