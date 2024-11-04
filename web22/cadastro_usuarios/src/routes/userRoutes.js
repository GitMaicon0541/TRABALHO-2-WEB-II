// userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rota para exportar usuários como CSV
router.get('/export/csv', userController.exportUsersCSV);

// Outras rotas existentes...
router.get('/', userController.getAllUsers);
router.get('/create', userController.renderCreateUserPage);
router.get('/:id', userController.getUserById);
router.get('/page/:page', userController.getAllUsersPaginated);
router.get('/:id/edit', userController.renderEditUserPage);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
