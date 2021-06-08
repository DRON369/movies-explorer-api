const express = require('express');
const helmet = require('helmet'); // Защита приложения от web-уязвимостей путём настройки заголовков http
const { json, urlencoded } = require('body-parser');
const { connect } = require('mongoose');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { emailValidator } = require('./middlewares/emailValidator');

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet()); // Защита приложения от web-уязвимостей путём настройки заголовков http
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(requestLogger);

app.post('/signin', login);
app.post('/signup', emailValidator, createUser);

// подключаемся к серверу mongo
connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use('/users', auth, require('./routes/users'));
app.use('/movies', auth, require('./routes/movies'));

app.get('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.use(errorLogger);

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
