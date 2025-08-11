var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController'); 
const { protect, restrictTo } = require('../middlewares/authMiddleware');

/* GET users listing. */
router.route('/')
  .get(protect, restrictTo('admin'), userController.getAllUsers)
  .post(protect, restrictTo('admin'), authController.register);

router.route('/:id')
  .get(protect, restrictTo('admin'), userController.getUserById)
  .put(protect, restrictTo('admin'), userController.updateUser)
  .delete(protect, restrictTo('admin'), userController.deleteUser);

module.exports = router;
