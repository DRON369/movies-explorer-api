const { Joi, celebrate } = require('celebrate');

const validateAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateRegistration = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateNewMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().regex(/(https|http?):\/\/\w*\S*\./).required(),
    trailer: Joi.string().regex(/(https|http?):\/\/\w*\S*\./).required(),
    thumbnail: Joi.string().regex(/(https|http?):\/\/\w*\S*\./).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports = {
  validateAuth,
  validateRegistration,
  validateNewMovie,
};
