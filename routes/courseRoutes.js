const courses = require('../controllers/courses');
const { requireAuth, checkUser, checkEnrollment } = require('../middleware/authMiddleware');

module.exports = (app) => {
    app.get('/course/create', requireAuth, courses.createCourse);
    app.post('/course/create', courses.createCoursePost);

    app.get('/course-details/:id', [requireAuth, checkEnrollment], courses.courseDetails);

    app.get('/edit-course', courses.editCourse);
    
};