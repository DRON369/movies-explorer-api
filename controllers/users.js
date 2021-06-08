const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');

function errorHandler(next) {
  return (err) => {
    if (err.message === 'NotValidId') {
      throw new NotFoundError('Нет пользователя с таким id');
    }
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      throw new BadRequestError('В запросе переданы некорректные данные');
    }
    next(err);
  };
}

module.exports.createUser = (req, res, next) => {
  const {
    email, name,
  } = req.body;

  bcrypt.hash(req.body.password, 10).then((hash) => {
    User.create({
      email,
      password: hash,
      name,
    })
      .then((user) => User.findById(user._id))
      .then((user) => {
        res.send(user);
      })
      .catch((err) => {
        if (err.name === 'MongoError' && err.code === 11000) {
          throw new ConflictError('Данный email уже используется');
        }
        if (err.name === 'ValidationError' || 'SyntaxError') {
          throw new BadRequestError('В запросе переданы некорректные данные');
        }
        next(err);
      })
      .catch(next);
  });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValidId' || err.name === 'CastError') {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      next(err);
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { runValidators: true, new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch(errorHandler(next))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {
          expiresIn: '7d',
        },
      );
      res.status(200).send({ token });
      // !True cookies auth, for best times...
      // const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
      //   expiresIn: '7d',
      // });
      // res
      //   .cookie('jwt', token, {
      //     maxAge: 3600000,
      //     httpOnly: true,
      //   })
      //   .send({ _id: user._id });
    })
    .catch(next);
};
