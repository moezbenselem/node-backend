const Sequelize = require('sequelize');

const sequelize = new Sequelize('nXBb5bmcIs', 'nXBb5bmcIs', 'i9GVmzhQyi', {
  dialect: 'mysql',
  host: 'remotemysql.com'
});

module.exports = sequelize;
