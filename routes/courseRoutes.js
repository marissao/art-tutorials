const courses = require('../controllers/courses');

module.exports = (app) => {
    app.get('/create-course', courses.createCourse);

    app.get('/edit-course', courses.editCourse);
    
    app.get('/course-details', courses.courseDetails);
};