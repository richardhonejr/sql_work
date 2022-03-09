//setup the database connection with sequalize
const {Sequelize} = require('sequelize');
const config = new Sequelize("school_records", "root", "%Corel!123", { dialect: 'mysql' });

module.exports = config;


