const express = require('express');
const { connect } = require('mongoose');

const { PORT = 3005 } = process.env;
const app = express();

// подключаемся к серверу mongo
connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});