const Sequelize = require('sequelize');

const sequelize = require('../Util/database');

const UserEvent = sequelize.define('userEvent',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },

});

module.exports = UserEvent;