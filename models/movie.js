const mongoose = require('mongoose');

function linkValidator(link) {
  return /(https|http?):\/\/\w*\S*\./.test(link);
}

const movieSchema = new mongoose.Schema({
  // страна создания фильма
  country: {
    type: String,
    required: true,
  },
  // режиссёр фильма
  director: {
    type: String,
    required: true,
  },
  // длительность фильма
  duration: {
    type: Number,
    required: true,
  },
  // год выпуска фильма
  year: {
    type: String,
    required: true,
  },
  // описание фильма
  description: {
    type: String,
    required: true,
  },
  // ссылка на постер к фильму
  image: {
    type: String,
    required: true,
    validate: {
      linkValidator,
    },
  },
  // ссылка на трейлер фильма
  trailer: {
    type: String,
    required: true,
    validate: {
      linkValidator,
    },
  },
  // миниатюрное изображение постера к фильму
  thumbnail: {
    type: String,
    required: true,
    validate: {
      linkValidator,
    },
  },
  // _id пользователя, который сохранил фильм
  owner: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  // id фильма, который содержится в ответе сервиса MoviesExplorer
  movieId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  // название фильма на русском языке
  nameRU: {
    type: String,
    required: true,
  },
  // название фильма на английском языке
  nameEN: {
    type: String,
    required: true,
  },
}, { versionKey: false });

module.exports = mongoose.model('movie', movieSchema);
