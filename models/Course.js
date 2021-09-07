const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    title: {
        type: String,
        unique: true, 
        required: [true, 'Please enter a title for your course'],
    },
    description: {
        type: String,
        required: [true, 'Please create a course description'],
        maxlength: [300, 'Maximum description length is 300 characters'],
    },
    imageUrl: {
        type: String,
        required: [true, 'Please add a link to your image'],
    },
    isPublic: {
        type: Boolean,
        default: false, 
    },
    creatorId: {
        type: String,
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    enrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;