const Movie = require('../models/movie');

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
        console.log('В запросе переданы некорректные данные');
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
      // eslint-disable-next-line eqeqeq
      if (req.user._id != movie.owner) {
        console.log('Нельзя удалять чужие фильмы!');
      }
      movie.delete();
      res.send(movie);
    })
    .catch((err) => {
      console.log(err);
      if (err.message === 'NotValidId') {
        console.log('Нет фильма с таким id');
      }
      if (err.name === 'CastError') {
        console.log('В запросе переданы некорректные данные');
      }
      next(err);
    })
    .catch(next);
};
