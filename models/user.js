const Sequelize = require('sequelize');

const sequelize = require('../Util/database');

const User = sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    token:{
        type:Sequelize.STRING,
        allowNull:true
    },
    expires:{
        type:Sequelize.INTEGER,
        allowNull:true,
        defaultValue: 3600

    },
    tokenCreation:{
        type:Sequelize.DATE,
        allowNull:true,
        defaultValue: Sequelize.NOW
    }

});

module.exports = User;