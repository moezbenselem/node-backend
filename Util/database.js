const Sequelize = require('Sequelize');

const sequelize = new Sequelize('4jraN2Zi9F', '4jraN2Zi9F', 'pK0eNzsaGp', {
  dialect: 'mysql',
  host: 'remotemysql.com'
});

module.exports = sequelize;
