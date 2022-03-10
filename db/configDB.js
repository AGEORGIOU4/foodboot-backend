const { Sequelize } = require('sequelize');

const sequelize = () => new Sequelize('heroku_e2053978176d1ae', 'b88c11d0ffc112', '2f24a5b9', {
  host: 'us-cdbr-east-05.cleardb.net',
  dialect: 'mysql'
});

exports.sequelize = sequelize;