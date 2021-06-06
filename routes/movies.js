const router = require('express').Router();

const {
  getSavedMovies, createMovie, deleteMovieById,
} = require('../controllers/movies');

// возвращает все сохранённые пользователем фильмы
router.get('/movies', getSavedMovies);

// создаёт фильм с переданными в теле данными
router.post('/movies', createMovie);

// удаляет сохранённый фильм по id
router.post('/movies/:movieId', deleteMovieById);

module.exports = router;
