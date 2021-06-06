const express = require('express');
const { json, urlencoded } = require('body-parser');
const { connect } = require('mongoose');
const { createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

app.post('/signup', createUser);

// подключаемся к серверу mongo
connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

//! Хардкод. Переделать в следующем проекте
app.use((req, res, next) => {
  req.user = {
    _id: '60bd2b7eff506b1d186d08d2',
  };
  next();
});
//! =======================================

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

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
