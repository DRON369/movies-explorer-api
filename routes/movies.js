const router = require('express').Router();

const {
  getSavedMovies, createMovie, deleteMovieById,
} = require('../controllers/movies');

// возвращает все сохранённые пользователем фильмы
router.get('/', getSavedMovies);

// создаёт фильм с переданными в теле данными
router.post('/', createMovie);

// удаляет сохранённый фильм по id
router.delete('/:movieId', deleteMovieById);

module.exports = router;
