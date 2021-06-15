const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const UnathorizedError = require('../errors/unauthorized-error');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    const error = new UnathorizedError('Необходима авторизация');
    return next(error);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    if (!payload) {
      const error = new UnathorizedError('Необходима авторизация');
      return next(error);
    }
    return next(err);
  }

  req.user = payload;

  return next();

  //! True cookie auth, for best times...
  // const authorization = req.headers;
  // if (!authorization || !authorization.cookie) {
  //   const error = new UnathorizedError('Необходима авторизация');
  //   return next(error);
  // }

  // const token = authorization.cookie.replace('jwt=', '');
  // let payload;
  // try {
  //   payload = jwt.verify(token, 'some-secret-key');
  // } catch (err) {
  //   if (!payload) {
  //     const error = new UnathorizedError('Необходима авторизация');
  //     return next(error);
  //   }
  //   return next(err);
  // }

  // req.user = payload; // записываем пейлоуд в объект запроса
  // return next();
};
