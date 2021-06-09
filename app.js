const express = require('express');
const helmet = require('helmet'); // Защита приложения от web-уязвимостей путём настройки заголовков http
const { json, urlencoded } = require('body-parser');
const { connect } = require('mongoose');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes/index');
const { errorHandler } = require('./middlewares/errorHandler');

const { PORT = 3000, DB_PATH = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;
const app = express();

// подключаемся к серверу mongo
connect(DB_PATH, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);
// app.use(limiter);
app.use(helmet()); // Защита приложения от web-уязвимостей путём настройки заголовков http
app.use(json());
app.use(urlencoded({ extended: true }));

app.use(routes);
app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  // console.log(`App listening on port ${PORT}`);
});
