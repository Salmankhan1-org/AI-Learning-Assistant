const express = require('express');
const { signup } = require('../controllers/userControllers/signup');
const { login } = require('../controllers/userControllers/login');
const { logout } = require('../controllers/userControllers/logout');
const { forgotPassword } = require('../controllers/userControllers/forgot.password');
const { resetPassword } = require('../controllers/userControllers/user.reset.password');
const { verifyEmail } = require('../controllers/userControllers/users.verify.email');
const { getAllUsers } = require('../controllers/userControllers/users.get.all');
const { googleLogin } = require('../controllers/userControllers/user.google.login');
const { isAuthenticated, isAdmin } = require('../middlewares/authToken');
const { getUserDetails } = require('../controllers/userControllers/user.get.user.details');
const { signupValidator } = require('../validators/user.signup.validator');
const { loginValidator } = require('../validators/user.login.validator');
const { resetPasswordValidator } = require('../validators/user.reset.password.validator');
const { updateUserDetails } = require('../controllers/userControllers/update.user.details');
const { updateUserDetailsValidator } = require('../validators/user.update.userDetails.validator');
const uploadImage = require('../middlewares/multer.upload.image');
const { getUserAnalytics } = require('../controllers/userControllers/get.user.analytics');
const { getRecentUserActivities } = require('../controllers/userControllers/get.recent.user.activities');
const { getAllUsersByAdmin } = require('../controllers/userControllers/get.admin.all.users');
const { deleteUserByAdmin } = require('../controllers/userControllers/user.delete.admin');
const { toggleUserStatus } = require('../controllers/userControllers/toggle.status.admin');
const { updateUserRole } = require('../controllers/userControllers/user.admin.role.update');
const { getAdminAnalytics } = require('../controllers/userControllers/users.admin.get.analytics');
const router = express.Router();

router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);
router.get('/logout', logout);
router.post('/forgot-password',forgotPassword);
router.post('/reset-password/:token', resetPasswordValidator,  resetPassword);
router.post('/verify-email', verifyEmail);
router.get('/all-users',getAllUsers);
router.post('/google-login',googleLogin);
router.get('/get/details',isAuthenticated,getUserDetails);
router.put('/update/:userId', uploadImage.single('image'),updateUserDetailsValidator,  updateUserDetails);
router.get('/get/analytics', isAuthenticated, getUserAnalytics);
router.get('/activities/get', isAuthenticated, getRecentUserActivities);

// Admin routes
router.get('/admin/all',isAuthenticated, isAdmin,  getAllUsersByAdmin);
router.delete('/admin/:userId/delete', isAuthenticated, isAdmin, deleteUserByAdmin);
router.patch('/admin/:userId/status', isAuthenticated, isAdmin, toggleUserStatus);
router.patch('/admin/role-update/:userId', isAuthenticated, isAdmin, updateUserRole);
router.get('/admin/get/analytics', isAuthenticated, isAdmin, getAdminAnalytics);

module.exports = router;