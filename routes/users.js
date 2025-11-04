// routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Get all users
router.get('/', userController.getAllUsers);

// Get own profile (mocked as Alice)
router.get('/me', userController.getMe);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update user by ID (PUT)
router.put('/:id', userController.updateUserById);

// Delete user by ID
router.delete('/:id', userController.deleteUserById);

module.exports = router;
