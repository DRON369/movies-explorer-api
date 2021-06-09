const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-error');

const { emailValidator } = require('../middlewares/emailValidator');
const { login, createUser } = require('../controllers/users');

router.post('/signin', login);
router.post('/signup', emailValidator, createUser);
router.use(auth);
router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

router.get(() => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = router;
