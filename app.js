const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Защита приложения от web-уязвимостей путём настройки заголовков http
const { json, urlencoded } = require('body-parser');
const { connect } = require('mongoose');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes/index');
const { errorHandler } = require('./middlewares/errorHandler');
const { DB_PATH } = require('./config');

const { PORT = 3000 } = process.env;
const app = express();
app.use(cors());
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
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // console.log(`App listening on port ${PORT}`);
});
