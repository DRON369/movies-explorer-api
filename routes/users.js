const router = require('express').Router();

const {
  getCurrentUser, updateUser,
} = require('../controllers/users');

// возвращает информацию о пользователе (email и имя)
router.get('/me', getCurrentUser);

// обновляет информацию о пользователе (email и имя)
router.patch('/me', updateUser);

module.exports = router;
