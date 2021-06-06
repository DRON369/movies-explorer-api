const bcrypt = require('bcryptjs');
const User = require('../models/user');

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
          console.log('Данный email уже используется');
        }
        if (err.name === 'ValidationError' || 'SyntaxError') {
          console.log('В запросе переданы некорректные данные');
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
        console.log('Нет пользователя с таким id');
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
    .catch(next);
};
