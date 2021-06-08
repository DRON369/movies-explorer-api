const router = require('express').Router();
const { emailValidator } = require('../middlewares/emailValidator');

const {
  getCurrentUser, updateUser,
} = require('../controllers/users');

// возвращает информацию о пользователе (email и имя)
router.get('/me', getCurrentUser);

// обновляет информацию о пользователе (email и имя)
router.patch('/me', emailValidator, updateUser);

module.exports = router;
