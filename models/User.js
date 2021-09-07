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
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function(username, password) {
    const user = await this.findOne({ username }); // "this" refers to User model
    // Check if user exists, if not user will return undefined
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error("Incorrect password");
    }
    throw Error("Incorrect username");
};

const User = mongoose.model("User", userSchema);
module.exports = User;