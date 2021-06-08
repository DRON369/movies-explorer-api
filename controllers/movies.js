const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.getSavedMovies = (req, res, next) => {
  Movie.find({})
    .then((savedMovies) => res.send(savedMovies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((newMovie) => Movie.findById(newMovie._id))
    .then((newMovie) => {
      res.send(newMovie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || 'SyntaxError') {
        throw new BadRequestError('В запросе переданы некорректные данные');
      }
      next(err);
    })
    .catch(next);
};

module.exports.deleteMovieById = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .orFail(new Error('NotValidId'))
    .then((movie) => {
      if (req.user._id.toString() !== movie.owner.toString()) {
        throw new ForbiddenError('Нельзя удалять чужие фильмы!');
      }
      movie.delete();
      res.send(movie);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Нет фильма с таким id');
      }
      if (err.name === 'CastError') {
        throw new BadRequestError('В запросе переданы некорректные данные');
      }
      next(err);
    })
    .catch(next);
};
