const courses = require('../controllers/courses');
const { requireAuth, checkUser, checkIsCreator } = require('../middleware/authMiddleware');

module.exports = (app) => {
    app.get('/course/create', requireAuth, courses.createCourse);
    app.post('/course/create', courses.createCoursePost);

    app.get('/course-details/:id', requireAuth, courses.courseDetails);

    app.get('/edit-course/:id', [requireAuth, checkIsCreator], courses.editCourse);
    app.put('/edit-course/:id', [requireAuth, checkIsCreator], courses.editCoursePost);

    app.delete('/delete-course/:id', courses.deleteCourse);

    app.put('/enroll-course/:id', [requireAuth, checkIsCreator], courses.enrollInCourse);
    
};