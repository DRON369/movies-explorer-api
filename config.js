require('dotenv').config();

const { JWT_SECRET = 'dev-secret', DB_PATH = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

module.exports = {
  JWT_SECRET,
  DB_PATH,
};
