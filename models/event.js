const Sequelize = require('sequelize');

const sequelize = require('../Util/database');

const Event = sequelize.define('event',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    title:{
        type:Sequelize.STRING,
        allowNull:false
    },
    place:{
        type:Sequelize.STRING,
        allowNull:false
    },
    type:{
        type:Sequelize.STRING
    },
    date:{
        type:Sequelize.STRING
    }

});

module.exports = Event;