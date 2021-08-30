const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true, 
        required: true,
        minlength: 5,
        maxlength: 15,
    },
    password: {
        type: String,
        unique: true, 
        required: true,
        minlength: 5,
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