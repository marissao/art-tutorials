const courses = require('../controllers/courses');
const { requireAuth } = require('../middleware/authMiddleware');

module.exports = (app) => {
    app.get('/course/create', requireAuth, courses.createCourse);

    app.get('/edit-course', courses.editCourse);
    
    app.get('/course-details', courses.courseDetails);
};